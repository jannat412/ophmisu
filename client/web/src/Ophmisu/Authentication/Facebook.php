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

namespace Ophmisu\Authentication;


class Facebook
{
    public static function get($fb_user_id, $fb_access_token)
    {
        $data = db_row('SELECT * FROM user_data WHERE fb_user_id = ?i AND fb_access_token = ?s', $fb_user_id, $fb_access_token);
        return $data;
    }
    public static function add($data)
    {
        $user = array();
        $user['nickname'] = $data['first_name'].' '.$data['last_name'];
        $user_id = db_query('INSERT INTO users ?e', $user);
        $user_id = driver_db_insert_id();
        $user_data = array();
        $user_data['user_id'] = $user_id;
        $user_data['first_name'] = $data['first_name'];
        $user_data['middle_name'] = $data['middle_name'];
        $user_data['last_name'] = $data['last_name'];
        $user_data['link'] = $data['link'];
        $user_data['gender'] = $data['gender'];
        $user_data['nickname'] = $data['first_name'].' '.$data['last_name'];
        $user_data['fb_username'] = $data['username'];
        $user_data['fb_user_id'] = $data['userID'];
        $user_data['fb_access_token'] = $data['accessToken'];
        db_query('INSERT INTO user_data ?e', $user_data);
        return $user_id;
    }
    public static function update($fb_user_id, $data)
    {

        /* $user = array();
        $user['nickname'] = $data['first_name'].' '.$data['last_name'];
        $user_id = db_query('UPDATE users SET ?u WHERE fb_user_id = ?i', $user, $fb_user_id); */

        $user_data = array();
        $user_data['first_name'] = $data['first_name'];
        $user_data['middle_name'] = $data['middle_name'];
        $user_data['last_name'] = $data['last_name'];
        $user_data['link'] = $data['link'];
        $user_data['gender'] = $data['gender'];
        $user_data['nickname'] = $data['first_name'].' '.$data['last_name'];
        $user_data['fb_username'] = $data['username'];
        $user_data['fb_user_id'] = $data['userID'];
        $user_data['fb_access_token'] = $data['accessToken'];
        db_query('UPDATE user_data SET ?u WHERE fb_user_id = ?i', $user_data, $fb_user_id);
    }
    public static function exists($fb_user_id, $fb_access_token)
    {
        $user_id = db_field('SELECT user_id FROM user_data WHERE fb_user_id = ?i', $fb_user_id);
        if (empty($user_id)) return -1; // user does not exists
        $valid_token = db_field('SELECT user_id FROM user_data WHERE fb_user_id = ?i AND fb_access_token = ?s', $fb_user_id, $fb_access_token);
        if (empty($valid_token)) return 0; // user exists, but invalid token, maybe reauth?
        return 1; // all ok
    }
}