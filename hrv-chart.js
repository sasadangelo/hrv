export class HRVChart {
    constructor(ctx) {
        this.ctx = ctx;
        this.chart = null;
    }

    createChart(dates, rmssdValues, upperLimits, lowerLimits, movingAvg7) {
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'HRV',
                        data: rmssdValues,
                        borderColor: 'black',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Upper Limit',
                        data: upperLimits,
                        borderColor: 'green',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Lower Limit',
                        data: lowerLimits,
                        borderColor: 'red',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: '7-Day Moving Average',
                        data: movingAvg7,
                        borderColor: 'blue',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
