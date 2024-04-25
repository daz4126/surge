function surge(actions={}){
    const actionElements = [...document.querySelectorAll("[data-surge] [data-action]")]
    const elements = [...document.querySelectorAll("[data-surge] [id]")].reduce((obj,el) => {
        Object.entries(el.dataset).forEach(([key,value]) => {
          Object.defineProperty(el, key, {
            get: function() { 
            const val = this.dataset[key]
            try {
                    return JSON.parse(val)
                } catch (e) {
                    return val
                }
            },
            set: function(value) {
            try {
                    JSON.parse(value)
                    this.setAttribute("data-"+key,JSON.stringify(value))
                } catch (e) {
                    this.setAttribute("data-"+key,value)
                }
            if(this.dataset.reactive !== undefined && key === "value"){
                this.textContent = value
            }
        }
        })
        if(el.dataset.reactive !== undefined){
            el.textContent = el.value
        }
     })
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