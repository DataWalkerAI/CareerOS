window.CareerStorage = (() => {
  const jobsKey = "careeros.jobs";

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

  return {
    readJobs,
    saveJobs,
  };
})();
