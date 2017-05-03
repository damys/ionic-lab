/**
 * Created by htzhanglong on 2015/8/2.
 */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.controllers','starter.config','starter.services','starter.directive','ngResource'])

/*
*     .run(function($ionicPlatform) {
 $ionicPlatform.ready(function() {
 // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
 // for form inputs)
 if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
 cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
 }
 if (window.StatusBar) {
 // org.apache.cordova.statusbar required
 StatusBar.styleLightContent();
 }
 });
 })
* */

    .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {


        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/home/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('tab.article', {
                url: '/article',
                views: {
                    'tab-article': {
                        templateUrl: 'templates/article/article.html',
                        controller: 'ArticleCtrl'
                    }
                }
            })
            .state('tab.thread', {
                url: '/thread',
                views: {
                    'tab-thread': {
                        templateUrl: 'templates/thread/thread.html',
                        controller: 'ThreadCtrl'
                    }
                }
            })
            .state('tab.news_content', {
                url: '/news_content/:aid',

                views: {
                    'tab-article': {
                        templateUrl: "templates/article/article-content.html",
                        controller: 'NewsContentCtrl'
                    }
                }

            })
            .state('tab.thread_content', {
                url: '/thread_content/:tid',
                views: {
                    'tab-thread': {
                        templateUrl: "templates/thread/thread-content.html",
                        controller: 'ThreadContentCtrl'
                    }
                }
            })
            .state('tab.user', {
                url: '/user',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/user.html',
                        controller: 'UserCtrl'
                    }
                }
            })
            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })


            .state('tab.user-personal', {
                url: '/user/personal',
                views: {
                    'tab-user': {
                        templateUrl: 'templates/user/personal.html',
                        controller: 'PersonalCtrl'
                    }
                }
            })





        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/home');

    });
