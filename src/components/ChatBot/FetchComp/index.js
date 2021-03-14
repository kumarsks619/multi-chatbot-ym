import React, { useState, useEffect } from 'react'
import firebase from 'firebase'

import { db } from '../../../config'
import ResponseComp from '../ResponseComp'
import './FetchComp.css'

function FetchComp({ messageData, scrollIntoView, actionProvider }) {
    // Pull in that user's unique ID here, whose responses (basically the bot) we want to show.
    const [user, setUser] = useState(localStorage.getItem('userLoggedIn'))

    const [data, setData] = useState({})

    useEffect(() => {
        if (user) {
            db.collection('users')
                .doc(user)
                .collection('keywords')
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        // checking if the main keyword matches
                        if (messageData.includes(doc.id.toLowerCase().trim())) {
                            setData({ mainKeyword: doc.id, ...doc.data() })
                            throw 'FOUND'
                        }
                        // checking for support keywords
                        doc.data().supportKeywords.map((keyword) => {
                            if (messageData.includes(keyword.toLowerCase().trim())) {
                                setData({ mainKeyword: doc.id, ...doc.data() })
                                throw 'FOUND'
                            }
                        })
                        // if no match found
                        setData({
                            message: 'Please ask something relevant.',
                        })
                    })
                })
                .catch((err) => console.log(err))
        }
    }, [user])

    // to collect queries in database
    useEffect(() => {
        if (user) {
            db.collection('users').doc(user).collection('queries').add({
                query: messageData,
                count: 1,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }
    }, [user])

    // to collect the timestamps  ONLY for the Graph
    useEffect(() => {
        if (user) {
            db.collection('users').doc(user).collection('graph').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
        }
    }, [user])

    scrollIntoView()

    return (
        data && (
            <ResponseComp
                {...data}
                scrollIntoView={scrollIntoView}
                actionProvider={actionProvider}
            />
        )
    )
}

export default FetchComp
