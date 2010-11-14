<?php if($others_seconds){?>
<div class="sbox side-business">
	<div class="sbox-top"></div>
	<div class="sbox-content">
		<div class="tip">
		<h2>今日秒杀...</h2>
		<?php $index=0; ?>
		<?php if(is_array($others_seconds)){foreach($others_seconds AS $one) { ?>
			<b><?php echo ++$index; ?>、<?php echo $one['title']; ?>&nbsp;<?php if($one['begin_time'] > time()){?>(未开始)<?php } else if($one['end_time'] < time()) { ?>(已结束)<?php } else { ?>(进行中)<?php }?></b>
			<?php if($one['image']){?><p><a href="/team.php?id=<?php echo $one['id']; ?>"><img src="<?php echo team_image($one['image'], true); ?>" width="195" border="0" /></a></p><?php }?>
			<p><a href="/team.php?id=<?php echo $one['id']; ?>">&raquo;&nbsp;点击参与本单秒杀</a></p>
			</p>
		<?php }}?>
		</div>
	</div>
	<div class="sbox-bottom"></div>
</div>
<?php }?>
