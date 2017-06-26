const _ = require('lodash');

// helper HTTP methods
const Http = {
  request: (path, params, method) => {
    let statusSuccess,
        promise = new Promise((resolve, reject) => {
          let fetchObj = {
            method: method,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          };

          if (method !== 'GET') {
            fetchObj.body = JSON.stringify(params);
          }

          fetch(path, fetchObj)
          .then( response => {
            if (response.status >= 400) {
              reject(response);
            }
            statusSuccess = response.ok;

            return response.json();
          })
          .then( responseJson => {
            resolve(responseJson);
          })
          .catch( error => {
            // resolve successfully if status was ok but we couldn't parse json - sometimes we don't respond with json
            if (statusSuccess) {
              resolve();
            } else {
              console.warn("Http utility helper could not " + method + " data.", error);
              reject(error);
            }
          });
        });

    return promise;
  },

  get: (path, params) => {
    if (params && Object.keys(params).length) {
      path += '?';
      let count = 0;
      _.each(params, (val, key) => {
        if (count !== 0) { path += '&'; }
        path += key + '=' + val;
        count++;
      });
    }
    console.log(path);
    return Http.request(path, null, 'GET');
  },

  post: (path, params) => {
    return Http.request(path, params, 'POST');
  },

  put: (path, params) => {
    return Http.request(path, params, 'PUT');
  }

}

export default Http;
