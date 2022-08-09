export const obj = {
    buildFragment: function(e, t, i, l) {
        var d, h, n, o, r, s, p, a = e.length, f = createSafeFragment(t), c = [], u = 0;
        for(; u < a; u++){
            h = e[u];
            if (h || h === 0) {
                if (jQuery.type(h) === "object") {
                    jQuery.merge(c, h.nodeType ? [
                        h
                    ] : h);
                } else if (!rhtml.test(h)) {
                    c.push(t.createTextNode(h));
                } else {
                    o = o || f.appendChild(t.createElement("div"));
                    r = (rtagName.exec(h) || [
                        "",
                        ""
                    ])[1].toLowerCase();
                    p = wrapMap[r] || wrapMap._default;
                    o.innerHTML = p[1] + h.replace(rxhtmlTag, "<$1></$2>") + p[2];
                    d = p[0];
                    while(d--){
                        o = o.lastChild;
                    }
                    if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(h)) {
                        c.push(t.createTextNode(rleadingWhitespace.exec(h)[0]));
                    }
                    if (!jQuery.support.tbody) {
                        h = r === "table" && !rtbody.test(h) ? o.firstChild : p[1] === "<table>" && !rtbody.test(h) ? o : 0;
                        d = h && h.childNodes.length;
                        while(d--){
                            if (jQuery.nodeName((s = h.childNodes[d]), "tbody") && !s.childNodes.length) {
                                h.removeChild(s);
                            }
                        }
                    }
                    jQuery.merge(c, o.childNodes);
                    o.textContent = "";
                    while(o.firstChild){
                        o.removeChild(o.firstChild);
                    }
                    o = f.lastChild;
                }
            }
        }
        if (o) {
            f.removeChild(o);
        }
        if (!jQuery.support.appendChecked) {
            jQuery.grep(getAll(c, "input"), fixDefaultChecked);
        }
        u = 0;
        while((h = c[u++])){
            if (l && jQuery.inArray(h, l) !== -1) {
                continue;
            }
            n = jQuery.contains(h.ownerDocument, h);
            o = getAll(f.appendChild(h), "script");
            if (n) {
                setGlobalEval(o);
            }
            if (i) {
                d = 0;
                while((h = o[d++])){
                    if (rscriptType.test(h.type || "")) {
                        i.push(h);
                    }
                }
            }
        }
        o = null;
        return f;
    }
};
