<?php include template("manage_header");?>
<style type="text/css">
input {background-color: #FFF;border: 1px solid #CCC;color: #000;line-height: 25px;height: 25px;}
body {font-size: 12px;}
</style>
<div id="bdw" class="bdw">
<div id="bd" class="cf">
<div id="leader">
	<div class="dashboard" id="dashboard">
		<ul><?php echo mcurrent_team('team'); ?></ul>
	</div>
	<div id="content" class="clear mainwide">
        <div class="clear box">
            <div class="box-top"></div>
            <div class="box-content">
                <div class="head">
					<h2>编辑团购人数</h2>
				</div>
                <div class="sect">
				<table width="300" border="0" align="center" cellpadding="5" cellspacing="1" bgcolor="#C8FFFF">
					<form method="post">
						<tr>
							<td height="35" align="center" bgcolor="#FBFFFF">团购ID</td>
							<td bgcolor="#FBFFFF"><input name="id" type="text"></td>
						</tr>
						<tr>
							<td height="35" align="center" bgcolor="#FBFFFF">团购人数</td>
							<td bgcolor="#FBFFFF"><input name="now_number" type="text"></td>
						</tr>
						<tr>
							<td height="35" colspan="2" align="center" bgcolor="#FBFFFF"><input type="submit" name="button" id="button" value=" 提 交 " /></td>
						</tr>
					</form>
				</table>
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