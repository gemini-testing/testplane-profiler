'use strict';

import React from 'react';
import ReactTable from './table';
import PanelBase from './panel-base.jsx';

class PanelTests extends PanelBase {
    getColumns() {
        return [].concat(
            this.commandsCountColumn(),
            this.testDurationColumn(),
            this.makeFullWidth(this.testColumn()),
            this.browserColumn(),
            this.sessionColumn()
        );
    }

    hasSubColumns() {
        return true;
    }

    getSubColumns() {
        return [].concat(
            this.commandDurationColumn(),
            this.makeFullWidth(this.commandColumn())
        );
    }

    drawDetailTable(row) {
        const data = row.original.c;
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
