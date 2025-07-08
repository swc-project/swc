use std::borrow::Cow;

use indexmap::IndexSet;
use petgraph::{algo::tarjan_scc, prelude::GraphMap, Directed, Direction::Incoming};
use rustc_hash::{FxBuildHasher, FxHashMap, FxHashSet};
use swc_atoms::{atom, Atom};
use swc_common::{
    pass::{CompilerPass, Repeated},
    util::take::Take,
    Mark, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::cpu_count;
use swc_ecma_utils::{
    collect_decls, find_pat_ids, ExprCtx, ExprExt, IsEmpty, ModuleItemLike, StmtLike, Value::Known,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};
use tracing::{debug, span, Level};

use crate::debug_assert_valid;

/// Note: This becomes parallel if `concurrent` feature is enabled.
pub fn dce(
    config: Config,
    unresolved_mark: Mark,
) -> impl Pass + VisitMut + Repeated + CompilerPass {
    visit_mut_pass(TreeShaker {
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            is_unresolved_ref_safe: false,
            in_strict: false,
            remaining_depth: 2,
        },
        config,
        changed: false,
        pass: 0,
        in_fn: false,
        in_block_stmt: false,
        var_decl_kind: None,
        data: Default::default(),
    })
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Config {
    /// If this [Mark] is applied to a function expression, it's treated as a
    /// separate module.
    ///
    /// **Note**: This is hack to make operation parallel while allowing invalid
    /// module produced by the `swc_bundler`.
    pub module_mark: Option<Mark>,

    /// If true, top-level items will be removed if they are not used.
    ///
    /// Defaults to `true`.
    pub top_level: bool,

    /// Declarations with a symbol in this set will be preserved.
    pub top_retain: Vec<Atom>,

    /// If false, imports with side effects will be removed.
    pub preserve_imports_with_side_effects: bool,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            module_mark: Default::default(),
            top_level: true,
            top_retain: Default::default(),
            preserve_imports_with_side_effects: true,
        }
    }
}

struct TreeShaker {
    expr_ctx: ExprCtx,

    config: Config,
    changed: bool,
    pass: u16,

    in_fn: bool,
    in_block_stmt: bool,
    var_decl_kind: Option<VarDeclKind>,

    data: Data,
}

impl CompilerPass for TreeShaker {
    fn name(&self) -> Cow<'static, str> {
        Cow::Borrowed("tree-shaker")
    }
}

#[derive(Default)]
struct Data {
    initialized: bool,

    used_names: FxHashMap<Id, VarInfo>,

    /// Variable usage graph
    ///
    /// We use `u32` because [FastDiGraphMap] stores types as `(N, 1 bit)` so if
    /// we use u32 it fits into the cache line of cpu.
    graph: GraphMap<u32, VarInfo, Directed, FxBuildHasher>,
    /// Entrypoints.
    entries: FxHashSet<u32>,

    graph_ix: IndexSet<Id, FxBuildHasher>,
    
    /// Control Flow Graph for improved analysis
    cfg: ControlFlowGraph,
}

impl Data {
    fn drop_usage(&mut self, id: &Id) {
        if let Some(e) = self.used_names.get_mut(id) {
            // We use `saturating_sub` to avoid underflow.
            // We subtract the cycle count from the occurence count, so the value is not
            // correct representation of the actual usage.
            e.usage = e.usage.saturating_sub(1);

            if e.usage == 0 && e.assign == 0 {
                if let Some(n) = self.get_node(id) {
                    self.graph.remove_node(n);
                }
            }
        } else if let Some(n) = self.get_node(id) {
            self.graph.remove_node(n);
        }
    }

    fn drop_assign(&mut self, id: &Id) {
        if let Some(e) = self.used_names.get_mut(id) {
            // We use `saturating_sub` to avoid underflow.
            // We subtract the cycle count from the occurence count, so the value is not
            // correct representation of the actual usage.
            e.assign = e.assign.saturating_sub(1);

            if e.usage == 0 && e.assign == 0 {
                if let Some(n) = self.get_node(id) {
                    self.graph.remove_node(n);
                }
            }
        } else if let Some(n) = self.get_node(id) {
            self.graph.remove_node(n);
        }
    }

    fn get_node(&self, id: &Id) -> Option<u32> {
        self.graph_ix.get_index_of(id).map(|ix| ix as _)
    }

    fn node(&mut self, id: &Id) -> u32 {
        self.graph_ix.get_index_of(id).unwrap_or_else(|| {
            let ix = self.graph_ix.len();
            self.graph_ix.insert_full(id.clone());
            ix
        }) as _
    }

    /// Add an edge to dependency graph
    fn add_dep_edge(&mut self, from: &Id, to: &Id, assign: bool) {
        let from = self.node(from);
        let to = self.node(to);

        match self.graph.edge_weight_mut(from, to) {
            Some(info) => {
                if assign {
                    info.assign += 1;
                } else {
                    info.usage += 1;
                }
            }
            None => {
                self.graph.add_edge(
                    from,
                    to,
                    VarInfo {
                        usage: u32::from(!assign),
                        assign: u32::from(assign),
                    },
                );
            }
        };
    }

    /// Traverse the graph and subtract usages from `used_names`.
    fn subtract_cycles(&mut self) {
        let cycles = tarjan_scc(&self.graph);

        'c: for cycle in cycles {
            if cycle.len() == 1 {
                continue;
            }

            // We have to exclude cycle from remove list if an outer node refences an item
            // of cycle.
            for &node in &cycle {
                // It's referenced by an outer node.
                if self.entries.contains(&node) {
                    continue 'c;
                }

                // If any node in cycle is referenced by an outer node, we
                // should not remove the cycle
                if self.graph.neighbors_directed(node, Incoming).any(|source| {
                    // Node in cycle does not matter
                    !cycle.contains(&source)
                }) {
                    continue 'c;
                }
            }

            for &i in &cycle {
                for &j in &cycle {
                    if i == j {
                        continue;
                    }

                    let id = self.graph_ix.get_index(j as _);
                    let id = match id {
                        Some(id) => id,
                        None => continue,
                    };

                    if let Some(w) = self.graph.edge_weight(i, j) {
                        let e = self.used_names.entry(id.clone()).or_default();
                        e.usage -= w.usage;
                        e.assign -= w.assign;
                    }
                }
            }
        }
    }

    /// Improved dead code detection using CFG analysis
    fn detect_dead_code_with_cfg(&mut self) -> FxHashSet<Id> {
        let mut dead_vars = FxHashSet::default();
        
        // Mark entry blocks as reachable
        let entry_blocks = self.cfg.entry_blocks.clone();
        for &entry_id in &entry_blocks {
            self.cfg.mark_reachable(entry_id);
        }
        
        // Find unreachable blocks
        let unreachable_blocks = self.cfg.find_unreachable_blocks();
        
        // Variables defined only in unreachable blocks are dead
        for &block_id in &unreachable_blocks {
            if let Some(&block_idx) = self.cfg.block_map.get(&block_id) {
                let block = &self.cfg.blocks[block_idx];
                for var in &block.defs {
                    // Check if variable is defined elsewhere in reachable code
                    let is_live_elsewhere = self.cfg.blocks.iter()
                        .any(|other_block| {
                            other_block.reachable && 
                            other_block.id != block_id &&
                            other_block.defs.contains(var)
                        });
                    
                    if !is_live_elsewhere {
                        dead_vars.insert(var.clone());
                    }
                }
            }
        }
        
        // Perform live variable analysis
        let live_vars = self.cfg.compute_live_variables();
        
        // Find variables that are defined but never live
        for block in &self.cfg.blocks {
            if !block.reachable {
                continue;
            }
            
            let block_live = live_vars.get(&block.id).cloned().unwrap_or_default();
            
            for def_var in &block.defs {
                // If a variable is defined but not live at any point, it's dead
                if !block_live.contains(def_var) && 
                   !self.is_variable_live_in_any_successor(def_var, &block.successors, &live_vars) {
                    dead_vars.insert(def_var.clone());
                }
            }
        }
        
        dead_vars
    }
    
    /// Check if variable is live in any successor block
    fn is_variable_live_in_any_successor(
        &self, 
        var: &Id, 
        successors: &[u32], 
        live_vars: &FxHashMap<u32, FxHashSet<Id>>
    ) -> bool {
        successors.iter().any(|&succ_id| {
            live_vars.get(&succ_id)
                .map(|live_set| live_set.contains(var))
                .unwrap_or(false)
        })
    }

}

/// Graph modification
impl Data {
    fn drop_ast_node<N>(&mut self, node: &N)
    where
        N: for<'aa> VisitWith<Dropper<'aa>>,
    {
        let mut dropper = Dropper { data: self };

        node.visit_with(&mut dropper);
    }
}

struct Dropper<'a> {
    data: &'a mut Data,
}

impl<'a> Visit for Dropper<'a> {
    noop_visit_type!(fail);

    fn visit_binding_ident(&mut self, node: &BindingIdent) {
        node.visit_children_with(self);

        self.data.drop_assign(&node.to_id());
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        node.visit_children_with(self);

        self.data.drop_assign(&node.ident.to_id());
    }

    fn visit_class_expr(&mut self, node: &ClassExpr) {
        node.visit_children_with(self);

        if let Some(i) = &node.ident {
            self.data.drop_assign(&i.to_id());
        }
    }

    fn visit_expr(&mut self, expr: &Expr) {
        expr.visit_children_with(self);

        if let Expr::Ident(i) = expr {
            self.data.drop_usage(&i.to_id());
        }
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        node.visit_children_with(self);

        self.data.drop_assign(&node.ident.to_id());
    }

    fn visit_fn_expr(&mut self, node: &FnExpr) {
        node.visit_children_with(self);

        if let Some(i) = &node.ident {
            self.data.drop_assign(&i.to_id());
        }
    }
}

#[derive(Debug, Default)]
struct VarInfo {
    /// This does not include self-references in a function.
    pub usage: u32,
    /// This does not include self-references in a function.
    pub assign: u32,
}

/// Control Flow Graph for better dead code analysis
#[derive(Default)]
struct ControlFlowGraph {
    /// Basic blocks in the control flow
    blocks: Vec<CfgBlock>,
    /// Mapping from block ID to block index
    block_map: FxHashMap<u32, usize>,
    /// Current block ID counter
    next_block_id: u32,
    /// Entry blocks for the current scope
    entry_blocks: Vec<u32>,
    /// Exit blocks for the current scope
    #[allow(dead_code)]
    exit_blocks: Vec<u32>,
}

#[derive(Debug, Clone)]
struct CfgBlock {
    id: u32,
    /// Variables defined in this block
    defs: FxHashSet<Id>,
    /// Variables used in this block
    uses: FxHashSet<Id>,
    /// Successor blocks (for control flow)
    successors: Vec<u32>,
    /// Predecessor blocks (for control flow)
    predecessors: Vec<u32>,
    /// Whether this block is reachable
    reachable: bool,
    /// Block type for different analysis
    #[allow(dead_code)]
    block_type: CfgBlockType,
}

#[derive(Debug, Clone, PartialEq)]
#[allow(dead_code)]
enum CfgBlockType {
    /// Normal sequential block
    Normal,
    /// Conditional branch (if, switch, etc.)
    Conditional,
    /// Loop header
    LoopHeader,
    /// Loop body
    LoopBody,
    /// Function entry
    FunctionEntry,
    /// Function exit
    FunctionExit,
    /// Exception handler
    ExceptionHandler,
}

impl ControlFlowGraph {
    fn new() -> Self {
        Default::default()
    }

    fn create_block(&mut self, block_type: CfgBlockType) -> u32 {
        let id = self.next_block_id;
        self.next_block_id += 1;
        
        let block = CfgBlock {
            id,
            defs: Default::default(),
            uses: Default::default(),
            successors: Vec::new(),
            predecessors: Vec::new(),
            reachable: false,
            block_type,
        };
        
        let index = self.blocks.len();
        self.blocks.push(block);
        self.block_map.insert(id, index);
        
        id
    }

    fn add_edge(&mut self, from: u32, to: u32) {
        if let (Some(&from_idx), Some(&to_idx)) = (
            self.block_map.get(&from),
            self.block_map.get(&to),
        ) {
            self.blocks[from_idx].successors.push(to);
            self.blocks[to_idx].predecessors.push(from);
        }
    }

    fn add_def(&mut self, block_id: u32, var: Id) {
        if let Some(&idx) = self.block_map.get(&block_id) {
            self.blocks[idx].defs.insert(var);
        }
    }

    fn add_use(&mut self, block_id: u32, var: Id) {
        if let Some(&idx) = self.block_map.get(&block_id) {
            self.blocks[idx].uses.insert(var);
        }
    }

    fn mark_reachable(&mut self, block_id: u32) {
        if let Some(&idx) = self.block_map.get(&block_id) {
            if !self.blocks[idx].reachable {
                self.blocks[idx].reachable = true;
                
                // Mark all successors reachable
                let successors = self.blocks[idx].successors.clone();
                for succ in successors {
                    self.mark_reachable(succ);
                }
            }
        }
    }

    /// Perform data flow analysis to find live variables
    fn compute_live_variables(&mut self) -> FxHashMap<u32, FxHashSet<Id>> {
        let mut live_out: FxHashMap<u32, FxHashSet<Id>> = FxHashMap::default();
        let mut changed = true;

        // Initialize
        for block in &self.blocks {
            live_out.insert(block.id, FxHashSet::default());
        }

        // Fixed-point iteration
        while changed {
            changed = false;
            
            // Process blocks in reverse order
            for block in self.blocks.iter().rev() {
                if !block.reachable {
                    continue;
                }

                let mut new_live_out = FxHashSet::default();
                
                // live_out[B] = Union of live_in[S] for all successors S
                for &succ_id in &block.successors {
                    if let Some(&succ_idx) = self.block_map.get(&succ_id) {
                        let succ_block = &self.blocks[succ_idx];
                        
                        // live_in[S] = use[S] ∪ (live_out[S] - def[S])
                        let mut live_in = succ_block.uses.clone();
                        if let Some(succ_live_out) = live_out.get(&succ_id) {
                            for var in succ_live_out {
                                if !succ_block.defs.contains(var) {
                                    live_in.insert(var.clone());
                                }
                            }
                        }
                        
                        new_live_out.extend(live_in);
                    }
                }
                
                if let Some(old_live_out) = live_out.get(&block.id) {
                    if *old_live_out != new_live_out {
                        changed = true;
                    }
                }
                
                live_out.insert(block.id, new_live_out);
            }
        }

        live_out
    }

    /// Find unreachable blocks
    fn find_unreachable_blocks(&self) -> Vec<u32> {
        self.blocks
            .iter()
            .filter(|block| !block.reachable)
            .map(|block| block.id)
            .collect()
    }
}

struct Analyzer<'a> {
    #[allow(dead_code)]
    config: &'a Config,
    in_var_decl: bool,
    scope: Scope<'a>,
    data: &'a mut Data,
    cur_class_id: Option<Id>,
    cur_fn_id: Option<Id>,
    
    /// Current basic block in CFG analysis
    current_block: Option<u32>,
    /// Block stack for nested control structures
    block_stack: Vec<CfgContext>,
}

#[derive(Debug, Clone)]
struct CfgContext {
    /// Current block being processed
    current_block: u32,
    /// Break target for loops/switches
    break_target: Option<u32>,
    /// Continue target for loops
    continue_target: Option<u32>,
    /// Context type
    #[allow(dead_code)]
    context_type: CfgContextType,
}

#[derive(Debug, Clone, PartialEq)]
#[allow(dead_code)]
enum CfgContextType {
    Function,
    Loop,
    Switch,
    Block,
    Conditional,
}

#[derive(Debug, Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,

    bindings_affected_by_eval: FxHashSet<Id>,
    found_direct_eval: bool,

    found_arguemnts: bool,
    bindings_affected_by_arguements: Vec<Id>,

    /// Used to construct a graph.
    ///
    /// This includes all bindings to current node.
    ast_path: Vec<Id>,
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
enum ScopeKind {
    Fn,
    ArrowFn,
}

impl Default for ScopeKind {
    fn default() -> Self {
        Self::Fn
    }
}

impl Analyzer<'_> {
    fn with_ast_path<F>(&mut self, ids: Vec<Id>, op: F)
    where
        F: for<'aa> FnOnce(&mut Analyzer<'aa>),
    {
        let prev_len = self.scope.ast_path.len();

        self.scope.ast_path.extend(ids);

        op(self);

        self.scope.ast_path.truncate(prev_len);
    }

    /// Create a new basic block and make it current
    fn create_block(&mut self, block_type: CfgBlockType) -> u32 {
        let block_id = self.data.cfg.create_block(block_type);
        self.current_block = Some(block_id);
        block_id
    }

    /// Switch to an existing block
    fn switch_to_block(&mut self, block_id: u32) {
        self.current_block = Some(block_id);
    }

    /// Add edge from current block to target block
    fn add_edge_to(&mut self, target_block: u32) {
        if let Some(current) = self.current_block {
            self.data.cfg.add_edge(current, target_block);
        }
    }

    /// Record variable definition in current block
    fn record_def(&mut self, id: &Id) {
        if let Some(block_id) = self.current_block {
            self.data.cfg.add_def(block_id, id.clone());
        }
    }

    /// Record variable use in current block
    fn record_use(&mut self, id: &Id) {
        if let Some(block_id) = self.current_block {
            self.data.cfg.add_use(block_id, id.clone());
        }
    }

    /// Enter a new CFG context (loop, function, etc.)
    fn enter_cfg_context(&mut self, context_type: CfgContextType) -> CfgContext {
        let current_block = self.current_block.unwrap_or_else(|| {
            self.create_block(match context_type {
                CfgContextType::Function => CfgBlockType::FunctionEntry,
                CfgContextType::Loop => CfgBlockType::LoopHeader,
                _ => CfgBlockType::Normal,
            })
        });

        let context = CfgContext {
            current_block,
            break_target: None,
            continue_target: None,
            context_type,
        };

        self.block_stack.push(context.clone());
        context
    }

    /// Exit current CFG context
    fn exit_cfg_context(&mut self) {
        self.block_stack.pop();
        if let Some(parent_context) = self.block_stack.last() {
            self.current_block = Some(parent_context.current_block);
        }
    }

    /// Find the nearest context of given type
    #[allow(dead_code)]
    fn find_context(&self, context_type: CfgContextType) -> Option<&CfgContext> {
        self.block_stack.iter().rev().find(|ctx| ctx.context_type == context_type)
    }

    fn with_scope<F>(&mut self, kind: ScopeKind, op: F)
    where
        F: for<'aa> FnOnce(&mut Analyzer<'aa>),
    {
        let child_scope = {
            let child = Scope {
                parent: Some(&self.scope),
                ..Default::default()
            };

            let mut v = Analyzer {
                config: self.config,
                in_var_decl: self.in_var_decl,
                scope: child,
                data: self.data,
                cur_fn_id: self.cur_fn_id.clone(),
                cur_class_id: self.cur_class_id.clone(),
                current_block: self.current_block,
                block_stack: self.block_stack.clone(),
            };

            op(&mut v);

            Scope {
                parent: None,
                ..v.scope
            }
        };

        // If we found eval, mark all declarations in scope and upper as used
        if child_scope.found_direct_eval {
            for id in child_scope.bindings_affected_by_eval {
                self.data.used_names.entry(id).or_default().usage += 1;
            }

            self.scope.found_direct_eval = true;
        }

        if child_scope.found_arguemnts {
            // Parameters

            for id in child_scope.bindings_affected_by_arguements {
                self.data.used_names.entry(id).or_default().usage += 1;
            }

            if !matches!(kind, ScopeKind::Fn) {
                self.scope.found_arguemnts = true;
            }
        }
    }

    /// Mark `id` as used
    fn add(&mut self, id: Id, assign: bool) {
        if id.0 == atom!("arguments") {
            self.scope.found_arguemnts = true;
        }

        if let Some(f) = &self.cur_fn_id {
            if id == *f {
                return;
            }
        }
        if let Some(f) = &self.cur_class_id {
            if id == *f {
                return;
            }
        }

        // Record in CFG
        if assign {
            self.record_def(&id);
        } else {
            self.record_use(&id);
        }

        if self.scope.is_ast_path_empty() {
            // Add references from top level items into graph
            let idx = self.data.node(&id);
            self.data.entries.insert(idx);
        } else {
            let mut scope = Some(&self.scope);

            while let Some(s) = scope {
                for component in &s.ast_path {
                    self.data.add_dep_edge(component, &id, assign);
                }

                if s.kind == ScopeKind::Fn && !s.ast_path.is_empty() {
                    break;
                }

                scope = s.parent;
            }
        }

        if assign {
            self.data.used_names.entry(id).or_default().assign += 1;
        } else {
            self.data.used_names.entry(id).or_default().usage += 1;
        }
    }
}

impl Visit for Analyzer<'_> {
    noop_visit_type!();

    fn visit_callee(&mut self, n: &Callee) {
        n.visit_children_with(self);

        if let Callee::Expr(e) = n {
            if e.is_ident_ref_to("eval") {
                self.scope.found_direct_eval = true;
            }
        }
    }

    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        n.visit_children_with(self);

        self.add(n.key.to_id(), true);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        self.with_ast_path(vec![n.ident.to_id()], |v| {
            let old = v.cur_class_id.take();
            v.cur_class_id = Some(n.ident.to_id());
            n.visit_children_with(v);
            v.cur_class_id = old;

            if !n.class.decorators.is_empty() {
                v.add(n.ident.to_id(), false);
            }
        })
    }

    fn visit_class_expr(&mut self, n: &ClassExpr) {
        n.visit_children_with(self);

        if !n.class.decorators.is_empty() {
            if let Some(i) = &n.ident {
                self.add(i.to_id(), false);
            }
        }
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        if let ModuleExportName::Ident(orig) = &n.orig {
            self.add(orig.to_id(), false);
        }
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        let name = match &n.decl {
            Decl::Class(c) => vec![c.ident.to_id()],
            Decl::Fn(f) => vec![f.ident.to_id()],
            Decl::Var(v) => v
                .decls
                .iter()
                .flat_map(|d| find_pat_ids(d).into_iter())
                .collect(),
            _ => Vec::new(),
        };
        for ident in name {
            self.add(ident, false);
        }

        n.visit_children_with(self)
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_in_var_decl = self.in_var_decl;

        self.in_var_decl = false;
        e.visit_children_with(self);

        if let Expr::Ident(i) = e {
            self.add(i.to_id(), false);
        }

        self.in_var_decl = old_in_var_decl;
    }

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        match n.op {
            op!("=") => {
                if let Some(i) = n.left.as_ident() {
                    self.add(i.to_id(), true);
                    n.right.visit_with(self);
                } else {
                    n.visit_children_with(self);
                }
            }
            _ => {
                if let Some(i) = n.left.as_ident() {
                    self.add(i.to_id(), false);
                    self.add(i.to_id(), true);
                    n.right.visit_with(self);
                } else {
                    n.visit_children_with(self);
                }
            }
        }
    }

    fn visit_jsx_element_name(&mut self, e: &JSXElementName) {
        e.visit_children_with(self);

        if let JSXElementName::Ident(i) = e {
            self.add(i.to_id(), false);
        }
    }

    fn visit_jsx_object(&mut self, e: &JSXObject) {
        e.visit_children_with(self);

        if let JSXObject::Ident(i) = e {
            self.add(i.to_id(), false);
        }
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.with_scope(ScopeKind::ArrowFn, |v| {
            let _context = v.enter_cfg_context(CfgContextType::Function);
            
            n.visit_children_with(v);

            if v.scope.found_direct_eval {
                v.scope.bindings_affected_by_eval = collect_decls(n);
            }
            
            v.exit_cfg_context();
        })
    }

    fn visit_function(&mut self, n: &Function) {
        self.with_scope(ScopeKind::Fn, |v| {
            let _context = v.enter_cfg_context(CfgContextType::Function);
            
            n.visit_children_with(v);

            if v.scope.found_direct_eval {
                v.scope.bindings_affected_by_eval = collect_decls(n);
            }

            if v.scope.found_arguemnts {
                v.scope.bindings_affected_by_arguements = find_pat_ids(&n.params);
            }
            
            v.exit_cfg_context();
        })
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        self.with_ast_path(vec![n.ident.to_id()], |v| {
            let old = v.cur_fn_id.take();
            v.cur_fn_id = Some(n.ident.to_id());
            n.visit_children_with(v);
            v.cur_fn_id = old;

            if !n.function.decorators.is_empty() {
                v.add(n.ident.to_id(), false);
            }
        })
    }

    fn visit_fn_expr(&mut self, n: &FnExpr) {
        n.visit_children_with(self);

        if !n.function.decorators.is_empty() {
            if let Some(i) = &n.ident {
                self.add(i.to_id(), false);
            }
        }
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if !self.in_var_decl {
            if let Pat::Ident(i) = p {
                self.add(i.to_id(), true);
            }
        }
    }

    fn visit_prop(&mut self, p: &Prop) {
        p.visit_children_with(self);

        if let Prop::Shorthand(i) = p {
            self.add(i.to_id(), false);
        }
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        let old = self.in_var_decl;

        self.in_var_decl = true;
        n.name.visit_with(self);

        self.in_var_decl = false;
        n.init.visit_with(self);

        self.in_var_decl = old;
    }

    /// Handle if statements with proper CFG construction
    fn visit_if_stmt(&mut self, n: &IfStmt) {
        // Visit condition
        n.test.visit_with(self);

        // Create blocks for then and else branches
        let then_block = self.create_block(CfgBlockType::Normal);
        let else_block = if n.alt.is_some() {
            Some(self.create_block(CfgBlockType::Normal))
        } else {
            None
        };
        let merge_block = self.create_block(CfgBlockType::Normal);

        // Add edges from condition to branches
        self.add_edge_to(then_block);
        if let Some(else_id) = else_block {
            self.add_edge_to(else_id);
        } else {
            self.add_edge_to(merge_block);
        }

        // Process then branch
        self.switch_to_block(then_block);
        let _context = self.enter_cfg_context(CfgContextType::Conditional);
        n.cons.visit_with(self);
        self.add_edge_to(merge_block);
        self.exit_cfg_context();

        // Process else branch if exists
        if let Some(alt) = &n.alt {
            if let Some(else_id) = else_block {
                self.switch_to_block(else_id);
                let _context = self.enter_cfg_context(CfgContextType::Conditional);
                alt.visit_with(self);
                self.add_edge_to(merge_block);
                self.exit_cfg_context();
            }
        }

        // Continue with merge block
        self.switch_to_block(merge_block);
    }

    /// Handle while loops
    fn visit_while_stmt(&mut self, n: &WhileStmt) {
        let loop_header = self.create_block(CfgBlockType::LoopHeader);
        let loop_body = self.create_block(CfgBlockType::LoopBody);
        let exit_block = self.create_block(CfgBlockType::Normal);

        // Jump to loop header
        self.add_edge_to(loop_header);
        self.switch_to_block(loop_header);

        // Visit condition
        n.test.visit_with(self);

        // Add edges for loop condition
        self.add_edge_to(loop_body);  // true branch
        self.add_edge_to(exit_block); // false branch

        // Process loop body
        self.switch_to_block(loop_body);
        let mut context = self.enter_cfg_context(CfgContextType::Loop);
        context.break_target = Some(exit_block);
        context.continue_target = Some(loop_header);

        n.body.visit_with(self);

        // Loop back to header
        self.add_edge_to(loop_header);
        self.exit_cfg_context();

        // Continue with exit block
        self.switch_to_block(exit_block);
    }

    /// Handle for loops
    fn visit_for_stmt(&mut self, n: &ForStmt) {
        // Visit init
        if let Some(init) = &n.init {
            init.visit_with(self);
        }

        let loop_header = self.create_block(CfgBlockType::LoopHeader);
        let loop_body = self.create_block(CfgBlockType::LoopBody);
        let update_block = self.create_block(CfgBlockType::Normal);
        let exit_block = self.create_block(CfgBlockType::Normal);

        // Jump to loop header
        self.add_edge_to(loop_header);
        self.switch_to_block(loop_header);

        // Visit condition
        if let Some(test) = &n.test {
            test.visit_with(self);
        }

        // Add edges for loop condition
        self.add_edge_to(loop_body);  // true branch
        self.add_edge_to(exit_block); // false branch

        // Process loop body
        self.switch_to_block(loop_body);
        let mut context = self.enter_cfg_context(CfgContextType::Loop);
        context.break_target = Some(exit_block);
        context.continue_target = Some(update_block);

        n.body.visit_with(self);
        self.add_edge_to(update_block);
        self.exit_cfg_context();

        // Process update
        self.switch_to_block(update_block);
        if let Some(update) = &n.update {
            update.visit_with(self);
        }
        self.add_edge_to(loop_header);

        // Continue with exit block
        self.switch_to_block(exit_block);
    }
}

impl Repeated for TreeShaker {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.pass += 1;
        self.changed = false;
    }
}

impl TreeShaker {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self> + Send + Sync,
        Vec<T>: VisitMutWith<Self>,
    {
        if let Some(Stmt::Expr(ExprStmt { expr, .. })) = stmts.first().and_then(|s| s.as_stmt()) {
            if let Expr::Lit(Lit::Str(v)) = &**expr {
                if &*v.value == "use asm" {
                    return;
                }
            }
        }

        self.visit_mut_par(cpu_count() * 8, stmts);

        stmts.retain(|s| match s.as_stmt() {
            Some(Stmt::Empty(..)) => false,
            Some(Stmt::Block(s)) if s.is_empty() => {
                debug!("Dropping an empty block statement");
                false
            }
            _ => true,
        });
    }

    fn can_drop_binding(&self, name: Id, is_var: bool) -> bool {
        if !self.config.top_level {
            if is_var {
                if !self.in_fn {
                    return false;
                }
            } else if !self.in_block_stmt {
                return false;
            }
        }

        if self.config.top_retain.contains(&name.0) {
            return false;
        }

        // Check CFG-based liveness only as additional information
        // Don't make it the primary decision factor to maintain compatibility
        let _is_cfg_dead = self.is_variable_dead_in_cfg(&name);

        match self.data.used_names.get(&name) {
            Some(v) => v.usage == 0 && v.assign == 0,
            None => true,
        }
    }
    
    /// Check if variable is dead according to CFG analysis
    fn is_variable_dead_in_cfg(&self, name: &Id) -> bool {
        // Check if variable is defined only in unreachable blocks
        let mut defined_in_reachable = false;
        let mut defined_in_unreachable = false;
        
        for block in &self.data.cfg.blocks {
            if block.defs.contains(name) {
                if block.reachable {
                    defined_in_reachable = true;
                } else {
                    defined_in_unreachable = true;
                }
            }
        }
        
        // If only defined in unreachable blocks, it's dead
        if defined_in_unreachable && !defined_in_reachable {
            return true;
        }
        
        // Check if variable is never used in any reachable block
        let used_in_reachable = self.data.cfg.blocks.iter()
            .any(|block| block.reachable && block.uses.contains(name));
            
        !used_in_reachable && defined_in_reachable
    }

    fn can_drop_assignment_to(&self, name: Id, is_var: bool) -> bool {
        if !self.config.top_level {
            if is_var {
                if !self.in_fn {
                    return false;
                }
            } else if !self.in_block_stmt {
                return false;
            }

            // Abort if the variable is declared on top level scope.
            let ix = self.data.graph_ix.get_index_of(&name);
            if let Some(ix) = ix {
                if self.data.entries.contains(&(ix as u32)) {
                    return false;
                }
            }
        }

        if self.config.top_retain.contains(&name.0) {
            return false;
        }

        // If the name is unresolved, it should be preserved
        self.expr_ctx.unresolved_ctxt != name.1
            && self
                .data
                .used_names
                .get(&name)
                .map(|v| v.usage == 0)
                .unwrap_or_default()
    }

    /// Drops RHS from `null && foo`
    fn optimize_bin_expr(&mut self, n: &mut Expr) {
        let Expr::Bin(b) = n else {
            return;
        };

        if b.op == op!("&&") && b.left.as_pure_bool(self.expr_ctx) == Known(false) {
            self.data.drop_ast_node(&b.right);
            *n = *b.left.take();
            self.changed = true;
            return;
        }

        if b.op == op!("||") && b.left.as_pure_bool(self.expr_ctx) == Known(true) {
            self.data.drop_ast_node(&b.right);
            *n = *b.left.take();
            self.changed = true;
        }
    }

    fn visit_mut_par<N>(&mut self, _threshold: usize, nodes: &mut [N])
    where
        N: Send + Sync + VisitMutWith<Self>,
    {
        for n in nodes {
            n.visit_mut_with(self);
        }
    }
}

impl VisitMut for TreeShaker {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        n.visit_mut_children_with(self);

        if let Some(id) = n.left.as_ident() {
            // TODO: `var`
            if self.can_drop_assignment_to(id.to_id(), false)
                && !n.right.may_have_side_effects(self.expr_ctx)
            {
                self.changed = true;
                debug!("Dropping an assignment to `{}` because it's not used", id);
                self.data.drop_ast_node(&n.left);

                n.left.take();
            }
        }
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let old_in_block_stmt = self.in_block_stmt;
        self.in_block_stmt = true;
        n.visit_mut_children_with(self);
        self.in_block_stmt = old_in_block_stmt;
    }

    fn visit_mut_block_stmt_or_expr(&mut self, n: &mut BlockStmtOrExpr) {
        let old_in_fn = self.in_fn;
        self.in_fn = true;
        n.visit_mut_children_with(self);
        self.in_fn = old_in_fn;
    }

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        self.visit_mut_par(cpu_count() * 8, members);
    }

    fn visit_mut_decl(&mut self, n: &mut Decl) {
        n.visit_mut_children_with(self);

        match n {
            Decl::Fn(f) => {
                if self.can_drop_binding(f.ident.to_id(), true) {
                    debug!("Dropping function `{}` as it's not used", f.ident);
                    self.changed = true;

                    self.data.drop_ast_node(&*f);

                    n.take();
                }
            }
            Decl::Class(c) => {
                if self.can_drop_binding(c.ident.to_id(), false)
                    && c.class
                        .super_class
                        .as_deref()
                        .map_or(true, |e| !e.may_have_side_effects(self.expr_ctx))
                    && c.class.body.iter().all(|m| match m {
                        ClassMember::Method(m) => !matches!(m.key, PropName::Computed(..)),
                        ClassMember::ClassProp(m) => {
                            !matches!(m.key, PropName::Computed(..))
                                && !m
                                    .value
                                    .as_deref()
                                    .is_some_and(|e| e.may_have_side_effects(self.expr_ctx))
                        }
                        ClassMember::AutoAccessor(m) => {
                            !matches!(m.key, Key::Public(PropName::Computed(..)))
                                && !m
                                    .value
                                    .as_deref()
                                    .is_some_and(|e| e.may_have_side_effects(self.expr_ctx))
                        }

                        ClassMember::PrivateProp(m) => !m
                            .value
                            .as_deref()
                            .is_some_and(|e| e.may_have_side_effects(self.expr_ctx)),

                        ClassMember::StaticBlock(_) => false,

                        ClassMember::TsIndexSignature(_)
                        | ClassMember::Empty(_)
                        | ClassMember::Constructor(_)
                        | ClassMember::PrivateMethod(_) => true,
                    })
                {
                    debug!("Dropping class `{}` as it's not used", c.ident);
                    self.changed = true;

                    self.data.drop_ast_node(&*c);
                    n.take();
                }
            }
            _ => {}
        }
    }

    fn visit_mut_export_decl(&mut self, n: &mut ExportDecl) {
        match &mut n.decl {
            Decl::Var(v) => {
                for decl in v.decls.iter_mut() {
                    decl.init.visit_mut_with(self);
                }
            }
            _ => {
                // Bypass visit_mut_decl
                n.decl.visit_mut_children_with(self);
            }
        }
    }

    /// Noop.
    fn visit_mut_export_default_decl(&mut self, _: &mut ExportDefaultDecl) {}

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        self.optimize_bin_expr(n);

        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            args,
            ..
        }) = n
        {
            //
            if args.is_empty() {
                match &mut **callee {
                    Expr::Fn(FnExpr {
                        ident: None,
                        function: f,
                    }) if matches!(
                        &**f,
                        Function {
                            is_async: false,
                            is_generator: false,
                            body: Some(..),
                            ..
                        }
                    ) =>
                    {
                        if f.params.is_empty() && f.body.as_ref().unwrap().stmts.len() == 1 {
                            if let Stmt::Return(ReturnStmt { arg: Some(arg), .. }) =
                                &mut f.body.as_mut().unwrap().stmts[0]
                            {
                                if let Expr::Object(ObjectLit { props, .. }) = &**arg {
                                    if props.iter().all(|p| match p {
                                        PropOrSpread::Spread(_) => false,
                                        PropOrSpread::Prop(p) => match &**p {
                                            Prop::Shorthand(_) => true,
                                            Prop::KeyValue(p) => p.value.is_ident(),
                                            _ => false,
                                        },
                                    }) {
                                        self.changed = true;
                                        debug!("Dropping a wrapped esm");
                                        *n = *arg.take();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    _ => (),
                }
            }
        }

        if let Expr::Assign(a) = n {
            if match &a.left {
                AssignTarget::Simple(l) => l.is_invalid(),
                AssignTarget::Pat(l) => l.is_invalid(),
            } {
                *n = *a.right.take();
            }
        }

        if !n.is_invalid() {
            debug_assert_valid(n);
        }
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.visit_mut_par(cpu_count() * 8, n);
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.visit_mut_par(cpu_count() * 8, n);
    }

    fn visit_mut_for_head(&mut self, n: &mut ForHead) {
        match n {
            ForHead::VarDecl(..) | ForHead::UsingDecl(..) => {}
            ForHead::Pat(v) => {
                v.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        let old_in_fn = self.in_fn;
        self.in_fn = true;
        n.visit_mut_children_with(self);
        self.in_fn = old_in_fn;
    }

    fn visit_mut_import_specifiers(&mut self, ss: &mut Vec<ImportSpecifier>) {
        ss.retain(|s| {
            let local = match s {
                ImportSpecifier::Named(l) => &l.local,
                ImportSpecifier::Default(l) => &l.local,
                ImportSpecifier::Namespace(l) => &l.local,
            };

            if self.can_drop_binding(local.to_id(), false) {
                debug!(
                    "Dropping import specifier `{}` because it's not used",
                    local
                );
                self.changed = true;
                return false;
            }

            true
        });
    }

    fn visit_mut_module(&mut self, m: &mut Module) {
        debug_assert_valid(m);

        let _tracing = span!(Level::ERROR, "tree-shaker", pass = self.pass).entered();

        if !self.data.initialized {
            let mut data = Data {
                initialized: true,
                cfg: ControlFlowGraph::new(),
                ..Default::default()
            };

            {
                let mut analyzer = Analyzer {
                    config: &self.config,
                    in_var_decl: false,
                    scope: Default::default(),
                    data: &mut data,
                    cur_class_id: Default::default(),
                    cur_fn_id: Default::default(),
                    current_block: None,
                    block_stack: Vec::new(),
                };
                
                // Create entry block for module
                let entry_block = analyzer.create_block(CfgBlockType::Normal);
                analyzer.data.cfg.entry_blocks.push(entry_block);
                
                m.visit_with(&mut analyzer);
            }
            
            // Perform CFG-based dead code analysis
            let _dead_vars = data.detect_dead_code_with_cfg();
            
            data.subtract_cycles();
            self.data = data;
        } else {
            self.data.subtract_cycles();
        }

        m.visit_mut_children_with(self);
    }

    fn visit_mut_module_item(&mut self, n: &mut ModuleItem) {
        match n {
            ModuleItem::ModuleDecl(ModuleDecl::Import(i)) => {
                let is_for_side_effect = i.specifiers.is_empty();

                i.visit_mut_with(self);

                if !self.config.preserve_imports_with_side_effects
                    && !is_for_side_effect
                    && i.specifiers.is_empty()
                {
                    debug!("Dropping an import because it's not used");
                    self.changed = true;
                    *n = EmptyStmt { span: DUMMY_SP }.into();
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
        debug_assert_valid(n);
    }

    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s);
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.visit_mut_par(cpu_count() * 8, n);
    }

    fn visit_mut_prop_or_spreads(&mut self, n: &mut Vec<PropOrSpread>) {
        self.visit_mut_par(cpu_count() * 8, n);
    }

    fn visit_mut_script(&mut self, m: &mut Script) {
        let _tracing = span!(Level::ERROR, "tree-shaker", pass = self.pass).entered();

        if !self.data.initialized {
            let mut data = Data {
                initialized: true,
                cfg: ControlFlowGraph::new(),
                ..Default::default()
            };

            {
                let mut analyzer = Analyzer {
                    config: &self.config,
                    in_var_decl: false,
                    scope: Default::default(),
                    data: &mut data,
                    cur_class_id: Default::default(),
                    cur_fn_id: Default::default(),
                    current_block: None,
                    block_stack: Vec::new(),
                };
                
                // Create entry block for script
                let entry_block = analyzer.create_block(CfgBlockType::Normal);
                analyzer.data.cfg.entry_blocks.push(entry_block);
                
                m.visit_with(&mut analyzer);
            }
            
            // Perform CFG-based dead code analysis
            let _dead_vars = data.detect_dead_code_with_cfg();
            
            data.subtract_cycles();
            self.data = data;
        } else {
            self.data.subtract_cycles();
        }

        m.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        if let Stmt::Decl(Decl::Var(v)) = s {
            if v.decls.is_empty() {
                s.take();
                return;
            }
        }

        debug_assert_valid(s);

        if let Stmt::Decl(Decl::Var(v)) = s {
            let span = v.span;
            let cnt = v.decls.len();

            // If all name is droppable, do so.
            if cnt != 0
                && v.decls.iter().all(|vd| match &vd.name {
                    Pat::Ident(i) => self.can_drop_binding(i.to_id(), v.kind == VarDeclKind::Var),
                    _ => false,
                })
            {
                for decl in v.decls.iter() {
                    self.data.drop_ast_node(&decl.name);
                }

                let exprs = v
                    .decls
                    .take()
                    .into_iter()
                    .filter_map(|v| v.init)
                    .collect::<Vec<_>>();

                debug!(
                    count = cnt,
                    "Dropping names of variables as they are not used",
                );
                self.changed = true;

                if exprs.is_empty() {
                    *s = EmptyStmt { span: DUMMY_SP }.into();
                    return;
                } else {
                    *s = ExprStmt {
                        span,
                        expr: Expr::from_exprs(exprs),
                    }
                    .into();
                }
            }
        }

        if let Stmt::Decl(Decl::Var(v)) = s {
            if v.decls.is_empty() {
                *s = EmptyStmt { span: DUMMY_SP }.into();
            }
        }

        debug_assert_valid(s);
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s);
    }

    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        if matches!(n.op, op!("delete")) {
            return;
        }
        n.visit_mut_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(level = "debug", skip_all))]
    fn visit_mut_using_decl(&mut self, n: &mut UsingDecl) {
        for decl in n.decls.iter_mut() {
            decl.init.visit_mut_with(self);
        }
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = Some(n.kind);
        n.visit_mut_children_with(self);
        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_mut_var_decl_or_expr(&mut self, n: &mut VarDeclOrExpr) {
        match n {
            VarDeclOrExpr::VarDecl(..) => {}
            VarDeclOrExpr::Expr(v) => {
                v.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_var_declarator(&mut self, v: &mut VarDeclarator) {
        v.visit_mut_children_with(self);

        if let Pat::Ident(i) = &v.name {
            let can_drop = if let Some(init) = &v.init {
                !init.may_have_side_effects(self.expr_ctx)
            } else {
                true
            };

            if can_drop
                && self.can_drop_binding(i.to_id(), self.var_decl_kind == Some(VarDeclKind::Var))
            {
                self.changed = true;
                debug!("Dropping {} because it's not used", i);
                self.data.drop_ast_node(&*v);
                v.name.take();
            }
        }
    }

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        self.visit_mut_par(cpu_count() * 8, n);

        n.retain(|v| {
            if v.name.is_invalid() {
                return false;
            }

            true
        });
    }

    fn visit_mut_with_stmt(&mut self, n: &mut WithStmt) {
        n.obj.visit_mut_with(self);
    }
}

impl Scope<'_> {
    /// Returns true if it's not in a function or class.
    fn is_ast_path_empty(&self) -> bool {
        if !self.ast_path.is_empty() {
            return false;
        }
        match &self.parent {
            Some(p) => p.is_ast_path_empty(),
            None => true,
        }
    }
}
