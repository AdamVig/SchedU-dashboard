services.factory('DatabaseFactory', ['$http', 'dbUrl', function($http, dbUrl) {

  $http.defaults.withCredentials = true;

  function removeTrailingSlash(url) {
    if(url.substr(-1) == '/') {
      return url.substr(0, url.length - 1);
    }
    return url;
  }

  function makeRequestUrl(couchUrl, databaseName, docId) {
    var requestUrl = removeTrailingSlash(couchUrl);
    if (databaseName) {
      requestUrl += '/' + encodeURIComponent(databaseName);
    }
    if (docId) {
      requestUrl += '/' + encodeURIComponent(docId);
    }
    return requestUrl;
  }

  function SimpleCouch(couchUrl, databaseName) {

    // Get document
    this.get = function (docId) {
      return $http({
        method: "GET",
        url: makeRequestUrl(couchUrl, databaseName, docId)
      });
    };

    // New document
    this.insert = function (docId, docData) {
      return $http({
        method: "PUT",
        url: makeRequestUrl(couchUrl, databaseName, docId),
        data: docData
      });
    };

    // Delete document
    this.delete = function (docId, docRev) {
      return $http({
        method: "DELETE",
        url: makeRequestUrl(couchUrl, databaseName, docId),
        params: { rev: docRev }
      });
    };

    // Get all documents
    this.getAll = function () {
      return $http({
        method: "GET",
        url: makeRequestUrl(couchUrl, databaseName, '_all_docs'),
        params: { include_docs: true }
      });
    };
  }

  return {
    'schedule':  new SimpleCouch(dbUrl, 'schedule'),
    'user':  new SimpleCouch(dbUrl, 'user'),
    'feedback':  new SimpleCouch(dbUrl, 'feedback'),
    'versions':  new SimpleCouch(dbUrl, 'versions')
  };

}]);
