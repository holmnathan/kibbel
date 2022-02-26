import Link from "next/link";
const NavBar = () => {
  return (
    <>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/signin">
        <a>Sign In</a>
      </Link>
      <Link href="/signup">
        <a>Create Account</a>
      </Link>
    </>
  );
};

export { NavBar };
