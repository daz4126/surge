function surge(actions = {}) {
  const $ = { element: {} };
  const surgeContainer = document.querySelector("[data-surge]");
  if (!surgeContainer) return;
  const getEvent = el => ({ FORM: "submit", INPUT: "input", TEXTAREA: "input", SELECT: "change" })[el.tagName] || "click";
  const localStorageKey = surgeContainer.dataset.localStorage || null;
surgeContainer.querySelectorAll("[id], [data-action], [data-bind]").forEach(el => {
    if (el.id) initializeElement(el);
    if (el.dataset.action) addAction(el);
    if (el.dataset.bind) bindElement(el);
  });
  // Apply local storage data and initialize elements with IDs
  function initializeElement(el) {
    if (localStorageKey && localStorage.getItem(`${localStorageKey}-${el.id}`)) {
      el.textContent = JSON.parse(localStorage.getItem(`${localStorageKey}-${el.id}`));
    }
    addToSurge(el);
  };
  // Add data bindings
 function bindElement(element){
     element.addEventListener("input",e => $[element.dataset.bind] = parseInput(e.target.value))
  };
  // Run the initialize action if it exists
  if (actions.init) actions.init($);
  // Surgify an element to be a prop of the Surge object
  function addToSurge(el) {
    // Use requestAnimationFrame to batch DOM manipulations
    requestAnimationFrame(() => {
      // Enhance DOM manipulation methods for dynamically added content
      ["append", "prepend", "before", "after", "replaceWith"].forEach(position => {
        const originalFn = el[position].bind(el); // Bind the original method

        el[position] = (html) => {
          const template = document.createElement("template");
          template.innerHTML = typeof html === "object" ? html.outerHTML : html;
          requestAnimationFrame(() => {
            Array.from(template.content.children).forEach(child => {
              originalFn(child);
              processChild(child); // Process newly added elements
            });
          });
        };
      });
      // Set up reactive `value` property for non-input elements
      if (el.tagName !== "INPUT") {
        Object.defineProperty($, el.id, {
          get() {
            const targetEl = document.getElementById(el.dataset.target);
            const val = targetEl ? targetEl.textContent : el.textContent;
            return parseInput(val);
          },
          set(value) {
            const targetEl = document.getElementById(el.dataset.target);
            if (targetEl) targetEl.textContent = value;
            else el.textContent = value;
            if (localStorageKey) {
              localStorage.setItem(`${localStorageKey}-${el.dataset.target || el.id}`, value);
            }
          }
        });
      }
      // Add element reference to the Surge object
      $.element[el.id] = el;
    });   
  }
  // Process newly added elements for event listeners and surge properties
  function processChild(child) {
    if (child.id) addToSurge(child);
    if (child.dataset.action) addAction(child);
    // Handle any nested elements
    child.querySelectorAll("[id]").forEach(addToSurge);
    child.querySelectorAll("[data-action]").forEach(addAction);
  }
  // Add event listener for actions using event delegation
  function addAction(element) {
    const [event, action] = element.dataset.action.includes("->")
      ? element.dataset.action.split("->").map(part => part.trim())
      : [getEvent(element), element.dataset.action];
      const [method, args] = [action.split(',')[0],action.split(',')[1]?.split(",").map(value => parseInput(value))];
    element.addEventListener(event, (e) => {
      if(element.dataset.default == null) e.preventDefault();
      $.target = e.target;
      if (actions[method]) args ? actions[method](...args)($, e) : actions[method]($, e);
    });
  }
  function parseInput(value) {
    try { return JSON.parse(value); } 
    catch { return value; }
  }
}
export default surge