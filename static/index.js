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
        .style("display", "inline-block")
        .style("font-size", "1em")
        
        species_set = new Set()

        data.forEach(function(d) {
            species_set.add(d.species)
        })
       
        console.log(species_set)
        
        function y_change() {

        }
        
        x_selector = d3.select("#dash-container").append("select")
                                                    .attr("id", "x_selector")
                                                    .style('vertical-align','top')
                                                    .style("margin-right","30px")
                                                    .on("change", on_x_change);
        
        x_selector_label = d3.select("#dash-container").append("label")
                                                            .attr("for", "x_selector")
                                                            .style("vertical-align", 'top')
                                                            .text("X Axis Attribute")

        y_selector = d3.select("#dash-container").append("select")
                                                    .attr("id", "y_selector")
                                                    .style('vertical-align','top')
                                                    .style("margin-right", "30px")
                                                    .style("font-family","Shrikhand")
                                                    .on("change", on_y_change);
        
        x_options = x_selector.selectAll("option")
                                .data(data.columns)
                                .enter()
                                .filter((d) => d != "species")
                                .append("option")
                                .property("value",(d) => d)
                                .attr("selected", function(d,i) {
                                    if (i==0){
                                        return "selected"
                                    }
                                })
                                .attr("vertical-align", "top")
                                .text((d) => d);
                                           
        y_options = y_selector.selectAll('option')
                                .data(data.columns)
                                .enter()
                                .filter((d) => d != "species")
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

        function get_range(label) {
            var range_array = []
            range_array.push(d3.min(data, function(d) { return d[label]}))
            range_array.push(d3.max(data, function(d) { return d[label]}))
            return range_array;
        };

        var x_axis_scale = d3.scaleLinear().domain(get_x_range()).range([25,650])
        var y_axis_scale = d3.scaleLinear().domain(get_y_range()).range([25,450])

        var x_scale = function(domain) {
            return d3.scaleLinear().domain(domain).range([25,650])
        };

        var y_scale = function(domain) {
            var y_scale = d3.scaleLinear().domain(domain).range([25,450])
            return y_scale
        };

        var x_axis = d3.axisBottom().scale(x_axis_scale)
        var y_axis = d3.axisRight().scale(y_axis_scale)

        var x_axis_group = svg.append("g").attr("id", "x_axis").call(x_axis)
        var y_axis_group = svg.append("g").attr("id", "y_axis").call(y_axis)

        

        // console.log(x_init.text());
        // console.log(y_init.text());

        function on_x_change() {
            var new_x = x_selector.property('value') // get x selection
            var current_y = y_selector.property('value') // get y selection
            new_x_range = get_range(new_x)  // grab min/max values for x feature
            y_range = get_range(current_y) // grab min/max values for y feature
            temp_x_scale = x_scale(new_x_range) // load the min/max as new x domain
            temp_y_scale = y_scale(y_range) // load min/max as new y domain
            x_axis_group.call(d3.axisBottom().scale(temp_x_scale))
                       
            //use the new scales to translate the observations into new locations on SVG
            flowers.attr("transform", function(d,i) {
                return "translate(" + temp_x_scale(d[new_x]) + "," + temp_y_scale(d[current_y]) + ")";
            });
            
        };
        
        function on_y_change() { // same logic as on_x_change, but for y
            var new_y = y_selector.property('value')
            var current_x = x_selector.property('value')
            new_y_range = get_range(new_y)
            x_range = get_range(current_x)
            temp_y_scale = y_scale(new_y_range)
            temp_x_scale = x_scale(x_range)
            y_axis_group.call(d3.axisRight().scale(temp_y_scale))
            
            flowers.attr("transform", function(d,i) {
                return "translate(" + temp_x_scale(d[current_x]) + "," + temp_y_scale(d[new_y]) + ")";
            });

            
        };
        
        const p12 = d3.scaleOrdinal(d3.schemeCategory10).domain(species_set)

        flowers = d3.select("svg").selectAll("g")
                        .data(data)
                        .enter()
                        .append("g")
                        .attr("class", function(d) {
                            return d['species']
                        })
                        .attr("transform", function (d) {
                            return "translate(" + x_axis_scale(d.sepal_length) + "," + y_axis_scale(d.sepal_width) + ")"; // need to tie this to the actual selection for x and y axis
                        })
                        .on("mouseover", function(d) {
                            d3.select(this)
                                .raise()
                                .append("text")
                                .attr("class", "species")
                                .attr("transform", "rotate(-45)")
                                .text(d.species)
                                .style("fill", "black")
                                
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

        flowers.each(function(d) {
            console.log(d3.select(this).node().__data__)
        })
});

