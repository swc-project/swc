use std::collections::{HashMap, HashSet};
use swc_common::Span;
use swc_ecma_ast::*;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct NodeId(pub usize);

#[derive(Debug, Clone)]
pub enum CfgNode {
    Entry,
    Exit,
    Statement(Stmt),
    Expression(Expr),
    Condition(Expr),
    Block,
    FunctionEntry(Ident),
    FunctionExit(Ident),
    LoopHead,
    LoopExit,
    SwitchCase(Option<Expr>),
    CatchClause,
    FinallyBlock,
}

#[derive(Debug, Clone, PartialEq)]
pub enum EdgeKind {
    Normal,
    True,
    False,
    Break(Option<Ident>),
    Continue(Option<Ident>),
    Return,
    Throw,
    Finally,
    Case,
    Default,
}

#[derive(Debug, Clone)]
pub struct CfgEdge {
    pub from: NodeId,
    pub to: NodeId,
    pub kind: EdgeKind,
}

#[derive(Debug, Clone)]
pub struct BasicBlock {
    pub id: NodeId,
    pub node: CfgNode,
    pub span: Option<Span>,
    pub predecessors: Vec<NodeId>,
    pub successors: Vec<NodeId>,
}

impl BasicBlock {
    pub fn new(id: NodeId, node: CfgNode, span: Option<Span>) -> Self {
        Self {
            id,
            node,
            span,
            predecessors: Vec::new(),
            successors: Vec::new(),
        }
    }
}

#[derive(Debug)]
pub struct ControlFlowGraph {
    pub blocks: HashMap<NodeId, BasicBlock>,
    pub edges: Vec<CfgEdge>,
    pub entry: NodeId,
    pub exit: NodeId,
    next_id: usize,
}

impl ControlFlowGraph {
    pub fn new() -> Self {
        let mut cfg = Self {
            blocks: HashMap::new(),
            edges: Vec::new(),
            entry: NodeId(0),
            exit: NodeId(1),
            next_id: 2,
        };
        
        cfg.blocks.insert(
            cfg.entry,
            BasicBlock::new(cfg.entry, CfgNode::Entry, None),
        );
        cfg.blocks.insert(
            cfg.exit,
            BasicBlock::new(cfg.exit, CfgNode::Exit, None),
        );
        
        cfg
    }
    
    pub fn create_node(&mut self, node: CfgNode, span: Option<Span>) -> NodeId {
        let id = NodeId(self.next_id);
        self.next_id += 1;
        self.blocks.insert(id, BasicBlock::new(id, node, span));
        id
    }
    
    pub fn add_edge(&mut self, from: NodeId, to: NodeId, kind: EdgeKind) {
        self.edges.push(CfgEdge {
            from,
            to,
            kind: kind.clone(),
        });
        
        if let Some(from_block) = self.blocks.get_mut(&from) {
            from_block.successors.push(to);
        }
        
        if let Some(to_block) = self.blocks.get_mut(&to) {
            to_block.predecessors.push(from);
        }
    }
    
    pub fn get_block(&self, id: NodeId) -> Option<&BasicBlock> {
        self.blocks.get(&id)
    }
    
    pub fn get_block_mut(&mut self, id: NodeId) -> Option<&mut BasicBlock> {
        self.blocks.get_mut(&id)
    }
    
    pub fn reachable_nodes(&self) -> HashSet<NodeId> {
        let mut visited = HashSet::new();
        let mut stack = vec![self.entry];
        
        while let Some(node) = stack.pop() {
            if visited.insert(node) {
                if let Some(block) = self.blocks.get(&node) {
                    stack.extend(&block.successors);
                }
            }
        }
        
        visited
    }
    
    pub fn unreachable_nodes(&self) -> HashSet<NodeId> {
        let reachable = self.reachable_nodes();
        self.blocks
            .keys()
            .filter(|&&id| !reachable.contains(&id))
            .copied()
            .collect()
    }
}