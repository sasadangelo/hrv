export class PMCChart {
    constructor(ctx) {
        this.ctx = ctx;
        this.chart = null;
    }

    createChart(dates, tssValues, ctlValues, atlValues, tsbValues) {
        const data = {
            labels: dates,
            datasets: [
                {
                    label: 'CTL (Fitness)',
                    data: ctlValues,
                    borderColor: 'rgba(64, 124, 182, 0.7)',
                    backgroundColor: 'rgba(64, 124, 182, 0.7)',
                    borderWidth: 2,
                    fill: false,
                    type: 'line',
                    pointRadius: 0,
                    pointHoverRadius: 3
            },
                {
                    label: 'ATL (Fatigue)',
                    data: atlValues,
                    borderColor: 'rgba(220, 103, 101, 0.7)',
                    backgroundColor: 'rgba(220, 103, 101, 0.7)',
                    borderWidth: 2,
                    fill: false,
                    type: 'line',
                    pointRadius: 0,
                    pointHoverRadius: 3
                },
                {
                    label: 'TSB (Form)',
                    data: tsbValues,
                    borderColor: 'rgba(246, 222, 130, 0.7)',
                    backgroundColor: 'rgba(246, 222, 130, 0.7)',
                    borderWidth: 2,
                    fill: false,
                    type: 'line',
                    pointRadius: 0,
                    pointHoverRadius: 3
                },
            ]
        };

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(this.ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Score'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }
}
