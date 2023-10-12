import { Column, JobsTable } from "@/components/Table";
import { JobItem } from "./api/dataFromHN";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { fetchData } from "@/lib/fetchData";

type TopJobsProps = {
  filteredJobsList: JobItem[];
};

// Revisit the columns
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
    key: "url",
    label: "Link",
  },
];

export const getStaticProps = async () => {
  let topJobsList: JobItem[];
  let filteredJobsList: JobItem[];

  try {
    topJobsList = await fetchData("jobstories");
    filteredJobsList = topJobsList.slice(0, 10);

    return {
      props: { filteredJobsList },
      revalidate: 86400,
    };
  } catch (error) {
    console.error(
      "There has been a problem with fetching the jobs in /top-jobs. " + error
    );

    return {
      props: { filteredJobsList: [] },
    };
  }
};

const TopJobs: React.FC<TopJobsProps> = ({ filteredJobsList }) => {
  return (
    <div>
      <Link href="/">
        <Button className="ml-5 mb-3 mt-3">Back to home page</Button>
      </Link>
      <h1 className="ml-5 mb-2 text-2xl">Top job stories from HN</h1>
      <JobsTable topJobs={filteredJobsList} columns={columns} />
    </div>
  );
};

export default TopJobs;
