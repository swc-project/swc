/* harmony default export */
var emotion_memoize_browser_esm = memoize;

var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var unitlessKeys = {
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
    strokeWidth: 1,
};

var unitless_browser_esm = unitlessKeys;

var isCustomProperty = function isCustomProperty(property) {
    return property.charCodeAt(1) === 45;
};

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;

var cursor;

var hash_browser_esm = murmur2;

function handleInterpolation(mergedProps, registered, interpolation) {
    if (interpolation == null) {
        return "";
    }

    if (interpolation.__emotion_styles !== undefined) {
        if (false) {
        }

        return interpolation;
    }

    switch (typeof interpolation) {
        case "boolean": {
            return "";
        }

        case "object": {
            if (interpolation.anim === 1) {
                cursor = {
                    name: interpolation.name,
                    styles: interpolation.styles,
                    next: cursor,
                };
                return interpolation.name;
            }

            if (interpolation.styles !== undefined) {
                var next = interpolation.next;

                if (next !== undefined) {
                    // not the most efficient thing ever but this is a pretty rare case
                    // and there will be very few iterations of this generally
                    while (next !== undefined) {
                        cursor = {
                            name: next.name,
                            styles: next.styles,
                            next: cursor,
                        };
                        next = next.next;
                    }
                }

                var styles = interpolation.styles + ";";

                if (false) {
                }

                return styles;
            }

            return createStringFromObject(
                mergedProps,
                registered,
                interpolation
            );
        }

        case "function": {
            if (mergedProps !== undefined) {
                var previousCursor = cursor;
                var result = interpolation(mergedProps);
                cursor = previousCursor;
                return handleInterpolation(mergedProps, registered, result);
            } else if (false) {
            }

            break;
        }

        case "string":
            if (false) {
                var replaced, matched;
            }

            break;
    } // finalize string values (regular strings and functions interpolated into css calls)

    if (registered == null) {
        return interpolation;
    }

    var cached = registered[interpolation];
    return cached !== undefined ? cached : interpolation;
}

export function serializeStyles(args, registered, mergedProps) {
    if (
        args.length === 1 &&
        typeof args[0] === "object" &&
        args[0] !== null &&
        args[0].styles !== undefined
    ) {
        return args[0];
    }

    var stringMode = true;
    var styles = "";
    cursor = undefined;
    var strings = args[0];

    if (strings == null || strings.raw === undefined) {
        stringMode = false;
        styles += handleInterpolation(mergedProps, registered, strings);
    } else {
        if (false) {
        }

        styles += strings[0];
    } // we start at 1 since we've already handled the first arg

    for (var i = 1; i < args.length; i++) {
        styles += handleInterpolation(mergedProps, registered, args[i]);

        if (stringMode) {
            if (false) {
            }

            styles += strings[i];
        }
    }

    var sourceMap;

    if (false) {
    } // using a global regex with .exec is stateful so lastIndex has to be reset each time

    labelPattern.lastIndex = 0;
    var identifierName = "";
    var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

    while ((match = labelPattern.exec(styles)) !== null) {
        identifierName +=
            "-" + // $FlowFixMe we know it's not null
            match[1];
    }

    var name = hash_browser_esm(styles) + identifierName;

    if (false) {
    }

    return {
        name: name,
        styles: styles,
        next: cursor,
    };
}

function createStringFromObject(mergedProps, registered, obj) {
    var string = "";

    if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            string +=
                handleInterpolation(mergedProps, registered, obj[i]) + ";";
        }
    } else {
        for (var _key in obj) {
            var value = obj[_key];

            if (typeof value !== "object") {
                if (registered != null && registered[value] !== undefined) {
                    string += _key + "{" + registered[value] + "}";
                } else if (isProcessableValue(value)) {
                    string +=
                        processStyleName(_key) +
                        ":" +
                        processStyleValue(_key, value) +
                        ";";
                }
            } else {
                if (
                    _key === "NO_COMPONENT_SELECTOR" &&
                    "production" !== "production"
                ) {
                }

                if (
                    Array.isArray(value) &&
                    typeof value[0] === "string" &&
                    (registered == null || registered[value[0]] === undefined)
                ) {
                    for (var _i = 0; _i < value.length; _i++) {
                        if (isProcessableValue(value[_i])) {
                            string +=
                                processStyleName(_key) +
                                ":" +
                                processStyleValue(_key, value[_i]) +
                                ";";
                        }
                    }
                } else {
                    var interpolated = handleInterpolation(
                        mergedProps,
                        registered,
                        value
                    );

                    switch (_key) {
                        case "animation":
                        case "animationName": {
                            string +=
                                processStyleName(_key) +
                                ":" +
                                interpolated +
                                ";";
                            break;
                        }

                        default: {
                            if (false) {
                            }

                            string += _key + "{" + interpolated + "}";
                        }
                    }
                }
            }
        }
    }

    return string;
}

function murmur2(str) {
    // 'm' and 'r' are mixing constants generated offline.
    // They're not really 'magic', they just happen to work well.
    // const m = 0x5bd1e995;
    // const r = 24;
    // Initialize the hash
    var h = 0; // Mix 4 bytes at a time into the hash

    var k,
        i = 0,
        len = str.length;

    for (; len >= 4; ++i, len -= 4) {
        k =
            (str.charCodeAt(i) & 0xff) |
            ((str.charCodeAt(++i) & 0xff) << 8) |
            ((str.charCodeAt(++i) & 0xff) << 16) |
            ((str.charCodeAt(++i) & 0xff) << 24);
        k =
            /* Math.imul(k, m): */
            (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16);
        k ^=
            /* k >>> r: */
            k >>> 24;
        h =
            /* Math.imul(k, m): */
            ((k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16)) ^
            /* Math.imul(h, m): */
            ((h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16));
    } // Handle the last few bytes of the input array

    switch (len) {
        case 3:
            h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

        case 2:
            h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

        case 1:
            h ^= str.charCodeAt(i) & 0xff;
            h =
                /* Math.imul(h, m): */
                (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16);
    } // Do a few final mixes of the hash to ensure the last few
    // bytes are well-incorporated.

    h ^= h >>> 13;
    h =
        /* Math.imul(h, m): */
        (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16);
    return ((h ^ (h >>> 15)) >>> 0).toString(36);
}

function isProcessableValue(value) {
    return value != null && typeof value !== "boolean";
}

var processStyleName = /* #__PURE__ */ emotion_memoize_browser_esm(function (
    styleName
) {
    return isCustomProperty(styleName)
        ? styleName
        : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
    switch (key) {
        case "animation":
        case "animationName": {
            if (typeof value === "string") {
                return value.replace(animationRegex, function (match, p1, p2) {
                    cursor = {
                        name: p1,
                        styles: p2,
                        next: cursor,
                    };
                    return p1;
                });
            }
        }
    }

    if (
        unitless_browser_esm[key] !== 1 &&
        !isCustomProperty(key) &&
        typeof value === "number" &&
        value !== 0
    ) {
        return value + "px";
    }

    return value;
};

function memoize(fn) {
    var cache = Object.create(null);
    return function (arg) {
        if (cache[arg] === undefined) cache[arg] = fn(arg);
        return cache[arg];
    };
}
