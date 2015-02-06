<?php
/**
 * Ophmisu Trivia (https://github.com/wsergio/ophmisu)
 *
 * @package     Ophmisu
 * @author      Sergiu Valentin VLAD <sergiu@disruptive.academy>
 * @copyright   Copyright (c) 2012-2015 Sergiu Valentin VLAD
 * @license     http://opensource.org/licenses/MIT  The MIT License (MIT)
 * @link        https://github.com/wsergio/ophmisu
 */

require_once 'src/Ophmisu/core.php';

?><!DOCTYPE html>
<html ng-app="ophmisuApp">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1.0, width=device-width, maximum-scale=1.0" />
	<title>Ophmisu Trivia - joc trivia (realtime & web based) - pentru cei plictisiti </title>
	<meta name="description" content="Joc de cultura generala (trivia) - realtime, web based, in limba romana." />
	<meta name="keywords" content="joc,cultura,generala,trivia,intrebari,romana,web,based,ophmisu" />
	<link rel="canonical" href="<?php echo formatUrl(''); ?>">
	<link type="text/css" href="<?php echo formatUrl('assets/reset.css'); ?>" rel="stylesheet" />
	<link type="text/css" href="<?php echo formatUrl('assets/style.css'); ?>" rel="stylesheet" />
	<link type="text/css" href="<?php echo formatUrl('assets/bootstrap/todc-bootstrap.css'); ?>" rel="stylesheet" />
	<link type="text/css" href="<?php echo formatUrl('assets/themes/clean.css'); ?>" rel="stylesheet" id="themefile" />
	<link href='//fonts.googleapis.com/css?family=Droid+Sans:400,700' rel='stylesheet' type='text/css'>
	<link type="text/css" href="<?php echo formatUrl('js/jqueryui/css/ui-lightness/jquery-ui-1.8.23.custom.css'); ?>" rel="stylesheet" />
	<script type="text/javascript">
		var requestParams = decodeURIComponent(window.location.search.slice(1)).split('&').reduce(function _reduce (/*Object*/ a, /*String*/ b) {
			b = b.split('=');
			a[b[0]] = b[1];
			return a;
		}, {});
        var config = {
            'app': {
                'hostname': '<?php echo $config['app']['hostname'] ?>',
                'httpPort': '<?php echo $config['app']['httpPort'] ?>',
                'httpsPort': '<?php echo $config['app']['httpsPort'] ?>'
            }
        };
	</script>
	<script type="text/javascript" src="<?php echo formatUrl('js/angular.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/controllers.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/jquery-1.8.0.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/jqueryui/jquery-ui-1.8.23.custom.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/socket.io/socket.io-1.0.6.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/jquery.inputHistory.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/ophmisu.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/fb.js'); ?>"></script>
</head>
<body>
	<div id="fb-root"></div>
	<div id="wrap" class="wrapper">
		<div id="nickname">
			<form id="set-nickname" class="wrap">

                <div id="user-register-view" ng-controller="UserRegisterCtrl">

                <ul>
                    <li ng-repeat="phone in phones">
                        <span>{{phone.name}}</span>
                        <p>{{phone.snippet}}</p>
                    </li>
                </ul>
                    <p>Hello, {{name}}!</p>

                </div>
                <br>
                <input class="clean-gray btn btn-large" type="submit" value="Register">

				<h1>Ophmisu Trivia</h1>
				<input id="nick" placeholder="Nickname" /><input type="submit" value="Join" class="clean-gray btn btn-large" />
				<p><em>Connect with <a href="javascript:void(0);" onclick="return maybeLogin();" class="unavailable">Facebook</a> or join as <a href="javascript:void(0);" class="go-incognito">guest</a>.</em></p>
				<br />
				<br />
				<br />
				<p><a style="font-size:8pt;" href="/app.apk" target="_blank" class="btn btn-large">Install <img style="vertical-align: middle;" src="/assets/images/android.png" height="30" /> App</a>&nbsp;&nbsp;&nbsp;<a style="font-size:8pt;" href="https://github.com/wsergio/ophmisu" target="_blank" class="btn btn-large">Fork me on GitHub</a></p>
				<br />
				<p><small><a href="https://github.com/wsergio/ophmisu">Ophmisu Trivia</a> is open source and available under the <a href="http://opensource.org/licenses/MIT">MIT license</a>.</small></p>
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
    <?php if (!empty($config['app']['trackingCode'])) : ?>
        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', '<?php echo $config['app']['trackingCode']; ?>', 'auto');
            ga('send', 'pageview');
        </script>
    <?php endif; ?>
</body>
</html>