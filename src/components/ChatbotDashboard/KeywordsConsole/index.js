import React, { useState, useEffect } from 'react'
import { Button, Input, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import CancelIcon from '@material-ui/icons/Cancel'

import FormModal from './FormModal'
import { db, storage } from '../../../config'
import Entity from './Entity'

import './KeywordsConsole.css'

function KeywordsConsole({ user }) {
    const [isOpen, setIsOpen] = useState(false)
    const [keywordsData, setKeywordsData] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [entityToBeEdited, setEntityToBeEdited] = useState({})
    const [query, setQuery] = useState('')

    useEffect(() => {
        const unsubscribe = db
            .collection('users')
            .doc(user)
            .collection('keywords')
            .onSnapshot((snapshot) => {
                setKeywordsData(
                    snapshot.docs.map((doc) => ({
                        mainKeyword: doc.id,
                        message: doc.data().message,
                        supportKeywords: doc.data().supportKeywords,
                        options: doc.data().options,
                        links: doc.data().links,
                        fileUrl: doc.data().fileUrl,
                        fileName: doc.data().fileName,
                    }))
                )
            })
        return () => {
            unsubscribe()
        }
    }, [])

    const handleDelete = (id, fileName) => {
        if (window.confirm('Are you sure?')) {
            if (fileName) {
                storage
                    .ref(`users/${user}`)
                    .child(fileName)
                    .delete()
                    .catch((err) => alert(err.message))
            }

            db.collection('users')
                .doc(user)
                .collection('keywords')
                .doc(id)
                .delete()
                .then(() => alert('Keyword Deleted!!!'))
                .catch((err) => alert(err.message))
        }
    }

    const handleEdit = (entity) => {
        setIsEditing(true)
        setEntityToBeEdited(entity)
        setIsOpen(true)
    }

    return (
        <>
            <div className="keywordsConsole">
                <div className="keywordsConsole__header">
                    <h2 className="keywordsConsole__heading">Keywords Console</h2>

                    <div className="keywordsConsole__searchBar">
                        <Input
                            type="text"
                            placeholder="Search Keywords..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query ? (
                            <IconButton onClick={() => setQuery('')}>
                                <CancelIcon />
                            </IconButton>
                        ) : (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        )}
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsOpen(true)}
                    >
                        Add New
                    </Button>
                </div>

                <div className="keywordsConsole__keywordsContainer">
                    {keywordsData
                        .filter((keywordData) => {
                            if (query) {
                                // checking for match in main keywords
                                if (
                                    keywordData.mainKeyword
                                        .toLowerCase()
                                        .trim()
                                        .includes(query.toLowerCase().trim())
                                )
                                    return keywordData
                                else {
                                    // checking for match in supporting keywords
                                    let supportKeywordsMatched = keywordData.supportKeywords.map(
                                        (keyword) => {
                                            if (
                                                keyword
                                                    .toLowerCase()
                                                    .trim()
                                                    .includes(query.toLowerCase().trim())
                                            )
                                                return keywordData
                                            else return null
                                        }
                                    )
                                    supportKeywordsMatched = supportKeywordsMatched.filter(
                                        (keyword) => keyword !== null
                                    )
                                    if (supportKeywordsMatched.length)
                                        return supportKeywordsMatched[0]
                                }
                            } else return keywordData
                        })
                        .map((keywordData) => (
                            <Entity
                                key={keywordData.mainKeyword}
                                {...keywordData}
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                            />
                        ))}
                </div>
            </div>

            <FormModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                entity={entityToBeEdited}
                user={user}
            />
        </>
    )
}

export default KeywordsConsole
