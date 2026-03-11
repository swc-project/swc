use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_es_ast::{
    ArrowBody, ArrowExpr, AstStore, ClassMember, ClassMemberId, Decl, DeclId, Expr, ExprId,
    ForBinding, ForHead, ForInit, FunctionId, Ident, JSXElementId, ModuleDecl, Pat, PatId,
    ProgramId, PropName, Stmt, StmtId, VarDeclKind,
};

use crate::{
    ReferenceData, ReferenceKind, ScopeData, ScopeId, ScopeKind, Semantics, SymbolData, SymbolId,
    SymbolKind,
};

pub(crate) fn analyze_scopes(store: &AstStore, program: ProgramId, semantics: &mut Semantics) {
    let mut analyzer = Analyzer::new(store, semantics);
    analyzer.visit_program(program);
}

#[derive(Debug)]
struct ScopeFrame {
    id: ScopeId,
    function_scope: ScopeId,
    decls: FxHashMap<Atom, SymbolId>,
}

struct Analyzer<'a> {
    store: &'a AstStore,
    semantics: &'a mut Semantics,
    scope_stack: Vec<ScopeFrame>,
}

impl<'a> Analyzer<'a> {
    fn new(store: &'a AstStore, semantics: &'a mut Semantics) -> Self {
        Self {
            store,
            semantics,
            scope_stack: Vec::new(),
        }
    }

    fn current_scope(&self) -> ScopeId {
        self.scope_stack
            .last()
            .map(|scope| scope.id)
            .expect("scope stack should not be empty")
    }

    fn current_function_scope(&self) -> ScopeId {
        self.scope_stack
            .last()
            .map(|scope| scope.function_scope)
            .expect("scope stack should not be empty")
    }

    fn push_scope(&mut self, kind: ScopeKind) -> ScopeId {
        let parent = self.scope_stack.last().map(|scope| scope.id);
        let parent_function = parent.and_then(|parent_id| {
            let parent_scope = &self.semantics.scopes[parent_id.index()];
            if matches!(kind, ScopeKind::Program | ScopeKind::Function) {
                Some(parent_scope.enclosing_function)
            } else {
                parent_scope.parent_function
            }
        });

        let inherited_fn = parent
            .map(|parent_id| self.semantics.scopes[parent_id.index()].enclosing_function)
            .unwrap_or_else(|| ScopeId::from_index(0));

        let id = self.semantics.alloc_scope(ScopeData {
            kind,
            parent,
            enclosing_function: inherited_fn,
            parent_function,
            symbols: Vec::new(),
            has_dynamic_lookup: false,
        });

        if matches!(kind, ScopeKind::Program | ScopeKind::Function) {
            self.semantics.scopes[id.index()].enclosing_function = id;
        }

        let function_scope = self.semantics.scopes[id.index()].enclosing_function;
        self.scope_stack.push(ScopeFrame {
            id,
            function_scope,
            decls: FxHashMap::default(),
        });

        id
    }

    fn pop_scope(&mut self) {
        let _ = self.scope_stack.pop();
    }

    fn mark_stmt_scope(&mut self, id: StmtId) {
        let scope = self.current_scope();
        self.semantics.scope_by_stmt.insert(id, scope);
    }

    fn mark_expr_scope(&mut self, id: ExprId) {
        let scope = self.current_scope();
        self.semantics.scope_by_expr.insert(id, scope);
    }

    fn mark_decl_scope(&mut self, id: DeclId) {
        let scope = self.current_scope();
        self.semantics.scope_by_decl.insert(id, scope);
    }

    fn find_active_scope_mut(&mut self, id: ScopeId) -> Option<&mut ScopeFrame> {
        self.scope_stack.iter_mut().find(|scope| scope.id == id)
    }

    fn find_in_scope(&self, scope: ScopeId, name: &Atom) -> Option<SymbolId> {
        self.scope_stack
            .iter()
            .find(|frame| frame.id == scope)
            .and_then(|frame| frame.decls.get(name).copied())
    }

    fn declare_symbol(&mut self, scope: ScopeId, name: &Atom, kind: SymbolKind) -> SymbolId {
        if let Some(existing) = self.find_in_scope(scope, name) {
            return existing;
        }

        let symbol = self.semantics.alloc_symbol(SymbolData {
            kind,
            scope,
            name: name.clone(),
        });

        self.semantics.scopes[scope.index()].symbols.push(symbol);
        if let Some(frame) = self.find_active_scope_mut(scope) {
            frame.decls.insert(name.clone(), symbol);
        }

        symbol
    }

    fn resolve_symbol(&self, name: &Atom) -> Option<SymbolId> {
        for frame in self.scope_stack.iter().rev() {
            if let Some(symbol) = frame.decls.get(name) {
                return Some(*symbol);
            }
        }
        None
    }

    fn record_ident_reference(&mut self, expr: Option<ExprId>, ident: &Ident, kind: ReferenceKind) {
        if ident.sym.as_ref() == "this" || ident.sym.as_ref() == "super" {
            return;
        }

        let scope = self.current_scope();
        let enclosing_function = self.current_function_scope();
        let symbol = self.resolve_symbol(&ident.sym);

        if let (Some(expr), Some(symbol)) = (expr, symbol) {
            self.semantics.symbol_by_expr_ident.insert(expr, symbol);
        }

        let _ = self.semantics.alloc_reference(ReferenceData {
            kind,
            scope,
            enclosing_function,
            symbol,
            name: ident.sym.clone(),
            expr,
            maybe_dynamic: false,
        });
    }

    fn mark_dynamic_lookup(&mut self) {
        let function_scope = self.current_function_scope();
        self.semantics.scopes[function_scope.index()].has_dynamic_lookup = true;
    }

    fn collect_binding_names(&self, pat_id: PatId, out: &mut Vec<Ident>) {
        let Some(pat) = self.store.pat(pat_id) else {
            return;
        };

        match pat {
            Pat::Ident(ident) => out.push(ident.clone()),
            Pat::Expr(_) => {}
            Pat::Array(array) => {
                for elem in array.elems.iter().flatten() {
                    self.collect_binding_names(*elem, out);
                }
            }
            Pat::Object(object) => {
                for prop in &object.props {
                    match prop {
                        swc_es_ast::ObjectPatProp::KeyValue(key_value) => {
                            self.collect_binding_names(key_value.value, out);
                        }
                        swc_es_ast::ObjectPatProp::Assign(assign) => {
                            out.push(assign.key.clone());
                        }
                        swc_es_ast::ObjectPatProp::Rest(rest) => {
                            self.collect_binding_names(rest.arg, out);
                        }
                    }
                }
            }
            Pat::Rest(rest) => self.collect_binding_names(rest.arg, out),
            Pat::Assign(assign) => self.collect_binding_names(assign.left, out),
        }
    }

    fn declare_binding_pat(&mut self, pat_id: PatId, scope: ScopeId, kind: SymbolKind) {
        let mut names = Vec::new();
        self.collect_binding_names(pat_id, &mut names);
        for ident in names {
            self.declare_symbol(scope, &ident.sym, kind);
        }
    }

    fn predeclare_param_bindings(&mut self, params: &[PatId], scope: ScopeId) {
        for pat_id in params {
            self.declare_binding_pat(*pat_id, scope, SymbolKind::Param);
        }
    }

    fn visit_binding_pat(&mut self, pat_id: PatId, scope: ScopeId, kind: SymbolKind) {
        let Some(pat) = self.store.pat(pat_id).cloned() else {
            return;
        };

        match pat {
            Pat::Ident(ident) => {
                self.declare_symbol(scope, &ident.sym, kind);
            }
            Pat::Expr(expr) => {
                self.visit_assignment_target_expr(expr, ReferenceKind::Write);
            }
            Pat::Array(array) => {
                for elem in array.elems.into_iter().flatten() {
                    self.visit_binding_pat(elem, scope, kind);
                }
            }
            Pat::Object(object) => {
                for prop in object.props {
                    match prop {
                        swc_es_ast::ObjectPatProp::KeyValue(key_value) => {
                            if let PropName::Computed(expr) = key_value.key {
                                self.visit_expr(expr);
                            }
                            self.visit_binding_pat(key_value.value, scope, kind);
                        }
                        swc_es_ast::ObjectPatProp::Assign(assign) => {
                            self.declare_symbol(scope, &assign.key.sym, kind);
                            if let Some(value) = assign.value {
                                self.visit_expr(value);
                            }
                        }
                        swc_es_ast::ObjectPatProp::Rest(rest) => {
                            self.visit_binding_pat(rest.arg, scope, kind);
                        }
                    }
                }
            }
            Pat::Rest(rest) => self.visit_binding_pat(rest.arg, scope, kind),
            Pat::Assign(assign) => {
                self.visit_binding_pat(assign.left, scope, kind);
                self.visit_expr(assign.right);
            }
        }
    }

    fn visit_binding_pat_initializers(&mut self, pat_id: PatId) {
        let Some(pat) = self.store.pat(pat_id).cloned() else {
            return;
        };

        match pat {
            Pat::Ident(_) => {}
            Pat::Expr(expr) => {
                self.visit_assignment_target_expr(expr, ReferenceKind::Write);
            }
            Pat::Array(array) => {
                for elem in array.elems.into_iter().flatten() {
                    self.visit_binding_pat_initializers(elem);
                }
            }
            Pat::Object(object) => {
                for prop in object.props {
                    match prop {
                        swc_es_ast::ObjectPatProp::KeyValue(key_value) => {
                            if let PropName::Computed(expr) = key_value.key {
                                self.visit_expr(expr);
                            }
                            self.visit_binding_pat_initializers(key_value.value);
                        }
                        swc_es_ast::ObjectPatProp::Assign(assign) => {
                            if let Some(value) = assign.value {
                                self.visit_expr(value);
                            }
                        }
                        swc_es_ast::ObjectPatProp::Rest(rest) => {
                            self.visit_binding_pat_initializers(rest.arg);
                        }
                    }
                }
            }
            Pat::Rest(rest) => self.visit_binding_pat_initializers(rest.arg),
            Pat::Assign(assign) => {
                self.visit_binding_pat_initializers(assign.left);
                self.visit_expr(assign.right);
            }
        }
    }

    fn visit_assignment_target_pat(&mut self, pat_id: PatId, kind: ReferenceKind) {
        let Some(pat) = self.store.pat(pat_id).cloned() else {
            return;
        };

        match pat {
            Pat::Ident(ident) => {
                self.record_ident_reference(None, &ident, kind);
            }
            Pat::Expr(expr) => self.visit_assignment_target_expr(expr, kind),
            Pat::Array(array) => {
                for elem in array.elems.into_iter().flatten() {
                    self.visit_assignment_target_pat(elem, kind);
                }
            }
            Pat::Object(object) => {
                for prop in object.props {
                    match prop {
                        swc_es_ast::ObjectPatProp::KeyValue(key_value) => {
                            if let PropName::Computed(expr) = key_value.key {
                                self.visit_expr(expr);
                            }
                            self.visit_assignment_target_pat(key_value.value, kind);
                        }
                        swc_es_ast::ObjectPatProp::Assign(assign) => {
                            self.record_ident_reference(None, &assign.key, kind);
                            if let Some(value) = assign.value {
                                self.visit_expr(value);
                            }
                        }
                        swc_es_ast::ObjectPatProp::Rest(rest) => {
                            self.visit_assignment_target_pat(rest.arg, kind);
                        }
                    }
                }
            }
            Pat::Rest(rest) => self.visit_assignment_target_pat(rest.arg, kind),
            Pat::Assign(assign) => {
                self.visit_assignment_target_pat(assign.left, kind);
                self.visit_expr(assign.right);
            }
        }
    }

    fn visit_assignment_target_expr(&mut self, expr_id: ExprId, kind: ReferenceKind) {
        self.mark_expr_scope(expr_id);

        let Some(expr) = self.store.expr(expr_id).cloned() else {
            return;
        };

        match expr {
            Expr::Ident(ident) => self.record_ident_reference(Some(expr_id), &ident, kind),
            Expr::Member(member) => {
                self.visit_expr(member.obj);
                if let swc_es_ast::MemberProp::Computed(prop) = member.prop {
                    self.visit_expr(prop);
                }
            }
            Expr::Paren(paren) => self.visit_assignment_target_expr(paren.expr, kind),
            _ => self.visit_expr(expr_id),
        }
    }

    fn hoist_scan_stmt_list(&mut self, stmts: &[StmtId], fn_scope: ScopeId, allow_fn_hoist: bool) {
        for stmt_id in stmts {
            self.hoist_scan_stmt(*stmt_id, fn_scope, allow_fn_hoist);
        }
    }

    fn hoist_scan_for_decl(&mut self, decl_id: DeclId, fn_scope: ScopeId, allow_fn_hoist: bool) {
        let Some(decl) = self.store.decl(decl_id).cloned() else {
            return;
        };

        match decl {
            Decl::Var(var) => {
                if matches!(var.kind, VarDeclKind::Var) {
                    for declarator in var.declarators {
                        self.declare_binding_pat(declarator.name, fn_scope, SymbolKind::Var);
                    }
                }
            }
            Decl::Fn(function_decl) => {
                if allow_fn_hoist {
                    self.declare_symbol(fn_scope, &function_decl.ident.sym, SymbolKind::Function);
                }
            }
            _ => {}
        }
    }

    fn hoist_scan_stmt(&mut self, stmt_id: StmtId, fn_scope: ScopeId, allow_fn_hoist: bool) {
        let Some(stmt) = self.store.stmt(stmt_id).cloned() else {
            return;
        };

        match stmt {
            Stmt::Decl(decl) => self.hoist_scan_for_decl(decl, fn_scope, allow_fn_hoist),
            Stmt::Block(block) => self.hoist_scan_stmt_list(&block.stmts, fn_scope, false),
            Stmt::If(if_stmt) => {
                self.hoist_scan_stmt(if_stmt.cons, fn_scope, false);
                if let Some(alt) = if_stmt.alt {
                    self.hoist_scan_stmt(alt, fn_scope, false);
                }
            }
            Stmt::While(while_stmt) => self.hoist_scan_stmt(while_stmt.body, fn_scope, false),
            Stmt::DoWhile(do_while) => self.hoist_scan_stmt(do_while.body, fn_scope, false),
            Stmt::For(for_stmt) => {
                match for_stmt.head {
                    ForHead::Classic(head) => {
                        if let Some(ForInit::Decl(decl)) = head.init {
                            self.hoist_scan_for_decl(decl, fn_scope, false);
                        }
                    }
                    ForHead::In(head) => {
                        if let ForBinding::Decl(decl) = head.left {
                            self.hoist_scan_for_decl(decl, fn_scope, false);
                        }
                    }
                    ForHead::Of(head) => {
                        if let ForBinding::Decl(decl) = head.left {
                            self.hoist_scan_for_decl(decl, fn_scope, false);
                        }
                    }
                }
                self.hoist_scan_stmt(for_stmt.body, fn_scope, false);
            }
            Stmt::Switch(switch_stmt) => {
                for case in switch_stmt.cases {
                    self.hoist_scan_stmt_list(&case.cons, fn_scope, false);
                }
            }
            Stmt::Try(try_stmt) => {
                self.hoist_scan_stmt(try_stmt.block, fn_scope, false);
                if let Some(handler) = try_stmt.handler {
                    self.hoist_scan_stmt(handler.body, fn_scope, false);
                }
                if let Some(finalizer) = try_stmt.finalizer {
                    self.hoist_scan_stmt(finalizer, fn_scope, false);
                }
            }
            Stmt::With(with_stmt) => self.hoist_scan_stmt(with_stmt.body, fn_scope, false),
            Stmt::Labeled(labeled) => self.hoist_scan_stmt(labeled.body, fn_scope, false),
            Stmt::Empty(_)
            | Stmt::Expr(_)
            | Stmt::Return(_)
            | Stmt::Throw(_)
            | Stmt::Break(_)
            | Stmt::Continue(_)
            | Stmt::Debugger(_)
            | Stmt::ModuleDecl(_) => {}
        }
    }

    fn predeclare_lexical_stmt_list(&mut self, stmts: &[StmtId], scope: ScopeId) {
        for stmt_id in stmts {
            let Some(stmt) = self.store.stmt(*stmt_id).cloned() else {
                continue;
            };

            match stmt {
                Stmt::Decl(decl_id) => {
                    let Some(decl) = self.store.decl(decl_id).cloned() else {
                        continue;
                    };
                    match decl {
                        Decl::Var(var) => {
                            let kind = match var.kind {
                                VarDeclKind::Var => None,
                                VarDeclKind::Let | VarDeclKind::Using | VarDeclKind::AwaitUsing => {
                                    Some(SymbolKind::Let)
                                }
                                VarDeclKind::Const => Some(SymbolKind::Const),
                            };

                            if let Some(kind) = kind {
                                for declarator in var.declarators {
                                    self.declare_binding_pat(declarator.name, scope, kind);
                                }
                            }
                        }
                        Decl::Fn(function_decl) => {
                            self.declare_symbol(
                                scope,
                                &function_decl.ident.sym,
                                SymbolKind::Function,
                            );
                        }
                        Decl::Class(class_decl) => {
                            self.declare_symbol(scope, &class_decl.ident.sym, SymbolKind::Class);
                        }
                        _ => {}
                    }
                }
                Stmt::ModuleDecl(module_decl_id) => {
                    let Some(module_decl) = self.store.module_decl(module_decl_id).cloned() else {
                        continue;
                    };
                    if let ModuleDecl::Import(import) = module_decl {
                        if import.type_only {
                            continue;
                        }
                        for specifier in import.specifiers {
                            match specifier {
                                swc_es_ast::ImportSpecifier::Default(default) => {
                                    self.declare_symbol(
                                        scope,
                                        &default.local.sym,
                                        SymbolKind::Import,
                                    );
                                }
                                swc_es_ast::ImportSpecifier::Namespace(namespace) => {
                                    self.declare_symbol(
                                        scope,
                                        &namespace.local.sym,
                                        SymbolKind::Import,
                                    );
                                }
                                swc_es_ast::ImportSpecifier::Named(named) => {
                                    if named.is_type_only {
                                        continue;
                                    }
                                    self.declare_symbol(
                                        scope,
                                        &named.local.sym,
                                        SymbolKind::Import,
                                    );
                                }
                            }
                        }
                    }
                }
                _ => {}
            }
        }
    }

    fn visit_program(&mut self, program_id: ProgramId) {
        let Some(program) = self.store.program(program_id).cloned() else {
            return;
        };

        let program_scope = self.push_scope(ScopeKind::Program);
        self.hoist_scan_stmt_list(&program.body, program_scope, true);
        self.predeclare_lexical_stmt_list(&program.body, program_scope);
        self.visit_stmt_list(&program.body);
        self.pop_scope();
    }

    fn visit_stmt_list(&mut self, stmts: &[StmtId]) {
        for stmt_id in stmts {
            self.visit_stmt(*stmt_id);
        }
    }

    fn visit_stmt(&mut self, stmt_id: StmtId) {
        self.mark_stmt_scope(stmt_id);

        let Some(stmt) = self.store.stmt(stmt_id).cloned() else {
            return;
        };

        match stmt {
            Stmt::Empty(_) | Stmt::Debugger(_) | Stmt::Break(_) | Stmt::Continue(_) => {}
            Stmt::Expr(expr_stmt) => self.visit_expr(expr_stmt.expr),
            Stmt::Return(ret) => {
                if let Some(arg) = ret.arg {
                    self.visit_expr(arg);
                }
            }
            Stmt::If(if_stmt) => {
                self.visit_expr(if_stmt.test);
                self.visit_stmt(if_stmt.cons);
                if let Some(alt) = if_stmt.alt {
                    self.visit_stmt(alt);
                }
            }
            Stmt::While(while_stmt) => {
                self.visit_expr(while_stmt.test);
                self.visit_stmt(while_stmt.body);
            }
            Stmt::For(for_stmt) => self.visit_for_stmt(for_stmt),
            Stmt::DoWhile(do_while) => {
                self.visit_stmt(do_while.body);
                self.visit_expr(do_while.test);
            }
            Stmt::Switch(switch_stmt) => {
                let discriminant = switch_stmt.discriminant;
                let cases = switch_stmt.cases;

                // The discriminant is evaluated before entering the switch
                // lexical environment.
                self.visit_expr(discriminant);

                let switch_scope = self.push_scope(ScopeKind::Block);
                let mut case_stmts = Vec::new();
                for case in &cases {
                    case_stmts.extend(case.cons.iter().copied());
                }
                self.predeclare_lexical_stmt_list(&case_stmts, switch_scope);
                for case in cases {
                    if let Some(test) = case.test {
                        self.visit_expr(test);
                    }
                    self.visit_stmt_list(&case.cons);
                }
                self.pop_scope();
            }
            Stmt::Try(try_stmt) => {
                self.visit_stmt(try_stmt.block);
                if let Some(handler) = try_stmt.handler {
                    let _catch_scope = self.push_scope(ScopeKind::Catch);
                    if let Some(param) = handler.param {
                        let catch_scope = self.current_scope();
                        self.visit_binding_pat(param, catch_scope, SymbolKind::CatchParam);
                    }
                    self.visit_stmt(handler.body);
                    self.pop_scope();
                }
                if let Some(finalizer) = try_stmt.finalizer {
                    self.visit_stmt(finalizer);
                }
            }
            Stmt::Throw(throw_stmt) => self.visit_expr(throw_stmt.arg),
            Stmt::With(with_stmt) => {
                self.mark_dynamic_lookup();
                self.visit_expr(with_stmt.obj);
                self.visit_stmt(with_stmt.body);
            }
            Stmt::Labeled(labeled) => self.visit_stmt(labeled.body),
            Stmt::Block(block) => {
                let block_scope = self.push_scope(ScopeKind::Block);
                self.predeclare_lexical_stmt_list(&block.stmts, block_scope);
                self.visit_stmt_list(&block.stmts);
                self.pop_scope();
            }
            Stmt::Decl(decl) => self.visit_decl(decl),
            Stmt::ModuleDecl(module_decl) => self.visit_module_decl(module_decl),
        }
    }

    fn visit_for_stmt(&mut self, for_stmt: swc_es_ast::ForStmt) {
        let loop_scope = self.push_scope(ScopeKind::Block);

        match &for_stmt.head {
            ForHead::Classic(head) => {
                if let Some(ForInit::Decl(decl_id)) = head.init {
                    if let Some(Decl::Var(var)) = self.store.decl(decl_id).cloned() {
                        let kind = match var.kind {
                            VarDeclKind::Var => None,
                            VarDeclKind::Let
                            | VarDeclKind::Const
                            | VarDeclKind::Using
                            | VarDeclKind::AwaitUsing => Some(var.kind),
                        };

                        if let Some(kind) = kind {
                            let symbol_kind = match kind {
                                VarDeclKind::Const => SymbolKind::Const,
                                VarDeclKind::Let | VarDeclKind::Using | VarDeclKind::AwaitUsing => {
                                    SymbolKind::Let
                                }
                                VarDeclKind::Var => SymbolKind::Var,
                            };

                            for declarator in var.declarators {
                                self.declare_binding_pat(declarator.name, loop_scope, symbol_kind);
                            }
                        }
                    }
                }
            }
            ForHead::In(head) => {
                if let ForBinding::Decl(decl_id) = head.left {
                    if let Some(Decl::Var(var)) = self.store.decl(decl_id).cloned() {
                        if !matches!(var.kind, VarDeclKind::Var) {
                            let symbol_kind = if matches!(var.kind, VarDeclKind::Const) {
                                SymbolKind::Const
                            } else {
                                SymbolKind::Let
                            };
                            for declarator in var.declarators {
                                self.declare_binding_pat(declarator.name, loop_scope, symbol_kind);
                            }
                        }
                    }
                }
            }
            ForHead::Of(head) => {
                if let ForBinding::Decl(decl_id) = head.left {
                    if let Some(Decl::Var(var)) = self.store.decl(decl_id).cloned() {
                        if !matches!(var.kind, VarDeclKind::Var) {
                            let symbol_kind = if matches!(var.kind, VarDeclKind::Const) {
                                SymbolKind::Const
                            } else {
                                SymbolKind::Let
                            };
                            for declarator in var.declarators {
                                self.declare_binding_pat(declarator.name, loop_scope, symbol_kind);
                            }
                        }
                    }
                }
            }
        }

        match for_stmt.head {
            ForHead::Classic(head) => {
                if let Some(init) = head.init {
                    match init {
                        ForInit::Decl(decl) => self.visit_decl(decl),
                        ForInit::Expr(expr) => self.visit_expr(expr),
                    }
                }
                if let Some(test) = head.test {
                    self.visit_expr(test);
                }
                if let Some(update) = head.update {
                    self.visit_expr(update);
                }
            }
            ForHead::In(head) => {
                match head.left {
                    ForBinding::Decl(decl) => self.visit_decl(decl),
                    ForBinding::Pat(pat) => {
                        self.visit_assignment_target_pat(pat, ReferenceKind::Write);
                    }
                    ForBinding::Expr(expr) => {
                        self.visit_assignment_target_expr(expr, ReferenceKind::Write);
                    }
                }
                self.visit_expr(head.right);
            }
            ForHead::Of(head) => {
                match head.left {
                    ForBinding::Decl(decl) => self.visit_decl(decl),
                    ForBinding::Pat(pat) => {
                        self.visit_assignment_target_pat(pat, ReferenceKind::Write);
                    }
                    ForBinding::Expr(expr) => {
                        self.visit_assignment_target_expr(expr, ReferenceKind::Write);
                    }
                }
                self.visit_expr(head.right);
            }
        }

        self.visit_stmt(for_stmt.body);
        self.pop_scope();
    }

    fn visit_decl(&mut self, decl_id: DeclId) {
        self.mark_decl_scope(decl_id);

        let Some(decl) = self.store.decl(decl_id).cloned() else {
            return;
        };

        match decl {
            Decl::Var(var) => {
                let (target_scope, symbol_kind) = match var.kind {
                    VarDeclKind::Var => (self.current_function_scope(), SymbolKind::Var),
                    VarDeclKind::Const => (self.current_scope(), SymbolKind::Const),
                    VarDeclKind::Let | VarDeclKind::Using | VarDeclKind::AwaitUsing => {
                        (self.current_scope(), SymbolKind::Let)
                    }
                };

                for declarator in var.declarators {
                    self.visit_binding_pat(declarator.name, target_scope, symbol_kind);
                    if let Some(init) = declarator.init {
                        self.visit_expr(init);
                    }
                }
            }
            Decl::Fn(function_decl) => {
                let scope = self.current_scope();
                self.declare_symbol(scope, &function_decl.ident.sym, SymbolKind::Function);
                self.visit_function(function_decl.params, function_decl.body);
            }
            Decl::Class(class_decl) => {
                let scope = self.current_scope();
                self.declare_symbol(scope, &class_decl.ident.sym, SymbolKind::Class);
                self.visit_class(class_decl.ident, class_decl.class);
            }
            Decl::TsTypeAlias(_) | Decl::TsInterface(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {}
        }
    }

    fn visit_function(&mut self, params: Vec<PatId>, body: Vec<StmtId>) {
        let function_scope = self.push_scope(ScopeKind::Function);

        self.predeclare_param_bindings(&params, function_scope);
        for param in params {
            self.visit_binding_pat_initializers(param);
        }

        self.hoist_scan_stmt_list(&body, function_scope, true);
        self.predeclare_lexical_stmt_list(&body, function_scope);

        self.visit_stmt_list(&body);
        self.pop_scope();
    }

    fn visit_function_node(&mut self, function_id: FunctionId) {
        let Some(function) = self.store.function(function_id).cloned() else {
            return;
        };

        let function_scope = self.push_scope(ScopeKind::Function);

        let param_pats: Vec<PatId> = function.params.iter().map(|param| param.pat).collect();
        self.predeclare_param_bindings(&param_pats, function_scope);

        for param in function.params {
            for decorator in param.decorators {
                self.visit_expr(decorator.expr);
            }
            self.visit_binding_pat_initializers(param.pat);
        }

        self.hoist_scan_stmt_list(&function.body, function_scope, true);
        self.predeclare_lexical_stmt_list(&function.body, function_scope);
        self.visit_stmt_list(&function.body);
        self.pop_scope();
    }

    fn visit_arrow(&mut self, arrow: ArrowExpr) {
        let function_scope = self.push_scope(ScopeKind::Function);

        self.predeclare_param_bindings(&arrow.params, function_scope);
        for param in arrow.params {
            self.visit_binding_pat_initializers(param);
        }

        match arrow.body {
            ArrowBody::Expr(expr) => self.visit_expr(expr),
            ArrowBody::Block(stmts) => {
                self.hoist_scan_stmt_list(&stmts, function_scope, true);
                self.predeclare_lexical_stmt_list(&stmts, function_scope);
                self.visit_stmt_list(&stmts);
            }
        }

        self.pop_scope();
    }

    fn visit_class(&mut self, name: Ident, class_id: swc_es_ast::ClassId) {
        let Some(class) = self.store.class(class_id).cloned() else {
            return;
        };

        for decorator in class.decorators {
            self.visit_expr(decorator.expr);
        }

        if let Some(super_class) = class.super_class {
            self.visit_expr(super_class);
        }

        let class_scope = self.push_scope(ScopeKind::Class);
        self.declare_symbol(class_scope, &name.sym, SymbolKind::Class);

        self.visit_class_members(class.body);
        self.pop_scope();
    }

    fn visit_class_expr(&mut self, class_id: swc_es_ast::ClassId) {
        let Some(class) = self.store.class(class_id).cloned() else {
            return;
        };

        let class_ident = class.ident.clone();
        let super_class = class.super_class;
        let class_body = class.body;

        let class_scope = self.push_scope(ScopeKind::Class);
        if let Some(name) = class_ident {
            self.declare_symbol(class_scope, &name.sym, SymbolKind::Class);
        }

        for decorator in class.decorators {
            self.visit_expr(decorator.expr);
        }

        // Named class-expression self binding should be visible in heritage.
        if let Some(super_class) = super_class {
            self.visit_expr(super_class);
        }

        self.visit_class_members(class_body);
        self.pop_scope();
    }

    fn visit_class_members(&mut self, members: Vec<ClassMemberId>) {
        for member in members {
            let Some(member_node) = self.store.class_member(member).cloned() else {
                continue;
            };

            match member_node {
                ClassMember::Method(method) => {
                    for decorator in method.decorators {
                        self.visit_expr(decorator.expr);
                    }
                    if let PropName::Computed(expr) = method.key {
                        self.visit_expr(expr);
                    }
                    self.visit_function_node(method.function);
                }
                ClassMember::Prop(prop) => {
                    for decorator in prop.decorators {
                        self.visit_expr(decorator.expr);
                    }
                    if let PropName::Computed(expr) = prop.key {
                        self.visit_expr(expr);
                    }
                    if let Some(value) = prop.value {
                        self.visit_expr(value);
                    }
                }
                ClassMember::StaticBlock(block) => {
                    let static_scope = self.push_scope(ScopeKind::Function);
                    self.hoist_scan_stmt_list(&block.body, static_scope, true);
                    self.predeclare_lexical_stmt_list(&block.body, static_scope);
                    self.visit_stmt_list(&block.body);
                    self.pop_scope();
                }
            }
        }
    }

    fn visit_module_decl(&mut self, module_decl_id: swc_es_ast::ModuleDeclId) {
        let Some(module_decl) = self.store.module_decl(module_decl_id).cloned() else {
            return;
        };

        match module_decl {
            ModuleDecl::Import(import_decl) => {
                if import_decl.type_only {
                    return;
                }
                for specifier in import_decl.specifiers {
                    match specifier {
                        swc_es_ast::ImportSpecifier::Default(default) => {
                            self.declare_symbol(
                                self.current_scope(),
                                &default.local.sym,
                                SymbolKind::Import,
                            );
                        }
                        swc_es_ast::ImportSpecifier::Namespace(namespace) => {
                            self.declare_symbol(
                                self.current_scope(),
                                &namespace.local.sym,
                                SymbolKind::Import,
                            );
                        }
                        swc_es_ast::ImportSpecifier::Named(named) => {
                            if named.is_type_only {
                                continue;
                            }
                            self.declare_symbol(
                                self.current_scope(),
                                &named.local.sym,
                                SymbolKind::Import,
                            );
                        }
                    }
                }
            }
            ModuleDecl::ExportNamed(named) => {
                if !named.type_only && named.src.is_none() && named.decl.is_none() {
                    for specifier in named.specifiers {
                        if specifier.is_type_only {
                            continue;
                        }
                        self.record_ident_reference(None, &specifier.local, ReferenceKind::Read);
                    }
                }
                if let Some(decl) = named.decl {
                    self.visit_decl(decl);
                }
            }
            ModuleDecl::ExportDefaultExpr(default_expr) => {
                self.visit_expr(default_expr.expr);
            }
            ModuleDecl::ExportDefaultDecl(default_decl) => {
                self.visit_decl(default_decl.decl);
            }
            ModuleDecl::ExportAll(_) => {}
            ModuleDecl::ExportDecl(export_decl) => {
                self.visit_decl(export_decl.decl);
            }
        }
    }

    fn visit_jsx_element(&mut self, jsx_id: JSXElementId) {
        let Some(element) = self.store.jsx_element(jsx_id).cloned() else {
            return;
        };

        for attr in element.opening.attrs {
            if let Some(value) = attr.value {
                self.visit_expr(value);
            }
        }
        for child in element.children {
            match child {
                swc_es_ast::JSXElementChild::Element(child) => self.visit_jsx_element(child),
                swc_es_ast::JSXElementChild::Text(_) => {}
                swc_es_ast::JSXElementChild::Expr(expr) => self.visit_expr(expr),
            }
        }
    }

    fn visit_expr(&mut self, expr_id: ExprId) {
        self.mark_expr_scope(expr_id);

        let Some(expr) = self.store.expr(expr_id).cloned() else {
            return;
        };

        match expr {
            Expr::Ident(ident) => {
                self.record_ident_reference(Some(expr_id), &ident, ReferenceKind::Read);
            }
            Expr::Lit(_) | Expr::MetaProp(_) => {}
            Expr::Function(function_id) => self.visit_function_node(function_id),
            Expr::Class(class_id) => self.visit_class_expr(class_id),
            Expr::JSXElement(jsx_id) => self.visit_jsx_element(jsx_id),
            Expr::TsAs(ts_as) => self.visit_expr(ts_as.expr),
            Expr::TsNonNull(ts_non_null) => self.visit_expr(ts_non_null.expr),
            Expr::TsSatisfies(ts_satisfies) => self.visit_expr(ts_satisfies.expr),
            Expr::Array(array) => {
                for elem in array.elems.into_iter().flatten() {
                    self.visit_expr(elem.expr);
                }
            }
            Expr::Object(object) => {
                for prop in object.props {
                    if let PropName::Computed(expr) = prop.key {
                        self.visit_expr(expr);
                    }
                    self.visit_expr(prop.value);
                }
            }
            Expr::Unary(unary) => self.visit_expr(unary.arg),
            Expr::Binary(binary) => {
                self.visit_expr(binary.left);
                self.visit_expr(binary.right);
            }
            Expr::Assign(assign) => {
                let kind = if matches!(assign.op, swc_es_ast::AssignOp::Assign) {
                    ReferenceKind::Write
                } else {
                    ReferenceKind::ReadWrite
                };
                self.visit_assignment_target_pat(assign.left, kind);
                self.visit_expr(assign.right);
            }
            Expr::Call(call) => {
                self.visit_expr(call.callee);
                for arg in call.args {
                    self.visit_expr(arg.expr);
                }

                if let Some(Expr::Ident(ident)) = self.store.expr(call.callee) {
                    if ident.sym.as_ref() == "eval" {
                        self.mark_dynamic_lookup();
                    }
                }
            }
            Expr::Member(member) => {
                self.visit_expr(member.obj);
                if let swc_es_ast::MemberProp::Computed(expr) = member.prop {
                    self.visit_expr(expr);
                }
            }
            Expr::Cond(cond) => {
                self.visit_expr(cond.test);
                self.visit_expr(cond.cons);
                self.visit_expr(cond.alt);
            }
            Expr::Seq(seq) => {
                for expr in seq.exprs {
                    self.visit_expr(expr);
                }
            }
            Expr::New(new_expr) => {
                self.visit_expr(new_expr.callee);
                for arg in new_expr.args {
                    self.visit_expr(arg.expr);
                }
            }
            Expr::Update(update) => {
                self.visit_assignment_target_expr(update.arg, ReferenceKind::ReadWrite);
            }
            Expr::Await(await_expr) => self.visit_expr(await_expr.arg),
            Expr::Arrow(arrow) => self.visit_arrow(arrow),
            Expr::Template(template) => {
                for expr in template.exprs {
                    self.visit_expr(expr);
                }
            }
            Expr::Yield(yield_expr) => {
                if let Some(arg) = yield_expr.arg {
                    self.visit_expr(arg);
                }
            }
            Expr::TaggedTemplate(tagged) => {
                self.visit_expr(tagged.tag);
                for expr in tagged.template.exprs {
                    self.visit_expr(expr);
                }
            }
            Expr::OptChain(chain) => self.visit_expr(chain.base),
            Expr::Paren(paren) => self.visit_expr(paren.expr),
        }
    }
}
