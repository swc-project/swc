export const obj = {
    buildFragment: function(k, h, l, m) {
        var c, a, n, b, i, j, e, o = k.length, f = createSafeFragment(h), d = [], g = 0;
        for(; g < o; g++){
            a = k[g];
            if (a || a === 0) {
                if (jQuery.type(a) === "object") {
                    jQuery.merge(d, a.nodeType ? [
                        a
                    ] : a);
                } else if (!rhtml.test(a)) {
                    d.push(h.createTextNode(a));
                } else {
                    b = b || f.appendChild(h.createElement("div"));
                    i = (rtagName.exec(a) || [
                        "",
                        ""
                    ])[1].toLowerCase();
                    e = wrapMap[i] || wrapMap._default;
                    b.innerHTML = e[1] + a.replace(rxhtmlTag, "<$1></$2>") + e[2];
                    c = e[0];
                    while(c--){
                        b = b.lastChild;
                    }
                    if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(a)) {
                        d.push(h.createTextNode(rleadingWhitespace.exec(a)[0]));
                    }
                    if (!jQuery.support.tbody) {
                        a = i === "table" && !rtbody.test(a) ? b.firstChild : e[1] === "<table>" && !rtbody.test(a) ? b : 0;
                        c = a && a.childNodes.length;
                        while(c--){
                            if (jQuery.nodeName((j = a.childNodes[c]), "tbody") && !j.childNodes.length) {
                                a.removeChild(j);
                            }
                        }
                    }
                    jQuery.merge(d, b.childNodes);
                    b.textContent = "";
                    while(b.firstChild){
                        b.removeChild(b.firstChild);
                    }
                    b = f.lastChild;
                }
            }
        }
        if (b) {
            f.removeChild(b);
        }
        if (!jQuery.support.appendChecked) {
            jQuery.grep(getAll(d, "input"), fixDefaultChecked);
        }
        g = 0;
        while((a = d[g++])){
            if (m && jQuery.inArray(a, m) !== -1) {
                continue;
            }
            n = jQuery.contains(a.ownerDocument, a);
            b = getAll(f.appendChild(a), "script");
            if (n) {
                setGlobalEval(b);
            }
            if (l) {
                c = 0;
                while((a = b[c++])){
                    if (rscriptType.test(a.type || "")) {
                        l.push(a);
                    }
                }
            }
        }
        b = null;
        return f;
    }
};
