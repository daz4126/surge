function surge(actions={}){
    const actionElements = [...document.querySelectorAll("[data-surge] [data-action]")]    
    const elements = [...document.querySelectorAll("[data-surge] [id]")].reduce((obj,el) => {
       Object.entries(el.dataset).forEach(([key,value]) => {
        if(key !== "action" && key !== "reactiveValue"){
          Object.defineProperty(el, key, {
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
      // add reactive value
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
        
      // add id references
      return {...obj,[el.id]: el}
    },{}) // end of reduce
    
        
    if(actions.connect){
        actions.connect(elements)
    }
    actionElements.forEach(a => {
        const [event,action] = a.dataset.action.includes("->") ?
            [a.dataset.action.split("->")[0],a.dataset.action.split("->")[1]]
            : [a.tagName === "FORM" ? "submit" 
                : a.tagName === "INPUT" && a.type !== "submit" || a.tagName === "TEXTAREA" ? "input"
                : a.tagName == "SELECT" ? "change"
                : "click"
                ,a.dataset.action]
        a.addEventListener(event,actions[action](elements)
    })
}
export default surge