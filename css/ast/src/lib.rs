use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node]
pub struct AnPlusB {
    pub span: Span,
    pub a: Option<JsWord>,
    pub b: Option<JsWord>,
}

#[ast_node]
pub struct AtRule {
    pub span: Span,
    pub name: JsWord,
    //     prelude: <AtrulePrelude> | <Raw> | null,
    pub block: Block,
}

#[ast_node]
pub enum AtrulePrelude {}

#[ast_node]
pub struct AttributeSelector {
    pub span: Span,
    pub name: Id,

    pub matcher: Option<JsWord>,
    /// <String> | <Identifier> | null
    pub value: AttributeSelectorValue,

    pub flags: Option<JsWord>,
}

#[ast_node]
pub struct Block {
    pub span: Span,
    pub children: Vec<BlockItem>,
}

#[ast_node]
pub enum BlockItem {}

#[ast_node]
pub struct Brackets {
    pub span: Span,
}

#[ast_node]
pub struct ClassSelector {
    pub span: Span,
    pub name: JsWord,
}

#[ast_node]
pub struct Combinator {
    pub span: Span,
    pub name: JsWord,
}

#[ast_node]
pub struct Declaration {
    pub span: Span,
    // important: Boolean | String,
    pub property: DeclarationProperty,
    // value: <Value> | <Raw>
}

#[ast_node]
pub struct Dimension {
    pub span: Span,
    pub value: JsWord,
    pub unit: JsWord,
}

#[ast_node]
pub struct Function {
    pub span: Span,
    pub name: JsWord,
    pub children: Vec<FunctionChild>,
}

#[ast_node]
pub struct Hash {
    pub span: Span,
    pub value: JsWord,
}

#[ast_node]
pub struct IdSelector {
    pub span: Span,
    pub name: JsWord,
}

#[ast_node("Identifier")]
pub struct Id {
    pub span: Span,
    pub name: JsWord,
}

#[ast_node]
pub struct MediaFeature {
    pub span: Span,
    pub name: JsWord,
    pub value: MediaFeatureValue,
}

#[ast_node]
pub struct MediaQuery {
    pub span: Span,
    pub children: Vec<MediaQueryChildren>,
}

#[ast_node]
pub struct Nth {
    pub span: Span,
    pub nth: NthValue,

    pub selector: Vec<Selector>,
}

#[ast_node]
pub enum NthValue {
    #[tag("AnPlusB")]
    AnPlusB(AnPlusB),
    #[tag("Identifier")]
    Id(Id),
}

#[ast_node]
pub struct Number {
    pub span: Span,
    pub value: JsWord,
}

#[ast_node]
pub struct Operator {
    pub span: Span,
    pub value: JsWord,
}

#[ast_node]
pub struct Paren {
    pub span: Span,
    pub children: Vec<ParenChild>,
}

#[ast_node]
pub struct Percentage {
    pub span: Span,
    pub value: JsWord,
}

#[ast_node]
pub struct PseudoClassSelector {
    pub span: Span,
    pub name: JsWord,
    pub children: Vec<PseudoClassSelectorChild>,
}

// {
//     type: "PseudoClassSelector",
//     name: String,
//     children: List | null
// }

// {
//     type: "PseudoElementSelector",
//     name: String,
//     children: List | null
// }

// {
//     type: "Ratio",
//     left: String,
//     right: String
// }

// {
//     type: "Raw",
//     value: String
// }

// {
//     type: "Rule",
//     prelude: <SelectorList> | <Raw>,
//     block: <Block>
// }

// {
//     type: "Selector",
//     children: List
//}

// {
//     type: "StyleSheet",
//     children: List
// }

// {
//     type: "TypeSelector",
//     name: String
// }

// {
//     type: "Url",
//     value: <String> | <Raw>
// }

// {
//     type: "Value",
//     children: List
// }
