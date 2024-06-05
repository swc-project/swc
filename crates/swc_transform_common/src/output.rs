use serde_json::Value;

pub fn capture<Ret>(f: impl FnOnce() -> Ret) -> (Ret, FxHashMap<String, Value>) {}

pub fn emit(key: String, value: Value) {}
