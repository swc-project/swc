use std::fs;
use std::io::Write;
use std::path::Path;
use clap::Args;
use anyhow::Context;

#[derive(Debug, Args)]
pub(super) struct CodegenCmd {}

impl CodegenCmd {
    pub fn run(self) -> anyhow::Result<()> {
        let dir = Path::new(env!("CARGO_MANIFEST_DIR"));
        let dir = dir.parent().unwrap();
        
        es_minifier_js_environment_props(dir)
    }
}

fn es_minifier_js_environment_props(dir: &Path) -> anyhow::Result<()> {
    let crate_dir = dir.join("crates/swc_ecma_minifier/");
    
    let domprops = fs::read_to_string(crate_dir.join("src/lists/domprops.json"))?;
    let jsprops = fs::read_to_string(crate_dir.join("src/lists/jsprops.json"))?;

    let props = {
        let mut domprops: Vec<&str> = serde_json::from_str(&domprops)
            .context("failed to parse domprops.json for property mangler")?;
        let mut jsprops: Vec<&str> = serde_json::from_str(&jsprops)
            .context("Failed to parse jsprops.json for property mangler")?;
        domprops.append(&mut jsprops);
        domprops.sort_unstable();
        domprops.dedup();
        domprops
    };

    let mapout = precomputed_map::builder::MapBuilder::new(&props)
        .set_ord(&|&x, &y| x.cmp(&y))
        .set_hash(&|seed, &v| {
            use std::hash::{ Hash, Hasher };
            
            let mut hasher = xxhash_rust::xxh3::Xxh3::with_seed(seed);
            v.hash(&mut hasher);
            hasher.finish()
        })
        .set_next_seed(|seed, c| {
            dbg!(c);
            xxhash_rust::xxh3::xxh3_64_with_seed(&c.to_le_bytes(), seed)
        })
        .build()?;
    let mut builder = precomputed_map::builder::CodeBuilder::new(
        "props".into(),
        "SwcXxh3".into(),
        crate_dir.join("src/generated")
    );

    let _ = fs::create_dir(crate_dir.join("src/generated"));

    let k = builder.create_str_seq("PROPS_KEYS".into(), mapout.reorder(&props))?;
    mapout.create_map("PROPS".into(), k, &mut builder)?;

    let mut codeout = fs::File::create(crate_dir.join("src/generated/props.rs"))?;
    builder.write_to(&mut codeout)?;

    writeln!(codeout,
        r#"
use crate::util::SwcXxh3;
        
pub fn is_exist(name: &str) -> bool {{
    PROPS.get(name).is_some()
}}
"#
    )?;

    Ok(())
}
