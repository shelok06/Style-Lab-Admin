import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ info }) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    
    let data1 = {
        labels: ['Deliverd', 'Not Deliverd'],
        datasets: [
            {
                data: [info.delivery, info.total - info.delivery],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    let data2 = {
        labels: ['Successful payment', 'Unsuccessful payment'],
        datasets: [
            {
                data: [info.payment, info.total - info.payment],
                backgroundColor: [
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };


    return (
        <>
            <Pie data={data1} />
            <Pie data={data2} />
        </>
    )
}

export default PieChart
