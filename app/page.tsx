"use client";

import React, { useState, useEffect } from "react";
import { Problem } from "./utils/problem";
import { HintCard } from "@/components/HintCard";
import { DetailedProblem } from "./utils/detailedProblem"; // Import the new type
import Link from "next/link";
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Loader } from "@/components/percept-ui/loader";
import { getTagSlug } from "@/lib/tags";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [detailedProblems, setDetailedProblems] = useState<DetailedProblem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filters and Pagination State
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [tagSearch, setTagSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  function parseTags(tagSearch: string): string {
    if (!tagSearch) return '';
    return tagSearch
      .split(',')
      .map(tag => getTagSlug(tag.trim()))
      .filter(Boolean)
      .join(',');
  }
  
  async function fetchProblems() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_LEETCODE_API_URL;
      if (!apiUrl) {
        setError("API URL is not defined in environment variables")
        throw new Error("API URL is not defined in environment variables");
      }

      const difficultyParam = difficulty !== "ALL" ? `difficulty=${difficulty}` : "";
      const parsedTags = parseTags(tagSearch); // Call parseTags function
      const tagParam = parsedTags ? `tags=${parsedTags}` : "";
      const skip = (page - 1) * limit;
      const queryParams = [difficultyParam, tagParam, `limit=${limit}`, `skip=${skip}`]
        .filter(Boolean)
        .join("&");
      
      // console.log(queryParams); // Debug statement:- Log the query params to the console
      const res = await fetch(`${apiUrl}/problems?${queryParams}`);
      const data = await res.json();
      if (data && Array.isArray(data.problemsetQuestionList)) {
        setProblems(data.problemsetQuestionList);
        fetchProblemsData(data.problemsetQuestionList);
      } else {
        setError("Failed to fetch problems");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching problems");
      setLoading(false);
    }
  }

  async function fetchProblemsData(problems: Problem[]) {
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
      setError("Error fetching detailed problems");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchProblems();
    }
  }, [difficulty, tagSearch, page, limit]);
  
  return (
    <div className="w-full h-full p-6 shadow-lg rounded-lg">
      <div className="bg-violet-800 w-[220px]">
      {/* <Link href="/"> */}
        <h1 className="text-3xl text-center font-bold mb-4">LC-Dashboard</h1>
      {/* </Link> */}
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
          <Loader color="purple" size="xl"/>
        </div>
      ) : error ? (
        <div className="h-6 w-[200px] border-20 animate-pulse bg-red-600 duration-500">
          <span className="flex justify-center items-center h-full w-full">
            <p className="font-bold text-white">{error}</p>
          </span>
        </div>
      ) : (
        <> 
        <div className="flex justify-between items-center mb-3">
        <div className="flex justify-end items-center my-6 gap-4">
            <button className="px-4 py-2 border border-white text-white font-semibold hover:bg-neutral-600/50 duration-200 transition-colors disabled:opacity-50"
              onClick={() => setPage(1)}
              disabled={page === 1}>
              Home
            </button>
            <button
              className="px-4 py-2 border border-white text-white font-semibold hover:bg-neutral-600/50 duration-200 transition-colors disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-lg">Page {page}</span>
            <button
              className="px-4 py-2 border border-white font-semibold hover:bg-neutral-600/50 duration-200 transition-colors text-white"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
          <div className="my-2 justify-end items-center flex gap-2">  
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mr-2 outline-none bg-black text-white border border-white px-4 py-2">
              {
                ["ALL", "EASY", "MEDIUM", "HARD"].map((e) => <option key={e} className=" border border-white px-4 py-2" value={e}>{e}</option>
                )
              }
            </select>

            <input
              type="text"
              placeholder="Search by tags"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="mr-2 outline-none min-w-96 h-9 bg-black text-white border border-white px-4 py-2"
            />
          </div>
          <div className="my-2 flex items-center gap-2">
            <label className="text-white">Problems per page:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="outline-none bg-black text-white border border-white px-4 py-2"
            >
              {[10, 20, 30].map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
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
                    <tr key={problem.titleSlug} className="hover:bg-neutral-800">
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
        </>
      )}
    </div>
  );
}
