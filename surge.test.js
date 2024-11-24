/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";
import { expect, jest } from "@jest/globals";
import surge from "./surge";

describe('Surge Library', () => {
  let container;

  // Setup DOM before each test
  beforeEach(() => {
    // Reset localStorage for each test
    localStorage.clear();

    // Setup HTML container for the test
    container = document.createElement('div');
    container.setAttribute('data-surge', '');
    container.innerHTML = `
      <div id="testElement" data-example="42"></div>
      <button id="actionButton" data-action="increment">Increment</button>
      <span id="counter" data-reaction="counter">0</span>
    `;
    document.body.appendChild(container);
  });

  // Cleanup DOM after each test
  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should initialize elements with data attributes', () => {
    // Define actions
    const actions = {
      initialize: $ => {
        expect($.testElement).toBeDefined();
        expect($.testElement.example).toBe(42);
      }
    };
    
    // Call surge
    surge(actions);
  });

  it('should update DOM when reactive properties change', () => {
    const actions = {};
    surge(actions);

    // Access and modify the reactive property
    const testElement = document.getElementById('testElement');
    testElement.example = 100;

    // Check if the element's attribute has updated
    expect(testElement.dataset.example).toBe("100");
  });

  it('should correctly handle actions on elements with data-action', () => {
    // Define actions to increment the counter
    const actions = {
      increment: $ => $.counter.value++
    };
    surge(actions);

    const actionButton = document.getElementById('actionButton');
    const counter = document.getElementById('counter');

    // Simulate button click
    actionButton.click();

    // Verify counter has incremented
    expect(counter.textContent).toBe("1");
  });

  it('should store and retrieve values from localStorage', () => {
    // Set localStorage key in the container
    container.setAttribute('data-local-storage', 'surgeTest');

    const actions = {
      initialize: $ => {
        $.testElement.value = "Persisted Value";
      }
    };
    surge(actions);

    // Retrieve from localStorage
    const storedValue = JSON.parse(localStorage.getItem('surgeTest-testElement'));
    expect(storedValue).toBe("Persisted Value");
  });

  it('should add actions and bindings to dynamically added elements', () => {
    const actions = {
      increment: $ => $.dynamicCounter.value++
    };
    surge(actions);

    // Dynamically add new content
    const newContent = document.createElement('div');
    newContent.innerHTML = `
      <span id="dynamicCounter" data-reaction="counter">0</span>
      <button data-action="increment">+</button>
    `;
    document.body.appendChild(newContent);

    // Simulate button click
    const button = newContent.querySelector('[data-action="increment"]');
    button.click();

    // Verify counter has incremented
    const counter = document.getElementById('dynamicCounter');
    expect(counter.textContent).toBe("1");
  });
});