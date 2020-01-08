use ast::*;
use swc_atoms::JsWord;
use swc_common::{SyntaxContext, Visit, VisitWith};

pub struct VarCollector<'a> {
    pub to: &'a mut Vec<(JsWord, SyntaxContext)>,
}

impl<'a> Visit<VarDeclarator> for VarCollector<'a> {
    fn visit(&mut self, node: &VarDeclarator) {
        node.name.visit_with(self);
    }
}

impl<'a> Visit<Ident> for VarCollector<'a> {
    fn visit(&mut self, i: &Ident) {
        self.to.push((i.sym.clone(), i.span.ctxt()))
    }
}

macro_rules! var_noop {
    ($T:path) => {
        impl<'a> Visit<$T> for VarCollector<'a> {
            fn visit(&mut self, _: &$T) {}
        }
    };

    ($T:path, $($rest:tt)*) => {
        var_noop!($T);
        var_noop!($($rest)*);
    };
}

var_noop!(Expr, ArrowExpr, Function, Constructor);

var_noop!(TsType, TsTypeAnn, TsTypeParam);
