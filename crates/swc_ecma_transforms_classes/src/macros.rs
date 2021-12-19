/// Not intended for public use.
#[macro_export]
macro_rules! visit_mut_only_key {
    () => {
        fn visit_mut_class_member(&mut self, m: &mut ClassMember) {
            match m {
                ClassMember::Method(m) => m.key.visit_mut_with(self),
                ClassMember::PrivateMethod(m) => m.key.visit_mut_with(self),
                ClassMember::ClassProp(m) => m.key.visit_mut_with(self),
                ClassMember::PrivateProp(m) => m.key.visit_mut_with(self),
                _ => {}
            }
        }
    };
}
