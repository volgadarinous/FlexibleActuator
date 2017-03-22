
var svg,xMap,yMap,line;

/*Initialize Parameters*/
var al= Math.pow(10, -10),//1E-10; //strain to charge ratio
Cv=5*Math.pow(10,7),// 5E7;  //Volumetric capacitance [F/m]
w= 300*Math.pow(10,-6), //300e-6; //Width of the sample
L= 3000*Math.pow(10,-6), //3000e-6; //length of the sample
A=w*L,  // area = width x length
j = math.complex(0,1);

var Es_min= Math.pow(10,6), // 1E6; // Young's modulus of the SPE layer
Es_max=Math.pow(10,6),
Es=Math.pow(10,6);

var Ep_min= 500*Math.pow(10,6),//500E6; //Young's modulus of the PEDOT layer
Ep_max = 500*Math.pow(10,6),
Ep= 500*Math.pow(10,6);

var sigi_min=0.02, // ionic conductivity of PEDOT [s/m]
sigi_max=0.02,
sigi=0.02;

var sigs_min=0.08, // ionic conductivity of SPE
sigs_max=0.08,
sigs=0.08;

var sige_min= 6000, // electronic conductivity of PEDOT [s/m]
sige_max=6000,
sige=6000;

var hp_min= 4*Math.pow(10,-6), //4E-6; // thickness of the PEDOT
hp_max=4*Math.pow(10,-6),
hp=4*Math.pow(10,-6);

var hg_min= 5*Math.pow(10,-6), //5E-6;  // thickness of the SPE layer
hg_max=5*Math.pow(10,-6),
hg=5*Math.pow(10,-6);

var f_min= 0.001,
f_max= 1000,
df= 0.005;

var param_min=0,
param_max=0,
param=0,
param_step=0,
param_id="",
param_arr=[];




var Vw_arr = [],Vw
f_arr = [],
ew_arr = [],
cutoff_arr = [],
data = [],
rangeParam_arr = [],//,"pdeot-eleconductivity-max"];
max_ew=0,
state="fixed_values";
/* End of Parameter Initialization*/


fillDefaultFormValues();
// param_id = "pdeot-thickness";
// param_min = 4*Math.pow(10,-6);
// param_max = 8*Math.pow(10,-6);
// param_step = Math.pow(10,-6);
//calcData();
 

 /*Functions*/
 // function showRange(){
 //  $(".max").css("display", "inline");
 // }


 /**************events**************/
 $(".min").change(function(event){
   var succeed = updateValue(event.target.id,event.target.value)
   if(!succeed){
      alert("Error in Input Values");
    }

  });

$(".max").change(function(event){
   
    var succeed = updateValue(event.target.id,event.target.value)
    if(!succeed){
      alert("Error in Input Values");
    }

});

 $(".step").change(function(event){
   var succeed = updateValue(event.target.id,event.target.value)
   if(!succeed){
      alert("Error in Input Values");
    }

});


  $("#draw-btn").click(function(){
    calcData();
  });


 $(".rangebtn").click(function() {
  var $this = $(this);
  id=this.id.slice(0,-10);

    $this.toggleClass('rangebtn');
    if($this.hasClass('rangebtn')){
        rangeParam_arr=[];
       // updateValue(id+"-max",0);
        state = "fixed_values";
        $("#"+id+"-max").css("display","none");
        $("#"+id+"-step").css("display","none");
        $(".rangebtn:not(#"+rangeParam_arr[0]+",#"+rangeParam_arr[1]+")").prop('disabled', false);
        $this.text('Range Values>');         
    } else {
        state = "range_values";
        param_id = id;
        rangeParam_arr.push(id+"range-btn");
        $("#"+id+"-max").css("display","inline");
        $("#"+id+"-step").css("display","inline");
        $(".rangebtn:not(#"+rangeParam_arr[0]+",#"+rangeParam_arr[1]+")").prop('disabled', true);
        $this.text('<');
    }

  // id=this.id.slice(0,-10);
  // alert("#"+id+"-max");
 

    // alert(id); // or alert($(this).attr('id'));
});
/*********************end of events***********************/

 function fillDefaultFormValues(){
    $("#pdeot-thickness-min").val(hp_min);
    $("#pdeot-ioniconductivity-min").val(sigi_min);
    $("#pdeot-youngs-min").val(Ep_min);
    $("#pdeot-eleconductivity-min").val(sige_min);

    $("#spe-thickness-min").val(hg_min);
    $("#spe-ioniconductivity-min").val(sigs_min);
    $("#spe-youngs-min").val(Es_min);
 }


function updateValue(id, value){
  switch (id) {
    case 'pdeot-thickness-min':
      hp_min = value;
      break;
     case 'pdeot-thickness-max':
      hp_max = value;
      break; 
      case 'pdeot-thickness-step':
      hp_step = value;
      break; 
      case 'pdeot-thickness':
      console.log("correct update");
      hp = value;
      console.log(hp);
      break; 

     case 'pdeot-ioniconductivity-min':
      sigi_min = +value;
      break;
    case 'pdeot-ioniconductivity-max':
      sigi_max = +value;
      break;
    case 'pdeot-ioniconductivity-step':
      sigi_step = +value;
      break;
        case 'pdeot-ioniconductivity':
      sigi = +value;
      break;

    case 'pdeot-youngs-min':
      Ep_min = +value;
      break;
    case 'pdeot-youngs-max':
      Ep_max = +value;
      break;
    case 'pdeot-youngs-step':
      Ep_step = +value;
      break;
    case 'pdeot-youngs':
      Ep = +value;
      break;

    case 'pdeot-eleconductivity-min':
      sige_min = +value;
      break;
    case 'pdeot-eleconductivity-max':
      sige_max = +value;
      break;
    case 'pdeot-eleconductivity-step':
      sige_step = +value;
      break;
    case 'pdeot-eleconductivity':
      sige = +value;
      break;

    case 'spe-thickness-min':
      hg_min = value;
      break;
    case 'spe-thickness-max':
      hg_max = value;
      break;
    case 'spe-thickness-step':
      hg_step = value;
      break;
    case 'spe-thickness':
      hg = +value;
      break;

    case 'spe-ioniconductivity-min':
      sigs_min = +value;
      break;
    case 'spe-ioniconductivity-max':
      sigs_max = +value;
      break;
    case 'spe-ioniconductivity-step':
      sigs_step = +value;
      break;
    case 'spe-ioniconductivity':
      sigs = +value;
      break;

    case 'spe-youngs-min':
      Es_min = +value;
      break;
    case 'spe-youngs-max':
      Es_max = +value;
      break;
    case 'spe-youngs-step':
      Es_step = +value;
      break;
    case 'spe-youngs':
      Es = +value;
      break;
  }

  return true;
}


function calcData(){
  f_arr = [];
  Vw_arr = [];
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
      hp = hp_min;
      sigi = sigi_min;
      Ep = Ep_min;
      sige = sige_min;
      hg = hg_min;
      sigs = sigs_min;
      Es = Es_min;

     cleargraphs();
     calcEW(); //main caculations for a set of fixed parameter values happen here.
     prepareData(); //prepares data for drawing the plots
     EW_drawaxis("#graph1"); //draws axis for the only plot needed in this case
     drawLineGraph(); //draws the line plot
     EW_WriteParamValues(); //writes the fixed values for max and cutt-off thresholds
  }

  else if(state =="range_values"){
    console.log(state);
    param_max = +($("#"+param_id+"-max").val());
    param_min = +($("#"+param_id+"-min").val());
    param_step = +($("#"+param_id+"-step").val()); 
    param_arr = [];
    cutoff_arr = [];
    for(v = param_min; v<param_max; v = v+param_step){
      param_arr.push(v);
      console.log("v:"+v);
      updateValue(param_id,v);
      calcEW(); // main caculations for a set of fixed parameter values happen here.
                //we call this function in a loop to find all the cutoff values.
    }

    console.log(param_arr);
    console.log(cutoff_arr);

    cleargraphs();//cleans previous plots
    prepareData(); //prepares the data for the two plots
    EW_drawaxis("#graph1");
    drawScatterPlot();    //plot 1 is a scatter plot
    EW_drawaxis("#graph2");
    drawLineGraph();      //plot 2 is a line plot
    EW_WriteParamValues(); //We don't write any parameters values but may in future  
  }

}

//prepares the data in a format that is appropriate for d3.js to draw the graphs
function prepareData(){
  if(state =="fixed_values"){
      data = f_arr.map(function(d, i){
       return { 'dim1' : f_arr[i], 'dim2' : ew_arr[i] };
     });
  }
  else if(state == "range_values"){
       data = param_arr.map(function(d, i){
       return { 'dim1' : param_arr[i], 'dim2' : cutoff_arr[i] };
     });
  }
}


// main caculations for a set of fixed parameter values happen here.
function calcEW(){
  //  console.log("in calcEW");
    ew_arr = [];

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

   //   console.log(Zc);
      
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
      //console.log(Z2D);


      var Iw = math.divide(1,Z2D);//iw=1./Z2D;
      var pw = math.divide(Iw,j);
      pw = math.divide(pw,2);
      pw = math.divide(pw,Math.PI);
      pw = math.divide(pw,f);
      pw = math.divide(pw,hp);
      pw = math.divide(pw,w);
      pw = math.divide(pw,L); //pw=Iw./1j./2./pi./f./hp./w./L;
      //console.log(pw);


      var ew = math.multiply(al,pw); //ew=al*pw;
      var ew_polar = ew.toPolar();
      var ew_abs = ew_polar.r;
      ew_arr.push(ew_abs);//ABS=abs(ew);
     // console.log(ew_abs);

    }//end of four

    
    var min_ew = Math.min.apply(null, ew_arr);
    max_ew = Math.max.apply(null, ew_arr); //MAX=max(ABS);
    F0 = max_ew*0.7079; //F0=max(ABS)*0.7079;

    // console.log(min_ew);
    // console.log(max_ew);
    // console.log(F0);

    for(i=0; i<ew_arr.length; i++){
      if(ew_arr[i]<=F0){
        cutoff_arr.push(f_arr[i]);
     //   console.log(f_arr[i]);
        break;
      }
     } //indices = find(ABS <= F0); a(1,count)=min(f(indices)); aa(1,count)=MAX;
   //  console.log(cutoff_arr);
}

//We print max and cutoff threshold 
function EW_WriteParamValues(){
  if(state =="fixed_values"){
        var index = cutoff_arr.length-1;
        $("#graphparam1").text("Max Ew: "+max_ew);
        $("#graphparam2").text("Cutoff Frequency: "+cutoff_arr[index]);
  }
  else if(state =="range_values"){       
        $("#graphparam1").text("");
        $("#graphparam2").text("");
  }
}

//draw plot axis
function EW_drawaxis(plotid){
var margin = {top: 260, right: 20, bottom: 20, left:20},
    width = $(plotid).width()-margin.left-margin.right, 
    height = $(plotid).height()-margin.bottom-20;

svg = d3.select(plotid).append("svg")
            .attr("width", width)
            .attr("height",height);

var x = d3.scaleLog()
          .domain(d3.extent(data, function(d) { return d.dim1; }))
          .range([30, (width-30)]);
          console.log(width);

var y = d3.scaleLog()
          .domain(d3.extent(data, function(d){ return d.dim2; }))
          .range([height-40, 40]);
          console.log(height);
 

xMap = function(d) { return x(d.dim1);}; // data -> display
yMap = function(d) { return y(d.dim2);};
line = d3.line()
          .x(xMap)
          .y(yMap);



  var xaxis = svg.append("g")
      .attr("transform", "translate(0,"+(height-40)+")")
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
   var yaxis = svg.append("g").append('g')
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

}

function drawLineGraph(){
   svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);
}

function drawScatterPlot(){

   svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("stroke", "steelblue")
      .attr("fill", "steelblue")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap);
}

//cleans plots from the previous calculations
function cleargraphs(){
  d3.selectAll(".graph").selectAll("*").remove();
}