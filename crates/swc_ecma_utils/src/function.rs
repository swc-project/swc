use swc_atoms::js_word;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

#[derive(Default)]
pub struct WrapperState {
    this: Option<Ident>,
    args: Option<Ident>,
}

impl WrapperState {
    pub fn to_decl(self) -> Vec<VarDeclarator> {
        let Self { this, args } = self;

        let mut decls = Vec::with_capacity(2);
        if let Some(this_id) = this {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(this_id.clone().into()),
                init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                definite: false,
            });
        }
        if let Some(id) = args {
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: Some(Box::new(Expr::Ident(Ident::new(
                    js_word!("arguments"),
                    DUMMY_SP,
                )))),
                definite: false,
            });
        }
        decls
    }
    pub fn to_stmt(self) -> Option<Stmt> {
        let decls = self.to_decl();

        if decls.is_empty() {
            None
        } else {
            Some(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls,
            })))
        }
    }
}

impl Take for WrapperState {
    fn dummy() -> Self {
        Self::default()
    }
}

pub struct FunctionWrapper<'a> {
    state: &'a mut WrapperState,
}

impl<'a> FunctionWrapper<'a> {
    pub fn new(state: &'a mut WrapperState) -> Self {
        FunctionWrapper { state }
    }
}

impl<'a> VisitMut for FunctionWrapper<'a> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Ident(id) if id.sym == js_word!("arguments") => {
                let arguments = self.state.args.get_or_insert(private_ident!("_arguments"));
                *e = Expr::Ident(arguments.clone());
            }
            Expr::This(..) => {
                let this = self.state.this.get_or_insert(private_ident!("_this"));
                *e = Expr::Ident(this.clone());
            }
            _ => e.visit_mut_children_with(self),
        }
    }

    /// Don't recurse into prop of member expression unless computed
    fn visit_mut_member_expr(&mut self, m: &mut MemberExpr) {
        if m.computed {
            m.prop.visit_mut_with(self);
        }

        m.obj.visit_mut_with(self);
    }

    /// Don't recurse into constructor
    fn visit_mut_class(&mut self, _: &mut Class) {}

    /// Don't recurse into fn
    fn visit_mut_function(&mut self, _: &mut Function) {}

    /// Don't recurse into getter/setter/method except computed key
    fn visit_mut_getter_prop(&mut self, p: &mut GetterProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }

    fn visit_mut_setter_prop(&mut self, p: &mut SetterProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }

    fn visit_mut_method_prop(&mut self, p: &mut MethodProp) {
        if p.key.is_computed() {
            p.key.visit_mut_with(self);
        }
    }
}
