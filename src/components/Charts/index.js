import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            title:null
        }
    }
  componentDidMount() {
    let chart = am4core.create(`chartdiv-${this.props.index}`, am4charts.PieChart);

    chart.data = this.props.data;
      
      // Add and configure Series
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "title";

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div 
      id={`chartdiv-${this.props.index}`} 
      style={{ width: "100%", height: "150px" }}></div>
    );
  }
}

export default App;