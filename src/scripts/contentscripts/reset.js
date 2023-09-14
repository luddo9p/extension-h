Object.keys(Cookies.get()).forEach(function(cookieName) {
  console.log(cookieName);
  Cookies.remove("timestampInflu");
});

console.log('reset');