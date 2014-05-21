<?php
if (!defined('HOST')) define('HOST', $_SERVER['HTTP_HOST']);
date_default_timezone_set('Europe/Bucharest');
ini_set('display_errors', 1);
require_once 'functions.php';

require_once 'users.php';
require_once 'fb.php';
define('ACTIVITY_LOG_FILE', 'activity.txt');

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
function getRecentActivity()
{
	global $activity;
	if (empty($activity)) return;
	$html = '';
	foreach ($activity as $entry)
	{
		list($time, $type, $args) = $entry;
		if ($type == 'user message')
		{
			$html .= '<p>'.microdataTime($time).microdataPerson($args[0]).'<span class="message">'.$args[1].'</span></p>';
		}
	}
	if (empty($html)) return '';
	$html = '<div class="recent-activity lines"><h2>Recent activity</h2>'.$html.'</div>';
	return $html;
}

if (isset($_REQUEST['ra']))
{
	echo getRecentActivity();
	exit;
}

function gs($var)
{
	return empty($_SESSION['temp'][$var]) ? '' : $_SESSION['temp'][$var];
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