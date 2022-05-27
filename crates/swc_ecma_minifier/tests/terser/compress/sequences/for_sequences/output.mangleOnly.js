foo();
bar();
for(; false;);
foo();
bar();
for(x = 5; false;);
x = foo in bar;
for(; false;);
x = foo in bar;
for(y = 5; false;);
x = function() {
    foo in bar;
};
for(y = 5; false;);
