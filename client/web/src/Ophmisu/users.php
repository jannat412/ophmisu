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
    const TYPE_USER = 'U';
    const TYPE_ADMIN = 'A';

	public static function findByUsername($username)
    {
        $user = db_row('SELECT * FROM users WHERE username = ?s', $username);

        return $user;
    }
	public static function login($username, $password)
    {
        $user = self::findByUsername($username);
        if (empty($user)) {
            return false;
        }
        if ($user['password'] == crypt($password, $user['password'])) {
            $now = new \DateTime('now');
            db_query('UPDATE users SET last_login_date = ?s WHERE user_id = ?i', $now->format('Y-m-d H:i:s'), $user['user_id']);

            return true;
        }

        return false;
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
		elseif (strlen($input['password']) < 1)
		{
			$errors[] = 'A minimum 1 characters password is required';
		}
		
		if (!empty($errors)) return array('errors' => $errors);

        $input['nickname'] = empty($input['nickname']) ? $input['username'] : $input['nickname'];

		$exists = db_field('SELECT user_id FROM users WHERE username = ?s OR nickname = ?s', $input['username'], $input['username']);
		if (!empty($exists)) {
            return array('errors' => array('Username not available, try another..'));
        }
        $now = new \DateTime('now');
        $input['password'] = crypt($input['password']);
        $input['type'] = self::TYPE_USER;
        $input['create_date'] = $now->format('Y-m-d h:i:s');

		$user_id = db_query('INSERT INTO users ?e', $input);

        return array('messages' => array('Your account has been created!'));
	}

    public static function getRanks()
    {
        $users = db_array('
            SELECT
                user_id,
                username,
                nickname,
                DATE_FORMAT(last_login_date, "%Y-%m-%dT%T") AS last_login_date,
                score
            FROM users
            WHERE score > 0
            ORDER BY score DESC, user_id ASC
            ');
        foreach ($users as $i => &$user) {
            $user['rank'] = $i + 1;
        }

        return $users;
    }
}