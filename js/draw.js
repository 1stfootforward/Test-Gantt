    google.charts.load('current', {'packages':['gantt','table']});
    google.charts.setOnLoadCallback(drawChart);

    var toLoad = [];

    var past;
    var future;
    var timeFrame = 7;

    var chart;
    var data;
    var tableData;
    var table;
    var formID;

    var resources = [];
    var selectedResource = "";

    var options = {
      height: 800,
      gantt: {
            criticalPathEnabled: true,

            labelStyle: {
              fontSize: 16,
              color: 'black'
            }
            
          }
        }
        

    function daysToMilliseconds(days) {
      return days * 24 * 60 * 60 * 1000;
    }

    function initTable() {
      data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

      tableData = new google.visualization.DataTable();
      tableData.addColumn('string', 'Task ID');
      tableData.addColumn('string', 'Task Name');
      tableData.addColumn('string', 'Resource');
      tableData.addColumn('date', 'Start Date');
      tableData.addColumn('date', 'End Date');
      tableData.addColumn('number', 'Duration');
      tableData.addColumn('number', 'Percent Complete');
      tableData.addColumn('string', 'Dependencies');

    }


    function drawChart() {

      initTable();   

        past = new Date();
        future = new Date();
        past.setDate(past.getDate() - timeFrame);
        future.setDate(future.getDate() + timeFrame);
       
      chart = new google.visualization.Gantt(document.getElementById('chart_div'));
      
      table = new google.visualization.Table(document.getElementById('table_div'));
      
      loadChart();
    
       google.visualization.events.addListener(chart, 'select', selectHandler);
       google.visualization.events.addListener(chart, 'onmouseover', saveSelection);

        var selectedItem; //custom selector

        function saveSelection(e) {
            selectedItem = e.row;  //save selected item
        }

        function selectHandler() {
          if(selectedResource != data.getValue(selectedItem, 2)) {
            selectedResource = data.getValue(selectedItem, 2);

            loadChart();
          } else {
            formID =  data.getValue(selectedItem, 0);
            formFill(formID);
            loadChart();
          }
        }


    }

function redraw() {
      
       loadChart();
       formFill(0);
}

function addrow(id) {
  row = resources.indexOf(task[id].category);

  if (task[id].category != selectedResource &&  row >= 0 && "skip" != selectedResource) {
    
    if(data.getValue(row, 3) > start) { data.setValue(row, 3, start); }

    if(data.getValue(row, 4) > end) { data.setValue(row, 4, end); }

    data.setValue(row, 1, data.getValue(row, 2));
    data.setValue(row, 7, null);


  } else {

    resources[data.getNumberOfRows()]=task[id].category;
    data.addRows([[id, task[id].category + " " + task[id].name, task[id].category, start, end, null, null, task[id].depends]]);
  }

}



function loadChart() {
  initTable();
  resources = [];
  var id;

  for (var i = 0; i < Object.keys(task).length; i++) {
    id = ""+i;
    start = new Date(task[id].sdate);
    end = new Date(task[id].edate);

    if( start < future && end > past) {

      if (start < past) {start=past;}
      if (end > future) {end=future;}

        addrow(id, start, end);
    }
  } 
  if ( data.getNumberOfRows() > 0 ) { 


    chart.draw(data, options);
    goTable();
    table.draw(tableData, {showRowNumber: true, width: '100%'});
  }
}

function goTable() {
        for (var i = 0; i < Object.keys(task).length; i++) {
          id = ""+i;
          start = new Date(task[id].sdate);
          end = new Date(task[id].edate);

          tableData.addRows([[id, task[id].category + " " + task[id].name, task[id].category, start, end, null, 100, null]]);
        }
}

function previousWeek() {
        past.setDate(past.getDate() - timeFrame);
        future.setDate(future.getDate() - timeFrame);
        loadChart ();
}

function nextWeek() {
        past.setDate(past.getDate() + timeFrame);
        future.setDate(future.getDate() + timeFrame);
       
        loadChart();     
}

function toggleTimeFrame() {
        if(timeFrame == 7) {
          timeFrame = 14;
          past.setDate(past.getDate() - 7);
        future.setDate(future.getDate() + 7);
        } else {
          timeFrame = 7;
          past.setDate(past.getDate() + timeFrame);
          future.setDate(future.getDate() - timeFrame);
        }
        
        loadChart();   
}

function collapse() {
  past.setDate(past.getDate() - timeFrame);
  future.setDate(future.getDate() + timeFrame);

  if(selectedResource == "") {
    selectedResource = "skip";
    loadChart();
  } else {
    selectedResource = "";
    loadChart();
  }
}



