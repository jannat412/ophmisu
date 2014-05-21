var recentActivityId = 0;
function raOff()
{
	clearInterval(recentActivityId);
}
function raOn()
{
	raOff();
	recentActivityId = setInterval(function() {
		$.ajax({
			url: '/',
			data: {ra: true},
			success: function(data) {
				var c = $('.recent-activity');
				if (c) 
					c.replaceWith(data);
				else
					raOff();
			}
		});
	}, 60*1000);
}

var MAX_LINES = 100;
var socket;
var udata;

function delLS(key)
{
	if (typeof(localStorage) == 'object' && localStorage[key]) { localStorage.removeItem(key);  } 
}
function getLS(key, defaultValue)
{
	if (typeof(localStorage) == 'object' && localStorage[key]) { return localStorage[key]; } 
	else return defaultValue;
}
function setLS(key, value)
{
	if (typeof(localStorage) == 'object') 
	{
		localStorage[key] = value;
	}
}

function initSocket()
{
	if (socket)
	{
		socket.socket.reconnect();
		return;
	}
	try {
		var opts = {};
		opts.port = 2013;
		if (window.location.protocol == 'https:')
		{
			opts.port = 2014;
			opts.secure = true;
		}
		socket = io.connect('trivia.play.ai', opts);
		
	}
	catch (e)
	{
		console.log(e);
	}
	socket.on('connect', function () {
		var nickname = getLS('nickname');
		
		//_paq.push(['setCustomVariable',  1, "Nickname", nickname, "visit"]);
		//_paq.push(['trackGoal', 1, 1]);
		
		var default_room = '';
		if (requestParams.room) default_room = requestParams.room;
		var emit_data = {nickname: nickname, default_room: default_room};
		if (typeof(udata) != 'undefined' )
		{
			emit_data.fb_user_id = udata.fb_user_id;
			emit_data.fb_access_token = udata.fb_access_token;
		}
		socket.emit('nickname', emit_data, function (set) 
		{
			var nickname = getLS('nickname');
			$('.nickname.error').remove();
			if (!set) 
			{
				$('#chat').addClass('connected').show();
				$("#nickname, #connecting").hide();
				clear();
				localStorage.setItem('nickname', nickname);
				
				return $('#chat').addClass('nickname-set');
			}
			disconnect();
			$('.clean-gray').after('<p class="error nickname">Nickname already in use</p>');
		});
		
		
	});
	
	socket.on('update_rooms', function(rooms, current_room) {
		$('#rooms').empty();
		$.each(rooms, function(key, value) {
			if(value == current_room)
			{
				$('#rooms').append('<span class="active">' + value + '</span>');
			}
			else {
				$('#rooms').append('<span><a href="javascript:void(0);" onclick="return switchRoom(\''+value+'\')">' + value + '</a></span>');
			}
		});
	});

	socket.on('announcement', function (msg) {
		$('#lines').append($('<p>').append($('<em>').text(msg)));
		scrollDown();
	});

	socket.on('top', function (users) {
		if (!users) return;
		for (var i = 0; i < users.length; i++)
		{
			var user = users[i];
			var b = $('.'+user.nickname);
			if (b && b.length > 0) b.find('.score').html(user.score);
		}
	});
	socket.on('nicknames', function (nicknames) {
		var me = getLS('nickname');
		$('#nicknames').empty().append($('<span>Online: </span>'));
		for (var i in nicknames) {
			var n = nicknames[i];
			$('#nicknames').append($('<span class="'+n+(n == me ? ' self' : '')+'">').text(n).append('<span class="score">'));
		}
	});

	socket.on('user message', message);
	
	socket.on('reconnect', function () {
		$('#lines').html("");
		message('System', 'Reconnected to the server');
	});


	socket.on('error', function (e) 
	{
		if (!e || typeof(e) == "object") e = "Panic attack! Wtf just happened?!";
		message('System', e);
	});
	
	socket.on('disconnect', function (){
		console.log('disconnected');
	});
	socket.on('reconnect_failed', function () {
		console.log(a,b,c);
	});
	
	socket.on('connect_failed', function (a,b,c) {
		console.log(a,b,c);
	});
}
function switchRoom(room){
	socket.emit('switchRoom', room);
	return false;
}
function connect(user_data)
{
	raOff();
	if (user_data && user_data.nickname)
	{
		setLS('nickname', user_data.nickname);
		udata = user_data;
	}
	$('#nickname').hide();
	$('#connecting').show();
	initSocket();

}
function disconnect()
{
	raOn();
	socket.disconnect();
	delLS('nickname');
	$('#chat').hide();
	$('#connecting').hide();
	$('#nickname').show();
}

var lines = 0;
function message(from, msg) 
{
	msg = msg.replace(/</g, '&lt;');
	msg = msg.replace(/>/g, '&gt;');
	msg = $("<div/>").html(msg).text();
	
	msg = msg.replace(/\n/g, '<br />');
	msg = $('<p>').append('<span class="time">'+(new Date().format("isoTime"))+'</span>', $('<span class="user ophmisu">').text(from), msg);
	if (++lines > MAX_LINES)
		$('#lines p:first').remove();
	$('#lines').append(msg);
	if ($('#lines').length > 0)
		scrollDown();
}
function clear ()
{
	lines = 0;
	$('#message').val('').focus();
};
function sanitizeNickname(s) 
{
    if (s==='') return '';
    return s.replace(/[^a-zA-Z0-9.-]/g, '');
}
$(function () {
	raOn();
	$('#message').inputHistory({
		size: 5
	});


	$('#set-nickname').submit(function (ev) {
		var nickname = $('#nick').val();
		nickname = sanitizeNickname(nickname);
		if (nickname == '') return false;
		localStorage.setItem('nickname', nickname);
		connect();
		return false;
	});
	
	var recentNickname = localStorage.getItem('nickname');
	if (typeof(recentNickname) != 'undefined' && recentNickname != "") 
	{
		$('#nick').val(recentNickname);
		$('#set-nickname').trigger('submit');
	}

	$('#send-message').submit(function () {
		var text = $('#message').val();
		if (text == "") return false;
		message(localStorage.getItem('nickname'), text);
		socket.emit('user message', text);
		clear();
		scrollDown();
		return false;
	});


	$(document).keypress(function(event) {
		if (event.keyCode == 27) 
		{
			event.preventDefault();return false;
		}
	});
	
	
	$('#logout').click(function() { 
		disconnect();
	});
	$('#clear').click(function() { $('#lines').html(""); });
	
	$('.go-incognito').click(function() {
		var nick = getRandonNickname();
		$('#nick').val(nick);
		$('input.clean-gray').trigger('click');
	});
	
	var th = $("<div id='themes'></div>");
	for (var i in themes)
	{
		var theme = themes[i];
		var a = $('<a href="javascript:void(0);" class="'+theme+'" data-theme="'+theme+'">'+theme+'</a>');
		th.append(a);
		a.click(function() {
			localStorage.setItem('theme', $(this).attr('data-theme'));
			changeTheme();
		});
	}
	$('body').append(th);
	changeTheme();
	
	
	
});
var randomNicknames = ['Alan','Audrie','Christie','Marianela','Marlyn','Gustavo','Iraida','Euna','Gala','Vanesa','Maureen','Dexter','Dorian','Sergio','Sharen','Felisha','Estrella','Camila','Xiomara','Candy','Lissa','Amina','Marina','Lourdes','Emmy','Kathey','Paulina','Roland','Roxane','Jeanine','Tommy','Reta','Summer','Patrina','Laveta','Dewayne','Sanford','Lyndon','Heike','Sanda','Sibyl','Florentina','Shannon','Ethel','Rogelio','Sunny','Rob','Ollie','Kathryn','Sam','Classie','Ronni','Delana','Danica','Elfreda','Jefferey','Ivonne','Versie','Floy','Meredith','Irish','Jim','Vonnie','Dong','Kayce','Angla','Gaylene','Sherill','Hollie','Karon','Hermina','Elisha','Jestine','Deedee','Melynda','Stefani','Dori','Maria','Nydia','Marissa','Silvia','Jutta','Gerard','Maya','Sabine','Rosaura','Nakita','Dirk','Kathie','Velvet','Wen','Blanca','Bette','Therese','Shea','Darius','Cher','Herschel','Kali','Polly',];
var themes = ['clean', 'monochrome']; 
function getRandonNickname()
{
	return 'Guest-'+randomNicknames[Math.floor(Math.random()*randomNicknames.length)];
}
function down(selector)
{
	var obj = $(selector);
	obj.scrollTop = obj.scrollHeight;
}
function scrollDown()
{
	$('html, body').scrollTop(100000)
}
function changeTheme()
{
	var theme = localStorage.getItem('theme');
	if (theme)
		$('#themefile').attr('href', 'assets/themes/'+theme+'.css');
}


