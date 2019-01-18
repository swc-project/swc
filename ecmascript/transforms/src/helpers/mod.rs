use ast::*;
use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, FilePathMapping, Fold, FoldWith, SourceMap, Span, DUMMY_SP,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};

lazy_static! {
    static ref CM: Lrc<SourceMap> = { Lrc::new(SourceMap::new(FilePathMapping::empty())) };
    static ref HANDLER: Handler =
        { Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(CM.clone())) };
    static ref SESSION: Session<'static> = { Session { handler: &*HANDLER } };
}

macro_rules! add_to {
    ($buf:expr, $name:tt, $b:expr) => {{
        lazy_static! {
            static ref STMTS: Vec<Stmt> = {
                let code = include_str!(concat!("_", stringify!($name), ".js"));
                let fm =
                    CM.new_source_file(FileName::Custom(stringify!($name).into()), code.into());

                let stmts = Parser::new(*SESSION, Syntax::default(), SourceFileInput::from(&*fm))
                    .parse_script()
                    .map(|stmts| stmts.fold_with(&mut DropSpan))
                    .map_err(|mut e| {
                        e.emit();
                        ()
                    })
                    .unwrap();
                stmts
            };
        }

        let enable = $b.load(Ordering::Relaxed);
        if enable {
            $buf.extend_from_slice(&STMTS)
        }
    }};
}

macro_rules! define_helpers {
    (
        Helpers {
            $( $name:ident : ( $( $dep:ident ),* ), )*
        }
    ) => {
        /// Tracks used helper methods. (e.g. __extends)
        #[derive(Default)]
        pub struct Helpers {
            $( $name: AtomicBool, )*
        }

        impl Helpers {
            $(
                pub fn $name(&self) {
                    self.$name.store(true, Ordering::Relaxed);
                    $(
                        self.$dep();
                    )*
                }
            )*
        }

        impl InjectHelpers {
            fn mk_helpers(&self) -> Vec<Stmt>{
                let mut buf = vec![];

                $(
                    add_to!(buf, $name, self.helpers.$name);
                )*


                buf
            }
        }
    };
}
define_helpers!(Helpers {
    extends: (),
    to_consumable_array: (),
    class_call_check: (),
    inherits: (),
    to_array: (),
    decorate: (to_array, to_property_key),
    to_property_key: (to_primitive),
    to_primitive: (type_of),
    possible_constructor_return: (),
    create_class: (),
    get: (),
    instanceof: (),
    type_of: (),
    tagged_template_literal: (),
    define_property: (),
    define_enumerable_properties: (),
    set: (),
    get_prototype_of: (),
    throw: (),
    async_to_generator: (),
    object_without_properties: (),
    object_spread: (),
});

#[derive(Clone)]
pub struct InjectHelpers {
    pub cm: Lrc<SourceMap>,
    pub helpers: Arc<Helpers>,
}

impl Fold<Module> for InjectHelpers {
    fn fold(&mut self, module: Module) -> Module {
        let body = self
            .mk_helpers()
            .into_iter()
            .map(ModuleItem::Stmt)
            .chain(module.body)
            .collect();

        Module { body, ..module }
    }
}

struct DropSpan;
impl Fold<Span> for DropSpan {
    fn fold(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}
