import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import UserForm from "./UserForm";

test("it shows two inputs and a button", () => {
  // render the component
  render(<UserForm />);

  // Manipulate the component or find an element in it
  const inputs = screen.getAllByRole("textbox");
  const button = screen.getByRole("button");

  // Assetion - make sure the component is doing
  // what we wxpect it to do
  expect(inputs).toHaveLength(2);
  expect(button).toBeInTheDocument();
});

test("it calls onUserAdd when the form is submitted", () => {
  // use mock function as a storage to store the argument
  const mock = jest.fn();
  // NOT THE BEST IMPLEMENTATION
  // const argList = [];
  // const callBack = (...args) => {
  //   argList.push(args);
  // };

  // Try to render my component
  //// pass in the onUserAdd prop, and there is a function that can be called
  // render(<UserForm onUserAdd={() => {}} />);
  // render(<UserForm onUserAdd={callBack} />);
  render(<UserForm onUserAdd={mock} />);
  // Find the two inputs
  // const [nameInput, emailInput] = screen.getAllByRole("textbox");
  const nameInput = screen.getByRole("textbox", { name: /name/i });
  const emailInput = screen.getByRole("textbox", { name: /email/i });
  // Simulate typing in a name

  user.click(nameInput);
  user.keyboard("jane");

  // simulate typing in an email
  user.click(emailInput);
  user.keyboard("jane@jane.com");

  // find the button
  const button = screen.getByRole("button");

  // simulate clicking the button
  user.click(button);

  // user.click(nameInput);
  // user.keyboard("jane2");

  // // simulate typing in an email
  // user.click(emailInput);
  // user.keyboard("jane2@jane.com");

  // // find the button
  // const button2 = screen.getByRole("button");

  // simulate clicking the button
  // user.click(button2);

  // Assertion to make sure 'onUserAdd' get called with email/name
  // expect(argList).toHaveLength(2);
  // console.log(argList);
  // expect(argList[0][0]).toEqual({ name: "jane", email: "jane@jane.com" });
  expect(mock).toHaveBeenCalled();
  expect(mock).toHaveBeenCalledWith({ name: "jane", email: "jane@jane.com" });
});

test("empties the two inputs when form is submitted", () => {
  render(<UserForm onUserAdd={() => {}} />);

  const nameInput = screen.getByRole("textbox", { name: /name/i });
  const emailInput = screen.getByRole("textbox", { name: /email/i });
  const button = screen.getByRole("button");

  user.click(nameInput);
  user.keyboard("jane");
  user.click(emailInput);
  user.keyboard("jane@jane.com");

  user.click(button);

  expect(nameInput).toHaveValue("");
  expect(emailInput).toHaveValue("");
});
