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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RCdWlsZGVyc1wiO1xuaW1wb3J0IHsgaGFzaCwgbWFwQnVpbGRBcmcsIG1hcEJ1aWxkQXJncyB9IGZyb20gXCIuL0J1aWxkZXIudXRpbHNcIjtcbmltcG9ydCB7IGltYWdlIH0gZnJvbSBcIi4vRWxlbWVudEJ1aWxkZXJcIjtcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gXCJAcGFwZXIvbW9kZWxzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgQnVpbGRBcmcsXG4gICAgQnVpbGRBcmdzLFxuICAgIENyZWF0ZUJ1aWxkZXIsXG4gICAgU2VxRWxlbWVudCxcbiAgICBTZXFOZXh0RWxlbWVudENvbnZlcnRlcixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0J1aWxkZXIuYm9keS5ub2RlLmltZygpfVxuICovXG5leHBvcnQgKiBmcm9tIFwiLi9Cb2R5Tm9kZXNCdWlsZGVyXCI7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gXCIuL0JvZHlOb2Rlc0J1aWxkZXJcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZTogQ3JlYXRlQnVpbGRlcjxCb2R5QnVpbGRlcj4gPSAoKSA9PiBuZXcgQm9keUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCB0cnVzdEJveDogQ3JlYXRlQnVpbGRlcjxUcnVzdEJveEJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgVHJ1c3RCb3hCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgb3BlbmVyOiBDcmVhdGVCdWlsZGVyPE9wZW5lckJ1aWxkZXI+ID0gKCkgPT4gbmV3IE9wZW5lckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzdGFnZTogQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgQm9keUhlYWRlckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzb3VyY2U6IENyZWF0ZUJ1aWxkZXI8XG4gICAgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIsXG4gICAgQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+XG4+ID0gKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSkgPT5cbiAgICBuZXcgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIoLi4ubm9kZXMpO1xuZXhwb3J0IGNvbnN0IHNvdXJjZXM6IENyZWF0ZUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZXNCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEFydGljbGVTb3VyY2VzQnVpbGRlcigpO1xuXG5leHBvcnQgY29uc3Qgc2VxID0ge1xuICAgIHN0YWdlOiAoKCkgPT5cbiAgICAgICAgbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VTZXFCdWlsZGVyPixcbiAgICBzb3VyY2U6ICgoKSA9PlxuICAgICAgICBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxBcnRpY2xlU291cmNlU2VxQnVpbGRlcj4sXG59IGFzIGNvbnN0O1xuXG5jbGFzcyBCb2R5QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5PiB7XG4gICAgI3N0YWdlczogQm9keVN0YWdlW10gPSBbXTtcbiAgICAjdHJ1c3RCb3g/OiBUcnVzdEJveCA9IHVuZGVmaW5lZDtcbiAgICAjZGlzY2xhaW1lcj86IFJpY2hUZXh0Lk5vZGVbXSA9IHVuZGVmaW5lZDtcbiAgICAjYXJ0aWNsZVNvdXJjZXM/OiBBcnRpY2xlU291cmNlcyA9IHVuZGVmaW5lZDtcblxuICAgIHN0YWdlcyguLi5zdGFnZXM6IEJ1aWxkQXJnczxCb2R5U3RhZ2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3N0YWdlcyA9IHN0YWdlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0cnVzdEJveCh0cnVzdEJveD86IEJ1aWxkQXJnPFRydXN0Qm94Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiN0cnVzdEJveCA9IG1hcEJ1aWxkQXJnKHRydXN0Qm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGlzY2xhaW1lcihkaXNjbGFpbWVyPzogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2Rpc2NsYWltZXIgPSBkaXNjbGFpbWVyPy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcnRpY2xlU291cmNlcyhhcnRpY2xlU291cmNlcz86IEJ1aWxkQXJnPEFydGljbGVTb3VyY2VzPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNhcnRpY2xlU291cmNlcyA9IG1hcEJ1aWxkQXJnKGFydGljbGVTb3VyY2VzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZXM6IHRoaXMuI3N0YWdlcyxcbiAgICAgICAgICAgIHRydXN0Qm94OiB0aGlzLiN0cnVzdEJveCxcbiAgICAgICAgICAgIGRpc2NsYWltZXI6IHRoaXMuI2Rpc2NsYWltZXIsXG4gICAgICAgICAgICBhcnRpY2xlU291cmNlczogdGhpcy4jYXJ0aWNsZVNvdXJjZXMsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBUcnVzdEJveEJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8VHJ1c3RCb3g+IHtcbiAgICAjbm9kZXM6IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuICAgICNoaWRkZW46IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuXG4gICAgbm9kZXMobm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNub2RlcyA9IG5vZGVzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhpZGRlbihoaWRkZW46IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoaWRkZW4gPSBoaWRkZW4ubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogVHJ1c3RCb3gge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZXM6IHRoaXMuI25vZGVzLFxuICAgICAgICAgICAgaGlkZGVuOiB0aGlzLiNoaWRkZW4sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBPcGVuZXJCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPE9wZW5lcj4ge1xuICAgICNlbGVtZW50OiBPcGVuZXJbXCJlbGVtZW50XCJdID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbXCJlbGVtZW50XCJdPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNlbGVtZW50ID0gbWFwQnVpbGRBcmcoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IE9wZW5lciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiNlbGVtZW50LFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjbm9kZXM6IFNlcUVsZW1lbnQ8UmljaFRleHQuTm9kZVtdPiA9IFtdO1xuICAgICNoZWFkZXI/OiBTZXFFbGVtZW50PEJvZHlIZWFkZXI+ID0gdW5kZWZpbmVkO1xuICAgICNjb21wYW5pb25zOiBTZXFFbGVtZW50PFN0YWdlLkNvbXBhbmlvbkl0ZW1bXT4gPSBbXTtcbiAgICAjY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IFNlcUVsZW1lbnQ8QnVpbGRBcmc8Qm9keUhlYWRlcj4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hlYWRlciA9IG1hcEJ1aWxkQXJncyhoZWFkZXIgPz8gW10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFN0YWdlLkNvbXBhbmlvbkl0ZW0+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21wYW5pb25zID0gY29tcGFuaW9ucy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+PlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKFxuICAgICAgICAgICAgICAgIFwiYm9keVN0YWdlXCIsXG4gICAgICAgICAgICAgICAgdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tcGFuaW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jaGVhZGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheShcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2VcbiAgICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5U3RhZ2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHlTdGFnZT4ge1xuICAgICNzZXFCdWlsZGVyOiBCb2R5U3RhZ2VTZXFCdWlsZGVyID0gbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKTtcblxuICAgIG5vZGVzKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5ub2Rlcyhbbm9kZXNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IEJ1aWxkQXJnPEJvZHlIZWFkZXI+KTogdGhpcyB7XG4gICAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIuaGVhZGVyKFtoZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbXBhbmlvbnMoW2NvbXBhbmlvbnNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbXCJ2YXJpYW50XCJdID0gXCJmdWxsXCI7XG4gICAgI29wZW5lcj86IE9wZW5lciA9IHVuZGVmaW5lZDtcblxuICAgIHZhcmlhbnQodmFyaWFudDogQm9keUhlYWRlcltcInZhcmlhbnRcIl0pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKFwiYXJ0aWNsZS1zb3VyY2VcIiwgdGhpcy4jbm9kZXMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBub2Rlczogc2VxTmV4dEVsZW1lbnQuYXJyYXkodGhpcy4jbm9kZXMpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8QXJ0aWNsZVNvdXJjZT4ge1xuICAgICNzZXFCdWlsZGVyOiBBcnRpY2xlU291cmNlU2VxQnVpbGRlciA9IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpO1xuXG4gICAgY29uc3RydWN0b3IoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGVzKC4uLm5vZGVzKTtcbiAgICB9XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VxQnVpbGRlci5idWlsZCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2VzPiB7XG4gICAgI25vZGVzOiBBcnRpY2xlU291cmNlW10gPSBbXTtcbiAgICAjaGlkZGVuOiBBcnRpY2xlU291cmNlW10gPSBbXTtcblxuICAgIG5vZGVzKC4uLm5vZGVzOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRkZW4oLi4uaGlkZGVuOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jaGlkZGVuID0gaGlkZGVuLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2VzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLiNub2RlcyxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy4jaGlkZGVuLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJub2RlIiwiY3JlYXRlIiwiQm9keUJ1aWxkZXIiLCJ0cnVzdEJveCIsIlRydXN0Qm94QnVpbGRlciIsIm9wZW5lciIsIk9wZW5lckJ1aWxkZXIiLCJzdGFnZSIsIkJvZHlTdGFnZUJ1aWxkZXIiLCJoZWFkZXIiLCJCb2R5SGVhZGVyQnVpbGRlciIsInNvdXJjZSIsIm5vZGVzIiwiQXJ0aWNsZVNvdXJjZUJ1aWxkZXIiLCJzb3VyY2VzIiwiQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIiwic2VxIiwiQm9keVN0YWdlU2VxQnVpbGRlciIsIkFydGljbGVTb3VyY2VTZXFCdWlsZGVyIiwiQWJzdHJhY3RCdWlsZGVyIiwic3RhZ2VzIiwibWFwIiwibWFwQnVpbGRBcmciLCJkaXNjbGFpbWVyIiwiYXJ0aWNsZVNvdXJjZXMiLCJidWlsZCIsInVuZGVmaW5lZCIsImhpZGRlbiIsImVsZW1lbnQiLCJpbWFnZSIsIkFic3RyYWN0U2VxQnVpbGRlciIsIm1hcEJ1aWxkQXJncyIsImNvbXBhbmlvbnMiLCJjb21tZXJjaWFsc0VuZE9mU3RhZ2UiLCJidWlsZExpc3RJdGVtIiwic2VxTmV4dEVsZW1lbnQiLCJpZCIsImhhc2giLCJhcnJheSIsIm1heWJlIiwic2VxQnVpbGRlciIsInZhcmlhbnQiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBb0QsSUFBQSxpQkFBb0IsV0FBcEIsb0JBQW9CLENBQUE7QUFDeEIsSUFBQSxhQUFpQixXQUFqQixpQkFBaUIsQ0FBQTtBQUMzQyxJQUFBLGVBQWtCLFdBQWxCLGtCQUFrQixDQUFBO0FBeUI1QkEsSUFBQUEsS0FBSSxxQ0FBTSxvQkFBb0IsRUFBMUI7QUFKaEI7O0dBRUcsQ0FDSCxZQUFBLEtBQW1DOzs7MkNBQW5DLEtBQW1DOzs7O21CQUFuQyxLQUFtQzs7O0VBQUE7QUFHNUIsTUFBTUMsTUFBTSxHQUErQixJQUFNLElBQUlDLFdBQVcsRUFBRSxBQUFDO1FBQTdERCxNQUFNLEdBQU5BLE1B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
