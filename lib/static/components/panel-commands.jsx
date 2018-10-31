'use strict';

import React from 'react';
import PanelBase from './panel-base.jsx';

class PanelCommands extends PanelBase {
    getColumns() {
        return [].concat(
            this.commandsCountColumn(),
            this.timeSumColumn(),
            this.exclusiveTimeSumColumn(),
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
            Header: 'Кол-во',
            accessor: 'd.length',
            width: 75
        };
    }

    timeSumColumn() {
        return {
            Header: 'Время вкл., мс',
            getHeaderProps: () => ({title: 'Суммарное время работы команды, включая вложенные'}),
            accessor: 'dSum',
            width: 120
        }
    }

    exclusiveTimeSumColumn() {
        return {
            Header: 'Время искл., мс',
            getHeaderProps: () => ({title: 'Суммарное время работы команды, исключая вложенные'}),
            accessor: 'dExclusiveSum',
            width: 120
        }
    }

    percentileColumn(percentile) {
        return {
            Header: `${percentile}-й, мс`,
            id: `percentile${percentile}`,
            accessor: (data) => Math.floor(data[`percentile${percentile}`]),
            width: 75
        }
    }
}

export default PanelCommands;
