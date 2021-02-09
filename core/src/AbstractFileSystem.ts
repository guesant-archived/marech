export type AbstractFileSystem = {
  read(path: string): Promise<string>;
  read(path: string, returnAs: "utf8"): Promise<string>;
  read(path: string, returnAs: "buffer"): Promise<Buffer>;
};
