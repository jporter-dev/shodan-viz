function initGraphs(results){
  // build the graphs
  if(!results.error && results.total > 0){
    for(var i in graphs) {
      graphs[i](results);
    }
  }
}

var graphs = {
  opsys: function(results){
    var container = $('#opsys'),
      margin = {top: 20, right: 20, bottom: 60, left: 50}
      w = h = r = container.outerWidth();
    container.height(h).html('');

    // add margins for axes
    w = w - margin.left - margin.right;
    h = h - margin.top - margin.bottom;

    // set up the x and y axis
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, w], .1),
      y = d3.scale.linear()
        .range([h, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    // init graph
    var svg = d3.select("#opsys").append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // fetch data and colors
    var data = results.facets.os,
      color = ["#28568C", "#BDC9E2"]
    color = d3.scale.linear().range(color).domain([0, Object.keys(data).length-1]);

    // set the values of the graph
    x.domain(data.map(function(d) { return d.value; }));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // draw the x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.15em")

    // draw the y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("dx", '-35%')
        .style("text-anchor", "end")
        .text("Frequency");

    // draw the bars
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.value); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return h - y(d.count); })
        .attr("fill", function(d,i) {
          return color(i);
        });
  },

  orgs: function(results){
    // init the container dimensions and clear it out
    var container = $('#orgs'),
      w = h = container.outerWidth(),
      r = h/2;
    container.height(h).html('');

    // set the donut width, legend settings, and colors
    var dw = 40,
      legendSize = 18,
      legendSpace = 4;

    // update facet to include other
    var data = results.facets.org;
    data.push({
      'value': "Other",
      'count': results.total - data.map(function(obj) { return obj.count; }).reduce(function(tot, obj) { return tot+obj; })
    });

    // set the linear color range
    var color = ["#28568C", "#EEEEEE"]
    color = d3.scale.linear().range(color).domain([0, Object.keys(data).length-1]);

    // init the svg
    var svg = d3.select('#orgs')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .append('g')
      .attr('transform', 'translate('+ (w/2) +','+ (h/2) +')')

    // set up the arc and pie layout
    var arc = d3.svg.arc()
      .innerRadius(r-dw)
      .outerRadius(r)
    var pie = d3.layout.pie()
      .value(function(d){ return d.count });

    // create the tooltip
    var tooltip = d3.select('#orgs')
      .append('div')
      .attr('class', 'd3-tooltip');
    tooltip.append('div').attr('class', 'd3-label');
    tooltip.append('div').attr('class', 'count');


    // draw the pie pieces
    var path = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('stroke', '#fff')
      .attr('stroke-width', '3px')
      .attr('fill', function(d,i) {
        if(d.data.value === 'Other'){
          return '#ddd';
        } else {
          return color(i);
        }
      })

      // animate the pie
      path.transition().delay(function(d, i) { return i * 5; }).duration(500)
        .attrTween('d', function(d) {
           var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
           return function(t) {
               d.endAngle = i(t);
             return arc(d);
           }
        });

    // tooltip population and reset
    path.on('mouseover', function(d) {
      var pct = Math.round(1000*d.data.count/results.total);
      tooltip.select('.d3-label').html(d.data.value);
      tooltip.select('.count').html(d.data.count);
      tooltip.style('display', 'block');
    });

    path.on('mouseout', function() {
      tooltip.style('display', 'none');
    });
  },

  map: function(results) {
    $('#map').highcharts('Map', {
      title: false,
      chart: {
        backgroundColor: null
      },

      legend: {
        title: {
          text: 'Total Hits',
          style: {
            color: 'black'
          }
        }
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        },
        enableMouseWheelZoom: false
      },

      tooltip: {
        pointFormat: '{point.name}: <b>{point.value}</b>'
      },

      colorAxis: {
        type: 'logarithmic'
      },

      series: [{
        data: results.facets.country.map(function(obj){ return { 'value': obj.count, 'name': obj.value.toLowerCase() }; }),
        mapData: Highcharts.maps['custom/world'],
        joinBy: ['hc-key', 'name'],
        name: 'Countries',
        nullColor: '#fff',
        states: {
          hover: {
            color: "#B72712"
          }
        }
      }]
    });
  }
}
