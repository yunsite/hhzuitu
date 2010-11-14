<?php include template("header");?>

<div id="bdw" class="bdw">
<div id="bd" class="cf">
<?php if($order){?>
<div id="ads_content_box" class="coupons-box clear mainwide">
	<div class="box clear">
		<div class="ads_top"></div>
		<div id="ads_content">
			您已经下过订单，但还没有付款。<a href="/order/check.php?id=<?php echo $order['id']; ?>">查看订单并付款</a>
		</div>
		<div class="ads_bottom"></div>
	</div>
</div>
<?php }?>

	<div id="deal-default" class="l">
		
		<?php if(is_array($teams)){foreach($teams AS $index=>$team) { ?>
		<div id="team_<?php echo $team['id']; ?>" >
		<?php include template("block_team_share");?>
		<div class="content">
			<div class="cityimg"><img src="/static/css/i/area/<?php echo $city['ename']; ?>.png"></div>
			<div id="deal-intro" class="cf">
                <h1><?php if($team['close_time']==0){?><a class="deal-today-link" href="/team.php?id=<?php echo $team['id']; ?>">今日第<?php echo $index+1; ?>团：</a><?php }?><a href="/team.php?id=<?php echo $team['id']; ?>" title="<?php echo $team['title']; ?>" style="color:black;"><?php echo $team['title']; ?></a></h1>
                <div class="main">
                    <div class="deal-buy">
                        <div class="deal-price-tag"></div>
					<?php if(($team['state']=='soldout')){?>
                        <p class="deal-price"><strong><?php echo $currency; ?><?php echo moneyit($team['team_price']); ?></strong><span class="deal-price-soldout"></span></p>
					<?php } else if($team['close_time']) { ?>
                        <p class="deal-price"><strong><?php echo $currency; ?><?php echo moneyit($team['team_price']); ?></strong><span class="deal-price-expire"></span></p>
					<?php } else { ?>
                        <p class="deal-price"><strong><?php echo $currency; ?><?php echo moneyit($team['team_price']); ?></strong><span><a <?php echo $team['begin_time']<time()?'href="/team/buy.php?id='.$team['id'].'"':''; ?>><img src="/static/css/i/button-deal-buy.gif" /></a></span></p>
					<?php }?>
                    </div>
                    <table class="deal-discount">
                        <tr>
                            <th>原价</th>
                            <th>折扣</th>
                            <th>节省</th>
                        </tr>
                        <tr>
                            <td><?php echo $currency; ?><?php echo moneyit($team['market_price']); ?></td>
							<td><?php echo team_discount($team); ?></td>
                            <td><?php echo $currency; ?><?php echo $team['discount_price']; ?></td>
                        </tr>
                    </table>
					<?php if($team['close_time']){?>
                    <div class="deal-box deal-timeleft deal-off" id="deal-timeleft" curtime="<?php echo $now; ?>000" diff="$<?php echo $one['end_time']-$now; ?>000">
						<h3>本团购结束于</h3>
						<div class="limitdate"><p class="deal-buy-ended"><?php echo date('Y-m-d', $team['close_time']); ?><br><?php echo date('H:i:s', $team['close_time']); ?></p></div>
					</div>
					<?php } else { ?>
                    <div class="deal-box deal-timeleft deal-on" id="deal-timeleft" curtime="<?php echo $now; ?>000" diff="$<?php echo $one['end_time']-$now; ?>000">
						<h3>剩余时间</h3>
						<div class="limitdate"><ul id="counter">
						<?php if($team['left_day']>0){?>
							<li><span><?php echo $team['left_day']; ?></span>天</li><li><span><?php echo $team['left_hour']; ?></span>小时</li><li><span><?php echo $team['left_minute']; ?></span>分钟</li>
						<?php } else { ?>
							<li><span><?php echo $team['left_hour']; ?></span>小时</li><li><span><?php echo $team['left_minute']; ?></span>分钟</li><li><span><?php echo $team['left_time']; ?></span>秒</li>
						<?php }?>
						</ul></div>
					</div>
					<?php }?>

				<?php if($team['close_time']==0){?>
					<?php if($team['state']=='none'){?>
					<div class="deal-box deal-status" id="deal-status">
						<p class="deal-buy-tip-top"><strong><?php echo $team['now_number']; ?></strong> 人已购买</p>
						<div class="progress-pointer" style="padding-left:<?php echo $team['bar_size']-$team['bar_offset']; ?>px;"><span></span></div>
						<div class="progress-bar"><div class="progress-left" style="width:<?php echo $team['bar_size']-$team['bar_offset']; ?>px;"></div><div class="progress-right "></div></div>
						<div class="cf"><div class="min">0</div><div class="max"><?php echo $team['min_number']; ?></div></div>
						<p class="deal-buy-tip-btm">还差 <strong><?php echo $team['min_number']-$team['now_number']; ?></strong> 人到达最低团购人数</p>
					</div>
					<?php } else { ?>
					<div class="deal-box deal-status deal-status-open" id="deal-status">
						<p class="deal-buy-tip-top"><strong><?php echo $team['now_number']; ?></strong> 人已购买</p>
					<?php if($team['max_number']&&$team['max_number']>$team['now_number']){?>
						<p class="deal-buy-tip-btm">本单仅剩：<strong><?php echo $team['max_number']-$team['now_number']; ?></strong>份，欲购从速</p>
					<?php }?>
						<p class="deal-buy-on" style="line-height:200%;"><img src="/static/css/i/deal-buy-succ.gif"/> 团购成功！ <?php if($team['max_number']>$team['now_number']||$team['max_number']==0){?><br/>还可以继续购买<?php }?></p>
					<?php if($team['reach_time']){?>
						<p class="deal-buy-tip-btm"><?php echo date('G点i分', $team['reach_time']); ?>达到最低团购人数：<strong><?php echo $team['min_number']; ?></strong>人</p>
					<?php }?>
					</div>
					<?php }?>
				<?php } else { ?>
					<div class="deal-box deal-status deal-status-<?php echo $team['state']; ?>" id="deal-status"><div class="deal-buy-<?php echo $team['state']; ?>"></div><p class="deal-buy-tip-total">共有 <strong><?php echo $team['now_number']; ?></strong> 人购买</p></div> 
				<?php }?>
				</div>
				<div class="side">
                     <div class="deal-buy-cover-img" id="team_images">
						<a href="/team.php?id=<?php echo $team['id']; ?>" title="<?php echo $team['title']; ?>">
							<img src="<?php echo team_image($team['image']); ?>" width="440" height="280" />
						</a>
					</div>
                    <div class="digest"><br /><?php echo nl2br(strip_tags($team['summary'])); ?></div>
                </div>
            </div>
		</div>
    </div>
<?php }}?>
    
</div>
	<div id="sidebar">
		<?php include template("block_side_invite");?>
		<?php include template("block_side_bulletin");?>
		<?php include template("block_side_flv");?>
		<?php include template("block_side_others_seconds");?>
		<?php include template("block_side_others");?>
		<?php include template("block_side_vote");?>
		<?php include template("block_side_business");?>
		<?php include template("block_site_changelog");?>
		<?php include template("block_side_subscribe");?>
	</div>
</div> <!-- bd end -->
</div> <!-- bdw end -->
<script type="text/javascript" src="http://static.connect.renren.com/js/v1.0/FeatureLoader.jsp"></script>
<?php if(!$login_user){?>

  <script type="text/javascript">
	XN_RequireFeatures(["EXNML"], function()
	{
	  XN.Main.init("58f2b48818d446be97a1827dd10d89f2", "/xd_receiver.html", {"forceLoginPopup": false,"ifUserConnected":"/xiaonei/connect_ok.php"});
	});
</script>
<?php }?>
<?php include template("footer");?>
