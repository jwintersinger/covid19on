"use strict";

var parseTime = d3.timeParse('%Y-%m-%d');

var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    height = 500 - margin.top - margin.bottom;
var maxWidth = 860 - margin.left - margin.right;
var width = 860 - margin.left - margin.right;

function _make_plot(data, svg) {
  var _x = d3.scaleTime().range([0, width]);
  var _y = d3.scaleLinear().range([height, 0]);

  _x.domain(d3.extent(data, function (d) {
    return d.date;
  }));
  _y.domain([0, d3.max(data, function (d) {
    return d.cases;
  })]);

  var valueline = d3.line().x(function (d) {
    let x = _x(d.date);
    return x;
  }).y(function (d) {
    let y = _y(d.cases);
    return y;
  });

  var xaxis = d3.axisBottom(_x)
    .tickFormat(d3.timeFormat('%b %-d'));
  if(data.length < 5) {
    xaxis.tickValues(data.map(d => d.date));
  } else {
    xaxis.ticks(10);
  }

  svg.append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', valueline);
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xaxis);
  svg.append('g')
    .call(d3.axisLeft(_y));
}

function init_plot() {
  var svg = d3.select('#caseplot')
    .attr('width', 960)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  d3.csv('cases.csv', function (error, data) {
    if (error) throw error;

    data.forEach(function (d) {
      d.date = parseTime(d.date);
      d.cases = +d.cases;
    });
    _make_plot(data, svg);
  });
}

init_plot();
