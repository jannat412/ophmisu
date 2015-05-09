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
<html ng-app="ophmisu">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1.0, width=device-width, maximum-scale=1.0" />
	<title><?php __('homepage_page_title'); ?></title>
	<meta name="description" content="<?php __('homepage_meta_description'); ?>" />
	<meta name="keywords" content="<?php __('homepage_meta_keywords'); ?>" />
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
        <?php
            echo 'var translationMap = '.json_encode($translationMap) . ';';
        ?>
	</script>

    <script type="text/javascript" src="<?php echo formatUrl('bower_components/jquery/dist/jquery.min.js'); ?>"></script>

    <link type="text/css" href="//bootswatch.com/cosmo/bootstrap.min.css" rel="stylesheet" />
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/bootstrap/dist/js/bootstrap.min.js'); ?>"></script>

	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular/angular.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular-ui-router/release/angular-ui-router.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular-sanitize/angular-sanitize.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular-animate/angular-animate.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular-bootstrap/ui-bootstrap.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/angular-socket-io/socket.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/sprintf/dist/sprintf.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('bower_components/sprintf/dist/angular-sprintf.min.js'); ?>"></script>

	<script type="text/javascript" src="<?php echo formatUrl('js/ophmisu.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/ophmisu-user.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/ophmisu-game.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/ophmisu-engine.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/ophmisu-translator.js'); ?>"></script>
    <script type="text/javascript" src="<?php echo formatUrl('js/socket.io/socket.io-1.0.6.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/jqueryui/jquery-ui-1.8.23.custom.min.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo formatUrl('js/jquery.inputHistory.js'); ?>"></script>
</head>
<body ng-controller="AppController">
	<div id="fb-root"></div>

    <div class="view-animate-container">

        <!-- Fixed navbar -->
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">

                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" ui-sref="home" href="#"><?php __('homepage_title'); ?></a>
                </div>

                <div id="navbar" class="navbar-collapse collapse">

                    <ul class="nav navbar-nav navbar-right">
                        <li>
                            <a href="javascript:void(0);" ui-sref="game" class=""><?php __('game'); ?>
                                <span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" ui-sref="profile" role="button" aria-expanded="false">
                                <?php __('profile'); ?>
                                <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0);" ng-click="disconnect()" role="button" aria-expanded="false">
                                <?php __('logout'); ?>
                                <span class="glyphicon glyphicon-log-out" aria-hidden="true"></span>
                            </a>

                        </li>
                        <?php include 'views/languages.php';?>
                    </ul>
                </div><!--/.nav-collapse -->

            </div>
        </nav>
        <div ui-view class="view-animate">
        </div>
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