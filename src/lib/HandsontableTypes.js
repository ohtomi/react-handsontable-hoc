// @flow

export type HotTableData = Array<Array<any>> | Array<any> | () => Array<Array<any>> | Array<any>

export type HotTableColumnDataFunction = (data: any) => any

export type HotTableColumn = {
    data: string | number | HotTableColumnDataFunction
}

export type HotTableColumns = Array<HotTableColumn> | (index: number) =>Array<HotTableColumn>

export type HotTableColHeaders = Array<string> | boolean | (index: number) => any

export type HotTableColumnSortingObject = {
    initialConfig: {
        column: number,
        sortOrder: 'asc' | 'desc' | ''
    }
}

export type HotTableColumnSorting = boolean | HotTableColumnSortingObject
