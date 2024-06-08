export class HRVUtils {
    constructor(data) {
        this.data = data;
    }

    mean() {
        return this.data.reduce((a, b) => a + b, 0) / this.data.length;
    }

    standardDeviation() {
        const avg = this.mean();
        const squareDiffs = this.data.map(value => Math.pow(value - avg, 2));
        const avgSquareDiff = new HRVUtils(squareDiffs).mean();
        return Math.sqrt(avgSquareDiff);
    }

    movingAverage(windowSize) {
        return this.data.map((val, idx, array) => {
            if (idx < windowSize - 1) return null;
            const window = array.slice(idx - windowSize + 1, idx + 1);
            return Math.round(new HRVUtils(window).mean());
        });
    }

    movingStandardDeviation(windowSize) {
        return this.data.map((val, idx, array) => {
            if (idx < windowSize - 1) return null;
            const window = array.slice(idx - windowSize + 1, idx + 1);
            return Math.round(new HRVUtils(window).standardDeviation());
        });
    }
}
