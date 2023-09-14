const loadScript = (FILE_URL, async = true, type = 'text/javascript') => {
  return new Promise((resolve, reject) => {
    try {
      const scriptEle = document.createElement('script')
      scriptEle.type = type
      scriptEle.async = async
      scriptEle.src = FILE_URL

      scriptEle.addEventListener('load', (ev) => {
        resolve({ status: true })
      })

      scriptEle.addEventListener('error', (ev) => {
        reject({
          status: false,
          message: `Failed to load the script ＄{FILE_URL}`,
        })
      })

      document.body.appendChild(scriptEle)
    } catch (error) {
      reject(error)
    }
  })
}

async function supaInit() {
  await new Promise((r) => setTimeout(r, 100))
  // await loadScript("https://unpkg.com/@supabase/supabase-js");

  const { createClient } = supabase
  const _supabase = createClient(
    'https://ubljniwkqbaaxcotwjio.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibGpuaXdrcWJhYXhjb3R3amlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAwNjcwNTMsImV4cCI6MTk4NTY0MzA1M30.u9fSeviF4RQ22AuY63VufQtXQl3ecKAOQzwHBZkRiis'
  )

  const getFleet = async () => {
    const currentPlanets = await setDBData_currentPlanets()
    document.querySelectorAll('.planetCard3').forEach(async (planet) => {
      /* Dirty scraping */
      const planetName = planet.querySelector('.planet').innerText
      const planetId = planet
        .querySelector('.planet')
        .href.split('planetid=')[1]
      const hasStasis = planet.querySelector('.flagStasis') ? true : false
      let mode = planet.querySelector('.flagDefend') ? 'defend' : 'no battle'
      mode = planet.querySelector('.flagAttack') ? 'attack' : mode
      const bars = Array.from(planet.querySelectorAll('.bars'))
      console.log(bars.length)
      let nmyBar = false
      let allyBar = false
      bars.forEach(bar=>{
        console.log(bar)
        if(bar.innerText.includes('Space AvgP:')) {
          allyBar = bar.textContent
      }
        if(bar.innerText.includes('Enemy space AvgP:')) {
            nmyBar = bar
        }
      })

      const enemyFleet = nmyBar ? nmyBar.replace('Enemy space AvgP:', '').trim() : ''
      const allyFleet = allyBar ? allyBar.replace('Space AvgP:', '').trim() : ''

      // values to supabase
      const values = {
        planetId,
        planetName,
        hasStasis,
        allyFleet,
        enemyFleet,
        mode,
        updated_at: new Date(),
      }

      isOwner = currentPlanets.data.find(
        (p) => parseInt(p.id) === parseInt(planetId)
      )
        ? $('#htopmenu > li:nth-child(5) > a > div > b').text().trim()
        : false

      if (isOwner) {
        values.owner = isOwner
      }

      const isAlreadyInserted = await _supabase
        .from('planets')
        .select('*')
        .eq('planetId', planetId)

        if (isAlreadyInserted.data.length === 0) {
        const { error } = await _supabase.from('planets').insert(values)
      } else {
        const { error } = await _supabase
          .from('planets')
          .update(values)
          .eq('planetId', planetId)
      }
    })
  }
  const gameId = await localforage.getItem('currentGameId')
  if (gameId === 1) getFleet()
}

supaInit()
