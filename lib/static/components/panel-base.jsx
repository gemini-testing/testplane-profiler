import _ from 'lodash';

import React from 'react';
import ReactTable from './table';
import 'react-table/react-table.css';

class PanelBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    testColumn() {
        return {
            Header: 'Test name',
            accessor: 'n'
        };
    }

    browserColumn() {
        return {
            Header: 'Browser name',
            accessor: 'b',
            width: 150
        };
    }

    sessionColumn() {
        return {
            Header: 'Session id',
            id: 'sessionId',
            accessor: (data) => {
                return data.s && data.s !== "undefined" ? data.s : "unknown";
            },
            width: 200
        };
    }

    commandColumn() {
        return {
            Header: 'Command name',
            accessor: 'n',
            width: 400
        };
    }

    commandDurationColumn() {
        return {
            Header: 'Time, ms',
            accessor: 'd',
            width: 80
        };
    }

    commandsCountColumn() {
        return {
            Header: 'Commands count',
            accessor: 'count',
            width: 120
        };
    }

    testDurationColumn() {
        const timeSortMethod = (...args) => {
            const [time1, time2] = args.map((str) => Number(str.replace(':', '.')));

            return time1 - time2;
        };

        return {
            Header: 'Time, min',
            id: 'duration',
            accessor: (data) => this.displayTime(data.d),
            width: 100,
            sortMethod: timeSortMethod
        };
    }

    makeFullWidth(column) {
        delete column.width;
        return column;
    }

    displayTime(value) {
        const date = new Date(value);
        const min = date.getMinutes();
        const sec = date.getSeconds();
        return `${_.padStart(min, 2, 0)}:${_.padStart(sec, 2, 0)}`;
    }

    getColumns() {
        throw new Error('not implemented');
    }

    hasSubColumns() {
        throw new Error('not implemented');
    }

    getSubColumns(row) {
        throw new Error('not implemented');
    }

    drawDetailTable(row) {
        throw new Error('not implemented');
    }

    render() {
        const data = this.state.data;

        return (
            <ReactTable
                data={data}
                columns={this.getColumns()}
                filterable={true}
                showPagination={true}
                defaultPageSize={100}
                defaultFilterMethod={(filter, row) =>
                    row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) !== -1}
                SubComponent={this.hasSubColumns() ? this.drawDetailTable.bind(this) : undefined}
            />
        );
    }
}

export default PanelBase;
