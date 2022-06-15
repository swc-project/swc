import copyProps from "./_copy_props";

export default function _reExport(target, mod) {
  copyProps(target, mod, "default");
  return mod;
}
