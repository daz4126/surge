![Screenshot 2024-04-24 at 20 46 41](https://github.com/daz4126/surge/assets/16646/125e908c-5bcc-4819-ac27-17cff98770ba)

Surge is a tiny microframework that makes it easy to add reactivity to your html by sprinkling it with data- attriutes.

It has no dependencies and is so small (~0.5kb) you'll hardly know it's there!

# Example

Add data-surge, data-action and data-reactive-value attributes to the relevant elements in the HTML:

```html
<div data-surge>
  <h1>❤️ <span id="count" data-reactive-value=0></span></h1>
  <button data-action="increment">👍</button>
  <button data-action="decrement">👎</button>
</div>
```

Then define your actions in the JavaScript and pass them to the `surge` function:

```javascript
surge({
  increment: $ => e => $.count.value++,
  decrement: $ => e => $.count.value--
})
```
That's it!

You can see a live demo [on CodePen](https://codepen.io/daz4126/pen/YzMdbra).

Surge was inspired by the excellent Stimulus library.
