#!/usr/bin/env node

const program = require('commander')
const {
    spawn
} = require('child_process')

program.version(require('../package').version)
    .usage('[options]')
    .option('-a, --author <string>', 'author username')
    .option('--since <date>', 'date, e.g. 2020-01-01', 'today.midnight')
    .option('--until <date>', 'date, e.g. 2020-01-02')
    .parse(process.argv);

if (program.author == undefined) {
    console.log('author参数不能为空')
    return
}

let template;
if (program.since.includes('today')) {
    var today = new Date();
    template = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " 日报\n\n";
} else {
    template = program.since + "日报\n\n";
}

const gitlog = spawn('git', ['log', '--no-merges', '--reverse', '--format=%s', '--since', program.since, '--until', program.until, '--author', program.author, '--all']);
let result = "";
let lineNumber = 1;
gitlog.stdout.on('data', data => {
    let dataStr = data.toString();
    if (dataStr.length == 0) {
        return;
    }
    let lines = dataStr.split("\n");
    for (i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (!line.startsWith("index") && line.trim().length > 0) {
            let index = line.indexOf("]")
            if (index != -1 && index < line.length) {
                line = line.substring(index + 1)
            }
            if (i == lines.length - 1) {
                result += lineNumber + "." + line;
            } else {
                result += lineNumber + "." + line + "\n";
            }
            lineNumber++;
        }
    }
});

gitlog.stderr.on('data', data => {
    console.log('stderr: ${data}');
});

gitlog.on('close', code => {
    if (result == undefined) {
        console.log('没有commit!')
    } else {
        const pb = spawn('pbcopy');
        result = template + result;
        console.log(result)
        pb.stdin.write(result);
        pb.stdin.end();
        console.log('RB copied, have a nice day!');
    }
});