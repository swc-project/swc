use swc_es_ast::{
    ClassDecl, ClassMember, Decl, FnDecl, Function, MethodKind, PropName, TsEnumMemberName,
    TsModuleName, TsNamespaceBody, VarDecl,
};

use super::{EmitResult, Emitter};

impl Emitter<'_> {
    pub(super) fn emit_decl_stmt(&mut self, id: swc_es_ast::DeclId) -> EmitResult {
        let store = self.store;
        let decl = Self::get_decl(store, id)?;
        match decl {
            Decl::Var(var) => self.emit_var_decl(var, true),
            Decl::Fn(fun) => self.emit_fn_decl(fun),
            Decl::Class(class_decl) => self.emit_class_decl(class_decl),
            Decl::TsTypeAlias(alias) => {
                if alias.declare {
                    self.out.push_str("declare ");
                }
                self.out.push_str("type ");
                self.write_ident_sym(&alias.ident.sym);
                self.emit_type_params(&alias.type_params)?;
                self.out.push_str(" = ");
                self.emit_ts_type(alias.ty)?;
                self.out.push_byte(b';');
                Ok(())
            }
            Decl::TsInterface(interface) => {
                if interface.declare {
                    self.out.push_str("declare ");
                }
                self.out.push_str("interface ");
                self.write_ident_sym(&interface.ident.sym);
                self.emit_type_params(&interface.type_params)?;
                if !interface.extends.is_empty() {
                    self.out.push_str(" extends ");
                    for (idx, item) in interface.extends.iter().enumerate() {
                        if idx != 0 {
                            self.out.push_byte(b',');
                        }
                        self.write_ident_sym(&item.sym);
                    }
                }
                self.out.push_byte(b'{');
                for member in &interface.body {
                    self.emit_ts_type_member(member)?;
                }
                self.out.push_byte(b'}');
                Ok(())
            }
            Decl::TsEnum(en) => {
                if en.declare {
                    self.out.push_str("declare ");
                }
                if en.is_const {
                    self.out.push_str("const ");
                }
                self.out.push_str("enum ");
                self.write_ident_sym(&en.ident.sym);
                self.out.push_byte(b'{');
                for (idx, member) in en.members.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    match &member.name {
                        TsEnumMemberName::Ident(ident) => self.write_ident_sym(&ident.sym),
                        TsEnumMemberName::Str(lit) => self.out.write_js_string(lit.value.as_ref()),
                        TsEnumMemberName::Num(lit) => self.out.write_number(lit.value),
                    }
                    if let Some(init) = member.init {
                        self.out.push_byte(b'=');
                        self.emit_expr(init, 0)?;
                    }
                }
                self.out.push_byte(b'}');
                Ok(())
            }
            Decl::TsModule(module_decl) => {
                if module_decl.declare {
                    self.out.push_str("declare ");
                }
                if module_decl.global {
                    self.out.push_str("global ");
                }
                if module_decl.namespace {
                    self.out.push_str("namespace ");
                } else {
                    self.out.push_str("module ");
                }
                match &module_decl.id {
                    TsModuleName::Ident(ident) => self.write_ident_sym(&ident.sym),
                    TsModuleName::Str(lit) => self.out.write_js_string(lit.value.as_ref()),
                }

                match &module_decl.body {
                    Some(body) => {
                        if let (TsModuleName::Ident(root), TsNamespaceBody::Namespace(ns)) =
                            (&module_decl.id, body)
                        {
                            if ns.id.sym == root.sym {
                                return self.emit_ts_namespace_body(&ns.body);
                            }
                        }
                        self.emit_ts_namespace_body(body)
                    }
                    None => {
                        self.out.push_byte(b';');
                        Ok(())
                    }
                }
            }
        }
    }

    pub(super) fn emit_var_decl(&mut self, var: &VarDecl, trailing_semi: bool) -> EmitResult {
        if var.declare {
            self.out.push_str("declare ");
        }
        match var.kind {
            swc_es_ast::VarDeclKind::Var => self.out.push_str("var "),
            swc_es_ast::VarDeclKind::Let => self.out.push_str("let "),
            swc_es_ast::VarDeclKind::Const => self.out.push_str("const "),
            swc_es_ast::VarDeclKind::Using => self.out.push_str("using "),
            swc_es_ast::VarDeclKind::AwaitUsing => self.out.push_str("await using "),
        }

        for (idx, declarator) in var.declarators.iter().enumerate() {
            if idx != 0 {
                self.out.push_byte(b',');
            }
            self.emit_pat(declarator.name)?;
            if let Some(init) = declarator.init {
                self.out.push_byte(b'=');
                self.emit_expr(init, 0)?;
            }
        }

        if trailing_semi {
            self.out.push_byte(b';');
        }

        Ok(())
    }

    fn emit_fn_decl(&mut self, fun: &FnDecl) -> EmitResult {
        if fun.declare {
            self.out.push_str("declare ");
        }
        self.out.push_str("function ");
        self.write_ident_sym(&fun.ident.sym);
        self.out.push_byte(b'(');
        for (idx, param) in fun.params.iter().enumerate() {
            if idx != 0 {
                self.out.push_byte(b',');
            }
            self.emit_pat(*param)?;
        }
        self.out.push_byte(b')');
        self.emit_block_stmts(&fun.body)
    }

    fn emit_class_decl(&mut self, class_decl: &ClassDecl) -> EmitResult {
        self.emit_class_with_name(class_decl.class, Some(&class_decl.ident.sym))
    }

    pub(super) fn emit_class_with_name(
        &mut self,
        class_id: swc_es_ast::ClassId,
        explicit_name: Option<&swc_atoms::Atom>,
    ) -> EmitResult {
        let store = self.store;
        let class = Self::get_class(store, class_id)?;

        for decorator in &class.decorators {
            self.out.push_byte(b'@');
            self.emit_expr(decorator.expr, 0)?;
            self.out.push_byte(b' ');
        }

        self.out.push_str("class");
        if let Some(name) = explicit_name {
            self.out.push_byte(b' ');
            self.write_ident_sym(name);
        } else if let Some(ident) = &class.ident {
            self.out.push_byte(b' ');
            self.write_ident_sym(&ident.sym);
        }

        if let Some(super_class) = class.super_class {
            self.out.push_str(" extends ");
            self.emit_expr(super_class, 0)?;
        }

        self.out.push_byte(b'{');
        for member_id in &class.body {
            self.emit_class_member(*member_id)?;
        }
        self.out.push_byte(b'}');
        Ok(())
    }

    pub(super) fn emit_class_member(&mut self, id: swc_es_ast::ClassMemberId) -> EmitResult {
        let store = self.store;
        let member = Self::get_class_member(store, id)?;

        match member {
            ClassMember::Method(method) => {
                for decorator in &method.decorators {
                    self.out.push_byte(b'@');
                    self.emit_expr(decorator.expr, 0)?;
                    self.out.push_byte(b' ');
                }
                if method.is_static {
                    self.out.push_str("static ");
                }

                let function = Self::get_function(store, method.function)?;
                match method.kind {
                    MethodKind::Getter => {
                        self.out.push_str("get ");
                        self.emit_prop_name(&method.key)?;
                    }
                    MethodKind::Setter => {
                        self.out.push_str("set ");
                        self.emit_prop_name(&method.key)?;
                    }
                    MethodKind::Constructor => {
                        self.emit_prop_name(&method.key)?;
                    }
                    MethodKind::Method => {
                        if function.is_async {
                            self.out.push_str("async ");
                        }
                        if function.is_generator {
                            self.out.push_byte(b'*');
                        }
                        self.emit_prop_name(&method.key)?;
                    }
                }
                self.emit_function_params(function)?;
                self.emit_block_stmts(&function.body)
            }
            ClassMember::Prop(prop) => {
                for decorator in &prop.decorators {
                    self.out.push_byte(b'@');
                    self.emit_expr(decorator.expr, 0)?;
                    self.out.push_byte(b' ');
                }
                if prop.is_static {
                    self.out.push_str("static ");
                }
                self.emit_prop_name(&prop.key)?;
                if let Some(value) = prop.value {
                    self.out.push_byte(b'=');
                    self.emit_expr(value, 0)?;
                }
                self.out.push_byte(b';');
                Ok(())
            }
            ClassMember::StaticBlock(block) => {
                self.out.push_str("static");
                self.emit_block_stmts(&block.body)
            }
        }
    }

    fn emit_function_params(&mut self, function: &Function) -> EmitResult {
        self.out.push_byte(b'(');
        for (idx, param) in function.params.iter().enumerate() {
            if idx != 0 {
                self.out.push_byte(b',');
            }
            for decorator in &param.decorators {
                self.out.push_byte(b'@');
                self.emit_expr(decorator.expr, 0)?;
                self.out.push_byte(b' ');
            }
            self.emit_pat(param.pat)?;
        }
        self.out.push_byte(b')');
        Ok(())
    }

    pub(super) fn emit_prop_name(&mut self, prop: &PropName) -> EmitResult {
        match prop {
            PropName::Ident(ident) => self.write_ident_sym(&ident.sym),
            PropName::Private(ident) => self.write_private_ident_sym(&ident.sym),
            PropName::Str(lit) => self.out.write_js_string(lit.value.as_ref()),
            PropName::Num(lit) => self.out.write_number(lit.value),
            PropName::Computed(expr) => {
                self.out.push_byte(b'[');
                self.emit_expr(*expr, 0)?;
                self.out.push_byte(b']');
            }
        }
        Ok(())
    }

    pub(super) fn emit_type_params(&mut self, params: &[swc_es_ast::Ident]) -> EmitResult {
        if params.is_empty() {
            return Ok(());
        }

        self.out.push_byte(b'<');
        for (idx, param) in params.iter().enumerate() {
            if idx != 0 {
                self.out.push_byte(b',');
            }
            self.write_ident_sym(&param.sym);
        }
        self.out.push_byte(b'>');
        Ok(())
    }

    pub(super) fn emit_decl_for_export_default(&mut self, id: swc_es_ast::DeclId) -> EmitResult {
        let store = self.store;
        match Self::get_decl(store, id)? {
            Decl::Fn(fun) => {
                self.out.push_str("function ");
                self.write_ident_sym(&fun.ident.sym);
                self.out.push_byte(b'(');
                for (idx, param) in fun.params.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_pat(*param)?;
                }
                self.out.push_byte(b')');
                self.emit_block_stmts(&fun.body)
            }
            Decl::Class(class_decl) => {
                self.emit_class_with_name(class_decl.class, Some(&class_decl.ident.sym))
            }
            _ => Err(Self::invalid_ast(
                "export default declaration must be function or class",
            )),
        }
    }

    fn emit_ts_namespace_body(&mut self, body: &TsNamespaceBody) -> EmitResult {
        match body {
            TsNamespaceBody::ModuleBlock(stmts) => self.emit_block_stmts(stmts),
            TsNamespaceBody::Namespace(ns) => {
                self.out.push_byte(b'.');
                self.write_ident_sym(&ns.id.sym);
                self.emit_ts_namespace_body(&ns.body)
            }
        }
    }

    pub(super) fn emit_module_item_decl(&mut self, decl: swc_es_ast::DeclId) -> EmitResult {
        let store = self.store;
        match Self::get_decl(store, decl)? {
            Decl::Var(var) => self.emit_var_decl(var, true),
            Decl::Fn(fun) => self.emit_fn_decl(fun),
            Decl::Class(class_decl) => self.emit_class_decl(class_decl),
            Decl::TsTypeAlias(_) | Decl::TsInterface(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {
                self.emit_decl_stmt(decl)
            }
        }
    }
}
