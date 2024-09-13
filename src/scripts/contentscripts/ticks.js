const displayTicks = async function () {
  try {
    const gameId = await localforage.getItem('currentGameId');
    const log = await Hyp.getSession();

    const serverTimeElement = document.querySelector('.servertime');
    const serverTimeText = serverTimeElement.textContent.replace('Server Time: ', '') + ' +00:00';
    const offsetInMS = new Date().getTime() - new Date(serverTimeText).getTime();

    const div = document.createElement('div');
    div.id = 'Hyp-ticks';
    div.classList.add('servertime-bar');
    document.body.appendChild(div);

    let msPerPx = 10000;
    const timeline = document.createElement('div');
    timeline.classList.add('timeline');
    
    timeline.addEventListener('click', (event) => {
      msPerPx = event.altKey ? msPerPx * 1.5 : msPerPx / 1.5;
    });
    
    div.appendChild(timeline);

    const ticksMap = new Map([
      [0, Hyp.ticksR13],
      [1, Hyp.ticksWinterGal],
      [2, Hyp.ticksR11],
      [3, Hyp.ticksR12],
      [4, Hyp.ticksR10],
      ['default', Hyp.ticksR11]
    ]);

    const ticks = ticksMap.get(gameId) || ticksMap.get('default');
    const msPerH = 3600000;
    let ul;

    const updateTimeline = () => {
      const serverDate = new Date(Date.now() - offsetInMS);
      timeline.innerHTML = ''; // Efface les éléments précédents
      
      if (ul) ul.remove();
      ul = document.createElement('ul');
      ul.innerHTML = `<li>ST: ${moment(serverDate).utc().format('YYYY-MM-DD HH:mm:ss')}</li>`;

      const timelineWidth = timeline.offsetWidth;

      ticks.forEach((tick, tickIndex) => {
        let nextDate = tick.getNextDate(serverDate);
        const msUntilNextDate = nextDate.getTime() - serverDate.getTime();
        const formattedNextDate = moment(nextDate).utc();

        const liTick = document.createElement('li');
        liTick.textContent = `${tick.name}: ${moment(msUntilNextDate).utc().format('HH:mm:ss')}`;
        liTick.setAttribute('title', formattedNextDate.format('YYYY-MM-DD HH:mm:ss'));

        // Gestion des classes
        const classes = {
          10000: 'Hyp-blink',
          60000: 'alert',
          300000: 'alertLight',
          600000: 'hlight',
        };

        for (const [threshold, className] of Object.entries(classes)) {
          if (msUntilNextDate < threshold) {
            liTick.classList.add(className);
            break;
          }
        }

        ul.appendChild(liTick);

        let left = msUntilNextDate / msPerPx;
        while (left < timelineWidth) {
          const tickDiv = document.createElement('div');
          tickDiv.classList.add('tick', 'hlight');
          tickDiv.style.left = `${left}px`;
          tickDiv.style.paddingTop = `${tickIndex / 2}em`;
          tickDiv.setAttribute('title', `${tick.name}\n${formattedNextDate.format('HH:mm:ss')}`);
          tickDiv.textContent = tick.name;
          timeline.appendChild(tickDiv);

          nextDate.add(tick.everyNthHour, 'hour');
          left += (tick.everyNthHour * msPerH) / msPerPx;
        }
      });

      div.insertBefore(ul, timeline);
    };

    const loop = () => {
      updateTimeline();
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop); // Démarrer la boucle avec requestAnimationFrame

  } catch (error) {
    console.error('An error occurred while displaying ticks:', error);
  }
};

displayTicks();