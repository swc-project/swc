var jQuery = window.jQuery || {};
function internalRemoveData(elem, name, pvt) {
    if (jQuery.acceptData(elem)) {
        var i, l, thisCache, isNode = elem.nodeType, // See jQuery.data for more information
        cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if (cache[id]) {
            if (name && (thisCache = pvt ? cache[id] : cache[id].data)) {
                for(i = 0, l = (// If "name" is an array of keys...
                // When data is initially created, via ("key", "val") signature,
                // keys will be converted to camelCase.
                // Since there is no way to tell _how_ a key was added, remove
                // both plain key and camelCase key. #12786
                // This will only penalize the array argument path.
                name = jQuery.isArray(name) ? name.concat(jQuery.map(name, jQuery.camelCase)) : (name in thisCache) ? [
                    name
                ] : (// split the camel cased version by spaces unless a key with the spaces exists
                (name = jQuery.camelCase(name)) in thisCache) ? [
                    name
                ] : name.split(" ")).length; i < l; i++)delete thisCache[name[i]];
                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) return;
            }
            // See jQuery.data for more information
            (pvt || (delete cache[id].data, isEmptyDataObject(cache[id]))) && (isNode ? jQuery.cleanData([
                elem
            ], !0) : jQuery.support.deleteExpando || cache != cache.window ? delete cache[id] : cache[id] = null);
        }
    }
}
