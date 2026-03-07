use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_es_ast::{
    ArrowBody, AstStore, ClassMember, ClassMemberId, Decl, DeclId, Expr, ExprId, FunctionId,
    ProgramId, Stmt, StmtId,
};
use swc_es_visit::{
    walk_class_member, walk_decl, walk_expr, walk_function, walk_program, Visit, VisitWith,
};

use crate::{BlockId, CfgId, CfgRoot, Semantics};

/// CFG block kind.
#[derive(Debug, Clone)]
pub enum BasicBlockKind {
    /// Entry block.
    Entry,
    /// Exit block.
    Exit,
    /// Statement block.
    Statement(StmtId),
    /// Expression block.
    Expression(ExprId),
    /// Synthetic control block.
    Synthetic,
}

/// CFG basic block.
#[derive(Debug, Clone)]
pub struct BasicBlock {
    /// Block kind.
    pub kind: BasicBlockKind,
}

/// CFG edge kind.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum CfgEdgeKind {
    /// Normal fallthrough edge.
    Normal,
    /// True branch edge.
    True,
    /// False branch edge.
    False,
    /// Return completion edge.
    Return,
    /// Throw completion edge.
    Throw,
    /// Break completion edge.
    Break,
    /// Continue completion edge.
    Continue,
}

/// CFG edge.
#[derive(Debug, Clone)]
pub struct CfgEdge {
    /// Source block.
    pub from: BlockId,
    /// Destination block.
    pub to: BlockId,
    /// Edge kind.
    pub kind: CfgEdgeKind,
}

/// Control-flow graph.
#[derive(Debug, Clone)]
pub struct Cfg {
    /// Root represented by this CFG.
    pub root: CfgRoot,
    /// Entry block.
    pub entry: BlockId,
    /// Exit block.
    pub exit: BlockId,
    /// Blocks.
    pub blocks: Vec<BasicBlock>,
    /// Edges.
    pub edges: Vec<CfgEdge>,
}

impl Cfg {
    fn new(root: CfgRoot) -> Self {
        let mut cfg = Self {
            root,
            entry: BlockId::from_index(0),
            exit: BlockId::from_index(1),
            blocks: Vec::new(),
            edges: Vec::new(),
        };
        cfg.entry = cfg.add_block(BasicBlockKind::Entry);
        cfg.exit = cfg.add_block(BasicBlockKind::Exit);
        cfg
    }

    fn add_block(&mut self, kind: BasicBlockKind) -> BlockId {
        let id = BlockId::from_index(self.blocks.len());
        self.blocks.push(BasicBlock { kind });
        id
    }

    fn add_edge(&mut self, from: BlockId, to: BlockId, kind: CfgEdgeKind) {
        self.edges.push(CfgEdge { from, to, kind });
    }
}

#[derive(Debug, Clone, Copy)]
struct IncomingEdge {
    from: BlockId,
    kind: CfgEdgeKind,
}

#[derive(Debug, Clone)]
struct Jump {
    from: BlockId,
    label: Option<Atom>,
}

#[derive(Debug, Default, Clone)]
struct Outcome {
    normal: Vec<BlockId>,
    breaks: Vec<Jump>,
    continues: Vec<Jump>,
    returns: Vec<BlockId>,
    throws: Vec<BlockId>,
}

impl Outcome {
    fn append_abrupt_from(&mut self, other: Outcome) {
        self.breaks.extend(other.breaks);
        self.continues.extend(other.continues);
        self.returns.extend(other.returns);
        self.throws.extend(other.throws);
    }
}

#[derive(Debug, Clone)]
enum CompletionEvent {
    Normal(BlockId),
    Break(Jump),
    Continue(Jump),
    Return(BlockId),
    Throw(BlockId),
}

impl CompletionEvent {
    fn block(&self) -> BlockId {
        match self {
            CompletionEvent::Normal(block) => *block,
            CompletionEvent::Break(jump) => jump.from,
            CompletionEvent::Continue(jump) => jump.from,
            CompletionEvent::Return(block) => *block,
            CompletionEvent::Throw(block) => *block,
        }
    }

    fn edge_kind(&self) -> CfgEdgeKind {
        match self {
            CompletionEvent::Normal(_) => CfgEdgeKind::Normal,
            CompletionEvent::Break(_) => CfgEdgeKind::Break,
            CompletionEvent::Continue(_) => CfgEdgeKind::Continue,
            CompletionEvent::Return(_) => CfgEdgeKind::Return,
            CompletionEvent::Throw(_) => CfgEdgeKind::Throw,
        }
    }
}

struct RootCollector<'a> {
    store: &'a AstStore,
    roots: Vec<CfgRoot>,
    seen: FxHashSet<CfgRoot>,
}

impl<'a> RootCollector<'a> {
    fn new(store: &'a AstStore) -> Self {
        Self {
            store,
            roots: Vec::new(),
            seen: FxHashSet::default(),
        }
    }

    fn push_root(&mut self, root: CfgRoot) {
        if self.seen.insert(root) {
            self.roots.push(root);
        }
    }
}

impl Visit for RootCollector<'_> {
    fn visit_program(&mut self, store: &AstStore, id: ProgramId) {
        self.push_root(CfgRoot::Program(id));
        walk_program(self, store, id);
    }

    fn visit_function(&mut self, store: &AstStore, id: FunctionId) {
        self.push_root(CfgRoot::Function(id));
        walk_function(self, store, id);
    }

    fn visit_decl(&mut self, store: &AstStore, id: DeclId) {
        if matches!(self.store.decl(id), Some(Decl::Fn(_))) {
            self.push_root(CfgRoot::FunctionDecl(id));
        }
        walk_decl(self, store, id);
    }

    fn visit_expr(&mut self, store: &AstStore, id: ExprId) {
        if matches!(self.store.expr(id), Some(Expr::Arrow(_))) {
            self.push_root(CfgRoot::Arrow(id));
        }
        walk_expr(self, store, id);
    }

    fn visit_class_member(&mut self, store: &AstStore, id: ClassMemberId) {
        if matches!(
            self.store.class_member(id),
            Some(ClassMember::StaticBlock(_))
        ) {
            self.push_root(CfgRoot::ClassStaticBlock(id));
        }
        walk_class_member(self, store, id);
    }
}

struct CfgBuilder<'a> {
    store: &'a AstStore,
    cfg: Cfg,
}

impl<'a> CfgBuilder<'a> {
    fn new(store: &'a AstStore, root: CfgRoot) -> Self {
        Self {
            store,
            cfg: Cfg::new(root),
        }
    }

    fn build(mut self) -> Cfg {
        match self.cfg.root {
            CfgRoot::Program(program_id) => {
                if let Some(program) = self.store.program(program_id) {
                    self.build_stmt_root(&program.body, CfgEdgeKind::Normal);
                }
            }
            CfgRoot::Function(function_id) => {
                if let Some(function) = self.store.function(function_id) {
                    self.build_stmt_root(&function.body, CfgEdgeKind::Normal);
                }
            }
            CfgRoot::FunctionDecl(decl_id) => {
                if let Some(Decl::Fn(function_decl)) = self.store.decl(decl_id) {
                    self.build_stmt_root(&function_decl.body, CfgEdgeKind::Normal);
                }
            }
            CfgRoot::Arrow(expr_id) => {
                if let Some(Expr::Arrow(arrow)) = self.store.expr(expr_id).cloned() {
                    match arrow.body {
                        ArrowBody::Expr(expr) => {
                            let expr_block = self.cfg.add_block(BasicBlockKind::Expression(expr));
                            self.cfg
                                .add_edge(self.cfg.entry, expr_block, CfgEdgeKind::Normal);
                            self.cfg
                                .add_edge(expr_block, self.cfg.exit, CfgEdgeKind::Return);
                        }
                        ArrowBody::Block(stmts) => {
                            self.build_stmt_root(&stmts, CfgEdgeKind::Normal);
                        }
                    }
                }
            }
            CfgRoot::ClassStaticBlock(member_id) => {
                if let Some(ClassMember::StaticBlock(block)) = self.store.class_member(member_id) {
                    self.build_stmt_root(&block.body, CfgEdgeKind::Normal);
                }
            }
        }

        self.cfg
    }

    fn build_stmt_root(&mut self, body: &[StmtId], fallthrough_kind: CfgEdgeKind) {
        let incoming = vec![IncomingEdge {
            from: self.cfg.entry,
            kind: CfgEdgeKind::Normal,
        }];
        let outcome = self.build_stmt_list(body, incoming);

        for block in outcome.normal {
            self.cfg.add_edge(block, self.cfg.exit, fallthrough_kind);
        }
        for block in outcome.returns {
            self.cfg.add_edge(block, self.cfg.exit, CfgEdgeKind::Return);
        }
        for block in outcome.throws {
            self.cfg.add_edge(block, self.cfg.exit, CfgEdgeKind::Throw);
        }
        for jump in outcome.breaks {
            self.cfg
                .add_edge(jump.from, self.cfg.exit, CfgEdgeKind::Break);
        }
        for jump in outcome.continues {
            self.cfg
                .add_edge(jump.from, self.cfg.exit, CfgEdgeKind::Continue);
        }
    }

    fn build_stmt_list(&mut self, stmts: &[StmtId], mut incoming: Vec<IncomingEdge>) -> Outcome {
        let mut outcome = Outcome::default();

        for stmt in stmts {
            if incoming.is_empty() {
                break;
            }

            let stmt_outcome = self.build_stmt(*stmt, incoming, None);
            incoming = stmt_outcome
                .normal
                .iter()
                .map(|block| IncomingEdge {
                    from: *block,
                    kind: CfgEdgeKind::Normal,
                })
                .collect();

            outcome.breaks.extend(stmt_outcome.breaks);
            outcome.continues.extend(stmt_outcome.continues);
            outcome.returns.extend(stmt_outcome.returns);
            outcome.throws.extend(stmt_outcome.throws);
        }

        outcome.normal = incoming.into_iter().map(|incoming| incoming.from).collect();
        outcome
    }

    fn connect_incoming(&mut self, incoming: &[IncomingEdge], to: BlockId) {
        for edge in incoming {
            self.cfg.add_edge(edge.from, to, edge.kind);
        }
    }

    fn build_stmt(
        &mut self,
        stmt_id: StmtId,
        incoming: Vec<IncomingEdge>,
        attached_label: Option<&Atom>,
    ) -> Outcome {
        let stmt_block = self.cfg.add_block(BasicBlockKind::Statement(stmt_id));
        self.connect_incoming(&incoming, stmt_block);

        let Some(stmt) = self.store.stmt(stmt_id).cloned() else {
            return Outcome {
                normal: vec![stmt_block],
                ..Outcome::default()
            };
        };

        match stmt {
            Stmt::Empty(_)
            | Stmt::Expr(_)
            | Stmt::Decl(_)
            | Stmt::ModuleDecl(_)
            | Stmt::Debugger(_) => Outcome {
                normal: vec![stmt_block],
                ..Outcome::default()
            },
            Stmt::Return(_) => Outcome {
                returns: vec![stmt_block],
                ..Outcome::default()
            },
            Stmt::Throw(_) => Outcome {
                throws: vec![stmt_block],
                ..Outcome::default()
            },
            Stmt::Break(break_stmt) => Outcome {
                breaks: vec![Jump {
                    from: stmt_block,
                    label: break_stmt.label.map(|ident| ident.sym),
                }],
                ..Outcome::default()
            },
            Stmt::Continue(continue_stmt) => Outcome {
                continues: vec![Jump {
                    from: stmt_block,
                    label: continue_stmt.label.map(|ident| ident.sym),
                }],
                ..Outcome::default()
            },
            Stmt::Block(block) => self.build_stmt_list(
                &block.stmts,
                vec![IncomingEdge {
                    from: stmt_block,
                    kind: CfgEdgeKind::Normal,
                }],
            ),
            Stmt::With(with_stmt) => self.build_stmt(
                with_stmt.body,
                vec![IncomingEdge {
                    from: stmt_block,
                    kind: CfgEdgeKind::Normal,
                }],
                attached_label,
            ),
            Stmt::Labeled(labeled) => {
                let body_outcome = self.build_stmt(
                    labeled.body,
                    vec![IncomingEdge {
                        from: stmt_block,
                        kind: CfgEdgeKind::Normal,
                    }],
                    Some(&labeled.label.sym),
                );
                let join = self.cfg.add_block(BasicBlockKind::Synthetic);

                for block in body_outcome.normal {
                    self.cfg.add_edge(block, join, CfgEdgeKind::Normal);
                }

                let mut outcome = Outcome {
                    normal: vec![join],
                    ..Outcome::default()
                };

                for jump in body_outcome.breaks {
                    if jump.label.as_ref() == Some(&labeled.label.sym) {
                        self.cfg.add_edge(jump.from, join, CfgEdgeKind::Break);
                    } else {
                        outcome.breaks.push(jump);
                    }
                }

                outcome.continues = body_outcome.continues;
                outcome.returns = body_outcome.returns;
                outcome.throws = body_outcome.throws;
                outcome
            }
            Stmt::If(if_stmt) => {
                let cons_outcome = self.build_stmt(
                    if_stmt.cons,
                    vec![IncomingEdge {
                        from: stmt_block,
                        kind: CfgEdgeKind::True,
                    }],
                    None,
                );

                let alt_outcome = if let Some(alt) = if_stmt.alt {
                    self.build_stmt(
                        alt,
                        vec![IncomingEdge {
                            from: stmt_block,
                            kind: CfgEdgeKind::False,
                        }],
                        None,
                    )
                } else {
                    Outcome {
                        normal: vec![stmt_block],
                        ..Outcome::default()
                    }
                };

                let join = self.cfg.add_block(BasicBlockKind::Synthetic);
                for block in cons_outcome.normal {
                    self.cfg.add_edge(block, join, CfgEdgeKind::Normal);
                }
                for block in alt_outcome.normal {
                    self.cfg.add_edge(block, join, CfgEdgeKind::Normal);
                }

                let mut outcome = Outcome {
                    normal: vec![join],
                    ..Outcome::default()
                };
                outcome.breaks.extend(cons_outcome.breaks);
                outcome.breaks.extend(alt_outcome.breaks);
                outcome.continues.extend(cons_outcome.continues);
                outcome.continues.extend(alt_outcome.continues);
                outcome.returns.extend(cons_outcome.returns);
                outcome.returns.extend(alt_outcome.returns);
                outcome.throws.extend(cons_outcome.throws);
                outcome.throws.extend(alt_outcome.throws);
                outcome
            }
            Stmt::While(while_stmt) => {
                self.build_loop_stmt(stmt_block, while_stmt.body, attached_label, true)
            }
            Stmt::For(for_stmt) => {
                let has_false_exit = match &for_stmt.head {
                    swc_es_ast::ForHead::Classic(head) => head.test.is_some(),
                    swc_es_ast::ForHead::In(_) | swc_es_ast::ForHead::Of(_) => true,
                };
                self.build_loop_stmt(stmt_block, for_stmt.body, attached_label, has_false_exit)
            }
            Stmt::DoWhile(do_while) => {
                self.build_do_while_stmt(stmt_block, do_while, attached_label)
            }
            Stmt::Switch(switch_stmt) => {
                self.build_switch_stmt(stmt_block, switch_stmt.cases, attached_label)
            }
            Stmt::Try(try_stmt) => self.build_try_stmt(stmt_block, try_stmt, attached_label),
        }
    }

    fn build_loop_stmt(
        &mut self,
        loop_head: BlockId,
        body: StmtId,
        attached_label: Option<&Atom>,
        has_false_exit: bool,
    ) -> Outcome {
        let body_outcome = self.build_stmt(
            body,
            vec![IncomingEdge {
                from: loop_head,
                kind: CfgEdgeKind::True,
            }],
            None,
        );

        let join = self.cfg.add_block(BasicBlockKind::Synthetic);
        if has_false_exit {
            self.cfg.add_edge(loop_head, join, CfgEdgeKind::False);
        }

        for block in body_outcome.normal {
            self.cfg.add_edge(block, loop_head, CfgEdgeKind::Normal);
        }

        let mut outcome = Outcome {
            normal: if has_false_exit {
                vec![join]
            } else {
                Vec::new()
            },
            returns: body_outcome.returns,
            throws: body_outcome.throws,
            ..Outcome::default()
        };

        for jump in body_outcome.continues {
            if jump.label.is_none()
                || attached_label
                    .map(|label| Some(label) == jump.label.as_ref())
                    .unwrap_or(false)
            {
                self.cfg
                    .add_edge(jump.from, loop_head, CfgEdgeKind::Continue);
            } else {
                outcome.continues.push(jump);
            }
        }

        for jump in body_outcome.breaks {
            if jump.label.is_none()
                || attached_label
                    .map(|label| Some(label) == jump.label.as_ref())
                    .unwrap_or(false)
            {
                self.cfg.add_edge(jump.from, join, CfgEdgeKind::Break);
                if !outcome.normal.contains(&join) {
                    outcome.normal.push(join);
                }
            } else {
                outcome.breaks.push(jump);
            }
        }

        outcome
    }

    fn build_do_while_stmt(
        &mut self,
        do_while_head: BlockId,
        do_while: swc_es_ast::DoWhileStmt,
        attached_label: Option<&Atom>,
    ) -> Outcome {
        let body_outcome = self.build_stmt(
            do_while.body,
            vec![IncomingEdge {
                from: do_while_head,
                kind: CfgEdgeKind::Normal,
            }],
            None,
        );

        let test_block = self.cfg.add_block(BasicBlockKind::Synthetic);
        for block in body_outcome.normal {
            self.cfg.add_edge(block, test_block, CfgEdgeKind::Normal);
        }

        let join = self.cfg.add_block(BasicBlockKind::Synthetic);
        self.cfg.add_edge(test_block, join, CfgEdgeKind::False);
        self.cfg
            .add_edge(test_block, do_while_head, CfgEdgeKind::True);

        let mut outcome = Outcome {
            normal: vec![join],
            returns: body_outcome.returns,
            throws: body_outcome.throws,
            ..Outcome::default()
        };

        for jump in body_outcome.continues {
            if jump.label.is_none()
                || attached_label
                    .map(|label| Some(label) == jump.label.as_ref())
                    .unwrap_or(false)
            {
                self.cfg
                    .add_edge(jump.from, test_block, CfgEdgeKind::Continue);
            } else {
                outcome.continues.push(jump);
            }
        }

        for jump in body_outcome.breaks {
            if jump.label.is_none()
                || attached_label
                    .map(|label| Some(label) == jump.label.as_ref())
                    .unwrap_or(false)
            {
                self.cfg.add_edge(jump.from, join, CfgEdgeKind::Break);
            } else {
                outcome.breaks.push(jump);
            }
        }

        outcome
    }

    fn build_switch_stmt(
        &mut self,
        switch_block: BlockId,
        cases: Vec<swc_es_ast::SwitchCase>,
        attached_label: Option<&Atom>,
    ) -> Outcome {
        let mut incoming: Vec<IncomingEdge> = Vec::new();
        let mut has_case = false;
        let mut has_default = false;

        let mut outcome = Outcome::default();
        for case in cases {
            has_case = true;
            has_default |= case.test.is_none();
            let mut case_incoming = std::mem::take(&mut incoming);
            case_incoming.push(IncomingEdge {
                from: switch_block,
                kind: CfgEdgeKind::True,
            });

            let mut case_outcome = self.build_stmt_list(&case.cons, case_incoming);
            let case_normals = std::mem::take(&mut case_outcome.normal);
            incoming = case_normals
                .into_iter()
                .map(|block| IncomingEdge {
                    from: block,
                    kind: CfgEdgeKind::Normal,
                })
                .collect();
            outcome.append_abrupt_from(case_outcome);
        }

        let join = self.cfg.add_block(BasicBlockKind::Synthetic);
        if !has_default {
            self.cfg.add_edge(switch_block, join, CfgEdgeKind::False);
        }
        if has_case {
            for edge in incoming {
                self.cfg.add_edge(edge.from, join, CfgEdgeKind::Normal);
            }
        }

        let mut final_outcome = Outcome {
            normal: vec![join],
            continues: outcome.continues,
            returns: outcome.returns,
            throws: outcome.throws,
            ..Outcome::default()
        };

        for jump in outcome.breaks {
            if jump.label.is_none()
                || attached_label
                    .map(|label| Some(label) == jump.label.as_ref())
                    .unwrap_or(false)
            {
                self.cfg.add_edge(jump.from, join, CfgEdgeKind::Break);
            } else {
                final_outcome.breaks.push(jump);
            }
        }

        final_outcome
    }

    fn build_try_stmt(
        &mut self,
        try_block: BlockId,
        try_stmt: swc_es_ast::TryStmt,
        _attached_label: Option<&Atom>,
    ) -> Outcome {
        let try_outcome = self.build_stmt(
            try_stmt.block,
            vec![IncomingEdge {
                from: try_block,
                kind: CfgEdgeKind::Normal,
            }],
            None,
        );

        let mut protected = Outcome {
            normal: try_outcome.normal,
            breaks: try_outcome.breaks,
            continues: try_outcome.continues,
            returns: try_outcome.returns,
            throws: Vec::new(),
        };

        if let Some(handler) = try_stmt.handler {
            let catch_entry = self.cfg.add_block(BasicBlockKind::Synthetic);
            for throw in try_outcome.throws {
                self.cfg.add_edge(throw, catch_entry, CfgEdgeKind::Throw);
            }
            let catch_outcome = self.build_stmt(
                handler.body,
                vec![IncomingEdge {
                    from: catch_entry,
                    kind: CfgEdgeKind::Normal,
                }],
                None,
            );
            protected.normal.extend(catch_outcome.normal);
            protected.breaks.extend(catch_outcome.breaks);
            protected.continues.extend(catch_outcome.continues);
            protected.returns.extend(catch_outcome.returns);
            protected.throws.extend(catch_outcome.throws);
        } else {
            protected.throws.extend(try_outcome.throws);
        }

        if let Some(finalizer) = try_stmt.finalizer {
            self.apply_finalizer(protected, finalizer)
        } else {
            protected
        }
    }

    fn apply_finalizer(&mut self, protected: Outcome, finalizer_stmt: StmtId) -> Outcome {
        let mut events = Vec::new();
        for block in protected.normal {
            events.push(CompletionEvent::Normal(block));
        }
        for jump in protected.breaks {
            events.push(CompletionEvent::Break(jump));
        }
        for jump in protected.continues {
            events.push(CompletionEvent::Continue(jump));
        }
        for block in protected.returns {
            events.push(CompletionEvent::Return(block));
        }
        for block in protected.throws {
            events.push(CompletionEvent::Throw(block));
        }

        if events.is_empty() {
            return Outcome::default();
        }

        let incoming = events
            .iter()
            .map(|event| IncomingEdge {
                from: event.block(),
                kind: event.edge_kind(),
            })
            .collect();

        let final_outcome = self.build_stmt(finalizer_stmt, incoming, None);

        let mut transformed = Outcome {
            breaks: final_outcome.breaks,
            continues: final_outcome.continues,
            returns: final_outcome.returns,
            throws: final_outcome.throws,
            ..Outcome::default()
        };

        for block in final_outcome.normal {
            for event in &events {
                match event {
                    CompletionEvent::Normal(_) => transformed.normal.push(block),
                    CompletionEvent::Break(jump) => transformed.breaks.push(Jump {
                        from: block,
                        label: jump.label.clone(),
                    }),
                    CompletionEvent::Continue(jump) => transformed.continues.push(Jump {
                        from: block,
                        label: jump.label.clone(),
                    }),
                    CompletionEvent::Return(_) => transformed.returns.push(block),
                    CompletionEvent::Throw(_) => transformed.throws.push(block),
                }
            }
        }

        transformed
    }
}

pub(crate) fn build_cfgs(store: &AstStore, program: ProgramId, semantics: &mut Semantics) {
    let mut collector = RootCollector::new(store);
    program.visit_with(store, &mut collector);

    if collector.roots.is_empty() {
        collector.roots.push(CfgRoot::Program(program));
    }

    for root in collector.roots {
        let cfg = CfgBuilder::new(store, root).build();
        let _: CfgId = semantics.alloc_cfg(cfg);
    }
}
