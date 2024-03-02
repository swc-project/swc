var x; if (x = 0) { var b = 1; }

var x; while (x = 0) { var b = 1; }

var x = 0, y; do { y = x; } while (x = x + 1);

var x; for(; x+=1 ;){};

var x; if ((x) = (0));

if (someNode || (someNode = parentNode)) { }

while (someNode || (someNode = parentNode)) { }

do { } while (someNode || (someNode = parentNode));

for (; (typeof l === 'undefined' ? (l = 0) : l); i++) { }

if (x = 0) { }

while (x = 0) { }

do { } while (x = x + 1);

for(; x = y; ) { }

if ((x = 0)) { }

while ((x = 0)) { }

do { } while ((x = x + 1));

for(; (x = y); ) { }

var x; var b = (x = 0) ? 1 : 0;

var x; var b = x && (y = 0) ? 1 : 0;

(((3496.29)).bkufyydt = 2e308) ? foo : bar;

// Valid

if ((function(node) { return node = parentNode; })(someNode)) { }

switch (foo) { case a = b: bar(); }

if ((node => node = parentNode)(someNode)) { }
