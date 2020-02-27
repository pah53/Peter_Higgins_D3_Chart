// @TODO: YOUR CODE HERE!
var svgWidth = 860;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 10,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Casting Income and Smokes variables to Int  
d3.csv("./assets/data/data.csv").then(function(data){

        data.forEach(function(data){
            data.income = +data.income
            data.smokes = +data.smokes
        })

        //Creating scale functions to use later for axis dimensions
        var xScale = d3.scaleLinear()
            .domain([15000, d3.max(data, d => d.income)])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.smokes)])
            .range([height, 0]);

        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)

        chartGroup.append("g")
            .call(yAxis);

        //Creating datapoints
        var dataPoints = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.income))
            .attr("cy", d => yScale(d.smokes))
            .attr("r", "3")
            .attr("fill", "lightblue");

        //Creating a tool tip
        var toolTip = d3.tip()  
            .attr("class", "tooltip")
            .html(function(d) {
                return(`Patient ID: ${d.id}<br>Income: ${d.income}<br>Smoking score: ${d.smokes}`);
            });

        chartGroup.call(toolTip);

        dataPoints.on("click", function(data) {
            toolTip.show(data, this);
        }).on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 90)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Smoking Score");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Income");
    
    }).catch(function(error) {
    console.log(error);
});