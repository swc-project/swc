import a from "@swc/helpers/lib/_async_to_generator.js";
import b from "regenerator-runtime";
Promise.all(assignAll).then(function() {
    var c = a(b.mark(function a(c) {
        var d, e, f, g;
        return b.wrap(function(a) {
            for(;;)switch(a.prev = a.next){
                case 0:
                    d = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', a.t0 = regeneratorRuntime.keys(c);
                case 2:
                    if ((a.t1 = a.t0()).done) {
                        a.next = 12;
                        break;
                    }
                    return f = c[e = a.t1.value], d += "'".concat(f.id, "', "), a.next = 8, listOfUser(f.id);
                case 8:
                    (g = a.sent).forEach(function(a) {
                        insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(f.id, "', now());");
                    }), a.next = 2;
                    break;
                case 12:
                case "end":
                    return a.stop();
            }
        }, a);
    }));
    return function(c) {
        return c.apply(this, arguments);
    };
}());
export var listOfUser = function(d) {
    var c;
    return new Promise((c = a(b.mark(function a(c, e) {
        var f;
        return b.wrap(function(a) {
            for(;;)switch(a.prev = a.next){
                case 0:
                    f = 'Select Distinct id from "TABLE" Where id = \''.concat(d, "' And user_id IS not null"), postgreSQL.query(f, null, function(a, b) {
                        a ? e(a) : c(b.rows);
                    });
                case 2:
                case "end":
                    return a.stop();
            }
        }, a);
    })), function(c, e) {
        return c.apply(this, arguments);
    }));
};
