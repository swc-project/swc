"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        546
    ],
    {
        9980: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            function _extends() {
                return (_extends = Object.assign || function(target) {
                    for(var i = 1; i < arguments.length; i++){
                        var source = arguments[i];
                        for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                    return target;
                }).apply(this, arguments);
            }
            function _objectWithoutPropertiesLoose(source, excluded) {
                if (null == source) return {};
                var key, i, target = {}, sourceKeys = Object.keys(source);
                for(i = 0; i < sourceKeys.length; i++)key = sourceKeys[i], excluded.indexOf(key) >= 0 || (target[key] = source[key]);
                return target;
            }
            __webpack_require__.d(__webpack_exports__, {
                ZP: function() {
                    return esm;
                }
            });
            var IterMode1, _a1, react = __webpack_require__(7294), dist = __webpack_require__(7421), state_dist = __webpack_require__(8120);
            const DefaultBufferLength = 1024;
            let nextPropID = 0;
            class Range {
                constructor(from, to){
                    this.from = from, this.to = to;
                }
            }
            class dist_NodeProp {
                constructor(config = {}){
                    this.id = nextPropID++, this.perNode = !!config.perNode, this.deserialize = config.deserialize || (()=>{
                        throw new Error("This node type doesn't define a deserialize function");
                    });
                }
                add(match) {
                    if (this.perNode) throw new RangeError("Can't add per-node props to node types");
                    return "function" != typeof match && (match = dist_NodeType.match(match)), (type)=>{
                        let result = match(type);
                        return void 0 === result ? null : [
                            this,
                            result
                        ];
                    };
                }
            }
            dist_NodeProp.closedBy = new dist_NodeProp({
                deserialize: (str)=>str.split(" ")
            }), dist_NodeProp.openedBy = new dist_NodeProp({
                deserialize: (str)=>str.split(" ")
            }), dist_NodeProp.group = new dist_NodeProp({
                deserialize: (str)=>str.split(" ")
            }), dist_NodeProp.contextHash = new dist_NodeProp({
                perNode: !0
            }), dist_NodeProp.lookAhead = new dist_NodeProp({
                perNode: !0
            }), dist_NodeProp.mounted = new dist_NodeProp({
                perNode: !0
            });
            const noProps = Object.create(null);
            class dist_NodeType {
                constructor(name, props, id, flags = 0){
                    this.name = name, this.props = props, this.id = id, this.flags = flags;
                }
                static define(spec) {
                    let props = spec.props && spec.props.length ? Object.create(null) : noProps, flags = (spec.top ? 1 : 0) | (spec.skipped ? 2 : 0) | (spec.error ? 4 : 0) | (null == spec.name ? 8 : 0), type = new dist_NodeType(spec.name || "", props, spec.id, flags);
                    if (spec.props) {
                        for (let src of spec.props)if (Array.isArray(src) || (src = src(type)), src) {
                            if (src[0].perNode) throw new RangeError("Can't store a per-node prop on a node type");
                            props[src[0].id] = src[1];
                        }
                    }
                    return type;
                }
                prop(prop) {
                    return this.props[prop.id];
                }
                get isTop() {
                    return (1 & this.flags) > 0;
                }
                get isSkipped() {
                    return (2 & this.flags) > 0;
                }
                get isError() {
                    return (4 & this.flags) > 0;
                }
                get isAnonymous() {
                    return (8 & this.flags) > 0;
                }
                is(name) {
                    if ("string" == typeof name) {
                        if (this.name == name) return !0;
                        let group = this.prop(dist_NodeProp.group);
                        return !!group && group.indexOf(name) > -1;
                    }
                    return this.id == name;
                }
                static match(map) {
                    let direct = Object.create(null);
                    for(let prop in map)for (let name of prop.split(" "))direct[name] = map[prop];
                    return (node)=>{
                        for(let groups = node.prop(dist_NodeProp.group), i = -1; i < (groups ? groups.length : 0); i++){
                            let found = direct[i < 0 ? node.name : groups[i]];
                            if (found) return found;
                        }
                    };
                }
            }
            dist_NodeType.none = new dist_NodeType("", Object.create(null), 0, 8);
            class NodeSet {
                constructor(types){
                    this.types = types;
                    for(let i = 0; i < types.length; i++)if (types[i].id != i) throw new RangeError("Node type ids should correspond to array positions when creating a node set");
                }
                extend(...props) {
                    let newTypes = [];
                    for (let type of this.types){
                        let newProps = null;
                        for (let source of props){
                            let add = source(type);
                            add && (newProps || (newProps = Object.assign({}, type.props)), newProps[add[0].id] = add[1]);
                        }
                        newTypes.push(newProps ? new dist_NodeType(type.name, newProps, type.id, type.flags) : type);
                    }
                    return new NodeSet(newTypes);
                }
            }
            const CachedNode = new WeakMap(), CachedInnerNode = new WeakMap();
            !function(IterMode) {
                IterMode[IterMode.ExcludeBuffers = 1] = "ExcludeBuffers", IterMode[IterMode.IncludeAnonymous = 2] = "IncludeAnonymous", IterMode[IterMode.IgnoreMounts = 4] = "IgnoreMounts", IterMode[IterMode.IgnoreOverlays = 8] = "IgnoreOverlays";
            }(IterMode1 || (IterMode1 = {}));
            class dist_Tree {
                constructor(type, children, positions, length, props){
                    if (this.type = type, this.children = children, this.positions = positions, this.length = length, this.props = null, props && props.length) for (let [prop, value] of (this.props = Object.create(null), props))this.props["number" == typeof prop ? prop : prop.id] = value;
                }
                toString() {
                    let mounted = this.prop(dist_NodeProp.mounted);
                    if (mounted && !mounted.overlay) return mounted.tree.toString();
                    let children = "";
                    for (let ch of this.children){
                        let str = ch.toString();
                        str && (children && (children += ","), children += str);
                    }
                    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (children.length ? "(" + children + ")" : "") : children;
                }
                cursor(mode = 0) {
                    return new TreeCursor(this.topNode, mode);
                }
                cursorAt(pos, side = 0, mode = 0) {
                    let scope = CachedNode.get(this) || this.topNode, cursor = new TreeCursor(scope);
                    return cursor.moveTo(pos, side), CachedNode.set(this, cursor._tree), cursor;
                }
                get topNode() {
                    return new TreeNode(this, 0, 0, null);
                }
                resolve(pos, side = 0) {
                    let node = resolveNode(CachedNode.get(this) || this.topNode, pos, side, !1);
                    return CachedNode.set(this, node), node;
                }
                resolveInner(pos, side = 0) {
                    let node = resolveNode(CachedInnerNode.get(this) || this.topNode, pos, side, !0);
                    return CachedInnerNode.set(this, node), node;
                }
                iterate(spec) {
                    let { enter , leave , from =0 , to =this.length  } = spec;
                    for(let c = this.cursor((spec.mode || 0) | IterMode1.IncludeAnonymous);;){
                        let entered = !1;
                        if (c.from <= to && c.to >= from && (c.type.isAnonymous || !1 !== enter(c))) {
                            if (c.firstChild()) continue;
                            entered = !0;
                        }
                        for(; entered && leave && !c.type.isAnonymous && leave(c), !c.nextSibling();){
                            if (!c.parent()) return;
                            entered = !0;
                        }
                    }
                }
                prop(prop) {
                    return prop.perNode ? this.props ? this.props[prop.id] : void 0 : this.type.prop(prop);
                }
                get propValues() {
                    let result = [];
                    if (this.props) for(let id in this.props)result.push([
                        +id,
                        this.props[id]
                    ]);
                    return result;
                }
                balance(config = {}) {
                    return this.children.length <= 8 ? this : balanceRange(dist_NodeType.none, this.children, this.positions, 0, this.children.length, 0, this.length, (children, positions, length)=>new dist_Tree(this.type, children, positions, length, this.propValues)
                    , config.makeTree || ((children, positions, length)=>new dist_Tree(dist_NodeType.none, children, positions, length)
                    ));
                }
                static build(data) {
                    return buildTree(data);
                }
            }
            dist_Tree.empty = new dist_Tree(dist_NodeType.none, [], [], 0);
            class FlatBufferCursor {
                constructor(buffer, index){
                    this.buffer = buffer, this.index = index;
                }
                get id() {
                    return this.buffer[this.index - 4];
                }
                get start() {
                    return this.buffer[this.index - 3];
                }
                get end() {
                    return this.buffer[this.index - 2];
                }
                get size() {
                    return this.buffer[this.index - 1];
                }
                get pos() {
                    return this.index;
                }
                next() {
                    this.index -= 4;
                }
                fork() {
                    return new FlatBufferCursor(this.buffer, this.index);
                }
            }
            class TreeBuffer {
                constructor(buffer, length, set){
                    this.buffer = buffer, this.length = length, this.set = set;
                }
                get type() {
                    return dist_NodeType.none;
                }
                toString() {
                    let result = [];
                    for(let index = 0; index < this.buffer.length;)result.push(this.childString(index)), index = this.buffer[index + 3];
                    return result.join(",");
                }
                childString(index) {
                    let id = this.buffer[index], endIndex = this.buffer[index + 3], type = this.set.types[id], result = type.name;
                    if (/\W/.test(result) && !type.isError && (result = JSON.stringify(result)), endIndex == (index += 4)) return result;
                    let children = [];
                    for(; index < endIndex;)children.push(this.childString(index)), index = this.buffer[index + 3];
                    return result + "(" + children.join(",") + ")";
                }
                findChild(startIndex, endIndex, dir, pos, side) {
                    let { buffer  } = this, pick = -1;
                    for(let i = startIndex; i != endIndex && (!checkSide(side, pos, buffer[i + 1], buffer[i + 2]) || (pick = i, !(dir > 0))); i = buffer[i + 3]);
                    return pick;
                }
                slice(startI, endI, from, to) {
                    let b = this.buffer, copy = new Uint16Array(endI - startI);
                    for(let i = startI, j = 0; i < endI;)copy[j++] = b[i++], copy[j++] = b[i++] - from, copy[j++] = b[i++] - from, copy[j++] = b[i++] - startI;
                    return new TreeBuffer(copy, to - from, this.set);
                }
            }
            function checkSide(side, pos, from, to) {
                switch(side){
                    case -2:
                        return from < pos;
                    case -1:
                        return to >= pos && from < pos;
                    case 0:
                        return from < pos && to > pos;
                    case 1:
                        return from <= pos && to > pos;
                    case 2:
                        return to > pos;
                    case 4:
                        return !0;
                }
            }
            function enterUnfinishedNodesBefore(node, pos) {
                let scan = node.childBefore(pos);
                for(; scan;){
                    let last = scan.lastChild;
                    if (!last || last.to != scan.to) break;
                    last.type.isError && last.from == last.to ? (node = scan, scan = last.prevSibling) : scan = last;
                }
                return node;
            }
            function resolveNode(node, pos, side, overlays) {
                for(var _a; node.from == node.to || (side < 1 ? node.from >= pos : node.from > pos) || (side > -1 ? node.to <= pos : node.to < pos);){
                    let parent = !overlays && node instanceof TreeNode && node.index < 0 ? null : node.parent;
                    if (!parent) return node;
                    node = parent;
                }
                let mode = overlays ? 0 : IterMode1.IgnoreOverlays;
                if (overlays) for(let scan = node, parent = scan.parent; parent; parent = (scan = parent).parent)scan instanceof TreeNode && scan.index < 0 && (null === (_a = parent.enter(pos, side, mode)) || void 0 === _a ? void 0 : _a.from) != scan.from && (node = parent);
                for(;;){
                    let inner = node.enter(pos, side, mode);
                    if (!inner) return node;
                    node = inner;
                }
            }
            class TreeNode {
                constructor(_tree, from, index, _parent){
                    this._tree = _tree, this.from = from, this.index = index, this._parent = _parent;
                }
                get type() {
                    return this._tree.type;
                }
                get name() {
                    return this._tree.type.name;
                }
                get to() {
                    return this.from + this._tree.length;
                }
                nextChild(i, dir, pos, side, mode = 0) {
                    for(let parent = this;;){
                        for(let { children , positions  } = parent._tree, e = dir > 0 ? children.length : -1; i != e; i += dir){
                            let next = children[i], start = positions[i] + parent.from;
                            if (checkSide(side, pos, start, start + next.length)) {
                                if (next instanceof TreeBuffer) {
                                    if (mode & IterMode1.ExcludeBuffers) continue;
                                    let index = next.findChild(0, next.buffer.length, dir, pos - start, side);
                                    if (index > -1) return new BufferNode(new BufferContext(parent, next, i, start), null, index);
                                } else if (mode & IterMode1.IncludeAnonymous || !next.type.isAnonymous || hasChild1(next)) {
                                    let mounted;
                                    if (!(mode & IterMode1.IgnoreMounts) && next.props && (mounted = next.prop(dist_NodeProp.mounted)) && !mounted.overlay) return new TreeNode(mounted.tree, start, i, parent);
                                    let inner = new TreeNode(next, start, i, parent);
                                    return mode & IterMode1.IncludeAnonymous || !inner.type.isAnonymous ? inner : inner.nextChild(dir < 0 ? next.children.length - 1 : 0, dir, pos, side);
                                }
                            }
                        }
                        if (mode & IterMode1.IncludeAnonymous || !parent.type.isAnonymous || (i = parent.index >= 0 ? parent.index + dir : dir < 0 ? -1 : parent._parent._tree.children.length, parent = parent._parent, !parent)) return null;
                    }
                }
                get firstChild() {
                    return this.nextChild(0, 1, 0, 4);
                }
                get lastChild() {
                    return this.nextChild(this._tree.children.length - 1, -1, 0, 4);
                }
                childAfter(pos) {
                    return this.nextChild(0, 1, pos, 2);
                }
                childBefore(pos) {
                    return this.nextChild(this._tree.children.length - 1, -1, pos, -2);
                }
                enter(pos, side, mode = 0) {
                    let mounted;
                    if (!(mode & IterMode1.IgnoreOverlays) && (mounted = this._tree.prop(dist_NodeProp.mounted)) && mounted.overlay) {
                        let rPos = pos - this.from;
                        for (let { from , to  } of mounted.overlay)if ((side > 0 ? from <= rPos : from < rPos) && (side < 0 ? to >= rPos : to > rPos)) return new TreeNode(mounted.tree, mounted.overlay[0].from + this.from, -1, this);
                    }
                    return this.nextChild(0, 1, pos, side, mode);
                }
                nextSignificantParent() {
                    let val = this;
                    for(; val.type.isAnonymous && val._parent;)val = val._parent;
                    return val;
                }
                get parent() {
                    return this._parent ? this._parent.nextSignificantParent() : null;
                }
                get nextSibling() {
                    return this._parent && this.index >= 0 ? this._parent.nextChild(this.index + 1, 1, 0, 4) : null;
                }
                get prevSibling() {
                    return this._parent && this.index >= 0 ? this._parent.nextChild(this.index - 1, -1, 0, 4) : null;
                }
                cursor(mode = 0) {
                    return new TreeCursor(this, mode);
                }
                get tree() {
                    return this._tree;
                }
                toTree() {
                    return this._tree;
                }
                resolve(pos, side = 0) {
                    return resolveNode(this, pos, side, !1);
                }
                resolveInner(pos, side = 0) {
                    return resolveNode(this, pos, side, !0);
                }
                enterUnfinishedNodesBefore(pos) {
                    return enterUnfinishedNodesBefore(this, pos);
                }
                getChild(type, before = null, after = null) {
                    let r = getChildren(this, type, before, after);
                    return r.length ? r[0] : null;
                }
                getChildren(type, before = null, after = null) {
                    return getChildren(this, type, before, after);
                }
                toString() {
                    return this._tree.toString();
                }
                get node() {
                    return this;
                }
                matchContext(context) {
                    return matchNodeContext(this, context);
                }
            }
            function getChildren(node, type, before, after) {
                let cur = node.cursor(), result = [];
                if (!cur.firstChild()) return result;
                if (null != before) {
                    for(; !cur.type.is(before);)if (!cur.nextSibling()) return result;
                }
                for(;;){
                    if (null != after && cur.type.is(after)) return result;
                    if (cur.type.is(type) && result.push(cur.node), !cur.nextSibling()) return null == after ? result : [];
                }
            }
            function matchNodeContext(node, context, i = context.length - 1) {
                for(let p = node.parent; i >= 0; p = p.parent){
                    if (!p) return !1;
                    if (!p.type.isAnonymous) {
                        if (context[i] && context[i] != p.name) return !1;
                        i--;
                    }
                }
                return !0;
            }
            class BufferContext {
                constructor(parent, buffer, index, start){
                    this.parent = parent, this.buffer = buffer, this.index = index, this.start = start;
                }
            }
            class BufferNode {
                constructor(context, _parent, index){
                    this.context = context, this._parent = _parent, this.index = index, this.type = context.buffer.set.types[context.buffer.buffer[index]];
                }
                get name() {
                    return this.type.name;
                }
                get from() {
                    return this.context.start + this.context.buffer.buffer[this.index + 1];
                }
                get to() {
                    return this.context.start + this.context.buffer.buffer[this.index + 2];
                }
                child(dir, pos, side) {
                    let { buffer  } = this.context, index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.context.start, side);
                    return index < 0 ? null : new BufferNode(this.context, this, index);
                }
                get firstChild() {
                    return this.child(1, 0, 4);
                }
                get lastChild() {
                    return this.child(-1, 0, 4);
                }
                childAfter(pos) {
                    return this.child(1, pos, 2);
                }
                childBefore(pos) {
                    return this.child(-1, pos, -2);
                }
                enter(pos, side, mode = 0) {
                    if (mode & IterMode1.ExcludeBuffers) return null;
                    let { buffer  } = this.context, index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], side > 0 ? 1 : -1, pos - this.context.start, side);
                    return index < 0 ? null : new BufferNode(this.context, this, index);
                }
                get parent() {
                    return this._parent || this.context.parent.nextSignificantParent();
                }
                externalSibling(dir) {
                    return this._parent ? null : this.context.parent.nextChild(this.context.index + dir, dir, 0, 4);
                }
                get nextSibling() {
                    let { buffer  } = this.context, after = buffer.buffer[this.index + 3];
                    return after < (this._parent ? buffer.buffer[this._parent.index + 3] : buffer.buffer.length) ? new BufferNode(this.context, this._parent, after) : this.externalSibling(1);
                }
                get prevSibling() {
                    let { buffer  } = this.context, parentStart = this._parent ? this._parent.index + 4 : 0;
                    return this.index == parentStart ? this.externalSibling(-1) : new BufferNode(this.context, this._parent, buffer.findChild(parentStart, this.index, -1, 0, 4));
                }
                cursor(mode = 0) {
                    return new TreeCursor(this, mode);
                }
                get tree() {
                    return null;
                }
                toTree() {
                    let children = [], positions = [], { buffer  } = this.context, startI = this.index + 4, endI = buffer.buffer[this.index + 3];
                    if (endI > startI) {
                        let from = buffer.buffer[this.index + 1], to = buffer.buffer[this.index + 2];
                        children.push(buffer.slice(startI, endI, from, to)), positions.push(0);
                    }
                    return new dist_Tree(this.type, children, positions, this.to - this.from);
                }
                resolve(pos, side = 0) {
                    return resolveNode(this, pos, side, !1);
                }
                resolveInner(pos, side = 0) {
                    return resolveNode(this, pos, side, !0);
                }
                enterUnfinishedNodesBefore(pos) {
                    return enterUnfinishedNodesBefore(this, pos);
                }
                toString() {
                    return this.context.buffer.childString(this.index);
                }
                getChild(type, before = null, after = null) {
                    let r = getChildren(this, type, before, after);
                    return r.length ? r[0] : null;
                }
                getChildren(type, before = null, after = null) {
                    return getChildren(this, type, before, after);
                }
                get node() {
                    return this;
                }
                matchContext(context) {
                    return matchNodeContext(this, context);
                }
            }
            class TreeCursor {
                constructor(node, mode = 0){
                    if (this.mode = mode, this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, node instanceof TreeNode) this.yieldNode(node);
                    else {
                        this._tree = node.context.parent, this.buffer = node.context;
                        for(let n = node._parent; n; n = n._parent)this.stack.unshift(n.index);
                        this.bufferNode = node, this.yieldBuf(node.index);
                    }
                }
                get name() {
                    return this.type.name;
                }
                yieldNode(node) {
                    return !!node && (this._tree = node, this.type = node.type, this.from = node.from, this.to = node.to, !0);
                }
                yieldBuf(index, type) {
                    this.index = index;
                    let { start , buffer  } = this.buffer;
                    return this.type = type || buffer.set.types[buffer.buffer[index]], this.from = start + buffer.buffer[index + 1], this.to = start + buffer.buffer[index + 2], !0;
                }
                yield(node) {
                    return !!node && (node instanceof TreeNode ? (this.buffer = null, this.yieldNode(node)) : (this.buffer = node.context, this.yieldBuf(node.index, node.type)));
                }
                toString() {
                    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
                }
                enterChild(dir, pos, side) {
                    if (!this.buffer) return this.yield(this._tree.nextChild(dir < 0 ? this._tree._tree.children.length - 1 : 0, dir, pos, side, this.mode));
                    let { buffer  } = this.buffer, index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, pos - this.buffer.start, side);
                    return !(index < 0) && (this.stack.push(this.index), this.yieldBuf(index));
                }
                firstChild() {
                    return this.enterChild(1, 0, 4);
                }
                lastChild() {
                    return this.enterChild(-1, 0, 4);
                }
                childAfter(pos) {
                    return this.enterChild(1, pos, 2);
                }
                childBefore(pos) {
                    return this.enterChild(-1, pos, -2);
                }
                enter(pos, side, mode = this.mode) {
                    return this.buffer ? !(mode & IterMode1.ExcludeBuffers) && this.enterChild(1, pos, side) : this.yield(this._tree.enter(pos, side, mode));
                }
                parent() {
                    if (!this.buffer) return this.yieldNode(this.mode & IterMode1.IncludeAnonymous ? this._tree._parent : this._tree.parent);
                    if (this.stack.length) return this.yieldBuf(this.stack.pop());
                    let parent = this.mode & IterMode1.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
                    return this.buffer = null, this.yieldNode(parent);
                }
                sibling(dir) {
                    if (!this.buffer) return !!this._tree._parent && this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + dir, dir, 0, 4, this.mode));
                    let { buffer  } = this.buffer, d = this.stack.length - 1;
                    if (dir < 0) {
                        let parentStart = d < 0 ? 0 : this.stack[d] + 4;
                        if (this.index != parentStart) return this.yieldBuf(buffer.findChild(parentStart, this.index, -1, 0, 4));
                    } else {
                        let after = buffer.buffer[this.index + 3];
                        if (after < (d < 0 ? buffer.buffer.length : buffer.buffer[this.stack[d] + 3])) return this.yieldBuf(after);
                    }
                    return d < 0 && this.yield(this.buffer.parent.nextChild(this.buffer.index + dir, dir, 0, 4, this.mode));
                }
                nextSibling() {
                    return this.sibling(1);
                }
                prevSibling() {
                    return this.sibling(-1);
                }
                atLastNode(dir) {
                    let index, parent, { buffer  } = this;
                    if (buffer) {
                        if (dir > 0) {
                            if (this.index < buffer.buffer.buffer.length) return !1;
                        } else for(let i = 0; i < this.index; i++)if (buffer.buffer.buffer[i + 3] < this.index) return !1;
                        ({ index , parent  } = buffer);
                    } else ({ index , _parent: parent  } = this._tree);
                    for(; parent; { index , _parent: parent  } = parent)if (index > -1) for(let i = index + dir, e = dir < 0 ? -1 : parent._tree.children.length; i != e; i += dir){
                        let child = parent._tree.children[i];
                        if (this.mode & IterMode1.IncludeAnonymous || child instanceof TreeBuffer || !child.type.isAnonymous || hasChild1(child)) return !1;
                    }
                    return !0;
                }
                move(dir, enter) {
                    if (enter && this.enterChild(dir, 0, 4)) return !0;
                    for(;;){
                        if (this.sibling(dir)) return !0;
                        if (this.atLastNode(dir) || !this.parent()) return !1;
                    }
                }
                next(enter = !0) {
                    return this.move(1, enter);
                }
                prev(enter = !0) {
                    return this.move(-1, enter);
                }
                moveTo(pos, side = 0) {
                    for(; (this.from == this.to || (side < 1 ? this.from >= pos : this.from > pos) || (side > -1 ? this.to <= pos : this.to < pos)) && this.parent(););
                    for(; this.enterChild(1, pos, side););
                    return this;
                }
                get node() {
                    if (!this.buffer) return this._tree;
                    let cache = this.bufferNode, result = null, depth = 0;
                    if (cache && cache.context == this.buffer) scan: for(let index = this.index, d = this.stack.length; d >= 0;){
                        for(let c = cache; c; c = c._parent)if (c.index == index) {
                            if (index == this.index) return c;
                            result = c, depth = d + 1;
                            break scan;
                        }
                        index = this.stack[--d];
                    }
                    for(let i = depth; i < this.stack.length; i++)result = new BufferNode(this.buffer, result, this.stack[i]);
                    return this.bufferNode = new BufferNode(this.buffer, result, this.index);
                }
                get tree() {
                    return this.buffer ? null : this._tree._tree;
                }
                iterate(enter, leave) {
                    for(let depth = 0;;){
                        let mustLeave = !1;
                        if (this.type.isAnonymous || !1 !== enter(this)) {
                            if (this.firstChild()) {
                                depth++;
                                continue;
                            }
                            this.type.isAnonymous || (mustLeave = !0);
                        }
                        for(; mustLeave && leave && leave(this), mustLeave = this.type.isAnonymous, !this.nextSibling();){
                            if (!depth) return;
                            this.parent(), depth--, mustLeave = !0;
                        }
                    }
                }
                matchContext(context) {
                    if (!this.buffer) return matchNodeContext(this.node, context);
                    let { buffer  } = this.buffer, { types  } = buffer.set;
                    for(let i = context.length - 1, d = this.stack.length - 1; i >= 0; d--){
                        if (d < 0) return matchNodeContext(this.node, context, i);
                        let type = types[buffer.buffer[this.stack[d]]];
                        if (!type.isAnonymous) {
                            if (context[i] && context[i] != type.name) return !1;
                            i--;
                        }
                    }
                    return !0;
                }
            }
            function hasChild1(tree) {
                return tree.children.some((ch)=>ch instanceof TreeBuffer || !ch.type.isAnonymous || hasChild1(ch)
                );
            }
            function buildTree(data1) {
                var _a;
                let { buffer: buffer1 , nodeSet , maxBufferLength =DefaultBufferLength , reused =[] , minRepeatType =nodeSet.types.length ,  } = data1, cursor = Array.isArray(buffer1) ? new FlatBufferCursor(buffer1, buffer1.length) : buffer1, types = nodeSet.types, contextHash = 0, lookAhead1 = 0;
                function takeNode(parentStart, minPos, children, positions, inRepeat) {
                    let { id , start , end , size  } = cursor, lookAheadAtStart = lookAhead1;
                    for(; size < 0;){
                        if (cursor.next(), -1 == size) {
                            let node = reused[id];
                            children.push(node), positions.push(start - parentStart);
                            return;
                        }
                        if (-3 == size) {
                            contextHash = id;
                            return;
                        }
                        if (-4 == size) {
                            lookAhead1 = id;
                            return;
                        }
                        throw new RangeError(`Unrecognized record size: ${size}`);
                    }
                    let type = types[id], node, buffer, startPos = start - parentStart;
                    if (end - start <= maxBufferLength && (buffer = findBufferSize(cursor.pos - minPos, inRepeat))) {
                        let data = new Uint16Array(buffer.size - buffer.skip), endPos = cursor.pos - buffer.size, index = data.length;
                        for(; cursor.pos > endPos;)index = copyToBuffer(buffer.start, data, index);
                        node = new TreeBuffer(data, end - buffer.start, nodeSet), startPos = buffer.start - parentStart;
                    } else {
                        let endPos = cursor.pos - size;
                        cursor.next();
                        let localChildren = [], localPositions = [], localInRepeat = id >= minRepeatType ? id : -1, lastGroup = 0, lastEnd = end;
                        for(; cursor.pos > endPos;)localInRepeat >= 0 && cursor.id == localInRepeat && cursor.size >= 0 ? (cursor.end <= lastEnd - maxBufferLength && (makeRepeatLeaf(localChildren, localPositions, start, lastGroup, cursor.end, lastEnd, localInRepeat, lookAheadAtStart), lastGroup = localChildren.length, lastEnd = cursor.end), cursor.next()) : takeNode(start, endPos, localChildren, localPositions, localInRepeat);
                        if (localInRepeat >= 0 && lastGroup > 0 && lastGroup < localChildren.length && makeRepeatLeaf(localChildren, localPositions, start, lastGroup, start, lastEnd, localInRepeat, lookAheadAtStart), localChildren.reverse(), localPositions.reverse(), localInRepeat > -1 && lastGroup > 0) {
                            let make = makeBalanced(type);
                            node = balanceRange(type, localChildren, localPositions, 0, localChildren.length, 0, end - start, make, make);
                        } else node = makeTree(type, localChildren, localPositions, end - start, lookAheadAtStart - end);
                    }
                    children.push(node), positions.push(startPos);
                }
                function makeBalanced(type) {
                    return (children, positions, length)=>{
                        let lookAhead = 0, lastI = children.length - 1, last, lookAheadProp;
                        if (lastI >= 0 && (last = children[lastI]) instanceof dist_Tree) {
                            if (!lastI && last.type == type && last.length == length) return last;
                            (lookAheadProp = last.prop(dist_NodeProp.lookAhead)) && (lookAhead = positions[lastI] + last.length + lookAheadProp);
                        }
                        return makeTree(type, children, positions, length, lookAhead);
                    };
                }
                function makeRepeatLeaf(children, positions, base, i, from, to, type, lookAhead) {
                    let localChildren = [], localPositions = [];
                    for(; children.length > i;)localChildren.push(children.pop()), localPositions.push(positions.pop() + base - from);
                    children.push(makeTree(nodeSet.types[type], localChildren, localPositions, to - from, lookAhead - to)), positions.push(from - base);
                }
                function makeTree(type, children, positions, length, lookAhead = 0, props) {
                    if (contextHash) {
                        let pair = [
                            dist_NodeProp.contextHash,
                            contextHash
                        ];
                        props = props ? [
                            pair
                        ].concat(props) : [
                            pair
                        ];
                    }
                    if (lookAhead > 25) {
                        let pair = [
                            dist_NodeProp.lookAhead,
                            lookAhead
                        ];
                        props = props ? [
                            pair
                        ].concat(props) : [
                            pair
                        ];
                    }
                    return new dist_Tree(type, children, positions, length, props);
                }
                function findBufferSize(maxSize, inRepeat) {
                    let fork = cursor.fork(), size = 0, start = 0, skip = 0, minStart = fork.end - maxBufferLength, result = {
                        size: 0,
                        start: 0,
                        skip: 0
                    };
                    scan: for(let minPos = fork.pos - maxSize; fork.pos > minPos;){
                        let nodeSize = fork.size;
                        if (fork.id == inRepeat && nodeSize >= 0) {
                            result.size = size, result.start = start, result.skip = skip, skip += 4, size += 4, fork.next();
                            continue;
                        }
                        let startPos = fork.pos - nodeSize;
                        if (nodeSize < 0 || startPos < minPos || fork.start < minStart) break;
                        let localSkipped = fork.id >= minRepeatType ? 4 : 0, nodeStart = fork.start;
                        for(fork.next(); fork.pos > startPos;){
                            if (fork.size < 0) {
                                if (-3 == fork.size) localSkipped += 4;
                                else break scan;
                            } else fork.id >= minRepeatType && (localSkipped += 4);
                            fork.next();
                        }
                        start = nodeStart, size += nodeSize, skip += localSkipped;
                    }
                    return (inRepeat < 0 || size == maxSize) && (result.size = size, result.start = start, result.skip = skip), result.size > 4 ? result : void 0;
                }
                function copyToBuffer(bufferStart, buffer, index) {
                    let { id , start , end , size  } = cursor;
                    if (cursor.next(), size >= 0 && id < minRepeatType) {
                        let startIndex = index;
                        if (size > 4) {
                            let endPos = cursor.pos - (size - 4);
                            for(; cursor.pos > endPos;)index = copyToBuffer(bufferStart, buffer, index);
                        }
                        buffer[--index] = startIndex, buffer[--index] = end - bufferStart, buffer[--index] = start - bufferStart, buffer[--index] = id;
                    } else -3 == size ? contextHash = id : -4 == size && (lookAhead1 = id);
                    return index;
                }
                let children1 = [], positions1 = [];
                for(; cursor.pos > 0;)takeNode(data1.start || 0, data1.bufferStart || 0, children1, positions1, -1);
                let length1 = null !== (_a = data1.length) && void 0 !== _a ? _a : children1.length ? positions1[0] + children1[0].length : 0;
                return new dist_Tree(types[data1.topID], children1.reverse(), positions1.reverse(), length1);
            }
            const nodeSizeCache = new WeakMap();
            function nodeSize1(balanceType, node) {
                if (!balanceType.isAnonymous || node instanceof TreeBuffer || node.type != balanceType) return 1;
                let size = nodeSizeCache.get(node);
                if (null == size) {
                    for (let child of (size = 1, node.children)){
                        if (child.type != balanceType || !(child instanceof dist_Tree)) {
                            size = 1;
                            break;
                        }
                        size += nodeSize1(balanceType, child);
                    }
                    nodeSizeCache.set(node, size);
                }
                return size;
            }
            function balanceRange(balanceType, children2, positions2, from1, to1, start, length2, mkTop, mkTree) {
                let total = 0;
                for(let i1 = from1; i1 < to1; i1++)total += nodeSize1(balanceType, children2[i1]);
                let maxChild = Math.ceil(1.5 * total / 8), localChildren = [], localPositions = [];
                function divide(children, positions, from, to, offset) {
                    for(let i = from; i < to;){
                        let groupFrom = i, groupStart = positions[i], groupSize = nodeSize1(balanceType, children[i]);
                        for(i++; i < to; i++){
                            let nextSize = nodeSize1(balanceType, children[i]);
                            if (groupSize + nextSize >= maxChild) break;
                            groupSize += nextSize;
                        }
                        if (i == groupFrom + 1) {
                            if (groupSize > maxChild) {
                                let only = children[groupFrom];
                                divide(only.children, only.positions, 0, only.children.length, positions[groupFrom] + offset);
                                continue;
                            }
                            localChildren.push(children[groupFrom]);
                        } else {
                            let length = positions[i - 1] + children[i - 1].length - groupStart;
                            localChildren.push(balanceRange(balanceType, children, positions, groupFrom, i, groupStart, length, null, mkTree));
                        }
                        localPositions.push(groupStart + offset - start);
                    }
                }
                return divide(children2, positions2, from1, to1, 0), (mkTop || mkTree)(localChildren, localPositions, length2);
            }
            class TreeFragment {
                constructor(from, to, tree, offset, openStart = !1, openEnd = !1){
                    this.from = from, this.to = to, this.tree = tree, this.offset = offset, this.open = (openStart ? 1 : 0) | (openEnd ? 2 : 0);
                }
                get openStart() {
                    return (1 & this.open) > 0;
                }
                get openEnd() {
                    return (2 & this.open) > 0;
                }
                static addTree(tree, fragments = [], partial = !1) {
                    let result = [
                        new TreeFragment(0, tree.length, tree, 0, !1, partial), 
                    ];
                    for (let f of fragments)f.to > tree.length && result.push(f);
                    return result;
                }
                static applyChanges(fragments, changes, minGap = 128) {
                    if (!changes.length) return fragments;
                    let result = [], fI = 1, nextF = fragments.length ? fragments[0] : null;
                    for(let cI = 0, pos = 0, off = 0;; cI++){
                        let nextC = cI < changes.length ? changes[cI] : null, nextPos = nextC ? nextC.fromA : 1e9;
                        if (nextPos - pos >= minGap) for(; nextF && nextF.from < nextPos;){
                            let cut = nextF;
                            if (pos >= cut.from || nextPos <= cut.to || off) {
                                let fFrom = Math.max(cut.from, pos) - off, fTo = Math.min(cut.to, nextPos) - off;
                                cut = fFrom >= fTo ? null : new TreeFragment(fFrom, fTo, cut.tree, cut.offset + off, cI > 0, !!nextC);
                            }
                            if (cut && result.push(cut), nextF.to > nextPos) break;
                            nextF = fI < fragments.length ? fragments[fI++] : null;
                        }
                        if (!nextC) break;
                        pos = nextC.toA, off = nextC.toA - nextC.toB;
                    }
                    return result;
                }
            }
            class dist_Parser {
                startParse(input, fragments, ranges) {
                    return "string" == typeof input && (input = new StringInput(input)), ranges = ranges ? ranges.length ? ranges.map((r)=>new Range(r.from, r.to)
                    ) : [
                        new Range(0, 0)
                    ] : [
                        new Range(0, input.length)
                    ], this.createParse(input, fragments || [], ranges);
                }
                parse(input, fragments, ranges) {
                    let parse = this.startParse(input, fragments, ranges);
                    for(;;){
                        let done = parse.advance();
                        if (done) return done;
                    }
                }
            }
            class StringInput {
                constructor(string){
                    this.string = string;
                }
                get length() {
                    return this.string.length;
                }
                chunk(from) {
                    return this.string.slice(from);
                }
                get lineChunks() {
                    return !1;
                }
                read(from, to) {
                    return this.string.slice(from, to);
                }
            }
            new dist_NodeProp({
                perNode: !0
            });
            let nextTagID = 0;
            class Tag {
                constructor(set, base, modified){
                    this.set = set, this.base = base, this.modified = modified, this.id = nextTagID++;
                }
                static define(parent) {
                    if (null == parent ? void 0 : parent.base) throw new Error("Can not derive from a modified tag");
                    let tag = new Tag([], null, []);
                    if (tag.set.push(tag), parent) for (let t of parent.set)tag.set.push(t);
                    return tag;
                }
                static defineModifier() {
                    let mod = new Modifier();
                    return (tag)=>tag.modified.indexOf(mod) > -1 ? tag : Modifier.get(tag.base || tag, tag.modified.concat(mod).sort((a, b)=>a.id - b.id
                        ))
                    ;
                }
            }
            let nextModifierID = 0;
            class Modifier {
                constructor(){
                    this.instances = [], this.id = nextModifierID++;
                }
                static get(base, mods) {
                    if (!mods.length) return base;
                    let exists = mods[0].instances.find((t)=>t.base == base && sameArray(mods, t.modified)
                    );
                    if (exists) return exists;
                    let set = [], tag = new Tag(set, base, mods);
                    for (let m of mods)m.instances.push(tag);
                    let configs = permute(mods);
                    for (let parent of base.set)for (let config of configs)set.push(Modifier.get(parent, config));
                    return tag;
                }
            }
            function sameArray(a, b) {
                return a.length == b.length && a.every((x, i)=>x == b[i]
                );
            }
            function permute(array) {
                let result = [
                    array
                ];
                for(let i = 0; i < array.length; i++)for (let a of permute(array.slice(0, i).concat(array.slice(i + 1))))result.push(a);
                return result;
            }
            function styleTags(spec) {
                let byName = Object.create(null);
                for(let prop in spec){
                    let tags = spec[prop];
                    for (let part of (Array.isArray(tags) || (tags = [
                        tags
                    ]), prop.split(" ")))if (part) {
                        let pieces = [], mode = 2, rest = part;
                        for(let pos = 0;;){
                            if ("..." == rest && pos > 0 && pos + 3 == part.length) {
                                mode = 1;
                                break;
                            }
                            let m = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(rest);
                            if (!m) throw new RangeError("Invalid path: " + part);
                            if (pieces.push("*" == m[0] ? "" : '"' == m[0][0] ? JSON.parse(m[0]) : m[0]), (pos += m[0].length) == part.length) break;
                            let next = part[pos++];
                            if (pos == part.length && "!" == next) {
                                mode = 0;
                                break;
                            }
                            if ("/" != next) throw new RangeError("Invalid path: " + part);
                            rest = part.slice(pos);
                        }
                        let last = pieces.length - 1, inner = pieces[last];
                        if (!inner) throw new RangeError("Invalid path: " + part);
                        let rule = new Rule(tags, mode, last > 0 ? pieces.slice(0, last) : null);
                        byName[inner] = rule.sort(byName[inner]);
                    }
                }
                return ruleNodeProp.add(byName);
            }
            const ruleNodeProp = new dist_NodeProp();
            class Rule {
                constructor(tags, mode, context, next){
                    this.tags = tags, this.mode = mode, this.context = context, this.next = next;
                }
                sort(other) {
                    return !other || other.depth < this.depth ? (this.next = other, this) : (other.next = this.sort(other.next), other);
                }
                get depth() {
                    return this.context ? this.context.length : 0;
                }
            }
            function tagHighlighter(tags2, options) {
                let map = Object.create(null);
                for (let style of tags2)if (Array.isArray(style.tag)) for (let tag1 of style.tag)map[tag1.id] = style.class;
                else map[style.tag.id] = style.class;
                let { scope , all =null  } = options || {};
                return {
                    style (tags) {
                        let cls = all;
                        for (let tag of tags)for (let sub of tag.set){
                            let tagClass = map[sub.id];
                            if (tagClass) {
                                cls = cls ? cls + " " + tagClass : tagClass;
                                break;
                            }
                        }
                        return cls;
                    },
                    scope: scope
                };
            }
            function highlightTags(highlighters, tags) {
                let result = null;
                for (let highlighter of highlighters){
                    let value = highlighter.style(tags);
                    value && (result = result ? result + " " + value : value);
                }
                return result;
            }
            function highlightTree(tree, highlighter, putStyle, from = 0, to = tree.length) {
                let builder = new HighlightBuilder(from, Array.isArray(highlighter) ? highlighter : [
                    highlighter
                ], putStyle);
                builder.highlightRange(tree.cursor(), from, to, "", builder.highlighters), builder.flush(to);
            }
            class HighlightBuilder {
                constructor(at, highlighters, span){
                    this.at = at, this.highlighters = highlighters, this.span = span, this.class = "";
                }
                startSpan(at, cls) {
                    cls != this.class && (this.flush(at), at > this.at && (this.at = at), this.class = cls);
                }
                flush(to) {
                    to > this.at && this.class && this.span(this.at, to, this.class);
                }
                highlightRange(cursor, from, to, inheritedClass, highlighters) {
                    let { type , from: start , to: end  } = cursor;
                    if (start >= to || end <= from) return;
                    type.isTop && (highlighters = this.highlighters.filter((h)=>!h.scope || h.scope(type)
                    ));
                    let cls = inheritedClass, rule = type.prop(ruleNodeProp), opaque = !1;
                    for(; rule;){
                        if (!rule.context || cursor.matchContext(rule.context)) {
                            let tagCls = highlightTags(highlighters, rule.tags);
                            tagCls && (cls && (cls += " "), cls += tagCls, 1 == rule.mode ? inheritedClass += (inheritedClass ? " " : "") + tagCls : 0 == rule.mode && (opaque = !0));
                            break;
                        }
                        rule = rule.next;
                    }
                    if (this.startSpan(cursor.from, cls), opaque) return;
                    let mounted = cursor.tree && cursor.tree.prop(dist_NodeProp.mounted);
                    if (mounted && mounted.overlay) {
                        let inner = cursor.node.enter(mounted.overlay[0].from + start, 1), innerHighlighters = this.highlighters.filter((h)=>!h.scope || h.scope(mounted.tree.type)
                        ), hasChild = cursor.firstChild();
                        for(let i = 0, pos = start;; i++){
                            let next = i < mounted.overlay.length ? mounted.overlay[i] : null, nextPos = next ? next.from + start : end, rangeFrom = Math.max(from, pos), rangeTo = Math.min(to, nextPos);
                            if (rangeFrom < rangeTo && hasChild) for(; cursor.from < rangeTo && (this.highlightRange(cursor, rangeFrom, rangeTo, inheritedClass, highlighters), this.startSpan(Math.min(to, cursor.to), cls), !(cursor.to >= nextPos) && cursor.nextSibling()););
                            if (!next || nextPos > to) break;
                            (pos = next.to + start) > from && (this.highlightRange(inner.cursor(), Math.max(from, next.from + start), Math.min(to, pos), inheritedClass, innerHighlighters), this.startSpan(pos, cls));
                        }
                        hasChild && cursor.parent();
                    } else if (cursor.firstChild()) {
                        do {
                            if (cursor.to <= from) continue;
                            if (cursor.from >= to) break;
                            this.highlightRange(cursor, from, to, inheritedClass, highlighters), this.startSpan(Math.min(to, cursor.to), cls);
                        }while (cursor.nextSibling())
                        cursor.parent();
                    }
                }
            }
            const t1 = Tag.define, comment1 = t1(), dist_name = t1(), typeName = t1(dist_name), propertyName = t1(dist_name), literal = t1(), string1 = t1(literal), number = t1(literal), content1 = t1(), heading = t1(content1), keyword = t1(), operator = t1(), punctuation = t1(), bracket1 = t1(punctuation), meta = t1(), tags1 = {
                comment: comment1,
                lineComment: t1(comment1),
                blockComment: t1(comment1),
                docComment: t1(comment1),
                name: dist_name,
                variableName: t1(dist_name),
                typeName: typeName,
                tagName: t1(typeName),
                propertyName: propertyName,
                attributeName: t1(propertyName),
                className: t1(dist_name),
                labelName: t1(dist_name),
                namespace: t1(dist_name),
                macroName: t1(dist_name),
                literal,
                string: string1,
                docString: t1(string1),
                character: t1(string1),
                attributeValue: t1(string1),
                number,
                integer: t1(number),
                float: t1(number),
                bool: t1(literal),
                regexp: t1(literal),
                escape: t1(literal),
                color: t1(literal),
                url: t1(literal),
                keyword,
                self: t1(keyword),
                null: t1(keyword),
                atom: t1(keyword),
                unit: t1(keyword),
                modifier: t1(keyword),
                operatorKeyword: t1(keyword),
                controlKeyword: t1(keyword),
                definitionKeyword: t1(keyword),
                moduleKeyword: t1(keyword),
                operator,
                derefOperator: t1(operator),
                arithmeticOperator: t1(operator),
                logicOperator: t1(operator),
                bitwiseOperator: t1(operator),
                compareOperator: t1(operator),
                updateOperator: t1(operator),
                definitionOperator: t1(operator),
                typeOperator: t1(operator),
                controlOperator: t1(operator),
                punctuation,
                separator: t1(punctuation),
                bracket: bracket1,
                angleBracket: t1(bracket1),
                squareBracket: t1(bracket1),
                paren: t1(bracket1),
                brace: t1(bracket1),
                content: content1,
                heading,
                heading1: t1(heading),
                heading2: t1(heading),
                heading3: t1(heading),
                heading4: t1(heading),
                heading5: t1(heading),
                heading6: t1(heading),
                contentSeparator: t1(content1),
                list: t1(content1),
                quote: t1(content1),
                emphasis: t1(content1),
                strong: t1(content1),
                link: t1(content1),
                monospace: t1(content1),
                strikethrough: t1(content1),
                inserted: t1(),
                deleted: t1(),
                changed: t1(),
                invalid: t1(),
                meta,
                documentMeta: t1(meta),
                annotation: t1(meta),
                processingInstruction: t1(meta),
                definition: Tag.defineModifier(),
                constant: Tag.defineModifier(),
                function: Tag.defineModifier(),
                standard: Tag.defineModifier(),
                local: Tag.defineModifier(),
                special: Tag.defineModifier()
            };
            tagHighlighter([
                {
                    tag: tags1.link,
                    class: "tok-link"
                },
                {
                    tag: tags1.heading,
                    class: "tok-heading"
                },
                {
                    tag: tags1.emphasis,
                    class: "tok-emphasis"
                },
                {
                    tag: tags1.strong,
                    class: "tok-strong"
                },
                {
                    tag: tags1.keyword,
                    class: "tok-keyword"
                },
                {
                    tag: tags1.atom,
                    class: "tok-atom"
                },
                {
                    tag: tags1.bool,
                    class: "tok-bool"
                },
                {
                    tag: tags1.url,
                    class: "tok-url"
                },
                {
                    tag: tags1.labelName,
                    class: "tok-labelName"
                },
                {
                    tag: tags1.inserted,
                    class: "tok-inserted"
                },
                {
                    tag: tags1.deleted,
                    class: "tok-deleted"
                },
                {
                    tag: tags1.literal,
                    class: "tok-literal"
                },
                {
                    tag: tags1.string,
                    class: "tok-string"
                },
                {
                    tag: tags1.number,
                    class: "tok-number"
                },
                {
                    tag: [
                        tags1.regexp,
                        tags1.escape,
                        tags1.special(tags1.string)
                    ],
                    class: "tok-string2"
                },
                {
                    tag: tags1.variableName,
                    class: "tok-variableName"
                },
                {
                    tag: tags1.local(tags1.variableName),
                    class: "tok-variableName tok-local"
                },
                {
                    tag: tags1.definition(tags1.variableName),
                    class: "tok-variableName tok-definition"
                },
                {
                    tag: tags1.special(tags1.variableName),
                    class: "tok-variableName2"
                },
                {
                    tag: tags1.definition(tags1.propertyName),
                    class: "tok-propertyName tok-definition"
                },
                {
                    tag: tags1.typeName,
                    class: "tok-typeName"
                },
                {
                    tag: tags1.namespace,
                    class: "tok-namespace"
                },
                {
                    tag: tags1.className,
                    class: "tok-className"
                },
                {
                    tag: tags1.macroName,
                    class: "tok-macroName"
                },
                {
                    tag: tags1.propertyName,
                    class: "tok-propertyName"
                },
                {
                    tag: tags1.operator,
                    class: "tok-operator"
                },
                {
                    tag: tags1.comment,
                    class: "tok-comment"
                },
                {
                    tag: tags1.meta,
                    class: "tok-meta"
                },
                {
                    tag: tags1.invalid,
                    class: "tok-invalid"
                },
                {
                    tag: tags1.punctuation,
                    class: "tok-punctuation"
                }, 
            ]);
            var style_mod = __webpack_require__(8699);
            const languageDataProp = new dist_NodeProp();
            function defineLanguageFacet(baseData) {
                return Facet.define({
                    combine: baseData ? (values)=>values.concat(baseData)
                     : void 0
                });
            }
            class Language {
                constructor(data, parser, extraExtensions = []){
                    this.data = data, state_dist.yy.prototype.hasOwnProperty("tree") || Object.defineProperty(state_dist.yy.prototype, "tree", {
                        get () {
                            return dist_syntaxTree(this);
                        }
                    }), this.parser = parser, this.extension = [
                        language.of(this),
                        state_dist.yy.languageData.of((state, pos, side)=>state.facet(languageDataFacetAt(state, pos, side))
                        ), 
                    ].concat(extraExtensions);
                }
                isActiveAt(state, pos, side = -1) {
                    return languageDataFacetAt(state, pos, side) == this.data;
                }
                findRegions(state) {
                    let lang = state.facet(language);
                    if ((null == lang ? void 0 : lang.data) == this.data) return [
                        {
                            from: 0,
                            to: state.doc.length
                        }
                    ];
                    if (!lang || !lang.allowsNesting) return [];
                    let result = [], explore = (tree, from)=>{
                        if (tree.prop(languageDataProp) == this.data) {
                            result.push({
                                from,
                                to: from + tree.length
                            });
                            return;
                        }
                        let mount = tree.prop(dist_NodeProp.mounted);
                        if (mount) {
                            if (mount.tree.prop(languageDataProp) == this.data) {
                                if (mount.overlay) for (let r of mount.overlay)result.push({
                                    from: r.from + from,
                                    to: r.to + from
                                });
                                else result.push({
                                    from: from,
                                    to: from + tree.length
                                });
                                return;
                            }
                            if (mount.overlay) {
                                let size = result.length;
                                if (explore(mount.tree, mount.overlay[0].from + from), result.length > size) return;
                            }
                        }
                        for(let i = 0; i < tree.children.length; i++){
                            let ch = tree.children[i];
                            ch instanceof dist_Tree && explore(ch, tree.positions[i] + from);
                        }
                    };
                    return explore(dist_syntaxTree(state), 0), result;
                }
                get allowsNesting() {
                    return !0;
                }
            }
            function languageDataFacetAt(state, pos, side) {
                let topLang = state.facet(language);
                if (!topLang) return null;
                let facet = topLang.data;
                if (topLang.allowsNesting) for(let node = dist_syntaxTree(state).topNode; node; node = node.enter(pos, side, IterMode1.ExcludeBuffers))facet = node.type.prop(languageDataProp) || facet;
                return facet;
            }
            Language.setState = state_dist.Py.define();
            class LRLanguage extends null {
                constructor(data, parser){
                    super(data, parser), this.parser = parser;
                }
                static define(spec) {
                    let data = defineLanguageFacet(spec.languageData);
                    return new LRLanguage(data, spec.parser.configure({
                        props: [
                            languageDataProp.add((type)=>type.isTop ? data : void 0
                            ), 
                        ]
                    }));
                }
                configure(options) {
                    return new LRLanguage(this.data, this.parser.configure(options));
                }
                get allowsNesting() {
                    return this.parser.hasWrappers();
                }
            }
            function dist_syntaxTree(state) {
                let field = state.field(Language.state, !1);
                return field ? field.tree : dist_Tree.empty;
            }
            class DocInput {
                constructor(doc, length = doc.length){
                    this.doc = doc, this.length = length, this.cursorPos = 0, this.string = "", this.cursor = doc.iter();
                }
                syncTo(pos) {
                    return this.string = this.cursor.next(pos - this.cursorPos).value, this.cursorPos = pos + this.string.length, this.cursorPos - this.string.length;
                }
                chunk(pos) {
                    return this.syncTo(pos), this.string;
                }
                get lineChunks() {
                    return !0;
                }
                read(from, to) {
                    let stringStart = this.cursorPos - this.string.length;
                    return from < stringStart || to >= this.cursorPos ? this.doc.sliceString(from, to) : this.string.slice(from - stringStart, to - stringStart);
                }
            }
            let currentContext = null;
            class ParseContext {
                constructor(parser, state, fragments = [], tree, treeLen, viewport, skipped, scheduleOn){
                    this.parser = parser, this.state = state, this.fragments = fragments, this.tree = tree, this.treeLen = treeLen, this.viewport = viewport, this.skipped = skipped, this.scheduleOn = scheduleOn, this.parse = null, this.tempSkipped = [];
                }
                static create(parser, state, viewport) {
                    return new ParseContext(parser, state, [], dist_Tree.empty, 0, viewport, [], null);
                }
                startParse() {
                    return this.parser.startParse(new DocInput(this.state.doc), this.fragments);
                }
                work(until, upto) {
                    return (null != upto && upto >= this.state.doc.length && (upto = void 0), this.tree != dist_Tree.empty && this.isDone(null != upto ? upto : this.state.doc.length)) ? (this.takeTree(), !0) : this.withContext(()=>{
                        var _a;
                        if ("number" == typeof until) {
                            let endTime = Date.now() + until;
                            until = ()=>Date.now() > endTime
                            ;
                        }
                        for(this.parse || (this.parse = this.startParse()), null != upto && (null == this.parse.stoppedAt || this.parse.stoppedAt > upto) && upto < this.state.doc.length && this.parse.stopAt(upto);;){
                            let done = this.parse.advance();
                            if (done) {
                                if (this.fragments = this.withoutTempSkipped(TreeFragment.addTree(done, this.fragments, null != this.parse.stoppedAt)), this.treeLen = null !== (_a = this.parse.stoppedAt) && void 0 !== _a ? _a : this.state.doc.length, this.tree = done, this.parse = null, !(this.treeLen < (null != upto ? upto : this.state.doc.length))) return !0;
                                this.parse = this.startParse();
                            }
                            if (until()) return !1;
                        }
                    });
                }
                takeTree() {
                    let pos, tree;
                    this.parse && (pos = this.parse.parsedPos) >= this.treeLen && ((null == this.parse.stoppedAt || this.parse.stoppedAt > pos) && this.parse.stopAt(pos), this.withContext(()=>{
                        for(; !(tree = this.parse.advance()););
                    }), this.treeLen = pos, this.tree = tree, this.fragments = this.withoutTempSkipped(TreeFragment.addTree(this.tree, this.fragments, !0)), this.parse = null);
                }
                withContext(f) {
                    let prev = currentContext;
                    currentContext = this;
                    try {
                        return f();
                    } finally{
                        currentContext = prev;
                    }
                }
                withoutTempSkipped(fragments) {
                    for(let r; r = this.tempSkipped.pop();)fragments = cutFragments(fragments, r.from, r.to);
                    return fragments;
                }
                changes(changes, newState) {
                    let { fragments , tree , treeLen , viewport , skipped  } = this;
                    if (this.takeTree(), !changes.empty) {
                        let ranges = [];
                        if (changes.iterChangedRanges((fromA, toA, fromB, toB)=>ranges.push({
                                fromA,
                                toA,
                                fromB,
                                toB
                            })
                        ), fragments = TreeFragment.applyChanges(fragments, ranges), tree = dist_Tree.empty, treeLen = 0, viewport = {
                            from: changes.mapPos(viewport.from, -1),
                            to: changes.mapPos(viewport.to, 1)
                        }, this.skipped.length) for (let r of (skipped = [], this.skipped)){
                            let from = changes.mapPos(r.from, 1), to = changes.mapPos(r.to, -1);
                            from < to && skipped.push({
                                from,
                                to
                            });
                        }
                    }
                    return new ParseContext(this.parser, newState, fragments, tree, treeLen, viewport, skipped, this.scheduleOn);
                }
                updateViewport(viewport) {
                    if (this.viewport.from == viewport.from && this.viewport.to == viewport.to) return !1;
                    this.viewport = viewport;
                    let startLen = this.skipped.length;
                    for(let i = 0; i < this.skipped.length; i++){
                        let { from , to  } = this.skipped[i];
                        from < viewport.to && to > viewport.from && (this.fragments = cutFragments(this.fragments, from, to), this.skipped.splice(i--, 1));
                    }
                    return !(this.skipped.length >= startLen) && (this.reset(), !0);
                }
                reset() {
                    this.parse && (this.takeTree(), this.parse = null);
                }
                skipUntilInView(from, to) {
                    this.skipped.push({
                        from,
                        to
                    });
                }
                static getSkippingParser(until) {
                    return new class extends dist_Parser {
                        createParse(input, fragments, ranges) {
                            let from = ranges[0].from, to = ranges[ranges.length - 1].to;
                            return {
                                parsedPos: from,
                                advance () {
                                    let cx = currentContext;
                                    if (cx) {
                                        for (let r of ranges)cx.tempSkipped.push(r);
                                        until && (cx.scheduleOn = cx.scheduleOn ? Promise.all([
                                            cx.scheduleOn,
                                            until, 
                                        ]) : until);
                                    }
                                    return this.parsedPos = to, new dist_Tree(dist_NodeType.none, [], [], to - from);
                                },
                                stoppedAt: null,
                                stopAt () {}
                            };
                        }
                    }();
                }
                isDone(upto) {
                    upto = Math.min(upto, this.state.doc.length);
                    let frags = this.fragments;
                    return this.treeLen >= upto && frags.length && 0 == frags[0].from && frags[0].to >= upto;
                }
                static get() {
                    return currentContext;
                }
            }
            function cutFragments(fragments, from, to) {
                return TreeFragment.applyChanges(fragments, [
                    {
                        fromA: from,
                        toA: to,
                        fromB: from,
                        toB: to
                    }, 
                ]);
            }
            class LanguageState {
                constructor(context){
                    this.context = context, this.tree = context.tree;
                }
                apply(tr) {
                    if (!tr.docChanged && this.tree == this.context.tree) return this;
                    let newCx = this.context.changes(tr.changes, tr.state), upto = this.context.treeLen == tr.startState.doc.length ? void 0 : Math.max(tr.changes.mapPos(this.context.treeLen), newCx.viewport.to);
                    return newCx.work(20, upto) || newCx.takeTree(), new LanguageState(newCx);
                }
                static init(state) {
                    let vpTo = Math.min(3000, state.doc.length), parseState = ParseContext.create(state.facet(language).parser, state, {
                        from: 0,
                        to: vpTo
                    });
                    return parseState.work(20, vpTo) || parseState.takeTree(), new LanguageState(parseState);
                }
            }
            Language.state = state_dist.QQ.define({
                create: LanguageState.init,
                update (value, tr) {
                    for (let e of tr.effects)if (e.is(Language.setState)) return e.value;
                    return tr.startState.facet(language) != tr.state.facet(language) ? LanguageState.init(tr.state) : value.apply(tr);
                }
            });
            let requestIdle = (callback)=>{
                let timeout = setTimeout(()=>callback()
                , 500);
                return ()=>clearTimeout(timeout)
                ;
            };
            "undefined" != typeof requestIdleCallback && (requestIdle = (callback)=>{
                let idle = -1, timeout = setTimeout(()=>{
                    idle = requestIdleCallback(callback, {
                        timeout: 400
                    });
                }, 100);
                return ()=>idle < 0 ? clearTimeout(timeout) : cancelIdleCallback(idle)
                ;
            });
            const isInputPending = "undefined" != typeof navigator && (null === (_a1 = navigator.scheduling) || void 0 === _a1 ? void 0 : _a1.isInputPending) ? ()=>navigator.scheduling.isInputPending()
             : null, parseWorker = dist.lg.fromClass(class {
                constructor(view){
                    this.view = view, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
                }
                update(update) {
                    let cx = this.view.state.field(Language.state).context;
                    (cx.updateViewport(update.view.viewport) || this.view.viewport.to > cx.treeLen) && this.scheduleWork(), update.docChanged && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(cx);
                }
                scheduleWork() {
                    if (this.working) return;
                    let { state  } = this.view, field = state.field(Language.state);
                    field.tree == field.context.tree && field.context.isDone(state.doc.length) || (this.working = requestIdle(this.work));
                }
                work(deadline) {
                    this.working = null;
                    let now = Date.now();
                    if (this.chunkEnd < now && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = now + 30000, this.chunkBudget = 3000), this.chunkBudget <= 0) return;
                    let { state , viewport: { to: vpTo  } ,  } = this.view, field = state.field(Language.state);
                    if (field.tree == field.context.tree && field.context.isDone(vpTo + 100000)) return;
                    let endTime = Date.now() + Math.min(this.chunkBudget, 100, deadline && !isInputPending ? Math.max(25, deadline.timeRemaining() - 5) : 1e9), viewportFirst = field.context.treeLen < vpTo && state.doc.length > vpTo + 1000, done = field.context.work(()=>isInputPending && isInputPending() || Date.now() > endTime
                    , vpTo + (viewportFirst ? 0 : 100000));
                    this.chunkBudget -= Date.now() - now, (done || this.chunkBudget <= 0) && (field.context.takeTree(), this.view.dispatch({
                        effects: Language.setState.of(new LanguageState(field.context))
                    })), this.chunkBudget > 0 && !(done && !viewportFirst) && this.scheduleWork(), this.checkAsyncSchedule(field.context);
                }
                checkAsyncSchedule(cx) {
                    cx.scheduleOn && (this.workScheduled++, cx.scheduleOn.then(()=>this.scheduleWork()
                    ).catch((err)=>(0, dist.OO)(this.view.state, err)
                    ).then(()=>this.workScheduled--
                    ), cx.scheduleOn = null);
                }
                destroy() {
                    this.working && this.working();
                }
                isWorking() {
                    return !!(this.working || this.workScheduled > 0);
                }
            }, {
                eventHandlers: {
                    focus () {
                        this.scheduleWork();
                    }
                }
            }), language = state_dist.r$.define({
                combine: (languages)=>languages.length ? languages[0] : null
                ,
                enables: [
                    Language.state,
                    parseWorker
                ]
            });
            class LanguageDescription {
                constructor(name, alias, extensions, filename, loadFunc, support){
                    this.name = name, this.alias = alias, this.extensions = extensions, this.filename = filename, this.loadFunc = loadFunc, this.support = support, this.loading = null;
                }
                load() {
                    return this.loading || (this.loading = this.loadFunc().then((support)=>this.support = support
                    , (err)=>{
                        throw this.loading = null, err;
                    }));
                }
                static of(spec) {
                    let { load , support  } = spec;
                    if (!load) {
                        if (!support) throw new RangeError("Must pass either 'load' or 'support' to LanguageDescription.of");
                        load = ()=>Promise.resolve(support)
                        ;
                    }
                    return new LanguageDescription(spec.name, (spec.alias || []).concat(spec.name).map((s)=>s.toLowerCase()
                    ), spec.extensions || [], spec.filename, load, support);
                }
                static matchFilename(descs, filename) {
                    for (let d of descs)if (d.filename && d.filename.test(filename)) return d;
                    let ext = /\.([^.]+)$/.exec(filename);
                    if (ext) {
                        for (let d1 of descs)if (d1.extensions.indexOf(ext[1]) > -1) return d1;
                    }
                    return null;
                }
                static matchLanguageName(descs, name, fuzzy = !0) {
                    for (let d of (name = name.toLowerCase(), descs))if (d.alias.some((a)=>a == name
                    )) return d;
                    if (fuzzy) for (let d2 of descs)for (let a1 of d2.alias){
                        let found = name.indexOf(a1);
                        if (found > -1 && (a1.length > 2 || !/\w/.test(name[found - 1]) && !/\w/.test(name[found + a1.length]))) return d2;
                    }
                    return null;
                }
            }
            const indentService = state_dist.r$.define(), dist_indentUnit = state_dist.r$.define({
                combine (values) {
                    if (!values.length) return "  ";
                    if (!/^(?: +|\t+)$/.test(values[0])) throw new Error("Invalid indent unit: " + JSON.stringify(values[0]));
                    return values[0];
                }
            });
            function getIndentUnit(state) {
                let unit = state.facet(dist_indentUnit);
                return 9 == unit.charCodeAt(0) ? state.tabSize * unit.length : unit.length;
            }
            function indentString(state, cols) {
                let result = "", ts = state.tabSize;
                if (9 == state.facet(dist_indentUnit).charCodeAt(0)) for(; cols >= ts;)result += "\t", cols -= ts;
                for(let i = 0; i < cols; i++)result += " ";
                return result;
            }
            function getIndentation(context, pos) {
                for (let service of (context instanceof state_dist.yy && (context = new IndentContext(context)), context.state.facet(indentService))){
                    let result = service(context, pos);
                    if (null != result) return result;
                }
                let tree = dist_syntaxTree(context.state);
                return tree ? syntaxIndentation(context, tree, pos) : null;
            }
            class IndentContext {
                constructor(state, options = {}){
                    this.state = state, this.options = options, this.unit = getIndentUnit(state);
                }
                lineAt(pos, bias = 1) {
                    let line = this.state.doc.lineAt(pos), { simulateBreak , simulateDoubleBreak  } = this.options;
                    return null != simulateBreak && simulateBreak >= line.from && simulateBreak <= line.to ? simulateDoubleBreak && simulateBreak == pos ? {
                        text: "",
                        from: pos
                    } : (bias < 0 ? simulateBreak < pos : simulateBreak <= pos) ? {
                        text: line.text.slice(simulateBreak - line.from),
                        from: simulateBreak
                    } : {
                        text: line.text.slice(0, simulateBreak - line.from),
                        from: line.from
                    } : line;
                }
                textAfterPos(pos, bias = 1) {
                    if (this.options.simulateDoubleBreak && pos == this.options.simulateBreak) return "";
                    let { text , from  } = this.lineAt(pos, bias);
                    return text.slice(pos - from, Math.min(text.length, pos + 100 - from));
                }
                column(pos, bias = 1) {
                    let { text , from  } = this.lineAt(pos, bias), result = this.countColumn(text, pos - from), override = this.options.overrideIndentation ? this.options.overrideIndentation(from) : -1;
                    return override > -1 && (result += override - this.countColumn(text, text.search(/\S|$/))), result;
                }
                countColumn(line, pos = line.length) {
                    return (0, state_dist.IS)(line, this.state.tabSize, pos);
                }
                lineIndent(pos, bias = 1) {
                    let { text , from  } = this.lineAt(pos, bias), override = this.options.overrideIndentation;
                    if (override) {
                        let overriden = override(from);
                        if (overriden > -1) return overriden;
                    }
                    return this.countColumn(text, text.search(/\S|$/));
                }
                get simulatedBreak() {
                    return this.options.simulateBreak || null;
                }
            }
            const indentNodeProp = new dist_NodeProp();
            function syntaxIndentation(cx, ast, pos) {
                return indentFrom(ast.resolveInner(pos).enterUnfinishedNodesBefore(pos), pos, cx);
            }
            function ignoreClosed(cx) {
                return cx.pos == cx.options.simulateBreak && cx.options.simulateDoubleBreak;
            }
            function indentStrategy(tree) {
                let strategy = tree.type.prop(indentNodeProp);
                if (strategy) return strategy;
                let first = tree.firstChild, close;
                if (first && (close = first.type.prop(dist_NodeProp.closedBy))) {
                    let last = tree.lastChild, closed = last && close.indexOf(last.name) > -1;
                    return (cx)=>delimitedStrategy(cx, !0, 1, void 0, closed && !ignoreClosed(cx) ? last.from : void 0)
                    ;
                }
                return null == tree.parent ? topIndent : null;
            }
            function indentFrom(node, pos, base) {
                for(; node; node = node.parent){
                    let strategy = indentStrategy(node);
                    if (strategy) return strategy(TreeIndentContext.create(base, pos, node));
                }
                return null;
            }
            function topIndent() {
                return 0;
            }
            class TreeIndentContext extends IndentContext {
                constructor(base, pos, node){
                    super(base.state, base.options), this.base = base, this.pos = pos, this.node = node;
                }
                static create(base, pos, node) {
                    return new TreeIndentContext(base, pos, node);
                }
                get textAfter() {
                    return this.textAfterPos(this.pos);
                }
                get baseIndent() {
                    let line = this.state.doc.lineAt(this.node.from);
                    for(;;){
                        let atBreak = this.node.resolve(line.from);
                        for(; atBreak.parent && atBreak.parent.from == atBreak.from;)atBreak = atBreak.parent;
                        if (isParent(atBreak, this.node)) break;
                        line = this.state.doc.lineAt(atBreak.from);
                    }
                    return this.lineIndent(line.from);
                }
                continue() {
                    let parent = this.node.parent;
                    return parent ? indentFrom(parent, this.pos, this.base) : 0;
                }
            }
            function isParent(parent, of) {
                for(let cur = of; cur; cur = cur.parent)if (parent == cur) return !0;
                return !1;
            }
            function bracketedAligned(context) {
                let tree = context.node, openToken = tree.childAfter(tree.from), last = tree.lastChild;
                if (!openToken) return null;
                let sim = context.options.simulateBreak, openLine = context.state.doc.lineAt(openToken.from), lineEnd = null == sim || sim <= openLine.from ? openLine.to : Math.min(openLine.to, sim);
                for(let pos = openToken.to;;){
                    let next = tree.childAfter(pos);
                    if (!next || next == last) return null;
                    if (!next.type.isSkipped) return next.from < lineEnd ? openToken : null;
                    pos = next.to;
                }
            }
            function delimitedStrategy(context, align, units, closing, closedAt) {
                let after = context.textAfter, space = after.match(/^\s*/)[0].length, closed = closing && after.slice(space, space + closing.length) == closing || closedAt == context.pos + space, aligned = align ? bracketedAligned(context) : null;
                return aligned ? closed ? context.column(aligned.from) : context.column(aligned.to) : context.baseIndent + (closed ? 0 : context.unit * units);
            }
            const DontIndentBeyond = 200;
            function indentOnInput() {
                return state_dist.yy.transactionFilter.of((tr)=>{
                    if (!tr.docChanged || !tr.isUserEvent("input.type") && !tr.isUserEvent("input.complete")) return tr;
                    let rules = tr.startState.languageDataAt("indentOnInput", tr.startState.selection.main.head);
                    if (!rules.length) return tr;
                    let doc = tr.newDoc, { head  } = tr.newSelection.main, line = doc.lineAt(head);
                    if (head > line.from + DontIndentBeyond) return tr;
                    let lineStart = doc.sliceString(line.from, head);
                    if (!rules.some((r)=>r.test(lineStart)
                    )) return tr;
                    let { state  } = tr, last = -1, changes = [];
                    for (let { head: head1  } of state.selection.ranges){
                        let line = state.doc.lineAt(head1);
                        if (line.from == last) continue;
                        last = line.from;
                        let indent = getIndentation(state, line.from);
                        if (null == indent) continue;
                        let cur = /^\s*/.exec(line.text)[0], norm = indentString(state, indent);
                        cur != norm && changes.push({
                            from: line.from,
                            to: line.from + cur.length,
                            insert: norm
                        });
                    }
                    return changes.length ? [
                        tr,
                        {
                            changes,
                            sequential: !0
                        }
                    ] : tr;
                });
            }
            const foldService = state_dist.r$.define(), foldNodeProp = new dist_NodeProp();
            function syntaxFolding(state, start, end) {
                let tree = dist_syntaxTree(state);
                if (tree.length < end) return null;
                let inner = tree.resolveInner(end), found = null;
                for(let cur = inner; cur; cur = cur.parent){
                    if (cur.to <= end || cur.from > end) continue;
                    if (found && cur.from < start) break;
                    let prop = cur.type.prop(foldNodeProp);
                    if (prop && (cur.to < tree.length - 50 || tree.length == state.doc.length || !isUnfinished(cur))) {
                        let value = prop(cur, state);
                        value && value.from <= end && value.from >= start && value.to > end && (found = value);
                    }
                }
                return found;
            }
            function isUnfinished(node) {
                let ch = node.lastChild;
                return ch && ch.to == node.to && ch.type.isError;
            }
            function foldable(state, lineStart, lineEnd) {
                for (let service of state.facet(foldService)){
                    let result = service(state, lineStart, lineEnd);
                    if (result) return result;
                }
                return syntaxFolding(state, lineStart, lineEnd);
            }
            function mapRange(range, mapping) {
                let from = mapping.mapPos(range.from, 1), to = mapping.mapPos(range.to, -1);
                return from >= to ? void 0 : {
                    from,
                    to
                };
            }
            const foldEffect = state_dist.Py.define({
                map: mapRange
            }), unfoldEffect = state_dist.Py.define({
                map: mapRange
            });
            function selectedLines(view) {
                let lines = [];
                for (let { head  } of view.state.selection.ranges)lines.some((l)=>l.from <= head && l.to >= head
                ) || lines.push(view.lineBlockAt(head));
                return lines;
            }
            const foldState = state_dist.QQ.define({
                create: ()=>dist.p.none
                ,
                update (folded, tr) {
                    for (let e of (folded = folded.map(tr.changes), tr.effects))e.is(foldEffect) && !foldExists(folded, e.value.from, e.value.to) ? folded = folded.update({
                        add: [
                            foldWidget.range(e.value.from, e.value.to), 
                        ]
                    }) : e.is(unfoldEffect) && (folded = folded.update({
                        filter: (from, to)=>e.value.from != from || e.value.to != to
                        ,
                        filterFrom: e.value.from,
                        filterTo: e.value.to
                    }));
                    if (tr.selection) {
                        let onSelection = !1, { head  } = tr.selection.main;
                        folded.between(head, head, (a, b)=>{
                            a < head && b > head && (onSelection = !0);
                        }), onSelection && (folded = folded.update({
                            filterFrom: head,
                            filterTo: head,
                            filter: (a, b)=>b <= head || a >= head
                        }));
                    }
                    return folded;
                },
                provide: (f)=>dist.tk.decorations.from(f)
            });
            function findFold(state, from2, to2) {
                var _a;
                let found = null;
                return null === (_a = state.field(foldState, !1)) || void 0 === _a || _a.between(from2, to2, (from, to)=>{
                    (!found || found.from > from) && (found = {
                        from,
                        to
                    });
                }), found;
            }
            function foldExists(folded, from, to) {
                let found = !1;
                return folded.between(from, from, (a, b)=>{
                    a == from && b == to && (found = !0);
                }), found;
            }
            function maybeEnable(state, other) {
                return state.field(foldState, !1) ? other : other.concat(state_dist.Py.appendConfig.of(codeFolding()));
            }
            function announceFold(view, range, fold = !0) {
                let lineFrom = view.state.doc.lineAt(range.from).number, lineTo = view.state.doc.lineAt(range.to).number;
                return dist.tk.announce.of(`${view.state.phrase(fold ? "Folded lines" : "Unfolded lines")} ${lineFrom} ${view.state.phrase("to")} ${lineTo}.`);
            }
            const defaultConfig = {
                placeholderDOM: null,
                placeholderText: "…"
            }, foldConfig = state_dist.r$.define({
                combine: (values)=>(0, state_dist.BO)(values, defaultConfig)
            });
            function codeFolding(config) {
                let result = [
                    foldState,
                    baseTheme$1
                ];
                return config && result.push(foldConfig.of(config)), result;
            }
            const foldWidget = dist.p.replace({
                widget: new class extends dist.l9 {
                    toDOM(view) {
                        let { state  } = view, conf = state.facet(foldConfig), onclick = (event)=>{
                            let line = view.lineBlockAt(view.posAtDOM(event.target)), folded = findFold(view.state, line.from, line.to);
                            folded && view.dispatch({
                                effects: unfoldEffect.of(folded)
                            }), event.preventDefault();
                        };
                        if (conf.placeholderDOM) return conf.placeholderDOM(view, onclick);
                        let element = document.createElement("span");
                        return element.textContent = conf.placeholderText, element.setAttribute("aria-label", state.phrase("folded code")), element.title = state.phrase("unfold"), element.className = "cm-foldPlaceholder", element.onclick = onclick, element;
                    }
                }()
            }), foldGutterDefaults = {
                openText: "⌄",
                closedText: "›",
                markerDOM: null,
                domEventHandlers: {}
            };
            class FoldMarker extends dist.SJ {
                constructor(config, open){
                    super(), this.config = config, this.open = open;
                }
                eq(other) {
                    return this.config == other.config && this.open == other.open;
                }
                toDOM(view) {
                    if (this.config.markerDOM) return this.config.markerDOM(this.open);
                    let span = document.createElement("span");
                    return span.textContent = this.open ? this.config.openText : this.config.closedText, span.title = view.state.phrase(this.open ? "Fold line" : "Unfold line"), span;
                }
            }
            function foldGutter(config = {}) {
                let fullConfig = Object.assign(Object.assign({}, foldGutterDefaults), config), canFold = new FoldMarker(fullConfig, !0), canUnfold = new FoldMarker(fullConfig, !1), markers = dist.lg.fromClass(class {
                    constructor(view){
                        this.from = view.viewport.from, this.markers = this.buildMarkers(view);
                    }
                    update(update) {
                        (update.docChanged || update.viewportChanged || update.startState.facet(language) != update.state.facet(language) || update.startState.field(foldState, !1) != update.state.field(foldState, !1) || dist_syntaxTree(update.startState) != dist_syntaxTree(update.state)) && (this.markers = this.buildMarkers(update.view));
                    }
                    buildMarkers(view) {
                        let builder = new state_dist.f_();
                        for (let line of view.viewportLineBlocks){
                            let mark = findFold(view.state, line.from, line.to) ? canUnfold : foldable(view.state, line.from, line.to) ? canFold : null;
                            mark && builder.add(line.from, line.from, mark);
                        }
                        return builder.finish();
                    }
                }), { domEventHandlers  } = fullConfig;
                return [
                    markers,
                    (0, dist.v5)({
                        class: "cm-foldGutter",
                        markers (view) {
                            var _a;
                            return (null === (_a = view.plugin(markers)) || void 0 === _a ? void 0 : _a.markers) || state_dist.Xs.empty;
                        },
                        initialSpacer: ()=>new FoldMarker(fullConfig, !1)
                        ,
                        domEventHandlers: Object.assign(Object.assign({}, domEventHandlers), {
                            click (view, line, event) {
                                if (domEventHandlers.click && domEventHandlers.click(view, line, event)) return !0;
                                let folded = findFold(view.state, line.from, line.to);
                                if (folded) return view.dispatch({
                                    effects: unfoldEffect.of(folded)
                                }), !0;
                                let range = foldable(view.state, line.from, line.to);
                                return !!range && (view.dispatch({
                                    effects: foldEffect.of(range)
                                }), !0);
                            }
                        })
                    }),
                    codeFolding(), 
                ];
            }
            const baseTheme$1 = dist.tk.baseTheme({
                ".cm-foldPlaceholder": {
                    backgroundColor: "#eee",
                    border: "1px solid #ddd",
                    color: "#888",
                    borderRadius: ".2em",
                    margin: "0 1px",
                    padding: "0 1px",
                    cursor: "pointer"
                },
                ".cm-foldGutter span": {
                    padding: "0 1px",
                    cursor: "pointer"
                }
            });
            class HighlightStyle {
                constructor(spec1, options){
                    let modSpec;
                    function def(spec) {
                        let cls = style_mod.V.newName();
                        return (modSpec || (modSpec = Object.create(null)))["." + cls] = spec, cls;
                    }
                    const all = "string" == typeof options.all ? options.all : options.all ? def(options.all) : void 0, scopeOpt = options.scope;
                    this.scope = scopeOpt instanceof Language ? (type)=>type.prop(languageDataProp) == scopeOpt.data
                     : scopeOpt ? (type)=>type == scopeOpt
                     : void 0, this.style = tagHighlighter(spec1.map((style)=>({
                            tag: style.tag,
                            class: style.class || def(Object.assign({}, style, {
                                tag: null
                            }))
                        })
                    ), {
                        all
                    }).style, this.module = modSpec ? new style_mod.V(modSpec) : null, this.themeType = options.themeType;
                }
                static define(specs, options) {
                    return new HighlightStyle(specs, options || {});
                }
            }
            const highlighterFacet = state_dist.r$.define(), fallbackHighlighter = state_dist.r$.define({
                combine: (values)=>values.length ? [
                        values[0]
                    ] : null
            });
            function getHighlighters(state) {
                let main = state.facet(highlighterFacet);
                return main.length ? main : state.facet(fallbackHighlighter);
            }
            function syntaxHighlighting(highlighter, options) {
                let ext = [
                    treeHighlighter
                ], themeType;
                return highlighter instanceof HighlightStyle && (highlighter.module && ext.push(dist.tk.styleModule.of(highlighter.module)), themeType = highlighter.themeType), (null == options ? void 0 : options.fallback) ? ext.push(fallbackHighlighter.of(highlighter)) : themeType ? ext.push(highlighterFacet.computeN([
                    dist.tk.darkTheme
                ], (state)=>state.facet(dist.tk.darkTheme) == ("dark" == themeType) ? [
                        highlighter
                    ] : []
                )) : ext.push(highlighterFacet.of(highlighter)), ext;
            }
            class TreeHighlighter {
                constructor(view){
                    this.markCache = Object.create(null), this.tree = dist_syntaxTree(view.state), this.decorations = this.buildDeco(view, getHighlighters(view.state));
                }
                update(update) {
                    let tree = dist_syntaxTree(update.state), highlighters = getHighlighters(update.state), styleChange = highlighters != getHighlighters(update.startState);
                    tree.length < update.view.viewport.to && !styleChange && tree.type == this.tree.type ? this.decorations = this.decorations.map(update.changes) : (tree != this.tree || update.viewportChanged || styleChange) && (this.tree = tree, this.decorations = this.buildDeco(update.view, highlighters));
                }
                buildDeco(view, highlighters) {
                    if (!highlighters || !this.tree.length) return dist.p.none;
                    let builder = new state_dist.f_();
                    for (let { from: from3 , to: to3  } of view.visibleRanges)highlightTree(this.tree, highlighters, (from, to, style)=>{
                        builder.add(from, to, this.markCache[style] || (this.markCache[style] = dist.p.mark({
                            class: style
                        })));
                    }, from3, to3);
                    return builder.finish();
                }
            }
            const treeHighlighter = state_dist.Wl.high(dist.lg.fromClass(TreeHighlighter, {
                decorations: (v)=>v.decorations
            })), defaultHighlightStyle = HighlightStyle.define([
                {
                    tag: tags1.meta,
                    color: "#7a757a"
                },
                {
                    tag: tags1.link,
                    textDecoration: "underline"
                },
                {
                    tag: tags1.heading,
                    textDecoration: "underline",
                    fontWeight: "bold"
                },
                {
                    tag: tags1.emphasis,
                    fontStyle: "italic"
                },
                {
                    tag: tags1.strong,
                    fontWeight: "bold"
                },
                {
                    tag: tags1.strikethrough,
                    textDecoration: "line-through"
                },
                {
                    tag: tags1.keyword,
                    color: "#708"
                },
                {
                    tag: [
                        tags1.atom,
                        tags1.bool,
                        tags1.url,
                        tags1.contentSeparator,
                        tags1.labelName, 
                    ],
                    color: "#219"
                },
                {
                    tag: [
                        tags1.literal,
                        tags1.inserted
                    ],
                    color: "#164"
                },
                {
                    tag: [
                        tags1.string,
                        tags1.deleted
                    ],
                    color: "#a11"
                },
                {
                    tag: [
                        tags1.regexp,
                        tags1.escape,
                        tags1.special(tags1.string), 
                    ],
                    color: "#e40"
                },
                {
                    tag: tags1.definition(tags1.variableName),
                    color: "#00f"
                },
                {
                    tag: tags1.local(tags1.variableName),
                    color: "#30a"
                },
                {
                    tag: [
                        tags1.typeName,
                        tags1.namespace
                    ],
                    color: "#085"
                },
                {
                    tag: tags1.className,
                    color: "#167"
                },
                {
                    tag: [
                        tags1.special(tags1.variableName),
                        tags1.macroName, 
                    ],
                    color: "#256"
                },
                {
                    tag: tags1.definition(tags1.propertyName),
                    color: "#00c"
                },
                {
                    tag: tags1.comment,
                    color: "#940"
                },
                {
                    tag: tags1.invalid,
                    color: "#f00"
                }, 
            ]), baseTheme = dist.tk.baseTheme({
                "&.cm-focused .cm-matchingBracket": {
                    backgroundColor: "#328c8252"
                },
                "&.cm-focused .cm-nonmatchingBracket": {
                    backgroundColor: "#bb555544"
                }
            }), DefaultScanDist = 10000, DefaultBrackets = "()[]{}", bracketMatchingConfig = state_dist.r$.define({
                combine: (configs)=>(0, state_dist.BO)(configs, {
                        afterCursor: !0,
                        brackets: DefaultBrackets,
                        maxScanDistance: DefaultScanDist,
                        renderMatch: defaultRenderMatch
                    })
            }), matchingMark = dist.p.mark({
                class: "cm-matchingBracket"
            }), nonmatchingMark = dist.p.mark({
                class: "cm-nonmatchingBracket"
            });
            function defaultRenderMatch(match) {
                let decorations = [], mark = match.matched ? matchingMark : nonmatchingMark;
                return decorations.push(mark.range(match.start.from, match.start.to)), match.end && decorations.push(mark.range(match.end.from, match.end.to)), decorations;
            }
            const bracketMatchingState = state_dist.QQ.define({
                create: ()=>dist.p.none
                ,
                update (deco, tr) {
                    if (!tr.docChanged && !tr.selection) return deco;
                    let decorations = [], config = tr.state.facet(bracketMatchingConfig);
                    for (let range of tr.state.selection.ranges){
                        if (!range.empty) continue;
                        let match = matchBrackets(tr.state, range.head, -1, config) || range.head > 0 && matchBrackets(tr.state, range.head - 1, 1, config) || config.afterCursor && (matchBrackets(tr.state, range.head, 1, config) || range.head < tr.state.doc.length && matchBrackets(tr.state, range.head + 1, -1, config));
                        match && (decorations = decorations.concat(config.renderMatch(match, tr.state)));
                    }
                    return dist.p.set(decorations, !0);
                },
                provide: (f)=>dist.tk.decorations.from(f)
            }), bracketMatchingUnique = [
                bracketMatchingState,
                baseTheme
            ];
            function bracketMatching(config = {}) {
                return [
                    bracketMatchingConfig.of(config),
                    bracketMatchingUnique, 
                ];
            }
            function matchingNodes(node, dir, brackets) {
                let byProp = node.prop(dir < 0 ? dist_NodeProp.openedBy : dist_NodeProp.closedBy);
                if (byProp) return byProp;
                if (1 == node.name.length) {
                    let index = brackets.indexOf(node.name);
                    if (index > -1 && index % 2 == (dir < 0 ? 1 : 0)) return [
                        brackets[index + dir]
                    ];
                }
                return null;
            }
            function matchBrackets(state, pos, dir, config = {}) {
                let maxScanDistance = config.maxScanDistance || DefaultScanDist, brackets = config.brackets || DefaultBrackets, tree = dist_syntaxTree(state), node = tree.resolveInner(pos, dir);
                for(let cur = node; cur; cur = cur.parent){
                    let matches = matchingNodes(cur.type, dir, brackets);
                    if (matches && cur.from < cur.to) return matchMarkedBrackets(state, pos, dir, cur, matches, brackets);
                }
                return matchPlainBrackets(state, pos, dir, tree, node.type, maxScanDistance, brackets);
            }
            function matchMarkedBrackets(_state, _pos, dir, token, matching, brackets) {
                let parent = token.parent, firstToken = {
                    from: token.from,
                    to: token.to
                }, depth = 0, cursor = null == parent ? void 0 : parent.cursor();
                if (cursor && (dir < 0 ? cursor.childBefore(token.from) : cursor.childAfter(token.to))) do if (dir < 0 ? cursor.to <= token.from : cursor.from >= token.to) {
                    if (0 == depth && matching.indexOf(cursor.type.name) > -1 && cursor.from < cursor.to) return {
                        start: firstToken,
                        end: {
                            from: cursor.from,
                            to: cursor.to
                        },
                        matched: !0
                    };
                    if (matchingNodes(cursor.type, dir, brackets)) depth++;
                    else if (matchingNodes(cursor.type, -dir, brackets) && 0 == --depth) return {
                        start: firstToken,
                        end: cursor.from == cursor.to ? void 0 : {
                            from: cursor.from,
                            to: cursor.to
                        },
                        matched: !1
                    };
                }
                while (dir < 0 ? cursor.prevSibling() : cursor.nextSibling())
                return {
                    start: firstToken,
                    matched: !1
                };
            }
            function matchPlainBrackets(state, pos, dir, tree, tokenType, maxScanDistance, brackets) {
                let startCh = dir < 0 ? state.sliceDoc(pos - 1, pos) : state.sliceDoc(pos, pos + 1), bracket = brackets.indexOf(startCh);
                if (bracket < 0 || bracket % 2 == 0 != dir > 0) return null;
                let startToken = {
                    from: dir < 0 ? pos - 1 : pos,
                    to: dir > 0 ? pos + 1 : pos
                }, iter = state.doc.iterRange(pos, dir > 0 ? state.doc.length : 0), depth = 0;
                for(let distance = 0; !iter.next().done && distance <= maxScanDistance;){
                    let text = iter.value;
                    dir < 0 && (distance += text.length);
                    let basePos = pos + distance * dir;
                    for(let pos1 = dir > 0 ? 0 : text.length - 1, end = dir > 0 ? text.length : -1; pos1 != end; pos1 += dir){
                        let found = brackets.indexOf(text[pos1]);
                        if (!(found < 0) && tree.resolve(basePos + pos1, 1).type == tokenType) {
                            if (found % 2 == 0 == dir > 0) depth++;
                            else {
                                if (1 == depth) return {
                                    start: startToken,
                                    end: {
                                        from: basePos + pos1,
                                        to: basePos + pos1 + 1
                                    },
                                    matched: found >> 1 == bracket >> 1
                                };
                                depth--;
                            }
                        }
                    }
                    dir > 0 && (distance += text.length);
                }
                return iter.done ? {
                    start: startToken,
                    matched: !1
                } : null;
            }
            function countCol(string, end, tabSize, startIndex = 0, startValue = 0) {
                null == end && -1 == (end = string.search(/[^\s\u00a0]/)) && (end = string.length);
                let n = startValue;
                for(let i = startIndex; i < end; i++)9 == string.charCodeAt(i) ? n += tabSize - n % tabSize : n++;
                return n;
            }
            class StringStream {
                constructor(string, tabSize, indentUnit){
                    this.string = string, this.tabSize = tabSize, this.indentUnit = indentUnit, this.pos = 0, this.start = 0, this.lastColumnPos = 0, this.lastColumnValue = 0;
                }
                eol() {
                    return this.pos >= this.string.length;
                }
                sol() {
                    return 0 == this.pos;
                }
                peek() {
                    return this.string.charAt(this.pos) || void 0;
                }
                next() {
                    if (this.pos < this.string.length) return this.string.charAt(this.pos++);
                }
                eat(match) {
                    let ch = this.string.charAt(this.pos);
                    if ("string" == typeof match ? ch == match : ch && (match instanceof RegExp ? match.test(ch) : match(ch))) return ++this.pos, ch;
                }
                eatWhile(match) {
                    let start = this.pos;
                    for(; this.eat(match););
                    return this.pos > start;
                }
                eatSpace() {
                    let start = this.pos;
                    for(; /[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;
                    return this.pos > start;
                }
                skipToEnd() {
                    this.pos = this.string.length;
                }
                skipTo(ch) {
                    let found = this.string.indexOf(ch, this.pos);
                    if (found > -1) return this.pos = found, !0;
                }
                backUp(n) {
                    this.pos -= n;
                }
                column() {
                    return this.lastColumnPos < this.start && (this.lastColumnValue = countCol(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue;
                }
                indentation() {
                    return countCol(this.string, null, this.tabSize);
                }
                match(pattern, consume, caseInsensitive) {
                    if ("string" == typeof pattern) {
                        let cased = (str)=>caseInsensitive ? str.toLowerCase() : str
                        ;
                        return cased(this.string.substr(this.pos, pattern.length)) == cased(pattern) ? (!1 !== consume && (this.pos += pattern.length), !0) : null;
                    }
                    {
                        let match = this.string.slice(this.pos).match(pattern);
                        return match && match.index > 0 ? null : (match && !1 !== consume && (this.pos += match[0].length), match);
                    }
                }
                current() {
                    return this.string.slice(this.start, this.pos);
                }
            }
            function fullParser(spec) {
                return {
                    token: spec.token,
                    blankLine: spec.blankLine || (()=>{}),
                    startState: spec.startState || (()=>!0
                    ),
                    copyState: spec.copyState || defaultCopyState,
                    indent: spec.indent || (()=>null
                    ),
                    languageData: spec.languageData || {},
                    tokenTable: spec.tokenTable || noTokens
                };
            }
            function defaultCopyState(state) {
                if ("object" != typeof state) return state;
                let newState = {};
                for(let prop in state){
                    let val = state[prop];
                    newState[prop] = val instanceof Array ? val.slice() : val;
                }
                return newState;
            }
            class StreamLanguage extends null {
                constructor(parser){
                    let data = defineLanguageFacet(parser.languageData), p = fullParser(parser), self;
                    super(data, new class extends Parser {
                        createParse(input, fragments, ranges) {
                            return new Parse(self, input, fragments, ranges);
                        }
                    }(), [
                        indentService.of((cx, pos)=>this.getIndent(cx, pos)
                        ), 
                    ]), this.topNode = docID(data), self = this, this.streamParser = p, this.stateAfter = new NodeProp({
                        perNode: !0
                    }), this.tokenTable = parser.tokenTable ? new TokenTable(p.tokenTable) : defaultTokenTable;
                }
                static define(spec) {
                    return new StreamLanguage(spec);
                }
                getIndent(cx, pos) {
                    let tree = dist_syntaxTree(cx.state), at = tree.resolve(pos);
                    for(; at && at.type != this.topNode;)at = at.parent;
                    if (!at) return null;
                    let start = findState(this, tree, 0, at.from, pos), statePos, state;
                    if (start ? (state = start.state, statePos = start.pos + 1) : (state = this.streamParser.startState(cx.unit), statePos = 0), pos - statePos > 10000) return null;
                    for(; statePos < pos;){
                        let line = cx.state.doc.lineAt(statePos), end = Math.min(pos, line.to);
                        if (line.length) {
                            let stream = new StringStream(line.text, cx.state.tabSize, cx.unit);
                            for(; stream.pos < end - line.from;)readToken(this.streamParser.token, stream, state);
                        } else this.streamParser.blankLine(state, cx.unit);
                        if (end == pos) break;
                        statePos = line.to + 1;
                    }
                    let { text  } = cx.lineAt(pos);
                    return this.streamParser.indent(state, /^\s*(.*)/.exec(text)[1], cx);
                }
                get allowsNesting() {
                    return !1;
                }
            }
            function findState(lang, tree, off, startPos, before) {
                let state = off >= startPos && off + tree.length <= before && tree.prop(lang.stateAfter);
                if (state) return {
                    state: lang.streamParser.copyState(state),
                    pos: off + tree.length
                };
                for(let i = tree.children.length - 1; i >= 0; i--){
                    let child = tree.children[i], pos = off + tree.positions[i], found = child instanceof Tree && pos < before && findState(lang, child, pos, startPos, before);
                    if (found) return found;
                }
                return null;
            }
            function cutTree(lang, tree, from, to, inside) {
                if (inside && from <= 0 && to >= tree.length) return tree;
                inside || tree.type != lang.topNode || (inside = !0);
                for(let i = tree.children.length - 1; i >= 0; i--){
                    let pos = tree.positions[i], child = tree.children[i], inner;
                    if (pos < to && child instanceof Tree) {
                        if (!(inner = cutTree(lang, child, from - pos, to - pos, inside))) break;
                        return inside ? new Tree(tree.type, tree.children.slice(0, i).concat(inner), tree.positions.slice(0, i + 1), pos + inner.length) : inner;
                    }
                }
                return null;
            }
            function findStartInFragments(lang, fragments, startPos, editorState) {
                for (let f of fragments){
                    let from = f.from + (f.openStart ? 25 : 0), to = f.to - (f.openEnd ? 25 : 0), found = from <= startPos && to > startPos && findState(lang, f.tree, 0 - f.offset, startPos, to), tree;
                    if (found && (tree = cutTree(lang, f.tree, startPos + f.offset, found.pos + f.offset, !1))) return {
                        state: found.state,
                        tree
                    };
                }
                return {
                    state: lang.streamParser.startState(editorState ? getIndentUnit(editorState) : 4),
                    tree: Tree.empty
                };
            }
            class Parse {
                constructor(lang, input, fragments, ranges){
                    this.lang = lang, this.input = input, this.fragments = fragments, this.ranges = ranges, this.stoppedAt = null, this.chunks = [], this.chunkPos = [], this.chunk = [], this.chunkReused = void 0, this.rangeIndex = 0, this.to = ranges[ranges.length - 1].to;
                    let context = ParseContext.get(), from = ranges[0].from, { state , tree  } = findStartInFragments(lang, fragments, from, null == context ? void 0 : context.state);
                    this.state = state, this.parsedPos = this.chunkStart = from + tree.length;
                    for(let i = 0; i < tree.children.length; i++)this.chunks.push(tree.children[i]), this.chunkPos.push(tree.positions[i]);
                    context && this.parsedPos < context.viewport.from - 100000 && (this.state = this.lang.streamParser.startState(getIndentUnit(context.state)), context.skipUntilInView(this.parsedPos, context.viewport.from), this.parsedPos = context.viewport.from), this.moveRangeIndex();
                }
                advance() {
                    let context = ParseContext.get(), parseEnd = null == this.stoppedAt ? this.to : Math.min(this.to, this.stoppedAt), end = Math.min(parseEnd, this.chunkStart + 2048);
                    for(context && (end = Math.min(end, context.viewport.to)); this.parsedPos < end;)this.parseLine(context);
                    return (this.chunkStart < this.parsedPos && this.finishChunk(), this.parsedPos >= parseEnd) ? this.finish() : context && this.parsedPos >= context.viewport.to ? (context.skipUntilInView(this.parsedPos, parseEnd), this.finish()) : null;
                }
                stopAt(pos) {
                    this.stoppedAt = pos;
                }
                lineAfter(pos) {
                    let chunk = this.input.chunk(pos);
                    if (this.input.lineChunks) "\n" == chunk && (chunk = "");
                    else {
                        let eol = chunk.indexOf("\n");
                        eol > -1 && (chunk = chunk.slice(0, eol));
                    }
                    return pos + chunk.length <= this.to ? chunk : chunk.slice(0, this.to - pos);
                }
                nextLine() {
                    let from = this.parsedPos, line = this.lineAfter(from), end = from + line.length;
                    for(let index = this.rangeIndex;;){
                        let rangeEnd = this.ranges[index].to;
                        if (rangeEnd >= end || (line = line.slice(0, rangeEnd - (end - line.length)), ++index == this.ranges.length)) break;
                        let rangeStart = this.ranges[index].from, after = this.lineAfter(rangeStart);
                        line += after, end = rangeStart + after.length;
                    }
                    return {
                        line,
                        end
                    };
                }
                skipGapsTo(pos, offset, side) {
                    for(;;){
                        let end = this.ranges[this.rangeIndex].to, offPos = pos + offset;
                        if (side > 0 ? end > offPos : end >= offPos) break;
                        offset += this.ranges[++this.rangeIndex].from - end;
                    }
                    return offset;
                }
                moveRangeIndex() {
                    for(; this.ranges[this.rangeIndex].to < this.parsedPos;)this.rangeIndex++;
                }
                emitToken(id, from, to, size, offset) {
                    if (this.ranges.length > 1) {
                        offset = this.skipGapsTo(from, offset, 1), from += offset;
                        let len0 = this.chunk.length;
                        offset = this.skipGapsTo(to, offset, -1), to += offset, size += this.chunk.length - len0;
                    }
                    return this.chunk.push(id, from, to, size), offset;
                }
                parseLine(context) {
                    let { line , end  } = this.nextLine(), offset = 0, { streamParser  } = this.lang, stream = new StringStream(line, context ? context.state.tabSize : 4, context ? getIndentUnit(context.state) : 2);
                    if (stream.eol()) streamParser.blankLine(this.state, stream.indentUnit);
                    else for(; !stream.eol();){
                        let token = readToken(streamParser.token, stream, this.state);
                        if (token && (offset = this.emitToken(this.lang.tokenTable.resolve(token), this.parsedPos + stream.start, this.parsedPos + stream.pos, 4, offset)), stream.start > 10000) break;
                    }
                    this.parsedPos = end, this.moveRangeIndex(), this.parsedPos < this.to && this.parsedPos++;
                }
                finishChunk() {
                    let tree = Tree.build({
                        buffer: this.chunk,
                        start: this.chunkStart,
                        length: this.parsedPos - this.chunkStart,
                        nodeSet: nodeSet1,
                        topID: 0,
                        maxBufferLength: 2048,
                        reused: this.chunkReused
                    });
                    tree = new Tree(tree.type, tree.children, tree.positions, tree.length, [
                        [
                            this.lang.stateAfter,
                            this.lang.streamParser.copyState(this.state), 
                        ], 
                    ]), this.chunks.push(tree), this.chunkPos.push(this.chunkStart - this.ranges[0].from), this.chunk = [], this.chunkReused = void 0, this.chunkStart = this.parsedPos;
                }
                finish() {
                    return new Tree(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
                }
            }
            function readToken(token, stream, state) {
                stream.start = stream.pos;
                for(let i = 0; i < 10; i++){
                    let result = token(stream, state);
                    if (stream.pos > stream.start) return result;
                }
                throw new Error("Stream parser failed to advance stream.");
            }
            const noTokens = Object.create(null), typeArray = [
                dist_NodeType.none
            ], nodeSet1 = new NodeSet(typeArray), warned = [], defaultTable = Object.create(null);
            for (let [legacyName, name1] of [
                [
                    "variable",
                    "variableName"
                ],
                [
                    "variable-2",
                    "variableName.special"
                ],
                [
                    "string-2",
                    "string.special"
                ],
                [
                    "def",
                    "variableName.definition"
                ],
                [
                    "tag",
                    "typeName"
                ],
                [
                    "attribute",
                    "propertyName"
                ],
                [
                    "type",
                    "typeName"
                ],
                [
                    "builtin",
                    "variableName.standard"
                ],
                [
                    "qualifier",
                    "modifier"
                ],
                [
                    "error",
                    "invalid"
                ],
                [
                    "header",
                    "heading"
                ],
                [
                    "property",
                    "propertyName"
                ], 
            ])defaultTable[legacyName] = createTokenType(noTokens, name1);
            class TokenTable {
                constructor(extra){
                    this.extra = extra, this.table = Object.assign(Object.create(null), defaultTable);
                }
                resolve(tag) {
                    return tag ? this.table[tag] || (this.table[tag] = createTokenType(this.extra, tag)) : 0;
                }
            }
            const defaultTokenTable = new TokenTable(noTokens);
            function warnForPart(part, msg) {
                warned.indexOf(part) > -1 || (warned.push(part), console.warn(msg));
            }
            function createTokenType(extra, tagStr) {
                let tag = null;
                for (let part of tagStr.split(".")){
                    let value = extra[part] || tags1[part];
                    value ? "function" == typeof value ? tag ? tag = value(tag) : warnForPart(part, `Modifier ${part} used at start of tag`) : tag ? warnForPart(part, `Tag ${part} used as modifier`) : tag = value : warnForPart(part, `Unknown highlighting tag ${part}`);
                }
                if (!tag) return 0;
                let name = tagStr.replace(/ /g, "_"), type = dist_NodeType.define({
                    id: typeArray.length,
                    name,
                    props: [
                        styleTags({
                            [name]: tag
                        })
                    ]
                });
                return typeArray.push(type), type.id;
            }
            function docID(data) {
                let type = NodeType.define({
                    id: typeArray.length,
                    name: "Document",
                    props: [
                        languageDataProp.add(()=>data
                        )
                    ]
                });
                return typeArray.push(type), type;
            }
            function command1(f, option) {
                return ({ state , dispatch  })=>{
                    if (state.readOnly) return !1;
                    let tr = f(option, state);
                    return !!tr && (dispatch(state.update(tr)), !0);
                };
            }
            const toggleLineComment = command1(changeLineComment, 0), toggleBlockComment = command1(changeBlockComment, 0), toggleBlockCommentByLine = command1((o, s)=>changeBlockComment(o, s, selectedLineRanges(s))
            , 0);
            function getConfig(state, pos = state.selection.main.head) {
                let data = state.languageDataAt("commentTokens", pos);
                return data.length ? data[0] : {};
            }
            const SearchMargin = 50;
            function findBlockComment(state, { open , close  }, from, to) {
                let textBefore = state.sliceDoc(from - SearchMargin, from), textAfter = state.sliceDoc(to, to + SearchMargin), spaceBefore = /\s*$/.exec(textBefore)[0].length, spaceAfter = /^\s*/.exec(textAfter)[0].length, beforeOff = textBefore.length - spaceBefore;
                if (textBefore.slice(beforeOff - open.length, beforeOff) == open && textAfter.slice(spaceAfter, spaceAfter + close.length) == close) return {
                    open: {
                        pos: from - spaceBefore,
                        margin: spaceBefore && 1
                    },
                    close: {
                        pos: to + spaceAfter,
                        margin: spaceAfter && 1
                    }
                };
                let startText, endText;
                to - from <= 2 * SearchMargin ? startText = endText = state.sliceDoc(from, to) : (startText = state.sliceDoc(from, from + SearchMargin), endText = state.sliceDoc(to - SearchMargin, to));
                let startSpace = /^\s*/.exec(startText)[0].length, endSpace = /\s*$/.exec(endText)[0].length, endOff = endText.length - endSpace - close.length;
                return startText.slice(startSpace, startSpace + open.length) == open && endText.slice(endOff, endOff + close.length) == close ? {
                    open: {
                        pos: from + startSpace + open.length,
                        margin: /\s/.test(startText.charAt(startSpace + open.length)) ? 1 : 0
                    },
                    close: {
                        pos: to - endSpace - close.length,
                        margin: /\s/.test(endText.charAt(endOff - 1)) ? 1 : 0
                    }
                } : null;
            }
            function selectedLineRanges(state) {
                let ranges = [];
                for (let r of state.selection.ranges){
                    let fromLine = state.doc.lineAt(r.from), toLine = r.to <= fromLine.to ? fromLine : state.doc.lineAt(r.to), last = ranges.length - 1;
                    last >= 0 && ranges[last].to > fromLine.from ? ranges[last].to = toLine.to : ranges.push({
                        from: fromLine.from,
                        to: toLine.to
                    });
                }
                return ranges;
            }
            function changeBlockComment(option, state, ranges = state.selection.ranges) {
                let tokens = ranges.map((r)=>getConfig(state, r.from).block
                );
                if (!tokens.every((c)=>c
                )) return null;
                let comments = ranges.map((r, i)=>findBlockComment(state, tokens[i], r.from, r.to)
                );
                if (2 != option && !comments.every((c)=>c
                )) return {
                    changes: state.changes(ranges.map((range, i)=>comments[i] ? [] : [
                            {
                                from: range.from,
                                insert: tokens[i].open + " "
                            },
                            {
                                from: range.to,
                                insert: " " + tokens[i].close
                            }, 
                        ]
                    ))
                };
                if (1 != option && comments.some((c)=>c
                )) {
                    let changes = [];
                    for(let i = 0, comment; i < comments.length; i++)if (comment = comments[i]) {
                        let token = tokens[i], { open , close  } = comment;
                        changes.push({
                            from: open.pos - token.open.length,
                            to: open.pos + open.margin
                        }, {
                            from: close.pos - close.margin,
                            to: close.pos + token.close.length
                        });
                    }
                    return {
                        changes
                    };
                }
                return null;
            }
            function changeLineComment(option, state, ranges = state.selection.ranges) {
                let lines = [], prevLine = -1;
                for (let { from , to  } of ranges){
                    let startI = lines.length, minIndent = 1e9;
                    for(let pos = from; pos <= to;){
                        let line = state.doc.lineAt(pos);
                        if (line.from > prevLine && (from == to || to > line.from)) {
                            prevLine = line.from;
                            let token = getConfig(state, pos).line;
                            if (!token) continue;
                            let indent = /^\s*/.exec(line.text)[0].length, empty = indent == line.length, comment = line.text.slice(indent, indent + token.length) == token ? indent : -1;
                            indent < line.text.length && indent < minIndent && (minIndent = indent), lines.push({
                                line,
                                comment,
                                token,
                                indent,
                                empty,
                                single: !1
                            });
                        }
                        pos = line.to + 1;
                    }
                    if (minIndent < 1e9) for(let i = startI; i < lines.length; i++)lines[i].indent < lines[i].line.text.length && (lines[i].indent = minIndent);
                    lines.length == startI + 1 && (lines[startI].single = !0);
                }
                if (2 != option && lines.some((l)=>l.comment < 0 && (!l.empty || l.single)
                )) {
                    let changes = [];
                    for (let { line , token , indent , empty , single  } of lines)(single || !empty) && changes.push({
                        from: line.from + indent,
                        insert: token + " "
                    });
                    let changeSet = state.changes(changes);
                    return {
                        changes: changeSet,
                        selection: state.selection.map(changeSet, 1)
                    };
                }
                if (1 != option && lines.some((l)=>l.comment >= 0
                )) {
                    let changes = [];
                    for (let { line , comment , token  } of lines)if (comment >= 0) {
                        let from = line.from + comment, to = from + token.length;
                        " " == line.text[to - line.from] && to++, changes.push({
                            from,
                            to
                        });
                    }
                    return {
                        changes
                    };
                }
                return null;
            }
            const fromHistory = state_dist.q6.define(), isolateHistory = state_dist.q6.define(), invertedEffects = state_dist.r$.define(), historyConfig = state_dist.r$.define({
                combine: (configs)=>(0, state_dist.BO)(configs, {
                        minDepth: 100,
                        newGroupDelay: 500
                    }, {
                        minDepth: Math.max,
                        newGroupDelay: Math.min
                    })
            });
            function changeEnd(changes) {
                let end = 0;
                return changes.iterChangedRanges((_, to)=>end = to
                ), end;
            }
            const historyField_ = state_dist.QQ.define({
                create: ()=>HistoryState.empty
                ,
                update (state, tr) {
                    let config = tr.state.facet(historyConfig), fromHist = tr.annotation(fromHistory);
                    if (fromHist) {
                        let selection = tr.docChanged ? state_dist.jT.single(changeEnd(tr.changes)) : void 0, item = HistEvent.fromTransaction(tr, selection), from = fromHist.side, other = 0 == from ? state.undone : state.done;
                        return other = item ? updateBranch(other, other.length, config.minDepth, item) : addSelection(other, tr.startState.selection), new HistoryState(0 == from ? fromHist.rest : other, 0 == from ? other : fromHist.rest);
                    }
                    let isolate = tr.annotation(isolateHistory);
                    if (("full" == isolate || "before" == isolate) && (state = state.isolate()), !1 === tr.annotation(state_dist.YW.addToHistory)) return tr.changes.empty ? state : state.addMapping(tr.changes.desc);
                    let event = HistEvent.fromTransaction(tr), time = tr.annotation(state_dist.YW.time), userEvent = tr.annotation(state_dist.YW.userEvent);
                    return event ? state = state.addChanges(event, time, userEvent, config.newGroupDelay, config.minDepth) : tr.selection && (state = state.addSelection(tr.startState.selection, time, userEvent, config.newGroupDelay)), ("full" == isolate || "after" == isolate) && (state = state.isolate()), state;
                },
                toJSON: (value)=>({
                        done: value.done.map((e)=>e.toJSON()
                        ),
                        undone: value.undone.map((e)=>e.toJSON()
                        )
                    })
                ,
                fromJSON: (json)=>new HistoryState(json.done.map(HistEvent.fromJSON), json.undone.map(HistEvent.fromJSON))
            });
            function dist_history(config = {}) {
                return [
                    historyField_,
                    historyConfig.of(config),
                    dist.tk.domEventHandlers({
                        beforeinput (e, view) {
                            let command = "historyUndo" == e.inputType ? undo : "historyRedo" == e.inputType ? redo : null;
                            return !!command && (e.preventDefault(), command(view));
                        }
                    }), 
                ];
            }
            function cmd(side, selection) {
                return function({ state , dispatch  }) {
                    if (!selection && state.readOnly) return !1;
                    let historyState = state.field(historyField_, !1);
                    if (!historyState) return !1;
                    let tr = historyState.pop(side, state, selection);
                    return !!tr && (dispatch(tr), !0);
                };
            }
            const undo = cmd(0, !1), redo = cmd(1, !1), undoSelection = cmd(0, !0), redoSelection = cmd(1, !0);
            class HistEvent {
                constructor(changes, effects, mapped, startSelection, selectionsAfter){
                    this.changes = changes, this.effects = effects, this.mapped = mapped, this.startSelection = startSelection, this.selectionsAfter = selectionsAfter;
                }
                setSelAfter(after) {
                    return new HistEvent(this.changes, this.effects, this.mapped, this.startSelection, after);
                }
                toJSON() {
                    var _a, _b, _c;
                    return {
                        changes: null === (_a = this.changes) || void 0 === _a ? void 0 : _a.toJSON(),
                        mapped: null === (_b = this.mapped) || void 0 === _b ? void 0 : _b.toJSON(),
                        startSelection: null === (_c = this.startSelection) || void 0 === _c ? void 0 : _c.toJSON(),
                        selectionsAfter: this.selectionsAfter.map((s)=>s.toJSON()
                        )
                    };
                }
                static fromJSON(json) {
                    return new HistEvent(json.changes && state_dist.as.fromJSON(json.changes), [], json.mapped && state_dist.n0.fromJSON(json.mapped), json.startSelection && state_dist.jT.fromJSON(json.startSelection), json.selectionsAfter.map(state_dist.jT.fromJSON));
                }
                static fromTransaction(tr, selection) {
                    let effects = none;
                    for (let invert of tr.startState.facet(invertedEffects)){
                        let result = invert(tr);
                        result.length && (effects = effects.concat(result));
                    }
                    return !effects.length && tr.changes.empty ? null : new HistEvent(tr.changes.invert(tr.startState.doc), effects, void 0, selection || tr.startState.selection, none);
                }
                static selection(selections) {
                    return new HistEvent(void 0, none, void 0, void 0, selections);
                }
            }
            function updateBranch(branch, to, maxLen, newEvent) {
                let newBranch = branch.slice(to + 1 > maxLen + 20 ? to - maxLen - 1 : 0, to);
                return newBranch.push(newEvent), newBranch;
            }
            function isAdjacent1(a, b) {
                let ranges = [], isAdjacent = !1;
                return a.iterChangedRanges((f, t)=>ranges.push(f, t)
                ), b.iterChangedRanges((_f, _t, f, t)=>{
                    for(let i = 0; i < ranges.length;){
                        let from = ranges[i++], to = ranges[i++];
                        t >= from && f <= to && (isAdjacent = !0);
                    }
                }), isAdjacent;
            }
            function eqSelectionShape(a, b) {
                return a.ranges.length == b.ranges.length && 0 === a.ranges.filter((r, i)=>r.empty != b.ranges[i].empty
                ).length;
            }
            function conc(a, b) {
                return a.length ? b.length ? a.concat(b) : a : b;
            }
            const none = [], MaxSelectionsPerEvent = 200;
            function addSelection(branch, selection) {
                if (!branch.length) return [
                    HistEvent.selection([
                        selection
                    ])
                ];
                {
                    let lastEvent = branch[branch.length - 1], sels = lastEvent.selectionsAfter.slice(Math.max(0, lastEvent.selectionsAfter.length - MaxSelectionsPerEvent));
                    return sels.length && sels[sels.length - 1].eq(selection) ? branch : (sels.push(selection), updateBranch(branch, branch.length - 1, 1e9, lastEvent.setSelAfter(sels)));
                }
            }
            function popSelection(branch) {
                let last = branch[branch.length - 1], newBranch = branch.slice();
                return newBranch[branch.length - 1] = last.setSelAfter(last.selectionsAfter.slice(0, last.selectionsAfter.length - 1)), newBranch;
            }
            function addMappingToBranch(branch, mapping) {
                if (!branch.length) return branch;
                let length = branch.length, selections = none;
                for(; length;){
                    let event = mapEvent(branch[length - 1], mapping, selections);
                    if (event.changes && !event.changes.empty || event.effects.length) {
                        let result = branch.slice(0, length);
                        return result[length - 1] = event, result;
                    }
                    mapping = event.mapped, length--, selections = event.selectionsAfter;
                }
                return selections.length ? [
                    HistEvent.selection(selections)
                ] : none;
            }
            function mapEvent(event, mapping, extraSelections) {
                let selections = conc(event.selectionsAfter.length ? event.selectionsAfter.map((s)=>s.map(mapping)
                ) : none, extraSelections);
                if (!event.changes) return HistEvent.selection(selections);
                let mappedChanges = event.changes.map(mapping), before = mapping.mapDesc(event.changes, !0), fullMapping = event.mapped ? event.mapped.composeDesc(before) : before;
                return new HistEvent(mappedChanges, state_dist.Py.mapEffects(event.effects, mapping), fullMapping, event.startSelection.map(before), selections);
            }
            const joinableUserEvent = /^(input\.type|delete)($|\.)/;
            class HistoryState {
                constructor(done, undone, prevTime = 0, prevUserEvent){
                    this.done = done, this.undone = undone, this.prevTime = prevTime, this.prevUserEvent = prevUserEvent;
                }
                isolate() {
                    return this.prevTime ? new HistoryState(this.done, this.undone) : this;
                }
                addChanges(event, time, userEvent, newGroupDelay, maxLen) {
                    let done = this.done, lastEvent = done[done.length - 1];
                    return done = lastEvent && lastEvent.changes && !lastEvent.changes.empty && event.changes && (!userEvent || joinableUserEvent.test(userEvent)) && (!lastEvent.selectionsAfter.length && time - this.prevTime < newGroupDelay && isAdjacent1(lastEvent.changes, event.changes) || "input.type.compose" == userEvent) ? updateBranch(done, done.length - 1, maxLen, new HistEvent(event.changes.compose(lastEvent.changes), conc(event.effects, lastEvent.effects), lastEvent.mapped, lastEvent.startSelection, none)) : updateBranch(done, done.length, maxLen, event), new HistoryState(done, none, time, userEvent);
                }
                addSelection(selection, time, userEvent, newGroupDelay) {
                    let last = this.done.length ? this.done[this.done.length - 1].selectionsAfter : none;
                    return last.length > 0 && time - this.prevTime < newGroupDelay && userEvent == this.prevUserEvent && userEvent && /^select($|\.)/.test(userEvent) && eqSelectionShape(last[last.length - 1], selection) ? this : new HistoryState(addSelection(this.done, selection), this.undone, time, userEvent);
                }
                addMapping(mapping) {
                    return new HistoryState(addMappingToBranch(this.done, mapping), addMappingToBranch(this.undone, mapping), this.prevTime, this.prevUserEvent);
                }
                pop(side, state, selection) {
                    let branch = 0 == side ? this.done : this.undone;
                    if (0 == branch.length) return null;
                    let event = branch[branch.length - 1];
                    if (selection && event.selectionsAfter.length) return state.update({
                        selection: event.selectionsAfter[event.selectionsAfter.length - 1],
                        annotations: fromHistory.of({
                            side,
                            rest: popSelection(branch)
                        }),
                        userEvent: 0 == side ? "select.undo" : "select.redo",
                        scrollIntoView: !0
                    });
                    {
                        if (!event.changes) return null;
                        let rest = 1 == branch.length ? none : branch.slice(0, branch.length - 1);
                        return event.mapped && (rest = addMappingToBranch(rest, event.mapped)), state.update({
                            changes: event.changes,
                            selection: event.startSelection,
                            effects: event.effects,
                            annotations: fromHistory.of({
                                side,
                                rest
                            }),
                            filter: !1,
                            userEvent: 0 == side ? "undo" : "redo",
                            scrollIntoView: !0
                        });
                    }
                }
            }
            function updateSel(sel, by) {
                return state_dist.jT.create(sel.ranges.map(by), sel.mainIndex);
            }
            function setSel(state, selection) {
                return state.update({
                    selection,
                    scrollIntoView: !0,
                    userEvent: "select"
                });
            }
            function moveSel({ state , dispatch  }, how) {
                let selection = updateSel(state.selection, how);
                return !selection.eq(state.selection) && (dispatch(setSel(state, selection)), !0);
            }
            function rangeEnd1(range, forward) {
                return state_dist.jT.cursor(forward ? range.to : range.from);
            }
            function cursorByChar(view, forward) {
                return moveSel(view, (range)=>range.empty ? view.moveByChar(range, forward) : rangeEnd1(range, forward)
                );
            }
            function ltrAtCursor(view) {
                return view.textDirectionAt(view.state.selection.main.head) == dist.Nm.LTR;
            }
            HistoryState.empty = new HistoryState(none, none);
            const cursorCharLeft = (view)=>cursorByChar(view, !ltrAtCursor(view))
            , cursorCharRight = (view)=>cursorByChar(view, ltrAtCursor(view))
            ;
            function cursorByGroup(view, forward) {
                return moveSel(view, (range)=>range.empty ? view.moveByGroup(range, forward) : rangeEnd1(range, forward)
                );
            }
            function interestingNode(state, node, bracketProp) {
                if (node.type.prop(bracketProp)) return !0;
                let len = node.to - node.from;
                return len && (len > 2 || /[^\s,.;:]/.test(state.sliceDoc(node.from, node.to))) || node.firstChild;
            }
            function moveBySyntax(state, start, forward) {
                let pos = dist_syntaxTree(state).resolveInner(start.head), bracketProp = forward ? dist_NodeProp.closedBy : dist_NodeProp.openedBy;
                for(let at = start.head;;){
                    let next = forward ? pos.childAfter(at) : pos.childBefore(at);
                    if (!next) break;
                    interestingNode(state, next, bracketProp) ? pos = next : at = forward ? next.to : next.from;
                }
                let match, newPos;
                return newPos = pos.type.prop(bracketProp) && (match = forward ? matchBrackets(state, pos.from, 1) : matchBrackets(state, pos.to, -1)) && match.matched ? forward ? match.end.to : match.end.from : forward ? pos.to : pos.from, state_dist.jT.cursor(newPos, forward ? -1 : 1);
            }
            function cursorByLine(view, forward) {
                return moveSel(view, (range)=>{
                    if (!range.empty) return rangeEnd1(range, forward);
                    let moved = view.moveVertically(range, forward);
                    return moved.head != range.head ? moved : view.moveToLineBoundary(range, forward);
                });
            }
            const cursorLineUp = (view)=>cursorByLine(view, !1)
            , cursorLineDown = (view)=>cursorByLine(view, !0)
            ;
            function cursorByPage(view, forward) {
                let { state  } = view, selection = updateSel(state.selection, (range)=>range.empty ? view.moveVertically(range, forward, Math.min(view.dom.clientHeight, innerHeight)) : rangeEnd1(range, forward)
                );
                if (selection.eq(state.selection)) return !1;
                let startPos = view.coordsAtPos(state.selection.main.head), scrollRect = view.scrollDOM.getBoundingClientRect(), effect;
                return startPos && startPos.top > scrollRect.top && startPos.bottom < scrollRect.bottom && startPos.top - scrollRect.top <= view.scrollDOM.scrollHeight - view.scrollDOM.scrollTop - view.scrollDOM.clientHeight && (effect = dist.tk.scrollIntoView(selection.main.head, {
                    y: "start",
                    yMargin: startPos.top - scrollRect.top
                })), view.dispatch(setSel(state, selection), {
                    effects: effect
                }), !0;
            }
            const cursorPageUp = (view)=>cursorByPage(view, !1)
            , cursorPageDown = (view)=>cursorByPage(view, !0)
            ;
            function moveByLineBoundary(view, start, forward) {
                let line = view.lineBlockAt(start.head), moved = view.moveToLineBoundary(start, forward);
                if (moved.head == start.head && moved.head != (forward ? line.to : line.from) && (moved = view.moveToLineBoundary(start, forward, !1)), !forward && moved.head == line.from && line.length) {
                    let space = /^\s*/.exec(view.state.sliceDoc(line.from, Math.min(line.from + 100, line.to)))[0].length;
                    space && start.head != line.from + space && (moved = state_dist.jT.cursor(line.from + space));
                }
                return moved;
            }
            const cursorLineBoundaryForward = (view)=>moveSel(view, (range)=>moveByLineBoundary(view, range, !0)
                )
            , cursorLineBoundaryBackward = (view)=>moveSel(view, (range)=>moveByLineBoundary(view, range, !1)
                )
            ;
            function toMatchingBracket(state, dispatch, extend) {
                let found = !1, selection = updateSel(state.selection, (range)=>{
                    let matching = matchBrackets(state, range.head, -1) || matchBrackets(state, range.head, 1) || range.head > 0 && matchBrackets(state, range.head - 1, 1) || range.head < state.doc.length && matchBrackets(state, range.head + 1, -1);
                    if (!matching || !matching.end) return range;
                    found = !0;
                    let head = matching.start.from == range.head ? matching.end.to : matching.end.from;
                    return extend ? state_dist.jT.range(range.anchor, head) : state_dist.jT.cursor(head);
                });
                return !!found && (dispatch(setSel(state, selection)), !0);
            }
            function extendSel(view, how) {
                let selection = updateSel(view.state.selection, (range)=>{
                    let head = how(range);
                    return state_dist.jT.range(range.anchor, head.head, head.goalColumn);
                });
                return !selection.eq(view.state.selection) && (view.dispatch(setSel(view.state, selection)), !0);
            }
            function selectByChar(view, forward) {
                return extendSel(view, (range)=>view.moveByChar(range, forward)
                );
            }
            const selectCharLeft = (view)=>selectByChar(view, !ltrAtCursor(view))
            , selectCharRight = (view)=>selectByChar(view, ltrAtCursor(view))
            ;
            function selectByGroup(view, forward) {
                return extendSel(view, (range)=>view.moveByGroup(range, forward)
                );
            }
            function selectByLine(view, forward) {
                return extendSel(view, (range)=>view.moveVertically(range, forward)
                );
            }
            const selectLineUp = (view)=>selectByLine(view, !1)
            , selectLineDown = (view)=>selectByLine(view, !0)
            ;
            function selectByPage(view, forward) {
                return extendSel(view, (range)=>view.moveVertically(range, forward, Math.min(view.dom.clientHeight, innerHeight))
                );
            }
            const selectPageUp = (view)=>selectByPage(view, !1)
            , selectPageDown = (view)=>selectByPage(view, !0)
            , selectLineBoundaryForward = (view)=>extendSel(view, (range)=>moveByLineBoundary(view, range, !0)
                )
            , selectLineBoundaryBackward = (view)=>extendSel(view, (range)=>moveByLineBoundary(view, range, !1)
                )
            , cursorDocStart = ({ state , dispatch  })=>(dispatch(setSel(state, {
                    anchor: 0
                })), !0)
            , cursorDocEnd = ({ state , dispatch  })=>(dispatch(setSel(state, {
                    anchor: state.doc.length
                })), !0)
            , selectDocStart = ({ state , dispatch  })=>(dispatch(setSel(state, {
                    anchor: state.selection.main.anchor,
                    head: 0
                })), !0)
            , selectDocEnd = ({ state , dispatch  })=>(dispatch(setSel(state, {
                    anchor: state.selection.main.anchor,
                    head: state.doc.length
                })), !0)
            ;
            function deleteBy({ state , dispatch  }, by) {
                if (state.readOnly) return !1;
                let event = "delete.selection", changes = state.changeByRange((range)=>{
                    let { from , to  } = range;
                    if (from == to) {
                        let towards = by(from);
                        towards < from ? event = "delete.backward" : towards > from && (event = "delete.forward"), from = Math.min(from, towards), to = Math.max(to, towards);
                    }
                    return from == to ? {
                        range
                    } : {
                        changes: {
                            from,
                            to
                        },
                        range: state_dist.jT.cursor(from)
                    };
                });
                return !changes.changes.empty && (dispatch(state.update(changes, {
                    scrollIntoView: !0,
                    userEvent: event
                })), !0);
            }
            function skipAtomic(target, pos, forward) {
                if (target instanceof dist.tk) for (let ranges of target.state.facet(dist.tk.atomicRanges).map((f)=>f(target)
                ))ranges.between(pos, pos, (from, to)=>{
                    from < pos && to > pos && (pos = forward ? to : from);
                });
                return pos;
            }
            const deleteByChar = (target, forward)=>deleteBy(target, (pos)=>{
                    let { state  } = target, line = state.doc.lineAt(pos), before, targetPos;
                    if (!forward && pos > line.from && pos < line.from + 200 && !/[^ \t]/.test(before = line.text.slice(0, pos - line.from))) {
                        if ("\t" == before[before.length - 1]) return pos - 1;
                        let drop = (0, state_dist.IS)(before, state.tabSize) % getIndentUnit(state) || getIndentUnit(state);
                        for(let i = 0; i < drop && " " == before[before.length - 1 - i]; i++)pos--;
                        targetPos = pos;
                    } else (targetPos = (0, state_dist.cp)(line.text, pos - line.from, forward, forward) + line.from) == pos && line.number != (forward ? state.doc.lines : 1) && (targetPos += forward ? 1 : -1);
                    return skipAtomic(target, targetPos, forward);
                })
            , deleteCharBackward = (view)=>deleteByChar(view, !1)
            , deleteCharForward = (view)=>deleteByChar(view, !0)
            , deleteByGroup = (target, forward)=>deleteBy(target, (start)=>{
                    let pos = start, { state  } = target, line = state.doc.lineAt(pos), categorize = state.charCategorizer(pos);
                    for(let cat = null;;){
                        if (pos == (forward ? line.to : line.from)) {
                            pos == start && line.number != (forward ? state.doc.lines : 1) && (pos += forward ? 1 : -1);
                            break;
                        }
                        let next = (0, state_dist.cp)(line.text, pos - line.from, forward) + line.from, nextChar = line.text.slice(Math.min(pos, next) - line.from, Math.max(pos, next) - line.from), nextCat = categorize(nextChar);
                        if (null != cat && nextCat != cat) break;
                        (" " != nextChar || pos != start) && (cat = nextCat), pos = next;
                    }
                    return skipAtomic(target, pos, forward);
                })
            , deleteGroupBackward = (target)=>deleteByGroup(target, !1)
            , deleteToLineEnd = (view)=>deleteBy(view, (pos)=>{
                    let lineEnd = view.lineBlockAt(pos).to;
                    return skipAtomic(view, pos < lineEnd ? lineEnd : Math.min(view.state.doc.length, pos + 1), !0);
                })
            ;
            function selectedLineBlocks(state) {
                let blocks = [], upto = -1;
                for (let range of state.selection.ranges){
                    let startLine = state.doc.lineAt(range.from), endLine = state.doc.lineAt(range.to);
                    if (range.empty || range.to != endLine.from || (endLine = state.doc.lineAt(range.to - 1)), upto >= startLine.number) {
                        let prev = blocks[blocks.length - 1];
                        prev.to = endLine.to, prev.ranges.push(range);
                    } else blocks.push({
                        from: startLine.from,
                        to: endLine.to,
                        ranges: [
                            range
                        ]
                    });
                    upto = endLine.number + 1;
                }
                return blocks;
            }
            function moveLine(state, dispatch, forward) {
                if (state.readOnly) return !1;
                let changes = [], ranges = [];
                for (let block of selectedLineBlocks(state)){
                    if (forward ? block.to == state.doc.length : 0 == block.from) continue;
                    let nextLine = state.doc.lineAt(forward ? block.to + 1 : block.from - 1), size = nextLine.length + 1;
                    if (forward) for (let r of (changes.push({
                        from: block.to,
                        to: nextLine.to
                    }, {
                        from: block.from,
                        insert: nextLine.text + state.lineBreak
                    }), block.ranges))ranges.push(state_dist.jT.range(Math.min(state.doc.length, r.anchor + size), Math.min(state.doc.length, r.head + size)));
                    else for (let r1 of (changes.push({
                        from: nextLine.from,
                        to: block.from
                    }, {
                        from: block.to,
                        insert: state.lineBreak + nextLine.text
                    }), block.ranges))ranges.push(state_dist.jT.range(r1.anchor - size, r1.head - size));
                }
                return !!changes.length && (dispatch(state.update({
                    changes,
                    scrollIntoView: !0,
                    selection: state_dist.jT.create(ranges, state.selection.mainIndex),
                    userEvent: "move.line"
                })), !0);
            }
            function copyLine(state, dispatch, forward) {
                if (state.readOnly) return !1;
                let changes = [];
                for (let block of selectedLineBlocks(state))forward ? changes.push({
                    from: block.from,
                    insert: state.doc.slice(block.from, block.to) + state.lineBreak
                }) : changes.push({
                    from: block.to,
                    insert: state.lineBreak + state.doc.slice(block.from, block.to)
                });
                return dispatch(state.update({
                    changes,
                    scrollIntoView: !0,
                    userEvent: "input.copyline"
                })), !0;
            }
            function isBetweenBrackets(state, pos) {
                if (/\(\)|\[\]|\{\}/.test(state.sliceDoc(pos - 1, pos + 1))) return {
                    from: pos,
                    to: pos
                };
                let context = dist_syntaxTree(state).resolveInner(pos), before = context.childBefore(pos), after = context.childAfter(pos), closedBy;
                return before && after && before.to <= pos && after.from >= pos && (closedBy = before.type.prop(dist_NodeProp.closedBy)) && closedBy.indexOf(after.name) > -1 && state.doc.lineAt(before.to).from == state.doc.lineAt(after.from).from ? {
                    from: before.to,
                    to: after.from
                } : null;
            }
            const insertNewlineAndIndent = newlineAndIndent(!1), insertBlankLine = newlineAndIndent(!0);
            function newlineAndIndent(atEof) {
                return ({ state , dispatch  })=>{
                    if (state.readOnly) return !1;
                    let changes = state.changeByRange((range)=>{
                        let { from , to  } = range, line = state.doc.lineAt(from), explode = !atEof && from == to && isBetweenBrackets(state, from);
                        atEof && (from = to = (to <= line.to ? line : state.doc.lineAt(to)).to);
                        let cx = new IndentContext(state, {
                            simulateBreak: from,
                            simulateDoubleBreak: !!explode
                        }), indent = getIndentation(cx, from);
                        for(null == indent && (indent = /^\s*/.exec(state.doc.lineAt(from).text)[0].length); to < line.to && /\s/.test(line.text[to - line.from]);)to++;
                        explode ? { from , to  } = explode : from > line.from && from < line.from + 100 && !/\S/.test(line.text.slice(0, from)) && (from = line.from);
                        let insert = [
                            "",
                            indentString(state, indent)
                        ];
                        return explode && insert.push(indentString(state, cx.lineIndent(line.from, -1))), {
                            changes: {
                                from,
                                to,
                                insert: state_dist.xv.of(insert)
                            },
                            range: state_dist.jT.cursor(from + 1 + insert[1].length)
                        };
                    });
                    return dispatch(state.update(changes, {
                        scrollIntoView: !0,
                        userEvent: "input"
                    })), !0;
                };
            }
            function changeBySelectedLine(state, f) {
                let atLine = -1;
                return state.changeByRange((range)=>{
                    let changes = [];
                    for(let pos = range.from; pos <= range.to;){
                        let line = state.doc.lineAt(pos);
                        line.number > atLine && (range.empty || range.to > line.from) && (f(line, changes, range), atLine = line.number), pos = line.to + 1;
                    }
                    let changeSet = state.changes(changes);
                    return {
                        changes,
                        range: state_dist.jT.range(changeSet.mapPos(range.anchor, 1), changeSet.mapPos(range.head, 1))
                    };
                });
            }
            const indentMore = ({ state , dispatch  })=>!state.readOnly && (dispatch(state.update(changeBySelectedLine(state, (line, changes)=>{
                    changes.push({
                        from: line.from,
                        insert: state.facet(dist_indentUnit)
                    });
                }), {
                    userEvent: "input.indent"
                })), !0)
            , indentLess = ({ state , dispatch  })=>!state.readOnly && (dispatch(state.update(changeBySelectedLine(state, (line, changes)=>{
                    let space = /^\s*/.exec(line.text)[0];
                    if (!space) return;
                    let col = (0, state_dist.IS)(space, state.tabSize), keep = 0, insert = indentString(state, Math.max(0, col - getIndentUnit(state)));
                    for(; keep < space.length && keep < insert.length && space.charCodeAt(keep) == insert.charCodeAt(keep);)keep++;
                    changes.push({
                        from: line.from + keep,
                        to: line.from + space.length,
                        insert: insert.slice(keep)
                    });
                }), {
                    userEvent: "delete.dedent"
                })), !0)
            , standardKeymap = [
                {
                    key: "ArrowLeft",
                    run: cursorCharLeft,
                    shift: selectCharLeft,
                    preventDefault: !0
                },
                {
                    key: "Mod-ArrowLeft",
                    mac: "Alt-ArrowLeft",
                    run: (view)=>cursorByGroup(view, !ltrAtCursor(view))
                    ,
                    shift: (view)=>selectByGroup(view, !ltrAtCursor(view))
                },
                {
                    mac: "Cmd-ArrowLeft",
                    run: cursorLineBoundaryBackward,
                    shift: selectLineBoundaryBackward
                },
                {
                    key: "ArrowRight",
                    run: cursorCharRight,
                    shift: selectCharRight,
                    preventDefault: !0
                },
                {
                    key: "Mod-ArrowRight",
                    mac: "Alt-ArrowRight",
                    run: (view)=>cursorByGroup(view, ltrAtCursor(view))
                    ,
                    shift: (view)=>selectByGroup(view, ltrAtCursor(view))
                },
                {
                    mac: "Cmd-ArrowRight",
                    run: cursorLineBoundaryForward,
                    shift: selectLineBoundaryForward
                },
                {
                    key: "ArrowUp",
                    run: cursorLineUp,
                    shift: selectLineUp,
                    preventDefault: !0
                },
                {
                    mac: "Cmd-ArrowUp",
                    run: cursorDocStart,
                    shift: selectDocStart
                },
                {
                    mac: "Ctrl-ArrowUp",
                    run: cursorPageUp,
                    shift: selectPageUp
                },
                {
                    key: "ArrowDown",
                    run: cursorLineDown,
                    shift: selectLineDown,
                    preventDefault: !0
                },
                {
                    mac: "Cmd-ArrowDown",
                    run: cursorDocEnd,
                    shift: selectDocEnd
                },
                {
                    mac: "Ctrl-ArrowDown",
                    run: cursorPageDown,
                    shift: selectPageDown
                },
                {
                    key: "PageUp",
                    run: cursorPageUp,
                    shift: selectPageUp
                },
                {
                    key: "PageDown",
                    run: cursorPageDown,
                    shift: selectPageDown
                },
                {
                    key: "Home",
                    run: cursorLineBoundaryBackward,
                    shift: selectLineBoundaryBackward,
                    preventDefault: !0
                },
                {
                    key: "Mod-Home",
                    run: cursorDocStart,
                    shift: selectDocStart
                },
                {
                    key: "End",
                    run: cursorLineBoundaryForward,
                    shift: selectLineBoundaryForward,
                    preventDefault: !0
                },
                {
                    key: "Mod-End",
                    run: cursorDocEnd,
                    shift: selectDocEnd
                },
                {
                    key: "Enter",
                    run: insertNewlineAndIndent
                },
                {
                    key: "Mod-a",
                    run: ({ state , dispatch  })=>(dispatch(state.update({
                            selection: {
                                anchor: 0,
                                head: state.doc.length
                            },
                            userEvent: "select"
                        })), !0)
                },
                {
                    key: "Backspace",
                    run: deleteCharBackward,
                    shift: deleteCharBackward
                },
                {
                    key: "Delete",
                    run: deleteCharForward
                },
                {
                    key: "Mod-Backspace",
                    mac: "Alt-Backspace",
                    run: deleteGroupBackward
                },
                {
                    key: "Mod-Delete",
                    mac: "Alt-Delete",
                    run: (target)=>deleteByGroup(target, !0)
                },
                {
                    mac: "Mod-Backspace",
                    run: (view)=>deleteBy(view, (pos)=>{
                            let lineStart = view.lineBlockAt(pos).from;
                            return skipAtomic(view, pos > lineStart ? lineStart : Math.max(0, pos - 1), !1);
                        })
                },
                {
                    mac: "Mod-Delete",
                    run: deleteToLineEnd
                }, 
            ].concat([
                {
                    key: "Ctrl-b",
                    run: cursorCharLeft,
                    shift: selectCharLeft,
                    preventDefault: !0
                },
                {
                    key: "Ctrl-f",
                    run: cursorCharRight,
                    shift: selectCharRight
                },
                {
                    key: "Ctrl-p",
                    run: cursorLineUp,
                    shift: selectLineUp
                },
                {
                    key: "Ctrl-n",
                    run: cursorLineDown,
                    shift: selectLineDown
                },
                {
                    key: "Ctrl-a",
                    run: (view)=>moveSel(view, (range)=>state_dist.jT.cursor(view.lineBlockAt(range.head).from, 1)
                        )
                    ,
                    shift: (view)=>extendSel(view, (range)=>state_dist.jT.cursor(view.lineBlockAt(range.head).from)
                        )
                },
                {
                    key: "Ctrl-e",
                    run: (view)=>moveSel(view, (range)=>state_dist.jT.cursor(view.lineBlockAt(range.head).to, -1)
                        )
                    ,
                    shift: (view)=>extendSel(view, (range)=>state_dist.jT.cursor(view.lineBlockAt(range.head).to)
                        )
                },
                {
                    key: "Ctrl-d",
                    run: deleteCharForward
                },
                {
                    key: "Ctrl-h",
                    run: deleteCharBackward
                },
                {
                    key: "Ctrl-k",
                    run: deleteToLineEnd
                },
                {
                    key: "Ctrl-Alt-h",
                    run: deleteGroupBackward
                },
                {
                    key: "Ctrl-o",
                    run ({ state , dispatch  }) {
                        if (state.readOnly) return !1;
                        let changes = state.changeByRange((range)=>({
                                changes: {
                                    from: range.from,
                                    to: range.to,
                                    insert: state_dist.xv.of([
                                        "",
                                        ""
                                    ])
                                },
                                range: state_dist.jT.cursor(range.from)
                            })
                        );
                        return dispatch(state.update(changes, {
                            scrollIntoView: !0,
                            userEvent: "input"
                        })), !0;
                    }
                },
                {
                    key: "Ctrl-t",
                    run ({ state , dispatch  }) {
                        if (state.readOnly) return !1;
                        let changes = state.changeByRange((range)=>{
                            if (!range.empty || 0 == range.from || range.from == state.doc.length) return {
                                range
                            };
                            let pos = range.from, line = state.doc.lineAt(pos), from = pos == line.from ? pos - 1 : (0, state_dist.cp)(line.text, pos - line.from, !1) + line.from, to = pos == line.to ? pos + 1 : (0, state_dist.cp)(line.text, pos - line.from, !0) + line.from;
                            return {
                                changes: {
                                    from,
                                    to,
                                    insert: state.doc.slice(pos, to).append(state.doc.slice(from, pos))
                                },
                                range: state_dist.jT.cursor(to)
                            };
                        });
                        return !changes.changes.empty && (dispatch(state.update(changes, {
                            scrollIntoView: !0,
                            userEvent: "move.character"
                        })), !0);
                    }
                },
                {
                    key: "Ctrl-v",
                    run: cursorPageDown
                }, 
            ].map((b)=>({
                    mac: b.key,
                    run: b.run,
                    shift: b.shift
                })
            )), defaultKeymap = [
                {
                    key: "Alt-ArrowLeft",
                    mac: "Ctrl-ArrowLeft",
                    run: (view)=>moveSel(view, (range)=>moveBySyntax(view.state, range, !ltrAtCursor(view))
                        )
                    ,
                    shift: (view)=>extendSel(view, (range)=>moveBySyntax(view.state, range, !ltrAtCursor(view))
                        )
                },
                {
                    key: "Alt-ArrowRight",
                    mac: "Ctrl-ArrowRight",
                    run: (view)=>moveSel(view, (range)=>moveBySyntax(view.state, range, ltrAtCursor(view))
                        )
                    ,
                    shift: (view)=>extendSel(view, (range)=>moveBySyntax(view.state, range, ltrAtCursor(view))
                        )
                },
                {
                    key: "Alt-ArrowUp",
                    run: ({ state , dispatch  })=>moveLine(state, dispatch, !1)
                },
                {
                    key: "Shift-Alt-ArrowUp",
                    run: ({ state , dispatch  })=>copyLine(state, dispatch, !1)
                },
                {
                    key: "Alt-ArrowDown",
                    run: ({ state , dispatch  })=>moveLine(state, dispatch, !0)
                },
                {
                    key: "Shift-Alt-ArrowDown",
                    run: ({ state , dispatch  })=>copyLine(state, dispatch, !0)
                },
                {
                    key: "Escape",
                    run ({ state , dispatch  }) {
                        let cur = state.selection, selection = null;
                        return cur.ranges.length > 1 ? selection = state_dist.jT.create([
                            cur.main
                        ]) : cur.main.empty || (selection = state_dist.jT.create([
                            state_dist.jT.cursor(cur.main.head), 
                        ])), !!selection && (dispatch(setSel(state, selection)), !0);
                    }
                },
                {
                    key: "Mod-Enter",
                    run: insertBlankLine
                },
                {
                    key: "Alt-l",
                    mac: "Ctrl-l",
                    run ({ state , dispatch  }) {
                        let ranges = selectedLineBlocks(state).map(({ from , to  })=>state_dist.jT.range(from, Math.min(to + 1, state.doc.length))
                        );
                        return dispatch(state.update({
                            selection: state_dist.jT.create(ranges),
                            userEvent: "select"
                        })), !0;
                    }
                },
                {
                    key: "Mod-i",
                    run ({ state , dispatch  }) {
                        let selection = updateSel(state.selection, (range)=>{
                            var _a;
                            let context = dist_syntaxTree(state).resolveInner(range.head, 1);
                            for(; !(context.from < range.from && context.to >= range.to || context.to > range.to && context.from <= range.from || !(null === (_a = context.parent) || void 0 === _a ? void 0 : _a.parent));)context = context.parent;
                            return state_dist.jT.range(context.to, context.from);
                        });
                        return dispatch(setSel(state, selection)), !0;
                    },
                    preventDefault: !0
                },
                {
                    key: "Mod-[",
                    run: indentLess
                },
                {
                    key: "Mod-]",
                    run: indentMore
                },
                {
                    key: "Mod-Alt-\\",
                    run ({ state , dispatch  }) {
                        if (state.readOnly) return !1;
                        let updated = Object.create(null), context = new IndentContext(state, {
                            overrideIndentation (start) {
                                let found = updated[start];
                                return null == found ? -1 : found;
                            }
                        }), changes1 = changeBySelectedLine(state, (line, changes, range)=>{
                            let indent = getIndentation(context, line.from);
                            if (null == indent) return;
                            /\S/.test(line.text) || (indent = 0);
                            let cur = /^\s*/.exec(line.text)[0], norm = indentString(state, indent);
                            (cur != norm || range.from < line.from + cur.length) && (updated[line.from] = indent, changes.push({
                                from: line.from,
                                to: line.from + cur.length,
                                insert: norm
                            }));
                        });
                        return changes1.changes.empty || dispatch(state.update(changes1, {
                            userEvent: "indent"
                        })), !0;
                    }
                },
                {
                    key: "Shift-Mod-k",
                    run (view) {
                        if (view.state.readOnly) return !1;
                        let { state  } = view, changes = state.changes(selectedLineBlocks(state).map(({ from , to  })=>(from > 0 ? from-- : to < state.doc.length && to++, {
                                from,
                                to
                            })
                        )), selection = updateSel(state.selection, (range)=>view.moveVertically(range, !0)
                        ).map(changes);
                        return view.dispatch({
                            changes,
                            selection,
                            scrollIntoView: !0,
                            userEvent: "delete.line"
                        }), !0;
                    }
                },
                {
                    key: "Shift-Mod-\\",
                    run: ({ state , dispatch  })=>toMatchingBracket(state, dispatch, !1)
                },
                {
                    key: "Mod-/",
                    run (target) {
                        let config = getConfig(target.state);
                        return config.line ? toggleLineComment(target) : !!config.block && toggleBlockCommentByLine(target);
                    }
                },
                {
                    key: "Alt-A",
                    run: toggleBlockComment
                }, 
            ].concat(standardKeymap), indentWithTab1 = {
                key: "Tab",
                run: indentMore,
                shift: indentLess
            };
            function crelt() {
                var elt = arguments[0];
                "string" == typeof elt && (elt = document.createElement(elt));
                var i = 1, next = arguments[1];
                if (next && "object" == typeof next && null == next.nodeType && !Array.isArray(next)) {
                    for(var name in next)if (Object.prototype.hasOwnProperty.call(next, name)) {
                        var value = next[name];
                        "string" == typeof value ? elt.setAttribute(name, value) : null != value && (elt[name] = value);
                    }
                    i++;
                }
                for(; i < arguments.length; i++)add1(elt, arguments[i]);
                return elt;
            }
            function add1(elt, child) {
                if ("string" == typeof child) elt.appendChild(document.createTextNode(child));
                else if (null == child) ;
                else if (null != child.nodeType) elt.appendChild(child);
                else if (Array.isArray(child)) for(var i = 0; i < child.length; i++)add1(elt, child[i]);
                else throw new RangeError("Unsupported child node: " + child);
            }
            const basicNormalize = "function" == typeof String.prototype.normalize ? (x)=>x.normalize("NFKD")
             : (x)=>x
            ;
            class SearchCursor {
                constructor(text, query, from = 0, to = text.length, normalize){
                    this.value = {
                        from: 0,
                        to: 0
                    }, this.done = !1, this.matches = [], this.buffer = "", this.bufferPos = 0, this.iter = text.iterRange(from, to), this.bufferStart = from, this.normalize = normalize ? (x)=>normalize(basicNormalize(x))
                     : basicNormalize, this.query = this.normalize(query);
                }
                peek() {
                    if (this.bufferPos == this.buffer.length) {
                        if (this.bufferStart += this.buffer.length, this.iter.next(), this.iter.done) return -1;
                        this.bufferPos = 0, this.buffer = this.iter.value;
                    }
                    return (0, state_dist.gm)(this.buffer, this.bufferPos);
                }
                next() {
                    for(; this.matches.length;)this.matches.pop();
                    return this.nextOverlapping();
                }
                nextOverlapping() {
                    for(;;){
                        let next = this.peek();
                        if (next < 0) return this.done = !0, this;
                        let str = (0, state_dist.bg)(next), start = this.bufferStart + this.bufferPos;
                        this.bufferPos += (0, state_dist.nZ)(next);
                        let norm = this.normalize(str);
                        for(let i = 0, pos = start;; i++){
                            let code = norm.charCodeAt(i), match = this.match(code, pos);
                            if (match) return this.value = match, this;
                            if (i == norm.length - 1) break;
                            pos == start && i < str.length && str.charCodeAt(i) == code && pos++;
                        }
                    }
                }
                match(code, pos) {
                    let match = null;
                    for(let i = 0; i < this.matches.length; i += 2){
                        let index = this.matches[i], keep = !1;
                        this.query.charCodeAt(index) == code && (index == this.query.length - 1 ? match = {
                            from: this.matches[i + 1],
                            to: pos + 1
                        } : (this.matches[i]++, keep = !0)), keep || (this.matches.splice(i, 2), i -= 2);
                    }
                    return this.query.charCodeAt(0) == code && (1 == this.query.length ? match = {
                        from: pos,
                        to: pos + 1
                    } : this.matches.push(1, pos)), match;
                }
            }
            "undefined" != typeof Symbol && (SearchCursor.prototype[Symbol.iterator] = function() {
                return this;
            });
            const empty1 = {
                from: -1,
                to: -1,
                match: /.*/.exec("")
            }, baseFlags = "gm" + (null == /x/.unicode ? "" : "u");
            class RegExpCursor {
                constructor(text, query, options, from = 0, to = text.length){
                    if (this.to = to, this.curLine = "", this.done = !1, this.value = empty1, /\\[sWDnr]|\n|\r|\[\^/.test(query)) return new MultilineRegExpCursor(text, query, options, from, to);
                    this.re = new RegExp(query, baseFlags + ((null == options ? void 0 : options.ignoreCase) ? "i" : "")), this.iter = text.iter();
                    let startLine = text.lineAt(from);
                    this.curLineStart = startLine.from, this.matchPos = from, this.getLine(this.curLineStart);
                }
                getLine(skip) {
                    this.iter.next(skip), this.iter.lineBreak ? this.curLine = "" : (this.curLine = this.iter.value, this.curLineStart + this.curLine.length > this.to && (this.curLine = this.curLine.slice(0, this.to - this.curLineStart)), this.iter.next());
                }
                nextLine() {
                    this.curLineStart = this.curLineStart + this.curLine.length + 1, this.curLineStart > this.to ? this.curLine = "" : this.getLine(0);
                }
                next() {
                    for(let off = this.matchPos - this.curLineStart;;){
                        this.re.lastIndex = off;
                        let match = this.matchPos <= this.to && this.re.exec(this.curLine);
                        if (match) {
                            let from = this.curLineStart + match.index, to = from + match[0].length;
                            if (this.matchPos = to + (from == to ? 1 : 0), from == this.curLine.length && this.nextLine(), from < to || from > this.value.to) return this.value = {
                                from,
                                to,
                                match
                            }, this;
                            off = this.matchPos - this.curLineStart;
                        } else {
                            if (!(this.curLineStart + this.curLine.length < this.to)) return this.done = !0, this;
                            this.nextLine(), off = 0;
                        }
                    }
                }
            }
            const flattened = new WeakMap();
            class FlattenedDoc {
                constructor(from, text){
                    this.from = from, this.text = text;
                }
                get to() {
                    return this.from + this.text.length;
                }
                static get(doc, from, to) {
                    let cached = flattened.get(doc);
                    if (!cached || cached.from >= to || cached.to <= from) {
                        let flat = new FlattenedDoc(from, doc.sliceString(from, to));
                        return flattened.set(doc, flat), flat;
                    }
                    if (cached.from == from && cached.to == to) return cached;
                    let { text , from: cachedFrom  } = cached;
                    return cachedFrom > from && (text = doc.sliceString(from, cachedFrom) + text, cachedFrom = from), cached.to < to && (text += doc.sliceString(cached.to, to)), flattened.set(doc, new FlattenedDoc(cachedFrom, text)), new FlattenedDoc(from, text.slice(from - cachedFrom, to - cachedFrom));
                }
            }
            class MultilineRegExpCursor {
                constructor(text, query, options, from, to){
                    this.text = text, this.to = to, this.done = !1, this.value = empty1, this.matchPos = from, this.re = new RegExp(query, baseFlags + ((null == options ? void 0 : options.ignoreCase) ? "i" : "")), this.flat = FlattenedDoc.get(text, from, this.chunkEnd(from + 5000));
                }
                chunkEnd(pos) {
                    return pos >= this.to ? this.to : this.text.lineAt(pos).to;
                }
                next() {
                    for(;;){
                        let off = this.re.lastIndex = this.matchPos - this.flat.from, match = this.re.exec(this.flat.text);
                        if (match && !match[0] && match.index == off && (this.re.lastIndex = off + 1, match = this.re.exec(this.flat.text)), match && this.flat.to < this.to && match.index + match[0].length > this.flat.text.length - 10 && (match = null), match) {
                            let from = this.flat.from + match.index, to = from + match[0].length;
                            return this.value = {
                                from,
                                to,
                                match
                            }, this.matchPos = to + (from == to ? 1 : 0), this;
                        }
                        if (this.flat.to == this.to) return this.done = !0, this;
                        this.flat = FlattenedDoc.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + 2 * this.flat.text.length));
                    }
                }
            }
            function validRegExp(source) {
                try {
                    return new RegExp(source, baseFlags), !0;
                } catch (_a) {
                    return !1;
                }
            }
            function createLineDialog(view) {
                let input = crelt("input", {
                    class: "cm-textfield",
                    name: "line"
                }), dom = crelt("form", {
                    class: "cm-gotoLine",
                    onkeydown (event) {
                        27 == event.keyCode ? (event.preventDefault(), view.dispatch({
                            effects: dialogEffect.of(!1)
                        }), view.focus()) : 13 == event.keyCode && (event.preventDefault(), go());
                    },
                    onsubmit (event) {
                        event.preventDefault(), go();
                    }
                }, crelt("label", view.state.phrase("Go to line"), ": ", input), " ", crelt("button", {
                    class: "cm-button",
                    type: "submit"
                }, view.state.phrase("go")));
                function go() {
                    let match = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(input.value);
                    if (!match) return;
                    let { state  } = view, startLine = state.doc.lineAt(state.selection.main.head), [, sign, ln, cl, percent] = match, col = cl ? +cl.slice(1) : 0, line = ln ? +ln : startLine.number;
                    if (ln && percent) {
                        let pc = line / 100;
                        sign && (pc = pc * ("-" == sign ? -1 : 1) + startLine.number / state.doc.lines), line = Math.round(state.doc.lines * pc);
                    } else ln && sign && (line = line * ("-" == sign ? -1 : 1) + startLine.number);
                    let docLine = state.doc.line(Math.max(1, Math.min(state.doc.lines, line)));
                    view.dispatch({
                        effects: dialogEffect.of(!1),
                        selection: state_dist.jT.cursor(docLine.from + Math.max(0, Math.min(col, docLine.length))),
                        scrollIntoView: !0
                    }), view.focus();
                }
                return {
                    dom
                };
            }
            "undefined" != typeof Symbol && (RegExpCursor.prototype[Symbol.iterator] = MultilineRegExpCursor.prototype[Symbol.iterator] = function() {
                return this;
            });
            const dialogEffect = state_dist.Py.define(), dialogField = state_dist.QQ.define({
                create: ()=>!0
                ,
                update (value, tr) {
                    for (let e of tr.effects)e.is(dialogEffect) && (value = e.value);
                    return value;
                },
                provide: (f)=>dist.mH.from(f, (val)=>val ? createLineDialog : null
                    )
            }), dist_baseTheme$1 = dist.tk.baseTheme({
                ".cm-panel.cm-gotoLine": {
                    padding: "2px 6px 4px",
                    "& label": {
                        fontSize: "80%"
                    }
                }
            }), defaultHighlightOptions = {
                highlightWordAroundCursor: !1,
                minSelectionLength: 1,
                maxMatches: 100,
                wholeWords: !1
            }, highlightConfig = state_dist.r$.define({
                combine: (options)=>(0, state_dist.BO)(options, defaultHighlightOptions, {
                        highlightWordAroundCursor: (a, b)=>a || b
                        ,
                        minSelectionLength: Math.min,
                        maxMatches: Math.min
                    })
            });
            function highlightSelectionMatches(options) {
                let ext = [
                    defaultTheme,
                    matchHighlighter
                ];
                return options && ext.push(highlightConfig.of(options)), ext;
            }
            const matchDeco = dist.p.mark({
                class: "cm-selectionMatch"
            }), mainMatchDeco = dist.p.mark({
                class: "cm-selectionMatch cm-selectionMatch-main"
            });
            function insideWordBoundaries(check, state, from, to) {
                return (0 == from || check(state.sliceDoc(from - 1, from)) != state_dist.D0.Word) && (to == state.doc.length || check(state.sliceDoc(to, to + 1)) != state_dist.D0.Word);
            }
            function insideWord(check, state, from, to) {
                return check(state.sliceDoc(from, from + 1)) == state_dist.D0.Word && check(state.sliceDoc(to - 1, to)) == state_dist.D0.Word;
            }
            const matchHighlighter = dist.lg.fromClass(class {
                constructor(view){
                    this.decorations = this.getDeco(view);
                }
                update(update) {
                    (update.selectionSet || update.docChanged || update.viewportChanged) && (this.decorations = this.getDeco(update.view));
                }
                getDeco(view) {
                    let conf = view.state.facet(highlightConfig), { state  } = view, sel = state.selection;
                    if (sel.ranges.length > 1) return dist.p.none;
                    let range = sel.main, query, check = null;
                    if (range.empty) {
                        if (!conf.highlightWordAroundCursor) return dist.p.none;
                        let word = state.wordAt(range.head);
                        if (!word) return dist.p.none;
                        check = state.charCategorizer(range.head), query = state.sliceDoc(word.from, word.to);
                    } else {
                        let len = range.to - range.from;
                        if (len < conf.minSelectionLength || len > 200) return dist.p.none;
                        if (conf.wholeWords) {
                            if (query = state.sliceDoc(range.from, range.to), check = state.charCategorizer(range.head), !(insideWordBoundaries(check, state, range.from, range.to) && insideWord(check, state, range.from, range.to))) return dist.p.none;
                        } else if (!(query = state.sliceDoc(range.from, range.to).trim())) return dist.p.none;
                    }
                    let deco = [];
                    for (let part of view.visibleRanges){
                        let cursor = new SearchCursor(state.doc, query, part.from, part.to);
                        for(; !cursor.next().done;){
                            let { from , to  } = cursor.value;
                            if ((!check || insideWordBoundaries(check, state, from, to)) && (range.empty && from <= range.from && to >= range.to ? deco.push(mainMatchDeco.range(from, to)) : (from >= range.to || to <= range.from) && deco.push(matchDeco.range(from, to)), deco.length > conf.maxMatches)) return dist.p.none;
                        }
                    }
                    return dist.p.set(deco);
                }
            }, {
                decorations: (v)=>v.decorations
            }), defaultTheme = dist.tk.baseTheme({
                ".cm-selectionMatch": {
                    backgroundColor: "#99ff7780"
                },
                ".cm-searchMatch .cm-selectionMatch": {
                    backgroundColor: "transparent"
                }
            }), selectWord = ({ state , dispatch  })=>{
                let { selection  } = state, newSel = state_dist.jT.create(selection.ranges.map((range)=>state.wordAt(range.head) || state_dist.jT.cursor(range.head)
                ), selection.mainIndex);
                return !newSel.eq(selection) && (dispatch(state.update({
                    selection: newSel
                })), !0);
            };
            function findNextOccurrence(state, query) {
                let { main , ranges  } = state.selection, word = state.wordAt(main.head), fullWord = word && word.from == main.from && word.to == main.to;
                for(let cycled = !1, cursor = new SearchCursor(state.doc, query, ranges[ranges.length - 1].to);;)if (cursor.next(), cursor.done) {
                    if (cycled) return null;
                    cursor = new SearchCursor(state.doc, query, 0, Math.max(0, ranges[ranges.length - 1].from - 1)), cycled = !0;
                } else {
                    if (cycled && ranges.some((r)=>r.from == cursor.value.from
                    )) continue;
                    if (fullWord) {
                        let word = state.wordAt(cursor.value.from);
                        if (!word || word.from != cursor.value.from || word.to != cursor.value.to) continue;
                    }
                    return cursor.value;
                }
            }
            const searchConfigFacet = state_dist.r$.define({
                combine (configs) {
                    var _a;
                    return {
                        top: configs.reduce((val, conf)=>null != val ? val : conf.top
                        , void 0) || !1,
                        caseSensitive: configs.reduce((val, conf)=>null != val ? val : conf.caseSensitive
                        , void 0) || !1,
                        createPanel: (null === (_a = configs.find((c)=>c.createPanel
                        )) || void 0 === _a ? void 0 : _a.createPanel) || ((view)=>new SearchPanel(view)
                        )
                    };
                }
            });
            class SearchQuery {
                constructor(config){
                    this.search = config.search, this.caseSensitive = !!config.caseSensitive, this.regexp = !!config.regexp, this.replace = config.replace || "", this.valid = !!this.search && (!this.regexp || validRegExp(this.search)), this.unquoted = config.literal ? this.search : this.search.replace(/\\([nrt\\])/g, (_, ch)=>"n" == ch ? "\n" : "r" == ch ? "\r" : "t" == ch ? "\t" : "\\"
                    );
                }
                eq(other) {
                    return this.search == other.search && this.replace == other.replace && this.caseSensitive == other.caseSensitive && this.regexp == other.regexp;
                }
                create() {
                    return this.regexp ? new RegExpQuery(this) : new StringQuery(this);
                }
                getCursor(doc, from = 0, to = doc.length) {
                    return this.regexp ? regexpCursor(this, doc, from, to) : stringCursor(this, doc, from, to);
                }
            }
            class QueryType {
                constructor(spec){
                    this.spec = spec;
                }
            }
            function stringCursor(spec, doc, from, to) {
                return new SearchCursor(doc, spec.unquoted, from, to, spec.caseSensitive ? void 0 : (x)=>x.toLowerCase()
                );
            }
            class StringQuery extends QueryType {
                constructor(spec){
                    super(spec);
                }
                nextMatch(doc, curFrom, curTo) {
                    let cursor = stringCursor(this.spec, doc, curTo, doc.length).nextOverlapping();
                    return cursor.done && (cursor = stringCursor(this.spec, doc, 0, curFrom).nextOverlapping()), cursor.done ? null : cursor.value;
                }
                prevMatchInRange(doc, from, to) {
                    for(let pos = to;;){
                        let start = Math.max(from, pos - 10000 - this.spec.unquoted.length), cursor = stringCursor(this.spec, doc, start, pos), range = null;
                        for(; !cursor.nextOverlapping().done;)range = cursor.value;
                        if (range) return range;
                        if (start == from) return null;
                        pos -= 10000;
                    }
                }
                prevMatch(doc, curFrom, curTo) {
                    return this.prevMatchInRange(doc, 0, curFrom) || this.prevMatchInRange(doc, curTo, doc.length);
                }
                getReplacement(_result) {
                    return this.spec.replace;
                }
                matchAll(doc, limit) {
                    let cursor = stringCursor(this.spec, doc, 0, doc.length), ranges = [];
                    for(; !cursor.next().done;){
                        if (ranges.length >= limit) return null;
                        ranges.push(cursor.value);
                    }
                    return ranges;
                }
                highlight(doc, from, to, add) {
                    let cursor = stringCursor(this.spec, doc, Math.max(0, from - this.spec.unquoted.length), Math.min(to + this.spec.unquoted.length, doc.length));
                    for(; !cursor.next().done;)add(cursor.value.from, cursor.value.to);
                }
            }
            function regexpCursor(spec, doc, from, to) {
                return new RegExpCursor(doc, spec.search, spec.caseSensitive ? void 0 : {
                    ignoreCase: !0
                }, from, to);
            }
            class RegExpQuery extends QueryType {
                nextMatch(doc, curFrom, curTo) {
                    let cursor = regexpCursor(this.spec, doc, curTo, doc.length).next();
                    return cursor.done && (cursor = regexpCursor(this.spec, doc, 0, curFrom).next()), cursor.done ? null : cursor.value;
                }
                prevMatchInRange(doc, from, to) {
                    for(let size = 1;; size++){
                        let start = Math.max(from, to - 10000 * size), cursor = regexpCursor(this.spec, doc, start, to), range = null;
                        for(; !cursor.next().done;)range = cursor.value;
                        if (range && (start == from || range.from > start + 10)) return range;
                        if (start == from) return null;
                    }
                }
                prevMatch(doc, curFrom, curTo) {
                    return this.prevMatchInRange(doc, 0, curFrom) || this.prevMatchInRange(doc, curTo, doc.length);
                }
                getReplacement(result) {
                    return this.spec.replace.replace(/\$([$&\d+])/g, (m, i)=>"$" == i ? "$" : "&" == i ? result.match[0] : "0" != i && +i < result.match.length ? result.match[i] : m
                    );
                }
                matchAll(doc, limit) {
                    let cursor = regexpCursor(this.spec, doc, 0, doc.length), ranges = [];
                    for(; !cursor.next().done;){
                        if (ranges.length >= limit) return null;
                        ranges.push(cursor.value);
                    }
                    return ranges;
                }
                highlight(doc, from, to, add) {
                    let cursor = regexpCursor(this.spec, doc, Math.max(0, from - 250), Math.min(to + 250, doc.length));
                    for(; !cursor.next().done;)add(cursor.value.from, cursor.value.to);
                }
            }
            const setSearchQuery = state_dist.Py.define(), togglePanel = state_dist.Py.define(), searchState = state_dist.QQ.define({
                create: (state)=>new SearchState(defaultQuery(state).create(), null)
                ,
                update (value, tr) {
                    for (let effect of tr.effects)effect.is(setSearchQuery) ? value = new SearchState(effect.value.create(), value.panel) : effect.is(togglePanel) && (value = new SearchState(value.query, effect.value ? createSearchPanel : null));
                    return value;
                },
                provide: (f)=>dist.mH.from(f, (val)=>val.panel
                    )
            });
            class SearchState {
                constructor(query, panel){
                    this.query = query, this.panel = panel;
                }
            }
            const matchMark = dist.p.mark({
                class: "cm-searchMatch"
            }), selectedMatchMark = dist.p.mark({
                class: "cm-searchMatch cm-searchMatch-selected"
            }), searchHighlighter = dist.lg.fromClass(class {
                constructor(view){
                    this.view = view, this.decorations = this.highlight(view.state.field(searchState));
                }
                update(update) {
                    let state = update.state.field(searchState);
                    (state != update.startState.field(searchState) || update.docChanged || update.selectionSet || update.viewportChanged) && (this.decorations = this.highlight(state));
                }
                highlight({ query , panel  }) {
                    if (!panel || !query.spec.valid) return dist.p.none;
                    let { view  } = this, builder = new state_dist.f_();
                    for(let i = 0, ranges = view.visibleRanges, l = ranges.length; i < l; i++){
                        let { from: from4 , to: to4  } = ranges[i];
                        for(; i < l - 1 && to4 > ranges[i + 1].from - 500;)to4 = ranges[++i].to;
                        query.highlight(view.state.doc, from4, to4, (from, to)=>{
                            let selected = view.state.selection.ranges.some((r)=>r.from == from && r.to == to
                            );
                            builder.add(from, to, selected ? selectedMatchMark : matchMark);
                        });
                    }
                    return builder.finish();
                }
            }, {
                decorations: (v)=>v.decorations
            });
            function searchCommand(f) {
                return (view)=>{
                    let state = view.state.field(searchState, !1);
                    return state && state.query.spec.valid ? f(view, state) : openSearchPanel(view);
                };
            }
            const findNext = searchCommand((view, { query  })=>{
                let { from , to  } = view.state.selection.main, next = query.nextMatch(view.state.doc, from, to);
                return !!next && (next.from != from || next.to != to) && (view.dispatch({
                    selection: {
                        anchor: next.from,
                        head: next.to
                    },
                    scrollIntoView: !0,
                    effects: announceMatch(view, next),
                    userEvent: "select.search"
                }), !0);
            }), findPrevious = searchCommand((view, { query  })=>{
                let { state  } = view, { from , to  } = state.selection.main, range = query.prevMatch(state.doc, from, to);
                return !!range && (view.dispatch({
                    selection: {
                        anchor: range.from,
                        head: range.to
                    },
                    scrollIntoView: !0,
                    effects: announceMatch(view, range),
                    userEvent: "select.search"
                }), !0);
            }), selectMatches = searchCommand((view, { query  })=>{
                let ranges = query.matchAll(view.state.doc, 1000);
                return !!ranges && !!ranges.length && (view.dispatch({
                    selection: state_dist.jT.create(ranges.map((r)=>state_dist.jT.range(r.from, r.to)
                    )),
                    userEvent: "select.search.matches"
                }), !0);
            }), replaceNext = searchCommand((view, { query  })=>{
                let { state  } = view, { from , to  } = state.selection.main;
                if (state.readOnly) return !1;
                let next = query.nextMatch(state.doc, from, from);
                if (!next) return !1;
                let changes = [], selection, replacement;
                if (next.from == from && next.to == to && (replacement = state.toText(query.getReplacement(next)), changes.push({
                    from: next.from,
                    to: next.to,
                    insert: replacement
                }), next = query.nextMatch(state.doc, next.from, next.to)), next) {
                    let off = 0 == changes.length || changes[0].from >= next.to ? 0 : next.to - next.from - replacement.length;
                    selection = {
                        anchor: next.from - off,
                        head: next.to - off
                    };
                }
                return view.dispatch({
                    changes,
                    selection,
                    scrollIntoView: !!selection,
                    effects: next ? announceMatch(view, next) : void 0,
                    userEvent: "input.replace"
                }), !0;
            }), replaceAll = searchCommand((view, { query  })=>{
                if (view.state.readOnly) return !1;
                let changes = query.matchAll(view.state.doc, 1e9).map((match)=>{
                    let { from , to  } = match;
                    return {
                        from,
                        to,
                        insert: query.getReplacement(match)
                    };
                });
                return !!changes.length && (view.dispatch({
                    changes,
                    userEvent: "input.replace.all"
                }), !0);
            });
            function createSearchPanel(view) {
                return view.state.facet(searchConfigFacet).createPanel(view);
            }
            function defaultQuery(state, fallback) {
                var _a;
                let sel = state.selection.main, selText = sel.empty || sel.to > sel.from + 100 ? "" : state.sliceDoc(sel.from, sel.to), caseSensitive = null !== (_a = null == fallback ? void 0 : fallback.caseSensitive) && void 0 !== _a ? _a : state.facet(searchConfigFacet).caseSensitive;
                return fallback && !selText ? fallback : new SearchQuery({
                    search: selText.replace(/\n/g, "\\n"),
                    caseSensitive
                });
            }
            const openSearchPanel = (view)=>{
                let state = view.state.field(searchState, !1);
                if (state && state.panel) {
                    let panel = (0, dist.Sd)(view, createSearchPanel);
                    if (!panel) return !1;
                    let searchInput = panel.dom.querySelector("[name=search]");
                    if (searchInput != view.root.activeElement) {
                        let query = defaultQuery(view.state, state.query.spec);
                        query.valid && view.dispatch({
                            effects: setSearchQuery.of(query)
                        }), searchInput.focus(), searchInput.select();
                    }
                } else view.dispatch({
                    effects: [
                        togglePanel.of(!0),
                        state ? setSearchQuery.of(defaultQuery(view.state, state.query.spec)) : state_dist.Py.appendConfig.of(searchExtensions), 
                    ]
                });
                return !0;
            }, closeSearchPanel = (view)=>{
                let state = view.state.field(searchState, !1);
                if (!state || !state.panel) return !1;
                let panel = (0, dist.Sd)(view, createSearchPanel);
                return panel && panel.dom.contains(view.root.activeElement) && view.focus(), view.dispatch({
                    effects: togglePanel.of(!1)
                }), !0;
            };
            class SearchPanel {
                constructor(view){
                    this.view = view;
                    let query = this.query = view.state.field(searchState).query.spec;
                    function button(name, onclick, content) {
                        return crelt("button", {
                            class: "cm-button",
                            name,
                            onclick,
                            type: "button"
                        }, content);
                    }
                    this.commit = this.commit.bind(this), this.searchField = crelt("input", {
                        value: query.search,
                        placeholder: phrase1(view, "Find"),
                        "aria-label": phrase1(view, "Find"),
                        class: "cm-textfield",
                        name: "search",
                        onchange: this.commit,
                        onkeyup: this.commit
                    }), this.replaceField = crelt("input", {
                        value: query.replace,
                        placeholder: phrase1(view, "Replace"),
                        "aria-label": phrase1(view, "Replace"),
                        class: "cm-textfield",
                        name: "replace",
                        onchange: this.commit,
                        onkeyup: this.commit
                    }), this.caseField = crelt("input", {
                        type: "checkbox",
                        name: "case",
                        checked: query.caseSensitive,
                        onchange: this.commit
                    }), this.reField = crelt("input", {
                        type: "checkbox",
                        name: "re",
                        checked: query.regexp,
                        onchange: this.commit
                    }), this.dom = crelt("div", {
                        onkeydown: (e)=>this.keydown(e)
                        ,
                        class: "cm-search"
                    }, [
                        this.searchField,
                        button("next", ()=>findNext(view)
                        , [
                            phrase1(view, "next"), 
                        ]),
                        button("prev", ()=>findPrevious(view)
                        , [
                            phrase1(view, "previous"), 
                        ]),
                        button("select", ()=>selectMatches(view)
                        , [
                            phrase1(view, "all"), 
                        ]),
                        crelt("label", null, [
                            this.caseField,
                            phrase1(view, "match case"), 
                        ]),
                        crelt("label", null, [
                            this.reField,
                            phrase1(view, "regexp"), 
                        ]),
                        ...view.state.readOnly ? [] : [
                            crelt("br"),
                            this.replaceField,
                            button("replace", ()=>replaceNext(view)
                            , [
                                phrase1(view, "replace")
                            ]),
                            button("replaceAll", ()=>replaceAll(view)
                            , [
                                phrase1(view, "replace all")
                            ]),
                            crelt("button", {
                                name: "close",
                                onclick: ()=>closeSearchPanel(view)
                                ,
                                "aria-label": phrase1(view, "close"),
                                type: "button"
                            }, [
                                "×"
                            ]), 
                        ], 
                    ]);
                }
                commit() {
                    let query = new SearchQuery({
                        search: this.searchField.value,
                        caseSensitive: this.caseField.checked,
                        regexp: this.reField.checked,
                        replace: this.replaceField.value
                    });
                    query.eq(this.query) || (this.query = query, this.view.dispatch({
                        effects: setSearchQuery.of(query)
                    }));
                }
                keydown(e) {
                    (0, dist.$1)(this.view, e, "search-panel") ? e.preventDefault() : 13 == e.keyCode && e.target == this.searchField ? (e.preventDefault(), (e.shiftKey ? findPrevious : findNext)(this.view)) : 13 == e.keyCode && e.target == this.replaceField && (e.preventDefault(), replaceNext(this.view));
                }
                update(update) {
                    for (let tr of update.transactions)for (let effect of tr.effects)effect.is(setSearchQuery) && !effect.value.eq(this.query) && this.setQuery(effect.value);
                }
                setQuery(query) {
                    this.query = query, this.searchField.value = query.search, this.replaceField.value = query.replace, this.caseField.checked = query.caseSensitive, this.reField.checked = query.regexp;
                }
                mount() {
                    this.searchField.select();
                }
                get pos() {
                    return 80;
                }
                get top() {
                    return this.view.state.facet(searchConfigFacet).top;
                }
            }
            function phrase1(view, phrase) {
                return view.state.phrase(phrase);
            }
            const AnnounceMargin = 30, Break = /[\s\.,:;?!]/;
            function announceMatch(view, { from , to  }) {
                let lineStart = view.state.doc.lineAt(from).from, lineEnd = view.state.doc.lineAt(to).to, start = Math.max(lineStart, from - AnnounceMargin), end = Math.min(lineEnd, to + AnnounceMargin), text = view.state.sliceDoc(start, end);
                if (start != lineStart) {
                    for(let i = 0; i < AnnounceMargin; i++)if (!Break.test(text[i + 1]) && Break.test(text[i])) {
                        text = text.slice(i);
                        break;
                    }
                }
                if (end != lineEnd) {
                    for(let i2 = text.length - 1; i2 > text.length - AnnounceMargin; i2--)if (!Break.test(text[i2 - 1]) && Break.test(text[i2])) {
                        text = text.slice(0, i2);
                        break;
                    }
                }
                return dist.tk.announce.of(`${view.state.phrase("current match")}. ${text} ${view.state.phrase("on line")} ${view.state.doc.lineAt(from).number}`);
            }
            const dist_baseTheme = dist.tk.baseTheme({
                ".cm-panel.cm-search": {
                    padding: "2px 6px 4px",
                    position: "relative",
                    "& [name=close]": {
                        position: "absolute",
                        top: "0",
                        right: "4px",
                        backgroundColor: "inherit",
                        border: "none",
                        font: "inherit",
                        padding: 0,
                        margin: 0
                    },
                    "& input, & button, & label": {
                        margin: ".2em .6em .2em 0"
                    },
                    "& input[type=checkbox]": {
                        marginRight: ".2em"
                    },
                    "& label": {
                        fontSize: "80%",
                        whiteSpace: "pre"
                    }
                },
                "&light .cm-searchMatch": {
                    backgroundColor: "#ffff0054"
                },
                "&dark .cm-searchMatch": {
                    backgroundColor: "#00ffff8a"
                },
                "&light .cm-searchMatch-selected": {
                    backgroundColor: "#ff6a0054"
                },
                "&dark .cm-searchMatch-selected": {
                    backgroundColor: "#ff00ff8a"
                }
            }), searchExtensions = [
                searchState,
                state_dist.Wl.lowest(searchHighlighter),
                dist_baseTheme, 
            ];
            class CompletionContext {
                constructor(state, pos, explicit){
                    this.state = state, this.pos = pos, this.explicit = explicit, this.abortListeners = [];
                }
                tokenBefore(types) {
                    let token = dist_syntaxTree(this.state).resolveInner(this.pos, -1);
                    for(; token && 0 > types.indexOf(token.name);)token = token.parent;
                    return token ? {
                        from: token.from,
                        to: this.pos,
                        text: this.state.sliceDoc(token.from, this.pos),
                        type: token.type
                    } : null;
                }
                matchBefore(expr) {
                    let line = this.state.doc.lineAt(this.pos), start = Math.max(line.from, this.pos - 250), str = line.text.slice(start - line.from, this.pos - line.from), found = str.search(ensureAnchor(expr, !1));
                    return found < 0 ? null : {
                        from: start + found,
                        to: this.pos,
                        text: str.slice(found)
                    };
                }
                get aborted() {
                    return null == this.abortListeners;
                }
                addEventListener(type, listener) {
                    "abort" == type && this.abortListeners && this.abortListeners.push(listener);
                }
            }
            function toSet(chars) {
                let flat = Object.keys(chars).join(""), words = /\w/.test(flat);
                return words && (flat = flat.replace(/\w/g, "")), `[${words ? "\\w" : ""}${flat.replace(/[^\w\s]/g, "\\$&")}]`;
            }
            function prefixMatch(options) {
                let first = Object.create(null), rest = Object.create(null);
                for (let { label  } of options){
                    first[label[0]] = !0;
                    for(let i = 1; i < label.length; i++)rest[label[i]] = !0;
                }
                let source = toSet(first) + toSet(rest) + "*$";
                return [
                    new RegExp("^" + source),
                    new RegExp(source)
                ];
            }
            function completeFromList(list) {
                let options = list.map((o)=>"string" == typeof o ? {
                        label: o
                    } : o
                ), [validFor, match] = options.every((o)=>/^\w+$/.test(o.label)
                ) ? [
                    /\w*$/,
                    /\w+$/
                ] : prefixMatch(options);
                return (context)=>{
                    let token = context.matchBefore(match);
                    return token || context.explicit ? {
                        from: token ? token.from : context.pos,
                        options,
                        validFor
                    } : null;
                };
            }
            class Option {
                constructor(completion, source, match){
                    this.completion = completion, this.source = source, this.match = match;
                }
            }
            function cur1(state) {
                return state.selection.main.head;
            }
            function ensureAnchor(expr, start) {
                var _a;
                let { source  } = expr, addStart = start && "^" != source[0], addEnd = "$" != source[source.length - 1];
                return addStart || addEnd ? new RegExp(`${addStart ? "^" : ""}(?:${source})${addEnd ? "$" : ""}`, null !== (_a = expr.flags) && void 0 !== _a ? _a : expr.ignoreCase ? "i" : "") : expr;
            }
            const pickedCompletion = state_dist.q6.define();
            function applyCompletion(view, option) {
                const apply = option.completion.apply || option.completion.label;
                let result = option.source;
                "string" == typeof apply ? view.dispatch(view.state.changeByRange((range)=>{
                    if (range == view.state.selection.main) return {
                        changes: {
                            from: result.from,
                            to: result.to,
                            insert: apply
                        },
                        range: state_dist.jT.cursor(result.from + apply.length)
                    };
                    let len = result.to - result.from;
                    return !range.empty || len && view.state.sliceDoc(range.from - len, range.from) != view.state.sliceDoc(result.from, result.to) ? {
                        range
                    } : {
                        changes: {
                            from: range.from - len,
                            to: range.from,
                            insert: apply
                        },
                        range: state_dist.jT.cursor(range.from - len + apply.length)
                    };
                }), {
                    userEvent: "input.complete",
                    annotations: pickedCompletion.of(option.completion)
                }) : apply(view, option.completion, result.from, result.to);
            }
            const SourceCache = new WeakMap();
            function asSource(source) {
                if (!Array.isArray(source)) return source;
                let known = SourceCache.get(source);
                return known || SourceCache.set(source, known = completeFromList(source)), known;
            }
            class FuzzyMatcher {
                constructor(pattern){
                    this.pattern = pattern, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [];
                    for(let p = 0; p < pattern.length;){
                        let char = (0, state_dist.gm)(pattern, p), size = (0, state_dist.nZ)(char);
                        this.chars.push(char);
                        let part = pattern.slice(p, p + size), upper = part.toUpperCase();
                        this.folded.push((0, state_dist.gm)(upper == part ? part.toLowerCase() : upper, 0)), p += size;
                    }
                    this.astral = pattern.length != this.chars.length;
                }
                match(word) {
                    if (0 == this.pattern.length) return [
                        0
                    ];
                    if (word.length < this.pattern.length) return null;
                    let { chars , folded , any , precise , byWord  } = this;
                    if (1 == chars.length) {
                        let first = (0, state_dist.gm)(word, 0);
                        return first == chars[0] ? [
                            0,
                            0,
                            (0, state_dist.nZ)(first), 
                        ] : first == folded[0] ? [
                            -200,
                            0,
                            (0, state_dist.nZ)(first), 
                        ] : null;
                    }
                    let direct = word.indexOf(this.pattern);
                    if (0 == direct) return [
                        0,
                        0,
                        this.pattern.length
                    ];
                    let len = chars.length, anyTo = 0;
                    if (direct < 0) {
                        for(let i = 0, e = Math.min(word.length, 200); i < e && anyTo < len;){
                            let next = (0, state_dist.gm)(word, i);
                            (next == chars[anyTo] || next == folded[anyTo]) && (any[anyTo++] = i), i += (0, state_dist.nZ)(next);
                        }
                        if (anyTo < len) return null;
                    }
                    let preciseTo = 0, byWordTo = 0, byWordFolded = !1, adjacentTo = 0, adjacentStart = -1, adjacentEnd = -1, hasLower = /[a-z]/.test(word), wordAdjacent = !0;
                    for(let i = 0, e = Math.min(word.length, 200), prevType = 0; i < e && byWordTo < len;){
                        let next = (0, state_dist.gm)(word, i);
                        direct < 0 && (preciseTo < len && next == chars[preciseTo] && (precise[preciseTo++] = i), adjacentTo < len && (next == chars[adjacentTo] || next == folded[adjacentTo] ? (0 == adjacentTo && (adjacentStart = i), adjacentEnd = i + 1, adjacentTo++) : adjacentTo = 0));
                        let ch, type = next < 0xff ? next >= 48 && next <= 57 || next >= 97 && next <= 122 ? 2 : next >= 65 && next <= 90 ? 1 : 0 : (ch = (0, state_dist.bg)(next)) != ch.toLowerCase() ? 1 : ch != ch.toUpperCase() ? 2 : 0;
                        (!i || 1 == type && hasLower || 0 == prevType && 0 != type) && (chars[byWordTo] == next || folded[byWordTo] == next && (byWordFolded = !0) ? byWord[byWordTo++] = i : byWord.length && (wordAdjacent = !1)), prevType = type, i += (0, state_dist.nZ)(next);
                    }
                    return byWordTo == len && 0 == byWord[0] && wordAdjacent ? this.result(-100 + (byWordFolded ? -200 : 0), byWord, word) : adjacentTo == len && 0 == adjacentStart ? [
                        -200 - word.length,
                        0,
                        adjacentEnd, 
                    ] : direct > -1 ? [
                        -700 - word.length,
                        direct,
                        direct + this.pattern.length, 
                    ] : adjacentTo == len ? [
                        -900 - word.length,
                        adjacentStart,
                        adjacentEnd, 
                    ] : byWordTo == len ? this.result(-100 + (byWordFolded ? -200 : 0) + -700 + (wordAdjacent ? 0 : -1100), byWord, word) : 2 == chars.length ? null : this.result((any[0] ? -700 : 0) + -200 + -1100, any, word);
                }
                result(score, positions, word) {
                    let result = [
                        score - word.length
                    ], i = 1;
                    for (let pos of positions){
                        let to = pos + (this.astral ? (0, state_dist.nZ)((0, state_dist.gm)(word, pos)) : 1);
                        i > 1 && result[i - 1] == pos ? result[i - 1] = to : (result[i++] = pos, result[i++] = to);
                    }
                    return result;
                }
            }
            const completionConfig = state_dist.r$.define({
                combine: (configs)=>(0, state_dist.BO)(configs, {
                        activateOnTyping: !0,
                        override: null,
                        closeOnBlur: !0,
                        maxRenderedOptions: 100,
                        defaultKeymap: !0,
                        optionClass: ()=>""
                        ,
                        aboveCursor: !1,
                        icons: !0,
                        addToOptions: []
                    }, {
                        defaultKeymap: (a, b)=>a && b
                        ,
                        closeOnBlur: (a, b)=>a && b
                        ,
                        icons: (a, b)=>a && b
                        ,
                        optionClass: (a, b)=>(c)=>joinClass(a(c), b(c))
                        ,
                        addToOptions: (a, b)=>a.concat(b)
                    })
            });
            function joinClass(a, b) {
                return a ? b ? a + " " + b : a : b;
            }
            function optionContent(config) {
                let content = config.addToOptions.slice();
                return config.icons && content.push({
                    render (completion) {
                        let icon = document.createElement("div");
                        return icon.classList.add("cm-completionIcon"), completion.type && icon.classList.add(...completion.type.split(/\s+/g).map((cls)=>"cm-completionIcon-" + cls
                        )), icon.setAttribute("aria-hidden", "true"), icon;
                    },
                    position: 20
                }), content.push({
                    render (completion, _s, match) {
                        let labelElt = document.createElement("span");
                        labelElt.className = "cm-completionLabel";
                        let { label  } = completion, off = 0;
                        for(let j = 1; j < match.length;){
                            let from = match[j++], to = match[j++];
                            from > off && labelElt.appendChild(document.createTextNode(label.slice(off, from)));
                            let span = labelElt.appendChild(document.createElement("span"));
                            span.appendChild(document.createTextNode(label.slice(from, to))), span.className = "cm-completionMatchedText", off = to;
                        }
                        return off < label.length && labelElt.appendChild(document.createTextNode(label.slice(off))), labelElt;
                    },
                    position: 50
                }, {
                    render (completion) {
                        if (!completion.detail) return null;
                        let detailElt = document.createElement("span");
                        return detailElt.className = "cm-completionDetail", detailElt.textContent = completion.detail, detailElt;
                    },
                    position: 80
                }), content.sort((a, b)=>a.position - b.position
                ).map((a)=>a.render
                );
            }
            function rangeAroundSelected(total, selected, max) {
                if (total <= max) return {
                    from: 0,
                    to: total
                };
                if (selected <= total >> 1) {
                    let off = Math.floor(selected / max);
                    return {
                        from: off * max,
                        to: (off + 1) * max
                    };
                }
                let off = Math.floor((total - selected) / max);
                return {
                    from: total - (off + 1) * max,
                    to: total - off * max
                };
            }
            class CompletionTooltip {
                constructor(view, stateField){
                    this.view = view, this.stateField = stateField, this.info = null, this.placeInfo = {
                        read: ()=>this.measureInfo()
                        ,
                        write: (pos)=>this.positionInfo(pos)
                        ,
                        key: this
                    };
                    let cState = view.state.field(stateField), { options , selected  } = cState.open, config = view.state.facet(completionConfig);
                    this.optionContent = optionContent(config), this.optionClass = config.optionClass, this.range = rangeAroundSelected(options.length, selected, config.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.dom.addEventListener("mousedown", (e)=>{
                        for(let dom = e.target, match; dom && dom != this.dom; dom = dom.parentNode)if ("LI" == dom.nodeName && (match = /-(\d+)$/.exec(dom.id)) && +match[1] < options.length) {
                            applyCompletion(view, options[+match[1]]), e.preventDefault();
                            return;
                        }
                    }), this.list = this.dom.appendChild(this.createListBox(options, cState.id, this.range)), this.list.addEventListener("scroll", ()=>{
                        this.info && this.view.requestMeasure(this.placeInfo);
                    });
                }
                mount() {
                    this.updateSel();
                }
                update(update) {
                    update.state.field(this.stateField) != update.startState.field(this.stateField) && this.updateSel();
                }
                positioned() {
                    this.info && this.view.requestMeasure(this.placeInfo);
                }
                updateSel() {
                    let cState = this.view.state.field(this.stateField), open = cState.open;
                    if ((open.selected < this.range.from || open.selected >= this.range.to) && (this.range = rangeAroundSelected(open.options.length, open.selected, this.view.state.facet(completionConfig).maxRenderedOptions), this.list.remove(), this.list = this.dom.appendChild(this.createListBox(open.options, cState.id, this.range)), this.list.addEventListener("scroll", ()=>{
                        this.info && this.view.requestMeasure(this.placeInfo);
                    })), this.updateSelectedOption(open.selected)) {
                        this.info && (this.info.remove(), this.info = null);
                        let { completion  } = open.options[open.selected], { info  } = completion;
                        if (!info) return;
                        let infoResult = "string" == typeof info ? document.createTextNode(info) : info(completion);
                        if (!infoResult) return;
                        "then" in infoResult ? infoResult.then((node)=>{
                            node && this.view.state.field(this.stateField, !1) == cState && this.addInfoPane(node);
                        }).catch((e)=>(0, dist.OO)(this.view.state, e, "completion info")
                        ) : this.addInfoPane(infoResult);
                    }
                }
                addInfoPane(content) {
                    let dom = this.info = document.createElement("div");
                    dom.className = "cm-tooltip cm-completionInfo", dom.appendChild(content), this.dom.appendChild(dom), this.view.requestMeasure(this.placeInfo);
                }
                updateSelectedOption(selected) {
                    let set = null;
                    for(let opt = this.list.firstChild, i = this.range.from; opt; opt = opt.nextSibling, i++)i == selected ? opt.hasAttribute("aria-selected") || (opt.setAttribute("aria-selected", "true"), set = opt) : opt.hasAttribute("aria-selected") && opt.removeAttribute("aria-selected");
                    return set && scrollIntoView(this.list, set), set;
                }
                measureInfo() {
                    let sel = this.dom.querySelector("[aria-selected]");
                    if (!sel || !this.info) return null;
                    let listRect = this.dom.getBoundingClientRect(), infoRect = this.info.getBoundingClientRect(), selRect = sel.getBoundingClientRect();
                    if (selRect.top > Math.min(innerHeight, listRect.bottom) - 10 || selRect.bottom < Math.max(0, listRect.top) + 10) return null;
                    let top = Math.max(0, Math.min(selRect.top, innerHeight - infoRect.height)) - listRect.top, left = this.view.textDirection == dist.Nm.RTL, spaceLeft = listRect.left, spaceRight = innerWidth - listRect.right;
                    return left && spaceLeft < Math.min(infoRect.width, spaceRight) ? left = !1 : !left && spaceRight < Math.min(infoRect.width, spaceLeft) && (left = !0), {
                        top,
                        left
                    };
                }
                positionInfo(pos) {
                    this.info && (this.info.style.top = (pos ? pos.top : -1000000) + "px", pos && (this.info.classList.toggle("cm-completionInfo-left", pos.left), this.info.classList.toggle("cm-completionInfo-right", !pos.left)));
                }
                createListBox(options, id, range) {
                    const ul = document.createElement("ul");
                    ul.id = id, ul.setAttribute("role", "listbox"), ul.setAttribute("aria-expanded", "true");
                    for(let i = range.from; i < range.to; i++){
                        let { completion , match  } = options[i];
                        const li = ul.appendChild(document.createElement("li"));
                        li.id = id + "-" + i, li.setAttribute("role", "option");
                        let cls = this.optionClass(completion);
                        for (let source of (cls && (li.className = cls), this.optionContent)){
                            let node = source(completion, this.view.state, match);
                            node && li.appendChild(node);
                        }
                    }
                    return range.from && ul.classList.add("cm-completionListIncompleteTop"), range.to < options.length && ul.classList.add("cm-completionListIncompleteBottom"), ul;
                }
            }
            function completionTooltip(stateField) {
                return (view)=>new CompletionTooltip(view, stateField)
                ;
            }
            function scrollIntoView(container, element) {
                let parent = container.getBoundingClientRect(), self = element.getBoundingClientRect();
                self.top < parent.top ? container.scrollTop -= parent.top - self.top : self.bottom > parent.bottom && (container.scrollTop += self.bottom - parent.bottom);
            }
            function score1(option) {
                return 100 * (option.boost || 0) + (option.apply ? 10 : 0) + (option.info ? 5 : 0) + (option.type ? 1 : 0);
            }
            function sortOptions(active, state) {
                let options = [], i = 0;
                for (let a of active)if (a.hasResult()) {
                    if (!1 === a.result.filter) {
                        let getMatch = a.result.getMatch;
                        for (let option of a.result.options){
                            let match = [
                                1e9 - i++
                            ];
                            if (getMatch) for (let n of getMatch(option))match.push(n);
                            options.push(new Option(option, a, match));
                        }
                    } else {
                        let matcher = new FuzzyMatcher(state.sliceDoc(a.from, a.to)), match;
                        for (let option of a.result.options)(match = matcher.match(option.label)) && (null != option.boost && (match[0] += option.boost), options.push(new Option(option, a, match)));
                    }
                }
                let result = [], prev = null;
                for (let opt of options.sort(cmpOption))prev && prev.label == opt.completion.label && prev.detail == opt.completion.detail && (null == prev.type || null == opt.completion.type || prev.type == opt.completion.type) && prev.apply == opt.completion.apply ? score1(opt.completion) > score1(prev) && (result[result.length - 1] = opt) : result.push(opt), prev = opt.completion;
                return result;
            }
            class CompletionDialog {
                constructor(options, attrs, tooltip, timestamp, selected){
                    this.options = options, this.attrs = attrs, this.tooltip = tooltip, this.timestamp = timestamp, this.selected = selected;
                }
                setSelected(selected, id) {
                    return selected == this.selected || selected >= this.options.length ? this : new CompletionDialog(this.options, makeAttrs(id, selected), this.tooltip, this.timestamp, selected);
                }
                static build(active, state, id, prev, conf) {
                    let options = sortOptions(active, state);
                    if (!options.length) return null;
                    let selected = 0;
                    if (prev && prev.selected) {
                        let selectedValue = prev.options[prev.selected].completion;
                        for(let i = 0; i < options.length; i++)if (options[i].completion == selectedValue) {
                            selected = i;
                            break;
                        }
                    }
                    return new CompletionDialog(options, makeAttrs(id, selected), {
                        pos: active.reduce((a, b)=>b.hasResult() ? Math.min(a, b.from) : a
                        , 1e8),
                        create: completionTooltip(completionState),
                        above: conf.aboveCursor
                    }, prev ? prev.timestamp : Date.now(), selected);
                }
                map(changes) {
                    return new CompletionDialog(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), {
                        pos: changes.mapPos(this.tooltip.pos)
                    }), this.timestamp, this.selected);
                }
            }
            class CompletionState {
                constructor(active, id, open){
                    this.active = active, this.id = id, this.open = open;
                }
                static start() {
                    return new CompletionState(dist_none, "cm-ac-" + Math.floor(2e6 * Math.random()).toString(36), null);
                }
                update(tr) {
                    let { state  } = tr, conf = state.facet(completionConfig), active = (conf.override || state.languageDataAt("autocomplete", cur1(state)).map(asSource)).map((source)=>(this.active.find((s)=>s.source == source
                        ) || new ActiveSource(source, this.active.some((a)=>0 != a.state
                        ) ? 1 : 0)).update(tr, conf)
                    );
                    active.length == this.active.length && active.every((a, i)=>a == this.active[i]
                    ) && (active = this.active);
                    let open = tr.selection || active.some((a)=>a.hasResult() && tr.changes.touchesRange(a.from, a.to)
                    ) || !sameResults(active, this.active) ? CompletionDialog.build(active, state, this.id, this.open, conf) : this.open && tr.docChanged ? this.open.map(tr.changes) : this.open;
                    for (let effect of (!open && active.every((a)=>1 != a.state
                    ) && active.some((a)=>a.hasResult()
                    ) && (active = active.map((a)=>a.hasResult() ? new ActiveSource(a.source, 0) : a
                    )), tr.effects))effect.is(setSelectedEffect) && (open = open && open.setSelected(effect.value, this.id));
                    return active == this.active && open == this.open ? this : new CompletionState(active, this.id, open);
                }
                get tooltip() {
                    return this.open ? this.open.tooltip : null;
                }
                get attrs() {
                    return this.open ? this.open.attrs : baseAttrs;
                }
            }
            function sameResults(a, b) {
                if (a == b) return !0;
                for(let iA = 0, iB = 0;;){
                    for(; iA < a.length && !a[iA].hasResult;)iA++;
                    for(; iB < b.length && !b[iB].hasResult;)iB++;
                    let endA = iA == a.length, endB = iB == b.length;
                    if (endA || endB) return endA == endB;
                    if (a[iA++].result != b[iB++].result) return !1;
                }
            }
            const baseAttrs = {
                "aria-autocomplete": "list"
            };
            function makeAttrs(id, selected) {
                return {
                    "aria-autocomplete": "list",
                    "aria-haspopup": "listbox",
                    "aria-activedescendant": id + "-" + selected,
                    "aria-controls": id
                };
            }
            const dist_none = [];
            function cmpOption(a, b) {
                return b.match[0] - a.match[0] || a.completion.label.localeCompare(b.completion.label);
            }
            function getUserEvent(tr) {
                return tr.isUserEvent("input.type") ? "input" : tr.isUserEvent("delete.backward") ? "delete" : null;
            }
            class ActiveSource {
                constructor(source, state, explicitPos = -1){
                    this.source = source, this.state = state, this.explicitPos = explicitPos;
                }
                hasResult() {
                    return !1;
                }
                update(tr, conf) {
                    let event = getUserEvent(tr), value = this;
                    for (let effect of (event ? value = value.handleUserEvent(tr, event, conf) : tr.docChanged ? value = value.handleChange(tr) : tr.selection && 0 != value.state && (value = new ActiveSource(value.source, 0)), tr.effects))if (effect.is(startCompletionEffect)) value = new ActiveSource(value.source, 1, effect.value ? cur1(tr.state) : -1);
                    else if (effect.is(closeCompletionEffect)) value = new ActiveSource(value.source, 0);
                    else if (effect.is(setActiveEffect)) for (let active of effect.value)active.source == value.source && (value = active);
                    return value;
                }
                handleUserEvent(tr, type, conf) {
                    return "delete" != type && conf.activateOnTyping ? new ActiveSource(this.source, 1) : this.map(tr.changes);
                }
                handleChange(tr) {
                    return tr.changes.touchesRange(cur1(tr.startState)) ? new ActiveSource(this.source, 0) : this.map(tr.changes);
                }
                map(changes) {
                    return changes.empty || this.explicitPos < 0 ? this : new ActiveSource(this.source, this.state, changes.mapPos(this.explicitPos));
                }
            }
            class ActiveResult extends ActiveSource {
                constructor(source, explicitPos, result, from, to){
                    super(source, 2, explicitPos), this.result = result, this.from = from, this.to = to;
                }
                hasResult() {
                    return !0;
                }
                handleUserEvent(tr, type, conf) {
                    var _a;
                    let from = tr.changes.mapPos(this.from), to = tr.changes.mapPos(this.to, 1), pos = cur1(tr.state);
                    if ((this.explicitPos < 0 ? pos <= from : pos < this.from) || pos > to || "delete" == type && cur1(tr.startState) == this.from) return new ActiveSource(this.source, "input" == type && conf.activateOnTyping ? 1 : 0);
                    let explicitPos = this.explicitPos < 0 ? -1 : tr.changes.mapPos(this.explicitPos), updated;
                    return checkValid(this.result.validFor, tr.state, from, to) ? new ActiveResult(this.source, explicitPos, this.result, from, to) : this.result.update && (updated = this.result.update(this.result, from, to, new CompletionContext(tr.state, pos, explicitPos >= 0))) ? new ActiveResult(this.source, explicitPos, updated, updated.from, null !== (_a = updated.to) && void 0 !== _a ? _a : cur1(tr.state)) : new ActiveSource(this.source, 1, explicitPos);
                }
                handleChange(tr) {
                    return tr.changes.touchesRange(this.from, this.to) ? new ActiveSource(this.source, 0) : this.map(tr.changes);
                }
                map(mapping) {
                    return mapping.empty ? this : new ActiveResult(this.source, this.explicitPos < 0 ? -1 : mapping.mapPos(this.explicitPos), this.result, mapping.mapPos(this.from), mapping.mapPos(this.to, 1));
                }
            }
            function checkValid(validFor, state, from, to) {
                if (!validFor) return !1;
                let text = state.sliceDoc(from, to);
                return "function" == typeof validFor ? validFor(text, from, to, state) : ensureAnchor(validFor, !0).test(text);
            }
            const startCompletionEffect = state_dist.Py.define(), closeCompletionEffect = state_dist.Py.define(), setActiveEffect = state_dist.Py.define({
                map: (sources, mapping)=>sources.map((s)=>s.map(mapping)
                    )
            }), setSelectedEffect = state_dist.Py.define(), completionState = state_dist.QQ.define({
                create: ()=>CompletionState.start()
                ,
                update: (value, tr)=>value.update(tr)
                ,
                provide: (f)=>[
                        dist.hJ.from(f, (val)=>val.tooltip
                        ),
                        dist.tk.contentAttributes.from(f, (state)=>state.attrs
                        ), 
                    ]
            }), CompletionInteractMargin = 75;
            function moveCompletionSelection(forward, by = "option") {
                return (view)=>{
                    let cState = view.state.field(completionState, !1);
                    if (!cState || !cState.open || Date.now() - cState.open.timestamp < CompletionInteractMargin) return !1;
                    let step = 1, tooltip;
                    "page" == by && (tooltip = (0, dist.gB)(view, cState.open.tooltip)) && (step = Math.max(2, Math.floor(tooltip.dom.offsetHeight / tooltip.dom.querySelector("li").offsetHeight) - 1));
                    let selected = cState.open.selected + step * (forward ? 1 : -1), { length  } = cState.open.options;
                    return selected < 0 ? selected = "page" == by ? 0 : length - 1 : selected >= length && (selected = "page" == by ? length - 1 : 0), view.dispatch({
                        effects: setSelectedEffect.of(selected)
                    }), !0;
                };
            }
            class RunningQuery {
                constructor(active, context){
                    this.active = active, this.context = context, this.time = Date.now(), this.updates = [], this.done = void 0;
                }
            }
            const DebounceTime = 50, MaxUpdateCount = 50, MinAbortTime = 1000, completionPlugin = dist.lg.fromClass(class {
                constructor(view){
                    for (let active of (this.view = view, this.debounceUpdate = -1, this.running = [], this.debounceAccept = -1, this.composing = 0, view.state.field(completionState).active))1 == active.state && this.startQuery(active);
                }
                update(update) {
                    let cState = update.state.field(completionState);
                    if (!update.selectionSet && !update.docChanged && update.startState.field(completionState) == cState) return;
                    let doesReset = update.transactions.some((tr)=>(tr.selection || tr.docChanged) && !getUserEvent(tr)
                    );
                    for(let i = 0; i < this.running.length; i++){
                        let query = this.running[i];
                        if (doesReset || query.updates.length + update.transactions.length > MaxUpdateCount && Date.now() - query.time > MinAbortTime) {
                            for (let handler of query.context.abortListeners)try {
                                handler();
                            } catch (e) {
                                (0, dist.OO)(this.view.state, e);
                            }
                            query.context.abortListeners = null, this.running.splice(i--, 1);
                        } else query.updates.push(...update.transactions);
                    }
                    if (this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate), this.debounceUpdate = cState.active.some((a)=>1 == a.state && !this.running.some((q)=>q.active.source == a.source
                        )
                    ) ? setTimeout(()=>this.startUpdate()
                    , DebounceTime) : -1, 0 != this.composing) for (let tr1 of update.transactions)"input" == getUserEvent(tr1) ? this.composing = 2 : 2 == this.composing && tr1.selection && (this.composing = 3);
                }
                startUpdate() {
                    this.debounceUpdate = -1;
                    let { state  } = this.view, cState = state.field(completionState);
                    for (let active of cState.active)1 != active.state || this.running.some((r)=>r.active.source == active.source
                    ) || this.startQuery(active);
                }
                startQuery(active) {
                    let { state  } = this.view, pos = cur1(state), context = new CompletionContext(state, pos, active.explicitPos == pos), pending = new RunningQuery(active, context);
                    this.running.push(pending), Promise.resolve(active.source(context)).then((result)=>{
                        pending.context.aborted || (pending.done = result || null, this.scheduleAccept());
                    }, (err)=>{
                        this.view.dispatch({
                            effects: closeCompletionEffect.of(null)
                        }), (0, dist.OO)(this.view.state, err);
                    });
                }
                scheduleAccept() {
                    this.running.every((q)=>void 0 !== q.done
                    ) ? this.accept() : this.debounceAccept < 0 && (this.debounceAccept = setTimeout(()=>this.accept()
                    , DebounceTime));
                }
                accept() {
                    var _a;
                    this.debounceAccept > -1 && clearTimeout(this.debounceAccept), this.debounceAccept = -1;
                    let updated = [], conf = this.view.state.facet(completionConfig);
                    for(let i = 0; i < this.running.length; i++){
                        let query = this.running[i];
                        if (void 0 === query.done) continue;
                        if (this.running.splice(i--, 1), query.done) {
                            let active = new ActiveResult(query.active.source, query.active.explicitPos, query.done, query.done.from, null !== (_a = query.done.to) && void 0 !== _a ? _a : cur1(query.updates.length ? query.updates[0].startState : this.view.state));
                            for (let tr of query.updates)active = active.update(tr, conf);
                            if (active.hasResult()) {
                                updated.push(active);
                                continue;
                            }
                        }
                        let current = this.view.state.field(completionState).active.find((a)=>a.source == query.active.source
                        );
                        if (current && 1 == current.state) {
                            if (null == query.done) {
                                let active = new ActiveSource(query.active.source, 0);
                                for (let tr of query.updates)active = active.update(tr, conf);
                                1 != active.state && updated.push(active);
                            } else this.startQuery(current);
                        }
                    }
                    updated.length && this.view.dispatch({
                        effects: setActiveEffect.of(updated)
                    });
                }
            }, {
                eventHandlers: {
                    blur () {
                        let state = this.view.state.field(completionState, !1);
                        state && state.tooltip && this.view.state.facet(completionConfig).closeOnBlur && this.view.dispatch({
                            effects: closeCompletionEffect.of(null)
                        });
                    },
                    compositionstart () {
                        this.composing = 1;
                    },
                    compositionend () {
                        3 == this.composing && setTimeout(()=>this.view.dispatch({
                                effects: startCompletionEffect.of(!1)
                            })
                        , 20), this.composing = 0;
                    }
                }
            }), autocomplete_dist_baseTheme = dist.tk.baseTheme({
                ".cm-tooltip.cm-tooltip-autocomplete": {
                    "& > ul": {
                        fontFamily: "monospace",
                        whiteSpace: "nowrap",
                        overflow: "hidden auto",
                        maxWidth_fallback: "700px",
                        maxWidth: "min(700px, 95vw)",
                        minWidth: "250px",
                        maxHeight: "10em",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        "& > li": {
                            overflowX: "hidden",
                            textOverflow: "ellipsis",
                            cursor: "pointer",
                            padding: "1px 3px",
                            lineHeight: 1.2
                        }
                    }
                },
                "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
                    background: "#17c",
                    color: "white"
                },
                "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
                    background: "#347",
                    color: "white"
                },
                ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
                    content: '"···"',
                    opacity: 0.5,
                    display: "block",
                    textAlign: "center"
                },
                ".cm-tooltip.cm-completionInfo": {
                    position: "absolute",
                    padding: "3px 9px",
                    width: "max-content",
                    maxWidth: "300px"
                },
                ".cm-completionInfo.cm-completionInfo-left": {
                    right: "100%"
                },
                ".cm-completionInfo.cm-completionInfo-right": {
                    left: "100%"
                },
                "&light .cm-snippetField": {
                    backgroundColor: "#00000022"
                },
                "&dark .cm-snippetField": {
                    backgroundColor: "#ffffff22"
                },
                ".cm-snippetFieldPosition": {
                    verticalAlign: "text-top",
                    width: 0,
                    height: "1.15em",
                    margin: "0 -0.7px -.7em",
                    borderLeft: "1.4px dotted #888"
                },
                ".cm-completionMatchedText": {
                    textDecoration: "underline"
                },
                ".cm-completionDetail": {
                    marginLeft: "0.5em",
                    fontStyle: "italic"
                },
                ".cm-completionIcon": {
                    fontSize: "90%",
                    width: ".8em",
                    display: "inline-block",
                    textAlign: "center",
                    paddingRight: ".6em",
                    opacity: "0.6"
                },
                ".cm-completionIcon-function, .cm-completionIcon-method": {
                    "&:after": {
                        content: "'ƒ'"
                    }
                },
                ".cm-completionIcon-class": {
                    "&:after": {
                        content: "'○'"
                    }
                },
                ".cm-completionIcon-interface": {
                    "&:after": {
                        content: "'◌'"
                    }
                },
                ".cm-completionIcon-variable": {
                    "&:after": {
                        content: "'𝑥'"
                    }
                },
                ".cm-completionIcon-constant": {
                    "&:after": {
                        content: "'𝐶'"
                    }
                },
                ".cm-completionIcon-type": {
                    "&:after": {
                        content: "'𝑡'"
                    }
                },
                ".cm-completionIcon-enum": {
                    "&:after": {
                        content: "'∪'"
                    }
                },
                ".cm-completionIcon-property": {
                    "&:after": {
                        content: "'□'"
                    }
                },
                ".cm-completionIcon-keyword": {
                    "&:after": {
                        content: "'🔑\uFE0E'"
                    }
                },
                ".cm-completionIcon-namespace": {
                    "&:after": {
                        content: "'▢'"
                    }
                },
                ".cm-completionIcon-text": {
                    "&:after": {
                        content: "'abc'",
                        fontSize: "50%",
                        verticalAlign: "middle"
                    }
                }
            });
            class FieldPos {
                constructor(field, line, from, to){
                    this.field = field, this.line = line, this.from = from, this.to = to;
                }
            }
            class FieldRange {
                constructor(field, from, to){
                    this.field = field, this.from = from, this.to = to;
                }
                map(changes) {
                    let from = changes.mapPos(this.from, -1, MapMode.TrackDel), to = changes.mapPos(this.to, 1, MapMode.TrackDel);
                    return null == from || null == to ? null : new FieldRange(this.field, from, to);
                }
            }
            class Snippet {
                constructor(lines, fieldPositions){
                    this.lines = lines, this.fieldPositions = fieldPositions;
                }
                instantiate(state, pos2) {
                    let text = [], lineStart = [
                        pos2
                    ], lineObj = state.doc.lineAt(pos2), baseIndent = /^\s*/.exec(lineObj.text)[0];
                    for (let line of this.lines){
                        if (text.length) {
                            let indent = baseIndent, tabs = /^\t*/.exec(line)[0].length;
                            for(let i = 0; i < tabs; i++)indent += state.facet(indentUnit);
                            lineStart.push(pos2 + indent.length - tabs), line = indent + line.slice(tabs);
                        }
                        text.push(line), pos2 += line.length + 1;
                    }
                    let ranges = this.fieldPositions.map((pos)=>new FieldRange(pos.field, lineStart[pos.line] + pos.from, lineStart[pos.line] + pos.to)
                    );
                    return {
                        text,
                        ranges
                    };
                }
                static parse(template) {
                    let fields = [], lines = [], positions = [], m;
                    for (let line of template.split(/\r\n?|\n/)){
                        for(; m = /[#$]\{(?:(\d+)(?::([^}]*))?|([^}]*))\}/.exec(line);){
                            let seq = m[1] ? +m[1] : null, name = m[2] || m[3] || "", found = -1;
                            for(let i = 0; i < fields.length; i++)(null != seq ? fields[i].seq == seq : name && fields[i].name == name) && (found = i);
                            if (found < 0) {
                                let i = 0;
                                for(; i < fields.length && (null == seq || null != fields[i].seq && fields[i].seq < seq);)i++;
                                for (let pos of (fields.splice(i, 0, {
                                    seq,
                                    name
                                }), found = i, positions))pos.field >= found && pos.field++;
                            }
                            positions.push(new FieldPos(found, lines.length, m.index, m.index + name.length)), line = line.slice(0, m.index) + name + line.slice(m.index + m[0].length);
                        }
                        lines.push(line);
                    }
                    return new Snippet(lines, positions);
                }
            }
            let fieldMarker = dist.p.widget({
                widget: new class extends dist.l9 {
                    toDOM() {
                        let span = document.createElement("span");
                        return span.className = "cm-snippetFieldPosition", span;
                    }
                    ignoreEvent() {
                        return !1;
                    }
                }()
            }), fieldRange = dist.p.mark({
                class: "cm-snippetField"
            });
            class ActiveSnippet {
                constructor(ranges, active){
                    this.ranges = ranges, this.active = active, this.deco = dist.p.set(ranges.map((r)=>(r.from == r.to ? fieldMarker : fieldRange).range(r.from, r.to)
                    ));
                }
                map(changes) {
                    let ranges = [];
                    for (let r of this.ranges){
                        let mapped = r.map(changes);
                        if (!mapped) return null;
                        ranges.push(mapped);
                    }
                    return new ActiveSnippet(ranges, this.active);
                }
                selectionInsideField(sel) {
                    return sel.ranges.every((range)=>this.ranges.some((r)=>r.field == this.active && r.from <= range.from && r.to >= range.to
                        )
                    );
                }
            }
            const setActive = state_dist.Py.define({
                map: (value, changes)=>value && value.map(changes)
            }), moveToField = state_dist.Py.define(), snippetState = state_dist.QQ.define({
                create: ()=>null
                ,
                update (value, tr) {
                    for (let effect of tr.effects){
                        if (effect.is(setActive)) return effect.value;
                        if (effect.is(moveToField) && value) return new ActiveSnippet(value.ranges, effect.value);
                    }
                    return value && tr.docChanged && (value = value.map(tr.changes)), value && tr.selection && !value.selectionInsideField(tr.selection) && (value = null), value;
                },
                provide: (f)=>dist.tk.decorations.from(f, (val)=>val ? val.deco : dist.p.none
                    )
            });
            function fieldSelection(ranges, field) {
                return state_dist.jT.create(ranges.filter((r)=>r.field == field
                ).map((r)=>state_dist.jT.range(r.from, r.to)
                ));
            }
            function moveField(dir) {
                return ({ state , dispatch  })=>{
                    let active = state.field(snippetState, !1);
                    if (!active || dir < 0 && 0 == active.active) return !1;
                    let next = active.active + dir, last = dir > 0 && !active.ranges.some((r)=>r.field == next + dir
                    );
                    return dispatch(state.update({
                        selection: fieldSelection(active.ranges, next),
                        effects: setActive.of(last ? null : new ActiveSnippet(active.ranges, next))
                    })), !0;
                };
            }
            const nextSnippetField = moveField(1), prevSnippetField = moveField(-1), defaultSnippetKeymap = [
                {
                    key: "Tab",
                    run: nextSnippetField,
                    shift: prevSnippetField
                },
                {
                    key: "Escape",
                    run: ({ state , dispatch  })=>!!state.field(snippetState, !1) && (dispatch(state.update({
                            effects: setActive.of(null)
                        })), !0)
                }, 
            ], snippetKeymap = state_dist.r$.define({
                combine: (maps)=>maps.length ? maps[0] : defaultSnippetKeymap
            });
            function storeWords(doc, wordRE, result, seen, ignoreAt) {
                for(let lines = doc.iterLines(), pos = 0; !lines.next().done;){
                    let { value  } = lines, m;
                    for(wordRE.lastIndex = 0; m = wordRE.exec(value);)if (!seen[m[0]] && pos + m.index != ignoreAt && (result.push({
                        type: "text",
                        label: m[0]
                    }), seen[m[0]] = !0, result.length >= 2000)) return;
                    pos += value.length + 1;
                }
            }
            function collectWords(doc, cache, wordRE, to, ignoreAt) {
                let big = doc.length >= 1000, cached = big && cache.get(doc);
                if (cached) return cached;
                let result = [], seen = Object.create(null);
                if (doc.children) {
                    let pos = 0;
                    for (let ch of doc.children){
                        if (ch.length >= 1000) for (let c of collectWords(ch, cache, wordRE, to - pos, ignoreAt - pos))seen[c.label] || (seen[c.label] = !0, result.push(c));
                        else storeWords(ch, wordRE, result, seen, ignoreAt - pos);
                        pos += ch.length + 1;
                    }
                } else storeWords(doc, wordRE, result, seen, ignoreAt);
                return big && result.length < 2000 && cache.set(doc, result), result;
            }
            state_dist.Wl.highest(dist.$f.compute([
                snippetKeymap
            ], (state)=>state.facet(snippetKeymap)
            )), dist.tk.domEventHandlers({
                mousedown (event, view) {
                    let active = view.state.field(snippetState, !1), pos;
                    if (!active || null == (pos = view.posAtCoords({
                        x: event.clientX,
                        y: event.clientY
                    }))) return !1;
                    let match = active.ranges.find((r)=>r.from <= pos && r.to >= pos
                    );
                    return !!match && match.field != active.active && (view.dispatch({
                        selection: fieldSelection(active.ranges, match.field),
                        effects: setActive.of(active.ranges.some((r)=>r.field > match.field
                        ) ? new ActiveSnippet(active.ranges, match.field) : null)
                    }), !0);
                }
            });
            const defaults = {
                brackets: [
                    "(",
                    "[",
                    "{",
                    "'",
                    '"'
                ],
                before: ")]}:;>"
            }, closeBracketEffect = state_dist.Py.define({
                map (value, mapping) {
                    let mapped = mapping.mapPos(value, -1, state_dist.gc.TrackAfter);
                    return null == mapped ? void 0 : mapped;
                }
            }), skipBracketEffect = state_dist.Py.define({
                map: (value, mapping)=>mapping.mapPos(value)
            }), closedBracket = new class extends state_dist.uU {
            }();
            closedBracket.startSide = 1, closedBracket.endSide = -1;
            const bracketState = state_dist.QQ.define({
                create: ()=>state_dist.Xs.empty
                ,
                update (value, tr) {
                    if (tr.selection) {
                        let lineStart = tr.state.doc.lineAt(tr.selection.main.head).from, prevLineStart = tr.startState.doc.lineAt(tr.startState.selection.main.head).from;
                        lineStart != tr.changes.mapPos(prevLineStart, -1) && (value = state_dist.Xs.empty);
                    }
                    for (let effect of (value = value.map(tr.changes), tr.effects))effect.is(closeBracketEffect) ? value = value.update({
                        add: [
                            closedBracket.range(effect.value, effect.value + 1), 
                        ]
                    }) : effect.is(skipBracketEffect) && (value = value.update({
                        filter: (from)=>from != effect.value
                    }));
                    return value;
                }
            });
            function closeBrackets() {
                return [
                    inputHandler,
                    bracketState
                ];
            }
            const definedClosing = "()[]{}<>";
            function closing1(ch) {
                for(let i = 0; i < definedClosing.length; i += 2)if (definedClosing.charCodeAt(i) == ch) return definedClosing.charAt(i + 1);
                return (0, state_dist.bg)(ch < 128 ? ch : ch + 1);
            }
            function config1(state, pos) {
                return state.languageDataAt("closeBrackets", pos)[0] || defaults;
            }
            const android = "object" == typeof navigator && /Android\b/.test(navigator.userAgent), inputHandler = dist.tk.inputHandler.of((view, from, to, insert)=>{
                if ((android ? view.composing : view.compositionStarted) || view.state.readOnly) return !1;
                let sel = view.state.selection.main;
                if (insert.length > 2 || 2 == insert.length && 1 == (0, state_dist.nZ)((0, state_dist.gm)(insert, 0)) || from != sel.from || to != sel.to) return !1;
                let tr = insertBracket(view.state, insert);
                return !!tr && (view.dispatch(tr), !0);
            });
            function insertBracket(state, bracket) {
                let conf = config1(state, state.selection.main.head), tokens = conf.brackets || defaults.brackets;
                for (let tok of tokens){
                    let closed = closing1((0, state_dist.gm)(tok, 0));
                    if (bracket == tok) return closed == tok ? handleSame(state, tok, tokens.indexOf(tok + tok + tok) > -1) : handleOpen(state, tok, closed, conf.before || defaults.before);
                    if (bracket == closed && closedBracketAt(state, state.selection.main.from)) return handleClose(state, tok, closed);
                }
                return null;
            }
            function closedBracketAt(state, pos) {
                let found = !1;
                return state.field(bracketState).between(0, state.doc.length, (from)=>{
                    from == pos && (found = !0);
                }), found;
            }
            function nextChar1(doc, pos) {
                let next = doc.sliceString(pos, pos + 2);
                return next.slice(0, (0, state_dist.nZ)((0, state_dist.gm)(next, 0)));
            }
            function prevChar(doc, pos) {
                let prev = doc.sliceString(pos - 2, pos);
                return (0, state_dist.nZ)((0, state_dist.gm)(prev, 0)) == prev.length ? prev : prev.slice(1);
            }
            function handleOpen(state, open, close, closeBefore) {
                let dont = null, changes = state.changeByRange((range)=>{
                    if (!range.empty) return {
                        changes: [
                            {
                                insert: open,
                                from: range.from
                            },
                            {
                                insert: close,
                                from: range.to
                            }, 
                        ],
                        effects: closeBracketEffect.of(range.to + open.length),
                        range: state_dist.jT.range(range.anchor + open.length, range.head + open.length)
                    };
                    let next = nextChar1(state.doc, range.head);
                    return !next || /\s/.test(next) || closeBefore.indexOf(next) > -1 ? {
                        changes: {
                            insert: open + close,
                            from: range.head
                        },
                        effects: closeBracketEffect.of(range.head + open.length),
                        range: state_dist.jT.cursor(range.head + open.length)
                    } : {
                        range: dont = range
                    };
                });
                return dont ? null : state.update(changes, {
                    scrollIntoView: !0,
                    userEvent: "input.type"
                });
            }
            function handleClose(state, _open, close) {
                let dont = null, moved = state.selection.ranges.map((range)=>range.empty && nextChar1(state.doc, range.head) == close ? state_dist.jT.cursor(range.head + close.length) : dont = range
                );
                return dont ? null : state.update({
                    selection: state_dist.jT.create(moved, state.selection.mainIndex),
                    scrollIntoView: !0,
                    effects: state.selection.ranges.map(({ from  })=>skipBracketEffect.of(from)
                    )
                });
            }
            function handleSame(state, token, allowTriple) {
                let dont = null, changes = state.changeByRange((range)=>{
                    if (!range.empty) return {
                        changes: [
                            {
                                insert: token,
                                from: range.from
                            },
                            {
                                insert: token,
                                from: range.to
                            }, 
                        ],
                        effects: closeBracketEffect.of(range.to + token.length),
                        range: state_dist.jT.range(range.anchor + token.length, range.head + token.length)
                    };
                    let pos = range.head, next = nextChar1(state.doc, pos);
                    if (next == token) {
                        if (nodeStart1(state, pos)) return {
                            changes: {
                                insert: token + token,
                                from: pos
                            },
                            effects: closeBracketEffect.of(pos + token.length),
                            range: state_dist.jT.cursor(pos + token.length)
                        };
                        if (closedBracketAt(state, pos)) {
                            let isTriple = allowTriple && state.sliceDoc(pos, pos + 3 * token.length) == token + token + token;
                            return {
                                range: state_dist.jT.cursor(pos + token.length * (isTriple ? 3 : 1)),
                                effects: skipBracketEffect.of(pos)
                            };
                        }
                    } else if (allowTriple && state.sliceDoc(pos - 2 * token.length, pos) == token + token && nodeStart1(state, pos - 2 * token.length)) return {
                        changes: {
                            insert: token + token + token + token,
                            from: pos
                        },
                        effects: closeBracketEffect.of(pos + token.length),
                        range: state_dist.jT.cursor(pos + token.length)
                    };
                    else if (state.charCategorizer(pos)(next) != state_dist.D0.Word) {
                        let prev = state.sliceDoc(pos - 1, pos);
                        if (prev != token && state.charCategorizer(pos)(prev) != state_dist.D0.Word && !probablyInString(state, pos, token)) return {
                            changes: {
                                insert: token + token,
                                from: pos
                            },
                            effects: closeBracketEffect.of(pos + token.length),
                            range: state_dist.jT.cursor(pos + token.length)
                        };
                    }
                    return {
                        range: dont = range
                    };
                });
                return dont ? null : state.update(changes, {
                    scrollIntoView: !0,
                    userEvent: "input.type"
                });
            }
            function nodeStart1(state, pos) {
                let tree = dist_syntaxTree(state).resolveInner(pos + 1);
                return tree.parent && tree.from == pos;
            }
            function probablyInString(state, pos, quoteToken) {
                let node = dist_syntaxTree(state).resolveInner(pos, -1);
                for(let i = 0; i < 5; i++){
                    if (state.sliceDoc(node.from, node.from + quoteToken.length) == quoteToken) return !0;
                    let parent = node.to == pos && node.parent;
                    if (!parent) break;
                    node = parent;
                }
                return !1;
            }
            function autocompletion(config = {}) {
                return [
                    completionState,
                    completionConfig.of(config),
                    completionPlugin,
                    completionKeymapExt,
                    autocomplete_dist_baseTheme, 
                ];
            }
            const completionKeymap = [
                {
                    key: "Ctrl-Space",
                    run: (view)=>!!view.state.field(completionState, !1) && (view.dispatch({
                            effects: startCompletionEffect.of(!0)
                        }), !0)
                },
                {
                    key: "Escape",
                    run (view) {
                        let cState = view.state.field(completionState, !1);
                        return !!(cState && cState.active.some((a)=>0 != a.state
                        )) && (view.dispatch({
                            effects: closeCompletionEffect.of(null)
                        }), !0);
                    }
                },
                {
                    key: "ArrowDown",
                    run: moveCompletionSelection(!0)
                },
                {
                    key: "ArrowUp",
                    run: moveCompletionSelection(!1)
                },
                {
                    key: "PageDown",
                    run: moveCompletionSelection(!0, "page")
                },
                {
                    key: "PageUp",
                    run: moveCompletionSelection(!1, "page")
                },
                {
                    key: "Enter",
                    run (view) {
                        let cState = view.state.field(completionState, !1);
                        return !(view.state.readOnly || !cState || !cState.open || Date.now() - cState.open.timestamp < CompletionInteractMargin) && (applyCompletion(view, cState.open.options[cState.open.selected]), !0);
                    }
                }, 
            ], completionKeymapExt = state_dist.Wl.highest(dist.$f.computeN([
                completionConfig
            ], (state)=>state.facet(completionConfig).defaultKeymap ? [
                    completionKeymap
                ] : []
            ));
            new WeakMap();
            class SelectedDiagnostic {
                constructor(from, to, diagnostic){
                    this.from = from, this.to = to, this.diagnostic = diagnostic;
                }
            }
            class LintState {
                constructor(diagnostics, panel, selected){
                    this.diagnostics = diagnostics, this.panel = panel, this.selected = selected;
                }
                static init(diagnostics, panel, state) {
                    let markedDiagnostics = diagnostics, diagnosticFilter = state.facet(lintConfig).markerFilter;
                    diagnosticFilter && (markedDiagnostics = diagnosticFilter(markedDiagnostics));
                    let ranges = dist.p.set(markedDiagnostics.map((d)=>d.from == d.to || d.from == d.to - 1 && state.doc.lineAt(d.from).to == d.from ? dist.p.widget({
                            widget: new DiagnosticWidget(d),
                            diagnostic: d
                        }).range(d.from) : dist.p.mark({
                            attributes: {
                                class: "cm-lintRange cm-lintRange-" + d.severity
                            },
                            diagnostic: d
                        }).range(d.from, d.to)
                    ), !0);
                    return new LintState(ranges, panel, findDiagnostic(ranges));
                }
            }
            function findDiagnostic(diagnostics, diagnostic = null, after = 0) {
                let found = null;
                return diagnostics.between(after, 1e9, (from, to, { spec  })=>{
                    if (!diagnostic || spec.diagnostic == diagnostic) return found = new SelectedDiagnostic(from, to, spec.diagnostic), !1;
                }), found;
            }
            function hideTooltip(tr, tooltip) {
                return !!(tr.effects.some((e)=>e.is(setDiagnosticsEffect)
                ) || tr.changes.touchesRange(tooltip.pos));
            }
            function maybeEnableLint(state1, effects) {
                return state1.field(lintState, !1) ? effects : effects.concat(state_dist.Py.appendConfig.of([
                    lintState,
                    dist.tk.decorations.compute([
                        lintState
                    ], (state)=>{
                        let { selected , panel  } = state.field(lintState);
                        return selected && panel && selected.from != selected.to ? dist.p.set([
                            activeMark.range(selected.from, selected.to), 
                        ]) : dist.p.none;
                    }),
                    (0, dist.bF)(lintTooltip, {
                        hideOn: hideTooltip
                    }),
                    lint_dist_baseTheme, 
                ]));
            }
            function setDiagnostics(state, diagnostics) {
                return {
                    effects: maybeEnableLint(state, [
                        setDiagnosticsEffect.of(diagnostics), 
                    ])
                };
            }
            const setDiagnosticsEffect = state_dist.Py.define(), dist_togglePanel = state_dist.Py.define(), movePanelSelection = state_dist.Py.define(), lintState = state_dist.QQ.define({
                create: ()=>new LintState(dist.p.none, null, null)
                ,
                update (value, tr) {
                    if (tr.docChanged) {
                        let mapped = value.diagnostics.map(tr.changes), selected = null;
                        if (value.selected) {
                            let selPos = tr.changes.mapPos(value.selected.from, 1);
                            selected = findDiagnostic(mapped, value.selected.diagnostic, selPos) || findDiagnostic(mapped, null, selPos);
                        }
                        value = new LintState(mapped, value.panel, selected);
                    }
                    for (let effect of tr.effects)effect.is(setDiagnosticsEffect) ? value = LintState.init(effect.value, value.panel, tr.state) : effect.is(dist_togglePanel) ? value = new LintState(value.diagnostics, effect.value ? LintPanel.open : null, value.selected) : effect.is(movePanelSelection) && (value = new LintState(value.diagnostics, value.panel, effect.value));
                    return value;
                },
                provide: (f)=>[
                        dist.mH.from(f, (val)=>val.panel
                        ),
                        dist.tk.decorations.from(f, (s)=>s.diagnostics
                        ), 
                    ]
            }), activeMark = dist.p.mark({
                class: "cm-lintRange cm-lintRange-active"
            });
            function lintTooltip(view, pos, side) {
                let { diagnostics  } = view.state.field(lintState), found = [], stackStart = 2e8, stackEnd = 0;
                diagnostics.between(pos - (side < 0 ? 1 : 0), pos + (side > 0 ? 1 : 0), (from, to, { spec  })=>{
                    pos >= from && pos <= to && (from == to || (pos > from || side > 0) && (pos < to || side < 0)) && (found.push(spec.diagnostic), stackStart = Math.min(from, stackStart), stackEnd = Math.max(to, stackEnd));
                });
                let diagnosticFilter = view.state.facet(lintConfig).tooltipFilter;
                return (diagnosticFilter && (found = diagnosticFilter(found)), found.length) ? {
                    pos: stackStart,
                    end: stackEnd,
                    above: view.state.doc.lineAt(stackStart).to < stackEnd,
                    create: ()=>({
                            dom: diagnosticsTooltip(view, found)
                        })
                } : null;
            }
            function diagnosticsTooltip(view, diagnostics) {
                return crelt("ul", {
                    class: "cm-tooltip-lint"
                }, diagnostics.map((d)=>renderDiagnostic(view, d, !1)
                ));
            }
            const closeLintPanel = (view)=>{
                let field = view.state.field(lintState, !1);
                return !!field && !!field.panel && (view.dispatch({
                    effects: dist_togglePanel.of(!1)
                }), !0);
            }, lintPlugin = dist.lg.fromClass(class {
                constructor(view){
                    this.view = view, this.timeout = -1, this.set = !0;
                    let { delay  } = view.state.facet(lintConfig);
                    this.lintTime = Date.now() + delay, this.run = this.run.bind(this), this.timeout = setTimeout(this.run, delay);
                }
                run() {
                    let now = Date.now();
                    if (now < this.lintTime - 10) setTimeout(this.run, this.lintTime - now);
                    else {
                        this.set = !1;
                        let { state  } = this.view, { sources  } = state.facet(lintConfig);
                        Promise.all(sources.map((source)=>Promise.resolve(source(this.view))
                        )).then((annotations)=>{
                            let all = annotations.reduce((a, b)=>a.concat(b)
                            );
                            this.view.state.doc == state.doc && this.view.dispatch(setDiagnostics(this.view.state, all));
                        }, (error)=>{
                            (0, dist.OO)(this.view.state, error);
                        });
                    }
                }
                update(update) {
                    let config = update.state.facet(lintConfig);
                    (update.docChanged || config != update.startState.facet(lintConfig)) && (this.lintTime = Date.now() + config.delay, this.set || (this.set = !0, this.timeout = setTimeout(this.run, config.delay)));
                }
                force() {
                    this.set && (this.lintTime = Date.now(), this.run());
                }
                destroy() {
                    clearTimeout(this.timeout);
                }
            }), lintConfig = state_dist.r$.define({
                combine: (input)=>Object.assign({
                        sources: input.map((i)=>i.source
                        )
                    }, (0, state_dist.BO)(input.map((i)=>i.config
                    ), {
                        delay: 750,
                        markerFilter: null,
                        tooltipFilter: null
                    }))
                ,
                enables: lintPlugin
            });
            function assignKeys(actions) {
                let assigned = [];
                if (actions) actions: for (let { name  } of actions){
                    for(let i = 0; i < name.length; i++){
                        let ch = name[i];
                        if (/[a-zA-Z]/.test(ch) && !assigned.some((c)=>c.toLowerCase() == ch.toLowerCase()
                        )) {
                            assigned.push(ch);
                            continue actions;
                        }
                    }
                    assigned.push("");
                }
                return assigned;
            }
            function renderDiagnostic(view, diagnostic, inPanel) {
                var _a;
                let keys = inPanel ? assignKeys(diagnostic.actions) : [];
                return crelt("li", {
                    class: "cm-diagnostic cm-diagnostic-" + diagnostic.severity
                }, crelt("span", {
                    class: "cm-diagnosticText"
                }, diagnostic.message), null === (_a = diagnostic.actions) || void 0 === _a ? void 0 : _a.map((action, i)=>{
                    let click = (e)=>{
                        e.preventDefault();
                        let found = findDiagnostic(view.state.field(lintState).diagnostics, diagnostic);
                        found && action.apply(view, found.from, found.to);
                    }, { name  } = action, keyIndex = keys[i] ? name.indexOf(keys[i]) : -1, nameElt = keyIndex < 0 ? name : [
                        name.slice(0, keyIndex),
                        crelt("u", name.slice(keyIndex, keyIndex + 1)),
                        name.slice(keyIndex + 1), 
                    ];
                    return crelt("button", {
                        type: "button",
                        class: "cm-diagnosticAction",
                        onclick: click,
                        onmousedown: click,
                        "aria-label": ` Action: ${name}${keyIndex < 0 ? "" : ` (access key "${keys[i]})"`}.`
                    }, nameElt);
                }), diagnostic.source && crelt("div", {
                    class: "cm-diagnosticSource"
                }, diagnostic.source));
            }
            class DiagnosticWidget extends dist.l9 {
                constructor(diagnostic){
                    super(), this.diagnostic = diagnostic;
                }
                eq(other) {
                    return other.diagnostic == this.diagnostic;
                }
                toDOM() {
                    return crelt("span", {
                        class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity
                    });
                }
            }
            class PanelItem {
                constructor(view, diagnostic){
                    this.diagnostic = diagnostic, this.id = "item_" + Math.floor(0xffffffff * Math.random()).toString(16), this.dom = renderDiagnostic(view, diagnostic, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
                }
            }
            class LintPanel {
                constructor(view){
                    this.view = view, this.items = [], this.list = crelt("ul", {
                        tabIndex: 0,
                        role: "listbox",
                        "aria-label": this.view.state.phrase("Diagnostics"),
                        onkeydown: (event)=>{
                            if (27 == event.keyCode) closeLintPanel(this.view), this.view.focus();
                            else if (38 == event.keyCode || 33 == event.keyCode) this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
                            else if (40 == event.keyCode || 34 == event.keyCode) this.moveSelection((this.selectedIndex + 1) % this.items.length);
                            else if (36 == event.keyCode) this.moveSelection(0);
                            else if (35 == event.keyCode) this.moveSelection(this.items.length - 1);
                            else if (13 == event.keyCode) this.view.focus();
                            else {
                                if (!(event.keyCode >= 65) || !(event.keyCode <= 90) || !(this.selectedIndex >= 0)) return;
                                let { diagnostic  } = this.items[this.selectedIndex], keys = assignKeys(diagnostic.actions);
                                for(let i = 0; i < keys.length; i++)if (keys[i].toUpperCase().charCodeAt(0) == event.keyCode) {
                                    let found = findDiagnostic(this.view.state.field(lintState).diagnostics, diagnostic);
                                    found && diagnostic.actions[i].apply(view, found.from, found.to);
                                }
                            }
                            event.preventDefault();
                        },
                        onclick: (event)=>{
                            for(let i = 0; i < this.items.length; i++)this.items[i].dom.contains(event.target) && this.moveSelection(i);
                        }
                    }), this.dom = crelt("div", {
                        class: "cm-panel-lint"
                    }, this.list, crelt("button", {
                        type: "button",
                        name: "close",
                        "aria-label": this.view.state.phrase("close"),
                        onclick: ()=>closeLintPanel(this.view)
                    }, "×")), this.update();
                }
                get selectedIndex() {
                    let selected = this.view.state.field(lintState).selected;
                    if (!selected) return -1;
                    for(let i = 0; i < this.items.length; i++)if (this.items[i].diagnostic == selected.diagnostic) return i;
                    return -1;
                }
                update() {
                    let { diagnostics , selected  } = this.view.state.field(lintState), i = 0, needsSync = !1, newSelectedItem = null;
                    for(diagnostics.between(0, this.view.state.doc.length, (_start, _end, { spec  })=>{
                        let found = -1, item;
                        for(let j = i; j < this.items.length; j++)if (this.items[j].diagnostic == spec.diagnostic) {
                            found = j;
                            break;
                        }
                        found < 0 ? (item = new PanelItem(this.view, spec.diagnostic), this.items.splice(i, 0, item), needsSync = !0) : (item = this.items[found], found > i && (this.items.splice(i, found - i), needsSync = !0)), selected && item.diagnostic == selected.diagnostic ? item.dom.hasAttribute("aria-selected") || (item.dom.setAttribute("aria-selected", "true"), newSelectedItem = item) : item.dom.hasAttribute("aria-selected") && item.dom.removeAttribute("aria-selected"), i++;
                    }); i < this.items.length && !(1 == this.items.length && this.items[0].diagnostic.from < 0);)needsSync = !0, this.items.pop();
                    0 == this.items.length && (this.items.push(new PanelItem(this.view, {
                        from: -1,
                        to: -1,
                        severity: "info",
                        message: this.view.state.phrase("No diagnostics")
                    })), needsSync = !0), newSelectedItem ? (this.list.setAttribute("aria-activedescendant", newSelectedItem.id), this.view.requestMeasure({
                        key: this,
                        read: ()=>({
                                sel: newSelectedItem.dom.getBoundingClientRect(),
                                panel: this.list.getBoundingClientRect()
                            })
                        ,
                        write: ({ sel , panel  })=>{
                            sel.top < panel.top ? this.list.scrollTop -= panel.top - sel.top : sel.bottom > panel.bottom && (this.list.scrollTop += sel.bottom - panel.bottom);
                        }
                    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), needsSync && this.sync();
                }
                sync() {
                    let domPos = this.list.firstChild;
                    function rm() {
                        let prev = domPos;
                        domPos = prev.nextSibling, prev.remove();
                    }
                    for (let item of this.items)if (item.dom.parentNode == this.list) {
                        for(; domPos != item.dom;)rm();
                        domPos = item.dom.nextSibling;
                    } else this.list.insertBefore(item.dom, domPos);
                    for(; domPos;)rm();
                }
                moveSelection(selectedIndex) {
                    if (this.selectedIndex < 0) return;
                    let field = this.view.state.field(lintState), selection = findDiagnostic(field.diagnostics, this.items[selectedIndex].diagnostic);
                    selection && this.view.dispatch({
                        selection: {
                            anchor: selection.from,
                            head: selection.to
                        },
                        scrollIntoView: !0,
                        effects: movePanelSelection.of(selection)
                    });
                }
                static open(view) {
                    return new LintPanel(view);
                }
            }
            function svg(content, attrs = 'viewBox="0 0 40 40"') {
                return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${encodeURIComponent(content)}</svg>')`;
            }
            function underline(color) {
                return svg(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${color}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
            }
            const lint_dist_baseTheme = dist.tk.baseTheme({
                ".cm-diagnostic": {
                    padding: "3px 6px 3px 8px",
                    marginLeft: "-1px",
                    display: "block",
                    whiteSpace: "pre-wrap"
                },
                ".cm-diagnostic-error": {
                    borderLeft: "5px solid #d11"
                },
                ".cm-diagnostic-warning": {
                    borderLeft: "5px solid orange"
                },
                ".cm-diagnostic-info": {
                    borderLeft: "5px solid #999"
                },
                ".cm-diagnosticAction": {
                    font: "inherit",
                    border: "none",
                    padding: "2px 4px",
                    backgroundColor: "#444",
                    color: "white",
                    borderRadius: "3px",
                    marginLeft: "8px"
                },
                ".cm-diagnosticSource": {
                    fontSize: "70%",
                    opacity: 0.7
                },
                ".cm-lintRange": {
                    backgroundPosition: "left bottom",
                    backgroundRepeat: "repeat-x",
                    paddingBottom: "0.7px"
                },
                ".cm-lintRange-error": {
                    backgroundImage: underline("#d11")
                },
                ".cm-lintRange-warning": {
                    backgroundImage: underline("orange")
                },
                ".cm-lintRange-info": {
                    backgroundImage: underline("#999")
                },
                ".cm-lintRange-active": {
                    backgroundColor: "#ffdd9980"
                },
                ".cm-tooltip-lint": {
                    padding: 0,
                    margin: 0
                },
                ".cm-lintPoint": {
                    position: "relative",
                    "&:after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "-2px",
                        borderLeft: "3px solid transparent",
                        borderRight: "3px solid transparent",
                        borderBottom: "4px solid #d11"
                    }
                },
                ".cm-lintPoint-warning": {
                    "&:after": {
                        borderBottomColor: "orange"
                    }
                },
                ".cm-lintPoint-info": {
                    "&:after": {
                        borderBottomColor: "#999"
                    }
                },
                ".cm-panel.cm-panel-lint": {
                    position: "relative",
                    "& ul": {
                        maxHeight: "100px",
                        overflowY: "auto",
                        "& [aria-selected]": {
                            backgroundColor: "#ddd",
                            "& u": {
                                textDecoration: "underline"
                            }
                        },
                        "&:focus [aria-selected]": {
                            background_fallback: "#bdf",
                            backgroundColor: "Highlight",
                            color_fallback: "white",
                            color: "HighlightText"
                        },
                        "& u": {
                            textDecoration: "none"
                        },
                        padding: 0,
                        margin: 0
                    },
                    "& [name=close]": {
                        position: "absolute",
                        top: "0",
                        right: "2px",
                        background: "inherit",
                        border: "none",
                        font: "inherit",
                        padding: 0,
                        margin: 0
                    }
                }
            });
            class LintGutterMarker extends dist.SJ {
                constructor(diagnostics){
                    super(), this.diagnostics = diagnostics, this.severity = diagnostics.reduce((max, d)=>{
                        let s = d.severity;
                        return "error" == s || "warning" == s && "info" == max ? s : max;
                    }, "info");
                }
                toDOM(view) {
                    let elt = document.createElement("div");
                    elt.className = "cm-lint-marker cm-lint-marker-" + this.severity;
                    let diagnostics = this.diagnostics, diagnosticsFilter = view.state.facet(lintGutterConfig).tooltipFilter;
                    return diagnosticsFilter && (diagnostics = diagnosticsFilter(diagnostics)), diagnostics.length && (elt.onmouseover = ()=>gutterMarkerMouseOver(view, elt, diagnostics)
                    ), elt;
                }
            }
            function trackHoverOn(view, marker) {
                let mousemove = (event)=>{
                    let rect = marker.getBoundingClientRect();
                    if (!(event.clientX > rect.left - 10) || !(event.clientX < rect.right + 10) || !(event.clientY > rect.top - 10) || !(event.clientY < rect.bottom + 10)) {
                        for(let target = event.target; target; target = target.parentNode)if (1 == target.nodeType && target.classList.contains("cm-tooltip-lint")) return;
                        window.removeEventListener("mousemove", mousemove), view.state.field(lintGutterTooltip) && view.dispatch({
                            effects: setLintGutterTooltip.of(null)
                        });
                    }
                };
                window.addEventListener("mousemove", mousemove);
            }
            function gutterMarkerMouseOver(view, marker, diagnostics) {
                function hovered() {
                    let line = view.elementAtHeight(marker.getBoundingClientRect().top + 5 - view.documentTop);
                    const linePos = view.coordsAtPos(line.from);
                    linePos && view.dispatch({
                        effects: setLintGutterTooltip.of({
                            pos: line.from,
                            above: !1,
                            create: ()=>({
                                    dom: diagnosticsTooltip(view, diagnostics),
                                    getCoords: ()=>marker.getBoundingClientRect()
                                })
                        })
                    }), marker.onmouseout = marker.onmousemove = null, trackHoverOn(view, marker);
                }
                let { hoverTime  } = view.state.facet(lintGutterConfig), hoverTimeout = setTimeout(hovered, hoverTime);
                marker.onmouseout = ()=>{
                    clearTimeout(hoverTimeout), marker.onmouseout = marker.onmousemove = null;
                }, marker.onmousemove = ()=>{
                    clearTimeout(hoverTimeout), hoverTimeout = setTimeout(hovered, hoverTime);
                };
            }
            function markersForDiagnostics(doc, diagnostics) {
                let byLine = Object.create(null);
                for (let diagnostic of diagnostics){
                    let line = doc.lineAt(diagnostic.from);
                    (byLine[line.from] || (byLine[line.from] = [])).push(diagnostic);
                }
                let markers = [];
                for(let line in byLine)markers.push(new LintGutterMarker(byLine[line]).range(+line));
                return state_dist.Xs.of(markers, !0);
            }
            (0, dist.v5)({
                class: "cm-gutter-lint",
                markers: (view)=>view.state.field(lintGutterMarkers)
            });
            const lintGutterMarkers = state_dist.QQ.define({
                create: ()=>state_dist.Xs.empty
                ,
                update (markers, tr) {
                    markers = markers.map(tr.changes);
                    let diagnosticFilter = tr.state.facet(lintGutterConfig).markerFilter;
                    for (let effect of tr.effects)if (effect.is(setDiagnosticsEffect)) {
                        let diagnostics = effect.value;
                        diagnosticFilter && (diagnostics = diagnosticFilter(diagnostics || [])), markers = markersForDiagnostics(tr.state.doc, diagnostics.slice(0));
                    }
                    return markers;
                }
            }), setLintGutterTooltip = state_dist.Py.define(), lintGutterTooltip = state_dist.QQ.define({
                create: ()=>null
                ,
                update: (tooltip, tr)=>(tooltip && tr.docChanged && (tooltip = hideTooltip(tr, tooltip) ? null : Object.assign(Object.assign({}, tooltip), {
                        pos: tr.changes.mapPos(tooltip.pos)
                    })), tr.effects.reduce((t, e)=>e.is(setLintGutterTooltip) ? e.value : t
                    , tooltip))
                ,
                provide: (field)=>dist.hJ.from(field)
            }), lintGutterConfig = (dist.tk.baseTheme({
                ".cm-gutter-lint": {
                    width: "1.4em",
                    "& .cm-gutterElement": {
                        padding: ".2em"
                    }
                },
                ".cm-lint-marker": {
                    width: "1em",
                    height: "1em"
                },
                ".cm-lint-marker-info": {
                    content: svg('<path fill="#aaf" stroke="#77e" stroke-width="6" stroke-linejoin="round" d="M5 5L35 5L35 35L5 35Z"/>')
                },
                ".cm-lint-marker-warning": {
                    content: svg('<path fill="#fe8" stroke="#fd7" stroke-width="6" stroke-linejoin="round" d="M20 6L37 35L3 35Z"/>')
                },
                ".cm-lint-marker-error:before": {
                    content: svg('<circle cx="20" cy="20" r="15" fill="#f87" stroke="#f43" stroke-width="6"/>')
                }
            }), state_dist.r$.define({
                combine: (configs)=>(0, state_dist.BO)(configs, {
                        hoverTime: 300,
                        markerFilter: null,
                        tooltipFilter: null
                    })
            })), basicSetup1 = [
                (0, dist.Eu)(),
                (0, dist.HQ)(),
                (0, dist.AE)(),
                dist_history(),
                foldGutter(),
                (0, dist.Uw)(),
                (0, dist.qr)(),
                state_dist.yy.allowMultipleSelections.of(!0),
                indentOnInput(),
                syntaxHighlighting(defaultHighlightStyle, {
                    fallback: !0
                }),
                bracketMatching(),
                closeBrackets(),
                autocompletion(),
                (0, dist.Zs)(),
                (0, dist.S2)(),
                (0, dist.ZO)(),
                highlightSelectionMatches(),
                dist.$f.of([
                    {
                        key: "Backspace",
                        run ({ state , dispatch  }) {
                            if (state.readOnly) return !1;
                            let tokens = config1(state, state.selection.main.head).brackets || defaults.brackets, dont = null, changes = state.changeByRange((range)=>{
                                if (range.empty) {
                                    let before = prevChar(state.doc, range.head);
                                    for (let token of tokens)if (token == before && nextChar1(state.doc, range.head) == closing1((0, state_dist.gm)(token, 0))) return {
                                        changes: {
                                            from: range.head - token.length,
                                            to: range.head + token.length
                                        },
                                        range: state_dist.jT.cursor(range.head - token.length),
                                        userEvent: "delete.backward"
                                    };
                                }
                                return {
                                    range: dont = range
                                };
                            });
                            return dont || dispatch(state.update(changes, {
                                scrollIntoView: !0
                            })), !dont;
                        }
                    },
                    ...defaultKeymap,
                    {
                        key: "Mod-f",
                        run: openSearchPanel,
                        scope: "editor search-panel"
                    },
                    {
                        key: "F3",
                        run: findNext,
                        shift: findPrevious,
                        scope: "editor search-panel",
                        preventDefault: !0
                    },
                    {
                        key: "Mod-g",
                        run: findNext,
                        shift: findPrevious,
                        scope: "editor search-panel",
                        preventDefault: !0
                    },
                    {
                        key: "Escape",
                        run: closeSearchPanel,
                        scope: "editor search-panel"
                    },
                    {
                        key: "Mod-Shift-l",
                        run ({ state , dispatch  }) {
                            let sel = state.selection;
                            if (sel.ranges.length > 1 || sel.main.empty) return !1;
                            let { from , to  } = sel.main, ranges = [], main = 0;
                            for(let cur = new SearchCursor(state.doc, state.sliceDoc(from, to)); !cur.next().done;){
                                if (ranges.length > 1000) return !1;
                                cur.value.from == from && (main = ranges.length), ranges.push(state_dist.jT.range(cur.value.from, cur.value.to));
                            }
                            return dispatch(state.update({
                                selection: state_dist.jT.create(ranges, main),
                                userEvent: "select.search.matches"
                            })), !0;
                        }
                    },
                    {
                        key: "Alt-g",
                        run (view) {
                            let panel = (0, dist.Sd)(view, createLineDialog);
                            if (!panel) {
                                let effects = [
                                    dialogEffect.of(!0)
                                ];
                                null == view.state.field(dialogField, !1) && effects.push(state_dist.Py.appendConfig.of([
                                    dialogField,
                                    dist_baseTheme$1
                                ])), view.dispatch({
                                    effects
                                }), panel = (0, dist.Sd)(view, createLineDialog);
                            }
                            return panel && panel.dom.querySelector("input").focus(), !0;
                        }
                    },
                    {
                        key: "Mod-d",
                        run ({ state , dispatch  }) {
                            let { ranges  } = state.selection;
                            if (ranges.some((sel)=>sel.from === sel.to
                            )) return selectWord({
                                state,
                                dispatch
                            });
                            let searchedText = state.sliceDoc(ranges[0].from, ranges[0].to);
                            if (state.selection.ranges.some((r)=>state.sliceDoc(r.from, r.to) != searchedText
                            )) return !1;
                            let range = findNextOccurrence(state, searchedText);
                            return !!range && (dispatch(state.update({
                                selection: state.selection.addRange(state_dist.jT.range(range.from, range.to), !1),
                                effects: dist.tk.scrollIntoView(range.to)
                            })), !0);
                        },
                        preventDefault: !0
                    },
                    {
                        key: "Mod-z",
                        run: undo,
                        preventDefault: !0
                    },
                    {
                        key: "Mod-y",
                        mac: "Mod-Shift-z",
                        run: redo,
                        preventDefault: !0
                    },
                    {
                        key: "Mod-u",
                        run: undoSelection,
                        preventDefault: !0
                    },
                    {
                        key: "Alt-u",
                        mac: "Mod-Shift-u",
                        run: redoSelection,
                        preventDefault: !0
                    },
                    {
                        key: "Ctrl-Shift-[",
                        mac: "Cmd-Alt-[",
                        run (view) {
                            for (let line of selectedLines(view)){
                                let range = foldable(view.state, line.from, line.to);
                                if (range) return view.dispatch({
                                    effects: maybeEnable(view.state, [
                                        foldEffect.of(range),
                                        announceFold(view, range), 
                                    ])
                                }), !0;
                            }
                            return !1;
                        }
                    },
                    {
                        key: "Ctrl-Shift-]",
                        mac: "Cmd-Alt-]",
                        run (view) {
                            if (!view.state.field(foldState, !1)) return !1;
                            let effects = [];
                            for (let line of selectedLines(view)){
                                let folded = findFold(view.state, line.from, line.to);
                                folded && effects.push(unfoldEffect.of(folded), announceFold(view, folded, !1));
                            }
                            return effects.length && view.dispatch({
                                effects
                            }), effects.length > 0;
                        }
                    },
                    {
                        key: "Ctrl-Alt-[",
                        run (view) {
                            let { state  } = view, effects = [];
                            for(let pos = 0; pos < state.doc.length;){
                                let line = view.lineBlockAt(pos), range = foldable(state, line.from, line.to);
                                range && effects.push(foldEffect.of(range)), pos = (range ? view.lineBlockAt(range.to) : line).to + 1;
                            }
                            return effects.length && view.dispatch({
                                effects: maybeEnable(view.state, effects)
                            }), !!effects.length;
                        }
                    },
                    {
                        key: "Ctrl-Alt-]",
                        run (view) {
                            let field = view.state.field(foldState, !1);
                            if (!field || !field.size) return !1;
                            let effects = [];
                            return field.between(0, view.state.doc.length, (from, to)=>{
                                effects.push(unfoldEffect.of({
                                    from,
                                    to
                                }));
                            }), view.dispatch({
                                effects
                            }), !0;
                        }
                    },
                    ...completionKeymap,
                    {
                        key: "Mod-Shift-m",
                        run (view) {
                            let field = view.state.field(lintState, !1);
                            field && field.panel || view.dispatch({
                                effects: maybeEnableLint(view.state, [
                                    dist_togglePanel.of(!0), 
                                ])
                            });
                            let panel = (0, dist.Sd)(view, LintPanel.open);
                            return panel && panel.dom.querySelector(".cm-panel-lint ul").focus(), !0;
                        }
                    },
                    {
                        key: "F8",
                        run (view) {
                            let field = view.state.field(lintState, !1);
                            if (!field) return !1;
                            let sel = view.state.selection.main, next = field.diagnostics.iter(sel.to + 1);
                            return (!!next.value || !!(next = field.diagnostics.iter(0)).value && (next.from != sel.from || next.to != sel.to)) && (view.dispatch({
                                selection: {
                                    anchor: next.from,
                                    head: next.to
                                },
                                scrollIntoView: !0
                            }), !0);
                        }
                    }, 
                ]), 
            ], chalky = "#e5c07b", coral = "#e06c75", cyan = "#56b6c2", invalid = "#ffffff", ivory = "#abb2bf", stone = "#7d8799", malibu = "#61afef", sage = "#98c379", whiskey = "#d19a66", violet = "#c678dd", darkBackground = "#21252b", highlightBackground = "#2c313a", background = "#282c34", tooltipBackground = "#353a42", selection1 = "#3E4451", cursor1 = "#528bff", oneDarkTheme = dist.tk.theme({
                "&": {
                    color: ivory,
                    backgroundColor: background
                },
                ".cm-content": {
                    caretColor: cursor1
                },
                ".cm-cursor, .cm-dropCursor": {
                    borderLeftColor: cursor1
                },
                "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
                    backgroundColor: selection1
                },
                ".cm-panels": {
                    backgroundColor: darkBackground,
                    color: ivory
                },
                ".cm-panels.cm-panels-top": {
                    borderBottom: "2px solid black"
                },
                ".cm-panels.cm-panels-bottom": {
                    borderTop: "2px solid black"
                },
                ".cm-searchMatch": {
                    backgroundColor: "#72a1ff59",
                    outline: "1px solid #457dff"
                },
                ".cm-searchMatch.cm-searchMatch-selected": {
                    backgroundColor: "#6199ff2f"
                },
                ".cm-activeLine": {
                    backgroundColor: highlightBackground
                },
                ".cm-selectionMatch": {
                    backgroundColor: "#aafe661a"
                },
                "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
                    backgroundColor: "#bad0f847",
                    outline: "1px solid #515a6b"
                },
                ".cm-gutters": {
                    backgroundColor: background,
                    color: stone,
                    border: "none"
                },
                ".cm-activeLineGutter": {
                    backgroundColor: highlightBackground
                },
                ".cm-foldPlaceholder": {
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#ddd"
                },
                ".cm-tooltip": {
                    border: "none",
                    backgroundColor: tooltipBackground
                },
                ".cm-tooltip .cm-tooltip-arrow:before": {
                    borderTopColor: "transparent",
                    borderBottomColor: "transparent"
                },
                ".cm-tooltip .cm-tooltip-arrow:after": {
                    borderTopColor: tooltipBackground,
                    borderBottomColor: tooltipBackground
                },
                ".cm-tooltip-autocomplete": {
                    "& > ul > li[aria-selected]": {
                        backgroundColor: highlightBackground,
                        color: ivory
                    }
                }
            }, {
                dark: !0
            }), oneDarkHighlightStyle = HighlightStyle.define([
                {
                    tag: tags1.keyword,
                    color: violet
                },
                {
                    tag: [
                        tags1.name,
                        tags1.deleted,
                        tags1.character,
                        tags1.propertyName,
                        tags1.macroName, 
                    ],
                    color: coral
                },
                {
                    tag: [
                        tags1.function(tags1.variableName),
                        tags1.labelName, 
                    ],
                    color: malibu
                },
                {
                    tag: [
                        tags1.color,
                        tags1.constant(tags1.name),
                        tags1.standard(tags1.name), 
                    ],
                    color: whiskey
                },
                {
                    tag: [
                        tags1.definition(tags1.name),
                        tags1.separator, 
                    ],
                    color: ivory
                },
                {
                    tag: [
                        tags1.typeName,
                        tags1.className,
                        tags1.number,
                        tags1.changed,
                        tags1.annotation,
                        tags1.modifier,
                        tags1.self,
                        tags1.namespace, 
                    ],
                    color: chalky
                },
                {
                    tag: [
                        tags1.operator,
                        tags1.operatorKeyword,
                        tags1.url,
                        tags1.escape,
                        tags1.regexp,
                        tags1.link,
                        tags1.special(tags1.string), 
                    ],
                    color: cyan
                },
                {
                    tag: [
                        tags1.meta,
                        tags1.comment
                    ],
                    color: stone
                },
                {
                    tag: tags1.strong,
                    fontWeight: "bold"
                },
                {
                    tag: tags1.emphasis,
                    fontStyle: "italic"
                },
                {
                    tag: tags1.strikethrough,
                    textDecoration: "line-through"
                },
                {
                    tag: tags1.link,
                    color: stone,
                    textDecoration: "underline"
                },
                {
                    tag: tags1.heading,
                    fontWeight: "bold",
                    color: coral
                },
                {
                    tag: [
                        tags1.atom,
                        tags1.bool,
                        tags1.special(tags1.variableName), 
                    ],
                    color: whiskey
                },
                {
                    tag: [
                        tags1.processingInstruction,
                        tags1.string,
                        tags1.inserted, 
                    ],
                    color: sage
                },
                {
                    tag: tags1.invalid,
                    color: invalid
                }, 
            ]), oneDark = [
                oneDarkTheme,
                syntaxHighlighting(oneDarkHighlightStyle), 
            ];
            var defaultLightThemeOption = dist.tk.theme({
                "&": {
                    backgroundColor: "#fff"
                }
            }, {
                dark: !1
            });
            function useCodeMirror(props) {
                var { value , selection , onChange , onUpdate , extensions =[] , autoFocus , theme ="light" , height ="" , minHeight ="" , maxHeight ="" , placeholder: placeholderStr = "" , width ="" , minWidth ="" , maxWidth ="" , editable =!0 , readOnly =!1 , indentWithTab: defaultIndentWithTab = !0 , basicSetup: defaultBasicSetup = !0 , root ,  } = props, [container, setContainer] = (0, react.useState)(props.container), [view, setView] = (0, react.useState)(), [state, setState] = (0, react.useState)(), defaultThemeOption = dist.tk.theme({
                    "&": {
                        height,
                        minHeight,
                        maxHeight,
                        width,
                        minWidth,
                        maxWidth
                    }
                }), updateListener = dist.tk.updateListener.of((vu)=>{
                    vu.docChanged && "function" == typeof onChange && onChange(vu.state.doc.toString(), vu);
                }), getExtensions = [
                    updateListener,
                    defaultThemeOption
                ];
                switch(defaultIndentWithTab && getExtensions.unshift(dist.$f.of([
                    indentWithTab1
                ])), defaultBasicSetup && getExtensions.unshift(basicSetup1), placeholderStr && getExtensions.unshift((0, dist.W$)(placeholderStr)), theme){
                    case "light":
                        getExtensions.push(defaultLightThemeOption);
                        break;
                    case "dark":
                        getExtensions.push(oneDark);
                        break;
                    default:
                        getExtensions.push(theme);
                }
                return !1 === editable && getExtensions.push(dist.tk.editable.of(!1)), readOnly && getExtensions.push(state_dist.yy.readOnly.of(!0)), onUpdate && "function" == typeof onUpdate && getExtensions.push(dist.tk.updateListener.of(onUpdate)), getExtensions = getExtensions.concat(extensions), (0, react.useEffect)(()=>{
                    if (container && !state) {
                        var stateCurrent = state_dist.yy.create({
                            doc: value,
                            selection,
                            extensions: getExtensions
                        });
                        if (setState(stateCurrent), !view) {
                            var viewCurrent = new dist.tk({
                                state: stateCurrent,
                                parent: container,
                                root
                            });
                            setView(viewCurrent);
                        }
                    }
                    return ()=>{
                        view && setView(void 0);
                    };
                }, [
                    container,
                    state
                ]), (0, react.useEffect)(()=>()=>{
                        view && (view.destroy(), setView(void 0));
                    }
                , [
                    view
                ]), (0, react.useEffect)(()=>{
                    autoFocus && view && view.focus();
                }, [
                    autoFocus,
                    view
                ]), (0, react.useEffect)(()=>{
                    var currentValue = view ? view.state.doc.toString() : "";
                    view && value !== currentValue && view.dispatch({
                        changes: {
                            from: 0,
                            to: currentValue.length,
                            insert: value || ""
                        }
                    });
                }, [
                    value,
                    view
                ]), (0, react.useEffect)(()=>{
                    view && view.dispatch({
                        effects: state_dist.Py.reconfigure.of(getExtensions)
                    });
                }, [
                    theme,
                    extensions,
                    height,
                    minHeight,
                    maxHeight,
                    width,
                    placeholderStr,
                    minWidth,
                    maxWidth,
                    editable,
                    defaultIndentWithTab,
                    defaultBasicSetup, 
                ]), {
                    state,
                    setState,
                    view,
                    setView,
                    container,
                    setContainer
                };
            }
            var jsx_runtime = __webpack_require__(5893), _excluded = [
                "className",
                "value",
                "selection",
                "extensions",
                "onChange",
                "onUpdate",
                "autoFocus",
                "theme",
                "height",
                "minHeight",
                "maxHeight",
                "width",
                "minWidth",
                "maxWidth",
                "basicSetup",
                "placeholder",
                "indentWithTab",
                "editable",
                "readOnly",
                "root", 
            ], ReactCodeMirror = react.forwardRef((props, ref)=>{
                var { className , value ="" , selection , extensions =[] , onChange , onUpdate , autoFocus , theme ="light" , height , minHeight , maxHeight , width , minWidth , maxWidth , basicSetup , placeholder , indentWithTab , editable , readOnly , root ,  } = props, other = _objectWithoutPropertiesLoose(props, _excluded), editor = (0, react.useRef)(null), { state , view , container , setContainer  } = useCodeMirror({
                    container: editor.current,
                    root,
                    value,
                    autoFocus,
                    theme,
                    height,
                    minHeight,
                    maxHeight,
                    width,
                    minWidth,
                    maxWidth,
                    basicSetup,
                    placeholder,
                    indentWithTab,
                    editable,
                    readOnly,
                    selection,
                    onChange,
                    onUpdate,
                    extensions
                });
                if ((0, react.useImperativeHandle)(ref, ()=>({
                        editor: container,
                        state,
                        view
                    })
                , [
                    container,
                    state,
                    view
                ]), (0, react.useEffect)(()=>{
                    setContainer(editor.current);
                }, []), "string" != typeof value) throw new Error("value must be typeof string but got " + typeof value);
                return (0, jsx_runtime.jsx)("div", _extends({
                    ref: editor,
                    className: ("string" == typeof theme ? "cm-theme-" + theme : "cm-theme") + (className ? " " + className : "")
                }, other));
            });
            ReactCodeMirror.displayName = "CodeMirror";
            var esm = ReactCodeMirror;
        },
        8120: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                BO: function() {
                    return combineConfig;
                },
                D0: function() {
                    return CharCategory1;
                },
                Gz: function() {
                    return findColumn;
                },
                IS: function() {
                    return countColumn;
                },
                Py: function() {
                    return StateEffect;
                },
                QQ: function() {
                    return StateField;
                },
                Wl: function() {
                    return Prec;
                },
                Xs: function() {
                    return RangeSet;
                },
                YW: function() {
                    return Transaction;
                },
                as: function() {
                    return ChangeSet;
                },
                bg: function() {
                    return fromCodePoint;
                },
                cp: function() {
                    return findClusterBreak;
                },
                f_: function() {
                    return RangeSetBuilder;
                },
                gc: function() {
                    return MapMode1;
                },
                gm: function() {
                    return codePointAt;
                },
                jT: function() {
                    return EditorSelection;
                },
                n0: function() {
                    return ChangeDesc;
                },
                nZ: function() {
                    return codePointSize;
                },
                q6: function() {
                    return Annotation;
                },
                r$: function() {
                    return Facet;
                },
                uU: function() {
                    return RangeValue;
                },
                xv: function() {
                    return Text;
                },
                yy: function() {
                    return EditorState;
                }
            });
            class Text {
                constructor(){}
                lineAt(pos) {
                    if (pos < 0 || pos > this.length) throw new RangeError(`Invalid position ${pos} in document of length ${this.length}`);
                    return this.lineInner(pos, !1, 1, 0);
                }
                line(n) {
                    if (n < 1 || n > this.lines) throw new RangeError(`Invalid line number ${n} in ${this.lines}-line document`);
                    return this.lineInner(n, !0, 1, 0);
                }
                replace(from, to, text) {
                    let parts = [];
                    return this.decompose(0, from, parts, 2), text.length && text.decompose(0, text.length, parts, 3), this.decompose(to, this.length, parts, 1), TextNode.from(parts, this.length - (to - from) + text.length);
                }
                append(other) {
                    return this.replace(this.length, this.length, other);
                }
                slice(from, to = this.length) {
                    let parts = [];
                    return this.decompose(from, to, parts, 0), TextNode.from(parts, to - from);
                }
                eq(other) {
                    if (other == this) return !0;
                    if (other.length != this.length || other.lines != this.lines) return !1;
                    let start = this.scanIdentical(other, 1), end = this.length - this.scanIdentical(other, -1), a = new RawTextCursor(this), b = new RawTextCursor(other);
                    for(let skip = start, pos = start;;){
                        if (a.next(skip), b.next(skip), skip = 0, a.lineBreak != b.lineBreak || a.done != b.done || a.value != b.value) return !1;
                        if (pos += a.value.length, a.done || pos >= end) return !0;
                    }
                }
                iter(dir = 1) {
                    return new RawTextCursor(this, dir);
                }
                iterRange(from, to = this.length) {
                    return new PartialTextCursor(this, from, to);
                }
                iterLines(from, to) {
                    let inner;
                    if (null == from) inner = this.iter();
                    else {
                        null == to && (to = this.lines + 1);
                        let start = this.line(from).from;
                        inner = this.iterRange(start, Math.max(start, to == this.lines + 1 ? this.length : to <= 1 ? 0 : this.line(to - 1).to));
                    }
                    return new LineCursor(inner);
                }
                toString() {
                    return this.sliceString(0);
                }
                toJSON() {
                    let lines = [];
                    return this.flatten(lines), lines;
                }
                static of(text) {
                    if (0 == text.length) throw new RangeError("A document must have at least one line");
                    return 1 != text.length || text[0] ? text.length <= 32 ? new TextLeaf(text) : TextNode.from(TextLeaf.split(text, [])) : Text.empty;
                }
            }
            class TextLeaf extends Text {
                constructor(text, length = textLength(text)){
                    super(), this.text = text, this.length = length;
                }
                get lines() {
                    return this.text.length;
                }
                get children() {
                    return null;
                }
                lineInner(target, isLine, line, offset) {
                    for(let i = 0;; i++){
                        let string = this.text[i], end = offset + string.length;
                        if ((isLine ? line : end) >= target) return new Line(offset, end, line, string);
                        offset = end + 1, line++;
                    }
                }
                decompose(from, to, target, open) {
                    let text = from <= 0 && to >= this.length ? this : new TextLeaf(sliceText(this.text, from, to), Math.min(to, this.length) - Math.max(0, from));
                    if (1 & open) {
                        let prev = target.pop(), joined = appendText(text.text, prev.text.slice(), 0, text.length);
                        if (joined.length <= 32) target.push(new TextLeaf(joined, prev.length + text.length));
                        else {
                            let mid = joined.length >> 1;
                            target.push(new TextLeaf(joined.slice(0, mid)), new TextLeaf(joined.slice(mid)));
                        }
                    } else target.push(text);
                }
                replace(from, to, text) {
                    if (!(text instanceof TextLeaf)) return super.replace(from, to, text);
                    let lines = appendText(this.text, appendText(text.text, sliceText(this.text, 0, from)), to), newLen = this.length + text.length - (to - from);
                    return lines.length <= 32 ? new TextLeaf(lines, newLen) : TextNode.from(TextLeaf.split(lines, []), newLen);
                }
                sliceString(from, to = this.length, lineSep = "\n") {
                    let result = "";
                    for(let pos = 0, i = 0; pos <= to && i < this.text.length; i++){
                        let line = this.text[i], end = pos + line.length;
                        pos > from && i && (result += lineSep), from < end && to > pos && (result += line.slice(Math.max(0, from - pos), to - pos)), pos = end + 1;
                    }
                    return result;
                }
                flatten(target) {
                    for (let line of this.text)target.push(line);
                }
                scanIdentical() {
                    return 0;
                }
                static split(text, target) {
                    let part = [], len = -1;
                    for (let line of text)part.push(line), len += line.length + 1, 32 == part.length && (target.push(new TextLeaf(part, len)), part = [], len = -1);
                    return len > -1 && target.push(new TextLeaf(part, len)), target;
                }
            }
            class TextNode extends Text {
                constructor(children, length){
                    for (let child of (super(), this.children = children, this.length = length, this.lines = 0, children))this.lines += child.lines;
                }
                lineInner(target, isLine, line, offset) {
                    for(let i = 0;; i++){
                        let child = this.children[i], end = offset + child.length, endLine = line + child.lines - 1;
                        if ((isLine ? endLine : end) >= target) return child.lineInner(target, isLine, line, offset);
                        offset = end + 1, line = endLine + 1;
                    }
                }
                decompose(from, to, target, open) {
                    for(let i = 0, pos = 0; pos <= to && i < this.children.length; i++){
                        let child = this.children[i], end = pos + child.length;
                        if (from <= end && to >= pos) {
                            let childOpen = open & ((pos <= from ? 1 : 0) | (end >= to ? 2 : 0));
                            pos >= from && end <= to && !childOpen ? target.push(child) : child.decompose(from - pos, to - pos, target, childOpen);
                        }
                        pos = end + 1;
                    }
                }
                replace(from, to, text) {
                    if (text.lines < this.lines) for(let i = 0, pos = 0; i < this.children.length; i++){
                        let child = this.children[i], end = pos + child.length;
                        if (from >= pos && to <= end) {
                            let updated = child.replace(from - pos, to - pos, text), totalLines = this.lines - child.lines + updated.lines;
                            if (updated.lines < totalLines >> 4 && updated.lines > totalLines >> 6) {
                                let copy = this.children.slice();
                                return copy[i] = updated, new TextNode(copy, this.length - (to - from) + text.length);
                            }
                            return super.replace(pos, end, updated);
                        }
                        pos = end + 1;
                    }
                    return super.replace(from, to, text);
                }
                sliceString(from, to = this.length, lineSep = "\n") {
                    let result = "";
                    for(let i = 0, pos = 0; i < this.children.length && pos <= to; i++){
                        let child = this.children[i], end = pos + child.length;
                        pos > from && i && (result += lineSep), from < end && to > pos && (result += child.sliceString(from - pos, to - pos, lineSep)), pos = end + 1;
                    }
                    return result;
                }
                flatten(target) {
                    for (let child of this.children)child.flatten(target);
                }
                scanIdentical(other, dir) {
                    if (!(other instanceof TextNode)) return 0;
                    let length = 0, [iA, iB, eA, eB] = dir > 0 ? [
                        0,
                        0,
                        this.children.length,
                        other.children.length, 
                    ] : [
                        this.children.length - 1,
                        other.children.length - 1,
                        -1,
                        -1, 
                    ];
                    for(;; iA += dir, iB += dir){
                        if (iA == eA || iB == eB) return length;
                        let chA = this.children[iA], chB = other.children[iB];
                        if (chA != chB) return length + chA.scanIdentical(chB, dir);
                        length += chA.length + 1;
                    }
                }
                static from(children, length = children.reduce((l, ch)=>l + ch.length + 1
                , -1)) {
                    let lines = 0;
                    for (let ch of children)lines += ch.lines;
                    if (lines < 32) {
                        let flat = [];
                        for (let ch of children)ch.flatten(flat);
                        return new TextLeaf(flat, length);
                    }
                    let chunk = Math.max(32, lines >> 5), maxChunk = chunk << 1, minChunk = chunk >> 1, chunked = [], currentLines = 0, currentLen = -1, currentChunk = [];
                    function add(child) {
                        let last;
                        if (child.lines > maxChunk && child instanceof TextNode) for (let node of child.children)add(node);
                        else child.lines > minChunk && (currentLines > minChunk || !currentLines) ? (flush(), chunked.push(child)) : child instanceof TextLeaf && currentLines && (last = currentChunk[currentChunk.length - 1]) instanceof TextLeaf && child.lines + last.lines <= 32 ? (currentLines += child.lines, currentLen += child.length + 1, currentChunk[currentChunk.length - 1] = new TextLeaf(last.text.concat(child.text), last.length + 1 + child.length)) : (currentLines + child.lines > chunk && flush(), currentLines += child.lines, currentLen += child.length + 1, currentChunk.push(child));
                    }
                    function flush() {
                        0 != currentLines && (chunked.push(1 == currentChunk.length ? currentChunk[0] : TextNode.from(currentChunk, currentLen)), currentLen = -1, currentLines = currentChunk.length = 0);
                    }
                    for (let child1 of children)add(child1);
                    return flush(), 1 == chunked.length ? chunked[0] : new TextNode(chunked, length);
                }
            }
            function textLength(text) {
                let length = -1;
                for (let line of text)length += line.length + 1;
                return length;
            }
            function appendText(text, target, from = 0, to = 1e9) {
                for(let pos = 0, i = 0, first = !0; i < text.length && pos <= to; i++){
                    let line = text[i], end = pos + line.length;
                    end >= from && (end > to && (line = line.slice(0, to - pos)), pos < from && (line = line.slice(from - pos)), first ? (target[target.length - 1] += line, first = !1) : target.push(line)), pos = end + 1;
                }
                return target;
            }
            function sliceText(text, from, to) {
                return appendText(text, [
                    ""
                ], from, to);
            }
            Text.empty = new TextLeaf([
                ""
            ], 0);
            class RawTextCursor {
                constructor(text, dir = 1){
                    this.dir = dir, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [
                        text
                    ], this.offsets = [
                        dir > 0 ? 1 : (text instanceof TextLeaf ? text.text.length : text.children.length) << 1, 
                    ];
                }
                nextInner(skip, dir) {
                    for(this.done = this.lineBreak = !1;;){
                        let last = this.nodes.length - 1, top = this.nodes[last], offsetValue = this.offsets[last], offset = offsetValue >> 1, size = top instanceof TextLeaf ? top.text.length : top.children.length;
                        if (offset == (dir > 0 ? size : 0)) {
                            if (0 == last) return this.done = !0, this.value = "", this;
                            dir > 0 && this.offsets[last - 1]++, this.nodes.pop(), this.offsets.pop();
                        } else if ((1 & offsetValue) == (dir > 0 ? 0 : 1)) {
                            if (this.offsets[last] += dir, 0 == skip) return this.lineBreak = !0, this.value = "\n", this;
                            skip--;
                        } else if (top instanceof TextLeaf) {
                            let next = top.text[offset + (dir < 0 ? -1 : 0)];
                            if (this.offsets[last] += dir, next.length > Math.max(0, skip)) return this.value = 0 == skip ? next : dir > 0 ? next.slice(skip) : next.slice(0, next.length - skip), this;
                            skip -= next.length;
                        } else {
                            let next = top.children[offset + (dir < 0 ? -1 : 0)];
                            skip > next.length ? (skip -= next.length, this.offsets[last] += dir) : (dir < 0 && this.offsets[last]--, this.nodes.push(next), this.offsets.push(dir > 0 ? 1 : (next instanceof TextLeaf ? next.text.length : next.children.length) << 1));
                        }
                    }
                }
                next(skip = 0) {
                    return skip < 0 && (this.nextInner(-skip, -this.dir), skip = this.value.length), this.nextInner(skip, this.dir);
                }
            }
            class PartialTextCursor {
                constructor(text, start, end){
                    this.value = "", this.done = !1, this.cursor = new RawTextCursor(text, start > end ? -1 : 1), this.pos = start > end ? text.length : 0, this.from = Math.min(start, end), this.to = Math.max(start, end);
                }
                nextInner(skip, dir) {
                    if (dir < 0 ? this.pos <= this.from : this.pos >= this.to) return this.value = "", this.done = !0, this;
                    skip += Math.max(0, dir < 0 ? this.pos - this.to : this.from - this.pos);
                    let limit = dir < 0 ? this.pos - this.from : this.to - this.pos;
                    skip > limit && (skip = limit), limit -= skip;
                    let { value  } = this.cursor.next(skip);
                    return this.pos += (value.length + skip) * dir, this.value = value.length <= limit ? value : dir < 0 ? value.slice(value.length - limit) : value.slice(0, limit), this.done = !this.value, this;
                }
                next(skip = 0) {
                    return skip < 0 ? skip = Math.max(skip, this.from - this.pos) : skip > 0 && (skip = Math.min(skip, this.to - this.pos)), this.nextInner(skip, this.cursor.dir);
                }
                get lineBreak() {
                    return this.cursor.lineBreak && "" != this.value;
                }
            }
            class LineCursor {
                constructor(inner){
                    this.inner = inner, this.afterBreak = !0, this.value = "", this.done = !1;
                }
                next(skip = 0) {
                    let { done , lineBreak , value  } = this.inner.next(skip);
                    return done ? (this.done = !0, this.value = "") : lineBreak ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = value, this.afterBreak = !1), this;
                }
                get lineBreak() {
                    return !1;
                }
            }
            "undefined" != typeof Symbol && (Text.prototype[Symbol.iterator] = function() {
                return this.iter();
            }, RawTextCursor.prototype[Symbol.iterator] = PartialTextCursor.prototype[Symbol.iterator] = LineCursor.prototype[Symbol.iterator] = function() {
                return this;
            });
            class Line {
                constructor(from, to, number, text){
                    this.from = from, this.to = to, this.number = number, this.text = text;
                }
                get length() {
                    return this.to - this.from;
                }
            }
            let extend = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((s)=>s ? parseInt(s, 36) : 1
            );
            for(let i3 = 1; i3 < extend.length; i3++)extend[i3] += extend[i3 - 1];
            function isExtendingChar(code) {
                for(let i = 1; i < extend.length; i += 2)if (extend[i] > code) return extend[i - 1] <= code;
                return !1;
            }
            function isRegionalIndicator(code) {
                return code >= 0x1f1e6 && code <= 0x1f1ff;
            }
            const ZWJ = 0x200d;
            function findClusterBreak(str, pos, forward = !0, includeExtending = !0) {
                return (forward ? nextClusterBreak : prevClusterBreak)(str, pos, includeExtending);
            }
            function nextClusterBreak(str, pos, includeExtending) {
                if (pos == str.length) return pos;
                pos && surrogateLow(str.charCodeAt(pos)) && surrogateHigh(str.charCodeAt(pos - 1)) && pos--;
                let prev = codePointAt(str, pos);
                for(pos += codePointSize(prev); pos < str.length;){
                    let next = codePointAt(str, pos);
                    if (prev == ZWJ || next == ZWJ || includeExtending && isExtendingChar(next)) pos += codePointSize(next), prev = next;
                    else if (isRegionalIndicator(next)) {
                        let countBefore = 0, i = pos - 2;
                        for(; i >= 0 && isRegionalIndicator(codePointAt(str, i));)countBefore++, i -= 2;
                        if (countBefore % 2 == 0) break;
                        pos += 2;
                    } else break;
                }
                return pos;
            }
            function prevClusterBreak(str, pos, includeExtending) {
                for(; pos > 0;){
                    let found = nextClusterBreak(str, pos - 2, includeExtending);
                    if (found < pos) return found;
                    pos--;
                }
                return 0;
            }
            function surrogateLow(ch) {
                return ch >= 0xdc00 && ch < 0xe000;
            }
            function surrogateHigh(ch) {
                return ch >= 0xd800 && ch < 0xdc00;
            }
            function codePointAt(str, pos) {
                let code0 = str.charCodeAt(pos);
                if (!surrogateHigh(code0) || pos + 1 == str.length) return code0;
                let code1 = str.charCodeAt(pos + 1);
                return surrogateLow(code1) ? (code0 - 0xd800 << 10) + (code1 - 0xdc00) + 0x10000 : code0;
            }
            function fromCodePoint(code) {
                return code <= 0xffff ? String.fromCharCode(code) : (code -= 0x10000, String.fromCharCode((code >> 10) + 0xd800, (1023 & code) + 0xdc00));
            }
            function codePointSize(code) {
                return code < 0x10000 ? 1 : 2;
            }
            const DefaultSplit = /\r\n?|\n/;
            var MapMode1 = function(MapMode) {
                return MapMode[MapMode.Simple = 0] = "Simple", MapMode[MapMode.TrackDel = 1] = "TrackDel", MapMode[MapMode.TrackBefore = 2] = "TrackBefore", MapMode[MapMode.TrackAfter = 3] = "TrackAfter", MapMode;
            }(MapMode1 || (MapMode1 = {}));
            class ChangeDesc {
                constructor(sections){
                    this.sections = sections;
                }
                get length() {
                    let result = 0;
                    for(let i = 0; i < this.sections.length; i += 2)result += this.sections[i];
                    return result;
                }
                get newLength() {
                    let result = 0;
                    for(let i = 0; i < this.sections.length; i += 2){
                        let ins = this.sections[i + 1];
                        result += ins < 0 ? this.sections[i] : ins;
                    }
                    return result;
                }
                get empty() {
                    return 0 == this.sections.length || 2 == this.sections.length && this.sections[1] < 0;
                }
                iterGaps(f) {
                    for(let i = 0, posA = 0, posB = 0; i < this.sections.length;){
                        let len = this.sections[i++], ins = this.sections[i++];
                        ins < 0 ? (f(posA, posB, len), posB += len) : posB += ins, posA += len;
                    }
                }
                iterChangedRanges(f, individual = !1) {
                    iterChanges(this, f, individual);
                }
                get invertedDesc() {
                    let sections = [];
                    for(let i = 0; i < this.sections.length;){
                        let len = this.sections[i++], ins = this.sections[i++];
                        ins < 0 ? sections.push(len, ins) : sections.push(ins, len);
                    }
                    return new ChangeDesc(sections);
                }
                composeDesc(other) {
                    return this.empty ? other : other.empty ? this : composeSets(this, other);
                }
                mapDesc(other, before = !1) {
                    return other.empty ? this : mapSet(this, other, before);
                }
                mapPos(pos, assoc = -1, mode = MapMode1.Simple) {
                    let posA = 0, posB = 0;
                    for(let i = 0; i < this.sections.length;){
                        let len = this.sections[i++], ins = this.sections[i++], endA = posA + len;
                        if (ins < 0) {
                            if (endA > pos) return posB + (pos - posA);
                            posB += len;
                        } else {
                            if (mode != MapMode1.Simple && endA >= pos && (mode == MapMode1.TrackDel && posA < pos && endA > pos || mode == MapMode1.TrackBefore && posA < pos || mode == MapMode1.TrackAfter && endA > pos)) return null;
                            if (endA > pos || endA == pos && assoc < 0 && !len) return pos == posA || assoc < 0 ? posB : posB + ins;
                            posB += ins;
                        }
                        posA = endA;
                    }
                    if (pos > posA) throw new RangeError(`Position ${pos} is out of range for changeset of length ${posA}`);
                    return posB;
                }
                touchesRange(from, to = from) {
                    for(let i = 0, pos = 0; i < this.sections.length && pos <= to;){
                        let len = this.sections[i++], ins = this.sections[i++], end = pos + len;
                        if (ins >= 0 && pos <= to && end >= from) return !(pos < from) || !(end > to) || "cover";
                        pos = end;
                    }
                    return !1;
                }
                toString() {
                    let result = "";
                    for(let i = 0; i < this.sections.length;){
                        let len = this.sections[i++], ins = this.sections[i++];
                        result += (result ? " " : "") + len + (ins >= 0 ? ":" + ins : "");
                    }
                    return result;
                }
                toJSON() {
                    return this.sections;
                }
                static fromJSON(json) {
                    if (!Array.isArray(json) || json.length % 2 || json.some((a)=>"number" != typeof a
                    )) throw new RangeError("Invalid JSON representation of ChangeDesc");
                    return new ChangeDesc(json);
                }
            }
            class ChangeSet extends ChangeDesc {
                constructor(sections, inserted){
                    super(sections), this.inserted = inserted;
                }
                apply(doc) {
                    if (this.length != doc.length) throw new RangeError("Applying change set to a document with the wrong length");
                    return iterChanges(this, (fromA, toA, fromB, _toB, text)=>doc = doc.replace(fromB, fromB + (toA - fromA), text)
                    , !1), doc;
                }
                mapDesc(other, before = !1) {
                    return mapSet(this, other, before, !0);
                }
                invert(doc) {
                    let sections = this.sections.slice(), inserted = [];
                    for(let i = 0, pos = 0; i < sections.length; i += 2){
                        let len = sections[i], ins = sections[i + 1];
                        if (ins >= 0) {
                            sections[i] = ins, sections[i + 1] = len;
                            let index = i >> 1;
                            for(; inserted.length < index;)inserted.push(Text.empty);
                            inserted.push(len ? doc.slice(pos, pos + len) : Text.empty);
                        }
                        pos += len;
                    }
                    return new ChangeSet(sections, inserted);
                }
                compose(other) {
                    return this.empty ? other : other.empty ? this : composeSets(this, other, !0);
                }
                map(other, before = !1) {
                    return other.empty ? this : mapSet(this, other, before, !0);
                }
                iterChanges(f, individual = !1) {
                    iterChanges(this, f, individual);
                }
                get desc() {
                    return new ChangeDesc(this.sections);
                }
                filter(ranges) {
                    let resultSections = [], resultInserted = [], filteredSections = [], iter = new SectionIter(this);
                    done: for(let i = 0, pos = 0;;){
                        let next = i == ranges.length ? 1e9 : ranges[i++];
                        for(; pos < next || pos == next && 0 == iter.len;){
                            if (iter.done) break done;
                            let len = Math.min(iter.len, next - pos);
                            addSection(filteredSections, len, -1);
                            let ins = -1 == iter.ins ? -1 : 0 == iter.off ? iter.ins : 0;
                            addSection(resultSections, len, ins), ins > 0 && addInsert(resultInserted, resultSections, iter.text), iter.forward(len), pos += len;
                        }
                        let end = ranges[i++];
                        for(; pos < end;){
                            if (iter.done) break done;
                            let len = Math.min(iter.len, end - pos);
                            addSection(resultSections, len, -1), addSection(filteredSections, len, -1 == iter.ins ? -1 : 0 == iter.off ? iter.ins : 0), iter.forward(len), pos += len;
                        }
                    }
                    return {
                        changes: new ChangeSet(resultSections, resultInserted),
                        filtered: new ChangeDesc(filteredSections)
                    };
                }
                toJSON() {
                    let parts = [];
                    for(let i = 0; i < this.sections.length; i += 2){
                        let len = this.sections[i], ins = this.sections[i + 1];
                        ins < 0 ? parts.push(len) : 0 == ins ? parts.push([
                            len
                        ]) : parts.push([
                            len
                        ].concat(this.inserted[i >> 1].toJSON()));
                    }
                    return parts;
                }
                static of(changes, length, lineSep) {
                    let sections = [], inserted = [], pos = 0, total = null;
                    function flush(force = !1) {
                        if (!force && !sections.length) return;
                        pos < length && addSection(sections, length - pos, -1);
                        let set = new ChangeSet(sections, inserted);
                        total = total ? total.compose(set.map(total)) : set, sections = [], inserted = [], pos = 0;
                    }
                    function process(spec) {
                        if (Array.isArray(spec)) for (let sub of spec)process(sub);
                        else if (spec instanceof ChangeSet) {
                            if (spec.length != length) throw new RangeError(`Mismatched change set length (got ${spec.length}, expected ${length})`);
                            flush(), total = total ? total.compose(spec.map(total)) : spec;
                        } else {
                            let { from , to =from , insert  } = spec;
                            if (from > to || from < 0 || to > length) throw new RangeError(`Invalid change range ${from} to ${to} (in doc of length ${length})`);
                            let insText = insert ? "string" == typeof insert ? Text.of(insert.split(lineSep || DefaultSplit)) : insert : Text.empty, insLen = insText.length;
                            if (from == to && 0 == insLen) return;
                            from < pos && flush(), from > pos && addSection(sections, from - pos, -1), addSection(sections, to - from, insLen), addInsert(inserted, sections, insText), pos = to;
                        }
                    }
                    return process(changes), flush(!total), total;
                }
                static empty(length) {
                    return new ChangeSet(length ? [
                        length,
                        -1
                    ] : [], []);
                }
                static fromJSON(json) {
                    if (!Array.isArray(json)) throw new RangeError("Invalid JSON representation of ChangeSet");
                    let sections = [], inserted = [];
                    for(let i4 = 0; i4 < json.length; i4++){
                        let part = json[i4];
                        if ("number" == typeof part) sections.push(part, -1);
                        else if (!Array.isArray(part) || "number" != typeof part[0] || part.some((e, i)=>i && "string" != typeof e
                        )) throw new RangeError("Invalid JSON representation of ChangeSet");
                        else if (1 == part.length) sections.push(part[0], 0);
                        else {
                            for(; inserted.length < i4;)inserted.push(Text.empty);
                            inserted[i4] = Text.of(part.slice(1)), sections.push(part[0], inserted[i4].length);
                        }
                    }
                    return new ChangeSet(sections, inserted);
                }
            }
            function addSection(sections, len, ins, forceJoin = !1) {
                if (0 == len && ins <= 0) return;
                let last = sections.length - 2;
                last >= 0 && ins <= 0 && ins == sections[last + 1] ? sections[last] += len : 0 == len && 0 == sections[last] ? sections[last + 1] += ins : forceJoin ? (sections[last] += len, sections[last + 1] += ins) : sections.push(len, ins);
            }
            function addInsert(values, sections, value) {
                if (0 == value.length) return;
                let index = sections.length - 2 >> 1;
                if (index < values.length) values[values.length - 1] = values[values.length - 1].append(value);
                else {
                    for(; values.length < index;)values.push(Text.empty);
                    values.push(value);
                }
            }
            function iterChanges(desc, f, individual) {
                let inserted = desc.inserted;
                for(let posA = 0, posB = 0, i = 0; i < desc.sections.length;){
                    let len = desc.sections[i++], ins = desc.sections[i++];
                    if (ins < 0) posA += len, posB += len;
                    else {
                        let endA = posA, endB = posB, text = Text.empty;
                        for(; endA += len, endB += ins, ins && inserted && (text = text.append(inserted[i - 2 >> 1])), !individual && i != desc.sections.length && !(desc.sections[i + 1] < 0);)len = desc.sections[i++], ins = desc.sections[i++];
                        f(posA, endA, posB, endB, text), posA = endA, posB = endB;
                    }
                }
            }
            function mapSet(setA, setB, before, mkSet = !1) {
                let sections = [], insert = mkSet ? [] : null, a = new SectionIter(setA), b = new SectionIter(setB);
                for(let posA = 0, posB = 0;;)if (-1 == a.ins) posA += a.len, a.next();
                else if (-1 == b.ins && posB < posA) {
                    let skip = Math.min(b.len, posA - posB);
                    b.forward(skip), addSection(sections, skip, -1), posB += skip;
                } else if (b.ins >= 0 && (a.done || posB < posA || posB == posA && (b.len < a.len || b.len == a.len && !before))) {
                    for(addSection(sections, b.ins, -1); posA > posB && !a.done && posA + a.len < posB + b.len;)posA += a.len, a.next();
                    posB += b.len, b.next();
                } else if (a.ins >= 0) {
                    let len = 0, end = posA + a.len;
                    for(;;)if (b.ins >= 0 && posB > posA && posB + b.len < end) len += b.ins, posB += b.len, b.next();
                    else if (-1 == b.ins && posB < end) {
                        let skip = Math.min(b.len, end - posB);
                        len += skip, b.forward(skip), posB += skip;
                    } else break;
                    addSection(sections, len, a.ins), insert && addInsert(insert, sections, a.text), posA = end, a.next();
                } else if (a.done && b.done) return insert ? new ChangeSet(sections, insert) : new ChangeDesc(sections);
                else throw new Error("Mismatched change set lengths");
            }
            function composeSets(setA, setB, mkSet = !1) {
                let sections = [], insert = mkSet ? [] : null, a = new SectionIter(setA), b = new SectionIter(setB);
                for(let open = !1;;){
                    if (a.done && b.done) return insert ? new ChangeSet(sections, insert) : new ChangeDesc(sections);
                    if (0 == a.ins) addSection(sections, a.len, 0, open), a.next();
                    else if (0 != b.len || b.done) {
                        if (a.done || b.done) throw new Error("Mismatched change set lengths");
                        {
                            let len = Math.min(a.len2, b.len), sectionLen = sections.length;
                            if (-1 == a.ins) {
                                let insB = -1 == b.ins ? -1 : b.off ? 0 : b.ins;
                                addSection(sections, len, insB, open), insert && insB && addInsert(insert, sections, b.text);
                            } else -1 == b.ins ? (addSection(sections, a.off ? 0 : a.len, len, open), insert && addInsert(insert, sections, a.textBit(len))) : (addSection(sections, a.off ? 0 : a.len, b.off ? 0 : b.ins, open), insert && !b.off && addInsert(insert, sections, b.text));
                            open = (a.ins > len || b.ins >= 0 && b.len > len) && (open || sections.length > sectionLen), a.forward2(len), b.forward(len);
                        }
                    } else addSection(sections, 0, b.ins, open), insert && addInsert(insert, sections, b.text), b.next();
                }
            }
            class SectionIter {
                constructor(set){
                    this.set = set, this.i = 0, this.next();
                }
                next() {
                    let { sections  } = this.set;
                    this.i < sections.length ? (this.len = sections[this.i++], this.ins = sections[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
                }
                get done() {
                    return -2 == this.ins;
                }
                get len2() {
                    return this.ins < 0 ? this.len : this.ins;
                }
                get text() {
                    let { inserted  } = this.set, index = this.i - 2 >> 1;
                    return index >= inserted.length ? Text.empty : inserted[index];
                }
                textBit(len) {
                    let { inserted  } = this.set, index = this.i - 2 >> 1;
                    return index >= inserted.length && !len ? Text.empty : inserted[index].slice(this.off, null == len ? void 0 : this.off + len);
                }
                forward(len) {
                    len == this.len ? this.next() : (this.len -= len, this.off += len);
                }
                forward2(len) {
                    -1 == this.ins ? this.forward(len) : len == this.ins ? this.next() : (this.ins -= len, this.off += len);
                }
            }
            class SelectionRange {
                constructor(from, to, flags){
                    this.from = from, this.to = to, this.flags = flags;
                }
                get anchor() {
                    return 16 & this.flags ? this.to : this.from;
                }
                get head() {
                    return 16 & this.flags ? this.from : this.to;
                }
                get empty() {
                    return this.from == this.to;
                }
                get assoc() {
                    return 4 & this.flags ? -1 : 8 & this.flags ? 1 : 0;
                }
                get bidiLevel() {
                    let level = 3 & this.flags;
                    return 3 == level ? null : level;
                }
                get goalColumn() {
                    let value = this.flags >> 5;
                    return 33554431 == value ? void 0 : value;
                }
                map(change, assoc = -1) {
                    let from, to;
                    return this.empty ? from = to = change.mapPos(this.from, assoc) : (from = change.mapPos(this.from, 1), to = change.mapPos(this.to, -1)), from == this.from && to == this.to ? this : new SelectionRange(from, to, this.flags);
                }
                extend(from, to = from) {
                    if (from <= this.anchor && to >= this.anchor) return EditorSelection.range(from, to);
                    let head = Math.abs(from - this.anchor) > Math.abs(to - this.anchor) ? from : to;
                    return EditorSelection.range(this.anchor, head);
                }
                eq(other) {
                    return this.anchor == other.anchor && this.head == other.head;
                }
                toJSON() {
                    return {
                        anchor: this.anchor,
                        head: this.head
                    };
                }
                static fromJSON(json) {
                    if (!json || "number" != typeof json.anchor || "number" != typeof json.head) throw new RangeError("Invalid JSON representation for SelectionRange");
                    return EditorSelection.range(json.anchor, json.head);
                }
            }
            class EditorSelection {
                constructor(ranges, mainIndex = 0){
                    this.ranges = ranges, this.mainIndex = mainIndex;
                }
                map(change, assoc = -1) {
                    return change.empty ? this : EditorSelection.create(this.ranges.map((r)=>r.map(change, assoc)
                    ), this.mainIndex);
                }
                eq(other) {
                    if (this.ranges.length != other.ranges.length || this.mainIndex != other.mainIndex) return !1;
                    for(let i = 0; i < this.ranges.length; i++)if (!this.ranges[i].eq(other.ranges[i])) return !1;
                    return !0;
                }
                get main() {
                    return this.ranges[this.mainIndex];
                }
                asSingle() {
                    return 1 == this.ranges.length ? this : new EditorSelection([
                        this.main
                    ]);
                }
                addRange(range, main = !0) {
                    return EditorSelection.create([
                        range
                    ].concat(this.ranges), main ? 0 : this.mainIndex + 1);
                }
                replaceRange(range, which = this.mainIndex) {
                    let ranges = this.ranges.slice();
                    return ranges[which] = range, EditorSelection.create(ranges, this.mainIndex);
                }
                toJSON() {
                    return {
                        ranges: this.ranges.map((r)=>r.toJSON()
                        ),
                        main: this.mainIndex
                    };
                }
                static fromJSON(json) {
                    if (!json || !Array.isArray(json.ranges) || "number" != typeof json.main || json.main >= json.ranges.length) throw new RangeError("Invalid JSON representation for EditorSelection");
                    return new EditorSelection(json.ranges.map((r)=>SelectionRange.fromJSON(r)
                    ), json.main);
                }
                static single(anchor, head = anchor) {
                    return new EditorSelection([
                        EditorSelection.range(anchor, head)
                    ], 0);
                }
                static create(ranges, mainIndex = 0) {
                    if (0 == ranges.length) throw new RangeError("A selection needs at least one range");
                    for(let pos = 0, i = 0; i < ranges.length; i++){
                        let range = ranges[i];
                        if (range.empty ? range.from <= pos : range.from < pos) return normalized(ranges.slice(), mainIndex);
                        pos = range.to;
                    }
                    return new EditorSelection(ranges, mainIndex);
                }
                static cursor(pos, assoc = 0, bidiLevel, goalColumn) {
                    return new SelectionRange(pos, pos, (0 == assoc ? 0 : assoc < 0 ? 4 : 8) | (null == bidiLevel ? 3 : Math.min(2, bidiLevel)) | (null != goalColumn ? goalColumn : 33554431) << 5);
                }
                static range(anchor, head, goalColumn) {
                    let goal = (null != goalColumn ? goalColumn : 33554431) << 5;
                    return head < anchor ? new SelectionRange(head, anchor, 16 | goal | 8) : new SelectionRange(anchor, head, goal | (head > anchor ? 4 : 0));
                }
            }
            function normalized(ranges, mainIndex = 0) {
                let main = ranges[mainIndex];
                ranges.sort((a, b)=>a.from - b.from
                ), mainIndex = ranges.indexOf(main);
                for(let i = 1; i < ranges.length; i++){
                    let range = ranges[i], prev = ranges[i - 1];
                    if (range.empty ? range.from <= prev.to : range.from < prev.to) {
                        let from = prev.from, to = Math.max(range.to, prev.to);
                        i <= mainIndex && mainIndex--, ranges.splice(--i, 2, range.anchor > range.head ? EditorSelection.range(to, from) : EditorSelection.range(from, to));
                    }
                }
                return new EditorSelection(ranges, mainIndex);
            }
            function checkSelection(selection, docLength) {
                for (let range of selection.ranges)if (range.to > docLength) throw new RangeError("Selection points outside of document");
            }
            let nextID = 0;
            class Facet {
                constructor(combine, compareInput, compare, isStatic, extensions){
                    this.combine = combine, this.compareInput = compareInput, this.compare = compare, this.isStatic = isStatic, this.extensions = extensions, this.id = nextID++, this.default = combine([]);
                }
                static define(config = {}) {
                    return new Facet(config.combine || ((a)=>a
                    ), config.compareInput || ((a, b)=>a === b
                    ), config.compare || (config.combine ? (a, b)=>a === b
                     : sameArray), !!config.static, config.enables);
                }
                of(value) {
                    return new FacetProvider([], this, 0, value);
                }
                compute(deps, get) {
                    if (this.isStatic) throw new Error("Can't compute a static facet");
                    return new FacetProvider(deps, this, 1, get);
                }
                computeN(deps, get) {
                    if (this.isStatic) throw new Error("Can't compute a static facet");
                    return new FacetProvider(deps, this, 2, get);
                }
                from(field, get) {
                    return get || (get = (x)=>x
                    ), this.compute([
                        field
                    ], (state)=>get(state.field(field))
                    );
                }
            }
            function sameArray(a, b) {
                return a == b || a.length == b.length && a.every((e, i)=>e === b[i]
                );
            }
            class FacetProvider {
                constructor(dependencies, facet, type, value){
                    this.dependencies = dependencies, this.facet = facet, this.type = type, this.value = value, this.id = nextID++;
                }
                dynamicSlot(addresses) {
                    var _a;
                    let getter = this.value, compare = this.facet.compareInput, id = this.id, idx = addresses[id] >> 1, multi = 2 == this.type, depDoc = !1, depSel = !1, depAddrs = [];
                    for (let dep1 of this.dependencies)"doc" == dep1 ? depDoc = !0 : "selection" == dep1 ? depSel = !0 : ((null !== (_a = addresses[dep1.id]) && void 0 !== _a ? _a : 1) & 1) == 0 && depAddrs.push(addresses[dep1.id]);
                    return {
                        create: (state)=>(state.values[idx] = getter(state), 1)
                        ,
                        update (state, tr) {
                            if (depDoc && tr.docChanged || depSel && (tr.docChanged || tr.selection) || ensureAll(state, depAddrs)) {
                                let newVal = getter(state);
                                if (multi ? !compareArray(newVal, state.values[idx], compare) : !compare(newVal, state.values[idx])) return state.values[idx] = newVal, 1;
                            }
                            return 0;
                        },
                        reconfigure: (state, oldState)=>{
                            let newVal = getter(state), oldAddr = oldState.config.address[id];
                            if (null != oldAddr) {
                                let oldVal = getAddr(oldState, oldAddr);
                                if (this.dependencies.every((dep)=>dep instanceof Facet ? oldState.facet(dep) === state.facet(dep) : !(dep instanceof StateField) || oldState.field(dep, !1) == state.field(dep, !1)
                                ) || (multi ? compareArray(newVal, oldVal, compare) : compare(newVal, oldVal))) return state.values[idx] = oldVal, 0;
                            }
                            return state.values[idx] = newVal, 1;
                        }
                    };
                }
            }
            function compareArray(a, b, compare) {
                if (a.length != b.length) return !1;
                for(let i = 0; i < a.length; i++)if (!compare(a[i], b[i])) return !1;
                return !0;
            }
            function ensureAll(state, addrs) {
                let changed = !1;
                for (let addr of addrs)1 & ensureAddr(state, addr) && (changed = !0);
                return changed;
            }
            function dynamicFacetSlot(addresses, facet, providers) {
                let providerAddrs = providers.map((p)=>addresses[p.id]
                ), providerTypes = providers.map((p)=>p.type
                ), dynamic = providerAddrs.filter((p)=>!(1 & p)
                ), idx = addresses[facet.id] >> 1;
                function get(state) {
                    let values = [];
                    for(let i = 0; i < providerAddrs.length; i++){
                        let value = getAddr(state, providerAddrs[i]);
                        if (2 == providerTypes[i]) for (let val of value)values.push(val);
                        else values.push(value);
                    }
                    return facet.combine(values);
                }
                return {
                    create (state) {
                        for (let addr of providerAddrs)ensureAddr(state, addr);
                        return state.values[idx] = get(state), 1;
                    },
                    update (state, tr) {
                        if (!ensureAll(state, dynamic)) return 0;
                        let value = get(state);
                        return facet.compare(value, state.values[idx]) ? 0 : (state.values[idx] = value, 1);
                    },
                    reconfigure (state, oldState) {
                        let depChanged = ensureAll(state, providerAddrs), oldProviders = oldState.config.facets[facet.id], oldValue = oldState.facet(facet);
                        if (oldProviders && !depChanged && sameArray(providers, oldProviders)) return state.values[idx] = oldValue, 0;
                        let value = get(state);
                        return facet.compare(value, oldValue) ? (state.values[idx] = oldValue, 0) : (state.values[idx] = value, 1);
                    }
                };
            }
            const initField = Facet.define({
                static: !0
            });
            class StateField {
                constructor(id, createF, updateF, compareF, spec){
                    this.id = id, this.createF = createF, this.updateF = updateF, this.compareF = compareF, this.spec = spec, this.provides = void 0;
                }
                static define(config) {
                    let field = new StateField(nextID++, config.create, config.update, config.compare || ((a, b)=>a === b
                    ), config);
                    return config.provide && (field.provides = config.provide(field)), field;
                }
                create(state) {
                    let init = state.facet(initField).find((i)=>i.field == this
                    );
                    return ((null == init ? void 0 : init.create) || this.createF)(state);
                }
                slot(addresses) {
                    let idx = addresses[this.id] >> 1;
                    return {
                        create: (state)=>(state.values[idx] = this.create(state), 1)
                        ,
                        update: (state, tr)=>{
                            let oldVal = state.values[idx], value = this.updateF(oldVal, tr);
                            return this.compareF(oldVal, value) ? 0 : (state.values[idx] = value, 1);
                        },
                        reconfigure: (state, oldState)=>null != oldState.config.address[this.id] ? (state.values[idx] = oldState.field(this), 0) : (state.values[idx] = this.create(state), 1)
                    };
                }
                init(create) {
                    return [
                        this,
                        initField.of({
                            field: this,
                            create
                        })
                    ];
                }
                get extension() {
                    return this;
                }
            }
            const Prec_ = {
                lowest: 4,
                low: 3,
                default: 2,
                high: 1,
                highest: 0
            };
            function prec1(value) {
                return (ext)=>new PrecExtension(ext, value)
                ;
            }
            const Prec = {
                highest: prec1(Prec_.highest),
                high: prec1(Prec_.high),
                default: prec1(Prec_.default),
                low: prec1(Prec_.low),
                lowest: prec1(Prec_.lowest)
            };
            class PrecExtension {
                constructor(inner, prec){
                    this.inner = inner, this.prec = prec;
                }
            }
            class Compartment {
                of(ext) {
                    return new CompartmentInstance(this, ext);
                }
                reconfigure(content) {
                    return Compartment.reconfigure.of({
                        compartment: this,
                        extension: content
                    });
                }
                get(state) {
                    return state.config.compartments.get(this);
                }
            }
            class CompartmentInstance {
                constructor(compartment, inner){
                    this.compartment = compartment, this.inner = inner;
                }
            }
            class Configuration {
                constructor(base, compartments, dynamicSlots, address, staticValues, facets){
                    for(this.base = base, this.compartments = compartments, this.dynamicSlots = dynamicSlots, this.address = address, this.staticValues = staticValues, this.facets = facets, this.statusTemplate = []; this.statusTemplate.length < dynamicSlots.length;)this.statusTemplate.push(0);
                }
                staticFacet(facet) {
                    let addr = this.address[facet.id];
                    return null == addr ? facet.default : this.staticValues[addr >> 1];
                }
                static resolve(base, compartments, oldState) {
                    let fields = [], facets = Object.create(null), newCompartments = new Map();
                    for (let ext of flatten(base, compartments, newCompartments))ext instanceof StateField ? fields.push(ext) : (facets[ext.facet.id] || (facets[ext.facet.id] = [])).push(ext);
                    let address = Object.create(null), staticValues = [], dynamicSlots = [];
                    for (let field of fields)address[field.id] = dynamicSlots.length << 1, dynamicSlots.push((a)=>field.slot(a)
                    );
                    let oldFacets = null == oldState ? void 0 : oldState.config.facets;
                    for(let id in facets){
                        let providers = facets[id], facet = providers[0].facet, oldProviders = oldFacets && oldFacets[id] || [];
                        if (providers.every((p)=>0 == p.type
                        )) {
                            if (address[facet.id] = staticValues.length << 1 | 1, sameArray(oldProviders, providers)) staticValues.push(oldState.facet(facet));
                            else {
                                let value = facet.combine(providers.map((p)=>p.value
                                ));
                                staticValues.push(oldState && facet.compare(value, oldState.facet(facet)) ? oldState.facet(facet) : value);
                            }
                        } else {
                            for (let p of providers)0 == p.type ? (address[p.id] = staticValues.length << 1 | 1, staticValues.push(p.value)) : (address[p.id] = dynamicSlots.length << 1, dynamicSlots.push((a)=>p.dynamicSlot(a)
                            ));
                            address[facet.id] = dynamicSlots.length << 1, dynamicSlots.push((a)=>dynamicFacetSlot(a, facet, providers)
                            );
                        }
                    }
                    let dynamic = dynamicSlots.map((f)=>f(address)
                    );
                    return new Configuration(base, newCompartments, dynamic, address, staticValues, facets);
                }
            }
            function flatten(extension, compartments, newCompartments) {
                let result = [
                    [],
                    [],
                    [],
                    [],
                    []
                ], seen = new Map();
                function inner(ext, prec) {
                    let known = seen.get(ext);
                    if (null != known) {
                        if (known <= prec) return;
                        let found = result[known].indexOf(ext);
                        found > -1 && result[known].splice(found, 1), ext instanceof CompartmentInstance && newCompartments.delete(ext.compartment);
                    }
                    if (seen.set(ext, prec), Array.isArray(ext)) for (let e of ext)inner(e, prec);
                    else if (ext instanceof CompartmentInstance) {
                        if (newCompartments.has(ext.compartment)) throw new RangeError("Duplicate use of compartment in extensions");
                        let content = compartments.get(ext.compartment) || ext.inner;
                        newCompartments.set(ext.compartment, content), inner(content, prec);
                    } else if (ext instanceof PrecExtension) inner(ext.inner, ext.prec);
                    else if (ext instanceof StateField) result[prec].push(ext), ext.provides && inner(ext.provides, prec);
                    else if (ext instanceof FacetProvider) result[prec].push(ext), ext.facet.extensions && inner(ext.facet.extensions, prec);
                    else {
                        let content = ext.extension;
                        if (!content) throw new Error(`Unrecognized extension value in extension set (${ext}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
                        inner(content, prec);
                    }
                }
                return inner(extension, Prec_.default), result.reduce((a, b)=>a.concat(b)
                );
            }
            function ensureAddr(state, addr) {
                if (1 & addr) return 2;
                let idx = addr >> 1, status = state.status[idx];
                if (4 == status) throw new Error("Cyclic dependency between fields and/or facets");
                if (2 & status) return status;
                state.status[idx] = 4;
                let changed = state.computeSlot(state, state.config.dynamicSlots[idx]);
                return state.status[idx] = 2 | changed;
            }
            function getAddr(state, addr) {
                return 1 & addr ? state.config.staticValues[addr >> 1] : state.values[addr >> 1];
            }
            const languageData = Facet.define(), allowMultipleSelections = Facet.define({
                combine: (values)=>values.some((v)=>v
                    )
                ,
                static: !0
            }), lineSeparator = Facet.define({
                combine: (values)=>values.length ? values[0] : void 0
                ,
                static: !0
            }), changeFilter = Facet.define(), transactionFilter = Facet.define(), transactionExtender = Facet.define(), readOnly = Facet.define({
                combine: (values)=>!!values.length && values[0]
            });
            class Annotation {
                constructor(type, value){
                    this.type = type, this.value = value;
                }
                static define() {
                    return new AnnotationType();
                }
            }
            class AnnotationType {
                of(value) {
                    return new Annotation(this, value);
                }
            }
            class StateEffectType {
                constructor(map){
                    this.map = map;
                }
                of(value) {
                    return new StateEffect(this, value);
                }
            }
            class StateEffect {
                constructor(type, value){
                    this.type = type, this.value = value;
                }
                map(mapping) {
                    let mapped = this.type.map(this.value, mapping);
                    return void 0 === mapped ? void 0 : mapped == this.value ? this : new StateEffect(this.type, mapped);
                }
                is(type) {
                    return this.type == type;
                }
                static define(spec = {}) {
                    return new StateEffectType(spec.map || ((v)=>v
                    ));
                }
                static mapEffects(effects, mapping) {
                    if (!effects.length) return effects;
                    let result = [];
                    for (let effect of effects){
                        let mapped = effect.map(mapping);
                        mapped && result.push(mapped);
                    }
                    return result;
                }
            }
            StateEffect.reconfigure = StateEffect.define(), StateEffect.appendConfig = StateEffect.define();
            class Transaction {
                constructor(startState, changes, selection, effects, annotations, scrollIntoView){
                    this.startState = startState, this.changes = changes, this.selection = selection, this.effects = effects, this.annotations = annotations, this.scrollIntoView = scrollIntoView, this._doc = null, this._state = null, selection && checkSelection(selection, changes.newLength), annotations.some((a)=>a.type == Transaction.time
                    ) || (this.annotations = annotations.concat(Transaction.time.of(Date.now())));
                }
                get newDoc() {
                    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
                }
                get newSelection() {
                    return this.selection || this.startState.selection.map(this.changes);
                }
                get state() {
                    return this._state || this.startState.applyTransaction(this), this._state;
                }
                annotation(type) {
                    for (let ann of this.annotations)if (ann.type == type) return ann.value;
                }
                get docChanged() {
                    return !this.changes.empty;
                }
                get reconfigured() {
                    return this.startState.config != this.state.config;
                }
                isUserEvent(event) {
                    let e = this.annotation(Transaction.userEvent);
                    return !!(e && (e == event || e.length > event.length && e.slice(0, event.length) == event && "." == e[event.length]));
                }
            }
            function joinRanges(a, b) {
                let result = [];
                for(let iA = 0, iB = 0;;){
                    let from, to;
                    if (iA < a.length && (iB == b.length || b[iB] >= a[iA])) from = a[iA++], to = a[iA++];
                    else {
                        if (!(iB < b.length)) return result;
                        from = b[iB++], to = b[iB++];
                    }
                    !result.length || result[result.length - 1] < from ? result.push(from, to) : result[result.length - 1] < to && (result[result.length - 1] = to);
                }
            }
            function mergeTransaction(a, b, sequential) {
                var _a;
                let mapForA, mapForB, changes;
                return sequential ? (mapForA = b.changes, mapForB = ChangeSet.empty(b.changes.length), changes = a.changes.compose(b.changes)) : (mapForA = b.changes.map(a.changes), mapForB = a.changes.mapDesc(b.changes, !0), changes = a.changes.compose(mapForA)), {
                    changes,
                    selection: b.selection ? b.selection.map(mapForB) : null === (_a = a.selection) || void 0 === _a ? void 0 : _a.map(mapForA),
                    effects: StateEffect.mapEffects(a.effects, mapForA).concat(StateEffect.mapEffects(b.effects, mapForB)),
                    annotations: a.annotations.length ? a.annotations.concat(b.annotations) : b.annotations,
                    scrollIntoView: a.scrollIntoView || b.scrollIntoView
                };
            }
            function resolveTransactionInner(state, spec, docSize) {
                let sel = spec.selection, annotations = asArray(spec.annotations);
                return spec.userEvent && (annotations = annotations.concat(Transaction.userEvent.of(spec.userEvent))), {
                    changes: spec.changes instanceof ChangeSet ? spec.changes : ChangeSet.of(spec.changes || [], docSize, state.facet(lineSeparator)),
                    selection: sel && (sel instanceof EditorSelection ? sel : EditorSelection.single(sel.anchor, sel.head)),
                    effects: asArray(spec.effects),
                    annotations,
                    scrollIntoView: !!spec.scrollIntoView
                };
            }
            function resolveTransaction(state, specs, filter) {
                let s = resolveTransactionInner(state, specs.length ? specs[0] : {}, state.doc.length);
                specs.length && !1 === specs[0].filter && (filter = !1);
                for(let i = 1; i < specs.length; i++){
                    !1 === specs[i].filter && (filter = !1);
                    let seq = !!specs[i].sequential;
                    s = mergeTransaction(s, resolveTransactionInner(state, specs[i], seq ? s.changes.newLength : state.doc.length), seq);
                }
                let tr = new Transaction(state, s.changes, s.selection, s.effects, s.annotations, s.scrollIntoView);
                return extendTransaction(filter ? filterTransaction(tr) : tr);
            }
            function filterTransaction(tr) {
                let state = tr.startState, result = !0;
                for (let filter of state.facet(changeFilter)){
                    let value = filter(tr);
                    if (!1 === value) {
                        result = !1;
                        break;
                    }
                    Array.isArray(value) && (result = !0 === result ? value : joinRanges(result, value));
                }
                if (!0 !== result) {
                    let changes, back;
                    if (!1 === result) back = tr.changes.invertedDesc, changes = ChangeSet.empty(state.doc.length);
                    else {
                        let filtered = tr.changes.filter(result);
                        changes = filtered.changes, back = filtered.filtered.invertedDesc;
                    }
                    tr = new Transaction(state, changes, tr.selection && tr.selection.map(back), StateEffect.mapEffects(tr.effects, back), tr.annotations, tr.scrollIntoView);
                }
                let filters = state.facet(transactionFilter);
                for(let i = filters.length - 1; i >= 0; i--){
                    let filtered = filters[i](tr);
                    tr = filtered instanceof Transaction ? filtered : Array.isArray(filtered) && 1 == filtered.length && filtered[0] instanceof Transaction ? filtered[0] : resolveTransaction(state, asArray(filtered), !1);
                }
                return tr;
            }
            function extendTransaction(tr) {
                let state = tr.startState, extenders = state.facet(transactionExtender), spec = tr;
                for(let i = extenders.length - 1; i >= 0; i--){
                    let extension = extenders[i](tr);
                    extension && Object.keys(extension).length && (spec = mergeTransaction(tr, resolveTransactionInner(state, extension, tr.changes.newLength), !0));
                }
                return spec == tr ? tr : new Transaction(state, tr.changes, tr.selection, spec.effects, spec.annotations, spec.scrollIntoView);
            }
            Transaction.time = Annotation.define(), Transaction.userEvent = Annotation.define(), Transaction.addToHistory = Annotation.define(), Transaction.remote = Annotation.define();
            const none = [];
            function asArray(value) {
                return null == value ? none : Array.isArray(value) ? value : [
                    value
                ];
            }
            var CharCategory1 = function(CharCategory) {
                return CharCategory[CharCategory.Word = 0] = "Word", CharCategory[CharCategory.Space = 1] = "Space", CharCategory[CharCategory.Other = 2] = "Other", CharCategory;
            }(CharCategory1 || (CharCategory1 = {}));
            const nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
            let wordChar;
            try {
                wordChar = new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
            } catch (_) {}
            function hasWordChar(str) {
                if (wordChar) return wordChar.test(str);
                for(let i = 0; i < str.length; i++){
                    let ch = str[i];
                    if (/\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch))) return !0;
                }
                return !1;
            }
            function makeCategorizer(wordChars) {
                return (char)=>{
                    if (!/\S/.test(char)) return CharCategory1.Space;
                    if (hasWordChar(char)) return CharCategory1.Word;
                    for(let i = 0; i < wordChars.length; i++)if (char.indexOf(wordChars[i]) > -1) return CharCategory1.Word;
                    return CharCategory1.Other;
                };
            }
            class EditorState {
                constructor(config, doc, selection, values, computeSlot, tr){
                    this.config = config, this.doc = doc, this.selection = selection, this.values = values, this.status = config.statusTemplate.slice(), this.computeSlot = computeSlot, tr && (tr._state = this);
                    for(let i = 0; i < this.config.dynamicSlots.length; i++)ensureAddr(this, i << 1);
                    this.computeSlot = null;
                }
                field(field, require = !0) {
                    let addr = this.config.address[field.id];
                    if (null == addr) {
                        if (require) throw new RangeError("Field is not present in this state");
                        return;
                    }
                    return ensureAddr(this, addr), getAddr(this, addr);
                }
                update(...specs) {
                    return resolveTransaction(this, specs, !0);
                }
                applyTransaction(tr) {
                    let conf = this.config, { base , compartments  } = conf;
                    for (let effect of tr.effects)effect.is(Compartment.reconfigure) ? (conf && (compartments = new Map(), conf.compartments.forEach((val, key)=>compartments.set(key, val)
                    ), conf = null), compartments.set(effect.value.compartment, effect.value.extension)) : effect.is(StateEffect.reconfigure) ? (conf = null, base = effect.value) : effect.is(StateEffect.appendConfig) && (conf = null, base = asArray(base).concat(effect.value));
                    let startValues;
                    conf ? startValues = tr.startState.values.slice() : (conf = Configuration.resolve(base, compartments, this), startValues = new EditorState(conf, this.doc, this.selection, conf.dynamicSlots.map(()=>null
                    ), (state, slot)=>slot.reconfigure(state, this)
                    , null).values), new EditorState(conf, tr.newDoc, tr.newSelection, startValues, (state, slot)=>slot.update(state, tr)
                    , tr);
                }
                replaceSelection(text) {
                    return "string" == typeof text && (text = this.toText(text)), this.changeByRange((range)=>({
                            changes: {
                                from: range.from,
                                to: range.to,
                                insert: text
                            },
                            range: EditorSelection.cursor(range.from + text.length)
                        })
                    );
                }
                changeByRange(f) {
                    let sel = this.selection, result1 = f(sel.ranges[0]), changes = this.changes(result1.changes), ranges = [
                        result1.range
                    ], effects = asArray(result1.effects);
                    for(let i = 1; i < sel.ranges.length; i++){
                        let result = f(sel.ranges[i]), newChanges = this.changes(result.changes), newMapped = newChanges.map(changes);
                        for(let j = 0; j < i; j++)ranges[j] = ranges[j].map(newMapped);
                        let mapBy = changes.mapDesc(newChanges, !0);
                        ranges.push(result.range.map(mapBy)), changes = changes.compose(newMapped), effects = StateEffect.mapEffects(effects, newMapped).concat(StateEffect.mapEffects(asArray(result.effects), mapBy));
                    }
                    return {
                        changes,
                        selection: EditorSelection.create(ranges, sel.mainIndex),
                        effects
                    };
                }
                changes(spec = []) {
                    return spec instanceof ChangeSet ? spec : ChangeSet.of(spec, this.doc.length, this.facet(EditorState.lineSeparator));
                }
                toText(string) {
                    return Text.of(string.split(this.facet(EditorState.lineSeparator) || DefaultSplit));
                }
                sliceDoc(from = 0, to = this.doc.length) {
                    return this.doc.sliceString(from, to, this.lineBreak);
                }
                facet(facet) {
                    let addr = this.config.address[facet.id];
                    return null == addr ? facet.default : (ensureAddr(this, addr), getAddr(this, addr));
                }
                toJSON(fields) {
                    let result = {
                        doc: this.sliceDoc(),
                        selection: this.selection.toJSON()
                    };
                    if (fields) for(let prop in fields){
                        let value = fields[prop];
                        value instanceof StateField && (result[prop] = value.spec.toJSON(this.field(fields[prop]), this));
                    }
                    return result;
                }
                static fromJSON(json, config = {}, fields) {
                    if (!json || "string" != typeof json.doc) throw new RangeError("Invalid JSON representation for EditorState");
                    let fieldInit = [];
                    if (fields) for(let prop in fields){
                        let field = fields[prop], value = json[prop];
                        fieldInit.push(field.init((state)=>field.spec.fromJSON(value, state)
                        ));
                    }
                    return EditorState.create({
                        doc: json.doc,
                        selection: EditorSelection.fromJSON(json.selection),
                        extensions: config.extensions ? fieldInit.concat([
                            config.extensions
                        ]) : fieldInit
                    });
                }
                static create(config = {}) {
                    let configuration = Configuration.resolve(config.extensions || [], new Map()), doc = config.doc instanceof Text ? config.doc : Text.of((config.doc || "").split(configuration.staticFacet(EditorState.lineSeparator) || DefaultSplit)), selection = config.selection ? config.selection instanceof EditorSelection ? config.selection : EditorSelection.single(config.selection.anchor, config.selection.head) : EditorSelection.single(0);
                    return checkSelection(selection, doc.length), configuration.staticFacet(allowMultipleSelections) || (selection = selection.asSingle()), new EditorState(configuration, doc, selection, configuration.dynamicSlots.map(()=>null
                    ), (state, slot)=>slot.create(state)
                    , null);
                }
                get tabSize() {
                    return this.facet(EditorState.tabSize);
                }
                get lineBreak() {
                    return this.facet(EditorState.lineSeparator) || "\n";
                }
                get readOnly() {
                    return this.facet(readOnly);
                }
                phrase(phrase) {
                    for (let map of this.facet(EditorState.phrases))if (Object.prototype.hasOwnProperty.call(map, phrase)) return map[phrase];
                    return phrase;
                }
                languageDataAt(name, pos, side = -1) {
                    let values = [];
                    for (let provider of this.facet(languageData))for (let result of provider(this, pos, side))Object.prototype.hasOwnProperty.call(result, name) && values.push(result[name]);
                    return values;
                }
                charCategorizer(at) {
                    return makeCategorizer(this.languageDataAt("wordChars", at).join(""));
                }
                wordAt(pos) {
                    let { text , from , length  } = this.doc.lineAt(pos), cat = this.charCategorizer(pos), start = pos - from, end = pos - from;
                    for(; start > 0;){
                        let prev = findClusterBreak(text, start, !1);
                        if (cat(text.slice(prev, start)) != CharCategory1.Word) break;
                        start = prev;
                    }
                    for(; end < length;){
                        let next = findClusterBreak(text, end);
                        if (cat(text.slice(end, next)) != CharCategory1.Word) break;
                        end = next;
                    }
                    return start == end ? null : EditorSelection.range(start + from, end + from);
                }
            }
            function combineConfig(configs, defaults, combine = {}) {
                let result = {};
                for (let config of configs)for (let key of Object.keys(config)){
                    let value = config[key], current = result[key];
                    if (void 0 === current) result[key] = value;
                    else if (current === value || void 0 === value) ;
                    else if (Object.hasOwnProperty.call(combine, key)) result[key] = combine[key](current, value);
                    else throw new Error("Config merge conflict for field " + key);
                }
                for(let key1 in defaults)void 0 === result[key1] && (result[key1] = defaults[key1]);
                return result;
            }
            EditorState.allowMultipleSelections = allowMultipleSelections, EditorState.tabSize = Facet.define({
                combine: (values)=>values.length ? values[0] : 4
            }), EditorState.lineSeparator = lineSeparator, EditorState.readOnly = readOnly, EditorState.phrases = Facet.define({
                compare (a, b) {
                    let kA = Object.keys(a), kB = Object.keys(b);
                    return kA.length == kB.length && kA.every((k)=>a[k] == b[k]
                    );
                }
            }), EditorState.languageData = languageData, EditorState.changeFilter = changeFilter, EditorState.transactionFilter = transactionFilter, EditorState.transactionExtender = transactionExtender, Compartment.reconfigure = StateEffect.define();
            class RangeValue {
                eq(other) {
                    return this == other;
                }
                range(from, to = from) {
                    return new Range(from, to, this);
                }
            }
            RangeValue.prototype.startSide = RangeValue.prototype.endSide = 0, RangeValue.prototype.point = !1, RangeValue.prototype.mapMode = MapMode1.TrackDel;
            class Range {
                constructor(from, to, value){
                    this.from = from, this.to = to, this.value = value;
                }
            }
            function cmpRange(a, b) {
                return a.from - b.from || a.value.startSide - b.value.startSide;
            }
            class Chunk {
                constructor(from, to, value, maxPoint){
                    this.from = from, this.to = to, this.value = value, this.maxPoint = maxPoint;
                }
                get length() {
                    return this.to[this.to.length - 1];
                }
                findIndex(pos, side, end, startAt = 0) {
                    let arr = end ? this.to : this.from;
                    for(let lo = startAt, hi = arr.length;;){
                        if (lo == hi) return lo;
                        let mid = lo + hi >> 1, diff = arr[mid] - pos || (end ? this.value[mid].endSide : this.value[mid].startSide) - side;
                        if (mid == lo) return diff >= 0 ? lo : hi;
                        diff >= 0 ? hi = mid : lo = mid + 1;
                    }
                }
                between(offset, from, to, f) {
                    for(let i = this.findIndex(from, -1000000000, !0), e = this.findIndex(to, 1000000000, !1, i); i < e; i++)if (!1 === f(this.from[i] + offset, this.to[i] + offset, this.value[i])) return !1;
                }
                map(offset, changes) {
                    let value = [], from = [], to = [], newPos = -1, maxPoint = -1;
                    for(let i = 0; i < this.value.length; i++){
                        let val = this.value[i], curFrom = this.from[i] + offset, curTo = this.to[i] + offset, newFrom, newTo;
                        if (curFrom == curTo) {
                            let mapped = changes.mapPos(curFrom, val.startSide, val.mapMode);
                            if (null == mapped || (newFrom = newTo = mapped, val.startSide != val.endSide && (newTo = changes.mapPos(curFrom, val.endSide)) < newFrom)) continue;
                        } else if (newFrom = changes.mapPos(curFrom, val.startSide), newTo = changes.mapPos(curTo, val.endSide), newFrom > newTo || newFrom == newTo && val.startSide > 0 && val.endSide <= 0) continue;
                        0 > (newTo - newFrom || val.endSide - val.startSide) || (newPos < 0 && (newPos = newFrom), val.point && (maxPoint = Math.max(maxPoint, newTo - newFrom)), value.push(val), from.push(newFrom - newPos), to.push(newTo - newPos));
                    }
                    return {
                        mapped: value.length ? new Chunk(from, to, value, maxPoint) : null,
                        pos: newPos
                    };
                }
            }
            class RangeSet {
                constructor(chunkPos, chunk, nextLayer = RangeSet.empty, maxPoint){
                    this.chunkPos = chunkPos, this.chunk = chunk, this.nextLayer = nextLayer, this.maxPoint = maxPoint;
                }
                get length() {
                    let last = this.chunk.length - 1;
                    return last < 0 ? 0 : Math.max(this.chunkEnd(last), this.nextLayer.length);
                }
                get size() {
                    if (this.isEmpty) return 0;
                    let size = this.nextLayer.size;
                    for (let chunk of this.chunk)size += chunk.value.length;
                    return size;
                }
                chunkEnd(index) {
                    return this.chunkPos[index] + this.chunk[index].length;
                }
                update(updateSpec) {
                    let { add =[] , sort =!1 , filterFrom =0 , filterTo =this.length ,  } = updateSpec, filter = updateSpec.filter;
                    if (0 == add.length && !filter) return this;
                    if (sort && (add = add.slice().sort(cmpRange)), this.isEmpty) return add.length ? RangeSet.of(add) : this;
                    let cur = new LayerCursor(this, null, -1).goto(0), i = 0, spill = [], builder = new RangeSetBuilder();
                    for(; cur.value || i < add.length;)if (i < add.length && (cur.from - add[i].from || cur.startSide - add[i].value.startSide) >= 0) {
                        let range = add[i++];
                        builder.addInner(range.from, range.to, range.value) || spill.push(range);
                    } else 1 == cur.rangeIndex && cur.chunkIndex < this.chunk.length && (i == add.length || this.chunkEnd(cur.chunkIndex) < add[i].from) && (!filter || filterFrom > this.chunkEnd(cur.chunkIndex) || filterTo < this.chunkPos[cur.chunkIndex]) && builder.addChunk(this.chunkPos[cur.chunkIndex], this.chunk[cur.chunkIndex]) ? cur.nextChunk() : ((!filter || filterFrom > cur.to || filterTo < cur.from || filter(cur.from, cur.to, cur.value)) && (builder.addInner(cur.from, cur.to, cur.value) || spill.push(new Range(cur.from, cur.to, cur.value))), cur.next());
                    return builder.finishInner(this.nextLayer.isEmpty && !spill.length ? RangeSet.empty : this.nextLayer.update({
                        add: spill,
                        filter,
                        filterFrom,
                        filterTo
                    }));
                }
                map(changes) {
                    if (changes.empty || this.isEmpty) return this;
                    let chunks = [], chunkPos = [], maxPoint = -1;
                    for(let i = 0; i < this.chunk.length; i++){
                        let start = this.chunkPos[i], chunk = this.chunk[i], touch = changes.touchesRange(start, start + chunk.length);
                        if (!1 === touch) maxPoint = Math.max(maxPoint, chunk.maxPoint), chunks.push(chunk), chunkPos.push(changes.mapPos(start));
                        else if (!0 === touch) {
                            let { mapped , pos  } = chunk.map(start, changes);
                            mapped && (maxPoint = Math.max(maxPoint, mapped.maxPoint), chunks.push(mapped), chunkPos.push(pos));
                        }
                    }
                    let next = this.nextLayer.map(changes);
                    return 0 == chunks.length ? next : new RangeSet(chunkPos, chunks, next, maxPoint);
                }
                between(from, to, f) {
                    if (!this.isEmpty) {
                        for(let i = 0; i < this.chunk.length; i++){
                            let start = this.chunkPos[i], chunk = this.chunk[i];
                            if (to >= start && from <= start + chunk.length && !1 === chunk.between(start, from - start, to - start, f)) return;
                        }
                        this.nextLayer.between(from, to, f);
                    }
                }
                iter(from = 0) {
                    return HeapCursor.from([
                        this
                    ]).goto(from);
                }
                get isEmpty() {
                    return this.nextLayer == this;
                }
                static iter(sets, from = 0) {
                    return HeapCursor.from(sets).goto(from);
                }
                static compare(oldSets, newSets, textDiff, comparator, minPointSize = -1) {
                    let a = oldSets.filter((set)=>set.maxPoint > 0 || !set.isEmpty && set.maxPoint >= minPointSize
                    ), b = newSets.filter((set)=>set.maxPoint > 0 || !set.isEmpty && set.maxPoint >= minPointSize
                    ), sharedChunks = findSharedChunks(a, b, textDiff), sideA = new SpanCursor(a, sharedChunks, minPointSize), sideB = new SpanCursor(b, sharedChunks, minPointSize);
                    textDiff.iterGaps((fromA, fromB, length)=>compare1(sideA, fromA, sideB, fromB, length, comparator)
                    ), textDiff.empty && 0 == textDiff.length && compare1(sideA, 0, sideB, 0, 0, comparator);
                }
                static eq(oldSets, newSets, from = 0, to) {
                    null == to && (to = 1000000000);
                    let a = oldSets.filter((set)=>!set.isEmpty && 0 > newSets.indexOf(set)
                    ), b = newSets.filter((set)=>!set.isEmpty && 0 > oldSets.indexOf(set)
                    );
                    if (a.length != b.length) return !1;
                    if (!a.length) return !0;
                    let sharedChunks = findSharedChunks(a, b), sideA = new SpanCursor(a, sharedChunks, 0).goto(from), sideB = new SpanCursor(b, sharedChunks, 0).goto(from);
                    for(;;){
                        if (sideA.to != sideB.to || !sameValues(sideA.active, sideB.active) || sideA.point && (!sideB.point || !sideA.point.eq(sideB.point))) return !1;
                        if (sideA.to > to) return !0;
                        sideA.next(), sideB.next();
                    }
                }
                static spans(sets, from, to, iterator, minPointSize = -1) {
                    let cursor = new SpanCursor(sets, null, minPointSize).goto(from), pos = from, open = cursor.openStart;
                    for(;;){
                        let curTo = Math.min(cursor.to, to);
                        if (cursor.point ? (iterator.point(pos, curTo, cursor.point, cursor.activeForPoint(cursor.to), open, cursor.pointRank), open = cursor.openEnd(curTo) + (cursor.to > curTo ? 1 : 0)) : curTo > pos && (iterator.span(pos, curTo, cursor.active, open), open = cursor.openEnd(curTo)), cursor.to > to) break;
                        pos = cursor.to, cursor.next();
                    }
                    return open;
                }
                static of(ranges, sort = !1) {
                    let build = new RangeSetBuilder();
                    for (let range of ranges instanceof Range ? [
                        ranges
                    ] : sort ? lazySort(ranges) : ranges)build.add(range.from, range.to, range.value);
                    return build.finish();
                }
            }
            function lazySort(ranges) {
                if (ranges.length > 1) for(let prev = ranges[0], i = 1; i < ranges.length; i++){
                    let cur = ranges[i];
                    if (cmpRange(prev, cur) > 0) return ranges.slice().sort(cmpRange);
                    prev = cur;
                }
                return ranges;
            }
            RangeSet.empty = new RangeSet([], [], null, -1), RangeSet.empty.nextLayer = RangeSet.empty;
            class RangeSetBuilder {
                constructor(){
                    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1000000000, this.lastTo = -1000000000, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
                }
                finishChunk(newArrays) {
                    this.chunks.push(new Chunk(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, newArrays && (this.from = [], this.to = [], this.value = []);
                }
                add(from, to, value) {
                    this.addInner(from, to, value) || (this.nextLayer || (this.nextLayer = new RangeSetBuilder())).add(from, to, value);
                }
                addInner(from, to, value) {
                    let diff = from - this.lastTo || value.startSide - this.last.endSide;
                    if (diff <= 0 && 0 > (from - this.lastFrom || value.startSide - this.last.startSide)) throw new Error("Ranges must be added sorted by `from` position and `startSide`");
                    return !(diff < 0) && (250 == this.from.length && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = from), this.from.push(from - this.chunkStart), this.to.push(to - this.chunkStart), this.last = value, this.lastFrom = from, this.lastTo = to, this.value.push(value), value.point && (this.maxPoint = Math.max(this.maxPoint, to - from)), !0);
                }
                addChunk(from, chunk) {
                    if (0 > (from - this.lastTo || chunk.value[0].startSide - this.last.endSide)) return !1;
                    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, chunk.maxPoint), this.chunks.push(chunk), this.chunkPos.push(from);
                    let last = chunk.value.length - 1;
                    return this.last = chunk.value[last], this.lastFrom = chunk.from[last] + from, this.lastTo = chunk.to[last] + from, !0;
                }
                finish() {
                    return this.finishInner(RangeSet.empty);
                }
                finishInner(next) {
                    if (this.from.length && this.finishChunk(!1), 0 == this.chunks.length) return next;
                    let result = new RangeSet(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(next) : next, this.setMaxPoint);
                    return this.from = null, result;
                }
            }
            function findSharedChunks(a, b, textDiff) {
                let inA = new Map();
                for (let set of a)for(let i = 0; i < set.chunk.length; i++)set.chunk[i].maxPoint <= 0 && inA.set(set.chunk[i], set.chunkPos[i]);
                let shared = new Set();
                for (let set1 of b)for(let i5 = 0; i5 < set1.chunk.length; i5++){
                    let known = inA.get(set1.chunk[i5]);
                    null == known || (textDiff ? textDiff.mapPos(known) : known) != set1.chunkPos[i5] || (null == textDiff ? void 0 : textDiff.touchesRange(known, known + set1.chunk[i5].length)) || shared.add(set1.chunk[i5]);
                }
                return shared;
            }
            class LayerCursor {
                constructor(layer, skip, minPoint, rank = 0){
                    this.layer = layer, this.skip = skip, this.minPoint = minPoint, this.rank = rank;
                }
                get startSide() {
                    return this.value ? this.value.startSide : 0;
                }
                get endSide() {
                    return this.value ? this.value.endSide : 0;
                }
                goto(pos, side = -1000000000) {
                    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(pos, side, !1), this;
                }
                gotoInner(pos, side, forward) {
                    for(; this.chunkIndex < this.layer.chunk.length;){
                        let next = this.layer.chunk[this.chunkIndex];
                        if (!(this.skip && this.skip.has(next) || this.layer.chunkEnd(this.chunkIndex) < pos || next.maxPoint < this.minPoint)) break;
                        this.chunkIndex++, forward = !1;
                    }
                    if (this.chunkIndex < this.layer.chunk.length) {
                        let rangeIndex = this.layer.chunk[this.chunkIndex].findIndex(pos - this.layer.chunkPos[this.chunkIndex], side, !0);
                        (!forward || this.rangeIndex < rangeIndex) && this.setRangeIndex(rangeIndex);
                    }
                    this.next();
                }
                forward(pos, side) {
                    0 > (this.to - pos || this.endSide - side) && this.gotoInner(pos, side, !0);
                }
                next() {
                    for(;;){
                        if (this.chunkIndex == this.layer.chunk.length) {
                            this.from = this.to = 1000000000, this.value = null;
                            break;
                        }
                        {
                            let chunkPos = this.layer.chunkPos[this.chunkIndex], chunk = this.layer.chunk[this.chunkIndex], from = chunkPos + chunk.from[this.rangeIndex];
                            if (this.from = from, this.to = chunkPos + chunk.to[this.rangeIndex], this.value = chunk.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint) break;
                        }
                    }
                }
                setRangeIndex(index) {
                    if (index == this.layer.chunk[this.chunkIndex].value.length) {
                        if (this.chunkIndex++, this.skip) for(; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]);)this.chunkIndex++;
                        this.rangeIndex = 0;
                    } else this.rangeIndex = index;
                }
                nextChunk() {
                    this.chunkIndex++, this.rangeIndex = 0, this.next();
                }
                compare(other) {
                    return this.from - other.from || this.startSide - other.startSide || this.rank - other.rank || this.to - other.to || this.endSide - other.endSide;
                }
            }
            class HeapCursor {
                constructor(heap){
                    this.heap = heap;
                }
                static from(sets, skip = null, minPoint = -1) {
                    let heap = [];
                    for(let i = 0; i < sets.length; i++)for(let cur = sets[i]; !cur.isEmpty; cur = cur.nextLayer)cur.maxPoint >= minPoint && heap.push(new LayerCursor(cur, skip, minPoint, i));
                    return 1 == heap.length ? heap[0] : new HeapCursor(heap);
                }
                get startSide() {
                    return this.value ? this.value.startSide : 0;
                }
                goto(pos, side = -1000000000) {
                    for (let cur of this.heap)cur.goto(pos, side);
                    for(let i = this.heap.length >> 1; i >= 0; i--)heapBubble(this.heap, i);
                    return this.next(), this;
                }
                forward(pos, side) {
                    for (let cur of this.heap)cur.forward(pos, side);
                    for(let i = this.heap.length >> 1; i >= 0; i--)heapBubble(this.heap, i);
                    0 > (this.to - pos || this.value.endSide - side) && this.next();
                }
                next() {
                    if (0 == this.heap.length) this.from = this.to = 1000000000, this.value = null, this.rank = -1;
                    else {
                        let top = this.heap[0];
                        this.from = top.from, this.to = top.to, this.value = top.value, this.rank = top.rank, top.value && top.next(), heapBubble(this.heap, 0);
                    }
                }
            }
            function heapBubble(heap, index) {
                for(let cur = heap[index];;){
                    let childIndex = (index << 1) + 1;
                    if (childIndex >= heap.length) break;
                    let child = heap[childIndex];
                    if (childIndex + 1 < heap.length && child.compare(heap[childIndex + 1]) >= 0 && (child = heap[childIndex + 1], childIndex++), 0 > cur.compare(child)) break;
                    heap[childIndex] = cur, heap[index] = child, index = childIndex;
                }
            }
            class SpanCursor {
                constructor(sets, skip, minPoint){
                    this.minPoint = minPoint, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1000000000, this.endSide = 0, this.openStart = -1, this.cursor = HeapCursor.from(sets, skip, minPoint);
                }
                goto(pos, side = -1000000000) {
                    return this.cursor.goto(pos, side), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = pos, this.endSide = side, this.openStart = -1, this.next(), this;
                }
                forward(pos, side) {
                    for(; this.minActive > -1 && 0 > (this.activeTo[this.minActive] - pos || this.active[this.minActive].endSide - side);)this.removeActive(this.minActive);
                    this.cursor.forward(pos, side);
                }
                removeActive(index) {
                    remove(this.active, index), remove(this.activeTo, index), remove(this.activeRank, index), this.minActive = findMinIndex(this.active, this.activeTo);
                }
                addActive(trackOpen) {
                    let i = 0, { value , to , rank  } = this.cursor;
                    for(; i < this.activeRank.length && this.activeRank[i] <= rank;)i++;
                    insert1(this.active, i, value), insert1(this.activeTo, i, to), insert1(this.activeRank, i, rank), trackOpen && insert1(trackOpen, i, this.cursor.from), this.minActive = findMinIndex(this.active, this.activeTo);
                }
                next() {
                    let from = this.to, wasPoint = this.point;
                    this.point = null;
                    let trackOpen = this.openStart < 0 ? [] : null, trackExtra = 0;
                    for(;;){
                        let a = this.minActive;
                        if (a > -1 && 0 > (this.activeTo[a] - this.cursor.from || this.active[a].endSide - this.cursor.startSide)) {
                            if (this.activeTo[a] > from) {
                                this.to = this.activeTo[a], this.endSide = this.active[a].endSide;
                                break;
                            }
                            this.removeActive(a), trackOpen && remove(trackOpen, a);
                        } else if (this.cursor.value) {
                            if (this.cursor.from > from) {
                                this.to = this.cursor.from, this.endSide = this.cursor.startSide;
                                break;
                            }
                            {
                                let nextVal = this.cursor.value;
                                if (nextVal.point) {
                                    if (wasPoint && this.cursor.to == this.to && this.cursor.from < this.cursor.to) this.cursor.next();
                                    else {
                                        this.point = nextVal, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = nextVal.endSide, this.cursor.from < from && (trackExtra = 1), this.cursor.next(), this.forward(this.to, this.endSide);
                                        break;
                                    }
                                } else this.addActive(trackOpen), this.cursor.next();
                            }
                        } else {
                            this.to = this.endSide = 1000000000;
                            break;
                        }
                    }
                    if (trackOpen) {
                        let openStart = 0;
                        for(; openStart < trackOpen.length && trackOpen[openStart] < from;)openStart++;
                        this.openStart = openStart + trackExtra;
                    }
                }
                activeForPoint(to) {
                    if (!this.active.length) return this.active;
                    let active = [];
                    for(let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)(this.activeTo[i] > to || this.activeTo[i] == to && this.active[i].endSide >= this.point.endSide) && active.push(this.active[i]);
                    return active.reverse();
                }
                openEnd(to) {
                    let open = 0;
                    for(let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > to; i--)open++;
                    return open;
                }
            }
            function compare1(a, startA, b, startB, length, comparator) {
                a.goto(startA), b.goto(startB);
                let endB = startB + length, pos = startB, dPos = startB - startA;
                for(;;){
                    let diff = a.to + dPos - b.to || a.endSide - b.endSide, end = diff < 0 ? a.to + dPos : b.to, clipEnd = Math.min(end, endB);
                    if (a.point || b.point ? a.point && b.point && (a.point == b.point || a.point.eq(b.point)) && sameValues(a.activeForPoint(a.to + dPos), b.activeForPoint(b.to)) || comparator.comparePoint(pos, clipEnd, a.point, b.point) : clipEnd > pos && !sameValues(a.active, b.active) && comparator.compareRange(pos, clipEnd, a.active, b.active), end > endB) break;
                    pos = end, diff <= 0 && a.next(), diff >= 0 && b.next();
                }
            }
            function sameValues(a, b) {
                if (a.length != b.length) return !1;
                for(let i = 0; i < a.length; i++)if (a[i] != b[i] && !a[i].eq(b[i])) return !1;
                return !0;
            }
            function remove(array, index) {
                for(let i = index, e = array.length - 1; i < e; i++)array[i] = array[i + 1];
                array.pop();
            }
            function insert1(array, index, value) {
                for(let i = array.length - 1; i >= index; i--)array[i + 1] = array[i];
                array[index] = value;
            }
            function findMinIndex(value, array) {
                let found = -1, foundPos = 1000000000;
                for(let i = 0; i < array.length; i++)0 > (array[i] - foundPos || value[i].endSide - value[found].endSide) && (found = i, foundPos = array[i]);
                return found;
            }
            function countColumn(string, tabSize, to = string.length) {
                let n = 0;
                for(let i = 0; i < to;)9 == string.charCodeAt(i) ? (n += tabSize - n % tabSize, i++) : (n++, i = findClusterBreak(string, i));
                return n;
            }
            function findColumn(string, col, tabSize, strict) {
                for(let i = 0, n = 0;;){
                    if (n >= col) return i;
                    if (i == string.length) break;
                    n += 9 == string.charCodeAt(i) ? tabSize - n % tabSize : 1, i = findClusterBreak(string, i);
                }
                return !0 === strict ? -1 : string.length;
            }
        },
        8699: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                V: function() {
                    return StyleModule;
                }
            });
            const C = "\u037c", COUNT = "undefined" == typeof Symbol ? "__" + C : Symbol.for(C), SET = "undefined" == typeof Symbol ? "__styleSet" + Math.floor(1e8 * Math.random()) : Symbol("styleSet"), top = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : {};
            class StyleModule {
                constructor(spec2, options){
                    this.rules = [];
                    let { finish  } = options || {};
                    function splitSelector(selector) {
                        return /^@/.test(selector) ? [
                            selector
                        ] : selector.split(/,\s*/);
                    }
                    function render(selectors, spec, target, isKeyframes) {
                        let local = [], isAt = /^@(\w+)\b/.exec(selectors[0]), keyframes = isAt && "keyframes" == isAt[1];
                        if (isAt && null == spec) return target.push(selectors[0] + ";");
                        for(let prop in spec){
                            let value = spec[prop];
                            if (/&/.test(prop)) render(prop.split(/,\s*/).map((part)=>selectors.map((sel)=>part.replace(/&/, sel)
                                )
                            ).reduce((a, b)=>a.concat(b)
                            ), value, target);
                            else if (value && "object" == typeof value) {
                                if (!isAt) throw new RangeError("The value of a property (" + prop + ") should be a primitive value.");
                                render(splitSelector(prop), value, local, keyframes);
                            } else null != value && local.push(prop.replace(/_.*/, "").replace(/[A-Z]/g, (l)=>"-" + l.toLowerCase()
                            ) + ": " + value + ";");
                        }
                        (local.length || keyframes) && target.push((!finish || isAt || isKeyframes ? selectors : selectors.map(finish)).join(", ") + " {" + local.join(" ") + "}");
                    }
                    for(let prop1 in spec2)render(splitSelector(prop1), spec2[prop1], this.rules);
                }
                getRules() {
                    return this.rules.join("\n");
                }
                static newName() {
                    let id = top[COUNT] || 1;
                    return top[COUNT] = id + 1, C + id.toString(36);
                }
                static mount(root, modules) {
                    (root[SET] || new StyleSet(root)).mount(Array.isArray(modules) ? modules : [
                        modules
                    ]);
                }
            }
            let adoptedSet = null;
            class StyleSet {
                constructor(root){
                    if (!root.head && root.adoptedStyleSheets && "undefined" != typeof CSSStyleSheet) {
                        if (adoptedSet) return root.adoptedStyleSheets = [
                            adoptedSet.sheet
                        ].concat(root.adoptedStyleSheets), root[SET] = adoptedSet;
                        this.sheet = new CSSStyleSheet(), root.adoptedStyleSheets = [
                            this.sheet
                        ].concat(root.adoptedStyleSheets), adoptedSet = this;
                    } else {
                        this.styleTag = (root.ownerDocument || root).createElement("style");
                        let target = root.head || root;
                        target.insertBefore(this.styleTag, target.firstChild);
                    }
                    this.modules = [], root[SET] = this;
                }
                mount(modules) {
                    let sheet = this.sheet, pos = 0, j = 0;
                    for(let i = 0; i < modules.length; i++){
                        let mod = modules[i], index = this.modules.indexOf(mod);
                        if (index < j && index > -1 && (this.modules.splice(index, 1), j--, index = -1), -1 == index) {
                            if (this.modules.splice(j++, 0, mod), sheet) for(let k = 0; k < mod.rules.length; k++)sheet.insertRule(mod.rules[k], pos++);
                        } else {
                            for(; j < index;)pos += this.modules[j++].rules.length;
                            pos += mod.rules.length, j++;
                        }
                    }
                    if (!sheet) {
                        let text = "";
                        for(let i = 0; i < this.modules.length; i++)text += this.modules[i].getRules() + "\n";
                        this.styleTag.textContent = text;
                    }
                }
            }
        },
        3952: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                YG: function() {
                    return keyName;
                },
                ue: function() {
                    return base;
                }
            });
            for(var base = {
                8: "Backspace",
                9: "Tab",
                10: "Enter",
                12: "NumLock",
                13: "Enter",
                16: "Shift",
                17: "Control",
                18: "Alt",
                20: "CapsLock",
                27: "Escape",
                32: " ",
                33: "PageUp",
                34: "PageDown",
                35: "End",
                36: "Home",
                37: "ArrowLeft",
                38: "ArrowUp",
                39: "ArrowRight",
                40: "ArrowDown",
                44: "PrintScreen",
                45: "Insert",
                46: "Delete",
                59: ";",
                61: "=",
                91: "Meta",
                92: "Meta",
                106: "*",
                107: "+",
                108: ",",
                109: "-",
                110: ".",
                111: "/",
                144: "NumLock",
                145: "ScrollLock",
                160: "Shift",
                161: "Shift",
                162: "Control",
                163: "Control",
                164: "Alt",
                165: "Alt",
                173: "-",
                186: ";",
                187: "=",
                188: ",",
                189: "-",
                190: ".",
                191: "/",
                192: "`",
                219: "[",
                220: "\\",
                221: "]",
                222: "'",
                229: "q"
            }, shift = {
                48: ")",
                49: "!",
                50: "@",
                51: "#",
                52: "$",
                53: "%",
                54: "^",
                55: "&",
                56: "*",
                57: "(",
                59: ":",
                61: "+",
                173: "_",
                186: ":",
                187: "+",
                188: "<",
                189: "_",
                190: ">",
                191: "?",
                192: "~",
                219: "{",
                220: "|",
                221: "}",
                222: '"',
                229: "Q"
            }, chrome = "undefined" != typeof navigator && /Chrome\/(\d+)/.exec(navigator.userAgent), safari = "undefined" != typeof navigator && /Apple Computer/.test(navigator.vendor), gecko = "undefined" != typeof navigator && /Gecko\/\d+/.test(navigator.userAgent), mac = "undefined" != typeof navigator && /Mac/.test(navigator.platform), ie = "undefined" != typeof navigator && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), brokenModifierNames = chrome && (mac || 57 > +chrome[1]) || gecko && mac, i = 0; i < 10; i++)base[48 + i] = base[96 + i] = String(i);
            for(var i = 1; i <= 24; i++)base[i + 111] = "F" + i;
            for(var i = 65; i <= 90; i++)base[i] = String.fromCharCode(i + 32), shift[i] = String.fromCharCode(i);
            for(var code in base)shift.hasOwnProperty(code) || (shift[code] = base[code]);
            function keyName(event) {
                var name = !(brokenModifierNames && (event.ctrlKey || event.altKey || event.metaKey) || (safari || ie) && event.shiftKey && event.key && 1 == event.key.length) && event.key || (event.shiftKey ? shift : base)[event.keyCode] || event.key || "Unidentified";
                return "Esc" == name && (name = "Escape"), "Del" == name && (name = "Delete"), "Left" == name && (name = "ArrowLeft"), "Up" == name && (name = "ArrowUp"), "Right" == name && (name = "ArrowRight"), "Down" == name && (name = "ArrowDown"), name;
            }
        }
    }, 
]);
