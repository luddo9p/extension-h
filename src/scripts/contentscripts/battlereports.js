function BattleReport() {
  const ownRows = document.querySelectorAll('.br_own');
  
  ownRows.forEach((ownRow) => {
    const table = ownRow.closest('table');
    const spaceAvgP = {};
    const groundAvgP = {};
    const avgRaceId = Hyp.races.length + 1;

    const rows = table.querySelectorAll('tr.line0, tr.line1');
    let lastTr;

    rows.forEach((tr) => {
      const tds = tr.querySelectorAll('td');
      
      // Assurer qu'il y a au moins 7 colonnes
      if (tds.length < 7) {
        console.warn('Pas assez de colonnes dans ce tableau:', tds);
        return; // Ignorer la ligne si elle ne contient pas assez de colonnes
      }

      const unitName = tds[0].textContent.trim();
      const unitId = Hyp.units.indexOf(unitName);

      // Vérification si l'unité existe
      if (unitId === -1) {
        console.error('Unité non trouvée:', unitName);
        return; // Ignorer cette ligne si l'unité n'est pas trouvée
      }

      const numbers = {
        own: {
          initial: numeral().unformat(tds[1].textContent.toLowerCase()) || 0,
          lost: numeral().unformat(tds[2].textContent.toLowerCase()) || 0,
        },
        defending: {
          initial: numeral().unformat(tds[3].textContent.toLowerCase()) || 0,
          lost: numeral().unformat(tds[4].textContent.toLowerCase()) || 0,
        },
        attacking: {
          initial: numeral().unformat(tds[5].textContent.toLowerCase()) || 0,
          lost: numeral().unformat(tds[6].textContent.toLowerCase()) || 0,
        },
      };

      Object.keys(numbers).forEach((side) => {
        // Initialiser les objets si non définis
        spaceAvgP[side] = spaceAvgP[side] || { initial: 0, lost: 0 };
        groundAvgP[side] = groundAvgP[side] || { initial: 0, lost: 0 };

        if (Hyp.spaceAvgP[unitId] && Hyp.spaceAvgP[unitId][avgRaceId] !== undefined) {
          spaceAvgP[side].initial += numbers[side].initial * Hyp.spaceAvgP[unitId][avgRaceId];
          spaceAvgP[side].lost += numbers[side].lost * Hyp.spaceAvgP[unitId][avgRaceId];
        } else if (Hyp.groundAvgP && Hyp.groundAvgP[avgRaceId]) {
          groundAvgP[side].initial += numbers[side].initial * Hyp.groundAvgP[avgRaceId];
          groundAvgP[side].lost += numbers[side].lost * Hyp.groundAvgP[avgRaceId];
        } else {
          console.warn(`Aucun coefficient trouvé pour unitId: ${unitId}, avgRaceId: ${avgRaceId}`);
        }
      });

      lastTr = tr; // Stocker la dernière ligne
    });

    let i = lastTr.classList.contains('line1') ? 1 : 0;

    const spaceAvgPRow = document.createElement('tr');
    spaceAvgPRow.className = `stdArray line${(++i % 2)}`;
    spaceAvgPRow.innerHTML = `
      <td class="tinytext">Space AvgP ~</td>
      <td class="hr tinytext br_colStart">${numeral(spaceAvgP.own.initial).format('0[.]0a')}</td>
      <td class="hr tinytext">${numeral(spaceAvgP.own.lost).format('0[.]0a')}</td>
      <td class="hr tinytext br_colStart">${numeral(spaceAvgP.defending.initial).format('0[.]0a')}</td>
      <td class="hr tinytext">${numeral(spaceAvgP.defending.lost).format('0[.]0a')}</td>
      <td class="hr tinytext br_colStart">${numeral(spaceAvgP.attacking.initial).format('0[.]0a')}</td>
      <td class="hr tinytext br_lastCol">${numeral(spaceAvgP.attacking.lost).format('0[.]0a')}</td>
    `;

    const groundAvgPRow = document.createElement('tr');
    groundAvgPRow.className = `stdArray line${(++i % 2)}`;
    groundAvgPRow.innerHTML = `
      <td class="tinytext">Ground AvgP ~</td>
      <td class="hr tinytext br_colStart">${numeral(groundAvgP.own.initial).format('0[.]0a')}</td>
      <td class="hr tinytext">${numeral(groundAvgP.own.lost).format('0[.]0a')}</td>
      <td class="hr tinytext br_colStart">${numeral(groundAvgP.defending.initial).format('0[.]0a')}</td>
      <td class="hr tinytext">${numeral(groundAvgP.defending.lost).format('0[.]0a')}</td>
      <td class="hr tinytext br_colStart">${numeral(groundAvgP.attacking.initial).format('0[.]0a')}</td>
      <td class="hr tinytext br_lastCol">${numeral(groundAvgP.attacking.lost).format('0[.]0a')}</td>
    `;

    lastTr.after(spaceAvgPRow, groundAvgPRow);
  });
}

window.setTimeout(BattleReport, 10);
