import { JSDOM } from "jsdom";
import { expect, jest } from "@jest/globals";
import surge from "./surge"

// Mock HTML structure for testing
const html = `
  <div data-surge>
    <div id="testElement" data-test="testValue" data-action="testAction"></div>
    <input id="inputElement" type="text" data-action="inputAction" />
    <form id="formElement" data-action="formAction"></form>
  </div>
`;

describe('surge function', () => {
  let document;
  let actions;

  beforeEach(() => {
    // Setup jsdom
    const dom = new JSDOM(html);
    document = dom.window.document;
    console.log("dom: ", dom)
    console.log("document: ", document)

    // Define actions
    actions = {
      testAction: jest.fn($ => $.testElement.value = 29),
      inputAction: jest.fn(),
      formAction: jest.fn(),
      connect: jest.fn(),
    };

    // Execute the surge function
    surge(actions);
  });

  test('should add elements with id to the $ object', () => {
    expect(actions.connect).toHaveBeenCalled();
    const $ = actions.connect.mock.calls[0][0];
    console.log($)
    expect($['testElement']).toBeDefined();
    expect($['inputElement']).toBeDefined();
    expect($['formElement']).toBeDefined();
  });

  test('should call action functions on event trigger', () => {
    document.getElementById('testElement').click();
    expect(actions.testAction).toHaveBeenCalled();

    const inputElement = document.getElementById('inputElement');
    inputElement.value = "new value";
    inputElement.dispatchEvent(new Event('input'));
    expect(actions.inputAction).toHaveBeenCalled();

    const formElement = document.getElementById('formElement');
    formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    expect(actions.formAction).toHaveBeenCalled();
  });

  test('should allow setting and getting data attributes as properties', () => {
    const el = document.getElementById('testElement');
    expect(el.test).toBe('testValue');
    el.test = 'newValue';
    expect(el.getAttribute('data-test')).toBe('newValue');
  });

  test('should allow setting and getting reactive value property', () => {
    const el = document.getElementById('testElement');
    el.value = 'new content';
    expect(el.textContent).toBe('new content');
    expect(el.value).toBe('new content');
  });
});
