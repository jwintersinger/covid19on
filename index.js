"use strict";

var parseTime = d3.timeParse('%Y-%m-%d');

function _make_line(X, Y) {
  const line = d3.line().x(function (d) {
    let x = X(d.date);
    return x;
  }).y(function (d) {
    let y = Y(d.total_cases);
    return y;
  });

  return line;
}

function _draw_plot(data, svg) {
  svg.html(null);

  var margin = { top: 20, right: 20, bottom: 60, left: 50 };
  var plot = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var svg_width = svg.node().getBoundingClientRect().width;
  var svg_height = svg.node().getBoundingClientRect().height;
  var width = svg_width - margin.left - margin.right;
  var height = svg_height - margin.top - margin.bottom;

  var xscale = d3.scaleTime().range([0, width])
    .domain(d3.extent(data, d => d.date));
  var yscale = d3.scaleLinear().range([height, 0]);

  var xaxis = d3.axisBottom(xscale)
    .tickFormat(d3.timeFormat('%b %-d'))
    .ticks(8);

  const curve = plot.append('path')
    .attr('class', 'line');
  plot.append('g')
    .attr('class', 'axis x')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xaxis)
    .selectAll('text')
    .attr('y', 0)
    .attr('x', 9)
    .attr('transform', 'rotate(45)')
    .style('text-anchor', 'start');
  const yaxis = plot.append('g')
    .attr('class', 'axis y');

  _annotate_plot(plot, margin, svg_height, xscale, yscale);

  const delay = 200;
  const total_steps = data.length;

  const reveal = function(step) {
    const max_y = data[step - 1].total_cases;
    yscale.domain([1, max_y]);
    curve.datum(data.slice(0, step))
      .transition()
      .duration(delay)
      .ease(d3.easeLinear)
      .attr('d', _make_line(xscale, yscale));
    yaxis.transition()
      .duration(delay)
      .ease(d3.easeLinear)
      .call(d3.axisLeft(yscale));

    if(step < total_steps) {
      window.setTimeout(reveal, 2*delay, step+1);
    }
  };
  reveal(1);
}

function _annotate_plot(plot, margin, height, X, Y) {
  const annotations = [{
    note: { label: 'Something' },
    subject: {
      y1: margin.top,
      y2: height - margin.top - margin.bottom,
    },
    y: margin.top,
    data: { x: '2020-03-12' },
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
      x: d => X(parseTime(d.x)),
      y: d => Y(d.y),
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
    window.addEventListener('resize', function() { _draw_plot(data, svg); });
  });
}

init_plot();
