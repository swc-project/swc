local.setDocument = function(document) {
    // convert elements / window arguments to document. if document cannot be extrapolated, the function returns.
    var nodeType = document.nodeType;
    if (9 == nodeType) ;
    else if (nodeType) // document
    document = document.ownerDocument; // node
    else {
        if (!document.navigator) return;
        document = document.document; // window
    }
    // check if it's the old document
    if (this.document !== document) {
        this.document = document;
        // check if we have done feature detection on this document before
        var feature, root = document.documentElement, rootUid = this.getUIDXML(root), features = featuresCache[rootUid];
        if (features) {
            for(feature in features)this[feature] = features[feature];
            return;
        }
        (features = featuresCache[rootUid] = {}).root = root, features.isXMLDocument = this.isXML(document), features.brokenStarGEBTN = features.starSelectsClosedQSA = features.idGetsName = features.brokenMixedCaseQSA = features.brokenGEBCN = features.brokenCheckedQSA = features.brokenEmptyAttributeQSA = features.isHTMLDocument = features.nativeMatchesSelector = !1;
        var starSelectsClosed, starSelectsComments, brokenSecondClassNameGEBCN, cachedGetElementsByClassName, brokenFormAttributeGetter, selected, id = "slick_uniqueid", testNode = document.createElement("div"), testRoot = document.body || document.getElementsByTagName("body")[0] || root;
        testRoot.appendChild(testNode);
        // on non-HTML documents innerHTML and getElementsById doesnt work properly
        try {
            testNode.innerHTML = '<a id="' + id + '"></a>', features.isHTMLDocument = !!document.getElementById(id);
        } catch (e) {}
        if (features.isHTMLDocument) {
            testNode.style.display = "none", // IE returns comment nodes for getElementsByTagName('*') for some documents
            testNode.appendChild(document.createComment("")), starSelectsComments = testNode.getElementsByTagName("*").length > 1;
            // IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
            try {
                testNode.innerHTML = "foo</foo>", starSelectsClosed = (selected = testNode.getElementsByTagName("*")) && !!selected.length && "/" == selected[0].nodeName.charAt(0);
            } catch (e) {}
            features.brokenStarGEBTN = starSelectsComments || starSelectsClosed;
            // IE returns elements with the name instead of just id for getElementsById for some documents
            try {
                testNode.innerHTML = '<a name="' + id + '"></a><b id="' + id + '"></b>', features.idGetsName = document.getElementById(id) === testNode.firstChild;
            } catch (e) {}
            if (testNode.getElementsByClassName) {
                // Safari 3.2 getElementsByClassName caches results
                try {
                    testNode.innerHTML = '<a class="f"></a><a class="b"></a>', testNode.getElementsByClassName("b").length, testNode.firstChild.className = "b", cachedGetElementsByClassName = 2 != testNode.getElementsByClassName("b").length;
                } catch (e) {}
                // Opera 9.6 getElementsByClassName doesnt detects the class if its not the first one
                try {
                    testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>', brokenSecondClassNameGEBCN = 2 != testNode.getElementsByClassName("a").length;
                } catch (e) {}
                features.brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
            }
            if (testNode.querySelectorAll) {
                // IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
                try {
                    testNode.innerHTML = "foo</foo>", selected = testNode.querySelectorAll("*"), features.starSelectsClosedQSA = selected && !!selected.length && "/" == selected[0].nodeName.charAt(0);
                } catch (e) {}
                // Safari 3.2 querySelectorAll doesnt work with mixedcase on quirksmode
                try {
                    testNode.innerHTML = '<a class="MiX"></a>', features.brokenMixedCaseQSA = !testNode.querySelectorAll(".MiX").length;
                } catch (e) {}
                // Webkit and Opera dont return selected options on querySelectorAll
                try {
                    testNode.innerHTML = '<select><option selected="selected">a</option></select>', features.brokenCheckedQSA = 0 == testNode.querySelectorAll(":checked").length;
                } catch (e) {}
                // IE returns incorrect results for attr[*^$]="" selectors on querySelectorAll
                try {
                    testNode.innerHTML = '<a class=""></a>', features.brokenEmptyAttributeQSA = 0 != testNode.querySelectorAll('[class*=""]').length;
                } catch (e) {}
            }
            // IE6-7, if a form has an input of id x, form.getAttribute(x) returns a reference to the input
            try {
                testNode.innerHTML = '<form action="s"><input id="action"/></form>', brokenFormAttributeGetter = "s" != testNode.firstChild.getAttribute("action");
            } catch (e) {}
            if (// native matchesSelector function
            features.nativeMatchesSelector = root.matchesSelector || /*root.msMatchesSelector ||*/ root.mozMatchesSelector || root.webkitMatchesSelector, features.nativeMatchesSelector) try {
                // if matchesSelector trows errors on incorrect sintaxes we can use it
                features.nativeMatchesSelector.call(root, ":slick"), features.nativeMatchesSelector = null;
            } catch (e) {}
        }
        try {
            root.slick_expando = 1, delete root.slick_expando, features.getUID = this.getUIDHTML;
        } catch (e) {
            features.getUID = this.getUIDXML;
        }
        testRoot.removeChild(testNode), testNode = selected = testRoot = null, // getAttribute
        features.getAttribute = features.isHTMLDocument && brokenFormAttributeGetter ? function(node, name) {
            var method = this.attributeGetters[name];
            if (method) return method.call(node);
            var attributeNode = node.getAttributeNode(name);
            return attributeNode ? attributeNode.nodeValue : null;
        } : function(node, name) {
            var method = this.attributeGetters[name];
            return method ? method.call(node) : node.getAttribute(name);
        }, // hasAttribute
        features.hasAttribute = root && this.isNativeCode(root.hasAttribute) ? function(node, attribute) {
            return node.hasAttribute(attribute);
        } : function(node, attribute) {
            return !!((node = node.getAttributeNode(attribute)) && (node.specified || node.nodeValue));
        };
        // contains
        // FIXME: Add specs: local.contains should be different for xml and html documents?
        var nativeRootContains = root && this.isNativeCode(root.contains), nativeDocumentContains = document && this.isNativeCode(document.contains);
        for(feature in features.contains = nativeRootContains && nativeDocumentContains ? function(context, node) {
            return context.contains(node);
        } : nativeRootContains && !nativeDocumentContains ? function(context, node) {
            // IE8 does not have .contains on document.
            return context === node || (context === document ? document.documentElement : context).contains(node);
        } : root && root.compareDocumentPosition ? function(context, node) {
            return context === node || !!(16 & context.compareDocumentPosition(node));
        } : function(context, node) {
            if (node) do if (node === context) return !0;
            while (node = node.parentNode)
            return !1;
        }, // document order sorting
        // credits to Sizzle (http://sizzlejs.com/)
        features.documentSorter = root.compareDocumentPosition ? function(a, b) {
            return a.compareDocumentPosition && b.compareDocumentPosition ? 4 & a.compareDocumentPosition(b) ? -1 : +(a !== b) : 0;
        } : "sourceIndex" in root ? function(a, b) {
            return a.sourceIndex && b.sourceIndex ? a.sourceIndex - b.sourceIndex : 0;
        } : document.createRange ? function(a, b) {
            if (!a.ownerDocument || !b.ownerDocument) return 0;
            var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
            return aRange.setStart(a, 0), aRange.setEnd(a, 0), bRange.setStart(b, 0), bRange.setEnd(b, 0), aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
        } : null, root = null, features)this[feature] = features[feature];
    }
};
