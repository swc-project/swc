import n from "@swc/helpers/src/_async_to_generator.mjs";
import r from "@swc/helpers/src/_ts_generator.mjs";
Promise.all(assignAll).then(function() {
    var t = n(function(n) {
        var t, e, c, i, u, o, a;
        return r(this, function(r) {
            switch(r.label){
                case 0:
                    for(c in t = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', e = [], n);
                    i = 0, r.label = 1;
                case 1:
                    if (!(i < e.length)) return [
                        3,
                        4
                    ];
                    return o = n[u = e[i]], t += "'".concat(o.id, "', "), [
                        4,
                        listOfUser(o.id)
                    ];
                case 2:
                    (a = r.sent()).forEach(function(n) {
                        insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(o.id, "', now());");
                    }), r.label = 3;
                case 3:
                    return i++, [
                        3,
                        1
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    return function(n) {
        return t.apply(this, arguments);
    };
}());
export var listOfUser = function(t) {
    var e;
    return new Promise((e = n(function(n, e) {
        var c;
        return r(this, function(r) {
            return c = 'Select Distinct id from "TABLE" Where id = \''.concat(t, "' And user_id IS not null"), postgreSQL.query(c, null, function(r, t) {
                r ? e(r) : n(t.rows);
            }), [
                2
            ];
        });
    }), function(n, e) {
        return e.apply(this, arguments);
    }));
};
