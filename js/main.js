    gantt.config.show_unscheduled = true;
    
    gantt.config.show_grid = false;
    gantt.config.drag_resize = false;
    gantt.config.drag_progress = false;
    gantt.config.drag_move = false;
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


			var i = task.id - 1
			if(!chronological) { i = i - trades.length; }

			var button = "</p> <p><a class='primary hollow button columns' href=" + tasks[i].action + ">View</a>" 

			str = str + startH + " <p class='lead'>" + tasks[i].name + "</p><p>" + tasks[i].content + "</p>" + middleH + "<p>" + tasks[i].contractor + "</p><p>" + trades[tasks[i].trade - 1].name + "</p> </div></div><div class='row'><div class='small-12 medium-6 columns'><p> <b>Start: </b> " + format(tasks[i].start) + "</p>" + middleH + "<p> <b>End: </b> " + format(tasks[i].end) + "</p>" + endH + button  ;

			$( "#modalTitle" ).html(tasks[i].name);
			$( "#modalContent" ).html(str);
			$( "#modalSDate" ).html();
			$( "#modalEDate" ).html();

			$('#myModal').foundation('reveal', 'open');

		}

		function unscheduledFire(id){

			str = "";
			$( "#modalTitle" ).html(trades[id-1].name);



			for (var i = unscheduled.length - 1; i >= 0; i--) {
				if(unscheduled[i].trade == id) {
					var button = "</p> <p><a class='primary hollow button columns' href=" + unscheduled[i].action + ">View</a>"

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
					if(task.parent==0) {
					    gantt.open(task.id);
					    trades[task.id-1].open = true;
					}
				});
				collapse = false;				
			} else {
				gantt.eachTask(function(task){
					if(task.parent==0) {
				    	gantt.close(task.id)
				    	trades[task.id-1].open = false;
				    }
				});
				collapse = true;
			}
			refresh();
		}
    

		gantt.templates.task_class = function(start, end, task){

			if(chronological) { return task.color + " chrono_task lighten"}
    		 
        	 if(task.parent>0) {
        	 	parent = gantt.getTask(task.parent);
	        	 if (parent.shrunk) {
	        	 	return task.color + " shrunk";
	        	 }
	        	 else {
	        	 	return task.color + " big";
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



