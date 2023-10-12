import Link from "next/link";
import React from "react";
import { Button } from "@nextui-org/react";

const Menu: React.FC = () => {
  return (
    <div className="flex flex-col">
      <h1 className="flex justify-center m-8 text-2xl">Welcome to hacker news explorer!</h1>
      <div className="flex flex-col gap-8 justify-center">
        <Link href="/top-stories" className="flex justify-center">
          <Button>Click here to view up to 500 top stories</Button>
        </Link>
        <Link href="/top-jobs" className="flex justify-center">
          <Button>Click here to view top jobs</Button>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
