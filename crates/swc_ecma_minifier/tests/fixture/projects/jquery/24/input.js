export const obj = {
    buildFragment: function (elems, context, scripts, selection) {
        var j,
            elem,
            contains,
            tmp,
            tag,
            tbody,
            wrap,
            l = elems.length,
            // Ensure a safe fragment
            safe = createSafeFragment(context),
            nodes = [],
            i = 0;

        for (; i < l; i++) {
            elem = elems[i];

            if (elem || elem === 0) {
                // Add nodes directly
                if (jQuery.type(elem) === "object") {
                    jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

                    // Convert non-html into a text node
                } else if (!rhtml.test(elem)) {
                    nodes.push(context.createTextNode(elem));

                    // Convert html into DOM nodes
                } else {
                    tmp = tmp || safe.appendChild(context.createElement("div"));

                    // Deserialize a standard representation
                    tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                    wrap = wrapMap[tag] || wrapMap._default;

                    tmp.innerHTML =
                        wrap[1] +
                        elem.replace(rxhtmlTag, "<$1></$2>") +
                        wrap[2];

                    // Descend through wrappers to the right content
                    j = wrap[0];
                    while (j--) {
                        tmp = tmp.lastChild;
                    }

                    // Manually add leading whitespace removed by IE
                    if (
                        !jQuery.support.leadingWhitespace &&
                        rleadingWhitespace.test(elem)
                    ) {
                        nodes.push(
                            context.createTextNode(
                                rleadingWhitespace.exec(elem)[0]
                            )
                        );
                    }

                    // Remove IE's autoinserted <tbody> from table fragments
                    if (!jQuery.support.tbody) {
                        // String was a <table>, *may* have spurious <tbody>
                        elem =
                            tag === "table" && !rtbody.test(elem)
                                ? tmp.firstChild
                                : // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !rtbody.test(elem)
                                ? tmp
                                : 0;

                        j = elem && elem.childNodes.length;
                        while (j--) {
                            if (
                                jQuery.nodeName(
                                    (tbody = elem.childNodes[j]),
                                    "tbody"
                                ) &&
                                !tbody.childNodes.length
                            ) {
                                elem.removeChild(tbody);
                            }
                        }
                    }

                    jQuery.merge(nodes, tmp.childNodes);

                    // Fix #12392 for WebKit and IE > 9
                    tmp.textContent = "";

                    // Fix #12392 for oldIE
                    while (tmp.firstChild) {
                        tmp.removeChild(tmp.firstChild);
                    }

                    // Remember the top-level container for proper cleanup
                    tmp = safe.lastChild;
                }
            }
        }

        // Fix #11356: Clear elements from fragment
        if (tmp) {
            safe.removeChild(tmp);
        }

        // Reset defaultChecked for any radios and checkboxes
        // about to be appended to the DOM in IE 6/7 (#8060)
        if (!jQuery.support.appendChecked) {
            jQuery.grep(getAll(nodes, "input"), fixDefaultChecked);
        }

        i = 0;
        while ((elem = nodes[i++])) {
            // #4087 - If origin and destination elements are the same, and this is
            // that element, do not do anything
            if (selection && jQuery.inArray(elem, selection) !== -1) {
                continue;
            }

            contains = jQuery.contains(elem.ownerDocument, elem);

            // Append to fragment
            tmp = getAll(safe.appendChild(elem), "script");

            // Preserve script evaluation history
            if (contains) {
                setGlobalEval(tmp);
            }

            // Capture executables
            if (scripts) {
                j = 0;
                while ((elem = tmp[j++])) {
                    if (rscriptType.test(elem.type || "")) {
                        scripts.push(elem);
                    }
                }
            }
        }

        tmp = null;

        return safe;
    },
};
