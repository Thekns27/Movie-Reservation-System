import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export type PaginationMeta =
  | {
      currentPage: number;
      limit: number;
      total: any;
      pageCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  | undefined;

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              status: { type: 'string', example: 'success' },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              meta: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  duration: { type: 'string' },
                  method: { type: 'string' },
                  isArray: { type: 'boolean' },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: { type: 'number' },
                      currentPage: { type: 'number' },
                      totalPage: { type: 'number' },
                      hasNextPage: { type: 'boolean' },
                      hasPreviousPage: { type: 'boolean' },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiCustomResponse = <TModel extends Type<any>>(
  model: TModel,
  status = 200,
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: status,
      schema: {
        allOf: [
          {
            properties: {
              status: {
                type: 'string',
                enum: ['success', 'fail'],
                description: 'Response status indicating success or failure',
                example: 'success',
              },
              data: {
                $ref: getSchemaPath(model),
              },
              meta: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  duration: { type: 'string' },
                  method: { type: 'string' },
                  isArray: { type: 'boolean' },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
