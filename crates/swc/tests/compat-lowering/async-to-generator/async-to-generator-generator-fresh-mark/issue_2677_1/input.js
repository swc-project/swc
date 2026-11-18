
async function region() {
}

export async function otherCall() {
  await region();
}

export default async function someCall() {
  await region();
}
  