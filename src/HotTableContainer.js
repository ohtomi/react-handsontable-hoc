// @flow

import React from 'react';
import Handsontable from 'handsontable';
import HotTable from 'react-handsontable';

import RowFilter from "./RowFilter";
import type {PhysicalToExpression} from "./RowFilter";


type columnSorting = {
    column: number,
    sortOrder: boolean | null
} | boolean;

type propsType = {
    mode?: 'production' | 'debug' | '',
    logger?: (messages: Iterator<any>) => void,
    data: Array<any>,
    columns: Array<any>,
    rowHeaders?: boolean,
    columnSorting?: columnSorting | null,
    columnMapping?: Array<number>,
    hiddenColumns?: Array<number>,
    afterGetColHeader: (column: number, th: HTMLElement) => void,
    afterColumnSort?: (column: number, sortOrder?: boolean) => void,
    beforeColumnMove?: (columns: Array<number>, target: number) => void,
    afterColumnMove?: (columns: Array<number>, target: number) => void,
    afterColumnResize?: (column: number, width: number, isDoubleClick: boolean) => void,
    afterUpdateSettings?: (settings: any) => void,
    rowFilter?: RowFilter,
    onClickRowFilterIndicator?: (ev: MouseEvent, column: number) => void
};

type stateType = {
    data: Array<any>,
    columnSorting: columnSorting,
    columnMapping: Array<number>,
    hiddenColumns: Array<number>
};

export default class HotTableContainer extends React.Component {

    props: propsType;
    state: stateType;

    initialized: boolean;
    hot: { hotInstance: Handsontable };

    constructor(props: propsType) {
        super(props);

        const reevaluator = this.evaluateRowFilter.bind(this, props.data, props.columns);
        if (props.rowFilter) {
            props.rowFilter.reevaluator = reevaluator;
        }

        const data = props.rowFilter ? props.rowFilter.evaluate(props.data, props.columns) : props.data;
        const columnSorting = props.columnSorting || false;
        const columnMapping = props.columnMapping || [];
        const hiddenColumns = props.hiddenColumns || [];

        this.state = {
            data: data,
            columnSorting: columnSorting,
            columnMapping: columnMapping,
            hiddenColumns: hiddenColumns
        };
    }

    evaluateRowFilter(data: Array<any>, columns: Array<any>, rowFilter: RowFilter) {
        this.setState({data: rowFilter.evaluate(data, columns)});
    }

    afterGetColHeader(/*column: number, thEl: HTMLElement*/) {
        // column is visual column index.
    }

    afterColumnSort(column: number, sortOrder?: boolean) {
        // column is visual column index.
        this.debug('after column sort', column, sortOrder);

        try {
            if (this.state.columnSorting && this.state.columnSorting.column === column && this.state.columnSorting.sortOrder === sortOrder) {
                return;
            }

            if (sortOrder !== undefined) {
                this.setState({
                    columnSorting: {
                        column: column,
                        sortOrder: sortOrder
                    }
                });
            } else {
                this.setState({
                    columnSorting: {
                        column: column,
                        sortOrder: null
                    }
                });
            }
        } finally {
            if (this.props.afterColumnSort) {
                this.props.afterColumnSort(column, sortOrder);
            }
        }
    }

    beforeColumnMove(columns: Array<number>, target: number) {
        // columns are an array of visual column indexes.
        // target is visual column index.
        this.debug('before column move', `[${columns.join(', ')}]`, target);

        try {
            if (!this.state.columnSorting) {
                return;
            }

            const columnSorting: columnSorting = this.state.columnSorting;
            const from = columns[0];
            const to = columns[columns.length - 1];

            if (columnSorting.column < from && columnSorting.column < target) {
                return;
            }
            if (columnSorting.column > to && columnSorting.column > target) {
                return;
            }

            const rangeLength = to < target ? target : to + 1;
            const range = Array.from({length: rangeLength}, (v: any, k: number): number => k);

            if (to < target) {
                range.splice(target, 0, ...range.slice(from, to + 1));
                range.splice(from, to + 1 - from);
            } else if (from > target) {
                range.splice(target, 0, ...range.splice(from, to + 1 - from));
            }
            this.debug('range', `[${range.join(', ')}]`);

            let newSortIndex = columnSorting.column;
            range.forEach((column: number, index: number) => {
                if (column === columnSorting.column) {
                    newSortIndex = index;
                }
            });
            this.debug('sort index', `${columnSorting.column} -> ${newSortIndex}`);

            this.setState({
                columnSorting: {
                    column: newSortIndex,
                    sortOrder: columnSorting.sortOrder
                }
            });
        } finally {
            if (this.props.beforeColumnMove && this.initialized) {
                this.props.beforeColumnMove(columns, target);
            }
        }
    }

    afterColumnMove(columns: Array<number>, target: number) {
        // columns are an array of physical column indexes. document bug?
        // target is visual column index.
        this.debug('after column move', `[${columns.join(', ')}]`, target);

        try {
            this.hot.hotInstance.updateSettings({});
        } finally {
            if (this.props.afterColumnMove && this.initialized) {
                this.props.afterColumnMove(columns, target);
            }
        }
    }

    afterColumnResize(column: number, width: number, isDoubleClick: boolean) {
        // column is visual column index.
        this.debug('after column resize', column, width, isDoubleClick);

        try {
            this.hot.hotInstance.updateSettings({});
        } finally {
            if (this.props.afterColumnResize) {
                this.props.afterColumnResize(column, width, isDoubleClick);
            }
        }
    }

    afterUpdateSettings(settings: any) {
        try {
            requestAnimationFrame(() => {
                const tables = this.hot.hotInstance.rootElement.querySelectorAll('.htCore');
                const elementOffset = this.props.rowHeaders ? 2 : 1;

                const countCols = this.hot.hotInstance.countCols();
                const range = Array.from({length: countCols}, (v: any, k: number): number => k);

                range.forEach((column: number) => {

                    const hidden = this.state.hiddenColumns.some((hidden: number): boolean => {
                        const visual = this.hot.hotInstance.toVisualColumn(hidden);
                        return column === visual;
                    });

                    tables.forEach((table: HTMLElement) => {
                        table.querySelectorAll(`col:nth-child(${column + elementOffset})`).forEach((cell: HTMLElement) => {
                            if (hidden) {
                                cell.classList.add('hidden');
                            } else {
                                cell.classList.remove('hidden');
                            }
                        });
                        table.querySelectorAll(`th:nth-child(${column + elementOffset})`).forEach((cell: HTMLElement) => {
                            if (hidden) {
                                cell.classList.add('hidden');
                            } else {
                                cell.classList.remove('hidden');
                            }
                            this.addRowFilterIndicator(column, cell, hidden);
                        });
                        table.querySelectorAll(`td:nth-child(${column + elementOffset})`).forEach((cell: HTMLElement) => {
                            if (hidden) {
                                cell.classList.add('hidden');
                            } else {
                                cell.classList.remove('hidden');
                            }
                        });
                    });
                });
            });
        } finally {
            if (this.props.afterUpdateSettings) {
                this.props.afterUpdateSettings(settings);
            }
        }
    }

    addRowFilterIndicator(column: number, thEl: HTMLElement, hidden: boolean) {
        try {
            if (thEl.firstChild && thEl.firstChild.lastChild && thEl.firstChild.lastChild.nodeName.toLowerCase() === 'button') {
                thEl.firstChild.removeChild(thEl.firstChild.lastChild);
            }

            if (!this.props.rowFilter || !this.props.onClickRowFilterIndicator || hidden) {
                return;
            }

            const physical = this.hot.hotInstance.toPhysicalColumn(column);
            const active = this.props.rowFilter && this.props.rowFilter.expressions.some((expression: PhysicalToExpression): boolean => {
                return expression.physical === physical;
            });

            const buttonEl = document.createElement('button');
            buttonEl.innerHTML = '\u25BC';
            buttonEl.className = `changeType ${active ? 'active' : ''}`;
            buttonEl.addEventListener('click', (ev: MouseEvent) => {
                if (this.props.onClickRowFilterIndicator) {
                    this.props.onClickRowFilterIndicator(ev, column);
                }
            });

            if (thEl.firstChild) {
                thEl.firstChild.appendChild(buttonEl);
                thEl.style.whiteSpace = 'normal';
            }
        } finally {
            if (this.props.afterGetColHeader) {
                this.props.afterGetColHeader(column, thEl);
            }
        }
    }

    componentDidMount() {
        const plugin = this.hot.hotInstance.getPlugin('ManualColumnMove');
        this.debug('plugin?', !!plugin);

        if (plugin) {
            /*
             * overwrite plugin's getColumnsWidth() to prevent from adding hidden columns' width into return value
             */
            const fn = (from: number, to: number): number => {
                let width = 0;

                for (let i = from; i < to; i++) {
                    let columnWidth = 0;

                    const hidden = this.state.hiddenColumns.some((hidden: number): boolean => {
                        const visual = this.hot.hotInstance.toVisualColumn(hidden);
                        return i === visual;
                    });

                    if (hidden) {
                        columnWidth = 0;
                    } else if (i < 0) {
                        columnWidth = this.hot.hotInstance.view.wt.wtTable.getColumnWidth(i) || 0;
                    } else {
                        columnWidth = this.hot.hotInstance.view.wt.wtTable.getStretchedColumnWidth(i) || 0;
                    }

                    width += columnWidth;
                }

                return width;
            };

            plugin.getColumnsWidth = fn.bind(this);

            /**
             * move columns according to this.state.columnMapping
             */
            this.state.columnMapping.map((element: number, index: number): { physical: number, visual: number } => {
                return {physical: element, visual: index};
            }).filter((element: { physical: number, visual: number }): boolean => {
                return element.physical !== element.visual;
            }).sort((a: { physical: number, visual: number }, b: { physical: number, visual: number }): number => {
                if (a.visual < b.visual) {
                    return 1;
                } else {
                    return -1;
                }
            }).forEach((element: { physical: number, visual: number }) => {
                plugin.moveColumn(element.physical, element.visual + 1);
            });

            this.initialized = true;
        }
    }

    componentWillReceiveProps(nextProps: propsType) {
        const reevaluator = this.evaluateRowFilter.bind(this, nextProps.data, nextProps.columns);
        if (nextProps.rowFilter) {
            nextProps.rowFilter.reevaluator = reevaluator;
        }

        const newState = {};
        if (nextProps.data !== this.props.data || nextProps.rowFilter !== this.props.rowFilter) {
            newState.data = nextProps.rowFilter ? nextProps.rowFilter.evaluate(nextProps.data, nextProps.columns) : nextProps.data;
        }
        if (nextProps.hiddenColumns !== this.props.hiddenColumns) {
            newState.hiddenColumns = nextProps.hiddenColumns;
        }
        this.setState(newState);
        this.hot.hotInstance.updateSettings({});
    }

    render() {
        const props = Object.assign({}, this.props);

        return (
            <HotTable ref={hot => this.hot = hot}
                      {...props}
                      data={this.state.data}
                      columnSorting={this.state.columnSorting}
                      afterGetColHeader={this.afterGetColHeader.bind(this)}
                      afterColumnSort={this.afterColumnSort.bind(this)}
                      beforeColumnMove={this.beforeColumnMove.bind(this)}
                      afterColumnMove={this.afterColumnMove.bind(this)}
                      afterColumnResize={this.afterColumnResize.bind(this)}
                      afterUpdateSettings={this.afterUpdateSettings.bind(this)}/>
        );
    }

    debug(...messages: any) {
        if (this.props.mode !== 'debug') {
            return;
        }
        if (!this.props.logger) {
            return;
        }
        this.props.logger(...messages);
    }

    hotInstance(): Handsontable {
        return this.hot.hotInstance;
    }
}
