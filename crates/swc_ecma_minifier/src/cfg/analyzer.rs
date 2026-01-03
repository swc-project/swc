use std::collections::{HashMap, HashSet};
use swc_common::Span;
use swc_ecma_ast::*;

use super::graph::{ControlFlowGraph, NodeId, CfgNode};

#[derive(Debug)]
pub struct CfgAnalyzer<'a> {
    cfg: &'a ControlFlowGraph,
    dominators: HashMap<NodeId, HashSet<NodeId>>,
    immediate_dominators: HashMap<NodeId, NodeId>,
    dominance_frontiers: HashMap<NodeId, HashSet<NodeId>>,
    post_dominators: HashMap<NodeId, HashSet<NodeId>>,
}

impl<'a> CfgAnalyzer<'a> {
    pub fn new(cfg: &'a ControlFlowGraph) -> Self {
        let mut analyzer = Self {
            cfg,
            dominators: HashMap::new(),
            immediate_dominators: HashMap::new(),
            dominance_frontiers: HashMap::new(),
            post_dominators: HashMap::new(),
        };
        
        analyzer.compute_dominators();
        analyzer.compute_dominance_frontiers();
        analyzer.compute_post_dominators();
        
        analyzer
    }
    
    pub fn is_reachable(&self, node: NodeId) -> bool {
        self.cfg.reachable_nodes().contains(&node)
    }
    
    pub fn unreachable_code(&self) -> Vec<NodeId> {
        self.cfg.unreachable_nodes().into_iter().collect()
    }
    
    pub fn dominates(&self, dominator: NodeId, node: NodeId) -> bool {
        self.dominators
            .get(&node)
            .map(|doms| doms.contains(&dominator))
            .unwrap_or(false)
    }
    
    pub fn immediate_dominator(&self, node: NodeId) -> Option<NodeId> {
        self.immediate_dominators.get(&node).copied()
    }
    
    pub fn dominance_frontier(&self, node: NodeId) -> Option<&HashSet<NodeId>> {
        self.dominance_frontiers.get(&node)
    }
    
    pub fn post_dominates(&self, post_dom: NodeId, node: NodeId) -> bool {
        self.post_dominators
            .get(&node)
            .map(|pdoms| pdoms.contains(&post_dom))
            .unwrap_or(false)
    }
    
    pub fn find_loops(&self) -> Vec<Loop> {
        let mut loops = Vec::new();
        let mut visited = HashSet::new();
        
        for (node_id, block) in &self.cfg.blocks {
            if visited.contains(node_id) {
                continue;
            }
            
            if matches!(block.node, CfgNode::LoopHead) {
                if let Some(loop_info) = self.analyze_loop(*node_id) {
                    for &node in &loop_info.body {
                        visited.insert(node);
                    }
                    loops.push(loop_info);
                }
            }
        }
        
        loops
    }
    
    pub fn find_dead_code(&self) -> Vec<DeadCode> {
        let mut dead_code = Vec::new();
        
        for node_id in self.unreachable_code() {
            if let Some(block) = self.cfg.get_block(node_id) {
                let kind = match &block.node {
                    CfgNode::Statement(stmt) => {
                        match stmt {
                            Stmt::Return(_) => DeadCodeKind::UnreachableReturn,
                            Stmt::Break(_) => DeadCodeKind::UnreachableBreak,
                            Stmt::Continue(_) => DeadCodeKind::UnreachableContinue,
                            _ => DeadCodeKind::UnreachableStatement,
                        }
                    }
                    CfgNode::Expression(_) => DeadCodeKind::UnreachableExpression,
                    CfgNode::Block => DeadCodeKind::UnreachableBlock,
                    _ => DeadCodeKind::Other,
                };
                
                dead_code.push(DeadCode {
                    node: node_id,
                    kind,
                    span: block.span,
                });
            }
        }
        
        dead_code
    }
    
    pub fn find_infinite_loops(&self) -> Vec<NodeId> {
        let mut infinite_loops = Vec::new();
        
        for loop_info in self.find_loops() {
            let mut has_exit = false;
            
            for &node in &loop_info.body {
                if let Some(block) = self.cfg.get_block(node) {
                    for &succ in &block.successors {
                        if !loop_info.body.contains(&succ) {
                            has_exit = true;
                            break;
                        }
                    }
                }
                if has_exit {
                    break;
                }
            }
            
            if !has_exit {
                infinite_loops.push(loop_info.header);
            }
        }
        
        infinite_loops
    }
    
    pub fn find_redundant_conditions(&self) -> Vec<RedundantCondition> {
        let mut redundant = Vec::new();
        let mut condition_values: HashMap<String, bool> = HashMap::new();
        
        for (node_id, block) in &self.cfg.blocks {
            if let CfgNode::Condition(expr) = &block.node {
                let expr_str = format!("{:?}", expr);
                
                for &pred in &block.predecessors {
                    if let Some(pred_block) = self.cfg.get_block(pred) {
                        if let CfgNode::Condition(pred_expr) = &pred_block.node {
                            let pred_expr_str = format!("{:?}", pred_expr);
                            
                            if expr_str == pred_expr_str {
                                if let Some(&value) = condition_values.get(&pred_expr_str) {
                                    redundant.push(RedundantCondition {
                                        node: *node_id,
                                        previous_node: pred,
                                        condition: expr.clone(),
                                        known_value: value,
                                    });
                                }
                            }
                        }
                    }
                }
                
                condition_values.insert(expr_str, true);
            }
        }
        
        redundant
    }
    
    fn compute_dominators(&mut self) {
        let nodes: Vec<_> = self.cfg.blocks.keys().copied().collect();
        
        for &node in &nodes {
            if node == self.cfg.entry {
                self.dominators.insert(node, HashSet::from([node]));
            } else {
                self.dominators.insert(node, nodes.iter().copied().collect());
            }
        }
        
        let mut changed = true;
        while changed {
            changed = false;
            
            for &node in &nodes {
                if node == self.cfg.entry {
                    continue;
                }
                
                let mut new_doms = HashSet::new();
                new_doms.insert(node);
                
                if let Some(block) = self.cfg.get_block(node) {
                    if let Some(first_pred) = block.predecessors.first() {
                        let mut intersection = self.dominators[first_pred].clone();
                        
                        for &pred in &block.predecessors[1..] {
                            let pred_doms = &self.dominators[&pred];
                            intersection.retain(|&n| pred_doms.contains(&n));
                        }
                        
                        new_doms.extend(intersection);
                    }
                }
                
                if new_doms != self.dominators[&node] {
                    self.dominators.insert(node, new_doms);
                    changed = true;
                }
            }
        }
        
        for &node in &nodes {
            if node == self.cfg.entry {
                continue;
            }
            
            let doms = &self.dominators[&node];
            let mut idom = None;
            
            for &dom in doms {
                if dom != node {
                    let mut is_immediate = true;
                    for &other in doms {
                        if other != node && other != dom {
                            if self.dominates(other, dom) {
                                is_immediate = false;
                                break;
                            }
                        }
                    }
                    if is_immediate {
                        idom = Some(dom);
                        break;
                    }
                }
            }
            
            if let Some(idom) = idom {
                self.immediate_dominators.insert(node, idom);
            }
        }
    }
    
    fn compute_dominance_frontiers(&mut self) {
        for node in self.cfg.blocks.keys() {
            self.dominance_frontiers.insert(*node, HashSet::new());
        }
        
        for (node, block) in &self.cfg.blocks {
            if block.predecessors.len() > 1 {
                for &pred in &block.predecessors {
                    let mut runner = pred;
                    while runner != self.immediate_dominators.get(node).copied().unwrap_or(self.cfg.entry) {
                        self.dominance_frontiers
                            .get_mut(&runner)
                            .unwrap()
                            .insert(*node);
                        runner = self.immediate_dominators
                            .get(&runner)
                            .copied()
                            .unwrap_or(self.cfg.entry);
                    }
                }
            }
        }
    }
    
    fn compute_post_dominators(&mut self) {
        let nodes: Vec<_> = self.cfg.blocks.keys().copied().collect();
        
        for &node in &nodes {
            if node == self.cfg.exit {
                self.post_dominators.insert(node, HashSet::from([node]));
            } else {
                self.post_dominators.insert(node, nodes.iter().copied().collect());
            }
        }
        
        let mut changed = true;
        while changed {
            changed = false;
            
            for &node in &nodes {
                if node == self.cfg.exit {
                    continue;
                }
                
                let mut new_pdoms = HashSet::new();
                new_pdoms.insert(node);
                
                if let Some(block) = self.cfg.get_block(node) {
                    if let Some(first_succ) = block.successors.first() {
                        let mut intersection = self.post_dominators[first_succ].clone();
                        
                        for &succ in &block.successors[1..] {
                            let succ_pdoms = &self.post_dominators[&succ];
                            intersection.retain(|&n| succ_pdoms.contains(&n));
                        }
                        
                        new_pdoms.extend(intersection);
                    }
                }
                
                if new_pdoms != self.post_dominators[&node] {
                    self.post_dominators.insert(node, new_pdoms);
                    changed = true;
                }
            }
        }
    }
    
    fn analyze_loop(&self, header: NodeId) -> Option<Loop> {
        let mut body = HashSet::new();
        let mut stack = Vec::new();
        
        if let Some(header_block) = self.cfg.get_block(header) {
            for &pred in &header_block.predecessors {
                if self.dominates(header, pred) {
                    stack.push(pred);
                }
            }
        }
        
        body.insert(header);
        
        while let Some(node) = stack.pop() {
            if body.insert(node) {
                if let Some(block) = self.cfg.get_block(node) {
                    for &pred in &block.predecessors {
                        if !body.contains(&pred) {
                            stack.push(pred);
                        }
                    }
                }
            }
        }
        
        Some(Loop { header, body })
    }
}

#[derive(Debug, Clone)]
pub struct Loop {
    pub header: NodeId,
    pub body: HashSet<NodeId>,
}

#[derive(Debug, Clone)]
pub struct DeadCode {
    pub node: NodeId,
    pub kind: DeadCodeKind,
    pub span: Option<Span>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum DeadCodeKind {
    UnreachableStatement,
    UnreachableExpression,
    UnreachableBlock,
    UnreachableReturn,
    UnreachableBreak,
    UnreachableContinue,
    Other,
}

#[derive(Debug, Clone)]
pub struct RedundantCondition {
    pub node: NodeId,
    pub previous_node: NodeId,
    pub condition: Expr,
    pub known_value: bool,
}