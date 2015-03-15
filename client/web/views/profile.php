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
                <h1><?php __('profile_block_title'); ?></h1>
                <?php include_once('errors.php'); ?>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 center-block">
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 center-block">
                    <div class="jumbotron">
                        <form class="form-horizontal" ng-submit="update()">
                            <!--
                            <div class="input-group">
                                <span><?php __('nickname'); ?></span>
                                <input value="{{ user.nickname }}" type="text" class="form-control" placeholder="" aria-describedby="profile-nickname">
                            </div>
                            #}
                            -->

                            <div class="form-group">
                                <label for="profile_score" class="control-label col-xs-3"><?php __('profile_score'); ?></label>
                                <div class="col-xs-9">
                                    <span class="label label-success">{{ user.score }}</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="profile_username" class="control-label col-xs-3"><?php __('profile_username'); ?></label>
                                <div class="col-xs-9">
                                    <span class="label label-default">{{ user.username }}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="profile_email" class="control-label col-xs-3"><?php __('profile_email'); ?></label>
                                <div class="col-xs-9">
                                    <span class="label label-default">{{ user.email }}</span>
                                </div>
                            </div>


                            <br>
                            <div class="input-group">
                                <button type="submit" class="btn btn-primary disabled"><?php __('update'); ?></button>
                                &nbsp;&nbsp;<a class="btn btn-default" href="javascript:void(0);" ui-sref="game" class=""><?php __('return_to_game'); ?></a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
