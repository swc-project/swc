"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        453
    ],
    {
        /***/ 8780: /***/ function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__), /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ Decoration: function() {
                    return /* binding */ Decoration;
                },
                /* harmony export */ DecorationSet: function() {
                    return /* binding */ DecorationSet;
                },
                /* harmony export */ EditorView: function() {
                    return /* binding */ EditorView;
                },
                /* harmony export */ __endComposition: function() {
                    return /* binding */ endComposition;
                },
                /* harmony export */ __parseFromClipboard: function() {
                    return /* binding */ parseFromClipboard;
                },
                /* harmony export */ __serializeForClipboard: function() {
                    return /* binding */ serializeForClipboard;
                }
            });
            /* harmony import */ var prosemirror_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6922), prosemirror_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2230), prosemirror_transform__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1081), result = {};
            if ("undefined" != typeof navigator && "undefined" != typeof document) {
                var ie_edge = /Edge\/(\d+)/.exec(navigator.userAgent), ie_upto10 = /MSIE \d/.test(navigator.userAgent), ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), ie = result.ie = !!(ie_upto10 || ie_11up || ie_edge);
                result.ie_version = ie_upto10 ? document.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : null, result.gecko = !ie && /gecko\/(\d+)/i.test(navigator.userAgent), result.gecko_version = result.gecko && +(/Firefox\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0
                ])[1];
                var chrome = !ie && /Chrome\/(\d+)/.exec(navigator.userAgent);
                result.chrome = !!chrome, result.chrome_version = chrome && +chrome[1], // Is true for both iOS and iPadOS for convenience
                result.safari = !ie && /Apple Computer/.test(navigator.vendor), result.ios = result.safari && (/Mobile\/\w+/.test(navigator.userAgent) || navigator.maxTouchPoints > 2), result.mac = result.ios || /Mac/.test(navigator.platform), result.android = /Android \d/.test(navigator.userAgent), result.webkit = "webkitFontSmoothing" in document.documentElement.style, result.webkit_version = result.webkit && +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0
                ])[1];
            }
            var domIndex = function(node) {
                for(var index = 0;; index++)if (!(node = node.previousSibling)) return index;
            }, parentNode = function(node) {
                var parent = node.assignedSlot || node.parentNode;
                return parent && 11 == parent.nodeType ? parent.host : parent;
            }, reusedRange = null, textRange = function(node, from, to) {
                var range = reusedRange || (reusedRange = document.createRange());
                return range.setEnd(node, null == to ? node.nodeValue.length : to), range.setStart(node, from || 0), range;
            }, isEquivalentPosition = function(node, off, targetNode, targetOff) {
                return targetNode && (scanFor(node, off, targetNode, targetOff, -1) || scanFor(node, off, targetNode, targetOff, 1));
            }, atomElements = /^(img|br|input|textarea|hr)$/i;
            function scanFor(node, off, targetNode, targetOff, dir) {
                for(;;){
                    if (node == targetNode && off == targetOff) return !0;
                    if (off == (dir < 0 ? 0 : nodeSize(node))) {
                        var parent = node.parentNode;
                        if (1 != parent.nodeType || function(dom) {
                            for(var desc, cur = dom; cur && !(desc = cur.pmViewDesc); cur = cur.parentNode);
                            return desc && desc.node && desc.node.isBlock && (desc.dom == dom || desc.contentDOM == dom);
                        }(node) || atomElements.test(node.nodeName) || "false" == node.contentEditable) return !1;
                        off = domIndex(node) + (dir < 0 ? 0 : 1), node = parent;
                    } else {
                        if (1 != node.nodeType || "false" == (node = node.childNodes[off + (dir < 0 ? -1 : 0)]).contentEditable) return !1;
                        off = dir < 0 ? nodeSize(node) : 0;
                    }
                }
            }
            function nodeSize(node) {
                return 3 == node.nodeType ? node.nodeValue.length : node.childNodes.length;
            }
            // Work around Chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=447523
            // (isCollapsed inappropriately returns true in shadow dom)
            var selectionCollapsed = function(domSel) {
                var collapsed = domSel.isCollapsed;
                return collapsed && result.chrome && domSel.rangeCount && !domSel.getRangeAt(0).collapsed && (collapsed = !1), collapsed;
            };
            function keyEvent(keyCode, key) {
                var event = document.createEvent("Event");
                return event.initEvent("keydown", !0, !0), event.keyCode = keyCode, event.key = event.code = key, event;
            }
            function getSide(value, side) {
                return "number" == typeof value ? value : value[side];
            }
            function scrollRectIntoView(view, rect, startDOM) {
                for(var scrollThreshold = view.someProp("scrollThreshold") || 0, scrollMargin = view.someProp("scrollMargin") || 5, doc = view.dom.ownerDocument, parent = startDOM || view.dom; parent; parent = parentNode(parent))if (1 == parent.nodeType) {
                    var atTop = parent == doc.body || 1 != parent.nodeType, bounding = atTop ? {
                        left: 0,
                        right: doc.documentElement.clientWidth,
                        top: 0,
                        bottom: doc.documentElement.clientHeight
                    } : function(node) {
                        var rect = node.getBoundingClientRect(), scaleX = rect.width / node.offsetWidth || 1, scaleY = rect.height / node.offsetHeight || 1;
                        // Make sure scrollbar width isn't included in the rectangle
                        return {
                            left: rect.left,
                            right: rect.left + node.clientWidth * scaleX,
                            top: rect.top,
                            bottom: rect.top + node.clientHeight * scaleY
                        };
                    }(parent), moveX = 0, moveY = 0;
                    if (rect.top < bounding.top + getSide(scrollThreshold, "top") ? moveY = -(bounding.top - rect.top + getSide(scrollMargin, "top")) : rect.bottom > bounding.bottom - getSide(scrollThreshold, "bottom") && (moveY = rect.bottom - bounding.bottom + getSide(scrollMargin, "bottom")), rect.left < bounding.left + getSide(scrollThreshold, "left") ? moveX = -(bounding.left - rect.left + getSide(scrollMargin, "left")) : rect.right > bounding.right - getSide(scrollThreshold, "right") && (moveX = rect.right - bounding.right + getSide(scrollMargin, "right")), moveX || moveY) {
                        if (atTop) doc.defaultView.scrollBy(moveX, moveY);
                        else {
                            var startX = parent.scrollLeft, startY = parent.scrollTop;
                            moveY && (parent.scrollTop += moveY), moveX && (parent.scrollLeft += moveX);
                            var dX = parent.scrollLeft - startX, dY = parent.scrollTop - startY;
                            rect = {
                                left: rect.left - dX,
                                top: rect.top - dY,
                                right: rect.right - dX,
                                bottom: rect.bottom - dY
                            };
                        }
                    }
                    if (atTop) break;
                }
            }
            function scrollStack(dom) {
                for(var stack = [], doc = dom.ownerDocument; dom && (stack.push({
                    dom: dom,
                    top: dom.scrollTop,
                    left: dom.scrollLeft
                }), dom != doc); dom = parentNode(dom));
                return stack;
            }
            function restoreScrollStack(stack, dTop) {
                for(var i = 0; i < stack.length; i++){
                    var ref = stack[i], dom = ref.dom, top = ref.top, left = ref.left;
                    dom.scrollTop != top + dTop && (dom.scrollTop = top + dTop), dom.scrollLeft != left && (dom.scrollLeft = left);
                }
            }
            var preventScrollSupported = null;
            function inRect(coords, rect) {
                return coords.left >= rect.left - 1 && coords.left <= rect.right + 1 && coords.top >= rect.top - 1 && coords.top <= rect.bottom + 1;
            }
            function singleRect(object, bias) {
                var rects = object.getClientRects();
                return rects.length ? rects[bias < 0 ? 0 : rects.length - 1] : object.getBoundingClientRect();
            }
            var BIDI = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
            // : (EditorView, number, number) → {left: number, top: number, right: number, bottom: number}
            // Given a position in the document model, get a bounding box of the
            // character at that position, relative to the window.
            function coordsAtPos(view, pos, side) {
                var ref = view.docView.domFromPos(pos, side < 0 ? -1 : 1), node = ref.node, offset = ref.offset, supportEmptyRange = result.webkit || result.gecko;
                if (3 == node.nodeType) {
                    // These browsers support querying empty text ranges. Prefer that in
                    // bidi context or when at the end of a node.
                    if (supportEmptyRange && (BIDI.test(node.nodeValue) || (side < 0 ? !offset : offset == node.nodeValue.length))) {
                        var rect = singleRect(textRange(node, offset, offset), side);
                        // Firefox returns bad results (the position before the space)
                        // when querying a position directly after line-broken
                        // whitespace. Detect this situation and and kludge around it
                        if (result.gecko && offset && /\s/.test(node.nodeValue[offset - 1]) && offset < node.nodeValue.length) {
                            var rectBefore = singleRect(textRange(node, offset - 1, offset - 1), -1);
                            if (rectBefore.top == rect.top) {
                                var rectAfter = singleRect(textRange(node, offset, offset + 1), -1);
                                if (rectAfter.top != rect.top) return flattenV(rectAfter, rectAfter.left < rectBefore.left);
                            }
                        }
                        return rect;
                    }
                    var from = offset, to = offset, takeSide = side < 0 ? 1 : -1;
                    return side < 0 && !offset ? (to++, takeSide = -1) : side >= 0 && offset == node.nodeValue.length ? (from--, takeSide = 1) : side < 0 ? from-- : to++, flattenV(singleRect(textRange(node, from, to), takeSide), takeSide < 0);
                }
                // Return a horizontal line in block context
                if (!view.state.doc.resolve(pos).parent.inlineContent) {
                    if (offset && (side < 0 || offset == nodeSize(node))) {
                        var before = node.childNodes[offset - 1];
                        if (1 == before.nodeType) return flattenH(before.getBoundingClientRect(), !1);
                    }
                    if (offset < nodeSize(node)) {
                        var after = node.childNodes[offset];
                        if (1 == after.nodeType) return flattenH(after.getBoundingClientRect(), !0);
                    }
                    return flattenH(node.getBoundingClientRect(), side >= 0);
                }
                // Inline, not in text node (this is not Bidi-safe)
                if (offset && (side < 0 || offset == nodeSize(node))) {
                    var before$1 = node.childNodes[offset - 1], target = 3 == before$1.nodeType ? textRange(before$1, nodeSize(before$1) - (supportEmptyRange ? 0 : 1)) : // Only use them if they are the last element in their parent
                    1 != before$1.nodeType || "BR" == before$1.nodeName && before$1.nextSibling ? null : before$1;
                    if (target) return flattenV(singleRect(target, 1), !1);
                }
                if (offset < nodeSize(node)) {
                    for(var after$1 = node.childNodes[offset]; after$1.pmViewDesc && after$1.pmViewDesc.ignoreForCoords;)after$1 = after$1.nextSibling;
                    var target$1 = after$1 ? 3 == after$1.nodeType ? textRange(after$1, 0, supportEmptyRange ? 0 : 1) : 1 == after$1.nodeType ? after$1 : null : null;
                    if (target$1) return flattenV(singleRect(target$1, -1), !0);
                }
                // All else failed, just try to get a rectangle for the target node
                return flattenV(singleRect(3 == node.nodeType ? textRange(node) : node, -side), side >= 0);
            }
            function flattenV(rect, left) {
                if (0 == rect.width) return rect;
                var x = left ? rect.left : rect.right;
                return {
                    top: rect.top,
                    bottom: rect.bottom,
                    left: x,
                    right: x
                };
            }
            function flattenH(rect, top) {
                if (0 == rect.height) return rect;
                var y = top ? rect.top : rect.bottom;
                return {
                    top: y,
                    bottom: y,
                    left: rect.left,
                    right: rect.right
                };
            }
            function withFlushedState(view, state, f) {
                var viewState = view.state, active = view.root.activeElement;
                viewState != state && view.updateState(state), active != view.dom && view.focus();
                try {
                    return f();
                } finally{
                    viewState != state && view.updateState(viewState), active != view.dom && active && active.focus();
                }
            }
            var maybeRTL = /[\u0590-\u08ac]/, cachedState = null, cachedDir = null, cachedResult = !1, ViewDesc = function(parent, children, dom, contentDOM) {
                this.parent = parent, this.children = children, this.dom = dom, // An expando property on the DOM node provides a link back to its
                // description.
                dom.pmViewDesc = this, // This is the node that holds the child views. It may be null for
                // descs that don't have children.
                this.contentDOM = contentDOM, this.dirty = 0;
            }, prototypeAccessors = {
                size: {
                    configurable: !0
                },
                border: {
                    configurable: !0
                },
                posBefore: {
                    configurable: !0
                },
                posAtStart: {
                    configurable: !0
                },
                posAfter: {
                    configurable: !0
                },
                posAtEnd: {
                    configurable: !0
                },
                contentLost: {
                    configurable: !0
                },
                domAtom: {
                    configurable: !0
                },
                ignoreForCoords: {
                    configurable: !0
                }
            };
            // Used to check whether a given description corresponds to a
            // widget/mark/node.
            ViewDesc.prototype.matchesWidget = function() {
                return !1;
            }, ViewDesc.prototype.matchesMark = function() {
                return !1;
            }, ViewDesc.prototype.matchesNode = function() {
                return !1;
            }, ViewDesc.prototype.matchesHack = function(_nodeName) {
                return !1;
            }, // : () → ?ParseRule
            // When parsing in-editor content (in domchange.js), we allow
            // descriptions to determine the parse rules that should be used to
            // parse them.
            ViewDesc.prototype.parseRule = function() {
                return null;
            }, // : (dom.Event) → bool
            // Used by the editor's event handler to ignore events that come
            // from certain descs.
            ViewDesc.prototype.stopEvent = function() {
                return !1;
            }, // The size of the content represented by this desc.
            prototypeAccessors.size.get = function() {
                for(var size = 0, i = 0; i < this.children.length; i++)size += this.children[i].size;
                return size;
            }, // For block nodes, this represents the space taken up by their
            // start/end tokens.
            prototypeAccessors.border.get = function() {
                return 0;
            }, ViewDesc.prototype.destroy = function() {
                this.parent = null, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = null);
                for(var i = 0; i < this.children.length; i++)this.children[i].destroy();
            }, ViewDesc.prototype.posBeforeChild = function(child) {
                for(var i = 0, pos = this.posAtStart; i < this.children.length; i++){
                    var cur = this.children[i];
                    if (cur == child) return pos;
                    pos += cur.size;
                }
            }, prototypeAccessors.posBefore.get = function() {
                return this.parent.posBeforeChild(this);
            }, prototypeAccessors.posAtStart.get = function() {
                return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
            }, prototypeAccessors.posAfter.get = function() {
                return this.posBefore + this.size;
            }, prototypeAccessors.posAtEnd.get = function() {
                return this.posAtStart + this.size - 2 * this.border;
            }, // : (dom.Node, number, ?number) → number
            ViewDesc.prototype.localPosFromDOM = function(dom, offset, bias) {
                // If the DOM position is in the content, use the child desc after
                // it to figure out a position.
                if (this.contentDOM && this.contentDOM.contains(1 == dom.nodeType ? dom : dom.parentNode)) {
                    if (bias < 0) {
                        if (dom == this.contentDOM) domBefore = dom.childNodes[offset - 1];
                        else {
                            for(; dom.parentNode != this.contentDOM;)dom = dom.parentNode;
                            domBefore = dom.previousSibling;
                        }
                        for(; domBefore && !((desc = domBefore.pmViewDesc) && desc.parent == this);)domBefore = domBefore.previousSibling;
                        return domBefore ? this.posBeforeChild(desc) + desc.size : this.posAtStart;
                    }
                    if (dom == this.contentDOM) domAfter = dom.childNodes[offset];
                    else {
                        for(; dom.parentNode != this.contentDOM;)dom = dom.parentNode;
                        domAfter = dom.nextSibling;
                    }
                    for(; domAfter && !((desc$1 = domAfter.pmViewDesc) && desc$1.parent == this);)domAfter = domAfter.nextSibling;
                    return domAfter ? this.posBeforeChild(desc$1) : this.posAtEnd;
                }
                if (dom == this.dom && this.contentDOM) atEnd = offset > domIndex(this.contentDOM);
                else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM)) atEnd = 2 & dom.compareDocumentPosition(this.contentDOM);
                else if (this.dom.firstChild) {
                    if (0 == offset) for(var domBefore, desc, domAfter, desc$1, atEnd, search = dom;; search = search.parentNode){
                        if (search == this.dom) {
                            atEnd = !1;
                            break;
                        }
                        if (search.parentNode.firstChild != search) break;
                    }
                    if (null == atEnd && offset == dom.childNodes.length) for(var search$1 = dom;; search$1 = search$1.parentNode){
                        if (search$1 == this.dom) {
                            atEnd = !0;
                            break;
                        }
                        if (search$1.parentNode.lastChild != search$1) break;
                    }
                }
                return (null == atEnd ? bias > 0 : atEnd) ? this.posAtEnd : this.posAtStart;
            }, // Scan up the dom finding the first desc that is a descendant of
            // this one.
            ViewDesc.prototype.nearestDesc = function(dom, onlyNodes) {
                for(var first = !0, cur = dom; cur; cur = cur.parentNode){
                    var desc = this.getDesc(cur);
                    if (desc && (!onlyNodes || desc.node)) {
                        // If dom is outside of this desc's nodeDOM, don't count it.
                        if (!first || !desc.nodeDOM || (1 == desc.nodeDOM.nodeType ? desc.nodeDOM.contains(1 == dom.nodeType ? dom : dom.parentNode) : desc.nodeDOM == dom)) return desc;
                        first = !1;
                    }
                }
            }, ViewDesc.prototype.getDesc = function(dom) {
                for(var desc = dom.pmViewDesc, cur = desc; cur; cur = cur.parent)if (cur == this) return desc;
            }, ViewDesc.prototype.posFromDOM = function(dom, offset, bias) {
                for(var scan = dom; scan; scan = scan.parentNode){
                    var desc = this.getDesc(scan);
                    if (desc) return desc.localPosFromDOM(dom, offset, bias);
                }
                return -1;
            }, // : (number) → ?NodeViewDesc
            // Find the desc for the node after the given pos, if any. (When a
            // parent node overrode rendering, there might not be one.)
            ViewDesc.prototype.descAt = function(pos) {
                for(var i = 0, offset = 0; i < this.children.length; i++){
                    var child = this.children[i], end = offset + child.size;
                    if (offset == pos && end != offset) {
                        for(; !child.border && child.children.length;)child = child.children[0];
                        return child;
                    }
                    if (pos < end) return child.descAt(pos - offset - child.border);
                    offset = end;
                }
            }, // : (number, number) → {node: dom.Node, offset: number}
            ViewDesc.prototype.domFromPos = function(pos, side) {
                if (!this.contentDOM) return {
                    node: this.dom,
                    offset: 0
                };
                for(var i = 0, offset = 0, curPos = 0; i < this.children.length; i++){
                    var child = this.children[i], end = curPos + child.size;
                    if (end > pos || child instanceof TrailingHackViewDesc) {
                        offset = pos - curPos;
                        break;
                    }
                    curPos = end;
                }
                // If this points into the middle of a child, call through
                if (offset) return this.children[i].domFromPos(offset - this.children[i].border, side);
                // Go back if there were any zero-length widgets with side >= 0 before this point
                for(var prev = void 0; i && !(prev = this.children[i - 1]).size && prev instanceof WidgetViewDesc && prev.widget.type.side >= 0; i--);
                // Scan towards the first useable node
                if (side <= 0) {
                    for(var prev$1, enter = !0; (prev$1 = i ? this.children[i - 1] : null) && prev$1.dom.parentNode != this.contentDOM; i--, enter = !1);
                    return prev$1 && side && enter && !prev$1.border && !prev$1.domAtom ? prev$1.domFromPos(prev$1.size, side) : {
                        node: this.contentDOM,
                        offset: prev$1 ? domIndex(prev$1.dom) + 1 : 0
                    };
                }
                for(var next, enter$1 = !0; (next = i < this.children.length ? this.children[i] : null) && next.dom.parentNode != this.contentDOM; i++, enter$1 = !1);
                return next && enter$1 && !next.border && !next.domAtom ? next.domFromPos(0, side) : {
                    node: this.contentDOM,
                    offset: next ? domIndex(next.dom) : this.contentDOM.childNodes.length
                };
            }, // Used to find a DOM range in a single parent for a given changed
            // range.
            ViewDesc.prototype.parseRange = function(from, to, base) {
                if (void 0 === base && (base = 0), 0 == this.children.length) return {
                    node: this.contentDOM,
                    from: from,
                    to: to,
                    fromOffset: 0,
                    toOffset: this.contentDOM.childNodes.length
                };
                for(var fromOffset = -1, toOffset = -1, offset = base, i = 0;; i++){
                    var child = this.children[i], end = offset + child.size;
                    if (-1 == fromOffset && from <= end) {
                        var childBase = offset + child.border;
                        // FIXME maybe descend mark views to parse a narrower range?
                        if (from >= childBase && to <= end - child.border && child.node && child.contentDOM && this.contentDOM.contains(child.contentDOM)) return child.parseRange(from, to, childBase);
                        from = offset;
                        for(var j = i; j > 0; j--){
                            var prev = this.children[j - 1];
                            if (prev.size && prev.dom.parentNode == this.contentDOM && !prev.emptyChildAt(1)) {
                                fromOffset = domIndex(prev.dom) + 1;
                                break;
                            }
                            from -= prev.size;
                        }
                        -1 == fromOffset && (fromOffset = 0);
                    }
                    if (fromOffset > -1 && (end > to || i == this.children.length - 1)) {
                        to = end;
                        for(var j$1 = i + 1; j$1 < this.children.length; j$1++){
                            var next = this.children[j$1];
                            if (next.size && next.dom.parentNode == this.contentDOM && !next.emptyChildAt(-1)) {
                                toOffset = domIndex(next.dom);
                                break;
                            }
                            to += next.size;
                        }
                        -1 == toOffset && (toOffset = this.contentDOM.childNodes.length);
                        break;
                    }
                    offset = end;
                }
                return {
                    node: this.contentDOM,
                    from: from,
                    to: to,
                    fromOffset: fromOffset,
                    toOffset: toOffset
                };
            }, ViewDesc.prototype.emptyChildAt = function(side) {
                if (this.border || !this.contentDOM || !this.children.length) return !1;
                var child = this.children[side < 0 ? 0 : this.children.length - 1];
                return 0 == child.size || child.emptyChildAt(side);
            }, // : (number) → dom.Node
            ViewDesc.prototype.domAfterPos = function(pos) {
                var ref = this.domFromPos(pos, 0), node = ref.node, offset = ref.offset;
                if (1 != node.nodeType || offset == node.childNodes.length) throw RangeError("No node after pos " + pos);
                return node.childNodes[offset];
            }, // : (number, number, dom.Document)
            // View descs are responsible for setting any selection that falls
            // entirely inside of them, so that custom implementations can do
            // custom things with the selection. Note that this falls apart when
            // a selection starts in such a node and ends in another, in which
            // case we just use whatever domFromPos produces as a best effort.
            ViewDesc.prototype.setSelection = function(anchor, head, root, force) {
                for(var from = Math.min(anchor, head), to = Math.max(anchor, head), i = 0, offset = 0; i < this.children.length; i++){
                    var child = this.children[i], end = offset + child.size;
                    if (from > offset && to < end) return child.setSelection(anchor - offset - child.border, head - offset - child.border, root, force);
                    offset = end;
                }
                // If the selection falls entirely in a child, give it to that child
                var anchorDOM = this.domFromPos(anchor, anchor ? -1 : 1), headDOM = head == anchor ? anchorDOM : this.domFromPos(head, head ? -1 : 1), domSel = root.getSelection(), brKludge = !1;
                // On Firefox, using Selection.collapse to put the cursor after a
                // BR node for some reason doesn't always work (#1073). On Safari,
                // the cursor sometimes inexplicable visually lags behind its
                // reported position in such situations (#1092).
                if ((result.gecko || result.safari) && anchor == head) {
                    var node = anchorDOM.node, offset$1 = anchorDOM.offset;
                    if (3 == node.nodeType) // Issue #1128
                    {
                        if ((brKludge = offset$1 && "\n" == node.nodeValue[offset$1 - 1]) && offset$1 == node.nodeValue.length) for(var scan = node, after = void 0; scan; scan = scan.parentNode){
                            if (after = scan.nextSibling) {
                                "BR" == after.nodeName && (anchorDOM = headDOM = {
                                    node: after.parentNode,
                                    offset: domIndex(after) + 1
                                });
                                break;
                            }
                            var desc = scan.pmViewDesc;
                            if (desc && desc.node && desc.node.isBlock) break;
                        }
                    } else {
                        var prev = node.childNodes[offset$1 - 1];
                        brKludge = prev && ("BR" == prev.nodeName || "false" == prev.contentEditable);
                    }
                }
                // Firefox can act strangely when the selection is in front of an
                // uneditable node. See #1163 and https://bugzilla.mozilla.org/show_bug.cgi?id=1709536
                if (result.gecko && domSel.focusNode && domSel.focusNode != headDOM.node && 1 == domSel.focusNode.nodeType) {
                    var after$1 = domSel.focusNode.childNodes[domSel.focusOffset];
                    after$1 && "false" == after$1.contentEditable && (force = !0);
                }
                if (!(!(force || brKludge && result.safari) && isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset) && isEquivalentPosition(headDOM.node, headDOM.offset, domSel.focusNode, domSel.focusOffset))) {
                    // Selection.extend can be used to create an 'inverted' selection
                    // (one where the focus is before the anchor), but not all
                    // browsers support it yet.
                    var domSelExtended = !1;
                    if ((domSel.extend || anchor == head) && !brKludge) {
                        domSel.collapse(anchorDOM.node, anchorDOM.offset);
                        try {
                            anchor != head && domSel.extend(headDOM.node, headDOM.offset), domSelExtended = !0;
                        } catch (err) {
                            // In some cases with Chrome the selection is empty after calling
                            // collapse, even when it should be valid. This appears to be a bug, but
                            // it is difficult to isolate. If this happens fallback to the old path
                            // without using extend.
                            if (!(err instanceof DOMException)) throw err;
                        // declare global: DOMException
                        }
                    }
                    if (!domSelExtended) {
                        if (anchor > head) {
                            var tmp = anchorDOM;
                            anchorDOM = headDOM, headDOM = tmp;
                        }
                        var range = document.createRange();
                        range.setEnd(headDOM.node, headDOM.offset), range.setStart(anchorDOM.node, anchorDOM.offset), domSel.removeAllRanges(), domSel.addRange(range);
                    }
                }
            }, // : (dom.MutationRecord) → bool
            ViewDesc.prototype.ignoreMutation = function(mutation) {
                return !this.contentDOM && "selection" != mutation.type;
            }, prototypeAccessors.contentLost.get = function() {
                return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
            }, // Remove a subtree of the element tree that has been touched
            // by a DOM change, so that the next update will redraw it.
            ViewDesc.prototype.markDirty = function(from, to) {
                for(var offset = 0, i = 0; i < this.children.length; i++){
                    var child = this.children[i], end = offset + child.size;
                    if (offset == end ? from <= end && to >= offset : from < end && to > offset) {
                        var startInside = offset + child.border, endInside = end - child.border;
                        if (from >= startInside && to <= endInside) {
                            this.dirty = from == offset || to == end ? 2 : 1, from == startInside && to == endInside && (child.contentLost || child.dom.parentNode != this.contentDOM) ? child.dirty = 3 : child.markDirty(from - startInside, to - startInside);
                            return;
                        }
                        child.dirty = child.dom == child.contentDOM && child.dom.parentNode == this.contentDOM ? 2 : 3;
                    }
                    offset = end;
                }
                this.dirty = 2;
            }, ViewDesc.prototype.markParentsDirty = function() {
                for(var level = 1, node = this.parent; node; node = node.parent, level++){
                    var dirty = 1 == level ? 2 : 1;
                    node.dirty < dirty && (node.dirty = dirty);
                }
            }, prototypeAccessors.domAtom.get = function() {
                return !1;
            }, prototypeAccessors.ignoreForCoords.get = function() {
                return !1;
            }, Object.defineProperties(ViewDesc.prototype, prototypeAccessors);
            // Reused array to avoid allocating fresh arrays for things that will
            // stay empty anyway.
            var nothing = [], WidgetViewDesc = /*@__PURE__*/ function(ViewDesc) {
                function WidgetViewDesc(parent, widget, view, pos) {
                    var self1, dom = widget.type.toDOM;
                    if ("function" == typeof dom && (dom = dom(view, function() {
                        return self1 ? self1.parent ? self1.parent.posBeforeChild(self1) : void 0 : pos;
                    })), !widget.type.spec.raw) {
                        if (1 != dom.nodeType) {
                            var wrap = document.createElement("span");
                            wrap.appendChild(dom), dom = wrap;
                        }
                        dom.contentEditable = !1, dom.classList.add("ProseMirror-widget");
                    }
                    ViewDesc.call(this, parent, nothing, dom, null), this.widget = widget, self1 = this;
                }
                ViewDesc && (WidgetViewDesc.__proto__ = ViewDesc), WidgetViewDesc.prototype = Object.create(ViewDesc && ViewDesc.prototype), WidgetViewDesc.prototype.constructor = WidgetViewDesc;
                var prototypeAccessors$1 = {
                    domAtom: {
                        configurable: !0
                    }
                };
                return WidgetViewDesc.prototype.matchesWidget = function(widget) {
                    return 0 == this.dirty && widget.type.eq(this.widget.type);
                }, WidgetViewDesc.prototype.parseRule = function() {
                    return {
                        ignore: !0
                    };
                }, WidgetViewDesc.prototype.stopEvent = function(event) {
                    var stop = this.widget.spec.stopEvent;
                    return !!stop && stop(event);
                }, WidgetViewDesc.prototype.ignoreMutation = function(mutation) {
                    return "selection" != mutation.type || this.widget.spec.ignoreSelection;
                }, prototypeAccessors$1.domAtom.get = function() {
                    return !0;
                }, Object.defineProperties(WidgetViewDesc.prototype, prototypeAccessors$1), WidgetViewDesc;
            }(ViewDesc), CompositionViewDesc = /*@__PURE__*/ function(ViewDesc) {
                function CompositionViewDesc(parent, dom, textDOM, text) {
                    ViewDesc.call(this, parent, nothing, dom, null), this.textDOM = textDOM, this.text = text;
                }
                ViewDesc && (CompositionViewDesc.__proto__ = ViewDesc), CompositionViewDesc.prototype = Object.create(ViewDesc && ViewDesc.prototype), CompositionViewDesc.prototype.constructor = CompositionViewDesc;
                var prototypeAccessors$2 = {
                    size: {
                        configurable: !0
                    }
                };
                return prototypeAccessors$2.size.get = function() {
                    return this.text.length;
                }, CompositionViewDesc.prototype.localPosFromDOM = function(dom, offset) {
                    return dom != this.textDOM ? this.posAtStart + (offset ? this.size : 0) : this.posAtStart + offset;
                }, CompositionViewDesc.prototype.domFromPos = function(pos) {
                    return {
                        node: this.textDOM,
                        offset: pos
                    };
                }, CompositionViewDesc.prototype.ignoreMutation = function(mut) {
                    return "characterData" === mut.type && mut.target.nodeValue == mut.oldValue;
                }, Object.defineProperties(CompositionViewDesc.prototype, prototypeAccessors$2), CompositionViewDesc;
            }(ViewDesc), MarkViewDesc = /*@__PURE__*/ function(ViewDesc) {
                function MarkViewDesc(parent, mark, dom, contentDOM) {
                    ViewDesc.call(this, parent, [], dom, contentDOM), this.mark = mark;
                }
                return ViewDesc && (MarkViewDesc.__proto__ = ViewDesc), MarkViewDesc.prototype = Object.create(ViewDesc && ViewDesc.prototype), MarkViewDesc.prototype.constructor = MarkViewDesc, MarkViewDesc.create = function(parent, mark, inline, view) {
                    var custom = view.nodeViews[mark.type.name], spec = custom && custom(mark, view, inline);
                    return spec && spec.dom || (spec = prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMSerializer.renderSpec(document, mark.type.spec.toDOM(mark, inline))), new MarkViewDesc(parent, mark, spec.dom, spec.contentDOM || spec.dom);
                }, MarkViewDesc.prototype.parseRule = function() {
                    return {
                        mark: this.mark.type.name,
                        attrs: this.mark.attrs,
                        contentElement: this.contentDOM
                    };
                }, MarkViewDesc.prototype.matchesMark = function(mark) {
                    return 3 != this.dirty && this.mark.eq(mark);
                }, MarkViewDesc.prototype.markDirty = function(from, to) {
                    // Move dirty info to nearest node view
                    if (ViewDesc.prototype.markDirty.call(this, from, to), 0 != this.dirty) {
                        for(var parent = this.parent; !parent.node;)parent = parent.parent;
                        parent.dirty < this.dirty && (parent.dirty = this.dirty), this.dirty = 0;
                    }
                }, MarkViewDesc.prototype.slice = function(from, to, view) {
                    var copy = MarkViewDesc.create(this.parent, this.mark, !0, view), nodes = this.children, size = this.size;
                    to < size && (nodes = replaceNodes(nodes, to, size, view)), from > 0 && (nodes = replaceNodes(nodes, 0, from, view));
                    for(var i = 0; i < nodes.length; i++)nodes[i].parent = copy;
                    return copy.children = nodes, copy;
                }, MarkViewDesc;
            }(ViewDesc), NodeViewDesc = /*@__PURE__*/ function(ViewDesc) {
                function NodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, view, pos) {
                    ViewDesc.call(this, parent, node.isLeaf ? nothing : [], dom, contentDOM), this.nodeDOM = nodeDOM, this.node = node, this.outerDeco = outerDeco, this.innerDeco = innerDeco, contentDOM && this.updateChildren(view, pos);
                }
                ViewDesc && (NodeViewDesc.__proto__ = ViewDesc), NodeViewDesc.prototype = Object.create(ViewDesc && ViewDesc.prototype), NodeViewDesc.prototype.constructor = NodeViewDesc;
                var prototypeAccessors$3 = {
                    size: {
                        configurable: !0
                    },
                    border: {
                        configurable: !0
                    },
                    domAtom: {
                        configurable: !0
                    }
                };
                return(// By default, a node is rendered using the `toDOM` method from the
                // node type spec. But client code can use the `nodeViews` spec to
                // supply a custom node view, which can influence various aspects of
                // the way the node works.
                //
                // (Using subclassing for this was intentionally decided against,
                // since it'd require exposing a whole slew of finicky
                // implementation details to the user code that they probably will
                // never need.)
                NodeViewDesc.create = function(parent, node, outerDeco, innerDeco, view, pos) {
                    var assign, descObj, custom = view.nodeViews[node.type.name], spec = custom && custom(node, view, function() {
                        return(// (This is a function that allows the custom view to find its
                        // own position)
                        descObj ? descObj.parent ? descObj.parent.posBeforeChild(descObj) : void 0 : pos);
                    }, outerDeco, innerDeco), dom = spec && spec.dom, contentDOM = spec && spec.contentDOM;
                    if (node.isText) {
                        if (dom) {
                            if (3 != dom.nodeType) throw RangeError("Text must be rendered as a DOM text node");
                        } else dom = document.createTextNode(node.text);
                    } else dom || (dom = (assign = prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMSerializer.renderSpec(document, node.type.spec.toDOM(node))).dom, contentDOM = assign.contentDOM);
                    contentDOM || node.isText || "BR" == dom.nodeName || (dom.hasAttribute("contenteditable") || (dom.contentEditable = !1), node.type.spec.draggable && (dom.draggable = !0));
                    var nodeDOM = dom;
                    return (dom = applyOuterDeco(dom, outerDeco, node), spec) ? descObj = new CustomNodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, spec, view, pos + 1) : node.isText ? new TextViewDesc(parent, node, outerDeco, innerDeco, dom, nodeDOM, view) : new NodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, view, pos + 1);
                }, NodeViewDesc.prototype.parseRule = function() {
                    var this$1 = this;
                    // Experimental kludge to allow opt-in re-parsing of nodes
                    if (this.node.type.spec.reparseInView) return null;
                    // FIXME the assumption that this can always return the current
                    // attrs means that if the user somehow manages to change the
                    // attrs in the dom, that won't be picked up. Not entirely sure
                    // whether this is a problem
                    var rule = {
                        node: this.node.type.name,
                        attrs: this.node.attrs
                    };
                    return this.node.type.spec.code && (rule.preserveWhitespace = "full"), this.contentDOM && !this.contentLost ? rule.contentElement = this.contentDOM : rule.getContent = function() {
                        return this$1.contentDOM ? prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.empty : this$1.node.content;
                    }, rule;
                }, NodeViewDesc.prototype.matchesNode = function(node, outerDeco, innerDeco) {
                    return 0 == this.dirty && node.eq(this.node) && sameOuterDeco(outerDeco, this.outerDeco) && innerDeco.eq(this.innerDeco);
                }, prototypeAccessors$3.size.get = function() {
                    return this.node.nodeSize;
                }, prototypeAccessors$3.border.get = function() {
                    return this.node.isLeaf ? 0 : 1;
                }, // Syncs `this.children` to match `this.node.content` and the local
                // decorations, possibly introducing nesting for marks. Then, in a
                // separate step, syncs the DOM inside `this.contentDOM` to
                // `this.children`.
                NodeViewDesc.prototype.updateChildren = function(view, pos) {
                    var this$1 = this, inline = this.node.inlineContent, off = pos, composition = view.composing && this.localCompositionInfo(view, pos), localComposition = composition && composition.pos > -1 ? composition : null, compositionInChild = composition && composition.pos < 0, updater = new ViewTreeUpdater(this, localComposition && localComposition.node);
                    // : (ViewDesc, DecorationSource, (Decoration, number), (Node, [Decoration], DecorationSource, number))
                    // This function abstracts iterating over the nodes and decorations in
                    // a fragment. Calls `onNode` for each node, with its local and child
                    // decorations. Splits text nodes when there is a decoration starting
                    // or ending inside of them. Calls `onWidget` for each widget.
                    (function(parent, deco, onWidget, onNode) {
                        var locals = deco.locals(parent), offset = 0;
                        // Simple, cheap variant for when there are no local decorations
                        if (0 == locals.length) {
                            for(var i = 0; i < parent.childCount; i++){
                                var child = parent.child(i);
                                onNode(child, locals, deco.forChild(offset, child), i), offset += child.nodeSize;
                            }
                            return;
                        }
                        for(var decoIndex = 0, active = [], restNode = null, parentIndex = 0;;){
                            if (decoIndex < locals.length && locals[decoIndex].to == offset) {
                                for(var widget = locals[decoIndex++], widgets = void 0; decoIndex < locals.length && locals[decoIndex].to == offset;)(widgets || (widgets = [
                                    widget
                                ])).push(locals[decoIndex++]);
                                if (widgets) {
                                    widgets.sort(compareSide);
                                    for(var i$1 = 0; i$1 < widgets.length; i$1++)onWidget(widgets[i$1], parentIndex, !!restNode);
                                } else onWidget(widget, parentIndex, !!restNode);
                            }
                            var child$1 = void 0, index = void 0;
                            if (restNode) index = -1, child$1 = restNode, restNode = null;
                            else if (parentIndex < parent.childCount) index = parentIndex, child$1 = parent.child(parentIndex++);
                            else break;
                            for(var i$2 = 0; i$2 < active.length; i$2++)active[i$2].to <= offset && active.splice(i$2--, 1);
                            for(; decoIndex < locals.length && locals[decoIndex].from <= offset && locals[decoIndex].to > offset;)active.push(locals[decoIndex++]);
                            var end = offset + child$1.nodeSize;
                            if (child$1.isText) {
                                var cutAt = end;
                                decoIndex < locals.length && locals[decoIndex].from < cutAt && (cutAt = locals[decoIndex].from);
                                for(var i$3 = 0; i$3 < active.length; i$3++)active[i$3].to < cutAt && (cutAt = active[i$3].to);
                                cutAt < end && (restNode = child$1.cut(cutAt - offset), child$1 = child$1.cut(0, cutAt - offset), end = cutAt, index = -1);
                            }
                            var outerDeco = active.length ? child$1.isInline && !child$1.isLeaf ? active.filter(function(d) {
                                return !d.inline;
                            }) : active.slice() : nothing;
                            onNode(child$1, outerDeco, deco.forChild(offset, child$1), index), offset = end;
                        }
                    })(this.node, this.innerDeco, function(widget, i, insideNode) {
                        widget.spec.marks ? updater.syncToMarks(widget.spec.marks, inline, view) : widget.type.side >= 0 && !insideNode && updater.syncToMarks(i == this$1.node.childCount ? prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Mark.none : this$1.node.child(i).marks, inline, view), // If the next node is a desc matching this widget, reuse it,
                        // otherwise insert the widget as a new view desc.
                        updater.placeWidget(widget, view, off);
                    }, function(child, outerDeco, innerDeco, i) {
                        var compIndex;
                        // Make sure the wrapping mark descs match the node's marks.
                        updater.syncToMarks(child.marks, inline, view), updater.findNodeMatch(child, outerDeco, innerDeco, i) || compositionInChild && view.state.selection.from > off && view.state.selection.to < off + child.nodeSize && (compIndex = updater.findIndexWithChild(composition.node)) > -1 && updater.updateNodeAt(child, outerDeco, innerDeco, compIndex, view) || updater.updateNextNode(child, outerDeco, innerDeco, view, i) || // Add it as a new view
                        updater.addNode(child, outerDeco, innerDeco, view, off), off += child.nodeSize;
                    }), // Drop all remaining descs after the current position.
                    updater.syncToMarks(nothing, inline, view), this.node.isTextblock && updater.addTextblockHacks(), updater.destroyRest(), (updater.changed || 2 == this.dirty) && (localComposition && this.protectLocalComposition(view, localComposition), // : (dom.Node, [ViewDesc])
                    // Sync the content of the given DOM node with the nodes associated
                    // with the given array of view descs, recursing into mark descs
                    // because this should sync the subtree for a whole node at a time.
                    function renderDescs(parentDOM, descs, view) {
                        for(var dom = parentDOM.firstChild, written = !1, i = 0; i < descs.length; i++){
                            var desc = descs[i], childDOM = desc.dom;
                            if (childDOM.parentNode == parentDOM) {
                                for(; childDOM != dom;)dom = rm(dom), written = !0;
                                dom = dom.nextSibling;
                            } else written = !0, parentDOM.insertBefore(childDOM, dom);
                            if (desc instanceof MarkViewDesc) {
                                var pos = dom ? dom.previousSibling : parentDOM.lastChild;
                                renderDescs(desc.contentDOM, desc.children, view), dom = pos ? pos.nextSibling : parentDOM.firstChild;
                            }
                        }
                        for(; dom;)dom = rm(dom), written = !0;
                        written && view.trackWrites == parentDOM && (view.trackWrites = null);
                    }(this.contentDOM, this.children, view), result.ios && // List markers in Mobile Safari will mysteriously disappear
                    // sometimes. This works around that.
                    function(dom) {
                        if ("UL" == dom.nodeName || "OL" == dom.nodeName) {
                            var oldCSS = dom.style.cssText;
                            dom.style.cssText = oldCSS + "; list-style: square !important", window.getComputedStyle(dom).listStyle, dom.style.cssText = oldCSS;
                        }
                    }(this.dom));
                }, NodeViewDesc.prototype.localCompositionInfo = function(view, pos) {
                    // Only do something if both the selection and a focused text node
                    // are inside of this node
                    var ref = view.state.selection, from = ref.from, to = ref.to;
                    if (view.state.selection instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection && !(from < pos) && !(to > pos + this.node.content.size)) {
                        var sel = view.root.getSelection(), textNode = function(node, offset) {
                            for(;;){
                                if (3 == node.nodeType) return node;
                                if (1 == node.nodeType && offset > 0) {
                                    if (node.childNodes.length > offset && 3 == node.childNodes[offset].nodeType) return node.childNodes[offset];
                                    offset = nodeSize(node = node.childNodes[offset - 1]);
                                } else {
                                    if (1 != node.nodeType || !(offset < node.childNodes.length)) return null;
                                    node = node.childNodes[offset], offset = 0;
                                }
                            }
                        }(sel.focusNode, sel.focusOffset);
                        if (textNode && this.dom.contains(textNode.parentNode)) {
                            if (!this.node.inlineContent) return {
                                node: textNode,
                                pos: -1
                            };
                            // Find the text in the focused node in the node, stop if it's not
                            // there (may have been modified through other means, in which
                            // case it should overwritten)
                            var text = textNode.nodeValue, textPos = // Find a piece of text in an inline fragment, overlapping from-to
                            function(frag, text, from, to) {
                                for(var i = 0, pos = 0; i < frag.childCount && pos <= to;){
                                    var child = frag.child(i++), childStart = pos;
                                    if (pos += child.nodeSize, child.isText) {
                                        for(var str = child.text; i < frag.childCount;){
                                            var next = frag.child(i++);
                                            if (pos += next.nodeSize, !next.isText) break;
                                            str += next.text;
                                        }
                                        if (pos >= from) {
                                            var found = str.lastIndexOf(text, to - childStart);
                                            if (found >= 0 && found + text.length + childStart >= from) return childStart + found;
                                        }
                                    }
                                }
                                return -1;
                            }(this.node.content, text, from - pos, to - pos);
                            return textPos < 0 ? null : {
                                node: textNode,
                                pos: textPos,
                                text: text
                            };
                        }
                    }
                }, NodeViewDesc.prototype.protectLocalComposition = function(view, ref) {
                    var node = ref.node, pos = ref.pos, text = ref.text;
                    // The node is already part of a local view desc, leave it there
                    if (!this.getDesc(node)) {
                        for(// Create a composition view for the orphaned nodes
                        var topNode = node; topNode.parentNode != this.contentDOM; topNode = topNode.parentNode){
                            for(; topNode.previousSibling;)topNode.parentNode.removeChild(topNode.previousSibling);
                            for(; topNode.nextSibling;)topNode.parentNode.removeChild(topNode.nextSibling);
                            topNode.pmViewDesc && (topNode.pmViewDesc = null);
                        }
                        var desc = new CompositionViewDesc(this, topNode, node, text);
                        view.compositionNodes.push(desc), // Patch up this.children to contain the composition view
                        this.children = replaceNodes(this.children, pos, pos + text.length, view, desc);
                    }
                }, // : (Node, [Decoration], DecorationSource, EditorView) → bool
                // If this desc be updated to match the given node decoration,
                // do so and return true.
                NodeViewDesc.prototype.update = function(node, outerDeco, innerDeco, view) {
                    return !!(3 != this.dirty && node.sameMarkup(this.node)) && (this.updateInner(node, outerDeco, innerDeco, view), !0);
                }, NodeViewDesc.prototype.updateInner = function(node, outerDeco, innerDeco, view) {
                    this.updateOuterDeco(outerDeco), this.node = node, this.innerDeco = innerDeco, this.contentDOM && this.updateChildren(view, this.posAtStart), this.dirty = 0;
                }, NodeViewDesc.prototype.updateOuterDeco = function(outerDeco) {
                    if (!sameOuterDeco(outerDeco, this.outerDeco)) {
                        var needsWrap = 1 != this.nodeDOM.nodeType, oldDOM = this.dom;
                        this.dom = patchOuterDeco(this.dom, this.nodeDOM, computeOuterDeco(this.outerDeco, this.node, needsWrap), computeOuterDeco(outerDeco, this.node, needsWrap)), this.dom != oldDOM && (oldDOM.pmViewDesc = null, this.dom.pmViewDesc = this), this.outerDeco = outerDeco;
                    }
                }, // Mark this node as being the selected node.
                NodeViewDesc.prototype.selectNode = function() {
                    this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.dom.draggable = !0);
                }, // Remove selected node marking from this node.
                NodeViewDesc.prototype.deselectNode = function() {
                    this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.dom.removeAttribute("draggable");
                }, prototypeAccessors$3.domAtom.get = function() {
                    return this.node.isAtom;
                }, Object.defineProperties(NodeViewDesc.prototype, prototypeAccessors$3), NodeViewDesc);
            }(ViewDesc);
            // Create a view desc for the top-level document node, to be exported
            // and used by the view class.
            function docViewDesc(doc, outerDeco, innerDeco, dom, view) {
                return applyOuterDeco(dom, outerDeco, doc), new NodeViewDesc(null, doc, outerDeco, innerDeco, dom, dom, dom, view, 0);
            }
            var TextViewDesc = /*@__PURE__*/ function(NodeViewDesc) {
                function TextViewDesc(parent, node, outerDeco, innerDeco, dom, nodeDOM, view) {
                    NodeViewDesc.call(this, parent, node, outerDeco, innerDeco, dom, null, nodeDOM, view);
                }
                NodeViewDesc && (TextViewDesc.__proto__ = NodeViewDesc), TextViewDesc.prototype = Object.create(NodeViewDesc && NodeViewDesc.prototype), TextViewDesc.prototype.constructor = TextViewDesc;
                var prototypeAccessors$4 = {
                    domAtom: {
                        configurable: !0
                    }
                };
                return TextViewDesc.prototype.parseRule = function() {
                    for(var skip = this.nodeDOM.parentNode; skip && skip != this.dom && !skip.pmIsDeco;)skip = skip.parentNode;
                    return {
                        skip: skip || !0
                    };
                }, TextViewDesc.prototype.update = function(node, outerDeco, _, view) {
                    return !!(3 != this.dirty && (0 == this.dirty || this.inParent()) && node.sameMarkup(this.node)) && (this.updateOuterDeco(outerDeco), (0 != this.dirty || node.text != this.node.text) && node.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = node.text, view.trackWrites == this.nodeDOM && (view.trackWrites = null)), this.node = node, this.dirty = 0, !0);
                }, TextViewDesc.prototype.inParent = function() {
                    for(var parentDOM = this.parent.contentDOM, n = this.nodeDOM; n; n = n.parentNode)if (n == parentDOM) return !0;
                    return !1;
                }, TextViewDesc.prototype.domFromPos = function(pos) {
                    return {
                        node: this.nodeDOM,
                        offset: pos
                    };
                }, TextViewDesc.prototype.localPosFromDOM = function(dom, offset, bias) {
                    return dom == this.nodeDOM ? this.posAtStart + Math.min(offset, this.node.text.length) : NodeViewDesc.prototype.localPosFromDOM.call(this, dom, offset, bias);
                }, TextViewDesc.prototype.ignoreMutation = function(mutation) {
                    return "characterData" != mutation.type && "selection" != mutation.type;
                }, TextViewDesc.prototype.slice = function(from, to, view) {
                    var node = this.node.cut(from, to), dom = document.createTextNode(node.text);
                    return new TextViewDesc(this.parent, node, this.outerDeco, this.innerDeco, dom, dom, view);
                }, TextViewDesc.prototype.markDirty = function(from, to) {
                    NodeViewDesc.prototype.markDirty.call(this, from, to), this.dom != this.nodeDOM && (0 == from || to == this.nodeDOM.nodeValue.length) && (this.dirty = 3);
                }, prototypeAccessors$4.domAtom.get = function() {
                    return !1;
                }, Object.defineProperties(TextViewDesc.prototype, prototypeAccessors$4), TextViewDesc;
            }(NodeViewDesc), TrailingHackViewDesc = /*@__PURE__*/ function(ViewDesc) {
                function TrailingHackViewDesc() {
                    ViewDesc.apply(this, arguments);
                }
                ViewDesc && (TrailingHackViewDesc.__proto__ = ViewDesc), TrailingHackViewDesc.prototype = Object.create(ViewDesc && ViewDesc.prototype), TrailingHackViewDesc.prototype.constructor = TrailingHackViewDesc;
                var prototypeAccessors$5 = {
                    domAtom: {
                        configurable: !0
                    },
                    ignoreForCoords: {
                        configurable: !0
                    }
                };
                return TrailingHackViewDesc.prototype.parseRule = function() {
                    return {
                        ignore: !0
                    };
                }, TrailingHackViewDesc.prototype.matchesHack = function(nodeName) {
                    return 0 == this.dirty && this.dom.nodeName == nodeName;
                }, prototypeAccessors$5.domAtom.get = function() {
                    return !0;
                }, prototypeAccessors$5.ignoreForCoords.get = function() {
                    return "IMG" == this.dom.nodeName;
                }, Object.defineProperties(TrailingHackViewDesc.prototype, prototypeAccessors$5), TrailingHackViewDesc;
            }(ViewDesc), CustomNodeViewDesc = /*@__PURE__*/ function(NodeViewDesc) {
                function CustomNodeViewDesc(parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, spec, view, pos) {
                    NodeViewDesc.call(this, parent, node, outerDeco, innerDeco, dom, contentDOM, nodeDOM, view, pos), this.spec = spec;
                }
                return NodeViewDesc && (CustomNodeViewDesc.__proto__ = NodeViewDesc), CustomNodeViewDesc.prototype = Object.create(NodeViewDesc && NodeViewDesc.prototype), CustomNodeViewDesc.prototype.constructor = CustomNodeViewDesc, // A custom `update` method gets to decide whether the update goes
                // through. If it does, and there's a `contentDOM` node, our logic
                // updates the children.
                CustomNodeViewDesc.prototype.update = function(node, outerDeco, innerDeco, view) {
                    if (3 == this.dirty) return !1;
                    if (this.spec.update) {
                        var result = this.spec.update(node, outerDeco, innerDeco);
                        return result && this.updateInner(node, outerDeco, innerDeco, view), result;
                    }
                    return (!!this.contentDOM || !!node.isLeaf) && NodeViewDesc.prototype.update.call(this, node, outerDeco, innerDeco, view);
                }, CustomNodeViewDesc.prototype.selectNode = function() {
                    this.spec.selectNode ? this.spec.selectNode() : NodeViewDesc.prototype.selectNode.call(this);
                }, CustomNodeViewDesc.prototype.deselectNode = function() {
                    this.spec.deselectNode ? this.spec.deselectNode() : NodeViewDesc.prototype.deselectNode.call(this);
                }, CustomNodeViewDesc.prototype.setSelection = function(anchor, head, root, force) {
                    this.spec.setSelection ? this.spec.setSelection(anchor, head, root) : NodeViewDesc.prototype.setSelection.call(this, anchor, head, root, force);
                }, CustomNodeViewDesc.prototype.destroy = function() {
                    this.spec.destroy && this.spec.destroy(), NodeViewDesc.prototype.destroy.call(this);
                }, CustomNodeViewDesc.prototype.stopEvent = function(event) {
                    return !!this.spec.stopEvent && this.spec.stopEvent(event);
                }, CustomNodeViewDesc.prototype.ignoreMutation = function(mutation) {
                    return this.spec.ignoreMutation ? this.spec.ignoreMutation(mutation) : NodeViewDesc.prototype.ignoreMutation.call(this, mutation);
                }, CustomNodeViewDesc;
            }(NodeViewDesc);
            function OuterDecoLevel(nodeName) {
                nodeName && (this.nodeName = nodeName);
            }
            OuterDecoLevel.prototype = Object.create(null);
            var noDeco = [
                new OuterDecoLevel()
            ];
            function computeOuterDeco(outerDeco, node, needsWrap) {
                if (0 == outerDeco.length) return noDeco;
                for(var top = needsWrap ? noDeco[0] : new OuterDecoLevel(), result = [
                    top
                ], i = 0; i < outerDeco.length; i++){
                    var attrs = outerDeco[i].type.attrs;
                    if (attrs) for(var name in attrs.nodeName && result.push(top = new OuterDecoLevel(attrs.nodeName)), attrs){
                        var val = attrs[name];
                        null != val && (needsWrap && 1 == result.length && result.push(top = new OuterDecoLevel(node.isInline ? "span" : "div")), "class" == name ? top.class = (top.class ? top.class + " " : "") + val : "style" == name ? top.style = (top.style ? top.style + ";" : "") + val : "nodeName" != name && (top[name] = val));
                    }
                }
                return result;
            }
            function patchOuterDeco(outerDOM, nodeDOM, prevComputed, curComputed) {
                // Shortcut for trivial case
                if (prevComputed == noDeco && curComputed == noDeco) return nodeDOM;
                for(var curDOM = nodeDOM, i = 0; i < curComputed.length; i++){
                    var deco = curComputed[i], prev = prevComputed[i];
                    if (i) {
                        var parent = void 0;
                        prev && prev.nodeName == deco.nodeName && curDOM != outerDOM && (parent = curDOM.parentNode) && parent.tagName.toLowerCase() == deco.nodeName || ((parent = document.createElement(deco.nodeName)).pmIsDeco = !0, parent.appendChild(curDOM), prev = noDeco[0]), curDOM = parent;
                    }
                    !function(dom, prev, cur) {
                        for(var name in prev)"class" == name || "style" == name || "nodeName" == name || name in cur || dom.removeAttribute(name);
                        for(var name$1 in cur)"class" != name$1 && "style" != name$1 && "nodeName" != name$1 && cur[name$1] != prev[name$1] && dom.setAttribute(name$1, cur[name$1]);
                        if (prev.class != cur.class) {
                            for(var prevList = prev.class ? prev.class.split(" ").filter(Boolean) : nothing, curList = cur.class ? cur.class.split(" ").filter(Boolean) : nothing, i = 0; i < prevList.length; i++)-1 == curList.indexOf(prevList[i]) && dom.classList.remove(prevList[i]);
                            for(var i$1 = 0; i$1 < curList.length; i$1++)-1 == prevList.indexOf(curList[i$1]) && dom.classList.add(curList[i$1]);
                        }
                        if (prev.style != cur.style) {
                            if (prev.style) for(var m, prop = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g; m = prop.exec(prev.style);)dom.style.removeProperty(m[1]);
                            cur.style && (dom.style.cssText += cur.style);
                        }
                    }(curDOM, prev || noDeco[0], deco);
                }
                return curDOM;
            }
            function applyOuterDeco(dom, deco, node) {
                return patchOuterDeco(dom, dom, noDeco, computeOuterDeco(deco, node, 1 != dom.nodeType));
            }
            // : ([Decoration], [Decoration]) → bool
            function sameOuterDeco(a, b) {
                if (a.length != b.length) return !1;
                for(var i = 0; i < a.length; i++)if (!a[i].type.eq(b[i].type)) return !1;
                return !0;
            }
            // Remove a DOM node and return its next sibling.
            function rm(dom) {
                var next = dom.nextSibling;
                return dom.parentNode.removeChild(dom), next;
            }
            // Helper class for incrementally updating a tree of mark descs and
            // the widget and node descs inside of them.
            var ViewTreeUpdater = function(top, lockedNode) {
                this.top = top, this.lock = lockedNode, // Index into `this.top`'s child array, represents the current
                // update position.
                this.index = 0, // When entering a mark, the current top and index are pushed
                // onto this.
                this.stack = [], // Tracks whether anything was changed
                this.changed = !1, this.preMatch = // : (Fragment, [ViewDesc]) → {index: number, matched: Map<ViewDesc, number>}
                // Iterate from the end of the fragment and array of descs to find
                // directly matching ones, in order to avoid overeagerly reusing those
                // for other nodes. Returns the fragment index of the first node that
                // is part of the sequence of matched nodes at the end of the
                // fragment.
                function(frag, descs) {
                    for(var fI = frag.childCount, dI = descs.length, matched = new Map(); fI > 0 && dI > 0; dI--){
                        var desc = descs[dI - 1], node = desc.node;
                        if (node) {
                            if (node != frag.child(fI - 1)) break;
                            --fI, matched.set(desc, fI);
                        }
                    }
                    return {
                        index: fI,
                        matched: matched
                    };
                }(top.node.content, top.children);
            };
            function compareSide(a, b) {
                return a.type.side - b.type.side;
            }
            // Replace range from-to in an array of view descs with replacement
            // (may be null to just delete). This goes very much against the grain
            // of the rest of this code, which tends to create nodes with the
            // right shape in one go, rather than messing with them after
            // creation, but is necessary in the composition hack.
            function replaceNodes(nodes, from, to, view, replacement) {
                for(var result = [], i = 0, off = 0; i < nodes.length; i++){
                    var child = nodes[i], start = off, end = off += child.size;
                    start >= to || end <= from ? result.push(child) : (start < from && result.push(child.slice(0, from - start, view)), replacement && (result.push(replacement), replacement = null), end > to && result.push(child.slice(to - start, child.size, view)));
                }
                return result;
            }
            function selectionFromDOM(view, origin) {
                var domSel = view.root.getSelection(), doc = view.state.doc;
                if (!domSel.focusNode) return null;
                var nearestDesc = view.docView.nearestDesc(domSel.focusNode), inWidget = nearestDesc && 0 == nearestDesc.size, head = view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset);
                if (head < 0) return null;
                var $anchor, selection, $head = doc.resolve(head);
                if (selectionCollapsed(domSel)) {
                    for($anchor = $head; nearestDesc && !nearestDesc.node;)nearestDesc = nearestDesc.parent;
                    if (nearestDesc && nearestDesc.node.isAtom && prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(nearestDesc.node) && nearestDesc.parent && !(nearestDesc.node.isInline && function(node, offset, parent) {
                        for(var atStart = 0 == offset, atEnd = offset == nodeSize(node); atStart || atEnd;){
                            if (node == parent) return !0;
                            var index = domIndex(node);
                            if (!(node = node.parentNode)) return !1;
                            atStart = atStart && 0 == index, atEnd = atEnd && index == nodeSize(node);
                        }
                    }(domSel.focusNode, domSel.focusOffset, nearestDesc.dom))) {
                        var pos = nearestDesc.posBefore;
                        selection = new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection(head == pos ? $head : doc.resolve(pos));
                    }
                } else {
                    var anchor = view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
                    if (anchor < 0) return null;
                    $anchor = doc.resolve(anchor);
                }
                if (!selection) {
                    var bias = "pointer" == origin || view.state.selection.head < $head.pos && !inWidget ? 1 : -1;
                    selection = selectionBetween(view, $anchor, $head, bias);
                }
                return selection;
            }
            function editorOwnsSelection(view) {
                return view.editable ? view.hasFocus() : hasSelection(view) && document.activeElement && document.activeElement.contains(view.dom);
            }
            function selectionToDOM(view, force) {
                var sel = view.state.selection;
                if (syncNodeSelection(view, sel), editorOwnsSelection(view)) {
                    if (!force && view.mouseDown && view.mouseDown.allowDefault) {
                        view.mouseDown.delayedSelectionSync = !0, view.domObserver.setCurSelection();
                        return;
                    }
                    if (view.domObserver.disconnectSelection(), view.cursorWrapper) domSel = view.root.getSelection(), range = document.createRange(), (img = "IMG" == (node = view.cursorWrapper.dom).nodeName) ? range.setEnd(node.parentNode, domIndex(node) + 1) : range.setEnd(node, 0), range.collapse(!1), domSel.removeAllRanges(), domSel.addRange(range), !img && !view.state.selection.visible && result.ie && result.ie_version <= 11 && (node.disabled = !0, node.disabled = !1);
                    else {
                        var domSel, range, node, img, doc, domSel1, node1, offset, resetEditableFrom, resetEditableTo, anchor = sel.anchor, head = sel.head;
                        !brokenSelectBetweenUneditable || sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection || (sel.$from.parent.inlineContent || (resetEditableFrom = temporarilyEditableNear(view, sel.from)), sel.empty || sel.$from.parent.inlineContent || (resetEditableTo = temporarilyEditableNear(view, sel.to))), view.docView.setSelection(anchor, head, view.root, force), brokenSelectBetweenUneditable && (resetEditableFrom && resetEditable(resetEditableFrom), resetEditableTo && resetEditable(resetEditableTo)), sel.visible ? view.dom.classList.remove("ProseMirror-hideselection") : (view.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && ((doc = view.dom.ownerDocument).removeEventListener("selectionchange", view.hideSelectionGuard), node1 = (domSel1 = view.root.getSelection()).anchorNode, offset = domSel1.anchorOffset, doc.addEventListener("selectionchange", view.hideSelectionGuard = function() {
                            (domSel1.anchorNode != node1 || domSel1.anchorOffset != offset) && (doc.removeEventListener("selectionchange", view.hideSelectionGuard), setTimeout(function() {
                                (!editorOwnsSelection(view) || view.state.selection.visible) && view.dom.classList.remove("ProseMirror-hideselection");
                            }, 20));
                        })));
                    }
                    view.domObserver.setCurSelection(), view.domObserver.connectSelection();
                }
            }
            // Destroy and remove the children between the given indices in
            // `this.top`.
            ViewTreeUpdater.prototype.destroyBetween = function(start, end) {
                if (start != end) {
                    for(var i = start; i < end; i++)this.top.children[i].destroy();
                    this.top.children.splice(start, end - start), this.changed = !0;
                }
            }, // Destroy all remaining children in `this.top`.
            ViewTreeUpdater.prototype.destroyRest = function() {
                this.destroyBetween(this.index, this.top.children.length);
            }, // : ([Mark], EditorView)
            // Sync the current stack of mark descs with the given array of
            // marks, reusing existing mark descs when possible.
            ViewTreeUpdater.prototype.syncToMarks = function(marks, inline, view) {
                for(var keep = 0, depth = this.stack.length >> 1, maxKeep = Math.min(depth, marks.length); keep < maxKeep && (keep == depth - 1 ? this.top : this.stack[keep + 1 << 1]).matchesMark(marks[keep]) && !1 !== marks[keep].type.spec.spanning;)keep++;
                for(; keep < depth;)this.destroyRest(), this.top.dirty = 0, this.index = this.stack.pop(), this.top = this.stack.pop(), depth--;
                for(; depth < marks.length;){
                    this.stack.push(this.top, this.index + 1);
                    for(var found = -1, i = this.index; i < Math.min(this.index + 3, this.top.children.length); i++)if (this.top.children[i].matchesMark(marks[depth])) {
                        found = i;
                        break;
                    }
                    if (found > -1) found > this.index && (this.changed = !0, this.destroyBetween(this.index, found)), this.top = this.top.children[this.index];
                    else {
                        var markDesc = MarkViewDesc.create(this.top, marks[depth], inline, view);
                        this.top.children.splice(this.index, 0, markDesc), this.top = markDesc, this.changed = !0;
                    }
                    this.index = 0, depth++;
                }
            }, // : (Node, [Decoration], DecorationSource) → bool
            // Try to find a node desc matching the given data. Skip over it and
            // return true when successful.
            ViewTreeUpdater.prototype.findNodeMatch = function(node, outerDeco, innerDeco, index) {
                var children = this.top.children, found = -1;
                if (index >= this.preMatch.index) {
                    for(var i = this.index; i < children.length; i++)if (children[i].matchesNode(node, outerDeco, innerDeco)) {
                        found = i;
                        break;
                    }
                } else for(var i$1 = this.index, e = Math.min(children.length, i$1 + 1); i$1 < e; i$1++){
                    var child = children[i$1];
                    if (child.matchesNode(node, outerDeco, innerDeco) && !this.preMatch.matched.has(child)) {
                        found = i$1;
                        break;
                    }
                }
                return !(found < 0) && (this.destroyBetween(this.index, found), this.index++, !0);
            }, ViewTreeUpdater.prototype.updateNodeAt = function(node, outerDeco, innerDeco, index, view) {
                return !!this.top.children[index].update(node, outerDeco, innerDeco, view) && (this.destroyBetween(this.index, index), this.index = index + 1, !0);
            }, ViewTreeUpdater.prototype.findIndexWithChild = function(domNode) {
                for(;;){
                    var parent = domNode.parentNode;
                    if (!parent) return -1;
                    if (parent == this.top.contentDOM) {
                        var desc = domNode.pmViewDesc;
                        if (desc) {
                            for(var i = this.index; i < this.top.children.length; i++)if (this.top.children[i] == desc) return i;
                        }
                        return -1;
                    }
                    domNode = parent;
                }
            }, // : (Node, [Decoration], DecorationSource, EditorView, Fragment, number) → bool
            // Try to update the next node, if any, to the given data. Checks
            // pre-matches to avoid overwriting nodes that could still be used.
            ViewTreeUpdater.prototype.updateNextNode = function(node, outerDeco, innerDeco, view, index) {
                for(var i = this.index; i < this.top.children.length; i++){
                    var next = this.top.children[i];
                    if (next instanceof NodeViewDesc) {
                        var preMatch = this.preMatch.matched.get(next);
                        if (null != preMatch && preMatch != index) return !1;
                        var nextDOM = next.dom;
                        if (!(this.lock && (nextDOM == this.lock || 1 == nextDOM.nodeType && nextDOM.contains(this.lock.parentNode)) && !(node.isText && next.node && next.node.isText && next.nodeDOM.nodeValue == node.text && 3 != next.dirty && sameOuterDeco(outerDeco, next.outerDeco))) && next.update(node, outerDeco, innerDeco, view)) return this.destroyBetween(this.index, i), next.dom != nextDOM && (this.changed = !0), this.index++, !0;
                        break;
                    }
                }
                return !1;
            }, // : (Node, [Decoration], DecorationSource, EditorView)
            // Insert the node as a newly created node desc.
            ViewTreeUpdater.prototype.addNode = function(node, outerDeco, innerDeco, view, pos) {
                this.top.children.splice(this.index++, 0, NodeViewDesc.create(this.top, node, outerDeco, innerDeco, view, pos)), this.changed = !0;
            }, ViewTreeUpdater.prototype.placeWidget = function(widget, view, pos) {
                var next = this.index < this.top.children.length ? this.top.children[this.index] : null;
                if (next && next.matchesWidget(widget) && (widget == next.widget || !next.widget.type.toDOM.parentNode)) this.index++;
                else {
                    var desc = new WidgetViewDesc(this.top, widget, view, pos);
                    this.top.children.splice(this.index++, 0, desc), this.changed = !0;
                }
            }, // Make sure a textblock looks and behaves correctly in
            // contentEditable.
            ViewTreeUpdater.prototype.addTextblockHacks = function() {
                for(var lastChild = this.top.children[this.index - 1]; lastChild instanceof MarkViewDesc;)lastChild = lastChild.children[lastChild.children.length - 1];
                !(!lastChild || // Empty textblock
                !(lastChild instanceof TextViewDesc) || /\n$/.test(lastChild.node.text)) || ((result.safari || result.chrome) && lastChild && "false" == lastChild.dom.contentEditable && this.addHackNode("IMG"), this.addHackNode("BR"));
            }, ViewTreeUpdater.prototype.addHackNode = function(nodeName) {
                if (this.index < this.top.children.length && this.top.children[this.index].matchesHack(nodeName)) this.index++;
                else {
                    var dom = document.createElement(nodeName);
                    "IMG" == nodeName && (dom.className = "ProseMirror-separator"), "BR" == nodeName && (dom.className = "ProseMirror-trailingBreak"), this.top.children.splice(this.index++, 0, new TrailingHackViewDesc(this.top, nothing, dom, null)), this.changed = !0;
                }
            };
            // Kludge to work around Webkit not allowing a selection to start/end
            // between non-editable block nodes. We briefly make something
            // editable, set the selection, then set it uneditable again.
            var brokenSelectBetweenUneditable = result.safari || result.chrome && result.chrome_version < 63;
            function temporarilyEditableNear(view, pos) {
                var ref = view.docView.domFromPos(pos, 0), node = ref.node, offset = ref.offset, after = offset < node.childNodes.length ? node.childNodes[offset] : null, before = offset ? node.childNodes[offset - 1] : null;
                if (result.safari && after && "false" == after.contentEditable) return setEditable(after);
                if ((!after || "false" == after.contentEditable) && (!before || "false" == before.contentEditable)) {
                    if (after) return setEditable(after);
                    if (before) return setEditable(before);
                }
            }
            function setEditable(element) {
                return element.contentEditable = "true", result.safari && element.draggable && (element.draggable = !1, element.wasDraggable = !0), element;
            }
            function resetEditable(element) {
                element.contentEditable = "false", element.wasDraggable && (element.draggable = !0, element.wasDraggable = null);
            }
            function syncNodeSelection(view, sel) {
                if (sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection) {
                    var desc = view.docView.descAt(sel.from);
                    desc != view.lastSelectedViewDesc && (clearNodeSelection(view), desc && desc.selectNode(), view.lastSelectedViewDesc = desc);
                } else clearNodeSelection(view);
            }
            // Clear all DOM statefulness of the last node selection.
            function clearNodeSelection(view) {
                view.lastSelectedViewDesc && (view.lastSelectedViewDesc.parent && view.lastSelectedViewDesc.deselectNode(), view.lastSelectedViewDesc = null);
            }
            function selectionBetween(view, $anchor, $head, bias) {
                return view.someProp("createSelectionBetween", function(f) {
                    return f(view, $anchor, $head);
                }) || prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection.between($anchor, $head, bias);
            }
            function hasSelection(view) {
                var sel = view.root.getSelection();
                if (!sel.anchorNode) return !1;
                try {
                    // Firefox will raise 'permission denied' errors when accessing
                    // properties of `sel.anchorNode` when it's in a generated CSS
                    // element.
                    return view.dom.contains(3 == sel.anchorNode.nodeType ? sel.anchorNode.parentNode : sel.anchorNode) && (view.editable || view.dom.contains(3 == sel.focusNode.nodeType ? sel.focusNode.parentNode : sel.focusNode));
                } catch (_) {
                    return !1;
                }
            }
            function moveSelectionBlock(state, dir) {
                var ref = state.selection, $anchor = ref.$anchor, $head = ref.$head, $side = dir > 0 ? $anchor.max($head) : $anchor.min($head), $start = $side.parent.inlineContent ? $side.depth ? state.doc.resolve(dir > 0 ? $side.after() : $side.before()) : null : $side;
                return $start && prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.findFrom($start, dir);
            }
            function apply(view, sel) {
                return view.dispatch(view.state.tr.setSelection(sel).scrollIntoView()), !0;
            }
            function selectHorizontally(view, dir, mods) {
                var sel = view.state.selection;
                if (sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection) {
                    if (!sel.empty || mods.indexOf("s") > -1) return !1;
                    if (view.endOfTextblock(dir > 0 ? "right" : "left")) {
                        var next = moveSelectionBlock(view.state, dir);
                        return !!next && next instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection && apply(view, next);
                    }
                    if (!(result.mac && mods.indexOf("m") > -1)) {
                        var desc, $head = sel.$head, node = $head.textOffset ? null : dir < 0 ? $head.nodeBefore : $head.nodeAfter;
                        if (!node || node.isText) return !1;
                        var nodePos = dir < 0 ? $head.pos - node.nodeSize : $head.pos;
                        return !!(node.isAtom || (desc = view.docView.descAt(nodePos)) && !desc.contentDOM) && (prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(node) ? apply(view, new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection(dir < 0 ? view.state.doc.resolve($head.pos - node.nodeSize) : $head)) : !!result.webkit && apply(view, new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection(view.state.doc.resolve(dir < 0 ? nodePos : nodePos + node.nodeSize))));
                    }
                } else {
                    if (sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection && sel.node.isInline) return apply(view, new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection(dir > 0 ? sel.$to : sel.$from));
                    var next$1 = moveSelectionBlock(view.state, dir);
                    return !!next$1 && apply(view, next$1);
                }
            }
            function nodeLen(node) {
                return 3 == node.nodeType ? node.nodeValue.length : node.childNodes.length;
            }
            function isIgnorable(dom) {
                var desc = dom.pmViewDesc;
                return desc && 0 == desc.size && (dom.nextSibling || "BR" != dom.nodeName);
            }
            // Make sure the cursor isn't directly after one or more ignored
            // nodes, which will confuse the browser's cursor motion logic.
            function skipIgnoredNodesLeft(view) {
                var sel = view.root.getSelection(), node = sel.focusNode, offset = sel.focusOffset;
                if (node) {
                    var moveNode, moveOffset, force = !1;
                    for(result.gecko && 1 == node.nodeType && offset < nodeLen(node) && isIgnorable(node.childNodes[offset]) && (force = !0);;)if (offset > 0) {
                        if (1 != node.nodeType) break;
                        var before = node.childNodes[offset - 1];
                        if (isIgnorable(before)) moveNode = node, moveOffset = --offset;
                        else if (3 == before.nodeType) offset = (node = before).nodeValue.length;
                        else break;
                    } else if (isBlockNode(node)) break;
                    else {
                        for(var prev = node.previousSibling; prev && isIgnorable(prev);)moveNode = node.parentNode, moveOffset = domIndex(prev), prev = prev.previousSibling;
                        if (prev) offset = nodeLen(node = prev);
                        else {
                            if ((node = node.parentNode) == view.dom) break;
                            offset = 0;
                        }
                    }
                    force ? setSelFocus(view, sel, node, offset) : moveNode && setSelFocus(view, sel, moveNode, moveOffset);
                }
            }
            // Make sure the cursor isn't directly before one or more ignored
            // nodes.
            function skipIgnoredNodesRight(view) {
                var moveNode, moveOffset, sel = view.root.getSelection(), node = sel.focusNode, offset = sel.focusOffset;
                if (node) {
                    for(var len = nodeLen(node);;)if (offset < len) {
                        if (1 != node.nodeType) break;
                        if (isIgnorable(node.childNodes[offset])) moveNode = node, moveOffset = ++offset;
                        else break;
                    } else if (isBlockNode(node)) break;
                    else {
                        for(var next = node.nextSibling; next && isIgnorable(next);)moveNode = next.parentNode, moveOffset = domIndex(next) + 1, next = next.nextSibling;
                        if (next) offset = 0, len = nodeLen(node = next);
                        else {
                            if ((node = node.parentNode) == view.dom) break;
                            offset = len = 0;
                        }
                    }
                    moveNode && setSelFocus(view, sel, moveNode, moveOffset);
                }
            }
            function isBlockNode(dom) {
                var desc = dom.pmViewDesc;
                return desc && desc.node && desc.node.isBlock;
            }
            function setSelFocus(view, sel, node, offset) {
                if (selectionCollapsed(sel)) {
                    var range = document.createRange();
                    range.setEnd(node, offset), range.setStart(node, offset), sel.removeAllRanges(), sel.addRange(range);
                } else sel.extend && sel.extend(node, offset);
                view.domObserver.setCurSelection();
                var state = view.state;
                // If no state update ends up happening, reset the selection.
                setTimeout(function() {
                    view.state == state && selectionToDOM(view);
                }, 50);
            }
            // : (EditorState, number)
            // Check whether vertical selection motion would involve node
            // selections. If so, apply it (if not, the result is left to the
            // browser)
            function selectVertically(view, dir, mods) {
                var sel = view.state.selection;
                if (sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection && !sel.empty || mods.indexOf("s") > -1 || result.mac && mods.indexOf("m") > -1) return !1;
                var $from = sel.$from, $to = sel.$to;
                if (!$from.parent.inlineContent || view.endOfTextblock(dir < 0 ? "up" : "down")) {
                    var next = moveSelectionBlock(view.state, dir);
                    if (next && next instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection) return apply(view, next);
                }
                if (!$from.parent.inlineContent) {
                    var side = dir < 0 ? $from : $to, beyond = sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.AllSelection ? prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.near(side, dir) : prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.findFrom(side, dir);
                    return !!beyond && apply(view, beyond);
                }
                return !1;
            }
            function stopNativeHorizontalDelete(view, dir) {
                if (!(view.state.selection instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection)) return !0;
                var ref = view.state.selection, $head = ref.$head, $anchor = ref.$anchor, empty = ref.empty;
                if (!$head.sameParent($anchor)) return !0;
                if (!empty) return !1;
                if (view.endOfTextblock(dir > 0 ? "forward" : "backward")) return !0;
                var nextNode = !$head.textOffset && (dir < 0 ? $head.nodeBefore : $head.nodeAfter);
                if (nextNode && !nextNode.isText) {
                    var tr = view.state.tr;
                    return dir < 0 ? tr.delete($head.pos - nextNode.nodeSize, $head.pos) : tr.delete($head.pos, $head.pos + nextNode.nodeSize), view.dispatch(tr), !0;
                }
                return !1;
            }
            function switchEditable(view, node, state) {
                view.domObserver.stop(), node.contentEditable = state, view.domObserver.start();
            }
            function ruleFromNode(dom) {
                var desc = dom.pmViewDesc;
                if (desc) return desc.parseRule();
                if ("BR" == dom.nodeName && dom.parentNode) {
                    // Safari replaces the list item or table cell with a BR
                    // directly in the list node (?!) if you delete the last
                    // character in a list item or table cell (#708, #862)
                    if (result.safari && /^(ul|ol)$/i.test(dom.parentNode.nodeName)) {
                        var skip = document.createElement("div");
                        return skip.appendChild(document.createElement("li")), {
                            skip: skip
                        };
                    }
                    if (dom.parentNode.lastChild == dom || result.safari && /^(tr|table)$/i.test(dom.parentNode.nodeName)) return {
                        ignore: !0
                    };
                } else if ("IMG" == dom.nodeName && dom.getAttribute("mark-placeholder")) return {
                    ignore: !0
                };
            }
            function resolveSelection(view, doc, parsedSel) {
                return Math.max(parsedSel.anchor, parsedSel.head) > doc.content.size ? null : selectionBetween(view, doc.resolve(parsedSel.anchor), doc.resolve(parsedSel.head));
            }
            function skipClosingAndOpening($pos, fromEnd, mayOpen) {
                for(var depth = $pos.depth, end = fromEnd ? $pos.end() : $pos.pos; depth > 0 && (fromEnd || $pos.indexAfter(depth) == $pos.node(depth).childCount);)depth--, end++, fromEnd = !1;
                if (mayOpen) for(var next = $pos.node(depth).maybeChild($pos.indexAfter(depth)); next && !next.isLeaf;)next = next.firstChild, end++;
                return end;
            }
            function serializeForClipboard(view, slice) {
                for(var context = [], content = slice.content, openStart = slice.openStart, openEnd = slice.openEnd; openStart > 1 && openEnd > 1 && 1 == content.childCount && 1 == content.firstChild.childCount;){
                    openStart--, openEnd--;
                    var node = content.firstChild;
                    context.push(node.type.name, node.attrs != node.type.defaultAttrs ? node.attrs : null), content = node.content;
                }
                var serializer = view.someProp("clipboardSerializer") || prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMSerializer.fromSchema(view.state.schema), doc = detachedDoc(), wrap = doc.createElement("div");
                wrap.appendChild(serializer.serializeFragment(content, {
                    document: doc
                }));
                for(var needsWrap, firstChild = wrap.firstChild; firstChild && 1 == firstChild.nodeType && (needsWrap = wrapMap[firstChild.nodeName.toLowerCase()]);){
                    for(var i = needsWrap.length - 1; i >= 0; i--){
                        for(var wrapper = doc.createElement(needsWrap[i]); wrap.firstChild;)wrapper.appendChild(wrap.firstChild);
                        wrap.appendChild(wrapper), "tbody" != needsWrap[i] && (openStart++, openEnd++);
                    }
                    firstChild = wrap.firstChild;
                }
                return firstChild && 1 == firstChild.nodeType && firstChild.setAttribute("data-pm-slice", openStart + " " + openEnd + " " + JSON.stringify(context)), {
                    dom: wrap,
                    text: view.someProp("clipboardTextSerializer", function(f) {
                        return f(slice);
                    }) || slice.content.textBetween(0, slice.content.size, "\n\n")
                };
            }
            // : (EditorView, string, string, ?bool, ResolvedPos) → ?Slice
            // Read a slice of content from the clipboard (or drop data).
            function parseFromClipboard(view, text, html, plainText, $context) {
                var dom, slice, inCode = $context.parent.type.spec.code;
                if (!html && !text) return null;
                var asText = text && (plainText || inCode || !html);
                if (asText) {
                    if (view.someProp("transformPastedText", function(f) {
                        text = f(text, inCode || plainText);
                    }), inCode) return text ? new prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice(prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(view.state.schema.text(text.replace(/\r\n?/g, "\n"))), 0, 0) : prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice.empty;
                    var parsed = view.someProp("clipboardTextParser", function(f) {
                        return f(text, $context, plainText);
                    });
                    if (parsed) slice = parsed;
                    else {
                        var marks = $context.marks(), schema = view.state.schema, serializer = prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMSerializer.fromSchema(schema);
                        dom = document.createElement("div"), text.split(/(?:\r\n?|\n)+/).forEach(function(block) {
                            var p = dom.appendChild(document.createElement("p"));
                            block && p.appendChild(serializer.serializeNode(schema.text(block, marks)));
                        });
                    }
                } else view.someProp("transformPastedHTML", function(f) {
                    html = f(html);
                }), dom = function(html) {
                    var metas = /^(\s*<meta [^>]*>)*/.exec(html);
                    metas && (html = html.slice(metas[0].length));
                    var wrap, elt = detachedDoc().createElement("div"), firstTag = /<([a-z][^>\s]+)/i.exec(html);
                    if ((wrap = firstTag && wrapMap[firstTag[1].toLowerCase()]) && (html = wrap.map(function(n) {
                        return "<" + n + ">";
                    }).join("") + html + wrap.map(function(n) {
                        return "</" + n + ">";
                    }).reverse().join("")), elt.innerHTML = html, wrap) for(var i = 0; i < wrap.length; i++)elt = elt.querySelector(wrap[i]) || elt;
                    return elt;
                }(html), result.webkit && // Webkit browsers do some hard-to-predict replacement of regular
                // spaces with non-breaking spaces when putting content on the
                // clipboard. This tries to convert such non-breaking spaces (which
                // will be wrapped in a plain span on Chrome, a span with class
                // Apple-converted-space on Safari) back to regular spaces.
                function(dom) {
                    for(var nodes = dom.querySelectorAll(result.chrome ? "span:not([class]):not([style])" : "span.Apple-converted-space"), i = 0; i < nodes.length; i++){
                        var node = nodes[i];
                        1 == node.childNodes.length && "\u00a0" == node.textContent && node.parentNode && node.parentNode.replaceChild(dom.ownerDocument.createTextNode(" "), node);
                    }
                }(dom);
                var contextNode = dom && dom.querySelector("[data-pm-slice]"), sliceData = contextNode && /^(\d+) (\d+) (.*)/.exec(contextNode.getAttribute("data-pm-slice"));
                if (slice || (slice = (view.someProp("clipboardParser") || view.someProp("domParser") || prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMParser.fromSchema(view.state.schema)).parseSlice(dom, {
                    preserveWhitespace: !!(asText || sliceData),
                    context: $context
                })), sliceData) slice = function(slice, context) {
                    if (!slice.size) return slice;
                    var array, schema = slice.content.firstChild.type.schema;
                    try {
                        array = JSON.parse(context);
                    } catch (e) {
                        return slice;
                    }
                    for(var content = slice.content, openStart = slice.openStart, openEnd = slice.openEnd, i = array.length - 2; i >= 0; i -= 2){
                        var type = schema.nodes[array[i]];
                        if (!type || type.hasRequiredAttrs()) break;
                        content = prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(type.create(array[i + 1], content)), openStart++, openEnd++;
                    }
                    return new prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice(content, openStart, openEnd);
                }(closeSlice(slice, +sliceData[1], +sliceData[2]), sliceData[3]);
                else if (// HTML wasn't created by ProseMirror. Make sure top-level siblings are coherent
                (slice = prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice.maxOpen(// Takes a slice parsed with parseSlice, which means there hasn't been
                // any content-expression checking done on the top nodes, tries to
                // find a parent node in the current context that might fit the nodes,
                // and if successful, rebuilds the slice so that it fits into that parent.
                //
                // This addresses the problem that Transform.replace expects a
                // coherent slice, and will fail to place a set of siblings that don't
                // fit anywhere in the schema.
                function(fragment, $context) {
                    if (fragment.childCount < 2) return fragment;
                    for(var d = $context.depth; d >= 0; d--){
                        var returned = function(d) {
                            var match = $context.node(d).contentMatchAt($context.index(d)), lastWrap = void 0, result = [];
                            if (fragment.forEach(function(node) {
                                if (result) {
                                    var inLast, wrap = match.findWrapping(node.type);
                                    if (!wrap) return result = null;
                                    if (inLast = result.length && lastWrap.length && // Used to group adjacent nodes wrapped in similar parents by
                                    // normalizeSiblings into the same parent node
                                    function addToSibling(wrap, lastWrap, node, sibling, depth) {
                                        if (depth < wrap.length && depth < lastWrap.length && wrap[depth] == lastWrap[depth]) {
                                            var inner = addToSibling(wrap, lastWrap, node, sibling.lastChild, depth + 1);
                                            if (inner) return sibling.copy(sibling.content.replaceChild(sibling.childCount - 1, inner));
                                            if (sibling.contentMatchAt(sibling.childCount).matchType(depth == wrap.length - 1 ? node.type : wrap[depth + 1])) return sibling.copy(sibling.content.append(prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(withWrappers(node, wrap, depth + 1))));
                                        }
                                    }(wrap, lastWrap, node, result[result.length - 1], 0)) result[result.length - 1] = inLast;
                                    else {
                                        result.length && (result[result.length - 1] = function closeRight(node, depth) {
                                            if (0 == depth) return node;
                                            var fragment = node.content.replaceChild(node.childCount - 1, closeRight(node.lastChild, depth - 1)), fill = node.contentMatchAt(node.childCount).fillBefore(prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.empty, !0);
                                            return node.copy(fragment.append(fill));
                                        }(result[result.length - 1], lastWrap.length));
                                        var wrapped = withWrappers(node, wrap);
                                        result.push(wrapped), match = match.matchType(wrapped.type, wrapped.attrs), lastWrap = wrap;
                                    }
                                }
                            }), result) return {
                                v: prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(result)
                            };
                        }(d);
                        if (returned) return returned.v;
                    }
                    return fragment;
                }(slice.content, $context), !0)).openStart || slice.openEnd) {
                    for(var openStart = 0, openEnd = 0, node = slice.content.firstChild; openStart < slice.openStart && !node.type.spec.isolating; openStart++, node = node.firstChild);
                    for(var node$1 = slice.content.lastChild; openEnd < slice.openEnd && !node$1.type.spec.isolating; openEnd++, node$1 = node$1.lastChild);
                    slice = closeSlice(slice, openStart, openEnd);
                }
                return view.someProp("transformPasted", function(f) {
                    slice = f(slice);
                }), slice;
            }
            function withWrappers(node, wrap, from) {
                void 0 === from && (from = 0);
                for(var i = wrap.length - 1; i >= from; i--)node = wrap[i].create(null, prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(node));
                return node;
            }
            function closeRange(fragment, side, from, to, depth, openEnd) {
                var node = side < 0 ? fragment.firstChild : fragment.lastChild, inner = node.content;
                return depth < to - 1 && (inner = closeRange(inner, side, from, to, depth + 1, openEnd)), depth >= from && (inner = side < 0 ? node.contentMatchAt(0).fillBefore(inner, fragment.childCount > 1 || openEnd <= depth).append(inner) : inner.append(node.contentMatchAt(node.childCount).fillBefore(prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.empty, !0))), fragment.replaceChild(side < 0 ? 0 : fragment.childCount - 1, node.copy(inner));
            }
            function closeSlice(slice, openStart, openEnd) {
                return openStart < slice.openStart && (slice = new prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice(closeRange(slice.content, -1, openStart, slice.openStart, 0, slice.openEnd), openStart, slice.openEnd)), openEnd < slice.openEnd && (slice = new prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice(closeRange(slice.content, 1, openEnd, slice.openEnd, 0, 0), slice.openStart, openEnd)), slice;
            }
            // Trick from jQuery -- some elements must be wrapped in other
            // elements for innerHTML to work. I.e. if you do `div.innerHTML =
            // "<td>..</td>"` the table cells are ignored.
            var wrapMap = {
                thead: [
                    "table"
                ],
                tbody: [
                    "table"
                ],
                tfoot: [
                    "table"
                ],
                caption: [
                    "table"
                ],
                colgroup: [
                    "table"
                ],
                col: [
                    "table",
                    "colgroup"
                ],
                tr: [
                    "table",
                    "tbody"
                ],
                td: [
                    "table",
                    "tbody",
                    "tr"
                ],
                th: [
                    "table",
                    "tbody",
                    "tr"
                ]
            }, _detachedDoc = null;
            function detachedDoc() {
                return _detachedDoc || (_detachedDoc = document.implementation.createHTMLDocument("title"));
            }
            var observeOptions = {
                childList: !0,
                characterData: !0,
                characterDataOldValue: !0,
                attributes: !0,
                attributeOldValue: !0,
                subtree: !0
            }, useCharData = result.ie && result.ie_version <= 11, SelectionState = function() {
                this.anchorNode = this.anchorOffset = this.focusNode = this.focusOffset = null;
            };
            SelectionState.prototype.set = function(sel) {
                this.anchorNode = sel.anchorNode, this.anchorOffset = sel.anchorOffset, this.focusNode = sel.focusNode, this.focusOffset = sel.focusOffset;
            }, SelectionState.prototype.eq = function(sel) {
                return sel.anchorNode == this.anchorNode && sel.anchorOffset == this.anchorOffset && sel.focusNode == this.focusNode && sel.focusOffset == this.focusOffset;
            };
            var DOMObserver = function(view, handleDOMChange) {
                var this$1 = this;
                this.view = view, this.handleDOMChange = handleDOMChange, this.queue = [], this.flushingSoon = -1, this.observer = window.MutationObserver && new window.MutationObserver(function(mutations) {
                    for(var i = 0; i < mutations.length; i++)this$1.queue.push(mutations[i]);
                    // IE11 will sometimes (on backspacing out a single character
                    // text node after a BR node) call the observer callback
                    // before actually updating the DOM, which will cause
                    // ProseMirror to miss the change (see #930)
                    result.ie && result.ie_version <= 11 && mutations.some(function(m) {
                        return "childList" == m.type && m.removedNodes.length || "characterData" == m.type && m.oldValue.length > m.target.nodeValue.length;
                    }) ? this$1.flushSoon() : this$1.flush();
                }), this.currentSelection = new SelectionState(), useCharData && (this.onCharData = function(e) {
                    this$1.queue.push({
                        target: e.target,
                        type: "characterData",
                        oldValue: e.prevValue
                    }), this$1.flushSoon();
                }), this.onSelectionChange = this.onSelectionChange.bind(this), this.suppressingSelectionUpdates = !1;
            };
            DOMObserver.prototype.flushSoon = function() {
                var this$1 = this;
                this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(function() {
                    this$1.flushingSoon = -1, this$1.flush();
                }, 20));
            }, DOMObserver.prototype.forceFlush = function() {
                this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
            }, DOMObserver.prototype.start = function() {
                this.observer && this.observer.observe(this.view.dom, observeOptions), useCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
            }, DOMObserver.prototype.stop = function() {
                var this$1 = this;
                if (this.observer) {
                    var take = this.observer.takeRecords();
                    if (take.length) {
                        for(var i = 0; i < take.length; i++)this.queue.push(take[i]);
                        window.setTimeout(function() {
                            return this$1.flush();
                        }, 20);
                    }
                    this.observer.disconnect();
                }
                useCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
            }, DOMObserver.prototype.connectSelection = function() {
                this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
            }, DOMObserver.prototype.disconnectSelection = function() {
                this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
            }, DOMObserver.prototype.suppressSelectionUpdates = function() {
                var this$1 = this;
                this.suppressingSelectionUpdates = !0, setTimeout(function() {
                    return this$1.suppressingSelectionUpdates = !1;
                }, 50);
            }, DOMObserver.prototype.onSelectionChange = function() {
                var view;
                if ((!(view = this.view).editable || view.root.activeElement == view.dom) && hasSelection(view)) {
                    if (this.suppressingSelectionUpdates) return selectionToDOM(this.view);
                    // Deletions on IE11 fire their events in the wrong order, giving
                    // us a selection change event before the DOM changes are
                    // reported.
                    if (result.ie && result.ie_version <= 11 && !this.view.state.selection.empty) {
                        var sel = this.view.root.getSelection();
                        // Selection.isCollapsed isn't reliable on IE
                        if (sel.focusNode && isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset)) return this.flushSoon();
                    }
                    this.flush();
                }
            }, DOMObserver.prototype.setCurSelection = function() {
                this.currentSelection.set(this.view.root.getSelection());
            }, DOMObserver.prototype.ignoreSelectionChange = function(sel) {
                if (0 == sel.rangeCount) return !0;
                var container = sel.getRangeAt(0).commonAncestorContainer, desc = this.view.docView.nearestDesc(container);
                if (desc && desc.ignoreMutation({
                    type: "selection",
                    target: 3 == container.nodeType ? container.parentNode : container
                })) return this.setCurSelection(), !0;
            }, DOMObserver.prototype.flush = function() {
                if (this.view.docView && !(this.flushingSoon > -1)) {
                    var view, mutations = this.observer ? this.observer.takeRecords() : [];
                    this.queue.length && (mutations = this.queue.concat(mutations), this.queue.length = 0);
                    var sel = this.view.root.getSelection(), newSel = !this.suppressingSelectionUpdates && !this.currentSelection.eq(sel) && hasSelection(this.view) && !this.ignoreSelectionChange(sel), from = -1, to = -1, typeOver = !1, added = [];
                    if (this.view.editable) for(var i = 0; i < mutations.length; i++){
                        var result$1 = this.registerMutation(mutations[i], added);
                        result$1 && (from = from < 0 ? result$1.from : Math.min(result$1.from, from), to = to < 0 ? result$1.to : Math.max(result$1.to, to), result$1.typeOver && (typeOver = !0));
                    }
                    if (result.gecko && added.length > 1) {
                        var brs = added.filter(function(n) {
                            return "BR" == n.nodeName;
                        });
                        if (2 == brs.length) {
                            var a = brs[0], b = brs[1];
                            a.parentNode && a.parentNode.parentNode == b.parentNode ? b.remove() : a.remove();
                        }
                    }
                    (from > -1 || newSel) && (from > -1 && (this.view.docView.markDirty(from, to), view = this.view, cssChecked || (cssChecked = !0, "normal" == getComputedStyle(view.dom).whiteSpace && console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."))), this.handleDOMChange(from, to, typeOver, added), this.view.docView.dirty ? this.view.updateState(this.view.state) : this.currentSelection.eq(sel) || selectionToDOM(this.view), this.currentSelection.set(sel));
                }
            }, DOMObserver.prototype.registerMutation = function(mut, added) {
                // Ignore mutations inside nodes that were already noted as inserted
                if (added.indexOf(mut.target) > -1) return null;
                var desc = this.view.docView.nearestDesc(mut.target);
                if ("attributes" == mut.type && (desc == this.view.docView || "contenteditable" == mut.attributeName || // Firefox sometimes fires spurious events for null/empty styles
                "style" == mut.attributeName && !mut.oldValue && !mut.target.getAttribute("style")) || !desc || desc.ignoreMutation(mut)) return null;
                if ("childList" == mut.type) {
                    for(var i = 0; i < mut.addedNodes.length; i++)added.push(mut.addedNodes[i]);
                    if (desc.contentDOM && desc.contentDOM != desc.dom && !desc.contentDOM.contains(mut.target)) return {
                        from: desc.posBefore,
                        to: desc.posAfter
                    };
                    var prev = mut.previousSibling, next = mut.nextSibling;
                    if (result.ie && result.ie_version <= 11 && mut.addedNodes.length) // IE11 gives us incorrect next/prev siblings for some
                    // insertions, so if there are added nodes, recompute those
                    for(var i$1 = 0; i$1 < mut.addedNodes.length; i$1++){
                        var ref = mut.addedNodes[i$1], previousSibling = ref.previousSibling, nextSibling = ref.nextSibling;
                        (!previousSibling || 0 > Array.prototype.indexOf.call(mut.addedNodes, previousSibling)) && (prev = previousSibling), (!nextSibling || 0 > Array.prototype.indexOf.call(mut.addedNodes, nextSibling)) && (next = nextSibling);
                    }
                    var fromOffset = prev && prev.parentNode == mut.target ? domIndex(prev) + 1 : 0, from = desc.localPosFromDOM(mut.target, fromOffset, -1), toOffset = next && next.parentNode == mut.target ? domIndex(next) : mut.target.childNodes.length;
                    return {
                        from: from,
                        to: desc.localPosFromDOM(mut.target, toOffset, 1)
                    };
                }
                return "attributes" == mut.type ? {
                    from: desc.posAtStart - desc.border,
                    to: desc.posAtEnd + desc.border
                } : {
                    from: desc.posAtStart,
                    to: desc.posAtEnd,
                    // An event was generated for a text change that didn't change
                    // any text. Mark the dom change to fall back to assuming the
                    // selection was typed over with an identical value if it can't
                    // find another change.
                    typeOver: mut.target.nodeValue == mut.oldValue
                };
            };
            var cssChecked = !1, handlers = {}, editHandlers = {};
            function setSelectionOrigin(view, origin) {
                view.lastSelectionOrigin = origin, view.lastSelectionTime = Date.now();
            }
            function ensureListeners(view) {
                view.someProp("handleDOMEvents", function(currentHandlers) {
                    for(var type in currentHandlers)view.eventHandlers[type] || view.dom.addEventListener(type, view.eventHandlers[type] = function(event) {
                        return runCustomHandler(view, event);
                    });
                });
            }
            function runCustomHandler(view, event) {
                return view.someProp("handleDOMEvents", function(handlers) {
                    var handler = handlers[event.type];
                    return !!handler && (handler(view, event) || event.defaultPrevented);
                });
            }
            function eventCoords(event) {
                return {
                    left: event.clientX,
                    top: event.clientY
                };
            }
            function runHandlerOnContext(view, propName, pos, inside, event) {
                if (-1 == inside) return !1;
                for(var $pos = view.state.doc.resolve(inside), loop = function(i) {
                    if (view.someProp(propName, function(f) {
                        return i > $pos.depth ? f(view, pos, $pos.nodeAfter, $pos.before(i), event, !0) : f(view, pos, $pos.node(i), $pos.before(i), event, !1);
                    })) return {
                        v: !0
                    };
                }, i = $pos.depth + 1; i > 0; i--){
                    var returned = loop(i);
                    if (returned) return returned.v;
                }
                return !1;
            }
            function updateSelection(view, selection, origin) {
                view.focused || view.focus();
                var tr = view.state.tr.setSelection(selection);
                "pointer" == origin && tr.setMeta("pointer", !0), view.dispatch(tr);
            }
            editHandlers.keydown = function(view, event) {
                if (view.shiftKey = 16 == event.keyCode || event.shiftKey, !inOrNearComposition(view, event)) {
                    // On iOS, if we preventDefault enter key presses, the virtual
                    // keyboard gets confused. So the hack here is to set a flag that
                    // makes the DOM change code recognize that what just happens should
                    // be replaced by whatever the Enter key handlers do.
                    if (229 != event.keyCode && view.domObserver.forceFlush(), view.lastKeyCode = event.keyCode, view.lastKeyCodeTime = Date.now(), !result.ios || 13 != event.keyCode || event.ctrlKey || event.altKey || event.metaKey) {
                        var result1, code, mods;
                        view.someProp("handleKeyDown", function(f) {
                            return f(view, event);
                        }) || (code = event.keyCode, result1 = "", event.ctrlKey && (result1 += "c"), event.metaKey && (result1 += "m"), event.altKey && (result1 += "a"), event.shiftKey && (result1 += "s"), mods = result1, 8 == code || result.mac && 72 == code && "c" == mods ? stopNativeHorizontalDelete(view, -1) || skipIgnoredNodesLeft(view) : 46 == code || result.mac && 68 == code && "c" == mods ? stopNativeHorizontalDelete(view, 1) || skipIgnoredNodesRight(view) : 13 == code || 27 == code || (37 == code ? selectHorizontally(view, -1, mods) || skipIgnoredNodesLeft(view) : 39 == code ? selectHorizontally(view, 1, mods) || skipIgnoredNodesRight(view) : 38 == code ? selectVertically(view, -1, mods) || skipIgnoredNodesLeft(view) : 40 == code ? // Issue #867 / #1090 / https://bugs.chromium.org/p/chromium/issues/detail?id=903821
                        // In which Safari (and at some point in the past, Chrome) does really
                        // wrong things when the down arrow is pressed when the cursor is
                        // directly at the start of a textblock and has an uneditable node
                        // after it
                        function(view) {
                            if (result.safari && !(view.state.selection.$head.parentOffset > 0)) {
                                var ref = view.root.getSelection(), focusNode = ref.focusNode, focusOffset = ref.focusOffset;
                                if (focusNode && 1 == focusNode.nodeType && 0 == focusOffset && focusNode.firstChild && "false" == focusNode.firstChild.contentEditable) {
                                    var child = focusNode.firstChild;
                                    switchEditable(view, child, !0), setTimeout(function() {
                                        return switchEditable(view, child, !1);
                                    }, 20);
                                }
                            }
                        }(view) || selectVertically(view, 1, mods) || skipIgnoredNodesRight(view) : mods == (result.mac ? "m" : "c") && (66 == code || 73 == code || 89 == code || 90 == code))) ? event.preventDefault() : setSelectionOrigin(view, "key");
                    } else {
                        var now = Date.now();
                        view.lastIOSEnter = now, view.lastIOSEnterFallbackTimeout = setTimeout(function() {
                            view.lastIOSEnter == now && (view.someProp("handleKeyDown", function(f) {
                                return f(view, keyEvent(13, "Enter"));
                            }), view.lastIOSEnter = 0);
                        }, 200);
                    }
                }
            }, editHandlers.keyup = function(view, e) {
                16 == e.keyCode && (view.shiftKey = !1);
            }, editHandlers.keypress = function(view, event) {
                if (!inOrNearComposition(view, event) && event.charCode && (!event.ctrlKey || event.altKey) && (!result.mac || !event.metaKey)) {
                    if (view.someProp("handleKeyPress", function(f) {
                        return f(view, event);
                    })) {
                        event.preventDefault();
                        return;
                    }
                    var sel = view.state.selection;
                    if (!(sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection) || !sel.$from.sameParent(sel.$to)) {
                        var text = String.fromCharCode(event.charCode);
                        view.someProp("handleTextInput", function(f) {
                            return f(view, sel.$from.pos, sel.$to.pos, text);
                        }) || view.dispatch(view.state.tr.insertText(text).scrollIntoView()), event.preventDefault();
                    }
                }
            };
            var selectNodeModifier = result.mac ? "metaKey" : "ctrlKey";
            handlers.mousedown = function(view, event) {
                view.shiftKey = event.shiftKey;
                var click, dx, dy, flushed = endComposition(view), now = Date.now(), type = "singleClick";
                now - view.lastClick.time < 500 && (dx = (click = view.lastClick).x - event.clientX) * dx + (dy = click.y - event.clientY) * dy < 100 && !event[selectNodeModifier] && ("singleClick" == view.lastClick.type ? type = "doubleClick" : "doubleClick" == view.lastClick.type && (type = "tripleClick")), view.lastClick = {
                    time: now,
                    x: event.clientX,
                    y: event.clientY,
                    type: type
                };
                var pos = view.posAtCoords(eventCoords(event));
                pos && ("singleClick" == type ? (view.mouseDown && view.mouseDown.done(), view.mouseDown = new MouseDown(view, pos, event, flushed)) : ("doubleClick" == type ? function(view, pos, inside, event) {
                    return runHandlerOnContext(view, "handleDoubleClickOn", pos, inside, event) || view.someProp("handleDoubleClick", function(f) {
                        return f(view, pos, event);
                    });
                } : function(view, pos, inside, event) {
                    return runHandlerOnContext(view, "handleTripleClickOn", pos, inside, event) || view.someProp("handleTripleClick", function(f) {
                        return f(view, pos, event);
                    }) || function(view, inside, event) {
                        if (0 != event.button) return !1;
                        var doc = view.state.doc;
                        if (-1 == inside) return !!doc.inlineContent && (updateSelection(view, prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection.create(doc, 0, doc.content.size), "pointer"), !0);
                        for(var $pos = doc.resolve(inside), i = $pos.depth + 1; i > 0; i--){
                            var node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i), nodePos = $pos.before(i);
                            if (node.inlineContent) updateSelection(view, prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection.create(doc, nodePos + 1, nodePos + 1 + node.content.size), "pointer");
                            else {
                                if (!prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(node)) continue;
                                updateSelection(view, prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.create(doc, nodePos), "pointer");
                            }
                            return !0;
                        }
                    }(view, inside, event);
                })(view, pos.pos, pos.inside, event) ? event.preventDefault() : setSelectionOrigin(view, "pointer"));
            };
            var MouseDown = function(view, pos, event, flushed) {
                var targetNode, targetPos, this$1 = this;
                if (this.view = view, this.startDoc = view.state.doc, this.pos = pos, this.event = event, this.flushed = flushed, this.selectNode = event[selectNodeModifier], this.allowDefault = event.shiftKey, this.delayedSelectionSync = !1, pos.inside > -1) targetNode = view.state.doc.nodeAt(pos.inside), targetPos = pos.inside;
                else {
                    var $pos = view.state.doc.resolve(pos.pos);
                    targetNode = $pos.parent, targetPos = $pos.depth ? $pos.before() : 0;
                }
                this.mightDrag = null;
                var target = flushed ? null : event.target, targetDesc = target ? view.docView.nearestDesc(target, !0) : null;
                this.target = targetDesc ? targetDesc.dom : null;
                var selection = view.state.selection;
                (0 == event.button && targetNode.type.spec.draggable && !1 !== targetNode.type.spec.selectable || selection instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection && selection.from <= targetPos && selection.to > targetPos) && (this.mightDrag = {
                    node: targetNode,
                    pos: targetPos,
                    addAttr: this.target && !this.target.draggable,
                    setUneditable: this.target && result.gecko && !this.target.hasAttribute("contentEditable")
                }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(function() {
                    this$1.view.mouseDown == this$1 && this$1.target.setAttribute("contentEditable", "false");
                }, 20), this.view.domObserver.start()), view.root.addEventListener("mouseup", this.up = this.up.bind(this)), view.root.addEventListener("mousemove", this.move = this.move.bind(this)), setSelectionOrigin(view, "pointer");
            };
            function inOrNearComposition(view, event) {
                return !!view.composing || !!(result.safari && 500 > Math.abs(event.timeStamp - view.compositionEndedAt)) && (view.compositionEndedAt = -200000000, !0);
            }
            MouseDown.prototype.done = function() {
                var this$1 = this;
                this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(function() {
                    return selectionToDOM(this$1.view);
                }), this.view.mouseDown = null;
            }, MouseDown.prototype.up = function(event) {
                if (this.done(), this.view.dom.contains(3 == event.target.nodeType ? event.target.parentNode : event.target)) {
                    var view, pos, inside, selectNode, pos1 = this.pos;
                    (this.view.state.doc != this.startDoc && (pos1 = this.view.posAtCoords(eventCoords(event))), this.allowDefault || !pos1) ? setSelectionOrigin(this.view, "pointer") : (view = this.view, pos = pos1.pos, inside = pos1.inside, selectNode = this.selectNode, runHandlerOnContext(view, "handleClickOn", pos, inside, event) || view.someProp("handleClick", function(f) {
                        return f(view, pos, event);
                    }) || (selectNode ? function(view, inside) {
                        if (-1 == inside) return !1;
                        var selectedNode, selectAt, sel = view.state.selection;
                        sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection && (selectedNode = sel.node);
                        for(var $pos = view.state.doc.resolve(inside), i = $pos.depth + 1; i > 0; i--){
                            var node = i > $pos.depth ? $pos.nodeAfter : $pos.node(i);
                            if (prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(node)) {
                                selectAt = selectedNode && sel.$from.depth > 0 && i >= sel.$from.depth && $pos.before(sel.$from.depth + 1) == sel.$from.pos ? $pos.before(sel.$from.depth) : $pos.before(i);
                                break;
                            }
                        }
                        return null != selectAt && (updateSelection(view, prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.create(view.state.doc, selectAt), "pointer"), !0);
                    }(view, inside) : function(view, inside) {
                        if (-1 == inside) return !1;
                        var $pos = view.state.doc.resolve(inside), node = $pos.nodeAfter;
                        return !!(node && node.isAtom && prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(node)) && (updateSelection(view, new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection($pos), "pointer"), !0);
                    }(view, inside))) ? event.preventDefault() : 0 == event.button && (this.flushed || // Safari ignores clicks on draggable elements
                    result.safari && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
                    // cursor, but still report that the node is selected
                    // when asked through getSelection. You'll then get a
                    // situation where clicking at the point where that
                    // (hidden) cursor is doesn't change the selection, and
                    // thus doesn't get a reaction from ProseMirror. This
                    // works around that.
                    result.chrome && !(this.view.state.selection instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection) && 2 >= Math.min(Math.abs(pos1.pos - this.view.state.selection.from), Math.abs(pos1.pos - this.view.state.selection.to))) ? (updateSelection(this.view, prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.near(this.view.state.doc.resolve(pos1.pos)), "pointer"), event.preventDefault()) : setSelectionOrigin(this.view, "pointer");
                }
            }, MouseDown.prototype.move = function(event) {
                !this.allowDefault && (Math.abs(this.event.x - event.clientX) > 4 || Math.abs(this.event.y - event.clientY) > 4) && (this.allowDefault = !0), setSelectionOrigin(this.view, "pointer"), 0 == event.buttons && this.done();
            }, handlers.touchdown = function(view) {
                endComposition(view), setSelectionOrigin(view, "pointer");
            }, handlers.contextmenu = function(view) {
                return endComposition(view);
            };
            // Drop active composition after 5 seconds of inactivity on Android
            var timeoutComposition = result.android ? 5000 : -1;
            function scheduleComposeEnd(view, delay) {
                clearTimeout(view.composingTimeout), delay > -1 && (view.composingTimeout = setTimeout(function() {
                    return endComposition(view);
                }, delay));
            }
            function clearComposition(view) {
                var event;
                for(view.composing && (view.composing = !1, view.compositionEndedAt = ((event = document.createEvent("Event")).initEvent("event", !0, !0), event.timeStamp)); view.compositionNodes.length > 0;)view.compositionNodes.pop().markParentsDirty();
            }
            function endComposition(view, forceUpdate) {
                if (view.domObserver.forceFlush(), clearComposition(view), forceUpdate || view.docView.dirty) {
                    var sel = selectionFromDOM(view);
                    return sel && !sel.eq(view.state.selection) ? view.dispatch(view.state.tr.setSelection(sel)) : view.updateState(view.state), !0;
                }
                return !1;
            }
            editHandlers.compositionstart = editHandlers.compositionupdate = function(view) {
                if (!view.composing) {
                    view.domObserver.flush();
                    var state = view.state, $pos = state.selection.$from;
                    if (state.selection.empty && (state.storedMarks || !$pos.textOffset && $pos.parentOffset && $pos.nodeBefore.marks.some(function(m) {
                        return !1 === m.type.spec.inclusive;
                    }))) // Need to wrap the cursor in mark nodes different from the ones in the DOM context
                    view.markCursor = view.state.storedMarks || $pos.marks(), endComposition(view, !0), view.markCursor = null;
                    else // In firefox, if the cursor is after but outside a marked node,
                    // the inserted text won't inherit the marks. So this moves it
                    // inside if necessary.
                    if (endComposition(view), result.gecko && state.selection.empty && $pos.parentOffset && !$pos.textOffset && $pos.nodeBefore.marks.length) for(var sel = view.root.getSelection(), node = sel.focusNode, offset = sel.focusOffset; node && 1 == node.nodeType && 0 != offset;){
                        var before = offset < 0 ? node.lastChild : node.childNodes[offset - 1];
                        if (!before) break;
                        if (3 == before.nodeType) {
                            sel.collapse(before, before.nodeValue.length);
                            break;
                        }
                        node = before, offset = -1;
                    }
                    view.composing = !0;
                }
                scheduleComposeEnd(view, timeoutComposition);
            }, editHandlers.compositionend = function(view, event) {
                view.composing && (view.composing = !1, view.compositionEndedAt = event.timeStamp, scheduleComposeEnd(view, 20));
            };
            // This is very crude, but unfortunately both these browsers _pretend_
            // that they have a clipboard API—all the objects and methods are
            // there, they just don't work, and they are hard to test.
            var brokenClipboardAPI = result.ie && result.ie_version < 15 || result.ios && result.webkit_version < 604;
            function doPaste(view, text, html, e) {
                var slice = parseFromClipboard(view, text, html, view.shiftKey, view.state.selection.$from);
                if (view.someProp("handlePaste", function(f) {
                    return f(view, e, slice || prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice.empty);
                })) return !0;
                if (!slice) return !1;
                var singleNode = 0 == slice.openStart && 0 == slice.openEnd && 1 == slice.content.childCount ? slice.content.firstChild : null, tr = singleNode ? view.state.tr.replaceSelectionWith(singleNode, view.shiftKey) : view.state.tr.replaceSelection(slice);
                return view.dispatch(tr.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
            }
            handlers.copy = editHandlers.cut = function(view, e) {
                var sel = view.state.selection, cut = "cut" == e.type;
                if (!sel.empty) {
                    // IE and Edge's clipboard interface is completely broken
                    var data = brokenClipboardAPI ? null : e.clipboardData, ref = serializeForClipboard(view, sel.content()), dom = ref.dom, text = ref.text;
                    data ? (e.preventDefault(), data.clearData(), data.setData("text/html", dom.innerHTML), data.setData("text/plain", text)) : function(view, dom) {
                        // The extra wrapper is somehow necessary on IE/Edge to prevent the
                        // content from being mangled when it is put onto the clipboard
                        if (view.dom.parentNode) {
                            var wrap = view.dom.parentNode.appendChild(document.createElement("div"));
                            wrap.appendChild(dom), wrap.style.cssText = "position: fixed; left: -10000px; top: 10px";
                            var sel = getSelection(), range = document.createRange();
                            range.selectNodeContents(dom), // Done because IE will fire a selectionchange moving the selection
                            // to its start when removeAllRanges is called and the editor still
                            // has focus (which will mess up the editor's selection state).
                            view.dom.blur(), sel.removeAllRanges(), sel.addRange(range), setTimeout(function() {
                                wrap.parentNode && wrap.parentNode.removeChild(wrap), view.focus();
                            }, 50);
                        }
                    }(view, dom), cut && view.dispatch(view.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
                }
            }, editHandlers.paste = function(view, e) {
                var data = brokenClipboardAPI ? null : e.clipboardData;
                data && doPaste(view, data.getData("text/plain"), data.getData("text/html"), e) ? e.preventDefault() : function(view, e) {
                    if (view.dom.parentNode) {
                        var plainText = view.shiftKey || view.state.selection.$from.parent.type.spec.code, target = view.dom.parentNode.appendChild(document.createElement(plainText ? "textarea" : "div"));
                        plainText || (target.contentEditable = "true"), target.style.cssText = "position: fixed; left: -10000px; top: 10px", target.focus(), setTimeout(function() {
                            view.focus(), target.parentNode && target.parentNode.removeChild(target), plainText ? doPaste(view, target.value, null, e) : doPaste(view, target.textContent, target.innerHTML, e);
                        }, 50);
                    }
                }(view, e);
            };
            var Dragging = function(slice, move) {
                this.slice = slice, this.move = move;
            }, dragCopyModifier = result.mac ? "altKey" : "ctrlKey";
            // Make sure all handlers get registered
            for(var prop in handlers.dragstart = function(view, e) {
                var mouseDown = view.mouseDown;
                if (mouseDown && mouseDown.done(), e.dataTransfer) {
                    var sel = view.state.selection, pos = sel.empty ? null : view.posAtCoords(eventCoords(e));
                    if (pos && pos.pos >= sel.from && pos.pos <= (sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection ? sel.to - 1 : sel.to)) ;
                    else if (mouseDown && mouseDown.mightDrag) view.dispatch(view.state.tr.setSelection(prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.create(view.state.doc, mouseDown.mightDrag.pos)));
                    else if (e.target && 1 == e.target.nodeType) {
                        var desc = view.docView.nearestDesc(e.target, !0);
                        desc && desc.node.type.spec.draggable && desc != view.docView && view.dispatch(view.state.tr.setSelection(prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.create(view.state.doc, desc.posBefore)));
                    }
                    var slice = view.state.selection.content(), ref = serializeForClipboard(view, slice), dom = ref.dom, text = ref.text;
                    e.dataTransfer.clearData(), e.dataTransfer.setData(brokenClipboardAPI ? "Text" : "text/html", dom.innerHTML), // See https://github.com/ProseMirror/prosemirror/issues/1156
                    e.dataTransfer.effectAllowed = "copyMove", brokenClipboardAPI || e.dataTransfer.setData("text/plain", text), view.dragging = new Dragging(slice, !e[dragCopyModifier]);
                }
            }, handlers.dragend = function(view) {
                var dragging = view.dragging;
                window.setTimeout(function() {
                    view.dragging == dragging && (view.dragging = null);
                }, 50);
            }, editHandlers.dragover = editHandlers.dragenter = function(_, e) {
                return e.preventDefault();
            }, editHandlers.drop = function(view, e) {
                var dragging = view.dragging;
                if (view.dragging = null, e.dataTransfer) {
                    var eventPos = view.posAtCoords(eventCoords(e));
                    if (eventPos) {
                        var $mouse = view.state.doc.resolve(eventPos.pos);
                        if ($mouse) {
                            var slice = dragging && dragging.slice;
                            slice ? view.someProp("transformPasted", function(f) {
                                slice = f(slice);
                            }) : slice = parseFromClipboard(view, e.dataTransfer.getData(brokenClipboardAPI ? "Text" : "text/plain"), brokenClipboardAPI ? null : e.dataTransfer.getData("text/html"), !1, $mouse);
                            var move = dragging && !e[dragCopyModifier];
                            if (view.someProp("handleDrop", function(f) {
                                return f(view, e, slice || prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Slice.empty, move);
                            })) {
                                e.preventDefault();
                                return;
                            }
                            if (slice) {
                                e.preventDefault();
                                var insertPos = slice ? (0, prosemirror_transform__WEBPACK_IMPORTED_MODULE_2__ /* .dropPoint */ .nj)(view.state.doc, $mouse.pos, slice) : $mouse.pos;
                                null == insertPos && (insertPos = $mouse.pos);
                                var tr = view.state.tr;
                                move && tr.deleteSelection();
                                var pos = tr.mapping.map(insertPos), isNode = 0 == slice.openStart && 0 == slice.openEnd && 1 == slice.content.childCount, beforeInsert = tr.doc;
                                if (isNode ? tr.replaceRangeWith(pos, pos, slice.content.firstChild) : tr.replaceRange(pos, pos, slice), !tr.doc.eq(beforeInsert)) {
                                    var $pos = tr.doc.resolve(pos);
                                    if (isNode && prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection.isSelectable(slice.content.firstChild) && $pos.nodeAfter && $pos.nodeAfter.sameMarkup(slice.content.firstChild)) tr.setSelection(new prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection($pos));
                                    else {
                                        var end = tr.mapping.map(insertPos);
                                        tr.mapping.maps[tr.mapping.maps.length - 1].forEach(function(_from, _to, _newFrom, newTo) {
                                            return end = newTo;
                                        }), tr.setSelection(selectionBetween(view, $pos, tr.doc.resolve(end)));
                                    }
                                    view.focus(), view.dispatch(tr.setMeta("uiEvent", "drop"));
                                }
                            }
                        }
                    }
                }
            }, handlers.focus = function(view) {
                view.focused || (view.domObserver.stop(), view.dom.classList.add("ProseMirror-focused"), view.domObserver.start(), view.focused = !0, setTimeout(function() {
                    view.docView && view.hasFocus() && !view.domObserver.currentSelection.eq(view.root.getSelection()) && selectionToDOM(view);
                }, 20));
            }, handlers.blur = function(view, e) {
                view.focused && (view.domObserver.stop(), view.dom.classList.remove("ProseMirror-focused"), view.domObserver.start(), e.relatedTarget && view.dom.contains(e.relatedTarget) && view.domObserver.currentSelection.set({}), view.focused = !1);
            }, handlers.beforeinput = function(view, event) {
                // We should probably do more with beforeinput events, but support
                // is so spotty that I'm still waiting to see where they are going.
                // Very specific hack to deal with backspace sometimes failing on
                // Chrome Android when after an uneditable node.
                if (result.chrome && result.android && "deleteContentBackward" == event.inputType) {
                    var domChangeCount = view.domChangeCount;
                    setTimeout(function() {
                        if (view.domChangeCount == domChangeCount && (// This bug tends to close the virtual keyboard, so we refocus
                        view.dom.blur(), view.focus(), !view.someProp("handleKeyDown", function(f) {
                            return f(view, keyEvent(8, "Backspace"));
                        }))) {
                            var $cursor = view.state.selection.$cursor;
                            $cursor && $cursor.pos > 0 && view.dispatch(view.state.tr.delete($cursor.pos - 1, $cursor.pos).scrollIntoView());
                        } // Event already had some effect
                    }, 50);
                }
            }, editHandlers)handlers[prop] = editHandlers[prop];
            function compareObjs(a, b) {
                if (a == b) return !0;
                for(var p in a)if (a[p] !== b[p]) return !1;
                for(var p$1 in b)if (!(p$1 in a)) return !1;
                return !0;
            }
            var WidgetType = function(toDOM, spec) {
                this.spec = spec || noSpec, this.side = this.spec.side || 0, this.toDOM = toDOM;
            };
            WidgetType.prototype.map = function(mapping, span, offset, oldOffset) {
                var ref = mapping.mapResult(span.from + oldOffset, this.side < 0 ? -1 : 1), pos = ref.pos;
                return ref.deleted ? null : new Decoration(pos - offset, pos - offset, this);
            }, WidgetType.prototype.valid = function() {
                return !0;
            }, WidgetType.prototype.eq = function(other) {
                return this == other || other instanceof WidgetType && (this.spec.key && this.spec.key == other.spec.key || this.toDOM == other.toDOM && compareObjs(this.spec, other.spec));
            };
            var InlineType = function(attrs, spec) {
                this.spec = spec || noSpec, this.attrs = attrs;
            };
            InlineType.prototype.map = function(mapping, span, offset, oldOffset) {
                var from = mapping.map(span.from + oldOffset, this.spec.inclusiveStart ? -1 : 1) - offset, to = mapping.map(span.to + oldOffset, this.spec.inclusiveEnd ? 1 : -1) - offset;
                return from >= to ? null : new Decoration(from, to, this);
            }, InlineType.prototype.valid = function(_, span) {
                return span.from < span.to;
            }, InlineType.prototype.eq = function(other) {
                return this == other || other instanceof InlineType && compareObjs(this.attrs, other.attrs) && compareObjs(this.spec, other.spec);
            }, InlineType.is = function(span) {
                return span.type instanceof InlineType;
            };
            var NodeType = function(attrs, spec) {
                this.spec = spec || noSpec, this.attrs = attrs;
            };
            NodeType.prototype.map = function(mapping, span, offset, oldOffset) {
                var from = mapping.mapResult(span.from + oldOffset, 1);
                if (from.deleted) return null;
                var to = mapping.mapResult(span.to + oldOffset, -1);
                return to.deleted || to.pos <= from.pos ? null : new Decoration(from.pos - offset, to.pos - offset, this);
            }, NodeType.prototype.valid = function(node, span) {
                var child, ref = node.content.findIndex(span.from), index = ref.index, offset = ref.offset;
                return offset == span.from && !(child = node.child(index)).isText && offset + child.nodeSize == span.to;
            }, NodeType.prototype.eq = function(other) {
                return this == other || other instanceof NodeType && compareObjs(this.attrs, other.attrs) && compareObjs(this.spec, other.spec);
            };
            // ::- Decoration objects can be provided to the view through the
            // [`decorations` prop](#view.EditorProps.decorations). They come in
            // several variants—see the static members of this class for details.
            var Decoration = function(from, to, type) {
                // :: number
                // The start position of the decoration.
                this.from = from, // :: number
                // The end position. Will be the same as `from` for [widget
                // decorations](#view.Decoration^widget).
                this.to = to, this.type = type;
            }, prototypeAccessors$1 = {
                spec: {
                    configurable: !0
                },
                inline: {
                    configurable: !0
                }
            };
            Decoration.prototype.copy = function(from, to) {
                return new Decoration(from, to, this.type);
            }, Decoration.prototype.eq = function(other, offset) {
                return void 0 === offset && (offset = 0), this.type.eq(other.type) && this.from + offset == other.from && this.to + offset == other.to;
            }, Decoration.prototype.map = function(mapping, offset, oldOffset) {
                return this.type.map(mapping, this, offset, oldOffset);
            }, // :: (number, union<(view: EditorView, getPos: () → number) → dom.Node, dom.Node>, ?Object) → Decoration
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
            Decoration.widget = function(pos, toDOM, spec) {
                return new Decoration(pos, pos, new WidgetType(toDOM, spec));
            }, // :: (number, number, DecorationAttrs, ?Object) → Decoration
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
            Decoration.inline = function(from, to, attrs, spec) {
                return new Decoration(from, to, new InlineType(attrs, spec));
            }, // :: (number, number, DecorationAttrs, ?Object) → Decoration
            // Creates a node decoration. `from` and `to` should point precisely
            // before and after a node in the document. That node, and only that
            // node, will receive the given attributes.
            //
            // spec::-
            //
            // Optional information to store with the decoration. It
            // is also used when comparing decorators for equality.
            Decoration.node = function(from, to, attrs, spec) {
                return new Decoration(from, to, new NodeType(attrs, spec));
            }, // :: Object
            // The spec provided when creating this decoration. Can be useful
            // if you've stored extra information in that object.
            prototypeAccessors$1.spec.get = function() {
                return this.type.spec;
            }, prototypeAccessors$1.inline.get = function() {
                return this.type instanceof InlineType;
            }, Object.defineProperties(Decoration.prototype, prototypeAccessors$1);
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
            var none = [], noSpec = {}, DecorationSet = function(local, children) {
                this.local = local && local.length ? local : none, this.children = children && children.length ? children : none;
            };
            // :: (Node, [Decoration]) → DecorationSet
            // Create a set of decorations, using the structure of the given
            // document.
            DecorationSet.create = function(doc, decorations) {
                return decorations.length ? buildTree(decorations, doc, 0, noSpec) : empty;
            }, // :: (?number, ?number, ?(spec: Object) → bool) → [Decoration]
            // Find all decorations in this set which touch the given range
            // (including decorations that start or end directly at the
            // boundaries) and match the given predicate on their spec. When
            // `start` and `end` are omitted, all decorations in the set are
            // considered. When `predicate` isn't given, all decorations are
            // assumed to match.
            DecorationSet.prototype.find = function(start, end, predicate) {
                var result = [];
                return this.findInner(null == start ? 0 : start, null == end ? 1e9 : end, result, 0, predicate), result;
            }, DecorationSet.prototype.findInner = function(start, end, result, offset, predicate) {
                for(var i = 0; i < this.local.length; i++){
                    var span = this.local[i];
                    span.from <= end && span.to >= start && (!predicate || predicate(span.spec)) && result.push(span.copy(span.from + offset, span.to + offset));
                }
                for(var i$1 = 0; i$1 < this.children.length; i$1 += 3)if (this.children[i$1] < end && this.children[i$1 + 1] > start) {
                    var childOff = this.children[i$1] + 1;
                    this.children[i$1 + 2].findInner(start - childOff, end - childOff, result, offset + childOff, predicate);
                }
            }, // :: (Mapping, Node, ?Object) → DecorationSet
            // Map the set of decorations in response to a change in the
            // document.
            //
            // options::- An optional set of options.
            //
            //   onRemove:: ?(decorationSpec: Object)
            //   When given, this function will be called for each decoration
            //   that gets dropped as a result of the mapping, passing the
            //   spec of that decoration.
            DecorationSet.prototype.map = function(mapping, doc, options) {
                return this == empty || 0 == mapping.maps.length ? this : this.mapInner(mapping, doc, 0, 0, options || noSpec);
            }, DecorationSet.prototype.mapInner = function(mapping, node, offset, oldOffset, options) {
                for(var newLocal, i = 0; i < this.local.length; i++){
                    var mapped = this.local[i].map(mapping, offset, oldOffset);
                    mapped && mapped.type.valid(node, mapped) ? (newLocal || (newLocal = [])).push(mapped) : options.onRemove && options.onRemove(this.local[i].spec);
                }
                return this.children.length ? function(oldChildren, newLocal, mapping, node, offset, oldOffset, options) {
                    for(var children = oldChildren.slice(), shift = function(oldStart, oldEnd, newStart, newEnd) {
                        for(var i = 0; i < children.length; i += 3){
                            var end = children[i + 1], dSize = void 0;
                            -1 != end && !(oldStart > end + oldOffset) && (oldEnd >= children[i] + oldOffset ? children[i + 1] = -1 : newStart >= offset && (dSize = newEnd - newStart - (oldEnd - oldStart)) && (children[i] += dSize, children[i + 1] += dSize));
                        }
                    }, i = 0; i < mapping.maps.length; i++)mapping.maps[i].forEach(shift);
                    for(var mustRebuild = !1, i$1 = 0; i$1 < children.length; i$1 += 3)if (-1 == children[i$1 + 1]) {
                        // Touched nodes
                        var from = mapping.map(oldChildren[i$1] + oldOffset), fromLocal = from - offset;
                        if (fromLocal < 0 || fromLocal >= node.content.size) {
                            mustRebuild = !0;
                            continue;
                        }
                        // Must read oldChildren because children was tagged with -1
                        var toLocal = mapping.map(oldChildren[i$1 + 1] + oldOffset, -1) - offset, ref = node.content.findIndex(fromLocal), index = ref.index, childOffset = ref.offset, childNode = node.maybeChild(index);
                        if (childNode && childOffset == fromLocal && childOffset + childNode.nodeSize == toLocal) {
                            var mapped = children[i$1 + 2].mapInner(mapping, childNode, from + 1, oldChildren[i$1] + oldOffset + 1, options);
                            mapped != empty ? (children[i$1] = fromLocal, children[i$1 + 1] = toLocal, children[i$1 + 2] = mapped) : (children[i$1 + 1] = -2, mustRebuild = !0);
                        } else mustRebuild = !0;
                    }
                    // Remaining children must be collected and rebuilt into the appropriate structure
                    if (mustRebuild) {
                        var built = buildTree(function(children, oldChildren, decorations, mapping, offset, oldOffset, options) {
                            for(var i = 0; i < children.length; i += 3)-1 == children[i + 1] && // Gather all decorations from the remaining marked children
                            function gather(set, oldOffset) {
                                for(var i = 0; i < set.local.length; i++){
                                    var mapped = set.local[i].map(mapping, offset, oldOffset);
                                    mapped ? decorations.push(mapped) : options.onRemove && options.onRemove(set.local[i].spec);
                                }
                                for(var i$1 = 0; i$1 < set.children.length; i$1 += 3)gather(set.children[i$1 + 2], set.children[i$1] + oldOffset + 1);
                            }(children[i + 2], oldChildren[i] + oldOffset + 1);
                            return decorations;
                        }(children, oldChildren, newLocal || [], mapping, offset, oldOffset, options), node, 0, options);
                        newLocal = built.local;
                        for(var i$2 = 0; i$2 < children.length; i$2 += 3)children[i$2 + 1] < 0 && (children.splice(i$2, 3), i$2 -= 3);
                        for(var i$3 = 0, j = 0; i$3 < built.children.length; i$3 += 3){
                            for(var from$1 = built.children[i$3]; j < children.length && children[j] < from$1;)j += 3;
                            children.splice(j, 0, built.children[i$3], built.children[i$3 + 1], built.children[i$3 + 2]);
                        }
                    }
                    return new DecorationSet(newLocal && newLocal.sort(byPos), children);
                }(this.children, newLocal, mapping, node, offset, oldOffset, options) : newLocal ? new DecorationSet(newLocal.sort(byPos)) : empty;
            }, // :: (Node, [Decoration]) → DecorationSet
            // Add the given array of decorations to the ones in the set,
            // producing a new set. Needs access to the current document to
            // create the appropriate tree structure.
            DecorationSet.prototype.add = function(doc, decorations) {
                return decorations.length ? this == empty ? DecorationSet.create(doc, decorations) : this.addInner(doc, decorations, 0) : this;
            }, DecorationSet.prototype.addInner = function(doc, decorations, offset) {
                var children, this$1 = this, childIndex = 0;
                doc.forEach(function(childNode, childOffset) {
                    var found, baseOffset = childOffset + offset;
                    if (found = takeSpansForNode(decorations, childNode, baseOffset)) {
                        for(children || (children = this$1.children.slice()); childIndex < children.length && children[childIndex] < childOffset;)childIndex += 3;
                        children[childIndex] == childOffset ? children[childIndex + 2] = children[childIndex + 2].addInner(childNode, found, baseOffset + 1) : children.splice(childIndex, 0, childOffset, childOffset + childNode.nodeSize, buildTree(found, childNode, baseOffset + 1, noSpec)), childIndex += 3;
                    }
                });
                for(var local = moveSpans(childIndex ? withoutNulls(decorations) : decorations, -offset), i = 0; i < local.length; i++)local[i].type.valid(doc, local[i]) || local.splice(i--, 1);
                return new DecorationSet(local.length ? this.local.concat(local).sort(byPos) : this.local, children || this.children);
            }, // :: ([Decoration]) → DecorationSet
            // Create a new set that contains the decorations in this set, minus
            // the ones in the given array.
            DecorationSet.prototype.remove = function(decorations) {
                return 0 == decorations.length || this == empty ? this : this.removeInner(decorations, 0);
            }, DecorationSet.prototype.removeInner = function(decorations, offset) {
                for(var children = this.children, local = this.local, i = 0; i < children.length; i += 3){
                    for(var found = void 0, from = children[i] + offset, to = children[i + 1] + offset, j = 0, span = void 0; j < decorations.length; j++)(span = decorations[j]) && span.from > from && span.to < to && (decorations[j] = null, (found || (found = [])).push(span));
                    if (found) {
                        children == this.children && (children = this.children.slice());
                        var removed = children[i + 2].removeInner(found, from + 1);
                        removed != empty ? children[i + 2] = removed : (children.splice(i, 3), i -= 3);
                    }
                }
                if (local.length) {
                    for(var i$1 = 0, span$1 = void 0; i$1 < decorations.length; i$1++)if (span$1 = decorations[i$1]) for(var j$1 = 0; j$1 < local.length; j$1++)local[j$1].eq(span$1, offset) && (local == this.local && (local = this.local.slice()), local.splice(j$1--, 1));
                }
                return children == this.children && local == this.local ? this : local.length || children.length ? new DecorationSet(local, children) : empty;
            }, DecorationSet.prototype.forChild = function(offset, node) {
                if (this == empty) return this;
                if (node.isLeaf) return DecorationSet.empty;
                for(var child, local, i = 0; i < this.children.length; i += 3)if (this.children[i] >= offset) {
                    this.children[i] == offset && (child = this.children[i + 2]);
                    break;
                }
                for(var start = offset + 1, end = start + node.content.size, i$1 = 0; i$1 < this.local.length; i$1++){
                    var dec = this.local[i$1];
                    if (dec.from < end && dec.to > start && dec.type instanceof InlineType) {
                        var from = Math.max(start, dec.from) - start, to = Math.min(end, dec.to) - start;
                        from < to && (local || (local = [])).push(dec.copy(from, to));
                    }
                }
                if (local) {
                    var localSet = new DecorationSet(local.sort(byPos));
                    return child ? new DecorationGroup([
                        localSet,
                        child
                    ]) : localSet;
                }
                return child || empty;
            }, DecorationSet.prototype.eq = function(other) {
                if (this == other) return !0;
                if (!(other instanceof DecorationSet) || this.local.length != other.local.length || this.children.length != other.children.length) return !1;
                for(var i = 0; i < this.local.length; i++)if (!this.local[i].eq(other.local[i])) return !1;
                for(var i$1 = 0; i$1 < this.children.length; i$1 += 3)if (this.children[i$1] != other.children[i$1] || this.children[i$1 + 1] != other.children[i$1 + 1] || !this.children[i$1 + 2].eq(other.children[i$1 + 2])) return !1;
                return !0;
            }, DecorationSet.prototype.locals = function(node) {
                return removeOverlap(this.localsInner(node));
            }, DecorationSet.prototype.localsInner = function(node) {
                if (this == empty) return none;
                if (node.inlineContent || !this.local.some(InlineType.is)) return this.local;
                for(var result = [], i = 0; i < this.local.length; i++)this.local[i].type instanceof InlineType || result.push(this.local[i]);
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
            DecorationSet.empty = empty, DecorationSet.removeOverlap = removeOverlap;
            // :- An abstraction that allows the code dealing with decorations to
            // treat multiple DecorationSet objects as if it were a single object
            // with (a subset of) the same interface.
            var DecorationGroup = function(members) {
                this.members = members;
            };
            function moveSpans(spans, offset) {
                if (!offset || !spans.length) return spans;
                for(var result = [], i = 0; i < spans.length; i++){
                    var span = spans[i];
                    result.push(new Decoration(span.from + offset, span.to + offset, span.type));
                }
                return result;
            }
            function takeSpansForNode(spans, node, offset) {
                if (node.isLeaf) return null;
                for(var end = offset + node.nodeSize, found = null, i = 0, span = void 0; i < spans.length; i++)(span = spans[i]) && span.from > offset && span.to < end && ((found || (found = [])).push(span), spans[i] = null);
                return found;
            }
            function withoutNulls(array) {
                for(var result = [], i = 0; i < array.length; i++)null != array[i] && result.push(array[i]);
                return result;
            }
            // : ([Decoration], Node, number) → DecorationSet
            // Build up a tree that corresponds to a set of decorations. `offset`
            // is a base offset that should be subtracted from the `from` and `to`
            // positions in the spans (so that we don't have to allocate new spans
            // for recursive calls).
            function buildTree(spans, node, offset, options) {
                var children = [], hasNulls = !1;
                node.forEach(function(childNode, localStart) {
                    var found = takeSpansForNode(spans, childNode, localStart + offset);
                    if (found) {
                        hasNulls = !0;
                        var subtree = buildTree(found, childNode, offset + localStart + 1, options);
                        subtree != empty && children.push(localStart, localStart + childNode.nodeSize, subtree);
                    }
                });
                for(var locals = moveSpans(hasNulls ? withoutNulls(spans) : spans, -offset).sort(byPos), i = 0; i < locals.length; i++)locals[i].type.valid(node, locals[i]) || (options.onRemove && options.onRemove(locals[i].spec), locals.splice(i--, 1));
                return locals.length || children.length ? new DecorationSet(locals, children) : empty;
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
                for(var working = spans, i = 0; i < working.length - 1; i++){
                    var span = working[i];
                    if (span.from != span.to) for(var j = i + 1; j < working.length; j++){
                        var next = working[j];
                        if (next.from == span.from) {
                            next.to != span.to && (working == spans && (working = spans.slice()), // Followed by a partially overlapping larger span. Split that
                            // span.
                            working[j] = next.copy(next.from, span.to), insertAhead(working, j + 1, next.copy(span.to, next.to)));
                            continue;
                        }
                        next.from < span.to && (working == spans && (working = spans.slice()), // The end of this one overlaps with a subsequent span. Split
                        // this one.
                        working[i] = span.copy(span.from, next.from), insertAhead(working, j, span.copy(next.from, span.to)));
                        break;
                    }
                }
                return working;
            }
            function insertAhead(array, i, deco) {
                for(; i < array.length && byPos(deco, array[i]) > 0;)i++;
                array.splice(i, 0, deco);
            }
            // : (EditorView) → union<DecorationSet, DecorationGroup>
            // Get the decorations associated with the current props of a view.
            function viewDecorations(view) {
                var found = [];
                return view.someProp("decorations", function(f) {
                    var result = f(view.state);
                    result && result != empty && found.push(result);
                }), view.cursorWrapper && found.push(DecorationSet.create(view.state.doc, [
                    view.cursorWrapper.deco
                ])), DecorationGroup.from(found);
            }
            DecorationGroup.prototype.map = function(mapping, doc) {
                var mappedDecos = this.members.map(function(member) {
                    return member.map(mapping, doc, noSpec);
                });
                return DecorationGroup.from(mappedDecos);
            }, DecorationGroup.prototype.forChild = function(offset, child) {
                if (child.isLeaf) return DecorationSet.empty;
                for(var found = [], i = 0; i < this.members.length; i++){
                    var result = this.members[i].forChild(offset, child);
                    result != empty && (result instanceof DecorationGroup ? found = found.concat(result.members) : found.push(result));
                }
                return DecorationGroup.from(found);
            }, DecorationGroup.prototype.eq = function(other) {
                if (!(other instanceof DecorationGroup) || other.members.length != this.members.length) return !1;
                for(var i = 0; i < this.members.length; i++)if (!this.members[i].eq(other.members[i])) return !1;
                return !0;
            }, DecorationGroup.prototype.locals = function(node) {
                for(var result, sorted = !0, i = 0; i < this.members.length; i++){
                    var locals = this.members[i].localsInner(node);
                    if (locals.length) {
                        if (result) {
                            sorted && (result = result.slice(), sorted = !1);
                            for(var j = 0; j < locals.length; j++)result.push(locals[j]);
                        } else result = locals;
                    }
                }
                return result ? removeOverlap(sorted ? result : result.sort(byPos)) : none;
            }, // : ([DecorationSet]) → union<DecorationSet, DecorationGroup>
            // Create a group for the given array of decoration sets, or return
            // a single set when possible.
            DecorationGroup.from = function(members) {
                switch(members.length){
                    case 0:
                        return empty;
                    case 1:
                        return members[0];
                    default:
                        return new DecorationGroup(members);
                }
            };
            // ::- An editor view manages the DOM structure that represents an
            // editable document. Its state and behavior are determined by its
            // [props](#view.DirectEditorProps).
            var EditorView = function(place, props) {
                this._props = props, // :: EditorState
                // The view's current [state](#state.EditorState).
                this.state = props.state, this.directPlugins = props.plugins || [], this.directPlugins.forEach(checkStateComponent), this.dispatch = this.dispatch.bind(this), this._root = null, this.focused = !1, // Kludge used to work around a Chrome bug
                this.trackWrites = null, // :: dom.Element
                // An editable DOM node containing the document. (You probably
                // should not directly interfere with its content.)
                this.dom = place && place.mount || document.createElement("div"), place && (place.appendChild ? place.appendChild(this.dom) : place.apply ? place(this.dom) : place.mount && (this.mounted = !0)), // :: bool
                // Indicates whether the editor is currently [editable](#view.EditorProps.editable).
                this.editable = getEditable(this), this.markCursor = null, this.cursorWrapper = null, updateCursorWrapper(this), this.nodeViews = buildNodeViews(this), this.docView = docViewDesc(this.state.doc, computeDocDeco(this), viewDecorations(this), this.dom, this), this.lastSelectedViewDesc = null, // :: ?{slice: Slice, move: bool}
                // When editor content is being dragged, this object contains
                // information about the dragged slice and whether it is being
                // copied or moved. At any other time, it is null.
                this.dragging = null, function(view) {
                    for(var event in view.shiftKey = !1, view.mouseDown = null, view.lastKeyCode = null, view.lastKeyCodeTime = 0, view.lastClick = {
                        time: 0,
                        x: 0,
                        y: 0,
                        type: ""
                    }, view.lastSelectionOrigin = null, view.lastSelectionTime = 0, view.lastIOSEnter = 0, view.lastIOSEnterFallbackTimeout = null, view.lastAndroidDelete = 0, view.composing = !1, view.composingTimeout = null, view.compositionNodes = [], view.compositionEndedAt = -200000000, view.domObserver = new DOMObserver(view, function(from, to, typeOver, added) {
                        return function(view, from, to, typeOver, addedNodes) {
                            if (from < 0) {
                                var preferredPos, preferredSide, nextSel, tr, storedMarks, markChange, $from1, origin = view.lastSelectionTime > Date.now() - 50 ? view.lastSelectionOrigin : null, newSel = selectionFromDOM(view, origin);
                                if (newSel && !view.state.selection.eq(newSel)) {
                                    var tr$1 = view.state.tr.setSelection(newSel);
                                    "pointer" == origin ? tr$1.setMeta("pointer", !0) : "key" == origin && tr$1.scrollIntoView(), view.dispatch(tr$1);
                                }
                                return;
                            }
                            var $before = view.state.doc.resolve(from), shared = $before.sharedDepth(to);
                            from = $before.before(shared + 1), to = view.state.doc.resolve(to).after(shared + 1);
                            var sel = view.state.selection, parse = // Note that all referencing and parsing is done with the
                            // start-of-operation selection and document, since that's the one
                            // that the DOM represents. If any changes came in in the meantime,
                            // the modification is mapped over those before it is applied, in
                            // readDOMChange.
                            function(view, from_, to_) {
                                var ref = view.docView.parseRange(from_, to_), parent = ref.node, fromOffset = ref.fromOffset, toOffset = ref.toOffset, from = ref.from, to = ref.to, domSel = view.root.getSelection(), find = null, anchor = domSel.anchorNode;
                                // Work around issue in Chrome where backspacing sometimes replaces
                                // the deleted content with a random BR node (issues #799, #831)
                                if (anchor && view.dom.contains(1 == anchor.nodeType ? anchor : anchor.parentNode) && (find = [
                                    {
                                        node: anchor,
                                        offset: domSel.anchorOffset
                                    }
                                ], selectionCollapsed(domSel) || find.push({
                                    node: domSel.focusNode,
                                    offset: domSel.focusOffset
                                })), result.chrome && 8 === view.lastKeyCode) for(var off = toOffset; off > fromOffset; off--){
                                    var node = parent.childNodes[off - 1], desc = node.pmViewDesc;
                                    if ("BR" == node.nodeName && !desc) {
                                        toOffset = off;
                                        break;
                                    }
                                    if (!desc || desc.size) break;
                                }
                                var startDoc = view.state.doc, parser = view.someProp("domParser") || prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.DOMParser.fromSchema(view.state.schema), $from = startDoc.resolve(from), sel = null, doc = parser.parse(parent, {
                                    topNode: $from.parent,
                                    topMatch: $from.parent.contentMatchAt($from.index()),
                                    topOpen: !0,
                                    from: fromOffset,
                                    to: toOffset,
                                    preserveWhitespace: !$from.parent.type.spec.code || "full",
                                    editableContent: !0,
                                    findPositions: find,
                                    ruleFromNode: ruleFromNode,
                                    context: $from
                                });
                                if (find && null != find[0].pos) {
                                    var anchor$1 = find[0].pos, head = find[1] && find[1].pos;
                                    null == head && (head = anchor$1), sel = {
                                        anchor: anchor$1 + from,
                                        head: head + from
                                    };
                                }
                                return {
                                    doc: doc,
                                    sel: sel,
                                    from: from,
                                    to: to
                                };
                            }(view, from, to);
                            // Chrome sometimes leaves the cursor before the inserted text when
                            // composing after a cursor wrapper. This moves it forward.
                            if (result.chrome && view.cursorWrapper && parse.sel && parse.sel.anchor == view.cursorWrapper.deco.from) {
                                var text = view.cursorWrapper.deco.type.toDOM.nextSibling, size = text && text.nodeValue ? text.nodeValue.length : 1;
                                parse.sel = {
                                    anchor: parse.sel.anchor + size,
                                    head: parse.sel.anchor + size
                                };
                            }
                            var doc = view.state.doc, compare = doc.slice(parse.from, parse.to);
                            8 === view.lastKeyCode && Date.now() - 100 < view.lastKeyCodeTime ? (preferredPos = view.state.selection.to, preferredSide = "end") : (preferredPos = view.state.selection.from, preferredSide = "start"), view.lastKeyCode = null;
                            var change = function(a, b, pos, preferredPos, preferredSide) {
                                var start = a.findDiffStart(b, pos);
                                if (null == start) return null;
                                var ref = a.findDiffEnd(b, pos + a.size, pos + b.size), endA = ref.a, endB = ref.b;
                                if ("end" == preferredSide) {
                                    var adjust = Math.max(0, start - Math.min(endA, endB));
                                    preferredPos -= endA + adjust - start;
                                }
                                if (endA < start && a.size < b.size) {
                                    var move = preferredPos <= start && preferredPos >= endA ? start - preferredPos : 0;
                                    start -= move, endB = start + (endB - endA), endA = start;
                                } else if (endB < start) {
                                    var move$1 = preferredPos <= start && preferredPos >= endB ? start - preferredPos : 0;
                                    start -= move$1, endA = start + (endA - endB), endB = start;
                                }
                                return {
                                    start: start,
                                    endA: endA,
                                    endB: endB
                                };
                            }(compare.content, parse.doc.content, parse.from, preferredPos, preferredSide);
                            if (!change) {
                                if (typeOver && sel instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection && !sel.empty && sel.$head.sameParent(sel.$anchor) && !view.composing && !(parse.sel && parse.sel.anchor != parse.sel.head)) change = {
                                    start: sel.from,
                                    endA: sel.to,
                                    endB: sel.to
                                };
                                else if ((result.ios && view.lastIOSEnter > Date.now() - 225 || result.android) && addedNodes.some(function(n) {
                                    return "DIV" == n.nodeName || "P" == n.nodeName;
                                }) && view.someProp("handleKeyDown", function(f) {
                                    return f(view, keyEvent(13, "Enter"));
                                })) {
                                    view.lastIOSEnter = 0;
                                    return;
                                } else {
                                    if (parse.sel) {
                                        var sel$1 = resolveSelection(view, view.state.doc, parse.sel);
                                        sel$1 && !sel$1.eq(view.state.selection) && view.dispatch(view.state.tr.setSelection(sel$1));
                                    }
                                    return;
                                }
                            }
                            view.domChangeCount++, view.state.selection.from < view.state.selection.to && change.start == change.endB && view.state.selection instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.TextSelection && (change.start > view.state.selection.from && change.start <= view.state.selection.from + 2 ? change.start = view.state.selection.from : change.endA < view.state.selection.to && change.endA >= view.state.selection.to - 2 && (change.endB += view.state.selection.to - change.endA, change.endA = view.state.selection.to)), result.ie && result.ie_version <= 11 && change.endB == change.start + 1 && change.endA == change.start && change.start > parse.from && " \u00a0" == parse.doc.textBetween(change.start - parse.from - 1, change.start - parse.from + 1) && (change.start--, change.endA--, change.endB--);
                            var $from = parse.doc.resolveNoCache(change.start - parse.from), $to = parse.doc.resolveNoCache(change.endB - parse.from), inlineChange = $from.sameParent($to) && $from.parent.inlineContent;
                            // If this looks like the effect of pressing Enter (or was recorded
                            // as being an iOS enter press), just dispatch an Enter key instead.
                            if ((result.ios && view.lastIOSEnter > Date.now() - 225 && (!inlineChange || addedNodes.some(function(n) {
                                return "DIV" == n.nodeName || "P" == n.nodeName;
                            })) || !inlineChange && $from.pos < parse.doc.content.size && (nextSel = prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.Selection.findFrom(parse.doc.resolve($from.pos + 1), 1, !0)) && nextSel.head == $to.pos) && view.someProp("handleKeyDown", function(f) {
                                return f(view, keyEvent(13, "Enter"));
                            })) {
                                view.lastIOSEnter = 0;
                                return;
                            }
                            // Same for backspace
                            if (view.state.selection.anchor > change.start && function(old, start, end, $newStart, $newEnd) {
                                if (!$newStart.parent.isTextblock || // The content must have shrunk
                                end - start <= $newEnd.pos - $newStart.pos || // newEnd must point directly at or after the end of the block that newStart points into
                                skipClosingAndOpening($newStart, !0, !1) < $newEnd.pos) return !1;
                                var $start = old.resolve(start);
                                // Start must be at the end of a block
                                if ($start.parentOffset < $start.parent.content.size || !$start.parent.isTextblock) return !1;
                                var $next = old.resolve(skipClosingAndOpening($start, !0, !0));
                                return(// The next textblock must start before end and end near it
                                !(!$next.parent.isTextblock || $next.pos > end || skipClosingAndOpening($next, !0, !1) < end) && $newStart.parent.content.cut($newStart.parentOffset).eq($next.parent.content));
                            }(doc, change.start, change.endA, $from, $to) && view.someProp("handleKeyDown", function(f) {
                                return f(view, keyEvent(8, "Backspace"));
                            })) {
                                result.android && result.chrome && view.domObserver.suppressSelectionUpdates(); // #820
                                return;
                            }
                            result.chrome && result.android && change.toB == change.from && (view.lastAndroidDelete = Date.now()), result.android && !inlineChange && $from.start() != $to.start() && 0 == $to.parentOffset && $from.depth == $to.depth && parse.sel && parse.sel.anchor == parse.sel.head && parse.sel.head == change.endA && (change.endB -= 2, $to = parse.doc.resolveNoCache(change.endB - parse.from), setTimeout(function() {
                                view.someProp("handleKeyDown", function(f) {
                                    return f(view, keyEvent(13, "Enter"));
                                });
                            }, 20));
                            var chFrom = change.start, chTo = change.endA;
                            if (inlineChange) {
                                if ($from.pos == $to.pos) result.ie && result.ie_version <= 11 && 0 == $from.parentOffset && (view.domObserver.suppressSelectionUpdates(), setTimeout(function() {
                                    return selectionToDOM(view);
                                }, 20)), tr = view.state.tr.delete(chFrom, chTo), storedMarks = doc.resolve(change.start).marksAcross(doc.resolve(change.endA));
                                else if (// Adding or removing a mark
                                change.endA == change.endB && ($from1 = doc.resolve(change.start)) && (markChange = // : (Fragment, Fragment) → ?{mark: Mark, type: string}
                                // Given two same-length, non-empty fragments of inline content,
                                // determine whether the first could be created from the second by
                                // removing or adding a single mark type.
                                function(cur, prev) {
                                    for(var type, mark, update, curMarks = cur.firstChild.marks, prevMarks = prev.firstChild.marks, added = curMarks, removed = prevMarks, i = 0; i < prevMarks.length; i++)added = prevMarks[i].removeFromSet(added);
                                    for(var i$1 = 0; i$1 < curMarks.length; i$1++)removed = curMarks[i$1].removeFromSet(removed);
                                    if (1 == added.length && 0 == removed.length) mark = added[0], type = "add", update = function(node) {
                                        return node.mark(mark.addToSet(node.marks));
                                    };
                                    else {
                                        if (0 != added.length || 1 != removed.length) return null;
                                        mark = removed[0], type = "remove", update = function(node) {
                                            return node.mark(mark.removeFromSet(node.marks));
                                        };
                                    }
                                    for(var updated = [], i$2 = 0; i$2 < prev.childCount; i$2++)updated.push(update(prev.child(i$2)));
                                    if (prosemirror_model__WEBPACK_IMPORTED_MODULE_1__.Fragment.from(updated).eq(cur)) return {
                                        mark: mark,
                                        type: type
                                    };
                                }($from.parent.content.cut($from.parentOffset, $to.parentOffset), $from1.parent.content.cut($from1.parentOffset, change.endA - $from1.start())))) tr = view.state.tr, "add" == markChange.type ? tr.addMark(chFrom, chTo, markChange.mark) : tr.removeMark(chFrom, chTo, markChange.mark);
                                else if ($from.parent.child($from.index()).isText && $from.index() == $to.index() - ($to.textOffset ? 0 : 1)) {
                                    // Both positions in the same text node -- simply insert text
                                    var text$1 = $from.parent.textBetween($from.parentOffset, $to.parentOffset);
                                    if (view.someProp("handleTextInput", function(f) {
                                        return f(view, chFrom, chTo, text$1);
                                    })) return;
                                    tr = view.state.tr.insertText(text$1, chFrom, chTo);
                                }
                            }
                            if (tr || (tr = view.state.tr.replace(chFrom, chTo, parse.doc.slice(change.start - parse.from, change.endB - parse.from))), parse.sel) {
                                var sel$2 = resolveSelection(view, tr.doc, parse.sel);
                                // Chrome Android will sometimes, during composition, report the
                                // selection in the wrong place. If it looks like that is
                                // happening, don't update the selection.
                                // Edge just doesn't move the cursor forward when you start typing
                                // in an empty block or between br nodes.
                                sel$2 && !(result.chrome && result.android && view.composing && sel$2.empty && (change.start != change.endB || view.lastAndroidDelete < Date.now() - 100) && (sel$2.head == chFrom || sel$2.head == tr.mapping.map(chTo) - 1) || result.ie && sel$2.empty && sel$2.head == chFrom) && tr.setSelection(sel$2);
                            }
                            storedMarks && tr.ensureMarks(storedMarks), view.dispatch(tr.scrollIntoView());
                        }(view, from, to, typeOver, added);
                    }), view.domObserver.start(), // Used by hacks like the beforeinput handler to check whether anything happened in the DOM
                    view.domChangeCount = 0, view.eventHandlers = Object.create(null), handlers)!function(event) {
                        var handler = handlers[event];
                        view.dom.addEventListener(event, view.eventHandlers[event] = function(event) {
                            !function(view, event) {
                                if (!event.bubbles) return !0;
                                if (event.defaultPrevented) return !1;
                                for(var node = event.target; node != view.dom; node = node.parentNode)if (!node || 11 == node.nodeType || node.pmViewDesc && node.pmViewDesc.stopEvent(event)) return !1;
                                return !0;
                            }(view, event) || runCustomHandler(view, event) || !view.editable && event.type in editHandlers || handler(view, event);
                        });
                    }(event);
                    result.safari && view.dom.addEventListener("input", function() {
                        return null;
                    }), ensureListeners(view);
                }(this), this.prevDirectPlugins = [], this.pluginViews = [], this.updatePluginViews();
            }, prototypeAccessors$2 = {
                props: {
                    configurable: !0
                },
                root: {
                    configurable: !0
                }
            };
            function computeDocDeco(view) {
                var attrs = Object.create(null);
                return attrs.class = "ProseMirror", attrs.contenteditable = String(view.editable), attrs.translate = "no", view.someProp("attributes", function(value) {
                    if ("function" == typeof value && (value = value(view.state)), value) for(var attr in value)"class" == attr && (attrs.class += " " + value[attr]), "style" == attr ? attrs.style = (attrs.style ? attrs.style + ";" : "") + value[attr] : attrs[attr] || "contenteditable" == attr || "nodeName" == attr || (attrs[attr] = String(value[attr]));
                }), [
                    Decoration.node(0, view.state.doc.content.size, attrs)
                ];
            }
            function updateCursorWrapper(view) {
                if (view.markCursor) {
                    var dom = document.createElement("img");
                    dom.className = "ProseMirror-separator", dom.setAttribute("mark-placeholder", "true"), view.cursorWrapper = {
                        dom: dom,
                        deco: Decoration.widget(view.state.selection.head, dom, {
                            raw: !0,
                            marks: view.markCursor
                        })
                    };
                } else view.cursorWrapper = null;
            }
            function getEditable(view) {
                return !view.someProp("editable", function(value) {
                    return !1 === value(view.state);
                });
            }
            function buildNodeViews(view) {
                var result = {};
                return view.someProp("nodeViews", function(obj) {
                    for(var prop in obj)Object.prototype.hasOwnProperty.call(result, prop) || (result[prop] = obj[prop]);
                }), result;
            }
            function checkStateComponent(plugin) {
                if (plugin.spec.state || plugin.spec.filterTransaction || plugin.spec.appendTransaction) throw RangeError("Plugins passed directly to the view must not have a state component");
            }
            // composing:: boolean
            // Holds `true` when a
            // [composition](https://developer.mozilla.org/en-US/docs/Mozilla/IME_handling_guide)
            // is active.
            // :: DirectEditorProps
            // The view's current [props](#view.EditorProps).
            prototypeAccessors$2.props.get = function() {
                if (this._props.state != this.state) {
                    var prev = this._props;
                    for(var name in this._props = {}, prev)this._props[name] = prev[name];
                    this._props.state = this.state;
                }
                return this._props;
            }, // :: (DirectEditorProps)
            // Update the view's props. Will immediately cause an update to
            // the DOM.
            EditorView.prototype.update = function(props) {
                props.handleDOMEvents != this._props.handleDOMEvents && ensureListeners(this), this._props = props, props.plugins && (props.plugins.forEach(checkStateComponent), this.directPlugins = props.plugins), this.updateStateInner(props.state, !0);
            }, // :: (DirectEditorProps)
            // Update the view by updating existing props object with the object
            // given as argument. Equivalent to `view.update(Object.assign({},
            // view.props, props))`.
            EditorView.prototype.setProps = function(props) {
                var updated = {};
                for(var name in this._props)updated[name] = this._props[name];
                for(var name$1 in updated.state = this.state, props)updated[name$1] = props[name$1];
                this.update(updated);
            }, // :: (EditorState)
            // Update the editor's `state` prop, without touching any of the
            // other props.
            EditorView.prototype.updateState = function(state) {
                this.updateStateInner(state, this.state.plugins != state.plugins);
            }, EditorView.prototype.updateStateInner = function(state, reconfigured) {
                var refDOM, refTop, newRefTop, this$1 = this, prev = this.state, redraw = !1, updateSel = !1;
                if (state.storedMarks && this.composing && (clearComposition(this), updateSel = !0), this.state = state, reconfigured) {
                    var nodeViews = buildNodeViews(this);
                    (function(a, b) {
                        var nA = 0, nB = 0;
                        for(var prop in a){
                            if (a[prop] != b[prop]) return !0;
                            nA++;
                        }
                        for(var _ in b)nB++;
                        return nA != nB;
                    })(nodeViews, this.nodeViews) && (this.nodeViews = nodeViews, redraw = !0), ensureListeners(this);
                }
                this.editable = getEditable(this), updateCursorWrapper(this);
                var innerDeco = viewDecorations(this), outerDeco = computeDocDeco(this), scroll = reconfigured ? "reset" : state.scrollToSelection > prev.scrollToSelection ? "to selection" : "preserve", updateDoc = redraw || !this.docView.matchesNode(state.doc, outerDeco, innerDeco);
                (updateDoc || !state.selection.eq(prev.selection)) && (updateSel = !0);
                var oldScrollPos = "preserve" == scroll && updateSel && null == this.dom.style.overflowAnchor && // Store the scroll position of the editor's parent nodes, along with
                // the top position of an element near the top of the editor, which
                // will be used to make sure the visible viewport remains stable even
                // when the size of the content above changes.
                function(view) {
                    for(var refDOM, refTop, rect = view.dom.getBoundingClientRect(), startY = Math.max(0, rect.top), x = (rect.left + rect.right) / 2, y = startY + 1; y < Math.min(innerHeight, rect.bottom); y += 5){
                        var dom = view.root.elementFromPoint(x, y);
                        if (dom != view.dom && view.dom.contains(dom)) {
                            var localRect = dom.getBoundingClientRect();
                            if (localRect.top >= startY - 20) {
                                refDOM = dom, refTop = localRect.top;
                                break;
                            }
                        }
                    }
                    return {
                        refDOM: refDOM,
                        refTop: refTop,
                        stack: scrollStack(view.dom)
                    };
                }(this);
                if (updateSel) {
                    this.domObserver.stop();
                    // Work around an issue in Chrome, IE, and Edge where changing
                    // the DOM around an active selection puts it into a broken
                    // state where the thing the user sees differs from the
                    // selection reported by the Selection object (#710, #973,
                    // #1011, #1013, #1035).
                    var sel1, sel2, depth, anchorDOM, domSel, forceSelUpdate = updateDoc && (result.ie || result.chrome) && !this.composing && !prev.selection.empty && !state.selection.empty && (sel1 = prev.selection, sel2 = state.selection, depth = Math.min(sel1.$anchor.sharedDepth(sel1.head), sel2.$anchor.sharedDepth(sel2.head)), sel1.$anchor.start(depth) != sel2.$anchor.start(depth));
                    if (updateDoc) {
                        // If the node that the selection points into is written to,
                        // Chrome sometimes starts misreporting the selection, so this
                        // tracks that and forces a selection reset when our update
                        // did write to the node.
                        var chromeKludge = result.chrome ? this.trackWrites = this.root.getSelection().focusNode : null;
                        (redraw || !this.docView.update(state.doc, outerDeco, innerDeco, this)) && (this.docView.updateOuterDeco([]), this.docView.destroy(), this.docView = docViewDesc(state.doc, outerDeco, innerDeco, this.dom, this)), chromeKludge && !this.trackWrites && (forceSelUpdate = !0);
                    }
                    forceSelUpdate || !(this.mouseDown && this.domObserver.currentSelection.eq(this.root.getSelection()) && (anchorDOM = this.docView.domFromPos(this.state.selection.anchor, 0), domSel = this.root.getSelection(), isEquivalentPosition(anchorDOM.node, anchorDOM.offset, domSel.anchorNode, domSel.anchorOffset))) ? selectionToDOM(this, forceSelUpdate) : (syncNodeSelection(this, state.selection), this.domObserver.setCurSelection()), this.domObserver.start();
                }
                if (this.updatePluginViews(prev), "reset" == scroll) this.dom.scrollTop = 0;
                else if ("to selection" == scroll) {
                    var startDOM = this.root.getSelection().focusNode;
                    this.someProp("handleScrollToSelection", function(f) {
                        return f(this$1);
                    }) || (state.selection instanceof prosemirror_state__WEBPACK_IMPORTED_MODULE_0__.NodeSelection ? // Handled
                    scrollRectIntoView(this, this.docView.domAfterPos(state.selection.from).getBoundingClientRect(), startDOM) : scrollRectIntoView(this, this.coordsAtPos(state.selection.head, 1), startDOM));
                } else oldScrollPos && (refDOM = oldScrollPos.refDOM, refTop = oldScrollPos.refTop, restoreScrollStack(oldScrollPos.stack, 0 == (newRefTop = refDOM ? refDOM.getBoundingClientRect().top : 0) ? 0 : newRefTop - refTop));
            }, EditorView.prototype.destroyPluginViews = function() {
                for(var view; view = this.pluginViews.pop();)view.destroy && view.destroy();
            }, EditorView.prototype.updatePluginViews = function(prevState) {
                if (prevState && prevState.plugins == this.state.plugins && this.directPlugins == this.prevDirectPlugins) for(var i$2 = 0; i$2 < this.pluginViews.length; i$2++){
                    var pluginView = this.pluginViews[i$2];
                    pluginView.update && pluginView.update(this, prevState);
                }
                else {
                    this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
                    for(var i = 0; i < this.directPlugins.length; i++){
                        var plugin = this.directPlugins[i];
                        plugin.spec.view && this.pluginViews.push(plugin.spec.view(this));
                    }
                    for(var i$1 = 0; i$1 < this.state.plugins.length; i$1++){
                        var plugin$1 = this.state.plugins[i$1];
                        plugin$1.spec.view && this.pluginViews.push(plugin$1.spec.view(this));
                    }
                }
            }, // :: (string, ?(prop: *) → *) → *
            // Goes over the values of a prop, first those provided directly,
            // then those from plugins given to the view, then from plugins in
            // the state (in order), and calls `f` every time a non-undefined
            // value is found. When `f` returns a truthy value, that is
            // immediately returned. When `f` isn't provided, it is treated as
            // the identity function (the prop value is returned directly).
            EditorView.prototype.someProp = function(propName, f) {
                var value, prop = this._props && this._props[propName];
                if (null != prop && (value = f ? f(prop) : prop)) return value;
                for(var i = 0; i < this.directPlugins.length; i++){
                    var prop$1 = this.directPlugins[i].props[propName];
                    if (null != prop$1 && (value = f ? f(prop$1) : prop$1)) return value;
                }
                var plugins = this.state.plugins;
                if (plugins) for(var i$1 = 0; i$1 < plugins.length; i$1++){
                    var prop$2 = plugins[i$1].props[propName];
                    if (null != prop$2 && (value = f ? f(prop$2) : prop$2)) return value;
                }
            }, // :: () → bool
            // Query whether the view has focus.
            EditorView.prototype.hasFocus = function() {
                return this.root.activeElement == this.dom;
            }, // :: ()
            // Focus the editor.
            EditorView.prototype.focus = function() {
                this.domObserver.stop(), this.editable && // Feature-detects support for .focus({preventScroll: true}), and uses
                // a fallback kludge when not supported.
                function(dom) {
                    if (dom.setActive) return dom.setActive();
                     // in IE
                    if (preventScrollSupported) return dom.focus(preventScrollSupported);
                    var stored = scrollStack(dom);
                    dom.focus(null == preventScrollSupported ? {
                        get preventScroll () {
                            return preventScrollSupported = {
                                preventScroll: !0
                            }, !0;
                        }
                    } : void 0), preventScrollSupported || (preventScrollSupported = !1, restoreScrollStack(stored, 0));
                }(this.dom), selectionToDOM(this), this.domObserver.start();
            }, // :: union<dom.Document, dom.DocumentFragment>
            // Get the document root in which the editor exists. This will
            // usually be the top-level `document`, but might be a [shadow
            // DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
            // root if the editor is inside one.
            prototypeAccessors$2.root.get = function() {
                var cached = this._root;
                if (null == cached) {
                    for(var search = this.dom.parentNode; search; search = search.parentNode)if (9 == search.nodeType || 11 == search.nodeType && search.host) return search.getSelection || (Object.getPrototypeOf(search).getSelection = function() {
                        return document.getSelection();
                    }), this._root = search;
                }
                return cached || document;
            }, // :: ({left: number, top: number}) → ?{pos: number, inside: number}
            // Given a pair of viewport coordinates, return the document
            // position that corresponds to them. May return null if the given
            // coordinates aren't inside of the editor. When an object is
            // returned, its `pos` property is the position nearest to the
            // coordinates, and its `inside` property holds the position of the
            // inner node that the position falls inside of, or -1 if it is at
            // the top level, not in any node.
            EditorView.prototype.posAtCoords = function(coords) {
                return(// Given an x,y position on the editor, get the position in the document.
                function(view, coords) {
                    var node, offset, doc = view.dom.ownerDocument;
                    if (doc.caretPositionFromPoint) try {
                        // Firefox throws for this call in hard-to-predict circumstances (#994)
                        var pos$1 = doc.caretPositionFromPoint(coords.left, coords.top);
                        pos$1 && (node = pos$1.offsetNode, offset = pos$1.offset);
                    } catch (_) {}
                    if (!node && doc.caretRangeFromPoint) {
                        var range = doc.caretRangeFromPoint(coords.left, coords.top);
                        range && (node = range.startContainer, offset = range.startOffset);
                    }
                    var pos, elt = (view.root.elementFromPoint ? view.root : doc).elementFromPoint(coords.left, coords.top + 1);
                    if (!elt || !view.dom.contains(1 != elt.nodeType ? elt.parentNode : elt)) {
                        var box = view.dom.getBoundingClientRect();
                        if (!inRect(coords, box) || !(elt = function elementFromPoint(element, coords, box) {
                            var len = element.childNodes.length;
                            if (len && box.top < box.bottom) for(var startI = Math.max(0, Math.min(len - 1, Math.floor(len * (coords.top - box.top) / (box.bottom - box.top)) - 2)), i = startI;;){
                                var child = element.childNodes[i];
                                if (1 == child.nodeType) for(var rects = child.getClientRects(), j = 0; j < rects.length; j++){
                                    var rect = rects[j];
                                    if (inRect(coords, rect)) return elementFromPoint(child, coords, rect);
                                }
                                if ((i = (i + 1) % len) == startI) break;
                            }
                            return element;
                        }(view.dom, coords, box))) return null;
                    }
                    // Safari's caretRangeFromPoint returns nonsense when on a draggable element
                    if (result.safari) for(var p = elt; node && p; p = parentNode(p))p.draggable && (node = offset = null);
                    if (elt = (parent = (dom = elt).parentNode) && /^li$/i.test(parent.nodeName) && coords.left < dom.getBoundingClientRect().left ? parent : dom, node) {
                        if (result.gecko && 1 == node.nodeType && // Firefox will sometimes return offsets into <input> nodes, which
                        // have no actual children, from caretPositionFromPoint (#953)
                        (offset = Math.min(offset, node.childNodes.length)) < node.childNodes.length) {
                            var dom, parent, box$1, next = node.childNodes[offset];
                            "IMG" == next.nodeName && (box$1 = next.getBoundingClientRect()).right <= coords.left && box$1.bottom > coords.top && offset++;
                        }
                        // Suspiciously specific kludge to work around caret*FromPoint
                        // never returning a position at the end of the document
                        node == view.dom && offset == node.childNodes.length - 1 && 1 == node.lastChild.nodeType && coords.top > node.lastChild.getBoundingClientRect().bottom ? pos = view.state.doc.content.size : (0 == offset || 1 != node.nodeType || "BR" != node.childNodes[offset - 1].nodeName) && (pos = function(view, node, offset, coords) {
                            for(var outside = -1, cur = node; cur != view.dom;){
                                var desc = view.docView.nearestDesc(cur, !0);
                                if (!desc) return null;
                                if (desc.node.isBlock && desc.parent) {
                                    var rect = desc.dom.getBoundingClientRect();
                                    if (rect.left > coords.left || rect.top > coords.top) outside = desc.posBefore;
                                    else if (rect.right < coords.left || rect.bottom < coords.top) outside = desc.posAfter;
                                    else break;
                                }
                                cur = desc.dom.parentNode;
                            }
                            return outside > -1 ? outside : view.docView.posFromDOM(node, offset);
                        }(view, node, offset, coords));
                    }
                    null == pos && (pos = function(view, elt, coords) {
                        var ref = function findOffsetInNode(node, coords) {
                            for(var closest, coordsClosest, dxClosest = 2e8, offset = 0, rowBot = coords.top, rowTop = coords.top, child = node.firstChild, childIndex = 0; child; child = child.nextSibling, childIndex++){
                                var rects = void 0;
                                if (1 == child.nodeType) rects = child.getClientRects();
                                else {
                                    if (3 != child.nodeType) continue;
                                    rects = textRange(child).getClientRects();
                                }
                                for(var i = 0; i < rects.length; i++){
                                    var rect = rects[i];
                                    if (rect.top <= rowBot && rect.bottom >= rowTop) {
                                        rowBot = Math.max(rect.bottom, rowBot), rowTop = Math.min(rect.top, rowTop);
                                        var dx = rect.left > coords.left ? rect.left - coords.left : rect.right < coords.left ? coords.left - rect.right : 0;
                                        if (dx < dxClosest) {
                                            closest = child, dxClosest = dx, coordsClosest = dx && 3 == closest.nodeType ? {
                                                left: rect.right < coords.left ? rect.right : rect.left,
                                                top: coords.top
                                            } : coords, 1 == child.nodeType && dx && (offset = childIndex + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0));
                                            continue;
                                        }
                                    }
                                    !closest && (coords.left >= rect.right && coords.top >= rect.top || coords.left >= rect.left && coords.top >= rect.bottom) && (offset = childIndex + 1);
                                }
                            }
                            return closest && 3 == closest.nodeType ? function(node, coords) {
                                for(var len = node.nodeValue.length, range = document.createRange(), i = 0; i < len; i++){
                                    range.setEnd(node, i + 1), range.setStart(node, i);
                                    var rect = singleRect(range, 1);
                                    if (rect.top != rect.bottom && inRect(coords, rect)) return {
                                        node: node,
                                        offset: i + (coords.left >= (rect.left + rect.right) / 2 ? 1 : 0)
                                    };
                                }
                                return {
                                    node: node,
                                    offset: 0
                                };
                            }(closest, coordsClosest) : !closest || dxClosest && 1 == closest.nodeType ? {
                                node: node,
                                offset: offset
                            } : findOffsetInNode(closest, coordsClosest);
                        }(elt, coords), node = ref.node, offset = ref.offset, bias = -1;
                        if (1 == node.nodeType && !node.firstChild) {
                            var rect = node.getBoundingClientRect();
                            bias = rect.left != rect.right && coords.left > (rect.left + rect.right) / 2 ? 1 : -1;
                        }
                        return view.docView.posFromDOM(node, offset, bias);
                    }(view, elt, coords));
                    var desc = view.docView.nearestDesc(elt, !0);
                    return {
                        pos: pos,
                        inside: desc ? desc.posAtStart - desc.border : -1
                    };
                }(this, coords));
            }, // :: (number, number) → {left: number, right: number, top: number, bottom: number}
            // Returns the viewport rectangle at a given document position.
            // `left` and `right` will be the same number, as this returns a
            // flat cursor-ish rectangle. If the position is between two things
            // that aren't directly adjacent, `side` determines which element is
            // used. When < 0, the element before the position is used,
            // otherwise the element after.
            EditorView.prototype.coordsAtPos = function(pos, side) {
                return void 0 === side && (side = 1), coordsAtPos(this, pos, side);
            }, // :: (number, number) → {node: dom.Node, offset: number}
            // Find the DOM position that corresponds to the given document
            // position. When `side` is negative, find the position as close as
            // possible to the content before the position. When positive,
            // prefer positions close to the content after the position. When
            // zero, prefer as shallow a position as possible.
            //
            // Note that you should **not** mutate the editor's internal DOM,
            // only inspect it (and even that is usually not necessary).
            EditorView.prototype.domAtPos = function(pos, side) {
                return void 0 === side && (side = 0), this.docView.domFromPos(pos, side);
            }, // :: (number) → ?dom.Node
            // Find the DOM node that represents the document node after the
            // given position. May return `null` when the position doesn't point
            // in front of a node or if the node is inside an opaque node view.
            //
            // This is intended to be able to call things like
            // `getBoundingClientRect` on that DOM node. Do **not** mutate the
            // editor DOM directly, or add styling this way, since that will be
            // immediately overriden by the editor as it redraws the node.
            EditorView.prototype.nodeDOM = function(pos) {
                var desc = this.docView.descAt(pos);
                return desc ? desc.nodeDOM : null;
            }, // :: (dom.Node, number, ?number) → number
            // Find the document position that corresponds to a given DOM
            // position. (Whenever possible, it is preferable to inspect the
            // document structure directly, rather than poking around in the
            // DOM, but sometimes—for example when interpreting an event
            // target—you don't have a choice.)
            //
            // The `bias` parameter can be used to influence which side of a DOM
            // node to use when the position is inside a leaf node.
            EditorView.prototype.posAtDOM = function(node, offset, bias) {
                void 0 === bias && (bias = -1);
                var pos = this.docView.posFromDOM(node, offset, bias);
                if (null == pos) throw RangeError("DOM position not inside the editor");
                return pos;
            }, // :: (union<"up", "down", "left", "right", "forward", "backward">, ?EditorState) → bool
            // Find out whether the selection is at the end of a textblock when
            // moving in a given direction. When, for example, given `"left"`,
            // it will return true if moving left from the current cursor
            // position would leave that position's parent textblock. Will apply
            // to the view's current state by default, but it is possible to
            // pass a different state.
            EditorView.prototype.endOfTextblock = function(dir, state) {
                var view, state1, sel, $pos;
                return view = this, state1 = state || this.state, cachedState == state1 && cachedDir == dir ? cachedResult : (cachedState = state1, cachedDir = dir, cachedResult = "up" == dir || "down" == dir ? (sel = state1.selection, $pos = "up" == dir ? sel.$from : sel.$to, withFlushedState(view, state1, function() {
                    for(var dom = view.docView.domFromPos($pos.pos, "up" == dir ? -1 : 1).node;;){
                        var nearest = view.docView.nearestDesc(dom, !0);
                        if (!nearest) break;
                        if (nearest.node.isBlock) {
                            dom = nearest.dom;
                            break;
                        }
                        dom = nearest.dom.parentNode;
                    }
                    for(var coords = coordsAtPos(view, $pos.pos, 1), child = dom.firstChild; child; child = child.nextSibling){
                        var boxes = void 0;
                        if (1 == child.nodeType) boxes = child.getClientRects();
                        else {
                            if (3 != child.nodeType) continue;
                            boxes = textRange(child, 0, child.nodeValue.length).getClientRects();
                        }
                        for(var i = 0; i < boxes.length; i++){
                            var box = boxes[i];
                            if (box.bottom > box.top + 1 && ("up" == dir ? coords.top - box.top > (box.bottom - coords.top) * 2 : box.bottom - coords.bottom > (coords.bottom - box.top) * 2)) return !1;
                        }
                    }
                    return !0;
                })) : function(view, state, dir) {
                    var $head = state.selection.$head;
                    if (!$head.parent.isTextblock) return !1;
                    var offset = $head.parentOffset, atEnd = offset == $head.parent.content.size, sel = view.root.getSelection();
                    return(// If the textblock is all LTR, or the browser doesn't support
                    // Selection.modify (Edge), fall back to a primitive approach
                    maybeRTL.test($head.parent.textContent) && sel.modify ? withFlushedState(view, state, function() {
                        // This is a huge hack, but appears to be the best we can
                        // currently do: use `Selection.modify` to move the selection by
                        // one character, and see if that moves the cursor out of the
                        // textblock (or doesn't move it at all, when at the start/end of
                        // the document).
                        var oldRange = sel.getRangeAt(0), oldNode = sel.focusNode, oldOff = sel.focusOffset, oldBidiLevel = sel.caretBidiLevel;
                        sel.modify("move", dir, "character");
                        var result = !($head.depth ? view.docView.domAfterPos($head.before()) : view.dom).contains(1 == sel.focusNode.nodeType ? sel.focusNode : sel.focusNode.parentNode) || oldNode == sel.focusNode && oldOff == sel.focusOffset;
                        return(// Restore the previous selection
                        sel.removeAllRanges(), sel.addRange(oldRange), null != oldBidiLevel && (sel.caretBidiLevel = oldBidiLevel), result);
                    }) : "left" == dir || "backward" == dir ? !offset : atEnd);
                }(view, state1, dir));
            }, // :: ()
            // Removes the editor from the DOM and destroys all [node
            // views](#view.NodeView).
            EditorView.prototype.destroy = function() {
                this.docView && (function(view) {
                    for(var type in view.domObserver.stop(), view.eventHandlers)view.dom.removeEventListener(type, view.eventHandlers[type]);
                    clearTimeout(view.composingTimeout), clearTimeout(view.lastIOSEnterFallbackTimeout);
                }(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], viewDecorations(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null);
            }, // Used for testing.
            EditorView.prototype.dispatchEvent = function(event) {
                runCustomHandler(this, event) || !handlers[event.type] || !this.editable && event.type in editHandlers || handlers[event.type](this, event);
            }, // :: (Transaction)
            // Dispatch a transaction. Will call
            // [`dispatchTransaction`](#view.DirectEditorProps.dispatchTransaction)
            // when given, and otherwise defaults to applying the transaction to
            // the current state and calling
            // [`updateState`](#view.EditorView.updateState) with the result.
            // This method is bound to the view instance, so that it can be
            // easily passed around.
            EditorView.prototype.dispatch = function(tr) {
                var dispatchTransaction = this._props.dispatchTransaction;
                dispatchTransaction ? dispatchTransaction.call(this, tr) : this.updateState(this.state.apply(tr));
            }, Object.defineProperties(EditorView.prototype, prototypeAccessors$2);
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
        /***/ }
    }
]);
