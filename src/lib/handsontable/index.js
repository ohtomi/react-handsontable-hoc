import * as RowSelectionPlugin from './RowSelectionPlugin'
import * as InitialColumnSortingPlugin from './InitialColumnSortingPlugin'
import * as ManualColumnsHidePlugin from './ManualColumnsHidePlugin'
import * as RowFilterPlugin from './RowFilterPlugin'

export {RowSelectionPlugin}
export {InitialColumnSortingPlugin}
export {ManualColumnsHidePlugin}
export {RowFilterPlugin}

export const registerPlugins = () => {
    RowSelectionPlugin.registerRowSelectionPlugin()
    InitialColumnSortingPlugin.registerInitialColumnSortingPlugin()
    ManualColumnsHidePlugin.registerManualColumnsHidePlugin()
    RowFilterPlugin.registerRowFilterPlugin()
}
