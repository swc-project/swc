// ok
export import type React = require("react");
import React from "react";
// ok
export import _ = require("lodash");
import type _ = require("lodash");

// error
import x = require("x");
const x = "x";
// error
export import y = require("y");
import y from "y";

