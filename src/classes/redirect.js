console.log('Redirecting to non-www version of the site');

if (window.location.hostname.startsWith('www.')) {
    var newHost = window.location.hostname.substring(4);
    var newURL = window.location.protocol + '//' + newHost + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(newURL);
}