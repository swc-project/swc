export class Vue {
}
export const config = {
    x: 0
};
import { Vue, config } from "./vue";
Vue.config = {}, new Vue(), config.x = 1, config.y = {}, config.x, config.y;
