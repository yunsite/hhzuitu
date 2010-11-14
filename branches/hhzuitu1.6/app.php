<?php
require_once(dirname(__FILE__). '/include/application.php');
/* magic_quota_gpc */
$_GET = magic_gpc($_GET);
$_POST = magic_gpc($_POST);
$_COOKIE = magic_gpc($_COOKIE);

/* process currefer*/
$currefer = uencode(strval($_SERVER['REQUEST_URI']));

/* session,cache,configure,webroot register */
Session::Init();
$INI = ZSystem::GetINI();
$AJAX = ('XMLHttpRequest' == @$_SERVER['HTTP_X_REQUESTED_WITH']);
if (false==$AJAX) { 
    header('Content-Type: text/html; charset=UTF-8'); 
} else {
    header("Cache-Control: no-store, no-cache, must-revalidate");
}
/* end */

/* biz logic */
$currency = $INI['system']['currency'];
$login_user_id = ZLogin::GetLoginId();
$login_user = Table::Fetch('user', $login_user_id);
//$login_partner = ZPartner::GetLoginPartner();
$partner_id = abs(intval($_SESSION['partner_id']));
$login_partner = Table::Fetch('partner', $partner_id);

$city = cookie_city(null);
$hotcities = Table::Fetch('category', $INI['hotcity']);

/* not allow access app.php */
if($_SERVER['SCRIPT_FILENAME']==__FILE__){
	Utility::Redirect( WEB_ROOT . '/index.php');
}
/* end */
