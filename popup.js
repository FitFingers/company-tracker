// ===================================================
// BUTTONS
// ===================================================

const todayButton = document.getElementById("today-button");
const yesterdayButton = document.getElementById("yesterday-button");
const thisWeekButton = document.getElementById("this-week-button");

// ===================================================
// EVENT LISTENERS
// ===================================================

todayButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: logTodayHours,
  });
});

yesterdayButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: logYesterdayHours,
  });
});

thisWeekButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: logThisWeekHours,
  });
});

// ===================================================
// TODAY HANDLERS
// ===================================================

function logTodayHours() {
  const today = `${new Date().getDate()}.`;

  function logAll(entries = [], options = { showTime: true }) {
    const { showTime = true, showDate, showProject, showTask } = options;

    if (!entries.length) return;

    console.log("All entries:");
    console.table(
      entries.map((entry) => {
        const [task, project, date, time] = [...entry.children].map(
          (v) => v.innerText
        );

        const result = {};
        if (showTime) result.time = time;
        if (showDate) result.date = date;
        if (showProject) result.project = project;
        if (showTask) result.task = task;

        return result;
      })
    );
  }

  function getEntries() {
    return [...document.querySelectorAll(".MuiTableRow-root")].filter((entry) =>
      entry.children[2].innerText.includes(today)
    );
  }

  function aggregateEntries(entries) {
    if (!entries.length) return;
    return entries.reduce(
      (acc, entry) => {
        const [hours, minutes] = entry.children[3].innerText
          .split(" ")
          .map((v) => Number(v.match(/\d{1,2}/)?.[0]));
        return {
          hours: acc.hours + hours,
          minutes: acc.minutes + minutes,
        };
      },
      {
        hours: 0,
        minutes: 0,
      }
    );
  }

  function ensureAllEqual(entries) {
    return entries.some(
      (entry) =>
        entry.children[2].innerText !== allEntries[0].children[2].innerText
    );
  }

  function handleError(entries) {
    console.log("ERROR! Not all entries are from the same date!");
    logAll(entries, {
      showTime: true,
      showDate: true,
      showProject: true,
      showTask: true,
    });
  }

  // CORE LOGIC
  // ===================================================
  const allEntries = getEntries();
  const totalValues = aggregateEntries(allEntries);

  // Error handling
  if (ensureAllEqual(allEntries)) {
    return handleError(allEntries);
  }

  // All entry times, projects and tasks
  logAll(allEntries);

  // Total aggregate
  const total = `${totalValues.hours + Math.floor(totalValues.minutes / 60)}h ${
    totalValues.minutes % 60
  }m`;

  console.log(
    `%cHours worked: ${total} %cDEBUG`,
    "font-size:24px",
    "font-size:1px;color:transparent;"
  );
  alert(`Hours worked: ${total}`);
}

// ===================================================
// YESTERDAY HANDLERS
// ===================================================

function logYesterdayHours() {
  const yesterday = `${new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).getDate()}.`;

  function logAll(entries = [], options = { showTime: true }) {
    const { showTime = true, showDate, showProject, showTask } = options;

    if (!entries.length) return;

    console.log("All entries:");
    console.table(
      entries.map((entry) => {
        const [task, project, date, time] = [...entry.children].map(
          (v) => v.innerText
        );

        const result = {};
        if (showTime) result.time = time;
        if (showDate) result.date = date;
        if (showProject) result.project = project;
        if (showTask) result.task = task;

        return result;
      })
    );
  }

  function getEntries() {
    return [...document.querySelectorAll(".MuiTableRow-root")].filter((entry) =>
      entry.children[2].innerText.includes(yesterday)
    );
  }

  function aggregateEntries(entries) {
    if (!entries.length) return;
    return entries.reduce(
      (acc, entry) => {
        const [hours, minutes] = entry.children[3].innerText
          .split(" ")
          .map((v) => Number(v.match(/\d{1,2}/)?.[0]));
        return {
          hours: acc.hours + hours,
          minutes: acc.minutes + minutes,
        };
      },
      {
        hours: 0,
        minutes: 0,
      }
    );
  }

  function ensureAllEqual(entries) {
    return entries.some(
      (entry) =>
        entry.children[2].innerText !== allEntries[0].children[2].innerText
    );
  }

  function handleError(entries) {
    console.log("ERROR! Not all entries are from the same date!");
    logAll(entries, {
      showTime: true,
      showDate: true,
      showProject: true,
      showTask: true,
    });
  }

  // CORE LOGIC
  // ===================================================
  const allEntries = getEntries();
  const totalValues = aggregateEntries(allEntries);

  // Error handling
  if (ensureAllEqual(allEntries)) {
    return handleError(allEntries);
  }

  // All entry times, projects and tasks
  logAll(allEntries);

  // Total aggregate
  const total = `${totalValues.hours + Math.floor(totalValues.minutes / 60)}h ${
    totalValues.minutes % 60
  }m`;

  console.log(
    `%cHours worked: ${total} %cDEBUG`,
    "font-size:24px",
    "font-size:1px;color:transparent;"
  );
  alert(`Hours worked: ${total}`);
}

// ===================================================
// THIS WEEK HANDLERS
// ===================================================

function logThisWeekHours() {
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  const daysDifference = getNumDaysDifference(today, startOfWeek);
  const allDateStrings = getDateStrings(today, daysDifference);

  function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (!day ? -6 : 1);
    return new Date(new Date().setDate(diff));
  }

  function getNumDaysDifference(startDate, endDate) {
    return Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  }

  function getDateStrings(date, daysBack) {
    return [...Array(daysBack)].map((_, idx) => {
      const _date = new Date(date);
      return `${new Date(_date.setDate(_date.getDate() - idx)).getDate()}.`;
    });
  }

  function logAll(entries = [], options = { showTime: true }) {
    const { showTime = true, showDate, showProject, showTask } = options;

    if (!entries.length) return;

    console.log("All entries:");
    console.table(
      entries.map((entry) => {
        const [task, project, date, time] = [...entry.children].map(
          (v) => v.innerText
        );

        const result = {};
        if (showTime) result.time = time;
        if (showDate) result.date = date;
        if (showProject) result.project = project;
        if (showTask) result.task = task;

        return result;
      })
    );
  }

  function getEntries(date) {
    return [...document.querySelectorAll(".MuiTableRow-root")].filter((entry) =>
      entry.children[2].innerText.includes(date)
    );
  }

  function aggregateEntries(entries) {
    if (!entries.length) return;
    return entries.reduce(
      (acc, entry) => {
        const [hours, minutes] = entry.children[3].innerText
          .split(" ")
          .map((v) => Number(v.match(/\d{1,2}/)?.[0]));
        return {
          hours: acc.hours + hours,
          minutes: acc.minutes + minutes,
        };
      },
      {
        hours: 0,
        minutes: 0,
      }
    );
  }

  // CORE LOGIC
  // ===================================================
  const allEntries = allDateStrings.reduce(
    (acc, date) => [...acc, ...getEntries(date)],
    []
  );

  const totalValues = aggregateEntries(allEntries);

  // All entry times, projects and tasks
  logAll(allEntries);

  // Total aggregate
  const total = `${totalValues.hours + Math.floor(totalValues.minutes / 60)}h ${
    totalValues.minutes % 60
  }m`;

  console.log(
    `%cHours worked: ${total} %cDEBUG`,
    "font-size:24px",
    "font-size:1px;color:transparent;"
  );
  alert(`Hours worked: ${total}`);
}
