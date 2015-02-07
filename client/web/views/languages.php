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
$currentLocale = getLocale();
// __('language_label')
$currentLanguageLabel = 'language_' . substr($currentLocale, 0, 2);
foreach ($config['app']['languages']['available'] as $locale) {
    $url = formatUrl('index.php?' . LOCALE_REQUEST_PARAM . '=' . $locale);
    $lang = substr($locale, 0, 2);
    $label = "language_" . $lang;
    $active = $locale == $currentLocale ? 'class="active"' : '';
    $html .= '<li '.$active.'><a href="'. $url .'">'.$label.'</a></li>';
}
?>

<ul class="nav navbar-nav navbar-right">

    <li class="dropdown">
        <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><?php echo $currentLanguageLabel; ?> <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu">
            <?php echo $html; ?>
        </ul>
    </li>
</ul>