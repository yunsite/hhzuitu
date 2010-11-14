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
                <div class="head"><h2>新建商户</h2></div>
                <div class="sect">
                    <form id="login-user-form" method="post" action="/partner/create.php" enctype="multipart/form-data" class="validator">
						<div class="wholetip clear"><h3>1、登录信息</h3></div>
                        <div class="field">
                            <label>用户名</label>
                            <input type="text" size="30" name="username" id="partner-create-username" class="f-input" value="<?php echo $partner['username']; ?>" require="true" datatype="require" />
                        </div>
                        <div class="field password">
                            <label>登录密码</label>
                            <input type="password" size="30" name="password" id="settings-password" class="f-input" require="true" datatype="require" />
                        </div>
						<div class="field password">
                            <label for="create-password-confirm">确认密码</label>
                            <input type="password" size="30" name="password2" id="create-password" class="f-input" require="true" datatype="compare" compare="settings-password" />
                        </div>
						<div class="wholetip clear"><h3>2、标注信息</h3></div>
						<div class="field">
							<label>城市及分类</label>
							<select name="city_id" class="f-input" style="width:160px;"><?php echo Utility::Option(option_category('city'), $partner['city_id'], '-选择城市-'); ?></select>&nbsp;<select name="group_id" class="f-input" style="width:160px;"><?php echo Utility::Option(option_category('partner'), $partner['group_id']); ?></select>
						</div>
						<div class="field">
							<label>商家图片</label>
							<input type="file" size="30" name="upload_image" id="partner-create-image" class="f-input" />
							<span class="hint">至少要上传一张商家图片, 高质量的商家图片有利于卖家更详细的了解您.</span>
						</div>
						<div class="field">
							<label>商家图片1</label>
							<input type="file" size="30" name="upload_image1" id="partner-create-image1" class="f-input" />
						</div>
						<div class="field">
							<label>商家图片2</label>
							<input type="file" size="30" name="upload_image2" id="partner-create-image2" class="f-input" />
						</div>
						<div class="wholetip clear"><h3>3、基本信息</h3></div>
                        <div class="field">
                            <label>商户名称</label>
                            <input type="text" size="30" name="title" id="partner-create-title" class="f-input" value="<?php echo $partner['title']; ?>" require="true" datatype="require" />
                        </div>
                        <div class="field">
                            <label>网站地址</label>
                            <input type="text" size="30" name="homepage" id="partner-create-homepage" class="f-input" value="<?php echo $partner['homepage']; ?>"/>
                        </div>
                        <div class="field">
                            <label>联系人</label>
                            <input type="text" size="30" name="contact" id="partner-create-contact" class="f-input" value="<?php echo $partner['contact']; ?>" />
						</div>
                        <div class="field">
                            <label>联系电话</label>
                            <input type="text" size="30" name="phone" id="partner-create-phone" class="f-input" value="<?php echo $partner['phone']; ?>" maxLength="18" datatype="require" require="ture" />
						</div>
                        <div class="field">
                            <label>商户地址</label>
                            <input type="text" size="30" name="address" id="partner-create-address" class="f-input" value="<?php echo $partner['address']; ?>" datatype="require" require="true" />
						</div>
                        <div class="field">
                            <label>手机号码</label>
                            <input type="text" size="30" name="mobile" id="partner-create-mobile" class="f-input" value="<?php echo $partner['mobile']; ?>" maxLength="11" />
						</div>
                        
						<div class="wholetip clear"><h3>4、银行信息</h3></div>
                        <div class="field">
                            <label>开户行</label>
                            <input type="text" size="30" name="bank_name" id="partner-create-bankname" class="f-input" value="<?php echo $partner['bank_name']; ?>"/>
                        </div>
                        <div class="field">
                            <label>开户名</label>
                            <input type="text" size="30" name="bank_user" id="partner-create-bankuser" class="f-input" value="<?php echo $partner['bank_user']; ?>"/>
                        </div>
                        <div class="field">
                            <label>银行账户</label>
                            <input type="text" size="30" name="bank_no" id="partner-create-bankno" class="f-input" value="<?php echo $partner['bank_no']; ?>"/>
                        </div>
						
						<div class="field"style="padding-left:120px;">
                            <span for="bizs">在您创建商户之前，请认真阅读<a href="/about/bizs.php" target="_blank">商户协议</a></span>
                        </div>

						<div style="color:#999;line-height:30px;padding-left:80px">您提交的信息，团旮旯承诺不会透露给任何第三方机构或个人。</div>
                        <div class="act">
                            <input type="submit" value="我已经认真阅读商户协议, 为我创建商户吧!" name="commit" id="partner-submit" class="formbutton"/>
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
                    <h2>已有<?php echo $INI['system']['abbreviation']; ?>商家账户？</h2>
                    <p>请直接<a href="/biz/login.php">登录</a>。</p>
                </div>
            </div>
            <div class="sbox-bottom"></div>
        </div>
		<div class="sbox">
            <div class="sbox-top"></div>
            <div class="sbox-content">
                <div class="side-tip">
                    <h2><?php echo $INI['system']['abbreviation']; ?>商家的优势</h2>
                    <p>凡注册<?php echo $INI['system']['abbreviation']; ?>商家的用户，均可根据自身需要免费发布团购信息，并且这就是你的唯一工作，<?php echo $INI['system']['abbreviation']; ?>最土团队将会完成后期的一切工作。</p>
                </div>
            </div>
            <div class="sbox-bottom"></div>
        </div>
    </div>
</div>
    </div> <!-- bd end -->
</div> <!-- bdw end -->

<?php include template("footer");?>

