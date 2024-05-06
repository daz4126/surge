function surge(actions={}){
  // any elements that have a data-action attribute
  const actionElements = [...document.querySelectorAll("[data-surge] [data-action]")]  
  // any elements that have an id inside the data-surge container  
  const elements = [...document.querySelectorAll("[data-surge] [id]")].reduce((obj,el) => {
    // add methods for elements to append html 
    el.add = html => {
       const template = document.createElement("template")
       template.innerHTML = html
       Object.values(template.content.children).forEach(child => el.appendChild(child))
       const {connect,...rest} = actions
       // run surge again to pick up any new data attributes
       surge(rest)
     }
     // allow values to be get and set on elements
     Object.entries(el.dataset).forEach(([key,value]) => {
      if(key !== "action" && key !== "reactiveValue"){
        Object.defineProperty(el, key, {
              configurable: true,
              get: function() { 
                const val = el.dataset[key]
                try {
                  return JSON.parse(val)
                } catch (e) {
                  return val
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
        }) // end Object.defineProperty
      } // end if
    }) // end Object.entries.forEach
    // create a reactive value if it has been set with data-reactive-value
      if(el.dataset.reactiveValue !== undefined) {
        // set reactive value text content
        el.textContent = el.dataset.reactiveValue
        Object.defineProperty(el, "value", {
          get: function() { 
          const val = this.dataset.reactiveValue
          try {
                  return JSON.parse(val)
              } catch (e) {
                  return val
              }
          },
          set: function(value) {
          try {
                  JSON.parse(value)
                  this.setAttribute("data-reactive-value",JSON.stringify(value))
              } catch (e) {
                  this.setAttribute("data-reactive-value",value)
              }
              this.textContent = value
          }
      }) // end objectDefineProperty
    } // end if
      
    // add id references to the surge object
    return {...obj,[el.id]: el}
  },{}) // end of reduce
  
  // run the connect action if it exists
  if(actions.connect){
      actions.connect(elements)
  }

  // create event listeners based on data-action attributes
  actionElements.forEach(a => {
      const [event,action] = a.dataset.action.includes("->") ?
          [a.dataset.action.split("->")[0],a.dataset.action.split("->")[1]]
          // default events for certain elements
          : [a.tagName === "FORM" ? "submit" 
              : a.tagName === "INPUT" && a.type !== "submit" || a.tagName === "TEXTAREA" ? "input"
              : a.tagName == "SELECT" ? "change"
              : "click"
              ,a.dataset.action]
      if(!a.event){ // check if the event already exists
        a.addEventListener(event,actions[action](elements))
        a.event = actions[action] // add the event as a property of the element
      }
  })
}
export default surge