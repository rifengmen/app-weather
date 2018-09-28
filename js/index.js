// 1.获取当前城市的天气信息
let tianqi;
$.ajax({
    type: "get",
    url: "https://www.toutiao.com/stream/widget/local_weather/data/?city=太原",
    dataType: "jsonp",
    success: function (obj) {
        tianqi = obj.data;
        console.log(tianqi);
        updata(tianqi);
    }
});
// 函数封装ajax请求数据方式
function fnajax(citys) {
    let urls = "https://www.toutiao.com/stream/widget/local_weather/data/?city="+citys;
    let tianqi1;
    $.ajax({
        type: "get",
        url: urls,
        dataType: "jsonp",
        success: function (obj) {
            tianqi1 = obj.data;
            updata(tianqi1);
        }
    });
}
// 获取天气数据
function updata(tianqi) {
    // 获取当前城市
    $(".citysNow").html(tianqi.city);
    // 获取当前空气质量
    $(".airNow").html(tianqi.weather.quality_level);
    // 获取当前温度
    $(".downTop").html(tianqi.weather.current_temperature+"°");
    // 获取天气状况
    $(".downMiddle").html(tianqi.weather.current_condition);
    // 获取风力状况
    $(".downBottom").html(tianqi.weather.wind_level+"级");
    // 今明两天预报
    let tomorrowStr = `<div class="left weather">
                            <div>
                                <span>今天</span>
                                <span>${tianqi.weather.dat_condition}转${tianqi.weather.night_condition}</span>
                            </div>
                            <div>
                                <span>
                                    <span class="max">${tianqi.weather.dat_high_temperature}</span>/
                                    <span class="min">${tianqi.weather.dat_low_temperature}</span>°C
                                </span>
                                <span>
                                    <img src="./img/${tianqi.weather.dat_weather_icon_id}.png" alt="">
                                </span>
                            </div>
                        </div>
                        <div class="inter"></div>
                        <div class="right weather">
                            <div>
                                <span>明天</span>
                                <span>${tianqi.weather.tomorrow_condition}</span>
                            </div>
                            <div>
                                <span>
                                    <span class="max">${tianqi.weather.tomorrow_high_temperature}</span>/
                                    <span class="min">${tianqi.weather.tomorrow_low_temperature}</span>°C
                                </span>
                                <span>
                                    <img src="./img/${tianqi.weather.weather_icon_id}.png" alt="">
                                </span>
                            </div>
                        </div>`;
    $(".tomorrow").html(tomorrowStr);
    // 今日天气详情
    $(".todayText").html("");
    let todayArr = tianqi.weather.hourly_forecast;
    todayArr.forEach(v => {
        let todayStr = `<li>
                        <span>${v.hour}</span>
                        <span>
                            <img src="./img/${v.weather_icon_id}.png" alt="">
                        </span>
                        <span>${v.temperature}°</span>
                    </li>`;
        $(".todayText").append(todayStr);
    })
    // 未来半个月天气预报部分
    $(".week ul").html("");
    let weekArr = tianqi.weather.forecast_list;
    weekArr.forEach(v => {
        let weekStr = `<li>
                            <div>
                                <span>${v.date.slice(5,10)}</span>
                            </div>
                            <div>${v.condition}</div>
                            <div>
                                <img src="./img/${v.weather_icon_id}.png" alt="">
                            </div>
                            <div>${v.high_temperature}°</div>
                            <div>
                                <span class="dots dotDown"></span>
                            </div>
                            <div>
                                <span class="dots dotUp"></span>
                            </div>
                            <div>${v.low_temperature}°</div>
                            <div>
                                <span>${v.wind_direction}</span>
                                <span>${v.wind_level}级</span>
                            </div>
                        </li>`;
        $(".week ul").append(weekStr);
    })
}
// 显示选择城市页面
$("header .citys").click(function () {
    $("div.hid").css({"display":"block"});
    $("main").css({"display":"none"});
});
$(".hidRight").click(function () {
    $("div.hid").css({"display":"none"});
    $("main").css({"display":"block"});
});
// 获取城市信息
let city;
$.ajax({
    type: "get",
    url: "https://www.toutiao.com/stream/widget/local_weather/city/",
    dataType: "jsonp",
    success: function (obj) {
        city = obj.data;
        updataCity(city);
    }
});
function updataCity() {
    let k = 1;
    $.each(city,function (indexs,vals) {
        let str = `<ul class="prov">${indexs}<br></ul>`;
        $(".cityHome").append(str);
        $.each(vals,function (i) {
            let str1 = `<li>${i}</li>`;
            $("ul.prov").eq(k).append(str1);
        });
        k++;
    });
}
// 所有数据加载完成后执行
window.onload = function () {
    // 点击每个城市，获取当前城市的天气信息
    $(".hid").find("li").click(function () {
        let con = $(this).html();
        fnajax(con);
        $("div.hid").css({"display":"none"});
        $("main").css({"display":"block"});
    })
    // 点击搜索框，输入搜索内容
    $("input").focus(function () {
        $(".hidRight").html("搜索");
    });
    // 点击搜索时获取input中的内容进行搜索
    $(".hidRight").click(function () {
        $.each(city,function (indexs,vals) {
            $.each(vals,function (i) {
                if ($("input").val() == i) {
                    fnajax($("input").val());
                }
            })
        })
        alert("请输入正确的城市名称");
    });
}