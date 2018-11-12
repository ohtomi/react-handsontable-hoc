import * as RowSelectionPlugin from './RowSelectionPlugin'
import * as HiddenColumnsPlugin from './HiddenColumnsPlugin'

export {RowSelectionPlugin}
export {HiddenColumnsPlugin}

export const registerPlugins = () => {
    RowSelectionPlugin.registerRowSelectionPlugin()
    HiddenColumnsPlugin.registerHiddenColumnsPlugin()
}
