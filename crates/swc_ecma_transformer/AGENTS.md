### Instructions

-   The Transformer must implement `VisitMut` and execute the `VisitMutHooks` of its subtypes.
-   Other types like ES20xx or transforms for specific syntax MUST NOT implement `VisitMut`.
-   Subtypes must implement `VisitMutHook<TraverseCtx>`.
-   Before starting work, read `$repositoryRoot/crates/swc_ecma_hooks/src/`.
