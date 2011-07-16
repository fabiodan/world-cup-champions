var worldCupChampions = {
	data : {},
	colors : null,
	init : function(colors) {
		this.colors = colors;
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
		this.buildGraph();
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
			memo = {};

		for (var i in this.data) {
			htmlYears += "<li>" + i + "</li>";
			if (!memo[this.data[i]]) {
				memo[this.data[i]] = i;
				htmlTeams += "<li>" + this.data[i] + "</li>";				
			}
		}
		document.querySelector("#years").innerHTML = htmlYears;
		document.querySelector("#teams").innerHTML = htmlTeams;
	},

	// To do: Draw the target lines only in the end.
	buildGraph : function(target) {
		this.buildDom();

		var graph = document.querySelector("#graph"),
			ctx = graph.getContext("2d"),
			years = document.querySelectorAll("#years li"),
			teams = document.querySelectorAll("#teams li"),
			graphHeight = graph.offsetHeight,
	    	colors = this.colors || {};

		// Cleaning the canvas.
		ctx.clearRect (0, 0, 1000, 500);

		// Adding an mouseover listener on teams.
		document.querySelector("#teams").onmouseover = this.mouseoverHandler;

	    for (var i = 0; i < years.length; i++) {

	        // Getting the "year" element coordinates.
	        var year = years[i].firstChild.nodeValue,
	            yearLeftPos = years[i].offsetLeft,
	            yearRightPos = yearLeftPos + years[i].offsetWidth;

	        for (var j = 0; j < teams.length; j++) {        
	            var team = teams[j].firstChild.nodeValue;

	            // Setting one color for each team.
	            !colors[team] && (colors[team] = this.randomColor());

	            if (team == this.data[year]) {

			        // Getting the "team" element coordinates.
	                var teamLeftPos = teams[j].offsetLeft,
	                	teamRightPos = teamLeftPos + teams[j].offsetWidth;

	                // Initializing graph properties.
	                ctx.fillStyle = colors[team];
					
					// Highlight on mouseover.
					team == target ? ctx.globalAlpha = 1 : ctx.globalAlpha = 0.3;
									
	                // Drawing the graph.
	                ctx.beginPath();
	                ctx.moveTo(yearLeftPos, 0);
	                ctx.lineTo(yearRightPos, 0);
	                ctx.quadraticCurveTo(graphHeight/2, graphHeight/2, teamRightPos, graphHeight);
	                ctx.lineTo(teamLeftPos, graphHeight);
	                ctx.quadraticCurveTo(graphHeight/2, graphHeight/2, yearLeftPos, 0);
	                ctx.fill();
	            }
	        }
	    }		
	},
	mouseoverHandler : function(e) {
		worldCupChampions.buildGraph(e.target.firstChild.nodeValue);
	}
};

worldCupChampions.init({"Brazil" : "green", "Italy" : "blue", "Spain" : "#C60B1E", "West Germany" : "#FFCE00"});
