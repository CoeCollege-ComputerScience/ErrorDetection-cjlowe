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
    console.log(totalData);

    for (let i = 0; i < 3; i++) {
        updateWord();
        console.log(word);
        Parity(word)
    }
});


function updateWord(){
    word = totalData[currentWord];
    currentWord++;
}

const newList = (letterIndex) => {
    const ascii = word.charCodeAt(letterIndex);
    console.log("ascii: " + ascii);
    const binary = ascii.toString(2).padStart(8, "0");
    console.log("binary: " + binary);

    if (ascii.length === 3){
        return [parseInt(binary.substring(1,2), 10).toString(2), Number(binary[0]).toString(2)];
    }
    else {
        return [Number(binary[1]).toString(2), Number(binary[0]).toString(2)];
    }
}


function Parity(currentWord){
    let currentLetter = 1;
    const s1 = currentWord[currentLetter].toString(16);
    const s2 = currentWord[currentLetter].toString(16);
    const overallList = new Array(4);
    const list = new Array(4);
    for (let i = 0; i < list.length; i++) {
        list[i] = "";
    }
    let outer = 0;
    while (currentLetter < currentWord.length) {
        if (currentLetter + 1 < currentWord.length) {
            let extra = newList(currentLetter);
            list[0] = extra[1];
            list[1] = extra[0];
            currentLetter++;
            extra = newList(currentLetter);
            list[2] = extra[1];
            list[3] = extra[0];
            currentLetter++;
        }
        else {
            let extra = newList(currentLetter);
            list[0] = extra[1];
            list[1] = extra[0];
            list[2] = "0000";
            list[3] = "0000";
            currentLetter++;
        }
        overallList[outer] = list;
        outer++;
    }
    console.log(outer);
    updateWord();
}