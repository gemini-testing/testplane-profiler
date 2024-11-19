import React from 'react';
import PanelBase from './panel-base.jsx';

class PanelCommands extends PanelBase {
    getColumns() {
        return [].concat(
            this.commandsCountColumn(),
            this.percentileColumn(95),
            this.percentileColumn(80),
            this.percentileColumn(50),
            this.makeFullWidth(this.commandColumn()),
            this.browserColumn()
        );
    }

    hasSubColumns() {
        return false;
    }

    commandsCountColumn() {
        return {
            Header: 'Count',
            accessor: 'd.length',
            width: 75
        };
    }

    percentileColumn(percentile) {
        return {
            Header: `${percentile}-th, ms`,
            id: `percentile${percentile}`,
            accessor: (data) => Math.floor(data[`percentile${percentile}`]),
            width: 75
        }
    }
}

export default PanelCommands;
