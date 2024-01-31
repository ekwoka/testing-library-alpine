afterEach(() => {
  const body = globalThis.document?.body;
  const Alpine = globalThis.Alpine;
  if (!Alpine || !body) return;
  Alpine.stopObservingMutations();
  Alpine.destroyTree(body);
  body.innerHTML = '';
});
