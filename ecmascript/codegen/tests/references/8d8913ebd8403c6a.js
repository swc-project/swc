// 1
a();
b();
for(; false;);
// 2
a();
b();
for(c = 1; false;);
// 3
c = (a in b);
for(; false;);
// 4
c = (a in b);
for(d = 2; false;);
