# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.6.0 (2018-11-24)

### Added

- New properties of `HotTableContainer`
  - `initialColumnSorting` is to sort after loading data
  - `manualColumnsHide` is to hide columns
  - `afterRowSelection` is to notify selected physical row index
  - `afterRowFiltering` is to notify the number of filtered rows
- `Handsontable` from `handsontable` is exported to support custom renderer

### Changed

- A type of `initialColumnSorting`'s `sortOrder` is changed from `boolean` to `text`, according to `Handsontable` v6.1.1
- When column header button clicked, a physical column index will be passed
- `HotTableContainer` properties
  - from `onClickRowFilterIndicator` to `onClickColHeaderButton`
  - from `rowFilterIndicatorClassName` to `colHeaderButtonClassName`
- `HotTableContainer` is wrapped by `React.memo` to make it pure component
- Remove `reevaluate` method from `RowFilter`

### Fixed

- An unnecessary space, occupied by hidden columns, on the right side of a table is trimmed

### Removed

- `HotTableContainer` properties
  - `columnMapping`
  - `hiddenColumns`
  - `rowHeaders`

## 0.5.1 (2017-11-06)

### Added

- Generate source map

## 0.5.0 (2017-10-19)

### Fixed

- Fix initial column moving problem

### Added

- Add selection mode
  - `cell`: current or area selection (default)
  - `row`: row(s) selection

## 0.4.0 (2017-09-10)

### Fixed

- Fix column order reset bug if filtered data is empty array

## 0.3.0 (2017-09-01)

### Fixed

- Fix initial column movement bug

## 0.2.0 (2017-08-27)

### Added

- Render buttons as row filter indicator on column header if both of `rowFilter` and `onClickRowFilterIndicator` are specified
- Add `rowFilter` to filter rows
- Add `onClickRowFilterIndicator` to handle click events from row filter indicators

### Changed

- Make `hiddenColumns` updatable

### Fixed

- Fix `eslint` errors
- Fix `flowtype` errors

## 0.1.0 (2017-08-15)

Initial release

### Added

- Add Fundamental features
