$testBody = {
  buyunits0: 1,
  sellpasswd: 181024,
  buyfleets: Buy,
}

fetch('https://hyperiums.com/servlet/Maps', {
  referrer: 'https://hyperiums.com/Map',
  referrerPolicy: 'strict-origin-when-cross-origin',
  body: $testBody,
  method: 'POST',
  mode: 'cors',
  credentials: 'include',
})
