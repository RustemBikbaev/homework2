import "babel-polyfill";
import Chart from "chart.js";

const MeteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

async function loadMeteo() 
{
  const response = await fetch(MeteoURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();
  const temperaturaData = parser.parseFromString(xmlTest, "text/xml");

  const time = temperaturaData.querySelectorAll("FORECAST[hour]");
  const temperatura = temperaturaData.querySelectorAll("TEMPERATURE[max]");
  const result = Object.create(null);

  for (let i = 0; i < time.length; i++) 
  {
    const timeTag = time.item(i);
    const temperaturaTag = temperatura.item(i);
    const hour = timeTag.getAttribute("hour");
    const temperature = temperaturaTag.getAttribute("max");
    result[hour] = temperature;
  }

  return result;
}

async function loadMeteo2() 
{
  const response = await fetch(MeteoURL);
  const xmlTest = await response.text();
  const parser = new DOMParser();

  const temperaturaData = parser.parseFromString(xmlTest, "text/xml");
  const time = temperaturaData.querySelectorAll("FORECAST[hour]");
  const temperatura = temperaturaData.querySelectorAll("HEAT[max]");
  const result = Object.create(null);

  for (let i = 0; i < time.length; i++) 
  {
    const timeTag = time.item(i);
    const temperaturaTag = temperatura.item(i);
    const hour = timeTag.getAttribute("hour");
    const temperature = temperaturaTag.getAttribute("max");
    result[hour] = temperature;
  }

  return result;
}

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");

buttonBuild.addEventListener("click", async function() 
{
  const tempData = await loadMeteo();
  const tempData_2 = await loadMeteo2();
  const keys = Object.keys(tempData);
  const keys_2 = Object.keys(tempData_2);

  const plotData = keys.map(key => tempData[key]);
  const plotData_2 = keys_2.map(key => tempData_2[key]);

  const chartConfig = {
    type: "line",

    data: {
      labels: keys,
      datasets: [
        {
          label: "Температура по ощущениям",
          backgroundColor: "rgba(20, 20, 255, 0.8)",
          borderColor: "rgb(0, 0, 100)",
          data: plotData_2
        },
        {
          label: "Температура",
          backgroundColor: "rgba(20, 255, 20, 0.8)",
          borderColor: "rgb(0, 200, 0)",
          data: plotData
        }
      ],
    },
    options : {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Температура, С'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Время, ч'
          }
        }]
      }
    }
    
  };

  if (window.chart) 
  {
    chart.data.labels = chartConfig.data.labels;
    chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
    chart.update({
      duration: 800,
      easing: "easeOutBounce"
    });
  } 
  else 
  {
    window.chart = new Chart(canvasCtx, chartConfig);
  }
});


