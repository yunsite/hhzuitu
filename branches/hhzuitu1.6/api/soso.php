<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');
header('Content-Type: application/xml; charset=UTF-8');

$daytime = strtotime(date('Y-m-d'));
$condition = array( 
		'team_type' => 'normal',
		"begin_time <= {$daytime}",
		"end_time > {$daytime}",
		);
$teams = DB::LimitQuery('team', array(
			'condition' => $condition,
			));

$oa = array();
$si = array(
		'sitename' => $INI['system']['sitename'],
		'wwwprefix' => $INI['system']['wwwprefix'],
		'imgprefix' => $INI['system']['imgprefix'],
		);

$tuangala['provider'] = $si['sitename'];
$tuangala['version'] = '1.1';
$tuangala['dataServiceId'] = '1_1_1';
$tuangala['updatemethod'] = 'all';

foreach($teams AS $one) {
	$city = Table::Fetch('category', $one['city_id']);
	$group = Table::Fetch('category', $one['group_id']);
	$shops = Table::Fetch('partner', $one['partner_id']);
	$item = array();

	$o = array();

	$o['keyword'] = '美食,娱乐,邮购,生活,健身运动,日常服务,美容,美发,票务,购物券卡,大件团购,其它';
	$o['url'] = $si['wwwprefix'] . "/team.php?id={$one['id']}";
	$o['creator'] = $si['wwwprefix'];
	$o['title'] =  $one['title'];
	$o['publishdate'] =  $one['begin_time'];
	$o['imageaddress1'] = $si['imgprefix']  .'/static/' . $one['image'];
	$o['imagealt1'] = $one['title'];
	$o['imagelink1'] = $si['wwwprefix'] . "/team.php?id={$one['id']}";
	$o['content1'] = Utility::csubstr($one['title'], 0, 9);
	$o['content2'] = '<![CDATA[' + $one['summary'] + ']]>';
	$o['content3'] = $one['market_price'];
	$o['content4'] = $one['team_price'];
	if ( $one['market_price'] > 0 ) {
		$o['content5'] = moneyit(10*$one['team_price']/$one['market_price']);
	} else {
		$o['content5'] = '0';
	}
	$o['content6'] = '';
	($o['content7'] = $city['name']) || ($o['city'] = '全国');
	$o['content8'] = abs(intval($one['now_number']));
	$o['content9'] = $shops['title'];
	if ( $one['state'] == 'none' ) {
		$o['content10'] = '进行';
	} elseif ( $one['state'] == 'soldout' ) {
		$o['content10'] = '完成';
	} else {
		$o['content10'] = '完成';
	}
	$o['content11'] = '<![CDATA[' + $one['notice'] + ']]>';
	$o['content12'] = abs(intval($one['min_number']));
	$o['content13'] = $shops['address'];
	$o['content14'] = $shops['phone'];
	$o['content15'] = $one['begin_time'];
	$o['content16'] = $one['end_time'];

	$item = $o;

	$oa[] = $item;
}
$tuangala['datalist'] = $oa;

Output::XmlSoSo($tuangala);
