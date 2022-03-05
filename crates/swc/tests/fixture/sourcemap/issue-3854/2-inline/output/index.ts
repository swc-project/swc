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
Object.keys(_node).forEach(function(key) {
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
var _stages = new WeakMap(), _trustBox = new WeakMap(), _disclaimer = new WeakMap(), _articleSources = new WeakMap();
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
var _nodes = new WeakMap(), _hidden = new WeakMap();
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
var _element = new WeakMap();
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
var _nodes1 = new WeakMap(), _header = new WeakMap(), _companions = new WeakMap(), _commercialsEndOfStage = new WeakMap();
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
var _seqBuilder = new WeakMap();
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
var _variant = new WeakMap(), _opener = new WeakMap();
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
var _nodes2 = new WeakMap();
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
var _seqBuilder1 = new WeakMap();
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
var _nodes3 = new WeakMap(), _hidden1 = new WeakMap();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSAnLi9BYnN0cmFjdEJ1aWxkZXJzJztcbmltcG9ydCB7IGhhc2gsIG1hcEJ1aWxkQXJnLCBtYXBCdWlsZEFyZ3MgfSBmcm9tICcuL0J1aWxkZXIudXRpbHMnO1xuaW1wb3J0IHsgaW1hZ2UgfSBmcm9tICcuL0VsZW1lbnRCdWlsZGVyJztcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gJ0BwYXBlci9tb2RlbHMnO1xuaW1wb3J0IHR5cGUgeyBCdWlsZEFyZywgQnVpbGRBcmdzLCBDcmVhdGVCdWlsZGVyLCBTZXFFbGVtZW50LCBTZXFOZXh0RWxlbWVudENvbnZlcnRlciB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSB7QnVpbGRlci5ib2R5Lm5vZGUuaW1nKCl9XG4gKi9cbmV4cG9ydCAqIGZyb20gJy4vQm9keU5vZGVzQnVpbGRlcic7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gJy4vQm9keU5vZGVzQnVpbGRlcic7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGU6IENyZWF0ZUJ1aWxkZXI8Qm9keUJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlCdWlsZGVyKCk7XG5leHBvcnQgY29uc3QgdHJ1c3RCb3g6IENyZWF0ZUJ1aWxkZXI8VHJ1c3RCb3hCdWlsZGVyPiA9ICgpID0+IG5ldyBUcnVzdEJveEJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBvcGVuZXI6IENyZWF0ZUJ1aWxkZXI8T3BlbmVyQnVpbGRlcj4gPSAoKSA9PiBuZXcgT3BlbmVyQnVpbGRlcigpO1xuZXhwb3J0IGNvbnN0IHN0YWdlOiBDcmVhdGVCdWlsZGVyPEJvZHlTdGFnZUJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlIZWFkZXJCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgc291cmNlOiBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VCdWlsZGVyLCBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4+ID0gKFxuICAgIG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSxcbikgPT4gbmV3IEFydGljbGVTb3VyY2VCdWlsZGVyKC4uLm5vZGVzKTtcbmV4cG9ydCBjb25zdCBzb3VyY2VzOiBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VzQnVpbGRlcj4gPSAoKSA9PiBuZXcgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyKCk7XG5cbmV4cG9ydCBjb25zdCBzZXEgPSB7XG4gICAgc3RhZ2U6ICgoKSA9PiBuZXcgQm9keVN0YWdlU2VxQnVpbGRlcigpKSBhcyBDcmVhdGVCdWlsZGVyPEJvZHlTdGFnZVNlcUJ1aWxkZXI+LFxuICAgIHNvdXJjZTogKCgpID0+IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpKSBhcyBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VTZXFCdWlsZGVyPixcbn0gYXMgY29uc3Q7XG5cbmNsYXNzIEJvZHlCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHk+IHtcbiAgICAjc3RhZ2VzOiBCb2R5U3RhZ2VbXSA9IFtdO1xuICAgICN0cnVzdEJveD86IFRydXN0Qm94ID0gdW5kZWZpbmVkO1xuICAgICNkaXNjbGFpbWVyPzogUmljaFRleHQuTm9kZVtdID0gdW5kZWZpbmVkO1xuICAgICNhcnRpY2xlU291cmNlcz86IEFydGljbGVTb3VyY2VzID0gdW5kZWZpbmVkO1xuXG4gICAgc3RhZ2VzKC4uLnN0YWdlczogQnVpbGRBcmdzPEJvZHlTdGFnZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc3RhZ2VzID0gc3RhZ2VzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRydXN0Qm94KHRydXN0Qm94PzogQnVpbGRBcmc8VHJ1c3RCb3g+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3RydXN0Qm94ID0gbWFwQnVpbGRBcmcodHJ1c3RCb3gpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkaXNjbGFpbWVyKGRpc2NsYWltZXI/OiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jZGlzY2xhaW1lciA9IGRpc2NsYWltZXI/Lm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFydGljbGVTb3VyY2VzKGFydGljbGVTb3VyY2VzPzogQnVpbGRBcmc8QXJ0aWNsZVNvdXJjZXM+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2FydGljbGVTb3VyY2VzID0gbWFwQnVpbGRBcmcoYXJ0aWNsZVNvdXJjZXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBCb2R5IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YWdlczogdGhpcy4jc3RhZ2VzLFxuICAgICAgICAgICAgdHJ1c3RCb3g6IHRoaXMuI3RydXN0Qm94LFxuICAgICAgICAgICAgZGlzY2xhaW1lcjogdGhpcy4jZGlzY2xhaW1lcixcbiAgICAgICAgICAgIGFydGljbGVTb3VyY2VzOiB0aGlzLiNhcnRpY2xlU291cmNlcyxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIFRydXN0Qm94QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxUcnVzdEJveD4ge1xuICAgICNub2RlczogUmljaFRleHQuTm9kZVtdID0gW107XG4gICAgI2hpZGRlbjogUmljaFRleHQuTm9kZVtdID0gW107XG5cbiAgICBub2Rlcyhub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGlkZGVuKGhpZGRlbjogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hpZGRlbiA9IGhpZGRlbi5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBUcnVzdEJveCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2RlczogdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICBoaWRkZW46IHRoaXMuI2hpZGRlbixcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIE9wZW5lckJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8T3BlbmVyPiB7XG4gICAgI2VsZW1lbnQ6IE9wZW5lclsnZWxlbWVudCddID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbJ2VsZW1lbnQnXT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudCA9IG1hcEJ1aWxkQXJnKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBPcGVuZXIge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudDogdGhpcy4jZWxlbWVudCxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIEJvZHlTdGFnZVNlcUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdFNlcUJ1aWxkZXI8Qm9keVN0YWdlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcbiAgICAjaGVhZGVyPzogU2VxRWxlbWVudDxCb2R5SGVhZGVyPiA9IHVuZGVmaW5lZDtcbiAgICAjY29tcGFuaW9uczogU2VxRWxlbWVudDxTdGFnZS5Db21wYW5pb25JdGVtW10+ID0gW107XG4gICAgI2NvbW1lcmNpYWxzRW5kT2ZTdGFnZTogU2VxRWxlbWVudDxSaWNoVGV4dC5Ob2RlW10+ID0gW107XG5cbiAgICBub2Rlcyhub2RlczogU2VxRWxlbWVudDxCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcihoZWFkZXI/OiBTZXFFbGVtZW50PEJ1aWxkQXJnPEJvZHlIZWFkZXI+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoZWFkZXIgPSBtYXBCdWlsZEFyZ3MoaGVhZGVyID8/IFtdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tcGFuaW9ucyhjb21wYW5pb25zOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jY29tcGFuaW9ucyA9IGNvbXBhbmlvbnMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZShjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKCdib2R5U3RhZ2UnLCB0aGlzLiNub2RlcywgdGhpcy4jY29tcGFuaW9ucywgdGhpcy4jY29tbWVyY2lhbHNFbmRPZlN0YWdlLCB0aGlzLiNoZWFkZXIpLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheSh0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjc2VxQnVpbGRlcjogQm9keVN0YWdlU2VxQnVpbGRlciA9IG5ldyBCb2R5U3RhZ2VTZXFCdWlsZGVyKCk7XG5cbiAgICBub2Rlcyhub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcihoZWFkZXI/OiBCdWlsZEFyZzxCb2R5SGVhZGVyPik6IHRoaXMge1xuICAgICAgICBpZiAoaGVhZGVyKSB7XG4gICAgICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmhlYWRlcihbaGVhZGVyXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tcGFuaW9ucyhjb21wYW5pb25zOiBCdWlsZEFyZ3M8U3RhZ2UuQ29tcGFuaW9uSXRlbT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5jb21wYW5pb25zKFtjb21wYW5pb25zXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZShjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbJ3ZhcmlhbnQnXSA9ICdmdWxsJztcbiAgICAjb3BlbmVyPzogT3BlbmVyID0gdW5kZWZpbmVkO1xuXG4gICAgdmFyaWFudCh2YXJpYW50OiBCb2R5SGVhZGVyWyd2YXJpYW50J10pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKCdhcnRpY2xlLXNvdXJjZScsIHRoaXMuI25vZGVzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIEFydGljbGVTb3VyY2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2U+IHtcbiAgICAjc2VxQnVpbGRlcjogQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIgPSBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLm5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ub2RlcyguLi5ub2Rlcyk7XG4gICAgfVxuXG4gICAgbm9kZXMoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLm5vZGVzKFtub2Rlc10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NlcUJ1aWxkZXIuYnVpbGQoKTtcbiAgICB9XG59XG5cbmNsYXNzIEFydGljbGVTb3VyY2VzQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxBcnRpY2xlU291cmNlcz4ge1xuICAgICNub2RlczogQXJ0aWNsZVNvdXJjZVtdID0gW107XG4gICAgI2hpZGRlbjogQXJ0aWNsZVNvdXJjZVtdID0gW107XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPEFydGljbGVTb3VyY2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGlkZGVuKC4uLmhpZGRlbjogQnVpbGRBcmdzPEFydGljbGVTb3VyY2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hpZGRlbiA9IGhpZGRlbi5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBBcnRpY2xlU291cmNlcyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2RlczogdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICBoaWRkZW46IHRoaXMuI2hpZGRlbixcbiAgICAgICAgfTtcbiAgICB9XG59Il0sIm5hbWVzIjpbIm5vZGUiLCJjcmVhdGUiLCJCb2R5QnVpbGRlciIsInRydXN0Qm94IiwiVHJ1c3RCb3hCdWlsZGVyIiwib3BlbmVyIiwiT3BlbmVyQnVpbGRlciIsInN0YWdlIiwiQm9keVN0YWdlQnVpbGRlciIsImhlYWRlciIsIkJvZHlIZWFkZXJCdWlsZGVyIiwic291cmNlIiwibm9kZXMiLCJBcnRpY2xlU291cmNlQnVpbGRlciIsInNvdXJjZXMiLCJBcnRpY2xlU291cmNlc0J1aWxkZXIiLCJzZXEiLCJCb2R5U3RhZ2VTZXFCdWlsZGVyIiwiQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIiLCJBYnN0cmFjdEJ1aWxkZXIiLCJzdGFnZXMiLCJtYXAiLCJtYXBCdWlsZEFyZyIsImRpc2NsYWltZXIiLCJhcnRpY2xlU291cmNlcyIsImJ1aWxkIiwidW5kZWZpbmVkIiwiaGlkZGVuIiwiZWxlbWVudCIsImltYWdlIiwiQWJzdHJhY3RTZXFCdWlsZGVyIiwibWFwQnVpbGRBcmdzIiwiY29tcGFuaW9ucyIsImNvbW1lcmNpYWxzRW5kT2ZTdGFnZSIsImJ1aWxkTGlzdEl0ZW0iLCJzZXFOZXh0RWxlbWVudCIsImlkIiwiaGFzaCIsImFycmF5IiwibWF5YmUiLCJzZXFCdWlsZGVyIiwidmFyaWFudCJdLCJtYXBwaW5ncyI6Ilk7OztFOzs7Ozs0Sjs7QUFBb0QsR0FBb0IsQ0FBcEIsaUJBQW9CO0FBQ3hCLEdBQWlCLENBQWpCLGFBQWlCO0FBQzNDLEdBQWtCLENBQWxCLGVBQWtCO0FBbUI1QkEsR0FBSSxDQUFKQSxLQUFJO1lBQUpBLEtBQUk7OzsyQ0FBSkEsS0FBSTs7OzttQkFBSkEsS0FBSTs7TTtFO1FBQUpBLElBQUksR0FBSkEsS0FBSSxBO0FBRVQsS0FBSyxDQUFDQyxNQUFNLE9BQXFDLEdBQUcsQ0FBQ0MsV0FBVzs7UUFBMURELE1BQU0sR0FBTkEsTUFBTSxBO0FBQ1osS0FBSyxDQUFDRSxRQUFRLE9BQXlDLEdBQUcsQ0FBQ0MsZUFBZTs7UUFBcEVELFFBQVEsR0FBUkEsUUFBUSxBO0FBQ2QsS0FBSyxDQUFDRSxNQUFNLE9BQXVDLEdBQUcsQ0FBQ0MsYUFBYTs7UUFBOURELE1BQU0sR0FBTkEsTUFBTSxBO0FBQ1osS0FBSyxDQUFDRSxLQUFLLE9BQTBDLEdBQUcsQ0FBQ0MsZ0JBQWdCOztRQUFuRUQsS0FBSyxHQUFMQSxLQUFLLEE7QUFDWCxLQUFLLENBQUNFLE1BQU0sT0FBMkMsR0FBRyxDQUFDQyxpQkFBaUI7O1FBQXRFRCxNQUFNLEdBQU5BLE1BQU0sQTtBQUNaLEtBQUssQ0FBQ0UsTUFBTSxJQUNmQyxLQUErQixHQUFHLENBQUMsQ0FBQyxHQUNu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
