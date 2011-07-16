var worldCupChampions = {
	init : function() {
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
	    var json = response.query.results.a,
	        data = {};

	    for (var i in json) {
	        (i % 2 == 1) && (data[json[i - 1]] = json[i]);
	    }

		this.buildGraph(data, {"Brazil" : "green", "Italy" : "blue"});
	},

	/*
	 * Random Color Generator.
	 * http://www.redips.net/javascript/random-color-generator/
	 */
	randomColor : function() {
	    var hex = '0123456789ABCDEF'.split(''),
	        color = '#', i;
	    for (i = 0; i < 6 ; i++) {
	        color = color + hex[Math.floor(Math.random() * 16)];
	    }
	    return color;
	},
	buildGraph : function(data, teamsColors) {
		var graph = document.getElementById("graph"),
			ctx = graph.getContext("2d"),
			years = document.querySelectorAll("#years li"), // To do: generate the elements dinamically relying on json data.
			teams = document.querySelectorAll("#teams li"),
			graphHeight = graph.offsetHeight,
	    	memo = teamsColors || {};

	    for (var i = 0; i < years.length; i++) {

	        // Getting the "year" element coordinates.
	        var year = years[i].firstChild.nodeValue,
	            yearLeftPos = years[i].offsetLeft,
	            yearRightPos = yearLeftPos + years[i].offsetWidth;

	        for (var j = 0; j < teams.length; j++) {        
	            var team = teams[j].firstChild.nodeValue;

	            // Setting one color for each team.
	            !memo[team] && (memo[team] = this.randomColor());

	            if (team == data[year]) {

			        // Getting the "team" element coordinates.
	                var teamLeftPos = teams[j].offsetLeft,
	                	teamRightPos = teamLeftPos + teams[j].offsetWidth;

	                // Initializing graph properties.
	                ctx.fillStyle = memo[team];
	                ctx.globalAlpha = 0.3;

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
	}
};

worldCupChampions.init();
