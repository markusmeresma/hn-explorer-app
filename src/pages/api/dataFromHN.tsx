// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

interface Item {
  id: number;
  type: string;
  by: string;
  url: string;
  title: string;
}

export interface StoryItem extends Item {
  score: number;
}

export interface JobItem extends Item {
  text: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { type } = req.query;
  let itemIDs: number[] = [];
  let topStories: StoryItem[] = [];

  // Fetch the story IDs
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/${type}.json?`
    );

    // Throw new error when there's a failed HTTP request (does not throw an exception by itself)
    if (!response.ok) {
      throw new Error("Network response was not ok. " + response.statusText);
    }

    itemIDs = await response.json();
  } catch (error) {
    // Send a error response
    res.status(500).json({
      error:
        "There has been a problem fetching the IDs of top stories in /api/dataFromHN.",
    });
  }

  // Fetch individual story props for each story ID
  try {
    const storyPromises = itemIDs.map((itemID) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${itemID}.json`).then(
        (response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok when fetching top ten story props. " +
                response.statusText
            );
          }
          return response.json();
        }
      )
    );
    topStories = await Promise.all(storyPromises);

    res.status(200).json({ topStories });
  } catch (error) {
    // Send a error response
    res.status(500).json({
      error:
        "There has been a problem fetching individual story details /api/dataFromHN. ",
    });
  }
};
