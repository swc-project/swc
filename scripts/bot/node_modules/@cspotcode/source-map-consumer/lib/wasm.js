const readWasm = require("../lib/read-wasm");

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.lastGeneratedColumn = null;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

let cachedWasm = null;
let cachedWasmSync = null;

module.exports = async function wasm() {
  if (cachedWasm) {
    return cachedWasm;
  }

  // At every step of the way, if a sync load already succeeded, abort and return
  // the sync-loaded module.
  cachedWasm = async () => {
    try {
      const callbackStack = [];

      const buffer = await readWasm();
      if (cachedWasmSync) return cachedWasmSync;
      const Wasm = await WebAssembly.instantiate(buffer, getImportObject({callbackStack}));
      if (cachedWasmSync) return cachedWasmSync;

      cachedWasmSync = {
        exports: Wasm.instance.exports,
        withMappingCallback: (mappingCallback, f) => {
          callbackStack.push(mappingCallback);
          try {
            f();
          } finally {
            callbackStack.pop();
          }
        }
      };
    } catch (e) {
      if (cachedWasmSync) return cachedWasmSync;
      cachedWasm = null;
      throw e;
    }
    return cachedWasmSync;
  };

  return cachedWasm;
};

module.exports.sync = function wasmSync() {
  if (cachedWasmSync) {
    return cachedWasmSync;
  }

  const callbackStack = [];

  try {

    const cachedWasmBuffer = readWasm.sync();
    const wasmModule = new WebAssembly.Module(cachedWasmBuffer);
    const Wasm = new WebAssembly.Instance(wasmModule, getImportObject({callbackStack}));

    cachedWasmSync = {
      exports: Wasm.exports,
      withMappingCallback: (mappingCallback, f) => {
        callbackStack.push(mappingCallback);
        try {
          f();
        } finally {
          callbackStack.pop();
        }
      }
    };
  } catch (e) {
    cachedWasmSync = null;
    throw e;
  }

  return cachedWasmSync;
};

function getImportObject({callbackStack}) {
  return {
    env: {
      mapping_callback(
        generatedLine,
        generatedColumn,

        hasLastGeneratedColumn,
        lastGeneratedColumn,

        hasOriginal,
        source,
        originalLine,
        originalColumn,

        hasName,
        name
      ) {
        const mapping = new Mapping();
        // JS uses 1-based line numbers, wasm uses 0-based.
        mapping.generatedLine = generatedLine + 1;
        mapping.generatedColumn = generatedColumn;

        if (hasLastGeneratedColumn) {
          // JS uses inclusive last generated column, wasm uses exclusive.
          mapping.lastGeneratedColumn = lastGeneratedColumn - 1;
        }

        if (hasOriginal) {
          mapping.source = source;
          // JS uses 1-based line numbers, wasm uses 0-based.
          mapping.originalLine = originalLine + 1;
          mapping.originalColumn = originalColumn;

          if (hasName) {
            mapping.name = name;
          }
        }

        callbackStack[callbackStack.length - 1](mapping);
      },

      start_all_generated_locations_for() { console.time("all_generated_locations_for"); },
      end_all_generated_locations_for() { console.timeEnd("all_generated_locations_for"); },

      start_compute_column_spans() { console.time("compute_column_spans"); },
      end_compute_column_spans() { console.timeEnd("compute_column_spans"); },

      start_generated_location_for() { console.time("generated_location_for"); },
      end_generated_location_for() { console.timeEnd("generated_location_for"); },

      start_original_location_for() { console.time("original_location_for"); },
      end_original_location_for() { console.timeEnd("original_location_for"); },

      start_parse_mappings() { console.time("parse_mappings"); },
      end_parse_mappings() { console.timeEnd("parse_mappings"); },

      start_sort_by_generated_location() { console.time("sort_by_generated_location"); },
      end_sort_by_generated_location() { console.timeEnd("sort_by_generated_location"); },

      start_sort_by_original_location() { console.time("sort_by_original_location"); },
      end_sort_by_original_location() { console.timeEnd("sort_by_original_location"); },
    }
  };
}
