		gantt.config.show_grid = false;

		var today = new Date();
		var startOfWeek = getMonday(new Date());
		var endOfWeek = new Date(startOfWeek.setDate(startOfWeek.getDate()+7));

		var listOfStartDates = [];
		var listOfEndDates = [];
		

		var zoom = true;
		var toggle = false;





		init();

		function refresh() {
			gantt.render();
			gantt.refreshData();
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

			refresh()
		};

		function toggleTimeFrame() {

			if(zoom) {
				zoom = false;
				startOfWeek.setDate(startOfWeek.getDate()-7);
				endOfWeek.setDate(endOfWeek.getDate()+7);
				gantt.config.scale_unit = "week"; 
				gantt.config.date_scale = "Week #%W";
			} else {
				zoom = true;
				startOfWeek.setDate(startOfWeek.getDate()+7);
				endOfWeek.setDate(endOfWeek.getDate()-7);
				gantt.config.scale_unit= "day";
			}

			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;
			refresh();
		};

		function mediaQuery() {
			if(window.innerWidth < 800) {
				gantt.config.scale_unit = "week"; 
				gantt.config.date_scale = "Week %W";
			}
		};

		function getMonday(d) {
		  d = new Date(d);
		  var day = d.getDay(),
		      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
		  return new Date(d.setDate(diff));
		};

		function init() {
			
			startOfWeek = getMonday(new Date());
			gantt.config.start_date = startOfWeek;
			gantt.config.end_date = endOfWeek;
			mediaQuery();
		};

		gantt.templates.scale_cell_class = function(date){
        	if(date.getDay()==0||date.getDay()==6){ return "weekend"; }
        	if(date.toDateString()==today.toDateString()){ return "today"; }
    	};

    	gantt.templates.task_class = function(start, end, task){
    		 
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
        	
        	if(task.parent>0) {
        		parent = gantt.getTask(task.parent);

	        	 if (parent.shrunk) {
	        	 	return " shrunk";
	        	 }
	        	 else {
	        	 	return "big";
	        	 }
	       	 } else { return " shrunk"; }
    	};

    	gantt.templates.task_text=function(start,end,task){
    		if(task.parent<1) {
		    	return tasl.text;
		    } else {return "<b> "+task.text+",<b> Active:</b> "+task.start_date + " / "+task.end_date;}
		};

    	gantt.attachEvent("onTaskDblClick", function(id,e){
		    
		    task = gantt.getTask(id);
		    if( task.shrunk) { 
		    	task.shrunk = false;
		    } else {
				task.shrunk = true;
			}
			refresh();
		});

		gantt.attachEvent("onTaskClick", function(id,e){

			task = gantt.getTask(id);
		    if( task.shrunk) { 
		    	task.shrunk = false;
		    } else {
				task.shrunk = true;
			}
			refresh();
		});

		function collapse() {

			if(toggle) {
				gantt.eachTask(function(task){
				    gantt.getTask(task.id).shrunk = true;
				});
				gantt.render();
				toggle = false;
				
			} else {

				gantt.eachTask(function(task){
				    gantt.getTask(task.id).shrunk = false;
				});
				gantt.render();
				toggle = true;
				
			}
			refresh();
		}

		gantt.templates.leftside_text = function(start, end, task){
    		return "<b>Priority: </b>" +task.priority;
		};

		function setProjects() {
			gantt.eachTask(function(task){
				if(task.parent != 0) {			
					var calc = gantt.calculateEndDate(task.end_date, task.duration);

					if(listOfStartDates[task.parent]<task.start_date || listOfStartDates[task.parent] == null) { listOfStartDates[task.parent]=task.start_date;}

					if(listOfEndDates[task.parent]>calc || listOfEndDates[task.parent] == null) { 
						
						listOfEndDates[task.parent]=calc;
					}
				}
			});
			gantt.eachTask(function(task){
				if(task.parent == 0) {			
					task.start_date = listOfStartDates[task.id];
					task.duration = gantt.calculateDuration(listOfStartDates[task.id], listOfEndDates[task.id]);
					task.end_date = listOfEndDates[task.id];
					console.log(task.end_date);	
				}
			});
			refresh();
		}

		gantt.attachEvent("onTaskDrag", function(id, mode, task, original){
		    
		});

		gantt.attachEvent("onTaskCreated", function(task){
			
		 gantt.open(task.id);
		});

		function reschedule() {
			gantt.expand();
			refresh();
		}