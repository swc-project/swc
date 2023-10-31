use std::ops::{Deref, Shl};

use node_types::Proxy;
use swc_atoms::Atom;
use swc_ecma_ast::Program;

use crate::data::Data;
pub use crate::{expr::*, module::*, option::OptionalNode, traits::*, vec::VecNode};
#[macro_use]
mod macros;
mod data;
mod expr;
mod module;
mod node_types;
mod option;
mod traits;
mod vec;

#[derive(Clone)]
pub struct ProgramNode {
    data: Data<'static, Program>,
}

impl ProgramNode {
    pub fn new(root: Program) -> Proxy<'static, Self> {
        let data = Data::<Program>::new_root(root);
        Proxy::new(Self {
            data: Data::<Program>::new_root(root),
        })
    }

    /// This will panic if the program is not a module.
    pub fn as_module(&self) -> Proxy<ModuleNode> {
        let data = self.data.map(
            |program| program.as_module().unwrap(),
            |program| program.as_mut_module().unwrap(),
        );
        ModuleNode(data)
    }
}

impl AstProxyNode for ProgramNode {
    type AstNode = Program;
}

#[derive(Clone)]
pub struct BindingRef {
    sym: Atom,
}
