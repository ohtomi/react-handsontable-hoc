// @flow

import {Expression} from "./Expression";

type ColumnDataFunction = (data: any) => any;

type Column = {
    data: string | ColumnDataFunction,
    type: 'numeric' | 'text'
}

type PhysicalToExpression = {
    physical: number,
    expression: Expression
};

export default class RowFilter {

    expressions: Array<PhysicalToExpression>;

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
}
