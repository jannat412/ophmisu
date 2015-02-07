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
	public static function login($input)
    {
        $user = db_row('SELECT * FROM users WHERE username = ?s', $input['username']);
        if (empty($user)) {
            return false;
        }
        return password_verify($input['password'], $user['password']);
    }
	public static function add($input)
	{
		$required_fields = array('username', 'password', 'email');
		$errors = array();
		foreach ($required_fields as $field)
		{
			if (!isset($input[$field]))
			{
				$errors[] = 'Please enter your '.$field;
				break;
			}
			$v = trim($input[$field]);
			if (empty($v))
			{
				$errors[] = 'Please enter your '.$field;
				break;
			}
		}
		if (!empty($errors)) {}
		elseif (strlen($input['password']) < 4)
		{
			$errors[] = 'A minimum 4 characters password is required';
		}
		
		if (!empty($errors)) return array('errors' => $errors);

        $input['nickname'] = empty($input['nickname']) ? $input['username'] : $input['nickname'];

		$exists = db_field('SELECT user_id FROM users WHERE username = ?s OR nickname = ?s', $input['username'], $input['username']);
		if (!empty($exists)) {
            return array('errors' => array('Username not available, try another..'));
        }
        $input['password'] = password_hash($input['password'], PASSWORD_DEFAULT);
		
		$user_id = db_query('INSERT INTO users ?e', $input);

        return array('messages' => array('Your account has been created!'));
//        return true;
		
	}
}