d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv", function (data) {
    var width = 256;
    var height = 128;
    var margin = { top: 10, right: 10, bottom: 20, left: 60 };

    var svg = d3.select('#drawing_region')
        .attr('width', width)
        .attr('height', height);

    var chart = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const inner_width = width - margin.left - margin.right;
    const inner_height = height - margin.top - margin.bottom;

    // Initialize axis scales
    const xscale = d3.scaleLinear()
        .domain([0, d3.max(10)])
        .range([0, inner_width]);

    const yscale = d3.scaleBand()
        .domain(data.map(function (d) { return d.text; }))
        .range([0, inner_height])
        .paddingInner(0.1);

    // Initialize axes
    const xaxis = d3.axisBottom(xscale)
        .ticks(5)
        .tickSizeOuter(0);

    const yaxis = d3.axisLeft(yscale)
        .tickSizeOuter(0);

    // Draw the axis
    const xaxis_group = chart.append('g')
        .attr('transform', `translate(0, ${inner_height})`)
        .call(xaxis);

    const yaxis_group = chart.append('g')
        .call(yaxis);

    // Draw bars
    chart.selectAll("rect").data(data).enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => yscale(function (d) { return d.text; }))
        .attr("width", d => xscale(function (d) { return d.x; }))
        .attr("height", yscale.bandwidth());

});
