/**
 * Created by htzhanglong on 2015/8/2.
 */
angular.module('starter.services', [])

.factory('ArticleFactory',function($rootScope,$resource,ENV){


        var ApiUrl = ENV.api,
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
        topics = {},
        catid = 20;


        var resource = $resource(ApiUrl, {}, {
            query: {
                method: 'get',
                params: {
                    a:'getPortalList',
                    catid: '@catid',
                    page: '@page'

                },
                timeout: 20000
            }
        });


    return {

        //获取第一页的数据
        getTopTopics:function(){

            var hasNextPage = true;   //是否有下一页

            resource.query({
                catid:catid,
                page:1
            }, function (r) {

                if (r.result.length < 20) {  //来判断是否有下一页数据
                    hasNextPage = false;
                }
                topics[catid]={

                    hasNextPage:hasNextPage,
                    'nextPage': 2,
                    'data': r.result
                  }
                   //在这里请求完成以后  通知controller


                $rootScope.$broadcast('PortalList.portalsUpdated');

            })
        } ,
        //返回我们保存的数据
        getArticles:function(){
            if(topics[catid]===undefined){

                return false
            }

            console.log(topics[catid].data);


            return topics[catid].data;

        }




    }



})