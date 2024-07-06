export var modifiers = {
    offset: {
        order: 200,
        enabled: true,
        fn: function(data, _ref) {
            var offset = _ref.offset;
            var placement = data.placement, _data$offsets = data.offsets, popper = _data$offsets.popper, reference = _data$offsets.reference;
            var basePlacement = placement.split('-')[0];
            var offsets = void 0;
            if (isNumeric(+offset)) offsets = [
                +offset,
                0
            ];
            else {
                var offset1, popperOffsets, referenceOffsets;
                var offsets1;
                // Use height if placement is left or right and index is 0 otherwise use width
                // in this way the first offset will use an axis and the second one
                // will use the other one
                var useHeight;
                // Split the offset string to obtain a list of values and operands
                // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
                var fragments;
                // Detect if the offset string contains a pair of values or a single one
                // they could be separated by comma or space
                var divider;
                // If divider is found, we divide the list of values and operands to divide
                // them by ofset X and Y.
                var splitRegex;
                var ops;
                offsets1 = [
                    0,
                    0
                ], useHeight = -1 !== [
                    'right',
                    'left'
                ].indexOf(basePlacement), divider = (fragments = offset.split(/(\+|\-)/).map(function(frag) {
                    return frag.trim();
                })).indexOf(find(fragments, function(frag) {
                    return -1 !== frag.search(/,|\s/);
                })), fragments[divider] && -1 === fragments[divider].indexOf(',') && console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.'), splitRegex = /\s*,\s*|\s+/, // Loop trough the offsets arrays and execute the operations
                // Convert the values with units to absolute pixels to allow our computations
                (ops = (ops = -1 !== divider ? [
                    fragments.slice(0, divider).concat([
                        fragments[divider].split(splitRegex)[0]
                    ]),
                    [
                        fragments[divider].split(splitRegex)[1]
                    ].concat(fragments.slice(divider + 1))
                ] : [
                    fragments
                ]).map(function(op, index) {
                    // Most of the units rely on the orientation of the popper
                    var measurement = (1 === index ? !useHeight : useHeight) ? 'height' : 'width';
                    var mergeWithPrevious = false;
                    return op// This aggregates any `+` or `-` sign that aren't considered operators
                    // e.g.: 10 + +5 => [10, +, +5]
                    .reduce(function(a, b) {
                        if ('' === a[a.length - 1] && -1 !== [
                            '+',
                            '-'
                        ].indexOf(b)) return a[a.length - 1] = b, mergeWithPrevious = true, a;
                        if (mergeWithPrevious) return a[a.length - 1] += b, mergeWithPrevious = false, a;
                        return a.concat(b);
                    }, [])// Here we convert the string values into number values (in px)
                    .map(function(str) {
                        return toValue(str, measurement, popper, reference);
                    });
                })).forEach(function(op, index) {
                    op.forEach(function(frag, index2) {
                        isNumeric(frag) && (offsets1[index] += frag * ('-' === op[index2 - 1] ? -1 : 1));
                    });
                }), offsets = offsets1;
            }
            return 'left' === basePlacement ? (popper.top += offsets[0], popper.left -= offsets[1]) : 'right' === basePlacement ? (popper.top += offsets[0], popper.left += offsets[1]) : 'top' === basePlacement ? (popper.left += offsets[0], popper.top -= offsets[1]) : 'bottom' === basePlacement && (popper.left += offsets[0], popper.top += offsets[1]), data.popper = popper, data;
        },
        offset: 0
    }
};
