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

// Google Map API Referrence:
// https://developers.google.com/maps/documentation/routes_preferred/reference/rest/Shared.Types/Maneuver
const isLeftTurn = (manevuer) => {
    const pattern = /ROUNDABOUT.LEFT|FORK.LEFT|RAMP.LEFT|TURN.LEFT|TURN.SLIGHT.LEFT|TURN.SHARP.LEFT|TURN.LEFT|UTURN.LEFT/i
    if (pattern.test(manevuer)) return true;
}

// Google Map API Referrence:
// https://developers.google.com/maps/documentation/routes_preferred/reference/rest/Shared.Types/Maneuver
const isRightTurn = (manevuer) => {
    const pattern = /ROUNDABOUT.RIGHT|FORK.RIGHT|RAMP.RIGHT|TURN.RIGHT|TURN.SLIGHT.RIGHT|TURN.SHARP.RIGHT|TURN.RIGHT|UTURN.RIGHT/i
    if (pattern.test(manevuer)) return true;
}

export { getTime, permute, isLeftTurn, isRightTurn }