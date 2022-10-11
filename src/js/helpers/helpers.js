/* =============================================================================
                            Helper Methods
   ========================================================================== */

// Find word with error that matches the offset
const findWordWithError = (input, offset, len) => {
    let word = null;
    let inputOffset = 0;
    for (let index = 0; index < input.length; index++) {
        const element = input[index];
        let outputOffset = parseInt(offset + len);
        inputOffset = parseInt(element.offset + element.len);
        if (inputOffset === outputOffset)
            return word = element;
    }
    return word;
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

    if (text.length <= 1)
        return [text];

    let pointer = 0;
    let arr = [];
    for (let index = 0; index < text.length; index++) {
        const char = text[index];

        if (char === ' ') {
            const substring = text.substring(pointer, index + 1).trim();
            pointer = index;

            if (substring !== '')
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

    const _text = concat(arr);
    arr = [];
    pointer = 0;

    // Convert back to array
    return _text.split(" ");
}

const assignId = (arr) => {
    const modArr = [];
    // add lengths
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        modArr[index] = {};

        modArr[index].element = element; // Individual word
        modArr[index].size = element.length; // Length of individual word
    }

    const newArr = [];
    let offsetCount = 0;
    let offset = 0;

    for (let index = 0; index < arr.length; index++) {
        if (index === 0)
            offset = 0;
        else {
            let prev = modArr[index - 1].size;
            offset += prev + 1;
        }

        newArr[index] = {
            id: index, text: modArr[index].element,
            offset: offset, len: modArr[index].size
        };
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

const findID = (arr, id) => {
    let item;
    for (let index = 0; index < arr.length; index++) {

        const element = arr[index];
        if (element.id === id)
            return item = element;
    }
    return item;
}
