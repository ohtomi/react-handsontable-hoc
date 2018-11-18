// @flow

import {Expression} from './Expression'
import type {HotTableColumn, HotTableColumnDataFunction} from './HandsontableTypes'

export type PhysicalToExpression = {
    physical: number,
    expression: Expression
};

export class RowFilter {

    expressions: Array<PhysicalToExpression>

    constructor(expressions: Array<PhysicalToExpression>) {
        this.expressions = expressions
    }

    evaluate(data: Array<any>, columns: Array<HotTableColumn>, skips: Array<number> = []): Array<any> {
        return data.filter((record: any): boolean => {
            return this.expressions.every((element: PhysicalToExpression): boolean => {
                if (skips.some((skip: number): boolean => skip === element.physical)) {
                    return true
                }

                const column = columns[element.physical]
                const expression = element.expression

                let value: any
                if (typeof column.data === 'string') {
                    value = record[column.data]
                } else if (typeof column.data === 'function') {
                    value = (column.data: HotTableColumnDataFunction)(record)
                } else {
                    return false
                }

                return expression.evaluate(value)
            })
        })
    }
}
