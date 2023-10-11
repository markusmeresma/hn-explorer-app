import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import PostsTable from "../components/Table";
import { StoryItem } from "./api/dataFromHN";
import { fetchStories } from "@/lib/fetchData";
import { Column } from "../components/Table";

type TopStoriesProps = {
  filteredTopStories: StoryItem[];
};

/*
export type column = {
  key: string;
  label: string;
};
*/

const columns: Column[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "by",
    label: "Author",
  },
  {
    key: "score",
    label: "Score",
  },
  {
    key: "url",
    label: "Link",
  },
];

export const getStaticProps = async () => {
  let allTopStoriesList: StoryItem[] = [];
  let filteredTopStories: StoryItem[] = [];

  try {
    /*
    // Get stories from the api
    const response = await fetch(
      "http://localhost:3000/api/dataFromHN?type=topstories"
    );

    if (!response.ok) {
      throw new Error(
        "Network response was not ok (in top-stories.tsx): " +
          response.statusText
      );
    }

    // Save the returned JSON object in a variable
    const data = await response.json();

    // Access the list of top stories from the JSON object
    allTopStoriesList = data.topStories;
    */

    allTopStoriesList = await fetchStories("topstories");

    // Order the top stories in descending order
    allTopStoriesList.sort((a, b) => b.score - a.score);

    // Filter out top 10 stories
    filteredTopStories = allTopStoriesList.slice(0, 10);

    return {
      props: { filteredTopStories },
      revalidate: 86400, // request new data every 24 hours
    };
  } catch (error) {
    console.error(
      "There has been a problem with fetching the stories in /top-stories: " +
        error
    );

    return {
      props: { filteredTopStories: [] },
    };
  }
};

const TopStories: React.FC<TopStoriesProps> = ({ filteredTopStories }) => {
  return (
    <div>
      <Link href="/">
        <Button>Back to home page</Button>
      </Link>
      <h1>Up to 500 top and new HN stories</h1>
      <PostsTable topPosts={filteredTopStories} columns={columns} />
    </div>
  );
};

export default TopStories;
