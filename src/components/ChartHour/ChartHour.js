import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2'
import classes from './ChartHour.module.css'

function ChartHour(props) {
    const [chartData, setChartData] = useState({})

    const chart = () => {
        setChartData({
            labels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            datasets: [
                {
                    label: 'Осадки',
                    data: [22, 22, '22', 50, 2],
                    backgroundColor: [
                        'rgba(9,65,239, .2)'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(9,65,239, 1)'

                }
            ]
        })
    }

    useEffect(() => {
        chart()
    }, [])
    return (
        <div>
        <div className={classes.ChartHour}>
            <Line data={chartData} options={{
                responsive: true,
                title: {text: 'Осадки в течение часа', display: true},
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 10,
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false
                            },
                            stacked: true
                        }
                    ],
                    xAxes: [
                        {
                            gridLines: {
                                display: false
                            }
                        }
                    ]
                }
            }} />
        </div>
        </div>
    )
}

export default ChartHour
