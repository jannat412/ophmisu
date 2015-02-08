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
<div class="container-fluid">
    <div class="row">

        <div class="home-page" ng-controller="GameController">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 center-block">
                <h1><?php __('Connecting'); ?></h1>
                <?php include_once('errors.php'); ?>
                <div class="input-group">
                    <button ng-click="connect()" type="submit" class="btn btn-default"><?php __('connect'); ?></button>
                    <button ui-sref="home" type="submit" class="btn btn-default"><?php __('cancel'); ?></button>
                </div>
            </div>
        </div>

    </div>
</div>