import { StoryItem } from "@/pages/api/dataFromHN";
import { JobItem } from "@/pages/api/dataFromHN";

export async function fetchStories(type: string): Promise<any> {
  try {
    // Get stories from the api
    const response = await fetch(
      `http://localhost:3000/api/dataFromHN?type=${type}`
    );

    if (!response.ok) {
      throw new Error(
        "Network response was not ok (in top-stories.tsx): " +
          response.statusText
      );
    }

    // Save the returned JSON object in a variable
    const data = await response.json();

    return data.topStories;
  } catch (error) {
    console.error(
      "There has been a problem with fetching the stories in /lib/fetchData: " +
        error
    );

    // Re-throw error to let the caller function handle it
    throw error;
  }
}
