use std::{path::PathBuf, sync::Arc};

use anyhow::{anyhow, Result};
use clap::{Args, Subcommand};
use swc_atoms::JsWord;
use swc_common::SourceMap;
use swc_ecma_ast::{EsVersion, Ident};
use swc_ecma_parser::{parse_file_as_program, TsConfig};
use swc_ecma_visit::{Visit, VisitWith};

#[derive(Debug, Subcommand)]
pub enum ExtraCommand {
    PrintAtoms(PrintAtomsComamnd),
}

impl ExtraCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        match self {
            ExtraCommand::PrintAtoms(cmd) => cmd.run(cm),
        }
    }
}

#[derive(Debug, Args)]
pub struct PrintAtomsComamnd {
    pub path: PathBuf,
}

impl PrintAtomsComamnd {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let fm = cm.load_file(&self.path)?;

        let p = parse_file_as_program(
            &fm,
            swc_ecma_parser::Syntax::Typescript(TsConfig {
                dts: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .map_err(|err| anyhow!("failed to parse: {:?}", err))?;

        let mut v = IdentCollector::default();
        p.visit_with(&mut v);
        v.ident.sort();
        v.ident.dedup();

        for i in v.ident {
            println!("{}", i);
        }

        Ok(())
    }
}

#[derive(Default)]
struct IdentCollector {
    ident: Vec<JsWord>,
}

impl Visit for IdentCollector {
    fn visit_ident(&mut self, ident: &Ident) {
        self.ident.push(ident.sym.clone());
    }
}
