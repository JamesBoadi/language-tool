var _text = document.getElementById("editable");
var inputPlaceholder = document.getElementById('editable-text-placeholder');

var userTyping = false;
var displayAlert = false;

const onSubmitEvent = (e) => {
  let sanitize = "";
  let empty = true;
  // Can lead to unexpected results if the end is trimmed
  const text = document.getElementById("editable").value.toString().trimStart();

  if (displayAlert)
    displayAlert = false;

  if (!userTyping) {
    inputPlaceholder.style = "visibility: hidden;";
    userTyping = true;
  }
  sanitize = filterArr(text);
  sanitize = assignId(sanitize);
  setSanitize(sanitize);

  if (sanitize.length > 0 && !isEmpty(sanitize[0].text))
    empty = false;


  if (!empty) {
    removeAllTags(); // cleanup
    setInput(sanitize.length - 1);
    let input = text.replace(/\s+/g, ' ');
    getData(input.toString().trim()); // call API
    return;
  }

  if (getNoErrors())
    setNoErrors(false);
}

tippy('span', {
  content(reference) {
    const error = reference.getAttribute('error');

    if (isEmpty(error))
      return 'Input Text Here! ✅';

    return error;
  },
  trigger: 'click'
});

/***
 * Parse data from API
 * 
 * data: {errors: errors, input: {id: id, text: text}}
 */
const parseErrors = (data) => {
  assignErrors(data); // generate tags 
}



_text.onmousedown = function (e) {
  if (!userTyping) {
    inputPlaceholder.style = "visibility: hidden;";
    userTyping = true;
  }
}

_text.onkeyup = function (e) {
  if (!userTyping) {
    inputPlaceholder.style = "visibility: hidden;";
    userTyping = true;
  }
}
/* 
    The tipover will sometimes not display correctly on a new
    paragraph line, currently no workaround for this from
    our end 
*/
var output = document.getElementById("output-text");
output.onmousedown = function (e) {
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
    placement: placement,
  });
}

async function getData(input) {
  let formData = new FormData();
  formData.set('language', 'en-US');
  formData.set('text', input); // Add rules to formData Object
  formData.set('enabledOnly', enabledOnly);

  let url = "";

  let pointer = 0;
  for (const pair of formData.entries()) {
    url += pair[0];
    url += "="
    url += pair[1];

    if (pointer !== 2)
      url += "&"

    pointer++;
  }

  pointer = 0;

  let count = 0;
  let loadAnimation;
  var output = document.getElementById("output-text");
  var animate = document.getElementById('loadingAnimation');

  const request = new XMLHttpRequest();
  request.responseType = "json";
  let errors = "";

  try {
    request.open("POST", protocol + endpoint + "/v2/check?" + url);
    animate.style = "visibility: visible;"
    loadAnimation =
      setInterval(() => {
        if (output.hasChildNodes()) {
          animate.style = "visibility: hidden;"
          clearInterval(loadAnimation);
          loadAnimation = null;
        }
      }, 100);

    request.onerror = (() => {
      request.abort();
      clearInterval(loadAnimation);

      if (!displayAlert) {
        setTimeout(() => {
          alert('There was an error with this request \n' +
            '\nPlease ensure that only text is entered \n' +
            'There is no guarantee special characters will work!\n')
        }, 1000);

        displayAlert = true;
      }

      animate.style = "visibility: hidden;";
    });

    request.onload = (() => {
      if (request.status === 200) {
      errors = JSON.stringify(request.response)
      const data = { errors: errors };
      parseErrors(data);
      }
      else
      {
        if (!displayAlert) {
          setTimeout(() => {
            alert('There was an error with this request \n' +
              'status: server responded with ' + request.status)
          }, 1000);
    
          displayAlert = true;
        }
      }

      animate.style = "visibility: hidden;";

    });

    request.send();
  }
  catch (err) {
    if (!displayAlert) {
      setTimeout(() => {
        alert('There was an error with this request \n' +
          'msg\n' + err)
      }, 1000);

      displayAlert = true;
    }

    animate.style = "visibility: hidden;";
    console.log(err);
  }

  return errors;
}


var noErrors = true;

function getNoErrors() {
  return noErrors;
}

function setNoErrors(errors) {
  noErrors = errors;
}

var sanitizedString = [];

function getSanitize() {
  return sanitizedString;
}

function setSanitize(sanitize) {
  sanitizedString = sanitize;
}

var grammarErrors = "";

function getGrammarErrors() {
  return grammarErrors;
}

function setGrammarErrors(errors) {
  grammarErrors = errors;
}

// Get the current word
var input = 0;

function getInput() {
  return input;
}

function setInput(text) {
  input = text;
}

