use crate::util::ExprExt;
use swc_ecma_ast::*;

/// Lives at here to prevent mistakes.
#[derive(Debug)]
pub(super) struct VarInfo {
    /// Declared / assigned scope, not stored scope.
    scope_id: usize,
    /// Count of usage.
    pub usage: u16,
    /// The number of assignment except variable initialization.
    pub assign: u16,
    no_inline: bool,
    needed: bool,
    ///
    ///   - Analysis phase: None
    ///   - Storage phase: None -> Some()
    ///   - Inlining phase: None iff inlined.
    value: Option<Expr>,
}

impl VarInfo {
    pub fn can_be_removed(&self) -> bool {
        self.assign == 0
            && self.usage == 0
            && !self.needed
            && ({
                // Inlined
                self.value.is_none()
            } || {
                // Safely removable
                !self.value.as_ref().unwrap().may_have_side_effects()
            })
    }

    pub fn mark_as_needed(&mut self) {
        self.needed = true;
    }

    pub const fn new(scope_id: usize) -> Self {
        VarInfo {
            scope_id,
            usage: 0,
            assign: 0,
            no_inline: false,
            needed: false,
            value: None,
        }
    }

    pub const fn scope_id(&self) -> usize {
        self.scope_id
    }

    pub fn take_value(&mut self) -> Option<Expr> {
        println!("VarInfo.take_value()");

        self.value.take()
    }

    pub fn set_value(&mut self, e: Expr) {
        match e {
            Expr::Invalid(..) => unreachable!(),
            _ => {}
        }

        self.value = Some(e)
    }

    pub fn prevent_inline(&mut self) {
        self.no_inline = true;
    }

    pub const fn no_inline(&self) -> bool {
        self.no_inline
    }

    pub fn value(&self) -> Option<&Expr> {
        self.value.as_ref()
    }
}
