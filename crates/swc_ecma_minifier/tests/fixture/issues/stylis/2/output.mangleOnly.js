import { MS as a, MOZ as b, WEBKIT as c } from "./Enum.js.js";
import { strlen as d, indexof as e, replace as f } from "./Utility.js.js";
function g(a, b) {
    return a.charCodeAt(b) | 0;
}
export function prefix(h, i) {
    function j(a, b) {
        return ((((((((b << 2) ^ g(a, 0)) << 2) ^ g(a, 1)) << 2) ^ g(a, 2)) << 2) ^ g(a, 3));
    }
    switch(j(h, i)){
        case 5103:
            return c + "print-" + h + h;
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
            return c + h + h;
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return c + h + b + h + a + h + h;
        case 6828:
        case 4268:
            return c + h + a + h + h;
        case 6165:
            return c + h + a + "flex-" + h + h;
        case 5187:
            return (c + h + f(h, /(\w+).+(:[^]+)/, c + "box-$1$2" + a + "flex-$1$2") + h);
        case 5443:
            return (c + h + a + "flex-item-" + f(h, /flex-|-self/, "") + h);
        case 4675:
            return (c + h + a + "flex-line-pack" + f(h, /align-content|flex-|-self/, "") + h);
        case 5548:
            return (c + h + a + f(h, "shrink", "negative") + h);
        case 5292:
            return (c + h + a + f(h, "basis", "preferred-size") + h);
        case 6060:
            return (c + "box-" + f(h, "-grow", "") + c + h + a + f(h, "grow", "positive") + h);
        case 4554:
            return (c + f(h, /([^-])(transform)/g, "$1" + c + "$2") + h);
        case 6187:
            return (f(f(f(h, /(zoom-|grab)/, c + "$1"), /(image-set)/, c + "$1"), h, "") + h);
        case 5495:
        case 3959:
            return f(h, /(image-set\([^]*)/, c + "$1" + "$`$1");
        case 4968:
            return (f(f(h, /(.+:)(flex-)?(.*)/, c + "box-pack:$3" + a + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + c + h + h);
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return f(h, /(.+)-inline(.+)/, c + "$1$2") + h;
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
            if (d(h) - 1 - i > 6) switch(g(h, i + 1)){
                case 109:
                    if (g(h, i + 4) !== 45) break;
                case 102:
                    return (f(h, /(.+:)(.+)-([^]+)/, "$1" + c + "$2-$3" + "$1" + b + (g(h, i + 3) == 108 ? "$3" : "$2-$3")) + h);
                case 115:
                    return ~e(h, "stretch") ? prefix(f(h, "stretch", "fill-available"), i) + h : h;
            }
            break;
        case 4949:
            if (g(h, i + 1) !== 115) break;
        case 6444:
            switch(g(h, d(h) - 3 - (~e(h, "!important") && 10))){
                case 107:
                    return f(h, ":", ":" + c) + h;
                case 101:
                    return (f(h, /(.+:)([^;!]+)(;|!.+)?/, "$1" + c + (g(h, 14) === 45 ? "inline-" : "") + "box$3" + "$1" + c + "$2$3" + "$1" + a + "$2box$3") + h);
            }
            break;
        case 5936:
            switch(g(h, i + 11)){
                case 114:
                    return (c + h + a + f(h, /[svh]\w+-[tblr]{2}/, "tb") + h);
                case 108:
                    return (c + h + a + f(h, /[svh]\w+-[tblr]{2}/, "tb-rl") + h);
                case 45:
                    return (c + h + a + f(h, /[svh]\w+-[tblr]{2}/, "lr") + h);
            }
            return c + h + a + h + h;
    }
    return h;
}
