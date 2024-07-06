import { MS, MOZ, WEBKIT } from "./Enum.js.js";
import { strlen, indexof, replace } from "./Utility.js.js";
function charat(value, index) {
    return 0 | value.charCodeAt(index);
}
/**
 * @param {string} value
 * @param {number} length
 * @return {string}
 */ export function prefix(value, length) {
    switch((((length << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3)){
        // color-adjust
        case 5103:
            return WEBKIT + "print-" + value + value;
        // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
        case 5737:
        case 4201:
        case 3177:
        case 3433:
        case 1641:
        case 4457:
        case 2921:
        // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
        case 5572:
        case 6356:
        case 5844:
        case 3191:
        case 6645:
        case 3005:
        // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
        case 6391:
        case 5879:
        case 5623:
        case 6135:
        case 4599:
        case 4855:
        // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
        case 4215:
        case 6389:
        case 5109:
        case 5365:
        case 5621:
        case 3829:
            return WEBKIT + value + value;
        // appearance, user-select, transform, hyphens, text-size-adjust
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return WEBKIT + value + MOZ + value + MS + value + value;
        // flex, flex-direction
        case 6828:
        case 4268:
            return WEBKIT + value + MS + value + value;
        // order
        case 6165:
            return WEBKIT + value + MS + "flex-" + value + value;
        // align-items
        case 5187:
            return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
        // align-self
        case 5443:
            return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
        // align-content
        case 4675:
            return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
        // flex-shrink
        case 5548:
            return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
        // flex-basis
        case 5292:
            return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
        // flex-grow
        case 6060:
            return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
        // transition
        case 4554:
            return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
        // cursor
        case 6187:
            return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
        // background, background-image
        case 5495:
        case 3959:
            return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
        // justify-content
        case 4968:
            return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
        // (margin|padding)-inline-(start|end)
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
        // (min|max)?(width|height|inline-size|block-size)
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
            // stretch, max-content, min-content, fill-available
            if (strlen(value) - 1 - length > 6) switch(charat(value, length + 1)){
                // (m)ax-content, (m)in-content
                case 109:
                    // -
                    if (45 !== charat(value, length + 4)) break;
                // (f)ill-available, (f)it-content
                case 102:
                    return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (108 == charat(value, length + 3) ? "$3" : "$2-$3")) + value;
                // (s)tretch
                case 115:
                    return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length) + value : value;
            }
            break;
        // position: sticky
        case 4949:
            // (s)ticky?
            if (115 !== charat(value, length + 1)) break;
        // display: (flex|inline-flex)
        case 6444:
            switch(charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))){
                // stic(k)y
                case 107:
                    return replace(value, ":", ":" + WEBKIT) + value;
                // (inline-)?fl(e)x
                case 101:
                    return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (45 === charat(value, 14) ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
            }
            break;
        // writing-mode
        case 5936:
            switch(charat(value, length + 11)){
                // vertical-l(r)
                case 114:
                    return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
                // vertical-r(l)
                case 108:
                    return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
                // horizontal(-)tb
                case 45:
                    return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
            }
            return WEBKIT + value + MS + value + value;
    }
    return value;
}
