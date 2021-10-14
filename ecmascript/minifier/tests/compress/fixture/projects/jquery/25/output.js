export const obj = {
    domManip: function(args, table, callback) {
        args = core_concat.apply([], args);
        var first, node, hasScripts, scripts, doc, fragment, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
        if (isFunction || !(l <= 1 || "string" != typeof value || jQuery.support.checkClone || !rchecked.test(value))) return this.each(function(index) {
            var self = set.eq(index);
            isFunction && (args[0] = value.call(this, index, table ? self.html() : void 0)), self.domManip(args, table, callback);
        });
        if (l && (first = (fragment = jQuery.buildFragment(args, this[0].ownerDocument, !1, this)).firstChild, 1 === fragment.childNodes.length && (fragment = first), first)) {
            for(table = table && jQuery.nodeName(first, "tr"), scripts = jQuery.map(getAll(fragment, "script"), disableScript), hasScripts = scripts.length; i < l; i++)node = fragment, i !== iNoClone && (node = jQuery.clone(node, !0, !0), hasScripts && jQuery.merge(scripts, getAll(node, "script"))), callback.call(table && jQuery.nodeName(this[i], "table") ? findOrAppend(this[i], "tbody") : this[i], node, i);
            if (hasScripts) for(doc = scripts[scripts.length - 1].ownerDocument, jQuery.map(scripts, restoreScript), i = 0; i < hasScripts; i++)node = scripts[i], rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval") && jQuery.contains(doc, node) && (node.src ? jQuery.ajax({
                url: node.src,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            }) : jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, "")));
            fragment = first = null;
        }
        return this;
    }
};
