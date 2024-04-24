function surge(actions={}){
    const actionElements = [...document.querySelectorAll("[data-surge] [data-action]")]
    const elements = [...document.querySelectorAll("[data-surge] [id]")].reduce((obj,el) => {
        if(el.dataset.value || el.dataset.value === "" || el.dataset.reactiveValue || el.dataset.reactiveValue === ""){
          Object.defineProperty(el, "value", {
              get: function() { 
              const val = this.dataset.value || this.dataset.reactiveValue
                try {
                      return JSON.parse(val)
                    } catch (e) {
                      return val
                    }
              },
              set: function(value) {
                try {
                      JSON.parse(this.dataset.value) || JSON.parse(this.dataset.reactiveValue)
                      this.setAttribute(this.dataset.value ? "data-value" : "data-reactive-value",JSON.stringify(value))
                    } catch (e) {
                      this.setAttribute(this.dataset.value ? "data-value" : "data-reactive-value",value)
                    }
                if(this.dataset.reactiveValue){
                  this.textContent = value
                }
            }
          })
          if(el.dataset.reactiveValue){
            el.textContent = el.value
          }
        }
        return {...obj,[el.id]: el}
      },{})
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
        a.addEventListener(event,actions[action](elements))
      })
  }
  export default surge