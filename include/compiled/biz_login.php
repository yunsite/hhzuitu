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
                <div class="head"><h2>商家登录</h2><span>&nbsp;或者 <a href="/biz/partner_create.php">注册</a></span></div>
                <div class="sect">
                    <form id="biz-user-form" method="post" action="/biz/login.php" class="validator">
                        <div class="field">
                            <label for="biz-login">登录名</label>
                            <input type="text" size="30" name="username" id="biz-username" class="f-input" datatype="require" require="true" />
                        </div>
                        <div class="field">
                            <label for="biz-password">密码</label>
                            <input type="password" size="30" name="password" id="biz-password" class="f-input" datatype="require" require="true" />
                        </div>
                        <div class="act">
                            <input type="submit" value="登录" name="commit" id="login-submit" class="formbutton"/>
                        </div>
                    </form>
                </div>
            </div>
            <div class="box-bottom"></div>
        </div>
    </div>
    <div id="sidebar">
		<div class="sbox">
            <div class="sbox-top"></div>
            <div class="sbox-content">
                <div class="side-tip">
                    <h2>还没有<?php echo $INI['system']['abbreviation']; ?>商家账户？</h2>
                    <p>成为<a href="/partner/create.php">>><?php echo $INI['system']['abbreviation']; ?>商家</a> <br>仅需30秒，就可以轻松把你的<br>商品分享到<?php echo $INI['system']['abbreviation']; ?>！</p>
                </div>
            </div>
            <div class="sbox-bottom"></div>
        </div>
    </div>
</div>
    </div> <!-- bd end -->
</div> <!-- bdw end -->

<?php include template("footer");?>




