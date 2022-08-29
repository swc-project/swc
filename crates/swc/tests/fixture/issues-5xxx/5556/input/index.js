var app;
var ctx;
x = function (y = app => {
    return {
        schedule: {
            interval: '1m',
            type: 'all',
            disable: app.config.env === 'local'
        },
        *task(ctx) {
            const res = yield ctx.curl('http://www.api.com/cache', { contentType: 'json' });
            ctx.app.cache = res.data;
        }
    };
}) {
};