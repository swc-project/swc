use crate::util::{parse, print_js};
use anyhow::{bail, Context, Result};
use std::{
    io::Write,
    path::PathBuf,
    process::{Command, Stdio},
    sync::Arc,
};
use structopt::StructOpt;
use swc_common::{util::take::Take, FileName, Mark, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_diff::Diff;
use swc_ecma_minifier::option::{ExtraOptions, MinifyOptions};
use swc_ecma_transforms_base::{fixer::fixer, resolver::resolver_with_mark};
use swc_ecma_visit::{VisitMut, VisitMutWith};
use tempfile::NamedTempFile;

/// Diff the output of swc minifier and terser.
#[derive(Debug, StructOpt)]
pub(crate) struct DiffMinifiedCommand {
    input: PathBuf,

    #[structopt(long)]
    no_mangle: bool,
}

impl DiffMinifiedCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let terser_output = self
            .get_output_from_terser()
            .context("failed to get output from terser")?;

        let fm = cm
            .load_file(&self.input)
            .context("failed to load input file")?;

        let top_level_mark = Mark::fresh(Mark::root());

        let mut swc_module = {
            let mut m = parse(&fm).context("failed to parse input file using swc")?;

            m.visit_mut_with(&mut resolver_with_mark(top_level_mark));
            m.visit_mut_with(&mut fixer(None));
            m.visit_mut_with(&mut Normalizer::default());

            m = swc_ecma_minifier::optimize(
                m,
                cm.clone(),
                None,
                None,
                &MinifyOptions {
                    compress: Some(Default::default()),
                    mangle: if self.no_mangle {
                        None
                    } else {
                        Some(Default::default())
                    },
                    ..Default::default()
                },
                &ExtraOptions { top_level_mark },
            );

            m.visit_mut_with(&mut fixer(None));
            m.visit_mut_with(&mut Normalizer::default());
            m.visit_mut_with(&mut BeforeDiffNormalizer::default());

            m
        };

        let terser_fm = cm.new_source_file(FileName::Anon, terser_output);
        let mut terser_module = parse(&terser_fm)?;

        {
            terser_module.visit_mut_with(&mut resolver_with_mark(top_level_mark));
            terser_module.visit_mut_with(&mut fixer(None));
            terser_module.visit_mut_with(&mut Normalizer::default());
            terser_module.visit_mut_with(&mut BeforeDiffNormalizer::default());
        }
        {
            // Diff

            let config = swc_ecma_diff::Config { ignore_span: true };
            let mut ctx = swc_ecma_diff::Ctx::new(config);
            let diff_res = swc_module.diff(&mut terser_module, &mut ctx);

            eprintln!("Diff: \n{}", diff_res);
        }

        swc_module.visit_mut_with(&mut Normalizer::default());
        terser_module.visit_mut_with(&mut Normalizer::default());

        let swc_output = print_js(cm.clone(), &swc_module, None).context("failed to print js")?;
        let terser_output = print_js(cm, &terser_module, None).context("failed to print js")?;

        if swc_output == terser_output {
            return Ok(());
        }

        let mut swc_file = NamedTempFile::new()?;

        writeln!(swc_file, "{}", swc_output)?;

        let mut terser_file = NamedTempFile::new()?;

        writeln!(terser_file, "{}", terser_output)?;

        Command::new("code")
            .arg("--wait")
            .arg("--diff")
            .arg(&swc_file.path())
            .arg(&terser_file.path())
            .status()?;

        Ok(())
    }

    /// Invoke `terser`
    fn get_output_from_terser(&self) -> Result<String> {
        let mut c = Command::new("terser");

        c.arg("--compress");

        if !self.no_mangle {
            c.arg("--mangle");
        }

        let output = c
            .arg("--")
            .arg(&self.input)
            .stderr(Stdio::inherit())
            .output()
            .context("failed to run terser")?;

        if !output.status.success() {
            bail!("terser failed with status code {}", output.status);
        }

        let src = String::from_utf8(output.stdout).context("failed to parse terser output")?;
        Ok(src)
    }
}

#[derive(Debug, Default)]
struct Normalizer {}

impl VisitMut for Normalizer {
    fn visit_mut_new_expr(&mut self, e: &mut NewExpr) {
        e.visit_mut_children_with(self);

        if let Some(args) = &e.args {
            if args.is_empty() {
                e.args = None;
            }
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        if let Stmt::Decl(Decl::Var(v)) = s {
            if v.decls.is_empty() {
                s.take();
            }
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        stmts.visit_mut_children_with(self);

        stmts.retain(|s| !matches!(s, Stmt::Empty(..)));
    }
}

#[derive(Debug, Default)]
struct BeforeDiffNormalizer {}

impl VisitMut for BeforeDiffNormalizer {
    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        if let Stmt::Block(bs) = s {
            if bs.stmts.len() == 1 {
                *s = bs.stmts[0].take();
            }
        }
    }

    fn visit_mut_str(&mut self, s: &mut Str) {
        s.visit_mut_children_with(self);
        s.has_escape = false;
    }
}
