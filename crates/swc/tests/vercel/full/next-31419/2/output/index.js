import r from "@swc/helpers/src/_async_to_generator.mjs";
Promise.all(assignAll).then(function() {
    var n = r(function*(r) {
        for(let n in obj){
            let e = obj[n];
            e.id, (yield listOfUser(e.id)).forEach((r)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${e.id}', now());`;
            });
        }
    });
    return function(r) {
        return n.apply(this, arguments);
    };
}());
export const listOfUser = function(n) {
    var e;
    return new Promise((e = r(function*(r, e) {
        let t = `Select Distinct id from "TABLE" Where id = '${n}' And user_id IS not null`;
        postgreSQL.query(t, null, function(n, t) {
            n ? e(n) : r(t.rows);
        });
    }), function(r, e) {
        return e.apply(this, arguments);
    }));
};
