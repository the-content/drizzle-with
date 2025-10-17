/**
 * 过滤操作配置
 * Filter operation configuration
 */
export const FILTER_OPS = [
    { id: 'eq', label: 'Value equal', 'label-zh': '等于' },
    { id: 'ne', label: 'Value is not equal', 'label-zh': '不等于' },
    { id: 'gt', label: 'Value is greater than', 'label-zh': '大于' },
    { id: 'gte', label: 'Value is greater than or equal', 'label-zh': '大于等于' },
    { id: 'lt', label: 'Value is less than', 'label-zh': '小于' },
    { id: 'lte', label: 'Value is less than or equal', 'label-zh': '小于等于' },
    { id: 'like', label: 'Value is like other value, case sensitive', 'label-zh': '模糊匹配(大小写敏感)' },
    { id: 'ilike', label: 'Value is like other value, case insensitive', 'label-zh': '模糊匹配(大小写不敏感)' },
    { id: 'isNull', label: 'Value is null', 'label-zh': '值等于空' },
] as const

/**
 * 不需要值的条件符，可以给前端使用
 * Operations that do not require a value, can be used by frontend
 */
export const OPERATIONS_WITHOUT_VALUE = ['isNull', 'isEmpty', 'isNotNull'] as const
