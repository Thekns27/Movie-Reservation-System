import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

interface PaginationArgs {
  limit: number;
  page: number;
  includePageCount?: boolean;
  where?: any;
  orderBy?: any;
  include?: any;
  select?: any;
}

interface PaginationResult<T> {
  data: T[];
  meta?: {
    currentPage: number;
    limit: number;
    total: number;
    pageCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;
  private readonly extendedClient: ReturnType<typeof this.createExtendedClient>;

  constructor() {
    this.client = new PrismaClient({
      // log: ["query", "error", "warn"],
      // errorFormat: "pretty",
    });

    this.extendedClient = this.createExtendedClient();
  }

  private createExtendedClient() {
    return this.client.$extends({
      model: {
        $allModels: {
          async paginate(args: PaginationArgs) {
            const ctx = Prisma.getExtensionContext(this);
            const {
              limit,
              page,
              includePageCount = true,
              where,
              orderBy,
              include,
              select,
            } = args;

            const take = limit;
            const skip = (page - 1) * limit;

            const [data, totalCount] = await Promise.all([
              (ctx as any).findMany({
                skip,
                take,
                where,
                orderBy,
                include,
                select,
              }),
              includePageCount ? (ctx as any).count({ where }) : undefined,
            ]);
            const total = totalCount || 0;
            const pageCount = Math.ceil(total / limit);
            return {
              data,
              meta: includePageCount
                ? {
                    currentPage: page,
                    limit,
                    total,
                    pageCount,
                    hasNextPage: page < pageCount,
                    hasPreviousPage: page > 1,
                  }
                : undefined,
            };
          },
        },
      },
    });
  }

  // Model Getters
  get user() {
    return this.extendedClient.user;
  }
  get movie() {
    return this.extendedClient.movie;
  }
  // get journalEntry() {
  //   return this.extendedClient.journalEntry;
  // }
  // get accountHead() {
  //   return this.extendedClient.accountHead;
  // }
  // get department() {
  //   return this.extendedClient.department;
  // }
  // get fiscalYear() {
  //   return this.extendedClient.fiscalYear;
  // }
  // get company() {
  //   return this.extendedClient.company;
  // }
  // get accountType() {
  //   return this.extendedClient.accountType;
  // }
  // get subAccountType() {
  //   return this.extendedClient.subAccountType;
  // }
  // get paymentMethod() {
  //   return this.extendedClient.paymentMethod;
  // }
  // get openingBalance() {
  //   return this.extendedClient.openingBalance;
  // }
  // get remainingBalance() {
  //   return this.extendedClient.remainingBalance;
  // }

  get baseClient(): PrismaClient {
    return this.client;
  }

  // Fixed $transaction method - uses the correct type from PrismaClient
  async $transaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: Parameters<PrismaClient['$transaction']>[1]
  ): Promise<T> {
    return this.client.$transaction(fn, options);
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }

  async runInTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.client.$transaction(async (tx) => fn(tx));
  }
}