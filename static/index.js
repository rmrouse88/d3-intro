// import * as $ from 'jquery'
// // // import _ from 'bootstrap'
// import * as d3 from 'd3'
// var request = require(request)

$(function() {
    console.log('sup, this is jquery');
});


d3.csv("https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/d546eaee765268bf2f487608c537c05e22e4b221/iris.csv")

    .then(function(data) {

        var svg = d3.select("#dash-container").append("svg")
        .attr("width", 700)
        .attr("height", 500)
        .style('background-color', "white")

        // console.log(d3.max(data, function(d) { return d.sepal_length }))
        // console.log(d3.min(data, function(d) { return d.sepal_length }))

        species_set = new Set()

        data.forEach(function(d) {
            species_set.add(d.species)
        })
       
        console.log(species_set)
        
        function y_change() {

        }
        
        x_selector = d3.select("#dash-container").append("select").attr("id", "x_selector").on("change", on_x_change);
        
        y_selector = d3.select("#dash-container").append("select").attr("id", "y_selector")
        // .on("change", on_y_change);

        x_options = x_selector.selectAll("option")
                                .data(data.columns)
                                .enter()
                                .append("option")
                                .property("value",(d) => d)
                                .attr("selected", function(d,i) {
                                    if (i==0){
                                        return "selected"
                                    }
                                })
                                .attr("vertical-align", "top")
                                .text((d) => d);
                                
                            eval()
                
        y_options = y_selector.selectAll('option')
                                .data(data.columns)
                                .enter()
                                .append('option')
                                .property('value', (d) => d)
                                .attr("selected",function(d,i) {
                                    if (i==1){
                                        return "selected"
                                    }
                                })
                                .attr("vertical-align", "top")
                                .text((d) => d);

        
        
        x_init = x_selector.selectAll('option').filter( function (d,i) {return this.selected;})
        y_init = y_selector.selectAll('option').filter( function (d,i) {return this.selected;})

        function get_x_range() {
            var x_range_array = []
            x_range_array.push(d3.min(data, function(d) { return d[x_init.text()]}))
            x_range_array.push(d3.max(data, function(d) { return d[x_init.text()]}))
           
            return x_range_array;
        };

        function get_y_range() {
            var y_range_array = []
            y_range_array.push(d3.min(data, function(d) { return d[y_init.text()]}))
            y_range_array.push(d3.max(data, function(d) { return d[y_init.text()]}))
            
            return y_range_array;
        };

        console.log(get_x_range())
        console.log(get_y_range())

        var x_axis_scale = d3.scaleLinear().domain(get_x_range()).range([25,650])
        var y_axis_scale = d3.scaleLinear().domain(get_y_range()).range([25,450])

        var x_axis = d3.axisBottom().scale(x_axis_scale)
        var y_axis = d3.axisRight().scale(y_axis_scale)

        var x_axis_group = svg.append("g").call(x_axis)
        var y_axis_group = svg.append("g").call(y_axis)


        console.log(x_init.text());
        console.log(y_init.text());


        function on_x_change() {
            var newData = d3.select(this).property('value');

            console.log(newData)
        }

        console.log(x_axis_scale(40))

        // var x_axis = d3.axisTop(x_axis_scale)

        // var y_axis_scale = d3.scaleLinear().domain().range([50,450])
        // var y_axis = d3.axisLeft(y_axis_scale)
                    

        const p12 = d3.scaleOrdinal(d3.schemeCategory10).domain(species_set)

        flowers = d3.select("svg").selectAll("g")
                        .data(data)
                        .enter()
                        .append("g")
                        .attr("class", function(d) {
                            return d.species
                        })
                        .attr("transform", function (d) {
                            return "translate(" + x_axis_scale(d.sepal_length) + "," + y_axis_scale(d.sepal_width) + ")"; // need to tie this to the actual selection for x and y axis
                        })
                        .on("mouseover", function(d) {
                            d3.select(this)
                                .append("text")
                                .attr("class", "species")
                                .text(d.species)
                                .style("fill", "white")
                        })
                        .on("mouseout", function(d) {
                        d3.selectAll("text.species").remove()
                        });
        
        flowers.on("click", function(data) {

            new_selection = flowers.filter(d => d.species == data.species);
            
            var new_func = function(selection) {
                if (selection.style("opacity") != 1) {
                    selection.style("opacity", 1) 
                } else {
                    selection.style("opacity", .3)
                }
            };
            new_func(new_selection);
        });
                
        flowers.append("circle")
                        .attr("r", 5)
                        .attr("fill", function(d) {
                            return(p12(d.species))
                        });
});

