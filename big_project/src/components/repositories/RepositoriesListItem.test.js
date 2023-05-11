import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RepositoriesListItem from "./RepositoriesListItem";

// this means dont actually go to import the real FileIcon file
// jest.mock("../tree/FileIcon", () => {
//   // Content of FileIcon.js
//   // Instead anyone who try to import, just give them the code displayed below.
//   return () => {
//     return "File Icon Component";
//   };
// });

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "A js library",
    owner: { login: "facebook" },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    //react router dom does not undewrstand that it is executed in the test
    // link component is only work correctly if there is react router context available to it
    // hence we need to create something called router, which expose a context object to all the children component inside the app
    // whenever we use component from react router dom such as link, that component will reach up and find the context object
    // create the router context, which the link an element of the react-router dom require to reach out, which can prevent the error
    // memoryrouter will store current URL in memory
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );
  return { repository };
}
test("shows a link to the github homepage for this repository", async () => {
  const { repository } = renderComponent();

  // this will open the act window that is going to last for 100 miliseconds.
  // await act(async () => {
  //   await pause();
  // });
  // the goal is to allow me to take a look at the output of my component and see what is the difference before finishing that file icon data fetching request and what it looks like afterwards
  // screen.debug();
  // await pause();
  // screen.debug();
  await screen.findByRole("img", { name: "Javascript" });
  // const link = screen.getByRole("link", { name: /facebook/i });
  // expect(link).toHaveAttribute("href", "/repositories/facebook/react");
  const link = screen.getByRole("link", { name: /github repository/i });
  expect(link).toHaveAttribute("href", repository.html_url);
});

const pause = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

test("shows a fileicon with the appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", { name: "Javascript" });

  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { repository } = renderComponent();

  await screen.findByRole("img", { name: "Javascript" });
  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });
  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});

// normally the first state update, and it will fetch the data, before the data is finished passed, the test will fail, and then after that the data will be fetched sucessfully, update the second state and the user will be visible on the screen, which is not what we want.
// hence we use act function: (test written without RTL, RTL will automatically uses acts behind the scene for you.)
// tell our test that we expect state to be changed
// react will process all state updates + useEffect before exiting the act
