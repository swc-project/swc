### Fixture Test Addition Guide

- Preferred fixture roots in this crate: \.
- Update generated fixture outputs with: \
running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s


running 2 tests
test swc_core_wasm_integration_build ... FAILED
test swc_core_napi_integration_build ... FAILED

failures:

---- swc_core_wasm_integration_build stdout ----
Error: Failed to build binary

---- swc_core_napi_integration_build stdout ----
Error: Failed to build binary


failures:
    swc_core_napi_integration_build
    swc_core_wasm_integration_build

test result: FAILED. 0 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 22.37s.
- Verify without UPDATE before finishing: \
running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s


running 2 tests
test swc_core_wasm_integration_build ... FAILED
test swc_core_napi_integration_build ... FAILED

failures:

---- swc_core_wasm_integration_build stdout ----
Error: Failed to build binary

---- swc_core_napi_integration_build stdout ----
Error: Failed to build binary


failures:
    swc_core_napi_integration_build
    swc_core_wasm_integration_build

test result: FAILED. 0 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 22.75s.
