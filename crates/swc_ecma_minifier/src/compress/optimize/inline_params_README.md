# Function Parameter Inlining Optimization

## Overview

This module implements a function parameter inlining optimization for SWC's minifier. It identifies function parameters that are consistently passed the same constant value across ALL call sites and inlines those values into the function body.

## Motivation

This optimization helps eliminate unused optional callbacks and configuration parameters in production builds, reducing bundle size and enabling further optimizations.

### Example

**Before:**
```javascript
function complex(foo, fn) {
  return fn?.(foo)
}

complex(1, undefined)
complex(2, undefined)
complex(3, undefined)
```

**After:**
```javascript
function complex(foo) {
  const fn = undefined;
  return fn?.(foo)
}

complex(1)
complex(2)
complex(3)
```

## How It Works

### 1. Analysis Phase
- Track all call sites for each function
- Collect actual arguments passed to each parameter position
- Identify parameters that receive the same constant value across ALL call sites

### 2. Safety Checks
Before inlining a parameter, the optimization verifies:
- ✓ No use of `arguments` object
- ✓ No use of `Function.length` property on the target function
- ✓ No dynamic calls (apply, call, bind) that might pass different arguments
- ✓ Function is not exported or used in contexts where signature matters
- ✓ All call sites are known and within the compilation unit
- ✓ Parameter is not used in destructuring or rest patterns

### 3. Transformation Phase
For each identified parameter:
- Remove the parameter from the function signature
- Add a const variable declaration at the start of the function body
- Update all call sites to remove the corresponding argument

## Supported Constants

For safety, we only inline simple constant values:
- `undefined` (including `void 0`)
- `null`
- Boolean literals (`true`, `false`)
- Number literals
- Small string literals (≤ 10 characters)

## Edge Cases

### Will NOT optimize:
- Functions with `arguments` object usage
- Functions where `Function.length` is accessed
- Functions used as values (not just called)
- Functions with dynamic calls
- Parameters with different values across call sites
- Rest parameters (`...args`)
- Destructuring parameters
- Functions with no call sites
- Exported functions

### Example - Mixed Arguments (No Optimization):
```javascript
function test(a, b) {
    return a + b;
}
test(1, undefined);
test(2, null);  // Different value! Cannot inline
```

### Example - Using arguments (No Optimization):
```javascript
function test(a, b) {
    return arguments.length;  // Uses arguments! Cannot inline
}
test(1, undefined);
test(2, undefined);
```

## Integration

This optimization is integrated into the SWC minifier pipeline and runs as part of the `compress/optimize` phase. It respects the existing minifier options:

- Controlled by the `inline` option level
- Works in conjunction with `reduce_vars` and `collapse_vars`
- Conservative by default: when in doubt, don't optimize

## Performance Considerations

- The optimization is designed to be efficient on large codebases
- Uses existing usage analysis infrastructure
- Minimal overhead when optimization opportunities are not present
- Performance-first approach per SWC project guidelines

## Implementation Status

**Phase 1 (Current):** ✓ Infrastructure and safety checks
- Module structure created
- Safety validation methods implemented
- Test infrastructure prepared
- Documentation written

**Phase 2 (Next):** Call site tracking
- Extend VarUsageInfo to track call site arguments
- Aggregate argument data during usage analysis
- Build parameter-to-constant mapping

**Phase 3 (Future):** Transformation
- Implement function signature transformation
- Update function bodies with const declarations
- Update all call sites to remove inlined arguments

**Phase 4 (Future):** Testing and refinement
- Comprehensive test coverage
- Real-world validation
- Performance benchmarking
- Consider making opt-in initially

## References

- Original issue: https://github.com/swc-project/swc/issues/10931
- Google Closure Compiler inspiration: https://thomasdeegan.medium.com/10-optimizations-closure-compiler-can-do-and-uglify-friends-cant-6dca4232299f
- SWC Minifier docs: https://rustdoc.swc.rs/swc_ecma_minifier/

## Testing

Run tests with:
```bash
cargo test -p swc_ecma_minifier inline_params
```

Test fixtures are located in:
```
tests/fixture/issues/10931/
```
