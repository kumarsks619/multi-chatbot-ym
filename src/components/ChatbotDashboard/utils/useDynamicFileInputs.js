import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import TextField from '@material-ui/core/TextField'
import ProgressBar from './ProgressBar'

export const useDynamicFileInputs = (keyModifier, progress) => {
    const [files, setFiles] = useState([])

    const handleInputAdd = () => {
        setFiles([...files, null])
    }

    const handleFileSelect = (index, e) => {
        let fileVals = [...files]
        fileVals[index] = e.target.files[0]
        setFiles(fileVals)
    }

    const createInputs = () =>
        files.map((input, index) => (
            <div
                key={index * keyModifier}
                className="dynamicInput"
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <TextField
                    required
                    type="text"
                    variant="outlined"
                    color="primary"
                    label={`${label} ${index + 1}`}
                    value={input || ''}
                    onChange={handleInputChange.bind(this, index)}
                    style={{ flex: 1, marginBottom: '10px' }}
                />
                <IconButton color="primary" onClick={handleInputRemove.bind(this, index)}>
                    <CancelIcon />
                </IconButton>

                <FormGroup className="formModal__inputField">
                    <Input type="file" onChange={handleFileSelect} required />

                    <FormHelperText>select a pdf file to upload</FormHelperText>

                    <div style={{ width: '100%' }}>
                        <ProgressBar value={progress} />
                    </div>
                </FormGroup>

                <IconButton color="primary" onClick={handleInputRemove.bind(this, index)}>
                    <CancelIcon />
                </IconButton>
            </div>
        ))

    const handleInputRemove = (index) => {
        let fileVals = [...files]
        fileVals.splice(index, 1)
        setFiles(fileVals)
    }

    return {
        values,
        setValues,
        createInputs,
        handleInputAdd,
    }
}
