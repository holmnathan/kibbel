import Link from "next/link";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <main className="px-3">
        <h1>Kibbel</h1>

        <p className="lead">
          Calculate calories and create meal plans for cats and dogs
        </p>

        <p className="lead">
          <Link href="/signin">
            <a className="btn btn-lg btn-secondary m-1">Sign In</a>
          </Link>

          <Link href="/signup">
            <a className="btn btn-lg btn-secondary m-1">Create Account</a>
          </Link>
        </p>
      </main>
    </>
  );
};

export default Home;
