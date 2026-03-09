use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_es_ast::*;

use crate::{analysis::AnalysisFacts, ConstValue, ReactRuntime, TransformOptions};

pub(crate) struct RewriteResult {
    pub program: ProgramId,
    pub changed: bool,
    pub nodes: u32,
}

#[derive(Debug, Clone)]
struct ReactRuntimeState {
    needs_jsx: bool,
    needs_jsxs: bool,
    needs_fragment: bool,
    has_jsx: bool,
    has_jsxs: bool,
    has_fragment: bool,
    local_jsx: Atom,
    local_jsxs: Atom,
    local_fragment: Atom,
    used_names: FxHashSet<Atom>,
}

impl Default for ReactRuntimeState {
    fn default() -> Self {
        Self {
            needs_jsx: false,
            needs_jsxs: false,
            needs_fragment: false,
            has_jsx: false,
            has_jsxs: false,
            has_fragment: false,
            local_jsx: Atom::new("_jsx"),
            local_jsxs: Atom::new("_jsxs"),
            local_fragment: Atom::new("_Fragment"),
            used_names: FxHashSet::default(),
        }
    }
}

pub(crate) fn rewrite_once(
    store: &mut AstStore,
    program: ProgramId,
    options: &TransformOptions,
    facts: &AnalysisFacts,
) -> RewriteResult {
    let mut rewriter = Rewriter {
        store,
        options,
        facts,
        react: ReactRuntimeState::default(),
        changed: false,
        nodes: 0,
    };

    let program = rewriter.rewrite_program(program);

    RewriteResult {
        program,
        changed: rewriter.changed,
        nodes: rewriter.nodes,
    }
}

struct Rewriter<'a> {
    store: &'a mut AstStore,
    options: &'a TransformOptions,
    facts: &'a AnalysisFacts,
    react: ReactRuntimeState,
    changed: bool,
    nodes: u32,
}

impl Rewriter<'_> {
    #[inline]
    fn bump_node(&mut self) {
        self.nodes = self.nodes.saturating_add(1);
    }

    fn rewrite_program(&mut self, id: ProgramId) -> ProgramId {
        self.bump_node();
        let Some(program) = self.store.program(id).cloned() else {
            return id;
        };

        if self.options.react.enabled
            && matches!(self.options.react.runtime, ReactRuntime::Automatic)
        {
            self.prepare_react_runtime_locals(&program);
        }

        let mut next = program.clone();
        next.body.clear();
        for stmt in program.body.iter().copied() {
            next.body.extend(self.rewrite_stmt_to_vec(stmt));
        }

        if self.options.react.enabled
            && matches!(self.options.react.runtime, ReactRuntime::Automatic)
        {
            self.inject_react_runtime_imports(&mut next);
        }

        if next != program {
            if let Some(slot) = self.store.program_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_stmt_to_vec(&mut self, id: StmtId) -> Vec<StmtId> {
        let id = self.rewrite_stmt(id);

        if !self.options.typescript.enabled {
            return if self.is_empty_stmt(id) {
                Vec::new()
            } else {
                vec![id]
            };
        }

        let mut expanded = self.expand_stmt(id);
        expanded.retain(|stmt| !self.is_empty_stmt(*stmt));
        expanded
    }

    fn rewrite_stmt_to_single(&mut self, id: StmtId) -> StmtId {
        let mut stmts = self.rewrite_stmt_to_vec(id);
        if stmts.len() == 1 {
            return stmts.pop().unwrap_or(id);
        }

        self.changed = true;
        self.store.alloc_stmt(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            stmts,
        }))
    }

    fn is_empty_stmt(&self, id: StmtId) -> bool {
        matches!(self.store.stmt(id), Some(Stmt::Empty(_)))
    }

    fn should_drop_decl(&self, decl: &Decl) -> bool {
        if !self.options.typescript.enabled {
            return false;
        }

        match decl {
            Decl::TsTypeAlias(_) | Decl::TsInterface(_) => true,
            Decl::Var(var) => self.options.typescript.drop_declare && var.declare,
            Decl::Fn(function) => self.options.typescript.drop_declare && function.declare,
            Decl::Class(class_decl) => self.options.typescript.drop_declare && class_decl.declare,
            Decl::TsEnum(ts_enum) => self.options.typescript.drop_declare && ts_enum.declare,
            Decl::TsModule(module) => self.options.typescript.drop_declare && module.declare,
        }
    }

    fn expand_stmt(&mut self, id: StmtId) -> Vec<StmtId> {
        let Some(stmt) = self.store.stmt(id).cloned() else {
            return vec![id];
        };

        match stmt {
            Stmt::Empty(_) => Vec::new(),
            Stmt::Decl(decl) => self.expand_decl_stmt(id, decl),
            Stmt::ModuleDecl(module_decl) => self.expand_module_decl_stmt(id, module_decl),
            _ => vec![id],
        }
    }

    fn expand_decl_stmt(&mut self, stmt_id: StmtId, decl_id: DeclId) -> Vec<StmtId> {
        let Some(decl) = self.store.decl(decl_id).cloned() else {
            return vec![stmt_id];
        };

        if self.should_drop_decl(&decl) {
            return Vec::new();
        }

        match decl {
            Decl::TsEnum(ts_enum) if self.options.typescript.transform_enum => {
                self.lower_ts_enum_decl(&ts_enum, false)
            }
            Decl::TsModule(module) if self.options.typescript.transform_namespace => {
                self.lower_ts_module_decl(&module, false, None)
            }
            _ => vec![stmt_id],
        }
    }

    fn expand_module_decl_stmt(
        &mut self,
        stmt_id: StmtId,
        module_decl_id: ModuleDeclId,
    ) -> Vec<StmtId> {
        let Some(module_decl) = self.store.module_decl(module_decl_id).cloned() else {
            return vec![stmt_id];
        };

        match module_decl {
            ModuleDecl::Import(mut import_decl) => {
                if !self.options.typescript.enabled {
                    return vec![stmt_id];
                }

                if import_decl.type_only {
                    return Vec::new();
                }

                let original_len = import_decl.specifiers.len();
                import_decl.specifiers.retain(|specifier| match specifier {
                    ImportSpecifier::Named(named) => !named.is_type_only,
                    ImportSpecifier::Default(_) | ImportSpecifier::Namespace(_) => true,
                });

                if original_len > 0 && import_decl.specifiers.is_empty() {
                    return Vec::new();
                }

                let next = ModuleDecl::Import(import_decl);
                if let Some(slot) = self.store.module_decl_mut(module_decl_id) {
                    if *slot != next {
                        *slot = next;
                        self.changed = true;
                    }
                }
                vec![stmt_id]
            }
            ModuleDecl::ExportAll(export_all) => {
                if self.options.typescript.enabled && export_all.type_only {
                    return Vec::new();
                }
                vec![stmt_id]
            }
            ModuleDecl::ExportNamed(mut named) => {
                if self.options.typescript.enabled {
                    if named.type_only {
                        return Vec::new();
                    }

                    named.specifiers.retain(|specifier| !specifier.is_type_only);

                    if named.decl.is_none() && named.specifiers.is_empty() {
                        return Vec::new();
                    }
                }

                let next = ModuleDecl::ExportNamed(named);
                if let Some(slot) = self.store.module_decl_mut(module_decl_id) {
                    if *slot != next {
                        *slot = next;
                        self.changed = true;
                    }
                }
                vec![stmt_id]
            }
            ModuleDecl::ExportDecl(export_decl) => {
                let Some(decl) = self.store.decl(export_decl.decl).cloned() else {
                    return vec![stmt_id];
                };

                if self.should_drop_decl(&decl) {
                    return Vec::new();
                }

                match decl {
                    Decl::TsEnum(ts_enum) if self.options.typescript.transform_enum => {
                        self.lower_ts_enum_decl(&ts_enum, true)
                    }
                    Decl::TsModule(module) if self.options.typescript.transform_namespace => {
                        self.lower_ts_module_decl(&module, true, None)
                    }
                    _ => vec![stmt_id],
                }
            }
            ModuleDecl::ExportDefaultDecl(default_decl) => {
                let Some(decl) = self.store.decl(default_decl.decl).cloned() else {
                    return vec![stmt_id];
                };
                if self.should_drop_decl(&decl) {
                    return Vec::new();
                }
                vec![stmt_id]
            }
            ModuleDecl::ExportDefaultExpr(_) => vec![stmt_id],
        }
    }

    fn rewrite_stmt(&mut self, id: StmtId) -> StmtId {
        self.bump_node();
        let Some(stmt) = self.store.stmt(id).cloned() else {
            return id;
        };

        let mut next = stmt.clone();

        match &mut next {
            Stmt::Empty(_) | Stmt::Debugger(_) | Stmt::Break(_) | Stmt::Continue(_) => {}
            Stmt::Expr(expr_stmt) => {
                expr_stmt.expr = self.rewrite_expr(expr_stmt.expr);
            }
            Stmt::Return(ret) => {
                if let Some(arg) = ret.arg {
                    ret.arg = Some(self.rewrite_expr(arg));
                }
            }
            Stmt::If(if_stmt) => {
                if_stmt.test = self.rewrite_expr(if_stmt.test);
                if_stmt.cons = self.rewrite_stmt_to_single(if_stmt.cons);
                if let Some(alt) = if_stmt.alt {
                    if_stmt.alt = Some(self.rewrite_stmt_to_single(alt));
                }
            }
            Stmt::While(while_stmt) => {
                while_stmt.test = self.rewrite_expr(while_stmt.test);
                while_stmt.body = self.rewrite_stmt_to_single(while_stmt.body);
            }
            Stmt::For(for_stmt) => {
                match &mut for_stmt.head {
                    ForHead::Classic(head) => {
                        if let Some(init) = &mut head.init {
                            match init {
                                ForInit::Decl(decl) => *decl = self.rewrite_decl(*decl),
                                ForInit::Expr(expr) => *expr = self.rewrite_expr(*expr),
                            }
                        }
                        if let Some(test) = head.test {
                            head.test = Some(self.rewrite_expr(test));
                        }
                        if let Some(update) = head.update {
                            head.update = Some(self.rewrite_expr(update));
                        }
                    }
                    ForHead::In(head) => {
                        match &mut head.left {
                            ForBinding::Decl(decl) => *decl = self.rewrite_decl(*decl),
                            ForBinding::Pat(pat) => *pat = self.rewrite_pat(*pat),
                            ForBinding::Expr(expr) => *expr = self.rewrite_expr(*expr),
                        }
                        head.right = self.rewrite_expr(head.right);
                    }
                    ForHead::Of(head) => {
                        match &mut head.left {
                            ForBinding::Decl(decl) => *decl = self.rewrite_decl(*decl),
                            ForBinding::Pat(pat) => *pat = self.rewrite_pat(*pat),
                            ForBinding::Expr(expr) => *expr = self.rewrite_expr(*expr),
                        }
                        head.right = self.rewrite_expr(head.right);
                    }
                }

                for_stmt.body = self.rewrite_stmt_to_single(for_stmt.body);
            }
            Stmt::DoWhile(do_while) => {
                do_while.body = self.rewrite_stmt_to_single(do_while.body);
                do_while.test = self.rewrite_expr(do_while.test);
            }
            Stmt::Switch(switch_stmt) => {
                switch_stmt.discriminant = self.rewrite_expr(switch_stmt.discriminant);
                for case in &mut switch_stmt.cases {
                    if let Some(test) = case.test {
                        case.test = Some(self.rewrite_expr(test));
                    }
                    let mut rewritten = Vec::with_capacity(case.cons.len());
                    for cons in case.cons.drain(..) {
                        rewritten.extend(self.rewrite_stmt_to_vec(cons));
                    }
                    case.cons = rewritten;
                }
            }
            Stmt::Try(try_stmt) => {
                try_stmt.block = self.rewrite_stmt_to_single(try_stmt.block);
                if let Some(handler) = &mut try_stmt.handler {
                    if let Some(param) = handler.param {
                        handler.param = Some(self.rewrite_pat(param));
                    }
                    handler.body = self.rewrite_stmt_to_single(handler.body);
                }
                if let Some(finalizer) = try_stmt.finalizer {
                    try_stmt.finalizer = Some(self.rewrite_stmt_to_single(finalizer));
                }
            }
            Stmt::Throw(throw_stmt) => {
                throw_stmt.arg = self.rewrite_expr(throw_stmt.arg);
            }
            Stmt::With(with_stmt) => {
                with_stmt.obj = self.rewrite_expr(with_stmt.obj);
                with_stmt.body = self.rewrite_stmt_to_single(with_stmt.body);
            }
            Stmt::Labeled(labeled) => {
                labeled.body = self.rewrite_stmt_to_single(labeled.body);
            }
            Stmt::Block(block) => {
                let mut rewritten = Vec::with_capacity(block.stmts.len());
                for stmt in block.stmts.drain(..) {
                    rewritten.extend(self.rewrite_stmt_to_vec(stmt));
                }
                block.stmts = rewritten;
            }
            Stmt::Decl(decl) => *decl = self.rewrite_decl(*decl),
            Stmt::ModuleDecl(module_decl) => *module_decl = self.rewrite_module_decl(*module_decl),
        }

        if next != stmt {
            if let Some(slot) = self.store.stmt_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_decl(&mut self, id: DeclId) -> DeclId {
        self.bump_node();
        let Some(decl) = self.store.decl(id).cloned() else {
            return id;
        };

        let mut next = decl.clone();

        match &mut next {
            Decl::Var(var) => {
                for declarator in &mut var.declarators {
                    declarator.name = self.rewrite_pat(declarator.name);
                    if let Some(init) = declarator.init {
                        declarator.init = Some(self.rewrite_expr(init));
                    }
                }
            }
            Decl::Fn(function) => {
                for param in &mut function.params {
                    *param = self.rewrite_pat(*param);
                }
                let mut rewritten = Vec::with_capacity(function.body.len());
                for stmt in function.body.drain(..) {
                    rewritten.extend(self.rewrite_stmt_to_vec(stmt));
                }
                function.body = rewritten;
            }
            Decl::Class(class_decl) => {
                class_decl.class = self.rewrite_class(class_decl.class);
            }
            Decl::TsTypeAlias(type_alias) => {
                type_alias.ty = self.rewrite_ts_type(type_alias.ty);
            }
            Decl::TsInterface(interface_decl) => {
                for member in &mut interface_decl.body {
                    self.rewrite_ts_type_member(member);
                }
            }
            Decl::TsEnum(ts_enum) => {
                for member in &mut ts_enum.members {
                    if let Some(init) = member.init {
                        member.init = Some(self.rewrite_expr(init));
                    }
                }
            }
            Decl::TsModule(module) => {
                self.rewrite_ts_module_decl(module);
            }
        }

        if next != decl {
            if let Some(slot) = self.store.decl_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_pat(&mut self, id: PatId) -> PatId {
        self.bump_node();
        let Some(pat) = self.store.pat(id).cloned() else {
            return id;
        };

        let mut next = pat.clone();

        match &mut next {
            Pat::Ident(_) => {}
            Pat::Expr(expr) => *expr = self.rewrite_expr(*expr),
            Pat::Array(array) => {
                for pat in array.elems.iter_mut().flatten() {
                    *pat = self.rewrite_pat(*pat);
                }
            }
            Pat::Object(object) => {
                for prop in &mut object.props {
                    match prop {
                        ObjectPatProp::KeyValue(key_value) => {
                            self.rewrite_prop_name(&mut key_value.key);
                            key_value.value = self.rewrite_pat(key_value.value);
                        }
                        ObjectPatProp::Assign(assign) => {
                            if let Some(value) = assign.value {
                                assign.value = Some(self.rewrite_expr(value));
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            rest.arg = self.rewrite_pat(rest.arg);
                        }
                    }
                }
            }
            Pat::Rest(rest) => {
                rest.arg = self.rewrite_pat(rest.arg);
            }
            Pat::Assign(assign) => {
                assign.left = self.rewrite_pat(assign.left);
                assign.right = self.rewrite_expr(assign.right);
            }
        }

        if next != pat {
            if let Some(slot) = self.store.pat_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_expr(&mut self, id: ExprId) -> ExprId {
        self.bump_node();
        let Some(expr) = self.store.expr(id).cloned() else {
            return id;
        };

        let mut next = expr.clone();

        match &mut next {
            Expr::Ident(_) | Expr::Lit(_) | Expr::MetaProp(_) => {}
            Expr::Function(function) => *function = self.rewrite_function(*function),
            Expr::Class(class) => *class = self.rewrite_class(*class),
            Expr::JSXElement(element) => *element = self.rewrite_jsx_element(*element),
            Expr::TsAs(as_expr) => {
                as_expr.expr = self.rewrite_expr(as_expr.expr);
                as_expr.ty = self.rewrite_ts_type(as_expr.ty);
            }
            Expr::TsNonNull(non_null) => {
                non_null.expr = self.rewrite_expr(non_null.expr);
            }
            Expr::TsSatisfies(satisfies) => {
                satisfies.expr = self.rewrite_expr(satisfies.expr);
                satisfies.ty = self.rewrite_ts_type(satisfies.ty);
            }
            Expr::Array(array) => {
                for elem in array.elems.iter_mut().flatten() {
                    elem.expr = self.rewrite_expr(elem.expr);
                }
            }
            Expr::Object(object) => {
                for prop in &mut object.props {
                    self.rewrite_prop_name(&mut prop.key);
                    prop.value = self.rewrite_expr(prop.value);
                }
            }
            Expr::Unary(unary) => unary.arg = self.rewrite_expr(unary.arg),
            Expr::Binary(binary) => {
                binary.left = self.rewrite_expr(binary.left);
                binary.right = self.rewrite_expr(binary.right);
            }
            Expr::Assign(assign) => {
                assign.left = self.rewrite_pat(assign.left);
                assign.right = self.rewrite_expr(assign.right);
            }
            Expr::Call(call) => {
                call.callee = self.rewrite_expr(call.callee);
                for arg in &mut call.args {
                    arg.expr = self.rewrite_expr(arg.expr);
                }
            }
            Expr::Member(member) => {
                member.obj = self.rewrite_expr(member.obj);
                if let MemberProp::Computed(expr) = &mut member.prop {
                    *expr = self.rewrite_expr(*expr);
                }
            }
            Expr::Cond(cond) => {
                cond.test = self.rewrite_expr(cond.test);
                cond.cons = self.rewrite_expr(cond.cons);
                cond.alt = self.rewrite_expr(cond.alt);
            }
            Expr::Seq(seq) => {
                for expr in &mut seq.exprs {
                    *expr = self.rewrite_expr(*expr);
                }
            }
            Expr::New(new_expr) => {
                new_expr.callee = self.rewrite_expr(new_expr.callee);
                for arg in &mut new_expr.args {
                    arg.expr = self.rewrite_expr(arg.expr);
                }
            }
            Expr::Update(update) => {
                update.arg = self.rewrite_expr(update.arg);
            }
            Expr::Await(await_expr) => {
                await_expr.arg = self.rewrite_expr(await_expr.arg);
            }
            Expr::Arrow(arrow) => {
                for param in &mut arrow.params {
                    *param = self.rewrite_pat(*param);
                }
                match &mut arrow.body {
                    ArrowBody::Expr(expr) => *expr = self.rewrite_expr(*expr),
                    ArrowBody::Block(stmts) => {
                        let mut rewritten = Vec::with_capacity(stmts.len());
                        for stmt in stmts.drain(..) {
                            rewritten.extend(self.rewrite_stmt_to_vec(stmt));
                        }
                        *stmts = rewritten;
                    }
                }
            }
            Expr::Template(template) => {
                for expr in &mut template.exprs {
                    *expr = self.rewrite_expr(*expr);
                }
            }
            Expr::Yield(yield_expr) => {
                if let Some(arg) = yield_expr.arg {
                    yield_expr.arg = Some(self.rewrite_expr(arg));
                }
            }
            Expr::TaggedTemplate(tagged) => {
                tagged.tag = self.rewrite_expr(tagged.tag);
                for expr in &mut tagged.template.exprs {
                    *expr = self.rewrite_expr(*expr);
                }
            }
            Expr::OptChain(chain) => {
                chain.base = self.rewrite_expr(chain.base);
            }
            Expr::Paren(paren) => {
                paren.expr = self.rewrite_expr(paren.expr);
            }
        }

        if self.options.typescript.enabled {
            next = self.apply_typescript_expr(next);
        }

        if self.options.react.enabled {
            next = self.apply_react_expr(next);
        }

        if self.options.enable_normalize {
            next = self.apply_normalize(next);
        }

        next = self.apply_lowering(id, next);
        next = self.apply_cleanup(id, next);

        if next != expr {
            if let Some(slot) = self.store.expr_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_module_decl(&mut self, id: ModuleDeclId) -> ModuleDeclId {
        self.bump_node();
        let Some(module_decl) = self.store.module_decl(id).cloned() else {
            return id;
        };

        let mut next = module_decl.clone();

        match &mut next {
            ModuleDecl::Import(_) | ModuleDecl::ExportAll(_) => {}
            ModuleDecl::ExportNamed(named) => {
                if let Some(decl) = named.decl {
                    named.decl = Some(self.rewrite_decl(decl));
                }
            }
            ModuleDecl::ExportDefaultExpr(default_expr) => {
                default_expr.expr = self.rewrite_expr(default_expr.expr);
            }
            ModuleDecl::ExportDefaultDecl(default_decl) => {
                default_decl.decl = self.rewrite_decl(default_decl.decl);
            }
            ModuleDecl::ExportDecl(export_decl) => {
                export_decl.decl = self.rewrite_decl(export_decl.decl);
            }
        }

        if next != module_decl {
            if let Some(slot) = self.store.module_decl_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_function(&mut self, id: FunctionId) -> FunctionId {
        self.bump_node();
        let Some(function) = self.store.function(id).cloned() else {
            return id;
        };

        let mut next = function.clone();
        for param in &mut next.params {
            for decorator in &mut param.decorators {
                decorator.expr = self.rewrite_expr(decorator.expr);
            }
            param.pat = self.rewrite_pat(param.pat);
        }
        let mut rewritten = Vec::with_capacity(next.body.len());
        for stmt in next.body.drain(..) {
            rewritten.extend(self.rewrite_stmt_to_vec(stmt));
        }
        next.body = rewritten;

        if next != function {
            if let Some(slot) = self.store.function_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_class(&mut self, id: ClassId) -> ClassId {
        self.bump_node();
        let Some(class) = self.store.class(id).cloned() else {
            return id;
        };

        let mut next = class.clone();
        for decorator in &mut next.decorators {
            decorator.expr = self.rewrite_expr(decorator.expr);
        }

        if let Some(super_class) = next.super_class {
            next.super_class = Some(self.rewrite_expr(super_class));
        }

        for member in &mut next.body {
            *member = self.rewrite_class_member(*member);
        }

        if next != class {
            if let Some(slot) = self.store.class_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_class_member(&mut self, id: ClassMemberId) -> ClassMemberId {
        self.bump_node();
        let Some(member) = self.store.class_member(id).cloned() else {
            return id;
        };

        let mut next = member.clone();

        match &mut next {
            ClassMember::Method(method) => {
                for decorator in &mut method.decorators {
                    decorator.expr = self.rewrite_expr(decorator.expr);
                }
                self.rewrite_prop_name(&mut method.key);
                method.function = self.rewrite_function(method.function);
            }
            ClassMember::Prop(prop) => {
                for decorator in &mut prop.decorators {
                    decorator.expr = self.rewrite_expr(decorator.expr);
                }
                self.rewrite_prop_name(&mut prop.key);
                if let Some(value) = prop.value {
                    prop.value = Some(self.rewrite_expr(value));
                }
            }
            ClassMember::StaticBlock(block) => {
                let mut rewritten = Vec::with_capacity(block.body.len());
                for stmt in block.body.drain(..) {
                    rewritten.extend(self.rewrite_stmt_to_vec(stmt));
                }
                block.body = rewritten;
            }
        }

        if next != member {
            if let Some(slot) = self.store.class_member_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_jsx_element(&mut self, id: JSXElementId) -> JSXElementId {
        self.bump_node();
        let Some(element) = self.store.jsx_element(id).cloned() else {
            return id;
        };

        let mut next = element.clone();

        for attr in &mut next.opening.attrs {
            if let Some(value) = attr.value {
                attr.value = Some(self.rewrite_expr(value));
            }
        }

        for child in &mut next.children {
            match child {
                JSXElementChild::Element(element) => *element = self.rewrite_jsx_element(*element),
                JSXElementChild::Text(_) => {}
                JSXElementChild::Expr(expr) => *expr = self.rewrite_expr(*expr),
            }
        }

        if next != element {
            if let Some(slot) = self.store.jsx_element_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_ts_type(&mut self, id: TsTypeId) -> TsTypeId {
        self.bump_node();
        let Some(ty) = self.store.ts_type(id).cloned() else {
            return id;
        };

        let mut next = ty.clone();

        match &mut next {
            TsType::Keyword(_) | TsType::Lit(_) | TsType::Infer(_) | TsType::TypeQuery(_) => {}
            TsType::TypeRef(type_ref) => {
                for arg in &mut type_ref.type_args {
                    *arg = self.rewrite_ts_type(*arg);
                }
            }
            TsType::Array(array) => array.elem_type = self.rewrite_ts_type(array.elem_type),
            TsType::Tuple(tuple) => {
                for elem in &mut tuple.elem_types {
                    *elem = self.rewrite_ts_type(*elem);
                }
            }
            TsType::Union(union) => {
                for ty in &mut union.types {
                    *ty = self.rewrite_ts_type(*ty);
                }
            }
            TsType::Intersection(intersection) => {
                for ty in &mut intersection.types {
                    *ty = self.rewrite_ts_type(*ty);
                }
            }
            TsType::Parenthesized(paren) => paren.ty = self.rewrite_ts_type(paren.ty),
            TsType::TypeLit(type_lit) => {
                for member in &mut type_lit.members {
                    self.rewrite_ts_type_member(member);
                }
            }
            TsType::Fn(function) => {
                for param in &mut function.params {
                    self.rewrite_ts_fn_param(param);
                }
                function.return_type = self.rewrite_ts_type(function.return_type);
            }
            TsType::Conditional(cond) => {
                cond.check_type = self.rewrite_ts_type(cond.check_type);
                cond.extends_type = self.rewrite_ts_type(cond.extends_type);
                cond.true_type = self.rewrite_ts_type(cond.true_type);
                cond.false_type = self.rewrite_ts_type(cond.false_type);
            }
            TsType::IndexedAccess(indexed) => {
                indexed.obj_type = self.rewrite_ts_type(indexed.obj_type);
                indexed.index_type = self.rewrite_ts_type(indexed.index_type);
            }
            TsType::TypeOperator(operator) => operator.ty = self.rewrite_ts_type(operator.ty),
            TsType::Import(import) => {
                for arg in &mut import.type_args {
                    *arg = self.rewrite_ts_type(*arg);
                }
            }
            TsType::Mapped(mapped) => {
                mapped.constraint = self.rewrite_ts_type(mapped.constraint);
                if let Some(ty) = mapped.ty {
                    mapped.ty = Some(self.rewrite_ts_type(ty));
                }
            }
        }

        if next != ty {
            if let Some(slot) = self.store.ts_type_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_ts_fn_param(&mut self, param: &mut TsFnParam) {
        if let Some(ty) = param.ty {
            param.ty = Some(self.rewrite_ts_type(ty));
        }
    }

    fn rewrite_ts_type_member(&mut self, member: &mut TsTypeMember) {
        if let Some(name) = &mut member.name {
            self.rewrite_prop_name(name);
        }
        for param in &mut member.params {
            self.rewrite_ts_fn_param(param);
        }
        if let Some(ty) = member.ty {
            member.ty = Some(self.rewrite_ts_type(ty));
        }
    }

    fn rewrite_ts_module_decl(&mut self, module: &mut TsModuleDecl) {
        if let Some(body) = &mut module.body {
            self.rewrite_ts_namespace_body(body);
        }
    }

    fn rewrite_ts_namespace_body(&mut self, body: &mut TsNamespaceBody) {
        match body {
            TsNamespaceBody::ModuleBlock(stmts) => {
                let mut rewritten = Vec::with_capacity(stmts.len());
                for stmt in stmts.drain(..) {
                    rewritten.extend(self.rewrite_stmt_to_vec(stmt));
                }
                *stmts = rewritten;
            }
            TsNamespaceBody::Namespace(namespace) => {
                self.rewrite_ts_namespace_body(&mut namespace.body);
            }
        }
    }

    fn rewrite_prop_name(&mut self, key: &mut PropName) {
        if let PropName::Computed(expr) = key {
            *expr = self.rewrite_expr(*expr);
        }
    }

    fn apply_typescript_expr(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::TsAs(ts_as) => self
                .store
                .expr(ts_as.expr)
                .cloned()
                .unwrap_or(Expr::TsAs(ts_as)),
            Expr::TsNonNull(non_null) => self
                .store
                .expr(non_null.expr)
                .cloned()
                .unwrap_or(Expr::TsNonNull(non_null)),
            Expr::TsSatisfies(satisfies) => self
                .store
                .expr(satisfies.expr)
                .cloned()
                .unwrap_or(Expr::TsSatisfies(satisfies)),
            other => other,
        }
    }

    fn apply_react_expr(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::JSXElement(element) => self.lower_jsx_element_expr(element),
            other => other,
        }
    }

    fn alloc_ident_expr(&mut self, ident: Ident) -> ExprId {
        self.store.alloc_expr(Expr::Ident(ident))
    }

    fn alloc_ident_pat(&mut self, ident: Ident) -> PatId {
        self.store.alloc_pat(Pat::Ident(ident))
    }

    fn alloc_string_expr(&mut self, span: swc_common::Span, value: Atom) -> ExprId {
        self.store
            .alloc_expr(Expr::Lit(Lit::Str(StrLit { span, value })))
    }

    fn alloc_number_expr(&mut self, span: swc_common::Span, value: f64) -> ExprId {
        self.store
            .alloc_expr(Expr::Lit(Lit::Num(NumberLit { span, value })))
    }

    fn alloc_bool_expr(&mut self, span: swc_common::Span, value: bool) -> ExprId {
        self.store
            .alloc_expr(Expr::Lit(Lit::Bool(BoolLit { span, value })))
    }

    fn alloc_null_expr(&mut self, span: swc_common::Span) -> ExprId {
        self.store
            .alloc_expr(Expr::Lit(Lit::Null(NullLit { span })))
    }

    fn alloc_empty_object_expr(&mut self, span: swc_common::Span) -> ExprId {
        self.store.alloc_expr(Expr::Object(ObjectExpr {
            span,
            props: Vec::new(),
        }))
    }

    fn alloc_assign_expr(&mut self, span: swc_common::Span, left: ExprId, right: ExprId) -> ExprId {
        let left = self.store.alloc_pat(Pat::Expr(left));
        self.store.alloc_expr(Expr::Assign(AssignExpr {
            span,
            left,
            op: AssignOp::Assign,
            right,
        }))
    }

    fn alloc_expr_stmt(&mut self, span: swc_common::Span, expr: ExprId) -> StmtId {
        self.store.alloc_stmt(Stmt::Expr(ExprStmt { span, expr }))
    }

    fn member_prop_from_atom(&mut self, span: swc_common::Span, name: Atom) -> MemberProp {
        if is_valid_ident_name(name.as_ref()) {
            MemberProp::Ident(Ident::new(span, name))
        } else {
            let key = self.alloc_string_expr(span, name);
            MemberProp::Computed(key)
        }
    }

    fn collect_pat_binding_idents(&self, id: PatId, out: &mut Vec<Ident>) {
        let Some(pat) = self.store.pat(id).cloned() else {
            return;
        };

        match pat {
            Pat::Ident(ident) => out.push(ident),
            Pat::Expr(_) => {}
            Pat::Array(array) => {
                for elem in array.elems.into_iter().flatten() {
                    self.collect_pat_binding_idents(elem, out);
                }
            }
            Pat::Object(object) => {
                for prop in object.props {
                    match prop {
                        ObjectPatProp::KeyValue(key_value) => {
                            self.collect_pat_binding_idents(key_value.value, out);
                        }
                        ObjectPatProp::Assign(assign) => out.push(assign.key),
                        ObjectPatProp::Rest(rest) => self.collect_pat_binding_idents(rest.arg, out),
                    }
                }
            }
            Pat::Rest(rest) => self.collect_pat_binding_idents(rest.arg, out),
            Pat::Assign(assign) => self.collect_pat_binding_idents(assign.left, out),
        }
    }

    fn collect_decl_binding_idents(&self, decl: &Decl) -> Vec<Ident> {
        let mut out = Vec::new();
        match decl {
            Decl::Var(var) => {
                for declarator in &var.declarators {
                    self.collect_pat_binding_idents(declarator.name, &mut out);
                }
            }
            Decl::Fn(function) => out.push(function.ident.clone()),
            Decl::Class(class_decl) => out.push(class_decl.ident.clone()),
            Decl::TsEnum(ts_enum) => out.push(ts_enum.ident.clone()),
            Decl::TsModule(module) => {
                if let TsModuleName::Ident(ident) = &module.id {
                    out.push(ident.clone());
                }
            }
            Decl::TsTypeAlias(_) | Decl::TsInterface(_) => {}
        }
        out
    }

    fn namespace_assignment_stmt(
        &mut self,
        namespace: &Ident,
        exported: &Ident,
        local: &Ident,
        span: swc_common::Span,
    ) -> StmtId {
        let ns_expr = self.alloc_ident_expr(namespace.clone());
        let prop = self.member_prop_from_atom(span, exported.sym.clone());
        let member = self.store.alloc_expr(Expr::Member(MemberExpr {
            span,
            obj: ns_expr,
            prop,
        }));
        let local_expr = self.alloc_ident_expr(local.clone());
        let assign = self.alloc_assign_expr(span, member, local_expr);
        self.alloc_expr_stmt(span, assign)
    }

    fn decl_span(&self, decl: &Decl) -> swc_common::Span {
        match decl {
            Decl::Var(var) => var.span,
            Decl::Fn(function) => function.span,
            Decl::Class(class_decl) => class_decl.span,
            Decl::TsTypeAlias(type_alias) => type_alias.span,
            Decl::TsInterface(interface_decl) => interface_decl.span,
            Decl::TsEnum(ts_enum) => ts_enum.span,
            Decl::TsModule(module) => module.span,
        }
    }

    fn alloc_var_binding_stmt(
        &mut self,
        ident: &Ident,
        span: swc_common::Span,
        export_as_module: bool,
    ) -> StmtId {
        let pat = self.alloc_ident_pat(ident.clone());
        let decl = self.store.alloc_decl(Decl::Var(VarDecl {
            span,
            kind: VarDeclKind::Var,
            declare: false,
            declarators: vec![VarDeclarator {
                span,
                name: pat,
                init: None,
            }],
        }));

        if export_as_module {
            let module_decl = self
                .store
                .alloc_module_decl(ModuleDecl::ExportDecl(ExportDecl { span, decl }));
            self.store.alloc_stmt(Stmt::ModuleDecl(module_decl))
        } else {
            self.store.alloc_stmt(Stmt::Decl(decl))
        }
    }

    fn enum_member_name_expr(&mut self, member: &TsEnumMember) -> ExprId {
        match &member.name {
            TsEnumMemberName::Ident(ident) => {
                self.alloc_string_expr(member.span, ident.sym.clone())
            }
            TsEnumMemberName::Str(string) => {
                self.alloc_string_expr(member.span, string.value.clone())
            }
            TsEnumMemberName::Num(number) => self.alloc_number_expr(member.span, number.value),
        }
    }

    fn enum_member_name_string_expr(&mut self, member: &TsEnumMember) -> ExprId {
        let value = match &member.name {
            TsEnumMemberName::Ident(ident) => ident.sym.clone(),
            TsEnumMemberName::Str(string) => string.value.clone(),
            TsEnumMemberName::Num(number) => Atom::new(number.value.to_string()),
        };
        self.alloc_string_expr(member.span, value)
    }

    fn enum_member_value_expr(
        &mut self,
        member: &TsEnumMember,
        next_numeric: &mut Option<f64>,
    ) -> (ExprId, bool) {
        if let Some(init) = member.init {
            match self.facts.expr_constant(init) {
                ConstValue::Number(value) => {
                    *next_numeric = Some(value + 1.0);
                    (init, false)
                }
                ConstValue::Str(_) => {
                    *next_numeric = None;
                    (init, true)
                }
                _ => {
                    *next_numeric = None;
                    (init, false)
                }
            }
        } else {
            let value = next_numeric.unwrap_or(0.0);
            *next_numeric = Some(value + 1.0);
            (self.alloc_number_expr(member.span, value), false)
        }
    }

    fn lower_ts_enum_decl(&mut self, ts_enum: &TsEnumDecl, export_as_module: bool) -> Vec<StmtId> {
        if self.options.typescript.drop_declare && ts_enum.declare {
            return Vec::new();
        }

        let enum_ident = ts_enum.ident.clone();
        let var_stmt = self.alloc_var_binding_stmt(&enum_ident, ts_enum.span, export_as_module);

        let mut body_stmts = Vec::with_capacity(ts_enum.members.len());
        let mut next_numeric = Some(0.0);

        for member in &ts_enum.members {
            let key_expr = self.enum_member_name_expr(member);
            let (value_expr, is_string_enum) =
                self.enum_member_value_expr(member, &mut next_numeric);

            let enum_obj = self.alloc_ident_expr(enum_ident.clone());
            let forward_member = self.store.alloc_expr(Expr::Member(MemberExpr {
                span: member.span,
                obj: enum_obj,
                prop: MemberProp::Computed(key_expr),
            }));
            let forward_assign = self.alloc_assign_expr(member.span, forward_member, value_expr);

            let runtime_expr = if is_string_enum {
                forward_assign
            } else {
                let enum_obj = self.alloc_ident_expr(enum_ident.clone());
                let reverse_member = self.store.alloc_expr(Expr::Member(MemberExpr {
                    span: member.span,
                    obj: enum_obj,
                    prop: MemberProp::Computed(forward_assign),
                }));
                let key_name = self.enum_member_name_string_expr(member);
                self.alloc_assign_expr(member.span, reverse_member, key_name)
            };

            body_stmts.push(self.alloc_expr_stmt(member.span, runtime_expr));
        }

        let param_pat = self.alloc_ident_pat(enum_ident.clone());
        let function = self.store.alloc_function(Function {
            span: ts_enum.span,
            params: vec![Param {
                span: ts_enum.span,
                decorators: Vec::new(),
                pat: param_pat,
            }],
            body: body_stmts,
            is_async: false,
            is_generator: false,
        });
        let callee = self.store.alloc_expr(Expr::Function(function));

        let enum_ref = self.alloc_ident_expr(enum_ident.clone());
        let assign_target = self.alloc_ident_expr(enum_ident.clone());
        let empty_object = self.alloc_empty_object_expr(ts_enum.span);
        let assign_expr = self.alloc_assign_expr(ts_enum.span, assign_target, empty_object);
        let arg = self.store.alloc_expr(Expr::Binary(BinaryExpr {
            span: ts_enum.span,
            op: BinaryOp::LogicalOr,
            left: enum_ref,
            right: assign_expr,
        }));
        let iife = self.store.alloc_expr(Expr::Call(CallExpr {
            span: ts_enum.span,
            callee,
            args: vec![ExprOrSpread {
                spread: false,
                expr: arg,
            }],
        }));
        let iife_stmt = self.alloc_expr_stmt(ts_enum.span, iife);

        vec![var_stmt, iife_stmt]
    }

    fn lower_ts_module_decl(
        &mut self,
        module: &TsModuleDecl,
        export_as_module: bool,
        export_to_namespace: Option<Ident>,
    ) -> Vec<StmtId> {
        if self.options.typescript.drop_declare && module.declare {
            return Vec::new();
        }
        if module.global {
            return Vec::new();
        }

        let TsModuleName::Ident(module_ident) = &module.id else {
            return Vec::new();
        };

        let module_ident = module_ident.clone();
        let var_stmt = self.alloc_var_binding_stmt(&module_ident, module.span, export_as_module);

        let body_stmts = module
            .body
            .as_ref()
            .map(|body| self.lower_ts_namespace_body_stmts(&module_ident, body))
            .unwrap_or_default();

        let param_pat = self.alloc_ident_pat(module_ident.clone());
        let function = self.store.alloc_function(Function {
            span: module.span,
            params: vec![Param {
                span: module.span,
                decorators: Vec::new(),
                pat: param_pat,
            }],
            body: body_stmts,
            is_async: false,
            is_generator: false,
        });
        let callee = self.store.alloc_expr(Expr::Function(function));

        let module_ref = self.alloc_ident_expr(module_ident.clone());
        let assign_target = self.alloc_ident_expr(module_ident.clone());
        let empty_object = self.alloc_empty_object_expr(module.span);
        let assign_expr = self.alloc_assign_expr(module.span, assign_target, empty_object);
        let arg = self.store.alloc_expr(Expr::Binary(BinaryExpr {
            span: module.span,
            op: BinaryOp::LogicalOr,
            left: module_ref,
            right: assign_expr,
        }));
        let iife = self.store.alloc_expr(Expr::Call(CallExpr {
            span: module.span,
            callee,
            args: vec![ExprOrSpread {
                spread: false,
                expr: arg,
            }],
        }));
        let iife_stmt = self.alloc_expr_stmt(module.span, iife);

        let mut out = vec![var_stmt, iife_stmt];
        if let Some(parent_namespace) = export_to_namespace {
            out.push(self.namespace_assignment_stmt(
                &parent_namespace,
                &module_ident,
                &module_ident,
                module.span,
            ));
        }
        out
    }

    fn lower_ts_namespace_body_stmts(
        &mut self,
        namespace_ident: &Ident,
        body: &TsNamespaceBody,
    ) -> Vec<StmtId> {
        match body {
            TsNamespaceBody::ModuleBlock(stmts) => {
                self.lower_ts_namespace_block(namespace_ident, stmts)
            }
            TsNamespaceBody::Namespace(namespace) => {
                let nested = TsModuleDecl {
                    span: namespace.span,
                    declare: namespace.declare,
                    global: namespace.global,
                    namespace: true,
                    id: TsModuleName::Ident(namespace.id.clone()),
                    body: Some((*namespace.body).clone()),
                };
                self.lower_ts_module_decl(&nested, false, Some(namespace_ident.clone()))
            }
        }
    }

    fn lower_ts_namespace_block(
        &mut self,
        namespace_ident: &Ident,
        stmts: &[StmtId],
    ) -> Vec<StmtId> {
        let mut out = Vec::new();
        for stmt in stmts {
            let stmt = self.rewrite_stmt(*stmt);
            let Some(node) = self.store.stmt(stmt).cloned() else {
                continue;
            };
            match node {
                Stmt::Empty(_) => {}
                Stmt::Decl(decl) => {
                    out.extend(self.lower_decl_in_namespace(stmt, decl, namespace_ident, false));
                }
                Stmt::ModuleDecl(module_decl) => {
                    out.extend(self.lower_namespace_module_decl(namespace_ident, module_decl));
                }
                _ => out.push(stmt),
            }
        }
        out
    }

    fn lower_decl_in_namespace(
        &mut self,
        stmt_id: StmtId,
        decl_id: DeclId,
        namespace_ident: &Ident,
        exported: bool,
    ) -> Vec<StmtId> {
        let Some(decl) = self.store.decl(decl_id).cloned() else {
            return Vec::new();
        };

        if self.should_drop_decl(&decl) {
            return Vec::new();
        }

        match decl {
            Decl::TsTypeAlias(_) | Decl::TsInterface(_) => Vec::new(),
            Decl::TsEnum(ts_enum) if self.options.typescript.transform_enum => {
                let mut out = self.lower_ts_enum_decl(&ts_enum, false);
                if exported {
                    out.push(self.namespace_assignment_stmt(
                        namespace_ident,
                        &ts_enum.ident,
                        &ts_enum.ident,
                        ts_enum.span,
                    ));
                }
                out
            }
            Decl::TsModule(module) if self.options.typescript.transform_namespace => self
                .lower_ts_module_decl(
                    &module,
                    false,
                    if exported {
                        Some(namespace_ident.clone())
                    } else {
                        None
                    },
                ),
            _ => {
                let span = self.decl_span(&decl);
                let mut out = vec![stmt_id];
                if exported {
                    for binding in self.collect_decl_binding_idents(&decl) {
                        out.push(self.namespace_assignment_stmt(
                            namespace_ident,
                            &binding,
                            &binding,
                            span,
                        ));
                    }
                }
                out
            }
        }
    }

    fn lower_namespace_module_decl(
        &mut self,
        namespace_ident: &Ident,
        module_decl_id: ModuleDeclId,
    ) -> Vec<StmtId> {
        let Some(module_decl) = self.store.module_decl(module_decl_id).cloned() else {
            return Vec::new();
        };

        match module_decl {
            ModuleDecl::Import(_) | ModuleDecl::ExportAll(_) => Vec::new(),
            ModuleDecl::ExportDefaultExpr(_) | ModuleDecl::ExportDefaultDecl(_) => Vec::new(),
            ModuleDecl::ExportDecl(export_decl) => {
                let stmt_id = self.store.alloc_stmt(Stmt::Decl(export_decl.decl));
                self.lower_decl_in_namespace(stmt_id, export_decl.decl, namespace_ident, true)
            }
            ModuleDecl::ExportNamed(named) => {
                if named.type_only {
                    return Vec::new();
                }

                let mut out = Vec::new();
                if let Some(decl) = named.decl {
                    let stmt_id = self.store.alloc_stmt(Stmt::Decl(decl));
                    out.extend(self.lower_decl_in_namespace(stmt_id, decl, namespace_ident, true));
                    return out;
                }

                if named.src.is_some() {
                    return Vec::new();
                }

                for specifier in named.specifiers {
                    if specifier.is_type_only {
                        continue;
                    }
                    let exported = specifier
                        .exported
                        .unwrap_or_else(|| specifier.local.clone());
                    out.push(self.namespace_assignment_stmt(
                        namespace_ident,
                        &exported,
                        &specifier.local,
                        named.span,
                    ));
                }

                out
            }
        }
    }

    fn insert_used_ident(&mut self, ident: &Ident) {
        self.react.used_names.insert(ident.sym.clone());
    }

    fn collect_program_used_names(&mut self, program: &Program) {
        for stmt in &program.body {
            let Some(stmt) = self.store.stmt(*stmt).cloned() else {
                continue;
            };

            match stmt {
                Stmt::Decl(decl_id) => {
                    if let Some(decl) = self.store.decl(decl_id).cloned() {
                        for ident in self.collect_decl_binding_idents(&decl) {
                            self.insert_used_ident(&ident);
                        }
                    }
                }
                Stmt::ModuleDecl(module_decl_id) => {
                    let Some(module_decl) = self.store.module_decl(module_decl_id).cloned() else {
                        continue;
                    };

                    match module_decl {
                        ModuleDecl::Import(import_decl) => {
                            for specifier in import_decl.specifiers {
                                match specifier {
                                    ImportSpecifier::Default(default) => {
                                        self.insert_used_ident(&default.local);
                                    }
                                    ImportSpecifier::Namespace(namespace) => {
                                        self.insert_used_ident(&namespace.local);
                                    }
                                    ImportSpecifier::Named(named) => {
                                        self.insert_used_ident(&named.local);
                                    }
                                }
                            }
                        }
                        ModuleDecl::ExportDecl(export_decl) => {
                            if let Some(decl) = self.store.decl(export_decl.decl).cloned() {
                                for ident in self.collect_decl_binding_idents(&decl) {
                                    self.insert_used_ident(&ident);
                                }
                            }
                        }
                        ModuleDecl::ExportDefaultDecl(default_decl) => {
                            if let Some(decl) = self.store.decl(default_decl.decl).cloned() {
                                for ident in self.collect_decl_binding_idents(&decl) {
                                    self.insert_used_ident(&ident);
                                }
                            }
                        }
                        ModuleDecl::ExportNamed(_)
                        | ModuleDecl::ExportDefaultExpr(_)
                        | ModuleDecl::ExportAll(_) => {}
                    }
                }
                _ => {}
            }
        }
    }

    fn fresh_react_local(&mut self, base: &str) -> Atom {
        let mut index = 0usize;
        loop {
            let candidate = if index == 0 {
                Atom::new(base)
            } else {
                Atom::new(format!("{base}{index}"))
            };
            index += 1;
            if self.react.used_names.insert(candidate.clone()) {
                return candidate;
            }
        }
    }

    fn prepare_react_runtime_locals(&mut self, program: &Program) {
        self.react = ReactRuntimeState::default();
        self.collect_program_used_names(program);

        for stmt in &program.body {
            let Some(Stmt::ModuleDecl(module_decl_id)) = self.store.stmt(*stmt).cloned() else {
                continue;
            };
            let Some(ModuleDecl::Import(import_decl)) =
                self.store.module_decl(module_decl_id).cloned()
            else {
                continue;
            };
            if import_decl.type_only || import_decl.src.value != self.options.react.import_source {
                continue;
            }

            for specifier in import_decl.specifiers {
                let ImportSpecifier::Named(named) = specifier else {
                    continue;
                };
                if named.is_type_only {
                    continue;
                }

                let imported = named
                    .imported
                    .as_ref()
                    .map(|ident| ident.sym.as_ref())
                    .unwrap_or(named.local.sym.as_ref());

                match imported {
                    "jsx" => {
                        self.react.has_jsx = true;
                        self.react.local_jsx = named.local.sym.clone();
                        self.react.used_names.insert(named.local.sym);
                    }
                    "jsxs" => {
                        self.react.has_jsxs = true;
                        self.react.local_jsxs = named.local.sym.clone();
                        self.react.used_names.insert(named.local.sym);
                    }
                    "Fragment" => {
                        self.react.has_fragment = true;
                        self.react.local_fragment = named.local.sym.clone();
                        self.react.used_names.insert(named.local.sym);
                    }
                    _ => {}
                }
            }
        }

        if !self.react.has_jsx {
            self.react.local_jsx = self.fresh_react_local("_jsx");
        }
        if !self.react.has_jsxs {
            self.react.local_jsxs = self.fresh_react_local("_jsxs");
        }
        if !self.react.has_fragment {
            self.react.local_fragment = self.fresh_react_local("_Fragment");
        }
    }

    fn inject_react_runtime_imports(&mut self, program: &mut Program) {
        let mut needed = Vec::<(&str, Atom)>::new();
        if self.react.needs_jsx && !self.react.has_jsx {
            needed.push(("jsx", self.react.local_jsx.clone()));
        }
        if self.react.needs_jsxs && !self.react.has_jsxs {
            needed.push(("jsxs", self.react.local_jsxs.clone()));
        }
        if self.react.needs_fragment && !self.react.has_fragment {
            needed.push(("Fragment", self.react.local_fragment.clone()));
        }
        if needed.is_empty() {
            return;
        }

        let mut existing_import_stmt = None;
        for stmt in &program.body {
            let Some(Stmt::ModuleDecl(module_decl_id)) = self.store.stmt(*stmt).cloned() else {
                continue;
            };
            let Some(ModuleDecl::Import(import_decl)) =
                self.store.module_decl(module_decl_id).cloned()
            else {
                continue;
            };
            if !import_decl.type_only && import_decl.src.value == self.options.react.import_source {
                existing_import_stmt = Some((*stmt, module_decl_id, import_decl));
                break;
            }
        }

        if let Some((_stmt, module_decl_id, mut import_decl)) = existing_import_stmt {
            let mut changed = false;
            for (imported_name, local_name) in &needed {
                let already = import_decl.specifiers.iter().any(|specifier| {
                    let ImportSpecifier::Named(named) = specifier else {
                        return false;
                    };
                    if named.is_type_only {
                        return false;
                    }
                    let imported = named
                        .imported
                        .as_ref()
                        .map(|ident| ident.sym.as_ref())
                        .unwrap_or(named.local.sym.as_ref());
                    imported == *imported_name
                });
                if already {
                    continue;
                }
                import_decl
                    .specifiers
                    .push(ImportSpecifier::Named(ImportNamedSpecifier {
                        local: Ident::new(DUMMY_SP, local_name.clone()),
                        imported: Some(Ident::new(DUMMY_SP, Atom::new(*imported_name))),
                        is_type_only: false,
                    }));
                changed = true;
            }

            if changed {
                if let Some(slot) = self.store.module_decl_mut(module_decl_id) {
                    *slot = ModuleDecl::Import(import_decl);
                    self.changed = true;
                }
            }
        } else {
            let mut specifiers = Vec::with_capacity(needed.len());
            for (imported_name, local_name) in needed {
                specifiers.push(ImportSpecifier::Named(ImportNamedSpecifier {
                    local: Ident::new(DUMMY_SP, local_name),
                    imported: Some(Ident::new(DUMMY_SP, Atom::new(imported_name))),
                    is_type_only: false,
                }));
            }

            let import_decl = self.store.alloc_module_decl(ModuleDecl::Import(ImportDecl {
                span: DUMMY_SP,
                specifiers,
                type_only: false,
                src: StrLit {
                    span: DUMMY_SP,
                    value: self.options.react.import_source.clone(),
                },
                with: Vec::new(),
            }));
            let import_stmt = self.store.alloc_stmt(Stmt::ModuleDecl(import_decl));
            let insert_at = program
                .body
                .iter()
                .take_while(|stmt| {
                    matches!(
                        self.store.stmt(**stmt),
                        Some(Stmt::ModuleDecl(module_decl_id))
                            if matches!(self.store.module_decl(*module_decl_id), Some(ModuleDecl::Import(_)))
                    )
                })
                .count();
            program.body.insert(insert_at, import_stmt);
            program.kind = ProgramKind::Module;
            self.changed = true;
        }

        self.react.has_jsx |= self.react.needs_jsx;
        self.react.has_jsxs |= self.react.needs_jsxs;
        self.react.has_fragment |= self.react.needs_fragment;
    }

    fn dotted_path_expr(&mut self, span: swc_common::Span, path: &Atom) -> ExprId {
        let raw = path.as_ref();
        let mut parts = raw.split('.');
        let Some(first) = parts.next() else {
            return self.alloc_ident_expr(Ident::new(span, path.clone()));
        };
        if !is_valid_ident_name(first) {
            return self.alloc_ident_expr(Ident::new(span, path.clone()));
        }

        let mut expr = self.alloc_ident_expr(Ident::new(span, Atom::new(first)));
        for part in parts {
            if !is_valid_ident_name(part) {
                return self.alloc_ident_expr(Ident::new(span, path.clone()));
            }
            expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                span,
                obj: expr,
                prop: MemberProp::Ident(Ident::new(span, Atom::new(part))),
            }));
        }
        expr
    }

    fn jsx_name_type_expr(&mut self, span: swc_common::Span, name: &JSXElementName) -> ExprId {
        match name {
            JSXElementName::Ident(ident) => {
                if is_jsx_intrinsic_name(ident.sym.as_ref()) {
                    self.alloc_string_expr(span, ident.sym.clone())
                } else {
                    self.alloc_ident_expr(ident.clone())
                }
            }
            JSXElementName::Qualified(qualified) => {
                let text = qualified.as_ref();
                if text.is_empty() {
                    return self.alloc_string_expr(span, Atom::new(""));
                }
                if text.contains('.') {
                    if let Some(expr) = self.member_chain_from_qualified_name(span, text) {
                        return expr;
                    }
                }
                if is_jsx_intrinsic_name(text) || text.contains(':') || text.contains('-') {
                    self.alloc_string_expr(span, qualified.clone())
                } else if is_valid_ident_name(text) {
                    self.alloc_ident_expr(Ident::new(span, qualified.clone()))
                } else {
                    self.alloc_string_expr(span, qualified.clone())
                }
            }
        }
    }

    fn member_chain_from_qualified_name(
        &mut self,
        span: swc_common::Span,
        qualified: &str,
    ) -> Option<ExprId> {
        let mut parts = qualified.split('.');
        let first = parts.next()?;
        if !is_valid_ident_name(first) {
            return None;
        }

        let mut expr = self.alloc_ident_expr(Ident::new(span, Atom::new(first)));
        for part in parts {
            if !is_valid_ident_name(part) {
                return None;
            }
            expr = self.store.alloc_expr(Expr::Member(MemberExpr {
                span,
                obj: expr,
                prop: MemberProp::Ident(Ident::new(span, Atom::new(part))),
            }));
        }
        Some(expr)
    }

    fn is_jsx_fragment_name(name: &JSXElementName) -> bool {
        matches!(name, JSXElementName::Qualified(qualified) if qualified.is_empty())
    }

    fn lower_jsx_element_to_expr_id(&mut self, id: JSXElementId) -> ExprId {
        let expr = self.lower_jsx_element_expr(id);
        self.store.alloc_expr(expr)
    }

    fn lower_jsx_children_exprs(&mut self, children: &[JSXElementChild]) -> Vec<ExprId> {
        let mut out = Vec::new();
        for child in children {
            match child {
                JSXElementChild::Element(element) => {
                    out.push(self.lower_jsx_element_to_expr_id(*element));
                }
                JSXElementChild::Expr(expr) => {
                    if matches!(self.store.expr(*expr), Some(Expr::Lit(Lit::Null(_)))) {
                        continue;
                    }
                    out.push(*expr);
                }
                JSXElementChild::Text(text) => {
                    let trimmed = text.trim();
                    if trimmed.is_empty() {
                        continue;
                    }
                    out.push(self.alloc_string_expr(DUMMY_SP, Atom::new(trimmed)));
                }
            }
        }
        out
    }

    fn jsx_attr_key(&self, attr: &JSXAttr) -> PropName {
        if is_valid_ident_name(attr.name.as_ref()) {
            PropName::Ident(Ident::new(attr.span, attr.name.clone()))
        } else {
            PropName::Str(StrLit {
                span: attr.span,
                value: attr.name.clone(),
            })
        }
    }

    fn object_assign_callee(&mut self, span: swc_common::Span) -> ExprId {
        let object_ident = self.alloc_ident_expr(Ident::new(span, Atom::new("Object")));
        self.store.alloc_expr(Expr::Member(MemberExpr {
            span,
            obj: object_ident,
            prop: MemberProp::Ident(Ident::new(span, Atom::new("assign"))),
        }))
    }

    fn build_jsx_props_expr(
        &mut self,
        span: swc_common::Span,
        attrs: &[JSXAttr],
        extra_props: Vec<KeyValueProp>,
        allow_none: bool,
    ) -> Option<ExprId> {
        let mut has_spread = false;
        let mut pending_props = Vec::<KeyValueProp>::new();
        let mut segments = Vec::<ExprId>::new();

        for attr in attrs {
            if attr.name.as_ref() == "..." {
                has_spread = true;
                if !pending_props.is_empty() {
                    let segment = self.store.alloc_expr(Expr::Object(ObjectExpr {
                        span,
                        props: std::mem::take(&mut pending_props),
                    }));
                    segments.push(segment);
                }
                if let Some(value) = attr.value {
                    segments.push(value);
                }
                continue;
            }

            let value = attr
                .value
                .unwrap_or_else(|| self.alloc_bool_expr(attr.span, true));
            pending_props.push(KeyValueProp {
                span: attr.span,
                key: self.jsx_attr_key(attr),
                value,
            });
        }

        pending_props.extend(extra_props);
        if !pending_props.is_empty() {
            let segment = self.store.alloc_expr(Expr::Object(ObjectExpr {
                span,
                props: pending_props,
            }));
            segments.push(segment);
        }

        if segments.is_empty() {
            return if allow_none {
                None
            } else {
                Some(self.alloc_empty_object_expr(span))
            };
        }

        if !has_spread {
            return segments.pop();
        }

        let mut args = Vec::with_capacity(segments.len() + 1);
        args.push(ExprOrSpread {
            spread: false,
            expr: self.alloc_empty_object_expr(span),
        });
        args.extend(segments.into_iter().map(|expr| ExprOrSpread {
            spread: false,
            expr,
        }));

        let callee = self.object_assign_callee(span);
        Some(
            self.store
                .alloc_expr(Expr::Call(CallExpr { span, callee, args })),
        )
    }

    fn lower_jsx_element_expr(&mut self, element_id: JSXElementId) -> Expr {
        let Some(element) = self.store.jsx_element(element_id).cloned() else {
            return Expr::JSXElement(element_id);
        };

        let span = element.span;
        let is_fragment = Self::is_jsx_fragment_name(&element.opening.name);
        let children = self.lower_jsx_children_exprs(&element.children);

        match self.options.react.runtime {
            ReactRuntime::Classic => {
                let tag = if is_fragment {
                    self.dotted_path_expr(span, &self.options.react.classic_fragment_pragma)
                } else {
                    self.jsx_name_type_expr(span, &element.opening.name)
                };

                let props = self
                    .build_jsx_props_expr(span, &element.opening.attrs, Vec::new(), true)
                    .unwrap_or_else(|| self.alloc_null_expr(span));

                let mut args = Vec::with_capacity(children.len() + 2);
                args.push(ExprOrSpread {
                    spread: false,
                    expr: tag,
                });
                args.push(ExprOrSpread {
                    spread: false,
                    expr: props,
                });
                args.extend(children.into_iter().map(|expr| ExprOrSpread {
                    spread: false,
                    expr,
                }));

                Expr::Call(CallExpr {
                    span,
                    callee: self.dotted_path_expr(span, &self.options.react.classic_pragma),
                    args,
                })
            }
            ReactRuntime::Automatic => {
                let children_count = children.len();
                let tag = if is_fragment {
                    self.react.needs_fragment = true;
                    self.alloc_ident_expr(Ident::new(span, self.react.local_fragment.clone()))
                } else {
                    self.jsx_name_type_expr(span, &element.opening.name)
                };

                let mut extra_props = Vec::new();
                if children.len() == 1 {
                    extra_props.push(KeyValueProp {
                        span,
                        key: PropName::Ident(Ident::new(span, Atom::new("children"))),
                        value: children[0],
                    });
                } else if !children.is_empty() {
                    let array = self.store.alloc_expr(Expr::Array(ArrayExpr {
                        span,
                        elems: children
                            .into_iter()
                            .map(|expr| {
                                Some(ExprOrSpread {
                                    spread: false,
                                    expr,
                                })
                            })
                            .collect(),
                    }));
                    extra_props.push(KeyValueProp {
                        span,
                        key: PropName::Ident(Ident::new(span, Atom::new("children"))),
                        value: array,
                    });
                }

                let props = self
                    .build_jsx_props_expr(span, &element.opening.attrs, extra_props, false)
                    .unwrap_or_else(|| self.alloc_empty_object_expr(span));

                let (callee_local, needs_jsxs) = if children_count > 1 {
                    (self.react.local_jsxs.clone(), true)
                } else {
                    (self.react.local_jsx.clone(), false)
                };
                if needs_jsxs {
                    self.react.needs_jsxs = true;
                } else {
                    self.react.needs_jsx = true;
                }

                Expr::Call(CallExpr {
                    span,
                    callee: self.alloc_ident_expr(Ident::new(span, callee_local)),
                    args: vec![
                        ExprOrSpread {
                            spread: false,
                            expr: tag,
                        },
                        ExprOrSpread {
                            spread: false,
                            expr: props,
                        },
                    ],
                })
            }
        }
    }

    fn apply_normalize(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Paren(paren) => {
                if let Some(Expr::Paren(inner)) = self.store.expr(paren.expr).cloned() {
                    return Expr::Paren(ParenExpr {
                        span: paren.span,
                        expr: inner.expr,
                    });
                }
                Expr::Paren(paren)
            }
            Expr::Seq(seq) if seq.exprs.len() == 1 => {
                if let Some(inner) = self.store.expr(seq.exprs[0]).cloned() {
                    return inner;
                }
                Expr::Seq(seq)
            }
            other => other,
        }
    }

    fn apply_lowering(&mut self, current_expr: ExprId, expr: Expr) -> Expr {
        let expr = if self.options.enable_optional_chaining
            && self.options.target.lower_optional_chaining()
        {
            self.lower_optional_chaining(current_expr, expr)
        } else {
            expr
        };

        let expr = if self.options.enable_nullish_coalescing
            && self.options.target.lower_nullish_coalescing()
        {
            self.lower_nullish(current_expr, expr)
        } else {
            expr
        };

        if self.options.enable_logical_assignment && self.options.target.lower_logical_assignment()
        {
            self.lower_logical_assignment(current_expr, expr)
        } else {
            expr
        }
    }

    fn lower_optional_chaining(&mut self, _current_expr: ExprId, expr: Expr) -> Expr {
        let Expr::OptChain(chain) = expr else {
            return expr;
        };

        if !self.facts.expr_is_pure(chain.base) {
            return Expr::OptChain(chain);
        }

        let span = chain.span;
        let null_id = self
            .store
            .alloc_expr(Expr::Lit(Lit::Null(NullLit { span })));
        let test = self.store.alloc_expr(Expr::Binary(BinaryExpr {
            span,
            op: BinaryOp::EqEq,
            left: chain.base,
            right: null_id,
        }));
        let undefined_id = self.store.alloc_expr(Expr::Ident(Ident {
            span,
            sym: Atom::new("undefined"),
        }));

        Expr::Cond(CondExpr {
            span,
            test,
            cons: undefined_id,
            alt: chain.base,
        })
    }

    fn lower_nullish(&mut self, _current_expr: ExprId, expr: Expr) -> Expr {
        let Expr::Binary(binary) = expr else {
            return expr;
        };

        if !matches!(binary.op, BinaryOp::NullishCoalescing) {
            return Expr::Binary(binary);
        }

        if !self.facts.expr_is_pure(binary.left) {
            return Expr::Binary(binary);
        }

        let span = binary.span;
        let null_id = self
            .store
            .alloc_expr(Expr::Lit(Lit::Null(NullLit { span })));
        let test = self.store.alloc_expr(Expr::Binary(BinaryExpr {
            span,
            op: BinaryOp::EqEq,
            left: binary.left,
            right: null_id,
        }));

        Expr::Cond(CondExpr {
            span,
            test,
            cons: binary.right,
            alt: binary.left,
        })
    }

    fn lower_logical_assignment(&mut self, _current_expr: ExprId, expr: Expr) -> Expr {
        let Expr::Assign(mut assign) = expr else {
            return expr;
        };

        let lhs_expr = match self.store.pat(assign.left).cloned() {
            Some(Pat::Expr(expr)) if self.facts.expr_is_pure(expr) => expr,
            Some(Pat::Ident(ident)) => self.store.alloc_expr(Expr::Ident(ident)),
            _ => return Expr::Assign(assign),
        };

        let span = assign.span;
        let new_right = match assign.op {
            AssignOp::AndAssign => self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span,
                op: BinaryOp::LogicalAnd,
                left: lhs_expr,
                right: assign.right,
            })),
            AssignOp::OrAssign => self.store.alloc_expr(Expr::Binary(BinaryExpr {
                span,
                op: BinaryOp::LogicalOr,
                left: lhs_expr,
                right: assign.right,
            })),
            AssignOp::NullishAssign => {
                if self.options.target.lower_nullish_coalescing() {
                    let null_id = self
                        .store
                        .alloc_expr(Expr::Lit(Lit::Null(NullLit { span })));
                    let test = self.store.alloc_expr(Expr::Binary(BinaryExpr {
                        span,
                        op: BinaryOp::EqEq,
                        left: lhs_expr,
                        right: null_id,
                    }));
                    self.store.alloc_expr(Expr::Cond(CondExpr {
                        span,
                        test,
                        cons: assign.right,
                        alt: lhs_expr,
                    }))
                } else {
                    self.store.alloc_expr(Expr::Binary(BinaryExpr {
                        span,
                        op: BinaryOp::NullishCoalescing,
                        left: lhs_expr,
                        right: assign.right,
                    }))
                }
            }
            _ => return Expr::Assign(assign),
        };

        assign.op = AssignOp::Assign;
        assign.right = new_right;
        Expr::Assign(assign)
    }

    fn apply_cleanup(&mut self, current_expr: ExprId, expr: Expr) -> Expr {
        if let ConstValue::Unknown = self.facts.expr_constant(current_expr) {
            return expr;
        }

        let span = expr_span(&expr);
        match self.facts.expr_constant(current_expr) {
            ConstValue::Unknown => expr,
            ConstValue::Undefined => Expr::Ident(Ident {
                span,
                sym: Atom::new("undefined"),
            }),
            ConstValue::Null => Expr::Lit(Lit::Null(NullLit { span })),
            ConstValue::Bool(value) => Expr::Lit(Lit::Bool(BoolLit { span, value })),
            ConstValue::Number(value) => Expr::Lit(Lit::Num(NumberLit { span, value })),
            ConstValue::Str(value) => Expr::Lit(Lit::Str(StrLit { span, value })),
        }
    }
}

fn is_valid_ident_name(name: &str) -> bool {
    let mut chars = name.chars();
    let Some(first) = chars.next() else {
        return false;
    };
    if !(first == '_' || first == '$' || first.is_ascii_alphabetic()) {
        return false;
    }
    chars.all(|ch| ch == '_' || ch == '$' || ch.is_ascii_alphanumeric())
}

fn is_jsx_intrinsic_name(name: &str) -> bool {
    let Some(first) = name.chars().next() else {
        return false;
    };
    first.is_ascii_lowercase() || name.contains('-')
}

fn expr_span(expr: &Expr) -> swc_common::Span {
    match expr {
        Expr::Ident(value) => value.span,
        Expr::Lit(value) => match value {
            Lit::Str(value) => value.span,
            Lit::Bool(value) => value.span,
            Lit::Null(value) => value.span,
            Lit::Num(value) => value.span,
            Lit::BigInt(value) => value.span,
            Lit::Regex(value) => value.span,
        },
        Expr::Function(_) => DUMMY_SP,
        Expr::Class(_) => DUMMY_SP,
        Expr::JSXElement(_) => DUMMY_SP,
        Expr::TsAs(value) => value.span,
        Expr::TsNonNull(value) => value.span,
        Expr::TsSatisfies(value) => value.span,
        Expr::Array(value) => value.span,
        Expr::Object(value) => value.span,
        Expr::Unary(value) => value.span,
        Expr::Binary(value) => value.span,
        Expr::Assign(value) => value.span,
        Expr::Call(value) => value.span,
        Expr::Member(value) => value.span,
        Expr::Cond(value) => value.span,
        Expr::Seq(value) => value.span,
        Expr::New(value) => value.span,
        Expr::Update(value) => value.span,
        Expr::Await(value) => value.span,
        Expr::Arrow(value) => value.span,
        Expr::Template(value) => value.span,
        Expr::Yield(value) => value.span,
        Expr::TaggedTemplate(value) => value.span,
        Expr::MetaProp(value) => value.span,
        Expr::OptChain(value) => value.span,
        Expr::Paren(value) => value.span,
    }
}
