/* =============================================================================
                                Generating Tags
   ========================================================================== */
let sortedArr = [];
let counter = 0;

var outputPlaceholder = document.getElementById('output-text-placeholder');

//  Add the tooltips
const createTag = (data) => {
    const input = data.input;
    const errors = data.errors;
    const sanitize = getSanitize();
    var output = document.getElementById("output-text");
    var outputPlaceholder = document.getElementById('output-text-placeholder');
    var span = null;

    try {
        let error = "";
        if (errors.matches.length > 0) {
            if (getNoErrors())
                setNoErrors(false);

            span = document.createElement("span");
            const matches = errors.matches[0];
            const replacements = matches.replacements;
            const words = [];

            const length = replacements.length;

            for (let index = 0; index < length; index++) {
                const value = replacements[index].value;
                words.push(value);
            }
            error = concat(words); // text to be added to tooltip
            span.setAttribute("id", "tooltip-" + input.id);
            span.setAttribute("error", error);
            span.setAttribute("class", "improvements");
            span.style = "background-color: " + highlightColor;
        }

        var content = document.createTextNode(input.text);
        if (span !== null) {
            span.appendChild(content);
            output.appendChild(span);
            output.appendChild(document.createTextNode('\u00A0'));
        }
        else {  // not every word has an error
            output.appendChild(content);
            output.appendChild(document.createTextNode('\u00A0'));
        }

        // tippyjs bug 
        /* 
            The tipover will not display correctly on a new
            paragraph line, currently no workaround for this from
            our end
        */
        tippy('span', {
            content(reference) {
                const error = reference.getAttribute('error');
                if (isEmpty(error))
                    return 'No suggestions avaliable';
                return error;
            },
            interactive: true,
            trigger: 'click',
            zIndex: 9999,
        });
    } catch (error) {
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
    sortedArr = [];
    setNoErrors(0);
    let output = document.getElementById("output-text");
    while (output.lastChild) {
        output.removeChild(output.lastChild);
    }
}

// Parse errors
const checkErrors = (data) => {
    let len = sortedArr.length - 1;
    let noErrors = getNoErrors();
    const wordCount = getInput();
    const input = data.input;
    const errors = JSON.parse(data.errors);

    sortedArr[input.id] = {};

    sortedArr[input.id].input = input;
    sortedArr[input.id].errors = errors;

    if (counter === wordCount) {
        while (pointer <= wordCount) {
            createTag(sortedArr[pointer++]);
        }
    }
    counter++;

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



