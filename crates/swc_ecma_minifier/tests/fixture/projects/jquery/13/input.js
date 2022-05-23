function internalRemoveData(elem, name, pvt) {
    if (!jQuery.acceptData(elem)) {
        return;
    }

    var i,
        l,
        thisCache,
        isNode = elem.nodeType,
        // See jQuery.data for more information
        cache = isNode ? jQuery.cache : elem,
        id = isNode ? elem[jQuery.expando] : jQuery.expando;

    // If there is already no cache entry for this object, there is no
    // purpose in continuing
    if (!cache[id]) {
        return;
    }

    if (name) {
        thisCache = pvt ? cache[id] : cache[id].data;

        if (thisCache) {
            // Support array or space separated string names for data keys
            if (!jQuery.isArray(name)) {
                // try the string as a key before any manipulation
                if (name in thisCache) {
                    name = [name];
                } else {
                    // split the camel cased version by spaces unless a key with the spaces exists
                    name = jQuery.camelCase(name);
                    if (name in thisCache) {
                        name = [name];
                    } else {
                        name = name.split(" ");
                    }
                }
            } else {
                // If "name" is an array of keys...
                // When data is initially created, via ("key", "val") signature,
                // keys will be converted to camelCase.
                // Since there is no way to tell _how_ a key was added, remove
                // both plain key and camelCase key. #12786
                // This will only penalize the array argument path.
                name = name.concat(jQuery.map(name, jQuery.camelCase));
            }

            for (i = 0, l = name.length; i < l; i++) {
                delete thisCache[name[i]];
            }

            // If there is no data left in the cache, we want to continue
            // and let the cache object itself get destroyed
            if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) {
                return;
            }
        }
    }

    // See jQuery.data for more information
    if (!pvt) {
        delete cache[id].data;

        // Don't destroy the parent cache unless the internal data object
        // had been the only thing left in it
        if (!isEmptyDataObject(cache[id])) {
            return;
        }
    }

    // Destroy the cache
    if (isNode) {
        jQuery.cleanData([elem], true);

        // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
    } else if (jQuery.support.deleteExpando || cache != cache.window) {
        delete cache[id];

        // When all else fails, null
    } else {
        cache[id] = null;
    }
}
