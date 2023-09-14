/* camo */

var camoTimestamp = Cookies.get('timestampCamo');

var displayCamo = function(camoData) {

    $.each(camoData, function(_, row) {

        var $input = $('input[value="' + row.fleet_id + '"]');
        var camoTxt = "<br/><div class='camo'>Camouflage mode : ";
        if (row.camo == "on") {
            camoTxt += "<span class='camo camo-on'>On</span></div>";
        } else {
            camoTxt += "<span class='camo camo-off'>Off</span></div>";
        }
        $input.parent().prev().append(
            camoTxt
        );

    });

}

if ($('.megaCurrentItem[href="/servlet/Fleets?pagetype=moving_fleets"]').length == 1) {

    Hyp.getMovingFleetsFromHtml(document).done(function(fleets) {
        var camoData = [];

        function formatPosition(position) {
            return '(' + position.x + ',' + position.y + ')';
        }

        function toggleAll() {
            var $this = $(this);
            $this
                .closest('tr')
                .nextUntil('.movingFleetGroupTitle')
                .find('input[type=checkbox]')
                .prop({
                    checked: $this.prop('checked')
                });
        }

        var $sortByEta = $('.banner [name=sortOrGroup').eq(0);
        var groupByEta = $sortByEta.length === 0 || $sortByEta.prop('disabled');
        var previousEta = null;

        chrome.storage.sync.get('camo', function(store) {

            if (camoTimestamp == undefined || (((new Date).getTime() - camoTimestamp) > 320000)) {

                $.each(fleets, function(_, fleet) {

                    Hyp.getChangeFleet(fleet.id).done(function(camo) {
                        var $input = $('input[value="' + fleet.id + '"]');
                        var camoTxt = "<br/><div class='camo'>Camouflage mode : ";
                        if (camo == "on") {
                            camoTxt += "<span class='camo camo-on'>On</span></div>";
                        } else {
                            camoTxt += "<span class='camo camo-off'>Off</span></div>";
                        }
                        camoData.push({
                            fleet_id: fleet.id,
                            camo: camo
                        });

                        $input.parent().prev().append(
                            camoTxt
                        );
                    });

                    if (_ == (fleets.length - 1)) {
                        displayCamo(camoData);
                    }
                });

            } else {
                displayCamo(camoData);
            }

        });

        $.each(fleets, function(_, fleet) {

            var distance = {
                    x: fleet.to.x - fleet.from.x,
                    y: fleet.to.y - fleet.from.y
                },
                eta = Math.max(Math.abs(distance.x), Math.abs(distance.y)) + 2,
                progress = 1 - (fleet.eta - fleet.delay) / eta;

            position = {
                x: Math.round(fleet.from.x + progress * distance.x),
                y: Math.round(fleet.from.y + progress * distance.y)
            };

            var $input = $('input[value="' + fleet.id + '"]');

            $input.parent().prev().append(
                '<br>From ', formatPosition(fleet.from),
                ' to ', formatPosition(fleet.to),
                ' @ ', formatPosition(position),
                ' (', numeral(progress).format('0[.]0%'), ')'
            );

            previousEta = fleet.eta;

        });


    });
}