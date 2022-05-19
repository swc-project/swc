"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        762
    ],
    {
        7421: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                $1: function() {
                    return runScopeHandlers;
                },
                $f: function() {
                    return keymap;
                },
                AE: function() {
                    return highlightSpecialChars;
                },
                Eu: function() {
                    return lineNumbers;
                },
                HQ: function() {
                    return highlightActiveLineGutter;
                },
                Nm: function() {
                    return Direction1;
                },
                OO: function() {
                    return logException;
                },
                S2: function() {
                    return crosshairCursor;
                },
                SJ: function() {
                    return GutterMarker;
                },
                Sd: function() {
                    return getPanel;
                },
                Uw: function() {
                    return drawSelection;
                },
                W$: function() {
                    return placeholder;
                },
                ZO: function() {
                    return highlightActiveLine;
                },
                Zs: function() {
                    return rectangularSelection;
                },
                bF: function() {
                    return hoverTooltip;
                },
                gB: function() {
                    return getTooltip;
                },
                hJ: function() {
                    return showTooltip;
                },
                l9: function() {
                    return WidgetType;
                },
                lg: function() {
                    return ViewPlugin;
                },
                mH: function() {
                    return showPanel;
                },
                p: function() {
                    return Decoration;
                },
                qr: function() {
                    return dropCursor;
                },
                tk: function() {
                    return EditorView;
                },
                v5: function() {
                    return gutter1;
                }
            });
            var _codemirror_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8120), style_mod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8699), w3c_keyname__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3952);
            function getSelection(root) {
                return (11 == root.nodeType ? root.getSelection ? root : root.ownerDocument : root).getSelection();
            }
            function contains(dom, node) {
                return !!node && (dom == node || dom.contains(1 != node.nodeType ? node.parentNode : node));
            }
            function deepActiveElement() {
                let elt = document.activeElement;
                for(; elt && elt.shadowRoot;)elt = elt.shadowRoot.activeElement;
                return elt;
            }
            function hasSelection(dom, selection) {
                if (!selection.anchorNode) return !1;
                try {
                    return contains(dom, selection.anchorNode);
                } catch (_) {
                    return !1;
                }
            }
            function clientRectsFor(dom) {
                return 3 == dom.nodeType ? textRange(dom, 0, dom.nodeValue.length).getClientRects() : 1 == dom.nodeType ? dom.getClientRects() : [];
            }
            function isEquivalentPosition(node, off, targetNode, targetOff) {
                return !!targetNode && (scanFor(node, off, targetNode, targetOff, -1) || scanFor(node, off, targetNode, targetOff, 1));
            }
            function domIndex(node) {
                for(var index = 0;; index++)if (!(node = node.previousSibling)) return index;
            }
            function scanFor(node, off, targetNode, targetOff, dir) {
                for(;;){
                    if (node == targetNode && off == targetOff) return !0;
                    if (off == (dir < 0 ? 0 : maxOffset(node))) {
                        if ("DIV" == node.nodeName) return !1;
                        let parent = node.parentNode;
                        if (!parent || 1 != parent.nodeType) return !1;
                        off = domIndex(node) + (dir < 0 ? 0 : 1), node = parent;
                    } else {
                        if (1 != node.nodeType || 1 == (node = node.childNodes[off + (dir < 0 ? -1 : 0)]).nodeType && "false" == node.contentEditable) return !1;
                        off = dir < 0 ? maxOffset(node) : 0;
                    }
                }
            }
            function maxOffset(node) {
                return 3 == node.nodeType ? node.nodeValue.length : node.childNodes.length;
            }
            const Rect0 = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            function flattenRect(rect, left) {
                let x = left ? rect.left : rect.right;
                return {
                    left: x,
                    right: x,
                    top: rect.top,
                    bottom: rect.bottom
                };
            }
            function windowRect(win) {
                return {
                    left: 0,
                    right: win.innerWidth,
                    top: 0,
                    bottom: win.innerHeight
                };
            }
            function scrollRectIntoView(dom, rect, side, x, y, xMargin, yMargin, ltr) {
                let doc = dom.ownerDocument, win = doc.defaultView;
                for(let cur = dom; cur;)if (1 == cur.nodeType) {
                    let bounding, top = cur == doc.body;
                    if (top) bounding = windowRect(win);
                    else {
                        if (cur.scrollHeight <= cur.clientHeight && cur.scrollWidth <= cur.clientWidth) {
                            cur = cur.parentNode;
                            continue;
                        }
                        let rect = cur.getBoundingClientRect();
                        bounding = {
                            left: rect.left,
                            right: rect.left + cur.clientWidth,
                            top: rect.top,
                            bottom: rect.top + cur.clientHeight
                        };
                    }
                    let moveX = 0, moveY = 0;
                    if ("nearest" == y) rect.top < bounding.top ? (moveY = -(bounding.top - rect.top + yMargin), side > 0 && rect.bottom > bounding.bottom + moveY && (moveY = rect.bottom - bounding.bottom + moveY + yMargin)) : rect.bottom > bounding.bottom && (moveY = rect.bottom - bounding.bottom + yMargin, side < 0 && rect.top - moveY < bounding.top && (moveY = -(bounding.top + moveY - rect.top + yMargin)));
                    else {
                        let rectHeight = rect.bottom - rect.top, boundingHeight = bounding.bottom - bounding.top;
                        moveY = ("center" == y && rectHeight <= boundingHeight ? rect.top + rectHeight / 2 - boundingHeight / 2 : "start" == y || "center" == y && side < 0 ? rect.top - yMargin : rect.bottom - boundingHeight + yMargin) - bounding.top;
                    }
                    if ("nearest" == x ? rect.left < bounding.left ? (moveX = -(bounding.left - rect.left + xMargin), side > 0 && rect.right > bounding.right + moveX && (moveX = rect.right - bounding.right + moveX + xMargin)) : rect.right > bounding.right && (moveX = rect.right - bounding.right + xMargin, side < 0 && rect.left < bounding.left + moveX && (moveX = -(bounding.left + moveX - rect.left + xMargin))) : moveX = ("center" == x ? rect.left + (rect.right - rect.left) / 2 - (bounding.right - bounding.left) / 2 : "start" == x == ltr ? rect.left - xMargin : rect.right - (bounding.right - bounding.left) + xMargin) - bounding.left, moveX || moveY) {
                        if (top) win.scrollBy(moveX, moveY);
                        else {
                            if (moveY) {
                                let start = cur.scrollTop;
                                cur.scrollTop += moveY, moveY = cur.scrollTop - start;
                            }
                            if (moveX) {
                                let start = cur.scrollLeft;
                                cur.scrollLeft += moveX, moveX = cur.scrollLeft - start;
                            }
                            rect = {
                                left: rect.left - moveX,
                                top: rect.top - moveY,
                                right: rect.right - moveX,
                                bottom: rect.bottom - moveY
                            };
                        }
                    }
                    if (top) break;
                    cur = cur.assignedSlot || cur.parentNode, x = y = "nearest";
                } else if (11 == cur.nodeType) cur = cur.host;
                else break;
            }
            class DOMSelectionState {
                constructor(){
                    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
                }
                eq(domSel) {
                    return this.anchorNode == domSel.anchorNode && this.anchorOffset == domSel.anchorOffset && this.focusNode == domSel.focusNode && this.focusOffset == domSel.focusOffset;
                }
                setRange(range) {
                    this.set(range.anchorNode, range.anchorOffset, range.focusNode, range.focusOffset);
                }
                set(anchorNode, anchorOffset, focusNode, focusOffset) {
                    this.anchorNode = anchorNode, this.anchorOffset = anchorOffset, this.focusNode = focusNode, this.focusOffset = focusOffset;
                }
            }
            let preventScrollSupported = null;
            function focusPreventScroll(dom) {
                if (dom.setActive) return dom.setActive();
                if (preventScrollSupported) return dom.focus(preventScrollSupported);
                let stack = [];
                for(let cur = dom; cur && (stack.push(cur, cur.scrollTop, cur.scrollLeft), cur != cur.ownerDocument); cur = cur.parentNode);
                if (dom.focus(null == preventScrollSupported ? {
                    get preventScroll () {
                        return preventScrollSupported = {
                            preventScroll: !0
                        }, !0;
                    }
                } : void 0), !preventScrollSupported) {
                    preventScrollSupported = !1;
                    for(let i = 0; i < stack.length;){
                        let elt = stack[i++], top = stack[i++], left = stack[i++];
                        elt.scrollTop != top && (elt.scrollTop = top), elt.scrollLeft != left && (elt.scrollLeft = left);
                    }
                }
            }
            let scratchRange;
            function textRange(node, from, to = from) {
                let range = scratchRange || (scratchRange = document.createRange());
                return range.setEnd(node, to), range.setStart(node, from), range;
            }
            function dispatchKey(elt, name, code) {
                let options = {
                    key: name,
                    code: name,
                    keyCode: code,
                    which: code,
                    cancelable: !0
                }, down = new KeyboardEvent("keydown", options);
                down.synthetic = !0, elt.dispatchEvent(down);
                let up = new KeyboardEvent("keyup", options);
                return up.synthetic = !0, elt.dispatchEvent(up), down.defaultPrevented || up.defaultPrevented;
            }
            function getRoot(node) {
                for(; node;){
                    if (node && (9 == node.nodeType || 11 == node.nodeType && node.host)) return node;
                    node = node.assignedSlot || node.parentNode;
                }
                return null;
            }
            function clearAttributes(node) {
                for(; node.attributes.length;)node.removeAttributeNode(node.attributes[0]);
            }
            class DOMPos {
                constructor(node, offset, precise = !0){
                    this.node = node, this.offset = offset, this.precise = precise;
                }
                static before(dom, precise) {
                    return new DOMPos(dom.parentNode, domIndex(dom), precise);
                }
                static after(dom, precise) {
                    return new DOMPos(dom.parentNode, domIndex(dom) + 1, precise);
                }
            }
            const noChildren = [];
            class ContentView {
                constructor(){
                    this.parent = null, this.dom = null, this.dirty = 2;
                }
                get editorView() {
                    if (!this.parent) throw new Error("Accessing view in orphan content view");
                    return this.parent.editorView;
                }
                get overrideDOMText() {
                    return null;
                }
                get posAtStart() {
                    return this.parent ? this.parent.posBefore(this) : 0;
                }
                get posAtEnd() {
                    return this.posAtStart + this.length;
                }
                posBefore(view) {
                    let pos = this.posAtStart;
                    for (let child of this.children){
                        if (child == view) return pos;
                        pos += child.length + child.breakAfter;
                    }
                    throw new RangeError("Invalid child in posBefore");
                }
                posAfter(view) {
                    return this.posBefore(view) + view.length;
                }
                coordsAt(_pos, _side) {
                    return null;
                }
                sync(track) {
                    if (2 & this.dirty) {
                        let parent = this.dom, prev = null, next;
                        for (let child of this.children){
                            if (child.dirty) {
                                if (!child.dom && (next = prev ? prev.nextSibling : parent.firstChild)) {
                                    let contentView = ContentView.get(next);
                                    contentView && (contentView.parent || contentView.constructor != child.constructor) || child.reuseDOM(next);
                                }
                                child.sync(track), child.dirty = 0;
                            }
                            if (next = prev ? prev.nextSibling : parent.firstChild, track && !track.written && track.node == parent && next != child.dom && (track.written = !0), child.dom.parentNode == parent) for(; next && next != child.dom;)next = rm$1(next);
                            else parent.insertBefore(child.dom, next);
                            prev = child.dom;
                        }
                        for((next = prev ? prev.nextSibling : parent.firstChild) && track && track.node == parent && (track.written = !0); next;)next = rm$1(next);
                    } else if (1 & this.dirty) for (let child of this.children)child.dirty && (child.sync(track), child.dirty = 0);
                }
                reuseDOM(_dom) {}
                localPosFromDOM(node, offset) {
                    let after;
                    if (node == this.dom) after = this.dom.childNodes[offset];
                    else {
                        let bias = 0 == maxOffset(node) ? 0 : 0 == offset ? -1 : 1;
                        for(;;){
                            let parent = node.parentNode;
                            if (parent == this.dom) break;
                            0 == bias && parent.firstChild != parent.lastChild && (bias = node == parent.firstChild ? -1 : 1), node = parent;
                        }
                        after = bias < 0 ? node : node.nextSibling;
                    }
                    if (after == this.dom.firstChild) return 0;
                    for(; after && !ContentView.get(after);)after = after.nextSibling;
                    if (!after) return this.length;
                    for(let i = 0, pos = 0;; i++){
                        let child = this.children[i];
                        if (child.dom == after) return pos;
                        pos += child.length + child.breakAfter;
                    }
                }
                domBoundsAround(from, to, offset = 0) {
                    let fromI = -1, fromStart = -1, toI = -1, toEnd = -1;
                    for(let i = 0, pos = offset, prevEnd = offset; i < this.children.length; i++){
                        let child = this.children[i], end = pos + child.length;
                        if (pos < from && end > to) return child.domBoundsAround(from, to, pos);
                        if (end >= from && -1 == fromI && (fromI = i, fromStart = pos), pos > to && child.dom.parentNode == this.dom) {
                            toI = i, toEnd = prevEnd;
                            break;
                        }
                        prevEnd = end, pos = end + child.breakAfter;
                    }
                    return {
                        from: fromStart,
                        to: toEnd < 0 ? offset + this.length : toEnd,
                        startDOM: (fromI ? this.children[fromI - 1].dom.nextSibling : null) || this.dom.firstChild,
                        endDOM: toI < this.children.length && toI >= 0 ? this.children[toI].dom : null
                    };
                }
                markDirty(andParent = !1) {
                    this.dirty |= 2, this.markParentsDirty(andParent);
                }
                markParentsDirty(childList) {
                    for(let parent = this.parent; parent; parent = parent.parent){
                        if (childList && (parent.dirty |= 2), 1 & parent.dirty) return;
                        parent.dirty |= 1, childList = !1;
                    }
                }
                setParent(parent) {
                    this.parent != parent && (this.parent = parent, this.dirty && this.markParentsDirty(!0));
                }
                setDOM(dom) {
                    this.dom && (this.dom.cmView = null), this.dom = dom, dom.cmView = this;
                }
                get rootView() {
                    for(let v = this;;){
                        let parent = v.parent;
                        if (!parent) return v;
                        v = parent;
                    }
                }
                replaceChildren(from, to, children = noChildren) {
                    this.markDirty();
                    for(let i = from; i < to; i++){
                        let child = this.children[i];
                        child.parent == this && child.destroy();
                    }
                    this.children.splice(from, to - from, ...children);
                    for(let i1 = 0; i1 < children.length; i1++)children[i1].setParent(this);
                }
                ignoreMutation(_rec) {
                    return !1;
                }
                ignoreEvent(_event) {
                    return !1;
                }
                childCursor(pos = this.length) {
                    return new ChildCursor(this.children, pos, this.children.length);
                }
                childPos(pos, bias = 1) {
                    return this.childCursor().findPos(pos, bias);
                }
                toString() {
                    let name = this.constructor.name.replace("View", "");
                    return name + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + ("Text" == name ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
                }
                static get(node) {
                    return node.cmView;
                }
                get isEditable() {
                    return !0;
                }
                merge(from, to, source, hasStart, openStart, openEnd) {
                    return !1;
                }
                become(other) {
                    return !1;
                }
                getSide() {
                    return 0;
                }
                destroy() {
                    this.parent = null;
                }
            }
            function rm$1(dom) {
                let next = dom.nextSibling;
                return dom.parentNode.removeChild(dom), next;
            }
            ContentView.prototype.breakAfter = 0;
            class ChildCursor {
                constructor(children, pos, i){
                    this.children = children, this.pos = pos, this.i = i, this.off = 0;
                }
                findPos(pos, bias = 1) {
                    for(;;){
                        if (pos > this.pos || pos == this.pos && (bias > 0 || 0 == this.i || this.children[this.i - 1].breakAfter)) return this.off = pos - this.pos, this;
                        let next = this.children[--this.i];
                        this.pos -= next.length + next.breakAfter;
                    }
                }
            }
            function replaceRange(parent, fromI, fromOff, toI, toOff, insert, breakAtStart, openStart, openEnd) {
                let { children  } = parent, before = children.length ? children[fromI] : null, last = insert.length ? insert[insert.length - 1] : null, breakAtEnd = last ? last.breakAfter : breakAtStart;
                if (!(fromI == toI && before && !breakAtStart && !breakAtEnd && insert.length < 2 && before.merge(fromOff, toOff, insert.length ? last : null, 0 == fromOff, openStart, openEnd))) {
                    if (toI < children.length) {
                        let after = children[toI];
                        after && toOff < after.length ? (fromI == toI && (after = after.split(toOff), toOff = 0), !breakAtEnd && last && after.merge(0, toOff, last, !0, 0, openEnd) ? insert[insert.length - 1] = after : (toOff && after.merge(0, toOff, null, !1, 0, openEnd), insert.push(after))) : (null == after ? void 0 : after.breakAfter) && (last ? last.breakAfter = 1 : breakAtStart = 1), toI++;
                    }
                    for(before && (before.breakAfter = breakAtStart, fromOff > 0 && (!breakAtStart && insert.length && before.merge(fromOff, before.length, insert[0], !1, openStart, 0) ? before.breakAfter = insert.shift().breakAfter : (fromOff < before.length || before.children.length && 0 == before.children[before.children.length - 1].length) && before.merge(fromOff, before.length, null, !1, openStart, 0), fromI++)); fromI < toI && insert.length;)if (children[toI - 1].become(insert[insert.length - 1])) toI--, insert.pop(), openEnd = insert.length ? 0 : openStart;
                    else if (children[fromI].become(insert[0])) fromI++, insert.shift(), openStart = insert.length ? 0 : openEnd;
                    else break;
                    !insert.length && fromI && toI < children.length && !children[fromI - 1].breakAfter && children[toI].merge(0, 0, children[fromI - 1], !1, openStart, openEnd) && fromI--, (fromI < toI || insert.length) && parent.replaceChildren(fromI, toI, insert);
                }
            }
            function mergeChildrenInto(parent, from, to, insert, openStart, openEnd) {
                let cur = parent.childCursor(), { i: toI , off: toOff  } = cur.findPos(to, 1), { i: fromI , off: fromOff  } = cur.findPos(from, -1), dLen = from - to;
                for (let view of insert)dLen += view.length;
                parent.length += dLen, replaceRange(parent, fromI, fromOff, toI, toOff, insert, 0, openStart, openEnd);
            }
            let nav = "undefined" != typeof navigator ? navigator : {
                userAgent: "",
                vendor: "",
                platform: ""
            }, doc1 = "undefined" != typeof document ? document : {
                documentElement: {
                    style: {}
                }
            };
            const ie_edge = /Edge\/(\d+)/.exec(nav.userAgent), ie_upto10 = /MSIE \d/.test(nav.userAgent), ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(nav.userAgent), ie = !!(ie_upto10 || ie_11up || ie_edge), gecko = !ie && /gecko\/(\d+)/i.test(nav.userAgent), chrome = !ie && /Chrome\/(\d+)/.exec(nav.userAgent), webkit = "webkitFontSmoothing" in doc1.documentElement.style, safari = !ie && /Apple Computer/.test(nav.vendor), ios = safari && (/Mobile\/\w+/.test(nav.userAgent) || nav.maxTouchPoints > 2);
            var browser = {
                mac: ios || /Mac/.test(nav.platform),
                windows: /Win/.test(nav.platform),
                linux: /Linux|X11/.test(nav.platform),
                ie,
                ie_version: ie_upto10 ? doc1.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0,
                gecko,
                gecko_version: gecko ? +(/Firefox\/(\d+)/.exec(nav.userAgent) || [
                    0,
                    0, 
                ])[1] : 0,
                chrome: !!chrome,
                chrome_version: chrome ? +chrome[1] : 0,
                ios,
                android: /Android\b/.test(nav.userAgent),
                webkit,
                safari,
                webkit_version: webkit ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [
                    0,
                    0
                ])[1] : 0,
                tabSize: null != doc1.documentElement.style.tabSize ? "tab-size" : "-moz-tab-size"
            };
            const MaxJoinLen = 256;
            class TextView extends ContentView {
                constructor(text){
                    super(), this.text = text;
                }
                get length() {
                    return this.text.length;
                }
                createDOM(textDOM) {
                    this.setDOM(textDOM || document.createTextNode(this.text));
                }
                sync(track) {
                    this.dom || this.createDOM(), this.dom.nodeValue != this.text && (track && track.node == this.dom && (track.written = !0), this.dom.nodeValue = this.text);
                }
                reuseDOM(dom) {
                    3 == dom.nodeType && this.createDOM(dom);
                }
                merge(from, to, source) {
                    return (!source || source instanceof TextView && !(this.length - (to - from) + source.length > MaxJoinLen)) && (this.text = this.text.slice(0, from) + (source ? source.text : "") + this.text.slice(to), this.markDirty(), !0);
                }
                split(from) {
                    let result = new TextView(this.text.slice(from));
                    return this.text = this.text.slice(0, from), this.markDirty(), result;
                }
                localPosFromDOM(node, offset) {
                    return node == this.dom ? offset : offset ? this.text.length : 0;
                }
                domAtPos(pos) {
                    return new DOMPos(this.dom, pos);
                }
                domBoundsAround(_from, _to, offset) {
                    return {
                        from: offset,
                        to: offset + this.length,
                        startDOM: this.dom,
                        endDOM: this.dom.nextSibling
                    };
                }
                coordsAt(pos, side) {
                    return textCoords(this.dom, pos, side);
                }
            }
            class MarkView extends ContentView {
                constructor(mark, children = [], length = 0){
                    for (let ch of (super(), this.mark = mark, this.children = children, this.length = length, children))ch.setParent(this);
                }
                setAttrs(dom) {
                    if (clearAttributes(dom), this.mark.class && (dom.className = this.mark.class), this.mark.attrs) for(let name in this.mark.attrs)dom.setAttribute(name, this.mark.attrs[name]);
                    return dom;
                }
                reuseDOM(node) {
                    node.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(node), this.dirty |= 6);
                }
                sync(track) {
                    this.dom ? 4 & this.dirty && this.setAttrs(this.dom) : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))), super.sync(track);
                }
                merge(from, to, source, _hasStart, openStart, openEnd) {
                    return (!source || !!(source instanceof MarkView && source.mark.eq(this.mark)) && (!from || !(openStart <= 0)) && (!(to < this.length) || !(openEnd <= 0))) && (mergeChildrenInto(this, from, to, source ? source.children : [], openStart - 1, openEnd - 1), this.markDirty(), !0);
                }
                split(from) {
                    let result = [], off = 0, detachFrom = -1, i = 0;
                    for (let elt of this.children){
                        let end = off + elt.length;
                        end > from && result.push(off < from ? elt.split(from - off) : elt), detachFrom < 0 && off >= from && (detachFrom = i), off = end, i++;
                    }
                    let length = this.length - from;
                    return this.length = from, detachFrom > -1 && (this.children.length = detachFrom, this.markDirty()), new MarkView(this.mark, result, length);
                }
                domAtPos(pos) {
                    return inlineDOMAtPos(this.dom, this.children, pos);
                }
                coordsAt(pos, side) {
                    return coordsInChildren(this, pos, side);
                }
            }
            function textCoords(text, pos, side) {
                let length = text.nodeValue.length;
                pos > length && (pos = length);
                let from = pos, to = pos, flatten = 0;
                0 == pos && side < 0 || pos == length && side >= 0 ? browser.chrome || browser.gecko || (pos ? (from--, flatten = 1) : (to++, flatten = -1)) : side < 0 ? from-- : to++;
                let rects = textRange(text, from, to).getClientRects();
                if (!rects.length) return Rect0;
                let rect = rects[(flatten ? flatten < 0 : side >= 0) ? 0 : rects.length - 1];
                return browser.safari && !flatten && 0 == rect.width && (rect = Array.prototype.find.call(rects, (r)=>r.width
                ) || rect), flatten ? flattenRect(rect, flatten < 0) : rect || null;
            }
            class WidgetView extends ContentView {
                constructor(widget, length, side){
                    super(), this.widget = widget, this.length = length, this.side = side, this.prevWidget = null;
                }
                static create(widget, length, side) {
                    return new (widget.customView || WidgetView)(widget, length, side);
                }
                split(from) {
                    let result = WidgetView.create(this.widget, this.length - from, this.side);
                    return this.length -= from, result;
                }
                sync() {
                    this.dom && this.widget.updateDOM(this.dom) || (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(this.editorView)), this.dom.contentEditable = "false");
                }
                getSide() {
                    return this.side;
                }
                merge(from, to, source, hasStart, openStart, openEnd) {
                    return (!source || source instanceof WidgetView && !!this.widget.compare(source.widget) && (!(from > 0) || !(openStart <= 0)) && (!(to < this.length) || !(openEnd <= 0))) && (this.length = from + (source ? source.length : 0) + (this.length - to), !0);
                }
                become(other) {
                    return other.length == this.length && other instanceof WidgetView && other.side == this.side && this.widget.constructor == other.widget.constructor && (this.widget.eq(other.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = other.widget, !0);
                }
                ignoreMutation() {
                    return !0;
                }
                ignoreEvent(event) {
                    return this.widget.ignoreEvent(event);
                }
                get overrideDOMText() {
                    if (0 == this.length) return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.xv.empty;
                    let top = this;
                    for(; top.parent;)top = top.parent;
                    let view = top.editorView, text = view && view.state.doc, start = this.posAtStart;
                    return text ? text.slice(start, start + this.length) : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.xv.empty;
                }
                domAtPos(pos) {
                    return 0 == pos ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
                }
                domBoundsAround() {
                    return null;
                }
                coordsAt(pos, side) {
                    let rects = this.dom.getClientRects(), rect = null;
                    if (!rects.length) return Rect0;
                    for(let i = pos > 0 ? rects.length - 1 : 0; rect = rects[i], pos > 0 ? 0 != i : i != rects.length - 1 && !(rect.top < rect.bottom); i += pos > 0 ? -1 : 1);
                    return 0 == pos && side > 0 || pos == this.length && side <= 0 ? rect : flattenRect(rect, 0 == pos);
                }
                get isEditable() {
                    return !1;
                }
                destroy() {
                    super.destroy(), this.dom && this.widget.destroy(this.dom);
                }
            }
            class CompositionView extends WidgetView {
                domAtPos(pos) {
                    let { topView , text  } = this.widget;
                    return topView ? scanCompositionTree(pos, 0, topView, text, (v, p)=>v.domAtPos(p)
                    , (p)=>new DOMPos(text, Math.min(p, text.nodeValue.length))
                    ) : new DOMPos(text, Math.min(pos, text.nodeValue.length));
                }
                sync() {
                    this.setDOM(this.widget.toDOM());
                }
                localPosFromDOM(node, offset) {
                    let { topView , text  } = this.widget;
                    return topView ? posFromDOMInCompositionTree(node, offset, topView, text) : Math.min(offset, this.length);
                }
                ignoreMutation() {
                    return !1;
                }
                get overrideDOMText() {
                    return null;
                }
                coordsAt(pos1, side1) {
                    let { topView , text  } = this.widget;
                    return topView ? scanCompositionTree(pos1, side1, topView, text, (v, pos, side)=>v.coordsAt(pos, side)
                    , (pos, side)=>textCoords(text, pos, side)
                    ) : textCoords(text, pos1, side1);
                }
                destroy() {
                    var _a;
                    super.destroy(), null === (_a = this.widget.topView) || void 0 === _a || _a.destroy();
                }
                get isEditable() {
                    return !0;
                }
            }
            function scanCompositionTree(pos, side, view, text, enterView, fromText) {
                if (view instanceof MarkView) {
                    for (let child of view.children){
                        let hasComp = contains(child.dom, text), len = hasComp ? text.nodeValue.length : child.length;
                        if (pos < len || pos == len && 0 >= child.getSide()) return hasComp ? scanCompositionTree(pos, side, child, text, enterView, fromText) : enterView(child, pos, side);
                        pos -= len;
                    }
                    return enterView(view, view.length, -1);
                }
                return view.dom == text ? fromText(pos, side) : enterView(view, pos, side);
            }
            function posFromDOMInCompositionTree(node, offset, view, text) {
                if (view instanceof MarkView) for (let child of view.children){
                    let pos = 0, hasComp = contains(child.dom, text);
                    if (contains(child.dom, node)) return pos + (hasComp ? posFromDOMInCompositionTree(node, offset, child, text) : child.localPosFromDOM(node, offset));
                    pos += hasComp ? text.nodeValue.length : child.length;
                }
                else if (view.dom == text) return Math.min(offset, text.nodeValue.length);
                return view.localPosFromDOM(node, offset);
            }
            class WidgetBufferView extends ContentView {
                constructor(side){
                    super(), this.side = side;
                }
                get length() {
                    return 0;
                }
                merge() {
                    return !1;
                }
                become(other) {
                    return other instanceof WidgetBufferView && other.side == this.side;
                }
                split() {
                    return new WidgetBufferView(this.side);
                }
                sync() {
                    if (!this.dom) {
                        let dom = document.createElement("img");
                        dom.className = "cm-widgetBuffer", dom.setAttribute("aria-hidden", "true"), this.setDOM(dom);
                    }
                }
                getSide() {
                    return this.side;
                }
                domAtPos(pos) {
                    return DOMPos.before(this.dom);
                }
                localPosFromDOM() {
                    return 0;
                }
                domBoundsAround() {
                    return null;
                }
                coordsAt(pos) {
                    let imgRect = this.dom.getBoundingClientRect(), siblingRect = inlineSiblingRect(this, this.side > 0 ? -1 : 1);
                    return siblingRect && siblingRect.top < imgRect.bottom && siblingRect.bottom > imgRect.top ? {
                        left: imgRect.left,
                        right: imgRect.right,
                        top: siblingRect.top,
                        bottom: siblingRect.bottom
                    } : imgRect;
                }
                get overrideDOMText() {
                    return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.xv.empty;
                }
            }
            function inlineSiblingRect(view, side) {
                let parent = view.parent, index = parent ? parent.children.indexOf(view) : -1;
                for(; parent && index >= 0;)if (side < 0 ? index > 0 : index < parent.children.length) {
                    let next = parent.children[index + side];
                    if (next instanceof TextView) {
                        let nextRect = next.coordsAt(side < 0 ? next.length : 0, side);
                        if (nextRect) return nextRect;
                    }
                    index += side;
                } else if (parent instanceof MarkView && parent.parent) index = parent.parent.children.indexOf(parent) + (side < 0 ? 0 : 1), parent = parent.parent;
                else {
                    let last = parent.dom.lastChild;
                    if (last && "BR" == last.nodeName) return last.getClientRects()[0];
                    break;
                }
            }
            function inlineDOMAtPos(dom, children, pos) {
                let i = 0;
                for(let off = 0; i < children.length; i++){
                    let child = children[i], end = off + child.length;
                    if (!(end == off && 0 >= child.getSide())) {
                        if (pos > off && pos < end && child.dom.parentNode == dom) return child.domAtPos(pos - off);
                        if (pos <= off) break;
                        off = end;
                    }
                }
                for(; i > 0; i--){
                    let before = children[i - 1].dom;
                    if (before.parentNode == dom) return DOMPos.after(before);
                }
                return new DOMPos(dom, 0);
            }
            function joinInlineInto(parent, view, open) {
                let last, { children  } = parent;
                open > 0 && view instanceof MarkView && children.length && (last = children[children.length - 1]) instanceof MarkView && last.mark.eq(view.mark) ? joinInlineInto(last, view.children[0], open - 1) : (children.push(view), view.setParent(parent)), parent.length += view.length;
            }
            function coordsInChildren(view, pos, side) {
                for(let off = 0, i = 0; i < view.children.length; i++){
                    let child = view.children[i], end = off + child.length, next;
                    if ((side <= 0 || end == view.length || child.getSide() > 0 ? end >= pos : end > pos) && (pos < end || i + 1 == view.children.length || (next = view.children[i + 1]).length || next.getSide() > 0)) {
                        let flatten = 0;
                        if (end == off) {
                            if (0 >= child.getSide()) continue;
                            flatten = side = -child.getSide();
                        }
                        let rect = child.coordsAt(Math.max(0, pos - off), side);
                        return flatten && rect ? flattenRect(rect, side < 0) : rect;
                    }
                    off = end;
                }
                let last = view.dom.lastChild;
                if (!last) return view.dom.getBoundingClientRect();
                let rects = clientRectsFor(last);
                return rects[rects.length - 1] || null;
            }
            function combineAttrs(source, target) {
                for(let name in source)"class" == name && target.class ? target.class += " " + source.class : "style" == name && target.style ? target.style += ";" + source.style : target[name] = source[name];
                return target;
            }
            function attrsEq(a, b) {
                if (a == b) return !0;
                if (!a || !b) return !1;
                let keysA = Object.keys(a), keysB = Object.keys(b);
                if (keysA.length != keysB.length) return !1;
                for (let key of keysA)if (-1 == keysB.indexOf(key) || a[key] !== b[key]) return !1;
                return !0;
            }
            function updateAttrs(dom, prev, attrs) {
                if (prev) for(let name in prev)attrs && name in attrs || dom.removeAttribute(name);
                if (attrs) for(let name1 in attrs)prev && prev[name1] == attrs[name1] || dom.setAttribute(name1, attrs[name1]);
            }
            TextView.prototype.children = WidgetView.prototype.children = WidgetBufferView.prototype.children = noChildren;
            class WidgetType {
                eq(widget) {
                    return !1;
                }
                updateDOM(dom) {
                    return !1;
                }
                compare(other) {
                    return this == other || this.constructor == other.constructor && this.eq(other);
                }
                get estimatedHeight() {
                    return -1;
                }
                ignoreEvent(event) {
                    return !0;
                }
                get customView() {
                    return null;
                }
                destroy(dom) {}
            }
            var BlockType1 = function(BlockType) {
                return BlockType[BlockType.Text = 0] = "Text", BlockType[BlockType.WidgetBefore = 1] = "WidgetBefore", BlockType[BlockType.WidgetAfter = 2] = "WidgetAfter", BlockType[BlockType.WidgetRange = 3] = "WidgetRange", BlockType;
            }(BlockType1 || (BlockType1 = {}));
            class Decoration extends _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.uU {
                constructor(startSide, endSide, widget, spec){
                    super(), this.startSide = startSide, this.endSide = endSide, this.widget = widget, this.spec = spec;
                }
                get heightRelevant() {
                    return !1;
                }
                static mark(spec) {
                    return new MarkDecoration(spec);
                }
                static widget(spec) {
                    let side = spec.side || 0, block = !!spec.block;
                    return side += block ? side > 0 ? 300000000 : -400000000 : side > 0 ? 100000000 : -100000000, new PointDecoration(spec, side, side, block, spec.widget || null, !1);
                }
                static replace(spec) {
                    let block = !!spec.block, startSide, endSide;
                    if (spec.isBlockGap) startSide = -500000000, endSide = 400000000;
                    else {
                        let { start , end  } = getInclusive(spec, block);
                        startSide = (start ? block ? -300000000 : -1 : 500000000) - 1, endSide = (end ? block ? 200000000 : 1 : -600000000) + 1;
                    }
                    return new PointDecoration(spec, startSide, endSide, block, spec.widget || null, !0);
                }
                static line(spec) {
                    return new LineDecoration(spec);
                }
                static set(of, sort = !1) {
                    return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.of(of, sort);
                }
                hasHeight() {
                    return !!this.widget && this.widget.estimatedHeight > -1;
                }
            }
            Decoration.none = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.empty;
            class MarkDecoration extends Decoration {
                constructor(spec){
                    let { start , end  } = getInclusive(spec);
                    super(start ? -1 : 500000000, end ? 1 : -600000000, null, spec), this.tagName = spec.tagName || "span", this.class = spec.class || "", this.attrs = spec.attributes || null;
                }
                eq(other) {
                    return this == other || other instanceof MarkDecoration && this.tagName == other.tagName && this.class == other.class && attrsEq(this.attrs, other.attrs);
                }
                range(from, to = from) {
                    if (from >= to) throw new RangeError("Mark decorations may not be empty");
                    return super.range(from, to);
                }
            }
            MarkDecoration.prototype.point = !1;
            class LineDecoration extends Decoration {
                constructor(spec){
                    super(-200000000, -200000000, null, spec);
                }
                eq(other) {
                    return other instanceof LineDecoration && attrsEq(this.spec.attributes, other.spec.attributes);
                }
                range(from, to = from) {
                    if (to != from) throw new RangeError("Line decoration ranges must be zero-length");
                    return super.range(from, to);
                }
            }
            LineDecoration.prototype.mapMode = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.gc.TrackBefore, LineDecoration.prototype.point = !0;
            class PointDecoration extends Decoration {
                constructor(spec, startSide, endSide, block, widget, isReplace){
                    super(startSide, endSide, widget, spec), this.block = block, this.isReplace = isReplace, this.mapMode = block ? startSide <= 0 ? _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.gc.TrackBefore : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.gc.TrackAfter : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.gc.TrackDel;
                }
                get type() {
                    return this.startSide < this.endSide ? BlockType1.WidgetRange : this.startSide <= 0 ? BlockType1.WidgetBefore : BlockType1.WidgetAfter;
                }
                get heightRelevant() {
                    return this.block || !!this.widget && this.widget.estimatedHeight >= 5;
                }
                eq(other) {
                    return other instanceof PointDecoration && widgetsEq(this.widget, other.widget) && this.block == other.block && this.startSide == other.startSide && this.endSide == other.endSide;
                }
                range(from, to = from) {
                    if (this.isReplace && (from > to || from == to && this.startSide > 0 && this.endSide <= 0)) throw new RangeError("Invalid range for replacement decoration");
                    if (!this.isReplace && to != from) throw new RangeError("Widget decorations can only have zero-length ranges");
                    return super.range(from, to);
                }
            }
            function getInclusive(spec, block = !1) {
                let { inclusiveStart: start , inclusiveEnd: end  } = spec;
                return null == start && (start = spec.inclusive), null == end && (end = spec.inclusive), {
                    start: null != start ? start : block,
                    end: null != end ? end : block
                };
            }
            function widgetsEq(a, b) {
                return a == b || !!(a && b && a.compare(b));
            }
            function addRange(from, to, ranges, margin = 0) {
                let last = ranges.length - 1;
                last >= 0 && ranges[last] + margin >= from ? ranges[last] = Math.max(ranges[last], to) : ranges.push(from, to);
            }
            PointDecoration.prototype.point = !0;
            class LineView extends ContentView {
                constructor(){
                    super(...arguments), this.children = [], this.length = 0, this.prevAttrs = void 0, this.attrs = null, this.breakAfter = 0;
                }
                merge(from, to, source, hasStart, openStart, openEnd) {
                    if (source) {
                        if (!(source instanceof LineView)) return !1;
                        this.dom || source.transferDOM(this);
                    }
                    return hasStart && this.setDeco(source ? source.attrs : null), mergeChildrenInto(this, from, to, source ? source.children : [], openStart, openEnd), !0;
                }
                split(at) {
                    let end = new LineView();
                    if (end.breakAfter = this.breakAfter, 0 == this.length) return end;
                    let { i , off  } = this.childPos(at);
                    off && (end.append(this.children[i].split(off), 0), this.children[i].merge(off, this.children[i].length, null, !1, 0, 0), i++);
                    for(let j = i; j < this.children.length; j++)end.append(this.children[j], 0);
                    for(; i > 0 && 0 == this.children[i - 1].length;)this.children[--i].destroy();
                    return this.children.length = i, this.markDirty(), this.length = at, end;
                }
                transferDOM(other) {
                    this.dom && (other.setDOM(this.dom), other.prevAttrs = void 0 === this.prevAttrs ? this.attrs : this.prevAttrs, this.prevAttrs = void 0, this.dom = null);
                }
                setDeco(attrs) {
                    attrsEq(this.attrs, attrs) || (this.dom && (this.prevAttrs = this.attrs, this.markDirty()), this.attrs = attrs);
                }
                append(child, openStart) {
                    joinInlineInto(this, child, openStart);
                }
                addLineDeco(deco) {
                    let attrs = deco.spec.attributes, cls = deco.spec.class;
                    attrs && (this.attrs = combineAttrs(attrs, this.attrs || {})), cls && (this.attrs = combineAttrs({
                        class: cls
                    }, this.attrs || {}));
                }
                domAtPos(pos) {
                    return inlineDOMAtPos(this.dom, this.children, pos);
                }
                reuseDOM(node) {
                    "DIV" == node.nodeName && (this.setDOM(node), this.dirty |= 6);
                }
                sync(track) {
                    var _a;
                    this.dom ? 4 & this.dirty && (clearAttributes(this.dom), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0) : (this.setDOM(document.createElement("div")), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0), void 0 !== this.prevAttrs && (updateAttrs(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add("cm-line"), this.prevAttrs = void 0), super.sync(track);
                    let last = this.dom.lastChild;
                    for(; last && ContentView.get(last) instanceof MarkView;)last = last.lastChild;
                    if (!last || !this.length || "BR" != last.nodeName && (null === (_a = ContentView.get(last)) || void 0 === _a ? void 0 : _a.isEditable) == !1 && (!browser.ios || !this.children.some((ch)=>ch instanceof TextView
                    ))) {
                        let hack = document.createElement("BR");
                        hack.cmIgnore = !0, this.dom.appendChild(hack);
                    }
                }
                measureTextSize() {
                    if (0 == this.children.length || this.length > 20) return null;
                    let totalWidth = 0;
                    for (let child of this.children){
                        if (!(child instanceof TextView)) return null;
                        let rects = clientRectsFor(child.dom);
                        if (1 != rects.length) return null;
                        totalWidth += rects[0].width;
                    }
                    return {
                        lineHeight: this.dom.getBoundingClientRect().height,
                        charWidth: totalWidth / this.length
                    };
                }
                coordsAt(pos, side) {
                    return coordsInChildren(this, pos, side);
                }
                become(_other) {
                    return !1;
                }
                get type() {
                    return BlockType1.Text;
                }
                static find(docView, pos) {
                    for(let i = 0, off = 0; i < docView.children.length; i++){
                        let block = docView.children[i], end = off + block.length;
                        if (end >= pos) {
                            if (block instanceof LineView) return block;
                            if (end > pos) break;
                        }
                        off = end + block.breakAfter;
                    }
                    return null;
                }
            }
            class BlockWidgetView extends ContentView {
                constructor(widget, length, type){
                    super(), this.widget = widget, this.length = length, this.type = type, this.breakAfter = 0, this.prevWidget = null;
                }
                merge(from, to, source, _takeDeco, openStart, openEnd) {
                    return (!source || source instanceof BlockWidgetView && !!this.widget.compare(source.widget) && (!(from > 0) || !(openStart <= 0)) && (!(to < this.length) || !(openEnd <= 0))) && (this.length = from + (source ? source.length : 0) + (this.length - to), !0);
                }
                domAtPos(pos) {
                    return 0 == pos ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
                }
                split(at) {
                    let len = this.length - at;
                    this.length = at;
                    let end = new BlockWidgetView(this.widget, len, this.type);
                    return end.breakAfter = this.breakAfter, end;
                }
                get children() {
                    return noChildren;
                }
                sync() {
                    this.dom && this.widget.updateDOM(this.dom) || (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(this.editorView)), this.dom.contentEditable = "false");
                }
                get overrideDOMText() {
                    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.xv.empty;
                }
                domBoundsAround() {
                    return null;
                }
                become(other) {
                    return other instanceof BlockWidgetView && other.type == this.type && other.widget.constructor == this.widget.constructor && (other.widget.eq(this.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = other.widget, this.length = other.length, this.breakAfter = other.breakAfter, !0);
                }
                ignoreMutation() {
                    return !0;
                }
                ignoreEvent(event) {
                    return this.widget.ignoreEvent(event);
                }
                destroy() {
                    super.destroy(), this.dom && this.widget.destroy(this.dom);
                }
            }
            class ContentBuilder {
                constructor(doc, pos, end, disallowBlockEffectsFor){
                    this.doc = doc, this.pos = pos, this.end = end, this.disallowBlockEffectsFor = disallowBlockEffectsFor, this.content = [], this.curLine = null, this.breakAtStart = 0, this.pendingBuffer = 0, this.atCursorPos = !0, this.openStart = -1, this.openEnd = -1, this.text = "", this.textOff = 0, this.cursor = doc.iter(), this.skip = pos;
                }
                posCovered() {
                    if (0 == this.content.length) return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
                    let last = this.content[this.content.length - 1];
                    return !last.breakAfter && !(last instanceof BlockWidgetView && last.type == BlockType1.WidgetBefore);
                }
                getLine() {
                    return this.curLine || (this.content.push(this.curLine = new LineView()), this.atCursorPos = !0), this.curLine;
                }
                flushBuffer(active) {
                    this.pendingBuffer && (this.curLine.append(wrapMarks(new WidgetBufferView(-1), active), active.length), this.pendingBuffer = 0);
                }
                addBlockWidget(view) {
                    this.flushBuffer([]), this.curLine = null, this.content.push(view);
                }
                finish(openEnd) {
                    openEnd ? this.pendingBuffer = 0 : this.flushBuffer([]), this.posCovered() || this.getLine();
                }
                buildText(length, active, openStart) {
                    for(; length > 0;){
                        if (this.textOff == this.text.length) {
                            let { value , lineBreak , done  } = this.cursor.next(this.skip);
                            if (this.skip = 0, done) throw new Error("Ran out of text content when drawing inline views");
                            if (lineBreak) {
                                this.posCovered() || this.getLine(), this.content.length ? this.content[this.content.length - 1].breakAfter = 1 : this.breakAtStart = 1, this.flushBuffer([]), this.curLine = null, length--;
                                continue;
                            }
                            this.text = value, this.textOff = 0;
                        }
                        let take = Math.min(this.text.length - this.textOff, length, 512);
                        this.flushBuffer(active.slice(0, openStart)), this.getLine().append(wrapMarks(new TextView(this.text.slice(this.textOff, this.textOff + take)), active), openStart), this.atCursorPos = !0, this.textOff += take, length -= take, openStart = 0;
                    }
                }
                span(from, to, active, openStart) {
                    this.buildText(to - from, active, openStart), this.pos = to, this.openStart < 0 && (this.openStart = openStart);
                }
                point(from, to, deco, active, openStart, index) {
                    if (this.disallowBlockEffectsFor[index] && deco instanceof PointDecoration) {
                        if (deco.block) throw new RangeError("Block decorations may not be specified via plugins");
                        if (to > this.doc.lineAt(this.pos).to) throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
                    }
                    let len = to - from;
                    if (deco instanceof PointDecoration) {
                        if (deco.block) {
                            let { type  } = deco;
                            type != BlockType1.WidgetAfter || this.posCovered() || this.getLine(), this.addBlockWidget(new BlockWidgetView(deco.widget || new NullWidget("div"), len, type));
                        } else {
                            let view = WidgetView.create(deco.widget || new NullWidget("span"), len, deco.startSide), cursorBefore = this.atCursorPos && !view.isEditable && openStart <= active.length && (from < to || deco.startSide > 0), cursorAfter = !view.isEditable && (from < to || deco.startSide <= 0), line = this.getLine();
                            2 != this.pendingBuffer || cursorBefore || (this.pendingBuffer = 0), this.flushBuffer(active), cursorBefore && (line.append(wrapMarks(new WidgetBufferView(1), active), openStart), openStart = active.length + Math.max(0, openStart - active.length)), line.append(wrapMarks(view, active), openStart), this.atCursorPos = cursorAfter, this.pendingBuffer = cursorAfter ? from < to ? 1 : 2 : 0;
                        }
                    } else this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(deco);
                    len && (this.textOff + len <= this.text.length ? this.textOff += len : (this.skip += len - (this.text.length - this.textOff), this.text = "", this.textOff = 0), this.pos = to), this.openStart < 0 && (this.openStart = openStart);
                }
                static build(text, from, to, decorations, dynamicDecorationMap) {
                    let builder = new ContentBuilder(text, from, to, dynamicDecorationMap);
                    return builder.openEnd = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.spans(decorations, from, to, builder), builder.openStart < 0 && (builder.openStart = builder.openEnd), builder.finish(builder.openEnd), builder;
                }
            }
            function wrapMarks(view, active) {
                for (let mark of active)view = new MarkView(mark, [
                    view
                ], view.length);
                return view;
            }
            class NullWidget extends WidgetType {
                constructor(tag){
                    super(), this.tag = tag;
                }
                eq(other) {
                    return other.tag == this.tag;
                }
                toDOM() {
                    return document.createElement(this.tag);
                }
                updateDOM(elt) {
                    return elt.nodeName.toLowerCase() == this.tag;
                }
            }
            const clickAddsSelectionRange = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), dragMovesSelection$1 = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), mouseSelectionStyle = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), exceptionSink = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), updateListener = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), inputHandler = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), perLineTextDirection = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine: (values)=>values.some((x)=>x
                    )
            });
            class ScrollTarget {
                constructor(range, y = "nearest", x = "nearest", yMargin = 5, xMargin = 5){
                    this.range = range, this.y = y, this.x = x, this.yMargin = yMargin, this.xMargin = xMargin;
                }
                map(changes) {
                    return changes.empty ? this : new ScrollTarget(this.range.map(changes), this.y, this.x, this.yMargin, this.xMargin);
                }
            }
            const scrollIntoView1 = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Py.define({
                map: (t, ch)=>t.map(ch)
            });
            function logException(state, exception, context) {
                let handler = state.facet(exceptionSink);
                handler.length ? handler[0](exception) : window.onerror ? window.onerror(String(exception), context, void 0, void 0, exception) : context ? console.error(context + ":", exception) : console.error(exception);
            }
            const editable = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine: (values)=>!values.length || values[0]
            });
            let nextPluginID = 0;
            const viewPlugin = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define();
            class ViewPlugin {
                constructor(id, create, domEventHandlers, buildExtensions){
                    this.id = id, this.create = create, this.domEventHandlers = domEventHandlers, this.extension = buildExtensions(this);
                }
                static define(create, spec) {
                    const { eventHandlers , provide , decorations: deco ,  } = spec || {};
                    return new ViewPlugin(nextPluginID++, create, eventHandlers, (plugin)=>{
                        let ext = [
                            viewPlugin.of(plugin)
                        ];
                        return deco && ext.push(decorations1.of((view)=>{
                            let pluginInst = view.plugin(plugin);
                            return pluginInst ? deco(pluginInst) : Decoration.none;
                        })), provide && ext.push(provide(plugin)), ext;
                    });
                }
                static fromClass(cls, spec) {
                    return ViewPlugin.define((view)=>new cls(view)
                    , spec);
                }
            }
            class PluginInstance {
                constructor(spec){
                    this.spec = spec, this.mustUpdate = null, this.value = null;
                }
                update(view) {
                    if (this.value) {
                        if (this.mustUpdate) {
                            let update = this.mustUpdate;
                            if (this.mustUpdate = null, this.value.update) try {
                                this.value.update(update);
                            } catch (e) {
                                if (logException(update.state, e, "CodeMirror plugin crashed"), this.value.destroy) try {
                                    this.value.destroy();
                                } catch (_) {}
                                this.deactivate();
                            }
                        }
                    } else if (this.spec) try {
                        this.value = this.spec.create(view);
                    } catch (e) {
                        logException(view.state, e, "CodeMirror plugin crashed"), this.deactivate();
                    }
                    return this;
                }
                destroy(view) {
                    var _a;
                    if (null === (_a = this.value) || void 0 === _a ? void 0 : _a.destroy) try {
                        this.value.destroy();
                    } catch (e) {
                        logException(view.state, e, "CodeMirror plugin crashed");
                    }
                }
                deactivate() {
                    this.spec = this.value = null;
                }
            }
            const editorAttributes = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), contentAttributes = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), decorations1 = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), atomicRanges = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), scrollMargins = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), styleModule = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define();
            class ChangedRange {
                constructor(fromA, toA, fromB, toB){
                    this.fromA = fromA, this.toA = toA, this.fromB = fromB, this.toB = toB;
                }
                join(other) {
                    return new ChangedRange(Math.min(this.fromA, other.fromA), Math.max(this.toA, other.toA), Math.min(this.fromB, other.fromB), Math.max(this.toB, other.toB));
                }
                addToSet(set) {
                    let i = set.length, me = this;
                    for(; i > 0; i--){
                        let range = set[i - 1];
                        if (!(range.fromA > me.toA)) {
                            if (range.toA < me.fromA) break;
                            me = me.join(range), set.splice(i - 1, 1);
                        }
                    }
                    return set.splice(i, 0, me), set;
                }
                static extendWithRanges(diff, ranges) {
                    if (0 == ranges.length) return diff;
                    let result = [];
                    for(let dI = 0, rI = 0, posA = 0, posB = 0;; dI++){
                        let next = dI == diff.length ? null : diff[dI], off = posA - posB, end = next ? next.fromB : 1e9;
                        for(; rI < ranges.length && ranges[rI] < end;){
                            let from = ranges[rI], to = ranges[rI + 1], fromB = Math.max(posB, from), toB = Math.min(end, to);
                            if (fromB <= toB && new ChangedRange(fromB + off, toB + off, fromB, toB).addToSet(result), to > end) break;
                            rI += 2;
                        }
                        if (!next) return result;
                        new ChangedRange(next.fromA, next.toA, next.fromB, next.toB).addToSet(result), posA = next.toA, posB = next.toB;
                    }
                }
            }
            class ViewUpdate {
                constructor(view, state, transactions){
                    for (let tr of (this.view = view, this.state = state, this.transactions = transactions, this.flags = 0, this.startState = view.state, this.changes = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.as.empty(this.startState.doc.length), transactions))this.changes = this.changes.compose(tr.changes);
                    let changedRanges = [];
                    this.changes.iterChangedRanges((fromA, toA, fromB, toB)=>changedRanges.push(new ChangedRange(fromA, toA, fromB, toB))
                    ), this.changedRanges = changedRanges;
                    let focus = view.hasFocus;
                    focus != view.inputState.notifiedFocused && (view.inputState.notifiedFocused = focus, this.flags |= 1);
                }
                static create(view, state, transactions) {
                    return new ViewUpdate(view, state, transactions);
                }
                get viewportChanged() {
                    return (4 & this.flags) > 0;
                }
                get heightChanged() {
                    return (2 & this.flags) > 0;
                }
                get geometryChanged() {
                    return this.docChanged || (10 & this.flags) > 0;
                }
                get focusChanged() {
                    return (1 & this.flags) > 0;
                }
                get docChanged() {
                    return !this.changes.empty;
                }
                get selectionSet() {
                    return this.transactions.some((tr)=>tr.selection
                    );
                }
                get empty() {
                    return 0 == this.flags && 0 == this.transactions.length;
                }
            }
            var Direction1 = function(Direction) {
                return Direction[Direction.LTR = 0] = "LTR", Direction[Direction.RTL = 1] = "RTL", Direction;
            }(Direction1 || (Direction1 = {}));
            const LTR = Direction1.LTR, RTL = Direction1.RTL;
            function dec(str) {
                let result = [];
                for(let i = 0; i < str.length; i++)result.push(1 << +str[i]);
                return result;
            }
            const LowTypes = dec("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), ArabicTypes = dec("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), Brackets = Object.create(null), BracketStack = [];
            for (let p1 of [
                "()",
                "[]",
                "{}"
            ]){
                let l = p1.charCodeAt(0), r = p1.charCodeAt(1);
                Brackets[l] = r, Brackets[r] = -l;
            }
            function charType(ch) {
                return ch <= 0xf7 ? LowTypes[ch] : 0x590 <= ch && ch <= 0x5f4 ? 2 : 0x600 <= ch && ch <= 0x6f9 ? ArabicTypes[ch - 0x600] : 0x6ee <= ch && ch <= 0x8ac ? 4 : 0x2000 <= ch && ch <= 0x200b ? 256 : 0x200c == ch ? 256 : 1;
            }
            const BidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
            class BidiSpan {
                constructor(from, to, level){
                    this.from = from, this.to = to, this.level = level;
                }
                get dir() {
                    return this.level % 2 ? RTL : LTR;
                }
                side(end, dir) {
                    return this.dir == dir == end ? this.to : this.from;
                }
                static find(order, index, level, assoc) {
                    let maybe = -1;
                    for(let i = 0; i < order.length; i++){
                        let span = order[i];
                        if (span.from <= index && span.to >= index) {
                            if (span.level == level) return i;
                            (maybe < 0 || (0 != assoc ? assoc < 0 ? span.from < index : span.to > index : order[maybe].level > span.level)) && (maybe = i);
                        }
                    }
                    if (maybe < 0) throw new RangeError("Index out of range");
                    return maybe;
                }
            }
            const types = [];
            function computeOrder(line, direction) {
                let len = line.length, outerType = direction == LTR ? 1 : 2, oppositeType = direction == LTR ? 2 : 1;
                if (!line || 1 == outerType && !BidiRE.test(line)) return trivialOrder(len);
                for(let i = 0, prev = outerType, prevStrong = outerType; i < len; i++){
                    let type = charType(line.charCodeAt(i));
                    512 == type ? type = prev : 8 == type && 4 == prevStrong && (type = 16), types[i] = 4 == type ? 2 : type, 7 & type && (prevStrong = type), prev = type;
                }
                for(let i2 = 0, prev1 = outerType, prevStrong1 = outerType; i2 < len; i2++){
                    let type = types[i2];
                    if (128 == type) i2 < len - 1 && prev1 == types[i2 + 1] && 24 & prev1 ? type = types[i2] = prev1 : types[i2] = 256;
                    else if (64 == type) {
                        let end = i2 + 1;
                        for(; end < len && 64 == types[end];)end++;
                        let replace = i2 && 8 == prev1 || end < len && 8 == types[end] ? 1 == prevStrong1 ? 1 : 8 : 256;
                        for(let j = i2; j < end; j++)types[j] = replace;
                        i2 = end - 1;
                    } else 8 == type && 1 == prevStrong1 && (types[i2] = 1);
                    prev1 = type, 7 & type && (prevStrong1 = type);
                }
                for(let i3 = 0, sI = 0, context = 0, ch, br, type; i3 < len; i3++)if (br = Brackets[ch = line.charCodeAt(i3)]) {
                    if (br < 0) {
                        for(let sJ = sI - 3; sJ >= 0; sJ -= 3)if (BracketStack[sJ + 1] == -br) {
                            let flags = BracketStack[sJ + 2], type = 2 & flags ? outerType : 4 & flags ? 1 & flags ? oppositeType : outerType : 0;
                            type && (types[i3] = types[BracketStack[sJ]] = type), sI = sJ;
                            break;
                        }
                    } else if (189 == BracketStack.length) break;
                    else BracketStack[sI++] = i3, BracketStack[sI++] = ch, BracketStack[sI++] = context;
                } else if (2 == (type = types[i3]) || 1 == type) {
                    let embed = type == outerType;
                    context = embed ? 0 : 1;
                    for(let sJ = sI - 3; sJ >= 0; sJ -= 3){
                        let cur = BracketStack[sJ + 2];
                        if (2 & cur) break;
                        if (embed) BracketStack[sJ + 2] |= 2;
                        else {
                            if (4 & cur) break;
                            BracketStack[sJ + 2] |= 4;
                        }
                    }
                }
                for(let i4 = 0; i4 < len; i4++)if (256 == types[i4]) {
                    let end = i4 + 1;
                    for(; end < len && 256 == types[end];)end++;
                    let beforeL = (i4 ? types[i4 - 1] : outerType) == 1, afterL = (end < len ? types[end] : outerType) == 1, replace = beforeL == afterL ? beforeL ? 1 : 2 : outerType;
                    for(let j = i4; j < end; j++)types[j] = replace;
                    i4 = end - 1;
                }
                let order = [];
                if (1 == outerType) for(let i5 = 0; i5 < len;){
                    let start = i5, rtl = 1 != types[i5++];
                    for(; i5 < len && rtl == (1 != types[i5]);)i5++;
                    if (rtl) for(let j = i5; j > start;){
                        let end = j, l = 2 != types[--j];
                        for(; j > start && l == (2 != types[j - 1]);)j--;
                        order.push(new BidiSpan(j, end, l ? 2 : 1));
                    }
                    else order.push(new BidiSpan(start, i5, 0));
                }
                else for(let i6 = 0; i6 < len;){
                    let start = i6, rtl = 2 == types[i6++];
                    for(; i6 < len && rtl == (2 == types[i6]);)i6++;
                    order.push(new BidiSpan(start, i6, rtl ? 1 : 2));
                }
                return order;
            }
            function trivialOrder(length) {
                return [
                    new BidiSpan(0, length, 0)
                ];
            }
            let movedOver = "";
            function moveVisually(line, order, dir, start, forward) {
                var _a;
                let startIndex = start.head - line.from, spanI = -1;
                if (0 == startIndex) {
                    if (!forward || !line.length) return null;
                    order[0].level != dir && (startIndex = order[0].side(!1, dir), spanI = 0);
                } else if (startIndex == line.length) {
                    if (forward) return null;
                    let last = order[order.length - 1];
                    last.level != dir && (startIndex = last.side(!0, dir), spanI = order.length - 1);
                }
                spanI < 0 && (spanI = BidiSpan.find(order, startIndex, null !== (_a = start.bidiLevel) && void 0 !== _a ? _a : -1, start.assoc));
                let span = order[spanI];
                startIndex == span.side(forward, dir) && (startIndex = (span = order[spanI += forward ? 1 : -1]).side(!forward, dir));
                let indexForward = forward == (span.dir == dir), nextIndex = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.cp)(line.text, startIndex, indexForward);
                if (movedOver = line.text.slice(Math.min(startIndex, nextIndex), Math.max(startIndex, nextIndex)), nextIndex != span.side(forward, dir)) return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(nextIndex + line.from, indexForward ? -1 : 1, span.level);
                let nextSpan = spanI == (forward ? order.length - 1 : 0) ? null : order[spanI + (forward ? 1 : -1)];
                return nextSpan || span.level == dir ? nextSpan && nextSpan.level < span.level ? _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(nextSpan.side(!forward, dir) + line.from, forward ? 1 : -1, nextSpan.level) : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(nextIndex + line.from, forward ? -1 : 1, span.level) : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(forward ? line.to : line.from, forward ? -1 : 1, dir);
            }
            const LineBreakPlaceholder = "\uffff";
            class DOMReader {
                constructor(points, state){
                    this.points = points, this.text = "", this.lineSeparator = state.facet(_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.yy.lineSeparator);
                }
                append(text) {
                    this.text += text;
                }
                lineBreak() {
                    this.text += LineBreakPlaceholder;
                }
                readRange(start, end) {
                    if (!start) return this;
                    let parent = start.parentNode;
                    for(let cur = start;;){
                        this.findPointBefore(parent, cur), this.readNode(cur);
                        let next = cur.nextSibling;
                        if (next == end) break;
                        let view = ContentView.get(cur), nextView = ContentView.get(next);
                        (view && nextView ? view.breakAfter : (view ? view.breakAfter : isBlockElement(cur)) || isBlockElement(next) && ("BR" != cur.nodeName || cur.cmIgnore)) && this.lineBreak(), cur = next;
                    }
                    return this.findPointBefore(parent, end), this;
                }
                readTextNode(node) {
                    let text = node.nodeValue;
                    for (let point of this.points)point.node == node && (point.pos = this.text.length + Math.min(point.offset, text.length));
                    for(let off = 0, re = this.lineSeparator ? null : /\r\n?|\n/g;;){
                        let nextBreak = -1, breakSize = 1, m;
                        if (this.lineSeparator ? (nextBreak = text.indexOf(this.lineSeparator, off), breakSize = this.lineSeparator.length) : (m = re.exec(text)) && (nextBreak = m.index, breakSize = m[0].length), this.append(text.slice(off, nextBreak < 0 ? text.length : nextBreak)), nextBreak < 0) break;
                        if (this.lineBreak(), breakSize > 1) for (let point of this.points)point.node == node && point.pos > this.text.length && (point.pos -= breakSize - 1);
                        off = nextBreak + breakSize;
                    }
                }
                readNode(node) {
                    if (node.cmIgnore) return;
                    let view = ContentView.get(node), fromView = view && view.overrideDOMText;
                    if (null != fromView) {
                        this.findPointInside(node, fromView.length);
                        for(let i = fromView.iter(); !i.next().done;)i.lineBreak ? this.lineBreak() : this.append(i.value);
                    } else 3 == node.nodeType ? this.readTextNode(node) : "BR" == node.nodeName ? node.nextSibling && this.lineBreak() : 1 == node.nodeType && this.readRange(node.firstChild, null);
                }
                findPointBefore(node, next) {
                    for (let point of this.points)point.node == node && node.childNodes[point.offset] == next && (point.pos = this.text.length);
                }
                findPointInside(node, maxLen) {
                    for (let point of this.points)(3 == node.nodeType ? point.node == node : node.contains(point.node)) && (point.pos = this.text.length + Math.min(maxLen, point.offset));
                }
            }
            function isBlockElement(node) {
                return 1 == node.nodeType && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(node.nodeName);
            }
            class DOMPoint {
                constructor(node, offset){
                    this.node = node, this.offset = offset, this.pos = -1;
                }
            }
            class DocView extends ContentView {
                constructor(view){
                    super(), this.view = view, this.compositionDeco = Decoration.none, this.decorations = [], this.dynamicDecorationMap = [], this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.setDOM(view.contentDOM), this.children = [
                        new LineView()
                    ], this.children[0].setParent(this), this.updateDeco(), this.updateInner([
                        new ChangedRange(0, 0, 0, view.state.doc.length)
                    ], 0);
                }
                get root() {
                    return this.view.root;
                }
                get editorView() {
                    return this.view;
                }
                get length() {
                    return this.view.state.doc.length;
                }
                update(update) {
                    let changedRanges = update.changedRanges;
                    this.minWidth > 0 && changedRanges.length && (changedRanges.every(({ fromA , toA  })=>toA < this.minWidthFrom || fromA > this.minWidthTo
                    ) ? (this.minWidthFrom = update.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = update.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.view.inputState.composing < 0 ? this.compositionDeco = Decoration.none : (update.transactions.length || this.dirty) && (this.compositionDeco = computeCompositionDeco(this.view, update.changes)), (browser.ie || browser.chrome) && !this.compositionDeco.size && update && update.state.doc.lines != update.startState.doc.lines && (this.forceSelection = !0);
                    let decoDiff = findChangedDeco(this.decorations, this.updateDeco(), update.changes);
                    return changedRanges = ChangedRange.extendWithRanges(changedRanges, decoDiff), (0 != this.dirty || 0 != changedRanges.length) && (this.updateInner(changedRanges, update.startState.doc.length), update.transactions.length && (this.lastUpdate = Date.now()), !0);
                }
                updateInner(changes, oldLength) {
                    this.view.viewState.mustMeasureContent = !0, this.updateChildren(changes, oldLength);
                    let { observer  } = this.view;
                    observer.ignore(()=>{
                        this.dom.style.height = this.view.viewState.contentHeight + "px", this.dom.style.minWidth = this.minWidth ? this.minWidth + "px" : "";
                        let track = browser.chrome || browser.ios ? {
                            node: observer.selectionRange.focusNode,
                            written: !1
                        } : void 0;
                        this.sync(track), this.dirty = 0, track && (track.written || observer.selectionRange.focusNode != track.node) && (this.forceSelection = !0), this.dom.style.height = "";
                    });
                    let gaps = [];
                    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length) for (let child of this.children)child instanceof BlockWidgetView && child.widget instanceof BlockGapWidget && gaps.push(child.dom);
                    observer.updateGaps(gaps);
                }
                updateChildren(changes, oldLength) {
                    let cursor = this.childCursor(oldLength);
                    for(let i = changes.length - 1;; i--){
                        let next = i >= 0 ? changes[i] : null;
                        if (!next) break;
                        let { fromA , toA , fromB , toB  } = next, { content , breakAtStart , openStart , openEnd  } = ContentBuilder.build(this.view.state.doc, fromB, toB, this.decorations, this.dynamicDecorationMap), { i: toI , off: toOff  } = cursor.findPos(toA, 1), { i: fromI , off: fromOff  } = cursor.findPos(fromA, -1);
                        replaceRange(this, fromI, fromOff, toI, toOff, content, breakAtStart, openStart, openEnd);
                    }
                }
                updateSelection(mustRead = !1, fromPointer = !1) {
                    if (mustRead && this.view.observer.readSelectionRange(), !(fromPointer || this.mayControlSelection()) || browser.ios && this.view.inputState.rapidCompositionStart) return;
                    let force = this.forceSelection;
                    this.forceSelection = !1;
                    let main = this.view.state.selection.main, anchor = this.domAtPos(main.anchor), head = main.empty ? anchor : this.domAtPos(main.head);
                    if (browser.gecko && main.empty && betweenUneditable(anchor)) {
                        let dummy = document.createTextNode("");
                        this.view.observer.ignore(()=>anchor.node.insertBefore(dummy, anchor.node.childNodes[anchor.offset] || null)
                        ), anchor = head = new DOMPos(dummy, 0), force = !0;
                    }
                    let domSel = this.view.observer.selectionRange;
                    !force && domSel.focusNode && isEquivalentPosition(anchor.node, anchor.offset, domSel.anchorNode, domSel.anchorOffset) && isEquivalentPosition(head.node, head.offset, domSel.focusNode, domSel.focusOffset) || (this.view.observer.ignore(()=>{
                        browser.android && browser.chrome && this.dom.contains(domSel.focusNode) && inUneditable(domSel.focusNode, this.dom) && (this.dom.blur(), this.dom.focus({
                            preventScroll: !0
                        }));
                        let rawSel = getSelection(this.root);
                        if (main.empty) {
                            if (browser.gecko) {
                                let nextTo = nextToUneditable(anchor.node, anchor.offset);
                                if (nextTo && 3 != nextTo) {
                                    let text = nearbyTextNode(anchor.node, anchor.offset, 1 == nextTo ? 1 : -1);
                                    text && (anchor = new DOMPos(text, 1 == nextTo ? 0 : text.nodeValue.length));
                                }
                            }
                            rawSel.collapse(anchor.node, anchor.offset), null != main.bidiLevel && null != domSel.cursorBidiLevel && (domSel.cursorBidiLevel = main.bidiLevel);
                        } else if (rawSel.extend) rawSel.collapse(anchor.node, anchor.offset), rawSel.extend(head.node, head.offset);
                        else {
                            let range = document.createRange();
                            main.anchor > main.head && ([anchor, head] = [
                                head,
                                anchor
                            ]), range.setEnd(head.node, head.offset), range.setStart(anchor.node, anchor.offset), rawSel.removeAllRanges(), rawSel.addRange(range);
                        }
                    }), this.view.observer.setSelectionRange(anchor, head)), this.impreciseAnchor = anchor.precise ? null : new DOMPos(domSel.anchorNode, domSel.anchorOffset), this.impreciseHead = head.precise ? null : new DOMPos(domSel.focusNode, domSel.focusOffset);
                }
                enforceCursorAssoc() {
                    if (this.compositionDeco.size) return;
                    let cursor = this.view.state.selection.main, sel = getSelection(this.root);
                    if (!cursor.empty || !cursor.assoc || !sel.modify) return;
                    let line = LineView.find(this, cursor.head);
                    if (!line) return;
                    let lineStart = line.posAtStart;
                    if (cursor.head == lineStart || cursor.head == lineStart + line.length) return;
                    let before = this.coordsAt(cursor.head, -1), after = this.coordsAt(cursor.head, 1);
                    if (!before || !after || before.bottom > after.top) return;
                    let dom = this.domAtPos(cursor.head + cursor.assoc);
                    sel.collapse(dom.node, dom.offset), sel.modify("move", cursor.assoc < 0 ? "forward" : "backward", "lineboundary");
                }
                mayControlSelection() {
                    return this.view.state.facet(editable) ? this.root.activeElement == this.dom : hasSelection(this.dom, this.view.observer.selectionRange);
                }
                nearest(dom) {
                    for(let cur = dom; cur;){
                        let domView = ContentView.get(cur);
                        if (domView && domView.rootView == this) return domView;
                        cur = cur.parentNode;
                    }
                    return null;
                }
                posFromDOM(node, offset) {
                    let view = this.nearest(node);
                    if (!view) throw new RangeError("Trying to find position for a DOM position outside of the document");
                    return view.localPosFromDOM(node, offset) + view.posAtStart;
                }
                domAtPos(pos) {
                    let { i , off  } = this.childCursor().findPos(pos, -1);
                    for(; i < this.children.length - 1;){
                        let child = this.children[i];
                        if (off < child.length || child instanceof LineView) break;
                        i++, off = 0;
                    }
                    return this.children[i].domAtPos(off);
                }
                coordsAt(pos, side) {
                    for(let off = this.length, i = this.children.length - 1;; i--){
                        let child = this.children[i], start = off - child.breakAfter - child.length;
                        if (pos > start || pos == start && child.type != BlockType1.WidgetBefore && child.type != BlockType1.WidgetAfter && (!i || 2 == side || this.children[i - 1].breakAfter || this.children[i - 1].type == BlockType1.WidgetBefore && side > -2)) return child.coordsAt(pos - start, side);
                        off = start;
                    }
                }
                measureVisibleLineHeights(viewport) {
                    let result = [], { from , to  } = viewport, contentWidth = this.view.contentDOM.clientWidth, isWider = contentWidth > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, widest = -1, ltr = this.view.textDirection == Direction1.LTR;
                    for(let pos = 0, i = 0; i < this.children.length; i++){
                        let child = this.children[i], end = pos + child.length;
                        if (end > to) break;
                        if (pos >= from) {
                            let childRect = child.dom.getBoundingClientRect();
                            if (result.push(childRect.height), isWider) {
                                let last = child.dom.lastChild, rects = last ? clientRectsFor(last) : [];
                                if (rects.length) {
                                    let rect = rects[rects.length - 1], width = ltr ? rect.right - childRect.left : childRect.right - rect.left;
                                    width > widest && (widest = width, this.minWidth = contentWidth, this.minWidthFrom = pos, this.minWidthTo = end);
                                }
                            }
                        }
                        pos = end + child.breakAfter;
                    }
                    return result;
                }
                textDirectionAt(pos) {
                    let { i  } = this.childPos(pos, 1);
                    return "rtl" == getComputedStyle(this.children[i].dom).direction ? Direction1.RTL : Direction1.LTR;
                }
                measureTextSize() {
                    for (let child of this.children)if (child instanceof LineView) {
                        let measure = child.measureTextSize();
                        if (measure) return measure;
                    }
                    let dummy = document.createElement("div"), lineHeight, charWidth;
                    return dummy.className = "cm-line", dummy.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(()=>{
                        this.dom.appendChild(dummy);
                        let rect = clientRectsFor(dummy.firstChild)[0];
                        lineHeight = dummy.getBoundingClientRect().height, charWidth = rect ? rect.width / 27 : 7, dummy.remove();
                    }), {
                        lineHeight,
                        charWidth
                    };
                }
                childCursor(pos = this.length) {
                    let i = this.children.length;
                    return i && (pos -= this.children[--i].length), new ChildCursor(this.children, pos, i);
                }
                computeBlockGapDeco() {
                    let deco = [], vs = this.view.viewState;
                    for(let pos = 0, i = 0;; i++){
                        let next = i == vs.viewports.length ? null : vs.viewports[i], end = next ? next.from - 1 : this.length;
                        if (end > pos) {
                            let height = vs.lineBlockAt(end).bottom - vs.lineBlockAt(pos).top;
                            deco.push(Decoration.replace({
                                widget: new BlockGapWidget(height),
                                block: !0,
                                inclusive: !0,
                                isBlockGap: !0
                            }).range(pos, end));
                        }
                        if (!next) break;
                        pos = next.to + 1;
                    }
                    return Decoration.set(deco);
                }
                updateDeco() {
                    let allDeco = this.view.state.facet(decorations1).map((d, i)=>(this.dynamicDecorationMap[i] = "function" == typeof d) ? d(this.view) : d
                    );
                    for(let i7 = allDeco.length; i7 < allDeco.length + 3; i7++)this.dynamicDecorationMap[i7] = !1;
                    return this.decorations = [
                        ...allDeco,
                        this.compositionDeco,
                        this.computeBlockGapDeco(),
                        this.view.viewState.lineGapDeco, 
                    ];
                }
                scrollIntoView(target) {
                    let { range  } = target, rect = this.coordsAt(range.head, range.empty ? range.assoc : range.head > range.anchor ? -1 : 1), other;
                    if (!rect) return;
                    !range.empty && (other = this.coordsAt(range.anchor, range.anchor > range.head ? -1 : 1)) && (rect = {
                        left: Math.min(rect.left, other.left),
                        top: Math.min(rect.top, other.top),
                        right: Math.max(rect.right, other.right),
                        bottom: Math.max(rect.bottom, other.bottom)
                    });
                    let mLeft = 0, mRight = 0, mTop = 0, mBottom = 0;
                    for (let margins of this.view.state.facet(scrollMargins).map((f)=>f(this.view)
                    ))if (margins) {
                        let { left , right , top , bottom  } = margins;
                        null != left && (mLeft = Math.max(mLeft, left)), null != right && (mRight = Math.max(mRight, right)), null != top && (mTop = Math.max(mTop, top)), null != bottom && (mBottom = Math.max(mBottom, bottom));
                    }
                    let targetRect = {
                        left: rect.left - mLeft,
                        top: rect.top - mTop,
                        right: rect.right + mRight,
                        bottom: rect.bottom + mBottom
                    };
                    scrollRectIntoView(this.view.scrollDOM, targetRect, range.head < range.anchor ? -1 : 1, target.x, target.y, target.xMargin, target.yMargin, this.view.textDirection == Direction1.LTR);
                }
            }
            function betweenUneditable(pos) {
                return 1 == pos.node.nodeType && pos.node.firstChild && (0 == pos.offset || "false" == pos.node.childNodes[pos.offset - 1].contentEditable) && (pos.offset == pos.node.childNodes.length || "false" == pos.node.childNodes[pos.offset].contentEditable);
            }
            class BlockGapWidget extends WidgetType {
                constructor(height){
                    super(), this.height = height;
                }
                toDOM() {
                    let elt = document.createElement("div");
                    return this.updateDOM(elt), elt;
                }
                eq(other) {
                    return other.height == this.height;
                }
                updateDOM(elt) {
                    return elt.style.height = this.height + "px", !0;
                }
                get estimatedHeight() {
                    return this.height;
                }
            }
            function compositionSurroundingNode(view) {
                let sel = view.observer.selectionRange, textNode = sel.focusNode && nearbyTextNode(sel.focusNode, sel.focusOffset, 0);
                if (!textNode) return null;
                let cView = view.docView.nearest(textNode);
                if (!cView) return null;
                if (cView instanceof LineView) {
                    let topNode = textNode;
                    for(; topNode.parentNode != cView.dom;)topNode = topNode.parentNode;
                    let prev = topNode.previousSibling;
                    for(; prev && !ContentView.get(prev);)prev = prev.previousSibling;
                    let pos = prev ? ContentView.get(prev).posAtEnd : cView.posAtStart;
                    return {
                        from: pos,
                        to: pos,
                        node: topNode,
                        text: textNode
                    };
                }
                {
                    for(;;){
                        let { parent  } = cView;
                        if (!parent) return null;
                        if (parent instanceof LineView) break;
                        cView = parent;
                    }
                    let from = cView.posAtStart;
                    return {
                        from,
                        to: from + cView.length,
                        node: cView.dom,
                        text: textNode
                    };
                }
            }
            function computeCompositionDeco(view, changes) {
                let surrounding = compositionSurroundingNode(view);
                if (!surrounding) return Decoration.none;
                let { from , to , node , text: textNode  } = surrounding, newFrom = changes.mapPos(from, 1), newTo = Math.max(newFrom, changes.mapPos(to, -1)), { state  } = view, text = 3 == node.nodeType ? node.nodeValue : new DOMReader([], state).readRange(node.firstChild, null).text;
                if (newTo - newFrom < text.length) {
                    if (state.doc.sliceString(newFrom, Math.min(state.doc.length, newFrom + text.length), LineBreakPlaceholder) == text) newTo = newFrom + text.length;
                    else {
                        if (state.doc.sliceString(Math.max(0, newTo - text.length), newTo, LineBreakPlaceholder) != text) return Decoration.none;
                        newFrom = newTo - text.length;
                    }
                } else if (state.doc.sliceString(newFrom, newTo, LineBreakPlaceholder) != text) return Decoration.none;
                let topView = ContentView.get(node);
                return topView instanceof CompositionView ? topView = topView.widget.topView : topView && (topView.parent = null), Decoration.set(Decoration.replace({
                    widget: new CompositionWidget(node, textNode, topView),
                    inclusive: !0
                }).range(newFrom, newTo));
            }
            class CompositionWidget extends WidgetType {
                constructor(top, text, topView){
                    super(), this.top = top, this.text = text, this.topView = topView;
                }
                eq(other) {
                    return this.top == other.top && this.text == other.text;
                }
                toDOM() {
                    return this.top;
                }
                ignoreEvent() {
                    return !1;
                }
                get customView() {
                    return CompositionView;
                }
            }
            function nearbyTextNode(node, offset, side) {
                for(;;){
                    if (3 == node.nodeType) return node;
                    if (1 == node.nodeType && offset > 0 && side <= 0) offset = maxOffset(node = node.childNodes[offset - 1]);
                    else {
                        if (1 != node.nodeType || !(offset < node.childNodes.length) || !(side >= 0)) return null;
                        node = node.childNodes[offset], offset = 0;
                    }
                }
            }
            function nextToUneditable(node, offset) {
                return 1 != node.nodeType ? 0 : (offset && "false" == node.childNodes[offset - 1].contentEditable ? 1 : 0) | (offset < node.childNodes.length && "false" == node.childNodes[offset].contentEditable ? 2 : 0);
            }
            class DecorationComparator$1 {
                constructor(){
                    this.changes = [];
                }
                compareRange(from, to) {
                    addRange(from, to, this.changes);
                }
                comparePoint(from, to) {
                    addRange(from, to, this.changes);
                }
            }
            function findChangedDeco(a, b, diff) {
                let comp = new DecorationComparator$1();
                return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.compare(a, b, diff, comp), comp.changes;
            }
            function inUneditable(node, inside) {
                for(let cur = node; cur && cur != inside; cur = cur.assignedSlot || cur.parentNode)if (1 == cur.nodeType && "false" == cur.contentEditable) return !0;
                return !1;
            }
            function groupAt(state, pos, bias = 1) {
                let categorize = state.charCategorizer(pos), line = state.doc.lineAt(pos), linePos = pos - line.from;
                if (0 == line.length) return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(pos);
                0 == linePos ? bias = 1 : linePos == line.length && (bias = -1);
                let from = linePos, to = linePos;
                bias < 0 ? from = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.cp)(line.text, linePos, !1) : to = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.cp)(line.text, linePos);
                let cat = categorize(line.text.slice(from, to));
                for(; from > 0;){
                    let prev = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.cp)(line.text, from, !1);
                    if (categorize(line.text.slice(prev, from)) != cat) break;
                    from = prev;
                }
                for(; to < line.length;){
                    let next = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.cp)(line.text, to);
                    if (categorize(line.text.slice(to, next)) != cat) break;
                    to = next;
                }
                return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.range(from + line.from, to + line.from);
            }
            function getdx(x, rect) {
                return rect.left > x ? rect.left - x : Math.max(0, x - rect.right);
            }
            function getdy(y, rect) {
                return rect.top > y ? rect.top - y : Math.max(0, y - rect.bottom);
            }
            function yOverlap(a, b) {
                return a.top < b.bottom - 1 && a.bottom > b.top + 1;
            }
            function upTop(rect, top) {
                return top < rect.top ? {
                    top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom
                } : rect;
            }
            function upBot(rect, bottom) {
                return bottom > rect.bottom ? {
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom
                } : rect;
            }
            function domPosAtCoords(parent, x, y) {
                let closest, closestRect, closestX, closestY, above, below, aboveRect, belowRect;
                for(let child = parent.firstChild; child; child = child.nextSibling){
                    let rects = clientRectsFor(child);
                    for(let i = 0; i < rects.length; i++){
                        let rect = rects[i];
                        closestRect && yOverlap(closestRect, rect) && (rect = upTop(upBot(rect, closestRect.bottom), closestRect.top));
                        let dx = getdx(x, rect), dy = getdy(y, rect);
                        if (0 == dx && 0 == dy) return 3 == child.nodeType ? domPosInText(child, x, y) : domPosAtCoords(child, x, y);
                        (!closest || closestY > dy || closestY == dy && closestX > dx) && (closest = child, closestRect = rect, closestX = dx, closestY = dy), 0 == dx ? y > rect.bottom && (!aboveRect || aboveRect.bottom < rect.bottom) ? (above = child, aboveRect = rect) : y < rect.top && (!belowRect || belowRect.top > rect.top) && (below = child, belowRect = rect) : aboveRect && yOverlap(aboveRect, rect) ? aboveRect = upBot(aboveRect, rect.bottom) : belowRect && yOverlap(belowRect, rect) && (belowRect = upTop(belowRect, rect.top));
                    }
                }
                if (aboveRect && aboveRect.bottom >= y ? (closest = above, closestRect = aboveRect) : belowRect && belowRect.top <= y && (closest = below, closestRect = belowRect), !closest) return {
                    node: parent,
                    offset: 0
                };
                let clipX = Math.max(closestRect.left, Math.min(closestRect.right, x));
                if (3 == closest.nodeType) return domPosInText(closest, clipX, y);
                if (!closestX && "true" == closest.contentEditable) return domPosAtCoords(closest, clipX, y);
                let offset = Array.prototype.indexOf.call(parent.childNodes, closest) + (x >= (closestRect.left + closestRect.right) / 2 ? 1 : 0);
                return {
                    node: parent,
                    offset
                };
            }
            function domPosInText(node, x, y) {
                let len = node.nodeValue.length, closestOffset = -1, closestDY = 1e9, generalSide = 0;
                for(let i = 0; i < len; i++){
                    let rects = textRange(node, i, i + 1).getClientRects();
                    for(let j = 0; j < rects.length; j++){
                        let rect = rects[j];
                        if (rect.top == rect.bottom) continue;
                        generalSide || (generalSide = x - rect.left);
                        let dy = (rect.top > y ? rect.top - y : y - rect.bottom) - 1;
                        if (rect.left - 1 <= x && rect.right + 1 >= x && dy < closestDY) {
                            let right = x >= (rect.left + rect.right) / 2, after = right;
                            if ((browser.chrome || browser.gecko) && textRange(node, i).getBoundingClientRect().left == rect.right && (after = !right), dy <= 0) return {
                                node,
                                offset: i + (after ? 1 : 0)
                            };
                            closestOffset = i + (after ? 1 : 0), closestDY = dy;
                        }
                    }
                }
                return {
                    node,
                    offset: closestOffset > -1 ? closestOffset : generalSide > 0 ? node.nodeValue.length : 0
                };
            }
            function posAtCoords(view, { x , y  }, precise, bias = -1) {
                var _a;
                let content = view.contentDOM.getBoundingClientRect(), docTop = content.top + view.viewState.paddingTop, block, { docHeight  } = view.viewState, yOffset = y - docTop;
                if (yOffset < 0) return 0;
                if (yOffset > docHeight) return view.state.doc.length;
                for(let halfLine = view.defaultLineHeight / 2, bounced = !1; (block = view.elementAtHeight(yOffset)).type != BlockType1.Text;)for(; !((yOffset = bias > 0 ? block.bottom + halfLine : block.top - halfLine) >= 0) || !(yOffset <= docHeight);){
                    if (bounced) return precise ? null : 0;
                    bounced = !0, bias = -bias;
                }
                y = docTop + yOffset;
                let lineStart = block.from;
                if (lineStart < view.viewport.from) return 0 == view.viewport.from ? 0 : precise ? null : posAtCoordsImprecise(view, content, block, x, y);
                if (lineStart > view.viewport.to) return view.viewport.to == view.state.doc.length ? view.state.doc.length : precise ? null : posAtCoordsImprecise(view, content, block, x, y);
                let doc = view.dom.ownerDocument, root = view.root.elementFromPoint ? view.root : doc, element = root.elementFromPoint(x, y);
                element && !view.contentDOM.contains(element) && (element = null), !element && (x = Math.max(content.left + 1, Math.min(content.right - 1, x)), (element = root.elementFromPoint(x, y)) && !view.contentDOM.contains(element) && (element = null));
                let node, offset = -1;
                if (element && (null === (_a = view.docView.nearest(element)) || void 0 === _a ? void 0 : _a.isEditable) != !1) {
                    if (doc.caretPositionFromPoint) {
                        let pos = doc.caretPositionFromPoint(x, y);
                        pos && ({ offsetNode: node , offset  } = pos);
                    } else if (doc.caretRangeFromPoint) {
                        let range = doc.caretRangeFromPoint(x, y);
                        range && ({ startContainer: node , startOffset: offset  } = range, browser.safari && isSuspiciousCaretResult(node, offset, x) && (node = void 0));
                    }
                }
                if (!node || !view.docView.dom.contains(node)) {
                    let line = LineView.find(view.docView, lineStart);
                    if (!line) return yOffset > block.top + block.height / 2 ? block.to : block.from;
                    ({ node , offset  } = domPosAtCoords(line.dom, x, y));
                }
                return view.docView.posFromDOM(node, offset);
            }
            function posAtCoordsImprecise(view, contentRect, block, x, y) {
                let into = Math.round((x - contentRect.left) * view.defaultCharacterWidth);
                view.lineWrapping && block.height > 1.5 * view.defaultLineHeight && (into += Math.floor((y - block.top) / view.defaultLineHeight) * view.viewState.heightOracle.lineLength);
                let content = view.state.sliceDoc(block.from, block.to);
                return block.from + (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Gz)(content, into, view.state.tabSize);
            }
            function isSuspiciousCaretResult(node, offset, x) {
                let len;
                if (3 != node.nodeType || offset != (len = node.nodeValue.length)) return !1;
                for(let next = node.nextSibling; next; next = next.nextSibling)if (1 != next.nodeType || "BR" != next.nodeName) return !1;
                return textRange(node, len - 1, len).getBoundingClientRect().left > x;
            }
            function moveToLineBoundary(view, start, forward, includeWrap) {
                let line = view.state.doc.lineAt(start.head), coords = includeWrap && view.lineWrapping ? view.coordsAtPos(start.assoc < 0 && start.head > line.from ? start.head - 1 : start.head) : null;
                if (coords) {
                    let editorRect = view.dom.getBoundingClientRect(), direction = view.textDirectionAt(line.from), pos = view.posAtCoords({
                        x: forward == (direction == Direction1.LTR) ? editorRect.right - 1 : editorRect.left + 1,
                        y: (coords.top + coords.bottom) / 2
                    });
                    if (null != pos) return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(pos, forward ? -1 : 1);
                }
                let lineView = LineView.find(view.docView, start.head), end = lineView ? forward ? lineView.posAtEnd : lineView.posAtStart : forward ? line.to : line.from;
                return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(end, forward ? -1 : 1);
            }
            function moveByChar(view, start, forward, by) {
                let line = view.state.doc.lineAt(start.head), spans = view.bidiSpans(line), direction = view.textDirectionAt(line.from);
                for(let cur = start, check = null;;){
                    let next = moveVisually(line, spans, direction, cur, forward), char = movedOver;
                    if (!next) {
                        if (line.number == (forward ? view.state.doc.lines : 1)) return cur;
                        char = "\n", line = view.state.doc.line(line.number + (forward ? 1 : -1)), spans = view.bidiSpans(line), next = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(forward ? line.from : line.to);
                    }
                    if (check) {
                        if (!check(char)) return cur;
                    } else {
                        if (!by) return next;
                        check = by(char);
                    }
                    cur = next;
                }
            }
            function byGroup(view, pos, start) {
                let categorize = view.state.charCategorizer(pos), cat = categorize(start);
                return (next)=>{
                    let nextCat = categorize(next);
                    return cat == _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.D0.Space && (cat = nextCat), cat == nextCat;
                };
            }
            function moveVertically(view, start, forward, distance) {
                let startPos = start.head, dir = forward ? 1 : -1;
                if (startPos == (forward ? view.state.doc.length : 0)) return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(startPos, start.assoc);
                let goal = start.goalColumn, startY, rect = view.contentDOM.getBoundingClientRect(), startCoords = view.coordsAtPos(startPos), docTop = view.documentTop;
                if (startCoords) null == goal && (goal = startCoords.left - rect.left), startY = dir < 0 ? startCoords.top : startCoords.bottom;
                else {
                    let line = view.viewState.lineBlockAt(startPos);
                    null == goal && (goal = Math.min(rect.right - rect.left, view.defaultCharacterWidth * (startPos - line.from))), startY = (dir < 0 ? line.top : line.bottom) + docTop;
                }
                let resolvedGoal = rect.left + goal, dist = null != distance ? distance : view.defaultLineHeight >> 1;
                for(let extra = 0;; extra += 10){
                    let curY = startY + (dist + extra) * dir, pos = posAtCoords(view, {
                        x: resolvedGoal,
                        y: curY
                    }, !1, dir);
                    if (curY < rect.top || curY > rect.bottom || (dir < 0 ? pos < startPos : pos > startPos)) return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(pos, start.assoc, void 0, goal);
                }
            }
            function skipAtoms(view, oldPos, pos) {
                let atoms = view.state.facet(atomicRanges).map((f)=>f(view)
                );
                for(;;){
                    let moved = !1;
                    for (let set of atoms)set.between(pos.from - 1, pos.from + 1, (from, to, value)=>{
                        pos.from > from && pos.from < to && (pos = oldPos.from > pos.from ? _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(from, 1) : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(to, -1), moved = !0);
                    });
                    if (!moved) return pos;
                }
            }
            class InputState {
                constructor(view){
                    for(let type in this.lastKeyCode = 0, this.lastKeyTime = 0, this.pendingIOSKey = void 0, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastEscPress = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.registeredEvents = [], this.customHandlers = [], this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.rapidCompositionStart = !1, this.mouseSelection = null, handlers1){
                        let handler = handlers1[type];
                        view.contentDOM.addEventListener(type, (event)=>{
                            !(!eventBelongsToEditor(view, event) || this.ignoreDuringComposition(event)) && ("keydown" == type && this.keydown(view, event) || (this.mustFlushObserver(event) && view.observer.forceFlush(), this.runCustomHandlers(type, view, event) ? event.preventDefault() : handler(view, event)));
                        }), this.registeredEvents.push(type);
                    }
                    this.notifiedFocused = view.hasFocus, browser.safari && view.contentDOM.addEventListener("input", ()=>null
                    );
                }
                setSelectionOrigin(origin) {
                    this.lastSelectionOrigin = origin, this.lastSelectionTime = Date.now();
                }
                ensureHandlers(view, plugins) {
                    var _a;
                    let handlers;
                    for (let plugin of (this.customHandlers = [], plugins))if (handlers = null === (_a = plugin.update(view).spec) || void 0 === _a ? void 0 : _a.domEventHandlers) for(let type in this.customHandlers.push({
                        plugin: plugin.value,
                        handlers
                    }), handlers)0 > this.registeredEvents.indexOf(type) && "scroll" != type && (this.registeredEvents.push(type), view.contentDOM.addEventListener(type, (event)=>{
                        eventBelongsToEditor(view, event) && this.runCustomHandlers(type, view, event) && event.preventDefault();
                    }));
                }
                runCustomHandlers(type, view, event) {
                    for (let set of this.customHandlers){
                        let handler = set.handlers[type];
                        if (handler) try {
                            if (handler.call(set.plugin, event, view) || event.defaultPrevented) return !0;
                        } catch (e) {
                            logException(view.state, e);
                        }
                    }
                    return !1;
                }
                runScrollHandlers(view, event) {
                    for (let set of this.customHandlers){
                        let handler = set.handlers.scroll;
                        if (handler) try {
                            handler.call(set.plugin, event, view);
                        } catch (e) {
                            logException(view.state, e);
                        }
                    }
                }
                keydown(view, event) {
                    if (this.lastKeyCode = event.keyCode, this.lastKeyTime = Date.now(), 9 == event.keyCode && Date.now() < this.lastEscPress + 2000) return !0;
                    if (browser.android && browser.chrome && !event.synthetic && (13 == event.keyCode || 8 == event.keyCode)) return view.observer.delayAndroidKey(event.key, event.keyCode), !0;
                    let pending;
                    return !!(browser.ios && (pending = PendingKeys.find((key)=>key.keyCode == event.keyCode
                    ))) && !(event.ctrlKey || event.altKey || event.metaKey) && !event.synthetic && (this.pendingIOSKey = pending, setTimeout(()=>this.flushIOSKey(view)
                    , 250), !0);
                }
                flushIOSKey(view) {
                    let key = this.pendingIOSKey;
                    return !!key && (this.pendingIOSKey = void 0, dispatchKey(view.contentDOM, key.key, key.keyCode));
                }
                ignoreDuringComposition(event) {
                    return !!/^key/.test(event.type) && (this.composing > 0 || !!(browser.safari && Date.now() - this.compositionEndedAt < 100) && (this.compositionEndedAt = 0, !0));
                }
                mustFlushObserver(event) {
                    return "keydown" == event.type && 229 != event.keyCode || "compositionend" == event.type && !browser.ios;
                }
                startMouseSelection(mouseSelection) {
                    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = mouseSelection;
                }
                update(update) {
                    this.mouseSelection && this.mouseSelection.update(update), update.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
                }
                destroy() {
                    this.mouseSelection && this.mouseSelection.destroy();
                }
            }
            const PendingKeys = [
                {
                    key: "Backspace",
                    keyCode: 8,
                    inputType: "deleteContentBackward"
                },
                {
                    key: "Enter",
                    keyCode: 13,
                    inputType: "insertParagraph"
                },
                {
                    key: "Delete",
                    keyCode: 46,
                    inputType: "deleteContentForward"
                }, 
            ], modifierCodes = [
                16,
                17,
                18,
                20,
                91,
                92,
                224,
                225
            ];
            class MouseSelection {
                constructor(view, startEvent, style, mustSelect){
                    this.view = view, this.style = style, this.mustSelect = mustSelect, this.lastEvent = startEvent;
                    let doc = view.contentDOM.ownerDocument;
                    doc.addEventListener("mousemove", this.move = this.move.bind(this)), doc.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = startEvent.shiftKey, this.multiple = view.state.facet(_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.yy.allowMultipleSelections) && addsSelectionRange(view, startEvent), this.dragMove = dragMovesSelection(view, startEvent), this.dragging = !!isInPrimarySelection(view, startEvent) && 1 == getClickType(startEvent) && null, !1 === this.dragging && (startEvent.preventDefault(), this.select(startEvent));
                }
                move(event) {
                    if (0 == event.buttons) return this.destroy();
                    !1 === this.dragging && this.select(this.lastEvent = event);
                }
                up(event) {
                    null == this.dragging && this.select(this.lastEvent), this.dragging || event.preventDefault(), this.destroy();
                }
                destroy() {
                    let doc = this.view.contentDOM.ownerDocument;
                    doc.removeEventListener("mousemove", this.move), doc.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = null;
                }
                select(event) {
                    let selection = this.style.get(event, this.extend, this.multiple);
                    (this.mustSelect || !selection.eq(this.view.state.selection) || selection.main.assoc != this.view.state.selection.main.assoc) && this.view.dispatch({
                        selection,
                        userEvent: "select.pointer",
                        scrollIntoView: !0
                    }), this.mustSelect = !1;
                }
                update(update) {
                    update.docChanged && this.dragging && (this.dragging = this.dragging.map(update.changes)), this.style.update(update) && setTimeout(()=>this.select(this.lastEvent)
                    , 20);
                }
            }
            function addsSelectionRange(view, event) {
                let facet = view.state.facet(clickAddsSelectionRange);
                return facet.length ? facet[0](event) : browser.mac ? event.metaKey : event.ctrlKey;
            }
            function dragMovesSelection(view, event) {
                let facet = view.state.facet(dragMovesSelection$1);
                return facet.length ? facet[0](event) : browser.mac ? !event.altKey : !event.ctrlKey;
            }
            function isInPrimarySelection(view, event) {
                let { main  } = view.state.selection;
                if (main.empty) return !1;
                let sel = getSelection(view.root);
                if (0 == sel.rangeCount) return !0;
                let rects = sel.getRangeAt(0).getClientRects();
                for(let i = 0; i < rects.length; i++){
                    let rect = rects[i];
                    if (rect.left <= event.clientX && rect.right >= event.clientX && rect.top <= event.clientY && rect.bottom >= event.clientY) return !0;
                }
                return !1;
            }
            function eventBelongsToEditor(view, event) {
                if (!event.bubbles) return !0;
                if (event.defaultPrevented) return !1;
                for(let node = event.target, cView; node != view.contentDOM; node = node.parentNode)if (!node || 11 == node.nodeType || (cView = ContentView.get(node)) && cView.ignoreEvent(event)) return !1;
                return !0;
            }
            const handlers1 = Object.create(null), brokenClipboardAPI = browser.ie && browser.ie_version < 15 || browser.ios && browser.webkit_version < 604;
            function capturePaste(view) {
                let parent = view.dom.parentNode;
                if (!parent) return;
                let target = parent.appendChild(document.createElement("textarea"));
                target.style.cssText = "position: fixed; left: -10000px; top: 10px", target.focus(), setTimeout(()=>{
                    view.focus(), target.remove(), doPaste(view, target.value);
                }, 50);
            }
            function doPaste(view, input) {
                let { state  } = view, changes, i = 1, text = state.toText(input), byLine = text.lines == state.selection.ranges.length;
                if (null != lastLinewiseCopy && state.selection.ranges.every((r)=>r.empty
                ) && lastLinewiseCopy == text.toString()) {
                    let lastLine = -1;
                    changes = state.changeByRange((range)=>{
                        let line = state.doc.lineAt(range.from);
                        if (line.from == lastLine) return {
                            range
                        };
                        lastLine = line.from;
                        let insert = state.toText((byLine ? text.line(i++).text : input) + state.lineBreak);
                        return {
                            changes: {
                                from: line.from,
                                insert
                            },
                            range: _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(range.from + insert.length)
                        };
                    });
                } else changes = byLine ? state.changeByRange((range)=>{
                    let line = text.line(i++);
                    return {
                        changes: {
                            from: range.from,
                            to: range.to,
                            insert: line.text
                        },
                        range: _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(range.from + line.length)
                    };
                }) : state.replaceSelection(text);
                view.dispatch(changes, {
                    userEvent: "input.paste",
                    scrollIntoView: !0
                });
            }
            handlers1.keydown = (view, event)=>{
                view.inputState.setSelectionOrigin("select"), 27 == event.keyCode ? view.inputState.lastEscPress = Date.now() : 0 > modifierCodes.indexOf(event.keyCode) && (view.inputState.lastEscPress = 0);
            };
            let lastTouch = 0;
            function rangeForClick(view, pos, bias, type) {
                if (1 == type) return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(pos, bias);
                {
                    if (2 == type) return groupAt(view.state, pos, bias);
                    let visual = LineView.find(view.docView, pos), line = view.state.doc.lineAt(visual ? visual.posAtEnd : pos), from = visual ? visual.posAtStart : line.from, to = visual ? visual.posAtEnd : line.to;
                    return to < view.state.doc.length && to == line.to && to++, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.range(from, to);
                }
            }
            handlers1.touchstart = (view, e)=>{
                lastTouch = Date.now(), view.inputState.setSelectionOrigin("select.pointer");
            }, handlers1.touchmove = (view)=>{
                view.inputState.setSelectionOrigin("select.pointer");
            }, handlers1.mousedown = (view, event)=>{
                if (view.observer.flush(), lastTouch > Date.now() - 2000 && 1 == getClickType(event)) return;
                let style = null;
                for (let makeStyle of view.state.facet(mouseSelectionStyle))if (style = makeStyle(view, event)) break;
                if (style || 0 != event.button || (style = basicMouseSelection(view, event)), style) {
                    let mustFocus = view.root.activeElement != view.contentDOM;
                    mustFocus && view.observer.ignore(()=>focusPreventScroll(view.contentDOM)
                    ), view.inputState.startMouseSelection(new MouseSelection(view, event, style, mustFocus));
                }
            };
            let insideY = (y, rect)=>y >= rect.top && y <= rect.bottom
            , inside1 = (x, y, rect)=>insideY(y, rect) && x >= rect.left && x <= rect.right
            ;
            function findPositionSide(view, pos, x, y) {
                let line = LineView.find(view.docView, pos);
                if (!line) return 1;
                let off = pos - line.posAtStart;
                if (0 == off) return 1;
                if (off == line.length) return -1;
                let before = line.coordsAt(off, -1);
                if (before && inside1(x, y, before)) return -1;
                let after = line.coordsAt(off, 1);
                return after && inside1(x, y, after) ? 1 : before && insideY(y, before) ? -1 : 1;
            }
            function queryPos(view, event) {
                let pos = view.posAtCoords({
                    x: event.clientX,
                    y: event.clientY
                }, !1);
                return {
                    pos,
                    bias: findPositionSide(view, pos, event.clientX, event.clientY)
                };
            }
            const BadMouseDetail = browser.ie && browser.ie_version <= 11;
            let lastMouseDown = null, lastMouseDownCount = 0, lastMouseDownTime = 0;
            function getClickType(event) {
                if (!BadMouseDetail) return event.detail;
                let last = lastMouseDown, lastTime = lastMouseDownTime;
                return lastMouseDown = event, lastMouseDownTime = Date.now(), lastMouseDownCount = !last || lastTime > Date.now() - 400 && 2 > Math.abs(last.clientX - event.clientX) && 2 > Math.abs(last.clientY - event.clientY) ? (lastMouseDownCount + 1) % 3 : 1;
            }
            function basicMouseSelection(view, event1) {
                let start = queryPos(view, event1), type = getClickType(event1), startSel = view.state.selection, last = start, lastEvent = event1;
                return {
                    update (update) {
                        update.docChanged && (start && (start.pos = update.changes.mapPos(start.pos)), startSel = startSel.map(update.changes), lastEvent = null);
                    },
                    get (event, extend, multiple) {
                        let cur;
                        if (lastEvent && event.clientX == lastEvent.clientX && event.clientY == lastEvent.clientY ? cur = last : (cur = last = queryPos(view, event), lastEvent = event), !cur || !start) return startSel;
                        let range = rangeForClick(view, cur.pos, cur.bias, type);
                        if (start.pos != cur.pos && !extend) {
                            let startRange = rangeForClick(view, start.pos, start.bias, type), from = Math.min(startRange.from, range.from), to = Math.max(startRange.to, range.to);
                            range = from < range.from ? _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.range(from, to) : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.range(to, from);
                        }
                        return extend ? startSel.replaceRange(startSel.main.extend(range.from, range.to)) : multiple ? startSel.addRange(range) : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.create([
                            range
                        ]);
                    }
                };
            }
            function dropText(view, event, text, direct) {
                if (!text) return;
                let dropPos = view.posAtCoords({
                    x: event.clientX,
                    y: event.clientY
                }, !1);
                event.preventDefault();
                let { mouseSelection  } = view.inputState, del = direct && mouseSelection && mouseSelection.dragging && mouseSelection.dragMove ? {
                    from: mouseSelection.dragging.from,
                    to: mouseSelection.dragging.to
                } : null, ins = {
                    from: dropPos,
                    insert: text
                }, changes = view.state.changes(del ? [
                    del,
                    ins
                ] : ins);
                view.focus(), view.dispatch({
                    changes,
                    selection: {
                        anchor: changes.mapPos(dropPos, -1),
                        head: changes.mapPos(dropPos, 1)
                    },
                    userEvent: del ? "move.drop" : "input.drop"
                });
            }
            function captureCopy(view, text) {
                let parent = view.dom.parentNode;
                if (!parent) return;
                let target = parent.appendChild(document.createElement("textarea"));
                target.style.cssText = "position: fixed; left: -10000px; top: 10px", target.value = text, target.focus(), target.selectionEnd = text.length, target.selectionStart = 0, setTimeout(()=>{
                    target.remove(), view.focus();
                }, 50);
            }
            function copiedRange(state) {
                let content = [], ranges = [], linewise = !1;
                for (let range of state.selection.ranges)range.empty || (content.push(state.sliceDoc(range.from, range.to)), ranges.push(range));
                if (!content.length) {
                    let upto = -1;
                    for (let { from  } of state.selection.ranges){
                        let line = state.doc.lineAt(from);
                        line.number > upto && (content.push(line.text), ranges.push({
                            from: line.from,
                            to: Math.min(state.doc.length, line.to + 1)
                        })), upto = line.number;
                    }
                    linewise = !0;
                }
                return {
                    text: content.join(state.lineBreak),
                    ranges,
                    linewise
                };
            }
            handlers1.dragstart = (view, event)=>{
                let { selection: { main  } ,  } = view.state, { mouseSelection  } = view.inputState;
                mouseSelection && (mouseSelection.dragging = main), event.dataTransfer && (event.dataTransfer.setData("Text", view.state.sliceDoc(main.from, main.to)), event.dataTransfer.effectAllowed = "copyMove");
            }, handlers1.drop = (view, event)=>{
                if (!event.dataTransfer) return;
                if (view.state.readOnly) return event.preventDefault();
                let files = event.dataTransfer.files;
                if (files && files.length) {
                    event.preventDefault();
                    let text = Array(files.length), read = 0, finishFile = ()=>{
                        ++read == files.length && dropText(view, event, text.filter((s)=>null != s
                        ).join(view.state.lineBreak), !1);
                    };
                    for(let i = 0; i < files.length; i++){
                        let reader = new FileReader();
                        reader.onerror = finishFile, reader.onload = ()=>{
                            /[\x00-\x08\x0e-\x1f]{2}/.test(reader.result) || (text[i] = reader.result), finishFile();
                        }, reader.readAsText(files[i]);
                    }
                } else dropText(view, event, event.dataTransfer.getData("Text"), !0);
            }, handlers1.paste = (view, event)=>{
                if (view.state.readOnly) return event.preventDefault();
                view.observer.flush();
                let data = brokenClipboardAPI ? null : event.clipboardData;
                data ? (doPaste(view, data.getData("text/plain")), event.preventDefault()) : capturePaste(view);
            };
            let lastLinewiseCopy = null;
            function updateForFocusChange(view) {
                setTimeout(()=>{
                    view.hasFocus != view.inputState.notifiedFocused && view.update([]);
                }, 10);
            }
            function forceClearComposition(view, rapid) {
                if (view.docView.compositionDeco.size) {
                    view.inputState.rapidCompositionStart = rapid;
                    try {
                        view.update([]);
                    } finally{
                        view.inputState.rapidCompositionStart = !1;
                    }
                }
            }
            handlers1.copy = handlers1.cut = (view, event)=>{
                let { text , ranges , linewise  } = copiedRange(view.state);
                if (!text && !linewise) return;
                lastLinewiseCopy = linewise ? text : null;
                let data = brokenClipboardAPI ? null : event.clipboardData;
                data ? (event.preventDefault(), data.clearData(), data.setData("text/plain", text)) : captureCopy(view, text), "cut" != event.type || view.state.readOnly || view.dispatch({
                    changes: ranges,
                    scrollIntoView: !0,
                    userEvent: "delete.cut"
                });
            }, handlers1.focus = updateForFocusChange, handlers1.blur = (view)=>{
                view.observer.clearSelectionRange(), updateForFocusChange(view);
            }, handlers1.compositionstart = handlers1.compositionupdate = (view)=>{
                null == view.inputState.compositionFirstChange && (view.inputState.compositionFirstChange = !0), view.inputState.composing < 0 && (view.inputState.composing = 0, view.docView.compositionDeco.size && (view.observer.flush(), forceClearComposition(view, !0)));
            }, handlers1.compositionend = (view)=>{
                view.inputState.composing = -1, view.inputState.compositionEndedAt = Date.now(), view.inputState.compositionFirstChange = null, setTimeout(()=>{
                    view.inputState.composing < 0 && forceClearComposition(view, !1);
                }, 50);
            }, handlers1.contextmenu = (view)=>{
                view.inputState.lastContextMenu = Date.now();
            }, handlers1.beforeinput = (view, event)=>{
                var _a1;
                let pending;
                if (browser.chrome && browser.android && (pending = PendingKeys.find((key)=>key.inputType == event.inputType
                )) && (view.observer.delayAndroidKey(pending.key, pending.keyCode), "Backspace" == pending.key || "Delete" == pending.key)) {
                    let startViewHeight = (null === (_a1 = window.visualViewport) || void 0 === _a1 ? void 0 : _a1.height) || 0;
                    setTimeout(()=>{
                        var _a;
                        ((null === (_a = window.visualViewport) || void 0 === _a ? void 0 : _a.height) || 0) > startViewHeight + 10 && view.hasFocus && (view.contentDOM.blur(), view.focus());
                    }, 100);
                }
            };
            const wrappingWhiteSpace = [
                "pre-wrap",
                "normal",
                "pre-line",
                "break-spaces", 
            ];
            class HeightOracle {
                constructor(){
                    this.doc = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.xv.empty, this.lineWrapping = !1, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.lineLength = 30, this.heightChanged = !1;
                }
                heightForGap(from, to) {
                    let lines = this.doc.lineAt(to).number - this.doc.lineAt(from).number + 1;
                    return this.lineWrapping && (lines += Math.ceil((to - from - lines * this.lineLength * 0.5) / this.lineLength)), this.lineHeight * lines;
                }
                heightForLine(length) {
                    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((length - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
                }
                setDoc(doc) {
                    return this.doc = doc, this;
                }
                mustRefreshForWrapping(whiteSpace) {
                    return wrappingWhiteSpace.indexOf(whiteSpace) > -1 != this.lineWrapping;
                }
                mustRefreshForHeights(lineHeights) {
                    let newHeight = !1;
                    for(let i = 0; i < lineHeights.length; i++){
                        let h = lineHeights[i];
                        h < 0 ? i++ : this.heightSamples[Math.floor(10 * h)] || (newHeight = !0, this.heightSamples[Math.floor(10 * h)] = !0);
                    }
                    return newHeight;
                }
                refresh(whiteSpace, lineHeight, charWidth, lineLength, knownHeights) {
                    let lineWrapping = wrappingWhiteSpace.indexOf(whiteSpace) > -1, changed = Math.round(lineHeight) != Math.round(this.lineHeight) || this.lineWrapping != lineWrapping;
                    if (this.lineWrapping = lineWrapping, this.lineHeight = lineHeight, this.charWidth = charWidth, this.lineLength = lineLength, changed) {
                        this.heightSamples = {};
                        for(let i = 0; i < knownHeights.length; i++){
                            let h = knownHeights[i];
                            h < 0 ? i++ : this.heightSamples[Math.floor(10 * h)] = !0;
                        }
                    }
                    return changed;
                }
            }
            class MeasuredHeights {
                constructor(from, heights){
                    this.from = from, this.heights = heights, this.index = 0;
                }
                get more() {
                    return this.index < this.heights.length;
                }
            }
            class BlockInfo {
                constructor(from, length, top, height, type){
                    this.from = from, this.length = length, this.top = top, this.height = height, this.type = type;
                }
                get to() {
                    return this.from + this.length;
                }
                get bottom() {
                    return this.top + this.height;
                }
                join(other) {
                    let detail = (Array.isArray(this.type) ? this.type : [
                        this
                    ]).concat(Array.isArray(other.type) ? other.type : [
                        other
                    ]);
                    return new BlockInfo(this.from, this.length + other.length, this.top, this.height + other.height, detail);
                }
            }
            var QueryType1 = function(QueryType) {
                return QueryType[QueryType.ByPos = 0] = "ByPos", QueryType[QueryType.ByHeight = 1] = "ByHeight", QueryType[QueryType.ByPosNoHeight = 2] = "ByPosNoHeight", QueryType;
            }(QueryType1 || (QueryType1 = {}));
            const Epsilon = 1e-3;
            class HeightMap {
                constructor(length, height, flags = 2){
                    this.length = length, this.height = height, this.flags = flags;
                }
                get outdated() {
                    return (2 & this.flags) > 0;
                }
                set outdated(value) {
                    this.flags = (value ? 2 : 0) | -3 & this.flags;
                }
                setHeight(oracle, height) {
                    this.height != height && (Math.abs(this.height - height) > Epsilon && (oracle.heightChanged = !0), this.height = height);
                }
                replace(_from, _to, nodes) {
                    return HeightMap.of(nodes);
                }
                decomposeLeft(_to, result) {
                    result.push(this);
                }
                decomposeRight(_from, result) {
                    result.push(this);
                }
                applyChanges(decorations, oldDoc, oracle, changes) {
                    let me = this;
                    for(let i = changes.length - 1; i >= 0; i--){
                        let { fromA , toA , fromB , toB  } = changes[i], start = me.lineAt(fromA, QueryType1.ByPosNoHeight, oldDoc, 0, 0), end = start.to >= toA ? start : me.lineAt(toA, QueryType1.ByPosNoHeight, oldDoc, 0, 0);
                        for(toB += end.to - toA, toA = end.to; i > 0 && start.from <= changes[i - 1].toA;)fromA = changes[i - 1].fromA, fromB = changes[i - 1].fromB, i--, fromA < start.from && (start = me.lineAt(fromA, QueryType1.ByPosNoHeight, oldDoc, 0, 0));
                        fromB += start.from - fromA, fromA = start.from;
                        let nodes = NodeBuilder.build(oracle, decorations, fromB, toB);
                        me = me.replace(fromA, toA, nodes);
                    }
                    return me.updateHeight(oracle, 0);
                }
                static empty() {
                    return new HeightMapText(0, 0);
                }
                static of(nodes) {
                    if (1 == nodes.length) return nodes[0];
                    let i = 0, j = nodes.length, before = 0, after = 0;
                    for(;;)if (i == j) {
                        if (before > 2 * after) {
                            let split = nodes[i - 1];
                            split.break ? nodes.splice(--i, 1, split.left, null, split.right) : nodes.splice(--i, 1, split.left, split.right), j += 1 + split.break, before -= split.size;
                        } else if (after > 2 * before) {
                            let split = nodes[j];
                            split.break ? nodes.splice(j, 1, split.left, null, split.right) : nodes.splice(j, 1, split.left, split.right), j += 2 + split.break, after -= split.size;
                        } else break;
                    } else if (before < after) {
                        let next = nodes[i++];
                        next && (before += next.size);
                    } else {
                        let next = nodes[--j];
                        next && (after += next.size);
                    }
                    let brk = 0;
                    return null == nodes[i - 1] ? (brk = 1, i--) : null == nodes[i] && (brk = 1, j++), new HeightMapBranch(HeightMap.of(nodes.slice(0, i)), brk, HeightMap.of(nodes.slice(j)));
                }
            }
            HeightMap.prototype.size = 1;
            class HeightMapBlock extends HeightMap {
                constructor(length, height, type){
                    super(length, height), this.type = type;
                }
                blockAt(_height, _doc, top, offset) {
                    return new BlockInfo(offset, this.length, top, this.height, this.type);
                }
                lineAt(_value, _type, doc, top, offset) {
                    return this.blockAt(0, doc, top, offset);
                }
                forEachLine(from, to, doc, top, offset, f) {
                    from <= offset + this.length && to >= offset && f(this.blockAt(0, doc, top, offset));
                }
                updateHeight(oracle, offset = 0, _force = !1, measured) {
                    return measured && measured.from <= offset && measured.more && this.setHeight(oracle, measured.heights[measured.index++]), this.outdated = !1, this;
                }
                toString() {
                    return `block(${this.length})`;
                }
            }
            class HeightMapText extends HeightMapBlock {
                constructor(length, height){
                    super(length, height, BlockType1.Text), this.collapsed = 0, this.widgetHeight = 0;
                }
                replace(_from, _to, nodes) {
                    let node = nodes[0];
                    return 1 == nodes.length && (node instanceof HeightMapText || node instanceof HeightMapGap && 4 & node.flags) && 10 > Math.abs(this.length - node.length) ? (node instanceof HeightMapGap ? node = new HeightMapText(node.length, this.height) : node.height = this.height, this.outdated || (node.outdated = !1), node) : HeightMap.of(nodes);
                }
                updateHeight(oracle, offset = 0, force = !1, measured) {
                    return measured && measured.from <= offset && measured.more ? this.setHeight(oracle, measured.heights[measured.index++]) : (force || this.outdated) && this.setHeight(oracle, Math.max(this.widgetHeight, oracle.heightForLine(this.length - this.collapsed))), this.outdated = !1, this;
                }
                toString() {
                    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
                }
            }
            class HeightMapGap extends HeightMap {
                constructor(length){
                    super(length, 0);
                }
                lines(doc, offset) {
                    let firstLine = doc.lineAt(offset).number, lastLine = doc.lineAt(offset + this.length).number;
                    return {
                        firstLine,
                        lastLine,
                        lineHeight: this.height / (lastLine - firstLine + 1)
                    };
                }
                blockAt(height, doc, top, offset) {
                    let { firstLine , lastLine , lineHeight  } = this.lines(doc, offset), line = Math.max(0, Math.min(lastLine - firstLine, Math.floor((height - top) / lineHeight))), { from , length  } = doc.line(firstLine + line);
                    return new BlockInfo(from, length, top + lineHeight * line, lineHeight, BlockType1.Text);
                }
                lineAt(value, type, doc, top, offset) {
                    if (type == QueryType1.ByHeight) return this.blockAt(value, doc, top, offset);
                    if (type == QueryType1.ByPosNoHeight) {
                        let { from , to  } = doc.lineAt(value);
                        return new BlockInfo(from, to - from, 0, 0, BlockType1.Text);
                    }
                    let { firstLine , lineHeight  } = this.lines(doc, offset), { from , length , number  } = doc.lineAt(value);
                    return new BlockInfo(from, length, top + lineHeight * (number - firstLine), lineHeight, BlockType1.Text);
                }
                forEachLine(from, to, doc, top, offset, f) {
                    let { firstLine , lineHeight  } = this.lines(doc, offset);
                    for(let pos = Math.max(from, offset), end = Math.min(offset + this.length, to); pos <= end;){
                        let line = doc.lineAt(pos);
                        pos == from && (top += lineHeight * (line.number - firstLine)), f(new BlockInfo(line.from, line.length, top, lineHeight, BlockType1.Text)), top += lineHeight, pos = line.to + 1;
                    }
                }
                replace(from, to, nodes) {
                    let after = this.length - to;
                    if (after > 0) {
                        let last = nodes[nodes.length - 1];
                        last instanceof HeightMapGap ? nodes[nodes.length - 1] = new HeightMapGap(last.length + after) : nodes.push(null, new HeightMapGap(after - 1));
                    }
                    if (from > 0) {
                        let first = nodes[0];
                        first instanceof HeightMapGap ? nodes[0] = new HeightMapGap(from + first.length) : nodes.unshift(new HeightMapGap(from - 1), null);
                    }
                    return HeightMap.of(nodes);
                }
                decomposeLeft(to, result) {
                    result.push(new HeightMapGap(to - 1), null);
                }
                decomposeRight(from, result) {
                    result.push(null, new HeightMapGap(this.length - from - 1));
                }
                updateHeight(oracle, offset = 0, force = !1, measured) {
                    let end = offset + this.length;
                    if (measured && measured.from <= offset + this.length && measured.more) {
                        let nodes = [], pos = Math.max(offset, measured.from), singleHeight = -1, wasChanged = oracle.heightChanged;
                        for(measured.from > offset && nodes.push(new HeightMapGap(measured.from - offset - 1).updateHeight(oracle, offset)); pos <= end && measured.more;){
                            let len = oracle.doc.lineAt(pos).length;
                            nodes.length && nodes.push(null);
                            let height = measured.heights[measured.index++];
                            -1 == singleHeight ? singleHeight = height : Math.abs(height - singleHeight) >= Epsilon && (singleHeight = -2);
                            let line = new HeightMapText(len, height);
                            line.outdated = !1, nodes.push(line), pos += len + 1;
                        }
                        pos <= end && nodes.push(null, new HeightMapGap(end - pos).updateHeight(oracle, pos));
                        let result = HeightMap.of(nodes);
                        return oracle.heightChanged = wasChanged || singleHeight < 0 || Math.abs(result.height - this.height) >= Epsilon || Math.abs(singleHeight - this.lines(oracle.doc, offset).lineHeight) >= Epsilon, result;
                    }
                    return (force || this.outdated) && (this.setHeight(oracle, oracle.heightForGap(offset, offset + this.length)), this.outdated = !1), this;
                }
                toString() {
                    return `gap(${this.length})`;
                }
            }
            class HeightMapBranch extends HeightMap {
                constructor(left, brk, right){
                    super(left.length + brk + right.length, left.height + right.height, brk | (left.outdated || right.outdated ? 2 : 0)), this.left = left, this.right = right, this.size = left.size + right.size;
                }
                get break() {
                    return 1 & this.flags;
                }
                blockAt(height, doc, top, offset) {
                    let mid = top + this.left.height;
                    return height < mid ? this.left.blockAt(height, doc, top, offset) : this.right.blockAt(height, doc, mid, offset + this.left.length + this.break);
                }
                lineAt(value, type, doc, top, offset) {
                    let rightTop = top + this.left.height, rightOffset = offset + this.left.length + this.break, left = type == QueryType1.ByHeight ? value < rightTop : value < rightOffset, base = left ? this.left.lineAt(value, type, doc, top, offset) : this.right.lineAt(value, type, doc, rightTop, rightOffset);
                    if (this.break || (left ? base.to < rightOffset : base.from > rightOffset)) return base;
                    let subQuery = type == QueryType1.ByPosNoHeight ? QueryType1.ByPosNoHeight : QueryType1.ByPos;
                    return left ? base.join(this.right.lineAt(rightOffset, subQuery, doc, rightTop, rightOffset)) : this.left.lineAt(rightOffset, subQuery, doc, top, offset).join(base);
                }
                forEachLine(from, to, doc, top, offset, f) {
                    let rightTop = top + this.left.height, rightOffset = offset + this.left.length + this.break;
                    if (this.break) from < rightOffset && this.left.forEachLine(from, to, doc, top, offset, f), to >= rightOffset && this.right.forEachLine(from, to, doc, rightTop, rightOffset, f);
                    else {
                        let mid = this.lineAt(rightOffset, QueryType1.ByPos, doc, top, offset);
                        from < mid.from && this.left.forEachLine(from, mid.from - 1, doc, top, offset, f), mid.to >= from && mid.from <= to && f(mid), to > mid.to && this.right.forEachLine(mid.to + 1, to, doc, rightTop, rightOffset, f);
                    }
                }
                replace(from, to, nodes) {
                    let rightStart = this.left.length + this.break;
                    if (to < rightStart) return this.balanced(this.left.replace(from, to, nodes), this.right);
                    if (from > this.left.length) return this.balanced(this.left, this.right.replace(from - rightStart, to - rightStart, nodes));
                    let result = [];
                    from > 0 && this.decomposeLeft(from, result);
                    let left = result.length;
                    for (let node of nodes)result.push(node);
                    if (from > 0 && mergeGaps(result, left - 1), to < this.length) {
                        let right = result.length;
                        this.decomposeRight(to, result), mergeGaps(result, right);
                    }
                    return HeightMap.of(result);
                }
                decomposeLeft(to, result) {
                    let left = this.left.length;
                    if (to <= left) return this.left.decomposeLeft(to, result);
                    result.push(this.left), this.break && to >= ++left && result.push(null), to > left && this.right.decomposeLeft(to - left, result);
                }
                decomposeRight(from, result) {
                    let left = this.left.length, right = left + this.break;
                    if (from >= right) return this.right.decomposeRight(from - right, result);
                    from < left && this.left.decomposeRight(from, result), this.break && from < right && result.push(null), result.push(this.right);
                }
                balanced(left, right) {
                    return left.size > 2 * right.size || right.size > 2 * left.size ? HeightMap.of(this.break ? [
                        left,
                        null,
                        right
                    ] : [
                        left,
                        right
                    ]) : (this.left = left, this.right = right, this.height = left.height + right.height, this.outdated = left.outdated || right.outdated, this.size = left.size + right.size, this.length = left.length + this.break + right.length, this);
                }
                updateHeight(oracle, offset = 0, force = !1, measured) {
                    let { left , right  } = this, rightStart = offset + left.length + this.break, rebalance = null;
                    return (measured && measured.from <= offset + left.length && measured.more ? rebalance = left = left.updateHeight(oracle, offset, force, measured) : left.updateHeight(oracle, offset, force), measured && measured.from <= rightStart + right.length && measured.more ? rebalance = right = right.updateHeight(oracle, rightStart, force, measured) : right.updateHeight(oracle, rightStart, force), rebalance) ? this.balanced(left, right) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
                }
                toString() {
                    return this.left + (this.break ? " " : "-") + this.right;
                }
            }
            function mergeGaps(nodes, around) {
                let before, after;
                null == nodes[around] && (before = nodes[around - 1]) instanceof HeightMapGap && (after = nodes[around + 1]) instanceof HeightMapGap && nodes.splice(around - 1, 3, new HeightMapGap(before.length + 1 + after.length));
            }
            const relevantWidgetHeight = 5;
            class NodeBuilder {
                constructor(pos, oracle){
                    this.pos = pos, this.oracle = oracle, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = pos;
                }
                get isCovered() {
                    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
                }
                span(_from, to) {
                    if (this.lineStart > -1) {
                        let end = Math.min(to, this.lineEnd), last = this.nodes[this.nodes.length - 1];
                        last instanceof HeightMapText ? last.length += end - this.pos : (end > this.pos || !this.isCovered) && this.nodes.push(new HeightMapText(end - this.pos, -1)), this.writtenTo = end, to > end && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
                    }
                    this.pos = to;
                }
                point(from, to, deco) {
                    if (from < to || deco.heightRelevant) {
                        let height = deco.widget ? deco.widget.estimatedHeight : 0;
                        height < 0 && (height = this.oracle.lineHeight);
                        let len = to - from;
                        deco.block ? this.addBlock(new HeightMapBlock(len, height, deco.type)) : (len || height >= relevantWidgetHeight) && this.addLineDeco(height, len);
                    } else to > from && this.span(from, to);
                    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
                }
                enterLine() {
                    if (this.lineStart > -1) return;
                    let { from , to  } = this.oracle.doc.lineAt(this.pos);
                    this.lineStart = from, this.lineEnd = to, this.writtenTo < from && ((this.writtenTo < from - 1 || null == this.nodes[this.nodes.length - 1]) && this.nodes.push(this.blankContent(this.writtenTo, from - 1)), this.nodes.push(null)), this.pos > from && this.nodes.push(new HeightMapText(this.pos - from, -1)), this.writtenTo = this.pos;
                }
                blankContent(from, to) {
                    let gap = new HeightMapGap(to - from);
                    return this.oracle.doc.lineAt(from).to == to && (gap.flags |= 4), gap;
                }
                ensureLine() {
                    this.enterLine();
                    let last = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
                    if (last instanceof HeightMapText) return last;
                    let line = new HeightMapText(0, -1);
                    return this.nodes.push(line), line;
                }
                addBlock(block) {
                    this.enterLine(), block.type != BlockType1.WidgetAfter || this.isCovered || this.ensureLine(), this.nodes.push(block), this.writtenTo = this.pos = this.pos + block.length, block.type != BlockType1.WidgetBefore && (this.covering = block);
                }
                addLineDeco(height, length) {
                    let line = this.ensureLine();
                    line.length += length, line.collapsed += length, line.widgetHeight = Math.max(line.widgetHeight, height), this.writtenTo = this.pos = this.pos + length;
                }
                finish(from) {
                    let last = 0 == this.nodes.length ? null : this.nodes[this.nodes.length - 1];
                    !(this.lineStart > -1) || last instanceof HeightMapText || this.isCovered ? (this.writtenTo < this.pos || null == last) && this.nodes.push(this.blankContent(this.writtenTo, this.pos)) : this.nodes.push(new HeightMapText(0, -1));
                    let pos = from;
                    for (let node of this.nodes)node instanceof HeightMapText && node.updateHeight(this.oracle, pos), pos += node ? node.length : 1;
                    return this.nodes;
                }
                static build(oracle, decorations, from, to) {
                    let builder = new NodeBuilder(from, oracle);
                    return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.spans(decorations, from, to, builder, 0), builder.finish(from);
                }
            }
            function heightRelevantDecoChanges(a, b, diff) {
                let comp = new DecorationComparator();
                return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.compare(a, b, diff, comp, 0), comp.changes;
            }
            class DecorationComparator {
                constructor(){
                    this.changes = [];
                }
                compareRange() {}
                comparePoint(from, to, a, b) {
                    (from < to || a && a.heightRelevant || b && b.heightRelevant) && addRange(from, to, this.changes, 5);
                }
            }
            function visiblePixelRange(dom, paddingTop) {
                let rect = dom.getBoundingClientRect(), left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right), top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom), body = dom.ownerDocument.body;
                for(let parent = dom.parentNode; parent && parent != body;)if (1 == parent.nodeType) {
                    let elt = parent, style = window.getComputedStyle(elt);
                    if ((elt.scrollHeight > elt.clientHeight || elt.scrollWidth > elt.clientWidth) && "visible" != style.overflow) {
                        let parentRect = elt.getBoundingClientRect();
                        left = Math.max(left, parentRect.left), right = Math.min(right, parentRect.right), top = Math.max(top, parentRect.top), bottom = Math.min(bottom, parentRect.bottom);
                    }
                    parent = "absolute" == style.position || "fixed" == style.position ? elt.offsetParent : elt.parentNode;
                } else if (11 == parent.nodeType) parent = parent.host;
                else break;
                return {
                    left: left - rect.left,
                    right: Math.max(left, right) - rect.left,
                    top: top - (rect.top + paddingTop),
                    bottom: Math.max(top, bottom) - (rect.top + paddingTop)
                };
            }
            function fullPixelRange(dom, paddingTop) {
                let rect = dom.getBoundingClientRect();
                return {
                    left: 0,
                    right: rect.right - rect.left,
                    top: paddingTop,
                    bottom: rect.bottom - (rect.top + paddingTop)
                };
            }
            class LineGap {
                constructor(from, to, size){
                    this.from = from, this.to = to, this.size = size;
                }
                static same(a, b) {
                    if (a.length != b.length) return !1;
                    for(let i = 0; i < a.length; i++){
                        let gA = a[i], gB = b[i];
                        if (gA.from != gB.from || gA.to != gB.to || gA.size != gB.size) return !1;
                    }
                    return !0;
                }
                draw(wrapping) {
                    return Decoration.replace({
                        widget: new LineGapWidget(this.size, wrapping)
                    }).range(this.from, this.to);
                }
            }
            class LineGapWidget extends WidgetType {
                constructor(size, vertical){
                    super(), this.size = size, this.vertical = vertical;
                }
                eq(other) {
                    return other.size == this.size && other.vertical == this.vertical;
                }
                toDOM() {
                    let elt = document.createElement("div");
                    return this.vertical ? elt.style.height = this.size + "px" : (elt.style.width = this.size + "px", elt.style.height = "2px", elt.style.display = "inline-block"), elt;
                }
                get estimatedHeight() {
                    return this.vertical ? this.size : -1;
                }
            }
            class ViewState {
                constructor(state){
                    this.state = state, this.pixelViewport = {
                        left: 0,
                        right: window.innerWidth,
                        top: 0,
                        bottom: 0
                    }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.heightOracle = new HeightOracle(), this.scaler = IdScaler, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = Direction1.RTL, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1, this.stateDeco = state.facet(decorations1).filter((d)=>"function" != typeof d
                    ), this.heightMap = HeightMap.empty().applyChanges(this.stateDeco, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.xv.empty, this.heightOracle.setDoc(state.doc), [
                        new ChangedRange(0, 0, 0, state.doc.length)
                    ]), this.viewport = this.getViewport(0, null), this.updateViewportLines(), this.updateForViewport(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = Decoration.set(this.lineGaps.map((gap)=>gap.draw(!1)
                    )), this.computeVisibleRanges();
                }
                updateForViewport() {
                    let viewports = [
                        this.viewport
                    ], { main  } = this.state.selection;
                    for(let i = 0; i <= 1; i++){
                        let pos = i ? main.head : main.anchor;
                        if (!viewports.some(({ from , to  })=>pos >= from && pos <= to
                        )) {
                            let { from , to  } = this.lineBlockAt(pos);
                            viewports.push(new Viewport(from, to));
                        }
                    }
                    this.viewports = viewports.sort((a, b)=>a.from - b.from
                    ), this.scaler = this.heightMap.height <= 7000000 ? IdScaler : new BigScaler(this.heightOracle.doc, this.heightMap, this.viewports);
                }
                updateViewportLines() {
                    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.state.doc, 0, 0, (block)=>{
                        this.viewportLines.push(1 == this.scaler.scale ? block : scaleBlock(block, this.scaler));
                    });
                }
                update(update, scrollTarget = null) {
                    this.state = update.state;
                    let prevDeco = this.stateDeco;
                    this.stateDeco = this.state.facet(decorations1).filter((d)=>"function" != typeof d
                    );
                    let contentChanges = update.changedRanges, heightChanges = ChangedRange.extendWithRanges(contentChanges, heightRelevantDecoChanges(prevDeco, this.stateDeco, update ? update.changes : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.as.empty(this.state.doc.length))), prevHeight = this.heightMap.height;
                    this.heightMap = this.heightMap.applyChanges(this.stateDeco, update.startState.doc, this.heightOracle.setDoc(this.state.doc), heightChanges), this.heightMap.height != prevHeight && (update.flags |= 2);
                    let viewport = heightChanges.length ? this.mapViewport(this.viewport, update.changes) : this.viewport;
                    (scrollTarget && (scrollTarget.range.head < viewport.from || scrollTarget.range.head > viewport.to) || !this.viewportIsAppropriate(viewport)) && (viewport = this.getViewport(0, scrollTarget));
                    let updateLines = !update.changes.empty || 2 & update.flags || viewport.from != this.viewport.from || viewport.to != this.viewport.to;
                    this.viewport = viewport, this.updateForViewport(), updateLines && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4000) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, update.changes))), update.flags |= this.computeVisibleRanges(), scrollTarget && (this.scrollTarget = scrollTarget), !this.mustEnforceCursorAssoc && update.selectionSet && update.view.lineWrapping && update.state.selection.main.empty && update.state.selection.main.assoc && (this.mustEnforceCursorAssoc = !0);
                }
                measure(view) {
                    let dom = view.contentDOM, style = window.getComputedStyle(dom), oracle = this.heightOracle, whiteSpace = style.whiteSpace;
                    this.defaultTextDirection = "rtl" == style.direction ? Direction1.RTL : Direction1.LTR;
                    let refresh = this.heightOracle.mustRefreshForWrapping(whiteSpace), measureContent = refresh || this.mustMeasureContent || this.contentDOMHeight != dom.clientHeight, result = 0, bias = 0;
                    if (this.editorWidth != view.scrollDOM.clientWidth && (oracle.lineWrapping && (measureContent = !0), this.editorWidth = view.scrollDOM.clientWidth, result |= 8), measureContent) {
                        this.mustMeasureContent = !1, this.contentDOMHeight = dom.clientHeight;
                        let paddingTop = parseInt(style.paddingTop) || 0, paddingBottom = parseInt(style.paddingBottom) || 0;
                        (this.paddingTop != paddingTop || this.paddingBottom != paddingBottom) && (result |= 8, this.paddingTop = paddingTop, this.paddingBottom = paddingBottom);
                    }
                    let pixelViewport = (this.printing ? fullPixelRange : visiblePixelRange)(dom, this.paddingTop), dTop = pixelViewport.top - this.pixelViewport.top, dBottom = pixelViewport.bottom - this.pixelViewport.bottom;
                    this.pixelViewport = pixelViewport;
                    let inView = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
                    if (inView != this.inView && (this.inView = inView, inView && (measureContent = !0)), !this.inView) return 0;
                    let contentWidth = dom.clientWidth;
                    if ((this.contentDOMWidth != contentWidth || this.editorHeight != view.scrollDOM.clientHeight) && (this.contentDOMWidth = contentWidth, this.editorHeight = view.scrollDOM.clientHeight, result |= 8), measureContent) {
                        let lineHeights = view.docView.measureVisibleLineHeights(this.viewport);
                        if (oracle.mustRefreshForHeights(lineHeights) && (refresh = !0), refresh || oracle.lineWrapping && Math.abs(contentWidth - this.contentDOMWidth) > oracle.charWidth) {
                            let { lineHeight , charWidth  } = view.docView.measureTextSize();
                            (refresh = oracle.refresh(whiteSpace, lineHeight, charWidth, contentWidth / charWidth, lineHeights)) && (view.docView.minWidth = 0, result |= 8);
                        }
                        for (let vp of (dTop > 0 && dBottom > 0 ? bias = Math.max(dTop, dBottom) : dTop < 0 && dBottom < 0 && (bias = Math.min(dTop, dBottom)), oracle.heightChanged = !1, this.viewports)){
                            let heights = vp.from == this.viewport.from ? lineHeights : view.docView.measureVisibleLineHeights(vp);
                            this.heightMap = this.heightMap.updateHeight(oracle, 0, refresh, new MeasuredHeights(vp.from, heights));
                        }
                        oracle.heightChanged && (result |= 2);
                    }
                    let viewportChange = !this.viewportIsAppropriate(this.viewport, bias) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
                    return viewportChange && (this.viewport = this.getViewport(bias, this.scrollTarget)), this.updateForViewport(), (2 & result || viewportChange) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4000) && this.updateLineGaps(this.ensureLineGaps(refresh ? [] : this.lineGaps)), result |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, view.docView.enforceCursorAssoc()), result;
                }
                get visibleTop() {
                    return this.scaler.fromDOM(this.pixelViewport.top);
                }
                get visibleBottom() {
                    return this.scaler.fromDOM(this.pixelViewport.bottom);
                }
                getViewport(bias, scrollTarget) {
                    let marginTop = 0.5 - Math.max(-0.5, Math.min(0.5, bias / 1000 / 2)), map = this.heightMap, doc = this.state.doc, { visibleTop , visibleBottom  } = this, viewport = new Viewport(map.lineAt(visibleTop - 1000 * marginTop, QueryType1.ByHeight, doc, 0, 0).from, map.lineAt(visibleBottom + (1 - marginTop) * 1000, QueryType1.ByHeight, doc, 0, 0).to);
                    if (scrollTarget) {
                        let { head  } = scrollTarget.range;
                        if (head < viewport.from || head > viewport.to) {
                            let viewHeight = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), block = map.lineAt(head, QueryType1.ByPos, doc, 0, 0), topPos;
                            topPos = "center" == scrollTarget.y ? (block.top + block.bottom) / 2 - viewHeight / 2 : "start" == scrollTarget.y || "nearest" == scrollTarget.y && head < viewport.from ? block.top : block.bottom - viewHeight, viewport = new Viewport(map.lineAt(topPos - 500, QueryType1.ByHeight, doc, 0, 0).from, map.lineAt(topPos + viewHeight + 500, QueryType1.ByHeight, doc, 0, 0).to);
                        }
                    }
                    return viewport;
                }
                mapViewport(viewport, changes) {
                    let from = changes.mapPos(viewport.from, -1), to = changes.mapPos(viewport.to, 1);
                    return new Viewport(this.heightMap.lineAt(from, QueryType1.ByPos, this.state.doc, 0, 0).from, this.heightMap.lineAt(to, QueryType1.ByPos, this.state.doc, 0, 0).to);
                }
                viewportIsAppropriate({ from , to  }, bias = 0) {
                    if (!this.inView) return !0;
                    let { top  } = this.heightMap.lineAt(from, QueryType1.ByPos, this.state.doc, 0, 0), { bottom  } = this.heightMap.lineAt(to, QueryType1.ByPos, this.state.doc, 0, 0), { visibleTop , visibleBottom  } = this;
                    return (0 == from || top <= visibleTop - Math.max(10, Math.min(-bias, 250))) && (to == this.state.doc.length || bottom >= visibleBottom + Math.max(10, Math.min(bias, 250))) && top > visibleTop - 2000 && bottom < visibleBottom + 2000;
                }
                mapLineGaps(gaps, changes) {
                    if (!gaps.length || changes.empty) return gaps;
                    let mapped = [];
                    for (let gap of gaps)changes.touchesRange(gap.from, gap.to) || mapped.push(new LineGap(changes.mapPos(gap.from), changes.mapPos(gap.to), gap.size));
                    return mapped;
                }
                ensureLineGaps(current) {
                    let gaps = [];
                    if (this.defaultTextDirection != Direction1.LTR) return gaps;
                    for (let line of this.viewportLines){
                        if (line.length < 4000) continue;
                        let structure = lineStructure(line.from, line.to, this.stateDeco);
                        if (structure.total < 4000) continue;
                        let viewFrom, viewTo;
                        if (this.heightOracle.lineWrapping) {
                            let marginHeight = 2000 / this.heightOracle.lineLength * this.heightOracle.lineHeight;
                            viewFrom = findPosition(structure, (this.visibleTop - line.top - marginHeight) / line.height), viewTo = findPosition(structure, (this.visibleBottom - line.top + marginHeight) / line.height);
                        } else {
                            let totalWidth = structure.total * this.heightOracle.charWidth, marginWidth = 2000 * this.heightOracle.charWidth;
                            viewFrom = findPosition(structure, (this.pixelViewport.left - marginWidth) / totalWidth), viewTo = findPosition(structure, (this.pixelViewport.right + marginWidth) / totalWidth);
                        }
                        let outside = [];
                        viewFrom > line.from && outside.push({
                            from: line.from,
                            to: viewFrom
                        }), viewTo < line.to && outside.push({
                            from: viewTo,
                            to: line.to
                        });
                        let sel = this.state.selection.main;
                        for (let { from , to  } of (sel.from >= line.from && sel.from <= line.to && cutRange(outside, sel.from - 10, sel.from + 10), !sel.empty && sel.to >= line.from && sel.to <= line.to && cutRange(outside, sel.to - 10, sel.to + 10), outside))to - from > 1000 && gaps.push(find(current, (gap)=>gap.from >= line.from && gap.to <= line.to && 1000 > Math.abs(gap.from - from) && 1000 > Math.abs(gap.to - to)
                        ) || new LineGap(from, to, this.gapSize(line, from, to, structure)));
                    }
                    return gaps;
                }
                gapSize(line, from, to, structure) {
                    let fraction = findFraction(structure, to) - findFraction(structure, from);
                    return this.heightOracle.lineWrapping ? line.height * fraction : structure.total * this.heightOracle.charWidth * fraction;
                }
                updateLineGaps(gaps) {
                    LineGap.same(gaps, this.lineGaps) || (this.lineGaps = gaps, this.lineGapDeco = Decoration.set(gaps.map((gap)=>gap.draw(this.heightOracle.lineWrapping)
                    )));
                }
                computeVisibleRanges() {
                    let deco = this.stateDeco;
                    this.lineGaps.length && (deco = deco.concat(this.lineGapDeco));
                    let ranges = [];
                    _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.spans(deco, this.viewport.from, this.viewport.to, {
                        span (from, to) {
                            ranges.push({
                                from,
                                to
                            });
                        },
                        point () {}
                    }, 20);
                    let changed = ranges.length != this.visibleRanges.length || this.visibleRanges.some((r, i)=>r.from != ranges[i].from || r.to != ranges[i].to
                    );
                    return this.visibleRanges = ranges, changed ? 4 : 0;
                }
                lineBlockAt(pos) {
                    return pos >= this.viewport.from && pos <= this.viewport.to && this.viewportLines.find((b)=>b.from <= pos && b.to >= pos
                    ) || scaleBlock(this.heightMap.lineAt(pos, QueryType1.ByPos, this.state.doc, 0, 0), this.scaler);
                }
                lineBlockAtHeight(height) {
                    return scaleBlock(this.heightMap.lineAt(this.scaler.fromDOM(height), QueryType1.ByHeight, this.state.doc, 0, 0), this.scaler);
                }
                elementAtHeight(height) {
                    return scaleBlock(this.heightMap.blockAt(this.scaler.fromDOM(height), this.state.doc, 0, 0), this.scaler);
                }
                get docHeight() {
                    return this.scaler.toDOM(this.heightMap.height);
                }
                get contentHeight() {
                    return this.docHeight + this.paddingTop + this.paddingBottom;
                }
            }
            class Viewport {
                constructor(from, to){
                    this.from = from, this.to = to;
                }
            }
            function lineStructure(from1, to1, stateDeco) {
                let ranges = [], pos = from1, total = 0;
                return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.spans(stateDeco, from1, to1, {
                    span () {},
                    point (from, to) {
                        from > pos && (ranges.push({
                            from: pos,
                            to: from
                        }), total += from - pos), pos = to;
                    }
                }, 20), pos < to1 && (ranges.push({
                    from: pos,
                    to: to1
                }), total += to1 - pos), {
                    total,
                    ranges
                };
            }
            function findPosition({ total , ranges  }, ratio) {
                if (ratio <= 0) return ranges[0].from;
                if (ratio >= 1) return ranges[ranges.length - 1].to;
                let dist = Math.floor(total * ratio);
                for(let i = 0;; i++){
                    let { from , to  } = ranges[i], size = to - from;
                    if (dist <= size) return from + dist;
                    dist -= size;
                }
            }
            function findFraction(structure, pos) {
                let counted = 0;
                for (let { from , to  } of structure.ranges){
                    if (pos <= to) {
                        counted += pos - from;
                        break;
                    }
                    counted += to - from;
                }
                return counted / structure.total;
            }
            function cutRange(ranges, from, to) {
                for(let i = 0; i < ranges.length; i++){
                    let r = ranges[i];
                    if (r.from < to && r.to > from) {
                        let pieces = [];
                        r.from < from && pieces.push({
                            from: r.from,
                            to: from
                        }), r.to > to && pieces.push({
                            from: to,
                            to: r.to
                        }), ranges.splice(i, 1, ...pieces), i += pieces.length - 1;
                    }
                }
            }
            function find(array, f) {
                for (let val of array)if (f(val)) return val;
            }
            const IdScaler = {
                toDOM: (n)=>n
                ,
                fromDOM: (n)=>n
                ,
                scale: 1
            };
            class BigScaler {
                constructor(doc, heightMap, viewports){
                    let vpHeight = 0, base = 0, domBase = 0;
                    for (let obj of (this.viewports = viewports.map(({ from , to  })=>{
                        let top = heightMap.lineAt(from, QueryType1.ByPos, doc, 0, 0).top, bottom = heightMap.lineAt(to, QueryType1.ByPos, doc, 0, 0).bottom;
                        return vpHeight += bottom - top, {
                            from,
                            to,
                            top,
                            bottom,
                            domTop: 0,
                            domBottom: 0
                        };
                    }), this.scale = (7000000 - vpHeight) / (heightMap.height - vpHeight), this.viewports))obj.domTop = domBase + (obj.top - base) * this.scale, domBase = obj.domBottom = obj.domTop + (obj.bottom - obj.top), base = obj.bottom;
                }
                toDOM(n) {
                    for(let i = 0, base = 0, domBase = 0;; i++){
                        let vp = i < this.viewports.length ? this.viewports[i] : null;
                        if (!vp || n < vp.top) return domBase + (n - base) * this.scale;
                        if (n <= vp.bottom) return vp.domTop + (n - vp.top);
                        base = vp.bottom, domBase = vp.domBottom;
                    }
                }
                fromDOM(n) {
                    for(let i = 0, base = 0, domBase = 0;; i++){
                        let vp = i < this.viewports.length ? this.viewports[i] : null;
                        if (!vp || n < vp.domTop) return base + (n - domBase) / this.scale;
                        if (n <= vp.domBottom) return vp.top + (n - vp.domTop);
                        base = vp.bottom, domBase = vp.domBottom;
                    }
                }
            }
            function scaleBlock(block, scaler) {
                if (1 == scaler.scale) return block;
                let bTop = scaler.toDOM(block.top), bBottom = scaler.toDOM(block.bottom);
                return new BlockInfo(block.from, block.length, bTop, bBottom - bTop, Array.isArray(block.type) ? block.type.map((b)=>scaleBlock(b, scaler)
                ) : block.type);
            }
            const theme = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine: (strs)=>strs.join(" ")
            }), darkTheme = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine: (values)=>values.indexOf(!0) > -1
            }), baseThemeID = style_mod__WEBPACK_IMPORTED_MODULE_0__.V.newName(), baseLightID = style_mod__WEBPACK_IMPORTED_MODULE_0__.V.newName(), baseDarkID = style_mod__WEBPACK_IMPORTED_MODULE_0__.V.newName(), lightDarkIDs = {
                "&light": "." + baseLightID,
                "&dark": "." + baseDarkID
            };
            function buildTheme(main, spec, scopes) {
                return new style_mod__WEBPACK_IMPORTED_MODULE_0__.V(spec, {
                    finish: (sel)=>/&/.test(sel) ? sel.replace(/&\w*/, (m)=>{
                            if ("&" == m) return main;
                            if (!scopes || !scopes[m]) throw new RangeError(`Unsupported selector: ${m}`);
                            return scopes[m];
                        }) : main + " " + sel
                });
            }
            const baseTheme$1 = buildTheme("." + baseThemeID, {
                "&.cm-editor": {
                    position: "relative !important",
                    boxSizing: "border-box",
                    "&.cm-focused": {
                        outline: "1px dotted #212121"
                    },
                    display: "flex !important",
                    flexDirection: "column"
                },
                ".cm-scroller": {
                    display: "flex !important",
                    alignItems: "flex-start !important",
                    fontFamily: "monospace",
                    lineHeight: 1.4,
                    height: "100%",
                    overflowX: "auto",
                    position: "relative",
                    zIndex: 0
                },
                ".cm-content": {
                    margin: 0,
                    flexGrow: 2,
                    minHeight: "100%",
                    display: "block",
                    whiteSpace: "pre",
                    wordWrap: "normal",
                    boxSizing: "border-box",
                    padding: "4px 0",
                    outline: "none",
                    "&[contenteditable=true]": {
                        WebkitUserModify: "read-write-plaintext-only"
                    }
                },
                ".cm-lineWrapping": {
                    whiteSpace_fallback: "pre-wrap",
                    whiteSpace: "break-spaces",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere"
                },
                "&light .cm-content": {
                    caretColor: "black"
                },
                "&dark .cm-content": {
                    caretColor: "white"
                },
                ".cm-line": {
                    display: "block",
                    padding: "0 2px 0 4px"
                },
                ".cm-selectionLayer": {
                    zIndex: -1,
                    contain: "size style"
                },
                ".cm-selectionBackground": {
                    position: "absolute"
                },
                "&light .cm-selectionBackground": {
                    background: "#d9d9d9"
                },
                "&dark .cm-selectionBackground": {
                    background: "#222"
                },
                "&light.cm-focused .cm-selectionBackground": {
                    background: "#d7d4f0"
                },
                "&dark.cm-focused .cm-selectionBackground": {
                    background: "#233"
                },
                ".cm-cursorLayer": {
                    zIndex: 100,
                    contain: "size style",
                    pointerEvents: "none"
                },
                "&.cm-focused .cm-cursorLayer": {
                    animation: "steps(1) cm-blink 1.2s infinite"
                },
                "@keyframes cm-blink": {
                    "0%": {},
                    "50%": {
                        visibility: "hidden"
                    },
                    "100%": {}
                },
                "@keyframes cm-blink2": {
                    "0%": {},
                    "50%": {
                        visibility: "hidden"
                    },
                    "100%": {}
                },
                ".cm-cursor, .cm-dropCursor": {
                    position: "absolute",
                    borderLeft: "1.2px solid black",
                    marginLeft: "-0.6px",
                    pointerEvents: "none"
                },
                ".cm-cursor": {
                    display: "none"
                },
                "&dark .cm-cursor": {
                    borderLeftColor: "#444"
                },
                "&.cm-focused .cm-cursor": {
                    display: "block"
                },
                "&light .cm-activeLine": {
                    backgroundColor: "#f3f9ff"
                },
                "&dark .cm-activeLine": {
                    backgroundColor: "#223039"
                },
                "&light .cm-specialChar": {
                    color: "red"
                },
                "&dark .cm-specialChar": {
                    color: "#f78"
                },
                ".cm-gutters": {
                    display: "flex",
                    height: "100%",
                    boxSizing: "border-box",
                    left: 0,
                    zIndex: 200
                },
                "&light .cm-gutters": {
                    backgroundColor: "#f5f5f5",
                    color: "#6c6c6c",
                    borderRight: "1px solid #ddd"
                },
                "&dark .cm-gutters": {
                    backgroundColor: "#333338",
                    color: "#ccc"
                },
                ".cm-gutter": {
                    display: "flex !important",
                    flexDirection: "column",
                    flexShrink: 0,
                    boxSizing: "border-box",
                    minHeight: "100%",
                    overflow: "hidden"
                },
                ".cm-gutterElement": {
                    boxSizing: "border-box"
                },
                ".cm-lineNumbers .cm-gutterElement": {
                    padding: "0 3px 0 5px",
                    minWidth: "20px",
                    textAlign: "right",
                    whiteSpace: "nowrap"
                },
                "&light .cm-activeLineGutter": {
                    backgroundColor: "#e2f2ff"
                },
                "&dark .cm-activeLineGutter": {
                    backgroundColor: "#222227"
                },
                ".cm-panels": {
                    boxSizing: "border-box",
                    position: "sticky",
                    left: 0,
                    right: 0
                },
                "&light .cm-panels": {
                    backgroundColor: "#f5f5f5",
                    color: "black"
                },
                "&light .cm-panels-top": {
                    borderBottom: "1px solid #ddd"
                },
                "&light .cm-panels-bottom": {
                    borderTop: "1px solid #ddd"
                },
                "&dark .cm-panels": {
                    backgroundColor: "#333338",
                    color: "white"
                },
                ".cm-tab": {
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "bottom"
                },
                ".cm-widgetBuffer": {
                    verticalAlign: "text-top",
                    height: "1em",
                    display: "inline"
                },
                ".cm-placeholder": {
                    color: "#888",
                    display: "inline-block",
                    verticalAlign: "top"
                },
                ".cm-button": {
                    verticalAlign: "middle",
                    color: "inherit",
                    fontSize: "70%",
                    padding: ".2em 1em",
                    borderRadius: "1px"
                },
                "&light .cm-button": {
                    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
                    border: "1px solid #888",
                    "&:active": {
                        backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
                    }
                },
                "&dark .cm-button": {
                    backgroundImage: "linear-gradient(#393939, #111)",
                    border: "1px solid #888",
                    "&:active": {
                        backgroundImage: "linear-gradient(#111, #333)"
                    }
                },
                ".cm-textfield": {
                    verticalAlign: "middle",
                    color: "inherit",
                    fontSize: "70%",
                    border: "1px solid silver",
                    padding: ".2em .5em"
                },
                "&light .cm-textfield": {
                    backgroundColor: "white"
                },
                "&dark .cm-textfield": {
                    border: "1px solid #555",
                    backgroundColor: "inherit"
                }
            }, lightDarkIDs), observeOptions = {
                childList: !0,
                characterData: !0,
                subtree: !0,
                attributes: !0,
                characterDataOldValue: !0
            }, useCharData = browser.ie && browser.ie_version <= 11;
            class DOMObserver {
                constructor(view, onChange, onScrollChanged){
                    this.view = view, this.onChange = onChange, this.onScrollChanged = onScrollChanged, this.active = !1, this.selectionRange = new DOMSelectionState(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.scrollTargets = [], this.intersection = null, this.resize = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.parentCheck = -1, this.dom = view.contentDOM, this.observer = new MutationObserver((mutations)=>{
                        for (let mut of mutations)this.queue.push(mut);
                        (browser.ie && browser.ie_version <= 11 || browser.ios && view.composing) && mutations.some((m)=>"childList" == m.type && m.removedNodes.length || "characterData" == m.type && m.oldValue.length > m.target.nodeValue.length
                        ) ? this.flushSoon() : this.flush();
                    }), useCharData && (this.onCharData = (event)=>{
                        this.queue.push({
                            target: event.target,
                            type: "characterData",
                            oldValue: event.prevValue
                        }), this.flushSoon();
                    }), this.onSelectionChange = this.onSelectionChange.bind(this), window.addEventListener("resize", this.onResize = this.onResize.bind(this)), "function" == typeof ResizeObserver && (this.resize = new ResizeObserver(()=>{
                        this.view.docView.lastUpdate < Date.now() - 75 && this.onResize();
                    }), this.resize.observe(view.scrollDOM)), window.addEventListener("beforeprint", this.onPrint = this.onPrint.bind(this)), this.start(), window.addEventListener("scroll", this.onScroll = this.onScroll.bind(this)), "function" == typeof IntersectionObserver && (this.intersection = new IntersectionObserver((entries)=>{
                        this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1000)), entries.length > 0 && entries[entries.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
                    }, {}), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((entries)=>{
                        entries.length > 0 && entries[entries.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
                    }, {})), this.listenForScroll(), this.readSelectionRange(), this.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
                }
                onScroll(e) {
                    this.intersecting && this.flush(!1), this.onScrollChanged(e);
                }
                onResize() {
                    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(()=>{
                        this.resizeTimeout = -1, this.view.requestMeasure();
                    }, 50));
                }
                onPrint() {
                    this.view.viewState.printing = !0, this.view.measure(), setTimeout(()=>{
                        this.view.viewState.printing = !1, this.view.requestMeasure();
                    }, 500);
                }
                updateGaps(gaps) {
                    if (this.gapIntersection && (gaps.length != this.gaps.length || this.gaps.some((g, i)=>g != gaps[i]
                    ))) {
                        for (let gap of (this.gapIntersection.disconnect(), gaps))this.gapIntersection.observe(gap);
                        this.gaps = gaps;
                    }
                }
                onSelectionChange(event) {
                    if (!this.readSelectionRange() || this.delayedAndroidKey) return;
                    let { view  } = this, sel = this.selectionRange;
                    if (view.state.facet(editable) ? view.root.activeElement != this.dom : !hasSelection(view.dom, sel)) return;
                    let context = sel.anchorNode && view.docView.nearest(sel.anchorNode);
                    context && context.ignoreEvent(event) || ((browser.ie && browser.ie_version <= 11 || browser.android && browser.chrome) && !view.state.selection.main.empty && sel.focusNode && isEquivalentPosition(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset) ? this.flushSoon() : this.flush(!1));
                }
                readSelectionRange() {
                    let { root  } = this.view, domSel = getSelection(root), range = browser.safari && 11 == root.nodeType && deepActiveElement() == this.view.contentDOM && safariSelectionRangeHack(this.view) || domSel;
                    return !this.selectionRange.eq(range) && (this.selectionRange.setRange(range), this.selectionChanged = !0);
                }
                setSelectionRange(anchor, head) {
                    this.selectionRange.set(anchor.node, anchor.offset, head.node, head.offset), this.selectionChanged = !1;
                }
                clearSelectionRange() {
                    this.selectionRange.set(null, 0, null, 0);
                }
                listenForScroll() {
                    this.parentCheck = -1;
                    let i = 0, changed = null;
                    for(let dom = this.dom; dom;)if (1 == dom.nodeType) !changed && i < this.scrollTargets.length && this.scrollTargets[i] == dom ? i++ : changed || (changed = this.scrollTargets.slice(0, i)), changed && changed.push(dom), dom = dom.assignedSlot || dom.parentNode;
                    else if (11 == dom.nodeType) dom = dom.host;
                    else break;
                    if (i < this.scrollTargets.length && !changed && (changed = this.scrollTargets.slice(0, i)), changed) {
                        for (let dom of this.scrollTargets)dom.removeEventListener("scroll", this.onScroll);
                        for (let dom1 of this.scrollTargets = changed)dom1.addEventListener("scroll", this.onScroll);
                    }
                }
                ignore(f) {
                    if (!this.active) return f();
                    try {
                        return this.stop(), f();
                    } finally{
                        this.start(), this.clear();
                    }
                }
                start() {
                    this.active || (this.observer.observe(this.dom, observeOptions), useCharData && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
                }
                stop() {
                    this.active && (this.active = !1, this.observer.disconnect(), useCharData && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
                }
                clear() {
                    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
                }
                delayAndroidKey(key1, keyCode) {
                    this.delayedAndroidKey || requestAnimationFrame(()=>{
                        let key = this.delayedAndroidKey;
                        this.delayedAndroidKey = null;
                        let startState = this.view.state;
                        this.readSelectionRange(), dispatchKey(this.view.contentDOM, key.key, key.keyCode) ? this.processRecords() : this.flush(), this.view.state == startState && this.view.update([]);
                    }), this.delayedAndroidKey && "Enter" != key1 || (this.delayedAndroidKey = {
                        key: key1,
                        keyCode
                    });
                }
                flushSoon() {
                    this.delayedFlush < 0 && (this.delayedFlush = window.setTimeout(()=>{
                        this.delayedFlush = -1, this.flush();
                    }, 20));
                }
                forceFlush() {
                    this.delayedFlush >= 0 && (window.clearTimeout(this.delayedFlush), this.delayedFlush = -1, this.flush());
                }
                processRecords() {
                    let records = this.queue;
                    for (let mut of this.observer.takeRecords())records.push(mut);
                    records.length && (this.queue = []);
                    let from = -1, to = -1, typeOver = !1;
                    for (let record of records){
                        let range = this.readMutation(record);
                        range && (range.typeOver && (typeOver = !0), -1 == from ? { from , to  } = range : (from = Math.min(range.from, from), to = Math.max(range.to, to)));
                    }
                    return {
                        from,
                        to,
                        typeOver
                    };
                }
                flush(readSelection = !0) {
                    if (this.delayedFlush >= 0 || this.delayedAndroidKey) return;
                    readSelection && this.readSelectionRange();
                    let { from , to , typeOver  } = this.processRecords(), newSel = this.selectionChanged && hasSelection(this.dom, this.selectionRange);
                    if (from < 0 && !newSel) return;
                    this.selectionChanged = !1;
                    let startState = this.view.state;
                    this.onChange(from, to, typeOver), this.view.state == startState && this.view.update([]);
                }
                readMutation(rec) {
                    let cView = this.view.docView.nearest(rec.target);
                    if (!cView || cView.ignoreMutation(rec)) return null;
                    if (cView.markDirty("attributes" == rec.type), "attributes" == rec.type && (cView.dirty |= 4), "childList" == rec.type) {
                        let childBefore = findChild(cView, rec.previousSibling || rec.target.previousSibling, -1), childAfter = findChild(cView, rec.nextSibling || rec.target.nextSibling, 1);
                        return {
                            from: childBefore ? cView.posAfter(childBefore) : cView.posAtStart,
                            to: childAfter ? cView.posBefore(childAfter) : cView.posAtEnd,
                            typeOver: !1
                        };
                    }
                    return "characterData" == rec.type ? {
                        from: cView.posAtStart,
                        to: cView.posAtEnd,
                        typeOver: rec.target.nodeValue == rec.oldValue
                    } : null;
                }
                destroy() {
                    var _a, _b, _c;
                    for (let dom of (this.stop(), null === (_a = this.intersection) || void 0 === _a || _a.disconnect(), null === (_b = this.gapIntersection) || void 0 === _b || _b.disconnect(), null === (_c = this.resize) || void 0 === _c || _c.disconnect(), this.scrollTargets))dom.removeEventListener("scroll", this.onScroll);
                    window.removeEventListener("scroll", this.onScroll), window.removeEventListener("resize", this.onResize), window.removeEventListener("beforeprint", this.onPrint), this.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout);
                }
            }
            function findChild(cView, dom, dir) {
                for(; dom;){
                    let curView = ContentView.get(dom);
                    if (curView && curView.parent == cView) return curView;
                    let parent = dom.parentNode;
                    dom = parent != cView.dom ? parent : dir > 0 ? dom.nextSibling : dom.previousSibling;
                }
                return null;
            }
            function safariSelectionRangeHack(view) {
                let found = null;
                function read(event) {
                    event.preventDefault(), event.stopImmediatePropagation(), found = event.getTargetRanges()[0];
                }
                if (view.contentDOM.addEventListener("beforeinput", read, !0), document.execCommand("indent"), view.contentDOM.removeEventListener("beforeinput", read, !0), !found) return null;
                let anchorNode = found.startContainer, anchorOffset = found.startOffset, focusNode = found.endContainer, focusOffset = found.endOffset, curAnchor = view.docView.domAtPos(view.state.selection.main.anchor);
                return isEquivalentPosition(curAnchor.node, curAnchor.offset, focusNode, focusOffset) && ([anchorNode, anchorOffset, focusNode, focusOffset] = [
                    focusNode,
                    focusOffset,
                    anchorNode,
                    anchorOffset, 
                ]), {
                    anchorNode,
                    anchorOffset,
                    focusNode,
                    focusOffset
                };
            }
            function applyDOMChange(view, start, end, typeOver) {
                let change, newSel, sel = view.state.selection.main;
                if (start > -1) {
                    let bounds = view.docView.domBoundsAround(start, end, 0);
                    if (!bounds || view.state.readOnly) return;
                    let { from , to  } = bounds, selPoints = view.docView.impreciseHead || view.docView.impreciseAnchor ? [] : selectionPoints(view), reader = new DOMReader(selPoints, view.state);
                    reader.readRange(bounds.startDOM, bounds.endDOM);
                    let preferredPos = sel.from, preferredSide = null;
                    (8 === view.inputState.lastKeyCode && view.inputState.lastKeyTime > Date.now() - 100 || browser.android && reader.text.length < to - from) && (preferredPos = sel.to, preferredSide = "end");
                    let diff = findDiff(view.state.doc.sliceString(from, to, LineBreakPlaceholder), reader.text, preferredPos - from, preferredSide);
                    diff && (browser.chrome && 13 == view.inputState.lastKeyCode && diff.toB == diff.from + 2 && reader.text.slice(diff.from, diff.toB) == LineBreakPlaceholder + LineBreakPlaceholder && diff.toB--, change = {
                        from: from + diff.from,
                        to: from + diff.toA,
                        insert: _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.xv.of(reader.text.slice(diff.from, diff.toB).split(LineBreakPlaceholder))
                    }), newSel = selectionFromPoints(selPoints, from);
                } else if (view.hasFocus || !view.state.facet(editable)) {
                    let domSel = view.observer.selectionRange, { impreciseHead: iHead , impreciseAnchor: iAnchor  } = view.docView, head = iHead && iHead.node == domSel.focusNode && iHead.offset == domSel.focusOffset || !contains(view.contentDOM, domSel.focusNode) ? view.state.selection.main.head : view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset), anchor = iAnchor && iAnchor.node == domSel.anchorNode && iAnchor.offset == domSel.anchorOffset || !contains(view.contentDOM, domSel.anchorNode) ? view.state.selection.main.anchor : view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
                    (head != sel.head || anchor != sel.anchor) && (newSel = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.single(anchor, head));
                }
                if (change || newSel) {
                    if (!change && typeOver && !sel.empty && newSel && newSel.main.empty ? change = {
                        from: sel.from,
                        to: sel.to,
                        insert: view.state.doc.slice(sel.from, sel.to)
                    } : change && change.from >= sel.from && change.to <= sel.to && (change.from != sel.from || change.to != sel.to) && sel.to - sel.from - (change.to - change.from) <= 4 ? change = {
                        from: sel.from,
                        to: sel.to,
                        insert: view.state.doc.slice(sel.from, change.from).append(change.insert).append(view.state.doc.slice(change.to, sel.to))
                    } : browser.mac && change && change.from == change.to && change.from == sel.head - 1 && "." == change.insert.toString() && (change = {
                        from: sel.from,
                        to: sel.to,
                        insert: _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.xv.of([
                            " "
                        ])
                    }), change) {
                        let startState = view.state;
                        if (browser.ios && view.inputState.flushIOSKey(view) || browser.android && (change.from == sel.from && change.to == sel.to && 1 == change.insert.length && 2 == change.insert.lines && dispatchKey(view.contentDOM, "Enter", 13) || change.from == sel.from - 1 && change.to == sel.to && 0 == change.insert.length && dispatchKey(view.contentDOM, "Backspace", 8) || change.from == sel.from && change.to == sel.to + 1 && 0 == change.insert.length && dispatchKey(view.contentDOM, "Delete", 46))) return;
                        let text = change.insert.toString();
                        if (view.state.facet(inputHandler).some((h)=>h(view, change.from, change.to, text)
                        )) return;
                        view.inputState.composing >= 0 && view.inputState.composing++;
                        let tr;
                        if (change.from >= sel.from && change.to <= sel.to && change.to - change.from >= (sel.to - sel.from) / 3 && (!newSel || newSel.main.empty && newSel.main.from == change.from + change.insert.length) && view.inputState.composing < 0) {
                            let before = sel.from < change.from ? startState.sliceDoc(sel.from, change.from) : "", after = sel.to > change.to ? startState.sliceDoc(change.to, sel.to) : "";
                            tr = startState.replaceSelection(view.state.toText(before + change.insert.sliceString(0, void 0, view.state.lineBreak) + after));
                        } else {
                            let changes = startState.changes(change), mainSel = newSel && !startState.selection.main.eq(newSel.main) && newSel.main.to <= changes.newLength ? newSel.main : void 0;
                            if (startState.selection.ranges.length > 1 && view.inputState.composing >= 0 && change.to <= sel.to && change.to >= sel.to - 10) {
                                let replaced = view.state.sliceDoc(change.from, change.to), compositionRange = compositionSurroundingNode(view) || view.state.doc.lineAt(sel.head), offset = sel.to - change.to, size = sel.to - sel.from;
                                tr = startState.changeByRange((range)=>{
                                    if (range.from == sel.from && range.to == sel.to) return {
                                        changes,
                                        range: mainSel || range.map(changes)
                                    };
                                    let to = range.to - offset, from = to - replaced.length;
                                    if (range.to - range.from != size || view.state.sliceDoc(from, to) != replaced || compositionRange && range.to >= compositionRange.from && range.from <= compositionRange.to) return {
                                        range
                                    };
                                    let rangeChanges = startState.changes({
                                        from,
                                        to,
                                        insert: change.insert
                                    }), selOff = range.to - sel.to;
                                    return {
                                        changes: rangeChanges,
                                        range: mainSel ? _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.range(Math.max(0, mainSel.anchor + selOff), Math.max(0, mainSel.head + selOff)) : range.map(rangeChanges)
                                    };
                                });
                            } else tr = {
                                changes,
                                selection: mainSel && startState.selection.replaceRange(mainSel)
                            };
                        }
                        let userEvent = "input.type";
                        view.composing && (userEvent += ".compose", view.inputState.compositionFirstChange && (userEvent += ".start", view.inputState.compositionFirstChange = !1)), view.dispatch(tr, {
                            scrollIntoView: !0,
                            userEvent
                        });
                    } else if (newSel && !newSel.main.eq(sel)) {
                        let scrollIntoView = !1, userEvent = "select";
                        view.inputState.lastSelectionTime > Date.now() - 50 && ("select" == view.inputState.lastSelectionOrigin && (scrollIntoView = !0), userEvent = view.inputState.lastSelectionOrigin), view.dispatch({
                            selection: newSel,
                            scrollIntoView,
                            userEvent
                        });
                    }
                }
            }
            function findDiff(a, b, preferredPos, preferredSide) {
                let minLen = Math.min(a.length, b.length), from = 0;
                for(; from < minLen && a.charCodeAt(from) == b.charCodeAt(from);)from++;
                if (from == minLen && a.length == b.length) return null;
                let toA = a.length, toB = b.length;
                for(; toA > 0 && toB > 0 && a.charCodeAt(toA - 1) == b.charCodeAt(toB - 1);)toA--, toB--;
                if ("end" == preferredSide) {
                    let adjust = Math.max(0, from - Math.min(toA, toB));
                    preferredPos -= toA + adjust - from;
                }
                if (toA < from && a.length < b.length) {
                    let move = preferredPos <= from && preferredPos >= toA ? from - preferredPos : 0;
                    from -= move, toB = from + (toB - toA), toA = from;
                } else if (toB < from) {
                    let move = preferredPos <= from && preferredPos >= toB ? from - preferredPos : 0;
                    from -= move, toA = from + (toA - toB), toB = from;
                }
                return {
                    from,
                    toA,
                    toB
                };
            }
            function selectionPoints(view) {
                let result = [];
                if (view.root.activeElement != view.contentDOM) return result;
                let { anchorNode , anchorOffset , focusNode , focusOffset  } = view.observer.selectionRange;
                return anchorNode && (result.push(new DOMPoint(anchorNode, anchorOffset)), (focusNode != anchorNode || focusOffset != anchorOffset) && result.push(new DOMPoint(focusNode, focusOffset))), result;
            }
            function selectionFromPoints(points, base) {
                if (0 == points.length) return null;
                let anchor = points[0].pos, head = 2 == points.length ? points[1].pos : anchor;
                return anchor > -1 && head > -1 ? _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.single(anchor + base, head + base) : null;
            }
            class EditorView {
                constructor(config = {}){
                    for (let plugin of (this.plugins = [], this.pluginMap = new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.style.cssText = "position: absolute; top: -10000px", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), this._dispatch = config.dispatch || ((tr)=>this.update([
                            tr
                        ])
                    ), this.dispatch = this.dispatch.bind(this), this.root = config.root || getRoot(config.parent) || document, this.viewState = new ViewState(config.state || _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.yy.create()), this.plugins = this.state.facet(viewPlugin).map((spec)=>new PluginInstance(spec)
                    ), this.plugins))plugin.update(this);
                    this.observer = new DOMObserver(this, (from, to, typeOver)=>{
                        applyDOMChange(this, from, to, typeOver);
                    }, (event)=>{
                        this.inputState.runScrollHandlers(this, event), this.observer.intersecting && this.measure();
                    }), this.inputState = new InputState(this), this.inputState.ensureHandlers(this, this.plugins), this.docView = new DocView(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), config.parent && config.parent.appendChild(this.dom);
                }
                get state() {
                    return this.viewState.state;
                }
                get viewport() {
                    return this.viewState.viewport;
                }
                get visibleRanges() {
                    return this.viewState.visibleRanges;
                }
                get inView() {
                    return this.viewState.inView;
                }
                get composing() {
                    return this.inputState.composing > 0;
                }
                get compositionStarted() {
                    return this.inputState.composing >= 0;
                }
                dispatch(...input) {
                    this._dispatch(1 == input.length && input[0] instanceof _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.YW ? input[0] : this.state.update(...input));
                }
                update(transactions) {
                    if (0 != this.updateState) throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
                    let redrawn = !1, update, state = this.state;
                    for (let tr of transactions){
                        if (tr.startState != state) throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
                        state = tr.state;
                    }
                    if (this.destroyed) {
                        this.viewState.state = state;
                        return;
                    }
                    if (state.facet(_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.yy.phrases) != this.state.facet(_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.yy.phrases)) return this.setState(state);
                    update = ViewUpdate.create(this, state, transactions);
                    let scrollTarget = this.viewState.scrollTarget;
                    try {
                        for (let tr1 of (this.updateState = 2, transactions)){
                            if (scrollTarget && (scrollTarget = scrollTarget.map(tr1.changes)), tr1.scrollIntoView) {
                                let { main  } = tr1.state.selection;
                                scrollTarget = new ScrollTarget(main.empty ? main : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(main.head, main.head > main.anchor ? -1 : 1));
                            }
                            for (let e of tr1.effects)e.is(scrollIntoView1) && (scrollTarget = e.value);
                        }
                        this.viewState.update(update, scrollTarget), this.bidiCache = CachedOrder.update(this.bidiCache, update.changes), update.empty || (this.updatePlugins(update), this.inputState.update(update)), redrawn = this.docView.update(update), this.state.facet(styleModule) != this.styleModules && this.mountStyles(), this.updateAttrs(), this.showAnnouncements(transactions), this.docView.updateSelection(redrawn, transactions.some((tr)=>tr.isUserEvent("select.pointer")
                        ));
                    } finally{
                        this.updateState = 0;
                    }
                    if (update.startState.facet(theme) != update.state.facet(theme) && (this.viewState.mustMeasureContent = !0), (redrawn || scrollTarget || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), !update.empty) for (let listener of this.state.facet(updateListener))listener(update);
                }
                setState(newState) {
                    if (0 != this.updateState) throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
                    if (this.destroyed) {
                        this.viewState.state = newState;
                        return;
                    }
                    this.updateState = 2;
                    let hadFocus = this.hasFocus;
                    try {
                        for (let plugin of this.plugins)plugin.destroy(this);
                        for (let plugin1 of (this.viewState = new ViewState(newState), this.plugins = newState.facet(viewPlugin).map((spec)=>new PluginInstance(spec)
                        ), this.pluginMap.clear(), this.plugins))plugin1.update(this);
                        this.docView = new DocView(this), this.inputState.ensureHandlers(this, this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
                    } finally{
                        this.updateState = 0;
                    }
                    hadFocus && this.focus(), this.requestMeasure();
                }
                updatePlugins(update) {
                    let prevSpecs = update.startState.facet(viewPlugin), specs = update.state.facet(viewPlugin);
                    if (prevSpecs != specs) {
                        let newPlugins = [];
                        for (let spec of specs){
                            let found = prevSpecs.indexOf(spec);
                            if (found < 0) newPlugins.push(new PluginInstance(spec));
                            else {
                                let plugin = this.plugins[found];
                                plugin.mustUpdate = update, newPlugins.push(plugin);
                            }
                        }
                        for (let plugin of this.plugins)plugin.mustUpdate != update && plugin.destroy(this);
                        this.plugins = newPlugins, this.pluginMap.clear(), this.inputState.ensureHandlers(this, this.plugins);
                    } else for (let p of this.plugins)p.mustUpdate = update;
                    for(let i = 0; i < this.plugins.length; i++)this.plugins[i].update(this);
                }
                measure(flush = !0) {
                    if (this.destroyed) return;
                    this.measureScheduled > -1 && cancelAnimationFrame(this.measureScheduled), this.measureScheduled = 0, flush && this.observer.flush();
                    let updated = null;
                    try {
                        for(let i = 0;; i++){
                            this.updateState = 1;
                            let oldViewport = this.viewport, changed = this.viewState.measure(this);
                            if (!changed && !this.measureRequests.length && null == this.viewState.scrollTarget) break;
                            if (i > 5) {
                                console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
                                break;
                            }
                            let measuring = [];
                            4 & changed || ([this.measureRequests, measuring] = [
                                measuring,
                                this.measureRequests, 
                            ]);
                            let measured = measuring.map((m)=>{
                                try {
                                    return m.read(this);
                                } catch (e) {
                                    return logException(this.state, e), BadMeasure;
                                }
                            }), update = ViewUpdate.create(this, this.state, []), redrawn = !1, scrolled = !1;
                            update.flags |= changed, updated ? updated.flags |= changed : updated = update, this.updateState = 2, update.empty || (this.updatePlugins(update), this.inputState.update(update), this.updateAttrs(), redrawn = this.docView.update(update));
                            for(let i8 = 0; i8 < measuring.length; i8++)if (measured[i8] != BadMeasure) try {
                                let m = measuring[i8];
                                m.write && m.write(measured[i8], this);
                            } catch (e) {
                                logException(this.state, e);
                            }
                            if (this.viewState.scrollTarget && (this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, scrolled = !0), redrawn && this.docView.updateSelection(!0), this.viewport.from == oldViewport.from && this.viewport.to == oldViewport.to && !scrolled && 0 == this.measureRequests.length) break;
                        }
                    } finally{
                        this.updateState = 0, this.measureScheduled = -1;
                    }
                    if (updated && !updated.empty) for (let listener of this.state.facet(updateListener))listener(updated);
                }
                get themeClasses() {
                    return baseThemeID + " " + (this.state.facet(darkTheme) ? baseDarkID : baseLightID) + " " + this.state.facet(theme);
                }
                updateAttrs() {
                    let editorAttrs = attrsFromFacet(this, editorAttributes, {
                        class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
                    }), contentAttrs = {
                        spellcheck: "false",
                        autocorrect: "off",
                        autocapitalize: "off",
                        translate: "no",
                        contenteditable: this.state.facet(editable) ? "true" : "false",
                        class: "cm-content",
                        style: `${browser.tabSize}: ${this.state.tabSize}`,
                        role: "textbox",
                        "aria-multiline": "true"
                    };
                    this.state.readOnly && (contentAttrs["aria-readonly"] = "true"), attrsFromFacet(this, contentAttributes, contentAttrs), this.observer.ignore(()=>{
                        updateAttrs(this.contentDOM, this.contentAttrs, contentAttrs), updateAttrs(this.dom, this.editorAttrs, editorAttrs);
                    }), this.editorAttrs = editorAttrs, this.contentAttrs = contentAttrs;
                }
                showAnnouncements(trs) {
                    let first = !0;
                    for (let tr of trs)for (let effect of tr.effects)effect.is(EditorView.announce) && (first && (this.announceDOM.textContent = ""), first = !1, this.announceDOM.appendChild(document.createElement("div")).textContent = effect.value);
                }
                mountStyles() {
                    this.styleModules = this.state.facet(styleModule), style_mod__WEBPACK_IMPORTED_MODULE_0__.V.mount(this.root, this.styleModules.concat(baseTheme$1).reverse());
                }
                readMeasured() {
                    if (2 == this.updateState) throw new Error("Reading the editor layout isn't allowed during an update");
                    0 == this.updateState && this.measureScheduled > -1 && this.measure(!1);
                }
                requestMeasure(request) {
                    if (this.measureScheduled < 0 && (this.measureScheduled = requestAnimationFrame(()=>this.measure()
                    )), request) {
                        if (null != request.key) {
                            for(let i = 0; i < this.measureRequests.length; i++)if (this.measureRequests[i].key === request.key) {
                                this.measureRequests[i] = request;
                                return;
                            }
                        }
                        this.measureRequests.push(request);
                    }
                }
                plugin(plugin) {
                    let known = this.pluginMap.get(plugin);
                    return (void 0 === known || known && known.spec != plugin) && this.pluginMap.set(plugin, known = this.plugins.find((p)=>p.spec == plugin
                    ) || null), known && known.update(this).value;
                }
                get documentTop() {
                    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
                }
                get documentPadding() {
                    return {
                        top: this.viewState.paddingTop,
                        bottom: this.viewState.paddingBottom
                    };
                }
                elementAtHeight(height) {
                    return this.readMeasured(), this.viewState.elementAtHeight(height);
                }
                lineBlockAtHeight(height) {
                    return this.readMeasured(), this.viewState.lineBlockAtHeight(height);
                }
                get viewportLineBlocks() {
                    return this.viewState.viewportLines;
                }
                lineBlockAt(pos) {
                    return this.viewState.lineBlockAt(pos);
                }
                get contentHeight() {
                    return this.viewState.contentHeight;
                }
                moveByChar(start, forward, by) {
                    return skipAtoms(this, start, moveByChar(this, start, forward, by));
                }
                moveByGroup(start, forward) {
                    return skipAtoms(this, start, moveByChar(this, start, forward, (initial)=>byGroup(this, start.head, initial)
                    ));
                }
                moveToLineBoundary(start, forward, includeWrap = !0) {
                    return moveToLineBoundary(this, start, forward, includeWrap);
                }
                moveVertically(start, forward, distance) {
                    return skipAtoms(this, start, moveVertically(this, start, forward, distance));
                }
                domAtPos(pos) {
                    return this.docView.domAtPos(pos);
                }
                posAtDOM(node, offset = 0) {
                    return this.docView.posFromDOM(node, offset);
                }
                posAtCoords(coords, precise = !0) {
                    return this.readMeasured(), posAtCoords(this, coords, precise);
                }
                coordsAtPos(pos, side = 1) {
                    this.readMeasured();
                    let rect = this.docView.coordsAt(pos, side);
                    if (!rect || rect.left == rect.right) return rect;
                    let line = this.state.doc.lineAt(pos), order = this.bidiSpans(line), span = order[BidiSpan.find(order, pos - line.from, -1, side)];
                    return flattenRect(rect, span.dir == Direction1.LTR == side > 0);
                }
                get defaultCharacterWidth() {
                    return this.viewState.heightOracle.charWidth;
                }
                get defaultLineHeight() {
                    return this.viewState.heightOracle.lineHeight;
                }
                get textDirection() {
                    return this.viewState.defaultTextDirection;
                }
                textDirectionAt(pos) {
                    return !this.state.facet(perLineTextDirection) || pos < this.viewport.from || pos > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(pos));
                }
                get lineWrapping() {
                    return this.viewState.heightOracle.lineWrapping;
                }
                bidiSpans(line) {
                    if (line.length > MaxBidiLine) return trivialOrder(line.length);
                    let dir = this.textDirectionAt(line.from);
                    for (let entry of this.bidiCache)if (entry.from == line.from && entry.dir == dir) return entry.order;
                    let order = computeOrder(line.text, dir);
                    return this.bidiCache.push(new CachedOrder(line.from, line.to, dir, order)), order;
                }
                get hasFocus() {
                    var _a;
                    return (document.hasFocus() || browser.safari && (null === (_a = this.inputState) || void 0 === _a ? void 0 : _a.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
                }
                focus() {
                    this.observer.ignore(()=>{
                        focusPreventScroll(this.contentDOM), this.docView.updateSelection();
                    });
                }
                destroy() {
                    for (let plugin of this.plugins)plugin.destroy(this);
                    this.plugins = [], this.inputState.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
                }
                static scrollIntoView(pos, options = {}) {
                    return scrollIntoView1.of(new ScrollTarget("number" == typeof pos ? _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(pos) : pos, options.y, options.x, options.yMargin, options.xMargin));
                }
                static domEventHandlers(handlers) {
                    return ViewPlugin.define(()=>({})
                    , {
                        eventHandlers: handlers
                    });
                }
                static theme(spec, options) {
                    let prefix = style_mod__WEBPACK_IMPORTED_MODULE_0__.V.newName(), result = [
                        theme.of(prefix),
                        styleModule.of(buildTheme(`.${prefix}`, spec)), 
                    ];
                    return options && options.dark && result.push(darkTheme.of(!0)), result;
                }
                static baseTheme(spec) {
                    return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Wl.lowest(styleModule.of(buildTheme("." + baseThemeID, spec, lightDarkIDs)));
                }
            }
            EditorView.styleModule = styleModule, EditorView.inputHandler = inputHandler, EditorView.perLineTextDirection = perLineTextDirection, EditorView.exceptionSink = exceptionSink, EditorView.updateListener = updateListener, EditorView.editable = editable, EditorView.mouseSelectionStyle = mouseSelectionStyle, EditorView.dragMovesSelection = dragMovesSelection$1, EditorView.clickAddsSelectionRange = clickAddsSelectionRange, EditorView.decorations = decorations1, EditorView.atomicRanges = atomicRanges, EditorView.scrollMargins = scrollMargins, EditorView.darkTheme = darkTheme, EditorView.contentAttributes = contentAttributes, EditorView.editorAttributes = editorAttributes, EditorView.lineWrapping = EditorView.contentAttributes.of({
                class: "cm-lineWrapping"
            }), EditorView.announce = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Py.define();
            const MaxBidiLine = 4096, BadMeasure = {};
            class CachedOrder {
                constructor(from, to, dir, order){
                    this.from = from, this.to = to, this.dir = dir, this.order = order;
                }
                static update(cache, changes) {
                    if (changes.empty) return cache;
                    let result = [], lastDir = cache.length ? cache[cache.length - 1].dir : Direction1.LTR;
                    for(let i = Math.max(0, cache.length - 10); i < cache.length; i++){
                        let entry = cache[i];
                        entry.dir != lastDir || changes.touchesRange(entry.from, entry.to) || result.push(new CachedOrder(changes.mapPos(entry.from, 1), changes.mapPos(entry.to, -1), entry.dir, entry.order));
                    }
                    return result;
                }
            }
            function attrsFromFacet(view, facet, base) {
                for(let sources = view.state.facet(facet), i = sources.length - 1; i >= 0; i--){
                    let source = sources[i], value = "function" == typeof source ? source(view) : source;
                    value && combineAttrs(value, base);
                }
                return base;
            }
            const currentPlatform = browser.mac ? "mac" : browser.windows ? "win" : browser.linux ? "linux" : "key";
            function normalizeKeyName(name, platform) {
                const parts = name.split(/-(?!$)/);
                let result = parts[parts.length - 1];
                "Space" == result && (result = " ");
                let alt, ctrl, shift, meta;
                for(let i = 0; i < parts.length - 1; ++i){
                    const mod = parts[i];
                    if (/^(cmd|meta|m)$/i.test(mod)) meta = !0;
                    else if (/^a(lt)?$/i.test(mod)) alt = !0;
                    else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = !0;
                    else if (/^s(hift)?$/i.test(mod)) shift = !0;
                    else if (/^mod$/i.test(mod)) "mac" == platform ? meta = !0 : ctrl = !0;
                    else throw new Error("Unrecognized modifier name: " + mod);
                }
                return alt && (result = "Alt-" + result), ctrl && (result = "Ctrl-" + result), meta && (result = "Meta-" + result), shift && (result = "Shift-" + result), result;
            }
            function modifiers(name, event, shift) {
                return event.altKey && (name = "Alt-" + name), event.ctrlKey && (name = "Ctrl-" + name), event.metaKey && (name = "Meta-" + name), !1 !== shift && event.shiftKey && (name = "Shift-" + name), name;
            }
            const handleKeyEvents = EditorView.domEventHandlers({
                keydown: (event, view)=>runHandlers(getKeymap(view.state), event, view, "editor")
            }), keymap = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                enables: handleKeyEvents
            }), Keymaps = new WeakMap();
            function getKeymap(state) {
                let bindings = state.facet(keymap), map = Keymaps.get(bindings);
                return map || Keymaps.set(bindings, map = buildKeymap(bindings.reduce((a, b)=>a.concat(b)
                , []))), map;
            }
            function runScopeHandlers(view, event, scope) {
                return runHandlers(getKeymap(view.state), event, view, scope);
            }
            let storedPrefix = null;
            const PrefixTimeout = 4000;
            function buildKeymap(bindings, platform = currentPlatform) {
                let bound = Object.create(null), isPrefix = Object.create(null), checkPrefix = (name, is)=>{
                    let current = isPrefix[name];
                    if (null == current) isPrefix[name] = is;
                    else if (current != is) throw new Error("Key binding " + name + " is used both as a regular binding and as a multi-stroke prefix");
                }, add = (scope, key, command, preventDefault)=>{
                    let scopeObj = bound[scope] || (bound[scope] = Object.create(null)), parts = key.split(/ (?!$)/).map((k)=>normalizeKeyName(k, platform)
                    );
                    for(let i = 1; i < parts.length; i++){
                        let prefix = parts.slice(0, i).join(" ");
                        checkPrefix(prefix, !0), scopeObj[prefix] || (scopeObj[prefix] = {
                            preventDefault: !0,
                            commands: [
                                (view)=>{
                                    let ourObj = storedPrefix = {
                                        view,
                                        prefix,
                                        scope
                                    };
                                    return setTimeout(()=>{
                                        storedPrefix == ourObj && (storedPrefix = null);
                                    }, PrefixTimeout), !0;
                                }, 
                            ]
                        });
                    }
                    let full = parts.join(" ");
                    checkPrefix(full, !1);
                    let binding = scopeObj[full] || (scopeObj[full] = {
                        preventDefault: !1,
                        commands: []
                    });
                    binding.commands.push(command), preventDefault && (binding.preventDefault = !0);
                };
                for (let b of bindings){
                    let name = b[platform] || b.key;
                    if (name) for (let scope of b.scope ? b.scope.split(" ") : [
                        "editor"
                    ])add(scope, name, b.run, b.preventDefault), b.shift && add(scope, "Shift-" + name, b.shift, b.preventDefault);
                }
                return bound;
            }
            function runHandlers(map, event, view, scope) {
                let name = (0, w3c_keyname__WEBPACK_IMPORTED_MODULE_1__.YG)(event), isChar = 1 == name.length && " " != name, prefix = "", fallthrough = !1;
                storedPrefix && storedPrefix.view == view && storedPrefix.scope == scope && (prefix = storedPrefix.prefix + " ", (fallthrough = 0 > modifierCodes.indexOf(event.keyCode)) && (storedPrefix = null));
                let runFor = (binding)=>{
                    if (binding) {
                        for (let cmd of binding.commands)if (cmd(view)) return !0;
                        binding.preventDefault && (fallthrough = !0);
                    }
                    return !1;
                }, scopeObj = map[scope], baseName;
                if (scopeObj) {
                    if (runFor(scopeObj[prefix + modifiers(name, event, !isChar)])) return !0;
                    if (isChar && (event.shiftKey || event.altKey || event.metaKey) && (baseName = w3c_keyname__WEBPACK_IMPORTED_MODULE_1__.ue[event.keyCode]) && baseName != name) {
                        if (runFor(scopeObj[prefix + modifiers(baseName, event, !0)])) return !0;
                    } else if (isChar && event.shiftKey && runFor(scopeObj[prefix + modifiers(name, event, !0)])) return !0;
                }
                return fallthrough;
            }
            const CanHidePrimary = !browser.ios, selectionConfig = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine: (configs)=>(0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.BO)(configs, {
                        cursorBlinkRate: 1200,
                        drawRangeCursor: !0
                    }, {
                        cursorBlinkRate: (a, b)=>Math.min(a, b)
                        ,
                        drawRangeCursor: (a, b)=>a || b
                    })
            });
            function drawSelection(config = {}) {
                return [
                    selectionConfig.of(config),
                    drawSelectionPlugin,
                    hideNativeSelection, 
                ];
            }
            class Piece {
                constructor(left, top, width, height, className){
                    this.left = left, this.top = top, this.width = width, this.height = height, this.className = className;
                }
                draw() {
                    let elt = document.createElement("div");
                    return elt.className = this.className, this.adjust(elt), elt;
                }
                adjust(elt) {
                    elt.style.left = this.left + "px", elt.style.top = this.top + "px", this.width >= 0 && (elt.style.width = this.width + "px"), elt.style.height = this.height + "px";
                }
                eq(p) {
                    return this.left == p.left && this.top == p.top && this.width == p.width && this.height == p.height && this.className == p.className;
                }
            }
            const drawSelectionPlugin = ViewPlugin.fromClass(class {
                constructor(view){
                    this.view = view, this.rangePieces = [], this.cursors = [], this.measureReq = {
                        read: this.readPos.bind(this),
                        write: this.drawSel.bind(this)
                    }, this.selectionLayer = view.scrollDOM.appendChild(document.createElement("div")), this.selectionLayer.className = "cm-selectionLayer", this.selectionLayer.setAttribute("aria-hidden", "true"), this.cursorLayer = view.scrollDOM.appendChild(document.createElement("div")), this.cursorLayer.className = "cm-cursorLayer", this.cursorLayer.setAttribute("aria-hidden", "true"), view.requestMeasure(this.measureReq), this.setBlinkRate();
                }
                setBlinkRate() {
                    this.cursorLayer.style.animationDuration = this.view.state.facet(selectionConfig).cursorBlinkRate + "ms";
                }
                update(update) {
                    let confChanged = update.startState.facet(selectionConfig) != update.state.facet(selectionConfig);
                    (confChanged || update.selectionSet || update.geometryChanged || update.viewportChanged) && this.view.requestMeasure(this.measureReq), update.transactions.some((tr)=>tr.scrollIntoView
                    ) && (this.cursorLayer.style.animationName = "cm-blink" == this.cursorLayer.style.animationName ? "cm-blink2" : "cm-blink"), confChanged && this.setBlinkRate();
                }
                readPos() {
                    let { state  } = this.view, conf = state.facet(selectionConfig), rangePieces = state.selection.ranges.map((r)=>r.empty ? [] : measureRange(this.view, r)
                    ).reduce((a, b)=>a.concat(b)
                    ), cursors = [];
                    for (let r1 of state.selection.ranges){
                        let prim = r1 == state.selection.main;
                        if (r1.empty ? !prim || CanHidePrimary : conf.drawRangeCursor) {
                            let piece = measureCursor(this.view, r1, prim);
                            piece && cursors.push(piece);
                        }
                    }
                    return {
                        rangePieces,
                        cursors
                    };
                }
                drawSel({ rangePieces , cursors  }) {
                    if (rangePieces.length != this.rangePieces.length || rangePieces.some((p, i)=>!p.eq(this.rangePieces[i])
                    )) {
                        for (let p of (this.selectionLayer.textContent = "", rangePieces))this.selectionLayer.appendChild(p.draw());
                        this.rangePieces = rangePieces;
                    }
                    if (cursors.length != this.cursors.length || cursors.some((c, i)=>!c.eq(this.cursors[i])
                    )) {
                        let oldCursors = this.cursorLayer.children;
                        if (oldCursors.length !== cursors.length) for (const c1 of (this.cursorLayer.textContent = "", cursors))this.cursorLayer.appendChild(c1.draw());
                        else cursors.forEach((c, idx)=>c.adjust(oldCursors[idx])
                        );
                        this.cursors = cursors;
                    }
                }
                destroy() {
                    this.selectionLayer.remove(), this.cursorLayer.remove();
                }
            }), themeSpec = {
                ".cm-line": {
                    "& ::selection": {
                        backgroundColor: "transparent !important"
                    },
                    "&::selection": {
                        backgroundColor: "transparent !important"
                    }
                }
            };
            CanHidePrimary && (themeSpec[".cm-line"].caretColor = "transparent !important");
            const hideNativeSelection = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Wl.highest(EditorView.theme(themeSpec));
            function getBase(view) {
                let rect = view.scrollDOM.getBoundingClientRect();
                return {
                    left: (view.textDirection == Direction1.LTR ? rect.left : rect.right - view.scrollDOM.clientWidth) - view.scrollDOM.scrollLeft,
                    top: rect.top - view.scrollDOM.scrollTop
                };
            }
            function wrappedLine(view, pos, inside) {
                let range = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.cursor(pos);
                return {
                    from: Math.max(inside.from, view.moveToLineBoundary(range, !1, !0).from),
                    to: Math.min(inside.to, view.moveToLineBoundary(range, !0, !0).from),
                    type: BlockType1.Text
                };
            }
            function blockAt(view, pos) {
                let line = view.lineBlockAt(pos);
                if (Array.isArray(line.type)) {
                    for (let l of line.type)if (l.to > pos || l.to == pos && (l.to == line.to || l.type == BlockType1.Text)) return l;
                }
                return line;
            }
            function measureRange(view, range) {
                if (range.to <= view.viewport.from || range.from >= view.viewport.to) return [];
                let from2 = Math.max(range.from, view.viewport.from), to2 = Math.min(range.to, view.viewport.to), ltr = view.textDirection == Direction1.LTR, content = view.contentDOM, contentRect = content.getBoundingClientRect(), base = getBase(view), lineStyle = window.getComputedStyle(content.firstChild), leftSide = contentRect.left + parseInt(lineStyle.paddingLeft) + Math.min(0, parseInt(lineStyle.textIndent)), rightSide = contentRect.right - parseInt(lineStyle.paddingRight), startBlock = blockAt(view, from2), endBlock = blockAt(view, to2), visualStart = startBlock.type == BlockType1.Text ? startBlock : null, visualEnd = endBlock.type == BlockType1.Text ? endBlock : null;
                if (view.lineWrapping && (visualStart && (visualStart = wrappedLine(view, from2, visualStart)), visualEnd && (visualEnd = wrappedLine(view, to2, visualEnd))), visualStart && visualEnd && visualStart.from == visualEnd.from) return pieces1(drawForLine(range.from, range.to, visualStart));
                {
                    let top = visualStart ? drawForLine(range.from, null, visualStart) : drawForWidget(startBlock, !1), bottom = visualEnd ? drawForLine(null, range.to, visualEnd) : drawForWidget(endBlock, !0), between = [];
                    return (visualStart || startBlock).to < (visualEnd || endBlock).from - 1 ? between.push(piece(leftSide, top.bottom, rightSide, bottom.top)) : top.bottom < bottom.top && view.elementAtHeight((top.bottom + bottom.top) / 2).type == BlockType1.Text && (top.bottom = bottom.top = (top.bottom + bottom.top) / 2), pieces1(top).concat(between).concat(pieces1(bottom));
                }
                function piece(left, top, right, bottom) {
                    return new Piece(left - base.left, top - base.top - 0.01, right - left, bottom - top + 0.01, "cm-selectionBackground");
                }
                function pieces1({ top , bottom , horizontal  }) {
                    let pieces = [];
                    for(let i = 0; i < horizontal.length; i += 2)pieces.push(piece(horizontal[i], top, horizontal[i + 1], bottom));
                    return pieces;
                }
                function drawForLine(from3, to3, line) {
                    let top = 1e9, bottom = -1000000000, horizontal = [];
                    function addSpan(from, fromOpen, to, toOpen, dir) {
                        let fromCoords = view.coordsAtPos(from, from == line.to ? -2 : 2), toCoords = view.coordsAtPos(to, to == line.from ? 2 : -2);
                        top = Math.min(fromCoords.top, toCoords.top, top), bottom = Math.max(fromCoords.bottom, toCoords.bottom, bottom), dir == Direction1.LTR ? horizontal.push(ltr && fromOpen ? leftSide : fromCoords.left, ltr && toOpen ? rightSide : toCoords.right) : horizontal.push(!ltr && toOpen ? leftSide : toCoords.left, !ltr && fromOpen ? rightSide : fromCoords.right);
                    }
                    let start = null != from3 ? from3 : line.from, end = null != to3 ? to3 : line.to;
                    for (let r of view.visibleRanges)if (r.to > start && r.from < end) for(let pos = Math.max(r.from, start), endPos = Math.min(r.to, end);;){
                        let docLine = view.state.doc.lineAt(pos);
                        for (let span of view.bidiSpans(docLine)){
                            let spanFrom = span.from + docLine.from, spanTo = span.to + docLine.from;
                            if (spanFrom >= endPos) break;
                            spanTo > pos && addSpan(Math.max(spanFrom, pos), null == from3 && spanFrom <= start, Math.min(spanTo, endPos), null == to3 && spanTo >= end, span.dir);
                        }
                        if ((pos = docLine.to + 1) >= endPos) break;
                    }
                    return 0 == horizontal.length && addSpan(start, null == from3, end, null == to3, view.textDirection), {
                        top,
                        bottom,
                        horizontal
                    };
                }
                function drawForWidget(block, top) {
                    let y = contentRect.top + (top ? block.top : block.bottom);
                    return {
                        top: y,
                        bottom: y,
                        horizontal: []
                    };
                }
            }
            function measureCursor(view, cursor, primary) {
                let pos = view.coordsAtPos(cursor.head, cursor.assoc || 1);
                if (!pos) return null;
                let base = getBase(view);
                return new Piece(pos.left - base.left, pos.top - base.top, -1, pos.bottom - pos.top, primary ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary");
            }
            const setDropCursorPos = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Py.define({
                map: (pos, mapping)=>null == pos ? null : mapping.mapPos(pos)
            }), dropCursorPos = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.QQ.define({
                create: ()=>null
                ,
                update: (pos2, tr)=>(null != pos2 && (pos2 = tr.changes.mapPos(pos2)), tr.effects.reduce((pos, e)=>e.is(setDropCursorPos) ? e.value : pos
                    , pos2))
            }), drawDropCursor = ViewPlugin.fromClass(class {
                constructor(view){
                    this.view = view, this.cursor = null, this.measureReq = {
                        read: this.readPos.bind(this),
                        write: this.drawCursor.bind(this)
                    };
                }
                update(update) {
                    var _a;
                    let cursorPos = update.state.field(dropCursorPos);
                    null == cursorPos ? null != this.cursor && (null === (_a = this.cursor) || void 0 === _a || _a.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (update.startState.field(dropCursorPos) != cursorPos || update.docChanged || update.geometryChanged) && this.view.requestMeasure(this.measureReq));
                }
                readPos() {
                    let pos = this.view.state.field(dropCursorPos), rect = null != pos && this.view.coordsAtPos(pos);
                    if (!rect) return null;
                    let outer = this.view.scrollDOM.getBoundingClientRect();
                    return {
                        left: rect.left - outer.left + this.view.scrollDOM.scrollLeft,
                        top: rect.top - outer.top + this.view.scrollDOM.scrollTop,
                        height: rect.bottom - rect.top
                    };
                }
                drawCursor(pos) {
                    this.cursor && (pos ? (this.cursor.style.left = pos.left + "px", this.cursor.style.top = pos.top + "px", this.cursor.style.height = pos.height + "px") : this.cursor.style.left = "-100000px");
                }
                destroy() {
                    this.cursor && this.cursor.remove();
                }
                setDropPos(pos) {
                    this.view.state.field(dropCursorPos) != pos && this.view.dispatch({
                        effects: setDropCursorPos.of(pos)
                    });
                }
            }, {
                eventHandlers: {
                    dragover (event) {
                        this.setDropPos(this.view.posAtCoords({
                            x: event.clientX,
                            y: event.clientY
                        }));
                    },
                    dragleave (event) {
                        event.target != this.view.contentDOM && this.view.contentDOM.contains(event.relatedTarget) || this.setDropPos(null);
                    },
                    dragend () {
                        this.setDropPos(null);
                    },
                    drop () {
                        this.setDropPos(null);
                    }
                }
            });
            function dropCursor() {
                return [
                    dropCursorPos,
                    drawDropCursor
                ];
            }
            function iterMatches(doc, re, from, to, f) {
                re.lastIndex = 0;
                for(let cursor = doc.iterRange(from, to), pos = from, m; !cursor.next().done; pos += cursor.value.length)if (!cursor.lineBreak) for(; m = re.exec(cursor.value);)f(pos + m.index, pos + m.index + m[0].length, m);
            }
            function matchRanges(view, maxLength) {
                let visible = view.visibleRanges;
                if (1 == visible.length && visible[0].from == view.viewport.from && visible[0].to == view.viewport.to) return visible;
                let result = [];
                for (let { from , to  } of visible)from = Math.max(view.state.doc.lineAt(from).from, from - maxLength), to = Math.min(view.state.doc.lineAt(to).to, to + maxLength), result.length && result[result.length - 1].to >= from ? result[result.length - 1].to = to : result.push({
                    from,
                    to
                });
                return result;
            }
            class MatchDecorator {
                constructor(config){
                    let { regexp , decoration , boundary , maxLength =1000 ,  } = config;
                    if (!regexp.global) throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
                    this.regexp = regexp, this.getDeco = "function" == typeof decoration ? decoration : ()=>decoration
                    , this.boundary = boundary, this.maxLength = maxLength;
                }
                createDeco(view) {
                    let build = new _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.f_();
                    for (let { from , to  } of matchRanges(view, this.maxLength))iterMatches(view.state.doc, this.regexp, from, to, (a, b, m)=>build.add(a, b, this.getDeco(m, view, a))
                    );
                    return build.finish();
                }
                updateDeco(update, deco) {
                    let changeFrom = 1e9, changeTo = -1;
                    return (update.docChanged && update.changes.iterChanges((_f, _t, from, to)=>{
                        to > update.view.viewport.from && from < update.view.viewport.to && (changeFrom = Math.min(from, changeFrom), changeTo = Math.max(to, changeTo));
                    }), update.viewportChanged || changeTo - changeFrom > 1000) ? this.createDeco(update.view) : changeTo > -1 ? this.updateRange(update.view, deco.map(update.changes), changeFrom, changeTo) : deco;
                }
                updateRange(view, deco, updateFrom, updateTo) {
                    for (let r of view.visibleRanges){
                        let from4 = Math.max(r.from, updateFrom), to4 = Math.min(r.to, updateTo);
                        if (to4 > from4) {
                            let fromLine = view.state.doc.lineAt(from4), toLine = fromLine.to < to4 ? view.state.doc.lineAt(to4) : fromLine, start = Math.max(r.from, fromLine.from), end = Math.min(r.to, toLine.to);
                            if (this.boundary) {
                                for(; from4 > fromLine.from; from4--)if (this.boundary.test(fromLine.text[from4 - 1 - fromLine.from])) {
                                    start = from4;
                                    break;
                                }
                                for(; to4 < toLine.to; to4++)if (this.boundary.test(toLine.text[to4 - toLine.from])) {
                                    end = to4;
                                    break;
                                }
                            }
                            let ranges = [], m1;
                            if (fromLine == toLine) for(this.regexp.lastIndex = start - fromLine.from; (m1 = this.regexp.exec(fromLine.text)) && m1.index < end - fromLine.from;){
                                let pos = m1.index + fromLine.from;
                                ranges.push(this.getDeco(m1, view, pos).range(pos, pos + m1[0].length));
                            }
                            else iterMatches(view.state.doc, this.regexp, start, end, (from, to, m)=>ranges.push(this.getDeco(m, view, from).range(from, to))
                            );
                            deco = deco.update({
                                filterFrom: start,
                                filterTo: end,
                                filter: (from, to)=>from < start || to > end
                                ,
                                add: ranges
                            });
                        }
                    }
                    return deco;
                }
            }
            const UnicodeRegexpSupport = null != /x/.unicode ? "gu" : "g", Specials = new RegExp("[\u0000-\u0008\u000a-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\ufeff\ufff9-\ufffc]", UnicodeRegexpSupport), Names = {
                0: "null",
                7: "bell",
                8: "backspace",
                10: "newline",
                11: "vertical tab",
                13: "carriage return",
                27: "escape",
                8203: "zero width space",
                8204: "zero width non-joiner",
                8205: "zero width joiner",
                8206: "left-to-right mark",
                8207: "right-to-left mark",
                8232: "line separator",
                8237: "left-to-right override",
                8238: "right-to-left override",
                8233: "paragraph separator",
                65279: "zero width no-break space",
                65532: "object replacement"
            };
            let _supportsTabSize = null;
            function supportsTabSize() {
                var _a;
                if (null == _supportsTabSize && "undefined" != typeof document && document.body) {
                    let styles = document.body.style;
                    _supportsTabSize = (null !== (_a = styles.tabSize) && void 0 !== _a ? _a : styles.MozTabSize) != null;
                }
                return _supportsTabSize || !1;
            }
            const specialCharConfig = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine (configs) {
                    let config = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.BO)(configs, {
                        render: null,
                        specialChars: Specials,
                        addSpecialChars: null
                    });
                    return (config.replaceTabs = !supportsTabSize()) && (config.specialChars = new RegExp("\t|" + config.specialChars.source, UnicodeRegexpSupport)), config.addSpecialChars && (config.specialChars = new RegExp(config.specialChars.source + "|" + config.addSpecialChars.source, UnicodeRegexpSupport)), config;
                }
            });
            function highlightSpecialChars(config = {}) {
                return [
                    specialCharConfig.of(config),
                    specialCharPlugin()
                ];
            }
            let _plugin = null;
            function specialCharPlugin() {
                return _plugin || (_plugin = ViewPlugin.fromClass(class {
                    constructor(view){
                        this.view = view, this.decorations = Decoration.none, this.decorationCache = Object.create(null), this.decorator = this.makeDecorator(view.state.facet(specialCharConfig)), this.decorations = this.decorator.createDeco(view);
                    }
                    makeDecorator(conf) {
                        return new MatchDecorator({
                            regexp: conf.specialChars,
                            decoration: (m, view, pos)=>{
                                let { doc  } = view.state, code = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.gm)(m[0], 0);
                                if (9 == code) {
                                    let line = doc.lineAt(pos), size = view.state.tabSize, col = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.IS)(line.text, size, pos - line.from);
                                    return Decoration.replace({
                                        widget: new TabWidget((size - col % size) * this.view.defaultCharacterWidth)
                                    });
                                }
                                return this.decorationCache[code] || (this.decorationCache[code] = Decoration.replace({
                                    widget: new SpecialCharWidget(conf, code)
                                }));
                            },
                            boundary: conf.replaceTabs ? void 0 : /[^]/
                        });
                    }
                    update(update) {
                        let conf = update.state.facet(specialCharConfig);
                        update.startState.facet(specialCharConfig) != conf ? (this.decorator = this.makeDecorator(conf), this.decorations = this.decorator.createDeco(update.view)) : this.decorations = this.decorator.updateDeco(update, this.decorations);
                    }
                }, {
                    decorations: (v)=>v.decorations
                }));
            }
            const DefaultPlaceholder = "\u2022";
            function placeholder$1(code) {
                return code >= 32 ? DefaultPlaceholder : 10 == code ? "\u2424" : String.fromCharCode(9216 + code);
            }
            class SpecialCharWidget extends WidgetType {
                constructor(options, code){
                    super(), this.options = options, this.code = code;
                }
                eq(other) {
                    return other.code == this.code;
                }
                toDOM(view) {
                    let ph = placeholder$1(this.code), desc = view.state.phrase("Control character") + " " + (Names[this.code] || "0x" + this.code.toString(16)), custom = this.options.render && this.options.render(this.code, desc, ph);
                    if (custom) return custom;
                    let span = document.createElement("span");
                    return span.textContent = ph, span.title = desc, span.setAttribute("aria-label", desc), span.className = "cm-specialChar", span;
                }
                ignoreEvent() {
                    return !1;
                }
            }
            class TabWidget extends WidgetType {
                constructor(width){
                    super(), this.width = width;
                }
                eq(other) {
                    return other.width == this.width;
                }
                toDOM() {
                    let span = document.createElement("span");
                    return span.textContent = "\t", span.className = "cm-tab", span.style.width = this.width + "px", span;
                }
                ignoreEvent() {
                    return !1;
                }
            }
            function highlightActiveLine() {
                return activeLineHighlighter;
            }
            const lineDeco = Decoration.line({
                class: "cm-activeLine"
            }), activeLineHighlighter = ViewPlugin.fromClass(class {
                constructor(view){
                    this.decorations = this.getDeco(view);
                }
                update(update) {
                    (update.docChanged || update.selectionSet) && (this.decorations = this.getDeco(update.view));
                }
                getDeco(view) {
                    let lastLineStart = -1, deco = [];
                    for (let r of view.state.selection.ranges){
                        if (!r.empty) return Decoration.none;
                        let line = view.lineBlockAt(r.head);
                        line.from > lastLineStart && (deco.push(lineDeco.range(line.from)), lastLineStart = line.from);
                    }
                    return Decoration.set(deco);
                }
            }, {
                decorations: (v)=>v.decorations
            });
            class Placeholder extends WidgetType {
                constructor(content){
                    super(), this.content = content;
                }
                toDOM() {
                    let wrap = document.createElement("span");
                    return wrap.className = "cm-placeholder", wrap.style.pointerEvents = "none", wrap.appendChild("string" == typeof this.content ? document.createTextNode(this.content) : this.content), "string" == typeof this.content ? wrap.setAttribute("aria-label", "placeholder " + this.content) : wrap.setAttribute("aria-hidden", "true"), wrap;
                }
                ignoreEvent() {
                    return !1;
                }
            }
            function placeholder(content) {
                return ViewPlugin.fromClass(class {
                    constructor(view){
                        this.view = view, this.placeholder = Decoration.set([
                            Decoration.widget({
                                widget: new Placeholder(content),
                                side: 1
                            }).range(0), 
                        ]);
                    }
                    get decorations() {
                        return this.view.state.doc.length ? Decoration.none : this.placeholder;
                    }
                }, {
                    decorations: (v)=>v.decorations
                });
            }
            const MaxOff = 2000;
            function rectangleFor(state, a, b) {
                let startLine = Math.min(a.line, b.line), endLine = Math.max(a.line, b.line), ranges = [];
                if (a.off > MaxOff || b.off > MaxOff || a.col < 0 || b.col < 0) {
                    let startOff = Math.min(a.off, b.off), endOff = Math.max(a.off, b.off);
                    for(let i = startLine; i <= endLine; i++){
                        let line = state.doc.line(i);
                        line.length <= endOff && ranges.push(_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.range(line.from + startOff, line.to + endOff));
                    }
                } else {
                    let startCol = Math.min(a.col, b.col), endCol = Math.max(a.col, b.col);
                    for(let i = startLine; i <= endLine; i++){
                        let line = state.doc.line(i), start = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Gz)(line.text, startCol, state.tabSize, !0);
                        if (start > -1) {
                            let end = (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Gz)(line.text, endCol, state.tabSize);
                            ranges.push(_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.range(line.from + start, line.from + end));
                        }
                    }
                }
                return ranges;
            }
            function absoluteColumn(view, x) {
                let ref = view.coordsAtPos(view.viewport.from);
                return ref ? Math.round(Math.abs((ref.left - x) / view.defaultCharacterWidth)) : -1;
            }
            function getPos(view, event) {
                let offset = view.posAtCoords({
                    x: event.clientX,
                    y: event.clientY
                }, !1), line = view.state.doc.lineAt(offset), off = offset - line.from, col = off > MaxOff ? -1 : off == line.length ? absoluteColumn(view, event.clientX) : (0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.IS)(line.text, view.state.tabSize, offset - line.from);
                return {
                    line: line.number,
                    col,
                    off
                };
            }
            function rectangleSelectionStyle(view, event2) {
                let start = getPos(view, event2), startSel = view.state.selection;
                return start ? {
                    update (update) {
                        if (update.docChanged) {
                            let newStart = update.changes.mapPos(update.startState.doc.line(start.line).from), newLine = update.state.doc.lineAt(newStart);
                            start = {
                                line: newLine.number,
                                col: start.col,
                                off: Math.min(start.off, newLine.length)
                            }, startSel = startSel.map(update.changes);
                        }
                    },
                    get (event, _extend, multiple) {
                        let cur = getPos(view, event);
                        if (!cur) return startSel;
                        let ranges = rectangleFor(view.state, start, cur);
                        return ranges.length ? multiple ? _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.create(ranges.concat(startSel.ranges)) : _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.jT.create(ranges) : startSel;
                    }
                } : null;
            }
            function rectangularSelection(options) {
                let filter = (null == options ? void 0 : options.eventFilter) || ((e)=>e.altKey && 0 == e.button
                );
                return EditorView.mouseSelectionStyle.of((view, event)=>filter(event) ? rectangleSelectionStyle(view, event) : null
                );
            }
            const keys = {
                Alt: [
                    18,
                    (e)=>e.altKey
                ],
                Control: [
                    17,
                    (e)=>e.ctrlKey
                ],
                Shift: [
                    16,
                    (e)=>e.shiftKey
                ],
                Meta: [
                    91,
                    (e)=>e.metaKey
                ]
            }, showCrosshair = {
                style: "cursor: crosshair"
            };
            function crosshairCursor(options = {}) {
                let [code, getter] = keys[options.key || "Alt"], plugin = ViewPlugin.fromClass(class {
                    constructor(view){
                        this.view = view, this.isDown = !1;
                    }
                    set(isDown) {
                        this.isDown != isDown && (this.isDown = isDown, this.view.update([]));
                    }
                }, {
                    eventHandlers: {
                        keydown (e) {
                            this.set(e.keyCode == code || getter(e));
                        },
                        keyup (e) {
                            e.keyCode != code && getter(e) || this.set(!1);
                        }
                    }
                });
                return [
                    plugin,
                    EditorView.contentAttributes.of((view)=>{
                        var _a;
                        return (null === (_a = view.plugin(plugin)) || void 0 === _a ? void 0 : _a.isDown) ? showCrosshair : null;
                    }), 
                ];
            }
            const Outside = "-10000px";
            class TooltipViewManager {
                constructor(view, facet, createTooltipView){
                    this.facet = facet, this.createTooltipView = createTooltipView, this.input = view.state.facet(facet), this.tooltips = this.input.filter((t)=>t
                    ), this.tooltipViews = this.tooltips.map(createTooltipView);
                }
                update(update) {
                    let input = update.state.facet(this.facet), tooltips = input.filter((x)=>x
                    );
                    if (input === this.input) {
                        for (let t of this.tooltipViews)t.update && t.update(update);
                        return !1;
                    }
                    let tooltipViews = [];
                    for(let i = 0; i < tooltips.length; i++){
                        let tip = tooltips[i], known = -1;
                        if (tip) {
                            for(let i9 = 0; i9 < this.tooltips.length; i9++){
                                let other = this.tooltips[i9];
                                other && other.create == tip.create && (known = i9);
                            }
                            if (known < 0) tooltipViews[i] = this.createTooltipView(tip);
                            else {
                                let tooltipView = tooltipViews[i] = this.tooltipViews[known];
                                tooltipView.update && tooltipView.update(update);
                            }
                        }
                    }
                    for (let t of this.tooltipViews)0 > tooltipViews.indexOf(t) && t.dom.remove();
                    return this.input = input, this.tooltips = tooltips, this.tooltipViews = tooltipViews, !0;
                }
            }
            function windowSpace() {
                return {
                    top: 0,
                    left: 0,
                    bottom: innerHeight,
                    right: innerWidth
                };
            }
            const tooltipConfig = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine (values) {
                    var _a, _b, _c;
                    return {
                        position: browser.ios ? "absolute" : (null === (_a = values.find((conf)=>conf.position
                        )) || void 0 === _a ? void 0 : _a.position) || "fixed",
                        parent: (null === (_b = values.find((conf)=>conf.parent
                        )) || void 0 === _b ? void 0 : _b.parent) || null,
                        tooltipSpace: (null === (_c = values.find((conf)=>conf.tooltipSpace
                        )) || void 0 === _c ? void 0 : _c.tooltipSpace) || windowSpace
                    };
                }
            }), tooltipPlugin = ViewPlugin.fromClass(class {
                constructor(view){
                    var _a;
                    this.view = view, this.inView = !0, this.lastTransaction = 0, this.measureTimeout = -1;
                    let config = view.state.facet(tooltipConfig);
                    this.position = config.position, this.parent = config.parent, this.classes = view.themeClasses, this.createContainer(), this.measureReq = {
                        read: this.readMeasure.bind(this),
                        write: this.writeMeasure.bind(this),
                        key: this
                    }, this.manager = new TooltipViewManager(view, showTooltip, (t)=>this.createTooltip(t)
                    ), this.intersectionObserver = "function" == typeof IntersectionObserver ? new IntersectionObserver((entries)=>{
                        Date.now() > this.lastTransaction - 50 && entries.length > 0 && entries[entries.length - 1].intersectionRatio < 1 && this.measureSoon();
                    }, {
                        threshold: [
                            1
                        ]
                    }) : null, this.observeIntersection(), null === (_a = view.dom.ownerDocument.defaultView) || void 0 === _a || _a.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
                }
                createContainer() {
                    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
                }
                observeIntersection() {
                    if (this.intersectionObserver) for (let tooltip of (this.intersectionObserver.disconnect(), this.manager.tooltipViews))this.intersectionObserver.observe(tooltip.dom);
                }
                measureSoon() {
                    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(()=>{
                        this.measureTimeout = -1, this.maybeMeasure();
                    }, 50));
                }
                update(update) {
                    update.transactions.length && (this.lastTransaction = Date.now());
                    let updated = this.manager.update(update);
                    updated && this.observeIntersection();
                    let shouldMeasure = updated || update.geometryChanged, newConfig = update.state.facet(tooltipConfig);
                    if (newConfig.position != this.position) {
                        for (let t of (this.position = newConfig.position, this.manager.tooltipViews))t.dom.style.position = this.position;
                        shouldMeasure = !0;
                    }
                    if (newConfig.parent != this.parent) {
                        for (let t of (this.parent && this.container.remove(), this.parent = newConfig.parent, this.createContainer(), this.manager.tooltipViews))this.container.appendChild(t.dom);
                        shouldMeasure = !0;
                    } else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
                    shouldMeasure && this.maybeMeasure();
                }
                createTooltip(tooltip) {
                    let tooltipView = tooltip.create(this.view);
                    if (tooltipView.dom.classList.add("cm-tooltip"), tooltip.arrow && !tooltipView.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
                        let arrow = document.createElement("div");
                        arrow.className = "cm-tooltip-arrow", tooltipView.dom.appendChild(arrow);
                    }
                    return tooltipView.dom.style.position = this.position, tooltipView.dom.style.top = Outside, this.container.appendChild(tooltipView.dom), tooltipView.mount && tooltipView.mount(this.view), tooltipView;
                }
                destroy() {
                    var _a, _b;
                    for (let { dom  } of (null === (_a = this.view.dom.ownerDocument.defaultView) || void 0 === _a || _a.removeEventListener("resize", this.measureSoon), this.manager.tooltipViews))dom.remove();
                    null === (_b = this.intersectionObserver) || void 0 === _b || _b.disconnect(), clearTimeout(this.measureTimeout);
                }
                readMeasure() {
                    let editor = this.view.dom.getBoundingClientRect();
                    return {
                        editor,
                        parent: this.parent ? this.container.getBoundingClientRect() : editor,
                        pos: this.manager.tooltips.map((t, i)=>{
                            let tv = this.manager.tooltipViews[i];
                            return tv.getCoords ? tv.getCoords(t.pos) : this.view.coordsAtPos(t.pos);
                        }),
                        size: this.manager.tooltipViews.map(({ dom  })=>dom.getBoundingClientRect()
                        ),
                        space: this.view.state.facet(tooltipConfig).tooltipSpace(this.view)
                    };
                }
                writeMeasure(measured) {
                    let { editor , space  } = measured, others = [];
                    for(let i = 0; i < this.manager.tooltips.length; i++){
                        let tooltip = this.manager.tooltips[i], tView = this.manager.tooltipViews[i], { dom  } = tView, pos = measured.pos[i], size = measured.size[i];
                        if (!pos || pos.bottom <= Math.max(editor.top, space.top) || pos.top >= Math.min(editor.bottom, space.bottom) || pos.right < Math.max(editor.left, space.left) - 0.1 || pos.left > Math.min(editor.right, space.right) + 0.1) {
                            dom.style.top = Outside;
                            continue;
                        }
                        let arrow = tooltip.arrow ? tView.dom.querySelector(".cm-tooltip-arrow") : null, arrowHeight = arrow ? 7 : 0, width = size.right - size.left, height = size.bottom - size.top, offset = tView.offset || noOffset, ltr = this.view.textDirection == Direction1.LTR, left = size.width > space.right - space.left ? ltr ? space.left : space.right - size.width : ltr ? Math.min(pos.left - (arrow ? 14 : 0) + offset.x, space.right - width) : Math.max(space.left, pos.left - width + (arrow ? 14 : 0) - offset.x), above = !!tooltip.above;
                        !tooltip.strictSide && (above ? pos.top - (size.bottom - size.top) - offset.y < space.top : pos.bottom + (size.bottom - size.top) + offset.y > space.bottom) && above == space.bottom - pos.bottom > pos.top - space.top && (above = !above);
                        let top = above ? pos.top - height - arrowHeight - offset.y : pos.bottom + arrowHeight + offset.y, right = left + width;
                        if (!0 !== tView.overlap) for (let r of others)r.left < right && r.right > left && r.top < top + height && r.bottom > top && (top = above ? r.top - height - 2 - arrowHeight : r.bottom + arrowHeight + 2);
                        "absolute" == this.position ? (dom.style.top = top - measured.parent.top + "px", dom.style.left = left - measured.parent.left + "px") : (dom.style.top = top + "px", dom.style.left = left + "px"), arrow && (arrow.style.left = `${pos.left + (ltr ? offset.x : -offset.x) - (left + 14 - 7)}px`), !0 !== tView.overlap && others.push({
                            left,
                            top,
                            right,
                            bottom: top + height
                        }), dom.classList.toggle("cm-tooltip-above", above), dom.classList.toggle("cm-tooltip-below", !above), tView.positioned && tView.positioned();
                    }
                }
                maybeMeasure() {
                    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView))) for (let tv of this.manager.tooltipViews)tv.dom.style.top = Outside;
                }
            }, {
                eventHandlers: {
                    scroll () {
                        this.maybeMeasure();
                    }
                }
            }), baseTheme = EditorView.baseTheme({
                ".cm-tooltip": {
                    zIndex: 100
                },
                "&light .cm-tooltip": {
                    border: "1px solid #bbb",
                    backgroundColor: "#f5f5f5"
                },
                "&light .cm-tooltip-section:not(:first-child)": {
                    borderTop: "1px solid #bbb"
                },
                "&dark .cm-tooltip": {
                    backgroundColor: "#333338",
                    color: "white"
                },
                ".cm-tooltip-arrow": {
                    height: "7px",
                    width: "14px",
                    position: "absolute",
                    zIndex: -1,
                    overflow: "hidden",
                    "&:before, &:after": {
                        content: "''",
                        position: "absolute",
                        width: 0,
                        height: 0,
                        borderLeft: "7px solid transparent",
                        borderRight: "7px solid transparent"
                    },
                    ".cm-tooltip-above &": {
                        bottom: "-7px",
                        "&:before": {
                            borderTop: "7px solid #bbb"
                        },
                        "&:after": {
                            borderTop: "7px solid #f5f5f5",
                            bottom: "1px"
                        }
                    },
                    ".cm-tooltip-below &": {
                        top: "-7px",
                        "&:before": {
                            borderBottom: "7px solid #bbb"
                        },
                        "&:after": {
                            borderBottom: "7px solid #f5f5f5",
                            top: "1px"
                        }
                    }
                },
                "&dark .cm-tooltip .cm-tooltip-arrow": {
                    "&:before": {
                        borderTopColor: "#333338",
                        borderBottomColor: "#333338"
                    },
                    "&:after": {
                        borderTopColor: "transparent",
                        borderBottomColor: "transparent"
                    }
                }
            }), noOffset = {
                x: 0,
                y: 0
            }, showTooltip = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                enables: [
                    tooltipPlugin,
                    baseTheme
                ]
            }), showHoverTooltip = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define();
            class HoverTooltipHost {
                constructor(view){
                    this.view = view, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new TooltipViewManager(view, showHoverTooltip, (t)=>this.createHostedView(t)
                    );
                }
                static create(view) {
                    return new HoverTooltipHost(view);
                }
                createHostedView(tooltip) {
                    let hostedView = tooltip.create(this.view);
                    return hostedView.dom.classList.add("cm-tooltip-section"), this.dom.appendChild(hostedView.dom), this.mounted && hostedView.mount && hostedView.mount(this.view), hostedView;
                }
                mount(view) {
                    for (let hostedView of this.manager.tooltipViews)hostedView.mount && hostedView.mount(view);
                    this.mounted = !0;
                }
                positioned() {
                    for (let hostedView of this.manager.tooltipViews)hostedView.positioned && hostedView.positioned();
                }
                update(update) {
                    this.manager.update(update);
                }
            }
            const showHoverTooltipHost = showTooltip.compute([
                showHoverTooltip
            ], (state)=>{
                let tooltips = state.facet(showHoverTooltip).filter((t)=>t
                );
                return 0 === tooltips.length ? null : {
                    pos: Math.min(...tooltips.map((t)=>t.pos
                    )),
                    end: Math.max(...tooltips.filter((t)=>null != t.end
                    ).map((t)=>t.end
                    )),
                    create: HoverTooltipHost.create,
                    above: tooltips[0].above,
                    arrow: tooltips.some((t)=>t.arrow
                    )
                };
            });
            class HoverPlugin {
                constructor(view, source, field, setHover, hoverTime){
                    this.view = view, this.source = source, this.field = field, this.setHover = setHover, this.hoverTime = hoverTime, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = {
                        x: 0,
                        y: 0,
                        target: view.dom,
                        time: 0
                    }, this.checkHover = this.checkHover.bind(this), view.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), view.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
                }
                update() {
                    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(()=>this.startHover()
                    , 20));
                }
                get active() {
                    return this.view.state.field(this.field);
                }
                checkHover() {
                    if (this.hoverTimeout = -1, this.active) return;
                    let hovered = Date.now() - this.lastMove.time;
                    hovered < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - hovered) : this.startHover();
                }
                startHover() {
                    clearTimeout(this.restartTimeout);
                    let { lastMove  } = this, pos = this.view.contentDOM.contains(lastMove.target) ? this.view.posAtCoords(lastMove) : null;
                    if (null == pos) return;
                    let posCoords = this.view.coordsAtPos(pos);
                    if (null == posCoords || lastMove.y < posCoords.top || lastMove.y > posCoords.bottom || lastMove.x < posCoords.left - this.view.defaultCharacterWidth || lastMove.x > posCoords.right + this.view.defaultCharacterWidth) return;
                    let bidi = this.view.bidiSpans(this.view.state.doc.lineAt(pos)).find((s)=>s.from <= pos && s.to >= pos
                    ), rtl = bidi && bidi.dir == Direction1.RTL ? -1 : 1, open = this.source(this.view, pos, lastMove.x < posCoords.left ? -rtl : rtl);
                    if (null == open ? void 0 : open.then) {
                        let pending = this.pending = {
                            pos
                        };
                        open.then((result)=>{
                            this.pending == pending && (this.pending = null, result && this.view.dispatch({
                                effects: this.setHover.of(result)
                            }));
                        }, (e)=>logException(this.view.state, e, "hover tooltip")
                        );
                    } else open && this.view.dispatch({
                        effects: this.setHover.of(open)
                    });
                }
                mousemove(event) {
                    var _a;
                    this.lastMove = {
                        x: event.clientX,
                        y: event.clientY,
                        target: event.target,
                        time: Date.now()
                    }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
                    let tooltip = this.active;
                    if (tooltip && !isInTooltip(this.lastMove.target) || this.pending) {
                        let { pos  } = tooltip || this.pending, end = null !== (_a = null == tooltip ? void 0 : tooltip.end) && void 0 !== _a ? _a : pos;
                        (pos == end ? this.view.posAtCoords(this.lastMove) == pos : isOverRange(this.view, pos, end, event.clientX, event.clientY, 6)) || (this.view.dispatch({
                            effects: this.setHover.of(null)
                        }), this.pending = null);
                    }
                }
                mouseleave() {
                    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1, this.active && this.view.dispatch({
                        effects: this.setHover.of(null)
                    });
                }
                destroy() {
                    clearTimeout(this.hoverTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
                }
            }
            function isInTooltip(elt) {
                for(let cur = elt; cur; cur = cur.parentNode)if (1 == cur.nodeType && cur.classList.contains("cm-tooltip")) return !0;
                return !1;
            }
            function isOverRange(view, from, to, x, y, margin) {
                let range = document.createRange(), fromDOM = view.domAtPos(from), toDOM = view.domAtPos(to);
                range.setEnd(toDOM.node, toDOM.offset), range.setStart(fromDOM.node, fromDOM.offset);
                let rects = range.getClientRects();
                range.detach();
                for(let i = 0; i < rects.length; i++){
                    let rect = rects[i];
                    if (Math.max(rect.top - y, y - rect.bottom, rect.left - x, x - rect.right) <= margin) return !0;
                }
                return !1;
            }
            function hoverTooltip(source, options = {}) {
                let setHover = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Py.define(), hoverState = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.QQ.define({
                    create: ()=>null
                    ,
                    update (value, tr) {
                        if (value && (options.hideOnChange && (tr.docChanged || tr.selection) || options.hideOn && options.hideOn(tr, value))) return null;
                        if (value && tr.docChanged) {
                            let newPos = tr.changes.mapPos(value.pos, -1, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.gc.TrackDel);
                            if (null == newPos) return null;
                            let copy = Object.assign(Object.create(null), value);
                            copy.pos = newPos, null != value.end && (copy.end = tr.changes.mapPos(value.end)), value = copy;
                        }
                        for (let effect of tr.effects)effect.is(setHover) && (value = effect.value), effect.is(closeHoverTooltipEffect) && (value = null);
                        return value;
                    },
                    provide: (f)=>showHoverTooltip.from(f)
                });
                return [
                    hoverState,
                    ViewPlugin.define((view)=>new HoverPlugin(view, source, hoverState, setHover, options.hoverTime || 300)
                    ),
                    showHoverTooltipHost, 
                ];
            }
            function getTooltip(view, tooltip) {
                let plugin = view.plugin(tooltipPlugin);
                if (!plugin) return null;
                let found = plugin.manager.tooltips.indexOf(tooltip);
                return found < 0 ? null : plugin.manager.tooltipViews[found];
            }
            const closeHoverTooltipEffect = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Py.define(), panelConfig = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine (configs) {
                    let topContainer, bottomContainer;
                    for (let c of configs)topContainer = topContainer || c.topContainer, bottomContainer = bottomContainer || c.bottomContainer;
                    return {
                        topContainer,
                        bottomContainer
                    };
                }
            });
            function getPanel(view, panel) {
                let plugin = view.plugin(panelPlugin), index = plugin ? plugin.specs.indexOf(panel) : -1;
                return index > -1 ? plugin.panels[index] : null;
            }
            const panelPlugin = ViewPlugin.fromClass(class {
                constructor(view){
                    this.input = view.state.facet(showPanel), this.specs = this.input.filter((s)=>s
                    ), this.panels = this.specs.map((spec)=>spec(view)
                    );
                    let conf = view.state.facet(panelConfig);
                    for (let p2 of (this.top = new PanelGroup(view, !0, conf.topContainer), this.bottom = new PanelGroup(view, !1, conf.bottomContainer), this.top.sync(this.panels.filter((p)=>p.top
                    )), this.bottom.sync(this.panels.filter((p)=>!p.top
                    )), this.panels))p2.dom.classList.add("cm-panel"), p2.mount && p2.mount();
                }
                update(update) {
                    let conf = update.state.facet(panelConfig);
                    this.top.container != conf.topContainer && (this.top.sync([]), this.top = new PanelGroup(update.view, !0, conf.topContainer)), this.bottom.container != conf.bottomContainer && (this.bottom.sync([]), this.bottom = new PanelGroup(update.view, !1, conf.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
                    let input = update.state.facet(showPanel);
                    if (input != this.input) {
                        let specs = input.filter((x)=>x
                        ), panels = [], top = [], bottom = [], mount = [];
                        for (let spec of specs){
                            let known = this.specs.indexOf(spec), panel;
                            known < 0 ? (panel = spec(update.view), mount.push(panel)) : (panel = this.panels[known]).update && panel.update(update), panels.push(panel), (panel.top ? top : bottom).push(panel);
                        }
                        for (let p of (this.specs = specs, this.panels = panels, this.top.sync(top), this.bottom.sync(bottom), mount))p.dom.classList.add("cm-panel"), p.mount && p.mount();
                    } else for (let p of this.panels)p.update && p.update(update);
                }
                destroy() {
                    this.top.sync([]), this.bottom.sync([]);
                }
            }, {
                provide: (plugin)=>EditorView.scrollMargins.of((view)=>{
                        let value = view.plugin(plugin);
                        return value && {
                            top: value.top.scrollMargin(),
                            bottom: value.bottom.scrollMargin()
                        };
                    })
            });
            class PanelGroup {
                constructor(view, top, container){
                    this.view = view, this.top = top, this.container = container, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
                }
                sync(panels) {
                    for (let p of this.panels)p.destroy && 0 > panels.indexOf(p) && p.destroy();
                    this.panels = panels, this.syncDOM();
                }
                syncDOM() {
                    if (0 == this.panels.length) {
                        this.dom && (this.dom.remove(), this.dom = void 0);
                        return;
                    }
                    if (!this.dom) {
                        this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
                        let parent = this.container || this.view.dom;
                        parent.insertBefore(this.dom, this.top ? parent.firstChild : null);
                    }
                    let curDOM = this.dom.firstChild;
                    for (let panel of this.panels)if (panel.dom.parentNode == this.dom) {
                        for(; curDOM != panel.dom;)curDOM = rm(curDOM);
                        curDOM = curDOM.nextSibling;
                    } else this.dom.insertBefore(panel.dom, curDOM);
                    for(; curDOM;)curDOM = rm(curDOM);
                }
                scrollMargin() {
                    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
                }
                syncClasses() {
                    if (this.container && this.classes != this.view.themeClasses) {
                        for (let cls of this.classes.split(" "))cls && this.container.classList.remove(cls);
                        for (let cls1 of (this.classes = this.view.themeClasses).split(" "))cls1 && this.container.classList.add(cls1);
                    }
                }
            }
            function rm(node) {
                let next = node.nextSibling;
                return node.remove(), next;
            }
            const showPanel = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                enables: panelPlugin
            });
            class GutterMarker extends _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.uU {
                compare(other) {
                    return this == other || this.constructor == other.constructor && this.eq(other);
                }
                eq(other) {
                    return !1;
                }
                destroy(dom) {}
            }
            GutterMarker.prototype.elementClass = "", GutterMarker.prototype.toDOM = void 0, GutterMarker.prototype.mapMode = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.gc.TrackBefore, GutterMarker.prototype.startSide = GutterMarker.prototype.endSide = -1, GutterMarker.prototype.point = !0;
            const gutterLineClass = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), defaults = {
                class: "",
                renderEmptyElements: !1,
                elementStyle: "",
                markers: ()=>_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.empty
                ,
                lineMarker: ()=>null
                ,
                lineMarkerChange: null,
                initialSpacer: null,
                updateSpacer: null,
                domEventHandlers: {}
            }, activeGutters = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define();
            function gutter1(config) {
                return [
                    gutters1(),
                    activeGutters.of(Object.assign(Object.assign({}, defaults), config)), 
                ];
            }
            const unfixGutters = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine: (values)=>values.some((x)=>x
                    )
            });
            function gutters1(config) {
                let result = [
                    gutterView
                ];
                return config && !1 === config.fixed && result.push(unfixGutters.of(!0)), result;
            }
            const gutterView = ViewPlugin.fromClass(class {
                constructor(view){
                    for (let gutter of (this.view = view, this.prevViewport = view.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight + "px", this.gutters = view.state.facet(activeGutters).map((conf)=>new SingleGutterView(view, conf)
                    ), this.gutters))this.dom.appendChild(gutter.dom);
                    this.fixed = !view.state.facet(unfixGutters), this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), view.scrollDOM.insertBefore(this.dom, view.contentDOM);
                }
                update(update) {
                    if (this.updateGutters(update)) {
                        let vpA = this.prevViewport, vpB = update.view.viewport, vpOverlap = Math.min(vpA.to, vpB.to) - Math.max(vpA.from, vpB.from);
                        this.syncGutters(vpOverlap < (vpB.to - vpB.from) * 0.8);
                    }
                    update.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight + "px"), this.view.state.facet(unfixGutters) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : ""), this.prevViewport = update.view.viewport;
                }
                syncGutters(detach) {
                    let after = this.dom.nextSibling;
                    detach && this.dom.remove();
                    let lineClasses = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.iter(this.view.state.facet(gutterLineClass), this.view.viewport.from), classSet = [], contexts = this.gutters.map((gutter)=>new UpdateContext(gutter, this.view.viewport, -this.view.documentPadding.top)
                    );
                    for (let line of this.view.viewportLineBlocks){
                        let text;
                        if (Array.isArray(line.type)) {
                            for (let b of line.type)if (b.type == BlockType1.Text) {
                                text = b;
                                break;
                            }
                        } else text = line.type == BlockType1.Text ? line : void 0;
                        if (text) for (let cx of (classSet.length && (classSet = []), advanceCursor(lineClasses, classSet, line.from), contexts))cx.line(this.view, text, classSet);
                    }
                    for (let cx of contexts)cx.finish();
                    detach && this.view.scrollDOM.insertBefore(this.dom, after);
                }
                updateGutters(update) {
                    let prev = update.startState.facet(activeGutters), cur = update.state.facet(activeGutters), change = update.docChanged || update.heightChanged || update.viewportChanged || !_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.eq(update.startState.facet(gutterLineClass), update.state.facet(gutterLineClass), update.view.viewport.from, update.view.viewport.to);
                    if (prev == cur) for (let gutter of this.gutters)gutter.update(update) && (change = !0);
                    else {
                        change = !0;
                        let gutters = [];
                        for (let conf of cur){
                            let known = prev.indexOf(conf);
                            known < 0 ? gutters.push(new SingleGutterView(this.view, conf)) : (this.gutters[known].update(update), gutters.push(this.gutters[known]));
                        }
                        for (let g of this.gutters)g.dom.remove(), 0 > gutters.indexOf(g) && g.destroy();
                        for (let g1 of gutters)this.dom.appendChild(g1.dom);
                        this.gutters = gutters;
                    }
                    return change;
                }
                destroy() {
                    for (let view of this.gutters)view.destroy();
                    this.dom.remove();
                }
            }, {
                provide: (plugin)=>EditorView.scrollMargins.of((view)=>{
                        let value = view.plugin(plugin);
                        return value && 0 != value.gutters.length && value.fixed ? view.textDirection == Direction1.LTR ? {
                            left: value.dom.offsetWidth
                        } : {
                            right: value.dom.offsetWidth
                        } : null;
                    })
            });
            function asArray(val) {
                return Array.isArray(val) ? val : [
                    val
                ];
            }
            function advanceCursor(cursor, collect, pos) {
                for(; cursor.value && cursor.from <= pos;)cursor.from == pos && collect.push(cursor.value), cursor.next();
            }
            class UpdateContext {
                constructor(gutter, viewport, height){
                    this.gutter = gutter, this.height = height, this.localMarkers = [], this.i = 0, this.cursor = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.iter(gutter.markers, viewport.from);
                }
                line(view, line, extraMarkers) {
                    this.localMarkers.length && (this.localMarkers = []), advanceCursor(this.cursor, this.localMarkers, line.from);
                    let localMarkers = extraMarkers.length ? this.localMarkers.concat(extraMarkers) : this.localMarkers, forLine = this.gutter.config.lineMarker(view, line, localMarkers);
                    forLine && localMarkers.unshift(forLine);
                    let gutter = this.gutter;
                    if (0 == localMarkers.length && !gutter.config.renderEmptyElements) return;
                    let above = line.top - this.height;
                    if (this.i == gutter.elements.length) {
                        let newElt = new GutterElement(view, line.height, above, localMarkers);
                        gutter.elements.push(newElt), gutter.dom.appendChild(newElt.dom);
                    } else gutter.elements[this.i].update(view, line.height, above, localMarkers);
                    this.height = line.bottom, this.i++;
                }
                finish() {
                    let gutter = this.gutter;
                    for(; gutter.elements.length > this.i;){
                        let last = gutter.elements.pop();
                        gutter.dom.removeChild(last.dom), last.destroy();
                    }
                }
            }
            class SingleGutterView {
                constructor(view, config){
                    for(let prop in this.view = view, this.config = config, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : ""), config.domEventHandlers)this.dom.addEventListener(prop, (event)=>{
                        let line = view.lineBlockAtHeight(event.clientY - view.documentTop);
                        config.domEventHandlers[prop](view, line, event) && event.preventDefault();
                    });
                    this.markers = asArray(config.markers(view)), config.initialSpacer && (this.spacer = new GutterElement(view, 0, 0, [
                        config.initialSpacer(view), 
                    ]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
                }
                update(update) {
                    let prevMarkers = this.markers;
                    if (this.markers = asArray(this.config.markers(update.view)), this.spacer && this.config.updateSpacer) {
                        let updated = this.config.updateSpacer(this.spacer.markers[0], update);
                        updated != this.spacer.markers[0] && this.spacer.update(update.view, 0, 0, [
                            updated
                        ]);
                    }
                    let vp = update.view.viewport;
                    return !_codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.eq(this.markers, prevMarkers, vp.from, vp.to) || !!this.config.lineMarkerChange && this.config.lineMarkerChange(update);
                }
                destroy() {
                    for (let elt of this.elements)elt.destroy();
                }
            }
            class GutterElement {
                constructor(view, height, above, markers){
                    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(view, height, above, markers);
                }
                update(view, height, above, markers) {
                    this.height != height && (this.dom.style.height = (this.height = height) + "px"), this.above != above && (this.dom.style.marginTop = (this.above = above) ? above + "px" : ""), sameMarkers(this.markers, markers) || this.setMarkers(view, markers);
                }
                setMarkers(view, markers) {
                    let cls = "cm-gutterElement", domPos = this.dom.firstChild;
                    for(let iNew = 0, iOld = 0;;){
                        let skipTo = iOld, marker = iNew < markers.length ? markers[iNew++] : null, matched = !1;
                        if (marker) {
                            let c = marker.elementClass;
                            c && (cls += " " + c);
                            for(let i = iOld; i < this.markers.length; i++)if (this.markers[i].compare(marker)) {
                                skipTo = i, matched = !0;
                                break;
                            }
                        } else skipTo = this.markers.length;
                        for(; iOld < skipTo;){
                            let next = this.markers[iOld++];
                            if (next.toDOM) {
                                next.destroy(domPos);
                                let after = domPos.nextSibling;
                                domPos.remove(), domPos = after;
                            }
                        }
                        if (!marker) break;
                        marker.toDOM && (matched ? domPos = domPos.nextSibling : this.dom.insertBefore(marker.toDOM(view), domPos)), matched && iOld++;
                    }
                    this.dom.className = cls, this.markers = markers;
                }
                destroy() {
                    this.setMarkers(null, []);
                }
            }
            function sameMarkers(a, b) {
                if (a.length != b.length) return !1;
                for(let i = 0; i < a.length; i++)if (!a[i].compare(b[i])) return !1;
                return !0;
            }
            const lineNumberMarkers = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define(), lineNumberConfig = _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.r$.define({
                combine: (values)=>(0, _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.BO)(values, {
                        formatNumber: String,
                        domEventHandlers: {}
                    }, {
                        domEventHandlers (a, b) {
                            let result = Object.assign({}, a);
                            for(let event3 in b){
                                let exists = result[event3], add = b[event3];
                                result[event3] = exists ? (view, line, event)=>exists(view, line, event) || add(view, line, event)
                                 : add;
                            }
                            return result;
                        }
                    })
            });
            class NumberMarker extends GutterMarker {
                constructor(number){
                    super(), this.number = number;
                }
                eq(other) {
                    return this.number == other.number;
                }
                toDOM() {
                    return document.createTextNode(this.number);
                }
            }
            function formatNumber(view, number) {
                return view.state.facet(lineNumberConfig).formatNumber(number, view.state);
            }
            const lineNumberGutter = activeGutters.compute([
                lineNumberConfig
            ], (state)=>({
                    class: "cm-lineNumbers",
                    renderEmptyElements: !1,
                    markers: (view)=>view.state.facet(lineNumberMarkers)
                    ,
                    lineMarker: (view, line, others)=>others.some((m)=>m.toDOM
                        ) ? null : new NumberMarker(formatNumber(view, view.state.doc.lineAt(line.from).number))
                    ,
                    lineMarkerChange: (update)=>update.startState.facet(lineNumberConfig) != update.state.facet(lineNumberConfig)
                    ,
                    initialSpacer: (view)=>new NumberMarker(formatNumber(view, maxLineNumber(view.state.doc.lines)))
                    ,
                    updateSpacer (spacer, update) {
                        let max = formatNumber(update.view, maxLineNumber(update.view.state.doc.lines));
                        return max == spacer.number ? spacer : new NumberMarker(max);
                    },
                    domEventHandlers: state.facet(lineNumberConfig).domEventHandlers
                })
            );
            function lineNumbers(config = {}) {
                return [
                    lineNumberConfig.of(config),
                    gutters1(),
                    lineNumberGutter, 
                ];
            }
            function maxLineNumber(lines) {
                let last = 9;
                for(; last < lines;)last = 10 * last + 9;
                return last;
            }
            const activeLineGutterMarker = new class extends GutterMarker {
                constructor(){
                    super(...arguments), this.elementClass = "cm-activeLineGutter";
                }
            }(), activeLineGutterHighlighter = gutterLineClass.compute([
                "selection"
            ], (state)=>{
                let marks = [], last = -1;
                for (let range of state.selection.ranges)if (range.empty) {
                    let linePos = state.doc.lineAt(range.head).from;
                    linePos > last && (last = linePos, marks.push(activeLineGutterMarker.range(linePos)));
                }
                return _codemirror_state__WEBPACK_IMPORTED_MODULE_2__.Xs.of(marks);
            });
            function highlightActiveLineGutter() {
                return activeLineGutterHighlighter;
            }
        }
    }, 
]);
