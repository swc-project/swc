import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
function bootstrap() {
    return _bootstrap.apply(this, arguments);
}
function _bootstrap() {
    _bootstrap = _async_to_generator(function() {
        var app;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        NestFactory.create(AppModule)
                    ];
                case 1:
                    app = _state.sent();
                    return [
                        4,
                        app.listen(3000)
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _bootstrap.apply(this, arguments);
}
bootstrap();
