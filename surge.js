function surge(actions = {}) {
  const $ = {};
  const surgeContainer = document.querySelector("[data-surge]");
  if (!surgeContainer) return;
  const localStorageKey = surgeContainer.dataset.localStorage || null;

  // Process all elements
  surgeContainer.querySelectorAll("[id], [data-reaction], [data-action], [data-bind]").forEach(processElement);

  // Initialize calcs
  const calcs = initializeCalcs();
  // Call the initialize action if it exists
  if (actions.init) actions.init($);

  // Process a single element
  function processElement(el) {
    if (el.dataset.reaction) createReactiveBinding(el);
    if (el.id) initializeElement(el);
    if (el.dataset.action) bindAction(el);
    if (el.dataset.bind) bindBinding(el);
  }

  function initializeElement(el) {
    if (localStorageKey) {
      const storedValue = localStorage.getItem(`${localStorageKey}-${el.id}`);
      if (storedValue) el.textContent = JSON.parse(storedValue);
    }
    addToSurge(el);
  }

  function addToSurge(el) {
    $[el.id] = el;
    Object.keys(el.dataset).forEach(key => {
      Object.defineProperty($[el.id], key, {
        get: () => parseInput(el.dataset[key]),
        set: value => (el.dataset[key] = value),
      });
    });
    enhanceDomManipulation(el);
}

function enhanceDomManipulation(el) {
  ["append", "prepend", "before", "after", "replaceWith"].forEach(method => {
    const originalFn = el[method].bind(el);
    el[method] = html => {
      const template = document.createElement("template");
      template.innerHTML = typeof html === "object" ? html.outerHTML : html;
    Array.from(template.content.children).forEach(child => {
      originalFn(child);
      processElement(child);
      child.querySelectorAll("[id], [data-reaction], [data-action], [data-bind]").forEach(processElement);
      });
    };
  });
}

  function createReactiveBinding(el) {
    const prop = el.dataset.reaction;
    if (!prop) return;
    // Define a reactive property
    Object.defineProperty($, prop, {
      get() { return parseInput(el.textContent); },
      set(value) {
        el.textContent = value;
        updateCalculations(prop);
        if (localStorageKey) {
          localStorage.setItem(`${localStorageKey}-${prop}`, JSON.stringify(value));
        }
      }
    });
  }

  function bindBinding(el) {
    const bindKey = el.dataset.bind;
    if (!bindKey) return;
    el.addEventListener("input", e => {
      $[bindKey] = parseInput(e.target.value);
    });
  }

  function bindAction(el) {
    const [event, action] = el.dataset.action.includes("->")
      ? el.dataset.action.split("->").map(part => part.trim())
      : [getEvent(el), el.dataset.action];
    const [method, args] = parseAction(action);
    el.addEventListener(event, (e) => {
      if(el.dataset.default == null) e.preventDefault();
      $.target = e.target;
      if (actions[method]) args.length ? actions[method](...args)($, e) : actions[method]($, e);
    });
  }

  function initializeCalcs() {
    const calculations = [];
    document.querySelectorAll("[data-calculate]").forEach(el => {
      const calcs = el.dataset.calculate.split(",");
      const reaction = el.dataset.reaction;  
      calcs.forEach(calc =>{
        const func = actions[calc];
        const existingCalc = calculations.find(c => c.func === func);
        if (existingCalc) {
          existingCalc.reactions.push(reaction);
        } else {
          calculations.push({ func, reactions: [reaction] });
        }
      })    
    });
    return calculations;
  }

  function updateCalculations(reaction) {
    calcs.filter(calc => calc.reactions.includes(reaction)  || calc.reactions.includes(undefined)).forEach(calc => calc.func($));
  }

  function getEvent(el) {
    return ({ FORM: "submit", INPUT: "input", TEXTAREA: "input", SELECT: "change" }[el.tagName] || "click");
  }
  
  function parseAction(action) {
    const [method, rawArgs] = action.split(",", 2);
    const args = rawArgs ? rawArgs.split(",").map(parseInput) : [];
    return [method.trim(), args];
  }
  
  function parseInput(value) {
    try { return JSON.parse(value);} 
    catch { return value;}
  }
}
export default surge