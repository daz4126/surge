function surge(actions={}){
  // The surge object
  const $ = {}
  // any elements that have an id inside the data-surge container  
  Array.from(document.querySelectorAll("[data-surge] [id]")).forEach(el => {
    addToSurge(el)
  })
  // create event listeners based on data-action attributes
  Array.from(document.querySelectorAll("[data-surge] [data-action]")).forEach(element => addAction(element))
  // run the connect action if it exists
  if(actions.connect){
      actions.connect($)
  }
  // Surgify an element to be a prop of the Surge object                    
  function addToSurge(el){
    // Make these DOM methods pick up on any data-attributes attached to dynamically added content
      ["append","prepend","before","after","replace"].forEach(position => {
       const fn = position === "replace" ? el.replaceWith : el[position]
       el[position] = html => {
        const template = document.createElement("template") 
        template.innerHTML = typeof html === "object" ? html.outerHTML : html
        Object.values(template.content.children).forEach(child => {
         fn.call(el,child)
         if(child.id) addToSurge(child)
         if(child.dataset.action) addAction(child)
         Array.from(child.querySelectorAll("[id]")).forEach(el => addToSurge(el))
         Array.from(child.querySelectorAll("[data-action]")).forEach(el => addAction(el))
       })
       }
     })
     // allow values to be get and set on elements
     Object.entries(el.dataset).forEach(([key,value]) => {
      if(key !== "action" && key !== "target"){
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
    // create a reactive value
      // set reactive value text content
      if(el.tagName !== "INPUT"){
        Object.defineProperty(el, "value", {
          get: function() {
              const val = this.dataset.target ? document.getElementById(this.dataset.target).textContent : this.textContent
                try {
                  return JSON.parse(val)
                } catch (e) {
                  return val
                }
          },
          set: function(value) {
              this.dataset.target ? document.getElementById(this.dataset.target).textContent = value :this.textContent = value
          }
      }) // end objectDefineProperty
    }
    // add id references to the surge object
    $[el.id] = el
  }
  // Add any event listeners based on the data-action attributes
  function addAction(element){
    const [event,action] = element.dataset.action.includes("->") ?
          [element.dataset.action.split("->")[0],a.dataset.action.split("->")[1]]
          // default events for certain elements
          : [element.tagName === "FORM" ? "submit" 
              : element.tagName === "INPUT" && element.type !== "submit" || element.tagName === "TEXTAREA" ? "input"
              : element.tagName == "SELECT" ? "change"
              : "click"
              ,element.dataset.action]
        element.addEventListener(event,e => {
          $.e = $.event = e
          $.target = e.target
          actions[action]($)  
        })
  }
}
export default surge