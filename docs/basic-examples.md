# Basic script

This script will bind the current time to the `<h1>`'s `innerText`, and update it on a one-second interval:

```html
<h1>
  <script data-gloo>
    ({
      innerText: new Date().toLocaleTimeString(),
      gloo: {
        poll: 1000
      }
    })
  </script>
</h1>
```

# Re-use a script

You can make scripts reusable by specifying a string value to a `ref` attribute:

```html
<script data-gloo-src="clock">
  ({
    innerText: new Date().toLocaleTimeString(),
    gloo: {
      poll: 1000
    }
  })
</script>
```

Here's how to reference and apply it to another element:

```html
<h1>
  <script data-gloo-ref="clock"></script>
</h1>
```

Yep, you can use it more than once:

```html
<h1>
  <script data-gloo-ref="clock"></script>
</h1>

<h2>
  <script data-gloo-ref="clock"></script>
</h2>

<h3>
  <script data-gloo-ref="clock"></script>
</h3>
```

