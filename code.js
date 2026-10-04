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
    console.log("Reached this point");
    fs.readFile('words', 'utf8', (err, data) => {
        console.log("Reached this point too");
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log(data);// Your file text is here
        totalData = data.split(" ");
        let totalText = "";
        for (let i = 0; i < totalData.length; i++){
            totalText += Hamming(totalData[i]);
        }
        console.log("TotalText: " + totalText);

        fs.appendFile('words.ham', totalText, 'utf8', (err) => {
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
                console.log(readFileHam(totalData));

            });
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

function letterConvert(letter){
    console.log("Letter: " + letter);
    const binary = (letter.charCodeAt(0).toString(2)).padStart(8, "0");
    console.log("Binary: " + binary);
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

function Hamming(word) {
    let totalLine = "";
        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < 2; j++) {
            let current = (letterConvert(word[i]))[j];
            console.log("current letter binary: " + current);
            let p1 = ((+current[0] + +current[1] + +current[3]) % 2);
            console.log("p1: " + p1);
            let p2 = ((+current[0] + +current[2] + +current[3]) % 2);
            console.log("p2: " + p2);
            let p3 = ((+current[1] + +current[2] + +current[3]) % 2);
            console.log("p3: " + p3);
            let p4 = ((+current[0] + +current[1] + +current[2] + +current[3] + p1 + p2 + p3) % 2);
            console.log("p4: " + p4);
            totalLine += ("" + p1 + p2 + current[0] + p3 + current[1] + current[2] + current[3] + p4);
        }
            totalLine += " ";
    }
    console.log("TotalLine: " + totalLine);
    return (totalLine);
}

function readFileHam(file){
    let totalMessage = "";
    for (let i = 0; i < file.length - 1; i++){
        totalMessage += (convertToStringHam(readHam(file[i].substring(0, 8)) + readHam(file[i].substring(8,16))));
        console.log("addition: " + (convertToStringHam(readHam(file[i].substring(0, 8)) + readHam(file[i].substring(8,16)))));
    }
    return totalMessage;
}

function readHam(code) {
    const p1 = (code[0] ^ code[2] ^ code[4] ^ code[6]);
    const p2 = (code[1] ^ code[2] ^ code[5] ^ code[6]);
    const p3 = (code[3] ^ code[4] ^ code[5] ^ code[6]);
    const errorSpot = p3 * 4 + p2 * 2 + p1;
    if (errorSpot === 0){
        return "" + code[2] + code[4] + code[5] + code[6];
    }
    else {
        let newString = "";
        newString += code.substring(0, (errorSpot - 1));
        newString += ((+code[errorSpot - 1] + 1) % 2);
        newString += code.substring(errorSpot, 7);
        return "" + newString[2] + newString[4] + newString[5] + newString[6];
    }

}

function convertToStringHam(letterCode){
    return String.fromCharCode(parseInt(letterCode, 2));
}




