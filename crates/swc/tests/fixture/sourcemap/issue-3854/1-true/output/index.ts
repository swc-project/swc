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
