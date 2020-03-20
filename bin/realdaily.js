#!/usr/bin/env node

const program = require('commander')
const {
    spawn
} = require('child_process')

program.version(require('../package').version)
    .usage('[options]')
    .option('-a, --author <string>', 'author username')
    .option('-d, --date <date>', 'date, MMdd, yyMMdd, yyyyMMdd, MM-dd, yy-MM-dd, yyyy-MM-dd')
    .parse(process.argv);

if (program.author == undefined) {
    console.log('author参数不能为空')
    return
}
let since = undefined
let until = undefined
if (program.date == undefined) {
    var today = new Date();
    since = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    today.setDate(today.getDate() + 1)
    until = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
} else {
    if (program.date.includes("-")) {
        sinceSpliteArr = program.date.split("-");
        if (sinceSpliteArr.length == 2) {
            program.date = "2020-" + program.date;
        } else if (sinceSpliteArr.length == 3) {
            if (sinceSpliteArr[0].length == 2) {
                program.date = "20" + program.date;
            }
        }
    } else {
        if (program.date.length == 4) {
            program.date = "2020-" + program.date.substring(0, 2) + "-" + program.date.substring(2)
        } else if (program.date.length == 6) {
            program.date = "20" + program.date.substring(0, 2) + "-" + program.date.substring(2, 4) + "-" + program.date.substring(4)
        }
    }
    let time = new Date(Date.parse(program.date));
    since = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
    time.setDate(time.getDate() + 1);
    until = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
}

let template = since + "日报\n";
since = since + " 00:00";
until = until + " 00:00";

const gitlog = spawn('git', ['log', '--no-merges', '--reverse', '--format=%s', '--since', since, '--until', until, '--author', program.author, '--all']);
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