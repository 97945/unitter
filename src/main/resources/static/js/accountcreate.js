
  var headerName = $("meta[name='_csrf_header']").attr("content");
  var tokenValue = $("meta[name='_csrf']").attr("content");
  $(document).ajaxSend(function(e, xhr, options){
  xhr.setRequestHeader(headerName, tokenValue);
  });


//  アカウント作成
$(document).on('click', '#account', function(){

	onUserId();

    // Ajax通信テスト ボタンクリック
    var data = {userId : userID.value, nickname : nickname.value, mailAddress : mail.value, password : pass1.value};

        $.ajax({
            type        : "POST",
            url         : "http://localhost:8080/account/create",
            data        : JSON.stringify(data),
            minTimeout  : 1000,
            multiplier  : 1,
            contentType : 'application/JSON',
            success     : function(data) {
	                        success(data);
                          },
            error       : function(XMLHttpRequest, textStatus, errorThrown) {
                            error(XMLHttpRequest, textStatus, errorThrown);
                          }
        });
});

// Ajax通信成功時処理
function success(data) {
	console.log("success");  
    target1 = document.getElementById("username");
    target1.value = data.userId;
    target2 = document.getElementById("password");
    target2.value = data.password;
	document.forms.login.submit();
}
 
// Ajax通信失敗時処理
function error(XMLHttpRequest, textStatus, errorThrown) {
	console.log("error:" + XMLHttpRequest);
	console.log("status:" + textStatus);
	console.log("errorThrown:" + errorThrown);
	target1 = document.getElementById("output1");
	target11 = document.getElementById("output11");
	target2 = document.getElementById("output2");
	target22 = document.getElementById("output22");
	target3 = document.getElementById("output3");
	target33 = document.getElementById("output33");
	target4 = document.getElementById("output4");
	target44 = document.getElementById("output44");
	target1.innerText = " ";
	target2.innerText = "OK";
	target3.innerText = "OK";
	target4.innerText = "OK";
	target11.innerText = "";
	target22.innerText = "";
	target33.innerText = "";
	target44.innerText = "";

	var res = $.parseJSON(XMLHttpRequest.responseText);
	for(var i=0; i<res.details.length; i++){
		if(res.details[i].target =="userId"){
			target1.innerText = "";
			target11.innerText = res.details[i].message;
		}else if(res.details[i].target =="nickname"){
			target2.innerText = "";
			target22.innerText = res.details[i].message;
		}else if(res.details[i].target =="mailAddress"){
			target3.innerText = "";
			target33.innerText = res.details[i].message;
		}else if(res.details[i].target =="password"){
			target4.innerText = "";
			target44.innerText = res.details[i].message;
		}
	}
	onUserId();
}


//  ユーザー名チェック
function onUserId() {
	    // Ajax通信テスト ボタンクリック
	if(userID.value.length != 0){

	    var data = {userId : userID.value};
	        $.ajax({
	            type        : "GET",
	            url         : "http://localhost:8080/account/create/"+ userID.value,
	            data        : JSON.stringify(data),
	            minTimeout  : 1000,
	            multiplier  : 1,
	            contentType : 'application/JSON',
	            success     : function(data) {
		                        success2();
	                          },
	            error       : function(XMLHttpRequest, textStatus, errorThrown) {
	                            error2(XMLHttpRequest, textStatus, errorThrown);
	                          }
	        });
	}else{
	      target1.innerText = "";
	      target11.innerText = "5文字以上15文字以下の入力をしてください";
	}
	}

//Ajax通信成功時処理
function success2(data) {
	console.log("success");
	target11 = document.getElementById("output11");
    target1 = document.getElementById("output1");

	var msg = "OK";
    if(4 >= userID.value.length ){
      msg = "5文字以上15文字以下の入力をしてください";
      target1.innerText = "";
      target11.innerText = msg;
    }else if(userID.value.length >= 16 ){
      msg = "5文字以上15文字以下の入力をしてください";
  	  target1.innerText = "";
      target11.innerText = msg;
    }else{
    	target11.innerText = "";
        target1.innerText = msg;
    }
}

 
// Ajax通信失敗時処理
function error2(XMLHttpRequest, textStatus, errorThrown) {
	console.log("error:" + XMLHttpRequest);
	console.log("status:" + textStatus);
	console.log("errorThrown:" + errorThrown);
	target1 = document.getElementById("output1");
	target1.innerText = "";
	target11 = document.getElementById("output11");
	var res = $.parseJSON(XMLHttpRequest.responseText);
	target11.innerText = res.message;

}


//  ニックネームチェック
function onNickname() {
     target2 = document.getElementById("output2");
     target22 = document.getElementById("output22");
     if(nickname.value.length > 30){
       target22.innerText = "30文字以下で入力してください";
       target2.innerText = "";
     }else if(0 >= nickname.value.length){
         target22.innerText = "ニックネームを入力してください";
         target2.innerText = "";
     }else{
       target2.innerText = "OK";
       target22.innerText = "";
     }
}


//  メールアドレスチェック
function onMailaddres() {
     target3 = document.getElementById("output3");
     target33 = document.getElementById("output33");
     if(mail.value.length >= 256){
       target33.innerText = "255文字以下で入力してください";
       target3.innerText = "";
     }else if(0 >= mail.value.length){
       target33.innerText = "メールアドレスを入力してください";
       target3.innerText = "";
     }else{
       target3.innerText = "OK";
       target33.innerText = "";
     }
}


//  パスワードチェック
function onPassword() {
     target4 = document.getElementById("output4");
     target44 = document.getElementById("output44");
     if(8 > pass1.value.length){
       target44.innerText = "8文字以上の入力してください";
       target4.innerText = "";
     }else if(0 >= pass1.value.length){
       target44.innerText = "パスワードを入力してください";
       target4.innerText = "";
     }else{
       target4.innerText = "OK";
       target44.innerText = "";
     }
}
