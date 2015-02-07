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
?>
<ul>
    <li ng-repeat="error in errors">
        <div class="alert alert-danger" role="alert">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span class="sr-only"><?php __('error_label'); ?></span>
            {{ error}}
        </div>
    </li>
</ul>
<ul>
    <li ng-repeat="msg in messages">
        <div class="alert alert-success" role="alert">
            <span><strong><?php __('success_label'); ?></strong></span>
            {{ msg }}
        </div>
    </li>
</ul>