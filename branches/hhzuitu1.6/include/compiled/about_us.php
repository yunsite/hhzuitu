<?php include template("header");?>

<div id="bdw" class="bdw">
<div id="bd" class="cf">
<div id="about">
	<div class="dashboard" id="dashboard">
		<ul><?php echo current_about('us'); ?></ul>
	</div>
	<div id="content" class="about clear">
        <div class="clear box">
            <div class="box-top"></div>
            <div class="box-content">
                <div class="head"><h2>关于<?php echo $INI['system']['abbreviation']; ?></h2></div>
                <div class="sect"><?php echo $page['value']; ?></div>
            </div>
            <div class="box-bottom"></div>
        </div>
	</div>
	<div id="sidebar">
        <?php include template("block_side_bizcreate");?>
		<?php include template("block_side_bizupper");?>
    </div>
</div>
</div> <!-- bd end -->
</div> <!-- bdw end -->

<?php include template("footer");?>
