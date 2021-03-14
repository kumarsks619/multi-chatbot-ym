import React, { useState, useEffect } from 'react'
import {
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Input,
} from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import SearchIcon from '@material-ui/icons/Search'
import _ from 'lodash'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import { db } from '../../../config'
import './QueriesBoard.css'
import { generateDate, generateTime } from '../utils/generateDateTime'

function QueriesBoard({ user }) {
    const [queriesData, setQueriesData] = useState([])
    const [groupedQueries, setGroupedQueries] = useState({})
    const [search, setSearch] = useState('')
    const [chooseDate, setChooseDate] = useState(Date.now())
    const [dateQueriesData, setDateQueriesData] = useState([])

    useEffect(() => {
        const docRef = db.collection('users').doc(user).collection('queries')
        const unsubscribe = docRef.onSnapshot((snapshot) => {
            setQueriesData(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    query: doc.data().query,
                    count: doc.data().count,
                    timestamp: doc.data().timestamp,
                }))
            )
        })

        return () => {
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (chooseDate) {
            setDateQueriesData(
                queriesData.filter((queryData) => {
                    if (
                        new Date(queryData.timestamp.toDate()).setHours(0, 0, 0, 0) ===
                        new Date(chooseDate).setHours(0, 0, 0, 0)
                    )
                        return queryData
                })
            )
        }
    }, [queriesData, chooseDate])

    useEffect(() => {
        if (chooseDate)
            setGroupedQueries(_.groupBy(dateQueriesData, (queryData) => queryData.query))
        else setGroupedQueries(_.groupBy(queriesData, (queryData) => queryData.query))
    }, [chooseDate, dateQueriesData])

    const handleQueryDelete = (queryData) => {
        if (window.confirm('Are you sure?')) {
            const batch = db.batch()
            queryData.map((query) => {
                const docRef = db
                    .collection('users')
                    .doc(user)
                    .collection('queries')
                    .doc(query.id)
                batch.delete(docRef)
            })
            batch
                .commit()
                .then(() => alert('Query deleted successfully!'))
                .catch((err) => alert(err.message))
        }
    }

    return (
        <div className="queriesBoard">
            <div className="queriesBoard__header">
                <h2>Queries Data</h2>

                <div className="queriesBoard__searchBar">
                    <Input
                        type="text"
                        placeholder="Search Keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search ? (
                        <IconButton onClick={() => setSearch('')}>
                            <CancelIcon />
                        </IconButton>
                    ) : (
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                    )}
                </div>

                <div className="queriesBoard__datePicker">
                    {chooseDate && (
                        <IconButton onClick={() => setChooseDate(null)}>
                            <CancelIcon />
                        </IconButton>
                    )}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            autoOk
                            disableFuture
                            variant="inline"
                            inputVariant="outlined"
                            size="small"
                            format="dd/MM/yyyy"
                            label="Pick a Date"
                            helperText="to look at a particular day"
                            value={chooseDate}
                            onChange={setChooseDate}
                        />
                    </MuiPickersUtilsProvider>
                </div>
            </div>

            <div className="queriesBoard__tableWrapper">
                <table className="queriesBoard__table">
                    <thead className="queriesBoard__tableHeader">
                        <tr>
                            <th>Count</th>
                            <th>Query</th>
                            <th>Date - Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="queriesBoard__tableBody">
                        {_.orderBy(
                            Object.keys(groupedQueries),
                            (queryKey) => groupedQueries[queryKey].length,
                            'desc'
                        )
                            .filter((queryKey) => {
                                if (search) {
                                    if (queryKey.includes(search)) return queryKey
                                } else return queryKey
                            })
                            .map((queryKey) => {
                                return (
                                    <tr
                                        className="queriesBoard__row"
                                        key={groupedQueries[queryKey][0].id}
                                    >
                                        <td className="queriesBoard__countCol">
                                            <span>{groupedQueries[queryKey].length}</span>
                                        </td>
                                        <td className="queriesBoard__query">
                                            <p>{queryKey}</p>
                                        </td>
                                        <td className="queriesBoard__dateTime">
                                            <Accordion>
                                                <AccordionSummary
                                                    id={`${groupedQueries[queryKey][0].id}abc`}
                                                >
                                                    <div className="queriesBoard__current">
                                                        <span>
                                                            {generateDate(
                                                                _.orderBy(
                                                                    groupedQueries[
                                                                        queryKey
                                                                    ],
                                                                    (historyQuery) =>
                                                                        historyQuery.timestamp,
                                                                    'desc'
                                                                )[0].timestamp
                                                            )}
                                                        </span>
                                                        <span>
                                                            {generateTime(
                                                                _.orderBy(
                                                                    groupedQueries[
                                                                        queryKey
                                                                    ],
                                                                    (historyQuery) =>
                                                                        historyQuery.timestamp,
                                                                    'desc'
                                                                )[0].timestamp
                                                            )}
                                                        </span>
                                                    </div>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div className="queriesBoard__history">
                                                        {_.orderBy(
                                                            groupedQueries[queryKey],
                                                            (historyQuery) =>
                                                                historyQuery.timestamp,
                                                            'desc'
                                                        )
                                                            .slice(1)
                                                            .map((historyQuery) => (
                                                                <div
                                                                    className="queriesBoard__historyEntity"
                                                                    key={historyQuery.id}
                                                                >
                                                                    <span>
                                                                        {generateDate(
                                                                            historyQuery.timestamp
                                                                        )}
                                                                    </span>
                                                                    <span>
                                                                        {generateTime(
                                                                            historyQuery.timestamp
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        </td>
                                        <td className="queriesBoard__actions queriesBoard__colCentre">
                                            <IconButton
                                                onClick={() =>
                                                    handleQueryDelete(
                                                        groupedQueries[queryKey]
                                                    )
                                                }
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default QueriesBoard
