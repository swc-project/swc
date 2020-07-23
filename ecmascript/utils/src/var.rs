use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::{Node, Visit};

pub struct VarCollector<'a> {
    pub to: &'a mut Vec<(JsWord, SyntaxContext)>,
}

impl Visit for VarCollector<'_> {
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _parent: &dyn Node) {}

    fn visit_constructor(&mut self, _: &Constructor, _parent: &dyn Node) {}

    fn visit_expr(&mut self, _: &Expr, _parent: &dyn Node) {}

    fn visit_function(&mut self, _: &Function, _parent: &dyn Node) {}

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        self.to.push((i.sym.clone(), i.span.ctxt()))
    }

    fn visit_ts_type(&mut self, _: &TsType, _parent: &dyn Node) {}

    fn visit_ts_type_ann(&mut self, _: &TsTypeAnn, _parent: &dyn Node) {}

    fn visit_ts_type_param(&mut self, _: &TsTypeParam, _parent: &dyn Node) {}

    fn visit_var_declarator(&mut self, node: &VarDeclarator, _: &dyn Node) {
        node.name.visit_with(self);
    }
}
