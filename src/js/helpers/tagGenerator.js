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
        if (typeof errors !== "string") {
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
    errorsArr = [];
    sortedArr = [];
    setNoErrors(false);
    let output = document.getElementById("output-text");
    while (output.lastChild) {
        output.removeChild(output.lastChild);
    }
}

// Iterate through all of the errors
const checkErrors = (input, errors) => {
    if (errors.matches.length > 0) {
        for (let pointer = 0; pointer < errors.matches.length; pointer++) {
            // all errors
            const matches = errors.matches[pointer];
            const offset = matches.offset;
            const len = matches.length;
            let wordWithError = findWordWithError(input, offset, len);
            if (Object.is(wordWithError, null))
                continue;

            wordWithError.errors = matches.replacements;
            errorsArr.push(wordWithError);
        }
    }
}

// Assign errors to each word
var sortedArr = [];
const assignErrors = (data) => {
    const input = getSanitize(); // The text in input box
    const errors = JSON.parse(data.errors); // JSON response
    checkErrors(input, errors);

    // console.log(errorsArr);

    for (let index = 0; index < input.length; index++) {
        const id = input[index].id;
        let res;
        res = findID(errorsArr, id);
        if (res !== undefined)
            sortedArr.push(res);
        else {
            input[index].errors = ""; // errors
            sortedArr.push(input[index]);
        }
    }

    while (pointer < sortedArr.length)
        createTag(sortedArr[pointer++]);

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




