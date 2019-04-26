use crate::{module_decl::ModuleDecl, stmt::Stmt};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node("Module")]
pub struct Module {
    pub span: Span,

    pub body: Vec<ModuleItem>,

    #[serde(
        default,
        rename = "interpreter",
        skip_serializing_if = "Option::is_none"
    )]
    pub shebang: Option<JsWord>,
}

#[ast_node("Script")]
pub struct Script {
    pub span: Span,

    pub body: Vec<Stmt>,

    #[serde(
        default,
        rename = "interpreter",
        skip_serializing_if = "Option::is_none"
    )]
    pub shebang: Option<JsWord>,
}

#[ast_node]
pub enum ModuleItem {
    #[tag("ImportDeclaration")]
    #[tag("ExportDeclaration")]
    #[tag("ExportNamedDeclaration")]
    #[tag("ExportDefaultDeclaration")]
    #[tag("ExportDefaultExpression")]
    #[tag("ExportAllDeclaration")]
    #[tag("TsImportEqualsDeclaration")]
    #[tag("TsExportAssignment")]
    #[tag("TsNamespaceExportDeclaration")]
    ModuleDecl(ModuleDecl),
    #[tag("*")]
    Stmt(Stmt),
}

// This test ensures that FnDecl can be deserialized if type field is present
test_de!(
    asi,
    ModuleItem,
    r#"{
      "type": "FunctionDeclaration",
      "identifier": {
        "type": "Identifier",
        "span": {
          "start": 9,
          "end": 10,
          "ctxt": 0
        },
        "value": "x",
        "optional": false
      },
      "declare": false,
      "params": [],
      "span": {
        "start": 0,
        "end": 34,
        "ctxt": 0
      },
      "body": {
        "type": "BlockStatement",
        "span": {
          "start": 13,
          "end": 34,
          "ctxt": 0
        },
        "stmts": [
          {
            "type": "VariableDeclaration",
            "span": {
              "start": 17,
              "end": 22,
              "ctxt": 0
            },
            "kind": "let",
            "declare": false,
            "declarations": [
              {
                "type": "VariableDeclarator",
                "span": {
                  "start": 21,
                  "end": 22,
                  "ctxt": 0
                },
                "id": {
                  "type": "Identifier",
                  "span": {
                    "start": 21,
                    "end": 22,
                    "ctxt": 0
                  },
                  "value": "x",
                  "optional": false
                },
                "definite": false
              }
            ]
          },
          {
            "type": "JSXElement",
            "span": {
              "start": 25,
              "end": 32,
              "ctxt": 0
            },
            "opening": {
              "type": "JSXOpeningElement",
              "name": {
                "type": "Identifier",
                "span": {
                  "start": 26,
                  "end": 29,
                  "ctxt": 0
                },
                "value": "div",
                "optional": false
              },
              "span": {
                "start": 26,
                "end": 32,
                "ctxt": 0
              },
              "selfClosing": true
            },
            "children": [],
            "closing": null
          }
        ]
      },
      "generator": false,
      "async": false
    }"#
);
