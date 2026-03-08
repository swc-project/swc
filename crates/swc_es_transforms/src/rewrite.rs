use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_es_ast::*;

use crate::{analysis::AnalysisFacts, ConstValue, TransformOptions};

pub(crate) struct RewriteResult {
    pub program: ProgramId,
    pub changed: bool,
    pub nodes: u32,
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
                if_stmt.cons = self.rewrite_stmt(if_stmt.cons);
                if let Some(alt) = if_stmt.alt {
                    if_stmt.alt = Some(self.rewrite_stmt(alt));
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
                labeled.body = self.rewrite_stmt(labeled.body);
            }
            Stmt::Block(block) => {
                for stmt in &mut block.stmts {
                    *stmt = self.rewrite_stmt(*stmt);
                }
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
                for stmt in &mut function.body {
                    *stmt = self.rewrite_stmt(*stmt);
                }
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
                for stmt in stmts {
                    *stmt = self.rewrite_stmt(*stmt);
                }
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
