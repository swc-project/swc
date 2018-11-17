use ast::*;
use std::{
    ops::BitOr,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
};
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, Fold, SourceMap,
};
use swc_ecma_parser::{Parser, Session, SourceFileInput};

/// Tracks used helper methods. (e.g. __extends)
#[derive(Debug, Default)]
pub struct Helpers {
    /// `_extends({}, b)`
    pub extends: AtomicBool,
    pub to_consumable_array: AtomicBool,
    /// `_classCallCheck`
    pub class_call_check: AtomicBool,
    /// `_inherits`
    pub inherits: AtomicBool,
    /// `_possibleConstructorReturn`
    pub possible_constructor_return: AtomicBool,
    ///`_createClass`
    pub create_class: AtomicBool,
    /// `_get`
    pub get: AtomicBool,
}

impl<'a> BitOr<&'a Helpers> for Helpers {
    type Output = Self;

    fn bitor(mut self, other: &Helpers) -> Self {
        *self.extends.get_mut() |= other.extends.load(Ordering::SeqCst);
        *self.to_consumable_array.get_mut() |= other.to_consumable_array.load(Ordering::SeqCst);
        *self.class_call_check.get_mut() |= other.class_call_check.load(Ordering::SeqCst);
        *self.inherits.get_mut() |= other.inherits.load(Ordering::SeqCst);
        *self.possible_constructor_return.get_mut() |=
            other.possible_constructor_return.load(Ordering::SeqCst);
        *self.create_class.get_mut() |= other.create_class.load(Ordering::SeqCst);
        *self.get.get_mut() |= other.get.load(Ordering::SeqCst);

        self
    }
}

pub struct InjectHelpers {
    pub cm: Lrc<SourceMap>,
    pub helpers: Arc<Helpers>,
}

impl InjectHelpers {
    fn mk_helpers(&self) -> Vec<Stmt> {
        let mut buf = vec![];

        let handler =
            Handler::with_tty_emitter(ColorConfig::Always, false, false, Some(self.cm.clone()));

        let session = Session {
            cfg: Default::default(),
            logger: &slog::Logger::root(slog::Discard, o!()),
            handler: &handler,
        };

        let mut add = |name: &str, flag: &AtomicBool, code: &'static str| {
            if flag.load(Ordering::SeqCst) {
                return;
            }
            let fm = self
                .cm
                .new_source_file(FileName::Custom(name.into()), code.into());

            let mut stmts = Parser::new(session, SourceFileInput::from(&*fm))
                .parse_script()
                .map_err(|e| {
                    e.emit();
                    ()
                })
                .unwrap();

            buf.append(&mut stmts);
        };

        add(
            "_extends.js",
            &self.helpers.extends,
            include_str!("_extends.js"),
        );
        add(
            "_toConsumableArray.js",
            &self.helpers.to_consumable_array,
            include_str!("_toConsumableArray.js"),
        );
        add(
            "_classCallCheck.js",
            &self.helpers.class_call_check,
            include_str!("_classCallCheck.js"),
        );
        add(
            "_inherits.js",
            &self.helpers.inherits,
            include_str!("_inherits.js"),
        );
        add(
            "_possibleConstructorReturn.js",
            &self.helpers.possible_constructor_return,
            include_str!("_possibleConstructorReturn.js"),
        );
        add(
            "_createClass.js",
            &self.helpers.create_class,
            include_str!("_createClass.js"),
        );
        add("_get.js", &self.helpers.get, include_str!("_get.js"));

        buf
    }
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
