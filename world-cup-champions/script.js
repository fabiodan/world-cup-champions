
// To do: Refactoring all code in one object with a "init" call. 
function getJson() {
    var head = document.querySelector("head") || document.documentElement,
        script = document.createElement("script");

	// YQL Query. Source: http://en.wikipedia.org/wiki/List_of_FIFA_World_Cup_finals
    script.src = "http://query.yahooapis.com/v1/public/yql?q=select%20content%20from%20html%20where%20url%3D%22http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FList_of_FIFA_World_Cup_finals%22%20and%20xpath%3D'%2F%2Ftable%5B2%5D%2Ftr%2Ftd%5Bposition()%3C3%5D%2Fa'&format=json&callback=formatData";
    head.appendChild(script);
	head.removeChild(script);
}

function formatData(response) {
    var json = response.query.results.a,
        data = {};

    for (var i in json) {
        if (i % 2 == 1) {
            data[json[i - 1]] = json[i];
        } 
    }

	buildGraph(
	    data,
	    {
	        "Brazil" : "green",
	        "Italy" : "blue"
	    }
	);
}

var graph = document.getElementById("graph");
var ctx = graph.getContext("2d");

// To do: generate the elements dinamically relying on json data.
var years = document.querySelectorAll("#years li");
var teams = document.querySelectorAll("#teams li");

/*
 * Random Color Generator
 * http://www.redips.net/javascript/random-color-generator/
 */
function randomColor() {
    var hex = '0123456789ABCDEF'.split(''),
        color = '#', i;
    for (i = 0; i < 6 ; i++) {
        color = color + hex[Math.floor(Math.random() * 16)];
    }
    return color;
}

function buildGraph(data, teamsColors) {
    var memo = teamsColors || {};

    for (var i = 0; i < years.length; i++) {

        // Getting the coordinates.
        var year = years[i].firstChild.nodeValue,
            graphHeight = graph.offsetHeight,
            yearLeftPos = years[i].offsetLeft,
            yearRightPos = yearLeftPos + years[i].offsetWidth;

        for (var j = 0; j < teams.length; j++) {        
            var team = teams[j].firstChild.nodeValue;
            
            // Setting one color for each team.
            !memo[team] && (memo[team] = randomColor());
            
            if (team == data[year]) {
                var teamLeftPos = teams[j].offsetLeft,
                	teamRightPos = teamLeftPos + teams[j].offsetWidth;
    
                // Initializing graph properties.
                ctx.fillStyle = memo[team];
                ctx.globalAlpha = 0.3;
                
                // Drawing graph.
                ctx.beginPath();
                ctx.moveTo(yearLeftPos, 0);
                ctx.lineTo(yearRightPos, 0);
                ctx.quadraticCurveTo(graphHeight/2, graphHeight/2, teamRightPos, graphHeight);
                ctx.lineTo(teamLeftPos, graphHeight);
                ctx.quadraticCurveTo(graphHeight/2, graphHeight/2, yearLeftPos, 0);
                ctx.fill();
            }
        }

        // Debugging.
        /*
        console.log("data[year]: " + data[year]);
        console.log("yearLeft: " + yearLeftPos);
        console.log("yearRight: " + yearRightPos);
        console.log("teamLeft: " + teamLeftPos);
        console.log("teamRight: " + teamRightPos);
        console.log("graphHeight: " + graphHeight);
        console.log(memo);
        */
    }
};

getJson();