import React, { useState, useEffect } from 'react'
import {
    Modal,
    TextField,
    FormGroup,
    Input,
    FormHelperText,
    IconButton,
    InputLabel,
    Button,
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import { db, storage } from '../../../../config'
import './FormModal.css'
import ProgressBar from '../../utils/ProgressBar'
import { getModalStyle, useStyles } from './styles'
import { useDynamicInputs } from '../../utils/useDynamicInputs'
import createFileName from '../../utils/createFileName'

function FormModal({ isOpen, setIsOpen, isEditing, setIsEditing, entity, user }) {
    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle)

    const [mainKeyword, setMainKeyword] = useState('')
    const [message, setMessage] = useState('')
    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState(null)

    // Dynamic form inputs
    const {
        values: supportKeywords,
        setValues: setSupportKeywords,
        createInputs: createSupportKeywords,
        handleInputAdd: handleSupportKeywordsInputAdd,
    } = useDynamicInputs([], 10, 'Support Keyword')
    const {
        values: options,
        setValues: setOptions,
        createInputs: createOptions,
        handleInputAdd: handleOptionsInputAdd,
    } = useDynamicInputs([], 100, 'Option')
    const {
        values: links,
        setValues: setLinks,
        createInputs: createLinks,
        handleInputAdd: handleLinksInputAdd,
    } = useDynamicInputs([], 1000, 'Link')

    useEffect(() => {
        if (isEditing) {
            setMainKeyword(entity.mainKeyword)
            setMessage(entity.message)
            setSupportKeywords(entity.supportKeywords)
            setOptions(entity.options)
            setLinks(entity.links)
            if (entity.fileUrl) {
                setFile('EXIST')
            }
        } else {
            handleModalClose()
        }
    }, [isEditing])

    const handleModalClose = () => {
        setMainKeyword('')
        setMessage('')
        setSupportKeywords([])
        setOptions([])
        setLinks([])
        setFile(null)
        setProgress(0)
        setIsEditing(false)
        setIsOpen(false)
    }

    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    useEffect(() => {
        if (file && file.size / 1024 > 800) {
            setFile(null)
            alert('File selected is too large. (more than 800kb)')
        }
    }, [file])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (window.confirm('Are you sure?')) {
            if (file && file !== 'EXIST') {
                let fileName =
                    typeof entity.fileName !== 'undefined' && entity.fileName !== ''
                        ? entity.fileName
                        : createFileName(file)

                const uploadTask = storage.ref(`users/${user}/${fileName}`).put(file)

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        //progress bar function
                        const progressBarVal = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        )
                        setProgress(progressBarVal)
                    },
                    (err) => {
                        alert(err.message)
                    },
                    () => {
                        //adding entry to the database
                        storage
                            .ref(`users/${user}`)
                            .child(fileName)
                            .getDownloadURL()
                            .then((url) => {
                                db.collection('users')
                                    .doc(user)
                                    .collection('keywords')
                                    .doc(mainKeyword)
                                    .set({
                                        supportKeywords,
                                        message,
                                        options,
                                        links,
                                        fileUrl: url,
                                        fileName,
                                    })
                                    .then(() => {
                                        handleModalClose()
                                        alert('New Keyword Added!!!')
                                    })
                                    .catch((err) => alert(err.message))
                            })
                            .catch((err) => alert(err.message))
                    }
                )
            } else if (file === 'EXIST') {
                db.collection('users')
                    .doc(user)
                    .collection('keywords')
                    .doc(mainKeyword)
                    .set({
                        supportKeywords,
                        message,
                        options,
                        links,
                        fileUrl: entity.fileUrl,
                        fileName: entity.fileName,
                    })
                    .then(() => {
                        handleModalClose()
                        alert('Keyword Updated!!!')
                    })
                    .catch((err) => alert(err.message))
            } else {
                db.collection('users')
                    .doc(user)
                    .collection('keywords')
                    .doc(mainKeyword)
                    .set({
                        supportKeywords,
                        message,
                        options,
                        links,
                        fileUrl: '',
                        fileName: '',
                    })
                    .then(() => {
                        handleModalClose()
                        alert('New Keyword Added!!!')
                    })
                    .catch((err) => alert(err.message))
            }
        }
    }

    return (
        <Modal open={isOpen} onClose={handleModalClose}>
            <div style={modalStyle} className={classes.paper}>
                <form
                    className="formModal__form"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <h3 className="formModal__heading">New Keyword</h3>
                    <TextField
                        required
                        type="text"
                        label="Main Keyword"
                        variant="outlined"
                        color="primary"
                        className="formModal__inputField"
                        value={mainKeyword}
                        onChange={(e) => setMainKeyword(e.target.value)}
                    />

                    <TextField
                        type="text"
                        label="Message"
                        placeholder="Enter a message to be displayed along with the content."
                        variant="outlined"
                        color="primary"
                        className="formModal__inputField"
                        multiline={true}
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="formModal__dataFormDynamicInput">
                        <div className="formModal__dataFormGroup">
                            <InputLabel>Support Keywords</InputLabel>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<AddCircleIcon />}
                                onClick={handleSupportKeywordsInputAdd}
                                className="formModal__dataFormBtn"
                            >
                                Add
                            </Button>
                        </div>
                        {createSupportKeywords()}
                    </div>

                    <div className="formModal__dataFormDynamicInput">
                        <div className="formModal__dataFormGroup">
                            <InputLabel>Options</InputLabel>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<AddCircleIcon />}
                                onClick={handleOptionsInputAdd}
                                className="formModal__dataFormBtn"
                            >
                                Add
                            </Button>
                        </div>
                        {createOptions()}
                    </div>

                    <div className="formModal__dataFormDynamicInput">
                        <div className="formModal__dataFormGroup">
                            <InputLabel>Links</InputLabel>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<AddCircleIcon />}
                                onClick={handleLinksInputAdd}
                                className="formModal__dataFormBtn"
                            >
                                Add
                            </Button>
                        </div>
                        {createLinks()}
                    </div>

                    <FormGroup className="formModal__inputField">
                        <Input type="file" onChange={handleFileSelect} />

                        <FormHelperText>select a pdf file to upload</FormHelperText>

                        <div style={{ width: '100%' }}>
                            <ProgressBar value={progress} />
                        </div>
                    </FormGroup>

                    <IconButton type="submit" color="primary">
                        <AddCircleIcon style={{ fontSize: 40 }} />
                    </IconButton>
                </form>
            </div>
        </Modal>
    )
}

export default FormModal
