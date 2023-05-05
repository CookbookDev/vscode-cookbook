export const getFilename = (path: string) => {
  const parts = path.split(/[\\/]/);
  const filename = parts[parts.length - 1];
  return filename;
};