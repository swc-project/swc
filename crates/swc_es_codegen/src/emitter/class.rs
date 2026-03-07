use swc_es_ast::{ClassDecl, ClassMember, FunctionId, MethodKind, PropName};

use super::Emitter;
use crate::Result;

impl<W> Emitter<'_, W>
where
    W: crate::WriteJs,
{
    pub(super) fn emit_class_decl(&mut self, decl: &ClassDecl) -> Result {
        let class = self.class(decl.class).clone();
        self.emit_decorators(&class.decorators, true)?;
        self.keyword("class")?;
        self.write_space_pretty()?;
        self.emit_ident(&decl.ident)?;

        if let Some(super_class) = class.super_class {
            self.write_space_pretty()?;
            self.keyword("extends")?;
            self.write_space_pretty()?;
            self.emit_expr(super_class)?;
        }

        self.write_space_pretty()?;
        self.emit_class_body_members(&class.body)
    }

    pub(super) fn emit_class_expr(&mut self, class_id: swc_es_ast::ClassId) -> Result {
        let class = self.class(class_id).clone();

        self.emit_decorators(&class.decorators, true)?;
        self.keyword("class")?;

        if let Some(name) = &class.ident {
            self.write_space_pretty()?;
            self.emit_ident(name)?;
        }

        if let Some(super_class) = class.super_class {
            self.write_space_pretty()?;
            self.keyword("extends")?;
            self.write_space_pretty()?;
            self.emit_expr(super_class)?;
        }

        self.write_space_pretty()?;
        self.emit_class_body_members(&class.body)
    }

    fn emit_class_body_members(&mut self, members: &[swc_es_ast::ClassMemberId]) -> Result {
        self.punct("{")?;

        if !members.is_empty() {
            self.indent();
            self.write_line()?;
        }

        for (index, member) in members.iter().enumerate() {
            if index != 0 {
                self.write_line()?;
            }
            self.emit_class_member(*member)?;
        }

        if !members.is_empty() {
            self.dedent();
            self.write_line()?;
        }

        self.punct("}")
    }

    pub(super) fn emit_class_member(&mut self, member_id: swc_es_ast::ClassMemberId) -> Result {
        match self.class_member(member_id).clone() {
            ClassMember::Method(method) => {
                self.emit_decorators(&method.decorators, true)?;

                let function = self.function(method.function).clone();

                if method.is_static {
                    self.keyword("static")?;
                    self.write_space_pretty()?;
                }

                match method.kind {
                    MethodKind::Getter => {
                        self.keyword("get")?;
                        self.write_space_pretty()?;
                    }
                    MethodKind::Setter => {
                        self.keyword("set")?;
                        self.write_space_pretty()?;
                    }
                    MethodKind::Method | MethodKind::Constructor => {
                        if function.is_async {
                            self.keyword("async")?;
                            self.write_space_force()?;
                        }
                        if function.is_generator {
                            self.punct("*")?;
                        }
                    }
                }

                self.emit_prop_name_as_class_key(&method.key)?;
                self.emit_function_signature_and_body(method.function)
            }
            ClassMember::Prop(prop) => {
                self.emit_decorators(&prop.decorators, true)?;

                if prop.is_static {
                    self.keyword("static")?;
                    self.write_space_pretty()?;
                }

                self.emit_prop_name_as_class_key(&prop.key)?;

                if let Some(value) = prop.value {
                    self.write_space_pretty()?;
                    self.punct("=")?;
                    self.write_space_pretty()?;
                    self.emit_expr(value)?;
                }

                self.punct(";")
            }
            ClassMember::StaticBlock(block) => {
                self.keyword("static")?;
                self.write_space_pretty()?;
                self.emit_block_stmt_list(&block.body)
            }
        }
    }

    pub(super) fn emit_function_expr(&mut self, function_id: FunctionId) -> Result {
        let function = self.function(function_id).clone();

        if function.is_async {
            self.keyword("async")?;
            self.write_space_force()?;
        }

        self.keyword("function")?;

        if function.is_generator {
            self.punct("*")?;
        }

        self.emit_function_signature_and_body(function_id)
    }

    pub(super) fn emit_function_signature_and_body(&mut self, function_id: FunctionId) -> Result {
        let function = self.function(function_id).clone();

        self.punct("(")?;
        for (index, param) in function.params.iter().enumerate() {
            if index != 0 {
                self.punct(",")?;
                self.write_space_pretty()?;
            }
            self.emit_decorators(&param.decorators, false)?;
            self.emit_pat(param.pat)?;
        }
        self.punct(")")?;
        self.write_space_pretty()?;

        self.emit_block_stmt_list(&function.body)
    }

    fn emit_prop_name_as_class_key(&mut self, key: &PropName) -> Result {
        match key {
            PropName::Computed(expr) => {
                self.punct("[")?;
                self.emit_expr(*expr)?;
                self.punct("]")
            }
            _ => self.emit_prop_name(key),
        }
    }

    pub(super) fn emit_decorators(
        &mut self,
        decorators: &[swc_es_ast::Decorator],
        end_with_gap: bool,
    ) -> Result {
        if decorators.is_empty() {
            return Ok(());
        }

        for (index, decorator) in decorators.iter().enumerate() {
            self.punct("@")?;
            self.emit_expr(decorator.expr)?;

            if index + 1 != decorators.len() {
                if self.cfg.minify {
                    self.write_space_force()?;
                } else {
                    self.write_line()?;
                }
            }
        }

        if end_with_gap {
            if self.cfg.minify {
                self.write_space_force()?;
            } else {
                self.write_line()?;
            }
        }

        Ok(())
    }
}
