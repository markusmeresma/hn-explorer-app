import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { StoriesTable } from "../components/Table";
import { StoryItem } from "./api/dataFromHN";
import { fetchData } from "@/lib/fetchData";
import { Column } from "../components/Table";

type TopStoriesProps = {
  filteredTopStories: StoryItem[];
};

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
    allTopStoriesList = await fetchData("topstories");

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
      "There has been a problem with fetching the stories in /top-stories. " +
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
        <Button className="ml-5 mb-3 mt-3">Back to home page</Button>
      </Link>
      <h1 className="ml-5 mb-2 text-2xl">Up to 500 top and new HN stories</h1>
      <StoriesTable topPosts={filteredTopStories} columns={columns} />
    </div>
  );
};

export default TopStories;
