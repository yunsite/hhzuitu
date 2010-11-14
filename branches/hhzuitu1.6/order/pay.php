<?php
require_once(dirname(dirname(__FILE__)) . '/app.php');

need_login();

if (is_post()) {
	$order_id = abs(intval($_POST['order_id']));
} else {
	if ( $_GET['id'] == 'charge' ) {
		Utility::Redirect( WEB_ROOT. '/credit/index.php');
	}
	$order_id = $id = abs(intval($_GET['id']));
}
if(!$order_id || !($order = Table::Fetch('order', $order_id))) {
	Utility::Redirect( WEB_ROOT. '/index.php');
}
if ( $order['user_id'] != $login_user['id']) {
	Utility::Redirect( WEB_ROOT . "/team.php?id={$order['team_id']}");
}

$team = Table::Fetch('team', $order['team_id']);
team_state($team);

if (is_post()&&$_POST['paytype']) {
	$uarray = array( 'service' => strtolower($_POST['paytype']), );
	Table::UpdateCache('order', $order_id, $uarray);
	$order = Table::Fetch('order', $order_id);
	$order['service'] = strtolower($_POST['paytype']);
}

if ( $_POST['paytype']!='credit' 
		&& $_POST['service']!='credit' 
		&& $team['team_type']=='seconds' 
		&& ($order['origin']>$login_user['money'])
		&& option_yes('creditseconds')
   ) {
	$need_money = ceil($order['origin'] - $login_user['money']);
	Session::Set('error', "秒杀项目仅可以使用余额付款，您的余额不足，还需要充值{$need_money}元才可以完成秒杀");
	Utility::Redirect(WEB_ROOT . "/credit/charge.php?money={$need_money}");
}

//payed order
if ( $order['state'] == 'pay' ) {  
	if ( is_get() ) {
		$team = Table::Fetch('team', $order['team_id']);
		die(include template('order_pay_success'));		
	} else {
		Utility::Redirect(WEB_ROOT  . "/order/pay.php?id={$order_id}");
	}
}

$team = Table::Fetch('team', $order['team_id']);
$randno = rand(1000,9999);
$total_money = moneyit($order['origin'] - $login_user['money']);
if ($total_money<0) { $total_money = 0; $order['service'] = 'credit'; }

/* noneed pay where goods soldout or end */
team_state($team);
if ($team['close_time']) {
	Session::Set('notice', '本单产品团购已结束，现在不能进行付款');
	Utility::Redirect(WEB_ROOT  . "/team.php?id={$order['team_id']}");
}
/* end */

/* credit pay */
if ( $_POST['action'] == 'redirect' ) {
	Utility::Redirect($_POST['reqUrl']);
}
elseif ( $_POST['service'] == 'credit' ) {
	if ( $order['origin'] > $login_user['money'] ) {
		Table::Delete('order', $order_id);
		Utility::Redirect( WEB_ROOT . '/order/index.php');
	}
	Table::UpdateCache('order', $order_id, array(
				'service' => 'credit',
				'money' => 0,
				'state' => 'pay',
				'credit' => $order['origin'],
				'pay_time' => time(),
				));
	$order = Table::FetchForce('order', $order_id);
	ZTeam::BuyOne($order);
	Utility::Redirect( WEB_ROOT . "/order/pay.php?id={$order_id}");
}
elseif ( $order['service'] == 'chinabank' ) {
	/* credit pay */
	$credit = moneyit($order['origin'] - $total_money);
	if ($order['credit']!=$credit) {
		Table::UpdateCache('order', $order_id, array('credit'=>$credit,));
	}
	/* end */

	$v_mid = $INI['chinabank']['mid'];
	$v_url = $INI['system']['wwwprefix']. '/order/chinabank/return.php';
	$key   = $INI['chinabank']['sec'];
	$v_oid = "go-{$order['id']}-{$order['quantity']}-{$randno}";
	$v_amount = $total_money;
	$v_moneytype = $INI['system']['currencyname'];
	$text = $v_amount.$v_moneytype.$v_oid.$v_mid.$v_url.$key;
	$v_md5info = strtoupper(md5($text));

	include template('order_pay');
}
elseif ( $order['service'] == 'tenpay' ) {
	/* credit pay */
	$credit = moneyit($order['origin'] - $total_money);
	if ($order['credit']!=$credit) {
		Table::UpdateCache('order', $order_id, array('credit'=>$credit,));
	}
	/* end */

	$v_mid = $INI['tenpay']['mid'];
	$v_url = $INI['system']['wwwprefix']. '/order/tenpay/return.php';
	$key   = $INI['tenpay']['sec'];
	$v_oid = "go-{$order['id']}-{$order['quantity']}-{$randno}";
	$v_amount = intval($total_money * 100);
	$v_moneytype = $INI['system']['currencyname'];
	$text = $v_amount.$v_moneytype.$v_oid.$v_mid.$v_url.$key;

	/* must */
	$sp_billno = $v_oid;
	$transaction_id = $v_mid. date('Ymd'). date('His') .rand(1000,9999);
	$desc = $team['title'];
	/* end */

	$reqHandler = new PayRequestHandler();
	$reqHandler->init();
	$reqHandler->setKey($key);
	$reqHandler->setParameter("bargainor_id", $v_mid);
	$reqHandler->setParameter("cs", "UTF-8");
	$reqHandler->setParameter("sp_billno", $sp_billno);
	$reqHandler->setParameter("transaction_id", $transaction_id);
	$reqHandler->setParameter("total_fee", $v_amount);
	$reqHandler->setParameter("return_url", $v_url);
	$reqHandler->setParameter("desc", $desc);
	$reqHandler->setParameter("spbill_create_ip", Utility::GetRemoteIp());
	$reqUrl = $reqHandler->getRequestURL();

	include template('order_pay');
}
elseif ( $order['service'] == 'bill' ) {
	/* credit pay */
	$credit = moneyit($order['origin'] - $total_money);
	if ($order['credit'] != $credit) {
		Table::UpdateCache('order', $order_id, array('credit'=>$credit,));
	}
	/* end */   

	//人民币网关账户号
	///请登录快钱系统获取用户编号，用户编号后加01即为人民币网关账户号。
	$merchantAcctId = $INI['bill']['mid'];	

	//人民币网关密钥
	///区分大小写.请与快钱联系索取
	$key = $INI['bill']['sec']; 

	//字符集.固定选择值。可为空。
	///只能选择1、2、3.
	///1代表UTF-8; 2代表GBK; 3代表gb2312
	///默认值为1
	$inputCharset = "1";

	//接受支付结果的页面地址.与[bgUrl]不能同时为空。必须是绝对地址。
	///如果[bgUrl]为空，快钱将支付结果Post到[pageUrl]对应的地址。
	///如果[bgUrl]不为空，并且[bgUrl]页面指定的<redirecturl>地址不为空，则转向到<redirecturl>对应的地址
	$pageUrl = $INI['system']['wwwprefix'] . '/order/bill/return.php';

	//服务器接受支付结果的后台地址.与[pageUrl]不能同时为空。必须是绝对地址。
	///快钱通过服务器连接的方式将交易结果发送到[bgUrl]对应的页面地址，在商户处理完成后输出的<result>如果为1，页面会转向到<redirecturl>对应的地址。
	///如果快钱未接收到<redirecturl>对应的地址，快钱将把支付结果post到[pageUrl]对应的页面。
	$bgUrl = $INI['system']['wwwprefix'] . '/order/bill/return.php';

	//网关版本.固定值
	///快钱会根据版本号来调用对应的接口处理程序。
	///本代码版本号固定为v2.0
	$version = "v2.0";

	//语言种类.固定选择值。
	///只能选择1、2、3
	///1代表中文；2代表英文
	///默认值为1
	$language = "1";

	//签名类型.固定值
	///1代表MD5签名
	///当前版本固定为1
	$signType = "1";	

	//支付人姓名
	///可为中文或英文字符
	$payerName = $login_user['username'];

	//支付人联系方式类型.固定选择值
	///只能选择1
	///1代表Email
	$payerContactType = "1";	

	//支付人联系方式
	///只能选择Email或手机号
	$payerContact = $login_user['email'];	

	//商户订单号
	///由字母、数字、或[-][_]组成
	$orderId = "go-{$order['id']}-{$order['quantity']}-{$randno}";		

	//订单金额
	///以分为单位，必须是整型数字
	///比方2，代表0.02元
	$orderAmount = intval($total_money * 100);

	//订单提交时间
	///14位数字。年[4位]月[2位]日[2位]时[2位]分[2位]秒[2位]
	///如；20080101010101
	$orderTime = date('YmdHis');

	//商品名称
	///可为中文或英文字符
	$productName = preg_replace('/[\r\n\s]+/','',strip_tags($team['title']));

	//商品数量
	///可为空，非空时必须为数字
	$productNum="1";

	//商品代码
	///可为字符或者数字
	$productId="";

	//商品描述
	$productDesc="";

	//扩展字段1
	///在支付结束后原样返回给商户
	$ext1="";

	//扩展字段2
	///在支付结束后原样返回给商户
	$ext2="";

	//支付方式.固定选择值
	///只能选择00、10、11、12、13、14
	///00：组合支付（网关支付页面显示快钱支持的各种支付方式，推荐使用）10：银行卡支付（网关支付页面只显示银行卡支付）.11：电话银行支付（网关支付页面只显示电话支付）.12：快钱账户支付（网关支付页面只显示快钱账户支付）.13：线下支付（网关支付页面只显示线下支付方式）.14：B2B支付（网关支付页面只显示B2B支付，但需要向快钱申请开通才能使用）
	$payType="00";

	//银行代码
	///实现直接跳转到银行页面去支付,只在payType=10时才需设置参数
	///具体代码参见 接口文档银行代码列表
	$bankId="";

	//同一订单禁止重复提交标志
	///固定选择值： 1、0
	///1代表同一订单号只允许提交1次；0表示同一订单号在没有支付成功的前提下可重复提交多次。默认为0建议实物购物车结算类商户采用0；虚拟产品类商户采用1
	$redoFlag="0";

	//快钱的合作伙伴的账户号
	///如未和快钱签订代理合作协议，不需要填写本参数
	$pid=""; ///合作伙伴在快钱的用户编号



	//生成加密签名串
	///请务必按照如下顺序和规则组成加密串！
	$signMsgVal=appendParam($signMsgVal,"inputCharset",$inputCharset);
	$signMsgVal=appendParam($signMsgVal,"pageUrl",$pageUrl);
	$signMsgVal=appendParam($signMsgVal,"bgUrl",$bgUrl);
	$signMsgVal=appendParam($signMsgVal,"version",$version);
	$signMsgVal=appendParam($signMsgVal,"language",$language);
	$signMsgVal=appendParam($signMsgVal,"signType",$signType);
	$signMsgVal=appendParam($signMsgVal,"merchantAcctId",$merchantAcctId);
	$signMsgVal=appendParam($signMsgVal,"payerName",$payerName);
	$signMsgVal=appendParam($signMsgVal,"payerContactType",$payerContactType);
	$signMsgVal=appendParam($signMsgVal,"payerContact",$payerContact);
	$signMsgVal=appendParam($signMsgVal,"orderId",$orderId);
	$signMsgVal=appendParam($signMsgVal,"orderAmount",$orderAmount);
	$signMsgVal=appendParam($signMsgVal,"orderTime",$orderTime);
	$signMsgVal=appendParam($signMsgVal,"productName",$productName);
	$signMsgVal=appendParam($signMsgVal,"productNum",$productNum);
	$signMsgVal=appendParam($signMsgVal,"productId",$productId);
	$signMsgVal=appendParam($signMsgVal,"productDesc",$productDesc);
	$signMsgVal=appendParam($signMsgVal,"ext1",$ext1);
	$signMsgVal=appendParam($signMsgVal,"ext2",$ext2);
	$signMsgVal=appendParam($signMsgVal,"payType",$payType);	
	$signMsgVal=appendParam($signMsgVal,"bankId",$bankId);
	$signMsgVal=appendParam($signMsgVal,"redoFlag",$redoFlag);
	$signMsgVal=appendParam($signMsgVal,"pid",$pid);
	$signMsgVal=appendParam($signMsgVal,"key",$key);
	$signMsg= strtoupper(md5($signMsgVal));



	include template('order_pay');
}
/* paypal support */
else if ( $_POST['paytype'] == 'paypal' ) {
	/* credit pay */
	$credit = moneyit($order['origin'] - $total_money);
	if ($order['credit']!=$credit) {
		Table::UpdateCache('order', $order_id, array('credit'=>$credit,));
	}
	/* end */
	
	$cmd = '_xclick';
	$business = $INI['paypal']['mid'];
	$signature = $INI['paypal']['sec'];
	
	$item_number = "go-{$order['id']}-{$order['quantity']}-{$randno}";
	$item_name = $team['title'];
	$amount = $total_money;
	$quantity = 1;

	//$post_url = "https://www.sandbox.paypal.com/cgi-bin/webscr";
	$post_url = "https://www.paypal.com/row/cgi-bin/webscr";
	$image_url = "";
	$return_url = $INI['system']['wwwprefix'] . '/order/index.php';
	$notify_url = $INI['system']['wwwprefix'] . '/order/paypal/ipn.php';
	$cancel_url = $INI['system']['wwwprefix'] . "/order/index.php";

	include template('order_pay');
}
/* alipay support */
else if ( $order['service'] == 'alipay' ) {

	/* credit pay */
	$credit = moneyit($order['origin'] - $total_money);
	if ($order['credit']!=$credit) {
		Table::UpdateCache('order', $order_id, array('credit'=>$credit,));
	}
	/* end */

	$_input_charset = 'utf-8';
	$service = 'create_direct_pay_by_user';
	$partner = $INI['alipay']['mid'];
	$security_code = $INI['alipay']['sec'];
	$seller_email = $INI['alipay']['acc'];

	$sign_type = 'MD5';
	$out_trade_no = "go-{$order['id']}-{$order['quantity']}-{$randno}";

	$return_url = $INI['system']['wwwprefix'] . '/order/alipay/return.php';
	$notify_url = $INI['system']['wwwprefix'] . '/order/alipay/notify.php';
	$show_url =   $INI['system']['wwwprefix'] . "/team.php?id={$team['id']}";

	$subject = preg_replace('/[\r\n\s]+/','',strip_tags($team['title']));
	$body = $show_url;
	$quantity = $order['quantity'];

	$parameter = array(
			"service"         => $service,
			"partner"         => $partner,      
			"return_url"      => $return_url,  
			"notify_url"      => $notify_url, 
			"_input_charset"  => $_input_charset, 
			"subject"         => $subject,  	 
			"body"            => $body,     	
			"out_trade_no"    => $out_trade_no,
			"total_fee"       => $total_money,  
			"payment_type"    => "1",
			"show_url"        => $show_url,
			"seller_email"    => $seller_email,  
			);
	$alipay = new AlipayService($parameter, $security_code, $sign_type);
	$sign = $alipay->Get_Sign();
	include template('order_pay');
}
else if ( $order['service'] == 'credit' ) {
	$total_money = $order['origin'];
	die(include template('order_pay'));
} 
else {
	Session::Set('error', '无合适的支付方式或余额不足');
	Utility::Redirect( WEB_ROOT. "/team.php?id={$order_id}");
}


//功能函数。将变量值不为空的参数组成字符串
Function appendParam($returnStr,$paramId,$paramValue){
	if($returnStr!=""){			
		if($paramValue!=""){					
			$returnStr.="&".$paramId."=".$paramValue;
		}			
	}else{		
		If($paramValue!=""){
			$returnStr=$paramId."=".$paramValue;
		}
	}		
	return $returnStr;
}
//功能函数。将变量值不为空的参数组成字符串。结束
