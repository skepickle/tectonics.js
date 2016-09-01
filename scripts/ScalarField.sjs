'use strict';

// The ScalarField namespace provides operations over mathematical scalar fields.
// It should theoretically work for any manifold or coordinate system given the appropriate geometry,
// However it is only intended for use with spheres 
// It performs mathematical operations that are common to fields
var ScalarField = {}
ScalarField.TypedArray = function(grid){
	return new Float32Array(grid.vertices.length);
}
ScalarField.VertexTypedArray = function(grid){
	return new Float32Array(grid.vertices.length);
}
ScalarField.EdgeTypedArray = function(grid){
	return new Float32Array(grid.edges.length);
}
ScalarField.ArrowTypedArray = function(grid){
	return new Float32Array(grid.arrows.length);
}
ScalarField.TypedArrayOfLength = function(length){
	return new Float32Array(length);
}
ScalarField.add_field = function(field1, field2, result) {
	result = result || new Float32Array(field1.length);

	tensor result[i] = field1[i] + field2[i];

	return result;
};
ScalarField.sub_field = function(field1, field2, result) {
	result = result || new Float32Array(field1.length);

	tensor result[i] = field1[i] - field2[i];

	return result;
};
ScalarField.mult_field = function(field1, field2, result) {
	result = result || new Float32Array(field1.length);

	tensor result[i] = field1[i] * field2[i];

	return result;
};
ScalarField.div_field = function(field1, field2, result) {
	result = result || new Float32Array(field1.length);

	tensor result[i] = field1[i] / field2[i];

	return result;
};

ScalarField.add_scalar = function(field, scalar, result) {
	result = result || new Float32Array(field.length);

	tensor result[i] = field[i] + scalar;

	return result;
};
ScalarField.sub_scalar = function(field, scalar, result) {
	result = result || new Float32Array(field.length);

	tensor result[i] = field[i] - scalar;

	return result;
};
ScalarField.mult_scalar = function(field, scalar, result) {
	result = result || new Float32Array(field.length);

	tensor result[i] = field[i] * scalar;

	return result;
};
ScalarField.div_scalar = function(field, scalar, result) {
	result = result || new Float32Array(field.length);

	tensor result[i] = field[i] / scalar;

	return result;
};


// minimum value within the field
ScalarField.min = function(field) {
	var min = Infinity;

	var value;
	tensor {
		value = field[i];
		if (value < min) min = value;
	}

	return min;
};
// maximum value within the field
ScalarField.max = function(field) {
	var max = -Infinity;

	var value;
	tensor {
		value = field[i];
		if (value > max) max = value;
	}
	return max;
};

// ∂X
ScalarField.arrow_differential = function(field, grid, result) {
	result = result || ScalarField.ArrowTypedArray(grid);

	var arrows = grid.arrows;
	var arrow = [];
	tensor {
		arrow = arrows[i];
		result[i] = field[arrow[1]] - field[arrow[0]];
	}
	return result;
}

// ∂X
ScalarField.edge_differential = function(field, grid, result) {
	result = result || ScalarField.EdgeTypedArray(grid);

	var edges = grid.edges;
	var edge = [];
	tensor {
		edge = edges[i];
		result[i] = field[edge[1]] - field[edge[0]];
	}
	return result;
}

// ∂X
ScalarField.vertex_differential = function(field, grid, result){
	result = result || VectorField.VertexDataFrame(grid);

	var dpos = grid.pos_arrow_differential;

	var arrows = grid.arrows;
	var arrow = [];
	var from = 0, to = 0;

	var x = result.x;
	var y = result.y;
	var z = result.z;

	tensor {
	    arrow = arrows[i];
	    from = arrow[0];
	    to = arrow[1];
	    x[to] += (field[from] - field[to] );
	    y[to] += (field[from] - field[to] );
	    z[to] += (field[from] - field[to] );
	}

	var neighbor_lookup = grid.neighbor_lookup;
	var neighbor_count = 0;
	tensor {
	    neighbor_count = neighbor_lookup[i].length;
	    x[i] /= neighbor_count || 1;
	    y[i] /= neighbor_count || 1;
	    z[i] /= neighbor_count || 1;
	}

	return result;
}

// ∇X
ScalarField.edge_gradient = function(field, grid, result){
	result = result || VectorField.EdgeDataFrame(grid);

	var dfield = 0;
	var dpos = grid.pos_edge_differential;
	var dx = dpos.x;
	var dy = dpos.y;
	var dz = dpos.z;

	var x = result.x;
	var y = result.y;
	var z = result.z;

	var edges = grid.edges;
	var edge = [];
	tensor {
	    edge = edges[i];
		dfield = field[edge[1]] - field[edge[0]];
	    x[i] = ( dfield / dx[i] ) || 0;
	    y[i] = ( dfield / dy[i] ) || 0;
	    z[i] = ( dfield / dz[i] ) || 0;
	}
	return result;
}

// ∇X
ScalarField.arrow_gradient = function(field, grid, result){
	result = result || VectorField.ArrowDataFrame(grid);

	var dfield = 0;
	var dpos = grid.pos_arrow_differential;
	var dx = dpos.x;
	var dy = dpos.y;
	var dz = dpos.z;

	var x = result.x;
	var y = result.y;
	var z = result.z;

	var arrows = grid.arrows;
	var arrow = [];
	tensor {
	    arrow = arrows[i];
		dfield = field[arrow[1]] - field[arrow[0]];
	    x[i] = ( dfield / dx[i] ) || 0;
	    y[i] = ( dfield / dy[i] ) || 0;
	    z[i] = ( dfield / dz[i] ) || 0;
	}
	return result;
}

// ∇X
ScalarField.vertex_gradient = function(field, grid, result){
	result = result || VectorField.VertexDataFrame(grid);

	var dfield = 0;
	var dpos = grid.pos_arrow_differential;
	var dx = dpos.x;
	var dy = dpos.y;
	var dz = dpos.z;

	var arrows = grid.arrows;
	var arrow = [];

	var x = result.x;
	var y = result.y;
	var z = result.z;

	tensor {
	    arrow = arrows[i];
	    dfield = field[arrow[1]] - field[arrow[0]];
	    x[arrow[0]] += ( dfield / dx[i] ) || 0;
	    y[arrow[0]] += ( dfield / dy[i] ) || 0;
	    z[arrow[0]] += ( dfield / dz[i] ) || 0;
	}

	var neighbor_lookup = grid.neighbor_lookup;
	var neighbor_count = 0
	tensor {
	    neighbor_count = neighbor_lookup[i].length;
	    x[i] /= neighbor_count || 1;
	    y[i] /= neighbor_count || 1;
	    z[i] /= neighbor_count || 1;
	}

	return result;
}

// ∂⋅∇X
// can be thought of as the similarity between neighbors
ScalarField.edge_gradient_similarity = function(field, grid, result) {
	result = result || ScalarField.EdgeTypedArray(grid);

	var gradient = ScalarField.vertex_gradient(field, grid);

	VectorField.edge_similarity(gradient, grid, result);

	return result;
}

// ∂⋅∇X
// can be thought of as the similarity between neighbors
ScalarField.arrow_gradient_similarity = function(field, grid, result) {
	result = result || ScalarField.ArrowTypedArray(grid);

	var gradient = ScalarField.vertex_gradient(field, grid);

	VectorField.arrow_similarity(gradient, grid, result);

	return result;
}

// ∇⋅∇X, A.K.A. ∇²X
// can be thought of as the difference between neighbors
ScalarField.edge_laplacian = function(field, grid, result) {
	result = result || ScalarField.EdgeTypedArray(grid);

	var gradient = ScalarField.vertex_gradient(field, grid);

	VectorField.edge_divergence(gradient, grid, result);

	return result;
}

// ∇⋅∇X, A.K.A. ∇²X
// can be thought of as the difference between neighbors
ScalarField.arrow_laplacian = function(field, grid, result) {
	result = result || ScalarField.ArrowTypedArray(grid);

	var gradient = ScalarField.vertex_gradient(field, grid);

	VectorField.arrow_divergence(gradient, grid, result);

	return result;
}