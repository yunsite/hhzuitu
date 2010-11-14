<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

$id = abs(intval($_GET['id']));
$order = Table::Fetch('order', $id);
if (!$order) { 
	Session::Set('error', '订单不存在');
	Utility::Redirect( WEB_ROOT . '/index.php' );
}
if ( $order['user_id'] != $login_user['id']) {
	Utility::Redirect( WEB_ROOT . "/team.php?id={$order['team_id']}");
}
$team = Table::Fetch('team', $order['team_id']);
$team['state'] = team_state($team);

if ( $team['close_time'] ) {
	Utility::Redirect( WEB_ROOT . "/team.php?id={$id}");
}

if ( $order['state'] == 'unpay' ) {
	if($INI['alipay']['mid'] && $order['service']=='alipay') {
		$ordercheck['alipay'] = 'checked';
	}
	else if($INI['chinabank']['mid'] && $order['service']=='chinabank') {
		$ordercheck['chinabank'] = 'checked';
	}
	else if($INI['tenpay']['mid'] && $order['service']=='tenpay') {
		$ordercheck['tenpay'] = 'checked';
	}
	else if($INI['bill']['mid'] && $order['service']=='bill') {
		$ordercheck['bill'] = 'checked';
	}
	else if($INI['paypal']['acc'] && $order['service']=='paypal') {
		$ordercheck['paypal'] = 'checked';
	}

	else if($INI['alipay']['mid']) {
		$ordercheck['alipay'] = 'checked';
	}
	else if($INI['tenpay']['mid']) {
		$ordercheck['tenpay'] = 'checked';
	}
	else if($INI['chinabank']['mid']) {
		$ordercheck['chinabank'] = 'checked';
	}
	else if($INI['bill']['mid']) {
		$ordercheck['bill'] = 'checked';
	}
	else if($INI['paypal']['acc']) {
		$ordercheck['paypal'] = 'checked';
	}

	$credityes = ($login_user['money'] >= $order['origin']);
	$creditonly = ($team['team_type'] == 'seconds' && option_yes('creditseconds'));

	die(include template('order_check'));
}

Utility::Redirect( WEB_ROOT . "/order/view.php?id={$id}");
