d3.csv("https://yokohei-1.github.io/InfoVis2022_221X125X/W08/task1_data.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: 128,
            margin: { top: 10, right: 10, bottom: 20, left: 60 }
        };

        const scatter_plot = new ScatterPlot(config, data);
        scatter_plot.update();
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
            radius: config.radius || Math.min(config.width, config.height) / 2,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

        self.pie = d3.pie()
            .value(d => d.value);

        self.arc = d3.arc()
            .innerRadius(0);

    }

    update() {
        let self = this;

        self.arc.outerRadius(self.config.radius);

        self.render();
    }

    render() {
        let self = this;

        self.svg.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('path')
            .attr('d', self.arc)
            .attr('fill', 'blue')
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        svg.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('text')
            .text(d => d.data.value) // 表示するテキスト
            .attr("transform", d => `translate(${arc.centroid(d)})`) // 扇型の中心に移動
            .style("text-anchor", "middle")
            .style("font-size", 20);
    }
}
