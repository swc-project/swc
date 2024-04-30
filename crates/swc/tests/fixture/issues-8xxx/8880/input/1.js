function a(module, exports, farmRequire, farmDynamicRequire) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const _interop_require_default = farmRequire("@swc/helpers/_/_interop_require_default");
    const _typeof = _interop_require_default._(farmRequire("8178b9bd"));
    const _dep734fea04 = farmRequire("92648bed");
    const _dayjs = _interop_require_default._(farmRequire("d0dc4dad"));
    farmRequire("15d5169f");
    var zhCn = (0, _dep734fea04.c)(function (module, exports) {
        !function (e__1, _) {
            "object" == 'object' && "undefined" != 'object' ? module.exports = _(_dayjs.default) : "function" == typeof undefined && undefined.amd ? undefined([
                "dayjs"
            ], _) : (e__1 = "undefined" != typeof globalThis ? globalThis : e__1 || self).dayjs_locale_zh_cn = _(e__1.dayjs);
        }(_dep734fea04.a, function (e__2) {
            "use strict";
            function _(e__3) {
                return e__3 && "object" == (0, _typeof.default)(e__3) && "default" in e__3 ? e__3 : {
                    "default": e__3
                };
            }
            var t = _(e__2), d = {
                name: "zh-cn",
                weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
                weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
                weekdaysMin: "日_一_二_三_四_五_六".split("_"),
                months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
                monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
                ordinal: function ordinal(e, _) {
                    return "W" === _ ? e + "周" : e + "日";
                },
                weekStart: 1,
                yearStart: 4,
                formats: {
                    LT: "HH:mm",
                    LTS: "HH:mm:ss",
                    L: "YYYY/MM/DD",
                    LL: "YYYY年M月D日",
                    LLL: "YYYY年M月D日Ah点mm分",
                    LLLL: "YYYY年M月D日ddddAh点mm分",
                    l: "YYYY/M/D",
                    ll: "YYYY年M月D日",
                    lll: "YYYY年M月D日 HH:mm",
                    llll: "YYYY年M月D日dddd HH:mm"
                },
                relativeTime: {
                    future: "%s内",
                    past: "%s前",
                    s: "几秒",
                    m: "1 分钟",
                    mm: "%d 分钟",
                    h: "1 小时",
                    hh: "%d 小时",
                    d: "1 天",
                    dd: "%d 天",
                    M: "1 个月",
                    MM: "%d 个月",
                    y: "1 年",
                    yy: "%d 年"
                },
                meridiem: function meridiem(e, _) {
                    var t = 100 * e + _;
                    return t < 600 ? "凌晨" : t < 900 ? "早上" : t < 1100 ? "上午" : t < 1300 ? "中午" : t < 1800 ? "下午" : "晚上";
                }
            };
            return t["default"].locale(d, null, !0), d;
        });
    });
}