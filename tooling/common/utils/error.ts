export interface CommandExitLike {
  code: number | null
  signal: string | null
}

export function formatExit(error: CommandExitLike) {
  if (error.code !== null) {
    return `code ${error.code}`;
  }

  if (error.signal !== null) {
    return `signal ${error.signal}`;
  }

  return 'unknown';
}

export function formatUnknownError(error: unknown) {
  if (error instanceof Error) {
    return error.stack || error.message;
  }

  return String(error);
}
