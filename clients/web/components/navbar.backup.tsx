import { useQuery } from "@apollo/client";
import Link from "next/link";

const NavBar = () => {
  const { data, loading, error } = useQuery(IsUserAuthenticatedDocument);
  const { isAuthenticated: isUserAuthenticated } = data;
  const unauthorizedLinks = (
    <>
      <Link href="/signin">
        <a>Sign In</a>
      </Link>
      <Link href="/signup">
        <a>Create Account</a>
      </Link>
    </>
  );

  const authorizedLinks = (
    <>
      <Link href="/account">
        <a>Account</a>
      </Link>
      <Link href="/signout">
        <a>Sign Out</a>
      </Link>
    </>
  );
  return (
    <>
      <Link href={isUserAuthenticated ? "/dashboard" : "/"}>
        <a>Home</a>
      </Link>
      <Link href="/test">
        <a>Test</a>
      </Link>
      {isUserAuthenticated ? authorizedLinks : unauthorizedLinks}
    </>
  );
};

export { NavBar };
