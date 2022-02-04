import { predom } from "./renderer2";
import prerendered from "./component";
export default predom("h", null);
predom("h", null); // Expect assignability error here
