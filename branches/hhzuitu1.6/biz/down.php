<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

need_partner();
$id = abs(intval($_GET['id']));

$partner_id = abs(intval($_SESSION['partner_id']));
$login_partner = Table::Fetch('partner', $partner_id);

$team = Table::Fetch('team', $id);
if($team['partner_id'] != $partner_id) {
	Session::Set('error', '无权访问数据');
	Utility::Redirect( WEB_ROOT  . '/biz/index.php');
}

if ( $team['delivery']=='express' ) {
	$oc = array(
			'state' => 'pay',
			'team_id' => $id,
			);
	$orders = DB::LimitQuery('order', array('condition'=>$oc));
	$users = Table::Fetch('user', Utility::GetColumn($orders, 'user_id'));
	$kn = array(
		'id' => '订单号',
		'username' => '用户名',
		'email' => '邮件地址',
		'quantity' => '数量',
		'realname' => '姓名',
		'mobile' => '电话',
		'address' => '地址',
		'remark' => '备注',
	);
	foreach($orders AS $k=>$one) {
		$one['username'] = $users[$one['user_id']]['username'];
		$one['email'] = $users[$one['user_id']]['email'];
		$orders[$k] = $one;
	}
	$name = "teamorder_{$id}";
	down_xls($orders, $kn, $name);
}
else {
	$cc = array(
		'team_id' => $id,
		);
	$coupons = DB::LimitQuery('coupon', array('condition'=>$cc));
	$users = Table::Fetch('user', Utility::GetColumn($coupons, 'user_id'));

	$kn = array(
		'order_id' => '订单号',
		'username' => '用户名',
		'email' => '用户Email',
		'mobile' => '手机号码',
		'id' => $INI['system']['couponname']."编号",
	);
	if ( abs(intval($INI['system']['partnerdown']))) {
		$kn['secret'] = '消费密码';
	}
	foreach($coupons As $kid=>$o) {
		$u = $users[$o['user_id']];
		$o['username']  = $u['username'];
		$o['email'] = $u['email'];
		$o['mobile'] = $u['mobile'];
		$coupons[$kid] = $o;
	}

	$name = "teamcoupon_{$id}";
	down_xls($coupons, $kn, $name);
}
