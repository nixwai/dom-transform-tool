export function versionTag(version: string) {
  const prereleaseRegex = /-[a-z]+(?=\.\d)/i;

  const match = version.match(prereleaseRegex);
  if (match && match[0]) {
    const prereleaseTag = match[0].substring(1); // 去掉开头的 "-"
    return `--tag ${prereleaseTag}`;
  }
  return '';
}
