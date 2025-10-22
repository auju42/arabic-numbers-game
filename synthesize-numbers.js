// synthesize-numbers.js
console.log("script started");
process.on('unhandledRejection', err => { console.error('unhandledRejection', err); });
process.on('uncaughtException', err => { console.error('uncaughtException', err); });


const fs = require('fs');
const path = require('path');
const clientLib = require('@google-cloud/text-to-speech');
const client = new clientLib.TextToSpeechClient();
const OUTDIR = path.resolve(__dirname, 'assets/numbers');
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

const ones = ["","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة","عشرة","أحد عشر","اثنا عشر","ثلاثة عشر","أربعة عشر","خمسة عشر","ستة عشر","سبعة عشر","ثمانية عشر","تسعة عشر"];
const tens = ["","", "عشرون","ثلاثون","أربعون","خمسون","ستون","سبعون","ثمانون","تسعون"];

function numToWords(n){
  if (n < 20) return ones[n];
  if (n < 100){
    const t = Math.floor(n/10);
    const o = n % 10;
    if (o === 0) return tens[t];
    return `${ones[o]} و ${tens[t]}`;
  }
  if (n === 100) return 'مئة';
  return String(n);
}

async function synth(n){
  const text = numToWords(n);
  const request = {
    input: {text},
    voice: {languageCode: 'ar-XA', name: 'ar-XA-Wavenet-C'}, // try different voice names if needed
    audioConfig: {audioEncoding: 'MP3', speakingRate: 1.0},
  };
  const [response] = await client.synthesizeSpeech(request);
  const outPath = path.join(OUTDIR, `${n}.mp3`);
  fs.writeFileSync(outPath, response.audioContent, 'binary');
  console.log('Saved', outPath);
}

async function main(){
  for (let i=1;i<=100;i++){
    await synth(i);
    await new Promise(r=>setTimeout(r, 200));
  }
  console.log('Done');
}
main().catch(console.error);
