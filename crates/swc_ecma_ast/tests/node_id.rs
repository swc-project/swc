#![cfg(feature = "serde-impl")]

use serde_json::Value;
use swc_atoms::atom;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{Ident, Module, NodeId, ScopeId};

#[test]
fn module_node_id_serde_defaults_to_invalid() {
    let module = Module {
        span: DUMMY_SP,
        node_id: NodeId(7),
        body: Vec::new(),
        shebang: None,
    };

    let mut value = serde_json::to_value(&module).unwrap();
    assert_eq!(value["nodeId"], Value::from(7));

    value.as_object_mut().unwrap().remove("nodeId");
    let module: Module = serde_json::from_value(value).unwrap();
    assert_eq!(module.node_id, NodeId::INVALID);
}

#[test]
fn ident_scope_id_serde_defaults_to_invalid() {
    let mut ident = Ident::new(atom!("foo"), DUMMY_SP, SyntaxContext::empty());
    ident.scope_id = ScopeId(11);

    let mut value = serde_json::to_value(&ident).unwrap();
    assert_eq!(value["scopeId"], Value::from(11));

    value.as_object_mut().unwrap().remove("scopeId");
    let ident: Ident = serde_json::from_value(value).unwrap();
    assert_eq!(ident.scope_id, ScopeId::INVALID);
}
