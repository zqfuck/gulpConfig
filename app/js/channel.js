
$(document).ready(function () {

    var companyId = localStorage.companyId?localStorage.companyId:getCompanyId('qy_companyid') ;//获取企业id
    var columnid = getQueryStringByName('columnid');   //获取地址栏的columnid；
    $('#back').click(function(){
		window.history.back();
    });

    $(".focusSkip").focus(function () {
        $(".searchMask").show();
        $('#zq-search').focus();
        $('.listL').empty();
        $(".listHot").empty();
        var val = "";
        $("#zq-search").val('');
        stop();
        $.ajax({
            url: URL + '/webapi/banner/get-data',
            type: "get",
            dataType: "json",
            cache: false,
            data: {
                id: companyId,
                type:3
            },
            error: function (data) {
                console.log(data);
            },
            success: function (data) {
                if (data.state==0){
                    var data = data.data;
                    var html = '';
                    $.each(data,function (i, ele) {
                        html+='<li class="zq-searchL zq-click">'+ele.title+'</li>';
                    });
                    $(".listHot").append(html);
                };
            }
        });
        $(".listHot").on('click','.zq-click',function () {
            $('.listL').empty();
            val = $(this).text();
            searchList();
        });

        $("#zq-search").keyup(function(){
            $('.listL').empty();
           // $('.nameList').css({'height':"auto","overflow-y":"auto"});
            $(".listL").removeClass("hidden");
            val =  $.trim($("#zq-search").val());
            searchList();
        });

        //搜索
        function searchList() {
            $.ajax({
                url: URL + '/appapi/wx/search',
                type: "get",
                dataType: "json",
                cache: false,
                data: {
                    id: companyId,
                    value:val,
                    pagesize:10,
                    page:1
                },
                error: function (data) {
                    console.log(data);
                },
                success: function (data) {
                    if (data.state.rc==0){
                        $('.listL').empty();
                        var result = data.result.items;
                        var nameLink='details.html?cid='
                        $.each(result,function (i, ele) {
                            var commentList = {
                                nameSearch : ele.name,
                                nameLink: nameLink+ele.cid+"&qy_companyid="+companyId
                            };
                            var chatHtml;
                            chatHtml = $("#nameList").render(commentList);
                            $('.listL').append(chatHtml);
                        })
                    };
                }
            });
        };
    });

    $(".btn-nav").click(function () {
        stop();
        $('.topHot').empty();
        $(".topTenMask").show();
        $.ajax({
            url: URL + '/webapi/banner/get-data',
            type: "get",
            dataType: "json",
            cache: false,
            data: {
                id: companyId,
                type:2
            },
            error: function (data) {
                console.log(data);
            },
            success: function (data) {
                console.log(data)
                if (data.state==0){
                    var data = data.data;
                    var nameLink='details.html?cid='
                    $.each(data,function (i, ele) {
                        var commentList = {
                            nameSearch : ele.title,
                            top:i+1,
                            nameLink: nameLink+ele.cid+"&qy_companyid="+companyId
                        };
                        var chatHtml;
                        chatHtml = $("#topList").render(commentList);
                        $('.topHot').append(chatHtml);
                        $(".topBj").eq(0).css({"background":"#ee3e3e"});
                        $(".topBj").eq(1).css({"background":"#ee993e"});
                        $(".topBj").eq(2).css({"background":"#eedf3e"});
                    })
                };
            }
        });
    });

    $(".zq-cancel").click(function () {
        $(".searchMask").hide();
        move()
    });
    $(".topCancel").click(function () {
        $(".topTenMask").hide();
        move()
    });

/*----------------以上为搜索和排行榜-----------*/

var app=new Vue({
    el:'#app',
    data:{
        message:[],
        page:1,
        timeLeft:null,
        pagesize:6,
        count:'',
        timeOutMessage:[],
        lock:false
    },
    methods:{
        scrollBottom:function(){

        },
        toDetail:function(cid){
            window.location.href="./details.html?cid="+cid+"&qy_companyid="+companyId;
            //console.log(cid);
        },
        liveType:function(type,isBook,live_start){
            var now=new Date().getTime();
           
            if(type==3){
                return "回放";
            }else if(type==1){
               
                if(now>live_start){
                    return "直播";

                }else if(isBook==1){
                    return "预约";
                }else{
                    return "敬请期待";
                }
            }else if(type==2){
                return "点播";
            }
            
        },
        timeOut:function(){
           
        },
        leftTimea:function(time){
            
                var leftTime = time; //计算剩余的毫秒数
                var hours = parseInt(leftTime / 1000 / 60 / 60 , 10); //计算剩余的小时
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                hours = this.checkTime(hours);
                minutes = this.checkTime(minutes);
                seconds = this.checkTime(seconds);
                //document.getElementById("timer").innerHTML =  hours+":" + minutes+":"+seconds;
                time = hours+":" + minutes+":"+seconds;
                return time;
        },
        checkTime:function(i){
           if(i<10) {
                i = "0" + i;
            }
            return i;
        },
        loadMore:function(){
            var pageNum=Math.ceil((this.count)/(this.pagesize));
            if(this.page<=pageNum ){
                this.list();
            }
        },
        toBook:function(cid){
            $(".bookBox").show();
            $(".bookVideo").show();
            $("#zq-btn").unbind();
            getCode();
            $("#zq-BookC").click(function () {
                $(".bookBox").hide();
                $(".bookVideo").hide();
                return;
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
                    data: {
                        id:cid,
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
                            $("#tel").val("");
                            $("#bookCode").val("");
                            showTip(data.state.msg);
                            $(".bookBox").hide();
                            $(".bookVideo").hide();
                            return;
                        }else{
                            showTip(data.state.msg);
                            return;
                        }
                    }
                });
            })
        },
        getScrollTop:function(){
            var scrollTop = 0;
              if(document.documentElement && document.documentElement.scrollTop) {
                 scrollTop = document.documentElement.scrollTop;
              } else if(document.body) {
                 scrollTop = document.body.scrollTop;
             }
             return scrollTop;
        },
        getClientHeight:function(){
            var clientHeight = 0;
                        if(document.body.clientHeight && document.documentElement.clientHeight) {
                             clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
                        } else {
                            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
                        }
                     return clientHeight;
        },
        list:function(){
            //console.log(this.page);
            var that=this;
                $.ajax({
                    url: URL + '/appapi/wx/channellist',
                    type: "get",
                    dataType: "json",
                    cache: false,
                    data: {
                        columnid:columnid,
                        page:this.page,
                        pagesize: this.pagesize
                    },
                    error: function (data) {
                        console.log(data);
                    },
                    success: function (data) {
                        that.page++;
                        console.log(data);
                        if(data.state.rc==0){
                           // clearInterval(that.timer);
                            that.count=data.result.totalcount;
                           
                            //console.log(that.count);
                           // console.log(data.result.items);
                            for(var i=0;i<data.result.items.length;i++){
                                that.message.push(data.result.items[i]);
                            }
                            console.log(that.message);
                           
                          that.message.forEach(function(item){
                              var isHave=that.timeOutMessage.indexOf(item);
                              if( item.count_num && (isHave==-1) ){
                                  that.timeOutMessage.push(item);
                              }
                          });
                          console.log(that.timeOutMessage);
                          that.lock=true;
                          
                        }
                    }
                });
          
           },
           liveTypeBg:function(type,isBook){
               if(isBook==1){
                   return "status beforeLive";
               }
               if(type==2 ||type==3){
                   return "status backLive";
               }else {
                   return "status nowLive";
               }
           },
           getScrollHeight:function(){
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
           },
            upCallback:function(){
               this.list(); 
            }
        },
        created:function(){
            var that=this;
            this.list();
            
          
           // console.log(this.timeOutMessage);
             setInterval(function(){
                that.timeOutMessage.forEach(function(item,index){
                    
                    // if(that.page==2){
                        item.count_num -=1000;
                    // }else if(that.page==3){
                    //     item.count_num -=500;
                    // }
                    
                    if(item.count_num<=0){
                        $('.apportTimeout').eq(index).css('display','none');
                    }else{
                        var time=that.leftTimea(item.count_num)
                        $('.timeFont').eq(index).html(time);
                    }
                  
                });
           },1000);
          
            
        },
        mounted:function(){
            var that=this;
            var self=this;
			window.onscroll=function () {
                 if(self.getScrollTop() + self.getClientHeight() >= (self.getScrollHeight())-60) {
                         if(self.lock){
                             self.loadMore();   
                             self.lock=false; 
                         }            
                   }
             };
             
                     
            
            
        }
    })

});

















































