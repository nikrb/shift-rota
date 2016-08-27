var arr = [
  ["one", "two"],
  ["three", "four"]
];

var b = [];
arr.forEach( function( ar){
  ar.forEach( function( a){
    b.push( a);
  });
});

console.log( b);
