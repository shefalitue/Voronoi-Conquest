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

			 	D.add(trapezoid.id, trapezoid)
			 	S = new Leaf(trapezoid.id)

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

			 		this.id = D.nextUniqueId++

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
	 	mapSegments.concat(newSegments)

	 	for (segment of newSegments) {
	 		recomputeMap(segment, getIntersectedTrapezoids(segment));
	 	}
	 },

	 /* Given a new segment on the map, it recomputes D and S.
	  * For each intersected trapezoid, it replaces it by 2 to 4 new ones.
	  *
	  * The code is divided in three sections: One for the first intersected trapezoid, another
	  *	for the trapezoids in between, and a last one for the last intersected trapezoid.
	  * 
	  * If the segment intersects only one trapezoid, it can have the following format, being a[0]
	  * and a[3] optional depending whenever the new segments shares one or both end-points with
	  * the trapezoid it intersects:
	  *
	  * _____________________
	  * |      | a[1] |      |  *Note: "------"" is the segment
	  * | a[0] |------| a[3] |
	  * |      | a[2] |      |
	  * |______|______|______|
	  *
	  * If there are more intersected trapezoids, a[1] and a[2] are repeated once for every inner-trapezoid
	  *
	  * @param segment : new segment to be computed for the map
	  * @param interTraps : trapezoids in the current map that are intersected by such segment
	  */
	  recomputeMap : function(segment, interTraps) {

	 	// Section 1
	 	var startTrap = D.get(interTraps[0])
	 	var a = [null, null, null, null]

	 	a[1] = new Trapezoid()
	 	.setSiteId(segment.leftSiteId)
	 	.setLeftP(segment.va)
	 	.setRightP(segment.vb)
	 	.setLeftTopNeigh(startTrap.leftTopNeigh)
	 	.setLeftBottomNeigh(startTrap.leftTopNeigh)
	 	.setRightTopNeigh(startTrap.rightTopNeigh)
	 	.setRightBottomNeigh(startTrap.rightTopNeigh)

	 	a[2] = new Trapezoid()
	 	.setSiteId(segment.rightSiteId)
	 	.setLeftP(segment.va)
	 	.setRightP(segment.vb)
	 	.setLeftTopNeigh(startTrap.leftBottomNeigh)
	 	.setLeftBottomNeigh(startTrap.leftBottomNeigh)
	 	.setRightTopNeigh(startTrap.rightBottomNeigh)
	 	.setRightBottomNeigh(startTrap.rightBottomNeigh)

	 	if (segment.va.x > startTrap.leftp.x) {
	 		
	 		a[0] = new Trapezoid()
	 		.setLeftP(startTrap.leftp)
	 		.setRightP(segment.va)
	 		.setLeftTopNeigh(startTrap.leftTopNeigh)
	 		.setLeftBottomNeigh(startTrap.leftBottomNeigh)
	 		.setRightTopNeigh(a[1].id)
	 		.setRightBottomNeigh(a[2].id)

	 		a[1].setLeftTopNeigh(a[0].id)
	 		.setLeftBottomNeigh(a[0].id)

	 		a[2].setLeftTopNeigh(a[0].id)
	 		.setLeftBottomNeigh(a[0].id)
	 	}

	 	if (segment.vb.x < startTrap.rightp.x) {
	 		
	 		a[3] = new Trapezoid()
	 		.setLeftP(segment.vb)
	 		.setRightP(startTrap.rightp)
	 		.setRighttTopNeigh(startTrap.rightTopNeigh)
	 		.setRightBottomNeigh(startTrap.rightBottomNeigh)
	 		.setLeftTopNeigh(a[1].id)
	 		.setLeftBottomNeigh(a[2].id)

	 		a[1].setRightTopNeigh(a[3].id)
	 		.setRightBottomNeigh(a[3].id)

	 		a[2].setRightTopNeigh(a[3].id)
	 		.setRightBottomNeigh(a[3].id)
	 	}

	 	updateS(startTrap, a, segment)
	 	updateD(startTrap, a)

	 	if (interTraps.length > 1) {

	 		// Section 2
	 		var innerTrap = startTrap

	 		// Save these values since they will be needed after overwritting them
	 		var prevTrapTop = a[1]
	 		var prevTrapBottom = a[2]

	 		a[0] = a[3] = null // Restart these values, since they will not occur in inner-trapezoids
	 		for(var i = 1; i < interTraps.length - 1; i++) {

	 			innerTrap = D.get(interTraps[i])
	 			
	 			a[1] = new Trapezoid()
	 			.setSiteId(segment.leftSiteId)
	 			.setLeftP(getIntersection(segment, innerTrap.leftp.x))
	 			.setRightP(getIntersection(segment, innerTrap.rightp.x))
	 			.setLeftTopNeigh(prevTrapTop.id)
	 			.setLeftBottomNeigh(prevTrapTop.id)
	 			.setRightTopNeigh(innerTrap.rightTopNeigh)
	 			.setRightBottomNeigh(innerTrap.rightTopNeigh)

	 			a[2] = new Trapezoid()
	 			.setSiteId(segment.rightSiteId)
	 			.setLeftP(getIntersection(segment, innerTrap.leftp.x))
	 			.setRightP(getIntersection(segment, innerTrap.rightp.x))
	 			.setLeftTopNeigh(prevTrapBottom.id)
	 			.setLeftBottomNeigh(prevTrapBottom.id)
	 			.setRightTopNeigh(innerTrap.rightBottomNeigh)
	 			.setRightBottomNeigh(innerTrap.rightBottomNeigh)

	 			// Refresh values for the next trapezoid
	 			prevTrapTop = a[1]
	 			prevTrapBottom = a[2]

	 			updateS(innerTrap, a, segment)
	 			updateD(innerTrap, a)
	 		}

	 		// Section 3
	 		var endTrap = D.get(interTraps[interTraps.length-1])

	 		a[0] = a[3] = null

	 		a[1] = new Trapezoid()
	 		.setSiteId(segment.leftSiteId)
	 		.setLeftP(getIntersection(segment, endTrap.leftp.x))
	 		.setRightP(segment.vb)
	 		.setLeftTopNeigh(prevTrapTop.id)
	 		.setLeftBottomNeigh(prevTrapTop.id)
	 		.setRightTopNeigh(endTrap.rightTopNeigh)
	 		.setRightBottomNeigh(endTrap.rightTopNeigh)

	 		a[2] = new Trapezoid()
	 		.setSiteId(segment.rightSiteId)
	 		.setLeftP(getIntersection(segment, endTrap.leftp.x))
	 		.setRightP(segment.vb)
	 		.setLeftTopNeigh(prevTrapBottom.id)
	 		.setLeftBottomNeigh(prevTrapBottom.id)
	 		.setRightTopNeigh(endTrap.rightBottomNeigh)
	 		.setRightBottomNeigh(endTrap.rightBottomNeigh)

	 		if (segment.vb.x < endTrap.rightp.x) {

	 			a[3] = new Trapezoid()
	 			.setLeftP(segment.vb)
	 			.setRightP(endTrap.rightp)
	 			.setRighttTopNeigh(endTrap.rightTopNeigh)
	 			.setRightBottomNeigh(endTrap.rightBottomNeigh)
	 			.setLeftTopNeigh(a[1].id)
	 			.setLeftBottomNeigh(a[2].id)

	 			a[1].setRightTopNeigh(a[3].id)
	 			.setRightBottomNeigh(a[3].id)

	 			a[2].setRightTopNeigh(a[3].id)
	 			.setRightBottomNeigh(a[3].id)
	 		}

	 		updateS(endTrap, a, segment)
	 		updateD(endTrap, a)	 		
	 	}
	 	
	 },

	 /* Updates tree S according to the new trapezoids that will substitute the old one
	  *
	  * @param oldTrap : Trapezoid to be replaced
	  * @param newTraps : new trapezoids that will replace the old one. The format of this array
	  * follows the intersection possibilites. This means that a[0] and/or a[3] may be null.
	  */ 
	  updateS : function(oldTrap, newTraps, segment) {

	  	var pi = qi = null

	  	var si = new YNode(segment, newTraps[1].id, newTraps[2].id)

	  	if (newTraps[3] != null) {	
	  		qi = new XNode(newTraps[3].leftp.x, si, new Leaf(newTraps[3].id))
	  	}

	  	if (newTraps[0] != null) {
	  		pi = new XNode(newTraps[0].rightp.x, new Leaf(newTraps[0].id), qi)
	  	}

	  	if (pi != null) {
	  		substituteLeaf(oldTrap, pi)
	  	} else if (qi != null) {
	  		substituteLeaf(oldTrap, qi)
	  	} else {
	  		substituteLeaf(oldTrap, si)
	  	}
	  },

	 /* Updates map D according to the new trapezoids that will substitute the old one
	  *
	  * @param oldTrap : Trapezoid to be removed
	  * @param newTraps : Trapezoids to be added
	  */ 
	  updateD : function(oldTrap, newTraps) {

	  	for (trapezoid of newTraps) {
	  		if (trapezoid != null)
	  			D.add(trapezoid.id, trapezoid)
	  	}

	  	D.remove(oldTrap.id)
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
	 * @return leaf node with the trapezoid in which the point is contained
	 */ 
	 getLeaf : function(trapezoid) {

	 	var node = S
	 	var point = trapezoid.leftp

	 	while(node.type != "leaf") {

	 		if (node.type == "x-node") {
	 			node = ((point.x < node.xVal) ? node.leftChild : node.rightChild);
	 		} else if (node.type == "y-node") {

	 			var pos = positionFromSegment(point, node.segment)

	 			switch(pos) {
	 				case 1:
	 				node = node.topChild; 
	 				break;
	 				case 0:
	 				node = ((node.topChild.trapezoid == trapezoid.id) ? node.topchild : node.bottomChild)
	 				break;
	 				case -1:
	 				node = node.bottomChild;
	 			}
	 		}
	 	}

	 	return node;
	 },

	 substituteLeaf : function(trapezoid, newNode) {

	 	var node = S
	 	var point = trapezoid.leftp

	 	var nextNode;
	 	while(nextNode.type != "leaf") {	

	 		if (node.type == "x-node") {

	 			if (point.x < node.xVal) {
	 				
	 				nextNode = node.leftChild

	 				if (nextNode.type == "leaf") {
	 					node.leftChild = newNode
	 				}

	 			} else {

	 				nextNode = node.rightChild

	 				if (nextNode.type == "leaf") {
	 					node.rightChild = newNode
	 				}
	 			}

	 		} else if (node.type == "y-node") {

	 			var pos = positionFromSegment(point, node.segment)

	 			switch(pos) {
	 				case 1:
	 				nextNode = node.topChild;
	 				if (nextNode.type == "leaf") {
	 					node.topChild = newNode
	 				}
	 				break;
	 				
	 				case 0:
	 				if (node.topChild.trapezoid == trapezoid.id) {

	 					nextNode = node.topChild

	 					if (nextNode.type == "leaf") {
	 						node.topChild = newNode
	 					}

	 				} else{
	 					nextNode = node.bottomChild

	 					if (nextNode.type == "leaf") {
	 						node.bottomChild = newNode
	 					}
	 				}
	 				break;
	 				
	 				case -1:
	 				nextNode = node.bottomChild;
	 				if (nextNode.type == "leaf") {
	 					node.bottomChild = newNode
	 				}
	 			}
	 		}
	 	}
	 },

	/* Given a point and a segment, determines in which side of the segment such point is located
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

			// If the first point of the segment was in the line, we use the second instead. If the map
			//	was given properly, this could only happen between segments sharing an end-point. We use the
			//	second point since it allows us to know in which direction the segment is going, and selecting
			//	the proper next trapezoid according to this direction.
			if (nextNode.trapezoid === -1) {
				nodeA = getNextNode(segment.vb, nodeA)
			} else {
				nodeA = nextNode;
			}
		}

		trapezoids.push(nodeA.trapezoid)

		var currentTrapId = nodeA.trapezoid
		var currentTrap = D.get(currentTrapId)
		while (segment.vb.x > currentTrap.rightp) {

			var position = positionFromSegment(currentTrap.rightp, segment)

			if (position === 1) {
				currentTrapId = currentTrap.rightTopNeigh
			} else if (position === -1) {
				currentTrapId = currentTrap.rightBottomNeigh
			}

			trapezoids.push(currentTrapId)
			currentTrap = D.get(currentTrapId)
		}

		return trapezoids;
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
	 *		to the site of polygon being analyzed
	 * 3. if the segment is present in mapSegments, its right-site is associated to the site of the polygon being
	 *		analyzed
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
	 },

	 /* Given a segment and a vertical line, calculates the point in which they intersect
	  *
	  * @param segment
	  * @param xVal = 'x' coordinate of the vertical line
	  * 
	  * @return the point from the intersection of the segment with the vertical line
	  */
	  getIntersection: function(segment, xVal) {

	  	var slope = (segment.vb.y - segment.va.y) / (segment.vb.x - segment.va.x)

	  	/* We use the line formula y = mx + b  to get the value b*/
	  	var b = segment.va.y - slope * segment.va.x

	  	return {x: xVal, y: slope * xVal + b }
	  }
	}