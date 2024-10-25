use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, comments::Comments, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

#[cfg(test)]
mod tests;

/// A pass to add a /*#__PURE__#/ annotation to calls to known pure calls.
///
/// This pass adds a /*#__PURE__#/ annotation to calls to known pure top-level
/// React methods, so that terser and other minifiers can safely remove them
/// during dead code elimination.
/// See https://reactjs.org/docs/react-api.html
pub fn pure_annotations<C>(comments: Option<C>) -> impl Pass
where
    C: Comments,
{
    visit_mut_pass(PureAnnotations {
        imports: Default::default(),
        comments,
    })
}

struct PureAnnotations<C>
where
    C: Comments,
{
    imports: AHashMap<Id, (JsWord, JsWord)>,
    comments: Option<C>,
}

impl<C> VisitMut for PureAnnotations<C>
where
    C: Comments,
{
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        // Pass 1: collect imports
        for item in &module.body {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                let src_str = &*import.src.value;
                if src_str != "react" && src_str != "react-dom" {
                    continue;
                }

                for specifier in &import.specifiers {
                    let src = import.src.value.clone();
                    match specifier {
                        ImportSpecifier::Named(named) => {
                            let imported = match &named.imported {
                                Some(ModuleExportName::Ident(imported)) => imported.sym.clone(),
                                Some(ModuleExportName::Str(..)) => named.local.sym.clone(),
                                None => named.local.sym.clone(),
                            };
                            self.imports.insert(named.local.to_id(), (src, imported));
                        }
                        ImportSpecifier::Default(default) => {
                            self.imports
                                .insert(default.local.to_id(), (src, "default".into()));
                        }
                        ImportSpecifier::Namespace(ns) => {
                            self.imports.insert(ns.local.to_id(), (src, "*".into()));
                        }
                    }
                }
            }
        }

        if self.imports.is_empty() {
            return;
        }

        // Pass 2: add pure annotations.
        module.visit_mut_children_with(self);
    }

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        let is_react_call = match &call.callee {
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(ident) => {
                    if let Some((src, specifier)) = self.imports.get(&ident.to_id()) {
                        is_pure(src, specifier)
                    } else {
                        false
                    }
                }
                Expr::Member(member) => match &*member.obj {
                    Expr::Ident(ident) => {
                        if let Some((src, specifier)) = self.imports.get(&ident.to_id()) {
                            if &**specifier == "default" || &**specifier == "*" {
                                match &member.prop {
                                    MemberProp::Ident(ident) => is_pure(src, &ident.sym),
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
        };

        if is_react_call {
            if let Some(comments) = &self.comments {
                if call.span.lo.is_dummy() {
                    call.span.lo = Span::dummy_with_cmt().lo;
                }

                comments.add_pure_comment(call.span.lo);
            }
        }

        call.visit_mut_children_with(self);
    }
}

fn is_pure(src: &JsWord, specifier: &JsWord) -> bool {
    match &**src {
        "react" => matches!(
            &**specifier,
            "cloneElement"
                | "createContext"
                | "createElement"
                | "createFactory"
                | "createRef"
                | "forwardRef"
                | "isValidElement"
                | "memo"
                | "lazy"
        ),
        "react-dom" => matches!(&**specifier, "createPortal"),
        _ => false,
    }
}
