export type IConfigFile = {
  input: { path: string; match?: string };
  output: {
    path: string;
    filename:
      | string
      | ((options: { filePath: string; fileName: string }) => string);
  };
};
