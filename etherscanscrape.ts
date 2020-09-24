interface configInterface {
    file: string,
    batchSize: number,
    airdrop: number,
    decimalFactor: number,
    outputFile: string
}
import * as fs from 'fs';
const config: configInterface = JSON.parse(fs.readFileSync('scrapeconfig.json', 'utf8'))

interface rawRow {
    holder: string,
    balance: string,
    pendingUpdate: string
}

const csv = fs.readFileSync(config.file, 'utf8')

const lines: rawRow[] = csv.split('\n')
    .slice(2)
    .filter(line => line.split(',').length === 3)
    .map(line => line.replace(/"/g, ""))
    .map(line => {
        let parts = line.split(',')

        return { holder: parts[0], balance: parts[1], pendingUpdate: parts[2] }
    })

interface batch {
    addresses: string[]
    values: string[]
}

let totalValue: number = 0
lines.forEach(line => {
    if (line.holder.length < 4)
        return
    const bal = line.balance.toString();
    const fl = parseFloat(bal)
    if (!isNaN(fl))
        totalValue += fl
})

let total = 0
let batches: batch[] = new Array(Math.floor(lines.length / config.batchSize) + (lines.length % config.batchSize === 0 ? 0 : 1))
let trueIndex = 0;
for (let i = 0; i < batches.length; i++) {
    let addresses: string[] = []
    let values: string[] = []
    for (let j = 0; j < config.batchSize && trueIndex < lines.length; j++) {
        addresses.push(lines[trueIndex].holder)
        if (!lines[trueIndex].balance) {
            console.log('goji: ' + JSON.stringify(lines[trueIndex]))
        }
        let valNum = parseFloat(lines[trueIndex].balance)
        let percentage = valNum / totalValue

        const magnitude = Math.pow(10, config.decimalFactor)
        const d = percentage * config.airdrop * magnitude
        if (isNaN(d)) {
            console.log(`perc ${percentage} air ${config.airdrop} mag ${magnitude}`)
        }
        let valueToReceive = Math.floor(percentage * config.airdrop * magnitude)
        total += valueToReceive
        values.push(`${valueToReceive}`)
        trueIndex++;
    }
    batches[i] = { addresses, values }
}
 

let outputText = ''
console.log('Grand total: ' + total)
for (let i = 0; i < batches.length; i++) {
    let outputLines = ['Holders:', JSON.stringify(batches[i].addresses) + '\n', 'Values:', JSON.stringify(batches[i].values)]
    outputText += `******************batch: ${i+1}*******************\n`+outputLines.join('\n')+ '\n\n\n\n\n'
}

fs.writeFileSync('temp/' + config.outputFile, outputText)

