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


class Users
{
	public static function add($input)
	{
		$required_fields = array('username', 'password', 'password2', 'email');
		$errors = array();
		foreach ($required_fields as $field)
		{
			if (!isset($input[$field]))
			{
				$errors[] = 'Missing fields..';
				break;
			}
			$v = trim($input[$field]);
			if (empty($v))
			{
				$errors[] = 'Missing fields..';
				break;
			}
		}
		if (!empty($errors)) {}
		elseif (strlen($input['password']) < 4)
		{
			$errors[] = 'A minimum 4 characters password is required';
		} elseif ($input['password'] != $input['password2'])
		{
			$errors[] = 'Password confirmation mismatch';
		}
		
		if (!empty($errors)) return array('errors' => $errors);
		
		$exists = db_field('SELECT user_id FROM users WHERE username = ?s OR nickname = ?s', $input['username'], $input['username']);
		if (!empty($exists)) { return array('errors' => array('Username not available, try another..')); }
		
		$user_id = db_query('INSERT INTO users ?e', $input);
		
		return true;
		
	}
}