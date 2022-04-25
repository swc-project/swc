foo(bar() + 123 + "HelloWorld");
foo(bar() + "123HelloWorld");
foo(bar() + 123 + "HelloWorld");
foo(bar() + 123 + "HelloWorldFooBar");
foo("FooBar" + bar() + "123HelloWorldFooBar");
foo("Hello" + bar() + "123World");
foo(bar() + "Foo" + (10 + parseInt("10")));
