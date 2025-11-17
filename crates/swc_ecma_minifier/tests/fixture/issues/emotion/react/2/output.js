/* harmony default export */ var fn, cache, cursor, hyphenateRegex = /[A-Z]|^ms/g, animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g, unitless_browser_esm = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
}, isCustomProperty = function(property) {
    return 45 === property.charCodeAt(1);
}, labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
function handleInterpolation(mergedProps, registered, interpolation) {
    if (null == interpolation) return "";
    if (void 0 !== interpolation.__emotion_styles) return interpolation;
    switch(typeof interpolation){
        case "boolean":
            return "";
        case "object":
            if (1 === interpolation.anim) return cursor = {
                name: interpolation.name,
                styles: interpolation.styles,
                next: cursor
            }, interpolation.name;
            if (void 0 !== interpolation.styles) {
                var next = interpolation.next;
                if (void 0 !== next) // not the most efficient thing ever but this is a pretty rare case
                // and there will be very few iterations of this generally
                for(; void 0 !== next;)cursor = {
                    name: next.name,
                    styles: next.styles,
                    next: cursor
                }, next = next.next;
                return interpolation.styles + ";";
            }
            return function(mergedProps, registered, obj) {
                var string = "";
                if (Array.isArray(obj)) for(var i = 0; i < obj.length; i++)string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
                else for(var _key in obj){
                    var value = obj[_key];
                    if ("object" != typeof value) null != registered && void 0 !== registered[value] ? string += _key + "{" + registered[value] + "}" : isProcessableValue(value) && (string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";");
                    else if (Array.isArray(value) && "string" == typeof value[0] && (null == registered || void 0 === registered[value[0]])) for(var _i = 0; _i < value.length; _i++)isProcessableValue(value[_i]) && (string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";");
                    else {
                        var interpolated = handleInterpolation(mergedProps, registered, value);
                        switch(_key){
                            case "animation":
                            case "animationName":
                                string += processStyleName(_key) + ":" + interpolated + ";";
                                break;
                            default:
                                string += _key + "{" + interpolated + "}";
                        }
                    }
                }
                return string;
            }(mergedProps, registered, interpolation);
        case "function":
            if (void 0 !== mergedProps) {
                var previousCursor = cursor, result = interpolation(mergedProps);
                return cursor = previousCursor, handleInterpolation(mergedProps, registered, result);
            }
    } // finalize string values (regular strings and functions interpolated into css calls)
    if (null == registered) return interpolation;
    var cached = registered[interpolation];
    return void 0 !== cached ? cached : interpolation;
}
export function serializeStyles(args, registered, mergedProps) {
    if (1 === args.length && "object" == typeof args[0] && null !== args[0] && void 0 !== args[0].styles) return args[0];
    var match, stringMode = !0, styles = "";
    cursor = void 0;
    var strings = args[0];
    null == strings || void 0 === strings.raw ? (stringMode = !1, styles += handleInterpolation(mergedProps, registered, strings)) : styles += strings[0]; // we start at 1 since we've already handled the first arg
    for(var i = 1; i < args.length; i++)styles += handleInterpolation(mergedProps, registered, args[i]), stringMode && (styles += strings[i]);
    labelPattern.lastIndex = 0;
    for(var identifierName = ""; null !== (match = labelPattern.exec(styles));)identifierName += "-" + // $FlowFixMe we know it's not null
    match[1];
    return {
        name: function(str) {
            for(// 'm' and 'r' are mixing constants generated offline.
            // They're not really 'magic', they just happen to work well.
            // const m = 0x5bd1e995;
            // const r = 24;
            // Initialize the hash
            var k, h = 0, i = 0, len = str.length; len >= 4; ++i, len -= 4)k = /* Math.imul(k, m): */ (0xffff & (k = 0xff & str.charCodeAt(i) | (0xff & str.charCodeAt(++i)) << 8 | (0xff & str.charCodeAt(++i)) << 16 | (0xff & str.charCodeAt(++i)) << 24)) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16), k ^= /* k >>> r: */ k >>> 24, h = (0xffff & k) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^ /* Math.imul(h, m): */ (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
             // Handle the last few bytes of the input array
            switch(len){
                case 3:
                    h ^= (0xff & str.charCodeAt(i + 2)) << 16;
                case 2:
                    h ^= (0xff & str.charCodeAt(i + 1)) << 8;
                case 1:
                    h ^= 0xff & str.charCodeAt(i), h = /* Math.imul(h, m): */ (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
            } // Do a few final mixes of the hash to ensure the last few
            return(// bytes are well-incorporated.
            h ^= h >>> 13, (((h = /* Math.imul(h, m): */ (0xffff & h) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16)) ^ h >>> 15) >>> 0).toString(36));
        }(styles) + identifierName,
        styles: styles,
        next: cursor
    };
}
function isProcessableValue(value) {
    return null != value && "boolean" != typeof value;
}
var processStyleName = (fn = function(styleName) {
    return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
}, cache = Object.create(null), function(arg) {
    return void 0 === cache[arg] && (cache[arg] = fn(arg)), cache[arg];
}), processStyleValue = function(key, value) {
    switch(key){
        case "animation":
        case "animationName":
            if ("string" == typeof value) return value.replace(animationRegex, function(match, p1, p2) {
                return cursor = {
                    name: p1,
                    styles: p2,
                    next: cursor
                }, p1;
            });
    }
    return 1 === unitless_browser_esm[key] || isCustomProperty(key) || "number" != typeof value || 0 === value ? value : value + "px";
};
