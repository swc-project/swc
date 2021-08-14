use crate::{LazyValues, Text, Value};
use swc_common::{ast_node, Span};

#[ast_node("Property")]
pub struct Property {
    pub span: Span,
    pub name: Text,
    /// Separted by space.
    pub values: LazyValues,
    /// The span includes `!`
    pub important: Option<Span>,
}
