// @flow

import React from 'react';
import HotTable from 'react-handsontable';


type columnSorting = {
    column: number,
    sortOrder: boolean | null
} | boolean;

type propsType = {
    mode?: 'production' | 'debug' | '',
    logger?: (messages: Iterator<any>) => void,
    rowHeaders?: boolean,
    columnSorting?: columnSorting | null,
    columnMapping?: Array<number>,
    hiddenColumns?: Array<number>,
    afterColumnSort?: (column: number, sortOrder?: boolean) => void,
    beforeColumnMove?: (columns: Array<number>, target: number) => void,
    afterColumnMove?: (columns: Array<number>, target: number) => void,
    afterColumnResize?: (column: number, width: number, isDoubleClick: boolean) => void,
    afterUpdateSettings?: (settings: any) => void
};

type stateType = {
    columnSorting: columnSorting,
    columnMapping: Array<number>,
    hiddenColumns: Array<number>
};

export default class HotTableContainer extends React.Component {

    props: propsType;
    state: stateType;

    hot: any;

    constructor(props: propsType) {
        super(props);

        const columnSorting = props.columnSorting || false;
        const columnMapping = props.columnMapping || [];
        const hiddenColumns = props.hiddenColumns || [];

        this.state = {
            columnSorting: columnSorting,
            columnMapping: columnMapping,
            hiddenColumns: hiddenColumns
        };

        this.hot = null;
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
        this.debug('before column move', columns.join(', '), target);

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
            const range = Array.from({length: rangeLength}, (v, k) => k);

            if (to < target) {
                range.splice(target, 0, ...range.slice(from, to + 1));
                range.splice(from, to + 1 - from);
            } else if (from > target) {
                range.splice(target, 0, ...range.splice(from, to + 1 - from));
            }
            this.debug('range', range.join(', '));

            let newSortIndex = columnSorting.column;
            range.forEach((column, index) => {
                if (columnSorting.column === column) {
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
            if (this.props.beforeColumnMove) {
                this.props.beforeColumnMove(columns, target);
            }
        }
    }

    afterColumnMove(columns: Array<number>, target: number) {
        // columns are an array of physical column indexes. document bug?
        // target is visual column index.
        this.debug('after column move', columns.join(', '), target);

        try {
            this.hot.hotInstance.updateSettings({});
        } finally {
            if (this.props.afterColumnMove) {
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
                const tables = document.querySelectorAll('.htCore');
                const elementOffset = this.props.rowHeaders ? 2 : 1;

                const countCols = this.hot.hotInstance.countCols();
                const range = Array.from({length: countCols}, (v, k) => k);

                range.forEach(column => {

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

    componentDidMount() {
        const plugin = this.hot.hotInstance.getPlugin('ManualColumnMove');
        this.debug('plugin?', !!plugin);

        if (plugin) {
            /*
             * overwrite plugin's getColumnsWidth() to prevent from adding hidden columns' width into return value
             */
            const fn = (from, to) => {
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
        }
    }

    render() {
        const props = Object.assign({}, this.props);

        return (
            <HotTable ref={hot => this.hot = hot}
                      {...props}
                      columnSorting={this.state.columnSorting}
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
}
