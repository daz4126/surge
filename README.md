#  ![SURGE](https://github.com/daz4126/surge/assets/16646/393306bf-9f11-4021-82ee-91e160629cf2)
<div align="center">
[![npm](https://img.shields.io/npm/v/@daz4126/surge?color=222222)](https://www.npmjs.com/package/@daz4126/surge)
[![License](https://img.shields.io/badge/License-Unlicense-222222)](#license)
</div>

Surge is a tiny microframework that adds sprinkles of reactivity to your html using `data` attributes. 

It has no dependencies and is unbelievably small (~0.5kb)!

# Hello World

* Add a `data-surge` attribute to the container element that you want to add reactivity to
* Add a `data-action` attribute to the element that performs the action
* Add a `data-reactive-value` attribute to the element that will show the value that changes

```html
<div data-surge>
  <input id="name" type="text" placeholder="Enter your name">
  <button data-action="greet">Greet</button>
  <h1>Hello <span id="output" data-reactive-value="World"></span></h1>
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

Surge works by adding `data` attributes to your HTML.

Let's look at a simple example to illustrate how it works.

We'll make a little counter app that increases the count when a button is pressed.

```html
<div>
  <button>Increase Count</button>
  <h1></h1>
</div>
```

First, we need to add a `data-surge` attribute to the contianer element to identify that we're using Surge:

```html
<div data-surge>
  <button>Increase Count</button>
  <h1></h1>
</div>
```

Next we need to add a `data-action` attribute to the button. This tells Surge what action to run when the button is pressed. These take the form of `data-action="event->actionName"`:

```html
<div data-surge>
  <button data-action="click->increment">Increase Count</button>
  <h1></h1>
</div>
```

This means that when the button is clicked the action called `increment` will be called.

Buttons have a default even of 'click', so we can omit that and just write the name of the action:

```html
<div data-surge>
  <button data-action="increment">Increase Count</button>
  <h1></h1>
</div>
```

Next we need to associate the value of the count with the `h1` element. To do this we give it an id of "count". Surge uses this to identify the element. We also use the `data-reactive-value` attribute to assign an initial value of `0`:

```html
<div data-surge>
  <button data-action="increment">Increase Count</button>
  <h1 id="count" data-reactive-value=0></h1>
</div>
```

This will mean that the textContent of the `h1` element starts with a value of `0`. It also means that whenever the value of the count changes, the textContent will automatically update and re-render.

Now we just need to define our `increment` action in the JavaScript. Actions are passed to the `surge` function as an object:

```javascript
surge({
    increment: $ => e => $.count.value++
})
```


Inside here, we'll add an h1 element 

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
