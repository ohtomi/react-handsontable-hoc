import * as RowSelectionPlugin from './RowSelectionPlugin'
import * as InitialColumnSortingPlugin from './InitialColumnSortingPlugin'
import * as ManualColumnsHidePlugin from './ManualColumnsHidePlugin'

export {RowSelectionPlugin}
export {InitialColumnSortingPlugin}
export {ManualColumnsHidePlugin}

export const registerPlugins = () => {
    RowSelectionPlugin.registerRowSelectionPlugin()
    InitialColumnSortingPlugin.registerInitialColumnSortingPlugin()
    ManualColumnsHidePlugin.registerManualColumnsHidePlugin()
}
