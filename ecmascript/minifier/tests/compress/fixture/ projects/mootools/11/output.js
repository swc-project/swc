local.setDocument = function(document) {
    var nodeType = document.nodeType;
    if (9 == nodeType) ;
    else if (nodeType) document = document.ownerDocument;
    else {
        if (!document.navigator) return;
        document = document.document;
    }
    if (this.document !== document) {
        this.document = document;
        var feature, root = document.documentElement, rootUid = this.getUIDXML(root), features = featuresCache[rootUid];
        if (features) for(feature in features)this[feature] = features[feature];
        else {
            (features = featuresCache[rootUid] = {
            }).root = root, features.isXMLDocument = this.isXML(document), features.brokenStarGEBTN = features.starSelectsClosedQSA = features.idGetsName = features.brokenMixedCaseQSA = features.brokenGEBCN = features.brokenCheckedQSA = features.brokenEmptyAttributeQSA = features.isHTMLDocument = features.nativeMatchesSelector = !1;
            var starSelectsClosed, starSelectsComments, brokenSecondClassNameGEBCN, cachedGetElementsByClassName, brokenFormAttributeGetter, selected, id = "slick_uniqueid", testNode = document.createElement("div"), testRoot = document.body || document.getElementsByTagName("body")[0] || root;
            testRoot.appendChild(testNode);
            try {
                testNode.innerHTML = "<a id=\"" + id + "\"></a>", features.isHTMLDocument = !!document.getElementById(id);
            } catch (e) {
            }
            if (features.isHTMLDocument) {
                testNode.style.display = "none", testNode.appendChild(document.createComment("")), starSelectsComments = testNode.getElementsByTagName("*").length > 1;
                try {
                    testNode.innerHTML = "foo</foo>", starSelectsClosed = (selected = testNode.getElementsByTagName("*")) && !!selected.length && "/" == selected[0].nodeName.charAt(0);
                } catch (e) {
                }
                features.brokenStarGEBTN = starSelectsComments || starSelectsClosed;
                try {
                    testNode.innerHTML = "<a name=\"" + id + "\"></a><b id=\"" + id + "\"></b>", features.idGetsName = document.getElementById(id) === testNode.firstChild;
                } catch (e) {
                }
                if (testNode.getElementsByClassName) {
                    try {
                        testNode.innerHTML = "<a class=\"f\"></a><a class=\"b\"></a>", testNode.getElementsByClassName("b").length, testNode.firstChild.className = "b", cachedGetElementsByClassName = 2 != testNode.getElementsByClassName("b").length;
                    } catch (e) {
                    }
                    try {
                        testNode.innerHTML = "<a class=\"a\"></a><a class=\"f b a\"></a>", brokenSecondClassNameGEBCN = 2 != testNode.getElementsByClassName("a").length;
                    } catch (e) {
                    }
                    features.brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
                }
                if (testNode.querySelectorAll) {
                    try {
                        testNode.innerHTML = "foo</foo>", selected = testNode.querySelectorAll("*"), features.starSelectsClosedQSA = selected && !!selected.length && "/" == selected[0].nodeName.charAt(0);
                    } catch (e) {
                    }
                    try {
                        testNode.innerHTML = "<a class=\"MiX\"></a>", features.brokenMixedCaseQSA = !testNode.querySelectorAll(".MiX").length;
                    } catch (e) {
                    }
                    try {
                        testNode.innerHTML = "<select><option selected=\"selected\">a</option></select>", features.brokenCheckedQSA = 0 == testNode.querySelectorAll(":checked").length;
                    } catch (e) {
                    }
                    try {
                        testNode.innerHTML = "<a class=\"\"></a>", features.brokenEmptyAttributeQSA = 0 != testNode.querySelectorAll("[class*=\"\"]").length;
                    } catch (e) {
                    }
                }
                try {
                    testNode.innerHTML = "<form action=\"s\"><input id=\"action\"/></form>", brokenFormAttributeGetter = "s" != testNode.firstChild.getAttribute("action");
                } catch (e) {
                }
                if (features.nativeMatchesSelector = root.matchesSelector || root.mozMatchesSelector || root.webkitMatchesSelector, features.nativeMatchesSelector) try {
                    features.nativeMatchesSelector.call(root, ":slick"), features.nativeMatchesSelector = null;
                } catch (e) {
                }
            }
            try {
                root.slick_expando = 1, delete root.slick_expando, features.getUID = this.getUIDHTML;
            } catch (e) {
                features.getUID = this.getUIDXML;
            }
            testRoot.removeChild(testNode), testNode = selected = testRoot = null, features.getAttribute = features.isHTMLDocument && brokenFormAttributeGetter ? function(node, name) {
                var method = this.attributeGetters[name];
                if (method) return method.call(node);
                var attributeNode = node.getAttributeNode(name);
                return attributeNode ? attributeNode.nodeValue : null;
            } : function(node, name) {
                var method = this.attributeGetters[name];
                return method ? method.call(node) : node.getAttribute(name);
            }, features.hasAttribute = root && this.isNativeCode(root.hasAttribute) ? function(node, attribute) {
                return node.hasAttribute(attribute);
            } : function(node, attribute) {
                return !!((node = node.getAttributeNode(attribute)) && (node.specified || node.nodeValue));
            };
            var nativeRootContains = root && this.isNativeCode(root.contains), nativeDocumentContains = document && this.isNativeCode(document.contains);
            for(feature in features.contains = nativeRootContains && nativeDocumentContains ? function(context, node) {
                return context.contains(node);
            } : nativeRootContains || nativeDocumentContains ? function(context, node) {
                return context === node || (context === document ? document.documentElement : context).contains(node);
            } : root && root.compareDocumentPosition ? function(context, node) {
                return context === node || !!(16 & context.compareDocumentPosition(node));
            } : function(context, node) {
                if (node) do if (node === context) return !0;
                while (node = node.parentNode)
                return !1;
            }, features.documentSorter = root.compareDocumentPosition ? function(a, b) {
                return a.compareDocumentPosition && b.compareDocumentPosition ? 4 & a.compareDocumentPosition(b) ? -1 : a === b ? 0 : 1 : 0;
            } : "sourceIndex" in root ? function(a, b) {
                return a.sourceIndex && b.sourceIndex ? a.sourceIndex - b.sourceIndex : 0;
            } : document.createRange ? function(a, b) {
                if (!a.ownerDocument || !b.ownerDocument) return 0;
                var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
                return aRange.setStart(a, 0), aRange.setEnd(a, 0), bRange.setStart(b, 0), bRange.setEnd(b, 0), aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
            } : null, root = null, features)this[feature] = features[feature];
        }
    }
};
