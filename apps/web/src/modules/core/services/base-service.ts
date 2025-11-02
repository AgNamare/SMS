import { Prisma } from "@prisma/client";
import { BaseRepository } from "../repositories/base-repository";
import { AppError } from "@/src/lib/utils/app-error";
import { handleError } from "@/src/lib/utils/handle-error";

export class BaseService<T, R extends BaseRepository<T>> {
  constructor(protected repository: R) {}

  async getAll() {
    try {
      return await this.repository.list();
    } catch (error) {
      throw handleError(error);
    }
  }

  async getById(id: number) {
    try {
      const result = await this.repository.findById(id);
      if (!result) {
        throw new AppError(
          "Record not found",
          "The record doesn't exist.",
          404
        );
      }
      return result;
    } catch (error) {
      throw handleError(error);
    }
  }

  async create(data: any) {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(id: number, data: Partial<T>) {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw handleError(error);
    }
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
  
  /**
   * Paginated listing
   * @param page current page (1-based)
   * @param limit items per page
   * @param where optional filters
   */
  async listPaginated(page = 1, limit = 10, where?: any, select?: any) {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.repository.list({ skip, take: limit, where, select }),
        this.repository.count(where),
      ]);

      return {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(handleError(error));
      throw handleError(error);
    }
  }
}
