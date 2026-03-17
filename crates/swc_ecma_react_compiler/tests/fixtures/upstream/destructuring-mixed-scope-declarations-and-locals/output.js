import { c as _c } from "react/compiler-runtime";
import { useFragment } from "shared-runtime";

function Component(props) {
  const $ = _c(4);
  const post = useFragment(
    graphql`
      fragment F on T {
        id
      }
    `,
    props.post,
  );
  let t0;
  if ($[0] !== post) {
    const allUrls = [];
    const { media, comments, urls } = post;
    let t1;
    if ($[2] !== comments.length) {
      t1 = (e) => {
        if (!comments.length) {
          return;
        }
        console.log(comments.length);
      };
      $[2] = comments.length;
      $[3] = t1;
    } else {
      t1 = $[3];
    }
    const onClick = t1;
    allUrls.push(...urls);
    t0 = <Media media={media} onClick={onClick} />;
    $[0] = post;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
