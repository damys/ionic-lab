<?php
// mod文件只能被入口文件引用，不能直接访问
if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}
date_default_timezone_set('Asia/Shanghai');//设置时区

$action=isset($_GET['a'])?dhtmlspecialchars($_GET['a']):'';
$callback=isset($_GET['callback'])?dhtmlspecialchars($_GET['callback']):'';

$actionarray = array('getPortalCate','getPortalList','getPortalArticle','getThreadCate','getThreadList','getThreadContent','login','login2','threadPost','threadReply','threadPost2');
$rdata = array();//主要放返回的一些信息
// 判断 action 的合法性
if(!in_array($action, $actionarray)){
	$rdata['message']='请求的方法不存在';
	$rdata['success']=false;	
	echo json_encode($rdata);
	exit;
}else{
	//入口方法可以做很多的判断等操作  a=getThreadContent     getPortalCate();
	$result=$action();       //获取对应的结果集
	if(empty($callback)){
		echo json_encode($result);  //ajax请求   
	}else{
		echo $callback.'('.json_encode($result).')';  //jsonp请求
	}	
	exit;	
}
//获取文章分类
function getPortalCate(){
	$sql="select catid,upid,catname from ".DB::table('portal_category')." where upid=0";		
	$rel=select($sql);		
	foreach ($rel as $key=>$val){
		$sql="select catid,upid,catname from ".DB::table('portal_category')." where upid={$val['catid']}";		
		$rel[$key]['subcate']=select($sql);	
	}
	$rdata['result']=$rel;
	return $rdata;
}
//根据分类id获取列表
function getPortalList(){
	$catid=isset($_GET['catid'])?dhtmlspecialchars($_GET['catid']):'';	
	if(empty($catid)||!is_numeric($catid)){  //如果分类的id为空的话返回错误信息
		$rdata['message']='文章分类的id不能为空，且必须是数字';
		$rdata['success']=false;	
		return $rdata;
	}
	//初始化当前页码
	$page = empty($_GET['page'])?1:intval($_GET['page']);
	if($page<1) $page=1;	
	//分页
	$perpage = 20;
	$start = ($page-1)*$perpage;//开始的页面	
	
	$sql="select aid,catid,username,title,pic FROM ".DB::table('portal_article_title')." where catid='{$catid}' ORDER BY dateline DESC limit $start, $perpage";	
	$rel=select($sql);
	$rdata['result']=$rel;
	return $rdata;
}
//根据文章的id获取详情
function getPortalArticle(){
	$aid=isset($_GET['aid'])?dhtmlspecialchars($_GET['aid']):'';
	if(empty($aid)||!is_numeric($aid)){  //如果分类的id为空的话返回错误信息
		$rdata['message']='文章id不能为空，且必须是数字';
		$rdata['success']=false;	
		return $rdata;
	}	
	$sql="select a.aid,a.catid,a.username,a.title,a.author,a.summary,a.pic,b.content FROM ".DB::table('portal_article_title')." as a,".DB::table('portal_article_content')." as b  where a.aid=b.aid AND a.aid='{$aid}' limit 1";	
	$rel=select($sql);	
	//替换图片地址为 远程可以访问的
	
	$pattern="/<[img|IMG].*?src=[\'|\"](.*?(?:[\.gif|\.jpg]))[\'|\"].*?[\/]?>/";
	preg_match_all($pattern,$rel[0]['content'],$match);		
		
	$num=count($match[1]);		
	for($i=0;$i<$num;$i++){		
		$rel[0]['content'] = str_replace($match[1][$i], 'http://www.phonegap100.com/'.$match[1][$i], $rel[0]['content']); 
	}
	
	$rdata['result']=$rel;
	return $rdata;
}

//获取帖子分类
function getThreadCate(){	
	$sql="SELECT fid,fup,name FROM ".DB::table('forum_forum')." WHERE status=1 and fup=0";	
	$rel=select($sql);		
	foreach ($rel as $key=>$val){
		$sql="SELECT fid,fup,name FROM ".DB::table('forum_forum')." WHERE status=1 and fup={$val['fid']}";
		
		$rel[$key]['subcate']=select($sql);	
	}
	$rdata['result']=$rel;
	return $rdata;

}
//获取帖子列表
function getThreadList(){
	$fid=isset($_GET['fid'])?dhtmlspecialchars($_GET['fid']):'';
	if(empty($fid)||!is_numeric($fid)){  //如果分类的id为空的话返回错误信息
		$rdata['message']='帖子分类的id不能为空，且必须是数字';
		$rdata['success']=false;	
		return $rdata;
	}	
	//初始化当前页码
	$page = empty($_GET['page'])?1:intval($_GET['page']);
	if($page<1) $page=1;	
	//分页
	$perpage = 20;
	$start = ($page-1)*$perpage;//开始的页面	
	$sql="SELECT tid,fid,posttableid,subject,author,authorid,dateline,lastpost FROM ".DB::table('forum_thread')." where fid= {$fid} order by lastpost desc limit $start, $perpage";
	$rel=select($sql);		
    $rdata['result']=$rel;
	return $rdata;
}
//获取内容详情
function getThreadContent(){
	require_once libfile('function/discuzcode');
	
	$tid=isset($_GET['tid'])?dhtmlspecialchars($_GET['tid']):'';
	if(empty($tid)||!is_numeric($tid)){  //如果分类的id为空的话返回错误信息
		$rdata['message']='帖子id不能为空，且必须是数字';
		$rdata['success']=false;	
		return $rdata;
	}	
	$page = empty($_GET['page'])?1:intval($_GET['page']);
	if($page<1) $page=1;	
	//分页
	$perpage = 20;
	$start = ($page-1)*$perpage;//开始的页面
	//初始化当前页码	
	$sql="SELECT pid,fid,tid,first,author,authorid,subject,dateline,message,position FROM ".DB::table('forum_post')." where tid= {$tid} order by dateline asc limit $start, $perpage";
	
	//file_put_contents('sql.txt', $sql);
	$rel=select($sql);	
	foreach ($rel as $key=>$val){
		$rel[$key]['message']=discuzcode($val['message']);
		//查看帖子中是否有附件的图片
		if(strpos($val['message'], '[/attach]') !== FALSE) {
		    $rel[$key]['message'] = preg_replace("/\[attach\]\s*([^\[\<\r\n]+?)\s*\[\/attach\]/ies","getattach('\\1','$tid')", $rel[$key]['message']);
		}
	}		
	$rdata['result']=$rel;	
	return $rdata; 
}
//用户登录 登录成功返回登录的信息
function login(){	
	$username=isset($_GET['username'])?dhtmlspecialchars($_GET['username']):'';
	$password=isset($_GET['password'])?dhtmlspecialchars($_GET['password']):'';	
	$sql="SELECT uid,username,salt,password from pre_ucenter_members where username='{$username}'";	
	$userinfo=select($sql);
	if($userinfo){
    	if(md5(md5($password).$userinfo[0]['salt']) === $userinfo[0]['password'])
    	{   		
    		//如果密码正确即可授权登陆  
    		$rdata['result']=$userinfo[0];	
    	}else {
    		// 密码不正确
    		$rdata['message']='密码不正确';
			$rdata['success']=false;	
    	}
	}else{
		// 没有此用户
		$rdata['message']='此用户不存在';
		$rdata['success']=false;
    }      
    
	return $rdata;   		
}

//用户登录 登录成功返回登录的信息
function login2(){	
	
    $postData=file_get_contents('php://input', true);
    
    $d=json_decode($postData);

	$username=isset($d->username)?dhtmlspecialchars($d->username):'';
	$password=isset($d->password)?dhtmlspecialchars($d->password):'';	
	

//	file_put_contents('t1.txt',$username'---'.$password);
	
	
	$sql="SELECT uid,username,salt,password from pre_ucenter_members where username='{$username}'";	
	$userinfo=select($sql);
	if($userinfo){
    	if(md5(md5($password).$userinfo[0]['salt']) === $userinfo[0]['password'])
    	{   		
    		//如果密码正确即可授权登陆  
    		$rdata['result']=$userinfo[0];	
			$rdata['result']['success']=true;	
    	}else {
    		// 密码不正确
    		$rdata['result']['message']='密码不正确';
			$rdata['result']['success']=false;	
    	}
	}else{
		// 没有此用户
		$rdata['result']['message']='此用户不存在';
		$rdata['result']['success']=false;
    }      
    
	return $rdata;   		
}
//发表帖子
function threadPost2(){	
	
	
	$postData=file_get_contents('php://input', true);
    
    $d=json_decode($postData);

	$title=isset($d->title)?dhtmlspecialchars($d->title):'';
	$username=isset($d->username)?dhtmlspecialchars($d->username):'';	
	$uid=isset($d->uid)?dhtmlspecialchars($d->uid):'';	
	$content=isset($d->content)?dhtmlspecialchars($d->content):'';
	
	$fid=isset($d->fid)?dhtmlspecialchars($d->fid):'';

	$salt=isset($d->salt)?dhtmlspecialchars($d->salt):'';
	
	$sign=isset($d->sign)?dhtmlspecialchars($d->sign):'';
	
	//$content=isset($_GET['content'])?dhtmlspecialchars($_GET['content']):'';	
	
	$server_sign=md5($uid.$username.$salt.'phonegap100');	
	
	
		
	if($sign!=$server_sign){
		$rdata['message']='签名错误';
		$rdata['success']=false;
		return $rdata;	
	}
	
	$author=$username;// 用户名
	$authorid=$uid;  //用户id	
	$subject=$title;  //帖子标题
	$message=$content;
	$dateline=time();  //发表帖子的时间	
	$previous_day=time()-86400;
	
	$lastpost=time();
	$first=1;   //是否是1楼
	$position=1;	
	//安全判断
	//判断发表帖子的间隔时间
	$sql="select * from ".DB::table('forum_thread')." where authorid={$authorid} order by dateline desc limit 1";
	$rel= select($sql);		
	if($dateline-$rel[0]['dateline']<10)
	{
		$rdata['message']='俩次发表帖子的间隔时间太短';
		$rdata['success']=false;
		return $rdata;
	}
	
	$sql="select count(*) from ".DB::table('forum_thread')." where authorid={$authorid} AND dateline>=$previous_day";
	$resource= DB::query($sql);
	$count= DB::num_rows($resource);
	//您今天发表的帖子太多了
	if($count>20){
		$rdata['message']='发帖异常，请去我们官网发帖';
		$rdata['success']=false;
		return $rdata;
	}
	
	
	//数据插入
	$sql="insert into ".DB::table('forum_thread')."(fid,author,authorid,subject,dateline,lastpost,lastposter) value($fid,'{$author}','{$authorid}','{$subject}',{$dateline},{$lastpost},'{$author}')";
	$query = DB::query($sql);
	//$row=DB::affected_rows($query);
	$last_id=DB::insert_id($query);  //获取最后插入的id

		
	if($last_id>0){
		//获取当前帖子回复的最后一个帖子
		
		$lastpid_sql="select * from ".DB::table('forum_post')." order by pid desc";
		$last_pid_rel=select($lastpid_sql);
		$pid=$last_pid_rel[0]['pid']+1; 
		
		
		$sql_post="insert into ".DB::table('forum_post')."(pid,tid,fid,first,author,authorid,subject,message,dateline,position) value($pid,$last_id,$fid,$first,'{$author}',{$authorid},'{$subject}','{$message}',$dateline,$position)";
		
		
//		file_put_contents('test.txt',$uid.'---'.$username.'---'.$salt.'----'.$sign.'---'.$server_sign.'---'.$title.'---'.$content.'----last_id'.$last_id.'sql:'.$sql_post);
		$db_query = DB::query($sql_post);	
		$post_row=DB::affected_rows($db_query);
		
		
		if($post_row>0){
			$rdata['tid']=$last_id;
			$rdata['message']='发表帖子成功';
			$rdata['success']=true;				
		}else{
			$rdata['message']='发表帖子失败';
			$rdata['success']=false;			
			
		}
	}else{
			$rdata['message']='发表帖子失败';
			$rdata['success']=false;
			
	}	
	return $rdata;  
}
function threadReply(){
	
	//回帖的用户名
	$username=isset($_GET['username'])?dhtmlspecialchars($_GET['username']):'';
	//回帖的用户id
	$uid=isset($_GET['uid'])?dhtmlspecialchars($_GET['uid']):'';
	//回帖的内容
	$content=isset($_GET['content'])?dhtmlspecialchars($_GET['content']):'';
	//分类id	
	$fid=isset($_GET['fid'])?dhtmlspecialchars($_GET['fid']):'';//分类的id
	//帖子id
	$tid=isset($_GET['tid'])?dhtmlspecialchars($_GET['tid']):'';
	
	$salt=isset($_GET['salt'])?dhtmlspecialchars($_GET['salt']):'';//获取salt
	
	$sign=isset($_GET['sign'])?dhtmlspecialchars($_GET['sign']):'';//获取salt
	
	$server_sign=md5($uid.$username.$salt.'phonegap100');
	if($sign!=$server_sign){   //看签名请求是否正确
		$rdata['message']='请求的参数不对';
		$rdata['success']=false;
		return $rdata;
	}
	
	$author=$username;// 用户名
	$authorid=$uid;  //用户id
		
	$message=$content;
	$dateline=time();  //发表帖子的时间
	
	$lastpost=time(); //最后回复的一个时间
	$lastposter=$username;//最后的一个回复人
	$first=0;   //是否是1楼
	$previous_day=time()-86400;
	
	//判断发表帖子的间隔时间
	$sql="select * from ".DB::table('forum_post')." where authorid={$authorid} order by dateline desc limit 1";
	$rel= select($sql);		
	if($dateline-$rel[0]['dateline']<10)
	{
		$rdata['message']='俩次回复帖子的间隔时间太短';
		$rdata['success']=false;
		return $rdata;
	}	
	$sql="select count(*) from ".DB::table('forum_post')." where authorid={$authorid} AND dateline>=$previous_day";
	$resource= DB::query($sql);
	$count= DB::num_rows($resource);
	//您今天发表的帖子太多了
	if($count>20){
		$rdata['message']='回帖次数太多，请去我们官网回帖';
		$rdata['success']=false;
		return $rdata;
	}
	//获取当前帖子回复的最后一个帖子		
	$lastpid_sql="select * from ".DB::table('forum_post')." order by pid desc";
	$last_pid_rel=select($lastpid_sql);
	$pid=$last_pid_rel[0]['pid']+1; 
	
	//回复帖子
	$sql_post="insert into ".DB::table('forum_post')."(pid,tid,fid,first,author,authorid,message,dateline,position) value($pid,$tid,$fid,$first,'{$author}',{$authorid},'{$message}',$dateline,'')";
	$db_query = DB::query($sql_post);	
	$post_row=DB::affected_rows($db_query);	
	if($post_row>0){	
			$sql_thread="update ".DB::table('forum_thread')." set lastpost='{$lastpost}',lastposter='{$lastposter}' where tid='{$tid}'";
			$db_query = DB::query($sql_thread);	
					
			$rdata['message']='帖子回复成功';			
			$rdata['dateline']=$lastpost;
			$rdata['success']=true;	
			
					
	}else{
			$rdata['message']='帖子回复失败';
			$rdata['success']=false;			
			
	}	
	return $rdata;
}

//查询封装方法
function select($sql){
	$list = array();
	$query = DB::query($sql);
	$list = array();
	while($mood = DB::fetch($query)) {		
		$list[] = $mood;
	}
	return $list;
}
//获取帖子附件图片的方法
function getattach($aid,$tid){
	//global $_G;
	//获取帖子所有图片
	$tableid=substr($tid,'-1');  //分表索引
	$list=DB::fetch_all("SELECT attachment,aid from %t where tid='$tid' AND isimage=1",array('forum_attachment_'.$tableid));
	foreach($list as $k => $value){
	  if($value['attachment']){
	    $attachlist[$value['aid']]=$value['attachment'];	
	  }else{
		$attachlist[$value['aid']]="";
	  }
	}
	return '<img src="http://www.phonegap100.com/data/attachment/forum/'.$attachlist[$aid].'">';
}





?>
