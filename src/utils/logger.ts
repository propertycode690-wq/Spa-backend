/**
 * OMEGA SPA POS — Logger Utility
 *
 * Simple structured logging utility.
 * Can be replaced with Winston or Pino in production if needed.
 */

export const logger = {
  info: (_message: string, _meta?: Record<string, unknown>): void => {
    if (process.env.DEBUG_LOGS === 'true') {
      console.log(`[INFO] ${new Date().toISOString()} — ${_message}`, _meta ? JSON.stringify(_meta) : '');
    }
  },

  warn: (_message: string, _meta?: Record<string, unknown>): void => {
    if (process.env.DEBUG_LOGS === 'true') {
      console.warn(`[WARN] ${new Date().toISOString()} — ${_message}`, _meta ? JSON.stringify(_meta) : '');
    }
  },

  error: (message: string, meta?: Record<string, unknown>): void => {
    console.error(`[ERROR] ${new Date().toISOString()} — ${message}`, meta ? JSON.stringify(meta) : '');
  },

  debug: (_message: string, _meta?: Record<string, unknown>): void => {
    if (process.env.DEBUG_LOGS === 'true') {
      console.debug(`[DEBUG] ${new Date().toISOString()} — ${_message}`, _meta ? JSON.stringify(_meta) : '');
    }
  },
};
