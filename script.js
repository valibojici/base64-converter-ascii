function auto_grow(element) {
    element.style.height = "6px";
    element.style.height = (element.scrollHeight)+"px";
}

document.querySelectorAll('textarea').forEach(elem => auto_grow(elem));

const decodeText = document.getElementById('decode');
const encodeText = document.getElementById('encode');



decodeText.addEventListener('input', e=>{
    encodeText.value = textToBase64(e.target.value);
    auto_grow(encodeText);
    auto_grow(decodeText);

    if(!document.getElementsByClassName('details-container')[0].classList.contains('hide')){
        adddetails(decodeText.value, encodeText.value);
    }
});

encodeText.addEventListener('input', e=>{
    let check = checkInput(e.target.value);
 
    if(check){
        document.getElementById('encode-error').style.display = 'none';
        decodeText.value = base64ToText(e.target.value);
        //decodeText.value = e.target.value;
    } else {
        document.getElementById('encode-error').style.display = 'inline';
        decodeText.value = '';
    }
    auto_grow(encodeText);
    auto_grow(decodeText);

    if(!document.getElementsByClassName('details-container')[0].classList.contains('hide')){
        adddetails(decodeText.value, encodeText.value);
    }
});


document.getElementById('details-btn').addEventListener('click', e =>{
    let details = document.getElementsByClassName('details-container')[0];
    details.classList.toggle('hide');

    if(!details.classList.contains('hide')){
        adddetails(decodeText.value, encodeText.value);
        document.body.style.height = 'auto';
    } else {
        document.body.style.height = '100vh';
    }
});

table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function textToBase64(string){
    if(string == '')return '';
    
    binary = string.split('').map(c => getBits(c)).join('');
    
    binary = binary.match(/.{1,6}/g).map(c => c.padEnd(6, '0'));

    result = binary.map(c => table[parseInt(c,2)]).join('');
    
    //console.log(text);
    if(result.length % 4 == 3){
        result += '=';
    }
    else if(result.length % 4 == 2){
        result += '==';
    }
    return result;
}

function base64ToText(string){
    result = [];
    if(string[string.length - 1] == '=')string = string.slice(0,-1);
    if(string[string.length - 1] == '=')string = string.slice(0,-1);
    
    for(let i=0; i<string.length; i+=4){
        let word = string.slice(i, i+4);
        word = word.split('').map(c => getBase64CodeBits(c)).join('');

        word = word.match(/.{8}/g).map(c => String.fromCharCode(parseInt(c,2))).join('');

        result.push(word);
    }
    return result.join('');
}

function checkInput(string){
    if(string.length % 4 != 0)return false;

    if(string[string.length - 1] == '=')string = string.slice(0,-1);
    if(string[string.length - 1] == '=')string = string.slice(0,-1);
    
    return string.match(/[^a-zA-Z0-9\s+/]/) == null;
}

function getBase64CodeBits(c){
    if(c >= 'A' && c <= 'Z')
        return (c.charCodeAt() - 65).toString(2).padStart(6,'0');
    else if(c >= 'a' && c <= 'z')
        return (c.charCodeAt() - 97 + 26).toString(2).padStart(6,'0');
    else if(c >= '0' && c <= '9')
        return (c.charCodeAt() - 48 + 52).toString(2).padStart(6,'0');
    else if (c == '+') 
        return Number(62).toString(2).padStart(6,'0');
    else if (c == '/')
        return Number(63).toString(2).padStart(6,'0');
    return '000000';
}

function getBits(c){
    return c.charCodeAt().toString(2).padStart(8,'0');
}

function removeChildren(elem){
    while (elem.firstChild) {
        elem.removeChild(elem.lastChild);
    }
}


function adddetails(str, encoded_str){
    let details_ascii = document.getElementsByClassName("details-ascii-codes")[0];
    let details_bits = document.getElementsByClassName("details-bits")[0];
    let details_base64 = document.getElementsByClassName("details-base64-codes")[0];
    removeChildren(details_ascii);
    removeChildren(details_base64);

    for(let c of str){
        let printableChar = c;
        if(printableChar == ' '){
            printableChar = '" "';
        } else if (printableChar == '\n'){
            printableChar = '"\\n"';
        } else if (printableChar == '\t'){
            printableChar = '"\\t"';
        }

        let cell = document.createElement('div');
        let letter = document.createElement('div');
        let asciiCode = document.createElement('div');
        let binary = document.createElement('div');

        letter.textContent = printableChar;
        asciiCode.textContent = c.charCodeAt();
        binary.textContent = getBits(c);

        cell.appendChild(letter);
        cell.appendChild(asciiCode);
        cell.appendChild(binary);

        [letter,asciiCode,binary].forEach(elem => elem.classList.add('text-center'));

        cell.classList.add('flex' ,'flex-column');

        details_ascii.appendChild(cell);   
    }

    let explanation = details_bits.getElementsByClassName('explanation')[0];
    let bits_container = details_bits.getElementsByClassName('bits-container')[0];
    
    removeChildren(bits_container);

    let total_bit_count = str.length*8;
    let padding_bit_count = total_bit_count % 24 == 0 ? 0 : 24 - total_bit_count % 24;

    explanation.textContent = `
      Input has ${total_bit_count} bits, ${total_bit_count} % 24 = ${total_bit_count % 24}`;
    if(padding_bit_count == 0){
        explanation.textContent += `, so we don't need padding.`;
    } else {
        explanation.textContent += `. That means 24 - ${total_bit_count % 24} = ${padding_bit_count} bits of padding.`;
    }

    for(c of str){
        let asciiCode = getBits(c);
        let byte = document.createElement('span');
        byte.textContent = asciiCode;
        
        bits_container.appendChild(byte);
    }

    for(let i=0;i<padding_bit_count; i+=8){
        let byte = document.createElement('span');
        byte.classList.add('text-red');
        byte.textContent = '0'.repeat(8);

        bits_container.appendChild(byte);
    }


    for(let c of encoded_str){
        let cell = document.createElement('div');
        let letter = document.createElement('div');
        let base64Code = document.createElement('div');
        let binary = document.createElement('div');

        binary.textContent = getBase64CodeBits(c);
        base64Code.textContent = c != '=' ? parseInt(binary.textContent, 2) : 'padding';
        letter.textContent = c;

        cell.appendChild(binary);
        cell.appendChild(base64Code);
        cell.appendChild(letter);

        [letter,base64Code,binary].forEach(elem => elem.classList.add('text-center'));

        cell.classList.add('flex' ,'flex-column');

        details_base64.appendChild(cell);    
    }
}