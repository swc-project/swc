jQuery.support = (function() {
    var a, b, c, d, e, f, g, h, i, j, k = document.createElement("div");
    k.setAttribute("className", "t");
    k.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    b = k.getElementsByTagName("*");
    c = k.getElementsByTagName("a")[0];
    if (!b || !c || !b.length) {
        return {};
    }
    e = document.createElement("select");
    g = e.appendChild(document.createElement("option"));
    d = k.getElementsByTagName("input")[0];
    c.style.cssText = "top:1px;float:left;opacity:.5";
    a = {
        getSetAttribute: k.className !== "t",
        leadingWhitespace: k.firstChild.nodeType === 3,
        tbody: !k.getElementsByTagName("tbody").length,
        htmlSerialize: !!k.getElementsByTagName("link").length,
        style: /top/.test(c.getAttribute("style")),
        hrefNormalized: c.getAttribute("href") === "/a",
        opacity: /^0.5/.test(c.style.opacity),
        cssFloat: !!c.style.cssFloat,
        checkOn: !!d.value,
        optSelected: g.selected,
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
    d.checked = true;
    a.noCloneChecked = d.cloneNode(true).checked;
    e.disabled = true;
    a.optDisabled = !g.disabled;
    try {
        delete k.test;
    } catch (l) {
        a.deleteExpando = false;
    }
    d = document.createElement("input");
    d.setAttribute("value", "");
    a.input = d.getAttribute("value") === "";
    d.value = "t";
    d.setAttribute("type", "radio");
    a.radioValue = d.value === "t";
    d.setAttribute("checked", "t");
    d.setAttribute("name", "t");
    f = document.createDocumentFragment();
    f.appendChild(d);
    a.appendChecked = d.checked;
    a.checkClone = f.cloneNode(true).cloneNode(true).lastChild.checked;
    if (k.attachEvent) {
        k.attachEvent("onclick", function() {
            a.noCloneEvent = false;
        });
        k.cloneNode(true).click();
    }
    for(j in {
        submit: true,
        change: true,
        focusin: true
    }){
        k.setAttribute((h = "on" + j), "t");
        a[j + "Bubbles"] = h in window || k.attributes[h].expando === false;
    }
    k.style.backgroundClip = "content-box";
    k.cloneNode(true).style.backgroundClip = "";
    a.clearCloneStyle = k.style.backgroundClip === "content-box";
    jQuery(function() {
        var b, c, d, e = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", f = document.getElementsByTagName("body")[0];
        if (!f) {
            return;
        }
        b = document.createElement("div");
        b.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
        f.appendChild(b).appendChild(k);
        k.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
        d = k.getElementsByTagName("td");
        d[0].style.cssText = "padding:0;margin:0;border:0;display:none";
        i = d[0].offsetHeight === 0;
        d[0].style.display = "";
        d[1].style.display = "none";
        a.reliableHiddenOffsets = i && d[0].offsetHeight === 0;
        k.innerHTML = "";
        k.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
        a.boxSizing = k.offsetWidth === 4;
        a.doesNotIncludeMarginInBodyOffset = f.offsetTop !== 1;
        if (window.getComputedStyle) {
            a.pixelPosition = (window.getComputedStyle(k, null) || {}).top !== "1%";
            a.boxSizingReliable = (window.getComputedStyle(k, null) || {
                width: "4px"
            }).width === "4px";
            c = k.appendChild(document.createElement("div"));
            c.style.cssText = k.style.cssText = e;
            c.style.marginRight = c.style.width = "0";
            k.style.width = "1px";
            a.reliableMarginRight = !parseFloat((window.getComputedStyle(c, null) || {}).marginRight);
        }
        if (typeof k.style.zoom !== core_strundefined) {
            k.innerHTML = "";
            k.style.cssText = e + "width:1px;padding:1px;display:inline;zoom:1";
            a.inlineBlockNeedsLayout = k.offsetWidth === 3;
            k.style.display = "block";
            k.innerHTML = "<div></div>";
            k.firstChild.style.width = "5px";
            a.shrinkWrapBlocks = k.offsetWidth !== 3;
            if (a.inlineBlockNeedsLayout) {
                f.style.zoom = 1;
            }
        }
        f.removeChild(b);
        b = k = d = c = null;
    });
    b = e = f = g = c = d = null;
    return a;
})();
