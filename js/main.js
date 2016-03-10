    gantt.config.show_unscheduled = true;
    
    gantt.config.show_grid = false;
    gantt.config.drag_resize = true;
    gantt.config.drag_progress = false;
    gantt.config.drag_move = true;
    gantt.config.drag_links = false;
    gantt.config.min_column_width = 1;

    var buttonGrid = "<ul class='button-group round even-5 gchart' ><li><a class='button' onclick='left()'><i class='fi-arrow-left'></i></a></li><li><a class='secondary hollow button' onclick='collapseTasks()'><i id='collapse' class='fi-arrows-compress'></i></a></li><li><a class='secondary hollow button' onclick='chronologicalToggle()'><i id='chrono' class='fi-indent-more'></i></a></li><li><a class='secondary hollow button' onclick='toggleTimeFrame()'><i id='time' class='fi-calendar'></i></a></li><li><a class='button' onclick='right()'><i class='fi-arrow-right'></i></a></ul><div id='gantt_here' style=' width:300px; height:100px;'></div></div>";
    $( "#gantt_here" ).parent().html(buttonGrid);

    var date_range = 6

    var today = new Date();
    var startOfWeek = getMonday(new Date());
    var endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate()+date_range));

    startOfWeek = getMonday(new Date());
    gantt.config.start_date = startOfWeek;
    gantt.config.end_date = endOfWeek;

    var zoom = true;
    var collapse = false;
    var chronological = false;

        var str = "";
      var startH = "<br /><div class='row'><div class='small-12 medium-6 columns'>";
      var middleH = "</div><div class='small-12 medium-6 columns'>";
      var endH = "</div></div> </br>"

    function chronologicalToggle() {
      $("#chrono").toggleClass( "fi-indent-more" );
      $("#chrono").toggleClass( "fi-indent-less" );
      chronological = !chronological;
      refresh();

    }

    function left() {
      startOfWeek.setDate(startOfWeek.getDate()-7);
      endOfWeek.setDate(endOfWeek.getDate()-7);

      gantt.config.start_date = startOfWeek;
      gantt.config.end_date = endOfWeek;

      refresh();
    };

    function right() {
      startOfWeek.setDate(startOfWeek.getDate()+7);
      endOfWeek.setDate(endOfWeek.getDate()+7);

      gantt.config.start_date = startOfWeek;
      gantt.config.end_date = endOfWeek;

      refresh();
    };

    function toggleTimeFrame() {
      if(zoom) {
        zoom = false;

        var weekScaleTemplate = function(date){
          var dateToStr = gantt.date.date_to_str("%d %M");
          var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
          return dateToStr(date) + " - " + dateToStr(endDate);
        };
        gantt.templates.date_scale = weekScaleTemplate;
        date_range = 20;
        gantt.config.scale_unit = "week";
        startOfWeek.setDate(startOfWeek.getDate()-7);
        endOfWeek.setDate(endOfWeek.getDate()+7);
        gantt.config.step = 1;
        gantt.config.subscales = [
            {unit:"day", step:1, date:"%d"}
        ];
      } else {
        zoom = true;

        gantt.templates.date_scale = null;
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%M %d"; 
        date_range = 6;

        startOfWeek.setDate(startOfWeek.getDate()+7);
        endOfWeek.setDate(endOfWeek.getDate()-7);
        gantt.config.step = 1;
      }

      gantt.config.start_date = startOfWeek;
      gantt.config.end_date = endOfWeek;
      refresh();
    };

    function mediaQuery() {

      if(window.innerWidth < 1000) {
        toggleTimeFrame();
      }
    };

    function getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    };


    gantt.templates.scale_cell_class = function(date){

      if(zoom) {
        if(date.toDateString()==today.toDateString()){ return "today"; }
            if(date.getDay()==0||date.getDay()==6){ return "weekend"; }
          } else {
            date = new Date(date);
            if(date < new Date(today) && date.setDate(date.getDate() + 7) > new Date(today) ){  return "today"; }
          }
          
      };

      function format (d) {
        
      var d_names = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

      var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

      var curr_day = d.getDay();
      var curr_date = d.getDate();
      var sup = "";
      if (curr_date == 1 || curr_date == 21 || curr_date ==31)
         {
         sup = "st";
         }
      else if (curr_date == 2 || curr_date == 22)
         {
         sup = "nd";
         }
      else if (curr_date == 3 || curr_date == 23)
         {
         sup = "rd";
         }
      else
         {
         sup = "th";
         }
      var curr_month = d.getMonth();
      var curr_year = d.getFullYear();

      return (d_names[curr_day] + " " + curr_date + "<SUP>" + sup + "</SUP> " + m_names[curr_month] + " " + curr_year);

      }



    function taskFired(task){
      str = "";

      if(task.id >= count) {window.location.href=task.action; return 0}

 

      var i = task.id - 1
      if(!chronological) { i = i - trades.length; }

      var button = "</p> <p><a class='primary hollow button small-six columns' href=" + tasks[i].action + ">Edit</a>" 

      
      var start = format(tasks[i].start);
      var end = format(tasks[i].end);
      if(task.both == "qright") {start = "No start date"}
      if(task.both == "qleft") {end = "No end date"}

      str = str + " <div class='small-12 columns'><h2 class='lead'>" + trades[tasks[i].trade - 1].name + "</h2>" + "<h4>" + tasks[i].name + "</h4> </div><div class='small-12 columns'>" + tasks[i].content + "</div><div class='small-12 columns'><p><br /> <b>Start: </b> " + start + " " + tasks[i].startTime + "</p>" + "<p> <b>End: </b> " + end + " " + tasks[i].startTime + "</p>" + button  ;

      $( "#modalTitle" ).html();
      $( "#modalContent" ).html(str);
      $( "#modalSDate" ).html();
      $( "#modalEDate" ).html();

      $('#myModal').foundation('reveal', 'open');

    }

    function unscheduledFire(task){
      str = "";

      if(task.id >= count) {window.location.href=task.action; return 0}


      var i = task.id - 1;
      if(!chronological) { i = i - trades.length - tasks.length; }

      var button = "</p> <p><a class='primary hollow button small-six columns' href=" + unscheduled[i].action + ">Edit</a>" 

      str = str + " <div class='small-12 columns'><h2 class='lead'>" + trades[unscheduled[i].trade - 1].name + "</h2>" + "<h4>" + unscheduled[i].name + "</h4> </div><div class='small-12 columns'>" + unscheduled[i].content + "</div>" + button  ;

      $( "#modalTitle" ).html();
      $( "#modalContent" ).html(str);
      $( "#modalSDate" ).html();
      $( "#modalEDate" ).html();

      $('#myModal').foundation('reveal', 'open');

    }

    function oldUnscheduledFire(id){

      str = "<h2>"+ trades[id-1].name +"</h2>";

      for (var i = unscheduled.length - 1; i >= 0; i--) {
        if(unscheduled[i].trade == id) {
          var button = "</p> <p><a class='primary hollow button columns' href=" + unscheduled[i].action + ">Edit</a>"

          str = str + startH + " <p class='lead'>" + unscheduled[i].name + "</p><p>" + unscheduled[i].content + "</p>" + middleH + "<p>" + unscheduled[i].contractor + "</p>" + button + endH ;

        }
      };
      $( "#modalContent" ).html(str);
      $( "#modalSDate" ).html(" ");
      $( "#modalEDate" ).html(" ");
      $( "#modalTrade" ).html(" ");
      $('#myModal').foundation('reveal', 'open');

    }

    function collapseTasks() {
      $("#collapse").toggleClass( "fi-arrows-compress" );
      $("#collapse").toggleClass( "fi-arrows-expand" );
      if(collapse) {
        gantt.eachTask(function(task){
          if(task.id < count) {
            if(task.parent==0) {
                gantt.open(task.id);
                trades[task.id-1].open = true;
            }
          }
        });
        collapse = false;       
      } else {
        gantt.eachTask(function(task){
          if(task.id < count) {
            if(task.parent==0) {
                gantt.close(task.id)
                trades[task.id-1].open = false;
            }
          }
        });
        collapse = true;
      }
      refresh();
    }
    

    gantt.templates.task_class = function(start, end, task){

      if(chronological) { return task.color + " chrono_task"}
         
           if(task.parent>0) {
            parent = gantt.getTask(task.parent);

              if (parent.shrunk) { 
                return task.color + " shrunk " + task.both;
               }
               else {
                return task.color + " big " + task.both;
               }
             
            } else { return task.color + " project"; }
      };

      gantt.templates.task_row_class = function(start, end, task){ 
          
           if(chronological) { return task.direction + " chrono_row"}
          
           if(task.parent>0) {
              return task.color + " lighten " + task.direction;
             
           } else { 
              return task.color + " parent_row";
             
           }
           
             
      };




        
        
        var formatFunc = gantt.date.date_to_str("%d/%m/%Y");
        var color = [];
        var listOfColors = ["gantt_blue","gantt_purple","gantt_green","gantt_red","gantt_orange","gantt_pink","gantt_yellow"];
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
            {content:"Description of task","name":"Task One Name", "start":"02-09-2016", "end":"02-11-2016", "trade":1},
            {content:"Description of task","name":"Task Two", "start":"02-09-2016", "end":"02-14-2016", "trade":3},
            {content:"Description of task","name":"Task Three", "start":"02-11-2016", "end":"02-13-2016", "trade":2},
            {content:"Description of task","name":"Task Four", "start":"02-01-2016", "end":"02-14-2016", "trade":2},
            {content:"Description of task","name":"Task six", "start":"02-1-2016", "end":"02-6-2016", "trade":2},
            {content:"Description of task","name":"Task seven", "start":"02-18-2016", "end":"02-22-2016", "trade":3},
            {content:"Description of task","name":"Task Four", "start":"02-01-2017", "end":"02-14-2017", "trade":2},
            {content:"Description of task","name":"Task eight", "start":"02-01-2015", "end":"02-14-2015", "trade":2},
            {content:"Description of task","name":"Task Five", "start":"01-11-2016", "end":"02-13-2016", "trade":2}] ;

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
              addNoParentUnscheduled()
            } else{
              addTrades();
              addTasks();
              addUnscheduled();
            }

            load.data[count - 1] = {id: count , text: "<sub><i class='fi-plus'></i></sub>" , unscheduled: false , start_date: endOfWeek , color: "add", action: "javascript:__doPostBack('ctl00$ContentBody$lnkAddTask','')", duration: 1, order:40, direction: ""};
            
            height = ((count - removeHeight )*40);
            document.getElementById('gantt_here').setAttribute("style","height:"+ (window.innerHeight - 45) +"px");


        }

        function addTrades() {
            for (var i in trades) {
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
                        load.data[count - 1] = {id: count , text: tasks[i].name , both: tasks[i].oneDate, unscheduled:true , start_date: early , duration: 9999, color: color[tasks[i].trade], order:10, parent: [tasks[i].trade], direction: side};
                        
                    }
                    else {
                        dur = daysBetween( start, end);
                        markCells(tasks[i].trade, start, dur);
                        load.data[count - 1] = {id: count , text: tasks[i].name , both: tasks[i].oneDate, unscheduled: false , start_date: formatFunc(start) , duration: dur+1, color: color[tasks[i].trade], order:10, parent: [tasks[i].trade], direction: ""};
  
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

        function addGroupedUnscheduled() {
          var groups = []
          for (var i = unscheduled.length - 1; i >= 0; i--) {
            if(isNaN(groups[unscheduled[i].trade])) {
              groups[unscheduled[i].trade] = 1;
            } else {groups[unscheduled[i].trade]++;}
          };
          
          for (var i = groups.length - 1; i >= 0; i--) {
            if(typeof groups[i] != 'undefined') {
              load.data[count - 1] = {id: count , text: "+ " + groups[i] + " <b>Unscheduled</b>" , unscheduled: false , start_date: startOfWeek , duration: 1, color: "unscheduled "+color[i], order:50, parent: i};
              count++;
            }       
          };
        }

        function addUnscheduled() {
          var groups = []
          for (var i in unscheduled) {
              
              load.data[count - 1] = {id: count , text: unscheduled[i].name + " <b>Unscheduled</b>" , unscheduled: false , start_date: startOfWeek , duration: 1, color: "unscheduled "+color[unscheduled[i].trade], order:50, parent: unscheduled[i].trade};

              count++;
          };
        }

        function addNoParentUnscheduled() {
          var groups = []
          for (var i = unscheduled.length; i > 0; i--) {
              
              load.data[count - 1] = {id: count , text: unscheduled[i-1].name + " <b>Unscheduled</b>" , unscheduled: false , start_date: startOfWeek , duration: 1, color: "unscheduled "+color[i], order:50, parent: 0};

              count++;
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
          unscheduledFire(task);} 
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
          unscheduledFire(task);} 
        else {taskFired(task);}           
      }
    });

function arrows() {   
  $( ".rightArrow .gantt_last_cell" ).each(function( index ) {
     $( this ).html( "<sup><i class='fi-arrow-right'></i></sup> " );
  });
  $( ".leftArrow" ).each(function( index ) {
     $( this ).children().eq(0).html( "<sup><i class='fi-arrow-left'></i></sup> " );
  }); 
}

function arrowsDark() {   
  $( ".rightArrow .gantt_last_cell" ).each(function( index ) {
     $( this ).html( "<sup><i class='fi-arrow-right'></i></sup> " );
  });
  $( ".leftArrow" ).each(function( index ) {
     $( this ).children().eq(0).html( "<sup><i class='fi-arrow-left'></i></sup> " );
  }); 
}

function dateReorg(string) {
    var d = string.substring(0, 2);
    var m = string.substring(3, 5);
    var y = string.substring(6, 10);

    return (new Date(m+'/'+d+'/'+y));
}



function setTrade(trade, contractor) {
  trade = trade + " - " + contractor;
  
  if(tradeCat.length > 0) {
    for (var i = tradeCat.length; i >= 0; i--) {
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
    trades[i] = {"name": tradeCat[i] , "open":true, "color": listOfColors[i % 7]};

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

    if(start == "Invalid Date" && end == "Invalid Date") {
      unscheduled[unscheduled.length] = {content:description, "name": name , "tradeName": trade, "trade":setTrade(trade,contractor)+1, "action": action, "contractor": contractor};
    } else {
      var secondRow = string.substring(string.indexOf("\n"), string.indexOf("Contractor"));
      var startT = secondRow.substring(secondRow.indexOf("Starts") + 18, secondRow.indexOf("|"));
      var endT = secondRow.substring(secondRow.indexOf("|")+18);

      if (startT == "ied ") { startT = "";}
      if (endT == "ied ") { endT = "";}

      var oneDate = "qboth";

      if(start == "Invalid Date") {
            oneDate = "qright";
            start = new Date(end);
            start.setDate(start.getDate() - 3);
      }

      if(end == "Invalid Date") {
            oneDate = "qleft";
            end = new Date(start);
            end.setDate(end.getDate() + 3); 
      }
      tasks[tasks.length] = {content:description ,"name": name , "start": start, "startTime": startT, "end":end, "endTime": endT, "tradeName": trade, "trade":setTrade(trade,contractor)+1, "action":action, "contractor": contractor, "oneDate": oneDate};
    }   
}

$( window ).resize(function() {
  refresh();
});

