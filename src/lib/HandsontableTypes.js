// @flow

export type ColumnDataFunction = (data: any) => any

export type Column = {
    data: string | ColumnDataFunction,
    type: 'numeric' | 'text'
}

export type ColumnSortingObject = {
    column: number,
    sortOrder: boolean | null
}

export type ColumnSorting = ColumnSortingObject | boolean
