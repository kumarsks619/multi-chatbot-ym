export const generateDate = (timestamp) => {
    let dateObj = new Date(timestamp.toDate())

    const weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'April',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]

    let timestampString = `${weekNames[dateObj.getDay()]}, ${dateObj.getDate()} ${
        monthNames[dateObj.getMonth()]
    }`

    return timestampString
}

export const generateTime = (timestamp) => {
    let timeObj = new Date(timestamp.toDate())
    let timestampString = `${timeObj.getHours()}:${timeObj.getMinutes()}`
    return timestampString
}
