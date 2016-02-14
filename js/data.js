        
        
        var formatFunc = gantt.date.date_to_str("%d/%m/%Y");
        var color = [];
        var listOfColors = ["gantt_blue","gantt_red","gantt_orange","gantt_green","gantt_purple","gantt_navy"];
        var underline = [];
        var duration;
        var early = new Date();
        var count;
        var removeHeight;
        early.setYear(early.getFullYear()-1);
        
        var load =  {data:[],links:[]};

        var tradeCat = [];

        var tasks = [];

        var oldtasks = [
            {"content":"Description of task","name":"Task One Name", "start":"02-09-2016", "end":"02-11-2016", "trade":1},
            {"content":"Description of task","name":"Task Two", "start":"02-09-2016", "end":"02-14-2016", "trade":3},
            {"content":"Description of task","name":"Task Three", "start":"02-11-2016", "end":"02-13-2016", "trade":2},
            {"content":"Description of task","name":"Task Four", "start":"02-01-2016", "end":"02-14-2016", "trade":2},
            {"content":"Description of task","name":"Task six", "start":"02-1-2016", "end":"02-6-2016", "trade":2},
            {"content":"Description of task","name":"Task seven", "start":"02-18-2016", "end":"02-22-2016", "trade":3},
            {"content":"Description of task","name":"Task Four", "start":"02-01-2017", "end":"02-14-2017", "trade":2},
            {"content":"Description of task","name":"Task eight", "start":"02-01-2015", "end":"02-14-2015", "trade":2},
            {"content":"Description of task","name":"Task Five", "start":"01-11-2016", "end":"02-13-2016", "trade":2}] ;

        var trades = [];

        var unscheduled = [];

        var oldUnscheduled = [
            {"name":"Unscheduled One", "trade":1},
            {"name":"Unscheduled Two", "trade":1},
            {"name":"Unscheduled Three", "trade":2},
            {"name":"Unscheduled Four", "trade":2},
            {"name":"Unscheduled Five", "trade":1},
            {"name":"Unscheduled Six", "trade":3},
            {"name":"Unscheduled Seven", "trade":3},
            {"name":"Unscheduled Eight", "trade":1}
        ];



        function daysBetween(one, another) {
            var timeDiff = Math.abs(one.getTime() - another.getTime());
            return Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        }

		function fill() {

            underline.length = 0;
            removeHeight=0;
            count = 1;
            var side = "";


            
            if (trades.length==0 || chronological == true) {
              addTasksChronologically();
            } else{
              addTrades();
              addTasks();
              addUnscheduled();
            }
            

            
            height = ((count - removeHeight )*40);
            document.getElementById('gantt_here').setAttribute("style","height:"+height+"px");

        }

        function addTrades() {
            for (var i in trades) {
                c = i + 1;
                load.data[i] = {id: count , text: trades[i].name ,  start_date: early, duration:9999, parent: 0, color: trades[i].color, order:10, open: trades[i].open, direction: ""};
                color[count] = trades[i].color;
                count++;
            }
        }

        function addTasks() {
          
          for (var i in tasks) {
                var start = tasks[i].start;
                var end = tasks[i].end;

                    if(start > endOfWeek || end < startOfWeek ) {
                        if(start > endOfWeek){side = "rightArrow";}else{side = "leftArrow"}
                        load.data[count - 1] = {id: count , text: tasks[i].name , unscheduled:true , start_date: early , duration: 9999, color: color[tasks[i].trade], order:10, parent: [tasks[i].trade], direction: side};
                        
                    }
                    else {
                        dur = daysBetween( start, end);
                        markCells(tasks[i].trade, start, dur);
                        load.data[count - 1] = {id: count , text: tasks[i].name , unscheduled: false , start_date: formatFunc(start) , duration: dur+1, color: color[tasks[i].trade], order:10, parent: [tasks[i].trade], direction: ""};
  
                    }
                count++;
            }

        }

        function addTasksChronologically() { 
          for (var i in tasks) {
                var start = tasks[i].start;
                var end = tasks[i].end;

                    if(start > endOfWeek || end < startOfWeek ) {
                        if(start > endOfWeek){side = "rightArrow";}else{side = "leftArrow"}
                        load.data[count - 1] = {id: count , text: tasks[i].name , unscheduled:true , start_date: early , duration: 9999, color: color[tasks[i].trade], order:40, direction: side};
                        
                    }
                    else {
                        dur = daysBetween( start, end);
                        markCells(tasks[i].trade, start, dur);
                        load.data[count - 1] = {id: count , text: tasks[i].name , unscheduled: false , start_date: formatFunc(start) , duration: dur+1, color: color[tasks[i].trade], order:40, direction: ""};
  
                    }
                count++;
            }
        }

        function addUnscheduled() {
          var groups = []
          for (var i = unscheduled.length - 1; i >= 0; i--) {
            if(isNaN(groups[unscheduled[i].trade])) {
              groups[unscheduled[i].trade] = 1;
            } else {groups[unscheduled[i].trade]++;}
          };
          
          for (var i = groups.length - 1; i > 0; i--) {
            if(typeof groups[i] != 'undefined') {
              load.data[count - 1] = {id: count , text: "+ " + groups[i] + " Unscheduled" , unscheduled: false , start_date: startOfWeek , duration: 1, color: "unscheduled "+color[i], order:50, parent: i};
              count++;
            }
            
          };
        }


          function markCells(parent, start, dur) {

            var before = daysBetween(startOfWeek, start);
            var array = underline[parent];
            if(array == null) {array = [];}
            if(startOfWeek > start) {dur = dur-before+1; before = 0;}
            if(dur>date_range) { dur = 7;}
            for (var i = 0; i < before; i++) {

               
            };
            
            for (var i = 0; i <= dur; i++) {

               array[before + i] = true;
            };

            for (; i <= date_range; i++) {

               
            };
            underline[parent] = array;

        }


        grabTasks();



        gantt.init("gantt_here");
        fill();

        gantt.parse(load);

        underlineTasks();

        arrows();


     function underlineCells(id, color) {
        var list = underline[id];
        if(list != undefined) {
          for (var i = 0; i < list.length; i++) {
            if(list[i]) {
              
              $(".gantt_task_row.parent_row."+color).children().eq(i).addClass("shade");
            }
          };
        }

      }

      function underlineTasks() {

        
          for (var i = underline.length - 1; i > 0; i--) {
            task = gantt.getTask(i);

            if(!task.open) {
              underlineCells(i, task.color);
            }
          };
        
      }


    function refresh() {
        gantt.clearAll();
        load.data.length = 0;

        gantt.init("gantt_here");
        fill();
        gantt.parse(load);
        gantt.render();
        $( ".gantt_scale_line:eq( 1 )" ).addClass("scale_gone");
        $( ".gantt_scale_line:eq( 0 )" ).addClass("scale_stay");
        
        if (chronological) {
          arrowsDark();
        } else {
          underlineTasks();
          arrows();
        }
        
    }

      mediaQuery();

    gantt.attachEvent("onTaskDblClick", function(id,e){
      task = gantt.getTask(id);
      if(task.parent==0 && task.order != 40) {
          if( gantt.getTask(id).open) { 
            gantt.close(id)
            trades[task.id-1].open = false;
            refresh();
          } else {

          gantt.open(task.id);
          trades[task.id-1].open = true;
          refresh();
        }
      } else {
        if(task.order == 50) {
          unscheduledFire(task.parent);} 
        else {taskFired(task);}           
      }
    });

    gantt.attachEvent("onTaskClick", function(id,e){

      task = gantt.getTask(id);
      if(task.parent==0 && task.order != 40) {
          if( gantt.getTask(id).open) { 
            gantt.close(id)
            trades[task.id-1].open = false;
            refresh();
          } else {

          gantt.open(task.id);
          trades[task.id-1].open = true;
          refresh();
        }
      } else {
        if(task.order == 50) {
          unscheduledFire(task.parent);} 
        else {taskFired(task);}           
      }
    });

function arrows() {   
  $( ".rightArrow .gantt_last_cell" ).each(function( index ) {
     $( this ).html( "<sup> > </sup> " );
  });
  $( ".leftArrow" ).each(function( index ) {
     $( this ).children().eq(0).html( "<sup> < </sup> " );
  }); 
}

function arrowsDark() {   
  $( ".rightArrow .gantt_last_cell" ).each(function( index ) {
     $( this ).html( "<sup class='dark'> > </sup> " );
  });
  $( ".leftArrow" ).each(function( index ) {
     $( this ).children().eq(0).html( "<sup class='dark'> < </sup> " );
  }); 
}

function dateReorg(string) {
    var d = string.substring(0, 2);
    var m = string.substring(3, 5);
    var y = string.substring(6, 10);

    return (new Date(m+'/'+d+'/'+y));
}



function setTrade(trade) {
  
  if(tradeCat.length > 0) {
    for (var i = 0; i < tradeCat.length; i++) {
        if(tradeCat[i] == trade) {

          return i;
        }
    };
  
    tradeCat[tradeCat.length] = trade;
    return tradeCat.length-1;
  } 
  tradeCat[0] = trade;
  return 0;
}

function grabTasks() {

  var carryOver = 0;

  $( ".incomplete" ).each(function( index ) {

    addToList(this , index);
    carryOver = index;
  });

  

  $( ".complete" ).each(function( index ) {

    addToList(this , index + carryOver);
  });

  tasks.sort(function(a, b) {
    a = a.start;
    b = b.start;
    return a<b ? -1 : a>b ? 1 : 0;
  });

  for (var i = tradeCat.length - 1; i >= 0; i--) {
    trades[i] = {"name": tradeCat[i] , "open":true, "color": listOfColors[i]};

  };



    
}

function addToList(thing, index) {

    var string = $( thing ).text();
    string = string.replace(/^\s+|\s+$/g,'').replace(/\s\s+/g,' ');

    var name = string.substring(0, string.indexOf("Starts")-1);

    var start = string.substring(string.indexOf("Starts")+8, string.indexOf("Starts") + 18);
    start = dateReorg(start);

    var end = string.substring(string.indexOf("Ends")+6, string.indexOf("Ends")+16);
    end = dateReorg(end);

    var trade = string.substring((string.indexOf("ame:")+5));

    var contractor = string.substring((string.indexOf("ontractor:")+ 11), (string.indexOf("Trade")- 1));

    var description = $(thing).parent().next().children().text();

    var action = $(thing).attr('href');

    if(start == "Invalid Date") {
      unscheduled[unscheduled.length] = {"content":description, "name": name , "trade":setTrade(trade)+1, "action": action, "contractor": contractor};
    } else {
      tasks[tasks.length] = {"content":description ,"name": name , "start": start , "end":end, "trade":setTrade(trade)+1, "action":action, "contractor": contractor};

    }


    
}

$( window ).resize(function() {
  refresh();
});

