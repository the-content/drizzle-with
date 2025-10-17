import type { Qb } from 'src/types/base';

export interface Pagination {
    /**
     * 分页索引 / Page index
     * @default 1
     */
    pageIndex: number;
    /**
     * 每页数量 / Items per page
     * @default 10
     */
    pageSize: number;
}

/**
 * 分页查询构建器 / Pagination query builder
 * @param qb - 查询构建器 / Query builder
 * @param options - 配置分页参数 / Pagination options
 * @example
 * ```ts
 * withPagination(qb, { pageIndex: 1, pageSize: 10 })
 * ```
 */
export const withPagination = (qb: Qb, options?: Pagination) => {
    let { pageIndex = 1, pageSize = 10 } = options || {};
    pageIndex = pageIndex < 1 ? 1 : pageIndex;
    pageSize = pageSize < 0 ? 10 : pageSize;
    // 使用类型断言来解决联合类型的limit/offset签名不兼容问题
    return (qb as any).limit(pageSize).offset((pageIndex - 1) * pageSize);
};
