const createRefreshToken = () => {
  // Import refresh token URI from environment variable
  const { NEXT_PUBLIC_REFRESH_TOKEN_URI } = process.env;

  if (!NEXT_PUBLIC_REFRESH_TOKEN_URI)
    throw new Error(
      "“NEXT_PUBLIC_REFRESH_TOKEN_URI” environment variable not provided"
    );

  console.log("Refreshing Tokens", NEXT_PUBLIC_REFRESH_TOKEN_URI);

  return async () => {
    return await fetch(NEXT_PUBLIC_REFRESH_TOKEN_URI, {
      method: "POST",
      credentials: "include",
    });
  };
};

export default createRefreshToken;
