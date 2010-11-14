<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

need_partner();

$id = abs(intval($_GET['id']));
$condition = array(
	'partner_id' => $partner_id,
	'id' => $id,
);
$count = Table::Count('team', $condition);
if ($count == 0) {
	Session::Set('error', '无权操作');
	redirect( WEB_ROOT . '/biz/index.php');
}
$team = Table::Fetch('team', $id);
if ($_POST) {
	$insert = array(
		'title', 'market_price', 'team_price', 'end_time', 'begin_time', 'expire_time', 'min_number', 'max_number', 'summary', 'notice', 'per_number',
		'product', 'image',  'detail', 'userreview', 'systemreview', 'image1', 'image2', 'flv', 'card', 'conduser', 'buyonce', 'bonus',
		'delivery', 'mobile', 'address', 'fare', 'express', 'credit',
		'user_id', 'city_id', 'group_id', 'partner_id',
		'team_type', 
		);
	$table = new Table('team', $_POST);
	$table->SetStrip('detail', 'systemreview', 'notice');
	$table->begin_time = strtotime($_POST['begin_time']);
	$table->city_id = abs(intval($table->city_id));
	$table->partner_id = abs(intval($partner_id));
	$table->end_time = strtotime($_POST['end_time']);
	$table->expire_time = strtotime($_POST['expire_time']);
	$table->image = upload_image('upload_image', $team['image'], 'team', true);
	$table->image1 = upload_image('upload_image1',$team['image1'],'team');
	$table->image2 = upload_image('upload_image2',$team['image2'],'team');

	//team_type == goods
	if($table->team_type=='goods'){$table->min_number = 1;}

	$error_tip = array();
	if ( !$error_tip)  {
		if ( $table->update($insert) ) {
			print($table->title);
			$field = strtoupper($table->conduser)=='Y' ? null : 'quantity';
			$now_number = Table::Count('order', array(
						'team_id' => $table->id,
						'state' => 'pay',
						), $field);

			$need_update = array( 'now_number' => $now_number,);
			/* 增加了总数，未卖完状态 */
			if ( $table->max_number > $table->now_number ) {
				$need_update['close_time'] = 0;
			}
			Table::UpdateCache('team', $table->id, $need_update);

			Session::Set('notice', '团购修改成功');
			Utility::Redirect( WEB_ROOT. "/biz/index.php");
		} else {
			Session::Set('error', '修改团信息失败，请检查系统环境？');
		}
	}
}

$groups = DB::LimitQuery('category', array(
			'condition' => array( 'zone' => 'group', ),
			));
$groups = Utility::OptionArray($groups, 'id', 'name');

$partners = DB::LimitQuery('partner', array(
			'order' => 'ORDER BY id DESC',
			));
$partners = Utility::OptionArray($partners, 'id', 'title');

include template('biz_coupon_edit');