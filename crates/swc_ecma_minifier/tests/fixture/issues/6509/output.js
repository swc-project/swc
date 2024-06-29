"module evaluation";
var modifiers = {
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
                var useHeight;
                var fragments;
                var divider;
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
                })), fragments[divider] && -1 === fragments[divider].indexOf(',') && console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.'), splitRegex = /\s*,\s*|\s+/, (ops = (ops = -1 !== divider ? [
                    fragments.slice(0, divider).concat([
                        fragments[divider].split(splitRegex)[0]
                    ]),
                    [
                        fragments[divider].split(splitRegex)[1]
                    ].concat(fragments.slice(divider + 1))
                ] : [
                    fragments
                ]).map(function(op, index) {
                    var measurement = (1 === index ? !useHeight : useHeight) ? 'height' : 'width';
                    var mergeWithPrevious = false;
                    return op.reduce(function(a, b) {
                        if ('' === a[a.length - 1] && -1 !== [
                            '+',
                            '-'
                        ].indexOf(b)) return a[a.length - 1] = b, mergeWithPrevious = true, a;
                        if (mergeWithPrevious) return a[a.length - 1] += b, mergeWithPrevious = false, a;
                        return a.concat(b);
                    }, []).map(function(str) {
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
export { modifiers };
