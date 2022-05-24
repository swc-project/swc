"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
    node: true,
    create: true,
    trustBox: true,
    opener: true,
    stage: true,
    header: true,
    source: true,
    sources: true,
    seq: true
};
exports.seq = exports.sources = exports.source = exports.header = exports.stage = exports.opener = exports.trustBox = exports.create = exports.node = void 0;
var _class_private_field_get = require("@swc/helpers/lib/_class_private_field_get.js").default;
var _class_private_field_init = require("@swc/helpers/lib/_class_private_field_init.js").default;
var _class_private_field_set = require("@swc/helpers/lib/_class_private_field_set.js").default;
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _abstractBuilders = require("./AbstractBuilders");
var _builderUtils = require("./Builder.utils");
var _elementBuilder = require("./ElementBuilder");
var _node = _interop_require_wildcard(require("./BodyNodesBuilder"));
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
const create = ()=>new BodyBuilder();
exports.create = create;
const trustBox = ()=>new TrustBoxBuilder();
exports.trustBox = trustBox;
const opener = ()=>new OpenerBuilder();
exports.opener = opener;
const stage = ()=>new BodyStageBuilder();
exports.stage = stage;
const header = ()=>new BodyHeaderBuilder();
exports.header = header;
const source = (nodes = [])=>new ArticleSourceBuilder(...nodes);
exports.source = source;
const sources = ()=>new ArticleSourcesBuilder();
exports.sources = sources;
const seq = {
    stage: ()=>new BodyStageSeqBuilder(),
    source: ()=>new ArticleSourceSeqBuilder()
};
exports.seq = seq;
var _stages = /*#__PURE__*/ new WeakMap(), _trustBox = /*#__PURE__*/ new WeakMap(), _disclaimer = /*#__PURE__*/ new WeakMap(), _articleSources = /*#__PURE__*/ new WeakMap();
class BodyBuilder extends _abstractBuilders.AbstractBuilder {
    stages(...stages) {
        _class_private_field_set(this, _stages, stages.map(_builderUtils.mapBuildArg));
        return this;
    }
    trustBox(trustBox1) {
        _class_private_field_set(this, _trustBox, (0, _builderUtils).mapBuildArg(trustBox1));
        return this;
    }
    disclaimer(disclaimer) {
        _class_private_field_set(this, _disclaimer, disclaimer?.map(_builderUtils.mapBuildArg));
        return this;
    }
    articleSources(articleSources) {
        _class_private_field_set(this, _articleSources, (0, _builderUtils).mapBuildArg(articleSources));
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
class TrustBoxBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(hidden) {
        _class_private_field_set(this, _hidden, hidden.map(_builderUtils.mapBuildArg));
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
class OpenerBuilder extends _abstractBuilders.AbstractBuilder {
    element(element) {
        _class_private_field_set(this, _element, (0, _builderUtils).mapBuildArg(element));
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
            value: (0, _elementBuilder).image().build()
        });
    }
}
var _nodes1 = /*#__PURE__*/ new WeakMap(), _header = /*#__PURE__*/ new WeakMap(), _companions = /*#__PURE__*/ new WeakMap(), _commercialsEndOfStage = /*#__PURE__*/ new WeakMap();
class BodyStageSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes1, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    header(header1) {
        _class_private_field_set(this, _header, (0, _builderUtils).mapBuildArgs(header1 ?? []));
        return this;
    }
    companions(companions) {
        _class_private_field_set(this, _companions, companions.map(_builderUtils.mapBuildArgs));
        return this;
    }
    commercialsEndOfStage(commercialsEndOfStage) {
        _class_private_field_set(this, _commercialsEndOfStage, commercialsEndOfStage.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        return {
            id: (0, _builderUtils).hash("bodyStage", _class_private_field_get(this, _nodes1), _class_private_field_get(this, _companions), _class_private_field_get(this, _commercialsEndOfStage), _class_private_field_get(this, _header)),
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
class BodyStageBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(nodes) {
        _class_private_field_get(this, _seqBuilder).nodes([
            nodes
        ]);
        return this;
    }
    header(header2) {
        if (header2) {
            _class_private_field_get(this, _seqBuilder).header([
                header2
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
class BodyHeaderBuilder extends _abstractBuilders.AbstractBuilder {
    variant(variant) {
        _class_private_field_set(this, _variant, variant);
        return this;
    }
    opener(opener1) {
        _class_private_field_set(this, _opener, (0, _builderUtils).mapBuildArg(opener1));
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
class ArticleSourceSeqBuilder extends _abstractBuilders.AbstractSeqBuilder {
    nodes(nodes) {
        _class_private_field_set(this, _nodes2, nodes.map(_builderUtils.mapBuildArgs));
        return this;
    }
    buildListItem(seqNextElement) {
        const id = (0, _builderUtils).hash("article-source", _class_private_field_get(this, _nodes2));
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
class ArticleSourceBuilder extends _abstractBuilders.AbstractBuilder {
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
class ArticleSourcesBuilder extends _abstractBuilders.AbstractBuilder {
    nodes(...nodes) {
        _class_private_field_set(this, _nodes3, nodes.map(_builderUtils.mapBuildArg));
        return this;
    }
    hidden(...hidden) {
        _class_private_field_set(this, _hidden1, hidden.map(_builderUtils.mapBuildArg));
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
exports.node = _node;
