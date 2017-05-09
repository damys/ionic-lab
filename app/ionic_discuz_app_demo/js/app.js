angular.module('ionicApp', ['ionic','starter.controllers','starter.services','starter.config','ngResource','starter.directive'])

    .run([ '$rootScope', '$state', '$stateParams','$ionicPlatform', function ($rootScope,   $state,   $stateParams,$ionicPlatform) {

                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $ionicPlatform.ready(function() {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                 /*
                 *    if(window.cordova && window.cordova.plugins.Keyboard) {
                  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                  }
                  if(window.StatusBar) {
                  // org.apache.cordova.statusbar required
                  StatusBar.styleDefault();
                  }
                 * */

                    $rootScope.$state = $state;
                    $rootScope.$stateParams = $stateParams;
                    console.log($stateParams);
                });

            }
        ]
    )

    .config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider',function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');

      /*
      *   $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
       $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
      * */
        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('none');


    //    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
     //   $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })
            //首页
            .state('tabs.home', {
                url: "/home",
                views: {
                    'home-tab': {
                        templateUrl: "templates/home/home.html",
                        controller: 'HomeCtrl'
                    }
                }
            })
            //新闻
            .state('tabs.news', {
                url: "/news",
                views: {
                    'news-tab': {
                        templateUrl: "templates/news/news.html",
                        controller: 'PortalCtrl'


                    }
                }
            })
            .state('tabs.news-content', {
                url: "/news/:aid",
                views: {
                    'news-tab': {
                        templateUrl: 'templates/news/news-content.html',
                        controller: 'NewsContentCtrl'
                    }
                }
            })
            //帖子
            .state('tabs.thread', {
                url: "/thread",
                views: {
                    'thread-tab': {
                        templateUrl: "templates/thread/thread.html",
                        controller: 'ThreadListCtrl'
                    }
                }
            })
            //用户
            .state('tabs.user', {
                url: "/user",
                views: {
                    'user-tab': {
                        templateUrl: "templates/user/user.html",
                        controller: 'UserCtrl'
                    }
                }
            })
            .state('tabs.user-personal', {
                url: '/user/personal',
                views: {
                    'user-tab': {
                        templateUrl: 'templates/user/personal.html',
                        controller: 'PersonalCtrl'
                    }
                }
            })

            .state('tabs.login', {
                url: "/login",

                views: {
                    'user-tab': {
                        templateUrl: "templates/user/login.html",
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('tabs.register', {
                url: "/register",
                views: {
                    'user-tab': {
                        templateUrl: "templates/user/register.html",
                        controller: 'RegisterCtrl'
                    }
                }

            })

            .state('tabs.forgotpassword', {
                url: "/forgot-password",
                views: {
                    'user-tab': {
                        templateUrl: "templates/user/forgot-password.html"
                    }
                }

            })



         .state('news_content', {
                url: "/news_content/:aid",
                templateUrl: "templates/news/news-content.html",
                controller: 'NewsContentCtrl'

            })
            .state('thread-content', {
                url: "/thread-content/:tid",
                templateUrl: 'templates/thread/thread-content.html',
                controller: 'ThreadContentCtrl'
            });


      $urlRouterProvider.otherwise("/tab/home");

    }]);
