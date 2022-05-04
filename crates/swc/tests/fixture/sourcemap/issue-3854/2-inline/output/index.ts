"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
    node: true,
    create: true,
    trustBox: true,
    opener: true,
    stage: true,
    header: true,
    source: true,
    sources: true,
    seq: true
};
exports.seq = exports.sources = exports.source = exports.header = exports.stage = exports.opener = exports.trustBox = exports.create = exports.node = void 0;
var swcHelpers = require("@swc/helpers");
var _abstractBuilders = require("./AbstractBuilders");
var _builderUtils = require("./Builder.utils");
var _elementBuilder = require("./ElementBuilder");
var _node = swcHelpers.interopRequireWildcard(require("./BodyNodesBuilder"));
/**
 * @deprecated use {Builder.body.node.img()}
 */ Object.keys(_node).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _node[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _node[key];
        }
    });
});
const create = ()=>new BodyBuilder()
;
exports.create = create;
const trustBox = ()=>new TrustBoxBuilder()
;
exports.trustBox = trustBox;
const opener = ()=>new OpenerBuilder()
;
exports.opener = opener;
const stage = ()=>new BodyStageBuilder()
;
exports.stage = stage;
const header = ()=>new BodyHeaderBuilder()
;
exports.header = header;
const source = (nodes = [])=>new ArticleSourceBuilder(...nodes)
;
exports.source = source;
const sources = ()=>new ArticleSourcesBuilder()
;
exports.sources = sources;
const seq = {
    stage: ()=>new BodyStageSeqBuilder()
    ,
    source: ()=>new ArticleSourceSeqBuilder()
};
exports.seq = seq;
var _stages = /*#__PURE__*/ new WeakMap(), _trustBox = /*#__PURE__*/ new WeakMap(), _disclaimer = /*#__PURE__*/ new WeakMap(), _articleSources = /*#__PURE__*/ new WeakMap();
class BodyBuilder extends _abstractBuilders.AbstractBuilder {
    stages(...stages) {
        swcHelpers.classPrivateFieldSet(this, _stages, stages.map(_builderUtils.mapBuildArg));
        return this;
    }
    trustBox(trustBox1) {
        swcHelpers.classPrivateFieldSet(this, _trustBox, (0, _builderUtils).mapBuildArg(trustBox1));
        return this;
    }
    disclaimer(disclaimer) {
        swcHelpers.classPrivateFieldSet(this, _disclaimer, disclaimer?.map(_builderUtils.mapBuildArg));
        return this;
    }
    articleSources(articleSources) {
        swcHelpers.classPrivateFieldSet(this, _articleSources, (0, _builderUtils).mapBuildArg(articleSources));
        return this;
    }
    build() {
        return {
            stages: swcHelpers.classPrivateFieldGet(this, _stages),
            trustBox: swcHelpers.classPrivateFieldGet(this, _trustBox),
            disclaimer: swcHelpers.classPrivateFieldGet(this, _disclaimer),
            articleSources: swcHelpers.classPrivateFieldGet(this, _articleSources)
        };
    }
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _stages, {
            writable: true,
            value: []
        });
        swcHelpers.classPrivateFieldInit(this, _trustBox, {
            writable: true,
            value: undefined
        });
        swcHelpers.classPrivateFieldInit(this, _disclaimer, {
            writable: true,
            value: undefined
        });
        swcHelpers.classPrivateFieldInit(this, _articleSources, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes = /*#__PURE__*/ new WeakMap(), _hidden = /*#__PURE__*/ new WeakMap();
class TrustBoxBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        swcHelpers.classPrivateFieldSet(this, _nodes, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(hidden) {
        swcHelpers.classPrivateFieldSet(this, _hidden, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: swcHelpers.classPrivateFieldGet(this, _nodes),
            hidden: swcHelpers.classPrivateFieldGet(this, _hidden)
        };
    }
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _nodes, {
            writable: true,
            value: []
        });
        swcHelpers.classPrivateFieldInit(this, _hidden, {
            writable: true,
            value: []
        });
    }
}
var _element = /*#__PURE__*/ new WeakMap();
class OpenerBuilder extends _abstractBuilders.AbstractBuilder {
    element(element) {
        swcHelpers.classPrivateFieldSet(this, _element, (0, _builderUtils).mapBuildArg(element));
        return this;
    }
    build() {
        return {
            element: swcHelpers.classPrivateFieldGet(this, _element)
        };
    }
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _element, {
            writable: true,
            value: (0, _elementBuilder).image().build()
        });
    }
}
var _nodes1 = /*#__PURE__*/ new WeakMap(), _header = /*#__PURE__*/ new WeakMap(), _companions = /*#__PURE__*/ new WeakMap(), _commercialsEndOfStage = /*#__PURE__*/ new WeakMap();
class BodyStageSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        swcHelpers.classPrivateFieldSet(this, _nodes1, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    header(header1) {
        swcHelpers.classPrivateFieldSet(this, _header, (0, _builderUtils).mapBuildArgs(header1 ?? []));
        return this;
    }
    companions(companions) {
        swcHelpers.classPrivateFieldSet(this, _companions, companions.map(_builderUtils.mapBuildArgs));
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        swcHelpers.classPrivateFieldSet(this, _commercialsEndOfStage, commercialsEndOfStage.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        return {
            id: (0, _builderUtils).hash("bodyStage", swcHelpers.classPrivateFieldGet(this, _nodes1), swcHelpers.classPrivateFieldGet(this, _companions), swcHelpers.classPrivateFieldGet(this, _commercialsEndOfStage), swcHelpers.classPrivateFieldGet(this, _header)),
            nodes: seqNextElement.array(swcHelpers.classPrivateFieldGet(this, _nodes1)),
            header: seqNextElement.maybe(swcHelpers.classPrivateFieldGet(this, _header)),
            companions: seqNextElement.array(swcHelpers.classPrivateFieldGet(this, _companions)),
            commercialsEndOfStage: seqNextElement.array(swcHelpers.classPrivateFieldGet(this, _commercialsEndOfStage))
        };
    }
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _nodes1, {
            writable: true,
            value: []
        });
        swcHelpers.classPrivateFieldInit(this, _header, {
            writable: true,
            value: undefined
        });
        swcHelpers.classPrivateFieldInit(this, _companions, {
            writable: true,
            value: []
        });
        swcHelpers.classPrivateFieldInit(this, _commercialsEndOfStage, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder = /*#__PURE__*/ new WeakMap();
class BodyStageBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        swcHelpers.classPrivateFieldGet(this, _seqBuilder).nodes([
            nodes
        ]);
        return this;
    }
    header(header2) {
        if (header2) {
            swcHelpers.classPrivateFieldGet(this, _seqBuilder).header([
                header2
            ]);
        }
        return this;
    }
    companions(companions) {
        swcHelpers.classPrivateFieldGet(this, _seqBuilder).companions([
            companions
        ]);
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        swcHelpers.classPrivateFieldGet(this, _seqBuilder).commercialsEndOfStage([
            commercialsEndOfStage
        ]);
        return this;
    }
    build() {
        return swcHelpers.classPrivateFieldGet(this, _seqBuilder).build();
    }
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _seqBuilder, {
            writable: true,
            value: new BodyStageSeqBuilder()
        });
    }
}
var _variant = /*#__PURE__*/ new WeakMap(), _opener = /*#__PURE__*/ new WeakMap();
class BodyHeaderBuilder extends _abstractBuilders.AbstractBuilder {
    variant(variant) {
        swcHelpers.classPrivateFieldSet(this, _variant, variant);
        return this;
    }
    opener(opener1) {
        swcHelpers.classPrivateFieldSet(this, _opener, (0, _builderUtils).mapBuildArg(opener1));
        return this;
    }
    build() {
        return {
            variant: swcHelpers.classPrivateFieldGet(this, _variant),
            opener: swcHelpers.classPrivateFieldGet(this, _opener)
        };
    }
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _variant, {
            writable: true,
            value: "full"
        });
        swcHelpers.classPrivateFieldInit(this, _opener, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes2 = /*#__PURE__*/ new WeakMap();
class ArticleSourceSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        swcHelpers.classPrivateFieldSet(this, _nodes2, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        const id = (0, _builderUtils).hash("article-source", swcHelpers.classPrivateFieldGet(this, _nodes2));
        return {
            id,
            nodes: seqNextElement.array(swcHelpers.classPrivateFieldGet(this, _nodes2))
        };
    }
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _nodes2, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder1 = /*#__PURE__*/ new WeakMap();
class ArticleSourceBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        swcHelpers.classPrivateFieldGet(this, _seqBuilder1).nodes([
            nodes
        ]);
        return this;
    }
    build() {
        return swcHelpers.classPrivateFieldGet(this, _seqBuilder1).build();
    }
    constructor(...nodes){
        super();
        swcHelpers.classPrivateFieldInit(this, _seqBuilder1, {
            writable: true,
            value: new ArticleSourceSeqBuilder()
        });
        this.nodes(...nodes);
    }
}
var _nodes3 = /*#__PURE__*/ new WeakMap(), _hidden1 = /*#__PURE__*/ new WeakMap();
class ArticleSourcesBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        swcHelpers.classPrivateFieldSet(this, _nodes3, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(...hidden) {
        swcHelpers.classPrivateFieldSet(this, _hidden1, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: swcHelpers.classPrivateFieldGet(this, _nodes3),
            hidden: swcHelpers.classPrivateFieldGet(this, _hidden1)
        };
    }
    constructor(...args){
        super(...args);
        swcHelpers.classPrivateFieldInit(this, _nodes3, {
            writable: true,
            value: []
        });
        swcHelpers.classPrivateFieldInit(this, _hidden1, {
            writable: true,
            value: []
        });
    }
}
exports.node = _node;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RCdWlsZGVyc1wiO1xuaW1wb3J0IHsgaGFzaCwgbWFwQnVpbGRBcmcsIG1hcEJ1aWxkQXJncyB9IGZyb20gXCIuL0J1aWxkZXIudXRpbHNcIjtcbmltcG9ydCB7IGltYWdlIH0gZnJvbSBcIi4vRWxlbWVudEJ1aWxkZXJcIjtcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gXCJAcGFwZXIvbW9kZWxzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgQnVpbGRBcmcsXG4gICAgQnVpbGRBcmdzLFxuICAgIENyZWF0ZUJ1aWxkZXIsXG4gICAgU2VxRWxlbWVudCxcbiAgICBTZXFOZXh0RWxlbWVudENvbnZlcnRlcixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0J1aWxkZXIuYm9keS5ub2RlLmltZygpfVxuICovXG5leHBvcnQgKiBmcm9tIFwiLi9Cb2R5Tm9kZXNCdWlsZGVyXCI7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gXCIuL0JvZHlOb2Rlc0J1aWxkZXJcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZTogQ3JlYXRlQnVpbGRlcjxCb2R5QnVpbGRlcj4gPSAoKSA9PiBuZXcgQm9keUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCB0cnVzdEJveDogQ3JlYXRlQnVpbGRlcjxUcnVzdEJveEJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgVHJ1c3RCb3hCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgb3BlbmVyOiBDcmVhdGVCdWlsZGVyPE9wZW5lckJ1aWxkZXI+ID0gKCkgPT4gbmV3IE9wZW5lckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzdGFnZTogQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgQm9keUhlYWRlckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzb3VyY2U6IENyZWF0ZUJ1aWxkZXI8XG4gICAgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIsXG4gICAgQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+XG4+ID0gKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSkgPT5cbiAgICBuZXcgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIoLi4ubm9kZXMpO1xuZXhwb3J0IGNvbnN0IHNvdXJjZXM6IENyZWF0ZUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZXNCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEFydGljbGVTb3VyY2VzQnVpbGRlcigpO1xuXG5leHBvcnQgY29uc3Qgc2VxID0ge1xuICAgIHN0YWdlOiAoKCkgPT5cbiAgICAgICAgbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VTZXFCdWlsZGVyPixcbiAgICBzb3VyY2U6ICgoKSA9PlxuICAgICAgICBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxBcnRpY2xlU291cmNlU2VxQnVpbGRlcj4sXG59IGFzIGNvbnN0O1xuXG5jbGFzcyBCb2R5QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5PiB7XG4gICAgI3N0YWdlczogQm9keVN0YWdlW10gPSBbXTtcbiAgICAjdHJ1c3RCb3g/OiBUcnVzdEJveCA9IHVuZGVmaW5lZDtcbiAgICAjZGlzY2xhaW1lcj86IFJpY2hUZXh0Lk5vZGVbXSA9IHVuZGVmaW5lZDtcbiAgICAjYXJ0aWNsZVNvdXJjZXM/OiBBcnRpY2xlU291cmNlcyA9IHVuZGVmaW5lZDtcblxuICAgIHN0YWdlcyguLi5zdGFnZXM6IEJ1aWxkQXJnczxCb2R5U3RhZ2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3N0YWdlcyA9IHN0YWdlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0cnVzdEJveCh0cnVzdEJveD86IEJ1aWxkQXJnPFRydXN0Qm94Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiN0cnVzdEJveCA9IG1hcEJ1aWxkQXJnKHRydXN0Qm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGlzY2xhaW1lcihkaXNjbGFpbWVyPzogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2Rpc2NsYWltZXIgPSBkaXNjbGFpbWVyPy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcnRpY2xlU291cmNlcyhhcnRpY2xlU291cmNlcz86IEJ1aWxkQXJnPEFydGljbGVTb3VyY2VzPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNhcnRpY2xlU291cmNlcyA9IG1hcEJ1aWxkQXJnKGFydGljbGVTb3VyY2VzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZXM6IHRoaXMuI3N0YWdlcyxcbiAgICAgICAgICAgIHRydXN0Qm94OiB0aGlzLiN0cnVzdEJveCxcbiAgICAgICAgICAgIGRpc2NsYWltZXI6IHRoaXMuI2Rpc2NsYWltZXIsXG4gICAgICAgICAgICBhcnRpY2xlU291cmNlczogdGhpcy4jYXJ0aWNsZVNvdXJjZXMsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBUcnVzdEJveEJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8VHJ1c3RCb3g+IHtcbiAgICAjbm9kZXM6IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuICAgICNoaWRkZW46IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuXG4gICAgbm9kZXMobm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNub2RlcyA9IG5vZGVzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhpZGRlbihoaWRkZW46IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoaWRkZW4gPSBoaWRkZW4ubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogVHJ1c3RCb3gge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZXM6IHRoaXMuI25vZGVzLFxuICAgICAgICAgICAgaGlkZGVuOiB0aGlzLiNoaWRkZW4sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBPcGVuZXJCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPE9wZW5lcj4ge1xuICAgICNlbGVtZW50OiBPcGVuZXJbXCJlbGVtZW50XCJdID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbXCJlbGVtZW50XCJdPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNlbGVtZW50ID0gbWFwQnVpbGRBcmcoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IE9wZW5lciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiNlbGVtZW50LFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjbm9kZXM6IFNlcUVsZW1lbnQ8UmljaFRleHQuTm9kZVtdPiA9IFtdO1xuICAgICNoZWFkZXI/OiBTZXFFbGVtZW50PEJvZHlIZWFkZXI+ID0gdW5kZWZpbmVkO1xuICAgICNjb21wYW5pb25zOiBTZXFFbGVtZW50PFN0YWdlLkNvbXBhbmlvbkl0ZW1bXT4gPSBbXTtcbiAgICAjY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IFNlcUVsZW1lbnQ8QnVpbGRBcmc8Qm9keUhlYWRlcj4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hlYWRlciA9IG1hcEJ1aWxkQXJncyhoZWFkZXIgPz8gW10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFN0YWdlLkNvbXBhbmlvbkl0ZW0+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21wYW5pb25zID0gY29tcGFuaW9ucy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+PlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKFxuICAgICAgICAgICAgICAgIFwiYm9keVN0YWdlXCIsXG4gICAgICAgICAgICAgICAgdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tcGFuaW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jaGVhZGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheShcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2VcbiAgICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5U3RhZ2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHlTdGFnZT4ge1xuICAgICNzZXFCdWlsZGVyOiBCb2R5U3RhZ2VTZXFCdWlsZGVyID0gbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKTtcblxuICAgIG5vZGVzKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5ub2Rlcyhbbm9kZXNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IEJ1aWxkQXJnPEJvZHlIZWFkZXI+KTogdGhpcyB7XG4gICAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIuaGVhZGVyKFtoZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbXBhbmlvbnMoW2NvbXBhbmlvbnNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbXCJ2YXJpYW50XCJdID0gXCJmdWxsXCI7XG4gICAgI29wZW5lcj86IE9wZW5lciA9IHVuZGVmaW5lZDtcblxuICAgIHZhcmlhbnQodmFyaWFudDogQm9keUhlYWRlcltcInZhcmlhbnRcIl0pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKFwiYXJ0aWNsZS1zb3VyY2VcIiwgdGhpcy4jbm9kZXMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBub2Rlczogc2VxTmV4dEVsZW1lbnQuYXJyYXkodGhpcy4jbm9kZXMpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8QXJ0aWNsZVNvdXJjZT4ge1xuICAgICNzZXFCdWlsZGVyOiBBcnRpY2xlU291cmNlU2VxQnVpbGRlciA9IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpO1xuXG4gICAgY29uc3RydWN0b3IoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGVzKC4uLm5vZGVzKTtcbiAgICB9XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VxQnVpbGRlci5idWlsZCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2VzPiB7XG4gICAgI25vZGVzOiBBcnRpY2xlU291cmNlW10gPSBbXTtcbiAgICAjaGlkZGVuOiBBcnRpY2xlU291cmNlW10gPSBbXTtcblxuICAgIG5vZGVzKC4uLm5vZGVzOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRkZW4oLi4uaGlkZGVuOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jaGlkZGVuID0gaGlkZGVuLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2VzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLiNub2RlcyxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy4jaGlkZGVuLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJub2RlIiwiY3JlYXRlIiwiQm9keUJ1aWxkZXIiLCJ0cnVzdEJveCIsIlRydXN0Qm94QnVpbGRlciIsIm9wZW5lciIsIk9wZW5lckJ1aWxkZXIiLCJzdGFnZSIsIkJvZHlTdGFnZUJ1aWxkZXIiLCJoZWFkZXIiLCJCb2R5SGVhZGVyQnVpbGRlciIsInNvdXJjZSIsIm5vZGVzIiwiQXJ0aWNsZVNvdXJjZUJ1aWxkZXIiLCJzb3VyY2VzIiwiQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIiwic2VxIiwiQm9keVN0YWdlU2VxQnVpbGRlciIsIkFydGljbGVTb3VyY2VTZXFCdWlsZGVyIiwiQWJzdHJhY3RCdWlsZGVyIiwic3RhZ2VzIiwibWFwIiwibWFwQnVpbGRBcmciLCJkaXNjbGFpbWVyIiwiYXJ0aWNsZVNvdXJjZXMiLCJidWlsZCIsInVuZGVmaW5lZCIsImhpZGRlbiIsImVsZW1lbnQiLCJpbWFnZSIsIkFic3RyYWN0U2VxQnVpbGRlciIsIm1hcEJ1aWxkQXJncyIsImNvbXBhbmlvbnMiLCJjb21tZXJjaWFsc0VuZE9mU3RhZ2UiLCJidWlsZExpc3RJdGVtIiwic2VxTmV4dEVsZW1lbnQiLCJpZCIsImhhc2giLCJhcnJheSIsIm1heWJlIiwic2VxQnVpbGRlciIsInZhcmlhbnQiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBb0QsSUFBQSxpQkFBb0IsV0FBcEIsb0JBQW9CLENBQUE7QUFDeEIsSUFBQSxhQUFpQixXQUFqQixpQkFBaUIsQ0FBQTtBQUMzQyxJQUFBLGVBQWtCLFdBQWxCLGtCQUFrQixDQUFBO0FBeUI1QkEsSUFBQUEsS0FBSSw2Q0FBTSxvQkFBb0IsRUFBMUI7QUFKaEI7O0dBRUcsQ0FDSCxZQUFBLEtBQW1DOzs7MkNBQW5DLEtBQW1DOzs7O21CQUFuQyxLQUFtQzs7O0VBQUE7QUFHNUIsTUFBTUMsTUFBTSxHQUErQixJQUFNLElBQUlDLFdBQVcsRUFBRTtBQUFDO1FBQTdERCxNQUFNLEdBQU5BLE1BQU07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
