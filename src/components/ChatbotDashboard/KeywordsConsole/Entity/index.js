import React from 'react'
import { Card, CardContent, Typography, IconButton } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel'
import EditIcon from '@material-ui/icons/Edit'

import './Entity.css'

function Entity({
    mainKeyword,
    supportKeywords,
    message,
    options,
    links,
    fileUrl,
    fileName,
    handleDelete,
    handleEdit,
}) {
    return (
        <>
            {typeof supportKeywords === 'undefined' ||
            typeof options === 'undefined' ||
            typeof links === 'undefined' ||
            typeof fileUrl === 'undefined' ? null : (
                <Card className="entity">
                    <CardContent>
                        <div className="entity__header">
                            <IconButton
                                style={{ marginLeft: 'auto' }}
                                onClick={() =>
                                    handleEdit({
                                        mainKeyword,
                                        supportKeywords,
                                        message,
                                        options,
                                        links,
                                        fileName,
                                        fileUrl,
                                    })
                                }
                            >
                                <EditIcon style={{ fontSize: 20 }} />
                            </IconButton>

                            <IconButton
                                onClick={() => handleDelete(mainKeyword, fileName)}
                            >
                                <CancelIcon style={{ fontSize: 20 }} />
                            </IconButton>
                        </div>

                        <Typography variant="h5" component="h2">
                            {mainKeyword}
                        </Typography>
                        <Typography
                            gutterBottom={true}
                            color="textSecondary"
                        >{`"${message}"`}</Typography>

                        <p className="entity__label">Support Keywords:</p>
                        <div className="entity__spanWrapper">
                            {supportKeywords.map((keyword, index) => {
                                if (keyword !== '')
                                    return (
                                        <span
                                            key={index}
                                            className="entity__supportKeywordSpan"
                                        >
                                            {keyword.trim()}
                                        </span>
                                    )
                            })}
                        </div>

                        <p className="entity__label">Options:</p>
                        <div className="entity__spanWrapper">
                            {options.map((option, index) => {
                                return (
                                    <span key={index} className="entity__optionSpan">
                                        {option.trim()}
                                    </span>
                                )
                            })}
                        </div>

                        <p className="entity__label">Links:</p>
                        <div>
                            {links.map((link, index) => {
                                return (
                                    <p key={index}>
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.length > 40
                                                ? `${link.slice(0, 50)}...`
                                                : link}
                                        </a>
                                    </p>
                                )
                            })}
                        </div>

                        {fileUrl && (
                            <>
                                <p className="entity__label">File Link:</p>
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {fileUrl.length > 40
                                        ? `${fileUrl.slice(0, 50)}...`
                                        : fileUrl}
                                </a>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default Entity
