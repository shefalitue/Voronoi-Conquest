var Voronoi;
/* Usage: var voronoi = new Voronoi()
		  var faces = voronoi.compute(sites)
		  // The x value of the third point in the second face:
		  var point = faces[1].points[2].x
		  */
		  Voronoi = {

	/* Object used to represent the faces of the voronoi diagram
	 * 
	 * Usage: var face = new Face(points)
     *   	  // The x value of the third point:
     *        var point = face.points[2].x
     * 
     * @param site : the site of the face
     * @param points : the points representing the boundary of the face
     */
     var Cell = function(site, points) {
     	this.site = site
     	this.points = points
     }

	/* Generates the voronoi diagram from the set of sites 
	 * 
	 * @parameter sites : the array of sites from which we want to generate the Voronoi Diagram.
	 * 					  Each element of this array is an object with the pattern
	 						"{x,y}"
	 					  This means that for accesing the x-value of the second site you should do
	 					  	"sites[1].x"
		 	@parameter bbox :  the bounding box, used in order to define the boundaries of the outer
		 	rectangle, which defines the plane in which the points are located. It has the following pattern:
		 	
		 	bbox = {
				xl: 0,
				xr: bounding box width,
				yt: 0,
				yb: bounding box height
			};

	 	@returns an array of Voronoi faces. The points of the face are in counterclockwise order.
	 			 the faces are in the same order as the input sites (face[i] belongs to the site[i])
	 			 */
	 			 compute: function(sites, bbox) {
	 			 	/* TODO */
	 			 }

	//window.alert(5 + 6);
	var p1 = { x: 10, y: 10 };
	var p2 = { x: 5, y: 5 };
	var p3 = { x: 3, y: 7 };

	var edges = []; //initializing an array of all edges in the delaunay triangulation
	var alreadySearched = []; //initializing an array of already searched points
	var sites = []; //initializing an array of sites (voronoi cells)
	var edge ; // referring to each edge in the delaunay triangulation
	var i ; //used inside for loops
	var point ; // to refer to each point in the delaunay triangulation
	var adjacent = [] ; // list of adjacent vertices to a point (vertices that share an edge with this point)


	for(triangle of triangles){ //STEP 1: for each triangle in the triangulation, we call function generateEdges as we want a list of edges in the triangulation
		edges = edges.concat(edges, generateEdges(triangle)); 
	}  // edges (list of all edges) = edges + the_edges(edges of 1 triangle)

    for( i = 0 ; i < edges.length ; i++){ //STEP 2: For each point of each edge, we find its adjacent points. 
    	//Then, we store the point and its adjacent points in site.
    	edge = edges[i]; 
    	if(! contained (alreadySearched , edge.Va)){ // the function contained checks if starting point Va of edge has not already been searched.
    	// If point has already been searched for its adjacent vertices(neighbours), it will be present in the list alreadySearched
    		point = edge.Va;
    		adjacent = getAdjacentPoints (point, edges);
    		alreadySearched.push(point); //since we have already searched for the neighbours of this point, we push it in "already searched their neigbours' list of points.
    		sites.push({ point, adjacent}); // site contains a point and its adjacent vertices
    	}
    	if(! contained (alreadySearched , edge.Vb)){ // just to be safe, to make sure points of all edges of a triangle have been covered
    		point = edge.Vb;
    		adjacent = getAdjacentPoints (point, edges);
    		alreadySearched.push(point); 
    		sites.push({ point, adjacent}); 
    	}
    }



	function generateEdges(triangle){ //to generate all the edges in the delaunay triangulation
		var the_edges = [];
		var Va = triangle[0];  //the point a of triangle abc
		var Vb = triangle[1];  //the point b of triangle abc
		var Vc = triangle[2];  //the point c of triangle abc

		var segment = new Segment();
		segment.setVa(Va);    //adding edge ab of triangle abc
		segment.setVb(Vb);
		the_edges.push(segment);

		segment.setVa(Vb);    //adding edge bc of triangle abc
		segment.setVb(Vc);
		the_edges.push(segment);

		segment.setVa(Vc);    //adding edge ca of triangle abc
		segment.setVb(Va);
		the_edges.push(segment);

		return the_edges;  //the_edges contains the three edges ab, bc and ca of triangle abc
	}

    
	function contained(arr, p){ //checks if point p is present in array arr
        for(i=0 ; i<arr.length ; i++){
        	if( (p.x == arr[i].x) && (p.y == arr[i].y) ) return true;
        	 }
        return false;
	}
	

	function getAdjacentPoints(point , edges){ //to find the adjacent vertices of point from the list of all edges in the triangulation
		var adjPoints = [];

		for(edge of edges){

			if(edge.Va.x==point.x && edge.Va.y==point.y) adjPoints.push(Vb); 
			// if the edge's starting point Va is same as the point being considered, then the ending point Vb of edge(Va,Vb) is adjacent vertice of point.

			else if(edge.Vb.x==point.x && edge.Vb.y==point.y) adjPoints.push(Va);
			// if the edge(Va,Vb)'s ending point Vb is same as point, then its starting point Va is the adjacent vertice of point.

		}

		return adjPoints;
	}


	function compute_bisector(p1, p2) {

		var mid_x = (p2.x + p1.x) / 2 ;  //  p1 and p2 are 2 points, mid_x is the average of their x coordinates
		var mid_y = (p2.y + p1.y) / 2 ;   // mid_y is the average of their y coordinates
		var slope = [(p2.y - p1.y), (p2.x - p1.x)] ; 
	var neg_rec_slope = -slope[1] / slope[0] ; // DOUBT : WHAT IS SLOPE[1]

	/* We use the line formula y = mx + b  to get the value b*/
	var b = mid_y - neg_rec_slope * mid_x ;

	var bisector = {
		slope: neg_rec_slope, //m
		y_axis_cut: b  //b
	};
	document.write(bisector.slope);
	document.write('     ');
	document.write(bisector.y_axis_cut);
	document.write('     ');
	return bisector;
}



function compute_circumcenter(bisector1, bisector2){ // the two bisector lines are y= m1x + b1 and y = m2x + b2

	var circumcenter_x = (bisector2.y_axis_cut - bisector1.y_axis_cut)/(bisector1.slope - bisector2.slope); // x = (b2 - b1)/(m1 - m2)
	var circumcenter_y = ( (bisector1.y_axis_cut * bisector2.slope) - (bisector2.y_axis_cut * bisector1.slope))/(bisector2.slope - bisector1.slope);
    // y= (b1*m2 - b2*m1)/m2-m1

   // var circumcenter = { x: circumcenter_x , y: circumcenter_y , edge1:  ,edge2: , edge3: };
   var circumcenter = { x: circumcenter_x , y: circumcenter_y };
   document.write("circumcenter x: "+circumcenter.x);
   document.write('     ');
   document.write(circumcenter.y);
   document.write('     ');
   return circumcenter;
}

function compute_voronoi(faces){
//for every 2 triangles/faces, check if they have edge in common: which can be checked by checking if they have 2 points in common

for (i = 0; i < faces.length; i++) { 
	for (j = 0; j<i ; j++) { 
		if(faces[i].points[0.x == faces[j].points.x && faces.points[i].y == faces.points[j].y)
	}
}

}

var bisector1 = compute_bisector(p1,p2);
var bisector2 = compute_bisector(p3,p2);
compute_circumcenter(bisector1, bisector2);

}