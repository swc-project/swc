var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, rmultiDash = /([A-Z])/g;
function internalData(elem, name, data, pvt /* Internal Use Only */ ) {
    if (jQuery.acceptData(elem)) {
        var thisCache, ret, internalKey = jQuery.expando, getByName = "string" == typeof name, // We have to handle DOM nodes and JS objects differently because IE6-7
        // can't GC object references properly across the DOM-JS boundary
        isNode = elem.nodeType, // Only DOM nodes need the global jQuery cache; JS object data is
        // attached directly to the object so GC can occur automatically
        cache = isNode ? jQuery.cache : elem, // Only defining an ID for JS objects if its cache already exists allows
        // the code to shortcut on the same path as a DOM node with no cache
        id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if (id && cache[id] && (pvt || cache[id].data) || !getByName || void 0 !== data) return id || (isNode ? elem[internalKey] = id = core_deletedIds.pop() || jQuery.guid++ : id = internalKey), cache[id] || (cache[id] = {}, isNode || (cache[id].toJSON = jQuery.noop)), ("object" == typeof name || "function" == typeof name) && (pvt ? cache[id] = jQuery.extend(cache[id], name) : cache[id].data = jQuery.extend(cache[id].data, name)), thisCache = cache[id], pvt || (thisCache.data || (thisCache.data = {}), thisCache = thisCache.data), void 0 !== data && (thisCache[jQuery.camelCase(name)] = data), getByName ? null == // First Try to find as-is property data
        (ret = thisCache[name]) && // Try to find the camelCased property
        (ret = thisCache[jQuery.camelCase(name)]) : ret = thisCache, ret;
    }
}
