/// Not intended for public use.
#[macro_export]
macro_rules! fold_only_key {
    () => {
        fn fold_class_member(&mut self, m: ClassMember) -> ClassMember {
            match m {
                ClassMember::Method(m) => ClassMember::Method(ClassMethod {
                    key: m.key.fold_with(self),
                    ..m
                }),
                ClassMember::PrivateMethod(m) => ClassMember::PrivateMethod(PrivateMethod {
                    key: m.key.fold_with(self),
                    ..m
                }),
                ClassMember::ClassProp(p) => ClassMember::ClassProp(ClassProp {
                    key: p.key.fold_with(self),
                    ..p
                }),
                ClassMember::PrivateProp(p) => ClassMember::PrivateProp(PrivateProp {
                    key: p.key.fold_with(self),
                    ..p
                }),
                _ => m,
            }
        }
    };
}
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
