import axios from "axios";
import useSWR from "swr";

async function repositoriesFetcher([url, searchQuery]) {
  const res = await axios.get(url, {
    params: {
      q: searchQuery || "",
      per_page: 10,
    },
  });

  return res.data.items;
}

export default function useRepositories(searchQuery) {
  // useSWR is a nice little hook itself that makes data fetching inside a react project pretty straight forward.
  // SWR is just being used to handle the response and get some data over to our components
  const { data, error, isLoading } = useSWR(
    searchQuery && ["/api/repositories", searchQuery],
    repositoriesFetcher
  );
  console.log("test repo");
  console.log("data111", data);
  console.log("error111", error);
  console.log("isLoading111", isLoading);
  return {
    data,
    isLoading,
    error,
  };
}
