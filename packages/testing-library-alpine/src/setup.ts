afterEach(() => {
  const body = globalThis.window?.document.body;
  const Alpine = globalThis.Alpine;
  if (!Alpine || !body) return;
  Alpine.stopObservingMutations();
  Alpine.destroyTree(body);
  body.innerHTML = '';
});
