import type { SQL } from 'drizzle-orm'
import type { Qb } from 'src/types/base';
import { and } from 'drizzle-orm'
import { type Filters, withFilters } from './filters'
import { type SoftDeleteOptions, withSoftDelete } from './delete'
import { type Pagination, withPagination } from './pagination'
import { withSorting } from './sorting'
import { withCounts } from './counts'

export interface TableQueryOptions {
    /** 默认基于createdAt倒序排序 / Default sort by createdAt in descending order */
    sorting?: Array<{ id: string; desc: boolean }>
    /** 默认没有条件过滤 / Default no filtering */
    filters?: Filters
    /** 默认页码是1,每页10条数据 / Default page 1, 10 items per page */
    pagination?: Pagination
    /** 默认排除软删除数据 / Default exclude soft deleted data */
    softDelete?: SoftDeleteOptions
}

/**
 * 表格查询统一处理函数 / Unified table query processing function
 * @param qb - 查询构建器 / Query builder
 * @param options - 表格查询选项 / Table query options
 */
export const withTableQuery = async (qb: Qb, options: TableQueryOptions) => {
    const { sorting = [{ id: 'createdAt', desc: true }], filters = [], pagination = { pageIndex: 1, pageSize: 10 }, softDelete } = options
    // 应用排序
    withSorting(qb, sorting)
    // 分页查询
    withPagination(qb, pagination)
    // 过滤数组
    const conditions: SQL[] = []
    // 排除软删除
    conditions.push(...withSoftDelete(qb, softDelete))
    // 条件过滤
    conditions.push(...withFilters(qb, filters))
    // 合并条件
    qb.where(and(...conditions))
    // 动态查询
    const rows = await qb
    // 查询总行数
    const counts = withCounts(qb)

    return {
        rows: rows,
        meta: {
            ...pagination,
            counts: counts,
        },
    }
}
