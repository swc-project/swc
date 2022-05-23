jQuery.support = function() {
    var support, all, a, input, select, fragment, opt, eventName, isSupported, i, div = document.createElement("div");
    if (div.setAttribute("className", "t"), div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", all = div.getElementsByTagName("*"), a = div.getElementsByTagName("a")[0], !all || !a || !all.length) return {};
    opt = (select = document.createElement("select")).appendChild(document.createElement("option")), input = div.getElementsByTagName("input")[0], a.style.cssText = "top:1px;float:left;opacity:.5", support = {
        getSetAttribute: "t" !== div.className,
        leadingWhitespace: 3 === div.firstChild.nodeType,
        tbody: !div.getElementsByTagName("tbody").length,
        htmlSerialize: !!div.getElementsByTagName("link").length,
        style: /top/.test(a.getAttribute("style")),
        hrefNormalized: "/a" === a.getAttribute("href"),
        opacity: /^0.5/.test(a.style.opacity),
        cssFloat: !!a.style.cssFloat,
        checkOn: !!input.value,
        optSelected: opt.selected,
        enctype: !!document.createElement("form").enctype,
        html5Clone: "<:nav></:nav>" !== document.createElement("nav").cloneNode(!0).outerHTML,
        boxModel: "CSS1Compat" === document.compatMode,
        deleteExpando: !0,
        noCloneEvent: !0,
        inlineBlockNeedsLayout: !1,
        shrinkWrapBlocks: !1,
        reliableMarginRight: !0,
        boxSizingReliable: !0,
        pixelPosition: !1
    }, input.checked = !0, support.noCloneChecked = input.cloneNode(!0).checked, select.disabled = !0, support.optDisabled = !opt.disabled;
    try {
        delete div.test;
    } catch (e) {
        support.deleteExpando = !1;
    }
    for(i in (input = document.createElement("input")).setAttribute("value", ""), support.input = "" === input.getAttribute("value"), input.value = "t", input.setAttribute("type", "radio"), support.radioValue = "t" === input.value, input.setAttribute("checked", "t"), input.setAttribute("name", "t"), (fragment = document.createDocumentFragment()).appendChild(input), support.appendChecked = input.checked, support.checkClone = fragment.cloneNode(!0).cloneNode(!0).lastChild.checked, div.attachEvent && (div.attachEvent("onclick", function() {
        support.noCloneEvent = !1;
    }), div.cloneNode(!0).click()), {
        submit: !0,
        change: !0,
        focusin: !0
    })div.setAttribute(eventName = "on" + i, "t"), support[i + "Bubbles"] = eventName in window || !1 === div.attributes[eventName].expando;
    return div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = "content-box" === div.style.backgroundClip, jQuery(function() {
        var container, marginDiv, tds, divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", body = document.getElementsByTagName("body")[0];
        body && ((container = document.createElement("div")).style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", body.appendChild(container).appendChild(div), div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", (tds = div.getElementsByTagName("td"))[0].style.cssText = "padding:0;margin:0;border:0;display:none", isSupported = 0 === tds[0].offsetHeight, tds[0].style.display = "", tds[1].style.display = "none", support.reliableHiddenOffsets = isSupported && 0 === tds[0].offsetHeight, div.innerHTML = "", div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", support.boxSizing = 4 === div.offsetWidth, support.doesNotIncludeMarginInBodyOffset = 1 !== body.offsetTop, window.getComputedStyle && (support.pixelPosition = "1%" !== (window.getComputedStyle(div, null) || {}).top, support.boxSizingReliable = "4px" === (window.getComputedStyle(div, null) || {
            width: "4px"
        }).width, (marginDiv = div.appendChild(document.createElement("div"))).style.cssText = div.style.cssText = divReset, marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight)), typeof div.style.zoom !== core_strundefined && (div.innerHTML = "", div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1", support.inlineBlockNeedsLayout = 3 === div.offsetWidth, div.style.display = "block", div.innerHTML = "<div></div>", div.firstChild.style.width = "5px", support.shrinkWrapBlocks = 3 !== div.offsetWidth, support.inlineBlockNeedsLayout && (body.style.zoom = 1)), body.removeChild(container), container = div = tds = marginDiv = null);
    }), all = select = fragment = opt = a = input = null, support;
}();
