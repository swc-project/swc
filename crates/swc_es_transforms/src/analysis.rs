use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_es_ast::{AstStore, BinaryOp, Expr, ExprId, Lit, ProgramId, StmtId, UnaryOp};
use swc_es_semantics::{
    analyze_program, BasicBlockKind, CfgRoot, ReferenceKind, Semantics, SymbolId,
};
use swc_es_visit::{Visit, VisitWith};

/// Constant lattice value used by transforms.
#[derive(Debug, Clone, PartialEq)]
pub enum ConstValue {
    /// Unknown value.
    Unknown,
    /// JavaScript `undefined` value.
    Undefined,
    /// JavaScript `null` value.
    Null,
    /// Boolean constant.
    Bool(bool),
    /// Number constant.
    Number(f64),
    /// String constant.
    Str(Atom),
}

impl ConstValue {
    #[inline]
    pub(crate) fn truthy(&self) -> Option<bool> {
        match self {
            Self::Unknown => None,
            Self::Undefined | Self::Null => Some(false),
            Self::Bool(v) => Some(*v),
            Self::Number(v) => Some(*v != 0.0 && !v.is_nan()),
            Self::Str(v) => Some(!v.is_empty()),
        }
    }

    #[inline]
    fn strict_eq(&self, other: &Self) -> Option<bool> {
        match (self, other) {
            (Self::Undefined, Self::Undefined) => Some(true),
            (Self::Null, Self::Null) => Some(true),
            (Self::Bool(a), Self::Bool(b)) => Some(a == b),
            (Self::Number(a), Self::Number(b)) => Some(a == b),
            (Self::Str(a), Self::Str(b)) => Some(a == b),
            (Self::Unknown, _) | (_, Self::Unknown) => None,
            _ => Some(false),
        }
    }

    #[inline]
    fn loose_eq(&self, other: &Self) -> Option<bool> {
        if matches!(self, Self::Unknown) || matches!(other, Self::Unknown) {
            return None;
        }

        if matches!(self, Self::Null) && matches!(other, Self::Undefined)
            || matches!(self, Self::Undefined) && matches!(other, Self::Null)
        {
            return Some(true);
        }

        self.strict_eq(other)
    }
}

/// Per-symbol usage summary.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct SymbolUsage {
    /// Symbol was read.
    pub read: bool,
    /// Symbol was written.
    pub write: bool,
    /// Symbol was used as a call target.
    pub call: bool,
}

/// Facts produced by a single analysis pass.
#[derive(Debug)]
pub struct AnalysisFacts {
    /// Semantic graph (scopes/symbols/references/cfg).
    pub semantics: Semantics,
    /// Usage summary indexed by `SymbolId` index.
    pub symbol_usage: Vec<SymbolUsage>,
    expr_purity: FxHashMap<u64, bool>,
    expr_constants: FxHashMap<u64, ConstValue>,
    reachable_stmts: FxHashSet<u64>,
    /// `true` if any scope uses dynamic lookup (`eval`/`with`).
    pub has_dynamic_scope: bool,
}

impl AnalysisFacts {
    /// Returns whether an expression is known pure.
    #[inline]
    pub fn expr_is_pure(&self, id: ExprId) -> bool {
        self.expr_purity.get(&id.as_raw()).copied().unwrap_or(false)
    }

    /// Returns constant lattice value for expression.
    #[inline]
    pub fn expr_constant(&self, id: ExprId) -> ConstValue {
        self.expr_constants
            .get(&id.as_raw())
            .cloned()
            .unwrap_or(ConstValue::Unknown)
    }

    /// Returns reachability for statement in the program CFG.
    #[inline]
    pub fn is_stmt_reachable(&self, id: StmtId) -> bool {
        self.reachable_stmts.contains(&id.as_raw())
    }

    /// Returns symbol usage entry.
    #[inline]
    pub fn symbol_usage(&self, id: SymbolId) -> Option<SymbolUsage> {
        self.symbol_usage.get(id.as_u32() as usize).copied()
    }
}

pub(crate) fn analyze_once(store: &AstStore, program: ProgramId) -> (AnalysisFacts, u32) {
    let semantics = analyze_program(store, program);

    let (analysis_nodes, exprs, call_symbols) = {
        let mut collector = AnalysisCollector {
            store,
            semantics: &semantics,
            exprs: Vec::new(),
            call_symbols: FxHashSet::default(),
            nodes: 0,
        };
        program.visit_with(store, &mut collector);
        (collector.nodes, collector.exprs, collector.call_symbols)
    };

    let mut symbol_usage = vec![SymbolUsage::default(); semantics.symbols().len()];
    for reference in semantics.references() {
        let Some(symbol) = reference.symbol else {
            continue;
        };
        let usage = &mut symbol_usage[symbol.as_u32() as usize];
        match reference.kind {
            ReferenceKind::Read => usage.read = true,
            ReferenceKind::Write => usage.write = true,
            ReferenceKind::ReadWrite => {
                usage.read = true;
                usage.write = true;
            }
        }
    }

    for symbol in call_symbols {
        if let Some(usage) = symbol_usage.get_mut(symbol.as_u32() as usize) {
            usage.call = true;
        }
    }

    let has_dynamic_scope = semantics
        .scopes()
        .iter()
        .any(|scope| scope.has_dynamic_lookup);

    let mut expr_purity = FxHashMap::default();
    let mut expr_constants = FxHashMap::default();
    let mut visiting = FxHashSet::default();

    for expr in &exprs {
        let _ = eval_expr(
            *expr,
            store,
            &mut expr_purity,
            &mut expr_constants,
            &mut visiting,
        );
    }

    let reachable_stmts = collect_reachable_stmts(&semantics, program);

    (
        AnalysisFacts {
            semantics,
            symbol_usage,
            expr_purity,
            expr_constants,
            reachable_stmts,
            has_dynamic_scope,
        },
        analysis_nodes,
    )
}

struct AnalysisCollector<'a> {
    store: &'a AstStore,
    semantics: &'a Semantics,
    exprs: Vec<ExprId>,
    call_symbols: FxHashSet<SymbolId>,
    nodes: u32,
}

impl Visit for AnalysisCollector<'_> {
    fn visit_program_node(&mut self, _store: &AstStore, _node: &swc_es_ast::Program) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_stmt_node(&mut self, _store: &AstStore, _node: &swc_es_ast::Stmt) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_decl_node(&mut self, _store: &AstStore, _node: &swc_es_ast::Decl) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_pat_node(&mut self, _store: &AstStore, _node: &swc_es_ast::Pat) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_expr(&mut self, store: &AstStore, id: ExprId) {
        self.exprs.push(id);

        if let Some(Expr::Call(call)) = self.store.expr(id) {
            if let Some(Expr::Ident(_)) = self.store.expr(call.callee) {
                if let Some(symbol) = self.semantics.symbol_of_expr_ident(call.callee) {
                    self.call_symbols.insert(symbol);
                }
            }
        }

        swc_es_visit::walk_expr(self, store, id);
    }

    fn visit_expr_node(&mut self, _store: &AstStore, _node: &swc_es_ast::Expr) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_module_decl_node(&mut self, _store: &AstStore, _node: &swc_es_ast::ModuleDecl) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_function_node(&mut self, _store: &AstStore, _node: &swc_es_ast::Function) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_class_node(&mut self, _store: &AstStore, _node: &swc_es_ast::Class) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_class_member_node(&mut self, _store: &AstStore, _node: &swc_es_ast::ClassMember) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_jsx_element_node(&mut self, _store: &AstStore, _node: &swc_es_ast::JSXElement) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn visit_ts_type_node(&mut self, _store: &AstStore, _node: &swc_es_ast::TsType) {
        self.nodes = self.nodes.saturating_add(1);
    }
}

fn collect_reachable_stmts(semantics: &Semantics, program: ProgramId) -> FxHashSet<u64> {
    let mut reachable = FxHashSet::default();
    let Some(cfg_id) = semantics.cfg_of_root(CfgRoot::Program(program)) else {
        return reachable;
    };
    let Some(cfg) = semantics.cfg(cfg_id) else {
        return reachable;
    };

    let mut adjacency: FxHashMap<u32, Vec<u32>> = FxHashMap::default();
    for edge in &cfg.edges {
        adjacency
            .entry(edge.from.as_u32())
            .or_default()
            .push(edge.to.as_u32());
    }

    let mut queue = vec![cfg.entry.as_u32()];
    let mut seen = FxHashSet::default();

    while let Some(block) = queue.pop() {
        if !seen.insert(block) {
            continue;
        }

        if let Some(node) = cfg.blocks.get(block as usize) {
            if let BasicBlockKind::Statement(stmt) = node.kind {
                reachable.insert(stmt.as_raw());
            }
        }

        if let Some(next) = adjacency.get(&block) {
            queue.extend(next.iter().copied());
        }
    }

    reachable
}

fn eval_expr(
    id: ExprId,
    store: &AstStore,
    purity: &mut FxHashMap<u64, bool>,
    constants: &mut FxHashMap<u64, ConstValue>,
    visiting: &mut FxHashSet<u64>,
) -> (bool, ConstValue) {
    if let Some(p) = purity.get(&id.as_raw()).copied() {
        let value = constants
            .get(&id.as_raw())
            .cloned()
            .unwrap_or(ConstValue::Unknown);
        return (p, value);
    }

    if !visiting.insert(id.as_raw()) {
        return (false, ConstValue::Unknown);
    }

    let result = match store.expr(id).cloned() {
        None => (false, ConstValue::Unknown),
        Some(Expr::Ident(ident)) if ident.sym.as_ref() == "undefined" => {
            (true, ConstValue::Undefined)
        }
        Some(Expr::Ident(_)) => (true, ConstValue::Unknown),
        Some(Expr::Lit(lit)) => (true, const_from_lit(&lit)),
        Some(Expr::Paren(paren)) => eval_expr(paren.expr, store, purity, constants, visiting),
        Some(Expr::TsAs(expr)) => eval_expr(expr.expr, store, purity, constants, visiting),
        Some(Expr::TsNonNull(expr)) => eval_expr(expr.expr, store, purity, constants, visiting),
        Some(Expr::TsSatisfies(expr)) => eval_expr(expr.expr, store, purity, constants, visiting),
        Some(Expr::Seq(seq)) => {
            let mut all_pure = true;
            let mut last = ConstValue::Unknown;
            for expr in seq.exprs {
                let (child_pure, child_const) = eval_expr(expr, store, purity, constants, visiting);
                all_pure &= child_pure;
                last = child_const;
            }
            (all_pure, last)
        }
        Some(Expr::Unary(unary)) => {
            let (arg_pure, arg_const) = eval_expr(unary.arg, store, purity, constants, visiting);
            let value = match unary.op {
                UnaryOp::Bang => arg_const.truthy().map(|v| ConstValue::Bool(!v)),
                UnaryOp::Plus => as_number(&arg_const).map(ConstValue::Number),
                UnaryOp::Minus => as_number(&arg_const).map(|v| ConstValue::Number(-v)),
                UnaryOp::Void => Some(ConstValue::Undefined),
                UnaryOp::TypeOf => None,
                UnaryOp::Tilde => {
                    as_number(&arg_const).map(|v| ConstValue::Number(!(v as i32) as f64))
                }
                UnaryOp::Delete => None,
            }
            .unwrap_or(ConstValue::Unknown);
            let pure = arg_pure && !matches!(unary.op, UnaryOp::Delete);
            (pure, value)
        }
        Some(Expr::Binary(binary)) => {
            let (left_pure, left) = eval_expr(binary.left, store, purity, constants, visiting);
            let (right_pure, right) = eval_expr(binary.right, store, purity, constants, visiting);
            let pure = left_pure && right_pure;
            let value = eval_binary(binary.op, left, right);
            (pure, value)
        }
        Some(Expr::Cond(cond)) => {
            let (test_pure, test) = eval_expr(cond.test, store, purity, constants, visiting);
            let (cons_pure, cons) = eval_expr(cond.cons, store, purity, constants, visiting);
            let (alt_pure, alt) = eval_expr(cond.alt, store, purity, constants, visiting);

            let value = match test.truthy() {
                Some(true) => cons,
                Some(false) => alt,
                None => ConstValue::Unknown,
            };

            (test_pure && cons_pure && alt_pure, value)
        }
        Some(Expr::Array(array)) => {
            let mut pure = true;
            for expr in array.elems.into_iter().flatten() {
                pure &= eval_expr(expr.expr, store, purity, constants, visiting).0;
            }
            (pure, ConstValue::Unknown)
        }
        Some(Expr::Object(object)) => {
            let mut pure = true;
            for prop in object.props {
                if let swc_es_ast::PropName::Computed(expr) = prop.key {
                    pure &= eval_expr(expr, store, purity, constants, visiting).0;
                }
                pure &= eval_expr(prop.value, store, purity, constants, visiting).0;
            }
            (pure, ConstValue::Unknown)
        }
        Some(Expr::Template(template)) => {
            let mut pure = true;
            for expr in template.exprs {
                pure &= eval_expr(expr, store, purity, constants, visiting).0;
            }
            (pure, ConstValue::Unknown)
        }
        Some(
            Expr::Await(_)
            | Expr::Assign(_)
            | Expr::Call(_)
            | Expr::Member(_)
            | Expr::New(_)
            | Expr::Update(_)
            | Expr::Yield(_)
            | Expr::TaggedTemplate(_)
            | Expr::OptChain(_)
            | Expr::Function(_)
            | Expr::Class(_)
            | Expr::Arrow(_)
            | Expr::JSXElement(_),
        ) => (false, ConstValue::Unknown),
        Some(Expr::MetaProp(_)) => (true, ConstValue::Unknown),
    };

    purity.insert(id.as_raw(), result.0);
    constants.insert(id.as_raw(), result.1.clone());
    visiting.remove(&id.as_raw());

    result
}

fn const_from_lit(lit: &Lit) -> ConstValue {
    match lit {
        Lit::Null(_) => ConstValue::Null,
        Lit::Bool(value) => ConstValue::Bool(value.value),
        Lit::Num(value) => ConstValue::Number(value.value),
        Lit::Str(value) => ConstValue::Str(value.value.clone()),
        Lit::BigInt(_) | Lit::Regex(_) => ConstValue::Unknown,
    }
}

fn as_number(value: &ConstValue) -> Option<f64> {
    match value {
        ConstValue::Number(v) => Some(*v),
        ConstValue::Bool(v) => Some(if *v { 1.0 } else { 0.0 }),
        ConstValue::Null => Some(0.0),
        ConstValue::Undefined => Some(f64::NAN),
        ConstValue::Str(_) | ConstValue::Unknown => None,
    }
}

fn eval_binary(op: BinaryOp, left: ConstValue, right: ConstValue) -> ConstValue {
    match op {
        BinaryOp::Add => match (&left, &right) {
            (ConstValue::Number(a), ConstValue::Number(b)) => ConstValue::Number(a + b),
            (ConstValue::Str(a), ConstValue::Str(b)) => {
                ConstValue::Str(Atom::new(format!("{a}{b}")))
            }
            _ => ConstValue::Unknown,
        },
        BinaryOp::Sub => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(a - b),
            _ => ConstValue::Unknown,
        },
        BinaryOp::Mul => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(a * b),
            _ => ConstValue::Unknown,
        },
        BinaryOp::Div => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(a / b),
            _ => ConstValue::Unknown,
        },
        BinaryOp::Mod => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(a % b),
            _ => ConstValue::Unknown,
        },
        BinaryOp::Exp => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(a.powf(b)),
            _ => ConstValue::Unknown,
        },
        BinaryOp::EqEq => left
            .loose_eq(&right)
            .map(ConstValue::Bool)
            .unwrap_or(ConstValue::Unknown),
        BinaryOp::EqEqEq => left
            .strict_eq(&right)
            .map(ConstValue::Bool)
            .unwrap_or(ConstValue::Unknown),
        BinaryOp::NotEq => left
            .loose_eq(&right)
            .map(|v| ConstValue::Bool(!v))
            .unwrap_or(ConstValue::Unknown),
        BinaryOp::NotEqEq => left
            .strict_eq(&right)
            .map(|v| ConstValue::Bool(!v))
            .unwrap_or(ConstValue::Unknown),
        BinaryOp::LogicalAnd => match left.truthy() {
            Some(true) => right,
            Some(false) => left,
            None => ConstValue::Unknown,
        },
        BinaryOp::LogicalOr => match left.truthy() {
            Some(true) => left,
            Some(false) => right,
            None => ConstValue::Unknown,
        },
        BinaryOp::NullishCoalescing => {
            if matches!(left, ConstValue::Null | ConstValue::Undefined) {
                right
            } else if matches!(left, ConstValue::Unknown) {
                ConstValue::Unknown
            } else {
                left
            }
        }
        BinaryOp::Lt => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Bool(a < b),
            _ => ConstValue::Unknown,
        },
        BinaryOp::LtEq => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Bool(a <= b),
            _ => ConstValue::Unknown,
        },
        BinaryOp::Gt => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Bool(a > b),
            _ => ConstValue::Unknown,
        },
        BinaryOp::GtEq => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Bool(a >= b),
            _ => ConstValue::Unknown,
        },
        BinaryOp::BitOr => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(((a as i32) | (b as i32)) as f64),
            _ => ConstValue::Unknown,
        },
        BinaryOp::BitAnd => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(((a as i32) & (b as i32)) as f64),
            _ => ConstValue::Unknown,
        },
        BinaryOp::BitXor => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(((a as i32) ^ (b as i32)) as f64),
            _ => ConstValue::Unknown,
        },
        BinaryOp::LShift => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(((a as i32) << (b as u32)) as f64),
            _ => ConstValue::Unknown,
        },
        BinaryOp::RShift => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(((a as i32) >> (b as u32)) as f64),
            _ => ConstValue::Unknown,
        },
        BinaryOp::ZeroFillRShift => match (as_number(&left), as_number(&right)) {
            (Some(a), Some(b)) => ConstValue::Number(((a as u32) >> (b as u32)) as f64),
            _ => ConstValue::Unknown,
        },
        BinaryOp::In | BinaryOp::InstanceOf => ConstValue::Unknown,
    }
}
