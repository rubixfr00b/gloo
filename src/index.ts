export type GlooContents = GlooElementProps | GlooScript;
export type GlooScript = ($element: Element) => GlooElementProps;
export type GlooOpts = {
  /**
   * Time in MS to re-evaluate the script
   */
  poll?: number;
};

export type GlooElementProps = Partial<Element> & {
  gloo?: GlooOpts;
}

const GLOO_SCRIPTS: Record<string, GlooScript> = {}; 

export function bond($element: Element, contents: GlooContents): void {
  const props = getPropsFromContents($element, contents);
  applyPropsToElement($element, props);

  if (props.gloo) {
    evaluateGlooProps($element, props.gloo, contents)
  }
}

export function getPropsFromContents($element: Element, contents: GlooContents): GlooElementProps {
  if (!(contents instanceof Function)) return contents;

  return contents($element);
}

export function applyPropsToElement($element: Element, props: GlooElementProps): void {
  const keys = Object.keys(props) as (keyof GlooElementProps)[];

  // TODO -- 'deep merge' the two objects
  keys.forEach(key => {
    if (key == 'gloo') return;
    if ($element[key] == props[key]) return;

    // TS throws an error here saying that we can't mutate certain readonly props.
    // We can just ignore that because if you try to do that, the browser will essentially
    // ignore the operation.
    // @ts-ignore
    $element[key] = props[key];
  });
}

export function evaluateGlooProps($element: Element, opts: GlooOpts, contents: GlooContents): void {
  if (opts.poll) {
    setTimeout(() => {
      bond($element, contents);
    }, opts.poll);
  }
}

export function evaluateScript($script: HTMLScriptElement): void {
  const scriptName = $script.getAttribute('data-gloo-src');
  
  let scriptSource = $script.innerHTML;
  let script: GlooScript | undefined;

  try {
    script = eval(scriptSource);
  } catch (err) {
    console.error('[Gloo] Failed to evaluate script source', err, $script);
    return;
  }

  if (!script) {
    console.error('[Gloo] Script source did not evaluate to any value. Did you mean to use `data-gloo-ref` to reference another source script?', $script);
    return;
  }

  if (scriptName) {
    if (GLOO_SCRIPTS[scriptName]) {
      console.error(`[Gloo] Two scripts cannot share the same name "${scriptName}"`, $script);
    } else {
      GLOO_SCRIPTS[scriptName] = script;
    }
  } else {
    if (!$script.parentElement) {
      console.error('[Gloo] Found script that is not a child of an element', $script);
      return;
    }

    bond($script.parentElement, script);
  }
}

export function evaluateRef($script: HTMLScriptElement): void {
  const scriptName = $script.getAttribute('data-gloo-ref');
  if (!scriptName) {
    console.error('[Gloo] Found ref that did not specify a data-gloo-ref attribute', $script);
    return;
  }

  const script = GLOO_SCRIPTS[scriptName];
  if (!script) {
    console.error('[Gloo] Ref specified script that does not exist', $script, scriptName);
    return;
  }

  if (!$script.parentElement) {
    console.error('[Gloo] Found ref that is not a child of an element', $script);
    return;
  }

  bond($script.parentElement, script);
}

export function evalGlooScripts(): void {
  const $glooScripts = getGlooSourceScripts();
  const $glooRefs = getGlooScriptReferences();

  $glooScripts.forEach($glooScript => {
    evaluateScript($glooScript);
  });

  $glooRefs.forEach($glooRef => {
    evaluateRef($glooRef);
  }); 
}

export function getGlooScriptReferences(): HTMLScriptElement[] {
  return Array.from(document.querySelectorAll('script[data-gloo-ref]'));
}

export function getGlooSourceScripts(): HTMLScriptElement[] {
  return Array.from(document.querySelectorAll('script[data-gloo-src], script[data-gloo]'));
}

evalGlooScripts();

export function deGloo(): void {
  for (const key in GLOO_SCRIPTS) {
    delete GLOO_SCRIPTS[key];
  }
} 

