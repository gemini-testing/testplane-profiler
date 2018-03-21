'use strict';

import _ from 'lodash';

const countTestCommands = (data) => {
    const countCommands = (test) => _.sum(test.cl.map(countCommands).concat(test.cl.length));

    return _.map(data, (test) => _.set(test, 'count', countCommands(test)));
};

const groupBySession = (data) => {
    return _(data)
        .groupBy('sid')
        .map((tests, sid) => {
            return {
                sid,
                bid: _.head(tests).bid,
                cl: _.flatMap(tests, 'cl'),
                d: _.sumBy(tests, 'd')
            }
        })
        .value();
};

const groupByCommand = (data) => {
    const map = {};

    const goDeep = (data, browser) => {
        if (data.cn) {
            const key = `${browser}#${data.cn}`;
            let command = map[key];
            if (!command) {
                command = {
                    cn: data.cn,
                    bid: browser,
                    d: []
                };
                map[key] = command;
            }
            command.d.push(data.d);
        }

        data.cl.forEach((command) => goDeep(command, browser));
    };

    data.forEach((task) => goDeep(task, task.bid));
    return _.values(map);
};

const fetchPercentiles = (data) => {
    const writePercentile = (test, perc) => {
        const arr = test.d;
        const index = Math.floor(arr.length * perc / 100);
        test[`percentile${perc}`] = arr[index];
    };

    data.forEach((test) => {
        test.d.sort((a, b) => a - b);
        writePercentile(test, 95);
        writePercentile(test, 80);
        writePercentile(test, 50);
    });
};

export default {
    prepareDataForTestsTab: (data) => {
        return countTestCommands(data);
    },
    prepareDataForSessionsTab: (data) => {
        const groupedData = groupBySession(data);
        return countTestCommands(groupedData);
    },
    prepareDataForCommandsTab: (data) => {
        const groupedData = groupByCommand(data);
        fetchPercentiles(groupedData);
        return groupedData;
    }
}
