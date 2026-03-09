use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_es_ast::*;
use swc_es_semantics::{ScopeId, ScopeKind, SymbolId, SymbolKind};

use crate::{analysis::AnalysisFacts, ConstValue, MinifyOptions};

pub(crate) struct RewriteResult {
    pub program: ProgramId,
    pub changed: bool,
    pub nodes: u32,
}

pub(crate) fn rewrite_once(
    store: &mut AstStore,
    program: ProgramId,
    options: &MinifyOptions,
    facts: &AnalysisFacts,
) -> RewriteResult {
    let mangle = build_mangle_plan(store, program, options, facts);

    let mut rewriter = Rewriter {
        store,
        options,
        facts,
        mangle,
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

#[derive(Debug, Default)]
struct ManglePlan {
    by_name: FxHashMap<Atom, Atom>,
    by_symbol: FxHashMap<u32, Atom>,
}

struct Rewriter<'a> {
    store: &'a mut AstStore,
    options: &'a MinifyOptions,
    facts: &'a AnalysisFacts,
    mangle: ManglePlan,
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

        let mut next = program.clone();
        for stmt in &mut next.body {
            *stmt = self.rewrite_stmt(*stmt);
        }

        if self.options.compress.dead_code {
            truncate_unreachable_tail(self.store, &mut next.body);
        }
        if self.options.compress.drop_unused_bindings
            || self.options.compress.simplify_branches
            || self.options.compress.dead_code
        {
            remove_empty_stmts(self.store, &mut next.body);
        }

        if next != program {
            if let Some(slot) = self.store.program_mut(id) {
                *slot = next;
                self.changed = true;
            }
        }

        id
    }

    fn rewrite_stmt(&mut self, id: StmtId) -> StmtId {
        self.bump_node();
        let Some(stmt) = self.store.stmt(id).cloned() else {
            return id;
        };

        let mut next = stmt.clone();

        match &mut next {
            Stmt::Empty(_) | Stmt::Debugger(_) => {}
            Stmt::Break(break_stmt) => {
                if let Some(label) = &mut break_stmt.label {
                    self.rename_ident(label, None);
                }
            }
            Stmt::Continue(continue_stmt) => {
                if let Some(label) = &mut continue_stmt.label {
                    self.rename_ident(label, None);
                }
            }
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
                if_stmt.cons = self.rewrite_stmt(if_stmt.cons);
                if let Some(alt) = if_stmt.alt {
                    if_stmt.alt = Some(self.rewrite_stmt(alt));
                }

                if self.options.compress.simplify_branches || self.options.compress.dead_code {
                    if let Some(taken) = self.facts.expr_constant(if_stmt.test).truthy() {
                        next =
                            if taken {
                                self.store.stmt(if_stmt.cons).cloned().unwrap_or_else(|| {
                                    Stmt::Empty(EmptyStmt { span: if_stmt.span })
                                })
                            } else if let Some(alt) = if_stmt.alt {
                                self.store.stmt(alt).cloned().unwrap_or_else(|| {
                                    Stmt::Empty(EmptyStmt { span: if_stmt.span })
                                })
                            } else {
                                Stmt::Empty(EmptyStmt { span: if_stmt.span })
                            };
                    }
                }
            }
            Stmt::While(while_stmt) => {
                while_stmt.test = self.rewrite_expr(while_stmt.test);
                while_stmt.body = self.rewrite_stmt(while_stmt.body);
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
                for_stmt.body = self.rewrite_stmt(for_stmt.body);
            }
            Stmt::DoWhile(do_while) => {
                do_while.body = self.rewrite_stmt(do_while.body);
                do_while.test = self.rewrite_expr(do_while.test);
            }
            Stmt::Switch(switch_stmt) => {
                switch_stmt.discriminant = self.rewrite_expr(switch_stmt.discriminant);
                for case in &mut switch_stmt.cases {
                    if let Some(test) = case.test {
                        case.test = Some(self.rewrite_expr(test));
                    }
                    for cons in &mut case.cons {
                        *cons = self.rewrite_stmt(*cons);
                    }
                }
            }
            Stmt::Try(try_stmt) => {
                try_stmt.block = self.rewrite_stmt(try_stmt.block);
                if let Some(handler) = &mut try_stmt.handler {
                    if let Some(param) = handler.param {
                        handler.param = Some(self.rewrite_pat(param));
                    }
                    handler.body = self.rewrite_stmt(handler.body);
                }
                if let Some(finalizer) = try_stmt.finalizer {
                    try_stmt.finalizer = Some(self.rewrite_stmt(finalizer));
                }
            }
            Stmt::Throw(throw_stmt) => {
                throw_stmt.arg = self.rewrite_expr(throw_stmt.arg);
            }
            Stmt::With(with_stmt) => {
                with_stmt.obj = self.rewrite_expr(with_stmt.obj);
                with_stmt.body = self.rewrite_stmt(with_stmt.body);
            }
            Stmt::Labeled(labeled) => {
                self.rename_ident(&mut labeled.label, None);
                labeled.body = self.rewrite_stmt(labeled.body);
            }
            Stmt::Block(block) => {
                for stmt in &mut block.stmts {
                    *stmt = self.rewrite_stmt(*stmt);
                }

                if self.options.compress.dead_code {
                    truncate_unreachable_tail(self.store, &mut block.stmts);
                }
                if self.options.compress.drop_unused_bindings
                    || self.options.compress.simplify_branches
                    || self.options.compress.dead_code
                {
                    remove_empty_stmts(self.store, &mut block.stmts);
                }
            }
            Stmt::Decl(decl) => {
                *decl = self.rewrite_decl(*decl);
                if self.options.compress.drop_unused_bindings {
                    if let Some(Decl::Var(var)) = self.store.decl(*decl) {
                        if var.declarators.is_empty() {
                            next = Stmt::Empty(EmptyStmt { span: var.span });
                        }
                    }
                }
            }
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

                if self.options.compress.drop_unused_bindings {
                    self.drop_unused_declarators(id, var);
                }
            }
            Decl::Fn(function) => {
                self.rename_ident(&mut function.ident, None);
                for param in &mut function.params {
                    *param = self.rewrite_pat(*param);
                }
                for stmt in &mut function.body {
                    *stmt = self.rewrite_stmt(*stmt);
                }
            }
            Decl::Class(class_decl) => {
                self.rename_ident(&mut class_decl.ident, None);
                class_decl.class = self.rewrite_class(class_decl.class);
            }
            Decl::TsTypeAlias(type_alias) => {
                self.rename_ident(&mut type_alias.ident, None);
                type_alias.ty = self.rewrite_ts_type(type_alias.ty);
            }
            Decl::TsInterface(interface_decl) => {
                self.rename_ident(&mut interface_decl.ident, None);
                for member in &mut interface_decl.body {
                    self.rewrite_ts_type_member(member);
                }
            }
            Decl::TsEnum(ts_enum) => {
                self.rename_ident(&mut ts_enum.ident, None);
                for member in &mut ts_enum.members {
                    match &mut member.name {
                        TsEnumMemberName::Ident(ident) => self.rename_ident(ident, None),
                        TsEnumMemberName::Str(_) | TsEnumMemberName::Num(_) => {}
                    }
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
            Pat::Ident(ident) => self.rename_ident(ident, None),
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
                            self.rename_ident(&mut assign.key, None);
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
            Expr::Ident(ident) => self.rename_ident(ident, Some(id)),
            Expr::Lit(_) | Expr::MetaProp(_) => {}
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
                        for stmt in stmts {
                            *stmt = self.rewrite_stmt(*stmt);
                        }
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

        if self.options.compress.fold_constants {
            next = self.fold_constant(id, next);
        }

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
            ModuleDecl::Import(import_decl) => {
                if import_decl.type_only {
                    // Type-only import has no runtime bindings.
                    import_decl.specifiers.clear();
                } else {
                    for specifier in &mut import_decl.specifiers {
                        match specifier {
                            ImportSpecifier::Default(default) => {
                                self.rename_ident(&mut default.local, None)
                            }
                            ImportSpecifier::Namespace(namespace) => {
                                self.rename_ident(&mut namespace.local, None)
                            }
                            ImportSpecifier::Named(named) => {
                                if named.is_type_only {
                                    continue;
                                }
                                self.rename_ident(&mut named.local, None);
                                if let Some(imported) = &mut named.imported {
                                    self.rename_ident(imported, None);
                                }
                            }
                        }
                    }
                }
            }
            ModuleDecl::ExportNamed(named) => {
                for specifier in &mut named.specifiers {
                    if named.type_only || specifier.is_type_only {
                        continue;
                    }
                    self.rename_ident(&mut specifier.local, None);
                    if let Some(exported) = &mut specifier.exported {
                        self.rename_ident(exported, None);
                    }
                }
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
            ModuleDecl::ExportAll(export_all) => {
                if let Some(exported) = &mut export_all.exported {
                    self.rename_ident(exported, None);
                }
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
        for stmt in &mut next.body {
            *stmt = self.rewrite_stmt(*stmt);
        }

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
        if let Some(ident) = &mut next.ident {
            self.rename_ident(ident, None);
        }
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
                for stmt in &mut block.body {
                    *stmt = self.rewrite_stmt(*stmt);
                }
                if self.options.compress.dead_code {
                    truncate_unreachable_tail(self.store, &mut block.body);
                }
                if self.options.compress.drop_unused_bindings
                    || self.options.compress.simplify_branches
                    || self.options.compress.dead_code
                {
                    remove_empty_stmts(self.store, &mut block.body);
                }
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

        if let JSXElementName::Ident(ident) = &mut next.opening.name {
            self.rename_ident(ident, None);
        }

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

        if let Some(JSXElementName::Ident(ident)) = &mut next.closing {
            self.rename_ident(ident, None);
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
            TsType::Keyword(_) | TsType::Lit(_) => {}
            TsType::Infer(infer) => {
                self.rename_ident(&mut infer.type_param, None);
            }
            TsType::TypeQuery(query) => {
                self.rename_ident(&mut query.expr_name, None);
                for arg in &mut query.type_args {
                    *arg = self.rewrite_ts_type(*arg);
                }
            }
            TsType::TypeRef(type_ref) => {
                self.rename_ident(&mut type_ref.name, None);
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
                if let Some(qualifier) = &mut import.qualifier {
                    self.rename_ident(qualifier, None);
                }
                for arg in &mut import.type_args {
                    *arg = self.rewrite_ts_type(*arg);
                }
            }
            TsType::Mapped(mapped) => {
                self.rename_ident(&mut mapped.type_param, None);
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
        if let Some(name) = &mut param.name {
            self.rename_ident(name, None);
        }
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
        if let TsModuleName::Ident(ident) = &mut module.id {
            self.rename_ident(ident, None);
        }
        if let Some(body) = &mut module.body {
            self.rewrite_ts_namespace_body(body);
        }
    }

    fn rewrite_ts_namespace_body(&mut self, body: &mut TsNamespaceBody) {
        match body {
            TsNamespaceBody::ModuleBlock(stmts) => {
                for stmt in stmts.iter_mut() {
                    *stmt = self.rewrite_stmt(*stmt);
                }
                if self.options.compress.dead_code {
                    truncate_unreachable_tail(self.store, stmts);
                }
                if self.options.compress.drop_unused_bindings
                    || self.options.compress.simplify_branches
                    || self.options.compress.dead_code
                {
                    remove_empty_stmts(self.store, stmts);
                }
            }
            TsNamespaceBody::Namespace(namespace) => {
                self.rename_ident(&mut namespace.id, None);
                self.rewrite_ts_namespace_body(&mut namespace.body);
            }
        }
    }

    fn rewrite_prop_name(&mut self, key: &mut PropName) {
        match key {
            PropName::Computed(expr) => *expr = self.rewrite_expr(*expr),
            PropName::Ident(_) | PropName::Private(_) | PropName::Str(_) | PropName::Num(_) => {}
        }
    }

    fn fold_constant(&mut self, expr_id: ExprId, expr: Expr) -> Expr {
        let value = self.facts.expr_constant(expr_id);
        match value {
            ConstValue::Unknown => expr,
            ConstValue::Undefined => Expr::Ident(Ident {
                span: expr_span(&expr),
                sym: Atom::new("undefined"),
            }),
            ConstValue::Null => Expr::Lit(Lit::Null(NullLit {
                span: expr_span(&expr),
            })),
            ConstValue::Bool(value) => Expr::Lit(Lit::Bool(BoolLit {
                span: expr_span(&expr),
                value,
            })),
            ConstValue::Number(value) => Expr::Lit(Lit::Num(NumberLit {
                span: expr_span(&expr),
                value,
            })),
            ConstValue::Str(value) => Expr::Lit(Lit::Str(StrLit {
                span: expr_span(&expr),
                value,
            })),
        }
    }

    fn drop_unused_declarators(&mut self, decl_id: DeclId, var: &mut VarDecl) {
        if self.facts.has_dynamic_scope {
            return;
        }

        let Some(decl_scope) = self.facts.semantics.scope_of_decl(decl_id) else {
            return;
        };
        let symbol_scope = if matches!(var.kind, VarDeclKind::Var) {
            self.facts
                .semantics
                .scope(decl_scope)
                .map(|scope| scope.enclosing_function)
                .unwrap_or(decl_scope)
        } else {
            decl_scope
        };

        var.declarators.retain(|declarator| {
            let Some((name, init_expr)) = self.binding_descriptor(declarator) else {
                return true;
            };

            let Some(symbol) = self.find_symbol(symbol_scope, &name) else {
                return true;
            };
            let usage = self.facts.symbol_usage(symbol).unwrap_or_default();

            // Keep declarations that are referenced after declaration.
            if usage.read || usage.write || usage.call {
                return true;
            }

            if init_expr.is_some_and(|init| !self.facts.expr_is_pure(init)) {
                return true;
            }

            self.changed = true;
            false
        });
    }

    fn binding_descriptor(&self, declarator: &VarDeclarator) -> Option<(Atom, Option<ExprId>)> {
        let pat = self.store.pat(declarator.name)?;
        match pat {
            Pat::Ident(ident) => Some((ident.sym.clone(), declarator.init)),
            Pat::Expr(expr_id) => match self.store.expr(*expr_id) {
                Some(Expr::Ident(ident)) => Some((ident.sym.clone(), declarator.init)),
                _ => None,
            },
            Pat::Assign(assign) => {
                let left = self.store.pat(assign.left)?;
                let name = match left {
                    Pat::Ident(ident) => Some(ident.sym.clone()),
                    Pat::Expr(expr_id) => match self.store.expr(*expr_id) {
                        Some(Expr::Ident(ident)) => Some(ident.sym.clone()),
                        _ => None,
                    },
                    Pat::Array(_) | Pat::Object(_) | Pat::Rest(_) | Pat::Assign(_) => None,
                }?;

                // In this AST shape, `let a = 1` can be represented as
                // `name: Pat::Assign(a, 1), init: None`.
                Some((name, declarator.init.or(Some(assign.right))))
            }
            Pat::Array(_) | Pat::Object(_) | Pat::Rest(_) => None,
        }
    }

    fn find_symbol(&self, scope_id: ScopeId, name: &Atom) -> Option<SymbolId> {
        let scope = self.facts.semantics.scope(scope_id)?;
        for symbol_id in &scope.symbols {
            let Some(symbol) = self.facts.semantics.symbol(*symbol_id) else {
                continue;
            };
            if symbol.name == *name {
                return Some(*symbol_id);
            }
        }
        None
    }

    fn rename_ident(&mut self, ident: &mut Ident, expr_id: Option<ExprId>) {
        if self.mangle.by_name.is_empty() {
            return;
        }

        if let Some(expr_id) = expr_id {
            if let Some(symbol) = self.facts.semantics.symbol_of_expr_ident(expr_id) {
                if let Some(next) = self.mangle.by_symbol.get(&symbol.as_u32()) {
                    if ident.sym != *next {
                        ident.sym = next.clone();
                        self.changed = true;
                        return;
                    }
                }
            }
        }

        if let Some(next) = self.mangle.by_name.get(&ident.sym) {
            if ident.sym != *next {
                ident.sym = next.clone();
                self.changed = true;
            }
        }
    }
}

fn truncate_unreachable_tail(store: &AstStore, stmts: &mut Vec<StmtId>) {
    let mut trunc = None;
    for (index, stmt_id) in stmts.iter().enumerate() {
        let Some(stmt) = store.stmt(*stmt_id) else {
            continue;
        };
        if is_terminator(stmt) {
            trunc = Some(index + 1);
            break;
        }
    }

    if let Some(new_len) = trunc {
        stmts.truncate(new_len);
    }
}

fn remove_empty_stmts(store: &AstStore, stmts: &mut Vec<StmtId>) {
    stmts.retain(|stmt_id| !matches!(store.stmt(*stmt_id), Some(Stmt::Empty(_))));
}

fn is_terminator(stmt: &Stmt) -> bool {
    matches!(
        stmt,
        Stmt::Return(_) | Stmt::Throw(_) | Stmt::Break(_) | Stmt::Continue(_)
    )
}

fn build_mangle_plan(
    store: &AstStore,
    program: ProgramId,
    options: &MinifyOptions,
    facts: &AnalysisFacts,
) -> ManglePlan {
    if !options.mangle.enabled {
        return ManglePlan::default();
    }

    let mut exported_names = FxHashSet::default();
    if let Some(program_node) = store.program(program) {
        for stmt in &program_node.body {
            let Some(Stmt::ModuleDecl(module_decl)) = store.stmt(*stmt) else {
                continue;
            };
            if let Some(module_decl) = store.module_decl(*module_decl) {
                collect_exported_names(store, module_decl, &mut exported_names);
            }
        }
    }

    let mut name_counts: FxHashMap<Atom, usize> = FxHashMap::default();
    let mut taken = FxHashSet::default();

    for symbol in facts.semantics.symbols() {
        *name_counts.entry(symbol.name.clone()).or_insert(0) += 1;
        taken.insert(symbol.name.clone());
    }
    for reserved in &options.mangle.reserved {
        taken.insert(reserved.clone());
    }

    let mut plan = ManglePlan::default();
    let mut next_index = 0usize;

    for (index, symbol) in facts.semantics.symbols().iter().enumerate() {
        if name_counts.get(&symbol.name).copied().unwrap_or(0) != 1 {
            continue;
        }
        if symbol.kind == SymbolKind::Import {
            continue;
        }
        if exported_names.contains(&symbol.name) {
            continue;
        }
        if options
            .mangle
            .reserved
            .iter()
            .any(|name| name == &symbol.name)
        {
            continue;
        }
        if options.mangle.keep_fn_names && symbol.kind == SymbolKind::Function {
            continue;
        }
        if options.mangle.keep_class_names && symbol.kind == SymbolKind::Class {
            continue;
        }

        if !options.mangle.top_level {
            if let Some(scope) = facts.semantics.scope(symbol.scope) {
                if scope.kind == ScopeKind::Program {
                    continue;
                }
            }
        }

        let references = facts
            .semantics
            .symbol_references()
            .get(index)
            .map(Vec::as_slice)
            .unwrap_or(&[]);
        if references.iter().any(|reference_id| {
            facts
                .semantics
                .reference(*reference_id)
                .map(|reference| reference.maybe_dynamic)
                .unwrap_or(false)
        }) {
            continue;
        }

        let Some(usage) = facts.symbol_usage.get(index).copied() else {
            continue;
        };

        if !(usage.read || usage.write || usage.call) {
            continue;
        }

        let fresh = loop {
            let candidate = Atom::new(base54(next_index));
            next_index = next_index.saturating_add(1);
            if !taken.contains(&candidate) {
                break candidate;
            }
        };

        taken.insert(fresh.clone());
        plan.by_name.insert(symbol.name.clone(), fresh.clone());
        plan.by_symbol.insert(index as u32, fresh);
    }

    plan
}

fn collect_exported_names(store: &AstStore, module_decl: &ModuleDecl, out: &mut FxHashSet<Atom>) {
    match module_decl {
        ModuleDecl::ExportNamed(named) => {
            for specifier in &named.specifiers {
                out.insert(specifier.local.sym.clone());
                if let Some(exported) = &specifier.exported {
                    out.insert(exported.sym.clone());
                }
            }
            if let Some(decl_id) = named.decl {
                collect_decl_names(store, decl_id, out);
            }
        }
        ModuleDecl::ExportDefaultExpr(_) => {}
        ModuleDecl::ExportDefaultDecl(default_decl) => {
            collect_decl_names(store, default_decl.decl, out);
        }
        ModuleDecl::ExportAll(export_all) => {
            if let Some(exported) = &export_all.exported {
                out.insert(exported.sym.clone());
            }
        }
        ModuleDecl::ExportDecl(export_decl) => {
            collect_decl_names(store, export_decl.decl, out);
        }
        ModuleDecl::Import(_) => {}
    }
}

fn collect_decl_names(store: &AstStore, decl_id: DeclId, out: &mut FxHashSet<Atom>) {
    let Some(decl) = store.decl(decl_id) else {
        return;
    };

    match decl {
        Decl::Var(var) => {
            for declarator in &var.declarators {
                collect_pat_names(store, declarator.name, out);
            }
        }
        Decl::Fn(function) => {
            out.insert(function.ident.sym.clone());
        }
        Decl::Class(class_decl) => {
            out.insert(class_decl.ident.sym.clone());
        }
        Decl::TsTypeAlias(type_alias) => {
            out.insert(type_alias.ident.sym.clone());
        }
        Decl::TsInterface(interface_decl) => {
            out.insert(interface_decl.ident.sym.clone());
        }
        Decl::TsEnum(ts_enum) => {
            out.insert(ts_enum.ident.sym.clone());
        }
        Decl::TsModule(module) => {
            if let TsModuleName::Ident(ident) = &module.id {
                out.insert(ident.sym.clone());
            }
        }
    }
}

fn collect_pat_names(store: &AstStore, pat_id: PatId, out: &mut FxHashSet<Atom>) {
    let Some(pat) = store.pat(pat_id) else {
        return;
    };

    match pat {
        Pat::Ident(ident) => {
            out.insert(ident.sym.clone());
        }
        Pat::Expr(_) => {}
        Pat::Array(array) => {
            for pat in array.elems.iter().flatten() {
                collect_pat_names(store, *pat, out);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    ObjectPatProp::KeyValue(key_value) => {
                        collect_pat_names(store, key_value.value, out)
                    }
                    ObjectPatProp::Assign(assign) => {
                        out.insert(assign.key.sym.clone());
                    }
                    ObjectPatProp::Rest(rest) => collect_pat_names(store, rest.arg, out),
                }
            }
        }
        Pat::Rest(rest) => collect_pat_names(store, rest.arg, out),
        Pat::Assign(assign) => collect_pat_names(store, assign.left, out),
    }
}

fn base54(mut index: usize) -> String {
    const FIRST: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
    const REST: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

    let mut out = String::new();
    out.push(FIRST[index % FIRST.len()] as char);
    index /= FIRST.len();

    while index > 0 {
        out.push(REST[index % REST.len()] as char);
        index /= REST.len();
    }

    out
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
        Expr::Function(_) | Expr::Class(_) | Expr::JSXElement(_) => DUMMY_SP,
    }
}
