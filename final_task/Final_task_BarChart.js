class BarChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        };
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

        self.xscale_net = d3.scaleLinear()
            .range([115, self.inner_width]);

        self.yscale_net = d3.scaleBand()
            .domain(self.data.map(d => d.year).reverse())
            .range([0, self.inner_height]);

        self.xscale_TV = d3.scaleLinear()
            .range([self.inner_width - 113, 0]);

        self.yscale_TV = d3.scaleBand()
            .range([0, self.inner_height]);

        self.xaxis_net = d3.axisBottom(self.xscale_net)
            .ticks(5)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group_net = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_net = d3.axisLeft(self.yscale_net)
            .ticks(5)
            .tickSize(0);

        self.yaxis_group_net = self.chart.append('g')
            .attr('transform', `translate(115, 0)`);

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.margin.left + self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .text(self.config.xlabel);

        const ylabel_space = 25;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -self.config.margin.top - self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text(self.config.ylabel)
            .attr('transform', `translate(255, -20)`);

        self.xaxis_TV = d3.axisBottom(self.xscale_TV)
            .ticks(5)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group_TV = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_TV = d3.axisRight(self.yscale_TV)
            .ticks(5)
            .tickSize(0);

        self.yaxis_group_TV = self.chart.append('g')
            .attr('transform', `translate(83, 0)`);

    }

    update() {
        let self = this;

        self.yvalue = d => d.year;
        self.xvalue1 = d => d.net_percent;
        self.xvalue2 = d => d.TV_percent;
        self.year = d => d.year;

        self.xscale_net.domain([50, 100]);

        self.xscale_TV.domain([50, 100]);

        self.xaxis_net.tickSizeOuter(0);

        self.render();
    }

    render() {
        let self = this;

        self.xaxis_group_net
            .call(self.xaxis_net);

        self.yaxis_group_net
            .call(self.yaxis_net);

        self.xaxis_group_TV
            .call(self.xaxis_TV);

        self.yaxis_group_TV
            .call(self.yaxis_TV);

        self.chart.selectAll("svg")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 115)
            .attr("y", d => self.yscale_net(d.year) + 10)
            .attr('fill', 'blue')
            .attr("width", d => self.xscale_net(d.net_percent) - 120)
            .attr("height", self.yscale_net.bandwidth() / 2);

        self.chart.selectAll("svg")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", d => self.xscale_TV(d.TV_percent))
            .attr("y", d => self.yscale_net(d.year) + 10)
            .attr('fill', 'red')
            .attr("width", function (d) { return self.inner_width - 113 - self.xscale_TV(d.TV_percent) })
            .attr("height", self.yscale_TV.bandwidth() / 10);

    }
}
