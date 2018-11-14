import * as RowSelectionPlugin from './RowSelectionPlugin'
import * as InitialColumnSortingPlugin from './InitialColumnSortingPlugin'
import * as HiddenColumnsPlugin from './HiddenColumnsPlugin'

export {RowSelectionPlugin}
export {InitialColumnSortingPlugin}
export {HiddenColumnsPlugin}

export const registerPlugins = () => {
    RowSelectionPlugin.registerRowSelectionPlugin()
    InitialColumnSortingPlugin.registerInitialColumnSortingPlugin()
    HiddenColumnsPlugin.registerHiddenColumnsPlugin()
}
