export default class BaseService {
  constructor(logger) {
    this.logger = logger;
    this.moduleName = this.constructor.name;
  }

  logInfo(fn, message, extra = {}) {
    this.logger.info({
      module: this.moduleName,
      fn,
      message,
      ...extra,
    });
  }

  logError(fn, message, extra = {}) {
    this.logger.error({
      module: this.moduleName,
      fn,
      message,
      ...extra,
    });
  }

  parseId(id) {
    const parsed = parseInt(id, 10);
    if (isNaN(parsed)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    return parsed;
  }

  /**
   * Wraps async service methods with logging + error handling
   * @param {string} fn - method name
   * @param {Function} handler - async function to execute
   */
  async wrapAsync(fn, handler) {
    try {
      const result = await handler();
      this.logInfo(fn, "Executed successfully");
      return result;
    } catch (error) {
      this.logError(fn, error.message);
      throw error;
    }
  }
}
