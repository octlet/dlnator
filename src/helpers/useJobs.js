"use client";

import { useEffect, useState } from "react";

let jobsCache = [];
let subscribers = new Set();
let intervalId = null;

async function fetchJobs() {
  try {
    const res = await fetch("/api/jobs");
    if (!res.ok) return;

    const data = await res.json();
    jobsCache = Array.isArray(data.jobs) ? data.jobs : jobsCache;
    subscribers.forEach((fn) => fn(jobsCache));
  } catch {
    // keep the last known state, next poll will retry
  }
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
