import n from "@swc/helpers/src/_async_to_generator.mjs";
import t from "regenerator-runtime";
Promise.all(assignAll).then(function() {
    var r = n(t.mark(function n(r) {
        var e, c, a, o;
        return t.wrap(function(n) {
            for(;;)switch(n.prev = n.next){
                case 0:
                    e = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', n.t0 = regeneratorRuntime.keys(r);
                case 2:
                    if ((n.t1 = n.t0()).done) {
                        n.next = 12;
                        break;
                    }
                    return a = r[c = n.t1.value], e += "'".concat(a.id, "', "), n.next = 8, listOfUser(a.id);
                case 8:
                    (o = n.sent).forEach(function(n) {
                        insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(a.id, "', now());");
                    }), n.next = 2;
                    break;
                case 12:
                case "end":
                    return n.stop();
            }
        }, n);
    }));
    return function(r) {
        return r.apply(this, arguments);
    };
}());
export var listOfUser = function(r) {
    var e;
    return new Promise((e = n(t.mark(function n(e, c) {
        var a;
        return t.wrap(function(n) {
            for(;;)switch(n.prev = n.next){
                case 0:
                    a = 'Select Distinct id from "TABLE" Where id = \''.concat(r, "' And user_id IS not null"), postgreSQL.query(a, null, function(n, t) {
                        n ? c(n) : e(t.rows);
                    });
                case 2:
                case "end":
                    return n.stop();
            }
        }, n);
    })), function(e, c) {
        return e.apply(this, arguments);
    }));
};
