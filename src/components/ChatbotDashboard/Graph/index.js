import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Button } from '@material-ui/core'

import { db } from '../../../config'
import './Graph.css'

function Graph({ user }) {
    const [timestampsData, setTimestampsData] = useState([])
    const [hoursData, setHoursData] = useState([])

    useEffect(() => {
        const unsubscribe = db
            .collection('users')
            .doc(user)
            .collection('graph')
            .onSnapshot((snapshot) => {
                setTimestampsData(snapshot.docs.map((doc) => doc.data().timestamp))
            })
        return () => {
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        let hoursCount = new Array(24).fill(0)
        timestampsData.map(
            (timestamp) => (hoursCount[new Date(timestamp.toDate()).getHours()] += 1)
        )
        setHoursData(hoursCount)
    }, [timestampsData])

    const handleGraphReset = () => {
        if (window.prompt(`Type "RESET" to confirm`) === 'RESET') {
            db.collection('users')
                .doc(user)
                .collection('graph')
                .get()
                .then((docs) => {
                    docs.forEach((doc) => doc.ref.delete())
                })
        }
    }

    return (
        <div className="graph">
            <div className="graph__header">
                <h2>Graph</h2>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleGraphReset()}
                >
                    Reset Graph
                </Button>
            </div>

            <div className="graph__graphWrapper">
                {timestampsData.length ? (
                    <Line
                        data={{
                            labels: Array(24)
                                .fill()
                                .map((_, index) => `${index}-${index + 1}`),
                            datasets: [
                                {
                                    data: hoursData,
                                    label: 'Number of Queries',
                                    borderColor: '#3333ff',
                                    fill: true,
                                },
                            ],
                        }}
                        options={{
                            legend: false,
                            scales: {
                                xAxes: [
                                    {
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Hours (in 24hrs Clock)',
                                        },
                                    },
                                ],
                                yAxes: [
                                    {
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Number of Queries',
                                        },
                                        ticks: {
                                            beginAtZero: true,
                                            userCallback: (label) => {
                                                if (Math.floor(label) === label)
                                                    return label
                                            },
                                        },
                                    },
                                ],
                            },
                        }}
                    />
                ) : (
                    <h6>NO DATA TO PLOT GRAPH!</h6>
                )}
            </div>
        </div>
    )
}

export default Graph
