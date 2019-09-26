function buildMetadata(sample) {
    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(sampleData) {
        // Use d3 to select the panel with id of `#sample-metadata`
        let samplePanel = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        samplePanel.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(sampleData).forEach(([key, value]) => {
            samplePanel.append("h5").text(`${key}: ${value}`);
        });

        // BONUS: Build the Gauge Chart
        // buildGauge(data.WFREQ);
    });
}

const slice = firstObs => {
    return firstObs.slice(0, 10);
};

function buildCharts(sample) {
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then(function(sampleData) {
        let otuIds = sampleData.otu_ids;
        let otuLabels = sampleData.otu_labels;
        let sampleValues = sampleData.sample_values;

        // @TODO: Build a Bubble Chart using the sample data
        let bubbleChart = [{
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            }
        }];

        let bubbleStyle = {
            margint: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "Otu ID" }
        };

        Plotly.plot("bubble", bubbleChart, bubbleStyle);

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).
        let pieChart = [{
            values: slice(sampleValues),
            labels: slice(otuIds),
            hovertext: slice(otuLabels),
            hoverinfo: "hovertext",
            type: "pie"
        }];

        let pieStyle = {
            margin: { t: 0, l: 0 }
        };

        Plotly.plot("pie", pieChart, pieStyle);
    });
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then(sampleNames => {
        sampleNames.forEach(sample => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();