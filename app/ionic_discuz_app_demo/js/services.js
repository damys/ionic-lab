angular.module('starter.services', [])

.factory('Storage', function() {
    return {
        set: function(key, data) {
            return window.localStorage.setItem(key, window.JSON.stringify(data));
        },
        get: function(key) {

            return window.JSON.parse(window.localStorage.getItem(key));
        },
        remove: function(key) {
            return window.localStorage.removeItem(key);
        }
    };
})
/*
* http://www.phonegap100.com/appapi.php?a=getPortalCate 获取文章分类
 http://www.phonegap100.com/appapi.php?a=getPortalList&catid=20&page=2 获取文章列表
  http://www.phonegap100.com/appapi.php?a=getPortalArticle&aid=121 获取文章详情
 http://www.phonegap100.com/appapi.php?a=getThreadCate 获取帖子分类
 http://www.phonegap100.com/appapi.php?a=getThreadList&fid=2&page=1 获取帖子列表
 http://www.phonegap100.com/appapi.php?a=getThreadContent&tid=138 帖子详情以及回复的内容
* */

 .factory('PortalsFactory', function($resource, $rootScope,ENV) {
        var ApiUrl = ENV.api,
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
        topics = {},
        catid = 20;

        console.log(ApiUrl);
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
            fetchTopStories: function() {
                console.log('111');
                // console.log("currentTab: " + currentTab);
                var hasNextPage = true;   //是否有下一页
                resource.query({
                    catid: catid,
                    page: 1
                }, function(r) {
                    // console.log(r);
                    if (r.result.length < 20) {
                        hasNextPage = false;
                    }
                    topics[catid] = {
                        'nextPage': 2,
                        'hasNextPage': hasNextPage,
                        'data': r.result
                    };
                    $rootScope.$broadcast('PortalList.portalsUpdated');

                });

            },
            getPortals: function() {
                if (topics[catid] === undefined) {
                    return false;
                }
                return topics[catid].data;
            },
            setCurrentCatgory: function(cid) {
                catid = cid;
                this.fetchTopStories();
                // $rootScope.$broadcast('ioniclub.topicsUpdated', topics[currentTab]);
            },
            getCurrentCatid: function() {
                return catid;
            },
            increaseNewPortals: function() {
                var nextPage = topics[catid].nextPage;
                var hasNextPage = topics[catid].hasNextPage;
                var portalsData = topics[catid].data;

                //console.log(nextPage)

                resource.query({
                    catid: catid,
                    page: nextPage

                }, function(r) {
                    // console.log(r);
                    nextPage++;
                    if (r.result.length < 20) {
                        hasNextPage = false;
                    }

                //    console.log(r.result);

                    portalsData = portalsData.concat(r.result);
                    topics[catid] = {
                        'nextPage': nextPage,
                        'hasNextPage': hasNextPage,
                        'data': portalsData
                    };

                    $rootScope.$broadcast('PortalList.portalsUpdated');

               });
            },
            hasNextPage: function() {
                if (topics[catid] === undefined) {
                    return false;
                }
                return topics[catid].hasNextPage;
            }
        };


    })
    .factory('NewsContentFactory', function($resource, $rootScope,ENV) {


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


                    $rootScope.$broadcast('NewsContent.newsUpdated', topic);
                });

            },
            getPortal: function() {
                return topic;
            }


        };


    })

//帖子列表

 /*
 *      http://www.phonegap100.com/appapi.php?a=getThreadCate 获取帖子分类
  http://www.phonegap100.com/appapi.php?a=getThreadList&fid=2&page=1 获取帖子列表
  http://www.phonegap100.com/appapi.php?a=getThreadContent&tid=138 帖子详情以及回复的内容
 * */

    .factory('ThreadListFactory', function($resource, $rootScope,ENV) {
        var ApiUrl = ENV.api,
        // 用来存储话题类别的数据结构，包含了下一页、是否有下一页等属性
            topics = {},
            fid = 2;
        console.log(ApiUrl);
        var resource = $resource(ApiUrl, {}, {

            query: {
                method: 'get',
                params: {
                    a:'getThreadList',
                    fid: '@fid',
                    page: '@page'

                },
                timeout: 20000
            }
        });


        return {
            fetchTopStories: function() {

                // console.log("currentTab: " + currentTab);
                var hasNextPage = true;   //是否有下一页
                resource.query({
                    fid: fid,
                    page: 1
                }, function(r) {
                    if (r.result.length < 20) {
                        hasNextPage = false;
                    }
                    topics[fid] = {
                        'nextPage': 2,
                        'hasNextPage': hasNextPage,
                        'data': r.result
                    };
                    $rootScope.$broadcast('ThreadList.threadsUpdated');

                });

            },
            getThreads: function() {

                if (topics[fid] === undefined) {
                    return false;
                }
                return topics[fid].data;
            },
            setCurrentCatgory: function(fid) {
                fid = fid;
                this.fetchTopStories();
                // $rootScope.$broadcast('ioniclub.topicsUpdated', topics[currentTab]);
            },
            getCurrentFid: function() {
                return fid;
            },
            increaseNewThreads: function() {
                var nextPage = topics[fid].nextPage;
                var hasNextPage = topics[fid].hasNextPage;
                var portalsData = topics[fid].data;

                //console.log(nextPage)

                resource.query({
                    fid: fid,
                    page: nextPage

                }, function(r) {
                    // console.log(r);
                    nextPage++;
                    if (r.result.length < 20) {
                        hasNextPage = false;
                    }

                    //    console.log(r.result);

                    portalsData = portalsData.concat(r.result);
                    topics[fid] = {
                        'nextPage': nextPage,
                        'hasNextPage': hasNextPage,
                        'data': portalsData
                    };

                    $rootScope.$broadcast('ThreadList.threadsUpdated');

                });
            },
            hasNextPage: function() {
                if (topics[fid] === undefined) {
                    return false;
                }
                return topics[fid].hasNextPage;
            }
        };


    })
    /*
    *
     * http://www.phonegap100.com/appapi.php?a=getPortalCate 获取文章分类
     http://www.phonegap100.com/appapi.php?a=getPortalList&catid=20&page=2 获取文章列表
     http://www.phonegap100.com/appapi.php?a=getPortalArticle&aid=121 获取文章详情
     http://www.phonegap100.com/appapi.php?a=getThreadCate 获取帖子分类
     http://www.phonegap100.com/appapi.php?a=getThreadList&fid=2&page=1 获取帖子列表
     http://www.phonegap100.com/appapi.php?a=getThreadContent&tid=138 帖子详情以及回复的内容
     * */


    .factory('ThreadContentFactory', function($resource, $rootScope,ENV) {
        var APIUrl = ENV.api ,
            topic;

        var resource = $resource(ENV.api, {
            a:'getThreadContent',
            tid: '@tid'
         }, {
            reply: {
                method: 'post',
                url: ENV.api + '/topic/:topicId/replies'
            }
        });
        return {

            get: function(tid) {
                return resource.get({
                    tid: tid
                }, function(response) {
                    topic = response.result;

                    $rootScope.$broadcast('ThreadContent.threadUpdated');
                });

            },
            getThread: function() {
                return topic;
            },
            saveReply: function(topicId, replyData) {
                var reply = angular.extend({}, replyData);
                var currentUser = User.getCurrentUser();
                // add send from
                if (My.getSettings().sendFrom) {
                    reply.content = replyData.content + '\n<br/> 发自 [Ioniclub](https://github.com/IonicChina/ioniclub)';
                }
                return resource.reply({
                    topicId: topicId,
                    accesstoken: currentUser.accesstoken
                }, reply);
            }


        };

    })
//用户
    .factory('User', function(ENV, $resource, Storage,$rootScope) {

        var apiUrl = ENV.api ;
        var storageKey = 'user';

        var resource = $resource(ENV.api+'?a=login2');

      //  var resource = $resource(ENV.api + '/accesstoken');
//        var userResource = $resource(ENV.api + '/user/:loginname', {
//            loginname: ''
//        });
        var user = Storage.get(storageKey) || {};
        return {
            login: function(username,password) {
                var $this = this;


                return resource.save({
                    username: username,
                    password: password
                }, function(response) {
                    //console.log(response);
                    user=response.result;
                    $rootScope.$broadcast('User.loginUpdated');
                });
            },
            logout: function() {
                user = {};
                Storage.remove(storageKey);
            },
            getCurrentUser: function(){
                return user;
            }
        };

    });
