$(document).ready(function() {

	// 单独设置cookie  避免覆盖
	$.cookie('feedUser', $.cookie('loginCookie'), {expires: 1/24} );
	// 将cookie存储的内容放在表单里
	$('#feedUser').attr('value', $.cookie('feedUser'));
	$('#feedEmail').attr('value', $.cookie('feedUser'));
	
	var requestParam = getRequestParam();
	$('#feedBtn').click( function() {
			if( chkEmail($('#feedEmail').attr('value')) == true){
				var email = $('#feedEmail').attr('value');
				var content = $('#feedContent').val();
				if( content.length > 5 ){
					requestParam.email = email;
					requestParam.content = content;

					$.cookie('content', content, {expires: 1/24});

					$.post( requestUrl, requestParam, function(data, status){
						if( status == 'success'){
							$('#forLoading').css('display','block');
							$('#forLoading > h2')[0].innerText = '您的反馈已经发出，我们会尽快恢复。谢谢您的支持！';
							$('#forLoading > p')[0].innerText = '我们将您的用户信息保存1个小时，您可以继续写下您的意见和建议';
						}else{

							$('#feedContent').attr('value', $.cookie('content'));
							$('#forLoading').css('displasy','block');
							$('#forLoading > h2')[0].innerText='Ooops~  出错了···  ';
							$('#forLoading > p').text = ('不过您的反馈已经被保存，请在页面刷新后再试 ');
						}
						setTimeout(function(){
							$('#forLoading').css('display','none');
							location.replace( location.href );
						}, 3500);
					} );
					
				}else{
					alert("反馈内容不足5个字符！");
					return;
				}	
			}else{
				alert("Email格式不正确！");
				return;
			}
			
		});
	

});


var getUrlParams = getUrlParams();
// var requestUrl = 'openapi.wiz.cn/feedback';
var requestUrl = 'http://192.168.1.146/api/mail';
//  url


var clientType = getUrlParams.clienttype;
// clientType="web";
var version = getUrlParams.version;
// version = '2.0';
var user_id = '';
var userAgent = navigator.userAgent;



function getRequestParam(){
	var param = {};
	param = {
		clientType: clientType,
		version: version,
		// user_id: user_id,
		// email: email,
		// content: content,
		userAgent: userAgent,
	}
	return param;
}


function getUrlParams(){ 
	var url = location.href; 
	var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
	var params = {};
	for (var i=0; j=paraString[i]; i++){ 
		params[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
	} 
	return params;
}

function chkEmail(wiz_email) {
		if(wiz_email=="" || typeof wiz_email == 'undefined') {
			return false;
		}
		
		else{
		return true;
	}
}