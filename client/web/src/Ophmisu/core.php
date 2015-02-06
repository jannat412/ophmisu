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

date_default_timezone_set('Europe/Bucharest');
ini_set('display_errors', 1);

define('AREA', 'user');
define('ACTIVITY_LOG_FILE', 'activity.txt');
$config = require_once 'config.php';

require_once 'functions.php';
require_once 'users.php';
require_once 'fb.php';

session_start();
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


if ($_POST)
{
	$dispatch = $_REQUEST['dispatch'];
	$redirect = '.';
	if ($dispatch == 'register')
	{
		$data = array();
		
		$data['username'] = $_REQUEST['username'];
		$data['email'] = $_REQUEST['email'];
		$data['password'] = $_REQUEST['password'];
		$data['password2'] = $_REQUEST['password2'];
		$_SESSION['temp'] = $data;
		
		$r = Users::add($data);
		
		if (!empty($r['errors']))
		{
			$_SESSION['errors'] = $r['errors'];
		}
		$redirect = $r === true ? '.' : '.';
		
	}
	
	header('Location: '.$redirect);
	exit;
}