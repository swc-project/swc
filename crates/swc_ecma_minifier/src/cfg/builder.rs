use swc_common::{Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use super::graph::{ControlFlowGraph, CfgNode, EdgeKind, NodeId};

pub struct CfgBuilder {
    cfg: ControlFlowGraph,
    current: NodeId,
    break_targets: Vec<(Option<Ident>, NodeId)>,
    continue_targets: Vec<(Option<Ident>, NodeId)>,
    function_stack: Vec<NodeId>,
    _switch_stack: Vec<NodeId>,
    _finally_stack: Vec<NodeId>,
}

impl CfgBuilder {
    pub fn new() -> Self {
        let cfg = ControlFlowGraph::new();
        let current = cfg.entry;
        
        Self {
            cfg,
            current,
            break_targets: Vec::new(),
            continue_targets: Vec::new(),
            function_stack: Vec::new(),
            _switch_stack: Vec::new(),
            _finally_stack: Vec::new(),
        }
    }
    
    pub fn build(mut self, program: &Program) -> ControlFlowGraph {
        program.visit_with(&mut self);
        
        if !self.cfg.blocks[&self.current].successors.contains(&self.cfg.exit) {
            self.cfg.add_edge(self.current, self.cfg.exit, EdgeKind::Normal);
        }
        
        self.cfg
    }
    
    fn connect(&mut self, from: NodeId, to: NodeId, kind: EdgeKind) {
        self.cfg.add_edge(from, to, kind);
    }
    
    fn create_node(&mut self, node: CfgNode, span: Option<Span>) -> NodeId {
        self.cfg.create_node(node, span)
    }
    
    fn visit_stmt_or_block(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::Block(block) => {
                self.visit_block_stmt(block);
            }
            _ => {
                let node_id = self.create_node(CfgNode::Statement(stmt.clone()), Some(stmt.span()));
                self.connect(self.current, node_id, EdgeKind::Normal);
                self.current = node_id;
                
                stmt.visit_children_with(self);
            }
        }
    }
    
    fn find_break_target(&self, label: &Option<Ident>) -> Option<NodeId> {
        for (target_label, target_node) in self.break_targets.iter().rev() {
            match (label, target_label) {
                (None, _) => return Some(*target_node),
                (Some(l1), Some(l2)) if l1.sym == l2.sym => return Some(*target_node),
                _ => continue,
            }
        }
        None
    }
    
    fn find_continue_target(&self, label: &Option<Ident>) -> Option<NodeId> {
        for (target_label, target_node) in self.continue_targets.iter().rev() {
            match (label, target_label) {
                (None, _) => return Some(*target_node),
                (Some(l1), Some(l2)) if l1.sym == l2.sym => return Some(*target_node),
                _ => continue,
            }
        }
        None
    }
}

impl Visit for CfgBuilder {
    fn visit_program(&mut self, node: &Program) {
        match node {
            Program::Module(module) => self.visit_module(module),
            Program::Script(script) => self.visit_script(script),
        }
    }
    
    fn visit_module(&mut self, node: &Module) {
        for item in &node.body {
            item.visit_with(self);
        }
    }
    
    fn visit_script(&mut self, node: &Script) {
        for stmt in &node.body {
            stmt.visit_with(self);
        }
    }
    
    fn visit_stmt(&mut self, node: &Stmt) {
        match node {
            Stmt::Block(block) => self.visit_block_stmt(block),
            Stmt::If(if_stmt) => self.visit_if_stmt(if_stmt),
            Stmt::While(while_stmt) => self.visit_while_stmt(while_stmt),
            Stmt::DoWhile(do_while) => self.visit_do_while_stmt(do_while),
            Stmt::For(for_stmt) => self.visit_for_stmt(for_stmt),
            Stmt::ForIn(for_in) => self.visit_for_in_stmt(for_in),
            Stmt::ForOf(for_of) => self.visit_for_of_stmt(for_of),
            Stmt::Switch(switch) => self.visit_switch_stmt(switch),
            Stmt::Break(break_stmt) => self.visit_break_stmt(break_stmt),
            Stmt::Continue(cont) => self.visit_continue_stmt(cont),
            Stmt::Return(ret) => self.visit_return_stmt(ret),
            Stmt::Throw(throw) => self.visit_throw_stmt(throw),
            Stmt::Try(try_stmt) => self.visit_try_stmt(try_stmt),
            Stmt::Labeled(labeled) => self.visit_labeled_stmt(labeled),
            _ => {
                let stmt_node = self.create_node(CfgNode::Statement(node.clone()), Some(node.span()));
                self.connect(self.current, stmt_node, EdgeKind::Normal);
                self.current = stmt_node;
            }
        }
    }
    
    fn visit_block_stmt(&mut self, node: &BlockStmt) {
        let block_node = self.create_node(CfgNode::Block, Some(node.span));
        self.connect(self.current, block_node, EdgeKind::Normal);
        self.current = block_node;
        
        for stmt in &node.stmts {
            stmt.visit_with(self);
        }
    }
    
    fn visit_if_stmt(&mut self, node: &IfStmt) {
        let cond_node = self.create_node(CfgNode::Condition((*node.test).clone()), Some(node.test.span()));
        self.connect(self.current, cond_node, EdgeKind::Normal);
        
        let merge_node = self.create_node(CfgNode::Block, None);
        
        self.current = cond_node;
        let then_start = self.current;
        self.visit_stmt_or_block(&node.cons);
        self.connect(self.current, merge_node, EdgeKind::Normal);
        
        if let Some(alt) = &node.alt {
            self.current = cond_node;
            self.connect(cond_node, then_start, EdgeKind::True);
            let else_start = self.current;
            self.visit_stmt_or_block(alt);
            self.connect(cond_node, else_start, EdgeKind::False);
            self.connect(self.current, merge_node, EdgeKind::Normal);
        } else {
            self.connect(cond_node, then_start, EdgeKind::True);
            self.connect(cond_node, merge_node, EdgeKind::False);
        }
        
        self.current = merge_node;
    }
    
    fn visit_while_stmt(&mut self, node: &WhileStmt) {
        let loop_head = self.create_node(CfgNode::LoopHead, Some(node.span));
        let cond_node = self.create_node(CfgNode::Condition((*node.test).clone()), Some(node.test.span()));
        let loop_exit = self.create_node(CfgNode::LoopExit, None);
        
        self.connect(self.current, loop_head, EdgeKind::Normal);
        self.connect(loop_head, cond_node, EdgeKind::Normal);
        
        self.break_targets.push((None, loop_exit));
        self.continue_targets.push((None, loop_head));
        
        self.current = cond_node;
        self.connect(cond_node, loop_exit, EdgeKind::False);
        
        let body_start = self.current;
        self.connect(cond_node, body_start, EdgeKind::True);
        self.visit_stmt_or_block(&node.body);
        self.connect(self.current, loop_head, EdgeKind::Normal);
        
        self.break_targets.pop();
        self.continue_targets.pop();
        
        self.current = loop_exit;
    }
    
    fn visit_do_while_stmt(&mut self, node: &DoWhileStmt) {
        let loop_head = self.create_node(CfgNode::LoopHead, Some(node.span));
        let loop_exit = self.create_node(CfgNode::LoopExit, None);
        
        self.connect(self.current, loop_head, EdgeKind::Normal);
        
        self.break_targets.push((None, loop_exit));
        self.continue_targets.push((None, loop_head));
        
        self.current = loop_head;
        self.visit_stmt_or_block(&node.body);
        
        let cond_node = self.create_node(CfgNode::Condition((*node.test).clone()), Some(node.test.span()));
        self.connect(self.current, cond_node, EdgeKind::Normal);
        self.connect(cond_node, loop_head, EdgeKind::True);
        self.connect(cond_node, loop_exit, EdgeKind::False);
        
        self.break_targets.pop();
        self.continue_targets.pop();
        
        self.current = loop_exit;
    }
    
    fn visit_for_stmt(&mut self, node: &ForStmt) {
        if let Some(init) = &node.init {
            match init {
                VarDeclOrExpr::VarDecl(decl) => {
                    let init_node = self.create_node(
                        CfgNode::Statement(Stmt::Decl(Decl::Var(decl.clone()))),
                        Some(decl.span),
                    );
                    self.connect(self.current, init_node, EdgeKind::Normal);
                    self.current = init_node;
                }
                VarDeclOrExpr::Expr(expr) => {
                    let init_node = self.create_node(CfgNode::Expression((**expr).clone()), Some(expr.span()));
                    self.connect(self.current, init_node, EdgeKind::Normal);
                    self.current = init_node;
                }
            }
        }
        
        let loop_head = self.create_node(CfgNode::LoopHead, Some(node.span));
        let loop_exit = self.create_node(CfgNode::LoopExit, None);
        
        self.connect(self.current, loop_head, EdgeKind::Normal);
        self.current = loop_head;
        
        if let Some(test) = &node.test {
            let cond_node = self.create_node(CfgNode::Condition((**test).clone()), Some(test.span()));
            self.connect(self.current, cond_node, EdgeKind::Normal);
            self.connect(cond_node, loop_exit, EdgeKind::False);
            self.current = cond_node;
        }
        
        let _body_start = self.current;
        self.break_targets.push((None, loop_exit));
        self.continue_targets.push((None, loop_head));
        
        self.visit_stmt_or_block(&node.body);
        
        if let Some(update) = &node.update {
            let update_node = self.create_node(CfgNode::Expression((**update).clone()), Some(update.span()));
            self.connect(self.current, update_node, EdgeKind::Normal);
            self.current = update_node;
        }
        
        self.connect(self.current, loop_head, EdgeKind::Normal);
        
        self.break_targets.pop();
        self.continue_targets.pop();
        
        self.current = loop_exit;
    }
    
    fn visit_for_in_stmt(&mut self, node: &ForInStmt) {
        let loop_head = self.create_node(CfgNode::LoopHead, Some(node.span));
        let loop_exit = self.create_node(CfgNode::LoopExit, None);
        
        self.connect(self.current, loop_head, EdgeKind::Normal);
        
        self.break_targets.push((None, loop_exit));
        self.continue_targets.push((None, loop_head));
        
        self.current = loop_head;
        self.visit_stmt_or_block(&node.body);
        self.connect(self.current, loop_head, EdgeKind::Normal);
        
        self.break_targets.pop();
        self.continue_targets.pop();
        
        self.connect(loop_head, loop_exit, EdgeKind::Normal);
        self.current = loop_exit;
    }
    
    fn visit_for_of_stmt(&mut self, node: &ForOfStmt) {
        let loop_head = self.create_node(CfgNode::LoopHead, Some(node.span));
        let loop_exit = self.create_node(CfgNode::LoopExit, None);
        
        self.connect(self.current, loop_head, EdgeKind::Normal);
        
        self.break_targets.push((None, loop_exit));
        self.continue_targets.push((None, loop_head));
        
        self.current = loop_head;
        self.visit_stmt_or_block(&node.body);
        self.connect(self.current, loop_head, EdgeKind::Normal);
        
        self.break_targets.pop();
        self.continue_targets.pop();
        
        self.connect(loop_head, loop_exit, EdgeKind::Normal);
        self.current = loop_exit;
    }
    
    fn visit_switch_stmt(&mut self, node: &SwitchStmt) {
        let switch_node = self.create_node(
            CfgNode::Expression((*node.discriminant).clone()),
            Some(node.discriminant.span()),
        );
        self.connect(self.current, switch_node, EdgeKind::Normal);
        
        let exit_node = self.create_node(CfgNode::Block, None);
        self.break_targets.push((None, exit_node));
        
        let mut prev_case = None;
        let mut default_case = None;
        
        for case in &node.cases {
            let case_node = self.create_node(
                CfgNode::SwitchCase(case.test.as_ref().map(|t| (**t).clone())),
                Some(case.span),
            );
            
            if case.test.is_some() {
                self.connect(switch_node, case_node, EdgeKind::Case);
            } else {
                default_case = Some(case_node);
            }
            
            if let Some(prev) = prev_case {
                self.connect(prev, case_node, EdgeKind::Normal);
            }
            
            self.current = case_node;
            for stmt in &case.cons {
                stmt.visit_with(self);
            }
            
            prev_case = Some(self.current);
        }
        
        if let Some(default) = default_case {
            self.connect(switch_node, default, EdgeKind::Default);
        } else {
            self.connect(switch_node, exit_node, EdgeKind::Default);
        }
        
        if let Some(last) = prev_case {
            self.connect(last, exit_node, EdgeKind::Normal);
        }
        
        self.break_targets.pop();
        self.current = exit_node;
    }
    
    fn visit_break_stmt(&mut self, node: &BreakStmt) {
        if let Some(target) = self.find_break_target(&node.label) {
            self.connect(self.current, target, EdgeKind::Break(node.label.clone()));
            let unreachable = self.create_node(CfgNode::Block, None);
            self.current = unreachable;
        }
    }
    
    fn visit_continue_stmt(&mut self, node: &ContinueStmt) {
        if let Some(target) = self.find_continue_target(&node.label) {
            self.connect(self.current, target, EdgeKind::Continue(node.label.clone()));
            let unreachable = self.create_node(CfgNode::Block, None);
            self.current = unreachable;
        }
    }
    
    fn visit_return_stmt(&mut self, node: &ReturnStmt) {
        let ret_node = self.create_node(
            CfgNode::Statement(Stmt::Return(node.clone())),
            Some(node.span),
        );
        self.connect(self.current, ret_node, EdgeKind::Normal);
        
        if let Some(func_exit) = self.function_stack.last() {
            self.connect(ret_node, *func_exit, EdgeKind::Return);
        } else {
            self.connect(ret_node, self.cfg.exit, EdgeKind::Return);
        }
        
        let unreachable = self.create_node(CfgNode::Block, None);
        self.current = unreachable;
    }
    
    fn visit_throw_stmt(&mut self, node: &ThrowStmt) {
        let throw_node = self.create_node(
            CfgNode::Statement(Stmt::Throw(node.clone())),
            Some(node.span),
        );
        self.connect(self.current, throw_node, EdgeKind::Normal);
        
        let unreachable = self.create_node(CfgNode::Block, None);
        self.current = unreachable;
    }
    
    fn visit_try_stmt(&mut self, node: &TryStmt) {
        let try_start = self.create_node(CfgNode::Block, Some(node.span));
        self.connect(self.current, try_start, EdgeKind::Normal);
        
        self.current = try_start;
        node.block.visit_with(self);
        let try_end = self.current;
        
        let after_try = self.create_node(CfgNode::Block, None);
        
        if let Some(handler) = &node.handler {
            let catch_node = self.create_node(CfgNode::CatchClause, Some(handler.span));
            self.connect(try_start, catch_node, EdgeKind::Throw);
            
            self.current = catch_node;
            handler.body.visit_with(self);
            self.connect(self.current, after_try, EdgeKind::Normal);
        }
        
        if let Some(finalizer) = &node.finalizer {
            let finally_node = self.create_node(CfgNode::FinallyBlock, Some(finalizer.span));
            self.connect(try_end, finally_node, EdgeKind::Finally);
            
            if node.handler.is_some() {
                self.connect(self.current, finally_node, EdgeKind::Finally);
            }
            
            self.current = finally_node;
            finalizer.visit_with(self);
            self.connect(self.current, after_try, EdgeKind::Normal);
        } else {
            self.connect(try_end, after_try, EdgeKind::Normal);
        }
        
        self.current = after_try;
    }
    
    fn visit_labeled_stmt(&mut self, node: &LabeledStmt) {
        match &*node.body {
            Stmt::While(_) | Stmt::DoWhile(_) | Stmt::For(_) | Stmt::ForIn(_) | Stmt::ForOf(_) => {
                let old_break_len = self.break_targets.len();
                let old_continue_len = self.continue_targets.len();
                
                node.body.visit_with(self);
                
                for i in old_break_len..self.break_targets.len() {
                    if self.break_targets[i].0.is_none() {
                        self.break_targets[i].0 = Some(node.label.clone());
                    }
                }
                
                for i in old_continue_len..self.continue_targets.len() {
                    if self.continue_targets[i].0.is_none() {
                        self.continue_targets[i].0 = Some(node.label.clone());
                    }
                }
            }
            _ => {
                let exit = self.create_node(CfgNode::Block, None);
                self.break_targets.push((Some(node.label.clone()), exit));
                
                node.body.visit_with(self);
                self.connect(self.current, exit, EdgeKind::Normal);
                
                self.break_targets.pop();
                self.current = exit;
            }
        }
    }
    
    fn visit_fn_decl(&mut self, node: &FnDecl) {
        let fn_entry = self.create_node(CfgNode::FunctionEntry(node.ident.clone()), Some(node.function.span));
        let fn_exit = self.create_node(CfgNode::FunctionExit(node.ident.clone()), None);
        
        let saved_current = self.current;
        self.current = fn_entry;
        self.function_stack.push(fn_exit);
        
        if let Some(body) = &node.function.body {
            body.visit_with(self);
        }
        
        self.connect(self.current, fn_exit, EdgeKind::Normal);
        self.function_stack.pop();
        self.current = saved_current;
    }
}