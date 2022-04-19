use std::sync::Arc;

use anyhow::{anyhow, Error};
use parking_lot::Mutex;
use swc_common::{
    plugin::{PluginError, Serialized},
    SourceMap,
};
use wasmer::Instance;

use crate::memory_interop::write_into_memory_view;

/// A struct encapsule executing a plugin's transform interop to its teardown
pub struct TransformExecutor {
    // Main transform interface plugin exports
    exported_plugin_transform: wasmer::NativeFunc<(i32, i32, i32, i32, i32, i32, i32), i32>,
    // `__free` function automatically exported via swc_plugin sdk to allow deallocation in guest
    // memory space
    exported_plugin_free: wasmer::NativeFunc<(i32, i32), i32>,
    // `__alloc` function automatically exported via swc_plugin sdk to allow allocation in guest
    // memory space
    exported_plugin_alloc: wasmer::NativeFunc<u32, i32>,
    instance: Instance,
    // Reference to the pointers successfully allocated which'll be freed by Drop.
    allocated_ptr_vec: Vec<(i32, i32)>,
    transform_result: Arc<Mutex<Vec<u8>>>,
}

impl TransformExecutor {
    #[tracing::instrument(level = "info", skip(cache, source_map))]
    pub fn new(
        path: &std::path::Path,
        cache: &once_cell::sync::Lazy<crate::cache::PluginModuleCache>,
        source_map: &Arc<SourceMap>,
    ) -> Result<TransformExecutor, Error> {
        let (instance, transform_result) =
            crate::load_plugin::load_plugin(path, cache, source_map)?;

        let tracker = TransformExecutor {
            exported_plugin_transform: instance
                .exports
                .get_native_function::<(i32, i32, i32, i32, i32, i32, i32), i32>(
                    "__plugin_process_impl",
                )?,
            exported_plugin_free: instance
                .exports
                .get_native_function::<(i32, i32), i32>("__free")?,
            exported_plugin_alloc: instance
                .exports
                .get_native_function::<u32, i32>("__alloc")?,
            instance,
            allocated_ptr_vec: Vec::with_capacity(3),
            transform_result,
        };

        Ok(tracker)
    }

    /// Copy host's serialized bytes into guest (plugin)'s allocated memory.
    /// Once transformation completes, host should free allocated memory.
    fn write_bytes_into_guest(
        &mut self,
        serialized_bytes: &Serialized,
    ) -> Result<(i32, i32), Error> {
        let memory = self.instance.exports.get_memory("memory")?;

        let ptr = write_into_memory_view(memory, serialized_bytes, |serialized_len| {
            self.exported_plugin_alloc
                .call(serialized_len.try_into().expect(""))
                .expect("")
        });

        self.allocated_ptr_vec.push(ptr);
        Ok(ptr)
    }

    /// Copy guest's memory into host, construct serialized struct from raw
    /// bytes.
    fn read_bytes_from_guest(&mut self, returned_ptr_result: i32) -> Result<Serialized, Error> {
        let transformed_result = &(*self.transform_result.lock());
        let ret =
            Serialized::new_for_plugin(&transformed_result[..], transformed_result.len() as i32);

        if returned_ptr_result == 0 {
            Ok(ret)
        } else {
            let err: PluginError = Serialized::deserialize(&ret)?;
            match err {
                PluginError::SizeInteropFailure(msg) => Err(anyhow!(
                    "Failed to convert pointer size to calculate: {}",
                    msg
                )),
                PluginError::Deserialize(msg) | PluginError::Serialize(msg) => {
                    Err(anyhow!("{}", msg))
                }
                _ => Err(anyhow!(
                    "Unexpected error occurred while running plugin transform"
                )),
            }
        }
    }

    #[tracing::instrument(level = "info", skip_all)]
    pub fn transform(
        &mut self,
        program: &Serialized,
        config: &Serialized,
        context: &Serialized,
        should_enable_comments_proxy: i32,
    ) -> Result<Serialized, Error> {
        let guest_program_ptr = self.write_bytes_into_guest(program)?;
        let config_str_ptr = self.write_bytes_into_guest(config)?;
        let context_str_ptr = self.write_bytes_into_guest(context)?;

        let result = self.exported_plugin_transform.call(
            guest_program_ptr.0,
            guest_program_ptr.1,
            config_str_ptr.0,
            config_str_ptr.1,
            context_str_ptr.0,
            context_str_ptr.1,
            should_enable_comments_proxy,
        )?;

        self.read_bytes_from_guest(result)
    }
}

impl Drop for TransformExecutor {
    fn drop(&mut self) {
        for ptr in self.allocated_ptr_vec.iter() {
            self.exported_plugin_free
                .call(ptr.0, ptr.1)
                .expect("Failed to free memory allocated in the plugin");
        }
    }
}
