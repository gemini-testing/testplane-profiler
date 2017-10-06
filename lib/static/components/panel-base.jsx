'use strict';

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
            Header: 'Название теста',
            accessor: 'n'
        };
    }

    browserColumn() {
        return {
            Header: 'Название браузера',
            accessor: 'bid',
            width: 150
        };
    }

    sessionColumn() {
        return {
            Header: 'id сессии',
            accessor: 'sid',
            width: 150
        };
    }

    commandColumn() {
        return {
            Header: 'Название команды',
            accessor: 'cn'
        };
    }

    getColumns() {
        throw new Error('not implemented');
    }

    getSubColumns(row) {
        throw new Error('not implemented');
    }

    displayTime(value) {
        const date = new Date(value);
        const min = date.getMinutes();
        const sec = date.getSeconds();
        return `${_.padStart(min, 2, 0)}:${_.padStart(sec, 2, 0)}`;
    }

    testDurationColumn() {
        const timeSortMethod = (...args) => {
            const [time1, time2] = args.map((str) => Number(str.replace(':', '.')));

            return time1 - time2;
        };

        return {
            Header: 'Время, мин',
            id: 'duration',
            accessor: (data) => this.displayTime(data.d),
            width: 100,
            sortMethod: timeSortMethod
        };
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
                SubComponent={this.drawDetailTable.bind(this)}
            />
        );
    }
}

export default PanelBase;
