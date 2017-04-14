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

         });








    })


    .controller('ThreadCtrl', function($scope) {
        $scope.name='ThreadCtrl';
    })

    .controller('UserCtrl', function($scope) {
        $scope.name='UserCtrl';
    });
