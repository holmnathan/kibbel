import jwtDecode, { JwtPayload } from "jwt-decode";

class User {
  private _token: string;
  private _idToken: string;
  public isSignedIn: boolean = false;

  public signOut(): void {
    this._token = null;
    this._idToken = null;
    this.isSignedIn = null;
  }

  public get token() {
    return this._token;
  }

  public set token(newToken: string) {
    this._token = newToken;
    this.isSignedIn = true;
  }

  public get idToken() {
    return this._idToken;
  }

  public set idToken(newToken: string) {
    this._idToken = newToken;
  }

  public isTokenValidOrUndefined = (): boolean => {
    // if (!this._token) return true;
    try {
      console.log(this._token);
      const { exp } = jwtDecode<JwtPayload>(this._token);
      return Date.now() >= exp * 1000;
    } catch (exception) {
      console.log("Access Token", exception);
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

    console.log("Refreshing Tokens", NEXT_PUBLIC_REFRESH_TOKEN_URI);

    return await fetch(NEXT_PUBLIC_REFRESH_TOKEN_URI, {
      method: "POST",
      credentials: "include",
    });
  };
}

export { User };
