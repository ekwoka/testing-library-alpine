describe('Alpine testing library', () => {
  it('should test components', async () => {
    await render(`
      <div x-data="counter">
        <button @click="increment">Increment</button>
        <span x-text="count"></span>
        <datetime x-text="$now.toString()"></datetime>
      </div>
    `)
      .withComponent('counter', () => ({
        count: 0,
        increment() {
          this.count++;
        },
      }))
      .withMagic('now', () => new Date('2023-11-03'));
    expect($('datetime')).toHaveProperty(
      'textContent',
      'Fri Nov 03 2023 04:00:00 GMT+0400 (GMT+04:00)',
    );
    await click('button');
    await waitFor('span').toHaveText('1');
    expectData().toHaveProperty('count', 1);
    expect(getData().increment).toBeCalledTimes(1);
  });
});
