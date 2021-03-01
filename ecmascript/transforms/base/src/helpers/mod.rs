use once_cell::sync::Lazy;
use scoped_tls::scoped_thread_local;
use std::sync::atomic::{AtomicBool, Ordering};
use swc_common::{FileName, FilePathMapping, Mark, SourceMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_ecma_utils::{prepend_stmts, quote_ident, quote_str, DropSpan};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

#[macro_export]
macro_rules! enable_helper {
    ($i:ident) => {{
        $crate::helpers::HELPERS.with(|helpers| {
            helpers.$i();
            helpers.mark()
        })
    }};
}

macro_rules! add_to {
    ($buf:expr, $name:ident, $b:expr, $mark:expr) => {{
        static STMTS: Lazy<Vec<Stmt>> = Lazy::new(|| {
            let cm = SourceMap::new(FilePathMapping::empty());
            let code = include_str!(concat!("./_", stringify!($name), ".js"));
            let fm = cm.new_source_file(FileName::Custom(stringify!($name).into()), code.into());
            let lexer = Lexer::new(
                Default::default(),
                Default::default(),
                StringInput::from(&*fm),
                None,
            );
            let stmts = Parser::new_from(lexer)
                .parse_script()
                .map(|mut script| {
                    script.body.visit_mut_with(&mut DropSpan {
                        preserve_ctxt: false,
                    });
                    script.body
                })
                .map_err(|e| {
                    unreachable!("Error occurred while parsing error: {:?}", e);
                })
                .unwrap();
            stmts
        });

        let enable = $b.load(Ordering::Relaxed);
        if enable {
            $buf.extend(
                STMTS
                    .iter()
                    .cloned()
                    .map(|mut stmt| {
                        stmt.visit_mut_with(&mut Marker($mark));
                        stmt
                    })
                    .map(ModuleItem::Stmt),
            )
        }
    }};
}

scoped_thread_local!(pub static HELPERS: Helpers);

/// Tracks used helper methods. (e.g. __extends)
#[derive(Debug, Default)]
pub struct Helpers {
    external: bool,
    mark: HelperMark,
    inner: Inner,
}

impl Helpers {
    pub fn new(external: bool) -> Self {
        Helpers {
            external,
            mark: Default::default(),
            inner: Default::default(),
        }
    }

    pub const fn mark(&self) -> Mark {
        self.mark.0
    }
    pub const fn external(&self) -> bool {
        self.external
    }
}

#[derive(Debug, Clone, Copy)]
struct HelperMark(Mark);
impl Default for HelperMark {
    fn default() -> Self {
        HelperMark(Mark::fresh(Mark::root()))
    }
}

macro_rules! define_helpers {
    (
        Helpers {
            $( $name:ident : ( $( $dep:ident ),* ), )*
        }
    ) => {
        #[derive(Debug,Default)]
        struct Inner {
            $( $name: AtomicBool, )*
        }

        impl Helpers {
            $(
                pub fn $name(&self) {
                    self.inner.$name.store(true, Ordering::Relaxed);

                    $(
                        self.$dep();
                    )*
                }
            )*
        }

        impl Helpers {
            pub fn extend_from(&self, other: &Self) {
                $(
                    if other.inner.$name.load(Ordering::SeqCst) {
                        self.inner.$name.store(true, Ordering::Relaxed);
                    }
                )*
            }
        }

        impl InjectHelpers {
            fn is_helper_used(&self) -> bool{
                let mut value = false;

                HELPERS.with(|helpers|{
                    $(
                        value |= helpers.inner.$name.load(Ordering::Relaxed);
                    )*
                });

                value
            }

            fn build_helpers(&self) -> Vec<ModuleItem> {
                let mut buf = vec![];

                HELPERS.with(|helpers|{
                    debug_assert!(!helpers.external);
                    $(
                            add_to!(buf, $name, helpers.inner.$name, helpers.mark.0);
                    )*
                });

                buf
            }
        }
    };
}

define_helpers!(Helpers {
    apply_decorated_descriptor: (),
    array_with_holes: (),
    array_without_holes: (),
    assert_this_initialized: (),
    async_generator: (await_value),
    async_generator_delegate: (),
    async_iterator: (),
    async_to_generator: (),
    await_async_generator: (await_value),
    await_value: (),
    class_call_check: (),
    class_name_tdz_error: (),
    class_private_field_get: (),
    class_private_field_loose_base: (),
    // class_private_field_loose_key: (),
    class_private_field_set: (),
    class_private_method_get: (),
    class_private_method_set: (),
    class_static_private_field_spec_get: (),
    class_static_private_field_spec_set: (),
    construct: (set_prototype_of),
    create_class: (),
    decorate: (to_array, to_property_key),
    defaults: (),
    define_enumerable_properties: (),
    define_property: (),
    extends: (),
    get: (super_prop_base),
    get_prototype_of: (),
    inherits: (set_prototype_of),
    inherits_loose: (),
    initializer_define_property: (),
    initializer_warning_helper: (),
    instanceof: (),
    interop_require_default: (),
    interop_require_wildcard: (),
    is_native_function: (),
    iterable_to_array: (),
    iterable_to_array_limit: (),
    iterable_to_array_limit_loose: (),
    jsx: (),
    new_arrow_check: (),
    non_iterable_rest: (),
    non_iterable_spread: (),
    object_spread: (define_property),
    object_without_properties: (object_without_properties_loose),
    object_without_properties_loose: (),
    possible_constructor_return: (type_of, assert_this_initialized),
    read_only_error: (),
    set: (super_prop_base, define_property),
    set_prototype_of: (),
    skip_first_generator_next: (),
    sliced_to_array: (array_with_holes, iterable_to_array_limit, non_iterable_rest),
    sliced_to_array_loose: (
        array_with_holes,
        iterable_to_array_limit_loose,
        non_iterable_rest
    ),
    super_prop_base: (get_prototype_of),
    tagged_template_literal: (),
    tagged_template_literal_loose: (),
    // temporal_ref: (temporal_undefined),
    // temporal_undefined: (),
    throw: (),
    to_array: (array_with_holes, iterable_to_array, non_iterable_rest),
    to_consumable_array: (array_without_holes, iterable_to_array, non_iterable_spread),
    to_primitive: (type_of),
    to_property_key: (type_of, to_primitive),
    type_of: (),
    wrap_async_generator: (async_generator),
    wrap_native_super: (
        construct,
        get_prototype_of,
        set_prototype_of,
        is_native_function
    ),

    class_private_field_destructure: (),
});

pub fn inject_helpers() -> impl Fold {
    as_folder(InjectHelpers)
}

struct InjectHelpers;

impl InjectHelpers {
    fn mk_helpers(&self) -> Vec<ModuleItem> {
        let (mark, external) = HELPERS.with(|helper| (helper.mark(), helper.external()));
        if external {
            if self.is_helper_used() {
                vec![ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span: DUMMY_SP,
                    specifiers: vec![ImportSpecifier::Namespace(ImportStarAsSpecifier {
                        span: DUMMY_SP,
                        local: quote_ident!(DUMMY_SP.apply_mark(mark), "swcHelpers"),
                    })],
                    src: quote_str!("@swc/helpers"),
                    type_only: false,
                    asserts: None,
                }))]
            } else {
                vec![]
            }
        } else {
            self.build_helpers()
        }
    }
}

impl VisitMut for InjectHelpers {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        let helpers = self.mk_helpers();

        prepend_stmts(&mut module.body, helpers.into_iter());
    }
}

struct Marker(Mark);

impl VisitMut for Marker {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        i.span = i.span.apply_mark(self.0);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::pass::noop;
    use swc_ecma_visit::{as_folder, FoldWith};

    #[test]
    fn external_helper() {
        let input = "_throw()
swcHelpers._throw()";
        crate::tests::Tester::run(|tester| {
            HELPERS.set(&Helpers::new(true), || {
                let expected = tester.apply_transform(
                    as_folder(DropSpan {
                        preserve_ctxt: false,
                    }),
                    "output.js",
                    Default::default(),
                    "import * as swcHelpers1 from '@swc/helpers';
_throw();
swcHelpers._throw();",
                )?;
                enable_helper!(throw);

                eprintln!("----- Actual -----");

                let tr = as_folder(InjectHelpers);
                let actual = tester
                    .apply_transform(tr, "input.js", Default::default(), input)?
                    .fold_with(&mut crate::hygiene::hygiene())
                    .fold_with(&mut crate::fixer::fixer(None));

                if actual == expected {
                    return Ok(());
                }

                let (actual_src, expected_src) = (tester.print(&actual), tester.print(&expected));

                if actual_src == expected_src {
                    return Ok(());
                }

                println!(">>>>> Orig <<<<<\n{}", input);
                println!(">>>>> Code <<<<<\n{}", actual_src);
                assert_eq!(
                    crate::tests::DebugUsingDisplay(&actual_src),
                    crate::tests::DebugUsingDisplay(&expected_src)
                );
                Err(())
            })
        });
    }

    #[test]
    fn use_strict_before_helper() {
        crate::tests::test_transform(
            Default::default(),
            |_| {
                enable_helper!(throw);
                as_folder(InjectHelpers)
            },
            "'use strict'",
            "'use strict'
function _throw(e) {
    throw e;
}
",
            false,
            Default::default(),
        )
    }

    #[test]
    fn name_conflict() {
        crate::tests::test_transform(
            Default::default(),
            |_| {
                enable_helper!(throw);
                as_folder(InjectHelpers)
            },
            "let _throw = null",
            "function _throw(e) {
    throw e;
}
let _throw1 = null;
",
            false,
            Default::default(),
        )
    }
    #[test]
    fn use_strict_abort() {
        crate::tests::test_transform(
            Default::default(),
            |_| noop(),
            "'use strict'

let x = 4;",
            "'use strict'

let x = 4;",
            false,
            Default::default(),
        );
    }
}
