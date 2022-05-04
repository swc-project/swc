export const obj = {
    style: function (elem, name, value, extra) {
        // Don't set styles on text and comment nodes
        if (
            !elem ||
            elem.nodeType === 3 ||
            elem.nodeType === 8 ||
            !elem.style
        ) {
            return;
        }

        // Make sure that we're working with the right name
        var ret,
            type,
            hooks,
            origName = jQuery.camelCase(name),
            style = elem.style;

        name =
            jQuery.cssProps[origName] ||
            (jQuery.cssProps[origName] = vendorPropName(style, origName));

        // gets hook for the prefixed version
        // followed by the unprefixed version
        hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

        // Check if we're setting a value
        if (value !== undefined) {
            type = typeof value;

            // convert relative number strings (+= or -=) to relative numbers. #7345
            if (type === "string" && (ret = rrelNum.exec(value))) {
                value =
                    (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                // Fixes bug #9237
                type = "number";
            }

            // Make sure that NaN and null values aren't set. See: #7116
            if (value == null || (type === "number" && isNaN(value))) {
                return;
            }

            // If a number was passed in, add 'px' to the (except for certain CSS properties)
            if (type === "number" && !jQuery.cssNumber[origName]) {
                value += "px";
            }

            // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
            // but it would mean to define eight (for every problematic property) identical functions
            if (
                !jQuery.support.clearCloneStyle &&
                value === "" &&
                name.indexOf("background") === 0
            ) {
                style[name] = "inherit";
            }

            // If a hook was provided, use that value, otherwise just set the specified value
            if (
                !hooks ||
                !("set" in hooks) ||
                (value = hooks.set(elem, value, extra)) !== undefined
            ) {
                // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                // Fixes bug #5509
                try {
                    style[name] = value;
                } catch (e) {}
            }
        } else {
            // If a hook was provided get the non-computed value from there
            if (
                hooks &&
                "get" in hooks &&
                (ret = hooks.get(elem, false, extra)) !== undefined
            ) {
                return ret;
            }

            // Otherwise just get the value from the style object
            return style[name];
        }
    },
};
