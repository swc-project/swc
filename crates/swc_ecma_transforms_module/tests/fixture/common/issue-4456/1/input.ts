import ".";

import emotionStyled from "@emotion/styled";

import { breakpoinstUtils } from "@eduzz/houston-tokens/variables/breakpoints";

export { cx, cx as clsx, keyframes } from "@emotion/css";

export interface IStyledProp {
    className?: string;
}

export const breakpoints = breakpoinstUtils;

const styled = emotionStyled;
export default styled;
