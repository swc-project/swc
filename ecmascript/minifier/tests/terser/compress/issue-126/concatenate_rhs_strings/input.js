foo(bar() + 123 + "Hello" + "World");
foo(bar() + (123 + "Hello") + "World");
foo(bar() + 123 + "Hello" + "World");
foo(bar() + 123 + "Hello" + "World" + ("Foo" + "Bar"));
foo("Foo" + "Bar" + bar() + 123 + "Hello" + "World" + ("Foo" + "Bar"));
foo("Hello" + bar() + 123 + "World");
foo(bar() + "Foo" + (10 + parseInt("10")));
