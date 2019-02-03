use crate::util::ExprFactory;
use ast::*;
use fxhash::{FxBuildHasher, FxHashMap, FxHashSet};
use swc_atoms::JsWord;
use swc_common::{Span, SyntaxContext, DUMMY_SP};

#[derive(Clone, Default)]
pub(super) struct Scope {
    /// Map from source file to ident
    ///
    /// e.g.
    ///
    ///  - `import 'foo'`
    ///   -> `{'foo': None}`
    ///
    ///  - `import { foo } from 'bar';`
    ///   -> `{'bar': Some(_bar)}`
    ///
    ///  - `import * as bar1 from 'bar';`
    ///   -> `{'bar': Some(bar1)}`
    pub imports: IndexMap<JsWord, Option<(JsWord, Span)>>,
    ///
    /// - `true` is wildcard (`_interopRequireWildcard`)
    /// - `false` is default (`_interopRequireDefault`)
    pub import_types: FxHashMap<JsWord, bool>,

    /// Map from imported ident to (source file, property name).
    ///
    /// e.g.
    ///  - `import { foo } from 'bar';`
    ///   -> `{foo: ('bar', foo)}`
    ///
    ///  - `import foo from 'bar';`
    ///   -> `{foo: ('bar', default)}`
    pub idents: FxHashMap<(JsWord, SyntaxContext), (JsWord, JsWord)>,

    /// Declared variables except const.
    pub declared_vars: Vec<(JsWord, SyntaxContext)>,

    /// Maps of exported variables.
    ///
    ///
    /// e.g.
    ///  - `export { a }`
    ///   -> `{ a: [a] }`
    ///
    ///  - `export { a as b }`
    ///   -> `{ a: [b] }`
    pub exported_vars: FxHashMap<(JsWord, SyntaxContext), Vec<(JsWord, SyntaxContext)>>,

    /// This is required to handle
    /// `export * from 'foo';`
    pub lazy_blacklist: FxHashSet<JsWord>,
}

impl Scope {
    pub fn insert_import(&mut self, mut import: ImportDecl) {
        if import.specifiers.is_empty() {
            // import 'foo';
            //   -> require('foo');
            self.imports.entry(import.src.value.clone()).or_insert(None);
        } else if import.specifiers.len() == 1
            && match import.specifiers[0] {
                ImportSpecifier::Namespace(..) => true,
                _ => false,
            }
        {
            // import * as foo from 'src';
            let specifier = match import.specifiers.pop().unwrap() {
                ImportSpecifier::Namespace(ns) => ns,
                _ => unreachable!(),
            };

            self.idents.insert(
                (specifier.local.sym.clone(), specifier.local.span.ctxt()),
                (import.src.value.clone(), "".into()),
            );

            // Override symbol if one exists
            self.imports
                .entry(import.src.value.clone())
                .and_modify(|v| match *v {
                    Some(ref mut v) => v.0 = specifier.local.sym.clone(),
                    None => *v = Some((specifier.local.sym.clone(), specifier.local.span)),
                })
                .or_insert_with(|| Some((specifier.local.sym.clone(), specifier.local.span)));

            self.import_types.insert(import.src.value, true);
        } else {
            self.imports
                .entry(import.src.value.clone())
                .or_insert_with(|| Some((local_name_for_src(&import.src), import.src.span)));

            for s in import.specifiers {
                match s {
                    ImportSpecifier::Namespace(..) => unreachable!(
                        "import * as foo cannot be used with other type of import specifiers"
                    ),
                    ImportSpecifier::Default(i) => {
                        self.idents.insert(
                            (i.local.sym.clone(), i.local.span.ctxt()),
                            (import.src.value.clone(), js_word!("default")),
                        );
                        self.import_types
                            .entry(import.src.value.clone())
                            .or_insert(false);
                    }
                    ImportSpecifier::Specific(i) => {
                        let ImportSpecific {
                            local, imported, ..
                        } = i;
                        let name = imported.map(|i| i.sym).unwrap_or_else(|| local.sym.clone());
                        let is_default = name == js_word!("default");

                        self.idents.insert(
                            (local.sym.clone(), local.span.ctxt()),
                            (import.src.value.clone(), name),
                        );

                        if is_default {
                            self.import_types
                                .entry(import.src.value.clone())
                                .or_insert(false);
                        } else {
                            self.import_types
                                .entry(import.src.value.clone())
                                .and_modify(|v| *v = true);
                        }
                    }
                }
            }
        }
    }
}

pub(super) type IndexMap<K, V> = indexmap::IndexMap<K, V, FxBuildHasher>;

pub(super) fn make_require_call(src: JsWord) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("require").as_callee(),
        args: vec![Lit::Str(Str {
            span: DUMMY_SP,
            value: src,
            has_escape: false,
        })
        .as_arg()],

        type_args: Default::default(),
    })
}

pub(super) fn local_name_for_src(src: &Str) -> JsWord {
    if !src.value.contains("/") {
        return format!("_{}", src.value).into();
    }

    return format!("_{}", src.value.split("/").last().unwrap()).into();
}

pub(super) fn define_property(args: Vec<ExprOrSpread>) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: member_expr!(DUMMY_SP, Object.defineProperty).as_callee(),
        args,

        type_args: Default::default(),
    })
}

/// Creates
///
///```js
/// 
///  Object.defineProperty(exports, '__esModule', {
///       value: true
///  });
/// ```
pub(super) fn define_es_module(exports: Ident) -> Stmt {
    Stmt::Expr(box define_property(vec![
        exports.as_arg(),
        Lit::Str(quote_str!("__esModule")).as_arg(),
        ObjectLit {
            span: DUMMY_SP,
            props: vec![PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("value")),
                value: box Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })
                .into(),
            }))],
        }
        .as_arg(),
    ]))
}

pub(super) fn use_strict() -> Stmt {
    Stmt::Expr(box Expr::Lit(Lit::Str(quote_str!("use strict"))))
}
