class ScatterPlot {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        }
        this.data = data.slice(0, 5);
        this.data2 = data.slice(5, 10);
        this.data3 = data.slice(10, 15);
        this.data4 = data.slice(15, 20);
        this.data5 = data.slice(20, 25);
        this.data4 = data.slice(25, 30);
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.area = d3.area()
            .x(d => d.year)
            .y(d => d.net_use);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.margin.left + self.inner_width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .text(self.config.xlabel);

        const ylabel_space = 45;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -self.config.margin.top - self.inner_height / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text(self.config.ylabel);
    }

    update() {
        let self = this;

        self.cvalue = d => d.age;
        self.xvalue = d => d.year;
        self.yvalue1 = d => d.net_use;
        self.yvalue2 = d => d.TV_use;
        self.year = d => d.year;

        const xmin = d3.min(self.data, self.xvalue);
        const xmax = d3.max(self.data, self.xvalue);
        self.xscale.domain([xmin, xmax]);

        const ymin1 = d3.min(self.data, self.yvalue1);
        const ymax1 = d3.max(self.data, self.yvalue1);

        const ymin2 = d3.min(self.data, self.yvalue2);
        const ymax2 = d3.max(self.data, self.yvalue2);

        const ymax = Math.max(ymax1, ymax2);
        const ymin = Math.min(ymin1, ymin2);
        self.yscale.domain([ymin, ymax]);

        self.render();
    }

    render() {
        let self = this;

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);

        self.svg.append('line')
            .attr('d', self.area(self.data))
            .attr('stroke', 'black');
    }
}
