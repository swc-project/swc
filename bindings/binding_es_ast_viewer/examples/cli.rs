use std::{env, fs, path::Path};

use binding_es_ast_viewer::parse;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        eprintln!("Usage: {} <file_path>", args[0]);
        eprintln!("Example: {} example.js", args[0]);
        std::process::exit(1);
    }

    let file_path = &args[1];

    // Check if file exists
    if !Path::new(file_path).exists() {
        eprintln!("Error: File '{file_path}' does not exist");
        std::process::exit(1);
    }

    // Read file content
    let content = match fs::read_to_string(file_path) {
        Ok(content) => content,
        Err(err) => {
            eprintln!("Error: Cannot read file '{file_path}': {err}");
            std::process::exit(1);
        }
    };

    // Get filename from file path
    let file_name = Path::new(file_path)
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("unknown")
        .to_string();

    // Parse code
    match parse(&content, Some(file_name)) {
        Ok(results) => {
            println!("=== AST Parse Results ===\n");
            println!("{}", results[0]);

            println!("\n=== Token Parse Results ===\n");
            println!("{}", results[1]);
        }
        Err(err) => {
            eprintln!("Parse error: {err}");
            std::process::exit(1);
        }
    }
}
