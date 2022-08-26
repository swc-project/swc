import { MS as e, MOZ as s, WEBKIT as a } from "./Enum.js";
import { strlen as c, indexof as r, replace as t } from "./Utility.js";
function _(e, s) {
    return ((((((((s << 2) ^ n(e, 0)) << 2) ^ n(e, 1)) << 2) ^ n(e, 2)) << 2) ^ n(e, 3));
}
function n(e, s) {
    return e.charCodeAt(s) | 0;
}
export function prefix(i, u) {
    switch(_(i, u)){
        case 5103:
            return a + "print-" + i + i;
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
            return a + i + i;
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return a + i + s + i + e + i + i;
        case 6828:
        case 4268:
            return a + i + e + i + i;
        case 6165:
            return a + i + e + "flex-" + i + i;
        case 5187:
            return (a + i + t(i, /(\w+).+(:[^]+)/, a + "box-$1$2" + e + "flex-$1$2") + i);
        case 5443:
            return (a + i + e + "flex-item-" + t(i, /flex-|-self/, "") + i);
        case 4675:
            return (a + i + e + "flex-line-pack" + t(i, /align-content|flex-|-self/, "") + i);
        case 5548:
            return (a + i + e + t(i, "shrink", "negative") + i);
        case 5292:
            return (a + i + e + t(i, "basis", "preferred-size") + i);
        case 6060:
            return (a + "box-" + t(i, "-grow", "") + a + i + e + t(i, "grow", "positive") + i);
        case 4554:
            return (a + t(i, /([^-])(transform)/g, "$1" + a + "$2") + i);
        case 6187:
            return (t(t(t(i, /(zoom-|grab)/, a + "$1"), /(image-set)/, a + "$1"), i, "") + i);
        case 5495:
        case 3959:
            return t(i, /(image-set\([^]*)/, a + "$1" + "$`$1");
        case 4968:
            return (t(t(i, /(.+:)(flex-)?(.*)/, a + "box-pack:$3" + e + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + a + i + i);
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return t(i, /(.+)-inline(.+)/, a + "$1$2") + i;
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
            if (c(i) - 1 - u > 6) switch(n(i, u + 1)){
                case 109:
                    if (n(i, u + 4) !== 45) break;
                case 102:
                    return (t(i, /(.+:)(.+)-([^]+)/, "$1" + a + "$2-$3" + "$1" + s + (n(i, u + 3) == 108 ? "$3" : "$2-$3")) + i);
                case 115:
                    return ~r(i, "stretch") ? prefix(t(i, "stretch", "fill-available"), u) + i : i;
            }
            break;
        case 4949:
            if (n(i, u + 1) !== 115) break;
        case 6444:
            switch(n(i, c(i) - 3 - (~r(i, "!important") && 10))){
                case 107:
                    return t(i, ":", ":" + a) + i;
                case 101:
                    return (t(i, /(.+:)([^;!]+)(;|!.+)?/, "$1" + a + (n(i, 14) === 45 ? "inline-" : "") + "box$3" + "$1" + a + "$2$3" + "$1" + e + "$2box$3") + i);
            }
            break;
        case 5936:
            switch(n(i, u + 11)){
                case 114:
                    return (a + i + e + t(i, /[svh]\w+-[tblr]{2}/, "tb") + i);
                case 108:
                    return (a + i + e + t(i, /[svh]\w+-[tblr]{2}/, "tb-rl") + i);
                case 45:
                    return (a + i + e + t(i, /[svh]\w+-[tblr]{2}/, "lr") + i);
            }
            return a + i + e + i + i;
    }
    return i;
}
