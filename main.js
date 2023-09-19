let url ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req=new XMLHttpRequest();
let svg =d3.select('svg');
let data=[];
let xScale;
let xAxis;
let yAxis;
let yScale;
let height=450;
let width=800;
let padding=40
let tooltip=d3.select("#tooltip")

let createChart =() =>{
 svg.attr("height",height)
 svg.attr("width",width)
}

let generateScales =() =>{
    xScale = d3.scaleLinear()
    .domain([d3.min(data,(item)=>{ return item['Year']
     })-1,d3.max(data,(item)=>{ return item['Year'] })+1])
    .range([padding,(width-padding)])

    yScale = d3.scaleTime()
  .domain([
    d3.min(data, (item) => new Date(item['Seconds'] * 1000)), //to convert to ms
    d3.max(data, (item) => new Date(item['Seconds'] * 1000))
  ])
  .range([padding, height - padding]);
}

let generateAxis =() =>{
    xAxis=d3.axisBottom(xScale)
            .tickFormat(d3.format('d')) //string ; d for decimal
    svg.append('g')
    .attr("id","x-axis")
    .call(xAxis)
    .attr("transform",'translate(0,'+ (height-padding)+')')


    yAxis=d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat('%M:%S')) //to render time properly
    svg.append("g")
    .attr("id","y-axis")
    .call(yAxis)
    .attr("transform",'translate('+padding+ ',0)')

}

let drawDots =() =>{
    svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr("class","dot")
    .attr("r",'5')
    .attr("data-xvalue",(item)=>{
        return item['Year']
    })
    .attr("data-yvalue",(item)=>{
        return new Date(item['Seconds']*1000)
    })
    .attr("cx",(item)=>{
        return xScale(item['Year'])

    })
    .attr("cy",(item)=>{
        return yScale(new Date(item['Seconds']*1000))
    })
    .attr("fill",(item)=>{
        if(item['Doping']!= ''){
            return "orange"
        } else {
            return "purple"
        }
    })
    .on("mouseover",(item)=>{
        tooltip.transition()
        .style("visibility","visible")

        if(item['Doping']==''){
            tooltip.text(item['Year']+' || '+item['Name']+' || '+item['Time']+' || '+'No doping allegations')
                   
        } else {
            tooltip.text(item['Year']+' || '+item['Name']+' || '+item['Time']+'||'+'With doping allegations')
        }
        tooltip.attr("data-year",item['Year'])

    })
        
    
    .on("mouseout",(item)=>{
        tooltip.transition()
        .style("visibility","hidden")
    })
}
req.open('GET',url,true)
req.onload = () => {
        data=JSON.parse(req.responseText);
        createChart()
        generateScales()
        generateAxis()
        drawDots()
}
req.send();
