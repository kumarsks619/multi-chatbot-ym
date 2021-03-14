import React from 'react'
import { Button } from '@material-ui/core'

import './ResponseComp.css'
import parseFileName from '../utils/parseFileName'

function ResponseComp({
    message,
    options,
    links,
    fileName,
    fileUrl,
    scrollIntoView,
    actionProvider,
}) {
    const handleClick = (element) => {
        if (typeof element !== 'undefined') element.click()
    }

    scrollIntoView()

    return (
        <div className="responseComp">
            {message && <p className="responseComp__message">{message}</p>}

            {options && (
                <div className="responseComp__optionsWrapper">
                    {options.map((option, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            color="primary"
                            className="responseComp__OptionBtn"
                            onClick={() => actionProvider.catchAll(option.trim())}
                        >
                            {option.trim()}
                        </Button>
                    ))}
                </div>
            )}

            {links && (
                <div className="responseComp__linksWrapper">
                    {links.map((link, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            color="primary"
                            className="responseComp__linkBtn"
                            onClick={(e) => handleClick(e.target.children[0])}
                        >
                            <a href={link} target="_blank" rel="noopener noreferrer">
                                {link.slice(0, 20)}...
                            </a>
                            (click to open link)
                        </Button>
                    ))}
                </div>
            )}

            {fileUrl && (
                <Button
                    variant="contained"
                    className="responseComp__linkBtn"
                    onClick={(e) => handleClick(e.target.children[0])}
                >
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        {parseFileName(fileName)}
                    </a>
                    (click to open file)
                </Button>
            )}
        </div>
    )
}

export default ResponseComp
