// 1
a();
// 1
a();
b();
for(; false;);
// 1
a();
b();
for (; false;);
// 2
a();
// 1
a();
b();
for (; false;);
// 2
a();
b();
for(// 1
a();
b();
for (; false;);
// 2
a();
b();
for (c = 1; false;);
// 1
a();
b();
for (; false;);
// 2
a();
b();
for (c = 1; false;);
// 3
c = (// 1
a();
b();
for (; false;);
// 2
a();
b();
for (c = 1; false;);
// 3
c = (a in // 1
a();
b();
for (; false;);
// 2
a();
b();
for (c = 1; false;);
// 3
c = (a in b);
for(; false;);
// 1
a();
b();
for (; false;);
// 2
a();
b();
for (c = 1; false;);
// 3
c = (a in b);
for (; false;);
// 4
c = (// 1
a();
b();
for (; false;);
// 2
a();
b();
for (c = 1; false;);
// 3
c = (a in b);
for (; false;);
// 4
c = (a in // 1
a();
b();
for (; false;);
// 2
a();
b();
for (c = 1; false;);
// 3
c = (a in b);
for (; false;);
// 4
c = (a in b);
for(// 1
a();
b();
for (; false;);
// 2
a();
b();
for (c = 1; false;);
// 3
c = (a in b);
for (; false;);
// 4
c = (a in b);
for (d = 2; false;);
