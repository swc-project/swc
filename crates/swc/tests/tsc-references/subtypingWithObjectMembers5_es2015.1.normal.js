// N and M have the same name, same accessibility, same optionality, and N is a subtype of M
// foo properties are valid, bar properties cause errors in the derived class declarations
var NotOptional;
(function(NotOptional) {
    class B {
    }
    class B2 {
    }
    class B3 {
    }
})(NotOptional || (NotOptional = {
}));
// same cases as above but with optional
var Optional;
(function(Optional) {
    class B {
    }
    class B2 {
    }
    class B3 {
    }
})(Optional || (Optional = {
}));
