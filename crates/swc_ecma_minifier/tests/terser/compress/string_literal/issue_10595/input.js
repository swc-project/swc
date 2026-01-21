// Issue #10595: hex escape followed by digit in string with newline
var a = "\x000\n";

// Other control characters with newline
var b = "\x01\n";
var c = "\x1f\n";

// Null followed by non-digit should use \0
var d = "\x00a\n";

// Tab and newline can be safely included
var e = "\t\n";
