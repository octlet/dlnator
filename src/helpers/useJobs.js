"use client";

import { useEffect, useState } from "react";

let jobsCache = [];
let subscribers = new Set();
let intervalId = null;

async function fetchJobs() {
  const res = await fetch("/api/jobs");
  const data = await res.json();
  jobsCache = data.jobs || [];
  subscribers.forEach((fn) => fn(jobsCache));
}

export function useJobs() {
  const [jobs, setJobs] = useState(jobsCache);

  useEffect(() => {
    subscribers.add(setJobs);

    if (subscribers.size === 1) {
      fetchJobs();
      intervalId = setInterval(fetchJobs, 2000);
    }

    return () => {
      subscribers.delete(setJobs);

      if (subscribers.size === 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, []);

  return jobs;
}

export function refetchJobs() {
  return fetchJobs();
}
