import {
  INSTAGRAM_CHECK_PATTERN,
  RESOURCE_FACEBOOK,
  RESOURCE_INSTAGRAM,
  RESOURCE_WEBSITE,
} from "../../../../consts";

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
      <div>
        {/* Some code */}
        {resources.map((resource) => (
          <option key={resource.value} value={resource.value}>
            {resource.label}
          </option>
        ))}
      </div>
    ));
  };

  render = () => {
    const { websites } = this.props;
    return <Fragment>{websites && this.renderWebsites(websites)}</Fragment>;
  };
}
