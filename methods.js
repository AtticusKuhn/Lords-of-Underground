function array_frequency(arr){
    //var arr = [5, 5, 5, 2, 2, 2, 2, 2, 9, 4];
    var counts = {};

    for (var i = 0; i < arr.length; i++) {
    var num = arr[i];
    counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    return counts
}
function remove_n(array , thing, amount){
    for(i=0;i<array.length;i++){
        if(array[i] == thing && amount){
            array.splice(i, 1);
            amount--
        }
    }
}

module.exports ={
    array_frequency,
    remove_n
}