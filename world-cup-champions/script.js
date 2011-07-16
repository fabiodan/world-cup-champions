// To do: get data via YQL from Wikipedia / Fifa website.
var data = {
    "1930" : "Uruguay",
    "1934" : "Italy",
    "1938" : "Italy",
    "1950" : "Uruguay",
    "1954" : "West Germany",
    "1958" : "Brazil",
    "1962" : "Brazil",
    "1966" : "England",
    "1970" : "Brazil",
    "1974" : "West Germany",
    "1978" : "Argentina",
    "1982" : "Italy",
    "1986" : "Argentina",
    "1990" : "West Germany",
    "1994" : "Brazil",
    "1998" : "France",
    "2002" : "Brazil",
    "2006" : "Italy",
    "2010" : "Spain"
};

var graph = document.getElementById("graph");
var ctx = graph.getContext("2d");

// To do: generate the elements dinamically relying on json data.
var years = document.getElementById("years").getElementsByTagName("li");
var teams = document.getElementById("teams").getElementsByTagName("li");

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
                var teamLeftPos = teams[j].offsetLeft;
                var teamRightPos = teamLeftPos + teams[j].offsetWidth;
    
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

buildGraph(
    data,
    {
        "Brazil" : "green",
        "Italy" : "blue"
    }
);

