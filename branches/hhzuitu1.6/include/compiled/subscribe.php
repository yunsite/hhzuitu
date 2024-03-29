<?php include template("header");?>
<div id="bdw" class="bdw">
<div id="bd" class="cf">
<div id="maillist">
	<div id="content">
        <div class="box">
            <div class="box-top"></div>
            <div class="box-content welcome">
				<div class="head">
					 <h2>邮件订阅</h2>
				</div>
                <div class="sect">
					<div class="lead"><h4>把<?php echo $city['name']; ?>每天最新的精品团购信息发到您的邮箱。</h4></div>
					<div class="enter-address">
						<p>立即邮件订阅每日团购信息，不错过每一天的惊喜。</p>
						<div class="enter-address-c">
						<form id="enter-address-form" action="/subscribe.php" method="post" class="validator">
						<div class="mail">
							<label>邮件地址：</label>
							<input id="enter-address-mail" name="email" class="f-input f-mail" type="text" value="<?php echo $login_user['email']; ?>" size="20" require="true" datatype="email" />
							<span class="tip">请放心，我们和您一样讨厌垃圾邮件</span>
						</div>
						<div class="city">
							<label>&nbsp;</label>
							<select name="city_id" class="f-city"><?php echo Utility::Option(Utility::OptionArray($hotcities, 'id', 'name'), $city['id']); ?></select>
							<input id="enter-address-commit" type="submit" class="formbutton" value="订阅" />
						</div>
						</form>
					</div>
					<div class="clear"></div>
				</div>
				<div class="intro">
					<p>每日精品团购包括：</p>
					<p>餐厅、酒吧、KTV、SPA、美发、健身、瑜伽、演出、影院等。</p>
				</div>
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

<?php include template("footer");?>
