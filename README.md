<div align="center">
  <h1><strong>drizzle-with</strong></h1>
</div>

<p align="center">
  <strong>Drizzle ORM utilities library providing pagination, sorting, filtering, counting, soft delete, and transaction features</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/drizzle-with">
    <img src="https://img.shields.io/npm/v/drizzle-with.svg?style=flat&colorA=000000&colorB=000000" alt="npm version" />
  </a>
  <a href="https://npm.chart.dev/drizzle-with">
    <img src="https://img.shields.io/npm/dm/drizzle-with?style=flat&colorA=000000&colorB=000000" alt="npm downloads" />
  </a>
  <a href="https://github.com/the-content/drizzle-with">
    <img src="https://img.shields.io/github/stars/the-content/drizzle-with?style=flat&colorA=000000&colorB=000000" alt="GitHub stars" />
  </a>
</p>

<div align="center">

[English](./README.md) | [中文](https://www.zdoc.app/zh/the-content/drizzle-with)

</div>

## Features

- **Unified API** - Support for MySQL and PostgreSQL with the same usage
- **Pagination Query** - Simple and easy-to-use pagination functionality
- **Smart Filtering** - Support for multiple filter conditions, compatible with TanStack Table
- **Sorting Function** - Multi-field sorting with snake_case to camelCase conversion
- **Count Query** - Efficient total count statistics
- **Soft Delete** - Flexible soft delete filtering
- **Transaction Support** - Safe transaction processing
- **Table Query** - Table data processing solution
- **TypeScript** - Complete type support and intelligent hints

## Installation

```bash
npm install drizzle-with
```

## Quick Start

### Basic Imports

```typescript
// Basic feature imports
import { withPagination, withSorting, withFilters, withCounts, withSoftDelete } from 'drizzle-with';

// Transaction imports
import { withTransaction } from 'drizzle-with/mysql';
// or
import { withTransaction } from 'drizzle-with/postgres';
```

## API Documentation

### Pagination Query (withPagination)

Used to implement pagination functionality with support for page index and page size settings.

```typescript
import { db } from './db';
import { users } from './schema';
import { withPagination, withCounts } from 'drizzle-with';

const qb = db.select().from(users).$dynamic();

// Pagination
withPagination(qb, {
    pageIndex: 1,
    pageSize: 10,
});
const rows = await qb;
// [{...},{...}]

// Total count
const counts = await withCounts(qb);
// 100
```

### Sorting Query (withSorting)

Support for multi-field sorting with automatic snake_case to camelCase conversion.

```typescript
import { db } from './db';
import { users } from './schema';
import { withSorting } from 'drizzle-with';

const qb = db.select().from(users).$dynamic();

withSorting(qb, [
    { id: 'createdAt', desc: true },
    { id: users.id.name, desc: true },
]);

const rows = await qb;
```

### Filter Query (withFilters)

Support for multiple filter conditions, can be used with TanStack Table.

```typescript
import { db } from './db';
import { users } from './schema';
import { withFilters, type Filters } from 'drizzle-with';

const qb = db.select().from(users).$dynamic();

const filters: Filters = [
    { id: 'name', op: 'like', value: 'John' }, // Fuzzy match
    { id: 'age', op: 'gte', value: 18 }, // Greater than or equal
    { id: 'status', op: 'eq', value: 'active' }, // Equal
    { id: 'email', op: 'isNull' }, // Is null
];

const conditions = withFilters(qb, filters);

// Apply filter conditions
const filteredQuery = qb.where(and(...conditions));
// Execute query
const rows = await qb;
```

### All fields Filters (withAutoFilters)

Build filter conditions automatically based on all fields in the table and the provided filter values

```ts
import { db } from './db';
import { users } from './schema';
import { and, eq } from 'drizzle-orm';
import { withAutoFilters } from 'drizzle-with';

const qb = db.select().from(users).$dynamic();
// Data received through the interface
const values = {
    name: 'John',
    email: 'abc@example.com',
    // Non-existent fields will be automatically filtered out
    notExistColumn: "anyvalue",
};
// Build filter conditions, default to using eq comparison for all fields
const conditions = withAutoFilters(qb, values, {
    email: 'like', // Special processing of filter operators for specific fields
});
// Other conditions can also be added
conditions.push(eq(users.id, 1));
// Apply filter conditions
qb.where(and(...conditions));

const rows = await qb;
```

**Supported filter operations:**

- `eq` - Equal
- `ne` - Not equal
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal
- `like` - Fuzzy match (case sensitive)
- `ilike` - Fuzzy match (case insensitive, PostgreSQL only)
- `isNull` - Is null

### Soft Delete (withSoftDelete)

Filter soft deleted records with support for custom delete fields.

```typescript
import { db } from './db';
import { users } from './schema';
import { withSoftDelete } from 'drizzle-with';

const qb = db.select().from(users).$dynamic();

// Default filter deletedAt field
const conditions = withSoftDelete(qb, { atColumn: 'deletedAt' });
// or
const conditions = withSoftDelete(qb, { atColumn: users.deletedAt });

qb.where(conditions);
// Apply conditions
const rows = await qb;
```

### Transaction Processing (withTransaction)

Safe transaction processing with automatic error catching.

```typescript
// MySQL transaction
import { db } from './db';
import { users } from './schema';
import { withTransaction } from 'drizzle-with/mysql';

const { data, error } = await withTransaction(db, async (tx) => {
    const [user] = await tx.select().from(users).where(eq(users.id, 1));
    if (user) {
        throw new Error('User already exists');
    }
    const result = await tx.update(users).set({ name: 'John' }).where(eq(users.id, 1)).returning({ id: users.id });
    return result;
});

if (error) {
    console.log('Transaction failed:', error);
} else {
    console.log('Transaction successful:', data);
}
```

### Table Query (withTableQuery)

Table data processing solution that integrates pagination, sorting, filtering, soft delete, and counting functionality.

```typescript
import { db } from './db';
import { users } from './schema';
import { withTableQuery } from 'drizzle-with';

const qb = db.select().from(users).$dynamic();

const result = await withTableQuery(qb, {
    // Sorting configuration
    sorting: [{ id: 'createdAt', desc: true }],

    // Filter conditions
    filters: [
        { id: 'name', op: 'like', value: 'John' },
        { id: 'status', op: 'eq', value: 'active' },
    ],

    // Pagination configuration
    pagination: {
        pageIndex: 1,
        pageSize: 20,
    },

    // Soft delete configuration
    softDelete: {
        atColumn: 'deletedAt',
        enabled: true,
    },
});

console.log(result.rows); // Query results
console.log(result.meta); // Metadata (including pagination info and total count)
```

### Utility Functions

```typescript
import { snakeToCamel, camelToSnake, lower } from 'drizzle-with';

// Name conversion
const camelCase = snakeToCamel('user_name'); // 'userName'
const snakeCase = camelToSnake('userName'); // 'user_name'

// Column to lowercase (for queries)
const query = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
```

## Type Support

drizzle-with provides complete TypeScript type support:

```typescript
import type { Pagination, SortingOption, Filters, SoftDeleteOptions, TableQueryOptions } from 'drizzle-with';

// Pagination type
const pagination: Pagination = {
    pageIndex: 1,
    pageSize: 10,
};

// Sorting type
const sorting: SortingOption[] = [{ id: 'name', desc: false }];

// Filter type
const filters: Filters = [{ id: 'status', op: 'eq', value: 'active' }];
```

## License

MIT @ [drizzle-with](https://github.com/the-content/drizzle-with)

## Contributing

Issues and Pull Requests are welcome!

---

<p align="center">
  Made with ❤️ for the <a href="https://github.com/drizzle-team/drizzle-orm">Drizzle ORM</a>
</p>
