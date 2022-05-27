jQuery.support = (function() {
    var c, e, d, b, f, g, h, i, k, j, a = document.createElement("div");
    a.setAttribute("className", "t");
    a.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    e = a.getElementsByTagName("*");
    d = a.getElementsByTagName("a")[0];
    if (!e || !d || !e.length) {
        return {};
    }
    f = document.createElement("select");
    h = f.appendChild(document.createElement("option"));
    b = a.getElementsByTagName("input")[0];
    d.style.cssText = "top:1px;float:left;opacity:.5";
    c = {
        getSetAttribute: a.className !== "t",
        leadingWhitespace: a.firstChild.nodeType === 3,
        tbody: !a.getElementsByTagName("tbody").length,
        htmlSerialize: !!a.getElementsByTagName("link").length,
        style: /top/.test(d.getAttribute("style")),
        hrefNormalized: d.getAttribute("href") === "/a",
        opacity: /^0.5/.test(d.style.opacity),
        cssFloat: !!d.style.cssFloat,
        checkOn: !!b.value,
        optSelected: h.selected,
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
    b.checked = true;
    c.noCloneChecked = b.cloneNode(true).checked;
    f.disabled = true;
    c.optDisabled = !h.disabled;
    try {
        delete a.test;
    } catch (l) {
        c.deleteExpando = false;
    }
    b = document.createElement("input");
    b.setAttribute("value", "");
    c.input = b.getAttribute("value") === "";
    b.value = "t";
    b.setAttribute("type", "radio");
    c.radioValue = b.value === "t";
    b.setAttribute("checked", "t");
    b.setAttribute("name", "t");
    g = document.createDocumentFragment();
    g.appendChild(b);
    c.appendChecked = b.checked;
    c.checkClone = g.cloneNode(true).cloneNode(true).lastChild.checked;
    if (a.attachEvent) {
        a.attachEvent("onclick", function() {
            c.noCloneEvent = false;
        });
        a.cloneNode(true).click();
    }
    for(j in {
        submit: true,
        change: true,
        focusin: true
    }){
        a.setAttribute((i = "on" + j), "t");
        c[j + "Bubbles"] = i in window || a.attributes[i].expando === false;
    }
    a.style.backgroundClip = "content-box";
    a.cloneNode(true).style.backgroundClip = "";
    c.clearCloneStyle = a.style.backgroundClip === "content-box";
    jQuery(function() {
        var e, d, b, g = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", f = document.getElementsByTagName("body")[0];
        if (!f) {
            return;
        }
        e = document.createElement("div");
        e.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
        f.appendChild(e).appendChild(a);
        a.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        b = a.getElementsByTagName("td");
        b[0].style.cssText = "padding:0;margin:0;border:0;display:none";
        k = b[0].offsetHeight === 0;
        b[0].style.display = "";
        b[1].style.display = "none";
        c.reliableHiddenOffsets = k && b[0].offsetHeight === 0;
        a.innerHTML = "";
        a.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
        c.boxSizing = a.offsetWidth === 4;
        c.doesNotIncludeMarginInBodyOffset = f.offsetTop !== 1;
        if (window.getComputedStyle) {
            c.pixelPosition = (window.getComputedStyle(a, null) || {}).top !== "1%";
            c.boxSizingReliable = (window.getComputedStyle(a, null) || {
                width: "4px"
            }).width === "4px";
            d = a.appendChild(document.createElement("div"));
            d.style.cssText = a.style.cssText = g;
            d.style.marginRight = d.style.width = "0";
            a.style.width = "1px";
            c.reliableMarginRight = !parseFloat((window.getComputedStyle(d, null) || {}).marginRight);
        }
        if (typeof a.style.zoom !== core_strundefined) {
            a.innerHTML = "";
            a.style.cssText = g + "width:1px;padding:1px;display:inline;zoom:1";
            c.inlineBlockNeedsLayout = a.offsetWidth === 3;
            a.style.display = "block";
            a.innerHTML = "<div></div>";
            a.firstChild.style.width = "5px";
            c.shrinkWrapBlocks = a.offsetWidth !== 3;
            if (c.inlineBlockNeedsLayout) {
                f.style.zoom = 1;
            }
        }
        f.removeChild(e);
        e = a = b = d = null;
    });
    e = f = g = h = d = b = null;
    return c;
})();
