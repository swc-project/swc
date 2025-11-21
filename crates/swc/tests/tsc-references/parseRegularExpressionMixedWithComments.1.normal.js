//// [parseRegularExpressionMixedWithComments.ts]
var regex1 = / asdf /;
var regex2 = /**/ / asdf /;
var regex3 = /**/ 1;
var regex4 = /**/ Math.pow(/ /, /asdf /);
var regex5 = /**/ Math.pow(/ asdf/, / /);
