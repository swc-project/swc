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
var _class_private_field_get = require("@swc/helpers/lib/_class_private_field_get.js").default;
var _class_private_field_init = require("@swc/helpers/lib/_class_private_field_init.js").default;
var _class_private_field_set = require("@swc/helpers/lib/_class_private_field_set.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _abstractBuilders = require("./AbstractBuilders");
var _builderUtils = require("./Builder.utils");
var _elementBuilder = require("./ElementBuilder");
var _node = _interop_require_wildcard(require("./BodyNodesBuilder"));
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
const create = ()=>new BodyBuilder();
exports.create = create;
const trustBox = ()=>new TrustBoxBuilder();
exports.trustBox = trustBox;
const opener = ()=>new OpenerBuilder();
exports.opener = opener;
const stage = ()=>new BodyStageBuilder();
exports.stage = stage;
const header = ()=>new BodyHeaderBuilder();
exports.header = header;
const source = (nodes = [])=>new ArticleSourceBuilder(...nodes);
exports.source = source;
const sources = ()=>new ArticleSourcesBuilder();
exports.sources = sources;
const seq = {
    stage: ()=>new BodyStageSeqBuilder(),
    source: ()=>new ArticleSourceSeqBuilder()
};
exports.seq = seq;
var _stages = /*#__PURE__*/ new WeakMap(), _trustBox = /*#__PURE__*/ new WeakMap(), _disclaimer = /*#__PURE__*/ new WeakMap(), _articleSources = /*#__PURE__*/ new WeakMap();
class BodyBuilder extends _abstractBuilders.AbstractBuilder {
    stages(...stages) {
        _class_private_field_set(this, _stages, stages.map(_builderUtils.mapBuildArg));
        return this;
    }
    trustBox(trustBox1) {
        _class_private_field_set(this, _trustBox, (0, _builderUtils).mapBuildArg(trustBox1));
        return this;
    }
    disclaimer(disclaimer) {
        _class_private_field_set(this, _disclaimer, disclaimer?.map(_builderUtils.mapBuildArg));
        return this;
    }
    articleSources(articleSources) {
        _class_private_field_set(this, _articleSources, (0, _builderUtils).mapBuildArg(articleSources));
        return this;
    }
    build() {
        return {
            stages: _class_private_field_get(this, _stages),
            trustBox: _class_private_field_get(this, _trustBox),
            disclaimer: _class_private_field_get(this, _disclaimer),
            articleSources: _class_private_field_get(this, _articleSources)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _stages, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _trustBox, {
            writable: true,
            value: undefined
        });
        _class_private_field_init(this, _disclaimer, {
            writable: true,
            value: undefined
        });
        _class_private_field_init(this, _articleSources, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes = /*#__PURE__*/ new WeakMap(), _hidden = /*#__PURE__*/ new WeakMap();
class TrustBoxBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(hidden) {
        _class_private_field_set(this, _hidden, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _class_private_field_get(this, _nodes),
            hidden: _class_private_field_get(this, _hidden)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _nodes, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _hidden, {
            writable: true,
            value: []
        });
    }
}
var _element = /*#__PURE__*/ new WeakMap();
class OpenerBuilder extends _abstractBuilders.AbstractBuilder {
    element(element) {
        _class_private_field_set(this, _element, (0, _builderUtils).mapBuildArg(element));
        return this;
    }
    build() {
        return {
            element: _class_private_field_get(this, _element)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _element, {
            writable: true,
            value: (0, _elementBuilder).image().build()
        });
    }
}
var _nodes1 = /*#__PURE__*/ new WeakMap(), _header = /*#__PURE__*/ new WeakMap(), _companions = /*#__PURE__*/ new WeakMap(), _commercialsEndOfStage = /*#__PURE__*/ new WeakMap();
class BodyStageSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes1, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    header(header1) {
        _class_private_field_set(this, _header, (0, _builderUtils).mapBuildArgs(header1 ?? []));
        return this;
    }
    companions(companions) {
        _class_private_field_set(this, _companions, companions.map(_builderUtils.mapBuildArgs));
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _class_private_field_set(this, _commercialsEndOfStage, commercialsEndOfStage.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        return {
            id: (0, _builderUtils).hash("bodyStage", _class_private_field_get(this, _nodes1), _class_private_field_get(this, _companions), _class_private_field_get(this, _commercialsEndOfStage), _class_private_field_get(this, _header)),
            nodes: seqNextElement.array(_class_private_field_get(this, _nodes1)),
            header: seqNextElement.maybe(_class_private_field_get(this, _header)),
            companions: seqNextElement.array(_class_private_field_get(this, _companions)),
            commercialsEndOfStage: seqNextElement.array(_class_private_field_get(this, _commercialsEndOfStage))
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _nodes1, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _header, {
            writable: true,
            value: undefined
        });
        _class_private_field_init(this, _companions, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _commercialsEndOfStage, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder = /*#__PURE__*/ new WeakMap();
class BodyStageBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _class_private_field_get(this, _seqBuilder).nodes([
            nodes
        ]);
        return this;
    }
    header(header2) {
        if (header2) {
            _class_private_field_get(this, _seqBuilder).header([
                header2
            ]);
        }
        return this;
    }
    companions(companions) {
        _class_private_field_get(this, _seqBuilder).companions([
            companions
        ]);
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _class_private_field_get(this, _seqBuilder).commercialsEndOfStage([
            commercialsEndOfStage
        ]);
        return this;
    }
    build() {
        return _class_private_field_get(this, _seqBuilder).build();
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _seqBuilder, {
            writable: true,
            value: new BodyStageSeqBuilder()
        });
    }
}
var _variant = /*#__PURE__*/ new WeakMap(), _opener = /*#__PURE__*/ new WeakMap();
class BodyHeaderBuilder extends _abstractBuilders.AbstractBuilder {
    variant(variant) {
        _class_private_field_set(this, _variant, variant);
        return this;
    }
    opener(opener1) {
        _class_private_field_set(this, _opener, (0, _builderUtils).mapBuildArg(opener1));
        return this;
    }
    build() {
        return {
            variant: _class_private_field_get(this, _variant),
            opener: _class_private_field_get(this, _opener)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _variant, {
            writable: true,
            value: "full"
        });
        _class_private_field_init(this, _opener, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes2 = /*#__PURE__*/ new WeakMap();
class ArticleSourceSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes2, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        const id = (0, _builderUtils).hash("article-source", _class_private_field_get(this, _nodes2));
        return {
            id,
            nodes: seqNextElement.array(_class_private_field_get(this, _nodes2))
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _nodes2, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder1 = /*#__PURE__*/ new WeakMap();
class ArticleSourceBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _class_private_field_get(this, _seqBuilder1).nodes([
            nodes
        ]);
        return this;
    }
    build() {
        return _class_private_field_get(this, _seqBuilder1).build();
    }
    constructor(...nodes){
        super();
        _class_private_field_init(this, _seqBuilder1, {
            writable: true,
            value: new ArticleSourceSeqBuilder()
        });
        this.nodes(...nodes);
    }
}
var _nodes3 = /*#__PURE__*/ new WeakMap(), _hidden1 = /*#__PURE__*/ new WeakMap();
class ArticleSourcesBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _class_private_field_set(this, _nodes3, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(...hidden) {
        _class_private_field_set(this, _hidden1, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _class_private_field_get(this, _nodes3),
            hidden: _class_private_field_get(this, _hidden1)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _nodes3, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _hidden1, {
            writable: true,
            value: []
        });
    }
}
exports.node = _node;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RCdWlsZGVyc1wiO1xuaW1wb3J0IHsgaGFzaCwgbWFwQnVpbGRBcmcsIG1hcEJ1aWxkQXJncyB9IGZyb20gXCIuL0J1aWxkZXIudXRpbHNcIjtcbmltcG9ydCB7IGltYWdlIH0gZnJvbSBcIi4vRWxlbWVudEJ1aWxkZXJcIjtcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gXCJAcGFwZXIvbW9kZWxzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgQnVpbGRBcmcsXG4gICAgQnVpbGRBcmdzLFxuICAgIENyZWF0ZUJ1aWxkZXIsXG4gICAgU2VxRWxlbWVudCxcbiAgICBTZXFOZXh0RWxlbWVudENvbnZlcnRlcixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0J1aWxkZXIuYm9keS5ub2RlLmltZygpfVxuICovXG5leHBvcnQgKiBmcm9tIFwiLi9Cb2R5Tm9kZXNCdWlsZGVyXCI7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gXCIuL0JvZHlOb2Rlc0J1aWxkZXJcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZTogQ3JlYXRlQnVpbGRlcjxCb2R5QnVpbGRlcj4gPSAoKSA9PiBuZXcgQm9keUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCB0cnVzdEJveDogQ3JlYXRlQnVpbGRlcjxUcnVzdEJveEJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgVHJ1c3RCb3hCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgb3BlbmVyOiBDcmVhdGVCdWlsZGVyPE9wZW5lckJ1aWxkZXI+ID0gKCkgPT4gbmV3IE9wZW5lckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzdGFnZTogQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgQm9keUhlYWRlckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzb3VyY2U6IENyZWF0ZUJ1aWxkZXI8XG4gICAgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIsXG4gICAgQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+XG4+ID0gKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSkgPT5cbiAgICBuZXcgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIoLi4ubm9kZXMpO1xuZXhwb3J0IGNvbnN0IHNvdXJjZXM6IENyZWF0ZUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZXNCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEFydGljbGVTb3VyY2VzQnVpbGRlcigpO1xuXG5leHBvcnQgY29uc3Qgc2VxID0ge1xuICAgIHN0YWdlOiAoKCkgPT5cbiAgICAgICAgbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VTZXFCdWlsZGVyPixcbiAgICBzb3VyY2U6ICgoKSA9PlxuICAgICAgICBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxBcnRpY2xlU291cmNlU2VxQnVpbGRlcj4sXG59IGFzIGNvbnN0O1xuXG5jbGFzcyBCb2R5QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5PiB7XG4gICAgI3N0YWdlczogQm9keVN0YWdlW10gPSBbXTtcbiAgICAjdHJ1c3RCb3g/OiBUcnVzdEJveCA9IHVuZGVmaW5lZDtcbiAgICAjZGlzY2xhaW1lcj86IFJpY2hUZXh0Lk5vZGVbXSA9IHVuZGVmaW5lZDtcbiAgICAjYXJ0aWNsZVNvdXJjZXM/OiBBcnRpY2xlU291cmNlcyA9IHVuZGVmaW5lZDtcblxuICAgIHN0YWdlcyguLi5zdGFnZXM6IEJ1aWxkQXJnczxCb2R5U3RhZ2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3N0YWdlcyA9IHN0YWdlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0cnVzdEJveCh0cnVzdEJveD86IEJ1aWxkQXJnPFRydXN0Qm94Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiN0cnVzdEJveCA9IG1hcEJ1aWxkQXJnKHRydXN0Qm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGlzY2xhaW1lcihkaXNjbGFpbWVyPzogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2Rpc2NsYWltZXIgPSBkaXNjbGFpbWVyPy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcnRpY2xlU291cmNlcyhhcnRpY2xlU291cmNlcz86IEJ1aWxkQXJnPEFydGljbGVTb3VyY2VzPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNhcnRpY2xlU291cmNlcyA9IG1hcEJ1aWxkQXJnKGFydGljbGVTb3VyY2VzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZXM6IHRoaXMuI3N0YWdlcyxcbiAgICAgICAgICAgIHRydXN0Qm94OiB0aGlzLiN0cnVzdEJveCxcbiAgICAgICAgICAgIGRpc2NsYWltZXI6IHRoaXMuI2Rpc2NsYWltZXIsXG4gICAgICAgICAgICBhcnRpY2xlU291cmNlczogdGhpcy4jYXJ0aWNsZVNvdXJjZXMsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBUcnVzdEJveEJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8VHJ1c3RCb3g+IHtcbiAgICAjbm9kZXM6IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuICAgICNoaWRkZW46IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuXG4gICAgbm9kZXMobm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNub2RlcyA9IG5vZGVzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhpZGRlbihoaWRkZW46IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoaWRkZW4gPSBoaWRkZW4ubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogVHJ1c3RCb3gge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZXM6IHRoaXMuI25vZGVzLFxuICAgICAgICAgICAgaGlkZGVuOiB0aGlzLiNoaWRkZW4sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBPcGVuZXJCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPE9wZW5lcj4ge1xuICAgICNlbGVtZW50OiBPcGVuZXJbXCJlbGVtZW50XCJdID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbXCJlbGVtZW50XCJdPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNlbGVtZW50ID0gbWFwQnVpbGRBcmcoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IE9wZW5lciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiNlbGVtZW50LFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjbm9kZXM6IFNlcUVsZW1lbnQ8UmljaFRleHQuTm9kZVtdPiA9IFtdO1xuICAgICNoZWFkZXI/OiBTZXFFbGVtZW50PEJvZHlIZWFkZXI+ID0gdW5kZWZpbmVkO1xuICAgICNjb21wYW5pb25zOiBTZXFFbGVtZW50PFN0YWdlLkNvbXBhbmlvbkl0ZW1bXT4gPSBbXTtcbiAgICAjY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IFNlcUVsZW1lbnQ8QnVpbGRBcmc8Qm9keUhlYWRlcj4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hlYWRlciA9IG1hcEJ1aWxkQXJncyhoZWFkZXIgPz8gW10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFN0YWdlLkNvbXBhbmlvbkl0ZW0+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21wYW5pb25zID0gY29tcGFuaW9ucy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+PlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKFxuICAgICAgICAgICAgICAgIFwiYm9keVN0YWdlXCIsXG4gICAgICAgICAgICAgICAgdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tcGFuaW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jaGVhZGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheShcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2VcbiAgICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5U3RhZ2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHlTdGFnZT4ge1xuICAgICNzZXFCdWlsZGVyOiBCb2R5U3RhZ2VTZXFCdWlsZGVyID0gbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKTtcblxuICAgIG5vZGVzKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5ub2Rlcyhbbm9kZXNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IEJ1aWxkQXJnPEJvZHlIZWFkZXI+KTogdGhpcyB7XG4gICAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIuaGVhZGVyKFtoZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbXBhbmlvbnMoW2NvbXBhbmlvbnNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbXCJ2YXJpYW50XCJdID0gXCJmdWxsXCI7XG4gICAgI29wZW5lcj86IE9wZW5lciA9IHVuZGVmaW5lZDtcblxuICAgIHZhcmlhbnQodmFyaWFudDogQm9keUhlYWRlcltcInZhcmlhbnRcIl0pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKFwiYXJ0aWNsZS1zb3VyY2VcIiwgdGhpcy4jbm9kZXMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBub2Rlczogc2VxTmV4dEVsZW1lbnQuYXJyYXkodGhpcy4jbm9kZXMpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8QXJ0aWNsZVNvdXJjZT4ge1xuICAgICNzZXFCdWlsZGVyOiBBcnRpY2xlU291cmNlU2VxQnVpbGRlciA9IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpO1xuXG4gICAgY29uc3RydWN0b3IoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGVzKC4uLm5vZGVzKTtcbiAgICB9XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VxQnVpbGRlci5idWlsZCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2VzPiB7XG4gICAgI25vZGVzOiBBcnRpY2xlU291cmNlW10gPSBbXTtcbiAgICAjaGlkZGVuOiBBcnRpY2xlU291cmNlW10gPSBbXTtcblxuICAgIG5vZGVzKC4uLm5vZGVzOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRkZW4oLi4uaGlkZGVuOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jaGlkZGVuID0gaGlkZGVuLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2VzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLiNub2RlcyxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy4jaGlkZGVuLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJub2RlIiwiY3JlYXRlIiwiQm9keUJ1aWxkZXIiLCJ0cnVzdEJveCIsIlRydXN0Qm94QnVpbGRlciIsIm9wZW5lciIsIk9wZW5lckJ1aWxkZXIiLCJzdGFnZSIsIkJvZHlTdGFnZUJ1aWxkZXIiLCJoZWFkZXIiLCJCb2R5SGVhZGVyQnVpbGRlciIsInNvdXJjZSIsIm5vZGVzIiwiQXJ0aWNsZVNvdXJjZUJ1aWxkZXIiLCJzb3VyY2VzIiwiQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIiwic2VxIiwiQm9keVN0YWdlU2VxQnVpbGRlciIsIkFydGljbGVTb3VyY2VTZXFCdWlsZGVyIiwiQWJzdHJhY3RCdWlsZGVyIiwic3RhZ2VzIiwibWFwIiwibWFwQnVpbGRBcmciLCJkaXNjbGFpbWVyIiwiYXJ0aWNsZVNvdXJjZXMiLCJidWlsZCIsInVuZGVmaW5lZCIsImhpZGRlbiIsImVsZW1lbnQiLCJpbWFnZSIsIkFic3RyYWN0U2VxQnVpbGRlciIsIm1hcEJ1aWxkQXJncyIsImNvbXBhbmlvbnMiLCJjb21tZXJjaWFsc0VuZE9mU3RhZ2UiLCJidWlsZExpc3RJdGVtIiwic2VxTmV4dEVsZW1lbnQiLCJpZCIsImhhc2giLCJhcnJheSIsIm1heWJlIiwic2VxQnVpbGRlciIsInZhcmlhbnQiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQW9ELElBQUEsaUJBQW9CLFdBQXBCLG9CQUFvQixDQUFBO0FBQ3hCLElBQUEsYUFBaUIsV0FBakIsaUJBQWlCLENBQUE7QUFDM0MsSUFBQSxlQUFrQixXQUFsQixrQkFBa0IsQ0FBQTtBQXlCNUJBLElBQUFBLEtBQUkscUNBQU0sb0JBQW9CLEVBQTFCO0FBSmhCOztHQUVHLENBQ0gsWUFBQSxLQUFtQzs7OzJDQUFuQyxLQUFtQzs7OzttQkFBbkMsS0FBbUM7OztFQUFBO0FBRzVCLE1BQU1DLE1BQU0sR0FBK0IsSUFBTSxJQUFJQyxXQUFXLEVBQUUsQUFBQztRQUE3REQsTUFBTSxHQUFO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
