local.setDocument = function (document) {
    // convert elements / window arguments to document. if document cannot be extrapolated, the function returns.
    var nodeType = document.nodeType;
    if (nodeType == 9);
    else if (nodeType)
        // document
        document = document.ownerDocument; // node
    else if (document.navigator) document = document.document; // window
    else return;

    // check if it's the old document

    if (this.document === document) return;
    this.document = document;

    // check if we have done feature detection on this document before

    var root = document.documentElement,
        rootUid = this.getUIDXML(root),
        features = featuresCache[rootUid],
        feature;

    if (features) {
        for (feature in features) {
            this[feature] = features[feature];
        }
        return;
    }

    features = featuresCache[rootUid] = {};

    features.root = root;
    features.isXMLDocument = this.isXML(document);

    features.brokenStarGEBTN =
        features.starSelectsClosedQSA =
        features.idGetsName =
        features.brokenMixedCaseQSA =
        features.brokenGEBCN =
        features.brokenCheckedQSA =
        features.brokenEmptyAttributeQSA =
        features.isHTMLDocument =
        features.nativeMatchesSelector =
            false;

    var starSelectsClosed,
        starSelectsComments,
        brokenSecondClassNameGEBCN,
        cachedGetElementsByClassName,
        brokenFormAttributeGetter;

    var selected,
        id = "slick_uniqueid";
    var testNode = document.createElement("div");

    var testRoot =
        document.body || document.getElementsByTagName("body")[0] || root;
    testRoot.appendChild(testNode);

    // on non-HTML documents innerHTML and getElementsById doesnt work properly
    try {
        testNode.innerHTML = '<a id="' + id + '"></a>';
        features.isHTMLDocument = !!document.getElementById(id);
    } catch (e) {}

    if (features.isHTMLDocument) {
        testNode.style.display = "none";

        // IE returns comment nodes for getElementsByTagName('*') for some documents
        testNode.appendChild(document.createComment(""));
        starSelectsComments = testNode.getElementsByTagName("*").length > 1;

        // IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
        try {
            testNode.innerHTML = "foo</foo>";
            selected = testNode.getElementsByTagName("*");
            starSelectsClosed =
                selected &&
                !!selected.length &&
                selected[0].nodeName.charAt(0) == "/";
        } catch (e) {}

        features.brokenStarGEBTN = starSelectsComments || starSelectsClosed;

        // IE returns elements with the name instead of just id for getElementsById for some documents
        try {
            testNode.innerHTML =
                '<a name="' + id + '"></a><b id="' + id + '"></b>';
            features.idGetsName =
                document.getElementById(id) === testNode.firstChild;
        } catch (e) {}

        if (testNode.getElementsByClassName) {
            // Safari 3.2 getElementsByClassName caches results
            try {
                testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
                testNode.getElementsByClassName("b").length;
                testNode.firstChild.className = "b";
                cachedGetElementsByClassName =
                    testNode.getElementsByClassName("b").length != 2;
            } catch (e) {}

            // Opera 9.6 getElementsByClassName doesnt detects the class if its not the first one
            try {
                testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
                brokenSecondClassNameGEBCN =
                    testNode.getElementsByClassName("a").length != 2;
            } catch (e) {}

            features.brokenGEBCN =
                cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
        }

        if (testNode.querySelectorAll) {
            // IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
            try {
                testNode.innerHTML = "foo</foo>";
                selected = testNode.querySelectorAll("*");
                features.starSelectsClosedQSA =
                    selected &&
                    !!selected.length &&
                    selected[0].nodeName.charAt(0) == "/";
            } catch (e) {}

            // Safari 3.2 querySelectorAll doesnt work with mixedcase on quirksmode
            try {
                testNode.innerHTML = '<a class="MiX"></a>';
                features.brokenMixedCaseQSA =
                    !testNode.querySelectorAll(".MiX").length;
            } catch (e) {}

            // Webkit and Opera dont return selected options on querySelectorAll
            try {
                testNode.innerHTML =
                    '<select><option selected="selected">a</option></select>';
                features.brokenCheckedQSA =
                    testNode.querySelectorAll(":checked").length == 0;
            } catch (e) {}

            // IE returns incorrect results for attr[*^$]="" selectors on querySelectorAll
            try {
                testNode.innerHTML = '<a class=""></a>';
                features.brokenEmptyAttributeQSA =
                    testNode.querySelectorAll('[class*=""]').length != 0;
            } catch (e) {}
        }

        // IE6-7, if a form has an input of id x, form.getAttribute(x) returns a reference to the input
        try {
            testNode.innerHTML = '<form action="s"><input id="action"/></form>';
            brokenFormAttributeGetter =
                testNode.firstChild.getAttribute("action") != "s";
        } catch (e) {}

        // native matchesSelector function

        features.nativeMatchesSelector =
            root.matchesSelector ||
            /*root.msMatchesSelector ||*/ root.mozMatchesSelector ||
            root.webkitMatchesSelector;
        if (features.nativeMatchesSelector)
            try {
                // if matchesSelector trows errors on incorrect sintaxes we can use it
                features.nativeMatchesSelector.call(root, ":slick");
                features.nativeMatchesSelector = null;
            } catch (e) {}
    }

    try {
        root.slick_expando = 1;
        delete root.slick_expando;
        features.getUID = this.getUIDHTML;
    } catch (e) {
        features.getUID = this.getUIDXML;
    }

    testRoot.removeChild(testNode);
    testNode = selected = testRoot = null;

    // getAttribute

    features.getAttribute =
        features.isHTMLDocument && brokenFormAttributeGetter
            ? function (node, name) {
                  var method = this.attributeGetters[name];
                  if (method) return method.call(node);
                  var attributeNode = node.getAttributeNode(name);
                  return attributeNode ? attributeNode.nodeValue : null;
              }
            : function (node, name) {
                  var method = this.attributeGetters[name];
                  return method ? method.call(node) : node.getAttribute(name);
              };

    // hasAttribute

    features.hasAttribute =
        root && this.isNativeCode(root.hasAttribute)
            ? function (node, attribute) {
                  return node.hasAttribute(attribute);
              }
            : function (node, attribute) {
                  node = node.getAttributeNode(attribute);
                  return !!(node && (node.specified || node.nodeValue));
              };

    // contains
    // FIXME: Add specs: local.contains should be different for xml and html documents?
    var nativeRootContains = root && this.isNativeCode(root.contains),
        nativeDocumentContains =
            document && this.isNativeCode(document.contains);

    features.contains =
        nativeRootContains && nativeDocumentContains
            ? function (context, node) {
                  return context.contains(node);
              }
            : nativeRootContains && !nativeDocumentContains
            ? function (context, node) {
                  // IE8 does not have .contains on document.
                  return (
                      context === node ||
                      (context === document
                          ? document.documentElement
                          : context
                      ).contains(node)
                  );
              }
            : root && root.compareDocumentPosition
            ? function (context, node) {
                  return (
                      context === node ||
                      !!(context.compareDocumentPosition(node) & 16)
                  );
              }
            : function (context, node) {
                  if (node)
                      do {
                          if (node === context) return true;
                      } while ((node = node.parentNode));
                  return false;
              };

    // document order sorting
    // credits to Sizzle (http://sizzlejs.com/)

    features.documentSorter = root.compareDocumentPosition
        ? function (a, b) {
              if (!a.compareDocumentPosition || !b.compareDocumentPosition)
                  return 0;
              return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
          }
        : "sourceIndex" in root
        ? function (a, b) {
              if (!a.sourceIndex || !b.sourceIndex) return 0;
              return a.sourceIndex - b.sourceIndex;
          }
        : document.createRange
        ? function (a, b) {
              if (!a.ownerDocument || !b.ownerDocument) return 0;
              var aRange = a.ownerDocument.createRange(),
                  bRange = b.ownerDocument.createRange();
              aRange.setStart(a, 0);
              aRange.setEnd(a, 0);
              bRange.setStart(b, 0);
              bRange.setEnd(b, 0);
              return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
          }
        : null;

    root = null;

    for (feature in features) {
        this[feature] = features[feature];
    }
};
