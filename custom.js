String.prototype.reverse = function () {
    var reversedStr = "";
    for (var i = this.length - 1; i >= 0; i--) {
        reversedStr += this[i];
    }

    return reversedStr;
}

let selectFrom = document.getElementById('from'),
    selectTo = document.getElementById('to'),
    valueFrom = selectFrom.value,
    valueTo = selectTo.value,

    switchingIcon = document.querySelector('.choosing .switching'),

    inputField = document.querySelector('.input input'),
    outputButton = document.querySelector('.input .resultBtn'),

    resultSection = document.querySelector('.result'),
    resultInput = resultSection.querySelector('.reseultInput .re'),
    resultOutput = resultSection.querySelector('.reseultOutput .re'),

    errors = '';

selectFrom.onchange = function () {
    "use strict";
    valueFrom = this.value;
    document.querySelector('.input input').placeholder =
        `Type ${valueFrom == 'octal' ? "an" : "a"} ${valueFrom} number`;
}

selectTo.onchange = function () {
    "use strict";
    valueTo = this.value;
}

switchingIcon.onclick = function () {
    let switchValue = valueFrom;

    selectFrom.value = valueTo;
    selectTo.value = switchValue;

    valueFrom = selectFrom.value;
    valueTo = selectTo.value;

    document.querySelector('.input input').placeholder =
        `Type ${valueFrom == 'octal' ? "an" : "a"} ${valueFrom} number`
}

let inputValue = '',
    finalResult = '',
    binaryValues = '01.',
    octalValues = '01234567.',
    decimalValues = '0123456789.',
    hexadecimalValues = '0123456789ABCDEFabcdef.';

function checkErrors(value, systemValues, system) {
    for (let i = 0; i < value.length; i++) {
        if (!systemValues.includes(value[i])) {
            return `&#9888; This input is not ${system == 'octal' ? 'an' : 'a'} ${system} number !`;
        }
    }

    return '';
}

outputButton.onclick = function (e) {
    e.preventDefault();
    inputValue = (inputField.value).trim();

    errors = '';

    if (inputValue != '') {
        if (valueFrom == valueTo) {
            resultInput.innerHTML = `${inputValue} <sub>(${valueFrom})</sub>`;
            finalResult = `What are you doing?, you want to convert ${valueFrom} number to ${valueTo} number ! &#128514;&#128517;`;
            resultOutput.innerHTML = finalResult;
            return 0;
        }

        if (valueFrom == 'decimal') {
            errors = checkErrors(inputValue, decimalValues, valueFrom);

            if (errors.length == 0) {
                if (valueTo == 'binary') finalResult = FromDecimal(inputValue, 2);
                else if (valueTo == 'octal') finalResult = FromDecimal(inputValue, 8);
                else if (valueTo == 'hexadecimal') finalResult = FromDecimal(inputValue, 16);
            }
        }
        else if (valueFrom == 'binary') {
            errors = checkErrors(inputValue, binaryValues, valueFrom);

            if (errors.length == 0) {
                if (valueTo == 'decimal') finalResult = ToDecimal(inputValue, 2);
                else if (valueTo == 'octal') finalResult = BinaryToOctAndHex(inputValue, 3);
                else if (valueTo == 'hexadecimal') finalResult = BinaryToOctAndHex(inputValue, 4);
            }
        }
        else if (valueFrom == 'octal') {
            errors = checkErrors(inputValue, octalValues, valueFrom);

            if (errors.length == 0) {
                if (valueTo == 'decimal') finalResult = ToDecimal(inputValue, 8);
                else if (valueTo == 'binary') finalResult = OctAndHexToBinary(inputValue, 3);
                else if (valueTo == 'hexadecimal') finalResult = OctalToHexaAndReverse(inputValue, 3, 4);
            }
        }
        else if (valueFrom == 'hexadecimal') {
            errors = checkErrors(inputValue, hexadecimalValues, valueFrom);

            if (errors.length == 0) {
                if (valueTo == 'decimal') finalResult = ToDecimal(inputValue, 16);
                else if (valueTo == 'binary') finalResult = OctAndHexToBinary(inputValue, 4);
                else if (valueTo == 'octal') finalResult = OctalToHexaAndReverse(inputValue, 4, 3);
            }
        }

        if (Number(finalResult).toString() != '0') {
            if (finalResult.includes('.')) {
                let left = finalResult.split('.')[0].replace(/^0+/, ""),
                    right = finalResult.split('.')[1].reverse().replace(/^0+/, "").reverse();

                finalResult = `${left}.${right}`;
            } else {
                finalResult = finalResult.replace(/^0+/, "");
            }
        }

        resultInput.innerHTML = `${inputValue} <sub>(${valueFrom})</sub>`;

        if (errors.length == 0) {
            resultOutput.innerHTML = `${finalResult} <sub>(${valueTo})</sub>`;
        } else {
            resultOutput.innerHTML = errors;
        }
    }
}

function ToDecimal(numberSys, sys) {
    let result = 0, sum = 0, pow = 0;

    function intNum(num) {
        sum = 0; pow = 0;

        for (let i = num.length - 1; i >= 0; i--) {
            if (num.charCodeAt(i) >= 48 && num.charCodeAt(i) <= 57)
                sum += (parseInt(num[i]) * Math.pow(sys, pow));
            else if (num.charCodeAt(i) >= 65 && num.charCodeAt(i) <= 70)
                sum += (parseInt(num.charCodeAt(i) - 55) * Math.pow(sys, pow));
            else if (num.charCodeAt(i) >= 97 && num.charCodeAt(i) <= 102)
                sum += (parseInt(num.charCodeAt(i) - 87) * Math.pow(sys, pow));

            pow++;
        }

        return sum;
    }

    function FractionNum(num) {
        sum = 0; pow = -1;

        for (let i = 0; i < num.length; i++) {
            if (num.charCodeAt(i) >= 48 && num.charCodeAt(i) <= 57)
                sum += (parseInt(num[i]) * Math.pow(sys, pow));
            else if (num.charCodeAt(i) >= 65 && num.charCodeAt(i) <= 70)
                sum += (parseInt(num[i].charCodeAt() - 55) * Math.pow(sys, pow));
            else if (num.charCodeAt(i) >= 97 && num.charCodeAt(i) <= 102)
                sum += (parseInt(num[i].charCodeAt() - 87) * Math.pow(sys, pow));
            pow--;
        }

        return sum;
    }

    if (numberSys.includes('.')) {
        let leftSide = numberSys.split('.')[0],
            rightSide = numberSys.split('.')[1];

        result = intNum(leftSide) + FractionNum(rightSide)
    } else {
        result = intNum(numberSys)
    }

    return result.toString();
}

function FromDecimal(numberSys, sys) {
    let result = '', sum = "", rem = 0;

    function intNum(num) {
        num = parseInt(num);

        for (let i = 0; parseInt(num) != 0; i++) {
            rem = num % sys;
            if (rem >= 0 && rem <= 9) sum += rem.toString();
            else if (rem >= 10 && rem <= 15) sum += String.fromCharCode(rem + 55);
            num -= rem;
            num /= sys;
        }

        return sum.reverse();
    }

    function FractionNum(num) {
        num = parseFloat(`0.${num}`);
        sum = '';

        for (let i = 0; parseInt(num) != parseFloat(num) && parseInt(num) < 1; i++) {
            num *= sys;

            if (parseInt(num) >= 0 && parseInt(num) <= 9) sum += parseInt(num).toString();
            else if (parseInt(num) >= 10 && parseInt(num) <= 15) sum += String.fromCharCode(parseInt(num) + 55);

            if (parseInt(num) != 0) {
                num -= parseInt(num);
            }
        }

        return sum;
    }

    if (parseInt(numberSys) == 0 || parseFloat(numberSys) == 0) return '0';

    if (numberSys.includes('.')) {
        let leftSide = numberSys.split('.')[0],
            rightSide = numberSys.split('.')[1];

        result = intNum(leftSide) + '.' + FractionNum(rightSide);
    } else {
        result = intNum(numberSys);
    }

    return result;
}

function BinaryToOctAndHex(numberSys, slicesNum) {
    let result = 0, slice = "", sum = '', dec = 0;

    function intNum(num) {
        sum = ''; slice = ""; dec = 0;

        for (let i = 0; i < num.length; i += slicesNum) {
            slice = num.reverse().slice(i, i + slicesNum).reverse();
            dec = Number(ToDecimal(slice, 2));
            if (dec >= 10 && dec <= 15) sum += String.fromCharCode(dec + 55);
            else if (dec >= 0 && dec <= 9) sum += dec
        }

        return sum.reverse();
    }

    function FractionNum(num) {
        sum = ''; slice = ""; dec = 0;

        for (let i = 0; i < num.length; i += slicesNum) {
            slice = num.slice(i, i + slicesNum);
            if (slice.length < slicesNum) slice = slice.padEnd(slicesNum, '0');
            dec = Number(ToDecimal(slice, 2));
            if (dec >= 10 && dec <= 15) sum += String.fromCharCode(dec + 55);
            else if (dec >= 0 && dec <= 9) sum += dec
        }

        return sum;
    }

    if (numberSys.includes('.')) {
        let leftSide = numberSys.split('.')[0],
            rightSide = numberSys.split('.')[1];

        result = intNum(leftSide) + '.' + FractionNum(rightSide);
    } else {
        result = intNum(numberSys)
    }

    return result;
}

function OctAndHexToBinary(numberSys, sliceNum) {
    let result = '', sliceCode = 0, sum = '', bin = '';

    function intNum(num) {
        sum = ''; sliceCode = 0; bin = '';

        for (let i = 0; i < num.length; i++) {
            sliceCode = num.charCodeAt(i);

            if (sliceCode >= 48 && sliceCode <= 57) {
                bin = FromDecimal((sliceCode - 48).toString(), 2);
                if (bin.length < sliceNum) bin = bin.padStart(sliceNum, '0')
                sum += bin
            } else if (sliceCode >= 65 && sliceCode <= 70) {
                bin = FromDecimal((sliceCode - 55).toString(), 2);
                if (bin.length < sliceNum) bin = bin.padStart(sliceNum, '0')
                sum += bin
            } else if (sliceCode >= 97 && sliceCode <= 102) {
                bin = FromDecimal((sliceCode - 87).toString(), 2);
                if (bin.length < sliceNum) bin = bin.padStart(sliceNum, '0')
                sum += bin
            }

        }

        return sum;
    }

    function FractionNum(num) {
        return intNum(num);
    }

    if (numberSys.includes('.')) {
        let leftSide = numberSys.split('.')[0],
            rightSide = numberSys.split('.')[1];

        result = intNum(leftSide) + '.' + FractionNum(rightSide);
    } else {
        result = intNum(numberSys)
    }

    return result;
}

function OctalToHexaAndReverse(numberSys, from, to) {
    let result = '', bin = '';
    bin = OctAndHexToBinary(numberSys, from);
    result = BinaryToOctAndHex(bin, to)

    return result;
}
