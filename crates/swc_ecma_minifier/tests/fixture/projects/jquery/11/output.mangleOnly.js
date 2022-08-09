jQuery.support = (function() {
    var e, t, l, n, i, s, a, o, r, d, c = document.createElement("div");
    c.setAttribute("className", "t");
    c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    t = c.getElementsByTagName("*");
    l = c.getElementsByTagName("a")[0];
    if (!t || !l || !t.length) {
        return {};
    }
    i = document.createElement("select");
    a = i.appendChild(document.createElement("option"));
    n = c.getElementsByTagName("input")[0];
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
        checkOn: !!n.value,
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
    n.checked = true;
    e.noCloneChecked = n.cloneNode(true).checked;
    i.disabled = true;
    e.optDisabled = !a.disabled;
    try {
        delete c.test;
    } catch (u) {
        e.deleteExpando = false;
    }
    n = document.createElement("input");
    n.setAttribute("value", "");
    e.input = n.getAttribute("value") === "";
    n.value = "t";
    n.setAttribute("type", "radio");
    e.radioValue = n.value === "t";
    n.setAttribute("checked", "t");
    n.setAttribute("name", "t");
    s = document.createDocumentFragment();
    s.appendChild(n);
    e.appendChecked = n.checked;
    e.checkClone = s.cloneNode(true).cloneNode(true).lastChild.checked;
    if (c.attachEvent) {
        c.attachEvent("onclick", function() {
            e.noCloneEvent = false;
        });
        c.cloneNode(true).click();
    }
    for(d in {
        submit: true,
        change: true,
        focusin: true
    }){
        c.setAttribute((o = "on" + d), "t");
        e[d + "Bubbles"] = o in window || c.attributes[o].expando === false;
    }
    c.style.backgroundClip = "content-box";
    c.cloneNode(true).style.backgroundClip = "";
    e.clearCloneStyle = c.style.backgroundClip === "content-box";
    jQuery(function() {
        var t, l, n, i = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", s = document.getElementsByTagName("body")[0];
        if (!s) {
            return;
        }
        t = document.createElement("div");
        t.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
        s.appendChild(t).appendChild(c);
        c.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        n = c.getElementsByTagName("td");
        n[0].style.cssText = "padding:0;margin:0;border:0;display:none";
        r = n[0].offsetHeight === 0;
        n[0].style.display = "";
        n[1].style.display = "none";
        e.reliableHiddenOffsets = r && n[0].offsetHeight === 0;
        c.innerHTML = "";
        c.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
        e.boxSizing = c.offsetWidth === 4;
        e.doesNotIncludeMarginInBodyOffset = s.offsetTop !== 1;
        if (window.getComputedStyle) {
            e.pixelPosition = (window.getComputedStyle(c, null) || {}).top !== "1%";
            e.boxSizingReliable = (window.getComputedStyle(c, null) || {
                width: "4px"
            }).width === "4px";
            l = c.appendChild(document.createElement("div"));
            l.style.cssText = c.style.cssText = i;
            l.style.marginRight = l.style.width = "0";
            c.style.width = "1px";
            e.reliableMarginRight = !parseFloat((window.getComputedStyle(l, null) || {}).marginRight);
        }
        if (typeof c.style.zoom !== core_strundefined) {
            c.innerHTML = "";
            c.style.cssText = i + "width:1px;padding:1px;display:inline;zoom:1";
            e.inlineBlockNeedsLayout = c.offsetWidth === 3;
            c.style.display = "block";
            c.innerHTML = "<div></div>";
            c.firstChild.style.width = "5px";
            e.shrinkWrapBlocks = c.offsetWidth !== 3;
            if (e.inlineBlockNeedsLayout) {
                s.style.zoom = 1;
            }
        }
        s.removeChild(t);
        t = c = n = l = null;
    });
    t = i = s = a = l = n = null;
    return e;
})();
