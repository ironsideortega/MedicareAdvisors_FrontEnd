import {Component, OnInit} from "@angular/core";
import * as Chart from 'chart.js';
import { KPIService } from "src/app/core/services/dashboard/dashboard.service";
import { DataKPIContact, DataKPIGender } from "src/app/core/services/dashboard/models";
declare var $: any;

export type ChartOptions = {
  series: any;
  chart: any;
  xaxis: any;
  colors: any;
  plotOptions: any;
  dataLabels: any;
  title: any;
};


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})


export class DashboardPage implements OnInit{
  kpiContact:DataKPIContact[] = [];
  kpiGender:DataKPIGender[] = [];
  isLoading:boolean = false;
  userName:string = '';
  // public barChartOptions: any = {
  //   scaleShowVerticalLines: false,
  //   responsive: true,

  // };
  // public barChartLabels: string[] = [];
  // public barChartType: Chart.ChartType = 'bar';
  // public barChartLegend = false;

  // public barChartData: any[] = [];

  public chartOptions!: Partial<ChartOptions>;
  public chartSeries!: any[];

  constructor(
    private kpiService:KPIService,

  ) {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 0,
          horizontal: false
        }
      },
      dataLabels: {
        enabled: true,  // Habilitar etiquetas de datos
        formatter: function(val: any) {
          return val.toFixed(0); // Mostrar valores sin decimales
        },
        style: {
          colors: ['#000'] // Color del texto
        },
        offsetY: -20
      },
      xaxis: {
        categories: []
      },
      title: {
        text: 'Population Data'
      },
      colors: ['#FF4560', '#775DD0', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#00E396', '#FEB019']
    };
  }




  ngOnInit(): void {
    this.getKpiForContact();
    this.getKpiForGender();
    this.getKpiChartBar();
    this.userName = this.getName();
  }

  getKpiForContact(){
    this.isLoading = true;
    this.kpiService.getKpiForContact().subscribe(response =>{
      this.kpiContact = response.data;
      this.isLoading = false;
    });
  }

  getKpiForGender(){
    this.isLoading = true;
    this.kpiService.getKpiForGendert().subscribe(response =>{
      this.kpiGender = response.data;
      this.isLoading = false;
    });
  }

  getKpiChartBar(){
    this.kpiService.getKpiForPopulation().subscribe(response =>{
      const data = response.data[0];

      const categories = Object.keys(data);
      const values = Object.values(data);

      // Generar colores para cada barra
      const colors = values.map(() => this.getRandomColor());

      // Configurar las opciones del gráfico
      this.chartOptions = {
        ...this.chartOptions,
        series: [
          {
            name: 'Valores',
            data: values
          }
        ],
        xaxis: {
          categories: categories
        },
        //colors: colors
      };

    });
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // public chartClicked(e: any): void {
  //   // console.log(e);
  // }

  // public chartHovered(e: any): void {
  //   // console.log(e);
  // }

  // public randomize(): void {
  //   // Only Change 3 values
  //   const data = [
  //     Math.round(Math.random() * 100),
  //     59,
  //     80,
  //     (Math.random() * 100),
  //     56,
  //     (Math.random() * 100),
  //     40];
  //   const clone = JSON.parse(JSON.stringify(this.barChartData));
  //   clone[0].data = data;
  //   this.barChartData = clone;
  //   /**
  //    * (My guess), for Angular to recognize the change in the dataset
  //    * it has to change the dataset variable directly,
  //    * so one way around it, is to clone the data, change it and then
  //    * assign it;
  //    */
  // }


  getName(): string {
    const name = localStorage.getItem('name');
    return name || '';
  }


}
