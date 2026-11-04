//! Tests for individual transforms and custom transform pipelines.

/// Reads a pipeline selection from the fixture's containing group.
fn case_pipeline<P: serde::de::DeserializeOwned>(input: &std::path::Path) -> P {
    #[derive(serde::Deserialize)]
    #[serde(deny_unknown_fields)]
    struct Options<P> {
        pipeline: P,
    }

    let path = input
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .join("options.json");
    let options: Options<P> = serde_json::from_slice(&std::fs::read(&path).unwrap())
        .unwrap_or_else(|error| panic!("invalid {}: {error}", path.display()));
    options.pipeline
}

#[path = "composite/class_fields_use_set.rs"]
mod class_fields_use_set;
#[path = "composite/es2015_arrow.rs"]
mod es2015_arrow;
#[path = "composite/es2015_block_scoping.rs"]
mod es2015_block_scoping;
#[path = "composite/es2015_classes.rs"]
mod es2015_classes;
#[path = "composite/es2015_computed_props.rs"]
mod es2015_computed_props;
#[path = "composite/es2015_destructuring.rs"]
mod es2015_destructuring;
#[path = "composite/es2015_duplicated_keys.rs"]
mod es2015_duplicated_keys;
#[path = "composite/es2015_for_of.rs"]
mod es2015_for_of;
#[path = "composite/es2015_generator.rs"]
mod es2015_generator;
#[path = "composite/es2015_generator_sparse_array.rs"]
mod es2015_generator_sparse_array;
#[path = "composite/es2015_new_target.rs"]
mod es2015_new_target;
#[path = "composite/es2015_object_super.rs"]
mod es2015_object_super;
#[path = "composite/es2015_parameters.rs"]
mod es2015_parameters;
#[path = "composite/es2015_spread.rs"]
mod es2015_spread;
#[path = "composite/es2015_template_literals.rs"]
mod es2015_template_literals;
#[path = "composite/es2017_async_to_generator.rs"]
mod es2017_async_to_generator;
#[path = "composite/es2018_object_rest_spread.rs"]
mod es2018_object_rest_spread;
#[path = "composite/es2020_nullish_coalescing.rs"]
mod es2020_nullish_coalescing;
#[path = "composite/es2020_optional_chaining.rs"]
mod es2020_optional_chaining;
#[path = "composite/es2021_logcal_assignments.rs"]
mod es2021_logcal_assignments;
#[path = "composite/es2022_class_properties.rs"]
mod es2022_class_properties;
#[path = "composite/es2022_private_in_object.rs"]
mod es2022_private_in_object;
#[path = "composite/es2022_static_blocks.rs"]
mod es2022_static_blocks;
