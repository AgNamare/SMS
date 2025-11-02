import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * BaseRepository<T>
 * -----------------
 * A generic abstract repository providing common database operations (CRUD)
 * for any Prisma model. All specific repositories (e.g., SchoolRepository,
 * BranchRepository) extend this class to inherit shared functionality.
 *
 * @template T - The TypeScript type representing the Prisma model entity.
 *
 * @example
 * ```ts
 * // Example usage:
 * class SchoolRepository extends BaseRepository<School> {
 *   constructor() {
 *     super(prisma.school);
 *   }
 * }
 * ```
 */
export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(model: any) {
    this.prisma = prisma;
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create({ data });
  }

  async findById(id: number): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: number): Promise<T> {
    return this.model.delete({ where: { id } });
  }

  /**
   * Fetch a list of records with optional filters and pagination.
   *
   * @param params Optional query parameters
   *  - skip?: number → number of records to skip (for pagination)
   *  - take?: number → number of records to take (for pagination)
   *  - where?: any → Prisma where filter
   *  - include?: any → Prisma include relations
   *  - orderBy?: any → Prisma orderBy parameter
   *  - select: any -> Use to return only specific parameters
   */
  async list(params?: {
    skip?: number;
    take?: number;
    where?: any;
    include?: any;
    orderBy?: any;
    select?: any;
  }): Promise<T[]> {
    return this.model.findMany({
      skip: params?.skip,
      take: params?.take,
      where: params?.where,
      include: params?.include,
      orderBy: params?.orderBy,
      select: params?.select,
    });
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }
}
