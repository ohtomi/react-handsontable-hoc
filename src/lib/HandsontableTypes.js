// @flow

export type ColumnDataFunction = (data: any) => any

export type Column = {
    data: string | ColumnDataFunction,
    type: 'numeric' | 'text'
}
