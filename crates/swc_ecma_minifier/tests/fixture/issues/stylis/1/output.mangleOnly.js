import { MS as a, MOZ as b, WEBKIT as c } from "./Enum.js";
import { strlen as d, indexof as e, replace as f } from "./Utility.js";
function g(a, b) {
    return ((((((((b << 2) ^ h(a, 0)) << 2) ^ h(a, 1)) << 2) ^ h(a, 2)) << 2) ^ h(a, 3));
}
function h(a, b) {
    return a.charCodeAt(b) | 0;
}
export function prefix(i, j) {
    switch(g(i, j)){
        case 5103:
            return c + "print-" + i + i;
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
            return c + i + i;
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return c + i + b + i + a + i + i;
        case 6828:
        case 4268:
            return c + i + a + i + i;
        case 6165:
            return c + i + a + "flex-" + i + i;
        case 5187:
            return (c + i + f(i, /(\w+).+(:[^]+)/, c + "box-$1$2" + a + "flex-$1$2") + i);
        case 5443:
            return (c + i + a + "flex-item-" + f(i, /flex-|-self/, "") + i);
        case 4675:
            return (c + i + a + "flex-line-pack" + f(i, /align-content|flex-|-self/, "") + i);
        case 5548:
            return (c + i + a + f(i, "shrink", "negative") + i);
        case 5292:
            return (c + i + a + f(i, "basis", "preferred-size") + i);
        case 6060:
            return (c + "box-" + f(i, "-grow", "") + c + i + a + f(i, "grow", "positive") + i);
        case 4554:
            return (c + f(i, /([^-])(transform)/g, "$1" + c + "$2") + i);
        case 6187:
            return (f(f(f(i, /(zoom-|grab)/, c + "$1"), /(image-set)/, c + "$1"), i, "") + i);
        case 5495:
        case 3959:
            return f(i, /(image-set\([^]*)/, c + "$1" + "$`$1");
        case 4968:
            return (f(f(i, /(.+:)(flex-)?(.*)/, c + "box-pack:$3" + a + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + c + i + i);
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return f(i, /(.+)-inline(.+)/, c + "$1$2") + i;
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
            if (d(i) - 1 - j > 6) switch(h(i, j + 1)){
                case 109:
                    if (h(i, j + 4) !== 45) break;
                case 102:
                    return (f(i, /(.+:)(.+)-([^]+)/, "$1" + c + "$2-$3" + "$1" + b + (h(i, j + 3) == 108 ? "$3" : "$2-$3")) + i);
                case 115:
                    return ~e(i, "stretch") ? prefix(f(i, "stretch", "fill-available"), j) + i : i;
            }
            break;
        case 4949:
            if (h(i, j + 1) !== 115) break;
        case 6444:
            switch(h(i, d(i) - 3 - (~e(i, "!important") && 10))){
                case 107:
                    return f(i, ":", ":" + c) + i;
                case 101:
                    return (f(i, /(.+:)([^;!]+)(;|!.+)?/, "$1" + c + (h(i, 14) === 45 ? "inline-" : "") + "box$3" + "$1" + c + "$2$3" + "$1" + a + "$2box$3") + i);
            }
            break;
        case 5936:
            switch(h(i, j + 11)){
                case 114:
                    return (c + i + a + f(i, /[svh]\w+-[tblr]{2}/, "tb") + i);
                case 108:
                    return (c + i + a + f(i, /[svh]\w+-[tblr]{2}/, "tb-rl") + i);
                case 45:
                    return (c + i + a + f(i, /[svh]\w+-[tblr]{2}/, "lr") + i);
            }
            return c + i + a + i + i;
    }
    return i;
}
