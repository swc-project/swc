"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    create: function() {
        return create;
    },
    header: function() {
        return header;
    },
    node: function() {
        return _BodyNodesBuilder;
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
const _class_private_field_get = require("@swc/helpers/_/_class_private_field_get");
const _class_private_field_init = require("@swc/helpers/_/_class_private_field_init");
const _class_private_field_set = require("@swc/helpers/_/_class_private_field_set");
const _export_star = require("@swc/helpers/_/_export_star");
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _AbstractBuilders = require("./AbstractBuilders");
const _Builderutils = require("./Builder.utils");
const _ElementBuilder = require("./ElementBuilder");
const _BodyNodesBuilder = /*#__PURE__*/ _interop_require_wildcard._(_export_star._(require("./BodyNodesBuilder"), exports));
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
class BodyBuilder extends _AbstractBuilders.AbstractBuilder {
    stages(...stages) {
        _class_private_field_set._(this, _stages, stages.map(_Builderutils.mapBuildArg));
        return this;
    }
    trustBox(trustBox) {
        _class_private_field_set._(this, _trustBox, (0, _Builderutils.mapBuildArg)(trustBox));
        return this;
    }
    disclaimer(disclaimer) {
        _class_private_field_set._(this, _disclaimer, disclaimer?.map(_Builderutils.mapBuildArg));
        return this;
    }
    articleSources(articleSources) {
        _class_private_field_set._(this, _articleSources, (0, _Builderutils.mapBuildArg)(articleSources));
        return this;
    }
    build() {
        return {
            stages: _class_private_field_get._(this, _stages),
            trustBox: _class_private_field_get._(this, _trustBox),
            disclaimer: _class_private_field_get._(this, _disclaimer),
            articleSources: _class_private_field_get._(this, _articleSources)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init._(this, _stages, {
            writable: true,
            value: []
        });
        _class_private_field_init._(this, _trustBox, {
            writable: true,
            value: undefined
        });
        _class_private_field_init._(this, _disclaimer, {
            writable: true,
            value: undefined
        });
        _class_private_field_init._(this, _articleSources, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes = /*#__PURE__*/ new WeakMap(), _hidden = /*#__PURE__*/ new WeakMap();
class TrustBoxBuilder extends _AbstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _class_private_field_set._(this, _nodes, nodes.map(_Builderutils.mapBuildArg));
        return this;
    }
    hidden(hidden) {
        _class_private_field_set._(this, _hidden, hidden.map(_Builderutils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _class_private_field_get._(this, _nodes),
            hidden: _class_private_field_get._(this, _hidden)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init._(this, _nodes, {
            writable: true,
            value: []
        });
        _class_private_field_init._(this, _hidden, {
            writable: true,
            value: []
        });
    }
}
var _element = /*#__PURE__*/ new WeakMap();
class OpenerBuilder extends _AbstractBuilders.AbstractBuilder {
    element(element) {
        _class_private_field_set._(this, _element, (0, _Builderutils.mapBuildArg)(element));
        return this;
    }
    build() {
        return {
            element: _class_private_field_get._(this, _element)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init._(this, _element, {
            writable: true,
            value: (0, _ElementBuilder.image)().build()
        });
    }
}
var _nodes1 = /*#__PURE__*/ new WeakMap(), _header = /*#__PURE__*/ new WeakMap(), _companions = /*#__PURE__*/ new WeakMap(), _commercialsEndOfStage = /*#__PURE__*/ new WeakMap();
class BodyStageSeqBuilder extends _AbstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _class_private_field_set._(this, _nodes1, nodes.map(_Builderutils.mapBuildArgs));
        return this;
    }
    header(header) {
        _class_private_field_set._(this, _header, (0, _Builderutils.mapBuildArgs)(header ?? []));
        return this;
    }
    companions(companions) {
        _class_private_field_set._(this, _companions, companions.map(_Builderutils.mapBuildArgs));
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _class_private_field_set._(this, _commercialsEndOfStage, commercialsEndOfStage.map(_Builderutils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        return {
            id: (0, _Builderutils.hash)("bodyStage", _class_private_field_get._(this, _nodes1), _class_private_field_get._(this, _companions), _class_private_field_get._(this, _commercialsEndOfStage), _class_private_field_get._(this, _header)),
            nodes: seqNextElement.array(_class_private_field_get._(this, _nodes1)),
            header: seqNextElement.maybe(_class_private_field_get._(this, _header)),
            companions: seqNextElement.array(_class_private_field_get._(this, _companions)),
            commercialsEndOfStage: seqNextElement.array(_class_private_field_get._(this, _commercialsEndOfStage))
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init._(this, _nodes1, {
            writable: true,
            value: []
        });
        _class_private_field_init._(this, _header, {
            writable: true,
            value: undefined
        });
        _class_private_field_init._(this, _companions, {
            writable: true,
            value: []
        });
        _class_private_field_init._(this, _commercialsEndOfStage, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder = /*#__PURE__*/ new WeakMap();
class BodyStageBuilder extends _AbstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _class_private_field_get._(this, _seqBuilder).nodes([
            nodes
        ]);
        return this;
    }
    header(header) {
        if (header) {
            _class_private_field_get._(this, _seqBuilder).header([
                header
            ]);
        }
        return this;
    }
    companions(companions) {
        _class_private_field_get._(this, _seqBuilder).companions([
            companions
        ]);
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _class_private_field_get._(this, _seqBuilder).commercialsEndOfStage([
            commercialsEndOfStage
        ]);
        return this;
    }
    build() {
        return _class_private_field_get._(this, _seqBuilder).build();
    }
    constructor(...args){
        super(...args);
        _class_private_field_init._(this, _seqBuilder, {
            writable: true,
            value: new BodyStageSeqBuilder()
        });
    }
}
var _variant = /*#__PURE__*/ new WeakMap(), _opener = /*#__PURE__*/ new WeakMap();
class BodyHeaderBuilder extends _AbstractBuilders.AbstractBuilder {
    variant(variant) {
        _class_private_field_set._(this, _variant, variant);
        return this;
    }
    opener(opener) {
        _class_private_field_set._(this, _opener, (0, _Builderutils.mapBuildArg)(opener));
        return this;
    }
    build() {
        return {
            variant: _class_private_field_get._(this, _variant),
            opener: _class_private_field_get._(this, _opener)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init._(this, _variant, {
            writable: true,
            value: "full"
        });
        _class_private_field_init._(this, _opener, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes2 = /*#__PURE__*/ new WeakMap();
class ArticleSourceSeqBuilder extends _AbstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _class_private_field_set._(this, _nodes2, nodes.map(_Builderutils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        const id = (0, _Builderutils.hash)("article-source", _class_private_field_get._(this, _nodes2));
        return {
            id,
            nodes: seqNextElement.array(_class_private_field_get._(this, _nodes2))
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init._(this, _nodes2, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder1 = /*#__PURE__*/ new WeakMap();
class ArticleSourceBuilder extends _AbstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _class_private_field_get._(this, _seqBuilder1).nodes([
            nodes
        ]);
        return this;
    }
    build() {
        return _class_private_field_get._(this, _seqBuilder1).build();
    }
    constructor(...nodes){
        super();
        _class_private_field_init._(this, _seqBuilder1, {
            writable: true,
            value: new ArticleSourceSeqBuilder()
        });
        this.nodes(...nodes);
    }
}
var _nodes3 = /*#__PURE__*/ new WeakMap(), _hidden1 = /*#__PURE__*/ new WeakMap();
class ArticleSourcesBuilder extends _AbstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _class_private_field_set._(this, _nodes3, nodes.map(_Builderutils.mapBuildArg));
        return this;
    }
    hidden(...hidden) {
        _class_private_field_set._(this, _hidden1, hidden.map(_Builderutils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _class_private_field_get._(this, _nodes3),
            hidden: _class_private_field_get._(this, _hidden1)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init._(this, _nodes3, {
            writable: true,
            value: []
        });
        _class_private_field_init._(this, _hidden1, {
            writable: true,
            value: []
        });
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFic3RyYWN0QnVpbGRlciwgQWJzdHJhY3RTZXFCdWlsZGVyIH0gZnJvbSBcIi4vQWJzdHJhY3RCdWlsZGVyc1wiO1xuaW1wb3J0IHsgaGFzaCwgbWFwQnVpbGRBcmcsIG1hcEJ1aWxkQXJncyB9IGZyb20gXCIuL0J1aWxkZXIudXRpbHNcIjtcbmltcG9ydCB7IGltYWdlIH0gZnJvbSBcIi4vRWxlbWVudEJ1aWxkZXJcIjtcblxuaW1wb3J0IHR5cGUge1xuICAgIEJvZHksXG4gICAgQm9keVN0YWdlLFxuICAgIFRydXN0Qm94LFxuICAgIFJpY2hUZXh0LFxuICAgIE9wZW5lcixcbiAgICBCb2R5SGVhZGVyLFxuICAgIFN0YWdlLFxuICAgIEFydGljbGVTb3VyY2UsXG4gICAgQXJ0aWNsZVNvdXJjZXMsXG59IGZyb20gXCJAcGFwZXIvbW9kZWxzXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgQnVpbGRBcmcsXG4gICAgQnVpbGRBcmdzLFxuICAgIENyZWF0ZUJ1aWxkZXIsXG4gICAgU2VxRWxlbWVudCxcbiAgICBTZXFOZXh0RWxlbWVudENvbnZlcnRlcixcbn0gZnJvbSBcIi4vdHlwZXNcIjtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0J1aWxkZXIuYm9keS5ub2RlLmltZygpfVxuICovXG5leHBvcnQgKiBmcm9tIFwiLi9Cb2R5Tm9kZXNCdWlsZGVyXCI7XG5leHBvcnQgKiBhcyBub2RlIGZyb20gXCIuL0JvZHlOb2Rlc0J1aWxkZXJcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZTogQ3JlYXRlQnVpbGRlcjxCb2R5QnVpbGRlcj4gPSAoKSA9PiBuZXcgQm9keUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCB0cnVzdEJveDogQ3JlYXRlQnVpbGRlcjxUcnVzdEJveEJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgVHJ1c3RCb3hCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgb3BlbmVyOiBDcmVhdGVCdWlsZGVyPE9wZW5lckJ1aWxkZXI+ID0gKCkgPT4gbmV3IE9wZW5lckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzdGFnZTogQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEJvZHlTdGFnZUJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBoZWFkZXI6IENyZWF0ZUJ1aWxkZXI8Qm9keUhlYWRlckJ1aWxkZXI+ID0gKCkgPT5cbiAgICBuZXcgQm9keUhlYWRlckJ1aWxkZXIoKTtcbmV4cG9ydCBjb25zdCBzb3VyY2U6IENyZWF0ZUJ1aWxkZXI8XG4gICAgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIsXG4gICAgQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+XG4+ID0gKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4gPSBbXSkgPT5cbiAgICBuZXcgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIoLi4ubm9kZXMpO1xuZXhwb3J0IGNvbnN0IHNvdXJjZXM6IENyZWF0ZUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZXNCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEFydGljbGVTb3VyY2VzQnVpbGRlcigpO1xuXG5leHBvcnQgY29uc3Qgc2VxID0ge1xuICAgIHN0YWdlOiAoKCkgPT5cbiAgICAgICAgbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxCb2R5U3RhZ2VTZXFCdWlsZGVyPixcbiAgICBzb3VyY2U6ICgoKSA9PlxuICAgICAgICBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKSkgYXMgQ3JlYXRlQnVpbGRlcjxBcnRpY2xlU291cmNlU2VxQnVpbGRlcj4sXG59IGFzIGNvbnN0O1xuXG5jbGFzcyBCb2R5QnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5PiB7XG4gICAgI3N0YWdlczogQm9keVN0YWdlW10gPSBbXTtcbiAgICAjdHJ1c3RCb3g/OiBUcnVzdEJveCA9IHVuZGVmaW5lZDtcbiAgICAjZGlzY2xhaW1lcj86IFJpY2hUZXh0Lk5vZGVbXSA9IHVuZGVmaW5lZDtcbiAgICAjYXJ0aWNsZVNvdXJjZXM/OiBBcnRpY2xlU291cmNlcyA9IHVuZGVmaW5lZDtcblxuICAgIHN0YWdlcyguLi5zdGFnZXM6IEJ1aWxkQXJnczxCb2R5U3RhZ2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3N0YWdlcyA9IHN0YWdlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0cnVzdEJveCh0cnVzdEJveD86IEJ1aWxkQXJnPFRydXN0Qm94Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiN0cnVzdEJveCA9IG1hcEJ1aWxkQXJnKHRydXN0Qm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGlzY2xhaW1lcihkaXNjbGFpbWVyPzogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2Rpc2NsYWltZXIgPSBkaXNjbGFpbWVyPy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhcnRpY2xlU291cmNlcyhhcnRpY2xlU291cmNlcz86IEJ1aWxkQXJnPEFydGljbGVTb3VyY2VzPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNhcnRpY2xlU291cmNlcyA9IG1hcEJ1aWxkQXJnKGFydGljbGVTb3VyY2VzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGFnZXM6IHRoaXMuI3N0YWdlcyxcbiAgICAgICAgICAgIHRydXN0Qm94OiB0aGlzLiN0cnVzdEJveCxcbiAgICAgICAgICAgIGRpc2NsYWltZXI6IHRoaXMuI2Rpc2NsYWltZXIsXG4gICAgICAgICAgICBhcnRpY2xlU291cmNlczogdGhpcy4jYXJ0aWNsZVNvdXJjZXMsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBUcnVzdEJveEJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8VHJ1c3RCb3g+IHtcbiAgICAjbm9kZXM6IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuICAgICNoaWRkZW46IFJpY2hUZXh0Lk5vZGVbXSA9IFtdO1xuXG4gICAgbm9kZXMobm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNub2RlcyA9IG5vZGVzLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhpZGRlbihoaWRkZW46IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoaWRkZW4gPSBoaWRkZW4ubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogVHJ1c3RCb3gge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbm9kZXM6IHRoaXMuI25vZGVzLFxuICAgICAgICAgICAgaGlkZGVuOiB0aGlzLiNoaWRkZW4sXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBPcGVuZXJCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPE9wZW5lcj4ge1xuICAgICNlbGVtZW50OiBPcGVuZXJbXCJlbGVtZW50XCJdID0gaW1hZ2UoKS5idWlsZCgpO1xuXG4gICAgZWxlbWVudChlbGVtZW50OiBCdWlsZEFyZzxPcGVuZXJbXCJlbGVtZW50XCJdPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNlbGVtZW50ID0gbWFwQnVpbGRBcmcoZWxlbWVudCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IE9wZW5lciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiNlbGVtZW50LFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjbm9kZXM6IFNlcUVsZW1lbnQ8UmljaFRleHQuTm9kZVtdPiA9IFtdO1xuICAgICNoZWFkZXI/OiBTZXFFbGVtZW50PEJvZHlIZWFkZXI+ID0gdW5kZWZpbmVkO1xuICAgICNjb21wYW5pb25zOiBTZXFFbGVtZW50PFN0YWdlLkNvbXBhbmlvbkl0ZW1bXT4gPSBbXTtcbiAgICAjY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IFNlcUVsZW1lbnQ8QnVpbGRBcmc8Qm9keUhlYWRlcj4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hlYWRlciA9IG1hcEJ1aWxkQXJncyhoZWFkZXIgPz8gW10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFN0YWdlLkNvbXBhbmlvbkl0ZW0+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21wYW5pb25zID0gY29tcGFuaW9ucy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IFNlcUVsZW1lbnQ8QnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+PlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UgPSBjb21tZXJjaWFsc0VuZE9mU3RhZ2UubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQm9keVN0YWdlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBoYXNoKFxuICAgICAgICAgICAgICAgIFwiYm9keVN0YWdlXCIsXG4gICAgICAgICAgICAgICAgdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tcGFuaW9ucyxcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jaGVhZGVyXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgICAgIGhlYWRlcjogc2VxTmV4dEVsZW1lbnQubWF5YmUodGhpcy4jaGVhZGVyKSxcbiAgICAgICAgICAgIGNvbXBhbmlvbnM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI2NvbXBhbmlvbnMpLFxuICAgICAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBzZXFOZXh0RWxlbWVudC5hcnJheShcbiAgICAgICAgICAgICAgICB0aGlzLiNjb21tZXJjaWFsc0VuZE9mU3RhZ2VcbiAgICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5U3RhZ2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEJvZHlTdGFnZT4ge1xuICAgICNzZXFCdWlsZGVyOiBCb2R5U3RhZ2VTZXFCdWlsZGVyID0gbmV3IEJvZHlTdGFnZVNlcUJ1aWxkZXIoKTtcblxuICAgIG5vZGVzKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5ub2Rlcyhbbm9kZXNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGVhZGVyKGhlYWRlcj86IEJ1aWxkQXJnPEJvZHlIZWFkZXI+KTogdGhpcyB7XG4gICAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIuaGVhZGVyKFtoZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjb21wYW5pb25zKGNvbXBhbmlvbnM6IEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbXBhbmlvbnMoW2NvbXBhbmlvbnNdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlKFxuICAgICAgICBjb21tZXJjaWFsc0VuZE9mU3RhZ2U6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPlxuICAgICk6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmNvbW1lcmNpYWxzRW5kT2ZTdGFnZShbY29tbWVyY2lhbHNFbmRPZlN0YWdlXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzZXFCdWlsZGVyLmJ1aWxkKCk7XG4gICAgfVxufVxuXG5jbGFzcyBCb2R5SGVhZGVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5SGVhZGVyPiB7XG4gICAgI3ZhcmlhbnQ6IEJvZHlIZWFkZXJbXCJ2YXJpYW50XCJdID0gXCJmdWxsXCI7XG4gICAgI29wZW5lcj86IE9wZW5lciA9IHVuZGVmaW5lZDtcblxuICAgIHZhcmlhbnQodmFyaWFudDogQm9keUhlYWRlcltcInZhcmlhbnRcIl0pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdmFyaWFudCA9IHZhcmlhbnQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG9wZW5lcihvcGVuZXI6IEJ1aWxkQXJnPE9wZW5lcj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jb3BlbmVyID0gbWFwQnVpbGRBcmcob3BlbmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGQoKTogQm9keUhlYWRlciB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YXJpYW50OiB0aGlzLiN2YXJpYW50LFxuICAgICAgICAgICAgb3BlbmVyOiB0aGlzLiNvcGVuZXIsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jbGFzcyBBcnRpY2xlU291cmNlU2VxQnVpbGRlciBleHRlbmRzIEFic3RyYWN0U2VxQnVpbGRlcjxBcnRpY2xlU291cmNlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYnVpbGRMaXN0SXRlbShzZXFOZXh0RWxlbWVudDogU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgY29uc3QgaWQgPSBoYXNoKFwiYXJ0aWNsZS1zb3VyY2VcIiwgdGhpcy4jbm9kZXMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBub2Rlczogc2VxTmV4dEVsZW1lbnQuYXJyYXkodGhpcy4jbm9kZXMpLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8QXJ0aWNsZVNvdXJjZT4ge1xuICAgICNzZXFCdWlsZGVyOiBBcnRpY2xlU291cmNlU2VxQnVpbGRlciA9IG5ldyBBcnRpY2xlU291cmNlU2VxQnVpbGRlcigpO1xuXG4gICAgY29uc3RydWN0b3IoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGVzKC4uLm5vZGVzKTtcbiAgICB9XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VxQnVpbGRlci5idWlsZCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2VzPiB7XG4gICAgI25vZGVzOiBBcnRpY2xlU291cmNlW10gPSBbXTtcbiAgICAjaGlkZGVuOiBBcnRpY2xlU291cmNlW10gPSBbXTtcblxuICAgIG5vZGVzKC4uLm5vZGVzOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRkZW4oLi4uaGlkZGVuOiBCdWlsZEFyZ3M8QXJ0aWNsZVNvdXJjZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jaGlkZGVuID0gaGlkZGVuLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEFydGljbGVTb3VyY2VzIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLiNub2RlcyxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy4jaGlkZGVuLFxuICAgICAgICB9O1xuICAgIH1cbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGUiLCJoZWFkZXIiLCJub2RlIiwib3BlbmVyIiwic2VxIiwic291cmNlIiwic291cmNlcyIsInN0YWdlIiwidHJ1c3RCb3giLCJCb2R5QnVpbGRlciIsIlRydXN0Qm94QnVpbGRlciIsIk9wZW5lckJ1aWxkZXIiLCJCb2R5U3RhZ2VCdWlsZGVyIiwiQm9keUhlYWRlckJ1aWxkZXIiLCJub2RlcyIsIkFydGljbGVTb3VyY2VCdWlsZGVyIiwiQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIiwiQm9keVN0YWdlU2VxQnVpbGRlciIsIkFydGljbGVTb3VyY2VTZXFCdWlsZGVyIiwiQWJzdHJhY3RCdWlsZGVyIiwic3RhZ2VzIiwibWFwIiwibWFwQnVpbGRBcmciLCJkaXNjbGFpbWVyIiwiYXJ0aWNsZVNvdXJjZXMiLCJidWlsZCIsInVuZGVmaW5lZCIsImhpZGRlbiIsImVsZW1lbnQiLCJpbWFnZSIsIkFic3RyYWN0U2VxQnVpbGRlciIsIm1hcEJ1aWxkQXJncyIsImNvbXBhbmlvbnMiLCJjb21tZXJjaWFsc0VuZE9mU3RhZ2UiLCJidWlsZExpc3RJdGVtIiwic2VxTmV4dEVsZW1lbnQiLCJpZCIsImhhc2giLCJhcnJheSIsIm1heWJlIiwic2VxQnVpbGRlciIsInZhcmlhbnQiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUE2QmFBLE1BQU07ZUFBTkE7O0lBTUFDLE1BQU07ZUFBTkE7O0lBUkRDLElBQUk7OztJQUtIQyxNQUFNO2VBQU5BOztJQWFBQyxHQUFHO2VBQUhBOztJQVJBQyxNQUFNO2VBQU5BOztJQUtBQyxPQUFPO2VBQVBBOztJQVRBQyxLQUFLO2VBQUxBOztJQUhBQyxRQUFRO2VBQVJBOzs7Ozs7OztrQ0E5QnVDOzhCQUNKO2dDQUMxQjsyRkF3QlI7QUFHUCxNQUFNUixTQUFxQyxJQUFNLElBQUlTO0FBQ3JELE1BQU1ELFdBQTJDLElBQ3BELElBQUlFO0FBQ0QsTUFBTVAsU0FBdUMsSUFBTSxJQUFJUTtBQUN2RCxNQUFN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
