---
name: codspeed-setup-harness
description: "Set up performance benchmarks and CodSpeed harness for a project. Use this skill whenever the user wants to create benchmarks, add performance tests, set up CodSpeed, configure codspeed.yml, integrate a benchmarking framework (criterion, divan, pytest-benchmark, vitest bench, go test -bench, google benchmark), or when the user says 'add benchmarks', 'set up perf tests', 'create a benchmark', 'benchmark this', or wants to measure performance of their code for the first time. Also trigger when the optimize skill needs benchmarks that don't exist yet."
---

# Setup Harness

You are a performance engineer helping set up benchmarks and CodSpeed integration for a project. Your goal is to create useful, representative benchmarks and wire them up so CodSpeed can measure and track performance.

## Step 1: Analyze the project

Before writing any benchmark code, understand what you're working with:

1. **Detect the language and build system**: Look at the project structure, package files (`Cargo.toml`, `package.json`, `pyproject.toml`, `go.mod`, `CMakeLists.txt`), and source files.

2. **Identify existing benchmarks**: Check for benchmark files, `codspeed.yml`, CI workflows mentioning CodSpeed or benchmarks.

3. **Identify hot paths**: Look at the codebase to understand what the performance-critical code is. Public API functions, data processing pipelines, I/O-heavy operations, and algorithmic code are good candidates.

4. **Check CodSpeed auth**: Ensure `codspeed auth login` has been run.

## Step 2: Choose the right approach

Based on the language and what the user wants to benchmark, pick the right harness:

### Language-specific harnesses (recommended when available)

These integrate deeply with CodSpeed and provide per-benchmark flamegraphs, fine-grained comparison, and simulation mode support.

| Language    | Framework                                        | How to set up                                                              |
| ----------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| **Rust**    | divan (recommended), criterion, bencher          | Add `codspeed-<framework>-compat` as dependency using `cargo add --rename` |
| **Python**  | pytest-benchmark                                 | Install `pytest-codspeed`, use `@pytest.benchmark` or `benchmark` fixture  |
| **Node.js** | vitest (recommended), tinybench v5, benchmark.js | Install `@codspeed/<framework>-plugin`, configure in vitest/test config    |
| **Go**      | go test -bench                                   | No packages needed — CodSpeed instruments `go test -bench` directly        |
| **C/C++**   | Google Benchmark                                 | Build with CMake, CodSpeed instruments via valgrind-codspeed               |

### Exec harness (universal)

For any language or when you want to benchmark a whole program (not individual functions):

- Use `codspeed exec -m <mode> -- <command>` for one-off benchmarks
- Or create a `codspeed.yml` with benchmark definitions for repeatable setups

The exec harness requires no code changes — it instruments the binary externally. This is ideal for:

- Languages without a dedicated CodSpeed integration
- End-to-end benchmarks (full program execution)
- Quick setup when you just want to track a command's performance

### Choosing simulation vs walltime mode

- **Simulation** (default for Rust, Python, Node.js, C/C++): Deterministic CPU simulation, <1% variance, automatic flamegraphs. Best for CPU-bound code. Does not measure system calls or I/O.
- **Walltime** (default for Go): Measures real execution time including I/O, threading, system calls. Best for I/O-heavy or multi-threaded code. Requires consistent hardware (use CodSpeed Macro Runners in CI).
- **Memory**: Tracks heap allocations. Best for reducing memory usage. Supported for Rust, C/C++ with libc/jemalloc/mimalloc.

## Step 3: Set up the harness

### Rust with divan (recommended)

1. Add the dependency:

```bash
cargo add divan
cargo add codspeed-divan-compat --rename divan --dev
```

2. Create a benchmark file in `benches/`:

```rust
// benches/my_bench.rs
use divan;

fn main() {
    divan::main();
}

#[divan::bench]
fn bench_my_function() {
    // Call the function you want to benchmark
    // Use divan::black_box() to prevent compiler optimization
    divan::black_box(my_crate::my_function());
}
```

3. Add to `Cargo.toml`:

```toml
[[bench]]
name = "my_bench"
harness = false
```

4. Build and run:

```bash
cargo codspeed build -m simulation --bench my_bench
codspeed run -m simulation -- cargo codspeed run --bench my_bench
```

### Rust with criterion

1. Add dependencies:

```bash
cargo add criterion --dev
cargo add codspeed-criterion-compat --rename criterion --dev
```

2. Create benchmark in `benches/`:

```rust
use criterion::{criterion_group, criterion_main, Criterion};

fn bench_my_function(c: &mut Criterion) {
    c.bench_function("my_function", |b| {
        b.iter(|| my_crate::my_function())
    });
}

criterion_group!(benches, bench_my_function);
criterion_main!(benches);
```

3. Add to `Cargo.toml` and build/run same as divan.

### Python with pytest-codspeed

1. Install:

```bash
pip install pytest-codspeed
# or
uv add --dev pytest-codspeed
```

2. Create benchmark tests:

```python
# tests/test_benchmarks.py
import pytest

def test_my_function(benchmark):
    result = benchmark(my_module.my_function, arg1, arg2)
    # You can still assert on the result
    assert result is not None

# Or using the pedantic API for setup/teardown:
def test_with_setup(benchmark):
    data = prepare_data()
    benchmark.pedantic(my_module.process, args=(data,), rounds=100)
```

3. Run:

```bash
codspeed run -m simulation -- pytest --codspeed
```

### Node.js with vitest (recommended)

1. Install:

```bash
npm install -D @codspeed/vitest-plugin
# or
pnpm add -D @codspeed/vitest-plugin
```

2. Configure vitest (`vitest.config.ts`):

```typescript
import { defineConfig } from "vitest/config";
import codspeed from "@codspeed/vitest-plugin";

export default defineConfig({
  plugins: [codspeed()],
});
```

3. Create benchmark file:

```typescript
// bench/my.bench.ts
import { bench, describe } from "vitest";

describe("my module", () => {
  bench("my function", () => {
    myFunction();
  });
});
```

4. Run:

```bash
codspeed run -m simulation -- npx vitest bench
```

### Go

No packages needed — CodSpeed instruments `go test -bench` directly.

1. Create benchmark tests:

```go
// my_test.go
func BenchmarkMyFunction(b *testing.B) {
    for i := 0; i < b.N; i++ {
        MyFunction()
    }
}
```

2. Run (walltime is the default for Go):

```bash
codspeed run -m walltime -- go test -bench . ./...
```

### C/C++ with Google Benchmark

1. Install Google Benchmark (via CMake FetchContent or system package)

2. Create benchmark:

```cpp
#include <benchmark/benchmark.h>

static void BM_MyFunction(benchmark::State& state) {
    for (auto _ : state) {
        MyFunction();
    }
}
BENCHMARK(BM_MyFunction);

BENCHMARK_MAIN();
```

3. Build and run with CodSpeed:

```bash
cmake -B build && cmake --build build
codspeed run -m simulation -- ./build/my_benchmark
```

### Exec harness (any language)

For benchmarking whole programs without code changes:

1. Create `codspeed.yml`:

```yaml
$schema: https://raw.githubusercontent.com/CodSpeedHQ/codspeed/refs/heads/main/schemas/codspeed.schema.json

options:
  warmup-time: "1s"
  max-time: 5s

benchmarks:
  - name: "My program - small input"
    exec: ./my_binary --input small.txt

  - name: "My program - large input"
    exec: ./my_binary --input large.txt
    options:
      max-time: 30s
```

2. Run:

```bash
codspeed run -m walltime
```

Or for a one-off:

```bash
codspeed exec -m walltime -- ./my_binary --input data.txt
```

## Step 4: Write good benchmarks

Good benchmarks are representative, isolated, and stable. Here are guidelines:

- **Benchmark real workloads**: Use realistic input data and sizes. A sort benchmark on 10 elements tells you nothing about how 10 million elements will perform.

- **Avoid benchmarking setup**: Use the framework's setup/teardown mechanisms to exclude initialization from measurements.

- **Prevent dead code elimination**: Use `black_box()` (Rust), `benchmark::DoNotOptimize` (C++), or `Blackhole.consume` (JMH) so the compiler doesn't optimize away unused results.

- **Cover the critical path**: Benchmark the functions that matter most to your users — the ones called frequently or on the hot path.

- **Test multiple scenarios**: Different input sizes, different data distributions, edge cases. Performance characteristics often change with scale.

- **Keep benchmarks fast**: Individual benchmarks should complete in milliseconds to low seconds. CodSpeed handles warmup and repetition — you provide the single iteration.

## Step 5: Verify and run

After setting up:

1. **Run the benchmarks locally** to verify they work:

```bash
# For language-specific harnesses
cargo codspeed build -m simulation && codspeed run -m simulation -- cargo codspeed run
# or
codspeed run -m simulation -- pytest --codspeed
# or
codspeed run -m simulation -- npx vitest bench
# etc.

# For exec harness
codspeed run -m walltime
```

2. **Check the output**: You should see a results table and a link to the CodSpeed report.

3. **Verify flamegraphs**: For simulation mode, check that flamegraphs are generated by visiting the report link or using the `query_flamegraph` MCP tool.

4. **Tell the user** what was set up, show the first results, and suggest next steps (e.g., adding CI integration, running the `optimize` skill).
