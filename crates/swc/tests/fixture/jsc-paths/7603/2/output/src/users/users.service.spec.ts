import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
describe('UsersService', function() {
    var service;
    beforeEach(/*#__PURE__*/ _async_to_generator(function() {
        var module;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Test.createTestingModule({
                            providers: [
                                UsersService
                            ]
                        }).compile()
                    ];
                case 1:
                    module = _state.sent();
                    service = module.get(UsersService);
                    return [
                        2
                    ];
            }
        });
    }));
    it('should be defined', function() {
        expect(service).toBeDefined();
    });
});
