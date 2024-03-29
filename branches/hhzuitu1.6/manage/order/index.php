<?php
require_once(dirname(dirname(dirname(__FILE__))) . '/app.php');

need_manager();
need_auth('order');

$t_con = array(
	'begin_time < '.time(),
	'end_time > '.time(),
);
$teams = DB::LimitQuery('team', array('condition'=>$t_con));
$t_id = Utility::GetColumn($teams, 'id');

$condition = array(
	'team_id' => $t_id,
	'team_id > 0',
);
/* filter */
$uemail = strval($_GET['uemail']);
if ($uemail) {
	$uuser = Table::Fetch('user', $uemail, 'email');
	if($uuser) $condition['user_id'] = $uuser['id'];
	else $uemail = null;
}
$team_id = abs(intval($_GET['team_id']));
if ($team_id && in_array($team_id, $t_id)) {
	$condition['team_id'] = $team_id;
} else { $team_id = null; }
/* end fiter */

$count = Table::Count('order', $condition);
list($pagesize, $offset, $pagestring) = pagestring($count, 20);

$orders = DB::LimitQuery('order', array(
	'condition' => $condition,
	'order' => 'ORDER BY id DESC',
	'size' => $pagesize,
	'offset' => $offset,
));

$pay_ids = Utility::GetColumn($orders, 'pay_id');
$pays = Table::Fetch('pay', $pay_ids);

$user_ids = Utility::GetColumn($orders, 'user_id');
$users = Table::Fetch('user', $user_ids);

$team_ids = Utility::GetColumn($orders, 'team_id');
$teams = Table::Fetch('team', $team_ids);

include template('manage_order_index');
