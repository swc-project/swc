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
