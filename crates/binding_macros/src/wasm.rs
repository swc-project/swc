use std::sync::Arc;

#[doc(hidden)]
pub use anyhow;
use anyhow::Error;
#[doc(hidden)]
pub use js_sys;
use once_cell::sync::Lazy;
use swc::{config::ErrorFormat, Compiler};
#[doc(hidden)]
pub use swc::{
    config::{Options, ParseOptions, SourceMapsConfig},
    try_with_handler,
};
#[doc(hidden)]
pub use swc_common::{comments, FileName};
use swc_common::{FilePathMapping, SourceMap};
#[doc(hidden)]
pub use swc_ecma_ast::{EsVersion, Program};
#[doc(hidden)]
pub use swc_ecma_transforms::pass::noop;
#[doc(hidden)]
pub use wasm_bindgen::JsValue;
#[doc(hidden)]
pub use wasm_bindgen_futures::future_to_promise;

/// Get global sourcemap
pub fn compiler() -> Arc<Compiler> {
    console_error_panic_hook::set_once();

    static C: Lazy<Arc<Compiler>> = Lazy::new(|| {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

        Arc::new(Compiler::new(cm))
    });

    C.clone()
}

#[doc(hidden)]
pub fn convert_err(
    err: Error,
    error_format: Option<ErrorFormat>,
) -> wasm_bindgen::prelude::JsValue {
    error_format
        .unwrap_or(ErrorFormat::Normal)
        .format(&err)
        .into()
}

#[macro_export]
macro_rules! build_minify_sync {
  ($(#[$m:meta])*) => {
    build_minify_sync!($(#[$m])*, Default::default());
  };
  ($(#[$m:meta])*, $opt: expr) => {
    $(#[$m])*
    pub fn minify_sync(s: $crate::wasm::js_sys::JsString, opts: $crate::wasm::JsValue) -> Result<$crate::wasm::JsValue, $crate::wasm::JsValue> {
      let c = $crate::wasm::compiler();

      $crate::wasm::try_with_handler(
          c.cm.clone(),
          $opt,
          |handler| {
              c.run(|| {
                  let opts = if opts.is_null() || opts.is_undefined() {
                      Default::default()
                  } else {
                    $crate::wasm::anyhow::Context::context(opts.into_serde(), "failed to parse options")?
                  };

                  let fm = c.cm.new_source_file($crate::wasm::FileName::Anon, s.into());
                  let program = $crate::wasm::anyhow::Context::context(c.minify(fm, handler, &opts), "failed to minify file")?;

                  $crate::wasm::anyhow::Context::context($crate::wasm::JsValue::from_serde(&program), "failed to serialize json")
              })
          },
      )
      .map_err(|e| $crate::wasm::convert_err(e, None))
    }
  };
}

/// Currently this relies on existence of minify_sync.
#[macro_export]
macro_rules! build_minify {
  ($(#[$m:meta])*) => {
    build_minify!($(#[$m])*, Default::default());
  };
  ($(#[$m:meta])*, $opt: expr) => {
      $(#[$m])*
      pub fn minify(s: $crate::wasm::js_sys::JsString, opts: $crate::wasm::JsValue) -> $crate::wasm::js_sys::Promise {
          // TODO: This'll be properly scheduled once wasm have standard backed thread
          // support.
          $crate::wasm::future_to_promise(async { minify_sync(s, opts) })
      }
  };
}

#[macro_export]
macro_rules! build_parse_sync {
  ($(#[$m:meta])*) => {
    build_parse_sync!($(#[$m])*, Default::default());
  };
  ($(#[$m:meta])*, $opt: expr) => {
    $(#[$m])*
    pub fn parse_sync(s: $crate::wasm::js_sys::JsString, opts: $crate::wasm::JsValue) -> Result<$crate::wasm::JsValue, $crate::wasm::JsValue> {
      let c = $crate::wasm::compiler();

      $crate::wasm::try_with_handler(
          c.cm.clone(),
          $opt,
          |handler| {
              c.run(|| {
                  let opts: $crate::wasm::ParseOptions = if opts.is_null() || opts.is_undefined() {
                      Default::default()
                  } else {
                      $crate::wasm::anyhow::Context::context(opts.into_serde(), "failed to parse options")?
                  };

                  let fm = c.cm.new_source_file($crate::wasm::FileName::Anon, s.into());

                  let cmts = c.comments().clone();
                  let comments = if opts.comments {
                      Some(&cmts as &dyn $crate::wasm::comments::Comments)
                  } else {
                      None
                  };

                  let program = $crate::wasm::anyhow::Context::context(
                    c
                      .parse_js(
                          fm,
                          handler,
                          opts.target,
                          opts.syntax,
                          opts.is_module,
                          comments,
                      ),
                      "failed to parse code"
                  )?;

                  $crate::wasm::anyhow::Context::context($crate::wasm::JsValue::from_serde(&program), "failed to serialize json")
              })
          },
      )
      .map_err(|e| $crate::wasm::convert_err(e, None))
    }
  };
}

/// Currently this relies on existence of parse_sync.
#[macro_export]
macro_rules! build_parse {
  ($(#[$m:meta])*) => {
    build_parse!($(#[$m])*, Default::default());
  };
  ($(#[$m:meta])*, $opt: expr) => {
      $(#[$m])*
      pub fn parse(s: $crate::wasm::js_sys::JsString, opts: $crate::wasm::JsValue) -> $crate::wasm::js_sys::Promise {
          // TODO: This'll be properly scheduled once wasm have standard backed thread
          // support.
          $crate::wasm::future_to_promise(async { parse_sync(s, opts) })
      }
  };
}

#[macro_export]
macro_rules! build_print_sync {
  ($(#[$m:meta])*) => {
    build_print_sync!($(#[$m])*, Default::default());
  };
  ($(#[$m:meta])*, $opt: expr) => {
    $(#[$m])*
    pub fn print_sync(s: $crate::wasm::JsValue, opts: $crate::wasm::JsValue) -> Result<$crate::wasm::JsValue, $crate::wasm::JsValue> {
      let c = $crate::wasm::compiler();

      $crate::wasm::try_with_handler(
          c.cm.clone(),
          $opt,
          |_handler| {
              c.run(|| {
                  let opts: $crate::wasm::Options = if opts.is_null() || opts.is_undefined() {
                      Default::default()
                  } else {
                    $crate::wasm::anyhow::Context::context(opts.into_serde(), "failed to parse options")?
                  };

                  let program: $crate::wasm::Program = $crate::wasm::anyhow::Context::context(s.into_serde(), "failed to deserialize program")?;
                  let s = $crate::wasm::anyhow::Context::context(c
                    .print(
                        &program,
                        None,
                        None,
                        true,
                        opts.codegen_target().unwrap_or($crate::wasm::EsVersion::Es2020),
                        opts.source_maps
                            .clone()
                            .unwrap_or($crate::wasm::SourceMapsConfig::Bool(false)),
                        &Default::default(),
                        None,
                        opts.config.minify.into(),
                        None,
                        opts.config.emit_source_map_columns.into_bool(),
                        false,
                    ),"failed to print code")?;

                    $crate::wasm::anyhow::Context::context(JsValue::from_serde(&s), "failed to serialize json")
              })
          },
      )
      .map_err(|e| $crate::wasm::convert_err(e, None))
    }
  };
}

/// Currently this relies on existence of print_sync.
#[macro_export]
macro_rules! build_print {
  ($(#[$m:meta])*) => {
    build_print!($(#[$m])*, Default::default());
  };
  ($(#[$m:meta])*, $opt: expr) => {

      $(#[$m])*
      pub fn print(s: $crate::wasm::JsValue, opts: $crate::wasm::JsValue) -> $crate::wasm::js_sys::Promise {
        // TODO: This'll be properly scheduled once wasm have standard backed thread
        // support.
        $crate::wasm::future_to_promise(async { print_sync(s, opts) })
      }
  };
}

#[macro_export]
macro_rules! build_transform_sync {
  ($(#[$m:meta])*) => {
    build_transform_sync!($(#[$m])*, |_, _| $crate::wasm::noop(), |_, _| $crate::wasm::noop(), Default::default());
  };
  ($(#[$m:meta])*, $before_pass: expr, $after_pass: expr) => {
    build_transform_sync!($(#[$m])*, $before_pass, $after_pass, Default::default());
  };
  ($(#[$m:meta])*, $before_pass: expr, $after_pass: expr, $opt: expr) => {
    $(#[$m])*
    #[allow(unused_variables)]
    pub fn transform_sync(
        s: $crate::wasm::JsValue,
        opts: $crate::wasm::JsValue,
        experimental_plugin_bytes_resolver: $crate::wasm::JsValue,
    ) -> Result<$crate::wasm::JsValue, $crate::wasm::JsValue> {
        let c = $crate::wasm::compiler();

        #[cfg(feature = "plugin")]
        {
            if experimental_plugin_bytes_resolver.is_object() {
                use $crate::wasm::js_sys::{Array, Object, Uint8Array};

                // TODO: This is probably very inefficient, including each transform
                // deserializes plugin bytes.
                let plugin_bytes_resolver_object: Object = experimental_plugin_bytes_resolver
                    .try_into()
                    .expect("Resolver should be a js object");

                swc_core::plugin_runner::cache::init_plugin_module_cache_once();

                let entries = Object::entries(&plugin_bytes_resolver_object);
                for entry in entries.iter() {
                    let entry: Array = entry
                        .try_into()
                        .expect("Resolver object missing either key or value");
                    let name: String = entry
                        .get(0)
                        .as_string()
                        .expect("Resolver key should be a string");
                    let buffer = entry.get(1);

                    //https://github.com/rustwasm/wasm-bindgen/issues/2017#issue-573013044
                    //We may use https://github.com/cloudflare/serde-wasm-bindgen instead later
                    let data = if JsCast::is_instance_of::<Uint8Array>(&buffer) {
                        JsValue::from(Array::from(&buffer))
                    } else {
                        buffer
                    };

                    let bytes: Vec<u8> = data
                        .into_serde()
                        .expect("Could not read byte from plugin resolver");

                    // In here we 'inject' externally loaded bytes into the cache, so
                    // remaining plugin_runner execution path works as much as
                    // similar between embedded runtime.
                    swc_core::plugin_runner::cache::PLUGIN_MODULE_CACHE.store_once(&name, bytes);
                }
            }
        }

        let opts: $crate::wasm::Options = if opts.is_null() || opts.is_undefined() {
            Default::default()
        } else {
          $crate::wasm::anyhow::Context::context(opts.into_serde(), "failed to parse options")
                .map_err(|e| $crate::wasm::convert_err(e, None))?
        };

        let error_format = opts.experimental.error_format.unwrap_or_default();

        $crate::wasm::try_with_handler(
            c.cm.clone(),
            $opt,
            |handler| {
                c.run(|| {
                  let s = JsCast::dyn_into::<$crate::wasm::js_sys::JsString>(s);
                  let out = match s {
                      Ok(s) => {
                          let fm = c.cm.new_source_file(
                              if opts.filename.is_empty() {
                                $crate::wasm::FileName::Anon
                              } else {
                                $crate::wasm::FileName::Real(opts.filename.clone().into())
                              },
                              s.into(),
                          );
                          let cm = c.cm.clone();
                          let file = fm.clone();

                          $crate::wasm::anyhow::Context::context(
                            c.process_js_with_custom_pass(
                              fm,
                              None,
                              handler,
                              &opts,
                              $before_pass,
                              $after_pass,
                          ), "failed to process js file"
                          )?
                      }
                      Err(v) => unsafe { c.process_js(handler, v.into_serde().expect(""), &opts)? },
                  };

                  $crate::wasm::anyhow::Context::context($crate::wasm::JsValue::from_serde(&out),
                                                          "failed to serialize json")
              })
            },
        )
        .map_err(|e| $crate::wasm::convert_err(e, Some(error_format)))
    }
  };
}

/// Currently this relies on existence of transform_sync.
#[macro_export]
macro_rules! build_transform {
  ($(#[$m:meta])*) => {
    build_transform!($(#[$m])*, Default::default());
  };
  ($(#[$m:meta])*, $opt: expr) => {
      $(#[$m])*
      pub fn transform(
        s: $crate::wasm::JsValue,
        opts: $crate::wasm::JsValue,
        experimental_plugin_bytes_resolver: $crate::wasm::JsValue,
      ) -> $crate::wasm::js_sys::Promise {
          // TODO: This'll be properly scheduled once wasm have standard backed thread
          // support.
          $crate::wasm::future_to_promise(async { transform_sync(s, opts, experimental_plugin_bytes_resolver) })
      }
  };
}
