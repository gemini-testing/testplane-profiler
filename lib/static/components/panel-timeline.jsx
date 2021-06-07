import _ from 'lodash';

import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import PanelBase from './panel-base.jsx';

class PanelTimeline extends PanelBase {
    render() {
        const X_MIN = _(this.state.data)
            .values()
            .flattenDeep()
            .map('ts')
            .min();

        const X_MAX = _(this.state.data)
            .values()
            .flatten()
            .map((thread) => (_.last(thread).te - X_MIN))
            .max();

        const getGaps = (threads, idx) => {
            if (idx === 0) {
                return threads.map((thread) => thread[0].ts - X_MIN);
            }

            return threads.map((thread) => {
                const next = thread[idx];
                const prev = thread[idx - 1];
                return next && prev ? (next.ts - prev.te) : 0;
            });
        };

        const groupSessions = (threads) => {
            return threads.map((thread) => {
                return thread.reduce((acc, {ts, te, s}) => {
                    if (!_.isEmpty(acc) && _.last(acc).s === s) {
                        _.last(acc).te = te;
                    } else {
                        acc.push({ts, te, s});
                    }

                    return acc;
                }, []);
            });
        };

        const TRANSPARENT = "rgba(255,255,255,0)";

        const getChartForBrowser = (executionThreads, browser) => {
            const index = new Map();

            const testsDatasets = _.range(0, _.maxBy(executionThreads, 'length').length)
                .reduce((datasets, idx) => {
                    const gaps = getGaps(executionThreads, idx);
                    if (gaps.some(Boolean)) {
                        datasets.push({
                            label: 'gap',
                            data: gaps,
                            backgroundColor: TRANSPARENT,
                            stack: 'tests'
                        });
                    }

                    const tests = executionThreads.map((thread) => thread[idx]);

                    const durations = tests.map((test) => test && !test.r ? test.d : 0);
                    if (durations.some(Boolean)) {
                        index.set(datasets.length, tests);

                        datasets.push({
                            label: 'test',
                            data: durations,
                            backgroundColor: "rgba(63,203,226,0.5)",
                            hoverBackgroundColor: "rgba(46,185,235,0.5)",
                            stack: 'tests'
                        });
                    }

                    const retryDurations = tests.map((test) => test && test.r ? test.d : 0);
                    if (retryDurations.some(Boolean)) {
                        index.set(datasets.length, tests);

                        datasets.push({
                            label: 'retry',
                            data: retryDurations,
                            backgroundColor: "rgba(163,103,126,0.5)",
                            hoverBackgroundColor: "rgba(140,85,100,0.5)",
                            stack: 'tests'
                        })
                    }

                    return datasets;
                }, []);

            const sessionThreads = groupSessions(executionThreads);
            const sessionsDatasets = _.range(0, _.maxBy(sessionThreads, 'length').length)
                .reduce((datasets, idx) => {
                    const gaps = getGaps(sessionThreads, idx);
                    if (gaps.some(Boolean)) {
                        datasets.push({
                            label: 'gap',
                            data: gaps,
                            backgroundColor: TRANSPARENT,
                            stack: 'sessions'
                        });
                    }

                    const sessions = sessionThreads.map((thread) => thread[idx]);

                    const durations = sessions.map((session) => session ? (session.te - session.ts) : 0);
                    if (durations.some(Boolean)) {
                        datasets.push({
                            label: 'session',
                            data: durations,
                            backgroundColor: "rgba(63,203,126,0.5)",
                            hoverBackgroundColor: "rgba(46,185,135,0.5)",
                            stack: 'sessions'
                        });
                    }

                    return datasets;
                }, []);

            const data = {
                labels: _.keys(executionThreads),
                datasets: [].concat(testsDatasets, sessionsDatasets)
            };

            const options = {
                title: {
                    display: true,
                    text: browser,
                    fontSize: 15,
                    padding: 30
                },
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        bottom: 50
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: _.ceil(X_MAX, -4),
                            callback: (value) => this.displayTime(value)
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                        },
                        stacked: true
                    }]
                },
                legend: {
                    labels: {
                        generateLabels: (chart) => {
                            return _(chart.data.datasets)
                                .uniqBy('label')
                                .map(({label, backgroundColor}) => {
                                    return {
                                        text: label,
                                        fillStyle: backgroundColor
                                    };
                                })
                                .value();
                        }
                    }
                },
                elements: {
                    rectangle: {
                        borderWidth: 1,
                        borderColor: "rgba(0, 0, 0, 1)",
                        borderSkipped: "left"
                    }
                },
                tooltips: {
                    callbacks: {
                        label: (item) => {
                            if(item.xLabel < 1000 || data.datasets[item.datasetIndex].stack === 'sessions') {
                                return;
                            }

                            let label = this.displayTime(item.xLabel);

                            const tests = index.get(item.datasetIndex);
                            if (tests) {
                                const test = tests[item.index];
                                const retry = test.r ? ` [retry ${test.r}]` : '';
                                label = `${test.n}${retry}: ${label}`;
                            }

                            return label;
                        }
                    }
                }
            };

            return {data, options};
        }

        const charts = _.map(this.state.data, (tests, browser) => {
            const {data, options} = getChartForBrowser(tests, browser);
            const height = data.datasets[0].data.length * 10 + 50;
            return <HorizontalBar data={data} options={options} height={height} />
        });

        return (
            <div>
                {charts}
            </div>
        )
    }
}

export default PanelTimeline;
