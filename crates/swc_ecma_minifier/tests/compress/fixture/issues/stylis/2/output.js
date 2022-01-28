import { MS, MOZ, WEBKIT } from "./Enum.js.js";
import { strlen, indexof, replace } from "./Utility.js.js";
function charat(value, index) {
    return 0 | value.charCodeAt(index);
}
export function prefix(value, length) {
    var value1;
    switch((((length << 2 ^ charat(value1 = value, 0)) << 2 ^ charat(value1, 1)) << 2 ^ charat(value1, 2)) << 2 ^ charat(value1, 3)){
        case 5103:
            return WEBKIT + "print-" + value + value;
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
            return WEBKIT + value + value;
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return WEBKIT + value + MOZ + value + MS + value + value;
        case 6828:
        case 4268:
            return WEBKIT + value + MS + value + value;
        case 6165:
            return WEBKIT + value + MS + "flex-" + value + value;
        case 5187:
            return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
        case 5443:
            return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
        case 4675:
            return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
        case 5548:
            return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
        case 5292:
            return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
        case 6060:
            return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
        case 4554:
            return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
        case 6187:
            return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
        case 5495:
        case 3959:
            return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
        case 4968:
            return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
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
            if (strlen(value) - 1 - length > 6) switch(charat(value, length + 1)){
                case 109:
                    if (45 !== charat(value, length + 4)) break;
                case 102:
                    return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (108 == charat(value, length + 3) ? "$3" : "$2-$3")) + value;
                case 115:
                    return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length) + value : value;
            }
            break;
        case 4949:
            if (115 !== charat(value, length + 1)) break;
        case 6444:
            switch(charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))){
                case 107:
                    return replace(value, ":", ":" + WEBKIT) + value;
                case 101:
                    return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (45 === charat(value, 14) ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
            }
            break;
        case 5936:
            switch(charat(value, length + 11)){
                case 114:
                    return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
                case 108:
                    return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
                case 45:
                    return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
            }
            return WEBKIT + value + MS + value + value;
    }
    return value;
}
