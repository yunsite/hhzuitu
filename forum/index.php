<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

need_login();
need_auth(option_yes('navforum'));

$condition = array(
		'OR' => array(
			'public_id > 0',
			'city_id' => $city['id'],
			),
		'length(title) > 0',
		'parent_id' => 0,
		);
$count = Table::Count('topic', $condition);
list($pagesize, $offset, $pagestring) = pagestring($count, 20);
$topics = DB::LimitQuery('topic', array(
			'condition' => $condition,
			'size' => $pagesize,
			'offset' => $offset,
			'order' => 'ORDER BY head DESC, last_time DESC',
			));
$user_ids = Utility::GetColumn($topics, 'user_id');
$users = Table::Fetch('user', $user_ids);
$pagetitle = '讨论区';
include template('forum_index');
