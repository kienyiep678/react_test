import axios from "axios";
import useSWR from "swr";

async function userFetcher(url) {
  const res = await axios.get(url);

  return res.data;
}

export default function useUser() {
  // useSWR will run the api request, and once the data is returned, useSWR is going to hold on that data, it is going to cache it
  // when we can this hook again, rather than makeing new request, instead the hook will return the data that is previously fetched
  //hence it is going to fetch data one single time when our component is first rendered.
  // when it fetches that data, it is going to cache the response in some central cache

  const { data, error, isLoading } = useSWR("/api/user", userFetcher);

  return {
    user: data?.user,
    isLoading,
    error,
  };
}
