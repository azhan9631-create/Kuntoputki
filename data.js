const APP_NAME = "Gym Tracker";

const LIB = {
  "chest": ["Bench Press","Incline Dumbbell Press","Chest Press Machine","Chest Fly Machine","Push-ups","Cable Crossover"],
  "back": ["Lat Pulldown","Seated Cable Row","Barbell Row","Pull-ups","Deadlift","Back Extension"],
  "legs": ["Squat","Leg Press Machine","Leg Extension Machine","Leg Curl Machine","Lunges","Romanian Deadlift","Calf Raise","Hip Thrust"],
  "shoulders": ["Overhead Press","Lateral Raise","Shoulder Press Machine","Face Pull","Rear Delt Fly"],
  "arms": ["Bicep Curl","Hammer Curl","Tricep Pushdown","Skull Crusher","Dips"],
  "core": ["Plank","Crunches","Leg Raises","Russian Twist","Cable Crunch"],
  "cardio": ["Treadmill","Stationary Bike","Rowing Machine","Elliptical","Walking"],
  "easy": ["Chair Squat (sit-to-stand)","Wall Push-up","Seated Leg Raise","Step-ups","Resistance Band Row","Balance Stand","Seated Marching"]
};

const FI = {
  "Bench Press":"Penkkipunnerrus","Incline Dumbbell Press":"Vinoon käsipainopunnerrus","Chest Press Machine":"Rintapunnerruslaite","Chest Fly Machine":"Rintaperhoslaite","Push-ups":"Punnerrus","Cable Crossover":"Kaapeliristikkö",
  "Lat Pulldown":"Ylävetolaite","Seated Cable Row":"Istuva kaapelisoutu","Barbell Row":"Tankosoutu","Pull-ups":"Leuanveto","Deadlift":"Maastaveto","Back Extension":"Selkäojennus",
  "Squat":"Kyykky","Leg Press Machine":"Jalkaprässi","Leg Extension Machine":"Reisiojennus","Leg Curl Machine":"Reisikoukistus","Lunges":"Askelkyykky","Romanian Deadlift":"Romanialainen maastaveto","Calf Raise":"Pohkeennosto","Hip Thrust":"Lantionnosto",
  "Overhead Press":"Pystypunnerrus","Lateral Raise":"Sivunosto","Shoulder Press Machine":"Olkapunnerruslaite","Face Pull":"Face pull","Rear Delt Fly":"Takaolkaperhonen",
  "Bicep Curl":"Hauiskääntö","Hammer Curl":"Vasarakääntö","Tricep Pushdown":"Ojentajan kaapelivienti","Skull Crusher":"Ranskalainen ojennus","Dips":"Dipit",
  "Plank":"Lankku","Crunches":"Vatsarutistus","Leg Raises":"Jalkojennostot","Russian Twist":"Venäläinen kierto","Cable Crunch":"Kaapelivatsa",
  "Treadmill":"Juoksumatto","Stationary Bike":"Kuntopyörä","Rowing Machine":"Soutulaite","Elliptical":"Ellipsitrainer","Walking":"Kävely",
  "Chair Squat (sit-to-stand)":"Tuolikyykky (nousu istumasta)","Wall Push-up":"Seinäpunnerrus","Seated Leg Raise":"Istuva jalannosto","Step-ups":"Askelnousu","Resistance Band Row":"Vastusnauhasoutu","Balance Stand":"Tasapainoseisonta","Seated Marching":"Istuva marssi"
};

const T = {
en: {
  streakLabel:"week streak", workoutDays:"workout days", exercise:"Exercise", addOwnPh:"Add your own exercise", add:"Add",
  lastTime:"Last time", firstTime:"First time with this one. Whatever you do today becomes the number to beat! 🌱",
  yesterday:"yesterday", daysAgo:"{n} days ago", heaviest:"🏆 Heaviest ever: {w} kg", beatIt:"Can you beat it today? 💪",
  logSet:"Log a set", weightPh:"Weight kg (empty = bodyweight)", repsPh:"Reps / minutes", addSet:"Add set",
  today:"Today", todayEmpty:"Nothing logged yet today.", history:"History", historyEmpty:"Your workouts will show up here.",
  backup:"Backup", backupNote:"Your data lives only on this phone. Save a backup now and then.", export:"Export", import:"Import",
  goalText:"Goal: {g} workouts / week ({n}/{g})", startHello:"Start today. One set is enough to begin 💪",
  goalDone:"🎉 Weekly goal reached! Anything extra is a bonus.", leftHello:"{n} more workout(s) this week to keep your streak going.",
  myEx:"⭐ My exercises", days:["M","T","W","T","F","S","S"],
  guideTitle:"Welcome! 👋", guide1:"Pick an exercise. Your last session shows below.", guide2:"Enter weight and reps, then tap Add set.",
  guide3:"Hit your weekly goal to grow your 🔥 streak. Rest days don't break it.", guide4:"Tap 🔍 for bigger text, 🌐 to change language, ❓ to see this again.",
  guideBtn:"Let's go!", langToggle:"🌐 Suomi", textBig:"🔍 Normal", textNormal:"🔍 Large",
  first:["Great start! This is your baseline. Next time we beat it 🌱","First entry saved. Every journey starts with one set 🚀"],
  record:"🏆 NEW PERSONAL RECORD! {w} kg is your heaviest ever.", up:"💪 +{d} kg more than last time. You're getting stronger!",
  reps:"🔥 Same weight, +{d} more rep(s). That's progress!", matched:"✅ You matched last time.", matchedTips:["Consistency builds strength.","Solid and steady!","Strong foundations."],
  easyTips:["A lighter day is fine. Showing up is what counts.","Listening to your body is smart training.","Every session counts, even the easy ones."],
  lastLine:"Last time: {s}.", weekReached:"🎉 Weekly goal reached! Streak: {s}!", dayLogged:"🔥 Workout day logged!",
  needReps:"Please enter reps (or minutes).", replaceQ:"Replace current data with this backup?", badFile:"That file isn't a valid backup.",
  bodyweight:"Bodyweight", kg:"kg"
},
fi: {
  streakLabel:"viikon putki", workoutDays:"treenipäivää", exercise:"Liike", addOwnPh:"Lisää oma liike", add:"Lisää",
  lastTime:"Viimeksi", firstTime:"Ensimmäinen kerta tällä liikkeellä. Tämän päivän suoritus on tulevan lyöntitavoite! 🌱",
  yesterday:"eilen", daysAgo:"{n} päivää sitten", heaviest:"🏆 Ennätys: {w} kg", beatIt:"Pystytkö parempaan tänään? 💪",
  logSet:"Kirjaa sarja", weightPh:"Paino kg (tyhjä = oma paino)", repsPh:"Toistot / minuutit", addSet:"Tallenna sarja",
  today:"Tänään", todayEmpty:"Ei kirjauksia vielä tänään.", history:"Historia", historyEmpty:"Treenisi näkyvät täällä.",
  backup:"Varmuuskopio", backupNote:"Tiedot ovat vain tällä puhelimella. Tallenna varmuuskopio silloin tällöin.", export:"Vie", import:"Tuo",
  goalText:"Tavoite: {g} treeniä / viikko ({n}/{g})", startHello:"Aloita tänään. Yksi sarja riittää alkuun 💪",
  goalDone:"🎉 Viikkotavoite täynnä! Kaikki lisä on bonusta.", leftHello:"Vielä {n} treeni tällä viikolla putken jatkamiseksi.",
  myEx:"⭐ Omat liikkeet", days:["Ma","Ti","Ke","To","Pe","La","Su"],
  guideTitle:"Tervetuloa! 👋", guide1:"Valitse liike. Viimeisin kerta näkyy alla.", guide2:"Syötä paino ja toistot ja paina Tallenna sarja.",
  guide3:"Saavuta viikkotavoite, niin 🔥 putki kasvaa. Lepopäivät eivät katkaise sitä.", guide4:"🔍 suurentaa tekstiä, 🌐 vaihtaa kielen, ❓ näyttää tämän ohjeen uudelleen.",
  guideBtn:"Aloitetaan!", langToggle:"🌐 English", textBig:"🔍 Normaali", textNormal:"🔍 Suuri",
  first:["Hyvä alku! Tämä on lähtötasosi. Seuraavalla kerralla lyödään se 🌱","Ensimmäinen merkintä tallennettu. Jokainen matka alkaa yhdestä sarjasta 🚀"],
  record:"🏆 UUSI ENNÄYS! {w} kg on raskain ennätyksesi.", up:"💪 +{d} kg enemmän kuin viimeksi. Olet vahvistumassa!",
  reps:"🔥 Sama paino, +{d} toistoa enemmän. Se on edistystä!", matched:"✅ Toistit viimeksi tehdyn.", matchedTips:["Johdonmukaisuus kasvattaa voimaa.","Vakaa suoritus!","Hyvä perusta."],
  easyTips:["Kevyt päivä on ihan ok. Tärkeintä on tulla paikalle.","Kehon kuunteleminen on fiksua harjoittelua.","Jokainen treeni lasketaan, myös helpot."],
  lastLine:"Viimeksi: {s}.", weekReached:"🎉 Viikkotavoite täynnä! Putki: {s}!", dayLogged:"🔥 Treenipäivä kirjattu!",
  needReps:"Syötä toistot (tai minuutit).", replaceQ:"Korvataanko nykyiset tiedot tällä varmuuskopiolla?", badFile:"Tämä tiedosto ei ole kelvollinen varmuuskopio.",
  bodyweight:"Oma paino", kg:"kg"
}
};
