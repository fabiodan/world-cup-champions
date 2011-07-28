var worldCupChampions = {
	data : {},
	colors : {},
	init : function(colors) {
		this.colors = colors || {};
		this.getJson();
	},
	getJson : function() {
	    var head = document.querySelector("head") || document.documentElement,
	        script = document.createElement("script");

		/* 
		 * YQL Query. Permalink: http://y.ahoo.it/W87GoSBp 
		 * Source: http://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_finals
	     */
		script.src = "http://query.yahooapis.com/v1/public/yql?q=select%20content%20from%20html%20where%20url%3D%22http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FList_of_FIFA_World_Cup_finals%22%20and%20xpath%3D'%2F%2Ftable%5B2%5D%2Ftr%2Ftd%5Bposition()%3C3%5D%2Fa'&format=json&callback=worldCupChampions.formatData";

		script.onload = function() {
			(head && script.parentNode) && head.removeChild(script);
		};
		head.appendChild(script);
	},
	formatData : function(response) {
	    var json = response.query.results.a;

	    for (var i in json) {
	        (i % 2 == 1) && (this.data[json[i - 1]] = json[i]);
	    }
		this.buildDom();
	},

	/*
	 * Random Color Generator.
	 * http://www.redips.net/javascript/random-color-generator/
	 */
	randomColor : function() {
    	return '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);
	},
	buildDom : function() {
		var htmlYears = "",
			htmlTeams = "",
			memo = {},
			yearsList = document.querySelector("#years"),
			teamsList = document.querySelector("#teams");
			

		for (var i in this.data) {
			htmlYears += "<li>" + i + "</li>";
			if (!memo[this.data[i]]) {
				memo[this.data[i]] = i;
				htmlTeams += "<li>" + this.data[i] + "</li>";				
			}
		}
		
		// Populating the lists with the content.
		yearsList.innerHTML = htmlYears;
		teamsList.innerHTML = htmlTeams;

		// Adding a mouseover and a mouseout listener on the years and teams.
		yearsList.onmouseover = teamsList.onmouseover = this.mouseoverHandler;
		yearsList.onmouseout = teamsList.onmouseout = this.mouseoutHandler;

		this.buildGraph();		
	},
	buildGraph : function(target) {
		var that = this,
			graph = document.querySelector("#graph"),
			ctx = graph.getContext("2d"),
			years = document.querySelectorAll("#years li"),
			teams = document.querySelectorAll("#teams li"),
			graphWidth = graph.offsetWidth,
			graphHeight = graph.offsetHeight,
	    	colors = this.colors,
			target = target || false;

		// Cleaning the canvas.
		ctx.clearRect (0, 0, graphWidth, graphHeight);

		function getCoordinates(drawHighlight) {
			function drawCanvas() {

				// Coloring the selected teams/years lines, or coloring all lines if there is no selection. 
				ctx.fillStyle = target ? ((target == team || target == year) && colors[team] || "#DDD") : colors[team];

				// Highlight on mouseover.
				ctx.globalAlpha = 0.3;

                // Drawing the canvas.
                ctx.beginPath();
                ctx.moveTo(yearLeftPos, 0);
                ctx.lineTo(yearRightPos, 0);
                ctx.quadraticCurveTo(graphHeight/2, graphHeight/2, teamRightPos, graphHeight);
                ctx.lineTo(teamLeftPos, graphHeight);
                ctx.quadraticCurveTo(graphHeight/2, graphHeight/2, yearLeftPos, 0);
                ctx.fill();
			}

		    for (var i = 0; i < years.length; i++) {

		        // Getting the "year" element coordinates.
		        var year = years[i].firstChild.nodeValue,
		            yearLeftPos = years[i].offsetLeft,
		            yearRightPos = yearLeftPos + years[i].offsetWidth;

		        for (var j = 0; j < teams.length; j++) {        
		            var team = teams[j].firstChild.nodeValue;

		            // Setting one color for each team.
		            !colors[team] && (colors[team] = that.randomColor());

		            if (!drawHighlight && team == that.data[year]) {

				        // Getting the "team" element coordinates.
		                var teamLeftPos = teams[j].offsetLeft,
		                	teamRightPos = teamLeftPos + teams[j].offsetWidth;

						// Drawing the graph.
						drawCanvas();
		            }						

					// Redrawing the selected team.
					else if (target == team && team == that.data[year]) {

				        // Getting the "team" element coordinates.
		                var teamLeftPos = teams[j].offsetLeft,
		                	teamRightPos = teamLeftPos + teams[j].offsetWidth;

						// Drawing the graph.
						drawCanvas();
					}

					// Redrawing the selected year.
					else if (target == year && team == that.data[year]) {

				        // Getting the "team" element coordinates.
		                var teamLeftPos = teams[j].offsetLeft,
		                	teamRightPos = teamLeftPos + teams[j].offsetWidth;

						// Drawing the graph.
						drawCanvas();
					}
		        }
		    }			
		}
		getCoordinates();
		
		// Calling the function again to redraw the highlight context.
		target && getCoordinates(true);
		
	},
	mouseoverHandler : function(e) {
		(e.target.id != this.id) && worldCupChampions.buildGraph(e.target.firstChild.nodeValue);
	},
	mouseoutHandler : function(e) {
		(e.relatedTarget.id != this.id) && worldCupChampions.buildGraph();
	}
};

worldCupChampions.init({"Uruguay" : "magenta", "Argentina" : "blueviolet", "Brazil" : "green", "Italy" : "blue", "Spain" : "darkred", "West Germany" : "goldenrod", "England" : "red", "France" : "steelblue"});
