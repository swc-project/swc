#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(specialization)]
#![recursion_limit = "1024"]

extern crate chashmap;
extern crate crossbeam;
extern crate rayon;
extern crate swc_atoms;
extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;

use self::{analyzer::Info, errors::Error};
use chashmap::CHashMap;
use crossbeam::{channel, thread};
use rayon::iter::{IntoParallelIterator, ParallelIterator};
use std::{path::PathBuf, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{errors::Handler, Globals, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax, TsConfig};

pub mod analyzer;
pub mod errors;
#[cfg(test)]
mod tests;
mod util;

/// Module with information.
pub type ModuleInfo = Arc<(Module, Info)>;

pub struct Checker<'a> {
    globals: swc_common::Globals,
    cm: Arc<SourceMap>,
    handler: &'a Handler,
    ts_config: TsConfig,
    /// Cache
    modules: Arc<CHashMap<PathBuf, ModuleInfo>>,
}

impl<'a> Checker<'a> {
    pub fn new(cm: Arc<SourceMap>, handler: &'a Handler, parser_config: TsConfig) -> Self {
        Checker {
            globals: Globals::new(),
            cm,
            handler,
            modules: Default::default(),
            ts_config: parser_config,
        }
    }
}

#[derive(Debug)]
enum Task {
    Resolve { from: PathBuf, src: JsWord },
    Load { path: PathBuf },
}

#[derive(Debug)]
enum TaskResult {
    Resolve {
        from: PathBuf,
        src: JsWord,
        file: PathBuf,
    },
    Load {
        path: PathBuf,
        module: ModuleInfo,
    },
}

#[derive(Debug)]
struct Worker {
    sender: channel::Sender<TaskResult>,
    queue: channel::Receiver<Task>,
    modules: Arc<CHashMap<PathBuf, ModuleInfo>>,
}

impl Worker {
    pub fn run(&self) {
        loop {
            let task = match self.queue.recv() {
                Ok(task) => task,
                Err(_) => return,
            };
        }
    }
}

impl Checker<'_> {
    /// Returns empty vector if no error is found.
    pub fn check(&self, entry: PathBuf) -> Vec<Error> {
        let mut errors = vec![];

        let module = self.load(entry.clone());
        let (tasks, receiver) = channel::unbounded();
        let (result_sender, result_receiver) = channel::unbounded();
        for import in &module.1.imports {
            let _ = tasks.send(Task::Resolve {
                from: entry.clone(),
                src: import.src.clone(),
            });
        }

        for i in 1..6 {
            let worker = Worker {
                sender: result_sender.clone(),
                queue: receiver.clone(),
                modules: self.modules.clone(),
            };
            thread::scope(|s| {
                s.spawn(|_| worker.run());
            })
            .unwrap();
        }

        errors
    }

    fn load_all(&self, files: Vec<PathBuf>) -> Vec<ModuleInfo> {
        files
            .into_par_iter()
            .map(|path| self.load(path))
            .collect::<Vec<_>>()
    }

    fn load(&self, path: PathBuf) -> ModuleInfo {
        let cached = self.modules.get(&path);

        if let Some(cached) = cached {
            return cached.clone();
        }

        let module = swc_common::GLOBALS.set(&self.globals, || {
            let session = Session {
                handler: &self.handler,
            };

            // Real usage
            let fm = self.cm.load_file(&path).expect("failed to read file");

            let mut parser = Parser::new(
                session,
                Syntax::Typescript(self.ts_config),
                SourceFileInput::from(&*fm),
                None, // Disable comments
            );

            parser
                .parse_module()
                .map_err(|mut e| {
                    e.emit();
                    ()
                })
                .expect("failed to parser module")
        });

        let res = Arc::new(analyzer::analyze_module(module));
        self.modules.insert(path, res.clone());

        res
    }
}
