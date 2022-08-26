import n from "@swc/helpers/src/_async_to_generator.mjs";
Promise.all(assignAll).then(function() {
    var t = n(function*(n) {
        for(let t in obj){
            let r = obj[t];
            r.id;
            (yield listOfUser(r.id)).forEach((n)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${r.id}', now());`;
            });
        }
    });
    return function(n) {
        return t.apply(this, arguments);
    };
}());
export const listOfUser = function(t) {
    var r;
    return new Promise((r = n(function*(n, r) {
        let e = `Select Distinct id from "TABLE" Where id = '${t}' And user_id IS not null`;
        postgreSQL.query(e, null, function(t, e) {
            t ? r(t) : n(e.rows);
        });
    }), function(n, r) {
        return r.apply(this, arguments);
    }));
};
