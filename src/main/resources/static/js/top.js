
var headerName = $("meta[name='_csrf_header']").attr("content");
var tokenValue = $("meta[name='_csrf']").attr("content");
$(document).ajaxSend(function(e, xhr, options){
xhr.setRequestHeader(headerName, tokenValue);
});

var length=0;
var count=0;
var first=0;
var end=0;


sanitaize = {
    encode : function (str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    decode : function (str) {
      return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&amp;/g, '&');
    }
  };

//  コメントテスト
//  タイムライン表示
$(function timelineload() {

	  var name="";
	  var tweet="";

	  if(!name) {
		  name="";
	  }
	  if(!tweet) {
		  tweet="";
	  }
	  var data = {userName : name, tweet : tweet};

	if(first==0){
		        var timelineget1 = $.PeriodicalUpdater('./unitter/demo',{
			            url         : "http://localhost:8080/begin/0",
						minTimeout  : 1000,
				        method      : "GET",
						sendData    : data,
						maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
						multiplier  : 1,
			            type        : "json",
			            success     : function(data) {
						                           success(data);
						   							first = 1; 
				                    },
			            error       : function(XMLHttpRequest, textStatus, errorThrown) {
				                            error(XMLHttpRequest, textStatus, errorThrown);
				                        }
			        });
	}else{
		var hoge = setInterval(function() {
		    //終了条件
			if(document.body.className != "modal-open"){

		    // Ajax通信テスト ボタンクリック
		        var timelineget = $.PeriodicalUpdater('./unitter/demo',{
			        url         : "http://localhost:8080/begin/0",
					minTimeout  : 1000,
			        method      : "GET",
					sendData    : data,
					maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
					multiplier  : 1,
		            type        : "json",
		            success     : function(data) {
					                           success(data);				    
			                    },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
			                            error(XMLHttpRequest, textStatus, errorThrown);
			                        }
		        });
			}
		}, 60000);


		}

});
 
// Ajax通信成功時処理
function success(data) {

	var today = new Date();

	var width  = 0;
	var height = 0;

	for (var i=0; data.length-1 >= i; i++){

		if(data[i].tweetImageWidth != 0){
			width =  (window.parent.screen.width/3)/data[i].tweetImageWidth;
		}
		height = data[i].tweetImageHeight*width + 120;

		tweetdate = data[i].tweetTimestamp;
		var date = new Date(tweetdate.slice(0,4),tweetdate.slice(5,7)-1,tweetdate.slice(8,10),tweetdate.slice(11,13),tweetdate.slice(14,16),tweetdate.slice(17,19));
		var diff = today.getTime() - date.getTime();
		date = Math.floor(diff / 1000);
		var elapsed = "";
		if(date<60){
			elapsed = date+"秒"
		}else{
			date = Math.floor(diff / (1000 * 60));
			if(date<60){
				elapsed = date+"分"
			}else{
				date = Math.floor(diff / (1000 * 60 * 60));
				if(date<24){
					elapsed = date+"時間"
				}else{
					date = Math.floor(diff / (1000 * 60 * 60 * 24));
					elapsed = date+"日"
					}
				}
			}

		var tweet = "";
		if(data[i].tweet.length > 64){
			tweet = data[i].tweet.substring(0,62) +"……";
		}else{
			tweet = data[i].tweet;
		}

    	if(document.getElementById("timeline"+data[i].tweetId)){
    		break;
    	}else if(first != 0){
        	if(data[i].tweetImage.length != 0){
            	 $("#output1").prepend('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;" charset="UTF-8"></img></div></div></div></div><div style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></li></div>');
            	 $("#output1").prepend('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;min-height:150px; max-height:400px;"></img></div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
        	}else{
           	 	 $("#output1").prepend('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></li></div>');
           	 	 $("#output1").prepend('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
        	}
    	}else{
    		if(data[i].tweetImage.length != 0){
    			 $("#output1").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;" charset="UTF-8"></img></div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></li></div>');
           	 	 $("#output1").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;min-height:150px; max-height:400px;"></img></div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
    		}else{
          	 	 $("#output1").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></li></div>');
          	 	 $("#output1").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
    		}
    	}

	}
 		for (var i=0; data.length-1 >= i; i++){
 			tweetdate = data[i].tweetTimestamp;
			var date = new Date(tweetdate.slice(0,4),tweetdate.slice(5,7)-1,tweetdate.slice(8,10),tweetdate.slice(11,13),tweetdate.slice(14,16),tweetdate.slice(17,19));
			var diff = today.getTime() - date.getTime();
			date = Math.floor(diff / 1000);
			var elapsed = "";

			if(date<60){
				elapsed = date+"秒"
			}else{
				date = Math.floor(diff / (1000 * 60));
				if(date<60){
					elapsed = date+"分"
				}else{
					date = Math.floor(diff / (1000 * 60 * 60));
					if(date<24){
						elapsed = date+"時間"
					}else{
						date = Math.floor(diff / (1000 * 60 * 60 * 24));
						elapsed = date+"日"
						}
					}
				}
			$("#tweettime"+data[i].tweetId).empty();
			$("#tweettime"+data[i].tweetId).append(elapsed);

			$("#footer"+data[i].tweetId).empty();
			$("#footer"+data[i].tweetId).append('<div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
			$("#modalfooter"+data[i].tweetId).empty();
			$("#modalfooter"+data[i].tweetId).append('<div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');

	}
}
 
// Ajax通信失敗時処理
function error(XMLHttpRequest, textStatus, errorThrown) {
    console.log("error:" + XMLHttpRequest);
    console.log("status:" + textStatus);
    console.log("errorThrown:" + errorThrown);
}


//タイムラインをさらに表示
$(window).bind("scroll", function() {
scrollHeight = $(document).height();
scrollPosition = $(window).height() + $(window).scrollTop();
if ( 0.30 >= (scrollHeight - scrollPosition) / scrollHeight && (scrollHeight - scrollPosition) / scrollHeight >= 0.29) {
	count = count + 1;
	  var name="";
	  var tweet="";

	  if(!name) {
		  name="";
	  }
	  if(!tweet) {
		  tweet="";
	  }
	  var data = {userName : name, tweet : tweet};


	        $.PeriodicalUpdater('./unitter/demo',{
		            url         : "http://localhost:8080/begin/"+count,
					minTimeout  : 1000,
			        method      : "GET",
					sendData    : data,
					maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
					multiplier  : 1,
		            type        : "json",
		            success     : function(data) {
					                    success2(data);
			                    },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
			                            error(XMLHttpRequest, textStatus, errorThrown);
			                        }
		        });
} else {
	//それ以外のスクロールの位置の場合
}
});

//Ajax通信成功時処理
function success2(data) {

		 
	var today = new Date();

	var img = new Image();

	var width  = 0;
	var height = 0;

	for (var i=0; data.length-1 >= i; i++){

		width =  (window.parent.screen.width/3)/data[i].tweetImageWidth;
		height = data[i].tweetImageHeight*width + 100;

		tweetdate = data[i].tweetTimestamp;
		var date = new Date(tweetdate.slice(0,4),tweetdate.slice(5,7)-1,tweetdate.slice(8,10),tweetdate.slice(11,13),tweetdate.slice(14,16),tweetdate.slice(17,19));
		var diff = today.getTime() - date.getTime();
		date = Math.floor(diff / 1000);
		var elapsed = "";
		if(date<60){
			elapsed = date+"秒"
		}else{
			date = Math.floor(diff / (1000 * 60));
			if(date<60){
				elapsed = date+"分"
			}else{
				date = Math.floor(diff / (1000 * 60 * 60));
				if(date<24){
					elapsed = date+"時間"
				}else{
					date = Math.floor(diff / (1000 * 60 * 60 * 24));
					elapsed = date+"日"
					}
				}
			}

	var tweet = "";
	if(data[i].tweet.length > 64){
		tweet = data[i].tweet.substring(0,62) +"……";
	}else{
		tweet = data[i].tweet;
	}

if(document.getElementById("timeline"+data[i].tweetId)){
	break;
}else{
	if(data[i].tweetImage.length != 0){
		 $("#output1").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;" charset="UTF-8"></img></div></div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></li></div>');
 	 	 $("#output1").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;min-height:150px; max-height:400px;"></img></div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
	}else{
	 	 $("#output1").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></li></div>');
	 	 $("#output1").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
	}
}


	}
		for (var i=0; data.length-1 >= i; i++){
			tweetdate = data[i].tweetTimestamp;
			var date = new Date(tweetdate.slice(0,4),tweetdate.slice(5,7)-1,tweetdate.slice(8,10),tweetdate.slice(11,13),tweetdate.slice(14,16),tweetdate.slice(17,19));
			var diff = today.getTime() - date.getTime();
			date = Math.floor(diff / 1000);
			var elapsed = "";
			if(date<60){
				elapsed = date+"秒"
			}else{
				date = Math.floor(diff / (1000 * 60));
				if(date<60){
					elapsed = date+"分"
				}else{
					date = Math.floor(diff / (1000 * 60 * 60));
					if(date<24){
						elapsed = date+"時間"
					}else{
						date = Math.floor(diff / (1000 * 60 * 60 * 24));
						elapsed = date+"日"
						}
					}
				}


			$("#tweettime"+data[i].tweetId).empty();
			$("#tweettime"+data[i].tweetId).append(elapsed);

				$("#footer"+data[i].tweetId).empty();
				$("#footer"+data[i].tweetId).append('<div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
				$("#modalfooter"+data[i].tweetId).empty();
				$("#modalfooter"+data[i].tweetId).append('<div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');

			}

}


$(document).on('click', '#searchbox', function(){

	     // Ajax通信テスト ボタンクリック
	  var name=search.value;
	  var tweet=search.value;

	  if(!name) {
		  name="";
	  }
	  if(!tweet) {
		  tweet="";
	  }
	  var data = {userName : name, tweet : tweet};

	         $.ajax({
	             type        : "GET",
	             url         : 'http://localhost:8080/begin/0',
	             data        : data,
	             minTimeout  : 1000,
	             multiplier  : 1,
	             contentType : 'application/JSON',

	             success     : function(data) {
		                        success3(data);
								document.getElementById("searchResult").click();
	                           },
	             error       : function(XMLHttpRequest, textStatus, errorThrown) {
	                             console.log("error");
	                           }
	         });
});

// Ajax通信成功時処理
function success3(data) {
	 $("#searchlist").empty();

	var today = new Date();
	var width  = 0;
	var height = 0;


	for (var i=0; data.length-1 >= i; i++){

		if(data[i].tweetImageWidth != 0){
			width =  (window.parent.screen.width/3)/data[i].tweetImageWidth;
		}
		height = data[i].tweetImageHeight*width + 120;


		tweetdate = data[i].tweetTimestamp;
		var date = new Date(tweetdate.slice(0,4),tweetdate.slice(5,7)-1,tweetdate.slice(8,10),tweetdate.slice(11,13),tweetdate.slice(14,16),tweetdate.slice(17,19));
		var diff = today.getTime() - date.getTime();
		date = Math.floor(diff / 1000);
		var elapsed = "";
		if(date<60){
			elapsed = date+"秒"
		}else{
			date = Math.floor(diff / (1000 * 60));
			if(date<60){
				elapsed = date+"分"
			}else{
				date = Math.floor(diff / (1000 * 60 * 60));
				if(date<24){
					elapsed = date+"時間"
				}else{
					date = Math.floor(diff / (1000 * 60 * 60 * 24));
					elapsed = date+"日"
				}
			}
		}

		var tweet = "";
		if(data[i].tweet.length > 64){
			tweet = data[i].tweet.substring(0,62) +"……";
		}else{
			tweet = data[i].tweet;
		}


    		if(data[i].tweetImage.length != 0){
   			 $("#searchlist").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;" charset="UTF-8"></img></div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></li></div>');
          	 	 $("#searchlist").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;min-height:150px; max-height:400px;"></img></div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
   		}else{
         	 	 $("#searchlist").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></li></div>');
         	 	 $("#searchlist").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
   		}

	}
		for (var i=0; data.length-1 >= i; i++){
 			tweetdate = data[i].tweetTimestamp;
			var date = new Date(tweetdate.slice(0,4),tweetdate.slice(5,7)-1,tweetdate.slice(8,10),tweetdate.slice(11,13),tweetdate.slice(14,16),tweetdate.slice(17,19));
			var diff = today.getTime() - date.getTime();
			date = Math.floor(diff / 1000);
			var elapsed = "";

			if(date<60){
				elapsed = date+"秒"
			}else{
				date = Math.floor(diff / (1000 * 60));
				if(date<60){
					elapsed = date+"分"
				}else{
					date = Math.floor(diff / (1000 * 60 * 60));
					if(date<24){
						elapsed = date+"時間"
					}else{
						date = Math.floor(diff / (1000 * 60 * 60 * 24));
						elapsed = date+"日"
						}
					}
				}
			$("#tweettime"+data[i].tweetId).empty();
			$("#tweettime"+data[i].tweetId).append(elapsed);

			$("#footer"+data[i].tweetId).empty();
			$("#footer"+data[i].tweetId).append('<div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
			$("#modalfooter"+data[i].tweetId).empty();
			$("#modalfooter"+data[i].tweetId).append('<div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color:#4169E1;"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color:#FF1493;" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
	}

}
