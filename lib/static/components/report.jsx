import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import PanelTests from './panel-tests.jsx';
import PanelSessions from './panel-sessions.jsx';
import PanelCommands from './panel-commands.jsx';
import PanelTimeline from './panel-timeline.jsx';
import utils from './utils.js';

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.data = props.data;
    }

    render() {
        return (
            <Tabs>
                <Tab className="tab" label="Тесты">
                    <PanelTests data={utils.prepareDataForTestsTab(this.data)}/>
                </Tab>
                <Tab className="tab" label="Сессии">
                    <PanelSessions data={utils.prepareDataForSessionsTab(this.data)}/>
                </Tab>
                <Tab className="tab" label="Команды">
                    <PanelCommands data={utils.prepareDataForCommandsTab(this.data)}/>
                </Tab>
                <Tab className="tab" label="Timeline">
                    <PanelTimeline data={utils.prepareDataForTimelineTab(this.data)}/>
                </Tab>
            </Tabs>
        )
    }
}

export default Report;
