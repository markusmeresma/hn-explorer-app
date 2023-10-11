import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { JobItem, StoryItem } from "@/pages/api/dataFromHN";
import { Button } from "@nextui-org/react";
// import { column } from "@/pages/top-stories";

type TableProps = {
  topPosts: StoryItem[];
  columns: Column[];
};

export type Column = {
  key: string;
  label: string;
};

const PostsTable: React.FC<TableProps> = ({ topPosts, columns }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastIndex, setLastIndex] = useState(10);
  const [currentStories, setCurrentStories] = useState(topPosts);
  const [allStories, setAllStories] = useState([]);
  const [fetchStories, setFetchStories] = useState(true);

  // set fetchStories to true only if topPosts has changed
  useEffect(() => {
    setFetchStories(true);
  }, [topPosts]);

  // check if there are more stories to be loaded
  useEffect(() => {
    if (currentStories.length === allStories.length) {
      setHasMore(false);
    }

    // console.log("currentStories length: ", currentStories.length);
  }, [currentStories, allStories]);

  const loadMoreStories = async () => {
    setIsLoading(true);

    // fetch all the stories if needed
    if (fetchStories) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/dataFromHN?type=topstories"
        );

        if (!response.ok) {
          throw new Error(
            "Network response was not ok (in Table.tsx): " + response.statusText
          );
        }

        const data = await response.json();

        // Sort the list of all stories and save the state
        setAllStories(
          data.topStories.sort(
            (a: StoryItem, b: StoryItem) => b.score - a.score
          )
        );
        setFetchStories(false); // set fetchStories to false until the topPosts is changed

        // set stories that are displayed
        setCurrentStories((prevStories) => [
          ...prevStories,
          ...data.topStories.slice(lastIndex, lastIndex + 10),
        ]);

        // set pointer for next stories to be loaded
        setLastIndex((prevIndex) => prevIndex + 10);
      } catch (error) {
        console.error(
          "There has been a problem with fecthing the stories in /Table.tsx: ",
          error
        );
      }
    } else {
      setCurrentStories((prevStories) => [
        ...prevStories,
        ...allStories.slice(lastIndex, lastIndex + 10),
      ]);
      setLastIndex((prevIndex) => prevIndex + 10);
    }

    setIsLoading(false);
  };

  return (
    <Table
      aria-label="top-hn-stories"
      bottomContent={
        // using nested ternary operator to determine what to display
        !isLoading && hasMore ? (
          <div className="flex w-full justify-center">
            <Button
              isDisabled={isLoading}
              variant="flat"
              onPress={loadMoreStories}
            >
              Load more
            </Button>
          </div>
        ) : isLoading ? (
          <Spinner color="white" size="sm" />
        ) : null
      }
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={currentStories}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{getKeyValue(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PostsTable;
