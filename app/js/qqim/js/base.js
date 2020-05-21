//IE9(含)以下浏览器用到的jsonp回调函数
var continueAnswer=true;

function jsonpCallback(rspData) {
    //设置接口返回的数据
    webim.setJsonpLastRspData(rspData);
}

function initHistoryMsg(msglist,flag)
{
    if(flag==true)
    {
        for (var i = 0; i<= msglist.length - 1; i++) { //遍历消息，按照时间从后往前
            var msg = JSON.parse(msglist[i]);
            //console.warn(msg);
            webim.Log.warn('receive a new avchatroom group msg: ' + msg.fromAccountNick);
            //显示收到的消息 不显示：{"CMD":"RecommendProduct","product":"xxxx"}
            if(JSON.stringify(msg).search(/.*CMD.*product.*/i) > -1){
                continue;
            }
            //显示超链接
            if(msg.elems[0].content.text){
                msg.elems[0].content.text = msg.elems[0].content.text.replace(/((http:\/\/|https:\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/gi,"<a href='$1'>$1</a>");
            }
            showHistoryBeforeMsg(msg);
        }
        $("#chat-list-div").animate({
            scrollTop:2
        });
        ismousewheel = true;
    }
    else {
        for (var i = msglist.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
            var msg = JSON.parse(msglist[i]);
            //console.warn(msg);
            webim.Log.warn('receive a new avchatroom group msg: ' + msg.fromAccountNick);
            //显示收到的消息 不显示：{"CMD":"RecommendProduct","product":"xxxx"}
            if(JSON.stringify(msg).search(/.*CMD.*product.*/i) > -1){
                continue;
            }
            //显示超链接
            if(msg.elems[0].content.text){
                msg.elems[0].content.text = msg.elems[0].content.text.replace(/((http:\/\/|https:\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/gi,"<a href='$1'>$1</a>");
            }
            showHistoryMsg(msg);
        }

    }
}
//监听大群新消息（普通，点赞，提示，红包）

function onBigGroupMsgNotify(msgList) {
    for (var i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
        var msg = msgList[i];
        //console.warn(msg);
        webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
        //显示收到的消息
        if(msg.getSubType() == webim.GROUP_MSG_SUB_TYPE.TIP)
        {
            continue;
        }
        //过滤CMD
        /*if(JSON.stringify(msg).search(/.*CMD.*product.*!/i) > -1)
        {
            continue;
        }*/
        //显示超链接  (https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]
        /*if(msg.elems[0].content.text){
            msg.elems[0].content.text = msg.elems[0].content.text.replace(/((http:\/\/|https:\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/gi,"<a href='$1' target='_blank'>$1</a>");
        }*/
        // imMsgTopFlag = false;
       
        console.log(msg);
        if(msg.elems[0].type == 'TIMCustomElem'){
            showOptions(msg);
        }else{
            $.ajax({
                type: "get",
                url: getnickname,
                data: {fromAccount:msg.fromAccount},
                dataType: "json",
                async: false,
                success: function(e) {
                    // console.log(e);
                    if(e.state == 0){
                        msg.fromAccountNick = e.nickName;
                    }
                }
            });
            showMsg(msg);
        }
       
    }
}
//直播答题
function showOptions(msg) {
    //ul = document.getElementById("video_sms_list");
    //var type = msg.getElems().getType();
    var elems = msg.getElems();
    var type = elems[0].getType(); //获取元素类型
    var content = elems[0].getContent(); //获取元素对象
    var option = convertCustomMsgToHtml(content);
    var data = content.getData();
    var desc = content.getDesc();
    var ext = content.getExt();
    if(ext == 'ANSWER'){
        $('#errorenter').on('click',function(){
            $('#errorAnswer').css('display','none');
            $('#Interactive').css('display','none');
            $('#close').trigger('click');
        });
        $('#correctenter').click(function(){
            $('#correctAnswer').css('display','none');
            $('#Interactive').css('display','none');
            $('#close').trigger('click');
        })
        console.log(data);
        console.log(desc);
        console.log(JSON.parse(desc));
        var question=questionData[JSON.parse(desc).questionNumber];
        var numberTitle=JSON.parse(desc).questionNumber+1;
        console.log(question);
        var postData;
        var questionTitle=question.q_title;
        $('.question span').html(questionTitle);
        $('.countdown').html(10);
        $('.number').html(numberTitle);
        var str='';
        $('.answer').empty();
        for(var i=0;i<question.options.length;i++){
            str+=' <p class="answerOne"><i class="weixuanzhong"></i><span>'+question.options[i].o_desc+'</span></p>'
        }
        $('.answer').append(str);
        if(continueAnswer){
            $('.answer').on('click','.weixuanzhong',function(){
                $('.weixuanzhong').removeClass('xuanzhong');
                $(this).addClass('xuanzhong');
            })
        }else{
            $('.answer').off('click','.weixuanzhong');
            $('.answer').on('click','.weixuanzhong',function(){
                $('#errorMessage').html('您已经被淘汰可以继续观赛');
                $('#Interactive').css('display','block');
                $('#errorenter').off('click');
                $('#errorenter').click(function(){
                    $('#errorAnswer').css('display','none');
                });
            });
        }
        function closeWindow(e){ //关闭小窗
            $('#promoteProduct').css('display','none');
            document.getElementById('videoContainer').ontouchstart=null;
            e.preventDefault();
            document.getElementById('productUrl').style.display='none';
            document.getElementById('videoContainer').style.width="100%";
            document.getElementById('videoContainer').style.height="3.2rem";
            document.getElementById('videoContainer').style.position="absolute";
            document.getElementById('videoContainer').style.left="0";
            document.getElementById('videoContainer').style.top="0.98rem";
            document.getElementById('videoContainer').style.zIndex="999";
            document.getElementById('videoContainer').style.background=null;
            $('#videos').css({
                position:'static',
                width:'100%',
                height:'100%'
            })
            $('#dragMove').css('display','none');
            document.getElementById('videos').setAttribute('height','100%');
           // document.getElementById('promoteProduct').style.display='block';
            document.getElementById('videos').setAttribute('controls','');
            document.getElementById('close').style.display='none';
            $('#Interactive').css('display','none');
        }
        $('#close').css({
			display:'block',
			width:'59px',
			height:'59px',
			position:'absolute',
			left:'87px',
			top:'14px',
			background:'url(./img/moveBack.png) no-repeat center center',
			backgroundSize:'100% 100%'
		});
		$('#dragMove').css({
			display:'block',
			width:'59px',
			height:'59px',
			position:'absolute',
			left:'87px',
			bottom:'31px',
			background:'url(./img/movedrag.png) no-repeat center center',
			backgroundSize:'100% 100%'
			
		})
		$('#videoContainer').css({
			width:'232px',
			height:'288px',
			background:'url(./img/moveBG.png) ',
			backgroundPosition:'0 0',
			backgroundSize:'100% 100%',
			position:'absolute',
			left:'150px',
			top:'300px',
			zIndex:'9999'
		})
		// document.getElementById('videoContainer').style.width="232px";
		// document.getElementById('videoContainer').style.height="100px";
		// document.getElementById('videoContainer').style.backgroundColor="red";
		$('#videos').css({
			width:'205px',
			height:'134px',
			position:'absolute',
			left:'13px',
			top:'69px'
		})
		document.getElementById('videos').setAttribute('height','60%');
		//document.getElementById('videos').style.width="232px";
		//document.getElementById('videos').style.height="134px"
        // document.getElementById('videoContainer').style.position="absolute";
        // document.getElementById('videoContainer').style.left="200px";
        // document.getElementById('videoContainer').style.top="50px";
		// document.getElementById('videoContainer').style.zIndex="999";
        document.getElementById('videos').removeAttribute('controls');
        $('#close').bind('click',closeWindow);
        document.getElementById('dragMove').ontouchstart=function(e){
			document.body.ontouchmove=function(e){
				e.preventDefault();
			};
			$('#close').unbind('click',closeWindow);
            var vc=document.getElementById('videoContainer');
            var e=e || window.event;
            console.log(e);
            var vdX=e.touches[0].clientX-vc.offsetLeft;
            var vdY=e.touches[0].clientY-vc.offsetTop;
            console.log(vdX);
            console.log(vdY);
            document.ontouchmove=function(e){
               
                //console.log(e);
                var e=e||window.event;
                var left=e.touches[0].clientX-vdX;
				var top=e.touches[0].clientY-vdY;
				if(left<=0){
					vc.style.left=0;
				}else if(left>=document.documentElement.clientWidth-(vc.clientWidth)){
					vc.style.left=document.documentElement.clientWidth-(vc.clientWidth)+'px';
				}else{
					vc.style.left=left+'px';
				}
				if(top<=0){
					vc.style.top=0;
				}else if(top>=document.documentElement.clientHeight-(vc.clientHeight)){
					vc.style.top=document.documentElement.clientHeight-(vc.clientHeight)+'px';
				}else{
					vc.style.top=top+'px';
				} 
    
        	 }
            document.ontouchend=function(){
				document.ontouchmove=null;
				$('#close').bind('click',closeWindow);
			}
		}
		$('#Interactive').css('display','block');
		var countTimer=setInterval(function(){
			var countdown=$('.countdown').html();
			countdown--;
			$('.countdown').html(countdown);
			if(countdown==0){
				clearInterval(countTimer);
				var answer='';
				$('.weixuanzhong').each(function(i,ele){
					if($(ele).hasClass('xuanzhong')){
                        answer=$(ele).next().html();
                        var o_id=question.options[i].o_id;
                        postData={
                            c_id:JSON.parse(data).c_id,
                            t_id:JSON.parse(data).t_id,
                            q_id:JSON.parse(data).q_id,
                            o_id:o_id
                        }
					}
				})
				if(!answer){
                    if(continueAnswer){
                        continueAnswer=false;
                        $('#errorAnswer').css('display','block');
                        setTimeout(function(){
                            $('#errorAnswer').css('display','none');
                            $('#Interactive').css('display','none');
                            $('#close').trigger('click');
                        },4000);
                    }else{
                        $('#close').trigger('click');
                    }
				}else{
                    console.log(JSON.stringify(postData));
					$.ajax({
                        url:'http://livetapi.v114.com/appapi/question/sendanswer',
                        // contentType:"application/json;charset:utf-8",
                        type:'post',
						dataType:'json',
						data:JSON.stringify(postData),
						success:function(res){
                            console.log(res);
                            if(res.state.msg=="true"){
                                $('#correctAnswer').css('display','block');
                                setTimeout(function(){
                                    $('#correctAnswer').css('display','none');
                                    $('#Interactive').css('display','none');
                                    $('#close').trigger('click');
                                },4000);
                            }else{
                                continueAnswer=false;
                                $('#errorAnswer').css('display','block');
                                setTimeout(function(){
                                    $('#errorAnswer').css('display','none');
                                    $('#Interactive').css('display','none');
                                    $('#close').trigger('click');
                                },4000);
                            }
						},
						error:function(err){
							console.log(err);
						}
					})
				}
			
			}
        },1000);
       
    }
}

//监听新消息(私聊(包括普通消息、全员推送消息)，普通群(非直播聊天室)消息)事件
//newMsgList 为新消息数组，结构为[Msg]

function onMsgNotify(newMsgList) {
    var newMsg;
    for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];
        handlderMsg(newMsg); //处理新消息
    }
}

//处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）

function handlderMsg(msg) {
    var fromAccount, fromAccountNick, sessType, subType, contentHtml;

    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.getFromAccountNick();
    if (!fromAccountNick) {
        fromAccountNick = fromAccount;
    }

    //解析消息
    //获取会话类型
    //webim.SESSION_TYPE.GROUP-群聊，
    //webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();
    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();

    switch (sessType) {
        case webim.SESSION_TYPE.C2C: //私聊消息
            switch (subType) {
                case webim.C2C_MSG_SUB_TYPE.COMMON: //c2c普通消息
                    //业务可以根据发送者帐号fromAccount是否为app管理员帐号，来判断c2c消息是否为全员推送消息，还是普通好友消息
                    //或者业务在发送全员推送消息时，发送自定义类型(webim.MSG_ELEMENT_TYPE.CUSTOM,即TIMCustomElem)的消息，在里面增加一个字段来标识消息是否为推送消息
                    contentHtml = convertMsgtoHtml(msg);
                    webim.Log.warn('receive a new c2c msg: fromAccountNick=' + fromAccountNick + ", content=" + contentHtml);
                    //c2c消息一定要调用已读上报接口
                    var opts = {
                        'To_Account': fromAccount, //好友帐号
                        'LastedMsgTime': msg.getTime() //消息时间戳
                    };
                    webim.c2CMsgReaded(opts);
                    showTip('收到一条c2c消息(好友消息或者全员推送消息): 发送人=' + fromAccountNick + ", 内容=" + contentHtml);
                    break;
            }
            break;
        case webim.SESSION_TYPE.GROUP: //普通群消息，对于直播聊天室场景，不需要作处理
            break;
    }
}

//sdk登录

function sdkLogin() {
    //web sdk 登录
    webim.login(loginInfo, listeners, options,
        function() {
            //identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
            webim.Log.info('webim登录成功');
            applyJoinBigGroup(avChatRoomId); //加入大群
            hideDiscussForm(); //隐藏评论表单
            initEmotionUL(); //初始化表情
        },
        function(err) {
            console.log(err.ErrorInfo);
        }
    );
}

//进入大群

function applyJoinBigGroup(groupId) {
    var options = {
        'GroupId': groupId //群id
    };
    webim.applyJoinBigGroup(
        options,
        function(resp) {
            //JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
            if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
                webim.Log.info('进群成功');
                selToID = groupId;
            } else {
                showTip('进群失败');
            }
        },
        function(err) {
            showTip(err.ErrorInfo);
        }
    );
}
//显示历史消息最近20条
function showHistoryBeforeMsg(msg)
{
    var fromAccount, fromAccountNick;
    var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan, timeSpan, reportBtn;

    fromAccount = msg.fromAccount;
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.fromAccountNick ? msg.fromAccountNick : fromAccount;
    if (!fromAccountNick) {
        fromAccountNick = '未知用户';
    }
    //ul = document.getElementById("video_sms_list");
    ul = $("#video_sms_list");
    /*var maxDisplayMsgCount = 20;
     //var opacityStep=(1.0/4).toFixed(2);
     var opacityStep = 0.2;
     var opacity;
     var childrenLiList = $("#video_sms_list").children();
     if (childrenLiList.length == maxDisplayMsgCount) {
     $("#video_sms_list").children(":first").remove();
     for (var i = 0; i < maxDisplayMsgCount; i++) {
     opacity = opacityStep * (i + 1) + 0.2;
     $('#video_sms_list').children().eq(i).css("opacity", opacity);
     }
     }*/
    li = document.createElement("li");
    paneDiv = document.createElement("div");
    paneDiv.setAttribute('class', 'video-sms-pane');
    textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'video-sms-text');
    nickNameSpan = document.createElement("span");

    var colorList = ['red', 'green', 'blue', 'org'];
    var index = Math.round(fromAccount.length % colorList.length);
    var color = colorList[index];
    nickNameSpan.setAttribute('title', fromAccountNick);
    nickNameSpan.setAttribute('class', 'user-name-' + color);
    nickNameSpan.innerHTML = webim.Tool.formatText2Html("" + fromAccountNick + "");
    contentSpan = document.createElement("span");
    contentSpan.innerHTML = convertHistoryMsgtoHtml(msg);
    reportBtn = document.createElement("span");
    reportBtn.setAttribute('title','举报');
    reportBtn.setAttribute('class','user-name-report');
    timeSpan = document.createElement("span");
    timeSpan.setAttribute('class','time-right');
    timeSpan.innerHTML = formatDate(msg.time * 1000);

    textDiv.appendChild(nickNameSpan);
    textDiv.appendChild(contentSpan);
    textDiv.appendChild(reportBtn);
    textDiv.appendChild(timeSpan);

    paneDiv.appendChild(textDiv);
    li.appendChild(paneDiv);
    ul.prepend(li);
}

//显示历史消息最近20条
function showHistoryMsg(msg)
{
    var fromAccount, fromAccountNick;
    var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan, timeSpan, reportBtn;

    fromAccount = msg.fromAccount;
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.fromAccountNick ? msg.fromAccountNick : fromAccount;
    if (!fromAccountNick) {
        fromAccountNick = '未知用户';
    }
    ul = document.getElementById("video_sms_list");
    /*var maxDisplayMsgCount = 20;
     //var opacityStep=(1.0/4).toFixed(2);
     var opacityStep = 0.2;
     var opacity;
     var childrenLiList = $("#video_sms_list").children();
     if (childrenLiList.length == maxDisplayMsgCount) {
     $("#video_sms_list").children(":first").remove();
     for (var i = 0; i < maxDisplayMsgCount; i++) {
     opacity = opacityStep * (i + 1) + 0.2;
     $('#video_sms_list').children().eq(i).css("opacity", opacity);
     }
     }*/
    li = document.createElement("li");
    paneDiv = document.createElement("div");
    paneDiv.setAttribute('class', 'video-sms-pane');
    textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'video-sms-text');
    nickNameSpan = document.createElement("span");

    var colorList = ['red', 'green', 'blue', 'org'];
    var index = Math.round(fromAccount.length % colorList.length);
    var color = colorList[index];
    nickNameSpan.setAttribute('title', fromAccountNick);
    nickNameSpan.setAttribute('class', 'user-name-' + color);
    nickNameSpan.innerHTML = webim.Tool.formatText2Html("" + fromAccountNick + "");
    contentSpan = document.createElement("span");
    contentSpan.innerHTML = convertHistoryMsgtoHtml(msg);
    reportBtn = document.createElement("span");
    reportBtn.setAttribute('title','举报');
    reportBtn.setAttribute('class','user-name-report');
    timeSpan = document.createElement("span");
    timeSpan.setAttribute('class','time-right');
    timeSpan.innerHTML = formatDate(msg.time * 1000);

    textDiv.appendChild(nickNameSpan);
    textDiv.appendChild(contentSpan);
    textDiv.appendChild(reportBtn);
    textDiv.appendChild(timeSpan);

    paneDiv.appendChild(textDiv);
    li.appendChild(paneDiv);
    ul.appendChild(li);
    /*$(".video-comment-content").mCustomScrollbar("scrollTo", "bottom",{
        scrollInertia:300
    });*/
}
//显示消息（群普通+点赞+提示+红包）

function showMsg(msg) {
    var isSelfSend, fromAccount, fromAccountNick, sessType, subType;
    var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan ,timeSpan ,reportBtn;

    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.getFromAccountNick();
    if (!fromAccountNick) {
        fromAccountNick = '未知用户';
    }
    ul = document.getElementById("video_sms_list");
    /*  var maxDisplayMsgCount = 4;
     //var opacityStep=(1.0/4).toFixed(2);
     var opacityStep = 0.2;
     var opacity;
     var childrenLiList = $("#video_sms_list").children();
     if (childrenLiList.length == maxDisplayMsgCount) {
     $("#video_sms_list").children(":first").remove();
     for (var i = 0; i < maxDisplayMsgCount; i++) {
     opacity = opacityStep * (i + 1) + 0.2;
     $('#video_sms_list').children().eq(i).css("opacity", opacity);
     }
     }*/
    li = document.createElement("li");
    paneDiv = document.createElement("div");
    paneDiv.setAttribute('class', 'video-sms-pane');
    textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'video-sms-text');
    nickNameSpan = document.createElement("span");

    var colorList = ['red', 'green', 'blue', 'org'];
    var index = Math.round(fromAccount.length % colorList.length);
    var color = colorList[index];//setAttribute("title","项目信息")
    nickNameSpan.setAttribute('title',fromAccountNick);
    nickNameSpan.setAttribute('class', 'user-name-' + color);
    nickNameSpan.innerHTML = webim.Tool.formatText2Html("" + fromAccountNick + "");
    reportBtn = document.createElement("span");
    reportBtn.setAttribute('title','举报');
    reportBtn.setAttribute('class','user-name-report');
    contentSpan = document.createElement("span");
    contentPage = document.createElement("p");
    //解析消息
    //获取会话类型，目前只支持群聊
    //webim.SESSION_TYPE.GROUP-群聊，
    //webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();
    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();

    isSelfSend = msg.getIsSend(); //消息是否为自己发的

    switch (subType) {

        case webim.GROUP_MSG_SUB_TYPE.COMMON: //群普通消息
            contentSpan.innerHTML = convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.REDPACKET: //群红包消息
            contentSpan.innerHTML = "[群红包消息]" + convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.LOVEMSG: //群点赞消息
            //业务自己可以增加逻辑，比如展示点赞动画效果
            contentSpan.innerHTML = "[点赞消息]" + convertMsgtoHtml(msg);
            //展示点赞动画
            showLoveMsgAnimation();
            break;
        case webim.GROUP_MSG_SUB_TYPE.TIP: //群提示消息
            contentSpan.innerHTML = "[群提示消息]" + convertMsgtoHtml(msg);
            break;
        default:
            contentSpan.innerHTML = msg.tipText;
            break;
    }

    var nowdt = Date.parse(new Date());
    var rundt = formatDate(nowdt);
    timeSpan = document.createElement("span");
    timeSpan.setAttribute('class','time-right');
    timeSpan.innerHTML = rundt;
    contentPage.appendChild(contentSpan);
    textDiv.appendChild(nickNameSpan);
    textDiv.appendChild(contentPage);
    textDiv.appendChild(reportBtn);
    textDiv.appendChild(timeSpan);

    paneDiv.appendChild(textDiv);
    li.appendChild(paneDiv);

    if(msg.elems[0].content.text && msg.elems[0].content.text.search('&quot;CMD&quot;:&quot;RecommandProduct&quot;') > -1){
        console.log('CMDDCDMDMDMDMDM');
        msg = JSON.parse(msg.elems[0].content.text.replace(/&quot;/g,'"'));
        console.log(msg);
        console.log(msg.product);
        var title = JSON.parse(msg.product).title ? JSON.parse(msg.product).title : '';
        var content = JSON.parse(msg.product).content ? JSON.parse(msg.product).content : '';
        var span = '<span title="'+title+'" data-href="'+content+'">'+title+'</span>';
        $("#promoteProduct").empty();
        $("#promoteProduct").html(span);
        $("#promoteProduct").show();
        $('.closeProduct').show();
    }else{
        ul.appendChild(li);
    }
    if(msg.elems[0].content.text && msg.elems[0].content.text.search('&quot;CMD&quot;:&quot;question&quot;') > -1){
        msg = JSON.parse(msg.elems[0].content.text.replace(/&quot;/g,'"'));
        console.log(msg);
        console.log(msg.sendQuestion);
        
    }

    var S_top = document.getElementById('video_sms_list').scrollHeight;
    $(".video-comment-content").animate({
        scrollTop: S_top
    }, 300);
}

// 显示置顶缓存消息
function showMsgTopCache(msg) {
    var isSelfSend, fromAccount, fromAccountNick, sessType, subType;
    var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan ,timeSpan ,reportBtn;

    fromAccount = msg.fromAccount;
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.fromAccountNick;
    if (!fromAccountNick) {
        fromAccountNick = '未知用户';
    }

    //显示超链接  (https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]
    if(msg.elems[0].content.text){
        msg.elems[0].content.text = msg.elems[0].content.text.replace(/((http:\/\/|https:\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/gi,"<a href='$1' target='_blank'>$1</a>");
    }

    ul = document.getElementById("video_sms_list");
    li = document.createElement("li");
    paneDiv = document.createElement("div");
    paneDiv.setAttribute('class', 'video-sms-pane');
    textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'video-sms-text');
    nickNameSpan = document.createElement("span");

    var colorList = ['red', 'green', 'blue', 'org'];
    var index = Math.round(fromAccount.length % colorList.length);
    var color = colorList[index];//setAttribute("title","项目信息")
    nickNameSpan.setAttribute('title',fromAccountNick);
    nickNameSpan.setAttribute('class', 'user-name-' + color);
    nickNameSpan.innerHTML = webim.Tool.formatText2Html("" + fromAccountNick + "");
    reportBtn = document.createElement("span");
    reportBtn.setAttribute('title','举报');
    reportBtn.setAttribute('class','user-name-report');
    contentSpan = document.createElement("span");

    //subType = msg.getSubType();
    //isSelfSend = msg.getIsSend(); //消息是否为自己发的
    contentSpan.innerHTML = convertHistoryMsgtoHtml(msg);

    var nowdt = Date.parse(new Date());
    var rundt = formatDate(nowdt);
    timeSpan = document.createElement("span");
    timeSpan.setAttribute('class','time-right');
    timeSpan.innerHTML = rundt;

    textDiv.appendChild(nickNameSpan);
    textDiv.appendChild(contentSpan);
    textDiv.appendChild(reportBtn);
    textDiv.appendChild(timeSpan);

    paneDiv.appendChild(textDiv);
    li.appendChild(paneDiv);

    if (typeof(imMsgTopFlag) != "undefined" && imMsgTopFlag) {
        $("#msg-top").empty();
        $("#msg-top").append(li);
        $("#msg-top").show();
    } else {
        ul.appendChild(li);
    }
    console.log(imMsgTopFlag);

    $(".video-comment-content").mCustomScrollbar("scrollTo", "bottom",{
        scrollInertia:300
    });
}


//把消息转换成Html

function convertHistoryMsgtoHtml(msg) {
    var html = "",
        elems, elem, type, content;
    elems = msg.elems; //获取消息包含的元素数组
    for (var i in elems) {
        elem = elems[i];
        type = elem.type; //获取元素类型
        content = elem.content; //获取元素对象
        switch (type) {
            case webim.MSG_ELEMENT_TYPE.TEXT:
                html += convertHistoryTextMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.FACE:
                html += convertHistoryFaceMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.IMAGE:
                html += convertImageMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.SOUND:
                html += convertSoundMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.FILE:
                html += convertFileMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.LOCATION: //暂不支持地理位置
                //html += convertLocationMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.CUSTOM:
                html += convertCustomMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
                html += convertGroupTipMsgToHtml(content);
                break;
            default:
                webim.Log.error('未知消息元素类型: elemType=' + type);
                break;
        }
    }
    return webim.Tool.formatHtml2Text(html);
}

//把消息转换成Html

function convertMsgtoHtml(msg) {
    var html = "",
        elems, elem, type, content;
    elems = msg.getElems(); //获取消息包含的元素数组
    for (var i in elems) {
        elem = elems[i];
        type = elem.getType(); //获取元素类型
        content = elem.getContent(); //获取元素对象
        switch (type) {
            case webim.MSG_ELEMENT_TYPE.TEXT:
                html += convertTextMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.FACE:
                html += convertFaceMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.IMAGE:
                html += convertImageMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.SOUND:
                html += convertSoundMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.FILE:
                html += convertFileMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.LOCATION: //暂不支持地理位置
                //html += convertLocationMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.CUSTOM:
                html += convertCustomMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
                html += convertGroupTipMsgToHtml(content);
                break;
            default:
                webim.Log.error('未知消息元素类型: elemType=' + type);
                break;
        }
    }
    return webim.Tool.formatHtml2Text(html);
}

//解析文本消息元素

function convertHistoryTextMsgToHtml(content) {
    return content.text;
}

//解析文本消息元素

function convertTextMsgToHtml(content) {
    return content.getText();
}

//解析表情消息元素

function convertHistoryFaceMsgToHtml(content) {
    var faceUrl = null;
    var data = content.data;
    var index = webim.EmotionDataIndexs[data];

    var emotion = webim.Emotions[index];
    if (emotion && emotion[1]) {
        faceUrl = emotion[1];
    }
    if (faceUrl) {
        return "<img src='" + faceUrl + "'/>";
    } else {
        return data;
    }
}

//解析表情消息元素

function convertFaceMsgToHtml(content) {
    var faceUrl = null;
    var data = content.getData();
    var index = webim.EmotionDataIndexs[data];

    var emotion = webim.Emotions[index];
    if (emotion && emotion[1]) {
        faceUrl = emotion[1];
    }
    if (faceUrl) {
        return "<img src='" + faceUrl + "'/>";
    } else {
        return data;
    }
}
//解析图片消息元素

function convertImageMsgToHtml(content) {
    var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL); //小图
    var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE); //大图
    var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN); //原图
    if (!bigImage) {
        bigImage = smallImage;
    }
    if (!oriImage) {
        oriImage = smallImage;
    }
    return "<img src='" + smallImage.getUrl() + "#" + bigImage.getUrl() + "#" + oriImage.getUrl() + "' style='CURSOR: hand' id='" + content.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "' onclick='imageClick(this)' />";
}
//解析语音消息元素

function convertSoundMsgToHtml(content) {
    var second = content.getSecond(); //获取语音时长
    var downUrl = content.getDownUrl();
    if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
        return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + downUrl;
    }
    return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
}
//解析文件消息元素

function convertFileMsgToHtml(content) {
    var fileSize = Math.round(content.getSize() / 1024);
    return '<a href="' + content.getDownUrl() + '" title="点击下载文件" ><i class="glyphicon glyphicon-file">&nbsp;' + content.getName() + '(' + fileSize + 'KB)</i></a>';

}
//解析位置消息元素

function convertLocationMsgToHtml(content) {
    return '经度=' + content.getLongitude() + ',纬度=' + content.getLatitude() + ',描述=' + content.getDesc();
}
//解析自定义消息元素

function convertCustomMsgToHtml(content) {
    var data = content.getData();
    var desc = content.getDesc();
    var ext = content.getExt();
    return "data=" + data + ", desc=" + desc + ", ext=" + ext;
}
//解析群提示消息元素

function convertGroupTipMsgToHtml(content) {
    var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
    var text = "";
    var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
    var opType, opUserId, userIdList;
    var memberCount;
    opType = content.getOpType(); //群提示消息类型（操作类型）
    opUserId = content.getOpUserId(); //操作人id
    switch (opType) {
        case webim.GROUP_TIP_TYPE.JOIN: //加入群
            userIdList = content.getUserIdList();
            //text += opUserId + "邀请了";
            for (var m in userIdList) {
                text += userIdList[m] + ",";
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text = text.substring(0, text.length - 1);
            text += "进入房间";
            //房间成员数加1
            memberCount = $('#user-icon-fans').html();
            $('#user-icon-fans').html(parseInt(memberCount) + 1);
            break;
        case webim.GROUP_TIP_TYPE.QUIT: //退出群
            text += opUserId + "离开房间";
            //房间成员数减1
            memberCount = parseInt($('#user-icon-fans').html());
            if (memberCount > 0) {
                $('#user-icon-fans').html(memberCount - 1);
            }
            break;
        case webim.GROUP_TIP_TYPE.KICK: //踢出群
            text += opUserId + "将";
            userIdList = content.getUserIdList();
            for (var m in userIdList) {
                text += userIdList[m] + ",";
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "踢出该群";
            break;
        case webim.GROUP_TIP_TYPE.SET_ADMIN: //设置管理员
            text += opUserId + "将";
            userIdList = content.getUserIdList();
            for (var m in userIdList) {
                text += userIdList[m] + ",";
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "设为管理员";
            break;
        case webim.GROUP_TIP_TYPE.CANCEL_ADMIN: //取消管理员
            text += opUserId + "取消";
            userIdList = content.getUserIdList();
            for (var m in userIdList) {
                text += userIdList[m] + ",";
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "的管理员资格";
            break;

        case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO: //群资料变更
            text += opUserId + "修改了群资料：";
            var groupInfoList = content.getGroupInfoList();
            var type, value;
            for (var m in groupInfoList) {
                type = groupInfoList[m].getType();
                value = groupInfoList[m].getValue();
                switch (type) {
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
                        text += "群头像为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
                        text += "群名称为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
                        text += "群主为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
                        text += "群公告为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
                        text += "群简介为" + value + "; ";
                        break;
                    default:
                        text += "未知信息为:type=" + type + ",value=" + value + "; ";
                        break;
                }
            }
            break;

        case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO: //群成员资料变更(禁言时间)
            text += opUserId + "修改了群成员资料:";
            var memberInfoList = content.getMemberInfoList();
            var userId, shutupTime;
            for (var m in memberInfoList) {
                userId = memberInfoList[m].getUserId();
                shutupTime = memberInfoList[m].getShutupTime();
                text += userId + ": ";
                if (shutupTime != null && shutupTime !== undefined) {
                    if (shutupTime == 0) {
                        text += "取消禁言; ";
                    } else {
                        text += "禁言" + shutupTime + "秒; ";
                    }
                } else {
                    text += " shutupTime为空";
                }
                if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + memberInfoList.length + "人";
                    break;
                }
            }
            break;
        default:
            text += "未知群提示消息类型：type=" + opType;
            break;
    }
    return text;
}

//tls登录

function tlsLogin() {
    //跳转到TLS登录页面
    TLSHelper.goLogin({
        sdkappid: loginInfo.sdkAppID,
        acctype: loginInfo.accountType,
        url: window.location.href
    });
}
//第三方应用需要实现这个函数，并在这里拿到UserSig

function tlsGetUserSig(res) {
    //成功拿到凭证
    if (res.ErrorCode == webim.TLS_ERROR_CODE.OK) {
        //从当前URL中获取参数为identifier的值
        loginInfo.identifier = webim.Tool.getQueryString("identifier");
        //拿到正式身份凭证
        loginInfo.userSig = res.UserSig;
        //从当前URL中获取参数为sdkappid的值
        loginInfo.sdkAppID = loginInfo.appIDAt3rd = Number(webim.Tool.getQueryString("sdkappid"));
        //从cookie获取accountType
        var accountType = webim.Tool.getCookie('accountType');
        if (accountType) {
            loginInfo.accountType = accountType;
            sdkLogin(); //sdk登录
        } else {
            location.href = location.href.replace(/\?.*$/gi, "");
        }
    } else {
        //签名过期，需要重新登录
        if (res.ErrorCode == webim.TLS_ERROR_CODE.SIGNATURE_EXPIRATION) {
            tlsLogin();
        } else {
            alert("[" + res.ErrorCode + "]" + res.ErrorInfo);
        }
    }
}

//单击图片事件

function imageClick(imgObj) {
    var imgUrls = imgObj.src;
    var imgUrlArr = imgUrls.split("#"); //字符分割
    var smallImgUrl = imgUrlArr[0]; //小图
    var bigImgUrl = imgUrlArr[1]; //大图
    var oriImgUrl = imgUrlArr[2]; //原图
    webim.Log.info("小图url:" + smallImgUrl);
    webim.Log.info("大图url:" + bigImgUrl);
    webim.Log.info("原图url:" + oriImgUrl);
}


//切换播放audio对象

function onChangePlayAudio(obj) {
    if (curPlayAudio) { //如果正在播放语音
        if (curPlayAudio != obj) { //要播放的语音跟当前播放的语音不一样
            curPlayAudio.currentTime = 0;
            curPlayAudio.pause();
            curPlayAudio = obj;
        }
    } else {
        curPlayAudio = obj; //记录当前播放的语音
    }
}

//单击评论图片

function smsPicClick() {
    if (!loginInfo.identifier) { //未登录
        if (accountMode == 1) { //托管模式
            //将account_type保存到cookie中,有效期是1天
            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
            //调用tls登录服务
            tlsLogin();
        } else { //独立模式
            showTip('请填写帐号和票据');
            //$('#login_dialog').show();
        }
        return;
    } else {
        hideDiscussTool(); //隐藏评论工具栏
        showDiscussForm(); //显示评论表单
    }
}

//发送消息(普通消息)

function onSendMsg() {
    if (!loginInfo.identifier) { //未登录
        if (accountMode == 1) { //托管模式
            //将account_type保存到cookie中,有效期是1天
            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
            //调用tls登录服务
            tlsLogin();
        } else { //独立模式
            showTip('请填写帐号和票据');
            //$('#login_dialog').show();
        }
        return;
    }

    if (!selToID) {
        showTip("您还没有进入房间，暂不能聊天");
        $("#send_msg_text").val('');
        return;
    }
    //获取消息内容
    var msgtosend = $("#send_msg_text").val().replace(/(^\s*)|(\s*$)/g, "");

    $("#send_msg_text").val('');
    var msgLen = webim.Tool.getStrBytes(msgtosend);
    if (msgtosend.length < 1) {
        showTip("发送的消息不能为空!");
        return false;
    }

    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.GROUP) {
        maxLen = webim.MSG_MAX_LENGTH.GROUP;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {
        maxLen = webim.MSG_MAX_LENGTH.C2C;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }
    if (msgLen > maxLen) {
        showTip(errInfo);
        return;
    }
    //企业评论敏感词过滤
    $.ajax({
        type: "post",
        url: filterurl,
        data:JSON.stringify({content:msgtosend,topicid:tid,nickname:loginInfo.identifierNick}),
        dataType: "json",
        async:false,
        success: function(data) {
            filterVal = true;
            if(data.state != 0){
                filterVal = false;
                alert(data['msg']);
            }
        }
    });

    if(!filterVal){
        return;
    }

    if (!selSess) {
        selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType; //消息子类型
    if (selType == webim.SESSION_TYPE.GROUP) {
        //群消息子类型如下：
        //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
        //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
        //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
        //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
        subType = webim.GROUP_MSG_SUB_TYPE.COMMON;

    } else {
        //C2C消息子类型如下：
        //webim.C2C_MSG_SUB_TYPE.COMMON-普通消息,
        subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    }
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
    if (!emotions || emotions.length < 1) {
        text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
    } else { //有表情

        for (var i = 0; i < emotions.length; i++) {
            tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
            if (tmsg) {
                text_obj = new webim.Msg.Elem.Text(tmsg);
                msg.addText(text_obj);
            }
            emotionIndex = webim.EmotionDataIndexs[emotions[i]];
            emotion = webim.Emotions[emotionIndex];
            if (emotion) {
                face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
                msg.addFace(face_obj);
            } else {
                text_obj = new webim.Msg.Elem.Text(emotions[i]);
                msg.addText(text_obj);
            }
            restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
            msgtosend = msgtosend.substring(restMsgIndex);
        }
        if (msgtosend) {
            text_obj = new webim.Msg.Elem.Text(msgtosend);
            msg.addText(text_obj);
        }
    }
    webim.sendMsg(msg, function(resp) {
        if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
            showMsg(msg);
        }
        webim.Log.info("发消息成功");
        $.ajax({
            type: "POST",
            url: tourl,
            // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
            // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
            data: JSON.stringify({
                msg: JSON.stringify(msg),
                fromaccount: loginInfo.identifierNick,
                topicid:selToID,
                dottime:"0:00",
                type:1
            }),
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
            } // 注意不要在此行增加逗号
        });
        hideDiscussForm(); //隐藏评论表单
        showDiscussTool(); //显示评论工具栏
        hideDiscussEmotion(); //隐藏表情
    }, function(err) {
        webim.Log.error("发消息失败:" + err.ErrorInfo);
        showTip("发消息失败!" /*+ err.ErrorInfo*/);
    });
}

//发送消息(群点赞消息)

function sendGroupLoveMsg() {

    if (!loginInfo.identifier) { //未登录
        if (accountMode == 1) { //托管模式
            //将account_type保存到cookie中,有效期是1天
            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
            //调用tls登录服务
            tlsLogin();
        } else { //独立模式
            showTip('请填写帐号和票据');
            //$('#login_dialog').show();
        }
        return;
    }

    if (!selToID) {
        showTip("您还没有进入房间，暂不能点赞");
        return;
    }

    if (!selSess) {
        selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    //群消息子类型如下：
    //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    var subType = webim.GROUP_MSG_SUB_TYPE.LOVEMSG;

    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    var msgtosend = ' 点了一个赞哦';
    var text_obj = new webim.Msg.Elem.Text(msgtosend);
    msg.addText(text_obj);

    webim.sendMsg(msg, function(resp) {
        if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
            showMsg(msg);
        }
        //$.post(zanUrl, {"topic_id":$('#voteCount').attr('data-topicid')},function(){});
        // $.ajax({
        //     type: "get",
        //     url: zanUrl,
        //     // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
        //     // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
        //     data: ({
        //         topic_id: $('#voteCount').attr('data-topicid')
        //     }),
        //     //contentType: "application/json; charset=utf-8",
        //     dataType: "json",
        //     success: function(data) {
        //     } // 注意不要在此行增加逗号
        // });

        webim.Log.info("点赞成功");
    }, function(err) {
        webim.Log.error("发送点赞消息失败:" + err.ErrorInfo);
        showTip("发送点赞消息失败:" + err.ErrorInfo);
    });
}
//隐藏评论文本框

function hideDiscussForm() {
    $(".video-discuss-form").show();
}
//显示评论文本框

function showDiscussForm() {
    $(".video-discuss-form").show();
}
//隐藏评论工具栏

function hideDiscussTool() {
    $(".video-discuss-tool").hide();
}
//显示评论工具栏

function showDiscussTool() {
    $(".video-discuss-tool").hide();
}
//隐藏表情框

function hideDiscussEmotion() {
    $(".video-discuss-emotion").hide();
    //$(".video-discuss-emotion").fadeOut("slow");
}
//显示表情框

function showDiscussEmotion() {
    $(".video-discuss-emotion").show();
    //$(".video-discuss-emotion").fadeIn("slow");

}
//展示点赞动画

function showLoveMsgAnimation() {
    //点赞数加1
    var loveCount = $('#likeNumber').html();
    $('#likeNumber').html(parseInt(loveCount) + 1);
    /*   var toolDiv = document.getElementById("video-discuss-tool");
     var loveSpan = document.createElement("span");
     var colorList = ['red', 'green', 'blue'];
     var max = colorList.length - 1;
     var min = 0;
     var index = parseInt(Math.random() * (max - min + 1) + min, max + 1);
     var color = colorList[index];
     loveSpan.setAttribute('class', 'like-icon zoomIn ' + color);
     toolDiv.appendChild(loveSpan);*/
}

//初始化表情

function initEmotionUL() {
    for (var index in webim.Emotions) {
        var emotions = $('<img>').attr({
            "id": webim.Emotions[index][0],
            "src": webim.Emotions[index][1],
            "style": "cursor:pointer;"
        }).click(function() {
            selectEmotionImg(this);
        });
        $('<li>').append(emotions).appendTo($('#emotionUL'));
    }
}

//打开或显示表情

function showEmotionDialog() {
    if (openEmotionFlag) { //如果已经打开
        openEmotionFlag = false;
        hideDiscussEmotion(); //关闭
    } else { //如果未打开
        openEmotionFlag = true;
        showDiscussEmotion(); //打开
    }
}
//选中表情

function selectEmotionImg(selImg) {
    $("#send_msg_text").val($("#send_msg_text").val() + selImg.id);
}

//退出大群

function quitBigGroup() {
    var options = {
        'GroupId': avChatRoomId //群id
    };
    webim.quitBigGroup(
        options,
        function(resp) {

            webim.Log.info('退群成功');
            $("#video_sms_list").find("li").remove();
            //webim.Log.error('进入另一个大群:'+avChatRoomId2);
            //applyJoinBigGroup(avChatRoomId2);//加入大群
        },
        function(err) {
            showTip(err.ErrorInfo);
        }
    );
}

//登出

function logout() {
    //登出
    webim.logout(
        function(resp) {
            webim.Log.info('登出成功');
            loginInfo.identifier = null;
            loginInfo.userSig = null;
            $("#video_sms_list").find("li").remove();
            var indexUrl = window.location.href;
            var pos = indexUrl.indexOf('?');
            if (pos >= 0) {
                indexUrl = indexUrl.substring(0, pos);
            }
            window.location.href = indexUrl;
        }
    );
}

//点击登录按钮(独立模式)

function independentModeLogin() {
    if ($("#login_account").val().length == 0) {
        showTip('请输入帐号');
        return;
    }
    if ($("#login_pwd").val().length == 0) {
        showTip('请输入UserSig');
        return;
    }
    loginInfo.identifier = $('#login_account').val();
    loginInfo.userSig = $('#login_pwd').val();
    $('#login_dialog').hide();
    sdkLogin();
}

//格式化日期,
function add0(m){return m<10 ? '0'+m : m }
function formatDate(format) {
    //time是整数，否则要parseInt转换
    var time = new Date(format);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}