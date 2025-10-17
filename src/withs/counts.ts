import type { Qb } from 'src/types/base';
import { count } from 'drizzle-orm';

/**
 * 返回带有查询的总数量,建议最后执行 / Returns the total count with query, recommended to execute last
 * @param qb - 查询构建器 / Query builder
 * @example
 * ```ts
 * const count = await withCounts(qb)
 * console.log(count) // 452
 * ```
 */
export const withCounts = async (qb: Qb): Promise<number> => {
    // V1.0: 重新构建 count 查询，使用原始查询的 table 和 where 条件
    // const table = qb._.config?.table
    // const where = qb._.config?.where
    // if (!table) {
    //     return 0
    // }
    // const totalCount = await db.$count(table, where)
    // return totalCount

    // V2.0: 通过动态查询修改条件查询
    const table = qb._.config?.table;
    if (!table) {
        return 0;
    }
    // 可以在外部逻辑中自定义 count 查询条件字段
    if (!qb._.config.fields.count) {
        qb._.config.fields = { count: count() };
    }
    qb._.config.orderBy = undefined;
    qb._.config.limit = undefined;
    qb._.config.offset = undefined;

    const [total] = (await qb) as Array<{ count: number }>;
    return total.count;
};
