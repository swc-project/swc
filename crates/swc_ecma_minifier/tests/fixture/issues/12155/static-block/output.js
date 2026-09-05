function publicFunction(a) {
    return a;
}
class PublicClass {
    static{
        for(; condition;){
            var a;
            consume(a);
        }
    }
}
for(; condition;){
    (class {
        static{
            var a, b;
            consume(a, b);
        }
    });
    var holder = class {
        static{
            var a;
            consume(a);
        }
    };
    consume(holder);
}
