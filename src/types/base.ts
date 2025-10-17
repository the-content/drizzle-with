import type { MySqlSelect, MySqlSelectBase } from 'drizzle-orm/mysql-core';
import type { PgSelect, PgSelectBase } from 'drizzle-orm/pg-core';

export type Qb =
    | MySqlSelect
    | MySqlSelectBase<any, any, any, any, any, any, any, any, any>
    | PgSelect
    | PgSelectBase<any, any, any, any, any, any, any, any>;
