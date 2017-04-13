/**
 * Created by htzhanglong on 2015/8/2.
 */
angular.module('starter.controllers', [])

    .controller('HomeCtrl', function($scope) {
        $scope.name='HomeCtrl';
    })

    .controller('ThreadCtrl', function($scope) {
        $scope.name='ThreadCtrl';
    })

    //ArticleCtrl

    .controller('ArticleCtrl', function($scope) {
        $scope.name='ArticleCtrl';
    })


    .controller('UserCtrl', function($scope) {
        $scope.name='UserCtrl';
    });
