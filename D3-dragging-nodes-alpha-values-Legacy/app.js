var width = 600;
var height = 600;

var nodes = [
  { color: "red", size: 5, },
  { color: "orange", size: 10 },
  { color: "yellow", size: 15 },
  { color: "green", size: 20 },
  { color: "blue", size: 25 },
  { color: "purple", size: 30 }
];

var links = [
  { source: "red", target: "orange"},
  { source: "orange", target: "yellow"},
  { source: "yellow", target: "green"},
  { source: "green", target: "blue"},
  { source: "blue", target: "purple"},
  { source: "purple", target: "red"},
  { source: "green", target: "red"}
];

var svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height);

var linkSelection = svg 
                      .selectAll("line")
                      .data(links)
                      .enter()
                      .append("line")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1);

var nodeSelection = svg
                      .selectAll("circle")
                      .data(nodes)
                      .enter()
                      .append("circle")
                        .attr("r", d => d.size)
                        .attr("fill", d => d.color)
                        .call(d3.drag()
                              .on('start', dragStart)
                              .on('drag', drag)
                              .on('end', dragEnd));

var simulation = d3.forceSimulation(nodes);

simulation
  .force("center", d3.forceCenter(width / 2, height / 2))
  .force("nodes", d3.forceManyBody())
  .force("links", d3.forceLink(links)
                    .id(d => d.color)
                    .distance(d => 5 * ( d.source.size + d.target.size )))
  .on('tick', ticked);
         
function ticked() {
  console.log(simulation.alpha());
  /* 0.0010715193052376027
      0.001047128548050896
      0.0010232929922807507
      0.0009999999999999966
      proof it stops at a min val at some point*/
  nodeSelection
    .attr("cx", d => d.x )
    .attr("cy", d => d.y );

  linkSelection
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
}

//test-cases

//set position at start
function dragStart(d) {
  console.log("starting to drag!");
  d.fx = d.x;
  d.fy = d.y;
}

//update position
function drag(d) {
  console.log("dragging!");
  simulation.alpha(0.5).restart(); 
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

//return nulls when done.
function dragEnd(d) {
  console.log("done dragging!");
  d.fx = null;
  d.fy = null;
}

//in general this code stops working without general-update-pattern.
//due to simulation cooling. how a sim works : 
//forces are not applied continuously - otherwise charts would fly everywhere, never stabilize
//instead when sim starts, it calls alpha value for forces.
//after internal ticks, the alpha val decays until it reaches some min val.
//after alpha reaches minimum peak, it stops.
