// Interface vars
var bboxWidth = 800
var	bboxHeight = 600

var	
bbox = {
	xl: 0,
	xr: this.bboxWidth,
	yt: 0,
	yb: this.bboxHeight
};

var colors = ["aqua","red"]

// Core vars
var	sites = []

var	voronoi
var	svg

// Game vars
var nTurns = 10
var currentTurn = 1

var VoronoiGame = {

	init: function() {

		voronoi = new Voronoi()

		// Game box
		svg = d3.select("body")
		.append("svg")
		.attr("width", window.bboxWidth)
		.attr("height", window.bboxHeight)
		.attr("style", "cursor:crosshair")
		.attr("border", 0)
		.on("click", function() {

			var coordinates = d3.mouse(this)
			VoronoiGame.addSite(coordinates)

			if (++currentTurn > nTurns) {

				alert("Game over")
			}
		})

		svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", window.bboxWidth)
		.attr("height", window.bboxHeight)	
		.style("stroke", "black")
		.style("fill", "none")
		.style("stroke-width", 0);
	},

	addSite: function(coordinates) {

		var xVal = coordinates[0]
		var yVal = coordinates[1]
		
		sites.push({x: xVal, y: yVal})
		this.recompute(sites)
	},

	recompute : function(sites) {

		// Clear svg
		svg.selectAll("line").remove()

		// Recompute the diagram and draw it
		this.drawSites(sites)
		var diagram = window.voronoi.compute(sites, window.bbox)
		this.drawEdges(diagram.edges)
	},

	drawSites : function(sites) {

		for(var i = 0; i < sites.length; i++) {
			
			var site = sites[i]

			svg.append("circle")
			.attr("cx",site.x)
			.attr("cy",site.y)
			.attr("r", 4)
			.attr("fill", colors[i%2]	)
		}
	},

	drawEdges : function(edges) {

		for(var i = 0; i < edges.length; i++) {

			var edge = edges[i];

			svg.append("line")
			.attr("x1", edge.va.x)
			.attr("y1", edge.va.y)
			.attr("x2", edge.vb.x)
			.attr("y2", edge.vb.y)
			.attr("stroke", "white")
			.attr("stroke-width", 2)
		}
	}
}