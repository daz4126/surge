#  ![SURGE](https://github.com/daz4126/surge/assets/16646/67766106-3fe8-43d4-8404-449124f276de)
[![npm](https://img.shields.io/npm/v/@daz4126/surge?color=222222)](https://www.npmjs.com/package/@daz4126/surge)
[![License](https://img.shields.io/badge/License-Unlicense-222222)](#license)

Surge is a tiny microframework that adds sprinkles of reactivity to your html using `data` attributes. 

It has no dependencies and is unbelievably small (~0.5kb)!

# Hello World

* Add a `data-surge` attribute to the container element that you want to add reactivity to
* Add a `data-action` attribute to the element that performs the action
* Add a `data-reactive-value` attribute to the element that will show the value that changes

```html
<div data-surge>
  <input id="name" type="text">
  <button data-action="greet">Greet</button>
  <div>Hello <span id="output" data-reactive-value="World"></span></div>
</div>
```

* Define the action that was referenced in the `data-action` attribute
* Use `$` to access any elements with an `id`
* Pass it to the `surge` function in the JavaScript:

```javascript
surge({
    greet: $ => e => $.output.value = $.name.value
})
```
That's it!

You can see a live demo [on CodePen](https://codepen.io/daz4126/pen/oNOVVKJ).

Surge was inspired by the excellent [Stimulus](https://stimulus.hotwired.dev) library.

## Reference

```html
<div data-surge>
  <button data-action="greet">Greet</button>
  <div id="output" data-index=0 data-reactive-value="World"</div>
</div>
```

In the example above: 
* `$.output` would return a reference to the element `<div id="output" data-index=0 data-reactive-value="World"</div>`.
* `$.output.index` would return a reference to the value of the `data-index` attribute with an value of `0` and read/write access in any actions.
* `$.output.value` would retuturn a reference to the value of the `data-reactive-value` attribute with a value of `World`. The textContent of the element will automatically update whenever this value is changed in an any actions.

HTML - add data attirbutes
data-surge - goes in the container element that you want to add a surge or reactivity to
data-action - acts like an event listener, specifies the action to run when the element is interacted with
The magic `data-reactive-value` - sets a value for an element that will update the textContent of that element when it changes in actions
data-* sets a value that is namespaced to the element it is defined in and can be accessed in actions
The special $ symbol in actions
Adding parameters

# Examples

### Likes Counter
https://codepen.io/daz4126/pen/oNOVEme

### Character Counter
https://codepen.io/daz4126/pen/XWQONvR

### BMI Calculator
https://codepen.io/daz4126/pen/abxXwQR

### Slideshow
https://codepen.io/daz4126/pen/poBYMoP

### Stopwatch
https://codepen.io/daz4126/pen/mdgoqOQ

### Times Table Quiz
https://codepen.io/daz4126/pen/vYMPdPd

### Fetching Data
https://codepen.io/daz4126/pen/MWRRgLg
