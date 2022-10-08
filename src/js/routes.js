/* =============================================================================
                                    Routes
   ========================================================================== */

/**
 * Some additional routes that expose the API
 * These endpoints may be useful for performing
 * trivial operations when exposed
 * * */

var languages;

async function getSupportedLanguages() {
   const request = new XMLHttpRequest();
   request.responseType = "json";

   try {
      request.open("GET", protocol + endpoint + "/v2/languages");

      request.onerror = (() => {
         request.abort();
         clearInterval(loadAnimation);
         setTimeout(() => {
            alert('There was an error with this request \n'
            )
         }, 1000);
      });

      request.onload = (() => {
         languages = JSON.stringify(request.response);
      });

      request.send();
   }
   catch (err) {
      alert('There was a problem with this submission')
      console.log(err);
   }
}

var words;

async function getWords() {
   const request = new XMLHttpRequest();
   request.responseType = "json";

   let formData = new FormData();
   formData.set('username', username);
   formData.set('apiKey', apiKey); // Add rules to formData Object

   let url = "";

   let pointer = 0;
   for (const pair of formData.entries()) {
      url += pair[0];
      url += "="
      url += pair[1];

      if (pointer !== 1)
         url += "&"

      pointer++;
   }

   pointer = 0;

   try {
      request.open("GET", protocol + endpoint + "/v2/words?" + url);

      request.onerror = (() => {
         request.abort();
         clearInterval(loadAnimation);
         setTimeout(() => {
            alert('There was an error with this request \n'
            )
         }, 1000);
      });

      request.onload = (() => {
         words = JSON.stringify(request.response)
      });

      request.send();
   }
   catch (err) {
      alert('There was a problem with this submission')
      console.log(err);
   }
}

var dicts;

async function addWords(word) {
   const request = new XMLHttpRequest();
   request.responseType = "json";

   let formData = new FormData();
   formData.set('word', word);
   formData.set('username', username);
   formData.set('apiKey', apiKey); // Add rules to formData Object

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

   try {
      request.open("POST", protocol + endpoint + "/v2/words?" + url);

      request.onerror = (() => {
         request.abort();
         clearInterval(loadAnimation);
         setTimeout(() => {
            alert('There was an error with this request \n'
            )
         }, 1000);
      });

      request.onload = (() => {
         dicts = JSON.stringify(request.response)
      });

      request.send();
   }
   catch (err) {
      alert('There was a problem with this submission')
      console.log(err);
   }
}

var deleteWord;

async function deleteWords(word) {
   const request = new XMLHttpRequest();
   request.responseType = "json";

   let formData = new FormData();
   formData.set('word', word);
   formData.set('username', username);
   formData.set('apiKey', apiKey); // Add rules to formData Object

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

   try {
      request.open("POST", protocol + endpoint + "/v2/words?" + url);

      request.onerror = (() => {
         request.abort();
         clearInterval(loadAnimation);
         setTimeout(() => {
            alert('There was an error with this request \n'
            )
         }, 1000);
      });

      request.onload = (() => {
         deleteWord = JSON.stringify(request.response)
      });

      request.send();
   }
   catch (err) {
      alert('There was a problem with this submission')
      console.log(err);
   }
}


