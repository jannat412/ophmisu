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
$labels = array(
    'ro_RO' => _('language_ro'),
    'en_US' => _('language_en')
);
?>

<ul class="nav navbar-nav navbar-right">
    <li class="dropdown">
        <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><?php echo $labels[$currentLocale]; ?> <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu">
            <li <?php echo $currentLocale == 'ro_RO' ? 'class="active"' : '' ?>><a href="<?php echo formatUrl('index.php?' . LOCALE_REQUEST_PARAM . '=ro_RO')?>"><?php __('language_ro'); ?></a></li>
            <li <?php echo $currentLocale == 'en_US' ? 'class="active"' : '' ?>><a href="<?php echo formatUrl('index.php?' . LOCALE_REQUEST_PARAM . '=en_US')?>"><?php __('language_en'); ?></a></li>
        </ul>
    </li>
</ul>