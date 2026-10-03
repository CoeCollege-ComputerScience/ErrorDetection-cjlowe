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
    let lineToAdd = "";

    for (let i = 0; i < totalData.length; i++) {
        console.log(word);
        lineToAdd += Parity(word)
    }
    fs.appendFile('blank.2dp', lineToAdd, 'utf8', (err) => {
        if (err) {
            console.error('An error occurred:', err);
            return;
        }
        console.log('Text appended successfully!');

        fs.readFile('blank.2dp', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            totalData = data.split(" ");
            console.log("TotalData ALL: " + totalData);
            console.log(getFullMessage());
        });
    });
});

function convertToString(code){
    return (String.fromCharCode(parseInt(code.substring(0,8), 2)) + String.fromCharCode(parseInt(code.substring(8,16), 2)));
}

function getFullMessage(total){
    let message = "";
    for (let i = 0; i < totalData.length - 1; i++) {
        message += convertToString(rectify(Invalidity(totalData[i], 1), totalData[i]));
    }
    return message;
}

function rectify(invalidityPackage, line){
    let newLine = "";
    console.log("Line given: " + line);
    if (invalidityPackage[0] === false){
        console.log("Too Corrupted");
        throw new Error;
    }
    else{
        if ((!(1 in invalidityPackage)) && (!(2 in invalidityPackage))) { // no errors
            console.log("All Good!");
            return line;
        }
        else if (((!(1 in invalidityPackage)) && ((2 in invalidityPackage))) || (((1 in invalidityPackage)) && (!(2 in invalidityPackage)))) { // parity issue
            if (1 in invalidityPackage){
                console.log("Parity Issue");
                newLine += line.substring(0, 15);
                newLine += line.substring(15, (16 + (+invalidityPackage[1] / 4)));
                newLine += (+line[(16 + (+invalidityPackage[1] / 4))] + 1) % 2;
                newLine += line.substring((17 + (+invalidityPackage[1] / 4)), 24);
            }
            else{
                console.log("Parity Issue");
                newLine += line.substring(0, 19);
                newLine += line.substring(19, (20 + +invalidityPackage[2]));
                newLine += ((+line[(20 + +invalidityPackage[2])]) + 1) % 2;
                newLine += line.substring(21 + +invalidityPackage[2], 24);
            }
        }
        else { // non parity issue
            console.log("Non-Parity Issue");
            newLine += line.substring(0, invalidityPackage[1] + invalidityPackage[2]);
            newLine += ((+line[+invalidityPackage[1] + +invalidityPackage[2]] + 1) % 2);
            newLine += line.substring((invalidityPackage[1] + invalidityPackage[2] + 1), 24);
        }
    }
    return newLine;
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
    let overallLine = "";
    let currentLetter = 1;
    const list = new Array(4);
    // for (let i = 0; i < list.length; i++) {
    //     list[i] = "";
    // }
    console.log("CurrentWord: " + currentWord);
    while (currentLetter <= currentWord.length) {
        if (currentLetter + 1 <= currentWord.length) {
            console.log("Option 1");
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
            console.log("Option 2");
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
        overallLine += lineToAdd;
    }
    updateWord();
    return overallLine;
}

function Invalidity(code, process){
    if (process === 1){
    let validityPackage = new Array(3);
    validityPackage[0] = true;
    let invalid = 0;
    let j = 16;
    for (let i = 0; i < 16; i += 4) {
        if (((parseInt(code[i], 10) + parseInt(code[i + 1], 10) + parseInt(code[i + 2], 10) + parseInt(code[i + 3], 10)) % 2) !== parseInt(code[j], 10)) {
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
        if (((parseInt(code[k], 10) + parseInt(code[k + 4], 10) + parseInt(code[k + 8], 10) + parseInt(code[k + 12], 10)) % 2) !== parseInt(code[j], 10)) {
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
    else if (process === 0){

    }
}

fs.readFile('words', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log(data);// Your file text is here
    totalData = data.split(" ");

    updateWord();
    let lineToAdd = "";

    fs.appendFile('words.ham', lineToAdd, 'utf8', (err) => {
        if (err) {
            console.error('An error occurred:', err);
            return;
        }
        console.log('Text appended successfully!');

        fs.readFile('words.ham', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            totalData = data.split(" ");
            console.log("TotalData ALL: " + totalData);

        });
    });
});

function Hamming(word) {
    let totalWord = "";
    for (let i = 0; i < word.length; i++){
        let letter = newList(word[i]);
        let p1 = ((+letter[0] + +letter[1] + +letter[3]) % 2);
        let p2 = ((+letter[0] + +letter[2] + +letter[3]) % 2);
        let p3 = ((+letter[1] + +letter[2] + +letter[3]) % 2);
        let p4 = ((+letter[0] + +letter[1] + +letter[2] + +letter[3] + p1 + p2 + p3) % 2);
        totalWord += ("" + p1 + p2 + letter[0] + p3 + letter[1] + letter[2] + letter[3] + " ");
    }
    return totalWord;
}

function readHam(code) {
    p1 =
}




