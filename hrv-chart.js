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
            type: 'bar',
            data: {
                labels: dates,
                datasets: [
                    {
                        type: 'bar',
                        label: 'HRV',
                        data: rmssdValues,
                        borderColor: 'black',
                        backgroundColor: 'rgba(0,0,0,0.1)'
                    },
                    {
                        type: 'line',
                        label: 'Upper Limit',
                        data: upperLimits,
                        borderColor: 'rgba(64, 224, 208, 0.3)',
                        borderWidth: 1,
                        fill: -1,
                        pointRadius: 0,
                        pointHoverRadius: 0
                    },
                    {
                        type: 'line',
                        label: 'Lower Limit',
                        data: lowerLimits,
                        borderColor: 'rgba(64, 224, 208, 0.3)',
                        borderWidth: 1,
                        fill: +1,
                        backgroundColor: 'rgba(64, 224, 208, 0.3)',
                        pointRadius: 0,
                        pointHoverRadius: 0
                    },
                    {
                        type: 'line',
                        label: '7-Day Moving Average',
                        data: movingAvg7,
                        borderColor: 'blue',
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 3
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        enabled: true,
                        mode: 'x'
                    },
                    pan: {
                        enabled: true,
                        mode: 'x'
                    }
                }
            }
        });
    }
}
