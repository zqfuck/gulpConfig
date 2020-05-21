/**
 * Created by louqq on 2018/6/13.
 */
$(document).ready(function () {
    var companyId = localStorage.companyId?localStorage.companyId:getCompanyId('qy_companyid');
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
                type: 3
            },
            error: function (data) {
                console.log(data);
            },
            success: function (data) {
                if (data.state == 0) {
                    var data = data.data;
                    var html = '';
                    $.each(data, function (i, ele) {
                        html += '<li class="zq-searchL zq-click">' + ele.title + '</li>';
                    });
                    $(".listHot").append(html);
                }
                ;
            }
        });
        $(".listHot").on('click', '.zq-click', function () {
            $('.listL').empty();
            val = $(this).text();
            searchList();
        });

        $("#zq-search").keyup(function () {
            $('.listL').empty();
            // $('.nameList').css({'height':"auto","overflow-y":"auto"});
            $(".listL").removeClass("hidden");
            val = $.trim($("#zq-search").val());
            searchList();
        });
        $(".zq-cancel").click(function () {
            $(".searchMask").hide();
            move()
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
                    value: val,
                    pagesize: 10,
                    page: 1
                },
                error: function (data) {
                    console.log(data);
                },
                success: function (data) {
                    if (data.state.rc == 0) {
                        $('.listL').empty();
                        var result = data.result.items;
                        var nameLink = 'details.html?cid='
                        $.each(result, function (i, ele) {
                            var commentList = {
                                nameSearch: ele.name,
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


   var app = new Vue({
        el: "#app",
        data: {
            managerList: [],
            page: 1,
            pagesize:10,
            count:'',
            lock:false
        },
        created:function(){
            this.getList();
        },
        methods: {
            toDetail: function (userid, cid,imgurl,nickname,introduce) {
                localStorage.userid = userid;
                localStorage.cid = cid;
                window.location.href = "./manadetail.html?cid=" + cid + "&userid=" + userid+"&headImg="+imgurl+
                    "&nickName="+nickname+"&introDuce="+introduce+"&qy_companyid="+companyId;
            },

            getList:function(){
                var that = this;
                $.ajax({
                   // url: URL + "/appapi/videoroom/streamerlist",
                    url: "http://livetapi.v114.com/appapi/videoroom/streamerlist",
                    type: "get",
                    dataType: 'json',
                    data: {
                        mediacloud_id: companyId,
                        page: this.page,
                        pagesize: this.pagesize
                    },
                    error:function(error){
                        console.log(error)
                    },
                    success:function(data){
                        console.log(data)
                        if (data.state.rc == 0) {
                            that.count = data.result.count;//总条数
                            var result = data.result.data;
                            $.each(result,function (i,ele) {
                                that.managerList.push(ele) ;
                            });
                        };
                        that.lock=true;
                    }
                })
            },
            loadMore:function(){
                var pageNum=Math.ceil((this.count)/(this.pagesize));
                this.page++;
                if(this.page<=pageNum ){
                    this.getList();
                }
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
            getScrollHeight:function(){
                return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            },
            liveState:function(i){
                if (i == 0) {
                    return "mnone";
                } else {
                    return "mlive";
                }
            }
        },
       mounted:function(){
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

})