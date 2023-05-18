//// [asiPreventsParsingAsAmbientExternalModule02.ts]
var declare;
var module;
var container;
(function(container) {
    "my external module" // this is just a string
    ;
    declare // this is the identifier 'declare'
    ;
    module // this is the identifier 'module'
    ;
    {}
})(container || (container = {}));
