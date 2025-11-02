export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public userMessage: string;

  constructor(
    message: string, 
    userMessage: string, 
    statusCode = 400, 
    isOperational = true 
  ) {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
