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

foreach($teams AS $one) {
	$city = Table::Fetch('category', $one['city_id']);
	$group = Table::Fetch('category', $one['group_id']);
	$shops = Table::Fetch('partner', $one['partner_id']);
	$item = array();
	$item['loc'] = $si['wwwprefix'] . "/team.php?id={$one['id']}";
	$item['data'] = array();
	$item['data']['display'] = array();
	$item['data']['shops'] = array();

	$o = array();
	$o['website'] = $INI['system']['sitename'];
	$o['siteurl'] = $INI['system']['wwwprefix'];
	($o['city'] = $city['name']) || ($o['city'] = '全国');
	$o['title'] = $one['title'];
	$o['image'] = $si['imgprefix']  .'/static/' . $one['image'];
	$o['tag'] = '美食,娱乐,邮购,生活,健身运动,日常服务,美容,美发,票务,购物券卡,其它';
	$o['startTime'] = $one['begin_time'];
	$o['endTime'] = $one['end_time'];
	$o['value'] = $one['market_price'];
	$o['price'] = $one['team_price'];
	if ( $one['market_price'] > 0 ) {
		$o['rebate'] = moneyit(10*$one['team_price']/$one['market_price']);
	} else {
		$o['rebate'] = '0';
	}
	$o['bought'] = abs(intval($one['now_number']));
	$o['maxQuota'] = abs(intval($one['max_number']));
	$o['minQuota'] = abs(intval($one['min_number']));
	if (abs(intval($one['now_number'])) == abs(intval($one['max_number']))) {
		$o['soldOut'] = 'yes';
	}
	$o['tip'] = '<![CDATA[' + $one['notice'] + ']]>';
	$o['detail'] = '<![CDATA[' + $one['summary'] + ']]>';
	$item['data']['display'] = $o;

	$sh['shop'] = array();
	$sh1['name'] = $shops['title'];
	$sh1['tel'] = $shops['phone'];
	$sh1['addr'] = $shops['address'];
	$area = Table::Fetch('category', $shops['city_id']);
	($sh1['area'] = $area['name']) || ($sh1['area'] = '全国');
	$sh1['addr'] = $shops['address'];
	$sh['shop'] = $sh1;
	$item['data']['shops'] = $sh;

	$oa[] = $item;
}

Output::XmlBaidu($oa);
