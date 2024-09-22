function foo(span, error) {
  span.setStatus({
      message: `${error.message} ${error.code ? `\nMongoose Error Code: ${error.code}` : ''}`,
  });
}
foo();