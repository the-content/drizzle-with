import type { AnyColumn, SQL } from 'drizzle-orm'
import type { Qb } from 'src/types/base'
import { asc, desc } from 'drizzle-orm'
import { snakeToCamel } from '../utils'

export interface SortingOption {
    /** 字段 / Field */
    id: string
    /** 是否倒叙 / Whether to sort in descending order */
    desc: boolean
}

/**
 * TanStack Table 排序查询构建器 / TanStack Table sorting query builder
 * @param qb - 查询构建器 / Query builder
 * @param options - 排序参数 / Sorting options
 * @example
 * ```ts
 * withSorting(qb, [{ id: "id", desc: true }, { id: "createdAt", desc: true }])
 * ```
 */
export const withSorting = (qb: Qb, options?: SortingOption[]) => {
    const orders: SQL[] = []

    if (!options || options.length === 0) return orders

    options.forEach(({ id, desc: isDesc }) => {
        // id可能是蛇形下划线命名，把字段转为小驼峰
        const camelCaseId = snakeToCamel(id)
        // 检查字段是否存在于 schema 中
        const column = qb._.config.fields[camelCaseId] as AnyColumn
        if (!column) return

        const orderSql = isDesc ? desc(column) : asc(column)
        orders.push(orderSql)
    })
    // 使用类型断言来解决联合类型的orderBy签名不兼容问题
    ;(qb as any).orderBy(...orders)
    return orders
}
