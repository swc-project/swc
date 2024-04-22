import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { Test } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
describe('UsersController', function() {
    var controller;
    beforeEach(/*#__PURE__*/ _async_to_generator(function() {
        var module;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Test.createTestingModule({
                            controllers: [
                                UsersController
                            ],
                            providers: [
                                UsersService
                            ]
                        }).compile()
                    ];
                case 1:
                    module = _state.sent();
                    controller = module.get(UsersController);
                    return [
                        2
                    ];
            }
        });
    }));
    it('should be defined', function() {
        expect(controller).toBeDefined();
    });
});
