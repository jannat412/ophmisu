<?php
/**
 * Ophmisu Trivia (https://github.com/wsergio/ophmisu)
 *
 * @package     Ophmisu
 * @author      Sergiu Valentin VLAD <sergiu@disruptive.academy>
 * @copyright   Copyright (c) 2012-2015 Sergiu Valentin VLAD
 * @license     http://opensource.org/licenses/MIT  The MIT License (MIT)
 * @link        https://github.com/wsergio/ophmisu
 * @link        http://ophmisu.com
 */

function formatUrl($uri, $protocol = 'auto')
{
    global $config;
    
    if ($protocol == 'auto') {
        $protocol = 'http';
        if (stripos($_SERVER['SERVER_PROTOCOL'],'https') === true) {
            $protocol = 'https';
        }
        if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') {
            $protocol = 'https';
        }
    }
    
    return $protocol . '://' . $config['app']['hostname'] . $config['app']['path'] . trim($uri, '/');
}
function gs($var)
{
    return empty($_SESSION['temp'][$var]) ? '' : $_SESSION['temp'][$var];
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
    return '';
    return $html;
}

function microdataTime($time)
{
	return '<time datetime="'.date('Y-m-d h:i:s', $time).'" class="time">'.ago($time).'</time>';
}
function microdataPerson($nickname)
{
	return '<span itemscope itemtype="http://data-vocabulary.org/Person"><span class="user" itemprop="name"><a target="_blank" href="https://ophmisu.com/people/'.$nickname.'" itemprop="url">'.$nickname.'</a></span><span class="hdn" itemprop="role">player</span></span>';
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