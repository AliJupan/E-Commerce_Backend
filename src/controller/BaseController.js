class BaseController {
  constructor(logger, moduleName) {
    this.logger = logger;
    this.moduleName = moduleName;
  }

  logInfo(fn, message, extra = {}) {
    this.logger.info({ module: this.moduleName, fn, message, ...extra });
  }

  logError(fn, message, extra = {}) {
    this.logger.error({ module: this.moduleName, fn, message, ...extra });
  }

  /**
   * Wraps a request handler in try/catch and returns it in an array
   * so it’s directly usable in Express route definitions.
   */
  handleRequest(fnName, handler) {
    return [
      async (req, res) => {
        try {
          const result = await handler(req, res);
          return res
            .status(result?.status || 200)
            .json(result?.data ?? result);
        } catch (error) {
          this.logError(fnName, error.message, {
            params: req.params,
            query: req.query,
            body: req.body,
          });
          return res.status(500).json({ error: error.message });
        }
      },
    ];
  }
}

export default BaseController;
