// Hyp.getContacts().done(function (contacts) {
//   var walker = document.createTreeWalker(
// 		document.body,
// 		NodeFilter.SHOW_TEXT,
// 		null,
// 		false
// 	)

//   var replacements = [], removals = []

//   function addReplacement (original, substitute) {
//     replacements.push({
//       substitute: substitute,
//       original: original
//     })
//   }

//   function addRemoval (node) {
//     removals.push(node)
//     if (node.nextSibling && node.nextSibling.nodeName == 'BR') {
//       removals.push(node.nextSibling)
//     }
//   }

//   var reAbsNumber = /^\d+([\.,]\d+)? *([tbmk])?$/i,
//     reDate = /^\d\d\d\d\-\d\d\-\d\d( \d\d:\d\d)?(:\d\d)?$/,
//     reOtherNumber = /\d+.*$/,
//     reUrl = /\bhttps?:\/\/\S+[a-z0-9_\?\-#&=%]/ig
//   reEmail = /[a-z0-9\._%+\-]+@[a-z0-9\.\-]+\.[a-z]{2,6}/ig,
// 		reColumns = /^([^\|]+ ?\| ?)+([^\|]+)$/i,
// 		reHr = /^(\-\-+)|(==+)$/
//   rePlayer = / player /g,
// 		reComposition = /Composition:( Destroyers:(\d+))?( Cruisers:(\d+))?( Scouts:(\d+))?( Bombers:(\d+))?( Starbases:(\d+))? $/g,
// 		invalidParents = ['TEXTAREA', 'SCRIPT'],
// 		invalidTableParents = ['PRE', 'B']

//   function textToValue (text) {
//     text = $.trim(text)
//     if (reAbsNumber.test(text)) {
//       return numeral().unformat(text.replace(',', '.').toLocaleLowerCase())
//     } else if (reDate.test(text)) {
//       if (text.length < 11) {
//         text += ' 00:00:00'
//       }
//       return new Date(text + ' +00:00')
//     } else if (reOtherNumber.test(text)) {
//       return 0
//     }
//     return text
//   }

//   function addNodes (nodes, re, callback) {
//     var createdNodes = []
//     $.each(nodes, function (i, node) {
//       var matches, index = 0, string = node.nodeValue
//       createdNodes[i] = []
//       while (matches = re.exec(string)) {
//         index = callback(index, matches, createdNodes[i], string, node)
//       }
//       if (index) {
//         createdNodes[i].push(string.substring(index))
//       } else {
//         createdNodes[i] = node
//       }
//     })
//     return createdNodes
//   }

//   function addUrlLinks (nodes) {
//     return addNodes(nodes, reUrl, function (index, matches, createdNodes, string, node) {
//       var url = matches[0]

//       var a = document.createElement('a')
//       a.setAttribute('href', url)
//       a.setAttribute('target', '_blank')
//       a.appendChild(document.createTextNode(url))

//       createdNodes.push(string.substring(index, matches.index))
//       createdNodes.push(a)

//       return matches.index + url.length
//     })
//   }

//   function addEMailLinks (nodes) {
//     return addNodes(nodes, reEmail, function (index, matches, createdNodes, string, node) {
//       var email = matches[0]

//       var a = document.createElement('a')
//       a.setAttribute('href', 'mailto:' + email)
//       a.appendChild(document.createTextNode(email))

//       createdNodes.push(string.substring(index, matches.index))
//       createdNodes.push(a)

//       return matches.index + email.length
//     })
//   }

//   function addPlayerLinks (nodes) {
//     return addNodes(nodes, rePlayer, function (index, matches, createdNodes, string, node) {
// 			// only system messages
//       if (string.substr(0, 1) != ':') {
//         return 0
//       }

//       var nextIndex = matches.index + matches[0].length, player = {}
//       if (nextIndex == string.length) {
//         player.name = $(node.nextSibling).text()
//         addRemoval(node.nextSibling)
//       } else {
//         player.name = string.substring(nextIndex, string.indexOf(' ', nextIndex))
//       }

//       var a = document.createElement('a')
//       a.setAttribute('href', Hyp.url('Player?page=Contacts&searchplayer=&playername=' + player.name))
//       a.appendChild(document.createTextNode(player.name))

//       createdNodes.push(string.substring(index, nextIndex))
//       createdNodes.push(a)

//       if (contacts.toNames[player.name]) {
//         switch (contacts.toNames[player.name].type) {
//           case 'buddy': a.className = 'hlight'; break
//           case 'friendly': a.className = 'ally'; break
//           case 'hostile': a.className = 'enemy'; break
//         }
//       }

//       return nextIndex + player.name.length
//     })
//   }

//   function addLeavingAvgP (nodes) {
//     return addNodes(nodes, reComposition, function (index, matches, createdNodes, string, node) {
//       var avgRaceId = Hyp.races.length + 1,
//         avgP = (parseFloat(matches[2]) || 0) * Hyp.spaceAvgP[1][avgRaceId] + // Destroyers
// 					(parseFloat(matches[4]) || 0) * Hyp.spaceAvgP[2][avgRaceId] + // Cruisers
// 					(parseFloat(matches[6]) || 0) * Hyp.spaceAvgP[3][avgRaceId] + // Scouts
// 					(parseFloat(matches[8]) || 0) * Hyp.spaceAvgP[4][avgRaceId] + // Bombers
// 					(parseFloat(matches[10]) || 0) * Hyp.spaceAvgP[5][avgRaceId] // Starbases

//       createdNodes.push(document.createTextNode(
// 				string +
// 				'AvgP: ~' +
// 				numeral(avgP).format('0[.]0a')
// 			))

//       return matches.index + matches[0].length
//     })
//   }

//   function addTextNodes (nodes) {
//     var span
//     nodes = addUrlLinks(nodes)
//     nodes = addEMailLinks(nodes)
//     nodes = addPlayerLinks(nodes)
//     nodes = addLeavingAvgP(nodes)
//     if (nodes[0] != node) {
//       span = document.createElement('span')
//       $.each(nodes, function (_, node) {
//         if (typeof node === 'string') {
//           span.appendChild(document.createTextNode(node))
//         } else if (node instanceof Array) {
//           $.each(node, arguments.callee)
//         } else {
//           span.appendChild(node)
//         }
//       })
//       addReplacement(node, span)
//     }
//   }

//   function addTableRow (table, node, totals) {
//     var text = node.nodeValue,
//       tr = $('<tr>')
// 				.addClass('line' + (table.find('tr').length % 2))
// 				.mouseover(function () { $(this).addClass('lineCenteredOn') })
// 				.mouseout(function () { $(this).removeClass('lineCenteredOn') })

//     $.each($.trim(text).split(/ ?\| ?/), function (i, text) {
//       var value = textToValue(text),
//         td = $('<td>')

//       if (typeof value === 'number') {
//         if (!totals[i]) {
//           totals[i] = 0
//         }
//         totals[i] += value
//         td.addClass('hr')
//       } else if (value instanceof Date) {
//         td.addClass('hc')
//         text = moment(value).utc().format('YYYY-MM-DD HH:mm')
//       }

//       tr.append(td.text(text))
//     })

//     table.append(tr)
//   }

//   function addTableTotals (table, totals) {
//     var tr = $('<tr class="stdArray">')

//     $.each(totals, function (i, value) {
//       var td = $('<td>')
//       if (!value && !i) {
//         td.text('Total')
//       } else if (value) {
//         td.addClass('hr').text(numeral(value).format('0[.]0a'))
//       }
//       tr.append(td)
//     })

//     var numColumns = table.find('tr:first-child').children().length
//     while (tr.children().length < numColumns) {
//       tr.append('<td></td>')
//     }

//     table.append(tr)
//   }

// 	// var MODE_TEXT = 0,
// 	// 	MODE_TABLE = 1,
// 	// 	mode = MODE_TEXT,
// 	// 	node, table, totals;
// 	// while (node = walker.nextNode()) {
// 	// 	if (
// 	// 		-1 < $.inArray(node.parentNode.nodeName, invalidParents) ||
// 	// 		$(node).closest('table').parent().closest('table').prev('form').length // preview in forums
// 	// 	) {
// 	// 		continue;
// 	// 	}

// 	// 	(function (node) {
// 	// 		var text = node.nodeValue;
// 	// 		if (
// 	// 			$(node).closest('.player').length > 0 &&
// 	// 			reColumns.test(text) &&
// 	// 			$.inArray(node.parentNode.nodeName, invalidTableParents) == -1
// 	// 		) {
// 	// 			if (mode == MODE_TABLE) {
// 	// 				addRemoval(node);
// 	// 			} else {
// 	// 				mode = MODE_TABLE;
// 	// 				table = $('<table class="stdArray" width="100%">');
// 	// 				totals = [];
// 	// 				addReplacement(node, table[0]);
// 	// 			}
// 	// 		} else if (mode == MODE_TABLE) {
// 	// 			if (reHr.test(text)) {
// 	// 				addRemoval(node);
// 	// 				table.find('tr').eq(0).addClass('stdArray');
// 	// 				return;
// 	// 			}
// 	// 			if (totals.length) {
// 	// 				addTableTotals(table, totals);
// 	// 			}
// 	// 			mode = MODE_TEXT;
// 	// 		}

// 	// 		switch (mode) {
// 	// 		case MODE_TABLE:
// 	// 			addTableRow(table, node, totals);
// 	// 			break;
// 	// 		case MODE_TEXT:
// 	// 			addTextNodes([node]);
// 	// 			break;
// 	// 		}
// 	// 	})(node);
// 	// }

//   replacements.map(function (replacement) {
//     replacement.original.parentNode.replaceChild(
// 			replacement.substitute,
// 			replacement.original
// 		)
//   })

//   removals.map(function (node) {
//     node.parentNode.removeChild(node)
//   })
// })
