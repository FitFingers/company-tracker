// buttons
const todayButton = document.getElementById("today-button");
const yesterdayButton = document.getElementById("yesterday-button");
const thisWeekButton = document.getElementById("this-week-button");

// event listeners
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

function logTodayHours() {
  // ===================================================
  // FUNCTIONS
  // ===================================================
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

  // ===================================================
  // MAIN FUNCTION
  // ===================================================

  const today = `${new Date().getDate()}.`;
  const allEntries = getEntries();
  const totalValues = aggregateEntries(allEntries);

  // Error handling
  if (ensureAllEqual(allEntries)) {
    return handleError(allEntries);
  }

  // All entry times, projects and tasks
  logAll(allEntries);

  // Total aggregate
  console.log(
    `%cHours worked: ${
      totalValues.hours + Math.floor(totalValues.minutes / 60)
    }h ${totalValues.minutes % 60}m`,
    "font-size:24px"
  );
}

// upcoming features
function logYesterdayHours() {
  console.log(`DEBUG Yesterday`);
}
function logThisWeekHours() {
  console.log(`DEBUG ThisWeek`);
}
