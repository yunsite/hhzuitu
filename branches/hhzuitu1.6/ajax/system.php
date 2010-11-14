<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

$action = strval($_GET['action']);
$id = strval($_GET['id']);
$sec = strval($_GET['secret']);

if ($action == 'needlogin') {
	$html = render('ajax_dialog_needlogin');
	json($html, 'dialog');
}
else if ($action == 'authorization') {
	need_auth('super');
	$user = Table::Fetch('user', $id);
	$html = render('manage_ajax_dialog_authorization');
	json($html, 'dialog');
}
else if('locale' == $action) {
	$v = cookieget('locale', 'zh_cn');
	cookieset('locale', ($v=='zh_cn' ? 'zh_tw' : 'zh_cn'));
	json(null, 'refresh');
}
