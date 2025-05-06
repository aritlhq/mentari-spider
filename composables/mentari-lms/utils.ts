export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const retryRequest = async (fn: Function, retries = 3, delayMs = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (i === retries - 1) throw e;
            await delay(delayMs * (i + 1));
        }
    }
};