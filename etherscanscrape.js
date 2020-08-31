const fs = require('fs')

const holdingsCSV = fs.readFileSync('./holders as of 14:38 GMT+2.csv', 'utf8')

let addresses1 = []
let values1 = []
let addresses2 = []
let values2 = []
let addresses3 = []
let values3 = []


const lines = holdingsCSV.split('\n')
let third = Math.floor(lines.length / 3)

let i = 0;
for (; i < 35; i++) {
    let line = lines[i]

    let lineArray = line.split(',')
    if (!lineArray[4])
        continue
    addresses1.push(lineArray[0])

    const smallerValue = lineArray[4].substring(0, lineArray[4].length - 10)
    values1.push(smallerValue)
}
for (; i < 70; i++) {
    let line = lines[i]
    if (!line)
        continue;
    let lineArray = line.split(',')
    if (lineArray[0].length < 4)
        continue
    addresses2.push(lineArray[0])
    const smallerValue = lineArray[4].substring(0, lineArray[4].length - 10)
    values2.push(smallerValue)
}
for (; i < lines.length - 1; i++) {
    let line = lines[i]
    if (!line)
        return

    let lineArray = line.split(',')
    if (lineArray[0].length < 4)
        continue
    addresses3.push(lineArray[0])
    const smallerValue = lineArray[4].substring(0, lineArray[4].length - 10)
    values3.push(smallerValue)
}

const outputLines = ['Holder addresses:', JSON.stringify(addresses1), JSON.stringify(addresses2), JSON.stringify(addresses3), 'Values (wei)', JSON.stringify(values1), JSON.stringify(values2), JSON.stringify(values3)]
const outputText = outputLines.join('\n')
fs.writeFileSync('./temp/fields.txt', outputText)
