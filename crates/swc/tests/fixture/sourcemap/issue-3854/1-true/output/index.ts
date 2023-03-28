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
    node: ()=>_BodyNodesBuilder,
    create: ()=>create,
    trustBox: ()=>trustBox,
    opener: ()=>opener,
    stage: ()=>stage,
    header: ()=>header,
    source: ()=>source,
    sources: ()=>sources,
    seq: ()=>seq
});
const _class_private_field_get = require("@swc/helpers/lib/_class_private_field_get.js").default;
const _class_private_field_init = require("@swc/helpers/lib/_class_private_field_init.js").default;
const _class_private_field_set = require("@swc/helpers/lib/_class_private_field_set.js").default;
const _export_star = require("@swc/helpers/lib/_export_star.js").default;
const _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
const _AbstractBuilders = require("./AbstractBuilders");
const _Builderutils = require("./Builder.utils");
const _ElementBuilder = require("./ElementBuilder");
const _BodyNodesBuilder = /*#__PURE__*/ _interop_require_wildcard(_export_star(require("./BodyNodesBuilder"), exports));
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
        _class_private_field_set(this, _stages, stages.map(_Builderutils.mapBuildArg));
        return this;
    }
    trustBox(trustBox) {
        _class_private_field_set(this, _trustBox, (0, _Builderutils.mapBuildArg)(trustBox));
        return this;
    }
    disclaimer(disclaimer) {
        _class_private_field_set(this, _disclaimer, disclaimer?.map(_Builderutils.mapBuildArg));
        return this;
    }
    articleSources(articleSources) {
        _class_private_field_set(this, _articleSources, (0, _Builderutils.mapBuildArg)(articleSources));
        return this;
    }
    build() {
        return {
            stages: _class_private_field_get(this, _stages),
            trustBox: _class_private_field_get(this, _trustBox),
            disclaimer: _class_private_field_get(this, _disclaimer),
            articleSources: _class_private_field_get(this, _articleSources)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _stages, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _trustBox, {
            writable: true,
            value: undefined
        });
        _class_private_field_init(this, _disclaimer, {
            writable: true,
            value: undefined
        });
        _class_private_field_init(this, _articleSources, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes = /*#__PURE__*/ new WeakMap(), _hidden = /*#__PURE__*/ new WeakMap();
class TrustBoxBuilder extends _AbstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes, nodes.map(_Builderutils.mapBuildArg));
        return this;
    }
    hidden(hidden) {
        _class_private_field_set(this, _hidden, hidden.map(_Builderutils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _class_private_field_get(this, _nodes),
            hidden: _class_private_field_get(this, _hidden)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _nodes, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _hidden, {
            writable: true,
            value: []
        });
    }
}
var _element = /*#__PURE__*/ new WeakMap();
class OpenerBuilder extends _AbstractBuilders.AbstractBuilder {
    element(element) {
        _class_private_field_set(this, _element, (0, _Builderutils.mapBuildArg)(element));
        return this;
    }
    build() {
        return {
            element: _class_private_field_get(this, _element)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _element, {
            writable: true,
            value: (0, _ElementBuilder.image)().build()
        });
    }
}
var _nodes1 = /*#__PURE__*/ new WeakMap(), _header = /*#__PURE__*/ new WeakMap(), _companions = /*#__PURE__*/ new WeakMap(), _commercialsEndOfStage = /*#__PURE__*/ new WeakMap();
class BodyStageSeqBuilder extends _AbstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes1, nodes.map(_Builderutils.mapBuildArgs));
        return this;
    }
    header(header) {
        _class_private_field_set(this, _header, (0, _Builderutils.mapBuildArgs)(header ?? []));
        return this;
    }
    companions(companions) {
        _class_private_field_set(this, _companions, companions.map(_Builderutils.mapBuildArgs));
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _class_private_field_set(this, _commercialsEndOfStage, commercialsEndOfStage.map(_Builderutils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        return {
            id: (0, _Builderutils.hash)("bodyStage", _class_private_field_get(this, _nodes1), _class_private_field_get(this, _companions), _class_private_field_get(this, _commercialsEndOfStage), _class_private_field_get(this, _header)),
            nodes: seqNextElement.array(_class_private_field_get(this, _nodes1)),
            header: seqNextElement.maybe(_class_private_field_get(this, _header)),
            companions: seqNextElement.array(_class_private_field_get(this, _companions)),
            commercialsEndOfStage: seqNextElement.array(_class_private_field_get(this, _commercialsEndOfStage))
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _nodes1, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _header, {
            writable: true,
            value: undefined
        });
        _class_private_field_init(this, _companions, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _commercialsEndOfStage, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder = /*#__PURE__*/ new WeakMap();
class BodyStageBuilder extends _AbstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _class_private_field_get(this, _seqBuilder).nodes([
            nodes
        ]);
        return this;
    }
    header(header) {
        if (header) {
            _class_private_field_get(this, _seqBuilder).header([
                header
            ]);
        }
        return this;
    }
    companions(companions) {
        _class_private_field_get(this, _seqBuilder).companions([
            companions
        ]);
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _class_private_field_get(this, _seqBuilder).commercialsEndOfStage([
            commercialsEndOfStage
        ]);
        return this;
    }
    build() {
        return _class_private_field_get(this, _seqBuilder).build();
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _seqBuilder, {
            writable: true,
            value: new BodyStageSeqBuilder()
        });
    }
}
var _variant = /*#__PURE__*/ new WeakMap(), _opener = /*#__PURE__*/ new WeakMap();
class BodyHeaderBuilder extends _AbstractBuilders.AbstractBuilder {
    variant(variant) {
        _class_private_field_set(this, _variant, variant);
        return this;
    }
    opener(opener) {
        _class_private_field_set(this, _opener, (0, _Builderutils.mapBuildArg)(opener));
        return this;
    }
    build() {
        return {
            variant: _class_private_field_get(this, _variant),
            opener: _class_private_field_get(this, _opener)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _variant, {
            writable: true,
            value: "full"
        });
        _class_private_field_init(this, _opener, {
            writable: true,
            value: undefined
        });
    }
}
var _nodes2 = /*#__PURE__*/ new WeakMap();
class ArticleSourceSeqBuilder extends _AbstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes2, nodes.map(_Builderutils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        const id = (0, _Builderutils.hash)("article-source", _class_private_field_get(this, _nodes2));
        return {
            id,
            nodes: seqNextElement.array(_class_private_field_get(this, _nodes2))
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _nodes2, {
            writable: true,
            value: []
        });
    }
}
var _seqBuilder1 = /*#__PURE__*/ new WeakMap();
class ArticleSourceBuilder extends _AbstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _class_private_field_get(this, _seqBuilder1).nodes([
            nodes
        ]);
        return this;
    }
    build() {
        return _class_private_field_get(this, _seqBuilder1).build();
    }
    constructor(...nodes){
        super();
        _class_private_field_init(this, _seqBuilder1, {
            writable: true,
            value: new ArticleSourceSeqBuilder()
        });
        this.nodes(...nodes);
    }
}
var _nodes3 = /*#__PURE__*/ new WeakMap(), _hidden1 = /*#__PURE__*/ new WeakMap();
class ArticleSourcesBuilder extends _AbstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _class_private_field_set(this, _nodes3, nodes.map(_Builderutils.mapBuildArg));
        return this;
    }
    hidden(...hidden) {
        _class_private_field_set(this, _hidden1, hidden.map(_Builderutils.mapBuildArg));
        return this;
    }
    build() {
        return {
            nodes: _class_private_field_get(this, _nodes3),
            hidden: _class_private_field_get(this, _hidden1)
        };
    }
    constructor(...args){
        super(...args);
        _class_private_field_init(this, _nodes3, {
            writable: true,
            value: []
        });
        _class_private_field_init(this, _hidden1, {
            writable: true,
            value: []
        });
    }
}
