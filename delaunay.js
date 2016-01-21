var Delaunay;

/* Usage: var delaunay = new Delaunay()
		  var triangles = delaunay.compute(sites)
		  // The x value of the third point in the second triangle:
		  var point = triangles[1].points[2].x
 */
Delaunay = {

	/* Object used to represent the triangles form the Delaunay Triangulation
 	 * 
	 * Usage: var triangle = new Triangle(points)
	 *		  // The x value of the third point:
	 *		  var point = triangle.p3.x 
	 */
	Triangle = function(points) {
		this.p1 = points[0]
		this.p2 = points[1]
		this.p3 = points[2]
	}

	/* Generates the delaunay triangulation from the set of sites 
	 * 
	 * @parameter sites : the array of sites from which we want to generate the Delaunay Triangulation.
	 * 					  Each element of this array is an object with the pattern
	 						"{x,y}"
	 					  This means that for accesing the x-value of the second site you should do
	 					  	"sites[1].x"
	 	@returns an array of Delaunay triangles. The points of the triangle are in counterclockwise order.
	 */
	compute: function(sites) {
		/* TODO */
	}
}