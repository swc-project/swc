use std::{
    hash::Hash,
    collections::{BTreeMap, HashMap},
    fs,
    io::{self, Write},
    path::Path,
};

use anyhow::Context;

fn main() -> anyhow::Result<()> {
    let crate_dir = std::env::var("CARGO_MANIFEST_DIR")?;
    let crate_dir = Path::new(&crate_dir);

    let out_dir = std::env::var("OUT_DIR").unwrap();
    let out_dir = Path::new(&out_dir);

    let mut strpool = StrPool::default();
    
    corejs3_entry(&mut strpool, crate_dir, out_dir)?;
    corejs3_data(&mut strpool, crate_dir, out_dir)?;
    corejs2_data(&mut strpool, crate_dir, out_dir)?;
    corejs2_builtin(&mut strpool, crate_dir, out_dir)?;

    fs::write(out_dir.join("str.bin"), strpool.pool.as_bytes())?;

    Ok(())
}

fn corejs3_entry(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    const SEED: u64 = 16416001479773392852;

    let out_dir = out_dir.join("corejs3_entries");
    fs::remove_dir_all(&out_dir)
        .or_else(|err| (err.kind() == io::ErrorKind::NotFound)
            .then_some(())
            .ok_or(err)
        )?;
    fs::create_dir(&out_dir)?;

    let entry_path = crate_dir.join("data/core-js-compat/entries.json");
    println!("cargo::rerun-if-changed={}", entry_path.display());

    let entry_data = fs::read_to_string(entry_path)?;
    let entry_data: BTreeMap<&str, Vec<&str>> =
        serde_json::from_str(&entry_data).context("failed to parse entries.json from core js 3")?;
    let (keys, values): (Vec<_>, Vec<_>) = entry_data.into_iter().unzip();

    let mut values_strid = Vec::new();
    let mut values_index = Vec::new();
    for list in values {
        let start: u32 = values_strid.len().try_into().unwrap();
        values_strid.extend(list.iter().map(|s| strpool.insert(s)));
        let end: u32 = values_strid.len().try_into().unwrap();
        values_index.push(start..end);
    }

    let mapout = precomputed_map::builder::MapBuilder::<&str>::new()
        .set_seed(SEED)
        .set_hash(&|seed, &v| foldhash_once(seed, &v))
        .set_next_seed(|seed, c| seed + c)
        .build(&keys)?;

    if let Some(seed) = mapout.seed().filter(|&seed| seed != SEED) {
        println!(
            "cargo::warning=The `corejs3_entry` seed has changed, please update the seed to {seed} for faster \
             builds"
        );
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

    let keys = keys.iter().map(|s| strpool.insert(s)).collect::<Vec<_>>();
    let _k = builder.create_u32_seq("EntryKeys".into(), mapout.reorder(&keys).copied())?;
    let k = builder.create_custom("EntryKeysStringId".into());
    builder.create_u32_seq("EntryValuesStringId".into(), values_strid.iter().copied())?;
    mapout.create_map("ENTRY_INDEX".into(), k, &mut builder)?;

    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;
    builder.codegen(&mut codeout)?;
    u8seq.codegen(&mut codeout)?;
    u32seq.codegen(&mut codeout)?;

    write!(
        codeout,
r#"struct EntryKeysStringId;

impl precomputed_map::store::AccessSeq for EntryKeysStringId {{
    type Item = &'static str;
    const LEN: usize = {};

    fn index(index: usize) -> Option<Self::Item> {{
        let id = EntryKeys::index(index)?;
        Some(crate::util::PooledStr(id).as_str())
    }}
}}            
"#,
        keys.len()
    )?;

    writeln!(
        codeout,
        "const ENTRY_VALUES_LIST: &[Range<u32>] = &["
    )?;
    for range in mapout.reorder(&values_index) {
        writeln!(codeout, "{}..{},", range.start, range.end)?;
    }
    writeln!(codeout, "];")?;

    Ok(())
}

fn corejs3_data(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    const SEED: u64 = 16416001479773392852;
    
    let out_dir = out_dir.join("corejs3_data");
    fs::remove_dir_all(&out_dir)
        .or_else(|err| (err.kind() == io::ErrorKind::NotFound)
            .then_some(())
            .ok_or(err)
        )?;
    fs::create_dir(&out_dir)?;

    let entry_path = crate_dir.join("data/core-js-compat/modules-by-versions.json");
    println!("cargo::rerun-if-changed={}", entry_path.display());

    let entry_data = fs::read_to_string(entry_path)?;
    let entry_data: BTreeMap<&str, Vec<&str>> =
        serde_json::from_str(&entry_data).context("failed to parse entries.json from core js 3")?;

    let mut keys = Vec::new();
    let mut versions = Vec::new();
    let mut values = Vec::new();
    for (k, list) in &entry_data {
        let k = version(k);
        let id: u32 = versions.len().try_into().unwrap();
        versions.push(k);
        
        for v in list {
            let v = strpool.insert(v);
            keys.push(v);
            values.push(id);
        }
    }
    
    let mapout = precomputed_map::builder::MapBuilder::<u32>::new()
        .set_seed(SEED)
        .set_hash(&|seed, &v| foldhash_once(seed, &strpool.get(v)))
        .set_next_seed(|seed, c| seed + c)
        .build(&keys)?;

    if let Some(seed) = mapout.seed().filter(|&seed| seed != SEED) {
        println!(
            "cargo::warning=The `corejs3_data` seed has changed, please update the seed to {seed} for faster \
             builds"
        );
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
        "Corejs3Data".into(),
        "SwcFold".into(),
        &mut u8seq,
        &mut u32seq,
    );

    let _k = builder.create_u32_seq("DataKeys".into(), mapout.reorder(&keys).copied())?;
    let k = builder.create_custom("DataKeysStringId".into());
    let v = builder.create_u32_seq("DataValues".into(), mapout.reorder(&values).copied())?;
    let pair = builder.create_pair(k, v);
    mapout.create_map("DATA_INDEX".into(), pair, &mut builder)?;

    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;
    builder.codegen(&mut codeout)?;
    u8seq.codegen(&mut codeout)?;
    u32seq.codegen(&mut codeout)?;

    write!(
        codeout,
        r#"struct DataKeysStringId;

impl precomputed_map::store::AccessSeq for DataKeysStringId {{
    type Item = &'static str;
    const LEN: usize = {};

    fn index(index: usize) -> Option<Self::Item> {{
        let id = DataKeys::index(index)?;
        Some(crate::util::PooledStr(id).as_str())
    }}
}}

const VERSIONS: &[Version] = &[
"#,
        keys.len()
    )?;

    for version in versions {
        writeln!(
            codeout,
            "Version {{ major: {}, minor: {}, patch: {} }},",
            version.0,
            version.1,
            version.2,
        )?;
    }

    write!(codeout, "];")?;

    Ok(())    
}

fn corejs2_data(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    use serde::Deserialize;

    #[derive(Deserialize)]
    struct Data<'a> {
        #[serde(borrow)]
        builtin_types: BTreeMap<&'a str, Vec<&'a str>>,
        instance_properties: BTreeMap<&'a str, Vec<&'a str>>,
        static_properties: BTreeMap<&'a str, BTreeMap<&'a str, Vec<&'a str>>>
    }

    const SEED: u64 = 16416001479773392852;

    let data_path = crate_dir.join("data/corejs2/data.json");
    println!("cargo::rerun-if-changed={}", data_path.display());

    let data = fs::read_to_string(data_path)?;
    let data: Data<'_> =
        serde_json::from_str(&data).context("failed to parse corejs2/data.json")?;
    
    let out_dir = out_dir.join("corejs2_data");
    fs::remove_dir_all(&out_dir)
        .or_else(|err| (err.kind() == io::ErrorKind::NotFound)
            .then_some(())
            .ok_or(err)
        )?;
    fs::create_dir(&out_dir)?;

    let mut list_store = Vec::new();

    let mut builtin_types = Vec::new();
    for (k, list) in &data.builtin_types {
        let k = strpool.insert(k);
        let start: u32 = list_store.len().try_into().unwrap();
        list_store.extend(list.iter().map(|s| strpool.insert(s)));
        let end: u32 = list_store.len().try_into().unwrap();
        builtin_types.push((k, start, end));
    }

    let mut instance_properties = Vec::new();
    for (k, list) in &data.instance_properties {
        let k = strpool.insert(k);
        let start: u32 = list_store.len().try_into().unwrap();
        list_store.extend(list.iter().map(|s| strpool.insert(s)));
        let end: u32 = list_store.len().try_into().unwrap();
        instance_properties.push((k, (start, end)));
    }

    let mut static_props_store = Vec::new();
    let mut static_properties = Vec::new();
    for (k, map) in &data.static_properties {
        let k = strpool.insert(k);

        let start: u32 = static_props_store.len().try_into().unwrap();
        for (p, list) in map {
            let p = strpool.insert(p);
            let start: u32 = list_store.len().try_into().unwrap();
            list_store.extend(list.iter().map(|s| strpool.insert(s)));
            let end: u32 = list_store.len().try_into().unwrap();
            static_props_store.push((p, start, end));
        }
        let end: u32 = static_props_store.len().try_into().unwrap();
        static_properties.push((k, start, end));
    }

    let (instance_keys, instance_values): (Vec<_>, Vec<_>) = instance_properties.into_iter().unzip();
    let mapout = precomputed_map::builder::MapBuilder::<u32>::new()
        .set_seed(SEED)
        .set_hash(&|seed, &v| foldhash_once(seed, &strpool.get(v)))
        .set_next_seed(|seed, c| seed + c)
        .build(&instance_keys)?;

    if let Some(seed) = mapout.seed().filter(|&seed| seed != SEED) {
        println!(
            "cargo::warning=The `corejs2_data` seed has changed, please update the seed to {seed} for faster \
             builds"
        );
    }

    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;

    writeln!(
        codeout,
r#"const LIST_STORE: &[PooledStr] = &["#,
    )?;
    for u in &list_store {
        writeln!(codeout, "PooledStr({}),", u)?;
    }
    
    writeln!(
        codeout,
        r#"];

const BUILTIN_TYPES: &[(PooledStr, u32, u32)] = &[
"#)?;
    for (k, start, end) in &builtin_types {
        writeln!(codeout, "(PooledStr({k}), {start}, {end}),")?;
    }

    writeln!(
        codeout,
        r#"];

const STATIC_PROPERTIES_STORE: &[(PooledStr, u32, u32)] = &[
    "#)?;
    for (k, start, end) in &static_props_store {
        writeln!(codeout, "(PooledStr({k}), {start}, {end}),")?;
    }

    writeln!(
        codeout,
        r#"];

const STATIC_PROPERTIES: &[(PooledStr, u32, u32)] = &[
    "#)?;
    for (k, start, end) in &static_properties {
        writeln!(codeout, "(PooledStr({k}), {start}, {end}),")?;
    }

    write!(
        codeout,
        r#"];

const INSTANCE_PROPERTIES_KEYS: &[PooledStr] = &["#)?;
    for k in mapout.reorder(&instance_keys) {
        write!(codeout, "PooledStr({}),", k)?;
    }

    write!(
        codeout,
        r#"];

const INSTANCE_PROPERTIES_VALUES: &[(u32, u32)] = &["#)?;
    for (start, end) in mapout.reorder(&instance_values) {
        write!(codeout, "({}, {}),", start, end)?;
    }
    writeln!(codeout, "];")?;

    let mut u8seq = precomputed_map::builder::U8SeqWriter::new(
        "PrecomputedU8Seq".into(),
        out_dir.join("u8.bin"),
    );
    let mut u32seq = precomputed_map::builder::U32SeqWriter::new(
        "PrecomputedU32Seq".into(),
        out_dir.join("u32.bin"),
    );
    let mut builder = precomputed_map::builder::CodeBuilder::new(
        "Corejs2InstanceProperties".into(),
        "SwcFold".into(),
        &mut u8seq,
        &mut u32seq,
    );
    let keys = builder.create_custom("InstancePropertiesKeys".into());
    let _k = mapout.create_map("INSTANCE_KEYS".into(), keys, &mut builder)?;

    writeln!(
        codeout,
        r#"struct InstancePropertiesKeys;

impl precomputed_map::store::AccessSeq for InstancePropertiesKeys {{
    type Item = &'static str;
    const LEN: usize = {};

    fn index(index: usize) -> Option<Self::Item> {{
        INSTANCE_PROPERTIES_KEYS
            .get(index)
            .map(|s| s.as_str())
    }}
}}
        "#,
        instance_keys.len()
    )?;

    builder.codegen(&mut codeout)?;
    u8seq.codegen(&mut codeout)?;
    u32seq.codegen(&mut codeout)?;

    Ok(())
}

fn corejs2_builtin(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    let out_dir = out_dir.join("corejs2_builtin");
    fs::remove_dir_all(&out_dir)
        .or_else(|err| (err.kind() == io::ErrorKind::NotFound)
            .then_some(())
            .ok_or(err)
        )?;
    fs::create_dir(&out_dir)?;

    let entry_path = crate_dir.join("data/corejs2/builtin.json");
    println!("cargo::rerun-if-changed={}", entry_path.display());

    let entry_data = fs::read_to_string(entry_path)?;
    let entry_data: BTreeMap<&str, BTreeMap<&str, &str>> =
        serde_json::from_str(&entry_data).context("failed to parse builtin.json from core js 2")?;

    let mut features = Vec::new();
    let mut version_store = Vec::new();
    for (feature, browsers) in entry_data {
        let feature = strpool.insert(feature);
        let start: u32 = version_store.len().try_into().unwrap();
        version_store.extend(browsers.iter()
            .map(|(b, v)| (
                strpool.insert(b),
                strpool.insert(v),
            )));
        let end: u32 = version_store.len().try_into().unwrap();
        features.push((feature, start, end));
    }

    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;

    writeln!(
        codeout,
r#"const FEATURES: &[(PooledStr, u32, u32)] = &["#
    )?;
    for (feature, start, end) in &features {
        writeln!(codeout, "(PooledStr({}), {}, {}),", feature, start, end)?;
    }

    writeln!(
        codeout,
r#"];

const VERSION_STORE: &[(PooledStr, PooledStr)] = &["#
    )?;
    for (browser, version) in &version_store {
        writeln!(codeout, "(PooledStr({}), PooledStr({})),", browser, version)?;
    }
    writeln!(codeout, "];")?;

    Ok(())    
}

#[derive(Default)]
struct StrPool {
    pool: String,
    map: HashMap<String, u32>,
}

impl StrPool {
    pub fn insert(&mut self, s: &str) -> u32 {
        *self.map.entry(s.into()).or_insert_with(|| {
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

    pub fn get(&self, id: u32) -> &str {
        let offset = id & ((1 << 24) - 1);
        let len = id >> 24;
        &self.pool[offset as usize..][..len as usize]
    }
}

fn foldhash_once<V: Hash>(seed: u64, v: &V) -> u64 {
    use std::hash::Hasher;

    let mut hasher =
        foldhash::fast::FoldHasher::with_seed(seed, foldhash::SharedSeed::global_fixed());
    v.hash(&mut hasher);
    hasher.finish()    
}

fn version(s: &str) -> (u32, u32, u32) {
    // A non-universal version parser that only works with specified data
    
    let mut iter = s.split('.');
    let major = iter.next().unwrap().parse::<u32>().unwrap();
    let minor = iter.next().unwrap().parse::<u32>().unwrap();
    let patch = iter.next()
        .map(|s| s.parse::<u32>().unwrap())
        .unwrap_or_default();

    assert!(iter.next().is_none());
    
    (major, minor, patch)
}
