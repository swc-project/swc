"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    create: function() {
        return create;
    },
    header: function() {
        return header;
    },
    node: function() {
        return _bodyNodesBuilder;
    },
    opener: function() {
        return opener;
    },
    seq: function() {
        return seq;
    },
    source: function() {
        return source;
    },
    sources: function() {
        return sources;
    },
    stage: function() {
        return stage;
    },
    trustBox: function() {
        return trustBox;
    }
});
var _classPrivateFieldGetMjs = require("@swc/helpers/lib/_class_private_field_get.js");
var _classPrivateFieldInitMjs = require("@swc/helpers/lib/_class_private_field_init.js");
var _classPrivateFieldSetMjs = require("@swc/helpers/lib/_class_private_field_set.js");
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js");
var _abstractBuilders = require("./AbstractBuilders");
var _builderUtils = require("./Builder.utils");
var _elementBuilder = require("./ElementBuilder");
var _bodyNodesBuilder = (0, _interopRequireWildcardMjs.default)(_re_export(exports, require("./BodyNodesBuilder")));
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
        (0, _classPrivateFieldSetMjs.default)(this, _stages, stages.map(_builderUtils.mapBuildArg));
        return this;
    }
    trustBox(trustBox) {
        (0, _classPrivateFieldSetMjs.default)(this, _trustBox, (0, _builderUtils.mapBuildArg)(trustBox));
        return this;
    }
    disclaimer(disclaimer) {
        (0, _classPrivateFieldSetMjs.default)(this, _disclaimer, disclaimer?.map(_builderUtils.mapBuildArg));
        return this;
    }
    articleSources(articleSources) {
        (0, _classPrivateFieldSetMjs.default)(this, _articleSources, (0, _builderUtils.mapBuildArg)(articleSources));
        return this;
    }
    build() {
        return {
            stages: (0, _classPrivateFieldGetMjs.default)(this, _stages),
            trustBox: (0, _classPrivateFieldGetMjs.default)(this, _trustBox),
            disclaimer: (0, _classPrivateFieldGetMjs.default)(this, _disclaimer),
            articleSources: (0, _classPrivateFieldGetMjs.default)(this, _articleSources)
        };
    }
    constructor(...args){
        super(...args);
        (0, _classPrivateFieldInitMjs.default)(this, _stages, {
            writable: true,
            value: []
        });
        (0, _classPrivateFieldInitMjs.default)(this, _trustBox, {
            writable: true,
            value: undefined
        });
        (0, _classPrivateFieldInitMjs.default)(this, _disclaimer, {
            writable: true,
            value: undefined
        });
        (0, _classPrivateFieldInitMjs.default)(this, _articleSources, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes = /*#__PURE__*/ new WeakMap(), _hidden = /*#__PURE__*/ new WeakMap();
class TrustBoxBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        (0, _classPrivateFieldSetMjs.default)(this, _nodes, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(hidden) {
        (0, _classPrivateFieldSetMjs.default)(this, _hidden, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: (0, _classPrivateFieldGetMjs.default)(this, _nodes),
            hidden: (0, _classPrivateFieldGetMjs.default)(this, _hidden)
        };
    }
    constructor(...args){
        super(...args);
        (0, _classPrivateFieldInitMjs.default)(this, _nodes, {
            writable: true,
            value: []
        });
        (0, _classPrivateFieldInitMjs.default)(this, _hidden, {
            writable: true,
            value: []
        });
    }
}
var _element = /*#__PURE__*/ new WeakMap();
class OpenerBuilder extends _abstractBuilders.AbstractBuilder {
    element(element) {
        (0, _classPrivateFieldSetMjs.default)(this, _element, (0, _builderUtils.mapBuildArg)(element));
        return this;
    }
    build() {
        return {
            element: (0, _classPrivateFieldGetMjs.default)(this, _element)
        };
    }
    constructor(...args){
        super(...args);
        (0, _classPrivateFieldInitMjs.default)(this, _element, {
            writable: true,
            value: (0, _elementBuilder.image)().build()
        });
    }
}
var _nodes1 = /*#__PURE__*/ new WeakMap(), _header = /*#__PURE__*/ new WeakMap(), _companions = /*#__PURE__*/ new WeakMap(), _commercialsEndOfStage = /*#__PURE__*/ new WeakMap();
class BodyStageSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        (0, _classPrivateFieldSetMjs.default)(this, _nodes1, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    header(header) {
        (0, _classPrivateFieldSetMjs.default)(this, _header, (0, _builderUtils.mapBuildArgs)(header ?? []));
        return this;
    }
    companions(companions) {
        (0, _classPrivateFieldSetMjs.default)(this, _companions, companions.map(_builderUtils.mapBuildArgs));
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        (0, _classPrivateFieldSetMjs.default)(this, _commercialsEndOfStage, commercialsEndOfStage.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        return {
            id: (0, _builderUtils.hash)("bodyStage", (0, _classPrivateFieldGetMjs.default)(this, _nodes1), (0, _classPrivateFieldGetMjs.default)(this, _companions), (0, _classPrivateFieldGetMjs.default)(this, _commercialsEndOfStage), (0, _classPrivateFieldGetMjs.default)(this, _header)),
            nodes: seqNextElement.array((0, _classPrivateFieldGetMjs.default)(this, _nodes1)),
            header: seqNextElement.maybe((0, _classPrivateFieldGetMjs.default)(this, _header)),
            companions: seqNextElement.array((0, _classPrivateFieldGetMjs.default)(this, _companions)),
            commercialsEndOfStage: seqNextElement.array((0, _classPrivateFieldGetMjs.default)(this, _commercialsEndOfStage))
        };
    }
    constructor(...args){
        super(...args);
        (0, _classPrivateFieldInitMjs.default)(this, _nodes1, {
            writable: true,
            value: []
        });
        (0, _classPrivateFieldInitMjs.default)(this, _header, {
            writable: true,
            value: undefined
        });
        (0, _classPrivateFieldInitMjs.default)(this, _companions, {
            writable: true,
            value: []
        });
        (0, _classPrivateFieldInitMjs.default)(this, _commercialsEndOfStage, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder = /*#__PURE__*/ new WeakMap();
class BodyStageBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        (0, _classPrivateFieldGetMjs.default)(this, _seqBuilder).nodes([
            nodes
        ]);
        return this;
    }
    header(header) {
        if (header) {
            (0, _classPrivateFieldGetMjs.default)(this, _seqBuilder).header([
                header
            ]);
        }
        return this;
    }
    companions(companions) {
        (0, _classPrivateFieldGetMjs.default)(this, _seqBuilder).companions([
            companions
        ]);
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        (0, _classPrivateFieldGetMjs.default)(this, _seqBuilder).commercialsEndOfStage([
            commercialsEndOfStage
        ]);
        return this;
    }
    build() {
        return (0, _classPrivateFieldGetMjs.default)(this, _seqBuilder).build();
    }
    constructor(...args){
        super(...args);
        (0, _classPrivateFieldInitMjs.default)(this, _seqBuilder, {
            writable: true,
            value: new BodyStageSeqBuilder()
        });
    }
}
var _variant = /*#__PURE__*/ new WeakMap(), _opener = /*#__PURE__*/ new WeakMap();
class BodyHeaderBuilder extends _abstractBuilders.AbstractBuilder {
    variant(variant) {
        (0, _classPrivateFieldSetMjs.default)(this, _variant, variant);
        return this;
    }
    opener(opener) {
        (0, _classPrivateFieldSetMjs.default)(this, _opener, (0, _builderUtils.mapBuildArg)(opener));
        return this;
    }
    build() {
        return {
            variant: (0, _classPrivateFieldGetMjs.default)(this, _variant),
            opener: (0, _classPrivateFieldGetMjs.default)(this, _opener)
        };
    }
    constructor(...args){
        super(...args);
        (0, _classPrivateFieldInitMjs.default)(this, _variant, {
            writable: true,
            value: "full"
        });
        (0, _classPrivateFieldInitMjs.default)(this, _opener, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes2 = /*#__PURE__*/ new WeakMap();
class ArticleSourceSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        (0, _classPrivateFieldSetMjs.default)(this, _nodes2, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        const id = (0, _builderUtils.hash)("article-source", (0, _classPrivateFieldGetMjs.default)(this, _nodes2));
        return {
            id,
            nodes: seqNextElement.array((0, _classPrivateFieldGetMjs.default)(this, _nodes2))
        };
    }
    constructor(...args){
        super(...args);
        (0, _classPrivateFieldInitMjs.default)(this, _nodes2, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder1 = /*#__PURE__*/ new WeakMap();
class ArticleSourceBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        (0, _classPrivateFieldGetMjs.default)(this, _seqBuilder1).nodes([
            nodes
        ]);
        return this;
    }
    build() {
        return (0, _classPrivateFieldGetMjs.default)(this, _seqBuilder1).build();
    }
    constructor(...nodes){
        super();
        (0, _classPrivateFieldInitMjs.default)(this, _seqBuilder1, {
            writable: true,
            value: new ArticleSourceSeqBuilder()
        });
        this.nodes(...nodes);
    }
}
var _nodes3 = /*#__PURE__*/ new WeakMap(), _hidden1 = /*#__PURE__*/ new WeakMap();
class ArticleSourcesBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        (0, _classPrivateFieldSetMjs.default)(this, _nodes3, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(...hidden) {
        (0, _classPrivateFieldSetMjs.default)(this, _hidden1, hidden.map(_builderUtils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: (0, _classPrivateFieldGetMjs.default)(this, _nodes3),
            hidden: (0, _classPrivateFieldGetMjs.default)(this, _hidden1)
        };
    }
    constructor(...args){
        super(...args);
        (0, _classPrivateFieldInitMjs.default)(this, _nodes3, {
            writable: true,
            value: []
        });
        (0, _classPrivateFieldInitMjs.default)(this, _hidden1, {
            writable: true,
            value: []
        });
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RCdWlsZGVyc1wiO1xuaW1wb3J0IHsgaGFzaCwgbWFwQnVpbGRBcmcsIG1hcEJ1aWxkQXJncyB9IGZyb20gXCIuL0J1aWxkZXIudXRpbHNcIjtcbmltcG9ydCB7IGltYWdlIH0gZnJvbSBcIi4vRWxlbWVudEJ1aWxkZXJcIjtcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gXCJAcGFwZXIvbW9kZWxzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgQnVpbGRBcmcsXG4gICAgQnVpbGRBcmdzLFxuICAgIENyZWF0ZUJ1aWxkZXIsXG4gICAgU2VxRWxlbWVudCxcbiAgICBTZXFOZXh0RWxlbWVudENvbnZlcnRlcixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0J1aWxkZXIuYm9keS5ub2RlLmltZygpfVxuICovXG5leHBvcnQgKiBmcm9tIFwiLi9Cb2R5Tm9kZXNCdWlsZGVyXCI7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gXCIuL0JvZHlOb2Rlc0J1aWxkZXJcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZTogQ3JlYXRlQnVpbGRlcjxCb2R5QnVpbGRlcj4gPSAoKSA9PiBuZXcgQm9keUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCB0cnVzdEJveDogQ3JlYXRlQnVpbGRlcjxUcnVzdEJveEJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgVHJ1c3RCb3hCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgb3BlbmVyOiBDcmVhdGVCdWlsZGVyPE9wZW5lckJ1aWxkZXI+ID0gKCkgPT4gbmV3IE9wZW5lckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzdGFnZTogQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgQm9keUhlYWRlckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzb3VyY2U6IENyZWF0ZUJ1aWxkZXI8XG4gICAgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIsXG4gICAgQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+XG4+ID0gKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSkgPT5cbiAgICBuZXcgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIoLi4ubm9kZXMpO1xuZXhwb3J0IGNvbnN0IHNvdXJjZXM6IENyZWF0ZUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZXNCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEFydGljbGVTb3VyY2VzQnVpbGRlcigpO1xuXG5leHBvcnQgY29uc3Qgc2VxID0ge1xuICAgIHN0YWdlOiAoKCkgPT5cbiAgICAgICAgbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VTZXFCdWlsZGVyPixcbiAgICBzb3VyY2U6ICgoKSA9PlxuICAgICAgICBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxBcnRpY2xlU291cmNlU2VxQnVpbGRlcj4sXG59IGFzIGNvbnN0O1xuXG5jbGFzcyBCb2R5QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5PiB7XG4gICAgI3N0YWdlczogQm9keVN0YWdlW10gPSBbXTtcbiAgICAjdHJ1c3RCb3g/OiBUcnVzdEJveCA9IHVuZGVmaW5lZDtcbiAgICAjZGlzY2xhaW1lcj86IFJpY2hUZXh0Lk5vZGVbXSA9IHVuZGVmaW5lZDtcbiAgICAjYXJ0aWNsZVNvdXJjZXM/OiBBcnRpY2xlU291cmNlcyA9IHVuZGVmaW5lZDtcblxuICAgIHN0YWdlcyguLi5zdGFnZXM6IEJ1aWxkQXJnczxCb2R5U3RhZ2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3N0YWdlcyA9IHN0YWdlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0cnVzdEJveCh0cnVzdEJveD86IEJ1aWxkQXJnPFRydXN0Qm94Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiN0cnVzdEJveCA9IG1hcEJ1aWxkQXJnKHRydXN0Qm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGlzY2xhaW1lcihkaXNjbGFpbWVyPzogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2Rpc2NsYWltZXIgPSBkaXNjbGFpbWVyPy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcnRpY2xlU291cmNlcyhhcnRpY2xlU291cmNlcz86IEJ1aWxkQXJnPEFydGljbGVTb3VyY2VzPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNhcnRpY2xlU291cmNlcyA9IG1hcEJ1aWxkQXJnKGFydGljbGVTb3VyY2VzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZXM6IHRoaXMuI3N0YWdlcyxcbiAgICAgICAgICAgIHRydXN0Qm94OiB0aGlzLiN0cnVzdEJveCxcbiAgICAgICAgICAgIGRpc2NsYWltZXI6IHRoaXMuI2Rpc2NsYWltZXIsXG4gICAgICAgICAgICBhcnRpY2xlU291cmNlczogdGhpcy4jYXJ0aWNsZVNvdXJjZXMsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBUcnVzdEJveEJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8VHJ1c3RCb3g+IHtcbiAgICAjbm9kZXM6IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuICAgICNoaWRkZW46IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuXG4gICAgbm9kZXMobm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNub2RlcyA9IG5vZGVzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhpZGRlbihoaWRkZW46IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoaWRkZW4gPSBoaWRkZW4ubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogVHJ1c3RCb3gge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZXM6IHRoaXMuI25vZGVzLFxuICAgICAgICAgICAgaGlkZGVuOiB0aGlzLiNoaWRkZW4sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBPcGVuZXJCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPE9wZW5lcj4ge1xuICAgICNlbGVtZW50OiBPcGVuZXJbXCJlbGVtZW50XCJdID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbXCJlbGVtZW50XCJdPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNlbGVtZW50ID0gbWFwQnVpbGRBcmcoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IE9wZW5lciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiNlbGVtZW50LFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjbm9kZXM6IFNlcUVsZW1lbnQ8UmljaFRleHQuTm9kZVtdPiA9IFtdO1xuICAgICNoZWFkZXI/OiBTZXFFbGVtZW50PEJvZHlIZWFkZXI+ID0gdW5kZWZpbmVkO1xuICAgICNjb21wYW5pb25zOiBTZXFFbGVtZW50PFN0YWdlLkNvbXBhbmlvbkl0ZW1bXT4gPSBbXTtcbiAgICAjY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IFNlcUVsZW1lbnQ8QnVpbGRBcmc8Qm9keUhlYWRlcj4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hlYWRlciA9IG1hcEJ1aWxkQXJncyhoZWFkZXIgPz8gW10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFN0YWdlLkNvbXBhbmlvbkl0ZW0+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21wYW5pb25zID0gY29tcGFuaW9ucy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+PlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKFxuICAgICAgICAgICAgICAgIFwiYm9keVN0YWdlXCIsXG4gICAgICAgICAgICAgICAgdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tcGFuaW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jaGVhZGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheShcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2VcbiAgICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5U3RhZ2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHlTdGFnZT4ge1xuICAgICNzZXFCdWlsZGVyOiBCb2R5U3RhZ2VTZXFCdWlsZGVyID0gbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKTtcblxuICAgIG5vZGVzKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5ub2Rlcyhbbm9kZXNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IEJ1aWxkQXJnPEJvZHlIZWFkZXI+KTogdGhpcyB7XG4gICAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIuaGVhZGVyKFtoZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbXBhbmlvbnMoW2NvbXBhbmlvbnNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbXCJ2YXJpYW50XCJdID0gXCJmdWxsXCI7XG4gICAgI29wZW5lcj86IE9wZW5lciA9IHVuZGVmaW5lZDtcblxuICAgIHZhcmlhbnQodmFyaWFudDogQm9keUhlYWRlcltcInZhcmlhbnRcIl0pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKFwiYXJ0aWNsZS1zb3VyY2VcIiwgdGhpcy4jbm9kZXMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBub2Rlczogc2VxTmV4dEVsZW1lbnQuYXJyYXkodGhpcy4jbm9kZXMpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8QXJ0aWNsZVNvdXJjZT4ge1xuICAgICNzZXFCdWlsZGVyOiBBcnRpY2xlU291cmNlU2VxQnVpbGRlciA9IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpO1xuXG4gICAgY29uc3RydWN0b3IoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGVzKC4uLm5vZGVzKTtcbiAgICB9XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VxQnVpbGRlci5idWlsZCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2VzPiB7XG4gICAgI25vZGVzOiBBcnRpY2xlU291cmNlW10gPSBbXTtcbiAgICAjaGlkZGVuOiBBcnRpY2xlU291cmNlW10gPSBbXTtcblxuICAgIG5vZGVzKC4uLm5vZGVzOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRkZW4oLi4uaGlkZGVuOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jaGlkZGVuID0gaGlkZGVuLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2VzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLiNub2RlcyxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy4jaGlkZGVuLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGUiLCJoZWFkZXIiLCJub2RlIiwib3BlbmVyIiwic2VxIiwic291cmNlIiwic291cmNlcyIsInN0YWdlIiwidHJ1c3RCb3giLCJCb2R5QnVpbGRlciIsIlRydXN0Qm94QnVpbGRlciIsIk9wZW5lckJ1aWxkZXIiLCJCb2R5U3RhZ2VCdWlsZGVyIiwiQm9keUhlYWRlckJ1aWxkZXIiLCJub2RlcyIsIkFydGljbGVTb3VyY2VCdWlsZGVyIiwiQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIiwiQm9keVN0YWdlU2VxQnVpbGRlciIsIkFydGljbGVTb3VyY2VTZXFCdWlsZGVyIiwiQWJzdHJhY3RCdWlsZGVyIiwic3RhZ2VzIiwibWFwIiwibWFwQnVpbGRBcmciLCJkaXNjbGFpbWVyIiwiYXJ0aWNsZVNvdXJjZXMiLCJidWlsZCIsInVuZGVmaW5lZCIsImhpZGRlbiIsImVsZW1lbnQiLCJpbWFnZSIsIkFic3RyYWN0U2VxQnVpbGRlciIsIm1hcEJ1aWxkQXJncyIsImNvbXBhbmlvbnMiLCJjb21tZXJjaWFsc0VuZE9mU3RhZ2UiLCJidWlsZExpc3RJdGVtIiwic2VxTmV4dEVsZW1lbnQiLCJpZCIsImhhc2giLCJhcnJheSIsIm1heWJlIiwic2VxQnVpbGRlciIsInZhcmlhbnQiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lBNkJhQSxNQUFNO2VBQU5BLE1BQU07O0lBTU5DLE1BQU07ZUFBTkEsTUFBTTs7SUFSUEMsSUFBSTtlQUFKQSxpQkFBSTs7SUFLSEMsTUFBTTtlQUFOQSxNQUFNOztJQWFOQyxHQUFHO2VBQUhBLEdBQUc7O0lBUkhDLE1BQU07ZUFBTkEsTUFBTTs7SUFLTkMsT0FBTztlQUFQQSxPQUFPOztJQVRQQyxLQUFLO2VBQUxBLEtBQUs7O0lBSExDLFFBQVE7ZUFBUkEsUUFBUTs7Ozs7OztnQ0E5QitCLG9CQUFvQjs0QkFDeEIsaUJBQWlCOzhCQUMzQyxrQkFBa0I7NEZBeUJsQixvQkFBb0I7QUFFbkMsTUFBTVIs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
