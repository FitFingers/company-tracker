class Handlers {
  constructor() {
    this.today = `${new Date().getDate()}.`;
  }

  // TODO: today is undefined
  logToday = () => {
    console.log("hello, world!", { today: this.today });
  };

  // TODO: move common functions here
  // logAll = (entries = [], options = { showTime: true }) => {
  //   const { showTime = true, showDate, showProject, showTask } = options;

  //   if (!entries.length) return;

  //   console.log("All entries:");
  //   console.table(
  //     entries.map((entry) => {
  //       const [task, project, date, time] = [...entry.children].map(
  //         (v) => v.innerText
  //       );

  //       const result = {};
  //       if (showTime) result.time = time;
  //       if (showDate) result.date = date;
  //       if (showProject) result.project = project;
  //       if (showTask) result.task = task;

  //       return result;
  //     })
  //   );
  // };

  // getEntries = () => {
  //   console.log(`DEBUG today`, this.today);
  //   return [...document.querySelectorAll(".MuiTableRow-root")].filter((entry) =>
  //     entry.children[2].innerText.includes(this.today)
  //   );
  // };

  // aggregateEntries = (entries) => {
  //   if (!entries.length) return;
  //   return entries.reduce(
  //     (acc, entry) => {
  //       const [hours, minutes] = entry.children[3].innerText
  //         .split(" ")
  //         .map((v) => Number(v.match(/\d{1,2}/)?.[0]));
  //       return {
  //         hours: acc.hours + hours,
  //         minutes: acc.minutes + minutes,
  //       };
  //     },
  //     {
  //       hours: 0,
  //       minutes: 0,
  //     }
  //   );
  // };

  // ensureAllEqual = (entries) => {
  //   return entries.some(
  //     (entry) =>
  //       entry.children[2].innerText !== allEntries[0].children[2].innerText
  //   );
  // };

  // handleError = (entries) => {
  //   console.log("ERROR! Not all entries are from the same date!");
  //   logAll(entries, {
  //     showTime: true,
  //     showDate: true,
  //     showProject: true,
  //     showTask: true,
  //   });
  // };
}
