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
    console.log("SETSETSETSETSETSETSETSETSET");
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
    console.log(this._token);
    if (!this._token) return true;

    try {
      const { exp } = jwtDecode<JwtPayload>(this._token);
      if (!exp) return false;

      return Date.now() >= exp * 1000;
    } catch {
      return false;
    }
  };

  public refresh = async (): Promise<Response> => {
    console.log("REFRESHREFRESHREFRESHREFRESHREFRESHREFRESH");
    // Import refresh token URI from environment variable
    const { NEXT_PUBLIC_REFRESH_TOKEN_URI } = process.env;
    console.log(NEXT_PUBLIC_REFRESH_TOKEN_URI);

    if (!NEXT_PUBLIC_REFRESH_TOKEN_URI)
      throw new Error(
        "“NEXT_PUBLIC_REFRESH_TOKEN_URI” environment variable not provided"
      );

    const response = await fetch(NEXT_PUBLIC_REFRESH_TOKEN_URI, {
      method: "POST",
      credentials: "include",
    });
    console.log(await response.json());
    const { token } = await response.json();
    console.log("NEWTOKEN!NEWTOKEN!NEWTOKEN!NEWTOKEN!");
    console.log(token);
    console.log("NEWTOKEN!NEWTOKEN!NEWTOKEN!NEWTOKEN!");
    return token;
  };
}

export { AccessToken };
