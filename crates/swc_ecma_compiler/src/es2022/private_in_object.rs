use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::CompilerImpl;

#[derive(Debug)]
pub(crate) enum Mode {
    ClassExpr {
        vars: Vec<VarDeclarator>,
        init_exprs: Vec<Box<Expr>>,
    },
    ClassDecl {
        vars: Vec<VarDeclarator>,
    },
}

impl Default for Mode {
    fn default() -> Self {
        Self::ClassDecl {
            vars: Default::default(),
        }
    }
}

impl Mode {
    pub(crate) fn push_var(&mut self, n: Ident, init: Option<Box<Expr>>) {
        match self {
            Mode::ClassExpr { vars, init_exprs } => {
                vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: n.clone().into(),
                    init: None,
                    definite: Default::default(),
                });
                if let Some(init) = init {
                    init_exprs.push(
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: n.into(),
                            right: init,
                        }
                        .into(),
                    );
                }
            }
            Mode::ClassDecl { vars } => {
                vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: n.into(),
                    init,
                    definite: Default::default(),
                });
            }
        }
    }
}

#[derive(Default)]
pub(crate) struct ClassData {
    pub(crate) ident: Option<Ident>,

    pub(crate) vars: Mode,

    /// [Mark] for the current class.
    ///
    /// This is modified by the class visitor.
    pub(crate) mark: Mark,

    pub(crate) privates: FxHashSet<Atom>,

    /// Name of private methods.
    pub(crate) methods: Vec<Atom>,

    /// Name of private statics.
    pub(crate) statics: Vec<Atom>,

    pub(crate) constructor_exprs: Vec<Box<Expr>>,

    pub(crate) names_used_for_brand_checks: FxHashSet<Atom>,
}

impl CompilerImpl<'_> {
    pub(crate) fn var_name_for_brand_check(&self, n: &PrivateName, cls: &ClassData) -> Ident {
        let is_static = cls.statics.contains(&n.name);

        let span = n.span;
        let ctxt = SyntaxContext::empty().apply_mark(cls.mark);

        if !is_static && cls.methods.contains(&n.name) {
            if let Some(cls_name) = &cls.ident {
                return Ident::new(format!("_brand_check_{}", cls_name.sym).into(), span, ctxt);
            }
        }

        Ident::new(format!("_brand_check_{}", n.name).into(), span, ctxt)
    }
}

pub(crate) struct ClassAnalyzer<'a> {
    pub(crate) brand_check_names: &'a mut FxHashSet<Atom>,
    pub(crate) ignore_class: bool,
}

impl Visit for ClassAnalyzer<'_> {
    noop_visit_type!(fail);

    fn visit_bin_expr(&mut self, n: &BinExpr) {
        n.visit_children_with(self);

        if n.op == op!("in") {
            if let Expr::PrivateName(left) = &*n.left {
                self.brand_check_names.insert(left.name.clone());
            }
        }
    }

    /// Noop
    fn visit_class(&mut self, n: &Class) {
        if self.ignore_class {
            return;
        }

        n.visit_children_with(self);
    }
}
