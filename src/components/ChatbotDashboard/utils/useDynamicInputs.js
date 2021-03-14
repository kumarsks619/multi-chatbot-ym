import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import TextField from '@material-ui/core/TextField'

export const useDynamicInputs = (initialValue, keyModifier, label) => {
    const [values, setValues] = useState(initialValue)

    const handleInputAdd = () => {
        setValues([...values, ''])
    }

    const handleInputChange = (index, e) => {
        let vals = [...values]
        vals[index] = e.target.value
        setValues(vals)
    }

    const createInputs = () =>
        values.map((input, index) => (
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
            </div>
        ))

    const handleInputRemove = (index) => {
        let vals = [...values]
        vals.splice(index, 1)
        setValues(vals)
    }

    return {
        values,
        setValues,
        createInputs,
        handleInputAdd,
    }
}
