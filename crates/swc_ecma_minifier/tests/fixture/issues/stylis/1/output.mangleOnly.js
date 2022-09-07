import { MS as e, MOZ as s, WEBKIT as a } from "./Enum.js";
import { strlen as c, indexof as r, replace as t } from "./Utility.js";
function n(e, s) {
    return ((((((((s << 2) ^ i(e, 0)) << 2) ^ i(e, 1)) << 2) ^ i(e, 2)) << 2) ^ i(e, 3));
}
function i(e, s) {
    return e.charCodeAt(s) | 0;
}
export function prefix(u, $) {
    switch(n(u, $)){
        case 5103:
            return a + "print-" + u + u;
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
            return a + u + u;
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return a + u + s + u + e + u + u;
        case 6828:
        case 4268:
            return a + u + e + u + u;
        case 6165:
            return a + u + e + "flex-" + u + u;
        case 5187:
            return (a + u + t(u, /(\w+).+(:[^]+)/, a + "box-$1$2" + e + "flex-$1$2") + u);
        case 5443:
            return (a + u + e + "flex-item-" + t(u, /flex-|-self/, "") + u);
        case 4675:
            return (a + u + e + "flex-line-pack" + t(u, /align-content|flex-|-self/, "") + u);
        case 5548:
            return (a + u + e + t(u, "shrink", "negative") + u);
        case 5292:
            return (a + u + e + t(u, "basis", "preferred-size") + u);
        case 6060:
            return (a + "box-" + t(u, "-grow", "") + a + u + e + t(u, "grow", "positive") + u);
        case 4554:
            return (a + t(u, /([^-])(transform)/g, "$1" + a + "$2") + u);
        case 6187:
            return (t(t(t(u, /(zoom-|grab)/, a + "$1"), /(image-set)/, a + "$1"), u, "") + u);
        case 5495:
        case 3959:
            return t(u, /(image-set\([^]*)/, a + "$1" + "$`$1");
        case 4968:
            return (t(t(u, /(.+:)(flex-)?(.*)/, a + "box-pack:$3" + e + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + a + u + u);
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return t(u, /(.+)-inline(.+)/, a + "$1$2") + u;
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
            if (c(u) - 1 - $ > 6) switch(i(u, $ + 1)){
                case 109:
                    if (i(u, $ + 4) !== 45) break;
                case 102:
                    return (t(u, /(.+:)(.+)-([^]+)/, "$1" + a + "$2-$3" + "$1" + s + (i(u, $ + 3) == 108 ? "$3" : "$2-$3")) + u);
                case 115:
                    return ~r(u, "stretch") ? prefix(t(u, "stretch", "fill-available"), $) + u : u;
            }
            break;
        case 4949:
            if (i(u, $ + 1) !== 115) break;
        case 6444:
            switch(i(u, c(u) - 3 - (~r(u, "!important") && 10))){
                case 107:
                    return t(u, ":", ":" + a) + u;
                case 101:
                    return (t(u, /(.+:)([^;!]+)(;|!.+)?/, "$1" + a + (i(u, 14) === 45 ? "inline-" : "") + "box$3" + "$1" + a + "$2$3" + "$1" + e + "$2box$3") + u);
            }
            break;
        case 5936:
            switch(i(u, $ + 11)){
                case 114:
                    return (a + u + e + t(u, /[svh]\w+-[tblr]{2}/, "tb") + u);
                case 108:
                    return (a + u + e + t(u, /[svh]\w+-[tblr]{2}/, "tb-rl") + u);
                case 45:
                    return (a + u + e + t(u, /[svh]\w+-[tblr]{2}/, "lr") + u);
            }
            return a + u + e + u + u;
    }
    return u;
}
