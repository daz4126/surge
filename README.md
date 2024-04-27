#  ![SURGE](https://github.com/daz4126/surge/assets/16646/125e908c-5bcc-4819-ac27-17cff98770ba)
[![npm](https://img.shields.io/npm/v/@daz4126/surge?color=222222)](https://www.npmjs.com/package/@daz4126/surge)
[![License](https://img.shields.io/badge/License-Unlicense-222222)](#license)

Surge is a tiny microframework that adds sprinkles of reactivity to your html using `data` attributes. 

It has no dependencies and is unbelievably small (~0.5kb)!

# Hello World

* Add a `data-surge` attribute to the container element that you want to add reactivity to
* Add a `data-action` attribute to the element that performs the action
* Add a `data-reactive-value` attribute to the element that will show the value that changes:

```html
<div data-surge>
  <input id="name" type="text">
  <button data-action="greet">Greet</button>
  <div>Hello <span id="output" data-reactive-value="World"></span></div>
</div>
```

Then pass your actions to the `surge` function in the JavaScript:

```javascript
surge({
    greet: $ => e => $.output.value = $.name.value
})
```
That's it!

You can see a live demo [on CodePen](https://codepen.io/daz4126/pen/oNOVVKJ).

Surge was inspired by the excellent [Stimulus](https://stimulus.hotwired.dev) library.

## Docs

HTML - add data attirbutes
data-surge - goes in the container element that you want to add a surge or reactivity to
data-action - acts like an event listener, specifies the action to run when the element is interacted with
The magic `data-reactive-value` - sets a value for an element that will update the textContent of that element when it changes in actions
data-* sets a value that is namespaced to the element it is defined in and can be accessed in actions
The special $ symbol in actions
Adding parameters

## Examples

### Likes Counter
https://codepen.io/daz4126/pen/oNOVEme

### Character Counter
https://codepen.io/daz4126/pen/XWQONvR

### BMI Calculator

### Slideshow
https://codepen.io/daz4126/pen/poBYMoP

### Stopwatch
https://codepen.io/daz4126/pen/mdgoqOQ

### Times Table Quiz

### Fetching JSON
