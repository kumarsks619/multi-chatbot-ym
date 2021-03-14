import create_UUID from './createUUID'

const createFileName = (file) => {
    let actualFilename = ''
    let fragments = file?.name.split('.')
    for (let i = 0; i < fragments.length - 1; i++) {
        actualFilename = actualFilename + '_' + fragments[i]
    }
    return `${actualFilename}_@_${create_UUID()}.${file?.name.split('.').pop()}`
}

export default createFileName
