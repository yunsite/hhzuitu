<div id="ftw">
	<div id="ft">
		<p class="contact"><a href="/city.php">城市列表</a>&nbsp;<a href="/feedback/suggest.php">意见反馈</a></p>
		<ul class="cf">
			<li class="col">
				<h3>用户帮助</h3>
				<ul class="sub-list">
					<li><a href="/help/tour.php">玩转<?php echo $INI['system']['abbreviation']; ?></a></li>
					<li><a href="/help/faqs.php">常见问题</a></li>
					<li><a href="/help/zuitu.php"><?php echo $INI['system']['abbreviation']; ?>概念</a></li>
					<li><a href="/help/api.php">开发API</a></li>
				</ul>
			</li>
			<li class="col">
				<h3>获取更新</h3>
				<ul class="sub-list">
					<li><a href="/subscribe.php?ename=<?php echo $city['ename']; ?>">邮件订阅</a></li>
					<li><a href="/feed.php?ename=<?php echo $city['ename']; ?>">RSS订阅</a></li>
				<?php if($INI['system']['sinajiwai']){?>
					<li><a href="<?php echo $INI['system']['sinajiwai']; ?>" target="_blank">新浪微博</a></li>
				<?php }?>
				<?php if($INI['system']['tencentjiwai']){?>
					<li><a href="<?php echo $INI['system']['tencentjiwai']; ?>" target="_blank">腾讯微博</a></li>
				<?php }?>
				</ul>
			</li>
			<li class="col">
				<h3>合作联系</h3>
				<ul class="sub-list">
					<li><a href="/feedback/seller.php">商务合作</a></li>
					<li><a href="/help/link.php">友情链接</a></li>
					<li><a href="/biz/index.php">商家后台</a></li>
					<?php if(is_manager(false, true)){?>
					<li><a href="/manage/index.php">管理<?php echo $INI['system']['abbreviation']; ?></a></li>
					<?php }?>
				</ul>
			</li>
			<li class="col">
				<h3>公司信息</h3>
				<ul class="sub-list">
					<li><a href="/about/us.php">关于<?php echo $INI['system']['abbreviation']; ?></a></li>
					<li><a href="/about/job.php">工作机会</a></li>
					<li><a href="/about/contact.php">联系方式</a></li>
					<li><a href="/about/terms.php">买家协议</a></li>
					<li><a href="/about/bizs.php">商户协议</a></li>
				</ul>
			</li>
			<li class="col end">
					<div class="logo-footer">
						<a href="/"><img src="/static/css/i/logo-footer.gif" height="52px" width="246px"/></a>
					</div>
			</li>
		</ul>
		<div class="copyright">
		<p>&copy;<span>2010</span>&nbsp;<?php echo $INI['system']['sitename']; ?>（TuanGaLa.com）版权所有&nbsp;<a href="/about/terms.php">使用<?php echo $INI['system']['abbreviation']; ?>前必读</a>&nbsp;<a href="http://www.miibeian.gov.cn/" target="_blank"><?php echo $INI['system']['icp']; ?></a>&nbsp;Powered by <a href="http://www.hhdem.com/" target="_blank">HHdem</a>.</p>
		<p><img src="http://img.tongji.linezing.com/2129146/tongji.gif"></p>
		</div>
		<div style="float:center;">
			<a href="http://www.zentuan.com" target="_blank"><img src="/static/img/links/zentuan.gif" border="0"></a>
			<a href="http://tuan.ezeyou.com/" target="_blank"><img src="/static/img/links/yizeyou.gif" border="0"></a>
			<a href="http://www.tlive.com.cn" target="_blank"><img src="/static/img/links/shenghuohui.gif" width="88" height="31" border="0" alt="城市生活荟,绘生活!" title="城市生活荟,绘生活!" /></a>
			<a href="http://www.tuanp.com" target="_blank"><img src="/static/img/links/tuanp.gif" border="0" height="31px"></a>
			<a href="http://www.haokx.com" target="_blank"><img src="/static/img/links/haokx.gif" border="0"></a>
			<a href="http://www.findtuan.com" target="_blank"><img src="/static/img/links/fantuan.jpg" height="31px" border="0"></a>
			<a href="http://www.ttturn.com" target="_blank"><img src="/static/img/links/tuantuanzhuan.png" height="31px" border="0" alt="团购导航-中国团购在线，可信赖的团购网站导航大全-团团转(TTturn.com)"></a>
			<a href="http://www.letyo.com" target="_blank"><img src="http://bangimg.oobang.com/tuan123/letyo2.gif" height="31px" style="border:0 none"></a>
			<a href="http://www.tuan138.com" target="_blank" title="团购导航"><img src="http://www.tuan138.com/images/logo_m.gif" height="31px" alt="团138团购导航"></a>
		</div>
		</div>
		<script type="text/javascript">

		  var _gaq = _gaq || [];
		  _gaq.push(['_setAccount', 'UA-16688536-2']);
		  _gaq.push(['_trackPageview']);

		  (function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();

		</script>

	</div>
</div>

<?php include template("html_footer");?>
