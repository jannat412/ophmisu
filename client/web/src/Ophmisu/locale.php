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

define('SESSION_LOCALE_KEY', 'locale');
define('DEFAULT_LOCALE', $config['app']['languages']['default']);
define('LOCALE_REQUEST_PARAM', 'lang');
define('WEBSITE_DOMAIN', 'messages');
define('LANG_DIR', dirname(__FILE__) . '/../../../lang/');

if (array_key_exists(LOCALE_REQUEST_PARAM, $_REQUEST) && isSupportedLocale($_REQUEST[LOCALE_REQUEST_PARAM])) {
    $current_locale = $_REQUEST[LOCALE_REQUEST_PARAM];
} elseif (array_key_exists(SESSION_LOCALE_KEY, $_SESSION) && isSupportedLocale($_SESSION[SESSION_LOCALE_KEY])) {
    $current_locale = $_SESSION[SESSION_LOCALE_KEY];
} else {
    $current_locale = DEFAULT_LOCALE;
}
$_SESSION[SESSION_LOCALE_KEY] = $current_locale;
putenv("LC_ALL=$current_locale");
setlocale(LC_ALL, $current_locale, str_replace('_', '-', strtolower($current_locale)));
if (!file_exists(LANG_DIR)) {
    die('Languages directory not found: ' . LANG_DIR);
}
bindtextdomain(WEBSITE_DOMAIN, LANG_DIR);
bind_textdomain_codeset(WEBSITE_DOMAIN, 'UTF-8');
textdomain(WEBSITE_DOMAIN);

function isSupportedLocale($locale)
{
    global $config;
    return in_array($locale, $config['app']['languages']['available']);
}

function getLocale()
{
    return isset($_SESSION[SESSION_LOCALE_KEY]) ? $_SESSION[SESSION_LOCALE_KEY] : '';
}

function __($text)
{
    echo _($text);
}