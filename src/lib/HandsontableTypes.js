// @flow

export type ColumnDataFunction = (data: any) => any

export type Column = {
    data: string | number | ColumnDataFunction
}
