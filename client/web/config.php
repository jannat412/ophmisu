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
$config['app']['hostname'] = 'trivia.play.ai';
$config['app']['path'] = '/';
$config['app']['trackingCode'] = 'UA-29128613-11';

if (file_exists('config.local.php')) {
    require_once('config.local.php');
}

return $config;