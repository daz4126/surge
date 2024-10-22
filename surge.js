function surge(actions = {}) {
  // Initialize the surge object
  const $ = {};

  // Cache DOM queries
  const surgeContainer = document.querySelector("[data-surge]");
  if (!surgeContainer) return;

  const localStorageKey = surgeContainer.dataset.localStorage || null;

  // Cache all elements with ID and/or data-action
  const elementsWithId = surgeContainer.querySelectorAll("[id]");
  const elementsWithAction = surgeContainer.querySelectorAll("[data-action]");

  // Apply local storage data and initialize elements with IDs
  elementsWithId.forEach(el => {
    if (localStorageKey && localStorage.getItem(`${localStorageKey}-${el.id}`)) {
      el.textContent = JSON.parse(localStorage.getItem(`${localStorageKey}-${el.id}`));
    }
    addToSurge(el);
  });

  // Initialize elements with actions
  elementsWithAction.forEach(el => addAction(el));

  // Run the initialize action if it exists
  if (actions.initialize) actions.initialize($);

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

      // Create reactive data binding for element
      Object.entries(el.dataset).forEach(([key, value]) => {
        if (key !== "action" && key !== "target") {
          Object.defineProperty(el, key, {
            configurable: true,
            get() {
              const val = el.dataset[key];
              try {
                return JSON.parse(val);
              } catch {
                return val;
              }
            },
            set: function(value) {
              try {
                JSON.parse(value)
                el.setAttribute("data-"+key,JSON.stringify(value))
              } catch (e) {
                 el.setAttribute("data-"+key,value)
              }
            }
          });
        }
      });

      // Set up reactive `value` property for non-input elements
      if (el.tagName !== "INPUT") {
        Object.defineProperty(el, "value", {
          get() {
            const targetEl = document.getElementById(el.dataset.target);
            const val = targetEl ? targetEl.textContent : el.textContent;
            try {
              return JSON.parse(val);
            } catch {
              return val;
            }
          },
          set(value) {
            const targetEl = document.getElementById(el.dataset.target);
            if (targetEl) targetEl.textContent = value;
            else el.textContent = value;

            if (localStorageKey && !targetEl.dataset.noLocalStorage) {
              localStorage.setItem(`${localStorageKey}-${el.dataset.target || el.id}`, value);
            }
          }
        });
      }

      // Add element reference to the Surge object
      $[el.id] = el;
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
      : [getDefaultEvent(element), element.dataset.action];

    element.addEventListener(event, (e) => {
      $.preventDefault = e.preventDefault;
      $.target = e.target;
      if (actions[action]) actions[action]($, e);
    });
  }

  // Determine default event for element if not explicitly specified
  const getDefaultEvent = element =>
    element.tagName === "FORM" ? "submit"
    : element.tagName === "INPUT" && element.type !== "submit" ? "input"
    : element.tagName === "TEXTAREA" ? "input"
    : element.tagName === "SELECT" ? "change"
    : "click"
}
export default surge