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

            },
            getMoreTopics:function(){

                //为了解决一步加载的时候数据还没有加载完成  然后请求loadMore的时候  找不到数据
                if(topics[catid]===undefined){
                    return false;
                }

                //获取以前的数据
                var hasNextPage=topics[catid].hasNextPage;
                var nextPage=topics[catid].nextPage;
                var moreTopicsData=topics[catid].data;

                console.log(moreTopicsData);

                resource.query({
                    catid:catid,
                    page:nextPage
                }, function (r) {

                    nextPage++;

                    if (r.result.length < 20) {  //来判断是否有下一页数据
                        hasNextPage = false;
                    }
                    moreTopicsData=moreTopicsData.concat(r.result);
                    topics[catid]={
                        hasNextPage:hasNextPage,
                        'nextPage': nextPage,
                        'data': moreTopicsData
                    }

                    //在这里请求完成以后  通知controller


                    $rootScope.$broadcast('PortalList.portalsUpdated');

                })
            },
            setArticleCateId:function(cate_id){   //点击分类加载数据

                catid=cate_id;
                this.getTopTopics();

            },
            hasNextPage: function() {
                if (topics[catid] === undefined) {
                    return false;
                }
                return topics[catid].hasNextPage;
            }




        }


    })

    //文章详情
    .factory('ArticleContentFactory', function($resource, $rootScope,ENV) {


        var ApiUrl = ENV.api,
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            topic = '';


        var resource = $resource(ApiUrl, {}, {
            query: {
                method: 'get',
                params: {
                    a:'getPortalArticle',
                    aid: '@aid'
                },
                timeout: 20000
            }
        });


        return {

            get: function(aid) {

                // console.log(aid);
                return resource.query({
                    aid: aid
                }, function(response) {
                    // console.log(response);
                    topic = response.result;


                    $rootScope.$broadcast('NewsContent.newsUpdated');
                });

            },
            getArticle: function() {
                return topic;
            }


        };


    })