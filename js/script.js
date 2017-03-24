
var svg,xMap,yMap,line;

/*Initialize Parameters*/
var al= Math.pow(10, -10),//1E-10; //strain to charge ratio
Cv=3*Math.pow(10,7),// 5E7;  //Volumetric capacitance [F/m]
w= 300,//*Math.pow(10,-6), //300e-6; //Width of the sample
L= 1500,//*Math.pow(10,-6), //3000e-6; //length of the sample
A=w*L,  // area = width x length
j = math.complex(0,1);

var Es_min= 1,//Math.pow(10,6), // 1E6; // Young's modulus of the SPE layer
Es_max= 1,//Math.pow(10,6),
Es= 1;//Math.pow(10,6);

var Ep_min= 500,//*Math.pow(10,6),//500E6; //Young's modulus of the PEDOT layer
Ep_max = 500,//*Math.pow(10,6),
Ep= 500;//*Math.pow(10,6);

var sigi_min=0.02, // ionic conductivity of PEDOT [s/m]
sigi_max=0.02,
sigi=0.02;

var sigs_min=0.2, // ionic conductivity of SPE
sigs_max=0.2,
sigs=0.2;

var sige_min= 6000, // electronic conductivity of PEDOT [s/m]
sige_max=6000,
sige=6000;

var hp_min= 2,//*Math.pow(10,-6), //4E-6; // thickness of the PEDOT
hp_max=2,//*Math.pow(10,-6),
hp=2;//*Math.pow(10,-6);

var hg_min= 10,//*Math.pow(10,-6), //5E-6;  // thickness of the SPE layer
hg_max=10,//*Math.pow(10,-6),
hg=10;//*Math.pow(10,-6);

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
fw_arr = [],
dw_arr = [],
cutoff_arr = [],
maxEW_arr = [],
maxFW_arr = [],
maxDW_arr = [],
data = [],
rangeParam_arr = [],//,"pdeot-eleconductivity-max"];
max_ew=0,
state="fixed_values",
progress="done";
var progress_counter=0;

var dim1_text="",
dim2_text="",
num_ticks_x=5,
num_ticks_y=5,
y_order=0;
/* End of Parameter Initialization*/


//fillDefaultFormValues();


 /**************events**************/
 $(".param").change(function(event){
   var succeed = updateValue(event.target.id,event.target.value)
   if(!succeed){
      alert("Error in Input Values");
    }

  });
  $("#draw-btn").click(function(){
    progress = "working";
    cleargraphs();
    // setInterval(checkprogress, 300); 
    $("#progresstext").text("Calculating plot values . . .");
     setTimeout(function(){ calcData(); }, 1000);
   //  calcData(); 
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
      hp_min = value ;
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

    case 'f-min':
      f_min = value ;
      break;
     case 'f-max':
      f_max = value;
      break; 
      case 'f-step':
      df = value;
      break; 

    case 'device-width':
      w = value;
      break; 
    case 'device-length':
      L = value;
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
     prepareData("strain"); //prepares data for plot 1
     EW_drawaxis("#graph1"); //draws axis for plot 1
     drawLineGraph(); //plot 1
     prepareData("force"); //prepares data for plot 2
     EW_drawaxis("#graph2"); //draws axis for plot 2
     drawLineGraph(); //plot2
     prepareData("displacement"); //prepares data for plot 3
     EW_drawaxis("#graph3"); //draws axis for plot 3
     drawLineGraph(); //plot 3 
     EW_WriteParamValues(); //writes the fixed values for max and cutt-off thresholds
  }

  else if(state =="range_values"){
    console.log(state);
    param_max = +($("#"+param_id+"-max").val());
    param_min = +($("#"+param_id+"-min").val());
    param_step = +($("#"+param_id+"-step").val()); 
    param_arr = [];
    cutoff_arr = [];
    maxF_arr = [];
    for(v = param_min; v<=param_max; v = v+param_step){
      param_arr.push(v);
      console.log("v:"+v);
      updateValue(param_id,v);
      calcEW(); // main caculations for a set of fixed parameter values happen here.
                //we call this function in a loop to find all the cutoff values.
    }

    // console.log(param_arr);
    // console.log(cutoff_arr);
    cleargraphs();//cleans previous plots
    prepareData("cutoff"); //prepares the data for the two plots
    EW_drawaxis("#graph1");
    drawScatterPlot();    //plot 1 
    prepareData("maxForce");
    EW_drawaxis("#graph2");
    drawScatterPlot();    //plot 2 
    prepareData("maxDisplacement");
    EW_drawaxis("#graph3");
    drawScatterPlot();    //plot 3 
    EW_WriteParamValues(); //We don't write any parameters values but may in future  
  }

  $("#progresstext").text("");
  // progress="done";

}

//prepares the data in a format that is appropriate for d3.js to draw the graphs
function prepareData(datatype){
  switch(datatype){
    case "strain":
      dim1_text = "Frequency (Hz)";
      dim2_text = "Strain / Voltage (V)";
      data = f_arr.map(function(d, i){
       return { 'dim1' : f_arr[i], 'dim2' : ew_arr[i] };
      });
      break;

    case "force":
      dim1_text = "Frequency (Hz)";
      dim2_text = "Force (µN) / Voltage (V)";
      data = f_arr.map(function(d, i){
       return { 'dim1' : f_arr[i], 'dim2' : fw_arr[i] };
      });
      break;

    case "displacement":
      dim1_text = "Frequency (Hz)";
      dim2_text = "Displacement (mm) / Voltage (V)";
      data = f_arr.map(function(d, i){
       return { 'dim1' : f_arr[i], 'dim2' : dw_arr[i] };
      });
      break;

      //Range values
    case "cutoff":
      dim1_text = parseDimensionText(param_id);
      dim2_text = "Cutoff Frequency (Hz)";
       data = param_arr.map(function(d, i){
       return { 'dim1' : param_arr[i], 'dim2' : cutoff_arr[i] };
      });
      break;
    case "maxForce":
      dim1_text= parseDimensionText(param_id);
      dim2_text= "Max Force (µN) / Voltage (V)";
      data = param_arr.map(function(d, i){
       return { 'dim1' : param_arr[i], 'dim2' : maxFW_arr[i] };
      });
      break;
    case "maxDisplacement":
      dim1_text= parseDimensionText(param_id);
      dim2_text= "Max Displacement (mm) / Voltage (V)";
      data = param_arr.map(function(d, i){
       return { 'dim1' : param_arr[i], 'dim2' : maxDW_arr[i] };
      });
      break;
  }
  


  // if(state =="fixed_values"){
  //   dim1_text = "Frequency";
  //   dim2_text = "Strain/Voltage (V)";
  //     data = f_arr.map(function(d, i){
  //      return { 'dim1' : f_arr[i], 'dim2' : ew_arr[i] };
  //    });
  // }
  // else if(state == "range_values" && datatype=="cutoff_arr"){
  //     dim1_text = param_id;
  //     dim2_text = "Cutoff Value";
  //      data = param_arr.map(function(d, i){
  //      return { 'dim1' : param_arr[i], 'dim2' : cutoff_arr[i] };
  //    });
  // }
  // else if(state == "range_values" && datatype=="maxF_arr"){
  //   dim1_text= param_id;
  //   dim2_text= "Max Value";
  //      data = param_arr.map(function(d, i){
  //      return { 'dim1' : param_arr[i], 'dim2' : maxF_arr[i] };
  //    });
  // }
}


// main caculations for a set of fixed parameter values happen here.
function calcEW(){
  //  console.log("in calcEW");
    ew_arr = [];
    fw_arr = [];
    dw_arr = [];
    _hp = hp*Math.pow(10,-6);
    _hg = hg*Math.pow(10,-6);
    _Ep = Ep*Math.pow(10,6);
    _Es = Es*Math.pow(10,6);
    _w = w*Math.pow(10,-6);
    _L = L*Math.pow(10,-6);
    _A=w*L;


    for(f=f_min; f<=f_max; f=f+df){
      var Ri= math.divide(1,sigi);
      Ri = math.divide(Ri,_w);// Ri = 1/sigi/w;   // Ri: ionic resistane per thickness
      
      var Rs = math.divide(_hg,_w);
      Rs = math.divide(Rs,sigs);
      Rs = math.divide(Rs,2);// Rs = hg/w/sigs/2;   // Rs: electrolyte resistance
      
      var Re= math.divide(1,_w);
      Re = math.divide(Re,_hp);
      Re = math.divide(Re,sige);// Re=1/w/hp/sige; // Re: electronic resistance per unit length
      
      var Zc= math.divide(1,j);
      Zc = math.divide(Zc,2);
      Zc = math.divide(Zc,Math.PI);
      Zc = math.divide(Zc,f);
      Zc = math.divide(Zc,Cv);
      Zc = math.divide(Zc,_w);//Zc=1./1j./2./pi./f./Cv./A;

   //   console.log(Zc);
      
      var Z1D = math.multiply(Ri,Zc);
      Z1D = math.sqrt(Z1D);

      var temp = math.divide(Ri,Zc);
      temp = math.sqrt(temp);
      temp = math.multiply(temp,_hp);
      temp = math.coth(temp);

      Z1D = math.multiply(Z1D,temp);
      Z1D = math.add(Z1D,Rs);//Z1D=2.*sqrt(Ri.*Zc).*coth(sqrt(Ri./Zc).*hp)+Rs;
      
      var Z2D = math.multiply(Re,Z1D);
      Z2D = math.sqrt(Z2D);
      temp = math.divide(Re,Z1D);
      temp = math.sqrt(temp);
      temp = math.multiply(temp,_L);
      temp = math.coth(temp);
      Z2D = math.multiply(Z2D,temp);// Z2D=sqrt(Re.*Z1D).*coth(sqrt(Re./Z1D).*L);
      //console.log(Z2D);


      var Iw = math.divide(1,Z2D);//iw=1./Z2D;
      var pw = math.divide(Iw,j);
      pw = math.divide(pw,2);
      pw = math.divide(pw,Math.PI);
      pw = math.divide(pw,f);
      pw = math.divide(pw,_hp);
      pw = math.divide(pw,_w);
      pw = math.divide(pw,_L); //pw=Iw./1j./2./pi./f./hp./w./L;
      //console.log(pw);


      /**********Strain ***********/
      var ew = math.multiply(al,pw); //ew=al*pw;
      var ew_polar = ew.toPolar();
      var ew_abs = ew_polar.r;
      ew_arr.push(ew_abs);//ABS=abs(ew);

      /**********Force ***********/
      var temp = Ep*3*Math.pow(10,6);
      temp = temp*al;
      temp = math.multiply(temp,pw);//1E6*3*Ep*al*pw

      var temp2 = w*hp*(hp+hg);//w*hp*(hp+hg)

      var fw = math.multiply(temp,temp2);
      fw = math.divide(fw,2);
      fw = math.divide(fw,L);///2/L;
      //Fw=1E6*3*Ep*al*pw*w*hp*(hp+hg)/2/L;
      var fw_polar = fw.toPolar();
      var fw_abs = fw_polar.r;
      fw_arr.push(fw_abs);

      /**********Displacement ****/
      temp = 2*hp+hg; //(2*hp+hg) 
      temp2 = Math.pow(L,2); //^2
      temp2 = temp2*Math.pow(10,3); //1E3*L
      var dw = math.multiply(temp2,ew);
      dw = math.divide(dw,temp);
      // Dw=1E3*L.^2*ew/(2*hp+hg) 
      var dw_polar = dw.toPolar();
      var dw_abs = dw_polar.r;
      dw_arr.push(dw_abs);
     
     // console.log(ew_abs);

    }//end of four

    
    // var min_ew = Math.min.apply(null, ew_arr);
    var max_ew = Math.max.apply(null, ew_arr); //MAX=max(ABS);
    var max_fw = Math.max.apply(null, fw_arr); //MAX=max(ABS);
    var max_dw = Math.max.apply(null, dw_arr); //MAX=max(ABS);


    F0 = max_ew*0.7079; //F0=max(ABS)*0.7079;
    for(i=0; i<ew_arr.length; i++){
      if(ew_arr[i]<=F0){
        cutoff_arr.push(f_arr[i]);
        console.log("cutoff F: "+f_arr[i]);
        break;
      }
     } //indices = find(ABS <= F0); a(1,count)=min(f(indices)); aa(1,count)=MAX;
   //  console.log(cutoff_arr);
   maxEW_arr.push(max_ew);
   maxFW_arr.push(max_fw);
   maxDW_arr.push(max_dw);

   // console.log("max_ew: "+max_ew)
}

//We print max and cutoff threshold 
function EW_WriteParamValues(){
  if(state =="fixed_values"){
        var index = cutoff_arr.length-1;
        var val = Number((cutoff_arr[index]).toFixed(2))
        // $("#graphparam1").text("Max Ew: "+max_ew);
        $("#graphparam2").text("Cutoff Frequency: "+val);
  }
  else if(state =="range_values"){       
        // $("#graphparam1").text("");
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

    var x,y;

/*********prapare  X axis *********/
    if(state =="fixed_values")
      x =  d3.scaleLog();
       
    else 
      x = d3.scaleLinear();

    x.domain(d3.extent(data, function(d) { return d.dim1; }))
     .range([70, (width-70)]);

     var xaxis = svg.append("g")
        .attr("transform", "translate(0,"+(height-50)+")")
        .call(d3.axisBottom(x)
                .ticks(num_ticks_x));
         // text label for the x axis
    svg.append("text")             
        .attr("transform",
              "translate("+ ((width)/2) + ","+(height-15) + ")")
        .style("text-anchor", "middle")
        .attr("class","axislabel")
        .text(dim1_text);

/*********prapare  Y axis *********/
    y = d3.scaleLinear();
    var min = d3.min(data, function(d) { return d.dim2; });
    var max = d3.max(data, function(d) { return d.dim2; });
    var y_order = Math.floor(Math.log(max) / Math.LN10
                       + 0.000000001);


    console.log("Y order: "+y_order);

    // if(state == "range_values" && plotid =="#graph2"){
    //      y.domain([min-min/2, 5*d3.max(data, function(d) { return d.dim2; })])
    //       .range([height-50, 50]);
    // }
    // else{
      // y.domain([(min-0.05*y_order),(max+0.05*y_order)])//d3.extent(data, function(d){ return d.dim2; }))
      ypadding = 0.5*Math.pow(10,y_order);

      y.domain([(min-ypadding),(max+ypadding)])
       .range([height-50, 50]);
    // }
      
    var yaxis = svg.append("g")
      .attr('transform', "translate(70,0)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .call(d3.axisLeft(y)
                .ticks(num_ticks_y)
                .tickFormat(d3.formatPrefix(".1", Math.pow(10,y_order))));

       // text label for the y axis
    svg.append("text")
        .attr("transform", "translate("+ (30/2) +","+((height)/2)+")rotate(-90)")
        .style("text-anchor", "middle")
        .attr("class","axislabel")
        .text(dim2_text);     

    xMap = function(d) { return x(d.dim1);}; // data -> display
    yMap = function(d) { return y(d.dim2);};
    line = d3.line()
              .x(xMap)
              .y(yMap);

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
  // $("#graphparam1").text("");
  $("#graphparam2").text("");
}

function parseDimensionText(paramid){
 var text="";
  switch(paramid){
    case "pdeot-thickness":
      text = "PDEOT Thickness (µm)";
    break;
    case "pdeot-ioniconductivity":
      text = "PDEOT Ionic Conductivity (S/m)";
    break;
    case "pdeot-youngs":
      text = "PDEOT Youngs Modulus (MPa)";
    break;
    case "pdeot-eleconductivity":
      text = "PDEOT Electronic Conductivity (S/m)";
    break;


    case "spe-thickness":
      text = "SPE Thickness (µm)";
    break;
    case "spe-ioniconductivity":
      text = "SPE Ionic Conductivity (S/m)";
    break;
    case "spe-youngs":
      text = "SPE Youngs Modulus (MPa)";
    break;

  }


 return text;
}