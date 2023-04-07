// ###1. Use the D3 library to read in samples.json from the URL###
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'



// ###2. create variable put out from json data and dropdown manu on <h5>Test Subject ID No.:</h5>###

let dropdownMenu = d3.select("#selDataset");

d3.json(url).then((data) => {

  let names = data.names;
  names.forEach((id) => {
    dropdownMenu
      .append("option")
      .text(id)
      .property("value", id);
  });
  // *****Learn idea for script*****
  // for (let i = 0; i < names.length; i++){
  //   dropdownMenu
  //     .append("option")
  //     .text(names[i])
  //     .property("value", names[i]);
  // };
  // ###function code####
  biuldmatadata(names[0])
  buildcharts(names[0])

})


function biuldmatadata(id) {
  let panel = d3.select("#sample-metadata");

  d3.json(url).then((data) => {

    let metaData = data.metadata;
    let resultArray = metaData.filter(sampleObj => sampleObj.id == id);
    console.log(resultArray)
    let result = resultArray[0];

    panel.html("")

    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  })
}

// ###Create option for pick up "id number" and connect to html, and create ""function""" under ""optionChanged""###
// ###check html -  <h5>Test Subject ID No.:</h5> / <select id="selDataset" onchange="optionChanged(this.value)">###
function optionChanged(id) {
  biuldmatadata(id)
  buildcharts(id)
}
// ###3.Create a bubble chart###
function buildcharts(id) {
  d3.json(url).then((data) => {

    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == id);
    let result = resultArray[0];

    let otuids = result.otu_ids
    let sampleValues = result.sample_values
    let otuLabels = result.otu_labels

    let yticks = otuids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
      {
        y: yticks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 100, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    let bubbleData = [
      {
        x: otuids,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // ###Advanced Challenge Assignment - Gauge Chart###
    // Create the trace for the gauge chart.
    // ### 4.create veriable for washing Frequency###.

    let metaData = data.metadata;
    let metaArray = metaData.filter(sampleObj => sampleObj.id == id);
    console.log(metaArray)
    let metaresult = metaArray[0];
    let washFrequency = parseFloat(metaresult.wfreq)
    console.log(washFrequency)

    let gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week " },
      gauge: {
        axis: { range: [0, 10], tickwidth: 4 },
        steps: [
          { range: [0, 2], color: "gray" },
          { range: [2, 4], color: "lightskyblue" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "orange" },
          { range: [8, 10], color: "red" },
        ]

      }
    }];

    // Create the layout for the gauge chart.
    let gaugeLayout = {
      width: 450,
      height: 445,
      margin: { t: 10, b: 10 }
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}

