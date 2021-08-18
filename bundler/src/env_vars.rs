//! Helper for transforming environment variables to AST nodes.
use fxhash::FxHashMap;

use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    BindingIdent, Decl, Expr, Ident, KeyValueProp, Lit, Module, ModuleItem, ObjectLit, Pat, Prop,
    PropName, PropOrSpread, Stmt, Str, StrKind, VarDecl, VarDeclKind, VarDeclarator,
};
use swc_ecma_visit::Fold;

#[derive(Debug, Clone, Eq, PartialEq)]
enum Entry {
    Leaf(String),
    Branch(FxHashMap<String, Entry>),
}

impl Entry {
    fn add_entry(&mut self, name: String, branch: Entry) -> bool {
        if let Entry::Branch(map) = self {
            map.insert(name, branch);
            return true;
        }
        false
    }

    fn entry_mut(&mut self, name: &str) -> Option<&mut Entry> {
        if let Entry::Branch(map) = self {
            return map.get_mut(name);
        }
        None
    }

    #[cfg(test)]
    fn entry(&self, name: &str) -> Option<&Entry> {
        if let Entry::Branch(map) = self {
            return map.get(name);
        }
        None
    }
}

impl Default for Entry {
    fn default() -> Self {
        Self::Branch(Default::default())
    }
}

/// Represents a collection of environment variables.
#[derive(Debug)]
pub struct EnvironmentGlobals {
    root: Entry,
    kind: VarDeclKind,
}

impl Default for EnvironmentGlobals {
    fn default() -> Self {
        Self {
            root: Default::default(),
            kind: VarDeclKind::Var,
        }
    }
}

impl EnvironmentGlobals {
    /// Transform the tree into AST nodes.
    pub fn ast(&self) -> Vec<VarDecl> {
        let mut out = Vec::new();

        if let Entry::Branch(root_map) = &self.root {
            for (k, v) in root_map {
                out.push(VarDecl {
                    span: DUMMY_SP,
                    kind: self.kind,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        definite: false,
                        name: Pat::Ident(BindingIdent {
                            id: Ident {
                                span: DUMMY_SP,
                                sym: JsWord::from(k.to_string()),
                                optional: false,
                            },
                            type_ann: None,
                        }),
                        init: Some({
                            match v {
                                Entry::Leaf(value) => {
                                    Box::new(Expr::Lit(Lit::Str(self.into_string(value.into()))))
                                }
                                Entry::Branch(_) => {
                                    Box::new(Expr::Object(self.into_object(v.clone())))
                                }
                            }
                        }),
                    }],
                });
            }
        }

        out
    }

    fn into_string(&self, value: String) -> Str {
        Str {
            span: DUMMY_SP,
            has_escape: value.contains("\n"),
            value: JsWord::from(value),
            kind: StrKind::Normal {
                contains_quote: true,
            },
        }
    }

    fn into_object(&self, entry: Entry) -> ObjectLit {
        let mut target = ObjectLit {
            span: DUMMY_SP,
            props: vec![],
        };

        if let Entry::Branch(map) = entry {
            for (k, v) in map {
                let prop = PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Str(self.into_string(k)),
                    value: {
                        match v {
                            Entry::Leaf(value) => {
                                Box::new(Expr::Lit(Lit::Str(self.into_string(value))))
                            }
                            Entry::Branch(_) => Box::new(Expr::Object(self.into_object(v))),
                        }
                    },
                })));
                target.props.push(prop);
            }
        }
        target
    }

    /// Get a globals fold.
    pub fn globals(&self) -> impl Fold {
        GlobalsFold { nodes: self.ast() }
    }
}

/// Convert the key/value pairs to a tree structure to handle
/// dot-delimited key names.
impl From<FxHashMap<String, String>> for EnvironmentGlobals {
    fn from(env: FxHashMap<String, String>) -> Self {
        let vars: Vec<(Vec<String>, String)> = env
            .into_iter()
            .map(|(k, v)| (k.split(".").map(|s| s.into()).collect(), v))
            .collect();

        let root: Entry = Default::default();
        let root = vars.into_iter().fold(root, |mut acc, doc| {
            let (keys, value) = doc;
            let len = keys.len();
            let mut it = keys.into_iter().enumerate();
            let (_, first) = it.next().unwrap();
            let mut current = if let Some(branch) = acc.entry_mut(&first) {
                branch
            } else {
                if len > 1 {
                    acc.add_entry(first.clone(), Default::default());
                    acc.entry_mut(&first).unwrap()
                } else {
                    acc.add_entry(first.clone(), Entry::Leaf(value.clone()));
                    &mut acc
                }
            };
            // Handle deep branches
            for (i, key) in it {
                if i < (len - 1) {
                    if let Entry::Branch(map) = current {
                        current = map.entry(key).or_default();
                    }
                } else {
                    current.add_entry(key, Entry::Leaf(value.clone()));
                }
            }
            acc
        });

        Self {
            root,
            kind: VarDeclKind::Var,
        }
    }
}

struct GlobalsFold {
    nodes: Vec<VarDecl>,
}

impl Fold for GlobalsFold {
    fn fold_module(&mut self, mut n: Module) -> Module {
        for node in self.nodes.iter().rev() {
            let decl = node.clone();
            n.body
                .insert(0, ModuleItem::Stmt(Stmt::Decl(Decl::Var(decl))));
        }
        n
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    use swc_common::{sync::Lrc, SourceMap, DUMMY_SP};
    use swc_ecma_codegen::{text_writer::JsWriter, Emitter, Node};
    use swc_ecma_visit::FoldWith;

    fn code(node: &dyn Node) -> String {
        let mut buf = vec![];
        let cm = Lrc::new(SourceMap::default());

        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: cm.clone(),
                comments: None,
                wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
            };

            node.emit_with(&mut emitter).unwrap();
        }

        String::from_utf8(buf).unwrap()
    }

    fn source() -> FxHashMap<String, String> {
        let mut src: FxHashMap<String, String> = Default::default();
        src.insert("API".into(), "http://localhost:3000".into());
        src.insert("process.env.FOO".into(), "BAR".into());
        src.insert("process.env.BAR".into(), "QUX".into());
        src.insert("process.alt.QUX".into(), "BAZ".into());
        src
    }

    #[test]
    fn env_globals_tree() {
        let src = source();

        let env = EnvironmentGlobals::from(src);
        if let Entry::Branch(map) = &env.root {
            assert!(map.contains_key("process"));
            assert!(map.contains_key("API"));

            assert_eq!(
                &Entry::Leaf("http://localhost:3000".into()),
                map.get("API").unwrap()
            );

            let process = map.get("process").unwrap();
            let env = process.entry("env").unwrap();
            let alt = process.entry("alt").unwrap();

            if let Entry::Branch(env) = env {
                assert_eq!(&Entry::Leaf("BAR".into()), env.get("FOO").unwrap());
                assert_eq!(&Entry::Leaf("QUX".into()), env.get("BAR").unwrap());
            } else {
                panic!("process.env should be a branch");
            }

            if let Entry::Branch(alt) = alt {
                assert_eq!(&Entry::Leaf("BAZ".into()), alt.get("QUX").unwrap());
            } else {
                panic!("process.alt should be a branch");
            }
        }
    }

    #[test]
    fn env_globals_ast() {
        let src = source();
        let env = EnvironmentGlobals::from(src);

        let expected = r#"var process = {
    "alt": {
        "QUX": "BAZ"
    },
    "env": {
        "FOO": "BAR",
        "BAR": "QUX"
    }
};
var API = "http://localhost:3000";
"#;

        let mut module = Module {
            span: DUMMY_SP,
            body: vec![],
            shebang: None,
        };

        module = module.fold_with(&mut env.globals());

        let result = code(&module);
        assert_eq!(expected, result);
    }
}
