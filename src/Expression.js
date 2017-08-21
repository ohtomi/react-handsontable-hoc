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


type FactoryFunction = (props: any) => Expression;

const subclasses: Array<{ symbol: string, factory: FactoryFunction }> = [
    {symbol: 'by_values', factory: byValues},
    {symbol: 'by_function', factory: byFunction}
];


const factoryFromSymbol = (symbol: string): FactoryFunction => {
    const subclass = subclasses.find((subclass: { symbol: string, factory: FactoryFunction }): boolean => {
        return subclass.symbol === symbol;
    });

    if (!subclass) {
        throw new Error(`no found Expression factory by ${symbol}`);
    }

    return subclass.factory;
};

export function get(obj: { symbol: string, props: any }): Expression {
    const factory = factoryFromSymbol(obj.symbol);
    return factory(obj.props);
}

const symbolFromFactory = (factory: (props: any) => Expression): string => {
    const subclass = subclasses.find((subclass: { symbol: string, factory: FactoryFunction }): boolean => {
        return subclass.factory === factory;
    });

    if (!subclass) {
        throw new Error(`no found Expression symbol by ${factory.name}`);
    }

    return subclass.symbol;
};

export function byValues(values: Array<any>): FilterByValues {
    const symbol = symbolFromFactory(byValues);
    return new FilterByValues(symbol, values);
}

export function byFunction(func: (value: any) => boolean): FilterByFunction {
    const symbol = symbolFromFactory(byFunction);
    return new FilterByFunction(symbol, func);
}
