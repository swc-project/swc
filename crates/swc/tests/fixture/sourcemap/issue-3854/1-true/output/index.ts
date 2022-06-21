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
var _classPrivateFieldGetMjs = require("@swc/helpers/lib/_class_private_field_get.js").default;
var _classPrivateFieldInitMjs = require("@swc/helpers/lib/_class_private_field_init.js").default;
var _classPrivateFieldSetMjs = require("@swc/helpers/lib/_class_private_field_set.js").default;
var _interopRequireWildcardMjs = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _abstractBuilders = require("./AbstractBuilders");
var _builderUtils = require("./Builder.utils");
var _elementBuilder = require("./ElementBuilder");
var _bodyNodesBuilder = _interopRequireWildcardMjs(_re_export(exports, require("./BodyNodesBuilder")));
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
