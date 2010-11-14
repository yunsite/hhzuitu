<?php include template("html_header");?>
<script type="text/javascript" src="http://static.connect.renren.com/js/v1.0/FeatureLoader.jsp"></script>
<div id="hdw">
	<div id="hd" style="background:url(../static/css/i/head_content.jpg) no-repeat;height:110px;">
		<div id="logo"><a href="/index.php" class="link"><img src="/static/css/i/logo.gif" /></a></div>
		
		<div class="guides">
			<div class="city">
				<h2><?php echo $city['name']; ?></h2>
			</div>
			<?php if(count($hotcities)>1){?>
			<script type="text/javascript" src="/static/js/jquery.colorbox-min.js"></script>
			<link rel="stylesheet" type="text/css" href="/static/css/colorbox.css" media="screen" />
			<script type="text/javascript">
				$(document).ready(function() {
					$("#city-change").colorbox({width:"50%", opacity: 0.3, inline:true, href:"#city-list"});
				});
			</script>
			<a id="city-change" href="#" class="change" title="切换城市">切换城市</a>
			<div style="display: none;">
				<div id="city-list" style="margin-top:5px;padding:10px 10px;">
					<ul style="float:left;padding-bottom:5px;"><?php echo current_city($city['ename'], $hotcities); ?></ul>
					<div style="clear:both;border-top:1px dashed #666;padding-top:5px;padding-bottom:10px;padding-right:5px;font-size:12px;zoom:1;"><a href="/city.php" style="float:right;">其他城市？</a></div>
				</div>
			</div>
			<?php }?>
		</div>
		<div id="header-subscribe-body" class="subscribe">
		<form action="/subscribe.php" method="post" id="header-subscribe-form">
			<label for="header-subscribe-email" class="text">想知道<?php echo $city['name']; ?>明天的团购是什么吗？</label>
			<input type="hidden" name="city_id" value="<?php echo $city['id']; ?>" />
			<input id="header-subscribe-email" type="text" xtip="输入Email，订阅每日团购信息..." value="" class="f-text" name="email" />
			<input type="hidden" value="1" name="cityid" />
			<input type="submit" class="commit" value="订阅" />
		</form>
		<?php if(option_yes('smssubscribe')){?>
		<span><a class="sms" onclick="X.miscajax('sms','subscribe');">&raquo; 短信订阅，免费！</a>&nbsp; <a class="sms" onclick="X.miscajax('sms','unsubscribe');">&raquo; 取消手机订阅</a></span>
		<?php }?>
		</div>
		<ul class="nav cf"><?php echo current_frontend(); ?></ul>
	<?php if(option_yes('trsimple')){?>
		<div class="vcoupon">
		&raquo;&nbsp;<a href="/account/invite.php">邀请好友</a>&nbsp;&nbsp;&raquo;&nbsp;<a id="verify-coupon-id" href="javascript:;"><?php echo $INI['system']['couponname']; ?>验证及消费登记</a>&nbsp;&nbsp;&raquo;&nbsp;<a href="javascript:;" onclick="return X.misc.locale();">简繁转换</a></div>
	<?php } else { ?>
		<div class="vcoupon">&raquo;&nbsp;<a href="/account/invite.php">邀请好友购买返利&nbsp;<?php echo abs($INI['system']['invitecredit']); ?>&nbsp;元</a>&nbsp;&nbsp;&nbsp;&raquo;&nbsp;<a id="verify-coupon-id" href="javascript:;"><?php echo $INI['system']['couponname']; ?>验证及消费登记</a></div>
	<?php }?>
		<div class="logins">
		<?php if($login_user){?>
			<ul class="links">
				<li class="username">欢迎您，<?php if($login_user['realname']){?><?php echo $login_user['realname']; ?><?php } else { ?><?php echo $login_user['username']; ?><?php }?>！</li>
				<li class="account"><a href="/order/index.php" id="myaccount" class="account">我的<?php echo $INI['system']['abbreviation']; ?></a></li>
				<li class="logout"><a href="#" onclick="XN.Connect.logout(function(){window.location.href='/account/logout.php';});return true;">退出</a></li>
			</ul>
			  <script type="text/javascript">
				XN_RequireFeatures(["EXNML"], function()
				{
				  XN.Main.init("58f2b48818d446be97a1827dd10d89f2", "/xd_receiver.html");
				});
			</script>
		<?php } else if(is_partner()) { ?>
			<ul class="links">
				<li class="username">欢迎您，<?php echo $login_partner['title']; ?>！</li>
				<li class="account"><a href="/biz/index.php" id="myaccount" class="account">我的<?php echo $INI['system']['abbreviation']; ?></a></li>
				<li class="logout"><a href="/biz/logout.php">退出</a></li>
			</ul>
		<?php } else { ?>
			<ul class="links">
				<li class="account"><a href="/account/signup.php">买家注册</a></li>
				<li class="account"><a href="/partner/create.php"><b style="color:red;">商户注册</b></a></li>
				<li class="account"><a href="#" id="myaccount" class="account">登录</a></li>
				
			</ul>
		<?php }?>
			<div class="line islogin"></div>
		</div>
	<?php if($login_user){?>
		<ul id="myaccount-menu">
			<li><a href="/coupon/index.php">我的<?php echo $INI['system']['couponname']; ?></a></li>
			<li><a href="/order/index.php">我的订单</a></li>
			<li><a href="/account/refer.php">我的邀请</a></li>
			<li><a href="/credit/index.php">账户余额</a></li>
			<li><a href="/account/settings.php">账户设置</a></li>
		</ul>
	<?php } else if(is_partner()) { ?>
		<ul id="myaccount-menu">
			<li><a href="/biz/index.php">商户后台</a></li>
			<li><a href="/biz/coupon_create.php">新建团购</a></li>
			<li><a href="/biz/settings.php">商户资料</a></li>
			<li><a href="/biz/coupon.php">优惠卷列表</a></li>
		</ul>
	<?php } else { ?>
		<ul id="myaccount-menu">
			<li><a href="/account/login.php">买家登陆</a></li>
			<li><a href="/biz/login.php">商户登陆</a></li>
		</ul>
	<?php }?>
		
	</div>
</div>
<!-- JiaThis Button BEGIN -->
<script type="text/javascript" src="http://v1.jiathis.com/code/jiathis_r.js?type=left&amp;move=0&amp;btn=l1.gif" charset="utf-8"></script>
<!-- JiaThis Button END -->

<?php if($session_notice=Session::Get('notice',true)){?>
<div class="sysmsgw" id="sysmsg-success"><div class="sysmsg"><p><?php echo $session_notice; ?></p><span class="close">关闭</span></div></div> 
<?php }?>
<?php if($session_notice=Session::Get('error',true)){?>
<div class="sysmsgw" id="sysmsg-error"><div class="sysmsg"><p><?php echo $session_notice; ?></p><span class="close">关闭</span></div></div> 
<?php }?>
