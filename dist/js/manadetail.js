"use strict";function _defineProperty(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function getQueryStringByName(e){var t=location.search.match(new RegExp("[?&]"+e+"=([^&]+)","i"));return null==t||t.length<1?"":t[1]}var tid,userid=getQueryStringByName("userid"),cid=getQueryStringByName("cid"),headPic=getUrlParam("headImg"),introduce=getUrlParam("introDuce"),nick_name=getUrlParam("nickName"),companyId=localStorage.companyId;console.log(companyId),$(function(){var e;new Vue({el:"#appTwo",data:(_defineProperty(e={cid:null,like:null,watch:null,content:null,column:null,product:null,name:null,src:null,poster:null,linkSrc:null,errPassword:""},"poster",null),_defineProperty(e,"timeLeft",null),_defineProperty(e,"wdShow",null),_defineProperty(e,"guests",null),_defineProperty(e,"related",null),_defineProperty(e,"topId",null),_defineProperty(e,"isClass",!0),e),methods:{changeStyle:function(){this.isClass=!this.isClass,setTimeout(function(){leftScrolla.refresh()},0)},judggePassword:function(){var n=this;console.log(this.cid),$.ajax({url:URL+"/webapi/banner/live-particulars",type:"get",dataType:"json",data:{cid:this.cid},success:function(e){var t,o;0<=e.state.rc&&($.ajax({url:"http://livetapi.v114.com/appapi/videoroom/greatvideolist",type:"get",dataType:"json",data:{user_id:userid,page:1,pagesize:100},success:function(e){console.log(e),0==e.state.rc&&(n.wdShow=e.result.items)},error:function(e){console.log(e)}}),console.log(e),n.like=e.detail_data.like,n.watch=e.detail_data.pv,localStorage.mediacloud_id=e.detail_data.mediacloud_id,n.topId=e.detail_data.tid,console.log(e.detail_data.tid),tid=e.detail_data.tid,localStorage.qnTid=tid,$("body").append('<script src="js/qqim/js/login.js"><\/script>'),$("body").append("<script> $(function(){console.log(localStorage.qnTid); onlineNum(localStorage.qnTid,'callback',localStorage.cu_user_name); });<\/script>"),n.content=e.detail_data.content_desc,n.column=e.detail_data.column_desc,n.product=e.product_data,n.name=e.detail_data.name,n.linkSrc=e.live_data.video_url,n.poster=e.live_data.content_img,1==e.live_data.live_type?2==e.live_data.watch?($("#videoContainer").css("background-image","url("+n.poster+")"),$("#appointment").css("display","block"),$("#videos").css("display","none"),n.leftTime(e.live_data.live_start),t=setInterval(function(){n.leftTime(e.live_data.live_start)},1e3),e.live_data.live_start-(new Date).getTime()<=0&&(clearInterval(t),window.location.reload())):0==e.live_data.watch&&($("#videoContainer").css("background-image","url("+n.poster+")"),$("#appointment").css("display","block"),$("#videos").css("display","none"),$(".nowBook").css("display","none"),n.leftTime(e.live_data.live_start),o=setInterval(function(){n.leftTime(e.live_data.live_start)},1e3),e.live_data.live_start-(new Date).getTime()<=0&&(clearInterval(o),window.location.reload())):2==e.live_data.live_type?0==e.live_data.watch?n.src=n.linkSrc:1==e.live_data.watch?($("#popUp").show(),$("#passWord").show()):2==e.live_data.watch&&($("#popUp").show(),$("#Vcode").show(),$("#cancelyy").click(function(){$("#popUp").hide(),$("#Vcode").hide()}),$("#sendCode").click(function(){$("#imgCode").val()?checkPhone($("#watchPhoneNumber").val())&&$.ajax({url:URL+"/appapi/wx/sendcode",type:"get",dataType:"json",data:{id:n.cid,phone:$("#watchPhoneNumber").val(),imgcode:$("#imgCode").val(),timeflag:timeflag2},success:function(e){var t,o;console.log(e),0==e.state.rc?(showTip("短信已发送到手机注意查收"),$("#sendCode").css("display","none"),$("#countDown").css("display","block"),t=60,o=setInterval(function(){t--,$("#countDown").html(t),console.log(t),0==t&&(clearInterval(o),$("#countDown").css("display","none"),$("#sendCode").css("display","block"))},1e3)):(showTip(e.state.msg),getCode())}}):showTip("请输入图片验证码")}),$("#confirmCode").click(function(){$("#imgCode").val()?$("#watchVcode").val()?$.ajax({url:URL+"/appapi/wx/authorize",type:"get",dataType:"json",data:{id:n.cid,code:$("#watchVcode").val(),imgcode:$("#imgCode").val(),phone:$("#watchPhoneNumber").val()},success:function(e){0==e.state.rc?(n.src=n.linkSrc,$("#popUp").hide(),$("#Vcode").hide()):showTip(e.state.msg)}}):showTip("请输入短信验证码"):showTip("请输入图片验证码")})):3==e.live_data.live_type&&(0==e.live_data.watch?n.src=n.linkSrc:1==e.live_data.watch&&($("#popUp").show(),$("#passWord").show())))}})},addLike:function(){var t=this,e={topic_id:this.topId};console.log(JSON.stringify(e)),$.ajax({url:URL+"/like",type:"post",dataType:"json",data:JSON.stringify(e),success:function(e){console.log(e),0<=e.state&&"Success"==e.msg?(console.log(t.like),sendGroupLoveMsg()):showTip("点赞频率过快")},error:function(e){console.log(e)}})},toBooks:function(){var o=this;$(".bookBox").show(),$(".bookVideo").show(),$("#zq-btn").unbind(),getCode(),$("#zq-BookC").click(function(){$(".bookBox").hide(),$(".bookVideo").hide()}),$("#zq-btn").bind("click",function(){var e=$("#tel").val(),t=$("#bookCode").val();""!=e&&checkPhone(e)?""!=t?$.ajax({url:URL+"/appapi/wx/book",type:"get",dataType:"json",cache:!1,data:{id:o.cid,phone:e,imgcode:t,timeflag:timeflag2},error:function(e){console.log(e)},success:function(e){if(console.log(e),0==e.state.rc)return showTip(e.state.msg),$(".bookBox").hide(),void $(".bookVideo").hide();showTip(e.state.msg)}}):showTip("请输入图片验证码"):showTip("请输入正确手机号码")})},checkPassword:function(){var t=this;""!=$("#watchPassword").val()&&null!=$("#watchPassword").val()?$.ajax({type:"get",dataType:"json",url:URL+"/appapi/wx/authorize",data:{id:this.cid,code:$("#watchPassword").val()},success:function(e){console.log(e),0==e.state.rc?(t.src=t.linkSrc,$("#popUp").hide()):showTip("请输入正确的观看密码")},error:function(e){console.log(e)}}):showTip("请输入正确的观看密码")},toRelated:function(e){window.location.href="./details.html?cid="+e},guest:function(){this.guests=[{img:headPic,name:nick_name,intro:introduce}],setTimeout(function(){"block"==$(".guest").css("display")&&(leftScrolla=new IScroll(".guest",{scrollX:!0,freeScroll:!0,click:!0,tap:!0}))},100)},wdShowType:function(e){return 1==e?"直播":2==e?"热播中...":3==e?"回看":void 0},towdShow:function(e){window.location.href="./manadetail.html?cid="+e+"&userid="+userid+"&headImg="+headPic+"&nickName="+nick_name+"&introDuce="+introduce},program:function(){setTimeout(function(){new IScroll(".program",{scrollX:!0,freeScroll:!0,click:!0,tap:!0})},1e3)},leftTime:function(e){var t=e-(new Date).getTime(),o=parseInt(t/1e3/60/60,10),n=parseInt(t/1e3/60%60,10),i=parseInt(t/1e3%60,10),o=this.checkTime(o),n=this.checkTime(n),i=this.checkTime(i);this.timeLeft=o+":"+n+":"+i},checkTime:function(e){return e<10&&(e="0"+e),e},toDetail:function(e){window.location.href="http://"+e},getQueryStringByName:function(e){var t=location.search.match(new RegExp("[?&]"+e+"=([^&]+)","i"));return null==t||t.length<1?"":t[1]}},created:function(){setTimeout(function(){new IScroll(".content",{scrollX:!0,freeScroll:!0,click:!0})},1e3),this.cid=this.getQueryStringByName("cid"),this.judggePassword(),this.guest()}});function l(e){$("#promoteProduct").css("display","none"),document.getElementById("videoContainer").ontouchstart=null,e.preventDefault(),document.getElementById("productUrl").style.display="none",document.getElementById("videoContainer").style.width="100%",document.getElementById("videoContainer").style.height="3.2rem",document.getElementById("videoContainer").style.position="absolute",document.getElementById("videoContainer").style.left="0",document.getElementById("videoContainer").style.top="0.98rem",document.getElementById("videoContainer").style.zIndex="999",document.getElementById("videoContainer").style.background=null,$("#videos").css({position:"static",width:"100%",height:"100%"}),$("#dragMove").css("display","none"),document.getElementById("videos").setAttribute("height","100%"),document.getElementById("videos").setAttribute("controls",""),document.getElementById("close").style.display="none",$("#Interactive").css("display","none")}$(".tablist li").click(function(){$(this).addClass("active"),$(this).siblings().removeClass("active"),$(".visiable").eq($(this).index()).siblings().css("display","none"),$(".visiable").eq($(this).index()).css("display","block")}),$("#guest").click(function(){}),$("#cancel").click(function(){$("#popUp").css("display","none")}),$("#back").click(function(){window.history.back()}),$("#watchPhoneNumber").blur(function(){checkPhone($(this).val())||showTip("请输入正确手机号")}),$("#chat").click(function(){setTimeout(function(){var e=document.getElementById("video_sms_list").scrollHeight;$(".video-comment-content").animate({scrollTop:e},300)},300)}),$("#promoteProduct").click(function(e){var t;"block"==$("#promoteProduct").css("display")&&(t=$("#promoteProduct").children("span").attr("data-href"),$("#productUrl").attr("src",t),$(".closeProduct").css("display","none")),document.getElementById("productUrl").height=document.documentElement.clientHeight,document.getElementById("productUrl").width=document.documentElement.clientWidth,e.preventDefault(),$("#promoteProduct").css("display","none"),$("#close").css({display:"block",width:"59px",height:"59px",position:"absolute",left:"87px",top:"14px",background:"url(./img/moveBack.png) no-repeat center center",backgroundSize:"100% 100%"}),$("#dragMove").css({display:"block",width:"59px",height:"59px",position:"absolute",left:"87px",bottom:"31px",background:"url(./img/movedrag.png) no-repeat center center",backgroundSize:"100% 100%"});var o=document.getElementById("productUrl").style.display;document.getElementById("productUrl").style.display="none"==o?"block":"none",$("#videoContainer").css({width:"232px",height:"288px",background:"url(./img/moveBG.png) ",backgroundPosition:"0 0",backgroundSize:"100% 100%",position:"absolute",left:"200px",top:"50px",zIndex:"999"}),$("#videos").css({width:"205px",height:"134px",position:"absolute",left:"13px",top:"69px"}),document.getElementById("videos").setAttribute("height","60%"),document.getElementById("videos").removeAttribute("controls"),$("#close").bind("click",l),document.getElementById("dragMove").ontouchstart=function(e){document.body.ontouchmove=function(e){e.preventDefault()},$("#close").unbind("click",l);var n=document.getElementById("videoContainer"),e=e||window.event;console.log(e);var i=e.touches[0].clientX-n.offsetLeft,c=e.touches[0].clientY-n.offsetTop;console.log(i),console.log(c),document.ontouchmove=function(e){var t=(e=e||window.event).touches[0].clientX-i,o=e.touches[0].clientY-c;console.log(t,o),t<=0?n.style.left=0:t>=document.documentElement.clientWidth-n.clientWidth?n.style.left=document.documentElement.clientWidth-n.clientWidth+"px":n.style.left=t+"px",o<=0?n.style.top=0:o>=document.documentElement.clientHeight-n.clientHeight?n.style.top=document.documentElement.clientHeight-n.clientHeight+"px":n.style.top=o+"px"},document.ontouchend=function(){document.ontouchmove=null,$("#close").bind("click",l)}}}),$(".closeProduct").click(function(e){e.stopPropagation(),$("#promoteProduct").css("display","none"),$(".closeProduct").css("display","none")}),$(".weixuanzhong").click(function(){$(".weixuanzhong").removeClass("xuanzhong"),$(this).addClass("xuanzhong")}),$.ajax({url:URL+"appapi/question/getquestions",type:"get",dataType:"json",data:{},success:function(e){0==e.state.rc&&(questionData=e.result.questions)},error:function(e){console.log(e)}}),$("#startQuestion").click(function(){})});