export const obj = {
    buildFragment: function(elems, context, scripts, selection) {
        for(var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length, safe = createSafeFragment(context), nodes = [], i = 0; i < l; i++)if ((elem = elems[i]) || 0 === elem) {
            if ("object" === jQuery.type(elem)) jQuery.merge(nodes, elem.nodeType ? [
                elem
            ] : elem);
            else if (rhtml.test(elem)) {
                for(tmp = tmp || safe.appendChild(context.createElement("div")), wrap = wrapMap[tag = (rtagName.exec(elem) || [
                    "",
                    ""
                ])[1].toLowerCase()] || wrapMap._default, tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2], j = wrap[0]; j--;)tmp = tmp.lastChild;
                if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem) && nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0])), !jQuery.support.tbody) for(j = (elem = "table" !== tag || rtbody.test(elem) ? "<table>" !== wrap[1] || rtbody.test(elem) ? 0 : tmp : tmp.firstChild) && elem.childNodes.length; j--;)jQuery.nodeName(tbody = elem.childNodes[j], "tbody") && !tbody.childNodes.length && elem.removeChild(tbody);
                for(jQuery.merge(nodes, tmp.childNodes), tmp.textContent = ""; tmp.firstChild;)tmp.removeChild(tmp.firstChild);
                tmp = safe.lastChild;
            } else nodes.push(context.createTextNode(elem));
        }
        for(tmp && safe.removeChild(tmp), jQuery.support.appendChecked || jQuery.grep(getAll(nodes, "input"), fixDefaultChecked), i = 0; elem = nodes[i++];)if ((!selection || -1 === jQuery.inArray(elem, selection)) && (contains = jQuery.contains(elem.ownerDocument, elem), tmp = getAll(safe.appendChild(elem), "script"), contains && setGlobalEval(tmp), scripts)) for(j = 0; elem = tmp[j++];)rscriptType.test(elem.type || "") && scripts.push(elem);
        return tmp = null, safe;
    }
};
