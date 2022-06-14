import _checkPrivateRedeclaration from "./_check_private_redeclaration";

export default function _classPrivateMethodInit(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);
  privateSet.add(obj);
}
