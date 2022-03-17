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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSAnLi9BYnN0cmFjdEJ1aWxkZXJzJztcbmltcG9ydCB7IGhhc2gsIG1hcEJ1aWxkQXJnLCBtYXBCdWlsZEFyZ3MgfSBmcm9tICcuL0J1aWxkZXIudXRpbHMnO1xuaW1wb3J0IHsgaW1hZ2UgfSBmcm9tICcuL0VsZW1lbnRCdWlsZGVyJztcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gJ0BwYXBlci9tb2RlbHMnO1xuaW1wb3J0IHR5cGUgeyBCdWlsZEFyZywgQnVpbGRBcmdzLCBDcmVhdGVCdWlsZGVyLCBTZXFFbGVtZW50LCBTZXFOZXh0RWxlbWVudENvbnZlcnRlciB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSB7QnVpbGRlci5ib2R5Lm5vZGUuaW1nKCl9XG4gKi9cbmV4cG9ydCAqIGZyb20gJy4vQm9keU5vZGVzQnVpbGRlcic7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gJy4vQm9keU5vZGVzQnVpbGRlcic7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGU6IENyZWF0ZUJ1aWxkZXI8Qm9keUJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlCdWlsZGVyKCk7XG5leHBvcnQgY29uc3QgdHJ1c3RCb3g6IENyZWF0ZUJ1aWxkZXI8VHJ1c3RCb3hCdWlsZGVyPiA9ICgpID0+IG5ldyBUcnVzdEJveEJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBvcGVuZXI6IENyZWF0ZUJ1aWxkZXI8T3BlbmVyQnVpbGRlcj4gPSAoKSA9PiBuZXcgT3BlbmVyQnVpbGRlcigpO1xuZXhwb3J0IGNvbnN0IHN0YWdlOiBDcmVhdGVCdWlsZGVyPEJvZHlTdGFnZUJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlIZWFkZXJCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgc291cmNlOiBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VCdWlsZGVyLCBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4+ID0gKFxuICAgIG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSxcbikgPT4gbmV3IEFydGljbGVTb3VyY2VCdWlsZGVyKC4uLm5vZGVzKTtcbmV4cG9ydCBjb25zdCBzb3VyY2VzOiBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VzQnVpbGRlcj4gPSAoKSA9PiBuZXcgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyKCk7XG5cbmV4cG9ydCBjb25zdCBzZXEgPSB7XG4gICAgc3RhZ2U6ICgoKSA9PiBuZXcgQm9keVN0YWdlU2VxQnVpbGRlcigpKSBhcyBDcmVhdGVCdWlsZGVyPEJvZHlTdGFnZVNlcUJ1aWxkZXI+LFxuICAgIHNvdXJjZTogKCgpID0+IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpKSBhcyBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VTZXFCdWlsZGVyPixcbn0gYXMgY29uc3Q7XG5cbmNsYXNzIEJvZHlCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHk+IHtcbiAgICAjc3RhZ2VzOiBCb2R5U3RhZ2VbXSA9IFtdO1xuICAgICN0cnVzdEJveD86IFRydXN0Qm94ID0gdW5kZWZpbmVkO1xuICAgICNkaXNjbGFpbWVyPzogUmljaFRleHQuTm9kZVtdID0gdW5kZWZpbmVkO1xuICAgICNhcnRpY2xlU291cmNlcz86IEFydGljbGVTb3VyY2VzID0gdW5kZWZpbmVkO1xuXG4gICAgc3RhZ2VzKC4uLnN0YWdlczogQnVpbGRBcmdzPEJvZHlTdGFnZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc3RhZ2VzID0gc3RhZ2VzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRydXN0Qm94KHRydXN0Qm94PzogQnVpbGRBcmc8VHJ1c3RCb3g+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3RydXN0Qm94ID0gbWFwQnVpbGRBcmcodHJ1c3RCb3gpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkaXNjbGFpbWVyKGRpc2NsYWltZXI/OiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jZGlzY2xhaW1lciA9IGRpc2NsYWltZXI/Lm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFydGljbGVTb3VyY2VzKGFydGljbGVTb3VyY2VzPzogQnVpbGRBcmc8QXJ0aWNsZVNvdXJjZXM+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2FydGljbGVTb3VyY2VzID0gbWFwQnVpbGRBcmcoYXJ0aWNsZVNvdXJjZXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBCb2R5IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YWdlczogdGhpcy4jc3RhZ2VzLFxuICAgICAgICAgICAgdHJ1c3RCb3g6IHRoaXMuI3RydXN0Qm94LFxuICAgICAgICAgICAgZGlzY2xhaW1lcjogdGhpcy4jZGlzY2xhaW1lcixcbiAgICAgICAgICAgIGFydGljbGVTb3VyY2VzOiB0aGlzLiNhcnRpY2xlU291cmNlcyxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIFRydXN0Qm94QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxUcnVzdEJveD4ge1xuICAgICNub2RlczogUmljaFRleHQuTm9kZVtdID0gW107XG4gICAgI2hpZGRlbjogUmljaFRleHQuTm9kZVtdID0gW107XG5cbiAgICBub2Rlcyhub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGlkZGVuKGhpZGRlbjogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hpZGRlbiA9IGhpZGRlbi5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBUcnVzdEJveCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2RlczogdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICBoaWRkZW46IHRoaXMuI2hpZGRlbixcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIE9wZW5lckJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8T3BlbmVyPiB7XG4gICAgI2VsZW1lbnQ6IE9wZW5lclsnZWxlbWVudCddID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbJ2VsZW1lbnQnXT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudCA9IG1hcEJ1aWxkQXJnKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBPcGVuZXIge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudDogdGhpcy4jZWxlbWVudCxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIEJvZHlTdGFnZVNlcUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdFNlcUJ1aWxkZXI8Qm9keVN0YWdlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcbiAgICAjaGVhZGVyPzogU2VxRWxlbWVudDxCb2R5SGVhZGVyPiA9IHVuZGVmaW5lZDtcbiAgICAjY29tcGFuaW9uczogU2VxRWxlbWVudDxTdGFnZS5Db21wYW5pb25JdGVtW10+ID0gW107XG4gICAgI2NvbW1lcmNpYWxzRW5kT2ZTdGFnZTogU2VxRWxlbWVudDxSaWNoVGV4dC5Ob2RlW10+ID0gW107XG5cbiAgICBub2Rlcyhub2RlczogU2VxRWxlbWVudDxCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcihoZWFkZXI/OiBTZXFFbGVtZW50PEJ1aWxkQXJnPEJvZHlIZWFkZXI+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoZWFkZXIgPSBtYXBCdWlsZEFyZ3MoaGVhZGVyID8/IFtdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tcGFuaW9ucyhjb21wYW5pb25zOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jY29tcGFuaW9ucyA9IGNvbXBhbmlvbnMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZShjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKCdib2R5U3RhZ2UnLCB0aGlzLiNub2RlcywgdGhpcy4jY29tcGFuaW9ucywgdGhpcy4jY29tbWVyY2lhbHNFbmRPZlN0YWdlLCB0aGlzLiNoZWFkZXIpLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheSh0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjc2VxQnVpbGRlcjogQm9keVN0YWdlU2VxQnVpbGRlciA9IG5ldyBCb2R5U3RhZ2VTZXFCdWlsZGVyKCk7XG5cbiAgICBub2Rlcyhub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcihoZWFkZXI/OiBCdWlsZEFyZzxCb2R5SGVhZGVyPik6IHRoaXMge1xuICAgICAgICBpZiAoaGVhZGVyKSB7XG4gICAgICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmhlYWRlcihbaGVhZGVyXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tcGFuaW9ucyhjb21wYW5pb25zOiBCdWlsZEFyZ3M8U3RhZ2UuQ29tcGFuaW9uSXRlbT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5jb21wYW5pb25zKFtjb21wYW5pb25zXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZShjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbJ3ZhcmlhbnQnXSA9ICdmdWxsJztcbiAgICAjb3BlbmVyPzogT3BlbmVyID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyaWFudCh2YXJpYW50OiBCb2R5SGVhZGVyWyd2YXJpYW50J10pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKCdhcnRpY2xlLXNvdXJjZScsIHRoaXMuI25vZGVzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIEFydGljbGVTb3VyY2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2U+IHtcbiAgICAjc2VxQnVpbGRlcjogQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIgPSBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLm5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ub2RlcyguLi5ub2Rlcyk7XG4gICAgfVxuXG4gICAgbm9kZXMoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLm5vZGVzKFtub2Rlc10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NlcUJ1aWxkZXIuYnVpbGQoKTtcbiAgICB9XG59XG5cbmNsYXNzIEFydGljbGVTb3VyY2VzQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxBcnRpY2xlU291cmNlcz4ge1xuICAgICNub2RlczogQXJ0aWNsZVNvdXJjZVtdID0gW107XG4gICAgI2hpZGRlbjogQXJ0aWNsZVNvdXJjZVtdID0gW107XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPEFydGljbGVTb3VyY2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGlkZGVuKC4uLmhpZGRlbjogQnVpbGRBcmdzPEFydGljbGVTb3VyY2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hpZGRlbiA9IGhpZGRlbi5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBBcnRpY2xlU291cmNlcyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2RlczogdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICBoaWRkZW46IHRoaXMuI2hpZGRlbixcbiAgICAgICAgfTtcbiAgICB9XG59Il0sIm5hbWVzIjpbIm5vZGUiLCJjcmVhdGUiLCJCb2R5QnVpbGRlciIsInRydXN0Qm94IiwiVHJ1c3RCb3hCdWlsZGVyIiwib3BlbmVyIiwiT3BlbmVyQnVpbGRlciIsInN0YWdlIiwiQm9keVN0YWdlQnVpbGRlciIsImhlYWRlciIsIkJvZHlIZWFkZXJCdWlsZGVyIiwic291cmNlIiwibm9kZXMiLCJBcnRpY2xlU291cmNlQnVpbGRlciIsInNvdXJjZXMiLCJBcnRpY2xlU291cmNlc0J1aWxkZXIiLCJzZXEiLCJCb2R5U3RhZ2VTZXFCdWlsZGVyIiwiQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIiLCJBYnN0cmFjdEJ1aWxkZXIiLCJzdGFnZXMiLCJtYXAiLCJtYXBCdWlsZEFyZyIsImRpc2NsYWltZXIiLCJhcnRpY2xlU291cmNlcyIsImJ1aWxkIiwidW5kZWZpbmVkIiwiaGlkZGVuIiwiZWxlbWVudCIsImltYWdlIiwiQWJzdHJhY3RTZXFCdWlsZGVyIiwibWFwQnVpbGRBcmdzIiwiY29tcGFuaW9ucyIsImNvbW1lcmNpYWxzRW5kT2ZTdGFnZSIsImJ1aWxkTGlzdEl0ZW0iLCJzZXFOZXh0RWxlbWVudCIsImlkIiwiaGFzaCIsImFycmF5IiwibWF5YmUiLCJzZXFCdWlsZGVyIiwidmFyaWFudCIsImNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiQUFBQSxZQUFBOzs7RUFBQTs7Ozs7NEpBQUE7O0FBQW9ELElBQUEsaUJBQW9CLGdDQUFBO0FBQ3hCLElBQUEsYUFBaUIsNkJBQUE7QUFDM0MsSUFBQSxlQUFrQiw4QkFBQTtBQW1CNUJBLElBQUFBLEtBQUksbUVBQUE7QUFKaEI7O0dBRUcsQ0FDSCxZQUFBLEtBQW1DOzs7MkNBQW5DLEtBQW1DOzs7O21CQUFuQyxLQUFtQzs7TUFwQm5DO0VBb0JtQyxBQXBCbkM7UUFxQllBLElBQUksR0FBSkEsS0FBSSxBQXJCaEI7QUF1Qk8sTUFBTUMsTUFBTSxHQUErQixJQUFNLElBQUlDLFdBQVcsRUFBRTtBQUFDO1FBQTdERCxNQUFNLEdBQU5BLE1BQU0sQUF2Qm5CO0FBd0JPLE1BQU1FLFFBQVEsR0FBbUMsSUFBTSxJQUFJQyxlQUFlLEVBQUU7QUFBQztRQUF2RUQsUUFBUSxHQUFSQSxRQUFRLEFBeEJyQjtBQXlCTyxNQUFNRSxNQUFNLEdBQWlDLElBQU0sSUFBSUMsYUFBYSxFQUFFO0FBQUM7UUFBakVELE1BQU0sR0FBTkEsTUFBTSxBQXpCbkI7QUEwQk8sTUFBTUUsS0FBSyxHQUFvQyxJQUFNLElBQUlDLGdCQUFnQixFQUFFO0FBQUM7UUFBdEVELEtBQUssR0FBTEEsS0FBSyxBQTFCbEI7QUEyQk8sTUFBTUUsTUFB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
