//! Count every generated ECMAScript AST node kind with a read-only pass.
//!
//! Usage:
//!
//! ```bash
//! cargo run -p swc --example node_counter -- path/to/input.tsx
//! ```

use std::{
    env,
    ffi::OsStr,
    path::{Path, PathBuf},
    process,
};

use swc_common::{sync::Lrc, SourceMap, GLOBALS};
use swc_ecma_ast::{Pass, Program};
use swc_ecma_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use swc_ecma_visit::NodeRef;

// Keep this list in sync with generated `swc_ecma_visit::NodeRef`. The
// `node_kind` match below is intentionally exhaustive, so adding or removing an
// AST node kind in `NodeRef` makes this example fail to compile until the list
// is updated.
macro_rules! node_ref_variants {
    ($macro:ident) => {
        $macro! {
            Accessibility,
            ArrayLit,
            ArrayPat,
            ArrowExpr,
            AssignExpr,
            AssignOp,
            AssignPat,
            AssignPatProp,
            AssignProp,
            AssignTarget,
            AssignTargetPat,
            AutoAccessor,
            AwaitExpr,
            BigInt,
            BinExpr,
            BinaryOp,
            BindingIdent,
            BlockStmt,
            BlockStmtOrExpr,
            Bool,
            BreakStmt,
            CallExpr,
            Callee,
            CatchClause,
            Class,
            ClassDecl,
            ClassExpr,
            ClassMember,
            ClassMethod,
            ClassProp,
            ComputedPropName,
            CondExpr,
            Constructor,
            ContinueStmt,
            DebuggerStmt,
            Decl,
            Decorator,
            DefaultDecl,
            DoWhileStmt,
            EmptyStmt,
            ExportAll,
            ExportDecl,
            ExportDefaultDecl,
            ExportDefaultExpr,
            ExportDefaultSpecifier,
            ExportNamedSpecifier,
            ExportNamespaceSpecifier,
            ExportSpecifier,
            Expr,
            ExprOrSpread,
            ExprStmt,
            FnDecl,
            FnExpr,
            ForHead,
            ForInStmt,
            ForOfStmt,
            ForStmt,
            Function,
            GetterProp,
            Ident,
            IdentName,
            IfStmt,
            Import,
            ImportDecl,
            ImportDefaultSpecifier,
            ImportNamedSpecifier,
            ImportPhase,
            ImportSpecifier,
            ImportStarAsSpecifier,
            ImportWith,
            ImportWithItem,
            Invalid,
            JSXAttr,
            JSXAttrName,
            JSXAttrOrSpread,
            JSXAttrValue,
            JSXClosingElement,
            JSXClosingFragment,
            JSXElement,
            JSXElementChild,
            JSXElementName,
            JSXEmptyExpr,
            JSXExpr,
            JSXExprContainer,
            JSXFragment,
            JSXMemberExpr,
            JSXNamespacedName,
            JSXObject,
            JSXOpeningElement,
            JSXOpeningFragment,
            JSXSpreadChild,
            JSXText,
            Key,
            KeyValuePatProp,
            KeyValueProp,
            LabeledStmt,
            Lit,
            MemberExpr,
            MemberProp,
            MetaPropExpr,
            MetaPropKind,
            MethodKind,
            MethodProp,
            Module,
            ModuleDecl,
            ModuleExportName,
            ModuleItem,
            NamedExport,
            NewExpr,
            Null,
            Number,
            ObjectLit,
            ObjectPat,
            ObjectPatProp,
            OptCall,
            OptChainBase,
            OptChainExpr,
            Param,
            ParamOrTsParamProp,
            ParenExpr,
            Pat,
            PrivateMethod,
            PrivateName,
            PrivateProp,
            Program,
            Prop,
            PropName,
            PropOrSpread,
            Regex,
            RestPat,
            ReturnStmt,
            Script,
            SeqExpr,
            SetterProp,
            SimpleAssignTarget,
            SpreadElement,
            StaticBlock,
            Stmt,
            Str,
            Super,
            SuperProp,
            SuperPropExpr,
            SwitchCase,
            SwitchStmt,
            TaggedTpl,
            ThisExpr,
            ThrowStmt,
            Tpl,
            TplElement,
            TruePlusMinus,
            TryStmt,
            TsArrayType,
            TsAsExpr,
            TsCallSignatureDecl,
            TsConditionalType,
            TsConstAssertion,
            TsConstructSignatureDecl,
            TsConstructorType,
            TsEntityName,
            TsEnumDecl,
            TsEnumMember,
            TsEnumMemberId,
            TsExportAssignment,
            TsExprWithTypeArgs,
            TsExternalModuleRef,
            TsFnOrConstructorType,
            TsFnParam,
            TsFnType,
            TsGetterSignature,
            TsImportCallOptions,
            TsImportEqualsDecl,
            TsImportType,
            TsIndexSignature,
            TsIndexedAccessType,
            TsInferType,
            TsInstantiation,
            TsInterfaceBody,
            TsInterfaceDecl,
            TsIntersectionType,
            TsKeywordType,
            TsKeywordTypeKind,
            TsLit,
            TsLitType,
            TsMappedType,
            TsMethodSignature,
            TsModuleBlock,
            TsModuleDecl,
            TsModuleName,
            TsModuleRef,
            TsNamespaceBody,
            TsNamespaceDecl,
            TsNamespaceExportDecl,
            TsNonNullExpr,
            TsOptionalType,
            TsParamProp,
            TsParamPropParam,
            TsParenthesizedType,
            TsPropertySignature,
            TsQualifiedName,
            TsRestType,
            TsSatisfiesExpr,
            TsSetterSignature,
            TsThisType,
            TsThisTypeOrIdent,
            TsTplLitType,
            TsTupleElement,
            TsTupleType,
            TsType,
            TsTypeAliasDecl,
            TsTypeAnn,
            TsTypeAssertion,
            TsTypeElement,
            TsTypeLit,
            TsTypeOperator,
            TsTypeOperatorOp,
            TsTypeParam,
            TsTypeParamDecl,
            TsTypeParamInstantiation,
            TsTypePredicate,
            TsTypeQuery,
            TsTypeQueryExpr,
            TsTypeRef,
            TsUnionOrIntersectionType,
            TsUnionType,
            UnaryExpr,
            UnaryOp,
            UpdateExpr,
            UpdateOp,
            UsingDecl,
            VarDecl,
            VarDeclKind,
            VarDeclOrExpr,
            VarDeclarator,
            WhileStmt,
            WithStmt,
            YieldExpr,
        }
    };
}

macro_rules! node_names {
    ($($name:ident),+ $(,)?) => {
        &[$(stringify!($name)),+]
    };
}

const NODE_NAMES: &[&str] = node_ref_variants!(node_names);

macro_rules! define_node_kind {
    ($($name:ident),+ $(,)?) => {
        fn node_kind(node: NodeRef<'_>) -> &'static str {
            match node {
                $(NodeRef::$name(_) => stringify!($name),)+
            }
        }
    };
}

node_ref_variants!(define_node_kind);

struct NodeCounter {
    counts: rustc_hash::FxHashMap<&'static str, usize>,
}

impl Default for NodeCounter {
    fn default() -> Self {
        Self {
            counts: NODE_NAMES.iter().map(|name| (*name, 0)).collect(),
        }
    }
}

impl NodeCounter {
    fn count(&mut self, name: &'static str) {
        *self.counts.get_mut(name).expect("node kind is registered") += 1;
    }

    fn print(&self) {
        let width = NODE_NAMES
            .iter()
            .map(|name| name.len())
            .max()
            .unwrap_or_default();

        println!("AST node counts:");

        for name in NODE_NAMES {
            let count = self.counts.get(name).copied().unwrap_or_default();
            println!("  {name:<width$} {count}", width = width);
        }
    }
}

impl Pass for NodeCounter {
    fn process(&mut self, program: &mut Program) {
        let root = NodeRef::from(&*program);

        for node in root.experimental_traverse() {
            self.count(node_kind(node));
        }
    }
}

fn syntax_for_path(path: &Path) -> Syntax {
    let ext = path
        .extension()
        .and_then(OsStr::to_str)
        .map(str::to_ascii_lowercase);

    let is_ts = ext
        .as_deref()
        .is_some_and(|ext| matches!(ext, "ts" | "tsx" | "mts" | "cts" | "mtsx" | "ctsx"));
    let is_jsx = ext
        .as_deref()
        .is_some_and(|ext| matches!(ext, "jsx" | "tsx" | "mjsx" | "cjsx" | "mtsx" | "ctsx"));
    let is_dts = is_ts
        && path
            .file_name()
            .and_then(OsStr::to_str)
            .is_some_and(|file_name| file_name.ends_with(".d.ts"));

    if is_ts {
        Syntax::Typescript(TsSyntax {
            tsx: is_jsx,
            decorators: true,
            dts: is_dts,
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: is_jsx,
            decorators: true,
            import_attributes: true,
            export_default_from: true,
            auto_accessors: true,
            explicit_resource_management: true,
            ..Default::default()
        })
    }
}

fn input_path() -> PathBuf {
    match env::args_os().nth(1) {
        Some(path) => path.into(),
        None => {
            eprintln!("Usage: cargo run -p swc --example node_counter -- <file_path>");
            process::exit(1);
        }
    }
}

fn main() {
    let file_path = input_path();
    let cm: Lrc<SourceMap> = Default::default();
    let source_file = cm.load_file(&file_path).unwrap_or_else(|err| {
        eprintln!("Failed to load '{}': {err}", file_path.display());
        process::exit(1);
    });
    let syntax = syntax_for_path(&file_path);

    GLOBALS.set(&Default::default(), || {
        let mut errors = Vec::new();
        let mut program =
            parse_file_as_program(&source_file, syntax, Default::default(), None, &mut errors)
                .unwrap_or_else(|err| {
                    eprintln!("Failed to parse '{}': {err:?}", file_path.display());
                    process::exit(1);
                });

        if !errors.is_empty() {
            eprintln!("Parsed with {} recoverable error(s).", errors.len());
        }

        let mut counter = NodeCounter::default();
        counter.process(&mut program);
        counter.print();
    });
}
