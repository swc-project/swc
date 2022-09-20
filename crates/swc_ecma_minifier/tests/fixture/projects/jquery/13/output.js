function internalRemoveData(elem, name, pvt) {
    if (jQuery.acceptData(elem)) {
        var i, l, thisCache, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
        if (cache[id]) {
            if (name && (thisCache = pvt ? cache[id] : cache[id].data)) {
                name = jQuery.isArray(name) ? name.concat(jQuery.map(name, jQuery.camelCase)) : name in thisCache ? [
                    name
                ] : (name = jQuery.camelCase(name)) in thisCache ? [
                    name
                ] : name.split(" ");
                for(i = 0, l = name.length; i < l; i++)delete thisCache[name[i]];
                if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache)) return;
            }
            if (!pvt) {
                delete cache[id].data;
                if (!isEmptyDataObject(cache[id])) return;
            }
            isNode ? jQuery.cleanData([
                elem
            ], !0) : jQuery.support.deleteExpando || cache != cache.window ? delete cache[id] : cache[id] = null;
        }
    }
}
