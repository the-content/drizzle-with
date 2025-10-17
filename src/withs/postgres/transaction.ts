import type { PgDatabase, PgTransaction, PgTransactionConfig } from 'drizzle-orm/pg-core'
import type { NodePgClient, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import type { ExtractTablesWithRelations } from 'drizzle-orm'

type TransactionFn<T, TSchema extends Record<string, unknown>> = (
    tx: PgTransaction<NodePgQueryResultHKT, TSchema, ExtractTablesWithRelations<TSchema>>,
) => Promise<T>

/**
 * 事务读写 / Transaction read/write
 * @param db - 数据库实例 / Database instance
 * @param fn - 事务方法 / Transaction function
 * @param config - 事务配置 / Transaction configuration
 * @example
 * ```ts
 * const { data, error } = withTransaction(db, async (tx) => {
 *      const [user] = await tx.select().from(users).where(eq(users.id, 1))
 *      if(user){
 *          throw new Error('user exists')
 *      }
 *      const returning = await tx.update(users).set({ name: 'John' }).where(eq(users.id, 1)).returning({ id: users.id });
 *      return returning
 * })
 * if(error){
 *    console.log(error) // user exists
 * }
 * console.log(data) // { id: 1 }
 * ```
 */
export const withTransaction = async <T, TSchema extends Record<string, unknown>>(
    db: PgDatabase<NodePgQueryResultHKT, TSchema> & { $client: NodePgClient },
    fn: TransactionFn<T, TSchema>,
    config: Partial<PgTransactionConfig> = {},
): Promise<{ data?: T; error?: string }> => {
    const defaultConfig: PgTransactionConfig = {
        isolationLevel: 'repeatable read',
        accessMode: 'read write',
    }
    const mergeConfig = { ...defaultConfig, ...config }
    try {
        const result = await db.transaction(async (tx) => await fn(tx), { ...mergeConfig })
        return { data: result }
    } catch (error: any) {
        return { error: error?.message || error }
    }
}
