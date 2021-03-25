$(function() {
        $('iframe[data-dateName]').remove();
        var dates = [];
        let output = '';
        let $table = $(".daTable");
        let $tableBody = $table.find('tbody');
        $tableBody.find('tr').each(function(index, tr) {
            let dateName = $(tr).find('td:nth-child(2) .qtippopup').text()
            if(dateName != null && dateName.length > 0) {
                if(dates[dateName] == null) {
                    dates[dateName] = {'date': dateName,'total': 0, 'active': 0, 'inactive': 0, 'free': 0, 'booked': 0,'dbsNotBooked': 0 , 'dbs': 0, 'ia': 0, 'pending': 0};
                }
                let spanData = $(tr).find('td:nth-child(8) .qtippopup').text();
                if(spanData.toLowerCase().includes('tfe')) {
                    dates[dateName].active ++;
                }
                else if(spanData.toLowerCase().includes('fre') || spanData.toLowerCase().includes('inactive')) {
                    dates[dateName].inactive ++;
                }
                if(spanData.toLowerCase().includes('fre')) {
                    dates[dateName].free ++;
                }
                dates[dateName].total ++;
            }
            let userUrl = $(tr).find('td:nth-child(17) a').attr('href');
            $('body').append("<iframe src='" + userUrl +  "' id='" + index + 'temp' + "' style='display: none;' data-dateName='"+dateName+"'></iframe>");

        });
        setTimeout(function() {
            $('iframe[data-dateName]').each(function (){
                let $iframe = $(this).contents();
                let dateName = $(this).attr('data-dateName');
                // Get DBS
                let people = ['naomi', 'matthew ho', 'angelalyth'];
                let itemText = $iframe.find('.member_table:eq(1) tr:eq(1) td:eq(1)').text();
                itemText = itemText.toLowerCase();
                let isDbs = false;
                $.each(people, function(i, person){
                    if(itemText.includes(person.toLowerCase())) {
                        dates[dateName].dbs ++;
                        isDbs = true;
                    }
                });
                let isPending = false;
                if(itemText.includes('pending')) {
                    dates[dateName].pending ++;
                    isPending = true;
                }

                if(!isDbs && !isPending) {
                    dates[dateName].ia ++;
                }

                let isScheduled = false;
                $iframe.find('.da_table:first tr td:eq(3)').each(function(){
                    if($(this).text().toLowerCase().includes('call scheduled')) {
                        isScheduled = true;
                    }
                });
                if(!isScheduled && isDbs) {
                    dates[dateName].dbsNotBooked ++;
                }
                if(isScheduled && isDbs) {
                    dates[dateName].booked ++;
                }


            });
            for (var key in dates) {
                if (dates.hasOwnProperty(key)) {
                    let value = dates[key];
                    let row = value.date + ',' + value.total + ',' + value.active + ',' + value.inactive + ',' + value.free + ',' + value.booked + ',' + value.dbsNotBooked + ',' + value.dbs + ',' + value.ia + ',' + value.pending + '\n';
                    output += row;
                }
            }

            var pom = document.createElement('a');
            var csvContent=output; //here we load our csv data
            var blob = new Blob([csvContent],{type: 'text/csv;charset=utf-8;'});
            var url = URL.createObjectURL(blob);
            pom.href = url;
            let now  = Math.floor(Date.now() / 1000);
            pom.setAttribute('download', 'export_'+ now +'.csv');
            pom.click();
            alert('Export done. Love from Sam <3');

        }, 15000);

    });
