<?php
require_once(dirname(dirname(dirname(__FILE__))) . '/app.php');

need_manager();
$daytime = strtotime(date('Y-m-d'));
$condition = array(
	'consume' => 'N',
	'expire_time >= ' . $daytime,
);
/* fiter */
$tid = strval($_GET['tid']);
$coupon = strval($_GET['coupon']);
if ($tid) { $condition['team_id'] = $tid; } else { $tid = null; }
if ($coupon) {
	$condition[] = "id like '%".mysql_escape_string($coupon)."%'";
}
/* end */

$count = Table::Count('coupon', $condition);
list($pagesize, $offset, $pagestring) = pagestring($count, 20);

$coupons = DB::LimitQuery('coupon', array(
	'condition' => $condition,
	'order' => 'ORDER BY team_id DESC, id ASC',
	'size' => $pagesize,
	'offset' => $offset,
));

$users = Table::Fetch('user', Utility::GetColumn($coupons, 'user_id'));
$teams = Table::Fetch('team', Utility::GetColumn($coupons, 'team_id'));
$selector = 'index';
include template('manage_coupon_index');
