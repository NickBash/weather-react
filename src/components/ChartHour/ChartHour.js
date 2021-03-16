import React, {useState, useEffect} from 'react'
import {Bar} from 'react-chartjs-2'
import classes from './ChartHour.module.css'

function ChartHour({time, precipitation}) {
    const [chartData, setChartData] = useState({})

    const chart = () => {
        setChartData({
            labels: time,
            datasets: [
                {
                    label: 'Осадки',
                    data: precipitation,
                    backgroundColor: [
                        'rgba(9,65,239, .2)'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(9,65,239, 1)'

                }
            ],
        })
    }

    useEffect(() => {
        chart()
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            {console.log(precipitation)}
        <div className={classes.ChartHour}>
            <Bar data={chartData} options={{
                responsive: true,
                title: {text: 'Осадки в течение часа', display: true},
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: true
                            },
                            stacked: true
                        }
                    ],
                    xAxes: [
                        {
                            gridLines: {
                                display: false
                            },
                        }
                    ]
                }
            }} />
        </div>
        </div>
    )
}

export default ChartHour
