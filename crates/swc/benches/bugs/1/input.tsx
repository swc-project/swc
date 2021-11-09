import { CONST } from "removed/constants";
import Comp1 from "removed/1";
import Comp2 from "removed/2";
import Comp3 from "removed/3";
import Comp4 from "removed/4";

export default function HiddenComponent() {
    return (
        <Comp1 title={`My title`} hideHeader fullViewport>
            <Comp2
                image="/example.com/images/my.png"
                title={`Title of an exmaple page`}
                url={`${CONST}/directory`}
                description="Hidden component, and maybe it's a good input for performance bug"
            />
            <Comp4>
                <Comp3 />
            </Comp4>
        </Comp1>
    );
}
