jQuery.support = function() {
    var support, all, a, input, select, fragment, opt, eventName, isSupported, i, div = document.createElement("div");
    if (// Setup
    div.setAttribute("className", "t"), div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", // Support tests won't run in some limited or non-browser environments
    all = div.getElementsByTagName("*"), a = div.getElementsByTagName("a")[0], !all || !a || !all.length) return {};
    opt = // First batch of tests
    (select = document.createElement("select")).appendChild(document.createElement("option")), input = div.getElementsByTagName("input")[0], a.style.cssText = "top:1px;float:left;opacity:.5", support = {
        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
        getSetAttribute: "t" !== div.className,
        // IE strips leading whitespace when .innerHTML is used
        leadingWhitespace: 3 === div.firstChild.nodeType,
        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        tbody: !div.getElementsByTagName("tbody").length,
        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        htmlSerialize: !!div.getElementsByTagName("link").length,
        // Get the style information from getAttribute
        // (IE uses .cssText instead)
        style: /top/.test(a.getAttribute("style")),
        // Make sure that URLs aren't manipulated
        // (IE normalizes it by default)
        hrefNormalized: "/a" === a.getAttribute("href"),
        // Make sure that element opacity exists
        // (IE uses filter instead)
        // Use a regex to work around a WebKit issue. See #5145
        opacity: /^0.5/.test(a.style.opacity),
        // Verify style float existence
        // (IE uses styleFloat instead of cssFloat)
        cssFloat: !!a.style.cssFloat,
        // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
        checkOn: !!input.value,
        // Make sure that a selected-by-default option has a working selected property.
        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
        optSelected: opt.selected,
        // Tests for enctype support on a form (#6743)
        enctype: !!document.createElement("form").enctype,
        // Makes sure cloning an html5 element does not cause problems
        // Where outerHTML is undefined, this still works
        html5Clone: "<:nav></:nav>" !== document.createElement("nav").cloneNode(!0).outerHTML,
        // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
        boxModel: "CSS1Compat" === document.compatMode,
        // Will be defined later
        deleteExpando: !0,
        noCloneEvent: !0,
        inlineBlockNeedsLayout: !1,
        shrinkWrapBlocks: !1,
        reliableMarginRight: !0,
        boxSizingReliable: !0,
        pixelPosition: !1
    }, // Make sure checked status is properly cloned
    input.checked = !0, support.noCloneChecked = input.cloneNode(!0).checked, // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    select.disabled = !0, support.optDisabled = !opt.disabled;
    // Support: IE<9
    try {
        delete div.test;
    } catch (e) {
        support.deleteExpando = !1;
    }
    // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
    // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
    for(i in // Check if we can trust getAttribute("value")
    (input = document.createElement("input")).setAttribute("value", ""), support.input = "" === input.getAttribute("value"), // Check if an input maintains its value after becoming a radio
    input.value = "t", input.setAttribute("type", "radio"), support.radioValue = "t" === input.value, // #11217 - WebKit loses check when the name is after the checked attribute
    input.setAttribute("checked", "t"), input.setAttribute("name", "t"), (fragment = document.createDocumentFragment()).appendChild(input), // Check if a disconnected checkbox will retain its checked
    // value of true after appended to the DOM (IE6/7)
    support.appendChecked = input.checked, // WebKit doesn't clone checked state correctly in fragments
    support.checkClone = fragment.cloneNode(!0).cloneNode(!0).lastChild.checked, div.attachEvent && (div.attachEvent("onclick", function() {
        support.noCloneEvent = !1;
    }), div.cloneNode(!0).click()), {
        submit: !0,
        change: !0,
        focusin: !0
    })div.setAttribute(eventName = "on" + i, "t"), support[i + "Bubbles"] = eventName in window || !1 === div.attributes[eventName].expando;
    return div.style.backgroundClip = "content-box", div.cloneNode(!0).style.backgroundClip = "", support.clearCloneStyle = "content-box" === div.style.backgroundClip, // Run tests that need a body at doc ready
    jQuery(function() {
        var container, marginDiv, tds, divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", body = document.getElementsByTagName("body")[0];
        body && ((container = document.createElement("div")).style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", body.appendChild(container).appendChild(div), // Support: IE8
        // Check if table cells still have offsetWidth/Height when they are set
        // to display:none and there are still other visible table cells in a
        // table row; if so, offsetWidth/Height are not reliable for use when
        // determining if an element has been hidden directly using
        // display:none (it is still safe to use offsets if a parent element is
        // hidden; don safety goggles and see bug #4512 for more information).
        div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", (tds = div.getElementsByTagName("td"))[0].style.cssText = "padding:0;margin:0;border:0;display:none", isSupported = 0 === tds[0].offsetHeight, tds[0].style.display = "", tds[1].style.display = "none", // Support: IE8
        // Check if empty table cells still have offsetWidth/Height
        support.reliableHiddenOffsets = isSupported && 0 === tds[0].offsetHeight, // Check box-sizing and margin behavior
        div.innerHTML = "", div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", support.boxSizing = 4 === div.offsetWidth, support.doesNotIncludeMarginInBodyOffset = 1 !== body.offsetTop, window.getComputedStyle && (support.pixelPosition = "1%" !== (window.getComputedStyle(div, null) || {}).top, support.boxSizingReliable = "4px" === (window.getComputedStyle(div, null) || {
            width: "4px"
        }).width, // Check if div with explicit width and no margin-right incorrectly
        // gets computed margin-right based on width of container. (#3333)
        // Fails in WebKit before Feb 2011 nightlies
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        (marginDiv = div.appendChild(document.createElement("div"))).style.cssText = div.style.cssText = divReset, marginDiv.style.marginRight = marginDiv.style.width = "0", div.style.width = "1px", support.reliableMarginRight = !parseFloat((window.getComputedStyle(marginDiv, null) || {}).marginRight)), typeof div.style.zoom !== core_strundefined && (// Support: IE<8
        // Check if natively block-level elements act like inline-block
        // elements when setting their display to 'inline' and giving
        // them layout
        div.innerHTML = "", div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1", support.inlineBlockNeedsLayout = 3 === div.offsetWidth, // Support: IE6
        // Check if elements with layout shrink-wrap their children
        div.style.display = "block", div.innerHTML = "<div></div>", div.firstChild.style.width = "5px", support.shrinkWrapBlocks = 3 !== div.offsetWidth, support.inlineBlockNeedsLayout && // Prevent IE 6 from affecting layout for positioned elements #11048
        // Prevent IE from shrinking the body in IE 7 mode #12869
        // Support: IE<8
        (body.style.zoom = 1)), body.removeChild(container), div = null);
    }), // Null elements to avoid leaks in IE
    all = select = fragment = opt = a = input = null, support;
}();
