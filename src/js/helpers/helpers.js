/* =============================================================================
                            Helper Methods
   ========================================================================== */

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
  
    if(text.length <= 1)
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
    for (let index = text.length -1; index >= 0; index--) {
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
    const newArr = [];
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        newArr[index] = { id: index, text: element };
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