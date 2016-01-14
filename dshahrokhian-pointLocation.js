/*!
Copyright (C) 2015 Daniyal Shahrokhian: https://github.com/dshahrokhian
*/
/*
Author: Daniyal Shahrokhian (dani.shahrokhian@gmail.com)
File: dshahrokhian-pointLocation.js
Version: TBA
Date: TBA
Description: This is my personal Javascript implementation of Mulmuley and Seidel point location algorithm.
For further information, refer to "Chapter 6. Point Location" from Computational Geometry by Mark de Berg. 
*/

var PointLocation;

var S;
var D = new Map();
D.nextUniqueId = 0;

var mapSegments = []

/* ## Usage: var bbox = {
		  		xl: {initial x value, e.g. 0},
		  		xr: {bounding box's width},
		  		yt: {initial y value, e.g. 0},
		  		yb: {bounding box's height}
		  	 };
		  	 var pl = new PointLocation(bbox)
		  	 pl.addArea(0, points1)
		  	 pl.addArea(1, points2)

		  	 // returns 0
			 var id = pl.getLocation({some point inside the boundaries of points1})

 */
PointLocation = function(bbox) {

	var trapezoid = new Trapezooid()
						.setSiteId(null)
						.setLeftP({x : 0, y: bbox.yb / 2})
						.setRightP({x : bbox.xr, y: bbox.yb / 2})
						.setLeftTopNeigh(null)
						.setLeftBottomNeigh(null)
						.setRightTopNeigh(null)
						.setRIghtBottomNeigh(null)

	D.add(D.nextUniqueId, trapezoid)
	S = new Leaf(D.nextUniqueID++)

	var Node = function(type) {
		this.type = type
	};

	var XNode = function(xVal, leftChild, rightChild) {
		Node.call(this, "x-node")
		this.xVal = xVal
		this.leftChild = leftChild
		this.rightChild = rightChild
	};

	var YNode = function(segment, topChild, bottomChild) {
		Node.call(this, "y-node")
		this.segment = segment
		this.topChild = topChild
		this.bottomChild = bottomChild
	};

	var Leaf = function(trapId) {
		Node.call(this, "leaf")
		this.trapezoid = trapId
	};

	var Trapezooid = function() {

		setSiteId : function(id) {
			this.siteId = id
			return this
		},

		setLeftTopNeigh : function(trapId) {
			this.leftTopNeigh = trapId
			return this
		}, setLeftBottomNeigh : function(trapId) {
			this.leftBottomNeigh = trapId
			return this
		}, setRightTopNeigh : function(trapId) {
			this.rightTopNeigh = trapId
			return this
		}, setRightBottomNeigh : function(trapId) {
			this.rightBottomNeigh = trapId
			return thisottomNeigh = trapId
		},

		setLeftP : function(point) {
			this.leftp = point
			return this
		}, setRightP : function(point) {
			this.rightp = point
			return this
		}
	};

	var Segment = function() {

		this.degenerate = false

		setVa : function(point) {
			this.va = point
			return this
		}, setVb : function(point) {
			this.vb = point
			return this
		},

		setLeftSiteId : function(id) {
			this.leftSiteId = id
			return this
		},setRightSiteId : function(id) {
			this.rightSiteId = id
			return this
		},

		setDegenerate : function(isDegenerate) {
			this.degenerate = isDegenerate
			return this
		}, isDegenerate : function() {
			return degenerate
		},

		containedIn : function(array) {

			for (segment of array) {

				if (segment.equals(this)) {
					return true
				}
			}

			return false
		},

		equals : function(segment) {

			if (segment.va === this.va && segment.vb === this.vb) {
				return true
			} else if (segment.va === this.vb && segment.vb === this.va) {
				return true
			} else {
				return false
			}
		}
	}

	

	/* Adds a new area to the algorithm
	 * 
	 * @parameter id : identifier of the area, to be returned everytime a query point is contained inside it
	 * @parameter points : the set of points that define the area. Each point must have the object format of
	 * 						"{x,y}" and must be ordered counterclockwise 
	 */
	addArea : function(id, points) {

		var newSegments = processSegments(id,points)
		mapSegments.concat(processSegments(id,points))

		
	},

	/* Computes the location of the query point
	 *
	 * @parameter point : query point, with object format "{x,y}"
	 * 
	 * @return the area identifier containing such point
	 */
	getLocation : function(point) {

		var trapId = gerTrapezoid(point);

		return D.get(trapId).siteId;
	},

	/* Given a point, it calculates in which trapezoid of the map it is located
	 * 
	 * @parameter point query point, with object format "{x,y}"
	 *
	 * @return id of the trapezoid in which the point is contained
	 */ 
	getTrapezoid : function(point) {
		
		var node = S

		while(node.type != "leaf") {

			node = getNextNode(point, node)
		}

		return node.trapezoid;
	},

	/* Given a point and a segments, determines in which side of the segment such point is located
	 * 
	 * @param point : query point
	 * @param segment : query segment
	 * 
	 *	@return	1 if the point is on the left side of the segment
	 *			0 if the point is on the segment
	 *  		-1 if the point is on the right side of the segment
	 */
	positionFromSegment : function(point, segment) {

		var pa = segment.va
		var pb = segment.vb

		var determinant = (pb.x - pa.x) * (point.y - pa.y) - (pb.y - pa.y) * (point.x - pa.x) 

		return Math.sign(determinant)
	},

	/* @return the identifiers of the trapezoids that the segment intersects */
	getIntersectedTrapezoids : function(segment) {
		
		var trapezoids = []

		var nodeA = S

		while (nodeA.type != "leaf") {
			
			var nextNode = getNextNode(segment.va, nodeA);

			/* If the first point of the segment was in the line, we use the second instead. If the map
				was given properly, this could only happen between segments sharing one point. We use the
				second point since it allows us to know in which direction the segment is going, and selecting
				the proper next trapezoid according to this direction.
			*/
			if (nextNode.trapezoid == -1) {
				nodeA = getNextNode(segment.vb, nodeA)
			} else {
				nodeA = nextNode;
			}
		}

		trapezoids.push(nodeA.trapezoid)

		nodeB = S

		while (nodeB.type != "leaf") {
			nodeB = getNextNode(segment.vb, nodeB)
		}

		if (nodeA.trapezoid == nodeB.trapezoid) { // The segments fits into one trapezoid
			// TODO
		}
	},

	getNextNode : function(point, node) {

		var nextNode = node;

		if (node.type == "x-node") {
			nextNode = ((point.x < node.xVal) ? node.leftChild : node.rightChild);
		} else if (node.type == "y-node") {

			var pos = positionFromSegment(point, node.segment)

			switch(pos) {
				case 1:
				nextNode = node.topChild; 
				break;
				case 0:
				nextNode = new Leaf(-1);
				case -1:
				nextNode = node.bottomChild;
			}
		}

		return nextNode;
	},

	/* Processes segments of the points of the polygon. If some of the segments area already present
	 * in mapSegments, they are modified online.
	 *
	 * @parameter id : identifier of the polygon
	 * @parameter points : points defining the polygon, in counterclockwise order
	 *
	 * @return new segments non-present in mapSegments
	 */
	processSegments : function(id, points) {

		var segments = []

		for (var i = 0; i < points.length - 1; i++) {

			var segment = new Segment()
						.setVa(points[i])
						.setVb(points[i+1])
			
			fix(segment)

			if (!segment.containedIn(mapSegments)) {
				segments.push(segment)
			}
			
		}

		return segments
	},

	/* Fixes the given segments, according to the following rules:
	 * 1. x-value of segment.pa must be lower than segment.pb
	 * 2. if the segment is not present in mapSegments, then it must be created and its left-site is associated 
	 		to the site of polygon being analyzed
	 * 3. if the segment is present in mapSegments, its right-site is associated to the site of the polygon being
	 		analyzed
	 */
	fix : function(id, segment) {

		if (segment.containedIn(mapSegments)) {

			var index = getIndex(segment, mapSegments)
			segment = mapSegments[index]
			segment.setRightSiteId(id)

		} else {

			segment.setLeftSiteId(id)

			if (segment.va.x > segment.vb.x) {

				rotate(segment)

			} else if (segment.va.x === segment.vb.x) {

				segment.vb.x++
				segment.setDegenerate(true)

			}
		}

	},

	rotate : function(segment) {

		var tempPoint = {x: segment.va.x, y: segment.va.y}
		var tempSite = segment.leftSiteId

		segment.setVa(segment.vb)
			   .setVb(tempPoint)
			   .setLeftSiteId(segment.rightSiteId)
			   .setRightSiteId(tempSite)
	},

	getIndex : function(segment, array) {

		index = -1;

		for (var i = 0; (i < array.length) && (index == -1); i++) {

			if (segment.equals(array[i])) {
				index = i
			}
		}

		return index;
	}
}