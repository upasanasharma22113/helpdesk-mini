const BASE_URL = import.meta.env.VITE_API_URL;

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
