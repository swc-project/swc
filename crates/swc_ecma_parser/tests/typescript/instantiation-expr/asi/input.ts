// Parsed as function call, even though this differs from JavaScript
const x1 = f<true>
(true);

// Parsed as relational expression
const x2 = f<true>
true;

// Parsed as instantiation expression
const x3 = f<true>;
true;

// Parsed as instantiation expression
const x4 = f<true>
if (true) {}
