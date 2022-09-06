export const obj = {
    buildFragment: function(e, t, i, r) {
        var l, a, d, h, o, p, n, s = e.length, u = createSafeFragment(t), c = [], f = 0;
        for(; f < s; f++){
            a = e[f];
            if (a || a === 0) {
                if (jQuery.type(a) === "object") {
                    jQuery.merge(c, a.nodeType ? [
                        a
                    ] : a);
                } else if (!rhtml.test(a)) {
                    c.push(t.createTextNode(a));
                } else {
                    h = h || u.appendChild(t.createElement("div"));
                    o = (rtagName.exec(a) || [
                        "",
                        ""
                    ])[1].toLowerCase();
                    n = wrapMap[o] || wrapMap._default;
                    h.innerHTML = n[1] + a.replace(rxhtmlTag, "<$1></$2>") + n[2];
                    l = n[0];
                    while(l--){
                        h = h.lastChild;
                    }
                    if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(a)) {
                        c.push(t.createTextNode(rleadingWhitespace.exec(a)[0]));
                    }
                    if (!jQuery.support.tbody) {
                        a = o === "table" && !rtbody.test(a) ? h.firstChild : n[1] === "<table>" && !rtbody.test(a) ? h : 0;
                        l = a && a.childNodes.length;
                        while(l--){
                            if (jQuery.nodeName((p = a.childNodes[l]), "tbody") && !p.childNodes.length) {
                                a.removeChild(p);
                            }
                        }
                    }
                    jQuery.merge(c, h.childNodes);
                    h.textContent = "";
                    while(h.firstChild){
                        h.removeChild(h.firstChild);
                    }
                    h = u.lastChild;
                }
            }
        }
        if (h) {
            u.removeChild(h);
        }
        if (!jQuery.support.appendChecked) {
            jQuery.grep(getAll(c, "input"), fixDefaultChecked);
        }
        f = 0;
        while((a = c[f++])){
            if (r && jQuery.inArray(a, r) !== -1) {
                continue;
            }
            d = jQuery.contains(a.ownerDocument, a);
            h = getAll(u.appendChild(a), "script");
            if (d) {
                setGlobalEval(h);
            }
            if (i) {
                l = 0;
                while((a = h[l++])){
                    if (rscriptType.test(a.type || "")) {
                        i.push(a);
                    }
                }
            }
        }
        h = null;
        return u;
    }
};
