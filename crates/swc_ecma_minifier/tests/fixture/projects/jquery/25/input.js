export const obj = {
    domManip: function (args, table, callback) {
        // Flatten any nested arrays
        args = core_concat.apply([], args);

        var first,
            node,
            hasScripts,
            scripts,
            doc,
            fragment,
            i = 0,
            l = this.length,
            set = this,
            iNoClone = l - 1,
            value = args[0],
            isFunction = jQuery.isFunction(value);

        // We can't cloneNode fragments that contain checked, in WebKit
        if (
            isFunction ||
            !(
                l <= 1 ||
                typeof value !== "string" ||
                jQuery.support.checkClone ||
                !rchecked.test(value)
            )
        ) {
            return this.each(function (index) {
                var self = set.eq(index);
                if (isFunction) {
                    args[0] = value.call(
                        this,
                        index,
                        table ? self.html() : undefined
                    );
                }
                self.domManip(args, table, callback);
            });
        }

        if (l) {
            fragment = jQuery.buildFragment(
                args,
                this[0].ownerDocument,
                false,
                this
            );
            first = fragment.firstChild;

            if (fragment.childNodes.length === 1) {
                fragment = first;
            }

            if (first) {
                table = table && jQuery.nodeName(first, "tr");
                scripts = jQuery.map(getAll(fragment, "script"), disableScript);
                hasScripts = scripts.length;

                // Use the original fragment for the last item instead of the first because it can end up
                // being emptied incorrectly in certain situations (#8070).
                for (; i < l; i++) {
                    node = fragment;

                    if (i !== iNoClone) {
                        node = jQuery.clone(node, true, true);

                        // Keep references to cloned scripts for later restoration
                        if (hasScripts) {
                            jQuery.merge(scripts, getAll(node, "script"));
                        }
                    }

                    callback.call(
                        table && jQuery.nodeName(this[i], "table")
                            ? findOrAppend(this[i], "tbody")
                            : this[i],
                        node,
                        i
                    );
                }

                if (hasScripts) {
                    doc = scripts[scripts.length - 1].ownerDocument;

                    // Reenable scripts
                    jQuery.map(scripts, restoreScript);

                    // Evaluate executable scripts on first document insertion
                    for (i = 0; i < hasScripts; i++) {
                        node = scripts[i];
                        if (
                            rscriptType.test(node.type || "") &&
                            !jQuery._data(node, "globalEval") &&
                            jQuery.contains(doc, node)
                        ) {
                            if (node.src) {
                                // Hope ajax is available...
                                jQuery.ajax({
                                    url: node.src,
                                    type: "GET",
                                    dataType: "script",
                                    async: false,
                                    global: false,
                                    throws: true,
                                });
                            } else {
                                jQuery.globalEval(
                                    (
                                        node.text ||
                                        node.textContent ||
                                        node.innerHTML ||
                                        ""
                                    ).replace(rcleanScript, "")
                                );
                            }
                        }
                    }
                }

                // Fix #11809: Avoid leaking memory
                fragment = first = null;
            }
        }

        return this;
    },
};
