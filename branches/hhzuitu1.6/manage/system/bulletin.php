<?php
require_once(dirname(dirname(dirname(__FILE__))) . '/app.php');

need_manager();
need_auth('help');

$system = Table::Fetch('system', 1);

if ($_POST) {
	unset($_POST['commit']);
	$INI = Config::MergeINI($INI, $_POST);
	$INI = ZSystem::GetUnsetINI($INI);
	/* end */

	foreach($INI['bulletin'] AS $bid=>$bv) {
		$INI['bulletin'][$bid] = stripslashes($bv);
	}

	$value = Utility::ExtraEncode($INI);
	$table = new Table('system', array('value'=>$value));
	if ( $system ) $table->SetPK('id', 1);
	$flag = $table->update(array( 'value'));

	Session::Set('notice', '更新系统信息成功');
	Utility::Redirect( WEB_ROOT . '/manage/system/bulletin.php');	
}

include template('manage_system_bulletin');
