<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" id="bb5c110b0512ff89999a055118a84509">
<head>
	<meta http-equiv=content-type content="text/html; charset=UTF-8">
	<title>最土团购程序商业版程序安装</title>
	<link rel="shortcut icon" href="static/icon/favicon.ico" />
	<link rel="stylesheet" href="static/css/index.css" type="text/css" media="screen" charset="utf-8" />
	<script src="static/js/index.js" type="text/javascript"></script>
</head>
<body class="newbie">
<div id="pagemasker"></div><div id="dialog"></div>
<div id="doc">

<div id="hdw">
	<div id="hd">
		<div id="logo"><a href="index.php" class="link"><img src="static/css/i/logo.gif" /></a></div>
		<div class="guides">
			<div class="city">
				<h2>程序安装</h2>
			</div>
		</div>
		<ul class="nav cf"><li class="current"><a href="install.php">安装</a></li></ul>
				<div class="logins">
			<ul id="account">
				<li class="username">欢迎您选用最土团购程序</li>
			</ul>
			<div class="line islogin"></div>
		</div>
			</div>
</div>

<?php if($session_notice=Session::Get('notice',true)){?>
<div class="sysmsgw" id="sysmsg-success"><div class="sysmsg"><p><?php echo $session_notice; ?></p><span class="close">关闭</span></div></div> 
<?php }?>
<?php if($session_notice=Session::Get('error',true)){?>
<div class="sysmsgw" id="sysmsg-error"><div class="sysmsg"><p><?php echo $session_notice; ?></p><span class="close">关闭</span></div></div> 
<?php }?>

<div id="bdw" class="bdw">
<div id="bd" class="cf">
<div id="partner">
	<div id="content" class="clear mainwide">
        <div class="clear box">
            <div class="box-top"></div>
            <div class="box-content">
                <div class="head"><h2>安装信息</h2></div>
                <div class="sect">
                    <form id="login-user-form" method="post" action="install.php">
					<input type="hidden" name="id" value="100027" />
						<div class="wholetip clear"><h3>1、数据库信息</h3></div>
                        <div class="field">
                            <label>主机名</label>
                            <input type="text" size="30" name="db[host]" id="partner-create-username" class="f-input" value="<?php echo $db['host']; ?>" />
                        </div>
                        <div class="field">
                            <label>用户名</label>
                            <input type="text" size="30" name="db[user]" id="settings-password" class="f-input" value="<?php echo $db['user']; ?>" />
                        </div>
                        <div class="field password">
                            <label>密码</label>
                            <input type="text" size="30" name="db[pass]" id="settings-password" class="f-input" value="<?php echo $db['pass']; ?>" />
                        </div>
                        <div class="field password">
                            <label>数据库名</label>
                            <input type="text" size="30" name="db[name]" id="settings-password-confirm" class="f-input" value="<?php echo $db['name']; ?>" />
                        </div>

						<div class="wholetip clear"><h3>2、目录设置</h3></div>
						<div style="margin:20px; line-height:20px;">
							<h4>确保下列目录或文件可写</h4>
							<ul>
							<li>目录：include/configure/ ---------------- <b><?php echo !is_writable('include/configure') ? '<font color="red">不可写</font>':'<font color="green">可写</font>'; ?></b></li>
							<li>目录：include/data/ ---------------- <b><?php echo !is_writable('./include/data') ? '<font color="red">不可写</font>':'<font color="green">可写</font>'; ?></b></li>
							<li>目录：static/team/ ---------------- <b><?php echo !is_writable('./static/team') ? '<font color="red">不可写</font>':'<font color="green">可写</font>'; ?></b></li>
							<li>目录：static/user/ ---------------- <b><?php echo !is_writable('./static/user') ? '<font color="red">不可写</font>':'<font color="green">可写</font>'; ?></b></li>
							</ul>
						</div>
                        <div class="act">
                            <input type="submit" value="安装" name="commit" id="partner-submit" class="formbutton"/>
                        </div>
                    </form>
                </div>
            </div>
            <div class="box-bottom"></div>
        </div>
	</div>

<div id="sidebar">
</div>

</div>
</div> <!-- bd end -->
</div> <!-- bdw end -->

<div id="ftw">
	<div id="ft">
		<p class="contact"><a href="http://bbs.zuitu.com/" target="_blank">意见反馈</a></p>
		<ul class="cf">
			<li class="col">
				<h3>用户帮助</h3>
				<ul class="sub-list">
					<li><a href="http://www.zuitu.com/help.html" target="_blank">帮助中心</a></li>
				</ul>
			</li>
			<li class="col">
				<h3>获取更新</h3>
				<ul class="sub-list">
					<li><a href="http://bbs.zuitu.com/" target="_blank">最土论坛</a></li>
				</ul>
			</li>
			<li class="col">
				<h3>合作联系</h3>
				<ul class="sub-list">
				<li><a href="http://notice.zuitu.com/" target="_blank">增值中心</a></li>
					</ul>
			</li>
			<li class="col">
				<h3>公司信息</h3>
				<ul class="sub-list">
				<li><a href="http://www.zuitu.com/" target="_blank">最土官网</a></li>
				</ul>
			</li>
			<li class="col end">
					<div class="logo-footer">
						<a href="index.php"><img src="static/css/i/logo-footer.gif" /></a>
					</div>
			</li>
		</ul>
		<div class="copyright">
		<p>&copy;<span>2010</span>&nbsp;最土网（zuitu.com）版权所有&nbsp;<a href="http://www.zuitu.com/question.html" target="_blank">使用最土前必读</a>&nbsp;<a href="http://www.miibeian.gov.cn/" target="_blank">皖ICP备05017430号</a></p>
		</div>
	</div>
</div>
</div>
</body>
</html>
