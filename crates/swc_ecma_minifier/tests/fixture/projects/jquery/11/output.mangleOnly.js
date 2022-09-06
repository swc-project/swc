jQuery.support = (function() {
    var e, t, n, o, i, l, a, d, s, r, c = document.createElement("div");
    c.setAttribute("className", "t");
    c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    t = c.getElementsByTagName("*");
    n = c.getElementsByTagName("a")[0];
    if (!t || !n || !t.length) {
        return {};
    }
    i = document.createElement("select");
    a = i.appendChild(document.createElement("option"));
    o = c.getElementsByTagName("input")[0];
    n.style.cssText = "top:1px;float:left;opacity:.5";
    e = {
        getSetAttribute: c.className !== "t",
        leadingWhitespace: c.firstChild.nodeType === 3,
        tbody: !c.getElementsByTagName("tbody").length,
        htmlSerialize: !!c.getElementsByTagName("link").length,
        style: /top/.test(n.getAttribute("style")),
        hrefNormalized: n.getAttribute("href") === "/a",
        opacity: /^0.5/.test(n.style.opacity),
        cssFloat: !!n.style.cssFloat,
        checkOn: !!o.value,
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
    o.checked = true;
    e.noCloneChecked = o.cloneNode(true).checked;
    i.disabled = true;
    e.optDisabled = !a.disabled;
    try {
        delete c.test;
    } catch (p) {
        e.deleteExpando = false;
    }
    o = document.createElement("input");
    o.setAttribute("value", "");
    e.input = o.getAttribute("value") === "";
    o.value = "t";
    o.setAttribute("type", "radio");
    e.radioValue = o.value === "t";
    o.setAttribute("checked", "t");
    o.setAttribute("name", "t");
    l = document.createDocumentFragment();
    l.appendChild(o);
    e.appendChecked = o.checked;
    e.checkClone = l.cloneNode(true).cloneNode(true).lastChild.checked;
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
        c.setAttribute((d = "on" + r), "t");
        e[r + "Bubbles"] = d in window || c.attributes[d].expando === false;
    }
    c.style.backgroundClip = "content-box";
    c.cloneNode(true).style.backgroundClip = "";
    e.clearCloneStyle = c.style.backgroundClip === "content-box";
    jQuery(function() {
        var t, n, o, i = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", l = document.getElementsByTagName("body")[0];
        if (!l) {
            return;
        }
        t = document.createElement("div");
        t.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
        l.appendChild(t).appendChild(c);
        c.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        o = c.getElementsByTagName("td");
        o[0].style.cssText = "padding:0;margin:0;border:0;display:none";
        s = o[0].offsetHeight === 0;
        o[0].style.display = "";
        o[1].style.display = "none";
        e.reliableHiddenOffsets = s && o[0].offsetHeight === 0;
        c.innerHTML = "";
        c.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
        e.boxSizing = c.offsetWidth === 4;
        e.doesNotIncludeMarginInBodyOffset = l.offsetTop !== 1;
        if (window.getComputedStyle) {
            e.pixelPosition = (window.getComputedStyle(c, null) || {}).top !== "1%";
            e.boxSizingReliable = (window.getComputedStyle(c, null) || {
                width: "4px"
            }).width === "4px";
            n = c.appendChild(document.createElement("div"));
            n.style.cssText = c.style.cssText = i;
            n.style.marginRight = n.style.width = "0";
            c.style.width = "1px";
            e.reliableMarginRight = !parseFloat((window.getComputedStyle(n, null) || {}).marginRight);
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
                l.style.zoom = 1;
            }
        }
        l.removeChild(t);
        t = c = o = n = null;
    });
    t = i = l = a = n = o = null;
    return e;
})();
