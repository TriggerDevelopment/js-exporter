$(function() {
    var dates = [];
    let output = '';
    let $table = $(".daTable");
    let $tableBody = $table.find('tbody')
    $tableBody.find('tr').each(function(index, tr) {
        let dateName = $(tr).find('td:nth-child(2) .qtippopup').text()
        if(dateName != null && dateName.length > 0) {
            if(dates[dateName] == null) {
                dates[dateName] = {'date': dateName,'total': 0, 'active': 0, 'inactive': 0, 'free': 0};
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
    });
    for (var key in dates) {
        if (dates.hasOwnProperty(key)) {
            let value = dates[key];
            let row = value.date + ',' + value.total + ',' + value.active + ',' + value.inactive + ',' + value.free  + '\n';
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
});
