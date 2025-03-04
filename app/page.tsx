"use client";

import React, { useState, useEffect } from "react";
import { Problem } from "./utils/problem";
import { HintCard } from "@/components/HintCard";
import { DetailedProblem } from "./utils/detailedProblem"; 
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
    <div className="p-3 sm:p-4 md:p-6 shadow-lg rounded-lg">
      <div className="bg-violet-800 w-full sm:w-[220px] mb-6">
        <h1 className="text-2xl sm:text-3xl text-center font-bold mb-4">LC-Dashboard</h1>
      </div>
      
      <div className="flex flex-col md:flex-row justify-stretch mb-4">
        <div className="gap-2">
          <ul className="list-disc list-outside ml-4">
            <li className="text-white text-sm sm:text-base">
              This is a simple Next.js app that fetches data from an API and displays
              it on the page.
            </li>
            <li className="text-white mb-3 text-sm sm:text-base flex flex-wrap items-center"> 
              Check the
              <Link 
                href="https://github.com/yashksaini-coder/LC-Dashboard" 
                target="_blank"
                className="mx-2 px-3 py-0.5 bg-white text-black hover:bg-cyan-700 hover:text-white font-bold transition-colors"
              >
                Repository
              </Link>
              for more information.
            </li>
          </ul>
        </div>
      </div>
      
      {loading ? (
        <div className="flex mb-1 mt-1 justify-center">
          <Loader color="purple" size="xl"/>
        </div>
      ) : error ? (
        <div className="h-6 w-full sm:w-[200px] border-20 animate-pulse bg-red-600 duration-500">
          <span className="flex justify-center items-center h-full w-full">
            <p className="font-semibold text-white">{error}</p>
          </span>
        </div>
      ) : (
        <> 
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-3 gap-4">
          {/* Pagination Controls */}
          <div className="flex flex-wrap justify-start items-center my-3 sm:my-6 gap-2 sm:gap-4 w-full lg:w-auto">
            <button className="px-2 sm:px-4 py-1 sm:py-2 border border-white text-white font-semibold hover:bg-neutral-600/50 duration-200 transition-colors disabled:opacity-50"
              onClick={() => setPage(1)}
              disabled={page === 1}>
              Home
            </button>
            <button
              className="px-2 sm:px-4 py-1 sm:py-2 border border-white text-white font-semibold hover:bg-neutral-600/50 duration-200 transition-colors disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-base sm:text-lg">Page {page}</span>
            <button
              className="px-2 sm:px-4 py-1 sm:py-2 border border-white font-semibold hover:bg-neutral-600/50 duration-200 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={problems.length === 0}
            >
              Next
            </button>
          </div>
          
          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-start sm:items-center gap-3">
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">  
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)} 
                className="w-full sm:w-auto mr-0 sm:mr-2 outline-none bg-black text-white border border-white px-4 py-2"
              >
                {
                  ["ALL", "EASY", "MEDIUM", "HARD"].map((e) => <option key={e} className="border border-white px-4 py-2" value={e}>{e}</option>)
                }
              </select>

              <input
                type="text"
                placeholder="Search by tags"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full sm:w-auto mr-0 sm:mr-2 outline-none sm:min-w-[240px] md:min-w-[300px] lg:min-w-[240px] xl:min-w-[360px] h-9 bg-black text-white border border-white px-4 py-2"
              />
            </div>
            
            <div className="w-full sm:w-auto flex items-center gap-2">
              <label className="text-white text-sm sm:text-base">Problems per page:</label>
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
        </div>
        
        {/* Responsive Table */}
        <div className="overflow-x-auto max-w-full">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base">ID</th>
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base">Title</th>
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base">Difficulty</th>
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base">Acc %</th>
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base">Video</th>
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base">Tags</th>
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base"><ThumbsUp className="text-green-600 h-4 w-4 sm:h-5 sm:w-5"/></th>
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base"><ThumbsDown className="text-red-600 h-4 w-4 sm:h-5 sm:w-5"/></th>  
                <th className="border px-2 sm:px-4 py-2 text-xs sm:text-base">Hints</th>              
              </tr>
            </thead>
            <tbody>
              {Array.isArray(problems) && problems.length > 0 ? (
                problems.map((problem, index) => (
                  <tr key={problem.titleSlug} className="hover:bg-neutral-800">
                    <td className="text-center border px-2 sm:px-4 py-2 text-xs sm:text-base">{detailedProblems[index]?.questionId}</td>
                    <td className={`border text-xs sm:text-sm font-bold px-2 sm:px-4 py-2 ${detailedProblems[index]?.isPaidOnly ? 'hover:bg-amber-500' : 'hover:bg-cyan-500'} hover:text-black`}>
                      <a href={`https://leetcode.com/problems/${problem.titleSlug}`}
                        target="_blank">
                          {`${problem.title}`}
                      </a>
                    </td>
                    <td className={`text-center font-semibold border px-2 sm:px-4 py-2 text-xs sm:text-base ${problem.difficulty === 'Easy' ? 'text-green-600' :
                      problem.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>{problem.difficulty}</td>
                    <td className="text-center border px-2 sm:px-4 py-2 text-xs sm:text-base">{Math.round((problem.acRate))}%</td>
                    <td className="text-center border px-2 sm:px-4 py-2 text-xs sm:text-base">{problem.hasVideoSolution ? "Yes" : "No"}</td>
                    <td className="border text-wrap text-[10px] xs:text-xs px-2 sm:px-4 py-2">{problem.topicTags.map((tag) => tag.name).join(", ")}</td>
                    <td className="border px-2 sm:px-4 py-2 text-xs sm:text-base">{detailedProblems[index]?.likes > 1000 ? (`${Math.round(detailedProblems[index]?.likes / 1000)}K`
                    ) : (detailedProblems[index]?.likes)}</td>
                    <td className="border px-2 sm:px-4 py-2 text-xs sm:text-base">{detailedProblems[index]?.dislikes > 1000 ? (`${Math.round(detailedProblems[index]?.dislikes / 1000)}K`
                    ) : (detailedProblems[index]?.dislikes)}</td>
                    <td className="border text-center px-2 sm:px-4 py-2">
                      {detailedProblems[index]?.hints?.length > 0 ? (
                        <HintCard hints={detailedProblems[index].hints} />
                      ) : (
                        <span className="text-red-500 text-xs sm:text-base">No hints found</span>
                      )}
                    </td>
                  </tr>
                ))) : (
                <tr>
                  <td className="border px-4 py-2 text-center" rowSpan={10} colSpan={10}>No problems found</td>
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
