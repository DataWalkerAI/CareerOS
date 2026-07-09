window.CareerStorage = (() => {
  const jobsKey = "careeros.jobs";
  const tasksKey = "careeros.tasks";

  const seedJobs = [
    {
      id: "job-asko-it-koordinator",
      company: "ASKO Oslofjord",
      position: "IT-koordinator",
      status: "Preparing",
      deadline: "",
      location: "Vestby, Norway",
      nextAction: "Finish CV and motivation letter",
      url: "Jobs/asko-it-koordinator/job.html",
      createdAt: "2026-07-09T00:00:00.000Z",
      updatedAt: "2026-07-09T00:00:00.000Z",
    },
  ];

  const seedTasks = [
    {
      id: "task-update-cv",
      title: "Update CV",
      notes: "Tailor profile for IT coordinator roles",
      priority: "High",
      dueDate: "",
      completed: false,
      createdAt: "2026-07-09T00:00:00.000Z",
      updatedAt: "2026-07-09T00:00:00.000Z",
    },
    {
      id: "task-motivation-letter",
      title: "Write motivation letter",
      notes: "Connect ASKO needs with support experience",
      priority: "High",
      dueDate: "",
      completed: false,
      createdAt: "2026-07-09T00:00:00.000Z",
      updatedAt: "2026-07-09T00:00:00.000Z",
    },
    {
      id: "task-study-dns",
      title: "Study DNS",
      notes: "Review records, resolution flow and troubleshooting",
      priority: "Medium",
      dueDate: "",
      completed: false,
      createdAt: "2026-07-09T00:00:00.000Z",
      updatedAt: "2026-07-09T00:00:00.000Z",
    },
  ];

  function readJobs() {
    try {
      const storedJobs = JSON.parse(localStorage.getItem(jobsKey));

      if (Array.isArray(storedJobs)) {
        return storedJobs;
      }
    } catch (error) {
      console.warn("CareerOS could not read jobs from LocalStorage.", error);
    }

    saveJobs(seedJobs);
    return seedJobs;
  }

  function saveJobs(jobs) {
    localStorage.setItem(jobsKey, JSON.stringify(jobs));
  }

  function readTasks() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem(tasksKey));

      if (Array.isArray(storedTasks)) {
        return storedTasks;
      }
    } catch (error) {
      console.warn("CareerOS could not read tasks from LocalStorage.", error);
    }

    saveTasks(seedTasks);
    return seedTasks;
  }

  function saveTasks(tasks) {
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
  }

  return {
    readJobs,
    readTasks,
    saveJobs,
    saveTasks,
  };
})();
