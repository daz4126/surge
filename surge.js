function surge(actions = {}) {
    const $ = {};
    const surgeContainer = document.querySelector("[data-surge]");
    if (!surgeContainer) return;
    const localStorageKey = surgeContainer.dataset.localStorage || null;
  
    // Process all elements
    surgeContainer.querySelectorAll("[data-surge] [data-element],[data-surge] [data-value],[data-surge] [data-action],[data-surge] [data-bind]").forEach(processElement);
  
    // Initialize calcs
    const calcs = initializeCalcs();
    // Call the initialize action if it exists
    if (actions.init) actions.init($);
  
    // Process a single element
    function processElement(el) {
      if (el.dataset.value) initializeElement(el);
      if (el.dataset.element) addToSurge(el);
      if (el.dataset.action) bindAction(el);
      if (el.dataset.bind) bindBinding(el);
    }
  
    function initializeElement(el) {
      if (localStorageKey) {
        const storedValue = localStorage.getItem(`${localStorageKey}-${el.dataset.value}`);
        if (storedValue) el.textContent = JSON.parse(storedValue);
      }
      createReactiveBinding(el);
    }
  
    function addToSurge(el) {
      $[el.dataset.element] = el;
      Object.keys(el.dataset).forEach(key => {
        Object.defineProperty($[el.dataset.element], key, {
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
      const prop = el.dataset.value;
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
      document.querySelectorAll("[data-surge] [data-calculate],[data-surge][data-calculate]").forEach(el => {
        const calcs = el.dataset.calculate.split(",");
        const val = el.dataset.value;  
        calcs.forEach(calc =>{
          const func = actions[calc];
          const existingCalc = calculations.find(c => c.func === func);
          if (existingCalc) {
            existingCalc.values.push(val);
          } else {
            calculations.push({ func, values: [val] });
          }
        })    
      });
      return calculations;
    }
  
    function updateCalculations(value) {
      calcs.filter(calc => calc.values.includes(value)  || calc.values.includes(undefined)).forEach(calc => calc.func($));
    }
  }
  
  function getEvent(el) {
    return ({ FORM: "submit", INPUT: "input", TEXTAREA: "input", SELECT: "change" }[el.tagName] || "click");
  }
  
  function parseAction(action) {
    const match = action.match(/^(\w+)\((.*)\)$/);
    const method = match ? match[1].trim() : action;
    const args = match ? match[2] ? match[2].split(",").map(arg => parseInput(arg.trim())) : [undefined] : null;
    return [method, args];
  }
  
  function parseInput(value) {
    try { return JSON.parse(value);} 
    catch { return value;}
  }
export default surge