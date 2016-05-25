function initGraphs(results){
  // build the graphs
  for(var i in graphs) {
    graphs[i](results);
  }
}

var graphs = {
  timeline: function(results) {
    var container = $('#timeline'),
      w = container.outerWidth(),
      h = w*(9/16);
    container.height(h)
  },

  opsys: function(results){
    var container = $('#opsys'),
      w = h = r = container.outerWidth();
    container.height(h)
  },

  orgs: function(results){
    // init the container dimensions and clear it out
    var container = $('#orgs'),
      w = h = container.outerWidth(),
      r = h/2;
    container.height(h).html('');

    // set the donut width, legend settings, and colors
    var dw = 75,
      legendSize = 18,
      legendSpace = 4,
      color = d3.scale.category20b();

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

    // update facet to include other
    var data = results.facets.org;
    data.push({
      'value': "Other",
      'count': results.total - data.map(function(obj) { return obj.count; }).reduce(function(tot, obj) { return tot+obj; })
    });

    // draw the pie pieces
    var path = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d,i) {
        if(d.data.value === 'Other'){
          return '#ccc';
        } else {
          return color(d.data.value);
        }
      });

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
        states: {
          hover: {
            color: "#B72712"
          }
        }
      }]
    });
  }
}
