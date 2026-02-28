

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export class ResponseFormat<T> {
  @ApiProperty()
  isArray!: boolean;
  @ApiProperty()
  path!: string;
  @ApiProperty()
  duration!: string;
  @ApiProperty()
  method!: string;

  data!: T;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    return next.handle().pipe(
      map((data) => {
        const endTime = Date.now();
        const duration = `${endTime - startTime} ms`;

        // Handle paginated responses from Prisma extension
        const isPaginated = data && typeof data === 'object' && 'data' in data && 'paginateMeta' in data;
        const resultData = isPaginated ? data.data : data;
        const pagination = isPaginated ? data.paginateMeta : undefined;

        return {
          status: response.statusCode < 400 ? 'success' : 'fail',
          data: resultData,
          meta: {
            path: request.url,
            duration,
            method: request.method,
            isArray: Array.isArray(resultData),
            ...(pagination ? {
              pagination: {
                total: pagination.total,
                currentPage: pagination.currentPage,
                totalPage: pagination.pageCount,
                hasNextPage: pagination.hasNextPage,
                hasPreviousPage: pagination.hasPreviousPage,
              }
            } : {}),
          },
        };
      }),
    );
  }
}
