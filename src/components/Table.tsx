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
import { fetchData } from "@/lib/fetchData";

type StoryTableProps = {
  topPosts: StoryItem[];
  columns: Column[];
};

type JobTableProps = {
  topJobs: JobItem[];
  columns: Column[];
};

export type Column = {
  key: string;
  label: string;
};

const StoriesTable: React.FC<StoryTableProps> = ({ topPosts, columns }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastIndex, setLastIndex] = useState(10);
  const [currentStories, setCurrentStories] = useState(topPosts);
  const [allStories, setAllStories] = useState([]);
  const [fetchNewStories, setFetchNewStories] = useState(true);

  // set fetchNewStories to true only if topPosts has changed
  useEffect(() => {
    setFetchNewStories(true);
  }, [topPosts]);

  // check if there are more stories to be loaded
  useEffect(() => {
    if (currentStories.length === allStories.length) {
      setHasMore(false);
    }
  }, [currentStories, allStories]);

  const loadMoreStories = async () => {
    setIsLoading(true);

    // fetch all the stories if needed
    if (fetchNewStories) {
      try {
        const fetchedStories = await fetchData("topstories");

        setAllStories(
          fetchedStories.sort((a: StoryItem, b: StoryItem) => b.score - a.score)
        );

        // set fetchNewStories to false until the topPosts is changed
        setFetchNewStories(false);

        // set stories that are displayed
        setCurrentStories((prevStories) => [
          ...prevStories,
          ...fetchedStories.slice(lastIndex, lastIndex + 10),
        ]);

        // set pointer for next stories to be loaded
        setLastIndex((prevIndex) => prevIndex + 10);
      } catch (error) {
        console.error(
          "There has been a problem with fecthing the stories in /Table.tsx. ",
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

const JobsTable: React.FC<JobTableProps> = ({ topJobs, columns }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastIndex, setLastIndex] = useState(10);
  const [currentJobs, setCurrentJobs] = useState(topJobs);
  const [allJobs, setAllJobs] = useState([]);
  const [fetchNewJobs, setFetchNewJobs] = useState(true);

  // set fetchNewJobs to true only if topJobs has changed
  useEffect(() => {
    setFetchNewJobs(true);
  }, [topJobs]);

  // check if there are more jobs to be loaded
  useEffect(() => {
    if (currentJobs.length === allJobs.length) {
      setHasMore(false);
    }
  }, [currentJobs, allJobs]);

  const loadMoreJobs = async () => {
    setIsLoading(true);

    // fetch all the jobs if needed
    if (fetchNewJobs) {
      try {
        const fetchedJobs = await fetchData("jobstories");

        setAllJobs(fetchedJobs);

        // set fetchNewJobs to false until the topJobs is changed
        setFetchNewJobs(false);

        // set stories that are displayed
        setCurrentJobs((prevJobs) => [
          ...prevJobs,
          ...fetchedJobs.slice(lastIndex, lastIndex + 10),
        ]);

        // set pointer for next jobs to be loaded
        setLastIndex((prevIndex) => prevIndex + 10);
      } catch (error) {
        console.error(
          "There has been a problem with fecthing the jobs in /Table.tsx. ",
          error
        );
      }
    } else {
      setCurrentJobs((prevJobs) => [
        ...prevJobs,
        ...allJobs.slice(lastIndex, lastIndex + 10),
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
              onPress={loadMoreJobs}
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
      <TableBody items={currentJobs}>
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

export { StoriesTable, JobsTable };
