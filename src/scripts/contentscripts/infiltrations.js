var urlParams = new URLSearchParams(window.location.search)
const id = parseInt(urlParams.get('planetid'))

const infiltrations = async function () {
  const gameId = await localforage.getItem('currentGameId')
  let planets = await localforage.getItem(gameId + '-currentPlanets')

  let farms = []
  const elements = $('.nonclickable').eq(2).find('table tr')
  return new Promise((resolve, reject) => {
    elements.each((i, el) => {
      if (i > 1) {
        window.setTimeout(() => {
          const link = $(el).find('a').eq(2).attr('href')
          if (link) {
            $.get(link, (content) => {
              
              // Planetspy?planetid=2042&backurl=Planetinf?planetid=219
              var urlParams = new URLSearchParams(link)
              const id = link.split('?')[1].split('&')[0].replace('planetid=', '')
              const pop = $(content).find('.hlight').eq(3).text()
              const name = $(content).find('.hugetext.bold').text()


              farms.push({
                name,
                id: parseInt(
                  link.split('?')[1].split('&')[0].replace('planetid=', '')
                ),
                pop: pop,
              })
            })
          }

          if (i === elements.length - 1) {
            resolve(farms)
          }
        }, i * 400)
      }
    })
  })
}
$('.nonclickable').eq(2).before(
  `<div class="moves banner">
      <table class="farms switches" id="farms">
        <thead>
          <tr>
            <td>Name</td>
            <td>Pop</td>
            <td>Variation</td>
          </tr>
      <thead>
      <tbody>
        <tr>
          <td>Gathering data...</td>
        </tr>
      </tobdy>
    </table>
    </div>`
)
const farms = infiltrations().then(async (farms) => {
  const gameId = await localforage.getItem('currentGameId')
  const localFarms = await localforage.getItem(gameId + '-farms-' + id)


  let timestamp = localFarms ? localFarms.lastUpdate : undefined
  if (timestamp == undefined || new Date().getTime() - timestamp >= 86400) {
    localforage
      .setItem(gameId + '-farms-' + id, {
        lastUpdate: new Date().getTime(),
        data: farms,
      })
      .then(() => {
        console.log(
          '%c *** DB: UPDATE FARMS ***',
          'background: green; color: white; padding: 5px 10px'
        )
      })
  }
  $('.farms').find('tbody').find('td').eq(0).remove()

  farms.forEach((item) => {
    const farm = localFarms.data.find((p) => p.name === item.name)
    const variation = item.pop - farm.pop

    $('.farms')
      .find('tbody')
      .append(
        `<tr><td>${item.name}</td><td>${item.pop}</td><td width="20">${variation}</td></tr>`
      )
  })
})
