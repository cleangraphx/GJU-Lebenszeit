window.onload = function () {
  pageSetup();
};

const ROT = { h: 1, m: 0, s: 0 };

async function getJSONData() {
  const url = "boys.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Response Status: ${response.status}");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

async function pageSetup() {
  const promise_json = getJSONData();
  const json = await promise_json.then();
  const num = json.boys.length;

  for (let i = 0; i < num; i++) {

    let listitem = document.createElement("li");
    listitem.classList.add("boys");
    listitem.classList.add(json.boys[i].team);
    listitem.setAttribute("id", "boys-listitem" + i);

    let vorname = document.createElement("p");
    vorname.classList.add("vn");
    vorname.innerHTML = json.boys[i].vorname;
    listitem.appendChild(vorname);

    let nachname = document.createElement("p");
    nachname.classList.add("nn");
    nachname.innerHTML = json.boys[i].nachname;
    listitem.appendChild(nachname);

    // Hier soll mal nen image hin
    let img = document.createElement("img");
    img.setAttribute("src", json.boys[i].imgpath);
    listitem.appendChild(img);

    listitem.appendChild(document.createElement("br"));

    let verZeit = document.createElement("p");
    verZeit.innerHTML = "Verbleibende Zeit:";
    verZeit.classList.add("boys");
    listitem.appendChild(verZeit);

    let counter = document.createElement("p");
    counter.innerHTML =
      '<span id="' +
      i +
      '-h">xx</span>:<span id="' +
      i +
      '-m">xx</span>:<span id="' +
      i +
      '-s">xx</span>';
      
    counter.classList.add("boys");
    counter.classList.add("timer");
    counter.setAttribute("id", "counter" + i);
    listitem.appendChild(counter);

    document.getElementById("boys-list").appendChild(listitem);

    // Set the remaining time in newly created Elements
    const remaining = getRemainingTime(json.boys[i].expire);
    document.getElementById(i + "-h").innerHTML = remaining.hours;
    document.getElementById(i + "-m").innerHTML = remaining.minutes;
    document.getElementById(i + "-s").innerHTML = remaining.seconds;
  }

  // Schedule the update function
  setInterval(update, 1000);
  setInterval(sortElements, 30000);
}

// Returns a JS Object Hours, Minutes
function getRemainingTime(timestamp) {
  var result = { hours: 0, minutes: 0, seconds: 0 };
  // Make Timestamps
  const timestampDate = new Date(timestamp);
  const timenowDate = Date.now();

  // Remaining time in miliseconds
  if (timestampDate < timenowDate) {
    return result;
  }
  var remaining = timestampDate - timenowDate;
  // Convert time to hours & save
  result.hours = Math.floor(remaining / 3600000);
  remaining = remaining - result.hours * 3600000;
  // Convert to minutes
  result.minutes = Math.floor(remaining / 1000 / 60);
  remaining = remaining - result.minutes * 60000;
  // Convert to seconds
  result.seconds = Math.floor(remaining / 1000);

  return result;
}

// Update Function
//
async function update() {
  const jsonnpromise = getJSONData();
  const jsonn = await jsonnpromise.then();
  const num = jsonn.boys.length;
  for (let i = 0; i < num; i++) {
    const remain = getRemainingTime(jsonn.boys[i].expire);

    document.getElementById(i + "-h").innerHTML = remain.hours;
    document.getElementById(i + "-m").innerHTML = remain.minutes;
    document.getElementById(i + "-s").innerHTML = remain.seconds;

    checkerRotTod(remain, i);
  }
}

async function sortElements() {
  listElements = [];

  json_promise = getJSONData();
  json = await json_promise.then();

  for (let i = 0; i < json.boys.length; i++) {
    listElement = { id: "", date: new Date(json.boys[i].expire) };
    listElement.id = "boys-listitem" + i;
    listElements[i] = listElement;
  }
  listElements = listElements.sort(compareListElement);
  const parentElement = document.getElementById("boys-list");

  for (let i = 0; i < json.boys.length; i++) {
    let htmlElement = document.getElementById(listElements[i].id);
    parentElement.append(htmlElement);
  }
}

function compareListElement(a, b) {
  if (a.date < b.date) {
    return -1;
  } else if (a.date > b.date) {
    return 1;
  }
  return 0;
}

function checkerRotTod(input, elementId) {
  if (
    input.hours < ROT.h ||
    (input.hours <= ROT.h && input.minutes < ROT.m) ||
    (input.hours <= ROT.h && input.minutes <= ROT.m && input.seconds < ROT.s)
  ) {
    document.getElementById("counter" + elementId).classList.add("rot");
  }
  if (input.hours == 0 && input.minutes == 0 && input.seconds == 0) {
    document.getElementById("boys-listitem" + elementId).classList.add("tot");
  }
}
