export class TSSChart {
    constructor(ctx) {
        this.ctx = ctx;
        this.chart = null;
    }

    createChart(dates, tssValues, upperLimits, lowerLimits, movingAvg7, minValue, maxValue) {
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
                        label: 'TSS',
                        data: tssValues,
                        borderColor: 'rgba(128, 193, 191, 0.7)',
                        backgroundColor: 'rgba(128, 193, 191, 0.7)'
                    },
                    {
                        type: 'line',
                        label: 'Upper Limit',
                        data: upperLimits,
                        borderColor: 'rgba(64, 124, 182, 0.2)',
                        borderWidth: 1,
                        fill: -1,
                        backgroundColor: 'rgba(64, 124, 182, 0.2)',
                        pointRadius: 0,
                        pointHoverRadius: 0
                    },
                    {
                        type: 'line',
                        label: 'Lower Limit',
                        data: lowerLimits,
                        borderColor: 'rgba(64, 124, 182, 0.2)',
                        borderWidth: 1,
                        fill: +1,
                        backgroundColor: 'rgba(64, 124, 182, 0.2)',
                        pointRadius: 0,
                        pointHoverRadius: 0
                    },
                    {
                        type: 'line',
                        label: 'Trend(7-Days)',
                        data: movingAvg7,
                        borderColor: 'rgba(64, 124, 182, 0.8)',
                        borderWidth: 1,
                        fill: false,
                        backgroundColor: 'rgba(64, 124, 182, 0.8)',
                        pointRadius: 0,
                        pointHoverRadius: 3
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: minValue,
                        max: maxValue
                    }
                }
            }
        });
    }
}
