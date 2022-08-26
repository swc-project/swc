import r from "@swc/helpers/src/_async_to_generator.mjs";
import n from "@swc/helpers/src/_ts_generator.mjs";
Promise.all(assignAll).then(function() {
    var t = r(function(r) {
        var t, e, c, i, o, s, u;
        return n(this, function(n) {
            switch(n.label){
                case 0:
                    for(c in t = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', e = [], r);
                    i = 0, n.label = 1;
                case 1:
                    if (!(i < e.length)) return [
                        3,
                        4
                    ];
                    return s = r[o = e[i]], t += "'".concat(s.id, "', "), [
                        4,
                        listOfUser(s.id)
                    ];
                case 2:
                    (u = n.sent()).forEach(function(r) {
                        insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(s.id, "', now());");
                    }), n.label = 3;
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
    return function(r) {
        return t.apply(this, arguments);
    };
}());
export var listOfUser = function(t) {
    var e;
    return new Promise((e = r(function(r, e) {
        var c;
        return n(this, function(n) {
            return c = 'Select Distinct id from "TABLE" Where id = \''.concat(t, "' And user_id IS not null"), postgreSQL.query(c, null, function(n, t) {
                n ? e(n) : r(t.rows);
            }), [
                2
            ];
        });
    }), function(r, e) {
        return e.apply(this, arguments);
    }));
};
