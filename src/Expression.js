// @flow

export class Expression {

    symbol: string;
    props: any;

    constructor(symbol: string, props: any) {
        this.symbol = symbol;
        this.props = props;
    }

    evaluate(value: any): boolean {
        return value;
    }
}

export class FilterByValues extends Expression {

    constructor(symbol: string, props: Array<any>) {
        super(symbol, props);
    }

    evaluate(value: any): boolean {
        return this.props.some((prop: any): boolean => prop === value);
    }
}

export class FilterByFunction extends Expression {

    constructor(symbol: string, props: (value: any) => boolean) {
        super(symbol, props);
    }

    evaluate(value: any): boolean {
        return this.props(value);
    }
}


const subclasses = [
    {symbol: 'by_values', ctor: FilterByValues},
    {symbol: 'by_function', ctor: FilterByFunction}
];

export function get(obj: { symbol: string, props: any }): ?Expression {
    const subclass = subclasses.find((subclass: { symbol: string, ctor: Expression }): boolean => {
        return subclass.symbol === obj.symbol;
    });

    if (!subclass) {
        return null;
    }

    return new subclass.ctor(obj.symbol, obj.props);
}

const symbolFromConstructor = (ctor: Expression): string => {
    const subclass = subclasses.find((subclass: { symbol: string, ctor: Expression }): boolean => {
        return subclass.ctor === ctor;
    });

    return subclass.symbol;
};

export function byValues(values: Array<any>): FilterByValues {
    const symbol = symbolFromConstructor(FilterByValues);
    return new FilterByValues(symbol, values);
}

export function byFunction(func: (value: any) => boolean): FilterByFunction {
    const symbol = symbolFromConstructor(FilterByFunction);
    return new FilterByFunction(symbol, func);
}
