//---------------------------------------------------------------------------------
// Version 0_1
//---------------------------------------------------------------------------------

function d3mv_Line_chart(args) {

    //Todo: custom ticklines
    //Todo: add axis lables
    //Todo: configurable grid lines

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var dots = args.add_dots || false;
    var no_line = args.no_line || false;
    var xAxisTickValues = args.xAxisTickValues || "";

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    
    //  var parseDate = d3.time.format("%Y-%m-%d hh:mm:ss").parse;
    var x = d3.scaleLinear()//d3.time.scale()
        .range([0, width]);

//    var x = d3.time.scale()
  //     .range([0, width]);


    var y = d3.scaleLinear() 
        .range([height, 0]);

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" && k != "grade_auto" && k != "sensors_group" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });


    //var xAxis = d3.svg.axis()
    //    .scale(x)
    //    .orient("bottom")
    //    .innerTickSize(-height)
    //    .outerTickSize(0)
    //    .tickPadding(10);

    ////d3.range(0, 200, 28)
    //if (xAxisTickValues != "")
    //{ xAxis.tickValues(xAxisTickValues); }
    ////xAxis.tickValues(d3.range(0, 200, 28));
    //  // .tickValues([24, 48, 72, 96, 120, 144, 168]);;

    //var yAxis = d3.svg.axis()
    //    .scale(y)
    //    .orient("left")
    //     .innerTickSize(-width)
    //    .outerTickSize(0)
    //    .tickPadding(10);

    var line = d3.line()
     //   .interpolate("basis")
        .x(function (d) { return x(d[x_ds]); })
        .y(function (d) { return y(d[y_ds]); });

    //// function for the x grid lines
    //function make_x_axis() {
    //    return d3.svg.axis()
    //        .scale(x)
    //        .orient("bottom")
    // //       .ticks(6)
    //        .tickValues([24, 48, 72, 96, 120, 144, 168]);
    //}

    var svg = d3.select("#" + chart).append("svg")
        .attr("id", chart + "_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return d[x_ds]; }));
    y.domain(d3.extent(data, function (d) { return d[y_ds]; }));

    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);

    //svg.append("g")
    //    .attr("class", "y axis")
    //    .call(yAxis);
   
    var gX = svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
      //  .ticks(d3.time.minutes, 15)
      //.tickFormat(d3.time.format("%H:%M"))
        .call(d3.axisBottom(x));

    var gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temp (C)");

    // add line
    if  (!no_line) {
        svg.append("path")
         .datum(data)
         .attr("class", "line")
         .attr("d", line)
         .attr("id", "line");
    }


    // Add circles 
    if (dots) {
                svg.selectAll(".dot")
                .data(data)
              .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3)
                .attr("cx", function (d) { return x(d[x_ds]); })
                .attr("cy", function (d) { return y(d[y_ds]); })
                .attr("opacity", 1)
        // .style("fill", function (d) { return "#74add1;" }) //color
        .style("fill", function (d) { if (d.grade_auto == "Outlier") { return "Red" } else { if (d.grade_auto == "tbd") { return "Orange" } else { return "Green" } } }) //color
                }

    //// Draw the x Grid lines
    //svg.append("g")
    //    .attr("class", "grid")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(make_x_axis()
    //        .tickSize(-height, 0, 0)
    //        .tickFormat("")
    //    )
    //    d3.selectAll("input").on("change", change);
}

function d3mv_Line_chart_zoom(args) {

    //Todo: custom ticklines
    //Todo: add axis lables
    //Todo: configurable grid lines

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var dots = args.add_dots || false;
    var no_line = args.no_line || false;
    var xAxisTickValues = args.xAxisTickValues || "";

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;


    //  var parseDate = d3.time.format("%Y-%m-%d hh:mm:ss").parse;
    var x = d3.scaleLinear()//d3.time.scale()
        .range([0, width]);
    var x0 = d3.scaleLinear().range([0, width]);
    //    var x = d3.time.scale()
    //     .range([0, width]);


    var y = d3.scaleLinear()
        .range([height, 0]);

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" && k != "grade_auto" && k != "sensors_group" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });


    //var xAxis = d3.svg.axis()
    //    .scale(x)
    //    .orient("bottom")
    //    .innerTickSize(-height)
    //    .outerTickSize(0)
    //    .tickPadding(10);

    ////d3.range(0, 200, 28)
    //if (xAxisTickValues != "")
    //{ xAxis.tickValues(xAxisTickValues); }
    ////xAxis.tickValues(d3.range(0, 200, 28));
    //  // .tickValues([24, 48, 72, 96, 120, 144, 168]);;

    //var yAxis = d3.svg.axis()
    //    .scale(y)
    //    .orient("left")
    //     .innerTickSize(-width)
    //    .outerTickSize(0)
    //    .tickPadding(10);

    // setup zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 50])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var line = d3.line()
     //   .interpolate("basis")
        .x(function (d) { return x(d[x_ds]); })
        .y(function (d) { return y(d[y_ds]); });

    //// function for the x grid lines
    //function make_x_axis() {
    //    return d3.svg.axis()
    //        .scale(x)
    //        .orient("bottom")
    // //       .ticks(6)
    //        .tickValues([24, 48, 72, 96, 120, 144, 168]);
    //}

    var svg = d3.select("#" + chart).append("svg")
        .attr("id", chart + "_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return d[x_ds]; }));
    y.domain(d3.extent(data, function (d) { return d[y_ds]; }));


    var rect = svg.append("rect")
    .attr("class", "zoom")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

    // Create clip-path
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
       .append("rect")
        .attr("width", width)
        .attr("height", height);

    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);

    //svg.append("g")
    //    .attr("class", "y axis")
    //    .call(yAxis);

    var gX = svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
      //  .ticks(d3.time.minutes, 15)
      //.tickFormat(d3.time.format("%H:%M"))
        .call(d3.axisBottom(x));

    var gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temp (C)");

    // add line
    if (!no_line) {
        svg.append("path")
         .datum(data)
         .attr("class", "line")
         .attr("d", line)
         .attr("id", "line");
    }


    // Add circles 
    if (dots) {
        svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function (d) { return x(d[x_ds]); })
        .attr("cy", function (d) { return y(d[y_ds]); })
        .attr("opacity", 1)
// .style("fill", function (d) { return "#74add1;" }) //color
.style("fill", function (d) { if (d.grade_auto == "Outlier") { return "Red" } else { if (d.grade_auto == "tbd") { return "Orange" } else { return "Green" } } }) //color
    }

    //// Draw the x Grid lines
    //svg.append("g")
    //    .attr("class", "grid")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(make_x_axis()
    //        .tickSize(-height, 0, 0)
    //        .tickFormat("")
    //    )
    //    d3.selectAll("input").on("change", change);

    function zoomed() {
        var t = d3.event.transform, xt = t.rescaleX(x);
        g.select(".area").attr("d", area.x(function (d) { return xt(d.date); }));
        g.select(".axis--x").call(xAxis.scale(xt));
    }


    function zoomed() {
        var t = d3.event.transform;
        x.domain(t.rescaleX(x0).domain());
        //dims.forEach(dim => {
        //    var selector = ".line--" + dim;
        //    svg.select(selector)
        //      .attr("d", lines[dim]);
        //});

        svg.select(".line").attr("d", line)
        svg.select(".axis--x").call(d3.axisBottom(x));
    }

}


function d3mv_MultiLine_chart(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var dots = args.add_dots || false;
    var y_axis_lbl = args.y_axis_lbl || "";

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });


    // var parseDate = d3.time.format("%Y%m%d").parse;
    //  var parseDate = d3.time.format("%Y-%m-%d hh:mm:ss").parse;

    var x = d3.scaleLinear()//d3.time.scale()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    //var color = d3.scale.category10();
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
       // .interpolate("basis")
        .x(function (d) { return x(d[x_ds]); })
        .y(function (d) { return y(d.key); });

    var svg = d3.select("#" + chart).append("svg")
        .attr("id", "id_" + chart)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    color.domain(d3.keys(data[0]).filter(function (key) { return key !== x_ds; }));

    var lines = color.domain().map(function (name) {
        return {
            name: name,
            values: data.map(function (d) {
                return { id: d[x_ds], key: +d[name] };
            })
        };
    });

    x.domain(d3.extent(data, function (d) { return d.id; }));

    y.domain([
      d3.min(lines, function (c) { return d3.min(c.values, function (v) { return v.key; }); }),
      d3.max(lines, function (c) { return d3.max(c.values, function (v) { return v.key; }); })
    ]);

var gX = svg.append("g")
     .attr("class", "axis axis--x")
     .attr("transform", "translate(0," + height + ")")
   //  .ticks(d3.time.minutes, 15)
   //.tickFormat(d3.time.format("%H:%M"))
     .call(d3.axisBottom(x));

var gY = svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Temp (C)");


    var city = svg.selectAll(".city")
        .data(lines)
      .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function (d) { return line(d.values); })
        .style("stroke", function (d) { return color(d.name); });

    city.append("text")
        .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; })
        .attr("transform", function (d) { return "translate(" + x(d.value.id) + "," + y(d.value.key) + ")"; })
        .attr("x", 20 )
        .attr("dy", ".35em")
        .text(function (d) { return d.name; });
}

function d3mv_MultiLine_chart1(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var dots = args.add_dots || false;
    var y_axis_lbl = args.y_axis_lbl || "";



    var width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });

    var x = d3.scaleLinear()//d3.time.scale()
        .range([0, width]);

    //var x = d3.scale.ordinal()
    //  .domain(ds_col_to_array(data, x_ds))  // .domain(["apple", "orange", "banana", "grapefruit"])
    //  .rangePoints([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#" + chart).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //var xAxis = d3.svg.axis()
    //    .scale(x)
    //    .orient("bottom")
    //    .innerTickSize(-height)
    //    .outerTickSize(0)
    //    .tickValues([24, 48, 72, 96, 120, 144, 168])
    //    .tickPadding(10);

    //var yAxis = d3.svg.axis()
    //    .scale(y)
    //    .orient("left")
    //     .innerTickSize(-width)
    //    .outerTickSize(0)
    //    .tickPadding(10);




    var line = d3.line()
       // .interpolate("basis")
        .x(function (d) { return x(d[x_ds]); })
        .y(function (d) { return y(d.key); });

  

    color.domain(d3.keys(data[0]).filter(function (key) { return key !== x_ds; }));

    console.log(d3.keys(data[0]).filter(function (key) { return key !== x_ds; }));
    //data.forEach(function(d) {
    //    d.date = parseDate(d.date);
    //});

    var lines = color.domain().map(function (name, i) {
        return {
            name: name,
            id: i + 1,
            values: data.map(function (d) {
                return { id: d[x_ds], key: +d[name] };
            })
        };
    });

    console.log(lines);
    // console.log(lines.length);

    x.domain(d3.extent(data, function (d) { return d[x_ds]; }));

    y.domain([
      d3.min(lines, function (c) { return d3.min(c.values, function (v) { return v.key; }); }),
      d3.max(lines, function (c) { return d3.max(c.values, function (v) { return v.key; }); })
    ]);

    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);

    //svg.append("g")
    //    .attr("class", "y axis")
    //    .call(yAxis)

    //if (y_axis_lbl != "") {
    //    svg.append("text")
    //       .attr("transform", "rotate(-90)")
    //       .attr("y", 6)
    //       .attr("dy", ".71em")
    //       .style("text-anchor", "end")
    //       .text("y axis");
    //}


    var gX = svg.append("g")
     .attr("class", "axis axis--x")
     .attr("transform", "translate(0," + height + ")")
   //  .ticks(d3.time.minutes, 15)
   //.tickFormat(d3.time.format("%H:%M"))
     .call(d3.axisBottom(x));

    var gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temp (C)");



    var city = svg.selectAll(".city")
        .data(lines)
      .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
         .attr('id', function (d) { return "line_" + d.name; })
        .attr("d", function (d) { return line(d.values); })
        .style("stroke", function (d) { return color(d.name); });


    // Add the Legend
    //city.append("text")
    //    .attr("x", (legendSpace / 2) + legendSpace) // spacing
    //    .attr("y", height + (margin.bottom / 2) + 5)
    //    .attr("class", "legend")    // style the legend
    //    .style("fill", function () { // dynamic colours
    //        return d.color = color(d.name);
    //    })
    //    .text(d.key);

    var lines_count = lines.length;

    city.append("text")
        .datum(function (d) { return { name: d.name, id: d.id, value: d.values[d.values.length - 1] }; })
        //.attr("transform", function (d) { return "translate(" + x(d.value.id) + "," + y(d.value.key) + ")"; })
       // .attr("x", 3)
        .attr("class", "Legend")
        .attr("x", function (d) { return (d.id - 1) * width / lines_count }) // spacing
        .attr("y", height + (margin.bottom / 2) + 5)
        .style("fill", function (d) { // dynamic colours
            return d.color = color(d.name);
        })
        .attr("dy", ".50em")
        .text(function (d) { return d.name; });


}

function d3mv_ts_chart(args) {

    //Todo: d.Date is hardcoded!!!!!!!!!
    //Todo: Time formate is hardcoded!!!!!!!!!
    //Todo: custom ticklines
    //Todo: add axis lables
    //Todo: configurable grid lines

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var dots = args.add_dots || false;
    var no_line = args.no_line || false;
    var xAxisTickValues = args.xAxisTickValues || "";

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    //cl(data, "data")

    var parseTime = d3.timeParse("%Y-%m-%d");

    var x = d3.scaleTime()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
        d.Date = parseTime(d.Date);
    });
    
    var line = d3.line()
     //   .interpolate("basis")
        .x(function (d) { return x(d[x_ds]); })
        .y(function (d) { return y(d[y_ds]); });

    //// function for the x grid lines
    //function make_x_axis() {
    //    return d3.svg.axis()
    //        .scale(x)
    //        .orient("bottom")
    // //       .ticks(6)
    //        .tickValues([24, 48, 72, 96, 120, 144, 168]);
    //}

    var svg = d3.select("#" + chart).append("svg")
        .attr("id", chart + "_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return d[x_ds]; }));
    y.domain(d3.extent(data, function (d) { return d[y_ds]; }));

    var gX = svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
      //  .ticks(d3.time.minutes, 15)
      //.tickFormat(d3.time.format("%H:%M"))
        .call(d3.axisBottom(x));

    var gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temp (C)");

    // add line
    if (!no_line) {
        svg.append("path")
         .datum(data)
         .attr("class", "line")
         .attr("d", line)
    }

    // Add circles 
    if (dots) {
        svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function (d) { return x(d[x_ds]); })
        .attr("cy", function (d) { return y(d[y_ds]); })
        .attr("opacity", 1)
        .style("fill", function (d) { return "#74add1;" }) //color
    }
}

function d3mv_bar_chart(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var color = args.color || "#1f78b4";
    

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });

  //  var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var x = d3.scaleBand().range([0, width], .1);  //.domain(d3.range(data.length))


    var y = d3.scaleLinear()
        .range([height, 0]);

    //var xAxis = d3.svg.axis()
    //.scale(x)
    //.orient("bottom");

    //var yAxis = d3.svg.axis()
    //    .scale(y)
    //    .orient("left")
    //    .ticks(10, "%");

    var svg = d3.select("#" + chart).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function (d) { return d[x_ds]; }));
    y.domain([0, d3.max(data, function (d) { return d[y_ds]; })]);

    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);

    //svg.append("g")
    //    .attr("class", "y axis")
    //    .call(yAxis)
    //  .append("text")
    //    .attr("transform", "rotate(-90)")
    //    .attr("y", 6)
    //    .attr("dy", ".71em")
    //    .style("text-anchor", "end")
    //    .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d[x_ds]); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d[y_ds]); })
        .attr("height", function (d) { return height - y(d[y_ds]); });

    var gX = svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
  //  .ticks(d3.time.minutes, 15)
  //.tickFormat(d3.time.format("%H:%M"))
    .call(d3.axisBottom(x));

    var gY = svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temp (C)");


}

function d3mv_stacked_bar_chart(args) {

    var chart = args.chart;
    var data1 = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 40 };
   // var color = args.color || "#1f78b4";
    var colors = args.colors || d3.schemeCategory20;

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    var svg = d3.select("#" + chart).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var stack = d3.stack();

    var columns = Object.keys(data1[0]).slice(1);

    // adding total field
    for (var i in data1) {
        var row = data1[i];
        for (i = 0, t = 0; i < columns.length; ++i) t += row[columns[i]] = +row[columns[i]];
        row.total = t;
    }

    data1.sort(function (a, b) { return b.total - a.total; });

    x.domain(data1.map(function (d) { return d.State; }));
    y.domain([0, d3.max(data1, function (d) { return d.total; })]).nice();
    z.domain(columns);

    ccc = stack.keys(columns)(data1);

    g.selectAll(".serie")
      .data(ccc) //stack.keys(data.columns.slice(1))(data)
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function (d) { return z(d.key); })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
        .attr("x", function (d) { return x(d.data.State); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks(10).pop()))
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("fill", "#000")
        .text("Population");

    var legend = g.selectAll(".legend")
      .data(columns.reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
        .style("font", "10px sans-serif");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function (d) { return d; });

    ccc = stack.keys(columns)(data1);

    g.selectAll(".serie")
      .data(ccc) 
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function (d) { return z(d.key); })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
        .attr("x", function (d) { return x(d.data.State); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks(10).pop()))
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("fill", "#000")
        .text("Population");

    var legend = g.selectAll(".legend")
      .data(columns.reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; })
        .style("font", "10px sans-serif");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function (d) { return d; });
}

function d3mv_scatter_plot(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var height = args.height || width / 1.618;
    var color = args.color || "#1f78b4";

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

      //tooltip
    var tooltip = d3.select("body").append("div")
                   .attr("class", "tooltip")
                   .style("opacity", 0);

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" && k != "grade_auto" && k != "sensors_group" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });


        var x = d3.scaleLinear()
                 .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x).ticks(12),
            yAxis = d3.axisLeft(y).ticks(12 * height / width);

        var svg = d3.select("#" + chart).append("svg")
                 .attr("id", chart + "_svg")
                 .attr("data-margin-right", margin.right)
                 .attr("data-margin-left", margin.left)
                 .attr("data-margin-top", margin.top)
                 .attr("data-margin-bottom", margin.bottom)
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                 .append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function (d) { return d[x_ds]; })).nice();
        //console.log(d3.extent(data, function (d) { return d[x_ds]; }));
        y.domain(d3.extent(data, function (d) { return d[y_ds]; })).nice();

        svg.append("g")
        .attr("class", "x axis ")
        .attr('id', "axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        //.append("text")
        //    .attr("class", "label")
        //    .attr("x", width)
        //    .attr("y", -6)
        //    .style("text-anchor", "end")
        //    .text("Time between Eruptions (min.)");


        svg.append("g")
            .attr("class", "y axis")
            .attr('id', "axis--y")
            .call(yAxis);
            //.append("text")
            //    .attr("class", "axis-title")
            //    .attr("transform", "rotate(-90)")
            //    .attr("y", 6)
            //    .attr("dy", ".71em")
            //    .style("text-anchor", "end")
            //    .text("Change in Price");



        svg.selectAll(".dot")
            .data(data)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function (d) { return x(d[x_ds]); })
            .attr("cy", function (d) { return y(d[y_ds]); })
            .attr("opacity", 0.5)
            .style("fill", color);
     

}

function d3mv_scatter_plot1(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var height = args.height || width / 1.618;
    var color = args.color || "#1f78b4";  //{col: "col name", colors:[]}

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    //tooltip
    var tooltip = d3.select("body").append("div")
                   .attr("class", "tooltip")
                   .style("opacity", 0);

    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" && k != "grade_auto" && k != "sensors_group" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });

    var x = d3.scaleLinear()
             .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x).ticks(12),
        yAxis = d3.axisLeft(y).ticks(12 * height / width);

    var svg = d3.select("#" + chart).append("svg")
             .attr("id", chart + "_svg")
             .attr("data-margin-right", margin.right)
             .attr("data-margin-left", margin.left)
             .attr("data-margin-top", margin.top)
             .attr("data-margin-bottom", margin.bottom)
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return d[x_ds]; })).nice();
    //console.log(d3.extent(data, function (d) { return d[x_ds]; }));
    y.domain(d3.extent(data, function (d) { return d[y_ds]; })).nice();

    svg.append("g")
    .attr("class", "x axis ")
    .attr('id', "axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    //.append("text")
    //    .attr("class", "label")
    //    .attr("x", width)
    //    .attr("y", -6)
    //    .style("text-anchor", "end")
    //    .text("Time between Eruptions (min.)");


    svg.append("g")
        .attr("class", "y axis")
        .attr('id', "axis--y")
        .call(yAxis);
    //.append("text")
    //    .attr("class", "axis-title")
    //    .attr("transform", "rotate(-90)")
    //    .attr("y", 6)
    //    .attr("dy", ".71em")
    //    .style("text-anchor", "end")
    //    .text("Change in Price");

    if (typeof (color) == "object")
    { var color_picker = d3.scaleLinear()
                .domain([0, 1])
                .range(color.range)
                .interpolate(d3.interpolateHcl); }


    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d[x_ds]); })
        .attr("cy", function (d) { return y(d[y_ds]); })
        .attr("opacity", 0.5)
        .style("fill", function (d) {
            if (typeof (color) == "string")
            { return color; }
            else
            { return color_picker(d[color["col"]]); }
        })
         .on("mouseover", function (d) {
             tooltip.transition()
                 .duration(500)
                 .style("opacity", .9);
             tooltip.html("x: " + d[x_ds] + "<br/>y: " + d[y_ds] + "<br/>id: " + d["id"])
                 .style("left", (d3.event.pageX + 20) + "px")
                 .style("top", (d3.event.pageY - 20) + "px");
             d3.select("#sensor_id").html(d["id"]);


             $("#sensor_id").val("sensor_id").trigger('change');

             // $("#id").val("-09-9-9 -09").trigger('change');
         })

    .on("mouseout", function (d) {
        tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    })
    .on("click", function (d) {
    });

   // typeof (42)



}

function d3mv_scatter_plot_gib(args) {

    var chart = args.chart;
    var data = args.data;
    var x_ds = args.x_ds;
    var y_ds = args.y_ds;
    var width = args.width || 500;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var height = args.height || width / 1.618;
    var color = args.color || "#1f78b4";

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    //tooltip
    var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

    var x = d3.scaleLinear()
         .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x).ticks(12),
        yAxis = d3.axisLeft(y).ticks(12 * height / width);

    var svg = d3.select("#" + chart).append("svg")
             .attr("id", "g1_svg")
             .attr("data-margin-right", margin.right)
             .attr("data-margin-left", margin.left)
             .attr("data-margin-top", margin.top)
             .attr("data-margin-bottom", margin.bottom)
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return d[x_ds]; })).nice();
    //console.log(d3.extent(data, function (d) { return d[x_ds]; }));
    y.domain(d3.extent(data, function (d) { return d[y_ds]; })).nice();

    svg.append("g")
    .attr("class", "x axis ")
    .attr('id', "axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr('id', "axis--y")
        .call(yAxis);

    var dot = svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function (d) { return x(d[x_ds]); })
        .attr("cy", function (d) { return y(d[y_ds]); })
        .attr("opacity", 0.7)
        .style("fill", "#4292c6");

    //svg.append("g")
    // .call(d3.brush().extent([[0, 0], [width, height]]).on("brush", brushed).on("end", brushended));


    //function brushed() {
    //    var s = d3.event.selection,
    //        x0 = s[0][0],
    //        y0 = s[0][1],
    //        dx = s[1][0] - x0,
    //        dy = s[1][1] - y0;
    //    // console.log(s);

    //    svg.selectAll('circle')
    //       .style("fill", function (d) {
    //           if (x(d.x) >= x0 && x(d.x) <= x0 + dx && y(d.y) >= y0 && y(d.y) <= y0 + dy)
    //           { return "#ec7014"; }
    //           else { return "#4292c6"; }
    //       });
    //}

    //function brushended() {
    //    if (!d3.event.selection) {
    //        svg.selectAll('circle')
    //          .transition()
    //          .duration(150)
    //          .ease(d3.easeLinear)
    //          .style("fill", "#4292c6");
    //    }
    //}


    //  //tooltip
    //  var tooltip = d3.select("body").append("div")
    //              .attr("class", "tooltip")
    //              .style("opacity", 0);

    //  var x = d3.scaleLinear()
    //      .range([0, width]);

    //  var y = d3.scaleLinear()
    //      .range([height, 0]);


    //  var xAxis = d3.axisBottom(x).ticks(12),
    //      yAxis = d3.axisLeft(y).ticks(12 * height / width);

    //  //var xAxis = d3.svg.axis()
    //  //    .scale(x)
    //  //    .orient("bottom").ticks(20);

    //  //var yAxis = d3.svg.axis()
    //  //    .scale(y)
    //  //    .orient("left")

    //  var svg = d3.select("#" + chart).append("svg")
    //  .attr("id", chart + "_svg")
    //            //.attr("data-margin-right", margin.right)
    //            //.attr("data-margin-left", margin.left)
    //            //.attr("data-margin-top", margin.top)
    //            //.attr("data-margin-bottom", margin.bottom)
    //  .attr("width", width + margin.left + margin.right)
    //  .attr("height", height + margin.top + margin.bottom)
    // // .call(d3.behavior.zoom().on("zoom", function () {
    ////      svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    // // }))
    //  .append("g")
    //  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  x.domain(d3.extent(data, function (d) { return d[x_ds]; })).nice();
    //  y.domain([d3.min(data, function (d) { return d[y_ds]; }), d3.max(data, function (d) { return d[y_ds]; })]).nice();


    //  var gX = svg.append("g")
    //  .attr("class", "axis axis--x")
    //  .attr("transform", "translate(0," + height + ")")

    ////  .ticks(d3.time.minutes, 15)
    ////.tickFormat(d3.time.format("%H:%M"))
    //  .call(xAxis);

    //  var gY = svg.append("g")
    //      .attr("class", "axis axis--y")
    //      .call(yAxis)
    //    .append("text")
    //      .attr("class", "axis-title")
    //      .attr("transform", "rotate(-90)")
    //      .attr("y", 6)
    //      .attr("dy", ".71em")
    //      .style("text-anchor", "end")
    //      .text("Temp (C)");
    //  //svg.append("g")
    //  //.attr("class", "x axis")
    //  //.attr('id', "Sum Square")
    //  //.attr("transform", "translate(0," + height + ")")
    //  //.call(xAxis);

    //  //svg.append("g")
    //  //    .attr("class", "y axis")
    //  //    .attr('id', "Sum")
    //  //    .call(yAxis);

    //  svg.selectAll(".dot")
    //      .data(data)
    //    .enter().append("circle")
    //      .attr("class", "dot")
    //      .attr("r", 4)
    //      .attr("cx", function (d) { return x(d[x_ds]); })
    //      .attr("cy", function (d) { return y(d[y_ds]); })
    //      .attr("opacity", 0.5)
    //      .style("fill", function (d) { return color; })
    //  .on("mouseover", function (d) {
    //      //    d3.select("#sensor_id").html(d[x_ds]);
    //      //    $("#sensor_id").val("sensor_id").trigger('change');
    //  })
    //  .on("mouseout", function (d) {
    //  })
    //  .on("click", function (d) {
    //  });

}

function d3mv_Histogram(args) {

    var chart = args.chart;
    var values = args.values;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var margin = args.margin || { top: 20, right: 20, bottom: 30, left: 50 };
    var add_text = args.add_text || false;
    var highlight = args.highlight || null;

    var formatCount = d3.format(",.0f");

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    // review: https://bl.ocks.org/mbostock/3048450
    //         https://bl.ocks.org/d3noob/96b74d0bd6d11427dd797892551a103c
    //         http://bl.ocks.org/bradoyler/6b6e481d97f5eac64c76c8ce1edc5f3f

   // cl(values, "values");

    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scaleLinear()
          .domain([min, max])
          .rangeRound([0, width]);

    //var x = d3.scaleLinear()
    //    .rangeRound([0, width]);

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (values);

    console.log("max" + max);
    console.log("min" + min);
    console.log(bins);
   
    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function (d) { return d.length; })])
        .range([height, 0]);

    var colors = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837']


    var svg = d3.select("#" + chart).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function (d) { return height - y(d.length); })
    //    .style("fill", "#f46d43");
    .style("fill", function (d) {
        // if (bins[0].x1 < 27 || bins[0].x0 > 27)
        if (highlight != null) {
            if (d.x1 >= highlight && d.x0 < highlight)
           { return colors[2]; }
        }
    //else
        //{ return colors[7]; }
    });

    if (add_text) {
        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -12)
            .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
            .attr("text-anchor", "middle")
            .text(function (d) { return formatCount(d.length); });
    }

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));


    //var xAxis = d3.svg.axis()
    //    .scale(x)
    //    .orient("bottom");


    //if (add_text) {
    //    bar.append("text")
    //        .attr("dy", ".75em")
    //        .attr("y", -12)
    //        .attr("x", (x(data[0].dx) - x(0)) / 2)
    //        .attr("text-anchor", "middle")
    //        .text(function (d) { return formatCount(d.y); });
    //}

    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(0," + height + ")")
    //    .call(xAxis);
 


}

function d3mv_box_plot(args) {

    var chart = args.chart;
    var data = args.data;
    var values = args.values;
    var width = args.width || 500;
    var margin = args.margin || { top: 10, right: 20, bottom: 20, left: 20 };
    var height = args.height || width / 1.618;
    var color = args.color || "#1f78b4";
    var highlight = args.highlight || null;
    var showAxis = args.showAxis || 1;          //TODO: change to true / false. passing argument issue

    
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    values = values.sort(function (a, b) { return a - b; });

    var min = d3.min(values),
    max = d3.max(values);
    median = d3.median(values);

    var q1 = d3.quantile(values, 0.25),
        q3 = d3.quantile(values, 0.75),
        w1 = median - 1.5 * (q3 - q1),
        w2 = median + 1.5 * (q3 - q1);

    //tooltip
    //var tooltip = d3.select("body").append("div")
    //               .attr("class", "tooltip")
    //               .style("opacity", 0);

    var x = d3.scaleLinear()
             .range([0, width]);

    var xAxis = d3.axisBottom(x).ticks(12);

    var svg = d3.select("#" + chart).append("svg")
             .attr("id", chart + "_svg")
             .attr("data-margin-right", margin.right)
             .attr("data-margin-left", margin.left)
             .attr("data-margin-top", margin.top)
             .attr("data-margin-bottom", margin.bottom)
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(values)).nice();


 
    if (showAxis==1) {
    svg.append("g")
    .attr("class", "x axis ")
    .attr('id', "axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    }

    if (showAxis == 1) {
        var boxplot_width = height * 0.5;
    }
    else {
        var boxplot_width = height * 0.9;
    }

    var y_loc = height * 0.5 - boxplot_width/2;

    svg.append("rect")
        .attr("x", x(q1))
        .attr("y", y_loc)
        .attr("width", x(q3) - x(q1))
        .attr("height", boxplot_width)
        .style("opacity", 1.0)
        .style("fill", "#e0e0e0");  //#74add1

    // add median line
    svg.append("line")
        .style("stroke", "black")
        .attr("x1", x(median))
        .attr("y1", y_loc)
        .attr("x2", x(median))
        .attr("y2", y_loc + boxplot_width);

    // add lower whisker line
    svg.append("line")
        .style("stroke", "black")
        .attr("x1", x(w1))
        .attr("y1", y_loc)
        .attr("x2", x(w1))
        .attr("y2", y_loc + boxplot_width);

    svg.append("line")
        .style("stroke", "black")
        .attr("x1", x(w1))
        .attr("y1", y_loc + boxplot_width/2)
        .attr("x2", x(q1))
        .attr("y2", y_loc + boxplot_width/2);


    // add upper whisker line
    svg.append("line")
        .style("stroke", "black")
        .attr("x1", x(w2))
        .attr("y1", y_loc)
        .attr("x2", x(w2))
        .attr("y2", y_loc + boxplot_width);

    svg.append("line")
        .style("stroke", "black")
        .attr("x1", x(q3))
        .attr("y1", y_loc + boxplot_width/2)
        .attr("x2", x(w2))
        .attr("y2", y_loc + boxplot_width/2);

    // adding dots
    svg.append("circle")
        .attr("cx", x(highlight))
        .attr("cy", y_loc + boxplot_width/2)
        .attr("r", 5)
        .style("opacity", 1.0)
        .style("fill", "#f46d43");

}

function d3mv_heatmap(args) {

    var chart = args.chart;
    var data = args.data;
    var width = args.width || 500;
    var margin = args.margin || { top: 15, right: 15, bottom: 15, left: 15 };
    var cm = args.cm || false;
  //  var height = args.height || width / 1.618;
  //  var add_text = args.add_text || false;
   

    width = width - margin.left - margin.right,
    height = width;
    
    data.forEach(function (d) {                             //Todo - configurable date field
        Object.keys(data[0]).filter(function (k) { return k != "Date" }).forEach(function (k) {
            d[k] = +d[k];
        });
    });


    var colorRange = ['#d73027', '#e0e0e0', '#4575b4'];  //blue  red white
    var x = d3.scaleBand().domain(d3.range(data.length)).range([0, width]);
    var color = d3.scaleLinear().range(colorRange);

    if (cm)
    { color.domain([-1, 0, 1]); }
    else
    {

       // Object.keys(data[0]).forEach(function (k) {
       //         //d[k] = +d[k];
       //         return d3.max(d[k]);
       //     });
       
        color.domain([-1, 0, 9]);
       //console.log(xxx);

       // var max = d3.max(data, function (d) {
       //     return d3.max(d);
       // });
       // console.log("max dfs");
       // console.log(max);
       // var min = d3.min(data, function (d) {
       //     return d3.min(d);
       // });

       // console.log("min");
       // console.log(min);
       // color.domain([min, (max-min)/2, max]);
    }
   
    var svg = d3.select("#" + chart).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
            //.call(d3.behavior.zoom().on("zoom", function () {
            //    svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
            //}))

        .append("g")
     //   .attr("transform", "translate(" + (margin) + "," + (margin) + ")");
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //console.log(data);
    var row = svg.selectAll(".row")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "row")
        .attr("transform", function (d, i) { return "translate(0," + x(i) + ")"; })
        .each(row);

    var column = svg.selectAll(".column")
        .data(data)
        .enter().append("g")
        .attr("class", "column")
        .attr("transform", function (d, i) { return "translate(" + x(i) + ")rotate(-90)"; });


    function row(row) {

        var array = Object.keys(row).map(function (k) { return row[k]; });
        array.shift();

        var cell = d3.select(this).selectAll(".cell")
            .data(array)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", function (d, i) { return x(i); })
            .attr("width", x.bandwidth())
            .attr("height", x.bandwidth())
            .style("fill", function (d) { return color(d); });

    }



  //  d3.csv('data/cor/cor_bicovm_week9.csv', function (error, data) {
    //    if (error) return console.log(error);

   ////     ////console.log(data);
   ////     var row = svg.selectAll(".row")
   ////         .data(data)
   ////         .enter()
   ////         .append("g")
   ////         .attr("class", "row")
   ////         .attr("transform", function (d, i) { return "translate(0," + x(i) + ")"; })
   ////         .each(row);

   ////     var column = svg.selectAll(".column")
   ////         .data(data)
   ////         .enter().append("g")
   ////         .attr("class", "column")
   ////         .attr("transform", function (d, i) { return "translate(" + x(i) + ")rotate(-90)"; });


   ////     function row(row) {

   ////         var array = Object.keys(row).map(function (k) { return row[k]; });
   ////         array.shift();

   ////         var cell = d3.select(this).selectAll(".cell")
   ////             .data(array)
   ////             .enter()
   ////             .append("rect")
   ////             .attr("class", "cell")
   ////             .attr("x", function (d, i) { return x(i); })
   ////             .attr("width", x.range())
   ////             .attr("height", x.range())
   ////             .style("fill", function (d) { return color(d); });

   ////     }

   ////// })





   //// //var max = d3.max(values);
   //// //var min = d3.min(values);
   //// //var x = d3.scaleLinear()
   //// //      .domain([min, max])
   //// //      .rangeRound([0, width]);

   //// //var bins = d3.histogram()
   //// //    .domain(x.domain())
   //// //    .thresholds(x.ticks(20))
   //// //    (values);

   //// //console.log("max" + max);
   //// //console.log("min" + min);
   //// //console.log(bins);

   //// //var y = d3.scaleLinear()
   //// //    .domain([0, d3.max(bins, function (d) { return d.length; })])
   //// //    .range([height, 0]);

   //// //var colors = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837']


   //// //var svg = d3.select("#" + chart).append("svg")
   //// //    .attr("width", width + margin.left + margin.right)
   //// //    .attr("height", height + margin.top + margin.bottom)
   //// //  .append("g")
   //// //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   //// //var bar = svg.selectAll(".bar")
   //// //    .data(bins)
   //// //  .enter().append("g")
   //// //    .attr("class", "bar")
   //// //    .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

   //// //bar.append("rect")
   //// //    .attr("x", 1)
   //// //    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
   //// //    .attr("height", function (d) { return height - y(d.length); })
   //// ////    .style("fill", "#f46d43");
   //// //.style("fill", function (d) {
   //// //    // if (bins[0].x1 < 27 || bins[0].x0 > 27)
   //// //    if (highlight != null) {
   //// //        if (d.x1 >= highlight && d.x0 < highlight)
   //// //        { return colors[2]; }
   //// //    }
   //// //    //else
   //// //    //{ return colors[7]; }
   //// //});

   //// //if (add_text) {
   //// //    bar.append("text")
   //// //        .attr("dy", ".75em")
   //// //        .attr("y", -12)
   //// //        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
   //// //        .attr("text-anchor", "middle")
   //// //        .text(function (d) { return formatCount(d.length); });
   //// //}

   //// //svg.append("g")
   //// //    .attr("class", "axis axis--x")
   //// //    .attr("transform", "translate(0," + height + ")")
   //// //    .call(d3.axisBottom(x));

}


function d3mv_force_new(args) {

    var chart = args.chart;
    var node_att = args.nodes;
    var data = args.links;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var radius = args.radius || 4.5;
    var charge = args.charge || -40;
    var labels = args.labels || 0;
    //  var add_text = args.add_text || false;
    // Todo!! missing margins: { top: 15, right: 15, bottom: 15, left: 15 };

    var svg = d3.select("#" + chart).append("svg")
        .attr("width", width)
        .attr("height", height);

    //var k = Math.sqrt(10 / (width * height)); //root.nodes.length

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(function (d) { return d.value / 2; }))//
    .force("charge", d3.forceManyBody().strength(charge)) //- 120
    .force("center", d3.forceCenter(width / 2, height / 2));


    // Create links
    var links = [];
    links = data.map(function (d, i) {
        return {
            index: i + 1,
            source: d.from,
            target: d.to,
            value: +d.weight
        };
    });

    
    // console.log(links);
    function nodeByName(name) {
        return nodesByName[name] || (nodesByName[name] = { name: name });
    }

    // Create nodes for each unique source and target.
    var nodesByName = {};
    links.forEach(function (link, i) {
        link.source = nodeByName(link.source);
        link.target = nodeByName(link.target);
    });

    // Extract the array of nodes from the map by name.
    var nodes = d3.values(nodesByName);
    var result;
    nodes.forEach(function (node) {
            result = node_att.filter(function (d) {
                return node.name == d.name;  
            });
            node.color = (result[0] !== undefined) ? result[0].EigenvectorCentrality_10 : null;

    });


   // console.table(nodes);
    var graph = { "nodes": nodes, "links": links };



//    console.log("nodes");
  //  console.table(graph.nodes);
  //  console.log("links");
   // console.table(graph.links);


    var step = d3.scaleLinear()
             .domain([1, 8])
             .range([0, 1]);

    var color3 = d3.scaleLinear()
                    .domain([1, step(2), step(3), step(4), step(5), step(6), step(7), 20])
                    .range(['#1a9850','#66bd63', '#a6d96a','#d9ef8b','#fee08b', '#fdae61','#f46d43', '#d73027'])
                    .interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb
   

    //  console.log(graph.nodes);

    var link = svg.append("g")
       .attr("class", "links")
       .selectAll("line")
       .data(graph.links)
       .enter().append("line")
          .attr("stroke-width", 2);;   //function (d) { return Math.sqrt(d.value); }

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
       // .style("fill", "#2166ac")
        .style("fill", function (d) { return color3(d.color); })
        .attr("r", radius)
        .on("mouseover", function (d) {
            //tooltip.transition()
            //    .duration(500)
            //    .style("opacity", .9);
            //tooltip.html("x: " + d[x_ds] + "<br/>y: " + d[y_ds] + "<br/>id: " + d["id"])
            //    .style("left", (d3.event.pageX + 20) + "px")
            //    .style("top", (d3.event.pageY - 20) + "px");
            d3.select("#sensor_id").html(d["name"]);
            $("#sensor_id").val("sensor_id").trigger('change');

            // $("#id").val("-09-9-9 -09").trigger('change');
        })

    .on("mouseout", function (d) {
        //tooltip.transition()
        //       .duration(500)
        //       .style("opacity", 0);
    })
    .on("click", function (d) {
    })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
       

    if (labels !== 0) {

        var label = svg.append("g")
                       .attr("class", "labels")
                       .selectAll("text")
                       .data(graph.nodes)
                       .enter().append("text")
                        .attr("class", "label")
                        .text(function (d) { return d.name; });
    }
    //node.append("text")
    //  .attr("dx", 12)
    //  .attr("dy", ".35em")
    //  .text(function (d) { return d.name });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        if (labels !== 0) {
            label
                .attr("x", function (d) { return d.x - labels.x; })
                .attr("y", function (d) { return d.y + labels.y; })
                .style("font-size", labels.size).style("fill", labels.color);
        }
    }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        //simulation.fix(d);
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        //simulation.fix(d, d3.event.x, d3.event.y);
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        //simulation.unfix(d);
    }
}


function d3mv_force(args) {

    var chart = args.chart;
    var data = args.data;
    var width = args.width || 500;
    var height = args.height || width / 1.618;
    var radius = args.radius || 4.5;
    var charge = args.charge || -40;
    var labels = args.labels || 0;
    //  var add_text = args.add_text || false;
    // Todo!! missing margins: { top: 15, right: 15, bottom: 15, left: 15 };

    var svg = d3.select("#" + chart).append("svg")
        .attr("width", width)
        .attr("height", height);

    //var k = Math.sqrt(10 / (width * height)); //root.nodes.length

    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }).distance(function (d) { return d.value / 2; }))//
    .force("charge", d3.forceManyBody().strength(charge)) //- 120
    .force("center", d3.forceCenter(width / 2, height / 2));


    // Create links
    var links = [];
    links = data.map(function (d, i) {
        return {
            index: i + 1,
            source: d.from,
            target: d.to,
            value: +d.weight
        };
    });

    // console.log(links);
    function nodeByName(name) {
        return nodesByName[name] || (nodesByName[name] = { name: name });
    }

    // Create nodes for each unique source and target.
    var nodesByName = {};
    links.forEach(function (link, i) {
        link.source = nodeByName(link.source);
        link.target = nodeByName(link.target);
    });

    // Extract the array of nodes from the map by name.
    var nodes = d3.values(nodesByName);

    var graph = { "nodes": nodes, "links": links };

    //console.log("nodes");
    //console.table(graph.nodes);
    //console.log("links");
    //console.table(graph.links);

    var link = svg.append("g")
       .attr("class", "links")
       .selectAll("line")
       .data(graph.links)
       .enter().append("line")
          .attr("stroke-width", 2);;   //function (d) { return Math.sqrt(d.value); }

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .style("fill", "#2166ac")
        .attr("r", radius)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    
    if (labels !== 0) {

        var label = svg.append("g")
                       .attr("class", "labels")
                       .selectAll("text")
                       .data(graph.nodes)
                       .enter().append("text")
                        .attr("class", "label")
                        .text(function (d) { return d.name; });
    }
    //node.append("text")
    //  .attr("dx", 12)
    //  .attr("dy", ".35em")
    //  .text(function (d) { return d.name });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });
        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        if (labels !== 0) {
            label
                .attr("x", function (d) { return d.x - labels.x; })
                .attr("y", function (d) { return d.y + labels.y; })
                .style("font-size", labels.size).style("fill", labels.color);
           }
        }
    

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        //simulation.fix(d);
    }

     function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
        //simulation.fix(d, d3.event.x, d3.event.y);
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        //simulation.unfix(d);
    }
}
//====================== Statistical ====================
