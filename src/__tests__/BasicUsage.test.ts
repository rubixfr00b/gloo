import { deGloo, evalGlooScripts } from "..";

afterEach(() => {
  deGloo();
});

describe('Basic usage', (): void => {
  test("can bind to an element's innerText property", (): void => {
    document.body.innerHTML = `
      <h1>
        <script data-gloo>
          ({
            innerText: 'Testing 123'
          })
        </script>
      </h1>
    `;

    evalGlooScripts();
    
    const $h1 = document.querySelector('h1');
    if (!$h1) throw new Error('h1 element not present');

    expect($h1.innerText).toBe('Testing 123');
  });

  test('can create a source script and reference it', (): void => {
    document.body.innerHTML = `
      <h1>
        <script data-gloo-ref="test script"></script>
      </h1>

      <script data-gloo-src="test script">
        ({
          innerText: 'Testing 123'
        })
      </script>
    `;

    evalGlooScripts();
    
    const $h1 = document.querySelector('h1');
    if (!$h1) throw new Error('h1 element not present');

    expect($h1.innerText).toBe('Testing 123');
  });

  test('a source script can contain a function', (): void => {
    document.body.innerHTML = `
      <h1>
        <script data-gloo-ref="test script"></script>
      </h1>

      <script data-gloo-src="test script">
        (() => {
          return {
            innerText: 'Testing 123'
          }
        })
      </script>
    `;

    evalGlooScripts();
    
    const $h1 = document.querySelector('h1');
    if (!$h1) throw new Error('h1 element not present');

    expect($h1.innerText).toBe('Testing 123');
  });

  test('a source script can contain a function that accepts the element as an argument', (): void => {
    document.body.innerHTML = `
      <h1>
        <script data-gloo-ref="test script"></script>
      </h1>

      <script data-gloo-src="test script">
        (($element) => ({
          innerText: "Tag name: " + $element.tagName
        }))
      </script>
    `;
    
    evalGlooScripts();
    
    const $h1 = document.querySelector('h1');
    if (!$h1) throw new Error('h1 element not present');

    expect($h1.innerText).toBe('Tag name: H1');
  })
});
