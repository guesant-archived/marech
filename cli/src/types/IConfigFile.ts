export type IConfigFile = {
  input: string;
  output: {
    path: string;
    filename:
      | string
      | ((options: { filePath: string; fileName: string }) => string);
  };
};
