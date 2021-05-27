'use strict';

import {ReactTableDefaults} from 'react-table';
import ReactTable from 'react-table';

Object.assign(ReactTableDefaults, {
    getTrGroupProps: (tr, rowData) => {
        if (!rowData) return;
        const data = rowData.original || {};
        return {
            className: (data.c && data.c.length) ? 'filled' : 'empty'
        };
    }
});

export default ReactTable;
