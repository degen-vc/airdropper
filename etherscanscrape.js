const fs = require('fs')

const holdingsCSV = fs.readFileSync('./holders as of 11 September 20:21 (GMT+2).csv', 'utf8')

let addresses1 = []
let values1 = []
let addresses2 = []
let values2 = []
let addresses3 = []
let values3 = []


const lines = holdingsCSV.split('\n')
let third = Math.floor(lines.length / 3)
console.log('third: ' + third)
let number = 0
let i = 0;
for (; i < third; i++) {
    let line = lines[i]

    let lineArray = line.split(',')
    if (!lineArray[4])
        continue
    addresses1.push(lineArray[0])

    const smallerValue = lineArray[4].substring(0, lineArray[4].length - 10)
    number += parseInt(smallerValue)
    values1.push(parseInt(smallerValue))

}
for (; i < third * 2; i++) {
    let line = lines[i]
    if (!line)
        continue;
    let lineArray = line.split(',')
    if (lineArray[0].length < 4)
        continue
    addresses2.push(lineArray[0])
    const smallerValue = lineArray[4].substring(0, lineArray[4].length - 10)
    number += parseInt(smallerValue)
    values2.push(parseInt(smallerValue))
}
for (; i < lines.length - 1; i++) {
    let line = lines[i]
    if (!line)
        return

    let lineArray = line.split(',')
    if (lineArray[0].length < 4)
        continue
    addresses3.push(lineArray[0])
    let smallerValue = lineArray[4].substring(0, lineArray[4].length - 10)

    number += parseInt(smallerValue)
    values3.push(parseInt(smallerValue))
}
console.log(number)
//]                49813305801518
let difference = 50000000000000 - number -1
console.log(difference)
const additionDivisor = values1.length + values3.length + values2.length
let add = difference / additionDivisor
let trueNumber = 0

for (let j = 0; j < values1.length; j++) {
    values1[j] += add
    values1[j] = Math.trunc(values1[j])
    trueNumber +=  values1[j]
}
for (let j = 0; j < values2.length; j++) {
    values2[j] += add
    values2[j] = Math.trunc(values2[j])
    trueNumber +=  values2[j]
}
for (let j = 0; j < values3.length; j++) {
    values3[j] += add
    values3[j] = Math.trunc(values3[j])
    trueNumber +=  values3[j]
}

console.log(trueNumber)
const outputLines = ['Holder addresses:', JSON.stringify(addresses1), JSON.stringify(addresses2), JSON.stringify(addresses3), 'Values (wei)', JSON.stringify(values1), JSON.stringify(values2), JSON.stringify(values3)]
const outputText = outputLines.join('\n')
fs.writeFileSync('./temp/fields.txt', outputText)
