use crate::analyzer::Analyzer;
use swc_ecma_ast::*;

impl Analyzer<'_, '_> {
    /// This method ignores order of class properties or parameter properties.
    /// So the length of returned vector can be smaller than length of
    /// `members`.
    ///
    /// Note that the boey constructor is analyzed.
    pub(super) fn calc_order_of_class_methods(&mut self, members: &[ClassMember]) -> Vec<usize> {
        let mut order = vec![];

        for (index, member) in members.iter().enumerate() {
            match member {
                ClassMember::Constructor(_) => {}
                ClassMember::Method(_) => {}
                ClassMember::PrivateMethod(_) => {}

                ClassMember::TsIndexSignature(_) => {}

                ClassMember::ClassProp(_) | ClassMember::PrivateProp(_) | ClassMember::Empty(_) => {
                    continue
                }
            }
        }

        order
    }
}

struct DependencyFinder {}
