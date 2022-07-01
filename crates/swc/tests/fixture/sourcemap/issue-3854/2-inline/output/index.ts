"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    node: ()=>_bodyNodesBuilder,
    create: ()=>create,
    trustBox: ()=>trustBox,
    opener: ()=>opener,
    stage: ()=>stage,
    header: ()=>header,
    source: ()=>source,
    sources: ()=>sources,
    seq: ()=>seq
});
const _classPrivateFieldGet = require("@swc/helpers/lib/_class_private_field_get.js").default;
const _classPrivateFieldInit = require("@swc/helpers/lib/_class_private_field_init.js").default;
const _classPrivateFieldSet = require("@swc/helpers/lib/_class_private_field_set.js").default;
const _exportStar = require("@swc/helpers/lib/_export_star.js").default;
const _interopRequireWildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _abstractBuilders = require("./AbstractBuilders");
const _builderUtils = require("./Builder.utils");
const _elementBuilder = require("./ElementBuilder");
const _bodyNodesBuilder = _interopRequireWildcard(_exportStar(require("./BodyNodesBuilder"), exports));
const create = ()=>new BodyBuilder();
const trustBox = ()=>new TrustBoxBuilder();
const opener = ()=>new OpenerBuilder();
const stage = ()=>new BodyStageBuilder();
const header = ()=>new BodyHeaderBuilder();
const source = (nodes = [])=>new ArticleSourceBuilder(...nodes);
const sources = ()=>new ArticleSourcesBuilder();
const seq = {
    stage: ()=>new BodyStageSeqBuilder(),
    source: ()=>new ArticleSourceSeqBuilder()
};
var _stages = /*#__PURE__*/ new WeakMap(), _trustBox = /*#__PURE__*/ new WeakMap(), _disclaimer = /*#__PURE__*/ new WeakMap(), _articleSources = /*#__PURE__*/ new WeakMap();
class BodyBuilder extends _abstractBuilders.AbstractBuilder {
    stages(...stages) {
        _classPrivateFieldSet(this, _stages, stages.map(_builderUtils.mapBuildArg));
        return this;
    }
    trustBox(trustBox) {
        _classPrivateFieldSet(this, _trustBox, (0, _builderUtils.mapBuildArg)(trustBox));
        return this;
    }
    disclaimer(disclaimer) {
        _classPrivateFieldSet(this, _disclaimer, disclaimer?.map(_builderUtils.mapBuildArg));
        return this;
    }
    articleSources(articleSources) {
        _classPrivateFieldSet(this, _articleSources, (0, _builderUtils.mapBuildArg)(articleSources));
        return this;
    }
    build() {
        return {
            stages: _classPrivateFieldGet(this, _stages),
            trustBox: _classPrivateFieldGet(this, _trustBox),
            disclaimer: _classPrivateFieldGet(this, _disclaimer),
            articleSources: _classPrivateFieldGet(this, _articleSources)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _stages, {
            writable: true,
            value: []
        });
        _classPrivateFieldInit(this, _trustBox, {
            writable: true,
            value: undefined
        });
        _classPrivateFieldInit(this, _disclaimer, {
            writable: true,
            value: undefined
        });
        _classPrivateFieldInit(this, _articleSources, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes = /*#__PURE__*/ new WeakMap(), _hidden = /*#__PURE__*/ new WeakMap();
class TrustBoxBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _classPrivateFieldSet(this, _nodes, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(hidden) {
        _classPrivateFieldSet(this, _hidden, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _classPrivateFieldGet(this, _nodes),
            hidden: _classPrivateFieldGet(this, _hidden)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _nodes, {
            writable: true,
            value: []
        });
        _classPrivateFieldInit(this, _hidden, {
            writable: true,
            value: []
        });
    }
}
var _element = /*#__PURE__*/ new WeakMap();
class OpenerBuilder extends _abstractBuilders.AbstractBuilder {
    element(element) {
        _classPrivateFieldSet(this, _element, (0, _builderUtils.mapBuildArg)(element));
        return this;
    }
    build() {
        return {
            element: _classPrivateFieldGet(this, _element)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _element, {
            writable: true,
            value: (0, _elementBuilder.image)().build()
        });
    }
}
var _nodes1 = /*#__PURE__*/ new WeakMap(), _header = /*#__PURE__*/ new WeakMap(), _companions = /*#__PURE__*/ new WeakMap(), _commercialsEndOfStage = /*#__PURE__*/ new WeakMap();
class BodyStageSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _classPrivateFieldSet(this, _nodes1, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    header(header) {
        _classPrivateFieldSet(this, _header, (0, _builderUtils.mapBuildArgs)(header ?? []));
        return this;
    }
    companions(companions) {
        _classPrivateFieldSet(this, _companions, companions.map(_builderUtils.mapBuildArgs));
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _classPrivateFieldSet(this, _commercialsEndOfStage, commercialsEndOfStage.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        return {
            id: (0, _builderUtils.hash)("bodyStage", _classPrivateFieldGet(this, _nodes1), _classPrivateFieldGet(this, _companions), _classPrivateFieldGet(this, _commercialsEndOfStage), _classPrivateFieldGet(this, _header)),
            nodes: seqNextElement.array(_classPrivateFieldGet(this, _nodes1)),
            header: seqNextElement.maybe(_classPrivateFieldGet(this, _header)),
            companions: seqNextElement.array(_classPrivateFieldGet(this, _companions)),
            commercialsEndOfStage: seqNextElement.array(_classPrivateFieldGet(this, _commercialsEndOfStage))
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _nodes1, {
            writable: true,
            value: []
        });
        _classPrivateFieldInit(this, _header, {
            writable: true,
            value: undefined
        });
        _classPrivateFieldInit(this, _companions, {
            writable: true,
            value: []
        });
        _classPrivateFieldInit(this, _commercialsEndOfStage, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder = /*#__PURE__*/ new WeakMap();
class BodyStageBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _classPrivateFieldGet(this, _seqBuilder).nodes([
            nodes
        ]);
        return this;
    }
    header(header) {
        if (header) {
            _classPrivateFieldGet(this, _seqBuilder).header([
                header
            ]);
        }
        return this;
    }
    companions(companions) {
        _classPrivateFieldGet(this, _seqBuilder).companions([
            companions
        ]);
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _classPrivateFieldGet(this, _seqBuilder).commercialsEndOfStage([
            commercialsEndOfStage
        ]);
        return this;
    }
    build() {
        return _classPrivateFieldGet(this, _seqBuilder).build();
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _seqBuilder, {
            writable: true,
            value: new BodyStageSeqBuilder()
        });
    }
}
var _variant = /*#__PURE__*/ new WeakMap(), _opener = /*#__PURE__*/ new WeakMap();
class BodyHeaderBuilder extends _abstractBuilders.AbstractBuilder {
    variant(variant) {
        _classPrivateFieldSet(this, _variant, variant);
        return this;
    }
    opener(opener) {
        _classPrivateFieldSet(this, _opener, (0, _builderUtils.mapBuildArg)(opener));
        return this;
    }
    build() {
        return {
            variant: _classPrivateFieldGet(this, _variant),
            opener: _classPrivateFieldGet(this, _opener)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _variant, {
            writable: true,
            value: "full"
        });
        _classPrivateFieldInit(this, _opener, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes2 = /*#__PURE__*/ new WeakMap();
class ArticleSourceSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _classPrivateFieldSet(this, _nodes2, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        const id = (0, _builderUtils.hash)("article-source", _classPrivateFieldGet(this, _nodes2));
        return {
            id,
            nodes: seqNextElement.array(_classPrivateFieldGet(this, _nodes2))
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _nodes2, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder1 = /*#__PURE__*/ new WeakMap();
class ArticleSourceBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _classPrivateFieldGet(this, _seqBuilder1).nodes([
            nodes
        ]);
        return this;
    }
    build() {
        return _classPrivateFieldGet(this, _seqBuilder1).build();
    }
    constructor(...nodes){
        super();
        _classPrivateFieldInit(this, _seqBuilder1, {
            writable: true,
            value: new ArticleSourceSeqBuilder()
        });
        this.nodes(...nodes);
    }
}
var _nodes3 = /*#__PURE__*/ new WeakMap(), _hidden1 = /*#__PURE__*/ new WeakMap();
class ArticleSourcesBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _classPrivateFieldSet(this, _nodes3, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(...hidden) {
        _classPrivateFieldSet(this, _hidden1, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _classPrivateFieldGet(this, _nodes3),
            hidden: _classPrivateFieldGet(this, _hidden1)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInit(this, _nodes3, {
            writable: true,
            value: []
        });
        _classPrivateFieldInit(this, _hidden1, {
            writable: true,
            value: []
        });
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RCdWlsZGVyc1wiO1xuaW1wb3J0IHsgaGFzaCwgbWFwQnVpbGRBcmcsIG1hcEJ1aWxkQXJncyB9IGZyb20gXCIuL0J1aWxkZXIudXRpbHNcIjtcbmltcG9ydCB7IGltYWdlIH0gZnJvbSBcIi4vRWxlbWVudEJ1aWxkZXJcIjtcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gXCJAcGFwZXIvbW9kZWxzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgQnVpbGRBcmcsXG4gICAgQnVpbGRBcmdzLFxuICAgIENyZWF0ZUJ1aWxkZXIsXG4gICAgU2VxRWxlbWVudCxcbiAgICBTZXFOZXh0RWxlbWVudENvbnZlcnRlcixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0J1aWxkZXIuYm9keS5ub2RlLmltZygpfVxuICovXG5leHBvcnQgKiBmcm9tIFwiLi9Cb2R5Tm9kZXNCdWlsZGVyXCI7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gXCIuL0JvZHlOb2Rlc0J1aWxkZXJcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZTogQ3JlYXRlQnVpbGRlcjxCb2R5QnVpbGRlcj4gPSAoKSA9PiBuZXcgQm9keUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCB0cnVzdEJveDogQ3JlYXRlQnVpbGRlcjxUcnVzdEJveEJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgVHJ1c3RCb3hCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgb3BlbmVyOiBDcmVhdGVCdWlsZGVyPE9wZW5lckJ1aWxkZXI+ID0gKCkgPT4gbmV3IE9wZW5lckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzdGFnZTogQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgQm9keUhlYWRlckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzb3VyY2U6IENyZWF0ZUJ1aWxkZXI8XG4gICAgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIsXG4gICAgQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+XG4+ID0gKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSkgPT5cbiAgICBuZXcgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIoLi4ubm9kZXMpO1xuZXhwb3J0IGNvbnN0IHNvdXJjZXM6IENyZWF0ZUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZXNCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEFydGljbGVTb3VyY2VzQnVpbGRlcigpO1xuXG5leHBvcnQgY29uc3Qgc2VxID0ge1xuICAgIHN0YWdlOiAoKCkgPT5cbiAgICAgICAgbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VTZXFCdWlsZGVyPixcbiAgICBzb3VyY2U6ICgoKSA9PlxuICAgICAgICBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxBcnRpY2xlU291cmNlU2VxQnVpbGRlcj4sXG59IGFzIGNvbnN0O1xuXG5jbGFzcyBCb2R5QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5PiB7XG4gICAgI3N0YWdlczogQm9keVN0YWdlW10gPSBbXTtcbiAgICAjdHJ1c3RCb3g/OiBUcnVzdEJveCA9IHVuZGVmaW5lZDtcbiAgICAjZGlzY2xhaW1lcj86IFJpY2hUZXh0Lk5vZGVbXSA9IHVuZGVmaW5lZDtcbiAgICAjYXJ0aWNsZVNvdXJjZXM/OiBBcnRpY2xlU291cmNlcyA9IHVuZGVmaW5lZDtcblxuICAgIHN0YWdlcyguLi5zdGFnZXM6IEJ1aWxkQXJnczxCb2R5U3RhZ2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3N0YWdlcyA9IHN0YWdlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0cnVzdEJveCh0cnVzdEJveD86IEJ1aWxkQXJnPFRydXN0Qm94Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiN0cnVzdEJveCA9IG1hcEJ1aWxkQXJnKHRydXN0Qm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGlzY2xhaW1lcihkaXNjbGFpbWVyPzogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2Rpc2NsYWltZXIgPSBkaXNjbGFpbWVyPy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcnRpY2xlU291cmNlcyhhcnRpY2xlU291cmNlcz86IEJ1aWxkQXJnPEFydGljbGVTb3VyY2VzPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNhcnRpY2xlU291cmNlcyA9IG1hcEJ1aWxkQXJnKGFydGljbGVTb3VyY2VzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZXM6IHRoaXMuI3N0YWdlcyxcbiAgICAgICAgICAgIHRydXN0Qm94OiB0aGlzLiN0cnVzdEJveCxcbiAgICAgICAgICAgIGRpc2NsYWltZXI6IHRoaXMuI2Rpc2NsYWltZXIsXG4gICAgICAgICAgICBhcnRpY2xlU291cmNlczogdGhpcy4jYXJ0aWNsZVNvdXJjZXMsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBUcnVzdEJveEJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8VHJ1c3RCb3g+IHtcbiAgICAjbm9kZXM6IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuICAgICNoaWRkZW46IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuXG4gICAgbm9kZXMobm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNub2RlcyA9IG5vZGVzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhpZGRlbihoaWRkZW46IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoaWRkZW4gPSBoaWRkZW4ubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogVHJ1c3RCb3gge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZXM6IHRoaXMuI25vZGVzLFxuICAgICAgICAgICAgaGlkZGVuOiB0aGlzLiNoaWRkZW4sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBPcGVuZXJCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPE9wZW5lcj4ge1xuICAgICNlbGVtZW50OiBPcGVuZXJbXCJlbGVtZW50XCJdID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbXCJlbGVtZW50XCJdPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNlbGVtZW50ID0gbWFwQnVpbGRBcmcoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IE9wZW5lciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiNlbGVtZW50LFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjbm9kZXM6IFNlcUVsZW1lbnQ8UmljaFRleHQuTm9kZVtdPiA9IFtdO1xuICAgICNoZWFkZXI/OiBTZXFFbGVtZW50PEJvZHlIZWFkZXI+ID0gdW5kZWZpbmVkO1xuICAgICNjb21wYW5pb25zOiBTZXFFbGVtZW50PFN0YWdlLkNvbXBhbmlvbkl0ZW1bXT4gPSBbXTtcbiAgICAjY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IFNlcUVsZW1lbnQ8QnVpbGRBcmc8Qm9keUhlYWRlcj4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hlYWRlciA9IG1hcEJ1aWxkQXJncyhoZWFkZXIgPz8gW10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFN0YWdlLkNvbXBhbmlvbkl0ZW0+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21wYW5pb25zID0gY29tcGFuaW9ucy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+PlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKFxuICAgICAgICAgICAgICAgIFwiYm9keVN0YWdlXCIsXG4gICAgICAgICAgICAgICAgdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tcGFuaW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jaGVhZGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheShcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2VcbiAgICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5U3RhZ2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHlTdGFnZT4ge1xuICAgICNzZXFCdWlsZGVyOiBCb2R5U3RhZ2VTZXFCdWlsZGVyID0gbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKTtcblxuICAgIG5vZGVzKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5ub2Rlcyhbbm9kZXNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IEJ1aWxkQXJnPEJvZHlIZWFkZXI+KTogdGhpcyB7XG4gICAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIuaGVhZGVyKFtoZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbXBhbmlvbnMoW2NvbXBhbmlvbnNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbXCJ2YXJpYW50XCJdID0gXCJmdWxsXCI7XG4gICAgI29wZW5lcj86IE9wZW5lciA9IHVuZGVmaW5lZDtcblxuICAgIHZhcmlhbnQodmFyaWFudDogQm9keUhlYWRlcltcInZhcmlhbnRcIl0pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKFwiYXJ0aWNsZS1zb3VyY2VcIiwgdGhpcy4jbm9kZXMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBub2Rlczogc2VxTmV4dEVsZW1lbnQuYXJyYXkodGhpcy4jbm9kZXMpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8QXJ0aWNsZVNvdXJjZT4ge1xuICAgICNzZXFCdWlsZGVyOiBBcnRpY2xlU291cmNlU2VxQnVpbGRlciA9IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpO1xuXG4gICAgY29uc3RydWN0b3IoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGVzKC4uLm5vZGVzKTtcbiAgICB9XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VxQnVpbGRlci5idWlsZCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2VzPiB7XG4gICAgI25vZGVzOiBBcnRpY2xlU291cmNlW10gPSBbXTtcbiAgICAjaGlkZGVuOiBBcnRpY2xlU291cmNlW10gPSBbXTtcblxuICAgIG5vZGVzKC4uLm5vZGVzOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRkZW4oLi4uaGlkZGVuOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jaGlkZGVuID0gaGlkZGVuLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2VzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLiNub2RlcyxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy4jaGlkZGVuLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJub2RlIiwiY3JlYXRlIiwidHJ1c3RCb3giLCJvcGVuZXIiLCJzdGFnZSIsImhlYWRlciIsInNvdXJjZSIsInNvdXJjZXMiLCJzZXEiLCJCb2R5QnVpbGRlciIsIlRydXN0Qm94QnVpbGRlciIsIk9wZW5lckJ1aWxkZXIiLCJCb2R5U3RhZ2VCdWlsZGVyIiwiQm9keUhlYWRlckJ1aWxkZXIiLCJub2RlcyIsIkFydGljbGVTb3VyY2VCdWlsZGVyIiwiQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIiwiQm9keVN0YWdlU2VxQnVpbGRlciIsIkFydGljbGVTb3VyY2VTZXFCdWlsZGVyIiwiQWJzdHJhY3RCdWlsZGVyIiwic3RhZ2VzIiwibWFwIiwibWFwQnVpbGRBcmciLCJkaXNjbGFpbWVyIiwiYXJ0aWNsZVNvdXJjZXMiLCJidWlsZCIsInVuZGVmaW5lZCIsImhpZGRlbiIsImVsZW1lbnQiLCJpbWFnZSIsIkFic3RyYWN0U2VxQnVpbGRlciIsIm1hcEJ1aWxkQXJncyIsImNvbXBhbmlvbnMiLCJjb21tZXJjaWFsc0VuZE9mU3RhZ2UiLCJidWlsZExpc3RJdGVtIiwic2VxTmV4dEVsZW1lbnQiLCJpZCIsImhhc2giLCJhcnJheSIsIm1heWJlIiwic2VxQnVpbGRlciIsInZhcmlhbnQiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lBMkJZQSxJQUFJO0lBRUhDLE1BQU0sTUFBTkEsTUFBTTtJQUNOQyxRQUFRLE1BQVJBLFFBQVE7SUFFUkMsTUFBTSxNQUFOQSxNQUFNO0lBQ05DLEtBQUssTUFBTEEsS0FBSztJQUVMQyxNQUFNLE1BQU5BLE1BQU07SUFFTkMsTUFBTSxNQUFOQSxNQUFNO0lBS05DLE9BQU8sTUFBUEEsT0FBTztJQUdQQyxHQUFHLE1BQUhBLEdBQUc7Ozs7Ozs7a0NBN0NvQyxvQkFBb0I7OEJBQ3hCLGlCQUFpQjtnQ0FDM0Msa0JBQWtCO3NFQXdCMUIsb0JBQW9CO0FBRzNCLE1BQU1QLE1BQU0sR0FBK0IsSUFBTSxJQUFJ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
