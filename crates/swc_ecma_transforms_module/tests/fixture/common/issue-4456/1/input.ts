import ".";

import emotionStyled from "@emotion/styled";

import { breakpoinstUtils } from "@eduzz/houston-tokens/variables/breakpoints";

export { keyframes, cx, cx as clsx } from "@emotion/css";

export interface IStyledProp {
    className?: string;
}

export const breakpoints = breakpoinstUtils;

const styled = emotionStyled;
export default styled;
