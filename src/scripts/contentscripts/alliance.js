// const setAlliance = async function() {
//   const gameId = await localforage.getItem('currentGameId')
//   var timestamp = Cookies.get('timestampAlliance')

//   var table = $('.alternArray')
//   var list = []

//   table.find('tr').each(function(i, el) {
//     // console.log(i);
//     if (i > 0) {
//       var item = {}
//       var player = $(el)
//         .find('td')
//         .eq(0)
//         .find('b')
//         .text()
//       var raw_planets = $(el)
//         .find('td')
//         .eq(1)
//         .text()
//         .split(' ')

//       _.each(raw_planets, function(el, i) {
//         if (el.trim() != '') {
//           list.push({
//             player: player,
//             planet: el
//           })
//         }
//       })
//     }
//   })

//   if (timestamp == undefined || new Date().getTime() - timestamp > 30000) {
//     // chrome.storage.sync.set({
//     //   'alliance': list
//     // })
//     localforage
//       .setItem(gameId + '-alliance', list)
//       .then(value => {
//         console.log(value)
//       })
//       .catch(err => {
//         console.log(err)
//       })
//     Cookies.set('timestampAlliance', new Date().getTime())
//   }
// }
// setAlliance()