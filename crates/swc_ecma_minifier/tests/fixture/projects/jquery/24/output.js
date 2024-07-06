export const obj = {
    buildFragment: function(elems, context, scripts, selection) {
        for(var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length, // Ensure a safe fragment
        safe = createSafeFragment(context), nodes = [], i = 0; i < l; i++)if ((elem = elems[i]) || 0 === elem) {
            // Add nodes directly
            if ("object" === jQuery.type(elem)) jQuery.merge(nodes, elem.nodeType ? [
                elem
            ] : elem);
            else if (rhtml.test(elem)) {
                for(tmp = tmp || safe.appendChild(context.createElement("div")), // Deserialize a standard representation
                tag = (rtagName.exec(elem) || [
                    "",
                    ""
                ])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2], // Descend through wrappers to the right content
                j = wrap[0]; j--;)tmp = tmp.lastChild;
                // Remove IE's autoinserted <tbody> from table fragments
                if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem) && nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0])), !jQuery.support.tbody) for(j = // String was a <table>, *may* have spurious <tbody>
                (elem = "table" !== tag || rtbody.test(elem) ? "<table>" !== wrap[1] || rtbody.test(elem) ? 0 : tmp : tmp.firstChild) && elem.childNodes.length; j--;)jQuery.nodeName(tbody = elem.childNodes[j], "tbody") && !tbody.childNodes.length && elem.removeChild(tbody);
                // Fix #12392 for oldIE
                for(jQuery.merge(nodes, tmp.childNodes), // Fix #12392 for WebKit and IE > 9
                tmp.textContent = ""; tmp.firstChild;)tmp.removeChild(tmp.firstChild);
                // Remember the top-level container for proper cleanup
                tmp = safe.lastChild;
            } else nodes.push(context.createTextNode(elem));
        }
        for(tmp && safe.removeChild(tmp), jQuery.support.appendChecked || jQuery.grep(getAll(nodes, "input"), fixDefaultChecked), i = 0; elem = nodes[i++];)// #4087 - If origin and destination elements are the same, and this is
        // that element, do not do anything
        if ((!selection || -1 === jQuery.inArray(elem, selection)) && (contains = jQuery.contains(elem.ownerDocument, elem), // Append to fragment
        tmp = getAll(safe.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts)) for(j = 0; elem = tmp[j++];)rscriptType.test(elem.type || "") && scripts.push(elem);
        return tmp = null, safe;
    }
};
