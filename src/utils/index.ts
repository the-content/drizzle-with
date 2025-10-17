import { sql, type Column } from 'drizzle-orm'

/**
 * 列转小写 / Convert column to lowercase
 * @param column - 列名 / Column name
 * @example
 * ```ts
 * await db.select().from(users).where(eq(lower(users.email), email.toLowerCase()));
 * //sql -> select * from "users" where lower(email) = 'john@email.com';
 * ```
 */
export const lower = (column: Column) => sql`lower(${column})`

/**
 * 蛇形命名转小驼峰 / Convert snake_case to camelCase
 * @param str - 蛇形命名的字符串 / Snake case string
 * @example
 * ```ts
 * const name = snakeToCamel('user_name')
 * console.log(name) // userName
 * ```
 */
export const snakeToCamel = (str: string) => {
    return str.replace(/_(\w)/g, function (all, letter) {
        return letter.toUpperCase()
    })
}

/**
 * 驼峰转蛇形 / Convert camelCase to snake_case
 * @param str - 驼峰命名的字符串 / Camel case string
 * @example
 * ```ts
 * const name = camelToSnake('userName')
 * console.log(name) // user_name
 * ```
 */
export const camelToSnake = (str: string) => {
    return str.replace(/[A-Z]/g, function (all, letter) {
        return '_' + letter.toLowerCase()
    })
}
