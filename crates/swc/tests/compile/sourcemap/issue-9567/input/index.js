function foo(span, error) {
  span.setStatus({
      message: `${error.message} ${
          error.code
              ? `\nMon\tgo\nos
e Error\n C
od\ne: ${error.code}`
              : "1\n23"
      }`,
  });
}
foo();
