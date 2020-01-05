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
    template = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "日报\n";
} else {
    template = program.since + "日报\n";
}

const gitlog = spawn('git', ['log', '--no-merges', '--reverse', '--format="%ai %s%nhttp://code.jiecao.me/android/android-social-app/commit/%H"', '--since', program.since, '--until', program.until, '--author', program.author]);
let logData;
gitlog.stdout.on('data', data => {
    logData = data;
    const pb = spawn('pbcopy');
    pb.stdin.write(template + data);
    pb.stdin.end();
      
});

gitlog.stderr.on('data', data => {
    console.log('stderr: ${data}');
});

gitlog.on('close', code => {
    if (logData == undefined) {
        console.log('没有commit')
    }
    console.log('RB copied, have a nice day!');
});