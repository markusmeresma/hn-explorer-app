import { Column } from "@/components/Table";
import { JobItem } from "./api/dataFromHN";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import PostsTable from "@/components/Table";

type TopJobsProps = {
    jobStories: JobItem[];
}

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
    
}

const TopJobs: React.FC<TopJobsProps> = ({ jobStories }) => {
    return (
        <div>
      <Link href="/">
        <Button>Back to home page</Button>
      </Link>
      <h1>Top job stories from HN</h1>
      <PostsTable topPosts={jobStories} columns={columns} />
    </div>
    );
}

export default TopJobs;