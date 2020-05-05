import withStyles, { WithStyles } from "./withStyles";
import createStyles from "./createStyles";
import React from "react";

const styles = createStyles({
  root: {
    margin: "0px"
  }
});

export interface Props extends WithStyles<typeof styles> {}

export default withStyles(styles)(class extends React.Component<Props> {});
