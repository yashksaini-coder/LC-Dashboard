"use client";

import React, { useState, useEffect } from "react";
import { Problem } from "./utils/problem";
import Link from "next/link";
import { DetailedProblem } from "./utils/detailedProblem";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [detailedProblems, setDetailedProblems] = useState<DetailedProblem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // New state variables for filters
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [company, setCompany] = useState<string>("ALL");
  const [tagSearch, setTagSearch] = useState<string>("");

  async function fetchProblems() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_LEETCODE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
      }

      // Construct query parameters based on filters
      const difficultyParam = difficulty !== "ALL" ? `difficulty=${difficulty}` : "";
      const tagParam = tagSearch ? `tags=${tagSearch}` : "";
      const queryParams = [difficultyParam, tagParam].filter(Boolean).join("&");

      const res = await fetch(`${apiUrl}/problems?${queryParams}`);
      const data = await res.json();
      if (data && Array.isArray(data.problemsetQuestionList)) {
        setProblems(data.problemsetQuestionList);
        fetchProblemsdata(data.problemsetQuestionList);
      } else {
        setError('Failed to fetch problems');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching problems');
      setLoading(false);
    }
  }

  async function fetchProblemsdata(problems: Problem[]) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_LEETCODE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
      }

      const detailedProblemsData = await Promise.all(
        problems.map(async (problem) => {
          const res = await fetch(`${apiUrl}/select?titleSlug=${problem.titleSlug}`);
          return res.json();
        })
      );

      setDetailedProblems(detailedProblemsData);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Error fetching detailed problems');
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchProblems();
    }
  }, [difficulty, tagSearch]); // Add filters to the dependency array

  return (
    <div className="w-full h-full p-6 shadow-lg rounded-lg">
      <div className="mb-3 bg-violet-800 w-[220px]">
        <h1 className="text-3xl text-center font-bold mb-4">LC-Dashboard</h1>
      </div>

      {/* Filter UI */}
      <div className="mb-4">
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mr-2 outline-none bg-black text-white border border-white px-4 py-3">
          {
            ["ALL", "EASY", "MEDIUM", "HARD"].map((e) => <option className=" border border-white px-4 py-2" value={e}>{e}</option>
            )
          }
        </select>

        <input
          type="text"
          placeholder="Search by tags"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          className="mr-2 outline-none min-w-96 bg-black text-white border border-white px-4 py-3"
        />

        {/* Placeholder for company filter */}
        <select value={company} onChange={(e) => setCompany(e.target.value)} className="mr-2 outline-none bg-black text-white border border-white px-4 py-3">
          <option value="ALL">All Companies</option>
          {/* Add company options here */}
        </select>
      </div>

      {loading ? (
        <div className="flex mb-1 mt-1 justify-center">
          <p className="text-xl text-neutral-500">Loading...</p>
        </div>
      ) : error ? (
        <div className="h-6 w-[200px] border-20 bg-red-500 animate-pulse duration-100">
          <span className="flex justify-center items-center h-full w-full">
            <p className="text-white">{error}</p>
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-neutral-200">
            <thead>
              <tr className="">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Difficulty</th>
                <th className="border px-4 py-2">Acc %</th>
                <th className="border px-4 py-2">Paid</th>
                <th className="border px-4 py-2">Solution</th>
                <th className="border px-4 py-2">Video</th>
                <th className="border px-4 py-2">Tags</th>
                <th className="border px-4 py-2">Likes</th>
                <th className="border px-4 py-2">Dislikes</th>
                <th className="border px-4 py-2">Hints</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(problems) && problems.length > 0 ? (
                problems.map((problem, index) => (
                  <tr key={problem.titleSlug} className="hover:bg-neutral-800">
                    <td className="text-center border px-4 py-2">{problem.questionFrontendId}</td>
                    <td className="border px-4 py-2">
                      <a href={`https://leetcode.com/problems/${problem.titleSlug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-100">
                        {problem.title}
                      </a>
                    </td>
                    <td className={`text-center border px-4 py-2 ${problem.difficulty === 'Easy' ? 'text-green-600' :
                      problem.difficulty === 'Medium' ? 'text-yellow-600' :
                        'text-red-600'}`}>{problem.difficulty}</td>
                    <td className="text-center border px-4 py-2">{Math.round((problem.acRate))}%</td>
                    <td className="border px-4 py-2">{problem.isPaidOnly ? "Yes" : "No"}</td>
                    <td className="text-center border px-4 py-2">{problem.hasSolution ? "Yes" : "No"}</td>
                    <td className="text-center border px-4 py-2">{problem.hasVideoSolution ? "Yes" : "No"}</td>
                    <td className="border text-sm px-4 py-2">{problem.topicTags.map((tag) => tag.name).join(", ")}</td>
                    <td className="border px-4 py-2">{detailedProblems[index]?.likes}</td>
                    <td className="border px-4 py-2">{detailedProblems[index]?.dislikes}</td>
                    <td className="border px-4 py-4 text-jusify">
                      {detailedProblems[index]?.hints?.length > 0 ? (
                        detailedProblems[index].hints.slice(2, 3).map((hint, index) => (
                          <div key={index} className="text-wrap">
                            <ul className="list-inside list-disc">
                              <li className="text-wrap text-xs">{String(hint)}</li>
                            </ul>
                          </div>
                        ))
                      ) : (
                        <span className="text-red-500">No hints found</span>
                      )}
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan={10}>No problems found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}