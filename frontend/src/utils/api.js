const BASE_URL = "http://localhost:5000/api";

export default {
  apiRequest: async (path, options = {}) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    return res.json();
  },
};
