// Generated by CoffeeScript 1.4.0
(function() {

  this.my_light_red = "#b90000";

  this.append_main = function(opts) {
    var main, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    if (opts == null) {
      opts = {};
    }
    if ((_ref = opts.element) == null) {
      opts.element = "svg:svg";
    }
    if ((_ref1 = opts.selector) == null) {
      opts.selector = "body";
    }
    if ((_ref2 = opts.background) == null) {
      opts.background = "#fff";
    }
    if ((_ref3 = opts.width) == null) {
      opts.width = 200;
    }
    if ((_ref4 = opts.height) == null) {
      opts.height = 200;
    }
    if ((_ref5 = opts.margin) == null) {
      opts.margin = 10;
    }
    main = d3.select(opts.selector).append(opts.element).attr({
      "width": opts.width,
      "height": opts.height
    }).style({
      'background': opts.background,
      'margin': opts.margin
    });
    if (opts.id) {
      main.attr("id", opts.id);
    }
    if (opts["class"]) {
      main.attr("class", opts["class"]);
    }
    main.width = opts.width;
    main.height = opts.height;
    main.svg = opts.selector;
    return main;
  };

  this.append_container = function(opts) {
    var container, _ref, _ref1;
    if (opts == null) {
      opts = {};
    }
    if ((_ref = opts.selector) == null) {
      opts.selector = "body";
    }
    if ((_ref1 = opts["class"]) == null) {
      opts["class"] = "container";
    }
    container = d3.select(opts.selector).append('div').attr("class", opts["class"]).style("overflow", "hidden");
    return container;
  };

  this.append_div = function(container, opts) {
    var div, _ref, _ref1;
    if (opts == null) {
      opts = {};
    }
    if ((_ref = opts.background) == null) {
      opts.background = my_light_red;
    }
    if ((_ref1 = opts.margin) == null) {
      opts.margin = 10;
    }
    div = d3.select(container.node()).append('div').style('background', opts.background).style('margin', opts.margin).style("float", "left");
    if (opts.id) {
      div.attr("id", opts.id);
    }
    if (opts["class"]) {
      div.attr("class", opts["class"]);
    }
    return div;
  };

  this.get_scales = function(width, height) {
    var scales;
    scales = {};
    scales.x = d3.scale.linear().domain([0, width]).range([0, width]);
    scales.y = d3.scale.linear().domain([0, height]).range([height, 0]);
    return scales;
  };

  this.append_plot = function(opts) {
    var plot, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    if (opts == null) {
      opts = {};
    }
    if ((_ref = opts.padding) == null) {
      opts.padding = {
        top: 20,
        right: 150,
        bottom: 30,
        left: 50
      };
    }
    if ((_ref1 = opts.width) == null) {
      opts.width = 400;
    }
    if ((_ref2 = opts.height) == null) {
      opts.height = 400;
    }
    if ((_ref3 = opts.axis_padding) == null) {
      opts.axis_padding = 20;
    }
    if ((_ref4 = opts.background) == null) {
      opts.background = "#fff";
    }
    if ((_ref5 = opts.x_domain) == null) {
      opts.x_domain = null;
    }
    if ((_ref6 = opts.y_domain) == null) {
      opts.y_domain = null;
    }
    if ((_ref7 = opts.title) == null) {
      opts.title = "";
    }
    if ((_ref8 = opts.xlab) == null) {
      opts.xlab = "";
    }
    if ((_ref9 = opts.ylab) == null) {
      opts.ylab = "";
    }
    opts.total_padding = d3.max([opts.padding.left + opts.padding.right, opts.padding.top + opts.padding.bottom]);
    opts.width = opts.width - opts.total_padding;
    opts.height = opts.height - opts.total_padding;
    plot = append_main({
      background: opts.background,
      id: opts.id,
      width: opts.width + opts.total_padding,
      height: opts.height + opts.total_padding,
      margin: 20
    });
    plot = plot.append("svg:g").attr("transform", "translate(" + opts.padding.left + "," + opts.padding.top + ")");
    plot.padding = opts.padding;
    plot.width = opts.width;
    plot.height = opts.height;
    plot.title = opts.title;
    plot.xlab = opts.xlab;
    plot.ylab = opts.ylab;
    plot.selector = opts.selector;
    plot.axes = {};
    plot.scales = get_scales(opts.width, opts.height);
    draw_title(plot);
    if (opts.x_domain != null) {
      plot.scales.x.domain(opts.x_domain);
      plot.scales.x = add_scale_padding(plot.scales.x);
      draw_x_axis(plot);
      draw_x_axis_label(plot);
    }
    if (opts.y_domain != null) {
      plot.scales.y.domain(opts.y_domain);
      plot.scales.y = add_scale_padding(plot.scales.y);
      draw_y_axis(plot);
      draw_y_axis_label(plot);
    }
    return plot;
  };

  this.draw_x_axis = function(plot, tick_values) {
    var _ref;
    if (tick_values == null) {
      tick_values = null;
    }
    if ((_ref = plot.orientation_x) == null) {
      plot.orientation_x = "bottom";
    }
    plot.axes.x = d3.svg.axis().scale(plot.scales.x).orient(plot.orientation_x);
    if (tick_values != null) {
      plot.axes.x.tickValues(tick_values);
    }
    plot.append("g").attr("class", "x axis").attr("transform", "translate(0," + plot.height + ")").call(plot.axes.x);
    plot.selectAll(".x.axis line, .x.axis path").style({
      "fill": "none",
      "stroke": "black",
      "shape-rendering": "crispEdges",
      "stroke-width": 2
    });
    return plot;
  };

  this.draw_y_axis = function(plot) {
    var _ref;
    if ((_ref = plot.orientation_y) == null) {
      plot.orientation_y = "left";
    }
    plot.axes.y = d3.svg.axis().scale(plot.scales.y).orient(plot.orientation_y);
    plot.append("g").attr("class", "y axis").call(plot.axes.y);
    plot.selectAll(".y.axis line, .y.axis path").style({
      "fill": "none",
      "stroke": "black",
      "shape-rendering": "crispEdges",
      "stroke-width": 2
    });
    return plot;
  };

  this.draw_title = function(plot) {
    return plot.append("text").text(plot.title).attr({
      "class": "title",
      "text-anchor": "middle",
      "x": plot.width / 2,
      "y": -plot.padding.top / 2
    });
  };

  this.draw_x_axis_label = function(plot) {
    return plot.append("text").text(plot.xlab).attr({
      "class": "x label",
      "text-anchor": "middle",
      "x": plot.width - plot.width / 2,
      "y": plot.height + plot.padding.bottom / 2,
      "dy": "2em"
    });
  };

  this.draw_y_axis_label = function(plot) {
    return plot.append("text").text(plot.ylab).attr({
      "class": "y label",
      "text-anchor": "middle",
      "x": 0 - (plot.height / 2),
      "y": -plot.padding.left + 5,
      "dy": "1em",
      "transform": "rotate(-90)"
    });
  };

  this.parent_of = function(child) {
    return d3.select(child).node().parentNode;
  };

  this.add_scale_padding = function(scale, padding) {
    var domain_with_padding, range;
    if (padding == null) {
      padding = 20;
    }
    if (typeof scale.rangePoints === "function") {
      return scale;
    } else {
      range = scale.range();
      if (range[0] > range[1]) {
        padding *= -1;
      }
      domain_with_padding = [range[0] - padding, range[1] + padding].map(scale.invert);
      return scale.domain(domain_with_padding);
    }
  };

}).call(this);
