jQuery.support = (function() {
    var e, t, l, i, n, o, a, s, d, r, c = document.createElement("div");
    c.setAttribute("className", "t");
    c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    t = c.getElementsByTagName("*");
    l = c.getElementsByTagName("a")[0];
    if (!t || !l || !t.length) {
        return {};
    }
    n = document.createElement("select");
    a = n.appendChild(document.createElement("option"));
    i = c.getElementsByTagName("input")[0];
    l.style.cssText = "top:1px;float:left;opacity:.5";
    e = {
        getSetAttribute: c.className !== "t",
        leadingWhitespace: c.firstChild.nodeType === 3,
        tbody: !c.getElementsByTagName("tbody").length,
        htmlSerialize: !!c.getElementsByTagName("link").length,
        style: /top/.test(l.getAttribute("style")),
        hrefNormalized: l.getAttribute("href") === "/a",
        opacity: /^0.5/.test(l.style.opacity),
        cssFloat: !!l.style.cssFloat,
        checkOn: !!i.value,
        optSelected: a.selected,
        enctype: !!document.createElement("form").enctype,
        html5Clone: document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",
        boxModel: document.compatMode === "CSS1Compat",
        deleteExpando: true,
        noCloneEvent: true,
        inlineBlockNeedsLayout: false,
        shrinkWrapBlocks: false,
        reliableMarginRight: true,
        boxSizingReliable: true,
        pixelPosition: false
    };
    i.checked = true;
    e.noCloneChecked = i.cloneNode(true).checked;
    n.disabled = true;
    e.optDisabled = !a.disabled;
    try {
        delete c.test;
    } catch (p) {
        e.deleteExpando = false;
    }
    i = document.createElement("input");
    i.setAttribute("value", "");
    e.input = i.getAttribute("value") === "";
    i.value = "t";
    i.setAttribute("type", "radio");
    e.radioValue = i.value === "t";
    i.setAttribute("checked", "t");
    i.setAttribute("name", "t");
    o = document.createDocumentFragment();
    o.appendChild(i);
    e.appendChecked = i.checked;
    e.checkClone = o.cloneNode(true).cloneNode(true).lastChild.checked;
    if (c.attachEvent) {
        c.attachEvent("onclick", function() {
            e.noCloneEvent = false;
        });
        c.cloneNode(true).click();
    }
    for(r in {
        submit: true,
        change: true,
        focusin: true
    }){
        c.setAttribute((s = "on" + r), "t");
        e[r + "Bubbles"] = s in window || c.attributes[s].expando === false;
    }
    c.style.backgroundClip = "content-box";
    c.cloneNode(true).style.backgroundClip = "";
    e.clearCloneStyle = c.style.backgroundClip === "content-box";
    jQuery(function() {
        var t, l, i, n = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", o = document.getElementsByTagName("body")[0];
        if (!o) {
            return;
        }
        t = document.createElement("div");
        t.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
        o.appendChild(t).appendChild(c);
        c.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        i = c.getElementsByTagName("td");
        i[0].style.cssText = "padding:0;margin:0;border:0;display:none";
        d = i[0].offsetHeight === 0;
        i[0].style.display = "";
        i[1].style.display = "none";
        e.reliableHiddenOffsets = d && i[0].offsetHeight === 0;
        c.innerHTML = "";
        c.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
        e.boxSizing = c.offsetWidth === 4;
        e.doesNotIncludeMarginInBodyOffset = o.offsetTop !== 1;
        if (window.getComputedStyle) {
            e.pixelPosition = (window.getComputedStyle(c, null) || {}).top !== "1%";
            e.boxSizingReliable = (window.getComputedStyle(c, null) || {
                width: "4px"
            }).width === "4px";
            l = c.appendChild(document.createElement("div"));
            l.style.cssText = c.style.cssText = n;
            l.style.marginRight = l.style.width = "0";
            c.style.width = "1px";
            e.reliableMarginRight = !parseFloat((window.getComputedStyle(l, null) || {}).marginRight);
        }
        if (typeof c.style.zoom !== core_strundefined) {
            c.innerHTML = "";
            c.style.cssText = n + "width:1px;padding:1px;display:inline;zoom:1";
            e.inlineBlockNeedsLayout = c.offsetWidth === 3;
            c.style.display = "block";
            c.innerHTML = "<div></div>";
            c.firstChild.style.width = "5px";
            e.shrinkWrapBlocks = c.offsetWidth !== 3;
            if (e.inlineBlockNeedsLayout) {
                o.style.zoom = 1;
            }
        }
        o.removeChild(t);
        t = c = i = l = null;
    });
    t = n = o = a = l = i = null;
    return e;
})();
