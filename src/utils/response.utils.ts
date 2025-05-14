import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  status: 'success' | 'failed';
  statusCode: number;
  message: string;
  data?: T | null;
}

interface ResponseParams<T> {
  statusCode: number;
  message: string;
  dataKey?: string | null;
  data?: T;
}

export enum ResponseMessage {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class ResponseUtils {
  static successResponseHandler<T>({
    statusCode,
    message,
    dataKey = 'data',
    data,
  }: ResponseParams<T>): ApiResponse<T> {
    return {
      status: 'success',
      statusCode,
      message,
      [dataKey ?? 'data']: data ?? null,
    } as ApiResponse<T>;
  }

  static errorResponseHandler<T>({
    statusCode,
    message,
    dataKey = 'errorData',
    data,
  }: ResponseParams<T>): ApiResponse<T> {
    return {
      status: 'failed',
      statusCode,
      message,
      [dataKey ?? 'errorData']: data ?? null,
    } as ApiResponse<T>;
  }

  static handleSuccess<T>(
    data: unknown,
    defaultMessage: string = 'success',
    statusCode: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return this.successResponseHandler<T>({
      statusCode,
      message: defaultMessage,
      dataKey: 'data',
      data: data as T | undefined,
    });
  }
  static handleConflict<T>(
    defaultMessage: string = 'conflict',
  ): ApiResponse<T> {
    return this.errorResponseHandler<T>({
      statusCode: HttpStatus.CONFLICT,
      message: defaultMessage,
      dataKey: 'data',
      data: undefined,
    });
  }

  static handleError<T>(
    error: unknown,
    defaultMessage: string,
  ): ApiResponse<T> {
    const errorMessage =
      error instanceof Error ? error.message : defaultMessage;
    return this.errorResponseHandler<T>({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      dataKey: 'data',
      data: undefined,
    });
  }

  static handleNotFound<T>(message: string): ApiResponse<T> {
    return this.errorResponseHandler<T>({
      statusCode: HttpStatus.NOT_FOUND,
      message,
      dataKey: 'data',
      data: undefined,
    });
  }

  static handleInvalidId<T>(): ApiResponse<T> {
    return this.errorResponseHandler<T>({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid ID format',
      dataKey: 'data',
      data: undefined,
    });
  }
}
