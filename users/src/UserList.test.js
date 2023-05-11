import { render, screen, within } from "@testing-library/react";
import UserList from "./UserList";

function renderComponent() {
  const users = [
    { name: "jane", email: "jane@jane.com" },
    { name: "sam", email: "sam@sam.com" },
  ];
  // container is a reference to the html element, that is automatically added into our component
  render(<UserList users={users} />);
  return {
    users,
  };
}
// jest will run this beforeEach function before running the test
// beforeEach(() => {
//   render(<UserList users={users} />);
// });
test("render one row per user", () => {
  // Render the component
  renderComponent();
  // const users = [
  //   { name: "jane", email: "jane@jane.com" },
  //   { name: "sam", email: "sam@sam.com" },
  // ];
  // container is a reference to the html element, that is automatically added into our component
  // render(<UserList users={users} />);
  // eslint-disable-next-line
  // const { container } = render(<UserList users={users} />);
  // Find all the rows in the table
  const rows = within(screen.getByTestId("users")).getAllByRole("row");
  // eslint-disable-next-line
  // const rows = container.querySelectorAll("tbody tr");
  // const rows = screen.getAllByRole("row");
  // screen.logTestingPlaygroundURL();
  // Assertion: correct number of rows in the table
  expect(rows).toHaveLength(2);
});

test("render the email and name of each user", () => {
  const users = [
    { name: "jane", email: "jane@jane.com" },
    { name: "sam", email: "sam@sam.com" },
  ];
  render(<UserList users={users} />);
  // screen.logTestingPlaygroundURL();
  for (let user of users) {
    const name = screen.getByRole("cell", { name: user.name });
    const email = screen.getByRole("cell", { name: user.email });

    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  }
});
