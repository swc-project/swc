---
name: codspeed-optimize
description: "Autonomously optimize code for performance using CodSpeed benchmarks, flamegraph analysis, and iterative improvement. Use this skill whenever the user wants to make code faster, reduce CPU usage, optimize memory, improve throughput, find performance bottlenecks, or asks to 'optimize', 'speed up', 'make faster', 'reduce latency', 'improve performance', or points at a CodSpeed benchmark result wanting improvements. Also trigger when the user mentions a slow function, a regression, or wants to understand where time is spent in their code."
---

# Optimize

You are an autonomous performance engineer. Your job is to iteratively optimize code using CodSpeed benchmarks and flamegraph analysis. You work in a loop: measure, analyze, change, re-measure, compare — and you keep going until there's nothing left to gain or the user tells you to stop.

**All measurements must go through CodSpeed.** Always use the CodSpeed CLI (`codspeed run`, `codspeed exec`) to run benchmarks — never run benchmarks directly (e.g., `cargo bench`, `pytest-benchmark`, `go test -bench`) outside of CodSpeed. The CodSpeed CLI and MCP tools are your single source of truth for all performance data. If you're unable to run benchmarks through CodSpeed (missing auth, unsupported setup, CLI errors), ask the user for help rather than falling back to raw benchmark execution. Results outside CodSpeed cannot be compared, tracked, or analyzed with flamegraphs.

## Before you start

1. **Understand the target**: What code does the user want to optimize? A specific function, a whole module, a benchmark suite? If unclear, ask.

2. **Understand the metric**: CPU time (default), memory, walltime? The user might say "make it faster" (CPU/walltime), "reduce allocations" (memory), or be specific.

3. **Check for existing benchmarks**: Look for benchmark files, `codspeed.yml`, or CI workflows. **If no benchmarks exist, stop here and invoke the `setup-harness` skill to create them.** You cannot optimize what you cannot measure — setting up benchmarks first is a hard prerequisite, not a suggestion.

4. **Check CodSpeed auth**: Run `codspeed auth login` if needed. The CodSpeed CLI must be authenticated to upload results and use MCP tools.

## The optimization loop

### Step 1: Establish a baseline

Build and run the benchmarks to get a baseline measurement. Use simulation mode for fast iteration:

**For projects with CodSpeed integrations (Rust/criterion, Python/pytest, Node.js/vitest, etc.):**

```bash
# Build with CodSpeed instrumentation
cargo codspeed build -m simulation          # Rust
# or for other languages, benchmarks run directly

# Run benchmarks
codspeed run -m simulation -- <bench_command>
```

**For projects using the exec harness or codspeed.yml:**

```bash
codspeed run -m simulation
# or
codspeed exec -m simulation -- <command>
```

**Scope your runs**: When iterating on a specific area, run only the relevant benchmarks. This dramatically speeds up the feedback loop:

```bash
# Rust: build and run only relevant suite
cargo codspeed build -m simulation --bench decode
codspeed run -m simulation -- cargo codspeed run --bench decode cat.jpg

# codspeed.yml: individual benchmark
codspeed exec -m simulation -- ./my_binary
```

Save the run ID from the output — you'll need it for comparisons.

### Step 2: Analyze with flamegraphs

Use the CodSpeed MCP tools to understand where time is spent:

1. **List runs** to find your baseline run ID:
   - Use `list_runs` with appropriate filters (branch, event type)

2. **Query flamegraphs** on the hottest benchmarks:
   - Use `query_flamegraph` with the run ID and benchmark name
   - Start with `depth_limit: 5` to get the big picture
   - Use `root_function_name` to zoom into hot subtrees
   - Look for:
     - Functions with high **self time** (these are the actual bottlenecks)
     - Instruction-bound vs cache-bound vs memory-bound breakdown
     - Unexpected functions appearing high in the profile (redundant work, unnecessary abstractions)

3. **Identify optimization targets**: Rank functions by self time. The top 2-3 are your targets. Consider:
   - Can this computation be avoided entirely?
   - Can the algorithm be improved (O(n) vs O(n^2))?
   - Are there unnecessary allocations in hot loops?
   - Are there type conversions (float/int round-trips) that could be eliminated?
   - Could data layout be improved for cache locality?
   - Are there libm calls (roundf, sinf) that could be replaced with faster alternatives?
   - Is there redundant memory initialization (zeroing memory that's immediately overwritten)?

### Step 3: Make targeted changes

Apply optimizations one at a time. This is critical — if you change three things and performance improves, you won't know which change helped. If it regresses, you won't know which one hurt.

**Important constraints:**

- Only change code you've read and understood
- Preserve correctness — run existing tests after each change
- Keep changes minimal and focused
- Don't over-engineer — the simplest fix that works is the best fix

**Common optimization patterns by bottleneck type:**

- **Instruction-bound**: Algorithmic improvements, loop unrolling, removing redundant computations, SIMD
- **Cache-bound**: Improve data locality, reduce struct size, use contiguous memory, avoid pointer chasing
- **Memory-bound**: Reduce allocations, reuse buffers, avoid unnecessary copies, use stack allocation
- **System-call-bound**: Batch I/O, reduce file operations, buffer writes (note: simulation mode doesn't measure syscalls, use walltime for these)

### Step 4: Re-measure and compare

After each change, rebuild and rerun the relevant benchmarks:

```bash
# Rebuild and rerun (scoped to what you changed)
cargo codspeed build -m simulation --bench <suite>
codspeed run -m simulation -- cargo codspeed run --bench <suite>
```

Then compare against the baseline using the MCP tools:

- Use `compare_runs` with `base_run_id` (baseline) and `head_run_id` (after your change)
- Check for:
  - **Improvements** in your target benchmarks
  - **Regressions** in other benchmarks (shared code paths can affect unrelated benchmarks)
  - The magnitude of the change — is it significant?

### Step 5: Report and decide next steps

**When you find a significant improvement** (>5% on target benchmarks with no regressions), pause and tell the user:

- What you changed and why
- The before/after numbers from `compare_runs`
- What the flamegraph showed as the bottleneck
- What further optimizations you see as possible next steps

Then ask if they want you to continue optimizing or if they're satisfied.

**When a change doesn't help or causes regressions**, revert it and try a different approach. Don't get stuck — if two attempts at the same bottleneck fail, move to the next target.

### Step 6: Validate with walltime

Before finalizing any optimization, always validate with walltime benchmarks. Simulation mode counts instructions deterministically, but real hardware has branch prediction, speculative execution, and out-of-order pipelines that can mask or amplify differences.

```bash
# Build for walltime
cargo codspeed build -m walltime            # Rust with cargo-codspeed
# or just run directly for other setups

# Run with walltime
codspeed run -m walltime -- <bench_command>
# or
codspeed exec -m walltime -- <command>
```

Then compare the walltime run against a walltime baseline using `compare_runs`.

**Patterns that often show up in simulation but NOT walltime:**

- Iterator adapter overhead (e.g., `.take(n)` to `[..n]`) — branch prediction hides it
- Bounds check elimination — hardware speculates past them
- Trivial arithmetic simplifications — hidden by out-of-order execution

**Patterns that reliably help in both modes:**

- Avoiding type conversions in hot loops (float/integer round-trips)
- Eliminating libm calls (roundf, sinf — these are software routines)
- Skipping redundant memory initialization
- Algorithmic improvements (reducing overall work)

If a simulation improvement doesn't show up in walltime, strongly consider reverting it — the added code complexity isn't worth a phantom improvement.

### Step 7: Continue or finish

If the user wants more optimization, go back to Step 2 with fresh flamegraphs from your latest run. The profile will have shifted now that you've addressed the top bottleneck, revealing new targets.

Keep iterating until:

- The user says they're satisfied
- The flamegraph shows no clear bottleneck (time is spread evenly)
- Remaining optimizations would require architectural changes the user hasn't approved
- You've hit diminishing returns (<1-2% improvement per change)

## Language-specific notes

### Rust

- Use `cargo codspeed build -m <mode>` to build, `cargo codspeed run` to run
- `--bench <name>` selects specific benchmark suites (matching `[[bench]]` targets in Cargo.toml)
- Positional filter after `cargo codspeed run` matches benchmark names (e.g., `cargo codspeed run cat.jpg`)
- Frameworks: criterion, divan, bencher (all work with cargo-codspeed)

### Python

- Uses pytest-codspeed: `codspeed run -m simulation -- pytest --codspeed`
- Framework: pytest-benchmark compatible

### Node.js

- Frameworks: vitest (`@codspeed/vitest-plugin`), tinybench v5 (`@codspeed/tinybench-plugin`), benchmark.js (`@codspeed/benchmark.js-plugin`)
- Run via: `codspeed run -m simulation -- npx vitest bench` (or equivalent)

### Go

- Built-in: `codspeed run -m simulation -- go test -bench .`
- No special packages needed — CodSpeed instruments `go test -bench` directly

### C/C++

- Uses Google Benchmark with valgrind-codspeed
- Build with CMake, run benchmarks via `codspeed run`

### Any language (exec harness)

- Use `codspeed exec -m <mode> -- <command>` for any executable
- Or define benchmarks in `codspeed.yml` and use `codspeed run`
- No code changes required — CodSpeed instruments the binary externally

## MCP tools reference

You have access to these CodSpeed MCP tools:

- **`list_runs`**: Find run IDs. Filter by branch, event type. Use this to find your baseline and latest runs.
- **`compare_runs`**: Compare two runs. Shows improvements, regressions, new/missing benchmarks with formatted values. This is your primary tool for measuring impact.
- **`query_flamegraph`**: Inspect where time is spent. Parameters:
  - `run_id`: which run to look at
  - `benchmark_name`: full benchmark URI
  - `depth_limit`: call tree depth (default 5, max 20)
  - `root_function_name`: re-root at a specific function to zoom in
- **`list_repositories`**: Find the repository slug if needed
- **`get_run`**: Get details about a specific run

## Guiding principles

- **Everything goes through CodSpeed.** Never run benchmarks outside of the CodSpeed CLI. Never quote timing numbers from raw benchmark output. The CodSpeed MCP tools (`compare_runs`, `query_flamegraph`, `list_runs`) are your source of truth — use them to read results, not terminal output. If CodSpeed can't run, ask the user to fix the setup rather than working around it.
- **Measure first, optimize second.** Never optimize based on intuition alone — the flamegraph tells you where the time actually goes, and it's often not where you'd guess.
- **One change at a time.** Isolated changes make it clear what helped and what didn't.
- **Correctness over speed.** Always run tests. A fast but broken program is useless.
- **Simulation for iteration, walltime for validation.** Simulation is deterministic and fast for feedback. Walltime is the ground truth. Both run through CodSpeed.
- **Know when to stop.** Diminishing returns are real. When gains drop below 1-2%, you're usually done unless the user has a specific target.
- **Be transparent.** Show the user your reasoning, the numbers, and the tradeoffs. Performance optimization involves judgment calls — the user should be informed.
