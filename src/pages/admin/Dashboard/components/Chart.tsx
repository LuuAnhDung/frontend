import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import './Chart.scss';
import { useGetCourseSalesQuery, useGetNewSignupsQuery, useGetRevenueQuery } from '../../report.service';
import { ChartData } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Chart() {
  const chartName = useSelector((state: RootState) => state.report.chartName);
  const previousDaysSelected = useSelector((state: RootState) => state.report.previousDaysSelected);

  const { data: courseSalesData, isFetching: isCourseSalesFetching } = useGetCourseSalesQuery(previousDaysSelected);
  const { data: revenuesData, isFetching: isRevenuesFetching } = useGetRevenueQuery(previousDaysSelected);
  const { data: newSignupsData, isFetching: isNewSignupsFetching } = useGetNewSignupsQuery(previousDaysSelected);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      x: {
        ticks: {
          callback: function (value: any) {
            // Use the labels array directly to get the corresponding label
            const label = labels[value];
            return dayjs(label).format('DD MMM');
          }
        },
        grid: {
          display: false
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 200 // Adjust this value to control y-axis interval
        },
      }
    }
  };
  

  let labels: string[] = [];
  let labelChartName = '';
  let chartData: number[] = [];
  switch (chartName) {
    case 'revenues':
      labels = revenuesData?.labels || [];
      chartData = revenuesData?.data || [];
      labelChartName = 'Revenue';
      break;
    case 'course-sales':
      labels = courseSalesData?.labels || [];
      chartData = courseSalesData?.data || [];
      labelChartName = 'Course Sales';
      break;
    case 'new-signups':
      labels = newSignupsData?.labels || [];
      chartData = newSignupsData?.data || [];
      labelChartName = 'New Signups';
      break;
    default:
      break;
  }

  // const data = {
  const data: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        label: labelChartName,
        data: chartData,
        borderColor: '#194583',
        backgroundColor: 'rgba(25, 69, 131, 1)',
        hoverBorderColor: '#1a6cb0',
        hoverBackgroundColor: 'rgba(25, 69, 131, 0.6)',
        barThickness: 'flex',
        maxBarThickness: 40
        // borderColor: '#EC6666',
        // backgroundColor: 'rgba(236, 102, 102, 0.5)',
        // barThickness: 40, // Adjust bar thickness here
      }
    ]
  };

  return <Bar className="chart" options={options} data={data} />;
}

// import dayjs from 'dayjs';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import { faker } from '@faker-js/faker';
// import './Chart.scss';
// import { useGetCourseSalesQuery, useGetNewSignupsQuery, useGetRevenueQuery } from '../../report.service';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../../store/store';
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// export default function Chart() {
//   const chartName = useSelector((state: RootState) => state.report.chartName);
//   const previousDaysSelected = useSelector((state: RootState) => state.report.previousDaysSelected);

//   const { data: courseSalesData, isFetching: isCourseSalesFetching } = useGetCourseSalesQuery(previousDaysSelected);

//   const { data: revenuesData, isFetching: isRevenuesFetching } = useGetRevenueQuery(previousDaysSelected);

//   const { data: newSignupsData, isFetching: isNewSignupsFetching } = useGetNewSignupsQuery(previousDaysSelected);

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top' as const
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 200 // Adjust this value to control the interval between steps on the y-axis
//         }
//       }
//     }
//   };

//   // const labels = courseSalesData?.labels;

//   let labels: string[] = [];
//   let labelChartName = '';
//   let chartData: number[] = [];
//   switch (chartName) {
//     case 'revenues':
//       labels = revenuesData?.labels || [];
//       chartData = revenuesData?.data || [];
//       labelChartName = 'revenue';
//       break;
//     case 'course-sales':
//       labels = courseSalesData?.labels || [];
//       chartData = courseSalesData?.data || [];
//       labelChartName = 'course sales';
//       break;
//     case 'new-signups':
//       labels = newSignupsData?.labels || [];
//       chartData = newSignupsData?.data || [];
//       labelChartName = 'user';
//       break;

//     default:
//       break;
//   }

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: labelChartName,
//         data: chartData,
//         borderColor: '#EC6666',
//         backgroundColor: 'rgba(236, 102, 102, 0.5)'
//       }
//     ]
//   };

//   return <Line className='chart' options={options} data={data} />;
// }

