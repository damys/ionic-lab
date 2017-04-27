/**
 * Created by htzhanglong on 2015/8/2.
 */
angular.module('starter.controllers', [])

    .controller('HomeCtrl', function($scope,ENV) {

        console.log(ENV.api);

        $scope.name='HomeCtrl';
    })

    //ArticleCtrl

    .controller('ArticleCtrl', function($scope,ArticleFactory,ENV) {
        $scope.name='ArticleCtrl';
        $scope.ENV=ENV;


        $scope.showloading=true;

        //获取服务器数据保存
        ArticleFactory.getTopTopics();
        //接收到刚才传过来的通知
        $scope.$on('PortalList.portalsUpdated', function() {
            $scope.portalListData=ArticleFactory.getArticles();

            $scope.showloading=false;

            // 停止广播ion-refresher
         });


        //下拉更新
        $scope.doRefresh=function(){
            ArticleFactory.getTopTopics();
            $scope.$broadcast('scroll.refreshComplete');
        }

     //上拉更新
        $scope.loadMore=function(){

            console.log('加载更多数据');
            ArticleFactory.getMoreTopics();
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }


        $scope.hasNextPage = function() {
            //console.log(PortalsFactory.hasNextPage());
            return ArticleFactory.hasNextPage();
        };

        $scope.changeTab=function(cateid,index){
            var a=document.getElementById('sub_header_list').getElementsByTagName('a');
            for (var i = 0; i < 8; i++) {
                a[i].className = "button button-clear ";
            }
            //鎶婄偣鍑荤殑閭ｄ釜鏄剧ず鍑烘潵
            a[index].className = "button button-clear sub_button_select";
            //数据请求
            ArticleFactory.setArticleCateId(cateid);

        }

    })
    //文章详情
    .controller('NewsContentCtrl', function($scope,$rootScope,$stateParams,ArticleContentFactory) {

        var aid=$stateParams['aid'];

        $scope.showloading=true;

        ArticleContentFactory.get(aid);
        $scope.$on('NewsContent.newsUpdated', function() {
            $scope.NewsContentData=ArticleContentFactory.getArticle();

            $scope.showloading=false;
            // 停止广播ion-refresher
        });


        $rootScope.hideTabs='tabs-item-hide';

        //页面刚加载
        $scope.$on('$ionicView.beforeEnter', function() {
            // get user settings
            //
            console.log('beforeEnter');

        });


//加载完成
        $scope.$on('$ionicView.afterEnter', function() {
            // get user settings
            console.log('afterEnter');

        });


        //页面销毁
        $scope.$on('$destroy',function(){
            console.log('$destroy');
            $rootScope.hideTabs = '';
        })


    })


    //帖子列表
    .controller('ThreadCtrl', function($scope,$rootScope,ENV,ThreadListFactory,$ionicModal) {
        $scope.showloading=true;
        $scope.ENV=ENV;
        // 获取数据
        ThreadListFactory.fetchTopThreadList();


        $scope.$on('ThreadList.threadsUpdated', function() {
            //console.log( ThreadListFactory.getThreads());
            // $timeout(function() {
            $scope.threadlListData = ThreadListFactory.getThreads();
            $scope.showloading=false

            // }, 100);
        });

        $scope.doRefresh = function() {
            ThreadListFactory.fetchTopThreadList();
            $scope.$broadcast('scroll.refreshComplete');
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

        //


        $ionicModal.fromTemplateUrl('templates/thread/newTopic.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.newTopicModal = modal;
        });

        $scope.showNewTopicModal = function() {

            // track view
            $scope.newTopicModal.show();
        };

        // close new topic modal
        $scope.closeNewTopicModal = function() {
            $scope.newTopicModal.hide();
        };


    })
    //帖子详情
    .controller('ThreadContentCtrl', function($scope,$rootScope,$stateParams,ThreadContentFactory) {



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


    })



    .controller('UserCtrl', function($scope,Storage) {
        $scope.name='UserCtrl';
        console.log(Storage.get('user'));


    })


    //用户登录
    .controller('LoginCtrl', function($scope,$state,$ionicLoading,User,Storage) {


      var storageKey='user';

//一定要注意定义 我们的ng-model的对象 数据
        $scope.user={
            username:'',
            password:''
        }
        $scope.signIn=function(){
            //console.log($scope.user);
            User.login($scope.user.username,$scope.user.password);

        }

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
                $state.go('tab.user',{reload: true});  //路由跳转

            }

        });

    })






;
