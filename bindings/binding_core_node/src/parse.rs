use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::Context as _;
use napi::{
    bindgen_prelude::{AbortSignal, AsyncTask, Buffer},
    Env, Task,
};
use swc_core::{
    base::{
        config::{ErrorFormat, ParseOptions},
        Compiler,
    },
    common::{comments::Comments, FileName, Mark},
    ecma::{transforms::base::resolver, visit::VisitMutWith},
    node::{deserialize_json, get_deserialized, MapErr},
};

use crate::{get_compiler, util::try_with};

// ----- Parsing -----

pub struct ParseTask {
    pub c: Arc<Compiler>,
    pub filename: FileName,
    pub src: String,
    pub options: String,
}

pub struct ParseFileTask {
    pub c: Arc<Compiler>,
    pub path: PathBuf,
    pub options: String,
}

#[napi]
impl Task for ParseTask {
    type JsValue = String;
    type Output = String;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let options: ParseOptions = deserialize_json(&self.options)?;
        let fm = self
            .c
            .cm
            .new_source_file(self.filename.clone().into(), self.src.clone());

        let comments = if options.comments {
            Some(self.c.comments() as &dyn Comments)
        } else {
            None
        };

        let program = try_with(self.c.cm.clone(), false, ErrorFormat::Normal, |handler| {
            let mut p = self.c.parse_js(
                fm,
                handler,
                options.target,
                options.syntax,
                options.is_module,
                comments,
            )?;

            p.visit_mut_with(&mut resolver(
                Mark::new(),
                Mark::new(),
                options.syntax.typescript(),
            ));

            Ok(p)
        })
        .convert_err()?;

        let ast_json = serde_json::to_string(&program)?;

        Ok(ast_json)
    }

    fn resolve(&mut self, _env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(result)
    }
}

#[napi]
impl Task for ParseFileTask {
    type JsValue = String;
    type Output = String;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let program = try_with(self.c.cm.clone(), false, ErrorFormat::Normal, |handler| {
            self.c.run(|| {
                let options: ParseOptions = deserialize_json(&self.options)?;

                let fm = self
                    .c
                    .cm
                    .load_file(&self.path)
                    .context("failed to read module")?;

                let c = self.c.comments().clone();
                let comments = if options.comments {
                    Some(&c as &dyn Comments)
                } else {
                    None
                };

                let mut p = self.c.parse_js(
                    fm,
                    handler,
                    options.target,
                    options.syntax,
                    options.is_module,
                    comments,
                )?;

                p.visit_mut_with(&mut resolver(
                    Mark::new(),
                    Mark::new(),
                    options.syntax.typescript(),
                ));

                Ok(p)
            })
        })
        .convert_err()?;

        let ast_json = serde_json::to_string(&program)?;

        Ok(ast_json)
    }

    fn resolve(&mut self, _env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(result)
    }
}

#[napi]
pub fn parse(
    src: String,
    options: Buffer,
    filename: Option<String>,
    signal: Option<AbortSignal>,
) -> AsyncTask<ParseTask> {
    crate::util::init_default_trace_subscriber();

    let c = get_compiler();
    let options = String::from_utf8_lossy(options.as_ref()).to_string();
    let filename = if let Some(value) = filename {
        FileName::Real(value.into())
    } else {
        FileName::Anon
    };

    AsyncTask::with_optional_signal(
        ParseTask {
            c,
            filename,
            src,
            options,
        },
        signal,
    )
}

#[napi]
pub fn parse_sync(src: String, opts: Buffer, filename: Option<String>) -> napi::Result<String> {
    crate::util::init_default_trace_subscriber();
    let c = get_compiler();

    let options: ParseOptions = get_deserialized(&opts)?;
    let filename = if let Some(value) = filename {
        FileName::Real(value.into())
    } else {
        FileName::Anon
    };

    let program = try_with(c.cm.clone(), false, ErrorFormat::Normal, |handler| {
        c.run(|| {
            let fm = c.cm.new_source_file(filename.into(), src);

            let comments = if options.comments {
                Some(c.comments() as &dyn Comments)
            } else {
                None
            };

            let mut p = c.parse_js(
                fm,
                handler,
                options.target,
                options.syntax,
                options.is_module,
                comments,
            )?;

            p.visit_mut_with(&mut resolver(
                Mark::new(),
                Mark::new(),
                options.syntax.typescript(),
            ));

            Ok(p)
        })
    })
    .convert_err()?;

    Ok(serde_json::to_string(&program)?)
}

#[napi]
pub fn parse_file_sync(path: String, opts: Buffer) -> napi::Result<String> {
    crate::util::init_default_trace_subscriber();
    let c = get_compiler();
    let options: ParseOptions = get_deserialized(&opts)?;

    let program = {
        try_with(c.cm.clone(), false, ErrorFormat::Normal, |handler| {
            let fm =
                c.cm.load_file(Path::new(path.as_str()))
                    .expect("failed to read program file");

            let comments = if options.comments {
                Some(c.comments() as &dyn Comments)
            } else {
                None
            };

            let mut p = c.parse_js(
                fm,
                handler,
                options.target,
                options.syntax,
                options.is_module,
                comments,
            )?;
            p.visit_mut_with(&mut resolver(
                Mark::new(),
                Mark::new(),
                options.syntax.typescript(),
            ));

            Ok(p)
        })
    }
    .convert_err()?;

    Ok(serde_json::to_string(&program)?)
}

#[napi]
pub fn parse_file(
    path: String,
    options: Buffer,
    signal: Option<AbortSignal>,
) -> AsyncTask<ParseFileTask> {
    crate::util::init_default_trace_subscriber();

    let c = get_compiler();
    let path = PathBuf::from(&path);
    let options = String::from_utf8_lossy(options.as_ref()).to_string();

    AsyncTask::with_optional_signal(ParseFileTask { c, path, options }, signal)
}
