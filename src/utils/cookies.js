const getCookies = (req) => {
  const { cookie } = req.headers;
  if (!cookie) return {};
  const [key, value] = cookie.split("=");
  return { [key]: value };
};

export { getCookies };
