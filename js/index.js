// 1.获取当前城市的天气信息
let tianqi;
$.ajax({
    type: "get",
    url: "https://www.toutiao.com/stream/widget/local_weather/data/?city=太原",
    dataType: "jsonp",
    success: function (obj) {
        tianqi = obj.data;
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
    let high = [];
    let low = [];
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
                            <div id="place"></div>
                            <div>${v.low_temperature}°</div>
                            <div>
                                <span>${v.wind_direction}</span>
                                <span>${v.wind_level}级</span>
                            </div>
                        </li>`;
        $(".week ul").append(weekStr);
        high.push(v.high_temperature);
        low.push(v.low_temperature);
    });
    // 初始化echarts,天气折线图
    let myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    let option = {
        xAxis:  {
            show: false,
            boundaryGap: false,
            data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16']
        },
        yAxis: {
            show: false,
        },
        series: [
            {
                type:'line',
                smooth:0.5,
                symbol:'circle',
                symbolSize: 12,
                itemStyle : {
                    normal : {
                        color:'#ffb74d',
                        lineStyle:{
                            width:5,
                            color:'#ffb74d'
                        }
                    }
                },
                data:[high[0],high[1],high[2],high[3],high[4],high[5],high[6],high[7],high[8],high[9],high[10],high[11],high[12],high[13],high[14],high[15],],
            },
            {
                type:'line',
                smooth:0.5,
                symbol:'circle',
                symbolSize: 12,
                itemStyle : {
                    normal : {
                        color:'#4fc3f7',
                        lineStyle:{
                            width:5,
                            color:'#4fc3f7'
                        }
                    }
                },
                data:[low[0],low[1],low[2],low[3],low[4],low[5],low[6],low[7],low[8],low[9],low[10],low[11],low[12],low[13],low[14],low[15]],
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
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
