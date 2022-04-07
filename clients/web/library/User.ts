import jwtDecode, { JwtPayload } from "jwt-decode";

class User {
  private _token: string;
  private _idToken: string;
  private _isSignedIn: boolean;

  public get token() {
    return this._token;
  }

  public set token(newToken: string) {
    console.log("Set Access Token");
    this._token = newToken;
  }

  public get idToken() {
    return this._idToken;
  }

  public set idToken(newToken: string) {
    this._idToken = newToken;
  }

  public test = () => {
    this.idToken = "asdfasdf";
  };

  public isTokenValidOrUndefined = (): boolean => {
    console.log("Validating Access Token");
    // if (!this._token) return true;

    try {
      const { exp, ...args } = jwtDecode<JwtPayload>(this._token);
      console.log(args);
      if (!exp) return false;

      console.log(`Expired ${Date.now() >= exp * 1000}`);
      return Date.now() >= exp * 1000;
    } catch {
      return false;
    }
  };

  public refresh = async () => {
    // Import refresh token URI from environment variable
    const { NEXT_PUBLIC_REFRESH_TOKEN_URI } = process.env;

    if (!NEXT_PUBLIC_REFRESH_TOKEN_URI)
      throw new Error(
        "“NEXT_PUBLIC_REFRESH_TOKEN_URI” environment variable not provided"
      );

    console.log(`Requesting Refresh Token: ${NEXT_PUBLIC_REFRESH_TOKEN_URI}`);

    return await fetch(NEXT_PUBLIC_REFRESH_TOKEN_URI, {
      method: "POST",
      credentials: "include",
    });
  };
}

export { User };
