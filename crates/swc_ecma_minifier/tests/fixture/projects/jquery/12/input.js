var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
    rmultiDash = /([A-Z])/g;

function internalData(elem, name, data, pvt /* Internal Use Only */) {
    if (!jQuery.acceptData(elem)) {
        return;
    }

    var thisCache, ret,
        internalKey = jQuery.expando,
        getByName = typeof name === "string",

        // We have to handle DOM nodes and JS objects differently because IE6-7
        // can't GC object references properly across the DOM-JS boundary
        isNode = elem.nodeType,

        // Only DOM nodes need the global jQuery cache; JS object data is
        // attached directly to the object so GC can occur automatically
        cache = isNode ? jQuery.cache : elem,

        // Only defining an ID for JS objects if its cache already exists allows
        // the code to shortcut on the same path as a DOM node with no cache
        id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;

    // Avoid doing any more work than we need to when trying to get data on an
    // object that has no data at all
    if ((!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined) {
        return;
    }

    if (!id) {
        // Only DOM nodes need a new unique ID for each element since their data
        // ends up in the global cache
        if (isNode) {
            elem[internalKey] = id = core_deletedIds.pop() || jQuery.guid++;
        } else {
            id = internalKey;
        }
    }

    if (!cache[id]) {
        cache[id] = {};

        // Avoids exposing jQuery metadata on plain JS objects when the object
        // is serialized using JSON.stringify
        if (!isNode) {
            cache[id].toJSON = jQuery.noop;
        }
    }

    // An object can be passed to jQuery.data instead of a key/value pair; this gets
    // shallow copied over onto the existing cache
    if (typeof name === "object" || typeof name === "function") {
        if (pvt) {
            cache[id] = jQuery.extend(cache[id], name);
        } else {
            cache[id].data = jQuery.extend(cache[id].data, name);
        }
    }

    thisCache = cache[id];

    // jQuery data() is stored in a separate object inside the object's internal data
    // cache in order to avoid key collisions between internal data and user-defined
    // data.
    if (!pvt) {
        if (!thisCache.data) {
            thisCache.data = {};
        }

        thisCache = thisCache.data;
    }

    if (data !== undefined) {
        thisCache[jQuery.camelCase(name)] = data;
    }

    // Check for both converted-to-camel and non-converted data property names
    // If a data property was specified
    if (getByName) {

        // First Try to find as-is property data
        ret = thisCache[name];

        // Test for null|undefined property data
        if (ret == null) {

            // Try to find the camelCased property
            ret = thisCache[jQuery.camelCase(name)];
        }
    } else {
        ret = thisCache;
    }

    return ret;
}