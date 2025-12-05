use std::mem;

use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{
    helper, helper_expr,
    perf::{should_work, Check},
};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{alias_if_required, prepend_stmt, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use super::object_rest_spread::Config;

/// Object rest pattern transformer.
#[derive(Default)]
pub(super) struct ObjectRest {
    pub config: Config,
    /// Pending variable declarations to insert after statement.
    vars: Vec<VarDeclarator>,
}

impl ObjectRest {
    pub fn new(config: Config) -> Self {
        ObjectRest {
            config,
            ..Default::default()
        }
    }
}

/// Fast-path visitor to check if a node contains object rest patterns.
#[derive(Default)]
struct RestVisitor {
    found: bool,
}

impl Visit for RestVisitor {
    noop_visit_type!(fail);

    fn visit_object_pat_prop(&mut self, prop: &ObjectPatProp) {
        match prop {
            ObjectPatProp::Rest(..) => self.found = true,
            _ => prop.visit_children_with(self),
        }
    }
}

impl Check for RestVisitor {
    fn should_handle(&self) -> bool {
        self.found
    }
}

/// Pattern-only rest visitor - doesn't traverse into expressions.
#[derive(Default)]
struct PatternRestVisitor {
    found: bool,
}

impl Visit for PatternRestVisitor {
    noop_visit_type!(fail);

    fn visit_object_pat_prop(&mut self, prop: &ObjectPatProp) {
        match prop {
            ObjectPatProp::Rest(..) => self.found = true,
            _ => prop.visit_children_with(self),
        }
    }

    fn visit_expr(&mut self, _: &Expr) {}
}

impl Check for PatternRestVisitor {
    fn should_handle(&self) -> bool {
        self.found
    }
}

/// Output context trait - adapts the algorithm for declaration vs expression.
trait RestOutput {
    /// Emit an assignment: `pattern = init`
    fn assign(&mut self, pat: Pat, init: Box<Expr>);

    /// Declare a temp variable and return its identifier.
    fn declare_temp(&mut self, name: &str) -> Ident;

    /// Capture init into a temp if needed, return (temp_ident, init_expr).
    fn capture_init(&mut self, init: Box<Expr>) -> (Ident, Box<Expr>);
}

struct RestLowerer<O: RestOutput> {
    config: Config,
    out: O,
}

impl<O: RestOutput> RestLowerer<O> {
    fn new(config: Config, out: O) -> Self {
        Self { config, out }
    }

    /// Main entry point: lower a pattern with potential object rest.
    // https://github.com/evanw/esbuild/blob/5e0e56d6d62076dfeff47f5227ae5300f91d2b16/internal/js_parser/js_parser_lower.go#L1622
    fn visit(&mut self, pat: Pat, init: Box<Expr>) {
        match pat {
            Pat::Object(obj) => self.visit_object(obj, init, &mut Vec::new()),
            Pat::Array(arr) => self.visit_array(arr, init),
            _ => self.out.assign(pat, init),
        }
    }

    // https://github.com/evanw/esbuild/blob/5e0e56d6d62076dfeff47f5227ae5300f91d2b16/internal/js_parser/js_parser_lower.go#L1634
    fn visit_object(
        &mut self,
        mut obj: ObjectPat,
        init: Box<Expr>,
        captured_keys: &mut Vec<PropName>,
    ) {
        let has_rest = matches!(obj.props.last(), Some(ObjectPatProp::Rest(_)));

        // Pre-evaluate impure computed keys
        for prop in &mut obj.props {
            if let ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Computed(computed),
                ..
            }) = prop
            {
                if !is_pure_expr(&computed.expr) {
                    let temp = self.out.declare_temp("_key");
                    self.out.assign(temp.clone().into(), computed.expr.take());
                    computed.expr = Box::new(temp.into());
                }
            }
        }

        // Sequential processing: find first property with nested rest
        for i in 0..obj.props.len() {
            match &obj.props[i] {
                ObjectPatProp::KeyValue(kv) => {
                    if has_rest {
                        captured_keys.push(kv.key.clone());
                    }
                    if should_work::<PatternRestVisitor, _>(&kv.value) {
                        self.split_object_pattern(obj, i, init, captured_keys);
                        return;
                    }
                }
                ObjectPatProp::Assign(assign) => {
                    if has_rest {
                        captured_keys.push(PropName::Ident(IdentName::from(assign.key.clone())));
                    }
                }
                ObjectPatProp::Rest(_) => {
                    // Extract rest_arg by taking from props
                    let rest_arg = match obj.props.pop() {
                        Some(ObjectPatProp::Rest(rest)) => rest.arg,
                        _ => unreachable!(),
                    };
                    self.lower_object_rest(obj, i, rest_arg, init, mem::take(captured_keys));
                    return;
                }
            }
        }

        // No rest pattern found
        self.out.assign(obj.into(), init);
    }

    // https://github.com/evanw/esbuild/blob/5e0e56d6d62076dfeff47f5227ae5300f91d2b16/internal/js_parser/js_parser_lower.go#L1563
    fn split_object_pattern(
        &mut self,
        mut obj: ObjectPat,
        split_idx: usize,
        init: Box<Expr>,
        captured_keys: &mut Vec<PropName>,
    ) {
        let split_ref = self.out.declare_temp("_ref");

        // Split props: take remaining, keep up to split_idx
        let remaining_props: Vec<_> = obj.props.drain(split_idx + 1..).collect();

        // Extract nested pattern before modifying
        let nested_pat: Pat = match &mut obj.props[split_idx] {
            ObjectPatProp::KeyValue(kv) => match kv.value.as_mut() {
                Pat::Assign(assign) => {
                    let nested = assign.left.take();
                    assign.left = Box::new(split_ref.clone().into());
                    *nested
                }
                pat => {
                    let nested = pat.take();
                    kv.value = Box::new(split_ref.clone().into());
                    nested
                }
            },
            _ => unreachable!(),
        };

        // Capture init if there are remaining properties
        let (destructure_init, after_init) = if !remaining_props.is_empty() {
            let (obj_ref, init_expr) = self.out.capture_init(init);
            (init_expr, Some(Box::new(Expr::Ident(obj_ref))))
        } else {
            (init, None)
        };

        let span = obj.span;

        // Emit destructuring up to split point
        self.out.assign(obj.into(), destructure_init);

        // Process nested pattern
        self.visit(nested_pat, Box::new(split_ref.into()));

        // Continue with remaining properties
        if let Some(after_init) = after_init {
            let remaining = ObjectPat {
                span,
                props: remaining_props,
                optional: false,
                type_ann: None,
            };
            self.visit_object(remaining, after_init, captured_keys);
        }
    }

    // https://github.com/evanw/esbuild/blob/5e0e56d6d62076dfeff47f5227ae5300f91d2b16/internal/js_parser/js_parser_lower.go#L1488
    fn lower_object_rest(
        &mut self,
        mut obj: ObjectPat,
        rest_idx: usize,
        rest_pat: Box<Pat>,
        init: Box<Expr>,
        captured_keys: Vec<PropName>,
    ) {
        let (source, init_expr) = self.out.capture_init(init);

        // Remove rest pattern and beyond
        obj.props.truncate(rest_idx);

        // Emit destructuring for properties before rest.
        // When rest_idx == 0 (only rest pattern, no other props):
        //   - If captured_keys is empty: this is a fresh source like `{ ...rest } = x`,
        //     emit `{} = x` to ensure x is not null/undefined (throws TypeError)
        //   - If captured_keys is non-empty: we already destructured from this source
        //     in a previous split, null check was already done, skip empty pattern
        let is_fresh_source = captured_keys.is_empty();
        if rest_idx > 0 || is_fresh_source {
            self.out.assign(obj.into(), init_expr);
        }

        // Emit rest call
        let rest_call = make_rest_call(self.config, source, captured_keys);
        self.out.assign(*rest_pat, Box::new(rest_call));
    }

    // https://github.com/evanw/esbuild/blob/5e0e56d6d62076dfeff47f5227ae5300f91d2b16/internal/js_parser/js_parser_lower.go#L1624
    fn visit_array(&mut self, arr: ArrayPat, init: Box<Expr>) {
        for i in 0..arr.elems.len() {
            let Some(elem) = &arr.elems[i] else { continue };
            if should_work::<PatternRestVisitor, _>(elem) {
                self.split_array_pattern(arr, i, init);
                return;
            }
        }
        self.out.assign(arr.into(), init);
    }

    // https://github.com/evanw/esbuild/blob/5e0e56d6d62076dfeff47f5227ae5300f91d2b16/internal/js_parser/js_parser_lower.go#L1518
    fn split_array_pattern(&mut self, mut arr: ArrayPat, split_idx: usize, init: Box<Expr>) {
        let split_ref = self.out.declare_temp("_ref");

        // Split: take remaining elements
        let remaining_elems: Vec<_> = arr.elems.drain(split_idx + 1..).collect();

        // Extract nested pattern and replace with temp
        let nested_pat: Pat = match arr.elems[split_idx].as_mut() {
            Some(Pat::Assign(assign)) => {
                let nested = assign.left.take();
                assign.left = Box::new(split_ref.clone().into());
                *nested
            }
            Some(pat) => {
                let nested = pat.take();
                arr.elems[split_idx] = Some(split_ref.clone().into());
                nested
            }
            None => unreachable!(),
        };

        // Add rest pattern to capture remaining if needed
        let remaining = if !remaining_elems.is_empty() {
            let tail_ref = self.out.declare_temp("_rest");
            arr.elems.push(Some(Pat::Rest(RestPat {
                span: DUMMY_SP,
                arg: Box::new(tail_ref.clone().into()),
                dot3_token: DUMMY_SP,
                type_ann: None,
            })));
            Some((tail_ref, remaining_elems))
        } else {
            None
        };

        let span = arr.span;
        self.out.assign(arr.into(), init);

        // Process nested pattern
        self.visit(nested_pat, Box::new(split_ref.into()));

        // Continue with remaining elements
        if let Some((tail_ref, remaining_elems)) = remaining {
            let remaining_arr = ArrayPat {
                span,
                elems: remaining_elems,
                optional: false,
                type_ann: None,
            };
            self.visit_array(remaining_arr, Box::new(tail_ref.into()));
        }
    }
}

// ========================================
// VisitMut implementation
// ========================================

#[fast_path(RestVisitor)]
impl VisitMut for ObjectRest {
    noop_visit_mut_type!(fail);

    fn visit_mut_var_decl(&mut self, decl: &mut VarDecl) {
        let mut new_decls = Vec::with_capacity(decl.decls.len());

        for mut declarator in decl.decls.take() {
            // 1. Visit init first (RHS before LHS semantics)
            if let Some(init) = &mut declarator.init {
                init.visit_mut_with(self);
            }

            // 2. Visit pattern
            declarator.name.visit_mut_with(self);

            // 3. Take init for processing
            let Some(init) = declarator.init.take() else {
                new_decls.push(declarator);
                continue;
            };

            // 4. Check if pattern contains object rest
            if !should_work::<PatternRestVisitor, _>(&declarator.name) {
                declarator.init = Some(init);
                new_decls.push(declarator);
                continue;
            }

            // 5. Has rest - create temp for init if needed
            let (ref_ident, aliased) = alias_if_required(&init, "_ref");
            let source_init = if aliased {
                // Need temp variable for complex expression
                new_decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ref_ident.clone().into(),
                    init: Some(init),
                    definite: false,
                });
                Box::new(ref_ident.into())
            } else {
                init
            };

            // 6. Use unified lowering
            let mut lowerer = RestLowerer::new(self.config, DeclOutput::new());
            lowerer.visit(declarator.name.take(), source_init);
            new_decls.extend(lowerer.out.into_decls());
        }

        decl.decls = new_decls;
    }

    fn visit_mut_function(&mut self, func: &mut Function) {
        let Some(body) = &mut func.body else { return };

        if should_work::<RestVisitor, _>(&func.params) {
            let mut collector = ParamCollector::default();

            for (index, param) in func
                .params
                .iter_mut()
                .enumerate()
                .skip_while(|(_, param)| param.pat.is_ident())
            {
                collector.collect(index, &mut param.pat);
            }

            if let Some(var_decl) = collector.into_stmt() {
                prepend_stmt(&mut body.stmts, var_decl);
            }
        }

        // Visit body - this will process the var decl we just inserted
        body.visit_mut_with(self);
    }

    fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
        if should_work::<RestVisitor, _>(&arrow.params) {
            let mut collector = ParamCollector::default();

            for (index, param) in arrow
                .params
                .iter_mut()
                .enumerate()
                .skip_while(|(_, param)| param.is_ident())
            {
                collector.collect(index, param);
            }

            if let Some(var_decl) = collector.into_stmt() {
                // Insert into body
                match &mut *arrow.body {
                    BlockStmtOrExpr::BlockStmt(block) => {
                        prepend_stmt(&mut block.stmts, var_decl);
                    }
                    BlockStmtOrExpr::Expr(expr) => {
                        arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                            stmts: vec![
                                var_decl,
                                ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(expr.take()),
                                }
                                .into(),
                            ],
                            ..Default::default()
                        }));
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                }
            }
        }

        // Visit body - this will process the var decl we just inserted
        arrow.body.visit_mut_with(self);
    }

    fn visit_mut_constructor(&mut self, cons: &mut Constructor) {
        let Some(body) = &mut cons.body else { return };

        if should_work::<RestVisitor, _>(&cons.params) {
            let mut collector = ParamCollector::default();

            for (index, param) in cons.params.iter_mut().enumerate().skip_while(
                |(_, param)| matches!(param, ParamOrTsParamProp::Param(p) if p.pat.is_ident()),
            ) {
                if let ParamOrTsParamProp::Param(param) = param {
                    collector.collect(index, &mut param.pat);
                }
            }

            if let Some(var_decl) = collector.into_stmt() {
                prepend_stmt(&mut body.stmts, var_decl);
            }
        }

        // Visit body - this will process the var decl we just inserted
        body.visit_mut_with(self);
    }

    fn visit_mut_catch_clause(&mut self, clause: &mut CatchClause) {
        clause.body.visit_mut_with(self);

        let Some(ref mut param) = clause.param else {
            return;
        };

        if !should_work::<PatternRestVisitor, _>(param) {
            return;
        }

        let ref_ident = private_ident!("_param");
        let pat = clause.param.take().unwrap();
        clause.param = Some(ref_ident.clone().into());

        let mut lowerer = RestLowerer::new(self.config, DeclOutput::new());
        lowerer.visit(pat, Box::new(ref_ident.into()));

        let stmt: Stmt = VarDecl {
            kind: VarDeclKind::Let,
            decls: lowerer.out.into_decls(),
            ..Default::default()
        }
        .into();

        clause.body.stmts.insert(0, stmt);
    }

    fn visit_mut_for_in_stmt(&mut self, stmt: &mut ForInStmt) {
        stmt.right.visit_mut_with(self);
        stmt.body.visit_mut_with(self);
        self.transform_for_loop(&mut stmt.left, &mut stmt.body);
    }

    fn visit_mut_for_of_stmt(&mut self, stmt: &mut ForOfStmt) {
        stmt.right.visit_mut_with(self);
        stmt.body.visit_mut_with(self);
        self.transform_for_loop(&mut stmt.left, &mut stmt.body);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        // Check if this is an assignment expression with pattern
        let Expr::Assign(AssignExpr {
            span,
            left: AssignTarget::Pat(pat),
            op: op!("="),
            right,
        }) = expr
        else {
            // Not a pattern assignment, visit children normally
            expr.visit_mut_children_with(self);
            return;
        };

        // 1. Visit RHS first (RHS before LHS semantics)
        right.visit_mut_with(self);

        // 2. Visit LHS pattern
        let inner_pat: Pat = pat.take().into();

        // 3. Check if has rest
        if !should_work::<PatternRestVisitor, _>(&inner_pat) {
            *pat = pat_to_assign_target_pat(inner_pat);
            return;
        }

        // 4. Has rest - create temp for RHS if needed
        let (ref_ident, aliased) = alias_if_required(right, "_ref");

        // 5. Build sequence expression
        let mut out = ExprOutput::new();

        if aliased {
            // Declare the temp var
            out.vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: ref_ident.clone().into(),
                init: None,
                definite: false,
            });
            // _ref = source
            out.exprs.push(Box::new(
                AssignExpr {
                    span: DUMMY_SP,
                    left: ref_ident.clone().into(),
                    op: op!("="),
                    right: right.take(),
                }
                .into(),
            ));
        }

        let mut lowerer = RestLowerer::new(self.config, out);
        lowerer.visit(inner_pat, Box::new(ref_ident.clone().into()));

        lowerer.out.exprs.push(Box::new(ref_ident.into()));

        let (exprs, mut vars) = lowerer.out.into_parts();
        self.vars.append(&mut vars);

        *expr = SeqExpr { span: *span, exprs }.into();
    }

    // ========================================
    // Statement/module item handlers
    // ========================================

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let mut new_stmts = Vec::with_capacity(stmts.len());

        for stmt in stmts.drain(..) {
            let mut stmt = stmt;
            stmt.visit_mut_with(self);
            new_stmts.push(stmt);

            // Insert var declarations after current
            if !self.vars.is_empty() {
                new_stmts.push(
                    VarDecl {
                        decls: mem::take(&mut self.vars),
                        ..Default::default()
                    }
                    .into(),
                );
            }
        }

        *stmts = new_stmts;
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let mut new_items = Vec::with_capacity(items.len());

        for item in items.drain(..) {
            match item {
                ModuleItem::Stmt(stmt) => {
                    let mut stmt = stmt;
                    stmt.visit_mut_with(self);
                    new_items.push(ModuleItem::Stmt(stmt));

                    if !self.vars.is_empty() {
                        new_items.push(ModuleItem::Stmt(
                            VarDecl {
                                decls: mem::take(&mut self.vars),
                                ..Default::default()
                            }
                            .into(),
                        ));
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span,
                    decl: Decl::Var(mut var_decl),
                })) => {
                    // Collect names before transformation (these are the actual exports)
                    let mut exported_names = Vec::new();
                    for decl in &var_decl.decls {
                        collect_idents_from_pat(&decl.name, &mut exported_names);
                    }

                    let var_decl_len = var_decl.decls.len();
                    var_decl.visit_mut_with(self);

                    // Check if transformation happened
                    if var_decl.decls.len() == var_decl_len && self.vars.is_empty() {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                            ExportDecl {
                                span,
                                decl: Decl::Var(var_decl),
                            },
                        )));
                        continue;
                    }

                    // Insert var declaration
                    new_items.push(ModuleItem::Stmt((*var_decl).into()));

                    // Insert additional var declarations
                    if !self.vars.is_empty() {
                        new_items.push(ModuleItem::Stmt(
                            VarDecl {
                                decls: mem::take(&mut self.vars),
                                ..Default::default()
                            }
                            .into(),
                        ));
                    }

                    // Export the names
                    if !exported_names.is_empty() {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                            NamedExport {
                                span,
                                specifiers: exported_names
                                    .into_iter()
                                    .map(|id| {
                                        ExportSpecifier::Named(ExportNamedSpecifier {
                                            span: DUMMY_SP,
                                            orig: ModuleExportName::Ident(id),
                                            exported: None,
                                            is_type_only: false,
                                        })
                                    })
                                    .collect(),
                                src: None,
                                type_only: false,
                                with: None,
                            },
                        )));
                    }
                }
                _ => {
                    let mut item = item;
                    item.visit_mut_with(self);
                    new_items.push(item);
                }
            }
        }

        *items = new_items;
    }
}

/// Declaration context output.
struct DeclOutput {
    decls: Vec<VarDeclarator>,
}

impl DeclOutput {
    fn new() -> Self {
        Self { decls: Vec::new() }
    }

    fn into_decls(self) -> Vec<VarDeclarator> {
        self.decls
    }
}

impl RestOutput for DeclOutput {
    fn assign(&mut self, pat: Pat, init: Box<Expr>) {
        self.decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: pat,
            init: Some(init),
            definite: false,
        });
    }

    fn declare_temp(&mut self, name: &str) -> Ident {
        private_ident!(name)
    }

    fn capture_init(&mut self, init: Box<Expr>) -> (Ident, Box<Expr>) {
        match init.as_ref() {
            Expr::Ident(id) => (id.clone(), init),
            _ => {
                let temp = private_ident!("_ref");
                self.decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: temp.clone().into(),
                    init: Some(init),
                    definite: false,
                });
                (temp.clone(), Box::new(temp.into()))
            }
        }
    }
}

/// Expression context output.
struct ExprOutput {
    exprs: Vec<Box<Expr>>,
    vars: Vec<VarDeclarator>,
}

impl ExprOutput {
    fn new() -> Self {
        Self {
            exprs: Vec::new(),
            vars: Vec::new(),
        }
    }

    fn into_parts(self) -> (Vec<Box<Expr>>, Vec<VarDeclarator>) {
        (self.exprs, self.vars)
    }
}

impl RestOutput for ExprOutput {
    fn assign(&mut self, pat: Pat, init: Box<Expr>) {
        if let Ok(target) = pat.try_into() {
            self.exprs.push(Box::new(
                AssignExpr {
                    span: DUMMY_SP,
                    left: target,
                    op: op!("="),
                    right: init,
                }
                .into(),
            ));
        }
    }

    fn declare_temp(&mut self, name: &str) -> Ident {
        let temp = private_ident!(name);
        self.vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: temp.clone().into(),
            init: None,
            definite: false,
        });
        temp
    }

    fn capture_init(&mut self, init: Box<Expr>) -> (Ident, Box<Expr>) {
        match init.as_ref() {
            Expr::Ident(id) => (id.clone(), init),
            _ => {
                let temp = self.declare_temp("_ref");
                self.exprs.push(Box::new(
                    AssignExpr {
                        span: DUMMY_SP,
                        left: temp.clone().into(),
                        op: op!("="),
                        right: init,
                    }
                    .into(),
                ));
                (temp.clone(), Box::new(temp.into()))
            }
        }
    }
}

fn make_rest_call(config: Config, source: Ident, excluded: Vec<PropName>) -> Expr {
    if excluded.is_empty() {
        return CallExpr {
            callee: helper!(extends),
            args: vec![ObjectLit::default().as_arg(), source.as_arg()],
            ..Default::default()
        }
        .into();
    }

    let helper = if config.no_symbol {
        helper!(object_without_properties_loose)
    } else {
        helper!(object_without_properties)
    };

    let impure_count = excluded
        .iter()
        .filter(|k| matches!(k, PropName::Computed(expr) if !is_lit_str(&expr.expr)))
        .count();

    let keys: Vec<Option<ExprOrSpread>> = excluded
        .into_iter()
        .map(|key| {
            let key_expr = match key {
                PropName::Ident(id) => Expr::Lit(Lit::Str(id.sym.into())),
                PropName::Str(s) => Expr::Lit(Lit::Str(s)),
                PropName::Num(n) => Expr::Lit(Lit::Str(Str {
                    span: n.span,
                    value: n.value.to_string().into(),
                    raw: None,
                })),
                PropName::Computed(c) if impure_count == 1 && !is_lit_str(&c.expr) => CallExpr {
                    callee: helper!(to_property_key),
                    args: vec![c.expr.as_arg()],
                    ..Default::default()
                }
                .into(),
                PropName::Computed(c) => *c.expr,
                PropName::BigInt(b) => Expr::Lit(Lit::Str(Str {
                    span: b.span,
                    value: b.value.to_string().into(),
                    raw: None,
                })),
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            };
            Some(key_expr.as_arg())
        })
        .collect();

    let mut expr: Expr = ArrayLit {
        elems: keys,
        ..Default::default()
    }
    .into();

    // Optimization: If there is exactly one impure computed key, we can
    // directly call to_property_key on it here, rather than mapping over
    // the array later. This avoids unnecessary array creation and mapping.
    if impure_count > 1 {
        // [].map(to_property_key)
        expr = expr
            .make_member(quote_ident!("map"))
            .as_call(DUMMY_SP, vec![helper_expr!(to_property_key).as_arg()]);
    }

    CallExpr {
        callee: helper,
        args: vec![source.as_arg(), expr.as_arg()],
        ..Default::default()
    }
    .into()
}

impl ObjectRest {
    fn transform_for_loop(&mut self, left: &mut ForHead, body: &mut Box<Stmt>) {
        match left {
            ForHead::VarDecl(var_decl) => {
                if !should_work::<PatternRestVisitor, _>(&var_decl.decls[0].name) {
                    return;
                }

                let ref_ident = private_ident!("_ref");
                let pat = var_decl.decls[0].name.take();
                var_decl.decls[0].name = ref_ident.clone().into();

                let mut lowerer = RestLowerer::new(self.config, DeclOutput::new());
                lowerer.visit(pat, Box::new(ref_ident.into()));

                let stmt: Stmt = VarDecl {
                    kind: VarDeclKind::Let,
                    decls: lowerer.out.into_decls(),
                    ..Default::default()
                }
                .into();

                match &mut **body {
                    Stmt::Block(block) => block.stmts.insert(0, stmt),
                    _ => {
                        *body = Box::new(
                            BlockStmt {
                                stmts: vec![stmt, (**body).take()],
                                ..Default::default()
                            }
                            .into(),
                        );
                    }
                }
            }
            ForHead::Pat(pat) => {
                if !should_work::<PatternRestVisitor, _>(&**pat) {
                    return;
                }

                let ref_ident = private_ident!("_ref");

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ref_ident.clone().into(),
                    init: None,
                    definite: false,
                });

                let old_pat = mem::replace(&mut **pat, ref_ident.clone().into());

                let mut lowerer = RestLowerer::new(self.config, ExprOutput::new());
                lowerer.visit(old_pat, Box::new(ref_ident.clone().into()));
                lowerer.out.exprs.push(Box::new(ref_ident.into()));

                let (exprs, mut vars) = lowerer.out.into_parts();
                self.vars.append(&mut vars);

                let assign_stmt: Stmt = SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                }
                .into_stmt();

                match &mut **body {
                    Stmt::Block(block) => block.stmts.insert(0, assign_stmt),
                    _ => {
                        *body = Box::new(
                            BlockStmt {
                                stmts: vec![assign_stmt, (**body).take()],
                                ..Default::default()
                            }
                            .into(),
                        );
                    }
                }
            }
            _ => {}
        }
    }
}

// ========================================
// Utility functions
// ========================================

/// Collector for function parameters that need to be destructured in body.
///
/// ```JavaScript
/// function foo(a, { b, ...c}, d = b, ...e) {}
/// ```
/// ->
/// ```JavaScript
/// function foo(a, _1, _2, ..._3) {
///   let [{ b, ...c}, d = b, e] = [_1, _2, _3];
/// }
/// ```
#[derive(Default)]
struct ParamCollector {
    collected_pats: Vec<Pat>,
    temp_exprs: Vec<ExprOrSpread>,
}

impl ParamCollector {
    /// Process a single parameter: extract pattern, replace with temp variable.
    fn collect(&mut self, index: usize, pat: &mut Pat) {
        let temp = private_ident!(format!("_{}", index));

        let original_pat = match pat {
            Pat::Rest(rest_pat) => mem::replace(&mut *rest_pat.arg, temp.clone().into()),
            Pat::Assign(pat) => {
                let init = AssignPat {
                    span: DUMMY_SP,
                    left: Box::new(temp.clone().into()),
                    right: Expr::undefined(DUMMY_SP),
                };
                mem::replace(pat, init).into()
            }
            pat => mem::replace(pat, temp.clone().into()),
        };

        self.collected_pats.push(original_pat);
        self.temp_exprs.push(temp.as_arg());
    }

    /// Create array destructuring declaration: `let [patterns...] = [temps...]`
    fn into_stmt(mut self) -> Option<Stmt> {
        if self.collected_pats.is_empty() {
            return None;
        }

        // Special case: single non-assign pattern can be emitted directly without array
        // wrapper
        if self.collected_pats.len() == 1 {
            let pat = self.collected_pats.pop()?;
            if !matches!(pat, Pat::Assign(_)) {
                let init = self.temp_exprs.pop().map(|e| e.expr);
                return Some(
                    VarDecl {
                        kind: VarDeclKind::Let,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: pat,
                            init,
                            definite: false,
                        }],
                        ..Default::default()
                    }
                    .into(),
                );
            }
            // Put it back if it's an assign pattern
            self.collected_pats.push(pat);
        }

        Some(
            VarDecl {
                kind: VarDeclKind::Let,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Array(ArrayPat {
                        span: DUMMY_SP,
                        elems: self.collected_pats.into_iter().map(Some).collect(),
                        optional: false,
                        type_ann: None,
                    }),
                    init: Some(Box::new(
                        ArrayLit {
                            span: DUMMY_SP,
                            elems: self.temp_exprs.into_iter().map(Some).collect(),
                        }
                        .into(),
                    )),
                    definite: false,
                }],
                ..Default::default()
            }
            .into(),
        )
    }
}

fn collect_idents_from_pat(pat: &Pat, out: &mut Vec<Ident>) {
    match pat {
        Pat::Ident(id) => out.push(id.id.clone()),
        Pat::Object(obj) => {
            for prop in &obj.props {
                match prop {
                    ObjectPatProp::KeyValue(kv) => collect_idents_from_pat(&kv.value, out),
                    ObjectPatProp::Assign(a) => out.push(a.key.id.clone()),
                    ObjectPatProp::Rest(r) => collect_idents_from_pat(&r.arg, out),
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                }
            }
        }
        Pat::Array(arr) => {
            for elem in arr.elems.iter().flatten() {
                collect_idents_from_pat(elem, out);
            }
        }
        Pat::Rest(r) => collect_idents_from_pat(&r.arg, out),
        Pat::Assign(a) => collect_idents_from_pat(&a.left, out),
        _ => {}
    }
}

fn pat_to_assign_target_pat(pat: Pat) -> AssignTargetPat {
    pat.try_into()
        .unwrap_or_else(|p: Pat| AssignTargetPat::Invalid(Invalid { span: p.span() }))
}

fn is_lit_str(expr: &Expr) -> bool {
    match expr {
        Expr::Lit(Lit::Str(_)) => true,
        Expr::Tpl(tpl) => tpl.exprs.is_empty(),
        _ => false,
    }
}

/// Check if an expression is "pure" (has no side effects).
fn is_pure_expr(expr: &Expr) -> bool {
    match expr {
        Expr::Ident(_) | Expr::Lit(_) => true,
        Expr::Tpl(tpl) => tpl.exprs.is_empty(),
        // Symbol.iterator, Symbol.toStringTag, etc.
        Expr::Member(MemberExpr {
            obj,
            prop: MemberProp::Ident(_),
            ..
        }) => matches!(&**obj, Expr::Ident(i) if &*i.sym == "Symbol"),
        _ => false,
    }
}
