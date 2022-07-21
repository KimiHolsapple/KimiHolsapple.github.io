var g_width;
var g_radius = 25;

function updateScreenWidth() {

    g_width = (window.innerWidth) - (window.innerWidth*.5);
    if (window.innerWidth < 992) {
        g_width = window.innerWidth - window.innerWidth*.2;
        g_radius = g_width*.07
    }
}
updateScreenWidth();
var width = g_width,
    height = g_width*.9;

var nodes = d3.range(50).map(function() { return {radius: g_radius}; }),
root = nodes[0],
color = d3.scale.category10();

root.radius = 0;
root.fixed = true;

var svg = d3.select("#tech-stack").append("svg")
    .attr("width", width)
    .attr("height", height);


var force = d3.layout.force()
.gravity(0.05)
.charge(function(d, i) { return i ? 0 : -2000; })
.nodes(nodes)
.size([width, height]);

d3.json("graph.json", function(error, json) {
    if (error) throw error;
  
    force
        .nodes(json.nodes)
        .start();
  
    var node = svg.selectAll(".node")
        .data(json.nodes)
      .enter().append("g")
        .attr("class", "node")
        .call(force.drag);
  
    node.append("image")
        .attr("xlink:href", function(d) { return d.img })
        .attr("width", function(d) { return d.size*(g_width/1000) })
        .attr("height", function(d) { return d.size*(g_width/1000) });
  
    node.append("text")
        .attr("dx", 12)
        .attr("dy", "-1em")
        .text(function(d) { return d.name });
  
    force.on("tick", function() {
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
        
    // svg.on("mousemove", function() {
    // var p1 = d3.mouse(this);
    // root.px = p1[0];
    // root.py = p1[1];
    // force.resume();
    // });
  });

window.addEventListener('resize', updateScreenWidth);

svg.on("mousemove", function() {
var p1 = d3.mouse(this);
root.px = p1[0];
root.py = p1[1];
force.resume();
});

function collide(node) {
var r = node.radius + 16,
  nx1 = node.x - r,
  nx2 = node.x + r,
  ny1 = node.y - r,
  ny2 = node.y + r;
return function(quad, x1, y1, x2, y2) {
if (quad.point && (quad.point !== node)) {
  var x = node.x - quad.point.x,
      y = node.y - quad.point.y,
      l = Math.sqrt(x * x + y * y),
      r = node.radius + quad.point.radius;
  if (l < r) {
    l = (l - r) / l * .5;
    node.x -= x *= l;
    node.y -= y *= l;
    quad.point.x += x;
    quad.point.y += y;
  }
}
return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
};
}
