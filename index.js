const fs = require('fs');
const readFileSystem = './';
let textFile = [];

function listObject(path) {
    fs.readdir(path, (err, files) => {
        if (err) {
            throw err;
        }

        files.forEach((item) => {

            fs.stat(path + '/' + item, (errStat, status) => {
                if (errStat) throw errStat;
                if (path.includes('config') || path.includes('modules')) {
                    if (item.includes('images')) {
                        return;
                    }
                    console.log(item)
                    if (!status.isDirectory()) {
                        let fileContent = fs.readFileSync(path + '/' + item, 'utf8');

                        getCountBacktick(fileContent, path, item, "'");
                        getCountBacktick(fileContent, path, item, '"');
                        find_unclosed_tags(fileContent, path, item,)
                    }
                }
                if (status.isDirectory()) {
                    listObject(path + '/' + item); // продолжаем рекурсию
                } else {

                }
            });
        })
    })
}

// Поиск кавычек
function getCountBacktick(context, path, item, needle) {
    let count = 0;
    context.split('').forEach((item) => {
        if (item === needle) {
            count++;
        }
    });
    if (count % 2) {
        fs.appendFile('./message.txt', path + ' файл: ' + item + ' ' + 'В файле пропущена ' + needle + '\n', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
}

function find_unclosed_tags(str, path, item) {
    str = str.toLowerCase();
    const tags = ["a", "span", "div", "ul", "li", "h1", "h2", "h3", "h4", "h5", "h6", "p", "table", "tr", "td", "b", "i", "u"];

    tags.forEach(function(tag) {
        let pattern_open = '<'+tag+'( |>)';
        let pattern_close = '</'+tag+'>';

        let diff_count = (str.match(new RegExp(pattern_open,'g')) || []).length - (str.match(new RegExp(pattern_close,'g')) || []).length;

        if(diff_count != 0) {
            fs.appendFile('./message.txt', path + ' файл: ' + item + ' ' + "Open/close mismatch for tag " + tag + '\n', function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    });
}

listObject(readFileSystem);