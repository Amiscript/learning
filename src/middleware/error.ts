import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};