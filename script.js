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
    textToBase64(e.target.value);
    
});

encodeText.addEventListener('input', e=>{
    let check = checkInput(e.target.value);
    console.log(check);
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
});


table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function textToBase64(string){
    if(string == '')return '';
    
    binary = string.split('').map(c => c.charCodeAt().toString(2).padStart(8,'0')).join('');
    
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
    for(let i=0; i<string.length; i+=4){
        let word = string.slice(i, i+4);
        word = word.split('').map(c => {
            let bits;
            if(c >= 'A' && c <= 'Z')
                bits = (c.charCodeAt() - 65).toString(2).padStart(6,'0');
            else if(c >= 'a' && c <= 'z')
                bits = (c.charCodeAt() - 97 + 26).toString(2).padStart(6,'0');
            else if(c >= '0' && c <= '9')
                bits = (c.charCodeAt() - 48 + 52).toString(2).padStart(6,'0');
            else if (c == '+') 
                bits = Number(62).toString(2).padStart(6,'0');
            else if (c == '/')
                bits = Number(63).toString(2).padStart(6,'0');
            return bits;
        }).join('');

        word = word.match(/.{8}/g).map(c => String.fromCharCode(parseInt(c,2))).join('');

        result.push(word);
    }
    return result.join('');
}

function checkInput(string){
    if(string.length % 4 != 0)return false;

    if(string[string.length - 1] == '=')string = string.slice(0,-1);
    if(string[string.length - 1] == '=')string = string.slice(0,-1);
    console.log(string.match(/[^a-zA-Z0-9\s+/]/));
    return string.match(/[^a-zA-Z0-9\s+/]/) == null;
}