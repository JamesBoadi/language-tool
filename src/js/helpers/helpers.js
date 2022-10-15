/* =============================================================================
                            Helper Methods
   ========================================================================== */

// Find word with error that matches the offset

var trackOffset = 0;
var map = new Map();

const findWordWithError = (input) => {
    store(input)
}

const store = function (input) {
    let wordOffset = 0;
    let word = {};

    for (let index = 0; index < input.length; index++) {
        if (index === 0)
            wordOffset = 0;
        else {
            let prev = input[index - 1].length;
            wordOffset += prev + 1;
        }

        word.text = input[index];
        word.offset = wordOffset;
        word.errors = '';
        map.set(index, word);
        word = {};
    }
}

const concat = (arr) => {
    let text = "";
    for (let index = 0; index < arr.length; index++) {
        let item = arr[index];

        text += item;
        if (index !== arr.length - 1)
            text += " ";
    }
    // sometimes does not return a string, can be falsy
    text = text.toString().trim();
    return text;
}

const filterArr = (text) => {
    let pointer = 0;
    let arr = [];
    for (let index = 0; index < text.length; index++) {
        const char = text[index];

        if (char === ' ') {
            const substring = text.substring(pointer, index + 1).trim();
            pointer = index;

            arr.push(substring);
        }
    }

    let lastStr = [];
    for (let index = text.length - 1; index >= 0; index--) {
        const char = text[index];
        lastStr.push(char);

        if (char === ' ' && pointer !== 0) {
            arr.push(lastStr.reverse().join("").trim());
            break;
        }
    }

    _text = concat(arr);

    arr = [];
    pointer = 0;
    // Convert back to array
    return _text.split(" ");
}

const assignId = (arr) => {
    const modArr = [];
    for (let index = 0; index < arr.length; index++) {
        modArr[index].id = index; // id
    }
    return modArr;
}

const compareOffset = () => {
    let offsetCount = 0;
    let offset = 0;

    for (let index = 0; index < arr.length; index++) {
        if (index === 0)
            offset = 0;
        else {
            let prev = modArr[index - 1].size;
            offset += prev + 1;
        }

    }
    return newArr;
}

const isEmpty = (myStr) => {
    if (myStr === null || myStr.trim() === ""
        || myStr === undefined)
        return true;
    return false;
}

const compareTo = (prev, next) => {
    return (next > prev);
}

const populate = (ranges) => {
    for (let index = 0; index < ranges.length; index++) {
        track[index] = {};
        const range = ranges[index];
        track[index].offset = range.offset;
        track[index].length = range.length;
        track[index].modified = false;
    }
}

const containsRange = (offset) => {
    for (let index = 0; index < track.length; index++) {
        const range = track[index];
        if (offset === range.offset) {
            return [index, false];
        }
    }

    return [-1, true];
}

