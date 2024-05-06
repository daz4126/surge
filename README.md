#  ![SURGE](https://github.com/daz4126/surge/assets/16646/19ac4c7e-6b0d-4636-9660-2a5990af8ae8)
[![npm](https://img.shields.io/npm/v/@daz4126/surge?color=222222)](https://www.npmjs.com/package/@daz4126/surge)
[![License](https://img.shields.io/badge/License-Unlicense-222222)](#license)

Surge is a tiny microframework that adds sprinkles of reactivity to your html using `data` attributes. 

It has no dependencies and is unbelievably small (~0.5kb)!

# Quick Start - Hello World

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

![Screenshot 2024-04-28 at 15 02 33](https://github.com/daz4126/surge/assets/16646/b3670a9b-9df4-49ce-894a-03a0f16bd8a3)

You can see a live demo [on CodePen](https://codepen.io/daz4126/pen/oNOVVKJ).

Surge was inspired by the excellent [Stimulus](https://stimulus.hotwired.dev) library.

# Reference

## Installation

Either use npm or yarn to install:

```
npm install @daz4126/surge
```

Then import the `surge` function in your JavaScript file:

```
import surge from "@daz4126/surge"
```

Alternatively you can just import from a CDN:

```
import surge from "https://esm.sh/@daz4126/surge"
```

## Usage

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

Buttons have a default event of 'click', so we can omit that and just write the name of the action:

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

There's also a special `connect` action that will run after the HTML loads and the surge function connects to it. This is useful for any setup code that needs running.

Have a look at the examples below to see how Surge can be used to create a variet of interactive HTML.

# Examples

### Likes Counter

![Screenshot 2024-04-28 at 14 48 59](https://github.com/daz4126/surge/assets/16646/f71be43e-2ff2-4fff-92b9-b0ee708f715b)

#### HTML:
```html
<main data-surge>
  <h1>❤️ <span id="count" data-reactive-value=0></span></h1>
  <button data-action="increment">👍</button>
  <button data-action="decrement">👎</button>
</main>
```

#### JavaScript:
```javascript
surge({
  increment: $ => e => $.count.value++,
  decrement: $ => e => $.count.value--
})
```

[See the code on CodePen](https://codepen.io/daz4126/pen/oNOVEme)

### Character Counter

![Screenshot 2024-04-28 at 14 58 18](https://github.com/daz4126/surge/assets/16646/d823896d-a60f-486a-a689-5df7eac3137a)

#### HTML:
```html
<main data-surge>
  <textarea data-action="count"></textarea>
  <p>
    There are
    <strong id="count" data-reactive-value=0></strong> characters in this textarea.
  </p>
</main>
```

#### JavaScript:
```javascript
surge({
  count: $ => e => {
    console.log($.count)
    $.count.value = e.target.value.length
  }
})
```

[See the code on CodePen](https://codepen.io/daz4126/pen/XWQONvR)

### BMI Calculator

![Screenshot 2024-04-28 at 15 00 06](https://github.com/daz4126/surge/assets/16646/98018fa8-a44c-4feb-8703-01b74ff71489)

#### HTML:
```html
<main data-surge>
  <h2>BMI Calculator</h2>
  <h2>BMI: <span id="bmi" data-reactive-value=48></span></h2>
  <label>Weight:</label>
  <input type="range" min=0 max=150 data-action="update" data-target="weight" value=45>
  <h2 id="weight" data-reactive-value=75></h2>
  <label>Height:</label>
  <input type="range" min=0 max=250 data-action="update" data-target="height" value=150>
  <h2 id="height" data-reactive-value=125></h2>
</main>
```

#### JavaScript:
```javascript
surge({
  update: $ => e => {
    $[e.target.dataset.target].value = e.target.value
    $.bmi.value = ($.weight.value / ($.height.value/100)**2).toFixed(1)
  }
})
```

[See the code on CodePen](https://codepen.io/daz4126/pen/abxXwQR)

### Slideshow

![Screenshot 2024-04-28 at 14 52 42](https://github.com/daz4126/surge/assets/16646/f7fdd28e-0232-487f-9439-28ddb873fd63)


#### HTML:
```html
<main data-surge>
  <button data-action="previous"> ← </button>
  <button data-action="next"> → </button>
  <div id="slides" data-index=0>
    <div>🐵</div>
    <div hidden>🙈</div>
    <div hidden>🙉</div>
    <div hidden>🙊</div>
  </div>
</main>
```

#### JavaScript:
```javascript
const showCurrentSlide = (slides,i) =>  [...slides].forEach((element, j) => element.hidden = j !== i)

surge({
  next: $ => e => {
    $.slides.index = ($.slides.index + 1)%4
    showCurrentSlide($.slides.children,$.slides.index)
  },
  previous: $ => e => {
    $.slides.index = (($.slides.index - 1)%4+4)%4
    showCurrentSlide($.slides.children,$.slides.index)
  }
})
```

[See the code on CodePen](https://codepen.io/daz4126/pen/poBYMoP)

### Stopwatch

![Screenshot 2024-04-28 at 14 54 10](https://github.com/daz4126/surge/assets/16646/0c4cca8f-cfa4-49ca-bd7a-5730ace9e8ec)


#### HTML:
```html
<main data-surge>
  <h1 id="time" data-reactive-value="0.00">0:00</h1>
  <button id="toggleBtn" data-reactive-value="Start" data-action="toggle">Start</button>
  <button data-action="reset">Reset</button>
</main>
```

#### JavaScript:
```javascript
surge({
  toggle: $ => e => {
    $.toggleBtn.value = $.ticking ? "Start" : "Stop"
    if($.ticking){
      $.ticking = clearInterval($.ticking)
    } else {
        $.ticking = setInterval(() => {
          $.time.value = (Number($.time.value) + 0.01).toFixed(2)
    },10)
    }
  },
  reset: $ => e =>{
    $.time.value = (0).toFixed(2)
  }
})
```

[See the code on CodePen](https://codepen.io/daz4126/pen/mdgoqOQ)

### Times Table Quiz

![Screenshot 2024-04-28 at 14 55 37](https://github.com/daz4126/surge/assets/16646/4608975f-2e3c-4d46-8f8b-70a4d18960f1)


#### HTML:
```html
<main data-surge>
  <div id="game">
  <h2>Times Tables</h2>
  <h2>Score: <span id="score" data-reactive-value=0></span></h2>
  <h1><span id="question" data-reactive-value=1></span>) <span id="x" data-reactive-value></span> &times; <span id="y" data-reactive-value></span> = <span id="answer"></span><span id="feedback" data-reactive-value></span></h1>
  <form data-action="check">
    <input id="userAnswer" />
  </form>
  </div>
  <div id="info" hidden=true>
  <h2 id="message" data-reactive-value></h2>
    <button data-action="newGame">Play Again</button>
  </div>
</main>
```

#### JavaScript:
```javascript
const NUMBER_OF_QUESTIONS = 5

const randomNumber = n => Math.ceil(Math.random()*n)
const generateQuestion = (x,y) => {
  x.value = randomNumber(12)
  y.value = randomNumber(12)
}

surge({
  connect: $ => {
    generateQuestion($.x,$.y)
  },
  check: $ => e => {
    e.preventDefault()
    $.answer.textContent = $.userAnswer.value
    if($.userAnswer.value == $.x.value * $.y.value){
      $.score.value ++
      $.feedback.value = "✅"
    } else {
      $.feedback.value = "❌"
    }
    setTimeout(() => {
      if($.question.value === NUMBER_OF_QUESTIONS){
        $.message.value = `Game Over. You Scored ${$.score.value}`
        $.game.hidden = true
        $.info.hidden = false
      } else {
        $.question.value ++
        generateQuestion($.x,$.y)
        $.userAnswer.value = ""
        $.answer.textContent = ""
        $.feedback.value = ""
    }
    },700)
  },
  newGame: $ => e => {
    generateQuestion($.x,$.y)
    $.question.value = 1
    $.score.value = 0
    $.game.hidden = false
    $.info.hidden = true
    $.answer.textContent = ""
    $.userAnswer.value = ""
    $.feedback.value = ""
  },
})
```

[See the code on CodePen](https://codepen.io/daz4126/pen/vYMPdPd)

### Fetching Data

![Screenshot 2024-04-28 at 15 04 23](https://github.com/daz4126/surge/assets/16646/040396c5-1c70-4268-b134-87f54976d73a)

#### HTML:
```html
<main data-surge>
  <div id="photos" data-url="https://picsum.photos/v2/list" class="grid"></div>
</main>
```

#### JavaScript:
```javascript
surge({
  connect: $ => {
    fetch($.photos.url)
      .then(response => response.ok ? response.json() 
                        : new Error(response.status))
      .then(data => $.photos.innerHTML = 
            data.map(photo => 
              `<img src=${`https://picsum.photos/id/${photo.id}/200`}>`
            ).join``)
      .catch(error => console.log(error))
  }
})
```

[See the code on CodePen](https://codepen.io/daz4126/pen/MWRRgLg)
