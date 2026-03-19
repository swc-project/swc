use std::{
    fmt::{self, Display, Formatter},
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::Args;
use swc_common::{FileName, Mark, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::{text_writer::JsWriter, Config as CodegenConfig, Emitter};
use swc_ecma_parser::{
    error::Error as ParseError, parse_file_as_program, EsSyntax, FlowSyntax, Syntax,
};
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_transforms_typescript::typescript;

/// Verify that Flow syntax is stripped into valid JavaScript.
#[derive(Debug, Args)]
pub struct StripCommand {
    /// The path to verify. It can be a file or directory.
    ///
    /// If this is a directory, this command recursively checks all `.js` and
    /// `.jsx` files.
    pub path: PathBuf,

    #[clap(long)]
    pub jsx: bool,

    #[clap(long)]
    pub all: bool,

    #[clap(long)]
    pub require_directive: bool,

    #[clap(long)]
    pub enums: bool,

    #[clap(long)]
    pub decorators: bool,

    #[clap(long)]
    pub components: bool,

    #[clap(long)]
    pub pattern_matching: bool,
}

impl StripCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let files = collect_flow_files(&self.path)?;
        if files.is_empty() {
            bail!(
                "No `.js` or `.jsx` files found in `{}`",
                self.path.display()
            );
        }

        let flow_syntax = self.flow_syntax();
        let mut failures = Vec::new();

        for path in files.iter() {
            if let Err(err) = verify_file(cm.clone(), path, flow_syntax) {
                failures.push(err);
            }
        }

        let total = files.len();
        let failed = failures.len();
        let passed = total - failed;

        println!("Checked {total} files: {passed} passed, {failed} failed");

        if !failures.is_empty() {
            println!("Failures:");
            for failure in failures {
                println!(
                    "{} [{}] {}",
                    failure.path.display(),
                    failure.stage,
                    failure.message
                );
            }

            bail!("flow strip verification failed");
        }

        Ok(())
    }

    fn flow_syntax(&self) -> FlowSyntax {
        FlowSyntax {
            jsx: self.jsx,
            all: self.all,
            require_directive: self.require_directive,
            enums: self.enums,
            decorators: self.decorators,
            components: self.components,
            pattern_matching: self.pattern_matching,
        }
    }
}

#[derive(Debug)]
struct FlowStripFailure {
    path: PathBuf,
    stage: FailureStage,
    message: String,
}

impl FlowStripFailure {
    fn new(path: &Path, stage: FailureStage, message: impl Into<String>) -> Self {
        Self {
            path: path.to_path_buf(),
            stage,
            message: normalize_message(message.into()),
        }
    }
}

#[derive(Debug, Clone, Copy)]
enum FailureStage {
    Parse,
    Strip,
    Reparse,
    Leak,
}

impl Display for FailureStage {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match self {
            Self::Parse => write!(f, "parse"),
            Self::Strip => write!(f, "strip"),
            Self::Reparse => write!(f, "reparse"),
            Self::Leak => write!(f, "leak"),
        }
    }
}

fn verify_file(
    cm: Arc<SourceMap>,
    path: &Path,
    flow_syntax: FlowSyntax,
) -> std::result::Result<(), FlowStripFailure> {
    let fm = cm.load_file(path).map_err(|err| {
        FlowStripFailure::new(
            path,
            FailureStage::Parse,
            format!("failed to load file: {err:#}"),
        )
    })?;

    let mut parse_recovered_errors = Vec::new();
    let parsed = parse_file_as_program(
        &fm,
        Syntax::Flow(flow_syntax),
        EsVersion::latest(),
        None,
        &mut parse_recovered_errors,
    )
    .map_err(|err| {
        FlowStripFailure::new(
            path,
            FailureStage::Parse,
            parse_error_message(&err, &parse_recovered_errors),
        )
    })?;

    if !parse_recovered_errors.is_empty() {
        return Err(FlowStripFailure::new(
            path,
            FailureStage::Parse,
            recovered_parse_message(&parse_recovered_errors),
        ));
    }

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let transformed = parsed
        .apply(resolver(unresolved_mark, top_level_mark, false))
        .apply(typescript::typescript(
            typescript::Config {
                flow_syntax: true,
                ..Default::default()
            },
            unresolved_mark,
            top_level_mark,
        ))
        .apply(fixer(None));

    let output = emit_program(cm.clone(), &transformed)
        .map_err(|err| FlowStripFailure::new(path, FailureStage::Strip, format!("{err:#}")))?;

    if output.contains("__flow_") {
        return Err(FlowStripFailure::new(
            path,
            FailureStage::Leak,
            "flow synthetic symbol leaked into output: `__flow_`",
        ));
    }

    let output_fm = cm.new_source_file(FileName::Anon.into(), output);
    let mut reparse_recovered_errors = Vec::new();
    parse_file_as_program(
        &output_fm,
        Syntax::Es(es_reparse_syntax(flow_syntax.jsx)),
        EsVersion::latest(),
        None,
        &mut reparse_recovered_errors,
    )
    .map_err(|err| {
        FlowStripFailure::new(
            path,
            FailureStage::Reparse,
            parse_error_message(&err, &reparse_recovered_errors),
        )
    })?;

    if !reparse_recovered_errors.is_empty() {
        return Err(FlowStripFailure::new(
            path,
            FailureStage::Reparse,
            recovered_parse_message(&reparse_recovered_errors),
        ));
    }

    Ok(())
}

fn parse_error_message(primary: &ParseError, recovered: &[ParseError]) -> String {
    let mut message = format!("{primary:?}");
    if let Some(first_recovered) = recovered.first() {
        message.push_str("; recovered: ");
        message.push_str(&format!("{first_recovered:?}"));
        if recovered.len() > 1 {
            message.push_str(&format!(" (+{} more)", recovered.len() - 1));
        }
    }
    message
}

fn recovered_parse_message(recovered: &[ParseError]) -> String {
    let first = recovered
        .first()
        .map(|err| format!("{err:?}"))
        .unwrap_or_else(|| "unknown parse error".to_string());

    if recovered.len() > 1 {
        format!("{first} (+{} more)", recovered.len() - 1)
    } else {
        first
    }
}

fn emit_program(cm: Arc<SourceMap>, program: &Program) -> Result<String> {
    let mut buf = Vec::new();
    {
        let wr = JsWriter::new(cm.clone(), "\n", &mut buf, None);
        let mut emitter = Emitter {
            cfg: CodegenConfig::default(),
            comments: None,
            cm,
            wr,
        };
        emitter
            .emit_program(program)
            .context("failed to emit transformed program")?;
    }

    String::from_utf8(buf).context("swc emitted non-utf8 output")
}

fn collect_flow_files(path: &Path) -> Result<Vec<PathBuf>> {
    if !path.exists() {
        bail!("path does not exist: `{}`", path.display());
    }

    let mut files = Vec::new();
    let mut stack = vec![path.to_path_buf()];

    while let Some(current) = stack.pop() {
        if current.is_dir() {
            let entries = current
                .read_dir()
                .with_context(|| format!("failed to read directory `{}`", current.display()))?;

            for entry in entries {
                let entry = entry.with_context(|| {
                    format!("failed to read an entry in `{}`", current.display())
                })?;
                stack.push(entry.path());
            }
            continue;
        }

        if is_flow_input_file(&current) {
            files.push(current);
        }
    }

    files.sort();
    Ok(files)
}

fn is_flow_input_file(path: &Path) -> bool {
    path.extension()
        .and_then(|ext| ext.to_str())
        .is_some_and(|ext| ext == "js" || ext == "jsx")
}

fn es_reparse_syntax(jsx: bool) -> EsSyntax {
    EsSyntax {
        jsx,
        decorators: true,
        decorators_before_export: true,
        export_default_from: true,
        import_attributes: true,
        allow_super_outside_method: true,
        auto_accessors: true,
        explicit_resource_management: true,
        ..Default::default()
    }
}

fn normalize_message(message: String) -> String {
    message.split_whitespace().collect::<Vec<_>>().join(" ")
}

#[cfg(test)]
mod tests {
    use std::{fs, sync::Arc};

    use anyhow::Result;
    use swc_common::{Globals, SourceMap, GLOBALS};
    use tempfile::TempDir;

    use super::{collect_flow_files, StripCommand};

    #[test]
    fn flow_syntax_is_mapped_from_cli_flags() {
        let cmd = StripCommand {
            path: "input.js".into(),
            jsx: true,
            all: true,
            require_directive: true,
            enums: true,
            decorators: true,
            components: true,
            pattern_matching: true,
        };

        let syntax = cmd.flow_syntax();

        assert!(syntax.jsx);
        assert!(syntax.all);
        assert!(syntax.require_directive);
        assert!(syntax.enums);
        assert!(syntax.decorators);
        assert!(syntax.components);
        assert!(syntax.pattern_matching);
    }

    #[test]
    fn collect_flow_files_only_returns_js_and_jsx() -> Result<()> {
        let tmp = TempDir::new()?;
        let root = tmp.path();

        fs::create_dir_all(root.join("nested"))?;
        fs::write(root.join("a.js"), "const a = 1;")?;
        fs::write(root.join("nested").join("b.jsx"), "const b = <div />;")?;
        fs::write(root.join("nested").join("ignored.ts"), "type T = string;")?;

        let files = collect_flow_files(root)?;
        let rel_paths = files
            .iter()
            .map(|file| {
                file.strip_prefix(root)
                    .expect("file should be inside temp dir")
                    .to_string_lossy()
                    .replace('\\', "/")
            })
            .collect::<Vec<_>>();

        assert_eq!(rel_paths, vec!["a.js", "nested/b.jsx"]);

        Ok(())
    }

    #[test]
    fn strip_command_validates_simple_flow_input() -> Result<()> {
        let tmp = TempDir::new()?;
        let input = tmp.path().join("input.js");

        fs::write(
            &input,
            r#"
type ID = string;
const value: ID = ("hello": any);
export const out: ID = value;
"#,
        )?;

        let cmd = StripCommand {
            path: input,
            jsx: false,
            all: false,
            require_directive: false,
            enums: false,
            decorators: false,
            components: false,
            pattern_matching: false,
        };

        let cm = Arc::new(SourceMap::default());
        let globals = Globals::default();

        GLOBALS.set(&globals, || cmd.run(cm))
    }
}
