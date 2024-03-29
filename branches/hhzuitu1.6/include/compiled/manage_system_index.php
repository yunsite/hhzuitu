<?php include template("manage_header");?>

<div id="bdw" class="bdw">
<div id="bd" class="cf">
<div id="partner">
	<div class="dashboard" id="dashboard">
		<ul><?php echo mcurrent_system('index'); ?></ul>
	</div>
	<div id="content" class="clear mainwide">
        <div class="clear box">
            <div class="box-top"></div>
            <div class="box-content">
                <div class="head"><h2>基本设置</h2></div>
                <div class="sect">
                    <form method="post">
						<div class="wholetip clear"><h3>1、基本信息</h3></div>
                        <div class="field">
                            <label>网站名称</label>
                            <input type="text" size="30" name="system[sitename]" class="f-input" value="<?php echo $INI['system']['sitename']; ?>"/>
                        </div>
                        <div class="field">
                            <label>网站标题</label>
                            <input type="text" size="30" name="system[sitetitle]" class="f-input" value="<?php echo $INI['system']['sitetitle']; ?>"/>
                        </div>
                        <div class="field">
                            <label>网站简称</label>
                            <input type="text" size="30" name="system[abbreviation]" class="f-input" value="<?php echo $INI['system']['abbreviation']; ?>"/>
                        </div>
                        <div class="field">
                            <label>优惠券名</label>
                            <input type="text" size="30" name="system[couponname]" class="f-input" value="<?php echo $INI['system']['couponname']; ?>"/>
                        </div>
                        <div class="field">
                            <label>货币符号</label>
                            <input type="text" size="30" name="system[currency]" class="number" value="<?php echo $INI['system']['currency']; ?>"/>
						</div>
                        <div class="field">
                            <label>货币代码</label>
                            <input type="text" size="30" name="system[currencyname]" class="number" value="<?php echo $INI['system']['currencyname']; ?>"/><span class="inputtip">如：CNY, USD 等</span>
						</div>
                        <div class="field">
                            <label>邀请返利</label>
                            <input type="text" size="30" name="system[invitecredit]" class="number" value="<?php echo abs(intval($INI['system']['invitecredit'])); ?>"/>
							<span class="inputtip">单位：元</span>
						</div>
                        <div class="field">
                            <label>侧栏团购？</label>
                            <input type="text" size="30" name="system[sideteam]" class="number" value="<?php echo abs(intval($INI['system']['sideteam'])); ?>"/>
							<span class="inputtip">侧栏团购数，默认为 0</span>
							<span class="hint">在团购页面的右侧栏显示当前正在进行的其他团购项目？</span>
						</div>
						<div class="wholetip clear"><h3>2、杂项设置</h3></div>
                        <div class="field">
                            <label>成团条件</label>
                            <input type="text" size="30" name="system[conduser]" class="number" value="<?php echo abs(intval($INI['system']['conduser'])); ?>"/><span class="inputtip">1 以成功付款人数为限 0 以成交产品数量为限</span>
						</div>
                        <div class="field">
                            <label>优惠券下载</label>
                            <input type="text" size="30" name="system[partnerdown]" class="number" value="<?php echo abs(intval($INI['system']['partnerdown'])); ?>"/><span class="inputtip">1 商户可下载编号及密码，0 商户仅可下载编号</span>
						</div>
                        <div class="field">
                            <label>压缩输出</label>
                            <input type="text" size="30" name="system[gzip]" class="number" value="<?php echo abs(intval($INI['system']['gzip'])); ?>"/><span class="inputtip">1 压缩，0 不压缩</span>
							<span class="hint">压缩输出可以减少网络流量传输，并节省用户下载时间，但会稍微降低服务器性能</span>
						</div>
						<div class="wholetip clear"><h3>3、客服信息</h3></div>
                        <div class="field">
                            <label>客服QQ</label>
                            <input type="text" size="30" name="system[kefuqq]" class="f-input" value="<?php echo $INI['system']['kefuqq']; ?>"/>
						</div>
                        <div class="field">
                            <label>客服MSN</label>
                            <input type="text" size="30" name="system[kefumsn]" class="f-input" value="<?php echo $INI['system']['kefumsn']; ?>"/>
						</div>
						<div class="wholetip clear"><h3>4、其他信息</h3></div>
                        <div class="field">
                            <label>ICP编号</label>
                            <input type="text" size="30" name="system[icp]" class="f-input" value="<?php echo $INI['system']['icp']; ?>"/>
						</div>
                        <div class="field">
                            <label>统计代码</label>
                            <input type="text" size="30" name="system[statcode]" class="f-input" value="<?php echo htmlspecialchars(stripslashes($INI['system']['statcode'])); ?>"/>
						</div>
                        <div class="field">
                            <label>新浪微博</label>
                            <input type="text" size="30" name="system[sinajiwai]" class="f-input" value="<?php echo htmlspecialchars(stripslashes($INI['system']['sinajiwai'])); ?>"/>
						</div>
                        <div class="field">
                            <label>腾讯微博</label>
                            <input type="text" size="30" name="system[tencentjiwai]" class="f-input" value="<?php echo htmlspecialchars(stripslashes($INI['system']['tencentjiwai'])); ?>"/>
						</div>
						<div class="act">
                            <input type="submit" value="保存" name="commit" class="formbutton" />
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

<?php include template("manage_footer");?>
