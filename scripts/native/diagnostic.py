from pathlib import Path
p=Path("crates/swc_native_addon/src/cache.rs");s=p.read_text()
s=s.replace("let directory = cache_directory(root)?;", "let started = std::time::Instant::now();\n    let directory = cache_directory(root)?;")
s=s.replace("let valid = match platform::open_regular", "let check_started = std::time::Instant::now();\n    let valid = match platform::open_regular")
s=s.replace("    if !valid {", '    eprintln!("verify {:?}", check_started.elapsed());\n    if !valid {\n        let phase = std::time::Instant::now();')
s=s.replace("        payload.decode_into(staged.as_file_mut())?;", '        payload.decode_into(staged.as_file_mut())?;\n        eprintln!("decode {:?}", phase.elapsed());\n        let phase = std::time::Instant::now();')
s=s.replace("        // Compression is an optimization.", '        eprintln!("sync {:?}", phase.elapsed());\n        let phase = std::time::Instant::now();\n        // Compression is an optimization.')
s=s.replace("        // All cooperating readers", '        eprintln!("readback {:?}", phase.elapsed());\n        // All cooperating readers')
s=s.replace("    Ok(Materialized {\n        path,\n        temporary: false,", '    eprintln!("cache total {:?}", started.elapsed());\n    Ok(Materialized {\n        path,\n        temporary: false,')
p.write_text(s)
p=Path("bindings/binding_native_addon/src/lib.rs");s=p.read_text().replace("    #[cfg(unix)]\n    let library", "    let started = std::time::Instant::now();\n    #[cfg(unix)]\n    let library").replace("    let register = *unsafe", '    eprintln!("dlopen {:?}", started.elapsed());\n    let register = *unsafe');p.write_text(s)

p=Path("crates/swc_native_addon/src/integrity.rs");s=p.read_text().replace(".get().min(4)", ".get().min(2)").replace("return 1024 * 1024;", "return 4 * 1024 * 1024;");p.write_text(s)
