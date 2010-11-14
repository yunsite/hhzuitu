<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

if ( $_POST ) {
	$table = new Table('partner', $_POST);
	$table->SetStrip('location', 'other');
	$table->create_time = time();
	$table->user_id = 1;
	$passwo = $table->password;
	$table->password = ZPartner::GenPassword($passwo);
	$table->group_id = abs(intval($table->group_id));
	$table->city_id = abs(intval($table->city_id));
	$table->open = 'N';
	$table->image = upload_image('upload_image', null, 'team', true);
	$table->image1 = upload_image('upload_image1', null, 'team');
	$table->image2 = upload_image('upload_image2', null, 'team');
	
	$table->insert(array(
		'username', 'user_id', 'city_id', 'title', 'group_id',
		'bank_name', 'bank_user', 'bank_no', 'create_time',
		'location', 'other', 'homepage', 'contact', 'mobile', 'phone',
		'password', 'address', 'open',
		'image', 'image1', 'image2',
	));
	$login_partner = ZPartner::GetLogin($table->username, $passwo);
	if ( $login_partner ) {
		Session::Set('partner_id', $login_partner['id']);
		Utility::Redirect( WEB_ROOT . '/biz/index.php');
	}
}

$pagetitle = '商户注册';
include template('partner_create');
