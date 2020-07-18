macro_rules! fold_only_key {
    ($T:tt) => {
        impl<'a> Fold for $T<'a> {
            fn fold(&mut self, m: ClassMember) -> ClassMember {
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
        }
    };
}
