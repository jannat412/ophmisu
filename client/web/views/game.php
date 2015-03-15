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
<div class="container-fluid" data-ng-controller="GameController">
    <div class="row full-height">
        <div class="col-xs-4 col-sm-2 col-md-2 col-lg-2 full-height">
            <div class="sidebar full-height">
                <ul role="menu">
                    <li role="presentation" ng-repeat="user in users">
                        <a href="javascript:void(0);">{{ user }}</a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-xs-8 col-sm-10 col-md-10 col-lg-10">

            <div id="chat">
                <div id="header" class="wrapper">
                    <div id="controls">
                        <a id="clear" href="javascript:void(0);" title="Clear messages" class="">Clear</a>
                        <!-- <a id="reconnect" href="javascript:void(0);" title="Reconnect" class="">Reconnect</a> -->
                        <a id="logout" href="javascript:void(0);" ui-sref="home" title="Logout" class="">Disconnect</a>
                    </div>
                    <div class="hdn">Available chat rooms: <span id="rooms"></span></div>
                    <div id="nicknames"></div>
                </div>

                <div id="lines">
                    <div role="presentation" ng-repeat="message in messages track by $index">
                        <p>
                            <span class="time" ng-if="message.time != ''">{{ message.time }}</span>
                            <span class="user" ng-if="message.sender != ''">{{ message.sender }}</span>
                            <span class="content" ng-bind-html="message.text|vsprintf:message.args"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>



        <div class="col-lg-12">
            <nav class="navbar navbar-default navbar-fixed-bottom">
                <form ng-submit="talk()">
                    <div class="input-group input-group-lg">
                        <input ng-model="currentMessage" type="text" placeholder="" class="form-control">
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-default"><?php __('send') ?></button>
                            </span>
                    </div>
                </form>
            </nav>
        </div>


    </div>




</div>
</div>


