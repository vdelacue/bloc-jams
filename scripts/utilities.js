function forEach (array, callback) {
    for (var i = 0; i < array.length; i++) { // first loop over array
       callback(array[i])                    // execute some callback for every item in the array   
    } 
}