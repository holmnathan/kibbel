let token: string;

const setToken = (newToken: string) => {
  token = newToken;
};

const getToken = () => {
  return token;
};

const refreshToken = async (): Promise<boolean> => {
  // Import refresh token URI from environment variable
  const { SERVER_REFRESH_TOKEN_URI } = process.env;

  if (!SERVER_REFRESH_TOKEN_URI) {
    console.error(
      "“SERVER_REFRESH_TOKEN_URI” environment variable not provided"
    );
    return false;
  }

  const response = await fetch(SERVER_REFRESH_TOKEN_URI);
  const json = await response.json();
  console.log(json);

  setToken(json.token);
  return true;
};

export { getToken, setToken, refreshToken };
