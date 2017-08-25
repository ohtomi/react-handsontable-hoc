// @flow

import {Expression} from "./Expression";
import type {Column, ColumnDataFunction} from "./HandsontableTypes";

export type PhysicalToExpression = {
    physical: number,
    expression: Expression
};

export type Reevaluator = (filter: RowFilter) => void;

export default class RowFilter {

    expressions: Array<PhysicalToExpression>;
    reevaluator: ?Reevaluator;

    constructor(expressions: Array<PhysicalToExpression>) {
        this.expressions = expressions;
    }

    evaluate(data: Array<any>, columns: Array<Column>): Array<any> {
        return data.filter((record: any): boolean => {
            return this.expressions.every((element: PhysicalToExpression): boolean => {
                const column = columns[element.physical];
                const expression = element.expression;

                let value: any;
                if (typeof column.data === 'string') {
                    value = record[column.data];
                } else if (typeof column.data === 'function') {
                    value = (column.data: ColumnDataFunction)(record);
                } else {
                    return false;
                }

                return expression.evaluate(value);
            });
        });
    }

    reevaluate() {
        if (this.reevaluator) {
            this.reevaluator(this);
        }
    }
}
