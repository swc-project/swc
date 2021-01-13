use fxhash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

pub(super) fn property_hoister() -> Hoister {
    Hoister::default()
}

#[derive(Debug, Default)]
pub(super) struct Hoister {
    defs: FxHashMap<Id, Box<Expr>>,
    data: Option<ScopeData>,
}

impl Hoister {
    fn handle_stmt_likes<T>(&mut self, n: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self> + VisitWith<Analyzer>,
    {
        // Note that we analyze scope everytime because other passes may remove
        // usages and it's fast enough. (Thanks to rust)

        match self.data {
            Some(_) => {
                // User of property hoister didn't called visit_mut for this
                // level.
            }
            None => {
                let mut analyzer = Analyzer::default();
                n.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
                self.data = Some(analyzer.data)
            }
        }

        n.visit_mut_children_with(self);
    }
}

impl VisitMut for Hoister {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.handle_stmt_likes(n)
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.handle_stmt_likes(n)
    }

    #[inline]
    fn visit_mut_export_all(&mut self, _: &mut ExportAll) {}

    #[inline]
    fn visit_mut_export_specifier(&mut self, n: &mut ExportSpecifier) {}

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        n.visit_mut_children_with(self);

        if let Some(data) = &mut self.data {
            match &mut n.name {
                Pat::Ident(name) => {
                    // If
                    if data
                        .vars
                        .get(&name.to_id())
                        .map(|v| v.single_use)
                        .unwrap_or(false)
                    {}
                }
                _ => return,
            }
        }
    }
}

#[derive(Debug, Default)]
struct VarInfo {
    pub single_use: bool,
}

#[derive(Debug, Default)]
struct ScopeData {
    pub vars: FxHashMap<Id, VarInfo>,
}

#[derive(Debug, Default)]
struct Analyzer {
    data: ScopeData,
}

impl Visit for Analyzer {
    noop_visit_type!();
}
