//! A module to validate while type checking

use crate::ty::{Ref, Type};
use backtrace::Backtrace;
use swc_common::{Visit, VisitWith};

pub mod duplicate;

/// Ensures that `ty` does not **contain** [Type::Ref].
pub fn assert_no_ref(ty: &Type) {
    struct Visitor {
        found: bool,
    }
    impl Visit<Ref> for Visitor {
        fn visit(&mut self, _: &Ref) {
            self.found = true;
        }
    }

    let mut v = Visitor { found: false };
    ty.visit_with(&mut v);
    if v.found {
        print_backtrace();
        unreachable!("A type ({:#?}) should not contain unresolved reference", ty)
    }
}

pub fn print_backtrace() {
    let bt = Backtrace::new();
    let bt = filter(bt);

    println!("{:?}", bt);
}

fn filter(mut bt: Backtrace) -> Backtrace {
    bt.resolve();
    let mut frames: Vec<_> = bt.into();
    let mut done = false;

    frames.retain(|frame| {
        if done {
            return false;
        }

        let symbols = frame.symbols();
        let len = symbols.len();
        for symbol in symbols {
            let name = if let Some(name) = symbol.name().and_then(|s| s.as_str()) {
                name
            } else {
                return false;
            };

            if let Some(filename) = symbol.filename() {
                let s = filename.to_string_lossy();

                if s.contains("backtrace")
                    || s.contains("libcore")
                    || s.contains("libstd")
                    || s.contains("/libtest/")
                    || s.contains("/rustc/")
                    || s.contains("libpanic_unwind/")
                {
                    return false;
                }

                if len == 1 {
                    if s.contains("scoped-tls") {}

                    if s.contains("/ast/") {
                        return false;
                    }

                    if s.contains("common") && s.ends_with("/fold.rs") {
                        return false;
                    }

                    if s.contains("checker") && s.ends_with("/validator.rs") {
                        return false;
                    }
                }

                //                println!("({}) Filename: {}", len, s);
            }

            if name.contains("Module") {
                done = true;
                // Last one
                return true;
            }
        }

        true
    });

    frames.into()
}
