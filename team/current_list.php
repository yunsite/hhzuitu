<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

$daytime = strtotime(date('Y-m-d'));
$condition = array(
	'team_type' => 'normal',
	'city_id' => array(0, abs(intval($city['id']))),
	"begin_time <= '{$daytime}'",
	"end_time > '{$daytime}'",
	"audit" => 1, //所有已审核的团购
);

if (!option_yes('displayfailure')) {
	$condition['OR'] = array(
		"now_number >= min_number",
		"end_time > '{$daytime}'",
	);
}

$group_id = abs(intval($_GET['gid']));
if ($group_id) $condition['group_id'] = $group_id;

$count = Table::Count('team', $condition);
list($pagesize, $offset, $pagestring) = pagestring($count, 10);
$teams = DB::LimitQuery('team', array(
	'condition' => $condition,
	'order' => 'ORDER BY begin_time DESC, sort_order DESC, id DESC',
	'size' => $pagesize,
	'offset' => $offset,
));
foreach($teams AS $id=>$one){
	team_state($one);
	if (!$one['close_time']) $one['picclass'] = 'isopen';
	if ($one['state']=='soldout') $one['picclass'] = 'soldout';
	$partner = Table::Fetch('partner', $one['partner_id']);
	$one['authenticate'] = $partner['authenticate'];
	$teams[$id] = $one;
}

$category = Table::Fetch('category', $group_id);
$pagetitle = '进行中的团购列表';
include template('team_index');

function current_teamcategory($gid='0') {
	global $city;
	$a = array(
			'/team/current_list.php' => '所有',
			);
	foreach(option_category('group') AS $id=>$name) {
		$a["/team/current_list.php?gid={$id}"] = $name;
	}
	$l = "/team/current_list.php?gid={$gid}";
	if (!$gid) $l = "/team/current_list.php";
	return current_link($l, $a, true);
}
