"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Problem } from "./utils/problem";
import Link from "next/link";

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
          console.error(err);
          setLoading(false);
      }
  }

  useEffect(() => {
      fetchProblems();
  }, []);

  return (
    <div className="w-full h-full p-6 shadow-lg rounded-lg">
      <div className="mb-3 bg-violet-800 w-[220px]">
        <h1 className="text-3xl text-center font-bold mb-4">LC-Dashboard</h1>
      </div>
      <div>
        <ul className="list-disc list-outside ml-4">
              
          <li className="text-white">
            This is a simple Next.js app that fetches data from an API and displays
            it on the page.
          </li>
          <li className="text-white mb-3"> 
            Check the 
              <span className="ml-1 mr-1 mb-3 font-bold text-black animation: bg-red-700 hover:bg-white hover:text-black">
                <Link href="https://github.com/yashksaini-coder/LC-Dashboard" target="_blank">Repository</Link>
              </span>
            for more information.
          </li>
        </ul>
      </div>
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
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Difficulty</th>
                <th className="border px-4 py-2">Acc %</th>
                {/* <th className="border px-4 py-2">Favorite</th> */}
                <th className="border px-4 py-2">Paid</th>
                <th className="border px-4 py-2">Solution</th>
                <th className="border px-4 py-2">Video</th>
                <th className="border px-4 py-2">Tags</th>
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
                    <td className={`text-center border px-4 py-2 ${
                      problem.difficulty === 'Easy' ? 'text-green-600' :
                      problem.difficulty === 'Medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{problem.difficulty}</td>
                    <td className="text-center border px-4 py-2">{Math.round((problem.acRate))}%</td>
                    {/* <td className="border px-4 py-2">{problem.isFavor ? "Yes" : "No"}</td> */}
                    <td className="border px-4 py-2">{problem.isPaidOnly ? "Yes" : "No"}</td>
                    <td className="text-center border px-4 py-2">{problem.hasSolution ? "Yes" : "No"}</td>
                    <td className="text-center border px-4 py-2">{problem.hasVideoSolution ? "Yes" : "No"}</td>
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