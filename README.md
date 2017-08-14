# react-handsontable-hoc

[![Build Status](https://travis-ci.org/ohtomi/react-handsontable-hoc.svg?branch=master)](https://travis-ci.org/ohtomi/react-handsontable-hoc)

## Description

A higher order component for `react-handsontable`.

## How to use

```javascript
render() {
    const data = [
        {'id': 1, 'name': 'ford', 'year': 2018, 'volume': 1000, 'good': true},
        {'id': 2, 'name': 'volvo', 'year': 2017, 'volume': 1000, 'good': false},
        {'id': 3, 'name': 'toyota', 'year': 2016, 'volume': 1000, 'good': true},
        {'id': 4, 'name': 'honda', 'year': 2015, 'volume': 1000, 'good': true},
    ];
    
    const columns = [
        {data: 'id', type: 'numeric', width: 150, readOnly: true},
        {data: 'name', type: 'text', width: 150, readOnly: true},
        {data: 'year', type: 'numeric', width: 150, readOnly: true},
        {data: 'volume', type: 'numeric', width: 150, readOnly: true},
        {data: data => data.good ? 'GOOD' : 'BAD', type: 'text', width: 150, readOnly: true}
    ];
    
    const colHeaders = ['ID', 'NAME', 'YEAR', 'VOLUME', 'GOOD/BAD'];

    // column order: ID, YEAR, VOLUME, GOOD/BAD, NAME
    const columnMapping = [0, 2, 3, 4, 1];

    // VOLUME is hidden
    const hiddenColumns = [3];

    // sort by NAME
    const columnSorting = {
        column: 4,
        sortOrder: false
    };

    return (
        <HotTableContainer
            width="800" height="300"
            data={data} columns={columns} colHeaders={colHeaders}
            columnMapping={columnMapping} hiddenColumns={hiddenColumns}
            columnSorting={columnSorting} sortIndicator={true}
            manualColumnMove={true}
            manualColumnResize={true}/>
    );
}
```

## How to build

```bash
$ npm install
$ npm run build
```

## Contributing

1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request :D

## License

MIT

## Author

[Kenichi Ohtomi](https://github.com/ohtomi)
