// script.js — loads courses.json and populates course select & themes
let mainText = document.getElementById("mainText")
let namesInput = document.getElementById("namesInput")
let myThemesInput = document.getElementById("myThemes")
let myDaysInput = document.getElementById("myDays")
let todayButton = document.getElementById("todayButton")
let courseSelect = document.getElementById("courseSelect")

let days = ["НД","ПН","ВТ","СР","ЧТ","ПТ","СБ"]

let courses = {}; // will be filled from courses.json

// Load courses.json
fetch('./courses.json')
  .then(res => {
    if (!res.ok) throw new Error("Failed to load courses.json");
    return res.json();
  })
  .then(data => {
    courses = data || {};
    // populate the course select with keys from courses.json
    populateCourseSelect(courses);
  })
  .catch(err => {
    console.error("Could not load courses.json:", err);
    // don't alert every time, but inform once
    alert("Не вдалося завантажити courses.json. Теми не будуть доступні.");
  });

function populateCourseSelect(coursesObj){
  if (!courseSelect) return;
  // Clear non-default options
  courseSelect.innerHTML = '';
  let defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '-- Виберіть курс --';
  courseSelect.appendChild(defaultOpt);

  Object.keys(coursesObj).forEach(key => {
    let opt = document.createElement('option');
    opt.value = key;
    // user-friendly label
    if (key === 'Front') opt.textContent = 'Frontend';
    else opt.textContent = key;
    courseSelect.appendChild(opt);
  });
}

// generate datalist options
function generateOptions(themes, datalistId) {
  let datalist = document.getElementById(datalistId);
  if (!datalist) return;
  datalist.innerHTML = "";
  for (let key in themes) {
    let option = document.createElement("option");
    option.value = key;
    datalist.appendChild(option);
  }
}

// when course changes — load themes from courses object
courseSelect.addEventListener("change", function() {
  let selectedCourse = courseSelect.value;
  if (!selectedCourse) {
    generateOptions({}, "themes");
    return;
  }
  let courseObj = courses[selectedCourse] || {};
  generateOptions(courseObj, "themes");
});

let mainButton = document.getElementById("mainButton")

mainButton.addEventListener("click", function(){
  let isMissing = document.querySelector('input[name="missing"]:checked');
  if(!checkIfEntered()) return;

  let reciever;
  if(+isMissing.value){
    reciever = whoIsMissing()
  } else {
    reciever = "Усі були на уроці, молодці!"
  }

  let text = `Добрий день, шановні батьки!☀️  

${reciever}

❗️Якщо виникнуть запитання по минулій темі, або потрібна допомога із виконанням домашньої практики - чекаємо Вас за півгодини до уроку в кімнаті google meet

${choseTheme()}

${choseDays()}

Усім бажаю мирного неба і продуктивного тижня💙💛`
  mainText.textContent  = text
  mainText.style.display = "block"
  navigator.clipboard.writeText(text)
})

function choseDays(){
  let primaryDays = {
    "ПН": "неділі",
    "ВТ": "понеділка",
    "СР": "вівторка",
    "ЧТ": "середи",
    "ПТ": "четверга",
    "СБ": "п'ятниці",
    "НД": "суботи"
  }
  let secondaryDays = {
    "ПН": "cуботу",
    "ВТ": "неділю",
    "СР": "понеділок",
    "ЧТ": "вівторок",
    "ПТ": "середу",
    "СБ": "четвер",
    "НД": "п'ятницю"
  }
  let primaryDay = primaryDays[myDaysInput.value]
  let secondaryDay = secondaryDays[myDaysInput.value]

  return `❗️ Нагадую, що практику потрібно зробити до ${primaryDay}. Чекатиму від кожного запитання у чаті на платформі і у чаті в Телеграмі.

🕧 Упродовж тижня я відповідаю на всі питання, на платформі.
✅ У ${secondaryDay} перевіряю домашнє завдання`
}

function checkIfEntered(){
  let isMissing = document.querySelector('input[name="missing"]:checked');
  let isSingle = document.querySelector('input[name="single"]:checked');
  let gender = document.querySelector('input[name="gender"]:checked');

  if (!isMissing) {
    alert("Оберіть, чи були відсутні учні!");
    return false;
  }

  if (+isMissing.value) {
    if (!namesInput.value.trim()) {
      alert("Введіть імена відсутніх!");
      return false;
    }
    if (!isSingle) {
      alert("Виберіть, один учень або кілька!");
      return false;
    }
    if (+isSingle.value && !gender) {
      alert("Виберіть стать відсутнього учня!");
      return false;
    }
  }

  if (!courseSelect.value) {
    alert("Оберіть курс!");
    return false;
  }

  if (!myThemesInput.value) {
    alert("Оберіть тему!");
    return false;
  }

  if (!myDaysInput.value) {
    alert("Оберіть день для здачі практики!");
    return false;
  }

  return true;
}

function choseTheme(){
  let selectedCourse = courseSelect.value;
  if (!selectedCourse || !courses[selectedCourse]) return "";
  return courses[selectedCourse][myThemesInput.value] || "";
}

function whoIsMissing(){
  let isSingle = document.querySelector('input[name="single"]:checked');
  let names
  if(namesInput.value){
    names = namesInput.value
  }else {
    return
  }

  let correctForm

  if(+isSingle.value){
    let gender = document.querySelector('input[name="gender"]:checked');
    correctForm = gender && gender.value == "Ч" ? "був відсутній" : "була відсутня"
  }else {
    correctForm = `були відсутні`
  }
  return `На уроці ${correctForm}: ${names}\n\nЗапрошую підключитись на наступний урок за півгодини раніше для відпрацювання теми, яку було пропущено, а також всіх, у кого виникнуть проблеми з виконанням домашньої практики.`
}

function todayButtonHandler(){
  let date = new Date().getDay()
  myDaysInput.value = `${days[date]}`
}

todayButton.addEventListener("click", todayButtonHandler)

function resetInput(){
  myDaysInput.value = ""
  namesInput.value = ""
  myThemesInput.value = ""
  courseSelect.value = ""
  mainText.style.display = "none"
  let radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio) => { radio.checked = false; });
  generateOptions({}, "themes")
}

document.querySelector("#resetButton").addEventListener("click", resetInput);
