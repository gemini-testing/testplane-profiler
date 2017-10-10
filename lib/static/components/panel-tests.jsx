'use strict';

import React from 'react';
import ReactTable from './table';
import PanelBase from './panel-base.jsx';

class PanelTests extends PanelBase {
    getColumns() {
        return [].concat(
            this.commandsCountColumn(),
            this.testDurationColumn(),
            this.testColumn(),
            this.browserColumn(),
            this.sessionColumn()
        );
    }

    commandDurationColumn() {
        return {
            Header: 'Время, мс',
            accessor: 'd',
            width: 80
        };
    }

    commandsCountColumn() {
        return {
            Header: 'Кол-во команд',
            accessor: 'count',
            width: 120
        };
    }

    getSubColumns() {
        return [].concat(
            this.commandDurationColumn(),
            this.commandColumn()
        );
    }

    drawDetailTable(row) {
        const data = row.original.cl;
        const columns = this.getSubColumns(row);

        return (
            <div className="table-detail">
                <ReactTable
                    data={data}
                    columns={columns}
                    defaultPageSize={data.length}
                    showPagination={false}
                    SubComponent={this.drawDetailTable.bind(this)}
                />
            </div>
        )
    }
}

export default PanelTests;
