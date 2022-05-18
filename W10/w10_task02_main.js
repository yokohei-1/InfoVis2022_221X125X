d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: { top: 40, right: 40, bottom: 40, left: 40 }
        };

        const scatter_plot = new ScatterPlot(config, data);
        scatter_plot.update();
        let circles = document.getElementById('10');
        circles
            .on('mouseover', (e, d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });
    })
    .catch(error => {
        console.log(error);
    });

class ScatterPlot {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(10);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(15, ${self.inner_height + 5})`);

        self.xaxis_title = self.chart.append('g')
            .append("text")
            .attr("x", 80)
            .attr("y", 215)
            .text("X軸");

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(10);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(15, 5)`);

        self.yaxis_title = self.chart.append('g')
            .append("text")
            .attr("x", -120)
            .attr("y", -10)
            .text("Y軸")
            .attr("transform", "rotate(-90)");

        self.gragh_title = self.chart.append('g')
            .append("text")
            .attr("x", 50)
            .attr("y", -10)
            .text("グラフのタイトル");
    }

    update() {
        let self = this;

        const xmin = d3.min(self.data, d => d.x);
        const xmax = d3.max(self.data, d => d.x);
        self.xscale.domain([0, xmax]);

        const ymin = d3.min(self.data, d => d.y);
        const ymax = d3.max(self.data, d => d.y);
        self.yscale.domain([0, ymax]);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => d.r)
            .attr("id", d => d.id)
            .attr('transform', `translate(20, -5)`);

        self.xaxis_group
            .call(self.xaxis)

        self.yaxis_group
            .call(self.yaxis);

    }
}
