function method(_, context) {
  context.addInitializer(function() {
    this.initializedBeforeFields = !Object.prototype.hasOwnProperty.call(
      this,
      "decoratedField",
    );
  });
}

function field() {
  return function(value) {
    return value;
  };
}

class A {
  @method
  m() {}

  @field
  decoratedField = 1;

  @field
  secondField = 2;
}
