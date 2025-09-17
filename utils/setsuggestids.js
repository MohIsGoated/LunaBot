let suggest_ids = []

function setSuggestIds(ids) {
    suggest_ids = ids;
}

function getSuggestIds() {
    return suggest_ids;
}

module.exports = {setSuggestIds, getSuggestIds}