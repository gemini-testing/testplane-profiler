'use strict';

import {ReactTableDefaults} from 'react-table';
import ReactTable from 'react-table';

Object.assign(ReactTableDefaults, {
    getTrGroupProps: (tr, rowData) => {
        if (!rowData) return;
        const data = rowData.original || {};
        return {
            className: data.cl.length ? 'filled' : 'empty'
        };
    }
});

export default ReactTable;
