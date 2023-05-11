import { render, screen, act } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import HomeRoute from "./HomeRoute";
import { createServer } from "../test/server";

// GOAL:

createServer([
  {
    path: "/api/repositories",
    method: "get",
    res: (req, res, ctx) => {
      console.log("search params111: ", req.url.searchParams.get("q"));
      const language = req.url.searchParams.get("q").split("language:")[1];
      const language2 = req.url.searchParams.get("q").split("language:");
      console.log("language2", language2);
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
  // {
  //   path: "/api/repositories",
  //   method: "post",
  //   res: (req, res, ctx) => {
  //     return {
  //       items: [{}, {}, {}],
  //     };
  //   },
  // },
]);

//

// const handlers = [
//   // use msw library to mock axios (fetch)- get axios to return fake data
//   // msw library will intercept the request, and dont send the request to the outside api, it will grab the request and then automatically respond to it.so no request will leave the test environemnt
//   rest.get("/api/repositories", (req, res, ctx) => {
//     const language = req.url.searchParams.get("q").split("language:")[1];
//     console.log(language);

//     return res(
//       ctx.json({
//         items: [
//           { id: 1, full_name: `${language}_one` },
//           { id: 2, full_name: `${language}_two` },
//         ],
//       })
//     );
//   }),
// ];
// const server = setupServer(...handlers);
// // the function will be executed one time before all the tests inside of this file
// beforeAll(() => {
//   // before we run any of our test, start the server up and start listening for incoming request
//   server.listen();
// });
// // the code will be run after each test is executed inside this file, whther pass or fail
// afterEach(() => {
//   // tell the server to reset each of these handlers to their initial default state.
//   server.resetHandlers();
// });
// // after all will be run after all the test is executed inside this file.
// afterAll(() => {
//   // after we execute all the test, we want to stop running our server, just shut it down
//   server.close();
// });

test("renders two link for each language", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );
  screen.debug();
  // await pause();
  await act(async () => {
    await pause();
  });
  // need to wait for the msw to respond by using find by queries
  screen.debug();
  // loop over each language
  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  for (let language of languages) {
    // for each language, make sure we see two links
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
    // assert that the links have the appropriate full name
  }
});

const pause = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
