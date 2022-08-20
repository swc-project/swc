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
const _bodyNodesBuilder = /*#__PURE__*/ _interopRequireWildcard(_exportStar(require("./BodyNodesBuilder"), exports));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2lucHV0L2luZGV4LnRzIiwiPDxqc3gtY29uZmlnLXByYWdtYUZyYWcuanM+PiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBYnN0cmFjdEJ1aWxkZXIsIEFic3RyYWN0U2VxQnVpbGRlciB9IGZyb20gXCIuL0Fic3RyYWN0QnVpbGRlcnNcIjtcbmltcG9ydCB7IGhhc2gsIG1hcEJ1aWxkQXJnLCBtYXBCdWlsZEFyZ3MgfSBmcm9tIFwiLi9CdWlsZGVyLnV0aWxzXCI7XG5pbXBvcnQgeyBpbWFnZSB9IGZyb20gXCIuL0VsZW1lbnRCdWlsZGVyXCI7XG5cbmltcG9ydCB0eXBlIHtcbiAgICBCb2R5LFxuICAgIEJvZHlTdGFnZSxcbiAgICBUcnVzdEJveCxcbiAgICBSaWNoVGV4dCxcbiAgICBPcGVuZXIsXG4gICAgQm9keUhlYWRlcixcbiAgICBTdGFnZSxcbiAgICBBcnRpY2xlU291cmNlLFxuICAgIEFydGljbGVTb3VyY2VzLFxufSBmcm9tIFwiQHBhcGVyL21vZGVsc1wiO1xuaW1wb3J0IHR5cGUge1xuICAgIEJ1aWxkQXJnLFxuICAgIEJ1aWxkQXJncyxcbiAgICBDcmVhdGVCdWlsZGVyLFxuICAgIFNlcUVsZW1lbnQsXG4gICAgU2VxTmV4dEVsZW1lbnRDb252ZXJ0ZXIsXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIHtCdWlsZGVyLmJvZHkubm9kZS5pbWcoKX1cbiAqL1xuZXhwb3J0ICogZnJvbSBcIi4vQm9keU5vZGVzQnVpbGRlclwiO1xuZXhwb3J0ICogYXMgbm9kZSBmcm9tIFwiLi9Cb2R5Tm9kZXNCdWlsZGVyXCI7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGU6IENyZWF0ZUJ1aWxkZXI8Qm9keUJ1aWxkZXI+ID0gKCkgPT4gbmV3IEJvZHlCdWlsZGVyKCk7XG5leHBvcnQgY29uc3QgdHJ1c3RCb3g6IENyZWF0ZUJ1aWxkZXI8VHJ1c3RCb3hCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IFRydXN0Qm94QnVpbGRlcigpO1xuZXhwb3J0IGNvbnN0IG9wZW5lcjogQ3JlYXRlQnVpbGRlcjxPcGVuZXJCdWlsZGVyPiA9ICgpID0+IG5ldyBPcGVuZXJCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgc3RhZ2U6IENyZWF0ZUJ1aWxkZXI8Qm9keVN0YWdlQnVpbGRlcj4gPSAoKSA9PlxuICAgIG5ldyBCb2R5U3RhZ2VCdWlsZGVyKCk7XG5leHBvcnQgY29uc3QgaGVhZGVyOiBDcmVhdGVCdWlsZGVyPEJvZHlIZWFkZXJCdWlsZGVyPiA9ICgpID0+XG4gICAgbmV3IEJvZHlIZWFkZXJCdWlsZGVyKCk7XG5leHBvcnQgY29uc3Qgc291cmNlOiBDcmVhdGVCdWlsZGVyPFxuICAgIEFydGljbGVTb3VyY2VCdWlsZGVyLFxuICAgIEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPlxuPiA9IChub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+ID0gW10pID0+XG4gICAgbmV3IEFydGljbGVTb3VyY2VCdWlsZGVyKC4uLm5vZGVzKTtcbmV4cG9ydCBjb25zdCBzb3VyY2VzOiBDcmVhdGVCdWlsZGVyPEFydGljbGVTb3VyY2VzQnVpbGRlcj4gPSAoKSA9PlxuICAgIG5ldyBBcnRpY2xlU291cmNlc0J1aWxkZXIoKTtcblxuZXhwb3J0IGNvbnN0IHNlcSA9IHtcbiAgICBzdGFnZTogKCgpID0+XG4gICAgICAgIG5ldyBCb2R5U3RhZ2VTZXFCdWlsZGVyKCkpIGFzIENyZWF0ZUJ1aWxkZXI8Qm9keVN0YWdlU2VxQnVpbGRlcj4sXG4gICAgc291cmNlOiAoKCkgPT5cbiAgICAgICAgbmV3IEFydGljbGVTb3VyY2VTZXFCdWlsZGVyKCkpIGFzIENyZWF0ZUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXI+LFxufSBhcyBjb25zdDtcblxuY2xhc3MgQm9keUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8Qm9keT4ge1xuICAgICNzdGFnZXM6IEJvZHlTdGFnZVtdID0gW107XG4gICAgI3RydXN0Qm94PzogVHJ1c3RCb3ggPSB1bmRlZmluZWQ7XG4gICAgI2Rpc2NsYWltZXI/OiBSaWNoVGV4dC5Ob2RlW10gPSB1bmRlZmluZWQ7XG4gICAgI2FydGljbGVTb3VyY2VzPzogQXJ0aWNsZVNvdXJjZXMgPSB1bmRlZmluZWQ7XG5cbiAgICBzdGFnZXMoLi4uc3RhZ2VzOiBCdWlsZEFyZ3M8Qm9keVN0YWdlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzdGFnZXMgPSBzdGFnZXMubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdHJ1c3RCb3godHJ1c3RCb3g/OiBCdWlsZEFyZzxUcnVzdEJveD4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jdHJ1c3RCb3ggPSBtYXBCdWlsZEFyZyh0cnVzdEJveCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRpc2NsYWltZXIoZGlzY2xhaW1lcj86IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNkaXNjbGFpbWVyID0gZGlzY2xhaW1lcj8ubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXJ0aWNsZVNvdXJjZXMoYXJ0aWNsZVNvdXJjZXM/OiBCdWlsZEFyZzxBcnRpY2xlU291cmNlcz4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jYXJ0aWNsZVNvdXJjZXMgPSBtYXBCdWlsZEFyZyhhcnRpY2xlU291cmNlcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhZ2VzOiB0aGlzLiNzdGFnZXMsXG4gICAgICAgICAgICB0cnVzdEJveDogdGhpcy4jdHJ1c3RCb3gsXG4gICAgICAgICAgICBkaXNjbGFpbWVyOiB0aGlzLiNkaXNjbGFpbWVyLFxuICAgICAgICAgICAgYXJ0aWNsZVNvdXJjZXM6IHRoaXMuI2FydGljbGVTb3VyY2VzLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgVHJ1c3RCb3hCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPFRydXN0Qm94PiB7XG4gICAgI25vZGVzOiBSaWNoVGV4dC5Ob2RlW10gPSBbXTtcbiAgICAjaGlkZGVuOiBSaWNoVGV4dC5Ob2RlW10gPSBbXTtcblxuICAgIG5vZGVzKG5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jbm9kZXMgPSBub2Rlcy5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoaWRkZW4oaGlkZGVuOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jaGlkZGVuID0gaGlkZGVuLm1hcChtYXBCdWlsZEFyZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IFRydXN0Qm94IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5vZGVzOiB0aGlzLiNub2RlcyxcbiAgICAgICAgICAgIGhpZGRlbjogdGhpcy4jaGlkZGVuLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgT3BlbmVyQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxPcGVuZXI+IHtcbiAgICAjZWxlbWVudDogT3BlbmVyW1wiZWxlbWVudFwiXSA9IGltYWdlKCkuYnVpbGQoKTtcblxuICAgIGVsZW1lbnQoZWxlbWVudDogQnVpbGRBcmc8T3BlbmVyW1wiZWxlbWVudFwiXT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jZWxlbWVudCA9IG1hcEJ1aWxkQXJnKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBPcGVuZXIge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZWxlbWVudDogdGhpcy4jZWxlbWVudCxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIEJvZHlTdGFnZVNlcUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdFNlcUJ1aWxkZXI8Qm9keVN0YWdlPiB7XG4gICAgI25vZGVzOiBTZXFFbGVtZW50PFJpY2hUZXh0Lk5vZGVbXT4gPSBbXTtcbiAgICAjaGVhZGVyPzogU2VxRWxlbWVudDxCb2R5SGVhZGVyPiA9IHVuZGVmaW5lZDtcbiAgICAjY29tcGFuaW9uczogU2VxRWxlbWVudDxTdGFnZS5Db21wYW5pb25JdGVtW10+ID0gW107XG4gICAgI2NvbW1lcmNpYWxzRW5kT2ZTdGFnZTogU2VxRWxlbWVudDxSaWNoVGV4dC5Ob2RlW10+ID0gW107XG5cbiAgICBub2Rlcyhub2RlczogU2VxRWxlbWVudDxCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcihoZWFkZXI/OiBTZXFFbGVtZW50PEJ1aWxkQXJnPEJvZHlIZWFkZXI+Pik6IHRoaXMge1xuICAgICAgICB0aGlzLiNoZWFkZXIgPSBtYXBCdWlsZEFyZ3MoaGVhZGVyID8/IFtdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tcGFuaW9ucyhjb21wYW5pb25zOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxTdGFnZS5Db21wYW5pb25JdGVtPj4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jY29tcGFuaW9ucyA9IGNvbXBhbmlvbnMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZShcbiAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBTZXFFbGVtZW50PEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPj5cbiAgICApOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jY29tbWVyY2lhbHNFbmRPZlN0YWdlID0gY29tbWVyY2lhbHNFbmRPZlN0YWdlLm1hcChtYXBCdWlsZEFyZ3MpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZExpc3RJdGVtKHNlcU5leHRFbGVtZW50OiBTZXFOZXh0RWxlbWVudENvbnZlcnRlcik6IEJvZHlTdGFnZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogaGFzaChcbiAgICAgICAgICAgICAgICBcImJvZHlTdGFnZVwiLFxuICAgICAgICAgICAgICAgIHRoaXMuI25vZGVzLFxuICAgICAgICAgICAgICAgIHRoaXMuI2NvbXBhbmlvbnMsXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tbWVyY2lhbHNFbmRPZlN0YWdlLFxuICAgICAgICAgICAgICAgIHRoaXMuI2hlYWRlclxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG5vZGVzOiBzZXFOZXh0RWxlbWVudC5hcnJheSh0aGlzLiNub2RlcyksXG4gICAgICAgICAgICBoZWFkZXI6IHNlcU5leHRFbGVtZW50Lm1heWJlKHRoaXMuI2hlYWRlciksXG4gICAgICAgICAgICBjb21wYW5pb25zOiBzZXFOZXh0RWxlbWVudC5hcnJheSh0aGlzLiNjb21wYW5pb25zKSxcbiAgICAgICAgICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZTogc2VxTmV4dEVsZW1lbnQuYXJyYXkoXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tbWVyY2lhbHNFbmRPZlN0YWdlXG4gICAgICAgICAgICApLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQm9keVN0YWdlQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxCb2R5U3RhZ2U+IHtcbiAgICAjc2VxQnVpbGRlcjogQm9keVN0YWdlU2VxQnVpbGRlciA9IG5ldyBCb2R5U3RhZ2VTZXFCdWlsZGVyKCk7XG5cbiAgICBub2Rlcyhub2RlczogQnVpbGRBcmdzPFJpY2hUZXh0Lk5vZGU+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3NlcUJ1aWxkZXIubm9kZXMoW25vZGVzXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhlYWRlcihoZWFkZXI/OiBCdWlsZEFyZzxCb2R5SGVhZGVyPik6IHRoaXMge1xuICAgICAgICBpZiAoaGVhZGVyKSB7XG4gICAgICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLmhlYWRlcihbaGVhZGVyXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29tcGFuaW9ucyhjb21wYW5pb25zOiBCdWlsZEFyZ3M8U3RhZ2UuQ29tcGFuaW9uSXRlbT4pOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5jb21wYW5pb25zKFtjb21wYW5pb25zXSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNvbW1lcmNpYWxzRW5kT2ZTdGFnZShcbiAgICAgICAgY29tbWVyY2lhbHNFbmRPZlN0YWdlOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT5cbiAgICApOiB0aGlzIHtcbiAgICAgICAgdGhpcy4jc2VxQnVpbGRlci5jb21tZXJjaWFsc0VuZE9mU3RhZ2UoW2NvbW1lcmNpYWxzRW5kT2ZTdGFnZV0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBCb2R5U3RhZ2Uge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VxQnVpbGRlci5idWlsZCgpO1xuICAgIH1cbn1cblxuY2xhc3MgQm9keUhlYWRlckJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdEJ1aWxkZXI8Qm9keUhlYWRlcj4ge1xuICAgICN2YXJpYW50OiBCb2R5SGVhZGVyW1widmFyaWFudFwiXSA9IFwiZnVsbFwiO1xuICAgICNvcGVuZXI/OiBPcGVuZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB2YXJpYW50KHZhcmlhbnQ6IEJvZHlIZWFkZXJbXCJ2YXJpYW50XCJdKTogdGhpcyB7XG4gICAgICAgIHRoaXMuI3ZhcmlhbnQgPSB2YXJpYW50O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBvcGVuZXIob3BlbmVyOiBCdWlsZEFyZzxPcGVuZXI+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI29wZW5lciA9IG1hcEJ1aWxkQXJnKG9wZW5lcik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkKCk6IEJvZHlIZWFkZXIge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFyaWFudDogdGhpcy4jdmFyaWFudCxcbiAgICAgICAgICAgIG9wZW5lcjogdGhpcy4jb3BlbmVyLFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY2xhc3MgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIgZXh0ZW5kcyBBYnN0cmFjdFNlcUJ1aWxkZXI8QXJ0aWNsZVNvdXJjZT4ge1xuICAgICNub2RlczogU2VxRWxlbWVudDxSaWNoVGV4dC5Ob2RlW10+ID0gW107XG5cbiAgICBub2Rlcyhub2RlczogU2VxRWxlbWVudDxCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJncyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGJ1aWxkTGlzdEl0ZW0oc2VxTmV4dEVsZW1lbnQ6IFNlcU5leHRFbGVtZW50Q29udmVydGVyKTogQXJ0aWNsZVNvdXJjZSB7XG4gICAgICAgIGNvbnN0IGlkID0gaGFzaChcImFydGljbGUtc291cmNlXCIsIHRoaXMuI25vZGVzKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgbm9kZXM6IHNlcU5leHRFbGVtZW50LmFycmF5KHRoaXMuI25vZGVzKSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNsYXNzIEFydGljbGVTb3VyY2VCdWlsZGVyIGV4dGVuZHMgQWJzdHJhY3RCdWlsZGVyPEFydGljbGVTb3VyY2U+IHtcbiAgICAjc2VxQnVpbGRlcjogQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIgPSBuZXcgQXJ0aWNsZVNvdXJjZVNlcUJ1aWxkZXIoKTtcblxuICAgIGNvbnN0cnVjdG9yKC4uLm5vZGVzOiBCdWlsZEFyZ3M8UmljaFRleHQuTm9kZT4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ub2RlcyguLi5ub2Rlcyk7XG4gICAgfVxuXG4gICAgbm9kZXMoLi4ubm9kZXM6IEJ1aWxkQXJnczxSaWNoVGV4dC5Ob2RlPik6IHRoaXMge1xuICAgICAgICB0aGlzLiNzZXFCdWlsZGVyLm5vZGVzKFtub2Rlc10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBBcnRpY2xlU291cmNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3NlcUJ1aWxkZXIuYnVpbGQoKTtcbiAgICB9XG59XG5cbmNsYXNzIEFydGljbGVTb3VyY2VzQnVpbGRlciBleHRlbmRzIEFic3RyYWN0QnVpbGRlcjxBcnRpY2xlU291cmNlcz4ge1xuICAgICNub2RlczogQXJ0aWNsZVNvdXJjZVtdID0gW107XG4gICAgI2hpZGRlbjogQXJ0aWNsZVNvdXJjZVtdID0gW107XG5cbiAgICBub2RlcyguLi5ub2RlczogQnVpbGRBcmdzPEFydGljbGVTb3VyY2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI25vZGVzID0gbm9kZXMubWFwKG1hcEJ1aWxkQXJnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaGlkZGVuKC4uLmhpZGRlbjogQnVpbGRBcmdzPEFydGljbGVTb3VyY2U+KTogdGhpcyB7XG4gICAgICAgIHRoaXMuI2hpZGRlbiA9IGhpZGRlbi5tYXAobWFwQnVpbGRBcmcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBidWlsZCgpOiBBcnRpY2xlU291cmNlcyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBub2RlczogdGhpcy4jbm9kZXMsXG4gICAgICAgICAgICBoaWRkZW46IHRoaXMuI2hpZGRlbixcbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJSZWFjdC5GcmFnbWVudCJdLCJuYW1lcyI6WyJub2RlIiwiY3JlYXRlIiwidHJ1c3RCb3giLCJvcGVuZXIiLCJzdGFnZSIsImhlYWRlciIsInNvdXJjZSIsInNvdXJjZXMiLCJzZXEiLCJCb2R5QnVpbGRlciIsIlRydXN0Qm94QnVpbGRlciIsIk9wZW5lckJ1aWxkZXIiLCJCb2R5U3RhZ2VCdWlsZGVyIiwiQm9keUhlYWRlckJ1aWxkZXIiLCJub2RlcyIsIkFydGljbGVTb3VyY2VCdWlsZGVyIiwiQXJ0aWNsZVNvdXJjZXNCdWlsZGVyIiwiQm9keVN0YWdlU2VxQnVpbGRlciIsIkFydGljbGVTb3VyY2VTZXFCdWlsZGVyIiwiQWJzdHJhY3RCdWlsZGVyIiwic3RhZ2VzIiwibWFwIiwibWFwQnVpbGRBcmciLCJkaXNjbGFpbWVyIiwiYXJ0aWNsZVNvdXJjZXMiLCJidWlsZCIsInVuZGVmaW5lZCIsImhpZGRlbiIsImVsZW1lbnQiLCJpbWFnZSIsIkFic3RyYWN0U2VxQnVpbGRlciIsIm1hcEJ1aWxkQXJncyIsImNvbXBhbmlvbnMiLCJjb21tZXJjaWFsc0VuZE9mU3RhZ2UiLCJidWlsZExpc3RJdGVtIiwic2VxTmV4dEVsZW1lbnQiLCJpZCIsImhhc2giLCJhcnJheSIsIm1heWJlIiwic2VxQnVpbGRlciIsInZhcmlhbnQiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0lBMkJZQSxJQUFJO0lBRUhDLE1BQU0sTUFBTkEsTUFBTTtJQUNOQyxRQUFRLE1BQVJBLFFBQVE7SUFFUkMsTUFBTSxNQUFOQSxNQUFNO0lBQ05DLEtBQUssTUFBTEEsS0FBSztJQUVMQyxNQUFNLE1BQU5BLE1BQU07SUFFTkMsTUFBTSxNQUFOQSxNQUFNO0lBS05DLE9BQU8sTUFBUEEsT0FBTztJQUdQQyxHQUFHLE1BQUhBLEdBQUc7Ozs7Ozs7a0NBN0NvQyxvQkFBbUI7OEJBQ3ZCLGlCQUFnQjtnQ0FDMUMsa0JBQWlC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
