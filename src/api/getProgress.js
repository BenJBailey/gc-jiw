export const getProgress = async () => {
  const url = "https://benjbailey.com/gc-building/data.json";
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(err);
    return {};
  }
};

