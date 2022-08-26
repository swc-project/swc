export const obj = {
    buildFragment: function(e, t, i, l) {
        var d, o, n, r, h, s, p, a = e.length, c = createSafeFragment(t), f = [], u = 0;
        for(; u < a; u++){
            o = e[u];
            if (o || o === 0) {
                if (jQuery.type(o) === "object") {
                    jQuery.merge(f, o.nodeType ? [
                        o
                    ] : o);
                } else if (!rhtml.test(o)) {
                    f.push(t.createTextNode(o));
                } else {
                    r = r || c.appendChild(t.createElement("div"));
                    h = (rtagName.exec(o) || [
                        "",
                        ""
                    ])[1].toLowerCase();
                    p = wrapMap[h] || wrapMap._default;
                    r.innerHTML = p[1] + o.replace(rxhtmlTag, "<$1></$2>") + p[2];
                    d = p[0];
                    while(d--){
                        r = r.lastChild;
                    }
                    if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(o)) {
                        f.push(t.createTextNode(rleadingWhitespace.exec(o)[0]));
                    }
                    if (!jQuery.support.tbody) {
                        o = h === "table" && !rtbody.test(o) ? r.firstChild : p[1] === "<table>" && !rtbody.test(o) ? r : 0;
                        d = o && o.childNodes.length;
                        while(d--){
                            if (jQuery.nodeName((s = o.childNodes[d]), "tbody") && !s.childNodes.length) {
                                o.removeChild(s);
                            }
                        }
                    }
                    jQuery.merge(f, r.childNodes);
                    r.textContent = "";
                    while(r.firstChild){
                        r.removeChild(r.firstChild);
                    }
                    r = c.lastChild;
                }
            }
        }
        if (r) {
            c.removeChild(r);
        }
        if (!jQuery.support.appendChecked) {
            jQuery.grep(getAll(f, "input"), fixDefaultChecked);
        }
        u = 0;
        while((o = f[u++])){
            if (l && jQuery.inArray(o, l) !== -1) {
                continue;
            }
            n = jQuery.contains(o.ownerDocument, o);
            r = getAll(c.appendChild(o), "script");
            if (n) {
                setGlobalEval(r);
            }
            if (i) {
                d = 0;
                while((o = r[d++])){
                    if (rscriptType.test(o.type || "")) {
                        i.push(o);
                    }
                }
            }
        }
        r = null;
        return c;
    }
};
