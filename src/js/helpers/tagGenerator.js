/* =============================================================================
                                Generating Tags
   ========================================================================== */
let errorsArr = [];
let counter = 0;

var outputPlaceholder = document.getElementById('output-text-placeholder');

//  Add the tooltips
const createTag = (text) => {
    const id = text.id;
    const word = text.text;
    const errors = text.errors;
    var output = document.getElementById("output-text");
    var span = null;

    try {
        let error = "";
        if (typeof errors !== "string" && errors !== '') {
            if (getNoErrors())
                setNoErrors(false);

            span = document.createElement("span");
            const replacementWords = [];
            const length = errors.length;

            for (let index = 0; index < length; index++) {
                const value = errors[index].value;
                replacementWords.push(value);
            }
            error = concat(replacementWords); // text to be added to tooltip
            span.setAttribute("id", "tooltip-" + id);
            span.setAttribute("error", error);
            span.setAttribute("class", "improvements");
            span.style = "background-color: " + highlightColor;
        }

        var content = document.createTextNode(word);
        if (span !== null) {
            span.appendChild(content);
            output.appendChild(span);
            output.appendChild(document.createTextNode('\u00A0'));
        }
        else {  // not every word has an error
            output.appendChild(content);
            output.appendChild(document.createTextNode('\u00A0'));
        }
    } catch (error) {
        console.log(error);
        if (!displayAlert) {
            setTimeout(() => {
                alert('There was an error with this request \n' +
                    '\nPlease ensure that only text is entered \n' +
                    'There is no guarantee special characters will work!')
            }, 1000);

            displayAlert = true;
        }
        return;
    }
}

const removeAllTags = () => {
    counter = 0;
    pointer = 0;
    words = [];
    matched = [];
    unmatched = [];

    setNoErrors(false);
    let output = document.getElementById("output-text");
    while (output.lastChild) {
        output.removeChild(output.lastChild);
    }
}

/* 
    The API intrepets text differently and we cannot
    assume how it does so as we did not design the system,
    therefore any unmatched words that miss the offset marginally
    will be highlighted here
*/
var unmatched = [];
const unmatchedErrors = (errors) => {
    let errMatches = errors.matches;
    const length = errMatches.length;
    const input = getTextBlock();
    for (errCount = 0; errCount < length; errCount++) {
        let error = errMatches[errCount];
        const context = error.context;
        const matchOffset = error.offset;
        const length = error.length;
        let replacement = errMatches[errCount].replacements;

        let match = track[errCount].modified;
        let inputOffset = track[errCount].offset;
        let len = track[errCount].length;

        let word = {};
        const substring = input.substring(inputOffset, inputOffset + (len)).trim();
        if (!match) {
            word.text = substring;
            word.offset = inputOffset;
            word.errors = (replacement.length === 0) ? [{ value: error.message }] : replacement;
            unmatched.push(word);
        }

    }


}

// Iterate through all of the errors
const checkErrors = (input, errors) => {
    if (errors.matches.length > 0) {
        // all errors
        findWordWithError(input);
        populate(errors.matches);
        let pointer = 0;
        while (pointer < map.size) {
            const item = map.get(pointer);
            setOffset(item, errors);
            pointer++;
        }

    }
}

var matched = [];
var words = [];
var track = []; // keep track of words replaced
const setOffset = (item, errors) => {
    let errMatches = errors.matches;
    const len = errMatches.length;

    for (errCount = 0; errCount < len; errCount++) {
        let error = errMatches[errCount];
        const context = error.context;
        const offset = context.offset;
        const matchOffset = error.offset;
        const len = context.length;
        const errorText = context.text;
        let replacement = errMatches[errCount].replacements;

        let modified = track[errCount].modified;
        let trackOffset = track[errCount].offset;
        let trackLen = track[errCount].length;

        if (item.offset === matchOffset && modified === false) {
            track[errCount].modified = true;
            //console.log(errCount);
            item.errors = replacement;
            if (replacement.length === 0)
                item.errors = [error.message];

            unmatched.push(item);
            return;
        }
    }

    matched.push(item);
}

// Assign errors to each word
const assignErrors = async (data) => {
    const input = getSanitize(); // The text in input box
    let errors = JSON.parse(data.errors); // JSON response
    checkErrors(input, errors);
    unmatchedErrors(errors);

    let s = await mergeNoDuplicates(matched, unmatched);

    for (let index = 0; index < s.length; index++) {
        if (s[index] !== null)
            words.push(s[index]);
    }

    words = assignId(words);

    while (pointer < words.length)
        createTag(words[pointer++]);

    if (getNoErrors()) {
        outputPlaceholder.innerText = "No Errors";
        outputPlaceholder.style = "visibility: visible;"
            + "transform: translate(-10px, -5px); z-index: 1;"
            + "font-weight: 400; color: rgba(135, 130, 130, 0.183);";
    }
    else
        outputPlaceholder.style = "visibility: hidden;";

    setNoErrors(true);
}

async function mergeNoDuplicates(matched, unmatched) {
    let matchedLen = matched.length;
    let unmatchedLen = unmatched.length;

    let s = [];
    for (let index = 0; index < unmatchedLen; index++)
        s[index] = unmatched[index];

    let counter = 0;
    for (let index = unmatchedLen; index < unmatchedLen + matchedLen; index++)
        s[index] = matched[counter++];
    // sort
    let sLen = s.length;
    let sortCounter = 0;
    while (sortCounter < sLen) {
        for (var mCount = 0; mCount <= (sLen - 1); mCount++) {
            for (var uCount = 0; uCount < (sLen - mCount - 1); uCount++) {
                if (s[uCount].offset > s[uCount + 1].offset) {
                    let tmp = s[uCount];
                    s[uCount] = s[uCount + 1];
                    s[uCount + 1] = tmp;
                }
            }
        }
        sortCounter++;
    }

    // remove duplicates
    for (let index = 0; index < s.length - 1; index++) {
        const current = s[index];
        const next = s[index + 1];

        if (current === null || current === undefined)
            continue;
        else if (next === null || next === undefined)
            continue;

        if (current.text.trim() === next.text.trim() && current.errors === '') {
            s[index].errors = next.errors;
            s[index + 1] = null;
        }
        else {
            const regex = ['.', '?', '"', '“', '”', ' @', ':', '¡', '¿', '。', '、', '!'];
            // punctuation error
            if (regex.includes(next.text) && next.errors.length > 0) {
                s[index].errors = next.errors;
                s[index + 1] = null;
            }
            else {
                let char = '';
                let _next = '';
                let pointer = index + 1; // Ahead of next
                let temp = current.text;

                for (let count = 0; count < current.text.length; count++) {
                    char += current.text[count].toString().trim();
                    if (char === next.text.trim() && next.errors === '') {
                        s[index].errors = current.errors;
                        _next = s[pointer].text.trim();
                        temp = temp.split(_next).pop().toString().trim();
                        if (!isEmpty(temp)) {
                            let count = temp.split(" ").length;
                            pointer += count;
                            for (let c = 0; c < count; c++)
                                temp = temp.split(_next).pop().toString().trim();

                            let rem = 0;
                            while (rem < temp.split(" ").length) {
                                if (current.text.includes(s[pointer].text)) {
                                    s[pointer] = null; // remove excess words
                                }
                                pointer--;
                                rem++;
                            }
                        }
                        s[index + 1] = null;
                        char = '';
                        break;
                    }
                }
            }

        }
    }
    return s;
}






