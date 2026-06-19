use rustc_hash::FxHashMap;
use swc_common::{source_map::SmallPos, util::take::Take, Span, SyntaxContext};
use swc_ecma_ast::*;

#[derive(Default, Clone)]
pub struct PreservedAst {
    pub nodes: FxHashMap<u32, PreservedNode>,
}

/// SWC AST nodes that are not represented losslessly in React Compiler's AST.
#[derive(Clone)]
pub enum PreservedNode {
    Arrow(Box<ArrowShell>),
    Call(Box<CallShell>),
    Class(Box<Class>),
    Directive(Box<Str>),
    Function(Box<FunctionShell>),
    Import(Box<ImportShell>),
    JsxOpeningElement(Box<JsxOpeningElementShell>),
    New(Box<NewShell>),
    TaggedTemplate(Box<TaggedTemplateShell>),
    TsExpr(Box<TsExprShell>),
    TsEnum(Box<TsEnumDecl>),
    TsExportAssignment(TsExportAssignment),
    TsImportEquals(Box<TsImportEqualsDecl>),
    TsInterface(Box<TsInterfaceDecl>),
    TsModule(Box<TsModuleDecl>),
    TsNamespaceExport(TsNamespaceExportDecl),
    TsTypeAlias(Box<TsTypeAliasDecl>),
    Variable(Box<VariableShell>),
}

/// Lightweight arrow function metadata not represented losslessly in React
/// Compiler's AST.
#[derive(Clone)]
pub struct ArrowShell {
    params: Vec<Option<PatternTypeShell>>,
    type_params: Option<Box<TsTypeParamDecl>>,
    return_type: Option<Box<TsTypeAnn>>,
}

/// Lightweight function metadata not represented losslessly in React Compiler's
/// AST.
#[derive(Clone)]
pub struct FunctionShell {
    params: Vec<Param>,
    decorators: Vec<Decorator>,
    type_params: Option<Box<TsTypeParamDecl>>,
    return_type: Option<Box<TsTypeAnn>>,
}

/// Lightweight variable declaration metadata not represented losslessly in
/// React Compiler's AST.
#[derive(Clone)]
pub struct VariableShell {
    declarations: Vec<Option<PatternTypeShell>>,
}

/// Typescript pattern metadata attached to the outer binding pattern.
#[derive(Clone)]
pub enum PatternTypeShell {
    Ident {
        type_ann: Option<Box<TsTypeAnn>>,
        optional: bool,
    },
    Array {
        type_ann: Option<Box<TsTypeAnn>>,
        optional: bool,
    },
    Object {
        type_ann: Option<Box<TsTypeAnn>>,
        optional: bool,
    },
    Rest {
        type_ann: Option<Box<TsTypeAnn>>,
    },
}

/// Lightweight call metadata not represented losslessly in React Compiler's
/// AST.
#[derive(Clone)]
pub struct CallShell {
    type_args: Option<Box<TsTypeParamInstantiation>>,
}

/// Lightweight import metadata that SWC's import declaration shape cannot
/// recover from React Compiler's AST alone.
#[derive(Clone)]
pub struct ImportShell {
    phase: ImportPhase,
}

/// Lightweight JSX opening element metadata not represented losslessly in
/// React Compiler's AST.
#[derive(Clone)]
pub struct JsxOpeningElementShell {
    type_args: Option<Box<TsTypeParamInstantiation>>,
}

/// Lightweight new expression metadata not represented losslessly in React
/// Compiler's AST.
#[derive(Clone)]
pub struct NewShell {
    type_args: Option<Box<TsTypeParamInstantiation>>,
}

/// Lightweight tagged template metadata not represented losslessly in React
/// Compiler's AST.
#[derive(Clone)]
pub struct TaggedTemplateShell {
    type_params: Option<Box<TsTypeParamInstantiation>>,
}

/// Lightweight Typescript expression wrapper metadata. These wrappers use
/// `span.hi` as their preservation key because their `span.lo` is often shared
/// with the wrapped expression.
#[derive(Clone)]
pub enum TsExprShell {
    As {
        span: Span,
        type_ann: Box<TsType>,
    },
    Satisfies {
        span: Span,
        type_ann: Box<TsType>,
    },
    TypeAssertion {
        span: Span,
        type_ann: Box<TsType>,
    },
    Instantiation {
        span: Span,
        type_args: Box<TsTypeParamInstantiation>,
    },
}

impl PreservedAst {
    pub fn save_arrow(&mut self, arrow: &ArrowExpr) {
        self.nodes.insert(
            arrow.span.lo.to_u32(),
            PreservedNode::Arrow(Box::new(ArrowShell {
                params: arrow
                    .params
                    .iter()
                    .map(PatternTypeShell::from_pat)
                    .collect(),
                type_params: arrow.type_params.clone(),
                return_type: arrow.return_type.clone(),
            })),
        );
    }

    pub fn load_arrow(&mut self, arrow: &mut ArrowExpr) -> bool {
        let key = arrow.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Arrow(_))) {
            return false;
        }

        let Some(PreservedNode::Arrow(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        arrow.type_params = snapshot.type_params;
        arrow.return_type = snapshot.return_type;
        for (param, source_param) in arrow.params.iter_mut().zip(snapshot.params) {
            if let Some(source_param) = source_param {
                source_param.apply_to_pat(param);
            }
        }

        true
    }

    pub fn save_call(&mut self, call: &CallExpr) {
        self.nodes.insert(
            call.span.lo.to_u32(),
            PreservedNode::Call(Box::new(CallShell {
                type_args: call.type_args.clone(),
            })),
        );
    }

    pub fn save_opt_call(&mut self, span: Span, call: &OptCall) {
        self.nodes.insert(
            span.lo.to_u32(),
            PreservedNode::Call(Box::new(CallShell {
                type_args: call.type_args.clone(),
            })),
        );
    }

    pub fn load_call(&mut self, call: &mut CallExpr) -> bool {
        let key = call.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Call(_))) {
            return false;
        }

        let Some(PreservedNode::Call(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        call.type_args = snapshot.type_args;

        true
    }

    pub fn load_opt_call(&mut self, call: &mut OptCall) -> bool {
        let key = call.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Call(_))) {
            return false;
        }

        let Some(PreservedNode::Call(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        call.type_args = snapshot.type_args;

        true
    }

    pub fn save_class(&mut self, class: &Class) {
        self.nodes.insert(
            class.span.lo.to_u32(),
            PreservedNode::Class(Box::new(class.clone())),
        );
    }

    pub fn class_ctxt_for_span(&self, span: Span) -> Option<SyntaxContext> {
        let key = span.lo.to_u32();
        let Some(PreservedNode::Class(snapshot)) = self.nodes.get(&key) else {
            return None;
        };

        Some(snapshot.ctxt)
    }

    pub fn load_class(&mut self, class: &mut Class) -> bool {
        let key = class.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Class(_))) {
            return false;
        }

        let Some(PreservedNode::Class(mut snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        // Restore everything except the super class
        snapshot.super_class = class.super_class.take();
        *class = *snapshot;

        true
    }

    pub fn save_directive(&mut self, lit: &Str) {
        self.nodes.insert(
            lit.span.lo.to_u32(),
            PreservedNode::Directive(Box::new(lit.clone())),
        );
    }

    pub fn load_directive(&mut self, lit: &mut Str) -> bool {
        let key = lit.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Directive(_))) {
            return false;
        }

        let Some(PreservedNode::Directive(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        *lit = *snapshot;

        true
    }

    pub fn save_function(&mut self, function: &Function) {
        self.nodes.insert(
            function.span.lo.to_u32(),
            PreservedNode::Function(Box::new(FunctionShell {
                params: function.params.clone(),
                decorators: function.decorators.clone(),
                type_params: function.type_params.clone(),
                return_type: function.return_type.clone(),
            })),
        );
    }

    pub fn load_function(&mut self, function: &mut Function) -> bool {
        let key = function.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Function(_))) {
            return false;
        }

        let Some(PreservedNode::Function(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        function.decorators = snapshot.decorators;
        function.type_params = snapshot.type_params;
        function.return_type = snapshot.return_type;
        for (param, source_param) in function.params.iter_mut().zip(snapshot.params) {
            param.decorators = source_param.decorators;
            if let Some(pat_type) = PatternTypeShell::from_pat(&source_param.pat) {
                pat_type.apply_to_pat(&mut param.pat);
            }
        }

        true
    }

    pub fn load_ts_function(&mut self, function: &mut Function) -> bool {
        let key = function.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Function(_))) {
            return false;
        }

        let Some(PreservedNode::Function(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        function.decorators = snapshot.decorators;
        function.type_params = snapshot.type_params;
        function.return_type = snapshot.return_type;
        function.params = snapshot.params;

        true
    }

    pub fn save_import(&mut self, decl: &ImportDecl) {
        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::Import(Box::new(ImportShell { phase: decl.phase })),
        );
    }

    pub fn load_import(&mut self, decl: &mut ImportDecl) -> bool {
        let key = decl.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Import(_))) {
            return false;
        }

        let Some(PreservedNode::Import(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        decl.phase = snapshot.phase;

        true
    }

    pub fn save_jsx_opening_element(&mut self, el: &JSXOpeningElement) {
        self.nodes.insert(
            el.span.lo.to_u32(),
            PreservedNode::JsxOpeningElement(Box::new(JsxOpeningElementShell {
                type_args: el.type_args.clone(),
            })),
        );
    }

    pub fn load_jsx_opening_element(&mut self, el: &mut JSXOpeningElement) -> bool {
        let key = el.span.lo.to_u32();
        if !matches!(
            self.nodes.get(&key),
            Some(PreservedNode::JsxOpeningElement(_))
        ) {
            return false;
        }

        let Some(PreservedNode::JsxOpeningElement(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        el.type_args = snapshot.type_args;

        true
    }

    pub fn save_new(&mut self, new: &NewExpr) {
        self.nodes.insert(
            new.span.lo.to_u32(),
            PreservedNode::New(Box::new(NewShell {
                type_args: new.type_args.clone(),
            })),
        );
    }

    pub fn load_new(&mut self, new: &mut NewExpr) -> bool {
        let key = new.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::New(_))) {
            return false;
        }

        let Some(PreservedNode::New(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        new.type_args = snapshot.type_args;

        true
    }

    pub fn save_tagged_tpl(&mut self, tagged: &TaggedTpl) {
        self.nodes.insert(
            tagged.span.lo.to_u32(),
            PreservedNode::TaggedTemplate(Box::new(TaggedTemplateShell {
                type_params: tagged.type_params.clone(),
            })),
        );
    }

    pub fn load_tagged_tpl(&mut self, tagged: &mut TaggedTpl) -> bool {
        let key = tagged.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::TaggedTemplate(_))) {
            return false;
        }

        let Some(PreservedNode::TaggedTemplate(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        tagged.type_params = snapshot.type_params;

        true
    }

    pub fn save_var_decl(&mut self, decl: &VarDecl) {
        let declarations: Vec<_> = decl
            .decls
            .iter()
            .map(|declarator| PatternTypeShell::from_pat(&declarator.name))
            .collect();
        if declarations.iter().all(Option::is_none) {
            return;
        }

        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::Variable(Box::new(VariableShell { declarations })),
        );
    }

    pub fn load_var_decl(&mut self, decl: &mut VarDecl) -> bool {
        let key = decl.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::Variable(_))) {
            return false;
        }

        let Some(PreservedNode::Variable(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        for (declarator, source_declarator) in decl.decls.iter_mut().zip(snapshot.declarations) {
            if let Some(source_declarator) = source_declarator {
                source_declarator.apply_to_pat(&mut declarator.name);
            }
        }

        true
    }

    pub fn save_ts_as_expr(&mut self, expr: &TsAsExpr) {
        self.nodes.insert(
            expr.span.hi.to_u32(),
            PreservedNode::TsExpr(Box::new(TsExprShell::from_ts_as_expr(expr))),
        );
    }

    pub fn load_ts_as_expr(&mut self, expr: &mut TsAsExpr) -> bool {
        let key = expr.span.hi.to_u32();
        if !matches!(
            self.nodes.get(&key),
            Some(PreservedNode::TsExpr(shell)) if matches!(shell.as_ref(), TsExprShell::As { .. })
        ) {
            return false;
        }

        let Some(PreservedNode::TsExpr(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        let TsExprShell::As { span, type_ann } = *snapshot else {
            unreachable!()
        };

        expr.span = span;
        expr.type_ann = type_ann;

        true
    }

    pub fn save_ts_satisfies_expr(&mut self, expr: &TsSatisfiesExpr) {
        self.nodes.insert(
            expr.span.hi.to_u32(),
            PreservedNode::TsExpr(Box::new(TsExprShell::from_ts_satisfies_expr(expr))),
        );
    }

    pub fn load_ts_satisfies_expr(&mut self, expr: &mut TsSatisfiesExpr) -> bool {
        let key = expr.span.hi.to_u32();
        if !matches!(
            self.nodes.get(&key),
            Some(PreservedNode::TsExpr(shell))
                if matches!(shell.as_ref(), TsExprShell::Satisfies { .. })
        ) {
            return false;
        }

        let Some(PreservedNode::TsExpr(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        let TsExprShell::Satisfies { span, type_ann } = *snapshot else {
            unreachable!()
        };

        expr.span = span;
        expr.type_ann = type_ann;

        true
    }

    pub fn save_ts_type_assertion(&mut self, expr: &TsTypeAssertion) {
        self.nodes.insert(
            expr.span.hi.to_u32(),
            PreservedNode::TsExpr(Box::new(TsExprShell::from_ts_type_assertion(expr))),
        );
    }

    pub fn load_ts_type_assertion(&mut self, expr: &mut TsTypeAssertion) -> bool {
        let key = expr.span.hi.to_u32();
        if !matches!(
            self.nodes.get(&key),
            Some(PreservedNode::TsExpr(shell))
                if matches!(shell.as_ref(), TsExprShell::TypeAssertion { .. })
        ) {
            return false;
        }

        let Some(PreservedNode::TsExpr(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        let TsExprShell::TypeAssertion { span, type_ann } = *snapshot else {
            unreachable!()
        };

        expr.span = span;
        expr.type_ann = type_ann;

        true
    }

    pub fn save_ts_instantiation(&mut self, expr: &TsInstantiation) {
        self.nodes.insert(
            expr.span.hi.to_u32(),
            PreservedNode::TsExpr(Box::new(TsExprShell::from_ts_instantiation(expr))),
        );
    }

    pub fn load_ts_instantiation(&mut self, expr: &mut TsInstantiation) -> bool {
        let key = expr.span.hi.to_u32();
        if !matches!(
            self.nodes.get(&key),
            Some(PreservedNode::TsExpr(shell))
                if matches!(shell.as_ref(), TsExprShell::Instantiation { .. })
        ) {
            return false;
        }

        let Some(PreservedNode::TsExpr(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        let TsExprShell::Instantiation { span, type_args } = *snapshot else {
            unreachable!()
        };

        expr.span = span;
        expr.type_args = type_args;

        true
    }

    pub fn load_ts_expr_for_span(&mut self, expr: &mut Expr, span: Span) -> bool {
        let key = span.hi.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::TsExpr(_))) {
            return false;
        }

        let Some(PreservedNode::TsExpr(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        let current = expr.take();
        *expr = snapshot.wrap(current);

        true
    }

    pub fn save_ts_export_assignment(&mut self, decl: &TsExportAssignment) {
        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::TsExportAssignment(decl.clone()),
        );
    }

    pub fn save_export_default_ts_interface(&mut self, span: Span, decl: &TsInterfaceDecl) {
        self.nodes.insert(
            span.lo.to_u32(),
            PreservedNode::TsInterface(Box::new(decl.clone())),
        );
    }

    pub fn save_ts_import_equals(&mut self, decl: &TsImportEqualsDecl) {
        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::TsImportEquals(Box::new(decl.clone())),
        );
    }

    pub fn save_ts_module(&mut self, decl: &TsModuleDecl) {
        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::TsModule(Box::new(decl.clone())),
        );
    }

    pub fn save_ts_namespace_export(&mut self, decl: &TsNamespaceExportDecl) {
        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::TsNamespaceExport(decl.clone()),
        );
    }

    pub fn save_ts_type_alias(&mut self, decl: &TsTypeAliasDecl) {
        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::TsTypeAlias(Box::new(decl.clone())),
        );
    }

    pub fn save_ts_interface(&mut self, decl: &TsInterfaceDecl) {
        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::TsInterface(Box::new(decl.clone())),
        );
    }

    pub fn save_ts_enum(&mut self, decl: &TsEnumDecl) {
        self.nodes.insert(
            decl.span.lo.to_u32(),
            PreservedNode::TsEnum(Box::new(decl.clone())),
        );
    }

    pub fn load_ts_type_alias(&mut self, decl: &mut TsTypeAliasDecl) -> bool {
        let key = decl.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::TsTypeAlias(_))) {
            return false;
        }

        let Some(PreservedNode::TsTypeAlias(mut snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        snapshot.id = decl.id.take();
        *decl = *snapshot;

        true
    }

    pub fn load_ts_interface(&mut self, decl: &mut TsInterfaceDecl) -> bool {
        let key = decl.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::TsInterface(_))) {
            return false;
        }

        let Some(PreservedNode::TsInterface(mut snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        snapshot.id = decl.id.take();
        *decl = *snapshot;

        true
    }

    pub fn load_ts_enum(&mut self, decl: &mut TsEnumDecl) -> bool {
        let key = decl.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::TsEnum(_))) {
            return false;
        }

        let Some(PreservedNode::TsEnum(mut snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        snapshot.id = decl.id.take();
        *decl = *snapshot;

        true
    }

    pub fn load_export_default_ts_interface(&mut self, decl: &mut ExportDefaultDecl) -> bool {
        let key = decl.span.lo.to_u32();
        if !matches!(self.nodes.get(&key), Some(PreservedNode::TsInterface(_))) {
            return false;
        }

        let Some(PreservedNode::TsInterface(snapshot)) = self.nodes.remove(&key) else {
            unreachable!()
        };

        decl.decl = DefaultDecl::TsInterfaceDecl(snapshot);
        true
    }

    pub fn load_module_item(&mut self, item: &mut ModuleItem, id: Option<TsModuleName>) -> bool {
        let key = match module_item_span(item) {
            Some(span) => span.lo.to_u32(),
            None => return false,
        };
        if !matches!(
            self.nodes.get(&key),
            Some(
                PreservedNode::TsExportAssignment(_)
                    | PreservedNode::TsImportEquals(_)
                    | PreservedNode::TsModule(_)
                    | PreservedNode::TsNamespaceExport(_)
            )
        ) {
            return false;
        }

        let Some(snapshot) = self.nodes.remove(&key) else {
            unreachable!()
        };

        match snapshot {
            PreservedNode::TsExportAssignment(decl) => {
                *item = ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(decl));
            }
            PreservedNode::TsImportEquals(mut decl) => {
                if let Some(TsModuleName::Ident(id)) = id {
                    decl.id = id;
                }
                *item = ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(decl));
            }
            PreservedNode::TsModule(mut decl) => {
                if let Some(id) = id {
                    decl.id = id;
                }
                *item = ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(decl)));
            }
            PreservedNode::TsNamespaceExport(mut decl) => {
                if let Some(TsModuleName::Ident(id)) = id {
                    decl.id = id;
                }
                *item = ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(decl));
            }
            _ => unreachable!(),
        }
        true
    }
}

fn module_item_span(item: &ModuleItem) -> Option<swc_common::Span> {
    match item {
        ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(decl)) => Some(decl.span),
        ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(decl)) => Some(decl.span),
        ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(decl)) => Some(decl.span),
        ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(decl))) => Some(decl.span),
        _ => None,
    }
}

impl PatternTypeShell {
    fn from_pat(pattern: &Pat) -> Option<Self> {
        match Self::typed_pat(pattern) {
            Pat::Ident(pattern) => Some(Self::Ident {
                type_ann: pattern.type_ann.clone(),
                optional: pattern.id.optional,
            }),
            Pat::Array(pattern) => Some(Self::Array {
                type_ann: pattern.type_ann.clone(),
                optional: pattern.optional,
            }),
            Pat::Object(pattern) => Some(Self::Object {
                type_ann: pattern.type_ann.clone(),
                optional: pattern.optional,
            }),
            Pat::Rest(pattern) => Some(Self::Rest {
                type_ann: pattern.type_ann.clone(),
            }),
            _ => None,
        }
    }

    fn apply_to_pat(self, pattern: &mut Pat) {
        match (self, Self::typed_pat_mut(pattern)) {
            (Self::Ident { type_ann, optional }, Pat::Ident(pattern)) => {
                pattern.type_ann = type_ann;
                pattern.id.optional = optional;
            }
            (Self::Array { type_ann, optional }, Pat::Array(pattern)) => {
                pattern.type_ann = type_ann;
                pattern.optional = optional;
            }
            (Self::Object { type_ann, optional }, Pat::Object(pattern)) => {
                pattern.type_ann = type_ann;
                pattern.optional = optional;
            }
            (Self::Rest { type_ann }, Pat::Rest(pattern)) => {
                pattern.type_ann = type_ann;
            }
            _ => {}
        }
    }

    fn typed_pat(pattern: &Pat) -> &Pat {
        match pattern {
            Pat::Assign(pattern) => &pattern.left,
            _ => pattern,
        }
    }

    fn typed_pat_mut(pattern: &mut Pat) -> &mut Pat {
        match pattern {
            Pat::Assign(pattern) => &mut pattern.left,
            _ => pattern,
        }
    }
}

impl TsExprShell {
    fn from_ts_as_expr(expr: &TsAsExpr) -> Self {
        Self::As {
            span: expr.span,
            type_ann: expr.type_ann.clone(),
        }
    }

    fn from_ts_satisfies_expr(expr: &TsSatisfiesExpr) -> Self {
        Self::Satisfies {
            span: expr.span,
            type_ann: expr.type_ann.clone(),
        }
    }

    fn from_ts_type_assertion(expr: &TsTypeAssertion) -> Self {
        Self::TypeAssertion {
            span: expr.span,
            type_ann: expr.type_ann.clone(),
        }
    }

    fn from_ts_instantiation(expr: &TsInstantiation) -> Self {
        Self::Instantiation {
            span: expr.span,
            type_args: expr.type_args.clone(),
        }
    }

    fn wrap(self, expr: Expr) -> Expr {
        match self {
            TsExprShell::As { span, type_ann } => Expr::TsAs(TsAsExpr {
                span,
                expr: Box::new(expr),
                type_ann,
            }),
            TsExprShell::Satisfies { span, type_ann } => Expr::TsSatisfies(TsSatisfiesExpr {
                span,
                expr: Box::new(expr),
                type_ann,
            }),
            TsExprShell::TypeAssertion { span, type_ann } => {
                Expr::TsTypeAssertion(TsTypeAssertion {
                    span,
                    expr: Box::new(expr),
                    type_ann,
                })
            }
            TsExprShell::Instantiation { span, type_args } => {
                Expr::TsInstantiation(TsInstantiation {
                    span,
                    expr: Box::new(expr),
                    type_args,
                })
            }
        }
    }
}
