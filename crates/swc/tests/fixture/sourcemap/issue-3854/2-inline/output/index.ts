"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
    node: true,
    node: true
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
exports.node = _node;
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
            id: (0, _builderUtils).hash('bodyStage', swcHelpers.classPrivateFieldGet(this, _nodes1), swcHelpers.classPrivateFieldGet(this, _companions), swcHelpers.classPrivateFieldGet(this, _commercialsEndOfStage), swcHelpers.classPrivateFieldGet(this, _header)),
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
            value: 'full'
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
        const id = (0, _builderUtils).hash('article-source', swcHelpers.classPrivateFieldGet(this, _nodes2));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSAnLi9BYnN0cmFjdEJ1aWxkZXJzJztcbmltcG9ydCB7IGhhc2gsIG1hcEJ1aWxkQXJnLCBtYXBCdWlsZEFyZ3MgfSBmcm9tICcuL0J1aWxkZXIudXRpbHMnO1xuaW1wb3J0IHsgaW1hZ2UgfSBmcm9tICcuL0VsZW1lbnRCdWlsZGVyJztcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gJ0BwYXBlci9tb2RlbHMnO1xuaW1wb3J0IHR5cGUgeyBCdWlsZEFyZywgQnVpbGRBcmdzLCBDcmVhdGVCdWlsZGVyLCBTZXFFbGVtZW50LCBTZXFOZXh0RWxlbWVudENvbnZlcnRlciB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSB7QnVpbGRlci5ib2R5Lm5vZGUuaW1nKCl9XG4gKi9cbmV4cG9ydCAqIGZyb20gJy4vQm9keU5vZGVzQnVpbGRlcic7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gJy4vQm9keU5vZGVzQnVpbGRlcic7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGU6IENyZWF0ZUJ1aWxkZXI8Qm9keUJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlCdWlsZGVyKCk7XG5leHBvcnQgY29uc3QgdHJ1c3RCb3g6IENyZWF0ZUJ1aWxkZXI8VHJ1c3RCb3hCdWlsZGVyPiA9ICgpID0+IG5ldyBUcnVzdEJveEJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBvcGVuZXI6IENyZWF0ZUJ1aWxkZXI8T3BlbmVyQnVpbGRlcj4gPSAoKSA9PiBuZXcgT3BlbmVyQnVpbGRlcigpO1xuZXhwb3J0IGNvbnN0IHN0YWdlOiBDcmVhdGVCdWlsZGVyPEJvZHlTdGFnZUJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlIZWFkZXJCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgc291cmNlOiBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VCdWlsZGVyLCBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4+ID0gKFxuICAgIG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSxcbikgPT4gbmV3IEFydGljbGVTb3VyY2VCdWlsZGVyKC4uLm5vZGVzKTtcbmV4cG9ydCBjb25zdCBzb3VyY2VzOiBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VzQnVpbGRlcj4gPSAoKSA9PiBuZXcgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyKCk7XG5cbmV4cG9ydCBjb25zdCBzZXEgPSB7XG4gICAgc3RhZ2U6ICgoKSA9PiBuZXcgQm9keVN0YWdlU2VxQnVpbGRlcigpKSBhcyBDcmVhdGVCdWlsZGVyPEJvZHlTdGFnZVNlcUJ1aWxkZXI+LFxuICAgIHNvdXJjZTogKCgpID0+IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpKSBhcyBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VTZXFCdWlsZGVyPixcbn0gYXMgY29uc3Q7XG5cbmNsYXNzIEJvZHlCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHk+IHtcbiAgICAjc3RhZ2VzOiBCb2R5U3RhZ2VbXSA9IFtdO1xuICAgICN0cnVzdEJveD86IFRydXN0Qm94ID0gdW5kZWZpbmVkO1xuICAgICNkaXNjbGFpbWVyPzogUmljaFRleHQuTm9kZVtdID0gdW5kZWZpbmVkO1xuICAgICNhcnRpY2xlU291cmNlcz86IEFydGljbGVTb3VyY2VzID0gdW5kZWZpbmVkO1xuXG4gICAgc3RhZ2VzKC4uLnN0YWdlczogQnVpbGRBcmdzPEJvZHlTdGFnZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc3RhZ2VzID0gc3RhZ2VzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRydXN0Qm94KHRydXN0Qm94PzogQnVpbGRBcmc8VHJ1c3RCb3g+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3RydXN0Qm94ID0gbWFwQnVpbGRBcmcodHJ1c3RCb3gpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkaXNjbGFpbWVyKGRpc2NsYWltZXI/OiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jZGlzY2xhaW1lciA9IGRpc2NsYWltZXI/Lm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFydGljbGVTb3VyY2VzKGFydGljbGVTb3VyY2VzPzogQnVpbGRBcmc8QXJ0aWNsZVNvdXJjZXM+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2FydGljbGVTb3VyY2VzID0gbWFwQnVpbGRBcmcoYXJ0aWNsZVNvdXJjZXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBCb2R5IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YWdlczogdGhpcy4jc3RhZ2VzLFxuICAgICAgICAgICAgdHJ1c3RCb3g6IHRoaXMuI3RydXN0Qm94LFxuICAgICAgICAgICAgZGlzY2xhaW1lcjogdGhpcy4jZGlzY2xhaW1lcixcbiAgICAgICAgICAgIGFydGljbGVTb3VyY2VzOiB0aGlzLiNhcnRpY2xlU291cmNlcyxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIFRydXN0Qm94QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxUcnVzdEJveD4ge1xuICAgICNub2RlczogUmljaFRleHQuTm9kZVtdID0gW107XG4gICAgI2hpZGRlbjogUmljaFRleHQuTm9kZVtdID0gW107XG5cbiAgICBub2Rlcyhub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGlkZGVuKGhpZGRlbjogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hpZGRlbiA9IGhpZGRlbi5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBUcnVzdEJveCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2RlczogdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICBoaWRkZW46IHRoaXMuI2hpZGRlbixcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIE9wZW5lckJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8T3BlbmVyPiB7XG4gICAgI2VsZW1lbnQ6IE9wZW5lclsnZWxlbWVudCddID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbJ2VsZW1lbnQnXT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudCA9IG1hcEJ1aWxkQXJnKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBPcGVuZXIge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudDogdGhpcy4jZWxlbWVudCxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIEJvZHlTdGFnZVNlcUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdFNlcUJ1aWxkZXI8Qm9keVN0YWdlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcbiAgICAjaGVhZGVyPzogU2VxRWxlbWVudDxCb2R5SGVhZGVyPiA9IHVuZGVmaW5lZDtcbiAgICAjY29tcGFuaW9uczogU2VxRWxlbWVudDxTdGFnZS5Db21wYW5pb25JdGVtW10+ID0gW107XG4gICAgI2NvbW1lcmNpYWxzRW5kT2ZTdGFnZTogU2VxRWxlbWVudDxSaWNoVGV4dC5Ob2RlW10+ID0gW107XG5cbiAgICBub2Rlcyhub2RlczogU2VxRWxlbWVudDxCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcihoZWFkZXI/OiBTZXFFbGVtZW50PEJ1aWxkQXJnPEJvZHlIZWFkZXI+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoZWFkZXIgPSBtYXBCdWlsZEFyZ3MoaGVhZGVyID8/IFtdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tcGFuaW9ucyhjb21wYW5pb25zOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jY29tcGFuaW9ucyA9IGNvbXBhbmlvbnMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZShjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKCdib2R5U3RhZ2UnLCB0aGlzLiNub2RlcywgdGhpcy4jY29tcGFuaW9ucywgdGhpcy4jY29tbWVyY2lhbHNFbmRPZlN0YWdlLCB0aGlzLiNoZWFkZXIpLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheSh0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjc2VxQnVpbGRlcjogQm9keVN0YWdlU2VxQnVpbGRlciA9IG5ldyBCb2R5U3RhZ2VTZXFCdWlsZGVyKCk7XG5cbiAgICBub2Rlcyhub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcihoZWFkZXI/OiBCdWlsZEFyZzxCb2R5SGVhZGVyPik6IHRoaXMge1xuICAgICAgICBpZiAoaGVhZGVyKSB7XG4gICAgICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmhlYWRlcihbaGVhZGVyXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tcGFuaW9ucyhjb21wYW5pb25zOiBCdWlsZEFyZ3M8U3RhZ2UuQ29tcGFuaW9uSXRlbT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5jb21wYW5pb25zKFtjb21wYW5pb25zXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZShjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbJ3ZhcmlhbnQnXSA9ICdmdWxsJztcbiAgICAjb3BlbmVyPzogT3BlbmVyID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyaWFudCh2YXJpYW50OiBCb2R5SGVhZGVyWyd2YXJpYW50J10pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKCdhcnRpY2xlLXNvdXJjZScsIHRoaXMuI25vZGVzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIEFydGljbGVTb3VyY2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2U+IHtcbiAgICAjc2VxQnVpbGRlcjogQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIgPSBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLm5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ub2RlcyguLi5ub2Rlcyk7XG4gICAgfVxuXG4gICAgbm9kZXMoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLm5vZGVzKFtub2Rlc10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NlcUJ1aWxkZXIuYnVpbGQoKTtcbiAgICB9XG59XG5cbmNsYXNzIEFydGljbGVTb3VyY2VzQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxBcnRpY2xlU291cmNlcz4ge1xuICAgICNub2RlczogQXJ0aWNsZVNvdXJjZVtdID0gW107XG4gICAgI2hpZGRlbjogQXJ0aWNsZVNvdXJjZVtdID0gW107XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPEFydGljbGVTb3VyY2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGlkZGVuKC4uLmhpZGRlbjogQnVpbGRBcmdzPEFydGljbGVTb3VyY2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hpZGRlbiA9IGhpZGRlbi5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBBcnRpY2xlU291cmNlcyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2RlczogdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICBoaWRkZW46IHRoaXMuI2hpZGRlbixcbiAgICAgICAgfTtcbiAgICB9XG59Il0sIm5hbWVzIjpbIm5vZGUiLCJjcmVhdGUiLCJCb2R5QnVpbGRlciIsInRydXN0Qm94IiwiVHJ1c3RCb3hCdWlsZGVyIiwib3BlbmVyIiwiT3BlbmVyQnVpbGRlciIsInN0YWdlIiwiQm9keVN0YWdlQnVpbGRlciIsImhlYWRlciIsIkJvZHlIZWFkZXJCdWlsZGVyIiwic291cmNlIiwibm9kZXMiLCJBcnRpY2xlU291cmNlQnVpbGRlciIsInNvdXJjZXMiLCJBcnRpY2xlU291cmNlc0J1aWxkZXIiLCJzZXEiLCJCb2R5U3RhZ2VTZXFCdWlsZGVyIiwiQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIiLCJBYnN0cmFjdEJ1aWxkZXIiLCJzdGFnZXMiLCJtYXAiLCJtYXBCdWlsZEFyZyIsImRpc2NsYWltZXIiLCJhcnRpY2xlU291cmNlcyIsImJ1aWxkIiwidW5kZWZpbmVkIiwiaGlkZGVuIiwiZWxlbWVudCIsImltYWdlIiwiQWJzdHJhY3RTZXFCdWlsZGVyIiwibWFwQnVpbGRBcmdzIiwiY29tcGFuaW9ucyIsImNvbW1lcmNpYWxzRW5kT2ZTdGFnZSIsImJ1aWxkTGlzdEl0ZW0iLCJzZXFOZXh0RWxlbWVudCIsImlkIiwiaGFzaCIsImFycmF5IiwibWF5YmUiLCJzZXFCdWlsZGVyIiwidmFyaWFudCIsImNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiQUFBQSxZQUFBOzs7RUFBQTs7Ozs7NEpBQUE7O0FBQW9ELElBQUEsaUJBQW9CLFdBQXBCLG9CQUFvQixDQUFBO0FBQ3hCLElBQUEsYUFBaUIsV0FBakIsaUJBQWlCLENBQUE7QUFDM0MsSUFBQSxlQUFrQixXQUFsQixrQkFBa0IsQ0FBQTtBQW1CNUJBLElBQUFBLEtBQUksNkNBQU0sb0JBQW9CLEVBQTFCO0FBSmhCOztHQUVHLENBQ0gsWUFBQSxLQUFtQzs7OzJDQUFuQyxLQUFtQzs7OzttQkFBbkMsS0FBbUM7O01BcEJuQztFQW9CbUMsQUFwQm5DO1FBcUJZQSxJQUFJLEdBQUpBLEtBQUksQUFyQmhCO0FBdUJPLE1BQU1DLE1BQU0sR0FBK0IsSUFBTSxJQUFJQyxXQUFXLEVBQUU7QUFBQztRQUE3REQsTUFBTSxHQUFOQSxNQUFNLEFBdkJuQjtBQXdCTyxNQUFNRSxRQUFRLEdBQW1DLElBQU0sSUFBSUMsZUFBZSxFQUFFO0FBQUM7UUFBdkVELFFBQVEsR0FBUkEsUUFBUSxBQXhCckI7QUF5Qk8sTUFBTUUsTUFBTSxHQUFpQyxJQUFNLElBQUlDLGFBQWEsRUFBRTtBQUFDO1FBQWpFRCxNQUFNLEdBQU5BLE1BQU0sQUF6Qm5CO0FBMEJPLE1BQU1FLEtBQUssR0FBb0MsSUFBTSxJQUFJQyxnQkFBZ0IsRUFBRTtB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
