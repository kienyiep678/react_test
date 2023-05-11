import { render, screen } from "@testing-library/react";
import { SWRConfig } from "swr";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "../../test/server";
import AuthButton from "./AuthButtons";

async function renderComponent() {
  // useSWR will run the api request, and once the data is returned, useSWR is going to hold on that data, it is going to cache it
  // when we can this hook again, rather than makeing new request, instead the hook will return the data that is previously fetched
  //hence it is going to fetch data one single time when our component is first rendered.
  // when it fetches that data, it is going to cache the response in some central cache
  //hence we will use SWRConfig to reset cache
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButton />
      </MemoryRouter>
    </SWRConfig>
  );

  await screen.findAllByRole("link");
}

// note that if there are two test.only in both describe, the data leaking will occur, which the data returned in the first describe will be leaked and brought into the second describe

// when
describe("when user is signed in", () => {
  createServer([
    {
      // here will return a response, which the useSWR will hold on or cache the response, which the cache response wwill be held onto and eventually used in the next set of test down
      path: "/api/user",
      res: () => {
        console.log("LOGGED IN RESPONSE");
        return { user: { id: 3, email: "kienyiep@gmail.com" } };
      },
    },
  ]);

  // createServer() --->GET '/api/user' ---> {user:{id:3, email: 'kienyiep@gmail.com'}}
  test("sign in and sign out are not visible", async () => {
    // debugger;
    await renderComponent();

    const signInButton = screen.queryByRole("link", {
      name: /sign in/i,
    });
    const signUpButton = screen.queryByRole("link", {
      name: /sign up/i,
    });

    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });
  test("sign out is visible", async () => {
    await renderComponent();

    const signOutButton = screen.getByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).toBeInTheDocument();
    expect(signOutButton).toHaveAttribute("href", "/signout");
  });
});

// describe function let us nest test
describe("when user is not signed in", () => {
  createServer([
    {
      path: "/api/user",
      res: () => {
        console.log("NOT LOGGED IN RESPONSE");
        return { user: null };
      },
    },
  ]);

  test("sign in and sign up are visible", async () => {
    // debugger;
    await renderComponent();

    const signInButton = screen.getByRole("link", { name: /sign in/i });
    const signUpButton = screen.getByRole("link", { name: /sign up/i });

    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/signin");
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/signup");
  });
  test("sign out is not visible", async () => {
    await renderComponent();
    // ifwe are not able to find an element using get by, then an error will be thrown which will fail our test
    // hence if we want to assert that an element is not present, we will use queryByRole
    // query by role will return null if we cannot find an element
    const signOutButton = screen.queryByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).not.toBeInTheDocument();
    // await screen.findAllByRole("link");
  });
});
// createServer() ---> GET '/api/user' ---> {user:nul}
// jest will run this server first before run the test

// jest will run this server first before run the test

// describe.only("when user is signed in", () => {
// describe("when user is signed in", () => {
//   createServer([
//     {
//       path: "/api/user",
//       res: () => {
//         return { user: { id: 3, email: "kienyiep@gmail.com" } };
//       },
//     },
//   ]);

//   // createServer() --->GET '/api/user' ---> {user:{id:3, email: 'kienyiep@gmail.com'}}
//   test.only("sign in and sign out are not visible", async () => {
//     debugger;
//     await renderComponent();

//     const signInButton = screen.queryByRole("link", {
//       name: /sign in/i,
//     });
//     const signUpButton = screen.queryByRole("link", {
//       name: /sign up/i,
//     });

//     expect(signInButton).not.toBeInTheDocument();
//     expect(signUpButton).not.toBeInTheDocument();
//   });
//   test("sign out is visible", async () => {
//     renderComponent();

//     const signOutButton = screen.getByRole("link", {
//       name: /sign out/i,
//     });
//     expect(signOutButton).toBeInTheDocument();
//     expect(signOutButton).toBeInTheDocument("href", "/signout ");
//   });
// });

//
