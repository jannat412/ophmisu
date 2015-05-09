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


$config = array();

$config['database'] = array();
$config['database']['name'] = 'ophmisu';
$config['database']['username'] = 'ophmisu';
$config['database']['password'] = '';
$config['database']['hostname'] = '127.0.0.1';

$config['app'] = array();
$config['app']['path'] = '/';
$config['app']['hostname'] = $_SERVER['HTTP_HOST'];
$config['app']['httpPort'] = 2013;
$config['app']['httpsPort'] = 2014;
$config['app']['trackingCode'] = 'UA-29128613-11';
$config['app']['timezone'] = 'Europe/London';

$config['app']['languages'] = array();
$config['app']['languages']['default'] = 'en_US';
$config['app']['languages']['available'] = ['en_US', 'ro_RO'];

if (file_exists('config.local.php')) {
    require_once('config.local.php');
}

return $config;