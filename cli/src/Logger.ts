const DEBUGGER_ENABLED = false;

export class Logger {
  static error(...messages: any[]) {
    console.error("[error]", ...messages);
    process.exit(1);
  }

  static debug(...messages: any[]) {
    DEBUGGER_ENABLED && console.debug("[debug]", ...messages);
  }
}
