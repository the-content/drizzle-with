import type { PgDatabase, PgTransaction, PgTransactionConfig } from 'drizzle-orm/pg-core';
import type { NodePgClient, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import type { ExtractTablesWithRelations } from 'drizzle-orm';

type TransactionFn<T, TSchema extends Record<string, unknown>> = (
    tx: PgTransaction<NodePgQueryResultHKT, TSchema, ExtractTablesWithRelations<TSchema>>,
) => Promise<T>;

type TransactionResult<T> = [string | undefined, Awaited<T>];

/**
 * 事务读写 / Transaction read/write
 * @param db - 数据库实例 / Database instance
 * @param fn - 事务方法 / Transaction function
 * @param config - 事务配置 / Transaction configuration
 * @example
 * ```ts
 * const [error, data] = await withTransaction(async (tx) => {
 *      const [user] = await tx.select().from(users).where(eq(users.id, 1))
 *      if(user) {
 *          throw new Error('user exists')
 *      }
 *      const returning = await tx.update(users).set({ name: 'John' }).where(eq(users.id, 1)).returning({ id: users.id });
 *      return returning
 * })
 * if(error){
 *    console.log(error) // user exists
 * }
 * console.log(data) // 1
 * ```
 */
export const withTransaction = async <T, TSchema extends Record<string, unknown>>(
    db: PgDatabase<NodePgQueryResultHKT, TSchema> & { $client: NodePgClient },
    fn: TransactionFn<T, TSchema>,
    config: Partial<PgTransactionConfig> = {},
): Promise<TransactionResult<T>> => {
    const defaultConfig: PgTransactionConfig = {
        isolationLevel: 'repeatable read',
        accessMode: 'read write',
    };
    const mergeConfig = { ...defaultConfig, ...config };
    try {
        const data = await db.transaction(async (tx) => await fn(tx), { ...mergeConfig });
        return [undefined, data];
    } catch (err) {
        const error = (err as Error).message;
        return [error, undefined as unknown as Awaited<T>];
    }
};
