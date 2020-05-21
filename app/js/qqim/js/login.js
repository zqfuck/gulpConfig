var feed = location.host.split('.')[0];
var host = window.location.protocol+"//"+feed+'api.v114.com';
//var host = "http://liveapi.v114.com";
var tourl = host + "/msg/history";
//var zanUrl = "/like/like/like";
//var getzanUrl = "/like/like/getlikes";
var filterurl = host + "/msg/filterwords";
//var getname = '/mediacloud/default/get-name';//Getname
var nick_url = '/mediacloud/default/nickname-pool';
var getnickname = host+'/getnickname';

var firstEnter = true; //是否是第一次进入页面
var ismousewheel = true; //是否是滚轮事件
var loadedAll = false;  //是否已经加载全部

//全局变量，控制短期内不允许发送获取历史消息请求
window.switch = {
    flag: true,
    page:2
};
//鼠标滚轮滑动事件

function mousewheelHander(e) {
    //var top = document.documentElement.scrollTop || window.pageYOffset || $.scrollTop;
    e.stopPropagation();
    e.preventDefault();
    var top = document.getElementById("chat-list-div").scrollTop;
    if (top == 0) {
        //滚轮事件处理
        if(ismousewheel == true){
            var slideDown2 = document.getElementById("slideDown2");
            slideDown2.style.display = "block";
            getHistoryMsg(window.switch.page);
           // $(".video-comment-content").mCustomScrollbar("scrollTo", "top");
            //window.switch.flag = false;
            window.switch.page +=1;
            msgflag = 2;
            ismousewheel = false;
        }
    }
}

function getHistoryMsg(page){
    var url2 = host+"/webapi/banner/msg-list?topicid="+tid+"&page="+page;

    //将下拉获取更早的消息这个框隐藏掉
    setTimeout(function() {
        var slideDown2 = document.getElementById("slideDown2");
        slideDown2.style.display = "none";
        var more = document.getElementById("more");
        var all = document.getElementById("all");

        if(loadedAll){
            more.style.display = "none";
            all.style.display = "block";
        }else{
            all.style.display = "none";
            more.style.display = "block";
        }
        //消息显示
        $.getJSON(url2,function($json){
            if($json['state'] == 0)
            {
                initHistoryMsg($json['data'],true);
            }else if($json['state'] == -2)
            {
                loadedAll = true;
                //initHistoryMsg($json['data'],true);
            }
        });
    }, 1000);
    //alert("此主题没有更多的历史消息!");
}

//帐号模式，0-表示独立模式，1-表示托管模式
var accountMode = 0;

//官方 demo appid,需要开发者自己修改（托管模式）
var sdkAppID = '1400038608';//1400047237
var accountType = '15000';//18561

var headurl,identifier,identifierNick,userSig,filterVal;
var avChatRoomId = tid;  //默认房间群ID，群类型必须是直播聊天室（AVChatRoom）
var media_id = 2;

if (webim.Tool.getQueryString("tid")) {
    avChatRoomId = webim.Tool.getQueryString("tid");//用户自定义房间群id
}

if (webim.Tool.getQueryString("photo")) {
    headurl = webim.Tool.getQueryString("photo");//用户自定义用户头像
}


/*// 初始化点赞数
$.ajax({
    type: "get",
    url: getzanUrl,
    // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
    // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
    data: ({
        topic_id: tid
    }),
    //contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) {
        if(data.state==0)
        {
            $('#voteCount').html(data.likes);
        }
    } // 注意不要在此行增加逗号
});*/

var selType = webim.SESSION_TYPE.GROUP;
var selToID = avChatRoomId;//当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
var selSess = null;//当前聊天会话

//默认群组头像(选填)
var selSessHeadUrl = 'img/2017.jpg';


//当前用户身份
var loginInfo = {
    'sdkAppID': sdkAppID, //用户所属应用id,必填
    'appIDAt3rd': sdkAppID, //用户所属应用id，必填
    'accountType': accountType, //用户所属应用帐号类型，必填
    'identifier': identifier, //当前用户ID,必须是否字符串类型，选填
    'identifierNick': identifierNick, //当前用户昵称，选填
    'userSig': userSig, //当前用户身份凭证，必须是字符串类型，选填
    'headurl': headurl || 'img/2016.gif'//当前用户默认头像，选填
};

//监听（多终端同步）群系统消息方法，方法都定义在demo_group_notice.js文件中
//注意每个数字代表的含义，比如，
//1表示监听申请加群消息，2表示监听申请加群被同意消息，3表示监听申请加群被拒绝消息等
var onGroupSystemNotifys = {
    //"1": onApplyJoinGroupRequestNotify, //申请加群请求（只有管理员会收到,暂不支持）
    //"2": onApplyJoinGroupAcceptNotify, //申请加群被同意（只有申请人能够收到,暂不支持）
    //"3": onApplyJoinGroupRefuseNotify, //申请加群被拒绝（只有申请人能够收到,暂不支持）
    //"4": onKickedGroupNotify, //被管理员踢出群(只有被踢者接收到,暂不支持)
    "5": onDestoryGroupNotify, //群被解散(全员接收)
    //"6": onCreateGroupNotify, //创建群(创建者接收,暂不支持)
    //"7": onInvitedJoinGroupNotify, //邀请加群(被邀请者接收,暂不支持)
    //"8": onQuitGroupNotify, //主动退群(主动退出者接收,暂不支持)
    //"9": onSetedGroupAdminNotify, //设置管理员(被设置者接收,暂不支持)
    //"10": onCanceledGroupAdminNotify, //取消管理员(被取消者接收,暂不支持)
    "11": onRevokeGroupNotify, //群已被回收(全员接收)
    "255": onCustomGroupNotify//用户自定义通知(默认全员接收)
};


//监听连接状态回调变化事件
var onConnNotify = function (resp) {
    switch (resp.ErrorCode) {
        case webim.CONNECTION_STATUS.ON:
            //webim.Log.warn('连接状态正常...');
            break;
        case webim.CONNECTION_STATUS.OFF:
            webim.Log.warn('连接已断开，无法收到新消息，请检查下你的网络是否正常');
            break;
        default:
            webim.Log.error('未知连接状态,status=' + resp.ErrorCode);
            break;
    }
};


//监听事件
var listeners = {
    "onConnNotify": onConnNotify, //选填
    "jsonpCallback": jsonpCallback, //IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
    "onBigGroupMsgNotify": onBigGroupMsgNotify, //监听新消息(大群)事件，必填
    "onMsgNotify": onMsgNotify,//监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
    "onGroupSystemNotifys": onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
    "onGroupInfoChangeNotify": onGroupInfoChangeNotify//监听群资料变化事件，选填
};

var isAccessFormalEnv = true;//是否访问正式环境

if (webim.Tool.getQueryString("isAccessFormalEnv") == "false") {
    isAccessFormalEnv = false;//访问测试环境
}

var isLogOn = false;//是否在浏览器控制台打印sdk日志

//其他对象，选填
var options = {
    'isAccessFormalEnv': isAccessFormalEnv,//是否访问正式环境，默认访问正式，选填
    'isLogOn': isLogOn//是否开启控制台打印日志,默认开启，选填
};

var curPlayAudio = null;//当前正在播放的audio对象

var openEmotionFlag = false;//是否打开过表情

var entryUrl = host + "/msg/history/entry";
var getIdentifier = host + "/webapi/msg/randomname";
//http://livetapi.v114.com/webapi/msg/randomname

$.getJSON(getIdentifier,function(e){
    if(e.state == 0){
        $("#nickname_dialog .nickname").val(e.identifierNick);
    }else{
        showTip('IM_Idnetifier_Error');
    }
});

if(/debug/gi.test(location.hash)){
    document.write('<script src="http://sdklog.isd.com/js/vconsole.min.js"></scr'+'ipt>');
}

function colseLogin(){
    $('#login_dialog').hide();
}

$(function(){
    $(".video-comment-content").on('scroll', mousewheelHander);
    //$(".video-comment-content").on('DOMMouseScroll', mousewheelHander);

    var url2 = host+"/webapi/banner/msg-list?topicid="+tid;
    $.getJSON(url2,function($json){
        console.log($json);
        if($json['state']==0)
        {
            initHistoryMsg($json['data'],false);
        }
    });

    //键盘事件发送评论
    $("#send_msg_text").keydown(function(event) {
        var keyCode = event.keyCode;
        if (keyCode == 13) {
            $(".video-discuss-button").click();
            $(this).blur();
            return false;
        }
    });
    //点击表情
    $("#emotionUL").on('click','li>img',function(){
        $(".video-discuss-face").click();
    });
    //评论框焦点事件
    $("#send_msg_text").focus(function(){
        $("#video-discuss-form .voteCon").hide();
        //$("#video-discuss-form .video-discuss-button").show();
        if($("#video-discuss-emotion").is(':visible')){
            $(".video-discuss-face").click();
        }
    });
    //空白点击事件
    $(document).click(function(e){//video-discuss-pane
        var divTop = $('.video-discuss-pane');   // 设置目标区域
        if(!divTop.is(e.target) && divTop.has(e.target).length === 0){
            if(!$("#send_msg_text").val().length > 0){
                $("#video-discuss-form .voteCon").show();
                //$("#video-discuss-form .video-discuss-button").hide();
            }
            if($("#video-discuss-emotion").is(':visible')){
                $(".video-discuss-face").click();
            }
        }
    });
    //点击登录
    $("#nickname_dialog .login_discuss").click(function(){
        $('#nickname_dialog .nickname_input').slideToggle("fast");
    });
    //点击确定按钮
    $("#nickname_dialog .nickname-button").click(function(){
        var nickname = $("#nickname_dialog .nickname").val();
        $.ajax({
            type: "get",
            url: entryUrl,
            data: {nickname:nickname},
            dataType: "json",
            async:false,
            success: function(data) {
                if(data['state'] == 0)
                {
                    loginInfo.sdkAppID = data['sdkAppID'];
                    loginInfo.appIDAt3rd = data['sdkAppID'];
                    loginInfo.accountType = data['accountType'];
                    loginInfo.userSig = data['userSig'];
                    loginInfo.identifier = data['identifier'];
                    loginInfo.identifierNick = data['identifierNick'];
                }else{
                    console.log(data['msg']);
                }
            }
        });
        //console.log(JSON.stringify(loginInfo));
        sdkLogin();
        $("#nickname_dialog").hide();
    });
});


