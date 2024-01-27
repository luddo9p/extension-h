localforage.setDriver(localforage.INDEXEDDB)

const refreshDelay = 60

const setDBData_currentPlanets = async function () {
  const gameId = await localforage.getItem('currentGameId')

  return new Promise((resolve, reject) => {
    var pLayerName = $('#htopmenu > li:nth-child(5) > a > div > b')
      .text()
      .trim()

    localforage.getItem(gameId + '-currentPlanets').then((currentPlanets) => {
      let timestamp = currentPlanets ? currentPlanets.lastUpdate : undefined

      if (
        timestamp == undefined ||
        new Date().getTime() - timestamp >= 60 * refreshDelay
      ) {
        console.log(
          '%c *** DB: UPDATE PLANETS USER ***',
          'background: #03a9f4; color: black; padding: 5px 10px;'
        )
        const planets = Hyp.getPlanetInfo().then((response) => {
          localforage
            .setItem(gameId + '-currentPlanets', {
              lastUpdate: new Date().getTime(),
              data: response,
            })
            .then((go) => {
              resolve(go)
            })
        })
      } else {
        resolve(currentPlanets)
      }
    })
  })
}
const setDBData_foreignPlanets = async function () {
  const gameId = await localforage.getItem('currentGameId')
  return new Promise((resolve, reject) => {
    //getForeignInfo
    localforage
      .getItem(gameId + '-currentFleets')
      .then((currentForeignPlanets) => {
        let timestamp = currentForeignPlanets
          ? currentForeignPlanets.lastUpdate
          : undefined
        //timestamp = undefined

        if (
          timestamp == undefined ||
          new Date().getTime() - timestamp >= 60 * refreshDelay
          ) {
          console.log(
            '%c *** DB: UPDATE PLANETS FOREIGN ***',
            'background: #03a9f4; color: black; padding: 5px 10px;'
          )

          const planets = Hyp.getForeignInfo({
            data: 'own_planets',
          }).then((response) => {
            localforage
              .setItem(gameId + '-currentFleets', {
                lastUpdate: new Date().getTime(),
                data: response,
              })
              .then((go) => {
                resolve(go)
              })
              .catch((err) => {
                reject(err)
              })
          })
        } else {
          resolve(currentForeignPlanets)
        }
      })
  })
}
const setDBData_moves = async function () {
  const gameId = await localforage.getItem('currentGameId')
  return new Promise((resolve, reject) => {
    localforage.getItem(gameId + '-moves').then((moves) => {
      let timestamp = moves ? moves.lastUpdate : undefined
      //timestamp = undefined

      if (
        timestamp == undefined ||
        new Date().getTime() - timestamp >= 60 * refreshDelay      ) {
        console.log(
          '%c *** DB: UPDATE USER MOVES ***',
          'background: #03a9f4; color: black; padding: 5px 10px;'
        )

        const planets = Hyp.getMoves().then((response) => {
          moves = _.orderBy(response, 'dist')
          moves = _.groupBy(moves, 'to')
          localforage
            .setItem(gameId + '-moves', {
              lastUpdate: new Date().getTime(),
              data: moves,
            })
            .then((go) => {
              resolve(go)
            })
            .catch((err) => {
              reject(err)
            })
        })
      } else {
        resolve(moves)
      }
    })
  })
}

const setAlliance = async function () {
  const gameId = await localforage.getItem('currentGameId')
  let alliance = await localforage.getItem(gameId + '-alliance')
  let timestamp = alliance ? alliance.lastUpdate : undefined
  return new Promise((resolve, reject) => {
    if (timestamp == undefined || new Date().getTime() - timestamp >= 60 * refreshDelay) {
      link = $(
        '.planetCard3 > div.visib_content > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > span > a'
      ).attr('href')
      if (!link) {
        link = $(
          '.planetCard3 > div.visib_content > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > span > a'
        ).attr('href')
      }
      console.log("link", link)
      $.get(link, (scrap) => {
        let parser = new DOMParser()
        let doc = parser.parseFromString(scrap, 'text/html')

        var table = $(doc).find('.alternArray')
        var list = []

        //  console.log(table)

        table.find('tr').each(function (i, el) {
          // console.log(i);
          if (i > 0) {
            var item = {}
            var player = $(el).find('td').eq(0).find('b').text()
            var raw_planets = $(el).find('td').eq(1).text().split(' ')

            _.each(raw_planets, function (el, i) {
              if (el.trim() != '') {
                list.push({
                  player: player,
                  planet: el,
                })
              }
            })
          }
        })

        console.log(
          '%c DB: UDAPTE ALIANCE DATA ***',
          'background: green; color: white; padding: 5px 10px;'
        )

        localforage
          .setItem(gameId + '-alliance', {
            lastUpdate: new Date().getTime(),
            data: list,
          })
          .then((data) => {
            resolve(data)
          })
          .catch(function (err) {
            reject(err)
          })
      })
    } else {
      resolve(alliance)
    }
  })
}

const scrapArmyGen = async function (currentPlanets) {
  const gameId = await localforage.getItem('currentGameId')
  let armies = await localforage.getItem(gameId + '-armies')
  let timestamp = armies ? armies.lastUpdate : undefined
  return new Promise((resolve, reject) => {
    if (timestamp == undefined || new Date().getTime() - timestamp >= 60 * refreshDelay) {
      $.get(Hyp.url('Fleets?pagetype=factories'), (scrap) => {
        let parser = new DOMParser()
        let doc = parser.parseFromString(scrap, 'text/html')
        let data = []
        $(doc)
          .find('.factoryCard')
          .each((i, card) => {
            const planetId = parseInt($(card).attr('id').replace('pc', ''), 10)

            const planets = currentPlanets.data
            var find = planets.find((item) => item.id === planetId)
            const armyGen = $(card).find('input.redbutton').length > 0 ? 0 : 1
            if (find) {
              data.push({
                planetId: find.id,
                armyGen: armyGen,
              })
            }
          })
        localforage
          .setItem(gameId + '-armies', {
            lastUpdate: new Date().getTime(),
            data: data,
          })
          .then(() => {
            resolve(data)
          })
          .catch(function (err) {
            reject(err)
          })
      })
    } else {
      resolve(armies)
    }
  })
}

const scrapMap = async function (_key, _coords) {
  const gameId = await localforage.getItem('currentGameId')
  let map = await localforage.getItem(gameId + '-' + _key)
  let tags = await localforage.getItem(gameId + '-tags')
  let moves = await localforage.getItem(gameId + '-moves')
  let switches = await localforage.getItem(gameId + '-switches')
  let timestamp = map ? map.lastUpdate : undefined

  if (timestamp == undefined || new Date().getTime() - timestamp >= 60 * refreshDelay) {
    $.post(Hyp.url('Maps'), {
      distance: 10,
      planet: 0,
      clusterid: '1',
      reqx: _coords.x,
      reqy: _coords.y,
      go: 'OK',
      searchplanets: '',
      maptype: 'planets_trade',
    }).done((result) => {
      console.log(
        '%c *** MAP SCAPPING ***',
        'background: green; color: white; padding: 5px 10px;'
      )
      let parser = new DOMParser()
      let doc = parser.parseFromString(result, 'text/html')
      let data = []
      $(doc)
        .find('.stdArray')
        .find('tr')
        .each((index, row) => {
          const _row = $(row)
          if (index > 0 && _row.find('td').eq(0).find('a').eq(1).attr('href')) {
            data.push({
              planet: _row.find('td').eq(0).text().replace('@ ', '').trim(),
              id: parseInt(
                _row
                  .find('td')
                  .eq(0)
                  .find('a')
                  .eq(1)
                  .attr('href')
                  .replace('Maps?planetnews=&planetid=', ''),
                10
              ),
              coords: _row.find('td').eq(2).text(),
              tag: _row.find('td').eq(1).text().trim(),
              gov: _row.find('td').eq(4).text(),
              race: _row.find('td').eq(5).text(),
              prod: _row.find('td').eq(7).text(),
              civ: _row.find('td').eq(3).text(),
              activity: _row.find('td').eq(8).text(),
            })
          }
        })

      if (data) {
        // Switch govs
        let diffSwitch = []
        data.forEach((row, index) => {
          if (!map) return
          let newData = map.data.find((item) => item.id == row.id)
          if (newData) {
            if (row.gov != newData.gov) {
              diffSwitch.push({
                old: newData,
                new: row,
                time: new Date().getTime(),
              })
            }
          }
        })

        // moves
        let diffMoves = []
        data.forEach((row, index) => {
          if (!map) return
          let newData = map.data.find((item) => item.id === row.id)
          if (newData) {
            if (row.coords != newData.coords) {
              diffMoves.push({
                old: newData,
                new: row,
                time: new Date().getTime(),
              })
            }
          }
        })

        // tags
        var diffTag = []
        data.forEach((row, index) => {
          if (!map) return
          let newData = map.data.find((item) => item.id === row.id)
          if (newData) {
            //console.log(row.tag)
            if (row.tag != newData.tag) {
              diffTag.push({
                old: newData,
                new: row,
                time: new Date().getTime(),
              })
            }
          }
        })

        localforage.setItem(gameId + '-moves', {
          lastUpdate: new Date().getTime(),
          lastUpdateReadable: new Date(),
          data:
            moves.data === 'undefined'
              ? _.uniqBy(moves.data.concat(diffMoves), 'old.id')
              : diffMoves,
        })

        localforage.setItem(gameId + '-tags', {
          lastUpdate: new Date().getTime(),
          lastUpdateReadable: new Date(),
          data: tags ? _.uniqBy(tags.data.concat(diffTag), 'old.id') : diffTag,
        })

        localforage.setItem(gameId + '-switches', {
          lastUpdate: new Date().getTime(),
          lastUpdateReadable: new Date(),
          data: switches
            ? _.uniqBy(switches.data.concat(diffSwitch), 'old.id')
            : diffSwitch,
        })
      }

      localforage
        .setItem(gameId + '-' + _key, {
          lastUpdate: new Date().getTime(),
          lastUpdateReadable: new Date(),
          data: data,
        })
        .then(() => {
          console.log(
            '%c *** DB: UPDATE SWITCH ***',
            'background: green; color: white; padding: 5px 10px'
          )
        })
    })
  }
}

const scrapMapCore = async function () {
  const gameId = await localforage.getItem('currentGameId')
  const core = await localforage.getItem(gameId + '-core')
  let timestamp = core ? core.lastUpdate : undefined

  return new Promise((resolve, reject) => {
    if (timestamp == undefined || new Date().getTime() - timestamp >= 60 * refreshDelay) {
      let coreCoords = {
        x: 0,
        y: -10,
      }

      $.post(Hyp.url('Maps'), {
        distance: 10,
        planet: 0,
        clusterid: '1',
        reqx: coreCoords.x,
        reqy: coreCoords.y,
        go: 'OK',
        searchplanets: '',
        maptype: 'planets_trade',
      }).done((result) => {
        console.log(
          '%c *** SCAP MAP CORE',
          'background: green; color: white; padding: 5px 10px;'
        )
        let parser = new DOMParser()
        let doc = parser.parseFromString(result, 'text/html')
        let data = []
        $(doc)
          .find('.stdArray')
          .find('tr')
          .each((index, row) => {
            const _row = $(row)
            if (
              index > 0 &&
              _row.find('td').eq(0).find('a').eq(1).attr('href')
            ) {
              data.push({
                planet: _row.find('td').eq(0).text().replace('@ ', '').trim(),
                id: parseInt(
                  _row
                    .find('td')
                    .eq(0)
                    .find('a')
                    .eq(1)
                    .attr('href')
                    .replace('Maps?planetnews=&planetid=', ''),
                  10
                ),
                coords: _row.find('td').eq(2).text(),
                tag: _row.find('td').eq(1).text().trim(),
                gov: _row.find('td').eq(4).text(),
                race: _row.find('td').eq(5).text(),
                prod: _row.find('td').eq(7).text(),
                civ: _row.find('td').eq(3).text(),
                activity: parseInt(
                  _row.find('td').eq(8).text().replace(/\D/g, '')
                ),
              })
            }
          })
        //console.log(map.data, data)
        if (data) {
          let threats = []
          data.forEach((row, index) => {
            let spliting = row.coords.split(',')

            let coords = {
              x: parseFloat(spliting[0].replace(/[^\d.-]/g, '')),
              y: parseFloat(spliting[1].replace(/[^\d.-]/g, '')),
            }
            // PANDA
            if (
              row.gov != 'Hyp.' &&
              row.tag === '-' &&
              coords.x > -6 &&
              coords.x < 6 &&
              Math.abs(coords.y) <= 20
            ) {
              threats.push(row)
            }
          })
          _index = core ? core.index : 0

          _index = _index >= threats.length - 1 ? 0 : _index + 1
          if (!core) {
            localforage.setItem(gameId + '-core', {
              lastUpdate: new Date().getTime(),
              index: _index,
              data: threats,
            })
            return false
          }

          const row = core.data[_index]
          if (!row) return

          let spliting = row.coords.split(',')

          let coords = {
            x: parseFloat(spliting[0].replace(/[^\d.-]/g, '')),
            y: parseFloat(spliting[1].replace(/[^\d.-]/g, '')),
          }

          $.get(
            Hyp.url(
              `servlet/Maps?tm=&reqx=${coords.x}&reqy=${coords.y}&d=0&cluserId=1`
            )
          ).done((result) => {
            let parser = new DOMParser()
            let doc = parser.parseFromString(result, 'text/html')
            let data = []
            const planets = $(doc).find('.planet')
            // NO RESULT IN TACT MAP
            if (planets.length === 0) {
              let newData = core.data.find((item) => item.id === row.id)
              if (newData) {
                newData.tactmap = null
                newData.warning = true
                newData.time = new Date().getTime()
                core.data[_index] = newData
              }
            } else {
              $(planets).each((i, el) => {
                planetName = $(el).text().trim()
                let newData = threats.find(
                  (item) =>
                    item.planet === planetName &&
                    item.planet == core.data[_index].planet
                )
                if (newData) {
                  newData.tactmap = {
                    nrg: $(el)
                      .parent()
                      .parent()
                      .parent()
                      .find('.energy')
                      .text()
                      .trim()
                      .replace('Energy: ', ''),
                  }
                  newData.warning = false
                  newData.time = new Date().getTime()
                  core.data[_index] = newData
                }
              })
            }
            localforage
              .setItem(gameId + '-core', {
                lastUpdate: new Date().getTime(),
                index: _index,
                threatsLenght: threats.length,
                data: core.data,
              })
              .then(() => {
                resolve()
                console.log(
                  '%c *** DB: UPDATE CORE THREATS ***',
                  'background: green; color: white; padding: 5px 10px'
                )
              })
          })
        }
      })
    }
  })
}