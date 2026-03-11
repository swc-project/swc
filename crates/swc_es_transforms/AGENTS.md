### Instructions

- This crate must operate in exactly two passes.
- Pass 1 is the analysis pass. It must collect data only and must not transform the AST.
- Pass 2 is the transform pass. It must apply transformations using data from pass 1.
- Do not add a third pass, and do not merge analysis and transformation into a single pass.
- Never add dependencies on any `swc_ecma_*` crate.

