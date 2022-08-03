import { MS as e, MOZ as s, WEBKIT as a } from "./Enum.js.js";
import { strlen as c, indexof as r, replace as t } from "./Utility.js.js";
function _(e, s) {
    return e.charCodeAt(s) | 0;
}
export function prefix(n, u) {
    function $(e, s) {
        return ((((((((s << 2) ^ _(e, 0)) << 2) ^ _(e, 1)) << 2) ^ _(e, 2)) << 2) ^ _(e, 3));
    }
    switch($(n, u)){
        case 5103:
            return a + "print-" + n + n;
        case 5737:
        case 4201:
        case 3177:
        case 3433:
        case 1641:
        case 4457:
        case 2921:
        case 5572:
        case 6356:
        case 5844:
        case 3191:
        case 6645:
        case 3005:
        case 6391:
        case 5879:
        case 5623:
        case 6135:
        case 4599:
        case 4855:
        case 4215:
        case 6389:
        case 5109:
        case 5365:
        case 5621:
        case 3829:
            return a + n + n;
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return a + n + s + n + e + n + n;
        case 6828:
        case 4268:
            return a + n + e + n + n;
        case 6165:
            return a + n + e + "flex-" + n + n;
        case 5187:
            return (a + n + t(n, /(\w+).+(:[^]+)/, a + "box-$1$2" + e + "flex-$1$2") + n);
        case 5443:
            return (a + n + e + "flex-item-" + t(n, /flex-|-self/, "") + n);
        case 4675:
            return (a + n + e + "flex-line-pack" + t(n, /align-content|flex-|-self/, "") + n);
        case 5548:
            return (a + n + e + t(n, "shrink", "negative") + n);
        case 5292:
            return (a + n + e + t(n, "basis", "preferred-size") + n);
        case 6060:
            return (a + "box-" + t(n, "-grow", "") + a + n + e + t(n, "grow", "positive") + n);
        case 4554:
            return (a + t(n, /([^-])(transform)/g, "$1" + a + "$2") + n);
        case 6187:
            return (t(t(t(n, /(zoom-|grab)/, a + "$1"), /(image-set)/, a + "$1"), n, "") + n);
        case 5495:
        case 3959:
            return t(n, /(image-set\([^]*)/, a + "$1" + "$`$1");
        case 4968:
            return (t(t(n, /(.+:)(flex-)?(.*)/, a + "box-pack:$3" + e + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + a + n + n);
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return t(n, /(.+)-inline(.+)/, a + "$1$2") + n;
        case 8116:
        case 7059:
        case 5753:
        case 5535:
        case 5445:
        case 5701:
        case 4933:
        case 4677:
        case 5533:
        case 5789:
        case 5021:
        case 4765:
            if (c(n) - 1 - u > 6) switch(_(n, u + 1)){
                case 109:
                    if (_(n, u + 4) !== 45) break;
                case 102:
                    return (t(n, /(.+:)(.+)-([^]+)/, "$1" + a + "$2-$3" + "$1" + s + (_(n, u + 3) == 108 ? "$3" : "$2-$3")) + n);
                case 115:
                    return ~r(n, "stretch") ? prefix(t(n, "stretch", "fill-available"), u) + n : n;
            }
            break;
        case 4949:
            if (_(n, u + 1) !== 115) break;
        case 6444:
            switch(_(n, c(n) - 3 - (~r(n, "!important") && 10))){
                case 107:
                    return t(n, ":", ":" + a) + n;
                case 101:
                    return (t(n, /(.+:)([^;!]+)(;|!.+)?/, "$1" + a + (_(n, 14) === 45 ? "inline-" : "") + "box$3" + "$1" + a + "$2$3" + "$1" + e + "$2box$3") + n);
            }
            break;
        case 5936:
            switch(_(n, u + 11)){
                case 114:
                    return (a + n + e + t(n, /[svh]\w+-[tblr]{2}/, "tb") + n);
                case 108:
                    return (a + n + e + t(n, /[svh]\w+-[tblr]{2}/, "tb-rl") + n);
                case 45:
                    return (a + n + e + t(n, /[svh]\w+-[tblr]{2}/, "lr") + n);
            }
            return a + n + e + n + n;
    }
    return n;
}
