<?php
if (!defined('HOST')) define('HOST', $_SERVER['HTTP_HOST']);
session_start();

if (isset($_REQUEST['å'])) 
	if (!isset($_SESSION['å'])) $_SESSION['å'] = 1;
	else unset($_SESSION['å']);
	
if (isset($_REQUEST['isdj'])) 
	if (!isset($_SESSION['isdj'])) $_SESSION['isdj'] = 1;
	else unset($_SESSION['isdj']);
function is_dj()
{
	return isset($_SESSION['isdj']);
}
function is_me()
{
	return isset($_SESSION['å']);
}

if (!function_exists('is_developer')) { function is_developer() { return true; } }
if (!function_exists('aa')) { function aa($a, $flag=0) { /* code stripped */ } }
if (!function_exists('fnx')) { function fnx($a = '') { /* code stripped */ } }

define('AREA', 'user');

define('DB_HOST', 'localhost');
define('DB_NAME', 'ophmisu');
define('DB_USER', 'ophmisu');
define('DB_PASS', '');

require_once 'lib/db/db.php';
global $db;
$db = db_initiate(DB_HOST, DB_USER, DB_PASS, DB_NAME);



function microdataTime($time)
{
	return '<time datetime="'.date('Y-m-d h:i:s', $time).'" class="time">'.ago($time).'</time>';
}
function microdataPerson($nickname)
{
	return '<span itemscope itemtype="http://data-vocabulary.org/Person"><span class="user" itemprop="name"><a target="_blank" href="https://trivia.play.ai/people/'.$nickname.'" itemprop="url">'.$nickname.'</a></span><span class="hdn" itemprop="role">player</span></span>';
}


function ago($datefrom, $dateto=-1)
{
	if($datefrom==0) { return "A long time ago"; }
	if($dateto==-1) { $dateto = time(); }

	$difference = $dateto - $datefrom;

	switch(true)
	{
		case(strtotime('-1 min', $dateto) < $datefrom):
			$datediff = $difference;
			$res = ($datediff==1) ? $datediff.' second ago' : $datediff.' seconds ago';
			break;
		case(strtotime('-1 hour', $dateto) < $datefrom):
			$datediff = floor($difference / 60);
			$res = ($datediff==1) ? $datediff.' minute ago' : $datediff.' minutes ago';
			break;
		case(strtotime('-1 day', $dateto) < $datefrom):
			$datediff = floor($difference / 60 / 60);
			$res = ($datediff==1) ? $datediff.' hour ago' : $datediff.' hours ago';
			break;
		case(strtotime('-1 week', $dateto) < $datefrom):
			$day_difference = 1;
			while (strtotime('-'.$day_difference.' day', $dateto) >= $datefrom)
			{
				$day_difference++;
			}

			$datediff = $day_difference;
			$res = ($datediff==1) ? 'yesterday' : $datediff.' days ago';
			break;
		case(strtotime('-1 month', $dateto) < $datefrom):
			$week_difference = 1;
			while (strtotime('-'.$week_difference.' week', $dateto) >= $datefrom)
			{
				$week_difference++;
			}

			$datediff = $week_difference;
			$res = ($datediff==1) ? 'last week' : $datediff.' weeks ago';
			break;
		case(strtotime('-1 year', $dateto) < $datefrom):
			$months_difference = 1;
			while (strtotime('-'.$months_difference.' month', $dateto) >= $datefrom)
			{
				$months_difference++;
			}

			$datediff = $months_difference;
			$res = ($datediff==1) ? $datediff.' month ago' : $datediff.' months ago';

			break;
		case(strtotime('-1 year', $dateto) >= $datefrom):
			$year_difference = 1;
			while (strtotime('-'.$year_difference.' year', $dateto) >= $datefrom)
			{
				$year_difference++;
			}

			$datediff = $year_difference;
			$res = ($datediff==1) ? $datediff.' year ago' : $datediff.' years ago';
			break;

	}
	return $res;
}