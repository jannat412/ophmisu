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
	<title><?php __('homepage_title'); ?></title>
	<meta name="description" content="Joc de cultura generala (trivia) - realtime, web based, in limba romana." />
	<meta name="keywords" content="joc,cultura,generala,trivia,intrebari,romana,web,based,ophmisu" />
	<link rel="canonical" href="<?php echo formatUrl(''); ?>">
	<link type="text/css" href="<?php echo formatUrl('assets/reset.css'); ?>" rel="stylesheet" />
	<link type="text/css" href="<?php echo formatUrl('assets/style.css'); ?>" rel="stylesheet" />
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

    <script type="text/javascript" src="<?php echo formatUrl('bower_components/jquery/dist/jquery.min.js'); ?>"></script>

    <link type="text/css" href="<?php echo formatUrl('bower_components/bootstrap/dist/css/bootstrap.min.css'); ?>" rel="stylesheet" />
    <link type="text/css" href="<?php echo formatUrl('bower_components/bootstrap/dist/css/bootstrap-theme.min.css'); ?>" rel="stylesheet" />
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/bootstrap/dist/js/bootstrap.min.js'); ?>"></script>

	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular/angular.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular-bootstrap/ui-bootstrap.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'); ?>"></script>

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











                    <div class="container-fluid" ng-controller="UserController">
                        <div class="row">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 center-block">
                                <h1>Ophmisu Trivia (<?php echo getLocale(); ?>)</h1>
                                <ul>
                                    <li ng-repeat="error in errors">
                                        <div class="alert alert-danger" role="alert">
                                            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                                            <span class="sr-only">Error:</span>
                                            {{ error}}
                                        </div>
                                    </li>
                                </ul>
                                <ul>
                                    <li ng-repeat="msg in messages">
                                        <div class="alert alert-success" role="alert">
                                            <span><strong>Well done!</strong></span>
                                            {{ msg }}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 center-block">
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <form ng-submit="login()">
                                        <div id="home" class="panel panel-default">
                                            <div class="panel-heading">Login</div>
                                            <div class="panel-body">
                                                <div class="">
                                                    <input ng-model="form.username" type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">
                                                </div>
                                                <div class="">
                                                    <input ng-model="form.password" type="password" class="form-control" placeholder="Password" aria-describedby="basic-addon1">
                                                </div>

                                            </div>
                                            <div class="panel-footer">
                                                <div class="input-group">
                                                    <button type="submit" class="btn btn-default">Login</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <form ng-submit="register()">
                                        <div id="home" class="panel panel-default">
                                            <div class="panel-heading">Sign up</div>
                                            <div class="panel-body">
                                                <div class="">
                                                    <input ng-model="form.username" type="text" class="form-control" placeholder="Username" aria-describedby="basic-addon1">
                                                </div>
                                                <div class="">
                                                    <input ng-model="form.password" type="password" class="form-control" placeholder="Password" aria-describedby="basic-addon1">
                                                </div>
                                                <div class="">
                                                    <input ng-model="form.email" type="email" class="form-control" placeholder="Email" aria-describedby="basic-addon1">
                                                </div>
                                            </div>
                                            <div class="panel-footer">
                                                <div class="input-group">
                                                    <button type="submit" class="btn btn-default">Sign up</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>


            <form id="set-nickname" class="wrap">









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