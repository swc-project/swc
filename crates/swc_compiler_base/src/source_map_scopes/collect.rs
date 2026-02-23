use swc_common::{sync::Lrc, BytePos, SourceMap, Span};
use swc_ecma_ast::{
    ArrowExpr, BindingIdent, CatchClause, ClassDecl, ClassExpr, ClassMethod, Constructor, FnDecl,
    FnExpr, Function, GetterProp, ImportDecl, ImportSpecifier, MethodProp, Module, ObjectPatProp,
    ParamOrTsParamProp, Pat, PrivateMethod, Program, PropName, Script, SetterProp, StaticBlock,
    TsParamPropParam, VarDecl, VarDeclKind,
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::source_map_scopes::{encode::ScopePosition, SourceResolver};

#[derive(Debug, Clone)]
pub(crate) struct CollectedVariable {
    pub name: String,
    pub start: ScopePosition,
    pub end: ScopePosition,
}

#[derive(Debug, Clone)]
pub(crate) struct CollectedScope {
    pub source_idx: Option<u32>,
    pub start: ScopePosition,
    pub end: ScopePosition,
    pub name: Option<String>,
    pub kind: Option<String>,
    pub is_stack_frame: bool,
    pub is_function_boundary: bool,
    pub parent: Option<usize>,
    pub children: Vec<usize>,
    pub variables: Vec<CollectedVariable>,
}

#[derive(Debug, Clone)]
pub(crate) struct CollectedScopes {
    pub scopes: Vec<CollectedScope>,
    pub roots_by_source: Vec<Option<usize>>,
}

#[derive(Debug, Clone, Copy)]
enum VariableTarget {
    Current,
    Var,
}

pub(crate) fn collect_scopes<T>(
    cm: Lrc<SourceMap>,
    node: &T,
    resolver: SourceResolver,
    sources_len: usize,
) -> CollectedScopes
where
    T: VisitWith<ScopeCollector>,
{
    let mut collector = ScopeCollector::new(cm, resolver, sources_len);
    node.visit_with(&mut collector);
    collector.finish()
}

pub(crate) struct ScopeCollector {
    cm: Lrc<SourceMap>,
    resolver: SourceResolver,

    scopes: Vec<CollectedScope>,
    scope_stack: Vec<usize>,
    roots_by_source: Vec<Option<usize>>,
}

impl ScopeCollector {
    fn new(cm: Lrc<SourceMap>, resolver: SourceResolver, sources_len: usize) -> Self {
        Self {
            cm,
            resolver,
            scopes: Vec::new(),
            scope_stack: Vec::new(),
            roots_by_source: vec![None; sources_len],
        }
    }

    fn finish(mut self) -> CollectedScopes {
        for scope_idx in 0..self.scopes.len() {
            let Some(source_idx) = self.scopes[scope_idx].source_idx else {
                continue;
            };

            let mut top = scope_idx;
            while let Some(parent) = self.scopes[top].parent {
                if self.scopes[parent].source_idx == Some(source_idx) {
                    top = parent;
                } else {
                    break;
                }
            }

            let root_slot = &mut self.roots_by_source[source_idx as usize];
            if root_slot.is_none() {
                *root_slot = Some(top);
            }
        }

        CollectedScopes {
            scopes: self.scopes,
            roots_by_source: self.roots_by_source,
        }
    }

    fn push_scope(
        &mut self,
        span: Span,
        kind: Option<&'static str>,
        name: Option<String>,
        is_stack_frame: bool,
        is_function_boundary: bool,
    ) {
        let parent = self.scope_stack.last().copied();
        let source_idx = self.resolver.source_index_for_pos(&self.cm, span.lo());
        let start = self.byte_pos_to_scope_position(span.lo());
        let end = self.byte_pos_to_scope_position(span.hi());

        let scope_idx = self.scopes.len();
        self.scopes.push(CollectedScope {
            source_idx,
            start,
            end,
            name,
            kind: kind.map(str::to_string),
            is_stack_frame,
            is_function_boundary,
            parent,
            children: Vec::new(),
            variables: Vec::new(),
        });

        if let Some(parent_idx) = parent {
            self.scopes[parent_idx].children.push(scope_idx);
        } else if let Some(source_idx) = source_idx {
            let root_slot = &mut self.roots_by_source[source_idx as usize];
            if root_slot.is_none() {
                *root_slot = Some(scope_idx);
            }
        }

        self.scope_stack.push(scope_idx);
    }

    fn pop_scope(&mut self) {
        self.scope_stack.pop();
    }

    fn byte_pos_to_scope_position(&self, pos: BytePos) -> ScopePosition {
        match self.cm.try_lookup_char_pos(pos) {
            Ok(loc) => ScopePosition {
                line: loc.line.saturating_sub(1) as u32,
                column: loc.col.0 as u32,
            },
            Err(_) => ScopePosition::default(),
        }
    }

    fn add_variable(&mut self, name: String, span: Span, target: VariableTarget) {
        let Some(current) = self.scope_stack.last().copied() else {
            return;
        };

        let target_scope = match target {
            VariableTarget::Current => current,
            VariableTarget::Var => self.find_var_target_scope(current),
        };

        if self.scopes[target_scope]
            .variables
            .iter()
            .any(|v| v.name == name)
        {
            return;
        }

        let start = self.byte_pos_to_scope_position(span.lo());
        let end = self.byte_pos_to_scope_position(span.hi());

        self.scopes[target_scope]
            .variables
            .push(CollectedVariable { name, start, end });
    }

    fn find_var_target_scope(&self, mut scope_idx: usize) -> usize {
        loop {
            let scope = &self.scopes[scope_idx];
            if scope.is_function_boundary {
                return scope_idx;
            }

            match scope.parent {
                Some(parent) => scope_idx = parent,
                None => return scope_idx,
            }
        }
    }

    fn add_pat_variables(&mut self, pat: &Pat, target: VariableTarget) {
        collect_pat_bindings(pat, &mut |ident| {
            self.add_variable(ident.id.sym.to_string(), ident.span, target);
        });
    }

    fn add_constructor_param_variables(&mut self, param: &ParamOrTsParamProp) {
        match param {
            ParamOrTsParamProp::Param(param) => {
                self.add_pat_variables(&param.pat, VariableTarget::Current)
            }
            ParamOrTsParamProp::TsParamProp(param) => match &param.param {
                TsParamPropParam::Ident(ident) => self.add_variable(
                    ident.id.sym.to_string(),
                    ident.span,
                    VariableTarget::Current,
                ),
                TsParamPropParam::Assign(assign) => {
                    self.add_pat_variables(&Pat::Assign(assign.clone()), VariableTarget::Current)
                }
            },
        }
    }

    fn visit_function_like(
        &mut self,
        function: &Function,
        scope_name: Option<String>,
        function_name_binding: Option<BindingIdent>,
    ) {
        self.push_scope(function.span, Some("Function"), scope_name, true, true);

        if let Some(ident) = function_name_binding {
            self.add_variable(
                ident.id.sym.to_string(),
                ident.span,
                VariableTarget::Current,
            );
        }

        for param in &function.params {
            self.add_pat_variables(&param.pat, VariableTarget::Current);
        }

        function.visit_children_with(self);

        self.pop_scope();
    }

    fn prop_name_as_label(name: &PropName) -> Option<String> {
        match name {
            PropName::Ident(ident) => Some(ident.sym.to_string()),
            PropName::Str(s) => Some(s.value.to_string_lossy().into_owned()),
            PropName::Num(n) => Some(n.value.to_string()),
            PropName::BigInt(b) => Some(b.value.to_string()),
            PropName::Computed(_) => None,
        }
    }
}

impl Visit for ScopeCollector {
    noop_visit_type!();

    fn visit_program(&mut self, n: &Program) {
        n.visit_children_with(self);
    }

    fn visit_module(&mut self, n: &Module) {
        self.push_scope(n.span, Some("Module"), None, false, true);
        for item in &n.body {
            item.visit_with(self);
        }
        self.pop_scope();
    }

    fn visit_script(&mut self, n: &Script) {
        self.push_scope(n.span, Some("Global"), None, false, true);
        for stmt in &n.body {
            stmt.visit_with(self);
        }
        self.pop_scope();
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        self.add_variable(
            n.ident.sym.to_string(),
            n.ident.span,
            VariableTarget::Current,
        );

        self.visit_function_like(&n.function, Some(n.ident.sym.to_string()), None);
    }

    fn visit_fn_expr(&mut self, n: &FnExpr) {
        self.visit_function_like(
            &n.function,
            n.ident.as_ref().map(|v| v.sym.to_string()),
            n.ident.clone().map(From::from),
        );
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.push_scope(n.span, Some("Function"), None, true, true);

        for pat in &n.params {
            self.add_pat_variables(pat, VariableTarget::Current);
        }

        n.visit_children_with(self);

        self.pop_scope();
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        self.add_variable(
            n.ident.sym.to_string(),
            n.ident.span,
            VariableTarget::Current,
        );

        self.push_scope(
            n.class.span,
            Some("Class"),
            Some(n.ident.sym.to_string()),
            false,
            false,
        );
        n.class.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_class_expr(&mut self, n: &ClassExpr) {
        self.push_scope(
            n.class.span,
            Some("Class"),
            n.ident.as_ref().map(|v| v.sym.to_string()),
            false,
            false,
        );

        if let Some(ident) = &n.ident {
            self.add_variable(ident.sym.to_string(), ident.span, VariableTarget::Current);
        }

        n.class.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_class_method(&mut self, n: &ClassMethod) {
        self.visit_function_like(&n.function, Self::prop_name_as_label(&n.key), None);
    }

    fn visit_private_method(&mut self, n: &PrivateMethod) {
        self.visit_function_like(&n.function, Some(n.key.name.to_string()), None);
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        self.push_scope(
            n.span,
            Some("Function"),
            Some("constructor".into()),
            true,
            true,
        );

        for param in &n.params {
            self.add_constructor_param_variables(param);
            param.visit_with(self);
        }

        if let Some(body) = &n.body {
            body.visit_with(self);
        }

        self.pop_scope();
    }

    fn visit_method_prop(&mut self, n: &MethodProp) {
        self.visit_function_like(&n.function, Self::prop_name_as_label(&n.key), None);
    }

    fn visit_getter_prop(&mut self, n: &GetterProp) {
        self.push_scope(
            n.span,
            Some("Function"),
            Self::prop_name_as_label(&n.key),
            true,
            true,
        );

        if let Some(body) = &n.body {
            body.visit_with(self);
        }

        self.pop_scope();
    }

    fn visit_setter_prop(&mut self, n: &SetterProp) {
        self.push_scope(
            n.span,
            Some("Function"),
            Self::prop_name_as_label(&n.key),
            true,
            true,
        );

        self.add_pat_variables(&n.param, VariableTarget::Current);

        if let Some(body) = &n.body {
            body.visit_with(self);
        }

        self.pop_scope();
    }

    fn visit_static_block(&mut self, n: &StaticBlock) {
        self.push_scope(n.span, Some("Block"), None, false, false);
        for stmt in &n.body.stmts {
            stmt.visit_with(self);
        }
        self.pop_scope();
    }

    fn visit_block_stmt(&mut self, n: &swc_ecma_ast::BlockStmt) {
        self.push_scope(n.span, Some("Block"), None, false, false);
        for stmt in &n.stmts {
            stmt.visit_with(self);
        }
        self.pop_scope();
    }

    fn visit_catch_clause(&mut self, n: &CatchClause) {
        self.push_scope(n.span, Some("Block"), None, false, false);

        if let Some(param) = &n.param {
            self.add_pat_variables(param, VariableTarget::Current);
        }

        for stmt in &n.body.stmts {
            stmt.visit_with(self);
        }

        self.pop_scope();
    }

    fn visit_var_decl(&mut self, n: &VarDecl) {
        let target = if n.kind == VarDeclKind::Var {
            VariableTarget::Var
        } else {
            VariableTarget::Current
        };

        for decl in &n.decls {
            self.add_pat_variables(&decl.name, target);
            if let Some(init) = &decl.init {
                init.visit_with(self);
            }
        }
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        for specifier in &n.specifiers {
            match specifier {
                ImportSpecifier::Named(named) => {
                    self.add_variable(
                        named.local.sym.to_string(),
                        named.local.span,
                        VariableTarget::Current,
                    );
                }
                ImportSpecifier::Default(default) => {
                    self.add_variable(
                        default.local.sym.to_string(),
                        default.local.span,
                        VariableTarget::Current,
                    );
                }
                ImportSpecifier::Namespace(namespace) => {
                    self.add_variable(
                        namespace.local.sym.to_string(),
                        namespace.local.span,
                        VariableTarget::Current,
                    );
                }
            }
        }
    }
}

fn collect_pat_bindings<'a>(pat: &'a Pat, op: &mut impl FnMut(&'a BindingIdent)) {
    match pat {
        Pat::Ident(ident) => op(ident),
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_pat_bindings(elem, op);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    ObjectPatProp::KeyValue(key_value) => {
                        collect_pat_bindings(&key_value.value, op);
                    }
                    ObjectPatProp::Assign(assign) => op(&assign.key),
                    ObjectPatProp::Rest(rest) => collect_pat_bindings(&rest.arg, op),
                }
            }
        }
        Pat::Assign(assign) => collect_pat_bindings(&assign.left, op),
        Pat::Rest(rest) => collect_pat_bindings(&rest.arg, op),
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}
