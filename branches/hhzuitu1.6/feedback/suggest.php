<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

if ($_POST) {
	if (!$_POST['content'] || !$_POST['title'] || !$_POST['contact']) {
		Session::Set('error', '请完成表单后再提交');
		Utility::Redirect( WEB_ROOT . '/feedback/seller.php');
	}
	$table = new Table('feedback', $_POST);
	$table->city_id = abs(intval($city['id']));
	$table->create_time = time();
	$table->category = 'suggest';
	$table->title = htmlspecialchars($table->title);
	$table->content = htmlspecialchars($table->content);
	$table->contact = htmlspecialchars($table->contact);
	$table->Insert(array(
		'city_id', 'title', 'contact', 'content', 'create_time',
		'category',
	));
	Utility::Redirect( WEB_ROOT . '/feedback/success.php');
}

$pagetitle = '意见反馈';
include template("feedback_suggest");
