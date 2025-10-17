import type { AnyColumn, SQL } from 'drizzle-orm'
import type { Qb } from 'src/types/base';
import { isNull } from 'drizzle-orm'

export interface SoftDeleteOptions {
    /**
     * 列 / Column
     * @default 'deletedAt'
     */
    atColumn?: AnyColumn | string
}

/**
 * 软删除过滤构建器 / Soft delete filter builder
 * @param qb - 查询构建器 / Query builder
 * @param options - 软删除选项 / Soft delete options
 * @example
 * ```ts
 * withSoftDelete(qb, { atCloumn: 'deletedAt' })
 * // or
 * withSoftDelete(qb, { atCloumn: schema.anytable.anyColumn })
 * ```
 */
export const withSoftDelete = (qb: Qb, options?: SoftDeleteOptions) => {
    const { atColumn } = options || {}
    const conditions: SQL[] = []

    if (!atColumn) {
        return conditions
    }

    if (typeof atColumn === 'string') {
        // 如果是字符串，从 qb 中获取对应的 column
        const column = qb._.config.fields[atColumn] as AnyColumn
        if (!column) {
            return conditions
        }
        conditions.push(isNull(column))
    } else {
        // 如果直接传入 AnyColumn 实体，直接使用
        conditions.push(isNull(atColumn))
    }

    return conditions
}
