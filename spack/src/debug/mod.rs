use swc_ecma_ast::Ident;
use swc_ecma_visit::Fold;

pub(crate) struct HygieneVisualizer;

impl Fold for HygieneVisualizer {
    fn fold_ident(&mut self, node: Ident) -> Ident {
        Ident {
            sym: format!("{}{:?}", node.sym, node.span.ctxt()).into(),
            ..node
        }
    }
}
