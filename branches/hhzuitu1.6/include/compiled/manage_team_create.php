<?php include template("manage_header");?>

<script>
	$('#team-create-notice').xheditor({upLinkUrl:"upload.php",upLinkExt:"zip,rar,txt",upImgUrl:"upload.php",upImgExt:"jpg,jpeg,gif,png",upFlashUrl:"upload.php",upFlashExt:"swf",upMediaUrl:"upload.php",upMediaExt:"wmv,avi,wma,mp3,mid"});
</script>
<div id="bdw" class="bdw">
<div id="bd" class="cf">
<div id="leader">
	<div class="dashboard" id="dashboard">
		<ul><?php echo mcurrent_team($selector); ?></ul>
	</div>
	<div id="content" class="clear mainwide">
        <div class="clear box">
            <div class="box-top"></div>
            <div class="box-content">
                <div class="head"><b><h2>新建项目</h2></b></div>
                <div class="sect">
				<form id="login-user-form" method="post" action="/manage/team/create.php" enctype="multipart/form-data" class="validator">
					<div class="wholetip clear"><h3>1、基本信息</h3></div>
					<div class="field">
						<label>项目类型</label>
						<select name="team_type" class="f-input" style="width:160px;" onchange="X.team.changetype(this.options[this.options.selectedIndex].value);"><?php echo Utility::Option($option_teamtype, $team['team_type']); ?></select>
					</div>
					<div class="field" id="field_city">
						<label>城市及分类</label>
						<select name="city_id" class="f-input" style="width:160px;"><?php echo Utility::Option(Utility::OptionArray($hotcities, 'id','name'), $team['city_id'], '全部城市'); ?></select>
						<select name="group_id" class="f-input" style="width:160px;"><?php echo Utility::Option($groups, $team['group_id']); ?></select>
					</div>
					<div class="field" id="field_limit">
						<label>限制条件</label>
						<select name="conduser" class="f-input" style="width:160px;"><?php echo Utility::Option($option_cond, $team['conduser']); ?></select>
						<select name="buyonce" class="f-input" style="width:160px;"><?php echo Utility::Option($option_buyonce, $team['buyonce']); ?></select>
					</div>
					<div class="field">
						<label>项目标题</label>
						<input type="text" size="30" name="title" id="team-create-title" class="f-input" value="<?php echo $team['title']; ?>" require="true" datatype="require"/>
					</div>
					<div class="field">
						<label>市场价</label>
						<input type="text" size="10" name="market_price" id="team-create-market-price" class="number" value="<?php echo moneyit($team['market_price']); ?>" datatype="money" require="true" />
						<label>网站价</label>
						<input type="text" size="10" name="team_price" id="team-create-team-price" class="number" value="<?php echo moneyit($team['team_price']); ?>" datatype="double" require="true" />
					</div>
					<div class="field" id="field_num">
						<label>最低数量</label>
						<input type="text" size="10" name="min_number" id="team-create-min-number" class="number" value="<?php echo intval($team['min_number']); ?>" maxLength="6" datatype="number" require="true" />
						<label>最高数量</label>
						<input type="text" size="10" name="max_number" id="team-create-max-number" class="number" value="<?php echo intval($team['max_number']); ?>" maxLength="6" datatype="number" require="true" />
						<label>每人限购</label>
						<input type="text" size="10" name="per_number" id="team-create-per-number" class="number" value="<?php echo intval($team['per_number']); ?>" maxLength="6" datatype="number" require="true" />
						<span class="hint">最低数量必须大于0，最高数量/每人限购：0 表示没最高上限 （产品数|人数 由成团条件决定）</span>
					</div>
					<div class="field">
						<label>开始时间</label>
						<input type="text" size="10" name="begin_time" id="team-create-begin-time" class="date" xd="<?php echo date('Y-m-d', $team['begin_time']); ?>" xt="<?php echo date('H:i:s', $team['begin_time']); ?>" value="<?php echo date('Y-m-d', $team['begin_time']); ?>" maxLength="10" />
						<label>结束时间</label>
						<input type="text" size="10" name="end_time" id="team-create-end-time" class="date" xd="<?php echo date('Y-m-d', $team['end_time']); ?>" xt="<?php echo date('H:i:s', $team['end_time']); ?>" value="<?php echo date('Y-m-d', $team['end_time']); ?>" maxLength="10" />
						<label><?php echo $INI['system']['couponname']; ?>有效期</label>
						<input type="text" size="10" name="expire_time" id="team-create-expire-time" class="number" value="<?php echo date('Y-m-d', $team['expire_time']); ?>" maxLength="10" />
						<span class="hint">时间格式：hh:ii:ss (例：14:05:58)，日期格式：YYYY-MM-DD （例：2010-06-10）</span>
					</div>
					<div class="field">
						<label>本单简介</label>
						<div style="float:left;"><textarea cols="45" rows="5" name="summary" id="team-create-summary" class="f-textarea" datatype="require" require="true"></textarea></div>
					</div>
					<div class="field" id="field_notice">
						<label>特别提示</label>
						<div style="float:left;"><textarea cols="45" rows="5" name="notice" id="team-create-notice" class="f-textarea editor"><?php echo $team['notice']; ?></textarea></div>
						<span class="hint">关于本单项目的有效期及使用说明</span>
					</div>
					<!--kxx 增加-->
					<div class="field">
						<label>排序</label>
						<input type="text" size="10" name="sort_order" id="team-create-sort_order" class="number" value="<?php echo $team['sort_order'] ? $team['sort_order'] : 0; ?>" datatype="number"/><span class="inputtip">请填写数字，数值大到小排序，主推团购应设置较大值</span>
					</div>
					<!--xxk-->
					<input type="hidden" name="guarantee" value="Y" />
					<input type="hidden" name="system" value="Y" />
					<div class="wholetip clear"><h3>2、项目信息</h3></div>
					<div class="field">
						<label>商户</label>
						<select name="partner_id" datatype="require" require="require" class="f-input" style="width:300px;"><?php echo Utility::Option($partners, $team['partner_id'], '------ 请选择商户 ------'); ?></select><span class="inputtip">商户为可选项</span>
					</div>
					<div class="field" id="field_card">
						<label>代金券使用</label>
						<input type="text" size="10" name="card" id="team-create-card" class="number" value="<?php echo moneyit($team['card']); ?>" require="true" datatype="money" />
						<span class="inputtip">可使用代金券最大面额</span>
					</div>
					<div class="field" id="field_card">
						<label>邀请返利</label>
						<input type="text" size="10" name="bonus" id="team-create-bonus" class="number" value="<?php echo moneyit($team['bonus']); ?>" require="true" datatype="money" />
						<span class="inputtip">邀请好友参与本单商品购买时的返利金额</span>
					</div>
					<div class="field">
						<label>商品名称</label>
						<input type="text" size="30" name="product" id="team-create-product" class="f-input" value="<?php echo $team['product']; ?>" datatype="require" require="true" />
					</div>
					<div class="field">
						<label>商品图片</label>
						<input type="file" size="30" name="upload_image" id="team-create-image" class="f-input" />
						<span class="hint">至少得上传一张商品图片</span>
					</div>
					<div class="field">
						<label>商品图片1</label>
						<input type="file" size="30" name="upload_image1" id="team-create-image1" class="f-input" />
					</div>
					<div class="field">
						<label>商品图片2</label>
						<input type="file" size="30" name="upload_image2" id="team-create-image2" class="f-input" />
					</div>
					<div class="field">
						<label>FLV视频短片</label>
						<input type="text" size="30" name="flv" id="team-create-flv" class="f-input" />
						<span class="hint">形式如：http://.../video.flv</span>
					</div>
					<div class="field">
						<label>本单详情</label>
						<div style="float:left;"><textarea cols="45" rows="5" name="detail" id="team-create-detail" class="f-textarea editor"></textarea></div>
					</div>
					<div class="field" id="field_userreview">
						<label>网友点评</label>
						<div style="float:left;"><textarea cols="45" rows="5" name="userreview" id="team-create-userreview" class="f-textarea"><?php echo htmlspecialchars($team['userreview']); ?></textarea></div>
						<span class="hint">格式：“真好用|小兔|http://ww....|XXX网”，每行写一个点评</span>
					</div>
					<div class="field" id="field_systemreview">
						<label><?php echo $INI['system']['abbreviation']; ?>推广辞</label>
						<div style="float:left;"><textarea cols="45" rows="5" name="systemreview" id="team-create-systemreview" class="f-textarea editor"></textarea></div>
					</div>
					<div class="wholetip clear"><h3>3、配送信息</h3></div>
					<div class="field">
						<label>递送方式</label>
						<div style="margin-top:5px;" id="express-zone-div"><input type="radio" name="delivery" value="coupon" checked>&nbsp;<?php echo $INI['system']['couponname']; ?>&nbsp;<input type="radio" name="delivery" value='express' />&nbsp;快递&nbsp;<input type="radio" name="delivery" value="pickup"/>&nbsp;自取</div>
					</div>
					<div id="express-zone-coupon" style="display:<?php echo $team['delivery']=='coupon'?'block':'none'; ?>;">
						<div class="field">
							<label>消费返利</label>
							<input type="text" size="10" name="credit" id="team-create-credit" class="number" value="<?php echo moneyit($team['credit']); ?>" datatype="money" require="true" />
							<span class="inputtip">消费<?php echo $INI['system']['couponname']; ?>时，获得账户余额返利，单位CNY元</span>
						</div>
					</div>
					<div id="express-zone-pickup" style="display:<?php echo $team['delivery']=='pickup'?'block':'none'; ?>;">
						<div class="field">
							<label>联系电话</label>
							<input type="text" size="10" name="mobile" id="team-create-mobile" class="f-input" value="<?php echo $login_manager['mobile']; ?>" />
						</div>
						<div class="field">
							<label>自取地址</label>
							<input type="text" size="10" name="address" id="team-create-address" class="f-input" value="<?php echo $login_manager['address']; ?>" />
						</div>
					</div>
					<div id="express-zone-express" style="display:<?php echo $team['delivery']=='express'?'block':'none'; ?>;">
						<div class="field">
							<label>快递费用</label>
							<input type="text" size="10" name="fare" id="team-create-fare" class="number" value="<?php echo intval($team['fare']); ?>" maxLength="6" datatype="money" require="true" />
							<span class="inputtip">市内快递费用，原则上3-10元之间</span>
						</div>
						<div class="field">
							<label>快递配送说明</label>
							<div style="float:left;"><textarea cols="45" rows="5" name="express" id="team-create-express" class="f-textarea"><?php echo $team['express']; ?></textarea></div>
						</div>
					</div>
					<div class="field" id="field_audit">
						<label>是否审核通过</label>
						<input type="text" size="5" name="audit" id="team-audit" class="number" value="1" require="true" datatype="number" />
						<span class="inputtip">1审核通过 0未审核 2审核不通过</span>
					</div>
					<div class="act">
						<input type="submit" value="好了，提交" name="commit" id="leader-submit" class="formbutton"/>
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
