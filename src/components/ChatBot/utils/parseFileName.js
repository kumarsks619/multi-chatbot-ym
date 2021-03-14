const parseFileName = (fileName) => {
    let fragments = fileName.split('_@_')
    let fileExtension = fileName.split('.').pop()
    return `${fragments[0].replaceAll('_', ' ')}.${fileExtension}`
}

export default parseFileName
