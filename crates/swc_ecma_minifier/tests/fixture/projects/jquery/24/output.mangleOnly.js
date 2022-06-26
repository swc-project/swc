export const obj = {
    buildFragment: function(a, b, c, d) {
        var e, f, g, h, i, j, k, l = a.length, m = createSafeFragment(b), n = [], o = 0;
        for(; o < l; o++){
            f = a[o];
            if (f || f === 0) {
                if (jQuery.type(f) === "object") {
                    jQuery.merge(n, f.nodeType ? [
                        f
                    ] : f);
                } else if (!rhtml.test(f)) {
                    n.push(b.createTextNode(f));
                } else {
                    h = h || m.appendChild(b.createElement("div"));
                    i = (rtagName.exec(f) || [
                        "",
                        ""
                    ])[1].toLowerCase();
                    k = wrapMap[i] || wrapMap._default;
                    h.innerHTML = k[1] + f.replace(rxhtmlTag, "<$1></$2>") + k[2];
                    e = k[0];
                    while(e--){
                        h = h.lastChild;
                    }
                    if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(f)) {
                        n.push(b.createTextNode(rleadingWhitespace.exec(f)[0]));
                    }
                    if (!jQuery.support.tbody) {
                        f = i === "table" && !rtbody.test(f) ? h.firstChild : k[1] === "<table>" && !rtbody.test(f) ? h : 0;
                        e = f && f.childNodes.length;
                        while(e--){
                            if (jQuery.nodeName((j = f.childNodes[e]), "tbody") && !j.childNodes.length) {
                                f.removeChild(j);
                            }
                        }
                    }
                    jQuery.merge(n, h.childNodes);
                    h.textContent = "";
                    while(h.firstChild){
                        h.removeChild(h.firstChild);
                    }
                    h = m.lastChild;
                }
            }
        }
        if (h) {
            m.removeChild(h);
        }
        if (!jQuery.support.appendChecked) {
            jQuery.grep(getAll(n, "input"), fixDefaultChecked);
        }
        o = 0;
        while((f = n[o++])){
            if (d && jQuery.inArray(f, d) !== -1) {
                continue;
            }
            g = jQuery.contains(f.ownerDocument, f);
            h = getAll(m.appendChild(f), "script");
            if (g) {
                setGlobalEval(h);
            }
            if (c) {
                e = 0;
                while((f = h[e++])){
                    if (rscriptType.test(f.type || "")) {
                        c.push(f);
                    }
                }
            }
        }
        h = null;
        return m;
    }
};
