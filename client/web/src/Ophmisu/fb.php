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
namespace Ophmisu;

use Ophmisu\Authentication\Facebook;

if (!empty($_POST['auth']) && $_POST['auth'] == 'facebook')
{

	$auth = $_POST['accessToken'];
	$userID = $_POST['userID'];
	$accessToken = $_POST['accessToken'];
	$state = Facebook::exists($userID, $accessToken);
	$data = array('state' => $state);
	if ($state < 1)
	{
	}
	else
	{
		$data['user_data'] = Facebook::get($userID, $accessToken);
	}
	$data = json_encode($data);
	echo $data;
	exit;
}


if (!empty($_POST['register']) && $_POST['register'] == 'facebook')
{

	$data = $_POST['data'];
	$data['userID'] = $_POST['userID'];
	$data['accessToken'] = $_POST['accessToken'];
	
	$state = Facebook::exists($data['userID'], $data['accessToken']);
	if ($state == -1)
	{
		$user_id = Facebook::add($data);
	}
	if ($state == 0)
	{
		$user_id = Facebook::update($data['userID'], $data);
	}
	
	$data['user_data'] = Facebook::get($_POST['userID'], $_POST['accessToken']);
	$data = json_encode($data);
	echo $data;
	exit;
}