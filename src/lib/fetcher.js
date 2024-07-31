import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_URL;

export const getApi = async (endpoint, params) => {
  try {
    const response = await axios.get(apiUrl + endpoint, {
      params,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (err) {
    throw new Error("Something went wrong!");
  }
};

export const postApi = async (endpoint, data) => {
  try {
    const response = await axios.post(apiUrl + endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add!");
  }
};

export const putApi = async (endpoint, data) => {
  try {
    const response = await axios.put(apiUrl + endpoint, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update!");
  }
};

export const deleteApi = async (endpoint) => {
  try {
    const response = axios.delete(apiUrl + endpoint);
    return response;
  } catch (error) {
    throw new Error("Failed to delete!");
  }
};
