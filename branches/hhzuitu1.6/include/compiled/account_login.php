<?php include template("header");?>

<div id="bdw" class="bdw">
<div id="bd" class="cf">
<div id="login">
	<div class="dashboard" id="dashboard">
	</div>
    <div id="content" class="login-box clear">
        <div class="box">
            <div class="box-top"></div>
            <div class="box-content">
                <div class="head"><h2>登录</h2><span>&nbsp;或者 <a href="/account/signup.php">注册</a></span></div>
                <div class="sect">
                    <form id="login-user-form" method="post" action="/account/login.php" class="validator">
                        <div class="field email">
                            <label for="login-email-address">Email／用户名</label>
                            <input type="text" size="30" name="email" id="login-email-address" class="f-input" value="" require="true" datatype="require|limit" min="2" />
                        </div>
                        <div class="field password">
                            <label for="login-password">密码</label>
                            <input type="password" size="30" name="password" id="login-password" class="f-input" require="true" datatype="require" />
                            <span class="lostpassword"><a href="/account/repass.php">忘记密码？</a></span> 
                        </div>
                        <div class="field autologin">
                            <input type="checkbox" value="1" name="auto-login" id="autologin" class="f-check" checked />
                            <label for="autologin">下次自动登录</label>
                        </div>
                        <div class="act">
                            <input type="submit" value="登录" name="commit" id="login-submit" class="formbutton"/>
                        </div>
                    </form>
                </div>
				<div class="sect">
					<div class="field email">
						<label for="login-email-address">合作网站</label>
						<xn:login-button size="medium" background="black" label="人人账户" autologoutlink="true">人人账户</xn:login-button>
					</div>
				</div>
            </div>
            <div class="box-bottom"></div>
        </div>
    </div>
    <div id="sidebar">
        <?php include template("block_side_usercreate");?>
		<div class="sbox">
            <div class="sbox-top"></div>
            <div class="sbox-content">
                <div class="side-tip">
                    <h2><?php echo $INI['system']['abbreviation']; ?>买家</h2>
                    <p>快快注册吧！这里有最齐全的商品，最晕眩的折扣价格哦。</p>
                </div>
            </div>
            <div class="sbox-bottom"></div>
        </div>
    </div>
</div>
    </div> <!-- bd end -->
</div> <!-- bdw end -->	
  <script type="text/javascript">
	XN_RequireFeatures(["EXNML"], function()
	{
	  XN.Main.init("58f2b48818d446be97a1827dd10d89f2", "/xd_receiver.html", {"forceLoginPopup": false,"ifUserConnected":"/xiaonei/connect_ok.php"});
	});
</script>
<?php include template("footer");?>
