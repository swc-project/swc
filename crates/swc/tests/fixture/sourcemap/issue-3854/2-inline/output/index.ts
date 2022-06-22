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
    create: ()=>create,
    header: ()=>header,
    node: ()=>_bodyNodesBuilder,
    opener: ()=>opener,
    seq: ()=>seq,
    source: ()=>source,
    sources: ()=>sources,
    stage: ()=>stage,
    trustBox: ()=>trustBox
});
function _exportStar(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) Object.defineProperty(to, k, {
            get: function() {
                return from[k];
            },
            enumerable: true
        });
    });
    return from;
}
const _classPrivateFieldGetMjs = require("@swc/helpers/lib/_class_private_field_get.js").default;
const _classPrivateFieldInitMjs = require("@swc/helpers/lib/_class_private_field_init.js").default;
const _classPrivateFieldSetMjs = require("@swc/helpers/lib/_class_private_field_set.js").default;
const _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _abstractBuilders = require("./AbstractBuilders");
const _builderUtils = require("./Builder.utils");
const _elementBuilder = require("./ElementBuilder");
const _bodyNodesBuilder = _interopRequireWildcardMjs(_exportStar(require("./BodyNodesBuilder"), exports));
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
        _classPrivateFieldSetMjs(this, _stages, stages.map(_builderUtils.mapBuildArg));
        return this;
    }
    trustBox(trustBox) {
        _classPrivateFieldSetMjs(this, _trustBox, (0, _builderUtils.mapBuildArg)(trustBox));
        return this;
    }
    disclaimer(disclaimer) {
        _classPrivateFieldSetMjs(this, _disclaimer, disclaimer?.map(_builderUtils.mapBuildArg));
        return this;
    }
    articleSources(articleSources) {
        _classPrivateFieldSetMjs(this, _articleSources, (0, _builderUtils.mapBuildArg)(articleSources));
        return this;
    }
    build() {
        return {
            stages: _classPrivateFieldGetMjs(this, _stages),
            trustBox: _classPrivateFieldGetMjs(this, _trustBox),
            disclaimer: _classPrivateFieldGetMjs(this, _disclaimer),
            articleSources: _classPrivateFieldGetMjs(this, _articleSources)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInitMjs(this, _stages, {
            writable: true,
            value: []
        });
        _classPrivateFieldInitMjs(this, _trustBox, {
            writable: true,
            value: undefined
        });
        _classPrivateFieldInitMjs(this, _disclaimer, {
            writable: true,
            value: undefined
        });
        _classPrivateFieldInitMjs(this, _articleSources, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes = /*#__PURE__*/ new WeakMap(), _hidden = /*#__PURE__*/ new WeakMap();
class TrustBoxBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _classPrivateFieldSetMjs(this, _nodes, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(hidden) {
        _classPrivateFieldSetMjs(this, _hidden, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _classPrivateFieldGetMjs(this, _nodes),
            hidden: _classPrivateFieldGetMjs(this, _hidden)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInitMjs(this, _nodes, {
            writable: true,
            value: []
        });
        _classPrivateFieldInitMjs(this, _hidden, {
            writable: true,
            value: []
        });
    }
}
var _element = /*#__PURE__*/ new WeakMap();
class OpenerBuilder extends _abstractBuilders.AbstractBuilder {
    element(element) {
        _classPrivateFieldSetMjs(this, _element, (0, _builderUtils.mapBuildArg)(element));
        return this;
    }
    build() {
        return {
            element: _classPrivateFieldGetMjs(this, _element)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInitMjs(this, _element, {
            writable: true,
            value: (0, _elementBuilder.image)().build()
        });
    }
}
var _nodes1 = /*#__PURE__*/ new WeakMap(), _header = /*#__PURE__*/ new WeakMap(), _companions = /*#__PURE__*/ new WeakMap(), _commercialsEndOfStage = /*#__PURE__*/ new WeakMap();
class BodyStageSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _classPrivateFieldSetMjs(this, _nodes1, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    header(header) {
        _classPrivateFieldSetMjs(this, _header, (0, _builderUtils.mapBuildArgs)(header ?? []));
        return this;
    }
    companions(companions) {
        _classPrivateFieldSetMjs(this, _companions, companions.map(_builderUtils.mapBuildArgs));
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _classPrivateFieldSetMjs(this, _commercialsEndOfStage, commercialsEndOfStage.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        return {
            id: (0, _builderUtils.hash)("bodyStage", _classPrivateFieldGetMjs(this, _nodes1), _classPrivateFieldGetMjs(this, _companions), _classPrivateFieldGetMjs(this, _commercialsEndOfStage), _classPrivateFieldGetMjs(this, _header)),
            nodes: seqNextElement.array(_classPrivateFieldGetMjs(this, _nodes1)),
            header: seqNextElement.maybe(_classPrivateFieldGetMjs(this, _header)),
            companions: seqNextElement.array(_classPrivateFieldGetMjs(this, _companions)),
            commercialsEndOfStage: seqNextElement.array(_classPrivateFieldGetMjs(this, _commercialsEndOfStage))
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInitMjs(this, _nodes1, {
            writable: true,
            value: []
        });
        _classPrivateFieldInitMjs(this, _header, {
            writable: true,
            value: undefined
        });
        _classPrivateFieldInitMjs(this, _companions, {
            writable: true,
            value: []
        });
        _classPrivateFieldInitMjs(this, _commercialsEndOfStage, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder = /*#__PURE__*/ new WeakMap();
class BodyStageBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _classPrivateFieldGetMjs(this, _seqBuilder).nodes([
            nodes
        ]);
        return this;
    }
    header(header) {
        if (header) {
            _classPrivateFieldGetMjs(this, _seqBuilder).header([
                header
            ]);
        }
        return this;
    }
    companions(companions) {
        _classPrivateFieldGetMjs(this, _seqBuilder).companions([
            companions
        ]);
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _classPrivateFieldGetMjs(this, _seqBuilder).commercialsEndOfStage([
            commercialsEndOfStage
        ]);
        return this;
    }
    build() {
        return _classPrivateFieldGetMjs(this, _seqBuilder).build();
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInitMjs(this, _seqBuilder, {
            writable: true,
            value: new BodyStageSeqBuilder()
        });
    }
}
var _variant = /*#__PURE__*/ new WeakMap(), _opener = /*#__PURE__*/ new WeakMap();
class BodyHeaderBuilder extends _abstractBuilders.AbstractBuilder {
    variant(variant) {
        _classPrivateFieldSetMjs(this, _variant, variant);
        return this;
    }
    opener(opener) {
        _classPrivateFieldSetMjs(this, _opener, (0, _builderUtils.mapBuildArg)(opener));
        return this;
    }
    build() {
        return {
            variant: _classPrivateFieldGetMjs(this, _variant),
            opener: _classPrivateFieldGetMjs(this, _opener)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInitMjs(this, _variant, {
            writable: true,
            value: "full"
        });
        _classPrivateFieldInitMjs(this, _opener, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes2 = /*#__PURE__*/ new WeakMap();
class ArticleSourceSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _classPrivateFieldSetMjs(this, _nodes2, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        const id = (0, _builderUtils.hash)("article-source", _classPrivateFieldGetMjs(this, _nodes2));
        return {
            id,
            nodes: seqNextElement.array(_classPrivateFieldGetMjs(this, _nodes2))
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInitMjs(this, _nodes2, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder1 = /*#__PURE__*/ new WeakMap();
class ArticleSourceBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _classPrivateFieldGetMjs(this, _seqBuilder1).nodes([
            nodes
        ]);
        return this;
    }
    build() {
        return _classPrivateFieldGetMjs(this, _seqBuilder1).build();
    }
    constructor(...nodes){
        super();
        _classPrivateFieldInitMjs(this, _seqBuilder1, {
            writable: true,
            value: new ArticleSourceSeqBuilder()
        });
        this.nodes(...nodes);
    }
}
var _nodes3 = /*#__PURE__*/ new WeakMap(), _hidden1 = /*#__PURE__*/ new WeakMap();
class ArticleSourcesBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _classPrivateFieldSetMjs(this, _nodes3, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(...hidden) {
        _classPrivateFieldSetMjs(this, _hidden1, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _classPrivateFieldGetMjs(this, _nodes3),
            hidden: _classPrivateFieldGetMjs(this, _hidden1)
        };
    }
    constructor(...args){
        super(...args);
        _classPrivateFieldInitMjs(this, _nodes3, {
            writable: true,
            value: []
        });
        _classPrivateFieldInitMjs(this, _hidden1, {
            writable: true,
            value: []
        });
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RCdWlsZGVyc1wiO1xuaW1wb3J0IHsgaGFzaCwgbWFwQnVpbGRBcmcsIG1hcEJ1aWxkQXJncyB9IGZyb20gXCIuL0J1aWxkZXIudXRpbHNcIjtcbmltcG9ydCB7IGltYWdlIH0gZnJvbSBcIi4vRWxlbWVudEJ1aWxkZXJcIjtcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gXCJAcGFwZXIvbW9kZWxzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgQnVpbGRBcmcsXG4gICAgQnVpbGRBcmdzLFxuICAgIENyZWF0ZUJ1aWxkZXIsXG4gICAgU2VxRWxlbWVudCxcbiAgICBTZXFOZXh0RWxlbWVudENvbnZlcnRlcixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0J1aWxkZXIuYm9keS5ub2RlLmltZygpfVxuICovXG5leHBvcnQgKiBmcm9tIFwiLi9Cb2R5Tm9kZXNCdWlsZGVyXCI7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gXCIuL0JvZHlOb2Rlc0J1aWxkZXJcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZTogQ3JlYXRlQnVpbGRlcjxCb2R5QnVpbGRlcj4gPSAoKSA9PiBuZXcgQm9keUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCB0cnVzdEJveDogQ3JlYXRlQnVpbGRlcjxUcnVzdEJveEJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgVHJ1c3RCb3hCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgb3BlbmVyOiBDcmVhdGVCdWlsZGVyPE9wZW5lckJ1aWxkZXI+ID0gKCkgPT4gbmV3IE9wZW5lckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzdGFnZTogQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgQm9keUhlYWRlckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzb3VyY2U6IENyZWF0ZUJ1aWxkZXI8XG4gICAgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIsXG4gICAgQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+XG4+ID0gKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSkgPT5cbiAgICBuZXcgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIoLi4ubm9kZXMpO1xuZXhwb3J0IGNvbnN0IHNvdXJjZXM6IENyZWF0ZUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZXNCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEFydGljbGVTb3VyY2VzQnVpbGRlcigpO1xuXG5leHBvcnQgY29uc3Qgc2VxID0ge1xuICAgIHN0YWdlOiAoKCkgPT5cbiAgICAgICAgbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VTZXFCdWlsZGVyPixcbiAgICBzb3VyY2U6ICgoKSA9PlxuICAgICAgICBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxBcnRpY2xlU291cmNlU2VxQnVpbGRlcj4sXG59IGFzIGNvbnN0O1xuXG5jbGFzcyBCb2R5QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5PiB7XG4gICAgI3N0YWdlczogQm9keVN0YWdlW10gPSBbXTtcbiAgICAjdHJ1c3RCb3g/OiBUcnVzdEJveCA9IHVuZGVmaW5lZDtcbiAgICAjZGlzY2xhaW1lcj86IFJpY2hUZXh0Lk5vZGVbXSA9IHVuZGVmaW5lZDtcbiAgICAjYXJ0aWNsZVNvdXJjZXM/OiBBcnRpY2xlU291cmNlcyA9IHVuZGVmaW5lZDtcblxuICAgIHN0YWdlcyguLi5zdGFnZXM6IEJ1aWxkQXJnczxCb2R5U3RhZ2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3N0YWdlcyA9IHN0YWdlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0cnVzdEJveCh0cnVzdEJveD86IEJ1aWxkQXJnPFRydXN0Qm94Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiN0cnVzdEJveCA9IG1hcEJ1aWxkQXJnKHRydXN0Qm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGlzY2xhaW1lcihkaXNjbGFpbWVyPzogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2Rpc2NsYWltZXIgPSBkaXNjbGFpbWVyPy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcnRpY2xlU291cmNlcyhhcnRpY2xlU291cmNlcz86IEJ1aWxkQXJnPEFydGljbGVTb3VyY2VzPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNhcnRpY2xlU291cmNlcyA9IG1hcEJ1aWxkQXJnKGFydGljbGVTb3VyY2VzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZXM6IHRoaXMuI3N0YWdlcyxcbiAgICAgICAgICAgIHRydXN0Qm94OiB0aGlzLiN0cnVzdEJveCxcbiAgICAgICAgICAgIGRpc2NsYWltZXI6IHRoaXMuI2Rpc2NsYWltZXIsXG4gICAgICAgICAgICBhcnRpY2xlU291cmNlczogdGhpcy4jYXJ0aWNsZVNvdXJjZXMsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBUcnVzdEJveEJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8VHJ1c3RCb3g+IHtcbiAgICAjbm9kZXM6IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuICAgICNoaWRkZW46IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuXG4gICAgbm9kZXMobm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNub2RlcyA9IG5vZGVzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhpZGRlbihoaWRkZW46IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoaWRkZW4gPSBoaWRkZW4ubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogVHJ1c3RCb3gge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZXM6IHRoaXMuI25vZGVzLFxuICAgICAgICAgICAgaGlkZGVuOiB0aGlzLiNoaWRkZW4sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBPcGVuZXJCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPE9wZW5lcj4ge1xuICAgICNlbGVtZW50OiBPcGVuZXJbXCJlbGVtZW50XCJdID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbXCJlbGVtZW50XCJdPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNlbGVtZW50ID0gbWFwQnVpbGRBcmcoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IE9wZW5lciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiNlbGVtZW50LFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjbm9kZXM6IFNlcUVsZW1lbnQ8UmljaFRleHQuTm9kZVtdPiA9IFtdO1xuICAgICNoZWFkZXI/OiBTZXFFbGVtZW50PEJvZHlIZWFkZXI+ID0gdW5kZWZpbmVkO1xuICAgICNjb21wYW5pb25zOiBTZXFFbGVtZW50PFN0YWdlLkNvbXBhbmlvbkl0ZW1bXT4gPSBbXTtcbiAgICAjY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IFNlcUVsZW1lbnQ8QnVpbGRBcmc8Qm9keUhlYWRlcj4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hlYWRlciA9IG1hcEJ1aWxkQXJncyhoZWFkZXIgPz8gW10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFN0YWdlLkNvbXBhbmlvbkl0ZW0+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21wYW5pb25zID0gY29tcGFuaW9ucy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+PlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKFxuICAgICAgICAgICAgICAgIFwiYm9keVN0YWdlXCIsXG4gICAgICAgICAgICAgICAgdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tcGFuaW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jaGVhZGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheShcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2VcbiAgICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5U3RhZ2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHlTdGFnZT4ge1xuICAgICNzZXFCdWlsZGVyOiBCb2R5U3RhZ2VTZXFCdWlsZGVyID0gbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKTtcblxuICAgIG5vZGVzKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5ub2Rlcyhbbm9kZXNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IEJ1aWxkQXJnPEJvZHlIZWFkZXI+KTogdGhpcyB7XG4gICAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIuaGVhZGVyKFtoZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbXBhbmlvbnMoW2NvbXBhbmlvbnNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbXCJ2YXJpYW50XCJdID0gXCJmdWxsXCI7XG4gICAgI29wZW5lcj86IE9wZW5lciA9IHVuZGVmaW5lZDtcblxuICAgIHZhcmlhbnQodmFyaWFudDogQm9keUhlYWRlcltcInZhcmlhbnRcIl0pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKFwiYXJ0aWNsZS1zb3VyY2VcIiwgdGhpcy4jbm9kZXMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBub2Rlczogc2VxTmV4dEVsZW1lbnQuYXJyYXkodGhpcy4jbm9kZXMpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8QXJ0aWNsZVNvdXJjZT4ge1xuICAgICNzZXFCdWlsZGVyOiBBcnRpY2xlU291cmNlU2VxQnVpbGRlciA9IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpO1xuXG4gICAgY29uc3RydWN0b3IoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGVzKC4uLm5vZGVzKTtcbiAgICB9XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VxQnVpbGRlci5idWlsZCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2VzPiB7XG4gICAgI25vZGVzOiBBcnRpY2xlU291cmNlW10gPSBbXTtcbiAgICAjaGlkZGVuOiBBcnRpY2xlU291cmNlW10gPSBbXTtcblxuICAgIG5vZGVzKC4uLm5vZGVzOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRkZW4oLi4uaGlkZGVuOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jaGlkZGVuID0gaGlkZGVuLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2VzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLiNub2RlcyxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy4jaGlkZGVuLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGUiLCJoZWFkZXIiLCJub2RlIiwib3BlbmVyIiwic2VxIiwic291cmNlIiwic291cmNlcyIsInN0YWdlIiwidHJ1c3RCb3giLCJCb2R5QnVpbGRlciIsIlRydXN0Qm94QnVpbGRlciIsIk9wZW5lckJ1aWxkZXIiLCJCb2R5U3RhZ2VCdWlsZGVyIiwiQm9keUhlYWRlckJ1aWxkZXIiLCJub2RlcyIsIkFydGljbGVTb3VyY2VCdWlsZGVyIiwiQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIiwiQm9keVN0YWdlU2VxQnVpbGRlciIsIkFydGljbGVTb3VyY2VTZXFCdWlsZGVyIiwiQWJzdHJhY3RCdWlsZGVyIiwic3RhZ2VzIiwibWFwIiwibWFwQnVpbGRBcmciLCJkaXNjbGFpbWVyIiwiYXJ0aWNsZVNvdXJjZXMiLCJidWlsZCIsInVuZGVmaW5lZCIsImhpZGRlbiIsImVsZW1lbnQiLCJpbWFnZSIsIkFic3RyYWN0U2VxQnVpbGRlciIsIm1hcEJ1aWxkQXJncyIsImNvbXBhbmlvbnMiLCJjb21tZXJjaWFsc0VuZE9mU3RhZ2UiLCJidWlsZExpc3RJdGVtIiwic2VxTmV4dEVsZW1lbnQiLCJpZCIsImhhc2giLCJhcnJheSIsIm1heWJlIiwic2VxQnVpbGRlciIsInZhcmlhbnQiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lBNkJhQSxNQUFNLE1BQU5BLE1BQU07SUFNTkMsTUFBTSxNQUFOQSxNQUFNO0lBUlBDLElBQUksTUFBSkEsaUJBQUk7SUFLSEMsTUFBTSxNQUFOQSxNQUFNO0lBYU5DLEdBQUcsTUFBSEEsR0FBRztJQVJIQyxNQUFNLE1BQU5BLE1BQU07SUFLTkMsT0FBTyxNQUFQQSxPQUFPO0lBVFBDLEtBQUssTUFBTEEsS0FBSztJQUhMQyxRQUFRLE1BQVJBLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7O2tDQTlCK0Isb0JBQW9COzhCQUN4QixpQkFBaUI7Z0NBQzNDLGtCQUFrQjt5RUF5QmxCLG9CQUFvQjtBQUVuQyxNQUFN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
