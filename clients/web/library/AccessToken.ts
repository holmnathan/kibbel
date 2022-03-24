import jwtDecode, { JwtPayload } from "jwt-decode";

class AccessToken {
  private _token: string;

  constructor() {
    this._token = "";
  }
  public get token() {
    return this._token;
  }

  public set token(newToken: string) {
    console.log("SETSETSETSETSETSETSETSETSET");
    console.log(newToken);
    this._token = newToken;
  }

  public get header(): JwtPayload | undefined {
    if (this._token)
      return jwtDecode<JwtPayload>(this._token, {
        header: true,
      });
  }

  public get payload(): JwtPayload | undefined {
    if (this._token) return jwtDecode<JwtPayload>(this._token);
  }

  public isTokenValidOrUndefined = (): boolean => {
    console.log("ISVALIDISVALIDISVALIDISVALID");
    console.log(!!this._token);
    // if (!this._token) return true;

    try {
      const { exp } = jwtDecode<JwtPayload>(this._token);
      if (!exp) return false;

      console.log(`Expired ${Date.now() >= exp * 1000}`);
      return Date.now() >= exp * 1000;
    } catch {
      return false;
    }
  };

  public refresh = async () => {
    console.log("REFRESHREFRESHREFRESHREFRESHREFRESHREFRESH");
    // Import refresh token URI from environment variable
    const { NEXT_PUBLIC_REFRESH_TOKEN_URI } = process.env;
    console.log(NEXT_PUBLIC_REFRESH_TOKEN_URI);

    if (!NEXT_PUBLIC_REFRESH_TOKEN_URI)
      throw new Error(
        "“NEXT_PUBLIC_REFRESH_TOKEN_URI” environment variable not provided"
      );

    return await fetch(NEXT_PUBLIC_REFRESH_TOKEN_URI, {
      method: "POST",
      credentials: "include",
    });
  };
}

export { AccessToken };
