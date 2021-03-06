import userReactiveVariable from "@kibbel/library/apollo/user";
import Link from "next/link";

const NavBar = () => {
  const user = userReactiveVariable();

  const unauthenticatedLinks = (
    <>
      <Link href="/signin">
        <a>Sign In</a>
      </Link>
      <Link href="/signup">
        <a>Create Account</a>
      </Link>
    </>
  );

  const authenticatedLinks = (
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
      <Link href={"/"}>
        <a>Home</a>
      </Link>
      <Link href="/test">
        <a>Test</a>
      </Link>
      <Link href="/dashboard">
        <a>Dashboard</a>
      </Link>
      {!user ? unauthenticatedLinks : authenticatedLinks}
    </>
  );
};

export { NavBar };
