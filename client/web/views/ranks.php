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


        <div class="home-page" ng-controller="UserController">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 center-block">
                <h1><?php __('ranks_block_title'); ?></h1>
                <?php include_once('errors.php'); ?>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 center-block">
                <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th><?php __('rank'); ?></th>
                                <th><?php __('username'); ?></th>
                                <th><?php __('score'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="user in ranks">
                                <td>{{ user.rank }}</td>
                                <td>{{ user.nickname }}</td>
                                <td>{{ user.score }}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    </div>
</div>
