// source from : https://gist.github.com/gazaston/b620796cc37ce544f23b8224f926a50d
var g_width;
var g_radius = 25;

var config = {
                "avatar_size": 100
            }

data = [
        { 
            posx: 0,
            posy: 100,
            img:"photos/tech-stack-icons/icon1.png", },
        { 
            posx: 200,
            posy: 200,
            img:"photos/tech-stack-icons/icon2.png", },
        { 
            posx: 300,
            posy: 300,
            img:"photos/tech-stack-icons/icon3.png", },
        { 
            posx: 400,
            posy: 400,
            img:"photos/tech-stack-icons/icon4.png", },
        { 
            posx: 500,
            posy: 500,
            img:"photos/tech-stack-icons/icon5.png", },
        { 
            posx: 300,
            posy: 400,
            img:"photos/tech-stack-icons/icon6.png", },
    ];

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

var svg = d3.select("#tech-stack").append("svg")
    .attr("width", width)
    .attr("height", height);

var defs = svg.append('svg:defs');

// svg.append('clipPath')
//    .attr('id','clipObj')  
//         .append('circle')
//          .attr('cx',config.avatar_size/2)
//           .attr('cy',config.avatar_size/2)
//          .attr('r',config.avatar_size/2);


// data.forEach(function(d,i){
//     svg.append('image')
//        .attr('xlink:href',d.img)
//        .attr('width',config.avatar_size)
//        .attr('height',config.avatar_size)
//           .attr('transform','translate('+parseInt(d.posx+config.avatar_size/2)+','+parseInt(d.posy+config.avatar_size/2)+')')
//        .attr('clip-path','url(#clipObj)');
//   });

svg.selectAll("circle")
    .data(nodes.slice(1))
    .enter().append("circle")
    .attr("class", "logo")
    .attr("r", function(d) { return d.radius; })
    .attr('xlink:href', d.img)
    .attr('width',config.avatar_size)
    .attr('height',config.avatar_size)

// svg.selectAll("circle")
//     .data(nodes.slice(1))
//     .enter().append("circle")
//     .attr("r", function(d) { return d.radius; })
//     .style("fill", function(d, i) { return color(i % 3); });

force.on("tick", function(e) {
  var q = d3.geom.quadtree(nodes),
      i = 0,
      n = nodes.length;

  while (++i < n) q.visit(collide(nodes[i]));

  svg.selectAll("circle")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
});

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