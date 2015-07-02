/**
 * Created by Felix on 26/6/2015.
 * color ["#7BA3A8", "#F35A4A"]
 */
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    outerWidth = 960,
    outerHeight = 500,
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var bardata = [];

var tempColor;

d3.csv("data/population.csv").get(function (error, data) {
    if (error) throw error;

    for (var key in data) {
        bardata.push(data[key]);
    }

    var color = d3.scale.ordinal()
        .domain(d3.keys(bardata[0]).filter(function (key) {
            return key !== "State";
        }))
        .range(["#7BA3A8", "#F35A4A"]);

    bardata.forEach(function (d) {
        var y0 = 0;
        d.genders = color.domain().map(function (element) {
            return {name: element, y0: y0, y1: y0 += +d[element]}
        }).slice(0, 2);
    });

    var tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("padding", "0 10px")
        .style("background", "white")
        .style("border-radius", 2)
        .style('opacity', 0);

    var x = d3.scale.ordinal()
        .domain(bardata.map(function (d) {
            return d.State;
        })) // original data is State
        .rangeBands([0, width], 0.1); //setup the range band of the xAxis

    var y = d3.scale.linear()
        .domain([0, d3.max(bardata, function (d) {
            return d.Total
        })])
        .rangeRound([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("0.2s"));

    var svg = d3.select("#barchart").append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

    var state = svg.selectAll(".state")
        .data(bardata)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d) {
            return "translate(" + x(d.State) + ",0)";
        });

    state.selectAll("rect")
        .data(function (d) {
            return d.genders;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.y1);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y1);
        })
        .style("fill", function (d) {
            return color(d.name);
        })
        .attr('height', 0)
        .attr('y', height)
        .on("mouseover", function (d) {
            tooltip.transition()
                .style("opacity", .8);

            tooltip.html(d.y1 - d.y0)
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');

            tempColor = this.style.fill;
            d3.select(this)
                .style("opacity",.5)
                .style('fill', '#6AE6F5');
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .style("opacity", 0);

            d3.select(this)
                .style("opacity", 1)
                .style("fill", tempColor);
        });

    state.selectAll("rect")
        .data(function (d) {
            return d.genders;
        })
        .transition()
        .attr("height", function (d) {
            return y(d.y0) - y(d.y1)
        })
        .attr("y", function (d) {
            return y(d.y1)
        })
        .delay(500)
        .duration(1000);

    var xGuide = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var yGuide = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.51em")
        .style("text-anchor", "end")
        .text("population");


    var legend = svg.selectAll(".legend")
        .data(color.domain().slice(0, 2).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });
});