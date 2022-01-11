// https://github.com/vmx/wasm-multi-value-reverse-polyfill/blob/bba1488949059163a44784cd92c931014031dfb5/src/main.rs
use std::{env, fs, path::PathBuf};
use walrus::{ExportId, ExportItem, FunctionId, Module, ValType};

/// Returns the export and function IDs.
fn get_ids_by_name(module: &Module, function_name: &str) -> (ExportId, FunctionId) {
    let export = module
        .exports
        .iter()
        .find(|&exp| exp.name == function_name)
        .expect(&format!(
            "cannot find function with name `{}`",
            function_name
        ));

    match export.item {
        ExportItem::Function(function_id) => (export.id(), function_id),
        _ => panic!("item is not a function"),
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // We'll polyfill return type of plugin's `process` interface to (i32, i32)
    let transformations = vec![("process", vec![ValType::I32, ValType::I32])];

    let target: Vec<String> = env::args().collect();

    let target_path = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?)
        .join("..")
        .join("target")
        .join("wasm32-unknown-unknown")
        .join(target[1].clone());

    let input_path = fs::read_dir(target_path)?
        .enumerate()
        .find_map(|(_size, entry)| {
            if let Ok(entry) = entry {
                let s = entry.file_name().to_string_lossy().into_owned();
                if s.ends_with(".wasm") {
                    Some(entry.path())
                } else {
                    None
                }
            } else {
                None
            }
        })
        .expect("Binary should exist");

    let input_path = input_path.as_path();

    let wasm = wit_text::parse_file(&input_path)
        .expect(&format!("input file `{:#?}` can be read", input_path));
    wit_validator::validate(&wasm).expect(&format!("failed to validate `{:#?}`", input_path));
    let mut module = walrus::ModuleConfig::new()
        // Skip validation of the module as LLVM's output is
        // generally already well-formed and so we won't gain much
        // from re-validating. Additionally LLVM's current output
        // for threads includes atomic instructions but doesn't
        // include shared memory, so it fails that part of
        // validation!
        .strict_validate(false)
        .on_parse(wit_walrus::on_parse)
        .parse(&wasm)
        .expect("failed to parse input file as wasm");

    let shadow_stack_pointer = wasm_bindgen_wasm_conventions::get_shadow_stack_pointer(&module)
        .expect("cannot get shadow stack pointer");
    let memory = wasm_bindgen_wasm_conventions::get_memory(&module).expect("cannot get memory");

    let to_xform: Vec<(FunctionId, usize, Vec<ValType>)> = transformations
        .iter()
        .map(|(function_name, result_types)| {
            println!(
                "Make `{}` function return `{:?}`.",
                function_name, result_types
            );
            let (_export_id, function_id) = get_ids_by_name(&module, function_name);
            (function_id, 0, result_types.to_vec())
        })
        .collect();
    let export_ids: Vec<ExportId> = transformations
        .iter()
        .map(|(function_name, _)| {
            let (export_id, _function_id) = get_ids_by_name(&module, function_name);
            export_id
        })
        .collect();

    let wrappers = wasm_bindgen_multi_value_xform::run(
        &mut module,
        memory,
        shadow_stack_pointer,
        &to_xform[..],
    )?;

    for (export_id, id) in export_ids.into_iter().zip(wrappers) {
        let mut_export = module.exports.get_mut(export_id);
        mut_export.item = id.into();
    }

    let output_bytes = module.emit_wasm();
    fs::write(&input_path, &output_bytes).expect(&format!("failed to write `{:#?}`", input_path));
    Ok(())
}
