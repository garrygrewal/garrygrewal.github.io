/*
function changeName(name) {
  document.getElementById("vis").innerHTML = name;
  updateGraphs(name);
}
*/

function updateGraphs(name) {
  var yourVlSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
    "data": {
      "name": "population-data",
      "url": "https://gist.githubusercontent.com/garrygrewal/4d1dea24ea198f385e5a8e816981c700/raw/861ce69ba694141bc7206375cb0476b1bca2956b/T10120191120121310.CSV",
      "format": {
        "type": "csv"
      }
    },
    "transform": [
      {
        "filter": {
          "field": "Geographic name",
          "equal": name
        }
      },
    ],
    "encoding": {
      "x": {
        "timeUnit": "Population, 2016",
        "type": "ordinal"
      },
      "y": {
        "aggregate": "sum",
        "field": "Population, 2016",
        "type": "quantitative"
      },
      "color": {
        "field": "Geographic name",
        "type": "nominal"
      }
    },
    "title": "Population in Canada - test",
    "mark": "bar"
  }
  vegaEmbed('#vis', yourVlSpec, {
    "actions": false //hide floating button
  });
}
