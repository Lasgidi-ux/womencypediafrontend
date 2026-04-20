/**
 * Error Sanitization Middleware
 * Safely sanitizes error responses in production while preserving error details in development
 */

interface StrapiError extends Error {
  status?: number;
  details?: any;
}

export default (config: any, { strapi }: { strapi?: any }) => {
  return async (ctx: any, next: any) => {
    try {
      await next();
    } catch (error: unknown) {
      // Safely check if strapi is available and get environment
      const isProduction = strapi?.config?.get?.('environment') === 'production' ||
                          process.env.NODE_ENV === 'production' ||
                          !process.env.NODE_ENV;

      // Type guard for error
      const err = error as StrapiError;

      // Log the full error for debugging
      console.error('[Error Middleware]', {
        message: err.message,
        stack: err.stack,
        status: err.status || 500,
        url: ctx.url,
        method: ctx.method,
        timestamp: new Date().toISOString()
      });

      // Handle different error types
      let status = err.status || 500;
      let message = 'Internal server error';

      if (err.name === 'ValidationError' || err.name === 'YupValidationError') {
        // Validation errors should be 400, not 500
        status = 400;
        message = isProduction ? 'Invalid request data' : err.message;
      } else if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid data format';
      } else if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized';
      } else if (err.name === 'ForbiddenError') {
        status = 403;
        message = 'Forbidden';
      } else if (err.name === 'NotFoundError') {
        status = 404;
        message = 'Not found';
      }

      // Prepare error response
      const errorResponse: {
        error: {
          status: number;
          name: string;
          message: string;
          details?: any;
          stack?: string;
        }
      } = {
        error: {
          status,
          name: err.name || 'InternalServerError',
          message: isProduction ? message : err.message,
          details: isProduction ? undefined : err.details
        }
      };

      // Add stack trace in development
      if (!isProduction && err.stack) {
        errorResponse.error.stack = err.stack;
      }

      // Set response
      ctx.status = status;
      ctx.body = errorResponse;

      // Don't rethrow - we've handled the error
    }
  };
};