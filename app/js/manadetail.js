/**
 * Created by louqq on 2018/6/14.
 */
//获取地址栏参数
function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}
var userid = getQueryStringByName("userid");//主播user_id
var cid = getQueryStringByName("cid");//直播内容cid
var headPic = getUrlParam("headImg");//头像
var introduce = getUrlParam("introDuce");//简介
var nick_name = getUrlParam("nickName");//昵称


var tid;
var companyId = localStorage.companyId;
console.log(companyId);
$(function(){


    var appTwo=new Vue({
        el:"#appTwo",
        data:{
            cid:null,
            like:null,
            watch:null,
            content:null,
            column:null,
            product:null,
            name:null,
            src:null,
            poster:null,
            linkSrc:null,
            errPassword:'',
            poster:null,
            timeLeft:null,
            wdShow:null,
            guests:null,
            related:null,
            topId:null,
            isClass:true
        },
        methods:{
            changeStyle:function(){
                this.isClass=!this.isClass;
                // var leftScrolla = new IScroll(".guest", {
                // 	scrollX: true,
                // 	freeScroll: true ,
                // 	click:true,
                // 	tap:true
                // });
                setTimeout(function(){
                    leftScrolla.refresh();
                },0)

            },
            judggePassword:function(){

                var that=this;

                console.log(this.cid);
                $.ajax({
                    url:URL+'/webapi/banner/live-particulars',
                    type:"get",
                    dataType:"json",
                    data:{
                        cid:this.cid
                    },
                    success:function(data){
                        if(data.state.rc>=0){
                            $.ajax({
                                //url:URL+"/appapi/videoroom/greatvideolist",
                                url:"http://livetapi.v114.com/appapi/videoroom/greatvideolist",
                                type:'get',
                                dataType:"json",
                                data:{
                                    user_id:userid,
                                    page:1,
                                    pagesize:100
                                },
                                success:function(data){
                                    console.log(data);
                                    if(data.state.rc==0){
                                        that.wdShow=data.result.items;
                                    };
                                },
                                error:function(err){
                                    console.log(err);
                                }
                            });
                            console.log(data);
                            //点赞数
                            that.like=data.detail_data.like;
                            //观看数
                            that.watch=data.detail_data.pv;
                            //内容介绍
                            localStorage.mediacloud_id=data.detail_data.mediacloud_id;
                            that.topId=data.detail_data.tid;
                            console.log(data.detail_data.tid);
                            tid=data.detail_data.tid;
                            localStorage.qnTid=tid;


                            $('body').append('<script src="js/qqim/js/login.js"></script>');
                            $('body').append("<script> $(function(){console.log(localStorage.qnTid); onlineNum(localStorage.qnTid,'callback',localStorage.cu_user_name); });</script>");


                            that.content=data.detail_data.content_desc;
                            //频道介绍
                            that.column=data.detail_data.column_desc;
                            that.product=data.product_data;
                            that.name=data.detail_data.name;
                            that.linkSrc=data.live_data.video_url;
                            that.poster=data.live_data.content_img;
                            //判断视频状态 1预约
                            if(data.live_data.live_type==1){
                                if(data.live_data.watch==2){
                                    $('#videoContainer').css('background-image','url('+that.poster+')');
                                    $('#appointment').css('display','block');
                                    $('#videos').css('display','none');
                                    that.leftTime(data.live_data.live_start);

                                    var timer=setInterval(function(){
                                        that.leftTime(data.live_data.live_start);
                                    },1000);
                                    if(data.live_data.live_start-(new Date().getTime())<=0){
                                        clearInterval(timer);
                                        window.location.reload();
                                    }
                                }else if(data.live_data.watch==0){
                                    $('#videoContainer').css('background-image','url('+that.poster+')');
                                    $('#appointment').css('display','block');
                                    $('#videos').css('display','none');
                                    $('.nowBook').css('display','none');
                                    that.leftTime(data.live_data.live_start);

                                    var timera =setInterval(function(){
                                        that.leftTime(data.live_data.live_start);
                                    },1000);
                                    if(data.live_data.live_start-(new Date().getTime())<=0){
                                        clearInterval(timera);
                                        window.location.reload();
                                    }
                                }

                            }else if(data.live_data.live_type==2){
                                if(data.live_data.watch==0){
                                    that.src=that.linkSrc;
                                }else if(data.live_data.watch==1){
                                    $('#popUp').show();
                                    $('#passWord').show();
                                }else if(data.live_data.watch==2){
                                    $('#popUp').show();
                                    $('#Vcode').show();
                                    $('#cancelyy').click(function(){
                                        $('#popUp').hide();
                                        $('#Vcode').hide();
                                    });
                                    $('#sendCode').click(function(){
                                        if(!$('#imgCode').val()){
                                            showTip('请输入图片验证码');
                                            return;
                                        }
                                        if(checkPhone($('#watchPhoneNumber').val())){
                                            $.ajax({
                                                url:URL+"/appapi/wx/sendcode",
                                                type:"get",
                                                dataType:'json',
                                                data:{
                                                    id:that.cid,
                                                    phone:$('#watchPhoneNumber').val(),
                                                    imgcode:$('#imgCode').val(),
                                                    timeflag:timeflag2
                                                },
                                                success:function(data){
                                                    console.log(data);
                                                    if(data.state.rc==0){
                                                        showTip('短信已发送到手机注意查收');
                                                        $('#sendCode').css('display','none');
                                                        $('#countDown').css('display','block');
                                                        var num=60;
                                                        var timer=setInterval(function(){

                                                            num--;
                                                            $('#countDown').html(num);
                                                            console.log(num);
                                                            if(num==0){
                                                                clearInterval(timer);
                                                                $('#countDown').css('display','none');
                                                                $('#sendCode').css('display','block');
                                                            }
                                                        },1000);
                                                    }else{
                                                        showTip(data.state.msg);
                                                        getCode();
                                                    }
                                                }

                                            });
                                        }
                                    });
                                    $('#confirmCode').click(function(){
                                        if(!$('#imgCode').val()){
                                            showTip('请输入图片验证码');
                                            return;
                                        }
                                        if(!$('#watchVcode').val()){
                                            showTip('请输入短信验证码');
                                            return;
                                        }else{
                                            $.ajax({
                                                url:URL+'/appapi/wx/authorize',
                                                type:"get",
                                                dataType:'json',
                                                data:{
                                                    id:that.cid,
                                                    code:$('#watchVcode').val(),
                                                    imgcode:$('#imgCode').val(),
                                                    phone:$('#watchPhoneNumber').val()
                                                },
                                                success:function(data){
                                                    if(data.state.rc==0){
                                                        that.src=that.linkSrc;
                                                        $('#popUp').hide();
                                                        $('#Vcode').hide();
                                                    }else{
                                                        showTip(data.state.msg);
                                                    }
                                                }
                                            });
                                        }


                                    });
                                }
                            }else if(data.live_data.live_type==3){
                                if(data.live_data.watch==0){
                                    that.src=that.linkSrc;
                                }else if(data.live_data.watch==1){
                                    $('#popUp').show();
                                    $('#passWord').show();
                                }
                            }

                        }



                    }
                });
            },
            addLike:function(){
                var that=this;
                var data={
                    topic_id:this.topId
                }
                console.log(JSON.stringify(data));
                $.ajax({
                    url:URL+"/like",
                    type:'post',
                    dataType:"json",
                    data:JSON.stringify(data),
                    success:function(data){
                        console.log(data);
                        if(data.state>=0 && data.msg=="Success"){
                            //that.like=data.likes;
                            console.log(that.like);
                            sendGroupLoveMsg();
                        }else{
                            showTip('点赞频率过快');
                        }

                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            },
            toBooks:function(){
                var that=this;
                $(".bookBox").show();
                $(".bookVideo").show();
                $("#zq-btn").unbind();
                getCode();
                $("#zq-BookC").click(function () {
                    $(".bookBox").hide();
                    $(".bookVideo").hide();
                })
                $("#zq-btn").bind('click',function () {
                    var val = $("#tel").val();
                    var code = $("#bookCode").val();
                    if(val==''||!checkPhone(val)){
                        showTip('请输入正确手机号码');
                        return;
                    };
                    if(code==''){
                        showTip('请输入图片验证码')
                        return;
                    };
                    $.ajax({
                        url: URL + '/appapi/wx/book',
                        type: "get",
                        dataType: "json",
                        cache: false,
                        data: {
                            id: that.cid,
                            phone:val,
                            imgcode:code,
                            timeflag:timeflag2
                        },
                        error: function (data) {
                            console.log(data);
                        },
                        success: function (data) {
                            console.log(data)
                            if (data.state.rc==0){
                                showTip(data.state.msg);
                                $(".bookBox").hide();
                                $(".bookVideo").hide();
                                return;
                            }else{
                                showTip(data.state.msg);
                            }
                        }
                    });
                });

            },
            checkPassword:function(){
                var that=this;
                if($('#watchPassword').val()==''||$('#watchPassword').val()==undefined){
                    showTip('请输入正确的观看密码')
                    return;
                }
                $.ajax({
                    type:'get',
                    dataType:'json',
                    url:URL+'/appapi/wx/authorize',
                    data:{
                        id:this.cid,
                        code:$('#watchPassword').val()
                    },
                    success:function(data){
                        console.log(data);
                        if(data.state.rc==0){
                            that.src=that.linkSrc;
                            $('#popUp').hide();
                        }else{
                            showTip('请输入正确的观看密码');
                            /*that.errPassword="请输入正确的观看密码";
                             setTimeout(function(){
                             that.errPassword="";
                             },2000);*/
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            },
            toRelated:function(cid){
                window.location.href="./details.html?cid="+cid;
            },
            guest:function(){
                var that=this;
                that.guests=[{
                    img:headPic,
                    name:nick_name,
                    intro:introduce
                }];
                setTimeout(function(){
                    if($('.guest').css('display')=='block'){
                        leftScrolla = new IScroll(".guest", {
                            scrollX: true,
                            freeScroll: true ,
                            click:true,
                            tap:true
                        });
                    }
                },100);
            },
            wdShowType:function(type){
                if(type==1){
                    return "直播";
                }else if(type==2){
                    return "热播中...";
                }else if(type==3){
                    return "回看";
                }

            },

            towdShow:function(cid){
                window.location.href="./manadetail.html?cid="+cid+ "&userid=" + userid+"&headImg="+headPic+
                    "&nickName="+nick_name+"&introDuce="+introduce;;
            },
            program:function(){
                var that=this;
                setTimeout(function(){

                    var leftScrollb = new IScroll(".program", {
                        scrollX: true,
                        freeScroll: true ,
                        click:true,
                        tap:true
                    });

                },1000);
                // $.ajax({
                // 	url:URL+"/webapi/banner/get-data",
                // 	type:'get',
                // 	dataType:"json",
                // 	data:{
                // 		id:companyId,
                // 		type:4
                // 	},
                // 	success:function(data){
                // 		console.log(data);
                // 		if(data.state==0){
                // 			that.wdShow=data.data;
                // 		}
                // 		setTimeout(function(){
                // 				if($('.program').css('display')=='block'){
                // 					var leftScrollb = new IScroll(".program", {
                // 						scrollX: true,
                // 						freeScroll: true
                // 					});
                // 				}
                // 		},100);


                // 	},
                // 	error:function(err){
                // 		console.log(err);
                // 	}
                // })
            },
            leftTime:function(time){
                var leftTime = time - (new Date().getTime()); //计算剩余的毫秒数
                var hours = parseInt(leftTime / 1000 / 60 / 60 , 10); //计算剩余的小时
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                hours = this.checkTime(hours);
                minutes = this.checkTime(minutes);
                seconds = this.checkTime(seconds);
                //document.getElementById("timer").innerHTML =  hours+":" + minutes+":"+seconds;
                this.timeLeft = hours+":" + minutes+":"+seconds;

            },
            checkTime:function(i){
                if(i<10) {
                    i = "0" + i;
                }
                return i;
            },
            toDetail:function(url){
                //console.log(url);
                window.location.href='http://'+url;
            },
            getQueryStringByName:function(name){
                var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));

                if(result == null || result.length < 1){

                    return "";

                }

                return result[1];
            }
        },
        created:function(){
            var that=this;
            setTimeout(function(){
                var leftScroll = new IScroll(".content", {
                    scrollX: true,
                    freeScroll: true,
                    click:true
                });
            },1000);
            this.cid=this.getQueryStringByName('cid');
            this.judggePassword();
            this.guest();
        }
    });
    $('.tablist li').click(function(){
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        $('.visiable').eq($(this).index()).siblings().css('display','none');
        $('.visiable').eq($(this).index()).css('display','block');
    });

    $('#guest').click(function(){


    });
    $('#cancel').click(function(){
        $('#popUp').css('display','none');
    });
    $('#back').click(function(){
        window.history.back();
    });
    $('#watchPhoneNumber').blur(function(){
        if(!checkPhone($(this).val())){
            showTip('请输入正确手机号');
        }

    });
    $('#chat').click(function(){
        setTimeout(function(){
            var S_top = document.getElementById('video_sms_list').scrollHeight;
            $(".video-comment-content").animate({
                scrollTop: S_top
            }, 300);
        },300);
    });
    //视频小窗
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
    $('#promoteProduct').click(function(e){
        if($('#promoteProduct').css('display')=='block'){
            var chanpUrl=$('#promoteProduct').children('span').attr('data-href');
            $('#productUrl').attr('src',chanpUrl);
            $('.closeProduct').css('display','none');
        }
        document.getElementById('productUrl').height=document.documentElement.clientHeight;
        document.getElementById('productUrl').width=document.documentElement.clientWidth;
        e.preventDefault();
        $('#promoteProduct').css('display','none');
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
        var isShow=document.getElementById('productUrl').style.display;
        if(isShow=='none'){
            document.getElementById('productUrl').style.display='block';
        }else{
            document.getElementById('productUrl').style.display='none';
        }
        $('#videoContainer').css({
            width:'232px',
            height:'288px',
            background:'url(./img/moveBG.png) ',
            backgroundPosition:'0 0',
            backgroundSize:'100% 100%',
            position:'absolute',
            left:'200px',
            top:'50px',
            zIndex:'999'
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
                console.log(left,top);
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
    })
    $('.closeProduct').click(function(e){
        e.stopPropagation();
        $('#promoteProduct').css('display','none');
        $('.closeProduct').css('display','none');
    });
    $('.weixuanzhong').click(function(){
        $('.weixuanzhong').removeClass('xuanzhong');
        $(this).addClass('xuanzhong');
    });

    $.ajax({
        //url:'http://livetapi.v114.com/appapi/question/getquestions',
        url:URL + 'appapi/question/getquestions',
        type:'get',
        dataType:'json',
        data:{
            // cid:getQueryStringByName('cid')
        },
        success:function(res){
            if(res.state.rc==0){
                questionData=res.result.questions;
            }

        },
        error:function(err){
            console.log(err);
        }
    });
    $('#startQuestion').click(function(){

    })


});

