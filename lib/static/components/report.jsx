'use strict';

import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import PanelTests from './panel-tests.jsx';

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.data = props.data;
    }

    countTestCommands() {
        const countCommands = (test) => _.sum(test.cl.map(countCommands).concat(test.cl.length));

        return _.map(this.data, (test) => _.set(test, 'count', countCommands(test)));
    }

    render() {
        return (
            <Tabs>
                <Tab label="Тесты">
                    <PanelTests data={this.countTestCommands()}/>
                </Tab>
            </Tabs>
        )
    }
}

export default Report;
