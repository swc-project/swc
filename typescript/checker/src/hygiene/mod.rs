use fxhash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, VisitMut, VisitMutWith};

/// This *colors* type parameters. After this pass, two type parameter declared
/// in different function will be treated as not same.
pub fn colorizer() -> impl 'static + swc_ecma_visit::Fold {
    as_folder(Colorizer {
        scope: Scope {
            parent: None,
            mark: Mark::root(),
            params: Default::default(),
        },
    })
}

#[derive(Debug)]
struct Colorizer<'a> {
    scope: Scope<'a>,
}

#[derive(Debug, Clone)]
struct Scope<'a> {
    /// Parent scope of this scope
    parent: Option<&'a Scope<'a>>,
    mark: Mark,
    params: FxHashSet<JsWord>,
}

impl<'a> Scope<'a> {
    pub fn new(parent: Option<&'a Scope<'a>>, mark: Mark, params: FxHashSet<JsWord>) -> Self {
        Scope {
            parent,
            mark,
            params,
        }
    }

    fn mark_for(&self, sym: &JsWord) -> Option<Mark> {
        if self.params.contains(sym) {
            return Some(self.mark);
        }

        self.parent.and_then(|parent| parent.mark_for(sym))
    }
}

impl<'a> Colorizer<'a> {
    fn new(scope: Scope<'a>) -> Self {
        Colorizer { scope }
    }
}

impl VisitMut for Colorizer<'_> {
    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        node.name.visit_mut_with(self);
        node.init.visit_mut_with(self);
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        let params = extract_type_params(f.type_params.as_ref());

        let child_mark = Mark::fresh(self.scope.mark);
        let mut child = Colorizer::new(Scope::new(Some(&self.scope), child_mark, params));

        f.type_params.visit_mut_with(&mut child);
        f.params.visit_mut_with(&mut child);
        f.body.visit_mut_with(&mut child);
        f.return_type.visit_mut_with(&mut child);
    }

    fn visit_mut_arrow_expr(&mut self, f: &mut ArrowExpr) {
        let params = extract_type_params(f.type_params.as_ref());

        let child_mark = Mark::fresh(self.scope.mark);
        let mut child = Colorizer::new(Scope::new(Some(&self.scope), child_mark, params));

        f.type_params.visit_mut_with(&mut child);
        f.params.visit_mut_with(&mut child);
        f.body.visit_mut_with(&mut child);
        f.return_type.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_fn_type(&mut self, ty: &mut TsFnType) {
        let child_params = {
            let params = extract_type_params(ty.type_params.as_ref());

            let child_mark = Mark::fresh(self.scope.mark);
            let mut child = Colorizer::new(Scope::new(Some(&self.scope), child_mark, params));

            ty.type_params.visit_mut_with(&mut child);
            ty.params.visit_mut_with(&mut child);
            ty.type_ann.visit_mut_with(&mut child);

            child.scope.params
        };

        self.scope.params.extend(child_params);
    }

    fn visit_mut_ts_type_ref(&mut self, mut r: &mut TsTypeRef) {
        if r.type_params.is_some() {
            r.visit_mut_children_with(self);
            return;
        }

        fn apply(scope: &Scope, mut q: &mut TsQualifiedName) {
            match q.left {
                TsEntityName::TsQualifiedName(ref mut q) => apply(scope, q),
                TsEntityName::Ident(ref mut i) => {
                    if i.span.ctxt() == SyntaxContext::empty() {
                        if let Some(mark) = scope.mark_for(&i.sym) {
                            i.span = i.span.apply_mark(mark);
                        }
                    }
                }
            }
        }

        match r.type_name {
            TsEntityName::TsQualifiedName(ref mut q) => apply(&self.scope, q),
            TsEntityName::Ident(ref mut i) => {
                if i.span.ctxt() == SyntaxContext::empty() {
                    if let Some(mark) = self.scope.mark_for(&i.sym) {
                        i.span = i.span.apply_mark(mark);
                    }
                }
            }
        }
    }

    fn visit_mut_ts_type_param(&mut self, param: &mut TsTypeParam) {
        if param.name.span.ctxt() == SyntaxContext::empty() {
            if let Some(mark) = self.scope.mark_for(&param.name.sym) {
                param.name.span = param.name.span.apply_mark(mark);
            }
        }

        param.default.visit_mut_with(self);
        param.constraint.visit_mut_with(self);
    }

    fn visit_mut_ts_type_alias_decl(&mut self, d: &mut TsTypeAliasDecl) {
        let child_params = {
            let params = extract_type_params(d.type_params.as_ref());

            let child_mark = Mark::fresh(self.scope.mark);
            let mut child = Colorizer::new(Scope::new(Some(&self.scope), child_mark, params));

            d.type_params.visit_mut_with(&mut child);
            d.type_ann.visit_mut_with(&mut child);

            child.scope.params
        };

        self.scope.params.extend(child_params);
    }
}

fn extract_type_params(decl: Option<&TsTypeParamDecl>) -> FxHashSet<JsWord> {
    let decl = match decl {
        None => return Default::default(),
        Some(decl) => decl,
    };

    let mut ids = FxHashSet::default();

    for p in &decl.params {
        ids.insert(p.name.sym.clone());
    }

    ids
}
