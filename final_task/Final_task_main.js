let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

d3.csv("https://yokohei-1.github.io/InfoVis2022_221X125X//final_task/Final_task_data.csv")
    .then(data => {
        input_data = data;
        input_data.forEach(d => {
            d.x = +d.x;
            d.y = +d.y;
        });

        const color_scale = d3.scaleOrdinal(d3.schemeCategory10);
        color_scale.domain(['全年代', '10代', '20代', '30代', '40代', '50代', '60代']);

        scatter_plot = new ScatterPlot({
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: { top: 10, right: 10, bottom: 50, left: 50 },
            xlabel: 'TV利用時間 [分]',
            ylabel: 'ネット利用時間 [分]',
            //cscale: color_scale
        }, input_data);
        scatter_plot.update();

        bar_chart = new BarChart({
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: { top: 10, right: 10, bottom: 50, left: 50 },
            xlabel: 'Species',
            //cscale: color_scale
        }, input_data);
        bar_chart.update();
    })
    .catch(error => {
        console.log(error);
    });

function Filter() {
    if (filter.length == 0) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter(d => filter.includes(d.species));
    }
    scatter_plot.update();
}
