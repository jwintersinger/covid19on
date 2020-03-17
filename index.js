"use strict";

var parseTime = d3.timeParse('%Y-%m-%d');

function _draw_plot(data, svg) {
  var margin = { top: 20, right: 20, bottom: 30, left: 50 };
  var plot = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var svg_width = svg.node().getBoundingClientRect().width;
  var svg_height = svg.node().getBoundingClientRect().height;
  var width = svg_width - margin.left - margin.right;
  var height = svg_height - margin.top - margin.bottom;

  var X = d3.scaleTime().range([0, width]);
  var Y = d3.scaleLinear().range([height, 0]);

  X.domain(d3.extent(data, function (d) {
    return d.date;
  }));
  Y.domain([0, d3.max(data, function (d) {
    return d.total_cases;
  })]);

  var valueline = d3.line().x(function (d) {
    let x = X(d.date);
    return x;
  }).y(function (d) {
    let y = Y(d.total_cases);
    return y;
  });

  var xaxis = d3.axisBottom(X)
    .tickFormat(d3.timeFormat('%b %-d'));
  if(data.length < 5) {
    xaxis.tickValues(data.map(d => d.date));
  } else {
    xaxis.ticks(10);
  }

  plot.append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', valueline);
  plot.append('g')
    .attr('class', 'axis x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xaxis);
  plot.append('g')
    .attr('class', 'axis y')
    .call(d3.axisLeft(Y));

  _annotate_plot(plot, margin, svg_height, X, Y);
}

function _annotate_plot(plot, margin, height, X, Y) {
  const annotations = [{
    note: { label: 'Something' },
    subject: {
      y1: margin.top,
      y2: height - margin.top - margin.bottom,
    },
    y: margin.top,
    data: { x: '2020-03-01' },
  }];

  const ann_type = d3.annotationCustomType(d3.annotationXYThreshold, {
    note: {
      lineType: 'none',
      orientation: 'top',
      align: 'middle',
    }
  });
  const make_anns = d3.annotation()
    .type(ann_type)
    .accessors({
      x: function(d) { console.log([d, parseTime(d.x), X(parseTime(d.x))]); return X(parseTime(d.x)); },
      y: d => Y(d.y)
    })
    .annotations(annotations)
    .textWrap(30);

  plot.append('g')
    .attr('class', 'ann_group')
    .call(make_anns);
}

function init_plot() {
  var svg = d3.select('#caseplot')
    .attr('width', '100%')
    .attr('height', '100vh');

  d3.csv('cases.csv', function (error, data) {
    if (error) throw error;

    data.forEach(function (d) {
      d.date = parseTime(d.date);
      d.total_cases = +d.total_cases;
    });

    _draw_plot(data, svg);
  });
}

init_plot();
