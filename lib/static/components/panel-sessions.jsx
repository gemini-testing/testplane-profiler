'use strict';

import React from 'react';
import ReactTable from './table';
import PanelBase from './panel-base.jsx';

class PanelSessions extends PanelBase {
    getColumns() {
        return [].concat(
            this.commandsCountColumn(),
            this.makeFullWidth(this.sessionColumn()),
            this.browserColumn()
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

export default PanelSessions;
