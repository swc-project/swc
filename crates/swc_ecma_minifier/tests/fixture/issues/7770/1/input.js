exports.MainCSS1 = foo`
  \x<-invalid, so no cooked
  ${'this breaks splits the quasis'}
  this should have a cooked
`;

exports.MainCSS2 = foo`
  \x<-invalid, so no cooked
  ${'this breaks splits the quasis'}
  this should have a cooked
  ${'this breaks splits the quasis'}
  this should also have a cooked
`;