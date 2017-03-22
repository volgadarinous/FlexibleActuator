var data = [0,1,2,3,4,5,6,7];
var svg;

var farr = [0.001];
for(f=0.001; f<1000; f=f+0.0005)
  farr.push(f);


var margin = {top: 260, right: 10, bottom: 20, left: 10},
    width = $(".plots").width()-margin.left-margin.right, 
    height = $(".plots").height()-margin.bottom- 20;


var svg = d3.select(".plots").append("svg")
      .attr("width", width)
      .attr("height",height);


var x = d3.scaleLinear()
          .domain([0,d3.max(farr)+10])
          .range([0, (width)]);

var y = d3.scaleLinear()
//          .domain([0,10*d3.max(data)])
          .range([height-margin.bottom, 0]);

y.domain(d3.extent(farr, function(d) { return 2*d; }));
// x.domain([0,7]);//d3.extent(data, function(d,i) { return i; })); //hardcode these
// y.domain([0,7]);//d3.extent(data, function(d,i { return i; })); //hardcode these
//var x = d3.scaleLinear().range([0, width]);

//var y = d3.scaleLinear()
//    .rangeRound([height, 0]);


var line = d3.line()
             .x(function(d) { return x(d)+20; })
             .y(function(d) { return y(10*d); });

/*d3.tsv("data.tsv", function(d) {
  d.date = parseTime(d.date);
  d.close = +d.close;
  return d;
}, function(error, data) {
  if (error) throw error;*/

 // x.domain(d3.extent(data, function(d,i) { return i; })); //hardcode these
 // y.domain(d3.extent(data, function(d,i { return i; })); //hardcode these

  var xaxis = svg.append("g")
      .attr("transform", "translate(20,"+(height-margin.bottom)+")")
      .call(d3.axisBottom(x));
      
   svg.append("text")
    .attr("class", "coord-label")
    .attr("x", width)
    .attr("y", height-margin.bottom)
    .style("text-anchor", "end")
    .text("W");//append label for x axis
    // .style("font-size", "16px")
    // .attr("font-weight", "bold");


  var yAxis = d3.axisLeft(y);
  d3.select('svg').append('g')
    .attr('transform', "translate(20,0)")
   // .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Z(jw)")
    .classed('y axis', true)
    .call(yAxis);

  // var yaxis = svg.append("g")
  //     .call(d3.axisLeft(y))
  //     .append("text")
  //     .attr("fill", "#000")
  //     .attr("transform", "translate(10,"+(height-margin.bottom)+")")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", "0.71em")
  //     .attr("text-anchor", "end")
  //     .text("Z(jw)");

     // yaxis.tickFormat(function(d){
     //        if (d == 0){return "";} else {return d;}});

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);

