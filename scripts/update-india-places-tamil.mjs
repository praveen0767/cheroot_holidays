import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.resolve(__dirname, "../data/places/india-places.json");

const places = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const tamilMap = {
  "in-delhi-new": {
    nameTamil: "புது தில்லி",
    displayNameTamil: "புது தில்லி, தில்லி, இந்தியா",
    aliasesTamil: ["தில்லி", "புது டெல்லி", "டெல்லி"]
  },
  "in-delhi-nct": {
    nameTamil: "தில்லி",
    displayNameTamil: "தில்லி (என்சிடி), இந்தியா",
    aliasesTamil: ["டெல்லி", "தேசிய தலைநகர் பகுதி"]
  },
  "in-delhi-ncr": {
    nameTamil: "தில்லி என்சிஆர்",
    displayNameTamil: "தில்லி என்சிஆர், இந்தியா",
    aliasesTamil: ["குருகிராம்", "நொய்டா", "ஃபரிதாபாத்"]
  },
  "in-mumbai": {
    nameTamil: "மும்பை",
    displayNameTamil: "மும்பை, மகாராஷ்டிரா, இந்தியா",
    aliasesTamil: ["பம்பாய்", "பாம்பே"]
  },
  "in-bengaluru": {
    nameTamil: "பெங்களூரு",
    displayNameTamil: "பெங்களூரு, கர்நாடகா, இந்தியா",
    aliasesTamil: ["பெங்களூர்", "சிலிகான் வேலி"]
  },
  "in-chennai": {
    nameTamil: "சென்னை",
    displayNameTamil: "சென்னை, தமிழ்நாடு, இந்தியா",
    aliasesTamil: ["மெட்ராஸ்", "சென்னை நகரம்", "தென்னிந்தியாவின் நுழைவாயில்"]
  },
  "in-kolkata": {
    nameTamil: "கொல்கத்தா",
    displayNameTamil: "கொல்கத்தா, மேற்கு வங்காளம், இந்தியா",
    aliasesTamil: ["கல்கத்தா"]
  },
  "in-hyderabad": {
    nameTamil: "ஹைதராபாத்",
    displayNameTamil: "ஹைதராபாத், தெலுங்கானா, இந்தியா",
    aliasesTamil: ["சைபராபாத்", "முத்து நகரம்"]
  },
  "in-pune": {
    nameTamil: "புனே",
    displayNameTamil: "புனே, மகாராஷ்டிரா, இந்தியா",
    aliasesTamil: ["பூனா"]
  },
  "in-ahmedabad": {
    nameTamil: "அகமதாபாத்",
    displayNameTamil: "அகமதாபாத், குஜராத், இந்தியா",
    aliasesTamil: ["அம்தாவாத்"]
  },
  "in-coimbatore": {
    nameTamil: "கோயம்புத்தூர்",
    displayNameTamil: "கோயம்புத்தூர், தமிழ்நாடு, இந்தியா",
    aliasesTamil: ["கோவை", "தென்னிந்தியாவின் மான்செஸ்டர்"]
  },
  "in-erode": {
    nameTamil: "ஈரோடு",
    displayNameTamil: "ஈரோடு, தமிழ்நாடு, இந்தியா",
    aliasesTamil: ["மஞ்சள் மாநகரம்"]
  },
  "in-tirupur": {
    nameTamil: "திருப்பூர்",
    displayNameTamil: "திருப்பூர், தமிழ்நாடு, இந்தியா",
    aliasesTamil: ["பின்னலாடை நகரம்"]
  },
  "in-goa": {
    nameTamil: "கோவா",
    displayNameTamil: "கோவா, இந்தியா",
    aliasesTamil: ["வடக்கு கோவா", "தெற்கு கோவா", "பனாஜி"]
  },
  "in-kashmir": {
    nameTamil: "காஷ்மீர்",
    displayNameTamil: "காஷ்மீர் பள்ளத்தாக்கு, ஜம்மு & காஷ்மீர், இந்தியா",
    aliasesTamil: ["ஸ்ரீநகர்", "குல்மார்க்", "பஹல்காம்", "தால் ஏரி"]
  },
  "in-kerala": {
    nameTamil: "கேரளா",
    displayNameTamil: "கேரளா, இந்தியா",
    aliasesTamil: ["கடவுளின் சொந்த நாடு", "மூணார்", "ஆலப்புழா", "கொச்சி", "வயநாடு"]
  },
  "in-munnar": {
    nameTamil: "மூணார்",
    displayNameTamil: "மூணார், இடுக்கி, கேரளா, இந்தியா",
    aliasesTamil: ["தேயிலை தோட்டங்கள்"]
  },
  "in-alleppey": {
    nameTamil: "ஆலப்புழா",
    displayNameTamil: "ஆலப்புழா (அலெப்பி), கேரளா, இந்தியா",
    aliasesTamil: ["அலெப்பி", "கிழக்கின் வெனிஸ்", "படகு வீடு"]
  },
  "in-jaipur": {
    nameTamil: "ஜெய்ப்பூர்",
    displayNameTamil: "ஜெய்ப்பூர், ராஜஸ்தான், இந்தியா",
    aliasesTamil: ["பிங்க் சிட்டி", "இளஞ்சிவப்பு நகரம்"]
  },
  "in-udaipur": {
    nameTamil: "உதய்பூர்",
    displayNameTamil: "உதய்பூர், ராஜஸ்தான், இந்தியா",
    aliasesTamil: ["ஏரிகளின் நகரம்"]
  },
  "in-agra": {
    nameTamil: "ஆக்ரா",
    displayNameTamil: "ஆக்ரா, உத்தரப் பிரதேசம், இந்தியா",
    aliasesTamil: ["தாஜ்மஹால்"]
  },
  "in-varanasi": {
    nameTamil: "வாரணாசி",
    displayNameTamil: "வாரணாசி, உத்தரப் பிரதேசம், இந்தியா",
    aliasesTamil: ["காசி", "பனாரஸ்"]
  },
  "in-amritsar": {
    nameTamil: "அமிர்தசரஸ்",
    displayNameTamil: "அமிர்தசரஸ், பஞ்சாப், இந்தியா",
    aliasesTamil: ["பொற்கோவில்"]
  },
  "in-leh-ladakh": {
    nameTamil: "லே லடாக்",
    displayNameTamil: "லே, லடாக், இந்தியா",
    aliasesTamil: ["லடாக்", "பாங்காங் ஏரி", "நுப்ரா பள்ளத்தாக்கு"]
  },
  "in-manali": {
    nameTamil: "மணாலி",
    displayNameTamil: "மணாலி, இமாச்சலப் பிரதேசம், இந்தியா",
    aliasesTamil: ["குல்லு மணாலி", "ரோஹ்தாங் பாஸ்"]
  },
  "in-shimla": {
    nameTamil: "சிம்லா",
    displayNameTamil: "சிம்லா, இமாச்சலப் பிரதேசம், இந்தியா",
    aliasesTamil: ["மலைகளின் ராணி"]
  },
  "in-rishikesh": {
    nameTamil: "ரிஷிகேஷ்",
    displayNameTamil: "ரிஷிகேஷ், உத்தராகண்ட், இந்தியா",
    aliasesTamil: ["யோகா தலைநகரம்", "ஹரித்வார்"]
  },
  "in-ooty": {
    nameTamil: "ஊட்டி",
    displayNameTamil: "ஊட்டி (உதகமண்டலம்), தமிழ்நாடு, இந்தியா",
    aliasesTamil: ["உதகமண்டலம்", "நீலகிரி", "ஊட்டக்கமண்ட்"]
  },
  "in-kodaikanal": {
    nameTamil: "கொடைக்கானல்",
    displayNameTamil: "கொடைக்கானல், தமிழ்நாடு, இந்தியா",
    aliasesTamil: ["கோடைக்கானல்", "மலைவாசஸ்தலங்களின் இளவரசி", "கோடை"]
  },
  "in-coorg": {
    nameTamil: "கூர்க்",
    displayNameTamil: "கூர்க் (குடகு), கர்நாடகா, இந்தியா",
    aliasesTamil: ["குடகு", "மடிக்கேரி", "இந்தியாவின் ஸ்காட்லாந்து"]
  },
  "in-hampi": {
    nameTamil: "ஹம்பி",
    displayNameTamil: "ஹம்பி, விஜயநகரா, கர்நாடகா, இந்தியா",
    aliasesTamil: ["விஜயநகர இடிபாடுகள்"]
  },
  "in-rameswaram": {
    nameTamil: "ராமேஸ்வரம்",
    displayNameTamil: "ராமேஸ்வரம், தமிழ்நாடு, இந்தியா",
    aliasesTamil: ["இராமேஸ்வரம்", "தனுஷ்கோடி", "பாம்பன் பாலம்"]
  },
  "in-madurai": {
    nameTamil: "மதுரை",
    displayNameTamil: "மதுரை, தமிழ்நாடு, இந்தியா",
    aliasesTamil: ["தூங்கா நகரம்", "கோவில் நகரம்", "மீனாட்சி அம்மன் கோவில்"]
  },
  "in-puducherry": {
    nameTamil: "புதுச்சேரி",
    displayNameTamil: "புதுச்சேரி (பாண்டிச்சேரி), இந்தியா",
    aliasesTamil: ["பாண்டிச்சேரி", "பாண்டி"]
  },
  "in-darjeeling": {
    nameTamil: "டார்ஜிலிங்",
    displayNameTamil: "டார்ஜிலிங், மேற்கு வங்காளம், இந்தியா",
    aliasesTamil: ["டார்ஜீலிங்"]
  },
  "in-gangtok": {
    nameTamil: "கேங்டாக்",
    displayNameTamil: "கேங்டாக், சிக்கிம், இந்தியா",
    aliasesTamil: ["காங்டாக்", "சிக்கிம்"]
  },
  "in-shillong": {
    nameTamil: "ஷில்லாங்",
    displayNameTamil: "ஷில்லாங், மேகாலயா, இந்தியா",
    aliasesTamil: ["சில்லாங்", "கிழக்கின் ஸ்காட்லாந்து", "சிரபுஞ்சி"]
  },
  "in-guwahati": {
    nameTamil: "குவஹாத்தி",
    displayNameTamil: "குவஹாத்தி, அசாம், இந்தியா",
    aliasesTamil: ["கௌஹாத்தி"]
  },
  "in-mysuru": {
    nameTamil: "மைசூரு",
    displayNameTamil: "மைசூரு (மைசூர்), கர்நாடகா, இந்தியா",
    aliasesTamil: ["மைசூர்", "அரண்மனை நகரம்"]
  },
  "in-tirupati": {
    nameTamil: "திருப்பதி",
    displayNameTamil: "திருப்பதி, ஆந்திரப் பிரதேசம், இந்தியா",
    aliasesTamil: ["திருமலை", "பாலாஜி"]
  },
  "intl-dubai": {
    nameTamil: "துபாய்",
    displayNameTamil: "துபாய், ஐக்கிய அரபு எமிரேட்ஸ்",
    aliasesTamil: ["துபாய் மால்", "புர்ஜ் கலீஃபா"]
  },
  "intl-bali": {
    nameTamil: "பாலி",
    displayNameTamil: "பாலி, இந்தோனேசியா",
    aliasesTamil: ["உபுட்", "செமினியாக்"]
  },
  "intl-maldives": {
    nameTamil: "மாலத்தீவு",
    displayNameTamil: "மாலத்தீவு (மாலே அட்டோல்)",
    aliasesTamil: ["மாலே", "தீவு சொர்க்கம்"]
  }
};

let enrichedCount = 0;
for (const place of places) {
  if (tamilMap[place.id]) {
    place.nameTamil = tamilMap[place.id].nameTamil;
    place.displayNameTamil = tamilMap[place.id].displayNameTamil;
    place.aliasesTamil = tamilMap[place.id].aliasesTamil;
    enrichedCount++;
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(places, null, 2), "utf-8");
console.log(`Successfully enriched ${enrichedCount} of ${places.length} places with Tamil names & aliases.`);
