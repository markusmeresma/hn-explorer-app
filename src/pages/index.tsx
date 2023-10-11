import Link from "next/link";
import React from "react";
import { Button } from "@nextui-org/react";

const Menu: React.FC = () => {
  return (
    <div>
      <h1 >Welcome to hacker news explorer!</h1>
      <Link href="/top-stories">
        <Button>Top stories</Button>
      </Link>
      <Link href="/top-jobs">
        <Button>Top jobs</Button>
      </Link>
    </div>
  );
};

export default Menu;
