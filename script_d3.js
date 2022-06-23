// source from : https://bl.ocks.org/mbostock/3231307
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

var force = d3.layout.force()
.gravity(0.05)
.charge(function(d, i) { return i ? 0 : -2000; })
.nodes(nodes)
.size([width, height]);

force.start();

var canvas = d3.select("#tech-stack").append("canvas")
.attr("width", width)
.attr("height", height);

var context = canvas.node().getContext("2d");

var img=new Image();

img.src="https://upload.wikimedia.org/wikipedia/commons/5/55/John_William_Waterhouse_A_Mermaid.jpg";

force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
    i,
    d,
    n = nodes.length;

    for (i = 1; i < n; ++i) q.visit(collide(nodes[i]));

    context.clearRect(0, 0, width, height);
    context.fillStyle = "steelblue";
    context.beginPath();
    // context.drawImage(img,-250,-200, img.width*.7, img.height*.7);
    // context.globalCompositeOperation='destination-in';
    for (i = 1; i < n; ++i) {
        d = nodes[i];
        context.moveTo(d.x, d.y);
        context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
    }
    context.fill();
    // context.globalCompositeOperation='source-over';
});

window.addEventListener('resize', updateScreenWidth);

canvas.on("mousemove", function() {
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
