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
    map.clear();

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
            word.errors = replacement;
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
                item.errors = error.message;

            unmatched.push(item);
            return;
        }
    }

    matched.push(item);
}

// Assign errors to each word
const assignErrors = (data) => {
    const input = getSanitize(); // The text in input box
    let errors = JSON.parse(data.errors); // JSON response
    checkErrors(input, errors);
    unmatchedErrors(errors);

    let match;
    let unmatch;

    mergeNoDuplicates(matched, unmatched)
    //console.log(m);
    /*  console.log(unmatched.length);
      console.log(matched);
  
      // Sort offset and insert based on that
      for (let index = 0; index < input.length; index++) {
          const matched = matched[index];
          const unmatched = unmatched[index];
      }*/


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

function mergeNoDuplicates(matched, unmatched) {
    let sorted = new Map();
    let matchedLen = matched.length;
    let unmatchedLen = unmatched.length;
    // console.log(matched);
    //  console.log(unmatched);

    for (let index = 0; index < matchedLen; index++)
        sorted.set(index, matched[index]);

    let counter = 0;
    for (let index = matchedLen; index < matchedLen + unmatchedLen; index++)
        sorted.set(index, unmatched[counter++]);

    // Size of map can't dynamically increase swap afterwards

    let sortedLen = sorted.size;
    console.log(sortedLen);
/*
    for (var mCount = sortedLen - 1; mCount >= (0); mCount--) {
        for (var uCount = sortedLen - mCount; uCount > 0; uCount--) {
            if(sorted.get(uCount) === undefined)
                continue;
            if (sorted.get(mCount).offset > sorted.get(uCount - 1).offset) 
            {
                sorted.set(mCount, sorted.get(uCount));
                sorted.set(mCount - 1, sorted.get(uCount));
            }
        }
    } */

    for (var mCount = 0; mCount <= (matchedLen - 1); mCount++) {
        for (var uCount = 0; uCount <= (unmatchedLen - 1); uCount++) {
            //Compare the adjacent positions
            if (unmatched[uCount].offset > matched[mCount].offset) {
                // Set keys 
                sorted.set(mCount, unmatched[uCount]);
                sorted.set(uCount, matched[mCount] )
            }
        }
    }

    console.log(sorted);
}






