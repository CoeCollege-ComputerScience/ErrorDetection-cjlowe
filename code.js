
const fs = require('node:fs');
let totalData = "";
let currentWord = 0;
let word = ""

fs.readFile('blank', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log(data);// Your file text is here
    totalData = data.split(" ");
});

function updateWord(){
    word = totalData[currentWord];
    currentWord++;
}
updateWord();

const newList = (letter) => {
    const encoder = new TextEncoder();
    const ascii = (encoder.encode(letter)).toHex();

    if (ascii.length === 3){
        return [parseInt(ascii.substring(1,2), 10).toString(2), Number(ascii[0]).toString(2)];
    }
    else {
        return [Number(ascii[1]).toString(2), Number(ascii[0]).toString(2)];
    }
}

// const newWord = () => totalData[currentWord]; currentWord++;

function Parity(word){
    let currentLetter = 0;
    const s1 = word[currentLetter].toString(16);
    const s2 = word[currentLetter].toString(16);
    const list = new Array(4);
    for (let i = 0; i < list.length; i++) {
        list[i] = "";
    }
    while (currentLetter < word.length) {
        if (currentLetter + 1 < word.length) {
            let extra = newList[currentLetter]
            list[0] = extra[1];
            list[1] = extra[0];
            currentLetter++;
            extra = newList[currentLetter]
            list[2] = extra[1];
            list[3] = extra[0];
        }
        else {


            list[2] = "0000";
            list[3] = "0000";

        }
    }
    updateWord();
}