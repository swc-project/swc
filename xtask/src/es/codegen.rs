use std::fs;
use std::io::Write;
use std::path::Path;
use std::collections::HashMap;
use clap::Args;
use anyhow::Context;

#[derive(Debug, Args)]
pub(super) struct CodegenCmd {}

impl CodegenCmd {
    pub fn run(self) -> anyhow::Result<()> {
        let dir = Path::new(env!("CARGO_MANIFEST_DIR"));
        let dir = dir.parent().unwrap();
        
        es_preset_env_corejs3_entry(dir)
    }
}

fn es_preset_env_corejs3_entry(dir: &Path) -> anyhow::Result<()> {
    use std::collections::BTreeMap;
    
    let crate_dir = dir.join("crates/swc_ecma_preset_env/");
    
    let entry_data = fs::read_to_string(crate_dir.join("data/core-js-compat/entries.json"))?;
    let entry_data: BTreeMap<&str, Vec<&str>> = serde_json::from_str(&entry_data)
        .context("failed to parse entries.json from core js 3")?;
    let (keys, values): (Vec<_>, Vec<_>) = entry_data.into_iter().unzip();

    let mut strpool = StrPool::default();
    let mut values_strid = Vec::new();
    let mut values_index = Vec::new();
    for list in values {
        let start: u32 = values_strid.len().try_into().unwrap();
        for s in list {
            values_strid.push(strpool.insert(s));
        }
        let end: u32 = values_strid.len().try_into().unwrap();
        values_index.push(start..end);
    }

    let mapout = precomputed_map::builder::MapBuilder::<&str>::new()
        .set_seed(16416001479773392852)
        .set_hash(&|seed, &v| {
            use std::hash::{ Hash, Hasher };
            
            let mut hasher = foldhash::fast::FoldHasher::with_seed(seed, foldhash::SharedSeed::global_fixed());
            v.as_bytes().hash(&mut hasher);
            hasher.finish()
        })
        .set_next_seed(|seed, c| {
            seed + c
        })
        .build(&keys)?;
    println!("seed: {:?}", mapout.seed());

    // clean file
    {
        for entry in fs::read_dir(crate_dir.join("src/generated")).ok().into_iter().flatten() {
            let entry = entry?;
            let path = entry.path();

            if entry.file_type()?.is_file()
                && path.file_name()
                .and_then(|name| name.to_str())
                .filter(|name| !name.starts_with('.'))
                .is_some()
            {
                fs::remove_file(entry.path())?;
            }
        }
    }

    let mut u8seq = precomputed_map::builder::U8SeqWriter::new(
        "PrecomputedU8Seq".into(),
        crate_dir.join("src/generated/corejs3_entries.u8")
    );
    let mut u32seq = precomputed_map::builder::U32SeqWriter::new(
        "PrecomputedU32Seq".into(),
        crate_dir.join("src/generated/corejs3_entries.u32")
    );
    
    let mut builder = precomputed_map::builder::CodeBuilder::new(
        "Corejs3Entries".into(),
        "SwcFold".into(),
        &mut u8seq,
        &mut u32seq
    );

    let k = builder.create_bytes_position_seq("EntryKeys".into(), mapout.reorder(&keys))?;
    builder.create_u32_seq("EntryValuesStringId".into(), values_strid.iter().copied())?;
    mapout.create_map("ENTRY_INDEX".into(), k, &mut builder)?;

    let mut codeout = fs::File::create(crate_dir.join("src/generated/corejs3_entries.rs"))?;
    builder.write_to(&mut codeout)?;
    u8seq.write_to(&mut codeout)?;
    u32seq.write_to(&mut codeout)?;

    fs::write(crate_dir.join("src/generated/corejs3_entries.strpool"), strpool.pool.as_bytes())?;

    writeln!(codeout,
        "static ENTRY_VALUES_STRING_STORE: &str = include_str!(\"corejs3_entries.strpool\");
        static ENTRY_VALUES_LIST: &[Range<u32>] = &["
    )?;
    for range in mapout.reorder(&values_index) {
        writeln!(codeout, "{}..{},", range.start, range.end)?;
    }
    writeln!(codeout, "];")?;

    Ok(())
}

#[derive(Default)]
struct StrPool<'s> {
    pool: String,
    map: HashMap<&'s str, u32>,
}

impl<'s> StrPool<'s> {
    pub fn insert(&mut self, s: &'s str) -> u32 {
        *self.map.entry(s).or_insert_with(|| {
            let offset = self.pool.len();
            self.pool.push_str(&s);
            let len: u8 = (self.pool.len() - offset).try_into().unwrap();
            let offset: u32 = offset.try_into().unwrap();

            if offset > (1 << 24) {
                panic!("string too large");
            }

            offset | (u32::from(len) << 24)
        })
    }
}
