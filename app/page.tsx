"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Problem } from "./utils/problem";
import { NextResponse } from 'next/server';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchProblems() {
      try {
          const res = await fetch('https://leetcode-stats-v1.onrender.com/problems');
          const data = await res.json();
          console.log("Fetched data:", data); // Debugging statement
          if (data && Array.isArray(data.problemsetQuestionList)) {
              setProblems(data.problemsetQuestionList);
          } else {
              setError('Failed to fetch problems');
          }
          setLoading(false);
      } catch (err) {
          setError('Failed to fetch problems');
          setLoading(false);
      }
  }

  useEffect(() => {
      fetchProblems();
  }, []);

  return (
    <div className="w-full h-full bg-gray p-6 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">LeetCode Stats</h1>
      <p className="mb-6 text-gray-600">
        This is a simple Next.js app that fetches data from an API and displays
        it on the page.
      </p>

      {loading ? (
        <div className="flex justify-center">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="">
                <th className="border px-4 py-2">Question ID</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Difficulty</th>
                <th className="border px-4 py-2">Acceptance %</th>
                {/* <th className="border px-4 py-2">Favorite</th>
                <th className="border px-4 py-2">Paid Only</th> */}
                <th className="border px-4 py-2">Solution</th>
                <th className="border px-4 py-2">Video Solution</th>
                {/* <th className="border px-4 py-2">Question ID</th> */}
                <th className="border px-4 py-2">Topic Tags</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(problems) && problems.length > 0 ? (
                problems.map((problem) => (
                  <tr key={problem.titleSlug} className="hover:bg-gray-800">
                    <td className="text-center border px-4 py-2">{problem.questionFrontendId}</td>
                    <td className="border px-4 py-2">
                      <a href={`https://leetcode.com/problems/${problem.titleSlug}`}
                         className="text-blue-600 hover:text-blue-800">
                        {problem.title}
                      </a>
                    </td>
                    <td className={`border px-4 py-2 ${
                      problem.difficulty === 'Easy' ? 'text-green-600' :
                      problem.difficulty === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{problem.difficulty}</td>
                    <td className="text-center border px-4 py-2">{Math.ceil(problem.acRate)}</td>
                    {/* <td className="border px-4 py-2">{problem.isFavor ? "Yes" : "No"}</td>
                    <td className="border px-4 py-2">{problem.isPaidOnly ? "Yes" : "No"}</td> */}
                    <td className="text-center border px-4 py-2">{problem.hasSolution ? "Yes" : "No"}</td>
                    <td className="text-center border px-4 py-2">{problem.hasVideoSolution ? "Yes" : "No"}</td>
                    {/* <td className="text-center border px-4 py-2">{problem.questionFrontendId}</td> */}
                    <td className="border px-4 py-2">{problem.topicTags.map((tag) => tag.name).join(", ")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2 text-center">No problems found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}