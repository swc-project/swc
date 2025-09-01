export const obj = {
    domManip: function(args, table, callback) {
        // Flatten any nested arrays
        args = core_concat.apply([], args);
        var first, node, hasScripts, scripts, doc, fragment, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
        // We can't cloneNode fragments that contain checked, in WebKit
        if (isFunction || !(l <= 1 || "string" != typeof value || jQuery.support.checkClone || !rchecked.test(value))) return this.each(function(index) {
            var self = set.eq(index);
            isFunction && (args[0] = value.call(this, index, table ? self.html() : void 0)), self.domManip(args, table, callback);
        });
        if (l && (first = (fragment = jQuery.buildFragment(args, this[0].ownerDocument, !1, this)).firstChild, 1 === fragment.childNodes.length && (fragment = first), first)) {
            // Use the original fragment for the last item instead of the first because it can end up
            // being emptied incorrectly in certain situations (#8070).
            for(table = table && jQuery.nodeName(first, "tr"), hasScripts = (scripts = jQuery.map(getAll(fragment, "script"), disableScript)).length; i < l; i++)node = fragment, i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), callback.call(table && jQuery.nodeName(this[i], "table") ? findOrAppend(this[i], "tbody") : this[i], node, i);
            if (hasScripts) // Evaluate executable scripts on first document insertion
            for(doc = scripts[scripts.length - 1].ownerDocument, // Reenable scripts
            jQuery.map(scripts, restoreScript), i = 0; i < hasScripts; i++)node = scripts[i], rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? // Hope ajax is available...
            jQuery.ajax({
                url: node.src,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                throws: !0
            }) : jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, "")));
            // Fix #11809: Avoid leaking memory
            fragment = first = null;
        }
        return this;
    }
};
