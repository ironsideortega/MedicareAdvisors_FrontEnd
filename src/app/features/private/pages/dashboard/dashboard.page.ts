import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import * as Chart from 'chart.js';
import { KPIService } from "src/app/core/services/dashboard/dashboard.service";
import { DataKPIContact, DataKPIGender } from "src/app/core/services/dashboard/models";
declare var $: any;
import * as pbi from 'powerbi-client';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexPlotOptions, ApexXAxis } from "ng-apexcharts";
import { ChartComponent } from "ng-apexcharts";
import * as ApexCharts from 'apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  colors: any;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  title: any;
  legend: ApexLegend;
  grid: ApexGrid;
};

export type ChartOptionsDonuts = {
  series: any;
  chart: any;
  xaxis: any;
  colors: any;
  plotOptions: any;
  labels: any;
  responsive: any;
  title: any;
  dataLabels: any;
  legend: any;
  tooltip: any;
};


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})


export class DashboardPage implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  kpiContact: DataKPIContact[] = [];
  kpiGender: DataKPIGender[] = [];
  isLoading: boolean = false;
  userName: string = '';

  public chartOptions: Partial<ChartOptions> = {
    series: [{
      name: 'Valores',
      data: []
    }],
    chart: {
      type: 'bar',
      height: 350
    },
    xaxis: {
      categories: []
    },
    dataLabels: {
      enabled: true,
      formatter: function(val: number) {
        return val.toString()
      },
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        colors: ['#000000']
      },
      offsetY: -20,
    },
    colors: ['#246FC2', '#B8D0EB'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "47px"
      }
    }
  };

  public chartOptionsDonuts!: Partial<ChartOptionsDonuts>;
  public chartSeries!: any[];

  totalContacts: number = 0;

  constructor(
    private kpiService: KPIService,
    private cdr: ChangeDetectorRef

  ) {



  }




  ngOnInit(): void {
    this.initializeChartOptions();

    this.getKpiForContact();
    this.getKpiForGender();
    this.getKpiChartBar();
    this.userName = this.getName();
  }

  private initializeChartOptions(): void {
    this.chartOptionsDonuts = {
      series: [],
      chart: {
        width: '100%',
        height: 350,
        type: 'donut',
      },
      colors: ['#147AD6', '#79D2DE', '#EC6666'],
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
      },
      labels: [],
      plotOptions: {
        pie: {
          donut: {
            size: '80%',
            distributed: true,
            borderRadius: 8,
            labels: {
              show: true,
              name: {
                show: true
              },
              value: {
                show: false
              },
              total: {
                show: true,
                label: 'Gender',
                color: '#061f3a'
              }
            }
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
              show: true,
            },
          },
        },
      ],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
    };
  }

  chargeDonuts(dataDonuts: any, labelDonuts: any) {
    this.chartOptionsDonuts = {
      series: dataDonuts,
      chart: {
        width: '100%',
        height: 120,
        type: 'donut',
        redrawOnParentResize: true,
        redrawOnWindowResize: true
      },
      colors: ['#147AD6', '#79D2DE', '#EC6666'],
      dataLabels: {
        enabled: true,
        formatter: function(val: any, opts: any) {
          return opts.w.config.series[opts.seriesIndex]
        }
      },
      tooltip: {
        enabled: true,
      },
      labels: labelDonuts,
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function(w: { globals: { seriesTotals: number[] } }) {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                }
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              show: true,
              position: 'bottom',
              offsetY: 0
            }
          }
        }
      ],
      legend: {
        show: true,
        position: 'right',
        offsetY: -20,
        height: 200
      }
    };

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }


  chargeBar(dataBar: any, labelBar: any) {
    this.chartOptions = {
      series: [
        {
          name: 'Valores',
          data: dataBar
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        animations: {
          enabled: true
        },
        events: {
          mounted: (chart) => {
            chart.windowResizeHandler();
          }
        }
      },
      plotOptions: {
        bar: {
          distributed: false,
          borderRadius: 8,
          horizontal: false,
          columnWidth: "47px",
          dataLabels: {
            position: 'top',
          }
        }
      },
      xaxis: {
        categories: labelBar,
        labels: {
          style: {
            fontSize: '8px'
          },
          rotate: -45
        }
      },
      title: {
        text: ''
      },
      colors: ['#246FC2', '#B8D0EB'],
      dataLabels: {
        enabled: true,
        formatter: function(val: number) {
          return val.toString()
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#000000']
        },
        offsetY: -20,
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
    };
  }

  getKpiForContact() {
    this.isLoading = true;
    this.kpiService.getKpiForContact().subscribe(response => {
      console.log(response.data);

      this.kpiContact = response.data;
      this.isLoading = false;
      this.totalContacts = 0;
      this.kpiContact.forEach(kpi => {
        this.totalContacts += kpi.CNT;
      });
    });
  }

  labelGender: any[] = [];
  valueGender: any[] = [];

  getKpiForGender() {
    this.isLoading = true;
    this.kpiService.getKpiForGendert().subscribe({
      next: (response) => {
        this.kpiGender = response.data;
        this.labelGender = [];
        this.valueGender = [];

        response.data.forEach((e) => {
          let genderLabel = e.GenderValue;
          if (genderLabel === 'F') genderLabel = 'Feminine';
          else if (genderLabel === 'M') genderLabel = 'Masculine';

          this.labelGender.push(genderLabel);
          this.valueGender.push(e.CNT);
        });

        this.chargeDonuts(this.valueGender, this.labelGender);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading gender data:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getKpiChartBar() {
    return new Promise<void>((resolve) => {
      this.kpiService.getKpiForPopulation().subscribe({
        next: (response) => {
          const data = response.data[0];
          const categories = Object.keys(data);
          const values = Object.values(data);

          this.chargeBar(values, categories);

          // Esperar a que el DOM se actualice
          setTimeout(() => {
            if (this.chart) {
              this.chart.render();
              window.dispatchEvent(new Event('resize'));
            }
          }, 100);

          this.cdr.detectChanges();
          resolve();
        },
        error: (error) => {
          console.error('Error loading chart data:', error);
          resolve();
        }
      });
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

  embedPowerBIReport() {
    const embedConfig = {
      type: 'report',
      id: 'a5e9b8c1-124d-4c4a-b793-7c652d69ab3a', // ID del informe público
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=a5e9b8c1-124d-4c4a-b793-7c652d69ab3a&groupId=4e1b9a51-e9d8-4d65-b123-4a4ff6b1a01c',
      accessToken: '', // No es necesario un token para informes públicos
      tokenType: pbi.models.TokenType.Aad, // Tipo de token adecuado para informes públicos
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false
      }
    };

    const reportContainer = document.getElementById('reportContainer');
    const powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );

    powerbi.embed(reportContainer!, embedConfig);
  }

  ngAfterViewInit() {
    // Asegurarse de que el gráfico se renderice correctamente después de que la vista se inicialice
    setTimeout(() => {
      if (this.chart) {
        this.chart.render();
        window.dispatchEvent(new Event('resize'));
      }
    }, 100);
  }

}

