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
        super(...args), _class_private_field_init._(this, _stages, {
            writable: true,
            value: []
        }), _class_private_field_init._(this, _trustBox, {
            writable: true,
            value: undefined
        }), _class_private_field_init._(this, _disclaimer, {
            writable: true,
            value: undefined
        }), _class_private_field_init._(this, _articleSources, {
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
        super(...args), _class_private_field_init._(this, _nodes, {
            writable: true,
            value: []
        }), _class_private_field_init._(this, _hidden, {
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
        super(...args), _class_private_field_init._(this, _element, {
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
        super(...args), _class_private_field_init._(this, _nodes1, {
            writable: true,
            value: []
        }), _class_private_field_init._(this, _header, {
            writable: true,
            value: undefined
        }), _class_private_field_init._(this, _companions, {
            writable: true,
            value: []
        }), _class_private_field_init._(this, _commercialsEndOfStage, {
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
        super(...args), _class_private_field_init._(this, _seqBuilder, {
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
        super(...args), _class_private_field_init._(this, _variant, {
            writable: true,
            value: "full"
        }), _class_private_field_init._(this, _opener, {
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
        super(...args), _class_private_field_init._(this, _nodes2, {
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
        super(), _class_private_field_init._(this, _seqBuilder1, {
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
        super(...args), _class_private_field_init._(this, _nodes3, {
            writable: true,
            value: []
        }), _class_private_field_init._(this, _hidden1, {
            writable: true,
            value: []
        });
    }
}
