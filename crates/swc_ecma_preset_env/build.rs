use std::{
    collections::{BTreeMap, HashMap},
    fs,
    io::{self, Write},
    path::Path,
};

use anyhow::Context;

fn main() -> anyhow::Result<()> {
    es_preset_env_corejs3_entry()
}

fn es_preset_env_corejs3_entry() -> anyhow::Result<()> {
    const SEED: u64 = 16416001479773392852;

    let crate_dir = std::env::var("CARGO_MANIFEST_DIR")?;
    let crate_dir = Path::new(&crate_dir);

    let out_dir = std::env::var("OUT_DIR").unwrap();
    let out_dir = Path::new(&out_dir);
    let out_dir = out_dir.join("corejs3_entries");

    let entry_path = crate_dir.join("data/core-js-compat/entries.json");
    println!("cargo::rerun-if-changed={}", entry_path.display());

    let entry_data = fs::read_to_string(entry_path)?;
    let entry_data: BTreeMap<&str, Vec<&str>> =
        serde_json::from_str(&entry_data).context("failed to parse entries.json from core js 3")?;
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
        .set_seed(SEED)
        .set_hash(&|seed, &v| {
            use std::hash::{Hash, Hasher};

            let mut hasher =
                foldhash::fast::FoldHasher::with_seed(seed, foldhash::SharedSeed::global_fixed());
            v.as_bytes().hash(&mut hasher);
            hasher.finish()
        })
        .set_next_seed(|seed, c| seed + c)
        .build(&keys)?;

    if let Some(seed) = mapout.seed().filter(|&seed| seed != SEED) {
        println!(
            "cargo::warning=The seed has changed, please update the seed to {seed} for faster \
             builds"
        );
    }

    // clean file
    {
        fs::remove_dir_all(&out_dir).or_else(|err| match err.kind() {
            io::ErrorKind::NotFound => Ok(()),
            _ => Err(err),
        })?;
        fs::create_dir(&out_dir)?;
    }

    let mut u8seq = precomputed_map::builder::U8SeqWriter::new(
        "PrecomputedU8Seq".into(),
        out_dir.join("u8.bin"),
    );
    let mut u32seq = precomputed_map::builder::U32SeqWriter::new(
        "PrecomputedU32Seq".into(),
        out_dir.join("u32.bin"),
    );

    let mut builder = precomputed_map::builder::CodeBuilder::new(
        "Corejs3Entries".into(),
        "SwcFold".into(),
        &mut u8seq,
        &mut u32seq,
    );

    let k = builder.create_bytes_position_seq("EntryKeys".into(), mapout.reorder(&keys))?;
    builder.create_u32_seq("EntryValuesStringId".into(), values_strid.iter().copied())?;
    mapout.create_map("ENTRY_INDEX".into(), k, &mut builder)?;

    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;
    builder.codegen(&mut codeout)?;
    u8seq.codegen(&mut codeout)?;
    u32seq.codegen(&mut codeout)?;

    fs::write(out_dir.join("str.bin"), strpool.pool.as_bytes())?;

    writeln!(
        codeout,
        "static ENTRY_VALUES_STRING_STORE: &str = include_str!(\"str.bin\");
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
            self.pool.push_str(s);
            let len: u8 = (self.pool.len() - offset).try_into().unwrap();
            let offset: u32 = offset.try_into().unwrap();

            if offset > (1 << 24) {
                panic!("string too large");
            }

            offset | (u32::from(len) << 24)
        })
    }
}
