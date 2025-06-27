use either::Either;
use swc_ecma_ast::Pass;
use swc_ecma_visit::fold_pass;

use crate::{decorators, DecoratorVersion};

pub(crate) fn decorator_impl(version: DecoratorVersion) -> impl Pass {
    match version {
        // Legacy decorator version - use existing implementation
        DecoratorVersion::V202112 => Either::Left(decorators(decorators::Config {
            legacy: false,
            emit_metadata: false,
            use_define_for_class_fields: false,
        })),
        // Newer versions - use apply_decs based implementation
        DecoratorVersion::V202203 => Either::Right(Either::Left(fold_pass(ApplyDecsPass {
            version,
            accessor_counter: 0,
        }))),
        DecoratorVersion::V202311 => Either::Right(Either::Right(fold_pass(ApplyDecsPass {
            version,
            accessor_counter: 0,
        }))),
    }
}

use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{quote_str, ExprFactory};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

// Decorator element kinds (from Babel)
const FIELD: u8 = 0;
const ACCESSOR: u8 = 1;
const METHOD: u8 = 2;
const GETTER: u8 = 3;
const SETTER: u8 = 4;

const STATIC: u8 = 8; // 1 << 3
const DECORATORS_HAVE_THIS: u8 = 16; // 1 << 4

struct ApplyDecsPass {
    version: DecoratorVersion,
    accessor_counter: usize,
}

#[derive(Debug)]
struct DecoratorInfo {
    decorators_array: Expr,
    decorators_have_this: bool,
    kind: u8,
    is_static: bool,
    name: Expr,
    private_methods: Option<Vec<Expr>>,
    locals: Vec<Ident>,
}

impl ApplyDecsPass {
    fn generate_unique_ident(&self, name: &str) -> Ident {
        Ident::new(name.into(), DUMMY_SP, SyntaxContext::empty())
    }

    fn get_element_kind(&self, member: &ClassMember) -> u8 {
        match member {
            ClassMember::ClassProp(_) | ClassMember::PrivateProp(_) => FIELD,
            ClassMember::AutoAccessor(_) => ACCESSOR,
            ClassMember::Method(method) => {
                match method.kind {
                    MethodKind::Getter => GETTER,
                    MethodKind::Setter => SETTER,
                    _ => METHOD,
                }
            }
            ClassMember::PrivateMethod(method) => {
                match method.kind {
                    MethodKind::Getter => GETTER,
                    MethodKind::Setter => SETTER,
                    _ => METHOD,
                }
            }
            _ => FIELD,
        }
    }

    fn transform_decorators(&self, decorators: &[Decorator]) -> (Expr, bool) {
        if decorators.is_empty() {
            return (ArrayLit { span: DUMMY_SP, elems: vec![] }.into(), false);
        }

        let decorator_exprs: Vec<Option<ExprOrSpread>> = decorators
            .iter()
            .map(|decorator| Some(decorator.expr.clone().into()))
            .collect();

        (
            ArrayLit {
                span: DUMMY_SP,
                elems: decorator_exprs,
            }
            .into(),
            false, // For simplicity, assuming no "this" context for now
        )
    }

    fn transform_accessor(&mut self, accessor: AutoAccessor) -> Vec<ClassMember> {
        let key = match &accessor.key {
            Key::Public(prop_name) => prop_name.clone(),
            Key::Private(private_name) => PropName::Ident(private_name.name.clone().into()),
        };
        
        let is_static = accessor.is_static;
        let value = accessor.value.clone();
        
        // Create a private field to store the value
        let private_key = if let PropName::Ident(ident) = &key {
            PrivateName {
                span: ident.span,
                name: format!("__{}", ident.sym).into(),
            }
        } else {
            self.accessor_counter += 1;
            PrivateName {
                span: accessor.span,
                name: format!("__accessor{}", self.accessor_counter).into(),
            }
        };
        
        let mut members = Vec::new();
        
        // Add private field
        members.push(ClassMember::PrivateProp(PrivateProp {
            span: accessor.span,
            ctxt: SyntaxContext::empty(),
            key: private_key.clone(),
            value,
            type_ann: None,
            is_static,
            decorators: Vec::new(),
            accessibility: None,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        }));
        
        // Add getter
        members.push(ClassMember::Method(ClassMethod {
            span: accessor.span,
            key: key.clone(),
            function: Box::new(Function {
                params: Vec::new(),
                decorators: Vec::new(),
                span: accessor.span,
                ctxt: SyntaxContext::empty(),
                body: Some(BlockStmt {
                    span: accessor.span,
                    ctxt: SyntaxContext::empty(),
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: accessor.span,
                        arg: Some(Box::new(Expr::Member(MemberExpr {
                            span: accessor.span,
                            obj: Box::new(Expr::This(ThisExpr { span: accessor.span })),
                            prop: MemberProp::PrivateName(private_key.clone()),
                        }))),
                    })],
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            }),
            kind: MethodKind::Getter,
            is_static,
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
        }));
        
        // Add setter
        members.push(ClassMember::Method(ClassMethod {
            span: accessor.span,
            key: key.clone(),
            function: Box::new(Function {
                params: vec![Param {
                    span: accessor.span,
                    decorators: Vec::new(),
                    pat: Pat::Ident(BindingIdent {
                        id: Ident::new("value".into(), accessor.span, SyntaxContext::empty()),
                        type_ann: None,
                    }),
                }],
                decorators: Vec::new(),
                span: accessor.span,
                ctxt: SyntaxContext::empty(),
                body: Some(BlockStmt {
                    span: accessor.span,
                    ctxt: SyntaxContext::empty(),
                    stmts: vec![Stmt::Expr(ExprStmt {
                        span: accessor.span,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span: accessor.span,
                            op: AssignOp::Assign,
                            left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                span: accessor.span,
                                obj: Box::new(Expr::This(ThisExpr { span: accessor.span })),
                                prop: MemberProp::PrivateName(private_key),
                            })),
                            right: Box::new(Expr::Ident(Ident::new("value".into(), accessor.span, SyntaxContext::empty()))),
                        })),
                    })],
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            }),
            kind: MethodKind::Setter,
            is_static,
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
        }));
        
        members
    }

    fn create_apply_decs_call(&self, element_locals: Vec<Ident>, class_locals: Vec<Ident>, element_decorations: Expr, class_decorations: Expr) -> Stmt {
        let helper_name = match self.version {
            DecoratorVersion::V202203 => helper!(apply_decs_2203_r),
            DecoratorVersion::V202311 => helper!(apply_decs_2311), 
            _ => helper!(apply_decs_2203_r), // fallback
        };

        // Create destructuring assignment for locals
        let lhs = if !element_locals.is_empty() && !class_locals.is_empty() {
            // { e: [element_locals], c: [class_locals] } = helper(...)
            ObjectPat {
                span: DUMMY_SP,
                props: vec![
                    ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: PropName::Ident("e".into()),
                        value: Box::new(ArrayPat {
                            span: DUMMY_SP,
                            elems: element_locals.into_iter().map(|id| Some(id.into())).collect(),
                            optional: false,
                            type_ann: None,
                        }.into()),
                    }),
                    ObjectPatProp::KeyValue(KeyValuePatProp {
                        key: PropName::Ident("c".into()),
                        value: Box::new(ArrayPat {
                            span: DUMMY_SP,
                            elems: class_locals.into_iter().map(|id| Some(id.into())).collect(),
                            optional: false,
                            type_ann: None,
                        }.into()),
                    }),
                ],
                optional: false,
                type_ann: None,
            }.into()
        } else if !element_locals.is_empty() {
            ArrayPat {
                span: DUMMY_SP,
                elems: element_locals.into_iter().map(|id| Some(id.into())).collect(),
                optional: false,
                type_ann: None,
            }.into()
        } else {
            ArrayPat {
                span: DUMMY_SP,
                elems: class_locals.into_iter().map(|id| Some(id.into())).collect(),
                optional: false,
                type_ann: None,
            }.into()
        };

        let rhs = CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: helper_name,
            args: vec![
                ThisExpr { span: DUMMY_SP }.as_arg(),
                element_decorations.as_arg(),  // element decorations first
                class_decorations.as_arg(),    // class decorations second
            ],
            type_args: None,
        };

        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left: AssignTarget::Pat(lhs),
                right: Box::new(rhs.into()),
            })),
        })
    }
}

impl ApplyDecsPass {
    fn collect_decorator_variables(&self, class: &Class) -> Vec<Ident> {
        let mut vars = Vec::new();
        
        // Collect element variables
        for member in &class.body {
            match member {
                ClassMember::ClassProp(prop) if !prop.decorators.is_empty() => {
                    let init_id = match &prop.key {
                        PropName::Ident(ident) => self.generate_unique_ident(&format!("_init_{}", ident.sym)),
                        _ => self.generate_unique_ident("_init_field"),
                    };
                    vars.push(init_id);
                }
                ClassMember::AutoAccessor(accessor) if !accessor.decorators.is_empty() => {
                    let init_id = match &accessor.key {
                        Key::Public(PropName::Ident(ident)) => self.generate_unique_ident(&format!("_init_{}", ident.sym)),
                        Key::Private(private_name) => self.generate_unique_ident(&format!("_init_{}", private_name.name)),
                        _ => self.generate_unique_ident("_init_accessor"),
                    };
                    vars.push(init_id);
                }
                _ => {}
            }
        }
        
        // Collect class variables
        if !class.decorators.is_empty() {
            // Add class variable for class replacement (like _C)
            vars.push(self.generate_unique_ident("_C"));
            vars.push(self.generate_unique_ident("_initClass"));
        }
        
        vars
    }
}

impl Fold for ApplyDecsPass {
    noop_fold_type!();

    fn fold_module(&mut self, mut module: Module) -> Module {
        let mut element_vars = Vec::new();
        let mut class_vars = Vec::new();
        let mut class_replacement_vars = Vec::new();
        
        // First pass: collect all decorator variables needed
        for item in &module.body {
            match item {
                ModuleItem::Stmt(Stmt::Decl(Decl::Class(class_decl))) => {
                    if has_decorators(&class_decl.class) || has_auto_accessors(&class_decl.class) {
                        // Collect element variables
                        for member in &class_decl.class.body {
                            match member {
                                ClassMember::ClassProp(prop) if !prop.decorators.is_empty() => {
                                    let init_id = match &prop.key {
                                        PropName::Ident(ident) => self.generate_unique_ident(&format!("_init_{}", ident.sym)),
                                        _ => self.generate_unique_ident("_init_field"),
                                    };
                                    element_vars.push(init_id);
                                }
                                ClassMember::AutoAccessor(accessor) if !accessor.decorators.is_empty() => {
                                    let init_id = match &accessor.key {
                                        Key::Public(PropName::Ident(ident)) => self.generate_unique_ident(&format!("_init_{}", ident.sym)),
                                        Key::Private(private_name) => self.generate_unique_ident(&format!("_init_{}", private_name.name)),
                                        _ => self.generate_unique_ident("_init_accessor"),
                                    };
                                    element_vars.push(init_id);
                                }
                                _ => {}
                            }
                        }
                        
                        // Collect class variables
                        if !class_decl.class.decorators.is_empty() {
                            class_replacement_vars.push(self.generate_unique_ident("_C"));
                            class_vars.push(self.generate_unique_ident("_initClass"));
                        }
                    }
                }
                _ => {}
            }
        }
        
        // Add variable declarations at the top if needed
        if !element_vars.is_empty() || !class_vars.is_empty() {
            // Add the main var declaration for element and class init vars (reverse order to match expected)
            let mut main_vars = class_vars;  // class vars first
            main_vars.extend(element_vars);  // then element vars
            
            if !main_vars.is_empty() {
                let var_decl = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: main_vars.into_iter().map(|id| VarDeclarator {
                        span: DUMMY_SP,
                        name: id.into(),
                        init: None,
                        definite: false,
                    }).collect(),
                })));
                
                module.body.insert(0, ModuleItem::Stmt(var_decl));
            }
        }
        
        // Transform the module normally
        let mut transformed_module = module.fold_children_with(self);
        
        // After transformation, add let declarations for class replacement vars just before the class
        if !class_replacement_vars.is_empty() {
            // Find the class declaration and insert let declaration before it
            for (i, item) in transformed_module.body.iter().enumerate() {
                if let ModuleItem::Stmt(Stmt::Decl(Decl::Class(_))) = item {
                    let let_decl = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                        span: DUMMY_SP,
                        ctxt: SyntaxContext::empty(),
                        kind: VarDeclKind::Let,
                        declare: false,
                        decls: class_replacement_vars.into_iter().map(|id| VarDeclarator {
                            span: DUMMY_SP,
                            name: id.into(),
                            init: None,
                            definite: false,
                        }).collect(),
                    })));
                    
                    transformed_module.body.insert(i, ModuleItem::Stmt(let_decl));
                    break;
                }
            }
        }
        
        transformed_module
    }

    fn fold_class(&mut self, mut class: Class) -> Class {
        if !has_decorators(&class) && !has_auto_accessors(&class) {
            return class;
        }

        let has_class_decorators = !class.decorators.is_empty();
        let class_decorators = class.decorators.clone();
        class.decorators = Vec::new();

        let mut decorator_infos = Vec::new();
        let mut new_members = Vec::new();
        let mut element_locals = Vec::new();
        let mut class_locals = Vec::new();

        // Process all class members
        for member in class.body {
            match member {
                ClassMember::AutoAccessor(accessor) => {
                    let has_decorators = !accessor.decorators.is_empty();
                    
                    if has_decorators {
                        let kind = ACCESSOR;
                        let is_static = accessor.is_static;
                        let (decorators_array, decorators_have_this) = self.transform_decorators(&accessor.decorators);
                        
                        let name = match &accessor.key {
                            Key::Public(PropName::Ident(ident)) => quote_str!(ident.sym.as_str()).into(),
                            Key::Private(private_name) => quote_str!(private_name.name.as_str()).into(),
                            _ => quote_str!("accessor").into(),
                        };

                        // Generate locals for accessor decorator
                        let init_id = self.generate_unique_ident(&format!("_init_{}", element_locals.len()));
                        let get_id = self.generate_unique_ident(&format!("_get_{}", element_locals.len()));
                        let set_id = self.generate_unique_ident(&format!("_set_{}", element_locals.len()));
                        element_locals.extend([init_id.clone(), get_id, set_id]);

                        decorator_infos.push(DecoratorInfo {
                            decorators_array,
                            decorators_have_this,
                            kind,
                            is_static,
                            name,
                            private_methods: None,
                            locals: vec![init_id],
                        });
                    }
                    
                    // Transform accessor to getter/setter regardless of decorators
                    new_members.extend(self.transform_accessor(accessor));
                }
                ClassMember::ClassProp(mut prop) => {
                    if !prop.decorators.is_empty() {
                        let kind = FIELD;
                        let is_static = prop.is_static;
                        let (decorators_array, decorators_have_this) = self.transform_decorators(&prop.decorators);
                        
                        let name = match &prop.key {
                            PropName::Ident(ident) => quote_str!(ident.sym.as_str()).into(),
                            _ => quote_str!("field").into(),
                        };

                        let init_id = match &prop.key {
                            PropName::Ident(ident) => self.generate_unique_ident(&format!("_init_{}", ident.sym)),
                            _ => self.generate_unique_ident(&format!("_init_{}", element_locals.len())),
                        };
                        element_locals.push(init_id.clone());

                        decorator_infos.push(DecoratorInfo {
                            decorators_array,
                            decorators_have_this,
                            kind,
                            is_static,
                            name,
                            private_methods: None,
                            locals: vec![init_id.clone()],
                        });
                        
                        prop.decorators = Vec::new();
                        
                        // Initialize the field with the init function
                        prop.value = Some(Box::new(Expr::Call(CallExpr {
                            span: prop.span,
                            ctxt: SyntaxContext::empty(),
                            callee: init_id.as_callee(),
                            args: vec![ThisExpr { span: prop.span }.as_arg()],
                            type_args: None,
                        })));
                    }
                    new_members.push(ClassMember::ClassProp(prop));
                }
                ClassMember::Method(mut method) => {
                    if !method.function.decorators.is_empty() {
                        let kind = self.get_element_kind(&ClassMember::Method(method.clone()));
                        let is_static = method.is_static;
                        let (decorators_array, decorators_have_this) = self.transform_decorators(&method.function.decorators);
                        
                        let name = match &method.key {
                            PropName::Ident(ident) => quote_str!(ident.sym.as_str()).into(),
                            _ => quote_str!("method").into(),
                        };

                        decorator_infos.push(DecoratorInfo {
                            decorators_array,
                            decorators_have_this,
                            kind,
                            is_static,
                            name,
                            private_methods: None,
                            locals: vec![],
                        });
                        
                        method.function.decorators = Vec::new();
                    }
                    new_members.push(ClassMember::Method(method));
                }
                ClassMember::PrivateMethod(mut method) => {
                    if !method.function.decorators.is_empty() {
                        let kind = self.get_element_kind(&ClassMember::PrivateMethod(method.clone()));
                        let is_static = method.is_static;
                        let (decorators_array, decorators_have_this) = self.transform_decorators(&method.function.decorators);
                        
                        let name = quote_str!(method.key.name.as_str()).into();

                        decorator_infos.push(DecoratorInfo {
                            decorators_array,
                            decorators_have_this,
                            kind,
                            is_static,
                            name,
                            private_methods: None,
                            locals: vec![],
                        });
                        
                        method.function.decorators = Vec::new();
                    }
                    new_members.push(ClassMember::PrivateMethod(method));
                }
                ClassMember::PrivateProp(mut prop) => {
                    if !prop.decorators.is_empty() {
                        let kind = FIELD;
                        let is_static = prop.is_static;
                        let (decorators_array, decorators_have_this) = self.transform_decorators(&prop.decorators);
                        
                        let name = quote_str!(prop.key.name.as_str()).into();

                        let init_id = self.generate_unique_ident(&format!("_init_{}", element_locals.len()));
                        element_locals.push(init_id.clone());

                        decorator_infos.push(DecoratorInfo {
                            decorators_array,
                            decorators_have_this,
                            kind,
                            is_static,
                            name,
                            private_methods: None,
                            locals: vec![init_id],
                        });
                        
                        prop.decorators = Vec::new();
                    }
                    new_members.push(ClassMember::PrivateProp(prop));
                }
                _ => {
                    new_members.push(member);
                }
            }
        }

        // Generate element decorations array
        let element_decorations = if decorator_infos.is_empty() {
            ArrayLit { span: DUMMY_SP, elems: vec![] }.into()
        } else {
            let decoration_elements: Vec<Option<ExprOrSpread>> = decorator_infos
                .iter()
                .map(|info| {
                    let mut flag = info.kind;
                    if info.is_static {
                        flag |= STATIC;
                    }
                    if info.decorators_have_this {
                        flag |= DECORATORS_HAVE_THIS;
                    }

                    Some(ArrayLit {
                        span: DUMMY_SP,
                        elems: {
                            let mut elems = vec![];
                            // Add decorator functions - flatten the array if it's a single decorator
                            if let Expr::Array(arr) = &info.decorators_array {
                                if arr.elems.len() == 1 {
                                    // Single decorator, add it directly
                                    if let Some(decorator) = &arr.elems[0] {
                                        elems.push(Some(decorator.expr.clone().into()));
                                    }
                                } else {
                                    // Multiple decorators, keep as array
                                    elems.push(Some(info.decorators_array.clone().into()));
                                }
                            } else {
                                elems.push(Some(info.decorators_array.clone().into()));
                            }
                            
                            elems.push(Some(Expr::Lit(Lit::Num(Number { span: DUMMY_SP, value: flag as f64, raw: None })).into()));
                            elems.push(Some(info.name.clone().into()));
                            elems
                        },
                    }.as_arg())
                })
                .collect();

            ArrayLit {
                span: DUMMY_SP,
                elems: decoration_elements,
            }.into()
        };

        // Generate class decorations
        let class_decorations = if has_class_decorators {
            let (decorators_array, _) = self.transform_decorators(&class_decorators);
            decorators_array
        } else {
            ArrayLit { span: DUMMY_SP, elems: vec![] }.into()
        };

        // Add class init local if we have class decorators
        if has_class_decorators {
            class_locals.push(self.generate_unique_ident("_C"));
            class_locals.push(self.generate_unique_ident("_initClass"));
        }

        // Add apply_decs call if we have any decorators
        if has_class_decorators || !decorator_infos.is_empty() {
            let apply_call = self.create_apply_decs_call(element_locals, class_locals.clone(), element_decorations, class_decorations);
            
            // Add static block with the apply_decs call
            new_members.insert(0, ClassMember::StaticBlock(StaticBlock {
                span: DUMMY_SP,
                body: BlockStmt {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    stmts: vec![apply_call],
                },
            }));
            
            // Add class initializer call if we have class decorators
            if has_class_decorators && class_locals.len() >= 2 {
                let init_class_call = Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        ctxt: SyntaxContext::empty(),
                        callee: class_locals[1].clone().as_callee(),  // Use _initClass (second variable)
                        args: vec![],
                        type_args: None,
                    })),
                });
                
                new_members.push(ClassMember::StaticBlock(StaticBlock {
                    span: DUMMY_SP,
                    body: BlockStmt {
                        span: DUMMY_SP,
                        ctxt: SyntaxContext::empty(),
                        stmts: vec![init_class_call],
                    },
                }));
            }
        }

        class.body = new_members;
        class
    }

    fn fold_decl(&mut self, decl: Decl) -> Decl {
        match decl {
            Decl::Class(ClassDecl {
                ident,
                declare: false,
                class,
            }) => {
                if !has_decorators(&class) && !has_auto_accessors(&class) {
                    return ClassDecl {
                        ident,
                        declare: false,
                        class,
                    }
                    .into();
                }

                let transformed_class = self.fold_class(*class);

                ClassDecl {
                    ident,
                    declare: false,
                    class: Box::new(transformed_class),
                }
                .into()
            }
            _ => decl.fold_children_with(self),
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Class(ClassExpr { ident, class }) => {
                if !has_decorators(&class) && !has_auto_accessors(&class) {
                    return ClassExpr { ident, class }.into();
                }

                let transformed_class = self.fold_class(*class);

                ClassExpr {
                    ident,
                    class: Box::new(transformed_class),
                }
                .into()
            }
            _ => expr.fold_children_with(self),
        }
    }
}

fn has_decorators(class: &Class) -> bool {
    if !class.decorators.is_empty() {
        return true;
    }

    for member in &class.body {
        match member {
            ClassMember::ClassProp(prop) if !prop.decorators.is_empty() => return true,
            ClassMember::Method(method) if !method.function.decorators.is_empty() => return true,
            ClassMember::PrivateMethod(method) if !method.function.decorators.is_empty() => {
                return true
            }
            ClassMember::PrivateProp(prop) if !prop.decorators.is_empty() => return true,
            ClassMember::AutoAccessor(accessor) if !accessor.decorators.is_empty() => return true,
            _ => {}
        }
    }

    false
}

fn has_auto_accessors(class: &Class) -> bool {
    for member in &class.body {
        if matches!(member, ClassMember::AutoAccessor(_)) {
            return true;
        }
    }
    false
}
