#[macro_export]
macro_rules! build_minify_sync {
  ($(#[$m:meta])*) => {
    build_minify_sync!($(#[$m])*, Default::default());
  };
  ($(#[$m:meta])*, $opt: expr) => {
    $(#[$m])*
    pub fn minify_sync(s: JsString, opts: JsValue) -> Result<JsValue, JsValue> {
      console_error_panic_hook::set_once();

      let c = compiler();

      try_with_handler(
          c.cm.clone(),
          $opt,
          |handler| {
              c.run(|| {
                  let opts = if opts.is_null() || opts.is_undefined() {
                      Default::default()
                  } else {
                      opts.into_serde().context("failed to parse options")?
                  };

                  let fm = c.cm.new_source_file(FileName::Anon, s.into());
                  let program = c
                      .minify(fm, handler, &opts)
                      .context("failed to minify file")?;

                  JsValue::from_serde(&program).context("failed to serialize json")
              })
          },
      )
      .map_err(|e| convert_err(e, ErrorFormat::Normal))
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
      pub fn minify(s: JsString, opts: JsValue) -> js_sys::Promise {
          // TODO: This'll be properly scheduled once wasm have standard backed thread
          // support.
          future_to_promise(async { minify_sync(s, opts) })
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
    pub fn parse_sync(s: JsString, opts: JsValue) -> Result<JsValue, JsValue> {
      console_error_panic_hook::set_once();

      let c = compiler();

      try_with_handler(
          c.cm.clone(),
          $opt,
          |handler| {
              c.run(|| {
                  let opts: ParseOptions = if opts.is_null() || opts.is_undefined() {
                      Default::default()
                  } else {
                      opts.into_serde().context("failed to parse options")?
                  };

                  let fm = c.cm.new_source_file(FileName::Anon, s.into());

                  let cmts = c.comments().clone();
                  let comments = if opts.comments {
                      Some(&cmts as &dyn Comments)
                  } else {
                      None
                  };

                  let program = c
                      .parse_js(
                          fm,
                          handler,
                          opts.target,
                          opts.syntax,
                          opts.is_module,
                          comments,
                      )
                      .context("failed to parse code")?;

                  JsValue::from_serde(&program).context("failed to serialize json")
              })
          },
      )
      .map_err(|e| convert_err(e, ErrorFormat::Normal))
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
      pub fn parse(s: JsString, opts: JsValue) -> js_sys::Promise {
          // TODO: This'll be properly scheduled once wasm have standard backed thread
          // support.
          future_to_promise(async { parse_sync(s, opts) })
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
    pub fn print_sync(s: JsValue, opts: JsValue) -> Result<JsValue, JsValue> {
      console_error_panic_hook::set_once();

      let c = compiler();

      try_with_handler(
          c.cm.clone(),
          $opt,
          |_handler| {
              c.run(|| {
                  let opts: Options = if opts.is_null() || opts.is_undefined() {
                      Default::default()
                  } else {
                      opts.into_serde().context("failed to parse options")?
                  };

                  let program: Program = s.into_serde().context("failed to deserialize program")?;

                  let s = c
                      .print(
                          &program,
                          None,
                          None,
                          true,
                          opts.codegen_target().unwrap_or(EsVersion::Es2020),
                          opts.source_maps
                              .clone()
                              .unwrap_or(SourceMapsConfig::Bool(false)),
                          &Default::default(),
                          None,
                          opts.config.minify.into(),
                          None,
                          opts.config.emit_source_map_columns.into_bool(),
                          false,
                      )
                      .context("failed to print code")?;

                  JsValue::from_serde(&s).context("failed to serialize json")
              })
          },
      )
      .map_err(|e| convert_err(e, ErrorFormat::Normal))
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
      pub fn print(s: JsValue, opts: JsValue) -> js_sys::Promise {
        // TODO: This'll be properly scheduled once wasm have standard backed thread
        // support.
        future_to_promise(async { print_sync(s, opts) })
      }
  };
}
