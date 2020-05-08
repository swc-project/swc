import {
  RESOURCE_FACEBOOK,
  RESOURCE_INSTAGRAM,
  RESOURCE_WEBSITE,
} from "./consts";
import React, { Component, Fragment } from "react";

const resources = [
  {
    value: RESOURCE_WEBSITE,
    label: "Webové stránky",
  },
  {
    value: RESOURCE_FACEBOOK,
    label: "Facebook",
  },
  {
    value: RESOURCE_INSTAGRAM,
    label: "Instagram",
  },
];

export default class Contacts extends Component {
  renderWebsites = (websites) => {
    return websites.map((website, idx) => (
      <div key={idx}>
        <div>
          {resources.map((resource) => (
            <option key={resource.value} value={resource.value}>
              {resource.label}
            </option>
          ))}
        </div>
        <input
          type={website.type_id === RESOURCE_INSTAGRAM ? "text" : "url"}
          value={website.value || ""}
        />
      </div>
    ));
  };

  render = () => {
    const { websites } = this.props;

    return <Fragment>{websites && this.renderWebsites(websites)}</Fragment>;
  };
}
