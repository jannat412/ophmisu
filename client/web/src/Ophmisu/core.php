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

error_reporting(E_ALL);
date_default_timezone_set('Europe/Bucharest');
ini_set('display_errors', 0);
session_start();

define('AREA', 'user');
define('ACTIVITY_LOG_FILE', 'activity.txt');
$config = require_once 'config.php';

require_once 'locale.php';
require_once 'zerg.php';
require_once 'functions.php';
require_once 'users.php';
require_once 'fb.php';


require_once 'lib/db/db.php';
global $db;
$db = db_initiate(
    $config['database']['hostname'],
    $config['database']['username'],
    $config['database']['password'],
    $config['database']['name']
);

$activity = array();
if (file_exists(ACTIVITY_LOG_FILE))
{
	$activity = file_get_contents(ACTIVITY_LOG_FILE);
	if (!empty($activity))
	{
		$activity = json_decode($activity);
		if (json_last_error() === JSON_ERROR_NONE)
		{
			
		}
		else
			$activity = array();
	}
}


if (isset($_REQUEST['ra']))
{
	echo getRecentActivity();
	exit;
}

if (!empty($_REQUEST['view'])) {
    $view = $_REQUEST['view'];
    $view = html_entity_decode($view);
    $view = urldecode($view);
    $view = str_replace('..', '', $view);
    $filename = './views/' . $view . '.php';

    if (file_exists($filename)) {
        ob_start();
        include($filename);
        $content = ob_get_clean();
    } else {
        $content = 'Oops!';
    }

    echo $content;
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$dispatch = $_REQUEST['action'];
	$redirect = '.';
    $response = array();
    $post = json_decode(file_get_contents("php://input"), true);
    if ($dispatch == 'register') {
		$response = Users::add($post['form']);
	}
    if ($dispatch == 'login') {
        $username = $post['form']['username'];
        $password = $post['form']['password'];

        if (Users::login($username, $password)) {
            $response['messages'] = array('Okay!');
            $response['user'] = Users::findByUsername($username);
            unset($response['user']['password']);
        }
        else {
            $response['errors'] = array('No, you didn\'t!');
        }
    }
    $response = json_encode($response);
    print_r($response);
	exit;
}
