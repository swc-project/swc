import n from "@swc/helpers/src/_async_to_generator.mjs";
Promise.all(assignAll).then(function() {
    var t = n(function*(n) {
        for(let t in obj){
            let i = obj[t];
            i.id;
            (yield listOfUser(i.id)).forEach((n)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${i.id}', now());`;
            });
        }
    });
    return function(n) {
        return t.apply(this, arguments);
    };
}());
export const listOfUser = function(t) {
    var i;
    return new Promise((i = n(function*(n, i) {
        let r = `Select Distinct id from "TABLE" Where id = '${t}' And user_id IS not null`;
        postgreSQL.query(r, null, function(t, r) {
            t ? i(t) : n(r.rows);
        });
    }), function(n, i) {
        return i.apply(this, arguments);
    }));
};
