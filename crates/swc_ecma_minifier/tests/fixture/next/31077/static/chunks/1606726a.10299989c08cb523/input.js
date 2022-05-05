"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [453],
    {
        /***/ 8780: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Decoration: function () {
                    return /* binding */ Decoration;
                },
                /* harmony export */ DecorationSet: function () {
                    return /* binding */ DecorationSet;
                },
                /* harmony export */ EditorView: function () {
                    return /* binding */ EditorView;
                },
                /* harmony export */ __endComposition: function () {
                    return /* binding */ endComposition;
                },
                /* harmony export */ __parseFromClipboard: function () {
                    return /* binding */ parseFromClipboard;
                },
                /* harmony export */ __serializeForClipboard: function () {
                    return /* binding */ serializeForClipboard;
                },
                /* harmony export */
            });
            /* harmony import */ var prosemirror_state__WEBPACK_IMPORTED_MODULE_0__ =
                __webpack_require__(6922);
            /* harmony import */ var prosemirror_model__WEBPACK_IMPORTED_MODULE_1__ =
                __webpack_require__(2230);
            /* harmony import */ var prosemirror_transform__WEBPACK_IMPORTED_MODULE_2__ =
                __webpack_require__(1081);

            var result = {};

            if (
                typeof navigator != "undefined" &&
                typeof document != "undefined"
            ) {
                var ie_edge = /Edge\/(\d+)/.exec(navigator.userAgent);
                var ie_upto10 = /MSIE \d/.test(navigator.userAgent);
                var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(
                    navigator.userAgent
                );

                var ie = (result.ie = !!(ie_upto10 || ie_11up || ie_edge));
                result.ie_version = ie_upto10
                    ? document.documentMode || 6
                    : ie_11up
                    ? +ie_11up[1]
                    : ie_edge
                    ? +ie_edge[1]
                    : null;
                result.gecko = !ie && /gecko\/(\d+)/i.test(navigator.userAgent);
                result.gecko_version =
                    result.gecko &&
                    +(/Firefox\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1];
                var chrome = !ie && /Chrome\/(\d+)/.exec(navigator.userAgent);
                result.chrome = !!chrome;
                result.chrome_version = chrome && +chrome[1];
                // Is true for both iOS and iPadOS for convenience
                result.safari = !ie && /Apple Computer/.test(navigator.vendor);
                result.ios =
                    result.safari &&
                    (/Mobile\/\w+/.test(navigator.userAgent) ||
                        navigator.maxTouchPoints > 2);
                result.mac = result.ios || /Mac/.test(navigator.platform);
                result.android = /Android \d/.test(navigator.userAgent);
                result.webkit =
                    "webkitFontSmoothing" in document.documentElement.style;
                result.webkit_version =
                    result.webkit &&
                    +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [
                        0, 0,
                    ])[1];
            }

            var domIndex = function (node) {
                for (var index = 0; ; index++) {
                    node = node.previousSibling;
                    if (!node) {
                        return index;
                    }
                }
            };

            var parentNode = function (node) {
                var parent = node.assignedSlot || node.parentNode;
                return parent && parent.nodeType == 11 ? parent.host : parent;
            };

            var reusedRange = null;

            // Note that this will always return the same range, because DOM range
            // objects are every expensive, and keep slowing down subsequent DOM
            // updates, for some reason.
            var textRange = function (node, from, to) {
                var range =
                    reusedRange || (reusedRange = document.createRange());
                range.setEnd(node, to == null ? node.nodeValue.length : to);
                range.setStart(node, from || 0);
                return range;
            };

            // Scans forward and backward through DOM positions equivalent to the
            // given one to see if the two are in the same place (i.e. after a
            // text node vs at the end of that text node)
            var isEquivalentPosition = function (
                node,
                off,
                targetNode,
                targetOff
            ) {
                return (
                    targetNode &&
                    (scanFor(node, off, targetNode, targetOff, -1) ||
                        scanFor(node, off, targetNode, targetOff, 1))
                );
            };

            var atomElements = /^(img|br|input|textarea|hr)$/i;

            function scanFor(node, off, targetNode, targetOff, dir) {
                for (;;) {
                    if (node == targetNode && off == targetOff) {
                        return true;
                    }
                    if (off == (dir < 0 ? 0 : nodeSize(node))) {
                        var parent = node.parentNode;
                        if (
                            parent.nodeType != 1 ||
                            hasBlockDesc(node) ||
                            atomElements.test(node.nodeName) ||
                            node.contentEditable == "false"
                        ) {
                            return false;
                        }
                        off = domIndex(node) + (dir < 0 ? 0 : 1);
                        node = parent;
                    } else if (node.nodeType == 1) {
                        node = node.childNodes[off + (dir < 0 ? -1 : 0)];
                        if (node.contentEditable == "false") {
                            return false;
                        }
                        off = dir < 0 ? nodeSize(node) : 0;
                    } else {
                        return false;
                    }
                }
            }

            function nodeSize(node) {
                return node.nodeType == 3
                    ? node.nodeValue.length
                    : node.childNodes.length;
            }

            function isOnEdge(node, offset, parent) {
                for (
                    var atStart = offset == 0, atEnd = offset == nodeSize(node);
                    atStart || atEnd;

                ) {
                    if (node == parent) {
                        return true;
                    }
                    var index = domIndex(node);
                    node = node.parentNode;
                    if (!node) {
                        return false;
                    }
                    atStart = atStart && index == 0;
                    atEnd = atEnd && index == nodeSize(node);
                }
            }

            function hasBlockDesc(dom) {
                var desc;
                for (var cur = dom; cur; cur = cur.parentNode) {
                    if ((desc = cur.pmViewDesc)) {
                        break;
                    }
                }
                return (
                    desc &&
                    desc.node &&
                    desc.node.isBlock &&
                    (desc.dom == dom || desc.contentDOM == dom)
                );
            }

            // Work around Chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=447523
            // (isCollapsed inappropriately returns true in shadow dom)
            var selectionCollapsed = function (domSel) {
                var collapsed = domSel.isCollapsed;
                if (
                    collapsed &&
                    result.chrome &&
                    domSel.rangeCount &&
                    !domSel.getRangeAt(0).collapsed
                ) {
                    collapsed = false;
                }
                return collapsed;
            };

            function keyEvent(keyCode, key) {
                var event = document.createEvent("Event");
                event.initEvent("keydown", true, true);
                event.keyCode = keyCode;
                event.key = event.code = key;
                return event;
            }

            function windowRect(doc) {
                return {
                    left: 0,
                    right: doc.documentElement.clientWidth,
                    top: 0,
                    bottom: doc.documentElement.clientHeight,
                };
            }

            function getSide(value, side) {
                return typeof value == "number" ? value : value[side];
            }

            function clientRect(node) {
                var rect = node.getBoundingClientRect();
                // Adjust for elements with style "transform: scale()"
                var scaleX = rect.width / node.offsetWidth || 1;
                var scaleY = rect.height / node.offsetHeight || 1;
                // Make sure scrollbar width isn't included in the rectangle
                return {
                    left: rect.left,
                    right: rect.left + node.clientWidth * scaleX,
                    top: rect.top,
                    bottom: rect.top + node.clientHeight * scaleY,
                };
            }

            function scrollRectIntoView(view, rect, startDOM) {
                var scrollThreshold = view.someProp("scrollThreshold") || 0,
                    scrollMargin = view.someProp("scrollMargin") || 5;
                var doc = view.dom.ownerDocument;
                for (
                    var parent = startDOM || view.dom;
                    ;
                    parent = parentNode(parent)
                ) {
                    if (!parent) {
                        break;
                    }
                    if (parent.nodeType != 1) {
                        continue;
                    }
                    var atTop = parent == doc.body || parent.nodeType != 1;
                    var bounding = atTop ? windowRect(doc) : clientRect(parent);
                    var moveX = 0,
                        moveY = 0;
                    if (
                        rect.top <
                        bounding.top + getSide(scrollThreshold, "top")
                    ) {
                        moveY = -(
                            bounding.top -
                            rect.top +
                            getSide(scrollMargin, "top")
                        );
                    } else if (
                        rect.bottom >
                        bounding.bottom - getSide(scrollThreshold, "bottom")
                    ) {
                        moveY =
                            rect.bottom -
                            bounding.bottom +
                            getSide(scrollMargin, "bottom");
                    }
                    if (
                        rect.left <
                        bounding.left + getSide(scrollThreshold, "left")
                    ) {
                        moveX = -(
                            bounding.left -
                            rect.left +
                            getSide(scrollMargin, "left")
                        );
                    } else if (
                        rect.right >
                        bounding.right - getSide(scrollThreshold, "right")
                    ) {
                        moveX =
                            rect.right -
                            bounding.right +
                            getSide(scrollMargin, "right");
                    }
                    if (moveX || moveY) {
                        if (atTop) {
                            doc.defaultView.scrollBy(moveX, moveY);
                        } else {
                            var startX = parent.scrollLeft,
                                startY = parent.scrollTop;
                            if (moveY) {
                                parent.scrollTop += moveY;
                            }
                            if (moveX) {
                                parent.scrollLeft += moveX;
                            }
                            var dX = parent.scrollLeft - startX,
                                dY = parent.scrollTop - startY;
                            rect = {
                                left: rect.left - dX,
                                top: rect.top - dY,
                                right: rect.right - dX,
                                bottom: rect.bottom - dY,
                            };
                        }
                    }
                    if (atTop) {
                        break;
                    }
                }
            }

            // Store the scroll position of the editor's parent nodes, along with
            // the top position of an element near the top of the editor, which
            // will be used to make sure the visible viewport remains stable even
            // when the size of the content above changes.
            function storeScrollPos(view) {
                var rect = view.dom.getBoundingClientRect(),
                    startY = Math.max(0, rect.top);
                var refDOM, refTop;
                for (
                    var x = (rect.left + rect.right) / 2, y = startY + 1;
                    y < Math.min(innerHeight, rect.bottom);
                    y += 5
                ) {
                    var dom = view.root.elementFromPoint(x, y);
                    if (dom == view.dom || !view.dom.contains(dom)) {
                        continue;
                    }
                    var localRect = dom.getBoundingClientRect();
                    if (localRect.top >= startY - 20) {
                        refDOM = dom;
                        refTop = localRect.top;
                        break;
                    }
                }
                return {
                    refDOM: refDOM,
                    refTop: refTop,
                    stack: scrollStack(view.dom),
                };
            }

            function scrollStack(dom) {
                var stack = [],
                    doc = dom.ownerDocument;
                for (; dom; dom = parentNode(dom)) {
                    stack.push({
                        dom: dom,
                        top: dom.scrollTop,
                        left: dom.scrollLeft,
                    });
                    if (dom == doc) {
                        break;
                    }
                }
                return stack;
            }

            // Reset the scroll position of the editor's parent nodes to that what
            // it was before, when storeScrollPos was called.
            function resetScrollPos(ref) {
                var refDOM = ref.refDOM;
                var refTop = ref.refTop;
                var stack = ref.stack;

                var newRefTop = refDOM ? refDOM.getBoundingClientRect().top : 0;
                restoreScrollStack(
                    stack,
                    newRefTop == 0 ? 0 : newRefTop - refTop
                );
            }

            function restoreScrollStack(stack, dTop) {
                for (var i = 0; i < stack.length; i++) {
                    var ref = stack[i];
                    var dom = ref.dom;
                    var top = ref.top;
                    var left = ref.left;
                    if (dom.scrollTop != top + dTop) {
                        dom.scrollTop = top + dTop;
                    }
                    if (dom.scrollLeft != left) {
                        dom.scrollLeft = left;
                    }
                }
            }

            var preventScrollSupported = null;
            // Feature-detects support for .focus({preventScroll: true}), and uses
            // a fallback kludge when not supported.
            function focusPreventScroll(dom) {
                if (dom.setActive) {
                    return dom.setActive();
                } // in IE
                if (preventScrollSupported) {
                    return dom.focus(preventScrollSupported);
                }

                var stored = scrollStack(dom);
                dom.focus(
                    preventScrollSupported == null
                        ? {
                              get preventScroll() {
                                  preventScrollSupported = {
                                      preventScroll: true,
                                  };
                                  return true;
                              },
                          }
                        : undefined
                );
                if (!preventScrollSupported) {
                    preventScrollSupported = false;
                    restoreScrollStack(stored, 0);
                }
            }

            function findOffsetInNode(node, coords) {
                var closest,
                    dxClosest = 2e8,
                    coordsClosest,
                    offset = 0;
                var rowBot = coords.top,
                    rowTop = coords.top;
                for (
                    var child = node.firstChild, childIndex = 0;
                    child;
                    child = child.nextSibling, childIndex++
                ) {
                    var rects = void 0;
                    if (child.nodeType == 1) {
                        rects = child.getClientRects();
                    } else if (child.nodeType == 3) {
                        rects = textRange(child).getClientRects();
                    } else {
                        continue;
                    }

                    for (var i = 0; i < rects.length; i++) {
                        var rect = rects[i];
                        if (rect.top <= rowBot && rect.bottom >= rowTop) {
                            rowBot = Math.max(rect.bottom, rowBot);
                            rowTop = Math.min(rect.top, rowTop);
                            var dx =
                                rect.left > coords.left
                                    ? rect.left - coords.left
                                    : rect.right < coords.left
                                    ? coords.left - rect.right
                                    : 0;
                            if (dx < dxClosest) {
                                closest = child;
                                dxClosest = dx;
                                coordsClosest =
                                    dx && closest.nodeType == 3
                                        ? {
                                              left:
                                                  rect.right < coords.left
                                                      ? rect.right
                                                      : rect.left,
                                              top: coords.top,
                                          }
                                        : coords;
                                if (child.nodeType == 1 && dx) {
                                    offset =
                                        childIndex +
                                        (coords.left >=
                                        (rect.left + rect.right) / 2
                                            ? 1
                                            : 0);
                                }
                                continue;
                            }
                        }
                        if (
                            !closest &&
                            ((coords.left >= rect.right &&
                                coords.top >= rect.top) ||
                                (coords.left >= rect.left &&
                                    coords.top >= rect.bottom))
                        ) {
                            offset = childIndex + 1;
                        }
                    }
                }
                if (closest && closest.nodeType == 3) {
                    return findOffsetInText(closest, coordsClosest);
                }
                if (!closest || (dxClosest && closest.nodeType == 1)) {
                    return { node: node, offset: offset };
                }
                return findOffsetInNode(closest, coordsClosest);
            }

            function findOffsetInText(node, coords) {
                var len = node.nodeValue.length;
                var range = document.createRange();
                for (var i = 0; i < len; i++) {
                    range.setEnd(node, i + 1);
                    range.setStart(node, i);
                    var rect = singleRect(range, 1);
                    if (rect.top == rect.bottom) {
                        continue;
                    }
                    if (inRect(coords, rect)) {
                        return {
                            node: node,
                            offset:
                                i +
                                (coords.left >= (rect.left + rect.right) / 2
                                    ? 1
                                    : 0),
                        };
                    }
                }
                return { node: node, offset: 0 };
            }

            function inRect(coords, rect) {
                return (
                    coords.left >= rect.left - 1 &&
                    coords.left <= rect.right + 1 &&
                    coords.top >= rect.top - 1 &&
                    coords.top <= rect.bottom + 1
                );
            }

            function targetKludge(dom, coords) {
                var parent = dom.parentNode;
                if (
                    parent &&
                    /^li$/i.test(parent.nodeName) &&
                    coords.left < dom.getBoundingClientRect().left
                ) {
                    return parent;
                }
                return dom;
            }

            function posFromElement(view, elt, coords) {
                var ref = findOffsetInNode(elt, coords);
                var node = ref.node;
                var offset = ref.offset;
                var bias = -1;
                if (node.nodeType == 1 && !node.firstChild) {
                    var rect = node.getBoundingClientRect();
                    bias =
                        rect.left != rect.right &&
                        coords.left > (rect.left + rect.right) / 2
                            ? 1
                            : -1;
                }
                return view.docView.posFromDOM(node, offset, bias);
            }

            function posFromCaret(view, node, offset, coords) {
                // Browser (in caretPosition/RangeFromPoint) will agressively
                // normalize towards nearby inline nodes. Since we are interested in
                // positions between block nodes too, we first walk up the hierarchy
                // of nodes to see if there are block nodes that the coordinates
                // fall outside of. If so, we take the position before/after that
                // block. If not, we call `posFromDOM` on the raw node/offset.
                var outside = -1;
                for (var cur = node; ; ) {
                    if (cur == view.dom) {
                        break;
                    }
                    var desc = view.docView.nearestDesc(cur, true);
                    if (!desc) {
                        return null;
                    }
                    if (desc.node.isBlock && desc.parent) {
                        var rect = desc.dom.getBoundingClientRect();
                        if (rect.left > coords.left || rect.top > coords.top) {
                            outside = desc.posBefore;
                        } else if (
                            rect.right < coords.left ||
                            rect.bottom < coords.top
                        ) {
                            outside = desc.posAfter;
                        } else {
                            break;
                        }
                    }
                    cur = desc.dom.parentNode;
                }
                return outside > -1
                    ? outside
                    : view.docView.posFromDOM(node, offset);
            }

            function elementFromPoint(element, coords, box) {
                var len = element.childNodes.length;
                if (len && box.top < box.bottom) {
                    for (
                        var startI = Math.max(
                                0,
                                Math.min(
                                    len - 1,
                                    Math.floor(
                                        (len * (coords.top - box.top)) /
                                            (box.bottom - box.top)
                                    ) - 2
                                )
                            ),
                            i = startI;
                        ;

                    ) {
                        var child = element.childNodes[i];
                        if (child.nodeType == 1) {
                            var rects = child.getClientRects();
                            for (var j = 0; j < rects.length; j++) {
                                var rect = rects[j];
                                if (inRect(coords, rect)) {
                                    return elementFromPoint(
                                        child,
                                        coords,
                                        rect
                                    );
                                }
                            }
                        }
                        if ((i = (i + 1) % len) == startI) {
                            break;
                        }
                    }
                }
                return element;
            }

            // Given an x,y position on the editor, get the position in the document.
            function posAtCoords(view, coords) {
                var assign, assign$1;

                var doc = view.dom.ownerDocument,
                    node,
                    offset;
                if (doc.caretPositionFromPoint) {
                    try {
                        // Firefox throws for this call in hard-to-predict circumstances (#994)
                        var pos$1 = doc.caretPositionFromPoint(
                            coords.left,
                            coords.top
                        );
                        if (pos$1) {
                            (assign = pos$1),
                                (node = assign.offsetNode),
                                (offset = assign.offset);
                        }
                    } catch (_) {}
                }
                if (!node && doc.caretRangeFromPoint) {
                    var range = doc.caretRangeFromPoint(
                        coords.left,
                        coords.top
                    );
                    if (range) {
                        (assign$1 = range),
                            (node = assign$1.startContainer),
                            (offset = assign$1.startOffset);
                    }
                }

                var elt = (
                        view.root.elementFromPoint ? view.root : doc
                    ).elementFromPoint(coords.left, coords.top + 1),
                    pos;
                if (
                    !elt ||
                    !view.dom.contains(elt.nodeType != 1 ? elt.parentNode : elt)
                ) {
                    var box = view.dom.getBoundingClientRect();
                    if (!inRect(coords, box)) {
                        return null;
                    }
                    elt = elementFromPoint(view.dom, coords, box);
                    if (!elt) {
                        return null;
                    }
                }
                // Safari's caretRangeFromPoint returns nonsense when on a draggable element
                if (result.safari) {
                    for (var p = elt; node && p; p = parentNode(p)) {
                        if (p.draggable) {
                            node = offset = null;
                        }
                    }
                }
                elt = targetKludge(elt, coords);
                if (node) {
                    if (result.gecko && node.nodeType == 1) {
                        // Firefox will sometimes return offsets into <input> nodes, which
                        // have no actual children, from caretPositionFromPoint (#953)
                        offset = Math.min(offset, node.childNodes.length);
                        // It'll also move the returned position before image nodes,
                        // even if those are behind it.
                        if (offset < node.childNodes.length) {
                            var next = node.childNodes[offset],
                                box$1;
                            if (
                                next.nodeName == "IMG" &&
                                (box$1 = next.getBoundingClientRect()).right <=
                                    coords.left &&
                                box$1.bottom > coords.top
                            ) {
                                offset++;
                            }
                        }
                    }
                    // Suspiciously specific kludge to work around caret*FromPoint
                    // never returning a position at the end of the document
                    if (
                        node == view.dom &&
                        offset == node.childNodes.length - 1 &&
                        node.lastChild.nodeType == 1 &&
                        coords.top >
                            node.lastChild.getBoundingClientRect().bottom
                    ) {
                        pos = view.state.doc.content.size;
                    }
                    // Ignore positions directly after a BR, since caret*FromPoint
                    // 'round up' positions that would be more accurately placed
                    // before the BR node.
                    else if (
                        offset == 0 ||
                        node.nodeType != 1 ||
                        node.childNodes[offset - 1].nodeName != "BR"
                    ) {
                        pos = posFromCaret(view, node, offset, coords);
                    }
                }
                if (pos == null) {
                    pos = posFromElement(view, elt, coords);
                }

                var desc = view.docView.nearestDesc(elt, true);
                return {
                    pos: pos,
                    inside: desc ? desc.posAtStart - desc.border : -1,
                };
            }

            function singleRect(object, bias) {
                var rects = object.getClientRects();
                return !rects.length
                    ? object.getBoundingClientRect()
                    : rects[bias < 0 ? 0 : rects.length - 1];
            }

            var BIDI = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;

            // : (EditorView, number, number) → {left: number, top: number, right: number, bottom: number}
            // Given a position in the document model, get a bounding box of the
            // character at that position, relative to the window.
            function coordsAtPos(view, pos, side) {
                var ref = view.docView.domFromPos(pos, side < 0 ? -1 : 1);
                var node = ref.node;
                var offset = ref.offset;

                var supportEmptyRange = result.webkit || result.gecko;
                if (node.nodeType == 3) {
                    // These browsers support querying empty text ranges. Prefer that in
                    // bidi context or when at the end of a node.
                    if (
                        supportEmptyRange &&
                        (BIDI.test(node.nodeValue) ||
                            (side < 0
                                ? !offset
                                : offset == node.nodeValue.length))
                    ) {
                        var rect = singleRect(
                            textRange(node, offset, offset),
                            side
                        );
                        // Firefox returns bad results (the position before the space)
                        // when querying a position directly after line-broken
                        // whitespace. Detect this situation and and kludge around it
                        if (
                            result.gecko &&
                            offset &&
                            /\s/.test(node.nodeValue[offset - 1]) &&
                            offset < node.nodeValue.length
                        ) {
                            var rectBefore = singleRect(
                                textRange(node, offset - 1, offset - 1),
                                -1
                            );
                            if (rectBefore.top == rect.top) {
                                var rectAfter = singleRect(
                                    textRange(node, offset, offset + 1),
                                    -1
                                );
                                if (rectAfter.top != rect.top) {
                                    return flattenV(
                                        rectAfter,
                                        rectAfter.left < rectBefore.left
                                    );
                                }
                            }
                        }
                        return rect;
                    } else {
                        var from = offset,
                            to = offset,
                            takeSide = side < 0 ? 1 : -1;
                        if (side < 0 && !offset) {
                            to++;
                            takeSide = -1;
                        } else if (
                            side >= 0 &&
                            offset == node.nodeValue.length
                        ) {
                            from--;
                            takeSide = 1;
                        } else if (side < 0) {
                            from--;
                        } else {
                            to++;
                        }
                        return flattenV(
                            singleRect(textRange(node, from, to), takeSide),
                            takeSide < 0
                        );
                    }
                }

                // Return a horizontal line in block context
                if (!view.state.doc.resolve(pos).parent.inlineContent) {
                    if (offset && (side < 0 || offset == nodeSize(node))) {
                        var before = node.childNodes[offset - 1];
                        if (before.nodeType == 1) {
                            return flattenH(
                                before.getBoundingClientRect(),
                                false
                            );
                        }
                    }
                    if (offset < nodeSize(node)) {
                        var after = node.childNodes[offset];
                        if (after.nodeType == 1) {
                            return flattenH(
                                after.getBoundingClientRect(),
                                true
                            );
                        }
                    }
                    return flattenH(node.getBoundingClientRect(), side >= 0);
                }

                // Inline, not in text node (this is not Bidi-safe)
                if (offset && (side < 0 || offset == nodeSize(node))) {
                    var before$1 = node.childNodes[offset - 1];
                    var target =
                        before$1.nodeType == 3
                            ? textRange(
                                  before$1,
                                  nodeSize(before$1) -
                                      (supportEmptyRange ? 0 : 1)
                              )
                            : // BR nodes tend to only return the rectangle before them.
                            // Only use them if they are the last element in their parent
                            before$1.nodeType == 1 &&
                              (before$1.nodeName != "BR" ||
                                  !before$1.nextSibling)
                            ? before$1
                            : null;
                    if (target) {
                        return flattenV(singleRect(target, 1), false);
                    }
                }
                if (offset < nodeSize(node)) {
                    var after$1 = node.childNodes[offset];
                    while (
                        after$1.pmViewDesc &&
                        after$1.pmViewDesc.ignoreForCoords
                    ) {
                        after$1 = after$1.nextSibling;
                    }
                    var target$1 = !after$1
                        ? null
                        : after$1.nodeType == 3
                        ? textRange(after$1, 0, supportEmptyRange ? 0 : 1)
                        : after$1.nodeType == 1
                        ? after$1
                        : null;
                    if (target$1) {
                        return flattenV(singleRect(target$1, -1), true);
                    }
                }
                // All else failed, just try to get a rectangle for the target node
                return flattenV(
                    singleRect(
                        node.nodeType == 3 ? textRange(node) : node,
                        -side
                    ),
                    side >= 0
                );
            }

            function flattenV(rect, left) {
                if (rect.width == 0) {
                    return rect;
                }
                var x = left ? rect.left : rect.right;
                return {
                    top: rect.top,
                    bottom: rect.bottom,
                    left: x,
                    right: x,
                };
            }

            function flattenH(rect, top) {
                if (rect.height == 0) {
                    return rect;
                }
                var y = top ? rect.top : rect.bottom;
                return {
                    top: y,
                    bottom: y,
                    left: rect.left,
                    right: rect.right,
                };
            }

            function withFlushedState(view, state, f) {
                var viewState = view.state,
                    active = view.root.activeElement;
                if (viewState != state) {
                    view.updateState(state);
                }
                if (active != view.dom) {
                    view.focus();
                }
                try {
                    return f();
                } finally {
                    if (viewState != state) {
                        view.updateState(viewState);
                    }
                    if (active != view.dom && active) {
                        active.focus();
                    }
                }
            }

            // : (EditorView, number, number)
            // Whether vertical position motion in a given direction
            // from a position would leave a text block.
            function endOfTextblockVertical(view, state, dir) {
                var sel = state.selection;
                var $pos = dir == "up" ? sel.$from : sel.$to;
                return withFlushedState(view, state, function () {
                    var ref = view.docView.domFromPos(
                        $pos.pos,
                        dir == "up" ? -1 : 1
                    );
                    var dom = ref.node;
                    for (;;) {
                        var nearest = view.docView.nearestDesc(dom, true);
                        if (!nearest) {
                            break;
                        }
                        if (nearest.node.isBlock) {
                            dom = nearest.dom;
                            break;
                        }
                        dom = nearest.dom.parentNode;
                    }
                    var coords = coordsAtPos(view, $pos.pos, 1);
                    for (
                        var child = dom.firstChild;
                        child;
                        child = child.nextSibling
                    ) {
                        var boxes = void 0;
                        if (child.nodeType == 1) {
                            boxes = child.getClientRects();
                        } else if (child.nodeType == 3) {
                            boxes = textRange(
                                child,
                                0,
                                child.nodeValue.length
                            ).getClientRects();
                        } else {
                            continue;
                        }
                        for (var i = 0; i < boxes.length; i++) {
                            var box = boxes[i];
                            if (
                                box.bottom > box.top + 1 &&
                                (dir == "up"
                                    ? coords.top - box.top >
                                      (box.bottom - coords.top) * 2
                                    : box.bottom - coords.bottom >
                                      (coords.bottom - box.top) * 2)
                            ) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }

            var maybeRTL = /[\u0590-\u08ac]/;

            function endOfTextblockHorizontal(view, state, dir) {
                var ref = state.selection;
                var $head = ref.$head;
                if (!$head.parent.isTextblock) {
                    return false;
                }
                var offset = $head.parentOffset,
                    atStart = !offset,
                    atEnd = offset == $head.parent.content.size;
                var sel = view.root.getSelection();
                // If the textblock is all LTR, or the browser doesn't support
                // Selection.modify (Edge), fall back to a primitive approach
                if (!maybeRTL.test($head.parent.textContent) || !sel.modify) {
                    return dir == "left" || dir == "backward" ? atStart : atEnd;
                }

                return withFlushedState(view, state, function () {
                    // This is a huge hack, but appears to be the best we can
                    // currently do: use `Selection.modify` to move the selection by
                    // one character, and see if that moves the cursor out of the
                    // textblock (or doesn't move it at all, when at the start/end of
                    // the document).
                    var oldRange = sel.getRangeAt(0),
                        oldNode = sel.focusNode,
                        oldOff = sel.focusOffset;
                    var oldBidiLevel = sel.caretBidiLevel; // Only for Firefox
                    sel.modify("move", dir, "character");
                    var parentDOM = $head.depth
                        ? view.docView.domAfterPos($head.before())
                        : view.dom;
                    var result =
                        !parentDOM.contains(
                            sel.focusNode.nodeType == 1
                                ? sel.focusNode
                                : sel.focusNode.parentNode
                        ) ||
                        (oldNode == sel.focusNode && oldOff == sel.focusOffset);
                    // Restore the previous selection
                    sel.removeAllRanges();
                    sel.addRange(oldRange);
                    if (oldBidiLevel != null) {
                        sel.caretBidiLevel = oldBidiLevel;
                    }
                    return result;
                });
            }

            var cachedState = null,
                cachedDir = null,
                cachedResult = false;
            function endOfTextblock(view, state, dir) {
                if (cachedState == state && cachedDir == dir) {
                    return cachedResult;
                }
                cachedState = state;
                cachedDir = dir;
                return (cachedResult =
                    dir == "up" || dir == "down"
                        ? endOfTextblockVertical(view, state, dir)
                        : endOfTextblockHorizontal(view, state, dir));
            }

            // NodeView:: interface
            //
            // By default, document nodes are rendered using the result of the
            // [`toDOM`](#model.NodeSpec.toDOM) method of their spec, and managed
            // entirely by the editor. For some use cases, such as embedded
            // node-specific editing interfaces, you want more control over
            // the behavior of a node's in-editor representation, and need to
            // [define](#view.EditorProps.nodeViews) a custom node view.
            //
            // Mark views only support `dom` and `contentDOM`, and don't support
            // any of the node view methods.
            //
            // Objects returned as node views must conform to this interface.
            //
            //   dom:: ?dom.Node
            //   The outer DOM node that represents the document node. When not
            //   given, the default strategy is used to create a DOM node.
            //
            //   contentDOM:: ?dom.Node
            //   The DOM node that should hold the node's content. Only meaningful
            //   if the node view also defines a `dom` property and if its node
            //   type is not a leaf node type. When this is present, ProseMirror
            //   will take care of rendering the node's children into it. When it
            //   is not present, the node view itself is responsible for rendering
            //   (or deciding not to render) its child nodes.
            //
            //   update:: ?(node: Node, decorations: [Decoration], innerDecorations: DecorationSource) → bool
            //   When given, this will be called when the view is updating itself.
            //   It will be given a node (possibly of a different type), an array
            //   of active decorations around the node (which are automatically
            //   drawn, and the node view may ignore if it isn't interested in
            //   them), and a [decoration source](#view.DecorationSource) that
            //   represents any decorations that apply to the content of the node
            //   (which again may be ignored). It should return true if it was
            //   able to update to that node, and false otherwise. If the node
            //   view has a `contentDOM` property (or no `dom` property), updating
            //   its child nodes will be handled by ProseMirror.
            //
            //   selectNode:: ?()
            //   Can be used to override the way the node's selected status (as a
            //   node selection) is displayed.
            //
            //   deselectNode:: ?()
            //   When defining a `selectNode` method, you should also provide a
            //   `deselectNode` method to remove the effect again.
            //
            //   setSelection:: ?(anchor: number, head: number, root: dom.Document)
            //   This will be called to handle setting the selection inside the
            //   node. The `anchor` and `head` positions are relative to the start
            //   of the node. By default, a DOM selection will be created between
            //   the DOM positions corresponding to those positions, but if you
            //   override it you can do something else.
            //
            //   stopEvent:: ?(event: dom.Event) → bool
            //   Can be used to prevent the editor view from trying to handle some
            //   or all DOM events that bubble up from the node view. Events for
            //   which this returns true are not handled by the editor.
            //
            //   ignoreMutation:: ?(dom.MutationRecord) → bool
            //   Called when a DOM
            //   [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
            //   or a selection change happens within the view. When the change is
            //   a selection change, the record will have a `type` property of
            //   `"selection"` (which doesn't occur for native mutation records).
            //   Return false if the editor should re-read the selection or
            //   re-parse the range around the mutation, true if it can safely be
            //   ignored.
            //
            //   destroy:: ?()
            //   Called when the node view is removed from the editor or the whole
            //   editor is destroyed. (Not available for marks.)

            // View descriptions are data structures that describe the DOM that is
            // used to represent the editor's content. They are used for:
            //
            // - Incremental redrawing when the document changes
            //
            // - Figuring out what part of the document a given DOM position
            //   corresponds to
            //
            // - Wiring in custom implementations of the editing interface for a
            //   given node
            //
            // They form a doubly-linked mutable tree, starting at `view.docView`.

            var NOT_DIRTY = 0,
                CHILD_DIRTY = 1,
                CONTENT_DIRTY = 2,
                NODE_DIRTY = 3;

            // Superclass for the various kinds of descriptions. Defines their
            // basic structure and shared methods.
            var ViewDesc = function ViewDesc(
                parent,
                children,
                dom,
                contentDOM
            ) {
                this.parent = parent;
                this.children = children;
                this.dom = dom;
                // An expando property on the DOM node provides a link back to its
                // description.
                dom.pmViewDesc = this;
                // This is the node that holds the child views. It may be null for
                // descs that don't have children.
                this.contentDOM = contentDOM;
                this.dirty = NOT_DIRTY;
            };

            var prototypeAccessors = {
                size: { configurable: true },
                border: { configurable: true },
                posBefore: { configurable: true },
                posAtStart: { configurable: true },
                posAfter: { configurable: true },
                posAtEnd: { configurable: true },
                contentLost: { configurable: true },
                domAtom: { configurable: true },
                ignoreForCoords: { configurable: true },
            };

            // Used to check whether a given description corresponds to a
            // widget/mark/node.
            ViewDesc.prototype.matchesWidget = function matchesWidget() {
                return false;
            };
            ViewDesc.prototype.matchesMark = function matchesMark() {
                return false;
            };
            ViewDesc.prototype.matchesNode = function matchesNode() {
                return false;
            };
            ViewDesc.prototype.matchesHack = function matchesHack(_nodeName) {
                return false;
            };

            // : () → ?ParseRule
            // When parsing in-editor content (in domchange.js), we allow
            // descriptions to determine the parse rules that should be used to
            // parse them.
            ViewDesc.prototype.parseRule = function parseRule() {
                return null;
            };

            // : (dom.Event) → bool
            // Used by the editor's event handler to ignore events that come
            // from certain descs.
            ViewDesc.prototype.stopEvent = function stopEvent() {
                return false;
            };

            // The size of the content represented by this desc.
            prototypeAccessors.size.get = function () {
                var size = 0;
                for (var i = 0; i < this.children.length; i++) {
                    size += this.children[i].size;
                }
                return size;
            };

            // For block nodes, this represents the space taken up by their
            // start/end tokens.
            prototypeAccessors.border.get = function () {
                return 0;
            };

            ViewDesc.prototype.destroy = function destroy() {
                this.parent = null;
                if (this.dom.pmViewDesc == this) {
                    this.dom.pmViewDesc = null;
                }
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].destroy();
                }
            };

            ViewDesc.prototype.posBeforeChild = function posBeforeChild(child) {
                for (
                    var i = 0, pos = this.posAtStart;
                    i < this.children.length;
                    i++
                ) {
                    var cur = this.children[i];
                    if (cur == child) {
                        return pos;
                    }
                    pos += cur.size;
                }
            };

            prototypeAccessors.posBefore.get = function () {
                return this.parent.posBeforeChild(this);
            };

            prototypeAccessors.posAtStart.get = function () {
                return this.parent
                    ? this.parent.posBeforeChild(this) + this.border
                    : 0;
            };

            prototypeAccessors.posAfter.get = function () {
                return this.posBefore + this.size;
            };

            prototypeAccessors.posAtEnd.get = function () {
                return this.posAtStart + this.size - 2 * this.border;
            };

            // : (dom.Node, number, ?number) → number
            ViewDesc.prototype.localPosFromDOM = function localPosFromDOM(
                dom,
                offset,
                bias
            ) {
                // If the DOM position is in the content, use the child desc after
                // it to figure out a position.
                if (
                    this.contentDOM &&
                    this.contentDOM.contains(
                        dom.nodeType == 1 ? dom : dom.parentNode
                    )
                ) {
                    if (bias < 0) {
                        var domBefore, desc;
                        if (dom == this.contentDOM) {
                            domBefore = dom.childNodes[offset - 1];
                        } else {
                            while (dom.parentNode != this.contentDOM) {
                                dom = dom.parentNode;
                            }
                            domBefore = dom.previousSibling;
                        }
                        while (
                            domBefore &&
                            !(
                                (desc = domBefore.pmViewDesc) &&
                                desc.parent == this
                            )
                        ) {
                            domBefore = domBefore.previousSibling;
                        }
                        return domBefore
                            ? this.posBeforeChild(desc) + desc.size
                            : this.posAtStart;
                    } else {
                        var domAfter, desc$1;
                        if (dom == this.contentDOM) {
                            domAfter = dom.childNodes[offset];
                        } else {
                            while (dom.parentNode != this.contentDOM) {
                                dom = dom.parentNode;
                            }
                            domAfter = dom.nextSibling;
                        }
                        while (
                            domAfter &&
                            !(
                                (desc$1 = domAfter.pmViewDesc) &&
                                desc$1.parent == this
                            )
                        ) {
                            domAfter = domAfter.nextSibling;
                        }
                        return domAfter
                            ? this.posBeforeChild(desc$1)
                            : this.posAtEnd;
                    }
                }
                // Otherwise, use various heuristics, falling back on the bias
                // parameter, to determine whether to return the position at the
                // start or at the end of this view desc.
                var atEnd;
                if (dom == this.dom && this.contentDOM) {
                    atEnd = offset > domIndex(this.contentDOM);
                } else if (
                    this.contentDOM &&
                    this.contentDOM != this.dom &&
                    this.dom.contains(this.contentDOM)
                ) {
                    atEnd = dom.compareDocumentPosition(this.contentDOM) & 2;
                } else if (this.dom.firstChild) {
                    if (offset == 0) {
                        for (var search = dom; ; search = search.parentNode) {
                            if (search == this.dom) {
                                atEnd = false;
                                break;
                            }
                            if (search.parentNode.firstChild != search) {
                                break;
                            }
                        }
                    }
                    if (atEnd == null && offset == dom.childNodes.length) {
                        for (
                            var search$1 = dom;
                            ;
                            search$1 = search$1.parentNode
                        ) {
                            if (search$1 == this.dom) {
                                atEnd = true;
                                break;
                            }
                            if (search$1.parentNode.lastChild != search$1) {
                                break;
                            }
                        }
                    }
                }
                return (atEnd == null ? bias > 0 : atEnd)
                    ? this.posAtEnd
                    : this.posAtStart;
            };

            // Scan up the dom finding the first desc that is a descendant of
            // this one.
            ViewDesc.prototype.nearestDesc = function nearestDesc(
                dom,
                onlyNodes
            ) {
                for (var first = true, cur = dom; cur; cur = cur.parentNode) {
                    var desc = this.getDesc(cur);
                    if (desc && (!onlyNodes || desc.node)) {
                        // If dom is outside of this desc's nodeDOM, don't count it.
                        if (
                            first &&
                            desc.nodeDOM &&
                            !(desc.nodeDOM.nodeType == 1
                                ? desc.nodeDOM.contains(
                                      dom.nodeType == 1 ? dom : dom.parentNode
                                  )
                                : desc.nodeDOM == dom)
                        ) {
                            first = false;
                        } else {
                            return desc;
                        }
                    }
                }
            };

            ViewDesc.prototype.getDesc = function getDesc(dom) {
                var desc = dom.pmViewDesc;
                for (var cur = desc; cur; cur = cur.parent) {
                    if (cur == this) {
                        return desc;
                    }
                }
            };

            ViewDesc.prototype.posFromDOM = function posFromDOM(
                dom,
                offset,
                bias
            ) {
                for (var scan = dom; scan; scan = scan.parentNode) {
                    var desc = this.getDesc(scan);
                    if (desc) {
                        return desc.localPosFromDOM(dom, offset, bias);
                    }
                }
                return -1;
            };

            // : (number) → ?NodeViewDesc
            // Find the desc for the node after the given pos, if any. (When a
            // parent node overrode rendering, there might not be one.)
            ViewDesc.prototype.descAt = function descAt(pos) {
                for (var i = 0, offset = 0; i < this.children.length; i++) {
                    var child = this.children[i],
                        end = offset + child.size;
                    if (offset == pos && end != offset) {
                        while (!child.border && child.children.length) {
                            child = child.children[0];
                        }
                        return child;
                    }
                    if (pos < end) {
                        return child.descAt(pos - offset - child.border);
                    }
                    offset = end;
                }
            };

            // : (number, number) → {node: dom.Node, offset: number}
            ViewDesc.prototype.domFromPos = function domFromPos(pos, side) {
                if (!this.contentDOM) {
                    return { node: this.dom, offset: 0 };
                }
                // First find the position in the child array
                var i = 0,
                    offset = 0;
                for (var curPos = 0; i < this.children.length; i++) {
                    var child = this.children[i],
                        end = curPos + child.size;
                    if (end > pos || child instanceof TrailingHackViewDesc) {
                        offset = pos - curPos;
                        break;
                    }
                    curPos = end;
                }
                // If this points into the middle of a child, call through
                if (offset) {
                    return this.children[i].domFromPos(
                        offset - this.children[i].border,
                        side
                    );
                }
                // Go back if there were any zero-length widgets with side >= 0 before this point
                for (
                    var prev = void 0;
                    i &&
                    !(prev = this.children[i - 1]).size &&
                    prev instanceof WidgetViewDesc &&
                    prev.widget.type.side >= 0;
                    i--
                ) {}
                // Scan towards the first useable node
                if (side <= 0) {
                    var prev$1,
                        enter = true;
                    for (; ; i--, enter = false) {
                        prev$1 = i ? this.children[i - 1] : null;
                        if (
                            !prev$1 ||
                            prev$1.dom.parentNode == this.contentDOM
                        ) {
                            break;
                        }
                    }
                    if (
                        prev$1 &&
                        side &&
                        enter &&
                        !prev$1.border &&
                        !prev$1.domAtom
                    ) {
                        return prev$1.domFromPos(prev$1.size, side);
                    }
                    return {
                        node: this.contentDOM,
                        offset: prev$1 ? domIndex(prev$1.dom) + 1 : 0,
                    };
                } else {
                    var next,
                        enter$1 = true;
                    for (; ; i++, enter$1 = false) {
                        next =
                            i < this.children.length ? this.children[i] : null;
                        if (!next || next.dom.parentNode == this.contentDOM) {
                            break;
                        }
                    }
                    if (next && enter$1 && !next.border && !next.domAtom) {
                        return next.domFromPos(0, side);
                    }
                    return {
                        node: this.contentDOM,
                        offset: next
                            ? domIndex(next.dom)
                            : this.contentDOM.childNodes.length,
                    };
                }
            };

            // Used to find a DOM range in a single parent for a given changed
            // range.
            ViewDesc.prototype.parseRange = function parseRange(
                from,
                to,
                base
            ) {
                if (base === void 0) base = 0;

                if (this.children.length == 0) {
                    return {
                        node: this.contentDOM,
                        from: from,
                        to: to,
                        fromOffset: 0,
                        toOffset: this.contentDOM.childNodes.length,
                    };
                }

                var fromOffset = -1,
                    toOffset = -1;
                for (var offset = base, i = 0; ; i++) {
                    var child = this.children[i],
                        end = offset + child.size;
                    if (fromOffset == -1 && from <= end) {
                        var childBase = offset + child.border;
                        // FIXME maybe descend mark views to parse a narrower range?
                        if (
                            from >= childBase &&
                            to <= end - child.border &&
                            child.node &&
                            child.contentDOM &&
                            this.contentDOM.contains(child.contentDOM)
                        ) {
                            return child.parseRange(from, to, childBase);
                        }

                        from = offset;
                        for (var j = i; j > 0; j--) {
                            var prev = this.children[j - 1];
                            if (
                                prev.size &&
                                prev.dom.parentNode == this.contentDOM &&
                                !prev.emptyChildAt(1)
                            ) {
                                fromOffset = domIndex(prev.dom) + 1;
                                break;
                            }
                            from -= prev.size;
                        }
                        if (fromOffset == -1) {
                            fromOffset = 0;
                        }
                    }
                    if (
                        fromOffset > -1 &&
                        (end > to || i == this.children.length - 1)
                    ) {
                        to = end;
                        for (
                            var j$1 = i + 1;
                            j$1 < this.children.length;
                            j$1++
                        ) {
                            var next = this.children[j$1];
                            if (
                                next.size &&
                                next.dom.parentNode == this.contentDOM &&
                                !next.emptyChildAt(-1)
                            ) {
                                toOffset = domIndex(next.dom);
                                break;
                            }
                            to += next.size;
                        }
                        if (toOffset == -1) {
                            toOffset = this.contentDOM.childNodes.length;
                        }
                        break;
                    }
                    offset = end;
                }
                return {
                    node: this.contentDOM,
                    from: from,
                    to: to,
                    fromOffset: fromOffset,
                    toOffset: toOffset,
                };
            };

            ViewDesc.prototype.emptyChildAt = function emptyChildAt(side) {
                if (this.border || !this.contentDOM || !this.children.length) {
                    return false;
                }
                var child =
                    this.children[side < 0 ? 0 : this.children.length - 1];
                return child.size == 0 || child.emptyChildAt(side);
            };

            // : (number) → dom.Node
            ViewDesc.prototype.domAfterPos = function domAfterPos(pos) {
                var ref = this.domFromPos(pos, 0);
                var node = ref.node;
                var offset = ref.offset;
                if (node.nodeType != 1 || offset == node.childNodes.length) {
                    throw new RangeError("No node after pos " + pos);
                }
                return node.childNodes[offset];
            };

            // : (number, number, dom.Document)
            // View descs are responsible for setting any selection that falls
            // entirely inside of them, so that custom implementations can do
            // custom things with the selection. Note that this falls apart when
            // a selection starts in such a node and ends in another, in which
            // case we just use whatever domFromPos produces as a best effort.
            ViewDesc.prototype.setSelection = function setSelection(
                anchor,
                head,
                root,
                force
            ) {
                // If the selection falls entirely in a child, give it to that child
                var from = Math.min(anchor, head),
                    to = Math.max(anchor, head);
                for (var i = 0, offset = 0; i < this.children.length; i++) {
                    var child = this.children[i],
                        end = offset + child.size;
                    if (from > offset && to < end) {
                        return child.setSelection(
                            anchor - offset - child.border,
                            head - offset - child.border,
                            root,
                            force
                        );
                    }
                    offset = end;
                }

                var anchorDOM = this.domFromPos(anchor, anchor ? -1 : 1);
                var headDOM =
                    head == anchor
                        ? anchorDOM
                        : this.domFromPos(head, head ? -1 : 1);
                var domSel = root.getSelection();

                var brKludge = false;
                // On Firefox, using Selection.collapse to put the cursor after a
                // BR node for some reason doesn't always work (#1073). On Safari,
                // the cursor sometimes inexplicable visually lags behind its
                // reported position in such situations (#1092).
                if ((result.gecko || result.safari) && anchor == head) {
                    var node = anchorDOM.node;
                    var offset$1 = anchorDOM.offset;
                    if (node.nodeType == 3) {
                        brKludge =
                            offset$1 && node.nodeValue[offset$1 - 1] == "\n";
                        // Issue #1128
                        if (brKludge && offset$1 == node.nodeValue.length) {
                            for (
                                var scan = node, after = void 0;
                                scan;
                                scan = scan.parentNode
                            ) {
                                if ((after = scan.nextSibling)) {
                                    if (after.nodeName == "BR") {
                                        anchorDOM = headDOM = {
                                            node: after.parentNode,
                                            offset: domIndex(after) + 1,
                                        };
                                    }
                                    break;
                                }
                                var desc = scan.pmViewDesc;
                                if (desc && desc.node && desc.node.isBlock) {
                                    break;
                                }
                            }
                        }
                    } else {
                        var prev = node.childNodes[offset$1 - 1];
                        brKludge =
                            prev &&
                            (prev.nodeName == "BR" ||
                                prev.contentEditable == "false");
                    }
                }
                // Firefox can act strangely when the selection is in front of an
                // uneditable node. See #1163 and https://bugzilla.mozilla.org/show_bug.cgi?id=1709536
                if (
                    result.gecko &&
                    domSel.focusNode &&
                    domSel.focusNode != headDOM.node &&
                    domSel.focusNode.nodeType == 1
                ) {
                    var after$1 =
                        domSel.focusNode.childNodes[domSel.focusOffset];
                    if (after$1 && after$1.contentEditable == "false") {
                        force = true;
                    }
                }

                if (
                    !(force || (brKludge && result.safari)) &&
                    isEquivalentPosition(
                        anchorDOM.node,
                        anchorDOM.offset,
                        domSel.anchorNode,
                        domSel.anchorOffset
                    ) &&
                    isEquivalentPosition(
                        headDOM.node,
                        headDOM.offset,
                        domSel.focusNode,
                        domSel.focusOffset
                    )
                ) {
                    return;
                }

                // Selection.extend can be used to create an 'inverted' selection
                // (one where the focus is before the anchor), but not all
                // browsers support it yet.
                var domSelExtended = false;
                if ((domSel.extend || anchor == head) && !brKludge) {
                    domSel.collapse(anchorDOM.node, anchorDOM.offset);
                    try {
                        if (anchor != head) {
                            domSel.extend(headDOM.node, headDOM.offset);
                        }
                        domSelExtended = true;
                    } catch (err) {
                        // In some cases with Chrome the selection is empty after calling
                        // collapse, even when it should be valid. This appears to be a bug, but
                        // it is difficult to isolate. If this happens fallback to the old path
                        // without using extend.
                        if (!(err instanceof DOMException)) {
                            throw err;
                        }
                        // declare global: DOMException
                    }
                }
                if (!domSelExtended) {
                    if (anchor > head) {
                        var tmp = anchorDOM;
                        anchorDOM = headDOM;
                        headDOM = tmp;
                    }
                    var range = document.createRange();
                    range.setEnd(headDOM.node, headDOM.offset);
                    range.setStart(anchorDOM.node, anchorDOM.offset);
                    domSel.removeAllRanges();
                    domSel.addRange(range);
                }
            };

            // : (dom.MutationRecord) → bool
            ViewDesc.prototype.ignoreMutation = function ignoreMutation(
                mutation
            ) {
                return !this.contentDOM && mutation.type != "selection";
            };

            prototypeAccessors.contentLost.get = function () {
                return (
                    this.contentDOM &&
                    this.contentDOM != this.dom &&
                    !this.dom.contains(this.contentDOM)
                );
            };

            // Remove a subtree of the element tree that has been touched
            // by a DOM change, so that the next update will redraw it.
            ViewDesc.prototype.markDirty = function markDirty(from, to) {
                for (var offset = 0, i = 0; i < this.children.length; i++) {
                    var child = this.children[i],
                        end = offset + child.size;
                    if (
                        offset == end
                            ? from <= end && to >= offset
                            : from < end && to > offset
                    ) {
                        var startInside = offset + child.border,
                            endInside = end - child.border;
                        if (from >= startInside && to <= endInside) {
                            this.dirty =
                                from == offset || to == end
                                    ? CONTENT_DIRTY
                                    : CHILD_DIRTY;
                            if (
                                from == startInside &&
                                to == endInside &&
                                (child.contentLost ||
                                    child.dom.parentNode != this.contentDOM)
                            ) {
                                child.dirty = NODE_DIRTY;
                            } else {
                                child.markDirty(
                                    from - startInside,
                                    to - startInside
                                );
                            }
                            return;
                        } else {
                            child.dirty =
                                child.dom == child.contentDOM &&
                                child.dom.parentNode == this.contentDOM
                                    ? CONTENT_DIRTY
                                    : NODE_DIRTY;
                        }
                    }
                    offset = end;
                }
                this.dirty = CONTENT_DIRTY;
            };

            ViewDesc.prototype.markParentsDirty = function markParentsDirty() {
                var level = 1;
                for (
                    var node = this.parent;
                    node;
                    node = node.parent, level++
                ) {
                    var dirty = level == 1 ? CONTENT_DIRTY : CHILD_DIRTY;
                    if (node.dirty < dirty) {
                        node.dirty = dirty;
                    }
                }
            };

            prototypeAccessors.domAtom.get = function () {
                return false;
            };

            prototypeAccessors.ignoreForCoords.get = function () {
                return false;
            };

            Object.defineProperties(ViewDesc.prototype, prototypeAccessors);

            // Reused array to avoid allocating fresh arrays for things that will
            // stay empty anyway.
            var nothing = [];

            // A widget desc represents a widget decoration, which is a DOM node
            // drawn between the document nodes.
            var WidgetViewDesc = /*@__PURE__*/ (function (ViewDesc) {
                function WidgetViewDesc(parent, widget, view, pos) {
                    var self,
                        dom = widget.type.toDOM;
                    if (typeof dom == "function") {
                        dom = dom(view, function () {
                            if (!self) {
                                return pos;
                            }
                            if (self.parent) {
                                return self.parent.posBeforeChild(self);
                            }
                        });
                    }
                    if (!widget.type.spec.raw) {
                        if (dom.nodeType != 1) {
                            var wrap = document.createElement("span");
                            wrap.appendChild(dom);
                            dom = wrap;
                        }
                        dom.contentEditable = false;
                        dom.classList.add("ProseMirror-widget");
                    }
                    ViewDesc.call(this, parent, nothing, dom, null);
                    this.widget = widget;
                    self = this;
                }

                if (ViewDesc) WidgetViewDesc.__proto__ = ViewDesc;
                WidgetViewDesc.prototype = Object.create(
                    ViewDesc && ViewDesc.prototype
                );
                WidgetViewDesc.prototype.constructor = WidgetViewDesc;

                var prototypeAccessors$1 = { domAtom: { configurable: true } };

                WidgetViewDesc.prototype.matchesWidget = function matchesWidget(
                    widget
                ) {
                    return (
                        this.dirty == NOT_DIRTY &&
                        widget.type.eq(this.widget.type)
                    );
                };

                WidgetViewDesc.prototype.parseRule = function parseRule() {
                    return { ignore: true };
                };

                WidgetViewDesc.prototype.stopEvent = function stopEvent(event) {
                    var stop = this.widget.spec.stopEvent;
                    return stop ? stop(event) : false;
                };

                WidgetViewDesc.prototype.ignoreMutation =
                    function ignoreMutation(mutation) {
                        return (
                            mutation.type != "selection" ||
                            this.widget.spec.ignoreSelection
                        );
                    };

                prototypeAccessors$1.domAtom.get = function () {
                    return true;
                };

                Object.defineProperties(
                    WidgetViewDesc.prototype,
                    prototypeAccessors$1
                );

                return WidgetViewDesc;
            })(ViewDesc);

            var CompositionViewDesc = /*@__PURE__*/ (function (ViewDesc) {
                function CompositionViewDesc(parent, dom, textDOM, text) {
                    ViewDesc.call(this, parent, nothing, dom, null);
                    this.textDOM = textDOM;
                    this.text = text;
                }

                if (ViewDesc) CompositionViewDesc.__proto__ = ViewDesc;
                CompositionViewDesc.prototype = Object.create(
                    ViewDesc && ViewDesc.prototype
                );
                CompositionViewDesc.prototype.constructor = CompositionViewDesc;

                var prototypeAccessors$2 = { size: { configurable: true } };

                prototypeAccessors$2.size.get = function () {
                    return this.text.length;
                };

                CompositionViewDesc.prototype.localPosFromDOM =
                    function localPosFromDOM(dom, offset) {
                        if (dom != this.textDOM) {
                            return this.posAtStart + (offset ? this.size : 0);
                        }
                        return this.posAtStart + offset;
                    };

                CompositionViewDesc.prototype.domFromPos = function domFromPos(
                    pos
                ) {
                    return { node: this.textDOM, offset: pos };
                };

                CompositionViewDesc.prototype.ignoreMutation =
                    function ignoreMutation(mut) {
                        return (
                            mut.type === "characterData" &&
                            mut.target.nodeValue == mut.oldValue
                        );
                    };

                Object.defineProperties(
                    CompositionViewDesc.prototype,
                    prototypeAccessors$2
                );

                return CompositionViewDesc;
            })(ViewDesc);

            // A mark desc represents a mark. May have multiple children,
            // depending on how the mark is split. Note that marks are drawn using
            // a fixed nesting order, for simplicity and predictability, so in
            // some cases they will be split more often than would appear
            // necessary.
            var MarkViewDesc = /*@__PURE__*/ (function (ViewDesc) {
                function MarkViewDesc(parent, mark, dom, contentDOM) {
                    ViewDesc.call(this, parent, [], dom, contentDOM);
                    this.mark = mark;
                }

                if (ViewDesc) MarkViewDesc.__proto__ = ViewDesc;
                MarkViewDesc.prototype = Object.create(
                    ViewDesc && ViewDesc.prototype
                );
                MarkViewDesc.prototype.constructor = MarkViewDesc;

                MarkViewDesc.create = function create(
                    parent,
                    mark,
                    inline,
                    view
                ) {
                    var custom = view.nodeViews[mark.type.name];
                    var spec = custom && custom(mark, view, inline);
                    if (!spec || !spec.dom) {
                        spec =
                            prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMSerializer.renderSpec(
                                document,
                                mark.type.spec.toDOM(mark, inline)
                            );
                    }
                    return new MarkViewDesc(
                        parent,
                        mark,
                        spec.dom,
                        spec.contentDOM || spec.dom
                    );
                };

                MarkViewDesc.prototype.parseRule = function parseRule() {
                    return {
                        mark: this.mark.type.name,
                        attrs: this.mark.attrs,
                        contentElement: this.contentDOM,
                    };
                };

                MarkViewDesc.prototype.matchesMark = function matchesMark(
                    mark
                ) {
                    return this.dirty != NODE_DIRTY && this.mark.eq(mark);
                };

                MarkViewDesc.prototype.markDirty = function markDirty(
                    from,
                    to
                ) {
                    ViewDesc.prototype.markDirty.call(this, from, to);
                    // Move dirty info to nearest node view
                    if (this.dirty != NOT_DIRTY) {
                        var parent = this.parent;
                        while (!parent.node) {
                            parent = parent.parent;
                        }
                        if (parent.dirty < this.dirty) {
                            parent.dirty = this.dirty;
                        }
                        this.dirty = NOT_DIRTY;
                    }
                };

                MarkViewDesc.prototype.slice = function slice(from, to, view) {
                    var copy = MarkViewDesc.create(
                        this.parent,
                        this.mark,
                        true,
                        view
                    );
                    var nodes = this.children,
                        size = this.size;
                    if (to < size) {
                        nodes = replaceNodes(nodes, to, size, view);
                    }
                    if (from > 0) {
                        nodes = replaceNodes(nodes, 0, from, view);
                    }
                    for (var i = 0; i < nodes.length; i++) {
                        nodes[i].parent = copy;
                    }
                    copy.children = nodes;
                    return copy;
                };

                return MarkViewDesc;
            })(ViewDesc);

            // Node view descs are the main, most common type of view desc, and
            // correspond to an actual node in the document. Unlike mark descs,
            // they populate their child array themselves.
            var NodeViewDesc = /*@__PURE__*/ (function (ViewDesc) {
                function NodeViewDesc(
                    parent,
                    node,
                    outerDeco,
                    innerDeco,
                    dom,
                    contentDOM,
                    nodeDOM,
                    view,
                    pos
                ) {
                    ViewDesc.call(
                        this,
                        parent,
                        node.isLeaf ? nothing : [],
                        dom,
                        contentDOM
                    );
                    this.nodeDOM = nodeDOM;
                    this.node = node;
                    this.outerDeco = outerDeco;
                    this.innerDeco = innerDeco;
                    if (contentDOM) {
                        this.updateChildren(view, pos);
                    }
                }

                if (ViewDesc) NodeViewDesc.__proto__ = ViewDesc;
                NodeViewDesc.prototype = Object.create(
                    ViewDesc && ViewDesc.prototype
                );
                NodeViewDesc.prototype.constructor = NodeViewDesc;

                var prototypeAccessors$3 = {
                    size: { configurable: true },
                    border: { configurable: true },
                    domAtom: { configurable: true },
                };

                // By default, a node is rendered using the `toDOM` method from the
                // node type spec. But client code can use the `nodeViews` spec to
                // supply a custom node view, which can influence various aspects of
                // the way the node works.
                //
                // (Using subclassing for this was intentionally decided against,
                // since it'd require exposing a whole slew of finicky
                // implementation details to the user code that they probably will
                // never need.)
                NodeViewDesc.create = function create(
                    parent,
                    node,
                    outerDeco,
                    innerDeco,
                    view,
                    pos
                ) {
                    var assign;

                    var custom = view.nodeViews[node.type.name],
                        descObj;
                    var spec =
                        custom &&
                        custom(
                            node,
                            view,
                            function () {
                                // (This is a function that allows the custom view to find its
                                // own position)
                                if (!descObj) {
                                    return pos;
                                }
                                if (descObj.parent) {
                                    return descObj.parent.posBeforeChild(
                                        descObj
                                    );
                                }
                            },
                            outerDeco,
                            innerDeco
                        );

                    var dom = spec && spec.dom,
                        contentDOM = spec && spec.contentDOM;
                    if (node.isText) {
                        if (!dom) {
                            dom = document.createTextNode(node.text);
                        } else if (dom.nodeType != 3) {
                            throw new RangeError(
                                "Text must be rendered as a DOM text node"
                            );
                        }
                    } else if (!dom) {
                        (assign =
                            prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMSerializer.renderSpec(
                                document,
                                node.type.spec.toDOM(node)
                            )),
                            (dom = assign.dom),
                            (contentDOM = assign.contentDOM);
                    }
                    if (!contentDOM && !node.isText && dom.nodeName != "BR") {
                        // Chrome gets confused by <br contenteditable=false>
                        if (!dom.hasAttribute("contenteditable")) {
                            dom.contentEditable = false;
                        }
                        if (node.type.spec.draggable) {
                            dom.draggable = true;
                        }
                    }

                    var nodeDOM = dom;
                    dom = applyOuterDeco(dom, outerDeco, node);

                    if (spec) {
                        return (descObj = new CustomNodeViewDesc(
                            parent,
                            node,
                            outerDeco,
                            innerDeco,
                            dom,
                            contentDOM,
                            nodeDOM,
                            spec,
                            view,
                            pos + 1
                        ));
                    } else if (node.isText) {
                        return new TextViewDesc(
                            parent,
                            node,
                            outerDeco,
                            innerDeco,
                            dom,
                            nodeDOM,
                            view
                        );
                    } else {
                        return new NodeViewDesc(
                            parent,
                            node,
                            outerDeco,
                            innerDeco,
                            dom,
                            contentDOM,
                            nodeDOM,
                            view,
                            pos + 1
                        );
                    }
                };

                NodeViewDesc.prototype.parseRule = function parseRule() {
                    var this$1 = this;

                    // Experimental kludge to allow opt-in re-parsing of nodes
                    if (this.node.type.spec.reparseInView) {
                        return null;
                    }
                    // FIXME the assumption that this can always return the current
                    // attrs means that if the user somehow manages to change the
                    // attrs in the dom, that won't be picked up. Not entirely sure
                    // whether this is a problem
                    var rule = {
                        node: this.node.type.name,
                        attrs: this.node.attrs,
                    };
                    if (this.node.type.spec.code) {
                        rule.preserveWhitespace = "full";
                    }
                    if (this.contentDOM && !this.contentLost) {
                        rule.contentElement = this.contentDOM;
                    } else {
                        rule.getContent = function () {
                            return this$1.contentDOM
                                ? prosemirror_model__WEBPACK_IMPORTED_MODULE_1__
                                      .Fragment.empty
                                : this$1.node.content;
                        };
                    }
                    return rule;
                };

                NodeViewDesc.prototype.matchesNode = function matchesNode(
                    node,
                    outerDeco,
                    innerDeco
                ) {
                    return (
                        this.dirty == NOT_DIRTY &&
                        node.eq(this.node) &&
                        sameOuterDeco(outerDeco, this.outerDeco) &&
                        innerDeco.eq(this.innerDeco)
                    );
                };

                prototypeAccessors$3.size.get = function () {
                    return this.node.nodeSize;
                };

                prototypeAccessors$3.border.get = function () {
                    return this.node.isLeaf ? 0 : 1;
                };

                // Syncs `this.children` to match `this.node.content` and the local
                // decorations, possibly introducing nesting for marks. Then, in a
                // separate step, syncs the DOM inside `this.contentDOM` to
                // `this.children`.
                NodeViewDesc.prototype.updateChildren = function updateChildren(
                    view,
                    pos
                ) {
                    var this$1 = this;

                    var inline = this.node.inlineContent,
                        off = pos;
                    var composition =
                        view.composing && this.localCompositionInfo(view, pos);
                    var localComposition =
                        composition && composition.pos > -1
                            ? composition
                            : null;
                    var compositionInChild = composition && composition.pos < 0;
                    var updater = new ViewTreeUpdater(
                        this,
                        localComposition && localComposition.node
                    );
                    iterDeco(
                        this.node,
                        this.innerDeco,
                        function (widget, i, insideNode) {
                            if (widget.spec.marks) {
                                updater.syncToMarks(
                                    widget.spec.marks,
                                    inline,
                                    view
                                );
                            } else if (widget.type.side >= 0 && !insideNode) {
                                updater.syncToMarks(
                                    i == this$1.node.childCount
                                        ? prosemirror_model__WEBPACK_IMPORTED_MODULE_1__
                                              .Mark.none
                                        : this$1.node.child(i).marks,
                                    inline,
                                    view
                                );
                            }
                            // If the next node is a desc matching this widget, reuse it,
                            // otherwise insert the widget as a new view desc.
                            updater.placeWidget(widget, view, off);
                        },
                        function (child, outerDeco, innerDeco, i) {
                            // Make sure the wrapping mark descs match the node's marks.
                            updater.syncToMarks(child.marks, inline, view);
                            // Try several strategies for drawing this node
                            var compIndex;
                            if (
                                updater.findNodeMatch(
                                    child,
                                    outerDeco,
                                    innerDeco,
                                    i
                                )
                            );
                            else if (
                                compositionInChild &&
                                view.state.selection.from > off &&
                                view.state.selection.to <
                                    off + child.nodeSize &&
                                (compIndex = updater.findIndexWithChild(
                                    composition.node
                                )) > -1 &&
                                updater.updateNodeAt(
                                    child,
                                    outerDeco,
                                    innerDeco,
                                    compIndex,
                                    view
                                )
                            );
                            else if (
                                updater.updateNextNode(
                                    child,
                                    outerDeco,
                                    innerDeco,
                                    view,
                                    i
                                )
                            );
                            else {
                                // Add it as a new view
                                updater.addNode(
                                    child,
                                    outerDeco,
                                    innerDeco,
                                    view,
                                    off
                                );
                            }
                            off += child.nodeSize;
                        }
                    );
                    // Drop all remaining descs after the current position.
                    updater.syncToMarks(nothing, inline, view);
                    if (this.node.isTextblock) {
                        updater.addTextblockHacks();
                    }
                    updater.destroyRest();

                    // Sync the DOM if anything changed
                    if (updater.changed || this.dirty == CONTENT_DIRTY) {
                        // May have to protect focused DOM from being changed if a composition is active
                        if (localComposition) {
                            this.protectLocalComposition(
                                view,
                                localComposition
                            );
                        }
                        renderDescs(this.contentDOM, this.children, view);
                        if (result.ios) {
                            iosHacks(this.dom);
                        }
                    }
                };

                NodeViewDesc.prototype.localCompositionInfo =
                    function localCompositionInfo(view, pos) {
                        // Only do something if both the selection and a focused text node
                        // are inside of this node
                        var ref = view.state.selection;
                        var from = ref.from;
                        var to = ref.to;
                        if (
                            !(
                                view.state.selection instanceof
                                prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection
                            ) ||
                            from < pos ||
                            to > pos + this.node.content.size
                        ) {
                            return;
                        }
                        var sel = view.root.getSelection();
                        var textNode = nearbyTextNode(
                            sel.focusNode,
                            sel.focusOffset
                        );
                        if (
                            !textNode ||
                            !this.dom.contains(textNode.parentNode)
                        ) {
                            return;
                        }

                        if (this.node.inlineContent) {
                            // Find the text in the focused node in the node, stop if it's not
                            // there (may have been modified through other means, in which
                            // case it should overwritten)
                            var text = textNode.nodeValue;
                            var textPos = findTextInFragment(
                                this.node.content,
                                text,
                                from - pos,
                                to - pos
                            );
                            return textPos < 0
                                ? null
                                : { node: textNode, pos: textPos, text: text };
                        } else {
                            return { node: textNode, pos: -1 };
                        }
                    };

                NodeViewDesc.prototype.protectLocalComposition =
                    function protectLocalComposition(view, ref) {
                        var node = ref.node;
                        var pos = ref.pos;
                        var text = ref.text;

                        // The node is already part of a local view desc, leave it there
                        if (this.getDesc(node)) {
                            return;
                        }

                        // Create a composition view for the orphaned nodes
                        var topNode = node;
                        for (; ; topNode = topNode.parentNode) {
                            if (topNode.parentNode == this.contentDOM) {
                                break;
                            }
                            while (topNode.previousSibling) {
                                topNode.parentNode.removeChild(
                                    topNode.previousSibling
                                );
                            }
                            while (topNode.nextSibling) {
                                topNode.parentNode.removeChild(
                                    topNode.nextSibling
                                );
                            }
                            if (topNode.pmViewDesc) {
                                topNode.pmViewDesc = null;
                            }
                        }
                        var desc = new CompositionViewDesc(
                            this,
                            topNode,
                            node,
                            text
                        );
                        view.compositionNodes.push(desc);

                        // Patch up this.children to contain the composition view
                        this.children = replaceNodes(
                            this.children,
                            pos,
                            pos + text.length,
                            view,
                            desc
                        );
                    };

                // : (Node, [Decoration], DecorationSource, EditorView) → bool
                // If this desc be updated to match the given node decoration,
                // do so and return true.
                NodeViewDesc.prototype.update = function update(
                    node,
                    outerDeco,
                    innerDeco,
                    view
                ) {
                    if (
                        this.dirty == NODE_DIRTY ||
                        !node.sameMarkup(this.node)
                    ) {
                        return false;
                    }
                    this.updateInner(node, outerDeco, innerDeco, view);
                    return true;
                };

                NodeViewDesc.prototype.updateInner = function updateInner(
                    node,
                    outerDeco,
                    innerDeco,
                    view
                ) {
                    this.updateOuterDeco(outerDeco);
                    this.node = node;
                    this.innerDeco = innerDeco;
                    if (this.contentDOM) {
                        this.updateChildren(view, this.posAtStart);
                    }
                    this.dirty = NOT_DIRTY;
                };

                NodeViewDesc.prototype.updateOuterDeco =
                    function updateOuterDeco(outerDeco) {
                        if (sameOuterDeco(outerDeco, this.outerDeco)) {
                            return;
                        }
                        var needsWrap = this.nodeDOM.nodeType != 1;
                        var oldDOM = this.dom;
                        this.dom = patchOuterDeco(
                            this.dom,
                            this.nodeDOM,
                            computeOuterDeco(
                                this.outerDeco,
                                this.node,
                                needsWrap
                            ),
                            computeOuterDeco(outerDeco, this.node, needsWrap)
                        );
                        if (this.dom != oldDOM) {
                            oldDOM.pmViewDesc = null;
                            this.dom.pmViewDesc = this;
                        }
                        this.outerDeco = outerDeco;
                    };

                // Mark this node as being the selected node.
                NodeViewDesc.prototype.selectNode = function selectNode() {
                    this.nodeDOM.classList.add("ProseMirror-selectednode");
                    if (this.contentDOM || !this.node.type.spec.draggable) {
                        this.dom.draggable = true;
                    }
                };

                // Remove selected node marking from this node.
                NodeViewDesc.prototype.deselectNode = function deselectNode() {
                    this.nodeDOM.classList.remove("ProseMirror-selectednode");
                    if (this.contentDOM || !this.node.type.spec.draggable) {
                        this.dom.removeAttribute("draggable");
                    }
                };

                prototypeAccessors$3.domAtom.get = function () {
                    return this.node.isAtom;
                };

                Object.defineProperties(
                    NodeViewDesc.prototype,
                    prototypeAccessors$3
                );

                return NodeViewDesc;
            })(ViewDesc);

            // Create a view desc for the top-level document node, to be exported
            // and used by the view class.
            function docViewDesc(doc, outerDeco, innerDeco, dom, view) {
                applyOuterDeco(dom, outerDeco, doc);
                return new NodeViewDesc(
                    null,
                    doc,
                    outerDeco,
                    innerDeco,
                    dom,
                    dom,
                    dom,
                    view,
                    0
                );
            }

            var TextViewDesc = /*@__PURE__*/ (function (NodeViewDesc) {
                function TextViewDesc(
                    parent,
                    node,
                    outerDeco,
                    innerDeco,
                    dom,
                    nodeDOM,
                    view
                ) {
                    NodeViewDesc.call(
                        this,
                        parent,
                        node,
                        outerDeco,
                        innerDeco,
                        dom,
                        null,
                        nodeDOM,
                        view
                    );
                }

                if (NodeViewDesc) TextViewDesc.__proto__ = NodeViewDesc;
                TextViewDesc.prototype = Object.create(
                    NodeViewDesc && NodeViewDesc.prototype
                );
                TextViewDesc.prototype.constructor = TextViewDesc;

                var prototypeAccessors$4 = { domAtom: { configurable: true } };

                TextViewDesc.prototype.parseRule = function parseRule() {
                    var skip = this.nodeDOM.parentNode;
                    while (skip && skip != this.dom && !skip.pmIsDeco) {
                        skip = skip.parentNode;
                    }
                    return { skip: skip || true };
                };

                TextViewDesc.prototype.update = function update(
                    node,
                    outerDeco,
                    _,
                    view
                ) {
                    if (
                        this.dirty == NODE_DIRTY ||
                        (this.dirty != NOT_DIRTY && !this.inParent()) ||
                        !node.sameMarkup(this.node)
                    ) {
                        return false;
                    }
                    this.updateOuterDeco(outerDeco);
                    if (
                        (this.dirty != NOT_DIRTY ||
                            node.text != this.node.text) &&
                        node.text != this.nodeDOM.nodeValue
                    ) {
                        this.nodeDOM.nodeValue = node.text;
                        if (view.trackWrites == this.nodeDOM) {
                            view.trackWrites = null;
                        }
                    }
                    this.node = node;
                    this.dirty = NOT_DIRTY;
                    return true;
                };

                TextViewDesc.prototype.inParent = function inParent() {
                    var parentDOM = this.parent.contentDOM;
                    for (var n = this.nodeDOM; n; n = n.parentNode) {
                        if (n == parentDOM) {
                            return true;
                        }
                    }
                    return false;
                };

                TextViewDesc.prototype.domFromPos = function domFromPos(pos) {
                    return { node: this.nodeDOM, offset: pos };
                };

                TextViewDesc.prototype.localPosFromDOM =
                    function localPosFromDOM(dom, offset, bias) {
                        if (dom == this.nodeDOM) {
                            return (
                                this.posAtStart +
                                Math.min(offset, this.node.text.length)
                            );
                        }
                        return NodeViewDesc.prototype.localPosFromDOM.call(
                            this,
                            dom,
                            offset,
                            bias
                        );
                    };

                TextViewDesc.prototype.ignoreMutation = function ignoreMutation(
                    mutation
                ) {
                    return (
                        mutation.type != "characterData" &&
                        mutation.type != "selection"
                    );
                };

                TextViewDesc.prototype.slice = function slice(from, to, view) {
                    var node = this.node.cut(from, to),
                        dom = document.createTextNode(node.text);
                    return new TextViewDesc(
                        this.parent,
                        node,
                        this.outerDeco,
                        this.innerDeco,
                        dom,
                        dom,
                        view
                    );
                };

                TextViewDesc.prototype.markDirty = function markDirty(
                    from,
                    to
                ) {
                    NodeViewDesc.prototype.markDirty.call(this, from, to);
                    if (
                        this.dom != this.nodeDOM &&
                        (from == 0 || to == this.nodeDOM.nodeValue.length)
                    ) {
                        this.dirty = NODE_DIRTY;
                    }
                };

                prototypeAccessors$4.domAtom.get = function () {
                    return false;
                };

                Object.defineProperties(
                    TextViewDesc.prototype,
                    prototypeAccessors$4
                );

                return TextViewDesc;
            })(NodeViewDesc);

            // A dummy desc used to tag trailing BR or IMG nodes created to work
            // around contentEditable terribleness.
            var TrailingHackViewDesc = /*@__PURE__*/ (function (ViewDesc) {
                function TrailingHackViewDesc() {
                    ViewDesc.apply(this, arguments);
                }

                if (ViewDesc) TrailingHackViewDesc.__proto__ = ViewDesc;
                TrailingHackViewDesc.prototype = Object.create(
                    ViewDesc && ViewDesc.prototype
                );
                TrailingHackViewDesc.prototype.constructor =
                    TrailingHackViewDesc;

                var prototypeAccessors$5 = {
                    domAtom: { configurable: true },
                    ignoreForCoords: { configurable: true },
                };

                TrailingHackViewDesc.prototype.parseRule =
                    function parseRule() {
                        return { ignore: true };
                    };
                TrailingHackViewDesc.prototype.matchesHack =
                    function matchesHack(nodeName) {
                        return (
                            this.dirty == NOT_DIRTY &&
                            this.dom.nodeName == nodeName
                        );
                    };
                prototypeAccessors$5.domAtom.get = function () {
                    return true;
                };
                prototypeAccessors$5.ignoreForCoords.get = function () {
                    return this.dom.nodeName == "IMG";
                };

                Object.defineProperties(
                    TrailingHackViewDesc.prototype,
                    prototypeAccessors$5
                );

                return TrailingHackViewDesc;
            })(ViewDesc);

            // A separate subclass is used for customized node views, so that the
            // extra checks only have to be made for nodes that are actually
            // customized.
            var CustomNodeViewDesc = /*@__PURE__*/ (function (NodeViewDesc) {
                function CustomNodeViewDesc(
                    parent,
                    node,
                    outerDeco,
                    innerDeco,
                    dom,
                    contentDOM,
                    nodeDOM,
                    spec,
                    view,
                    pos
                ) {
                    NodeViewDesc.call(
                        this,
                        parent,
                        node,
                        outerDeco,
                        innerDeco,
                        dom,
                        contentDOM,
                        nodeDOM,
                        view,
                        pos
                    );
                    this.spec = spec;
                }

                if (NodeViewDesc) CustomNodeViewDesc.__proto__ = NodeViewDesc;
                CustomNodeViewDesc.prototype = Object.create(
                    NodeViewDesc && NodeViewDesc.prototype
                );
                CustomNodeViewDesc.prototype.constructor = CustomNodeViewDesc;

                // A custom `update` method gets to decide whether the update goes
                // through. If it does, and there's a `contentDOM` node, our logic
                // updates the children.
                CustomNodeViewDesc.prototype.update = function update(
                    node,
                    outerDeco,
                    innerDeco,
                    view
                ) {
                    if (this.dirty == NODE_DIRTY) {
                        return false;
                    }
                    if (this.spec.update) {
                        var result = this.spec.update(
                            node,
                            outerDeco,
                            innerDeco
                        );
                        if (result) {
                            this.updateInner(node, outerDeco, innerDeco, view);
                        }
                        return result;
                    } else if (!this.contentDOM && !node.isLeaf) {
                        return false;
                    } else {
                        return NodeViewDesc.prototype.update.call(
                            this,
                            node,
                            outerDeco,
                            innerDeco,
                            view
                        );
                    }
                };

                CustomNodeViewDesc.prototype.selectNode =
                    function selectNode() {
                        this.spec.selectNode
                            ? this.spec.selectNode()
                            : NodeViewDesc.prototype.selectNode.call(this);
                    };

                CustomNodeViewDesc.prototype.deselectNode =
                    function deselectNode() {
                        this.spec.deselectNode
                            ? this.spec.deselectNode()
                            : NodeViewDesc.prototype.deselectNode.call(this);
                    };

                CustomNodeViewDesc.prototype.setSelection =
                    function setSelection(anchor, head, root, force) {
                        this.spec.setSelection
                            ? this.spec.setSelection(anchor, head, root)
                            : NodeViewDesc.prototype.setSelection.call(
                                  this,
                                  anchor,
                                  head,
                                  root,
                                  force
                              );
                    };

                CustomNodeViewDesc.prototype.destroy = function destroy() {
                    if (this.spec.destroy) {
                        this.spec.destroy();
                    }
                    NodeViewDesc.prototype.destroy.call(this);
                };

                CustomNodeViewDesc.prototype.stopEvent = function stopEvent(
                    event
                ) {
                    return this.spec.stopEvent
                        ? this.spec.stopEvent(event)
                        : false;
                };

                CustomNodeViewDesc.prototype.ignoreMutation =
                    function ignoreMutation(mutation) {
                        return this.spec.ignoreMutation
                            ? this.spec.ignoreMutation(mutation)
                            : NodeViewDesc.prototype.ignoreMutation.call(
                                  this,
                                  mutation
                              );
                    };

                return CustomNodeViewDesc;
            })(NodeViewDesc);

            // : (dom.Node, [ViewDesc])
            // Sync the content of the given DOM node with the nodes associated
            // with the given array of view descs, recursing into mark descs
            // because this should sync the subtree for a whole node at a time.
            function renderDescs(parentDOM, descs, view) {
                var dom = parentDOM.firstChild,
                    written = false;
                for (var i = 0; i < descs.length; i++) {
                    var desc = descs[i],
                        childDOM = desc.dom;
                    if (childDOM.parentNode == parentDOM) {
                        while (childDOM != dom) {
                            dom = rm(dom);
                            written = true;
                        }
                        dom = dom.nextSibling;
                    } else {
                        written = true;
                        parentDOM.insertBefore(childDOM, dom);
                    }
                    if (desc instanceof MarkViewDesc) {
                        var pos = dom
                            ? dom.previousSibling
                            : parentDOM.lastChild;
                        renderDescs(desc.contentDOM, desc.children, view);
                        dom = pos ? pos.nextSibling : parentDOM.firstChild;
                    }
                }
                while (dom) {
                    dom = rm(dom);
                    written = true;
                }
                if (written && view.trackWrites == parentDOM) {
                    view.trackWrites = null;
                }
            }

            function OuterDecoLevel(nodeName) {
                if (nodeName) {
                    this.nodeName = nodeName;
                }
            }
            OuterDecoLevel.prototype = Object.create(null);

            var noDeco = [new OuterDecoLevel()];

            function computeOuterDeco(outerDeco, node, needsWrap) {
                if (outerDeco.length == 0) {
                    return noDeco;
                }

                var top = needsWrap ? noDeco[0] : new OuterDecoLevel(),
                    result = [top];

                for (var i = 0; i < outerDeco.length; i++) {
                    var attrs = outerDeco[i].type.attrs;
                    if (!attrs) {
                        continue;
                    }
                    if (attrs.nodeName) {
                        result.push((top = new OuterDecoLevel(attrs.nodeName)));
                    }

                    for (var name in attrs) {
                        var val = attrs[name];
                        if (val == null) {
                            continue;
                        }
                        if (needsWrap && result.length == 1) {
                            result.push(
                                (top = new OuterDecoLevel(
                                    node.isInline ? "span" : "div"
                                ))
                            );
                        }
                        if (name == "class") {
                            top.class =
                                (top.class ? top.class + " " : "") + val;
                        } else if (name == "style") {
                            top.style =
                                (top.style ? top.style + ";" : "") + val;
                        } else if (name != "nodeName") {
                            top[name] = val;
                        }
                    }
                }

                return result;
            }

            function patchOuterDeco(
                outerDOM,
                nodeDOM,
                prevComputed,
                curComputed
            ) {
                // Shortcut for trivial case
                if (prevComputed == noDeco && curComputed == noDeco) {
                    return nodeDOM;
                }

                var curDOM = nodeDOM;
                for (var i = 0; i < curComputed.length; i++) {
                    var deco = curComputed[i],
                        prev = prevComputed[i];
                    if (i) {
                        var parent = void 0;
                        if (
                            prev &&
                            prev.nodeName == deco.nodeName &&
                            curDOM != outerDOM &&
                            (parent = curDOM.parentNode) &&
                            parent.tagName.toLowerCase() == deco.nodeName
                        ) {
                            curDOM = parent;
                        } else {
                            parent = document.createElement(deco.nodeName);
                            parent.pmIsDeco = true;
                            parent.appendChild(curDOM);
                            prev = noDeco[0];
                            curDOM = parent;
                        }
                    }
                    patchAttributes(curDOM, prev || noDeco[0], deco);
                }
                return curDOM;
            }

            function patchAttributes(dom, prev, cur) {
                for (var name in prev) {
                    if (
                        name != "class" &&
                        name != "style" &&
                        name != "nodeName" &&
                        !(name in cur)
                    ) {
                        dom.removeAttribute(name);
                    }
                }
                for (var name$1 in cur) {
                    if (
                        name$1 != "class" &&
                        name$1 != "style" &&
                        name$1 != "nodeName" &&
                        cur[name$1] != prev[name$1]
                    ) {
                        dom.setAttribute(name$1, cur[name$1]);
                    }
                }
                if (prev.class != cur.class) {
                    var prevList = prev.class
                        ? prev.class.split(" ").filter(Boolean)
                        : nothing;
                    var curList = cur.class
                        ? cur.class.split(" ").filter(Boolean)
                        : nothing;
                    for (var i = 0; i < prevList.length; i++) {
                        if (curList.indexOf(prevList[i]) == -1) {
                            dom.classList.remove(prevList[i]);
                        }
                    }
                    for (var i$1 = 0; i$1 < curList.length; i$1++) {
                        if (prevList.indexOf(curList[i$1]) == -1) {
                            dom.classList.add(curList[i$1]);
                        }
                    }
                }
                if (prev.style != cur.style) {
                    if (prev.style) {
                        var prop =
                                /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g,
                            m;
                        while ((m = prop.exec(prev.style))) {
                            dom.style.removeProperty(m[1]);
                        }
                    }
                    if (cur.style) {
                        dom.style.cssText += cur.style;
                    }
                }
            }

            function applyOuterDeco(dom, deco, node) {
                return patchOuterDeco(
                    dom,
                    dom,
                    noDeco,
                    computeOuterDeco(deco, node, dom.nodeType != 1)
                );
            }

            // : ([Decoration], [Decoration]) → bool
            function sameOuterDeco(a, b) {
                if (a.length != b.length) {
                    return false;
                }
                for (var i = 0; i < a.length; i++) {
                    if (!a[i].type.eq(b[i].type)) {
                        return false;
                    }
                }
                return true;
            }

            // Remove a DOM node and return its next sibling.
            function rm(dom) {
                var next = dom.nextSibling;
                dom.parentNode.removeChild(dom);
                return next;
            }

            // Helper class for incrementally updating a tree of mark descs and
            // the widget and node descs inside of them.
            var ViewTreeUpdater = function ViewTreeUpdater(top, lockedNode) {
                this.top = top;
                this.lock = lockedNode;
                // Index into `this.top`'s child array, represents the current
                // update position.
                this.index = 0;
                // When entering a mark, the current top and index are pushed
                // onto this.
                this.stack = [];
                // Tracks whether anything was changed
                this.changed = false;

                this.preMatch = preMatch(top.node.content, top.children);
            };

            // Destroy and remove the children between the given indices in
            // `this.top`.
            ViewTreeUpdater.prototype.destroyBetween = function destroyBetween(
                start,
                end
            ) {
                if (start == end) {
                    return;
                }
                for (var i = start; i < end; i++) {
                    this.top.children[i].destroy();
                }
                this.top.children.splice(start, end - start);
                this.changed = true;
            };

            // Destroy all remaining children in `this.top`.
            ViewTreeUpdater.prototype.destroyRest = function destroyRest() {
                this.destroyBetween(this.index, this.top.children.length);
            };

            // : ([Mark], EditorView)
            // Sync the current stack of mark descs with the given array of
            // marks, reusing existing mark descs when possible.
            ViewTreeUpdater.prototype.syncToMarks = function syncToMarks(
                marks,
                inline,
                view
            ) {
                var keep = 0,
                    depth = this.stack.length >> 1;
                var maxKeep = Math.min(depth, marks.length);
                while (
                    keep < maxKeep &&
                    (keep == depth - 1
                        ? this.top
                        : this.stack[(keep + 1) << 1]
                    ).matchesMark(marks[keep]) &&
                    marks[keep].type.spec.spanning !== false
                ) {
                    keep++;
                }

                while (keep < depth) {
                    this.destroyRest();
                    this.top.dirty = NOT_DIRTY;
                    this.index = this.stack.pop();
                    this.top = this.stack.pop();
                    depth--;
                }
                while (depth < marks.length) {
                    this.stack.push(this.top, this.index + 1);
                    var found = -1;
                    for (
                        var i = this.index;
                        i < Math.min(this.index + 3, this.top.children.length);
                        i++
                    ) {
                        if (this.top.children[i].matchesMark(marks[depth])) {
                            found = i;
                            break;
                        }
                    }
                    if (found > -1) {
                        if (found > this.index) {
                            this.changed = true;
                            this.destroyBetween(this.index, found);
                        }
                        this.top = this.top.children[this.index];
                    } else {
                        var markDesc = MarkViewDesc.create(
                            this.top,
                            marks[depth],
                            inline,
                            view
                        );
                        this.top.children.splice(this.index, 0, markDesc);
                        this.top = markDesc;
                        this.changed = true;
                    }
                    this.index = 0;
                    depth++;
                }
            };

            // : (Node, [Decoration], DecorationSource) → bool
            // Try to find a node desc matching the given data. Skip over it and
            // return true when successful.
            ViewTreeUpdater.prototype.findNodeMatch = function findNodeMatch(
                node,
                outerDeco,
                innerDeco,
                index
            ) {
                var children = this.top.children,
                    found = -1;
                if (index >= this.preMatch.index) {
                    for (var i = this.index; i < children.length; i++) {
                        if (
                            children[i].matchesNode(node, outerDeco, innerDeco)
                        ) {
                            found = i;
                            break;
                        }
                    }
                } else {
                    for (
                        var i$1 = this.index,
                            e = Math.min(children.length, i$1 + 1);
                        i$1 < e;
                        i$1++
                    ) {
                        var child = children[i$1];
                        if (
                            child.matchesNode(node, outerDeco, innerDeco) &&
                            !this.preMatch.matched.has(child)
                        ) {
                            found = i$1;
                            break;
                        }
                    }
                }
                if (found < 0) {
                    return false;
                }
                this.destroyBetween(this.index, found);
                this.index++;
                return true;
            };

            ViewTreeUpdater.prototype.updateNodeAt = function updateNodeAt(
                node,
                outerDeco,
                innerDeco,
                index,
                view
            ) {
                var child = this.top.children[index];
                if (!child.update(node, outerDeco, innerDeco, view)) {
                    return false;
                }
                this.destroyBetween(this.index, index);
                this.index = index + 1;
                return true;
            };

            ViewTreeUpdater.prototype.findIndexWithChild =
                function findIndexWithChild(domNode) {
                    for (;;) {
                        var parent = domNode.parentNode;
                        if (!parent) {
                            return -1;
                        }
                        if (parent == this.top.contentDOM) {
                            var desc = domNode.pmViewDesc;
                            if (desc) {
                                for (
                                    var i = this.index;
                                    i < this.top.children.length;
                                    i++
                                ) {
                                    if (this.top.children[i] == desc) {
                                        return i;
                                    }
                                }
                            }
                            return -1;
                        }
                        domNode = parent;
                    }
                };

            // : (Node, [Decoration], DecorationSource, EditorView, Fragment, number) → bool
            // Try to update the next node, if any, to the given data. Checks
            // pre-matches to avoid overwriting nodes that could still be used.
            ViewTreeUpdater.prototype.updateNextNode = function updateNextNode(
                node,
                outerDeco,
                innerDeco,
                view,
                index
            ) {
                for (var i = this.index; i < this.top.children.length; i++) {
                    var next = this.top.children[i];
                    if (next instanceof NodeViewDesc) {
                        var preMatch = this.preMatch.matched.get(next);
                        if (preMatch != null && preMatch != index) {
                            return false;
                        }
                        var nextDOM = next.dom;

                        // Can't update if nextDOM is or contains this.lock, except if
                        // it's a text node whose content already matches the new text
                        // and whose decorations match the new ones.
                        var locked =
                            this.lock &&
                            (nextDOM == this.lock ||
                                (nextDOM.nodeType == 1 &&
                                    nextDOM.contains(this.lock.parentNode))) &&
                            !(
                                node.isText &&
                                next.node &&
                                next.node.isText &&
                                next.nodeDOM.nodeValue == node.text &&
                                next.dirty != NODE_DIRTY &&
                                sameOuterDeco(outerDeco, next.outerDeco)
                            );
                        if (
                            !locked &&
                            next.update(node, outerDeco, innerDeco, view)
                        ) {
                            this.destroyBetween(this.index, i);
                            if (next.dom != nextDOM) {
                                this.changed = true;
                            }
                            this.index++;
                            return true;
                        }
                        break;
                    }
                }
                return false;
            };

            // : (Node, [Decoration], DecorationSource, EditorView)
            // Insert the node as a newly created node desc.
            ViewTreeUpdater.prototype.addNode = function addNode(
                node,
                outerDeco,
                innerDeco,
                view,
                pos
            ) {
                this.top.children.splice(
                    this.index++,
                    0,
                    NodeViewDesc.create(
                        this.top,
                        node,
                        outerDeco,
                        innerDeco,
                        view,
                        pos
                    )
                );
                this.changed = true;
            };

            ViewTreeUpdater.prototype.placeWidget = function placeWidget(
                widget,
                view,
                pos
            ) {
                var next =
                    this.index < this.top.children.length
                        ? this.top.children[this.index]
                        : null;
                if (
                    next &&
                    next.matchesWidget(widget) &&
                    (widget == next.widget ||
                        !next.widget.type.toDOM.parentNode)
                ) {
                    this.index++;
                } else {
                    var desc = new WidgetViewDesc(this.top, widget, view, pos);
                    this.top.children.splice(this.index++, 0, desc);
                    this.changed = true;
                }
            };

            // Make sure a textblock looks and behaves correctly in
            // contentEditable.
            ViewTreeUpdater.prototype.addTextblockHacks =
                function addTextblockHacks() {
                    var lastChild = this.top.children[this.index - 1];
                    while (lastChild instanceof MarkViewDesc) {
                        lastChild =
                            lastChild.children[lastChild.children.length - 1];
                    }

                    if (
                        !lastChild || // Empty textblock
                        !(lastChild instanceof TextViewDesc) ||
                        /\n$/.test(lastChild.node.text)
                    ) {
                        // Avoid bugs in Safari's cursor drawing (#1165) and Chrome's mouse selection (#1152)
                        if (
                            (result.safari || result.chrome) &&
                            lastChild &&
                            lastChild.dom.contentEditable == "false"
                        ) {
                            this.addHackNode("IMG");
                        }
                        this.addHackNode("BR");
                    }
                };

            ViewTreeUpdater.prototype.addHackNode = function addHackNode(
                nodeName
            ) {
                if (
                    this.index < this.top.children.length &&
                    this.top.children[this.index].matchesHack(nodeName)
                ) {
                    this.index++;
                } else {
                    var dom = document.createElement(nodeName);
                    if (nodeName == "IMG") {
                        dom.className = "ProseMirror-separator";
                    }
                    if (nodeName == "BR") {
                        dom.className = "ProseMirror-trailingBreak";
                    }
                    this.top.children.splice(
                        this.index++,
                        0,
                        new TrailingHackViewDesc(this.top, nothing, dom, null)
                    );
                    this.changed = true;
                }
            };

            // : (Fragment, [ViewDesc]) → {index: number, matched: Map<ViewDesc, number>}
            // Iterate from the end of the fragment and array of descs to find
            // directly matching ones, in order to avoid overeagerly reusing those
            // for other nodes. Returns the fragment index of the first node that
            // is part of the sequence of matched nodes at the end of the
            // fragment.
            function preMatch(frag, descs) {
                var fI = frag.childCount,
                    dI = descs.length,
                    matched = new Map();
                for (; fI > 0 && dI > 0; dI--) {
                    var desc = descs[dI - 1],
                        node = desc.node;
                    if (!node) {
                        continue;
                    }
                    if (node != frag.child(fI - 1)) {
                        break;
                    }
                    --fI;
                    matched.set(desc, fI);
                }
                return { index: fI, matched: matched };
            }

            function compareSide(a, b) {
                return a.type.side - b.type.side;
            }

            // : (ViewDesc, DecorationSource, (Decoration, number), (Node, [Decoration], DecorationSource, number))
            // This function abstracts iterating over the nodes and decorations in
            // a fragment. Calls `onNode` for each node, with its local and child
            // decorations. Splits text nodes when there is a decoration starting
            // or ending inside of them. Calls `onWidget` for each widget.
            function iterDeco(parent, deco, onWidget, onNode) {
                var locals = deco.locals(parent),
                    offset = 0;
                // Simple, cheap variant for when there are no local decorations
                if (locals.length == 0) {
                    for (var i = 0; i < parent.childCount; i++) {
                        var child = parent.child(i);
                        onNode(child, locals, deco.forChild(offset, child), i);
                        offset += child.nodeSize;
                    }
                    return;
                }

                var decoIndex = 0,
                    active = [],
                    restNode = null;
                for (var parentIndex = 0; ; ) {
                    if (
                        decoIndex < locals.length &&
                        locals[decoIndex].to == offset
                    ) {
                        var widget = locals[decoIndex++],
                            widgets = void 0;
                        while (
                            decoIndex < locals.length &&
                            locals[decoIndex].to == offset
                        ) {
                            (widgets || (widgets = [widget])).push(
                                locals[decoIndex++]
                            );
                        }
                        if (widgets) {
                            widgets.sort(compareSide);
                            for (var i$1 = 0; i$1 < widgets.length; i$1++) {
                                onWidget(widgets[i$1], parentIndex, !!restNode);
                            }
                        } else {
                            onWidget(widget, parentIndex, !!restNode);
                        }
                    }

                    var child$1 = void 0,
                        index = void 0;
                    if (restNode) {
                        index = -1;
                        child$1 = restNode;
                        restNode = null;
                    } else if (parentIndex < parent.childCount) {
                        index = parentIndex;
                        child$1 = parent.child(parentIndex++);
                    } else {
                        break;
                    }

                    for (var i$2 = 0; i$2 < active.length; i$2++) {
                        if (active[i$2].to <= offset) {
                            active.splice(i$2--, 1);
                        }
                    }
                    while (
                        decoIndex < locals.length &&
                        locals[decoIndex].from <= offset &&
                        locals[decoIndex].to > offset
                    ) {
                        active.push(locals[decoIndex++]);
                    }

                    var end = offset + child$1.nodeSize;
                    if (child$1.isText) {
                        var cutAt = end;
                        if (
                            decoIndex < locals.length &&
                            locals[decoIndex].from < cutAt
                        ) {
                            cutAt = locals[decoIndex].from;
                        }
                        for (var i$3 = 0; i$3 < active.length; i$3++) {
                            if (active[i$3].to < cutAt) {
                                cutAt = active[i$3].to;
                            }
                        }
                        if (cutAt < end) {
                            restNode = child$1.cut(cutAt - offset);
                            child$1 = child$1.cut(0, cutAt - offset);
                            end = cutAt;
                            index = -1;
                        }
                    }

                    var outerDeco = !active.length
                        ? nothing
                        : child$1.isInline && !child$1.isLeaf
                        ? active.filter(function (d) {
                              return !d.inline;
                          })
                        : active.slice();
                    onNode(
                        child$1,
                        outerDeco,
                        deco.forChild(offset, child$1),
                        index
                    );
                    offset = end;
                }
            }

            // List markers in Mobile Safari will mysteriously disappear
            // sometimes. This works around that.
            function iosHacks(dom) {
                if (dom.nodeName == "UL" || dom.nodeName == "OL") {
                    var oldCSS = dom.style.cssText;
                    dom.style.cssText =
                        oldCSS + "; list-style: square !important";
                    window.getComputedStyle(dom).listStyle;
                    dom.style.cssText = oldCSS;
                }
            }

            function nearbyTextNode(node, offset) {
                for (;;) {
                    if (node.nodeType == 3) {
                        return node;
                    }
                    if (node.nodeType == 1 && offset > 0) {
                        if (
                            node.childNodes.length > offset &&
                            node.childNodes[offset].nodeType == 3
                        ) {
                            return node.childNodes[offset];
                        }
                        node = node.childNodes[offset - 1];
                        offset = nodeSize(node);
                    } else if (
                        node.nodeType == 1 &&
                        offset < node.childNodes.length
                    ) {
                        node = node.childNodes[offset];
                        offset = 0;
                    } else {
                        return null;
                    }
                }
            }

            // Find a piece of text in an inline fragment, overlapping from-to
            function findTextInFragment(frag, text, from, to) {
                for (var i = 0, pos = 0; i < frag.childCount && pos <= to; ) {
                    var child = frag.child(i++),
                        childStart = pos;
                    pos += child.nodeSize;
                    if (!child.isText) {
                        continue;
                    }
                    var str = child.text;
                    while (i < frag.childCount) {
                        var next = frag.child(i++);
                        pos += next.nodeSize;
                        if (!next.isText) {
                            break;
                        }
                        str += next.text;
                    }
                    if (pos >= from) {
                        var found = str.lastIndexOf(text, to - childStart);
                        if (
                            found >= 0 &&
                            found + text.length + childStart >= from
                        ) {
                            return childStart + found;
                        }
                    }
                }
                return -1;
            }

            // Replace range from-to in an array of view descs with replacement
            // (may be null to just delete). This goes very much against the grain
            // of the rest of this code, which tends to create nodes with the
            // right shape in one go, rather than messing with them after
            // creation, but is necessary in the composition hack.
            function replaceNodes(nodes, from, to, view, replacement) {
                var result = [];
                for (var i = 0, off = 0; i < nodes.length; i++) {
                    var child = nodes[i],
                        start = off,
                        end = (off += child.size);
                    if (start >= to || end <= from) {
                        result.push(child);
                    } else {
                        if (start < from) {
                            result.push(child.slice(0, from - start, view));
                        }
                        if (replacement) {
                            result.push(replacement);
                            replacement = null;
                        }
                        if (end > to) {
                            result.push(
                                child.slice(to - start, child.size, view)
                            );
                        }
                    }
                }
                return result;
            }

            function selectionFromDOM(view, origin) {
                var domSel = view.root.getSelection(),
                    doc = view.state.doc;
                if (!domSel.focusNode) {
                    return null;
                }
                var nearestDesc = view.docView.nearestDesc(domSel.focusNode),
                    inWidget = nearestDesc && nearestDesc.size == 0;
                var head = view.docView.posFromDOM(
                    domSel.focusNode,
                    domSel.focusOffset
                );
                if (head < 0) {
                    return null;
                }
                var $head = doc.resolve(head),
                    $anchor,
                    selection;
                if (selectionCollapsed(domSel)) {
                    $anchor = $head;
                    while (nearestDesc && !nearestDesc.node) {
                        nearestDesc = nearestDesc.parent;
                    }
                    if (
                        nearestDesc &&
                        nearestDesc.node.isAtom &&
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(
                            nearestDesc.node
                        ) &&
                        nearestDesc.parent &&
                        !(
                            nearestDesc.node.isInline &&
                            isOnEdge(
                                domSel.focusNode,
                                domSel.focusOffset,
                                nearestDesc.dom
                            )
                        )
                    ) {
                        var pos = nearestDesc.posBefore;
                        selection =
                            new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection(
                                head == pos ? $head : doc.resolve(pos)
                            );
                    }
                } else {
                    var anchor = view.docView.posFromDOM(
                        domSel.anchorNode,
                        domSel.anchorOffset
                    );
                    if (anchor < 0) {
                        return null;
                    }
                    $anchor = doc.resolve(anchor);
                }

                if (!selection) {
                    var bias =
                        origin == "pointer" ||
                        (view.state.selection.head < $head.pos && !inWidget)
                            ? 1
                            : -1;
                    selection = selectionBetween(view, $anchor, $head, bias);
                }
                return selection;
            }

            function editorOwnsSelection(view) {
                return view.editable
                    ? view.hasFocus()
                    : hasSelection(view) &&
                          document.activeElement &&
                          document.activeElement.contains(view.dom);
            }

            function selectionToDOM(view, force) {
                var sel = view.state.selection;
                syncNodeSelection(view, sel);

                if (!editorOwnsSelection(view)) {
                    return;
                }

                if (!force && view.mouseDown && view.mouseDown.allowDefault) {
                    view.mouseDown.delayedSelectionSync = true;
                    view.domObserver.setCurSelection();
                    return;
                }

                view.domObserver.disconnectSelection();

                if (view.cursorWrapper) {
                    selectCursorWrapper(view);
                } else {
                    var anchor = sel.anchor;
                    var head = sel.head;
                    var resetEditableFrom, resetEditableTo;
                    if (
                        brokenSelectBetweenUneditable &&
                        !(
                            sel instanceof
                            prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection
                        )
                    ) {
                        if (!sel.$from.parent.inlineContent) {
                            resetEditableFrom = temporarilyEditableNear(
                                view,
                                sel.from
                            );
                        }
                        if (!sel.empty && !sel.$from.parent.inlineContent) {
                            resetEditableTo = temporarilyEditableNear(
                                view,
                                sel.to
                            );
                        }
                    }
                    view.docView.setSelection(anchor, head, view.root, force);
                    if (brokenSelectBetweenUneditable) {
                        if (resetEditableFrom) {
                            resetEditable(resetEditableFrom);
                        }
                        if (resetEditableTo) {
                            resetEditable(resetEditableTo);
                        }
                    }
                    if (sel.visible) {
                        view.dom.classList.remove("ProseMirror-hideselection");
                    } else {
                        view.dom.classList.add("ProseMirror-hideselection");
                        if ("onselectionchange" in document) {
                            removeClassOnSelectionChange(view);
                        }
                    }
                }

                view.domObserver.setCurSelection();
                view.domObserver.connectSelection();
            }

            // Kludge to work around Webkit not allowing a selection to start/end
            // between non-editable block nodes. We briefly make something
            // editable, set the selection, then set it uneditable again.

            var brokenSelectBetweenUneditable =
                result.safari || (result.chrome && result.chrome_version < 63);

            function temporarilyEditableNear(view, pos) {
                var ref = view.docView.domFromPos(pos, 0);
                var node = ref.node;
                var offset = ref.offset;
                var after =
                    offset < node.childNodes.length
                        ? node.childNodes[offset]
                        : null;
                var before = offset ? node.childNodes[offset - 1] : null;
                if (
                    result.safari &&
                    after &&
                    after.contentEditable == "false"
                ) {
                    return setEditable(after);
                }
                if (
                    (!after || after.contentEditable == "false") &&
                    (!before || before.contentEditable == "false")
                ) {
                    if (after) {
                        return setEditable(after);
                    } else if (before) {
                        return setEditable(before);
                    }
                }
            }

            function setEditable(element) {
                element.contentEditable = "true";
                if (result.safari && element.draggable) {
                    element.draggable = false;
                    element.wasDraggable = true;
                }
                return element;
            }

            function resetEditable(element) {
                element.contentEditable = "false";
                if (element.wasDraggable) {
                    element.draggable = true;
                    element.wasDraggable = null;
                }
            }

            function removeClassOnSelectionChange(view) {
                var doc = view.dom.ownerDocument;
                doc.removeEventListener(
                    "selectionchange",
                    view.hideSelectionGuard
                );
                var domSel = view.root.getSelection();
                var node = domSel.anchorNode,
                    offset = domSel.anchorOffset;
                doc.addEventListener(
                    "selectionchange",
                    (view.hideSelectionGuard = function () {
                        if (
                            domSel.anchorNode != node ||
                            domSel.anchorOffset != offset
                        ) {
                            doc.removeEventListener(
                                "selectionchange",
                                view.hideSelectionGuard
                            );
                            setTimeout(function () {
                                if (
                                    !editorOwnsSelection(view) ||
                                    view.state.selection.visible
                                ) {
                                    view.dom.classList.remove(
                                        "ProseMirror-hideselection"
                                    );
                                }
                            }, 20);
                        }
                    })
                );
            }

            function selectCursorWrapper(view) {
                var domSel = view.root.getSelection(),
                    range = document.createRange();
                var node = view.cursorWrapper.dom,
                    img = node.nodeName == "IMG";
                if (img) {
                    range.setEnd(node.parentNode, domIndex(node) + 1);
                } else {
                    range.setEnd(node, 0);
                }
                range.collapse(false);
                domSel.removeAllRanges();
                domSel.addRange(range);
                // Kludge to kill 'control selection' in IE11 when selecting an
                // invisible cursor wrapper, since that would result in those weird
                // resize handles and a selection that considers the absolutely
                // positioned wrapper, rather than the root editable node, the
                // focused element.
                if (
                    !img &&
                    !view.state.selection.visible &&
                    result.ie &&
                    result.ie_version <= 11
                ) {
                    node.disabled = true;
                    node.disabled = false;
                }
            }

            function syncNodeSelection(view, sel) {
                if (
                    sel instanceof
                    prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection
                ) {
                    var desc = view.docView.descAt(sel.from);
                    if (desc != view.lastSelectedViewDesc) {
                        clearNodeSelection(view);
                        if (desc) {
                            desc.selectNode();
                        }
                        view.lastSelectedViewDesc = desc;
                    }
                } else {
                    clearNodeSelection(view);
                }
            }

            // Clear all DOM statefulness of the last node selection.
            function clearNodeSelection(view) {
                if (view.lastSelectedViewDesc) {
                    if (view.lastSelectedViewDesc.parent) {
                        view.lastSelectedViewDesc.deselectNode();
                    }
                    view.lastSelectedViewDesc = null;
                }
            }

            function selectionBetween(view, $anchor, $head, bias) {
                return (
                    view.someProp("createSelectionBetween", function (f) {
                        return f(view, $anchor, $head);
                    }) ||
                    prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection.between(
                        $anchor,
                        $head,
                        bias
                    )
                );
            }

            function hasFocusAndSelection(view) {
                if (view.editable && view.root.activeElement != view.dom) {
                    return false;
                }
                return hasSelection(view);
            }

            function hasSelection(view) {
                var sel = view.root.getSelection();
                if (!sel.anchorNode) {
                    return false;
                }
                try {
                    // Firefox will raise 'permission denied' errors when accessing
                    // properties of `sel.anchorNode` when it's in a generated CSS
                    // element.
                    return (
                        view.dom.contains(
                            sel.anchorNode.nodeType == 3
                                ? sel.anchorNode.parentNode
                                : sel.anchorNode
                        ) &&
                        (view.editable ||
                            view.dom.contains(
                                sel.focusNode.nodeType == 3
                                    ? sel.focusNode.parentNode
                                    : sel.focusNode
                            ))
                    );
                } catch (_) {
                    return false;
                }
            }

            function anchorInRightPlace(view) {
                var anchorDOM = view.docView.domFromPos(
                    view.state.selection.anchor,
                    0
                );
                var domSel = view.root.getSelection();
                return isEquivalentPosition(
                    anchorDOM.node,
                    anchorDOM.offset,
                    domSel.anchorNode,
                    domSel.anchorOffset
                );
            }

            function moveSelectionBlock(state, dir) {
                var ref = state.selection;
                var $anchor = ref.$anchor;
                var $head = ref.$head;
                var $side = dir > 0 ? $anchor.max($head) : $anchor.min($head);
                var $start = !$side.parent.inlineContent
                    ? $side
                    : $side.depth
                    ? state.doc.resolve(
                          dir > 0 ? $side.after() : $side.before()
                      )
                    : null;
                return (
                    $start &&
                    prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.findFrom(
                        $start,
                        dir
                    )
                );
            }

            function apply(view, sel) {
                view.dispatch(view.state.tr.setSelection(sel).scrollIntoView());
                return true;
            }

            function selectHorizontally(view, dir, mods) {
                var sel = view.state.selection;
                if (
                    sel instanceof
                    prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection
                ) {
                    if (!sel.empty || mods.indexOf("s") > -1) {
                        return false;
                    } else if (
                        view.endOfTextblock(dir > 0 ? "right" : "left")
                    ) {
                        var next = moveSelectionBlock(view.state, dir);
                        if (
                            next &&
                            next instanceof
                                prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection
                        ) {
                            return apply(view, next);
                        }
                        return false;
                    } else if (!(result.mac && mods.indexOf("m") > -1)) {
                        var $head = sel.$head,
                            node = $head.textOffset
                                ? null
                                : dir < 0
                                ? $head.nodeBefore
                                : $head.nodeAfter,
                            desc;
                        if (!node || node.isText) {
                            return false;
                        }
                        var nodePos =
                            dir < 0 ? $head.pos - node.nodeSize : $head.pos;
                        if (
                            !(
                                node.isAtom ||
                                ((desc = view.docView.descAt(nodePos)) &&
                                    !desc.contentDOM)
                            )
                        ) {
                            return false;
                        }
                        if (
                            prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(
                                node
                            )
                        ) {
                            return apply(
                                view,
                                new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection(
                                    dir < 0
                                        ? view.state.doc.resolve(
                                              $head.pos - node.nodeSize
                                          )
                                        : $head
                                )
                            );
                        } else if (result.webkit) {
                            // Chrome and Safari will introduce extra pointless cursor
                            // positions around inline uneditable nodes, so we have to
                            // take over and move the cursor past them (#937)
                            return apply(
                                view,
                                new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection(
                                    view.state.doc.resolve(
                                        dir < 0
                                            ? nodePos
                                            : nodePos + node.nodeSize
                                    )
                                )
                            );
                        } else {
                            return false;
                        }
                    }
                } else if (
                    sel instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection &&
                    sel.node.isInline
                ) {
                    return apply(
                        view,
                        new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection(
                            dir > 0 ? sel.$to : sel.$from
                        )
                    );
                } else {
                    var next$1 = moveSelectionBlock(view.state, dir);
                    if (next$1) {
                        return apply(view, next$1);
                    }
                    return false;
                }
            }

            function nodeLen(node) {
                return node.nodeType == 3
                    ? node.nodeValue.length
                    : node.childNodes.length;
            }

            function isIgnorable(dom) {
                var desc = dom.pmViewDesc;
                return (
                    desc &&
                    desc.size == 0 &&
                    (dom.nextSibling || dom.nodeName != "BR")
                );
            }

            // Make sure the cursor isn't directly after one or more ignored
            // nodes, which will confuse the browser's cursor motion logic.
            function skipIgnoredNodesLeft(view) {
                var sel = view.root.getSelection();
                var node = sel.focusNode,
                    offset = sel.focusOffset;
                if (!node) {
                    return;
                }
                var moveNode,
                    moveOffset,
                    force = false;
                // Gecko will do odd things when the selection is directly in front
                // of a non-editable node, so in that case, move it into the next
                // node if possible. Issue prosemirror/prosemirror#832.
                if (
                    result.gecko &&
                    node.nodeType == 1 &&
                    offset < nodeLen(node) &&
                    isIgnorable(node.childNodes[offset])
                ) {
                    force = true;
                }
                for (;;) {
                    if (offset > 0) {
                        if (node.nodeType != 1) {
                            break;
                        } else {
                            var before = node.childNodes[offset - 1];
                            if (isIgnorable(before)) {
                                moveNode = node;
                                moveOffset = --offset;
                            } else if (before.nodeType == 3) {
                                node = before;
                                offset = node.nodeValue.length;
                            } else {
                                break;
                            }
                        }
                    } else if (isBlockNode(node)) {
                        break;
                    } else {
                        var prev = node.previousSibling;
                        while (prev && isIgnorable(prev)) {
                            moveNode = node.parentNode;
                            moveOffset = domIndex(prev);
                            prev = prev.previousSibling;
                        }
                        if (!prev) {
                            node = node.parentNode;
                            if (node == view.dom) {
                                break;
                            }
                            offset = 0;
                        } else {
                            node = prev;
                            offset = nodeLen(node);
                        }
                    }
                }
                if (force) {
                    setSelFocus(view, sel, node, offset);
                } else if (moveNode) {
                    setSelFocus(view, sel, moveNode, moveOffset);
                }
            }

            // Make sure the cursor isn't directly before one or more ignored
            // nodes.
            function skipIgnoredNodesRight(view) {
                var sel = view.root.getSelection();
                var node = sel.focusNode,
                    offset = sel.focusOffset;
                if (!node) {
                    return;
                }
                var len = nodeLen(node);
                var moveNode, moveOffset;
                for (;;) {
                    if (offset < len) {
                        if (node.nodeType != 1) {
                            break;
                        }
                        var after = node.childNodes[offset];
                        if (isIgnorable(after)) {
                            moveNode = node;
                            moveOffset = ++offset;
                        } else {
                            break;
                        }
                    } else if (isBlockNode(node)) {
                        break;
                    } else {
                        var next = node.nextSibling;
                        while (next && isIgnorable(next)) {
                            moveNode = next.parentNode;
                            moveOffset = domIndex(next) + 1;
                            next = next.nextSibling;
                        }
                        if (!next) {
                            node = node.parentNode;
                            if (node == view.dom) {
                                break;
                            }
                            offset = len = 0;
                        } else {
                            node = next;
                            offset = 0;
                            len = nodeLen(node);
                        }
                    }
                }
                if (moveNode) {
                    setSelFocus(view, sel, moveNode, moveOffset);
                }
            }

            function isBlockNode(dom) {
                var desc = dom.pmViewDesc;
                return desc && desc.node && desc.node.isBlock;
            }

            function setSelFocus(view, sel, node, offset) {
                if (selectionCollapsed(sel)) {
                    var range = document.createRange();
                    range.setEnd(node, offset);
                    range.setStart(node, offset);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (sel.extend) {
                    sel.extend(node, offset);
                }
                view.domObserver.setCurSelection();
                var state = view.state;
                // If no state update ends up happening, reset the selection.
                setTimeout(function () {
                    if (view.state == state) {
                        selectionToDOM(view);
                    }
                }, 50);
            }

            // : (EditorState, number)
            // Check whether vertical selection motion would involve node
            // selections. If so, apply it (if not, the result is left to the
            // browser)
            function selectVertically(view, dir, mods) {
                var sel = view.state.selection;
                if (
                    (sel instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection &&
                        !sel.empty) ||
                    mods.indexOf("s") > -1
                ) {
                    return false;
                }
                if (result.mac && mods.indexOf("m") > -1) {
                    return false;
                }
                var $from = sel.$from;
                var $to = sel.$to;

                if (
                    !$from.parent.inlineContent ||
                    view.endOfTextblock(dir < 0 ? "up" : "down")
                ) {
                    var next = moveSelectionBlock(view.state, dir);
                    if (
                        next &&
                        next instanceof
                            prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection
                    ) {
                        return apply(view, next);
                    }
                }
                if (!$from.parent.inlineContent) {
                    var side = dir < 0 ? $from : $to;
                    var beyond =
                        sel instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.AllSelection
                            ? prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.near(
                                  side,
                                  dir
                              )
                            : prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.findFrom(
                                  side,
                                  dir
                              );
                    return beyond ? apply(view, beyond) : false;
                }
                return false;
            }

            function stopNativeHorizontalDelete(view, dir) {
                if (
                    !(
                        view.state.selection instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection
                    )
                ) {
                    return true;
                }
                var ref = view.state.selection;
                var $head = ref.$head;
                var $anchor = ref.$anchor;
                var empty = ref.empty;
                if (!$head.sameParent($anchor)) {
                    return true;
                }
                if (!empty) {
                    return false;
                }
                if (view.endOfTextblock(dir > 0 ? "forward" : "backward")) {
                    return true;
                }
                var nextNode =
                    !$head.textOffset &&
                    (dir < 0 ? $head.nodeBefore : $head.nodeAfter);
                if (nextNode && !nextNode.isText) {
                    var tr = view.state.tr;
                    if (dir < 0) {
                        tr.delete($head.pos - nextNode.nodeSize, $head.pos);
                    } else {
                        tr.delete($head.pos, $head.pos + nextNode.nodeSize);
                    }
                    view.dispatch(tr);
                    return true;
                }
                return false;
            }

            function switchEditable(view, node, state) {
                view.domObserver.stop();
                node.contentEditable = state;
                view.domObserver.start();
            }

            // Issue #867 / #1090 / https://bugs.chromium.org/p/chromium/issues/detail?id=903821
            // In which Safari (and at some point in the past, Chrome) does really
            // wrong things when the down arrow is pressed when the cursor is
            // directly at the start of a textblock and has an uneditable node
            // after it
            function safariDownArrowBug(view) {
                if (
                    !result.safari ||
                    view.state.selection.$head.parentOffset > 0
                ) {
                    return;
                }
                var ref = view.root.getSelection();
                var focusNode = ref.focusNode;
                var focusOffset = ref.focusOffset;
                if (
                    focusNode &&
                    focusNode.nodeType == 1 &&
                    focusOffset == 0 &&
                    focusNode.firstChild &&
                    focusNode.firstChild.contentEditable == "false"
                ) {
                    var child = focusNode.firstChild;
                    switchEditable(view, child, true);
                    setTimeout(function () {
                        return switchEditable(view, child, false);
                    }, 20);
                }
            }

            // A backdrop key mapping used to make sure we always suppress keys
            // that have a dangerous default effect, even if the commands they are
            // bound to return false, and to make sure that cursor-motion keys
            // find a cursor (as opposed to a node selection) when pressed. For
            // cursor-motion keys, the code in the handlers also takes care of
            // block selections.

            function getMods(event) {
                var result = "";
                if (event.ctrlKey) {
                    result += "c";
                }
                if (event.metaKey) {
                    result += "m";
                }
                if (event.altKey) {
                    result += "a";
                }
                if (event.shiftKey) {
                    result += "s";
                }
                return result;
            }

            function captureKeyDown(view, event) {
                var code = event.keyCode,
                    mods = getMods(event);
                if (code == 8 || (result.mac && code == 72 && mods == "c")) {
                    // Backspace, Ctrl-h on Mac
                    return (
                        stopNativeHorizontalDelete(view, -1) ||
                        skipIgnoredNodesLeft(view)
                    );
                } else if (
                    code == 46 ||
                    (result.mac && code == 68 && mods == "c")
                ) {
                    // Delete, Ctrl-d on Mac
                    return (
                        stopNativeHorizontalDelete(view, 1) ||
                        skipIgnoredNodesRight(view)
                    );
                } else if (code == 13 || code == 27) {
                    // Enter, Esc
                    return true;
                } else if (code == 37) {
                    // Left arrow
                    return (
                        selectHorizontally(view, -1, mods) ||
                        skipIgnoredNodesLeft(view)
                    );
                } else if (code == 39) {
                    // Right arrow
                    return (
                        selectHorizontally(view, 1, mods) ||
                        skipIgnoredNodesRight(view)
                    );
                } else if (code == 38) {
                    // Up arrow
                    return (
                        selectVertically(view, -1, mods) ||
                        skipIgnoredNodesLeft(view)
                    );
                } else if (code == 40) {
                    // Down arrow
                    return (
                        safariDownArrowBug(view) ||
                        selectVertically(view, 1, mods) ||
                        skipIgnoredNodesRight(view)
                    );
                } else if (
                    mods == (result.mac ? "m" : "c") &&
                    (code == 66 || code == 73 || code == 89 || code == 90)
                ) {
                    // Mod-[biyz]
                    return true;
                }
                return false;
            }

            // Note that all referencing and parsing is done with the
            // start-of-operation selection and document, since that's the one
            // that the DOM represents. If any changes came in in the meantime,
            // the modification is mapped over those before it is applied, in
            // readDOMChange.

            function parseBetween(view, from_, to_) {
                var ref = view.docView.parseRange(from_, to_);
                var parent = ref.node;
                var fromOffset = ref.fromOffset;
                var toOffset = ref.toOffset;
                var from = ref.from;
                var to = ref.to;

                var domSel = view.root.getSelection(),
                    find = null,
                    anchor = domSel.anchorNode;
                if (
                    anchor &&
                    view.dom.contains(
                        anchor.nodeType == 1 ? anchor : anchor.parentNode
                    )
                ) {
                    find = [{ node: anchor, offset: domSel.anchorOffset }];
                    if (!selectionCollapsed(domSel)) {
                        find.push({
                            node: domSel.focusNode,
                            offset: domSel.focusOffset,
                        });
                    }
                }
                // Work around issue in Chrome where backspacing sometimes replaces
                // the deleted content with a random BR node (issues #799, #831)
                if (result.chrome && view.lastKeyCode === 8) {
                    for (var off = toOffset; off > fromOffset; off--) {
                        var node = parent.childNodes[off - 1],
                            desc = node.pmViewDesc;
                        if (node.nodeName == "BR" && !desc) {
                            toOffset = off;
                            break;
                        }
                        if (!desc || desc.size) {
                            break;
                        }
                    }
                }
                var startDoc = view.state.doc;
                var parser =
                    view.someProp("domParser") ||
                    prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMParser.fromSchema(
                        view.state.schema
                    );
                var $from = startDoc.resolve(from);

                var sel = null,
                    doc = parser.parse(parent, {
                        topNode: $from.parent,
                        topMatch: $from.parent.contentMatchAt($from.index()),
                        topOpen: true,
                        from: fromOffset,
                        to: toOffset,
                        preserveWhitespace: $from.parent.type.spec.code
                            ? "full"
                            : true,
                        editableContent: true,
                        findPositions: find,
                        ruleFromNode: ruleFromNode,
                        context: $from,
                    });
                if (find && find[0].pos != null) {
                    var anchor$1 = find[0].pos,
                        head = find[1] && find[1].pos;
                    if (head == null) {
                        head = anchor$1;
                    }
                    sel = { anchor: anchor$1 + from, head: head + from };
                }
                return { doc: doc, sel: sel, from: from, to: to };
            }

            function ruleFromNode(dom) {
                var desc = dom.pmViewDesc;
                if (desc) {
                    return desc.parseRule();
                } else if (dom.nodeName == "BR" && dom.parentNode) {
                    // Safari replaces the list item or table cell with a BR
                    // directly in the list node (?!) if you delete the last
                    // character in a list item or table cell (#708, #862)
                    if (
                        result.safari &&
                        /^(ul|ol)$/i.test(dom.parentNode.nodeName)
                    ) {
                        var skip = document.createElement("div");
                        skip.appendChild(document.createElement("li"));
                        return { skip: skip };
                    } else if (
                        dom.parentNode.lastChild == dom ||
                        (result.safari &&
                            /^(tr|table)$/i.test(dom.parentNode.nodeName))
                    ) {
                        return { ignore: true };
                    }
                } else if (
                    dom.nodeName == "IMG" &&
                    dom.getAttribute("mark-placeholder")
                ) {
                    return { ignore: true };
                }
            }

            function readDOMChange(view, from, to, typeOver, addedNodes) {
                if (from < 0) {
                    var origin =
                        view.lastSelectionTime > Date.now() - 50
                            ? view.lastSelectionOrigin
                            : null;
                    var newSel = selectionFromDOM(view, origin);
                    if (newSel && !view.state.selection.eq(newSel)) {
                        var tr$1 = view.state.tr.setSelection(newSel);
                        if (origin == "pointer") {
                            tr$1.setMeta("pointer", true);
                        } else if (origin == "key") {
                            tr$1.scrollIntoView();
                        }
                        view.dispatch(tr$1);
                    }
                    return;
                }

                var $before = view.state.doc.resolve(from);
                var shared = $before.sharedDepth(to);
                from = $before.before(shared + 1);
                to = view.state.doc.resolve(to).after(shared + 1);

                var sel = view.state.selection;
                var parse = parseBetween(view, from, to);
                // Chrome sometimes leaves the cursor before the inserted text when
                // composing after a cursor wrapper. This moves it forward.
                if (
                    result.chrome &&
                    view.cursorWrapper &&
                    parse.sel &&
                    parse.sel.anchor == view.cursorWrapper.deco.from
                ) {
                    var text = view.cursorWrapper.deco.type.toDOM.nextSibling;
                    var size =
                        text && text.nodeValue ? text.nodeValue.length : 1;
                    parse.sel = {
                        anchor: parse.sel.anchor + size,
                        head: parse.sel.anchor + size,
                    };
                }

                var doc = view.state.doc,
                    compare = doc.slice(parse.from, parse.to);
                var preferredPos, preferredSide;
                // Prefer anchoring to end when Backspace is pressed
                if (
                    view.lastKeyCode === 8 &&
                    Date.now() - 100 < view.lastKeyCodeTime
                ) {
                    preferredPos = view.state.selection.to;
                    preferredSide = "end";
                } else {
                    preferredPos = view.state.selection.from;
                    preferredSide = "start";
                }
                view.lastKeyCode = null;

                var change = findDiff(
                    compare.content,
                    parse.doc.content,
                    parse.from,
                    preferredPos,
                    preferredSide
                );
                if (!change) {
                    if (
                        typeOver &&
                        sel instanceof
                            prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection &&
                        !sel.empty &&
                        sel.$head.sameParent(sel.$anchor) &&
                        !view.composing &&
                        !(parse.sel && parse.sel.anchor != parse.sel.head)
                    ) {
                        change = {
                            start: sel.from,
                            endA: sel.to,
                            endB: sel.to,
                        };
                    } else if (
                        ((result.ios && view.lastIOSEnter > Date.now() - 225) ||
                            result.android) &&
                        addedNodes.some(function (n) {
                            return n.nodeName == "DIV" || n.nodeName == "P";
                        }) &&
                        view.someProp("handleKeyDown", function (f) {
                            return f(view, keyEvent(13, "Enter"));
                        })
                    ) {
                        view.lastIOSEnter = 0;
                        return;
                    } else {
                        if (parse.sel) {
                            var sel$1 = resolveSelection(
                                view,
                                view.state.doc,
                                parse.sel
                            );
                            if (sel$1 && !sel$1.eq(view.state.selection)) {
                                view.dispatch(
                                    view.state.tr.setSelection(sel$1)
                                );
                            }
                        }
                        return;
                    }
                }
                view.domChangeCount++;
                // Handle the case where overwriting a selection by typing matches
                // the start or end of the selected content, creating a change
                // that's smaller than what was actually overwritten.
                if (
                    view.state.selection.from < view.state.selection.to &&
                    change.start == change.endB &&
                    view.state.selection instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection
                ) {
                    if (
                        change.start > view.state.selection.from &&
                        change.start <= view.state.selection.from + 2
                    ) {
                        change.start = view.state.selection.from;
                    } else if (
                        change.endA < view.state.selection.to &&
                        change.endA >= view.state.selection.to - 2
                    ) {
                        change.endB += view.state.selection.to - change.endA;
                        change.endA = view.state.selection.to;
                    }
                }

                // IE11 will insert a non-breaking space _ahead_ of the space after
                // the cursor space when adding a space before another space. When
                // that happened, adjust the change to cover the space instead.
                if (
                    result.ie &&
                    result.ie_version <= 11 &&
                    change.endB == change.start + 1 &&
                    change.endA == change.start &&
                    change.start > parse.from &&
                    parse.doc.textBetween(
                        change.start - parse.from - 1,
                        change.start - parse.from + 1
                    ) == " \u00a0"
                ) {
                    change.start--;
                    change.endA--;
                    change.endB--;
                }

                var $from = parse.doc.resolveNoCache(change.start - parse.from);
                var $to = parse.doc.resolveNoCache(change.endB - parse.from);
                var inlineChange =
                    $from.sameParent($to) && $from.parent.inlineContent;
                var nextSel;
                // If this looks like the effect of pressing Enter (or was recorded
                // as being an iOS enter press), just dispatch an Enter key instead.
                if (
                    ((result.ios &&
                        view.lastIOSEnter > Date.now() - 225 &&
                        (!inlineChange ||
                            addedNodes.some(function (n) {
                                return n.nodeName == "DIV" || n.nodeName == "P";
                            }))) ||
                        (!inlineChange &&
                            $from.pos < parse.doc.content.size &&
                            (nextSel =
                                prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.findFrom(
                                    parse.doc.resolve($from.pos + 1),
                                    1,
                                    true
                                )) &&
                            nextSel.head == $to.pos)) &&
                    view.someProp("handleKeyDown", function (f) {
                        return f(view, keyEvent(13, "Enter"));
                    })
                ) {
                    view.lastIOSEnter = 0;
                    return;
                }
                // Same for backspace
                if (
                    view.state.selection.anchor > change.start &&
                    looksLikeJoin(doc, change.start, change.endA, $from, $to) &&
                    view.someProp("handleKeyDown", function (f) {
                        return f(view, keyEvent(8, "Backspace"));
                    })
                ) {
                    if (result.android && result.chrome) {
                        view.domObserver.suppressSelectionUpdates();
                    } // #820
                    return;
                }

                // Chrome Android will occasionally, during composition, delete the
                // entire composition and then immediately insert it again. This is
                // used to detect that situation.
                if (
                    result.chrome &&
                    result.android &&
                    change.toB == change.from
                ) {
                    view.lastAndroidDelete = Date.now();
                }

                // This tries to detect Android virtual keyboard
                // enter-and-pick-suggestion action. That sometimes (see issue
                // #1059) first fires a DOM mutation, before moving the selection to
                // the newly created block. And then, because ProseMirror cleans up
                // the DOM selection, it gives up moving the selection entirely,
                // leaving the cursor in the wrong place. When that happens, we drop
                // the new paragraph from the initial change, and fire a simulated
                // enter key afterwards.
                if (
                    result.android &&
                    !inlineChange &&
                    $from.start() != $to.start() &&
                    $to.parentOffset == 0 &&
                    $from.depth == $to.depth &&
                    parse.sel &&
                    parse.sel.anchor == parse.sel.head &&
                    parse.sel.head == change.endA
                ) {
                    change.endB -= 2;
                    $to = parse.doc.resolveNoCache(change.endB - parse.from);
                    setTimeout(function () {
                        view.someProp("handleKeyDown", function (f) {
                            return f(view, keyEvent(13, "Enter"));
                        });
                    }, 20);
                }

                var chFrom = change.start,
                    chTo = change.endA;

                var tr, storedMarks, markChange, $from1;
                if (inlineChange) {
                    if ($from.pos == $to.pos) {
                        // Deletion
                        // IE11 sometimes weirdly moves the DOM selection around after
                        // backspacing out the first element in a textblock
                        if (
                            result.ie &&
                            result.ie_version <= 11 &&
                            $from.parentOffset == 0
                        ) {
                            view.domObserver.suppressSelectionUpdates();
                            setTimeout(function () {
                                return selectionToDOM(view);
                            }, 20);
                        }
                        tr = view.state.tr.delete(chFrom, chTo);
                        storedMarks = doc
                            .resolve(change.start)
                            .marksAcross(doc.resolve(change.endA));
                    } else if (
                        // Adding or removing a mark
                        change.endA == change.endB &&
                        ($from1 = doc.resolve(change.start)) &&
                        (markChange = isMarkChange(
                            $from.parent.content.cut(
                                $from.parentOffset,
                                $to.parentOffset
                            ),
                            $from1.parent.content.cut(
                                $from1.parentOffset,
                                change.endA - $from1.start()
                            )
                        ))
                    ) {
                        tr = view.state.tr;
                        if (markChange.type == "add") {
                            tr.addMark(chFrom, chTo, markChange.mark);
                        } else {
                            tr.removeMark(chFrom, chTo, markChange.mark);
                        }
                    } else if (
                        $from.parent.child($from.index()).isText &&
                        $from.index() == $to.index() - ($to.textOffset ? 0 : 1)
                    ) {
                        // Both positions in the same text node -- simply insert text
                        var text$1 = $from.parent.textBetween(
                            $from.parentOffset,
                            $to.parentOffset
                        );
                        if (
                            view.someProp("handleTextInput", function (f) {
                                return f(view, chFrom, chTo, text$1);
                            })
                        ) {
                            return;
                        }
                        tr = view.state.tr.insertText(text$1, chFrom, chTo);
                    }
                }

                if (!tr) {
                    tr = view.state.tr.replace(
                        chFrom,
                        chTo,
                        parse.doc.slice(
                            change.start - parse.from,
                            change.endB - parse.from
                        )
                    );
                }
                if (parse.sel) {
                    var sel$2 = resolveSelection(view, tr.doc, parse.sel);
                    // Chrome Android will sometimes, during composition, report the
                    // selection in the wrong place. If it looks like that is
                    // happening, don't update the selection.
                    // Edge just doesn't move the cursor forward when you start typing
                    // in an empty block or between br nodes.
                    if (
                        sel$2 &&
                        !(
                            (result.chrome &&
                                result.android &&
                                view.composing &&
                                sel$2.empty &&
                                (change.start != change.endB ||
                                    view.lastAndroidDelete <
                                        Date.now() - 100) &&
                                (sel$2.head == chFrom ||
                                    sel$2.head == tr.mapping.map(chTo) - 1)) ||
                            (result.ie && sel$2.empty && sel$2.head == chFrom)
                        )
                    ) {
                        tr.setSelection(sel$2);
                    }
                }
                if (storedMarks) {
                    tr.ensureMarks(storedMarks);
                }
                view.dispatch(tr.scrollIntoView());
            }

            function resolveSelection(view, doc, parsedSel) {
                if (
                    Math.max(parsedSel.anchor, parsedSel.head) >
                    doc.content.size
                ) {
                    return null;
                }
                return selectionBetween(
                    view,
                    doc.resolve(parsedSel.anchor),
                    doc.resolve(parsedSel.head)
                );
            }

            // : (Fragment, Fragment) → ?{mark: Mark, type: string}
            // Given two same-length, non-empty fragments of inline content,
            // determine whether the first could be created from the second by
            // removing or adding a single mark type.
            function isMarkChange(cur, prev) {
                var curMarks = cur.firstChild.marks,
                    prevMarks = prev.firstChild.marks;
                var added = curMarks,
                    removed = prevMarks,
                    type,
                    mark,
                    update;
                for (var i = 0; i < prevMarks.length; i++) {
                    added = prevMarks[i].removeFromSet(added);
                }
                for (var i$1 = 0; i$1 < curMarks.length; i$1++) {
                    removed = curMarks[i$1].removeFromSet(removed);
                }
                if (added.length == 1 && removed.length == 0) {
                    mark = added[0];
                    type = "add";
                    update = function (node) {
                        return node.mark(mark.addToSet(node.marks));
                    };
                } else if (added.length == 0 && removed.length == 1) {
                    mark = removed[0];
                    type = "remove";
                    update = function (node) {
                        return node.mark(mark.removeFromSet(node.marks));
                    };
                } else {
                    return null;
                }
                var updated = [];
                for (var i$2 = 0; i$2 < prev.childCount; i$2++) {
                    updated.push(update(prev.child(i$2)));
                }
                if (
                    prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(
                        updated
                    ).eq(cur)
                ) {
                    return { mark: mark, type: type };
                }
            }

            function looksLikeJoin(old, start, end, $newStart, $newEnd) {
                if (
                    !$newStart.parent.isTextblock ||
                    // The content must have shrunk
                    end - start <= $newEnd.pos - $newStart.pos ||
                    // newEnd must point directly at or after the end of the block that newStart points into
                    skipClosingAndOpening($newStart, true, false) < $newEnd.pos
                ) {
                    return false;
                }

                var $start = old.resolve(start);
                // Start must be at the end of a block
                if (
                    $start.parentOffset < $start.parent.content.size ||
                    !$start.parent.isTextblock
                ) {
                    return false;
                }
                var $next = old.resolve(
                    skipClosingAndOpening($start, true, true)
                );
                // The next textblock must start before end and end near it
                if (
                    !$next.parent.isTextblock ||
                    $next.pos > end ||
                    skipClosingAndOpening($next, true, false) < end
                ) {
                    return false;
                }

                // The fragments after the join point must match
                return $newStart.parent.content
                    .cut($newStart.parentOffset)
                    .eq($next.parent.content);
            }

            function skipClosingAndOpening($pos, fromEnd, mayOpen) {
                var depth = $pos.depth,
                    end = fromEnd ? $pos.end() : $pos.pos;
                while (
                    depth > 0 &&
                    (fromEnd ||
                        $pos.indexAfter(depth) == $pos.node(depth).childCount)
                ) {
                    depth--;
                    end++;
                    fromEnd = false;
                }
                if (mayOpen) {
                    var next = $pos
                        .node(depth)
                        .maybeChild($pos.indexAfter(depth));
                    while (next && !next.isLeaf) {
                        next = next.firstChild;
                        end++;
                    }
                }
                return end;
            }

            function findDiff(a, b, pos, preferredPos, preferredSide) {
                var start = a.findDiffStart(b, pos);
                if (start == null) {
                    return null;
                }
                var ref = a.findDiffEnd(b, pos + a.size, pos + b.size);
                var endA = ref.a;
                var endB = ref.b;
                if (preferredSide == "end") {
                    var adjust = Math.max(0, start - Math.min(endA, endB));
                    preferredPos -= endA + adjust - start;
                }
                if (endA < start && a.size < b.size) {
                    var move =
                        preferredPos <= start && preferredPos >= endA
                            ? start - preferredPos
                            : 0;
                    start -= move;
                    endB = start + (endB - endA);
                    endA = start;
                } else if (endB < start) {
                    var move$1 =
                        preferredPos <= start && preferredPos >= endB
                            ? start - preferredPos
                            : 0;
                    start -= move$1;
                    endA = start + (endA - endB);
                    endB = start;
                }
                return { start: start, endA: endA, endB: endB };
            }

            function serializeForClipboard(view, slice) {
                var context = [];
                var content = slice.content;
                var openStart = slice.openStart;
                var openEnd = slice.openEnd;
                while (
                    openStart > 1 &&
                    openEnd > 1 &&
                    content.childCount == 1 &&
                    content.firstChild.childCount == 1
                ) {
                    openStart--;
                    openEnd--;
                    var node = content.firstChild;
                    context.push(
                        node.type.name,
                        node.attrs != node.type.defaultAttrs ? node.attrs : null
                    );
                    content = node.content;
                }

                var serializer =
                    view.someProp("clipboardSerializer") ||
                    prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMSerializer.fromSchema(
                        view.state.schema
                    );
                var doc = detachedDoc(),
                    wrap = doc.createElement("div");
                wrap.appendChild(
                    serializer.serializeFragment(content, { document: doc })
                );

                var firstChild = wrap.firstChild,
                    needsWrap;
                while (
                    firstChild &&
                    firstChild.nodeType == 1 &&
                    (needsWrap = wrapMap[firstChild.nodeName.toLowerCase()])
                ) {
                    for (var i = needsWrap.length - 1; i >= 0; i--) {
                        var wrapper = doc.createElement(needsWrap[i]);
                        while (wrap.firstChild) {
                            wrapper.appendChild(wrap.firstChild);
                        }
                        wrap.appendChild(wrapper);
                        if (needsWrap[i] != "tbody") {
                            openStart++;
                            openEnd++;
                        }
                    }
                    firstChild = wrap.firstChild;
                }

                if (firstChild && firstChild.nodeType == 1) {
                    firstChild.setAttribute(
                        "data-pm-slice",
                        openStart +
                            " " +
                            openEnd +
                            " " +
                            JSON.stringify(context)
                    );
                }

                var text =
                    view.someProp("clipboardTextSerializer", function (f) {
                        return f(slice);
                    }) ||
                    slice.content.textBetween(0, slice.content.size, "\n\n");

                return { dom: wrap, text: text };
            }

            // : (EditorView, string, string, ?bool, ResolvedPos) → ?Slice
            // Read a slice of content from the clipboard (or drop data).
            function parseFromClipboard(view, text, html, plainText, $context) {
                var dom,
                    inCode = $context.parent.type.spec.code,
                    slice;
                if (!html && !text) {
                    return null;
                }
                var asText = text && (plainText || inCode || !html);
                if (asText) {
                    view.someProp("transformPastedText", function (f) {
                        text = f(text, inCode || plainText);
                    });
                    if (inCode) {
                        return text
                            ? new prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice(
                                  prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(
                                      view.state.schema.text(
                                          text.replace(/\r\n?/g, "\n")
                                      )
                                  ),
                                  0,
                                  0
                              )
                            : prosemirror_model__WEBPACK_IMPORTED_MODULE_1__
                                  .Slice.empty;
                    }
                    var parsed = view.someProp(
                        "clipboardTextParser",
                        function (f) {
                            return f(text, $context, plainText);
                        }
                    );
                    if (parsed) {
                        slice = parsed;
                    } else {
                        var marks = $context.marks();
                        var ref = view.state;
                        var schema = ref.schema;
                        var serializer =
                            prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMSerializer.fromSchema(
                                schema
                            );
                        dom = document.createElement("div");
                        text.split(/(?:\r\n?|\n)+/).forEach(function (block) {
                            var p = dom.appendChild(
                                document.createElement("p")
                            );
                            if (block) {
                                p.appendChild(
                                    serializer.serializeNode(
                                        schema.text(block, marks)
                                    )
                                );
                            }
                        });
                    }
                } else {
                    view.someProp("transformPastedHTML", function (f) {
                        html = f(html);
                    });
                    dom = readHTML(html);
                    if (result.webkit) {
                        restoreReplacedSpaces(dom);
                    }
                }

                var contextNode = dom && dom.querySelector("[data-pm-slice]");
                var sliceData =
                    contextNode &&
                    /^(\d+) (\d+) (.*)/.exec(
                        contextNode.getAttribute("data-pm-slice")
                    );
                if (!slice) {
                    var parser =
                        view.someProp("clipboardParser") ||
                        view.someProp("domParser") ||
                        prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMParser.fromSchema(
                            view.state.schema
                        );
                    slice = parser.parseSlice(dom, {
                        preserveWhitespace: !!(asText || sliceData),
                        context: $context,
                    });
                }
                if (sliceData) {
                    slice = addContext(
                        closeSlice(slice, +sliceData[1], +sliceData[2]),
                        sliceData[3]
                    );
                } else {
                    // HTML wasn't created by ProseMirror. Make sure top-level siblings are coherent
                    slice =
                        prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice.maxOpen(
                            normalizeSiblings(slice.content, $context),
                            true
                        );
                    if (slice.openStart || slice.openEnd) {
                        var openStart = 0,
                            openEnd = 0;
                        for (
                            var node = slice.content.firstChild;
                            openStart < slice.openStart &&
                            !node.type.spec.isolating;
                            openStart++, node = node.firstChild
                        ) {}
                        for (
                            var node$1 = slice.content.lastChild;
                            openEnd < slice.openEnd &&
                            !node$1.type.spec.isolating;
                            openEnd++, node$1 = node$1.lastChild
                        ) {}
                        slice = closeSlice(slice, openStart, openEnd);
                    }
                }

                view.someProp("transformPasted", function (f) {
                    slice = f(slice);
                });
                return slice;
            }

            // Takes a slice parsed with parseSlice, which means there hasn't been
            // any content-expression checking done on the top nodes, tries to
            // find a parent node in the current context that might fit the nodes,
            // and if successful, rebuilds the slice so that it fits into that parent.
            //
            // This addresses the problem that Transform.replace expects a
            // coherent slice, and will fail to place a set of siblings that don't
            // fit anywhere in the schema.
            function normalizeSiblings(fragment, $context) {
                if (fragment.childCount < 2) {
                    return fragment;
                }
                var loop = function (d) {
                    var parent = $context.node(d);
                    var match = parent.contentMatchAt($context.index(d));
                    var lastWrap = void 0,
                        result = [];
                    fragment.forEach(function (node) {
                        if (!result) {
                            return;
                        }
                        var wrap = match.findWrapping(node.type),
                            inLast;
                        if (!wrap) {
                            return (result = null);
                        }
                        if (
                            (inLast =
                                result.length &&
                                lastWrap.length &&
                                addToSibling(
                                    wrap,
                                    lastWrap,
                                    node,
                                    result[result.length - 1],
                                    0
                                ))
                        ) {
                            result[result.length - 1] = inLast;
                        } else {
                            if (result.length) {
                                result[result.length - 1] = closeRight(
                                    result[result.length - 1],
                                    lastWrap.length
                                );
                            }
                            var wrapped = withWrappers(node, wrap);
                            result.push(wrapped);
                            match = match.matchType(
                                wrapped.type,
                                wrapped.attrs
                            );
                            lastWrap = wrap;
                        }
                    });
                    if (result) {
                        return {
                            v: prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(
                                result
                            ),
                        };
                    }
                };

                for (var d = $context.depth; d >= 0; d--) {
                    var returned = loop(d);

                    if (returned) return returned.v;
                }
                return fragment;
            }

            function withWrappers(node, wrap, from) {
                if (from === void 0) from = 0;

                for (var i = wrap.length - 1; i >= from; i--) {
                    node = wrap[i].create(
                        null,
                        prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(
                            node
                        )
                    );
                }
                return node;
            }

            // Used to group adjacent nodes wrapped in similar parents by
            // normalizeSiblings into the same parent node
            function addToSibling(wrap, lastWrap, node, sibling, depth) {
                if (
                    depth < wrap.length &&
                    depth < lastWrap.length &&
                    wrap[depth] == lastWrap[depth]
                ) {
                    var inner = addToSibling(
                        wrap,
                        lastWrap,
                        node,
                        sibling.lastChild,
                        depth + 1
                    );
                    if (inner) {
                        return sibling.copy(
                            sibling.content.replaceChild(
                                sibling.childCount - 1,
                                inner
                            )
                        );
                    }
                    var match = sibling.contentMatchAt(sibling.childCount);
                    if (
                        match.matchType(
                            depth == wrap.length - 1
                                ? node.type
                                : wrap[depth + 1]
                        )
                    ) {
                        return sibling.copy(
                            sibling.content.append(
                                prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(
                                    withWrappers(node, wrap, depth + 1)
                                )
                            )
                        );
                    }
                }
            }

            function closeRight(node, depth) {
                if (depth == 0) {
                    return node;
                }
                var fragment = node.content.replaceChild(
                    node.childCount - 1,
                    closeRight(node.lastChild, depth - 1)
                );
                var fill = node
                    .contentMatchAt(node.childCount)
                    .fillBefore(
                        prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment
                            .empty,
                        true
                    );
                return node.copy(fragment.append(fill));
            }

            function closeRange(fragment, side, from, to, depth, openEnd) {
                var node = side < 0 ? fragment.firstChild : fragment.lastChild,
                    inner = node.content;
                if (depth < to - 1) {
                    inner = closeRange(
                        inner,
                        side,
                        from,
                        to,
                        depth + 1,
                        openEnd
                    );
                }
                if (depth >= from) {
                    inner =
                        side < 0
                            ? node
                                  .contentMatchAt(0)
                                  .fillBefore(
                                      inner,
                                      fragment.childCount > 1 ||
                                          openEnd <= depth
                                  )
                                  .append(inner)
                            : inner.append(
                                  node
                                      .contentMatchAt(node.childCount)
                                      .fillBefore(
                                          prosemirror_model__WEBPACK_IMPORTED_MODULE_1__
                                              .Fragment.empty,
                                          true
                                      )
                              );
                }
                return fragment.replaceChild(
                    side < 0 ? 0 : fragment.childCount - 1,
                    node.copy(inner)
                );
            }

            function closeSlice(slice, openStart, openEnd) {
                if (openStart < slice.openStart) {
                    slice =
                        new prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice(
                            closeRange(
                                slice.content,
                                -1,
                                openStart,
                                slice.openStart,
                                0,
                                slice.openEnd
                            ),
                            openStart,
                            slice.openEnd
                        );
                }
                if (openEnd < slice.openEnd) {
                    slice =
                        new prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice(
                            closeRange(
                                slice.content,
                                1,
                                openEnd,
                                slice.openEnd,
                                0,
                                0
                            ),
                            slice.openStart,
                            openEnd
                        );
                }
                return slice;
            }

            // Trick from jQuery -- some elements must be wrapped in other
            // elements for innerHTML to work. I.e. if you do `div.innerHTML =
            // "<td>..</td>"` the table cells are ignored.
            var wrapMap = {
                thead: ["table"],
                tbody: ["table"],
                tfoot: ["table"],
                caption: ["table"],
                colgroup: ["table"],
                col: ["table", "colgroup"],
                tr: ["table", "tbody"],
                td: ["table", "tbody", "tr"],
                th: ["table", "tbody", "tr"],
            };

            var _detachedDoc = null;
            function detachedDoc() {
                return (
                    _detachedDoc ||
                    (_detachedDoc =
                        document.implementation.createHTMLDocument("title"))
                );
            }

            function readHTML(html) {
                var metas = /^(\s*<meta [^>]*>)*/.exec(html);
                if (metas) {
                    html = html.slice(metas[0].length);
                }
                var elt = detachedDoc().createElement("div");
                var firstTag = /<([a-z][^>\s]+)/i.exec(html),
                    wrap;
                if ((wrap = firstTag && wrapMap[firstTag[1].toLowerCase()])) {
                    html =
                        wrap
                            .map(function (n) {
                                return "<" + n + ">";
                            })
                            .join("") +
                        html +
                        wrap
                            .map(function (n) {
                                return "</" + n + ">";
                            })
                            .reverse()
                            .join("");
                }
                elt.innerHTML = html;
                if (wrap) {
                    for (var i = 0; i < wrap.length; i++) {
                        elt = elt.querySelector(wrap[i]) || elt;
                    }
                }
                return elt;
            }

            // Webkit browsers do some hard-to-predict replacement of regular
            // spaces with non-breaking spaces when putting content on the
            // clipboard. This tries to convert such non-breaking spaces (which
            // will be wrapped in a plain span on Chrome, a span with class
            // Apple-converted-space on Safari) back to regular spaces.
            function restoreReplacedSpaces(dom) {
                var nodes = dom.querySelectorAll(
                    result.chrome
                        ? "span:not([class]):not([style])"
                        : "span.Apple-converted-space"
                );
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    if (
                        node.childNodes.length == 1 &&
                        node.textContent == "\u00a0" &&
                        node.parentNode
                    ) {
                        node.parentNode.replaceChild(
                            dom.ownerDocument.createTextNode(" "),
                            node
                        );
                    }
                }
            }

            function addContext(slice, context) {
                if (!slice.size) {
                    return slice;
                }
                var schema = slice.content.firstChild.type.schema,
                    array;
                try {
                    array = JSON.parse(context);
                } catch (e) {
                    return slice;
                }
                var content = slice.content;
                var openStart = slice.openStart;
                var openEnd = slice.openEnd;
                for (var i = array.length - 2; i >= 0; i -= 2) {
                    var type = schema.nodes[array[i]];
                    if (!type || type.hasRequiredAttrs()) {
                        break;
                    }
                    content =
                        prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(
                            type.create(array[i + 1], content)
                        );
                    openStart++;
                    openEnd++;
                }
                return new prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice(
                    content,
                    openStart,
                    openEnd
                );
            }

            var observeOptions = {
                childList: true,
                characterData: true,
                characterDataOldValue: true,
                attributes: true,
                attributeOldValue: true,
                subtree: true,
            };
            // IE11 has very broken mutation observers, so we also listen to DOMCharacterDataModified
            var useCharData = result.ie && result.ie_version <= 11;

            var SelectionState = function SelectionState() {
                this.anchorNode =
                    this.anchorOffset =
                    this.focusNode =
                    this.focusOffset =
                        null;
            };

            SelectionState.prototype.set = function set(sel) {
                this.anchorNode = sel.anchorNode;
                this.anchorOffset = sel.anchorOffset;
                this.focusNode = sel.focusNode;
                this.focusOffset = sel.focusOffset;
            };

            SelectionState.prototype.eq = function eq(sel) {
                return (
                    sel.anchorNode == this.anchorNode &&
                    sel.anchorOffset == this.anchorOffset &&
                    sel.focusNode == this.focusNode &&
                    sel.focusOffset == this.focusOffset
                );
            };

            var DOMObserver = function DOMObserver(view, handleDOMChange) {
                var this$1 = this;

                this.view = view;
                this.handleDOMChange = handleDOMChange;
                this.queue = [];
                this.flushingSoon = -1;
                this.observer =
                    window.MutationObserver &&
                    new window.MutationObserver(function (mutations) {
                        for (var i = 0; i < mutations.length; i++) {
                            this$1.queue.push(mutations[i]);
                        }
                        // IE11 will sometimes (on backspacing out a single character
                        // text node after a BR node) call the observer callback
                        // before actually updating the DOM, which will cause
                        // ProseMirror to miss the change (see #930)
                        if (
                            result.ie &&
                            result.ie_version <= 11 &&
                            mutations.some(function (m) {
                                return (
                                    (m.type == "childList" &&
                                        m.removedNodes.length) ||
                                    (m.type == "characterData" &&
                                        m.oldValue.length >
                                            m.target.nodeValue.length)
                                );
                            })
                        ) {
                            this$1.flushSoon();
                        } else {
                            this$1.flush();
                        }
                    });
                this.currentSelection = new SelectionState();
                if (useCharData) {
                    this.onCharData = function (e) {
                        this$1.queue.push({
                            target: e.target,
                            type: "characterData",
                            oldValue: e.prevValue,
                        });
                        this$1.flushSoon();
                    };
                }
                this.onSelectionChange = this.onSelectionChange.bind(this);
                this.suppressingSelectionUpdates = false;
            };

            DOMObserver.prototype.flushSoon = function flushSoon() {
                var this$1 = this;

                if (this.flushingSoon < 0) {
                    this.flushingSoon = window.setTimeout(function () {
                        this$1.flushingSoon = -1;
                        this$1.flush();
                    }, 20);
                }
            };

            DOMObserver.prototype.forceFlush = function forceFlush() {
                if (this.flushingSoon > -1) {
                    window.clearTimeout(this.flushingSoon);
                    this.flushingSoon = -1;
                    this.flush();
                }
            };

            DOMObserver.prototype.start = function start() {
                if (this.observer) {
                    this.observer.observe(this.view.dom, observeOptions);
                }
                if (useCharData) {
                    this.view.dom.addEventListener(
                        "DOMCharacterDataModified",
                        this.onCharData
                    );
                }
                this.connectSelection();
            };

            DOMObserver.prototype.stop = function stop() {
                var this$1 = this;

                if (this.observer) {
                    var take = this.observer.takeRecords();
                    if (take.length) {
                        for (var i = 0; i < take.length; i++) {
                            this.queue.push(take[i]);
                        }
                        window.setTimeout(function () {
                            return this$1.flush();
                        }, 20);
                    }
                    this.observer.disconnect();
                }
                if (useCharData) {
                    this.view.dom.removeEventListener(
                        "DOMCharacterDataModified",
                        this.onCharData
                    );
                }
                this.disconnectSelection();
            };

            DOMObserver.prototype.connectSelection =
                function connectSelection() {
                    this.view.dom.ownerDocument.addEventListener(
                        "selectionchange",
                        this.onSelectionChange
                    );
                };

            DOMObserver.prototype.disconnectSelection =
                function disconnectSelection() {
                    this.view.dom.ownerDocument.removeEventListener(
                        "selectionchange",
                        this.onSelectionChange
                    );
                };

            DOMObserver.prototype.suppressSelectionUpdates =
                function suppressSelectionUpdates() {
                    var this$1 = this;

                    this.suppressingSelectionUpdates = true;
                    setTimeout(function () {
                        return (this$1.suppressingSelectionUpdates = false);
                    }, 50);
                };

            DOMObserver.prototype.onSelectionChange =
                function onSelectionChange() {
                    if (!hasFocusAndSelection(this.view)) {
                        return;
                    }
                    if (this.suppressingSelectionUpdates) {
                        return selectionToDOM(this.view);
                    }
                    // Deletions on IE11 fire their events in the wrong order, giving
                    // us a selection change event before the DOM changes are
                    // reported.
                    if (
                        result.ie &&
                        result.ie_version <= 11 &&
                        !this.view.state.selection.empty
                    ) {
                        var sel = this.view.root.getSelection();
                        // Selection.isCollapsed isn't reliable on IE
                        if (
                            sel.focusNode &&
                            isEquivalentPosition(
                                sel.focusNode,
                                sel.focusOffset,
                                sel.anchorNode,
                                sel.anchorOffset
                            )
                        ) {
                            return this.flushSoon();
                        }
                    }
                    this.flush();
                };

            DOMObserver.prototype.setCurSelection = function setCurSelection() {
                this.currentSelection.set(this.view.root.getSelection());
            };

            DOMObserver.prototype.ignoreSelectionChange =
                function ignoreSelectionChange(sel) {
                    if (sel.rangeCount == 0) {
                        return true;
                    }
                    var container = sel.getRangeAt(0).commonAncestorContainer;
                    var desc = this.view.docView.nearestDesc(container);
                    if (
                        desc &&
                        desc.ignoreMutation({
                            type: "selection",
                            target:
                                container.nodeType == 3
                                    ? container.parentNode
                                    : container,
                        })
                    ) {
                        this.setCurSelection();
                        return true;
                    }
                };

            DOMObserver.prototype.flush = function flush() {
                if (!this.view.docView || this.flushingSoon > -1) {
                    return;
                }
                var mutations = this.observer
                    ? this.observer.takeRecords()
                    : [];
                if (this.queue.length) {
                    mutations = this.queue.concat(mutations);
                    this.queue.length = 0;
                }

                var sel = this.view.root.getSelection();
                var newSel =
                    !this.suppressingSelectionUpdates &&
                    !this.currentSelection.eq(sel) &&
                    hasSelection(this.view) &&
                    !this.ignoreSelectionChange(sel);

                var from = -1,
                    to = -1,
                    typeOver = false,
                    added = [];
                if (this.view.editable) {
                    for (var i = 0; i < mutations.length; i++) {
                        var result$1 = this.registerMutation(
                            mutations[i],
                            added
                        );
                        if (result$1) {
                            from =
                                from < 0
                                    ? result$1.from
                                    : Math.min(result$1.from, from);
                            to =
                                to < 0
                                    ? result$1.to
                                    : Math.max(result$1.to, to);
                            if (result$1.typeOver) {
                                typeOver = true;
                            }
                        }
                    }
                }

                if (result.gecko && added.length > 1) {
                    var brs = added.filter(function (n) {
                        return n.nodeName == "BR";
                    });
                    if (brs.length == 2) {
                        var a = brs[0];
                        var b = brs[1];
                        if (
                            a.parentNode &&
                            a.parentNode.parentNode == b.parentNode
                        ) {
                            b.remove();
                        } else {
                            a.remove();
                        }
                    }
                }

                if (from > -1 || newSel) {
                    if (from > -1) {
                        this.view.docView.markDirty(from, to);
                        checkCSS(this.view);
                    }
                    this.handleDOMChange(from, to, typeOver, added);
                    if (this.view.docView.dirty) {
                        this.view.updateState(this.view.state);
                    } else if (!this.currentSelection.eq(sel)) {
                        selectionToDOM(this.view);
                    }
                    this.currentSelection.set(sel);
                }
            };

            DOMObserver.prototype.registerMutation = function registerMutation(
                mut,
                added
            ) {
                // Ignore mutations inside nodes that were already noted as inserted
                if (added.indexOf(mut.target) > -1) {
                    return null;
                }
                var desc = this.view.docView.nearestDesc(mut.target);
                if (
                    mut.type == "attributes" &&
                    (desc == this.view.docView ||
                        mut.attributeName == "contenteditable" ||
                        // Firefox sometimes fires spurious events for null/empty styles
                        (mut.attributeName == "style" &&
                            !mut.oldValue &&
                            !mut.target.getAttribute("style")))
                ) {
                    return null;
                }
                if (!desc || desc.ignoreMutation(mut)) {
                    return null;
                }

                if (mut.type == "childList") {
                    for (var i = 0; i < mut.addedNodes.length; i++) {
                        added.push(mut.addedNodes[i]);
                    }
                    if (
                        desc.contentDOM &&
                        desc.contentDOM != desc.dom &&
                        !desc.contentDOM.contains(mut.target)
                    ) {
                        return { from: desc.posBefore, to: desc.posAfter };
                    }
                    var prev = mut.previousSibling,
                        next = mut.nextSibling;
                    if (
                        result.ie &&
                        result.ie_version <= 11 &&
                        mut.addedNodes.length
                    ) {
                        // IE11 gives us incorrect next/prev siblings for some
                        // insertions, so if there are added nodes, recompute those
                        for (var i$1 = 0; i$1 < mut.addedNodes.length; i$1++) {
                            var ref = mut.addedNodes[i$1];
                            var previousSibling = ref.previousSibling;
                            var nextSibling = ref.nextSibling;
                            if (
                                !previousSibling ||
                                Array.prototype.indexOf.call(
                                    mut.addedNodes,
                                    previousSibling
                                ) < 0
                            ) {
                                prev = previousSibling;
                            }
                            if (
                                !nextSibling ||
                                Array.prototype.indexOf.call(
                                    mut.addedNodes,
                                    nextSibling
                                ) < 0
                            ) {
                                next = nextSibling;
                            }
                        }
                    }
                    var fromOffset =
                        prev && prev.parentNode == mut.target
                            ? domIndex(prev) + 1
                            : 0;
                    var from = desc.localPosFromDOM(mut.target, fromOffset, -1);
                    var toOffset =
                        next && next.parentNode == mut.target
                            ? domIndex(next)
                            : mut.target.childNodes.length;
                    var to = desc.localPosFromDOM(mut.target, toOffset, 1);
                    return { from: from, to: to };
                } else if (mut.type == "attributes") {
                    return {
                        from: desc.posAtStart - desc.border,
                        to: desc.posAtEnd + desc.border,
                    };
                } else {
                    // "characterData"
                    return {
                        from: desc.posAtStart,
                        to: desc.posAtEnd,
                        // An event was generated for a text change that didn't change
                        // any text. Mark the dom change to fall back to assuming the
                        // selection was typed over with an identical value if it can't
                        // find another change.
                        typeOver: mut.target.nodeValue == mut.oldValue,
                    };
                }
            };

            var cssChecked = false;

            function checkCSS(view) {
                if (cssChecked) {
                    return;
                }
                cssChecked = true;
                if (getComputedStyle(view.dom).whiteSpace == "normal") {
                    console["warn"](
                        "ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."
                    );
                }
            }

            // A collection of DOM events that occur within the editor, and callback functions
            // to invoke when the event fires.
            var handlers = {},
                editHandlers = {};

            function initInput(view) {
                view.shiftKey = false;
                view.mouseDown = null;
                view.lastKeyCode = null;
                view.lastKeyCodeTime = 0;
                view.lastClick = { time: 0, x: 0, y: 0, type: "" };
                view.lastSelectionOrigin = null;
                view.lastSelectionTime = 0;

                view.lastIOSEnter = 0;
                view.lastIOSEnterFallbackTimeout = null;
                view.lastAndroidDelete = 0;

                view.composing = false;
                view.composingTimeout = null;
                view.compositionNodes = [];
                view.compositionEndedAt = -2e8;

                view.domObserver = new DOMObserver(view, function (
                    from,
                    to,
                    typeOver,
                    added
                ) {
                    return readDOMChange(view, from, to, typeOver, added);
                });
                view.domObserver.start();
                // Used by hacks like the beforeinput handler to check whether anything happened in the DOM
                view.domChangeCount = 0;

                view.eventHandlers = Object.create(null);
                var loop = function (event) {
                    var handler = handlers[event];
                    view.dom.addEventListener(
                        event,
                        (view.eventHandlers[event] = function (event) {
                            if (
                                eventBelongsToView(view, event) &&
                                !runCustomHandler(view, event) &&
                                (view.editable || !(event.type in editHandlers))
                            ) {
                                handler(view, event);
                            }
                        })
                    );
                };

                for (var event in handlers) loop(event);
                // On Safari, for reasons beyond my understanding, adding an input
                // event handler makes an issue where the composition vanishes when
                // you press enter go away.
                if (result.safari) {
                    view.dom.addEventListener("input", function () {
                        return null;
                    });
                }

                ensureListeners(view);
            }

            function setSelectionOrigin(view, origin) {
                view.lastSelectionOrigin = origin;
                view.lastSelectionTime = Date.now();
            }

            function destroyInput(view) {
                view.domObserver.stop();
                for (var type in view.eventHandlers) {
                    view.dom.removeEventListener(
                        type,
                        view.eventHandlers[type]
                    );
                }
                clearTimeout(view.composingTimeout);
                clearTimeout(view.lastIOSEnterFallbackTimeout);
            }

            function ensureListeners(view) {
                view.someProp("handleDOMEvents", function (currentHandlers) {
                    for (var type in currentHandlers) {
                        if (!view.eventHandlers[type]) {
                            view.dom.addEventListener(
                                type,
                                (view.eventHandlers[type] = function (event) {
                                    return runCustomHandler(view, event);
                                })
                            );
                        }
                    }
                });
            }

            function runCustomHandler(view, event) {
                return view.someProp("handleDOMEvents", function (handlers) {
                    var handler = handlers[event.type];
                    return handler
                        ? handler(view, event) || event.defaultPrevented
                        : false;
                });
            }

            function eventBelongsToView(view, event) {
                if (!event.bubbles) {
                    return true;
                }
                if (event.defaultPrevented) {
                    return false;
                }
                for (
                    var node = event.target;
                    node != view.dom;
                    node = node.parentNode
                ) {
                    if (
                        !node ||
                        node.nodeType == 11 ||
                        (node.pmViewDesc && node.pmViewDesc.stopEvent(event))
                    ) {
                        return false;
                    }
                }
                return true;
            }

            function dispatchEvent(view, event) {
                if (
                    !runCustomHandler(view, event) &&
                    handlers[event.type] &&
                    (view.editable || !(event.type in editHandlers))
                ) {
                    handlers[event.type](view, event);
                }
            }

            editHandlers.keydown = function (view, event) {
                view.shiftKey = event.keyCode == 16 || event.shiftKey;
                if (inOrNearComposition(view, event)) {
                    return;
                }
                if (event.keyCode != 229) {
                    view.domObserver.forceFlush();
                }
                view.lastKeyCode = event.keyCode;
                view.lastKeyCodeTime = Date.now();
                // On iOS, if we preventDefault enter key presses, the virtual
                // keyboard gets confused. So the hack here is to set a flag that
                // makes the DOM change code recognize that what just happens should
                // be replaced by whatever the Enter key handlers do.
                if (
                    result.ios &&
                    event.keyCode == 13 &&
                    !event.ctrlKey &&
                    !event.altKey &&
                    !event.metaKey
                ) {
                    var now = Date.now();
                    view.lastIOSEnter = now;
                    view.lastIOSEnterFallbackTimeout = setTimeout(function () {
                        if (view.lastIOSEnter == now) {
                            view.someProp("handleKeyDown", function (f) {
                                return f(view, keyEvent(13, "Enter"));
                            });
                            view.lastIOSEnter = 0;
                        }
                    }, 200);
                } else if (
                    view.someProp("handleKeyDown", function (f) {
                        return f(view, event);
                    }) ||
                    captureKeyDown(view, event)
                ) {
                    event.preventDefault();
                } else {
                    setSelectionOrigin(view, "key");
                }
            };

            editHandlers.keyup = function (view, e) {
                if (e.keyCode == 16) {
                    view.shiftKey = false;
                }
            };

            editHandlers.keypress = function (view, event) {
                if (
                    inOrNearComposition(view, event) ||
                    !event.charCode ||
                    (event.ctrlKey && !event.altKey) ||
                    (result.mac && event.metaKey)
                ) {
                    return;
                }

                if (
                    view.someProp("handleKeyPress", function (f) {
                        return f(view, event);
                    })
                ) {
                    event.preventDefault();
                    return;
                }

                var sel = view.state.selection;
                if (
                    !(
                        sel instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection
                    ) ||
                    !sel.$from.sameParent(sel.$to)
                ) {
                    var text = String.fromCharCode(event.charCode);
                    if (
                        !view.someProp("handleTextInput", function (f) {
                            return f(view, sel.$from.pos, sel.$to.pos, text);
                        })
                    ) {
                        view.dispatch(
                            view.state.tr.insertText(text).scrollIntoView()
                        );
                    }
                    event.preventDefault();
                }
            };

            function eventCoords(event) {
                return { left: event.clientX, top: event.clientY };
            }

            function isNear(event, click) {
                var dx = click.x - event.clientX,
                    dy = click.y - event.clientY;
                return dx * dx + dy * dy < 100;
            }

            function runHandlerOnContext(view, propName, pos, inside, event) {
                if (inside == -1) {
                    return false;
                }
                var $pos = view.state.doc.resolve(inside);
                var loop = function (i) {
                    if (
                        view.someProp(propName, function (f) {
                            return i > $pos.depth
                                ? f(
                                      view,
                                      pos,
                                      $pos.nodeAfter,
                                      $pos.before(i),
                                      event,
                                      true
                                  )
                                : f(
                                      view,
                                      pos,
                                      $pos.node(i),
                                      $pos.before(i),
                                      event,
                                      false
                                  );
                        })
                    ) {
                        return { v: true };
                    }
                };

                for (var i = $pos.depth + 1; i > 0; i--) {
                    var returned = loop(i);

                    if (returned) return returned.v;
                }
                return false;
            }

            function updateSelection(view, selection, origin) {
                if (!view.focused) {
                    view.focus();
                }
                var tr = view.state.tr.setSelection(selection);
                if (origin == "pointer") {
                    tr.setMeta("pointer", true);
                }
                view.dispatch(tr);
            }

            function selectClickedLeaf(view, inside) {
                if (inside == -1) {
                    return false;
                }
                var $pos = view.state.doc.resolve(inside),
                    node = $pos.nodeAfter;
                if (
                    node &&
                    node.isAtom &&
                    prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(
                        node
                    )
                ) {
                    updateSelection(
                        view,
                        new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection(
                            $pos
                        ),
                        "pointer"
                    );
                    return true;
                }
                return false;
            }

            function selectClickedNode(view, inside) {
                if (inside == -1) {
                    return false;
                }
                var sel = view.state.selection,
                    selectedNode,
                    selectAt;
                if (
                    sel instanceof
                    prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection
                ) {
                    selectedNode = sel.node;
                }

                var $pos = view.state.doc.resolve(inside);
                for (var i = $pos.depth + 1; i > 0; i--) {
                    var node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
                    if (
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(
                            node
                        )
                    ) {
                        if (
                            selectedNode &&
                            sel.$from.depth > 0 &&
                            i >= sel.$from.depth &&
                            $pos.before(sel.$from.depth + 1) == sel.$from.pos
                        ) {
                            selectAt = $pos.before(sel.$from.depth);
                        } else {
                            selectAt = $pos.before(i);
                        }
                        break;
                    }
                }

                if (selectAt != null) {
                    updateSelection(
                        view,
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.create(
                            view.state.doc,
                            selectAt
                        ),
                        "pointer"
                    );
                    return true;
                } else {
                    return false;
                }
            }

            function handleSingleClick(view, pos, inside, event, selectNode) {
                return (
                    runHandlerOnContext(
                        view,
                        "handleClickOn",
                        pos,
                        inside,
                        event
                    ) ||
                    view.someProp("handleClick", function (f) {
                        return f(view, pos, event);
                    }) ||
                    (selectNode
                        ? selectClickedNode(view, inside)
                        : selectClickedLeaf(view, inside))
                );
            }

            function handleDoubleClick(view, pos, inside, event) {
                return (
                    runHandlerOnContext(
                        view,
                        "handleDoubleClickOn",
                        pos,
                        inside,
                        event
                    ) ||
                    view.someProp("handleDoubleClick", function (f) {
                        return f(view, pos, event);
                    })
                );
            }

            function handleTripleClick(view, pos, inside, event) {
                return (
                    runHandlerOnContext(
                        view,
                        "handleTripleClickOn",
                        pos,
                        inside,
                        event
                    ) ||
                    view.someProp("handleTripleClick", function (f) {
                        return f(view, pos, event);
                    }) ||
                    defaultTripleClick(view, inside, event)
                );
            }

            function defaultTripleClick(view, inside, event) {
                if (event.button != 0) {
                    return false;
                }
                var doc = view.state.doc;
                if (inside == -1) {
                    if (doc.inlineContent) {
                        updateSelection(
                            view,
                            prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection.create(
                                doc,
                                0,
                                doc.content.size
                            ),
                            "pointer"
                        );
                        return true;
                    }
                    return false;
                }

                var $pos = doc.resolve(inside);
                for (var i = $pos.depth + 1; i > 0; i--) {
                    var node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
                    var nodePos = $pos.before(i);
                    if (node.inlineContent) {
                        updateSelection(
                            view,
                            prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection.create(
                                doc,
                                nodePos + 1,
                                nodePos + 1 + node.content.size
                            ),
                            "pointer"
                        );
                    } else if (
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(
                            node
                        )
                    ) {
                        updateSelection(
                            view,
                            prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.create(
                                doc,
                                nodePos
                            ),
                            "pointer"
                        );
                    } else {
                        continue;
                    }
                    return true;
                }
            }

            function forceDOMFlush(view) {
                return endComposition(view);
            }

            var selectNodeModifier = result.mac ? "metaKey" : "ctrlKey";

            handlers.mousedown = function (view, event) {
                view.shiftKey = event.shiftKey;
                var flushed = forceDOMFlush(view);
                var now = Date.now(),
                    type = "singleClick";
                if (
                    now - view.lastClick.time < 500 &&
                    isNear(event, view.lastClick) &&
                    !event[selectNodeModifier]
                ) {
                    if (view.lastClick.type == "singleClick") {
                        type = "doubleClick";
                    } else if (view.lastClick.type == "doubleClick") {
                        type = "tripleClick";
                    }
                }
                view.lastClick = {
                    time: now,
                    x: event.clientX,
                    y: event.clientY,
                    type: type,
                };

                var pos = view.posAtCoords(eventCoords(event));
                if (!pos) {
                    return;
                }

                if (type == "singleClick") {
                    if (view.mouseDown) {
                        view.mouseDown.done();
                    }
                    view.mouseDown = new MouseDown(view, pos, event, flushed);
                } else if (
                    (type == "doubleClick"
                        ? handleDoubleClick
                        : handleTripleClick)(view, pos.pos, pos.inside, event)
                ) {
                    event.preventDefault();
                } else {
                    setSelectionOrigin(view, "pointer");
                }
            };

            var MouseDown = function MouseDown(view, pos, event, flushed) {
                var this$1 = this;

                this.view = view;
                this.startDoc = view.state.doc;
                this.pos = pos;
                this.event = event;
                this.flushed = flushed;
                this.selectNode = event[selectNodeModifier];
                this.allowDefault = event.shiftKey;
                this.delayedSelectionSync = false;

                var targetNode, targetPos;
                if (pos.inside > -1) {
                    targetNode = view.state.doc.nodeAt(pos.inside);
                    targetPos = pos.inside;
                } else {
                    var $pos = view.state.doc.resolve(pos.pos);
                    targetNode = $pos.parent;
                    targetPos = $pos.depth ? $pos.before() : 0;
                }

                this.mightDrag = null;

                var target = flushed ? null : event.target;
                var targetDesc = target
                    ? view.docView.nearestDesc(target, true)
                    : null;
                this.target = targetDesc ? targetDesc.dom : null;

                var ref = view.state;
                var selection = ref.selection;
                if (
                    (event.button == 0 &&
                        targetNode.type.spec.draggable &&
                        targetNode.type.spec.selectable !== false) ||
                    (selection instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection &&
                        selection.from <= targetPos &&
                        selection.to > targetPos)
                ) {
                    this.mightDrag = {
                        node: targetNode,
                        pos: targetPos,
                        addAttr: this.target && !this.target.draggable,
                        setUneditable:
                            this.target &&
                            result.gecko &&
                            !this.target.hasAttribute("contentEditable"),
                    };
                }

                if (
                    this.target &&
                    this.mightDrag &&
                    (this.mightDrag.addAttr || this.mightDrag.setUneditable)
                ) {
                    this.view.domObserver.stop();
                    if (this.mightDrag.addAttr) {
                        this.target.draggable = true;
                    }
                    if (this.mightDrag.setUneditable) {
                        setTimeout(function () {
                            if (this$1.view.mouseDown == this$1) {
                                this$1.target.setAttribute(
                                    "contentEditable",
                                    "false"
                                );
                            }
                        }, 20);
                    }
                    this.view.domObserver.start();
                }

                view.root.addEventListener(
                    "mouseup",
                    (this.up = this.up.bind(this))
                );
                view.root.addEventListener(
                    "mousemove",
                    (this.move = this.move.bind(this))
                );
                setSelectionOrigin(view, "pointer");
            };

            MouseDown.prototype.done = function done() {
                var this$1 = this;

                this.view.root.removeEventListener("mouseup", this.up);
                this.view.root.removeEventListener("mousemove", this.move);
                if (this.mightDrag && this.target) {
                    this.view.domObserver.stop();
                    if (this.mightDrag.addAttr) {
                        this.target.removeAttribute("draggable");
                    }
                    if (this.mightDrag.setUneditable) {
                        this.target.removeAttribute("contentEditable");
                    }
                    this.view.domObserver.start();
                }
                if (this.delayedSelectionSync) {
                    setTimeout(function () {
                        return selectionToDOM(this$1.view);
                    });
                }
                this.view.mouseDown = null;
            };

            MouseDown.prototype.up = function up(event) {
                this.done();

                if (
                    !this.view.dom.contains(
                        event.target.nodeType == 3
                            ? event.target.parentNode
                            : event.target
                    )
                ) {
                    return;
                }

                var pos = this.pos;
                if (this.view.state.doc != this.startDoc) {
                    pos = this.view.posAtCoords(eventCoords(event));
                }

                if (this.allowDefault || !pos) {
                    setSelectionOrigin(this.view, "pointer");
                } else if (
                    handleSingleClick(
                        this.view,
                        pos.pos,
                        pos.inside,
                        event,
                        this.selectNode
                    )
                ) {
                    event.preventDefault();
                } else if (
                    event.button == 0 &&
                    (this.flushed ||
                        // Safari ignores clicks on draggable elements
                        (result.safari &&
                            this.mightDrag &&
                            !this.mightDrag.node.isAtom) ||
                        // Chrome will sometimes treat a node selection as a
                        // cursor, but still report that the node is selected
                        // when asked through getSelection. You'll then get a
                        // situation where clicking at the point where that
                        // (hidden) cursor is doesn't change the selection, and
                        // thus doesn't get a reaction from ProseMirror. This
                        // works around that.
                        (result.chrome &&
                            !(
                                this.view.state.selection instanceof
                                prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection
                            ) &&
                            Math.min(
                                Math.abs(
                                    pos.pos - this.view.state.selection.from
                                ),
                                Math.abs(pos.pos - this.view.state.selection.to)
                            ) <= 2))
                ) {
                    updateSelection(
                        this.view,
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.near(
                            this.view.state.doc.resolve(pos.pos)
                        ),
                        "pointer"
                    );
                    event.preventDefault();
                } else {
                    setSelectionOrigin(this.view, "pointer");
                }
            };

            MouseDown.prototype.move = function move(event) {
                if (
                    !this.allowDefault &&
                    (Math.abs(this.event.x - event.clientX) > 4 ||
                        Math.abs(this.event.y - event.clientY) > 4)
                ) {
                    this.allowDefault = true;
                }
                setSelectionOrigin(this.view, "pointer");
                if (event.buttons == 0) {
                    this.done();
                }
            };

            handlers.touchdown = function (view) {
                forceDOMFlush(view);
                setSelectionOrigin(view, "pointer");
            };

            handlers.contextmenu = function (view) {
                return forceDOMFlush(view);
            };

            function inOrNearComposition(view, event) {
                if (view.composing) {
                    return true;
                }
                // See https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/.
                // On Japanese input method editors (IMEs), the Enter key is used to confirm character
                // selection. On Safari, when Enter is pressed, compositionend and keydown events are
                // emitted. The keydown event triggers newline insertion, which we don't want.
                // This method returns true if the keydown event should be ignored.
                // We only ignore it once, as pressing Enter a second time *should* insert a newline.
                // Furthermore, the keydown event timestamp must be close to the compositionEndedAt timestamp.
                // This guards against the case where compositionend is triggered without the keyboard
                // (e.g. character confirmation may be done with the mouse), and keydown is triggered
                // afterwards- we wouldn't want to ignore the keydown event in this case.
                if (
                    result.safari &&
                    Math.abs(event.timeStamp - view.compositionEndedAt) < 500
                ) {
                    view.compositionEndedAt = -2e8;
                    return true;
                }
                return false;
            }

            // Drop active composition after 5 seconds of inactivity on Android
            var timeoutComposition = result.android ? 5000 : -1;

            editHandlers.compositionstart = editHandlers.compositionupdate =
                function (view) {
                    if (!view.composing) {
                        view.domObserver.flush();
                        var state = view.state;
                        var $pos = state.selection.$from;
                        if (
                            state.selection.empty &&
                            (state.storedMarks ||
                                (!$pos.textOffset &&
                                    $pos.parentOffset &&
                                    $pos.nodeBefore.marks.some(function (m) {
                                        return m.type.spec.inclusive === false;
                                    })))
                        ) {
                            // Need to wrap the cursor in mark nodes different from the ones in the DOM context
                            view.markCursor =
                                view.state.storedMarks || $pos.marks();
                            endComposition(view, true);
                            view.markCursor = null;
                        } else {
                            endComposition(view);
                            // In firefox, if the cursor is after but outside a marked node,
                            // the inserted text won't inherit the marks. So this moves it
                            // inside if necessary.
                            if (
                                result.gecko &&
                                state.selection.empty &&
                                $pos.parentOffset &&
                                !$pos.textOffset &&
                                $pos.nodeBefore.marks.length
                            ) {
                                var sel = view.root.getSelection();
                                for (
                                    var node = sel.focusNode,
                                        offset = sel.focusOffset;
                                    node && node.nodeType == 1 && offset != 0;

                                ) {
                                    var before =
                                        offset < 0
                                            ? node.lastChild
                                            : node.childNodes[offset - 1];
                                    if (!before) {
                                        break;
                                    }
                                    if (before.nodeType == 3) {
                                        sel.collapse(
                                            before,
                                            before.nodeValue.length
                                        );
                                        break;
                                    } else {
                                        node = before;
                                        offset = -1;
                                    }
                                }
                            }
                        }
                        view.composing = true;
                    }
                    scheduleComposeEnd(view, timeoutComposition);
                };

            editHandlers.compositionend = function (view, event) {
                if (view.composing) {
                    view.composing = false;
                    view.compositionEndedAt = event.timeStamp;
                    scheduleComposeEnd(view, 20);
                }
            };

            function scheduleComposeEnd(view, delay) {
                clearTimeout(view.composingTimeout);
                if (delay > -1) {
                    view.composingTimeout = setTimeout(function () {
                        return endComposition(view);
                    }, delay);
                }
            }

            function clearComposition(view) {
                if (view.composing) {
                    view.composing = false;
                    view.compositionEndedAt = timestampFromCustomEvent();
                }
                while (view.compositionNodes.length > 0) {
                    view.compositionNodes.pop().markParentsDirty();
                }
            }

            function timestampFromCustomEvent() {
                var event = document.createEvent("Event");
                event.initEvent("event", true, true);
                return event.timeStamp;
            }

            function endComposition(view, forceUpdate) {
                view.domObserver.forceFlush();
                clearComposition(view);
                if (forceUpdate || view.docView.dirty) {
                    var sel = selectionFromDOM(view);
                    if (sel && !sel.eq(view.state.selection)) {
                        view.dispatch(view.state.tr.setSelection(sel));
                    } else {
                        view.updateState(view.state);
                    }
                    return true;
                }
                return false;
            }

            function captureCopy(view, dom) {
                // The extra wrapper is somehow necessary on IE/Edge to prevent the
                // content from being mangled when it is put onto the clipboard
                if (!view.dom.parentNode) {
                    return;
                }
                var wrap = view.dom.parentNode.appendChild(
                    document.createElement("div")
                );
                wrap.appendChild(dom);
                wrap.style.cssText =
                    "position: fixed; left: -10000px; top: 10px";
                var sel = getSelection(),
                    range = document.createRange();
                range.selectNodeContents(dom);
                // Done because IE will fire a selectionchange moving the selection
                // to its start when removeAllRanges is called and the editor still
                // has focus (which will mess up the editor's selection state).
                view.dom.blur();
                sel.removeAllRanges();
                sel.addRange(range);
                setTimeout(function () {
                    if (wrap.parentNode) {
                        wrap.parentNode.removeChild(wrap);
                    }
                    view.focus();
                }, 50);
            }

            // This is very crude, but unfortunately both these browsers _pretend_
            // that they have a clipboard API—all the objects and methods are
            // there, they just don't work, and they are hard to test.
            var brokenClipboardAPI =
                (result.ie && result.ie_version < 15) ||
                (result.ios && result.webkit_version < 604);

            handlers.copy = editHandlers.cut = function (view, e) {
                var sel = view.state.selection,
                    cut = e.type == "cut";
                if (sel.empty) {
                    return;
                }

                // IE and Edge's clipboard interface is completely broken
                var data = brokenClipboardAPI ? null : e.clipboardData;
                var slice = sel.content();
                var ref = serializeForClipboard(view, slice);
                var dom = ref.dom;
                var text = ref.text;
                if (data) {
                    e.preventDefault();
                    data.clearData();
                    data.setData("text/html", dom.innerHTML);
                    data.setData("text/plain", text);
                } else {
                    captureCopy(view, dom);
                }
                if (cut) {
                    view.dispatch(
                        view.state.tr
                            .deleteSelection()
                            .scrollIntoView()
                            .setMeta("uiEvent", "cut")
                    );
                }
            };

            function sliceSingleNode(slice) {
                return slice.openStart == 0 &&
                    slice.openEnd == 0 &&
                    slice.content.childCount == 1
                    ? slice.content.firstChild
                    : null;
            }

            function capturePaste(view, e) {
                if (!view.dom.parentNode) {
                    return;
                }
                var plainText =
                    view.shiftKey ||
                    view.state.selection.$from.parent.type.spec.code;
                var target = view.dom.parentNode.appendChild(
                    document.createElement(plainText ? "textarea" : "div")
                );
                if (!plainText) {
                    target.contentEditable = "true";
                }
                target.style.cssText =
                    "position: fixed; left: -10000px; top: 10px";
                target.focus();
                setTimeout(function () {
                    view.focus();
                    if (target.parentNode) {
                        target.parentNode.removeChild(target);
                    }
                    if (plainText) {
                        doPaste(view, target.value, null, e);
                    } else {
                        doPaste(view, target.textContent, target.innerHTML, e);
                    }
                }, 50);
            }

            function doPaste(view, text, html, e) {
                var slice = parseFromClipboard(
                    view,
                    text,
                    html,
                    view.shiftKey,
                    view.state.selection.$from
                );
                if (
                    view.someProp("handlePaste", function (f) {
                        return f(
                            view,
                            e,
                            slice ||
                                prosemirror_model__WEBPACK_IMPORTED_MODULE_1__
                                    .Slice.empty
                        );
                    })
                ) {
                    return true;
                }
                if (!slice) {
                    return false;
                }

                var singleNode = sliceSingleNode(slice);
                var tr = singleNode
                    ? view.state.tr.replaceSelectionWith(
                          singleNode,
                          view.shiftKey
                      )
                    : view.state.tr.replaceSelection(slice);
                view.dispatch(
                    tr
                        .scrollIntoView()
                        .setMeta("paste", true)
                        .setMeta("uiEvent", "paste")
                );
                return true;
            }

            editHandlers.paste = function (view, e) {
                var data = brokenClipboardAPI ? null : e.clipboardData;
                if (
                    data &&
                    doPaste(
                        view,
                        data.getData("text/plain"),
                        data.getData("text/html"),
                        e
                    )
                ) {
                    e.preventDefault();
                } else {
                    capturePaste(view, e);
                }
            };

            var Dragging = function Dragging(slice, move) {
                this.slice = slice;
                this.move = move;
            };

            var dragCopyModifier = result.mac ? "altKey" : "ctrlKey";

            handlers.dragstart = function (view, e) {
                var mouseDown = view.mouseDown;
                if (mouseDown) {
                    mouseDown.done();
                }
                if (!e.dataTransfer) {
                    return;
                }

                var sel = view.state.selection;
                var pos = sel.empty ? null : view.posAtCoords(eventCoords(e));
                if (
                    pos &&
                    pos.pos >= sel.from &&
                    pos.pos <=
                        (sel instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection
                            ? sel.to - 1
                            : sel.to)
                );
                else if (mouseDown && mouseDown.mightDrag) {
                    view.dispatch(
                        view.state.tr.setSelection(
                            prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.create(
                                view.state.doc,
                                mouseDown.mightDrag.pos
                            )
                        )
                    );
                } else if (e.target && e.target.nodeType == 1) {
                    var desc = view.docView.nearestDesc(e.target, true);
                    if (
                        desc &&
                        desc.node.type.spec.draggable &&
                        desc != view.docView
                    ) {
                        view.dispatch(
                            view.state.tr.setSelection(
                                prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.create(
                                    view.state.doc,
                                    desc.posBefore
                                )
                            )
                        );
                    }
                }
                var slice = view.state.selection.content();
                var ref = serializeForClipboard(view, slice);
                var dom = ref.dom;
                var text = ref.text;
                e.dataTransfer.clearData();
                e.dataTransfer.setData(
                    brokenClipboardAPI ? "Text" : "text/html",
                    dom.innerHTML
                );
                // See https://github.com/ProseMirror/prosemirror/issues/1156
                e.dataTransfer.effectAllowed = "copyMove";
                if (!brokenClipboardAPI) {
                    e.dataTransfer.setData("text/plain", text);
                }
                view.dragging = new Dragging(slice, !e[dragCopyModifier]);
            };

            handlers.dragend = function (view) {
                var dragging = view.dragging;
                window.setTimeout(function () {
                    if (view.dragging == dragging) {
                        view.dragging = null;
                    }
                }, 50);
            };

            editHandlers.dragover = editHandlers.dragenter = function (_, e) {
                return e.preventDefault();
            };

            editHandlers.drop = function (view, e) {
                var dragging = view.dragging;
                view.dragging = null;

                if (!e.dataTransfer) {
                    return;
                }

                var eventPos = view.posAtCoords(eventCoords(e));
                if (!eventPos) {
                    return;
                }
                var $mouse = view.state.doc.resolve(eventPos.pos);
                if (!$mouse) {
                    return;
                }
                var slice = dragging && dragging.slice;
                if (slice) {
                    view.someProp("transformPasted", function (f) {
                        slice = f(slice);
                    });
                } else {
                    slice = parseFromClipboard(
                        view,
                        e.dataTransfer.getData(
                            brokenClipboardAPI ? "Text" : "text/plain"
                        ),
                        brokenClipboardAPI
                            ? null
                            : e.dataTransfer.getData("text/html"),
                        false,
                        $mouse
                    );
                }
                var move = dragging && !e[dragCopyModifier];
                if (
                    view.someProp("handleDrop", function (f) {
                        return f(
                            view,
                            e,
                            slice ||
                                prosemirror_model__WEBPACK_IMPORTED_MODULE_1__
                                    .Slice.empty,
                            move
                        );
                    })
                ) {
                    e.preventDefault();
                    return;
                }
                if (!slice) {
                    return;
                }

                e.preventDefault();
                var insertPos = slice
                    ? (0,
                      prosemirror_transform__WEBPACK_IMPORTED_MODULE_2__ /* .dropPoint */.nj)(
                          view.state.doc,
                          $mouse.pos,
                          slice
                      )
                    : $mouse.pos;
                if (insertPos == null) {
                    insertPos = $mouse.pos;
                }

                var tr = view.state.tr;
                if (move) {
                    tr.deleteSelection();
                }

                var pos = tr.mapping.map(insertPos);
                var isNode =
                    slice.openStart == 0 &&
                    slice.openEnd == 0 &&
                    slice.content.childCount == 1;
                var beforeInsert = tr.doc;
                if (isNode) {
                    tr.replaceRangeWith(pos, pos, slice.content.firstChild);
                } else {
                    tr.replaceRange(pos, pos, slice);
                }
                if (tr.doc.eq(beforeInsert)) {
                    return;
                }

                var $pos = tr.doc.resolve(pos);
                if (
                    isNode &&
                    prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(
                        slice.content.firstChild
                    ) &&
                    $pos.nodeAfter &&
                    $pos.nodeAfter.sameMarkup(slice.content.firstChild)
                ) {
                    tr.setSelection(
                        new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection(
                            $pos
                        )
                    );
                } else {
                    var end = tr.mapping.map(insertPos);
                    tr.mapping.maps[tr.mapping.maps.length - 1].forEach(
                        function (_from, _to, _newFrom, newTo) {
                            return (end = newTo);
                        }
                    );
                    tr.setSelection(
                        selectionBetween(view, $pos, tr.doc.resolve(end))
                    );
                }
                view.focus();
                view.dispatch(tr.setMeta("uiEvent", "drop"));
            };

            handlers.focus = function (view) {
                if (!view.focused) {
                    view.domObserver.stop();
                    view.dom.classList.add("ProseMirror-focused");
                    view.domObserver.start();
                    view.focused = true;
                    setTimeout(function () {
                        if (
                            view.docView &&
                            view.hasFocus() &&
                            !view.domObserver.currentSelection.eq(
                                view.root.getSelection()
                            )
                        ) {
                            selectionToDOM(view);
                        }
                    }, 20);
                }
            };

            handlers.blur = function (view, e) {
                if (view.focused) {
                    view.domObserver.stop();
                    view.dom.classList.remove("ProseMirror-focused");
                    view.domObserver.start();
                    if (e.relatedTarget && view.dom.contains(e.relatedTarget)) {
                        view.domObserver.currentSelection.set({});
                    }
                    view.focused = false;
                }
            };

            handlers.beforeinput = function (view, event) {
                // We should probably do more with beforeinput events, but support
                // is so spotty that I'm still waiting to see where they are going.

                // Very specific hack to deal with backspace sometimes failing on
                // Chrome Android when after an uneditable node.
                if (
                    result.chrome &&
                    result.android &&
                    event.inputType == "deleteContentBackward"
                ) {
                    var domChangeCount = view.domChangeCount;
                    setTimeout(function () {
                        if (view.domChangeCount != domChangeCount) {
                            return;
                        } // Event already had some effect
                        // This bug tends to close the virtual keyboard, so we refocus
                        view.dom.blur();
                        view.focus();
                        if (
                            view.someProp("handleKeyDown", function (f) {
                                return f(view, keyEvent(8, "Backspace"));
                            })
                        ) {
                            return;
                        }
                        var ref = view.state.selection;
                        var $cursor = ref.$cursor;
                        // Crude approximation of backspace behavior when no command handled it
                        if ($cursor && $cursor.pos > 0) {
                            view.dispatch(
                                view.state.tr
                                    .delete($cursor.pos - 1, $cursor.pos)
                                    .scrollIntoView()
                            );
                        }
                    }, 50);
                }
            };

            // Make sure all handlers get registered
            for (var prop in editHandlers) {
                handlers[prop] = editHandlers[prop];
            }

            function compareObjs(a, b) {
                if (a == b) {
                    return true;
                }
                for (var p in a) {
                    if (a[p] !== b[p]) {
                        return false;
                    }
                }
                for (var p$1 in b) {
                    if (!(p$1 in a)) {
                        return false;
                    }
                }
                return true;
            }

            var WidgetType = function WidgetType(toDOM, spec) {
                this.spec = spec || noSpec;
                this.side = this.spec.side || 0;
                this.toDOM = toDOM;
            };

            WidgetType.prototype.map = function map(
                mapping,
                span,
                offset,
                oldOffset
            ) {
                var ref = mapping.mapResult(
                    span.from + oldOffset,
                    this.side < 0 ? -1 : 1
                );
                var pos = ref.pos;
                var deleted = ref.deleted;
                return deleted
                    ? null
                    : new Decoration(pos - offset, pos - offset, this);
            };

            WidgetType.prototype.valid = function valid() {
                return true;
            };

            WidgetType.prototype.eq = function eq(other) {
                return (
                    this == other ||
                    (other instanceof WidgetType &&
                        ((this.spec.key && this.spec.key == other.spec.key) ||
                            (this.toDOM == other.toDOM &&
                                compareObjs(this.spec, other.spec))))
                );
            };

            var InlineType = function InlineType(attrs, spec) {
                this.spec = spec || noSpec;
                this.attrs = attrs;
            };

            InlineType.prototype.map = function map(
                mapping,
                span,
                offset,
                oldOffset
            ) {
                var from =
                    mapping.map(
                        span.from + oldOffset,
                        this.spec.inclusiveStart ? -1 : 1
                    ) - offset;
                var to =
                    mapping.map(
                        span.to + oldOffset,
                        this.spec.inclusiveEnd ? 1 : -1
                    ) - offset;
                return from >= to ? null : new Decoration(from, to, this);
            };

            InlineType.prototype.valid = function valid(_, span) {
                return span.from < span.to;
            };

            InlineType.prototype.eq = function eq(other) {
                return (
                    this == other ||
                    (other instanceof InlineType &&
                        compareObjs(this.attrs, other.attrs) &&
                        compareObjs(this.spec, other.spec))
                );
            };

            InlineType.is = function is(span) {
                return span.type instanceof InlineType;
            };

            var NodeType = function NodeType(attrs, spec) {
                this.spec = spec || noSpec;
                this.attrs = attrs;
            };

            NodeType.prototype.map = function map(
                mapping,
                span,
                offset,
                oldOffset
            ) {
                var from = mapping.mapResult(span.from + oldOffset, 1);
                if (from.deleted) {
                    return null;
                }
                var to = mapping.mapResult(span.to + oldOffset, -1);
                if (to.deleted || to.pos <= from.pos) {
                    return null;
                }
                return new Decoration(from.pos - offset, to.pos - offset, this);
            };

            NodeType.prototype.valid = function valid(node, span) {
                var ref = node.content.findIndex(span.from);
                var index = ref.index;
                var offset = ref.offset;
                var child;
                return (
                    offset == span.from &&
                    !(child = node.child(index)).isText &&
                    offset + child.nodeSize == span.to
                );
            };

            NodeType.prototype.eq = function eq(other) {
                return (
                    this == other ||
                    (other instanceof NodeType &&
                        compareObjs(this.attrs, other.attrs) &&
                        compareObjs(this.spec, other.spec))
                );
            };

            // ::- Decoration objects can be provided to the view through the
            // [`decorations` prop](#view.EditorProps.decorations). They come in
            // several variants—see the static members of this class for details.
            var Decoration = function Decoration(from, to, type) {
                // :: number
                // The start position of the decoration.
                this.from = from;
                // :: number
                // The end position. Will be the same as `from` for [widget
                // decorations](#view.Decoration^widget).
                this.to = to;
                this.type = type;
            };

            var prototypeAccessors$1 = {
                spec: { configurable: true },
                inline: { configurable: true },
            };

            Decoration.prototype.copy = function copy(from, to) {
                return new Decoration(from, to, this.type);
            };

            Decoration.prototype.eq = function eq(other, offset) {
                if (offset === void 0) offset = 0;

                return (
                    this.type.eq(other.type) &&
                    this.from + offset == other.from &&
                    this.to + offset == other.to
                );
            };

            Decoration.prototype.map = function map(
                mapping,
                offset,
                oldOffset
            ) {
                return this.type.map(mapping, this, offset, oldOffset);
            };

            // :: (number, union<(view: EditorView, getPos: () → number) → dom.Node, dom.Node>, ?Object) → Decoration
            // Creates a widget decoration, which is a DOM node that's shown in
            // the document at the given position. It is recommended that you
            // delay rendering the widget by passing a function that will be
            // called when the widget is actually drawn in a view, but you can
            // also directly pass a DOM node. `getPos` can be used to find the
            // widget's current document position.
            //
            // spec::- These options are supported:
            //
            //   side:: ?number
            //   Controls which side of the document position this widget is
            //   associated with. When negative, it is drawn before a cursor
            //   at its position, and content inserted at that position ends
            //   up after the widget. When zero (the default) or positive, the
            //   widget is drawn after the cursor and content inserted there
            //   ends up before the widget.
            //
            //   When there are multiple widgets at a given position, their
            //   `side` values determine the order in which they appear. Those
            //   with lower values appear first. The ordering of widgets with
            //   the same `side` value is unspecified.
            //
            //   When `marks` is null, `side` also determines the marks that
            //   the widget is wrapped in—those of the node before when
            //   negative, those of the node after when positive.
            //
            //   marks:: ?[Mark]
            //   The precise set of marks to draw around the widget.
            //
            //   stopEvent:: ?(event: dom.Event) → bool
            //   Can be used to control which DOM events, when they bubble out
            //   of this widget, the editor view should ignore.
            //
            //   ignoreSelection:: ?bool
            //   When set (defaults to false), selection changes inside the
            //   widget are ignored, and don't cause ProseMirror to try and
            //   re-sync the selection with its selection state.
            //
            //   key:: ?string
            //   When comparing decorations of this type (in order to decide
            //   whether it needs to be redrawn), ProseMirror will by default
            //   compare the widget DOM node by identity. If you pass a key,
            //   that key will be compared instead, which can be useful when
            //   you generate decorations on the fly and don't want to store
            //   and reuse DOM nodes. Make sure that any widgets with the same
            //   key are interchangeable—if widgets differ in, for example,
            //   the behavior of some event handler, they should get
            //   different keys.
            Decoration.widget = function widget(pos, toDOM, spec) {
                return new Decoration(pos, pos, new WidgetType(toDOM, spec));
            };

            // :: (number, number, DecorationAttrs, ?Object) → Decoration
            // Creates an inline decoration, which adds the given attributes to
            // each inline node between `from` and `to`.
            //
            // spec::- These options are recognized:
            //
            //   inclusiveStart:: ?bool
            //   Determines how the left side of the decoration is
            //   [mapped](#transform.Position_Mapping) when content is
            //   inserted directly at that position. By default, the decoration
            //   won't include the new content, but you can set this to `true`
            //   to make it inclusive.
            //
            //   inclusiveEnd:: ?bool
            //   Determines how the right side of the decoration is mapped.
            //   See
            //   [`inclusiveStart`](#view.Decoration^inline^spec.inclusiveStart).
            Decoration.inline = function inline(from, to, attrs, spec) {
                return new Decoration(from, to, new InlineType(attrs, spec));
            };

            // :: (number, number, DecorationAttrs, ?Object) → Decoration
            // Creates a node decoration. `from` and `to` should point precisely
            // before and after a node in the document. That node, and only that
            // node, will receive the given attributes.
            //
            // spec::-
            //
            // Optional information to store with the decoration. It
            // is also used when comparing decorators for equality.
            Decoration.node = function node(from, to, attrs, spec) {
                return new Decoration(from, to, new NodeType(attrs, spec));
            };

            // :: Object
            // The spec provided when creating this decoration. Can be useful
            // if you've stored extra information in that object.
            prototypeAccessors$1.spec.get = function () {
                return this.type.spec;
            };

            prototypeAccessors$1.inline.get = function () {
                return this.type instanceof InlineType;
            };

            Object.defineProperties(Decoration.prototype, prototypeAccessors$1);

            // DecorationAttrs:: interface
            // A set of attributes to add to a decorated node. Most properties
            // simply directly correspond to DOM attributes of the same name,
            // which will be set to the property's value. These are exceptions:
            //
            //   class:: ?string
            //   A CSS class name or a space-separated set of class names to be
            //   _added_ to the classes that the node already had.
            //
            //   style:: ?string
            //   A string of CSS to be _added_ to the node's existing `style` property.
            //
            //   nodeName:: ?string
            //   When non-null, the target node is wrapped in a DOM element of
            //   this type (and the other attributes are applied to this element).

            var none = [],
                noSpec = {};

            // :: class extends DecorationSource
            // A collection of [decorations](#view.Decoration), organized in
            // such a way that the drawing algorithm can efficiently use and
            // compare them. This is a persistent data structure—it is not
            // modified, updates create a new value.
            var DecorationSet = function DecorationSet(local, children) {
                this.local = local && local.length ? local : none;
                this.children = children && children.length ? children : none;
            };

            // :: (Node, [Decoration]) → DecorationSet
            // Create a set of decorations, using the structure of the given
            // document.
            DecorationSet.create = function create(doc, decorations) {
                return decorations.length
                    ? buildTree(decorations, doc, 0, noSpec)
                    : empty;
            };

            // :: (?number, ?number, ?(spec: Object) → bool) → [Decoration]
            // Find all decorations in this set which touch the given range
            // (including decorations that start or end directly at the
            // boundaries) and match the given predicate on their spec. When
            // `start` and `end` are omitted, all decorations in the set are
            // considered. When `predicate` isn't given, all decorations are
            // assumed to match.
            DecorationSet.prototype.find = function find(
                start,
                end,
                predicate
            ) {
                var result = [];
                this.findInner(
                    start == null ? 0 : start,
                    end == null ? 1e9 : end,
                    result,
                    0,
                    predicate
                );
                return result;
            };

            DecorationSet.prototype.findInner = function findInner(
                start,
                end,
                result,
                offset,
                predicate
            ) {
                for (var i = 0; i < this.local.length; i++) {
                    var span = this.local[i];
                    if (
                        span.from <= end &&
                        span.to >= start &&
                        (!predicate || predicate(span.spec))
                    ) {
                        result.push(
                            span.copy(span.from + offset, span.to + offset)
                        );
                    }
                }
                for (var i$1 = 0; i$1 < this.children.length; i$1 += 3) {
                    if (
                        this.children[i$1] < end &&
                        this.children[i$1 + 1] > start
                    ) {
                        var childOff = this.children[i$1] + 1;
                        this.children[i$1 + 2].findInner(
                            start - childOff,
                            end - childOff,
                            result,
                            offset + childOff,
                            predicate
                        );
                    }
                }
            };

            // :: (Mapping, Node, ?Object) → DecorationSet
            // Map the set of decorations in response to a change in the
            // document.
            //
            // options::- An optional set of options.
            //
            //   onRemove:: ?(decorationSpec: Object)
            //   When given, this function will be called for each decoration
            //   that gets dropped as a result of the mapping, passing the
            //   spec of that decoration.
            DecorationSet.prototype.map = function map(mapping, doc, options) {
                if (this == empty || mapping.maps.length == 0) {
                    return this;
                }
                return this.mapInner(mapping, doc, 0, 0, options || noSpec);
            };

            DecorationSet.prototype.mapInner = function mapInner(
                mapping,
                node,
                offset,
                oldOffset,
                options
            ) {
                var newLocal;
                for (var i = 0; i < this.local.length; i++) {
                    var mapped = this.local[i].map(mapping, offset, oldOffset);
                    if (mapped && mapped.type.valid(node, mapped)) {
                        (newLocal || (newLocal = [])).push(mapped);
                    } else if (options.onRemove) {
                        options.onRemove(this.local[i].spec);
                    }
                }

                if (this.children.length) {
                    return mapChildren(
                        this.children,
                        newLocal,
                        mapping,
                        node,
                        offset,
                        oldOffset,
                        options
                    );
                } else {
                    return newLocal
                        ? new DecorationSet(newLocal.sort(byPos))
                        : empty;
                }
            };

            // :: (Node, [Decoration]) → DecorationSet
            // Add the given array of decorations to the ones in the set,
            // producing a new set. Needs access to the current document to
            // create the appropriate tree structure.
            DecorationSet.prototype.add = function add(doc, decorations) {
                if (!decorations.length) {
                    return this;
                }
                if (this == empty) {
                    return DecorationSet.create(doc, decorations);
                }
                return this.addInner(doc, decorations, 0);
            };

            DecorationSet.prototype.addInner = function addInner(
                doc,
                decorations,
                offset
            ) {
                var this$1 = this;

                var children,
                    childIndex = 0;
                doc.forEach(function (childNode, childOffset) {
                    var baseOffset = childOffset + offset,
                        found;
                    if (
                        !(found = takeSpansForNode(
                            decorations,
                            childNode,
                            baseOffset
                        ))
                    ) {
                        return;
                    }

                    if (!children) {
                        children = this$1.children.slice();
                    }
                    while (
                        childIndex < children.length &&
                        children[childIndex] < childOffset
                    ) {
                        childIndex += 3;
                    }
                    if (children[childIndex] == childOffset) {
                        children[childIndex + 2] = children[
                            childIndex + 2
                        ].addInner(childNode, found, baseOffset + 1);
                    } else {
                        children.splice(
                            childIndex,
                            0,
                            childOffset,
                            childOffset + childNode.nodeSize,
                            buildTree(found, childNode, baseOffset + 1, noSpec)
                        );
                    }
                    childIndex += 3;
                });

                var local = moveSpans(
                    childIndex ? withoutNulls(decorations) : decorations,
                    -offset
                );
                for (var i = 0; i < local.length; i++) {
                    if (!local[i].type.valid(doc, local[i])) {
                        local.splice(i--, 1);
                    }
                }

                return new DecorationSet(
                    local.length
                        ? this.local.concat(local).sort(byPos)
                        : this.local,
                    children || this.children
                );
            };

            // :: ([Decoration]) → DecorationSet
            // Create a new set that contains the decorations in this set, minus
            // the ones in the given array.
            DecorationSet.prototype.remove = function remove(decorations) {
                if (decorations.length == 0 || this == empty) {
                    return this;
                }
                return this.removeInner(decorations, 0);
            };

            DecorationSet.prototype.removeInner = function removeInner(
                decorations,
                offset
            ) {
                var children = this.children,
                    local = this.local;
                for (var i = 0; i < children.length; i += 3) {
                    var found = void 0,
                        from = children[i] + offset,
                        to = children[i + 1] + offset;
                    for (
                        var j = 0, span = void 0;
                        j < decorations.length;
                        j++
                    ) {
                        if ((span = decorations[j])) {
                            if (span.from > from && span.to < to) {
                                decorations[j] = null;
                                (found || (found = [])).push(span);
                            }
                        }
                    }
                    if (!found) {
                        continue;
                    }
                    if (children == this.children) {
                        children = this.children.slice();
                    }
                    var removed = children[i + 2].removeInner(found, from + 1);
                    if (removed != empty) {
                        children[i + 2] = removed;
                    } else {
                        children.splice(i, 3);
                        i -= 3;
                    }
                }
                if (local.length) {
                    for (
                        var i$1 = 0, span$1 = void 0;
                        i$1 < decorations.length;
                        i$1++
                    ) {
                        if ((span$1 = decorations[i$1])) {
                            for (var j$1 = 0; j$1 < local.length; j$1++) {
                                if (local[j$1].eq(span$1, offset)) {
                                    if (local == this.local) {
                                        local = this.local.slice();
                                    }
                                    local.splice(j$1--, 1);
                                }
                            }
                        }
                    }
                }
                if (children == this.children && local == this.local) {
                    return this;
                }
                return local.length || children.length
                    ? new DecorationSet(local, children)
                    : empty;
            };

            DecorationSet.prototype.forChild = function forChild(offset, node) {
                if (this == empty) {
                    return this;
                }
                if (node.isLeaf) {
                    return DecorationSet.empty;
                }

                var child, local;
                for (var i = 0; i < this.children.length; i += 3) {
                    if (this.children[i] >= offset) {
                        if (this.children[i] == offset) {
                            child = this.children[i + 2];
                        }
                        break;
                    }
                }
                var start = offset + 1,
                    end = start + node.content.size;
                for (var i$1 = 0; i$1 < this.local.length; i$1++) {
                    var dec = this.local[i$1];
                    if (
                        dec.from < end &&
                        dec.to > start &&
                        dec.type instanceof InlineType
                    ) {
                        var from = Math.max(start, dec.from) - start,
                            to = Math.min(end, dec.to) - start;
                        if (from < to) {
                            (local || (local = [])).push(dec.copy(from, to));
                        }
                    }
                }
                if (local) {
                    var localSet = new DecorationSet(local.sort(byPos));
                    return child
                        ? new DecorationGroup([localSet, child])
                        : localSet;
                }
                return child || empty;
            };

            DecorationSet.prototype.eq = function eq(other) {
                if (this == other) {
                    return true;
                }
                if (
                    !(other instanceof DecorationSet) ||
                    this.local.length != other.local.length ||
                    this.children.length != other.children.length
                ) {
                    return false;
                }
                for (var i = 0; i < this.local.length; i++) {
                    if (!this.local[i].eq(other.local[i])) {
                        return false;
                    }
                }
                for (var i$1 = 0; i$1 < this.children.length; i$1 += 3) {
                    if (
                        this.children[i$1] != other.children[i$1] ||
                        this.children[i$1 + 1] != other.children[i$1 + 1] ||
                        !this.children[i$1 + 2].eq(other.children[i$1 + 2])
                    ) {
                        return false;
                    }
                }
                return true;
            };

            DecorationSet.prototype.locals = function locals(node) {
                return removeOverlap(this.localsInner(node));
            };

            DecorationSet.prototype.localsInner = function localsInner(node) {
                if (this == empty) {
                    return none;
                }
                if (node.inlineContent || !this.local.some(InlineType.is)) {
                    return this.local;
                }
                var result = [];
                for (var i = 0; i < this.local.length; i++) {
                    if (!(this.local[i].type instanceof InlineType)) {
                        result.push(this.local[i]);
                    }
                }
                return result;
            };

            // DecorationSource:: interface
            // An object that can [provide](#view.EditorProps.decorations)
            // decorations. Implemented by [`DecorationSet`](#view.DecorationSet),
            // and passed to [node views](#view.EditorProps.nodeViews).
            //
            //   map:: (Mapping, Node) → DecorationSource
            //   Map the set of decorations in response to a change in the
            //   document.

            var empty = new DecorationSet();

            // :: DecorationSet
            // The empty set of decorations.
            DecorationSet.empty = empty;

            DecorationSet.removeOverlap = removeOverlap;

            // :- An abstraction that allows the code dealing with decorations to
            // treat multiple DecorationSet objects as if it were a single object
            // with (a subset of) the same interface.
            var DecorationGroup = function DecorationGroup(members) {
                this.members = members;
            };

            DecorationGroup.prototype.map = function map(mapping, doc) {
                var mappedDecos = this.members.map(function (member) {
                    return member.map(mapping, doc, noSpec);
                });
                return DecorationGroup.from(mappedDecos);
            };

            DecorationGroup.prototype.forChild = function forChild(
                offset,
                child
            ) {
                if (child.isLeaf) {
                    return DecorationSet.empty;
                }
                var found = [];
                for (var i = 0; i < this.members.length; i++) {
                    var result = this.members[i].forChild(offset, child);
                    if (result == empty) {
                        continue;
                    }
                    if (result instanceof DecorationGroup) {
                        found = found.concat(result.members);
                    } else {
                        found.push(result);
                    }
                }
                return DecorationGroup.from(found);
            };

            DecorationGroup.prototype.eq = function eq(other) {
                if (
                    !(other instanceof DecorationGroup) ||
                    other.members.length != this.members.length
                ) {
                    return false;
                }
                for (var i = 0; i < this.members.length; i++) {
                    if (!this.members[i].eq(other.members[i])) {
                        return false;
                    }
                }
                return true;
            };

            DecorationGroup.prototype.locals = function locals(node) {
                var result,
                    sorted = true;
                for (var i = 0; i < this.members.length; i++) {
                    var locals = this.members[i].localsInner(node);
                    if (!locals.length) {
                        continue;
                    }
                    if (!result) {
                        result = locals;
                    } else {
                        if (sorted) {
                            result = result.slice();
                            sorted = false;
                        }
                        for (var j = 0; j < locals.length; j++) {
                            result.push(locals[j]);
                        }
                    }
                }
                return result
                    ? removeOverlap(sorted ? result : result.sort(byPos))
                    : none;
            };

            // : ([DecorationSet]) → union<DecorationSet, DecorationGroup>
            // Create a group for the given array of decoration sets, or return
            // a single set when possible.
            DecorationGroup.from = function from(members) {
                switch (members.length) {
                    case 0:
                        return empty;
                    case 1:
                        return members[0];
                    default:
                        return new DecorationGroup(members);
                }
            };

            function mapChildren(
                oldChildren,
                newLocal,
                mapping,
                node,
                offset,
                oldOffset,
                options
            ) {
                var children = oldChildren.slice();

                // Mark the children that are directly touched by changes, and
                // move those that are after the changes.
                var shift = function (oldStart, oldEnd, newStart, newEnd) {
                    for (var i = 0; i < children.length; i += 3) {
                        var end = children[i + 1],
                            dSize = void 0;
                        if (end == -1 || oldStart > end + oldOffset) {
                            continue;
                        }
                        if (oldEnd >= children[i] + oldOffset) {
                            children[i + 1] = -1;
                        } else if (
                            newStart >= offset &&
                            (dSize = newEnd - newStart - (oldEnd - oldStart))
                        ) {
                            children[i] += dSize;
                            children[i + 1] += dSize;
                        }
                    }
                };
                for (var i = 0; i < mapping.maps.length; i++) {
                    mapping.maps[i].forEach(shift);
                }

                // Find the child nodes that still correspond to a single node,
                // recursively call mapInner on them and update their positions.
                var mustRebuild = false;
                for (var i$1 = 0; i$1 < children.length; i$1 += 3) {
                    if (children[i$1 + 1] == -1) {
                        // Touched nodes
                        var from = mapping.map(oldChildren[i$1] + oldOffset),
                            fromLocal = from - offset;
                        if (fromLocal < 0 || fromLocal >= node.content.size) {
                            mustRebuild = true;
                            continue;
                        }
                        // Must read oldChildren because children was tagged with -1
                        var to = mapping.map(
                                oldChildren[i$1 + 1] + oldOffset,
                                -1
                            ),
                            toLocal = to - offset;
                        var ref = node.content.findIndex(fromLocal);
                        var index = ref.index;
                        var childOffset = ref.offset;
                        var childNode = node.maybeChild(index);
                        if (
                            childNode &&
                            childOffset == fromLocal &&
                            childOffset + childNode.nodeSize == toLocal
                        ) {
                            var mapped = children[i$1 + 2].mapInner(
                                mapping,
                                childNode,
                                from + 1,
                                oldChildren[i$1] + oldOffset + 1,
                                options
                            );
                            if (mapped != empty) {
                                children[i$1] = fromLocal;
                                children[i$1 + 1] = toLocal;
                                children[i$1 + 2] = mapped;
                            } else {
                                children[i$1 + 1] = -2;
                                mustRebuild = true;
                            }
                        } else {
                            mustRebuild = true;
                        }
                    }
                }

                // Remaining children must be collected and rebuilt into the appropriate structure
                if (mustRebuild) {
                    var decorations = mapAndGatherRemainingDecorations(
                        children,
                        oldChildren,
                        newLocal || [],
                        mapping,
                        offset,
                        oldOffset,
                        options
                    );
                    var built = buildTree(decorations, node, 0, options);
                    newLocal = built.local;
                    for (var i$2 = 0; i$2 < children.length; i$2 += 3) {
                        if (children[i$2 + 1] < 0) {
                            children.splice(i$2, 3);
                            i$2 -= 3;
                        }
                    }
                    for (
                        var i$3 = 0, j = 0;
                        i$3 < built.children.length;
                        i$3 += 3
                    ) {
                        var from$1 = built.children[i$3];
                        while (j < children.length && children[j] < from$1) {
                            j += 3;
                        }
                        children.splice(
                            j,
                            0,
                            built.children[i$3],
                            built.children[i$3 + 1],
                            built.children[i$3 + 2]
                        );
                    }
                }

                return new DecorationSet(
                    newLocal && newLocal.sort(byPos),
                    children
                );
            }

            function moveSpans(spans, offset) {
                if (!offset || !spans.length) {
                    return spans;
                }
                var result = [];
                for (var i = 0; i < spans.length; i++) {
                    var span = spans[i];
                    result.push(
                        new Decoration(
                            span.from + offset,
                            span.to + offset,
                            span.type
                        )
                    );
                }
                return result;
            }

            function mapAndGatherRemainingDecorations(
                children,
                oldChildren,
                decorations,
                mapping,
                offset,
                oldOffset,
                options
            ) {
                // Gather all decorations from the remaining marked children
                function gather(set, oldOffset) {
                    for (var i = 0; i < set.local.length; i++) {
                        var mapped = set.local[i].map(
                            mapping,
                            offset,
                            oldOffset
                        );
                        if (mapped) {
                            decorations.push(mapped);
                        } else if (options.onRemove) {
                            options.onRemove(set.local[i].spec);
                        }
                    }
                    for (var i$1 = 0; i$1 < set.children.length; i$1 += 3) {
                        gather(
                            set.children[i$1 + 2],
                            set.children[i$1] + oldOffset + 1
                        );
                    }
                }
                for (var i = 0; i < children.length; i += 3) {
                    if (children[i + 1] == -1) {
                        gather(children[i + 2], oldChildren[i] + oldOffset + 1);
                    }
                }

                return decorations;
            }

            function takeSpansForNode(spans, node, offset) {
                if (node.isLeaf) {
                    return null;
                }
                var end = offset + node.nodeSize,
                    found = null;
                for (var i = 0, span = void 0; i < spans.length; i++) {
                    if (
                        (span = spans[i]) &&
                        span.from > offset &&
                        span.to < end
                    ) {
                        (found || (found = [])).push(span);
                        spans[i] = null;
                    }
                }
                return found;
            }

            function withoutNulls(array) {
                var result = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i] != null) {
                        result.push(array[i]);
                    }
                }
                return result;
            }

            // : ([Decoration], Node, number) → DecorationSet
            // Build up a tree that corresponds to a set of decorations. `offset`
            // is a base offset that should be subtracted from the `from` and `to`
            // positions in the spans (so that we don't have to allocate new spans
            // for recursive calls).
            function buildTree(spans, node, offset, options) {
                var children = [],
                    hasNulls = false;
                node.forEach(function (childNode, localStart) {
                    var found = takeSpansForNode(
                        spans,
                        childNode,
                        localStart + offset
                    );
                    if (found) {
                        hasNulls = true;
                        var subtree = buildTree(
                            found,
                            childNode,
                            offset + localStart + 1,
                            options
                        );
                        if (subtree != empty) {
                            children.push(
                                localStart,
                                localStart + childNode.nodeSize,
                                subtree
                            );
                        }
                    }
                });
                var locals = moveSpans(
                    hasNulls ? withoutNulls(spans) : spans,
                    -offset
                ).sort(byPos);
                for (var i = 0; i < locals.length; i++) {
                    if (!locals[i].type.valid(node, locals[i])) {
                        if (options.onRemove) {
                            options.onRemove(locals[i].spec);
                        }
                        locals.splice(i--, 1);
                    }
                }
                return locals.length || children.length
                    ? new DecorationSet(locals, children)
                    : empty;
            }

            // : (Decoration, Decoration) → number
            // Used to sort decorations so that ones with a low start position
            // come first, and within a set with the same start position, those
            // with an smaller end position come first.
            function byPos(a, b) {
                return a.from - b.from || a.to - b.to;
            }

            // : ([Decoration]) → [Decoration]
            // Scan a sorted array of decorations for partially overlapping spans,
            // and split those so that only fully overlapping spans are left (to
            // make subsequent rendering easier). Will return the input array if
            // no partially overlapping spans are found (the common case).
            function removeOverlap(spans) {
                var working = spans;
                for (var i = 0; i < working.length - 1; i++) {
                    var span = working[i];
                    if (span.from != span.to) {
                        for (var j = i + 1; j < working.length; j++) {
                            var next = working[j];
                            if (next.from == span.from) {
                                if (next.to != span.to) {
                                    if (working == spans) {
                                        working = spans.slice();
                                    }
                                    // Followed by a partially overlapping larger span. Split that
                                    // span.
                                    working[j] = next.copy(next.from, span.to);
                                    insertAhead(
                                        working,
                                        j + 1,
                                        next.copy(span.to, next.to)
                                    );
                                }
                                continue;
                            } else {
                                if (next.from < span.to) {
                                    if (working == spans) {
                                        working = spans.slice();
                                    }
                                    // The end of this one overlaps with a subsequent span. Split
                                    // this one.
                                    working[i] = span.copy(
                                        span.from,
                                        next.from
                                    );
                                    insertAhead(
                                        working,
                                        j,
                                        span.copy(next.from, span.to)
                                    );
                                }
                                break;
                            }
                        }
                    }
                }
                return working;
            }

            function insertAhead(array, i, deco) {
                while (i < array.length && byPos(deco, array[i]) > 0) {
                    i++;
                }
                array.splice(i, 0, deco);
            }

            // : (EditorView) → union<DecorationSet, DecorationGroup>
            // Get the decorations associated with the current props of a view.
            function viewDecorations(view) {
                var found = [];
                view.someProp("decorations", function (f) {
                    var result = f(view.state);
                    if (result && result != empty) {
                        found.push(result);
                    }
                });
                if (view.cursorWrapper) {
                    found.push(
                        DecorationSet.create(view.state.doc, [
                            view.cursorWrapper.deco,
                        ])
                    );
                }
                return DecorationGroup.from(found);
            }

            // ::- An editor view manages the DOM structure that represents an
            // editable document. Its state and behavior are determined by its
            // [props](#view.DirectEditorProps).
            var EditorView = function EditorView(place, props) {
                this._props = props;
                // :: EditorState
                // The view's current [state](#state.EditorState).
                this.state = props.state;

                this.directPlugins = props.plugins || [];
                this.directPlugins.forEach(checkStateComponent);

                this.dispatch = this.dispatch.bind(this);

                this._root = null;
                this.focused = false;
                // Kludge used to work around a Chrome bug
                this.trackWrites = null;

                // :: dom.Element
                // An editable DOM node containing the document. (You probably
                // should not directly interfere with its content.)
                this.dom =
                    (place && place.mount) || document.createElement("div");
                if (place) {
                    if (place.appendChild) {
                        place.appendChild(this.dom);
                    } else if (place.apply) {
                        place(this.dom);
                    } else if (place.mount) {
                        this.mounted = true;
                    }
                }

                // :: bool
                // Indicates whether the editor is currently [editable](#view.EditorProps.editable).
                this.editable = getEditable(this);
                this.markCursor = null;
                this.cursorWrapper = null;
                updateCursorWrapper(this);
                this.nodeViews = buildNodeViews(this);
                this.docView = docViewDesc(
                    this.state.doc,
                    computeDocDeco(this),
                    viewDecorations(this),
                    this.dom,
                    this
                );

                this.lastSelectedViewDesc = null;
                // :: ?{slice: Slice, move: bool}
                // When editor content is being dragged, this object contains
                // information about the dragged slice and whether it is being
                // copied or moved. At any other time, it is null.
                this.dragging = null;

                initInput(this);

                this.prevDirectPlugins = [];
                this.pluginViews = [];
                this.updatePluginViews();
            };

            var prototypeAccessors$2 = {
                props: { configurable: true },
                root: { configurable: true },
            };

            // composing:: boolean
            // Holds `true` when a
            // [composition](https://developer.mozilla.org/en-US/docs/Mozilla/IME_handling_guide)
            // is active.

            // :: DirectEditorProps
            // The view's current [props](#view.EditorProps).
            prototypeAccessors$2.props.get = function () {
                if (this._props.state != this.state) {
                    var prev = this._props;
                    this._props = {};
                    for (var name in prev) {
                        this._props[name] = prev[name];
                    }
                    this._props.state = this.state;
                }
                return this._props;
            };

            // :: (DirectEditorProps)
            // Update the view's props. Will immediately cause an update to
            // the DOM.
            EditorView.prototype.update = function update(props) {
                if (props.handleDOMEvents != this._props.handleDOMEvents) {
                    ensureListeners(this);
                }
                this._props = props;
                if (props.plugins) {
                    props.plugins.forEach(checkStateComponent);
                    this.directPlugins = props.plugins;
                }
                this.updateStateInner(props.state, true);
            };

            // :: (DirectEditorProps)
            // Update the view by updating existing props object with the object
            // given as argument. Equivalent to `view.update(Object.assign({},
            // view.props, props))`.
            EditorView.prototype.setProps = function setProps(props) {
                var updated = {};
                for (var name in this._props) {
                    updated[name] = this._props[name];
                }
                updated.state = this.state;
                for (var name$1 in props) {
                    updated[name$1] = props[name$1];
                }
                this.update(updated);
            };

            // :: (EditorState)
            // Update the editor's `state` prop, without touching any of the
            // other props.
            EditorView.prototype.updateState = function updateState(state) {
                this.updateStateInner(
                    state,
                    this.state.plugins != state.plugins
                );
            };

            EditorView.prototype.updateStateInner = function updateStateInner(
                state,
                reconfigured
            ) {
                var this$1 = this;

                var prev = this.state,
                    redraw = false,
                    updateSel = false;
                // When stored marks are added, stop composition, so that they can
                // be displayed.
                if (state.storedMarks && this.composing) {
                    clearComposition(this);
                    updateSel = true;
                }
                this.state = state;
                if (reconfigured) {
                    var nodeViews = buildNodeViews(this);
                    if (changedNodeViews(nodeViews, this.nodeViews)) {
                        this.nodeViews = nodeViews;
                        redraw = true;
                    }
                    ensureListeners(this);
                }

                this.editable = getEditable(this);
                updateCursorWrapper(this);
                var innerDeco = viewDecorations(this),
                    outerDeco = computeDocDeco(this);

                var scroll = reconfigured
                    ? "reset"
                    : state.scrollToSelection > prev.scrollToSelection
                    ? "to selection"
                    : "preserve";
                var updateDoc =
                    redraw ||
                    !this.docView.matchesNode(state.doc, outerDeco, innerDeco);
                if (updateDoc || !state.selection.eq(prev.selection)) {
                    updateSel = true;
                }
                var oldScrollPos =
                    scroll == "preserve" &&
                    updateSel &&
                    this.dom.style.overflowAnchor == null &&
                    storeScrollPos(this);

                if (updateSel) {
                    this.domObserver.stop();
                    // Work around an issue in Chrome, IE, and Edge where changing
                    // the DOM around an active selection puts it into a broken
                    // state where the thing the user sees differs from the
                    // selection reported by the Selection object (#710, #973,
                    // #1011, #1013, #1035).
                    var forceSelUpdate =
                        updateDoc &&
                        (result.ie || result.chrome) &&
                        !this.composing &&
                        !prev.selection.empty &&
                        !state.selection.empty &&
                        selectionContextChanged(
                            prev.selection,
                            state.selection
                        );
                    if (updateDoc) {
                        // If the node that the selection points into is written to,
                        // Chrome sometimes starts misreporting the selection, so this
                        // tracks that and forces a selection reset when our update
                        // did write to the node.
                        var chromeKludge = result.chrome
                            ? (this.trackWrites =
                                  this.root.getSelection().focusNode)
                            : null;
                        if (
                            redraw ||
                            !this.docView.update(
                                state.doc,
                                outerDeco,
                                innerDeco,
                                this
                            )
                        ) {
                            this.docView.updateOuterDeco([]);
                            this.docView.destroy();
                            this.docView = docViewDesc(
                                state.doc,
                                outerDeco,
                                innerDeco,
                                this.dom,
                                this
                            );
                        }
                        if (chromeKludge && !this.trackWrites) {
                            forceSelUpdate = true;
                        }
                    }
                    // Work around for an issue where an update arriving right between
                    // a DOM selection change and the "selectionchange" event for it
                    // can cause a spurious DOM selection update, disrupting mouse
                    // drag selection.
                    if (
                        forceSelUpdate ||
                        !(
                            this.mouseDown &&
                            this.domObserver.currentSelection.eq(
                                this.root.getSelection()
                            ) &&
                            anchorInRightPlace(this)
                        )
                    ) {
                        selectionToDOM(this, forceSelUpdate);
                    } else {
                        syncNodeSelection(this, state.selection);
                        this.domObserver.setCurSelection();
                    }
                    this.domObserver.start();
                }

                this.updatePluginViews(prev);

                if (scroll == "reset") {
                    this.dom.scrollTop = 0;
                } else if (scroll == "to selection") {
                    var startDOM = this.root.getSelection().focusNode;
                    if (
                        this.someProp("handleScrollToSelection", function (f) {
                            return f(this$1);
                        })
                    );
                    else if (
                        state.selection instanceof
                        prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection
                    ) {
                        // Handled
                        scrollRectIntoView(
                            this,
                            this.docView
                                .domAfterPos(state.selection.from)
                                .getBoundingClientRect(),
                            startDOM
                        );
                    } else {
                        scrollRectIntoView(
                            this,
                            this.coordsAtPos(state.selection.head, 1),
                            startDOM
                        );
                    }
                } else if (oldScrollPos) {
                    resetScrollPos(oldScrollPos);
                }
            };

            EditorView.prototype.destroyPluginViews =
                function destroyPluginViews() {
                    var view;
                    while ((view = this.pluginViews.pop())) {
                        if (view.destroy) {
                            view.destroy();
                        }
                    }
                };

            EditorView.prototype.updatePluginViews = function updatePluginViews(
                prevState
            ) {
                if (
                    !prevState ||
                    prevState.plugins != this.state.plugins ||
                    this.directPlugins != this.prevDirectPlugins
                ) {
                    this.prevDirectPlugins = this.directPlugins;
                    this.destroyPluginViews();
                    for (var i = 0; i < this.directPlugins.length; i++) {
                        var plugin = this.directPlugins[i];
                        if (plugin.spec.view) {
                            this.pluginViews.push(plugin.spec.view(this));
                        }
                    }
                    for (var i$1 = 0; i$1 < this.state.plugins.length; i$1++) {
                        var plugin$1 = this.state.plugins[i$1];
                        if (plugin$1.spec.view) {
                            this.pluginViews.push(plugin$1.spec.view(this));
                        }
                    }
                } else {
                    for (var i$2 = 0; i$2 < this.pluginViews.length; i$2++) {
                        var pluginView = this.pluginViews[i$2];
                        if (pluginView.update) {
                            pluginView.update(this, prevState);
                        }
                    }
                }
            };

            // :: (string, ?(prop: *) → *) → *
            // Goes over the values of a prop, first those provided directly,
            // then those from plugins given to the view, then from plugins in
            // the state (in order), and calls `f` every time a non-undefined
            // value is found. When `f` returns a truthy value, that is
            // immediately returned. When `f` isn't provided, it is treated as
            // the identity function (the prop value is returned directly).
            EditorView.prototype.someProp = function someProp(propName, f) {
                var prop = this._props && this._props[propName],
                    value;
                if (prop != null && (value = f ? f(prop) : prop)) {
                    return value;
                }
                for (var i = 0; i < this.directPlugins.length; i++) {
                    var prop$1 = this.directPlugins[i].props[propName];
                    if (prop$1 != null && (value = f ? f(prop$1) : prop$1)) {
                        return value;
                    }
                }
                var plugins = this.state.plugins;
                if (plugins) {
                    for (var i$1 = 0; i$1 < plugins.length; i$1++) {
                        var prop$2 = plugins[i$1].props[propName];
                        if (
                            prop$2 != null &&
                            (value = f ? f(prop$2) : prop$2)
                        ) {
                            return value;
                        }
                    }
                }
            };

            // :: () → bool
            // Query whether the view has focus.
            EditorView.prototype.hasFocus = function hasFocus() {
                return this.root.activeElement == this.dom;
            };

            // :: ()
            // Focus the editor.
            EditorView.prototype.focus = function focus() {
                this.domObserver.stop();
                if (this.editable) {
                    focusPreventScroll(this.dom);
                }
                selectionToDOM(this);
                this.domObserver.start();
            };

            // :: union<dom.Document, dom.DocumentFragment>
            // Get the document root in which the editor exists. This will
            // usually be the top-level `document`, but might be a [shadow
            // DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
            // root if the editor is inside one.
            prototypeAccessors$2.root.get = function () {
                var cached = this._root;
                if (cached == null) {
                    for (
                        var search = this.dom.parentNode;
                        search;
                        search = search.parentNode
                    ) {
                        if (
                            search.nodeType == 9 ||
                            (search.nodeType == 11 && search.host)
                        ) {
                            if (!search.getSelection) {
                                Object.getPrototypeOf(search).getSelection =
                                    function () {
                                        return document.getSelection();
                                    };
                            }
                            return (this._root = search);
                        }
                    }
                }
                return cached || document;
            };

            // :: ({left: number, top: number}) → ?{pos: number, inside: number}
            // Given a pair of viewport coordinates, return the document
            // position that corresponds to them. May return null if the given
            // coordinates aren't inside of the editor. When an object is
            // returned, its `pos` property is the position nearest to the
            // coordinates, and its `inside` property holds the position of the
            // inner node that the position falls inside of, or -1 if it is at
            // the top level, not in any node.
            EditorView.prototype.posAtCoords = function posAtCoords$1(coords) {
                return posAtCoords(this, coords);
            };

            // :: (number, number) → {left: number, right: number, top: number, bottom: number}
            // Returns the viewport rectangle at a given document position.
            // `left` and `right` will be the same number, as this returns a
            // flat cursor-ish rectangle. If the position is between two things
            // that aren't directly adjacent, `side` determines which element is
            // used. When < 0, the element before the position is used,
            // otherwise the element after.
            EditorView.prototype.coordsAtPos = function coordsAtPos$1(
                pos,
                side
            ) {
                if (side === void 0) side = 1;

                return coordsAtPos(this, pos, side);
            };

            // :: (number, number) → {node: dom.Node, offset: number}
            // Find the DOM position that corresponds to the given document
            // position. When `side` is negative, find the position as close as
            // possible to the content before the position. When positive,
            // prefer positions close to the content after the position. When
            // zero, prefer as shallow a position as possible.
            //
            // Note that you should **not** mutate the editor's internal DOM,
            // only inspect it (and even that is usually not necessary).
            EditorView.prototype.domAtPos = function domAtPos(pos, side) {
                if (side === void 0) side = 0;

                return this.docView.domFromPos(pos, side);
            };

            // :: (number) → ?dom.Node
            // Find the DOM node that represents the document node after the
            // given position. May return `null` when the position doesn't point
            // in front of a node or if the node is inside an opaque node view.
            //
            // This is intended to be able to call things like
            // `getBoundingClientRect` on that DOM node. Do **not** mutate the
            // editor DOM directly, or add styling this way, since that will be
            // immediately overriden by the editor as it redraws the node.
            EditorView.prototype.nodeDOM = function nodeDOM(pos) {
                var desc = this.docView.descAt(pos);
                return desc ? desc.nodeDOM : null;
            };

            // :: (dom.Node, number, ?number) → number
            // Find the document position that corresponds to a given DOM
            // position. (Whenever possible, it is preferable to inspect the
            // document structure directly, rather than poking around in the
            // DOM, but sometimes—for example when interpreting an event
            // target—you don't have a choice.)
            //
            // The `bias` parameter can be used to influence which side of a DOM
            // node to use when the position is inside a leaf node.
            EditorView.prototype.posAtDOM = function posAtDOM(
                node,
                offset,
                bias
            ) {
                if (bias === void 0) bias = -1;

                var pos = this.docView.posFromDOM(node, offset, bias);
                if (pos == null) {
                    throw new RangeError("DOM position not inside the editor");
                }
                return pos;
            };

            // :: (union<"up", "down", "left", "right", "forward", "backward">, ?EditorState) → bool
            // Find out whether the selection is at the end of a textblock when
            // moving in a given direction. When, for example, given `"left"`,
            // it will return true if moving left from the current cursor
            // position would leave that position's parent textblock. Will apply
            // to the view's current state by default, but it is possible to
            // pass a different state.
            EditorView.prototype.endOfTextblock = function endOfTextblock$1(
                dir,
                state
            ) {
                return endOfTextblock(this, state || this.state, dir);
            };

            // :: ()
            // Removes the editor from the DOM and destroys all [node
            // views](#view.NodeView).
            EditorView.prototype.destroy = function destroy() {
                if (!this.docView) {
                    return;
                }
                destroyInput(this);
                this.destroyPluginViews();
                if (this.mounted) {
                    this.docView.update(
                        this.state.doc,
                        [],
                        viewDecorations(this),
                        this
                    );
                    this.dom.textContent = "";
                } else if (this.dom.parentNode) {
                    this.dom.parentNode.removeChild(this.dom);
                }
                this.docView.destroy();
                this.docView = null;
            };

            // Used for testing.
            EditorView.prototype.dispatchEvent = function dispatchEvent$1(
                event
            ) {
                return dispatchEvent(this, event);
            };

            // :: (Transaction)
            // Dispatch a transaction. Will call
            // [`dispatchTransaction`](#view.DirectEditorProps.dispatchTransaction)
            // when given, and otherwise defaults to applying the transaction to
            // the current state and calling
            // [`updateState`](#view.EditorView.updateState) with the result.
            // This method is bound to the view instance, so that it can be
            // easily passed around.
            EditorView.prototype.dispatch = function dispatch(tr) {
                var dispatchTransaction = this._props.dispatchTransaction;
                if (dispatchTransaction) {
                    dispatchTransaction.call(this, tr);
                } else {
                    this.updateState(this.state.apply(tr));
                }
            };

            Object.defineProperties(EditorView.prototype, prototypeAccessors$2);

            function computeDocDeco(view) {
                var attrs = Object.create(null);
                attrs.class = "ProseMirror";
                attrs.contenteditable = String(view.editable);
                attrs.translate = "no";

                view.someProp("attributes", function (value) {
                    if (typeof value == "function") {
                        value = value(view.state);
                    }
                    if (value) {
                        for (var attr in value) {
                            if (attr == "class") {
                                attrs.class += " " + value[attr];
                            }
                            if (attr == "style") {
                                attrs.style =
                                    (attrs.style ? attrs.style + ";" : "") +
                                    value[attr];
                            } else if (
                                !attrs[attr] &&
                                attr != "contenteditable" &&
                                attr != "nodeName"
                            ) {
                                attrs[attr] = String(value[attr]);
                            }
                        }
                    }
                });

                return [Decoration.node(0, view.state.doc.content.size, attrs)];
            }

            function updateCursorWrapper(view) {
                if (view.markCursor) {
                    var dom = document.createElement("img");
                    dom.className = "ProseMirror-separator";
                    dom.setAttribute("mark-placeholder", "true");
                    view.cursorWrapper = {
                        dom: dom,
                        deco: Decoration.widget(
                            view.state.selection.head,
                            dom,
                            { raw: true, marks: view.markCursor }
                        ),
                    };
                } else {
                    view.cursorWrapper = null;
                }
            }

            function getEditable(view) {
                return !view.someProp("editable", function (value) {
                    return value(view.state) === false;
                });
            }

            function selectionContextChanged(sel1, sel2) {
                var depth = Math.min(
                    sel1.$anchor.sharedDepth(sel1.head),
                    sel2.$anchor.sharedDepth(sel2.head)
                );
                return sel1.$anchor.start(depth) != sel2.$anchor.start(depth);
            }

            function buildNodeViews(view) {
                var result = {};
                view.someProp("nodeViews", function (obj) {
                    for (var prop in obj) {
                        if (
                            !Object.prototype.hasOwnProperty.call(result, prop)
                        ) {
                            result[prop] = obj[prop];
                        }
                    }
                });
                return result;
            }

            function changedNodeViews(a, b) {
                var nA = 0,
                    nB = 0;
                for (var prop in a) {
                    if (a[prop] != b[prop]) {
                        return true;
                    }
                    nA++;
                }
                for (var _ in b) {
                    nB++;
                }
                return nA != nB;
            }

            function checkStateComponent(plugin) {
                if (
                    plugin.spec.state ||
                    plugin.spec.filterTransaction ||
                    plugin.spec.appendTransaction
                ) {
                    throw new RangeError(
                        "Plugins passed directly to the view must not have a state component"
                    );
                }
            }

            // EditorProps:: interface
            //
            // Props are configuration values that can be passed to an editor view
            // or included in a plugin. This interface lists the supported props.
            //
            // The various event-handling functions may all return `true` to
            // indicate that they handled the given event. The view will then take
            // care to call `preventDefault` on the event, except with
            // `handleDOMEvents`, where the handler itself is responsible for that.
            //
            // How a prop is resolved depends on the prop. Handler functions are
            // called one at a time, starting with the base props and then
            // searching through the plugins (in order of appearance) until one of
            // them returns true. For some props, the first plugin that yields a
            // value gets precedence.
            //
            //   handleDOMEvents:: ?Object<(view: EditorView, event: dom.Event) → bool>
            //   Can be an object mapping DOM event type names to functions that
            //   handle them. Such functions will be called before any handling
            //   ProseMirror does of events fired on the editable DOM element.
            //   Contrary to the other event handling props, when returning true
            //   from such a function, you are responsible for calling
            //   `preventDefault` yourself (or not, if you want to allow the
            //   default behavior).
            //
            //   handleKeyDown:: ?(view: EditorView, event: dom.KeyboardEvent) → bool
            //   Called when the editor receives a `keydown` event.
            //
            //   handleKeyPress:: ?(view: EditorView, event: dom.KeyboardEvent) → bool
            //   Handler for `keypress` events.
            //
            //   handleTextInput:: ?(view: EditorView, from: number, to: number, text: string) → bool
            //   Whenever the user directly input text, this handler is called
            //   before the input is applied. If it returns `true`, the default
            //   behavior of actually inserting the text is suppressed.
            //
            //   handleClickOn:: ?(view: EditorView, pos: number, node: Node, nodePos: number, event: dom.MouseEvent, direct: bool) → bool
            //   Called for each node around a click, from the inside out. The
            //   `direct` flag will be true for the inner node.
            //
            //   handleClick:: ?(view: EditorView, pos: number, event: dom.MouseEvent) → bool
            //   Called when the editor is clicked, after `handleClickOn` handlers
            //   have been called.
            //
            //   handleDoubleClickOn:: ?(view: EditorView, pos: number, node: Node, nodePos: number, event: dom.MouseEvent, direct: bool) → bool
            //   Called for each node around a double click.
            //
            //   handleDoubleClick:: ?(view: EditorView, pos: number, event: dom.MouseEvent) → bool
            //   Called when the editor is double-clicked, after `handleDoubleClickOn`.
            //
            //   handleTripleClickOn:: ?(view: EditorView, pos: number, node: Node, nodePos: number, event: dom.MouseEvent, direct: bool) → bool
            //   Called for each node around a triple click.
            //
            //   handleTripleClick:: ?(view: EditorView, pos: number, event: dom.MouseEvent) → bool
            //   Called when the editor is triple-clicked, after `handleTripleClickOn`.
            //
            //   handlePaste:: ?(view: EditorView, event: dom.ClipboardEvent, slice: Slice) → bool
            //   Can be used to override the behavior of pasting. `slice` is the
            //   pasted content parsed by the editor, but you can directly access
            //   the event to get at the raw content.
            //
            //   handleDrop:: ?(view: EditorView, event: dom.Event, slice: Slice, moved: bool) → bool
            //   Called when something is dropped on the editor. `moved` will be
            //   true if this drop moves from the current selection (which should
            //   thus be deleted).
            //
            //   handleScrollToSelection:: ?(view: EditorView) → bool
            //   Called when the view, after updating its state, tries to scroll
            //   the selection into view. A handler function may return false to
            //   indicate that it did not handle the scrolling and further
            //   handlers or the default behavior should be tried.
            //
            //   createSelectionBetween:: ?(view: EditorView, anchor: ResolvedPos, head: ResolvedPos) → ?Selection
            //   Can be used to override the way a selection is created when
            //   reading a DOM selection between the given anchor and head.
            //
            //   domParser:: ?DOMParser
            //   The [parser](#model.DOMParser) to use when reading editor changes
            //   from the DOM. Defaults to calling
            //   [`DOMParser.fromSchema`](#model.DOMParser^fromSchema) on the
            //   editor's schema.
            //
            //   transformPastedHTML:: ?(html: string) → string
            //   Can be used to transform pasted HTML text, _before_ it is parsed,
            //   for example to clean it up.
            //
            //   clipboardParser:: ?DOMParser
            //   The [parser](#model.DOMParser) to use when reading content from
            //   the clipboard. When not given, the value of the
            //   [`domParser`](#view.EditorProps.domParser) prop is used.
            //
            //   transformPastedText:: ?(text: string, plain: bool) → string
            //   Transform pasted plain text. The `plain` flag will be true when
            //   the text is pasted as plain text.
            //
            //   clipboardTextParser:: ?(text: string, $context: ResolvedPos, plain: bool) → Slice
            //   A function to parse text from the clipboard into a document
            //   slice. Called after
            //   [`transformPastedText`](#view.EditorProps.transformPastedText).
            //   The default behavior is to split the text into lines, wrap them
            //   in `<p>` tags, and call
            //   [`clipboardParser`](#view.EditorProps.clipboardParser) on it.
            //   The `plain` flag will be true when the text is pasted as plain text.
            //
            //   transformPasted:: ?(Slice) → Slice
            //   Can be used to transform pasted content before it is applied to
            //   the document.
            //
            //   nodeViews:: ?Object<(node: Node, view: EditorView, getPos: () → number, decorations: [Decoration], innerDecorations: DecorationSource) → NodeView>
            //   Allows you to pass custom rendering and behavior logic for nodes
            //   and marks. Should map node and mark names to constructor
            //   functions that produce a [`NodeView`](#view.NodeView) object
            //   implementing the node's display behavior. For nodes, the third
            //   argument `getPos` is a function that can be called to get the
            //   node's current position, which can be useful when creating
            //   transactions to update it. For marks, the third argument is a
            //   boolean that indicates whether the mark's content is inline.
            //
            //   `decorations` is an array of node or inline decorations that are
            //   active around the node. They are automatically drawn in the
            //   normal way, and you will usually just want to ignore this, but
            //   they can also be used as a way to provide context information to
            //   the node view without adding it to the document itself.
            //
            //   `innerDecorations` holds the decorations for the node's content.
            //   You can safely ignore this if your view has no content or a
            //   `contentDOM` property, since the editor will draw the decorations
            //   on the content. But if you, for example, want to create a nested
            //   editor with the content, it may make sense to provide it with the
            //   inner decorations.
            //
            //   clipboardSerializer:: ?DOMSerializer
            //   The DOM serializer to use when putting content onto the
            //   clipboard. If not given, the result of
            //   [`DOMSerializer.fromSchema`](#model.DOMSerializer^fromSchema)
            //   will be used.
            //
            //   clipboardTextSerializer:: ?(Slice) → string
            //   A function that will be called to get the text for the current
            //   selection when copying text to the clipboard. By default, the
            //   editor will use [`textBetween`](#model.Node.textBetween) on the
            //   selected range.
            //
            //   decorations:: ?(state: EditorState) → ?DecorationSource
            //   A set of [document decorations](#view.Decoration) to show in the
            //   view.
            //
            //   editable:: ?(state: EditorState) → bool
            //   When this returns false, the content of the view is not directly
            //   editable.
            //
            //   attributes:: ?union<Object<string>, (EditorState) → ?Object<string>>
            //   Control the DOM attributes of the editable element. May be either
            //   an object or a function going from an editor state to an object.
            //   By default, the element will get a class `"ProseMirror"`, and
            //   will have its `contentEditable` attribute determined by the
            //   [`editable` prop](#view.EditorProps.editable). Additional classes
            //   provided here will be added to the class. For other attributes,
            //   the value provided first (as in
            //   [`someProp`](#view.EditorView.someProp)) will be used.
            //
            //   scrollThreshold:: ?union<number, {top: number, right: number, bottom: number, left: number}>
            //   Determines the distance (in pixels) between the cursor and the
            //   end of the visible viewport at which point, when scrolling the
            //   cursor into view, scrolling takes place. Defaults to 0.
            //
            //   scrollMargin:: ?union<number, {top: number, right: number, bottom: number, left: number}>
            //   Determines the extra space (in pixels) that is left above or
            //   below the cursor when it is scrolled into view. Defaults to 5.

            // DirectEditorProps:: interface extends EditorProps
            //
            // The props object given directly to the editor view supports two
            // fields that can't be used in plugins:
            //
            //   state:: EditorState
            //   The current state of the editor.
            //
            //   plugins:: [Plugin]
            //   A set of plugins to use in the view, applying their [plugin
            //   view](#state.PluginSpec.view) and
            //   [props](#state.PluginSpec.props). Passing plugins with a state
            //   component (a [state field](#state.PluginSpec.state) field or a
            //   [transaction)[#state.PluginSpec.filterTransaction] filter or
            //   appender) will result in an error, since such plugins must be
            //   present in the state to work.
            //
            //   dispatchTransaction:: ?(tr: Transaction)
            //   The callback over which to send transactions (state updates)
            //   produced by the view. If you specify this, you probably want to
            //   make sure this ends up calling the view's
            //   [`updateState`](#view.EditorView.updateState) method with a new
            //   state that has the transaction
            //   [applied](#state.EditorState.apply). The callback will be bound to have
            //   the view instance as its `this` binding.

            //# sourceMappingURL=index.es.js.map

            /***/
        },
    },
]);
