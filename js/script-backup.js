
var svg;
var range_id = [];//,"pdeot-eleconductivity-max"];

/*Initialize Parameters*/
var al= Math.pow(10, -10),//1E-10; //strain to charge ratio
Cv=5*Math.pow(10,7),// 5E7;  //Volumetric capacitance [F/m]
Es= Math.pow(10,6), // 1E6; // Young's modulus of the SPE layer
Ep= 500*Math.pow(10,6), //500E6; //Young's modulus of the PEDOT layer
sigi=0.02, // ionic conductivity of PEDOT [s/m]
sigs=0.08, // ionic conductivity of SPE
sige= 6000, // electronic conductivity of PEDOT [s/m]
w= 300*Math.pow(10,-6), //300e-6; //Width of the sample
L= 3000*Math.pow(10,-6), //3000e-6; //length of the sample
A=w*L,  // area = width x length
hp= 4*Math.pow(10,-6), //4E-6; // thickness of the PEDOT
hg= 5*Math.pow(10,-6), //5E-6;  // thickness of the SPE layer
f_min= 0.001,
f_max= 1000,
df= 0.005;

var j = math.complex(0,1);

var Vw_arr = [],Vw
f_arr = [],
ew_arr = [],
cutoff_arr = [],
data = [],
max_ew=0,
state="fixed_values";
/* End of Parameter Initialization*/


calcData();
 

 /*Functions*/
function drawPlots(){
  $(".max:not(#"+range_id[0]+",#"+range_id[1]+")").prop('disabled', true);
  
 
 /* hp = +($("pdeot-thickness").value);
  sigi = +($("pdeot-ioniconductivity").value);
  Ep = +($("pdeot-youngs").value);
  sige = +($("pdeot-eleconductivity").value);

  hg = +($("spe-thickness").value);
  sigs = +($("spe-ioniconductivity").value);
  Es = +($("spe-youngs").value);

*/
  //Z_drawaxis();
}


function calcData(){
  for(f=f_min; f<f_max; f=f+df){
      f_arr.push(+f);

      //Vw=1./1j./2./pi./f; //input voltage
      var Vw = math.divide(1,j);
      Vw = math.divide(Vw,2);
      Vw = math.divide(Vw,Math.PI);//pi????
      Vw = math.divide(Vw,f);
      Vw_arr.push(Vw);
   }   

  if(state=="fixed_values"){
     calcEW();
     EW_drawaxis();
     EW_WriteParamValues();
  }


}

function calcEW(){

    for(f=f_min; f<f_max; f=f+df){


      var Ri= math.divide(1,sigi);
      Ri = math.divide(Ri,A);// Ri = 1/sigi/A;   // Ri: ionic resistane per thickness
      
      var Rs = math.divide(hg,A);
      Rs = math.divide(Rs,sigs);// Rs = hg/A/sigs;   // Rs: electrolyte resistance
      
      var Re= math.divide(L,w);
      Re = math.divide(Re,hp);
      Re = math.divide(Re,sige);// Re=hg/w/hp/sige; // Re: electronic resistance per unit length
      
      var Zc= math.divide(1,j);
      Zc = math.divide(Zc,2);
      Zc = math.divide(Zc,Math.PI);
      Zc = math.divide(Zc,f);
      Zc = math.divide(Zc,Cv);
      Zc = math.divide(Zc,A);//Zc=1./1j./2./pi./f./Cv./A;
      
      var Z1D = math.multiply(Ri,Zc);
      Z1D = math.sqrt(Z1D);

      var temp = math.divide(Ri,Zc);
      temp = math.sqrt(temp);
      temp = math.multiply(temp,hp);
      temp = math.coth(temp);

      Z1D = math.multiply(Z1D,temp);
      Z1D = math.add(Z1D,Rs);//Z1D=2.*sqrt(Ri.*Zc).*coth(sqrt(Ri./Zc).*hp)+Rs;
      
      var Z2D = math.multiply(Re,Z1D);
      Z2D = math.sqrt(Z2D);
      temp = math.divide(Re,Z1D);
      temp = math.sqrt(temp);
      temp = math.multiply(temp,L);
      temp = math.coth(temp);
      Z2D = math.multiply(Z2D,temp);// Z2D=sqrt(Re.*Z1D).*coth(sqrt(Re./Z1D).*L);



      var Iw = math.divide(1,Z2D);//iw=1./Z2D;
      var pw = math.divide(Iw,j);
      pw = math.divide(pw,2);
      pw = math.divide(pw,Math.PI);
      pw = math.divide(pw,f);
      pw = math.divide(pw,hp);
      pw = math.divide(pw,w);
      pw = math.divide(pw,L); //pw=Iw./1j./2./pi./f./hp./w./L;

      var ew = math.multiply(al,pw); //ew=al*pw;
      var ew_polar = ew.toPolar();
      var ew_abs = ew_polar.r;
      ew_arr.push(ew_abs);//ABS=abs(ew);

    }//end of four

    data = f_arr.map(function(d, i){
       return { 'dim1' : f_arr[i], 'dim2' : ew_arr[i] };
    });

    var min_ew = Math.min.apply(null, ew_arr);
    max_ew = Math.max.apply(null, ew_arr); //MAX=max(ABS);
    F0 = max_ew*0.7079; //F0=max(ABS)*0.7079;

    // console.log(min_ew);
    // console.log(max_ew);
    // console.log(F0);

    for(i=0; i<ew_arr.length; i++){
      if(ew_arr[i]<=F0){
        cutoff_arr.push(f_arr[i]);
        console.log(f_arr[i]);
        break;
      }
     } //indices = find(ABS <= F0); a(1,count)=min(f(indices)); aa(1,count)=MAX;
     console.log(cutoff_arr);
}

function EW_WriteParamValues(){
  var index = cutoff_arr.length-1;
  $("#graphparam1").text("Max Ew: "+max_ew);
  $("#graphparam2").text("Cutoff Frequency: "+cutoff_arr[index]);
}


function EW_drawaxis(){
var margin = {top: 260, right: 10, bottom: 20, left: 10},
    width = $("#graph1").width()-margin.left-margin.right, 
    height = $("#graph1").height()-margin.bottom- 20;


var svg = d3.select("#graph1").append("svg")
            .attr("width", width)
            .attr("height",height);


var x = d3.scaleLog()
          .domain(d3.extent(data, function(d) { return d.dim1; }))
          .range([0, (width)]);
          console.log(width);

var y = d3.scaleLog()
          .domain(d3.extent(data, function(d){ return d.dim2; }))
          .range([height-margin.bottom, 0]);
          console.log(height);
 
var line = d3.line()
             .x(function(d,i) { return x(d.dim1)+20;})//x(f_arr[i])+20; })
             .y(function(d,i) { return y(d.dim2)+10;});//ew_arr[i])+10; });//need to change this


  var xaxis = svg.append("g")
      .attr("transform", "translate(30,"+(height-margin.bottom)+")")
      // .append("text")
      // .attr("class", "coord-label")
      // .attr("x", width)
      // .attr("y", height-margin.bottom)
   //   .style("text-anchor", "end")
      .text("W")
      .call(d3.axisBottom(x));
      
   // svg.append("text")
   //  .attr("class", "coord-label")
   //  .attr("x", width)
   //  .attr("y", height-margin.bottom)
   //  .style("text-anchor", "end")
   //  .text("W");//append label for x axis
    // .style("font-size", "16px")
    // .attr("font-weight", "bold");


 // var yAxis = d3.axisLeft(y);
  d3.select('svg').append('g')
    .attr('transform', "translate(30,0)")
   // .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Ew")
      //.classed('y axis', true)
      .call(d3.axisLeft(y));

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

  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);

}