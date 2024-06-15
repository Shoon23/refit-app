import { CapacitorHttp } from "@capacitor/core";
import { apiUrlLocal } from "../env";
import useAxios from "../hooks/useAxios";
const fetchSearch = async (
  currPage: number,
  access_token: string,
  searchKey?: string | null,
  muscleFilters?: string[] | null,
  equipmentFilters?: string[] | null
) => {
  const fetch = useAxios();
  const options = {
    url: `${apiUrlLocal}/workouts?page_number=${currPage}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    data: {
      search_key: searchKey || "",
      muscles: muscleFilters || [],
      equipments: equipmentFilters || [],
    },
  };

  return await CapacitorHttp.post(options);
};

const fetchRecommendation = async (
  currPage: number,
  pref: any,
  access_token: string
) => {
  const options = {
    url: `${apiUrlLocal}/workouts/recommendation?is_shuffle=false&page_number=${currPage}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    data: pref,
  };
  return await CapacitorHttp.post(options);
};

export { fetchSearch, fetchRecommendation };
