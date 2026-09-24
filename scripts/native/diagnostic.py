from pathlib import Path
p=Path("crates/swc_native_addon/src/cache.rs");s=p.read_text()
s=s.replace("let directory = cache_directory(root)?;", "let started = std::time::Instant::now();\n    let directory = cache_directory(root)?;")
s=s.replace("let valid = match platform::open_regular", "let check_started = std::time::Instant::now();\n    let valid = match platform::open_regular")
s=s.replace("    if !valid {", '    eprintln!("verify {:?}", check_started.elapsed());\n    if !valid {\n        let phase = std::time::Instant::now();')
s=s.replace("        payload.decode_into(staged.as_file_mut())?;", '        payload.decode_into(staged.as_file_mut())?;\n        eprintln!("decode {:?}", phase.elapsed());\n        let phase = std::time::Instant::now();')
s=s.replace("        // Enable NTFS compression", '        eprintln!("sync {:?}", phase.elapsed());\n        let phase = std::time::Instant::now();\n        // Compression is an optimization.')
s=s.replace("        // All cooperating readers", '        eprintln!("readback {:?}", phase.elapsed());\n        // All cooperating readers')
s=s.replace("    Ok(Materialized {\n        path,\n        temporary: false,", '    eprintln!("cache total {:?}", started.elapsed());\n    Ok(Materialized {\n        path,\n        temporary: false,')
p.write_text(s)
p=Path("bindings/binding_native_addon/src/lib.rs");s=p.read_text().replace("    #[cfg(unix)]\n    let library", "    let started = std::time::Instant::now();\n    #[cfg(unix)]\n    let library").replace("    let register = *unsafe", '    eprintln!("dlopen {:?}", started.elapsed());\n    let register = *unsafe');p.write_text(s)

p=Path("crates/swc_native_addon/src/cache.rs");s=p.read_text()
s=s.replace("        if let Err(error) = platform::compress_cache", '        let compression_started = std::time::Instant::now();\n        if let Err(error) = platform::compress_cache')
s=s.replace("        payload.decode_into(staged.as_file_mut())?;", '        eprintln!("compression {:?}", compression_started.elapsed());\n        payload.decode_into(staged.as_file_mut())?;')
p.write_text(s)
p=Path("crates/swc_native_addon/src/format.rs");s=p.read_text()
s=s.replace("        let mut count = 0_u64;", "        let mut phase_times = [std::time::Duration::ZERO; 3];\n        let mut count = 0_u64;")
s=s.replace("        loop {\n            let read =", "        loop {\n            let phase_started = std::time::Instant::now();\n            let read =")
s=s.replace("            if read == 0 {", "            phase_times[0] += phase_started.elapsed();\n            if read == 0 {")
s=s.replace("            hash.update(&buffer[..read]);", "            let phase_started = std::time::Instant::now();\n            hash.update(&buffer[..read]);\n            phase_times[1] += phase_started.elapsed();")
s=s.replace("            output\n                .write_all", "            let phase_started = std::time::Instant::now();\n            output\n                .write_all")
s=s.replace('"write decoded addon", e))?;', '"write decoded addon", e))?;\n            phase_times[2] += phase_started.elapsed();')
s=s.replace("        if count != self.raw_len {", '        eprintln!("verify read/hash/write {:?}", phase_times);\n        if count != self.raw_len {')
s=s.replace("        if count != self.header.raw_len {", '        eprintln!("decode read/hash/write {:?}", phase_times);\n        if count != self.header.raw_len {')
p.write_text(s)

import os
if os.environ.get("NATIVE_DIAGNOSTIC_EXPERIMENT", "").startswith("uncompressed"):
    p=Path("crates/swc_native_addon/src/cache.rs");s=p.read_text().replace("platform::compress_cache(staged.path())", "Ok::<(), std::io::Error>(())");p.write_text(s)

experiment = os.environ.get("NATIVE_DIAGNOSTIC_EXPERIMENT", "")
if experiment.startswith("threads-"):
    threads = int(experiment.split("-")[1])
    p=Path("crates/swc_native_addon/src/integrity.rs");s=p.read_text().replace(".get().min(4)", f".get().min({threads})");p.write_text(s)
if experiment.startswith("bulk-"):
    threads = int(experiment.split("-")[1])
    p=Path("crates/swc_native_addon/src/integrity.rs");s=p.read_text().replace(".get().min(4)", f".get().min({threads})");p.write_text(s)
    p=Path("crates/swc_native_addon/src/format.rs");s=p.read_text()
    marker = '        let mut decoder = zstd::stream::read::Decoder::with_buffer(self.compressed)'
    s=s.replace(marker, '''        if self.header.raw_len <= 32 * 1024 * 1024 && matches!(&hash, Verifier::Blake3(..)) {
            let t = std::time::Instant::now();
            let decoded = zstd::bulk::decompress(self.compressed, self.header.raw_len as usize)
                .map_err(|e| Error::io(ErrorKind::Compression, "decompress native addon", e))?;
            eprintln!("bulk decode {:?}", t.elapsed());
            if decoded.len() as u64 != self.header.raw_len {
                return Err(Error::new(ErrorKind::Integrity, "decoded addon length mismatch"));
            }
            let t = std::time::Instant::now();
            hash.update(&decoded);
            hash.finish()?;
            eprintln!("bulk hash {:?}", t.elapsed());
            output.write_all(&decoded).map_err(|e| Error::io(ErrorKind::Cache, "write bulk addon", e))?;
            native_kind(output, self.header.raw_len)?;
            return Ok(());
        }
''' + marker);p.write_text(s)
if experiment.startswith("fast-stream-"):
    level = -int(experiment.split("-")[2])
    p=Path("crates/swc_native_addon/src/format.rs");s=p.read_text().replace("pub const COMPRESSION_LEVEL: i32 = 16;", f"pub const COMPRESSION_LEVEL: i32 = {level};");p.write_text(s)
    p=Path("crates/swc_native_addon/src/integrity.rs");s=p.read_text().replace("return _raw_len.min(32 * 1024 * 1024) as usize;", "return 64 * 1024;");p.write_text(s)
