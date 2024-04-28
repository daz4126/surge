#  ![SURGE](https://github.com/daz4126/surge/assets/16646/393306bf-9f11-4021-82ee-91e160629cf2)
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
Surge actions look slightly strange at first, but they always have the same parameters - the *surge object*, `$`, and the event object, `e`. The event object is exactly the same as any event listener, but the surge object has some extra methods that can be used to access and update the elements.

The surge object can access any element with an id, by referencing the id as a propety. So in the example above `$.count` refers to the element with an id of "count" (the `h1` element).

Any element references also have access to any values set using `data` attributes. Any reactive values can be accessed using the `value` property. So in the example abvove `$.count.value` has an initial value of `0`. This value can then be updated just like any othe variable, so using the increment operator, `++`, will increase its value by 1. Because it was marked as a reactive-value, any changes will automatically update the HTML with the new value, so every time the button is pressed, the next number will be displayed.

As well as `data-reactive-value`, other values can be set using the `data` attribute. These values will be name-spaced ot the element they are set on and can be accessed by the surge object (as long as they element they are set on is given an id).

This is useful if you want to set a parameter for actions in the HTML. For example, let's add another button that increases the count by a value set in the HTML:

```html
<div data-surge>
  <button id="btn1" data-action="increment">Increase by 1</button>
  <button id="btn2" data-action="increment" data-amount=2>Increase by 2</button>
  <h1 id="count" data-reactive-value=0></h1>
</div>
```

Our new button has an id of "btn2" and a `data-amount` attribute set to 2. This is accessible in actions using `$.btn2.amount`. Notice that we don't need a different action, we just use the `increment` action again. We need to also add an id of "btn1" to our original button and then just need to update it to take account of the amount:

```javascript
surge({
    increment: $ => e => $.count.value += $[e.target.id].amount || 1
})
```

This uses the event object's `target` property to find the id of the element that was clicked on. We then use the surge object to access the `amount` value. If this isn't set, we default to a value of 1.

This example can be seen [on CodePen](https://codepen.io/daz4126/pen/dyLLpwy).

There's also a special `initialize` action that will run after the HTML loads. This is useful for any setup you need to do.

Have a look at the examples below to see how Surge can be used to create a variet of interactive HTML.

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
