/**
 * Created by Administrator on 2018/1/24.
 */
var feed = location.host.split('.')[0];
var URL = window.location.protocol + "//" + feed + 'api.v114.com';
var URL = 'http://liveapi.v114.com';
//var companyId = 'NDg=';//测试企业Id;
var columnid = getQueryStringByName('columnid');   //获取地址栏的columnid；

$(".back").click(function () {
    goBack();
})
function goBack() {
    window.history.back();
}
function getCompanyId(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));

    if (result == null || result.length < 1) {

        return "";

    }

    return result[1];
}

//获取图片验证码
var timeflag = new Date().getTime();
var timeflag2;
getCode();
function getCode() {
    $(".picImg").prop("src", URL + "/appapi/wx/getimgcode?timeflag=" + timeflag);
    timeflag2 = timeflag;
    timeflag = new Date().getTime();
};

/*显示提醒*/
function showTip(msg) {
    var topTip = $("<div class='tip'><div class='fadeIn'>" + msg + "</div></div>");
    $("body").append(topTip);
    setTimeout(function () {
        topTip.remove();
    }, 2000);
}
//显示错误提醒
function showError(className) {
    $("." + className + "").css({"visibility": "visible"});
    setTimeout(
        function () {
            $("." + className + "").css({"visibility": "hidden"});
        }, 2000);
};

//实现滚动条无法滚动
var mo = function (e) {
    e.preventDefault();
};
/***禁止滑动***/
function stop() {
    document.body.style.overflow = 'hidden';
    document.addEventListener("touchmove", mo, false);//禁止页面滑动
}
/***取消滑动限制***/
function move() {
    document.body.style.overflow = '';//出现滚动条
    document.removeEventListener("touchmove", mo, false);
}


function focusId(id) {
    if (id.length > 0) {
        var input = document.getElementById(id);
        var val = input.value;
        input.value = "";
        input.value = val;
        document.getElementById(id).focus();
    }
};


function isPhoneNumber(phoneNumber) {
    var isPhone = true;
    if (phoneNumber == null || phoneNumber == '') {
        isPhone = false;
    }
    if (phoneNumber.length != 11) {
        isPhone = false;
    }
    var str = "^[1][3,4,5,7,8][0-9]{9}$";
    //var str=/^[1][3,4,5,7,8][0,9]{9}$/;
    if (!phoneNumber.match(str)) {
        isPhone = false;
    }
    return isPhone;
}

// 验证码倒计时
function setRemainTime() {

    if (count <= 0) {
        //	$("#generCode").removeClass("bcolor3").addClass("bcolor2");
        $("#stext").show();
        $("#timer").hide();
        count = 60;
        generate = false;
    } else {
        //	$("#generCode").removeClass("bcolor2").addClass("bcolor3");
        $('#timer').html(count + 's后重发');
        count--;
        setTimeout(setRemainTime, 1000);
    }
};
function checkPhone(phone) {

    var len = phone.length;
    if (len != 11 || !isPhoneNumber(phone)) {
        return false;
    }
    return true;
};
//获取地址栏参数
function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
//支持中文获取
function getUrlParam(key) {
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
}

var company_id = getCompanyId('__biz') ? getCompanyId('__biz') : getCompanyId('qy_companyid');
//title
var qy_CompanyId = getCompanyId('qy_companyid') ? getCompanyId('qy_companyid') : company_id;
localStorage.companyId = localStorage.companyId ? localStorage.companyId : qy_CompanyId;
//获取标题
acquireTitle();
function acquireTitle() {
    $.ajax({
        url: "http://livetapi.v114.com/appapi/wx/title",
        type: "get",
        dataType: "json",
        data: {
            id: company_id,
        },
        error: function (data) {
            console.log(data);
        },
        success: function (data) {
            console.log(data)
            if (data.state.rc == 0) {
                var qy_title = data.state.title;
                localStorage.qy_title = qy_title;//存储企业title
                $("title").html(qy_title);
            }
        }
    })
};


//cu用户信息获取
/*var localZhiXin = localStorage.companyId ? localStorage.companyId : localStorage.mediacloud_id;*/

if (company_id == 'NzM=') {
    $("body").append('<script src="js/zhixinHybrid.min.js"></script>');
    var s_id='';
    function getToken() {
        if (!zhixinHybrid.isAvailable('getToken')) {
            //在CU的IOS环境下要这个if语句！！！
            console.log("不支持该环境");
            showError("不支持该环境");
            return;
        }
        var sid = zhixinHybrid.requestHybridToZHIXIN({
            tagname: 'getToken()',
            callback: function (data) {
                //初始化sid到localStorage
                localStorage.s_id = sid;
                s_id = sid;
                //alert(sid + "1111")
                getUserName();
            }
        });
    }

    try {
        //--------初始化token(非常重要)----------
        window.afterZhiXinLoad = function () {
            console.log("after onZhixinLoad end");
            //alert("after onZhixinLoad end")
            getToken();
        }
        window.afterZhiXinLoad();
//CU IOS版一定要有这个载入函数（智信内置函数）

        if (!s_id) {
            window.onZhiXinLoad = function () {
                console.log('Android or IOS has already prepared.');
                //alert("Android or IOS has already prepared.")
                zhixinHybrid.prepared = true;
                zhixinHybrid.requestHybridToZHIXIN({
                    tagname: 'getToken()',
                    callback: function (data) {
                        var sid = '';
                        // 兼容app版本差异
                        if (typeof data === 'object') {
                            sid = data.sid;
                        } else if (typeof data === 'string') {
                            sid = data;
                        }
                        if (!sid) {
                            console.log('获取sessionId失败');
                            localStorage.s_id = null;
                            showError("该链接不允许在CU客户端外打开");
                            return 'fail';
                        }
                        localStorage.s_id = sid;
                         //alert('getToken sid: ' + sid)
                        getUserName();
                        console.log('getToken sid: ' + sid);

                        return 'sucess'
                    }
                });
            };
        }
        ;
    } catch (error) {
        showError("该链接不允许在CU客户端外打开");
    }

    //根据sid获取用户信息
    function getUserName() {
        $.getJSON(URL + "/wx/getuserinfo",{sid:localStorage.s_id},function (json) {
            alert(data + "username")
            var user_name = data.userinfo.username;
            localStorage.cu_user_name = user_name;
            alert(localStorage.cu_user_name)
        });

    }


    function showError(msg) {
        var maskError = $("<div style='position: fixed;left: 0;top: 0;bottom: 0;right: 0;background: #000;opacity: 0.6;z-index: 99'></div>")
        var topTip = $("<div class='tip'><div class='' style='opacity: 1;'>" + msg + "</div></div>");
        $("body").append(maskError);
        $("body").append(topTip);
    }

}



//本地遍历导航列表
var navArr = [];//导航标题
var comidArr = [];//频道id

if (localStorage.navArr) {
    $(".menu_Nav").empty();
    var str = '';
    $.each(JSON.parse(localStorage.navArr), function (i, ele) {
        str += '<span><a href="channel.html?qy_companyid=' + company_id + '&columnid=' + (JSON.parse(localStorage.comidArr))[i] + '">' + ele + '</a></span>';
    });
    $(".menu_Nav").prepend(str);
    if(localStorage.countNav<=3){
        $(".menu_Nav").css("width", "100%");
    }else {
        $(".menu_Nav").css("width", (localStorage.countNav * 40) + "%");
    }
    $(".menu_Nav span a").eq(0).prop('href', 'index.html?__biz=' + company_id);
    if ($(".menu_Nav span a").last().html() == "客户经理") {
        $(".menu_Nav span a").last().prop('href', 'manager.html?columnid=001&qy_companyid=' + company_id);
    }
    if (!columnid) {
        $(".menu_Nav span a").eq(0).addClass("spanActive");
    }


    for (var i = 0; i < JSON.parse(localStorage.comidArr).length; i++) {
        if ((JSON.parse(localStorage.comidArr))[i] == columnid) {
            $(".menu_Nav span a").removeClass("spanActive");
            $(".menu_Nav span a").eq(0).removeClass("spanActive");
            $(".menu_Nav span a").eq(i).addClass("spanActive");
            if (i > 2) {
                $("header").animate({
                    scrollLeft: (i * 85) + "%"
                }, 300);

            }
        }
    }
}

//频道导航列表

$.ajax({
    url: URL + '/appapi/wx/channel',
    type: "get",
    dataType: "json",
    cache: false,
    data: {
        id: company_id
    },
    error: function (data) {
        console.log(data);
    },
    success: function (data) {
        console.log(data)
        if (data.state.rc >= 0) {
            if (data.result.type >= 0) {
                var totalcount = data.result.totalcount + 1;
                localStorage.countNav = totalcount;
            } else {
                var totalcount = data.result.totalcount;
                localStorage.countNav = totalcount;
            }
            var result = data.result.items;
            // console.log(result);
            if (!localStorage.navArr) {
                var str = '';
                $.each(result, function (i, ele) {
                    navArr.push(ele.name);
                    comidArr.push(ele.columnid);
                    str += '<span>' +
                        '<a href="channel.html?qy_companyid=' + company_id + '&columnid=' + ele.columnid + '">'
                        + ele.name + '</a>' +
                        '</span>';
                });
                if (data.result.type == 1) {
                    navArr.push("客户经理");
                    comidArr.push("001");
                    str += ' <span><a href="./manager.html?columnid=001&qy_companyid=' + company_id + '>客户经理</a></span>';
                }
                $(".menu_Nav").prepend(str);
                if(totalcount<=3){
                    $(".menu_Nav").css("width", "100%");
                }else {
                    $(".menu_Nav").css("width", (totalcount * 40) + "%");
                }
                $(".menu_Nav span a").eq(0).prop('href', 'index.html?__biz=' + company_id);

                if (!columnid) {
                    $(".menu_Nav span a").eq(0).addClass("spanActive");
                } else {
                    for (var i = 0; i < comidArr.length; i++) {
                        if (comidArr[i] == columnid) {
                            $(".menu_Nav span a").removeClass("spanActive");
                            $(".menu_Nav span a").eq(0).removeClass("spanActive");
                            $(".menu_Nav span a").eq(i).addClass("spanActive");
                            if (i > 2) {
                                $("header").animate({
                                    scrollLeft: (i * 85) + "%"
                                }, 300);

                            }
                        }
                    }
                }
                localStorage.navArr = JSON.stringify(navArr);
                localStorage.comidArr = JSON.stringify(comidArr);
            } else {
                $.each(result, function (i, ele) {
                    navArr.push(ele.name);
                    comidArr.push(ele.columnid);
                });
                if (data.result.type == 1) {
                    navArr.push("客户经理");
                    comidArr.push("001");
                }
                localStorage.navArr = JSON.stringify(navArr);
                localStorage.comidArr = JSON.stringify(comidArr);
            }
        }
    }
});































