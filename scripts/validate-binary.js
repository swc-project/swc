#!/usr/bin/env node
"use strict";

/**
 * Binary validation script for CI/CD pipelines.
 *
 * This script validates that the @swc/core native binary can be loaded
 * and works correctly on the target platform. It's designed to catch
 * segmentation faults and other binary loading issues early in the build
 * process before publishing to npm.
 *
 * Usage:
 *   node scripts/validate-binary.js [path-to-swc-core-dir]
 *
 * Exit codes:
 *   0 - Binary is valid and works correctly
 *   1 - Binary failed to load or validation failed
 */

const path = require("path");
const os = require("os");

// Determine the path to @swc/core
const swcCorePath = process.argv[2] || path.join(__dirname, "..", "packages", "core");

console.log("=== SWC Binary Validation ===");
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);
console.log(`Node version: ${process.version}`);
console.log(`SWC Core path: ${swcCorePath}`);

// Attempt to get libc information
let libcInfo = "unknown";
try {
    if (process.platform === "linux") {
        const report = process.report?.getReport();
        if (report?.header?.glibcVersionRuntime) {
            libcInfo = `glibc ${report.header.glibcVersionRuntime}`;
        } else {
            // If no glibc version, likely musl
            libcInfo = "likely musl";
        }
    }
} catch (e) {
    // Ignore errors getting libc info
}
console.log(`Libc: ${libcInfo}`);
console.log();

let binding;
let validationPassed = false;

try {
    console.log("Loading @swc/core binding...");
    binding = require(path.join(swcCorePath, "binding.js"));
    console.log("✓ Binding loaded successfully");

    // Test 1: Get target triple (if available)
    if (typeof binding.getTargetTriple === "function") {
        console.log("\nTest 1: Checking target triple...");
        const triple = binding.getTargetTriple();
        console.log(`✓ Target triple: ${triple}`);

        if (!triple || triple.length === 0) {
            throw new Error("getTargetTriple returned empty string");
        }
    } else {
        console.log("\nTest 1: getTargetTriple not available (older version)");
    }

    // Test 2: Parse some simple code
    console.log("\nTest 2: Testing parseSync...");
    const testCode = 'console.log("hello world");';
    const result = binding.parseSync(
        testCode,
        Buffer.from(JSON.stringify({ syntax: "ecmascript" }))
    );

    if (!result) {
        throw new Error("parseSync returned null/undefined");
    }

    console.log("✓ parseSync works correctly");

    // Test 3: Transform some code
    console.log("\nTest 3: Testing transformSync...");
    const transformResult = binding.transformSync(
        testCode,
        false,
        Buffer.from(JSON.stringify({
            jsc: {
                parser: {
                    syntax: "ecmascript"
                },
                target: "es2015"
            }
        }))
    );

    if (!transformResult || !transformResult.code) {
        throw new Error("transformSync did not return valid result");
    }

    console.log("✓ transformSync works correctly");

    validationPassed = true;
    console.log("\n=== Validation PASSED ===");
    console.log("All tests completed successfully!");

} catch (error) {
    console.error("\n=== Validation FAILED ===");
    console.error("Error:", error.message);

    if (error.stack) {
        console.error("\nStack trace:");
        console.error(error.stack);
    }

    console.error("\n--- System Information ---");
    console.error(`Platform: ${process.platform}`);
    console.error(`Architecture: ${process.arch}`);
    console.error(`Node version: ${process.version}`);
    console.error(`Libc: ${libcInfo}`);
    console.error(`CPU cores: ${os.cpus().length}`);
    console.error(`Total memory: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
    console.error(`Free memory: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);

    // Check if this is a known issue
    if (process.arch === "arm64" || process.arch === "arm") {
        console.error("\n--- Potential Issue ---");
        console.error("ARM architecture detected. If you're seeing segmentation faults,");
        console.error("this may be related to binary compatibility issues.");
        console.error("See: https://github.com/swc-project/swc/issues/11120");
        console.error("     https://github.com/swc-project/swc/issues/11126");
    }

    if (libcInfo.includes("musl")) {
        console.error("\n--- Potential Issue ---");
        console.error("musl libc detected (Alpine Linux). If you're seeing segmentation faults,");
        console.error("this may be related to binary compatibility issues.");
        console.error("See: https://github.com/swc-project/swc/issues/11126");
    }

    process.exit(1);
}

if (!validationPassed) {
    console.error("\n=== Validation FAILED ===");
    console.error("Validation did not complete successfully");
    process.exit(1);
}

process.exit(0);
