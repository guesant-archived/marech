export type IMakeFileConfigObjectOptions = {
  input:
    | {
        path: string;
        match?: string;
      }
    | string;
  output: string;
};
