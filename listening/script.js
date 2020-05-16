var synth = window.speechSynthesis;

var wordsC = document.querySelector('#wordsC');
var numsC = document.querySelector('#numsC');
var randVoiceC = document.querySelector('#randVoiceC');

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('#answerEdit');
var voiceSelect = document.querySelector('select');
var score = document.querySelector('#score');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var repeat = document.querySelector('play');
var ok = document.querySelector('OK');

var voices = [];

var question;
var questionN = 0;
var qCnt = 0;
var rCnt = 0;


const NUMBER = 0;
const WORD = 1;

function getRandUInt(max)
{
    return Math.floor(Math.random() * max);
}

function changeQuestion() {
    var numEn = numsC.checked;
    var wordEn = wordsC.checked;

    var anyEn = numEn || wordEn;
    var en = [numEn, wordEn];
    do{
        questionN = (questionN + 1) % 2;
        console.log("questionN: " + questionN);
        if(questionN === NUMBER){
            var num = getRandUInt(9999999);
            question = num;
        }else{
            var word = words[getRandUInt(words.length)];
            question = word;
        }
    }while(anyEn && (!en[questionN]));

    console.log("Question: " + question);
    console.log();
}

function updateScores(){
    score.innerHTML='<div id="score" align="center">'+ rCnt + '/' + qCnt + '</div>';
    console.log(score.innerHTML);
    document.cookie = "rCnt=" + rCnt;
    document.cookie = "qCnt=" + qCnt;
}

console.log("Version : 0.000.00002");
console.log("Words count : " + words.length);
changeQuestion();

var rCookie = document.cookie.replace(/(?:(?:^|.*;\s*)rCnt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var qCookie = document.cookie.replace(/(?:(?:^|.*;\s*)qCnt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
console.log("Cookies:");
console.log(document.cookie);
console.log(rCookie);
console.log(qCookie);
if(!(rCookie == 0 && qCookie == 0)){
    rCnt = rCookie;
    qCnt = qCookie;
    updateScores();
}

function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if ( aname < bname ) return -1;
        else if ( aname == bname ) return 0;
        else return +1;
    });
    var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    for(i = 0; i < voices.length ; i++) {
        var option = document.createElement('option');
        if(voices[i].lang.includes("en")){
            option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

            if(voices[i].default) {
                option.textContent += ' -- DEFAULT';
            }

            option.setAttribute('data-lang', voices[i].lang);
            option.setAttribute('data-name', voices[i].name);
            voiceSelect.appendChild(option);
        }
    }
    voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}


function pronounce( word){
    //    if (synth.speaking) {
    //        console.error('speechSynthesis.speaking');
    //        return;
    //    }
    //if (inputTxt.value !== '') {
    //var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    var utterThis = new SpeechSynthesisUtterance(word);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }

    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
        if(voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
			utterThis.lang = voices[i].lang;
            break;
        }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    console.log(utterThis);
	synth.speak(utterThis);
    //}
}

function speak(){
    pronounce(question);
}

function check(){
    var answer = inputTxt.value.toLowerCase().trim();
    console.log("Answer: " + answer);
    if((answer != "") && (answer != null))
    {
        inputTxt.value = "";
        if(answer == question){
            pronounce("Right");
            ++rCnt;
        }else{
            pronounce("Wrong");
            alert(question);
        }
        qCnt++;
        if(randVoiceC.checked){
            voiceSelect.selectedIndex = getRandUInt(voiceSelect.length);
            console.log("Voice index: " + voiceSelect.selectedIndex);
        }
        console.log(score);
        updateScores();
        changeQuestion();
        speak();
    }
}

inputForm.onsubmit = function(event) {
    event.preventDefault();

    check();
}

pitch.onchange = function() {
    pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
    rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
    speak();
}
