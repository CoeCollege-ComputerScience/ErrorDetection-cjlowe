const fs = require('node:fs');
let totalData = "";
let currentWordIndex = 0;
let word = ""

fs.readFile('blank', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log(data);// Your file text is here
    totalData = data.split(" ");

    updateWord();

    for (let i = 0; i < totalData.length; i++) {
        console.log(word);
        Parity(word)
    }

    fs.readFile('blank.2dp', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        totalData = data.split(" ");
        console.log("TotalData ALLLLL: " + totalData);
        for (let i = 0; i < totalData.length - 1; i++) {
            console.log("Total Data [i]: " + totalData[i])
            console.log(Invalidity(totalData[i]));
        }
    });
});

function rectify(invalidityPackage, line){
    if (invalidityPackage[0] === false){
        console.log("Too Corrupted");
    }
    else{
        if (!(1 in invalidityPackage)) { // no errors
            return line;
        }
        else if ((!(2 in invalidityPackage)) && (!(1 in invalidityPackage))) { // parity issue
            if (invalidityPackage[1]){ //
                
            }
            else{

            }
        }
        else { // non parity issue

        }
    }
}

function updateWord(){
    console.log("Total Data: " + totalData);
    word = totalData[currentWordIndex];
    currentWordIndex = currentWordIndex + 1;
}

const newList = (letterIndex) => {
    console.log("Letter: " + word[letterIndex - 1])
    const ascii = word.charCodeAt(letterIndex - 1);
    const binary = ascii.toString(2).padStart(8, "0");
    console.log("binary: " + binary);


    return [binary.substring(0,4), binary.substring(4,8)];
}

function convert(array, parityVert, parityHorz){
    let totalString = "";
    // for (let i = array.length - 1; i >= 0; i--) {
    for (let i = 0; i < array.length; i++) {
        totalString += array[i];
    }
    totalString += parityVert + parityHorz;
    return totalString;
}


function Parity(currentWord){
    let currentLetter = 1;
    const list = new Array(4);
    for (let i = 0; i < list.length; i++) {
        list[i] = "";
    }
    console.log("CurrentWord: " + currentWord);
    while (currentLetter <= currentWord.length) {
        if (currentLetter + 1 <= currentWord.length) {
            let extra = newList(currentLetter);
            list[0] = extra[0];
            list[1] = extra[1];
            currentLetter++;
            extra = newList(currentLetter);
            list[2] = extra[0];
            list[3] = extra[1];
            currentLetter++;
            console.log("list: " + list);
        }
        else {
            let extra = newList(currentLetter);
            list[0] = extra[0];
            list[1] = extra[1];
            list[2] = "0000";
            list[3] = "0000";
            currentLetter++;
            console.log("list: " + list);
        }

        let parityVertical = "";
        let parityHorizontal = "";
        for (let i = 0; i < list.length; i++) {
            parityVertical += (parseInt(list[i][0], 10) + parseInt(list[i][1], 10) + parseInt(list[i][2], 10) + parseInt(list[i][3], 10)) % 2;
            let jtemp = 0;
            for (let j = 0; j < list.length; j++) {
                jtemp += parseInt(list[j][i], 10);
            }
            parityHorizontal += (jtemp % 2);
        }

        let lineToAdd = convert(list, parityVertical, parityHorizontal) + " ";
        console.log("line to add: " + lineToAdd);
        fs.appendFile('blank.2dp', lineToAdd, 'utf8', (err) => {
            if (err) {
                console.error('An error occurred:', err);
                return;
            }
            console.log('Text appended successfully!');
        });
    }

    updateWord();
}

function Invalidity(code){
    let validityPackage = new Array(3);
    validityPackage[0] = false;
    let invalid = 0;
    let j = 16;
    for (let i = 0; i < 16; i += 4) {
        if (((parseInt(code[i], 10) + parseInt(code[i + 1], 10) + parseInt(code[i + 2], 10) + parseInt(code[i + 3], 10)) % 2) !== parseInt(code[j], 10)) {
            console.log("code[i]: " + code[i]);
            console.log("1. invalid found on row: " + (i / 4));
            console.log("j: " + j);
            try {
                validityPackage[1] = i;
            }
            catch (error){
                validityPackage[0] = false;
            }
            invalid++;
        }
        j++;
    }
    for (let k = 0; k < 4; k++) {
        // if(parseInt((code[k] + code[k + 4] + code[k + 8] + code[k + 12]), 10) % 2 !== code[j]) {
        if (((parseInt(code[k], 10) + parseInt(code[k + 4], 10) + parseInt(code[k + 8], 10) + parseInt(code[k + 12], 10)) % 2) !== parseInt(code[j], 10)) {
            console.log("code[k]: " + code[k]);
            console.log("2. invalid found on column: " + k);
            console.log("j: " + j);
            try {
                validityPackage[2] = k;
            }
            catch (error){
                validityPackage[0] = false;
            }
            invalid++;
        }
        j++;
    }
    return validityPackage;
}




