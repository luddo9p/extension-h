function Tick(name, atMinute, everyNthHour, startHour) {
  this.name = name
  this.atMinute = atMinute
  this.everyNthHour = everyNthHour || 1
  this.startHour = startHour || 0
}

Tick.prototype.getNextDate = function (serverDate) {
  var nextDate = new Date(serverDate)
  nextDate.setUTCMilliseconds(0)
  nextDate.setUTCSeconds(0)
  nextDate.setUTCMinutes(this.atMinute)

  if (serverDate.getUTCMinutes() >= this.atMinute) {
    nextDate.setUTCHours(nextDate.getUTCHours() + 1)
  }

  var h = (nextDate.getUTCHours() + 24 - this.startHour) % this.everyNthHour
  if (this.everyNthHour > 1 && h) {
    nextDate.setUTCHours(nextDate.getUTCHours() + this.everyNthHour - h)
  }
  return nextDate
}

var Hyp = {
  currentGameId: 0,
  url: function (servlet) {
    return 'https://hyperiums.com/servlet/' + servlet
  },

  getLogoutUrl: function () {
    return this.url('Logout?logout_mode=&logout=Logout')
  },
  generateFleetMovesHTML(moves, planetName) {
    // Fonction pour calculer l'ETA
    function calculateETA(move, utcDate) {
      const dist = parseInt(move.dist, 10)
      const delay = parseInt(move.delay, 10)
  
      if (isNaN(dist) || isNaN(delay)) {
        console.error('Invalid move.dist or move.delay value')
        return null
      }
  
      const etaDate = new Date(utcDate.getTime() + dist * 3600000 + delay * 3600000) // Calcul de l'ETA
  
      if (isNaN(etaDate.getTime())) {
        console.error('Invalid ETA date calculated')
        return null
      }
  
      return etaDate
    }
  
    // Filtrer les mouvements et ajouter l'ETA
    const movesWithETA = moves
      .filter((move) => move.to === planetName)
      .map((move) => {
  
        const avgp =
          move.nbdest * Hyp.spaceAvgP[1][move.race] +
          move.nbcrui * Hyp.spaceAvgP[2][move.race] +
          move.nbbomb * Hyp.spaceAvgP[4][move.race] +
          move.nbscou * Hyp.spaceAvgP[3][move.race]
  
        // Obtenez la chaîne de date depuis le DOM
        const serverTimeText = $('.servertime').eq(0).text()
        console.log('Server time text:', serverTimeText)
  
        // Extraire la partie pertinente (ici, "ST: 2024-09-04 10:43:58")
        const dateMatch = serverTimeText.match(
          /ST:\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
        )
        if (!dateMatch) {
          console.error('Date format not found in serverTimeText')
          return null // Gérer l'erreur comme nécessaire
        }
  
        // Créez la chaîne de date au format ISO 8601
        const dateString = `${dateMatch[1]}Z`
  
        // Créez un objet Date à partir de la chaîne
        const utcDate = new Date(dateString)
  
        // Définir etaDate
        const etaDate = calculateETA(move, utcDate)
  
        return {
          avgp,
          nbarm: move.nbarm,
          etaDate,
          etaTime: (parseInt(move.dist, 10) + parseInt(move.delay, 10)) || 'N/A'
        }
      })
      .filter(move => move) // Filtrer les mouvements invalides
      .sort((a, b) => a.etaDate - b.etaDate) // Trier du plus proche au plus éloigné
      var pLayerName = $('#htopmenu > li:nth-child(5) > a > div > b')
      .text()
      .trim()
    // Générer le HTML basé sur les mouvements triés
    return movesWithETA
      .map((move) => {
        const etaString = move.etaDate ? `${move.etaDate.getUTCHours()}:02 ST` : 'N/A' // Utilisez 'N/A' si etaDate est invalide
  
        return `<div class="row">
                  ${planetName} - 
                  Fleet: ${numeral(move.avgp).format('0[.]0a')} - 
                  Ga : ${numeral(move.nbarm).format('0[.]0a')} - 
                  ETA: ${move.etaTime} - ${etaString} (${pLayerName})
                </div>`
      })
      .join('')
  },
  
  attackList: [
    {
      Synopsia:
        'lllll-l-lllllll,ll-llllllll-ll,Grandebistouque,Sonia,Talondvioc,Freretang,LBDdantoncul,Veineluisante,susmafreztagada,Boulecoco,Nonbinaire,Glucideviril,Sestka,desetka,TROJKA,enajstka,Petka,Belafoumouk,Mark,ll-llll-lllllll,llll-llllllllll,ll-ll-lllllll,llll-llll-lllll,Marrs,Mezzanine,Mozz,Marzipan,ILbastardo,lllllllllll-l-l,llllllllll-llll,ll-llllll-llll,l-l-ll-llllllll,lllllll-lllllll,Manta,Rebels',
    },
    {
      Varkenslacht:
        'Brahma,Takenoko,Vishnu,Freyr,Izanami,Gloin,Heimdal,Gilgamesh,Fast,Epic,Bluenote,Freyja,Raijin,Fujin,Rohe,tzimisce,Ventrue,Curb,Free,Welt,Wise,Expo,Zenith,Tonenili,Hastsezini,Requiem,Dokho,Camus,Toreador,Gangrel,Crown,Doom,Yuck,Fiannas,Wendigo,Maharet,Mekare,Maui,Balder',
    },
    {
      Gescom:
        'Senteurraclette,Rimkdu108,scrotumvelu,Chiengaleux,Lisa1,Lisa2,Freretang,LBDdantoncul,Veineluisante,susmafreztagada,Boulecoco,Nonbinaire,Glucideviril,lll-llllllll-ll,HomeWorld,Agazde,Texigain,Tehuan,Aghuvu,Tehumer,Minazgar,Texiwy,Agxijou,Minhuxi,Texigu,Agaztrion,Aghuion,Texifarm,Minhugar,Minaz,Minhutian,Texion,Minhupa,Minaztr,Minxi,Agxito',
    },
    {
      Sidious:
        'Echo,Flea,Crowd,Fish,Fido,Crows,Majestic,Monster,Godot,Crockette,Cortez,Wood,Yard,Goof,Geek,Weep,Wank,Waft,zee-,Zee-Ro,Meter,Millenium,Mitosis,Cuts2,Cuts,Exam,Gang,Duty,Drug,Gash,ILtiempo,Z-O2,z-01,Marrs,Mezzanine',
    },
    {
      Ninurta:
        'Neutral-1CL-D,Neutral-1G1-R,Neutral-5H-19,Rodrik,Toto,Navalny,Banban,Aulnes,Neutral-37N-1J,Neutral-3M2-1V,Aube,Crepuscule,Eternelle,Behemot,Aronda,Bourdeloux,Groguette,Neutral-LL-14,Neutral-1C-M,Neutral-2Y5-1J,Edelweiss,Sarkorax,Vraktar,Zibreline,Ellestar,Epeou,Alcion,Thalek,Neutral-285-1G',
    },
    {
      FiFi: 'Raclette,Illith,Astir,CatNyx,Stella-Maris,Balanga,Neutral-2JK-1W,Neutral-J-14,Neutral-LT-15,Neutral-UM-H1,Neutral-G-B2,Neutral-UD-Z7,Neutral-13V-10,Neutral-6X-1X,Neutral-P1-B0,Neutral-O-1Z,Erevila,Berereb,Neutral-U6-K,Neutral-378-J,Neutral-EE-1D,Neutral-4S-C1,Neutral-7Y-1H,Neutral-EX-10,Neutral-NT-QT,Neutral-1BR-1H,Jean,Louis,Neutral-8N-Y2,M-45-2H,A-45-1X,TL-01,-Trantor-, -Sol-, -Terra-,Terminus,Holy_Terra',
    },
    {
      Scratchy:
        'Eastern6,Eastern1,Eastern7,Eastern2,Eastern3,Eastern4,Eastern8,Eastern5,Northern.1,Northern.3,Northern.2,Northern.5,Northenr.6,Northern.4,Northern.7,Northern.8,Reem,Locke,Sligo,Forth,Hypss,Lucky,Montu,Hoth,Margrave,Simas,-Dominion-, -Seldon-, -Nocturne-,Macragge,Istvaan,Luna,Matters,Mind,Gaia',
    },
    {
      Seymour:
        'Proxima-Dracos,night-white,MikeT,OTP-13,Blue-Planet,Neutral-08-QS1,Seth-1,MX-NLT-R57,Tagle,Clopi-clopan,Niktou,Dyn-landi,Dagonz,Volns-5I4X7l,Groot,Boson-1Il-132,Fox-1,oli-32s-4,Frontier,Mektoub,Notilus,Fire,Naqmeo,phobie,Monoxysz,zil25-f5d8,sila-1o,Cloe-12,mosea1-87,stra-0f4g',
    },
    {
      Tleilax:
        'Mesa,Marshall,galiop,prodaz-21,Blackstar,Laney,Frankenstrat,Brownie,Thunderbird,Sheraton,zfrox-69Q,Calamir,Vox.,Crate,Plexi,ES-335,Telecaster,Mockingird,Soloist,Clyde',
    },
  ],

  login: function (login, password) {
    var H = this,
      promise = $.Deferred()
    $.ajax({
      url: this.url('Login'),
      data: {
        login: login,
        pwd: password,
        weblogin: 'Login',
        lang: 0,
      },
      type: 'post',
    }).done(function (data, textStatus, jqXHR) {
      var errorMessage = $(data).find('.alert').text()

      if (errorMessage == '') {
        H.getSession().done(function (session) {
          promise.resolveWith(H, [session])
        })
      } else {
        promise.rejectWith(H, [errorMessage])
      }
    })
    return promise
  },

  getSession: function () {
    var H = this,
      promise = $.Deferred()
    chrome.runtime.sendMessage(
      {
        request: 'getCookie',
      },
      function (cookie) {
        if (cookie) {
          var chunks = cookie.value.split('Z')

          promise.resolveWith(H, [
            {
              playerId: parseInt(chunks[0]),
              authKey: parseInt(chunks[1]),
              gameId: parseInt(chunks[2]),
            },
          ])
          H.currentGameId = parseInt(chunks[2])
        } else {
          promise.rejectWith(H, ['cookie is not set'])
        }
      }
    )
    return promise
  },
  rawValue(v) {
    var raw = 0
    var valueInt = 0
    if (v.includes('K')) {
      valueInt = parseFloat(v.replace('K'))
      raw = valueInt * 1000
    } else if (v.includes('M')) {
      valueInt = parseFloat(v.replace('M'))
      raw = valueInt * 1000000
    } else if (v.includes('B')) {
      valueInt = parseFloat(v.replace('B'))
      raw = valueInt * 1000000000
    } else {
      raw = v
    }
    return parseFloat(raw)
  },

  ticksR11: [
    new Tick('Build', 11),
    new Tick('CT', 19, 8, 6),
    new Tick('MT', 14),
    new Tick('Nrg/Tech', 6),
    new Tick('N/A', 54),
    new Tick('BT', 54, 2),
    new Tick('Ga', 17, 6),
  ].sort(function (a, b) {
    return a.name.localeCompare(b.name)
  }),

  ticksWinterGal: [
    new Tick('Build', 59),
    new Tick('CT', 7, 8, 6),
    new Tick('MT', 2),
    new Tick('Nrg/Tech', 54),
    new Tick('N/A', 42),
    new Tick('BT', 42, 2),
    new Tick('Ga', 5, 6),
  ].sort(function (a, b) {
    return a.name.localeCompare(b.name)
  }),

  ticksR12: [
    new Tick('Build', 23),
    new Tick('CT', 31, 8, 6),
    new Tick('MT', 26),
    new Tick('Nrg/Tech', 18),
    new Tick('N/A', 6),
    new Tick('BT', 6, 2),
    new Tick('Ga', 29, 6),
  ].sort(function (a, b) {
    return a.name.localeCompare(b.name)
  }),

  ticksR13: [
    new Tick('Build', 47),
    new Tick('CT', 55, 8, 6),
    new Tick('MT', 50),
    new Tick('N/A', 30),
    new Tick('Ga', 53, 6),
    new Tick('BT', 30, 2),
    new Tick('Nrg/tech', 42),
    new Tick('Planet', 0, 24, 5),
  ].sort(function (a, b) {
    return a.name.localeCompare(b.name)
  }),
  // data

  races: ['Human', 'Azterk', 'Xillor'],
  products: ['Agro', 'Minero', 'Techno'],
  governments: ['Dictatorial', 'Authoritarian', 'Democratic', 'Hyp.protect.'],
  govs: ['Dict.', 'Auth.', 'Demo.', 'Hyp.'],
  units: [
    'Factories',
    'Destroyers',
    'Cruisers',
    'Scouts',
    'Bombers',
    'Starbases',
    'Ground Armies',
    'Carried Armies',
  ],
  spaceAvgP: [
    // [Human, Azterk, Xillor, H, Average]
    [0, 0, 0, 0, 0], // Factories
    [61, 73, 67, 0, 73], // Destroyers
    [378, 393, 475, 0, 475], // Cruisers
    [8, 6, 7, 0, 8], // Scouts
    [79, 85, 105, 0, 105], // Bombers
    [2583, 2583, 2583, 0, 2583], // Starbases
    [0, 0, 0, 0, 0], // Ground Armies
    [0, 0, 0, 0, 0], // Carried Armies
  ],
  // [Human, Azterk, Xillor, Hyp]
  groundAvgP: [300, 360, 240, 0, 300],
  armyCapacity: [
    0, // Factories
    1, // Destroyerss
    1, // Cruisers
    0, // Scouts
    3, // Bombers
    2000, // Starbases
    0, // Ground Armies
    0, // Carried Armies
  ],
  upkeepCosts: [
    // [Human, Azterk, Xillor]
    [1800, 1900, 2100], // Factories
    [2500, 2500, 2500], // Destroyers
    [18000, 18000, 18000], // Cruisers
    [375, 375, 375], // Scouts
    [6250, 6250, 6250], // Bombers
    [250000, 250000, 250000], // Starbases
    [5000, 5000, 5000], // Ground Armies
    [5000, 5000, 5000], // Carries Armies
  ],
  buildCosts: [
    // [Agro, Minero, Techno]
    [40000, 40000, 40000], // Factories
    [10000, 8500, 7500], // Destroyers
    [60000, 51000, 45000], // Cruisers
    [1500, 1275, 1125], // Scouts
    [25000, 21250, 18750], // Bombers
    [2000000, 1700000, 1500000], // Starbases
    [0, 0, 0], // Ground Armies
    [0, 0, 0], // Carried Armies
  ],
  timeToBuild: [
    // ticks with 1 factorie, no stasis
    // [Human, Azterk, Xillor]
    [11, 12, 13], // Factories
    [4, 8, 12], // Destroyers
    [25, 50, 85], // Cruiseres
    [1, 1, 2], // Scouts
    [5, 7, 10], // Bombers
    [0, 0, 0], // Starbases
    [0, 0, 0], // Ground Armies
    [0, 0, 0], // Carried Armies
  ],
  timeToBuildMultiplier: {
    // [Dict., Auth., Demo.]
    governments: [0.8, 1, 1],
    // [Agro, Minero, Techno
    products: [1, 1, 0.85],
    // [off, on]
    stasis: [1, 3],
  },

  getMapMonitoring: function (coords) {
    // console.log(planetId);
    var promise = $.Deferred(),
      H = this

    $.ajax({
      url: this.url('Maps?maptype=planets_trade'),
      cache: false,
      method: 'POST',
      data: {
        reqx: coords.x,
        reqy: coords.y,
        go: 'OK',
        distance: coords.d,
        clusterid: '1',
        planet: '',
      },
    }).done(function (data) {
      var planets = []
      var $content = $(data)
      var $table = $content.find('table.stdArray')
      var $rows = $table.find('tr').not('.stdArray')
      $rows.each((i, el) => {
        var _td = $(el).find('td')
        var planet = {}
        // console.log($(el));
        if ($(el).find('a').eq(1).attr('href') != undefined) {
          planet.id = parseInt(
            $(el)
              .find('a')
              .eq(1)
              .attr('href')
              .replace('Maps?planetnews=&planetid=', '')
          )
          planet.n = _td.eq(0).remove('a').text().replace('@ ', '').trim()
          var _coords = _td.eq(2).text().split(',')
          planet.x = parseInt(_coords[0].replace('(', ''))
          planet.y = parseInt(_coords[1].replace(')', ''))

          planet.g = _td.eq(4).text()
          planet.a = parseInt(_td.eq(8).text().replace(',', ''))
          planet.t = new Date().getTime()
          planets.push(planet)
        }
      })

      promise.resolveWith(H, [planets])
    })
    return promise
  },

  // helpers

  getPlanetInfo: function (args) {
    var promise = $.Deferred()
    var d = new Date()
    args = args || {}

    args.planet = args.planet || '*'
    args.data = args.data || 'general'
    args.request = 'getplanetinfo'
    args.failsafe = d.getMinutes()
    this.hapi(args).done((pairs) => {
      // console.log(pairs)
      var planets = []
      planets.ids = []

      $.each(pairs, function (key, value) {
        var i,
          keys = /^(.+?)_?(\d+)$/.exec(key)
        if (keys && keys.length) {
          key = keys[1]
          i = parseInt(keys[2])

          if (!planets[i]) {
            planets[i] = {}
          }

          switch (key) {
            case 'activity':
            case 'block':
            case 'civlevel':
            case 'defbonus':
            case 'ecomark':
            case 'expinpipe':
            case 'exploits':
            case 'factories':
            case 'gov':
            case 'govd':
            case 'nexus':
            case 'nrj':
            case 'nrjmax':
            case 'nxbuild':
            case 'nxbtot':
            case 'orbit':
            case 'planetid':
            case 'pop':
            case 'ptype':
            case 'purif':
            case 'race':
            case 'sc':
            case 'size':
            case 'tax':
            case 'x':
            case 'y':
            case 'doomed':
            case 'hgate':
            case 'hnet':
            case 'counterinfiltr':
              value = parseFloat(value)
              break
            case 'bhole':
              value = parseFloat(value)

              break
            case 'stasis':
            case 'parano':
              value = value == '1'
              break
            case 'planet':
            case 'publictag':
            case 'tag1':
            case 'tag2':
              break
            default:
              throw 'unkown key ' + key + ' (' + value + ')'
          }

          switch (key) {
            case 'bhole':
              key = 'bhole'
              break
            case 'civlevel':
              key = 'civ'
              break
            case 'ecomark':
              key = 'eco'
              break
            case 'expinpipe':
              key = 'numExploitsInPipe'
              break
            case 'exploits':
              key = 'numExploits'
              break
            case 'factories':
              key = 'numFactories'
              break
            case 'gov':
              key = 'governmentId'
              break
            case 'govd':
              key = 'governmentDaysLeft'
              break
            case 'planet':
              key = 'name'
              break
            case 'planetid':
              key = 'id'
              break
            case 'ptype':
              key = 'productId'
              break
            case 'publictag':
              key = 'tag'
              break
            case 'purif':
              key = 'purificationHoursLeft'
              break
            case 'race':
              key = 'raceId'
              break
            case 'counterinfiltr':
              key = 'counterInfiltration'
              break
          }

          planets[i][key] = value
          if (key == 'id') {
            planets.ids[value] = planets[i]
          }
        } else {
          planets[key] = value
        }
      })
      promise.resolveWith(this, [planets])
    })
    return promise
  },

  getForeignInfo: function (args) {
    var promise = $.Deferred()
    var d = new Date()
    args = args || {}
    args.planet = args.planet || '*'
    args.data = args.data || 'foreign_planets'
    args.request = 'getfleetsinfo'
    args.failsafe = d.getMinutes()
    this.hapi(args).done(function (pairs) {
      var planets = []
      planets.ids = []

      $.each(pairs, function (key, value) {
        var i,
          keys = /^(.+?)_?(\d+)$/.exec(key)
        if (keys && keys.length) {
          key = keys[1]
          i = parseInt(keys[2])

          if (!planets[i]) {
            planets[i] = {}
          }

          switch (key) {
            case 'activity':
            case 'block':
            case 'civlevel':
            case 'defbonus':
            case 'ecomark':
            case 'expinpipe':
            case 'exploits':
            case 'factories':
            case 'gov':
            case 'govd':
            case 'nexus':
            case 'nrj':
            case 'nrjmax':
            case 'nxbuild':
            case 'nxbtot':
            case 'orbit':
            case 'planetid':
            case 'pop':
            case 'ptype':
            case 'purif':
            case 'race':
            case 'sc':
            case 'size':
            case 'tax':
            case 'hgate':
            case 'hnet':
            case 'x':
            case 'y':
            case 'vacation':
            case 'isneutral':
            case 'fleetid0.':
            case 'sellprice0.':
            case 'counterinfiltr':
              value = parseFloat(value)
              break
            case 'bhole':
            case 'stasis':
            case 'parano':
              value = value == '1'
              break
            case 'planet':
            case 'publictag':
            case 'tag1':
            case 'tag2':
              break
            default:
            // throw 'unkown key ' + key + ' (' + value + ')';
          }

          switch (key) {
            case 'bhole':
              key = 'isBlackholed'
              break
            case 'civlevel':
              key = 'civ'
              break
            case 'ecomark':
              key = 'eco'
              break
            case 'expinpipe':
              key = 'numExploitsInPipe'
              break
            case 'exploits':
              key = 'numExploits'
              break
            case 'factories':
              key = 'numFactories'
              break
            case 'gov':
              key = 'governmentId'
              break
            case 'govd':
              key = 'governmentDaysLeft'
              break
            case 'planet':
              key = 'name'
              break
            case 'planetid':
              key = 'id'
              break
            case 'ptype':
              key = 'productId'
              break
            case 'publictag':
              key = 'tag'
              break
            case 'purif':
              key = 'purificationHoursLeft'
              break
            case 'race':
              key = 'raceId'
              break
            case 'counterinfiltr':
              key = 'counterInfiltration'
              break
          }

          planets[i][key] = value
          if (key == 'id') {
            planets.ids[value] = planets[i]
          }
        } else {
          planets[key] = value
        }
      })
      promise.resolveWith(this, [planets])
    })
    return promise
  },

  getMoves: function (args) {
    var promise = $.Deferred()
    var d = new Date()
    args = args || {}
    args.planet = args.planet || '*'
    args.data = args.data || ''
    args.request = 'getmovingfleets'
    args.failsafe = d.getMinutes()
    this.hapi(args).done(function (pairs) {
      var planets = []
      planets.ids = []
      $.each(pairs, function (key, value) {
        var i,
          keys = /^(.+?)_?(\d+)$/.exec(key)
        if (keys && keys.length) {
          key = keys[1]
          i = parseInt(keys[2])

          if (!planets[i]) {
            planets[i] = {}
          }

          switch (key) {
            case 'autodrop':
            case 'bombing':
            case 'camouf':
              break
            default:
            // throw 'unkown key ' + key + ' (' + value + ')';
          }

          planets[i][key] = value
          if (key == 'id') {
            planets.ids[value] = planets[i]
          }
        } else {
          planets[key] = value
        }
      })
      promise.resolveWith(this, [planets])
    })
    return promise
  },

  getContacts: function () {
    var promise = $.Deferred(),
      H = this
    $.ajax(this.url('Player?page=Contacts'))
      .done(function (data, textStatus, jqXHR) {
        var players = []
        players.toNames = {}

        $('table.stdArray > tbody', data)
          .eq(0)
          .children('tr:not(#stdArray)')
          .each(function (_, element) {
            var tr = $(element),
              tds = $(element).children('td'),
              type = 'neutral'

            $.each(['buddy', 'friendly', 'hostile'], function (_, className) {
              if (tr.hasClass(className)) {
                type = className
              }
            })

            var player = {
              //id: parseInt(tds.eq(0).find('a').eq(0).attr('href').replace(/[^\d]+/g, '')),
              name: $.trim(tds.eq(0).find('a').eq(1).text()),
              type: type,
            }
            players.push(player)
            players.toNames[player.name] = player
          })

        promise.resolveWith(H, [
          players.sort(function (a, b) {
            return a.name.localeCompare(b.name)
          }),
        ])
      })
      .fail(function () {
        promise.rejectWith(H)
      })
    return promise
  },

  getBattleReports: function () {
    var promise = $.Deferred(),
      hyp = this
    $.ajax(this.url('Player?page=Reports')).done(function (
      data,
      textStatus,
      jqXHR
    ) {
      var reports = []
      $('input[type=checkbox]', data).each(function (i, element) {
        var matches
        element = $(element)
        if (/^r\d+$/.test(element.attr('name'))) {
          matches = /^(\d\d\d\d\-\d\d-\d\d \d\d:\d\d:\d\d)Planet (.+)$/.exec(
            element.closest('td').next().text()
          )
          reports.push({
            id: parseInt(element.val()),
            date: new Date(matches[1] + ' +00:00'),
            planetName: matches[2],
          })
        }
      })
      promise.resolveWith(hyp, [reports])
    })
    return promise
  },

  searchPlanets: function (pattern) {
    var promise = $.Deferred(),
      H = this
    console.log(pattern)
    $.ajax({
      url: this.url('Maps'),
      method: 'POST',
      data: {
        searchplanets: pattern,
        clusterid: 1,
        planet: 1371,
        distance: 1,
        search: 'Search',
        maptype: 'planets_trade',
      },
    })
      .done(function (data, textStatus, jqXHR) {
        promise.resolveWith(H, [H.getPlanetsFromTradingMap(data)])
      })
      .fail(function () {
        promise.rejectWith(H)
      })

    return promise
  },

  getPlanetsFromTradingMap: function (html) {
    var planets = [],
      H = this
    // **** ??? **** //
    $('table.stdArray tr:not(.stdArray)', html).each(function (_, element) {
      planets.push(H.getPlanetFromTradingMapRow($(element)))
    })
    return planets.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })
  },

  getPlanetFromTradingMapRow: function (tr) {
    var tds = tr.find('td'),
      msgUrl = tds.eq(0).find('a[href^="Maps"]').attr('href'),
      planet = {
        id: msgUrl ? parseFloat(msgUrl.replace(/[^\d]+/g, '')) : undefined,
        name: $.trim(tds.eq(0).text().replace(/^@/, '')),
        isOwn: tds.eq(0).find('.grayed b, .std b').length == 1,
        tag: tds.eq(1).text(),
        civ: parseInt(tds.eq(3).text()) || 0,
        govName: tds.eq(4).text(),
        raceName: tds.eq(5).text(),
        distance: tds.eq(6).text(),
        productName: tds.eq(7).text(),
        activity: parseInt(tds.eq(8).text().replace(',', '')) || 0,
        freeCapacity: parseInt(tds.eq(9).text().replace(',', '')) || 0,
        isBlackholed: tr.hasClass('alertLight'),
        isDoomed: tr.find('img[src$="death1.gif"]').length == 1,
        daysBeforeAnnihilation: 0,
      }

    if (planet.isDoomed) {
      planet.daysBeforeAnnihilation = parseFloat(
        tr
          .find('img[src$="death1.gif"]')
          .attr('onmouseover')
          .replace(/[^\d]+/g, '')
      )
    }

    if (planet.raceName == '') {
      planet.raceName = tds
        .eq(5)
        .find('img')
        .attr('src')
        .replace(/^.*_(.*)\.gif$/, '$1')
    }

    var coords = /^(SC\d+)?\((-?\d+),(-?\d+)\)$/i.exec(tds.eq(2).text())
    if (coords.length) {
      planet.x = parseInt(coords[2])
      planet.y = parseInt(coords[3])
    }
    return planet
  },

  getMovingFleets: function () {
    var promise = $.Deferred(),
      H = this

    $.ajax(this.url('Fleets?pagetype=moving_fleets')).done(function (data) {
      H.getMovingFleetsFromHtml(data).done(function (fleets) {
        promise.resolveWith(H, [fleets])
      })
    })
    return promise
  },

  getMovingFleetsFromHtml: function (parseHtml) {
    var fleets = [],
      planetNames = [],
      promise = $.Deferred(),
      H = this
    fleets.toNames = {}
    fleets.fromNames = {}

    $(parseHtml)
      .find('.visib_content')
      .each(function (_, element) {
        element = $(element)

        var bold = element.find('b')
        var splits = element.text().split(' to ')
        var fromStart = splits[0].search(/([(])/g)
        var fromEnd = splits[0].search(/([)])/g)
        var fromStr = splits[0].substr(fromStart, fromEnd)
        var fromSplit = fromStr.split(',')
        var fromStartX = parseInt(fromSplit[0].replace('(', ''))
        var fromStartY = parseInt(fromSplit[1].replace(')', ''))

        var toStart = splits[1].search(/([(])/g)
        var toEnd = splits[1].search(/([)])/g)
        var toStr = splits[1].substr(toStart, toEnd - toStart)
        var toSplit = toStr.split(',')

        var toStartX = parseInt(toSplit[0].replace('(', ''))
        var toStartY = parseInt(toSplit[1].replace(')', ''))

        var fleet = {
          eta: parseFloat(bold.eq(-1).text()),
          delay:
            parseInt(element.find('.info b').text().replace(/ .+$/, '')) || 0,
          numDestroyers: 0,
          numCruisers: 0,
          numScouts: 0,
          numBombers: 0,
          numStarbases: 0,
          numCarriedArmies: 0,
          raceId: H.races.indexOf(
            element
              .find('img')
              .eq(0)
              .attr('src')
              .replace(/.*_([a-z]+?)\.gif$/i, '$1')
          ),
          from: {
            name: bold.eq(1).text(),
            x: fromStartX,
            y: fromStartY,
          },
          to: {
            name: bold
              .eq(2)
              .text()
              .replace(/ \[.+\]$/, ''),
            x: toStartX,
            y: toStartY,
          },
          id: parseFloat(element.find('input[type="checkbox"]').val()),
        }

        if (fleet.from.name.indexOf(' ') > -1) {
          // no valid from name
          fleet.from = fleet.to
        }

        element.find('[src$="_icon.gif"]').each(function (_, element) {
          var key = $(element)
            .attr('src')
            .replace(/.*\/([a-z]+?)_icon\.gif$/i, '$1')

          if (key != '/themes/theme4/misc/techlevel_small_icon.gif') {
            switch (key) {
              case 'destroyer':
                key = 'numDestroyers'
                break
              case 'cruiser':
                key = 'numCruisers'
                break
              case 'scout':
                key = 'numScouts'
                break
              case 'bomber':
                key = 'numBombers'
                break
              case 'starbase':
                key = 'numStarbases'
                break
              case 'fleetarmy':
                key = 'numCarriedArmies'
                break
            }

            if (key) {
              fleet[key] = parseFloat(
                element.previousSibling.nodeValue.replace(/[^\d]+/g, '')
              )
            }

            if (key == 'numCarriedArmies') {
              fleet.autodrop = element.nextSibling.nodeValue == ' (auto drop)'
            }
          }
        })

        fleets.push(fleet)

        if (!fleets.toNames[fleet.to.name]) {
          fleets.toNames[fleet.to.name] = []
        }
        fleets.toNames[fleet.to.name].push(fleet)
        if (!fleets.fromNames[fleet.from.name]) {
          fleets.fromNames[fleet.from.name] = []
        }
        fleets.fromNames[fleet.from.name].push(fleet)
        planetNames.push(fleet.to.name)
        planetNames.push(fleet.from.name)
      })

    this.searchPlanets($.unique(planetNames).join(', ')).done(function (
      planets
    ) {
      $.each(planets, function (i, planet) {
        $.each(fleets.toNames[planet.name] || [], function (i, fleet) {
          fleet.to = planet
        })
        $.each(fleets.fromNames[planet.name] || [], function (i, fleet) {
          fleet.from = planet
        })
      })

      promise.resolveWith(H, [fleets])
    })

    return promise
  },

  getChangeFleet: function (floatId) {
    var promise = $.Deferred(),
      H = this
    $.ajax(this.url('Fleets?changefleet=&floatid=' + floatId)).done(function (
      data
    ) {
      if (
        $(data).find('select[name=camouflage]').find('option').eq(0).val() ===
        undefined
      ) {
        camo = 'off'
      } else {
        camo =
          $(data).find('select[name=camouflage]').find('option').eq(0).val() ==
          0
            ? 'off'
            : 'on'
      }

      promise.resolveWith(H, [camo])
    })
    return promise
  },

  controlPlanetCard: function (element) {
    H = this
    var gov, prod
    if (element.find('.prod1').length > 0) {
      prod = 'Techno'
    } else if (element.find('.prod2').length > 0) {
      prod = 'Minero'
    } else {
      prod = 'Agro'
    }

    switch (element.find('.bold').eq(0).text()[1]) {
      case 'i':
        gov = 'Dictatorial'
        break
      case 'e':
        gov = 'Democratic'
        break
      case 'u':
        gov = 'Authoritarian'
        break
      case 'y':
        gov = 'Hyp.protect.'
        break
    }
    var planet = {
      gov: H.governments.indexOf(gov),
      id: parseFloat(element.attr('id').replace('pc', '')),
      name: element.find('.planet').text(),
      race: H.races.indexOf(element.find('.bold').eq(1).text()),
      prod: H.products.indexOf(prod),
    }

    return planet
  },

  getPlanetIdInfluence: function (planetId) {
    var promise = $.Deferred(),
      H = this
    $.ajax({
      url: this.url('Planet'),
      data: {
        cancelabandon: '',
        planetid: planetId,
      },
    }).done(function (data, textStatus, jqXHR) {
      promise.resolveWith(H, [
        parseFloat(
          $('.planetName', $(data)).siblings('b').text().replace(/,/g, '')
        ),
      ])
    })
    return promise
  },

  /* show if BH is ready --- need imporvments */

  showMilitaryInfo: function (planetId) {
    // console.log(planetId);
    var promise = $.Deferred(),
      H = this
    $.ajax({
      url: this.url('Planetfloats'),
      cache: false,
      data: {
        cancelabandon: '',
        planetid: planetId,
      },
    }).done(function (data) {
      $content = $(data)
      var bhinfo = $content.find('#bhPanel').find('.info').find('b')

      var infos = {
        bh: false,
      }
      if (bhinfo.length > 0) {
        infos.bh = bhinfo.text()
      }
      if ($("input[name='bhcancel']").length > 0) {
        infos.bh = 'ready'
      }

      promise.resolveWith(H, [infos])
    })
    return promise
  },

  getControlledPlanets: function () {
    var promise = $.Deferred(),
      H = this
    $.get(this.url('Home')).done((__data) => {
      var planets = []
      planets.numPlanets = 0
      // console.log(__data);
      $('.planetCard3', __data).each(function (_, element) {
        var planet_id = parseInt($(this).attr('id').replace('pc', ''), 10)
        planets[planet_id] = H.controlPlanetCard($(element))
        planets.numPlanets++
      })

      promise.resolveWith(H, [planets])
    })
    return promise
  },

  convertUnitToNumber(unit) {
    switch (unit) {
      case 'K':
        return 1e3
      case 'M':
        return 1e6
      case 'B':
        return 1e9
      default:
        return 1
    }
  },

  convertAndSum(value1) {
    if (!value1) return 0
    // Extrait le nombre et l'unité de la première valeur
    const matches = value1.match(/([\d.]+)([KMB])?/)
    if (!matches) return value1

    const baseNumber = parseFloat(matches[1])
    const unit = matches[2] || ''
    const unitMultiplier = Hyp.convertUnitToNumber(unit)

    return Math.round(baseNumber * unitMultiplier)
  },

  getForeignPlanets: function () {
    var promise = $.Deferred(),
      H = this

    H.request(H.url('Fleets?pagetype=foreign_fleets'), {}, 'GET').done(
      function (data) {
        var planets = []
        $('.planetCard3', data).each(function (_, element) {
          // Sélectionne tous les éléments td
          const tdElements = element.querySelectorAll('td')

          let spaceAvgp = 0
          tdElements.forEach((td, index) => {
            if (td.textContent.trim() === 'Space AvgP:') {
              $parent = $(td).parent()
              const spaceAvgPValue = $parent.find('.vb').text()

              spaceAvgp =
                Hyp.convertAndSum(spaceAvgPValue.split(' + ')[0]) +
                Hyp.convertAndSum(spaceAvgPValue.split(' + ')[1])
              spaceAvgp = numeral(spaceAvgp).format('0[.]0a')
            }
          })

          var row = {
            name: $(element).find('.planet').text(),
            stasis: $(element).find('.flagStasis').length > 0,
            neutral: element.innerHTML.includes('[Neutral]'),
            attacking: element.innerHTML.includes('Attacking'),
            spaceAvgp: spaceAvgp,
          }

          planets.push(row)
        })
        promise.resolveWith(H, [planets])
      }
    )

    return promise
  },

  getAlliancePlanets: function (planetId, tagId) {
    var promise = $.Deferred(),
      H = this

    H.request(
      H.url('Alliance?planetid=' + planetId + '&tagid=' + tagId),
      {},
      'GET'
    ).done(function (data) {
      var table = $(data).find('.alternArray')
      var list = []

      table.find('tr').each(function (i, el) {
        if (i > 0) {
          var item = {}
          var player = $(el).find('td').eq(0).find('b').text()
          var raw_planets = $(el).find('td').eq(1).text().split(' ')

          _.each(raw_planets, function (el, i) {
            if (el.trim() != '') {
              list.push(el)
            }
          })
        }
      })

      promise.resolveWith(H, [list])
    })

    return promise
  },

  getTradingOverview: function () {
    var promise = $.Deferred(),
      H = this

    H.request(this.url('Trading'), {}, 'GET').done((_d) => {
      var planets = []
      $('.planetCard3', _d).each(function (_, element) {
        element = $(element)
        var wtr = 0
        if (
          element.find('.hl').find('.hl').find('.vc').find('b').text() != ''
        ) {
          wtr = parseInt(
            element.find('.hl').find('.vc').find('b').text().replace('%', '')
          )
        } else {
          wtr = parseInt(
            element
              .find('.hl')
              .find('.content')
              .find('b')
              .text()
              .replace('%', '')
          )
        }
        var planet = {
          id: parseInt(element.attr('id').replace('trd', '')),
          name: element.find('.planetName').text(),
          wtr: wtr,
        }
        planets.push(planet)
      })

      promise.resolveWith(H, [planets])
    })

    return promise
  },

  avoidBH: function (planetId) {
    var promise = $.Deferred(),
      H = this

    $.ajax({
      url: H.url('Floatorders'),
      method: 'POST',
      data: {
        cancelbhinit: 'Cancel preparation',
        planetid: planetId,
      },
    }).done(() => {
      promise.resolveWith(H)
    })

    return promise
  },

  prepBH: function (planetId) {
    var promise = $.Deferred(),
      H = this

    $.ajax({
      url: H.url('Floatorders'),
      method: 'POST',
      data: {
        initblackhole: 'Prepare',
        def: 0,
        planetid: planetId,
      },
    }).done(() => {
      promise.resolveWith(H)
    })

    return promise
  },

  storeData: function (_data) {
    var promise = $.Deferred(),
      H = this
    chrome.storage.sync.set({
      data: _data,
    })
    Cookies.set('timestampInflu', new Date().getTime())

    promise.resolveWith(H)
    return promise
  },

  storeDataForeign: function (_data) {
    var promise = $.Deferred(),
      H = this

    console.log(_data, _data.length)
    chrome.storage.sync.set({
      data_foreigns: _data,
    })
    Cookies.set('timestampForeign', new Date().getTime())

    promise.resolveWith(H)
    return promise
  },

  storeDataCamo: function (_data) {
    var promise = $.Deferred(),
      H = this
    chrome.storage.sync.set({
      camo: _data,
    })
    Cookies.set('timestampCamo', new Date().getTime())

    promise.resolveWith(H)
    return promise
  },

  request: function (url, settings, method) {
    settings = settings || url

    if (typeof settings === 'string') {
      settings = {
        url: settings,
      }
    } else {
      settings.url = settings.url || url
    }

    settings.data = settings.data || ''
    if (typeof settings.data !== 'string') {
      settings.data = $.param(settings.data, settings.traditional || false)
    }

    url = settings.url
    if (settings.data.length) {
      url += '?' + settings.data
      settings.data = ''
    }

    var promise = $.Deferred(),
      H = this

    $.ajax(url).done(function (data) {
      promise.resolveWith(H, [data])
    })
    return promise
  },
  getFleetsInfo: function (args) {
    var promise = $.Deferred()
    args = args || {}
    args.planet = args.planet || '*'
    args.data = args.data || 'own_planets'
    args.request = 'getfleetsinfo'
    this.hapi(args).done(function (pairs) {
      var planets = []
      planets.toNames = {}
      $.each(pairs, function (key, value) {
        var i,
          j,
          keys = /^([^\.]+?)(\d+)(\.(\d+))?$/.exec(key)
        if (keys && keys.length) {
          key = keys[1]
          i = parseInt(keys[2]) // planet index
          j = parseInt(keys[4]) // fleet index

          if (!planets[i]) {
            planets[i] = { fleets: [] }
          }

          switch (key) {
            case 'nrj':
            case 'nrjmax':
            case 'bomb':
            case 'carmies':
            case 'crui':
            case 'delay':
            case 'dest':
            case 'fleetid':
            case 'frace':
            case 'garmies':
            case 'scou':
            case 'sellprice':
            case 'starb':
              value = parseFloat(value)
              break
            case 'isneutral':
            case 'stasis':
            case 'vacation':
            case 'autodrop':
            case 'bombing':
            case 'camouf':
            case 'defend':
              value = value == '1'
              break
            case 'planet':
            case 'fname':
            case 'owner':
              break
            default:
              throw 'unkown key ' + key + ' (' + value + ')'
          }

          switch (key) {
            case 'planet':
              key = 'name'
              break
            case 'isneutral':
              key = 'neutral'
              break
            case 'bomb':
              key = 'numBombers'
              break
            case 'crui':
              key = 'numCruisers'
              break
            case 'dest':
              key = 'numDestroyers'
              break
            case 'scou':
              key = 'numScouts'
              break
            case 'starb':
              key = 'numStarbases'
              break
            case 'camouf':
              key = 'camouflage'
              break
            case 'carmies':
              key = 'numCarriedArmies'
              break
            case 'fleetid':
              key = 'id'
              break
            case 'fname':
              key = 'name'
              break
            case 'frace':
              key = 'raceId'
              break
            case 'garmies':
              key = 'numGroundArmies'
              break
          }

          if (isNaN(j)) {
            planets[i][key] = value
            if (key == 'name') {
              planets.toNames[value] = planets[i]
            }
          } else {
            if (!planets[i].fleets[j]) {
              planets[i].fleets[j] = { isForeign: true }
            }
            planets[i].fleets[j][key] = value
            if (key == 'name') {
              planets[i].fleets[j].isForeign = false
            }
          }
        } else {
          planets[key] = value
        }
      })
      promise.resolveWith(this, [planets])
    })
    return promise
  },
  getTimeToBuildMultiplier: function (planet) {
    return (
      this.timeToBuildMultiplier.governments[planet.governmentId] *
      this.timeToBuildMultiplier.products[planet.productId] *
      this.timeToBuildMultiplier.stasis[planet.stasis ? 1 : 0]
    )
  },
  getBuildPipeTotals: function (pipe, planet, numDaysOfWar) {
    var totals = {
        timeToBuild: 0,
        upkeepCosts: 0,
        buildCosts: 0,
        spaceAvgP: 0,
        groundAvgP: 0,
        spaceUpkeepCosts: 0,
        spaceBuildCosts: 0,
        groundUpkeepCosts: 0,
      },
      multiplier = this.getTimeToBuildMultiplier(planet),
      numFactories = planet.numFactories,
      raceId = planet.raceId,
      productId = planet.productId,
      factoryUnitId = this.units.indexOf('Factories'),
      hyperiums = this

    $.each(pipe, function (_, order) {
      if (order.unitId == factoryUnitId) {
        totals.timeToBuild +=
          Math.log((order.count + numFactories) / numFactories) /
          Math.log(
            1 + 1 / hyperiums.timeToBuild[order.unitId][raceId] / multiplier
          )
        numFactories += order.count
      } else {
        totals.timeToBuild +=
          ((order.count * multiplier) / numFactories) *
          hyperiums.timeToBuild[order.unitId][raceId]
      }

      var upkeepCosts =
        order.count * hyperiums.upkeepCosts[order.unitId][raceId]
      var buildCosts =
        order.count * hyperiums.buildCosts[order.unitId][productId]

      totals.upkeepCosts += upkeepCosts
      totals.buildCosts += buildCosts
      if (order.unitId != factoryUnitId) {
        if (hyperiums.spaceAvgP[order.unitId][raceId] == 0) {
          totals.groundAvgP += order.count * hyperiums.groundAvgP[raceId]
          totals.groundUpkeepCosts += upkeepCosts
        } else {
          totals.spaceAvgP +=
            order.count * hyperiums.spaceAvgP[order.unitId][raceId]
          totals.spaceUpkeepCosts += upkeepCosts
          totals.spaceBuildCosts += buildCosts
        }
      }
    })

    totals.fleetLevel = Math.floor(
      Math.sqrt(
        (0.03 *
          (numDaysOfWar * totals.spaceUpkeepCosts + totals.spaceBuildCosts)) /
          10000000
      )
    )
    totals.gaLevel = Math.max(
      3,
      Math.floor(
        (Math.sqrt(
          (0.12 * numDaysOfWar * totals.groundUpkeepCosts) / 10000000 + 9
        ) +
          3) /
          2
      )
    )

    return totals
  },
  async scrapeData(url) {
    try {
      // Faire une requête HTTP pour obtenir le contenu de la page
      const response = await axios.get(url)
      const data = response.data
      const $html = $(data)

      return $html
    } catch (error) {
      console.error('Erreur lors du scraping :', error)
      return null
    }
  },
  async mergeAll(planetId) {
    const result = await $.post('/servlet/Floatorders', {
      merge: 'OK',
      confirm: '',
      nbarmies: 10,
      mgt_order_done: '',
      planetid: planetId,
    })
    return result
  },
  hapi: function (args) {
    var promise = $.Deferred(),
      H = this

    H.getSession().done(function (session) {
      args.gameid = args.gameid || session.gameId
      args.playerid = args.playerid || session.playerId
      args.authkey = args.authkey || session.authKey

      H.request({
        url: this.url('HAPI'),
        data: args,
      }).done(function (data, textStatus, jqXHR) {
        var pairs = {}
        // console.log(data)
        $.each(data.split('&'), function (_, pair) {
          var split = pair.split('=')
          pairs[split[0]] = split[1]
        })
        promise.resolveWith(this, [pairs])
      })
    })
    return promise
  },
}
