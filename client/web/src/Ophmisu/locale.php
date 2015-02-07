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
define('DEFAULT_LOCALE', 'en_US');
define('LOCALE_REQUEST_PARAM', 'lang');
define('WEBSITE_DOMAIN', 'messages');
define('LANG_DIR', dirname(__FILE__) . '../../../lang');

if (array_key_exists(LOCALE_REQUEST_PARAM, $_REQUEST)) {
    $current_locale = $_REQUEST[LOCALE_REQUEST_PARAM];
    $_SESSION[SESSION_LOCALE_KEY] = $current_locale;
} elseif (array_key_exists(SESSION_LOCALE_KEY, $_SESSION)) {
    $current_locale = $_SESSION[SESSION_LOCALE_KEY];
} else {
    $current_locale = DEFAULT_LOCALE;
}
putenv("LC_ALL=$current_locale");
setlocale(LC_ALL, $current_locale);
if (!file_exists(LANG_DIR)) {
    die('Languages directory not found');
}
bindtextdomain(WEBSITE_DOMAIN, LANG_DIR);
bind_textdomain_codeset(WEBSITE_DOMAIN, 'UTF-8');
textdomain(WEBSITE_DOMAIN);

function getLocale()
{
    return $_SESSION[SESSION_LOCALE_KEY];
}
function __($text)
{
    echo _($text);
}