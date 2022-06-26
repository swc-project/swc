import a from "@swc/helpers/src/_async_to_generator.mjs";
Promise.all(assignAll).then(function() {
    var b = a(function*(a) {
        for(let b in obj){
            let c = obj[b];
            c.id;
            (yield listOfUser(c.id)).forEach((a)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${c.id}', now());`;
            });
        }
    });
    return function(a) {
        return b.apply(this, arguments);
    };
}());
export const listOfUser = function(b) {
    var c;
    return new Promise((c = a(function*(a, c) {
        let d = `Select Distinct id from "TABLE" Where id = '${b}' And user_id IS not null`;
        postgreSQL.query(d, null, function(b, d) {
            b ? c(b) : a(d.rows);
        });
    }), function(a, c) {
        return c.apply(this, arguments);
    }));
};
