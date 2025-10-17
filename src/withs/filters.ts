import type { AnyColumn, SQL } from 'drizzle-orm'
import type { Qb } from 'src/types/base';
import { FILTER_OPS } from 'src/const'
import { eq, gt, gte, isNull, like, lt, lte, ne, or, ilike, getTableColumns } from 'drizzle-orm'
import { snakeToCamel } from '../utils'

/** 过滤操作配置类型 / Filter operation type */
export type FilterOps = (typeof FILTER_OPS)[number]['id']

/**
 * 过滤条件配置类型
 * Filter conditions configuration type
 * @example [{ id: "name", op: "like", value: "test" }, { id: "status", op: "eq", value: "active" }]
 */
export type Filters = Array<{ id: string; op: FilterOps; value?: any }>

/**
 * TanStack Table 过滤查询构建器 / TanStack Table filter query builder
 * @param qb - 动态构建器 / Dynamic query builder
 * @param ops - 过滤条件 / Filter conditions
 * @example
 * ```ts
 * withFilters(qb, [{ id: "name", op: "like", value: "test" }, { id: "status", op: "eq", value: "active" }])
 * ```
 */
export const withFilters = (qb: Qb, ops?: Filters) => {
    const conditions: SQL[] = []

    if (!ops || ops.length === 0) {
        return conditions
    }

    const createOperationHandlers = ({ column, value, conditions }: { column: AnyColumn; value?: any; conditions: SQL[] }) => {
        const handlers: Partial<Record<FilterOps, () => void>> = {
            eq: () => conditions.push(eq(column, value)),
            ne: () => conditions.push(ne(column, value)),
            gt: () => conditions.push(gt(column, value)),
            gte: () => conditions.push(gte(column, value)),
            lt: () => conditions.push(lt(column, value)),
            lte: () => conditions.push(lte(column, value)),
            like: () => conditions.push(like(column, `%${value}%`)),
            ilike: () => conditions.push(ilike(column, `%${value}%`)),
            isNull: () => conditions.push(or(isNull(column), eq(column, '')) || isNull(column)),
        }
        return handlers
    }

    ops.forEach(({ id, op, value }) => {
        if (typeof value === 'undefined' || value === null) return
        const camelCaseId = snakeToCamel(id)
        const column = qb._.config.fields[camelCaseId] as AnyColumn
        if (!column) return
        const handlers = createOperationHandlers({ column, value, conditions })
        const handler = handlers[op]
        if (handler) {
            handler()
        }
    })
    return conditions
}

/**
 * 自动过滤 / All field auto filter
 * @param qb - 动态构建器 / Dynamic query builder
 * @param values - 过滤字段对象 / Field filters object
 * @param overrides - 覆盖默认的操作符号 / Override default operation symbols
 * @example
 * ```ts
 * withAutoFilters(qb, [{ id: "name" }, { email: "abc@example.com" }], { email: "like" })
 * ```
 */
export const withAutoFilters = (qb: Qb, values: Record<string, any>, overrides?: Record<string, FilterOps>) => {
    const filters: Filters = []
    const columns = getTableColumns<any>(qb._.config.table)
    for (const column in columns) {
        const value = values[column]
        if (typeof value === 'undefined' || value === null) {
            continue
        }
        if (overrides && overrides[column]) {
            filters.push({ id: columns[column].name, op: overrides[column], value: value })
            continue
        }
        filters.push({ id: columns[column].name, op: 'eq', value: value })
    }
    return withFilters(qb, filters)
}
