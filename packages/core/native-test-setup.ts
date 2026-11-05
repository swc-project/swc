// Rstest's error summary can hide the array of platform loader failures in
// Error.cause. Emit it before test imports so Windows cache diagnostics survive.
try {
    require("./binding.js");
} catch (error) {
    console.error("Native binding initialization failed:", error);
    if (error && typeof error === "object" && "cause" in error) {
        console.error("Native binding causes:", error.cause);
    }
    throw error;
}
