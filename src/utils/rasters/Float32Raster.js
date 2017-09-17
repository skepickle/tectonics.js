
// Float32Raster represents a grid where each cell contains a 32 bit floating point value
// A Float32Raster is composed of two parts:
// 		The first is a object of type Grid, representing a collection of vertices that are connected by edges
//  	The second is a typed array, representing a value for each vertex within the grid
// 
// Float32Raster should theoretically work for any graph of vertices given the appropriate grid object,
// However tectonics.js only uses them with spherical grids.
// 
// Float32Rasters can be viewed through several paradigms: vector calculus, math morphology, image editing, etc.
// Each paradigm has its own unique set of operations that it can perform on rasters objects.
// A developer needs to switch between paradigms effortlessly and efficiently, without type conversion.
// Rather than clutter the Float32Raster class, operations on Float32Rasters 
// are spread out as friend functions across several namespaces. Each namespace corresponds to a paradigm. 
// This design is meant to promote separation of concerns at the expense of encapsulation.
// I want raster objects to be as bare as possible, functioning more like primitive datatypes.

function Float32Raster(grid, fill) {
	var result = new Float32Array(grid.vertices.length);
	result.grid = grid;
	if (fill !== void 0) { 
	for (var i=0, li=result.length; i<li; ++i) {
	    result[i] = fill;
	}
	}
	return result;
};
Float32Raster.OfLength = function(length, grid) {
	var result = new Float32Array(length);
	result.grid = grid;
	return result;
}
Float32Raster.FromUint8Raster = function(raster) {
  var result = Float32Raster(raster.grid);
  for (var i=0, li=result.length; i<li; ++i) {
      result[i] = raster[i];
  }
  return result;
}
Float32Raster.FromUint16Raster = function(raster) {
  var result = Float32Raster(raster.grid);
  for (var i=0, li=result.length; i<li; ++i) {
      result[i] = raster[i];
  }
  return result;
}
Float32Raster.copy = function(field, result) {
  var result = result || Float32Raster(field.grid);
  for (var i=0, li=field.length; i<li; ++i) {
      result[i] = field[i];
  }
  return result;
}
Float32Raster.fill = function (field, value) {
  for (var i = 0, li = field.length; i < li; i++) {
    field[i] = value;
  }
};

Float32Raster.min_id = function (field) {
  var max = Infinity;
  var max_id = 0;
  var value = 0;
  for (var i = 0, li = field.length; i < li; i++) {
    value = field[i];
    if (value < max) {
      max = value;
      max_id = i;
    };
  }
  return max_id;
};

Float32Raster.max_id = function (field) {
  var max = -Infinity;
  var max_id = 0;
  var value = 0;
  for (var i = 0, li = field.length; i < li; i++) {
    value = field[i];
    if (value > max) {
      max = value;
      max_id = i;
    };
  }
  return max_id;
};

Float32Raster.get_nearest_value = function(field, pos) {
  return field[field.grid.getNearestId(pos)];
}
Float32Raster.get_nearest_values = function(value_field, pos_field, result) {
  result = result || Float32Raster(pos_field.grid);
  var ids = pos_field.grid.getNearestIds(pos_field);
  for (var i=0, li=ids.length; i<li; ++i) {
      result[i] = value_field[ids[i]];
  }
  return result;
}
Float32Raster.get_ids = function(value_field, id_array, result) {
  result = result || (id_array.grid !== void 0? Float32Raster(id_array.grid) : Float32Array(id_array.length));
  for (var i=0, li=id_array.length; i<li; ++i) {
      result[i] = value_field[id_array[i]];
  }
  return result;
}
Float32Raster.get_mask = function(raster, mask) {
  var result = new Float32Array(Uint8Dataset.sum(mask));
  for (var i = 0, j = 0, li = mask.length; i < li; i++) {
    if (mask[i] > 0) {
      result[j] = raster[i];
      j++;
    }
  }
  return result;
}
Float32Raster.set_ids_to_value = function(field, id_array, value) {
  for (var i=0, li=id_array.length; i<li; ++i) {
      field[id_array[i]] = value;
  }
  return field;
}
Float32Raster.set_ids_to_values = function(field, id_array, value_array) {
  for (var i=0, li=id_array.length; i<li; ++i) {
      field[id_array[i]] = value_array[i];
  }
  return field;
}