import _ from 'lodash';

const countTestCommands = (data) => {
    const countCommands = (test) => _.sum(test.c.map(countCommands).concat(test.c.length));

    return _.map(data, (test) => _.set(test, 'count', countCommands(test)));
};

const groupBySession = (data) => {
    return _(data)
        .groupBy('s')
        .map((tests, s) => {
            return {
                s,
                b: _.head(tests).b,
                c: _.flatMap(tests, 'c'),
                d: _.sumBy(tests, 'd')
            }
        })
        .value();
};

const groupByCommand = (data) => {
    const map = {};

    const goDeep = (data, browser) => {
        if (data.n) {
            const key = `${browser}#${data.n}`;
            let command = map[key];
            if (!command) {
                command = {
                    n: data.n,
                    b: browser,
                    d: []
                };
                map[key] = command;
            }
            command.d.push(data.d);
        }

        data.c.forEach((command) => goDeep(command, browser));
    };

    data.forEach((task) => goDeep(task, task.b));
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

const groupByExecutionThread = (tests) => {
    const findThreadIdx = (test, threads) => {
        const idxBySession = threads.findIndex((thread) => _.last(thread).s === test.s);
        if (idxBySession !== -1) {
            return idxBySession;
        }

        const idxByTest = threads.findIndex((thread) => _.last(thread).n === test.n);
        if (idxByTest !== -1) {
            return idxByTest;
        }

        const idxByTime = threads.findIndex((thread) => _.last(thread).te < test.ts);
        if (idxByTime !== -1) {
            return idxByTime;
        }

        return threads.length;
    }

    return _.sortBy(tests, 'ts').reduce((threads, test) => {
        const idx = findThreadIdx(test, threads);
        threads[idx] = threads[idx] || [];
        threads[idx].push(test);

        return _.sortBy(threads, (thread) => _.last(thread).te);
    }, []);
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
    },
    prepareDataForTimelineTab: (data) => {
        return _(data)
            .groupBy('b')
            .mapValues(groupByExecutionThread)
            .value();
    }
}
