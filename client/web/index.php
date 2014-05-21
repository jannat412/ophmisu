<?php require_once 'core.php'; ?><!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1.0, width=device-width, maximum-scale=1.0" />
	<title>Ophmisu Trivia - joc trivia (realtime & web based) - pentru cei plictisiti </title>
	<meta name="description" content="Joc de cultura generala (trivia) - realtime, web based, in limba romana." />
	<meta name="keywords" content="joc,cultura,generala,trivia,intrebari,romana,web,based,ophmisu" />
	<link rel="canonical" href="https://trivia.play.ai/">
	<link type="text/css" href="/assets/reset.css" rel="stylesheet" />
	<link type="text/css" href="/assets/style.css" rel="stylesheet" />
	<link type="text/css" href="/assets/bootstrap/todc-bootstrap.css" rel="stylesheet" />
	<link type="text/css" href="/assets/themes/clean.css" rel="stylesheet" id="themefile" />
	<link href='//fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
	<link type="text/css" href="/lib/js/jqueryui/css/ui-lightness/jquery-ui-1.8.23.custom.css" rel="stylesheet" />
	<script type="text/javascript">
		var HOST = "<?php echo HOST; ?>";
		var requestParams = decodeURIComponent(window.location.search.slice(1)).split('&').reduce(function _reduce (/*Object*/ a, /*String*/ b) {
			b = b.split('=');
			a[b[0]] = b[1];
			return a;
		}, {});
	</script>
	<script type="text/javascript" src="/lib/js/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="/lib/js/jqueryui/jquery-ui-1.8.23.custom.min.js"></script>
	<script type="text/javascript" src="/lib/js/socket.io/socket.io.min.js"></script>
	<script type="text/javascript" src="/lib/js/jquery.inputHistory.js"></script>
	<script type="text/javascript" src="/lib/js/ophmisu.js"></script>
	<script type="text/javascript" src="/lib/js/fb.js"></script>
</head>
<body>
	<div id="fb-root"></div>
	<div id="wrap" class="wrapper">
		<div id="nickname">
			<form id="set-nickname" class="wrap">
				<h1>Ophmisu Trivia</h1>
				<input id="nick" placeholder="Nickname" /><input type="submit" value="Join" class="clean-gray btn btn-large" />
				<p><em>Connect with <a href="javascript:void(0);" onclick="return maybeLogin();" class="unavailable">Facebook</a> or join as <a href="javascript:void(0);" class="go-incognito">guest</a>.</em></p>
				<br />
				<br />
				<br />
				<p><a style="font-size:8pt;" href="/app.apk" target="_blank" class="btn btn-large">Install <img style="vertical-align: middle;" src="/assets/images/android.png" height="30" /> App</a>&nbsp;&nbsp;&nbsp;<a style="font-size:8pt;" href="https://github.com/wsergio/ophmisu" target="_blank" class="btn btn-large">Fork me on GitHub</a></p>
				<br />
				<p><small><a href="https://github.com/wsergio/ophmisu">Ophmisu Trivia</a> is open source and available under the <a href="http://opensource.org/licenses/MIT">MIT license</a>.</small></p>
				<p><small>About <a href="/about.html">trivia.play.ai</a>.</small></p>
			</form>
			
			<?php echo getRecentActivity(); ?>
		</div>
		
		<!--googleoff: all-->
		<div id="connecting">
			<div class="wrap">
				<p>Connecting to server..</p>
				<br />
				<p><a id="logout" href="javascript:void(0);" title="Logout" class="">Cancel</a></p>
			</div>
		</div>
		<div id="chat">
			<div id="header" class="wrapper">
				<div id="controls">
					<a id="clear" href="javascript:void(0);" title="Clear messages" class="">Clear</a>
					<!-- <a id="reconnect" href="javascript:void(0);" title="Reconnect" class="">Reconnect</a> -->
					<a id="logout" href="javascript:void(0);" onclick="disconnect();" title="Logout" class="">Disconnect</a>
				</div>
				<div class="hdn">Available chat rooms: <span id="rooms"></span></div>
				<div id="nicknames"></div>
			</div>
			<div id="messages"><div id="lines"></div></div>
			<div id="send-message-wrap" class="wrapper">
				<div id="send-message-container">
					<form id="send-message">
						<input id="message" type="text" autocomplete="off" class="wrapper"><button class="btn">Send</button>
					</form>
				</div>
			</div>
		</div>
		<!--googleon: all-->
	</div>

	<script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-29128613-5']);
	  _gaq.push(['_trackPageview']);

	  (function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>
</body>
</html> 