use std::{
    collections::{BTreeMap, HashMap},
    fs,
    hash::Hash,
    io::{self, Write},
    path::Path,
};

use anyhow::Context;
use rustc_hash::FxHashSet;

fn main() -> anyhow::Result<()> {
    let crate_dir = std::env::var("CARGO_MANIFEST_DIR")?;
    let crate_dir = Path::new(&crate_dir);

    let out_dir = std::env::var("OUT_DIR").unwrap();
    let out_dir = Path::new(&out_dir);

    let mut strpool = StrPool::default();

    corejs3_entry(&mut strpool, crate_dir, out_dir)?;
    corejs3_data(&mut strpool, crate_dir, out_dir)?;
    corejs3_compat(&mut strpool, crate_dir, out_dir)?;
    corejs3_builtin(&mut strpool, crate_dir, out_dir)?;
    corejs2_data(&mut strpool, crate_dir, out_dir)?;
    corejs2_builtin(&mut strpool, crate_dir, out_dir)?;

    fs::write(out_dir.join("str.bin"), strpool.pool.as_bytes())?;

    Ok(())
}

fn corejs3_entry(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    const SEED: u64 = 16416001479773392852;

    let out_dir = out_dir.join("corejs3_entries");
    let mut data = String::new();
    let data: BTreeMap<&str, Vec<&str>> = prepare(
        &out_dir,
        &crate_dir.join("data/core-js-compat/entries.json"),
        &mut data,
    )?;

    let (keys, values): (Vec<_>, Vec<_>) = data.into_iter().unzip();

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
    check_seed("corejs3_entry", mapout.seed(), SEED);

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
    let k = builder.create_custom("EntryKeysStringId".into());
    builder.create_u32_seq("EntryValuesStringId".into(), values_strid.iter().copied())?;
    mapout.create_map("ENTRY_INDEX".into(), k, &mut builder)?;

    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;
    builder.codegen(&mut codeout)?;
    u8seq.codegen(&mut codeout)?;
    u32seq.codegen(&mut codeout)?;
    create_pooledstr_keys(
        &mut codeout,
        "EntryKeysStringId",
        mapout.reorder(&keys).copied(),
    )?;

    writeln!(codeout, "const ENTRY_VALUES_LIST: &[Range<u32>] = &[")?;
    for range in mapout.reorder(&values_index) {
        writeln!(codeout, "{}..{},", range.start, range.end)?;
    }
    writeln!(codeout, "];")?;

    Ok(())
}

fn corejs3_data(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    const SEED: u64 = 16416001479773392852;

    let out_dir = out_dir.join("corejs3_data");
    let mut data = String::new();
    let data: BTreeMap<&str, Vec<&str>> = prepare(
        &out_dir,
        &crate_dir.join("data/core-js-compat/modules-by-versions.json"),
        &mut data,
    )?;

    let mut keys = Vec::new();
    let mut versions = Vec::new();
    let mut values = Vec::new();
    for (k, list) in &data {
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
    check_seed("corejs3_data", mapout.seed(), SEED);

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

    let all_modules: FxHashSet<&str> = data
        .values()
        .flatten()
        .filter(|m| m.starts_with("es.") || m.starts_with("esnext."))
        .copied()
        .collect();

    let mut esnext_modules = Vec::new();
    for &module in &all_modules {
        if let Some(base_name) = module.strip_prefix("esnext.") {
            let es_module = format!("es.{base_name}");
            if all_modules.contains(es_module.as_str()) {
                let esnext_id = strpool.insert(module);
                esnext_modules.push(esnext_id);
            }
        }
    }

    let esnext_setout = precomputed_map::builder::MapBuilder::<u32>::new()
        .set_seed(SEED + 2)
        .set_hash(&|seed, &v| foldhash_once(seed, &strpool.get(v)))
        .set_next_seed(|seed, c| seed + c)
        .build(&esnext_modules)?;

    let esnext_k = builder.create_custom("EsnextKeysStringId".into());
    let esnext_v = builder.create_u32_seq(
        "EsnextValues".into(),
        esnext_setout.reorder(&esnext_modules).copied(),
    )?;
    let esnext_pair = builder.create_pair(esnext_k, esnext_v);
    esnext_setout.create_map("ESNEXT_FALLBACK_SET".into(), esnext_pair, &mut builder)?;

    let _esnext_k_seq = builder.create_u32_seq(
        "EsnextKeys".into(),
        esnext_setout.reorder(&esnext_modules).copied(),
    )?;

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
            version.0, version.1, version.2,
        )?;
    }

    write!(codeout, "];")?;

    // 生成 esnext 模块集合的结构体
    if !esnext_modules.is_empty() {
        writeln!(codeout, "\nstruct EsnextKeysStringId;")?;
        writeln!(
            codeout,
            "\nimpl precomputed_map::store::AccessSeq for EsnextKeysStringId {{"
        )?;
        writeln!(codeout, "    type Item = &'static str;")?;
        writeln!(
            codeout,
            "    const LEN: usize = {};\n",
            esnext_modules.len()
        )?;
        writeln!(
            codeout,
            "    fn index(index: usize) -> Option<Self::Item> {{"
        )?;
        writeln!(codeout, "        let id = EsnextKeys::index(index)?;")?;
        writeln!(codeout, "        Some(crate::util::PooledStr(id).as_str())")?;
        writeln!(codeout, "    }}")?;
        writeln!(codeout, "}}")?;
    }

    Ok(())
}

fn corejs3_compat(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    feature2browser(
        strpool,
        &crate_dir.join("data/core-js-compat/data.json"),
        &out_dir.join("corejs3_compat"),
    )
}

fn corejs3_builtin(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    use serde::Deserialize;

    #[derive(Deserialize)]
    #[serde(deny_unknown_fields)]
    struct Descriptor<'a> {
        pure: Option<&'a str>,
        global: Vec<&'a str>,
        name: &'a str,
        #[serde(default)]
        exclude: Vec<&'a str>,
    }

    #[derive(Deserialize)]
    #[serde(deny_unknown_fields)]
    struct Data<'a> {
        #[serde(borrow)]
        built_ins: BTreeMap<&'a str, Descriptor<'a>>,
        instance_properties: BTreeMap<&'a str, Descriptor<'a>>,
        static_properties: BTreeMap<&'a str, BTreeMap<&'a str, Descriptor<'a>>>,
    }

    const SEED_BUILTINS: u64 = 16416001479773392852;
    const SEED_INSTRANCE: u64 = 16416001479773392854;
    const SEED_STATIC: u64 = 16416001479773392852;

    let out_dir = out_dir.join("corejs3_builtin");
    let mut data = String::new();
    let data: Data<'_> = prepare(
        &out_dir,
        &crate_dir.join("data/corejs3/builtin.json"),
        &mut data,
    )?;

    let mut global_store = StrList::default();
    let mut exclude_store = StrList::default();

    let mut built_ins = Vec::new();
    for (k, desc) in &data.built_ins {
        let k = strpool.insert(k);

        let name_id = strpool.insert(desc.name);
        let pure_id = desc.pure.map(|s| strpool.insert(s)).unwrap_or_default();
        let global_id = global_store.push(desc.global.iter().map(|s| strpool.insert(s)));
        let exclude_id = exclude_store.push(desc.exclude.iter().map(|s| strpool.insert(s)));

        built_ins.push((k, (name_id, pure_id, global_id, exclude_id)));
    }

    let mut instance_properties = Vec::new();
    for (k, desc) in &data.instance_properties {
        let k = strpool.insert(k);

        let name_id = strpool.insert(desc.name);
        let pure_id = desc.pure.map(|s| strpool.insert(s)).unwrap_or_default();
        let global_id = global_store.push(desc.global.iter().map(|s| strpool.insert(s)));
        let exclude_id = exclude_store.push(desc.exclude.iter().map(|s| strpool.insert(s)));

        instance_properties.push((k, (name_id, pure_id, global_id, exclude_id)));
    }

    let mut static_props_store = Vec::new();
    let mut static_properties = Vec::new();
    for (k, map) in &data.static_properties {
        let k = strpool.insert(k);

        let start: u32 = static_props_store.len().try_into().unwrap();
        for (p, desc) in map {
            let p = strpool.insert(p);

            let name_id = strpool.insert(desc.name);
            let pure_id = desc.pure.map(|s| strpool.insert(s)).unwrap_or_default();
            let global_id = global_store.push(desc.global.iter().map(|s| strpool.insert(s)));
            let exclude_id = exclude_store.push(desc.exclude.iter().map(|s| strpool.insert(s)));

            static_props_store.push((p, (name_id, pure_id, global_id, exclude_id)));
        }
        let end: u32 = static_props_store.len().try_into().unwrap();
        static_properties.push((k, (start, end)));
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
    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;

    // builtin
    {
        let (keys, values): (Vec<_>, Vec<_>) = built_ins.into_iter().unzip();
        let mapout = precomputed_map::builder::MapBuilder::<u32>::new()
            .set_seed(SEED_BUILTINS)
            .set_hash(&|seed, &v| foldhash_once(seed, &strpool.get(v)))
            .set_next_seed(|seed, c| seed + c)
            .build(&keys)?;
        check_seed("corejs3_builtin_0", mapout.seed(), SEED_BUILTINS);

        create_pooledstr_keys(&mut codeout, "BuiltinsKeys", mapout.reorder(&keys).copied())?;
        writeln!(
            codeout,
            "const BUILTINS_VALUES: &[(u32, u32, u32, u32)] = &["
        )?;
        for value in mapout.reorder(&values) {
            writeln!(
                codeout,
                "({}, {}, {}, {}),",
                value.0, value.1, value.2, value.3
            )?;
        }
        writeln!(codeout, "];")?;

        let keys = builder.create_custom("BuiltinsKeys".into());
        mapout.create_map("BUILTIN_INDEX".into(), keys, &mut builder)?;
    }

    // instance_properties
    {
        let (keys, values): (Vec<_>, Vec<_>) = instance_properties.into_iter().unzip();
        let mapout = precomputed_map::builder::MapBuilder::<u32>::new()
            .set_seed(SEED_INSTRANCE)
            .set_hash(&|seed, &v| foldhash_once(seed, &strpool.get(v)))
            .set_next_seed(|seed, c| seed + c)
            .build(&keys)?;
        check_seed("corejs3_builtin_1", mapout.seed(), SEED_INSTRANCE);

        create_pooledstr_keys(
            &mut codeout,
            "InstancePropsKeys",
            mapout.reorder(&keys).copied(),
        )?;
        writeln!(
            codeout,
            "const INSTRANCE_PROPS_VALUES: &[(u32, u32, u32, u32)] = &["
        )?;
        for value in mapout.reorder(&values) {
            writeln!(
                codeout,
                "({}, {}, {}, {}),",
                value.0, value.1, value.2, value.3
            )?;
        }
        writeln!(codeout, "];")?;

        let keys = builder.create_custom("InstancePropsKeys".into());
        mapout.create_map("INSTRANCE_PROPS_INDEX".into(), keys, &mut builder)?;
    }

    // static_properties
    {
        let (keys, values): (Vec<_>, Vec<_>) = static_properties.into_iter().unzip();
        let mapout = precomputed_map::builder::MapBuilder::<u32>::new()
            .set_seed(SEED_STATIC)
            .set_hash(&|seed, &v| foldhash_once(seed, &strpool.get(v)))
            .set_next_seed(|seed, c| seed + c)
            .build(&keys)?;
        check_seed("corejs3_builtin_2", mapout.seed(), SEED_STATIC);

        create_pooledstr_keys(
            &mut codeout,
            "StaticPropsKeys",
            mapout.reorder(&keys).copied(),
        )?;
        writeln!(codeout, "const STATIC_PROPS_LIST: &[(u32, u32)] = &[")?;
        for value in mapout.reorder(&values) {
            writeln!(codeout, "({}, {}),", value.0, value.1)?;
        }
        writeln!(codeout, "];")?;

        writeln!(
            codeout,
            "const STATIC_PROPS_STORE: &[(PooledStr, (u32, u32, u32, u32))] = &["
        )?;
        for (p, value) in &static_props_store {
            writeln!(
                codeout,
                "(PooledStr({}), ({}, {}, {}, {})),",
                p, value.0, value.1, value.2, value.3
            )?;
        }
        writeln!(codeout, "];")?;

        let keys = builder.create_custom("StaticPropsKeys".into());
        mapout.create_map("STATIC_PROPS_INDEX".into(), keys, &mut builder)?;
    }

    // common, promise, ..
    {
        static COMMON_ITERATORS: &[&str] = &[
            "es.array.iterator",
            "web.dom-collections.iterator",
            "es.string.iterator",
        ];
        static PROMISE_DEPENDENCIES: &[&str] = &["es.promise", "es.object.to-string"];

        write!(codeout, "const COMMON_ITERATORS: &[PooledStr] = &[")?;
        for s in COMMON_ITERATORS {
            write!(codeout, "PooledStr({}),", strpool.insert(s))?;
        }
        writeln!(codeout, "];")?;

        write!(codeout, "const PROMISE_DEPENDENCIES: &[PooledStr] = &[")?;
        for s in PROMISE_DEPENDENCIES {
            write!(codeout, "PooledStr({}),", strpool.insert(s))?;
        }
        writeln!(codeout, "];")?;
    }

    builder.create_u32_seq("GlobalStore".into(), global_store.0.iter().copied())?;
    builder.create_u32_seq("ExcludeStore".into(), exclude_store.0.iter().copied())?;

    builder.codegen(&mut codeout)?;
    u8seq.codegen(&mut codeout)?;
    u32seq.codegen(&mut codeout)?;

    Ok(())
}

fn corejs2_data(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    use serde::Deserialize;

    #[derive(Deserialize)]
    #[serde(deny_unknown_fields)]
    struct Data<'a> {
        #[serde(borrow)]
        builtin_types: BTreeMap<&'a str, Vec<&'a str>>,
        instance_properties: BTreeMap<&'a str, Vec<&'a str>>,
        static_properties: BTreeMap<&'a str, BTreeMap<&'a str, Vec<&'a str>>>,
    }

    const SEED: u64 = 16416001479773392852;

    let out_dir = out_dir.join("corejs2_data");
    let mut data = String::new();
    let data: Data<'_> = prepare(
        &out_dir,
        &crate_dir.join("data/corejs2/data.json"),
        &mut data,
    )?;

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

    let (instance_keys, instance_values): (Vec<_>, Vec<_>) =
        instance_properties.into_iter().unzip();
    let mapout = precomputed_map::builder::MapBuilder::<u32>::new()
        .set_seed(SEED)
        .set_hash(&|seed, &v| foldhash_once(seed, &strpool.get(v)))
        .set_next_seed(|seed, c| seed + c)
        .build(&instance_keys)?;
    check_seed("corejs2_data", mapout.seed(), SEED);

    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;

    writeln!(codeout, r#"const LIST_STORE: &[PooledStr] = &["#,)?;
    for u in &list_store {
        writeln!(codeout, "PooledStr({u}),")?;
    }

    writeln!(
        codeout,
        r#"];

const BUILTIN_TYPES: &[(PooledStr, u32, u32)] = &[
"#
    )?;
    for (k, start, end) in &builtin_types {
        writeln!(codeout, "(PooledStr({k}), {start}, {end}),")?;
    }

    writeln!(
        codeout,
        r#"];

const STATIC_PROPERTIES_STORE: &[(PooledStr, u32, u32)] = &[
    "#
    )?;
    for (k, start, end) in &static_props_store {
        writeln!(codeout, "(PooledStr({k}), {start}, {end}),")?;
    }

    writeln!(
        codeout,
        r#"];

const STATIC_PROPERTIES: &[(PooledStr, u32, u32)] = &[
    "#
    )?;
    for (k, start, end) in &static_properties {
        writeln!(codeout, "(PooledStr({k}), {start}, {end}),")?;
    }

    write!(
        codeout,
        r#"];

const INSTANCE_PROPERTIES_VALUES: &[(u32, u32)] = &["#
    )?;
    for (start, end) in mapout.reorder(&instance_values) {
        write!(codeout, "({start}, {end}),")?;
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
    create_pooledstr_keys(
        &mut codeout,
        "InstancePropertiesKeys",
        mapout.reorder(&instance_keys).copied(),
    )?;

    builder.codegen(&mut codeout)?;
    u8seq.codegen(&mut codeout)?;
    u32seq.codegen(&mut codeout)?;

    Ok(())
}

fn corejs2_builtin(strpool: &mut StrPool, crate_dir: &Path, out_dir: &Path) -> anyhow::Result<()> {
    feature2browser(
        strpool,
        &crate_dir.join("data/corejs2/builtin.json"),
        &out_dir.join("corejs2_builtin"),
    )
}

fn feature2browser(strpool: &mut StrPool, json: &Path, out_dir: &Path) -> anyhow::Result<()> {
    let mut data = String::new();
    let data: BTreeMap<&str, BTreeMap<&str, &str>> = prepare(out_dir, json, &mut data)?;

    let mut features = Vec::new();
    let mut version_store = Vec::new();
    for (feature, browsers) in data {
        let feature = strpool.insert(feature);
        let start: u32 = version_store.len().try_into().unwrap();
        version_store.extend(browsers.iter().map(|(b, v)| {
            (
                // To make `BrowserData::insert` work
                strpool.insert(&b.replace('-', "_")),
                strpool.insert(v),
            )
        }));
        let end: u32 = version_store.len().try_into().unwrap();
        features.push((feature, start, end));
    }

    let mut codeout = fs::File::create(out_dir.join("lib.rs"))?;

    writeln!(codeout, r#"const FEATURES: &[(PooledStr, u32, u32)] = &["#)?;
    for (feature, start, end) in &features {
        writeln!(codeout, "(PooledStr({feature}), {start}, {end}),")?;
    }

    writeln!(
        codeout,
        r#"];

const VERSION_STORE: &[(PooledStr, PooledStr)] = &["#
    )?;
    for (browser, version) in &version_store {
        writeln!(codeout, "(PooledStr({browser}), PooledStr({version})),")?;
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
        assert!(!s.is_empty());

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

#[derive(Default)]
pub struct StrList(Vec<u32>);

impl StrList {
    fn push(&mut self, iter: impl Iterator<Item = u32>) -> u32 {
        let offset = self.0.len();
        self.0.extend(iter);
        let len: u8 = (self.0.len() - offset).try_into().unwrap();
        let offset: u32 = offset.try_into().unwrap();

        if offset > (1 << 24) {
            panic!("string too large");
        }

        if len != 0 {
            offset | (u32::from(len) << 24)
        } else {
            0
        }
    }
}

fn foldhash_once<V: Hash>(seed: u64, v: &V) -> u64 {
    use std::hash::Hasher;

    let mut hasher =
        foldhash::fast::FoldHasher::with_seed(seed, foldhash::SharedSeed::global_fixed());
    v.hash(&mut hasher);
    hasher.finish()
}

fn prepare<'buf, T: serde::Deserialize<'buf>>(
    dir: &Path,
    json: &Path,
    buf: &'buf mut String,
) -> anyhow::Result<T> {
    fs::remove_dir_all(dir).or_else(|err| {
        (err.kind() == io::ErrorKind::NotFound)
            .then_some(())
            .ok_or(err)
    })?;
    fs::create_dir(dir)?;

    println!("cargo::rerun-if-changed={}", json.display());

    *buf = fs::read_to_string(json)?;
    let data: T =
        serde_json::from_str(buf).with_context(|| format!("failed to parse {}", json.display()))?;

    Ok(data)
}

fn version(s: &str) -> (u32, u32, u32) {
    // A non-universal version parser that only works with specified data

    let mut iter = s.split('.');
    let major = iter.next().unwrap().parse::<u32>().unwrap();
    let minor = iter.next().unwrap().parse::<u32>().unwrap();
    let patch = iter
        .next()
        .map(|s| s.parse::<u32>().unwrap())
        .unwrap_or_default();

    assert!(iter.next().is_none());

    (major, minor, patch)
}

fn check_seed(name: &str, new_seed: Option<u64>, prev_seed: u64) {
    if let Some(seed) = new_seed.filter(|&seed| seed != prev_seed) {
        println!(
            "cargo::warning=The `{name}` seed has changed, please update the seed to {seed} for \
             faster builds"
        );
    }
}

fn create_pooledstr_keys(
    codeout: &mut fs::File,
    name: &str,
    index_list: impl ExactSizeIterator<Item = u32>,
) -> anyhow::Result<()> {
    writeln!(
        codeout,
        r#"struct {name};

impl precomputed_map::store::AccessSeq for {name} {{
    type Item = &'static str;
    const LEN: usize = {};

    fn index(index: usize) -> Option<Self::Item> {{
        const LIST: &[PooledStr] = &["#,
        index_list.len()
    )?;

    for id in index_list {
        writeln!(codeout, "PooledStr({id}),")?;
    }

    writeln!(
        codeout,
        r#"
        ];
        
        LIST.get(index).map(|s| s.as_str())
    }}
}}"#
    )?;

    Ok(())
}
