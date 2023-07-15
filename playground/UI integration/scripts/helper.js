const getTime = (seconds) => {
    var date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

// Generating permutation using heap algorithm
// Reference: https://en.wikipedia.org/wiki/Heap%27s_algorithm
const permute = (k, arr, callbackForSequence) => {
    if (k === 1) {
        if (callbackForSequence) {
            callbackForSequence(arr)
        }
    }
    else {
        permute(k - 1, arr, callbackForSequence);
        for (let i = 0; i < k - 1; i++) {
            if (k % 2 == 0) {
                [arr[k - 1], arr[i]] = [arr[i], arr[k - 1]]
            }
            else {
                [arr[k - 1], arr[0]] = [arr[0], arr[k - 1]]
            }
            permute(k - 1, arr, callbackForSequence)
        }
    }
}

export { getTime, permute }