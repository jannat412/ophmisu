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
                <h1><?php __('homepage_title'); ?></h1>
                <?php include_once('errors.php'); ?>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 center-block">
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <form ng-submit="login()">
                        <div class="panel panel-default">
                            <div class="panel-heading"><?php __('login_block_title'); ?></div>
                            <div class="panel-body">
                                <div class="">
                                    <input ng-model="form.username" type="text" class="form-control" placeholder="<?php __('username'); ?>" aria-describedby="basic-addon1">
                                </div>
                                <div class="">
                                    <input ng-model="form.password" type="password" class="form-control" placeholder="<?php __('password'); ?>" aria-describedby="basic-addon1">
                                </div>

                            </div>
                            <div class="panel-footer">
                                <div class="input-group">
                                    <button type="submit" class="btn btn-default"><?php __('login_block_button'); ?></button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <form ng-submit="register()">
                        <div class="panel panel-default">
                            <div class="panel-heading"><?php __('register_block_title'); ?></div>
                            <div class="panel-body">
                                <div class="">
                                    <input ng-model="form.username" type="text" class="form-control" placeholder="<?php __('username'); ?>" aria-describedby="basic-addon1">
                                </div>
                                <div class="">
                                    <input ng-model="form.password" type="password" class="form-control" placeholder="<?php __('password'); ?>" aria-describedby="basic-addon1">
                                </div>
                                <div class="">
                                    <input ng-model="form.email" type="email" class="form-control" placeholder="<?php __('email'); ?>" aria-describedby="basic-addon1">
                                </div>
                            </div>
                            <div class="panel-footer">
                                <div class="input-group">
                                    <button type="submit" class="btn btn-default"><?php __('register_block_button'); ?></button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <?php echo getRecentActivity(); ?>
                </div>
            </div>
        </div>


    </div>
</div>