"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [546],
    {
        /***/ 9980: /***/ function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            // EXPORTS
            __webpack_require__.d(__webpack_exports__, {
                ZP: function () {
                    return /* binding */ esm;
                },
            }); // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js

            // UNUSED EXPORTS: Annotation, AnnotationType, BidiSpan, BlockInfo, BlockType, ChangeDesc, ChangeSet, CharCategory, Compartment, Decoration, Direction, EditorSelection, EditorState, EditorView, Facet, GutterMarker, Line, MapMode, MatchDecorator, Prec, Range, RangeSet, RangeSetBuilder, RangeValue, SelectionRange, StateEffect, StateEffectType, StateField, Text, Transaction, ViewPlugin, ViewUpdate, WidgetType, __test, basicSetup, closeHoverTooltips, codePointAt, codePointSize, combineConfig, countColumn, crosshairCursor, drawSelection, dropCursor, findClusterBreak, findColumn, fromCodePoint, getPanel, getTooltip, gutter, gutterLineClass, gutters, hasHoverTooltips, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, hoverTooltip, keymap, lineNumberMarkers, lineNumbers, logException, panels, placeholder, rectangularSelection, repositionTooltips, runScopeHandlers, scrollPastEnd, showPanel, showTooltip, tooltips, useCodeMirror

            function _extends() {
                _extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];

                            for (var key in source) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        source,
                                        key
                                    )
                                ) {
                                    target[key] = source[key];
                                }
                            }
                        }

                        return target;
                    };

                return _extends.apply(this, arguments);
            } // CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
            function _objectWithoutPropertiesLoose(source, excluded) {
                if (source == null) return {};
                var target = {};
                var sourceKeys = Object.keys(source);
                var key, i;

                for (i = 0; i < sourceKeys.length; i++) {
                    key = sourceKeys[i];
                    if (excluded.indexOf(key) >= 0) continue;
                    target[key] = source[key];
                }

                return target;
            }
            // EXTERNAL MODULE: ./node_modules/react/index.js
            var react = __webpack_require__(7294);
            // EXTERNAL MODULE: ./node_modules/@codemirror/view/dist/index.js
            var dist = __webpack_require__(7421);
            // EXTERNAL MODULE: ./node_modules/@codemirror/state/dist/index.js
            var state_dist = __webpack_require__(8120); // CONCATENATED MODULE: ./node_modules/@lezer/common/dist/index.js
            // FIXME profile adding a per-Tree TreeNode cache, validating it by
            // parent pointer
            /// The default maximum length of a `TreeBuffer` node (1024).
            const DefaultBufferLength = 1024;
            let nextPropID = 0;
            class Range {
                constructor(from, to) {
                    this.from = from;
                    this.to = to;
                }
            }
            /// Each [node type](#common.NodeType) or [individual tree](#common.Tree)
            /// can have metadata associated with it in props. Instances of this
            /// class represent prop names.
            class dist_NodeProp {
                /// Create a new node prop type.
                constructor(config = {}) {
                    this.id = nextPropID++;
                    this.perNode = !!config.perNode;
                    this.deserialize =
                        config.deserialize ||
                        (() => {
                            throw new Error(
                                "This node type doesn't define a deserialize function"
                            );
                        });
                }
                /// This is meant to be used with
                /// [`NodeSet.extend`](#common.NodeSet.extend) or
                /// [`LRParser.configure`](#lr.ParserConfig.props) to compute
                /// prop values for each node type in the set. Takes a [match
                /// object](#common.NodeType^match) or function that returns undefined
                /// if the node type doesn't get this prop, and the prop's value if
                /// it does.
                add(match) {
                    if (this.perNode)
                        throw new RangeError(
                            "Can't add per-node props to node types"
                        );
                    if (typeof match != "function")
                        match = dist_NodeType.match(match);
                    return (type) => {
                        let result = match(type);
                        return result === undefined ? null : [this, result];
                    };
                }
            }
            /// Prop that is used to describe matching delimiters. For opening
            /// delimiters, this holds an array of node names (written as a
            /// space-separated string when declaring this prop in a grammar)
            /// for the node types of closing delimiters that match it.
            dist_NodeProp.closedBy = new dist_NodeProp({
                deserialize: (str) => str.split(" "),
            });
            /// The inverse of [`closedBy`](#common.NodeProp^closedBy). This is
            /// attached to closing delimiters, holding an array of node names
            /// of types of matching opening delimiters.
            dist_NodeProp.openedBy = new dist_NodeProp({
                deserialize: (str) => str.split(" "),
            });
            /// Used to assign node types to groups (for example, all node
            /// types that represent an expression could be tagged with an
            /// `"Expression"` group).
            dist_NodeProp.group = new dist_NodeProp({
                deserialize: (str) => str.split(" "),
            });
            /// The hash of the [context](#lr.ContextTracker.constructor)
            /// that the node was parsed in, if any. Used to limit reuse of
            /// contextual nodes.
            dist_NodeProp.contextHash = new dist_NodeProp({ perNode: true });
            /// The distance beyond the end of the node that the tokenizer
            /// looked ahead for any of the tokens inside the node. (The LR
            /// parser only stores this when it is larger than 25, for
            /// efficiency reasons.)
            dist_NodeProp.lookAhead = new dist_NodeProp({ perNode: true });
            /// This per-node prop is used to replace a given node, or part of a
            /// node, with another tree. This is useful to include trees from
            /// different languages.
            dist_NodeProp.mounted = new dist_NodeProp({ perNode: true });
            /// A mounted tree, which can be [stored](#common.NodeProp^mounted) on
            /// a tree node to indicate that parts of its content are
            /// represented by another tree.
            class MountedTree {
                constructor(
                    /// The inner tree.
                    tree,
                    /// If this is null, this tree replaces the entire node (it will
                    /// be included in the regular iteration instead of its host
                    /// node). If not, only the given ranges are considered to be
                    /// covered by this tree. This is used for trees that are mixed in
                    /// a way that isn't strictly hierarchical. Such mounted trees are
                    /// only entered by [`resolveInner`](#common.Tree.resolveInner)
                    /// and [`enter`](#common.SyntaxNode.enter).
                    overlay,
                    /// The parser used to create this subtree.
                    parser
                ) {
                    this.tree = tree;
                    this.overlay = overlay;
                    this.parser = parser;
                }
            }
            const noProps = Object.create(null);
            /// Each node in a syntax tree has a node type associated with it.
            class dist_NodeType {
                /// @internal
                constructor(
                    /// The name of the node type. Not necessarily unique, but if the
                    /// grammar was written properly, different node types with the
                    /// same name within a node set should play the same semantic
                    /// role.
                    name,
                    /// @internal
                    props,
                    /// The id of this node in its set. Corresponds to the term ids
                    /// used in the parser.
                    id,
                    /// @internal
                    flags = 0
                ) {
                    this.name = name;
                    this.props = props;
                    this.id = id;
                    this.flags = flags;
                }
                static define(spec) {
                    let props =
                        spec.props && spec.props.length
                            ? Object.create(null)
                            : noProps;
                    let flags =
                        (spec.top ? 1 /* Top */ : 0) |
                        (spec.skipped ? 2 /* Skipped */ : 0) |
                        (spec.error ? 4 /* Error */ : 0) |
                        (spec.name == null ? 8 /* Anonymous */ : 0);
                    let type = new dist_NodeType(
                        spec.name || "",
                        props,
                        spec.id,
                        flags
                    );
                    if (spec.props)
                        for (let src of spec.props) {
                            if (!Array.isArray(src)) src = src(type);
                            if (src) {
                                if (src[0].perNode)
                                    throw new RangeError(
                                        "Can't store a per-node prop on a node type"
                                    );
                                props[src[0].id] = src[1];
                            }
                        }
                    return type;
                }
                /// Retrieves a node prop for this type. Will return `undefined` if
                /// the prop isn't present on this node.
                prop(prop) {
                    return this.props[prop.id];
                }
                /// True when this is the top node of a grammar.
                get isTop() {
                    return (this.flags & 1) /* Top */ > 0;
                }
                /// True when this node is produced by a skip rule.
                get isSkipped() {
                    return (this.flags & 2) /* Skipped */ > 0;
                }
                /// Indicates whether this is an error node.
                get isError() {
                    return (this.flags & 4) /* Error */ > 0;
                }
                /// When true, this node type doesn't correspond to a user-declared
                /// named node, for example because it is used to cache repetition.
                get isAnonymous() {
                    return (this.flags & 8) /* Anonymous */ > 0;
                }
                /// Returns true when this node's name or one of its
                /// [groups](#common.NodeProp^group) matches the given string.
                is(name) {
                    if (typeof name == "string") {
                        if (this.name == name) return true;
                        let group = this.prop(dist_NodeProp.group);
                        return group ? group.indexOf(name) > -1 : false;
                    }
                    return this.id == name;
                }
                /// Create a function from node types to arbitrary values by
                /// specifying an object whose property names are node or
                /// [group](#common.NodeProp^group) names. Often useful with
                /// [`NodeProp.add`](#common.NodeProp.add). You can put multiple
                /// names, separated by spaces, in a single property name to map
                /// multiple node names to a single value.
                static match(map) {
                    let direct = Object.create(null);
                    for (let prop in map)
                        for (let name of prop.split(" "))
                            direct[name] = map[prop];
                    return (node) => {
                        for (
                            let groups = node.prop(dist_NodeProp.group), i = -1;
                            i < (groups ? groups.length : 0);
                            i++
                        ) {
                            let found = direct[i < 0 ? node.name : groups[i]];
                            if (found) return found;
                        }
                    };
                }
            }
            /// An empty dummy node type to use when no actual type is available.
            dist_NodeType.none = new dist_NodeType(
                "",
                Object.create(null),
                0,
                8 /* Anonymous */
            );
            /// A node set holds a collection of node types. It is used to
            /// compactly represent trees by storing their type ids, rather than a
            /// full pointer to the type object, in a numeric array. Each parser
            /// [has](#lr.LRParser.nodeSet) a node set, and [tree
            /// buffers](#common.TreeBuffer) can only store collections of nodes
            /// from the same set. A set can have a maximum of 2**16 (65536) node
            /// types in it, so that the ids fit into 16-bit typed array slots.
            class NodeSet {
                /// Create a set with the given types. The `id` property of each
                /// type should correspond to its position within the array.
                constructor(
                    /// The node types in this set, by id.
                    types
                ) {
                    this.types = types;
                    for (let i = 0; i < types.length; i++)
                        if (types[i].id != i)
                            throw new RangeError(
                                "Node type ids should correspond to array positions when creating a node set"
                            );
                }
                /// Create a copy of this set with some node properties added. The
                /// arguments to this method should be created with
                /// [`NodeProp.add`](#common.NodeProp.add).
                extend(...props) {
                    let newTypes = [];
                    for (let type of this.types) {
                        let newProps = null;
                        for (let source of props) {
                            let add = source(type);
                            if (add) {
                                if (!newProps)
                                    newProps = Object.assign({}, type.props);
                                newProps[add[0].id] = add[1];
                            }
                        }
                        newTypes.push(
                            newProps
                                ? new dist_NodeType(
                                      type.name,
                                      newProps,
                                      type.id,
                                      type.flags
                                  )
                                : type
                        );
                    }
                    return new NodeSet(newTypes);
                }
            }
            const CachedNode = new WeakMap(),
                CachedInnerNode = new WeakMap();
            /// Options that control iteration. Can be combined with the `|`
            /// operator to enable multiple ones.
            var IterMode;
            (function (IterMode) {
                /// When enabled, iteration will only visit [`Tree`](#common.Tree)
                /// objects, not nodes packed into
                /// [`TreeBuffer`](#common.TreeBuffer)s.
                IterMode[(IterMode["ExcludeBuffers"] = 1)] = "ExcludeBuffers";
                /// Enable this to make iteration include anonymous nodes (such as
                /// the nodes that wrap repeated grammar constructs into a balanced
                /// tree).
                IterMode[(IterMode["IncludeAnonymous"] = 2)] =
                    "IncludeAnonymous";
                /// By default, regular [mounted](#common.NodeProp^mounted) nodes
                /// replace their base node in iteration. Enable this to ignore them
                /// instead.
                IterMode[(IterMode["IgnoreMounts"] = 4)] = "IgnoreMounts";
                /// This option only applies in
                /// [`enter`](#common.SyntaxNode.enter)-style methods. It tells the
                /// library to not enter mounted overlays if one covers the given
                /// position.
                IterMode[(IterMode["IgnoreOverlays"] = 8)] = "IgnoreOverlays";
            })(IterMode || (IterMode = {}));
            /// A piece of syntax tree. There are two ways to approach these
            /// trees: the way they are actually stored in memory, and the
            /// convenient way.
            ///
            /// Syntax trees are stored as a tree of `Tree` and `TreeBuffer`
            /// objects. By packing detail information into `TreeBuffer` leaf
            /// nodes, the representation is made a lot more memory-efficient.
            ///
            /// However, when you want to actually work with tree nodes, this
            /// representation is very awkward, so most client code will want to
            /// use the [`TreeCursor`](#common.TreeCursor) or
            /// [`SyntaxNode`](#common.SyntaxNode) interface instead, which provides
            /// a view on some part of this data structure, and can be used to
            /// move around to adjacent nodes.
            class dist_Tree {
                /// Construct a new tree. See also [`Tree.build`](#common.Tree^build).
                constructor(
                    /// The type of the top node.
                    type,
                    /// This node's child nodes.
                    children,
                    /// The positions (offsets relative to the start of this tree) of
                    /// the children.
                    positions,
                    /// The total length of this tree
                    length,
                    /// Per-node [node props](#common.NodeProp) to associate with this node.
                    props
                ) {
                    this.type = type;
                    this.children = children;
                    this.positions = positions;
                    this.length = length;
                    /// @internal
                    this.props = null;
                    if (props && props.length) {
                        this.props = Object.create(null);
                        for (let [prop, value] of props)
                            this.props[
                                typeof prop == "number" ? prop : prop.id
                            ] = value;
                    }
                }
                /// @internal
                toString() {
                    let mounted = this.prop(dist_NodeProp.mounted);
                    if (mounted && !mounted.overlay)
                        return mounted.tree.toString();
                    let children = "";
                    for (let ch of this.children) {
                        let str = ch.toString();
                        if (str) {
                            if (children) children += ",";
                            children += str;
                        }
                    }
                    return !this.type.name
                        ? children
                        : (/\W/.test(this.type.name) && !this.type.isError
                              ? JSON.stringify(this.type.name)
                              : this.type.name) +
                              (children.length ? "(" + children + ")" : "");
                }
                /// Get a [tree cursor](#common.TreeCursor) positioned at the top of
                /// the tree. Mode can be used to [control](#common.IterMode) which
                /// nodes the cursor visits.
                cursor(mode = 0) {
                    return new TreeCursor(this.topNode, mode);
                }
                /// Get a [tree cursor](#common.TreeCursor) pointing into this tree
                /// at the given position and side (see
                /// [`moveTo`](#common.TreeCursor.moveTo).
                cursorAt(pos, side = 0, mode = 0) {
                    let scope = CachedNode.get(this) || this.topNode;
                    let cursor = new TreeCursor(scope);
                    cursor.moveTo(pos, side);
                    CachedNode.set(this, cursor._tree);
                    return cursor;
                }
                /// Get a [syntax node](#common.SyntaxNode) object for the top of the
                /// tree.
                get topNode() {
                    return new TreeNode(this, 0, 0, null);
                }
                /// Get the [syntax node](#common.SyntaxNode) at the given position.
                /// If `side` is -1, this will move into nodes that end at the
                /// position. If 1, it'll move into nodes that start at the
                /// position. With 0, it'll only enter nodes that cover the position
                /// from both sides.
                resolve(pos, side = 0) {
                    let node = resolveNode(
                        CachedNode.get(this) || this.topNode,
                        pos,
                        side,
                        false
                    );
                    CachedNode.set(this, node);
                    return node;
                }
                /// Like [`resolve`](#common.Tree.resolve), but will enter
                /// [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
                /// pointing into the innermost overlaid tree at the given position
                /// (with parent links going through all parent structure, including
                /// the host trees).
                resolveInner(pos, side = 0) {
                    let node = resolveNode(
                        CachedInnerNode.get(this) || this.topNode,
                        pos,
                        side,
                        true
                    );
                    CachedInnerNode.set(this, node);
                    return node;
                }
                /// Iterate over the tree and its children, calling `enter` for any
                /// node that touches the `from`/`to` region (if given) before
                /// running over such a node's children, and `leave` (if given) when
                /// leaving the node. When `enter` returns `false`, that node will
                /// not have its children iterated over (or `leave` called).
                iterate(spec) {
                    let { enter, leave, from = 0, to = this.length } = spec;
                    for (
                        let c = this.cursor(
                            (spec.mode || 0) | IterMode.IncludeAnonymous
                        );
                        ;

                    ) {
                        let entered = false;
                        if (
                            c.from <= to &&
                            c.to >= from &&
                            (c.type.isAnonymous || enter(c) !== false)
                        ) {
                            if (c.firstChild()) continue;
                            entered = true;
                        }
                        for (;;) {
                            if (entered && leave && !c.type.isAnonymous)
                                leave(c);
                            if (c.nextSibling()) break;
                            if (!c.parent()) return;
                            entered = true;
                        }
                    }
                }
                /// Get the value of the given [node prop](#common.NodeProp) for this
                /// node. Works with both per-node and per-type props.
                prop(prop) {
                    return !prop.perNode
                        ? this.type.prop(prop)
                        : this.props
                        ? this.props[prop.id]
                        : undefined;
                }
                /// Returns the node's [per-node props](#common.NodeProp.perNode) in a
                /// format that can be passed to the [`Tree`](#common.Tree)
                /// constructor.
                get propValues() {
                    let result = [];
                    if (this.props)
                        for (let id in this.props)
                            result.push([+id, this.props[id]]);
                    return result;
                }
                /// Balance the direct children of this tree, producing a copy of
                /// which may have children grouped into subtrees with type
                /// [`NodeType.none`](#common.NodeType^none).
                balance(config = {}) {
                    return this.children.length <= 8 /* BranchFactor */
                        ? this
                        : balanceRange(
                              dist_NodeType.none,
                              this.children,
                              this.positions,
                              0,
                              this.children.length,
                              0,
                              this.length,
                              (children, positions, length) =>
                                  new dist_Tree(
                                      this.type,
                                      children,
                                      positions,
                                      length,
                                      this.propValues
                                  ),
                              config.makeTree ||
                                  ((children, positions, length) =>
                                      new dist_Tree(
                                          dist_NodeType.none,
                                          children,
                                          positions,
                                          length
                                      ))
                          );
                }
                /// Build a tree from a postfix-ordered buffer of node information,
                /// or a cursor over such a buffer.
                static build(data) {
                    return buildTree(data);
                }
            }
            /// The empty tree
            dist_Tree.empty = new dist_Tree(dist_NodeType.none, [], [], 0);
            class FlatBufferCursor {
                constructor(buffer, index) {
                    this.buffer = buffer;
                    this.index = index;
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
            /// Tree buffers contain (type, start, end, endIndex) quads for each
            /// node. In such a buffer, nodes are stored in prefix order (parents
            /// before children, with the endIndex of the parent indicating which
            /// children belong to it)
            class TreeBuffer {
                /// Create a tree buffer.
                constructor(
                    /// The buffer's content.
                    buffer,
                    /// The total length of the group of nodes in the buffer.
                    length,
                    /// The node set used in this buffer.
                    set
                ) {
                    this.buffer = buffer;
                    this.length = length;
                    this.set = set;
                }
                /// @internal
                get type() {
                    return dist_NodeType.none;
                }
                /// @internal
                toString() {
                    let result = [];
                    for (let index = 0; index < this.buffer.length; ) {
                        result.push(this.childString(index));
                        index = this.buffer[index + 3];
                    }
                    return result.join(",");
                }
                /// @internal
                childString(index) {
                    let id = this.buffer[index],
                        endIndex = this.buffer[index + 3];
                    let type = this.set.types[id],
                        result = type.name;
                    if (/\W/.test(result) && !type.isError)
                        result = JSON.stringify(result);
                    index += 4;
                    if (endIndex == index) return result;
                    let children = [];
                    while (index < endIndex) {
                        children.push(this.childString(index));
                        index = this.buffer[index + 3];
                    }
                    return result + "(" + children.join(",") + ")";
                }
                /// @internal
                findChild(startIndex, endIndex, dir, pos, side) {
                    let { buffer } = this,
                        pick = -1;
                    for (let i = startIndex; i != endIndex; i = buffer[i + 3]) {
                        if (
                            checkSide(side, pos, buffer[i + 1], buffer[i + 2])
                        ) {
                            pick = i;
                            if (dir > 0) break;
                        }
                    }
                    return pick;
                }
                /// @internal
                slice(startI, endI, from, to) {
                    let b = this.buffer;
                    let copy = new Uint16Array(endI - startI);
                    for (let i = startI, j = 0; i < endI; ) {
                        copy[j++] = b[i++];
                        copy[j++] = b[i++] - from;
                        copy[j++] = b[i++] - from;
                        copy[j++] = b[i++] - startI;
                    }
                    return new TreeBuffer(copy, to - from, this.set);
                }
            }
            function checkSide(side, pos, from, to) {
                switch (side) {
                    case -2 /* Before */:
                        return from < pos;
                    case -1 /* AtOrBefore */:
                        return to >= pos && from < pos;
                    case 0 /* Around */:
                        return from < pos && to > pos;
                    case 1 /* AtOrAfter */:
                        return from <= pos && to > pos;
                    case 2 /* After */:
                        return to > pos;
                    case 4 /* DontCare */:
                        return true;
                }
            }
            function enterUnfinishedNodesBefore(node, pos) {
                let scan = node.childBefore(pos);
                while (scan) {
                    let last = scan.lastChild;
                    if (!last || last.to != scan.to) break;
                    if (last.type.isError && last.from == last.to) {
                        node = scan;
                        scan = last.prevSibling;
                    } else {
                        scan = last;
                    }
                }
                return node;
            }
            function resolveNode(node, pos, side, overlays) {
                var _a;
                // Move up to a node that actually holds the position, if possible
                while (
                    node.from == node.to ||
                    (side < 1 ? node.from >= pos : node.from > pos) ||
                    (side > -1 ? node.to <= pos : node.to < pos)
                ) {
                    let parent =
                        !overlays && node instanceof TreeNode && node.index < 0
                            ? null
                            : node.parent;
                    if (!parent) return node;
                    node = parent;
                }
                let mode = overlays ? 0 : IterMode.IgnoreOverlays;
                // Must go up out of overlays when those do not overlap with pos
                if (overlays)
                    for (
                        let scan = node, parent = scan.parent;
                        parent;
                        scan = parent, parent = scan.parent
                    ) {
                        if (
                            scan instanceof TreeNode &&
                            scan.index < 0 &&
                            ((_a = parent.enter(pos, side, mode)) === null ||
                            _a === void 0
                                ? void 0
                                : _a.from) != scan.from
                        )
                            node = parent;
                    }
                for (;;) {
                    let inner = node.enter(pos, side, mode);
                    if (!inner) return node;
                    node = inner;
                }
            }
            class TreeNode {
                constructor(
                    _tree,
                    from,
                    // Index in parent node, set to -1 if the node is not a direct child of _parent.node (overlay)
                    index,
                    _parent
                ) {
                    this._tree = _tree;
                    this.from = from;
                    this.index = index;
                    this._parent = _parent;
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
                    for (let parent = this; ; ) {
                        for (
                            let { children, positions } = parent._tree,
                                e = dir > 0 ? children.length : -1;
                            i != e;
                            i += dir
                        ) {
                            let next = children[i],
                                start = positions[i] + parent.from;
                            if (
                                !checkSide(
                                    side,
                                    pos,
                                    start,
                                    start + next.length
                                )
                            )
                                continue;
                            if (next instanceof TreeBuffer) {
                                if (mode & IterMode.ExcludeBuffers) continue;
                                let index = next.findChild(
                                    0,
                                    next.buffer.length,
                                    dir,
                                    pos - start,
                                    side
                                );
                                if (index > -1)
                                    return new BufferNode(
                                        new BufferContext(
                                            parent,
                                            next,
                                            i,
                                            start
                                        ),
                                        null,
                                        index
                                    );
                            } else if (
                                mode & IterMode.IncludeAnonymous ||
                                !next.type.isAnonymous ||
                                hasChild(next)
                            ) {
                                let mounted;
                                if (
                                    !(mode & IterMode.IgnoreMounts) &&
                                    next.props &&
                                    (mounted = next.prop(
                                        dist_NodeProp.mounted
                                    )) &&
                                    !mounted.overlay
                                )
                                    return new TreeNode(
                                        mounted.tree,
                                        start,
                                        i,
                                        parent
                                    );
                                let inner = new TreeNode(
                                    next,
                                    start,
                                    i,
                                    parent
                                );
                                return mode & IterMode.IncludeAnonymous ||
                                    !inner.type.isAnonymous
                                    ? inner
                                    : inner.nextChild(
                                          dir < 0
                                              ? next.children.length - 1
                                              : 0,
                                          dir,
                                          pos,
                                          side
                                      );
                            }
                        }
                        if (
                            mode & IterMode.IncludeAnonymous ||
                            !parent.type.isAnonymous
                        )
                            return null;
                        if (parent.index >= 0) i = parent.index + dir;
                        else
                            i =
                                dir < 0
                                    ? -1
                                    : parent._parent._tree.children.length;
                        parent = parent._parent;
                        if (!parent) return null;
                    }
                }
                get firstChild() {
                    return this.nextChild(0, 1, 0, 4 /* DontCare */);
                }
                get lastChild() {
                    return this.nextChild(
                        this._tree.children.length - 1,
                        -1,
                        0,
                        4 /* DontCare */
                    );
                }
                childAfter(pos) {
                    return this.nextChild(0, 1, pos, 2 /* After */);
                }
                childBefore(pos) {
                    return this.nextChild(
                        this._tree.children.length - 1,
                        -1,
                        pos,
                        -2 /* Before */
                    );
                }
                enter(pos, side, mode = 0) {
                    let mounted;
                    if (
                        !(mode & IterMode.IgnoreOverlays) &&
                        (mounted = this._tree.prop(dist_NodeProp.mounted)) &&
                        mounted.overlay
                    ) {
                        let rPos = pos - this.from;
                        for (let { from, to } of mounted.overlay) {
                            if (
                                (side > 0 ? from <= rPos : from < rPos) &&
                                (side < 0 ? to >= rPos : to > rPos)
                            )
                                return new TreeNode(
                                    mounted.tree,
                                    mounted.overlay[0].from + this.from,
                                    -1,
                                    this
                                );
                        }
                    }
                    return this.nextChild(0, 1, pos, side, mode);
                }
                nextSignificantParent() {
                    let val = this;
                    while (val.type.isAnonymous && val._parent)
                        val = val._parent;
                    return val;
                }
                get parent() {
                    return this._parent
                        ? this._parent.nextSignificantParent()
                        : null;
                }
                get nextSibling() {
                    return this._parent && this.index >= 0
                        ? this._parent.nextChild(
                              this.index + 1,
                              1,
                              0,
                              4 /* DontCare */
                          )
                        : null;
                }
                get prevSibling() {
                    return this._parent && this.index >= 0
                        ? this._parent.nextChild(
                              this.index - 1,
                              -1,
                              0,
                              4 /* DontCare */
                          )
                        : null;
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
                    return resolveNode(this, pos, side, false);
                }
                resolveInner(pos, side = 0) {
                    return resolveNode(this, pos, side, true);
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
                /// @internal
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
                let cur = node.cursor(),
                    result = [];
                if (!cur.firstChild()) return result;
                if (before != null)
                    while (!cur.type.is(before))
                        if (!cur.nextSibling()) return result;
                for (;;) {
                    if (after != null && cur.type.is(after)) return result;
                    if (cur.type.is(type)) result.push(cur.node);
                    if (!cur.nextSibling()) return after == null ? result : [];
                }
            }
            function matchNodeContext(node, context, i = context.length - 1) {
                for (let p = node.parent; i >= 0; p = p.parent) {
                    if (!p) return false;
                    if (!p.type.isAnonymous) {
                        if (context[i] && context[i] != p.name) return false;
                        i--;
                    }
                }
                return true;
            }
            class BufferContext {
                constructor(parent, buffer, index, start) {
                    this.parent = parent;
                    this.buffer = buffer;
                    this.index = index;
                    this.start = start;
                }
            }
            class BufferNode {
                constructor(context, _parent, index) {
                    this.context = context;
                    this._parent = _parent;
                    this.index = index;
                    this.type =
                        context.buffer.set.types[context.buffer.buffer[index]];
                }
                get name() {
                    return this.type.name;
                }
                get from() {
                    return (
                        this.context.start +
                        this.context.buffer.buffer[this.index + 1]
                    );
                }
                get to() {
                    return (
                        this.context.start +
                        this.context.buffer.buffer[this.index + 2]
                    );
                }
                child(dir, pos, side) {
                    let { buffer } = this.context;
                    let index = buffer.findChild(
                        this.index + 4,
                        buffer.buffer[this.index + 3],
                        dir,
                        pos - this.context.start,
                        side
                    );
                    return index < 0
                        ? null
                        : new BufferNode(this.context, this, index);
                }
                get firstChild() {
                    return this.child(1, 0, 4 /* DontCare */);
                }
                get lastChild() {
                    return this.child(-1, 0, 4 /* DontCare */);
                }
                childAfter(pos) {
                    return this.child(1, pos, 2 /* After */);
                }
                childBefore(pos) {
                    return this.child(-1, pos, -2 /* Before */);
                }
                enter(pos, side, mode = 0) {
                    if (mode & IterMode.ExcludeBuffers) return null;
                    let { buffer } = this.context;
                    let index = buffer.findChild(
                        this.index + 4,
                        buffer.buffer[this.index + 3],
                        side > 0 ? 1 : -1,
                        pos - this.context.start,
                        side
                    );
                    return index < 0
                        ? null
                        : new BufferNode(this.context, this, index);
                }
                get parent() {
                    return (
                        this._parent ||
                        this.context.parent.nextSignificantParent()
                    );
                }
                externalSibling(dir) {
                    return this._parent
                        ? null
                        : this.context.parent.nextChild(
                              this.context.index + dir,
                              dir,
                              0,
                              4 /* DontCare */
                          );
                }
                get nextSibling() {
                    let { buffer } = this.context;
                    let after = buffer.buffer[this.index + 3];
                    if (
                        after <
                        (this._parent
                            ? buffer.buffer[this._parent.index + 3]
                            : buffer.buffer.length)
                    )
                        return new BufferNode(
                            this.context,
                            this._parent,
                            after
                        );
                    return this.externalSibling(1);
                }
                get prevSibling() {
                    let { buffer } = this.context;
                    let parentStart = this._parent ? this._parent.index + 4 : 0;
                    if (this.index == parentStart)
                        return this.externalSibling(-1);
                    return new BufferNode(
                        this.context,
                        this._parent,
                        buffer.findChild(
                            parentStart,
                            this.index,
                            -1,
                            0,
                            4 /* DontCare */
                        )
                    );
                }
                cursor(mode = 0) {
                    return new TreeCursor(this, mode);
                }
                get tree() {
                    return null;
                }
                toTree() {
                    let children = [],
                        positions = [];
                    let { buffer } = this.context;
                    let startI = this.index + 4,
                        endI = buffer.buffer[this.index + 3];
                    if (endI > startI) {
                        let from = buffer.buffer[this.index + 1],
                            to = buffer.buffer[this.index + 2];
                        children.push(buffer.slice(startI, endI, from, to));
                        positions.push(0);
                    }
                    return new dist_Tree(
                        this.type,
                        children,
                        positions,
                        this.to - this.from
                    );
                }
                resolve(pos, side = 0) {
                    return resolveNode(this, pos, side, false);
                }
                resolveInner(pos, side = 0) {
                    return resolveNode(this, pos, side, true);
                }
                enterUnfinishedNodesBefore(pos) {
                    return enterUnfinishedNodesBefore(this, pos);
                }
                /// @internal
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
            /// A tree cursor object focuses on a given node in a syntax tree, and
            /// allows you to move to adjacent nodes.
            class TreeCursor {
                /// @internal
                constructor(
                    node,
                    /// @internal
                    mode = 0
                ) {
                    this.mode = mode;
                    /// @internal
                    this.buffer = null;
                    this.stack = [];
                    /// @internal
                    this.index = 0;
                    this.bufferNode = null;
                    if (node instanceof TreeNode) {
                        this.yieldNode(node);
                    } else {
                        this._tree = node.context.parent;
                        this.buffer = node.context;
                        for (let n = node._parent; n; n = n._parent)
                            this.stack.unshift(n.index);
                        this.bufferNode = node;
                        this.yieldBuf(node.index);
                    }
                }
                /// Shorthand for `.type.name`.
                get name() {
                    return this.type.name;
                }
                yieldNode(node) {
                    if (!node) return false;
                    this._tree = node;
                    this.type = node.type;
                    this.from = node.from;
                    this.to = node.to;
                    return true;
                }
                yieldBuf(index, type) {
                    this.index = index;
                    let { start, buffer } = this.buffer;
                    this.type = type || buffer.set.types[buffer.buffer[index]];
                    this.from = start + buffer.buffer[index + 1];
                    this.to = start + buffer.buffer[index + 2];
                    return true;
                }
                yield(node) {
                    if (!node) return false;
                    if (node instanceof TreeNode) {
                        this.buffer = null;
                        return this.yieldNode(node);
                    }
                    this.buffer = node.context;
                    return this.yieldBuf(node.index, node.type);
                }
                /// @internal
                toString() {
                    return this.buffer
                        ? this.buffer.buffer.childString(this.index)
                        : this._tree.toString();
                }
                /// @internal
                enterChild(dir, pos, side) {
                    if (!this.buffer)
                        return this.yield(
                            this._tree.nextChild(
                                dir < 0
                                    ? this._tree._tree.children.length - 1
                                    : 0,
                                dir,
                                pos,
                                side,
                                this.mode
                            )
                        );
                    let { buffer } = this.buffer;
                    let index = buffer.findChild(
                        this.index + 4,
                        buffer.buffer[this.index + 3],
                        dir,
                        pos - this.buffer.start,
                        side
                    );
                    if (index < 0) return false;
                    this.stack.push(this.index);
                    return this.yieldBuf(index);
                }
                /// Move the cursor to this node's first child. When this returns
                /// false, the node has no child, and the cursor has not been moved.
                firstChild() {
                    return this.enterChild(1, 0, 4 /* DontCare */);
                }
                /// Move the cursor to this node's last child.
                lastChild() {
                    return this.enterChild(-1, 0, 4 /* DontCare */);
                }
                /// Move the cursor to the first child that ends after `pos`.
                childAfter(pos) {
                    return this.enterChild(1, pos, 2 /* After */);
                }
                /// Move to the last child that starts before `pos`.
                childBefore(pos) {
                    return this.enterChild(-1, pos, -2 /* Before */);
                }
                /// Move the cursor to the child around `pos`. If side is -1 the
                /// child may end at that position, when 1 it may start there. This
                /// will also enter [overlaid](#common.MountedTree.overlay)
                /// [mounted](#common.NodeProp^mounted) trees unless `overlays` is
                /// set to false.
                enter(pos, side, mode = this.mode) {
                    if (!this.buffer)
                        return this.yield(this._tree.enter(pos, side, mode));
                    return mode & IterMode.ExcludeBuffers
                        ? false
                        : this.enterChild(1, pos, side);
                }
                /// Move to the node's parent node, if this isn't the top node.
                parent() {
                    if (!this.buffer)
                        return this.yieldNode(
                            this.mode & IterMode.IncludeAnonymous
                                ? this._tree._parent
                                : this._tree.parent
                        );
                    if (this.stack.length)
                        return this.yieldBuf(this.stack.pop());
                    let parent =
                        this.mode & IterMode.IncludeAnonymous
                            ? this.buffer.parent
                            : this.buffer.parent.nextSignificantParent();
                    this.buffer = null;
                    return this.yieldNode(parent);
                }
                /// @internal
                sibling(dir) {
                    if (!this.buffer)
                        return !this._tree._parent
                            ? false
                            : this.yield(
                                  this._tree.index < 0
                                      ? null
                                      : this._tree._parent.nextChild(
                                            this._tree.index + dir,
                                            dir,
                                            0,
                                            4 /* DontCare */,
                                            this.mode
                                        )
                              );
                    let { buffer } = this.buffer,
                        d = this.stack.length - 1;
                    if (dir < 0) {
                        let parentStart = d < 0 ? 0 : this.stack[d] + 4;
                        if (this.index != parentStart)
                            return this.yieldBuf(
                                buffer.findChild(
                                    parentStart,
                                    this.index,
                                    -1,
                                    0,
                                    4 /* DontCare */
                                )
                            );
                    } else {
                        let after = buffer.buffer[this.index + 3];
                        if (
                            after <
                            (d < 0
                                ? buffer.buffer.length
                                : buffer.buffer[this.stack[d] + 3])
                        )
                            return this.yieldBuf(after);
                    }
                    return d < 0
                        ? this.yield(
                              this.buffer.parent.nextChild(
                                  this.buffer.index + dir,
                                  dir,
                                  0,
                                  4 /* DontCare */,
                                  this.mode
                              )
                          )
                        : false;
                }
                /// Move to this node's next sibling, if any.
                nextSibling() {
                    return this.sibling(1);
                }
                /// Move to this node's previous sibling, if any.
                prevSibling() {
                    return this.sibling(-1);
                }
                atLastNode(dir) {
                    let index,
                        parent,
                        { buffer } = this;
                    if (buffer) {
                        if (dir > 0) {
                            if (this.index < buffer.buffer.buffer.length)
                                return false;
                        } else {
                            for (let i = 0; i < this.index; i++)
                                if (buffer.buffer.buffer[i + 3] < this.index)
                                    return false;
                        }
                        ({ index, parent } = buffer);
                    } else {
                        ({ index, _parent: parent } = this._tree);
                    }
                    for (; parent; { index, _parent: parent } = parent) {
                        if (index > -1)
                            for (
                                let i = index + dir,
                                    e =
                                        dir < 0
                                            ? -1
                                            : parent._tree.children.length;
                                i != e;
                                i += dir
                            ) {
                                let child = parent._tree.children[i];
                                if (
                                    this.mode & IterMode.IncludeAnonymous ||
                                    child instanceof TreeBuffer ||
                                    !child.type.isAnonymous ||
                                    hasChild(child)
                                )
                                    return false;
                            }
                    }
                    return true;
                }
                move(dir, enter) {
                    if (enter && this.enterChild(dir, 0, 4 /* DontCare */))
                        return true;
                    for (;;) {
                        if (this.sibling(dir)) return true;
                        if (this.atLastNode(dir) || !this.parent())
                            return false;
                    }
                }
                /// Move to the next node in a
                /// [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order_(NLR))
                /// traversal, going from a node to its first child or, if the
                /// current node is empty or `enter` is false, its next sibling or
                /// the next sibling of the first parent node that has one.
                next(enter = true) {
                    return this.move(1, enter);
                }
                /// Move to the next node in a last-to-first pre-order traveral. A
                /// node is followed by its last child or, if it has none, its
                /// previous sibling or the previous sibling of the first parent
                /// node that has one.
                prev(enter = true) {
                    return this.move(-1, enter);
                }
                /// Move the cursor to the innermost node that covers `pos`. If
                /// `side` is -1, it will enter nodes that end at `pos`. If it is 1,
                /// it will enter nodes that start at `pos`.
                moveTo(pos, side = 0) {
                    // Move up to a node that actually holds the position, if possible
                    while (
                        this.from == this.to ||
                        (side < 1 ? this.from >= pos : this.from > pos) ||
                        (side > -1 ? this.to <= pos : this.to < pos)
                    )
                        if (!this.parent()) break;
                    // Then scan down into child nodes as far as possible
                    while (this.enterChild(1, pos, side)) {}
                    return this;
                }
                /// Get a [syntax node](#common.SyntaxNode) at the cursor's current
                /// position.
                get node() {
                    if (!this.buffer) return this._tree;
                    let cache = this.bufferNode,
                        result = null,
                        depth = 0;
                    if (cache && cache.context == this.buffer) {
                        scan: for (
                            let index = this.index, d = this.stack.length;
                            d >= 0;

                        ) {
                            for (let c = cache; c; c = c._parent)
                                if (c.index == index) {
                                    if (index == this.index) return c;
                                    result = c;
                                    depth = d + 1;
                                    break scan;
                                }
                            index = this.stack[--d];
                        }
                    }
                    for (let i = depth; i < this.stack.length; i++)
                        result = new BufferNode(
                            this.buffer,
                            result,
                            this.stack[i]
                        );
                    return (this.bufferNode = new BufferNode(
                        this.buffer,
                        result,
                        this.index
                    ));
                }
                /// Get the [tree](#common.Tree) that represents the current node, if
                /// any. Will return null when the node is in a [tree
                /// buffer](#common.TreeBuffer).
                get tree() {
                    return this.buffer ? null : this._tree._tree;
                }
                /// Iterate over the current node and all its descendants, calling
                /// `enter` when entering a node and `leave`, if given, when leaving
                /// one. When `enter` returns `false`, any children of that node are
                /// skipped, and `leave` isn't called for it.
                iterate(enter, leave) {
                    for (let depth = 0; ; ) {
                        let mustLeave = false;
                        if (this.type.isAnonymous || enter(this) !== false) {
                            if (this.firstChild()) {
                                depth++;
                                continue;
                            }
                            if (!this.type.isAnonymous) mustLeave = true;
                        }
                        for (;;) {
                            if (mustLeave && leave) leave(this);
                            mustLeave = this.type.isAnonymous;
                            if (this.nextSibling()) break;
                            if (!depth) return;
                            this.parent();
                            depth--;
                            mustLeave = true;
                        }
                    }
                }
                /// Test whether the current node matches a given context—a sequence
                /// of direct parent node names. Empty strings in the context array
                /// are treated as wildcards.
                matchContext(context) {
                    if (!this.buffer)
                        return matchNodeContext(this.node, context);
                    let { buffer } = this.buffer,
                        { types } = buffer.set;
                    for (
                        let i = context.length - 1, d = this.stack.length - 1;
                        i >= 0;
                        d--
                    ) {
                        if (d < 0)
                            return matchNodeContext(this.node, context, i);
                        let type = types[buffer.buffer[this.stack[d]]];
                        if (!type.isAnonymous) {
                            if (context[i] && context[i] != type.name)
                                return false;
                            i--;
                        }
                    }
                    return true;
                }
            }
            function hasChild(tree) {
                return tree.children.some(
                    (ch) =>
                        ch instanceof TreeBuffer ||
                        !ch.type.isAnonymous ||
                        hasChild(ch)
                );
            }
            function buildTree(data) {
                var _a;
                let {
                    buffer,
                    nodeSet,
                    maxBufferLength = DefaultBufferLength,
                    reused = [],
                    minRepeatType = nodeSet.types.length,
                } = data;
                let cursor = Array.isArray(buffer)
                    ? new FlatBufferCursor(buffer, buffer.length)
                    : buffer;
                let types = nodeSet.types;
                let contextHash = 0,
                    lookAhead = 0;
                function takeNode(
                    parentStart,
                    minPos,
                    children,
                    positions,
                    inRepeat
                ) {
                    let { id, start, end, size } = cursor;
                    let lookAheadAtStart = lookAhead;
                    while (size < 0) {
                        cursor.next();
                        if (size == -1 /* Reuse */) {
                            let node = reused[id];
                            children.push(node);
                            positions.push(start - parentStart);
                            return;
                        } else if (size == -3 /* ContextChange */) {
                            // Context change
                            contextHash = id;
                            return;
                        } else if (size == -4 /* LookAhead */) {
                            lookAhead = id;
                            return;
                        } else {
                            throw new RangeError(
                                `Unrecognized record size: ${size}`
                            );
                        }
                    }
                    let type = types[id],
                        node,
                        buffer;
                    let startPos = start - parentStart;
                    if (
                        end - start <= maxBufferLength &&
                        (buffer = findBufferSize(cursor.pos - minPos, inRepeat))
                    ) {
                        // Small enough for a buffer, and no reused nodes inside
                        let data = new Uint16Array(buffer.size - buffer.skip);
                        let endPos = cursor.pos - buffer.size,
                            index = data.length;
                        while (cursor.pos > endPos)
                            index = copyToBuffer(buffer.start, data, index);
                        node = new TreeBuffer(
                            data,
                            end - buffer.start,
                            nodeSet
                        );
                        startPos = buffer.start - parentStart;
                    } else {
                        // Make it a node
                        let endPos = cursor.pos - size;
                        cursor.next();
                        let localChildren = [],
                            localPositions = [];
                        let localInRepeat = id >= minRepeatType ? id : -1;
                        let lastGroup = 0,
                            lastEnd = end;
                        while (cursor.pos > endPos) {
                            if (
                                localInRepeat >= 0 &&
                                cursor.id == localInRepeat &&
                                cursor.size >= 0
                            ) {
                                if (cursor.end <= lastEnd - maxBufferLength) {
                                    makeRepeatLeaf(
                                        localChildren,
                                        localPositions,
                                        start,
                                        lastGroup,
                                        cursor.end,
                                        lastEnd,
                                        localInRepeat,
                                        lookAheadAtStart
                                    );
                                    lastGroup = localChildren.length;
                                    lastEnd = cursor.end;
                                }
                                cursor.next();
                            } else {
                                takeNode(
                                    start,
                                    endPos,
                                    localChildren,
                                    localPositions,
                                    localInRepeat
                                );
                            }
                        }
                        if (
                            localInRepeat >= 0 &&
                            lastGroup > 0 &&
                            lastGroup < localChildren.length
                        )
                            makeRepeatLeaf(
                                localChildren,
                                localPositions,
                                start,
                                lastGroup,
                                start,
                                lastEnd,
                                localInRepeat,
                                lookAheadAtStart
                            );
                        localChildren.reverse();
                        localPositions.reverse();
                        if (localInRepeat > -1 && lastGroup > 0) {
                            let make = makeBalanced(type);
                            node = balanceRange(
                                type,
                                localChildren,
                                localPositions,
                                0,
                                localChildren.length,
                                0,
                                end - start,
                                make,
                                make
                            );
                        } else {
                            node = makeTree(
                                type,
                                localChildren,
                                localPositions,
                                end - start,
                                lookAheadAtStart - end
                            );
                        }
                    }
                    children.push(node);
                    positions.push(startPos);
                }
                function makeBalanced(type) {
                    return (children, positions, length) => {
                        let lookAhead = 0,
                            lastI = children.length - 1,
                            last,
                            lookAheadProp;
                        if (
                            lastI >= 0 &&
                            (last = children[lastI]) instanceof dist_Tree
                        ) {
                            if (
                                !lastI &&
                                last.type == type &&
                                last.length == length
                            )
                                return last;
                            if (
                                (lookAheadProp = last.prop(
                                    dist_NodeProp.lookAhead
                                ))
                            )
                                lookAhead =
                                    positions[lastI] +
                                    last.length +
                                    lookAheadProp;
                        }
                        return makeTree(
                            type,
                            children,
                            positions,
                            length,
                            lookAhead
                        );
                    };
                }
                function makeRepeatLeaf(
                    children,
                    positions,
                    base,
                    i,
                    from,
                    to,
                    type,
                    lookAhead
                ) {
                    let localChildren = [],
                        localPositions = [];
                    while (children.length > i) {
                        localChildren.push(children.pop());
                        localPositions.push(positions.pop() + base - from);
                    }
                    children.push(
                        makeTree(
                            nodeSet.types[type],
                            localChildren,
                            localPositions,
                            to - from,
                            lookAhead - to
                        )
                    );
                    positions.push(from - base);
                }
                function makeTree(
                    type,
                    children,
                    positions,
                    length,
                    lookAhead = 0,
                    props
                ) {
                    if (contextHash) {
                        let pair = [dist_NodeProp.contextHash, contextHash];
                        props = props ? [pair].concat(props) : [pair];
                    }
                    if (lookAhead > 25) {
                        let pair = [dist_NodeProp.lookAhead, lookAhead];
                        props = props ? [pair].concat(props) : [pair];
                    }
                    return new dist_Tree(
                        type,
                        children,
                        positions,
                        length,
                        props
                    );
                }
                function findBufferSize(maxSize, inRepeat) {
                    // Scan through the buffer to find previous siblings that fit
                    // together in a TreeBuffer, and don't contain any reused nodes
                    // (which can't be stored in a buffer).
                    // If `inRepeat` is > -1, ignore node boundaries of that type for
                    // nesting, but make sure the end falls either at the start
                    // (`maxSize`) or before such a node.
                    let fork = cursor.fork();
                    let size = 0,
                        start = 0,
                        skip = 0,
                        minStart = fork.end - maxBufferLength;
                    let result = { size: 0, start: 0, skip: 0 };
                    scan: for (
                        let minPos = fork.pos - maxSize;
                        fork.pos > minPos;

                    ) {
                        let nodeSize = fork.size;
                        // Pretend nested repeat nodes of the same type don't exist
                        if (fork.id == inRepeat && nodeSize >= 0) {
                            // Except that we store the current state as a valid return
                            // value.
                            result.size = size;
                            result.start = start;
                            result.skip = skip;
                            skip += 4;
                            size += 4;
                            fork.next();
                            continue;
                        }
                        let startPos = fork.pos - nodeSize;
                        if (
                            nodeSize < 0 ||
                            startPos < minPos ||
                            fork.start < minStart
                        )
                            break;
                        let localSkipped = fork.id >= minRepeatType ? 4 : 0;
                        let nodeStart = fork.start;
                        fork.next();
                        while (fork.pos > startPos) {
                            if (fork.size < 0) {
                                if (fork.size == -3 /* ContextChange */)
                                    localSkipped += 4;
                                else break scan;
                            } else if (fork.id >= minRepeatType) {
                                localSkipped += 4;
                            }
                            fork.next();
                        }
                        start = nodeStart;
                        size += nodeSize;
                        skip += localSkipped;
                    }
                    if (inRepeat < 0 || size == maxSize) {
                        result.size = size;
                        result.start = start;
                        result.skip = skip;
                    }
                    return result.size > 4 ? result : undefined;
                }
                function copyToBuffer(bufferStart, buffer, index) {
                    let { id, start, end, size } = cursor;
                    cursor.next();
                    if (size >= 0 && id < minRepeatType) {
                        let startIndex = index;
                        if (size > 4) {
                            let endPos = cursor.pos - (size - 4);
                            while (cursor.pos > endPos)
                                index = copyToBuffer(
                                    bufferStart,
                                    buffer,
                                    index
                                );
                        }
                        buffer[--index] = startIndex;
                        buffer[--index] = end - bufferStart;
                        buffer[--index] = start - bufferStart;
                        buffer[--index] = id;
                    } else if (size == -3 /* ContextChange */) {
                        contextHash = id;
                    } else if (size == -4 /* LookAhead */) {
                        lookAhead = id;
                    }
                    return index;
                }
                let children = [],
                    positions = [];
                while (cursor.pos > 0)
                    takeNode(
                        data.start || 0,
                        data.bufferStart || 0,
                        children,
                        positions,
                        -1
                    );
                let length =
                    (_a = data.length) !== null && _a !== void 0
                        ? _a
                        : children.length
                        ? positions[0] + children[0].length
                        : 0;
                return new dist_Tree(
                    types[data.topID],
                    children.reverse(),
                    positions.reverse(),
                    length
                );
            }
            const nodeSizeCache = new WeakMap();
            function nodeSize(balanceType, node) {
                if (
                    !balanceType.isAnonymous ||
                    node instanceof TreeBuffer ||
                    node.type != balanceType
                )
                    return 1;
                let size = nodeSizeCache.get(node);
                if (size == null) {
                    size = 1;
                    for (let child of node.children) {
                        if (
                            child.type != balanceType ||
                            !(child instanceof dist_Tree)
                        ) {
                            size = 1;
                            break;
                        }
                        size += nodeSize(balanceType, child);
                    }
                    nodeSizeCache.set(node, size);
                }
                return size;
            }
            function balanceRange(
                // The type the balanced tree's inner nodes.
                balanceType,
                // The direct children and their positions
                children,
                positions,
                // The index range in children/positions to use
                from,
                to,
                // The start position of the nodes, relative to their parent.
                start,
                // Length of the outer node
                length,
                // Function to build the top node of the balanced tree
                mkTop,
                // Function to build internal nodes for the balanced tree
                mkTree
            ) {
                let total = 0;
                for (let i = from; i < to; i++)
                    total += nodeSize(balanceType, children[i]);
                let maxChild = Math.ceil((total * 1.5) / 8 /* BranchFactor */);
                let localChildren = [],
                    localPositions = [];
                function divide(children, positions, from, to, offset) {
                    for (let i = from; i < to; ) {
                        let groupFrom = i,
                            groupStart = positions[i],
                            groupSize = nodeSize(balanceType, children[i]);
                        i++;
                        for (; i < to; i++) {
                            let nextSize = nodeSize(balanceType, children[i]);
                            if (groupSize + nextSize >= maxChild) break;
                            groupSize += nextSize;
                        }
                        if (i == groupFrom + 1) {
                            if (groupSize > maxChild) {
                                let only = children[groupFrom]; // Only trees can have a size > 1
                                divide(
                                    only.children,
                                    only.positions,
                                    0,
                                    only.children.length,
                                    positions[groupFrom] + offset
                                );
                                continue;
                            }
                            localChildren.push(children[groupFrom]);
                        } else {
                            let length =
                                positions[i - 1] +
                                children[i - 1].length -
                                groupStart;
                            localChildren.push(
                                balanceRange(
                                    balanceType,
                                    children,
                                    positions,
                                    groupFrom,
                                    i,
                                    groupStart,
                                    length,
                                    null,
                                    mkTree
                                )
                            );
                        }
                        localPositions.push(groupStart + offset - start);
                    }
                }
                divide(children, positions, from, to, 0);
                return (mkTop || mkTree)(localChildren, localPositions, length);
            }
            /// Provides a way to associate values with pieces of trees. As long
            /// as that part of the tree is reused, the associated values can be
            /// retrieved from an updated tree.
            class NodeWeakMap {
                constructor() {
                    this.map = new WeakMap();
                }
                setBuffer(buffer, index, value) {
                    let inner = this.map.get(buffer);
                    if (!inner) this.map.set(buffer, (inner = new Map()));
                    inner.set(index, value);
                }
                getBuffer(buffer, index) {
                    let inner = this.map.get(buffer);
                    return inner && inner.get(index);
                }
                /// Set the value for this syntax node.
                set(node, value) {
                    if (node instanceof BufferNode)
                        this.setBuffer(node.context.buffer, node.index, value);
                    else if (node instanceof TreeNode)
                        this.map.set(node.tree, value);
                }
                /// Retrieve value for this syntax node, if it exists in the map.
                get(node) {
                    return node instanceof BufferNode
                        ? this.getBuffer(node.context.buffer, node.index)
                        : node instanceof TreeNode
                        ? this.map.get(node.tree)
                        : undefined;
                }
                /// Set the value for the node that a cursor currently points to.
                cursorSet(cursor, value) {
                    if (cursor.buffer)
                        this.setBuffer(
                            cursor.buffer.buffer,
                            cursor.index,
                            value
                        );
                    else this.map.set(cursor.tree, value);
                }
                /// Retrieve the value for the node that a cursor currently points
                /// to.
                cursorGet(cursor) {
                    return cursor.buffer
                        ? this.getBuffer(cursor.buffer.buffer, cursor.index)
                        : this.map.get(cursor.tree);
                }
            }

            /// Tree fragments are used during [incremental
            /// parsing](#common.Parser.startParse) to track parts of old trees
            /// that can be reused in a new parse. An array of fragments is used
            /// to track regions of an old tree whose nodes might be reused in new
            /// parses. Use the static
            /// [`applyChanges`](#common.TreeFragment^applyChanges) method to
            /// update fragments for document changes.
            class TreeFragment {
                /// Construct a tree fragment.
                constructor(
                    /// The start of the unchanged range pointed to by this fragment.
                    /// This refers to an offset in the _updated_ document (as opposed
                    /// to the original tree).
                    from,
                    /// The end of the unchanged range.
                    to,
                    /// The tree that this fragment is based on.
                    tree,
                    /// The offset between the fragment's tree and the document that
                    /// this fragment can be used against. Add this when going from
                    /// document to tree positions, subtract it to go from tree to
                    /// document positions.
                    offset,
                    openStart = false,
                    openEnd = false
                ) {
                    this.from = from;
                    this.to = to;
                    this.tree = tree;
                    this.offset = offset;
                    this.open =
                        (openStart ? 1 /* Start */ : 0) |
                        (openEnd ? 2 /* End */ : 0);
                }
                /// Whether the start of the fragment represents the start of a
                /// parse, or the end of a change. (In the second case, it may not
                /// be safe to reuse some nodes at the start, depending on the
                /// parsing algorithm.)
                get openStart() {
                    return (this.open & 1) /* Start */ > 0;
                }
                /// Whether the end of the fragment represents the end of a
                /// full-document parse, or the start of a change.
                get openEnd() {
                    return (this.open & 2) /* End */ > 0;
                }
                /// Create a set of fragments from a freshly parsed tree, or update
                /// an existing set of fragments by replacing the ones that overlap
                /// with a tree with content from the new tree. When `partial` is
                /// true, the parse is treated as incomplete, and the resulting
                /// fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
                /// true.
                static addTree(tree, fragments = [], partial = false) {
                    let result = [
                        new TreeFragment(
                            0,
                            tree.length,
                            tree,
                            0,
                            false,
                            partial
                        ),
                    ];
                    for (let f of fragments)
                        if (f.to > tree.length) result.push(f);
                    return result;
                }
                /// Apply a set of edits to an array of fragments, removing or
                /// splitting fragments as necessary to remove edited ranges, and
                /// adjusting offsets for fragments that moved.
                static applyChanges(fragments, changes, minGap = 128) {
                    if (!changes.length) return fragments;
                    let result = [];
                    let fI = 1,
                        nextF = fragments.length ? fragments[0] : null;
                    for (let cI = 0, pos = 0, off = 0; ; cI++) {
                        let nextC = cI < changes.length ? changes[cI] : null;
                        let nextPos = nextC ? nextC.fromA : 1e9;
                        if (nextPos - pos >= minGap)
                            while (nextF && nextF.from < nextPos) {
                                let cut = nextF;
                                if (
                                    pos >= cut.from ||
                                    nextPos <= cut.to ||
                                    off
                                ) {
                                    let fFrom = Math.max(cut.from, pos) - off,
                                        fTo = Math.min(cut.to, nextPos) - off;
                                    cut =
                                        fFrom >= fTo
                                            ? null
                                            : new TreeFragment(
                                                  fFrom,
                                                  fTo,
                                                  cut.tree,
                                                  cut.offset + off,
                                                  cI > 0,
                                                  !!nextC
                                              );
                                }
                                if (cut) result.push(cut);
                                if (nextF.to > nextPos) break;
                                nextF =
                                    fI < fragments.length
                                        ? fragments[fI++]
                                        : null;
                            }
                        if (!nextC) break;
                        pos = nextC.toA;
                        off = nextC.toA - nextC.toB;
                    }
                    return result;
                }
            }
            /// A superclass that parsers should extend.
            class dist_Parser {
                /// Start a parse, returning a [partial parse](#common.PartialParse)
                /// object. [`fragments`](#common.TreeFragment) can be passed in to
                /// make the parse incremental.
                ///
                /// By default, the entire input is parsed. You can pass `ranges`,
                /// which should be a sorted array of non-empty, non-overlapping
                /// ranges, to parse only those ranges. The tree returned in that
                /// case will start at `ranges[0].from`.
                startParse(input, fragments, ranges) {
                    if (typeof input == "string")
                        input = new StringInput(input);
                    ranges = !ranges
                        ? [new Range(0, input.length)]
                        : ranges.length
                        ? ranges.map((r) => new Range(r.from, r.to))
                        : [new Range(0, 0)];
                    return this.createParse(input, fragments || [], ranges);
                }
                /// Run a full parse, returning the resulting tree.
                parse(input, fragments, ranges) {
                    let parse = this.startParse(input, fragments, ranges);
                    for (;;) {
                        let done = parse.advance();
                        if (done) return done;
                    }
                }
            }
            class StringInput {
                constructor(string) {
                    this.string = string;
                }
                get length() {
                    return this.string.length;
                }
                chunk(from) {
                    return this.string.slice(from);
                }
                get lineChunks() {
                    return false;
                }
                read(from, to) {
                    return this.string.slice(from, to);
                }
            }

            /// Create a parse wrapper that, after the inner parse completes,
            /// scans its tree for mixed language regions with the `nest`
            /// function, runs the resulting [inner parses](#common.NestedParse),
            /// and then [mounts](#common.NodeProp^mounted) their results onto the
            /// tree.
            ///
            /// The nesting function is passed a cursor to provide context for a
            /// node, but _should not_ move that cursor, only inspect its
            /// properties and optionally access its
            /// [node object](#common.TreeCursor.node).
            function parseMixed(nest) {
                return (parse, input, fragments, ranges) =>
                    new MixedParse(parse, nest, input, fragments, ranges);
            }
            class InnerParse {
                constructor(parser, parse, overlay, target, ranges) {
                    this.parser = parser;
                    this.parse = parse;
                    this.overlay = overlay;
                    this.target = target;
                    this.ranges = ranges;
                }
            }
            class ActiveOverlay {
                constructor(
                    parser,
                    predicate,
                    mounts,
                    index,
                    start,
                    target,
                    prev
                ) {
                    this.parser = parser;
                    this.predicate = predicate;
                    this.mounts = mounts;
                    this.index = index;
                    this.start = start;
                    this.target = target;
                    this.prev = prev;
                    this.depth = 0;
                    this.ranges = [];
                }
            }
            const stoppedInner = new dist_NodeProp({ perNode: true });
            class MixedParse {
                constructor(base, nest, input, fragments, ranges) {
                    this.nest = nest;
                    this.input = input;
                    this.fragments = fragments;
                    this.ranges = ranges;
                    this.inner = [];
                    this.innerDone = 0;
                    this.baseTree = null;
                    this.stoppedAt = null;
                    this.baseParse = base;
                }
                advance() {
                    if (this.baseParse) {
                        let done = this.baseParse.advance();
                        if (!done) return null;
                        this.baseParse = null;
                        this.baseTree = done;
                        this.startInner();
                        if (this.stoppedAt != null)
                            for (let inner of this.inner)
                                inner.parse.stopAt(this.stoppedAt);
                    }
                    if (this.innerDone == this.inner.length) {
                        let result = this.baseTree;
                        if (this.stoppedAt != null)
                            result = new dist_Tree(
                                result.type,
                                result.children,
                                result.positions,
                                result.length,
                                result.propValues.concat([
                                    [stoppedInner, this.stoppedAt],
                                ])
                            );
                        return result;
                    }
                    let inner = this.inner[this.innerDone],
                        done = inner.parse.advance();
                    if (done) {
                        this.innerDone++;
                        // This is a somewhat dodgy but super helpful hack where we
                        // patch up nodes created by the inner parse (and thus
                        // presumably not aliased anywhere else) to hold the information
                        // about the inner parse.
                        let props = Object.assign(
                            Object.create(null),
                            inner.target.props
                        );
                        props[dist_NodeProp.mounted.id] = new MountedTree(
                            done,
                            inner.overlay,
                            inner.parser
                        );
                        inner.target.props = props;
                    }
                    return null;
                }
                get parsedPos() {
                    if (this.baseParse) return 0;
                    let pos = this.input.length;
                    for (let i = this.innerDone; i < this.inner.length; i++) {
                        if (this.inner[i].ranges[0].from < pos)
                            pos = Math.min(pos, this.inner[i].parse.parsedPos);
                    }
                    return pos;
                }
                stopAt(pos) {
                    this.stoppedAt = pos;
                    if (this.baseParse) this.baseParse.stopAt(pos);
                    else
                        for (let i = this.innerDone; i < this.inner.length; i++)
                            this.inner[i].parse.stopAt(pos);
                }
                startInner() {
                    let fragmentCursor = new FragmentCursor(this.fragments);
                    let overlay = null;
                    let covered = null;
                    let cursor = new TreeCursor(
                        new TreeNode(
                            this.baseTree,
                            this.ranges[0].from,
                            0,
                            null
                        ),
                        IterMode.IncludeAnonymous | IterMode.IgnoreMounts
                    );
                    scan: for (
                        let nest, isCovered;
                        this.stoppedAt == null || cursor.from < this.stoppedAt;

                    ) {
                        let enter = true,
                            range;
                        if (fragmentCursor.hasNode(cursor)) {
                            if (overlay) {
                                let match = overlay.mounts.find(
                                    (m) =>
                                        m.frag.from <= cursor.from &&
                                        m.frag.to >= cursor.to &&
                                        m.mount.overlay
                                );
                                if (match)
                                    for (let r of match.mount.overlay) {
                                        let from = r.from + match.pos,
                                            to = r.to + match.pos;
                                        if (
                                            from >= cursor.from &&
                                            to <= cursor.to &&
                                            !overlay.ranges.some(
                                                (r) =>
                                                    r.from < to && r.to > from
                                            )
                                        )
                                            overlay.ranges.push({ from, to });
                                    }
                            }
                            enter = false;
                        } else if (
                            covered &&
                            (isCovered = checkCover(
                                covered.ranges,
                                cursor.from,
                                cursor.to
                            ))
                        ) {
                            enter = isCovered != 2 /* Full */;
                        } else if (
                            !cursor.type.isAnonymous &&
                            cursor.from < cursor.to &&
                            (nest = this.nest(cursor, this.input))
                        ) {
                            if (!cursor.tree) materialize(cursor);
                            let oldMounts = fragmentCursor.findMounts(
                                cursor.from,
                                nest.parser
                            );
                            if (typeof nest.overlay == "function") {
                                overlay = new ActiveOverlay(
                                    nest.parser,
                                    nest.overlay,
                                    oldMounts,
                                    this.inner.length,
                                    cursor.from,
                                    cursor.tree,
                                    overlay
                                );
                            } else {
                                let ranges = punchRanges(
                                    this.ranges,
                                    nest.overlay || [
                                        new Range(cursor.from, cursor.to),
                                    ]
                                );
                                if (ranges.length)
                                    this.inner.push(
                                        new InnerParse(
                                            nest.parser,
                                            nest.parser.startParse(
                                                this.input,
                                                enterFragments(
                                                    oldMounts,
                                                    ranges
                                                ),
                                                ranges
                                            ),
                                            nest.overlay
                                                ? nest.overlay.map(
                                                      (r) =>
                                                          new Range(
                                                              r.from -
                                                                  cursor.from,
                                                              r.to - cursor.from
                                                          )
                                                  )
                                                : null,
                                            cursor.tree,
                                            ranges
                                        )
                                    );
                                if (!nest.overlay) enter = false;
                                else if (ranges.length)
                                    covered = {
                                        ranges,
                                        depth: 0,
                                        prev: covered,
                                    };
                            }
                        } else if (
                            overlay &&
                            (range = overlay.predicate(cursor))
                        ) {
                            if (range === true)
                                range = new Range(cursor.from, cursor.to);
                            if (range.from < range.to)
                                overlay.ranges.push(range);
                        }
                        if (enter && cursor.firstChild()) {
                            if (overlay) overlay.depth++;
                            if (covered) covered.depth++;
                        } else {
                            for (;;) {
                                if (cursor.nextSibling()) break;
                                if (!cursor.parent()) break scan;
                                if (overlay && !--overlay.depth) {
                                    let ranges = punchRanges(
                                        this.ranges,
                                        overlay.ranges
                                    );
                                    if (ranges.length)
                                        this.inner.splice(
                                            overlay.index,
                                            0,
                                            new InnerParse(
                                                overlay.parser,
                                                overlay.parser.startParse(
                                                    this.input,
                                                    enterFragments(
                                                        overlay.mounts,
                                                        ranges
                                                    ),
                                                    ranges
                                                ),
                                                overlay.ranges.map(
                                                    (r) =>
                                                        new Range(
                                                            r.from -
                                                                overlay.start,
                                                            r.to - overlay.start
                                                        )
                                                ),
                                                overlay.target,
                                                ranges
                                            )
                                        );
                                    overlay = overlay.prev;
                                }
                                if (covered && !--covered.depth)
                                    covered = covered.prev;
                            }
                        }
                    }
                }
            }
            function checkCover(covered, from, to) {
                for (let range of covered) {
                    if (range.from >= to) break;
                    if (range.to > from)
                        return range.from <= from && range.to >= to
                            ? 2 /* Full */
                            : 1 /* Partial */;
                }
                return 0 /* None */;
            }
            // Take a piece of buffer and convert it into a stand-alone
            // TreeBuffer.
            function sliceBuf(buf, startI, endI, nodes, positions, off) {
                if (startI < endI) {
                    let from = buf.buffer[startI + 1],
                        to = buf.buffer[endI - 2];
                    nodes.push(buf.slice(startI, endI, from, to));
                    positions.push(from - off);
                }
            }
            // This function takes a node that's in a buffer, and converts it, and
            // its parent buffer nodes, into a Tree. This is again acting on the
            // assumption that the trees and buffers have been constructed by the
            // parse that was ran via the mix parser, and thus aren't shared with
            // any other code, making violations of the immutability safe.
            function materialize(cursor) {
                let { node } = cursor,
                    depth = 0;
                // Scan up to the nearest tree
                do {
                    cursor.parent();
                    depth++;
                } while (!cursor.tree);
                // Find the index of the buffer in that tree
                let i = 0,
                    base = cursor.tree,
                    off = 0;
                for (; ; i++) {
                    off = base.positions[i] + cursor.from;
                    if (
                        off <= node.from &&
                        off + base.children[i].length >= node.to
                    )
                        break;
                }
                let buf = base.children[i],
                    b = buf.buffer;
                // Split a level in the buffer, putting the nodes before and after
                // the child that contains `node` into new buffers.
                function split(startI, endI, type, innerOffset, length) {
                    let i = startI;
                    while (b[i + 2] + off <= node.from) i = b[i + 3];
                    let children = [],
                        positions = [];
                    sliceBuf(buf, startI, i, children, positions, innerOffset);
                    let from = b[i + 1],
                        to = b[i + 2];
                    let isTarget =
                        from + off == node.from &&
                        to + off == node.to &&
                        b[i] == node.type.id;
                    children.push(
                        isTarget
                            ? node.toTree()
                            : split(
                                  i + 4,
                                  b[i + 3],
                                  buf.set.types[b[i]],
                                  from,
                                  to - from
                              )
                    );
                    positions.push(from - innerOffset);
                    sliceBuf(
                        buf,
                        b[i + 3],
                        endI,
                        children,
                        positions,
                        innerOffset
                    );
                    return new dist_Tree(type, children, positions, length);
                }
                base.children[i] = split(
                    0,
                    b.length,
                    dist_NodeType.none,
                    0,
                    buf.length
                );
                // Move the cursor back to the target node
                for (let d = 0; d <= depth; d++) cursor.childAfter(node.from);
            }
            class StructureCursor {
                constructor(root, offset) {
                    this.offset = offset;
                    this.done = false;
                    this.cursor = root.cursor(
                        IterMode.IncludeAnonymous | IterMode.IgnoreMounts
                    );
                }
                // Move to the first node (in pre-order) that starts at or after `pos`.
                moveTo(pos) {
                    let { cursor } = this,
                        p = pos - this.offset;
                    while (!this.done && cursor.from < p) {
                        if (
                            cursor.to >= pos &&
                            cursor.enter(
                                p,
                                1,
                                IterMode.IgnoreOverlays |
                                    IterMode.ExcludeBuffers
                            )
                        );
                        else if (!cursor.next(false)) this.done = true;
                    }
                }
                hasNode(cursor) {
                    this.moveTo(cursor.from);
                    if (
                        !this.done &&
                        this.cursor.from + this.offset == cursor.from &&
                        this.cursor.tree
                    ) {
                        for (let tree = this.cursor.tree; ; ) {
                            if (tree == cursor.tree) return true;
                            if (
                                tree.children.length &&
                                tree.positions[0] == 0 &&
                                tree.children[0] instanceof dist_Tree
                            )
                                tree = tree.children[0];
                            else break;
                        }
                    }
                    return false;
                }
            }
            class FragmentCursor {
                constructor(fragments) {
                    var _a;
                    this.fragments = fragments;
                    this.curTo = 0;
                    this.fragI = 0;
                    if (fragments.length) {
                        let first = (this.curFrag = fragments[0]);
                        this.curTo =
                            (_a = first.tree.prop(stoppedInner)) !== null &&
                            _a !== void 0
                                ? _a
                                : first.to;
                        this.inner = new StructureCursor(
                            first.tree,
                            -first.offset
                        );
                    } else {
                        this.curFrag = this.inner = null;
                    }
                }
                hasNode(node) {
                    while (this.curFrag && node.from >= this.curTo)
                        this.nextFrag();
                    return (
                        this.curFrag &&
                        this.curFrag.from <= node.from &&
                        this.curTo >= node.to &&
                        this.inner.hasNode(node)
                    );
                }
                nextFrag() {
                    var _a;
                    this.fragI++;
                    if (this.fragI == this.fragments.length) {
                        this.curFrag = this.inner = null;
                    } else {
                        let frag = (this.curFrag = this.fragments[this.fragI]);
                        this.curTo =
                            (_a = frag.tree.prop(stoppedInner)) !== null &&
                            _a !== void 0
                                ? _a
                                : frag.to;
                        this.inner = new StructureCursor(
                            frag.tree,
                            -frag.offset
                        );
                    }
                }
                findMounts(pos, parser) {
                    var _a;
                    let result = [];
                    if (this.inner) {
                        this.inner.cursor.moveTo(pos, 1);
                        for (
                            let pos = this.inner.cursor.node;
                            pos;
                            pos = pos.parent
                        ) {
                            let mount =
                                (_a = pos.tree) === null || _a === void 0
                                    ? void 0
                                    : _a.prop(dist_NodeProp.mounted);
                            if (mount && mount.parser == parser) {
                                for (
                                    let i = this.fragI;
                                    i < this.fragments.length;
                                    i++
                                ) {
                                    let frag = this.fragments[i];
                                    if (frag.from >= pos.to) break;
                                    if (frag.tree == this.curFrag.tree)
                                        result.push({
                                            frag,
                                            pos: pos.from - frag.offset,
                                            mount,
                                        });
                                }
                            }
                        }
                    }
                    return result;
                }
            }
            function punchRanges(outer, ranges) {
                let copy = null,
                    current = ranges;
                for (let i = 1, j = 0; i < outer.length; i++) {
                    let gapFrom = outer[i - 1].to,
                        gapTo = outer[i].from;
                    for (; j < current.length; j++) {
                        let r = current[j];
                        if (r.from >= gapTo) break;
                        if (r.to <= gapFrom) continue;
                        if (!copy) current = copy = ranges.slice();
                        if (r.from < gapFrom) {
                            copy[j] = new Range(r.from, gapFrom);
                            if (r.to > gapTo)
                                copy.splice(j + 1, 0, new Range(gapTo, r.to));
                        } else if (r.to > gapTo) {
                            copy[j--] = new Range(gapTo, r.to);
                        } else {
                            copy.splice(j--, 1);
                        }
                    }
                }
                return current;
            }
            function findCoverChanges(a, b, from, to) {
                let iA = 0,
                    iB = 0,
                    inA = false,
                    inB = false,
                    pos = -1e9;
                let result = [];
                for (;;) {
                    let nextA =
                        iA == a.length ? 1e9 : inA ? a[iA].to : a[iA].from;
                    let nextB =
                        iB == b.length ? 1e9 : inB ? b[iB].to : b[iB].from;
                    if (inA != inB) {
                        let start = Math.max(pos, from),
                            end = Math.min(nextA, nextB, to);
                        if (start < end) result.push(new Range(start, end));
                    }
                    pos = Math.min(nextA, nextB);
                    if (pos == 1e9) break;
                    if (nextA == pos) {
                        if (!inA) inA = true;
                        else {
                            inA = false;
                            iA++;
                        }
                    }
                    if (nextB == pos) {
                        if (!inB) inB = true;
                        else {
                            inB = false;
                            iB++;
                        }
                    }
                }
                return result;
            }
            // Given a number of fragments for the outer tree, and a set of ranges
            // to parse, find fragments for inner trees mounted around those
            // ranges, if any.
            function enterFragments(mounts, ranges) {
                let result = [];
                for (let { pos, mount, frag } of mounts) {
                    let startPos =
                            pos + (mount.overlay ? mount.overlay[0].from : 0),
                        endPos = startPos + mount.tree.length;
                    let from = Math.max(frag.from, startPos),
                        to = Math.min(frag.to, endPos);
                    if (mount.overlay) {
                        let overlay = mount.overlay.map(
                            (r) => new Range(r.from + pos, r.to + pos)
                        );
                        let changes = findCoverChanges(
                            ranges,
                            overlay,
                            from,
                            to
                        );
                        for (let i = 0, pos = from; ; i++) {
                            let last = i == changes.length,
                                end = last ? to : changes[i].from;
                            if (end > pos)
                                result.push(
                                    new TreeFragment(
                                        pos,
                                        end,
                                        mount.tree,
                                        -startPos,
                                        frag.from >= pos,
                                        frag.to <= end
                                    )
                                );
                            if (last) break;
                            pos = changes[i].to;
                        }
                    } else {
                        result.push(
                            new TreeFragment(
                                from,
                                to,
                                mount.tree,
                                -startPos,
                                frag.from >= startPos,
                                frag.to <= endPos
                            )
                        );
                    }
                }
                return result;
            } // CONCATENATED MODULE: ./node_modules/@lezer/highlight/dist/index.js

            let nextTagID = 0;
            /// Highlighting tags are markers that denote a highlighting category.
            /// They are [associated](#highlight.styleTags) with parts of a syntax
            /// tree by a language mode, and then mapped to an actual CSS style by
            /// a [highlighter](#highlight.Highlighter).
            ///
            /// Because syntax tree node types and highlight styles have to be
            /// able to talk the same language, CodeMirror uses a mostly _closed_
            /// [vocabulary](#highlight.tags) of syntax tags (as opposed to
            /// traditional open string-based systems, which make it hard for
            /// highlighting themes to cover all the tokens produced by the
            /// various languages).
            ///
            /// It _is_ possible to [define](#highlight.Tag^define) your own
            /// highlighting tags for system-internal use (where you control both
            /// the language package and the highlighter), but such tags will not
            /// be picked up by regular highlighters (though you can derive them
            /// from standard tags to allow highlighters to fall back to those).
            class Tag {
                /// @internal
                constructor(
                    /// The set of this tag and all its parent tags, starting with
                    /// this one itself and sorted in order of decreasing specificity.
                    set,
                    /// The base unmodified tag that this one is based on, if it's
                    /// modified @internal
                    base,
                    /// The modifiers applied to this.base @internal
                    modified
                ) {
                    this.set = set;
                    this.base = base;
                    this.modified = modified;
                    /// @internal
                    this.id = nextTagID++;
                }
                /// Define a new tag. If `parent` is given, the tag is treated as a
                /// sub-tag of that parent, and
                /// [highlighters](#highlight.tagHighlighter) that don't mention
                /// this tag will try to fall back to the parent tag (or grandparent
                /// tag, etc).
                static define(parent) {
                    if (
                        parent === null || parent === void 0
                            ? void 0
                            : parent.base
                    )
                        throw new Error("Can not derive from a modified tag");
                    let tag = new Tag([], null, []);
                    tag.set.push(tag);
                    if (parent) for (let t of parent.set) tag.set.push(t);
                    return tag;
                }
                /// Define a tag _modifier_, which is a function that, given a tag,
                /// will return a tag that is a subtag of the original. Applying the
                /// same modifier to a twice tag will return the same value (`m1(t1)
                /// == m1(t1)`) and applying multiple modifiers will, regardless or
                /// order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
                ///
                /// When multiple modifiers are applied to a given base tag, each
                /// smaller set of modifiers is registered as a parent, so that for
                /// example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
                /// `m1(m3(t1)`, and so on.
                static defineModifier() {
                    let mod = new Modifier();
                    return (tag) => {
                        if (tag.modified.indexOf(mod) > -1) return tag;
                        return Modifier.get(
                            tag.base || tag,
                            tag.modified.concat(mod).sort((a, b) => a.id - b.id)
                        );
                    };
                }
            }
            let nextModifierID = 0;
            class Modifier {
                constructor() {
                    this.instances = [];
                    this.id = nextModifierID++;
                }
                static get(base, mods) {
                    if (!mods.length) return base;
                    let exists = mods[0].instances.find(
                        (t) => t.base == base && sameArray(mods, t.modified)
                    );
                    if (exists) return exists;
                    let set = [],
                        tag = new Tag(set, base, mods);
                    for (let m of mods) m.instances.push(tag);
                    let configs = permute(mods);
                    for (let parent of base.set)
                        for (let config of configs)
                            set.push(Modifier.get(parent, config));
                    return tag;
                }
            }
            function sameArray(a, b) {
                return a.length == b.length && a.every((x, i) => x == b[i]);
            }
            function permute(array) {
                let result = [array];
                for (let i = 0; i < array.length; i++) {
                    for (let a of permute(
                        array.slice(0, i).concat(array.slice(i + 1))
                    ))
                        result.push(a);
                }
                return result;
            }
            /// This function is used to add a set of tags to a language syntax
            /// via [`NodeSet.extend`](#common.NodeSet.extend) or
            /// [`LRParser.configure`](#lr.LRParser.configure).
            ///
            /// The argument object maps node selectors to [highlighting
            /// tags](#highlight.Tag) or arrays of tags.
            ///
            /// Node selectors may hold one or more (space-separated) node paths.
            /// Such a path can be a [node name](#common.NodeType.name), or
            /// multiple node names (or `*` wildcards) separated by slash
            /// characters, as in `"Block/Declaration/VariableName"`. Such a path
            /// matches the final node but only if its direct parent nodes are the
            /// other nodes mentioned. A `*` in such a path matches any parent,
            /// but only a single level—wildcards that match multiple parents
            /// aren't supported, both for efficiency reasons and because Lezer
            /// trees make it rather hard to reason about what they would match.)
            ///
            /// A path can be ended with `/...` to indicate that the tag assigned
            /// to the node should also apply to all child nodes, even if they
            /// match their own style (by default, only the innermost style is
            /// used).
            ///
            /// When a path ends in `!`, as in `Attribute!`, no further matching
            /// happens for the node's child nodes, and the entire node gets the
            /// given style.
            ///
            /// In this notation, node names that contain `/`, `!`, `*`, or `...`
            /// must be quoted as JSON strings.
            ///
            /// For example:
            ///
            /// ```javascript
            /// parser.withProps(
            ///   styleTags({
            ///     // Style Number and BigNumber nodes
            ///     "Number BigNumber": tags.number,
            ///     // Style Escape nodes whose parent is String
            ///     "String/Escape": tags.escape,
            ///     // Style anything inside Attributes nodes
            ///     "Attributes!": tags.meta,
            ///     // Add a style to all content inside Italic nodes
            ///     "Italic/...": tags.emphasis,
            ///     // Style InvalidString nodes as both `string` and `invalid`
            ///     "InvalidString": [tags.string, tags.invalid],
            ///     // Style the node named "/" as punctuation
            ///     '"/"': tags.punctuation
            ///   })
            /// )
            /// ```
            function styleTags(spec) {
                let byName = Object.create(null);
                for (let prop in spec) {
                    let tags = spec[prop];
                    if (!Array.isArray(tags)) tags = [tags];
                    for (let part of prop.split(" "))
                        if (part) {
                            let pieces = [],
                                mode = 2 /* Normal */,
                                rest = part;
                            for (let pos = 0; ; ) {
                                if (
                                    rest == "..." &&
                                    pos > 0 &&
                                    pos + 3 == part.length
                                ) {
                                    mode = 1 /* Inherit */;
                                    break;
                                }
                                let m = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(
                                    rest
                                );
                                if (!m)
                                    throw new RangeError(
                                        "Invalid path: " + part
                                    );
                                pieces.push(
                                    m[0] == "*"
                                        ? ""
                                        : m[0][0] == '"'
                                        ? JSON.parse(m[0])
                                        : m[0]
                                );
                                pos += m[0].length;
                                if (pos == part.length) break;
                                let next = part[pos++];
                                if (pos == part.length && next == "!") {
                                    mode = 0 /* Opaque */;
                                    break;
                                }
                                if (next != "/")
                                    throw new RangeError(
                                        "Invalid path: " + part
                                    );
                                rest = part.slice(pos);
                            }
                            let last = pieces.length - 1,
                                inner = pieces[last];
                            if (!inner)
                                throw new RangeError("Invalid path: " + part);
                            let rule = new Rule(
                                tags,
                                mode,
                                last > 0 ? pieces.slice(0, last) : null
                            );
                            byName[inner] = rule.sort(byName[inner]);
                        }
                }
                return ruleNodeProp.add(byName);
            }
            const ruleNodeProp = new dist_NodeProp();
            class Rule {
                constructor(tags, mode, context, next) {
                    this.tags = tags;
                    this.mode = mode;
                    this.context = context;
                    this.next = next;
                }
                sort(other) {
                    if (!other || other.depth < this.depth) {
                        this.next = other;
                        return this;
                    }
                    other.next = this.sort(other.next);
                    return other;
                }
                get depth() {
                    return this.context ? this.context.length : 0;
                }
            }
            /// Define a [highlighter](#highlight.Highlighter) from an array of
            /// tag/class pairs. Classes associated with more specific tags will
            /// take precedence.
            function tagHighlighter(tags, options) {
                let map = Object.create(null);
                for (let style of tags) {
                    if (!Array.isArray(style.tag))
                        map[style.tag.id] = style.class;
                    else for (let tag of style.tag) map[tag.id] = style.class;
                }
                let { scope, all = null } = options || {};
                return {
                    style: (tags) => {
                        let cls = all;
                        for (let tag of tags) {
                            for (let sub of tag.set) {
                                let tagClass = map[sub.id];
                                if (tagClass) {
                                    cls = cls ? cls + " " + tagClass : tagClass;
                                    break;
                                }
                            }
                        }
                        return cls;
                    },
                    scope: scope,
                };
            }
            function highlightTags(highlighters, tags) {
                let result = null;
                for (let highlighter of highlighters) {
                    let value = highlighter.style(tags);
                    if (value) result = result ? result + " " + value : value;
                }
                return result;
            }
            /// Highlight the given [tree](#common.Tree) with the given
            /// [highlighter](#highlight.Highlighter).
            function highlightTree(
                tree,
                highlighter,
                /// Assign styling to a region of the text. Will be called, in order
                /// of position, for any ranges where more than zero classes apply.
                /// `classes` is a space separated string of CSS classes.
                putStyle,
                /// The start of the range to highlight.
                from = 0,
                /// The end of the range.
                to = tree.length
            ) {
                let builder = new HighlightBuilder(
                    from,
                    Array.isArray(highlighter) ? highlighter : [highlighter],
                    putStyle
                );
                builder.highlightRange(
                    tree.cursor(),
                    from,
                    to,
                    "",
                    builder.highlighters
                );
                builder.flush(to);
            }
            class HighlightBuilder {
                constructor(at, highlighters, span) {
                    this.at = at;
                    this.highlighters = highlighters;
                    this.span = span;
                    this.class = "";
                }
                startSpan(at, cls) {
                    if (cls != this.class) {
                        this.flush(at);
                        if (at > this.at) this.at = at;
                        this.class = cls;
                    }
                }
                flush(to) {
                    if (to > this.at && this.class)
                        this.span(this.at, to, this.class);
                }
                highlightRange(cursor, from, to, inheritedClass, highlighters) {
                    let { type, from: start, to: end } = cursor;
                    if (start >= to || end <= from) return;
                    if (type.isTop)
                        highlighters = this.highlighters.filter(
                            (h) => !h.scope || h.scope(type)
                        );
                    let cls = inheritedClass;
                    let rule = type.prop(ruleNodeProp),
                        opaque = false;
                    while (rule) {
                        if (
                            !rule.context ||
                            cursor.matchContext(rule.context)
                        ) {
                            let tagCls = highlightTags(highlighters, rule.tags);
                            if (tagCls) {
                                if (cls) cls += " ";
                                cls += tagCls;
                                if (rule.mode == 1 /* Inherit */)
                                    inheritedClass +=
                                        (inheritedClass ? " " : "") + tagCls;
                                else if (rule.mode == 0 /* Opaque */)
                                    opaque = true;
                            }
                            break;
                        }
                        rule = rule.next;
                    }
                    this.startSpan(cursor.from, cls);
                    if (opaque) return;
                    let mounted =
                        cursor.tree && cursor.tree.prop(dist_NodeProp.mounted);
                    if (mounted && mounted.overlay) {
                        let inner = cursor.node.enter(
                            mounted.overlay[0].from + start,
                            1
                        );
                        let innerHighlighters = this.highlighters.filter(
                            (h) => !h.scope || h.scope(mounted.tree.type)
                        );
                        let hasChild = cursor.firstChild();
                        for (let i = 0, pos = start; ; i++) {
                            let next =
                                i < mounted.overlay.length
                                    ? mounted.overlay[i]
                                    : null;
                            let nextPos = next ? next.from + start : end;
                            let rangeFrom = Math.max(from, pos),
                                rangeTo = Math.min(to, nextPos);
                            if (rangeFrom < rangeTo && hasChild) {
                                while (cursor.from < rangeTo) {
                                    this.highlightRange(
                                        cursor,
                                        rangeFrom,
                                        rangeTo,
                                        inheritedClass,
                                        highlighters
                                    );
                                    this.startSpan(
                                        Math.min(to, cursor.to),
                                        cls
                                    );
                                    if (
                                        cursor.to >= nextPos ||
                                        !cursor.nextSibling()
                                    )
                                        break;
                                }
                            }
                            if (!next || nextPos > to) break;
                            pos = next.to + start;
                            if (pos > from) {
                                this.highlightRange(
                                    inner.cursor(),
                                    Math.max(from, next.from + start),
                                    Math.min(to, pos),
                                    inheritedClass,
                                    innerHighlighters
                                );
                                this.startSpan(pos, cls);
                            }
                        }
                        if (hasChild) cursor.parent();
                    } else if (cursor.firstChild()) {
                        do {
                            if (cursor.to <= from) continue;
                            if (cursor.from >= to) break;
                            this.highlightRange(
                                cursor,
                                from,
                                to,
                                inheritedClass,
                                highlighters
                            );
                            this.startSpan(Math.min(to, cursor.to), cls);
                        } while (cursor.nextSibling());
                        cursor.parent();
                    }
                }
            }
            const t = Tag.define;
            const comment = t(),
                dist_name = t(),
                typeName = t(dist_name),
                propertyName = t(dist_name),
                literal = t(),
                string = t(literal),
                number = t(literal),
                content = t(),
                heading = t(content),
                keyword = t(),
                operator = t(),
                punctuation = t(),
                bracket = t(punctuation),
                meta = t();
            /// The default set of highlighting [tags](#highlight.Tag).
            ///
            /// This collection is heavily biased towards programming languages,
            /// and necessarily incomplete. A full ontology of syntactic
            /// constructs would fill a stack of books, and be impractical to
            /// write themes for. So try to make do with this set. If all else
            /// fails, [open an
            /// issue](https://github.com/codemirror/codemirror.next) to propose a
            /// new tag, or [define](#highlight.Tag^define) a local custom tag for
            /// your use case.
            ///
            /// Note that it is not obligatory to always attach the most specific
            /// tag possible to an element—if your grammar can't easily
            /// distinguish a certain type of element (such as a local variable),
            /// it is okay to style it as its more general variant (a variable).
            ///
            /// For tags that extend some parent tag, the documentation links to
            /// the parent.
            const tags = {
                /// A comment.
                comment,
                /// A line [comment](#highlight.tags.comment).
                lineComment: t(comment),
                /// A block [comment](#highlight.tags.comment).
                blockComment: t(comment),
                /// A documentation [comment](#highlight.tags.comment).
                docComment: t(comment),
                /// Any kind of identifier.
                name: dist_name,
                /// The [name](#highlight.tags.name) of a variable.
                variableName: t(dist_name),
                /// A type [name](#highlight.tags.name).
                typeName: typeName,
                /// A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
                tagName: t(typeName),
                /// A property or field [name](#highlight.tags.name).
                propertyName: propertyName,
                /// An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
                attributeName: t(propertyName),
                /// The [name](#highlight.tags.name) of a class.
                className: t(dist_name),
                /// A label [name](#highlight.tags.name).
                labelName: t(dist_name),
                /// A namespace [name](#highlight.tags.name).
                namespace: t(dist_name),
                /// The [name](#highlight.tags.name) of a macro.
                macroName: t(dist_name),
                /// A literal value.
                literal,
                /// A string [literal](#highlight.tags.literal).
                string,
                /// A documentation [string](#highlight.tags.string).
                docString: t(string),
                /// A character literal (subtag of [string](#highlight.tags.string)).
                character: t(string),
                /// An attribute value (subtag of [string](#highlight.tags.string)).
                attributeValue: t(string),
                /// A number [literal](#highlight.tags.literal).
                number,
                /// An integer [number](#highlight.tags.number) literal.
                integer: t(number),
                /// A floating-point [number](#highlight.tags.number) literal.
                float: t(number),
                /// A boolean [literal](#highlight.tags.literal).
                bool: t(literal),
                /// Regular expression [literal](#highlight.tags.literal).
                regexp: t(literal),
                /// An escape [literal](#highlight.tags.literal), for example a
                /// backslash escape in a string.
                escape: t(literal),
                /// A color [literal](#highlight.tags.literal).
                color: t(literal),
                /// A URL [literal](#highlight.tags.literal).
                url: t(literal),
                /// A language keyword.
                keyword,
                /// The [keyword](#highlight.tags.keyword) for the self or this
                /// object.
                self: t(keyword),
                /// The [keyword](#highlight.tags.keyword) for null.
                null: t(keyword),
                /// A [keyword](#highlight.tags.keyword) denoting some atomic value.
                atom: t(keyword),
                /// A [keyword](#highlight.tags.keyword) that represents a unit.
                unit: t(keyword),
                /// A modifier [keyword](#highlight.tags.keyword).
                modifier: t(keyword),
                /// A [keyword](#highlight.tags.keyword) that acts as an operator.
                operatorKeyword: t(keyword),
                /// A control-flow related [keyword](#highlight.tags.keyword).
                controlKeyword: t(keyword),
                /// A [keyword](#highlight.tags.keyword) that defines something.
                definitionKeyword: t(keyword),
                /// A [keyword](#highlight.tags.keyword) related to defining or
                /// interfacing with modules.
                moduleKeyword: t(keyword),
                /// An operator.
                operator,
                /// An [operator](#highlight.tags.operator) that defines something.
                derefOperator: t(operator),
                /// Arithmetic-related [operator](#highlight.tags.operator).
                arithmeticOperator: t(operator),
                /// Logical [operator](#highlight.tags.operator).
                logicOperator: t(operator),
                /// Bit [operator](#highlight.tags.operator).
                bitwiseOperator: t(operator),
                /// Comparison [operator](#highlight.tags.operator).
                compareOperator: t(operator),
                /// [Operator](#highlight.tags.operator) that updates its operand.
                updateOperator: t(operator),
                /// [Operator](#highlight.tags.operator) that defines something.
                definitionOperator: t(operator),
                /// Type-related [operator](#highlight.tags.operator).
                typeOperator: t(operator),
                /// Control-flow [operator](#highlight.tags.operator).
                controlOperator: t(operator),
                /// Program or markup punctuation.
                punctuation,
                /// [Punctuation](#highlight.tags.punctuation) that separates
                /// things.
                separator: t(punctuation),
                /// Bracket-style [punctuation](#highlight.tags.punctuation).
                bracket,
                /// Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
                /// tokens).
                angleBracket: t(bracket),
                /// Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
                /// tokens).
                squareBracket: t(bracket),
                /// Parentheses (usually `(` and `)` tokens). Subtag of
                /// [bracket](#highlight.tags.bracket).
                paren: t(bracket),
                /// Braces (usually `{` and `}` tokens). Subtag of
                /// [bracket](#highlight.tags.bracket).
                brace: t(bracket),
                /// Content, for example plain text in XML or markup documents.
                content,
                /// [Content](#highlight.tags.content) that represents a heading.
                heading,
                /// A level 1 [heading](#highlight.tags.heading).
                heading1: t(heading),
                /// A level 2 [heading](#highlight.tags.heading).
                heading2: t(heading),
                /// A level 3 [heading](#highlight.tags.heading).
                heading3: t(heading),
                /// A level 4 [heading](#highlight.tags.heading).
                heading4: t(heading),
                /// A level 5 [heading](#highlight.tags.heading).
                heading5: t(heading),
                /// A level 6 [heading](#highlight.tags.heading).
                heading6: t(heading),
                /// A prose separator (such as a horizontal rule).
                contentSeparator: t(content),
                /// [Content](#highlight.tags.content) that represents a list.
                list: t(content),
                /// [Content](#highlight.tags.content) that represents a quote.
                quote: t(content),
                /// [Content](#highlight.tags.content) that is emphasized.
                emphasis: t(content),
                /// [Content](#highlight.tags.content) that is styled strong.
                strong: t(content),
                /// [Content](#highlight.tags.content) that is part of a link.
                link: t(content),
                /// [Content](#highlight.tags.content) that is styled as code or
                /// monospace.
                monospace: t(content),
                /// [Content](#highlight.tags.content) that has a strike-through
                /// style.
                strikethrough: t(content),
                /// Inserted text in a change-tracking format.
                inserted: t(),
                /// Deleted text.
                deleted: t(),
                /// Changed text.
                changed: t(),
                /// An invalid or unsyntactic element.
                invalid: t(),
                /// Metadata or meta-instruction.
                meta,
                /// [Metadata](#highlight.tags.meta) that applies to the entire
                /// document.
                documentMeta: t(meta),
                /// [Metadata](#highlight.tags.meta) that annotates or adds
                /// attributes to a given syntactic element.
                annotation: t(meta),
                /// Processing instruction or preprocessor directive. Subtag of
                /// [meta](#highlight.tags.meta).
                processingInstruction: t(meta),
                /// [Modifier](#highlight.Tag^defineModifier) that indicates that a
                /// given element is being defined. Expected to be used with the
                /// various [name](#highlight.tags.name) tags.
                definition: Tag.defineModifier(),
                /// [Modifier](#highlight.Tag^defineModifier) that indicates that
                /// something is constant. Mostly expected to be used with
                /// [variable names](#highlight.tags.variableName).
                constant: Tag.defineModifier(),
                /// [Modifier](#highlight.Tag^defineModifier) used to indicate that
                /// a [variable](#highlight.tags.variableName) or [property
                /// name](#highlight.tags.propertyName) is being called or defined
                /// as a function.
                function: Tag.defineModifier(),
                /// [Modifier](#highlight.Tag^defineModifier) that can be applied to
                /// [names](#highlight.tags.name) to indicate that they belong to
                /// the language's standard environment.
                standard: Tag.defineModifier(),
                /// [Modifier](#highlight.Tag^defineModifier) that indicates a given
                /// [names](#highlight.tags.name) is local to some scope.
                local: Tag.defineModifier(),
                /// A generic variant [modifier](#highlight.Tag^defineModifier) that
                /// can be used to tag language-specific alternative variants of
                /// some common tag. It is recommended for themes to define special
                /// forms of at least the [string](#highlight.tags.string) and
                /// [variable name](#highlight.tags.variableName) tags, since those
                /// come up a lot.
                special: Tag.defineModifier(),
            };
            /// This is a highlighter that adds stable, predictable classes to
            /// tokens, for styling with external CSS.
            ///
            /// The following tags are mapped to their name prefixed with `"tok-"`
            /// (for example `"tok-comment"`):
            ///
            /// * [`link`](#highlight.tags.link)
            /// * [`heading`](#highlight.tags.heading)
            /// * [`emphasis`](#highlight.tags.emphasis)
            /// * [`strong`](#highlight.tags.strong)
            /// * [`keyword`](#highlight.tags.keyword)
            /// * [`atom`](#highlight.tags.atom) [`bool`](#highlight.tags.bool)
            /// * [`url`](#highlight.tags.url)
            /// * [`labelName`](#highlight.tags.labelName)
            /// * [`inserted`](#highlight.tags.inserted)
            /// * [`deleted`](#highlight.tags.deleted)
            /// * [`literal`](#highlight.tags.literal)
            /// * [`string`](#highlight.tags.string)
            /// * [`number`](#highlight.tags.number)
            /// * [`variableName`](#highlight.tags.variableName)
            /// * [`typeName`](#highlight.tags.typeName)
            /// * [`namespace`](#highlight.tags.namespace)
            /// * [`className`](#highlight.tags.className)
            /// * [`macroName`](#highlight.tags.macroName)
            /// * [`propertyName`](#highlight.tags.propertyName)
            /// * [`operator`](#highlight.tags.operator)
            /// * [`comment`](#highlight.tags.comment)
            /// * [`meta`](#highlight.tags.meta)
            /// * [`punctuation`](#highlight.tags.punctuation)
            /// * [`invalid`](#highlight.tags.invalid)
            ///
            /// In addition, these mappings are provided:
            ///
            /// * [`regexp`](#highlight.tags.regexp),
            ///   [`escape`](#highlight.tags.escape), and
            ///   [`special`](#highlight.tags.special)[`(string)`](#highlight.tags.string)
            ///   are mapped to `"tok-string2"`
            /// * [`special`](#highlight.tags.special)[`(variableName)`](#highlight.tags.variableName)
            ///   to `"tok-variableName2"`
            /// * [`local`](#highlight.tags.local)[`(variableName)`](#highlight.tags.variableName)
            ///   to `"tok-variableName tok-local"`
            /// * [`definition`](#highlight.tags.definition)[`(variableName)`](#highlight.tags.variableName)
            ///   to `"tok-variableName tok-definition"`
            /// * [`definition`](#highlight.tags.definition)[`(propertyName)`](#highlight.tags.propertyName)
            ///   to `"tok-propertyName tok-definition"`
            const classHighlighter = tagHighlighter([
                { tag: tags.link, class: "tok-link" },
                { tag: tags.heading, class: "tok-heading" },
                { tag: tags.emphasis, class: "tok-emphasis" },
                { tag: tags.strong, class: "tok-strong" },
                { tag: tags.keyword, class: "tok-keyword" },
                { tag: tags.atom, class: "tok-atom" },
                { tag: tags.bool, class: "tok-bool" },
                { tag: tags.url, class: "tok-url" },
                { tag: tags.labelName, class: "tok-labelName" },
                { tag: tags.inserted, class: "tok-inserted" },
                { tag: tags.deleted, class: "tok-deleted" },
                { tag: tags.literal, class: "tok-literal" },
                { tag: tags.string, class: "tok-string" },
                { tag: tags.number, class: "tok-number" },
                {
                    tag: [tags.regexp, tags.escape, tags.special(tags.string)],
                    class: "tok-string2",
                },
                { tag: tags.variableName, class: "tok-variableName" },
                {
                    tag: tags.local(tags.variableName),
                    class: "tok-variableName tok-local",
                },
                {
                    tag: tags.definition(tags.variableName),
                    class: "tok-variableName tok-definition",
                },
                {
                    tag: tags.special(tags.variableName),
                    class: "tok-variableName2",
                },
                {
                    tag: tags.definition(tags.propertyName),
                    class: "tok-propertyName tok-definition",
                },
                { tag: tags.typeName, class: "tok-typeName" },
                { tag: tags.namespace, class: "tok-namespace" },
                { tag: tags.className, class: "tok-className" },
                { tag: tags.macroName, class: "tok-macroName" },
                { tag: tags.propertyName, class: "tok-propertyName" },
                { tag: tags.operator, class: "tok-operator" },
                { tag: tags.comment, class: "tok-comment" },
                { tag: tags.meta, class: "tok-meta" },
                { tag: tags.invalid, class: "tok-invalid" },
                { tag: tags.punctuation, class: "tok-punctuation" },
            ]);

            // EXTERNAL MODULE: ./node_modules/style-mod/src/style-mod.js
            var style_mod = __webpack_require__(8699); // CONCATENATED MODULE: ./node_modules/@codemirror/language/dist/index.js
            var _a;
            /**
Node prop stored in a parser's top syntax node to provide the
facet that stores language-specific data for that language.
*/
            const languageDataProp = /*@__PURE__*/ new dist_NodeProp();
            /**
Helper function to define a facet (to be added to the top syntax
node(s) for a language via
[`languageDataProp`](https://codemirror.net/6/docs/ref/#language.languageDataProp)), that will be
used to associate language data with the language. You
probably only need this when subclassing
[`Language`](https://codemirror.net/6/docs/ref/#language.Language).
*/
            function defineLanguageFacet(baseData) {
                return Facet.define({
                    combine: baseData
                        ? (values) => values.concat(baseData)
                        : undefined,
                });
            }
            /**
A language object manages parsing and per-language
[metadata](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt). Parse data is
managed as a [Lezer](https://lezer.codemirror.net) tree. The class
can be used directly, via the [`LRLanguage`](https://codemirror.net/6/docs/ref/#language.LRLanguage)
subclass for [Lezer](https://lezer.codemirror.net/) LR parsers, or
via the [`StreamLanguage`](https://codemirror.net/6/docs/ref/#language.StreamLanguage) subclass
for stream parsers.
*/
            class Language {
                /**
    Construct a language object. If you need to invoke this
    directly, first define a data facet with
    [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
    configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
    to the language's outer syntax node.
    */
                constructor(
                    /**
    The [language data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt) facet
    used for this language.
    */
                    data,
                    parser,
                    extraExtensions = []
                ) {
                    this.data = data;
                    // Kludge to define EditorState.tree as a debugging helper,
                    // without the EditorState package actually knowing about
                    // languages and lezer trees.
                    if (
                        !state_dist /* EditorState.prototype.hasOwnProperty */.yy.prototype
                            .hasOwnProperty("tree")
                    )
                        Object.defineProperty(
                            state_dist /* EditorState.prototype */.yy.prototype,
                            "tree",
                            {
                                get() {
                                    return dist_syntaxTree(this);
                                },
                            }
                        );
                    this.parser = parser;
                    this.extension = [
                        language.of(this),
                        state_dist /* EditorState.languageData.of */.yy.languageData
                            .of((state, pos, side) =>
                                state.facet(
                                    languageDataFacetAt(state, pos, side)
                                )
                            ),
                    ].concat(extraExtensions);
                }
                /**
    Query whether this language is active at the given position.
    */
                isActiveAt(state, pos, side = -1) {
                    return languageDataFacetAt(state, pos, side) == this.data;
                }
                /**
    Find the document regions that were parsed using this language.
    The returned regions will _include_ any nested languages rooted
    in this language, when those exist.
    */
                findRegions(state) {
                    let lang = state.facet(language);
                    if (
                        (lang === null || lang === void 0
                            ? void 0
                            : lang.data) == this.data
                    )
                        return [{ from: 0, to: state.doc.length }];
                    if (!lang || !lang.allowsNesting) return [];
                    let result = [];
                    let explore = (tree, from) => {
                        if (tree.prop(languageDataProp) == this.data) {
                            result.push({ from, to: from + tree.length });
                            return;
                        }
                        let mount = tree.prop(dist_NodeProp.mounted);
                        if (mount) {
                            if (
                                mount.tree.prop(languageDataProp) == this.data
                            ) {
                                if (mount.overlay)
                                    for (let r of mount.overlay)
                                        result.push({
                                            from: r.from + from,
                                            to: r.to + from,
                                        });
                                else
                                    result.push({
                                        from: from,
                                        to: from + tree.length,
                                    });
                                return;
                            } else if (mount.overlay) {
                                let size = result.length;
                                explore(
                                    mount.tree,
                                    mount.overlay[0].from + from
                                );
                                if (result.length > size) return;
                            }
                        }
                        for (let i = 0; i < tree.children.length; i++) {
                            let ch = tree.children[i];
                            if (ch instanceof dist_Tree)
                                explore(ch, tree.positions[i] + from);
                        }
                    };
                    explore(dist_syntaxTree(state), 0);
                    return result;
                }
                /**
    Indicates whether this language allows nested languages. The
    default implementation returns true.
    */
                get allowsNesting() {
                    return true;
                }
            }
            /**
@internal
*/
            Language.setState =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            function languageDataFacetAt(state, pos, side) {
                let topLang = state.facet(language);
                if (!topLang) return null;
                let facet = topLang.data;
                if (topLang.allowsNesting) {
                    for (
                        let node = dist_syntaxTree(state).topNode;
                        node;
                        node = node.enter(pos, side, IterMode.ExcludeBuffers)
                    )
                        facet = node.type.prop(languageDataProp) || facet;
                }
                return facet;
            }
            /**
A subclass of [`Language`](https://codemirror.net/6/docs/ref/#language.Language) for use with Lezer
[LR parsers](https://lezer.codemirror.net/docs/ref#lr.LRParser)
parsers.
*/
            class LRLanguage
                extends /* unused pure expression or super */ (null &&
                    Language)
            {
                constructor(data, parser) {
                    super(data, parser);
                    this.parser = parser;
                }
                /**
    Define a language from a parser.
    */
                static define(spec) {
                    let data = defineLanguageFacet(spec.languageData);
                    return new LRLanguage(
                        data,
                        spec.parser.configure({
                            props: [
                                languageDataProp.add((type) =>
                                    type.isTop ? data : undefined
                                ),
                            ],
                        })
                    );
                }
                /**
    Create a new instance of this language with a reconfigured
    version of its parser.
    */
                configure(options) {
                    return new LRLanguage(
                        this.data,
                        this.parser.configure(options)
                    );
                }
                get allowsNesting() {
                    return this.parser.hasWrappers();
                }
            }
            /**
Get the syntax tree for a state, which is the current (possibly
incomplete) parse tree of the active
[language](https://codemirror.net/6/docs/ref/#language.Language), or the empty tree if there is no
language available.
*/
            function dist_syntaxTree(state) {
                let field = state.field(Language.state, false);
                return field ? field.tree : dist_Tree.empty;
            }
            /**
Try to get a parse tree that spans at least up to `upto`. The
method will do at most `timeout` milliseconds of work to parse
up to that point if the tree isn't already available.
*/
            function ensureSyntaxTree(state, upto, timeout = 50) {
                var _a;
                let parse =
                    (_a = state.field(Language.state, false)) === null ||
                    _a === void 0
                        ? void 0
                        : _a.context;
                return !parse
                    ? null
                    : parse.isDone(upto) || parse.work(timeout, upto)
                    ? parse.tree
                    : null;
            }
            /**
Queries whether there is a full syntax tree available up to the
given document position. If there isn't, the background parse
process _might_ still be working and update the tree further, but
there is no guarantee of that—the parser will [stop
working](https://codemirror.net/6/docs/ref/#language.syntaxParserRunning) when it has spent a
certain amount of time or has moved beyond the visible viewport.
Always returns false if no language has been enabled.
*/
            function syntaxTreeAvailable(state, upto = state.doc.length) {
                var _a;
                return (
                    ((_a = state.field(Language.state, false)) === null ||
                    _a === void 0
                        ? void 0
                        : _a.context.isDone(upto)) || false
                );
            }
            /**
Move parsing forward, and update the editor state afterwards to
reflect the new tree. Will work for at most `timeout`
milliseconds. Returns true if the parser managed get to the given
position in that time.
*/
            function forceParsing(
                view,
                upto = view.viewport.to,
                timeout = 100
            ) {
                let success = ensureSyntaxTree(view.state, upto, timeout);
                if (success != dist_syntaxTree(view.state)) view.dispatch({});
                return !!success;
            }
            /**
Tells you whether the language parser is planning to do more
parsing work (in a `requestIdleCallback` pseudo-thread) or has
stopped running, either because it parsed the entire document,
because it spent too much time and was cut off, or because there
is no language parser enabled.
*/
            function syntaxParserRunning(view) {
                var _a;
                return (
                    ((_a = view.plugin(parseWorker)) === null || _a === void 0
                        ? void 0
                        : _a.isWorking()) || false
                );
            }
            // Lezer-style Input object for a Text document.
            class DocInput {
                constructor(doc, length = doc.length) {
                    this.doc = doc;
                    this.length = length;
                    this.cursorPos = 0;
                    this.string = "";
                    this.cursor = doc.iter();
                }
                syncTo(pos) {
                    this.string = this.cursor.next(pos - this.cursorPos).value;
                    this.cursorPos = pos + this.string.length;
                    return this.cursorPos - this.string.length;
                }
                chunk(pos) {
                    this.syncTo(pos);
                    return this.string;
                }
                get lineChunks() {
                    return true;
                }
                read(from, to) {
                    let stringStart = this.cursorPos - this.string.length;
                    if (from < stringStart || to >= this.cursorPos)
                        return this.doc.sliceString(from, to);
                    else
                        return this.string.slice(
                            from - stringStart,
                            to - stringStart
                        );
                }
            }
            let currentContext = null;
            /**
A parse context provided to parsers working on the editor content.
*/
            class ParseContext {
                constructor(
                    parser,
                    /**
    The current editor state.
    */
                    state,
                    /**
    Tree fragments that can be reused by incremental re-parses.
    */
                    fragments = [],
                    /**
    @internal
    */
                    tree,
                    /**
    @internal
    */
                    treeLen,
                    /**
    The current editor viewport (or some overapproximation
    thereof). Intended to be used for opportunistically avoiding
    work (in which case
    [`skipUntilInView`](https://codemirror.net/6/docs/ref/#language.ParseContext.skipUntilInView)
    should be called to make sure the parser is restarted when the
    skipped region becomes visible).
    */
                    viewport,
                    /**
    @internal
    */
                    skipped,
                    /**
    This is where skipping parsers can register a promise that,
    when resolved, will schedule a new parse. It is cleared when
    the parse worker picks up the promise. @internal
    */
                    scheduleOn
                ) {
                    this.parser = parser;
                    this.state = state;
                    this.fragments = fragments;
                    this.tree = tree;
                    this.treeLen = treeLen;
                    this.viewport = viewport;
                    this.skipped = skipped;
                    this.scheduleOn = scheduleOn;
                    this.parse = null;
                    /**
        @internal
        */
                    this.tempSkipped = [];
                }
                /**
    @internal
    */
                static create(parser, state, viewport) {
                    return new ParseContext(
                        parser,
                        state,
                        [],
                        dist_Tree.empty,
                        0,
                        viewport,
                        [],
                        null
                    );
                }
                startParse() {
                    return this.parser.startParse(
                        new DocInput(this.state.doc),
                        this.fragments
                    );
                }
                /**
    @internal
    */
                work(until, upto) {
                    if (upto != null && upto >= this.state.doc.length)
                        upto = undefined;
                    if (
                        this.tree != dist_Tree.empty &&
                        this.isDone(
                            upto !== null && upto !== void 0
                                ? upto
                                : this.state.doc.length
                        )
                    ) {
                        this.takeTree();
                        return true;
                    }
                    return this.withContext(() => {
                        var _a;
                        if (typeof until == "number") {
                            let endTime = Date.now() + until;
                            until = () => Date.now() > endTime;
                        }
                        if (!this.parse) this.parse = this.startParse();
                        if (
                            upto != null &&
                            (this.parse.stoppedAt == null ||
                                this.parse.stoppedAt > upto) &&
                            upto < this.state.doc.length
                        )
                            this.parse.stopAt(upto);
                        for (;;) {
                            let done = this.parse.advance();
                            if (done) {
                                this.fragments = this.withoutTempSkipped(
                                    TreeFragment.addTree(
                                        done,
                                        this.fragments,
                                        this.parse.stoppedAt != null
                                    )
                                );
                                this.treeLen =
                                    (_a = this.parse.stoppedAt) !== null &&
                                    _a !== void 0
                                        ? _a
                                        : this.state.doc.length;
                                this.tree = done;
                                this.parse = null;
                                if (
                                    this.treeLen <
                                    (upto !== null && upto !== void 0
                                        ? upto
                                        : this.state.doc.length)
                                )
                                    this.parse = this.startParse();
                                else return true;
                            }
                            if (until()) return false;
                        }
                    });
                }
                /**
    @internal
    */
                takeTree() {
                    let pos, tree;
                    if (
                        this.parse &&
                        (pos = this.parse.parsedPos) >= this.treeLen
                    ) {
                        if (
                            this.parse.stoppedAt == null ||
                            this.parse.stoppedAt > pos
                        )
                            this.parse.stopAt(pos);
                        this.withContext(() => {
                            while (!(tree = this.parse.advance())) {}
                        });
                        this.treeLen = pos;
                        this.tree = tree;
                        this.fragments = this.withoutTempSkipped(
                            TreeFragment.addTree(
                                this.tree,
                                this.fragments,
                                true
                            )
                        );
                        this.parse = null;
                    }
                }
                withContext(f) {
                    let prev = currentContext;
                    currentContext = this;
                    try {
                        return f();
                    } finally {
                        currentContext = prev;
                    }
                }
                withoutTempSkipped(fragments) {
                    for (let r; (r = this.tempSkipped.pop()); )
                        fragments = cutFragments(fragments, r.from, r.to);
                    return fragments;
                }
                /**
    @internal
    */
                changes(changes, newState) {
                    let { fragments, tree, treeLen, viewport, skipped } = this;
                    this.takeTree();
                    if (!changes.empty) {
                        let ranges = [];
                        changes.iterChangedRanges((fromA, toA, fromB, toB) =>
                            ranges.push({ fromA, toA, fromB, toB })
                        );
                        fragments = TreeFragment.applyChanges(
                            fragments,
                            ranges
                        );
                        tree = dist_Tree.empty;
                        treeLen = 0;
                        viewport = {
                            from: changes.mapPos(viewport.from, -1),
                            to: changes.mapPos(viewport.to, 1),
                        };
                        if (this.skipped.length) {
                            skipped = [];
                            for (let r of this.skipped) {
                                let from = changes.mapPos(r.from, 1),
                                    to = changes.mapPos(r.to, -1);
                                if (from < to) skipped.push({ from, to });
                            }
                        }
                    }
                    return new ParseContext(
                        this.parser,
                        newState,
                        fragments,
                        tree,
                        treeLen,
                        viewport,
                        skipped,
                        this.scheduleOn
                    );
                }
                /**
    @internal
    */
                updateViewport(viewport) {
                    if (
                        this.viewport.from == viewport.from &&
                        this.viewport.to == viewport.to
                    )
                        return false;
                    this.viewport = viewport;
                    let startLen = this.skipped.length;
                    for (let i = 0; i < this.skipped.length; i++) {
                        let { from, to } = this.skipped[i];
                        if (from < viewport.to && to > viewport.from) {
                            this.fragments = cutFragments(
                                this.fragments,
                                from,
                                to
                            );
                            this.skipped.splice(i--, 1);
                        }
                    }
                    if (this.skipped.length >= startLen) return false;
                    this.reset();
                    return true;
                }
                /**
    @internal
    */
                reset() {
                    if (this.parse) {
                        this.takeTree();
                        this.parse = null;
                    }
                }
                /**
    Notify the parse scheduler that the given region was skipped
    because it wasn't in view, and the parse should be restarted
    when it comes into view.
    */
                skipUntilInView(from, to) {
                    this.skipped.push({ from, to });
                }
                /**
    Returns a parser intended to be used as placeholder when
    asynchronously loading a nested parser. It'll skip its input and
    mark it as not-really-parsed, so that the next update will parse
    it again.
    
    When `until` is given, a reparse will be scheduled when that
    promise resolves.
    */
                static getSkippingParser(until) {
                    return new (class extends dist_Parser {
                        createParse(input, fragments, ranges) {
                            let from = ranges[0].from,
                                to = ranges[ranges.length - 1].to;
                            let parser = {
                                parsedPos: from,
                                advance() {
                                    let cx = currentContext;
                                    if (cx) {
                                        for (let r of ranges)
                                            cx.tempSkipped.push(r);
                                        if (until)
                                            cx.scheduleOn = cx.scheduleOn
                                                ? Promise.all([
                                                      cx.scheduleOn,
                                                      until,
                                                  ])
                                                : until;
                                    }
                                    this.parsedPos = to;
                                    return new dist_Tree(
                                        dist_NodeType.none,
                                        [],
                                        [],
                                        to - from
                                    );
                                },
                                stoppedAt: null,
                                stopAt() {},
                            };
                            return parser;
                        }
                    })();
                }
                /**
    @internal
    */
                isDone(upto) {
                    upto = Math.min(upto, this.state.doc.length);
                    let frags = this.fragments;
                    return (
                        this.treeLen >= upto &&
                        frags.length &&
                        frags[0].from == 0 &&
                        frags[0].to >= upto
                    );
                }
                /**
    Get the context for the current parse, or `null` if no editor
    parse is in progress.
    */
                static get() {
                    return currentContext;
                }
            }
            function cutFragments(fragments, from, to) {
                return TreeFragment.applyChanges(fragments, [
                    { fromA: from, toA: to, fromB: from, toB: to },
                ]);
            }
            class LanguageState {
                constructor(
                    // A mutable parse state that is used to preserve work done during
                    // the lifetime of a state when moving to the next state.
                    context
                ) {
                    this.context = context;
                    this.tree = context.tree;
                }
                apply(tr) {
                    if (!tr.docChanged && this.tree == this.context.tree)
                        return this;
                    let newCx = this.context.changes(tr.changes, tr.state);
                    // If the previous parse wasn't done, go forward only up to its
                    // end position or the end of the viewport, to avoid slowing down
                    // state updates with parse work beyond the viewport.
                    let upto =
                        this.context.treeLen == tr.startState.doc.length
                            ? undefined
                            : Math.max(
                                  tr.changes.mapPos(this.context.treeLen),
                                  newCx.viewport.to
                              );
                    if (!newCx.work(20 /* Apply */, upto)) newCx.takeTree();
                    return new LanguageState(newCx);
                }
                static init(state) {
                    let vpTo = Math.min(
                        3000 /* InitViewport */,
                        state.doc.length
                    );
                    let parseState = ParseContext.create(
                        state.facet(language).parser,
                        state,
                        { from: 0, to: vpTo }
                    );
                    if (!parseState.work(20 /* Apply */, vpTo))
                        parseState.takeTree();
                    return new LanguageState(parseState);
                }
            }
            Language.state =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create: LanguageState.init,
                    update(value, tr) {
                        for (let e of tr.effects)
                            if (e.is(Language.setState)) return e.value;
                        if (
                            tr.startState.facet(language) !=
                            tr.state.facet(language)
                        )
                            return LanguageState.init(tr.state);
                        return value.apply(tr);
                    },
                });
            let requestIdle = (callback) => {
                let timeout = setTimeout(() => callback(), 500 /* MaxPause */);
                return () => clearTimeout(timeout);
            };
            if (typeof requestIdleCallback != "undefined")
                requestIdle = (callback) => {
                    let idle = -1,
                        timeout = setTimeout(() => {
                            idle = requestIdleCallback(callback, {
                                timeout:
                                    500 /* MaxPause */ - 100 /* MinPause */,
                            });
                        }, 100 /* MinPause */);
                    return () =>
                        idle < 0
                            ? clearTimeout(timeout)
                            : cancelIdleCallback(idle);
                };
            const isInputPending =
                typeof navigator != "undefined" &&
                ((_a = navigator.scheduling) === null || _a === void 0
                    ? void 0
                    : _a.isInputPending)
                    ? () => navigator.scheduling.isInputPending()
                    : null;
            const parseWorker = /*@__PURE__*/ dist /* ViewPlugin.fromClass */.lg
                .fromClass(
                    class ParseWorker {
                        constructor(view) {
                            this.view = view;
                            this.working = null;
                            this.workScheduled = 0;
                            // End of the current time chunk
                            this.chunkEnd = -1;
                            // Milliseconds of budget left for this chunk
                            this.chunkBudget = -1;
                            this.work = this.work.bind(this);
                            this.scheduleWork();
                        }
                        update(update) {
                            let cx = this.view.state.field(
                                Language.state
                            ).context;
                            if (
                                cx.updateViewport(update.view.viewport) ||
                                this.view.viewport.to > cx.treeLen
                            )
                                this.scheduleWork();
                            if (update.docChanged) {
                                if (this.view.hasFocus)
                                    this.chunkBudget += 50 /* ChangeBonus */;
                                this.scheduleWork();
                            }
                            this.checkAsyncSchedule(cx);
                        }
                        scheduleWork() {
                            if (this.working) return;
                            let { state } = this.view,
                                field = state.field(Language.state);
                            if (
                                field.tree != field.context.tree ||
                                !field.context.isDone(state.doc.length)
                            )
                                this.working = requestIdle(this.work);
                        }
                        work(deadline) {
                            this.working = null;
                            let now = Date.now();
                            if (
                                this.chunkEnd < now &&
                                (this.chunkEnd < 0 || this.view.hasFocus)
                            ) {
                                // Start a new chunk
                                this.chunkEnd = now + 30000 /* ChunkTime */;
                                this.chunkBudget = 3000 /* ChunkBudget */;
                            }
                            if (this.chunkBudget <= 0) return; // No more budget
                            let {
                                    state,
                                    viewport: { to: vpTo },
                                } = this.view,
                                field = state.field(Language.state);
                            if (
                                field.tree == field.context.tree &&
                                field.context.isDone(
                                    vpTo + 100000 /* MaxParseAhead */
                                )
                            )
                                return;
                            let endTime =
                                Date.now() +
                                Math.min(
                                    this.chunkBudget,
                                    100 /* Slice */,
                                    deadline && !isInputPending
                                        ? Math.max(
                                              25 /* MinSlice */,
                                              deadline.timeRemaining() - 5
                                          )
                                        : 1e9
                                );
                            let viewportFirst =
                                field.context.treeLen < vpTo &&
                                state.doc.length > vpTo + 1000;
                            let done = field.context.work(() => {
                                return (
                                    (isInputPending && isInputPending()) ||
                                    Date.now() > endTime
                                );
                            }, vpTo + (viewportFirst ? 0 : 100000) /* MaxParseAhead */);
                            this.chunkBudget -= Date.now() - now;
                            if (done || this.chunkBudget <= 0) {
                                field.context.takeTree();
                                this.view.dispatch({
                                    effects: Language.setState.of(
                                        new LanguageState(field.context)
                                    ),
                                });
                            }
                            if (
                                this.chunkBudget > 0 &&
                                !(done && !viewportFirst)
                            )
                                this.scheduleWork();
                            this.checkAsyncSchedule(field.context);
                        }
                        checkAsyncSchedule(cx) {
                            if (cx.scheduleOn) {
                                this.workScheduled++;
                                cx.scheduleOn
                                    .then(() => this.scheduleWork())
                                    .catch((err) =>
                                        (0, dist /* logException */.OO)(
                                            this.view.state,
                                            err
                                        )
                                    )
                                    .then(() => this.workScheduled--);
                                cx.scheduleOn = null;
                            }
                        }
                        destroy() {
                            if (this.working) this.working();
                        }
                        isWorking() {
                            return !!(this.working || this.workScheduled > 0);
                        }
                    },
                    {
                        eventHandlers: {
                            focus() {
                                this.scheduleWork();
                            },
                        },
                    }
                );
            /**
The facet used to associate a language with an editor state.
*/
            const language = /*@__PURE__*/ state_dist /* Facet.define */.r$
                .define({
                    combine(languages) {
                        return languages.length ? languages[0] : null;
                    },
                    enables: [Language.state, parseWorker],
                });
            /**
This class bundles a [language](https://codemirror.net/6/docs/ref/#language.Language) with an
optional set of supporting extensions. Language packages are
encouraged to export a function that optionally takes a
configuration object and returns a `LanguageSupport` instance, as
the main way for client code to use the package.
*/
            class LanguageSupport {
                /**
    Create a language support object.
    */
                constructor(
                    /**
    The language object.
    */
                    language,
                    /**
    An optional set of supporting extensions. When nesting a
    language in another language, the outer language is encouraged
    to include the supporting extensions for its inner languages
    in its own set of support extensions.
    */
                    support = []
                ) {
                    this.language = language;
                    this.support = support;
                    this.extension = [language, support];
                }
            }
            /**
Language descriptions are used to store metadata about languages
and to dynamically load them. Their main role is finding the
appropriate language for a filename or dynamically loading nested
parsers.
*/
            class LanguageDescription {
                constructor(
                    /**
    The name of this language.
    */
                    name,
                    /**
    Alternative names for the mode (lowercased, includes `this.name`).
    */
                    alias,
                    /**
    File extensions associated with this language.
    */
                    extensions,
                    /**
    Optional filename pattern that should be associated with this
    language.
    */
                    filename,
                    loadFunc,
                    /**
    If the language has been loaded, this will hold its value.
    */
                    support = undefined
                ) {
                    this.name = name;
                    this.alias = alias;
                    this.extensions = extensions;
                    this.filename = filename;
                    this.loadFunc = loadFunc;
                    this.support = support;
                    this.loading = null;
                }
                /**
    Start loading the the language. Will return a promise that
    resolves to a [`LanguageSupport`](https://codemirror.net/6/docs/ref/#language.LanguageSupport)
    object when the language successfully loads.
    */
                load() {
                    return (
                        this.loading ||
                        (this.loading = this.loadFunc().then(
                            (support) => (this.support = support),
                            (err) => {
                                this.loading = null;
                                throw err;
                            }
                        ))
                    );
                }
                /**
    Create a language description.
    */
                static of(spec) {
                    let { load, support } = spec;
                    if (!load) {
                        if (!support)
                            throw new RangeError(
                                "Must pass either 'load' or 'support' to LanguageDescription.of"
                            );
                        load = () => Promise.resolve(support);
                    }
                    return new LanguageDescription(
                        spec.name,
                        (spec.alias || [])
                            .concat(spec.name)
                            .map((s) => s.toLowerCase()),
                        spec.extensions || [],
                        spec.filename,
                        load,
                        support
                    );
                }
                /**
    Look for a language in the given array of descriptions that
    matches the filename. Will first match
    [`filename`](https://codemirror.net/6/docs/ref/#language.LanguageDescription.filename) patterns,
    and then [extensions](https://codemirror.net/6/docs/ref/#language.LanguageDescription.extensions),
    and return the first language that matches.
    */
                static matchFilename(descs, filename) {
                    for (let d of descs)
                        if (d.filename && d.filename.test(filename)) return d;
                    let ext = /\.([^.]+)$/.exec(filename);
                    if (ext)
                        for (let d of descs)
                            if (d.extensions.indexOf(ext[1]) > -1) return d;
                    return null;
                }
                /**
    Look for a language whose name or alias matches the the given
    name (case-insensitively). If `fuzzy` is true, and no direct
    matchs is found, this'll also search for a language whose name
    or alias occurs in the string (for names shorter than three
    characters, only when surrounded by non-word characters).
    */
                static matchLanguageName(descs, name, fuzzy = true) {
                    name = name.toLowerCase();
                    for (let d of descs)
                        if (d.alias.some((a) => a == name)) return d;
                    if (fuzzy)
                        for (let d of descs)
                            for (let a of d.alias) {
                                let found = name.indexOf(a);
                                if (
                                    found > -1 &&
                                    (a.length > 2 ||
                                        (!/\w/.test(name[found - 1]) &&
                                            !/\w/.test(name[found + a.length])))
                                )
                                    return d;
                            }
                    return null;
                }
            }

            /**
Facet that defines a way to provide a function that computes the
appropriate indentation depth at the start of a given line, or
`null` to indicate no appropriate indentation could be determined.
*/
            const indentService = /*@__PURE__*/ state_dist /* Facet.define */.r$
                .define();
            /**
Facet for overriding the unit by which indentation happens.
Should be a string consisting either entirely of spaces or
entirely of tabs. When not set, this defaults to 2 spaces.
*/
            const dist_indentUnit =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define({
                        combine: (values) => {
                            if (!values.length) return "  ";
                            if (!/^(?: +|\t+)$/.test(values[0]))
                                throw new Error(
                                    "Invalid indent unit: " +
                                        JSON.stringify(values[0])
                                );
                            return values[0];
                        },
                    });
            /**
Return the _column width_ of an indent unit in the state.
Determined by the [`indentUnit`](https://codemirror.net/6/docs/ref/#language.indentUnit)
facet, and [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) when that
contains tabs.
*/
            function getIndentUnit(state) {
                let unit = state.facet(dist_indentUnit);
                return unit.charCodeAt(0) == 9
                    ? state.tabSize * unit.length
                    : unit.length;
            }
            /**
Create an indentation string that covers columns 0 to `cols`.
Will use tabs for as much of the columns as possible when the
[`indentUnit`](https://codemirror.net/6/docs/ref/#language.indentUnit) facet contains
tabs.
*/
            function indentString(state, cols) {
                let result = "",
                    ts = state.tabSize;
                if (state.facet(dist_indentUnit).charCodeAt(0) == 9)
                    while (cols >= ts) {
                        result += "\t";
                        cols -= ts;
                    }
                for (let i = 0; i < cols; i++) result += " ";
                return result;
            }
            /**
Get the indentation at the given position. Will first consult any
[indent services](https://codemirror.net/6/docs/ref/#language.indentService) that are registered,
and if none of those return an indentation, this will check the
syntax tree for the [indent node prop](https://codemirror.net/6/docs/ref/#language.indentNodeProp)
and use that if found. Returns a number when an indentation could
be determined, and null otherwise.
*/
            function getIndentation(context, pos) {
                if (context instanceof state_dist /* EditorState */.yy)
                    context = new IndentContext(context);
                for (let service of context.state.facet(indentService)) {
                    let result = service(context, pos);
                    if (result != null) return result;
                }
                let tree = dist_syntaxTree(context.state);
                return tree ? syntaxIndentation(context, tree, pos) : null;
            }
            /**
Indentation contexts are used when calling [indentation
services](https://codemirror.net/6/docs/ref/#language.indentService). They provide helper utilities
useful in indentation logic, and can selectively override the
indentation reported for some lines.
*/
            class IndentContext {
                /**
    Create an indent context.
    */
                constructor(
                    /**
    The editor state.
    */
                    state,
                    /**
    @internal
    */
                    options = {}
                ) {
                    this.state = state;
                    this.options = options;
                    this.unit = getIndentUnit(state);
                }
                /**
    Get a description of the line at the given position, taking
    [simulated line
    breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
    into account. If there is such a break at `pos`, the `bias`
    argument determines whether the part of the line line before or
    after the break is used.
    */
                lineAt(pos, bias = 1) {
                    let line = this.state.doc.lineAt(pos);
                    let { simulateBreak, simulateDoubleBreak } = this.options;
                    if (
                        simulateBreak != null &&
                        simulateBreak >= line.from &&
                        simulateBreak <= line.to
                    ) {
                        if (simulateDoubleBreak && simulateBreak == pos)
                            return { text: "", from: pos };
                        else if (
                            bias < 0
                                ? simulateBreak < pos
                                : simulateBreak <= pos
                        )
                            return {
                                text: line.text.slice(
                                    simulateBreak - line.from
                                ),
                                from: simulateBreak,
                            };
                        else
                            return {
                                text: line.text.slice(
                                    0,
                                    simulateBreak - line.from
                                ),
                                from: line.from,
                            };
                    }
                    return line;
                }
                /**
    Get the text directly after `pos`, either the entire line
    or the next 100 characters, whichever is shorter.
    */
                textAfterPos(pos, bias = 1) {
                    if (
                        this.options.simulateDoubleBreak &&
                        pos == this.options.simulateBreak
                    )
                        return "";
                    let { text, from } = this.lineAt(pos, bias);
                    return text.slice(
                        pos - from,
                        Math.min(text.length, pos + 100 - from)
                    );
                }
                /**
    Find the column for the given position.
    */
                column(pos, bias = 1) {
                    let { text, from } = this.lineAt(pos, bias);
                    let result = this.countColumn(text, pos - from);
                    let override = this.options.overrideIndentation
                        ? this.options.overrideIndentation(from)
                        : -1;
                    if (override > -1)
                        result +=
                            override -
                            this.countColumn(text, text.search(/\S|$/));
                    return result;
                }
                /**
    Find the column position (taking tabs into account) of the given
    position in the given string.
    */
                countColumn(line, pos = line.length) {
                    return (0, state_dist /* countColumn */.IS)(
                        line,
                        this.state.tabSize,
                        pos
                    );
                }
                /**
    Find the indentation column of the line at the given point.
    */
                lineIndent(pos, bias = 1) {
                    let { text, from } = this.lineAt(pos, bias);
                    let override = this.options.overrideIndentation;
                    if (override) {
                        let overriden = override(from);
                        if (overriden > -1) return overriden;
                    }
                    return this.countColumn(text, text.search(/\S|$/));
                }
                /**
    Returns the [simulated line
    break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
    for this context, if any.
    */
                get simulatedBreak() {
                    return this.options.simulateBreak || null;
                }
            }
            /**
A syntax tree node prop used to associate indentation strategies
with node types. Such a strategy is a function from an indentation
context to a column number or null, where null indicates that no
definitive indentation can be determined.
*/
            const indentNodeProp = /*@__PURE__*/ new dist_NodeProp();
            // Compute the indentation for a given position from the syntax tree.
            function syntaxIndentation(cx, ast, pos) {
                return indentFrom(
                    ast.resolveInner(pos).enterUnfinishedNodesBefore(pos),
                    pos,
                    cx
                );
            }
            function ignoreClosed(cx) {
                return (
                    cx.pos == cx.options.simulateBreak &&
                    cx.options.simulateDoubleBreak
                );
            }
            function indentStrategy(tree) {
                let strategy = tree.type.prop(indentNodeProp);
                if (strategy) return strategy;
                let first = tree.firstChild,
                    close;
                if (
                    first &&
                    (close = first.type.prop(dist_NodeProp.closedBy))
                ) {
                    let last = tree.lastChild,
                        closed = last && close.indexOf(last.name) > -1;
                    return (cx) =>
                        delimitedStrategy(
                            cx,
                            true,
                            1,
                            undefined,
                            closed && !ignoreClosed(cx) ? last.from : undefined
                        );
                }
                return tree.parent == null ? topIndent : null;
            }
            function indentFrom(node, pos, base) {
                for (; node; node = node.parent) {
                    let strategy = indentStrategy(node);
                    if (strategy)
                        return strategy(
                            TreeIndentContext.create(base, pos, node)
                        );
                }
                return null;
            }
            function topIndent() {
                return 0;
            }
            /**
Objects of this type provide context information and helper
methods to indentation functions registered on syntax nodes.
*/
            class TreeIndentContext extends IndentContext {
                constructor(
                    base,
                    /**
    The position at which indentation is being computed.
    */
                    pos,
                    /**
    The syntax tree node to which the indentation strategy
    applies.
    */
                    node
                ) {
                    super(base.state, base.options);
                    this.base = base;
                    this.pos = pos;
                    this.node = node;
                }
                /**
    @internal
    */
                static create(base, pos, node) {
                    return new TreeIndentContext(base, pos, node);
                }
                /**
    Get the text directly after `this.pos`, either the entire line
    or the next 100 characters, whichever is shorter.
    */
                get textAfter() {
                    return this.textAfterPos(this.pos);
                }
                /**
    Get the indentation at the reference line for `this.node`, which
    is the line on which it starts, unless there is a node that is
    _not_ a parent of this node covering the start of that line. If
    so, the line at the start of that node is tried, again skipping
    on if it is covered by another such node.
    */
                get baseIndent() {
                    let line = this.state.doc.lineAt(this.node.from);
                    // Skip line starts that are covered by a sibling (or cousin, etc)
                    for (;;) {
                        let atBreak = this.node.resolve(line.from);
                        while (
                            atBreak.parent &&
                            atBreak.parent.from == atBreak.from
                        )
                            atBreak = atBreak.parent;
                        if (isParent(atBreak, this.node)) break;
                        line = this.state.doc.lineAt(atBreak.from);
                    }
                    return this.lineIndent(line.from);
                }
                /**
    Continue looking for indentations in the node's parent nodes,
    and return the result of that.
    */
                continue() {
                    let parent = this.node.parent;
                    return parent ? indentFrom(parent, this.pos, this.base) : 0;
                }
            }
            function isParent(parent, of) {
                for (let cur = of; cur; cur = cur.parent)
                    if (parent == cur) return true;
                return false;
            }
            // Check whether a delimited node is aligned (meaning there are
            // non-skipped nodes on the same line as the opening delimiter). And
            // if so, return the opening token.
            function bracketedAligned(context) {
                let tree = context.node;
                let openToken = tree.childAfter(tree.from),
                    last = tree.lastChild;
                if (!openToken) return null;
                let sim = context.options.simulateBreak;
                let openLine = context.state.doc.lineAt(openToken.from);
                let lineEnd =
                    sim == null || sim <= openLine.from
                        ? openLine.to
                        : Math.min(openLine.to, sim);
                for (let pos = openToken.to; ; ) {
                    let next = tree.childAfter(pos);
                    if (!next || next == last) return null;
                    if (!next.type.isSkipped)
                        return next.from < lineEnd ? openToken : null;
                    pos = next.to;
                }
            }
            /**
An indentation strategy for delimited (usually bracketed) nodes.
Will, by default, indent one unit more than the parent's base
indent unless the line starts with a closing token. When `align`
is true and there are non-skipped nodes on the node's opening
line, the content of the node will be aligned with the end of the
opening node, like this:

    foo(bar,
        baz)
*/
            function delimitedIndent({ closing, align = true, units = 1 }) {
                return (context) =>
                    delimitedStrategy(context, align, units, closing);
            }
            function delimitedStrategy(
                context,
                align,
                units,
                closing,
                closedAt
            ) {
                let after = context.textAfter,
                    space = after.match(/^\s*/)[0].length;
                let closed =
                    (closing &&
                        after.slice(space, space + closing.length) ==
                            closing) ||
                    closedAt == context.pos + space;
                let aligned = align ? bracketedAligned(context) : null;
                if (aligned)
                    return closed
                        ? context.column(aligned.from)
                        : context.column(aligned.to);
                return context.baseIndent + (closed ? 0 : context.unit * units);
            }
            /**
An indentation strategy that aligns a node's content to its base
indentation.
*/
            const flatIndent = (context) => context.baseIndent;
            /**
Creates an indentation strategy that, by default, indents
continued lines one unit more than the node's base indentation.
You can provide `except` to prevent indentation of lines that
match a pattern (for example `/^else\b/` in `if`/`else`
constructs), and you can change the amount of units used with the
`units` option.
*/
            function continuedIndent({ except, units = 1 } = {}) {
                return (context) => {
                    let matchExcept = except && except.test(context.textAfter);
                    return (
                        context.baseIndent +
                        (matchExcept ? 0 : units * context.unit)
                    );
                };
            }
            const DontIndentBeyond = 200;
            /**
Enables reindentation on input. When a language defines an
`indentOnInput` field in its [language
data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt), which must hold a regular
expression, the line at the cursor will be reindented whenever new
text is typed and the input from the start of the line up to the
cursor matches that regexp.

To avoid unneccesary reindents, it is recommended to start the
regexp with `^` (usually followed by `\s*`), and end it with `$`.
For example, `/^\s*\}$/` will reindent when a closing brace is
added at the start of a line.
*/
            function indentOnInput() {
                return state_dist /* EditorState.transactionFilter.of */.yy.transactionFilter
                    .of((tr) => {
                        if (
                            !tr.docChanged ||
                            (!tr.isUserEvent("input.type") &&
                                !tr.isUserEvent("input.complete"))
                        )
                            return tr;
                        let rules = tr.startState.languageDataAt(
                            "indentOnInput",
                            tr.startState.selection.main.head
                        );
                        if (!rules.length) return tr;
                        let doc = tr.newDoc,
                            { head } = tr.newSelection.main,
                            line = doc.lineAt(head);
                        if (head > line.from + DontIndentBeyond) return tr;
                        let lineStart = doc.sliceString(line.from, head);
                        if (!rules.some((r) => r.test(lineStart))) return tr;
                        let { state } = tr,
                            last = -1,
                            changes = [];
                        for (let { head } of state.selection.ranges) {
                            let line = state.doc.lineAt(head);
                            if (line.from == last) continue;
                            last = line.from;
                            let indent = getIndentation(state, line.from);
                            if (indent == null) continue;
                            let cur = /^\s*/.exec(line.text)[0];
                            let norm = indentString(state, indent);
                            if (cur != norm)
                                changes.push({
                                    from: line.from,
                                    to: line.from + cur.length,
                                    insert: norm,
                                });
                        }
                        return changes.length
                            ? [tr, { changes, sequential: true }]
                            : tr;
                    });
            }

            /**
A facet that registers a code folding service. When called with
the extent of a line, such a function should return a foldable
range that starts on that line (but continues beyond it), if one
can be found.
*/
            const foldService = /*@__PURE__*/ state_dist /* Facet.define */.r$
                .define();
            /**
This node prop is used to associate folding information with
syntax node types. Given a syntax node, it should check whether
that tree is foldable and return the range that can be collapsed
when it is.
*/
            const foldNodeProp = /*@__PURE__*/ new dist_NodeProp();
            /**
[Fold](https://codemirror.net/6/docs/ref/#language.foldNodeProp) function that folds everything but
the first and the last child of a syntax node. Useful for nodes
that start and end with delimiters.
*/
            function foldInside(node) {
                let first = node.firstChild,
                    last = node.lastChild;
                return first && first.to < last.from
                    ? {
                          from: first.to,
                          to: last.type.isError ? node.to : last.from,
                      }
                    : null;
            }
            function syntaxFolding(state, start, end) {
                let tree = dist_syntaxTree(state);
                if (tree.length < end) return null;
                let inner = tree.resolveInner(end);
                let found = null;
                for (let cur = inner; cur; cur = cur.parent) {
                    if (cur.to <= end || cur.from > end) continue;
                    if (found && cur.from < start) break;
                    let prop = cur.type.prop(foldNodeProp);
                    if (
                        prop &&
                        (cur.to < tree.length - 50 ||
                            tree.length == state.doc.length ||
                            !isUnfinished(cur))
                    ) {
                        let value = prop(cur, state);
                        if (
                            value &&
                            value.from <= end &&
                            value.from >= start &&
                            value.to > end
                        )
                            found = value;
                    }
                }
                return found;
            }
            function isUnfinished(node) {
                let ch = node.lastChild;
                return ch && ch.to == node.to && ch.type.isError;
            }
            /**
Check whether the given line is foldable. First asks any fold
services registered through
[`foldService`](https://codemirror.net/6/docs/ref/#language.foldService), and if none of them return
a result, tries to query the [fold node
prop](https://codemirror.net/6/docs/ref/#language.foldNodeProp) of syntax nodes that cover the end
of the line.
*/
            function foldable(state, lineStart, lineEnd) {
                for (let service of state.facet(foldService)) {
                    let result = service(state, lineStart, lineEnd);
                    if (result) return result;
                }
                return syntaxFolding(state, lineStart, lineEnd);
            }
            function mapRange(range, mapping) {
                let from = mapping.mapPos(range.from, 1),
                    to = mapping.mapPos(range.to, -1);
                return from >= to ? undefined : { from, to };
            }
            /**
State effect that can be attached to a transaction to fold the
given range. (You probably only need this in exceptional
circumstances—usually you'll just want to let
[`foldCode`](https://codemirror.net/6/docs/ref/#language.foldCode) and the [fold
gutter](https://codemirror.net/6/docs/ref/#language.foldGutter) create the transactions.)
*/
            const foldEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define({
                    map: mapRange,
                });
            /**
State effect that unfolds the given range (if it was folded).
*/
            const unfoldEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define({
                    map: mapRange,
                });
            function selectedLines(view) {
                let lines = [];
                for (let { head } of view.state.selection.ranges) {
                    if (lines.some((l) => l.from <= head && l.to >= head))
                        continue;
                    lines.push(view.lineBlockAt(head));
                }
                return lines;
            }
            const foldState =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return dist /* Decoration.none */.p.none;
                    },
                    update(folded, tr) {
                        folded = folded.map(tr.changes);
                        for (let e of tr.effects) {
                            if (
                                e.is(foldEffect) &&
                                !foldExists(folded, e.value.from, e.value.to)
                            )
                                folded = folded.update({
                                    add: [
                                        foldWidget.range(
                                            e.value.from,
                                            e.value.to
                                        ),
                                    ],
                                });
                            else if (e.is(unfoldEffect))
                                folded = folded.update({
                                    filter: (from, to) =>
                                        e.value.from != from ||
                                        e.value.to != to,
                                    filterFrom: e.value.from,
                                    filterTo: e.value.to,
                                });
                        }
                        // Clear folded ranges that cover the selection head
                        if (tr.selection) {
                            let onSelection = false,
                                { head } = tr.selection.main;
                            folded.between(head, head, (a, b) => {
                                if (a < head && b > head) onSelection = true;
                            });
                            if (onSelection)
                                folded = folded.update({
                                    filterFrom: head,
                                    filterTo: head,
                                    filter: (a, b) => b <= head || a >= head,
                                });
                        }
                        return folded;
                    },
                    provide: (f) =>
                        dist /* EditorView.decorations.from */.tk.decorations
                            .from(f),
                });
            /**
Get a [range set](https://codemirror.net/6/docs/ref/#state.RangeSet) containing the folded ranges
in the given state.
*/
            function foldedRanges(state) {
                return state.field(foldState, false) || RangeSet.empty;
            }
            function findFold(state, from, to) {
                var _a;
                let found = null;
                (_a = state.field(foldState, false)) === null || _a === void 0
                    ? void 0
                    : _a.between(from, to, (from, to) => {
                          if (!found || found.from > from) found = { from, to };
                      });
                return found;
            }
            function foldExists(folded, from, to) {
                let found = false;
                folded.between(from, from, (a, b) => {
                    if (a == from && b == to) found = true;
                });
                return found;
            }
            function maybeEnable(state, other) {
                return state.field(foldState, false)
                    ? other
                    : other.concat(
                          state_dist /* StateEffect.appendConfig.of */.Py.appendConfig
                              .of(codeFolding())
                      );
            }
            /**
Fold the lines that are selected, if possible.
*/
            const foldCode = (view) => {
                for (let line of selectedLines(view)) {
                    let range = foldable(view.state, line.from, line.to);
                    if (range) {
                        view.dispatch({
                            effects: maybeEnable(view.state, [
                                foldEffect.of(range),
                                announceFold(view, range),
                            ]),
                        });
                        return true;
                    }
                }
                return false;
            };
            /**
Unfold folded ranges on selected lines.
*/
            const unfoldCode = (view) => {
                if (!view.state.field(foldState, false)) return false;
                let effects = [];
                for (let line of selectedLines(view)) {
                    let folded = findFold(view.state, line.from, line.to);
                    if (folded)
                        effects.push(
                            unfoldEffect.of(folded),
                            announceFold(view, folded, false)
                        );
                }
                if (effects.length) view.dispatch({ effects });
                return effects.length > 0;
            };
            function announceFold(view, range, fold = true) {
                let lineFrom = view.state.doc.lineAt(range.from).number,
                    lineTo = view.state.doc.lineAt(range.to).number;
                return dist /* EditorView.announce.of */.tk.announce
                    .of(
                        `${view.state.phrase(
                            fold ? "Folded lines" : "Unfolded lines"
                        )} ${lineFrom} ${view.state.phrase("to")} ${lineTo}.`
                    );
            }
            /**
Fold all top-level foldable ranges. Note that, in most cases,
folding information will depend on the [syntax
tree](https://codemirror.net/6/docs/ref/#language.syntaxTree), and folding everything may not work
reliably when the document hasn't been fully parsed (either
because the editor state was only just initialized, or because the
document is so big that the parser decided not to parse it
entirely).
*/
            const foldAll = (view) => {
                let { state } = view,
                    effects = [];
                for (let pos = 0; pos < state.doc.length; ) {
                    let line = view.lineBlockAt(pos),
                        range = foldable(state, line.from, line.to);
                    if (range) effects.push(foldEffect.of(range));
                    pos = (range ? view.lineBlockAt(range.to) : line).to + 1;
                }
                if (effects.length)
                    view.dispatch({
                        effects: maybeEnable(view.state, effects),
                    });
                return !!effects.length;
            };
            /**
Unfold all folded code.
*/
            const unfoldAll = (view) => {
                let field = view.state.field(foldState, false);
                if (!field || !field.size) return false;
                let effects = [];
                field.between(0, view.state.doc.length, (from, to) => {
                    effects.push(unfoldEffect.of({ from, to }));
                });
                view.dispatch({ effects });
                return true;
            };
            /**
Default fold-related key bindings.

 - Ctrl-Shift-[ (Cmd-Alt-[ on macOS): [`foldCode`](https://codemirror.net/6/docs/ref/#language.foldCode).
 - Ctrl-Shift-] (Cmd-Alt-] on macOS): [`unfoldCode`](https://codemirror.net/6/docs/ref/#language.unfoldCode).
 - Ctrl-Alt-[: [`foldAll`](https://codemirror.net/6/docs/ref/#language.foldAll).
 - Ctrl-Alt-]: [`unfoldAll`](https://codemirror.net/6/docs/ref/#language.unfoldAll).
*/
            const foldKeymap = [
                { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: foldCode },
                { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: unfoldCode },
                { key: "Ctrl-Alt-[", run: foldAll },
                { key: "Ctrl-Alt-]", run: unfoldAll },
            ];
            const defaultConfig = {
                placeholderDOM: null,
                placeholderText: "…",
            };
            const foldConfig = /*@__PURE__*/ state_dist /* Facet.define */.r$
                .define({
                    combine(values) {
                        return (0, state_dist /* combineConfig */.BO)(
                            values,
                            defaultConfig
                        );
                    },
                });
            /**
Create an extension that configures code folding.
*/
            function codeFolding(config) {
                let result = [foldState, baseTheme$1];
                if (config) result.push(foldConfig.of(config));
                return result;
            }
            const foldWidget = /*@__PURE__*/ dist /* Decoration.replace */.p
                .replace({
                    widget: /*@__PURE__*/ new (class extends dist /* WidgetType */.l9 {
                        toDOM(view) {
                            let { state } = view,
                                conf = state.facet(foldConfig);
                            let onclick = (event) => {
                                let line = view.lineBlockAt(
                                    view.posAtDOM(event.target)
                                );
                                let folded = findFold(
                                    view.state,
                                    line.from,
                                    line.to
                                );
                                if (folded)
                                    view.dispatch({
                                        effects: unfoldEffect.of(folded),
                                    });
                                event.preventDefault();
                            };
                            if (conf.placeholderDOM)
                                return conf.placeholderDOM(view, onclick);
                            let element = document.createElement("span");
                            element.textContent = conf.placeholderText;
                            element.setAttribute(
                                "aria-label",
                                state.phrase("folded code")
                            );
                            element.title = state.phrase("unfold");
                            element.className = "cm-foldPlaceholder";
                            element.onclick = onclick;
                            return element;
                        }
                    })(),
                });
            const foldGutterDefaults = {
                openText: "⌄",
                closedText: "›",
                markerDOM: null,
                domEventHandlers: {},
            };
            class FoldMarker extends dist /* GutterMarker */.SJ {
                constructor(config, open) {
                    super();
                    this.config = config;
                    this.open = open;
                }
                eq(other) {
                    return (
                        this.config == other.config && this.open == other.open
                    );
                }
                toDOM(view) {
                    if (this.config.markerDOM)
                        return this.config.markerDOM(this.open);
                    let span = document.createElement("span");
                    span.textContent = this.open
                        ? this.config.openText
                        : this.config.closedText;
                    span.title = view.state.phrase(
                        this.open ? "Fold line" : "Unfold line"
                    );
                    return span;
                }
            }
            /**
Create an extension that registers a fold gutter, which shows a
fold status indicator before foldable lines (which can be clicked
to fold or unfold the line).
*/
            function foldGutter(config = {}) {
                let fullConfig = Object.assign(
                    Object.assign({}, foldGutterDefaults),
                    config
                );
                let canFold = new FoldMarker(fullConfig, true),
                    canUnfold = new FoldMarker(fullConfig, false);
                let markers = dist /* ViewPlugin.fromClass */.lg
                    .fromClass(
                        class {
                            constructor(view) {
                                this.from = view.viewport.from;
                                this.markers = this.buildMarkers(view);
                            }
                            update(update) {
                                if (
                                    update.docChanged ||
                                    update.viewportChanged ||
                                    update.startState.facet(language) !=
                                        update.state.facet(language) ||
                                    update.startState.field(foldState, false) !=
                                        update.state.field(foldState, false) ||
                                    dist_syntaxTree(update.startState) !=
                                        dist_syntaxTree(update.state)
                                )
                                    this.markers = this.buildMarkers(
                                        update.view
                                    );
                            }
                            buildMarkers(view) {
                                let builder =
                                    new state_dist /* RangeSetBuilder */.f_();
                                for (let line of view.viewportLineBlocks) {
                                    let mark = findFold(
                                        view.state,
                                        line.from,
                                        line.to
                                    )
                                        ? canUnfold
                                        : foldable(
                                              view.state,
                                              line.from,
                                              line.to
                                          )
                                        ? canFold
                                        : null;
                                    if (mark)
                                        builder.add(line.from, line.from, mark);
                                }
                                return builder.finish();
                            }
                        }
                    );
                let { domEventHandlers } = fullConfig;
                return [
                    markers,
                    (0, dist /* gutter */.v5)({
                        class: "cm-foldGutter",
                        markers(view) {
                            var _a;
                            return (
                                ((_a = view.plugin(markers)) === null ||
                                _a === void 0
                                    ? void 0
                                    : _a.markers) ||
                                state_dist /* RangeSet.empty */.Xs.empty
                            );
                        },
                        initialSpacer() {
                            return new FoldMarker(fullConfig, false);
                        },
                        domEventHandlers: Object.assign(
                            Object.assign({}, domEventHandlers),
                            {
                                click: (view, line, event) => {
                                    if (
                                        domEventHandlers.click &&
                                        domEventHandlers.click(
                                            view,
                                            line,
                                            event
                                        )
                                    )
                                        return true;
                                    let folded = findFold(
                                        view.state,
                                        line.from,
                                        line.to
                                    );
                                    if (folded) {
                                        view.dispatch({
                                            effects: unfoldEffect.of(folded),
                                        });
                                        return true;
                                    }
                                    let range = foldable(
                                        view.state,
                                        line.from,
                                        line.to
                                    );
                                    if (range) {
                                        view.dispatch({
                                            effects: foldEffect.of(range),
                                        });
                                        return true;
                                    }
                                    return false;
                                },
                            }
                        ),
                    }),
                    codeFolding(),
                ];
            }
            const baseTheme$1 = /*@__PURE__*/ dist /* EditorView.baseTheme */.tk
                .baseTheme({
                    ".cm-foldPlaceholder": {
                        backgroundColor: "#eee",
                        border: "1px solid #ddd",
                        color: "#888",
                        borderRadius: ".2em",
                        margin: "0 1px",
                        padding: "0 1px",
                        cursor: "pointer",
                    },
                    ".cm-foldGutter span": {
                        padding: "0 1px",
                        cursor: "pointer",
                    },
                });

            /**
A highlight style associates CSS styles with higlighting
[tags](https://lezer.codemirror.net/docs/ref#highlight.Tag).
*/
            class HighlightStyle {
                constructor(spec, options) {
                    let modSpec;
                    function def(spec) {
                        let cls =
                            style_mod /* StyleModule.newName */.V.newName();
                        (modSpec || (modSpec = Object.create(null)))[
                            "." + cls
                        ] = spec;
                        return cls;
                    }
                    const all =
                        typeof options.all == "string"
                            ? options.all
                            : options.all
                            ? def(options.all)
                            : undefined;
                    const scopeOpt = options.scope;
                    this.scope =
                        scopeOpt instanceof Language
                            ? (type) =>
                                  type.prop(languageDataProp) == scopeOpt.data
                            : scopeOpt
                            ? (type) => type == scopeOpt
                            : undefined;
                    this.style = tagHighlighter(
                        spec.map((style) => ({
                            tag: style.tag,
                            class:
                                style.class ||
                                def(Object.assign({}, style, { tag: null })),
                        })),
                        {
                            all,
                        }
                    ).style;
                    this.module = modSpec
                        ? new style_mod /* StyleModule */.V(modSpec)
                        : null;
                    this.themeType = options.themeType;
                }
                /**
    Create a highlighter style that associates the given styles to
    the given tags. The specs must be objects that hold a style tag
    or array of tags in their `tag` property, and either a single
    `class` property providing a static CSS class (for highlighter
    that rely on external styling), or a
    [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
    set of CSS properties (which define the styling for those tags).
    
    The CSS rules created for a highlighter will be emitted in the
    order of the spec's properties. That means that for elements that
    have multiple tags associated with them, styles defined further
    down in the list will have a higher CSS precedence than styles
    defined earlier.
    */
                static define(specs, options) {
                    return new HighlightStyle(specs, options || {});
                }
            }
            const highlighterFacet =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define();
            const fallbackHighlighter =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define({
                        combine(values) {
                            return values.length ? [values[0]] : null;
                        },
                    });
            function getHighlighters(state) {
                let main = state.facet(highlighterFacet);
                return main.length ? main : state.facet(fallbackHighlighter);
            }
            /**
Wrap a highlighter in an editor extension that uses it to apply
syntax highlighting to the editor content.

When multiple (non-fallback) styles are provided, the styling
applied is the union of the classes they emit.
*/
            function syntaxHighlighting(highlighter, options) {
                let ext = [treeHighlighter],
                    themeType;
                if (highlighter instanceof HighlightStyle) {
                    if (highlighter.module)
                        ext.push(
                            dist /* EditorView.styleModule.of */.tk.styleModule
                                .of(highlighter.module)
                        );
                    themeType = highlighter.themeType;
                }
                if (
                    options === null || options === void 0
                        ? void 0
                        : options.fallback
                )
                    ext.push(fallbackHighlighter.of(highlighter));
                else if (themeType)
                    ext.push(
                        highlighterFacet.computeN(
                            [dist /* EditorView.darkTheme */.tk.darkTheme],
                            (state) => {
                                return state.facet(
                                    dist /* EditorView.darkTheme */.tk.darkTheme
                                ) ==
                                    (themeType == "dark")
                                    ? [highlighter]
                                    : [];
                            }
                        )
                    );
                else ext.push(highlighterFacet.of(highlighter));
                return ext;
            }
            /**
Returns the CSS classes (if any) that the highlighters active in
the state would assign to the given style
[tags](https://lezer.codemirror.net/docs/ref#highlight.Tag) and
(optional) language
[scope](https://codemirror.net/6/docs/ref/#language.HighlightStyle^define^options.scope).
*/
            function highlightingFor(state, tags, scope) {
                let highlighters = getHighlighters(state);
                let result = null;
                if (highlighters)
                    for (let highlighter of highlighters) {
                        if (
                            !highlighter.scope ||
                            (scope && highlighter.scope(scope))
                        ) {
                            let cls = highlighter.style(tags);
                            if (cls) result = result ? result + " " + cls : cls;
                        }
                    }
                return result;
            }
            class TreeHighlighter {
                constructor(view) {
                    this.markCache = Object.create(null);
                    this.tree = dist_syntaxTree(view.state);
                    this.decorations = this.buildDeco(
                        view,
                        getHighlighters(view.state)
                    );
                }
                update(update) {
                    let tree = dist_syntaxTree(update.state),
                        highlighters = getHighlighters(update.state);
                    let styleChange =
                        highlighters != getHighlighters(update.startState);
                    if (
                        tree.length < update.view.viewport.to &&
                        !styleChange &&
                        tree.type == this.tree.type
                    ) {
                        this.decorations = this.decorations.map(update.changes);
                    } else if (
                        tree != this.tree ||
                        update.viewportChanged ||
                        styleChange
                    ) {
                        this.tree = tree;
                        this.decorations = this.buildDeco(
                            update.view,
                            highlighters
                        );
                    }
                }
                buildDeco(view, highlighters) {
                    if (!highlighters || !this.tree.length)
                        return dist /* Decoration.none */.p.none;
                    let builder = new state_dist /* RangeSetBuilder */.f_();
                    for (let { from, to } of view.visibleRanges) {
                        highlightTree(
                            this.tree,
                            highlighters,
                            (from, to, style) => {
                                builder.add(
                                    from,
                                    to,
                                    this.markCache[style] ||
                                        (this.markCache[style] =
                                            dist /* Decoration.mark */.p
                                                .mark({ class: style }))
                                );
                            },
                            from,
                            to
                        );
                    }
                    return builder.finish();
                }
            }
            const treeHighlighter =
                /*@__PURE__*/ state_dist /* Prec.high */.Wl.high(
                    /*@__PURE__*/ dist /* ViewPlugin.fromClass */.lg
                        .fromClass(TreeHighlighter, {
                            decorations: (v) => v.decorations,
                        })
                );
            /**
A default highlight style (works well with light themes).
*/
            const defaultHighlightStyle = /*@__PURE__*/ HighlightStyle.define([
                { tag: tags.meta, color: "#7a757a" },
                { tag: tags.link, textDecoration: "underline" },
                {
                    tag: tags.heading,
                    textDecoration: "underline",
                    fontWeight: "bold",
                },
                { tag: tags.emphasis, fontStyle: "italic" },
                { tag: tags.strong, fontWeight: "bold" },
                { tag: tags.strikethrough, textDecoration: "line-through" },
                { tag: tags.keyword, color: "#708" },
                {
                    tag: [
                        tags.atom,
                        tags.bool,
                        tags.url,
                        tags.contentSeparator,
                        tags.labelName,
                    ],
                    color: "#219",
                },
                { tag: [tags.literal, tags.inserted], color: "#164" },
                { tag: [tags.string, tags.deleted], color: "#a11" },
                {
                    tag: [
                        tags.regexp,
                        tags.escape,
                        /*@__PURE__*/ tags.special(tags.string),
                    ],
                    color: "#e40",
                },
                {
                    tag: /*@__PURE__*/ tags.definition(tags.variableName),
                    color: "#00f",
                },
                {
                    tag: /*@__PURE__*/ tags.local(tags.variableName),
                    color: "#30a",
                },
                { tag: [tags.typeName, tags.namespace], color: "#085" },
                { tag: tags.className, color: "#167" },
                {
                    tag: [
                        /*@__PURE__*/ tags.special(tags.variableName),
                        tags.macroName,
                    ],
                    color: "#256",
                },
                {
                    tag: /*@__PURE__*/ tags.definition(tags.propertyName),
                    color: "#00c",
                },
                { tag: tags.comment, color: "#940" },
                { tag: tags.invalid, color: "#f00" },
            ]);

            const baseTheme = /*@__PURE__*/ dist /* EditorView.baseTheme */.tk
                .baseTheme({
                    "&.cm-focused .cm-matchingBracket": {
                        backgroundColor: "#328c8252",
                    },
                    "&.cm-focused .cm-nonmatchingBracket": {
                        backgroundColor: "#bb555544",
                    },
                });
            const DefaultScanDist = 10000,
                DefaultBrackets = "()[]{}";
            const bracketMatchingConfig =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define({
                        combine(configs) {
                            return (0, state_dist /* combineConfig */.BO)(
                                configs,
                                {
                                    afterCursor: true,
                                    brackets: DefaultBrackets,
                                    maxScanDistance: DefaultScanDist,
                                    renderMatch: defaultRenderMatch,
                                }
                            );
                        },
                    });
            const matchingMark = /*@__PURE__*/ dist /* Decoration.mark */.p
                    .mark({ class: "cm-matchingBracket" }),
                nonmatchingMark = /*@__PURE__*/ dist /* Decoration.mark */.p
                    .mark({ class: "cm-nonmatchingBracket" });
            function defaultRenderMatch(match) {
                let decorations = [];
                let mark = match.matched ? matchingMark : nonmatchingMark;
                decorations.push(mark.range(match.start.from, match.start.to));
                if (match.end)
                    decorations.push(mark.range(match.end.from, match.end.to));
                return decorations;
            }
            const bracketMatchingState =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return dist /* Decoration.none */.p.none;
                    },
                    update(deco, tr) {
                        if (!tr.docChanged && !tr.selection) return deco;
                        let decorations = [];
                        let config = tr.state.facet(bracketMatchingConfig);
                        for (let range of tr.state.selection.ranges) {
                            if (!range.empty) continue;
                            let match =
                                matchBrackets(
                                    tr.state,
                                    range.head,
                                    -1,
                                    config
                                ) ||
                                (range.head > 0 &&
                                    matchBrackets(
                                        tr.state,
                                        range.head - 1,
                                        1,
                                        config
                                    )) ||
                                (config.afterCursor &&
                                    (matchBrackets(
                                        tr.state,
                                        range.head,
                                        1,
                                        config
                                    ) ||
                                        (range.head < tr.state.doc.length &&
                                            matchBrackets(
                                                tr.state,
                                                range.head + 1,
                                                -1,
                                                config
                                            ))));
                            if (match)
                                decorations = decorations.concat(
                                    config.renderMatch(match, tr.state)
                                );
                        }
                        return dist /* Decoration.set */.p
                            .set(decorations, true);
                    },
                    provide: (f) =>
                        dist /* EditorView.decorations.from */.tk.decorations
                            .from(f),
                });
            const bracketMatchingUnique = [bracketMatchingState, baseTheme];
            /**
Create an extension that enables bracket matching. Whenever the
cursor is next to a bracket, that bracket and the one it matches
are highlighted. Or, when no matching bracket is found, another
highlighting style is used to indicate this.
*/
            function bracketMatching(config = {}) {
                return [
                    bracketMatchingConfig.of(config),
                    bracketMatchingUnique,
                ];
            }
            function matchingNodes(node, dir, brackets) {
                let byProp = node.prop(
                    dir < 0 ? dist_NodeProp.openedBy : dist_NodeProp.closedBy
                );
                if (byProp) return byProp;
                if (node.name.length == 1) {
                    let index = brackets.indexOf(node.name);
                    if (index > -1 && index % 2 == (dir < 0 ? 1 : 0))
                        return [brackets[index + dir]];
                }
                return null;
            }
            /**
Find the matching bracket for the token at `pos`, scanning
direction `dir`. Only the `brackets` and `maxScanDistance`
properties are used from `config`, if given. Returns null if no
bracket was found at `pos`, or a match result otherwise.
*/
            function matchBrackets(state, pos, dir, config = {}) {
                let maxScanDistance = config.maxScanDistance || DefaultScanDist,
                    brackets = config.brackets || DefaultBrackets;
                let tree = dist_syntaxTree(state),
                    node = tree.resolveInner(pos, dir);
                for (let cur = node; cur; cur = cur.parent) {
                    let matches = matchingNodes(cur.type, dir, brackets);
                    if (matches && cur.from < cur.to)
                        return matchMarkedBrackets(
                            state,
                            pos,
                            dir,
                            cur,
                            matches,
                            brackets
                        );
                }
                return matchPlainBrackets(
                    state,
                    pos,
                    dir,
                    tree,
                    node.type,
                    maxScanDistance,
                    brackets
                );
            }
            function matchMarkedBrackets(
                _state,
                _pos,
                dir,
                token,
                matching,
                brackets
            ) {
                let parent = token.parent,
                    firstToken = { from: token.from, to: token.to };
                let depth = 0,
                    cursor =
                        parent === null || parent === void 0
                            ? void 0
                            : parent.cursor();
                if (
                    cursor &&
                    (dir < 0
                        ? cursor.childBefore(token.from)
                        : cursor.childAfter(token.to))
                )
                    do {
                        if (
                            dir < 0
                                ? cursor.to <= token.from
                                : cursor.from >= token.to
                        ) {
                            if (
                                depth == 0 &&
                                matching.indexOf(cursor.type.name) > -1 &&
                                cursor.from < cursor.to
                            ) {
                                return {
                                    start: firstToken,
                                    end: { from: cursor.from, to: cursor.to },
                                    matched: true,
                                };
                            } else if (
                                matchingNodes(cursor.type, dir, brackets)
                            ) {
                                depth++;
                            } else if (
                                matchingNodes(cursor.type, -dir, brackets)
                            ) {
                                depth--;
                                if (depth == 0)
                                    return {
                                        start: firstToken,
                                        end:
                                            cursor.from == cursor.to
                                                ? undefined
                                                : {
                                                      from: cursor.from,
                                                      to: cursor.to,
                                                  },
                                        matched: false,
                                    };
                            }
                        }
                    } while (
                        dir < 0 ? cursor.prevSibling() : cursor.nextSibling()
                    );
                return { start: firstToken, matched: false };
            }
            function matchPlainBrackets(
                state,
                pos,
                dir,
                tree,
                tokenType,
                maxScanDistance,
                brackets
            ) {
                let startCh =
                    dir < 0
                        ? state.sliceDoc(pos - 1, pos)
                        : state.sliceDoc(pos, pos + 1);
                let bracket = brackets.indexOf(startCh);
                if (bracket < 0 || (bracket % 2 == 0) != dir > 0) return null;
                let startToken = {
                    from: dir < 0 ? pos - 1 : pos,
                    to: dir > 0 ? pos + 1 : pos,
                };
                let iter = state.doc.iterRange(
                        pos,
                        dir > 0 ? state.doc.length : 0
                    ),
                    depth = 0;
                for (
                    let distance = 0;
                    !iter.next().done && distance <= maxScanDistance;

                ) {
                    let text = iter.value;
                    if (dir < 0) distance += text.length;
                    let basePos = pos + distance * dir;
                    for (
                        let pos = dir > 0 ? 0 : text.length - 1,
                            end = dir > 0 ? text.length : -1;
                        pos != end;
                        pos += dir
                    ) {
                        let found = brackets.indexOf(text[pos]);
                        if (
                            found < 0 ||
                            tree.resolve(basePos + pos, 1).type != tokenType
                        )
                            continue;
                        if ((found % 2 == 0) == dir > 0) {
                            depth++;
                        } else if (depth == 1) {
                            // Closing
                            return {
                                start: startToken,
                                end: {
                                    from: basePos + pos,
                                    to: basePos + pos + 1,
                                },
                                matched: found >> 1 == bracket >> 1,
                            };
                        } else {
                            depth--;
                        }
                    }
                    if (dir > 0) distance += text.length;
                }
                return iter.done ? { start: startToken, matched: false } : null;
            }

            // Counts the column offset in a string, taking tabs into account.
            // Used mostly to find indentation.
            function countCol(
                string,
                end,
                tabSize,
                startIndex = 0,
                startValue = 0
            ) {
                if (end == null) {
                    end = string.search(/[^\s\u00a0]/);
                    if (end == -1) end = string.length;
                }
                let n = startValue;
                for (let i = startIndex; i < end; i++) {
                    if (string.charCodeAt(i) == 9) n += tabSize - (n % tabSize);
                    else n++;
                }
                return n;
            }
            /**
Encapsulates a single line of input. Given to stream syntax code,
which uses it to tokenize the content.
*/
            class StringStream {
                /**
    Create a stream.
    */
                constructor(
                    /**
    The line.
    */
                    string,
                    tabSize,
                    /**
    The current indent unit size.
    */
                    indentUnit
                ) {
                    this.string = string;
                    this.tabSize = tabSize;
                    this.indentUnit = indentUnit;
                    /**
        The current position on the line.
        */
                    this.pos = 0;
                    /**
        The start position of the current token.
        */
                    this.start = 0;
                    this.lastColumnPos = 0;
                    this.lastColumnValue = 0;
                }
                /**
    True if we are at the end of the line.
    */
                eol() {
                    return this.pos >= this.string.length;
                }
                /**
    True if we are at the start of the line.
    */
                sol() {
                    return this.pos == 0;
                }
                /**
    Get the next code unit after the current position, or undefined
    if we're at the end of the line.
    */
                peek() {
                    return this.string.charAt(this.pos) || undefined;
                }
                /**
    Read the next code unit and advance `this.pos`.
    */
                next() {
                    if (this.pos < this.string.length)
                        return this.string.charAt(this.pos++);
                }
                /**
    Match the next character against the given string, regular
    expression, or predicate. Consume and return it if it matches.
    */
                eat(match) {
                    let ch = this.string.charAt(this.pos);
                    let ok;
                    if (typeof match == "string") ok = ch == match;
                    else
                        ok =
                            ch &&
                            (match instanceof RegExp
                                ? match.test(ch)
                                : match(ch));
                    if (ok) {
                        ++this.pos;
                        return ch;
                    }
                }
                /**
    Continue matching characters that match the given string,
    regular expression, or predicate function. Return true if any
    characters were consumed.
    */
                eatWhile(match) {
                    let start = this.pos;
                    while (this.eat(match)) {}
                    return this.pos > start;
                }
                /**
    Consume whitespace ahead of `this.pos`. Return true if any was
    found.
    */
                eatSpace() {
                    let start = this.pos;
                    while (/[\s\u00a0]/.test(this.string.charAt(this.pos)))
                        ++this.pos;
                    return this.pos > start;
                }
                /**
    Move to the end of the line.
    */
                skipToEnd() {
                    this.pos = this.string.length;
                }
                /**
    Move to directly before the given character, if found on the
    current line.
    */
                skipTo(ch) {
                    let found = this.string.indexOf(ch, this.pos);
                    if (found > -1) {
                        this.pos = found;
                        return true;
                    }
                }
                /**
    Move back `n` characters.
    */
                backUp(n) {
                    this.pos -= n;
                }
                /**
    Get the column position at `this.pos`.
    */
                column() {
                    if (this.lastColumnPos < this.start) {
                        this.lastColumnValue = countCol(
                            this.string,
                            this.start,
                            this.tabSize,
                            this.lastColumnPos,
                            this.lastColumnValue
                        );
                        this.lastColumnPos = this.start;
                    }
                    return this.lastColumnValue;
                }
                /**
    Get the indentation column of the current line.
    */
                indentation() {
                    return countCol(this.string, null, this.tabSize);
                }
                /**
    Match the input against the given string or regular expression
    (which should start with a `^`). Return true or the regexp match
    if it matches.
    
    Unless `consume` is set to `false`, this will move `this.pos`
    past the matched text.
    
    When matching a string `caseInsensitive` can be set to true to
    make the match case-insensitive.
    */
                match(pattern, consume, caseInsensitive) {
                    if (typeof pattern == "string") {
                        let cased = (str) =>
                            caseInsensitive ? str.toLowerCase() : str;
                        let substr = this.string.substr(
                            this.pos,
                            pattern.length
                        );
                        if (cased(substr) == cased(pattern)) {
                            if (consume !== false) this.pos += pattern.length;
                            return true;
                        } else return null;
                    } else {
                        let match = this.string.slice(this.pos).match(pattern);
                        if (match && match.index > 0) return null;
                        if (match && consume !== false)
                            this.pos += match[0].length;
                        return match;
                    }
                }
                /**
    Get the current token.
    */
                current() {
                    return this.string.slice(this.start, this.pos);
                }
            }

            function fullParser(spec) {
                return {
                    token: spec.token,
                    blankLine: spec.blankLine || (() => {}),
                    startState: spec.startState || (() => true),
                    copyState: spec.copyState || defaultCopyState,
                    indent: spec.indent || (() => null),
                    languageData: spec.languageData || {},
                    tokenTable: spec.tokenTable || noTokens,
                };
            }
            function defaultCopyState(state) {
                if (typeof state != "object") return state;
                let newState = {};
                for (let prop in state) {
                    let val = state[prop];
                    newState[prop] = val instanceof Array ? val.slice() : val;
                }
                return newState;
            }
            /**
A [language](https://codemirror.net/6/docs/ref/#language.Language) class based on a CodeMirror
5-style [streaming parser](https://codemirror.net/6/docs/ref/#language.StreamParser).
*/
            class StreamLanguage
                extends /* unused pure expression or super */ (null &&
                    Language)
            {
                constructor(parser) {
                    let data = defineLanguageFacet(parser.languageData);
                    let p = fullParser(parser),
                        self;
                    let impl = new (class extends Parser {
                        createParse(input, fragments, ranges) {
                            return new Parse(self, input, fragments, ranges);
                        }
                    })();
                    super(data, impl, [
                        indentService.of((cx, pos) => this.getIndent(cx, pos)),
                    ]);
                    this.topNode = docID(data);
                    self = this;
                    this.streamParser = p;
                    this.stateAfter = new NodeProp({ perNode: true });
                    this.tokenTable = parser.tokenTable
                        ? new TokenTable(p.tokenTable)
                        : defaultTokenTable;
                }
                /**
    Define a stream language.
    */
                static define(spec) {
                    return new StreamLanguage(spec);
                }
                getIndent(cx, pos) {
                    let tree = dist_syntaxTree(cx.state),
                        at = tree.resolve(pos);
                    while (at && at.type != this.topNode) at = at.parent;
                    if (!at) return null;
                    let start = findState(this, tree, 0, at.from, pos),
                        statePos,
                        state;
                    if (start) {
                        state = start.state;
                        statePos = start.pos + 1;
                    } else {
                        state = this.streamParser.startState(cx.unit);
                        statePos = 0;
                    }
                    if (pos - statePos > 10000 /* MaxIndentScanDist */)
                        return null;
                    while (statePos < pos) {
                        let line = cx.state.doc.lineAt(statePos),
                            end = Math.min(pos, line.to);
                        if (line.length) {
                            let stream = new StringStream(
                                line.text,
                                cx.state.tabSize,
                                cx.unit
                            );
                            while (stream.pos < end - line.from)
                                readToken(
                                    this.streamParser.token,
                                    stream,
                                    state
                                );
                        } else {
                            this.streamParser.blankLine(state, cx.unit);
                        }
                        if (end == pos) break;
                        statePos = line.to + 1;
                    }
                    let { text } = cx.lineAt(pos);
                    return this.streamParser.indent(
                        state,
                        /^\s*(.*)/.exec(text)[1],
                        cx
                    );
                }
                get allowsNesting() {
                    return false;
                }
            }
            function findState(lang, tree, off, startPos, before) {
                let state =
                    off >= startPos &&
                    off + tree.length <= before &&
                    tree.prop(lang.stateAfter);
                if (state)
                    return {
                        state: lang.streamParser.copyState(state),
                        pos: off + tree.length,
                    };
                for (let i = tree.children.length - 1; i >= 0; i--) {
                    let child = tree.children[i],
                        pos = off + tree.positions[i];
                    let found =
                        child instanceof Tree &&
                        pos < before &&
                        findState(lang, child, pos, startPos, before);
                    if (found) return found;
                }
                return null;
            }
            function cutTree(lang, tree, from, to, inside) {
                if (inside && from <= 0 && to >= tree.length) return tree;
                if (!inside && tree.type == lang.topNode) inside = true;
                for (let i = tree.children.length - 1; i >= 0; i--) {
                    let pos = tree.positions[i],
                        child = tree.children[i],
                        inner;
                    if (pos < to && child instanceof Tree) {
                        if (
                            !(inner = cutTree(
                                lang,
                                child,
                                from - pos,
                                to - pos,
                                inside
                            ))
                        )
                            break;
                        return !inside
                            ? inner
                            : new Tree(
                                  tree.type,
                                  tree.children.slice(0, i).concat(inner),
                                  tree.positions.slice(0, i + 1),
                                  pos + inner.length
                              );
                    }
                }
                return null;
            }
            function findStartInFragments(
                lang,
                fragments,
                startPos,
                editorState
            ) {
                for (let f of fragments) {
                    let from = f.from + (f.openStart ? 25 : 0),
                        to = f.to - (f.openEnd ? 25 : 0);
                    let found =
                            from <= startPos &&
                            to > startPos &&
                            findState(lang, f.tree, 0 - f.offset, startPos, to),
                        tree;
                    if (
                        found &&
                        (tree = cutTree(
                            lang,
                            f.tree,
                            startPos + f.offset,
                            found.pos + f.offset,
                            false
                        ))
                    )
                        return { state: found.state, tree };
                }
                return {
                    state: lang.streamParser.startState(
                        editorState ? getIndentUnit(editorState) : 4
                    ),
                    tree: Tree.empty,
                };
            }
            class Parse {
                constructor(lang, input, fragments, ranges) {
                    this.lang = lang;
                    this.input = input;
                    this.fragments = fragments;
                    this.ranges = ranges;
                    this.stoppedAt = null;
                    this.chunks = [];
                    this.chunkPos = [];
                    this.chunk = [];
                    this.chunkReused = undefined;
                    this.rangeIndex = 0;
                    this.to = ranges[ranges.length - 1].to;
                    let context = ParseContext.get(),
                        from = ranges[0].from;
                    let { state, tree } = findStartInFragments(
                        lang,
                        fragments,
                        from,
                        context === null || context === void 0
                            ? void 0
                            : context.state
                    );
                    this.state = state;
                    this.parsedPos = this.chunkStart = from + tree.length;
                    for (let i = 0; i < tree.children.length; i++) {
                        this.chunks.push(tree.children[i]);
                        this.chunkPos.push(tree.positions[i]);
                    }
                    if (
                        context &&
                        this.parsedPos <
                            context.viewport.from -
                                100000 /* MaxDistanceBeforeViewport */
                    ) {
                        this.state = this.lang.streamParser.startState(
                            getIndentUnit(context.state)
                        );
                        context.skipUntilInView(
                            this.parsedPos,
                            context.viewport.from
                        );
                        this.parsedPos = context.viewport.from;
                    }
                    this.moveRangeIndex();
                }
                advance() {
                    let context = ParseContext.get();
                    let parseEnd =
                        this.stoppedAt == null
                            ? this.to
                            : Math.min(this.to, this.stoppedAt);
                    let end = Math.min(
                        parseEnd,
                        this.chunkStart + 2048 /* ChunkSize */
                    );
                    if (context) end = Math.min(end, context.viewport.to);
                    while (this.parsedPos < end) this.parseLine(context);
                    if (this.chunkStart < this.parsedPos) this.finishChunk();
                    if (this.parsedPos >= parseEnd) return this.finish();
                    if (context && this.parsedPos >= context.viewport.to) {
                        context.skipUntilInView(this.parsedPos, parseEnd);
                        return this.finish();
                    }
                    return null;
                }
                stopAt(pos) {
                    this.stoppedAt = pos;
                }
                lineAfter(pos) {
                    let chunk = this.input.chunk(pos);
                    if (!this.input.lineChunks) {
                        let eol = chunk.indexOf("\n");
                        if (eol > -1) chunk = chunk.slice(0, eol);
                    } else if (chunk == "\n") {
                        chunk = "";
                    }
                    return pos + chunk.length <= this.to
                        ? chunk
                        : chunk.slice(0, this.to - pos);
                }
                nextLine() {
                    let from = this.parsedPos,
                        line = this.lineAfter(from),
                        end = from + line.length;
                    for (let index = this.rangeIndex; ; ) {
                        let rangeEnd = this.ranges[index].to;
                        if (rangeEnd >= end) break;
                        line = line.slice(0, rangeEnd - (end - line.length));
                        index++;
                        if (index == this.ranges.length) break;
                        let rangeStart = this.ranges[index].from;
                        let after = this.lineAfter(rangeStart);
                        line += after;
                        end = rangeStart + after.length;
                    }
                    return { line, end };
                }
                skipGapsTo(pos, offset, side) {
                    for (;;) {
                        let end = this.ranges[this.rangeIndex].to,
                            offPos = pos + offset;
                        if (side > 0 ? end > offPos : end >= offPos) break;
                        let start = this.ranges[++this.rangeIndex].from;
                        offset += start - end;
                    }
                    return offset;
                }
                moveRangeIndex() {
                    while (this.ranges[this.rangeIndex].to < this.parsedPos)
                        this.rangeIndex++;
                }
                emitToken(id, from, to, size, offset) {
                    if (this.ranges.length > 1) {
                        offset = this.skipGapsTo(from, offset, 1);
                        from += offset;
                        let len0 = this.chunk.length;
                        offset = this.skipGapsTo(to, offset, -1);
                        to += offset;
                        size += this.chunk.length - len0;
                    }
                    this.chunk.push(id, from, to, size);
                    return offset;
                }
                parseLine(context) {
                    let { line, end } = this.nextLine(),
                        offset = 0,
                        { streamParser } = this.lang;
                    let stream = new StringStream(
                        line,
                        context ? context.state.tabSize : 4,
                        context ? getIndentUnit(context.state) : 2
                    );
                    if (stream.eol()) {
                        streamParser.blankLine(this.state, stream.indentUnit);
                    } else {
                        while (!stream.eol()) {
                            let token = readToken(
                                streamParser.token,
                                stream,
                                this.state
                            );
                            if (token)
                                offset = this.emitToken(
                                    this.lang.tokenTable.resolve(token),
                                    this.parsedPos + stream.start,
                                    this.parsedPos + stream.pos,
                                    4,
                                    offset
                                );
                            if (stream.start > 10000 /* MaxLineLength */) break;
                        }
                    }
                    this.parsedPos = end;
                    this.moveRangeIndex();
                    if (this.parsedPos < this.to) this.parsedPos++;
                }
                finishChunk() {
                    let tree = Tree.build({
                        buffer: this.chunk,
                        start: this.chunkStart,
                        length: this.parsedPos - this.chunkStart,
                        nodeSet,
                        topID: 0,
                        maxBufferLength: 2048 /* ChunkSize */,
                        reused: this.chunkReused,
                    });
                    tree = new Tree(
                        tree.type,
                        tree.children,
                        tree.positions,
                        tree.length,
                        [
                            [
                                this.lang.stateAfter,
                                this.lang.streamParser.copyState(this.state),
                            ],
                        ]
                    );
                    this.chunks.push(tree);
                    this.chunkPos.push(this.chunkStart - this.ranges[0].from);
                    this.chunk = [];
                    this.chunkReused = undefined;
                    this.chunkStart = this.parsedPos;
                }
                finish() {
                    return new Tree(
                        this.lang.topNode,
                        this.chunks,
                        this.chunkPos,
                        this.parsedPos - this.ranges[0].from
                    ).balance();
                }
            }
            function readToken(token, stream, state) {
                stream.start = stream.pos;
                for (let i = 0; i < 10; i++) {
                    let result = token(stream, state);
                    if (stream.pos > stream.start) return result;
                }
                throw new Error("Stream parser failed to advance stream.");
            }
            const noTokens = /*@__PURE__*/ Object.create(null);
            const typeArray = [dist_NodeType.none];
            const nodeSet = /*@__PURE__*/ new NodeSet(typeArray);
            const warned = [];
            const defaultTable = /*@__PURE__*/ Object.create(null);
            for (let [legacyName, name] of [
                ["variable", "variableName"],
                ["variable-2", "variableName.special"],
                ["string-2", "string.special"],
                ["def", "variableName.definition"],
                ["tag", "typeName"],
                ["attribute", "propertyName"],
                ["type", "typeName"],
                ["builtin", "variableName.standard"],
                ["qualifier", "modifier"],
                ["error", "invalid"],
                ["header", "heading"],
                ["property", "propertyName"],
            ])
                defaultTable[legacyName] = /*@__PURE__*/ createTokenType(
                    noTokens,
                    name
                );
            class TokenTable {
                constructor(extra) {
                    this.extra = extra;
                    this.table = Object.assign(
                        Object.create(null),
                        defaultTable
                    );
                }
                resolve(tag) {
                    return !tag
                        ? 0
                        : this.table[tag] ||
                              (this.table[tag] = createTokenType(
                                  this.extra,
                                  tag
                              ));
                }
            }
            const defaultTokenTable = /*@__PURE__*/ new TokenTable(noTokens);
            function warnForPart(part, msg) {
                if (warned.indexOf(part) > -1) return;
                warned.push(part);
                console.warn(msg);
            }
            function createTokenType(extra, tagStr) {
                let tag = null;
                for (let part of tagStr.split(".")) {
                    let value = extra[part] || tags[part];
                    if (!value) {
                        warnForPart(part, `Unknown highlighting tag ${part}`);
                    } else if (typeof value == "function") {
                        if (!tag)
                            warnForPart(
                                part,
                                `Modifier ${part} used at start of tag`
                            );
                        else tag = value(tag);
                    } else {
                        if (tag)
                            warnForPart(part, `Tag ${part} used as modifier`);
                        else tag = value;
                    }
                }
                if (!tag) return 0;
                let name = tagStr.replace(/ /g, "_"),
                    type = dist_NodeType.define({
                        id: typeArray.length,
                        name,
                        props: [styleTags({ [name]: tag })],
                    });
                typeArray.push(type);
                return type.id;
            }
            function docID(data) {
                let type = NodeType.define({
                    id: typeArray.length,
                    name: "Document",
                    props: [languageDataProp.add(() => data)],
                });
                typeArray.push(type);
                return type;
            } // CONCATENATED MODULE: ./node_modules/@codemirror/commands/dist/index.js

            /**
Comment or uncomment the current selection. Will use line comments
if available, otherwise falling back to block comments.
*/
            const toggleComment = (target) => {
                let config = getConfig(target.state);
                return config.line
                    ? toggleLineComment(target)
                    : config.block
                    ? toggleBlockCommentByLine(target)
                    : false;
            };
            function command(f, option) {
                return ({ state, dispatch }) => {
                    if (state.readOnly) return false;
                    let tr = f(option, state);
                    if (!tr) return false;
                    dispatch(state.update(tr));
                    return true;
                };
            }
            /**
Comment or uncomment the current selection using line comments.
The line comment syntax is taken from the
[`commentTokens`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) [language
data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt).
*/
            const toggleLineComment = /*@__PURE__*/ command(
                changeLineComment,
                0 /* Toggle */
            );
            /**
Comment the current selection using line comments.
*/
            const lineComment =
                /*@__PURE__*/ /* unused pure expression or super */ null &&
                command(changeLineComment, 1 /* Comment */);
            /**
Uncomment the current selection using line comments.
*/
            const lineUncomment =
                /*@__PURE__*/ /* unused pure expression or super */ null &&
                command(changeLineComment, 2 /* Uncomment */);
            /**
Comment or uncomment the current selection using block comments.
The block comment syntax is taken from the
[`commentTokens`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) [language
data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt).
*/
            const toggleBlockComment = /*@__PURE__*/ command(
                changeBlockComment,
                0 /* Toggle */
            );
            /**
Comment the current selection using block comments.
*/
            const blockComment =
                /*@__PURE__*/ /* unused pure expression or super */ null &&
                command(changeBlockComment, 1 /* Comment */);
            /**
Uncomment the current selection using block comments.
*/
            const blockUncomment =
                /*@__PURE__*/ /* unused pure expression or super */ null &&
                command(changeBlockComment, 2 /* Uncomment */);
            /**
Comment or uncomment the lines around the current selection using
block comments.
*/
            const toggleBlockCommentByLine = /*@__PURE__*/ command(
                (o, s) => changeBlockComment(o, s, selectedLineRanges(s)),
                0 /* Toggle */
            );
            function getConfig(state, pos = state.selection.main.head) {
                let data = state.languageDataAt("commentTokens", pos);
                return data.length ? data[0] : {};
            }
            const SearchMargin = 50;
            /**
Determines if the given range is block-commented in the given
state.
*/
            function findBlockComment(state, { open, close }, from, to) {
                let textBefore = state.sliceDoc(from - SearchMargin, from);
                let textAfter = state.sliceDoc(to, to + SearchMargin);
                let spaceBefore = /\s*$/.exec(textBefore)[0].length,
                    spaceAfter = /^\s*/.exec(textAfter)[0].length;
                let beforeOff = textBefore.length - spaceBefore;
                if (
                    textBefore.slice(beforeOff - open.length, beforeOff) ==
                        open &&
                    textAfter.slice(spaceAfter, spaceAfter + close.length) ==
                        close
                ) {
                    return {
                        open: {
                            pos: from - spaceBefore,
                            margin: spaceBefore && 1,
                        },
                        close: {
                            pos: to + spaceAfter,
                            margin: spaceAfter && 1,
                        },
                    };
                }
                let startText, endText;
                if (to - from <= 2 * SearchMargin) {
                    startText = endText = state.sliceDoc(from, to);
                } else {
                    startText = state.sliceDoc(from, from + SearchMargin);
                    endText = state.sliceDoc(to - SearchMargin, to);
                }
                let startSpace = /^\s*/.exec(startText)[0].length,
                    endSpace = /\s*$/.exec(endText)[0].length;
                let endOff = endText.length - endSpace - close.length;
                if (
                    startText.slice(startSpace, startSpace + open.length) ==
                        open &&
                    endText.slice(endOff, endOff + close.length) == close
                ) {
                    return {
                        open: {
                            pos: from + startSpace + open.length,
                            margin: /\s/.test(
                                startText.charAt(startSpace + open.length)
                            )
                                ? 1
                                : 0,
                        },
                        close: {
                            pos: to - endSpace - close.length,
                            margin: /\s/.test(endText.charAt(endOff - 1))
                                ? 1
                                : 0,
                        },
                    };
                }
                return null;
            }
            function selectedLineRanges(state) {
                let ranges = [];
                for (let r of state.selection.ranges) {
                    let fromLine = state.doc.lineAt(r.from);
                    let toLine =
                        r.to <= fromLine.to ? fromLine : state.doc.lineAt(r.to);
                    let last = ranges.length - 1;
                    if (last >= 0 && ranges[last].to > fromLine.from)
                        ranges[last].to = toLine.to;
                    else ranges.push({ from: fromLine.from, to: toLine.to });
                }
                return ranges;
            }
            // Performs toggle, comment and uncomment of block comments in
            // languages that support them.
            function changeBlockComment(
                option,
                state,
                ranges = state.selection.ranges
            ) {
                let tokens = ranges.map((r) => getConfig(state, r.from).block);
                if (!tokens.every((c) => c)) return null;
                let comments = ranges.map((r, i) =>
                    findBlockComment(state, tokens[i], r.from, r.to)
                );
                if (option != 2 /* Uncomment */ && !comments.every((c) => c)) {
                    return {
                        changes: state.changes(
                            ranges.map((range, i) => {
                                if (comments[i]) return [];
                                return [
                                    {
                                        from: range.from,
                                        insert: tokens[i].open + " ",
                                    },
                                    {
                                        from: range.to,
                                        insert: " " + tokens[i].close,
                                    },
                                ];
                            })
                        ),
                    };
                } else if (
                    option != 1 /* Comment */ &&
                    comments.some((c) => c)
                ) {
                    let changes = [];
                    for (let i = 0, comment; i < comments.length; i++)
                        if ((comment = comments[i])) {
                            let token = tokens[i],
                                { open, close } = comment;
                            changes.push(
                                {
                                    from: open.pos - token.open.length,
                                    to: open.pos + open.margin,
                                },
                                {
                                    from: close.pos - close.margin,
                                    to: close.pos + token.close.length,
                                }
                            );
                        }
                    return { changes };
                }
                return null;
            }
            // Performs toggle, comment and uncomment of line comments.
            function changeLineComment(
                option,
                state,
                ranges = state.selection.ranges
            ) {
                let lines = [];
                let prevLine = -1;
                for (let { from, to } of ranges) {
                    let startI = lines.length,
                        minIndent = 1e9;
                    for (let pos = from; pos <= to; ) {
                        let line = state.doc.lineAt(pos);
                        if (
                            line.from > prevLine &&
                            (from == to || to > line.from)
                        ) {
                            prevLine = line.from;
                            let token = getConfig(state, pos).line;
                            if (!token) continue;
                            let indent = /^\s*/.exec(line.text)[0].length;
                            let empty = indent == line.length;
                            let comment =
                                line.text.slice(
                                    indent,
                                    indent + token.length
                                ) == token
                                    ? indent
                                    : -1;
                            if (indent < line.text.length && indent < minIndent)
                                minIndent = indent;
                            lines.push({
                                line,
                                comment,
                                token,
                                indent,
                                empty,
                                single: false,
                            });
                        }
                        pos = line.to + 1;
                    }
                    if (minIndent < 1e9)
                        for (let i = startI; i < lines.length; i++)
                            if (lines[i].indent < lines[i].line.text.length)
                                lines[i].indent = minIndent;
                    if (lines.length == startI + 1) lines[startI].single = true;
                }
                if (
                    option != 2 /* Uncomment */ &&
                    lines.some((l) => l.comment < 0 && (!l.empty || l.single))
                ) {
                    let changes = [];
                    for (let { line, token, indent, empty, single } of lines)
                        if (single || !empty)
                            changes.push({
                                from: line.from + indent,
                                insert: token + " ",
                            });
                    let changeSet = state.changes(changes);
                    return {
                        changes: changeSet,
                        selection: state.selection.map(changeSet, 1),
                    };
                } else if (
                    option != 1 /* Comment */ &&
                    lines.some((l) => l.comment >= 0)
                ) {
                    let changes = [];
                    for (let { line, comment, token } of lines)
                        if (comment >= 0) {
                            let from = line.from + comment,
                                to = from + token.length;
                            if (line.text[to - line.from] == " ") to++;
                            changes.push({ from, to });
                        }
                    return { changes };
                }
                return null;
            }

            const fromHistory =
                /*@__PURE__*/ state_dist /* Annotation.define */.q6
                    .define();
            /**
Transaction annotation that will prevent that transaction from
being combined with other transactions in the undo history. Given
`"before"`, it'll prevent merging with previous transactions. With
`"after"`, subsequent transactions won't be combined with this
one. With `"full"`, the transaction is isolated on both sides.
*/
            const isolateHistory =
                /*@__PURE__*/ state_dist /* Annotation.define */.q6
                    .define();
            /**
This facet provides a way to register functions that, given a
transaction, provide a set of effects that the history should
store when inverting the transaction. This can be used to
integrate some kinds of effects in the history, so that they can
be undone (and redone again).
*/
            const invertedEffects =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define();
            const historyConfig = /*@__PURE__*/ state_dist /* Facet.define */.r$
                .define({
                    combine(configs) {
                        return (0, state_dist /* combineConfig */.BO)(
                            configs,
                            {
                                minDepth: 100,
                                newGroupDelay: 500,
                            },
                            { minDepth: Math.max, newGroupDelay: Math.min }
                        );
                    },
                });
            function changeEnd(changes) {
                let end = 0;
                changes.iterChangedRanges((_, to) => (end = to));
                return end;
            }
            const historyField_ =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return HistoryState.empty;
                    },
                    update(state, tr) {
                        let config = tr.state.facet(historyConfig);
                        let fromHist = tr.annotation(fromHistory);
                        if (fromHist) {
                            let selection = tr.docChanged
                                ? state_dist /* EditorSelection.single */.jT
                                      .single(changeEnd(tr.changes))
                                : undefined;
                            let item = HistEvent.fromTransaction(tr, selection),
                                from = fromHist.side;
                            let other =
                                from == 0 /* Done */
                                    ? state.undone
                                    : state.done;
                            if (item)
                                other = updateBranch(
                                    other,
                                    other.length,
                                    config.minDepth,
                                    item
                                );
                            else
                                other = addSelection(
                                    other,
                                    tr.startState.selection
                                );
                            return new HistoryState(
                                from == 0 /* Done */ ? fromHist.rest : other,
                                from == 0 /* Done */ ? other : fromHist.rest
                            );
                        }
                        let isolate = tr.annotation(isolateHistory);
                        if (isolate == "full" || isolate == "before")
                            state = state.isolate();
                        if (
                            tr.annotation(
                                state_dist /* Transaction.addToHistory */.YW
                                    .addToHistory
                            ) === false
                        )
                            return !tr.changes.empty
                                ? state.addMapping(tr.changes.desc)
                                : state;
                        let event = HistEvent.fromTransaction(tr);
                        let time = tr.annotation(
                                state_dist /* Transaction.time */.YW.time
                            ),
                            userEvent = tr.annotation(
                                state_dist /* Transaction.userEvent */.YW
                                    .userEvent
                            );
                        if (event)
                            state = state.addChanges(
                                event,
                                time,
                                userEvent,
                                config.newGroupDelay,
                                config.minDepth
                            );
                        else if (tr.selection)
                            state = state.addSelection(
                                tr.startState.selection,
                                time,
                                userEvent,
                                config.newGroupDelay
                            );
                        if (isolate == "full" || isolate == "after")
                            state = state.isolate();
                        return state;
                    },
                    toJSON(value) {
                        return {
                            done: value.done.map((e) => e.toJSON()),
                            undone: value.undone.map((e) => e.toJSON()),
                        };
                    },
                    fromJSON(json) {
                        return new HistoryState(
                            json.done.map(HistEvent.fromJSON),
                            json.undone.map(HistEvent.fromJSON)
                        );
                    },
                });
            /**
Create a history extension with the given configuration.
*/
            function dist_history(config = {}) {
                return [
                    historyField_,
                    historyConfig.of(config),
                    dist /* EditorView.domEventHandlers */.tk
                        .domEventHandlers({
                            beforeinput(e, view) {
                                let command =
                                    e.inputType == "historyUndo"
                                        ? undo
                                        : e.inputType == "historyRedo"
                                        ? redo
                                        : null;
                                if (!command) return false;
                                e.preventDefault();
                                return command(view);
                            },
                        }),
                ];
            }
            /**
The state field used to store the history data. Should probably
only be used when you want to
[serialize](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) or
[deserialize](https://codemirror.net/6/docs/ref/#state.EditorState^fromJSON) state objects in a way
that preserves history.
*/
            const historyField =
                /* unused pure expression or super */ null && historyField_;
            function cmd(side, selection) {
                return function ({ state, dispatch }) {
                    if (!selection && state.readOnly) return false;
                    let historyState = state.field(historyField_, false);
                    if (!historyState) return false;
                    let tr = historyState.pop(side, state, selection);
                    if (!tr) return false;
                    dispatch(tr);
                    return true;
                };
            }
            /**
Undo a single group of history events. Returns false if no group
was available.
*/
            const undo = /*@__PURE__*/ cmd(0 /* Done */, false);
            /**
Redo a group of history events. Returns false if no group was
available.
*/
            const redo = /*@__PURE__*/ cmd(1 /* Undone */, false);
            /**
Undo a change or selection change.
*/
            const undoSelection = /*@__PURE__*/ cmd(0 /* Done */, true);
            /**
Redo a change or selection change.
*/
            const redoSelection = /*@__PURE__*/ cmd(1 /* Undone */, true);
            function depth(side) {
                return function (state) {
                    let histState = state.field(historyField_, false);
                    if (!histState) return 0;
                    let branch =
                        side == 0 /* Done */
                            ? histState.done
                            : histState.undone;
                    return (
                        branch.length -
                        (branch.length && !branch[0].changes ? 1 : 0)
                    );
                };
            }
            /**
The amount of undoable change events available in a given state.
*/
            const undoDepth =
                /*@__PURE__*/ /* unused pure expression or super */ null &&
                depth(0 /* Done */);
            /**
The amount of redoable change events available in a given state.
*/
            const redoDepth =
                /*@__PURE__*/ /* unused pure expression or super */ null &&
                depth(1 /* Undone */);
            // History events store groups of changes or effects that need to be
            // undone/redone together.
            class HistEvent {
                constructor(
                    // The changes in this event. Normal events hold at least one
                    // change or effect. But it may be necessary to store selection
                    // events before the first change, in which case a special type of
                    // instance is created which doesn't hold any changes, with
                    // changes == startSelection == undefined
                    changes,
                    // The effects associated with this event
                    effects,
                    mapped,
                    // The selection before this event
                    startSelection,
                    // Stores selection changes after this event, to be used for
                    // selection undo/redo.
                    selectionsAfter
                ) {
                    this.changes = changes;
                    this.effects = effects;
                    this.mapped = mapped;
                    this.startSelection = startSelection;
                    this.selectionsAfter = selectionsAfter;
                }
                setSelAfter(after) {
                    return new HistEvent(
                        this.changes,
                        this.effects,
                        this.mapped,
                        this.startSelection,
                        after
                    );
                }
                toJSON() {
                    var _a, _b, _c;
                    return {
                        changes:
                            (_a = this.changes) === null || _a === void 0
                                ? void 0
                                : _a.toJSON(),
                        mapped:
                            (_b = this.mapped) === null || _b === void 0
                                ? void 0
                                : _b.toJSON(),
                        startSelection:
                            (_c = this.startSelection) === null || _c === void 0
                                ? void 0
                                : _c.toJSON(),
                        selectionsAfter: this.selectionsAfter.map((s) =>
                            s.toJSON()
                        ),
                    };
                }
                static fromJSON(json) {
                    return new HistEvent(
                        json.changes &&
                            state_dist /* ChangeSet.fromJSON */.as
                                .fromJSON(json.changes),
                        [],
                        json.mapped &&
                            state_dist /* ChangeDesc.fromJSON */.n0
                                .fromJSON(json.mapped),
                        json.startSelection &&
                            state_dist /* EditorSelection.fromJSON */.jT
                                .fromJSON(json.startSelection),
                        json.selectionsAfter.map(
                            state_dist /* EditorSelection.fromJSON */.jT
                                .fromJSON
                        )
                    );
                }
                // This does not check `addToHistory` and such, it assumes the
                // transaction needs to be converted to an item. Returns null when
                // there are no changes or effects in the transaction.
                static fromTransaction(tr, selection) {
                    let effects = none;
                    for (let invert of tr.startState.facet(invertedEffects)) {
                        let result = invert(tr);
                        if (result.length) effects = effects.concat(result);
                    }
                    if (!effects.length && tr.changes.empty) return null;
                    return new HistEvent(
                        tr.changes.invert(tr.startState.doc),
                        effects,
                        undefined,
                        selection || tr.startState.selection,
                        none
                    );
                }
                static selection(selections) {
                    return new HistEvent(
                        undefined,
                        none,
                        undefined,
                        undefined,
                        selections
                    );
                }
            }
            function updateBranch(branch, to, maxLen, newEvent) {
                let start = to + 1 > maxLen + 20 ? to - maxLen - 1 : 0;
                let newBranch = branch.slice(start, to);
                newBranch.push(newEvent);
                return newBranch;
            }
            function isAdjacent(a, b) {
                let ranges = [],
                    isAdjacent = false;
                a.iterChangedRanges((f, t) => ranges.push(f, t));
                b.iterChangedRanges((_f, _t, f, t) => {
                    for (let i = 0; i < ranges.length; ) {
                        let from = ranges[i++],
                            to = ranges[i++];
                        if (t >= from && f <= to) isAdjacent = true;
                    }
                });
                return isAdjacent;
            }
            function eqSelectionShape(a, b) {
                return (
                    a.ranges.length == b.ranges.length &&
                    a.ranges.filter((r, i) => r.empty != b.ranges[i].empty)
                        .length === 0
                );
            }
            function conc(a, b) {
                return !a.length ? b : !b.length ? a : a.concat(b);
            }
            const none = [];
            const MaxSelectionsPerEvent = 200;
            function addSelection(branch, selection) {
                if (!branch.length) {
                    return [HistEvent.selection([selection])];
                } else {
                    let lastEvent = branch[branch.length - 1];
                    let sels = lastEvent.selectionsAfter.slice(
                        Math.max(
                            0,
                            lastEvent.selectionsAfter.length -
                                MaxSelectionsPerEvent
                        )
                    );
                    if (sels.length && sels[sels.length - 1].eq(selection))
                        return branch;
                    sels.push(selection);
                    return updateBranch(
                        branch,
                        branch.length - 1,
                        1e9,
                        lastEvent.setSelAfter(sels)
                    );
                }
            }
            // Assumes the top item has one or more selectionAfter values
            function popSelection(branch) {
                let last = branch[branch.length - 1];
                let newBranch = branch.slice();
                newBranch[branch.length - 1] = last.setSelAfter(
                    last.selectionsAfter.slice(
                        0,
                        last.selectionsAfter.length - 1
                    )
                );
                return newBranch;
            }
            // Add a mapping to the top event in the given branch. If this maps
            // away all the changes and effects in that item, drop it and
            // propagate the mapping to the next item.
            function addMappingToBranch(branch, mapping) {
                if (!branch.length) return branch;
                let length = branch.length,
                    selections = none;
                while (length) {
                    let event = mapEvent(
                        branch[length - 1],
                        mapping,
                        selections
                    );
                    if (
                        (event.changes && !event.changes.empty) ||
                        event.effects.length
                    ) {
                        // Event survived mapping
                        let result = branch.slice(0, length);
                        result[length - 1] = event;
                        return result;
                    } else {
                        // Drop this event, since there's no changes or effects left
                        mapping = event.mapped;
                        length--;
                        selections = event.selectionsAfter;
                    }
                }
                return selections.length
                    ? [HistEvent.selection(selections)]
                    : none;
            }
            function mapEvent(event, mapping, extraSelections) {
                let selections = conc(
                    event.selectionsAfter.length
                        ? event.selectionsAfter.map((s) => s.map(mapping))
                        : none,
                    extraSelections
                );
                // Change-less events don't store mappings (they are always the last event in a branch)
                if (!event.changes) return HistEvent.selection(selections);
                let mappedChanges = event.changes.map(mapping),
                    before = mapping.mapDesc(event.changes, true);
                let fullMapping = event.mapped
                    ? event.mapped.composeDesc(before)
                    : before;
                return new HistEvent(
                    mappedChanges,
                    state_dist /* StateEffect.mapEffects */.Py.mapEffects(
                        event.effects,
                        mapping
                    ),
                    fullMapping,
                    event.startSelection.map(before),
                    selections
                );
            }
            const joinableUserEvent = /^(input\.type|delete)($|\.)/;
            class HistoryState {
                constructor(
                    done,
                    undone,
                    prevTime = 0,
                    prevUserEvent = undefined
                ) {
                    this.done = done;
                    this.undone = undone;
                    this.prevTime = prevTime;
                    this.prevUserEvent = prevUserEvent;
                }
                isolate() {
                    return this.prevTime
                        ? new HistoryState(this.done, this.undone)
                        : this;
                }
                addChanges(event, time, userEvent, newGroupDelay, maxLen) {
                    let done = this.done,
                        lastEvent = done[done.length - 1];
                    if (
                        lastEvent &&
                        lastEvent.changes &&
                        !lastEvent.changes.empty &&
                        event.changes &&
                        (!userEvent || joinableUserEvent.test(userEvent)) &&
                        ((!lastEvent.selectionsAfter.length &&
                            time - this.prevTime < newGroupDelay &&
                            isAdjacent(lastEvent.changes, event.changes)) ||
                            // For compose (but not compose.start) events, always join with previous event
                            userEvent == "input.type.compose")
                    ) {
                        done = updateBranch(
                            done,
                            done.length - 1,
                            maxLen,
                            new HistEvent(
                                event.changes.compose(lastEvent.changes),
                                conc(event.effects, lastEvent.effects),
                                lastEvent.mapped,
                                lastEvent.startSelection,
                                none
                            )
                        );
                    } else {
                        done = updateBranch(done, done.length, maxLen, event);
                    }
                    return new HistoryState(done, none, time, userEvent);
                }
                addSelection(selection, time, userEvent, newGroupDelay) {
                    let last = this.done.length
                        ? this.done[this.done.length - 1].selectionsAfter
                        : none;
                    if (
                        last.length > 0 &&
                        time - this.prevTime < newGroupDelay &&
                        userEvent == this.prevUserEvent &&
                        userEvent &&
                        /^select($|\.)/.test(userEvent) &&
                        eqSelectionShape(last[last.length - 1], selection)
                    )
                        return this;
                    return new HistoryState(
                        addSelection(this.done, selection),
                        this.undone,
                        time,
                        userEvent
                    );
                }
                addMapping(mapping) {
                    return new HistoryState(
                        addMappingToBranch(this.done, mapping),
                        addMappingToBranch(this.undone, mapping),
                        this.prevTime,
                        this.prevUserEvent
                    );
                }
                pop(side, state, selection) {
                    let branch = side == 0 /* Done */ ? this.done : this.undone;
                    if (branch.length == 0) return null;
                    let event = branch[branch.length - 1];
                    if (selection && event.selectionsAfter.length) {
                        return state.update({
                            selection:
                                event.selectionsAfter[
                                    event.selectionsAfter.length - 1
                                ],
                            annotations: fromHistory.of({
                                side,
                                rest: popSelection(branch),
                            }),
                            userEvent:
                                side == 0 /* Done */
                                    ? "select.undo"
                                    : "select.redo",
                            scrollIntoView: true,
                        });
                    } else if (!event.changes) {
                        return null;
                    } else {
                        let rest =
                            branch.length == 1
                                ? none
                                : branch.slice(0, branch.length - 1);
                        if (event.mapped)
                            rest = addMappingToBranch(rest, event.mapped);
                        return state.update({
                            changes: event.changes,
                            selection: event.startSelection,
                            effects: event.effects,
                            annotations: fromHistory.of({ side, rest }),
                            filter: false,
                            userEvent: side == 0 /* Done */ ? "undo" : "redo",
                            scrollIntoView: true,
                        });
                    }
                }
            }
            HistoryState.empty = /*@__PURE__*/ new HistoryState(none, none);
            /**
Default key bindings for the undo history.

- Mod-z: [`undo`](https://codemirror.net/6/docs/ref/#commands.undo).
- Mod-y (Mod-Shift-z on macOS): [`redo`](https://codemirror.net/6/docs/ref/#commands.redo).
- Mod-u: [`undoSelection`](https://codemirror.net/6/docs/ref/#commands.undoSelection).
- Alt-u (Mod-Shift-u on macOS): [`redoSelection`](https://codemirror.net/6/docs/ref/#commands.redoSelection).
*/
            const historyKeymap = [
                { key: "Mod-z", run: undo, preventDefault: true },
                {
                    key: "Mod-y",
                    mac: "Mod-Shift-z",
                    run: redo,
                    preventDefault: true,
                },
                { key: "Mod-u", run: undoSelection, preventDefault: true },
                {
                    key: "Alt-u",
                    mac: "Mod-Shift-u",
                    run: redoSelection,
                    preventDefault: true,
                },
            ];

            function updateSel(sel, by) {
                return state_dist /* EditorSelection.create */.jT
                    .create(sel.ranges.map(by), sel.mainIndex);
            }
            function setSel(state, selection) {
                return state.update({
                    selection,
                    scrollIntoView: true,
                    userEvent: "select",
                });
            }
            function moveSel({ state, dispatch }, how) {
                let selection = updateSel(state.selection, how);
                if (selection.eq(state.selection)) return false;
                dispatch(setSel(state, selection));
                return true;
            }
            function rangeEnd(range, forward) {
                return state_dist /* EditorSelection.cursor */.jT
                    .cursor(forward ? range.to : range.from);
            }
            function cursorByChar(view, forward) {
                return moveSel(view, (range) =>
                    range.empty
                        ? view.moveByChar(range, forward)
                        : rangeEnd(range, forward)
                );
            }
            function ltrAtCursor(view) {
                return (
                    view.textDirectionAt(view.state.selection.main.head) ==
                    dist /* Direction.LTR */.Nm.LTR
                );
            }
            /**
Move the selection one character to the left (which is backward in
left-to-right text, forward in right-to-left text).
*/
            const cursorCharLeft = (view) =>
                cursorByChar(view, !ltrAtCursor(view));
            /**
Move the selection one character to the right.
*/
            const cursorCharRight = (view) =>
                cursorByChar(view, ltrAtCursor(view));
            /**
Move the selection one character forward.
*/
            const cursorCharForward = (view) => cursorByChar(view, true);
            /**
Move the selection one character backward.
*/
            const cursorCharBackward = (view) => cursorByChar(view, false);
            function cursorByGroup(view, forward) {
                return moveSel(view, (range) =>
                    range.empty
                        ? view.moveByGroup(range, forward)
                        : rangeEnd(range, forward)
                );
            }
            /**
Move the selection to the left across one group of word or
non-word (but also non-space) characters.
*/
            const cursorGroupLeft = (view) =>
                cursorByGroup(view, !ltrAtCursor(view));
            /**
Move the selection one group to the right.
*/
            const cursorGroupRight = (view) =>
                cursorByGroup(view, ltrAtCursor(view));
            /**
Move the selection one group forward.
*/
            const cursorGroupForward = (view) => cursorByGroup(view, true);
            /**
Move the selection one group backward.
*/
            const cursorGroupBackward = (view) => cursorByGroup(view, false);
            function moveBySubword(view, range, forward) {
                let categorize = view.state.charCategorizer(range.from);
                return view.moveByChar(range, forward, (start) => {
                    let cat = CharCategory.Space,
                        pos = range.from;
                    let done = false,
                        sawUpper = false,
                        sawLower = false;
                    let step = (next) => {
                        if (done) return false;
                        pos += forward ? next.length : -next.length;
                        let nextCat = categorize(next),
                            ahead;
                        if (cat == CharCategory.Space) cat = nextCat;
                        if (cat != nextCat) return false;
                        if (cat == CharCategory.Word) {
                            if (next.toLowerCase() == next) {
                                if (!forward && sawUpper) return false;
                                sawLower = true;
                            } else if (sawLower) {
                                if (forward) return false;
                                done = true;
                            } else {
                                if (
                                    sawUpper &&
                                    forward &&
                                    categorize(
                                        (ahead = view.state.sliceDoc(
                                            pos,
                                            pos + 1
                                        ))
                                    ) == CharCategory.Word &&
                                    ahead.toLowerCase() == ahead
                                )
                                    return false;
                                sawUpper = true;
                            }
                        }
                        return true;
                    };
                    step(start);
                    return step;
                });
            }
            function cursorBySubword(view, forward) {
                return moveSel(view, (range) =>
                    range.empty
                        ? moveBySubword(view, range, forward)
                        : rangeEnd(range, forward)
                );
            }
            /**
Move the selection one group or camel-case subword forward.
*/
            const cursorSubwordForward = (view) => cursorBySubword(view, true);
            /**
Move the selection one group or camel-case subword backward.
*/
            const cursorSubwordBackward = (view) =>
                cursorBySubword(view, false);
            function interestingNode(state, node, bracketProp) {
                if (node.type.prop(bracketProp)) return true;
                let len = node.to - node.from;
                return (
                    (len &&
                        (len > 2 ||
                            /[^\s,.;:]/.test(
                                state.sliceDoc(node.from, node.to)
                            ))) ||
                    node.firstChild
                );
            }
            function moveBySyntax(state, start, forward) {
                let pos = dist_syntaxTree(state).resolveInner(start.head);
                let bracketProp = forward
                    ? dist_NodeProp.closedBy
                    : dist_NodeProp.openedBy;
                // Scan forward through child nodes to see if there's an interesting
                // node ahead.
                for (let at = start.head; ; ) {
                    let next = forward
                        ? pos.childAfter(at)
                        : pos.childBefore(at);
                    if (!next) break;
                    if (interestingNode(state, next, bracketProp)) pos = next;
                    else at = forward ? next.to : next.from;
                }
                let bracket = pos.type.prop(bracketProp),
                    match,
                    newPos;
                if (
                    bracket &&
                    (match = forward
                        ? matchBrackets(state, pos.from, 1)
                        : matchBrackets(state, pos.to, -1)) &&
                    match.matched
                )
                    newPos = forward ? match.end.to : match.end.from;
                else newPos = forward ? pos.to : pos.from;
                return state_dist /* EditorSelection.cursor */.jT
                    .cursor(newPos, forward ? -1 : 1);
            }
            /**
Move the cursor over the next syntactic element to the left.
*/
            const cursorSyntaxLeft = (view) =>
                moveSel(view, (range) =>
                    moveBySyntax(view.state, range, !ltrAtCursor(view))
                );
            /**
Move the cursor over the next syntactic element to the right.
*/
            const cursorSyntaxRight = (view) =>
                moveSel(view, (range) =>
                    moveBySyntax(view.state, range, ltrAtCursor(view))
                );
            function cursorByLine(view, forward) {
                return moveSel(view, (range) => {
                    if (!range.empty) return rangeEnd(range, forward);
                    let moved = view.moveVertically(range, forward);
                    return moved.head != range.head
                        ? moved
                        : view.moveToLineBoundary(range, forward);
                });
            }
            /**
Move the selection one line up.
*/
            const cursorLineUp = (view) => cursorByLine(view, false);
            /**
Move the selection one line down.
*/
            const cursorLineDown = (view) => cursorByLine(view, true);
            function cursorByPage(view, forward) {
                let { state } = view,
                    selection = updateSel(state.selection, (range) => {
                        return range.empty
                            ? view.moveVertically(
                                  range,
                                  forward,
                                  Math.min(view.dom.clientHeight, innerHeight)
                              )
                            : rangeEnd(range, forward);
                    });
                if (selection.eq(state.selection)) return false;
                let startPos = view.coordsAtPos(state.selection.main.head);
                let scrollRect = view.scrollDOM.getBoundingClientRect();
                let effect;
                if (
                    startPos &&
                    startPos.top > scrollRect.top &&
                    startPos.bottom < scrollRect.bottom &&
                    startPos.top - scrollRect.top <=
                        view.scrollDOM.scrollHeight -
                            view.scrollDOM.scrollTop -
                            view.scrollDOM.clientHeight
                )
                    effect = dist /* EditorView.scrollIntoView */.tk
                        .scrollIntoView(selection.main.head, {
                            y: "start",
                            yMargin: startPos.top - scrollRect.top,
                        });
                view.dispatch(setSel(state, selection), { effects: effect });
                return true;
            }
            /**
Move the selection one page up.
*/
            const cursorPageUp = (view) => cursorByPage(view, false);
            /**
Move the selection one page down.
*/
            const cursorPageDown = (view) => cursorByPage(view, true);
            function moveByLineBoundary(view, start, forward) {
                let line = view.lineBlockAt(start.head),
                    moved = view.moveToLineBoundary(start, forward);
                if (
                    moved.head == start.head &&
                    moved.head != (forward ? line.to : line.from)
                )
                    moved = view.moveToLineBoundary(start, forward, false);
                if (!forward && moved.head == line.from && line.length) {
                    let space = /^\s*/.exec(
                        view.state.sliceDoc(
                            line.from,
                            Math.min(line.from + 100, line.to)
                        )
                    )[0].length;
                    if (space && start.head != line.from + space)
                        moved = state_dist /* EditorSelection.cursor */.jT
                            .cursor(line.from + space);
                }
                return moved;
            }
            /**
Move the selection to the next line wrap point, or to the end of
the line if there isn't one left on this line.
*/
            const cursorLineBoundaryForward = (view) =>
                moveSel(view, (range) => moveByLineBoundary(view, range, true));
            /**
Move the selection to previous line wrap point, or failing that to
the start of the line. If the line is indented, and the cursor
isn't already at the end of the indentation, this will move to the
end of the indentation instead of the start of the line.
*/
            const cursorLineBoundaryBackward = (view) =>
                moveSel(view, (range) =>
                    moveByLineBoundary(view, range, false)
                );
            /**
Move the selection to the start of the line.
*/
            const cursorLineStart = (view) =>
                moveSel(view, (range) =>
                    state_dist /* EditorSelection.cursor */.jT
                        .cursor(view.lineBlockAt(range.head).from, 1)
                );
            /**
Move the selection to the end of the line.
*/
            const cursorLineEnd = (view) =>
                moveSel(view, (range) =>
                    state_dist /* EditorSelection.cursor */.jT
                        .cursor(view.lineBlockAt(range.head).to, -1)
                );
            function toMatchingBracket(state, dispatch, extend) {
                let found = false,
                    selection = updateSel(state.selection, (range) => {
                        let matching =
                            matchBrackets(state, range.head, -1) ||
                            matchBrackets(state, range.head, 1) ||
                            (range.head > 0 &&
                                matchBrackets(state, range.head - 1, 1)) ||
                            (range.head < state.doc.length &&
                                matchBrackets(state, range.head + 1, -1));
                        if (!matching || !matching.end) return range;
                        found = true;
                        let head =
                            matching.start.from == range.head
                                ? matching.end.to
                                : matching.end.from;
                        return extend
                            ? state_dist /* EditorSelection.range */.jT
                                  .range(range.anchor, head)
                            : state_dist /* EditorSelection.cursor */.jT
                                  .cursor(head);
                    });
                if (!found) return false;
                dispatch(setSel(state, selection));
                return true;
            }
            /**
Move the selection to the bracket matching the one it is currently
on, if any.
*/
            const cursorMatchingBracket = ({ state, dispatch }) =>
                toMatchingBracket(state, dispatch, false);
            /**
Extend the selection to the bracket matching the one the selection
head is currently on, if any.
*/
            const selectMatchingBracket = ({ state, dispatch }) =>
                toMatchingBracket(state, dispatch, true);
            function extendSel(view, how) {
                let selection = updateSel(view.state.selection, (range) => {
                    let head = how(range);
                    return state_dist /* EditorSelection.range */.jT
                        .range(range.anchor, head.head, head.goalColumn);
                });
                if (selection.eq(view.state.selection)) return false;
                view.dispatch(setSel(view.state, selection));
                return true;
            }
            function selectByChar(view, forward) {
                return extendSel(view, (range) =>
                    view.moveByChar(range, forward)
                );
            }
            /**
Move the selection head one character to the left, while leaving
the anchor in place.
*/
            const selectCharLeft = (view) =>
                selectByChar(view, !ltrAtCursor(view));
            /**
Move the selection head one character to the right.
*/
            const selectCharRight = (view) =>
                selectByChar(view, ltrAtCursor(view));
            /**
Move the selection head one character forward.
*/
            const selectCharForward = (view) => selectByChar(view, true);
            /**
Move the selection head one character backward.
*/
            const selectCharBackward = (view) => selectByChar(view, false);
            function selectByGroup(view, forward) {
                return extendSel(view, (range) =>
                    view.moveByGroup(range, forward)
                );
            }
            /**
Move the selection head one [group](https://codemirror.net/6/docs/ref/#commands.cursorGroupLeft) to
the left.
*/
            const selectGroupLeft = (view) =>
                selectByGroup(view, !ltrAtCursor(view));
            /**
Move the selection head one group to the right.
*/
            const selectGroupRight = (view) =>
                selectByGroup(view, ltrAtCursor(view));
            /**
Move the selection head one group forward.
*/
            const selectGroupForward = (view) => selectByGroup(view, true);
            /**
Move the selection head one group backward.
*/
            const selectGroupBackward = (view) => selectByGroup(view, false);
            function selectBySubword(view, forward) {
                return extendSel(view, (range) =>
                    moveBySubword(view, range, forward)
                );
            }
            /**
Move the selection head one group or camel-case subword forward.
*/
            const selectSubwordForward = (view) => selectBySubword(view, true);
            /**
Move the selection head one group or subword backward.
*/
            const selectSubwordBackward = (view) =>
                selectBySubword(view, false);
            /**
Move the selection head over the next syntactic element to the left.
*/
            const selectSyntaxLeft = (view) =>
                extendSel(view, (range) =>
                    moveBySyntax(view.state, range, !ltrAtCursor(view))
                );
            /**
Move the selection head over the next syntactic element to the right.
*/
            const selectSyntaxRight = (view) =>
                extendSel(view, (range) =>
                    moveBySyntax(view.state, range, ltrAtCursor(view))
                );
            function selectByLine(view, forward) {
                return extendSel(view, (range) =>
                    view.moveVertically(range, forward)
                );
            }
            /**
Move the selection head one line up.
*/
            const selectLineUp = (view) => selectByLine(view, false);
            /**
Move the selection head one line down.
*/
            const selectLineDown = (view) => selectByLine(view, true);
            function selectByPage(view, forward) {
                return extendSel(view, (range) =>
                    view.moveVertically(
                        range,
                        forward,
                        Math.min(view.dom.clientHeight, innerHeight)
                    )
                );
            }
            /**
Move the selection head one page up.
*/
            const selectPageUp = (view) => selectByPage(view, false);
            /**
Move the selection head one page down.
*/
            const selectPageDown = (view) => selectByPage(view, true);
            /**
Move the selection head to the next line boundary.
*/
            const selectLineBoundaryForward = (view) =>
                extendSel(view, (range) =>
                    moveByLineBoundary(view, range, true)
                );
            /**
Move the selection head to the previous line boundary.
*/
            const selectLineBoundaryBackward = (view) =>
                extendSel(view, (range) =>
                    moveByLineBoundary(view, range, false)
                );
            /**
Move the selection head to the start of the line.
*/
            const selectLineStart = (view) =>
                extendSel(view, (range) =>
                    state_dist /* EditorSelection.cursor */.jT
                        .cursor(view.lineBlockAt(range.head).from)
                );
            /**
Move the selection head to the end of the line.
*/
            const selectLineEnd = (view) =>
                extendSel(view, (range) =>
                    state_dist /* EditorSelection.cursor */.jT
                        .cursor(view.lineBlockAt(range.head).to)
                );
            /**
Move the selection to the start of the document.
*/
            const cursorDocStart = ({ state, dispatch }) => {
                dispatch(setSel(state, { anchor: 0 }));
                return true;
            };
            /**
Move the selection to the end of the document.
*/
            const cursorDocEnd = ({ state, dispatch }) => {
                dispatch(setSel(state, { anchor: state.doc.length }));
                return true;
            };
            /**
Move the selection head to the start of the document.
*/
            const selectDocStart = ({ state, dispatch }) => {
                dispatch(
                    setSel(state, {
                        anchor: state.selection.main.anchor,
                        head: 0,
                    })
                );
                return true;
            };
            /**
Move the selection head to the end of the document.
*/
            const selectDocEnd = ({ state, dispatch }) => {
                dispatch(
                    setSel(state, {
                        anchor: state.selection.main.anchor,
                        head: state.doc.length,
                    })
                );
                return true;
            };
            /**
Select the entire document.
*/
            const selectAll = ({ state, dispatch }) => {
                dispatch(
                    state.update({
                        selection: { anchor: 0, head: state.doc.length },
                        userEvent: "select",
                    })
                );
                return true;
            };
            /**
Expand the selection to cover entire lines.
*/
            const selectLine = ({ state, dispatch }) => {
                let ranges = selectedLineBlocks(state).map(({ from, to }) =>
                    state_dist /* EditorSelection.range */.jT
                        .range(from, Math.min(to + 1, state.doc.length))
                );
                dispatch(
                    state.update({
                        selection: state_dist /* EditorSelection.create */.jT
                            .create(ranges),
                        userEvent: "select",
                    })
                );
                return true;
            };
            /**
Select the next syntactic construct that is larger than the
selection. Note that this will only work insofar as the language
[provider](https://codemirror.net/6/docs/ref/#language.language) you use builds up a full
syntax tree.
*/
            const selectParentSyntax = ({ state, dispatch }) => {
                let selection = updateSel(state.selection, (range) => {
                    var _a;
                    let context = dist_syntaxTree(state).resolveInner(
                        range.head,
                        1
                    );
                    while (
                        !(
                            (context.from < range.from &&
                                context.to >= range.to) ||
                            (context.to > range.to &&
                                context.from <= range.from) ||
                            !((_a = context.parent) === null || _a === void 0
                                ? void 0
                                : _a.parent)
                        )
                    )
                        context = context.parent;
                    return state_dist /* EditorSelection.range */.jT
                        .range(context.to, context.from);
                });
                dispatch(setSel(state, selection));
                return true;
            };
            /**
Simplify the current selection. When multiple ranges are selected,
reduce it to its main range. Otherwise, if the selection is
non-empty, convert it to a cursor selection.
*/
            const simplifySelection = ({ state, dispatch }) => {
                let cur = state.selection,
                    selection = null;
                if (cur.ranges.length > 1)
                    selection = state_dist /* EditorSelection.create */.jT
                        .create([cur.main]);
                else if (!cur.main.empty)
                    selection = state_dist /* EditorSelection.create */.jT
                        .create([
                            state_dist /* EditorSelection.cursor */.jT
                                .cursor(cur.main.head),
                        ]);
                if (!selection) return false;
                dispatch(setSel(state, selection));
                return true;
            };
            function deleteBy({ state, dispatch }, by) {
                if (state.readOnly) return false;
                let event = "delete.selection";
                let changes = state.changeByRange((range) => {
                    let { from, to } = range;
                    if (from == to) {
                        let towards = by(from);
                        if (towards < from) event = "delete.backward";
                        else if (towards > from) event = "delete.forward";
                        from = Math.min(from, towards);
                        to = Math.max(to, towards);
                    }
                    return from == to
                        ? { range }
                        : {
                              changes: { from, to },
                              range: state_dist /* EditorSelection.cursor */.jT
                                  .cursor(from),
                          };
                });
                if (changes.changes.empty) return false;
                dispatch(
                    state.update(changes, {
                        scrollIntoView: true,
                        userEvent: event,
                    })
                );
                return true;
            }
            function skipAtomic(target, pos, forward) {
                if (target instanceof dist /* EditorView */.tk)
                    for (let ranges of target.state
                        .facet(
                            dist /* EditorView.atomicRanges */.tk.atomicRanges
                        )
                        .map((f) => f(target)))
                        ranges.between(pos, pos, (from, to) => {
                            if (from < pos && to > pos)
                                pos = forward ? to : from;
                        });
                return pos;
            }
            const deleteByChar = (target, forward) =>
                deleteBy(target, (pos) => {
                    let { state } = target,
                        line = state.doc.lineAt(pos),
                        before,
                        targetPos;
                    if (
                        !forward &&
                        pos > line.from &&
                        pos < line.from + 200 &&
                        !/[^ \t]/.test(
                            (before = line.text.slice(0, pos - line.from))
                        )
                    ) {
                        if (before[before.length - 1] == "\t") return pos - 1;
                        let col = (0, state_dist /* countColumn */.IS)(
                                before,
                                state.tabSize
                            ),
                            drop =
                                col % getIndentUnit(state) ||
                                getIndentUnit(state);
                        for (
                            let i = 0;
                            i < drop && before[before.length - 1 - i] == " ";
                            i++
                        )
                            pos--;
                        targetPos = pos;
                    } else {
                        targetPos =
                            (0, state_dist /* findClusterBreak */.cp)(
                                line.text,
                                pos - line.from,
                                forward,
                                forward
                            ) + line.from;
                        if (
                            targetPos == pos &&
                            line.number != (forward ? state.doc.lines : 1)
                        )
                            targetPos += forward ? 1 : -1;
                    }
                    return skipAtomic(target, targetPos, forward);
                });
            /**
Delete the selection, or, for cursor selections, the character
before the cursor.
*/
            const deleteCharBackward = (view) => deleteByChar(view, false);
            /**
Delete the selection or the character after the cursor.
*/
            const deleteCharForward = (view) => deleteByChar(view, true);
            const deleteByGroup = (target, forward) =>
                deleteBy(target, (start) => {
                    let pos = start,
                        { state } = target,
                        line = state.doc.lineAt(pos);
                    let categorize = state.charCategorizer(pos);
                    for (let cat = null; ; ) {
                        if (pos == (forward ? line.to : line.from)) {
                            if (
                                pos == start &&
                                line.number != (forward ? state.doc.lines : 1)
                            )
                                pos += forward ? 1 : -1;
                            break;
                        }
                        let next =
                            (0, state_dist /* findClusterBreak */.cp)(
                                line.text,
                                pos - line.from,
                                forward
                            ) + line.from;
                        let nextChar = line.text.slice(
                            Math.min(pos, next) - line.from,
                            Math.max(pos, next) - line.from
                        );
                        let nextCat = categorize(nextChar);
                        if (cat != null && nextCat != cat) break;
                        if (nextChar != " " || pos != start) cat = nextCat;
                        pos = next;
                    }
                    return skipAtomic(target, pos, forward);
                });
            /**
Delete the selection or backward until the end of the next
[group](https://codemirror.net/6/docs/ref/#view.EditorView.moveByGroup), only skipping groups of
whitespace when they consist of a single space.
*/
            const deleteGroupBackward = (target) =>
                deleteByGroup(target, false);
            /**
Delete the selection or forward until the end of the next group.
*/
            const deleteGroupForward = (target) => deleteByGroup(target, true);
            /**
Delete the selection, or, if it is a cursor selection, delete to
the end of the line. If the cursor is directly at the end of the
line, delete the line break after it.
*/
            const deleteToLineEnd = (view) =>
                deleteBy(view, (pos) => {
                    let lineEnd = view.lineBlockAt(pos).to;
                    return skipAtomic(
                        view,
                        pos < lineEnd
                            ? lineEnd
                            : Math.min(view.state.doc.length, pos + 1),
                        true
                    );
                });
            /**
Delete the selection, or, if it is a cursor selection, delete to
the start of the line. If the cursor is directly at the start of the
line, delete the line break before it.
*/
            const deleteToLineStart = (view) =>
                deleteBy(view, (pos) => {
                    let lineStart = view.lineBlockAt(pos).from;
                    return skipAtomic(
                        view,
                        pos > lineStart ? lineStart : Math.max(0, pos - 1),
                        false
                    );
                });
            /**
Delete all whitespace directly before a line end from the
document.
*/
            const deleteTrailingWhitespace = ({ state, dispatch }) => {
                if (state.readOnly) return false;
                let changes = [];
                for (let pos = 0, prev = "", iter = state.doc.iter(); ; ) {
                    iter.next();
                    if (iter.lineBreak || iter.done) {
                        let trailing = prev.search(/\s+$/);
                        if (trailing > -1)
                            changes.push({
                                from: pos - (prev.length - trailing),
                                to: pos,
                            });
                        if (iter.done) break;
                        prev = "";
                    } else {
                        prev = iter.value;
                    }
                    pos += iter.value.length;
                }
                if (!changes.length) return false;
                dispatch(state.update({ changes, userEvent: "delete" }));
                return true;
            };
            /**
Replace each selection range with a line break, leaving the cursor
on the line before the break.
*/
            const splitLine = ({ state, dispatch }) => {
                if (state.readOnly) return false;
                let changes = state.changeByRange((range) => {
                    return {
                        changes: {
                            from: range.from,
                            to: range.to,
                            insert: state_dist /* Text.of */.xv
                                .of(["", ""]),
                        },
                        range: state_dist /* EditorSelection.cursor */.jT
                            .cursor(range.from),
                    };
                });
                dispatch(
                    state.update(changes, {
                        scrollIntoView: true,
                        userEvent: "input",
                    })
                );
                return true;
            };
            /**
Flip the characters before and after the cursor(s).
*/
            const transposeChars = ({ state, dispatch }) => {
                if (state.readOnly) return false;
                let changes = state.changeByRange((range) => {
                    if (
                        !range.empty ||
                        range.from == 0 ||
                        range.from == state.doc.length
                    )
                        return { range };
                    let pos = range.from,
                        line = state.doc.lineAt(pos);
                    let from =
                        pos == line.from
                            ? pos - 1
                            : (0, state_dist /* findClusterBreak */.cp)(
                                  line.text,
                                  pos - line.from,
                                  false
                              ) + line.from;
                    let to =
                        pos == line.to
                            ? pos + 1
                            : (0, state_dist /* findClusterBreak */.cp)(
                                  line.text,
                                  pos - line.from,
                                  true
                              ) + line.from;
                    return {
                        changes: {
                            from,
                            to,
                            insert: state.doc
                                .slice(pos, to)
                                .append(state.doc.slice(from, pos)),
                        },
                        range: state_dist /* EditorSelection.cursor */.jT
                            .cursor(to),
                    };
                });
                if (changes.changes.empty) return false;
                dispatch(
                    state.update(changes, {
                        scrollIntoView: true,
                        userEvent: "move.character",
                    })
                );
                return true;
            };
            function selectedLineBlocks(state) {
                let blocks = [],
                    upto = -1;
                for (let range of state.selection.ranges) {
                    let startLine = state.doc.lineAt(range.from),
                        endLine = state.doc.lineAt(range.to);
                    if (!range.empty && range.to == endLine.from)
                        endLine = state.doc.lineAt(range.to - 1);
                    if (upto >= startLine.number) {
                        let prev = blocks[blocks.length - 1];
                        prev.to = endLine.to;
                        prev.ranges.push(range);
                    } else {
                        blocks.push({
                            from: startLine.from,
                            to: endLine.to,
                            ranges: [range],
                        });
                    }
                    upto = endLine.number + 1;
                }
                return blocks;
            }
            function moveLine(state, dispatch, forward) {
                if (state.readOnly) return false;
                let changes = [],
                    ranges = [];
                for (let block of selectedLineBlocks(state)) {
                    if (
                        forward ? block.to == state.doc.length : block.from == 0
                    )
                        continue;
                    let nextLine = state.doc.lineAt(
                        forward ? block.to + 1 : block.from - 1
                    );
                    let size = nextLine.length + 1;
                    if (forward) {
                        changes.push(
                            { from: block.to, to: nextLine.to },
                            {
                                from: block.from,
                                insert: nextLine.text + state.lineBreak,
                            }
                        );
                        for (let r of block.ranges)
                            ranges.push(
                                state_dist /* EditorSelection.range */.jT
                                    .range(
                                        Math.min(
                                            state.doc.length,
                                            r.anchor + size
                                        ),
                                        Math.min(
                                            state.doc.length,
                                            r.head + size
                                        )
                                    )
                            );
                    } else {
                        changes.push(
                            { from: nextLine.from, to: block.from },
                            {
                                from: block.to,
                                insert: state.lineBreak + nextLine.text,
                            }
                        );
                        for (let r of block.ranges)
                            ranges.push(
                                state_dist /* EditorSelection.range */.jT
                                    .range(r.anchor - size, r.head - size)
                            );
                    }
                }
                if (!changes.length) return false;
                dispatch(
                    state.update({
                        changes,
                        scrollIntoView: true,
                        selection: state_dist /* EditorSelection.create */.jT
                            .create(ranges, state.selection.mainIndex),
                        userEvent: "move.line",
                    })
                );
                return true;
            }
            /**
Move the selected lines up one line.
*/
            const moveLineUp = ({ state, dispatch }) =>
                moveLine(state, dispatch, false);
            /**
Move the selected lines down one line.
*/
            const moveLineDown = ({ state, dispatch }) =>
                moveLine(state, dispatch, true);
            function copyLine(state, dispatch, forward) {
                if (state.readOnly) return false;
                let changes = [];
                for (let block of selectedLineBlocks(state)) {
                    if (forward)
                        changes.push({
                            from: block.from,
                            insert:
                                state.doc.slice(block.from, block.to) +
                                state.lineBreak,
                        });
                    else
                        changes.push({
                            from: block.to,
                            insert:
                                state.lineBreak +
                                state.doc.slice(block.from, block.to),
                        });
                }
                dispatch(
                    state.update({
                        changes,
                        scrollIntoView: true,
                        userEvent: "input.copyline",
                    })
                );
                return true;
            }
            /**
Create a copy of the selected lines. Keep the selection in the top copy.
*/
            const copyLineUp = ({ state, dispatch }) =>
                copyLine(state, dispatch, false);
            /**
Create a copy of the selected lines. Keep the selection in the bottom copy.
*/
            const copyLineDown = ({ state, dispatch }) =>
                copyLine(state, dispatch, true);
            /**
Delete selected lines.
*/
            const deleteLine = (view) => {
                if (view.state.readOnly) return false;
                let { state } = view,
                    changes = state.changes(
                        selectedLineBlocks(state).map(({ from, to }) => {
                            if (from > 0) from--;
                            else if (to < state.doc.length) to++;
                            return { from, to };
                        })
                    );
                let selection = updateSel(state.selection, (range) =>
                    view.moveVertically(range, true)
                ).map(changes);
                view.dispatch({
                    changes,
                    selection,
                    scrollIntoView: true,
                    userEvent: "delete.line",
                });
                return true;
            };
            /**
Replace the selection with a newline.
*/
            const insertNewline = ({ state, dispatch }) => {
                dispatch(
                    state.update(state.replaceSelection(state.lineBreak), {
                        scrollIntoView: true,
                        userEvent: "input",
                    })
                );
                return true;
            };
            function isBetweenBrackets(state, pos) {
                if (/\(\)|\[\]|\{\}/.test(state.sliceDoc(pos - 1, pos + 1)))
                    return { from: pos, to: pos };
                let context = dist_syntaxTree(state).resolveInner(pos);
                let before = context.childBefore(pos),
                    after = context.childAfter(pos),
                    closedBy;
                if (
                    before &&
                    after &&
                    before.to <= pos &&
                    after.from >= pos &&
                    (closedBy = before.type.prop(dist_NodeProp.closedBy)) &&
                    closedBy.indexOf(after.name) > -1 &&
                    state.doc.lineAt(before.to).from ==
                        state.doc.lineAt(after.from).from
                )
                    return { from: before.to, to: after.from };
                return null;
            }
            /**
Replace the selection with a newline and indent the newly created
line(s). If the current line consists only of whitespace, this
will also delete that whitespace. When the cursor is between
matching brackets, an additional newline will be inserted after
the cursor.
*/
            const insertNewlineAndIndent =
                /*@__PURE__*/ newlineAndIndent(false);
            /**
Create a blank, indented line below the current line.
*/
            const insertBlankLine = /*@__PURE__*/ newlineAndIndent(true);
            function newlineAndIndent(atEof) {
                return ({ state, dispatch }) => {
                    if (state.readOnly) return false;
                    let changes = state.changeByRange((range) => {
                        let { from, to } = range,
                            line = state.doc.lineAt(from);
                        let explode =
                            !atEof &&
                            from == to &&
                            isBetweenBrackets(state, from);
                        if (atEof)
                            from = to = (
                                to <= line.to ? line : state.doc.lineAt(to)
                            ).to;
                        let cx = new IndentContext(state, {
                            simulateBreak: from,
                            simulateDoubleBreak: !!explode,
                        });
                        let indent = getIndentation(cx, from);
                        if (indent == null)
                            indent = /^\s*/.exec(state.doc.lineAt(from).text)[0]
                                .length;
                        while (
                            to < line.to &&
                            /\s/.test(line.text[to - line.from])
                        )
                            to++;
                        if (explode) ({ from, to } = explode);
                        else if (
                            from > line.from &&
                            from < line.from + 100 &&
                            !/\S/.test(line.text.slice(0, from))
                        )
                            from = line.from;
                        let insert = ["", indentString(state, indent)];
                        if (explode)
                            insert.push(
                                indentString(
                                    state,
                                    cx.lineIndent(line.from, -1)
                                )
                            );
                        return {
                            changes: {
                                from,
                                to,
                                insert: state_dist /* Text.of */.xv
                                    .of(insert),
                            },
                            range: state_dist /* EditorSelection.cursor */.jT
                                .cursor(from + 1 + insert[1].length),
                        };
                    });
                    dispatch(
                        state.update(changes, {
                            scrollIntoView: true,
                            userEvent: "input",
                        })
                    );
                    return true;
                };
            }
            function changeBySelectedLine(state, f) {
                let atLine = -1;
                return state.changeByRange((range) => {
                    let changes = [];
                    for (let pos = range.from; pos <= range.to; ) {
                        let line = state.doc.lineAt(pos);
                        if (
                            line.number > atLine &&
                            (range.empty || range.to > line.from)
                        ) {
                            f(line, changes, range);
                            atLine = line.number;
                        }
                        pos = line.to + 1;
                    }
                    let changeSet = state.changes(changes);
                    return {
                        changes,
                        range: state_dist /* EditorSelection.range */.jT
                            .range(
                                changeSet.mapPos(range.anchor, 1),
                                changeSet.mapPos(range.head, 1)
                            ),
                    };
                });
            }
            /**
Auto-indent the selected lines. This uses the [indentation service
facet](https://codemirror.net/6/docs/ref/#language.indentService) as source for auto-indent
information.
*/
            const indentSelection = ({ state, dispatch }) => {
                if (state.readOnly) return false;
                let updated = Object.create(null);
                let context = new IndentContext(state, {
                    overrideIndentation: (start) => {
                        let found = updated[start];
                        return found == null ? -1 : found;
                    },
                });
                let changes = changeBySelectedLine(
                    state,
                    (line, changes, range) => {
                        let indent = getIndentation(context, line.from);
                        if (indent == null) return;
                        if (!/\S/.test(line.text)) indent = 0;
                        let cur = /^\s*/.exec(line.text)[0];
                        let norm = indentString(state, indent);
                        if (
                            cur != norm ||
                            range.from < line.from + cur.length
                        ) {
                            updated[line.from] = indent;
                            changes.push({
                                from: line.from,
                                to: line.from + cur.length,
                                insert: norm,
                            });
                        }
                    }
                );
                if (!changes.changes.empty)
                    dispatch(state.update(changes, { userEvent: "indent" }));
                return true;
            };
            /**
Add a [unit](https://codemirror.net/6/docs/ref/#language.indentUnit) of indentation to all selected
lines.
*/
            const indentMore = ({ state, dispatch }) => {
                if (state.readOnly) return false;
                dispatch(
                    state.update(
                        changeBySelectedLine(state, (line, changes) => {
                            changes.push({
                                from: line.from,
                                insert: state.facet(dist_indentUnit),
                            });
                        }),
                        { userEvent: "input.indent" }
                    )
                );
                return true;
            };
            /**
Remove a [unit](https://codemirror.net/6/docs/ref/#language.indentUnit) of indentation from all
selected lines.
*/
            const indentLess = ({ state, dispatch }) => {
                if (state.readOnly) return false;
                dispatch(
                    state.update(
                        changeBySelectedLine(state, (line, changes) => {
                            let space = /^\s*/.exec(line.text)[0];
                            if (!space) return;
                            let col = (0, state_dist /* countColumn */.IS)(
                                    space,
                                    state.tabSize
                                ),
                                keep = 0;
                            let insert = indentString(
                                state,
                                Math.max(0, col - getIndentUnit(state))
                            );
                            while (
                                keep < space.length &&
                                keep < insert.length &&
                                space.charCodeAt(keep) ==
                                    insert.charCodeAt(keep)
                            )
                                keep++;
                            changes.push({
                                from: line.from + keep,
                                to: line.from + space.length,
                                insert: insert.slice(keep),
                            });
                        }),
                        { userEvent: "delete.dedent" }
                    )
                );
                return true;
            };
            /**
Insert a tab character at the cursor or, if something is selected,
use [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore) to indent the entire
selection.
*/
            const insertTab = ({ state, dispatch }) => {
                if (state.selection.ranges.some((r) => !r.empty))
                    return indentMore({ state, dispatch });
                dispatch(
                    state.update(state.replaceSelection("\t"), {
                        scrollIntoView: true,
                        userEvent: "input",
                    })
                );
                return true;
            };
            /**
Array of key bindings containing the Emacs-style bindings that are
available on macOS by default.

 - Ctrl-b: [`cursorCharLeft`](https://codemirror.net/6/docs/ref/#commands.cursorCharLeft) ([`selectCharLeft`](https://codemirror.net/6/docs/ref/#commands.selectCharLeft) with Shift)
 - Ctrl-f: [`cursorCharRight`](https://codemirror.net/6/docs/ref/#commands.cursorCharRight) ([`selectCharRight`](https://codemirror.net/6/docs/ref/#commands.selectCharRight) with Shift)
 - Ctrl-p: [`cursorLineUp`](https://codemirror.net/6/docs/ref/#commands.cursorLineUp) ([`selectLineUp`](https://codemirror.net/6/docs/ref/#commands.selectLineUp) with Shift)
 - Ctrl-n: [`cursorLineDown`](https://codemirror.net/6/docs/ref/#commands.cursorLineDown) ([`selectLineDown`](https://codemirror.net/6/docs/ref/#commands.selectLineDown) with Shift)
 - Ctrl-a: [`cursorLineStart`](https://codemirror.net/6/docs/ref/#commands.cursorLineStart) ([`selectLineStart`](https://codemirror.net/6/docs/ref/#commands.selectLineStart) with Shift)
 - Ctrl-e: [`cursorLineEnd`](https://codemirror.net/6/docs/ref/#commands.cursorLineEnd) ([`selectLineEnd`](https://codemirror.net/6/docs/ref/#commands.selectLineEnd) with Shift)
 - Ctrl-d: [`deleteCharForward`](https://codemirror.net/6/docs/ref/#commands.deleteCharForward)
 - Ctrl-h: [`deleteCharBackward`](https://codemirror.net/6/docs/ref/#commands.deleteCharBackward)
 - Ctrl-k: [`deleteToLineEnd`](https://codemirror.net/6/docs/ref/#commands.deleteToLineEnd)
 - Ctrl-Alt-h: [`deleteGroupBackward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupBackward)
 - Ctrl-o: [`splitLine`](https://codemirror.net/6/docs/ref/#commands.splitLine)
 - Ctrl-t: [`transposeChars`](https://codemirror.net/6/docs/ref/#commands.transposeChars)
 - Ctrl-v: [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown)
 - Alt-v: [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp)
*/
            const emacsStyleKeymap = [
                {
                    key: "Ctrl-b",
                    run: cursorCharLeft,
                    shift: selectCharLeft,
                    preventDefault: true,
                },
                { key: "Ctrl-f", run: cursorCharRight, shift: selectCharRight },
                { key: "Ctrl-p", run: cursorLineUp, shift: selectLineUp },
                { key: "Ctrl-n", run: cursorLineDown, shift: selectLineDown },
                { key: "Ctrl-a", run: cursorLineStart, shift: selectLineStart },
                { key: "Ctrl-e", run: cursorLineEnd, shift: selectLineEnd },
                { key: "Ctrl-d", run: deleteCharForward },
                { key: "Ctrl-h", run: deleteCharBackward },
                { key: "Ctrl-k", run: deleteToLineEnd },
                { key: "Ctrl-Alt-h", run: deleteGroupBackward },
                { key: "Ctrl-o", run: splitLine },
                { key: "Ctrl-t", run: transposeChars },
                { key: "Ctrl-v", run: cursorPageDown },
            ];
            /**
An array of key bindings closely sticking to platform-standard or
widely used bindings. (This includes the bindings from
[`emacsStyleKeymap`](https://codemirror.net/6/docs/ref/#commands.emacsStyleKeymap), with their `key`
property changed to `mac`.)

 - ArrowLeft: [`cursorCharLeft`](https://codemirror.net/6/docs/ref/#commands.cursorCharLeft) ([`selectCharLeft`](https://codemirror.net/6/docs/ref/#commands.selectCharLeft) with Shift)
 - ArrowRight: [`cursorCharRight`](https://codemirror.net/6/docs/ref/#commands.cursorCharRight) ([`selectCharRight`](https://codemirror.net/6/docs/ref/#commands.selectCharRight) with Shift)
 - Ctrl-ArrowLeft (Alt-ArrowLeft on macOS): [`cursorGroupLeft`](https://codemirror.net/6/docs/ref/#commands.cursorGroupLeft) ([`selectGroupLeft`](https://codemirror.net/6/docs/ref/#commands.selectGroupLeft) with Shift)
 - Ctrl-ArrowRight (Alt-ArrowRight on macOS): [`cursorGroupRight`](https://codemirror.net/6/docs/ref/#commands.cursorGroupRight) ([`selectGroupRight`](https://codemirror.net/6/docs/ref/#commands.selectGroupRight) with Shift)
 - Cmd-ArrowLeft (on macOS): [`cursorLineStart`](https://codemirror.net/6/docs/ref/#commands.cursorLineStart) ([`selectLineStart`](https://codemirror.net/6/docs/ref/#commands.selectLineStart) with Shift)
 - Cmd-ArrowRight (on macOS): [`cursorLineEnd`](https://codemirror.net/6/docs/ref/#commands.cursorLineEnd) ([`selectLineEnd`](https://codemirror.net/6/docs/ref/#commands.selectLineEnd) with Shift)
 - ArrowUp: [`cursorLineUp`](https://codemirror.net/6/docs/ref/#commands.cursorLineUp) ([`selectLineUp`](https://codemirror.net/6/docs/ref/#commands.selectLineUp) with Shift)
 - ArrowDown: [`cursorLineDown`](https://codemirror.net/6/docs/ref/#commands.cursorLineDown) ([`selectLineDown`](https://codemirror.net/6/docs/ref/#commands.selectLineDown) with Shift)
 - Cmd-ArrowUp (on macOS): [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart) ([`selectDocStart`](https://codemirror.net/6/docs/ref/#commands.selectDocStart) with Shift)
 - Cmd-ArrowDown (on macOS): [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd) ([`selectDocEnd`](https://codemirror.net/6/docs/ref/#commands.selectDocEnd) with Shift)
 - Ctrl-ArrowUp (on macOS): [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp) ([`selectPageUp`](https://codemirror.net/6/docs/ref/#commands.selectPageUp) with Shift)
 - Ctrl-ArrowDown (on macOS): [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown) ([`selectPageDown`](https://codemirror.net/6/docs/ref/#commands.selectPageDown) with Shift)
 - PageUp: [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp) ([`selectPageUp`](https://codemirror.net/6/docs/ref/#commands.selectPageUp) with Shift)
 - PageDown: [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown) ([`selectPageDown`](https://codemirror.net/6/docs/ref/#commands.selectPageDown) with Shift)
 - Home: [`cursorLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.cursorLineBoundaryBackward) ([`selectLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.selectLineBoundaryBackward) with Shift)
 - End: [`cursorLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.cursorLineBoundaryForward) ([`selectLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.selectLineBoundaryForward) with Shift)
 - Ctrl-Home (Cmd-Home on macOS): [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart) ([`selectDocStart`](https://codemirror.net/6/docs/ref/#commands.selectDocStart) with Shift)
 - Ctrl-End (Cmd-Home on macOS): [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd) ([`selectDocEnd`](https://codemirror.net/6/docs/ref/#commands.selectDocEnd) with Shift)
 - Enter: [`insertNewlineAndIndent`](https://codemirror.net/6/docs/ref/#commands.insertNewlineAndIndent)
 - Ctrl-a (Cmd-a on macOS): [`selectAll`](https://codemirror.net/6/docs/ref/#commands.selectAll)
 - Backspace: [`deleteCharBackward`](https://codemirror.net/6/docs/ref/#commands.deleteCharBackward)
 - Delete: [`deleteCharForward`](https://codemirror.net/6/docs/ref/#commands.deleteCharForward)
 - Ctrl-Backspace (Alt-Backspace on macOS): [`deleteGroupBackward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupBackward)
 - Ctrl-Delete (Alt-Delete on macOS): [`deleteGroupForward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupForward)
 - Cmd-Backspace (macOS): [`deleteToLineStart`](https://codemirror.net/6/docs/ref/#commands.deleteToLineStart).
 - Cmd-Delete (macOS): [`deleteToLineEnd`](https://codemirror.net/6/docs/ref/#commands.deleteToLineEnd).
*/
            const standardKeymap = /*@__PURE__*/ [
                {
                    key: "ArrowLeft",
                    run: cursorCharLeft,
                    shift: selectCharLeft,
                    preventDefault: true,
                },
                {
                    key: "Mod-ArrowLeft",
                    mac: "Alt-ArrowLeft",
                    run: cursorGroupLeft,
                    shift: selectGroupLeft,
                },
                {
                    mac: "Cmd-ArrowLeft",
                    run: cursorLineBoundaryBackward,
                    shift: selectLineBoundaryBackward,
                },
                {
                    key: "ArrowRight",
                    run: cursorCharRight,
                    shift: selectCharRight,
                    preventDefault: true,
                },
                {
                    key: "Mod-ArrowRight",
                    mac: "Alt-ArrowRight",
                    run: cursorGroupRight,
                    shift: selectGroupRight,
                },
                {
                    mac: "Cmd-ArrowRight",
                    run: cursorLineBoundaryForward,
                    shift: selectLineBoundaryForward,
                },
                {
                    key: "ArrowUp",
                    run: cursorLineUp,
                    shift: selectLineUp,
                    preventDefault: true,
                },
                {
                    mac: "Cmd-ArrowUp",
                    run: cursorDocStart,
                    shift: selectDocStart,
                },
                { mac: "Ctrl-ArrowUp", run: cursorPageUp, shift: selectPageUp },
                {
                    key: "ArrowDown",
                    run: cursorLineDown,
                    shift: selectLineDown,
                    preventDefault: true,
                },
                {
                    mac: "Cmd-ArrowDown",
                    run: cursorDocEnd,
                    shift: selectDocEnd,
                },
                {
                    mac: "Ctrl-ArrowDown",
                    run: cursorPageDown,
                    shift: selectPageDown,
                },
                { key: "PageUp", run: cursorPageUp, shift: selectPageUp },
                { key: "PageDown", run: cursorPageDown, shift: selectPageDown },
                {
                    key: "Home",
                    run: cursorLineBoundaryBackward,
                    shift: selectLineBoundaryBackward,
                    preventDefault: true,
                },
                { key: "Mod-Home", run: cursorDocStart, shift: selectDocStart },
                {
                    key: "End",
                    run: cursorLineBoundaryForward,
                    shift: selectLineBoundaryForward,
                    preventDefault: true,
                },
                { key: "Mod-End", run: cursorDocEnd, shift: selectDocEnd },
                { key: "Enter", run: insertNewlineAndIndent },
                { key: "Mod-a", run: selectAll },
                {
                    key: "Backspace",
                    run: deleteCharBackward,
                    shift: deleteCharBackward,
                },
                { key: "Delete", run: deleteCharForward },
                {
                    key: "Mod-Backspace",
                    mac: "Alt-Backspace",
                    run: deleteGroupBackward,
                },
                {
                    key: "Mod-Delete",
                    mac: "Alt-Delete",
                    run: deleteGroupForward,
                },
                { mac: "Mod-Backspace", run: deleteToLineStart },
                { mac: "Mod-Delete", run: deleteToLineEnd },
            ].concat(
                /*@__PURE__*/ emacsStyleKeymap.map((b) => ({
                    mac: b.key,
                    run: b.run,
                    shift: b.shift,
                }))
            );
            /**
The default keymap. Includes all bindings from
[`standardKeymap`](https://codemirror.net/6/docs/ref/#commands.standardKeymap) plus the following:

- Alt-ArrowLeft (Ctrl-ArrowLeft on macOS): [`cursorSyntaxLeft`](https://codemirror.net/6/docs/ref/#commands.cursorSyntaxLeft) ([`selectSyntaxLeft`](https://codemirror.net/6/docs/ref/#commands.selectSyntaxLeft) with Shift)
- Alt-ArrowRight (Ctrl-ArrowRight on macOS): [`cursorSyntaxRight`](https://codemirror.net/6/docs/ref/#commands.cursorSyntaxRight) ([`selectSyntaxRight`](https://codemirror.net/6/docs/ref/#commands.selectSyntaxRight) with Shift)
- Alt-ArrowUp: [`moveLineUp`](https://codemirror.net/6/docs/ref/#commands.moveLineUp)
- Alt-ArrowDown: [`moveLineDown`](https://codemirror.net/6/docs/ref/#commands.moveLineDown)
- Shift-Alt-ArrowUp: [`copyLineUp`](https://codemirror.net/6/docs/ref/#commands.copyLineUp)
- Shift-Alt-ArrowDown: [`copyLineDown`](https://codemirror.net/6/docs/ref/#commands.copyLineDown)
- Escape: [`simplifySelection`](https://codemirror.net/6/docs/ref/#commands.simplifySelection)
- Ctrl-Enter (Comd-Enter on macOS): [`insertBlankLine`](https://codemirror.net/6/docs/ref/#commands.insertBlankLine)
- Alt-l (Ctrl-l on macOS): [`selectLine`](https://codemirror.net/6/docs/ref/#commands.selectLine)
- Ctrl-i (Cmd-i on macOS): [`selectParentSyntax`](https://codemirror.net/6/docs/ref/#commands.selectParentSyntax)
- Ctrl-[ (Cmd-[ on macOS): [`indentLess`](https://codemirror.net/6/docs/ref/#commands.indentLess)
- Ctrl-] (Cmd-] on macOS): [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore)
- Ctrl-Alt-\\ (Cmd-Alt-\\ on macOS): [`indentSelection`](https://codemirror.net/6/docs/ref/#commands.indentSelection)
- Shift-Ctrl-k (Shift-Cmd-k on macOS): [`deleteLine`](https://codemirror.net/6/docs/ref/#commands.deleteLine)
- Shift-Ctrl-\\ (Shift-Cmd-\\ on macOS): [`cursorMatchingBracket`](https://codemirror.net/6/docs/ref/#commands.cursorMatchingBracket)
- Ctrl-/ (Cmd-/ on macOS): [`toggleComment`](https://codemirror.net/6/docs/ref/#commands.toggleComment).
- Shift-Alt-a: [`toggleBlockComment`](https://codemirror.net/6/docs/ref/#commands.toggleBlockComment).
*/
            const defaultKeymap = /*@__PURE__*/ [
                {
                    key: "Alt-ArrowLeft",
                    mac: "Ctrl-ArrowLeft",
                    run: cursorSyntaxLeft,
                    shift: selectSyntaxLeft,
                },
                {
                    key: "Alt-ArrowRight",
                    mac: "Ctrl-ArrowRight",
                    run: cursorSyntaxRight,
                    shift: selectSyntaxRight,
                },
                { key: "Alt-ArrowUp", run: moveLineUp },
                { key: "Shift-Alt-ArrowUp", run: copyLineUp },
                { key: "Alt-ArrowDown", run: moveLineDown },
                { key: "Shift-Alt-ArrowDown", run: copyLineDown },
                { key: "Escape", run: simplifySelection },
                { key: "Mod-Enter", run: insertBlankLine },
                { key: "Alt-l", mac: "Ctrl-l", run: selectLine },
                { key: "Mod-i", run: selectParentSyntax, preventDefault: true },
                { key: "Mod-[", run: indentLess },
                { key: "Mod-]", run: indentMore },
                { key: "Mod-Alt-\\", run: indentSelection },
                { key: "Shift-Mod-k", run: deleteLine },
                { key: "Shift-Mod-\\", run: cursorMatchingBracket },
                { key: "Mod-/", run: toggleComment },
                { key: "Alt-A", run: toggleBlockComment },
            ].concat(standardKeymap);
            /**
A binding that binds Tab to [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore) and
Shift-Tab to [`indentLess`](https://codemirror.net/6/docs/ref/#commands.indentLess).
Please see the [Tab example](../../examples/tab/) before using
this.
*/
            const indentWithTab = {
                key: "Tab",
                run: indentMore,
                shift: indentLess,
            }; // CONCATENATED MODULE: ./node_modules/crelt/index.es.js

            function crelt() {
                var elt = arguments[0];
                if (typeof elt == "string") elt = document.createElement(elt);
                var i = 1,
                    next = arguments[1];
                if (
                    next &&
                    typeof next == "object" &&
                    next.nodeType == null &&
                    !Array.isArray(next)
                ) {
                    for (var name in next)
                        if (Object.prototype.hasOwnProperty.call(next, name)) {
                            var value = next[name];
                            if (typeof value == "string")
                                elt.setAttribute(name, value);
                            else if (value != null) elt[name] = value;
                        }
                    i++;
                }
                for (; i < arguments.length; i++) add(elt, arguments[i]);
                return elt;
            }

            function add(elt, child) {
                if (typeof child == "string") {
                    elt.appendChild(document.createTextNode(child));
                } else if (child == null) {
                } else if (child.nodeType != null) {
                    elt.appendChild(child);
                } else if (Array.isArray(child)) {
                    for (var i = 0; i < child.length; i++) add(elt, child[i]);
                } else {
                    throw new RangeError("Unsupported child node: " + child);
                }
            } // CONCATENATED MODULE: ./node_modules/@codemirror/search/dist/index.js

            const basicNormalize =
                typeof String.prototype.normalize == "function"
                    ? (x) => x.normalize("NFKD")
                    : (x) => x;
            /**
A search cursor provides an iterator over text matches in a
document.
*/
            class SearchCursor {
                /**
    Create a text cursor. The query is the search string, `from` to
    `to` provides the region to search.
    
    When `normalize` is given, it will be called, on both the query
    string and the content it is matched against, before comparing.
    You can, for example, create a case-insensitive search by
    passing `s => s.toLowerCase()`.
    
    Text is always normalized with
    [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    (when supported).
    */
                constructor(
                    text,
                    query,
                    from = 0,
                    to = text.length,
                    normalize
                ) {
                    /**
        The current match (only holds a meaningful value after
        [`next`](https://codemirror.net/6/docs/ref/#search.SearchCursor.next) has been called and when
        `done` is false).
        */
                    this.value = { from: 0, to: 0 };
                    /**
        Whether the end of the iterated region has been reached.
        */
                    this.done = false;
                    this.matches = [];
                    this.buffer = "";
                    this.bufferPos = 0;
                    this.iter = text.iterRange(from, to);
                    this.bufferStart = from;
                    this.normalize = normalize
                        ? (x) => normalize(basicNormalize(x))
                        : basicNormalize;
                    this.query = this.normalize(query);
                }
                peek() {
                    if (this.bufferPos == this.buffer.length) {
                        this.bufferStart += this.buffer.length;
                        this.iter.next();
                        if (this.iter.done) return -1;
                        this.bufferPos = 0;
                        this.buffer = this.iter.value;
                    }
                    return (0, state_dist /* codePointAt */.gm)(
                        this.buffer,
                        this.bufferPos
                    );
                }
                /**
    Look for the next match. Updates the iterator's
    [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
    [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
    at least once before using the cursor.
    */
                next() {
                    while (this.matches.length) this.matches.pop();
                    return this.nextOverlapping();
                }
                /**
    The `next` method will ignore matches that partially overlap a
    previous match. This method behaves like `next`, but includes
    such matches.
    */
                nextOverlapping() {
                    for (;;) {
                        let next = this.peek();
                        if (next < 0) {
                            this.done = true;
                            return this;
                        }
                        let str = (0, state_dist /* fromCodePoint */.bg)(next),
                            start = this.bufferStart + this.bufferPos;
                        this.bufferPos += (0,
                        state_dist /* codePointSize */.nZ)(next);
                        let norm = this.normalize(str);
                        for (let i = 0, pos = start; ; i++) {
                            let code = norm.charCodeAt(i);
                            let match = this.match(code, pos);
                            if (match) {
                                this.value = match;
                                return this;
                            }
                            if (i == norm.length - 1) break;
                            if (
                                pos == start &&
                                i < str.length &&
                                str.charCodeAt(i) == code
                            )
                                pos++;
                        }
                    }
                }
                match(code, pos) {
                    let match = null;
                    for (let i = 0; i < this.matches.length; i += 2) {
                        let index = this.matches[i],
                            keep = false;
                        if (this.query.charCodeAt(index) == code) {
                            if (index == this.query.length - 1) {
                                match = {
                                    from: this.matches[i + 1],
                                    to: pos + 1,
                                };
                            } else {
                                this.matches[i]++;
                                keep = true;
                            }
                        }
                        if (!keep) {
                            this.matches.splice(i, 2);
                            i -= 2;
                        }
                    }
                    if (this.query.charCodeAt(0) == code) {
                        if (this.query.length == 1)
                            match = { from: pos, to: pos + 1 };
                        else this.matches.push(1, pos);
                    }
                    return match;
                }
            }
            if (typeof Symbol != "undefined")
                SearchCursor.prototype[Symbol.iterator] = function () {
                    return this;
                };

            const empty = {
                from: -1,
                to: -1,
                match: /*@__PURE__*/ /.*/.exec(""),
            };
            const baseFlags = "gm" + (/x/.unicode == null ? "" : "u");
            /**
This class is similar to [`SearchCursor`](https://codemirror.net/6/docs/ref/#search.SearchCursor)
but searches for a regular expression pattern instead of a plain
string.
*/
            class RegExpCursor {
                /**
    Create a cursor that will search the given range in the given
    document. `query` should be the raw pattern (as you'd pass it to
    `new RegExp`).
    */
                constructor(text, query, options, from = 0, to = text.length) {
                    this.to = to;
                    this.curLine = "";
                    /**
        Set to `true` when the cursor has reached the end of the search
        range.
        */
                    this.done = false;
                    /**
        Will contain an object with the extent of the match and the
        match object when [`next`](https://codemirror.net/6/docs/ref/#search.RegExpCursor.next)
        sucessfully finds a match.
        */
                    this.value = empty;
                    if (/\\[sWDnr]|\n|\r|\[\^/.test(query))
                        return new MultilineRegExpCursor(
                            text,
                            query,
                            options,
                            from,
                            to
                        );
                    this.re = new RegExp(
                        query,
                        baseFlags +
                            ((
                                options === null || options === void 0
                                    ? void 0
                                    : options.ignoreCase
                            )
                                ? "i"
                                : "")
                    );
                    this.iter = text.iter();
                    let startLine = text.lineAt(from);
                    this.curLineStart = startLine.from;
                    this.matchPos = from;
                    this.getLine(this.curLineStart);
                }
                getLine(skip) {
                    this.iter.next(skip);
                    if (this.iter.lineBreak) {
                        this.curLine = "";
                    } else {
                        this.curLine = this.iter.value;
                        if (this.curLineStart + this.curLine.length > this.to)
                            this.curLine = this.curLine.slice(
                                0,
                                this.to - this.curLineStart
                            );
                        this.iter.next();
                    }
                }
                nextLine() {
                    this.curLineStart =
                        this.curLineStart + this.curLine.length + 1;
                    if (this.curLineStart > this.to) this.curLine = "";
                    else this.getLine(0);
                }
                /**
    Move to the next match, if there is one.
    */
                next() {
                    for (let off = this.matchPos - this.curLineStart; ; ) {
                        this.re.lastIndex = off;
                        let match =
                            this.matchPos <= this.to &&
                            this.re.exec(this.curLine);
                        if (match) {
                            let from = this.curLineStart + match.index,
                                to = from + match[0].length;
                            this.matchPos = to + (from == to ? 1 : 0);
                            if (from == this.curLine.length) this.nextLine();
                            if (from < to || from > this.value.to) {
                                this.value = { from, to, match };
                                return this;
                            }
                            off = this.matchPos - this.curLineStart;
                        } else if (
                            this.curLineStart + this.curLine.length <
                            this.to
                        ) {
                            this.nextLine();
                            off = 0;
                        } else {
                            this.done = true;
                            return this;
                        }
                    }
                }
            }
            const flattened = /*@__PURE__*/ new WeakMap();
            // Reusable (partially) flattened document strings
            class FlattenedDoc {
                constructor(from, text) {
                    this.from = from;
                    this.text = text;
                }
                get to() {
                    return this.from + this.text.length;
                }
                static get(doc, from, to) {
                    let cached = flattened.get(doc);
                    if (!cached || cached.from >= to || cached.to <= from) {
                        let flat = new FlattenedDoc(
                            from,
                            doc.sliceString(from, to)
                        );
                        flattened.set(doc, flat);
                        return flat;
                    }
                    if (cached.from == from && cached.to == to) return cached;
                    let { text, from: cachedFrom } = cached;
                    if (cachedFrom > from) {
                        text = doc.sliceString(from, cachedFrom) + text;
                        cachedFrom = from;
                    }
                    if (cached.to < to) text += doc.sliceString(cached.to, to);
                    flattened.set(doc, new FlattenedDoc(cachedFrom, text));
                    return new FlattenedDoc(
                        from,
                        text.slice(from - cachedFrom, to - cachedFrom)
                    );
                }
            }
            class MultilineRegExpCursor {
                constructor(text, query, options, from, to) {
                    this.text = text;
                    this.to = to;
                    this.done = false;
                    this.value = empty;
                    this.matchPos = from;
                    this.re = new RegExp(
                        query,
                        baseFlags +
                            ((
                                options === null || options === void 0
                                    ? void 0
                                    : options.ignoreCase
                            )
                                ? "i"
                                : "")
                    );
                    this.flat = FlattenedDoc.get(
                        text,
                        from,
                        this.chunkEnd(from + 5000 /* Base */)
                    );
                }
                chunkEnd(pos) {
                    return pos >= this.to ? this.to : this.text.lineAt(pos).to;
                }
                next() {
                    for (;;) {
                        let off = (this.re.lastIndex =
                            this.matchPos - this.flat.from);
                        let match = this.re.exec(this.flat.text);
                        // Skip empty matches directly after the last match
                        if (match && !match[0] && match.index == off) {
                            this.re.lastIndex = off + 1;
                            match = this.re.exec(this.flat.text);
                        }
                        // If a match goes almost to the end of a noncomplete chunk, try
                        // again, since it'll likely be able to match more
                        if (
                            match &&
                            this.flat.to < this.to &&
                            match.index + match[0].length >
                                this.flat.text.length - 10
                        )
                            match = null;
                        if (match) {
                            let from = this.flat.from + match.index,
                                to = from + match[0].length;
                            this.value = { from, to, match };
                            this.matchPos = to + (from == to ? 1 : 0);
                            return this;
                        } else {
                            if (this.flat.to == this.to) {
                                this.done = true;
                                return this;
                            }
                            // Grow the flattened doc
                            this.flat = FlattenedDoc.get(
                                this.text,
                                this.flat.from,
                                this.chunkEnd(
                                    this.flat.from + this.flat.text.length * 2
                                )
                            );
                        }
                    }
                }
            }
            if (typeof Symbol != "undefined") {
                RegExpCursor.prototype[Symbol.iterator] =
                    MultilineRegExpCursor.prototype[Symbol.iterator] =
                        function () {
                            return this;
                        };
            }
            function validRegExp(source) {
                try {
                    new RegExp(source, baseFlags);
                    return true;
                } catch (_a) {
                    return false;
                }
            }

            function createLineDialog(view) {
                let input = crelt("input", {
                    class: "cm-textfield",
                    name: "line",
                });
                let dom = crelt(
                    "form",
                    {
                        class: "cm-gotoLine",
                        onkeydown: (event) => {
                            if (event.keyCode == 27) {
                                // Escape
                                event.preventDefault();
                                view.dispatch({
                                    effects: dialogEffect.of(false),
                                });
                                view.focus();
                            } else if (event.keyCode == 13) {
                                // Enter
                                event.preventDefault();
                                go();
                            }
                        },
                        onsubmit: (event) => {
                            event.preventDefault();
                            go();
                        },
                    },
                    crelt(
                        "label",
                        view.state.phrase("Go to line"),
                        ": ",
                        input
                    ),
                    " ",
                    crelt(
                        "button",
                        { class: "cm-button", type: "submit" },
                        view.state.phrase("go")
                    )
                );
                function go() {
                    let match = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(input.value);
                    if (!match) return;
                    let { state } = view,
                        startLine = state.doc.lineAt(state.selection.main.head);
                    let [, sign, ln, cl, percent] = match;
                    let col = cl ? +cl.slice(1) : 0;
                    let line = ln ? +ln : startLine.number;
                    if (ln && percent) {
                        let pc = line / 100;
                        if (sign)
                            pc =
                                pc * (sign == "-" ? -1 : 1) +
                                startLine.number / state.doc.lines;
                        line = Math.round(state.doc.lines * pc);
                    } else if (ln && sign) {
                        line = line * (sign == "-" ? -1 : 1) + startLine.number;
                    }
                    let docLine = state.doc.line(
                        Math.max(1, Math.min(state.doc.lines, line))
                    );
                    view.dispatch({
                        effects: dialogEffect.of(false),
                        selection: state_dist /* EditorSelection.cursor */.jT
                            .cursor(
                                docLine.from +
                                    Math.max(0, Math.min(col, docLine.length))
                            ),
                        scrollIntoView: true,
                    });
                    view.focus();
                }
                return { dom };
            }
            const dialogEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const dialogField =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return true;
                    },
                    update(value, tr) {
                        for (let e of tr.effects)
                            if (e.is(dialogEffect)) value = e.value;
                        return value;
                    },
                    provide: (f) =>
                        dist /* showPanel.from */.mH
                            .from(f, (val) => (val ? createLineDialog : null)),
                });
            /**
Command that shows a dialog asking the user for a line number, and
when a valid position is provided, moves the cursor to that line.

Supports line numbers, relative line offsets prefixed with `+` or
`-`, document percentages suffixed with `%`, and an optional
column position by adding `:` and a second number after the line
number.

The dialog can be styled with the `panel.gotoLine` theme
selector.
*/
            const gotoLine = (view) => {
                let panel = (0, dist /* getPanel */.Sd)(view, createLineDialog);
                if (!panel) {
                    let effects = [dialogEffect.of(true)];
                    if (view.state.field(dialogField, false) == null)
                        effects.push(
                            state_dist /* StateEffect.appendConfig.of */.Py.appendConfig
                                .of([dialogField, dist_baseTheme$1])
                        );
                    view.dispatch({ effects });
                    panel = (0, dist /* getPanel */.Sd)(view, createLineDialog);
                }
                if (panel) panel.dom.querySelector("input").focus();
                return true;
            };
            const dist_baseTheme$1 =
                /*@__PURE__*/ dist /* EditorView.baseTheme */.tk
                    .baseTheme({
                        ".cm-panel.cm-gotoLine": {
                            padding: "2px 6px 4px",
                            "& label": { fontSize: "80%" },
                        },
                    });

            const defaultHighlightOptions = {
                highlightWordAroundCursor: false,
                minSelectionLength: 1,
                maxMatches: 100,
                wholeWords: false,
            };
            const highlightConfig =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define({
                        combine(options) {
                            return (0, state_dist /* combineConfig */.BO)(
                                options,
                                defaultHighlightOptions,
                                {
                                    highlightWordAroundCursor: (a, b) => a || b,
                                    minSelectionLength: Math.min,
                                    maxMatches: Math.min,
                                }
                            );
                        },
                    });
            /**
This extension highlights text that matches the selection. It uses
the `"cm-selectionMatch"` class for the highlighting. When
`highlightWordAroundCursor` is enabled, the word at the cursor
itself will be highlighted with `"cm-selectionMatch-main"`.
*/
            function highlightSelectionMatches(options) {
                let ext = [defaultTheme, matchHighlighter];
                if (options) ext.push(highlightConfig.of(options));
                return ext;
            }
            const matchDeco = /*@__PURE__*/ dist /* Decoration.mark */.p
                .mark({ class: "cm-selectionMatch" });
            const mainMatchDeco = /*@__PURE__*/ dist /* Decoration.mark */.p
                .mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
            // Whether the characters directly outside the given positions are non-word characters
            function insideWordBoundaries(check, state, from, to) {
                return (
                    (from == 0 ||
                        check(state.sliceDoc(from - 1, from)) !=
                            state_dist /* CharCategory.Word */.D0.Word) &&
                    (to == state.doc.length ||
                        check(state.sliceDoc(to, to + 1)) !=
                            state_dist /* CharCategory.Word */.D0.Word)
                );
            }
            // Whether the characters directly at the given positions are word characters
            function insideWord(check, state, from, to) {
                return (
                    check(state.sliceDoc(from, from + 1)) ==
                        state_dist /* CharCategory.Word */.D0.Word &&
                    check(state.sliceDoc(to - 1, to)) ==
                        state_dist /* CharCategory.Word */.D0.Word
                );
            }
            const matchHighlighter =
                /*@__PURE__*/ dist /* ViewPlugin.fromClass */.lg
                    .fromClass(
                        class {
                            constructor(view) {
                                this.decorations = this.getDeco(view);
                            }
                            update(update) {
                                if (
                                    update.selectionSet ||
                                    update.docChanged ||
                                    update.viewportChanged
                                )
                                    this.decorations = this.getDeco(
                                        update.view
                                    );
                            }
                            getDeco(view) {
                                let conf = view.state.facet(highlightConfig);
                                let { state } = view,
                                    sel = state.selection;
                                if (sel.ranges.length > 1)
                                    return dist /* Decoration.none */.p.none;
                                let range = sel.main,
                                    query,
                                    check = null;
                                if (range.empty) {
                                    if (!conf.highlightWordAroundCursor)
                                        return dist /* Decoration.none */.p
                                            .none;
                                    let word = state.wordAt(range.head);
                                    if (!word)
                                        return dist /* Decoration.none */.p
                                            .none;
                                    check = state.charCategorizer(range.head);
                                    query = state.sliceDoc(word.from, word.to);
                                } else {
                                    let len = range.to - range.from;
                                    if (
                                        len < conf.minSelectionLength ||
                                        len > 200
                                    )
                                        return dist /* Decoration.none */.p
                                            .none;
                                    if (conf.wholeWords) {
                                        query = state.sliceDoc(
                                            range.from,
                                            range.to
                                        ); // TODO: allow and include leading/trailing space?
                                        check = state.charCategorizer(
                                            range.head
                                        );
                                        if (
                                            !(
                                                insideWordBoundaries(
                                                    check,
                                                    state,
                                                    range.from,
                                                    range.to
                                                ) &&
                                                insideWord(
                                                    check,
                                                    state,
                                                    range.from,
                                                    range.to
                                                )
                                            )
                                        )
                                            return dist /* Decoration.none */.p
                                                .none;
                                    } else {
                                        query = state
                                            .sliceDoc(range.from, range.to)
                                            .trim();
                                        if (!query)
                                            return dist /* Decoration.none */.p
                                                .none;
                                    }
                                }
                                let deco = [];
                                for (let part of view.visibleRanges) {
                                    let cursor = new SearchCursor(
                                        state.doc,
                                        query,
                                        part.from,
                                        part.to
                                    );
                                    while (!cursor.next().done) {
                                        let { from, to } = cursor.value;
                                        if (
                                            !check ||
                                            insideWordBoundaries(
                                                check,
                                                state,
                                                from,
                                                to
                                            )
                                        ) {
                                            if (
                                                range.empty &&
                                                from <= range.from &&
                                                to >= range.to
                                            )
                                                deco.push(
                                                    mainMatchDeco.range(
                                                        from,
                                                        to
                                                    )
                                                );
                                            else if (
                                                from >= range.to ||
                                                to <= range.from
                                            )
                                                deco.push(
                                                    matchDeco.range(from, to)
                                                );
                                            if (deco.length > conf.maxMatches)
                                                return dist /* Decoration.none */
                                                    .p.none;
                                        }
                                    }
                                }
                                return dist /* Decoration.set */.p
                                    .set(deco);
                            }
                        },
                        {
                            decorations: (v) => v.decorations,
                        }
                    );
            const defaultTheme =
                /*@__PURE__*/ dist /* EditorView.baseTheme */.tk
                    .baseTheme({
                        ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
                        ".cm-searchMatch .cm-selectionMatch": {
                            backgroundColor: "transparent",
                        },
                    });
            // Select the words around the cursors.
            const selectWord = ({ state, dispatch }) => {
                let { selection } = state;
                let newSel = state_dist /* EditorSelection.create */.jT
                    .create(
                        selection.ranges.map(
                            (range) =>
                                state.wordAt(range.head) ||
                                state_dist /* EditorSelection.cursor */.jT
                                    .cursor(range.head)
                        ),
                        selection.mainIndex
                    );
                if (newSel.eq(selection)) return false;
                dispatch(state.update({ selection: newSel }));
                return true;
            };
            // Find next occurrence of query relative to last cursor. Wrap around
            // the document if there are no more matches.
            function findNextOccurrence(state, query) {
                let { main, ranges } = state.selection;
                let word = state.wordAt(main.head),
                    fullWord =
                        word && word.from == main.from && word.to == main.to;
                for (
                    let cycled = false,
                        cursor = new SearchCursor(
                            state.doc,
                            query,
                            ranges[ranges.length - 1].to
                        );
                    ;

                ) {
                    cursor.next();
                    if (cursor.done) {
                        if (cycled) return null;
                        cursor = new SearchCursor(
                            state.doc,
                            query,
                            0,
                            Math.max(0, ranges[ranges.length - 1].from - 1)
                        );
                        cycled = true;
                    } else {
                        if (
                            cycled &&
                            ranges.some((r) => r.from == cursor.value.from)
                        )
                            continue;
                        if (fullWord) {
                            let word = state.wordAt(cursor.value.from);
                            if (
                                !word ||
                                word.from != cursor.value.from ||
                                word.to != cursor.value.to
                            )
                                continue;
                        }
                        return cursor.value;
                    }
                }
            }
            /**
Select next occurrence of the current selection. Expand selection
to the surrounding word when the selection is empty.
*/
            const selectNextOccurrence = ({ state, dispatch }) => {
                let { ranges } = state.selection;
                if (ranges.some((sel) => sel.from === sel.to))
                    return selectWord({ state, dispatch });
                let searchedText = state.sliceDoc(ranges[0].from, ranges[0].to);
                if (
                    state.selection.ranges.some(
                        (r) => state.sliceDoc(r.from, r.to) != searchedText
                    )
                )
                    return false;
                let range = findNextOccurrence(state, searchedText);
                if (!range) return false;
                dispatch(
                    state.update({
                        selection: state.selection.addRange(
                            state_dist /* EditorSelection.range */.jT
                                .range(range.from, range.to),
                            false
                        ),
                        effects: dist /* EditorView.scrollIntoView */.tk
                            .scrollIntoView(range.to),
                    })
                );
                return true;
            };

            const searchConfigFacet =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define({
                        combine(configs) {
                            var _a;
                            return {
                                top:
                                    configs.reduce(
                                        (val, conf) =>
                                            val !== null && val !== void 0
                                                ? val
                                                : conf.top,
                                        undefined
                                    ) || false,
                                caseSensitive:
                                    configs.reduce(
                                        (val, conf) =>
                                            val !== null && val !== void 0
                                                ? val
                                                : conf.caseSensitive,
                                        undefined
                                    ) || false,
                                createPanel:
                                    ((_a = configs.find(
                                        (c) => c.createPanel
                                    )) === null || _a === void 0
                                        ? void 0
                                        : _a.createPanel) ||
                                    ((view) => new SearchPanel(view)),
                            };
                        },
                    });
            /**
Add search state to the editor configuration, and optionally
configure the search extension.
([`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel) will automatically
enable this if it isn't already on).
*/
            function search(config) {
                return config
                    ? [searchConfigFacet.of(config), searchExtensions]
                    : searchExtensions;
            }
            /**
A search query. Part of the editor's search state.
*/
            class SearchQuery {
                /**
    Create a query object.
    */
                constructor(config) {
                    this.search = config.search;
                    this.caseSensitive = !!config.caseSensitive;
                    this.regexp = !!config.regexp;
                    this.replace = config.replace || "";
                    this.valid =
                        !!this.search &&
                        (!this.regexp || validRegExp(this.search));
                    this.unquoted = config.literal
                        ? this.search
                        : this.search.replace(/\\([nrt\\])/g, (_, ch) =>
                              ch == "n"
                                  ? "\n"
                                  : ch == "r"
                                  ? "\r"
                                  : ch == "t"
                                  ? "\t"
                                  : "\\"
                          );
                }
                /**
    Compare this query to another query.
    */
                eq(other) {
                    return (
                        this.search == other.search &&
                        this.replace == other.replace &&
                        this.caseSensitive == other.caseSensitive &&
                        this.regexp == other.regexp
                    );
                }
                /**
    @internal
    */
                create() {
                    return this.regexp
                        ? new RegExpQuery(this)
                        : new StringQuery(this);
                }
                /**
    Get a search cursor for this query, searching through the given
    range in the given document.
    */
                getCursor(doc, from = 0, to = doc.length) {
                    return this.regexp
                        ? regexpCursor(this, doc, from, to)
                        : stringCursor(this, doc, from, to);
                }
            }
            class QueryType {
                constructor(spec) {
                    this.spec = spec;
                }
            }
            function stringCursor(spec, doc, from, to) {
                return new SearchCursor(
                    doc,
                    spec.unquoted,
                    from,
                    to,
                    spec.caseSensitive ? undefined : (x) => x.toLowerCase()
                );
            }
            class StringQuery extends QueryType {
                constructor(spec) {
                    super(spec);
                }
                nextMatch(doc, curFrom, curTo) {
                    let cursor = stringCursor(
                        this.spec,
                        doc,
                        curTo,
                        doc.length
                    ).nextOverlapping();
                    if (cursor.done)
                        cursor = stringCursor(
                            this.spec,
                            doc,
                            0,
                            curFrom
                        ).nextOverlapping();
                    return cursor.done ? null : cursor.value;
                }
                // Searching in reverse is, rather than implementing inverted search
                // cursor, done by scanning chunk after chunk forward.
                prevMatchInRange(doc, from, to) {
                    for (let pos = to; ; ) {
                        let start = Math.max(
                            from,
                            pos -
                                10000 /* ChunkSize */ -
                                this.spec.unquoted.length
                        );
                        let cursor = stringCursor(this.spec, doc, start, pos),
                            range = null;
                        while (!cursor.nextOverlapping().done)
                            range = cursor.value;
                        if (range) return range;
                        if (start == from) return null;
                        pos -= 10000 /* ChunkSize */;
                    }
                }
                prevMatch(doc, curFrom, curTo) {
                    return (
                        this.prevMatchInRange(doc, 0, curFrom) ||
                        this.prevMatchInRange(doc, curTo, doc.length)
                    );
                }
                getReplacement(_result) {
                    return this.spec.replace;
                }
                matchAll(doc, limit) {
                    let cursor = stringCursor(this.spec, doc, 0, doc.length),
                        ranges = [];
                    while (!cursor.next().done) {
                        if (ranges.length >= limit) return null;
                        ranges.push(cursor.value);
                    }
                    return ranges;
                }
                highlight(doc, from, to, add) {
                    let cursor = stringCursor(
                        this.spec,
                        doc,
                        Math.max(0, from - this.spec.unquoted.length),
                        Math.min(to + this.spec.unquoted.length, doc.length)
                    );
                    while (!cursor.next().done)
                        add(cursor.value.from, cursor.value.to);
                }
            }
            function regexpCursor(spec, doc, from, to) {
                return new RegExpCursor(
                    doc,
                    spec.search,
                    spec.caseSensitive ? undefined : { ignoreCase: true },
                    from,
                    to
                );
            }
            class RegExpQuery extends QueryType {
                nextMatch(doc, curFrom, curTo) {
                    let cursor = regexpCursor(
                        this.spec,
                        doc,
                        curTo,
                        doc.length
                    ).next();
                    if (cursor.done)
                        cursor = regexpCursor(
                            this.spec,
                            doc,
                            0,
                            curFrom
                        ).next();
                    return cursor.done ? null : cursor.value;
                }
                prevMatchInRange(doc, from, to) {
                    for (let size = 1; ; size++) {
                        let start = Math.max(
                            from,
                            to - size * 10000 /* ChunkSize */
                        );
                        let cursor = regexpCursor(this.spec, doc, start, to),
                            range = null;
                        while (!cursor.next().done) range = cursor.value;
                        if (range && (start == from || range.from > start + 10))
                            return range;
                        if (start == from) return null;
                    }
                }
                prevMatch(doc, curFrom, curTo) {
                    return (
                        this.prevMatchInRange(doc, 0, curFrom) ||
                        this.prevMatchInRange(doc, curTo, doc.length)
                    );
                }
                getReplacement(result) {
                    return this.spec.replace.replace(/\$([$&\d+])/g, (m, i) =>
                        i == "$"
                            ? "$"
                            : i == "&"
                            ? result.match[0]
                            : i != "0" && +i < result.match.length
                            ? result.match[i]
                            : m
                    );
                }
                matchAll(doc, limit) {
                    let cursor = regexpCursor(this.spec, doc, 0, doc.length),
                        ranges = [];
                    while (!cursor.next().done) {
                        if (ranges.length >= limit) return null;
                        ranges.push(cursor.value);
                    }
                    return ranges;
                }
                highlight(doc, from, to, add) {
                    let cursor = regexpCursor(
                        this.spec,
                        doc,
                        Math.max(0, from - 250 /* HighlightMargin */),
                        Math.min(to + 250 /* HighlightMargin */, doc.length)
                    );
                    while (!cursor.next().done)
                        add(cursor.value.from, cursor.value.to);
                }
            }
            /**
A state effect that updates the current search query. Note that
this only has an effect if the search state has been initialized
(by including [`search`](https://codemirror.net/6/docs/ref/#search.search) in your configuration or
by running [`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel) at least
once).
*/
            const setSearchQuery =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const togglePanel =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const searchState =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create(state) {
                        return new SearchState(
                            defaultQuery(state).create(),
                            null
                        );
                    },
                    update(value, tr) {
                        for (let effect of tr.effects) {
                            if (effect.is(setSearchQuery))
                                value = new SearchState(
                                    effect.value.create(),
                                    value.panel
                                );
                            else if (effect.is(togglePanel))
                                value = new SearchState(
                                    value.query,
                                    effect.value ? createSearchPanel : null
                                );
                        }
                        return value;
                    },
                    provide: (f) =>
                        dist /* showPanel.from */.mH
                            .from(f, (val) => val.panel),
                });
            /**
Get the current search query from an editor state.
*/
            function getSearchQuery(state) {
                let curState = state.field(searchState, false);
                return curState ? curState.query.spec : defaultQuery(state);
            }
            class SearchState {
                constructor(query, panel) {
                    this.query = query;
                    this.panel = panel;
                }
            }
            const matchMark = /*@__PURE__*/ dist /* Decoration.mark */.p
                    .mark({ class: "cm-searchMatch" }),
                selectedMatchMark = /*@__PURE__*/ dist /* Decoration.mark */.p
                    .mark({ class: "cm-searchMatch cm-searchMatch-selected" });
            const searchHighlighter =
                /*@__PURE__*/ dist /* ViewPlugin.fromClass */.lg
                    .fromClass(
                        class {
                            constructor(view) {
                                this.view = view;
                                this.decorations = this.highlight(
                                    view.state.field(searchState)
                                );
                            }
                            update(update) {
                                let state = update.state.field(searchState);
                                if (
                                    state !=
                                        update.startState.field(searchState) ||
                                    update.docChanged ||
                                    update.selectionSet ||
                                    update.viewportChanged
                                )
                                    this.decorations = this.highlight(state);
                            }
                            highlight({ query, panel }) {
                                if (!panel || !query.spec.valid)
                                    return dist /* Decoration.none */.p.none;
                                let { view } = this;
                                let builder =
                                    new state_dist /* RangeSetBuilder */.f_();
                                for (
                                    let i = 0,
                                        ranges = view.visibleRanges,
                                        l = ranges.length;
                                    i < l;
                                    i++
                                ) {
                                    let { from, to } = ranges[i];
                                    while (
                                        i < l - 1 &&
                                        to >
                                            ranges[i + 1].from -
                                                2 * 250 /* HighlightMargin */
                                    )
                                        to = ranges[++i].to;
                                    query.highlight(
                                        view.state.doc,
                                        from,
                                        to,
                                        (from, to) => {
                                            let selected =
                                                view.state.selection.ranges.some(
                                                    (r) =>
                                                        r.from == from &&
                                                        r.to == to
                                                );
                                            builder.add(
                                                from,
                                                to,
                                                selected
                                                    ? selectedMatchMark
                                                    : matchMark
                                            );
                                        }
                                    );
                                }
                                return builder.finish();
                            }
                        },
                        {
                            decorations: (v) => v.decorations,
                        }
                    );
            function searchCommand(f) {
                return (view) => {
                    let state = view.state.field(searchState, false);
                    return state && state.query.spec.valid
                        ? f(view, state)
                        : openSearchPanel(view);
                };
            }
            /**
Open the search panel if it isn't already open, and move the
selection to the first match after the current main selection.
Will wrap around to the start of the document when it reaches the
end.
*/
            const findNext = /*@__PURE__*/ searchCommand((view, { query }) => {
                let { from, to } = view.state.selection.main;
                let next = query.nextMatch(view.state.doc, from, to);
                if (!next || (next.from == from && next.to == to)) return false;
                view.dispatch({
                    selection: { anchor: next.from, head: next.to },
                    scrollIntoView: true,
                    effects: announceMatch(view, next),
                    userEvent: "select.search",
                });
                return true;
            });
            /**
Move the selection to the previous instance of the search query,
before the current main selection. Will wrap past the start
of the document to start searching at the end again.
*/
            const findPrevious = /*@__PURE__*/ searchCommand(
                (view, { query }) => {
                    let { state } = view,
                        { from, to } = state.selection.main;
                    let range = query.prevMatch(state.doc, from, to);
                    if (!range) return false;
                    view.dispatch({
                        selection: { anchor: range.from, head: range.to },
                        scrollIntoView: true,
                        effects: announceMatch(view, range),
                        userEvent: "select.search",
                    });
                    return true;
                }
            );
            /**
Select all instances of the search query.
*/
            const selectMatches = /*@__PURE__*/ searchCommand(
                (view, { query }) => {
                    let ranges = query.matchAll(view.state.doc, 1000);
                    if (!ranges || !ranges.length) return false;
                    view.dispatch({
                        selection: state_dist /* EditorSelection.create */.jT
                            .create(
                                ranges.map((r) =>
                                    state_dist /* EditorSelection.range */.jT
                                        .range(r.from, r.to)
                                )
                            ),
                        userEvent: "select.search.matches",
                    });
                    return true;
                }
            );
            /**
Select all instances of the currently selected text.
*/
            const selectSelectionMatches = ({ state, dispatch }) => {
                let sel = state.selection;
                if (sel.ranges.length > 1 || sel.main.empty) return false;
                let { from, to } = sel.main;
                let ranges = [],
                    main = 0;
                for (
                    let cur = new SearchCursor(
                        state.doc,
                        state.sliceDoc(from, to)
                    );
                    !cur.next().done;

                ) {
                    if (ranges.length > 1000) return false;
                    if (cur.value.from == from) main = ranges.length;
                    ranges.push(
                        state_dist /* EditorSelection.range */.jT
                            .range(cur.value.from, cur.value.to)
                    );
                }
                dispatch(
                    state.update({
                        selection: state_dist /* EditorSelection.create */.jT
                            .create(ranges, main),
                        userEvent: "select.search.matches",
                    })
                );
                return true;
            };
            /**
Replace the current match of the search query.
*/
            const replaceNext = /*@__PURE__*/ searchCommand(
                (view, { query }) => {
                    let { state } = view,
                        { from, to } = state.selection.main;
                    if (state.readOnly) return false;
                    let next = query.nextMatch(state.doc, from, from);
                    if (!next) return false;
                    let changes = [],
                        selection,
                        replacement;
                    if (next.from == from && next.to == to) {
                        replacement = state.toText(query.getReplacement(next));
                        changes.push({
                            from: next.from,
                            to: next.to,
                            insert: replacement,
                        });
                        next = query.nextMatch(state.doc, next.from, next.to);
                    }
                    if (next) {
                        let off =
                            changes.length == 0 || changes[0].from >= next.to
                                ? 0
                                : next.to - next.from - replacement.length;
                        selection = {
                            anchor: next.from - off,
                            head: next.to - off,
                        };
                    }
                    view.dispatch({
                        changes,
                        selection,
                        scrollIntoView: !!selection,
                        effects: next ? announceMatch(view, next) : undefined,
                        userEvent: "input.replace",
                    });
                    return true;
                }
            );
            /**
Replace all instances of the search query with the given
replacement.
*/
            const replaceAll = /*@__PURE__*/ searchCommand(
                (view, { query }) => {
                    if (view.state.readOnly) return false;
                    let changes = query
                        .matchAll(view.state.doc, 1e9)
                        .map((match) => {
                            let { from, to } = match;
                            return {
                                from,
                                to,
                                insert: query.getReplacement(match),
                            };
                        });
                    if (!changes.length) return false;
                    view.dispatch({
                        changes,
                        userEvent: "input.replace.all",
                    });
                    return true;
                }
            );
            function createSearchPanel(view) {
                return view.state.facet(searchConfigFacet).createPanel(view);
            }
            function defaultQuery(state, fallback) {
                var _a;
                let sel = state.selection.main;
                let selText =
                    sel.empty || sel.to > sel.from + 100
                        ? ""
                        : state.sliceDoc(sel.from, sel.to);
                let caseSensitive =
                    (_a =
                        fallback === null || fallback === void 0
                            ? void 0
                            : fallback.caseSensitive) !== null && _a !== void 0
                        ? _a
                        : state.facet(searchConfigFacet).caseSensitive;
                return fallback && !selText
                    ? fallback
                    : new SearchQuery({
                          search: selText.replace(/\n/g, "\\n"),
                          caseSensitive,
                      });
            }
            /**
Make sure the search panel is open and focused.
*/
            const openSearchPanel = (view) => {
                let state = view.state.field(searchState, false);
                if (state && state.panel) {
                    let panel = (0, dist /* getPanel */.Sd)(
                        view,
                        createSearchPanel
                    );
                    if (!panel) return false;
                    let searchInput = panel.dom.querySelector("[name=search]");
                    if (searchInput != view.root.activeElement) {
                        let query = defaultQuery(view.state, state.query.spec);
                        if (query.valid)
                            view.dispatch({
                                effects: setSearchQuery.of(query),
                            });
                        searchInput.focus();
                        searchInput.select();
                    }
                } else {
                    view.dispatch({
                        effects: [
                            togglePanel.of(true),
                            state
                                ? setSearchQuery.of(
                                      defaultQuery(view.state, state.query.spec)
                                  )
                                : state_dist /* StateEffect.appendConfig.of */.Py.appendConfig
                                      .of(searchExtensions),
                        ],
                    });
                }
                return true;
            };
            /**
Close the search panel.
*/
            const closeSearchPanel = (view) => {
                let state = view.state.field(searchState, false);
                if (!state || !state.panel) return false;
                let panel = (0, dist /* getPanel */.Sd)(
                    view,
                    createSearchPanel
                );
                if (panel && panel.dom.contains(view.root.activeElement))
                    view.focus();
                view.dispatch({ effects: togglePanel.of(false) });
                return true;
            };
            /**
Default search-related key bindings.

 - Mod-f: [`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel)
 - F3, Mod-g: [`findNext`](https://codemirror.net/6/docs/ref/#search.findNext)
 - Shift-F3, Shift-Mod-g: [`findPrevious`](https://codemirror.net/6/docs/ref/#search.findPrevious)
 - Alt-g: [`gotoLine`](https://codemirror.net/6/docs/ref/#search.gotoLine)
 - Mod-d: [`selectNextOccurrence`](https://codemirror.net/6/docs/ref/#search.selectNextOccurrence)
*/
            const searchKeymap = [
                {
                    key: "Mod-f",
                    run: openSearchPanel,
                    scope: "editor search-panel",
                },
                {
                    key: "F3",
                    run: findNext,
                    shift: findPrevious,
                    scope: "editor search-panel",
                    preventDefault: true,
                },
                {
                    key: "Mod-g",
                    run: findNext,
                    shift: findPrevious,
                    scope: "editor search-panel",
                    preventDefault: true,
                },
                {
                    key: "Escape",
                    run: closeSearchPanel,
                    scope: "editor search-panel",
                },
                { key: "Mod-Shift-l", run: selectSelectionMatches },
                { key: "Alt-g", run: gotoLine },
                {
                    key: "Mod-d",
                    run: selectNextOccurrence,
                    preventDefault: true,
                },
            ];
            class SearchPanel {
                constructor(view) {
                    this.view = view;
                    let query = (this.query =
                        view.state.field(searchState).query.spec);
                    this.commit = this.commit.bind(this);
                    this.searchField = crelt("input", {
                        value: query.search,
                        placeholder: phrase(view, "Find"),
                        "aria-label": phrase(view, "Find"),
                        class: "cm-textfield",
                        name: "search",
                        onchange: this.commit,
                        onkeyup: this.commit,
                    });
                    this.replaceField = crelt("input", {
                        value: query.replace,
                        placeholder: phrase(view, "Replace"),
                        "aria-label": phrase(view, "Replace"),
                        class: "cm-textfield",
                        name: "replace",
                        onchange: this.commit,
                        onkeyup: this.commit,
                    });
                    this.caseField = crelt("input", {
                        type: "checkbox",
                        name: "case",
                        checked: query.caseSensitive,
                        onchange: this.commit,
                    });
                    this.reField = crelt("input", {
                        type: "checkbox",
                        name: "re",
                        checked: query.regexp,
                        onchange: this.commit,
                    });
                    function button(name, onclick, content) {
                        return crelt(
                            "button",
                            {
                                class: "cm-button",
                                name,
                                onclick,
                                type: "button",
                            },
                            content
                        );
                    }
                    this.dom = crelt(
                        "div",
                        {
                            onkeydown: (e) => this.keydown(e),
                            class: "cm-search",
                        },
                        [
                            this.searchField,
                            button("next", () => findNext(view), [
                                phrase(view, "next"),
                            ]),
                            button("prev", () => findPrevious(view), [
                                phrase(view, "previous"),
                            ]),
                            button("select", () => selectMatches(view), [
                                phrase(view, "all"),
                            ]),
                            crelt("label", null, [
                                this.caseField,
                                phrase(view, "match case"),
                            ]),
                            crelt("label", null, [
                                this.reField,
                                phrase(view, "regexp"),
                            ]),
                            ...(view.state.readOnly
                                ? []
                                : [
                                      crelt("br"),
                                      this.replaceField,
                                      button(
                                          "replace",
                                          () => replaceNext(view),
                                          [phrase(view, "replace")]
                                      ),
                                      button(
                                          "replaceAll",
                                          () => replaceAll(view),
                                          [phrase(view, "replace all")]
                                      ),
                                      crelt(
                                          "button",
                                          {
                                              name: "close",
                                              onclick: () =>
                                                  closeSearchPanel(view),
                                              "aria-label": phrase(
                                                  view,
                                                  "close"
                                              ),
                                              type: "button",
                                          },
                                          ["×"]
                                      ),
                                  ]),
                        ]
                    );
                }
                commit() {
                    let query = new SearchQuery({
                        search: this.searchField.value,
                        caseSensitive: this.caseField.checked,
                        regexp: this.reField.checked,
                        replace: this.replaceField.value,
                    });
                    if (!query.eq(this.query)) {
                        this.query = query;
                        this.view.dispatch({
                            effects: setSearchQuery.of(query),
                        });
                    }
                }
                keydown(e) {
                    if (
                        (0, dist /* runScopeHandlers */.$1)(
                            this.view,
                            e,
                            "search-panel"
                        )
                    ) {
                        e.preventDefault();
                    } else if (
                        e.keyCode == 13 &&
                        e.target == this.searchField
                    ) {
                        e.preventDefault();
                        (e.shiftKey ? findPrevious : findNext)(this.view);
                    } else if (
                        e.keyCode == 13 &&
                        e.target == this.replaceField
                    ) {
                        e.preventDefault();
                        replaceNext(this.view);
                    }
                }
                update(update) {
                    for (let tr of update.transactions)
                        for (let effect of tr.effects) {
                            if (
                                effect.is(setSearchQuery) &&
                                !effect.value.eq(this.query)
                            )
                                this.setQuery(effect.value);
                        }
                }
                setQuery(query) {
                    this.query = query;
                    this.searchField.value = query.search;
                    this.replaceField.value = query.replace;
                    this.caseField.checked = query.caseSensitive;
                    this.reField.checked = query.regexp;
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
            function phrase(view, phrase) {
                return view.state.phrase(phrase);
            }
            const AnnounceMargin = 30;
            const Break = /[\s\.,:;?!]/;
            function announceMatch(view, { from, to }) {
                let lineStart = view.state.doc.lineAt(from).from,
                    lineEnd = view.state.doc.lineAt(to).to;
                let start = Math.max(lineStart, from - AnnounceMargin),
                    end = Math.min(lineEnd, to + AnnounceMargin);
                let text = view.state.sliceDoc(start, end);
                if (start != lineStart) {
                    for (let i = 0; i < AnnounceMargin; i++)
                        if (!Break.test(text[i + 1]) && Break.test(text[i])) {
                            text = text.slice(i);
                            break;
                        }
                }
                if (end != lineEnd) {
                    for (
                        let i = text.length - 1;
                        i > text.length - AnnounceMargin;
                        i--
                    )
                        if (!Break.test(text[i - 1]) && Break.test(text[i])) {
                            text = text.slice(0, i);
                            break;
                        }
                }
                return dist /* EditorView.announce.of */.tk.announce
                    .of(
                        `${view.state.phrase(
                            "current match"
                        )}. ${text} ${view.state.phrase("on line")} ${
                            view.state.doc.lineAt(from).number
                        }`
                    );
            }
            const dist_baseTheme =
                /*@__PURE__*/ dist /* EditorView.baseTheme */.tk
                    .baseTheme({
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
                                margin: 0,
                            },
                            "& input, & button, & label": {
                                margin: ".2em .6em .2em 0",
                            },
                            "& input[type=checkbox]": {
                                marginRight: ".2em",
                            },
                            "& label": {
                                fontSize: "80%",
                                whiteSpace: "pre",
                            },
                        },
                        "&light .cm-searchMatch": {
                            backgroundColor: "#ffff0054",
                        },
                        "&dark .cm-searchMatch": {
                            backgroundColor: "#00ffff8a",
                        },
                        "&light .cm-searchMatch-selected": {
                            backgroundColor: "#ff6a0054",
                        },
                        "&dark .cm-searchMatch-selected": {
                            backgroundColor: "#ff00ff8a",
                        },
                    });
            const searchExtensions = [
                searchState,
                /*@__PURE__*/ state_dist /* Prec.lowest */.Wl.lowest(
                    searchHighlighter
                ),
                dist_baseTheme,
            ]; // CONCATENATED MODULE: ./node_modules/@codemirror/autocomplete/dist/index.js

            /**
An instance of this is passed to completion source functions.
*/
            class CompletionContext {
                /**
    Create a new completion context. (Mostly useful for testing
    completion sources—in the editor, the extension will create
    these for you.)
    */
                constructor(
                    /**
    The editor state that the completion happens in.
    */
                    state,
                    /**
    The position at which the completion is happening.
    */
                    pos,
                    /**
    Indicates whether completion was activated explicitly, or
    implicitly by typing. The usual way to respond to this is to
    only return completions when either there is part of a
    completable entity before the cursor, or `explicit` is true.
    */
                    explicit
                ) {
                    this.state = state;
                    this.pos = pos;
                    this.explicit = explicit;
                    /**
        @internal
        */
                    this.abortListeners = [];
                }
                /**
    Get the extent, content, and (if there is a token) type of the
    token before `this.pos`.
    */
                tokenBefore(types) {
                    let token = dist_syntaxTree(this.state).resolveInner(
                        this.pos,
                        -1
                    );
                    while (token && types.indexOf(token.name) < 0)
                        token = token.parent;
                    return token
                        ? {
                              from: token.from,
                              to: this.pos,
                              text: this.state.sliceDoc(token.from, this.pos),
                              type: token.type,
                          }
                        : null;
                }
                /**
    Get the match of the given expression directly before the
    cursor.
    */
                matchBefore(expr) {
                    let line = this.state.doc.lineAt(this.pos);
                    let start = Math.max(line.from, this.pos - 250);
                    let str = line.text.slice(
                        start - line.from,
                        this.pos - line.from
                    );
                    let found = str.search(ensureAnchor(expr, false));
                    return found < 0
                        ? null
                        : {
                              from: start + found,
                              to: this.pos,
                              text: str.slice(found),
                          };
                }
                /**
    Yields true when the query has been aborted. Can be useful in
    asynchronous queries to avoid doing work that will be ignored.
    */
                get aborted() {
                    return this.abortListeners == null;
                }
                /**
    Allows you to register abort handlers, which will be called when
    the query is
    [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
    */
                addEventListener(type, listener) {
                    if (type == "abort" && this.abortListeners)
                        this.abortListeners.push(listener);
                }
            }
            function toSet(chars) {
                let flat = Object.keys(chars).join("");
                let words = /\w/.test(flat);
                if (words) flat = flat.replace(/\w/g, "");
                return `[${words ? "\\w" : ""}${flat.replace(
                    /[^\w\s]/g,
                    "\\$&"
                )}]`;
            }
            function prefixMatch(options) {
                let first = Object.create(null),
                    rest = Object.create(null);
                for (let { label } of options) {
                    first[label[0]] = true;
                    for (let i = 1; i < label.length; i++)
                        rest[label[i]] = true;
                }
                let source = toSet(first) + toSet(rest) + "*$";
                return [new RegExp("^" + source), new RegExp(source)];
            }
            /**
Given a a fixed array of options, return an autocompleter that
completes them.
*/
            function completeFromList(list) {
                let options = list.map((o) =>
                    typeof o == "string" ? { label: o } : o
                );
                let [validFor, match] = options.every((o) =>
                    /^\w+$/.test(o.label)
                )
                    ? [/\w*$/, /\w+$/]
                    : prefixMatch(options);
                return (context) => {
                    let token = context.matchBefore(match);
                    return token || context.explicit
                        ? {
                              from: token ? token.from : context.pos,
                              options,
                              validFor,
                          }
                        : null;
                };
            }
            /**
Wrap the given completion source so that it will only fire when the
cursor is in a syntax node with one of the given names.
*/
            function ifIn(nodes, source) {
                return (context) => {
                    for (
                        let pos = syntaxTree(context.state).resolveInner(
                            context.pos,
                            -1
                        );
                        pos;
                        pos = pos.parent
                    )
                        if (nodes.indexOf(pos.name) > -1)
                            return source(context);
                    return null;
                };
            }
            /**
Wrap the given completion source so that it will not fire when the
cursor is in a syntax node with one of the given names.
*/
            function ifNotIn(nodes, source) {
                return (context) => {
                    for (
                        let pos = syntaxTree(context.state).resolveInner(
                            context.pos,
                            -1
                        );
                        pos;
                        pos = pos.parent
                    )
                        if (nodes.indexOf(pos.name) > -1) return null;
                    return source(context);
                };
            }
            class Option {
                constructor(completion, source, match) {
                    this.completion = completion;
                    this.source = source;
                    this.match = match;
                }
            }
            function cur(state) {
                return state.selection.main.head;
            }
            // Make sure the given regexp has a $ at its end and, if `start` is
            // true, a ^ at its start.
            function ensureAnchor(expr, start) {
                var _a;
                let { source } = expr;
                let addStart = start && source[0] != "^",
                    addEnd = source[source.length - 1] != "$";
                if (!addStart && !addEnd) return expr;
                return new RegExp(
                    `${addStart ? "^" : ""}(?:${source})${addEnd ? "$" : ""}`,
                    (_a = expr.flags) !== null && _a !== void 0
                        ? _a
                        : expr.ignoreCase
                        ? "i"
                        : ""
                );
            }
            /**
This annotation is added to transactions that are produced by
picking a completion.
*/
            const pickedCompletion =
                /*@__PURE__*/ state_dist /* Annotation.define */.q6
                    .define();
            function applyCompletion(view, option) {
                const apply =
                    option.completion.apply || option.completion.label;
                let result = option.source;
                if (typeof apply == "string") {
                    view.dispatch(
                        view.state.changeByRange((range) => {
                            if (range == view.state.selection.main)
                                return {
                                    changes: {
                                        from: result.from,
                                        to: result.to,
                                        insert: apply,
                                    },
                                    range: state_dist /* EditorSelection.cursor */.jT
                                        .cursor(result.from + apply.length),
                                };
                            let len = result.to - result.from;
                            if (
                                !range.empty ||
                                (len &&
                                    view.state.sliceDoc(
                                        range.from - len,
                                        range.from
                                    ) !=
                                        view.state.sliceDoc(
                                            result.from,
                                            result.to
                                        ))
                            )
                                return { range };
                            return {
                                changes: {
                                    from: range.from - len,
                                    to: range.from,
                                    insert: apply,
                                },
                                range: state_dist /* EditorSelection.cursor */.jT
                                    .cursor(range.from - len + apply.length),
                            };
                        }),
                        {
                            userEvent: "input.complete",
                            annotations: pickedCompletion.of(option.completion),
                        }
                    );
                } else {
                    apply(view, option.completion, result.from, result.to);
                }
            }
            const SourceCache = /*@__PURE__*/ new WeakMap();
            function asSource(source) {
                if (!Array.isArray(source)) return source;
                let known = SourceCache.get(source);
                if (!known)
                    SourceCache.set(source, (known = completeFromList(source)));
                return known;
            }

            // A pattern matcher for fuzzy completion matching. Create an instance
            // once for a pattern, and then use that to match any number of
            // completions.
            class FuzzyMatcher {
                constructor(pattern) {
                    this.pattern = pattern;
                    this.chars = [];
                    this.folded = [];
                    // Buffers reused by calls to `match` to track matched character
                    // positions.
                    this.any = [];
                    this.precise = [];
                    this.byWord = [];
                    for (let p = 0; p < pattern.length; ) {
                        let char = (0, state_dist /* codePointAt */.gm)(
                                pattern,
                                p
                            ),
                            size = (0, state_dist /* codePointSize */.nZ)(char);
                        this.chars.push(char);
                        let part = pattern.slice(p, p + size),
                            upper = part.toUpperCase();
                        this.folded.push(
                            (0, state_dist /* codePointAt */.gm)(
                                upper == part ? part.toLowerCase() : upper,
                                0
                            )
                        );
                        p += size;
                    }
                    this.astral = pattern.length != this.chars.length;
                }
                // Matches a given word (completion) against the pattern (input).
                // Will return null for no match, and otherwise an array that starts
                // with the match score, followed by any number of `from, to` pairs
                // indicating the matched parts of `word`.
                //
                // The score is a number that is more negative the worse the match
                // is. See `Penalty` above.
                match(word) {
                    if (this.pattern.length == 0) return [0];
                    if (word.length < this.pattern.length) return null;
                    let { chars, folded, any, precise, byWord } = this;
                    // For single-character queries, only match when they occur right
                    // at the start
                    if (chars.length == 1) {
                        let first = (0, state_dist /* codePointAt */.gm)(
                            word,
                            0
                        );
                        return first == chars[0]
                            ? [
                                  0,
                                  0,
                                  (0, state_dist /* codePointSize */.nZ)(first),
                              ]
                            : first == folded[0]
                            ? [
                                  -200 /* CaseFold */,
                                  0,
                                  (0, state_dist /* codePointSize */.nZ)(first),
                              ]
                            : null;
                    }
                    let direct = word.indexOf(this.pattern);
                    if (direct == 0) return [0, 0, this.pattern.length];
                    let len = chars.length,
                        anyTo = 0;
                    if (direct < 0) {
                        for (
                            let i = 0, e = Math.min(word.length, 200);
                            i < e && anyTo < len;

                        ) {
                            let next = (0, state_dist /* codePointAt */.gm)(
                                word,
                                i
                            );
                            if (next == chars[anyTo] || next == folded[anyTo])
                                any[anyTo++] = i;
                            i += (0, state_dist /* codePointSize */.nZ)(next);
                        }
                        // No match, exit immediately
                        if (anyTo < len) return null;
                    }
                    // This tracks the extent of the precise (non-folded, not
                    // necessarily adjacent) match
                    let preciseTo = 0;
                    // Tracks whether there is a match that hits only characters that
                    // appear to be starting words. `byWordFolded` is set to true when
                    // a case folded character is encountered in such a match
                    let byWordTo = 0,
                        byWordFolded = false;
                    // If we've found a partial adjacent match, these track its state
                    let adjacentTo = 0,
                        adjacentStart = -1,
                        adjacentEnd = -1;
                    let hasLower = /[a-z]/.test(word),
                        wordAdjacent = true;
                    // Go over the option's text, scanning for the various kinds of matches
                    for (
                        let i = 0,
                            e = Math.min(word.length, 200),
                            prevType = 0 /* NonWord */;
                        i < e && byWordTo < len;

                    ) {
                        let next = (0, state_dist /* codePointAt */.gm)(
                            word,
                            i
                        );
                        if (direct < 0) {
                            if (preciseTo < len && next == chars[preciseTo])
                                precise[preciseTo++] = i;
                            if (adjacentTo < len) {
                                if (
                                    next == chars[adjacentTo] ||
                                    next == folded[adjacentTo]
                                ) {
                                    if (adjacentTo == 0) adjacentStart = i;
                                    adjacentEnd = i + 1;
                                    adjacentTo++;
                                } else {
                                    adjacentTo = 0;
                                }
                            }
                        }
                        let ch,
                            type =
                                next < 0xff
                                    ? (next >= 48 && next <= 57) ||
                                      (next >= 97 && next <= 122)
                                        ? 2 /* Lower */
                                        : next >= 65 && next <= 90
                                        ? 1 /* Upper */
                                        : 0 /* NonWord */
                                    : (ch = (0,
                                      state_dist /* fromCodePoint */.bg)(
                                          next
                                      )) != ch.toLowerCase()
                                    ? 1 /* Upper */
                                    : ch != ch.toUpperCase()
                                    ? 2 /* Lower */
                                    : 0 /* NonWord */;
                        if (
                            !i ||
                            (type == 1 /* Upper */ && hasLower) ||
                            (prevType == 0 /* NonWord */ &&
                                type != 0) /* NonWord */
                        ) {
                            if (
                                chars[byWordTo] == next ||
                                (folded[byWordTo] == next &&
                                    (byWordFolded = true))
                            )
                                byWord[byWordTo++] = i;
                            else if (byWord.length) wordAdjacent = false;
                        }
                        prevType = type;
                        i += (0, state_dist /* codePointSize */.nZ)(next);
                    }
                    if (byWordTo == len && byWord[0] == 0 && wordAdjacent)
                        return this.result(
                            -100 /* ByWord */ +
                                (byWordFolded ? -200 /* CaseFold */ : 0),
                            byWord,
                            word
                        );
                    if (adjacentTo == len && adjacentStart == 0)
                        return [
                            -200 /* CaseFold */ - word.length,
                            0,
                            adjacentEnd,
                        ];
                    if (direct > -1)
                        return [
                            -700 /* NotStart */ - word.length,
                            direct,
                            direct + this.pattern.length,
                        ];
                    if (adjacentTo == len)
                        return [
                            -200 /* CaseFold */ +
                                -700 /* NotStart */ -
                                word.length,
                            adjacentStart,
                            adjacentEnd,
                        ];
                    if (byWordTo == len)
                        return this.result(
                            -100 /* ByWord */ +
                                (byWordFolded ? -200 /* CaseFold */ : 0) +
                                -700 /* NotStart */ +
                                (wordAdjacent ? 0 : -1100) /* Gap */,
                            byWord,
                            word
                        );
                    return chars.length == 2
                        ? null
                        : this.result(
                              (any[0] ? -700 /* NotStart */ : 0) +
                                  -200 /* CaseFold */ +
                                  -1100 /* Gap */,
                              any,
                              word
                          );
                }
                result(score, positions, word) {
                    let result = [score - word.length],
                        i = 1;
                    for (let pos of positions) {
                        let to =
                            pos +
                            (this.astral
                                ? (0, state_dist /* codePointSize */.nZ)(
                                      (0, state_dist /* codePointAt */.gm)(
                                          word,
                                          pos
                                      )
                                  )
                                : 1);
                        if (i > 1 && result[i - 1] == pos) result[i - 1] = to;
                        else {
                            result[i++] = pos;
                            result[i++] = to;
                        }
                    }
                    return result;
                }
            }

            const completionConfig =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define({
                        combine(configs) {
                            return (0, state_dist /* combineConfig */.BO)(
                                configs,
                                {
                                    activateOnTyping: true,
                                    override: null,
                                    closeOnBlur: true,
                                    maxRenderedOptions: 100,
                                    defaultKeymap: true,
                                    optionClass: () => "",
                                    aboveCursor: false,
                                    icons: true,
                                    addToOptions: [],
                                },
                                {
                                    defaultKeymap: (a, b) => a && b,
                                    closeOnBlur: (a, b) => a && b,
                                    icons: (a, b) => a && b,
                                    optionClass: (a, b) => (c) =>
                                        joinClass(a(c), b(c)),
                                    addToOptions: (a, b) => a.concat(b),
                                }
                            );
                        },
                    });
            function joinClass(a, b) {
                return a ? (b ? a + " " + b : a) : b;
            }

            function optionContent(config) {
                let content = config.addToOptions.slice();
                if (config.icons)
                    content.push({
                        render(completion) {
                            let icon = document.createElement("div");
                            icon.classList.add("cm-completionIcon");
                            if (completion.type)
                                icon.classList.add(
                                    ...completion.type
                                        .split(/\s+/g)
                                        .map(
                                            (cls) => "cm-completionIcon-" + cls
                                        )
                                );
                            icon.setAttribute("aria-hidden", "true");
                            return icon;
                        },
                        position: 20,
                    });
                content.push(
                    {
                        render(completion, _s, match) {
                            let labelElt = document.createElement("span");
                            labelElt.className = "cm-completionLabel";
                            let { label } = completion,
                                off = 0;
                            for (let j = 1; j < match.length; ) {
                                let from = match[j++],
                                    to = match[j++];
                                if (from > off)
                                    labelElt.appendChild(
                                        document.createTextNode(
                                            label.slice(off, from)
                                        )
                                    );
                                let span = labelElt.appendChild(
                                    document.createElement("span")
                                );
                                span.appendChild(
                                    document.createTextNode(
                                        label.slice(from, to)
                                    )
                                );
                                span.className = "cm-completionMatchedText";
                                off = to;
                            }
                            if (off < label.length)
                                labelElt.appendChild(
                                    document.createTextNode(label.slice(off))
                                );
                            return labelElt;
                        },
                        position: 50,
                    },
                    {
                        render(completion) {
                            if (!completion.detail) return null;
                            let detailElt = document.createElement("span");
                            detailElt.className = "cm-completionDetail";
                            detailElt.textContent = completion.detail;
                            return detailElt;
                        },
                        position: 80,
                    }
                );
                return content
                    .sort((a, b) => a.position - b.position)
                    .map((a) => a.render);
            }
            function rangeAroundSelected(total, selected, max) {
                if (total <= max) return { from: 0, to: total };
                if (selected <= total >> 1) {
                    let off = Math.floor(selected / max);
                    return { from: off * max, to: (off + 1) * max };
                }
                let off = Math.floor((total - selected) / max);
                return { from: total - (off + 1) * max, to: total - off * max };
            }
            class CompletionTooltip {
                constructor(view, stateField) {
                    this.view = view;
                    this.stateField = stateField;
                    this.info = null;
                    this.placeInfo = {
                        read: () => this.measureInfo(),
                        write: (pos) => this.positionInfo(pos),
                        key: this,
                    };
                    let cState = view.state.field(stateField);
                    let { options, selected } = cState.open;
                    let config = view.state.facet(completionConfig);
                    this.optionContent = optionContent(config);
                    this.optionClass = config.optionClass;
                    this.range = rangeAroundSelected(
                        options.length,
                        selected,
                        config.maxRenderedOptions
                    );
                    this.dom = document.createElement("div");
                    this.dom.className = "cm-tooltip-autocomplete";
                    this.dom.addEventListener("mousedown", (e) => {
                        for (
                            let dom = e.target, match;
                            dom && dom != this.dom;
                            dom = dom.parentNode
                        ) {
                            if (
                                dom.nodeName == "LI" &&
                                (match = /-(\d+)$/.exec(dom.id)) &&
                                +match[1] < options.length
                            ) {
                                applyCompletion(view, options[+match[1]]);
                                e.preventDefault();
                                return;
                            }
                        }
                    });
                    this.list = this.dom.appendChild(
                        this.createListBox(options, cState.id, this.range)
                    );
                    this.list.addEventListener("scroll", () => {
                        if (this.info) this.view.requestMeasure(this.placeInfo);
                    });
                }
                mount() {
                    this.updateSel();
                }
                update(update) {
                    if (
                        update.state.field(this.stateField) !=
                        update.startState.field(this.stateField)
                    )
                        this.updateSel();
                }
                positioned() {
                    if (this.info) this.view.requestMeasure(this.placeInfo);
                }
                updateSel() {
                    let cState = this.view.state.field(this.stateField),
                        open = cState.open;
                    if (
                        open.selected < this.range.from ||
                        open.selected >= this.range.to
                    ) {
                        this.range = rangeAroundSelected(
                            open.options.length,
                            open.selected,
                            this.view.state.facet(completionConfig)
                                .maxRenderedOptions
                        );
                        this.list.remove();
                        this.list = this.dom.appendChild(
                            this.createListBox(
                                open.options,
                                cState.id,
                                this.range
                            )
                        );
                        this.list.addEventListener("scroll", () => {
                            if (this.info)
                                this.view.requestMeasure(this.placeInfo);
                        });
                    }
                    if (this.updateSelectedOption(open.selected)) {
                        if (this.info) {
                            this.info.remove();
                            this.info = null;
                        }
                        let { completion } = open.options[open.selected];
                        let { info } = completion;
                        if (!info) return;
                        let infoResult =
                            typeof info === "string"
                                ? document.createTextNode(info)
                                : info(completion);
                        if (!infoResult) return;
                        if ("then" in infoResult) {
                            infoResult
                                .then((node) => {
                                    if (
                                        node &&
                                        this.view.state.field(
                                            this.stateField,
                                            false
                                        ) == cState
                                    )
                                        this.addInfoPane(node);
                                })
                                .catch((e) =>
                                    (0, dist /* logException */.OO)(
                                        this.view.state,
                                        e,
                                        "completion info"
                                    )
                                );
                        } else {
                            this.addInfoPane(infoResult);
                        }
                    }
                }
                addInfoPane(content) {
                    let dom = (this.info = document.createElement("div"));
                    dom.className = "cm-tooltip cm-completionInfo";
                    dom.appendChild(content);
                    this.dom.appendChild(dom);
                    this.view.requestMeasure(this.placeInfo);
                }
                updateSelectedOption(selected) {
                    let set = null;
                    for (
                        let opt = this.list.firstChild, i = this.range.from;
                        opt;
                        opt = opt.nextSibling, i++
                    ) {
                        if (i == selected) {
                            if (!opt.hasAttribute("aria-selected")) {
                                opt.setAttribute("aria-selected", "true");
                                set = opt;
                            }
                        } else {
                            if (opt.hasAttribute("aria-selected"))
                                opt.removeAttribute("aria-selected");
                        }
                    }
                    if (set) scrollIntoView(this.list, set);
                    return set;
                }
                measureInfo() {
                    let sel = this.dom.querySelector("[aria-selected]");
                    if (!sel || !this.info) return null;
                    let listRect = this.dom.getBoundingClientRect();
                    let infoRect = this.info.getBoundingClientRect();
                    let selRect = sel.getBoundingClientRect();
                    if (
                        selRect.top >
                            Math.min(innerHeight, listRect.bottom) - 10 ||
                        selRect.bottom < Math.max(0, listRect.top) + 10
                    )
                        return null;
                    let top =
                        Math.max(
                            0,
                            Math.min(selRect.top, innerHeight - infoRect.height)
                        ) - listRect.top;
                    let left =
                        this.view.textDirection ==
                        dist /* Direction.RTL */.Nm.RTL;
                    let spaceLeft = listRect.left,
                        spaceRight = innerWidth - listRect.right;
                    if (
                        left &&
                        spaceLeft < Math.min(infoRect.width, spaceRight)
                    )
                        left = false;
                    else if (
                        !left &&
                        spaceRight < Math.min(infoRect.width, spaceLeft)
                    )
                        left = true;
                    return { top, left };
                }
                positionInfo(pos) {
                    if (this.info) {
                        this.info.style.top = (pos ? pos.top : -1e6) + "px";
                        if (pos) {
                            this.info.classList.toggle(
                                "cm-completionInfo-left",
                                pos.left
                            );
                            this.info.classList.toggle(
                                "cm-completionInfo-right",
                                !pos.left
                            );
                        }
                    }
                }
                createListBox(options, id, range) {
                    const ul = document.createElement("ul");
                    ul.id = id;
                    ul.setAttribute("role", "listbox");
                    ul.setAttribute("aria-expanded", "true");
                    for (let i = range.from; i < range.to; i++) {
                        let { completion, match } = options[i];
                        const li = ul.appendChild(document.createElement("li"));
                        li.id = id + "-" + i;
                        li.setAttribute("role", "option");
                        let cls = this.optionClass(completion);
                        if (cls) li.className = cls;
                        for (let source of this.optionContent) {
                            let node = source(
                                completion,
                                this.view.state,
                                match
                            );
                            if (node) li.appendChild(node);
                        }
                    }
                    if (range.from)
                        ul.classList.add("cm-completionListIncompleteTop");
                    if (range.to < options.length)
                        ul.classList.add("cm-completionListIncompleteBottom");
                    return ul;
                }
            }
            // We allocate a new function instance every time the completion
            // changes to force redrawing/repositioning of the tooltip
            function completionTooltip(stateField) {
                return (view) => new CompletionTooltip(view, stateField);
            }
            function scrollIntoView(container, element) {
                let parent = container.getBoundingClientRect();
                let self = element.getBoundingClientRect();
                if (self.top < parent.top)
                    container.scrollTop -= parent.top - self.top;
                else if (self.bottom > parent.bottom)
                    container.scrollTop += self.bottom - parent.bottom;
            }

            // Used to pick a preferred option when two options with the same
            // label occur in the result.
            function score(option) {
                return (
                    (option.boost || 0) * 100 +
                    (option.apply ? 10 : 0) +
                    (option.info ? 5 : 0) +
                    (option.type ? 1 : 0)
                );
            }
            function sortOptions(active, state) {
                let options = [],
                    i = 0;
                for (let a of active)
                    if (a.hasResult()) {
                        if (a.result.filter === false) {
                            let getMatch = a.result.getMatch;
                            for (let option of a.result.options) {
                                let match = [1e9 - i++];
                                if (getMatch)
                                    for (let n of getMatch(option))
                                        match.push(n);
                                options.push(new Option(option, a, match));
                            }
                        } else {
                            let matcher = new FuzzyMatcher(
                                    state.sliceDoc(a.from, a.to)
                                ),
                                match;
                            for (let option of a.result.options)
                                if ((match = matcher.match(option.label))) {
                                    if (option.boost != null)
                                        match[0] += option.boost;
                                    options.push(new Option(option, a, match));
                                }
                        }
                    }
                let result = [],
                    prev = null;
                for (let opt of options.sort(cmpOption)) {
                    if (
                        !prev ||
                        prev.label != opt.completion.label ||
                        prev.detail != opt.completion.detail ||
                        (prev.type != null &&
                            opt.completion.type != null &&
                            prev.type != opt.completion.type) ||
                        prev.apply != opt.completion.apply
                    )
                        result.push(opt);
                    else if (score(opt.completion) > score(prev))
                        result[result.length - 1] = opt;
                    prev = opt.completion;
                }
                return result;
            }
            class CompletionDialog {
                constructor(options, attrs, tooltip, timestamp, selected) {
                    this.options = options;
                    this.attrs = attrs;
                    this.tooltip = tooltip;
                    this.timestamp = timestamp;
                    this.selected = selected;
                }
                setSelected(selected, id) {
                    return selected == this.selected ||
                        selected >= this.options.length
                        ? this
                        : new CompletionDialog(
                              this.options,
                              makeAttrs(id, selected),
                              this.tooltip,
                              this.timestamp,
                              selected
                          );
                }
                static build(active, state, id, prev, conf) {
                    let options = sortOptions(active, state);
                    if (!options.length) return null;
                    let selected = 0;
                    if (prev && prev.selected) {
                        let selectedValue =
                            prev.options[prev.selected].completion;
                        for (let i = 0; i < options.length; i++)
                            if (options[i].completion == selectedValue) {
                                selected = i;
                                break;
                            }
                    }
                    return new CompletionDialog(
                        options,
                        makeAttrs(id, selected),
                        {
                            pos: active.reduce(
                                (a, b) =>
                                    b.hasResult() ? Math.min(a, b.from) : a,
                                1e8
                            ),
                            create: completionTooltip(completionState),
                            above: conf.aboveCursor,
                        },
                        prev ? prev.timestamp : Date.now(),
                        selected
                    );
                }
                map(changes) {
                    return new CompletionDialog(
                        this.options,
                        this.attrs,
                        Object.assign(Object.assign({}, this.tooltip), {
                            pos: changes.mapPos(this.tooltip.pos),
                        }),
                        this.timestamp,
                        this.selected
                    );
                }
            }
            class CompletionState {
                constructor(active, id, open) {
                    this.active = active;
                    this.id = id;
                    this.open = open;
                }
                static start() {
                    return new CompletionState(
                        dist_none,
                        "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36),
                        null
                    );
                }
                update(tr) {
                    let { state } = tr,
                        conf = state.facet(completionConfig);
                    let sources =
                        conf.override ||
                        state
                            .languageDataAt("autocomplete", cur(state))
                            .map(asSource);
                    let active = sources.map((source) => {
                        let value =
                            this.active.find((s) => s.source == source) ||
                            new ActiveSource(
                                source,
                                this.active.some(
                                    (a) => a.state != 0 /* Inactive */
                                )
                                    ? 1 /* Pending */
                                    : 0 /* Inactive */
                            );
                        return value.update(tr, conf);
                    });
                    if (
                        active.length == this.active.length &&
                        active.every((a, i) => a == this.active[i])
                    )
                        active = this.active;
                    let open =
                        tr.selection ||
                        active.some(
                            (a) =>
                                a.hasResult() &&
                                tr.changes.touchesRange(a.from, a.to)
                        ) ||
                        !sameResults(active, this.active)
                            ? CompletionDialog.build(
                                  active,
                                  state,
                                  this.id,
                                  this.open,
                                  conf
                              )
                            : this.open && tr.docChanged
                            ? this.open.map(tr.changes)
                            : this.open;
                    if (
                        !open &&
                        active.every((a) => a.state != 1 /* Pending */) &&
                        active.some((a) => a.hasResult())
                    )
                        active = active.map((a) =>
                            a.hasResult()
                                ? new ActiveSource(a.source, 0 /* Inactive */)
                                : a
                        );
                    for (let effect of tr.effects)
                        if (effect.is(setSelectedEffect))
                            open =
                                open && open.setSelected(effect.value, this.id);
                    return active == this.active && open == this.open
                        ? this
                        : new CompletionState(active, this.id, open);
                }
                get tooltip() {
                    return this.open ? this.open.tooltip : null;
                }
                get attrs() {
                    return this.open ? this.open.attrs : baseAttrs;
                }
            }
            function sameResults(a, b) {
                if (a == b) return true;
                for (let iA = 0, iB = 0; ; ) {
                    while (iA < a.length && !a[iA].hasResult) iA++;
                    while (iB < b.length && !b[iB].hasResult) iB++;
                    let endA = iA == a.length,
                        endB = iB == b.length;
                    if (endA || endB) return endA == endB;
                    if (a[iA++].result != b[iB++].result) return false;
                }
            }
            const baseAttrs = {
                "aria-autocomplete": "list",
            };
            function makeAttrs(id, selected) {
                return {
                    "aria-autocomplete": "list",
                    "aria-haspopup": "listbox",
                    "aria-activedescendant": id + "-" + selected,
                    "aria-controls": id,
                };
            }
            const dist_none = [];
            function cmpOption(a, b) {
                let dScore = b.match[0] - a.match[0];
                if (dScore) return dScore;
                return a.completion.label.localeCompare(b.completion.label);
            }
            function getUserEvent(tr) {
                return tr.isUserEvent("input.type")
                    ? "input"
                    : tr.isUserEvent("delete.backward")
                    ? "delete"
                    : null;
            }
            class ActiveSource {
                constructor(source, state, explicitPos = -1) {
                    this.source = source;
                    this.state = state;
                    this.explicitPos = explicitPos;
                }
                hasResult() {
                    return false;
                }
                update(tr, conf) {
                    let event = getUserEvent(tr),
                        value = this;
                    if (event) value = value.handleUserEvent(tr, event, conf);
                    else if (tr.docChanged) value = value.handleChange(tr);
                    else if (tr.selection && value.state != 0 /* Inactive */)
                        value = new ActiveSource(
                            value.source,
                            0 /* Inactive */
                        );
                    for (let effect of tr.effects) {
                        if (effect.is(startCompletionEffect))
                            value = new ActiveSource(
                                value.source,
                                1 /* Pending */,
                                effect.value ? cur(tr.state) : -1
                            );
                        else if (effect.is(closeCompletionEffect))
                            value = new ActiveSource(
                                value.source,
                                0 /* Inactive */
                            );
                        else if (effect.is(setActiveEffect))
                            for (let active of effect.value)
                                if (active.source == value.source)
                                    value = active;
                    }
                    return value;
                }
                handleUserEvent(tr, type, conf) {
                    return type == "delete" || !conf.activateOnTyping
                        ? this.map(tr.changes)
                        : new ActiveSource(this.source, 1 /* Pending */);
                }
                handleChange(tr) {
                    return tr.changes.touchesRange(cur(tr.startState))
                        ? new ActiveSource(this.source, 0 /* Inactive */)
                        : this.map(tr.changes);
                }
                map(changes) {
                    return changes.empty || this.explicitPos < 0
                        ? this
                        : new ActiveSource(
                              this.source,
                              this.state,
                              changes.mapPos(this.explicitPos)
                          );
                }
            }
            class ActiveResult extends ActiveSource {
                constructor(source, explicitPos, result, from, to) {
                    super(source, 2 /* Result */, explicitPos);
                    this.result = result;
                    this.from = from;
                    this.to = to;
                }
                hasResult() {
                    return true;
                }
                handleUserEvent(tr, type, conf) {
                    var _a;
                    let from = tr.changes.mapPos(this.from),
                        to = tr.changes.mapPos(this.to, 1);
                    let pos = cur(tr.state);
                    if (
                        (this.explicitPos < 0
                            ? pos <= from
                            : pos < this.from) ||
                        pos > to ||
                        (type == "delete" && cur(tr.startState) == this.from)
                    )
                        return new ActiveSource(
                            this.source,
                            type == "input" && conf.activateOnTyping
                                ? 1 /* Pending */
                                : 0 /* Inactive */
                        );
                    let explicitPos =
                            this.explicitPos < 0
                                ? -1
                                : tr.changes.mapPos(this.explicitPos),
                        updated;
                    if (checkValid(this.result.validFor, tr.state, from, to))
                        return new ActiveResult(
                            this.source,
                            explicitPos,
                            this.result,
                            from,
                            to
                        );
                    if (
                        this.result.update &&
                        (updated = this.result.update(
                            this.result,
                            from,
                            to,
                            new CompletionContext(
                                tr.state,
                                pos,
                                explicitPos >= 0
                            )
                        ))
                    )
                        return new ActiveResult(
                            this.source,
                            explicitPos,
                            updated,
                            updated.from,
                            (_a = updated.to) !== null && _a !== void 0
                                ? _a
                                : cur(tr.state)
                        );
                    return new ActiveSource(
                        this.source,
                        1 /* Pending */,
                        explicitPos
                    );
                }
                handleChange(tr) {
                    return tr.changes.touchesRange(this.from, this.to)
                        ? new ActiveSource(this.source, 0 /* Inactive */)
                        : this.map(tr.changes);
                }
                map(mapping) {
                    return mapping.empty
                        ? this
                        : new ActiveResult(
                              this.source,
                              this.explicitPos < 0
                                  ? -1
                                  : mapping.mapPos(this.explicitPos),
                              this.result,
                              mapping.mapPos(this.from),
                              mapping.mapPos(this.to, 1)
                          );
                }
            }
            function checkValid(validFor, state, from, to) {
                if (!validFor) return false;
                let text = state.sliceDoc(from, to);
                return typeof validFor == "function"
                    ? validFor(text, from, to, state)
                    : ensureAnchor(validFor, true).test(text);
            }
            const startCompletionEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const closeCompletionEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const setActiveEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define({
                    map(sources, mapping) {
                        return sources.map((s) => s.map(mapping));
                    },
                });
            const setSelectedEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const completionState =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return CompletionState.start();
                    },
                    update(value, tr) {
                        return value.update(tr);
                    },
                    provide: (f) => [
                        dist /* showTooltip.from */.hJ
                            .from(f, (val) => val.tooltip),
                        dist /* EditorView.contentAttributes.from */.tk.contentAttributes
                            .from(f, (state) => state.attrs),
                    ],
                });

            const CompletionInteractMargin = 75;
            /**
Returns a command that moves the completion selection forward or
backward by the given amount.
*/
            function moveCompletionSelection(forward, by = "option") {
                return (view) => {
                    let cState = view.state.field(completionState, false);
                    if (
                        !cState ||
                        !cState.open ||
                        Date.now() - cState.open.timestamp <
                            CompletionInteractMargin
                    )
                        return false;
                    let step = 1,
                        tooltip;
                    if (
                        by == "page" &&
                        (tooltip = (0, dist /* getTooltip */.gB)(
                            view,
                            cState.open.tooltip
                        ))
                    )
                        step = Math.max(
                            2,
                            Math.floor(
                                tooltip.dom.offsetHeight /
                                    tooltip.dom.querySelector("li").offsetHeight
                            ) - 1
                        );
                    let selected =
                            cState.open.selected + step * (forward ? 1 : -1),
                        { length } = cState.open.options;
                    if (selected < 0) selected = by == "page" ? 0 : length - 1;
                    else if (selected >= length)
                        selected = by == "page" ? length - 1 : 0;
                    view.dispatch({ effects: setSelectedEffect.of(selected) });
                    return true;
                };
            }
            /**
Accept the current completion.
*/
            const acceptCompletion = (view) => {
                let cState = view.state.field(completionState, false);
                if (
                    view.state.readOnly ||
                    !cState ||
                    !cState.open ||
                    Date.now() - cState.open.timestamp <
                        CompletionInteractMargin
                )
                    return false;
                applyCompletion(
                    view,
                    cState.open.options[cState.open.selected]
                );
                return true;
            };
            /**
Explicitly start autocompletion.
*/
            const startCompletion = (view) => {
                let cState = view.state.field(completionState, false);
                if (!cState) return false;
                view.dispatch({ effects: startCompletionEffect.of(true) });
                return true;
            };
            /**
Close the currently active completion.
*/
            const closeCompletion = (view) => {
                let cState = view.state.field(completionState, false);
                if (
                    !cState ||
                    !cState.active.some((a) => a.state != 0 /* Inactive */)
                )
                    return false;
                view.dispatch({ effects: closeCompletionEffect.of(null) });
                return true;
            };
            class RunningQuery {
                constructor(active, context) {
                    this.active = active;
                    this.context = context;
                    this.time = Date.now();
                    this.updates = [];
                    // Note that 'undefined' means 'not done yet', whereas 'null' means
                    // 'query returned null'.
                    this.done = undefined;
                }
            }
            const DebounceTime = 50,
                MaxUpdateCount = 50,
                MinAbortTime = 1000;
            const completionPlugin =
                /*@__PURE__*/ dist /* ViewPlugin.fromClass */.lg
                    .fromClass(
                        class {
                            constructor(view) {
                                this.view = view;
                                this.debounceUpdate = -1;
                                this.running = [];
                                this.debounceAccept = -1;
                                this.composing = 0 /* None */;
                                for (let active of view.state.field(
                                    completionState
                                ).active)
                                    if (active.state == 1 /* Pending */)
                                        this.startQuery(active);
                            }
                            update(update) {
                                let cState =
                                    update.state.field(completionState);
                                if (
                                    !update.selectionSet &&
                                    !update.docChanged &&
                                    update.startState.field(completionState) ==
                                        cState
                                )
                                    return;
                                let doesReset = update.transactions.some(
                                    (tr) => {
                                        return (
                                            (tr.selection || tr.docChanged) &&
                                            !getUserEvent(tr)
                                        );
                                    }
                                );
                                for (let i = 0; i < this.running.length; i++) {
                                    let query = this.running[i];
                                    if (
                                        doesReset ||
                                        (query.updates.length +
                                            update.transactions.length >
                                            MaxUpdateCount &&
                                            Date.now() - query.time >
                                                MinAbortTime)
                                    ) {
                                        for (let handler of query.context
                                            .abortListeners) {
                                            try {
                                                handler();
                                            } catch (e) {
                                                (0, dist /* logException */.OO)(
                                                    this.view.state,
                                                    e
                                                );
                                            }
                                        }
                                        query.context.abortListeners = null;
                                        this.running.splice(i--, 1);
                                    } else {
                                        query.updates.push(
                                            ...update.transactions
                                        );
                                    }
                                }
                                if (this.debounceUpdate > -1)
                                    clearTimeout(this.debounceUpdate);
                                this.debounceUpdate = cState.active.some(
                                    (a) =>
                                        a.state == 1 /* Pending */ &&
                                        !this.running.some(
                                            (q) => q.active.source == a.source
                                        )
                                )
                                    ? setTimeout(
                                          () => this.startUpdate(),
                                          DebounceTime
                                      )
                                    : -1;
                                if (this.composing != 0 /* None */)
                                    for (let tr of update.transactions) {
                                        if (getUserEvent(tr) == "input")
                                            this.composing = 2 /* Changed */;
                                        else if (
                                            this.composing == 2 /* Changed */ &&
                                            tr.selection
                                        )
                                            this.composing = 3 /* ChangedAndMoved */;
                                    }
                            }
                            startUpdate() {
                                this.debounceUpdate = -1;
                                let { state } = this.view,
                                    cState = state.field(completionState);
                                for (let active of cState.active) {
                                    if (
                                        active.state == 1 /* Pending */ &&
                                        !this.running.some(
                                            (r) =>
                                                r.active.source == active.source
                                        )
                                    )
                                        this.startQuery(active);
                                }
                            }
                            startQuery(active) {
                                let { state } = this.view,
                                    pos = cur(state);
                                let context = new CompletionContext(
                                    state,
                                    pos,
                                    active.explicitPos == pos
                                );
                                let pending = new RunningQuery(active, context);
                                this.running.push(pending);
                                Promise.resolve(active.source(context)).then(
                                    (result) => {
                                        if (!pending.context.aborted) {
                                            pending.done = result || null;
                                            this.scheduleAccept();
                                        }
                                    },
                                    (err) => {
                                        this.view.dispatch({
                                            effects:
                                                closeCompletionEffect.of(null),
                                        });
                                        (0, dist /* logException */.OO)(
                                            this.view.state,
                                            err
                                        );
                                    }
                                );
                            }
                            scheduleAccept() {
                                if (
                                    this.running.every(
                                        (q) => q.done !== undefined
                                    )
                                )
                                    this.accept();
                                else if (this.debounceAccept < 0)
                                    this.debounceAccept = setTimeout(
                                        () => this.accept(),
                                        DebounceTime
                                    );
                            }
                            // For each finished query in this.running, try to create a result
                            // or, if appropriate, restart the query.
                            accept() {
                                var _a;
                                if (this.debounceAccept > -1)
                                    clearTimeout(this.debounceAccept);
                                this.debounceAccept = -1;
                                let updated = [];
                                let conf =
                                    this.view.state.facet(completionConfig);
                                for (let i = 0; i < this.running.length; i++) {
                                    let query = this.running[i];
                                    if (query.done === undefined) continue;
                                    this.running.splice(i--, 1);
                                    if (query.done) {
                                        let active = new ActiveResult(
                                            query.active.source,
                                            query.active.explicitPos,
                                            query.done,
                                            query.done.from,
                                            (_a = query.done.to) !== null &&
                                            _a !== void 0
                                                ? _a
                                                : cur(
                                                      query.updates.length
                                                          ? query.updates[0]
                                                                .startState
                                                          : this.view.state
                                                  )
                                        );
                                        // Replay the transactions that happened since the start of
                                        // the request and see if that preserves the result
                                        for (let tr of query.updates)
                                            active = active.update(tr, conf);
                                        if (active.hasResult()) {
                                            updated.push(active);
                                            continue;
                                        }
                                    }
                                    let current = this.view.state
                                        .field(completionState)
                                        .active.find(
                                            (a) =>
                                                a.source == query.active.source
                                        );
                                    if (
                                        current &&
                                        current.state == 1 /* Pending */
                                    ) {
                                        if (query.done == null) {
                                            // Explicitly failed. Should clear the pending status if it
                                            // hasn't been re-set in the meantime.
                                            let active = new ActiveSource(
                                                query.active.source,
                                                0 /* Inactive */
                                            );
                                            for (let tr of query.updates)
                                                active = active.update(
                                                    tr,
                                                    conf
                                                );
                                            if (active.state != 1 /* Pending */)
                                                updated.push(active);
                                        } else {
                                            // Cleared by subsequent transactions. Restart.
                                            this.startQuery(current);
                                        }
                                    }
                                }
                                if (updated.length)
                                    this.view.dispatch({
                                        effects: setActiveEffect.of(updated),
                                    });
                            }
                        },
                        {
                            eventHandlers: {
                                blur() {
                                    let state = this.view.state.field(
                                        completionState,
                                        false
                                    );
                                    if (
                                        state &&
                                        state.tooltip &&
                                        this.view.state.facet(completionConfig)
                                            .closeOnBlur
                                    )
                                        this.view.dispatch({
                                            effects:
                                                closeCompletionEffect.of(null),
                                        });
                                },
                                compositionstart() {
                                    this.composing = 1 /* Started */;
                                },
                                compositionend() {
                                    if (
                                        this.composing ==
                                        3 /* ChangedAndMoved */
                                    ) {
                                        // Safari fires compositionend events synchronously, possibly
                                        // from inside an update, so dispatch asynchronously to avoid reentrancy
                                        setTimeout(
                                            () =>
                                                this.view.dispatch({
                                                    effects:
                                                        startCompletionEffect.of(
                                                            false
                                                        ),
                                                }),
                                            20
                                        );
                                    }
                                    this.composing = 0 /* None */;
                                },
                            },
                        }
                    );

            const autocomplete_dist_baseTheme =
                /*@__PURE__*/ dist /* EditorView.baseTheme */.tk
                    .baseTheme({
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
                                    lineHeight: 1.2,
                                },
                            },
                        },
                        "&light .cm-tooltip-autocomplete ul li[aria-selected]":
                            {
                                background: "#17c",
                                color: "white",
                            },
                        "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
                            background: "#347",
                            color: "white",
                        },
                        ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":
                            {
                                content: '"···"',
                                opacity: 0.5,
                                display: "block",
                                textAlign: "center",
                            },
                        ".cm-tooltip.cm-completionInfo": {
                            position: "absolute",
                            padding: "3px 9px",
                            width: "max-content",
                            maxWidth: "300px",
                        },
                        ".cm-completionInfo.cm-completionInfo-left": {
                            right: "100%",
                        },
                        ".cm-completionInfo.cm-completionInfo-right": {
                            left: "100%",
                        },
                        "&light .cm-snippetField": {
                            backgroundColor: "#00000022",
                        },
                        "&dark .cm-snippetField": {
                            backgroundColor: "#ffffff22",
                        },
                        ".cm-snippetFieldPosition": {
                            verticalAlign: "text-top",
                            width: 0,
                            height: "1.15em",
                            margin: "0 -0.7px -.7em",
                            borderLeft: "1.4px dotted #888",
                        },
                        ".cm-completionMatchedText": {
                            textDecoration: "underline",
                        },
                        ".cm-completionDetail": {
                            marginLeft: "0.5em",
                            fontStyle: "italic",
                        },
                        ".cm-completionIcon": {
                            fontSize: "90%",
                            width: ".8em",
                            display: "inline-block",
                            textAlign: "center",
                            paddingRight: ".6em",
                            opacity: "0.6",
                        },
                        ".cm-completionIcon-function, .cm-completionIcon-method":
                            {
                                "&:after": { content: "'ƒ'" },
                            },
                        ".cm-completionIcon-class": {
                            "&:after": { content: "'○'" },
                        },
                        ".cm-completionIcon-interface": {
                            "&:after": { content: "'◌'" },
                        },
                        ".cm-completionIcon-variable": {
                            "&:after": { content: "'𝑥'" },
                        },
                        ".cm-completionIcon-constant": {
                            "&:after": { content: "'𝐶'" },
                        },
                        ".cm-completionIcon-type": {
                            "&:after": { content: "'𝑡'" },
                        },
                        ".cm-completionIcon-enum": {
                            "&:after": { content: "'∪'" },
                        },
                        ".cm-completionIcon-property": {
                            "&:after": { content: "'□'" },
                        },
                        ".cm-completionIcon-keyword": {
                            "&:after": { content: "'🔑\uFE0E'" }, // Disable emoji rendering
                        },
                        ".cm-completionIcon-namespace": {
                            "&:after": { content: "'▢'" },
                        },
                        ".cm-completionIcon-text": {
                            "&:after": {
                                content: "'abc'",
                                fontSize: "50%",
                                verticalAlign: "middle",
                            },
                        },
                    });

            class FieldPos {
                constructor(field, line, from, to) {
                    this.field = field;
                    this.line = line;
                    this.from = from;
                    this.to = to;
                }
            }
            class FieldRange {
                constructor(field, from, to) {
                    this.field = field;
                    this.from = from;
                    this.to = to;
                }
                map(changes) {
                    let from = changes.mapPos(this.from, -1, MapMode.TrackDel);
                    let to = changes.mapPos(this.to, 1, MapMode.TrackDel);
                    return from == null || to == null
                        ? null
                        : new FieldRange(this.field, from, to);
                }
            }
            class Snippet {
                constructor(lines, fieldPositions) {
                    this.lines = lines;
                    this.fieldPositions = fieldPositions;
                }
                instantiate(state, pos) {
                    let text = [],
                        lineStart = [pos];
                    let lineObj = state.doc.lineAt(pos),
                        baseIndent = /^\s*/.exec(lineObj.text)[0];
                    for (let line of this.lines) {
                        if (text.length) {
                            let indent = baseIndent,
                                tabs = /^\t*/.exec(line)[0].length;
                            for (let i = 0; i < tabs; i++)
                                indent += state.facet(indentUnit);
                            lineStart.push(pos + indent.length - tabs);
                            line = indent + line.slice(tabs);
                        }
                        text.push(line);
                        pos += line.length + 1;
                    }
                    let ranges = this.fieldPositions.map(
                        (pos) =>
                            new FieldRange(
                                pos.field,
                                lineStart[pos.line] + pos.from,
                                lineStart[pos.line] + pos.to
                            )
                    );
                    return { text, ranges };
                }
                static parse(template) {
                    let fields = [];
                    let lines = [],
                        positions = [],
                        m;
                    for (let line of template.split(/\r\n?|\n/)) {
                        while (
                            (m = /[#$]\{(?:(\d+)(?::([^}]*))?|([^}]*))\}/.exec(
                                line
                            ))
                        ) {
                            let seq = m[1] ? +m[1] : null,
                                name = m[2] || m[3] || "",
                                found = -1;
                            for (let i = 0; i < fields.length; i++) {
                                if (
                                    seq != null
                                        ? fields[i].seq == seq
                                        : name
                                        ? fields[i].name == name
                                        : false
                                )
                                    found = i;
                            }
                            if (found < 0) {
                                let i = 0;
                                while (
                                    i < fields.length &&
                                    (seq == null ||
                                        (fields[i].seq != null &&
                                            fields[i].seq < seq))
                                )
                                    i++;
                                fields.splice(i, 0, { seq, name });
                                found = i;
                                for (let pos of positions)
                                    if (pos.field >= found) pos.field++;
                            }
                            positions.push(
                                new FieldPos(
                                    found,
                                    lines.length,
                                    m.index,
                                    m.index + name.length
                                )
                            );
                            line =
                                line.slice(0, m.index) +
                                name +
                                line.slice(m.index + m[0].length);
                        }
                        lines.push(line);
                    }
                    return new Snippet(lines, positions);
                }
            }
            let fieldMarker = /*@__PURE__*/ dist /* Decoration.widget */.p
                .widget({
                    widget: /*@__PURE__*/ new (class extends dist /* WidgetType */.l9 {
                        toDOM() {
                            let span = document.createElement("span");
                            span.className = "cm-snippetFieldPosition";
                            return span;
                        }
                        ignoreEvent() {
                            return false;
                        }
                    })(),
                });
            let fieldRange = /*@__PURE__*/ dist /* Decoration.mark */.p
                .mark({ class: "cm-snippetField" });
            class ActiveSnippet {
                constructor(ranges, active) {
                    this.ranges = ranges;
                    this.active = active;
                    this.deco = dist /* Decoration.set */.p
                        .set(
                            ranges.map((r) =>
                                (r.from == r.to
                                    ? fieldMarker
                                    : fieldRange
                                ).range(r.from, r.to)
                            )
                        );
                }
                map(changes) {
                    let ranges = [];
                    for (let r of this.ranges) {
                        let mapped = r.map(changes);
                        if (!mapped) return null;
                        ranges.push(mapped);
                    }
                    return new ActiveSnippet(ranges, this.active);
                }
                selectionInsideField(sel) {
                    return sel.ranges.every((range) =>
                        this.ranges.some(
                            (r) =>
                                r.field == this.active &&
                                r.from <= range.from &&
                                r.to >= range.to
                        )
                    );
                }
            }
            const setActive =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define({
                    map(value, changes) {
                        return value && value.map(changes);
                    },
                });
            const moveToField =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const snippetState =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return null;
                    },
                    update(value, tr) {
                        for (let effect of tr.effects) {
                            if (effect.is(setActive)) return effect.value;
                            if (effect.is(moveToField) && value)
                                return new ActiveSnippet(
                                    value.ranges,
                                    effect.value
                                );
                        }
                        if (value && tr.docChanged)
                            value = value.map(tr.changes);
                        if (
                            value &&
                            tr.selection &&
                            !value.selectionInsideField(tr.selection)
                        )
                            value = null;
                        return value;
                    },
                    provide: (f) =>
                        dist /* EditorView.decorations.from */.tk.decorations
                            .from(f, (val) =>
                                val
                                    ? val.deco
                                    : dist /* Decoration.none */.p.none
                            ),
                });
            function fieldSelection(ranges, field) {
                return state_dist /* EditorSelection.create */.jT
                    .create(
                        ranges
                            .filter((r) => r.field == field)
                            .map((r) =>
                                state_dist /* EditorSelection.range */.jT
                                    .range(r.from, r.to)
                            )
                    );
            }
            /**
Convert a snippet template to a function that can
[apply](https://codemirror.net/6/docs/ref/#autocomplete.Completion.apply) it. Snippets are written
using syntax like this:

    "for (let ${index} = 0; ${index} < ${end}; ${index}++) {\n\t${}\n}"

Each `${}` placeholder (you may also use `#{}`) indicates a field
that the user can fill in. Its name, if any, will be the default
content for the field.

When the snippet is activated by calling the returned function,
the code is inserted at the given position. Newlines in the
template are indented by the indentation of the start line, plus
one [indent unit](https://codemirror.net/6/docs/ref/#language.indentUnit) per tab character after
the newline.

On activation, (all instances of) the first field are selected.
The user can move between fields with Tab and Shift-Tab as long as
the fields are active. Moving to the last field or moving the
cursor out of the current field deactivates the fields.

The order of fields defaults to textual order, but you can add
numbers to placeholders (`${1}` or `${1:defaultText}`) to provide
a custom order.
*/
            function snippet(template) {
                let snippet = Snippet.parse(template);
                return (editor, _completion, from, to) => {
                    let { text, ranges } = snippet.instantiate(
                        editor.state,
                        from
                    );
                    let spec = { changes: { from, to, insert: Text.of(text) } };
                    if (ranges.length)
                        spec.selection = fieldSelection(ranges, 0);
                    if (ranges.length > 1) {
                        let active = new ActiveSnippet(ranges, 0);
                        let effects = (spec.effects = [setActive.of(active)]);
                        if (
                            editor.state.field(snippetState, false) ===
                            undefined
                        )
                            effects.push(
                                StateEffect.appendConfig.of([
                                    snippetState,
                                    addSnippetKeymap,
                                    snippetPointerHandler,
                                    autocomplete_dist_baseTheme,
                                ])
                            );
                    }
                    editor.dispatch(editor.state.update(spec));
                };
            }
            function moveField(dir) {
                return ({ state, dispatch }) => {
                    let active = state.field(snippetState, false);
                    if (!active || (dir < 0 && active.active == 0))
                        return false;
                    let next = active.active + dir,
                        last =
                            dir > 0 &&
                            !active.ranges.some((r) => r.field == next + dir);
                    dispatch(
                        state.update({
                            selection: fieldSelection(active.ranges, next),
                            effects: setActive.of(
                                last
                                    ? null
                                    : new ActiveSnippet(active.ranges, next)
                            ),
                        })
                    );
                    return true;
                };
            }
            /**
A command that clears the active snippet, if any.
*/
            const clearSnippet = ({ state, dispatch }) => {
                let active = state.field(snippetState, false);
                if (!active) return false;
                dispatch(state.update({ effects: setActive.of(null) }));
                return true;
            };
            /**
Move to the next snippet field, if available.
*/
            const nextSnippetField = /*@__PURE__*/ moveField(1);
            /**
Move to the previous snippet field, if available.
*/
            const prevSnippetField = /*@__PURE__*/ moveField(-1);
            const defaultSnippetKeymap = [
                { key: "Tab", run: nextSnippetField, shift: prevSnippetField },
                { key: "Escape", run: clearSnippet },
            ];
            /**
A facet that can be used to configure the key bindings used by
snippets. The default binds Tab to
[`nextSnippetField`](https://codemirror.net/6/docs/ref/#autocomplete.nextSnippetField), Shift-Tab to
[`prevSnippetField`](https://codemirror.net/6/docs/ref/#autocomplete.prevSnippetField), and Escape
to [`clearSnippet`](https://codemirror.net/6/docs/ref/#autocomplete.clearSnippet).
*/
            const snippetKeymap = /*@__PURE__*/ state_dist /* Facet.define */.r$
                .define({
                    combine(maps) {
                        return maps.length ? maps[0] : defaultSnippetKeymap;
                    },
                });
            const addSnippetKeymap =
                /*@__PURE__*/ state_dist /* Prec.highest */.Wl.highest(
                    /*@__PURE__*/ dist /* keymap.compute */.$f
                        .compute([snippetKeymap], (state) =>
                            state.facet(snippetKeymap)
                        )
                );
            /**
Create a completion from a snippet. Returns an object with the
properties from `completion`, plus an `apply` function that
applies the snippet.
*/
            function snippetCompletion(template, completion) {
                return Object.assign(Object.assign({}, completion), {
                    apply: snippet(template),
                });
            }
            const snippetPointerHandler =
                /*@__PURE__*/ dist /* EditorView.domEventHandlers */.tk
                    .domEventHandlers({
                        mousedown(event, view) {
                            let active = view.state.field(snippetState, false),
                                pos;
                            if (
                                !active ||
                                (pos = view.posAtCoords({
                                    x: event.clientX,
                                    y: event.clientY,
                                })) == null
                            )
                                return false;
                            let match = active.ranges.find(
                                (r) => r.from <= pos && r.to >= pos
                            );
                            if (!match || match.field == active.active)
                                return false;
                            view.dispatch({
                                selection: fieldSelection(
                                    active.ranges,
                                    match.field
                                ),
                                effects: setActive.of(
                                    active.ranges.some(
                                        (r) => r.field > match.field
                                    )
                                        ? new ActiveSnippet(
                                              active.ranges,
                                              match.field
                                          )
                                        : null
                                ),
                            });
                            return true;
                        },
                    });

            function wordRE(wordChars) {
                let escaped = wordChars.replace(/[\\[.+*?(){|^$]/g, "\\$&");
                try {
                    return new RegExp(
                        `[\\p{Alphabetic}\\p{Number}_${escaped}]+`,
                        "ug"
                    );
                } catch (_a) {
                    return new RegExp(`[\w${escaped}]`, "g");
                }
            }
            function mapRE(re, f) {
                return new RegExp(f(re.source), re.unicode ? "u" : "");
            }
            const wordCaches =
                /*@__PURE__*/ /* unused pure expression or super */ null &&
                Object.create(null);
            function wordCache(wordChars) {
                return (
                    wordCaches[wordChars] ||
                    (wordCaches[wordChars] = new WeakMap())
                );
            }
            function storeWords(doc, wordRE, result, seen, ignoreAt) {
                for (
                    let lines = doc.iterLines(), pos = 0;
                    !lines.next().done;

                ) {
                    let { value } = lines,
                        m;
                    wordRE.lastIndex = 0;
                    while ((m = wordRE.exec(value))) {
                        if (!seen[m[0]] && pos + m.index != ignoreAt) {
                            result.push({ type: "text", label: m[0] });
                            seen[m[0]] = true;
                            if (result.length >= 2000 /* MaxList */) return;
                        }
                    }
                    pos += value.length + 1;
                }
            }
            function collectWords(doc, cache, wordRE, to, ignoreAt) {
                let big = doc.length >= 1000; /* MinCacheLen */
                let cached = big && cache.get(doc);
                if (cached) return cached;
                let result = [],
                    seen = Object.create(null);
                if (doc.children) {
                    let pos = 0;
                    for (let ch of doc.children) {
                        if (ch.length >= 1000 /* MinCacheLen */) {
                            for (let c of collectWords(
                                ch,
                                cache,
                                wordRE,
                                to - pos,
                                ignoreAt - pos
                            )) {
                                if (!seen[c.label]) {
                                    seen[c.label] = true;
                                    result.push(c);
                                }
                            }
                        } else {
                            storeWords(
                                ch,
                                wordRE,
                                result,
                                seen,
                                ignoreAt - pos
                            );
                        }
                        pos += ch.length + 1;
                    }
                } else {
                    storeWords(doc, wordRE, result, seen, ignoreAt);
                }
                if (big && result.length < 2000 /* MaxList */)
                    cache.set(doc, result);
                return result;
            }
            /**
A completion source that will scan the document for words (using a
[character categorizer](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer)), and
return those as completions.
*/
            const completeAnyWord = (context) => {
                let wordChars = context.state
                    .languageDataAt("wordChars", context.pos)
                    .join("");
                let re = wordRE(wordChars);
                let token = context.matchBefore(mapRE(re, (s) => s + "$"));
                if (!token && !context.explicit) return null;
                let from = token ? token.from : context.pos;
                let options = collectWords(
                    context.state.doc,
                    wordCache(wordChars),
                    re,
                    50000 /* Range */,
                    from
                );
                return { from, options, validFor: mapRE(re, (s) => "^" + s) };
            };

            const defaults = {
                brackets: ["(", "[", "{", "'", '"'],
                before: ")]}:;>",
            };
            const closeBracketEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define({
                    map(value, mapping) {
                        let mapped = mapping.mapPos(
                            value,
                            -1,
                            state_dist /* MapMode.TrackAfter */.gc.TrackAfter
                        );
                        return mapped == null ? undefined : mapped;
                    },
                });
            const skipBracketEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define({
                    map(value, mapping) {
                        return mapping.mapPos(value);
                    },
                });
            const closedBracket =
                /*@__PURE__*/ new (class extends state_dist /* RangeValue */.uU {})();
            closedBracket.startSide = 1;
            closedBracket.endSide = -1;
            const bracketState =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return state_dist /* RangeSet.empty */.Xs.empty;
                    },
                    update(value, tr) {
                        if (tr.selection) {
                            let lineStart = tr.state.doc.lineAt(
                                tr.selection.main.head
                            ).from;
                            let prevLineStart = tr.startState.doc.lineAt(
                                tr.startState.selection.main.head
                            ).from;
                            if (
                                lineStart !=
                                tr.changes.mapPos(prevLineStart, -1)
                            )
                                value =
                                    state_dist /* RangeSet.empty */.Xs.empty;
                        }
                        value = value.map(tr.changes);
                        for (let effect of tr.effects) {
                            if (effect.is(closeBracketEffect))
                                value = value.update({
                                    add: [
                                        closedBracket.range(
                                            effect.value,
                                            effect.value + 1
                                        ),
                                    ],
                                });
                            else if (effect.is(skipBracketEffect))
                                value = value.update({
                                    filter: (from) => from != effect.value,
                                });
                        }
                        return value;
                    },
                });
            /**
Extension to enable bracket-closing behavior. When a closeable
bracket is typed, its closing bracket is immediately inserted
after the cursor. When closing a bracket directly in front of a
closing bracket inserted by the extension, the cursor moves over
that bracket.
*/
            function closeBrackets() {
                return [inputHandler, bracketState];
            }
            const definedClosing = "()[]{}<>";
            function closing(ch) {
                for (let i = 0; i < definedClosing.length; i += 2)
                    if (definedClosing.charCodeAt(i) == ch)
                        return definedClosing.charAt(i + 1);
                return (0, state_dist /* fromCodePoint */.bg)(
                    ch < 128 ? ch : ch + 1
                );
            }
            function config(state, pos) {
                return (
                    state.languageDataAt("closeBrackets", pos)[0] || defaults
                );
            }
            const android =
                typeof navigator == "object" &&
                /*@__PURE__*/ /Android\b/.test(navigator.userAgent);
            const inputHandler =
                /*@__PURE__*/ dist /* EditorView.inputHandler.of */.tk.inputHandler
                    .of((view, from, to, insert) => {
                        if (
                            (android
                                ? view.composing
                                : view.compositionStarted) ||
                            view.state.readOnly
                        )
                            return false;
                        let sel = view.state.selection.main;
                        if (
                            insert.length > 2 ||
                            (insert.length == 2 &&
                                (0, state_dist /* codePointSize */.nZ)(
                                    (0, state_dist /* codePointAt */.gm)(
                                        insert,
                                        0
                                    )
                                ) == 1) ||
                            from != sel.from ||
                            to != sel.to
                        )
                            return false;
                        let tr = insertBracket(view.state, insert);
                        if (!tr) return false;
                        view.dispatch(tr);
                        return true;
                    });
            /**
Command that implements deleting a pair of matching brackets when
the cursor is between them.
*/
            const deleteBracketPair = ({ state, dispatch }) => {
                if (state.readOnly) return false;
                let conf = config(state, state.selection.main.head);
                let tokens = conf.brackets || defaults.brackets;
                let dont = null,
                    changes = state.changeByRange((range) => {
                        if (range.empty) {
                            let before = prevChar(state.doc, range.head);
                            for (let token of tokens) {
                                if (
                                    token == before &&
                                    nextChar(state.doc, range.head) ==
                                        closing(
                                            (0,
                                            state_dist /* codePointAt */.gm)(
                                                token,
                                                0
                                            )
                                        )
                                )
                                    return {
                                        changes: {
                                            from: range.head - token.length,
                                            to: range.head + token.length,
                                        },
                                        range: state_dist /* EditorSelection.cursor */.jT
                                            .cursor(range.head - token.length),
                                        userEvent: "delete.backward",
                                    };
                            }
                        }
                        return { range: (dont = range) };
                    });
                if (!dont)
                    dispatch(state.update(changes, { scrollIntoView: true }));
                return !dont;
            };
            /**
Close-brackets related key bindings. Binds Backspace to
[`deleteBracketPair`](https://codemirror.net/6/docs/ref/#autocomplete.deleteBracketPair).
*/
            const closeBracketsKeymap = [
                { key: "Backspace", run: deleteBracketPair },
            ];
            /**
Implements the extension's behavior on text insertion. If the
given string counts as a bracket in the language around the
selection, and replacing the selection with it requires custom
behavior (inserting a closing version or skipping past a
previously-closed bracket), this function returns a transaction
representing that custom behavior. (You only need this if you want
to programmatically insert brackets—the
[`closeBrackets`](https://codemirror.net/6/docs/ref/#autocomplete.closeBrackets) extension will
take care of running this for user input.)
*/
            function insertBracket(state, bracket) {
                let conf = config(state, state.selection.main.head);
                let tokens = conf.brackets || defaults.brackets;
                for (let tok of tokens) {
                    let closed = closing(
                        (0, state_dist /* codePointAt */.gm)(tok, 0)
                    );
                    if (bracket == tok)
                        return closed == tok
                            ? handleSame(
                                  state,
                                  tok,
                                  tokens.indexOf(tok + tok + tok) > -1
                              )
                            : handleOpen(
                                  state,
                                  tok,
                                  closed,
                                  conf.before || defaults.before
                              );
                    if (
                        bracket == closed &&
                        closedBracketAt(state, state.selection.main.from)
                    )
                        return handleClose(state, tok, closed);
                }
                return null;
            }
            function closedBracketAt(state, pos) {
                let found = false;
                state
                    .field(bracketState)
                    .between(0, state.doc.length, (from) => {
                        if (from == pos) found = true;
                    });
                return found;
            }
            function nextChar(doc, pos) {
                let next = doc.sliceString(pos, pos + 2);
                return next.slice(
                    0,
                    (0, state_dist /* codePointSize */.nZ)(
                        (0, state_dist /* codePointAt */.gm)(next, 0)
                    )
                );
            }
            function prevChar(doc, pos) {
                let prev = doc.sliceString(pos - 2, pos);
                return (0, state_dist /* codePointSize */.nZ)(
                    (0, state_dist /* codePointAt */.gm)(prev, 0)
                ) == prev.length
                    ? prev
                    : prev.slice(1);
            }
            function handleOpen(state, open, close, closeBefore) {
                let dont = null,
                    changes = state.changeByRange((range) => {
                        if (!range.empty)
                            return {
                                changes: [
                                    { insert: open, from: range.from },
                                    { insert: close, from: range.to },
                                ],
                                effects: closeBracketEffect.of(
                                    range.to + open.length
                                ),
                                range: state_dist /* EditorSelection.range */.jT
                                    .range(
                                        range.anchor + open.length,
                                        range.head + open.length
                                    ),
                            };
                        let next = nextChar(state.doc, range.head);
                        if (
                            !next ||
                            /\s/.test(next) ||
                            closeBefore.indexOf(next) > -1
                        )
                            return {
                                changes: {
                                    insert: open + close,
                                    from: range.head,
                                },
                                effects: closeBracketEffect.of(
                                    range.head + open.length
                                ),
                                range: state_dist /* EditorSelection.cursor */.jT
                                    .cursor(range.head + open.length),
                            };
                        return { range: (dont = range) };
                    });
                return dont
                    ? null
                    : state.update(changes, {
                          scrollIntoView: true,
                          userEvent: "input.type",
                      });
            }
            function handleClose(state, _open, close) {
                let dont = null,
                    moved = state.selection.ranges.map((range) => {
                        if (
                            range.empty &&
                            nextChar(state.doc, range.head) == close
                        )
                            return state_dist /* EditorSelection.cursor */.jT
                                .cursor(range.head + close.length);
                        return (dont = range);
                    });
                return dont
                    ? null
                    : state.update({
                          selection: state_dist /* EditorSelection.create */.jT
                              .create(moved, state.selection.mainIndex),
                          scrollIntoView: true,
                          effects: state.selection.ranges.map(({ from }) =>
                              skipBracketEffect.of(from)
                          ),
                      });
            }
            // Handles cases where the open and close token are the same, and
            // possibly triple quotes (as in `"""abc"""`-style quoting).
            function handleSame(state, token, allowTriple) {
                let dont = null,
                    changes = state.changeByRange((range) => {
                        if (!range.empty)
                            return {
                                changes: [
                                    { insert: token, from: range.from },
                                    { insert: token, from: range.to },
                                ],
                                effects: closeBracketEffect.of(
                                    range.to + token.length
                                ),
                                range: state_dist /* EditorSelection.range */.jT
                                    .range(
                                        range.anchor + token.length,
                                        range.head + token.length
                                    ),
                            };
                        let pos = range.head,
                            next = nextChar(state.doc, pos);
                        if (next == token) {
                            if (nodeStart(state, pos)) {
                                return {
                                    changes: {
                                        insert: token + token,
                                        from: pos,
                                    },
                                    effects: closeBracketEffect.of(
                                        pos + token.length
                                    ),
                                    range: state_dist /* EditorSelection.cursor */.jT
                                        .cursor(pos + token.length),
                                };
                            } else if (closedBracketAt(state, pos)) {
                                let isTriple =
                                    allowTriple &&
                                    state.sliceDoc(
                                        pos,
                                        pos + token.length * 3
                                    ) ==
                                        token + token + token;
                                return {
                                    range: state_dist /* EditorSelection.cursor */.jT
                                        .cursor(
                                            pos +
                                                token.length *
                                                    (isTriple ? 3 : 1)
                                        ),
                                    effects: skipBracketEffect.of(pos),
                                };
                            }
                        } else if (
                            allowTriple &&
                            state.sliceDoc(pos - 2 * token.length, pos) ==
                                token + token &&
                            nodeStart(state, pos - 2 * token.length)
                        ) {
                            return {
                                changes: {
                                    insert: token + token + token + token,
                                    from: pos,
                                },
                                effects: closeBracketEffect.of(
                                    pos + token.length
                                ),
                                range: state_dist /* EditorSelection.cursor */.jT
                                    .cursor(pos + token.length),
                            };
                        } else if (
                            state.charCategorizer(pos)(next) !=
                            state_dist /* CharCategory.Word */.D0.Word
                        ) {
                            let prev = state.sliceDoc(pos - 1, pos);
                            if (
                                prev != token &&
                                state.charCategorizer(pos)(prev) !=
                                    state_dist /* CharCategory.Word */.D0
                                        .Word &&
                                !probablyInString(state, pos, token)
                            )
                                return {
                                    changes: {
                                        insert: token + token,
                                        from: pos,
                                    },
                                    effects: closeBracketEffect.of(
                                        pos + token.length
                                    ),
                                    range: state_dist /* EditorSelection.cursor */.jT
                                        .cursor(pos + token.length),
                                };
                        }
                        return { range: (dont = range) };
                    });
                return dont
                    ? null
                    : state.update(changes, {
                          scrollIntoView: true,
                          userEvent: "input.type",
                      });
            }
            function nodeStart(state, pos) {
                let tree = dist_syntaxTree(state).resolveInner(pos + 1);
                return tree.parent && tree.from == pos;
            }
            function probablyInString(state, pos, quoteToken) {
                let node = dist_syntaxTree(state).resolveInner(pos, -1);
                for (let i = 0; i < 5; i++) {
                    if (
                        state.sliceDoc(
                            node.from,
                            node.from + quoteToken.length
                        ) == quoteToken
                    )
                        return true;
                    let parent = node.to == pos && node.parent;
                    if (!parent) break;
                    node = parent;
                }
                return false;
            }

            /**
Returns an extension that enables autocompletion.
*/
            function autocompletion(config = {}) {
                return [
                    completionState,
                    completionConfig.of(config),
                    completionPlugin,
                    completionKeymapExt,
                    autocomplete_dist_baseTheme,
                ];
            }
            /**
Basic keybindings for autocompletion.

 - Ctrl-Space: [`startCompletion`](https://codemirror.net/6/docs/ref/#autocomplete.startCompletion)
 - Escape: [`closeCompletion`](https://codemirror.net/6/docs/ref/#autocomplete.closeCompletion)
 - ArrowDown: [`moveCompletionSelection`](https://codemirror.net/6/docs/ref/#autocomplete.moveCompletionSelection)`(true)`
 - ArrowUp: [`moveCompletionSelection`](https://codemirror.net/6/docs/ref/#autocomplete.moveCompletionSelection)`(false)`
 - PageDown: [`moveCompletionSelection`](https://codemirror.net/6/docs/ref/#autocomplete.moveCompletionSelection)`(true, "page")`
 - PageDown: [`moveCompletionSelection`](https://codemirror.net/6/docs/ref/#autocomplete.moveCompletionSelection)`(true, "page")`
 - Enter: [`acceptCompletion`](https://codemirror.net/6/docs/ref/#autocomplete.acceptCompletion)
*/
            const completionKeymap = [
                { key: "Ctrl-Space", run: startCompletion },
                { key: "Escape", run: closeCompletion },
                {
                    key: "ArrowDown",
                    run: /*@__PURE__*/ moveCompletionSelection(true),
                },
                {
                    key: "ArrowUp",
                    run: /*@__PURE__*/ moveCompletionSelection(false),
                },
                {
                    key: "PageDown",
                    run: /*@__PURE__*/ moveCompletionSelection(true, "page"),
                },
                {
                    key: "PageUp",
                    run: /*@__PURE__*/ moveCompletionSelection(false, "page"),
                },
                { key: "Enter", run: acceptCompletion },
            ];
            const completionKeymapExt =
                /*@__PURE__*/ state_dist /* Prec.highest */.Wl.highest(
                    /*@__PURE__*/ dist /* keymap.computeN */.$f
                        .computeN([completionConfig], (state) =>
                            state.facet(completionConfig).defaultKeymap
                                ? [completionKeymap]
                                : []
                        )
                );
            /**
Get the current completion status. When completions are available,
this will return `"active"`. When completions are pending (in the
process of being queried), this returns `"pending"`. Otherwise, it
returns `null`.
*/
            function completionStatus(state) {
                let cState = state.field(completionState, false);
                return cState &&
                    cState.active.some((a) => a.state == 1 /* Pending */)
                    ? "pending"
                    : cState &&
                      cState.active.some((a) => a.state != 0 /* Inactive */)
                    ? "active"
                    : null;
            }
            const completionArrayCache = /*@__PURE__*/ new WeakMap();
            /**
Returns the available completions as an array.
*/
            function currentCompletions(state) {
                var _a;
                let open =
                    (_a = state.field(completionState, false)) === null ||
                    _a === void 0
                        ? void 0
                        : _a.open;
                if (!open) return [];
                let completions = completionArrayCache.get(open.options);
                if (!completions)
                    completionArrayCache.set(
                        open.options,
                        (completions = open.options.map((o) => o.completion))
                    );
                return completions;
            }
            /**
Return the currently selected completion, if any.
*/
            function selectedCompletion(state) {
                var _a;
                let open =
                    (_a = state.field(completionState, false)) === null ||
                    _a === void 0
                        ? void 0
                        : _a.open;
                return open ? open.options[open.selected].completion : null;
            }
            /**
Returns the currently selected position in the active completion
list, or null if no completions are active.
*/
            function selectedCompletionIndex(state) {
                var _a;
                let open =
                    (_a = state.field(completionState, false)) === null ||
                    _a === void 0
                        ? void 0
                        : _a.open;
                return open ? open.selected : null;
            }
            /**
Create an effect that can be attached to a transaction to change
the currently selected completion.
*/
            function setSelectedCompletion(index) {
                return setSelectedEffect.of(index);
            } // CONCATENATED MODULE: ./node_modules/@codemirror/lint/dist/index.js

            class SelectedDiagnostic {
                constructor(from, to, diagnostic) {
                    this.from = from;
                    this.to = to;
                    this.diagnostic = diagnostic;
                }
            }
            class LintState {
                constructor(diagnostics, panel, selected) {
                    this.diagnostics = diagnostics;
                    this.panel = panel;
                    this.selected = selected;
                }
                static init(diagnostics, panel, state) {
                    // Filter the list of diagnostics for which to create markers
                    let markedDiagnostics = diagnostics;
                    let diagnosticFilter = state.facet(lintConfig).markerFilter;
                    if (diagnosticFilter)
                        markedDiagnostics = diagnosticFilter(markedDiagnostics);
                    let ranges = dist /* Decoration.set */.p
                        .set(
                            markedDiagnostics.map((d) => {
                                // For zero-length ranges or ranges covering only a line break, create a widget
                                return d.from == d.to ||
                                    (d.from == d.to - 1 &&
                                        state.doc.lineAt(d.from).to == d.from)
                                    ? dist /* Decoration.widget */.p
                                          .widget({
                                              widget: new DiagnosticWidget(d),
                                              diagnostic: d,
                                          })
                                          .range(d.from)
                                    : dist /* Decoration.mark */.p
                                          .mark({
                                              attributes: {
                                                  class:
                                                      "cm-lintRange cm-lintRange-" +
                                                      d.severity,
                                              },
                                              diagnostic: d,
                                          })
                                          .range(d.from, d.to);
                            }),
                            true
                        );
                    return new LintState(ranges, panel, findDiagnostic(ranges));
                }
            }
            function findDiagnostic(diagnostics, diagnostic = null, after = 0) {
                let found = null;
                diagnostics.between(after, 1e9, (from, to, { spec }) => {
                    if (diagnostic && spec.diagnostic != diagnostic) return;
                    found = new SelectedDiagnostic(from, to, spec.diagnostic);
                    return false;
                });
                return found;
            }
            function hideTooltip(tr, tooltip) {
                return !!(
                    tr.effects.some((e) => e.is(setDiagnosticsEffect)) ||
                    tr.changes.touchesRange(tooltip.pos)
                );
            }
            function maybeEnableLint(state, effects) {
                return state.field(lintState, false)
                    ? effects
                    : effects.concat(
                          state_dist /* StateEffect.appendConfig.of */.Py.appendConfig
                              .of([
                                  lintState,
                                  dist /* EditorView.decorations.compute */.tk.decorations
                                      .compute([lintState], (state) => {
                                          let { selected, panel } =
                                              state.field(lintState);
                                          return !selected ||
                                              !panel ||
                                              selected.from == selected.to
                                              ? dist /* Decoration.none */.p
                                                    .none
                                              : dist /* Decoration.set */.p
                                                    .set([
                                                        activeMark.range(
                                                            selected.from,
                                                            selected.to
                                                        ),
                                                    ]);
                                      }),
                                  (0, dist /* hoverTooltip */.bF)(lintTooltip, {
                                      hideOn: hideTooltip,
                                  }),
                                  lint_dist_baseTheme,
                              ])
                      );
            }
            /**
Returns a transaction spec which updates the current set of
diagnostics, and enables the lint extension if if wasn't already
active.
*/
            function setDiagnostics(state, diagnostics) {
                return {
                    effects: maybeEnableLint(state, [
                        setDiagnosticsEffect.of(diagnostics),
                    ]),
                };
            }
            /**
The state effect that updates the set of active diagnostics. Can
be useful when writing an extension that needs to track these.
*/
            const setDiagnosticsEffect =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const dist_togglePanel =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const movePanelSelection =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const lintState =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return new LintState(
                            dist /* Decoration.none */.p.none,
                            null,
                            null
                        );
                    },
                    update(value, tr) {
                        if (tr.docChanged) {
                            let mapped = value.diagnostics.map(tr.changes),
                                selected = null;
                            if (value.selected) {
                                let selPos = tr.changes.mapPos(
                                    value.selected.from,
                                    1
                                );
                                selected =
                                    findDiagnostic(
                                        mapped,
                                        value.selected.diagnostic,
                                        selPos
                                    ) || findDiagnostic(mapped, null, selPos);
                            }
                            value = new LintState(
                                mapped,
                                value.panel,
                                selected
                            );
                        }
                        for (let effect of tr.effects) {
                            if (effect.is(setDiagnosticsEffect)) {
                                value = LintState.init(
                                    effect.value,
                                    value.panel,
                                    tr.state
                                );
                            } else if (effect.is(dist_togglePanel)) {
                                value = new LintState(
                                    value.diagnostics,
                                    effect.value ? LintPanel.open : null,
                                    value.selected
                                );
                            } else if (effect.is(movePanelSelection)) {
                                value = new LintState(
                                    value.diagnostics,
                                    value.panel,
                                    effect.value
                                );
                            }
                        }
                        return value;
                    },
                    provide: (f) => [
                        dist /* showPanel.from */.mH
                            .from(f, (val) => val.panel),
                        dist /* EditorView.decorations.from */.tk.decorations
                            .from(f, (s) => s.diagnostics),
                    ],
                });
            /**
Returns the number of active lint diagnostics in the given state.
*/
            function diagnosticCount(state) {
                let lint = state.field(lintState, false);
                return lint ? lint.diagnostics.size : 0;
            }
            const activeMark = /*@__PURE__*/ dist /* Decoration.mark */.p
                .mark({ class: "cm-lintRange cm-lintRange-active" });
            function lintTooltip(view, pos, side) {
                let { diagnostics } = view.state.field(lintState);
                let found = [],
                    stackStart = 2e8,
                    stackEnd = 0;
                diagnostics.between(
                    pos - (side < 0 ? 1 : 0),
                    pos + (side > 0 ? 1 : 0),
                    (from, to, { spec }) => {
                        if (
                            pos >= from &&
                            pos <= to &&
                            (from == to ||
                                ((pos > from || side > 0) &&
                                    (pos < to || side < 0)))
                        ) {
                            found.push(spec.diagnostic);
                            stackStart = Math.min(from, stackStart);
                            stackEnd = Math.max(to, stackEnd);
                        }
                    }
                );
                let diagnosticFilter =
                    view.state.facet(lintConfig).tooltipFilter;
                if (diagnosticFilter) found = diagnosticFilter(found);
                if (!found.length) return null;
                return {
                    pos: stackStart,
                    end: stackEnd,
                    above: view.state.doc.lineAt(stackStart).to < stackEnd,
                    create() {
                        return { dom: diagnosticsTooltip(view, found) };
                    },
                };
            }
            function diagnosticsTooltip(view, diagnostics) {
                return crelt(
                    "ul",
                    { class: "cm-tooltip-lint" },
                    diagnostics.map((d) => renderDiagnostic(view, d, false))
                );
            }
            /**
Command to open and focus the lint panel.
*/
            const openLintPanel = (view) => {
                let field = view.state.field(lintState, false);
                if (!field || !field.panel)
                    view.dispatch({
                        effects: maybeEnableLint(view.state, [
                            dist_togglePanel.of(true),
                        ]),
                    });
                let panel = (0, dist /* getPanel */.Sd)(view, LintPanel.open);
                if (panel) panel.dom.querySelector(".cm-panel-lint ul").focus();
                return true;
            };
            /**
Command to close the lint panel, when open.
*/
            const closeLintPanel = (view) => {
                let field = view.state.field(lintState, false);
                if (!field || !field.panel) return false;
                view.dispatch({ effects: dist_togglePanel.of(false) });
                return true;
            };
            /**
Move the selection to the next diagnostic.
*/
            const nextDiagnostic = (view) => {
                let field = view.state.field(lintState, false);
                if (!field) return false;
                let sel = view.state.selection.main,
                    next = field.diagnostics.iter(sel.to + 1);
                if (!next.value) {
                    next = field.diagnostics.iter(0);
                    if (
                        !next.value ||
                        (next.from == sel.from && next.to == sel.to)
                    )
                        return false;
                }
                view.dispatch({
                    selection: { anchor: next.from, head: next.to },
                    scrollIntoView: true,
                });
                return true;
            };
            /**
A set of default key bindings for the lint functionality.

- Ctrl-Shift-m (Cmd-Shift-m on macOS): [`openLintPanel`](https://codemirror.net/6/docs/ref/#lint.openLintPanel)
- F8: [`nextDiagnostic`](https://codemirror.net/6/docs/ref/#lint.nextDiagnostic)
*/
            const lintKeymap = [
                { key: "Mod-Shift-m", run: openLintPanel },
                { key: "F8", run: nextDiagnostic },
            ];
            const lintPlugin = /*@__PURE__*/ dist /* ViewPlugin.fromClass */.lg
                .fromClass(
                    class {
                        constructor(view) {
                            this.view = view;
                            this.timeout = -1;
                            this.set = true;
                            let { delay } = view.state.facet(lintConfig);
                            this.lintTime = Date.now() + delay;
                            this.run = this.run.bind(this);
                            this.timeout = setTimeout(this.run, delay);
                        }
                        run() {
                            let now = Date.now();
                            if (now < this.lintTime - 10) {
                                setTimeout(this.run, this.lintTime - now);
                            } else {
                                this.set = false;
                                let { state } = this.view,
                                    { sources } = state.facet(lintConfig);
                                Promise.all(
                                    sources.map((source) =>
                                        Promise.resolve(source(this.view))
                                    )
                                ).then(
                                    (annotations) => {
                                        let all = annotations.reduce((a, b) =>
                                            a.concat(b)
                                        );
                                        if (this.view.state.doc == state.doc)
                                            this.view.dispatch(
                                                setDiagnostics(
                                                    this.view.state,
                                                    all
                                                )
                                            );
                                    },
                                    (error) => {
                                        (0, dist /* logException */.OO)(
                                            this.view.state,
                                            error
                                        );
                                    }
                                );
                            }
                        }
                        update(update) {
                            let config = update.state.facet(lintConfig);
                            if (
                                update.docChanged ||
                                config != update.startState.facet(lintConfig)
                            ) {
                                this.lintTime = Date.now() + config.delay;
                                if (!this.set) {
                                    this.set = true;
                                    this.timeout = setTimeout(
                                        this.run,
                                        config.delay
                                    );
                                }
                            }
                        }
                        force() {
                            if (this.set) {
                                this.lintTime = Date.now();
                                this.run();
                            }
                        }
                        destroy() {
                            clearTimeout(this.timeout);
                        }
                    }
                );
            const lintConfig = /*@__PURE__*/ state_dist /* Facet.define */.r$
                .define({
                    combine(input) {
                        return Object.assign(
                            { sources: input.map((i) => i.source) },
                            (0, state_dist /* combineConfig */.BO)(
                                input.map((i) => i.config),
                                {
                                    delay: 750,
                                    markerFilter: null,
                                    tooltipFilter: null,
                                }
                            )
                        );
                    },
                    enables: lintPlugin,
                });
            /**
Given a diagnostic source, this function returns an extension that
enables linting with that source. It will be called whenever the
editor is idle (after its content changed).
*/
            function linter(source, config = {}) {
                return lintConfig.of({ source, config });
            }
            /**
Forces any linters [configured](https://codemirror.net/6/docs/ref/#lint.linter) to run when the
editor is idle to run right away.
*/
            function forceLinting(view) {
                let plugin = view.plugin(lintPlugin);
                if (plugin) plugin.force();
            }
            function assignKeys(actions) {
                let assigned = [];
                if (actions)
                    actions: for (let { name } of actions) {
                        for (let i = 0; i < name.length; i++) {
                            let ch = name[i];
                            if (
                                /[a-zA-Z]/.test(ch) &&
                                !assigned.some(
                                    (c) => c.toLowerCase() == ch.toLowerCase()
                                )
                            ) {
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
                return crelt(
                    "li",
                    {
                        class:
                            "cm-diagnostic cm-diagnostic-" +
                            diagnostic.severity,
                    },
                    crelt(
                        "span",
                        { class: "cm-diagnosticText" },
                        diagnostic.message
                    ),
                    (_a = diagnostic.actions) === null || _a === void 0
                        ? void 0
                        : _a.map((action, i) => {
                              let click = (e) => {
                                  e.preventDefault();
                                  let found = findDiagnostic(
                                      view.state.field(lintState).diagnostics,
                                      diagnostic
                                  );
                                  if (found)
                                      action.apply(view, found.from, found.to);
                              };
                              let { name } = action,
                                  keyIndex = keys[i]
                                      ? name.indexOf(keys[i])
                                      : -1;
                              let nameElt =
                                  keyIndex < 0
                                      ? name
                                      : [
                                            name.slice(0, keyIndex),
                                            crelt(
                                                "u",
                                                name.slice(
                                                    keyIndex,
                                                    keyIndex + 1
                                                )
                                            ),
                                            name.slice(keyIndex + 1),
                                        ];
                              return crelt(
                                  "button",
                                  {
                                      type: "button",
                                      class: "cm-diagnosticAction",
                                      onclick: click,
                                      onmousedown: click,
                                      "aria-label": ` Action: ${name}${
                                          keyIndex < 0
                                              ? ""
                                              : ` (access key "${keys[i]})"`
                                      }.`,
                                  },
                                  nameElt
                              );
                          }),
                    diagnostic.source &&
                        crelt(
                            "div",
                            { class: "cm-diagnosticSource" },
                            diagnostic.source
                        )
                );
            }
            class DiagnosticWidget extends dist /* WidgetType */.l9 {
                constructor(diagnostic) {
                    super();
                    this.diagnostic = diagnostic;
                }
                eq(other) {
                    return other.diagnostic == this.diagnostic;
                }
                toDOM() {
                    return crelt("span", {
                        class:
                            "cm-lintPoint cm-lintPoint-" +
                            this.diagnostic.severity,
                    });
                }
            }
            class PanelItem {
                constructor(view, diagnostic) {
                    this.diagnostic = diagnostic;
                    this.id =
                        "item_" +
                        Math.floor(Math.random() * 0xffffffff).toString(16);
                    this.dom = renderDiagnostic(view, diagnostic, true);
                    this.dom.id = this.id;
                    this.dom.setAttribute("role", "option");
                }
            }
            class LintPanel {
                constructor(view) {
                    this.view = view;
                    this.items = [];
                    let onkeydown = (event) => {
                        if (event.keyCode == 27) {
                            // Escape
                            closeLintPanel(this.view);
                            this.view.focus();
                        } else if (event.keyCode == 38 || event.keyCode == 33) {
                            // ArrowUp, PageUp
                            this.moveSelection(
                                (this.selectedIndex - 1 + this.items.length) %
                                    this.items.length
                            );
                        } else if (event.keyCode == 40 || event.keyCode == 34) {
                            // ArrowDown, PageDown
                            this.moveSelection(
                                (this.selectedIndex + 1) % this.items.length
                            );
                        } else if (event.keyCode == 36) {
                            // Home
                            this.moveSelection(0);
                        } else if (event.keyCode == 35) {
                            // End
                            this.moveSelection(this.items.length - 1);
                        } else if (event.keyCode == 13) {
                            // Enter
                            this.view.focus();
                        } else if (
                            event.keyCode >= 65 &&
                            event.keyCode <= 90 &&
                            this.selectedIndex >= 0
                        ) {
                            // A-Z
                            let { diagnostic } = this.items[this.selectedIndex],
                                keys = assignKeys(diagnostic.actions);
                            for (let i = 0; i < keys.length; i++)
                                if (
                                    keys[i].toUpperCase().charCodeAt(0) ==
                                    event.keyCode
                                ) {
                                    let found = findDiagnostic(
                                        this.view.state.field(lintState)
                                            .diagnostics,
                                        diagnostic
                                    );
                                    if (found)
                                        diagnostic.actions[i].apply(
                                            view,
                                            found.from,
                                            found.to
                                        );
                                }
                        } else {
                            return;
                        }
                        event.preventDefault();
                    };
                    let onclick = (event) => {
                        for (let i = 0; i < this.items.length; i++) {
                            if (this.items[i].dom.contains(event.target))
                                this.moveSelection(i);
                        }
                    };
                    this.list = crelt("ul", {
                        tabIndex: 0,
                        role: "listbox",
                        "aria-label": this.view.state.phrase("Diagnostics"),
                        onkeydown,
                        onclick,
                    });
                    this.dom = crelt(
                        "div",
                        { class: "cm-panel-lint" },
                        this.list,
                        crelt(
                            "button",
                            {
                                type: "button",
                                name: "close",
                                "aria-label": this.view.state.phrase("close"),
                                onclick: () => closeLintPanel(this.view),
                            },
                            "×"
                        )
                    );
                    this.update();
                }
                get selectedIndex() {
                    let selected = this.view.state.field(lintState).selected;
                    if (!selected) return -1;
                    for (let i = 0; i < this.items.length; i++)
                        if (this.items[i].diagnostic == selected.diagnostic)
                            return i;
                    return -1;
                }
                update() {
                    let { diagnostics, selected } =
                        this.view.state.field(lintState);
                    let i = 0,
                        needsSync = false,
                        newSelectedItem = null;
                    diagnostics.between(
                        0,
                        this.view.state.doc.length,
                        (_start, _end, { spec }) => {
                            let found = -1,
                                item;
                            for (let j = i; j < this.items.length; j++)
                                if (
                                    this.items[j].diagnostic == spec.diagnostic
                                ) {
                                    found = j;
                                    break;
                                }
                            if (found < 0) {
                                item = new PanelItem(
                                    this.view,
                                    spec.diagnostic
                                );
                                this.items.splice(i, 0, item);
                                needsSync = true;
                            } else {
                                item = this.items[found];
                                if (found > i) {
                                    this.items.splice(i, found - i);
                                    needsSync = true;
                                }
                            }
                            if (
                                selected &&
                                item.diagnostic == selected.diagnostic
                            ) {
                                if (!item.dom.hasAttribute("aria-selected")) {
                                    item.dom.setAttribute(
                                        "aria-selected",
                                        "true"
                                    );
                                    newSelectedItem = item;
                                }
                            } else if (item.dom.hasAttribute("aria-selected")) {
                                item.dom.removeAttribute("aria-selected");
                            }
                            i++;
                        }
                    );
                    while (
                        i < this.items.length &&
                        !(
                            this.items.length == 1 &&
                            this.items[0].diagnostic.from < 0
                        )
                    ) {
                        needsSync = true;
                        this.items.pop();
                    }
                    if (this.items.length == 0) {
                        this.items.push(
                            new PanelItem(this.view, {
                                from: -1,
                                to: -1,
                                severity: "info",
                                message:
                                    this.view.state.phrase("No diagnostics"),
                            })
                        );
                        needsSync = true;
                    }
                    if (newSelectedItem) {
                        this.list.setAttribute(
                            "aria-activedescendant",
                            newSelectedItem.id
                        );
                        this.view.requestMeasure({
                            key: this,
                            read: () => ({
                                sel: newSelectedItem.dom.getBoundingClientRect(),
                                panel: this.list.getBoundingClientRect(),
                            }),
                            write: ({ sel, panel }) => {
                                if (sel.top < panel.top)
                                    this.list.scrollTop -= panel.top - sel.top;
                                else if (sel.bottom > panel.bottom)
                                    this.list.scrollTop +=
                                        sel.bottom - panel.bottom;
                            },
                        });
                    } else if (this.selectedIndex < 0) {
                        this.list.removeAttribute("aria-activedescendant");
                    }
                    if (needsSync) this.sync();
                }
                sync() {
                    let domPos = this.list.firstChild;
                    function rm() {
                        let prev = domPos;
                        domPos = prev.nextSibling;
                        prev.remove();
                    }
                    for (let item of this.items) {
                        if (item.dom.parentNode == this.list) {
                            while (domPos != item.dom) rm();
                            domPos = item.dom.nextSibling;
                        } else {
                            this.list.insertBefore(item.dom, domPos);
                        }
                    }
                    while (domPos) rm();
                }
                moveSelection(selectedIndex) {
                    if (this.selectedIndex < 0) return;
                    let field = this.view.state.field(lintState);
                    let selection = findDiagnostic(
                        field.diagnostics,
                        this.items[selectedIndex].diagnostic
                    );
                    if (!selection) return;
                    this.view.dispatch({
                        selection: {
                            anchor: selection.from,
                            head: selection.to,
                        },
                        scrollIntoView: true,
                        effects: movePanelSelection.of(selection),
                    });
                }
                static open(view) {
                    return new LintPanel(view);
                }
            }
            function svg(content, attrs = `viewBox="0 0 40 40"`) {
                return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${encodeURIComponent(
                    content
                )}</svg>')`;
            }
            function underline(color) {
                return svg(
                    `<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${color}" fill="none" stroke-width=".7"/>`,
                    `width="6" height="3"`
                );
            }
            const lint_dist_baseTheme =
                /*@__PURE__*/ dist /* EditorView.baseTheme */.tk
                    .baseTheme({
                        ".cm-diagnostic": {
                            padding: "3px 6px 3px 8px",
                            marginLeft: "-1px",
                            display: "block",
                            whiteSpace: "pre-wrap",
                        },
                        ".cm-diagnostic-error": {
                            borderLeft: "5px solid #d11",
                        },
                        ".cm-diagnostic-warning": {
                            borderLeft: "5px solid orange",
                        },
                        ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
                        ".cm-diagnosticAction": {
                            font: "inherit",
                            border: "none",
                            padding: "2px 4px",
                            backgroundColor: "#444",
                            color: "white",
                            borderRadius: "3px",
                            marginLeft: "8px",
                        },
                        ".cm-diagnosticSource": {
                            fontSize: "70%",
                            opacity: 0.7,
                        },
                        ".cm-lintRange": {
                            backgroundPosition: "left bottom",
                            backgroundRepeat: "repeat-x",
                            paddingBottom: "0.7px",
                        },
                        ".cm-lintRange-error": {
                            backgroundImage: /*@__PURE__*/ underline("#d11"),
                        },
                        ".cm-lintRange-warning": {
                            backgroundImage: /*@__PURE__*/ underline("orange"),
                        },
                        ".cm-lintRange-info": {
                            backgroundImage: /*@__PURE__*/ underline("#999"),
                        },
                        ".cm-lintRange-active": {
                            backgroundColor: "#ffdd9980",
                        },
                        ".cm-tooltip-lint": {
                            padding: 0,
                            margin: 0,
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
                                borderBottom: "4px solid #d11",
                            },
                        },
                        ".cm-lintPoint-warning": {
                            "&:after": { borderBottomColor: "orange" },
                        },
                        ".cm-lintPoint-info": {
                            "&:after": { borderBottomColor: "#999" },
                        },
                        ".cm-panel.cm-panel-lint": {
                            position: "relative",
                            "& ul": {
                                maxHeight: "100px",
                                overflowY: "auto",
                                "& [aria-selected]": {
                                    backgroundColor: "#ddd",
                                    "& u": { textDecoration: "underline" },
                                },
                                "&:focus [aria-selected]": {
                                    background_fallback: "#bdf",
                                    backgroundColor: "Highlight",
                                    color_fallback: "white",
                                    color: "HighlightText",
                                },
                                "& u": { textDecoration: "none" },
                                padding: 0,
                                margin: 0,
                            },
                            "& [name=close]": {
                                position: "absolute",
                                top: "0",
                                right: "2px",
                                background: "inherit",
                                border: "none",
                                font: "inherit",
                                padding: 0,
                                margin: 0,
                            },
                        },
                    });
            class LintGutterMarker extends dist /* GutterMarker */.SJ {
                constructor(diagnostics) {
                    super();
                    this.diagnostics = diagnostics;
                    this.severity = diagnostics.reduce((max, d) => {
                        let s = d.severity;
                        return s == "error" || (s == "warning" && max == "info")
                            ? s
                            : max;
                    }, "info");
                }
                toDOM(view) {
                    let elt = document.createElement("div");
                    elt.className =
                        "cm-lint-marker cm-lint-marker-" + this.severity;
                    let diagnostics = this.diagnostics;
                    let diagnosticsFilter =
                        view.state.facet(lintGutterConfig).tooltipFilter;
                    if (diagnosticsFilter)
                        diagnostics = diagnosticsFilter(diagnostics);
                    if (diagnostics.length)
                        elt.onmouseover = () =>
                            gutterMarkerMouseOver(view, elt, diagnostics);
                    return elt;
                }
            }
            function trackHoverOn(view, marker) {
                let mousemove = (event) => {
                    let rect = marker.getBoundingClientRect();
                    if (
                        event.clientX > rect.left - 10 /* Margin */ &&
                        event.clientX < rect.right + 10 /* Margin */ &&
                        event.clientY > rect.top - 10 /* Margin */ &&
                        event.clientY < rect.bottom + 10 /* Margin */
                    )
                        return;
                    for (
                        let target = event.target;
                        target;
                        target = target.parentNode
                    ) {
                        if (
                            target.nodeType == 1 &&
                            target.classList.contains("cm-tooltip-lint")
                        )
                            return;
                    }
                    window.removeEventListener("mousemove", mousemove);
                    if (view.state.field(lintGutterTooltip))
                        view.dispatch({
                            effects: setLintGutterTooltip.of(null),
                        });
                };
                window.addEventListener("mousemove", mousemove);
            }
            function gutterMarkerMouseOver(view, marker, diagnostics) {
                function hovered() {
                    let line = view.elementAtHeight(
                        marker.getBoundingClientRect().top +
                            5 -
                            view.documentTop
                    );
                    const linePos = view.coordsAtPos(line.from);
                    if (linePos) {
                        view.dispatch({
                            effects: setLintGutterTooltip.of({
                                pos: line.from,
                                above: false,
                                create() {
                                    return {
                                        dom: diagnosticsTooltip(
                                            view,
                                            diagnostics
                                        ),
                                        getCoords: () =>
                                            marker.getBoundingClientRect(),
                                    };
                                },
                            }),
                        });
                    }
                    marker.onmouseout = marker.onmousemove = null;
                    trackHoverOn(view, marker);
                }
                let { hoverTime } = view.state.facet(lintGutterConfig);
                let hoverTimeout = setTimeout(hovered, hoverTime);
                marker.onmouseout = () => {
                    clearTimeout(hoverTimeout);
                    marker.onmouseout = marker.onmousemove = null;
                };
                marker.onmousemove = () => {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = setTimeout(hovered, hoverTime);
                };
            }
            function markersForDiagnostics(doc, diagnostics) {
                let byLine = Object.create(null);
                for (let diagnostic of diagnostics) {
                    let line = doc.lineAt(diagnostic.from);
                    (byLine[line.from] || (byLine[line.from] = [])).push(
                        diagnostic
                    );
                }
                let markers = [];
                for (let line in byLine) {
                    markers.push(
                        new LintGutterMarker(byLine[line]).range(+line)
                    );
                }
                return state_dist /* RangeSet.of */.Xs.of(markers, true);
            }
            const lintGutterExtension = /*@__PURE__*/ (0, dist /* gutter */.v5)(
                {
                    class: "cm-gutter-lint",
                    markers: (view) => view.state.field(lintGutterMarkers),
                }
            );
            const lintGutterMarkers =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return state_dist /* RangeSet.empty */.Xs.empty;
                    },
                    update(markers, tr) {
                        markers = markers.map(tr.changes);
                        let diagnosticFilter =
                            tr.state.facet(lintGutterConfig).markerFilter;
                        for (let effect of tr.effects) {
                            if (effect.is(setDiagnosticsEffect)) {
                                let diagnostics = effect.value;
                                if (diagnosticFilter)
                                    diagnostics = diagnosticFilter(
                                        diagnostics || []
                                    );
                                markers = markersForDiagnostics(
                                    tr.state.doc,
                                    diagnostics.slice(0)
                                );
                            }
                        }
                        return markers;
                    },
                });
            const setLintGutterTooltip =
                /*@__PURE__*/ state_dist /* StateEffect.define */.Py.define();
            const lintGutterTooltip =
                /*@__PURE__*/ state_dist /* StateField.define */.QQ.define({
                    create() {
                        return null;
                    },
                    update(tooltip, tr) {
                        if (tooltip && tr.docChanged)
                            tooltip = hideTooltip(tr, tooltip)
                                ? null
                                : Object.assign(Object.assign({}, tooltip), {
                                      pos: tr.changes.mapPos(tooltip.pos),
                                  });
                        return tr.effects.reduce(
                            (t, e) =>
                                e.is(setLintGutterTooltip) ? e.value : t,
                            tooltip
                        );
                    },
                    provide: (field) =>
                        dist /* showTooltip.from */.hJ
                            .from(field),
                });
            const lintGutterTheme =
                /*@__PURE__*/ dist /* EditorView.baseTheme */.tk
                    .baseTheme({
                        ".cm-gutter-lint": {
                            width: "1.4em",
                            "& .cm-gutterElement": {
                                padding: ".2em",
                            },
                        },
                        ".cm-lint-marker": {
                            width: "1em",
                            height: "1em",
                        },
                        ".cm-lint-marker-info": {
                            content: /*@__PURE__*/ svg(
                                `<path fill="#aaf" stroke="#77e" stroke-width="6" stroke-linejoin="round" d="M5 5L35 5L35 35L5 35Z"/>`
                            ),
                        },
                        ".cm-lint-marker-warning": {
                            content: /*@__PURE__*/ svg(
                                `<path fill="#fe8" stroke="#fd7" stroke-width="6" stroke-linejoin="round" d="M20 6L37 35L3 35Z"/>`
                            ),
                        },
                        ".cm-lint-marker-error:before": {
                            content: /*@__PURE__*/ svg(
                                `<circle cx="20" cy="20" r="15" fill="#f87" stroke="#f43" stroke-width="6"/>`
                            ),
                        },
                    });
            const lintGutterConfig =
                /*@__PURE__*/ state_dist /* Facet.define */.r$
                    .define({
                        combine(configs) {
                            return (0, state_dist /* combineConfig */.BO)(
                                configs,
                                {
                                    hoverTime: 300 /* Time */,
                                    markerFilter: null,
                                    tooltipFilter: null,
                                }
                            );
                        },
                    });
            /**
Returns an extension that installs a gutter showing markers for
each line that has diagnostics, which can be hovered over to see
the diagnostics.
*/
            function lintGutter(config = {}) {
                return [
                    lintGutterConfig.of(config),
                    lintGutterMarkers,
                    lintGutterExtension,
                    lintGutterTheme,
                    lintGutterTooltip,
                ];
            } // CONCATENATED MODULE: ./node_modules/@codemirror/basic-setup/dist/index.js

            /**
This is an extension value that just pulls together a number of
extensions that you might want in a basic editor. It is meant as a
convenient helper to quickly set up CodeMirror without installing
and importing a lot of separate packages.

Specifically, it includes...

 - [the default command bindings](https://codemirror.net/6/docs/ref/#commands.defaultKeymap)
 - [line numbers](https://codemirror.net/6/docs/ref/#view.lineNumbers)
 - [special character highlighting](https://codemirror.net/6/docs/ref/#view.highlightSpecialChars)
 - [the undo history](https://codemirror.net/6/docs/ref/#commands.history)
 - [a fold gutter](https://codemirror.net/6/docs/ref/#language.foldGutter)
 - [custom selection drawing](https://codemirror.net/6/docs/ref/#view.drawSelection)
 - [drop cursor](https://codemirror.net/6/docs/ref/#view.dropCursor)
 - [multiple selections](https://codemirror.net/6/docs/ref/#state.EditorState^allowMultipleSelections)
 - [reindentation on input](https://codemirror.net/6/docs/ref/#language.indentOnInput)
 - [the default highlight style](https://codemirror.net/6/docs/ref/#language.defaultHighlightStyle) (as fallback)
 - [bracket matching](https://codemirror.net/6/docs/ref/#language.bracketMatching)
 - [bracket closing](https://codemirror.net/6/docs/ref/#autocomplete.closeBrackets)
 - [autocompletion](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion)
 - [rectangular selection](https://codemirror.net/6/docs/ref/#view.rectangularSelection) and [crosshair cursor](https://codemirror.net/6/docs/ref/#view.crosshairCursor)
 - [active line highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLine)
 - [active line gutter highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLineGutter)
 - [selection match highlighting](https://codemirror.net/6/docs/ref/#search.highlightSelectionMatches)
 - [search](https://codemirror.net/6/docs/ref/#search.searchKeymap)
 - [linting](https://codemirror.net/6/docs/ref/#lint.lintKeymap)

(You'll probably want to add some language package to your setup
too.)

This package does not allow customization. The idea is that, once
you decide you want to configure your editor more precisely, you
take this package's source (which is just a bunch of imports and
an array literal), copy it into your own code, and adjust it as
desired.
*/
            const basicSetup = [
                /*@__PURE__*/ (0, dist /* lineNumbers */.Eu)(),
                /*@__PURE__*/ (0, dist /* highlightActiveLineGutter */.HQ)(),
                /*@__PURE__*/ (0, dist /* highlightSpecialChars */.AE)(),
                /*@__PURE__*/ dist_history(),
                /*@__PURE__*/ foldGutter(),
                /*@__PURE__*/ (0, dist /* drawSelection */.Uw)(),
                /*@__PURE__*/ (0, dist /* dropCursor */.qr)(),
                /*@__PURE__*/ state_dist /* EditorState.allowMultipleSelections.of */.yy.allowMultipleSelections
                    .of(true),
                /*@__PURE__*/ indentOnInput(),
                /*@__PURE__*/ syntaxHighlighting(defaultHighlightStyle, {
                    fallback: true,
                }),
                /*@__PURE__*/ bracketMatching(),
                /*@__PURE__*/ closeBrackets(),
                /*@__PURE__*/ autocompletion(),
                /*@__PURE__*/ (0, dist /* rectangularSelection */.Zs)(),
                /*@__PURE__*/ (0, dist /* crosshairCursor */.S2)(),
                /*@__PURE__*/ (0, dist /* highlightActiveLine */.ZO)(),
                /*@__PURE__*/ highlightSelectionMatches(),
                /*@__PURE__*/ dist /* keymap.of */.$f
                    .of([
                        ...closeBracketsKeymap,
                        ...defaultKeymap,
                        ...searchKeymap,
                        ...historyKeymap,
                        ...foldKeymap,
                        ...completionKeymap,
                        ...lintKeymap,
                    ]),
            ]; // CONCATENATED MODULE: ./node_modules/@codemirror/theme-one-dark/dist/index.js

            // Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors
            const chalky = "#e5c07b",
                coral = "#e06c75",
                cyan = "#56b6c2",
                invalid = "#ffffff",
                ivory = "#abb2bf",
                stone = "#7d8799", // Brightened compared to original to increase contrast
                malibu = "#61afef",
                sage = "#98c379",
                whiskey = "#d19a66",
                violet = "#c678dd",
                darkBackground = "#21252b",
                highlightBackground = "#2c313a",
                background = "#282c34",
                tooltipBackground = "#353a42",
                selection = "#3E4451",
                cursor = "#528bff";
            /**
The editor theme styles for One Dark.
*/
            const oneDarkTheme = /*@__PURE__*/ dist /* EditorView.theme */.tk
                .theme(
                    {
                        "&": {
                            color: ivory,
                            backgroundColor: background,
                        },
                        ".cm-content": {
                            caretColor: cursor,
                        },
                        ".cm-cursor, .cm-dropCursor": {
                            borderLeftColor: cursor,
                        },
                        "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
                            { backgroundColor: selection },
                        ".cm-panels": {
                            backgroundColor: darkBackground,
                            color: ivory,
                        },
                        ".cm-panels.cm-panels-top": {
                            borderBottom: "2px solid black",
                        },
                        ".cm-panels.cm-panels-bottom": {
                            borderTop: "2px solid black",
                        },
                        ".cm-searchMatch": {
                            backgroundColor: "#72a1ff59",
                            outline: "1px solid #457dff",
                        },
                        ".cm-searchMatch.cm-searchMatch-selected": {
                            backgroundColor: "#6199ff2f",
                        },
                        ".cm-activeLine": {
                            backgroundColor: highlightBackground,
                        },
                        ".cm-selectionMatch": { backgroundColor: "#aafe661a" },
                        "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":
                            {
                                backgroundColor: "#bad0f847",
                                outline: "1px solid #515a6b",
                            },
                        ".cm-gutters": {
                            backgroundColor: background,
                            color: stone,
                            border: "none",
                        },
                        ".cm-activeLineGutter": {
                            backgroundColor: highlightBackground,
                        },
                        ".cm-foldPlaceholder": {
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#ddd",
                        },
                        ".cm-tooltip": {
                            border: "none",
                            backgroundColor: tooltipBackground,
                        },
                        ".cm-tooltip .cm-tooltip-arrow:before": {
                            borderTopColor: "transparent",
                            borderBottomColor: "transparent",
                        },
                        ".cm-tooltip .cm-tooltip-arrow:after": {
                            borderTopColor: tooltipBackground,
                            borderBottomColor: tooltipBackground,
                        },
                        ".cm-tooltip-autocomplete": {
                            "& > ul > li[aria-selected]": {
                                backgroundColor: highlightBackground,
                                color: ivory,
                            },
                        },
                    },
                    { dark: true }
                );
            /**
The highlighting style for code in the One Dark theme.
*/
            const oneDarkHighlightStyle = /*@__PURE__*/ HighlightStyle.define([
                { tag: tags.keyword, color: violet },
                {
                    tag: [
                        tags.name,
                        tags.deleted,
                        tags.character,
                        tags.propertyName,
                        tags.macroName,
                    ],
                    color: coral,
                },
                {
                    tag: [
                        /*@__PURE__*/ tags["function"](tags.variableName),
                        tags.labelName,
                    ],
                    color: malibu,
                },
                {
                    tag: [
                        tags.color,
                        /*@__PURE__*/ tags.constant(tags.name),
                        /*@__PURE__*/ tags.standard(tags.name),
                    ],
                    color: whiskey,
                },
                {
                    tag: [
                        /*@__PURE__*/ tags.definition(tags.name),
                        tags.separator,
                    ],
                    color: ivory,
                },
                {
                    tag: [
                        tags.typeName,
                        tags.className,
                        tags.number,
                        tags.changed,
                        tags.annotation,
                        tags.modifier,
                        tags.self,
                        tags.namespace,
                    ],
                    color: chalky,
                },
                {
                    tag: [
                        tags.operator,
                        tags.operatorKeyword,
                        tags.url,
                        tags.escape,
                        tags.regexp,
                        tags.link,
                        /*@__PURE__*/ tags.special(tags.string),
                    ],
                    color: cyan,
                },
                { tag: [tags.meta, tags.comment], color: stone },
                { tag: tags.strong, fontWeight: "bold" },
                { tag: tags.emphasis, fontStyle: "italic" },
                { tag: tags.strikethrough, textDecoration: "line-through" },
                { tag: tags.link, color: stone, textDecoration: "underline" },
                { tag: tags.heading, fontWeight: "bold", color: coral },
                {
                    tag: [
                        tags.atom,
                        tags.bool,
                        /*@__PURE__*/ tags.special(tags.variableName),
                    ],
                    color: whiskey,
                },
                {
                    tag: [
                        tags.processingInstruction,
                        tags.string,
                        tags.inserted,
                    ],
                    color: sage,
                },
                { tag: tags.invalid, color: invalid },
            ]);
            /**
Extension to enable the One Dark theme (both the editor theme and
the highlight style).
*/
            const oneDark = [
                oneDarkTheme,
                /*@__PURE__*/ syntaxHighlighting(oneDarkHighlightStyle),
            ]; // CONCATENATED MODULE: ./node_modules/@uiw/react-codemirror/esm/theme/light.js

            var defaultLightThemeOption = dist /* EditorView.theme */.tk
                .theme(
                    {
                        "&": {
                            backgroundColor: "#fff",
                        },
                    },
                    {
                        dark: false,
                    }
                ); // CONCATENATED MODULE: ./node_modules/@uiw/react-codemirror/esm/useCodeMirror.js
            //# sourceMappingURL=light.js.map
            function useCodeMirror(props) {
                var {
                    value,
                    selection,
                    onChange,
                    onUpdate,
                    extensions = [],
                    autoFocus,
                    theme = "light",
                    height = "",
                    minHeight = "",
                    maxHeight = "",
                    placeholder: placeholderStr = "",
                    width = "",
                    minWidth = "",
                    maxWidth = "",
                    editable = true,
                    readOnly = false,
                    indentWithTab: defaultIndentWithTab = true,
                    basicSetup: defaultBasicSetup = true,
                    root,
                } = props;
                var [container, setContainer] = (0, react.useState)(
                    props.container
                );
                var [view, setView] = (0, react.useState)();
                var [state, setState] = (0, react.useState)();
                var defaultThemeOption = dist /* EditorView.theme */.tk
                    .theme({
                        "&": {
                            height,
                            minHeight,
                            maxHeight,
                            width,
                            minWidth,
                            maxWidth,
                        },
                    });
                var updateListener =
                    dist /* EditorView.updateListener.of */.tk.updateListener
                        .of((vu) => {
                            if (
                                vu.docChanged &&
                                typeof onChange === "function"
                            ) {
                                var doc = vu.state.doc;

                                var _value = doc.toString();

                                onChange(_value, vu);
                            }
                        });
                var getExtensions = [updateListener, defaultThemeOption];

                if (defaultIndentWithTab) {
                    getExtensions.unshift(
                        dist /* keymap.of */.$f
                            .of([indentWithTab])
                    );
                }

                if (defaultBasicSetup) {
                    getExtensions.unshift(basicSetup);
                }

                if (placeholderStr) {
                    getExtensions.unshift(
                        (0, dist /* placeholder */.W$)(placeholderStr)
                    );
                }

                switch (theme) {
                    case "light":
                        getExtensions.push(defaultLightThemeOption);
                        break;

                    case "dark":
                        getExtensions.push(oneDark);
                        break;

                    default:
                        getExtensions.push(theme);
                        break;
                }

                if (editable === false) {
                    getExtensions.push(
                        dist /* EditorView.editable.of */.tk.editable
                            .of(false)
                    );
                }

                if (readOnly) {
                    getExtensions.push(
                        state_dist /* EditorState.readOnly.of */.yy.readOnly
                            .of(true)
                    );
                }

                if (onUpdate && typeof onUpdate === "function") {
                    getExtensions.push(
                        dist /* EditorView.updateListener.of */.tk.updateListener
                            .of(onUpdate)
                    );
                }

                getExtensions = getExtensions.concat(extensions);
                (0, react.useEffect)(() => {
                    if (container && !state) {
                        var stateCurrent =
                            state_dist /* EditorState.create */.yy
                                .create({
                                    doc: value,
                                    selection,
                                    extensions: getExtensions,
                                });
                        setState(stateCurrent);

                        if (!view) {
                            var viewCurrent = new dist /* EditorView */.tk({
                                state: stateCurrent,
                                parent: container,
                                root,
                            });
                            setView(viewCurrent);
                        }
                    }

                    return () => {
                        if (view) {
                            setView(undefined);
                        }
                    }; // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [container, state]);
                (0, react.useEffect)(
                    () => () => {
                        if (view) {
                            view.destroy();
                            setView(undefined);
                        }
                    },
                    [view]
                );
                (0, react.useEffect)(() => {
                    if (autoFocus && view) {
                        view.focus();
                    }
                }, [autoFocus, view]);
                (0, react.useEffect)(() => {
                    var currentValue = view ? view.state.doc.toString() : "";

                    if (view && value !== currentValue) {
                        view.dispatch({
                            changes: {
                                from: 0,
                                to: currentValue.length,
                                insert: value || "",
                            },
                        });
                    }
                }, [value, view]);
                (0, react.useEffect)(() => {
                    if (view) {
                        view.dispatch({
                            effects:
                                state_dist /* StateEffect.reconfigure.of */.Py.reconfigure
                                    .of(getExtensions),
                        });
                    } // eslint-disable-next-line react-hooks/exhaustive-deps
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
                ]);
                return {
                    state,
                    setState,
                    view,
                    setView,
                    container,
                    setContainer,
                };
            }
            //# sourceMappingURL=useCodeMirror.js.map
            // EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
            var jsx_runtime = __webpack_require__(5893); // CONCATENATED MODULE: ./node_modules/@uiw/react-codemirror/esm/index.js
            var _excluded = [
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
            ];

            var ReactCodeMirror = /*#__PURE__*/ react.forwardRef(
                (props, ref) => {
                    var {
                            className,
                            value = "",
                            selection,
                            extensions = [],
                            onChange,
                            onUpdate,
                            autoFocus,
                            theme = "light",
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
                            root,
                        } = props,
                        other = _objectWithoutPropertiesLoose(props, _excluded);

                    var editor = (0, react.useRef)(null);
                    var { state, view, container, setContainer } =
                        useCodeMirror({
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
                            extensions,
                        });
                    (0, react.useImperativeHandle)(
                        ref,
                        () => ({
                            editor: container,
                            state,
                            view,
                        }),
                        [container, state, view]
                    );
                    (0, react.useEffect)(() => {
                        setContainer(editor.current); // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, []); // check type of value

                    if (typeof value !== "string") {
                        throw new Error(
                            "value must be typeof string but got " +
                                typeof value
                        );
                    }

                    var defaultClassNames =
                        typeof theme === "string"
                            ? "cm-theme-" + theme
                            : "cm-theme";
                    return /*#__PURE__*/ (0, jsx_runtime.jsx)(
                        "div",
                        _extends(
                            {
                                ref: editor,
                                className:
                                    "" +
                                    defaultClassNames +
                                    (className ? " " + className : ""),
                            },
                            other
                        )
                    );
                }
            );
            ReactCodeMirror.displayName = "CodeMirror";
            /* harmony default export */ var esm = ReactCodeMirror;
            //# sourceMappingURL=index.js.map

            /***/
        },

        /***/ 8120: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ BO: function () {
                    return /* binding */ combineConfig;
                },
                /* harmony export */ D0: function () {
                    return /* binding */ CharCategory;
                },
                /* harmony export */ Gz: function () {
                    return /* binding */ findColumn;
                },
                /* harmony export */ IS: function () {
                    return /* binding */ countColumn;
                },
                /* harmony export */ Py: function () {
                    return /* binding */ StateEffect;
                },
                /* harmony export */ QQ: function () {
                    return /* binding */ StateField;
                },
                /* harmony export */ Wl: function () {
                    return /* binding */ Prec;
                },
                /* harmony export */ Xs: function () {
                    return /* binding */ RangeSet;
                },
                /* harmony export */ YW: function () {
                    return /* binding */ Transaction;
                },
                /* harmony export */ as: function () {
                    return /* binding */ ChangeSet;
                },
                /* harmony export */ bg: function () {
                    return /* binding */ fromCodePoint;
                },
                /* harmony export */ cp: function () {
                    return /* binding */ findClusterBreak;
                },
                /* harmony export */ f_: function () {
                    return /* binding */ RangeSetBuilder;
                },
                /* harmony export */ gc: function () {
                    return /* binding */ MapMode;
                },
                /* harmony export */ gm: function () {
                    return /* binding */ codePointAt;
                },
                /* harmony export */ jT: function () {
                    return /* binding */ EditorSelection;
                },
                /* harmony export */ n0: function () {
                    return /* binding */ ChangeDesc;
                },
                /* harmony export */ nZ: function () {
                    return /* binding */ codePointSize;
                },
                /* harmony export */ q6: function () {
                    return /* binding */ Annotation;
                },
                /* harmony export */ r$: function () {
                    return /* binding */ Facet;
                },
                /* harmony export */ uU: function () {
                    return /* binding */ RangeValue;
                },
                /* harmony export */ xv: function () {
                    return /* binding */ Text;
                },
                /* harmony export */ yy: function () {
                    return /* binding */ EditorState;
                },
                /* harmony export */
            });
            /* unused harmony exports AnnotationType, Compartment, Line, Range, SelectionRange, StateEffectType */
            /**
The data structure for documents. @nonabstract
*/
            class Text {
                /**
    @internal
    */
                constructor() {}
                /**
    Get the line description around the given position.
    */
                lineAt(pos) {
                    if (pos < 0 || pos > this.length)
                        throw new RangeError(
                            `Invalid position ${pos} in document of length ${this.length}`
                        );
                    return this.lineInner(pos, false, 1, 0);
                }
                /**
    Get the description for the given (1-based) line number.
    */
                line(n) {
                    if (n < 1 || n > this.lines)
                        throw new RangeError(
                            `Invalid line number ${n} in ${this.lines}-line document`
                        );
                    return this.lineInner(n, true, 1, 0);
                }
                /**
    Replace a range of the text with the given content.
    */
                replace(from, to, text) {
                    let parts = [];
                    this.decompose(0, from, parts, 2 /* To */);
                    if (text.length)
                        text.decompose(
                            0,
                            text.length,
                            parts,
                            1 /* From */ | 2 /* To */
                        );
                    this.decompose(to, this.length, parts, 1 /* From */);
                    return TextNode.from(
                        parts,
                        this.length - (to - from) + text.length
                    );
                }
                /**
    Append another document to this one.
    */
                append(other) {
                    return this.replace(this.length, this.length, other);
                }
                /**
    Retrieve the text between the given points.
    */
                slice(from, to = this.length) {
                    let parts = [];
                    this.decompose(from, to, parts, 0);
                    return TextNode.from(parts, to - from);
                }
                /**
    Test whether this text is equal to another instance.
    */
                eq(other) {
                    if (other == this) return true;
                    if (
                        other.length != this.length ||
                        other.lines != this.lines
                    )
                        return false;
                    let start = this.scanIdentical(other, 1),
                        end = this.length - this.scanIdentical(other, -1);
                    let a = new RawTextCursor(this),
                        b = new RawTextCursor(other);
                    for (let skip = start, pos = start; ; ) {
                        a.next(skip);
                        b.next(skip);
                        skip = 0;
                        if (
                            a.lineBreak != b.lineBreak ||
                            a.done != b.done ||
                            a.value != b.value
                        )
                            return false;
                        pos += a.value.length;
                        if (a.done || pos >= end) return true;
                    }
                }
                /**
    Iterate over the text. When `dir` is `-1`, iteration happens
    from end to start. This will return lines and the breaks between
    them as separate strings.
    */
                iter(dir = 1) {
                    return new RawTextCursor(this, dir);
                }
                /**
    Iterate over a range of the text. When `from` > `to`, the
    iterator will run in reverse.
    */
                iterRange(from, to = this.length) {
                    return new PartialTextCursor(this, from, to);
                }
                /**
    Return a cursor that iterates over the given range of lines,
    _without_ returning the line breaks between, and yielding empty
    strings for empty lines.
    
    When `from` and `to` are given, they should be 1-based line numbers.
    */
                iterLines(from, to) {
                    let inner;
                    if (from == null) {
                        inner = this.iter();
                    } else {
                        if (to == null) to = this.lines + 1;
                        let start = this.line(from).from;
                        inner = this.iterRange(
                            start,
                            Math.max(
                                start,
                                to == this.lines + 1
                                    ? this.length
                                    : to <= 1
                                    ? 0
                                    : this.line(to - 1).to
                            )
                        );
                    }
                    return new LineCursor(inner);
                }
                /**
    @internal
    */
                toString() {
                    return this.sliceString(0);
                }
                /**
    Convert the document to an array of lines (which can be
    deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
    */
                toJSON() {
                    let lines = [];
                    this.flatten(lines);
                    return lines;
                }
                /**
    Create a `Text` instance for the given array of lines.
    */
                static of(text) {
                    if (text.length == 0)
                        throw new RangeError(
                            "A document must have at least one line"
                        );
                    if (text.length == 1 && !text[0]) return Text.empty;
                    return text.length <= 32 /* Branch */
                        ? new TextLeaf(text)
                        : TextNode.from(TextLeaf.split(text, []));
                }
            }
            // Leaves store an array of line strings. There are always line breaks
            // between these strings. Leaves are limited in size and have to be
            // contained in TextNode instances for bigger documents.
            class TextLeaf extends Text {
                constructor(text, length = textLength(text)) {
                    super();
                    this.text = text;
                    this.length = length;
                }
                get lines() {
                    return this.text.length;
                }
                get children() {
                    return null;
                }
                lineInner(target, isLine, line, offset) {
                    for (let i = 0; ; i++) {
                        let string = this.text[i],
                            end = offset + string.length;
                        if ((isLine ? line : end) >= target)
                            return new Line(offset, end, line, string);
                        offset = end + 1;
                        line++;
                    }
                }
                decompose(from, to, target, open) {
                    let text =
                        from <= 0 && to >= this.length
                            ? this
                            : new TextLeaf(
                                  sliceText(this.text, from, to),
                                  Math.min(to, this.length) - Math.max(0, from)
                              );
                    if (open & 1 /* From */) {
                        let prev = target.pop();
                        let joined = appendText(
                            text.text,
                            prev.text.slice(),
                            0,
                            text.length
                        );
                        if (joined.length <= 32 /* Branch */) {
                            target.push(
                                new TextLeaf(joined, prev.length + text.length)
                            );
                        } else {
                            let mid = joined.length >> 1;
                            target.push(
                                new TextLeaf(joined.slice(0, mid)),
                                new TextLeaf(joined.slice(mid))
                            );
                        }
                    } else {
                        target.push(text);
                    }
                }
                replace(from, to, text) {
                    if (!(text instanceof TextLeaf))
                        return super.replace(from, to, text);
                    let lines = appendText(
                        this.text,
                        appendText(text.text, sliceText(this.text, 0, from)),
                        to
                    );
                    let newLen = this.length + text.length - (to - from);
                    if (lines.length <= 32 /* Branch */)
                        return new TextLeaf(lines, newLen);
                    return TextNode.from(TextLeaf.split(lines, []), newLen);
                }
                sliceString(from, to = this.length, lineSep = "\n") {
                    let result = "";
                    for (
                        let pos = 0, i = 0;
                        pos <= to && i < this.text.length;
                        i++
                    ) {
                        let line = this.text[i],
                            end = pos + line.length;
                        if (pos > from && i) result += lineSep;
                        if (from < end && to > pos)
                            result += line.slice(
                                Math.max(0, from - pos),
                                to - pos
                            );
                        pos = end + 1;
                    }
                    return result;
                }
                flatten(target) {
                    for (let line of this.text) target.push(line);
                }
                scanIdentical() {
                    return 0;
                }
                static split(text, target) {
                    let part = [],
                        len = -1;
                    for (let line of text) {
                        part.push(line);
                        len += line.length + 1;
                        if (part.length == 32 /* Branch */) {
                            target.push(new TextLeaf(part, len));
                            part = [];
                            len = -1;
                        }
                    }
                    if (len > -1) target.push(new TextLeaf(part, len));
                    return target;
                }
            }
            // Nodes provide the tree structure of the `Text` type. They store a
            // number of other nodes or leaves, taking care to balance themselves
            // on changes. There are implied line breaks _between_ the children of
            // a node (but not before the first or after the last child).
            class TextNode extends Text {
                constructor(children, length) {
                    super();
                    this.children = children;
                    this.length = length;
                    this.lines = 0;
                    for (let child of children) this.lines += child.lines;
                }
                lineInner(target, isLine, line, offset) {
                    for (let i = 0; ; i++) {
                        let child = this.children[i],
                            end = offset + child.length,
                            endLine = line + child.lines - 1;
                        if ((isLine ? endLine : end) >= target)
                            return child.lineInner(
                                target,
                                isLine,
                                line,
                                offset
                            );
                        offset = end + 1;
                        line = endLine + 1;
                    }
                }
                decompose(from, to, target, open) {
                    for (
                        let i = 0, pos = 0;
                        pos <= to && i < this.children.length;
                        i++
                    ) {
                        let child = this.children[i],
                            end = pos + child.length;
                        if (from <= end && to >= pos) {
                            let childOpen =
                                open &
                                ((pos <= from ? 1 /* From */ : 0) |
                                    (end >= to ? 2 /* To */ : 0));
                            if (pos >= from && end <= to && !childOpen)
                                target.push(child);
                            else
                                child.decompose(
                                    from - pos,
                                    to - pos,
                                    target,
                                    childOpen
                                );
                        }
                        pos = end + 1;
                    }
                }
                replace(from, to, text) {
                    if (text.lines < this.lines)
                        for (
                            let i = 0, pos = 0;
                            i < this.children.length;
                            i++
                        ) {
                            let child = this.children[i],
                                end = pos + child.length;
                            // Fast path: if the change only affects one child and the
                            // child's size remains in the acceptable range, only update
                            // that child
                            if (from >= pos && to <= end) {
                                let updated = child.replace(
                                    from - pos,
                                    to - pos,
                                    text
                                );
                                let totalLines =
                                    this.lines - child.lines + updated.lines;
                                if (
                                    updated.lines <
                                        totalLines >>
                                            (5 /* BranchShift */ - 1) &&
                                    updated.lines >
                                        totalLines >> (5 /* BranchShift */ + 1)
                                ) {
                                    let copy = this.children.slice();
                                    copy[i] = updated;
                                    return new TextNode(
                                        copy,
                                        this.length - (to - from) + text.length
                                    );
                                }
                                return super.replace(pos, end, updated);
                            }
                            pos = end + 1;
                        }
                    return super.replace(from, to, text);
                }
                sliceString(from, to = this.length, lineSep = "\n") {
                    let result = "";
                    for (
                        let i = 0, pos = 0;
                        i < this.children.length && pos <= to;
                        i++
                    ) {
                        let child = this.children[i],
                            end = pos + child.length;
                        if (pos > from && i) result += lineSep;
                        if (from < end && to > pos)
                            result += child.sliceString(
                                from - pos,
                                to - pos,
                                lineSep
                            );
                        pos = end + 1;
                    }
                    return result;
                }
                flatten(target) {
                    for (let child of this.children) child.flatten(target);
                }
                scanIdentical(other, dir) {
                    if (!(other instanceof TextNode)) return 0;
                    let length = 0;
                    let [iA, iB, eA, eB] =
                        dir > 0
                            ? [
                                  0,
                                  0,
                                  this.children.length,
                                  other.children.length,
                              ]
                            : [
                                  this.children.length - 1,
                                  other.children.length - 1,
                                  -1,
                                  -1,
                              ];
                    for (; ; iA += dir, iB += dir) {
                        if (iA == eA || iB == eB) return length;
                        let chA = this.children[iA],
                            chB = other.children[iB];
                        if (chA != chB)
                            return length + chA.scanIdentical(chB, dir);
                        length += chA.length + 1;
                    }
                }
                static from(
                    children,
                    length = children.reduce((l, ch) => l + ch.length + 1, -1)
                ) {
                    let lines = 0;
                    for (let ch of children) lines += ch.lines;
                    if (lines < 32 /* Branch */) {
                        let flat = [];
                        for (let ch of children) ch.flatten(flat);
                        return new TextLeaf(flat, length);
                    }
                    let chunk = Math.max(
                            32 /* Branch */,
                            lines >> 5 /* BranchShift */
                        ),
                        maxChunk = chunk << 1,
                        minChunk = chunk >> 1;
                    let chunked = [],
                        currentLines = 0,
                        currentLen = -1,
                        currentChunk = [];
                    function add(child) {
                        let last;
                        if (
                            child.lines > maxChunk &&
                            child instanceof TextNode
                        ) {
                            for (let node of child.children) add(node);
                        } else if (
                            child.lines > minChunk &&
                            (currentLines > minChunk || !currentLines)
                        ) {
                            flush();
                            chunked.push(child);
                        } else if (
                            child instanceof TextLeaf &&
                            currentLines &&
                            (last =
                                currentChunk[
                                    currentChunk.length - 1
                                ]) instanceof TextLeaf &&
                            child.lines + last.lines <= 32 /* Branch */
                        ) {
                            currentLines += child.lines;
                            currentLen += child.length + 1;
                            currentChunk[currentChunk.length - 1] =
                                new TextLeaf(
                                    last.text.concat(child.text),
                                    last.length + 1 + child.length
                                );
                        } else {
                            if (currentLines + child.lines > chunk) flush();
                            currentLines += child.lines;
                            currentLen += child.length + 1;
                            currentChunk.push(child);
                        }
                    }
                    function flush() {
                        if (currentLines == 0) return;
                        chunked.push(
                            currentChunk.length == 1
                                ? currentChunk[0]
                                : TextNode.from(currentChunk, currentLen)
                        );
                        currentLen = -1;
                        currentLines = currentChunk.length = 0;
                    }
                    for (let child of children) add(child);
                    flush();
                    return chunked.length == 1
                        ? chunked[0]
                        : new TextNode(chunked, length);
                }
            }
            Text.empty = /*@__PURE__*/ new TextLeaf([""], 0);
            function textLength(text) {
                let length = -1;
                for (let line of text) length += line.length + 1;
                return length;
            }
            function appendText(text, target, from = 0, to = 1e9) {
                for (
                    let pos = 0, i = 0, first = true;
                    i < text.length && pos <= to;
                    i++
                ) {
                    let line = text[i],
                        end = pos + line.length;
                    if (end >= from) {
                        if (end > to) line = line.slice(0, to - pos);
                        if (pos < from) line = line.slice(from - pos);
                        if (first) {
                            target[target.length - 1] += line;
                            first = false;
                        } else target.push(line);
                    }
                    pos = end + 1;
                }
                return target;
            }
            function sliceText(text, from, to) {
                return appendText(text, [""], from, to);
            }
            class RawTextCursor {
                constructor(text, dir = 1) {
                    this.dir = dir;
                    this.done = false;
                    this.lineBreak = false;
                    this.value = "";
                    this.nodes = [text];
                    this.offsets = [
                        dir > 0
                            ? 1
                            : (text instanceof TextLeaf
                                  ? text.text.length
                                  : text.children.length) << 1,
                    ];
                }
                nextInner(skip, dir) {
                    this.done = this.lineBreak = false;
                    for (;;) {
                        let last = this.nodes.length - 1;
                        let top = this.nodes[last],
                            offsetValue = this.offsets[last],
                            offset = offsetValue >> 1;
                        let size =
                            top instanceof TextLeaf
                                ? top.text.length
                                : top.children.length;
                        if (offset == (dir > 0 ? size : 0)) {
                            if (last == 0) {
                                this.done = true;
                                this.value = "";
                                return this;
                            }
                            if (dir > 0) this.offsets[last - 1]++;
                            this.nodes.pop();
                            this.offsets.pop();
                        } else if ((offsetValue & 1) == (dir > 0 ? 0 : 1)) {
                            this.offsets[last] += dir;
                            if (skip == 0) {
                                this.lineBreak = true;
                                this.value = "\n";
                                return this;
                            }
                            skip--;
                        } else if (top instanceof TextLeaf) {
                            // Move to the next string
                            let next = top.text[offset + (dir < 0 ? -1 : 0)];
                            this.offsets[last] += dir;
                            if (next.length > Math.max(0, skip)) {
                                this.value =
                                    skip == 0
                                        ? next
                                        : dir > 0
                                        ? next.slice(skip)
                                        : next.slice(0, next.length - skip);
                                return this;
                            }
                            skip -= next.length;
                        } else {
                            let next =
                                top.children[offset + (dir < 0 ? -1 : 0)];
                            if (skip > next.length) {
                                skip -= next.length;
                                this.offsets[last] += dir;
                            } else {
                                if (dir < 0) this.offsets[last]--;
                                this.nodes.push(next);
                                this.offsets.push(
                                    dir > 0
                                        ? 1
                                        : (next instanceof TextLeaf
                                              ? next.text.length
                                              : next.children.length) << 1
                                );
                            }
                        }
                    }
                }
                next(skip = 0) {
                    if (skip < 0) {
                        this.nextInner(-skip, -this.dir);
                        skip = this.value.length;
                    }
                    return this.nextInner(skip, this.dir);
                }
            }
            class PartialTextCursor {
                constructor(text, start, end) {
                    this.value = "";
                    this.done = false;
                    this.cursor = new RawTextCursor(text, start > end ? -1 : 1);
                    this.pos = start > end ? text.length : 0;
                    this.from = Math.min(start, end);
                    this.to = Math.max(start, end);
                }
                nextInner(skip, dir) {
                    if (dir < 0 ? this.pos <= this.from : this.pos >= this.to) {
                        this.value = "";
                        this.done = true;
                        return this;
                    }
                    skip += Math.max(
                        0,
                        dir < 0 ? this.pos - this.to : this.from - this.pos
                    );
                    let limit =
                        dir < 0 ? this.pos - this.from : this.to - this.pos;
                    if (skip > limit) skip = limit;
                    limit -= skip;
                    let { value } = this.cursor.next(skip);
                    this.pos += (value.length + skip) * dir;
                    this.value =
                        value.length <= limit
                            ? value
                            : dir < 0
                            ? value.slice(value.length - limit)
                            : value.slice(0, limit);
                    this.done = !this.value;
                    return this;
                }
                next(skip = 0) {
                    if (skip < 0) skip = Math.max(skip, this.from - this.pos);
                    else if (skip > 0)
                        skip = Math.min(skip, this.to - this.pos);
                    return this.nextInner(skip, this.cursor.dir);
                }
                get lineBreak() {
                    return this.cursor.lineBreak && this.value != "";
                }
            }
            class LineCursor {
                constructor(inner) {
                    this.inner = inner;
                    this.afterBreak = true;
                    this.value = "";
                    this.done = false;
                }
                next(skip = 0) {
                    let { done, lineBreak, value } = this.inner.next(skip);
                    if (done) {
                        this.done = true;
                        this.value = "";
                    } else if (lineBreak) {
                        if (this.afterBreak) {
                            this.value = "";
                        } else {
                            this.afterBreak = true;
                            this.next();
                        }
                    } else {
                        this.value = value;
                        this.afterBreak = false;
                    }
                    return this;
                }
                get lineBreak() {
                    return false;
                }
            }
            if (typeof Symbol != "undefined") {
                Text.prototype[Symbol.iterator] = function () {
                    return this.iter();
                };
                RawTextCursor.prototype[Symbol.iterator] =
                    PartialTextCursor.prototype[Symbol.iterator] =
                    LineCursor.prototype[Symbol.iterator] =
                        function () {
                            return this;
                        };
            }
            /**
This type describes a line in the document. It is created
on-demand when lines are [queried](https://codemirror.net/6/docs/ref/#state.Text.lineAt).
*/
            class Line {
                /**
    @internal
    */
                constructor(
                    /**
    The position of the start of the line.
    */
                    from,
                    /**
    The position at the end of the line (_before_ the line break,
    or at the end of document for the last line).
    */
                    to,
                    /**
    This line's line number (1-based).
    */
                    number,
                    /**
    The line's content.
    */
                    text
                ) {
                    this.from = from;
                    this.to = to;
                    this.number = number;
                    this.text = text;
                }
                /**
    The length of the line (not including any line break after it).
    */
                get length() {
                    return this.to - this.from;
                }
            }

            // Compressed representation of the Grapheme_Cluster_Break=Extend
            // information from
            // http://www.unicode.org/Public/13.0.0/ucd/auxiliary/GraphemeBreakProperty.txt.
            // Each pair of elements represents a range, as an offet from the
            // previous range and a length. Numbers are in base-36, with the empty
            // string being a shorthand for 1.
            let extend =
                /*@__PURE__*/ "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o"
                    .split(",")
                    .map((s) => (s ? parseInt(s, 36) : 1));
            // Convert offsets into absolute values
            for (let i = 1; i < extend.length; i++) extend[i] += extend[i - 1];
            function isExtendingChar(code) {
                for (let i = 1; i < extend.length; i += 2)
                    if (extend[i] > code) return extend[i - 1] <= code;
                return false;
            }
            function isRegionalIndicator(code) {
                return code >= 0x1f1e6 && code <= 0x1f1ff;
            }
            const ZWJ = 0x200d;
            /**
Returns a next grapheme cluster break _after_ (not equal to)
`pos`, if `forward` is true, or before otherwise. Returns `pos`
itself if no further cluster break is available in the string.
Moves across surrogate pairs, extending characters (when
`includeExtending` is true), characters joined with zero-width
joiners, and flag emoji.
*/
            function findClusterBreak(
                str,
                pos,
                forward = true,
                includeExtending = true
            ) {
                return (forward ? nextClusterBreak : prevClusterBreak)(
                    str,
                    pos,
                    includeExtending
                );
            }
            function nextClusterBreak(str, pos, includeExtending) {
                if (pos == str.length) return pos;
                // If pos is in the middle of a surrogate pair, move to its start
                if (
                    pos &&
                    surrogateLow(str.charCodeAt(pos)) &&
                    surrogateHigh(str.charCodeAt(pos - 1))
                )
                    pos--;
                let prev = codePointAt(str, pos);
                pos += codePointSize(prev);
                while (pos < str.length) {
                    let next = codePointAt(str, pos);
                    if (
                        prev == ZWJ ||
                        next == ZWJ ||
                        (includeExtending && isExtendingChar(next))
                    ) {
                        pos += codePointSize(next);
                        prev = next;
                    } else if (isRegionalIndicator(next)) {
                        let countBefore = 0,
                            i = pos - 2;
                        while (
                            i >= 0 &&
                            isRegionalIndicator(codePointAt(str, i))
                        ) {
                            countBefore++;
                            i -= 2;
                        }
                        if (countBefore % 2 == 0) break;
                        else pos += 2;
                    } else {
                        break;
                    }
                }
                return pos;
            }
            function prevClusterBreak(str, pos, includeExtending) {
                while (pos > 0) {
                    let found = nextClusterBreak(
                        str,
                        pos - 2,
                        includeExtending
                    );
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
            /**
Find the code point at the given position in a string (like the
[`codePointAt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)
string method).
*/
            function codePointAt(str, pos) {
                let code0 = str.charCodeAt(pos);
                if (!surrogateHigh(code0) || pos + 1 == str.length)
                    return code0;
                let code1 = str.charCodeAt(pos + 1);
                if (!surrogateLow(code1)) return code0;
                return ((code0 - 0xd800) << 10) + (code1 - 0xdc00) + 0x10000;
            }
            /**
Given a Unicode codepoint, return the JavaScript string that
respresents it (like
[`String.fromCodePoint`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint)).
*/
            function fromCodePoint(code) {
                if (code <= 0xffff) return String.fromCharCode(code);
                code -= 0x10000;
                return String.fromCharCode(
                    (code >> 10) + 0xd800,
                    (code & 1023) + 0xdc00
                );
            }
            /**
The first character that takes up two positions in a JavaScript
string. It is often useful to compare with this after calling
`codePointAt`, to figure out whether your character takes up 1 or
2 index positions.
*/
            function codePointSize(code) {
                return code < 0x10000 ? 1 : 2;
            }

            const DefaultSplit = /\r\n?|\n/;
            /**
Distinguishes different ways in which positions can be mapped.
*/
            var MapMode = /*@__PURE__*/ (function (MapMode) {
                /**
    Map a position to a valid new position, even when its context
    was deleted.
    */
                MapMode[(MapMode["Simple"] = 0)] = "Simple";
                /**
    Return null if deletion happens across the position.
    */
                MapMode[(MapMode["TrackDel"] = 1)] = "TrackDel";
                /**
    Return null if the character _before_ the position is deleted.
    */
                MapMode[(MapMode["TrackBefore"] = 2)] = "TrackBefore";
                /**
    Return null if the character _after_ the position is deleted.
    */
                MapMode[(MapMode["TrackAfter"] = 3)] = "TrackAfter";
                return MapMode;
            })(MapMode || (MapMode = {}));
            /**
A change description is a variant of [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet)
that doesn't store the inserted text. As such, it can't be
applied, but is cheaper to store and manipulate.
*/
            class ChangeDesc {
                // Sections are encoded as pairs of integers. The first is the
                // length in the current document, and the second is -1 for
                // unaffected sections, and the length of the replacement content
                // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
                // 0), and a replacement two positive numbers.
                /**
    @internal
    */
                constructor(
                    /**
    @internal
    */
                    sections
                ) {
                    this.sections = sections;
                }
                /**
    The length of the document before the change.
    */
                get length() {
                    let result = 0;
                    for (let i = 0; i < this.sections.length; i += 2)
                        result += this.sections[i];
                    return result;
                }
                /**
    The length of the document after the change.
    */
                get newLength() {
                    let result = 0;
                    for (let i = 0; i < this.sections.length; i += 2) {
                        let ins = this.sections[i + 1];
                        result += ins < 0 ? this.sections[i] : ins;
                    }
                    return result;
                }
                /**
    False when there are actual changes in this set.
    */
                get empty() {
                    return (
                        this.sections.length == 0 ||
                        (this.sections.length == 2 && this.sections[1] < 0)
                    );
                }
                /**
    Iterate over the unchanged parts left by these changes. `posA`
    provides the position of the range in the old document, `posB`
    the new position in the changed document.
    */
                iterGaps(f) {
                    for (
                        let i = 0, posA = 0, posB = 0;
                        i < this.sections.length;

                    ) {
                        let len = this.sections[i++],
                            ins = this.sections[i++];
                        if (ins < 0) {
                            f(posA, posB, len);
                            posB += len;
                        } else {
                            posB += ins;
                        }
                        posA += len;
                    }
                }
                /**
    Iterate over the ranges changed by these changes. (See
    [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
    variant that also provides you with the inserted text.)
    `fromA`/`toA` provides the extent of the change in the starting
    document, `fromB`/`toB` the extent of the replacement in the
    changed document.
    
    When `individual` is true, adjacent changes (which are kept
    separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
    reported separately.
    */
                iterChangedRanges(f, individual = false) {
                    iterChanges(this, f, individual);
                }
                /**
    Get a description of the inverted form of these changes.
    */
                get invertedDesc() {
                    let sections = [];
                    for (let i = 0; i < this.sections.length; ) {
                        let len = this.sections[i++],
                            ins = this.sections[i++];
                        if (ins < 0) sections.push(len, ins);
                        else sections.push(ins, len);
                    }
                    return new ChangeDesc(sections);
                }
                /**
    Compute the combined effect of applying another set of changes
    after this one. The length of the document after this set should
    match the length before `other`.
    */
                composeDesc(other) {
                    return this.empty
                        ? other
                        : other.empty
                        ? this
                        : composeSets(this, other);
                }
                /**
    Map this description, which should start with the same document
    as `other`, over another set of changes, so that it can be
    applied after it. When `before` is true, map as if the changes
    in `other` happened before the ones in `this`.
    */
                mapDesc(other, before = false) {
                    return other.empty ? this : mapSet(this, other, before);
                }
                mapPos(pos, assoc = -1, mode = MapMode.Simple) {
                    let posA = 0,
                        posB = 0;
                    for (let i = 0; i < this.sections.length; ) {
                        let len = this.sections[i++],
                            ins = this.sections[i++],
                            endA = posA + len;
                        if (ins < 0) {
                            if (endA > pos) return posB + (pos - posA);
                            posB += len;
                        } else {
                            if (
                                mode != MapMode.Simple &&
                                endA >= pos &&
                                ((mode == MapMode.TrackDel &&
                                    posA < pos &&
                                    endA > pos) ||
                                    (mode == MapMode.TrackBefore &&
                                        posA < pos) ||
                                    (mode == MapMode.TrackAfter && endA > pos))
                            )
                                return null;
                            if (
                                endA > pos ||
                                (endA == pos && assoc < 0 && !len)
                            )
                                return pos == posA || assoc < 0
                                    ? posB
                                    : posB + ins;
                            posB += ins;
                        }
                        posA = endA;
                    }
                    if (pos > posA)
                        throw new RangeError(
                            `Position ${pos} is out of range for changeset of length ${posA}`
                        );
                    return posB;
                }
                /**
    Check whether these changes touch a given range. When one of the
    changes entirely covers the range, the string `"cover"` is
    returned.
    */
                touchesRange(from, to = from) {
                    for (
                        let i = 0, pos = 0;
                        i < this.sections.length && pos <= to;

                    ) {
                        let len = this.sections[i++],
                            ins = this.sections[i++],
                            end = pos + len;
                        if (ins >= 0 && pos <= to && end >= from)
                            return pos < from && end > to ? "cover" : true;
                        pos = end;
                    }
                    return false;
                }
                /**
    @internal
    */
                toString() {
                    let result = "";
                    for (let i = 0; i < this.sections.length; ) {
                        let len = this.sections[i++],
                            ins = this.sections[i++];
                        result +=
                            (result ? " " : "") +
                            len +
                            (ins >= 0 ? ":" + ins : "");
                    }
                    return result;
                }
                /**
    Serialize this change desc to a JSON-representable value.
    */
                toJSON() {
                    return this.sections;
                }
                /**
    Create a change desc from its JSON representation (as produced
    by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
    */
                static fromJSON(json) {
                    if (
                        !Array.isArray(json) ||
                        json.length % 2 ||
                        json.some((a) => typeof a != "number")
                    )
                        throw new RangeError(
                            "Invalid JSON representation of ChangeDesc"
                        );
                    return new ChangeDesc(json);
                }
            }
            /**
A change set represents a group of modifications to a document. It
stores the document length, and can only be applied to documents
with exactly that length.
*/
            class ChangeSet extends ChangeDesc {
                /**
    @internal
    */
                constructor(
                    sections,
                    /**
    @internal
    */
                    inserted
                ) {
                    super(sections);
                    this.inserted = inserted;
                }
                /**
    Apply the changes to a document, returning the modified
    document.
    */
                apply(doc) {
                    if (this.length != doc.length)
                        throw new RangeError(
                            "Applying change set to a document with the wrong length"
                        );
                    iterChanges(
                        this,
                        (fromA, toA, fromB, _toB, text) =>
                            (doc = doc.replace(
                                fromB,
                                fromB + (toA - fromA),
                                text
                            )),
                        false
                    );
                    return doc;
                }
                mapDesc(other, before = false) {
                    return mapSet(this, other, before, true);
                }
                /**
    Given the document as it existed _before_ the changes, return a
    change set that represents the inverse of this set, which could
    be used to go from the document created by the changes back to
    the document as it existed before the changes.
    */
                invert(doc) {
                    let sections = this.sections.slice(),
                        inserted = [];
                    for (let i = 0, pos = 0; i < sections.length; i += 2) {
                        let len = sections[i],
                            ins = sections[i + 1];
                        if (ins >= 0) {
                            sections[i] = ins;
                            sections[i + 1] = len;
                            let index = i >> 1;
                            while (inserted.length < index)
                                inserted.push(Text.empty);
                            inserted.push(
                                len ? doc.slice(pos, pos + len) : Text.empty
                            );
                        }
                        pos += len;
                    }
                    return new ChangeSet(sections, inserted);
                }
                /**
    Combine two subsequent change sets into a single set. `other`
    must start in the document produced by `this`. If `this` goes
    `docA` → `docB` and `other` represents `docB` → `docC`, the
    returned value will represent the change `docA` → `docC`.
    */
                compose(other) {
                    return this.empty
                        ? other
                        : other.empty
                        ? this
                        : composeSets(this, other, true);
                }
                /**
    Given another change set starting in the same document, maps this
    change set over the other, producing a new change set that can be
    applied to the document produced by applying `other`. When
    `before` is `true`, order changes as if `this` comes before
    `other`, otherwise (the default) treat `other` as coming first.
    
    Given two changes `A` and `B`, `A.compose(B.map(A))` and
    `B.compose(A.map(B, true))` will produce the same document. This
    provides a basic form of [operational
    transformation](https://en.wikipedia.org/wiki/Operational_transformation),
    and can be used for collaborative editing.
    */
                map(other, before = false) {
                    return other.empty
                        ? this
                        : mapSet(this, other, before, true);
                }
                /**
    Iterate over the changed ranges in the document, calling `f` for
    each, with the range in the original document (`fromA`-`toA`)
    and the range that replaces it in the new document
    (`fromB`-`toB`).
    
    When `individual` is true, adjacent changes are reported
    separately.
    */
                iterChanges(f, individual = false) {
                    iterChanges(this, f, individual);
                }
                /**
    Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
    set.
    */
                get desc() {
                    return new ChangeDesc(this.sections);
                }
                /**
    @internal
    */
                filter(ranges) {
                    let resultSections = [],
                        resultInserted = [],
                        filteredSections = [];
                    let iter = new SectionIter(this);
                    done: for (let i = 0, pos = 0; ; ) {
                        let next = i == ranges.length ? 1e9 : ranges[i++];
                        while (pos < next || (pos == next && iter.len == 0)) {
                            if (iter.done) break done;
                            let len = Math.min(iter.len, next - pos);
                            addSection(filteredSections, len, -1);
                            let ins =
                                iter.ins == -1
                                    ? -1
                                    : iter.off == 0
                                    ? iter.ins
                                    : 0;
                            addSection(resultSections, len, ins);
                            if (ins > 0)
                                addInsert(
                                    resultInserted,
                                    resultSections,
                                    iter.text
                                );
                            iter.forward(len);
                            pos += len;
                        }
                        let end = ranges[i++];
                        while (pos < end) {
                            if (iter.done) break done;
                            let len = Math.min(iter.len, end - pos);
                            addSection(resultSections, len, -1);
                            addSection(
                                filteredSections,
                                len,
                                iter.ins == -1
                                    ? -1
                                    : iter.off == 0
                                    ? iter.ins
                                    : 0
                            );
                            iter.forward(len);
                            pos += len;
                        }
                    }
                    return {
                        changes: new ChangeSet(resultSections, resultInserted),
                        filtered: new ChangeDesc(filteredSections),
                    };
                }
                /**
    Serialize this change set to a JSON-representable value.
    */
                toJSON() {
                    let parts = [];
                    for (let i = 0; i < this.sections.length; i += 2) {
                        let len = this.sections[i],
                            ins = this.sections[i + 1];
                        if (ins < 0) parts.push(len);
                        else if (ins == 0) parts.push([len]);
                        else
                            parts.push(
                                [len].concat(this.inserted[i >> 1].toJSON())
                            );
                    }
                    return parts;
                }
                /**
    Create a change set for the given changes, for a document of the
    given length, using `lineSep` as line separator.
    */
                static of(changes, length, lineSep) {
                    let sections = [],
                        inserted = [],
                        pos = 0;
                    let total = null;
                    function flush(force = false) {
                        if (!force && !sections.length) return;
                        if (pos < length)
                            addSection(sections, length - pos, -1);
                        let set = new ChangeSet(sections, inserted);
                        total = total ? total.compose(set.map(total)) : set;
                        sections = [];
                        inserted = [];
                        pos = 0;
                    }
                    function process(spec) {
                        if (Array.isArray(spec)) {
                            for (let sub of spec) process(sub);
                        } else if (spec instanceof ChangeSet) {
                            if (spec.length != length)
                                throw new RangeError(
                                    `Mismatched change set length (got ${spec.length}, expected ${length})`
                                );
                            flush();
                            total = total
                                ? total.compose(spec.map(total))
                                : spec;
                        } else {
                            let { from, to = from, insert } = spec;
                            if (from > to || from < 0 || to > length)
                                throw new RangeError(
                                    `Invalid change range ${from} to ${to} (in doc of length ${length})`
                                );
                            let insText = !insert
                                ? Text.empty
                                : typeof insert == "string"
                                ? Text.of(insert.split(lineSep || DefaultSplit))
                                : insert;
                            let insLen = insText.length;
                            if (from == to && insLen == 0) return;
                            if (from < pos) flush();
                            if (from > pos)
                                addSection(sections, from - pos, -1);
                            addSection(sections, to - from, insLen);
                            addInsert(inserted, sections, insText);
                            pos = to;
                        }
                    }
                    process(changes);
                    flush(!total);
                    return total;
                }
                /**
    Create an empty changeset of the given length.
    */
                static empty(length) {
                    return new ChangeSet(length ? [length, -1] : [], []);
                }
                /**
    Create a changeset from its JSON representation (as produced by
    [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
    */
                static fromJSON(json) {
                    if (!Array.isArray(json))
                        throw new RangeError(
                            "Invalid JSON representation of ChangeSet"
                        );
                    let sections = [],
                        inserted = [];
                    for (let i = 0; i < json.length; i++) {
                        let part = json[i];
                        if (typeof part == "number") {
                            sections.push(part, -1);
                        } else if (
                            !Array.isArray(part) ||
                            typeof part[0] != "number" ||
                            part.some((e, i) => i && typeof e != "string")
                        ) {
                            throw new RangeError(
                                "Invalid JSON representation of ChangeSet"
                            );
                        } else if (part.length == 1) {
                            sections.push(part[0], 0);
                        } else {
                            while (inserted.length < i)
                                inserted.push(Text.empty);
                            inserted[i] = Text.of(part.slice(1));
                            sections.push(part[0], inserted[i].length);
                        }
                    }
                    return new ChangeSet(sections, inserted);
                }
            }
            function addSection(sections, len, ins, forceJoin = false) {
                if (len == 0 && ins <= 0) return;
                let last = sections.length - 2;
                if (last >= 0 && ins <= 0 && ins == sections[last + 1])
                    sections[last] += len;
                else if (len == 0 && sections[last] == 0)
                    sections[last + 1] += ins;
                else if (forceJoin) {
                    sections[last] += len;
                    sections[last + 1] += ins;
                } else sections.push(len, ins);
            }
            function addInsert(values, sections, value) {
                if (value.length == 0) return;
                let index = (sections.length - 2) >> 1;
                if (index < values.length) {
                    values[values.length - 1] =
                        values[values.length - 1].append(value);
                } else {
                    while (values.length < index) values.push(Text.empty);
                    values.push(value);
                }
            }
            function iterChanges(desc, f, individual) {
                let inserted = desc.inserted;
                for (
                    let posA = 0, posB = 0, i = 0;
                    i < desc.sections.length;

                ) {
                    let len = desc.sections[i++],
                        ins = desc.sections[i++];
                    if (ins < 0) {
                        posA += len;
                        posB += len;
                    } else {
                        let endA = posA,
                            endB = posB,
                            text = Text.empty;
                        for (;;) {
                            endA += len;
                            endB += ins;
                            if (ins && inserted)
                                text = text.append(inserted[(i - 2) >> 1]);
                            if (
                                individual ||
                                i == desc.sections.length ||
                                desc.sections[i + 1] < 0
                            )
                                break;
                            len = desc.sections[i++];
                            ins = desc.sections[i++];
                        }
                        f(posA, endA, posB, endB, text);
                        posA = endA;
                        posB = endB;
                    }
                }
            }
            function mapSet(setA, setB, before, mkSet = false) {
                let sections = [],
                    insert = mkSet ? [] : null;
                let a = new SectionIter(setA),
                    b = new SectionIter(setB);
                for (let posA = 0, posB = 0; ; ) {
                    if (a.ins == -1) {
                        posA += a.len;
                        a.next();
                    } else if (b.ins == -1 && posB < posA) {
                        let skip = Math.min(b.len, posA - posB);
                        b.forward(skip);
                        addSection(sections, skip, -1);
                        posB += skip;
                    } else if (
                        b.ins >= 0 &&
                        (a.done ||
                            posB < posA ||
                            (posB == posA &&
                                (b.len < a.len || (b.len == a.len && !before))))
                    ) {
                        addSection(sections, b.ins, -1);
                        while (
                            posA > posB &&
                            !a.done &&
                            posA + a.len < posB + b.len
                        ) {
                            posA += a.len;
                            a.next();
                        }
                        posB += b.len;
                        b.next();
                    } else if (a.ins >= 0) {
                        let len = 0,
                            end = posA + a.len;
                        for (;;) {
                            if (
                                b.ins >= 0 &&
                                posB > posA &&
                                posB + b.len < end
                            ) {
                                len += b.ins;
                                posB += b.len;
                                b.next();
                            } else if (b.ins == -1 && posB < end) {
                                let skip = Math.min(b.len, end - posB);
                                len += skip;
                                b.forward(skip);
                                posB += skip;
                            } else {
                                break;
                            }
                        }
                        addSection(sections, len, a.ins);
                        if (insert) addInsert(insert, sections, a.text);
                        posA = end;
                        a.next();
                    } else if (a.done && b.done) {
                        return insert
                            ? new ChangeSet(sections, insert)
                            : new ChangeDesc(sections);
                    } else {
                        throw new Error("Mismatched change set lengths");
                    }
                }
            }
            function composeSets(setA, setB, mkSet = false) {
                let sections = [];
                let insert = mkSet ? [] : null;
                let a = new SectionIter(setA),
                    b = new SectionIter(setB);
                for (let open = false; ; ) {
                    if (a.done && b.done) {
                        return insert
                            ? new ChangeSet(sections, insert)
                            : new ChangeDesc(sections);
                    } else if (a.ins == 0) {
                        // Deletion in A
                        addSection(sections, a.len, 0, open);
                        a.next();
                    } else if (b.len == 0 && !b.done) {
                        // Insertion in B
                        addSection(sections, 0, b.ins, open);
                        if (insert) addInsert(insert, sections, b.text);
                        b.next();
                    } else if (a.done || b.done) {
                        throw new Error("Mismatched change set lengths");
                    } else {
                        let len = Math.min(a.len2, b.len),
                            sectionLen = sections.length;
                        if (a.ins == -1) {
                            let insB = b.ins == -1 ? -1 : b.off ? 0 : b.ins;
                            addSection(sections, len, insB, open);
                            if (insert && insB)
                                addInsert(insert, sections, b.text);
                        } else if (b.ins == -1) {
                            addSection(sections, a.off ? 0 : a.len, len, open);
                            if (insert)
                                addInsert(insert, sections, a.textBit(len));
                        } else {
                            addSection(
                                sections,
                                a.off ? 0 : a.len,
                                b.off ? 0 : b.ins,
                                open
                            );
                            if (insert && !b.off)
                                addInsert(insert, sections, b.text);
                        }
                        open =
                            (a.ins > len || (b.ins >= 0 && b.len > len)) &&
                            (open || sections.length > sectionLen);
                        a.forward2(len);
                        b.forward(len);
                    }
                }
            }
            class SectionIter {
                constructor(set) {
                    this.set = set;
                    this.i = 0;
                    this.next();
                }
                next() {
                    let { sections } = this.set;
                    if (this.i < sections.length) {
                        this.len = sections[this.i++];
                        this.ins = sections[this.i++];
                    } else {
                        this.len = 0;
                        this.ins = -2;
                    }
                    this.off = 0;
                }
                get done() {
                    return this.ins == -2;
                }
                get len2() {
                    return this.ins < 0 ? this.len : this.ins;
                }
                get text() {
                    let { inserted } = this.set,
                        index = (this.i - 2) >> 1;
                    return index >= inserted.length
                        ? Text.empty
                        : inserted[index];
                }
                textBit(len) {
                    let { inserted } = this.set,
                        index = (this.i - 2) >> 1;
                    return index >= inserted.length && !len
                        ? Text.empty
                        : inserted[index].slice(
                              this.off,
                              len == null ? undefined : this.off + len
                          );
                }
                forward(len) {
                    if (len == this.len) this.next();
                    else {
                        this.len -= len;
                        this.off += len;
                    }
                }
                forward2(len) {
                    if (this.ins == -1) this.forward(len);
                    else if (len == this.ins) this.next();
                    else {
                        this.ins -= len;
                        this.off += len;
                    }
                }
            }

            /**
A single selection range. When
[`allowMultipleSelections`](https://codemirror.net/6/docs/ref/#state.EditorState^allowMultipleSelections)
is enabled, a [selection](https://codemirror.net/6/docs/ref/#state.EditorSelection) may hold
multiple ranges. By default, selections hold exactly one range.
*/
            class SelectionRange {
                /**
    @internal
    */
                constructor(
                    /**
    The lower boundary of the range.
    */
                    from,
                    /**
    The upper boundary of the range.
    */
                    to,
                    flags
                ) {
                    this.from = from;
                    this.to = to;
                    this.flags = flags;
                }
                /**
    The anchor of the range—the side that doesn't move when you
    extend it.
    */
                get anchor() {
                    return this.flags & 16 /* Inverted */ ? this.to : this.from;
                }
                /**
    The head of the range, which is moved when the range is
    [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
    */
                get head() {
                    return this.flags & 16 /* Inverted */ ? this.from : this.to;
                }
                /**
    True when `anchor` and `head` are at the same position.
    */
                get empty() {
                    return this.from == this.to;
                }
                /**
    If this is a cursor that is explicitly associated with the
    character on one of its sides, this returns the side. -1 means
    the character before its position, 1 the character after, and 0
    means no association.
    */
                get assoc() {
                    return this.flags & 4 /* AssocBefore */
                        ? -1
                        : this.flags & 8 /* AssocAfter */
                        ? 1
                        : 0;
                }
                /**
    The bidirectional text level associated with this cursor, if
    any.
    */
                get bidiLevel() {
                    let level = this.flags & 3; /* BidiLevelMask */
                    return level == 3 ? null : level;
                }
                /**
    The goal column (stored vertical offset) associated with a
    cursor. This is used to preserve the vertical position when
    [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
    lines of different length.
    */
                get goalColumn() {
                    let value = this.flags >> 5; /* GoalColumnOffset */
                    return value == 33554431 /* NoGoalColumn */
                        ? undefined
                        : value;
                }
                /**
    Map this range through a change, producing a valid range in the
    updated document.
    */
                map(change, assoc = -1) {
                    let from, to;
                    if (this.empty) {
                        from = to = change.mapPos(this.from, assoc);
                    } else {
                        from = change.mapPos(this.from, 1);
                        to = change.mapPos(this.to, -1);
                    }
                    return from == this.from && to == this.to
                        ? this
                        : new SelectionRange(from, to, this.flags);
                }
                /**
    Extend this range to cover at least `from` to `to`.
    */
                extend(from, to = from) {
                    if (from <= this.anchor && to >= this.anchor)
                        return EditorSelection.range(from, to);
                    let head =
                        Math.abs(from - this.anchor) >
                        Math.abs(to - this.anchor)
                            ? from
                            : to;
                    return EditorSelection.range(this.anchor, head);
                }
                /**
    Compare this range to another range.
    */
                eq(other) {
                    return (
                        this.anchor == other.anchor && this.head == other.head
                    );
                }
                /**
    Return a JSON-serializable object representing the range.
    */
                toJSON() {
                    return { anchor: this.anchor, head: this.head };
                }
                /**
    Convert a JSON representation of a range to a `SelectionRange`
    instance.
    */
                static fromJSON(json) {
                    if (
                        !json ||
                        typeof json.anchor != "number" ||
                        typeof json.head != "number"
                    )
                        throw new RangeError(
                            "Invalid JSON representation for SelectionRange"
                        );
                    return EditorSelection.range(json.anchor, json.head);
                }
            }
            /**
An editor selection holds one or more selection ranges.
*/
            class EditorSelection {
                /**
    @internal
    */
                constructor(
                    /**
    The ranges in the selection, sorted by position. Ranges cannot
    overlap (but they may touch, if they aren't empty).
    */
                    ranges,
                    /**
    The index of the _main_ range in the selection (which is
    usually the range that was added last).
    */
                    mainIndex = 0
                ) {
                    this.ranges = ranges;
                    this.mainIndex = mainIndex;
                }
                /**
    Map a selection through a change. Used to adjust the selection
    position for changes.
    */
                map(change, assoc = -1) {
                    if (change.empty) return this;
                    return EditorSelection.create(
                        this.ranges.map((r) => r.map(change, assoc)),
                        this.mainIndex
                    );
                }
                /**
    Compare this selection to another selection.
    */
                eq(other) {
                    if (
                        this.ranges.length != other.ranges.length ||
                        this.mainIndex != other.mainIndex
                    )
                        return false;
                    for (let i = 0; i < this.ranges.length; i++)
                        if (!this.ranges[i].eq(other.ranges[i])) return false;
                    return true;
                }
                /**
    Get the primary selection range. Usually, you should make sure
    your code applies to _all_ ranges, by using methods like
    [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
    */
                get main() {
                    return this.ranges[this.mainIndex];
                }
                /**
    Make sure the selection only has one range. Returns a selection
    holding only the main range from this selection.
    */
                asSingle() {
                    return this.ranges.length == 1
                        ? this
                        : new EditorSelection([this.main]);
                }
                /**
    Extend this selection with an extra range.
    */
                addRange(range, main = true) {
                    return EditorSelection.create(
                        [range].concat(this.ranges),
                        main ? 0 : this.mainIndex + 1
                    );
                }
                /**
    Replace a given range with another range, and then normalize the
    selection to merge and sort ranges if necessary.
    */
                replaceRange(range, which = this.mainIndex) {
                    let ranges = this.ranges.slice();
                    ranges[which] = range;
                    return EditorSelection.create(ranges, this.mainIndex);
                }
                /**
    Convert this selection to an object that can be serialized to
    JSON.
    */
                toJSON() {
                    return {
                        ranges: this.ranges.map((r) => r.toJSON()),
                        main: this.mainIndex,
                    };
                }
                /**
    Create a selection from a JSON representation.
    */
                static fromJSON(json) {
                    if (
                        !json ||
                        !Array.isArray(json.ranges) ||
                        typeof json.main != "number" ||
                        json.main >= json.ranges.length
                    )
                        throw new RangeError(
                            "Invalid JSON representation for EditorSelection"
                        );
                    return new EditorSelection(
                        json.ranges.map((r) => SelectionRange.fromJSON(r)),
                        json.main
                    );
                }
                /**
    Create a selection holding a single range.
    */
                static single(anchor, head = anchor) {
                    return new EditorSelection(
                        [EditorSelection.range(anchor, head)],
                        0
                    );
                }
                /**
    Sort and merge the given set of ranges, creating a valid
    selection.
    */
                static create(ranges, mainIndex = 0) {
                    if (ranges.length == 0)
                        throw new RangeError(
                            "A selection needs at least one range"
                        );
                    for (let pos = 0, i = 0; i < ranges.length; i++) {
                        let range = ranges[i];
                        if (range.empty ? range.from <= pos : range.from < pos)
                            return normalized(ranges.slice(), mainIndex);
                        pos = range.to;
                    }
                    return new EditorSelection(ranges, mainIndex);
                }
                /**
    Create a cursor selection range at the given position. You can
    safely ignore the optional arguments in most situations.
    */
                static cursor(pos, assoc = 0, bidiLevel, goalColumn) {
                    return new SelectionRange(
                        pos,
                        pos,
                        (assoc == 0
                            ? 0
                            : assoc < 0
                            ? 4 /* AssocBefore */
                            : 8) /* AssocAfter */ |
                            (bidiLevel == null ? 3 : Math.min(2, bidiLevel)) |
                            ((goalColumn !== null && goalColumn !== void 0
                                ? goalColumn
                                : 33554431) /* NoGoalColumn */ <<
                                5) /* GoalColumnOffset */
                    );
                }
                /**
    Create a selection range.
    */
                static range(anchor, head, goalColumn) {
                    let goal =
                        (goalColumn !== null && goalColumn !== void 0
                            ? goalColumn
                            : 33554431) /* NoGoalColumn */ <<
                        5; /* GoalColumnOffset */
                    return head < anchor
                        ? new SelectionRange(
                              head,
                              anchor,
                              16 /* Inverted */ | goal | 8 /* AssocAfter */
                          )
                        : new SelectionRange(
                              anchor,
                              head,
                              goal | (head > anchor ? 4 /* AssocBefore */ : 0)
                          );
                }
            }
            function normalized(ranges, mainIndex = 0) {
                let main = ranges[mainIndex];
                ranges.sort((a, b) => a.from - b.from);
                mainIndex = ranges.indexOf(main);
                for (let i = 1; i < ranges.length; i++) {
                    let range = ranges[i],
                        prev = ranges[i - 1];
                    if (
                        range.empty
                            ? range.from <= prev.to
                            : range.from < prev.to
                    ) {
                        let from = prev.from,
                            to = Math.max(range.to, prev.to);
                        if (i <= mainIndex) mainIndex--;
                        ranges.splice(
                            --i,
                            2,
                            range.anchor > range.head
                                ? EditorSelection.range(to, from)
                                : EditorSelection.range(from, to)
                        );
                    }
                }
                return new EditorSelection(ranges, mainIndex);
            }
            function checkSelection(selection, docLength) {
                for (let range of selection.ranges)
                    if (range.to > docLength)
                        throw new RangeError(
                            "Selection points outside of document"
                        );
            }

            let nextID = 0;
            /**
A facet is a labeled value that is associated with an editor
state. It takes inputs from any number of extensions, and combines
those into a single output value.

Examples of uses of facets are the [tab
size](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize), [editor
attributes](https://codemirror.net/6/docs/ref/#view.EditorView^editorAttributes), and [update
listeners](https://codemirror.net/6/docs/ref/#view.EditorView^updateListener).
*/
            class Facet {
                constructor(
                    /**
    @internal
    */
                    combine,
                    /**
    @internal
    */
                    compareInput,
                    /**
    @internal
    */
                    compare,
                    isStatic,
                    /**
    @internal
    */
                    extensions
                ) {
                    this.combine = combine;
                    this.compareInput = compareInput;
                    this.compare = compare;
                    this.isStatic = isStatic;
                    this.extensions = extensions;
                    /**
        @internal
        */
                    this.id = nextID++;
                    this.default = combine([]);
                }
                /**
    Define a new facet.
    */
                static define(config = {}) {
                    return new Facet(
                        config.combine || ((a) => a),
                        config.compareInput || ((a, b) => a === b),
                        config.compare ||
                            (!config.combine ? sameArray : (a, b) => a === b),
                        !!config.static,
                        config.enables
                    );
                }
                /**
    Returns an extension that adds the given value to this facet.
    */
                of(value) {
                    return new FacetProvider([], this, 0 /* Static */, value);
                }
                /**
    Create an extension that computes a value for the facet from a
    state. You must take care to declare the parts of the state that
    this value depends on, since your function is only called again
    for a new state when one of those parts changed.
    
    In cases where your value depends only on a single field, you'll
    want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
    */
                compute(deps, get) {
                    if (this.isStatic)
                        throw new Error("Can't compute a static facet");
                    return new FacetProvider(deps, this, 1 /* Single */, get);
                }
                /**
    Create an extension that computes zero or more values for this
    facet from a state.
    */
                computeN(deps, get) {
                    if (this.isStatic)
                        throw new Error("Can't compute a static facet");
                    return new FacetProvider(deps, this, 2 /* Multi */, get);
                }
                from(field, get) {
                    if (!get) get = (x) => x;
                    return this.compute([field], (state) =>
                        get(state.field(field))
                    );
                }
            }
            function sameArray(a, b) {
                return (
                    a == b ||
                    (a.length == b.length && a.every((e, i) => e === b[i]))
                );
            }
            class FacetProvider {
                constructor(dependencies, facet, type, value) {
                    this.dependencies = dependencies;
                    this.facet = facet;
                    this.type = type;
                    this.value = value;
                    this.id = nextID++;
                }
                dynamicSlot(addresses) {
                    var _a;
                    let getter = this.value;
                    let compare = this.facet.compareInput;
                    let id = this.id,
                        idx = addresses[id] >> 1,
                        multi = this.type == 2; /* Multi */
                    let depDoc = false,
                        depSel = false,
                        depAddrs = [];
                    for (let dep of this.dependencies) {
                        if (dep == "doc") depDoc = true;
                        else if (dep == "selection") depSel = true;
                        else if (
                            (((_a = addresses[dep.id]) !== null && _a !== void 0
                                ? _a
                                : 1) &
                                1) ==
                            0
                        )
                            depAddrs.push(addresses[dep.id]);
                    }
                    return {
                        create(state) {
                            state.values[idx] = getter(state);
                            return 1 /* Changed */;
                        },
                        update(state, tr) {
                            if (
                                (depDoc && tr.docChanged) ||
                                (depSel && (tr.docChanged || tr.selection)) ||
                                ensureAll(state, depAddrs)
                            ) {
                                let newVal = getter(state);
                                if (
                                    multi
                                        ? !compareArray(
                                              newVal,
                                              state.values[idx],
                                              compare
                                          )
                                        : !compare(newVal, state.values[idx])
                                ) {
                                    state.values[idx] = newVal;
                                    return 1 /* Changed */;
                                }
                            }
                            return 0;
                        },
                        reconfigure: (state, oldState) => {
                            let newVal = getter(state);
                            let oldAddr = oldState.config.address[id];
                            if (oldAddr != null) {
                                let oldVal = getAddr(oldState, oldAddr);
                                if (
                                    this.dependencies.every((dep) => {
                                        return dep instanceof Facet
                                            ? oldState.facet(dep) ===
                                                  state.facet(dep)
                                            : dep instanceof StateField
                                            ? oldState.field(dep, false) ==
                                              state.field(dep, false)
                                            : true;
                                    }) ||
                                    (multi
                                        ? compareArray(newVal, oldVal, compare)
                                        : compare(newVal, oldVal))
                                ) {
                                    state.values[idx] = oldVal;
                                    return 0;
                                }
                            }
                            state.values[idx] = newVal;
                            return 1 /* Changed */;
                        },
                    };
                }
            }
            function compareArray(a, b, compare) {
                if (a.length != b.length) return false;
                for (let i = 0; i < a.length; i++)
                    if (!compare(a[i], b[i])) return false;
                return true;
            }
            function ensureAll(state, addrs) {
                let changed = false;
                for (let addr of addrs)
                    if (ensureAddr(state, addr) & 1 /* Changed */)
                        changed = true;
                return changed;
            }
            function dynamicFacetSlot(addresses, facet, providers) {
                let providerAddrs = providers.map((p) => addresses[p.id]);
                let providerTypes = providers.map((p) => p.type);
                let dynamic = providerAddrs.filter((p) => !(p & 1));
                let idx = addresses[facet.id] >> 1;
                function get(state) {
                    let values = [];
                    for (let i = 0; i < providerAddrs.length; i++) {
                        let value = getAddr(state, providerAddrs[i]);
                        if (providerTypes[i] == 2 /* Multi */)
                            for (let val of value) values.push(val);
                        else values.push(value);
                    }
                    return facet.combine(values);
                }
                return {
                    create(state) {
                        for (let addr of providerAddrs) ensureAddr(state, addr);
                        state.values[idx] = get(state);
                        return 1 /* Changed */;
                    },
                    update(state, tr) {
                        if (!ensureAll(state, dynamic)) return 0;
                        let value = get(state);
                        if (facet.compare(value, state.values[idx])) return 0;
                        state.values[idx] = value;
                        return 1 /* Changed */;
                    },
                    reconfigure(state, oldState) {
                        let depChanged = ensureAll(state, providerAddrs);
                        let oldProviders = oldState.config.facets[facet.id],
                            oldValue = oldState.facet(facet);
                        if (
                            oldProviders &&
                            !depChanged &&
                            sameArray(providers, oldProviders)
                        ) {
                            state.values[idx] = oldValue;
                            return 0;
                        }
                        let value = get(state);
                        if (facet.compare(value, oldValue)) {
                            state.values[idx] = oldValue;
                            return 0;
                        }
                        state.values[idx] = value;
                        return 1 /* Changed */;
                    },
                };
            }
            const initField = /*@__PURE__*/ Facet.define({ static: true });
            /**
Fields can store additional information in an editor state, and
keep it in sync with the rest of the state.
*/
            class StateField {
                constructor(
                    /**
    @internal
    */
                    id,
                    createF,
                    updateF,
                    compareF,
                    /**
    @internal
    */
                    spec
                ) {
                    this.id = id;
                    this.createF = createF;
                    this.updateF = updateF;
                    this.compareF = compareF;
                    this.spec = spec;
                    /**
        @internal
        */
                    this.provides = undefined;
                }
                /**
    Define a state field.
    */
                static define(config) {
                    let field = new StateField(
                        nextID++,
                        config.create,
                        config.update,
                        config.compare || ((a, b) => a === b),
                        config
                    );
                    if (config.provide) field.provides = config.provide(field);
                    return field;
                }
                create(state) {
                    let init = state
                        .facet(initField)
                        .find((i) => i.field == this);
                    return (
                        (init === null || init === void 0
                            ? void 0
                            : init.create) || this.createF
                    )(state);
                }
                /**
    @internal
    */
                slot(addresses) {
                    let idx = addresses[this.id] >> 1;
                    return {
                        create: (state) => {
                            state.values[idx] = this.create(state);
                            return 1 /* Changed */;
                        },
                        update: (state, tr) => {
                            let oldVal = state.values[idx];
                            let value = this.updateF(oldVal, tr);
                            if (this.compareF(oldVal, value)) return 0;
                            state.values[idx] = value;
                            return 1 /* Changed */;
                        },
                        reconfigure: (state, oldState) => {
                            if (oldState.config.address[this.id] != null) {
                                state.values[idx] = oldState.field(this);
                                return 0;
                            }
                            state.values[idx] = this.create(state);
                            return 1 /* Changed */;
                        },
                    };
                }
                /**
    Returns an extension that enables this field and overrides the
    way it is initialized. Can be useful when you need to provide a
    non-default starting value for the field.
    */
                init(create) {
                    return [this, initField.of({ field: this, create })];
                }
                /**
    State field instances can be used as
    [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
    given state.
    */
                get extension() {
                    return this;
                }
            }
            const Prec_ = {
                lowest: 4,
                low: 3,
                default: 2,
                high: 1,
                highest: 0,
            };
            function prec(value) {
                return (ext) => new PrecExtension(ext, value);
            }
            /**
By default extensions are registered in the order they are found
in the flattened form of nested array that was provided.
Individual extension values can be assigned a precedence to
override this. Extensions that do not have a precedence set get
the precedence of the nearest parent with a precedence, or
[`default`](https://codemirror.net/6/docs/ref/#state.Prec.default) if there is no such parent. The
final ordering of extensions is determined by first sorting by
precedence and then by order within each precedence.
*/
            const Prec = {
                /**
    The highest precedence level, for extensions that should end up
    near the start of the precedence ordering.
    */
                highest: /*@__PURE__*/ prec(Prec_.highest),
                /**
    A higher-than-default precedence, for extensions that should
    come before those with default precedence.
    */
                high: /*@__PURE__*/ prec(Prec_.high),
                /**
    The default precedence, which is also used for extensions
    without an explicit precedence.
    */
                default: /*@__PURE__*/ prec(Prec_.default),
                /**
    A lower-than-default precedence.
    */
                low: /*@__PURE__*/ prec(Prec_.low),
                /**
    The lowest precedence level. Meant for things that should end up
    near the end of the extension order.
    */
                lowest: /*@__PURE__*/ prec(Prec_.lowest),
            };
            class PrecExtension {
                constructor(inner, prec) {
                    this.inner = inner;
                    this.prec = prec;
                }
            }
            /**
Extension compartments can be used to make a configuration
dynamic. By [wrapping](https://codemirror.net/6/docs/ref/#state.Compartment.of) part of your
configuration in a compartment, you can later
[replace](https://codemirror.net/6/docs/ref/#state.Compartment.reconfigure) that part through a
transaction.
*/
            class Compartment {
                /**
    Create an instance of this compartment to add to your [state
    configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
    */
                of(ext) {
                    return new CompartmentInstance(this, ext);
                }
                /**
    Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
    reconfigures this compartment.
    */
                reconfigure(content) {
                    return Compartment.reconfigure.of({
                        compartment: this,
                        extension: content,
                    });
                }
                /**
    Get the current content of the compartment in the state, or
    `undefined` if it isn't present.
    */
                get(state) {
                    return state.config.compartments.get(this);
                }
            }
            class CompartmentInstance {
                constructor(compartment, inner) {
                    this.compartment = compartment;
                    this.inner = inner;
                }
            }
            class Configuration {
                constructor(
                    base,
                    compartments,
                    dynamicSlots,
                    address,
                    staticValues,
                    facets
                ) {
                    this.base = base;
                    this.compartments = compartments;
                    this.dynamicSlots = dynamicSlots;
                    this.address = address;
                    this.staticValues = staticValues;
                    this.facets = facets;
                    this.statusTemplate = [];
                    while (this.statusTemplate.length < dynamicSlots.length)
                        this.statusTemplate.push(0 /* Unresolved */);
                }
                staticFacet(facet) {
                    let addr = this.address[facet.id];
                    return addr == null
                        ? facet.default
                        : this.staticValues[addr >> 1];
                }
                static resolve(base, compartments, oldState) {
                    let fields = [];
                    let facets = Object.create(null);
                    let newCompartments = new Map();
                    for (let ext of flatten(
                        base,
                        compartments,
                        newCompartments
                    )) {
                        if (ext instanceof StateField) fields.push(ext);
                        else
                            (
                                facets[ext.facet.id] ||
                                (facets[ext.facet.id] = [])
                            ).push(ext);
                    }
                    let address = Object.create(null);
                    let staticValues = [];
                    let dynamicSlots = [];
                    for (let field of fields) {
                        address[field.id] = dynamicSlots.length << 1;
                        dynamicSlots.push((a) => field.slot(a));
                    }
                    let oldFacets =
                        oldState === null || oldState === void 0
                            ? void 0
                            : oldState.config.facets;
                    for (let id in facets) {
                        let providers = facets[id],
                            facet = providers[0].facet;
                        let oldProviders = (oldFacets && oldFacets[id]) || [];
                        if (providers.every((p) => p.type == 0 /* Static */)) {
                            address[facet.id] = (staticValues.length << 1) | 1;
                            if (sameArray(oldProviders, providers)) {
                                staticValues.push(oldState.facet(facet));
                            } else {
                                let value = facet.combine(
                                    providers.map((p) => p.value)
                                );
                                staticValues.push(
                                    oldState &&
                                        facet.compare(
                                            value,
                                            oldState.facet(facet)
                                        )
                                        ? oldState.facet(facet)
                                        : value
                                );
                            }
                        } else {
                            for (let p of providers) {
                                if (p.type == 0 /* Static */) {
                                    address[p.id] =
                                        (staticValues.length << 1) | 1;
                                    staticValues.push(p.value);
                                } else {
                                    address[p.id] = dynamicSlots.length << 1;
                                    dynamicSlots.push((a) => p.dynamicSlot(a));
                                }
                            }
                            address[facet.id] = dynamicSlots.length << 1;
                            dynamicSlots.push((a) =>
                                dynamicFacetSlot(a, facet, providers)
                            );
                        }
                    }
                    let dynamic = dynamicSlots.map((f) => f(address));
                    return new Configuration(
                        base,
                        newCompartments,
                        dynamic,
                        address,
                        staticValues,
                        facets
                    );
                }
            }
            function flatten(extension, compartments, newCompartments) {
                let result = [[], [], [], [], []];
                let seen = new Map();
                function inner(ext, prec) {
                    let known = seen.get(ext);
                    if (known != null) {
                        if (known <= prec) return;
                        let found = result[known].indexOf(ext);
                        if (found > -1) result[known].splice(found, 1);
                        if (ext instanceof CompartmentInstance)
                            newCompartments.delete(ext.compartment);
                    }
                    seen.set(ext, prec);
                    if (Array.isArray(ext)) {
                        for (let e of ext) inner(e, prec);
                    } else if (ext instanceof CompartmentInstance) {
                        if (newCompartments.has(ext.compartment))
                            throw new RangeError(
                                `Duplicate use of compartment in extensions`
                            );
                        let content =
                            compartments.get(ext.compartment) || ext.inner;
                        newCompartments.set(ext.compartment, content);
                        inner(content, prec);
                    } else if (ext instanceof PrecExtension) {
                        inner(ext.inner, ext.prec);
                    } else if (ext instanceof StateField) {
                        result[prec].push(ext);
                        if (ext.provides) inner(ext.provides, prec);
                    } else if (ext instanceof FacetProvider) {
                        result[prec].push(ext);
                        if (ext.facet.extensions)
                            inner(ext.facet.extensions, prec);
                    } else {
                        let content = ext.extension;
                        if (!content)
                            throw new Error(
                                `Unrecognized extension value in extension set (${ext}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`
                            );
                        inner(content, prec);
                    }
                }
                inner(extension, Prec_.default);
                return result.reduce((a, b) => a.concat(b));
            }
            function ensureAddr(state, addr) {
                if (addr & 1) return 2 /* Computed */;
                let idx = addr >> 1;
                let status = state.status[idx];
                if (status == 4 /* Computing */)
                    throw new Error(
                        "Cyclic dependency between fields and/or facets"
                    );
                if (status & 2 /* Computed */) return status;
                state.status[idx] = 4 /* Computing */;
                let changed = state.computeSlot(
                    state,
                    state.config.dynamicSlots[idx]
                );
                return (state.status[idx] = 2 /* Computed */ | changed);
            }
            function getAddr(state, addr) {
                return addr & 1
                    ? state.config.staticValues[addr >> 1]
                    : state.values[addr >> 1];
            }

            const languageData = /*@__PURE__*/ Facet.define();
            const allowMultipleSelections = /*@__PURE__*/ Facet.define({
                combine: (values) => values.some((v) => v),
                static: true,
            });
            const lineSeparator = /*@__PURE__*/ Facet.define({
                combine: (values) => (values.length ? values[0] : undefined),
                static: true,
            });
            const changeFilter = /*@__PURE__*/ Facet.define();
            const transactionFilter = /*@__PURE__*/ Facet.define();
            const transactionExtender = /*@__PURE__*/ Facet.define();
            const readOnly = /*@__PURE__*/ Facet.define({
                combine: (values) => (values.length ? values[0] : false),
            });

            /**
Annotations are tagged values that are used to add metadata to
transactions in an extensible way. They should be used to model
things that effect the entire transaction (such as its [time
stamp](https://codemirror.net/6/docs/ref/#state.Transaction^time) or information about its
[origin](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent)). For effects that happen
_alongside_ the other changes made by the transaction, [state
effects](https://codemirror.net/6/docs/ref/#state.StateEffect) are more appropriate.
*/
            class Annotation {
                /**
    @internal
    */
                constructor(
                    /**
    The annotation type.
    */
                    type,
                    /**
    The value of this annotation.
    */
                    value
                ) {
                    this.type = type;
                    this.value = value;
                }
                /**
    Define a new type of annotation.
    */
                static define() {
                    return new AnnotationType();
                }
            }
            /**
Marker that identifies a type of [annotation](https://codemirror.net/6/docs/ref/#state.Annotation).
*/
            class AnnotationType {
                /**
    Create an instance of this annotation.
    */
                of(value) {
                    return new Annotation(this, value);
                }
            }
            /**
Representation of a type of state effect. Defined with
[`StateEffect.define`](https://codemirror.net/6/docs/ref/#state.StateEffect^define).
*/
            class StateEffectType {
                /**
    @internal
    */
                constructor(
                    // The `any` types in these function types are there to work
                    // around TypeScript issue #37631, where the type guard on
                    // `StateEffect.is` mysteriously stops working when these properly
                    // have type `Value`.
                    /**
    @internal
    */
                    map
                ) {
                    this.map = map;
                }
                /**
    Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
    type.
    */
                of(value) {
                    return new StateEffect(this, value);
                }
            }
            /**
State effects can be used to represent additional effects
associated with a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction.effects). They
are often useful to model changes to custom [state
fields](https://codemirror.net/6/docs/ref/#state.StateField), when those changes aren't implicit in
document or selection changes.
*/
            class StateEffect {
                /**
    @internal
    */
                constructor(
                    /**
    @internal
    */
                    type,
                    /**
    The value of this effect.
    */
                    value
                ) {
                    this.type = type;
                    this.value = value;
                }
                /**
    Map this effect through a position mapping. Will return
    `undefined` when that ends up deleting the effect.
    */
                map(mapping) {
                    let mapped = this.type.map(this.value, mapping);
                    return mapped === undefined
                        ? undefined
                        : mapped == this.value
                        ? this
                        : new StateEffect(this.type, mapped);
                }
                /**
    Tells you whether this effect object is of a given
    [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
    */
                is(type) {
                    return this.type == type;
                }
                /**
    Define a new effect type. The type parameter indicates the type
    of values that his effect holds.
    */
                static define(spec = {}) {
                    return new StateEffectType(spec.map || ((v) => v));
                }
                /**
    Map an array of effects through a change set.
    */
                static mapEffects(effects, mapping) {
                    if (!effects.length) return effects;
                    let result = [];
                    for (let effect of effects) {
                        let mapped = effect.map(mapping);
                        if (mapped) result.push(mapped);
                    }
                    return result;
                }
            }
            /**
This effect can be used to reconfigure the root extensions of
the editor. Doing this will discard any extensions
[appended](https://codemirror.net/6/docs/ref/#state.StateEffect^appendConfig), but does not reset
the content of [reconfigured](https://codemirror.net/6/docs/ref/#state.Compartment.reconfigure)
compartments.
*/
            StateEffect.reconfigure = /*@__PURE__*/ StateEffect.define();
            /**
Append extensions to the top-level configuration of the editor.
*/
            StateEffect.appendConfig = /*@__PURE__*/ StateEffect.define();
            /**
Changes to the editor state are grouped into transactions.
Typically, a user action creates a single transaction, which may
contain any number of document changes, may change the selection,
or have other effects. Create a transaction by calling
[`EditorState.update`](https://codemirror.net/6/docs/ref/#state.EditorState.update), or immediately
dispatch one by calling
[`EditorView.dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch).
*/
            class Transaction {
                /**
    @internal
    */
                constructor(
                    /**
    The state from which the transaction starts.
    */
                    startState,
                    /**
    The document changes made by this transaction.
    */
                    changes,
                    /**
    The selection set by this transaction, or undefined if it
    doesn't explicitly set a selection.
    */
                    selection,
                    /**
    The effects added to the transaction.
    */
                    effects,
                    /**
    @internal
    */
                    annotations,
                    /**
    Whether the selection should be scrolled into view after this
    transaction is dispatched.
    */
                    scrollIntoView
                ) {
                    this.startState = startState;
                    this.changes = changes;
                    this.selection = selection;
                    this.effects = effects;
                    this.annotations = annotations;
                    this.scrollIntoView = scrollIntoView;
                    /**
        @internal
        */
                    this._doc = null;
                    /**
        @internal
        */
                    this._state = null;
                    if (selection) checkSelection(selection, changes.newLength);
                    if (!annotations.some((a) => a.type == Transaction.time))
                        this.annotations = annotations.concat(
                            Transaction.time.of(Date.now())
                        );
                }
                /**
    The new document produced by the transaction. Contrary to
    [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
    force the entire new state to be computed right away, so it is
    recommended that [transaction
    filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
    when they need to look at the new document.
    */
                get newDoc() {
                    return (
                        this._doc ||
                        (this._doc = this.changes.apply(this.startState.doc))
                    );
                }
                /**
    The new selection produced by the transaction. If
    [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
    this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
    current selection through the changes made by the transaction.
    */
                get newSelection() {
                    return (
                        this.selection ||
                        this.startState.selection.map(this.changes)
                    );
                }
                /**
    The new state created by the transaction. Computed on demand
    (but retained for subsequent access), so it is recommended not to
    access it in [transaction
    filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
    */
                get state() {
                    if (!this._state) this.startState.applyTransaction(this);
                    return this._state;
                }
                /**
    Get the value of the given annotation type, if any.
    */
                annotation(type) {
                    for (let ann of this.annotations)
                        if (ann.type == type) return ann.value;
                    return undefined;
                }
                /**
    Indicates whether the transaction changed the document.
    */
                get docChanged() {
                    return !this.changes.empty;
                }
                /**
    Indicates whether this transaction reconfigures the state
    (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
    with a top-level configuration
    [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
    */
                get reconfigured() {
                    return this.startState.config != this.state.config;
                }
                /**
    Returns true if the transaction has a [user
    event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
    or more specific than `event`. For example, if the transaction
    has `"select.pointer"` as user event, `"select"` and
    `"select.pointer"` will match it.
    */
                isUserEvent(event) {
                    let e = this.annotation(Transaction.userEvent);
                    return !!(
                        e &&
                        (e == event ||
                            (e.length > event.length &&
                                e.slice(0, event.length) == event &&
                                e[event.length] == "."))
                    );
                }
            }
            /**
Annotation used to store transaction timestamps. Automatically
added to every transaction, holding `Date.now()`.
*/
            Transaction.time = /*@__PURE__*/ Annotation.define();
            /**
Annotation used to associate a transaction with a user interface
event. Holds a string identifying the event, using a
dot-separated format to support attaching more specific
information. The events used by the core libraries are:

 - `"input"` when content is entered
   - `"input.type"` for typed input
     - `"input.type.compose"` for composition
   - `"input.paste"` for pasted input
   - `"input.drop"` when adding content with drag-and-drop
   - `"input.complete"` when autocompleting
 - `"delete"` when the user deletes content
   - `"delete.selection"` when deleting the selection
   - `"delete.forward"` when deleting forward from the selection
   - `"delete.backward"` when deleting backward from the selection
   - `"delete.cut"` when cutting to the clipboard
 - `"move"` when content is moved
   - `"move.drop"` when content is moved within the editor through drag-and-drop
 - `"select"` when explicitly changing the selection
   - `"select.pointer"` when selecting with a mouse or other pointing device
 - `"undo"` and `"redo"` for history actions

Use [`isUserEvent`](https://codemirror.net/6/docs/ref/#state.Transaction.isUserEvent) to check
whether the annotation matches a given event.
*/
            Transaction.userEvent = /*@__PURE__*/ Annotation.define();
            /**
Annotation indicating whether a transaction should be added to
the undo history or not.
*/
            Transaction.addToHistory = /*@__PURE__*/ Annotation.define();
            /**
Annotation indicating (when present and true) that a transaction
represents a change made by some other actor, not the user. This
is used, for example, to tag other people's changes in
collaborative editing.
*/
            Transaction.remote = /*@__PURE__*/ Annotation.define();
            function joinRanges(a, b) {
                let result = [];
                for (let iA = 0, iB = 0; ; ) {
                    let from, to;
                    if (iA < a.length && (iB == b.length || b[iB] >= a[iA])) {
                        from = a[iA++];
                        to = a[iA++];
                    } else if (iB < b.length) {
                        from = b[iB++];
                        to = b[iB++];
                    } else return result;
                    if (!result.length || result[result.length - 1] < from)
                        result.push(from, to);
                    else if (result[result.length - 1] < to)
                        result[result.length - 1] = to;
                }
            }
            function mergeTransaction(a, b, sequential) {
                var _a;
                let mapForA, mapForB, changes;
                if (sequential) {
                    mapForA = b.changes;
                    mapForB = ChangeSet.empty(b.changes.length);
                    changes = a.changes.compose(b.changes);
                } else {
                    mapForA = b.changes.map(a.changes);
                    mapForB = a.changes.mapDesc(b.changes, true);
                    changes = a.changes.compose(mapForA);
                }
                return {
                    changes,
                    selection: b.selection
                        ? b.selection.map(mapForB)
                        : (_a = a.selection) === null || _a === void 0
                        ? void 0
                        : _a.map(mapForA),
                    effects: StateEffect.mapEffects(a.effects, mapForA).concat(
                        StateEffect.mapEffects(b.effects, mapForB)
                    ),
                    annotations: a.annotations.length
                        ? a.annotations.concat(b.annotations)
                        : b.annotations,
                    scrollIntoView: a.scrollIntoView || b.scrollIntoView,
                };
            }
            function resolveTransactionInner(state, spec, docSize) {
                let sel = spec.selection,
                    annotations = asArray(spec.annotations);
                if (spec.userEvent)
                    annotations = annotations.concat(
                        Transaction.userEvent.of(spec.userEvent)
                    );
                return {
                    changes:
                        spec.changes instanceof ChangeSet
                            ? spec.changes
                            : ChangeSet.of(
                                  spec.changes || [],
                                  docSize,
                                  state.facet(lineSeparator)
                              ),
                    selection:
                        sel &&
                        (sel instanceof EditorSelection
                            ? sel
                            : EditorSelection.single(sel.anchor, sel.head)),
                    effects: asArray(spec.effects),
                    annotations,
                    scrollIntoView: !!spec.scrollIntoView,
                };
            }
            function resolveTransaction(state, specs, filter) {
                let s = resolveTransactionInner(
                    state,
                    specs.length ? specs[0] : {},
                    state.doc.length
                );
                if (specs.length && specs[0].filter === false) filter = false;
                for (let i = 1; i < specs.length; i++) {
                    if (specs[i].filter === false) filter = false;
                    let seq = !!specs[i].sequential;
                    s = mergeTransaction(
                        s,
                        resolveTransactionInner(
                            state,
                            specs[i],
                            seq ? s.changes.newLength : state.doc.length
                        ),
                        seq
                    );
                }
                let tr = new Transaction(
                    state,
                    s.changes,
                    s.selection,
                    s.effects,
                    s.annotations,
                    s.scrollIntoView
                );
                return extendTransaction(filter ? filterTransaction(tr) : tr);
            }
            // Finish a transaction by applying filters if necessary.
            function filterTransaction(tr) {
                let state = tr.startState;
                // Change filters
                let result = true;
                for (let filter of state.facet(changeFilter)) {
                    let value = filter(tr);
                    if (value === false) {
                        result = false;
                        break;
                    }
                    if (Array.isArray(value))
                        result =
                            result === true ? value : joinRanges(result, value);
                }
                if (result !== true) {
                    let changes, back;
                    if (result === false) {
                        back = tr.changes.invertedDesc;
                        changes = ChangeSet.empty(state.doc.length);
                    } else {
                        let filtered = tr.changes.filter(result);
                        changes = filtered.changes;
                        back = filtered.filtered.invertedDesc;
                    }
                    tr = new Transaction(
                        state,
                        changes,
                        tr.selection && tr.selection.map(back),
                        StateEffect.mapEffects(tr.effects, back),
                        tr.annotations,
                        tr.scrollIntoView
                    );
                }
                // Transaction filters
                let filters = state.facet(transactionFilter);
                for (let i = filters.length - 1; i >= 0; i--) {
                    let filtered = filters[i](tr);
                    if (filtered instanceof Transaction) tr = filtered;
                    else if (
                        Array.isArray(filtered) &&
                        filtered.length == 1 &&
                        filtered[0] instanceof Transaction
                    )
                        tr = filtered[0];
                    else
                        tr = resolveTransaction(
                            state,
                            asArray(filtered),
                            false
                        );
                }
                return tr;
            }
            function extendTransaction(tr) {
                let state = tr.startState,
                    extenders = state.facet(transactionExtender),
                    spec = tr;
                for (let i = extenders.length - 1; i >= 0; i--) {
                    let extension = extenders[i](tr);
                    if (extension && Object.keys(extension).length)
                        spec = mergeTransaction(
                            tr,
                            resolveTransactionInner(
                                state,
                                extension,
                                tr.changes.newLength
                            ),
                            true
                        );
                }
                return spec == tr
                    ? tr
                    : new Transaction(
                          state,
                          tr.changes,
                          tr.selection,
                          spec.effects,
                          spec.annotations,
                          spec.scrollIntoView
                      );
            }
            const none = [];
            function asArray(value) {
                return value == null
                    ? none
                    : Array.isArray(value)
                    ? value
                    : [value];
            }

            /**
The categories produced by a [character
categorizer](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer). These are used
do things like selecting by word.
*/
            var CharCategory = /*@__PURE__*/ (function (CharCategory) {
                /**
    Word characters.
    */
                CharCategory[(CharCategory["Word"] = 0)] = "Word";
                /**
    Whitespace.
    */
                CharCategory[(CharCategory["Space"] = 1)] = "Space";
                /**
    Anything else.
    */
                CharCategory[(CharCategory["Other"] = 2)] = "Other";
                return CharCategory;
            })(CharCategory || (CharCategory = {}));
            const nonASCIISingleCaseWordChar =
                /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
            let wordChar;
            try {
                wordChar = /*@__PURE__*/ new RegExp(
                    "[\\p{Alphabetic}\\p{Number}_]",
                    "u"
                );
            } catch (_) {}
            function hasWordChar(str) {
                if (wordChar) return wordChar.test(str);
                for (let i = 0; i < str.length; i++) {
                    let ch = str[i];
                    if (
                        /\w/.test(ch) ||
                        (ch > "\x80" &&
                            (ch.toUpperCase() != ch.toLowerCase() ||
                                nonASCIISingleCaseWordChar.test(ch)))
                    )
                        return true;
                }
                return false;
            }
            function makeCategorizer(wordChars) {
                return (char) => {
                    if (!/\S/.test(char)) return CharCategory.Space;
                    if (hasWordChar(char)) return CharCategory.Word;
                    for (let i = 0; i < wordChars.length; i++)
                        if (char.indexOf(wordChars[i]) > -1)
                            return CharCategory.Word;
                    return CharCategory.Other;
                };
            }

            /**
The editor state class is a persistent (immutable) data structure.
To update a state, you [create](https://codemirror.net/6/docs/ref/#state.EditorState.update) a
[transaction](https://codemirror.net/6/docs/ref/#state.Transaction), which produces a _new_ state
instance, without modifying the original object.

As such, _never_ mutate properties of a state directly. That'll
just break things.
*/
            class EditorState {
                /**
    @internal
    */
                constructor(
                    /**
    @internal
    */
                    config,
                    /**
    The current document.
    */
                    doc,
                    /**
    The current selection.
    */
                    selection,
                    /**
    @internal
    */
                    values,
                    computeSlot,
                    tr
                ) {
                    this.config = config;
                    this.doc = doc;
                    this.selection = selection;
                    this.values = values;
                    this.status = config.statusTemplate.slice();
                    this.computeSlot = computeSlot;
                    // Fill in the computed state immediately, so that further queries
                    // for it made during the update return this state
                    if (tr) tr._state = this;
                    for (let i = 0; i < this.config.dynamicSlots.length; i++)
                        ensureAddr(this, i << 1);
                    this.computeSlot = null;
                }
                field(field, require = true) {
                    let addr = this.config.address[field.id];
                    if (addr == null) {
                        if (require)
                            throw new RangeError(
                                "Field is not present in this state"
                            );
                        return undefined;
                    }
                    ensureAddr(this, addr);
                    return getAddr(this, addr);
                }
                /**
    Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
    state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
    can be passed. Unless
    [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
    [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
    are assumed to start in the _current_ document (not the document
    produced by previous specs), and its
    [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
    [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
    to the document created by its _own_ changes. The resulting
    transaction contains the combined effect of all the different
    specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
    specs take precedence over earlier ones.
    */
                update(...specs) {
                    return resolveTransaction(this, specs, true);
                }
                /**
    @internal
    */
                applyTransaction(tr) {
                    let conf = this.config,
                        { base, compartments } = conf;
                    for (let effect of tr.effects) {
                        if (effect.is(Compartment.reconfigure)) {
                            if (conf) {
                                compartments = new Map();
                                conf.compartments.forEach((val, key) =>
                                    compartments.set(key, val)
                                );
                                conf = null;
                            }
                            compartments.set(
                                effect.value.compartment,
                                effect.value.extension
                            );
                        } else if (effect.is(StateEffect.reconfigure)) {
                            conf = null;
                            base = effect.value;
                        } else if (effect.is(StateEffect.appendConfig)) {
                            conf = null;
                            base = asArray(base).concat(effect.value);
                        }
                    }
                    let startValues;
                    if (!conf) {
                        conf = Configuration.resolve(base, compartments, this);
                        let intermediateState = new EditorState(
                            conf,
                            this.doc,
                            this.selection,
                            conf.dynamicSlots.map(() => null),
                            (state, slot) => slot.reconfigure(state, this),
                            null
                        );
                        startValues = intermediateState.values;
                    } else {
                        startValues = tr.startState.values.slice();
                    }
                    new EditorState(
                        conf,
                        tr.newDoc,
                        tr.newSelection,
                        startValues,
                        (state, slot) => slot.update(state, tr),
                        tr
                    );
                }
                /**
    Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
    replaces every selection range with the given content.
    */
                replaceSelection(text) {
                    if (typeof text == "string") text = this.toText(text);
                    return this.changeByRange((range) => ({
                        changes: {
                            from: range.from,
                            to: range.to,
                            insert: text,
                        },
                        range: EditorSelection.cursor(range.from + text.length),
                    }));
                }
                /**
    Create a set of changes and a new selection by running the given
    function for each range in the active selection. The function
    can return an optional set of changes (in the coordinate space
    of the start document), plus an updated range (in the coordinate
    space of the document produced by the call's own changes). This
    method will merge all the changes and ranges into a single
    changeset and selection, and return it as a [transaction
    spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
    [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
    */
                changeByRange(f) {
                    let sel = this.selection;
                    let result1 = f(sel.ranges[0]);
                    let changes = this.changes(result1.changes),
                        ranges = [result1.range];
                    let effects = asArray(result1.effects);
                    for (let i = 1; i < sel.ranges.length; i++) {
                        let result = f(sel.ranges[i]);
                        let newChanges = this.changes(result.changes),
                            newMapped = newChanges.map(changes);
                        for (let j = 0; j < i; j++)
                            ranges[j] = ranges[j].map(newMapped);
                        let mapBy = changes.mapDesc(newChanges, true);
                        ranges.push(result.range.map(mapBy));
                        changes = changes.compose(newMapped);
                        effects = StateEffect.mapEffects(
                            effects,
                            newMapped
                        ).concat(
                            StateEffect.mapEffects(
                                asArray(result.effects),
                                mapBy
                            )
                        );
                    }
                    return {
                        changes,
                        selection: EditorSelection.create(
                            ranges,
                            sel.mainIndex
                        ),
                        effects,
                    };
                }
                /**
    Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
    description, taking the state's document length and line
    separator into account.
    */
                changes(spec = []) {
                    if (spec instanceof ChangeSet) return spec;
                    return ChangeSet.of(
                        spec,
                        this.doc.length,
                        this.facet(EditorState.lineSeparator)
                    );
                }
                /**
    Using the state's [line
    separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
    [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
    */
                toText(string) {
                    return Text.of(
                        string.split(
                            this.facet(EditorState.lineSeparator) ||
                                DefaultSplit
                        )
                    );
                }
                /**
    Return the given range of the document as a string.
    */
                sliceDoc(from = 0, to = this.doc.length) {
                    return this.doc.sliceString(from, to, this.lineBreak);
                }
                /**
    Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
    */
                facet(facet) {
                    let addr = this.config.address[facet.id];
                    if (addr == null) return facet.default;
                    ensureAddr(this, addr);
                    return getAddr(this, addr);
                }
                /**
    Convert this state to a JSON-serializable object. When custom
    fields should be serialized, you can pass them in as an object
    mapping property names (in the resulting object, which should
    not use `doc` or `selection`) to fields.
    */
                toJSON(fields) {
                    let result = {
                        doc: this.sliceDoc(),
                        selection: this.selection.toJSON(),
                    };
                    if (fields)
                        for (let prop in fields) {
                            let value = fields[prop];
                            if (value instanceof StateField)
                                result[prop] = value.spec.toJSON(
                                    this.field(fields[prop]),
                                    this
                                );
                        }
                    return result;
                }
                /**
    Deserialize a state from its JSON representation. When custom
    fields should be deserialized, pass the same object you passed
    to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
    third argument.
    */
                static fromJSON(json, config = {}, fields) {
                    if (!json || typeof json.doc != "string")
                        throw new RangeError(
                            "Invalid JSON representation for EditorState"
                        );
                    let fieldInit = [];
                    if (fields)
                        for (let prop in fields) {
                            let field = fields[prop],
                                value = json[prop];
                            fieldInit.push(
                                field.init((state) =>
                                    field.spec.fromJSON(value, state)
                                )
                            );
                        }
                    return EditorState.create({
                        doc: json.doc,
                        selection: EditorSelection.fromJSON(json.selection),
                        extensions: config.extensions
                            ? fieldInit.concat([config.extensions])
                            : fieldInit,
                    });
                }
                /**
    Create a new state. You'll usually only need this when
    initializing an editor—updated states are created by applying
    transactions.
    */
                static create(config = {}) {
                    let configuration = Configuration.resolve(
                        config.extensions || [],
                        new Map()
                    );
                    let doc =
                        config.doc instanceof Text
                            ? config.doc
                            : Text.of(
                                  (config.doc || "").split(
                                      configuration.staticFacet(
                                          EditorState.lineSeparator
                                      ) || DefaultSplit
                                  )
                              );
                    let selection = !config.selection
                        ? EditorSelection.single(0)
                        : config.selection instanceof EditorSelection
                        ? config.selection
                        : EditorSelection.single(
                              config.selection.anchor,
                              config.selection.head
                          );
                    checkSelection(selection, doc.length);
                    if (!configuration.staticFacet(allowMultipleSelections))
                        selection = selection.asSingle();
                    return new EditorState(
                        configuration,
                        doc,
                        selection,
                        configuration.dynamicSlots.map(() => null),
                        (state, slot) => slot.create(state),
                        null
                    );
                }
                /**
    The size (in columns) of a tab in the document, determined by
    the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
    */
                get tabSize() {
                    return this.facet(EditorState.tabSize);
                }
                /**
    Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
    string for this state.
    */
                get lineBreak() {
                    return this.facet(EditorState.lineSeparator) || "\n";
                }
                /**
    Returns true when the editor is
    [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
    */
                get readOnly() {
                    return this.facet(readOnly);
                }
                /**
    Look up a translation for the given phrase (via the
    [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
    original string if no translation is found.
    */
                phrase(phrase) {
                    for (let map of this.facet(EditorState.phrases))
                        if (Object.prototype.hasOwnProperty.call(map, phrase))
                            return map[phrase];
                    return phrase;
                }
                /**
    Find the values for a given language data field, provided by the
    the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
    */
                languageDataAt(name, pos, side = -1) {
                    let values = [];
                    for (let provider of this.facet(languageData)) {
                        for (let result of provider(this, pos, side)) {
                            if (
                                Object.prototype.hasOwnProperty.call(
                                    result,
                                    name
                                )
                            )
                                values.push(result[name]);
                        }
                    }
                    return values;
                }
                /**
    Return a function that can categorize strings (expected to
    represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
    into one of:
    
     - Word (contains an alphanumeric character or a character
       explicitly listed in the local language's `"wordChars"`
       language data, which should be a string)
     - Space (contains only whitespace)
     - Other (anything else)
    */
                charCategorizer(at) {
                    return makeCategorizer(
                        this.languageDataAt("wordChars", at).join("")
                    );
                }
                /**
    Find the word at the given position, meaning the range
    containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
    around it. If no word characters are adjacent to the position,
    this returns null.
    */
                wordAt(pos) {
                    let { text, from, length } = this.doc.lineAt(pos);
                    let cat = this.charCategorizer(pos);
                    let start = pos - from,
                        end = pos - from;
                    while (start > 0) {
                        let prev = findClusterBreak(text, start, false);
                        if (cat(text.slice(prev, start)) != CharCategory.Word)
                            break;
                        start = prev;
                    }
                    while (end < length) {
                        let next = findClusterBreak(text, end);
                        if (cat(text.slice(end, next)) != CharCategory.Word)
                            break;
                        end = next;
                    }
                    return start == end
                        ? null
                        : EditorSelection.range(start + from, end + from);
                }
            }
            /**
A facet that, when enabled, causes the editor to allow multiple
ranges to be selected. Be careful though, because by default the
editor relies on the native DOM selection, which cannot handle
multiple selections. An extension like
[`drawSelection`](https://codemirror.net/6/docs/ref/#view.drawSelection) can be used to make
secondary selections visible to the user.
*/
            EditorState.allowMultipleSelections = allowMultipleSelections;
            /**
Configures the tab size to use in this state. The first
(highest-precedence) value of the facet is used. If no value is
given, this defaults to 4.
*/
            EditorState.tabSize = /*@__PURE__*/ Facet.define({
                combine: (values) => (values.length ? values[0] : 4),
            });
            /**
The line separator to use. By default, any of `"\n"`, `"\r\n"`
and `"\r"` is treated as a separator when splitting lines, and
lines are joined with `"\n"`.

When you configure a value here, only that precise separator
will be used, allowing you to round-trip documents through the
editor without normalizing line separators.
*/
            EditorState.lineSeparator = lineSeparator;
            /**
This facet controls the value of the
[`readOnly`](https://codemirror.net/6/docs/ref/#state.EditorState.readOnly) getter, which is
consulted by commands and extensions that implement editing
functionality to determine whether they should apply. It
defaults to false, but when its highest-precedence value is
`true`, such functionality disables itself.

Not to be confused with
[`EditorView.editable`](https://codemirror.net/6/docs/ref/#view.EditorView^editable), which
controls whether the editor's DOM is set to be editable (and
thus focusable).
*/
            EditorState.readOnly = readOnly;
            /**
Registers translation phrases. The
[`phrase`](https://codemirror.net/6/docs/ref/#state.EditorState.phrase) method will look through
all objects registered with this facet to find translations for
its argument.
*/
            EditorState.phrases = /*@__PURE__*/ Facet.define({
                compare(a, b) {
                    let kA = Object.keys(a),
                        kB = Object.keys(b);
                    return (
                        kA.length == kB.length && kA.every((k) => a[k] == b[k])
                    );
                },
            });
            /**
A facet used to register [language
data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt) providers.
*/
            EditorState.languageData = languageData;
            /**
Facet used to register change filters, which are called for each
transaction (unless explicitly
[disabled](https://codemirror.net/6/docs/ref/#state.TransactionSpec.filter)), and can suppress
part of the transaction's changes.

Such a function can return `true` to indicate that it doesn't
want to do anything, `false` to completely stop the changes in
the transaction, or a set of ranges in which changes should be
suppressed. Such ranges are represented as an array of numbers,
with each pair of two numbers indicating the start and end of a
range. So for example `[10, 20, 100, 110]` suppresses changes
between 10 and 20, and between 100 and 110.
*/
            EditorState.changeFilter = changeFilter;
            /**
Facet used to register a hook that gets a chance to update or
replace transaction specs before they are applied. This will
only be applied for transactions that don't have
[`filter`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.filter) set to `false`. You
can either return a single transaction spec (possibly the input
transaction), or an array of specs (which will be combined in
the same way as the arguments to
[`EditorState.update`](https://codemirror.net/6/docs/ref/#state.EditorState.update)).

When possible, it is recommended to avoid accessing
[`Transaction.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state) in a filter,
since it will force creation of a state that will then be
discarded again, if the transaction is actually filtered.

(This functionality should be used with care. Indiscriminately
modifying transaction is likely to break something or degrade
the user experience.)
*/
            EditorState.transactionFilter = transactionFilter;
            /**
This is a more limited form of
[`transactionFilter`](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter),
which can only add
[annotations](https://codemirror.net/6/docs/ref/#state.TransactionSpec.annotations) and
[effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects). _But_, this type
of filter runs even if the transaction has disabled regular
[filtering](https://codemirror.net/6/docs/ref/#state.TransactionSpec.filter), making it suitable
for effects that don't need to touch the changes or selection,
but do want to process every transaction.

Extenders run _after_ filters, when both are present.
*/
            EditorState.transactionExtender = transactionExtender;
            Compartment.reconfigure = /*@__PURE__*/ StateEffect.define();

            /**
Utility function for combining behaviors to fill in a config
object from an array of provided configs. `defaults` should hold
default values for all optional fields in `Config`.

The function will, by default, error
when a field gets two values that aren't `===`-equal, but you can
provide combine functions per field to do something else.
*/
            function combineConfig(
                configs,
                defaults, // Should hold only the optional properties of Config, but I haven't managed to express that
                combine = {}
            ) {
                let result = {};
                for (let config of configs)
                    for (let key of Object.keys(config)) {
                        let value = config[key],
                            current = result[key];
                        if (current === undefined) result[key] = value;
                        else if (current === value || value === undefined);
                        else if (Object.hasOwnProperty.call(combine, key))
                            // No conflict
                            result[key] = combine[key](current, value);
                        else
                            throw new Error(
                                "Config merge conflict for field " + key
                            );
                    }
                for (let key in defaults)
                    if (result[key] === undefined) result[key] = defaults[key];
                return result;
            }

            /**
Each range is associated with a value, which must inherit from
this class.
*/
            class RangeValue {
                /**
    Compare this value with another value. Used when comparing
    rangesets. The default implementation compares by identity.
    Unless you are only creating a fixed number of unique instances
    of your value type, it is a good idea to implement this
    properly.
    */
                eq(other) {
                    return this == other;
                }
                /**
    Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
    */
                range(from, to = from) {
                    return new Range(from, to, this);
                }
            }
            RangeValue.prototype.startSide = RangeValue.prototype.endSide = 0;
            RangeValue.prototype.point = false;
            RangeValue.prototype.mapMode = MapMode.TrackDel;
            /**
A range associates a value with a range of positions.
*/
            class Range {
                /**
    @internal
    */
                constructor(
                    /**
    The range's start position.
    */
                    from,
                    /**
    Its end position.
    */
                    to,
                    /**
    The value associated with this range.
    */
                    value
                ) {
                    this.from = from;
                    this.to = to;
                    this.value = value;
                }
            }
            function cmpRange(a, b) {
                return a.from - b.from || a.value.startSide - b.value.startSide;
            }
            class Chunk {
                constructor(
                    from,
                    to,
                    value,
                    // Chunks are marked with the largest point that occurs
                    // in them (or -1 for no points), so that scans that are
                    // only interested in points (such as the
                    // heightmap-related logic) can skip range-only chunks.
                    maxPoint
                ) {
                    this.from = from;
                    this.to = to;
                    this.value = value;
                    this.maxPoint = maxPoint;
                }
                get length() {
                    return this.to[this.to.length - 1];
                }
                // Find the index of the given position and side. Use the ranges'
                // `from` pos when `end == false`, `to` when `end == true`.
                findIndex(pos, side, end, startAt = 0) {
                    let arr = end ? this.to : this.from;
                    for (let lo = startAt, hi = arr.length; ; ) {
                        if (lo == hi) return lo;
                        let mid = (lo + hi) >> 1;
                        let diff =
                            arr[mid] - pos ||
                            (end
                                ? this.value[mid].endSide
                                : this.value[mid].startSide) - side;
                        if (mid == lo) return diff >= 0 ? lo : hi;
                        if (diff >= 0) hi = mid;
                        else lo = mid + 1;
                    }
                }
                between(offset, from, to, f) {
                    for (
                        let i = this.findIndex(
                                from,
                                -1000000000 /* Far */,
                                true
                            ),
                            e = this.findIndex(
                                to,
                                1000000000 /* Far */,
                                false,
                                i
                            );
                        i < e;
                        i++
                    )
                        if (
                            f(
                                this.from[i] + offset,
                                this.to[i] + offset,
                                this.value[i]
                            ) === false
                        )
                            return false;
                }
                map(offset, changes) {
                    let value = [],
                        from = [],
                        to = [],
                        newPos = -1,
                        maxPoint = -1;
                    for (let i = 0; i < this.value.length; i++) {
                        let val = this.value[i],
                            curFrom = this.from[i] + offset,
                            curTo = this.to[i] + offset,
                            newFrom,
                            newTo;
                        if (curFrom == curTo) {
                            let mapped = changes.mapPos(
                                curFrom,
                                val.startSide,
                                val.mapMode
                            );
                            if (mapped == null) continue;
                            newFrom = newTo = mapped;
                            if (val.startSide != val.endSide) {
                                newTo = changes.mapPos(curFrom, val.endSide);
                                if (newTo < newFrom) continue;
                            }
                        } else {
                            newFrom = changes.mapPos(curFrom, val.startSide);
                            newTo = changes.mapPos(curTo, val.endSide);
                            if (
                                newFrom > newTo ||
                                (newFrom == newTo &&
                                    val.startSide > 0 &&
                                    val.endSide <= 0)
                            )
                                continue;
                        }
                        if (
                            (newTo - newFrom || val.endSide - val.startSide) < 0
                        )
                            continue;
                        if (newPos < 0) newPos = newFrom;
                        if (val.point)
                            maxPoint = Math.max(maxPoint, newTo - newFrom);
                        value.push(val);
                        from.push(newFrom - newPos);
                        to.push(newTo - newPos);
                    }
                    return {
                        mapped: value.length
                            ? new Chunk(from, to, value, maxPoint)
                            : null,
                        pos: newPos,
                    };
                }
            }
            /**
A range set stores a collection of [ranges](https://codemirror.net/6/docs/ref/#state.Range) in a
way that makes them efficient to [map](https://codemirror.net/6/docs/ref/#state.RangeSet.map) and
[update](https://codemirror.net/6/docs/ref/#state.RangeSet.update). This is an immutable data
structure.
*/
            class RangeSet {
                /**
    @internal
    */
                constructor(
                    /**
    @internal
    */
                    chunkPos,
                    /**
    @internal
    */
                    chunk,
                    /**
    @internal
    */
                    nextLayer = RangeSet.empty,
                    /**
    @internal
    */
                    maxPoint
                ) {
                    this.chunkPos = chunkPos;
                    this.chunk = chunk;
                    this.nextLayer = nextLayer;
                    this.maxPoint = maxPoint;
                }
                /**
    @internal
    */
                get length() {
                    let last = this.chunk.length - 1;
                    return last < 0
                        ? 0
                        : Math.max(this.chunkEnd(last), this.nextLayer.length);
                }
                /**
    The number of ranges in the set.
    */
                get size() {
                    if (this.isEmpty) return 0;
                    let size = this.nextLayer.size;
                    for (let chunk of this.chunk) size += chunk.value.length;
                    return size;
                }
                /**
    @internal
    */
                chunkEnd(index) {
                    return this.chunkPos[index] + this.chunk[index].length;
                }
                /**
    Update the range set, optionally adding new ranges or filtering
    out existing ones.
    
    (Note: The type parameter is just there as a kludge to work
    around TypeScript variance issues that prevented `RangeSet<X>`
    from being a subtype of `RangeSet<Y>` when `X` is a subtype of
    `Y`.)
    */
                update(updateSpec) {
                    let {
                        add = [],
                        sort = false,
                        filterFrom = 0,
                        filterTo = this.length,
                    } = updateSpec;
                    let filter = updateSpec.filter;
                    if (add.length == 0 && !filter) return this;
                    if (sort) add = add.slice().sort(cmpRange);
                    if (this.isEmpty)
                        return add.length ? RangeSet.of(add) : this;
                    let cur = new LayerCursor(this, null, -1).goto(0),
                        i = 0,
                        spill = [];
                    let builder = new RangeSetBuilder();
                    while (cur.value || i < add.length) {
                        if (
                            i < add.length &&
                            (cur.from - add[i].from ||
                                cur.startSide - add[i].value.startSide) >= 0
                        ) {
                            let range = add[i++];
                            if (
                                !builder.addInner(
                                    range.from,
                                    range.to,
                                    range.value
                                )
                            )
                                spill.push(range);
                        } else if (
                            cur.rangeIndex == 1 &&
                            cur.chunkIndex < this.chunk.length &&
                            (i == add.length ||
                                this.chunkEnd(cur.chunkIndex) < add[i].from) &&
                            (!filter ||
                                filterFrom > this.chunkEnd(cur.chunkIndex) ||
                                filterTo < this.chunkPos[cur.chunkIndex]) &&
                            builder.addChunk(
                                this.chunkPos[cur.chunkIndex],
                                this.chunk[cur.chunkIndex]
                            )
                        ) {
                            cur.nextChunk();
                        } else {
                            if (
                                !filter ||
                                filterFrom > cur.to ||
                                filterTo < cur.from ||
                                filter(cur.from, cur.to, cur.value)
                            ) {
                                if (
                                    !builder.addInner(
                                        cur.from,
                                        cur.to,
                                        cur.value
                                    )
                                )
                                    spill.push(
                                        new Range(cur.from, cur.to, cur.value)
                                    );
                            }
                            cur.next();
                        }
                    }
                    return builder.finishInner(
                        this.nextLayer.isEmpty && !spill.length
                            ? RangeSet.empty
                            : this.nextLayer.update({
                                  add: spill,
                                  filter,
                                  filterFrom,
                                  filterTo,
                              })
                    );
                }
                /**
    Map this range set through a set of changes, return the new set.
    */
                map(changes) {
                    if (changes.empty || this.isEmpty) return this;
                    let chunks = [],
                        chunkPos = [],
                        maxPoint = -1;
                    for (let i = 0; i < this.chunk.length; i++) {
                        let start = this.chunkPos[i],
                            chunk = this.chunk[i];
                        let touch = changes.touchesRange(
                            start,
                            start + chunk.length
                        );
                        if (touch === false) {
                            maxPoint = Math.max(maxPoint, chunk.maxPoint);
                            chunks.push(chunk);
                            chunkPos.push(changes.mapPos(start));
                        } else if (touch === true) {
                            let { mapped, pos } = chunk.map(start, changes);
                            if (mapped) {
                                maxPoint = Math.max(maxPoint, mapped.maxPoint);
                                chunks.push(mapped);
                                chunkPos.push(pos);
                            }
                        }
                    }
                    let next = this.nextLayer.map(changes);
                    return chunks.length == 0
                        ? next
                        : new RangeSet(chunkPos, chunks, next, maxPoint);
                }
                /**
    Iterate over the ranges that touch the region `from` to `to`,
    calling `f` for each. There is no guarantee that the ranges will
    be reported in any specific order. When the callback returns
    `false`, iteration stops.
    */
                between(from, to, f) {
                    if (this.isEmpty) return;
                    for (let i = 0; i < this.chunk.length; i++) {
                        let start = this.chunkPos[i],
                            chunk = this.chunk[i];
                        if (
                            to >= start &&
                            from <= start + chunk.length &&
                            chunk.between(
                                start,
                                from - start,
                                to - start,
                                f
                            ) === false
                        )
                            return;
                    }
                    this.nextLayer.between(from, to, f);
                }
                /**
    Iterate over the ranges in this set, in order, including all
    ranges that end at or after `from`.
    */
                iter(from = 0) {
                    return HeapCursor.from([this]).goto(from);
                }
                /**
    @internal
    */
                get isEmpty() {
                    return this.nextLayer == this;
                }
                /**
    Iterate over the ranges in a collection of sets, in order,
    starting from `from`.
    */
                static iter(sets, from = 0) {
                    return HeapCursor.from(sets).goto(from);
                }
                /**
    Iterate over two groups of sets, calling methods on `comparator`
    to notify it of possible differences.
    */
                static compare(
                    oldSets,
                    newSets,
                    /**
    This indicates how the underlying data changed between these
    ranges, and is needed to synchronize the iteration. `from` and
    `to` are coordinates in the _new_ space, after these changes.
    */
                    textDiff,
                    comparator,
                    /**
    Can be used to ignore all non-point ranges, and points below
    the given size. When -1, all ranges are compared.
    */
                    minPointSize = -1
                ) {
                    let a = oldSets.filter(
                        (set) =>
                            set.maxPoint > 0 ||
                            (!set.isEmpty && set.maxPoint >= minPointSize)
                    );
                    let b = newSets.filter(
                        (set) =>
                            set.maxPoint > 0 ||
                            (!set.isEmpty && set.maxPoint >= minPointSize)
                    );
                    let sharedChunks = findSharedChunks(a, b, textDiff);
                    let sideA = new SpanCursor(a, sharedChunks, minPointSize);
                    let sideB = new SpanCursor(b, sharedChunks, minPointSize);
                    textDiff.iterGaps((fromA, fromB, length) =>
                        compare(sideA, fromA, sideB, fromB, length, comparator)
                    );
                    if (textDiff.empty && textDiff.length == 0)
                        compare(sideA, 0, sideB, 0, 0, comparator);
                }
                /**
    Compare the contents of two groups of range sets, returning true
    if they are equivalent in the given range.
    */
                static eq(oldSets, newSets, from = 0, to) {
                    if (to == null) to = 1000000000 /* Far */;
                    let a = oldSets.filter(
                        (set) => !set.isEmpty && newSets.indexOf(set) < 0
                    );
                    let b = newSets.filter(
                        (set) => !set.isEmpty && oldSets.indexOf(set) < 0
                    );
                    if (a.length != b.length) return false;
                    if (!a.length) return true;
                    let sharedChunks = findSharedChunks(a, b);
                    let sideA = new SpanCursor(a, sharedChunks, 0).goto(from),
                        sideB = new SpanCursor(b, sharedChunks, 0).goto(from);
                    for (;;) {
                        if (
                            sideA.to != sideB.to ||
                            !sameValues(sideA.active, sideB.active) ||
                            (sideA.point &&
                                (!sideB.point || !sideA.point.eq(sideB.point)))
                        )
                            return false;
                        if (sideA.to > to) return true;
                        sideA.next();
                        sideB.next();
                    }
                }
                /**
    Iterate over a group of range sets at the same time, notifying
    the iterator about the ranges covering every given piece of
    content. Returns the open count (see
    [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
    of the iteration.
    */
                static spans(
                    sets,
                    from,
                    to,
                    iterator,
                    /**
    When given and greater than -1, only points of at least this
    size are taken into account.
    */
                    minPointSize = -1
                ) {
                    let cursor = new SpanCursor(sets, null, minPointSize).goto(
                            from
                        ),
                        pos = from;
                    let open = cursor.openStart;
                    for (;;) {
                        let curTo = Math.min(cursor.to, to);
                        if (cursor.point) {
                            iterator.point(
                                pos,
                                curTo,
                                cursor.point,
                                cursor.activeForPoint(cursor.to),
                                open,
                                cursor.pointRank
                            );
                            open =
                                cursor.openEnd(curTo) +
                                (cursor.to > curTo ? 1 : 0);
                        } else if (curTo > pos) {
                            iterator.span(pos, curTo, cursor.active, open);
                            open = cursor.openEnd(curTo);
                        }
                        if (cursor.to > to) break;
                        pos = cursor.to;
                        cursor.next();
                    }
                    return open;
                }
                /**
    Create a range set for the given range or array of ranges. By
    default, this expects the ranges to be _sorted_ (by start
    position and, if two start at the same position,
    `value.startSide`). You can pass `true` as second argument to
    cause the method to sort them.
    */
                static of(ranges, sort = false) {
                    let build = new RangeSetBuilder();
                    for (let range of ranges instanceof Range
                        ? [ranges]
                        : sort
                        ? lazySort(ranges)
                        : ranges)
                        build.add(range.from, range.to, range.value);
                    return build.finish();
                }
            }
            /**
The empty set of ranges.
*/
            RangeSet.empty = /*@__PURE__*/ new RangeSet([], [], null, -1);
            function lazySort(ranges) {
                if (ranges.length > 1)
                    for (let prev = ranges[0], i = 1; i < ranges.length; i++) {
                        let cur = ranges[i];
                        if (cmpRange(prev, cur) > 0)
                            return ranges.slice().sort(cmpRange);
                        prev = cur;
                    }
                return ranges;
            }
            RangeSet.empty.nextLayer = RangeSet.empty;
            /**
A range set builder is a data structure that helps build up a
[range set](https://codemirror.net/6/docs/ref/#state.RangeSet) directly, without first allocating
an array of [`Range`](https://codemirror.net/6/docs/ref/#state.Range) objects.
*/
            class RangeSetBuilder {
                /**
    Create an empty builder.
    */
                constructor() {
                    this.chunks = [];
                    this.chunkPos = [];
                    this.chunkStart = -1;
                    this.last = null;
                    this.lastFrom = -1000000000 /* Far */;
                    this.lastTo = -1000000000 /* Far */;
                    this.from = [];
                    this.to = [];
                    this.value = [];
                    this.maxPoint = -1;
                    this.setMaxPoint = -1;
                    this.nextLayer = null;
                }
                finishChunk(newArrays) {
                    this.chunks.push(
                        new Chunk(this.from, this.to, this.value, this.maxPoint)
                    );
                    this.chunkPos.push(this.chunkStart);
                    this.chunkStart = -1;
                    this.setMaxPoint = Math.max(
                        this.setMaxPoint,
                        this.maxPoint
                    );
                    this.maxPoint = -1;
                    if (newArrays) {
                        this.from = [];
                        this.to = [];
                        this.value = [];
                    }
                }
                /**
    Add a range. Ranges should be added in sorted (by `from` and
    `value.startSide`) order.
    */
                add(from, to, value) {
                    if (!this.addInner(from, to, value))
                        (
                            this.nextLayer ||
                            (this.nextLayer = new RangeSetBuilder())
                        ).add(from, to, value);
                }
                /**
    @internal
    */
                addInner(from, to, value) {
                    let diff =
                        from - this.lastTo ||
                        value.startSide - this.last.endSide;
                    if (
                        diff <= 0 &&
                        (from - this.lastFrom ||
                            value.startSide - this.last.startSide) < 0
                    )
                        throw new Error(
                            "Ranges must be added sorted by `from` position and `startSide`"
                        );
                    if (diff < 0) return false;
                    if (this.from.length == 250 /* ChunkSize */)
                        this.finishChunk(true);
                    if (this.chunkStart < 0) this.chunkStart = from;
                    this.from.push(from - this.chunkStart);
                    this.to.push(to - this.chunkStart);
                    this.last = value;
                    this.lastFrom = from;
                    this.lastTo = to;
                    this.value.push(value);
                    if (value.point)
                        this.maxPoint = Math.max(this.maxPoint, to - from);
                    return true;
                }
                /**
    @internal
    */
                addChunk(from, chunk) {
                    if (
                        (from - this.lastTo ||
                            chunk.value[0].startSide - this.last.endSide) < 0
                    )
                        return false;
                    if (this.from.length) this.finishChunk(true);
                    this.setMaxPoint = Math.max(
                        this.setMaxPoint,
                        chunk.maxPoint
                    );
                    this.chunks.push(chunk);
                    this.chunkPos.push(from);
                    let last = chunk.value.length - 1;
                    this.last = chunk.value[last];
                    this.lastFrom = chunk.from[last] + from;
                    this.lastTo = chunk.to[last] + from;
                    return true;
                }
                /**
    Finish the range set. Returns the new set. The builder can't be
    used anymore after this has been called.
    */
                finish() {
                    return this.finishInner(RangeSet.empty);
                }
                /**
    @internal
    */
                finishInner(next) {
                    if (this.from.length) this.finishChunk(false);
                    if (this.chunks.length == 0) return next;
                    let result = new RangeSet(
                        this.chunkPos,
                        this.chunks,
                        this.nextLayer
                            ? this.nextLayer.finishInner(next)
                            : next,
                        this.setMaxPoint
                    );
                    this.from = null; // Make sure further `add` calls produce errors
                    return result;
                }
            }
            function findSharedChunks(a, b, textDiff) {
                let inA = new Map();
                for (let set of a)
                    for (let i = 0; i < set.chunk.length; i++)
                        if (set.chunk[i].maxPoint <= 0)
                            inA.set(set.chunk[i], set.chunkPos[i]);
                let shared = new Set();
                for (let set of b)
                    for (let i = 0; i < set.chunk.length; i++) {
                        let known = inA.get(set.chunk[i]);
                        if (
                            known != null &&
                            (textDiff ? textDiff.mapPos(known) : known) ==
                                set.chunkPos[i] &&
                            !(textDiff === null || textDiff === void 0
                                ? void 0
                                : textDiff.touchesRange(
                                      known,
                                      known + set.chunk[i].length
                                  ))
                        )
                            shared.add(set.chunk[i]);
                    }
                return shared;
            }
            class LayerCursor {
                constructor(layer, skip, minPoint, rank = 0) {
                    this.layer = layer;
                    this.skip = skip;
                    this.minPoint = minPoint;
                    this.rank = rank;
                }
                get startSide() {
                    return this.value ? this.value.startSide : 0;
                }
                get endSide() {
                    return this.value ? this.value.endSide : 0;
                }
                goto(pos, side = -1000000000 /* Far */) {
                    this.chunkIndex = this.rangeIndex = 0;
                    this.gotoInner(pos, side, false);
                    return this;
                }
                gotoInner(pos, side, forward) {
                    while (this.chunkIndex < this.layer.chunk.length) {
                        let next = this.layer.chunk[this.chunkIndex];
                        if (
                            !(
                                (this.skip && this.skip.has(next)) ||
                                this.layer.chunkEnd(this.chunkIndex) < pos ||
                                next.maxPoint < this.minPoint
                            )
                        )
                            break;
                        this.chunkIndex++;
                        forward = false;
                    }
                    if (this.chunkIndex < this.layer.chunk.length) {
                        let rangeIndex = this.layer.chunk[
                            this.chunkIndex
                        ].findIndex(
                            pos - this.layer.chunkPos[this.chunkIndex],
                            side,
                            true
                        );
                        if (!forward || this.rangeIndex < rangeIndex)
                            this.setRangeIndex(rangeIndex);
                    }
                    this.next();
                }
                forward(pos, side) {
                    if ((this.to - pos || this.endSide - side) < 0)
                        this.gotoInner(pos, side, true);
                }
                next() {
                    for (;;) {
                        if (this.chunkIndex == this.layer.chunk.length) {
                            this.from = this.to = 1000000000 /* Far */;
                            this.value = null;
                            break;
                        } else {
                            let chunkPos = this.layer.chunkPos[this.chunkIndex],
                                chunk = this.layer.chunk[this.chunkIndex];
                            let from = chunkPos + chunk.from[this.rangeIndex];
                            this.from = from;
                            this.to = chunkPos + chunk.to[this.rangeIndex];
                            this.value = chunk.value[this.rangeIndex];
                            this.setRangeIndex(this.rangeIndex + 1);
                            if (
                                this.minPoint < 0 ||
                                (this.value.point &&
                                    this.to - this.from >= this.minPoint)
                            )
                                break;
                        }
                    }
                }
                setRangeIndex(index) {
                    if (
                        index == this.layer.chunk[this.chunkIndex].value.length
                    ) {
                        this.chunkIndex++;
                        if (this.skip) {
                            while (
                                this.chunkIndex < this.layer.chunk.length &&
                                this.skip.has(this.layer.chunk[this.chunkIndex])
                            )
                                this.chunkIndex++;
                        }
                        this.rangeIndex = 0;
                    } else {
                        this.rangeIndex = index;
                    }
                }
                nextChunk() {
                    this.chunkIndex++;
                    this.rangeIndex = 0;
                    this.next();
                }
                compare(other) {
                    return (
                        this.from - other.from ||
                        this.startSide - other.startSide ||
                        this.rank - other.rank ||
                        this.to - other.to ||
                        this.endSide - other.endSide
                    );
                }
            }
            class HeapCursor {
                constructor(heap) {
                    this.heap = heap;
                }
                static from(sets, skip = null, minPoint = -1) {
                    let heap = [];
                    for (let i = 0; i < sets.length; i++) {
                        for (
                            let cur = sets[i];
                            !cur.isEmpty;
                            cur = cur.nextLayer
                        ) {
                            if (cur.maxPoint >= minPoint)
                                heap.push(
                                    new LayerCursor(cur, skip, minPoint, i)
                                );
                        }
                    }
                    return heap.length == 1 ? heap[0] : new HeapCursor(heap);
                }
                get startSide() {
                    return this.value ? this.value.startSide : 0;
                }
                goto(pos, side = -1000000000 /* Far */) {
                    for (let cur of this.heap) cur.goto(pos, side);
                    for (let i = this.heap.length >> 1; i >= 0; i--)
                        heapBubble(this.heap, i);
                    this.next();
                    return this;
                }
                forward(pos, side) {
                    for (let cur of this.heap) cur.forward(pos, side);
                    for (let i = this.heap.length >> 1; i >= 0; i--)
                        heapBubble(this.heap, i);
                    if ((this.to - pos || this.value.endSide - side) < 0)
                        this.next();
                }
                next() {
                    if (this.heap.length == 0) {
                        this.from = this.to = 1000000000 /* Far */;
                        this.value = null;
                        this.rank = -1;
                    } else {
                        let top = this.heap[0];
                        this.from = top.from;
                        this.to = top.to;
                        this.value = top.value;
                        this.rank = top.rank;
                        if (top.value) top.next();
                        heapBubble(this.heap, 0);
                    }
                }
            }
            function heapBubble(heap, index) {
                for (let cur = heap[index]; ; ) {
                    let childIndex = (index << 1) + 1;
                    if (childIndex >= heap.length) break;
                    let child = heap[childIndex];
                    if (
                        childIndex + 1 < heap.length &&
                        child.compare(heap[childIndex + 1]) >= 0
                    ) {
                        child = heap[childIndex + 1];
                        childIndex++;
                    }
                    if (cur.compare(child) < 0) break;
                    heap[childIndex] = cur;
                    heap[index] = child;
                    index = childIndex;
                }
            }
            class SpanCursor {
                constructor(sets, skip, minPoint) {
                    this.minPoint = minPoint;
                    this.active = [];
                    this.activeTo = [];
                    this.activeRank = [];
                    this.minActive = -1;
                    // A currently active point range, if any
                    this.point = null;
                    this.pointFrom = 0;
                    this.pointRank = 0;
                    this.to = -1000000000 /* Far */;
                    this.endSide = 0;
                    this.openStart = -1;
                    this.cursor = HeapCursor.from(sets, skip, minPoint);
                }
                goto(pos, side = -1000000000 /* Far */) {
                    this.cursor.goto(pos, side);
                    this.active.length =
                        this.activeTo.length =
                        this.activeRank.length =
                            0;
                    this.minActive = -1;
                    this.to = pos;
                    this.endSide = side;
                    this.openStart = -1;
                    this.next();
                    return this;
                }
                forward(pos, side) {
                    while (
                        this.minActive > -1 &&
                        (this.activeTo[this.minActive] - pos ||
                            this.active[this.minActive].endSide - side) < 0
                    )
                        this.removeActive(this.minActive);
                    this.cursor.forward(pos, side);
                }
                removeActive(index) {
                    remove(this.active, index);
                    remove(this.activeTo, index);
                    remove(this.activeRank, index);
                    this.minActive = findMinIndex(this.active, this.activeTo);
                }
                addActive(trackOpen) {
                    let i = 0,
                        { value, to, rank } = this.cursor;
                    while (
                        i < this.activeRank.length &&
                        this.activeRank[i] <= rank
                    )
                        i++;
                    insert(this.active, i, value);
                    insert(this.activeTo, i, to);
                    insert(this.activeRank, i, rank);
                    if (trackOpen) insert(trackOpen, i, this.cursor.from);
                    this.minActive = findMinIndex(this.active, this.activeTo);
                }
                // After calling this, if `this.point` != null, the next range is a
                // point. Otherwise, it's a regular range, covered by `this.active`.
                next() {
                    let from = this.to,
                        wasPoint = this.point;
                    this.point = null;
                    let trackOpen = this.openStart < 0 ? [] : null,
                        trackExtra = 0;
                    for (;;) {
                        let a = this.minActive;
                        if (
                            a > -1 &&
                            (this.activeTo[a] - this.cursor.from ||
                                this.active[a].endSide -
                                    this.cursor.startSide) < 0
                        ) {
                            if (this.activeTo[a] > from) {
                                this.to = this.activeTo[a];
                                this.endSide = this.active[a].endSide;
                                break;
                            }
                            this.removeActive(a);
                            if (trackOpen) remove(trackOpen, a);
                        } else if (!this.cursor.value) {
                            this.to = this.endSide = 1000000000 /* Far */;
                            break;
                        } else if (this.cursor.from > from) {
                            this.to = this.cursor.from;
                            this.endSide = this.cursor.startSide;
                            break;
                        } else {
                            let nextVal = this.cursor.value;
                            if (!nextVal.point) {
                                // Opening a range
                                this.addActive(trackOpen);
                                this.cursor.next();
                            } else if (
                                wasPoint &&
                                this.cursor.to == this.to &&
                                this.cursor.from < this.cursor.to
                            ) {
                                // Ignore any non-empty points that end precisely at the end of the prev point
                                this.cursor.next();
                            } else {
                                // New point
                                this.point = nextVal;
                                this.pointFrom = this.cursor.from;
                                this.pointRank = this.cursor.rank;
                                this.to = this.cursor.to;
                                this.endSide = nextVal.endSide;
                                if (this.cursor.from < from) trackExtra = 1;
                                this.cursor.next();
                                this.forward(this.to, this.endSide);
                                break;
                            }
                        }
                    }
                    if (trackOpen) {
                        let openStart = 0;
                        while (
                            openStart < trackOpen.length &&
                            trackOpen[openStart] < from
                        )
                            openStart++;
                        this.openStart = openStart + trackExtra;
                    }
                }
                activeForPoint(to) {
                    if (!this.active.length) return this.active;
                    let active = [];
                    for (let i = this.active.length - 1; i >= 0; i--) {
                        if (this.activeRank[i] < this.pointRank) break;
                        if (
                            this.activeTo[i] > to ||
                            (this.activeTo[i] == to &&
                                this.active[i].endSide >= this.point.endSide)
                        )
                            active.push(this.active[i]);
                    }
                    return active.reverse();
                }
                openEnd(to) {
                    let open = 0;
                    for (
                        let i = this.activeTo.length - 1;
                        i >= 0 && this.activeTo[i] > to;
                        i--
                    )
                        open++;
                    return open;
                }
            }
            function compare(a, startA, b, startB, length, comparator) {
                a.goto(startA);
                b.goto(startB);
                let endB = startB + length;
                let pos = startB,
                    dPos = startB - startA;
                for (;;) {
                    let diff = a.to + dPos - b.to || a.endSide - b.endSide;
                    let end = diff < 0 ? a.to + dPos : b.to,
                        clipEnd = Math.min(end, endB);
                    if (a.point || b.point) {
                        if (
                            !(
                                a.point &&
                                b.point &&
                                (a.point == b.point || a.point.eq(b.point)) &&
                                sameValues(
                                    a.activeForPoint(a.to + dPos),
                                    b.activeForPoint(b.to)
                                )
                            )
                        )
                            comparator.comparePoint(
                                pos,
                                clipEnd,
                                a.point,
                                b.point
                            );
                    } else {
                        if (clipEnd > pos && !sameValues(a.active, b.active))
                            comparator.compareRange(
                                pos,
                                clipEnd,
                                a.active,
                                b.active
                            );
                    }
                    if (end > endB) break;
                    pos = end;
                    if (diff <= 0) a.next();
                    if (diff >= 0) b.next();
                }
            }
            function sameValues(a, b) {
                if (a.length != b.length) return false;
                for (let i = 0; i < a.length; i++)
                    if (a[i] != b[i] && !a[i].eq(b[i])) return false;
                return true;
            }
            function remove(array, index) {
                for (let i = index, e = array.length - 1; i < e; i++)
                    array[i] = array[i + 1];
                array.pop();
            }
            function insert(array, index, value) {
                for (let i = array.length - 1; i >= index; i--)
                    array[i + 1] = array[i];
                array[index] = value;
            }
            function findMinIndex(value, array) {
                let found = -1,
                    foundPos = 1000000000; /* Far */
                for (let i = 0; i < array.length; i++)
                    if (
                        (array[i] - foundPos ||
                            value[i].endSide - value[found].endSide) < 0
                    ) {
                        found = i;
                        foundPos = array[i];
                    }
                return found;
            }

            /**
Count the column position at the given offset into the string,
taking extending characters and tab size into account.
*/
            function countColumn(string, tabSize, to = string.length) {
                let n = 0;
                for (let i = 0; i < to; ) {
                    if (string.charCodeAt(i) == 9) {
                        n += tabSize - (n % tabSize);
                        i++;
                    } else {
                        n++;
                        i = findClusterBreak(string, i);
                    }
                }
                return n;
            }
            /**
Find the offset that corresponds to the given column position in a
string, taking extending characters and tab size into account. By
default, the string length is returned when it is too short to
reach the column. Pass `strict` true to make it return -1 in that
situation.
*/
            function findColumn(string, col, tabSize, strict) {
                for (let i = 0, n = 0; ; ) {
                    if (n >= col) return i;
                    if (i == string.length) break;
                    n +=
                        string.charCodeAt(i) == 9 ? tabSize - (n % tabSize) : 1;
                    i = findClusterBreak(string, i);
                }
                return strict === true ? -1 : string.length;
            }

            /***/
        },

        /***/ 8699: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ V: function () {
                    return /* binding */ StyleModule;
                },
                /* harmony export */
            });
            const C = "\u037c";
            const COUNT =
                typeof Symbol == "undefined" ? "__" + C : Symbol.for(C);
            const SET =
                typeof Symbol == "undefined"
                    ? "__styleSet" + Math.floor(Math.random() * 1e8)
                    : Symbol("styleSet");
            const top =
                typeof globalThis != "undefined"
                    ? globalThis
                    : typeof window != "undefined"
                    ? window
                    : {};

            // :: - Style modules encapsulate a set of CSS rules defined from
            // JavaScript. Their definitions are only available in a given DOM
            // root after it has been _mounted_ there with `StyleModule.mount`.
            //
            // Style modules should be created once and stored somewhere, as
            // opposed to re-creating them every time you need them. The amount of
            // CSS rules generated for a given DOM root is bounded by the amount
            // of style modules that were used. So to avoid leaking rules, don't
            // create these dynamically, but treat them as one-time allocations.
            class StyleModule {
                // :: (Object<Style>, ?{finish: ?(string) → string})
                // Create a style module from the given spec.
                //
                // When `finish` is given, it is called on regular (non-`@`)
                // selectors (after `&` expansion) to compute the final selector.
                constructor(spec, options) {
                    this.rules = [];
                    let { finish } = options || {};

                    function splitSelector(selector) {
                        return /^@/.test(selector)
                            ? [selector]
                            : selector.split(/,\s*/);
                    }

                    function render(selectors, spec, target, isKeyframes) {
                        let local = [],
                            isAt = /^@(\w+)\b/.exec(selectors[0]),
                            keyframes = isAt && isAt[1] == "keyframes";
                        if (isAt && spec == null)
                            return target.push(selectors[0] + ";");
                        for (let prop in spec) {
                            let value = spec[prop];
                            if (/&/.test(prop)) {
                                render(
                                    prop
                                        .split(/,\s*/)
                                        .map((part) =>
                                            selectors.map((sel) =>
                                                part.replace(/&/, sel)
                                            )
                                        )
                                        .reduce((a, b) => a.concat(b)),
                                    value,
                                    target
                                );
                            } else if (value && typeof value == "object") {
                                if (!isAt)
                                    throw new RangeError(
                                        "The value of a property (" +
                                            prop +
                                            ") should be a primitive value."
                                    );
                                render(
                                    splitSelector(prop),
                                    value,
                                    local,
                                    keyframes
                                );
                            } else if (value != null) {
                                local.push(
                                    prop
                                        .replace(/_.*/, "")
                                        .replace(
                                            /[A-Z]/g,
                                            (l) => "-" + l.toLowerCase()
                                        ) +
                                        ": " +
                                        value +
                                        ";"
                                );
                            }
                        }
                        if (local.length || keyframes) {
                            target.push(
                                (finish && !isAt && !isKeyframes
                                    ? selectors.map(finish)
                                    : selectors
                                ).join(", ") +
                                    " {" +
                                    local.join(" ") +
                                    "}"
                            );
                        }
                    }

                    for (let prop in spec)
                        render(splitSelector(prop), spec[prop], this.rules);
                }

                // :: () → string
                // Returns a string containing the module's CSS rules.
                getRules() {
                    return this.rules.join("\n");
                }

                // :: () → string
                // Generate a new unique CSS class name.
                static newName() {
                    let id = top[COUNT] || 1;
                    top[COUNT] = id + 1;
                    return C + id.toString(36);
                }

                // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>)
                //
                // Mount the given set of modules in the given DOM root, which ensures
                // that the CSS rules defined by the module are available in that
                // context.
                //
                // Rules are only added to the document once per root.
                //
                // Rule order will follow the order of the modules, so that rules from
                // modules later in the array take precedence of those from earlier
                // modules. If you call this function multiple times for the same root
                // in a way that changes the order of already mounted modules, the old
                // order will be changed.
                static mount(root, modules) {
                    (root[SET] || new StyleSet(root)).mount(
                        Array.isArray(modules) ? modules : [modules]
                    );
                }
            }

            let adoptedSet = null;

            class StyleSet {
                constructor(root) {
                    if (
                        !root.head &&
                        root.adoptedStyleSheets &&
                        typeof CSSStyleSheet != "undefined"
                    ) {
                        if (adoptedSet) {
                            root.adoptedStyleSheets = [adoptedSet.sheet].concat(
                                root.adoptedStyleSheets
                            );
                            return (root[SET] = adoptedSet);
                        }
                        this.sheet = new CSSStyleSheet();
                        root.adoptedStyleSheets = [this.sheet].concat(
                            root.adoptedStyleSheets
                        );
                        adoptedSet = this;
                    } else {
                        this.styleTag = (
                            root.ownerDocument || root
                        ).createElement("style");
                        let target = root.head || root;
                        target.insertBefore(this.styleTag, target.firstChild);
                    }
                    this.modules = [];
                    root[SET] = this;
                }

                mount(modules) {
                    let sheet = this.sheet;
                    let pos = 0 /* Current rule offset */,
                        j = 0; /* Index into this.modules */
                    for (let i = 0; i < modules.length; i++) {
                        let mod = modules[i],
                            index = this.modules.indexOf(mod);
                        if (index < j && index > -1) {
                            // Ordering conflict
                            this.modules.splice(index, 1);
                            j--;
                            index = -1;
                        }
                        if (index == -1) {
                            this.modules.splice(j++, 0, mod);
                            if (sheet)
                                for (let k = 0; k < mod.rules.length; k++)
                                    sheet.insertRule(mod.rules[k], pos++);
                        } else {
                            while (j < index)
                                pos += this.modules[j++].rules.length;
                            pos += mod.rules.length;
                            j++;
                        }
                    }

                    if (!sheet) {
                        let text = "";
                        for (let i = 0; i < this.modules.length; i++)
                            text += this.modules[i].getRules() + "\n";
                        this.styleTag.textContent = text;
                    }
                }
            }

            // Style::Object<union<Style,string>>
            //
            // A style is an object that, in the simple case, maps CSS property
            // names to strings holding their values, as in `{color: "red",
            // fontWeight: "bold"}`. The property names can be given in
            // camel-case—the library will insert a dash before capital letters
            // when converting them to CSS.
            //
            // If you include an underscore in a property name, it and everything
            // after it will be removed from the output, which can be useful when
            // providing a property multiple times, for browser compatibility
            // reasons.
            //
            // A property in a style object can also be a sub-selector, which
            // extends the current context to add a pseudo-selector or a child
            // selector. Such a property should contain a `&` character, which
            // will be replaced by the current selector. For example `{"&:before":
            // {content: '"hi"'}}`. Sub-selectors and regular properties can
            // freely be mixed in a given object. Any property containing a `&` is
            // assumed to be a sub-selector.
            //
            // Finally, a property can specify an @-block to be wrapped around the
            // styles defined inside the object that's the property's value. For
            // example to create a media query you can do `{"@media screen and
            // (min-width: 400px)": {...}}`.

            /***/
        },

        /***/ 3952: /***/ function (
            __unused_webpack___webpack_module__,
            __webpack_exports__,
            __webpack_require__
        ) {
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */ YG: function () {
                    return /* binding */ keyName;
                },
                /* harmony export */ ue: function () {
                    return /* binding */ base;
                },
                /* harmony export */
            });
            /* unused harmony export shift */
            var base = {
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
                229: "q",
            };

            var shift = {
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
                229: "Q",
            };

            var chrome =
                typeof navigator != "undefined" &&
                /Chrome\/(\d+)/.exec(navigator.userAgent);
            var safari =
                typeof navigator != "undefined" &&
                /Apple Computer/.test(navigator.vendor);
            var gecko =
                typeof navigator != "undefined" &&
                /Gecko\/\d+/.test(navigator.userAgent);
            var mac =
                typeof navigator != "undefined" &&
                /Mac/.test(navigator.platform);
            var ie =
                typeof navigator != "undefined" &&
                /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(
                    navigator.userAgent
                );
            var brokenModifierNames =
                (chrome && (mac || +chrome[1] < 57)) || (gecko && mac);

            // Fill in the digit keys
            for (var i = 0; i < 10; i++)
                base[48 + i] = base[96 + i] = String(i);

            // The function keys
            for (var i = 1; i <= 24; i++) base[i + 111] = "F" + i;

            // And the alphabetic keys
            for (var i = 65; i <= 90; i++) {
                base[i] = String.fromCharCode(i + 32);
                shift[i] = String.fromCharCode(i);
            }

            // For each code that doesn't have a shift-equivalent, copy the base name
            for (var code in base)
                if (!shift.hasOwnProperty(code)) shift[code] = base[code];

            function keyName(event) {
                // Don't trust event.key in Chrome when there are modifiers until
                // they fix https://bugs.chromium.org/p/chromium/issues/detail?id=633838
                var ignoreKey =
                    (brokenModifierNames &&
                        (event.ctrlKey || event.altKey || event.metaKey)) ||
                    ((safari || ie) &&
                        event.shiftKey &&
                        event.key &&
                        event.key.length == 1);
                var name =
                    (!ignoreKey && event.key) ||
                    (event.shiftKey ? shift : base)[event.keyCode] ||
                    event.key ||
                    "Unidentified";
                // Edge sometimes produces wrong names (Issue #3)
                if (name == "Esc") name = "Escape";
                if (name == "Del") name = "Delete";
                // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8860571/
                if (name == "Left") name = "ArrowLeft";
                if (name == "Up") name = "ArrowUp";
                if (name == "Right") name = "ArrowRight";
                if (name == "Down") name = "ArrowDown";
                return name;
            }

            /***/
        },
    },
]);
