
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


//タイムライン表示
$(function timelineload() {

	     $.PeriodicalUpdater('./unitter/demo',{
		      url         : "http://localhost:8080/profile/profile/"+userId+"/"+userId,
		      minTimeout  : 1000,
		      method      : "GET",
		      sendData    : end,
		      maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
		      multiplier  : 1,
		               type        : "json",
		               success     : function(data) {
			   							$("#myheadderImage").empty();
			   							$("#myheadderImage").append('<img src="/photo/'+data.headderImage+'" style="width:85%;position: absolute;left:25px;"></img>');
			   							$("#myprofileImage").empty();
			   							$("#myprofileImage").append('<img src="/photo/'+data.profileImage+'" style="width:60px;position: absolute;left:25px;top:170px;"></img>');

			   							target1 = document.getElementById("user");
			   							target1.innerHTML = data.userId;
			   							target2 = document.getElementById("nick");
			   							target2.innerHTML = data.nickname;
			   							target3 = document.getElementById("self");
			   							target3.innerHTML = data.selfIntroduction;
			   							target4 = document.getElementById("tweetcount");
			   							target4.innerHTML = data.tweet.length;
			   							target5 = document.getElementById("followcount");
			   							target5.innerHTML = data.follow.length;
			   							target6 = document.getElementById("followercount");
			   							target6.innerHTML = data.follower.length;

		                           },
		               error       : function(XMLHttpRequest, textStatus, errorThrown) {
		                                error(XMLHttpRequest, textStatus, errorThrown);
		                            }
		           });

	        var timelineget1 = $.PeriodicalUpdater('./unitter/demo',{
		            url         : "http://localhost:8080/unitter/timeline/"+userId + "/0",
					minTimeout  : 1000,
			        method      : "GET",
					sendData    : end,
					maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
					multiplier  : 1,
		            type        : "json",
		            success     : function(data) {
					                           timelinesuccess(data);
					   							first = 1; 
			                    },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
			                            error(XMLHttpRequest, textStatus, errorThrown);
			                        }
		        });
});
 
// Ajax通信成功時処理
function timelinesuccess(data) {

	var width  = 0;
	var height = 0;

	for (var i=0; data.length-1 >= i; i++){

		var retweetMessage=data[i].retweetMessage;
		if(!retweetMessage) {
			retweetMessage="";
		}

		if(data[i].tweetImageWidth != 0){
			width =  (window.parent.screen.width/3)/data[i].tweetImageWidth;
		}
		height = data[i].tweetImageHeight*width + 120;

		var elapsed = elapsedTime(data[i].tweetTimestamp);

		var retweetColor = new Array(data.length);
		var favoriteColor = new Array(data.length);

		if(data[i].retweetFlg == true){
			retweetColor[i] = "#4169E1";
		}else{
			retweetColor[i] = "#C0C0C0";
		}
		if(data[i].favoriteFlg == true){
			favoriteColor[i] = "#FF1493";
		}else{
			favoriteColor[i] = "#C0C0C0";
		}

		var deletebutton = "";

		if(data[i].otherId != userId){
			deletebutton = "display:none;"
		}

		var tweet = "";
		if(data[i].tweet.length > 64){
			tweet = data[i].tweet.substring(0,62) +"……";
		}else{
			tweet = data[i].tweet;
		}

		if (first == 0){
			if(data[i].tweetImage.length != 0){
				 $("#output1").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text btn-link">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;" charset="UTF-8"></img></div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#delete'+data[i].tweetId+'" style="'+deletebutton+'"></span></div></div></div></li></div>');
	       	 	 $("#output1").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;min-height:150px; max-height:400px;"></img></div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
			}else{
	      	 	 $("#output1").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text btn-link">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#delete'+data[i].tweetId+'" style="'+deletebutton+'"></span></div></div></div></li></div>');
	      	 	 $("#output1").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
			}
		}else if(document.getElementById("timeline"+data[i].tweetId)){
			break;
		}else if(data[i].tweetImage == "loading"){
			continue;
		}else{
    	if(data[i].tweetImage.length != 0){
        	 $("#output1").prepend('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text btn-link">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;" charset="UTF-8"></img></div></div></div></div><div style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#delete'+data[i].tweetId+'" style="'+deletebutton+'"></span></div></div></div></li></div>');
        	 $("#output1").prepend('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;min-height:150px; max-height:400px;"></img></div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
    	}else{
       	 	 $("#output1").prepend('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet'+data[i].tweetId+'" style="display:inline" class="list-group-item-text" data-toggle="popover" data-container="body" onmouseout="$(this).popover("hide");">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text btn-link">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#delete'+data[i].tweetId+'" style="'+deletebutton+'"></span></div></div></div></li></div>');
       	 	 $("#output1").prepend('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
    	}
	}

 	 	 $("#output1").append('<input type="hidden" id=nickname_'+data[i].otherId+' value="'+data[i].profile.nickname+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=follow_'+data[i].otherId+' value="'+data[i].profile.follow.length+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=follower_'+data[i].otherId+' value="'+data[i].profile.follower.length+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=favorite_'+data[i].otherId+' value="'+data[i].profile.favorite.length+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=profileImage_'+data[i].otherId+' value="'+data[i].profile.profileImage+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=headderImage_'+data[i].otherId+' value="'+data[i].profile.headderImage+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=selfIntroduction_'+data[i].otherId+' value="'+data[i].profile.selfIntroduction+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=followFlg_'+data[i].otherId+' value="'+data[i].profile.followFlg+'"></div>');

  	 	 $("#output1").append('<div class="modal fade" id="delete'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content" style="height:120px;"><div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button><h4 class="modal-title" style="text-align:center;">このツイートを本当に削除しますか？</h4></div><div class="modal-body" style="padding-top:50px;"><div class="col-xs-7"></div><div class="col-xs-5"><button class="btn btn-primary" data-dismiss="modal">キャンセル</button><button id="deletecheck'+data[i].tweetId+'" class="btn btn-primary" data-dismiss="modal">ツイート削除</button></div></div></div></div></div>');

	}
	first = 1

		for (var i=0; data.length-1 >= i; i++){

			var retweetMessage=data[i].retweetMessage;
			if(!retweetMessage) {
				retweetMessage="";
			}
			var elapsed = elapsedTime(data[i].tweetTimestamp);

			var retweetColor = new Array(data.length);
			var favoriteColor = new Array(data.length);

			if(data[i].retweetFlg == true){
				retweetColor[i] = "#4169E1";
			}else{
				retweetColor[i] = "#C0C0C0";
			}
			if(data[i].favoriteFlg == true){
				favoriteColor[i] = "#FF1493";
			}else{
				favoriteColor[i] = "#C0C0C0";
			}

		   var followbutton = "";
		   var unfollowbutton = "";

		   if(data[i].profile.followFlg == true){
		    followbutton = "display:none";
		   }else{
		    unfollowbutton = "display:none";
		   }

			//タイムラインでのプロフィールカードの表示
		    // ポップオーバー文言
		   $('#tweet'+data[i].tweetId).attr('data-content','<div class="thumbnail" style="width:100%;height:100%;"><img src="photo/'+data[i].profile.headderImage+'" style="width:100%;height:80px;"></img><div class="caption"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;height:60px;position: absolute;left:25px;top:60px;" class="img-rounded"></img><button class="btn btn-primary pull-right" id="timelinefollow'+data[i].profile.userId+'"  style="'+followbutton+'">フォローする</button><button class="btn btn-primary pull-right" id="timelinefollow'+data[i].profile.userId+'Release" style="'+unfollowbutton+'">フォロー解除</button><div style="padding-top:40px;"><div style="font-size:14px;">'+data[i].profile.nickname+'</div><div style="font-size:10px;" id="popovertweetuser_'+data[i].otherId+'">@'+data[i].profile.userId+'</div><div style="font-size:10px;padding-top:10px;">'+data[i].profile.selfIntroduction+'</div></div></div></div>');

		    // ポップオーバーアクション
		    $("[data-toggle=popover]").popover({
		       trigger: 'manual',
		       animate: false,
		       html: true,
		       placement: 'top'
		       }).mouseover(function(e) {
		       $(this).popover('show')
		    }).mouseover(function(e) {
		    	 $("[data-toggle=popover]").not(this).popover('hide')
		    });

		    $('html').click(function() {
		     $("[data-toggle=popover]").popover('hide');
		   });

			$("#tweettime"+data[i].tweetId).empty();
			$("#tweettime"+data[i].tweetId).append(elapsed);

			if(data[i].otherId == userId){
				$("#footer"+data[i].tweetId).empty();
				$("#footer"+data[i].tweetId).prepend('<div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#delete'+data[i].tweetId+'"></span>');
				$("#modalfooter"+data[i].tweetId).empty();
				$("#modalfooter"+data[i].tweetId).prepend('<div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
			}else{
				$("#footer"+data[i].tweetId).empty();
				$("#footer"+data[i].tweetId).prepend('<div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
				$("#modalfooter"+data[i].tweetId).empty();
				$("#modalfooter"+data[i].tweetId).prepend('<div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
			}
			}

		first = 1;

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
	if(!document.getElementById("loading")){
	 $("#output1").append('<div id="loading"><li class="list-group-item" style="height:100px;"><img src="photo/loading.gif" style="height:80px;">　　ただいまツイートをさらに読み込み中です</li></div>');
	}
	        $.PeriodicalUpdater('./unitter/demo',{
		            url         : "http://localhost:8080/unitter/timeline/"+userId + "/"+count,
					minTimeout  : 1000,
			        method      : "GET",
					sendData    : end,
					maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
					multiplier  : 1,
		            type        : "json",
		            success     : function(data) {
			var huga = 0;
			var hoge = setInterval(function() {
			    huga++;
			    //終了条件
			    if (huga == 10) {
			    clearInterval(hoge);
				                    scrollsuccess(data);
				if(document.getElementById("loading")){
				 $("#loading").remove();
				}
			    }
			}, 1000);
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
function scrollsuccess(data) {
		 
	var width  = 0;
	var height = 0;

	for (var i=0; data.length-1 >= i; i++){

		if(data[i].tweetImageWidth != 0){
			width =  (window.parent.screen.width/3)/data[i].tweetImageWidth;
		}
		height = data[i].tweetImageHeight*width + 120;

		var retweetMessage=data[i].retweetMessage;
		if(!retweetMessage) {
			retweetMessage="";
		}

		var elapsed = elapsedTime(data[i].tweetTimestamp);

		var retweetColor = new Array(data.length);
		var favoriteColor = new Array(data.length);

		if(data[i].retweetFlg == true){
			retweetColor[i] = "#4169E1";
		}else{
			retweetColor[i] = "#C0C0C0";
		}
		if(data[i].favoriteFlg == true){
			favoriteColor[i] = "#FF1493";
		}else{
			favoriteColor[i] = "#C0C0C0";
		}

		var deletebutton = "";

	if(data[i].otherId != userId){
		deletebutton = "display:none;"
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
		 $("#output1").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline;" class="list-group-item-text btn-link">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;" charset="UTF-8"></img></div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#delete'+data[i].tweetId+'" style="'+deletebutton+'"></span></div></div></div></li></div>');
   	 	 $("#output1").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;max-width:450px;height:100%;min-height:150px; max-height:400px;"></img></div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
	}else{
  	 	 $("#output1").append('<div id="timeline'+data[i].tweetId+'"><li class="list-group-item" style="height:'+height+'px;overflow:hidden;" id="timeline'+data[i].tweetId+'"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text btn-link">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweettime'+data[i].tweetId+'" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div  style="position: absolute;bottom:0;left:30%;" id="footer'+data[i].tweetId+'"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#delete'+data[i].tweetId+'" style="'+deletebutton+'"></span></div></div></div></li></div>');
  	 	 $("#output1").append('<div class="modal fade" id="tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer" id="modalfooter'+data[i].tweetId+'"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
	}
}

 	 	 $("#output1").append('<input type="hidden" id=nickname_'+data[i].otherId+' value="'+data[i].profile.nickname+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=follow_'+data[i].otherId+' value="'+data[i].profile.follow.length+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=follower_'+data[i].otherId+' value="'+data[i].profile.follower.length+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=favorite_'+data[i].otherId+' value="'+data[i].profile.favorite.length+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=profileImage_'+data[i].otherId+' value="'+data[i].profile.profileImage+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=headderImage_'+data[i].otherId+' value="'+data[i].profile.headderImage+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=selfIntroduction_'+data[i].otherId+' value="'+data[i].profile.selfIntroduction+'"></div>');
  	 	 $("#output1").append('<input type="hidden" id=followFlg_'+data[i].otherId+' value="'+data[i].profile.followFlg+'"></div>');

  	 	 $("#output1").append('<div class="modal fade" id="delete'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content" style="height:120px;"><div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button><h4 class="modal-title" style="text-align:center;">このツイートを本当に削除しますか？</h4></div><div class="modal-body" style="padding-top:50px;"><div class="col-xs-7"></div><div class="col-xs-5"><button class="btn btn-primary" data-dismiss="modal">キャンセル</button><button id="deletecheck'+data[i].tweetId+'" class="btn btn-primary" data-dismiss="modal">ツイート削除</button></div></div></div></div></div>');

	}
		for (var i=0; data.length-1 >= i; i++){

			var retweetMessage=data[i].retweetMessage;
			if(!retweetMessage) {
				retweetMessage="";
			}

			var elapsed = elapsedTime(data[i].tweetTimestamp);

			var retweetColor = new Array(data.length);
			var favoriteColor = new Array(data.length);

			if(data[i].retweetFlg == true){
				retweetColor[i] = "#4169E1";
			}else{
				retweetColor[i] = "#C0C0C0";
			}
			if(data[i].favoriteFlg == true){
				favoriteColor[i] = "#FF1493";
			}else{
				favoriteColor[i] = "#C0C0C0";
			}


		   var followbutton = "";
		   var unfollowbutton = "";

		   if(data[i].profile.followFlg == true){
		    followbutton = "display:none";
		   }else{
		    unfollowbutton = "display:none";
		   }


			  //タイムラインでのプロフィールカードの表示
		    // ポップオーバー文言
		   $('#tweet'+data[i].tweetId).attr('data-content','<div class="thumbnail" style="width:100%;height:100%;"><img src="photo/'+data[i].profile.headderImage+'" style="width:100%;height:80px;"></img><div class="caption"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;height:60px;position: absolute;left:25px;top:60px;" class="img-rounded"></img><button class="btn btn-primary pull-right" id="timelinefollow'+data[i].profile.userId+'"  style="'+followbutton+'">フォローする</button><button class="btn btn-primary pull-right" id="timelinefollow'+data[i].profile.userId+'Release" style="'+unfollowbutton+'">フォロー解除</button><div style="padding-top:40px;"><div style="font-size:14px;">'+data[i].profile.nickname+'</div><div style="font-size:10px;" id="popovertweetuser_'+data[i].otherId+'">@'+data[i].profile.userId+'</div><div style="font-size:10px;padding-top:10px;">'+data[i].profile.selfIntroduction+'</div></div></div></div>');

		    // ポップオーバーアクション
		    $("[data-toggle=popover]").popover({
		       trigger: 'manual',
		       animate: false,
		       html: true,
		       placement: 'top'
		       }).mouseover(function(e) {
		       $(this).popover('show')
		    });

		    $('html').click(function() {
		     $("[data-toggle=popover]").popover('hide');
		   });



			$("#tweettime"+data[i].tweetId).empty();
			$("#tweettime"+data[i].tweetId).append(elapsed);

			if(data[i].otherId == userId){
				$("#footer"+data[i].tweetId).empty();
				$("#footer"+data[i].tweetId).append('<div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#delete'+data[i].tweetId+'"></span>');
				$("#modalfooter"+data[i].tweetId).empty();
				$("#modalfooter"+data[i].tweetId).append('<div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
			}else{
				$("#footer"+data[i].tweetId).empty();
				$("#footer"+data[i].tweetId).append('<div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');
				$("#modalfooter"+data[i].tweetId).empty();
				$("#modalfooter"+data[i].tweetId).append('<div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div>');

			}
			}

}
//マウスが変わる処理
$(document).on('mouseover', 'div[id^=tweetuser]', function(){
	document.body.style.cursor = "pointer";
});
$(document).on('mouseout', 'div[id^=tweetuser]', function(){
	document.body.style.cursor = "auto";
});


//ツイートの実行
$(document).on('click', '#tweetbox', function(){

	// 要素規定の動作をキャンセルする
    event.preventDefault();
    
    var data = {userId : userId, tweet : sanitaize.encode(tweetbody.value), tweetId : ""};

        $.ajax({
            type        : "POST",
            url         : "http://localhost:8080/unitter",
            data        : JSON.stringify(data),
            minTimeout  : 1000,
            multiplier  : 1,
            contentType : 'application/JSON',
            success     : function(data) {
							upload(data);
	                        tweetsuccess();
                          },
            error       : function(XMLHttpRequest, textStatus, errorThrown) {
                            error2();
                          }
        });

});

function upload(tweet){
	console.log(tweet.tweetId);
	var ajaxUrl = "unitter/upload/" + tweet.tweetId;
	//ファイル種類

	if(window.FormData){
		var form = $('#data_upload_form').get()[0];
	    var formData = new FormData(form);

	 $.ajax({
	     type : "POST",                  // HTTP通信の種類
	     url  : ajaxUrl,                 // リクエストを送信する先のURL
	     dataType : "text",              // サーバーから返されるデータの型
	     data : formData,                // サーバーに送信するデータ
	     processData : false,
	     contentType: false,
	 }).done(function(data) {        // Ajax通信が成功した時の処理
		 console.log("アップロードが完了しました。");
	     target = document.getElementById("upload_file");
	     target.value = "";
	 }).fail(function(XMLHttpRequest, textStatus, errorThrown) { // Ajax通信が失敗した時の処理
		 console.log("アップロードが失敗しました。");
		 var res = $.parseJSON(XMLHttpRequest.responseText);
		 alert(res.message);
		 tweetDelete(tweet.tweetId);
		 console.log(XMLHttpRequest.status);
		 console.log(errorThrown.message);
	 });
	}else{
		console.log("アップロードに対応できていないブラウザです。");
	}

}
// Ajax通信成功時処理
function tweetsuccess() {
	console.log("tweetsuccess");
    target = document.getElementById("tweetbody");
    target.value = "";
  
}
 
// Ajax通信失敗時処理
function error2(XMLHttpRequest, textStatus, errorThrown) {
	console.log("error:" + XMLHttpRequest);
	console.log("status:" + textStatus);
	console.log("errorThrown:" + errorThrown);
    target = document.getElementById("tweetbody");
    target.value = "";  
}


//  ツイートの文字数の表示
function tweetCount() {
    target = document.getElementById("output");
    target.innerText = 140 - tweetbody.value.length;

    if(tweetbody.value.length > 140){
    	$("#tweetbox").prop("disabled", true);
    }else {
    	$("#tweetbox").prop("disabled", false);
    }

}


//ツイート削除関数
function tweetDelete(tweetId){

         $.ajax({
             type        : "DELETE",
             url         : "http://localhost:8080/unitter/"+tweetId,
             minTimeout  : 1000,
             multiplier  : 1,
             success     : function(data) {
	 					  console.log("tweetdelete:success");  
                          $("#timeline"+tweetId).empty();
                          target = document.getElementById("upload_file");
                 	      target.value = "";
                           },
             error       : function(XMLHttpRequest, textStatus, errorThrown) {
                             error3();
                           }
         });
}

//ツイート削除の実行（タイムラインから）
$(document).on('click', 'button[id^=deletecheck]', function(){
    var data = {userId : userId, tweetId : this.value};
    var tweetId = this.id;
    var tweetId2 = tweetId.replace( "deletecheck" , "");
    tweetDelete(tweetId2);

});

//ツイート削除の実行（プロフィールページのツイートタブから）
$(document).on('click', 'button[id^=profile-deletecheck]', function(){
    var data = {userId : userId, tweetId : this.value};
    var tweetId = this.id;
    var tweetId2 = tweetId.replace( "profile-deletecheck" , "");
    tweetDelete(tweetId2);
});

//ツイート削除の実行（プロフィールページのお気に入りタブから）
$(document).on('click', 'button[id^=profile2-deletecheck]', function(){
    var data = {userId : userId, tweetId : this.value};
    var tweetId = this.id;
    var tweetId2 = tweetId.replace( "profile2-deletecheck" , "");
    tweetDelete(tweetId2);
}); 


//ツイート削除の実行（検索結果ページから）
$(document).on('click', 'button[id^=search-deletecheck]', function(){
    var data = {userId : userId, tweetId : this.value};
    var tweetId = this.id;
    var tweetId2 = tweetId.replace( "search-deletecheck" , "");
    tweetDelete(tweetId2);
}); 


 
// Ajax通信失敗時処理
function error3(XMLHttpRequest, textStatus, errorThrown) {
	console.log("error:" + XMLHttpRequest);
	console.log("status:" + textStatus);
	console.log("errorThrown:" + errorThrown);
}


//  ユーザー削除の際のパスワードチェック
	$(document).on('click', 'button[id^=accountdelete]', function(){
		    
		    var data = {userId : userId, password : deletepassword.value};

		        $.ajax({
		            type        : "POST",
		            url         : "http://localhost:8080/account/password",
		            data        : JSON.stringify(data),
		            minTimeout  : 1000,
		            multiplier  : 1,
		            contentType : 'application/JSON',
		            success     : function(data) {
			                        success10();
			                        console.log("passwordcheacksuccess");
			                        accountdelete();
		                          },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
		                            error10(XMLHttpRequest, textStatus, errorThrown);
									console.log("error");
		                          }
		        });
		});

	 
	// Ajax通信失敗時処理
	function error10(XMLHttpRequest, textStatus, errorThrown) {
		console.log("error:" + XMLHttpRequest);
		console.log("status:" + textStatus);
		console.log("errorThrown:" + errorThrown);
		target = document.getElementById("outputconfigerror1");
		var res = $.parseJSON(XMLHttpRequest.responseText);
		target.innerText = res.message;
	}


//  ユーザー削除の実行
	function accountdelete(){
		    
		        $.ajax({
		            type        : "DELETE",
		            url         : "http://localhost:8080/account/"+userId,
		            minTimeout  : 1000,
		            multiplier  : 1,
		            success     : function(data) {
			            			console.log("accountdelete:success");
									document.logout.submit();
		                          },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
		                            error4();
									document.logout.submit();
		                          }
		        });
		}
		 		 
		// Ajax通信失敗時処理
		function error4(XMLHttpRequest, textStatus, errorThrown) {
			console.log("error:" + XMLHttpRequest);
			console.log("status:" + textStatus);
			console.log("errorThrown:" + errorThrown);
		}


//  ユーザー更新の実行
	$(document).on('click', 'button[id^=accountupdate]', function(){
		    
		    var data = {userId : userId, nickname : updatenickname.value, mailAddress : updatemailaddres.value, password : password};

		        $.ajax({
		            type        : "POST",
		            url         : "http://localhost:8080/unitter/update/"+userId,
					data        : JSON.stringify(data),
		            minTimeout  : 1000,
		            multiplier  : 1,
		            contentType : 'application/JSON',
		            success     : function(data) {
									accountupdatesuccess();
		                          },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
		                            error5(XMLHttpRequest, textStatus, errorThrown);
		                          }
		        });
		});

		 
		// Ajax通信成功時処理
		function accountupdatesuccess() {
			console.log("accountupdate:success");
		    target = document.getElementById("nick");
		    target.innerHTML = profilenickname.value;
			target1 = document.getElementById("outputconfigerror1");
		    target1.innerHTML = "";
		    target11 = document.getElementById("outputconfigsuccess1");
		    target11.innerHTML = "変更を保存しました";
		}
		 
		// Ajax通信失敗時処理
		function error5(XMLHttpRequest, textStatus, errorThrown) {
			console.log("error:" + XMLHttpRequest);
			console.log("status:" + textStatus);
			console.log("errorThrown:" + errorThrown);
			target = document.getElementById("outputconfigerror1");
			var res = $.parseJSON(XMLHttpRequest.responseText);
			target.innerText = res.message;
		    target11 = document.getElementById("outputconfigsuccess1");
		    target11.innerHTML = "";

		}


		$(document).on('click', 'button[id^=passwordupdate]', function(){

		    var data = {userId : userId, password : currentpassword.value, changePassword : newpassword.value, againPassword : newpasswordcheck.value};

		        $.ajax({
		            type        : "POST",
		            url         : "http://localhost:8080/account/changepassword",
		            data        : JSON.stringify(data),
		            minTimeout  : 1000,
		            multiplier  : 1,
		            contentType : 'application/JSON',
		            success     : function(data) {
			                        changepassword();
		                          },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
		                            error11(XMLHttpRequest, textStatus, errorThrown);
		                          }
		        });
		});
	 
	// Ajax通信失敗時処理
	function error11(XMLHttpRequest, textStatus, errorThrown) {
		console.log("error:" + XMLHttpRequest);
		console.log("status:" + textStatus);
		console.log("errorThrown:" + errorThrown);
		target = document.getElementById("outputconfigerror2");
		var res = $.parseJSON(XMLHttpRequest.responseText);
		target.innerText = res.message;
	    target11 = document.getElementById("outputconfigsuccess2");
	    target11.innerHTML = "";

	}


	//  パスワード変更の実行
		function changepassword(){
			    
			    var data = {userId : userId, nickname : userNickname, mailAddress : mailaddress, password : newpassword.value};

			        $.ajax({
			            type        : "POST",
			            url         : "http://localhost:8080/unitter/password/"+userId,
						data        : JSON.stringify(data),
			            minTimeout  : 1000,
			            multiplier  : 1,
			            contentType : 'application/JSON',
			            success     : function(data) {
										passwordupdatesuccess();
			                          },
			            error       : function(XMLHttpRequest, textStatus, errorThrown) {
			                            error6(XMLHttpRequest, textStatus, errorThrown);
			                          }
			        });
			}

			 
			// Ajax通信成功時処理
			function passwordupdatesuccess() {
				console.log("passwordupdate:success");
				target2 = document.getElementById("outputconfigerror2");
			    target2.innerHTML = "";
			    target11 = document.getElementById("outputconfigsuccess2");
			    target11.innerHTML = "変更を保存しました";
			}
			 
			// Ajax通信失敗時処理
			function error6(XMLHttpRequest, textStatus, errorThrown) {
				console.log("error:" + XMLHttpRequest);
				console.log("status:" + textStatus);
				console.log("errorThrown:" + errorThrown);

			}


			//  プロフィール更新の実行
			$(document).on('click', 'button[id^=profileupdate]', function(){

				    
				    var data = {userId : userId, nickname : profilenickname.value, mailAddress : mailaddress, password : password, selfIntroduction : profileselfIntroduction.value};

				        $.ajax({
				            type        : "POST",
				            url         : "http://localhost:8080/unitter/profile/"+userId,
							data        : JSON.stringify(data),
				            minTimeout  : 1000,
				            multiplier  : 1,
				            contentType : 'application/JSON',
				            success     : function(data) {
											profileupdatesuccess();
					                        upload2(data);

				                          },
				            error       : function(XMLHttpRequest, textStatus, errorThrown) {
				                            error7(XMLHttpRequest, textStatus, errorThrown);
				                          }
				        });
				});

				 
				// Ajax通信成功時処理
				function profileupdatesuccess() {
					console.log("profileupdate:success");
				    target1 = document.getElementById("nick");
				    target1.innerHTML = profilenickname.value;
				    target2 = document.getElementById("self");
				    target2.innerHTML = profileselfIntroduction.value;
				    target11 = document.getElementById("outputconfigsuccess3");
				    target11.innerHTML = "変更を保存しました";
					target12 = document.getElementById("outputconfigerror3");
				    target12.innerHTML = "";
				}
				 
				// Ajax通信失敗時処理
				function error7(XMLHttpRequest, textStatus, errorThrown) {
					console.log("error:" + XMLHttpRequest);
					console.log("status:" + textStatus);
					console.log("errorThrown:" + errorThrown);
					target = document.getElementById("outputconfigerror3");
					var res = $.parseJSON(XMLHttpRequest.responseText);
					target.innerText = res.details[0].message;
				    target11 = document.getElementById("outputconfigsuccess3");
				    target11.innerHTML = "";

				}

				function upload2(data){
					var ajaxUrl = "unitter/profileimage/" + userId;
					//ファイル種類


					if(window.FormData){
						var form = $('#data_upload_form2').get()[0];
					    var formData = new FormData(form);

					 $.ajax({
					     type : "POST",                  // HTTP通信の種類
					     url  : ajaxUrl,                 // リクエストを送信する先のURL
					     dataType : "text",              // サーバーから返されるデータの型
					     data : formData,                // サーバーに送信するデータ
					     processData : false,
					     contentType: false,
					 }).done(function(data) {        // Ajax通信が成功した時の処理
						 console.log("アップロードが完了しました。");
					     target = document.getElementById("upload_file2");
					     target.value = "";
					     upload3(data);


					 }).fail(function(XMLHttpRequest, textStatus, errorThrown) { // Ajax通信が失敗した時の処理
						 var res = $.parseJSON(XMLHttpRequest.responseText);
						 alert("プロフィール画像の" + res.message);
						 console.log("アップロードが失敗しました。");
						 console.log(XMLHttpRequest.status);
						 console.log(errorThrown.message);
					 });
					}else{
						console.log("アップロードに対応できていないブラウザです。");
					}

				}
				function upload3(data){
					var ajaxUrl = "unitter/headderimage/" + userId;
					//ファイル種類


					if(window.FormData){
						var form = $('#data_upload_form3').get()[0];
					    var formData = new FormData(form);

					 $.ajax({
					     type : "POST",                  // HTTP通信の種類
					     url  : ajaxUrl,                 // リクエストを送信する先のURL
					     dataType : "text",              // サーバーから返されるデータの型
					     data : formData,                // サーバーに送信するデータ
					     processData : false,
					     contentType: false,
					 }).done(function(data) {        // Ajax通信が成功した時の処理
						 console.log("アップロードが完了しました。");
					     target = document.getElementById("upload_file3");
					     target.value = "";


					 }).fail(function(XMLHttpRequest, textStatus, errorThrown) { // Ajax通信が失敗した時の処理
						 var res = $.parseJSON(XMLHttpRequest.responseText);
						 alert("ヘッダー画像の" + res.message);
						 console.log("アップロードが失敗しました。");
						 console.log(XMLHttpRequest.status);
						 console.log(errorThrown.message);
					 });
					}else{
						console.log("アップロードに対応できていないブラウザです。");
					}

				}


	//  エラーメッセージのクリア
		 $(document).on('click', 'li[id^=p]', function(){
		  target1 = document.getElementById("outputconfigsuccess1");
		  target2 = document.getElementById("outputconfigsuccess2");
		  target3 = document.getElementById("outputconfigsuccess3");
		  target11 = document.getElementById("outputconfigerror1");
		  target21 = document.getElementById("outputconfigerror2");
		  target31 = document.getElementById("outputconfigerror3");
		     target1.innerHTML = "";
		     target2.innerHTML = "";
		     target3.innerHTML = "";
		     target11.innerHTML = "";
		     target21.innerHTML = "";
		     target31.innerHTML = "";

		 });


//  プロフィールへの遷移
	$(document).on('click', 'div[id^=tweetuser]', function(){
		var tweetuserId = this.id.slice(10);
		profile(tweetuserId);
	});


//  プロフィールへの遷移
	$(document).on('click', 'div[id^=popovertweetuser]', function(){
		var tweetuserId = this.id.slice(17);
		profile(tweetuserId);
	});



	// Ajax通信成功時処理
	function profileDisplaySuccess(data) {
		 $("#followlist").empty();
		 $("#followerlist").empty();
		 target4 = document.getElementById("profile_follow");
		  target4.innerHTML = data.follow.length;
		  target5 = document.getElementById("profile_follower");
		  target5.innerHTML = data.follower.length;
		for(var i=0; data.follow.length > i; i++){
			 $("#followlist").append('<div class="col-xs-4"><div class="thumbnail"><img src="photo/'+data.follow[i].headderImage+'" style="width:100%;height:80px;"></img><div class="caption"><img src="photo/'+data.follow[i].profileImage+'" style="width:60px;height:60px;position: absolute;left:25px;top:60px;" class="img-rounded"></img><button class="btn btn-primary pull-right" id="profilefollow'+data.follow[i].userId+'"  style="display:none">フォローする</button><button class="btn btn-primary pull-right" id="profilefollow'+data.follow[i].userId+'Release">フォロー解除</button><div style="padding-top:40px;"><div style="font-size:14px;">'+data.follow[i].nickname+'</div><div style="font-size:10px;">@'+data.follow[i].userId+'</div><div style="font-size:10px;padding-top:10px;">'+data.follow[i].selfIntroduction+'</div></div></div></div></div>');
			 if(userId == data.follow[i].userId){
			    	document.getElementById("profilefollow"+data.follow[i].userId).style.display = "none";
			    	document.getElementById("profilefollow"+data.follow[i].userId+"Release").style.display = "none";
			    	document.getElementById("timelinefollow"+data.follow[i].userId).style.display = "none";
			        document.getElementById("timelinefollow"+data.follow[i].userId+"Release").style.display = "none";
			    }
		}
		for(var i=0; data.follower.length > i; i++){
			if(data.follower[i].followFlg == true){
				 $("#followerlist").append('<div class="col-xs-4"><div class="thumbnail"><img src="photo/'+data.follower[i].headderImage+'" style="width:100%;height:80px;"></img><div class="caption"><img src="photo/'+data.follower[i].profileImage+'" style="width:60px;height:60px;position: absolute;left:25px;top:60px;" class="img-rounded"></img><button class="btn btn-primary pull-right" id="profilefollow'+data.follower[i].userId+'" style="display:none">フォローする</button><button class="btn btn-primary pull-right" id="profilefollow'+data.follower[i].userId+'Release">フォロー解除</button><div style="padding-top:40px;"><div style="font-size:14px;">'+data.follower[i].nickname+'</div><div style="font-size:10px;">@'+data.follower[i].userId+'</div><div style="font-size:10px;padding-top:10px;">'+data.follower[i].selfIntroduction+'</div></div></div></div></div>');
			}else{
				 $("#followerlist").append('<div class="col-xs-4"><div class="thumbnail"><img src="photo/'+data.follower[i].headderImage+'" style="width:100%;height:80px;"></img><div class="caption"><img src="photo/'+data.follower[i].profileImage+'" style="width:60px;height:60px;position: absolute;left:25px;top:60px;" class="img-rounded"></img><button class="btn btn-primary pull-right" id="profilefollow'+data.follower[i].userId+'">フォローする</button><button class="btn btn-primary pull-right" id="profilefollow'+data.follower[i].userId+'Release" style="display:none">フォロー解除</button><div style="padding-top:40px;"><div style="font-size:14px;">'+data.follower[i].nickname+'</div><div style="font-size:10px;">@'+data.follower[i].userId+'</div><div style="font-size:10px;padding-top:10px;">'+data.follower[i].selfIntroduction+'</div></div></div></div></div>');
			}
			 if(userId == data.follower[i].userId){
			    	document.getElementById("profilefollow"+data.follower[i].userId).style.display = "none";
			    	document.getElementById("profilefollow"+data.follower[i].userId+"Release").style.display = "none";
			    }
		}


	}


	// Ajax通信成功時処理
	function profileTimelineSuccess(data) {
		target1 = document.getElementById("profile_tweet");
		target1.innerHTML = data.length;

		 $("#tweetlist").empty();

		var today = new Date();

		for(var i=data.length-1; i >= 0; i--){
			var width  = 0;
			var height = 80;

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

			var retweetColor = new Array(data.length);
			var favoriteColor = new Array(data.length);

			if(data[i].retweetFlg == true){
				retweetColor[i] = "#4169E1";
			}else{
				retweetColor[i] = "#C0C0C0";
			}
			if(data[i].favoriteFlg == true){
				favoriteColor[i] = "#FF1493";
			}else{
				favoriteColor[i] = "#C0C0C0";
			}

			if(data[i].otherId == userId){
		    	if(data[i].tweet.length > 75 && data[i].tweetImage.length != 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		    		height = height + 400;
		        	 $("#tweetlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="profile-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#profile-delete'+data[i].tweetId+'"></span></div></div></li>');
		        	 $("#tweetlist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length <= 75 && data[i].tweetImage.length != 0){
		    		height = height + 400;
		        	 $("#tweetlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="profile-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#profile-delete'+data[i].tweetId+'"></span></div></div></li>');
		        	 $("#tweetlist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length > 75 && data[i].tweetImage.length == 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		       	 	 $("#tweetlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="profile-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#profile-delete'+data[i].tweetId+'"></span></div></div></div></li>');
		       	 	 $("#tweetlist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else{
		    		 $("#tweetlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" style="color: '+favoriteColor[i]+';" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="profile-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#profile-delete'+data[i].tweetId+'"></span></div></div></div></li>');
		       	 	 $("#tweetlist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}
			}else{
				if(data[i].tweet.length > 75 && data[i].tweetImage.length != 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		    		height = height + 400;
		        	 $("#tweetlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		        	 $("#tweetlist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length <= 75 && data[i].tweetImage.length != 0){
		    		height = height + 400;
		        	 $("#tweetlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		        	 $("#tweetlist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length > 75 && data[i].tweetImage.length == 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		       	 	 $("#tweetlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		       	 	 $("#tweetlist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/castle-02.jpg" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else{
		    		 $("#tweetlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		       	 	 $("#tweetlist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/castle-02.jpg" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}
			}

    	 	$("#tweetlist").append('<input type="hidden" id=nickname_'+data[i].otherId+' value="'+data[i].profile.nickname+'"></div>');
     	 	$("#tweetlist").append('<input type="hidden" id=follow_'+data[i].otherId+' value="'+data[i].profile.follow.length+'"></div>');
      	 	$("#tweetlist").append('<input type="hidden" id=follower_'+data[i].otherId+' value="'+data[i].profile.follower.length+'"></div>');
      	 	$("#tweetlist").append('<input type="hidden" id=favorite_'+data[i].otherId+' value="'+data[i].profile.favorite.length+'"></div>');
      	 	$("#tweetlist").append('<input type="hidden" id=profileImage_'+data[i].otherId+' value="'+data[i].profile.profileImage+'"></div>');
      	 	$("#tweetlist").append('<input type="hidden" id=headderImage_'+data[i].otherId+' value="'+data[i].profile.headderImage+'"></div>');
      	 	$("#tweetlist").append('<input type="hidden" id=selfIntroduction_'+data[i].otherId+' value="'+data[i].profile.selfIntroduction+'"></div>');
      	 	$("#tweetlist").append('<input type="hidden" id=followFlg_'+data[i].otherId+' value="'+data[i].profile.followFlg+'"></div>');

       	    $("#tweetlist").append('<div class="modal fade" id="profile-delete'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content" style="height:120px;"><div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button><h4 class="modal-title" style="text-align:center;">このツイートを本当に削除しますか？</h4></div><div class="modal-body" style="padding-top:50px;"><div class="col-xs-7"></div><div class="col-xs-5"><button class="btn btn-primary" data-dismiss="modal">キャンセル</button><button id="profile-deletecheck'+data[i].tweetId+'" class="btn btn-primary" data-dismiss="modal">ツイート削除</button></div></div></div></div></div>');

		}
	}
	// Ajax通信成功時処理
	function profileFavoriteSuccess(data) {
		target1 = document.getElementById("profile_favorite");
		target1.innerHTML = data.length;

		 $("#favoritelist").empty();

		for(var i=data.length-1; i >= 0; i--){
			var width  = 0;
			var height = 80;

			var elapsed = elapsedTime(data[i].tweetTimestamp);

			var retweetColor = new Array(data.length);
			var favoriteColor = new Array(data.length);

			if(data[i].retweetFlg == true){
				retweetColor[i] = "#4169E1";
			}else{
				retweetColor[i] = "#C0C0C0";
			}
			if(data[i].favoriteFlg == true){
				favoriteColor[i] = "#FF1493";
			}else{
				favoriteColor[i] = "#C0C0C0";
			}

			if(data[i].otherId == userId){
		    	if(data[i].tweet.length > 75 && data[i].tweetImage.length != 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		    		height = height + 400;
		        	 $("#favoritelist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="profile2-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#profile2-delete'+data[i].tweetId+'"></span></div></div></li>');
		        	 $("#favoritelist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length <= 75 && data[i].tweetImage.length != 0){
		    		height = height + 400;
		        	 $("#favoritelist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="profile2-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#profile2-delete'+data[i].tweetId+'"></span></div></div></li>');
		        	 $("#favoritelist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length > 75 && data[i].tweetImage.length == 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		       	 	 $("#favoritelist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="profile2-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#profile2-delete'+data[i].tweetId+'"></span></div></div></div></li>');
		       	 	 $("#favoritelist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else{
		    		 $("#favoritelist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" style="color: '+favoriteColor[i]+';" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="profile2-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#profile2-delete'+data[i].tweetId+'"></span></div></div></div></li>');
		       	 	 $("#favoritelist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}
			}else{
				if(data[i].tweet.length > 75 && data[i].tweetImage.length != 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		    		height = height + 400;
		        	 $("#favoritelist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		        	 $("#favoritelist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length <= 75 && data[i].tweetImage.length != 0){
		    		height = height + 400;
		        	 $("#favoritelist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		        	 $("#favoritelist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length > 75 && data[i].tweetImage.length == 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		       	 	 $("#favoritelist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		       	 	 $("#favoritelist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/castle-02.jpg" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else{
		    		 $("#favoritelist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#profile-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		       	 	 $("#favoritelist").append('<div class="modal fade" id="profile-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/castle-02.jpg" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}
			}

    	 	$("#favoritelist").append('<input type="hidden" id=nickname_'+data[i].otherId+' value="'+data[i].profile.nickname+'"></div>');
     	 	$("#favoritelist").append('<input type="hidden" id=follow_'+data[i].otherId+' value="'+data[i].profile.follow.length+'"></div>');
      	 	$("#favoritelist").append('<input type="hidden" id=follower_'+data[i].otherId+' value="'+data[i].profile.follower.length+'"></div>');
      	 	$("#favoritelist").append('<input type="hidden" id=favorite_'+data[i].otherId+' value="'+data[i].profile.favorite.length+'"></div>');
      	 	$("#favoritelist").append('<input type="hidden" id=profileImage_'+data[i].otherId+' value="'+data[i].profile.profileImage+'"></div>');
      	 	$("#favoritelist").append('<input type="hidden" id=headderImage_'+data[i].otherId+' value="'+data[i].profile.headderImage+'"></div>');
      	 	$("#favoritelist").append('<input type="hidden" id=selfIntroduction_'+data[i].otherId+' value="'+data[i].profile.selfIntroduction+'"></div>');
      	 	$("#favoritelist").append('<input type="hidden" id=followFlg_'+data[i].otherId+' value="'+data[i].profile.followFlg+'"></div>');

       	    $("#favoritelist").append('<div class="modal fade" id="profile2-delete'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content" style="height:120px;"><div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button><h4 class="modal-title" style="text-align:center;">このツイートを本当に削除しますか？</h4></div><div class="modal-body" style="padding-top:50px;"><div class="col-xs-7"></div><div class="col-xs-5"><button class="btn btn-primary" data-dismiss="modal">キャンセル</button><button id="profile-deletecheck'+data[i].tweetId+'" class="btn btn-primary" data-dismiss="modal">ツイート削除</button></div></div></div></div></div>');

		}
	}
//  プロフィールへの遷移
	$(document).on('click', 'div[id^=popuptweetuser]', function(){
		var tweetuserId = this.id.slice(15);
		profile(tweetuserId);
	});


	//フォローの実行(プロフィールのフォローボタンから)
	$(document).on('click', 'button[id^=followbox]', function(){

		if(this.id == "followbox"){
	    	document.getElementById("followbox").style.display = "none";
	    	document.getElementById("followboxRelease").style.display = "block";
		}else{
	    	document.getElementById("followbox").style.display = "block";
	    	document.getElementById("followboxRelease").style.display = "none";
		}
		target1 = document.getElementById("profile_userid");

		follow(target1.innerHTML.slice(1));

	});

	 //フォローの実行(ツイート詳細ポップアップから)
	 $(document).on('click', 'button[id^=tweetfollow]', function(){

	  if(this.id.indexOf("Release") != -1){
	      document.getElementById(this.id).style.display = "none";
	      document.getElementById(this.id.replace("Release", "")).style.display = "block";
	  }else{
	      document.getElementById(this.id).style.display = "none";
	      document.getElementById(this.id+"Release").style.display = "block";
	  }
	  var id = this.id.replace("Release", "");
	  id = id.slice(11);

	  follow(id);

	 });

	//フォローの実行(タイムラインから)
	 $(document).on('click', 'button[id^=timelinefollow]', function(){

	  if(this.id.indexOf("Release") != -1){
	      document.getElementById(this.id).style.display = "none";
	      document.getElementById(this.id.replace("Release", "")).style.display = "block";
	  }else{
	      document.getElementById(this.id).style.display = "none";
	      document.getElementById(this.id+"Release").style.display = "block";
	  }
	  var id = this.id.replace("Release", "");
	  id = id.slice(14);

	  follow(id);

	 });

	//フォローの実行(プロフィールカードから)
	$(document).on('click', 'button[id^=profilefollow]', function(){

		if(this.id.indexOf("Release") != -1){
	    	document.getElementById(this.id).style.display = "none";
	    	document.getElementById(this.id.replace("Release", "")).style.display = "block";
		}else{
	    	document.getElementById(this.id).style.display = "none";
	    	document.getElementById(this.id+"Release").style.display = "block";
		}
		var id = this.id.replace("Release", "");
		id = id.slice(13);

		follow(id);

	});

	//リツイートの実行
	$(document).on('click', 'span[id^=retweet]', function(){

		id = this.id;
		id = id.slice(7);
		// 要素規定の動作をキャンセルする
		 
		      $.ajax({
			            type        : "GET",
			            url         : "http://localhost:8080/unitter/retweet/"+userId+"/"+id,
						minTimeout  : 1000,
						multiplier  : 1,
			            success     : function(data) {
			                           console.log("retweetsuccess");
			                        },
			            error       : function(XMLHttpRequest, textStatus, errorThrown) {
			                            error(XMLHttpRequest, textStatus, errorThrown);
			                        }
			        });

	});

	//お気に入りの実行
	$(document).on('click', 'span[id^=favorite]', function(){

		id = this.id;
		id = id.slice(8);
		// 要素規定の動作をキャンセルする
		 
		      $.ajax({
			            type        : "GET",
			            url         : "http://localhost:8080/unitter/favorite/"+userId+"/"+id,
						minTimeout  : 1000,
						multiplier  : 1,
			            success     : function(data) {
			                           console.log("favoritesuccess");
			                        },
			            error       : function(XMLHttpRequest, textStatus, errorThrown) {
			                            error(XMLHttpRequest, textStatus, errorThrown);
			                        }
			        });

	});


	$(document).on('click', '#searchbox', function(){
		     
		     var data = {userName : search.value, tweet : search.value};

		         $.ajax({
		             type        : "GET",
		             url         : 'http://localhost:8080/unitter/search/0',
		             data        : data,
		             minTimeout  : 1000,
		             multiplier  : 1,
		             contentType : 'application/JSON',
		             success     : function(data) {
			                        searchSuccess(data);
									document.getElementById("searchResult").click();
		                           },
		             error       : function(XMLHttpRequest, textStatus, errorThrown) {
		                             console.log("error");
		                           }
		         });
	});

	// Ajax通信成功時処理
	function searchSuccess(data) {
		 $("#searchlist").empty();

		for(var i=data.length-1; i >= 0; i--){
			var width  = 0;
			var height = 80;

			var elapsed = elapsedTime(data[i].tweetTimestamp);

			var retweetColor = new Array(data.length);
			var favoriteColor = new Array(data.length);

			if(data[i].retweetFlg == true){
				retweetColor[i] = "#4169E1";
			}else{
				retweetColor[i] = "#C0C0C0";
			}
			if(data[i].favoriteFlg == true){
				favoriteColor[i] = "#FF1493";
			}else{
				favoriteColor[i] = "#C0C0C0";
			}

			if(data[i].otherId == userId){
		    	if(data[i].tweet.length > 75 && data[i].tweetImage.length != 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		    		height = height + 400;
		        	 $("#searchlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#search-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="search-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#search-delete'+data[i].tweetId+'"></span></div></div></li>');
		        	 $("#searchlist").append('<div class="modal fade" id="search-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length <= 75 && data[i].tweetImage.length != 0){
		    		height = height + 400;
		        	 $("#searchlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#search-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="search-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#search-delete'+data[i].tweetId+'"></span></div></div></li>');
		        	 $("#searchlist").append('<div class="modal fade" id="search-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length > 75 && data[i].tweetImage.length == 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		       	 	 $("#searchlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#search-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="search-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#search-delete'+data[i].tweetId+'"></span></div></div></div></li>');
		       	 	 $("#searchlist").append('<div class="modal fade" id="search-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else{
		    		 $("#searchlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#search-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" style="color: '+favoriteColor[i]+';" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" id="search-tweetdelete'+data[i].tweetId+'" name="tweetdelete" class="glyphicon glyphicon-trash" value="'+data[i].tweetId+'" data-toggle="modal" data-target="#search-delete'+data[i].tweetId+'"></span></div></div></div></li>');
		       	 	 $("#searchlist").append('<div class="modal fade" id="search-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}
			}else{
				if(data[i].tweet.length > 75 && data[i].tweetImage.length != 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		    		height = height + 400;
		        	 $("#searchlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#search-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		        	 $("#searchlist").append('<div class="modal fade" id="search-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length <= 75 && data[i].tweetImage.length != 0){
		    		height = height + 400;
		        	 $("#searchlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#search-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;" charset="UTF-8"></img></div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		        	 $("#searchlist").append('<div class="modal fade" id="search-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div name="list-body-img" style="padding-top:60px;"><div class="col-xs-1"></div><div class="col-xs-11"><img src="/photo/'+data[i].tweetImage+'" style="width:100%;"></img></div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else if(data[i].tweet.length > 75 && data[i].tweetImage.length == 0){
		    		var tweet = data[i].tweet.substring(0,70) +"……";
		       	 	 $("#searchlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#search-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		       	 	 $("#searchlist").append('<div class="modal fade" id="search-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/castle-02.jpg" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}else{
		    		 $("#searchlist").append('<li class="list-group-item" style="height:'+height+'px;overflow:hidden;"><div name="list-header"><div class="col-xs-1"><img src="photo/'+data[i].profile.profileImage+'" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;"><div id="tweet1" style="display:inline" class="list-group-item-text">'+data[i].otherNickname+'</div><div style="display:inline" class="list-group-item-text">　@</div><div id="tweetuser_'+data[i].otherId+'" style="display:inline" class="list-group-item-text">'+data[i].otherId+'</div><div style="display:inline" class="list-group-item-text">　</div><div id="tweet3" style="display:inline" class="list-group-item-text">'+elapsed+'</div></div></div></div><div name="modal" data-toggle="modal" data-target="#search-tweet-detail'+data[i].tweetId+'"><div name="list-body" style="padding-top:25px;"><div class="col-xs-1"></div><div class="col-xs-11"><div id="tweet4" class="list-group-item-text">'+data[i].tweet+'</div></div></div></div><div name="list-footer" style="position: absolute;bottom:0;left:30%;"><div class="col-xs-1"></div><div class="col-xs-11"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" id="favorite'+data[i].tweetId+'" style="color: '+favoriteColor[i]+';"></span>:'+data[i].favorite.length+'</div></div></div></li>');
		       	 	 $("#searchlist").append('<div class="modal fade" id="search-tweet-detail'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><div class="col-xs-1"><img src="photo/castle-02.jpg" style="width:60px;position: absolute;left:-10px;" class="img-rounded"></img></div><div class="col-xs-11"><div style="position: absolute;left:10px;" style="display:inline;">'+data[i].otherNickname+'<div id="popuptweetuser_'+data[i].otherId+'" style="display:inline" data-dismiss="modal">　　　@'+data[i].otherId+'</div></div></div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button></div><div class="modal-body"><br></br><br></br><div style="font-size:24px;">'+data[i].tweet+'</div></div><div class="modal-footer"><div style="display:inline"><span class="glyphicon glyphicon-repeat" id="retweet'+data[i].tweetId+'" style="color: '+retweetColor[i]+';"></span>:'+data[i].retweet.length+'</div><div style="display:inline">　　　　　</div><div style="display:inline"><span type="button" class="glyphicon glyphicon-heart" style="color: '+favoriteColor[i]+';" id="favorite'+data[i].tweetId+'"></span>:'+data[i].favorite.length+'</div></div></div></div></div>');
		    	}
			}

    	 	$("#searchlist").append('<input type="hidden" id=nickname_'+data[i].otherId+' value="'+data[i].profile.nickname+'"></div>');
     	 	$("#searchlist").append('<input type="hidden" id=follow_'+data[i].otherId+' value="'+data[i].profile.follow.length+'"></div>');
      	 	$("#searchlist").append('<input type="hidden" id=follower_'+data[i].otherId+' value="'+data[i].profile.follower.length+'"></div>');
      	 	$("#searchlist").append('<input type="hidden" id=favorite_'+data[i].otherId+' value="'+data[i].profile.favorite.length+'"></div>');
      	 	$("#searchlist").append('<input type="hidden" id=profileImage_'+data[i].otherId+' value="'+data[i].profile.profileImage+'"></div>');
      	 	$("#searchlist").append('<input type="hidden" id=headderImage_'+data[i].otherId+' value="'+data[i].profile.headderImage+'"></div>');
      	 	$("#searchlist").append('<input type="hidden" id=selfIntroduction_'+data[i].otherId+' value="'+data[i].profile.selfIntroduction+'"></div>');
      	 	$("#searchlist").append('<input type="hidden" id=followFlg_'+data[i].otherId+' value="'+data[i].profile.followFlg+'"></div>');

       	    $("#searchlist").append('<div class="modal fade" id="search-delete'+data[i].tweetId+'"><div class="modal-dialog"><div class="modal-content" style="height:120px;"><div><button class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">閉じる</span></button><h4 class="modal-title" style="text-align:center;">このツイートを本当に削除しますか？</h4></div><div class="modal-body" style="padding-top:50px;"><div class="col-xs-7"></div><div class="col-xs-5"><button class="btn btn-primary" data-dismiss="modal">キャンセル</button><button id="profile-deletecheck'+data[i].tweetId+'" class="btn btn-primary" data-dismiss="modal">ツイート削除</button></div></div></div></div></div>');

		}
	}


// 現在時刻との差を出す
function elapsedTime(tweetdate){

	var today = new Date();
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
	return elapsed;
}


// フォローの実行
function follow(id){
	 
	      $.ajax({
		            type        : "GET",
		            url         : "http://localhost:8080/unitter/follow/"+userId+"/"+id,
					minTimeout  : 1000,
					multiplier  : 1,
		            success     : function(data) {
		                           console.log("followsuccess");
		                        },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
		                            error(XMLHttpRequest, textStatus, errorThrown);
		                        }
		        });

};

//プロフィールへの遷移
function profile(tweetuserId){
	var nickname = document.getElementById("nickname_"+tweetuserId).value;
	var follow = document.getElementById("follow_"+tweetuserId).value;
	var follower = document.getElementById("follower_"+tweetuserId).value;
	var favorite = document.getElementById("favorite_"+tweetuserId).value;
	var profileImage = document.getElementById("profileImage_"+tweetuserId).value;
	var headderImage = document.getElementById("headderImage_"+tweetuserId).value;
	var self = document.getElementById("selfIntroduction_"+tweetuserId).value;
	var followFlg = document.getElementById("followFlg_"+tweetuserId).value;

	target1 = document.getElementById("profile_userid");
    target1.innerHTML = "@"+tweetuserId;
	target2 = document.getElementById("profile_nickname");
    target2.innerHTML = nickname;
	target3 = document.getElementById("profile_selfIntoroduction");
    target3.innerHTML = self;
	target4 = document.getElementById("profile_follow");
    target4.innerHTML = follow;
	target5 = document.getElementById("profile_follower");
    target5.innerHTML = follower;
	target6 = document.getElementById("profile_favorite");
    target6.innerHTML = favorite;
	 $("#headderImg").empty();
	 $("#headderImg").append('<img src="photo/'+headderImage+'" style="width:100%;height:200px;"></img>');
	 $("#profileImg").empty();
	 $("#profileImg").append('<img src="photo/'+profileImage+'" style="width:200px;height:200px;position:absolute;left:10%;top:120px;"></img>');


    document.getElementById("pro").click();

    if(userId == tweetuserId){
    	document.getElementById("followbox").style.display = "none";
    	document.getElementById("followboxRelease").style.display = "none";
    }else if(followFlg == "true"){
    	document.getElementById("followbox").style.display = "none";
    	document.getElementById("followboxRelease").style.display = "block";
    }else{
    	document.getElementById("followbox").style.display = "block";
    	document.getElementById("followboxRelease").style.display = "none";
    }

	     $.PeriodicalUpdater('./unitter/demo',{
		               url         : "http://localhost:8080/profile/profile/"+userId+"/"+tweetuserId,
		      minTimeout  : 1000,
		            method      : "GET",
		      sendData    : end,
		      maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
		      multiplier  : 1,
		               type        : "json",
		               success     : function(data) {
		                               profiledisplay(data);
		                           },
		               error       : function(XMLHttpRequest, textStatus, errorThrown) {
		                                error(XMLHttpRequest, textStatus, errorThrown);
		                            }
		           });
	        $.PeriodicalUpdater('./unitter/demo',{
		            url         : "http://localhost:8080/profile/tweet/"+tweetuserId,
					minTimeout  : 1000,
			        method      : "GET",
					sendData    : end,
					maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
					multiplier  : 1,
		            type        : "json",
		            success     : function(data) {
		                            profileTimelineSuccess(data);
		                        },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
			                            error(XMLHttpRequest, textStatus, errorThrown);
			                        }
		        });
	        $.PeriodicalUpdater('./unitter/demo',{
		            url         : "http://localhost:8080/profile/favorite/"+tweetuserId,
					minTimeout  : 1000,
			        method      : "GET",
					sendData    : end,
					maxTimeout  : 100000000,         // 最長のリクエスト間隔(ミリ秒)
					multiplier  : 1,
		            type        : "json",
		            success     : function(data) {
		                            profileFavoriteSuccess(data);
		                        },
		            error       : function(XMLHttpRequest, textStatus, errorThrown) {
			                            error(XMLHttpRequest, textStatus, errorThrown);
			                        }
		        });
};


function timelinereserve(data) {

}