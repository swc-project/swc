use std::collections::HashMap;
use swc_atoms::{js_word, JsWord};
use swc_common::comments::Comments;
use swc_ecma_ast::*;
use swc_ecma_utils::{id, Id};
use swc_ecma_visit::{Fold, FoldWith};

#[cfg(test)]
mod tests;

/// This pass adds a /*#__PURE__#/ annotation to calls to known pure top-level
/// React methods, so that terser and other minifiers can safely remove them
/// during dead code elimination.
/// See https://reactjs.org/docs/react-api.html
pub fn pure_annotations<C>(comments: Option<C>) -> impl Fold
where
    C: Comments,
{
    PureAnnotations {
        imports: HashMap::new(),
        comments,
    }
}

struct PureAnnotations<C>
where
    C: Comments,
{
    imports: HashMap<Id, (JsWord, JsWord)>,
    comments: Option<C>,
}

impl<C> Fold for PureAnnotations<C>
where
    C: Comments,
{
    fn fold_module(&mut self, module: Module) -> Module {
        // Pass 1: collect imports
        for item in &module.body {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    let src_str = import.src.value.to_string();
                    if src_str != "react" && src_str != "react-dom" {
                        continue;
                    }

                    for specifier in &import.specifiers {
                        let src = import.src.value.clone();
                        match specifier {
                            ImportSpecifier::Named(named) => {
                                let imported = match &named.imported {
                                    Some(imported) => imported.sym.clone(),
                                    None => named.local.sym.clone(),
                                };
                                self.imports.insert(id(&named.local), (src, imported));
                            }
                            ImportSpecifier::Default(default) => {
                                self.imports
                                    .insert(id(&default.local), (src, js_word!("default")));
                            }
                            ImportSpecifier::Namespace(ns) => {
                                self.imports.insert(id(&ns.local), (src, "*".into()));
                            }
                        }
                    }
                }
                _ => {}
            }
        }

        // Pass 2: add pure annotations.
        module.fold_children_with(self)
    }

    fn fold_call_expr(&mut self, call: CallExpr) -> CallExpr {
        let is_react_call = match &call.callee {
            ExprOrSuper::Expr(expr) => match &**expr {
                Expr::Ident(ident) => {
                    if let Some((src, specifier)) = self.imports.get(&id(&ident)) {
                        is_pure(src, specifier)
                    } else {
                        false
                    }
                }
                Expr::Member(member) => match &member.obj {
                    ExprOrSuper::Expr(expr) => match &**expr {
                        Expr::Ident(ident) => {
                            if let Some((src, specifier)) = self.imports.get(&id(&ident)) {
                                let specifier_str = specifier.to_string();
                                if specifier_str == "default" || specifier_str == "*" {
                                    match &*member.prop {
                                        Expr::Ident(ident) => is_pure(src, &ident.sym),
                                        _ => false,
                                    }
                                } else {
                                    false
                                }
                            } else {
                                false
                            }
                        }
                        _ => false,
                    },
                    _ => false,
                },
                _ => false,
            },
            _ => false,
        };

        if is_react_call {
            if let Some(comments) = &self.comments {
                comments.add_pure_comment(call.span.lo);
            }
        }

        call.fold_children_with(self)
    }
}

fn is_pure(src: &JsWord, specifier: &JsWord) -> bool {
    match src.to_string().as_str() {
        "react" => match specifier.to_string().as_str() {
            "cloneElement" | "createContext" | "createElement" | "createFactory" | "createRef"
            | "forwardRef" | "isValidElement" | "memo" | "lazy" => true,
            _ => false,
        },
        "react-dom" => match specifier.to_string().as_str() {
            "createPortal" => true,
            _ => false,
        },
        _ => false,
    }
}
