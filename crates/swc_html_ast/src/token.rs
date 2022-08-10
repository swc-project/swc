use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("TokenAndSpan")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TokenAndSpan {
    pub span: Span,
    pub token: Token,
}

#[ast_node]
#[derive(Eq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub struct AttributeToken {
    pub span: Span,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub name: JsWord,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub raw_name: Option<JsWord>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub value: Option<JsWord>,
    #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
    pub raw_value: Option<JsWord>,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash, serde::Serialize, serde::Deserialize, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    archive(bound(
        serialize = "__S: rkyv::ser::Serializer + rkyv::ser::ScratchSpace + \
                     rkyv::ser::SharedSerializeRegistry",
        deserialize = "__D: rkyv::de::SharedDeserializeRegistry"
    ))
)]
pub enum Token {
    Doctype {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        // Name
        name: Option<JsWord>,
        // Is force quirks?
        force_quirks: bool,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        // Public identifier
        public_id: Option<JsWord>,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        // System identifier
        system_id: Option<JsWord>,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        // Raw value
        raw: Option<JsWord>,
    },
    StartTag {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        tag_name: JsWord,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        raw_tag_name: Option<JsWord>,
        is_self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    EndTag {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        tag_name: JsWord,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        raw_tag_name: Option<JsWord>,
        is_self_closing: bool,
        attributes: Vec<AttributeToken>,
    },
    Comment {
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        data: JsWord,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        raw: JsWord,
    },
    Character {
        value: char,
        #[cfg_attr(feature = "rkyv", with(swc_atoms::EncodeJsWord))]
        raw: Option<JsWord>,
    },
    Eof,
}
