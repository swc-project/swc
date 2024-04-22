import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { Test } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
describe('AppController', function() {
    var app;
    beforeAll(/*#__PURE__*/ _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Test.createTestingModule({
                            controllers: [
                                AppController
                            ],
                            providers: [
                                AppService
                            ]
                        }).compile()
                    ];
                case 1:
                    app = _state.sent();
                    return [
                        2
                    ];
            }
        });
    }));
    describe('getHello', function() {
        it('should return "Hello World!"', function() {
            var appController = app.get(AppController);
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});
