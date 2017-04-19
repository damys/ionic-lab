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

        //获取服务器数据保存

        ArticleFactory.getTopTopics();
        //接收到刚才传过来的通知
        $scope.$on('PortalList.portalsUpdated', function() {
            $scope.portalListData=ArticleFactory.getArticles();
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
    .controller('NewsContentCtrl', function($scope,$stateParams,ArticleContentFactory) {

        var aid=$stateParams['aid'];


        ArticleContentFactory.get(aid);


        $scope.$on('NewsContent.newsUpdated', function() {
            $scope.NewsContentData=ArticleContentFactory.getArticle();

            console.log( $scope.NewsContentData);
            // 停止广播ion-refresher
        });

        $scope.name='NewsContentCtrl';



    })


    .controller('ThreadCtrl', function($scope) {
        $scope.name='ThreadCtrl';
    })

    .controller('UserCtrl', function($scope) {
        $scope.name='UserCtrl';
    });
