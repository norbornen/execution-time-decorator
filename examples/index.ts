(async () => {
  for (const f of ['legacy', 'main', 'logger']) {
    const m = (await import(`./${f}`).catch(console.error)) as unknown as {
      check: () => Promise<void>;
    };
    await m.check();
    console.log('-----------------------------------------------------------');
  }
})().catch(console.error);
