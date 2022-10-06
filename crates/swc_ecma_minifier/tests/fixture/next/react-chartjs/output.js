export function generateTicks$1(generationOptions, dataRange) {
    let factor, niceMin, niceMax, numSpaces;
    const ticks = [];
    const { bounds , step , min , max , precision , count , maxTicks , maxDigits , includeBounds  } = generationOptions;
    const unit = step || 1;
    const maxSpaces = maxTicks - 1;
    const { min: rmin , max: rmax  } = dataRange;
    const minDefined = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(min);
    const maxDefined = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(max);
    const countDefined = !(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(count);
    const minSpacing = (rmax - rmin) / (maxDigits + 1);
    let spacing = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aI)((rmax - rmin) / maxSpaces / unit) * unit;
    if (spacing < 1e-14 && !minDefined && !maxDefined) {
        return [
            {
                value: rmin
            },
            {
                value: rmax
            }
        ];
    }
    numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
    if (numSpaces > maxSpaces) spacing = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aI)(numSpaces * spacing / maxSpaces / unit) * unit;
    if (!(0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(precision)) spacing = Math.ceil(spacing * (factor = Math.pow(10, precision))) / factor;
    if ('ticks' === bounds) {
        niceMin = Math.floor(rmin / spacing) * spacing;
        niceMax = Math.ceil(rmax / spacing) * spacing;
    } else {
        niceMin = rmin;
        niceMax = rmax;
    }
    if (minDefined && maxDefined && step && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aJ)((max - min) / step, spacing / 1000)) {
        numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
        spacing = (max - min) / numSpaces;
        niceMin = min;
        niceMax = max;
    } else if (countDefined) {
        niceMin = minDefined ? min : niceMin;
        spacing = ((niceMax = maxDefined ? max : niceMax) - niceMin) / (numSpaces = count - 1);
    } else {
        numSpaces = (niceMax - niceMin) / spacing;
        numSpaces = (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(numSpaces, Math.round(numSpaces), spacing / 1000) ? Math.round(numSpaces) : Math.ceil(numSpaces);
    }
    const decimalPlaces = Math.max((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aL)(spacing), (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aL)(niceMin));
    factor = Math.pow(10, (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.k)(precision) ? decimalPlaces : precision);
    niceMin = Math.round(niceMin * factor) / factor;
    niceMax = Math.round(niceMax * factor) / factor;
    let j = 0;
    if (minDefined) {
        if (includeBounds && niceMin !== min) {
            ticks.push({
                value: min
            });
            if (niceMin < min) j++;
            if ((0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) j++;
        } else if (niceMin < min) j++;
    }
    for(; j < numSpaces; ++j)ticks.push({
        value: Math.round((niceMin + j * spacing) * factor) / factor
    });
    if (maxDefined && includeBounds && niceMax !== max) if (ticks.length && (0, _chunks_helpers_segment_mjs__WEBPACK_IMPORTED_MODULE_0__.aK)(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) ticks[ticks.length - 1].value = max;
    else ticks.push({
        value: max
    });
    else if (!maxDefined || niceMax === max) ticks.push({
        value: niceMax
    });
    return ticks;
}
