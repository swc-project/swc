use swc_core::{
    common::DUMMY_SP,
    ecma::{ast::*, atoms::*, visit::*},
    plugin::{
        errors::HANDLER,
        metadata::{TransformPluginMetadataContextKind, TransformPluginProgramMetadata},
        plugin_transform,
    },
    quote,
};

#[plugin_transform]
pub fn process_transform(
    mut program: Program,
    metadata: TransformPluginProgramMetadata,
) -> Program {
    for i in 1..50000 {
        let j: u32 = i;
        println!("i {} j {}", i, j);
        metadata.source_map.span_to_snippet(Span::new(
            BytePos(j),
            BytePos(j + 10),
            SyntaxContext::empty(),
        ));
    }

    program
}
