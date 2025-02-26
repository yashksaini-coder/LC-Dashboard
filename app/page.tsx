"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Problem } from "./utils/problem";
import Link from "next/link";
import { DetailedProblem } from "./utils/detailedProblem"; // Import the new type
import { HintCard } from "../components/HintCard";
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [detailedProblems, setDetailedProblems] = useState<DetailedProblem[]>([]); // Specify the type
  const [error, setError] = useState<string | null>(null);

  async function fetchProblems() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_LEETCODE_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
      }

      const res = await fetch(`${apiUrl}/problems`);
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
      fetchProblems()
    }
  }, []); // Add fetchProblems to the dependency array

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
            <div className=" ml-1 mr-1 w-[90px] align-items justify-center inline-block text-black hover:bg-cyan-700 bg-white hover:text-white">
              <span className="ml-1 mr-1 mb-3 justify-center font-bold">
                <Link href="https://github.com/yashksaini-coder/LC-Dashboard" target="_blank">Repository</Link>
              </span>
            </div>
            for more information.
          </li>
        </ul>
      </div>
      {loading ? (
        <div className="flex mb-1 mt-1 justify-center">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      ) : error ? (
        <div className="h-6 w-[200px] border-20 animate-pulse bg-red-600 duration-500">
          <span className="flex justify-center items-center h-full w-full">
            <p className="font-bold text-white">{error}</p>
          </span>
        </div>
      ) : (
        <div className="w-full h-full overflow-x-auto mt-4">
          <table className="w-full h-full border border-gray-200">
            <thead>
              <tr className=" bg-gray-800 text-white">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Difficulty</th>
                <th className="border px-4 py-2">Acc %</th>
                <th className="border px-4 py-2">Video</th>
                <th className="border px-4 py-2">Tags</th>
                <th className="border px-4 py-2"><ThumbsUp className="text-green-600"/></th>
                <th className="border px-4 py-2"><ThumbsDown className="text-red-600"/></th> 
                <th className="border px-4 py-2">Hints</th>              
              </tr>
            </thead>
            <tbody>
              {Array.isArray(problems) && problems.length > 0 ? (
                problems.map((problem, index) => (
                  <tr key={problem.titleSlug} className="hover:bg-gray-800">
                    <td className="text-center border px-4 py-2">{problem.questionFrontendId}</td>
                    <td className="border w-[50%]text-sm font-bold px-4 py-2">
                      <a href={`https://leetcode.com/problems/${problem.titleSlug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-100">
                        {problem.title}
                      </a>
                    </td>
                    <td className={`text-center border px-4 py-2 ${problem.difficulty === 'Easy' ? 'text-green-600' :
                      problem.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>{problem.difficulty}</td>
                    <td className="text-center border px-4 py-2">{Math.round((problem.acRate))}%</td>
                    <td className="text-center border px-4 py-2">{problem.hasVideoSolution ? "Yes" : "No"}</td>
                    <td className="border text-wrap text-xs px-4 py-2">{problem.topicTags.map((tag) => tag.name).join(", ")}</td>
                    <td className="border px-4 py-2">{detailedProblems[index]?.likes}</td>
                    <td className="border px-4 py-2">{detailedProblems[index]?.dislikes}</td>
                    <td className="border text-center px-4 py-2">
                      {detailedProblems[index]?.hints?.length > 0 ? (
                        <HintCard hints={detailedProblems[index].hints} />
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