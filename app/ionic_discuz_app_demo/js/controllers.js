angular.module('starter.controllers', [])

.controller('PortalCtrl', ['$scope','$rootScope','ENV','PortalsFactory',function($scope,$rootScope,ENV,PortalsFactory) {

      //  console.log("enter Portal ctrl");

        /*   $scope.$on('$ionicView.beforeEnter', function() {

       *      // get user settings
        $scope.settings = My.getSettings();
        $rootScope.hideTabs = '';
        });


        $scope.$on('$ionicView.afterEnter', function() {

        document.addEventListener("deviceready", function() {
        // trackView
        $cordovaGoogleAnalytics.trackView('topics view');
        }, false);
       * */

      $scope.showloading=true;

        $scope.ENV=ENV;

        // 获取数据
        PortalsFactory.fetchTopStories();


        $scope.$on('PortalList.portalsUpdated', function() {
            // $timeout(function() {
            $scope.portalListData = PortalsFactory.getPortals();
            $scope.showloading=false
            $scope.$broadcast('scroll.refreshComplete');
            // }, 100);
        });

        $scope.doRefresh = function() {
            PortalsFactory.fetchTopStories();
        };

        $scope.loadMore = function() {
            // console.log("loadMore");
            PortalsFactory.increaseNewPortals();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.moreDataCanBeLoaded = function() {
            //console.log(PortalsFactory.hasNextPage());
            return PortalsFactory.hasNextPage();
        };

        //点击tab的时候改变内容
        $scope.changeTab = function(catid,index) {

         //   angular.element(".sub_header_list").addClass('sub_button_select');
            //alert(catid);
           // alert( angular.element(this).parent());
            //angular.element(this).parent().children().removeClass('sub_button_select');
           // angular.element(this).addClass('sub_button_select');
            var a=document.getElementById('sub_header_list').getElementsByTagName('a');
            for (var i = 0; i < 8; i++) {
                a[i].className = "button button-clear ";
            }
            //鎶婄偣鍑荤殑閭ｄ釜鏄剧ず鍑烘潵
            a[index].className = "button button-clear sub_button_select";

            PortalsFactory.setCurrentCatgory(catid);
           // $scope.currentCatid = PortalsFactory.getCurrentCatid();
        };



}])
.controller('NewsContentCtrl', ['$scope','$stateParams','$ionicHistory','NewsContentFactory',function($scope,$stateParams,$ionicHistory,NewsContentFactory) {
    console.log('NewsContentCtrl');

       $scope.showloading=true;

        var aid=$stateParams.aid;
        NewsContentFactory.get(aid);
        $scope.$on('NewsContent.newsUpdated', function() {
            // $timeout(function() {
            $scope.contentData = NewsContentFactory.getPortal();
            $scope.showloading=false
            console.log( $scope.contentData[0]['title']);
         //   $scope.$broadcast('scroll.refreshComplete');
            // }, 100);
        });

        $scope.backView = function() {
            $ionicHistory.goBack();
        };



}])


.controller('ThreadListCtrl', ['$scope','$rootScope','$ionicModal','ENV','ThreadListFactory',function($scope,$rootScope,$ionicModal,ENV,ThreadListFactory) {

        $scope.showloading=true;
        $scope.ENV=ENV;
        // 获取数据
        ThreadListFactory.fetchTopStories();


        $scope.$on('ThreadList.threadsUpdated', function() {
            //console.log( ThreadListFactory.getThreads());
            // $timeout(function() {
            $scope.threadlListData = ThreadListFactory.getThreads();
            $scope.showloading=false
            $scope.$broadcast('scroll.refreshComplete');
            // }, 100);
        });

        $scope.doRefresh = function() {
            ThreadListFactory.fetchTopStories();
        };

        $scope.loadMore = function() {
            // console.log("loadMore");
            ThreadListFactory.increaseNewThreads();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        $scope.moreDataCanBeLoaded = function() {
            //console.log(PortalsFactory.hasNextPage());
            return ThreadListFactory.hasNextPage();
        };



     /*
     *    $scope.$on('modal.hidden', function() {
      // Execute action
      if ($scope.newTopicId) {
      $timeout(function() {
      $location.path('#/tab/topics/' + $scope.newTopicId);
      }, 300);
      }
      });
     * */


         // 显示new topic modal

        $ionicModal.fromTemplateUrl('templates/thread/newTopic.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.newTopicModal = modal;
        });

        $scope.showNewTopicModal = function() {

            // track view
            if (window.analytics) {
                window.analytics.trackView('new topic view');
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            $scope.newTopicModal.show();
        };

        // close new topic modal
        $scope.closeNewTopicModal = function() {
            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }
            $scope.newTopicModal.hide();
        };


 }])


//帖子详情
.controller('ThreadContentCtrl', function($scope,$stateParams,ThreadContentFactory) {

        var tid=$stateParams.tid;

        ThreadContentFactory.get(tid);

        console.log(tid);

        $scope.$on('ThreadContent.threadUpdated', function() {
            // $timeout(function() {
            $scope.thread = ThreadContentFactory.getThread();
            $scope.showloading=false
            console.log( $scope.thread[0]['message']);
            //   $scope.$broadcast('scroll.refreshComplete');
            // }, 100);
        });

        $scope.backView = function() {
            $ionicHistory.goBack();
        };

})




.controller('UserCtrl', function($scope,$rootScope,User,Storage) {
    var storageKey = 'user';

    $scope.$on('$ionicView.beforeEnter', function() {

        if(Storage.get(storageKey)&&Storage.get(storageKey).username!=''){

            $scope.userInfo=Storage.get(storageKey);
            console.log($scope.userInfo);
        }
        console.log('User');

    });




    //退出登录
    $rootScope.$on('User.logoutUpdated', function() {
        var storageKey = 'user';
        $scope.userInfo='';
        Storage.remove(storageKey);
        // setBadge(0);
        // 清空历史记录
        // $ionicHistory.clearHistory();
        // $ionicHistory.clearCache();
    });


})
.controller('PersonalCtrl', function($scope,$rootScope,$ionicActionSheet,$state,$timeout,User,Storage) {

        var storageKey = 'user';
        $scope.$on('$ionicView.beforeEnter', function() {
            if(Storage.get(storageKey)&&Storage.get(storageKey).username!=''){

                $scope.userInfo=Storage.get(storageKey);
            }else{

                $state.go('tabs.user');
            }

        });
        $scope.logout = function() {
            console.log('logout');
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({

                destructiveText: '退出登录',
                titleText: '确定退出当前登录账号么？',
                cancelText: '取消',
                cancel: function() {
                    // add cancel code..
                },
                destructiveButtonClicked: function() {
                    logout();
                    return true;
                }
            });

            // For example's sake, hide the sheet after two seconds
            $timeout(function() {
                // hideSheet();
            }, 2000);
        };


        // logout action
        var logout = function() {
            User.logout();
            $rootScope.$broadcast('User.logoutUpdated');

           $state.go('tabs.user');
        };




        console.log('PersonalCtrl');
 })


    //登陆
    .controller('LoginCtrl', function($scope,User,Storage,$state,$ionicLoading) {
        $scope.user={
            'username':'',
            'password':''
        };
        var storageKey = 'user';
        $scope.signIn = function(user) {

            User.login($scope.user.username,$scope.user.password);
        };



        $scope.$on('User.loginUpdated', function() {

            var userRel = User.getCurrentUser();

            if(userRel.success==false){//登陆失败
                //    alert(userRel.message);
                $ionicLoading.show({
                    noBackdrop: true,
                    template: userRel.message,
                    duration: 1500
                });
            }else{
                Storage.set(storageKey,userRel);
                $state.go('tabs.user',{reload: true});  //路由跳转

            }

        });




    })
//注册
    .controller('RegisterCtrl', function($scope, $state) {

        $scope.signIn = function(user) {
            console.log('registerCtrl', user);
            $state.go('tabs.home');
        };
    })

    //PersonalCtrl

//首页
.controller('HomeCtrl', ['$scope','$rootScope','PortalsFactory','ENV',function($scope,$rootScope,PortalsFactory,ENV) {
    console.log('HomeTabCtrl');

        $scope.ENV=ENV;
        // 获取数据
        PortalsFactory.fetchTopStories();
        $scope.$on('PortalList.portalsUpdated', function() {
            // $timeout(function() {
            $scope.portalListData = PortalsFactory.getPortals();
            $scope.$broadcast('scroll.refreshComplete');
            // }, 100);
        });
}]);